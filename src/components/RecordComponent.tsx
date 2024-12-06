// src/components/RecordComponent.tsx
import React, { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import RecordingGif from "../assets/animations/recording_animation.json";
import { Button } from "flowbite-react";
import { WS_URL } from "../config/websocket";
import { WebSocketComponent } from "./test4";

const RecordComponent: React.FC = () => {
  return (
    <div className="flex flex-row items-center self-center">
      <WebSocketComponent />
      {/* <Lottie
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
            <WebSocketComponent />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default RecordComponent;
