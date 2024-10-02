// src/components/modals/SignInModal.tsx
import { Modal } from "flowbite-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isSignInModalOpenAtom } from "../../recoil/modalAtoms";
import { LoginModalTheme } from "../../theme/loginModalTheme";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { isSignedInAtom } from "../../recoil/IsSignedInAtom";
import { userInfoAtom } from "../../recoil/userInfoAtom";
import Chno_logo2 from "../../assets/images/Chno_logo2.png";
import { createUser } from "../../api/userApi";
import { getAllNotes } from "../../api/noteApi";
import { noteListAtom } from "../../recoil/noteDataAtom";
import ReactGA from "react-ga4";

export function SignInModal() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useRecoilState(
    isSignInModalOpenAtom,
  );
  const [, setNoteList] = useRecoilState(noteListAtom);
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);

  function onCloseModal() {
    setIsSignInModalOpen(false);
  }
  const setIsSignedIn = useSetRecoilState(isSignedInAtom);
  // 로그인 성공 시 호출되는 함수
  function handleSuccess(credentialResponse: any) {
    const decoded: {
      iss: string;
      azp: string;
      aud: string;
      sub: string;
      email: string;
      email_verified: boolean;
      name: string;
      picture?: string;
      given_name?: string;
      family_name?: string;
    } = jwtDecode(credentialResponse?.credential as string);

    ReactGA.event({
      category: "User",
      action: "User logged in",
      label: decoded.email,
    });

    // 유저 정보 객체 생성
    const user = {
      iss: decoded.iss,
      azp: decoded.azp,
      aud: decoded.aud,
      sub: decoded.sub,
      email: decoded.email,
      email_verified: decoded.email_verified,
      name: decoded.name,
      picture: decoded.picture,
      given_name: decoded.given_name,
      family_name: decoded.family_name,
    };

    // API 호출
    createUser(user)
      .then((data) => {
        localStorage.setItem("chno_uid", data.id);
        console.log("유저 생성 또는 정보 반환:", data);
        setUserInfo({
          id: data.id,
          given_name: data.given_name,
          family_name: data.family_name,
          email: data.email,
        });

        // 익스텐션에서 온 경우 부모 창에 데이터 전송
        const params = new URLSearchParams(window.location.search);
        console.log(decoded, params.get("source"));

        if (params.get("source") === "extension") {
          const userId = userInfo.id;
          console.log(userId);
          // 디버깅 메시지 추가
          console.log("Sending LOGIN_SUCCESS message to extension:", {
            type: "LOGIN_SUCCESS",
            data: {
              data: {
                id: data.id,
                given_name: data.given_name,
                family_name: data.family_name,
                email: data.email,
                picture: decoded.picture,
              },
              userId: data.id,
            },
          });

          window?.postMessage(
            {
              type: "LOGIN_SUCCESS",
              data: {
                data: {
                  id: data.id,
                  given_name: data.given_name,
                  family_name: data.family_name,
                  email: data.email,
                  picture: decoded.picture,
                },
                userId: data.id,
              },
            },
            "*",
          );
          window?.close();
        }

        // 유저의 모든 노트를 가져오는 API 호출
        return getAllNotes(data.id);
      })
      .then((notes) => {
        console.log("유저 노트 목록:", notes);
        const formattedNotes = notes.map((note: any) => ({
          ...note,
          url: `/note/${note.id}`,
        }));
        setNoteList(formattedNotes);
      })
      .catch((error) => {
        console.error("유저 생성 실패 또는 노트 불러오기 실패:", error);
      });

    // 로컬 스토리지에 저장
    localStorage.setItem("Token", credentialResponse?.credential);
    setIsSignedIn(true);

    setIsSignedIn(true);
    onCloseModal();
  }

  // 로그인 실패 시 호출되는 함수
  function handleError() {
    console.log("Login Failed");
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("source") === "extension") {
      setIsSignInModalOpen(true);
    }
  }, []);

  return (
    <>
      <Modal
        theme={LoginModalTheme}
        show={isSignInModalOpen}
        size="md"
        onClose={onCloseModal}
        popup
      >
        <Modal.Header className="" />
        <Modal.Body>
          <div className="flex flex-col items-center space-y-6">
            <img
              src={Chno_logo2}
              alt="Chno logo"
              className="h-auto w-24 pt-8"
            />
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-light text-gray-900 dark:text-white">
                Sign up now and try unlimited
              </h3>
              <div className="flex space-x-1">
                <h3 className="text-lg font-light text-gray-900 dark:text-white">
                  summarization for free
                </h3>
              </div>
            </div>

            <div className="py-12 ">
              <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
            </div>
            <div>
              <h6 className="text-xs font-light text-[#A1A1AA]">
                By logging in, you agree to all the policies below.
              </h6>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              <a
                href="https://harmonious-authority-301.notion.site/Terms-of-Service-46455da80715458fb98e060cb3b92181?pvs=4"
                className="text-xs font-normal text-[#A1A1AA] hover:underline dark:text-cyan-500"
              >
                Term of Service
              </a>
              &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
              <a
                href="https://harmonious-authority-301.notion.site/Privacy-Policy-f241cf2d76af4ff0976b937fed1b86ff?pvs=4"
                className="text-xs font-normal text-[#A1A1AA] hover:underline dark:text-cyan-500"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
