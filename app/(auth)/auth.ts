// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import credentialsProvider from "next-auth/providers/credentials";
import { createPublicClient, http, SignableMessage } from "viem";
import {
  getChainIdFromMessage,
  getAddressFromMessage,
  SIWESession,
} from "@reown/appkit-siwe";
import { getUser, upsertUserByAddress } from "@/lib/db/queries";

declare module "next-auth" {
  interface Session extends SIWESession {
    user: {
      id: string;
    };
    address: string;
    chainId: number;
  }
}

const nextAuthSecret = process.env.AUTH_SECRET!;
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!;

const providers = [
  credentialsProvider({
    name: "Ethereum",
    credentials: {
      message: {
        label: "Message",
        type: "text",
        placeholder: "0x0",
      },
      signature: {
        label: "Signature",
        type: "text",
        placeholder: "0x0",
      },
    },
    async authorize(credentials) {
      try {
        if (!credentials?.message) {
          throw new Error("SiweMessage is undefined");
        }
        const { message, signature } = credentials;
        const address = getAddressFromMessage(message as string);
        const chainId = getChainIdFromMessage(message as string);

        // for the moment, the verifySignature is not working with social logins and emails  with non deployed smart accounts
        /*  const isValid = await verifySignature({
          address,
          message,
          signature,
          chainId,
          projectId,
        }); */
        // we are going to use https://viem.sh/docs/actions/public/verifyMessage.html
        const publicClient = createPublicClient({
          transport: http(
            `https://rpc.walletconnect.org/v1/?chainId=${chainId}&projectId=${projectId}`
          ),
        });
        const isValid = await publicClient.verifyMessage({
          message: message as SignableMessage,
          address: address as `0x${string}`,
          signature: signature as `0x${string}`,
        });
        // end o view verifyMessage

        if (isValid) {
          return {
            id: `${chainId}:${address}`,
          };
        }

        return null;
      } catch (e) {
        return null;
      }
    },
  }),
];

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  secret: nextAuthSecret,
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const parts = user.id.split(":");
        let chainId, address;

        if (parts.length === 3 && parts[0] === "eip155") {
          [, chainId, address] = parts;
        } else if (parts.length === 2) {
          [chainId, address] = parts;
        }

        const dbUser = await upsertUserByAddress(address);

        token.address = address;
        token.chainId = Number(chainId);
        token.userId = dbUser.id;
        token.sub = `${chainId}:${address}`;
      }

      // Always return token so data persists between refreshes
      return token;
    },

    session({ session, token }) {
      if (token.address && token.chainId) {
        session.address = token.address as string;
        session.chainId = token.chainId as number;
        session.user = { id: token.userId as string };
      }
      // console.log("session", session);
      return session;
    },
  },
});
