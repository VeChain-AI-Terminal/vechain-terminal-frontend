# Orange Terminal

AI co-pilot for Bitcoin on CORE blockchain, built with **Next.js**.

Orange Terminal solves the problem of fragmented, hard-to-navigate DeFi opportunities for BTC holders by integrating with the CORE protocol:

- Real-time DeFi data aggregation for staking, dual staking, lending/borrowing, and liquidity pools.
- AI-powered insights to analyze yield opportunities and recommend optimal strategies.
- One-click transactions that let users execute DeFi actions directly from the AI interface.

---

## 1) Prerequisites

- **Node.js** ≥ 18.17 (LTS recommended)
- **pnpm** ≥ 8 (or npm ≥ 9 / yarn ≥ 1.22)
- **Git**
- **Env Variables as mentioned in `.env.example`**

---

## 2) Quick Start

```bash
# 1) Install dependencies
pnpm install

# 2) Copy environment variables
cp .env.example .env.local
# Fill in values as per your configuration

# 3) Start the development server
pnpm dev
# Runs on http://localhost:3000

# 4) Optional checks
pnpm typecheck
pnpm lint
```

---

## 3) Scripts

```jsonc
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "tsx lib/db/migrate && next build",
    "start": "next start",
    "lint": "next lint && biome lint --write --unsafe",
    "lint:fix": "next lint --fix && biome lint --write --unsafe",
    "format": "biome format --write",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "npx tsx lib/db/migrate.ts",
    "db:studio": "drizzle-kit studio",
    "db:push": "drizzle-kit push",
    "db:pull": "drizzle-kit pull",
    "db:check": "drizzle-kit check",
    "db:up": "drizzle-kit up",
    "test": "export PLAYWRIGHT=True && pnpm exec playwright test"
  }
}
```

---

## 4) Project Architecture

**Framework**

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- lucide-react, framer-motion

**AI Layer**

- Vercel AI SDK for streaming AI responses.
- GPT fine-tuned for Core DeFi context integrated with real-time data tools

**Blockchain Tools**

- wagmi + viem for on-chain reads/writes
- Reown AppKit for wallet connection

**DeFi Integrations**

- Staking (Core staking APIs + CoreAgent contract).
- Lending/borrowing.
- Liquidity pool stats and transaction builders.
- Transactions via smart contract calls through connected wallets.

---

## 5) Development Notes

- **Auth**: Current flow uses NextAuth + Reown SIWE.
- **Chain Safety**: Default to mainnet (`1116`). You can change it by changing the CHAIN_ID var in `lib/constants.ts` file.

---

## 6) For Adding Tool & Action Conventions

Each blockchain/DeFi action is implemented as a “tool”:
For adding a new tool follow the below steps:

1. Make your tool using ai sdk in the `/lib/ai/tools` folder
2. add the tool to the ai agent in the `/app/(chat)/api/chat/route.ts` file
3. add an appropriate prompt to tell the ai about this tool in the `/lib/ai/prompts.ts` file
4. for showing messages while the tool is being called or after the tool has finished, you can add it in the `/components/message.tsx` file.

---
