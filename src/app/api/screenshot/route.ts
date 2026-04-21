import { NextRequest, NextResponse } from 'next/server';

// Updated Screenshot API Route - Professional Version
export async function POST(req: NextRequest) {
  try {
    const { url, width, height } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // We are removing ScreenshotOne as requested.
    // Transitioning to a keyless public preview engine (Thum.io).
    // This allows for high-quality previews without a sandbox key requirement.
    
    const screenshotUrl = `https://image.thum.io/get/width/${width || 1280}/crop/1024/noanimate/${targetUrl}`;

    return NextResponse.json({ screenshotUrl });

  } catch (error: any) {
    console.error('Screenshot error:', error.message);
    return NextResponse.json({ error: 'Failed to capture preview. Please verify the URL.' }, { status: 500 });
  }
}
