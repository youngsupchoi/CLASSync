// components/TutorialModal.tsx
import { useRecoilState } from "recoil";
import {
  isTutorialModalOpenAtom,
  tutorialModalContentAtom,
} from "../../recoil/modalAtoms";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import TutorialCarousel from "./TutorialCarousel";

export default function TutorialModal() {
  const [isModalOpen, setIsModalOpen] = useRecoilState(isTutorialModalOpenAtom);
  const [modalContent] = useRecoilState(tutorialModalContentAtom);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-11/12 max-w-2xl rounded-lg bg-white p-8">
        <button
          className="absolute right-3 top-3 text-2xl"
          onClick={() => setIsModalOpen(false)}
        >
          <AiOutlineClose />
        </button>
        <h2 className="mb-4 text-2xl font-extrabold text-red-500">
          Invalid Link
        </h2>
        <p>{modalContent}</p>
        <button
          className="mt-4 text-gray-400"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? "Hide Details" : "Show Details"}
        </button>
        {isCollapsed && (
          <div className="mt-4">
            <TutorialCarousel />
          </div>
        )}
      </div>
    </div>
  );
}
