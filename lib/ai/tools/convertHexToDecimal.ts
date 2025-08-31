import { tool } from "ai";
import { z } from "zod";

export const convertHexToDecimal = tool({
  description: "Get the decimal form of any hex number",
  inputSchema: z.object({
    hexNumber: z.string().describe("The hex number with the prefix 0x"),
  }),
  execute: async ({ hexNumber }) => {
    console.log("convertHexToDecimal", hexNumber);

    // // Normalize input (remove 0x if present)
    // const normalizedHex = hexNumber.startsWith("0x")
    //   ? hexNumber.slice(2)
    //   : hexNumber;

    // Convert to decimal
    const decimalValue = Number(hexNumber);
    console.log("decimal value --- ", decimalValue);

    return { decimal: decimalValue };
  },
});
