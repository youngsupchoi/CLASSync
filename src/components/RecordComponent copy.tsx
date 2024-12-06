// src/components/RecordComponent.tsx
import React, { useEffect, useRef } from "react";
import { AudioService } from "../components/test"; // AudioService 경로에 맞게 수정
import { WebSocketService } from "../components/test"; // WebSocketService 가져오기
import Lottie from "lottie-react";
import RecordingGif from "../assets/animations/recording_animation.json";
import { Button } from "flowbite-react";
import { WS_URL } from "../config/websocket";
import { useWebSocket } from "./test"; // 새로운 훅 import
import { WebSocketTest } from "./test2";
import { WebSocketComponent } from "./test3";

const RecordComponent: React.FC = () => {
  const audioService = useRef(new AudioService()).current;
  const webSocketService = useRef(new WebSocketService()).current; // WebSocketService 인스턴스 생성
  const { connect, disconnect, isConnected } = useWebSocket(); // 새로운 훅 사용

  useEffect(() => {
    const classId = "class123";
    const userId = "user456";
    let isComponentMounted = true;

    const handleConnectionChange = (connected: boolean) => {
      if (isComponentMounted) {
        console.log("WebSocket 연결 상태:", connected);
      }
    };

    const handleTranslatedMessage = (message: string) => {
      if (isComponentMounted) {
        console.log("번역된 메시지:", message);
      }
    };

    audioService.setTranslationCallback(handleTranslatedMessage);

    audioService
      .connect(WS_URL, handleConnectionChange)
      .then(() => {
        if (isComponentMounted) {
          return audioService.startRecording(classId, userId);
        }
      })
      .catch((error) => {
        if (isComponentMounted) {
          console.error("오류 발생:", error);
        }
      });

    return () => {
      isComponentMounted = false;
      audioService.stopRecording();
      audioService.disconnect();
    };
  }, []);

  // WebSocket 연결 시도 함수
  const handleWebSocketTest = async () => {
    try {
      await webSocketService.testConnection(WS_URL);
      console.log("WebSocket 연결 테스트 성공");
    } catch (error) {
      console.error("WebSocket 연결 테스트 실패:", error);
    }
  };

  // 새로운 웹소켓 테스트 함수
  const handleWebSocketTest2 = async () => {
    try {
      await connect(
        "https://monthly-madge-choco-planner-59fb550a.koyeb.app/gs-guide-websocket",
      );
      console.log("WebSocket 연결 테스트2 성공");
    } catch (error) {
      console.error("WebSocket 연결 테스트2 실패:", error);
    }
  };

  return (
    <div className="flex flex-row items-center self-center">
      <Lottie
        style={{ width: "80px", height: "80px" }}
        animationData={RecordingGif}
        loop={false}
        autoplay={true}
      />
      <div className="flex flex-col">
        <div className="text-sm font-semibold text-gray-900">
          수업을 녹음중입니다.
        </div>
        <div className="flex flex-row items-center rounded-lg bg-gray-100 p-2">
          <div className="mr-4 w-14 text-sm font-semibold text-gray-900">
            {/* 녹음 시간 표시 로직 추가 가능 */}
          </div>
          <div className="flex flex-row">
            <Button
              className="mr-2"
              color="light"
              pill
              size="xs"
              theme={{
                outline: {
                  color: {
                    light: "border-gray-300 hover:border-gray-400",
                  },
                },
              }}
              onClick={() => audioService.stopRecording()}
            >
              녹음 취소
            </Button>
            <Button
              color="light"
              pill
              outline
              size="xs"
              theme={{
                outline: {
                  color: {
                    light: "border-gray-300 hover:border-gray-400",
                  },
                },
              }}
              onClick={() => audioService.disconnect()}
            >
              녹음 종료
            </Button>
            {/* WebSocket 연결 테스트 버튼 추가 */}
            {/* <Button
              color="light"
              pill
              outline
              size="xs"
              theme={{
                outline: {
                  color: {
                    light: "border-gray-300 hover:border-gray-400",
                  },
                },
              }}
              onClick={handleWebSocketTest}
            >
              WebSocket 연결 테스트
            </Button> */}
            {/* 새로운 테스트 버튼 추가 */}
            {/* <Button
              color="light"
              pill
              outline
              size="xs"
              theme={{
                outline: {
                  color: {
                    light: "border-gray-300 hover:border-gray-400",
                  },
                },
              }}
              onClick={isConnected ? disconnect : handleWebSocketTest2}
            >
              {isConnected ? "연결 해제2" : "WebSocket 연결 테스트2"}
            </Button> */}
            {/* <WebSocketTest /> */}
            <WebSocketComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordComponent;
