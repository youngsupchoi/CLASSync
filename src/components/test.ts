import SockJS from "sockjs-client";
import Stomp from "stompjs";

interface AudioMessage {
  audioData: string;
  classId: string;
  userId: string;
}

export class AudioService {
  private stompClient: any = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private audioStream: MediaStream | null = null;
  private onTranslatedMessage?: (message: string) => void;
  private isConnecting: boolean = false;
  private isConnected: boolean = false;

  // Base64 인코딩 함수
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // WebSocket 연결
  public async connect(
    serverUrl: string,
    onConnectionChange?: (connected: boolean) => void,
  ): Promise<void> {
    if (this.isConnecting || this.isConnected) {
      console.log("이미 연결 중이거나 연결된 상태입니다.");
      return;
    }

    this.isConnecting = true;
    console.log("WebSocket 연결 시도 중...");

    const socket = new SockJS(serverUrl);
    this.stompClient = Stomp.over(socket);

    return new Promise((resolve, reject) => {
      this.stompClient.connect(
        {},
        (frame: any) => {
          console.log("Connected:", frame);
          this.isConnected = true;
          this.isConnecting = false;
          onConnectionChange?.(true);

          this.stompClient.subscribe("/topic/translated", (message: any) => {
            this.onTranslatedMessage?.(message.body);
          });

          resolve();
        },
        (error: any) => {
          console.error("WebSocket 연결 오류:", error);
          this.isConnecting = false;
          this.isConnected = false;
          onConnectionChange?.(false);
          reject(error);
        },
      );
    });
  }

  // WebSocket 연결 해제
  public disconnect(): void {
    console.log("Disconnect 호출됨. 연결 상태:", this.isConnected);

    if (this.stompClient && this.isConnected) {
      try {
        this.stompClient.disconnect(() => {
          console.log("정상적으로 연결 해제됨");
          this.isConnected = false;
        });
      } catch (error) {
        console.error("연 해제 중 오류 발생:", error);
      }
    } else {
      console.log("연결되지 않은 상태이므로 연결 해제를 건너뜁니다.");
    }

    this.stompClient = null;
  }

  // 오디오 데이터 전송
  private sendAudioData(
    audioData: string,
    classId: string,
    userId: string,
  ): void {
    if (this.stompClient?.connected) {
      const message: AudioMessage = { audioData, classId, userId };
      this.stompClient.send("/app/voice", {}, JSON.stringify(message));
    } else {
      console.warn(
        "WebSocket이 연결되지 않아 오디오 데이터를 보낼 수 없습니다.",
      );
    }
  }

  // 녹음 시작
  public async startRecording(classId: string, userId: string): Promise<void> {
    if (!this.isConnected) {
      console.warn(
        "WebSocket이 연결되지 않았습니다. 녹음을 시작할 수 없습니다.",
      );
      return;
    }

    if (!classId || !userId) {
      throw new Error("수업 ID와 사용자 ID가 필요합니다.");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      this.processor.onaudioprocess = async (e) => {
        if (!this.isConnected) {
          console.warn(
            "WebSocket이 연결되지 않아 오디오 데이터를 보낼 수 없습니다.",
          );
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);
        const originalSampleRate = this.audioContext!.sampleRate;
        const targetSampleRate = 16000;

        try {
          const resampledData = await this.resampleBuffer(
            inputData,
            originalSampleRate,
            targetSampleRate,
          );

          const pcmData = new Int16Array(resampledData.length);
          for (let i = 0; i < resampledData.length; i++) {
            const s = Math.max(-1, Math.min(1, resampledData[i]));
            pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }

          const uint8Array = new Uint8Array(pcmData.buffer);
          const base64data = this.arrayBufferToBase64(uint8Array);

          this.sendAudioData(base64data, classId, userId);
        } catch (err) {
          console.error("리샘플링 오류:", err);
        }
      };

      this.audioStream = stream;
      console.log("녹음 시작됨");
    } catch (err) {
      console.error("마이크 접근 오류:", err);
      throw err;
    }
  }

  // 녹음 중지
  public stopRecording(): void {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => track.stop());
      this.audioStream = null;
    }
    console.log("녹음 중지됨");
  }

  // 번역된 메시지 콜백 설정
  public setTranslationCallback(callback: (message: string) => void): void {
    this.onTranslatedMessage = callback;
  }

  private resampleBuffer(
    buffer: Float32Array,
    originalSampleRate: number,
    targetSampleRate: number,
  ): Float32Array {
    if (originalSampleRate === targetSampleRate) {
      return buffer;
    }

    const sampleRateRatio = originalSampleRate / targetSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0,
        count = 0;
      for (
        let i = offsetBuffer;
        i < nextOffsetBuffer && i < buffer.length;
        i++
      ) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }
}
