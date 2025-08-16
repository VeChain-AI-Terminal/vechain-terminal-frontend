"use client";

import { useState, useEffect } from "react";

export const ConnectButton = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="border border-theme-orange rounded-full">
      <appkit-button size="sm" balance={isMobile ? "hide" : "show"} />
    </div>
  );
};
