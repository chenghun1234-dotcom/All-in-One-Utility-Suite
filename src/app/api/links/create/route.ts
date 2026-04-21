import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const session = (await cookies()).get('user_session');
    const { originalUrl, type, password, expiresAt, maxClicks } = await req.json();

    if (!originalUrl) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const userId = session ? DB.findUserByEmail(session.value)?.id || 'anonymous' : 'anonymous';
    const shortId = Math.random().toString(36).substring(7);

    const newLink = DB.createLink({
      shortId,
      originalUrl,
      userId,
      type: type || 'static',
      password: password || undefined,
      expiresAt: expiresAt || undefined,
      maxClicks: maxClicks ? parseInt(maxClicks) : undefined
    });

    const displayUrl = type === 'dynamic' || password || expiresAt || maxClicks 
      ? `${req.nextUrl.origin}/r/${shortId}`
      : originalUrl;

    return NextResponse.json({ 
      shortId, 
      displayUrl,
      linkId: newLink.id 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
