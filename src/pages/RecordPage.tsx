import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { noteDataAtom } from "../recoil/noteDataAtom";
import {
  quizAtom,
  recordAtom,
  summaryAtom,
  transcriptAtom,
} from "../recoil/recordDataAtoms";
import NotionSection from "../components/notePage/NotionSection";

import NotePageHeader from "../components/notePage/NotePageHeader";
import { useEffect, useState } from "react";
import axios from "axios";
import NoteCreatePageHeader from "../components/header/NoteCreatePageHeader";
import SummarySection from "../components/SummarySection";
import WriteNoteComponent from "../components/WriteNoteComponent";
import { NotionLoadingComponent } from "../components/notePage/NotionLoadingComponent";
import RecordComponent from "../components/RecordComponent";
import { Button } from "flowbite-react";

export default function RecordPage() {
  const { recordingId } = useParams();
  const [quiz, setQuiz] = useRecoilState(quizAtom);
  const [summary, setSummary] = useRecoilState(summaryAtom);
  const [noteData, setNoteData] = useRecoilState(noteDataAtom);
  const [recordData, setRecordData] = useRecoilState(recordAtom);
  const [selectedTab, setSelectedTab] = useState("summary");
  const [transcript, setTranscript] = useRecoilState(transcriptAtom);
  useEffect(() => {
    console.log("렌더링 시도:", { recordingId });
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

  return (
    <div className="relative flex h-full min-h-screen flex-col">
      <NoteCreatePageHeader
        className={recordData.classTitle}
        title={recordData.recordingTitle}
      />
      <div className="flex flex-1">
        <div className="flex h-[calc(100vh-64px)] w-1/2 flex-col border border-gray-200">
          <div className="border-b border-gray-200 p-2">
            <u className="text-sm font-semibold text-gray-900">수업 스크립트</u>
          </div>
          <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden">
            {transcript.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="rounded-lg bg-gray-50 p-8 text-center shadow-sm">
                  <p className="text-gray-600">
                    녹음된 내용이 데이터베이스에 저장중입니다
                    <br />
                    <span className="text-sm text-gray-500">
                      해당 작업은 최대 3분 이내에 완료됩니다
                    </span>
                    <br />
                    <span className="mt-2 inline-block text-sm font-medium text-blue-500">
                      새로고침을 진행해주세요
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              transcript.map((item, index) => (
                <div key={index} className="mb-8 flex flex-col">
                  <div className="mb-2 mr-4 w-16 rounded-md bg-gray-100 px-2 py-1 text-center text-sm text-gray-400">
                    {item.timeStamp}
                  </div>
                  <div className="flex-1 rounded-lg bg-white p-3 text-gray-800 shadow-sm transition-colors duration-200 hover:bg-gray-50">
                    {item.transcript}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex h-[calc(100vh-64px)] w-1/2 flex-col overflow-hidden border border-gray-200 ">
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
          {selectedTab === "summary" && summary.length === 0 ? (
            <NotionLoadingComponent created_at={recordData.recordedAt} />
          ) : selectedTab === "summary" ? (
            <div className="flex flex-1 flex-col overflow-y-auto p-4">
              {summary.map((item, index) => (
                <div key={index} className="mb-4">
                  <h2 className="mb-4 border-b-2 border-gray-200 pb-2 text-xl font-bold">
                    {`${index + 1}. ${item.title}`}
                  </h2>
                  {item.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-4">
                      <h3 className="mb-2 font-semibold">
                        {`${sectionIndex + 1}) ${section.subtitle}`}
                      </h3>
                      <ul className="list-inside list-disc">
                        {section.contents.map((content, contentIndex) => (
                          <li key={contentIndex}>{content}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : selectedTab === "quiz" && quiz.length === 0 ? (
            <NotionLoadingComponent created_at={recordData.recordedAt} />
          ) : (
            <div className="flex flex-1 flex-col overflow-y-auto p-4">
              {quiz.map((item, index) => (
                <div
                  key={index}
                  className="mb-4 flex flex-col gap-2 rounded border p-4"
                >
                  <div className="mb-2 font-semibold">Q. {item.quiz}</div>
                  <div className="flex flex-col items-start gap-2">
                    <Button
                      color="light"
                      size="xs"
                      onClick={() => {
                        const element = document.getElementById(
                          `answer-${index}`,
                        );
                        if (element) {
                          element.classList.toggle("hidden");
                        }
                      }}
                    >
                      답안 보기
                    </Button>
                    <div
                      id={`answer-${index}`}
                      className="hidden font-medium text-blue-700"
                    >
                      A. {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* <SummarySection /> */}
      </div>
    </div>
  );
}
