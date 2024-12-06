import { Button } from "flowbite-react";
import Lottie from "lottie-react";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import RecordingGif from "../assets/animations/recording_animation.json";
declare global {
  interface Window {
    SockJS: any;
    Stomp: any;
  }
}

let stompClient: any = null;
let audioContext: AudioContext | null = null;
let processor: ScriptProcessorNode | null = null;
let source: MediaStreamAudioSourceNode | null = null;
let audioStream: MediaStream | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function resampleBuffer(
  buffer: Float32Array,
  originalSampleRate: number,
  targetSampleRate: number,
): Float32Array {
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
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = accum / count;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

type Props = {
  classId: string;
  userId: string;
  className: string;
  serverUrl?: string; // 기본값으로 기존 URL 사용 가능
};
const serverUrl =
  "https://monthly-madge-choco-planner-59fb550a.koyeb.app/gs-guide-websocket";

export function Connect(
  setConnectedState: (connected: boolean) => void,
  setTranslatedMessages: React.Dispatch<React.SetStateAction<string[]>>,
) {
  const socket = new window.SockJS(serverUrl);
  console.log("WebSocket 연결 시도 중...");
  stompClient = window.Stomp.over(socket);
  stompClient.connect(
    {},
    function (frame: any) {
      setConnectedState(true);
      console.log("Connected: " + frame);
      stompClient.subscribe("/topic/translated", function (message: any) {
        const translatedMessage = message.body;
        setTranslatedMessages((prev) => [...prev, translatedMessage]);
      });
    },
    function (error: any) {
      console.error("WebSocket 연결 오류: ", error);
      alert("WebSocket 연결에 실패했습니다.");
    },
  );
}

export const WebSocketComponent: React.FC<Props> = ({
  classId,
  userId,
  className,
}) => {
  const serverUrl =
    "https://monthly-madge-choco-planner-59fb550a.koyeb.app/gs-guide-websocket";
  // const { userId, classId } = useParams();

  const [connected, setConnected] = useState(false);
  const [translatedMessages, setTranslatedMessages] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  // const [userId, setUserId] = useState("");
  // const [classId, setClassId] = useState("");

  // const [classContent, setClassContent] = useState("");

  function setConnectedState(newConnected: boolean) {
    setConnected(newConnected);
  }
  function connect() {
    const socket = new window.SockJS(serverUrl);
    console.log("WebSocket 연결 시도 중...");
    stompClient = window.Stomp.over(socket);
    stompClient.connect(
      {},
      function (frame: any) {
        setConnectedState(true);
        console.log("Connected: " + frame);
        stompClient.subscribe("/topic/translated", function (message: any) {
          const translatedMessage = message.body;
          setTranslatedMessages((prev) => [...prev, translatedMessage]);
        });
      },
      function (error: any) {
        console.error("WebSocket 연결 오류: ", error);
        alert("WebSocket 연결에 실패했습니다.");
      },
    );
  }

  function disconnect() {
    if (stompClient !== null) {
      stompClient.disconnect(() => {
        setConnectedState(false);
        console.log("Disconnected");
      });
    } else {
      setConnectedState(false);
      console.log("Disconnected");
    }
  }

  function sendAudioData(audioData: string, classId: string, userId: string) {
    if (stompClient && stompClient.connected) {
      stompClient.send(
        "/app/voice",
        {},
        JSON.stringify({
          audioData: audioData,
          classId: classId,
          userId: userId,
        }),
      );
    } else {
      console.warn(
        "WebSocket이 연결되지 않아 오디오 데이터를 보낼 수 없습니다.",
      );
    }
  }

  function startRecording() {
    if (!classId || !userId) {
      alert("수업 ID와 사용자 ID를 입력해주세요.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        source = audioContext.createMediaStreamSource(stream);

        processor = audioContext.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = async function (e) {
          if (!audioContext) return;
          const inputData = e.inputBuffer.getChannelData(0);
          const originalSampleRate = audioContext.sampleRate;
          const targetSampleRate = 16000; // OpenAI API 요구사항

          try {
            let resampledData = await resampleBuffer(
              inputData,
              originalSampleRate,
              targetSampleRate,
            );

            let pcmData = new Int16Array(resampledData.length);
            for (let i = 0; i < resampledData.length; i++) {
              let s = Math.max(-1, Math.min(1, resampledData[i]));
              pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
            }

            let uint8Array = new Uint8Array(pcmData.buffer);
            let base64data = arrayBufferToBase64(uint8Array);
            sendAudioData(base64data, classId, userId);
          } catch (err) {
            console.error("리샘플링 오류:", err);
          }
        };

        audioStream = stream;
        console.log("녹음 시작됨");
        setIsRecording(true);
      })
      .catch(function (err) {
        console.error("마이크 접근 오류:", err);
        alert("마이크 접근에 실패했습니다: " + err.message);
      });
  }

  function stopRecording() {
    if (processor) {
      processor.disconnect();
      processor = null;
    }
    if (source) {
      source.disconnect();
      source = null;
    }
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
    }

    console.log("녹음 중지됨");
    setIsRecording(false);
  }
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isRecording) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0); // 녹음이 멈추면 타이머를 0으로 초기화
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]); // isRecording 상태가 변경될 때마다 useEffect 실행

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      {/* <div>
        <button onClick={connect} disabled={connected}>
          Connect
        </button>
        <button onClick={disconnect} disabled={!connected}>
          Disconnect
        </button>
      </div> */}
      {/* 
      <div id="translatedMessages" className="mt-3">
        {translatedMessages.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </div> */}
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
                onClick={() => {
                  connect();
                  const checkConnection = setInterval(() => {
                    if (stompClient && stompClient.connected) {
                      clearInterval(checkConnection);
                      startRecording();
                    }
                  }, 100);
                }}
                disabled={connected || isRecording}
              >
                녹음 시작
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
                onClick={() => {
                  stopRecording();
                  const checkDisconnection = setInterval(() => {
                    if (!stompClient || !stompClient.connected) {
                      clearInterval(checkDisconnection);
                      disconnect();
                    }
                  }, 100);
                }}
                disabled={!isRecording}
              >
                녹음 종료
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* <div>
        <table>
          <thead>
            <tr>
              <th>Greetings</th>
            </tr>
          </thead>
          <tbody id="greetings">

          </tbody>
        </table>
      </div> */}
    </div>
  );
};
