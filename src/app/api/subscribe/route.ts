import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { tier } = await req.json();
    const session = (await cookies()).get('user_session');

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!tier) {
      return NextResponse.json({ error: 'Tier is required' }, { status: 400 });
    }

    const email = session.value;
    const success = DB.updateUserTier(email, tier as any);

    if (!success) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, tier });
  } catch (error: any) {
    console.error('Subscription API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
