import Stomp from "stompjs";
import { IWebSocketService, WebSocketMessage } from "../types/websocket";

class WebSocketService implements IWebSocketService {
  private stompClient: Stomp.Client | null = null;
  private connected = false;

  connect(
    url: string,
    onMessageReceived: (message: string) => void,
    onError: (error: any) => void,
  ): Promise<void> {
    const socket = new WebSocket(url);
    this.stompClient = Stomp.over(socket);

    return new Promise((resolve, reject) => {
      this.stompClient?.connect(
        {},
        (frame: any) => {
          this.connected = true;
          console.log("Connected:", frame);
          this.stompClient?.subscribe("/topic/translated", (message) => {
            onMessageReceived(message.body);
          });
          resolve();
        },
        (error: any) => {
          console.error("WebSocket 연결 오류:", error);
          this.connected = false;
          onError(error);
          reject(error);
        },
      );
    });
  }

  disconnect(): void {
    if (this.stompClient && this.connected) {
      this.stompClient.disconnect(() => {
        this.connected = false;
        console.log("Disconnected");
      });
    }
  }

  send(destination: string, payload: WebSocketMessage): void {
    if (this.stompClient && this.connected) {
      this.stompClient.send(destination, {}, JSON.stringify(payload));
    } else {
      console.warn("WebSocket이 연결되지 않아 메시지를 보낼 수 없습니다.");
    }
  }
}

export default new WebSocketService();
