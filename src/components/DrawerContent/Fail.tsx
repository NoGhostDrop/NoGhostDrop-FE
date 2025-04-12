import React from "react";

const Fail = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <div className="text-4xl">🥲</div>
      <div>Sorry,</div>
      <span>Failed to get your wallet score.</span>
    </div>
  );
};

export default Fail;
