import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { abi as erc20Abi } from "../abi/ERC20.json";
import { abi as airdropAbi } from "../abi/Airdrop.json";
// const airdropAddress = import.meta.env.VITE_AIRDROP_ADDRESS || "";
const airdropAddress = import.meta.env.VITE_SAGA_AIRDROP_ADDRESS || "";

const Create = () => {
  // TODO : provider 변경
  //   const provider = new ethers.JsonRpcProvider(rpc_url) || null;
  const provider = new ethers.BrowserProvider(window.ethereum) || null;
  const [chainId, setChainId] = useState<bigint>();
  const [symbol, setSymbol] = useState<string>("");
  const [gasFee, setGasFee] = useState<string>("");

  //   const [tokenType, setTokenType] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [distributionType, setDistributionType] = useState("fixed");
  const [distributionContent, setDistributionContent] = useState("");

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    const getChainId = async () => {
      if (provider == null) return;
      const network = await provider.getNetwork();
      setChainId(network.chainId);

      switch (network.chainId) {
        case BigInt(1):
          setSymbol("ETH");
          break;
        case BigInt(31):
          setSymbol("RBTC");
          break;
        default:
          setSymbol("ETH");
      }
    };
    getChainId();
  }, [provider]);

  useEffect(() => {
    const fetchFee = async () => {
      if (!provider || !totalAmount || !distributionContent) return;
      const gasPrice = await provider.send("eth_gasPrice", []);
      const expectedFee = await calculateFee(gasPrice);
      setGasFee(expectedFee);
    };
    fetchFee();
  }, [provider, totalAmount, distributionContent]);

  const calculateFee = async (gasPriceHex: string) => {
    const gasLimitPerTransfer = 50000; // ERC20 전송에 필요한 가스 한도
    const distributionCount = parseFloat(distributionContent) || 1;
    const totalAmountNum = parseFloat(totalAmount) || 0;

    const numWallets = Math.ceil(totalAmountNum / distributionCount);
    // console.log("num wallets:", numWallets);

    const totalGas = BigInt(gasLimitPerTransfer * numWallets); // 단일 전송 가스 * 지갑 수
    const gasPriceWei = BigInt(gasPriceHex);

    const totalFeeWei = totalGas * gasPriceWei; // 총 예상 가스비 (Wei)
    const bufferFeeWei = totalFeeWei + totalFeeWei / BigInt(20); // 5% buffer

    const totalFeeEth = ethers.formatEther(bufferFeeWei);

    return totalFeeEth;
  };

  const handleCreate = async () => {
    if (!provider || !tokenAddress || !totalAmount || !distributionContent)
      return;

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);

      const signer = await provider.getSigner();
      console.log(await signer.getAddress());

      const erc20 = new ethers.Contract(tokenAddress, erc20Abi, signer);
      const airdrop = new ethers.Contract(airdropAddress, airdropAbi, signer);

      setIsApproving(true);
      setStatus("Approving tokens...");
      const res1 = await erc20.approve(
        airdropAddress,
        ethers.parseUnits(totalAmount, 18),
        {
          gasLimit: 100000,
        },
      );
      //   console.log(res1);
      await res1.wait();
      setStatus("Creating airdrop...");

      const res2 = await airdrop.createAirdrop(
        tokenAddress,
        ethers.parseUnits(totalAmount, 18),
        {
          value: ethers.parseEther(gasFee),
          gasLimit: 300000,
        },
      );
      //   console.log(res2);
      const receipt = await res2.wait();
      console.log(receipt);

      // if (res) {
      //   // TODO : elizaOS 서버에 생성된 에어드랍 정보 전달
      //   // 토큰 주소, 수량, 분배 기준 등
      //   await axios.post("https://elizaos.ai/api/create", {
      //     tokenAddress: tokenAddress,
      //     totalAmount: totalAmount,
      //     distributionContent: distributionContent,
      //   });
      // }
      setStatus("Airdrop created successfully!");
    } catch (err: any) {
      console.error(err);
      setError("Error: " + err.message);
    } finally {
      //   setIsApproving(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-10 p-4">
      <div>
        <div className="text-2xl font-semibold">👻 NoGhostDrop</div>
        <div className="text-lg text-[#28ac96]">
          Ghost wallets (farmers) are out. Real wallets only 🚀
        </div>
      </div>

      {/* card */}
      <div className="mx-auto w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-12 text-xl font-semibold">
          Create Airdrop
          {/* Create Airdrop ({chainId}) */}
        </h2>

        <Label>ChainId: {chainId}</Label>
        {/* <Label>Token Type</Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select token type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="erc20">ERC20</SelectItem>
            <SelectItem value="erc721">ERC721</SelectItem>
          </SelectContent>
        </Select> */}
        <Label>Token Address</Label>
        <Input
          className="w-full rounded border p-2"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
        <Label>Token Amount</Label>
        <Input
          className="w-full rounded border p-2"
          value={totalAmount}
          type="number"
          step="0.01"
          onChange={(e) => setTotalAmount(e.target.value)}
        />
        <Label>Token Amount Per Wallet</Label>
        <Select
          value={distributionType}
          onValueChange={(value) => setDistributionType(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select distribution type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">Fixed</SelectItem>
            <SelectItem value="contribution">Level of Contribution</SelectItem>
          </SelectContent>
        </Select>
        {distributionType === "fixed" && (
          <Input
            className="w-full rounded border p-2"
            placeholder="Enter fixed amount per wallet"
            type="number"
            step="0.01"
            onChange={(e) => setDistributionContent(e.target.value)}
          />
        )}
        {distributionType === "contribution" && (
          <>
            <Label>Distribution Criteria</Label>
            <Textarea
              className="resize-none"
              placeholder="- Minimum amount: 1 token
- Maximum amount: 99 tokens"
              onChange={(e) => setDistributionContent(e.target.value)}
            />
          </>
        )}

        <Label>Eligibility Criteria</Label>
        {/* <div className="flex w-full flex-col text-left text-sm text-black/50">
          <div className="font-semibold">default criteria</div>
          <div>- blahblah</div>
        </div> */}
        <Textarea
          className="resize-none"
          placeholder="Write your own eligibility criteria. For example:
- At least 3 months of wallet age
- Must have made at least 5 transactions
- No suspicious transfer patterns"
        />

        {parseInt(gasFee) >= 0 && (
          <div className="w-full rounded bg-[#d7fff8] py-1 text-sm text-[#28ac96]">
            Estimated Total Fee:{" "}
            {gasFee ? `${gasFee} ${symbol}` : "calculating..."}
          </div>
        )}
        <Button
          className={`w-full border border-black bg-[#FF9632] text-black hover:bg-[#28ac96] ${isApproving ? "bg-gray-400 hover:bg-gray-400" : ""}`}
          onClick={handleCreate}
          disabled={isApproving}
        >
          {isApproving ? status : "Approve & Create Airdrop"}
        </Button>
        {error && <div className="w-full text-red-900">{error}</div>}
      </div>
    </div>
  );
};

export default Create;
