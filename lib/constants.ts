import { generateDummyPassword } from "./db/utils";

export const isProductionEnvironment = process.env.NODE_ENV === "production";
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = generateDummyPassword();

// VeChain network constants
export const VECHAIN_MAINNET_CHAIN_ID = 39;
export const VECHAIN_TESTNET_CHAIN_ID = 40;
export const CHAIN_ID = VECHAIN_TESTNET_CHAIN_ID;

// VeChain transaction limits
export const MAX_TRANSACTION_AMOUNT = 1000;

// VeChain native token
export const VET_TOKEN_ADDRESS = "0x0000000000000000000000000000000000564554"; // VET
export const VTHO_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000"; // VTHO
