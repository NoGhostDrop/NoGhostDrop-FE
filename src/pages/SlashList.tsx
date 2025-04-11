import StatusBox from "@/components/StatusBox/StatusBox";
import React, { useEffect, useRef, useState } from "react";

const dummy = [
  {
    address: "0x42f8...d9ae",
    status: true,
    amount: 10,
  },
  {
    address: "0x42f8...d9ae",
    status: false,
    amount: 0,
  },
  {
    address: "0xab12...ffff",
    status: false,
    amount: 0,
  },
  {
    address: "0xab12...ffff",
    status: false,
    amount: 0,
  },
  {
    address: "0xab12...ffff",
    status: false,
    amount: 0,
  },
  {
    address: "0xab12...ffff",
    status: false,
    amount: 0,
  },
  {
    address: "0xab12...ffff",
    status: true,
    amount: 0,
  },
];

const SlashList = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [lastStatus, setLastStatus] = useState<boolean>(false);

  useEffect(() => {
    if (dummy.length > 0) {
      const lastItem = dummy[dummy.length - 1];
      setLastStatus(lastItem.status);
    }
  }, [dummy]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [dummy]);

  return (
    <div className="box-border flex h-[90vh] flex-col items-center justify-center bg-gradient-to-b from-[#1c1c1c] to-[#3a2f2f] px-6 py-12 text-white">
      <h1 className="h-[10vh] text-center text-2xl font-semibold">
        🪩 Airdrop Party Live Board
      </h1>

      <div
        ref={listRef}
        className="w-full max-w-4xl flex-1 space-y-4 overflow-auto"
      >
        {dummy.map((status) => {
          return (
            <StatusBox
              address={status.address}
              status={status.status}
              amount={status.amount}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SlashList;
