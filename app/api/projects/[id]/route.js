import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

import { connectDb } from '../../../../lib/server/db.js';
import Project from '../../../../lib/server/models/Project.js';
import { ensureUploadsDir, filePathFromStoredImage } from '../../../../lib/server/uploads.js';
import { requireAdmin } from '../../../../lib/server/auth.js';

export const runtime = 'nodejs';

function parseTechnologies(value) {
  if (!value) return null;
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

export async function GET(_req, { params }) {
  try {
    const resolvedParams = await params;
    await connectDb();
    const project = await Project.findById(resolvedParams?.id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const resolvedParams = await params;
    const session = requireAdmin(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDb();

    const project = await Project.findById(resolvedParams?.id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const form = await req.formData();
    const title = form.get('title')?.toString();
    const description = form.get('description')?.toString();
    const githubLink = form.get('githubLink')?.toString();
    const videoLink = form.get('videoLink')?.toString();
    const technologiesRaw = form.get('technologies')?.toString();
    const imageFile = form.get('image'); // File | null

    if (typeof title === 'string' && title) project.title = title;
    if (typeof description === 'string' && description) project.description = description;
    if (typeof githubLink === 'string') project.githubLink = githubLink;
    if (typeof videoLink === 'string') project.videoLink = videoLink;

    if (technologiesRaw !== undefined) {
      const parsed = parseTechnologies(technologiesRaw);
      if (parsed !== null) project.technologies = parsed;
    }

    if (imageFile && typeof imageFile === 'object' && 'arrayBuffer' in imageFile) {
      // remove old file if exists
      const oldPath = filePathFromStoredImage(project.image);
      if (oldPath) {
        try {
          await fs.unlink(oldPath);
        } catch {
          // ignore
        }
      }

      const uploadsDir = await ensureUploadsDir();
      const filename = uniqueFilename(imageFile.name);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(path.join(uploadsDir, filename), buffer);
      project.image = `/uploads/${filename}`;
    }

    await project.save();
    return NextResponse.json(project);
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const resolvedParams = await params;
    const session = requireAdmin(_req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDb();
    const project = await Project.findById(resolvedParams?.id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const imagePath = filePathFromStoredImage(project.image);
    if (imagePath) {
      try {
        await fs.unlink(imagePath);
      } catch {
        // ignore
      }
    }

    await project.deleteOne();
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Failed to delete project' }, { status: 500 });
  }
}

