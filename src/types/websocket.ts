export interface WebSocketMessage {
  audioData: string;
  classId: string;
  userId: string;
}

export interface IWebSocketService {
  connect: (
    url: string,
    onMessageReceived: (message: string) => void,
    onError: (error: any) => void,
  ) => Promise<void>;
  disconnect: () => void;
  send: (destination: string, payload: WebSocketMessage) => void;
}
