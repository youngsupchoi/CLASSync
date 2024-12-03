import { IAudioRecorderService } from "../types/audio";

class AudioRecorderService implements IAudioRecorderService {
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private audioStream: MediaStream | null = null;

  async startRecording(
    onAudioProcess: (event: AudioProcessingEvent) => void,
    onError: (error: Error) => void,
  ): Promise<void> {
    try {
      // 기존 녹음 세션이 있다면 정리
      if (this.audioContext) {
        await this.stopRecording();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = onAudioProcess;

      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      this.audioStream = stream;
      console.log("Recording started");
    } catch (err) {
      console.error("Microphone access error:", err);
      onError(err instanceof Error ? err : new Error(String(err)));
    }
  }

  async stopRecording(): Promise<void> {
    try {
      if (this.processor) {
        this.processor.disconnect();
        this.processor = null;
      }

      if (this.source) {
        this.source.disconnect();
        this.source = null;
      }

      if (this.audioContext) {
        await this.audioContext.close();
        this.audioContext = null;
      }

      if (this.audioStream) {
        this.audioStream.getTracks().forEach((track) => track.stop());
        this.audioStream = null;
      }

      console.log("Recording stopped");
    } catch (err) {
      console.error("Error stopping recording:", err);
    }
  }
}

// 클래스로 export하여 테스트와 유연성 확보
export default AudioRecorderService;
