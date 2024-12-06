import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { noteDataAtom, createNoteDataAtom } from "../recoil/noteDataAtom";
import NotionSection from "../components/notePage/NotionSection";

import NotePageHeader from "../components/notePage/NotePageHeader";
import { useEffect, useState } from "react";
import axios from "axios";
import NoteCreatePageHeader from "../components/header/NoteCreatePageHeader";
import SummarySection from "../components/SummarySection";
import WriteNoteComponent from "../components/WriteNoteComponent";
import { NotionLoadingComponent } from "../components/notePage/NotionLoadingComponent";
import RecordComponent from "../components/RecordComponent";
import { WebSocketComponent } from "../components/test4";

export default function NoteCreatePage() {
  const { classId = "1" } = useParams();

  const [noteData, setNoteData] = useRecoilState(noteDataAtom);
  const [createNoteData, setCreateNoteData] =
    useRecoilState(createNoteDataAtom);
  const [selectedTab, setSelectedTab] = useState("summary");
  useEffect(() => {
    const fetchMessages = async () => {
      if (!noteData.conversation_id) return;
      try {
        console.log(
          "Fetching messages for conversation_id:",
          noteData.conversation_id,
        );
        const response = await axios.get(
          `/conversation/messages/${noteData.conversation_id}`,
        );
        const formattedGptData = response.data.reduce(
          (acc: any, curr: any, index: any, array: any) => {
            if (index % 2 === 0) {
              acc.push({
                question: curr.message_content || "No question provided",
                answer:
                  array[index + 1]?.message_content || "No answer provided",
              });
            }
            return acc;
          },
          [],
        );

        setNoteData((prevData) => ({
          ...prevData,
          gptData: formattedGptData,
        }));
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [noteData.conversation_id, setNoteData]);
  const pageId = noteData.notion_page_id;

  // if (!note) {
  //   return <div>Note not found</div>;
  // }
  const userId = localStorage.getItem("CLASSync_uid") || "1";

  return (
    <div className="relative flex h-full min-h-screen flex-col">
      <NoteCreatePageHeader
        className={createNoteData.class_name}
        title={createNoteData.title}
      />
      <div className="flex flex-1">
        <div className="flex w-1/2 flex-col border border-gray-200">
          <div className="border-b border-gray-200  p-2">
            <u className="text-sm font-semibold text-gray-900">수업 스크립트</u>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <WebSocketComponent
              classId={classId}
              userId={userId}
              className={createNoteData.class_name}
            />
          </div>
        </div>
        <div className="flex w-1/2 flex-col border border-gray-200">
          <div>
            <div className="border-b border-gray-200  p-2">
              <span
                className={`cursor-pointer text-sm font-semibold ${
                  selectedTab === "summary"
                    ? "text-gray-900 underline"
                    : "text-gray-300"
                }`}
                onClick={() => setSelectedTab("summary")}
              >
                AI 요점정리
              </span>
              <span
                className={`ml-4 cursor-pointer text-sm font-semibold ${
                  selectedTab === "quiz"
                    ? "text-gray-900 underline"
                    : "text-gray-300"
                }`}
                onClick={() => setSelectedTab("quiz")}
              >
                AI 핵심문제
              </span>
            </div>
          </div>
          <NotionLoadingComponent created_at={createNoteData.created_at} />
        </div>
        {/* <SummarySection /> */}
      </div>
    </div>
  );
}
