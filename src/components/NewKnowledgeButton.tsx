import { Button } from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import { isSidebarCollapsedAtom } from "../recoil/IsSidebarCollapesd";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isSignedInAtom } from "../recoil/IsSignedInAtom";
import { isSignInModalOpenAtom } from "../recoil/modalAtoms";

export default function NewKnowledgeButton() {
  const isSidebarCollapsed = useRecoilValue(isSidebarCollapsedAtom);
  const isSignedIn = useRecoilValue(isSignedInAtom);
  const setIsSignInModalOpen = useSetRecoilState(isSignInModalOpenAtom);

  const clickAddKnowledgeButton = () => {
    // login 되어있는 상태에서는 홈으로 이동, 그렇지않을때는 로그인 모달을 띄움
    if (isSignedIn) {
      window.location.href = "/";
    } else {
      setIsSignInModalOpen(true);
    }
  };
  return (
    <div className=" flex items-center justify-center px-3 pt-3">
      {isSidebarCollapsed ? (
        <Button
          color="light"
          className=" my-3 flex w-full items-center rounded-lg border border-gray-700 px-4 py-0 shadow-sm hover:bg-gray-700 hover:text-white focus:ring-gray-700 "
          onClick={() => clickAddKnowledgeButton()}
        >
          <HiPlus className="size-4 text-[#A1A1AA]" />
        </Button>
      ) : (
        <Button
          color="light"
          className=" my-2 flex w-full items-center rounded-lg border border-gray-700 px-6 py-0 shadow-sm hover:bg-gray-700 hover:text-white focus:ring-gray-700 "
          onClick={() => clickAddKnowledgeButton()}
        >
          <HiPlus className="size-4 text-[#A1A1AA]" />
          <span className="font-light text-[#A1A1AA]">Add knowledge</span>
        </Button>
      )}
    </div>
  );
}
