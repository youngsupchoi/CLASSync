import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Table, Button } from "flowbite-react";
import { HiOutlineDocumentText } from "react-icons/hi";
import { getAllRecordForClass } from "../api/getAllRecordForClass";

interface Recording {
  recordingId: number;
  recordingTitle: string;
  classId: number;
  classTitle: string;
  preTranscript: string;
  recordedAt: string;
  durationMinutes: number | null;
}

const NoteListPage = () => {
  const { classId, classTitle } = useParams<{
    classId: string;
    classTitle: string;
  }>();
  const [recordings, setRecordings] = useState<Recording[]>([]);

  useEffect(() => {
    getAllRecordForClass(Number(classId)).then((data) => {
      setRecordings(data);
    });
  }, [classId]);

  // {
  //   recordingId: 1,
  //   recordingTitle: "2024-11-27T23:22:12.822536 녹음",
  //   classId: 1,
  //   classTitle: "데이터베이스",
  //   preTranscript: "람다 내에서 사용되는 외부 변수는...",
  //   recordedAt: "2024-11-27T14:22:12.822613",
  //   durationMinutes: 62,
  // },
  // {
  //   recordingId: 2,
  //   recordingTitle: "2024-11-28T01:56:09.836403 녹음",
  //   classId: 1,
  //   classTitle: "데이터베이스",
  //   preTranscript: "이 영상은 유료광고를 포함하고 있습니다.",
  //   recordedAt: "2024-11-27T16:56:09.836843",
  //   durationMinutes: 53,
  // },

  return (
    <div className="container mx-auto px-12 pb-16 pt-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{classTitle}</h1>
        {/* <Link to="/create">
          <Button gradientDuoTone="purpleToBlue">새 녹음 시작</Button>
        </Link> */}
      </div>

      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="w-14">
            <span className="sr-only">아이콘</span>
          </Table.HeadCell>
          <Table.HeadCell>녹음 제목</Table.HeadCell>
          <Table.HeadCell>강의</Table.HeadCell>
          <Table.HeadCell>녹음 시간</Table.HeadCell>
          <Table.HeadCell>소요 시간</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">상세보기</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {recordings.map((recording) => (
            <Table.Row
              key={recording.recordingId}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="w-8 pr-4">
                <HiOutlineDocumentText className="h-7 w-7 self-center text-gray-500" />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-2 font-semibold text-gray-900 dark:text-white">
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    {recording.recordingTitle}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {recording.preTranscript}
                  </p>
                </div>
              </Table.Cell>
              <Table.Cell>
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                  {recording.classTitle}
                </span>
              </Table.Cell>
              <Table.Cell>
                {new Date(recording.recordedAt).toLocaleString()}
              </Table.Cell>
              <Table.Cell>
                {recording.durationMinutes
                  ? `${recording.durationMinutes}분`
                  : "-"}
              </Table.Cell>
              <Table.Cell>
                <Link to={`/record/${recording.recordingId}`}>
                  <Button
                    size="xs"
                    gradientDuoTone="purpleToBlue"
                    className="whitespace-nowrap"
                  >
                    <HiOutlineDocumentText className="mr-2 h-4 w-4" />
                    노트 열기
                  </Button>
                </Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default NoteListPage;
