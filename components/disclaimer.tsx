import React from "react";

export default function Disclaimer() {
  return (
    <div className="text-xs text-muted-foreground text-center w-full">
      <p>
        Orange Terminal &#40;beta&#41;: Search on-chain. Send tokens. Not
        financial advice — <span className="text-theme-orange">DYOR</span>.
      </p>
      {/* <p>It is NOT a financial advisor.</p> */}
    </div>
  );
}
