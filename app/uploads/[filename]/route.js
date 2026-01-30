import fs from 'fs/promises';
import path from 'path';

import { ensureUploadsDir } from '../../../lib/server/uploads.js';

export const runtime = 'nodejs';

function contentTypeForExt(ext) {
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(_req, { params }) {
  try {
    const resolvedParams = await params;
    const filename = resolvedParams?.filename;
    if (!filename) return new Response('Not found', { status: 404 });

    const uploadsDir = await ensureUploadsDir();
    const filePath = path.join(uploadsDir, path.basename(filename));

    const data = await fs.readFile(filePath);
    const ext = path.extname(filename).toLowerCase();
    return new Response(data, {
      headers: {
        'Content-Type': contentTypeForExt(ext),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}

