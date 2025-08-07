"use client";

import { useEffect } from "react";
import {
  useAppKitState,
  useAppKitTheme,
  useAppKitEvents,
  useAppKitAccount,
  useWalletInfo,
} from "@reown/appkit/react";
import { useClientMounted } from "@/hooks/useClientMount";

export const InfoList = () => {
  const { address, caipAddress, isConnected, embeddedWalletInfo } =
    useAppKitAccount();
  const state = useAppKitState();
  const events = useAppKitEvents();
  const walletInfo = useWalletInfo();
  const mounted = useClientMounted();
  useEffect(() => {
    console.log("Events: ", events);
  }, [events]);

  return !mounted ? null : (
    <div className="bg-gray-100 p-5 rounded-lg shadow-md">
      <section>
        <h2 className="mb-4 text-gray-800">Account Information</h2>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Address: {address}
        </div>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          caip Address: {caipAddress}
        </div>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Connected: {isConnected.toString()}
        </div>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Account Type: {embeddedWalletInfo?.accountType}
        </div>
        {embeddedWalletInfo?.user?.email && (
          <div className="mb-2 p-2 bg-white rounded shadow-sm">
            Email: {embeddedWalletInfo?.user?.email}
          </div>
        )}
        {embeddedWalletInfo?.user?.username && (
          <div className="mb-2 p-2 bg-white rounded shadow-sm">
            Username: {embeddedWalletInfo?.user?.username}
          </div>
        )}
        {embeddedWalletInfo?.authProvider && (
          <div className="mb-2 p-2 bg-white rounded shadow-sm">
            Provider: {embeddedWalletInfo?.authProvider}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-gray-800">State Information</h2>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Active Chain: {state.activeChain}
        </div>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Open: {state.open.toString()}
        </div>
      </section>
    </div>
  );
};
