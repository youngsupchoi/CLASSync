import { useRecoilState } from "recoil";
import { gptOpenStateAtom, noteDataAtom } from "../../recoil/noteDataAtom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Prism.js 스타일

const GPTSection = () => {
  const [noteData] = useRecoilState(noteDataAtom);
  const gptData = noteData.gptData || []; // gptData가 undefined인 경우 빈 배열로 처리
  const [openState, setOpenState] = useRecoilState(gptOpenStateAtom);

  useEffect(() => {
    Prism.highlightAll();
  }, [gptData, openState]); // gptData나 openState가 변경될 때마다 하이라이트 적용

  const processText = (text: any) => {
    const codeBlockRegex =
      /(import|export|const|let|var|function|return|if|else|switch|case|default|break|continue|while|for|try|catch|finally|throw|new|class|extends|constructor|super|this|typeof|instanceof|void|delete|typeof|instanceof|in|of)\s+/;

    const result = [];
    let isCodeBlock = false;
    let codeLines: string[] = [];

    // 줄바꿈을 위해 문장을 분리
    const sentences = text.split(/(?<=\.)\s/);

    sentences.forEach((sentence: any) => {
      // 코드 블럭이 있는지 확인
      if (codeBlockRegex.test(sentence)) {
        isCodeBlock = true;
        codeLines.push(sentence);
      } else {
        if (isCodeBlock) {
          result.push("```javascript\n" + codeLines.join("\n") + "\n```");
          codeLines = [];
          isCodeBlock = false;
        }
        result.push(sentence);
      }
    });

    if (isCodeBlock && codeLines.length > 0) {
      result.push("```javascript\n" + codeLines.join("\n") + "\n```");
    }

    return result.join("\n\n"); // 두 줄 줄바꿈 추가
  };

  const toggleAnswer = (index: any) => {
    setOpenState((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="fixed right-5 top-20 flex h-[85vh] w-1/4 flex-1 flex-col space-y-4 overflow-y-auto rounded-2xl bg-[#212121] shadow-lg custom-scrollbar">
      <div className="sticky flex items-center justify-between border-b-2 border-[#404040] bg-[#212121] p-6">
        <h2 className="font-bold text-white">ChatGPT</h2>
        <p className="text-sm font-medium text-gray-400">Your Chat Data</p>
      </div>
      {gptData.map((item, index) => (
        <div key={index} className="px-4">
          <div className="flex flex-col space-y-2 text-white">
            <div
              className="flex w-full cursor-pointer flex-col items-start justify-between rounded-md bg-[#2F2F2F] p-4 text-left"
              onClick={() => toggleAnswer(index)}
            >
              <div>Question</div>
              <pre className="w-[100%] custom-scrollbar">
                <code className="language-markup">
                  {processText(item.question)}
                </code>
              </pre>
              {openState.includes(index) ? (
                <div className="flex w-[100%] items-center justify-center py-2">
                  <FaChevronUp className="text-white" />
                </div>
              ) : (
                <div className="flex w-[100%] items-center justify-center py-2">
                  <FaChevronDown className="text-white" />
                </div>
              )}
            </div>
            {openState.includes(index) && (
              <div className="rounded-md bg-[#3F3F3F] p-4">
                <div>Answer</div>
                <pre className="w-[100%] custom-scrollbar">
                  <code className="language-js">
                    {processText(item.answer)}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GPTSection;
