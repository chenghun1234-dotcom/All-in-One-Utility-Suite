import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { id, password } = await req.json();

    if (!id || !password) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const link = DB.findLinkByShortId(id);

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    if (link.password === password) {
      // Successful verification
      DB.incrementClick(id);
      return NextResponse.json({ success: true, originalUrl: link.originalUrl });
    } else {
      return NextResponse.json({ success: false }, { status: 401 });
    }

  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
