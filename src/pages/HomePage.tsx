//src/pages/HomePage.tsx

import { Button } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import backgroundImage from "../assets/images/landingBackgroundImage.png";
import { useRecoilState } from "recoil";
import {
  isSignInModalOpenAtom,
  isTutorialModalOpenAtom,
  tutorialModalContentAtom,
} from "../recoil/modalAtoms";
import { isSignedInAtom } from "../recoil/IsSignedInAtom";
import { useEffect, useRef, useState } from "react";
import { urlSearchAtom } from "../recoil/urlSearchAtom";
import { createUserNote } from "../api/createNoteApi";
import { userInfoAtom } from "../recoil/userInfoAtom";
import TutorialModal from "../components/modals/TutorialModal";
import { useNavigate } from "react-router-dom";
import { noteListAtom } from "../recoil/noteDataAtom";
import HomeFooter from "../components/footer/HomeFooter";
import ReactGA from "react-ga4";
import ExamplesModal from "../components/modals/ExamplesModal";
import { isExamplesModalOpenAtom } from "../recoil/exampleModalAtoms";
import { createNotionPage } from "../api/createNotionPageApi";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="loader h-8 w-8 rounded-full border-4 border-t-4 border-gray-200 ease-linear"></div>
  </div>
);

const LoadingText = () => {
  const texts = ["Processing data...", "Almost there...", "Hang tight..."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [texts.length]);

  return <p className="mt-4 text-gray-500">{texts[index]}</p>;
};

export default function HomePage() {
  const [, setIsSignInModalOpen] = useRecoilState(isSignInModalOpenAtom);
  const [, setIsTutorialModalOpen] = useRecoilState(isTutorialModalOpenAtom);
  const [, setTutorialModalContent] = useRecoilState(tutorialModalContentAtom);
  const [, setIsExamplesModalOpen] = useRecoilState(isExamplesModalOpenAtom); // 추가

  const [isSignedIn] = useRecoilState(isSignedInAtom);
  const [userInfo] = useRecoilState(userInfoAtom);
  const [, setChatData] = useRecoilState(urlSearchAtom);
  const [, setNoteList] = useRecoilState(noteListAtom);

  const [text, setText] = useState("");
  const [, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      return false;
    } else {
      setText(e.target.value);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (isSignedIn) {
      console.log(isSignedIn, userInfo);
      console.log(userInfo.id);
    }
  }, [isSignedIn, userInfo]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleSearchClick = async (
    e?:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>,
  ) => {
    if (e) e.preventDefault();

    // 이미 로딩 중이면 추가 요청을 방지
    if (isLoading) return;

    setIsLoading(true);

    if (isSignedIn) {
      try {
        if (
          !text.startsWith("https://www.chatgpt.com/share/") &&
          !text.startsWith("https://chatgpt.com/share/")
        ) {
          ReactGA.event({
            category: "Button",
            action: "Invalid Submit Click",
            label: "Invalid Submit Button",
          });
          setTutorialModalContent(
            "The link you entered is invalid. Please enter a valid ChatGPT share link.",
          );
          setIsTutorialModalOpen(true);
          setIsLoading(false);
          return;
        }
        setError(null);
        ReactGA.event({
          category: "Button",
          action: "Valid Submit Click",
          label: "Valid Submit Button",
        });
        console.log(parseInt(userInfo.id), text);
        const response = await createUserNote({
          user_id: parseInt(userInfo.id),
          url: text,
        });
        setChatData(response.techNoteData); // 서버에서 받아온 데이터를 Recoil Atom에 저장
        console.log(response.techNoteData);

        // 새로운 노트를 noteListAtom에 추가
        setNoteList((oldNoteList) => [
          ...oldNoteList,
          {
            id: response.techNoteData.id,
            title: response.techNoteData.title,
            url: `/note/${response.techNoteData.id}`,
            conversation_id: response.techNoteData.conversation_id,
            note_content: response.techNoteData.note_content,
            created_at: response.techNoteData.created_at,
            notion_link: response.techNoteData.notion_link,
            is_completed: response.techNoteData.is_completed,
          },
        ]);
        console.log(response.techNoteData.id);

        // 노트 페이지로 이동
        navigate(`/note/${response.techNoteData.id.toString()}`);

        createNotionPage(response.techNoteData.conversation_id.toString());
      } catch (error) {
        console.error("Error calling API:", error);
        setError("Failed to load the data. Please try again.");
      }
      setIsLoading(false);
    } else {
      setIsSignInModalOpen(true);
      ReactGA.event({
        category: "Button",
        action: "Sign In Modal Click through Submit Button",
        label: "Enter Sign In Modal through Submit Button",
      });
      setIsLoading(false);
    }
  };

  return (
    <div
      className=" relative flex h-full min-h-screen items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className=" items-center justify-center text-center text-gray-500">
        <div className="mb-12 flex w-full justify-center">
          <span className="animate-gradient rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-[length:200%_200%] px-4 py-1 text-lg font-bold text-white shadow-lg">
            TRY IT FOR FREE
          </span>
        </div>
        <div className="title">
          <h1 className="font-inter mb-4 text-6xl font-black text-black">
            <span className="text-6xl font-light text-black">Turn </span>
            <span className="gradient-text-2  text-6xl font-bold">
              {" "}
              AI Conversations
            </span>
          </h1>
          <h1 className="font-inter mb-8 text-6xl font-black ">
            <span className="text-6xl font-light text-black">into </span>
            <span className="gradient-text  text-6xl font-bold">
              {" "}
              Reusable Knowledge
            </span>
          </h1>
        </div>
        <p className="mb-2 text-lg">
          <span className="gradient-text font-bold">Save time and effort</span>{" "}
          by automatically organizing
        </p>
        <p className="mb-8 text-lg ">
          and refining
          <span className="gradient-text font-bold">
            {" "}
            your development insights!
          </span>
        </p>
        <div className="mb-4 flex items-center justify-center">
          {" "}
          <div className="group relative">
            <Button className="mx-2" color="purple">
              ChatGPT
            </Button>
            <div className="absolute -top-14 left-1/2 hidden -translate-x-1/2 rounded-md bg-purple-700 p-2 text-xs text-white group-hover:block">
              Available!
            </div>
          </div>
          <div className="group relative">
            <Button className="mx-2" color="gray">
              Claude
            </Button>
            <div className="absolute -top-14 left-1/2 hidden -translate-x-1/2 rounded-md bg-gray-700 p-2 text-xs text-white group-hover:block">
              Developing...
            </div>
          </div>
          <div className="group relative">
            <Button className="mx-2" color="gray">
              Gemini
            </Button>
            <div className="absolute -top-14 left-1/2 hidden -translate-x-1/2 rounded-md bg-gray-700 p-2 text-xs text-white group-hover:block">
              Developing...
            </div>
          </div>
        </div>

        <form
          className="relative left-[10%] right-[10%] w-[80%]"
          onSubmit={handleSearchClick}
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="search"
              placeholder="Paste your ChatGPT share link here!"
              className="w-full rounded-full border-none bg-gray-50 p-4"
              onChange={(e) => handleSearch(e)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={handleSearchClick}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#4833CA] p-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <AiOutlineSearch color="white" width={"28px"} height={"28px"} />
              )}
            </button>
          </div>
          {isLoading && <LoadingText />}
        </form>
        <button
          onClick={() => setIsExamplesModalOpen(true)} // 모달을 열도록 설정
          className="mt-4 rounded-md border border-transparent px-2 py-1 text-sm font-light text-[#4833CA] hover:underline"
        >
          What can I get?
        </button>
      </div>
      <HomeFooter />
      <TutorialModal />
      <ExamplesModal /> {/* 모달 추가 */}
    </div>
  );
}
