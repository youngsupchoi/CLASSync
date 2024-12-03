import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MobileRedirect: React.FC = () => {
  const navigate = useNavigate();
  //   const location = useLocation();

  // useEffect(() => {
  //   const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  //   if (isMobile) {
  //     navigate("/mobile-landing");
  //   }
  //   // 모바일이 아니면 현재 위치 유지
  // }, []);

  return null;
};

export default MobileRedirect;
