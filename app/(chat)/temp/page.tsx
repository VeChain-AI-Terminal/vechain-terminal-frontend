import NativeToErc20Swap from "@/components/swap-actions-components/NativeToErc20Swap";
import React from "react";

export default function Page() {
  // Example tokens (Mainnet Core)
  const USDC = "0xa4151b2b3e269645181dccf2d426ce75fcbdeca9"; // 6 decimals
  const STCORE = "0xb3a8f0f0da9ffc65318aa39e55079796093029ad"; // 6 decimals
  const USDT = "0x900101d06a7426441ae63e9ab3b9b0f63be145f1"; // 6 decimals

  return (
    <div className="space-y-8 p-6">
      {/* Example: swap Native -> ERC20 (CORE -> USDT) */}
      <NativeToErc20Swap tokenOut={STCORE} amount="2" />
    </div>
  );
}
