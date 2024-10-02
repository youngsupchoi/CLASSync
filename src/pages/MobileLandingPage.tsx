// src/pages/MobileLandingPage.tsx

import React, { useState } from "react";
import { submitToFormspark } from "../components/FormSpark";
import { Alert, Button } from "flowbite-react";
import MobileLandingImage from "../assets/images/MobileLandingImage.png";
// import backgroundImage from "../assets/images/landingBackgroundImage.png";
import MobileLandingBackground from "../assets/images/MobileLandingBackground.png";

const MobileLandingPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const utmSource =
    new URLSearchParams(window.location.search).get("utm_source") ||
    "default_source";

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!email) {
      setAlert({ show: true, type: "error", message: "Email is required." });
      return;
    }

    if (!validateEmail(email)) {
      setAlert({ show: true, type: "error", message: "Invalid email format." });
      return;
    }

    try {
      await submitToFormspark(email, utmSource);
      setAlert({
        show: true,
        type: "success",
        message: "Form submitted successfully!",
      });

      // Google Analytics 이벤트 트래킹 추가
      if ((window as any).gtag) {
        (window as any).gtag("event", "submit", {
          event_category: "Form",
          event_label: "Email Subscription",
          value: email,
        });
      }

      // 구글 전환 트래킹 스니펫 호출
      if ((window as any).gtag_report_conversion) {
        (window as any).gtag_report_conversion();
      }

      setAlert({
        show: true,
        type: "success",
        message: "Form submitted successfully!",
      });

      setEmail(""); // 이메일 입력 필드 초기화
    } catch (error) {
      setAlert({ show: true, type: "error", message: "Error submitting form" });
      console.error("Error submitting form", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <div
      className="flex h-screen min-h-screen flex-col items-center justify-center bg-white"
      //   style={{
      //     backgroundImage: `url(${MobileLandingBackground})`,
      //     backgroundSize: "cover",
      //     // backgroundPosition: "center",
      //   }}
    >
      <img src={MobileLandingBackground} className="absolute top-0" />
      <img
        src={MobileLandingImage}
        className="contain absolute bottom-0 h-auto w-[80%] opacity-50"
      />
      <div className="-mt-32 w-full">
        <header className="mb-4 text-center">
          <p className="mb-8 text-sm font-bold text-black">
            Your AI-powered Tech Note Assistant
          </p>
          <h1 className="font-inter mb-2 text-3xl font-black text-black">
            {/* <span className="text-lg font-light text-black">Turn</span> */}
            <span className="gradient-text-2  text-3xl font-black">
              {/* {" "} */}
              AI Conversations
            </span>
          </h1>
          <span className=" text-xl font-light text-black">into</span>
          <h1 className="font-inter mt-2 text-3xl font-black ">
            <span className="gradient-text  text-3xl font-black">
              {" "}
              Reusable Knowledge
            </span>
          </h1>
        </header>

        <form className="mx-auto w-full max-w-sm p-4   ">
          <input
            className="focus:shadow-outline mb-4 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            id="email"
            type="email"
            placeholder="chnoai@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            gradientDuoTone="purpleToPink"
            className="w-full font-black"
            onClick={handleSubmit}
          >
            JOIN
          </Button>
        </form>
        {alert.show && (
          <Alert
            style={{
              fontFamily: "Pretendard",
            }}
            color={alert.type === "success" ? "success" : "failure"}
            className="absolute left-1/2 mt-4 -translate-x-1/2 transform"
          >
            {alert.message}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default MobileLandingPage;
