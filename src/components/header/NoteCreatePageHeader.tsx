// src/components/NotePageHeader.tsx
// import { Link } from "react-router-dom";
// import { FaDownload } from "react-icons/fa";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { createNoteDataAtom } from "../../recoil/noteDataAtom";
import { isShareFeedbackModalOpenAtom } from "../../recoil/modalAtoms";

const NoteCreatePageHeader = () => {
  const noteData = useRecoilValue(createNoteDataAtom);
  const className = noteData.class_name;
  const title = noteData.title;
  const setIsShareFeedbackModalOpen = useSetRecoilState(
    isShareFeedbackModalOpenAtom,
  );
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-white p-4 py-6 text-sm shadow-md">
      <div className="flex space-x-2">
        <span className="text-gray-900">{className}</span>
        <span> /</span>
        <span className="text-gray-900">{title}</span>
      </div>
    </div>
  );
};

export default NoteCreatePageHeader;
