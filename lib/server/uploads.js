import os from 'os';
import path from 'path';
import fs from 'fs/promises';

export function getUploadsDir() {
  // Vercel/serverless: only /tmp is writable
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), 'portfolio-uploads');
  }
  // local/dev or node server
  return path.join(process.cwd(), 'uploads');
}

export async function ensureUploadsDir() {
  const dir = getUploadsDir();
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export function filePathFromStoredImage(storedImagePath) {
  if (!storedImagePath) return null;
  // stored path usually "/uploads/<name>"
  const filename = path.basename(storedImagePath);
  return path.join(getUploadsDir(), filename);
}

