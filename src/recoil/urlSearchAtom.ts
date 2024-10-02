// src/recoil/urlSearchAtom.ts

import { atom } from "recoil";

interface urlSearchAtom {
  chatUrl: string;
  data: Array<{ question: string; answer: string }>;
}

export const urlSearchAtom = atom<urlSearchAtom | null>({
  key: "urlSearchAtom",
  default: null,
});
