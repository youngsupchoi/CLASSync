export interface IAudioRecorderService {
  startRecording: (
    onAudioProcess: (event: AudioProcessingEvent) => void,
    onError: (error: Error) => void,
  ) => void;
  stopRecording: () => void;
}
