"use client";

import useSWR from "swr";
import Image from "next/image";
import { format } from "date-fns";
import type { TransactionHistory } from "@/lib/types/debank";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TransactionHistoryComp({
  address,
  numberOfItems = 10,
}: {
  address: string;
  numberOfItems?: number;
}) {
  const { data, error, isLoading } = useSWR<TransactionHistory>(
    `/api/transaction-history?address=${address}&number_of_items=${numberOfItems}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="py-4 text-sm text-gray-400">
        Loading transaction history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-sm text-red-500">
        Failed to load transactions.
      </div>
    );
  }
  if (!data)
    return <div className="py-4 text-sm text-white">No transactions found</div>;

  return (
    <div className="space-y-4">
      {data.history_list.map((tx) => {
        const project = tx.project_id ? data.project_dict[tx.project_id] : null;

        // Detect approve
        let txTitle = tx.tx.name || tx.cate_id || "Transaction";
        if (tx.tx.name === "approve" && tx.token_approve) {
          const token = data.token_dict[tx.token_approve.token_id];
          const amount = tx.token_approve.value.toFixed(4);
          const symbol = token?.symbol ?? "";
          const projectName = project?.name ?? "";
          txTitle = `Approve ${amount} ${symbol} for ${projectName}`;
        }

        // Shorten txn hash
        const shortHash = `${tx.id.slice(0, 6)}...${tx.id.slice(-4)}`;
        const scanUrl = `https://scan.coredao.org/tx/${tx.id}`;

        return (
          <div key={tx.id} className="border-b pb-3">
            <div className="flex items-center justify-between">
              {/* Left section: time + logo + tx title */}
              <div className="flex items-center space-x-3">
                <div className="text-xs text-gray-500 w-32">
                  {format(new Date(tx.time_at * 1000), "dd/MM/yyyy HH:mm:ss")}
                </div>
                {project && (
                  <Image
                    src={project.logo_url}
                    alt={project.name}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium">{txTitle}</div>
                  {project && (
                    <div className="text-xs text-gray-500">{project.name}</div>
                  )}
                </div>
              </div>

              {/* Middle: sends/receives */}
              <div className="flex flex-col text-sm">
                {tx.sends.map((s, i) => {
                  const token = data.token_dict[s.token_id];
                  const usd = token?.price
                    ? (s.amount * token.price).toFixed(2)
                    : "-";
                  return (
                    <div key={i} className="text-red-500">
                      -{s.amount.toFixed(4)} {token?.symbol} (${usd})
                    </div>
                  );
                })}
                {tx.receives.map((r, i) => {
                  const token = data.token_dict[r.token_id];
                  const usd = token?.price
                    ? (r.amount * token.price).toFixed(2)
                    : "-";
                  return (
                    <div key={i} className="text-green-500">
                      +{r.amount.toFixed(4)} {token?.symbol} (${usd})
                    </div>
                  );
                })}
              </div>

              {/* Right: gas fee */}
              <div className="text-xs text-gray-500">
                Gas Fee {tx.tx.eth_gas_fee.toFixed(4)} CORE
              </div>
            </div>

            {/* Txn hash */}
            <div className=" text-xs text-gray-400 ">
              <a
                href={scanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {shortHash}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
