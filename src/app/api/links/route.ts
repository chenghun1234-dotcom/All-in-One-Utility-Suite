import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const session = (await cookies()).get('user_session');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = DB.findUserByEmail(session.value);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const links = DB.findLinksByUserId(user.id);
    return NextResponse.json({ links });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = (await cookies()).get('user_session');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = DB.findUserByEmail(session.value);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { action, id, originalUrl } = await req.json();

    if (action === 'update' && id && originalUrl) {
      const success = DB.updateLink(id, { originalUrl });
      return NextResponse.json({ success });
    }

    // Add more actions like delete here if needed
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
