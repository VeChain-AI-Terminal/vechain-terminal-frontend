"use client";

import useSWR from "swr";
import { ComplexProtocol } from "@/app/api/portfolio/protocols/route";
import { ProtocolCard } from "./protocol/ProtocolCard";
import { ProtocolDetails } from "./protocol/ProtocolDetails";
import { fetcher } from "@/components/portfolio/Portfolio";

export default function ProtocolList({ address }: { address: string }) {
  const { data, error, isLoading } = useSWR<{ complex: ComplexProtocol[] }>(
    `/api/portfolio/protocols?address=${address}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="py-4 text-sm text-gray-400">Loading protocols...</div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-sm text-red-500">Failed to load protocols.</div>
    );
  }

  const protocols = data?.complex ?? [];

  return (
    <div>
      {/* top row of cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
        {protocols.map((p) => (
          <ProtocolCard
            key={p.id}
            name={p.name}
            logo_url={p.logo_url}
            netUsdValue={p.portfolio_item_list.reduce(
              (s, i) => s + i.stats.net_usd_value,
              0
            )}
          />
        ))}
      </div>

      {/* details view for each */}
      <div>
        {protocols.map((p) => (
          <ProtocolDetails key={p.id} protocol={p} />
        ))}
      </div>
    </div>
  );
}
