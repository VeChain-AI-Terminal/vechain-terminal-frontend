import { tool } from "ai";
import { z } from "zod";
import { toUnits } from "@/lib/utils/to-units";

// const nfts = [
//   {
//     id: "5ff5ba64e33b76be443ba28020892330",
//     contract_id: "0x07674a6f673d71157e3486d9b09c8c5f2bbbc6bc",
//     inner_id: "589",
//     chain: "core",
//     name: "#589",
//     description: null,
//     content_type: null,
//     content: "",
//     thumbnail_url: "",
//     total_supply: 1,
//     detail_url: null,
//     attributes: [],
//     collection_id: "core:0x07674a6f673d71157e3486d9b09c8c5f2bbbc6bc",
//     is_core: false,
//     credit_score: 2074.2964088951885,
//     collection_name: "Nawa Core NFT Vault",
//     contract_name: "Nawa Core NFT Vault",
//     is_erc721: true,
//     amount: 1,
//   },
// ];
// const protocols = {
//   complex: [
//     {
//       id: "core_b14g",
//       chain: "core",
//       name: "b14g",
//       site_url: "https://app.b14g.xyz/",
//       logo_url:
//         "https://static.debank.com/image/project/logo_url/core_b14g/4029b481bbe33a49a9bd44b1321ecf09.png",
//       has_supported_portfolio: true,
//       tvl: 10289047.024404947,
//       portfolio_item_list: [Array],
//     },
//     {
//       id: "core_colend",
//       chain: "core",
//       name: "Colend",
//       site_url: "https://app-legacy.colend.xyz",
//       logo_url:
//         "https://static.debank.com/image/project/logo_url/core_colend/7ce7c50e8df7401901267df54bf465b8.png",
//       has_supported_portfolio: true,
//       tvl: 128214060.81802996,
//       portfolio_item_list: [Array],
//     },
//     {
//       id: "core_coredao",
//       chain: "core",
//       name: "Core Dao",
//       site_url: "https://coredao.org/",
//       logo_url:
//         "https://static.debank.com/image/core_token/logo_url/core/1a7becfe112c0c9bfc25628cd70e94a6.png",
//       has_supported_portfolio: true,
//       tvl: 177262725.17637667,
//       portfolio_item_list: [Array],
//     },
//     {
//       id: "core_nawafi",
//       chain: "core",
//       name: "Nawa",
//       site_url: "https://www.nawa.finance",
//       logo_url:
//         "https://static.debank.com/image/project/logo_url/core_nawafi/d2afd147ac082c363b49d952f808f81f.png",
//       has_supported_portfolio: true,
//       tvl: 11104161.276982188,
//       portfolio_item_list: [Array],
//     },
//     {
//       id: "core_solv",
//       chain: "core",
//       name: "Solv",
//       site_url: "https://solv.finance",
//       logo_url:
//         "https://static.debank.com/image/project/logo_url/solv/4366650a7b1549194c4115c3be635176.png",
//       has_supported_portfolio: true,
//       tvl: 39015608.67047416,
//       portfolio_item_list: [Array],
//     },
//   ],
// };
// const tokensData = {
//   tokens: [
//     {
//       token_address: "0x5821fc584f8c67b1383bcb3777c9412a4ab002b9",
//       name: "Corepilot Staked CORE",
//       symbol: "pCORE",
//       decimals: 18,
//       logo_url: null,
//       balance: "989429162812163000",
//       price: 0,
//       price_24h_change: null,
//       total_supply: 215.72597883743532,
//       usd_value: 0,
//     },
//     {
//       token_address: "0x5b1fb849f1f76217246b8aaac053b5c7b15b7dc3",
//       name: "Free Bridged SolvBTC.b",
//       symbol: "SolvBTC.b",
//       decimals: 18,
//       logo_url:
//         "https://static.debank.com/image/core_token/logo_url/0x5b1fb849f1f76217246b8aaac053b5c7b15b7dc3/31a6cb7216c2b772a41a8913cc36f2c0.png",
//       balance: "21889778845128",
//       price: 112266.97,
//       price_24h_change: 0.01057718593960883,
//       total_supply: 23.17593655453693,
//       usd_value: 2.4574991449126196,
//     },
//     {
//       token_address: "0x8f9d6649c4ac1d894bb8a26c3eed8f1c9c5f82dd",
//       name: "Aave Core USDC",
//       symbol: "aCoreUSDC",
//       decimals: 6,
//       logo_url: null,
//       balance: "1001186",
//       price: 0.9999000099990001,
//       price_24h_change: null,
//       total_supply: 2142285.781314,
//       usd_value: 1.001085891410859,
//     },
//     {
//       token_address: "0x900101d06a7426441ae63e9ab3b9b0f63be145f1",
//       name: "Tether USD",
//       symbol: "USDT",
//       decimals: 6,
//       logo_url:
//         "https://static.debank.com/image/eth_token/logo_url/0xdac17f958d2ee523a2206206994597c13d831ec7/464c0de678334b8fe87327e527bc476d.png",
//       balance: "518237",
//       price: 0.99991,
//       price_24h_change: -0.00028992172113530593,
//       total_supply: 3489615.475692,
//       usd_value: 0.51819035867,
//     },
//     {
//       token_address: "0x9410e8052bc661041e5cb27fdf7d9e9e842af2aa",
//       name: "SolvBTC Core",
//       symbol: "SolvBTC.CORE",
//       decimals: 18,
//       logo_url:
//         "https://static.debank.com/image/core_token/logo_url/0x9410e8052bc661041e5cb27fdf7d9e9e842af2aa/62dacff4a905b3557f0ead459e471af8.png",
//       balance: "3897216270946",
//       price: 112268.72,
//       price_24h_change: null,
//       total_supply: 348.40191364574025,
//       usd_value: 0.4375354823022806,
//     },
//     {
//       token_address: "0x9e99442af8eae003038cbd0d36d60a0ca7a0fbde",
//       name: "Colend STCORE",
//       symbol: "cSTCORE",
//       decimals: 18,
//       logo_url: null,
//       balance: "3871135865541786000",
//       price: 0.531416202,
//       price_24h_change: null,
//       total_supply: 9489839.66774874,
//       usd_value: 2.057184319092199,
//     },
//     {
//       token_address: "0xa4151b2b3e269645181dccf2d426ce75fcbdeca9",
//       name: "USD Coin",
//       symbol: "USDC",
//       decimals: 6,
//       logo_url:
//         "https://static.debank.com/image/eth_token/logo_url/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/fffcd27b9efff5a86ab942084c05924d.png",
//       balance: "10745",
//       price: 0.9999000099990001,
//       price_24h_change: 0.00009999000099986184,
//       total_supply: 1779386.30621,
//       usd_value: 0.010743925607439255,
//     },
//     {
//       token_address: "0xb3a8f0f0da9ffc65318aa39e55079796093029ad",
//       name: "Liquid staked CORE",
//       symbol: "stCORE",
//       decimals: 18,
//       logo_url:
//         "https://static.debank.com/image/core_token/logo_url/0xb3a8f0f0da9ffc65318aa39e55079796093029ad/a976676138ce90434c662b3eb225265c.png",
//       balance: "3127940139732854",
//       price: 0.531416202,
//       price_24h_change: null,
//       total_supply: 13820937.831580652,
//       usd_value: 0.0016622380691401822,
//     },
//     {
//       token_address: "0xc5555ea27e63cd89f8b227dece2a3916800c0f4f",
//       name: "b14g dual staking CORE",
//       symbol: "dualCORE",
//       decimals: 18,
//       logo_url:
//         "https://static.debank.com/image/core_token/logo_url/0xc5555ea27e63cd89f8b227dece2a3916800c0f4f/07a5be21dcb2fb613267050337281857.png",
//       balance: "807353988154074",
//       price: 0.5076490148753219,
//       price_24h_change: null,
//       total_supply: 18959525.558947567,
//       usd_value: 0.00040985245674207796,
//     },
//     {
//       token_address: "0xf06c8db5f143fc9359d6af8bd07adc845d2f3ef8",
//       name: "Aave Core WCORE",
//       symbol: "aCoreWCORE",
//       decimals: 18,
//       logo_url: null,
//       balance: "1492165363144",
//       price: 0.438,
//       price_24h_change: null,
//       total_supply: 69347744.64767677,
//       usd_value: 6.535684290570719e-7,
//     },
//     {
//       token_address: "core",
//       name: "CORE",
//       symbol: "CORE",
//       decimals: 18,
//       logo_url:
//         "https://static.debank.com/image/core_token/logo_url/core/1a7becfe112c0c9bfc25628cd70e94a6.png",
//       balance: "5657643285702487000",
//       price: 0.4382,
//       price_24h_change: 0.025509010063187374,
//       total_supply: 0,
//       usd_value: 2.4791792877948295,
//     },
//   ],
// };

// const staking = {
//   staking: {
//     stakedCORE: 1,
//     stakedHash: 0,
//     stakedBTC: 0,
//     pendingCOREReward: 0.000015348393016906,
//     pendingHashReward: 0,
//     pendingBTCReward: 0,
//     claimedCOREReward: 0,
//     claimedHashReward: 0,
//     claimedBTCReward: 0,
//     totalPendingReward: 0.000015348393016906,
//     totalClaimedReward: 0,
//   },
// };

export const getPortfolio = tool({
  description:
    "Get the portfolio for a Core wallet with fungibleTokens, nfts, defi protocols stats and stakingPortfolio.",
  inputSchema: z.object({
    walletAddress: z
      .string()
      .describe("wallet address of the wallet to fetch portfolio for."),
  }),
  execute: async ({ walletAddress }) => {
    console.log("getting portolfio for wallet ", walletAddress);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const endpoints = {
      protocols: `${baseUrl}/api/portfolio/protocols?address=${walletAddress}`,
      staking: `${baseUrl}/api/portfolio/staking?address=${walletAddress}`,
      nfts: `${baseUrl}/api/portfolio/nfts?address=${walletAddress}`,
      tokens: `${baseUrl}/api/portfolio/tokens?address=${walletAddress}`,
    };

    async function getJson(url: string) {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        // Turn non-OK into a rejection so allSettled captures it
        return "There was some error fetching porfolio, please try again.";
        // throw new Error(`HTTP ${res.status} for ${url}`);
      }
      return res.json();
    }

    const [protocolsR, stakingR, nftsR, tokensR] = await Promise.allSettled([
      getJson(endpoints.protocols),
      getJson(endpoints.staking),
      getJson(endpoints.nfts),
      getJson(endpoints.tokens),
    ]);

    // Helper to unwrap results safely
    const pick = <T>(
      r: PromiseSettledResult<T>,
      fallback: T,
      label: string
    ) => {
      if (r.status === "fulfilled") return r.value;
      console.warn(`${label} failed:`, r.reason);
      return fallback;
    };

    const protocols = pick(protocolsR, [], "protocols");
    const staking = pick(stakingR, [], "staking");
    const nfts = pick(nftsR, [], "nfts");
    const tokensData = pick(tokensR, { tokens: [] }, "tokens");

    console.log("protocols --- ", protocols);
    console.log("staking --- ", staking);
    console.log("nfts --- ", nfts);
    console.log("tokensData --- ", tokensData);

    const tokens = (tokensData?.tokens ?? []).map((t: any) => {
      const amount = toUnits(t.balance ?? "0", t.decimals ?? 18);
      const price = t.price ?? 0;
      const usdValue =
        typeof t.usd_value === "number" ? t.usd_value : amount * price;
      const change24hPercent =
        typeof t.price_24h_change === "number" ? t.price_24h_change * 100 : 0;

      return {
        token_address: t.token_address,
        logo: t.logo_url ?? null,
        name: t.name,
        symbol: t.symbol,
        price,
        amount,
        usdValue,
        change24hPercent,
      };
    });

    return {
      protocols,
      staking,
      nfts,
      tokens,
    };
  },
});
