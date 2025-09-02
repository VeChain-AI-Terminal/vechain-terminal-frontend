import TokenSwap from "@/components/swap-actions-components/TokenSwap";
import {
  CORE_TOKEN_ADDRESS,
  DUALCORE_TOKEN_ADDRESS,
  SOLVBTC_C_ADDRESS,
  SOLVBTC_M_ADDRESS,
  STCORE_TOKEN_ADDRESS,
  USDC_TOKEN_ADDRESS,
  USDT_TOKEN_ADDRESS,
  WCORE_TOKEN_ADDRESS,
} from "@/lib/constants";
import React from "react";

export default function page() {
  return (
    <div className="p-5">
      <TokenSwap
        tokenIn={CORE_TOKEN_ADDRESS}
        tokenOut={SOLVBTC_C_ADDRESS}
        amount="1"
        slippagePct="0.5"
      />
    </div>
  );
}
