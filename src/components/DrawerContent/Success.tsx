import { ScoreStruct } from "@/pages/Airdrop";
import React from "react";

interface SuccessProps {
  score: ScoreStruct;
}

const Success = ({ score }: SuccessProps) => {
  return <div className="h-[50vh]">{score.active_months}</div>;
};

export default Success;
