//src/pages/HomePage.tsx
import { useRecoilState } from "recoil";
import { isSignedInAtom } from "../recoil/IsSignedInAtom";
import { useEffect, useRef } from "react";
import { userInfoAtom } from "../recoil/userInfoAtom";
import { useNavigate } from "react-router-dom";
import HomeFooter from "../components/footer/HomeFooter";
import HomeImage from "../assets/images/HomeImage.svg";
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
      className="relative flex h-full min-h-screen flex-col items-center justify-center"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        src={HomeImage}
        alt="Home"
        className="w-full max-w-[1400px] px-4 md:w-4/5 lg:w-11/12 xl:w-full"
      />
      <HomeFooter />
    </div>
  );
}
