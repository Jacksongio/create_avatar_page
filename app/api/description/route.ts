export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { formatDescription } from '@/components/llm/descriptionFormatter';
import { promises as fs } from 'fs';
import path from 'path';

const STORE_PATH = path.join(process.cwd(), 'cache');
const FILE_PATH = path.join(STORE_PATH, 'character_description.txt');

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();
    if (typeof description !== 'string' || !description.trim()) {
      return NextResponse.json({ error: 'Invalid description' }, { status: 400 });
    }

    const concise = await formatDescription(description);

    // ensure cache dir exists
    await fs.mkdir(STORE_PATH, { recursive: true });
    await fs.writeFile(FILE_PATH, concise, 'utf8');

    return NextResponse.json({ success: true, concise });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
