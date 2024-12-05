import { atom } from "recoil";

interface ClassData {
  id: number;
  userId: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const classDataAtom = atom<ClassData>({
  key: "classDataAtom",
  default: {
    id: 1,
    userId: 1,
    title: "데이터베이스",
    description: "데이터베이스",
    createdAt: "2024-11-03T13:36:03.665739",
    updatedAt: "2024-11-03T13:36:03.665761",
  },
});

export const classListAtom = atom<ClassData[]>({
  key: "classListAtom",
  default: [],
});
