// src/components/modals/SignInModal.tsx
import { Button, Modal } from "flowbite-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isCreateModalOpenAtom } from "../../recoil/modalAtoms";
import { LoginModalTheme } from "../../theme/loginModalTheme";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { isSignedInAtom } from "../../recoil/IsSignedInAtom";
import { userInfoAtom } from "../../recoil/userInfoAtom";
import ClASSync_logo2 from "../../assets/images/ClASSync_logo2.png";
import { createUser } from "../../api/userApi";
import { getAllNotes } from "../../api/noteApi";
import {
  createNoteDataAtom,
  noteDataAtom,
  noteListAtom,
} from "../../recoil/noteDataAtom";
import ReactGA from "react-ga4";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function CreateModal() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useRecoilState(
    isCreateModalOpenAtom,
  );
  const [, setNoteList] = useRecoilState(noteListAtom);
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [noteData, setNoteData] = useRecoilState(noteDataAtom);
  const [createNoteData, setCreateNoteData] =
    useRecoilState(createNoteDataAtom);
  const navigate = useNavigate();
  function onCloseModal() {
    setIsCreateModalOpen(false);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("source") === "extension") {
      setIsCreateModalOpen(true);
    }
  }, []);

  const className = [
    {
      id: 3,
      userId: 0,
      title: "데이터 베이스",
      description: "string",
      createdAt: "2024-11-24T01:17:41.986Z",
      updatedAt: "2024-11-24T01:17:41.986Z",
    },
    {
      id: 1,
      userId: 0,
      title: "컴퓨터 네트워크",
      description: "string",
      createdAt: "2024-11-24T01:17:41.986Z",
      updatedAt: "2024-11-24T01:17:41.986Z",
    },
    {
      id: 2,
      userId: 0,
      title: "데이터 베이스 시스템",
      description: "string",
      createdAt: "2024-11-24T01:17:41.986Z",
      updatedAt: "2024-11-24T01:17:41.986Z",
    },
    {
      id: 4,
      userId: 0,
      title: "컴퓨터 구조",
      description: "string",
      createdAt: "2024-11-24T01:17:41.986Z",
      updatedAt: "2024-11-24T01:17:41.986Z",
    },
    {
      id: 5,
      userId: 0,
      title: "시스템 프로그래밍",
      description: "string",
      createdAt: "2024-11-24T01:17:41.986Z",
      updatedAt: "2024-11-24T01:17:41.986Z",
    },
  ];

  const handleCreateClass = () => {
    // 입력된 수업 이름이 이미 존재하는지 확인
    const isDuplicate = className.some(
      (item) => item.title === createNoteData.class_name,
    );

    if (isDuplicate) {
      toast.error("이미 존재하는 수업 이름입니다.");
      return;
    }

    setCreateNoteData({
      id: "",
      class_id: 0,
      class_name: createNoteData.class_name,
      title:
        new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " 생성된 수업 기록",
      created_at: new Date().toISOString(),
    });
    setNoteData({
      class_id: 0,
      class_name: createNoteData.class_name,
      title:
        new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " 생성된 수업 기록",
      created_at: new Date().toISOString(),
    });
    navigate("/");
    onCloseModal();
    toast.success(`${createNoteData.class_name} 수업 생성이 완료되었습니다.`);
  };

  return (
    <>
      <Modal
        theme={LoginModalTheme}
        show={isCreateModalOpen}
        size="md"
        onClose={onCloseModal}
        popup
      >
        <Modal.Header className="" />
        <Modal.Body>
          <div className="flex flex-col items-center space-y-6">
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                어떤 수업에 노트를 생성할까요?
              </h3>
            </div>
            <div className="flex w-full flex-col items-center space-y-2">
              <div className="flex w-full items-center space-x-2">
                <input
                  type="text"
                  className="flex-grow rounded border border-gray-300 p-2"
                  placeholder="수업 이름 입력"
                  onChange={(e) =>
                    setCreateNoteData({
                      ...createNoteData,
                      class_name: e.target.value,
                    })
                  }
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  color="blue"
                  onClick={handleCreateClass}
                >
                  생성
                </Button>
              </div>

              {className.map((item) => (
                <Button
                  key={item.id}
                  className="w-full"
                  color="light"
                  onClick={() => {
                    setCreateNoteData({
                      id: "",
                      class_id: item.id,
                      class_name: item.title,
                      title:
                        new Date().toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }) + " 생성된 수업 기록",
                      created_at: new Date().toISOString(),
                    });
                    setNoteData({
                      class_id: item.id,
                      class_name: item.title,
                      title:
                        new Date().toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }) + " 생성된 수업 기록",
                      created_at: new Date().toISOString(),
                    });
                    navigate(`/notecreate/${item.id}`);
                    onCloseModal();
                  }}
                >
                  {item.title}
                </Button>
              ))}
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
