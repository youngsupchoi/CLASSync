// src/recoil/noteDataAtom.ts

import { atom } from "recoil";

interface Note {
  id: string;
  title: string;
  url: string;
  conversation_id: number;
  note_content: string;
  created_at: string;
  notion_link: string | null;
  is_completed: boolean;
}

interface NoteData {
  id: string;
  title: string;
  conversation_id: number;
  created_at: string;
  notion_page_id: string;
  gptData: Array<{
    question: string;
    answer: string;
  }>;
}

export const noteListAtom = atom<Note[]>({
  key: "NoteListAtom",
  default: [],
});

export const noteDataAtom = atom<NoteData>({
  key: "NoteDataAtom",
  default: {
    id: "",
    title: "",
    conversation_id: 0,
    created_at: "",
    notion_page_id: "",
    gptData: [],
  },
});
