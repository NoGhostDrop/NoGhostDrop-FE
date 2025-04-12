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
import ResultPopup from "@/components/ResultPopup/ResultPopup";
const airdropAddress = import.meta.env.VITE_SAGA_AIRDROP_ADDRESS || "";

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

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false); // drawer
  const [isLoading, setIsLoading] = useState<boolean>(false); // 온체인 데이터 로딩
  const [isReal, setIsReal] = useState<boolean>(false); // 허수지갑 여부
  const [score, setScore] = useState<ScoreStruct>();
  const [showPopup, setShowPopup] = useState(false);

  const handleGetScore = async () => {
    // TODO : 점수 받아오기
    try {
      const newScore = {
        active_months: 3,
      };
      // const response = await axios.get("/getScore", {
      //   params: { address: user?.wallet?.address },
      // });
      // const newScore = response.data;

      setScore(newScore);
      // TODO : 점수 여부에 따라
      if (newScore.active_months > 5) {
        setIsReal(true);
      } else {
        setIsReal(false);
      }
      setShowPopup(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!user?.wallet?.address) return;
    console.log(user.wallet.address);

    try {
      // TODO : eliza OS 에 post 날리기
      // const res = await axios.post("/api/claim", {
      //   address: user.wallet.address,
      // });
      // console.log(res.data);

      // 직접 테스트
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log(signerAddress);
      const airdrop = new ethers.Contract(airdropAddress, airdropAbi, signer);
      const res2 = await airdrop.claim(
        "0x459A979d6d7aaB6B6f85E5B51AD0e0C2896EDDed",
        signerAddress,
        ethers.parseUnits("1", 18),
        {
          gasLimit: 300000,
        },
      );
      console.log(res2);
      const receipt = await res2.wait();
      console.log(receipt);

      // TODO : 점수 넣기
      const newScore = {
        active_months: 3,
      };
      setScore(newScore);
      // TODO : 클레임 성공 여부 받아와서
      if (newScore.active_months > 1) {
        setIsReal(true);
      } else {
        setIsReal(false);
      }
      setShowPopup(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
                className={`w-full cursor-pointer border-t p-3 hover:font-semibold`}
                onClick={() => {
                  if (!user?.wallet?.address) return;
                  setIsDrawerOpen(true);
                  if (score) {
                    setIsDrawerOpen(true);
                  } else {
                    setIsLoading(true);
                    handleClaim();
                  }
                }}
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

      {isDrawerOpen && !isLoading && score && showPopup && (
        <ResultPopup isReal={isReal} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default Airdrop;
