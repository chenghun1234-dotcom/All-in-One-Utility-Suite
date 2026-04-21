import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const link = DB.findLinkByShortId(id);

    if (!link) {
      return new Response('Link not found', { status: 404 });
    }

    // 1. Check Expiry
    if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
      return new Response('Link has expired', { status: 410 });
    }

    // 2. Check Click Limits
    if (link.maxClicks && link.clicks >= link.maxClicks) {
      return new Response('Link click limit reached', { status: 403 });
    }

    // 3. Check Password (if present, redirect to password entry page)
    if (link.password) {
      const url = new URL(`/r/${id}/password`, req.url);
      return NextResponse.redirect(url);
    }

    // 4. All checks passed: Increment click and Redirect
    DB.incrementClick(id);
    return NextResponse.redirect(link.originalUrl);

  } catch (error) {
    console.error('Redirect error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
