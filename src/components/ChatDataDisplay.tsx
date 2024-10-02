// src/components/ChatDataDisplay.tsx

import { useRecoilValue } from "recoil";
import { urlSearchAtom } from "../recoil/urlSearchAtom";

export default function ChatDataDisplay() {
  const chatData = useRecoilValue(urlSearchAtom);

  if (!chatData) {
    return <div>No chat data available.</div>;
  }

  return (
    <div className="mt-8 rounded-lg bg-white p-4 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Chat Data</h2>
      <p>
        <strong>Chat URL:</strong> {chatData.chatUrl}
      </p>
      <div className="mt-4">
        {chatData.data && chatData.data.length > 0 ? (
          chatData.data.map((entry, index) => (
            <div key={index} className="mb-2">
              <p>
                <strong>Question:</strong> {entry.question}
              </p>
              <p>
                <strong>Answer:</strong> {entry.answer}
              </p>
            </div>
          ))
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
}
