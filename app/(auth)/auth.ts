// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import credentialsProvider from "next-auth/providers/credentials";
import { createPublicClient, http } from "viem";
import {
  getChainIdFromMessage,
  getAddressFromMessage,
} from "@reown/appkit-siwe";
import { upsertUserByAddress } from "@/lib/db/queries";

declare module "next-auth" {
  interface Session {
    user: { id: string; type: "regular"; address: string };
    chainId?: number;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    type: "regular";
    address: string;
    chainId: number;
  }
}

const nextAuthSecret = process.env.AUTH_SECRET!;
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    credentialsProvider({
      name: "Ethereum",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(creds) {
        if (!creds?.message || !creds?.signature) return null;

        const message = creds.message as string;
        const signature = creds.signature as `0x${string}`;
        const address = getAddressFromMessage(message);
        const chainId = getChainIdFromMessage(message);

        const publicClient = createPublicClient({
          transport: http(
            `https://rpc.walletconnect.org/v1/?chainId=${chainId}&projectId=${projectId}`
          ),
        });
        const ok = await publicClient.verifyMessage({
          message,
          address: address as `0x${string}`,
          signature,
        });
        if (!ok) return null;

        const dbUser = await upsertUserByAddress(address);
        return {
          id: dbUser.id,
          type: "regular",
          address: dbUser.address,
          chainId,
        };
      },
    }),
  ],
  secret: nextAuthSecret,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = (user as any).id;
        token.type = "regular";
        token.address = (user as any).address;
        token.chainId = (user as any).chainId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.userId as string,
        type: "regular",
        address: token.address as string,
      };
      session.chainId = token.chainId as number;
      return session;
    },
  },
});
