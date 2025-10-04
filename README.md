# VeChain Terminal

AI co-pilot for VeChain blockchain, built with **Next.js**.

VeChain Terminal provides AI-powered blockchain interactions for VeChain ecosystem:

- Real-time VeChain blockchain data and analytics.
- AI-powered insights for VeChain transactions and smart contracts.
- Seamless wallet integration with VeChain DApp Kit.

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
- GPT fine-tuned for VeChain context integrated with real-time blockchain data tools

**Blockchain Tools**

- VeChain SDK for on-chain reads/writes
- VeChain DApp Kit for wallet connection

**VeChain Integrations**

- VeChain blockchain data and transaction tools.
- Smart contract interactions.
- VTHO and VET token utilities.
- Transactions via VeChain wallets.

---

## 5) Development Notes

- **Auth**: Uses VeChain Kit for wallet authentication.
- **Network**: Configured for VeChain TestNet by default.

---

## 6) For Adding Tool & Action Conventions

Each blockchain/DeFi action is implemented as a “tool”:
For adding a new tool follow the below steps:

1. Make your tool using ai sdk in the `/lib/ai/tools` folder
2. add the tool to the ai agent in the `/app/(chat)/api/chat/route.ts` file
3. add an appropriate prompt to tell the ai about this tool in the `/lib/ai/prompts.ts` file
4. for showing messages while the tool is being called or after the tool has finished, you can add it in the `/components/message.tsx` file.

---
