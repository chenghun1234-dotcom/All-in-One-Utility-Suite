import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function POST(req: NextRequest) {
  try {
    const { url, color, bgColor, margin, width } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Generate QR Code as Data URL
    const qrDataUrl = await QRCode.toDataURL(url, {
      margin: margin || 2,
      width: width || 512,
      color: {
        dark: color || '#000000',
        light: bgColor || '#ffffff',
      },
      errorCorrectionLevel: 'H' // High error correction to allow for logos
    });

    return NextResponse.json({ qrDataUrl });
  } catch (error: any) {
    console.error('QR generation error:', error);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}
