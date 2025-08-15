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
- **Chain Safety**: Default to mainnet (`1116`). Cap certain actions in beta.

---

## 6) Tool & Action Conventions

Each blockchain/DeFi action is implemented as a “tool”:

- Validate inputs and chain id
- Never assume amounts — ask the user explicitly
- Return both machine-readable payloads and human-readable UI fields

---

## 7) Deployment

### Vercel

1. Connect repo to Vercel
2. Add all env vars from `.env` to Vercel Project Settings
3. Configure domain/DNS:
4. Deploy:

---

## 8) Troubleshooting

- **Wallet connect loops**: Check env variables, Reown Project ID and its domain.
- **Empty portfolio**: Ensure correct API keys and chain ids.

---

## 9) Security

- Do not commit `.env*` files
- Rotate keys if exposed
- Validate all transaction data before signing
