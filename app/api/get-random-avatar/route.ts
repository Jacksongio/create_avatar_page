import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

// GET /api/get-random-avatar
// Returns JSON { url: <data-url-string> }
// The image is randomly chosen from the `avatar_images` directory sitting at the project root.
export async function GET() {
  try {
    const avatarDir = path.join(process.cwd(), 'avatar_images');
    const entries = await fs.readdir(avatarDir);
    const images = entries.filter((file) => /\.(png|jpg|jpeg|gif|webp)$/i.test(file));

    if (images.length === 0) {
      return NextResponse.json({ error: 'No avatar images found' }, { status: 500 });
    }

    const randomFile = images[Math.floor(Math.random() * images.length)];
    const filePath = path.join(avatarDir, randomFile);

    const fileBuffer = await fs.readFile(filePath);
    const extension = path.extname(randomFile).replace('.', '').toLowerCase();
    const base64 = fileBuffer.toString('base64');
    const dataUrl = `data:image/${extension};base64,${base64}`;

    return NextResponse.json({ url: dataUrl });
  } catch (err) {
    console.error('Error serving random avatar:', err);
    return NextResponse.json({ error: 'Failed to fetch avatar' }, { status: 500 });
  }
}
