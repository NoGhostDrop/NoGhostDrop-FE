import React, { useState } from "react";
import { Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

import { ScoreStruct } from "@/pages/Airdrop";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface SuccessProps {
  score: ScoreStruct[];
  isReal: boolean;
}

const Success = ({ score, isReal }: SuccessProps) => {
  const [content, setContent] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const data = {
    labels: score.map((s) => s.criteria),
    datasets: [
      {
        label: "Score",
        data: score.map((s) => Number(s.score)),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const handleSend = async () => {
    // TODO : chatbot
    setAnswer("Try sending bridge transactions!");
  };

  return (
    <div className="flex flex-col justify-between gap-4">
      <div className="p-8">
        <Bar data={data} />
        {/* <Radar data={data} /> */}
        {/* {score.map((s) => {
          return (
            <div>
              <div>{s.Criteria}</div>
              <div>{s.Score}</div>
            </div>
          );
        })} */}
      </div>
      {!isReal && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 px-8">
            <Input
              placeholder="Ask for advice on looking like a real user wallet!"
              onChange={(e) => setContent(e.target.value)}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
          {answer && <div className="px-8">Eliza's answer : {answer}</div>}
        </div>
      )}
    </div>
  );
};

export default Success;
