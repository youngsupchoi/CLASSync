import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { noteDataAtom } from "../../recoil/noteDataAtom";
import WritingGif from "../../assets/animations/writing_animation.json";
import Lottie from "lottie-react";

// LoadingComponent
export const NotionLoadingComponent = ({
  created_at,
}: {
  created_at: string;
}) => {
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0); // 초기 시간 값
  const noteData = useRecoilState(noteDataAtom);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  useEffect(() => {
    if (created_at) {
      const createdAt = new Date(created_at).getTime();

      const updateProgressAndTime = () => {
        const now = new Date().getTime();
        const timeElapsed = now - createdAt;
        const totalSecondsIn24Hours = 0.5 * 60 * 60 * 1000;
        const percentage = Math.min(
          (timeElapsed / totalSecondsIn24Hours) * 100,
          100,
        );
        setProgress(percentage);

        const remainingTime = totalSecondsIn24Hours - timeElapsed;
        setTime(Math.max(remainingTime / 1000, 0)); // 초 단위로 남은 시간 설정
      };

      updateProgressAndTime(); // 초기 호출
      const interval = setInterval(updateProgressAndTime, 1000); // 1초마다 업데이트

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 클리어
    }
  }, [created_at]);

  return (
    <div className="flex w-full flex-col items-center justify-center px-8 pb-20 text-center">
      <Lottie
        style={{ width: "300px", height: "300px" }}
        animationData={WritingGif}
        loop={true}
      />
      <div className="flex w-full items-center justify-center">
        <div className="mr-2 w-[80%] self-center">
          <div className="w-[100%] rounded-2xl bg-[#e0e0e0]">
            <div
              className="h-3 rounded-2xl bg-[#76c7c0]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <div className="mb-6 mt-2 w-[20%] text-[#888]">
        {progress.toFixed(2)}%
      </div>
      <div className="mt-2">
        <div className="mb-4 text-lg font-bold">
          AI가 실시간으로 학습자료를 제작중입니다. 잠시만 기다려주세요
        </div>
        <strong>{formatTime(time)}</strong> min left(
        <strong>{progress.toFixed(2)}%</strong>) <br />
        <div>We appreciate your patience.</div>
      </div>
    </div>
  );
};
