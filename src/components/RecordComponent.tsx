// src/components/RecordComponent.tsx
import Lottie from "lottie-react";
import React, { useState, useEffect, useRef } from "react";
import RecordingGif from "../assets/animations/recording_animation.json";
import { Button } from "flowbite-react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

interface AudioState {
  context: AudioContext | null;
  processor: ScriptProcessorNode | null;
  source: MediaStreamAudioSourceNode | null;
  stream: MediaStream | null;
}

const RecordComponent: React.FC = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const stompClientRef = useRef<Client | null>(null);
  const audioStateRef = useRef<AudioState>({
    context: null,
    processor: null,
    source: null,
    stream: null,
  });

  // Base64 인코딩 함수
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Resample 함수
  const resampleBuffer = (
    buffer: Float32Array,
    originalSampleRate: number,
    targetSampleRate: number,
  ): Float32Array => {
    if (originalSampleRate === targetSampleRate) {
      return buffer;
    }
    const sampleRateRatio = originalSampleRate / targetSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0,
        count = 0;
      for (
        let i = offsetBuffer;
        i < nextOffsetBuffer && i < buffer.length;
        i++
      ) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  };

  // WebSocket 연결
  const connect = () => {
    try {
      console.log("웹소켓 연결 시도...");

      // 기존 연결 정리
      if (stompClientRef.current?.active) {
        console.log("기존 연결 정리");
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }

      const socket = new SockJS(
        "https://monthly-madge-choco-planner-59fb550a.koyeb.app/gs-guide-websocket",
        null,
        {
          transports: ["websocket"],
          timeout: 30000, // 타임아웃 증가
        },
      );

      const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log("STOMP Debug:", str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectionTimeout: 30000, // 연결 타임아웃 추가
        onConnect: () => {
          console.log("STOMP 연결 성공!");
          setIsConnected(true);
          try {
            client.subscribe("/topic/translated", (message) => {
              console.log("메시지 수신:", message.body);
            });
          } catch (subError) {
            console.error("구독 에러:", subError);
          }
        },
        onDisconnect: () => {
          console.log("STOMP 연결 해제됨");
          setIsConnected(false);
        },
        onStompError: (frame) => {
          console.error("STOMP 에러:", frame);
        },
        onWebSocketClose: () => {
          console.log("WebSocket 연결 종료");
        },
        onWebSocketError: (event) => {
          console.error("WebSocket 에러:", event);
        },
      });

      stompClientRef.current = client;
      client.activate();
    } catch (error) {
      console.error("연결 중 에러 발생:", error);
    }
  };

  // 오디오 데이터 전송
  const sendAudioData = (
    audioData: string,
    classId: string,
    userId: string,
  ) => {
    if (stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: "/app/voice",
        body: JSON.stringify({
          audioData,
          classId,
          userId,
        }),
      });
    }
  };

  // 녹음 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(context.destination);

      processor.onaudioprocess = async (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const resampledData = resampleBuffer(
          inputData,
          context.sampleRate,
          16000,
        );

        // PCM 변환
        const pcmData = new Int16Array(resampledData.length);
        for (let i = 0; i < resampledData.length; i++) {
          const s = Math.max(-1, Math.min(1, resampledData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        const uint8Array = new Uint8Array(pcmData.buffer);
        const base64data = arrayBufferToBase64(uint8Array);

        // 임시 ID값 설정
        sendAudioData(base64data, "class123", "user123");
      };

      audioStateRef.current = { context, processor, source, stream };
      setIsRecording(true);
    } catch (err) {
      console.error("마이크 접근 오류:", err);
      alert("마이크 접근에 실패했습니다.");
    }
  };

  // 녹음 중지
  const stopRecording = () => {
    const { processor, source, context, stream } = audioStateRef.current;

    if (processor) processor.disconnect();
    if (source) source.disconnect();
    if (context) context.close();
    if (stream) stream.getTracks().forEach((track) => track.stop());

    audioStateRef.current = {
      context: null,
      processor: null,
      source: null,
      stream: null,
    };
    setIsRecording(false);
  };

  useEffect(() => {
    connect();

    return () => {
      if (stompClientRef.current?.active) {
        stompClientRef.current.deactivate();
      }
      stopRecording();
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

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
              onClick={stopRecording}
              theme={{
                outline: {
                  color: {
                    light: "border-gray-300 hover:border-gray-400",
                  },
                },
              }}
            >
              녹음 소
            </Button>
            <Button
              color="light"
              pill
              outline
              size="xs"
              onClick={isRecording ? stopRecording : startRecording}
              theme={{
                outline: {
                  color: {
                    light: "border-gray-300 hover:border-gray-400",
                  },
                },
              }}
            >
              {isRecording ? "녹음 종료" : "녹음 시작"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordComponent;
