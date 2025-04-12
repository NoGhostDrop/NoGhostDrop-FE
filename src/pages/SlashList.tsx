import React, { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import StatusBox from "@/components/StatusBox/StatusBox";

import { abi as airdropAbi } from "../abi/Airdrop.json";
const airdropAddress = import.meta.env.VITE_SAGA_AIRDROP_ADDRESS || "";

const SlashList = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [lastStatus, setLastStatus] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);

  // useEffect(() => {
  //   if (dummy.length > 0) {
  //     const lastItem = dummy[dummy.length - 1];
  //     setLastStatus(lastItem.status);
  //   }
  // }, [dummy]);

  useEffect(() => {
    console.log(events);
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [events]);

  useEffect(() => {
    const fetchPastEvents = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        airdropAddress,
        airdropAbi,
        provider,
      );

      // 과거 이벤트 가져오기
      const filter = contract.filters.Claimed();
      const logs = await provider.getLogs({
        ...filter,
        fromBlock: 0, // 시작 블록 번호
        toBlock: "latest", // 최신 블록까지
      });

      const pastEvents = logs
        .map((log) => contract.interface.parseLog(log))
        .filter((parsedLog) => parsedLog && parsedLog.args.token)
        .map((parsedLog) => {
          console.log(parsedLog);
          if (parsedLog) {
            return {
              token: parsedLog.args.token,
              to: parsedLog.args.user,
              amount: ethers.formatUnits(parsedLog.args.amount, 18),
            };
          }
        });

      setEvents(pastEvents);
    };

    fetchPastEvents();

    // 실시간 이벤트 구독
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(airdropAddress, airdropAbi, provider);

    const handleClaimedEvent = (
      token: string,
      to: string,
      amount: ethers.BigNumberish,
    ) => {
      const formattedAmount = ethers.formatUnits(amount, 18);
      setEvents((prevEvents) => {
        const isDuplicate = prevEvents.some(
          (event) =>
            event.token === token &&
            event.to === to &&
            event.amount === formattedAmount,
        );
        if (!isDuplicate) {
          return [...prevEvents, { token, to, amount: formattedAmount }];
        }
        return prevEvents;
      });
    };

    contract.on("Claimed", handleClaimedEvent);

    return () => {
      contract.off("Claimed", handleClaimedEvent);
    };
  }, []);

  return (
    <div className="box-border flex h-[90vh] flex-col items-center justify-center bg-gradient-to-b from-[#1c1c1c] to-[#3a2f2f] px-6 py-12 text-white">
      <h1 className="h-[10vh] text-center text-2xl font-semibold">
        🪩 Airdrop Party Live Board
      </h1>

      <div
        ref={listRef}
        className="w-full max-w-4xl flex-1 space-y-4 overflow-auto"
      >
        {events.length > 0 &&
          events.map((status, index) => {
            console.log(status);
            return (
              <StatusBox
                key={index}
                address={status.to}
                status={true}
                amount={status.amount}
              />
            );
          })}
      </div>
    </div>
  );
};

export default SlashList;
