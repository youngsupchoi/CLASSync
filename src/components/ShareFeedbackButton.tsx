import { Button } from "flowbite-react";
import { isShareFeedbackModalOpenAtom } from "../recoil/modalAtoms";
import { useSetRecoilState } from "recoil";

export default function ShareFeedbackButton() {
  const setIsShaerFeedbackModalOpen = useSetRecoilState(
    isShareFeedbackModalOpenAtom,
  );
  return (
    <div className=" flex items-center justify-center px-3 py-0">
      <Button
        className=" my-1 flex w-full items-center rounded-lg bg-[#4833CA] py-0 shadow-sm hover:bg-gray-700 hover:text-white focus:ring-gray-700 "
        onClick={() => {
          (window as any).ChannelIO("show", true);
          setIsShaerFeedbackModalOpen(true);
        }}
      >
        <span className="w-full text-base font-light text-white">
          Share your feedback
        </span>
      </Button>
    </div>
  );
}
