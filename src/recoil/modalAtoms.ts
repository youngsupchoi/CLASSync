import { atom } from "recoil";

export const isSignInModalOpenAtom = atom<boolean>({
  key: "IsSignInModalOpenAtom",
  default: false,
});

export const isSettingModalOpenAtom = atom<boolean>({
  key: "IsSettingModalOpenAtom",
  default: false,
});

export const isShareFeedbackModalOpenAtom = atom<boolean>({
  key: "IsShareFeedbackModalOpenAtom",
  default: false,
});
