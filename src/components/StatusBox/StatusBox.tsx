import React from "react";

type StatusBoxProps = {
  address: string;
  status: boolean;
  amount: number;
};

const StatusBox = ({ address, status, amount }: StatusBoxProps) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-md transition-transform">
      <div className="flex flex-col items-start">
        <div className="text-left font-mono text-sm text-white/70">
          {address ? address : "Unkown Address"}
        </div>
        <div className="text-lg font-semibold">
          Status:{" "}
          {status ? (
            <span className="rounded-full bg-[#FF9632]/20 px-2 py-0.5 text-sm font-bold text-[#FF9632]">
              REAL
            </span>
          ) : (
            <span className="animate-pulse rounded-full bg-red-500/20 px-2 py-0.5 text-sm font-bold text-red-400">
              SLASHED
            </span>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-white/80">
          {status ? "Received" : "Blocked"}
        </div>
        {status ? (
          <div className="text-xl font-bold text-[#64DCC8]">{`+${amount} $HUMN`}</div>
        ) : (
          <div className="text-xl font-bold text-red-400">0 $HUMN</div>
        )}
      </div>
    </div>
  );
};

export default StatusBox;
