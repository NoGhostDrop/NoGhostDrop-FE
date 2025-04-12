import React, { useEffect, useState } from "react";
import { Progress } from "../ui/progress";

const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 100); // 100ms마다 progress 증가

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <div
        className="w-100 text-4xl"
        style={{ transform: `translateX(${progress - 15}%)` }} // progress에 따라 유령 이동
      >
        🪓👻
      </div>
      <Progress value={progress} className="w-100 border" />
      <span>Fetching wallet scores... Boo!</span>
    </div>
  );
};

export default Loading;
