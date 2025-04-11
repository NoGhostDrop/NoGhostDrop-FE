import React from "react";
import { Button } from "../ui/button";
import { usePrivy } from "@privy-io/react-auth";

// import logo from "../../assets/logo.png";

const Header = () => {
  const { login, logout, user, authenticated } = usePrivy();

  return (
    <div className="flex h-[10vh] w-full items-center justify-between p-4">
      <div className="flex h-full items-center gap-2 text-2xl">
        {/* <img className="h-full rounded-full" src={logo} /> */}
        <div className="h-6 w-6 rounded-full border border-black bg-[#FF9632] font-semibold" />
        NoGhostDrop
      </div>
      <div>
        <Button
          variant="outline"
          className="border border-black bg-[#FF9632] hover:bg-[#28ac96]"
          onClick={() => {
            authenticated ? logout() : login();
          }}
        >
          {user?.wallet?.address
            ? `${user.wallet.address.slice(0, 7)}...${user.wallet.address.slice(
                -5,
              )}`
            : "Connect Wallet"}
        </Button>
      </div>
    </div>
  );
};

export default Header;
