// src/components/NotePageHeader.tsx
// import { Link } from "react-router-dom";
// import { FaDownload } from "react-icons/fa";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { noteDataAtom } from "../../recoil/noteDataAtom";
import { isShareFeedbackModalOpenAtom } from "../../recoil/modalAtoms";

const NotePageHeader = () => {
  const noteData = useRecoilValue(noteDataAtom);
  const title = noteData.title;
  const setIsShareFeedbackModalOpen = useSetRecoilState(
    isShareFeedbackModalOpenAtom,
  );
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-white p-4 text-sm shadow-md">
      <div className="flex space-x-2">
        <span className="text-gray-900">📄 My knowledge</span>
        <span> /</span>
        <span className="text-gray-900">{title}</span>
      </div>
      <button
        onClick={() => setIsShareFeedbackModalOpen(true)}
        className="flex items-center rounded-md bg-lime-400 p-2 px-4 text-black hover:bg-lime-500"
      >
        {/* <FaDownload className="mr-2" /> */}
        Share your feedback
      </button>
    </div>
  );
};

export default NotePageHeader;
