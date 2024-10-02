// src/components/modals/ExamplesModal.tsx

import { Modal } from "flowbite-react";
import { useRecoilState } from "recoil";
import {
  examplesAtom,
  isExamplesModalOpenAtom,
} from "../../recoil/exampleModalAtoms";

export default function ExamplesModal() {
  const [isOpen, setIsOpen] = useRecoilState(isExamplesModalOpenAtom);
  const [examples] = useRecoilState(examplesAtom);

  return (
    <Modal show={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Header>Example Outputs</Modal.Header>
      <Modal.Body>
        <ul>
          {examples.map((example, index) => (
            <li key={index} className="mb-6">
              <a href={example.url} target="_blank" rel="noopener noreferrer">
                <h3 className="mb-2 text-xl font-semibold">{example.title}</h3>
                <div className="mt-2 flex flex-wrap">
                  {example.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-sm font-semibold text-blue-800"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Modal.Body>
    </Modal>
  );
}
