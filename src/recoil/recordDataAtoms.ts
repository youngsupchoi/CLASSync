import { atom } from "recoil";

interface RecordData {
  recordingId: number;
  recordingTitle: string;
  classId: number;
  classTitle: string;
  preTranscript: string;
  recordedAt: string;
  durationMinutes: number | null;
}

export const recordAtom = atom<RecordData[]>({
  key: "recordAtom",
  default: [
    {
      recordingId: 1,
      recordingTitle: "2024-11-27T23:22:12.822536 녹음",
      classId: 1,
      classTitle: "",
      preTranscript:
        "람다 내에서 사용되는 외부 변수는 Final 또는 Effectively Final이어야 합니다. 이를 해결하려면 람다에서 사용하는 외부 변수를 Final로 선언하거나, 람다 내에서",
      recordedAt: "2024-11-27T14:22:12.822613",
      durationMinutes: null,
    },
  ],
});

export interface RecordDetailData {
  recordingId: number;
  recordingTitle: string;
  classId: number;
  classTitle: string;
  transcripts: { transcript: string; timeStamp: string }[];
}

export const recordDetailAtom = atom<RecordDetailData>({
  key: "recordDetailAtom",
  default: {
    recordingId: 1,
    recordingTitle: "",
    classId: 1,
    classTitle: "",
    transcripts: [],
  },
});

export const summaryAtom = atom<
  {
    title: string;
    sections: {
      subtitle: string;
      contents: string[];
    }[];
  }[]
>({
  key: "summaryAtom",
  default: [
    // {
    //   title: "데이터베이스와 DBMS 이해하기",
    //   sections: [
    //     {
    //       subtitle: "데이터베이스(Database, DB)란?",
    //       contents: ["데이터의 집합으로 정의", "일상생활 정보 대부분이 저장됨"],
    //     },
    //     {
    //       subtitle: "DBMS(Database Management System)란?",
    //       contents: [
    //         "데이터베이스를 운영하고 관리하는 소프트웨어",
    //         "여러 명이 동시에 접근 가능",
    //       ],
    //     },
    //     {
    //       subtitle: "DBMS의 종류와 특징",
    //       contents: [
    //         "대표적인 DBMS: MySQL, Oracle, SQL Server, MariaDB 등",
    //         "MySQL은 초보자에게 추천",
    //       ],
    //     },
    //     {
    //       subtitle: "DBMS의 분류",
    //       contents: [
    //         "계층형, 망형, 관계형, 객체지향형, 객체관계형으로 구분",
    //         "관계형 DBMS가 가장 많이 사용됨",
    //       ],
    //     },
    //     {
    //       subtitle: "관계형 DBMS",
    //       contents: ["RDBMS, 테이블 구조로 데이터 저장", "열과 행으로 구성됨"],
    //     },
    //     {
    //       subtitle: "SQL: DBMS에서 사용하는 언어",
    //       contents: [
    //         "관계형 데이터베이스에서 사용되는 언어",
    //         "국제표준화기구가 표준 SQL 발표",
    //       ],
    //     },
    //   ],
    // },
    // {
    //   title:
    //     "데이터베이ㅁㄴㄹㅁㅈㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㅁㅇㄹㅁㄴㄹㅇ",
    //   sections: [
    //     {
    //       subtitle:
    //         "데이터베이스(Dㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹatabase, DB)란?",
    //       contents: [
    //         "데이터의 집합으ㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹ로 정의",
    //         "일상생활ㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹ 정보 대부분이 저장됨",
    //       ],
    //     },
    //     {
    //       subtitle: "DBMS(Database Management System)란?",
    //       contents: [
    //         "데이터베이스를 운ㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹ영하고 관리하는 소프트웨어",
    //         "여러 명이 동시에 접근 가능",
    //       ],
    //     },
    //     {
    //       subtitle: "DBMS의 종류와 특징",
    //       contents: [
    //         "대표적인 DBMS: MySQL, Oracle, SQL Server, MariaDB 등",
    //         "MySQL은 초보자에게 ㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹ추천",
    //       ],
    //     },
    //     {
    //       subtitle: "DBMS의 분류",
    //       contents: [
    //         "계층형, 망형, 관계형, 객체지향형, 객체관계형으로 구분",
    //         "관계형 DBMS가 가장 많이 사용됨",
    //       ],
    //     },
    //     {
    //       subtitle: "관계형 DBMS",
    //       contents: ["RDBMS, 테이블 구조로 데이터 저장", "열과 행으로 구성됨"],
    //     },
    //     {
    //       subtitle:
    //         "SQL: DBMS에서 사ㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹ용하는 언어",
    //       contents: [
    //         "관계형 데이터베이스에서 ㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹㄷㄹㅁㄴㅇㄹㅁㄴㄹㄷㅈㄹㅁㄴㅇㄹㅁㄴㄹㅇㅁㄴㅇㄹㅁㄴㄹㅇㅁㄹ사용되는 언어",
    //         "국제표준화기구가 표준 SQL 발표",
    //       ],
    //     },
    //   ],
    // },
  ],
});

export const transcriptAtom = atom<{ transcript: string; timeStamp: string }[]>(
  {
    key: "transcriptAtom",
    default: [
      {
        transcript: "이 영상은 유료광고를 포함하고 있습니다.\n",
        timeStamp: "00:22",
      },
      {
        transcript: "시청해주셔서 감사합니다.\n",
        timeStamp: "00:42",
      },
      {
        transcript: "시청해주셔서 감사합니다.\n",
        timeStamp: "01:01",
      },
      {
        transcript: "오늘 영상은 여기까지 입니다. 시청해주셔서 감사합니다.\n",
        timeStamp: "01:21",
      },
      {
        transcript: "오늘도 시청해 주셔서 감사합니다.\n",
        timeStamp: "01:43",
      },
      {
        transcript: "이 영상은 유료광고를 포함하고 있습니다.\n",
        timeStamp: "00:22",
      },
      {
        transcript: "시청해주셔서 감사합니다.\n",
        timeStamp: "00:42",
      },
      {
        transcript: "시청해주셔서 감사합니다.\n",
        timeStamp: "01:01",
      },
      {
        transcript: "오늘 영상은 여기까지 입니다. 시청해주셔서 감사합니다.\n",
        timeStamp: "01:21",
      },
      {
        transcript: "오늘도 시청해 주셔서 감사합니다.\n",
        timeStamp: "01:43",
      },
      {
        transcript: "이 영상은 유료광고를 포함하고 있습니다.\n",
        timeStamp: "00:22",
      },
      {
        transcript: "시청해주셔서 감사합니다.\n",
        timeStamp: "00:42",
      },
      {
        transcript: "시청해주셔서 감사합니다.\n",
        timeStamp: "01:01",
      },
      {
        transcript: "오늘 영상은 여기까지 입니다. 시청해주셔서 감사합니다.\n",
        timeStamp: "01:21",
      },
      {
        transcript: "오늘도 시청해 주셔서 감사합니다.\n",
        timeStamp: "01:43",
      },
      {
        transcript: "이 영상은 유료광고를 포함하고 있습니다.\n",
        timeStamp: "00:22",
      },
      {
        transcript: "시청해주셔서 감사합니다.\n",
        timeStamp: "00:42",
      },
      {
        transcript: "시청해주셔서 감사합니다.\n",
        timeStamp: "01:01",
      },
      {
        transcript: "오늘 영상은 여기까지 입니다. 시청해주셔서 감사합니다.\n",
        timeStamp: "01:21",
      },
      {
        transcript: "오늘도 시청해 주셔서 감사합니다.\n",
        timeStamp: "01:43",
      },
      {
        transcript: "이 영상은 유료광고를 포함하고 있습니다.\n",
        timeStamp: "00:22",
      },
      {
        transcript: "시청해주셔서 감사합니다.\n",
        timeStamp: "00:42",
      },
      {
        transcript: "시청해주셔서 감사합니다.\n",
        timeStamp: "01:01",
      },
      {
        transcript: "오늘 영상은 여기까지 입니다. 시청해주셔서 감사합니다.\n",
        timeStamp: "01:21",
      },
      {
        transcript: "오늘도 시청해 주셔서 감사합니다.\n",
        timeStamp: "01:43",
      },
      {
        transcript: "이 영상은 유료광고를 포함하고 있습니다.\n",
        timeStamp: "00:22",
      },
      {
        transcript: "시청해주셔서 감사합니다.\n",
        timeStamp: "00:42",
      },
      {
        transcript: "시청해주셔서 감사합니다.\n",
        timeStamp: "01:01",
      },
      {
        transcript: "오늘 영상은 여기까지 입니다. 시청해주셔서 감사합니다.\n",
        timeStamp: "01:21",
      },
      {
        transcript: "오늘도 시청해 주셔서 감사합니다.\n",
        timeStamp: "01:43",
      },
    ],
  },
);

export const quizAtom = atom<{ quiz: string; answer: string }[]>({
  key: "quizAtom",
  default: [
    {
      quiz: "언제부터 gpt-3.5-turbo-0613 및 gpt-3.5-turbo-16k-0613 모",
      answer:
        "2024년 6월 17일에 gpt-3.5-turbo-0613 및 gpt-3.5-turbo-16k-0613 모델이 더 이상 사용되지 않게 되었다.",
    },
    {
      quiz: "2화",
      answer: "이 드라마는 몇 화부터 시작됐나요?",
    },
    {
      quiz: "16개",
      answer: "이 텍스트에는 몇 개의 물음표가 있을까요?",
    },
    {
      quiz: "사투리적인 슈트가 마음에 불편했기 때문이다.",
      answer:
        "스칼렛 유아즈는 블랙 위도우 슈트를 입기 싫어한 이유는 무엇일까요?",
    },
    {
      quiz: "캐릭터가 광적 대상으로 소비된다는 느낌을 받았기 때문입니다.",
      answer:
        "스칼렛 유어스가 블랙미도 슈트를 입은 것에 대한 편견을 버리게 된 이유는 무엇일까요?",
    },
  ],
});

export const recordListAtom = atom<RecordData[]>({
  key: "recordListAtom",
  default: [
    {
      recordingId: 1,
      recordingTitle: "2024-11-27T23:22:12.822536 녹음",
      classId: 1,
      classTitle: "데이터베이스",
      preTranscript:
        "람다 내에서 사용되는 외부 변수는 Final 또는 Effectively Final이어야 합니다. 이를 해결하려면 람다에서 사용하는 외부 변수를 Final로 선언하거나, 람다 내에서",
      recordedAt: "2024-11-27T14:22:12.822613",
      durationMinutes: null,
    },
    {
      recordingId: 2,
      recordingTitle: "2024-11-28T01:56:09.836403 녹음",
      classId: 1,
      classTitle: "데이터베이스",
      preTranscript: "이 영상은 유료광고를 포함하고 있습니다.\n",
      recordedAt: "2024-11-27T16:56:09.836843",
      durationMinutes: null,
    },
    {
      recordingId: 3,
      recordingTitle: "2024-11-28T02:00:54.100981 녹음",
      classId: 1,
      classTitle: "데이터베이스",
      preTranscript: "재밌게 보셨다면 구독, 좋아요, 알림설정 부탁드려요!\n",
      recordedAt: "2024-11-27T17:00:54.101532",
      durationMinutes: 3,
    },
  ],
});
