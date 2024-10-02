import { atom } from "recoil";

export const isSidebarCollapsedAtom = atom<boolean>({
  key: "IsSidebarCollapsedAtom",
  default: false,
});
