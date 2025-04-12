import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { ethers } from "ethers";

import example from "../assets/example.svg";

import { Loading, Success, Fail } from "@/components/DrawerContent";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { abi as airdropAbi } from "../abi/Airdrop.json";
const airdropAddress = import.meta.env.VITE_AIRDROP_ADDRESS || "";

// TODO : 점수 어떻게 받아올거?
export type ScoreStruct = {
  active_months?: number;
  tx_count?: number;
  unique_contracts?: number;
  avg_tx_value?: number;
  var_tx_value?: number;
  sig_diversity?: number;
};

const Airdrop = () => {
  const provider = new ethers.BrowserProvider(window.ethereum) || null;

  const { user } = usePrivy();
  const nav = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReal, setIsReal] = useState<boolean>(false);
  const [score, setScore] = useState<ScoreStruct>();

  const handleGetScore = async () => {
    // TODO : 점수 받아오기
    const newScore = {
      active_months: 3,
    };

    // TODO : 조건 충족 지갑이면 claim 가능하게 변경
    setIsReal(true);

    setScore(newScore);
    setIsLoading(false);
  };

  const handleClaim = async () => {
    if (!user?.wallet?.address) return;
    console.log(user.wallet.address);

    // TODO : eliza OS 에 post 날리기
    // try {
    //   const res = await axios.post("/api/claim", {
    //     address: user.wallet.address,
    //   });

    //   setIsLoading(false);
    //   console.log(res.data);
    // } catch (error) {
    //   console.error(error);
    // }

    // 직접 테스트
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const airdrop = new ethers.Contract(airdropAddress, airdropAbi, signer);
    const res2 = await airdrop.claim(
      "0xAC6854b9Ace33f3BFd970c494B857099AE8eF05D",
      signerAddress,
      ethers.parseUnits("0.5", 18),
    );
    console.log(res2);
  };

  return (
    <div className="flex w-full flex-col gap-10 p-4">
      <div>
        <div className="text-2xl font-semibold">👻 NoGhostDrop</div>
        <div className="text-lg text-[#28ac96]">
          Ghost wallets (farmers) are out. Real wallets only 🚀
        </div>
        <div
          className="mt-2 cursor-pointer underline transition-all hover:opacity-60"
          onClick={() => nav("/list")}
        >
          ➡️ Go to Live Board
        </div>
      </div>
      {/* <div>orange (#FF9632) / mint (#28ac96) / brown (#6E5032)</div> */}
      {/* qr ♤ ♧ † £ ¢<Button>Airdrop</Button> */}

      {/* card */}
      <div className="flex w-full justify-center">
        <div className="flex items-center justify-center rounded-xl bg-gray-100 backdrop-blur-sm">
          <div className="min-w-80 space-y-3 rounded-xl border border-white/40 bg-white/20 pt-6 text-center shadow-xl backdrop-blur-xl">
            <h2 className="text-xl font-semibold">AirDrop</h2>
            <div className="flex flex-col text-sm">
              Scan the QR code to claim your{" "}
              <div>
                <span className="font-bold text-[#FF9632]">$HUMN</span> token
              </div>
              and prove you’re real!
            </div>
            <img src={example} alt="QR Code" className="mx-auto w-full" />
            <div className="flex w-full text-[#28AC96]">
              <div
                className="w-full cursor-pointer border-t border-r p-3 hover:font-semibold"
                onClick={() => {
                  if (!user?.wallet?.address) return;
                  setIsDrawerOpen(true);
                  if (score) {
                    setIsDrawerOpen(true);
                  } else {
                    setIsLoading(true);
                    handleGetScore();
                  }
                }}
              >
                Get Score
              </div>
              <div
                className={`w-full border-t p-3 ${!isReal ? "text-gray-400" : "cursor-pointer hover:font-semibold"}`}
                onClick={handleClaim}
              >
                Claim
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* drawer */}
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Score Details</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
          <DrawerDescription className="p-4">
            {isLoading ? (
              <Loading />
            ) : score ? (
              <Success score={score} />
            ) : (
              <Fail />
            )}
          </DrawerDescription>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Airdrop;
