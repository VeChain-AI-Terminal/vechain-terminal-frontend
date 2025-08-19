import Erc20ToErc20Swap from "@/components/molten/Erc20ToErc20Swap";
import Erc20ToNativeSwap from "@/components/molten/Erc20ToNativeSwap";
import NativeToErc20Swap from "@/components/molten/NativeToErc20Swap";
import React from "react";

export default function Page() {
  // Example tokens (Mainnet Core)
  const USDC = "0xa4151b2b3e269645181dccf2d426ce75fcbdeca9"; // 6 decimals
  const USDT = "0x900101d06a7426441ae63e9ab3b9b0f63be145f1"; // 6 decimals

  return (
    <div className="space-y-8 p-6">
      {/* Example: swap ERC20 -> ERC20 (USDT -> USDC) */}
      <Erc20ToErc20Swap tokenIn={USDC} tokenOut={USDT} />

      {/* Example: swap ERC20 -> Native (USDC -> CORE) */}
      <Erc20ToNativeSwap tokenIn={USDC} />

      {/* Example: swap Native -> ERC20 (CORE -> USDT) */}
      <NativeToErc20Swap tokenOut={USDC} />
    </div>
  );
}
