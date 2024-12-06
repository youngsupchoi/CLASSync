import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useState, useCallback } from "react";

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
        console.error("연  중 오류 발생:", error);
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

export class WebSocketService {
  private stompClient: any = null;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private readonly maxReconnectAttempts: number = 5;
  private readonly reconnectDelay: number = 2000;

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
        console.error("연  중 오류 발생:", error);
      }
    } else {
      console.log("연결되지 않은 상태이므로 연결 해제를 건너뜁니다.");
    }

    this.stompClient = null;
  }

  // 번역된 메시지 콜백 설정
  public setTranslationCallback(callback: (message: string) => void): void {
    this.onTranslatedMessage = callback;
  }

  // testConnection ���서드 추가
  public async testConnection(serverUrl: string): Promise<boolean> {
    console.log("WebSocket 연결 테스트 시작...");

    // SockJS 옵션 추가
    const sockjsOptions = {
      transports: ["websocket", "xhr-streaming", "xhr-polling"],
      debug: true,
    };

    const socket = new SockJS(serverUrl, null, sockjsOptions);

    // SockJS 이벤트 리스너 추가
    socket.onopen = () => {
      console.log("SockJS 연결 열림");
    };

    socket.onclose = (event) => {
      console.log("SockJS 연결 닫힘:", event);
    };

    socket.onerror = (error) => {
      console.error("SockJS 에러:", error);
    };

    this.stompClient = Stomp.over(socket);

    // STOMP 디버그 로그 활성화
    this.stompClient.debug = (str: string) => {
      console.log("STOMP 디버그:", str);
    };

    return new Promise((resolve, reject) => {
      const headers = {
        Origin: "https://monthly-madge-choco-planner-59fb550a.koyeb.app",
        "Sec-WebSocket-Version": "13",
      };
      console.log("연결 시도 중... Headers:", headers);
      console.log("서버 URL:", serverUrl);

      this.stompClient.connect(
        headers,
        (frame: any) => {
          console.log("연결 성공. Frame:", frame);
          console.log("현재 연결 상태:", this.stompClient.connected);
          this.isConnected = true;
          resolve(true);
        },
        (error: any) => {
          console.error("연결 실패. Error:", error);
          console.error("연결 실패 시 상태:", {
            readyState: socket.readyState,
            url: socket.url,
            protocol: socket.protocol,
          });
          this.isConnected = false;
          reject(error);
        },
      );
    });
  }
}

interface UseWebSocketReturn {
  connect: (serverUrl: string) => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  stompClient: Stomp.Client | null;
  connectionStatus: string;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("disconnected");

  const checkNetwork = async (url: string) => {
    console.log("=== 네트워크 연결 테스트 시작 ===");
    try {
      // 1. 서버 연결 가능 여부
      console.log("1. 서버 연결 테스트 중...");
      const pingResponse = await fetch(url);
      console.log("서버 응답 상태:", pingResponse.status);

      // 2. CORS 헤더 확인
      console.log("2. CORS 헤더 확인:");
      console.log({
        "Access-Control-Allow-Origin": pingResponse.headers.get(
          "Access-Control-Allow-Origin",
        ),
        "Access-Control-Allow-Methods": pingResponse.headers.get(
          "Access-Control-Allow-Methods",
        ),
        "Access-Control-Allow-Headers": pingResponse.headers.get(
          "Access-Control-Allow-Headers",
        ),
      });

      // 3. WebSocket 지원 확인
      console.log("3. WebSocket 지원 확인:");
      console.log("WebSocket 지원 여부:", "WebSocket" in window);

      return true;
    } catch (error) {
      console.error("네트워크 테스트 실패:", error);
      return false;
    }
  };

  const checkSocketInfo = async (url: string) => {
    console.log("=== SockJS INFO 요청 테스트 시작 ===");
    try {
      const infoUrl = `${url}/info`;
      console.log("INFO 요청 URL:", infoUrl);

      const infoResponse = await fetch(infoUrl);
      console.log("INFO 응답:", {
        status: infoResponse.status,
        headers: Object.fromEntries(infoResponse.headers.entries()),
        body: await infoResponse.text(),
      });

      return true;
    } catch (error) {
      console.error("INFO 요청 실패:", error);
      return false;
    }
  };

  const connect = useCallback(async (serverUrl: string): Promise<void> => {
    setConnectionStatus("connecting");
    console.log("\n=== WebSocket 연결 프로세스 시작 ===");
    console.log("대상 서버 URL:", serverUrl);

    try {
      // 1단계: 네트워크 테스트
      const networkOk = await checkNetwork(serverUrl);
      if (!networkOk) {
        throw new Error("네트워크 테스트 실패");
      }

      // 2단계: SockJS INFO 요청
      const infoOk = await checkSocketInfo(`${serverUrl}`);
      if (!infoOk) {
        throw new Error("SockJS INFO 요청 실패");
      }

      // 3단계: SockJS 연결
      console.log("\n=== SockJS 연결 시작 ===");
      const socket = new SockJS(`${serverUrl}`, null, {
        debug: true,
        transports: ["websocket", "xhr-streaming", "xhr-polling"],
      });

      socket.onopen = (event) => {
        console.log("SockJS Open:", {
          event,
          protocol: socket.protocol,
          state: socket.readyState,
        });
      };

      socket.onclose = (event) => {
        console.log("SockJS Close:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
      };

      // 4단계: STOMP 연결
      console.log("\n=== STOMP 연결 시작 ===");
      const stomp = Stomp.over(socket);
      stomp.debug = (str) => {
        console.log("STOMP Debug:", str);
      };

      return new Promise((resolve, reject) => {
        stomp.connect(
          {
            "heart-beat": "10000,10000",
            "accept-version": "1.1,1.0",
          },
          (frame) => {
            console.log("=== STOMP 연결 성공 ===");
            console.log("연결 프레임:", frame);
            setStompClient(stomp);
            setIsConnected(true);
            setConnectionStatus("connected");
            resolve();
          },
          (error) => {
            console.error("=== STOMP 연결 실패 ===");
            console.error("에러 상세:", error);
            setConnectionStatus("failed");
            reject(error);
          },
        );
      });
    } catch (error) {
      console.error("=== 연결 프로세스 실패 ===");
      console.error("최종 에러:", error);
      setConnectionStatus("error");
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    if (stompClient && isConnected) {
      console.log("=== 연결 해제 시작 ===");
      try {
        stompClient.disconnect(() => {
          console.log("정상적으로 연결 해제됨");
          setIsConnected(false);
          setStompClient(null);
          setConnectionStatus("disconnected");
        });
      } catch (error) {
        console.error("연결 해제 중 오류:", error);
      }
    }
  }, [stompClient, isConnected]);

  return {
    connect,
    disconnect,
    isConnected,
    stompClient,
    connectionStatus,
  };
};
