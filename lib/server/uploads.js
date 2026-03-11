import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import { put } from '@vercel/blob';

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

// Upload to Vercel Blob Storage (persistent cloud storage)
export async function uploadToBlob(file, filename) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  }

  const blob = await put(filename, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return blob.url;
}

