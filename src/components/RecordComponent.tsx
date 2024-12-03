// src/components/RecordComponent.tsx
import Lottie from "lottie-react";
import React, { useState, useEffect } from "react";
import RecordingGif from "../assets/animations/recording_animation.json";
import { Button } from "flowbite-react";

const RecordComponent: React.FC = () => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
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
            {formatTime(elapsedTime)}
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
