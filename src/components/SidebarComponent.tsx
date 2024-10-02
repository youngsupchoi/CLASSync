// src/components/SidebarComponent.tsx

import { Sidebar, Flowbite, Dropdown } from "flowbite-react";
import {
  HiMenu,
  HiX,
  HiOutlineQuestionMarkCircle,
  HiOutlineUserCircle,
} from "react-icons/hi";
import Chno_logo from "../assets/images/Chno_logo.png";
import { SidebarCustomTheme } from "../theme/customFlowbiteTheme";
import { HomeIcon } from "../assets/icons/HomeIcon";
import { BookIcon } from "../assets/icons/BookIcon";
import NewKnowledgeButton from "./NewKnowledgeButton";
import SignInButton from "./SignInButton";
import { isSidebarCollapsedAtom } from "../recoil/IsSidebarCollapesd";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { isSignedInAtom } from "../recoil/IsSignedInAtom";
import ShareFeedbackButton from "./ShareFeedbackButton";
import UserInfoComponent from "./UserInfoComponent";
import { noteDataAtom, noteListAtom } from "../recoil/noteDataAtom";
import NoteTitleComponent from "./NoteTitleComponent";
import { isSignInModalOpenAtom } from "../recoil/modalAtoms";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { userInfoAtom } from "../recoil/userInfoAtom";
import { getAllNotes } from "../api/noteApi";
import ReactGA from "react-ga4";

export function SidebarComponent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useRecoilState(
    isSidebarCollapsedAtom,
  );
  const setIsSignInModalOpen = useSetRecoilState(isSignInModalOpenAtom);
  const isSignedIn = useRecoilValue(isSignedInAtom);
  const noteTitleList = useRecoilValue(noteListAtom);
  const [userInfo] = useRecoilState(userInfoAtom);
  const navigate = useNavigate();
  const setNoteList = useSetRecoilState(noteListAtom);
  const setNoteData = useSetRecoilState(noteDataAtom);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const openSignInModal = () => {
    if (isSignedIn) return;
    setIsSignInModalOpen(true);
  };

  const handleNoteClick = (note: any) => {
    setNoteData({
      id: note.id,
      title: note.title,
      conversation_id: note.conversation_id,
      notion_page_id: note.notion_page_id,
      created_at: note.created_at,
      gptData: note.gptData,
    });
    navigate(note.url);
  };

  const handleSidebarItemClick = (label: string) => {
    ReactGA.event({
      category: "Sidebar",
      action: "Click",
      label: label,
    });
  };

  useEffect(() => {
    const userId = localStorage.getItem("chno_uid");
    if (isSignedIn && userId) {
      getAllNotes(userId).then((data) => {
        const formattedNotes = data.map((note: any) => ({
          ...note,
          url: `/note/${note.id}`,
        }));
        console.log(formattedNotes);
        setNoteList(formattedNotes.reverse()); // 상태 업데이트
      });
    }
  }, [isSignedIn, userInfo, setNoteList]);

  return (
    <Flowbite theme={{ theme: SidebarCustomTheme }}>
      <Sidebar
        aria-label="Sidebar with custom theme"
        collapsed={isSidebarCollapsed}
        className={`fixed left-0 top-0 z-40 h-screen bg-red-500`}
      >
        <button
          onClick={() => {
            handleSidebarItemClick("Home");
            navigate("/");
          }}
          className={`flex items-center text-xl font-bold ${isSidebarCollapsed ? "py-4 pl-3" : "p-4"}`}
        >
          <img
            src={Chno_logo}
            alt="Chno logo"
            className={` ${isSidebarCollapsed ? "h-6 w-6" : "h-8 w-8"}`}
          />
          {!isSidebarCollapsed && (
            <span className="ml-2 text-[#9EA7B0]">Chno</span>
          )}
        </button>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <NewKnowledgeButton />
            <Sidebar.Item
              href="/"
              icon={HomeIcon}
              onClick={() => handleSidebarItemClick("Home")}
            >
              Home
            </Sidebar.Item>
            {!isSignedIn ? (
              <Sidebar.Item
                icon={BookIcon}
                onClick={() => {
                  openSignInModal();
                  handleSidebarItemClick("Sign In from Sidebar Book Button");
                }}
              >
                My knowledge
              </Sidebar.Item>
            ) : (
              <Sidebar.Collapse icon={BookIcon} label="My knowledge">
                {!isSidebarCollapsed &&
                  noteTitleList.map((note) => (
                    <Sidebar.Item
                      key={note.id}
                      onClick={() => {
                        handleNoteClick(note);
                        handleSidebarItemClick(
                          `${userInfo.email} - ${note.title}`,
                        );
                      }}
                    >
                      <NoteTitleComponent title={note.title} />
                    </Sidebar.Item>
                  ))}
              </Sidebar.Collapse>
            )}

            {isSidebarCollapsed || isSignedIn ? null : <SignInButton />}
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup className="mx-1 my-0 mb-4 pt-0">
            {/* <Sidebar.CTA>
              <div className="mb-3 flex items-center">
                <Badge color="warning">Beta</Badge>
              </div>
              <div className="mb-3 text-sm text-cyan-900 dark:text-gray-400">
                Get the Chrome extension to summarize any page with a single
                click!
              </div>
              <a
                className="text-sm text-cyan-900 underline hover:text-cyan-800 dark:text-gray-400 dark:hover:text-gray-300"
                href="#"
              >
                Get Chrome Extension
              </a>
            </Sidebar.CTA> */}
            <Sidebar.Item
              href="/"
              icon={HiOutlineQuestionMarkCircle}
              onClick={() => handleSidebarItemClick("Help")}
            >
              <span className="text-sm font-light">Help</span>
            </Sidebar.Item>

            {isSidebarCollapsed && isSignedIn ? (
              <div>
                <Sidebar.Item
                  icon={HiOutlineUserCircle}
                  onClick={() => handleSidebarItemClick("My account")}
                >
                  My account
                </Sidebar.Item>
              </div>
            ) : null}
            {!isSidebarCollapsed && isSignedIn ? (
              <Sidebar.Item className="px-0">
                <Dropdown
                  inline={true}
                  label={<UserInfoComponent />}
                  arrowIcon={false}
                  placement="right"
                  className="ml-3 rounded-xl"
                >
                  <Dropdown.Item
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                      handleSidebarItemClick(`${userInfo.email} - Sign out`);
                    }}
                  >
                    Sign out
                  </Dropdown.Item>
                </Dropdown>
              </Sidebar.Item>
            ) : null}
            {isSidebarCollapsed ? null : <ShareFeedbackButton />}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

      <button
        onClick={toggleSidebar}
        className={`fixed top-3 z-50 rounded-3xl border-none bg-[#1E202A] p-4 pl-6  ${
          isSidebarCollapsed ? "left-8" : "left-56"
        }`}
      >
        {isSidebarCollapsed ? (
          <HiMenu className="h-5 w-5 text-white" />
        ) : (
          <HiX className="h-5 w-5 text-white" />
        )}
      </button>
    </Flowbite>
  );
}
