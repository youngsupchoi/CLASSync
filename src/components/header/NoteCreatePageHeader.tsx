// src/components/NotePageHeader.tsx
// import { Link } from "react-router-dom";
// import { FaDownload } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import { isShareFeedbackModalOpenAtom } from "../../recoil/modalAtoms";

const NoteCreatePageHeader = ({
  className,
  title,
  onClick,
}: {
  className: string;
  title: string;
  onClick?: () => void;
}) => {
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
      {onClick && (
        <button
          onClick={onClick}
          className="flex items-center rounded-md bg-lime-400 p-2 px-4 text-black hover:bg-lime-500"
        >
          AI Generate
        </button>
      )}
    </div>
  );
};

export default NoteCreatePageHeader;
