import { useEffect } from "react";
import ReactGA from "react-ga4";

const useTrackTimeOnPage = () => {
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const endTime = Date.now();
      const timeSpent = endTime - startTime;

      ReactGA.event({
        category: "User",
        action: "Time Spent",
        value: timeSpent,
      });
    };
  }, []);
};

export default useTrackTimeOnPage;
