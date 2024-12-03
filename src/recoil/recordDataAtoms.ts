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
