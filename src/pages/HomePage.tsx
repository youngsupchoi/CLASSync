//src/pages/HomePage.tsx
import { useRecoilState } from "recoil";
import { isSignedInAtom } from "../recoil/IsSignedInAtom";
import { useEffect, useRef } from "react";
import { userInfoAtom } from "../recoil/userInfoAtom";
import { useNavigate } from "react-router-dom";
import HomeFooter from "../components/footer/HomeFooter";

export default function HomePage() {
  const [isSignedIn] = useRecoilState(isSignedInAtom);
  const [userInfo] = useRecoilState(userInfoAtom);

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (isSignedIn) {
      console.log(isSignedIn, userInfo);
      console.log(userInfo.id);
    }
  }, [isSignedIn, userInfo]);

  return (
    <div
      className=" relative flex h-full min-h-screen items-center justify-center"
      style={{
        // backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      home
      {/* <div className=" items-center justify-center text-center text-gray-500"></div> */}
      <HomeFooter />
    </div>
  );
}
