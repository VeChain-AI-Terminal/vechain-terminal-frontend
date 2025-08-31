import TokenSwap from "@/components/swap-actions-components/TokenSwap";
import {
  CORE_TOKEN_ADDRESS,
  DUALCORE_TOKEN_ADDRESS,
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
        tokenOut={STCORE_TOKEN_ADDRESS}
        amount="1"
        slippagePct="0.5"
      />
    </div>
  );
}
