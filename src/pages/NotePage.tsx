import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { noteDataAtom, noteListAtom } from "../recoil/noteDataAtom";
import NotionSection from "../components/notePage/NotionSection";
import GPTSection from "../components/notePage/GPTSection";
import NotePageHeader from "../components/notePage/NotePageHeader";
import { useEffect } from "react";
import axios from "axios";

function extractPageId(notionLink: string): string | "" {
  const match = notionLink.match(/notion\.so\/([^?]+)/);
  return match ? match[1] : "";
}

export default function NotePage() {
  const { noteId } = useParams();

  const [noteList] = useRecoilState(noteListAtom);
  const [noteData, setNoteData] = useRecoilState(noteDataAtom);

  useEffect(() => {
    // noteId와 noteList의 id를 문자열로 변환하여 비교
    const note = noteList.find((n) => String(n.id) === String(noteId));
    if (note) {
      const pageId = note.notion_link ? extractPageId(note.notion_link) : "";

      console.log(pageId);
      setNoteData({
        id: note.id,
        title: note.title,
        conversation_id: note.conversation_id,
        created_at: note.created_at,
        notion_page_id: pageId,
        gptData: note.note_content ? JSON.parse(note.note_content) : null,
      });
    }
    console.log(noteList.find((n) => String(n.id) === String(noteId)));
    console.log(noteList, noteId);
  }, [noteId, setNoteData, noteList]);

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

  return (
    <div className="relative flex h-full min-h-screen flex-col">
      <NotePageHeader />
      <div className="flex flex-1">
        <div className="flex w-2/3">
          <NotionSection pageId={pageId} />
        </div>
        <GPTSection />
      </div>
    </div>
  );
}
