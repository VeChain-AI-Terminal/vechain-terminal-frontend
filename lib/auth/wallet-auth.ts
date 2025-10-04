"use server";

import { upsertUserByAddress } from "@/lib/db/queries";
import type { User } from "@/lib/db/schema";

export async function authenticateWallet(address: string): Promise<User> {
  if (!address) {
    throw new Error("Wallet address is required");
  }
  
  return await upsertUserByAddress(address);
}