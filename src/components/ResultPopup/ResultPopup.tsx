import React, { useEffect, useState } from "react";

import "./ResultPopup.css";

interface ResultPopupProps {
  isReal: boolean;
  onClose: () => void;
}

const ResultPopup = ({ isReal, onClose }: ResultPopupProps) => {
  const [emojis, setEmojis] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    const emojiArray = Array.from({ length: 50 }, () => (isReal ? "🎈" : "👻"));
    setEmojis(emojiArray);
  }, [isReal]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="relative h-full w-full">
        <div className="absolute h-full w-full overflow-hidden">
          {emojis.map((emoji, index) => (
            <div
              key={index}
              className="animate-fall absolute text-9xl"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2 + 0.5}s`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
        <div className="absolute top-1/2 left-1/2 h-60 w-60 max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 shadow-lg">
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="mb-3 text-xl font-semibold">
              {isReal ? "Real Wallet! 🎉" : "Ghost Wallet!"}
            </h2>
            <div className="animate-spin-y text-9xl">
              {isReal ? "😆" : "👻"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPopup;
