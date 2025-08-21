import Image from "next/image";
import { ComplexProtocol } from "@/app/api/portfolio/protocols/route";

function fmtUSD(v: number) {
  return `$${v.toFixed(2)}`;
}

function formatHealthRate(value: number): string {
  if (!Number.isFinite(value)) return "-";
  if (value > 10) return ">10"; // cap it
  return value.toFixed(2);
}

export function ProtocolDetails({ protocol }: { protocol: ComplexProtocol }) {
  console.log("protocol ---- ", protocol);
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 relative">
            <Image
              src={protocol.logo_url}
              alt={protocol.name}
              fill
              className="object-contain rounded-full"
            />
          </div>
          <a
            href={protocol.site_url}
            target="_blank"
            rel="noreferrer"
            className="text-lg font-semibold text-blue-600 hover:underline"
          >
            {protocol.name}
          </a>
        </div>
        <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {fmtUSD(
            protocol.portfolio_item_list.reduce(
              (s, i) => s + i.stats.net_usd_value,
              0
            )
          )}
        </div>
      </div>

      {/* Portfolio items */}
      {protocol.portfolio_item_list.map((item, idx) => (
        <div key={idx} className="mb-6">
          <div>
            <div className="bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold px-3 py-1 rounded-md inline-block mb-2">
              {item.name}
            </div>
            <div className=" text-sm font-semibold px-3 py-1 rounded-md inline-block mb-2">
              {item.detail.description}
            </div>
          </div>

          {/* Health rate if lending */}
          {typeof item.detail.health_rate === "number" && (
            <div className="text-sm mb-3 flex items-center gap-2">
              <span className="text-zinc-500">Health Rate</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold tabular-nums ${item.detail.health_rate}`}
              >
                {formatHealthRate(item.detail.health_rate)}
              </span>
            </div>
          )}

          {/* Supply tokens */}
          {item.detail.supply_token_list &&
            item.detail.supply_token_list.length > 0 && (
              <div className="mb-3">
                <div className="text-sm font-medium mb-2">Supplied</div>
                {item.detail.supply_token_list.map((t, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800/40 rounded-md px-3 py-2 mb-1"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 relative">
                        <Image
                          src={t.logo_url}
                          alt={t.symbol}
                          fill
                          className="object-contain rounded-full"
                        />
                      </div>
                      <span className="font-medium">{t.symbol}</span>
                    </div>
                    <div className="flex items-center gap-8 text-sm">
                      <span>
                        {t.amount.toFixed(4)} {t.symbol}
                      </span>
                      <span>{fmtUSD(t.amount * (t.price ?? 0))}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          {/* Borrow tokens */}
          {item.detail.borrow_token_list &&
            item.detail.borrow_token_list.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Borrowed</div>
                {item.detail.borrow_token_list.map((t, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800/40 rounded-md px-3 py-2 mb-1"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 relative">
                        <Image
                          src={t.logo_url}
                          alt={t.symbol}
                          fill
                          className="object-contain rounded-full"
                        />
                      </div>
                      <span className="font-medium">{t.symbol}</span>
                    </div>
                    <div className="flex items-center gap-8 text-sm">
                      <span>
                        {t.amount.toFixed(4)} {t.symbol}
                      </span>
                      <span>{fmtUSD(t.amount * (t.price ?? 0))}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      ))}
    </div>
  );
}
