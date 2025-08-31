import { generateDummyPassword } from "./db/utils";

export const isProductionEnvironment = process.env.NODE_ENV === "production";
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = generateDummyPassword();
export const CHAIN_ID = 1116;
// for staking, undelegate and transfer core
export const TESTNET_COREAGENT_CONTRACT_ADDRESS =
  "0x0000000000000000000000000000000000001011";
export const MAINNET_COREAGENT_CONTRACT_ADDRESS =
  "0x0000000000000000000000000000000000001011";

//for claiming rewards
export const TESTNET_PLEDGEAGENT_CONTRACT_ADDRESS =
  "0x0000000000000000000000000000000000001007";
export const MAINNET_PLEDGEAGENT_CONTRACT_ADDRESS =
  "0x0000000000000000000000000000000000001007";

export const MAX_TRANSACTION_AMOUNT = 1000;

export const COLEND_POOL_ADDRESS = "0x971A4AD43a98a0d17833aB8c9FeC25b93a38B9A3";
export const COLEND_WrappedTokenGatewayV3 =
  "0x95D6da01eBdb6b2cD8150dFd6368cab0D4e74788";

export const MOLTEN_SWAP_ROUTER = "0x832933BA44658C50ae6152039Cd30A6f4C2432b1";
export const MOLTEN_QUOTER = "0x20dA24b5FaC067930Ced329A3457298172510Fe7";

// --- Core Ecosystem Tokens ---
export const WCORE_TOKEN_ADDRESS = "0x191e94fa59739e188dce837f7f6978d84727ad01";

// --- Stablecoins ---
export const USDC_TOKEN_ADDRESS = "0xa4151b2b3e269645181dccf2d426ce75fcbdeca9";
export const USDT_TOKEN_ADDRESS = "0x900101d06a7426441ae63e9ab3b9b0f63be145f1";

// --- SolvBTC Variants ---
export const SOLVBTC_B_ADDRESS = "0x5b1fb849f1f76217246b8aaac053b5c7b15b7dc3"; // SolvBTC.b
export const SOLVBTC_M_ADDRESS = "0xe04d21d999faedf1e72ade6629e20a11a1ed14fa"; // SolvBTC.m
export const SOLVBTC_C_ADDRESS = "0x9410e8052bc661041e5cb27fdf7d9e9e842af2aa"; // SolvBTC.c

// --- Staked CORE ---
export const STCORE_TOKEN_ADDRESS =
  "0xb3a8f0f0da9ffc65318aa39e55079796093029ad";
export const DUALCORE_TOKEN_ADDRESS =
  "0xc5555eA27e63cd89f8b227deCe2a3916800c0f4F";

export const ALGEBRA_FACTORY =
  "0x74EfE55beA4988e7D92D03EFd8ddB8BF8b7bD597" as `0x${string}`;
