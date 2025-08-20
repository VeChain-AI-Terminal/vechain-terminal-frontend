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

export const WCORE_TOKEN_ADDRESS = "0x191e94fa59739e188dce837f7f6978d84727ad01";
