import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    
    // This would integrate with your MCP server
    // For now, returning mock data structure
    const mockData = {
      nfts: [
        {
          tokenId: "1",
          level: 3,
          levelName: "Expert",
          vetAmountStaked: "10000",
          mintedAtBlock: "18500000",
          lastVthoClaimTimestamp: "1703088000",
          isDelegated: true,
          delegatedForever: false,
          accumulatedRewards: "125.5",
          claimableRewards: "25.75"
        },
        {
          tokenId: "2",
          level: 5,
          levelName: "Grandmaster",
          vetAmountStaked: "100000",
          mintedAtBlock: "18400000",
          lastVthoClaimTimestamp: "0",
          isDelegated: false,
          delegatedForever: false,
          accumulatedRewards: "0",
          claimableRewards: "0"
        }
      ],
      totalRewards: "125.5",
      totalStaked: "110000"
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error("Error fetching user StarGate data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}