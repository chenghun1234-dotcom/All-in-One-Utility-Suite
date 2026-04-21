import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import * as xlsx from 'xlsx';
import QRCode from 'qrcode';
import archiver from 'archiver';
import { Readable } from 'stream';
import { getLinkPreview } from 'link-preview-js';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const extractMeta = formData.get('extractMeta') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]) as any[];

    const archive = archiver('zip', { zlib: { level: 9 } });
    const filename = `webmaster_bulk_${Date.now()}.zip`;
    
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    archive.on('data', (chunk) => writer.write(chunk));
    archive.on('end', () => writer.close());
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      writer.abort(err);
    });

    (async () => {
      const summaryData: any[] = [];

      for (const [index, row] of data.entries()) {
        const url = row.url || row.URL || row.link || Object.values(row)[0];
        
        if (!url || typeof url !== 'string') continue;

        try {
          // 1. Generate QR Code
          const qrBuffer = await QRCode.toBuffer(url, {
            margin: 2,
            width: 512,
          });
          archive.append(qrBuffer, { name: `qrcodes/qr_${index + 1}.png` });

          // 2. Extract Metadata if requested
          let meta: any = {};
          if (extractMeta) {
            try {
              const preview: any = await getLinkPreview(url, {
                followRedirects: `follow`,
                headers: { "user-agent": "googlebot" }
              });
              meta = {
                'Title': preview.title || 'N/A',
                'Description': preview.description || 'N/A',
                'Image': (preview.images && preview.images[0]) || 'N/A',
                'Site Name': preview.siteName || 'N/A'
              };
            } catch (err) {
              console.error(`Metadata extraction failed for ${url}`);
              meta = { 'Title': 'Failed', 'Description': 'Site blocked or invalid' };
            }
          }

          summaryData.push({
            'ID': index + 1,
            'Original URL': url,
            ...meta,
            'QR Filename': `qr_${index + 1}.png`
          });
        } catch (err) {
          console.error(`Error processing URL: ${url}`, err);
        }
      }

      const summarySheet = xlsx.utils.json_to_sheet(summaryData);
      const summaryCsv = xlsx.utils.sheet_to_csv(summarySheet);
      archive.append(summaryCsv, { name: 'summary_report.csv' });

      await archive.finalize();
    })().catch(err => console.error("Process error", err));

    return new Response(readable, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error('Bulk process error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
