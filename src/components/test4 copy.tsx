import React, { useState, useRef, useEffect } from "react";

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
  serverUrl?: string; // 기본값으로 기존 URL 사용 가능
};

function setConnectedState(newConnected: boolean) {
  setConnected(newConnected);
}

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
  serverUrl = "https://monthly-madge-choco-planner-59fb550a.koyeb.app/gs-guide-websocket",
}) => {
  const [connected, setConnected] = useState(false);
  const [translatedMessages, setTranslatedMessages] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const [userId, setUserId] = useState("");
  const [classId, setClassId] = useState("");
  const [className, setClassName] = useState("");
  const [classContent, setClassContent] = useState("");

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

  return (
    <div className="container">
      <div className="row">
        <h2>WebSocket Connection Test</h2>
        <button
          onClick={connect}
          className="btn btn-success"
          disabled={connected}
        >
          Connect
        </button>
        <button
          onClick={disconnect}
          className="btn btn-danger"
          disabled={!connected}
        >
          Disconnect
        </button>
      </div>
      <div className="row">
        <input
          type="text"
          id="name"
          placeholder="Enter your name"
          className="form-control"
          style={{ width: 300, display: "inline" }}
        />
        <button id="send" className="btn btn-primary">
          Send
        </button>
      </div>

      <h2>실시간 녹음 및 번역</h2>
      <div className="row">
        <label htmlFor="userId">사용자 ID:</label>
        <input
          type="text"
          id="userId"
          name="userId"
          className="form-control"
          style={{ width: 300, display: "inline" }}
          required
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      <div className="row">
        <label htmlFor="classId">수업 ID:</label>
        <input
          type="text"
          id="classId"
          name="classId"
          className="form-control"
          style={{ width: 300, display: "inline" }}
          required
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        />
      </div>

      <div className="row">
        <label htmlFor="className">수업 이름:</label>
        <input
          type="text"
          id="className"
          name="className"
          className="form-control"
          style={{ width: 300, display: "inline" }}
          required
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
      </div>

      <div className="row">
        <label htmlFor="classContent">수업 내용:</label>
        <textarea
          id="classContent"
          name="classContent"
          rows={4}
          className="form-control"
          required
          value={classContent}
          onChange={(e) => setClassContent(e.target.value)}
        ></textarea>
      </div>

      <button
        id="startRecording"
        className="btn btn-success"
        onClick={startRecording}
        disabled={!connected || isRecording}
      >
        녹음 시작
      </button>
      <button
        id="stopRecording"
        className="btn btn-danger"
        onClick={stopRecording}
        disabled={!isRecording}
      >
        녹음 중지
      </button>

      <div id="translatedMessages" className="mt-3">
        {translatedMessages.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </div>

      <div className="row mt-5">
        <table className="table-bordered table">
          <thead>
            <tr>
              <th>Greetings</th>
            </tr>
          </thead>
          <tbody id="greetings">
            {/* 여기서는 messages를 state로 관리할 수 있음. */}
          </tbody>
        </table>
      </div>
    </div>
  );
};
