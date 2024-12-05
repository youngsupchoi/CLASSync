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
    const wsUrl = url.replace("https://", "wss://");
    console.log("WebSocket 연결 시도:", wsUrl);

    const socket = new WebSocket(wsUrl, ["v10.stomp", "v11.stomp"]);

    const connectionTimeout = setTimeout(() => {
      if (!this.connected) {
        socket.close();
        onError(new Error("Connection timeout"));
      }
    }, 5000);

    socket.onopen = (event) => {
      clearTimeout(connectionTimeout);
      console.log("WebSocket 연결 성공:", event);
    };

    socket.onerror = (event) => {
      console.error("WebSocket 에러 발생:", event);
    };

    socket.onclose = (event) => {
      console.log(
        "WebSocket 연결 종료. 코드:",
        event.code,
        "사유:",
        event.reason,
      );
    };

    this.stompClient = Stomp.over(socket);

    // STOMP 디버그 로그 활성화
    this.stompClient.debug = (str) => {
      console.log("STOMP Debug:", str);
    };

    return new Promise((resolve, reject) => {
      this.stompClient?.connect(
        {},
        (frame: any) => {
          this.connected = true;
          console.log("STOMP 연결 성공. Frame:", frame);
          this.stompClient?.subscribe("/topic/translated", (message) => {
            console.log("메시지 수신:", message);
            onMessageReceived(message.body);
          });
          resolve();
        },
        (error: any) => {
          console.error("STOMP 연결 오류:", {
            error,
            stompClient: this.stompClient,
            connected: this.connected,
          });
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

  sendAudioData(audioData: string, classId: string, userId: string): void {
    if (this.stompClient && this.connected) {
      this.stompClient.send(
        "/app/voice",
        {},
        JSON.stringify({
          audioData,
          classId,
          userId,
        }),
      );
    } else {
      console.warn(
        "WebSocket이 연결되지 않아 오디오 데이터를 보낼 수 없습니다.",
      );
    }
  }
}

export default new WebSocketService();
