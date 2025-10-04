"use client";

import { useWallet } from "@vechain/vechain-kit";
import { useClientMounted } from "@/hooks/useClientMount";

export const InfoList = () => {
  const { account, connection, smartAccount } = useWallet();
  const mounted = useClientMounted();

  return !mounted ? null : (
    <div className="bg-gray-100 p-5 rounded-lg shadow-md">
      <section>
        <h2 className="mb-4 text-gray-800">Account Information</h2>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Address: {account?.address || 'Not connected'}
        </div>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Connected: {connection.isConnected.toString()}
        </div>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Network: {connection.network}
        </div>
        <div className="mb-2 p-2 bg-white rounded shadow-sm">
          Connection Source: {String(connection.source)}
        </div>
        {smartAccount?.address && (
          <div className="mb-2 p-2 bg-white rounded shadow-sm">
            Smart Account: {smartAccount.address}
          </div>
        )}
      </section>
    </div>
  );
};
