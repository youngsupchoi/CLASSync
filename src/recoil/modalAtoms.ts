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

export const isTutorialModalOpenAtom = atom({
  key: "isTutorialModalOpenAtom",
  default: false,
});

export const tutorialModalContentAtom = atom({
  key: "tutorialModalContentAtom",
  default: "",
});
