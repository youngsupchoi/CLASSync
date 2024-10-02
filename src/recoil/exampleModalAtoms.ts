// src/recoil/modalAtoms.ts

import { atom } from "recoil";

interface Examples {
  title: string;
  description: string;
  url: string;
  keywords: string[]; // 새로운 필드 추가
}

export const isSignInModalOpenAtom = atom({
  key: "isSignInModalOpen",
  default: false,
});

export const isTutorialModalOpenAtom = atom({
  key: "isTutorialModalOpen",
  default: false,
});

export const tutorialModalContentAtom = atom({
  key: "tutorialModalContent",
  default: "",
});

export const isExamplesModalOpenAtom = atom({
  key: "isExamplesModalOpen",
  default: false,
});

export const examplesAtom = atom<Examples[]>({
  key: "examples",
  default: [
    {
      title: "[Ubuntu] How to set up HTTPS in Caddy without a domain",
      description: "This is the first example.",
      url: "https://harmonious-authority-301.notion.site/Ubuntu-How-to-set-up-HTTPS-in-Caddy-without-a-domain-3021e0f4bb4b4d8389c65847fce3d135",
      keywords: ["Ubuntu", "HTTPS", "Caddy", "Setup"],
    },
    {
      title:
        "[nestjs] Mapping CamelCase Fields to Snake Case Columns in TypeORM",
      description: "This is the second example.",
      url: "https://harmonious-authority-301.notion.site/nestjs-Mapping-CamelCase-Fields-to-Snake-Case-Columns-in-TypeORM-c4ceb92a4d3b434faf175702255ddd0b",
      keywords: ["NestJS", "SnakeCase", "TypeORM"],
    },
  ],
});
