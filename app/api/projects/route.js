import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

import { connectDb } from '../../../lib/server/db.js';
import Project from '../../../lib/server/models/Project.js';
import { ensureUploadsDir, uploadToBlob } from '../../../lib/server/uploads.js';
import { requireAdmin } from '../../../lib/server/auth.js';

export const runtime = 'nodejs';

function parseTechnologies(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function uniqueFilename(originalName) {
  const ext = path.extname(originalName || '').toLowerCase();
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const safeExt = ext && ext.length <= 10 ? ext : '';
  return `${uniqueSuffix}${safeExt}`;
}

export async function GET() {
  try {
    await connectDb();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = requireAdmin(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDb();

    const form = await req.formData();
    const title = form.get('title')?.toString() || '';
    const description = form.get('description')?.toString() || '';
    const githubLink = form.get('githubLink')?.toString() || '';
    const videoLink = form.get('videoLink')?.toString() || '';
    const technologies = form.get('technologies')?.toString() || '';
    const imageFile = form.get('image'); // File | null

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    let image = '';
    if (imageFile && typeof imageFile === 'object' && 'arrayBuffer' in imageFile) {
      const filename = uniqueFilename(imageFile.name);

      // Use Vercel Blob Storage if on Vercel, otherwise local storage
      if (process.env.VERCEL && process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          const buffer = Buffer.from(await imageFile.arrayBuffer());
          image = await uploadToBlob(buffer, filename);
        } catch (blobError) {
          console.error('Blob upload failed, falling back to local:', blobError);
          // Fallback to local storage
          const uploadsDir = await ensureUploadsDir();
          const buffer = Buffer.from(await imageFile.arrayBuffer());
          await fs.writeFile(path.join(uploadsDir, filename), buffer);
          image = `/uploads/${filename}`;
        }
      } else {
        // Local storage for development
        const uploadsDir = await ensureUploadsDir();
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        await fs.writeFile(path.join(uploadsDir, filename), buffer);
        image = `/uploads/${filename}`;
      }
    }

    const project = await Project.create({
      title,
      description,
      githubLink,
      videoLink,
      technologies: parseTechnologies(technologies),
      image,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Failed to create project' }, { status: 500 });
  }
}

