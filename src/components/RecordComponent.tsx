// src/components/RecordComponent.tsx
import React, { useEffect } from "react";
import { AudioService } from "../components/test"; // AudioService 경로에 맞게 수정
import Lottie from "lottie-react";
import RecordingGif from "../assets/animations/recording_animation.json";
import { Button } from "flowbite-react";
import { WS_URL } from "../config/websocket";

const RecordComponent: React.FC = () => {
  const audioService = new AudioService();

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordComponent;
