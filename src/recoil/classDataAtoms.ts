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
  default: [
    {
      id: 1,
      userId: 1,
      title: "데이터베이스",
      description: "데이터베이스",
      createdAt: "2024-11-03T13:36:03.665739",
      updatedAt: "2024-11-03T13:36:03.665761",
    },
    {
      id: 2,
      userId: 1,
      title: "데이터베이스",
      description: "데이터베이스",
      createdAt: "2024-11-03T14:31:18.549044",
      updatedAt: "2024-11-03T14:31:18.549102",
    },
    {
      id: 3,
      userId: 1,
      title: "데이터베이스",
      description: "데이터베이스",
      createdAt: "2024-11-03T14:31:27.498785",
      updatedAt: "2024-11-03T14:31:27.498804",
    },
    {
      id: 4,
      userId: 1,
      title: "건축",
      description: "건축",
      createdAt: "2024-11-03T15:22:04.787377",
      updatedAt: "2024-11-03T15:22:04.78741",
    },
    {
      id: 5,
      userId: 1,
      title: "수업",
      description: "설명",
      createdAt: "2024-11-10T09:24:41.677506",
      updatedAt: "2024-11-10T09:24:41.677537",
    },
  ],
});
