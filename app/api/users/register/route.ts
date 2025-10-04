import { NextRequest, NextResponse } from 'next/server';
import { upsertUserByAddress } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: 'Valid address is required' },
        { status: 400 }
      );
    }

    // Auto-register/find user by wallet address
    const user = await upsertUserByAddress(address);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        address: user.address,
      },
      message: 'User registered/found successfully'
    });

  } catch (error) {
    console.error('Error in user registration:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to register user',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}