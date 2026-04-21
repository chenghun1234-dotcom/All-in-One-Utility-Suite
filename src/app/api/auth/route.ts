import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { action, email, password } = await req.json();

    if (action === 'signup') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }
      const existingUser = DB.findUserByEmail(email);
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      const user = DB.createUser({
        email,
        tier: 'Basic',
        credits: 10
      });

      // Simulation: Set a session cookie
      (await cookies()).set('user_session', user.email, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      
      return NextResponse.json({ user: { email: user.email, tier: user.tier, credits: user.credits } });
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }
      const user = DB.findUserByEmail(email);
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      // Simulation: Set a session cookie
      (await cookies()).set('user_session', user.email, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

      return NextResponse.json({ user: { email: user.email, tier: user.tier, credits: user.credits } });
    }

    if (action === 'logout') {
      (await cookies()).delete('user_session');
      return NextResponse.json({ success: true });
    }

    if (action === 'me') {
      const session = (await cookies()).get('user_session');
      if (!session) return NextResponse.json({ user: null });

      const user = DB.findUserByEmail(session.value);
      if (!user) return NextResponse.json({ user: null });

      return NextResponse.json({ user: { email: user.email, tier: user.tier, credits: user.credits } });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
