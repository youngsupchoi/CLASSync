import React, { useState } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

let stompClient: Client | null = null;

export const WebSocketTest: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [messageToSend, setMessageToSend] = useState("Hello from client!");

  const connectWebSocket = () => {
    // SockJS 객체를 이용해 STOMP Client 생성
    stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(
          "https://monthly-madge-choco-planner-59fb550a.koyeb.app/gs-guide-websocket",
        ),
      debug: (str) => {
        console.log(str);
      },
      onConnect: (frame) => {
        console.log("Connected: " + frame);
        setConnected(true);
        // 구독 예제
        stompClient?.subscribe("/topic/greetings", (message: IMessage) => {
          console.log("Received greeting:", message.body);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
      onWebSocketClose: (evt) => {
        console.log("WebSocket Closed: ", evt);
        setConnected(false);
      },
    });

    stompClient.activate(); // 연결 시작
  };

  const disconnectWebSocket = () => {
    if (stompClient && stompClient.active) {
      stompClient.deactivate();
    }
    setConnected(false);
  };

  const sendMessage = () => {
    if (stompClient && connected) {
      stompClient.publish({
        destination: "/app/hello",
        body: JSON.stringify({ name: "User", content: messageToSend }),
      });
      console.log("Message sent:", messageToSend);
    } else {
      console.warn("WebSocket is not connected.");
    }
  };

  return (
    <div>
      <h1>WebSocket Test</h1>
      <div>
        <button onClick={connectWebSocket} disabled={connected}>
          Connect
        </button>
        <button onClick={disconnectWebSocket} disabled={!connected}>
          Disconnect
        </button>
      </div>
      <div>
        <input
          type="text"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
          placeholder="Message to send"
        />
        <button onClick={sendMessage} disabled={!connected}>
          Send Message
        </button>
      </div>
    </div>
  );
};
