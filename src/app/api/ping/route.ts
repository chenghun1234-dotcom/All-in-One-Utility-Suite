import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    uptime: '100%',
    timestamp: new Date().toISOString() 
  });
}
