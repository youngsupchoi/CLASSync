// src/App.tsx

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage";
import Layout from "./components/Layout";
import { SignInModal } from "./components/modals/SignInModal";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { isSignedInAtom } from "./recoil/IsSignedInAtom";
import { jwtDecode } from "jwt-decode";
import { userInfoAtom } from "./recoil/userInfoAtom";
import NotePage from "./pages/NotePage";
import MobileLandingPage from "./pages/MobileLandingPage";
import MobileRedirect from "./components/MobileRedirect"; // 새로 추가한 컴포넌트 임포트

function App() {
  const setIsSignedIn = useSetRecoilState(isSignedInAtom);
  const setUserInfo = useSetRecoilState(userInfoAtom);

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const userId = localStorage.getItem("CLASSync_uid");
    if (userId) {
      setIsSignedIn(true);
    }
    if (userId && token) {
      setIsSignedIn(true);
      const decoded: {
        id: string;
        given_name: string;
        family_name: string;
        email: string;
      } = jwtDecode(token as string);
      console.log("🚀 ~ useEffect ~ decoded:", decoded);
      setUserInfo({
        id: userId as string,
        given_name: decoded.given_name,
        family_name: decoded.family_name,
        email: decoded.email,
      });
    }
  }, [setIsSignedIn, setUserInfo]);

  return (
    <Router>
      <MobileRedirect /> {/* 모바일 리다이렉트를 위한 컴포넌트 추가 */}
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/note/:noteId"
          element={
            <Layout>
              <NotePage />
            </Layout>
          }
        />
        <Route path="/mobile-landing" element={<MobileLandingPage />} />
      </Routes>
      <SignInModal />
    </Router>
  );
}

export default App;
