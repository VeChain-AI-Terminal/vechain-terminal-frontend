import { NextRequest, NextResponse } from 'next/server';

// WanBridge API configuration
const WANBRIDGE_API = {
  mainnet: 'https://bridge-api.wanchain.org/api',
  testnet: 'https://bridge-api.wanchain.org/api/testnet'
};

const VECHAIN_GATEWAY = '0xa1Dd5cBF77e1E78C307ecbD7c6AEea90FC71499e';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fromChain,
      toChain,
      fromToken,
      toToken,
      fromAccount,
      toAccount,
      amount,
      partner = 'vechain-ai-app'
    } = body;

    // Validate required fields
    if (!fromChain || !toChain || !fromToken || !toToken || !fromAccount || !toAccount || !amount) {
      return NextResponse.json({
        success: false,
        error: 'Missing required bridge parameters'
      }, { status: 400 });
    }

    // Use testnet by default, can be made configurable
    const apiUrl = WANBRIDGE_API.testnet;
    
    const requestBody = {
      fromChain,
      toChain,
      fromToken,
      toToken,
      fromAccount,
      toAccount,
      amount,
      partner
    };

    console.log('Creating bridge transaction:', requestBody);

    const response = await fetch(`${apiUrl}/createTx2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();

    if (!result.success) {
      console.error('Bridge API error:', result);
      return NextResponse.json({
        success: false,
        error: result.error || 'Bridge transaction creation failed'
      }, { status: 400 });
    }

    const txData = result.data.tx;
    const approveCheck = result.data.approveCheck;

    // VeChain-specific response formatting
    if (fromChain === 'VET') {
      return NextResponse.json({
        success: true,
        platform: 'VeChain',
        gatewayAddress: VECHAIN_GATEWAY,
        transaction: {
          to: txData.to,
          value: txData.value || '0x0',
          data: txData.data,
        },
        approveRequired: approveCheck ? {
          token: approveCheck.token,
          spender: approveCheck.to,
          amount: approveCheck.amount,
          note: 'Execute approval first using VeChain wallet'
        } : null,
        receiveAmount: result.data.receiveAmount,
        feeAndQuota: result.data.feeAndQuota,
        txDataDetail: result.data.txDataDetail,
        instructions: [
          approveCheck ? '1. First approve token spending (use VeWorld or wallet)' : null,
          approveCheck ? '2. Wait for approval confirmation' : null,
          `${approveCheck ? '3' : '1'}. Sign and send the bridge transaction`,
          `${approveCheck ? '4' : '2'}. Monitor status using the transaction hash`
        ].filter(Boolean),
        note: 'Use DAppKit or VeWorld to sign this transaction. The gateway contract handles the cross-chain logic.'
      });
    }

    // Standard EVM chains response
    return NextResponse.json({
      success: true,
      platform: 'EVM',
      transaction: {
        from: fromAccount,
        to: txData.to,
        value: txData.value || '0x0',
        data: txData.data,
        chainId: result.data.chainId
      },
      approveRequired: approveCheck ? {
        token: approveCheck.token,
        spender: approveCheck.to,
        amount: approveCheck.amount
      } : null,
      receiveAmount: result.data.receiveAmount,
      feeAndQuota: result.data.feeAndQuota,
      txDataDetail: result.data.txDataDetail,
      message: `Bridge ${amount} from ${fromChain} to ${toChain}`
    });

  } catch (error) {
    console.error('Bridge transaction error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown bridge error'
    }, { status: 500 });
  }
}