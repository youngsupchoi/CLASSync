import { atom } from "recoil";

export const isSignedInAtom = atom<boolean>({
  key: "IsSignedInAtom",
  default: false,
});
