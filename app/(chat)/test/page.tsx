import React from "react";
import DepositEthComponent from "@/components/colend/colend-supply-core";
import SupplyErc20Component from "@/components/colend/colent-supply-erc20";

export default function page() {
  return (
    <div className="p-5 flex flex-col gap-2">
      <DepositEthComponent />
      <SupplyErc20Component />
    </div>
  );
}
