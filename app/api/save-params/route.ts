import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// POST /api/save-params
// Body JSON: { Temperature, FREQUENCY_PENALTY, MAX_TOKENS, PRES_PENALTY }
// Writes these values to character_params.json at the project root so that Python scripts can consume them.
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const allowedKeys = ['Temperature', 'FREQUENCY_PENALTY', 'MAX_TOKENS', 'PRES_PENALTY'];
    const filtered: Record<string, number> = {};
    for (const k of allowedKeys) {
      if (typeof data[k] === 'number') filtered[k] = data[k];
    }

    const filePath = path.join(process.cwd(), 'character_params.json');
    await fs.writeFile(filePath, JSON.stringify(filtered, null, 2), 'utf8');

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('save-params error', err);
    return NextResponse.json({ error: 'Unable to save parameters' }, { status: 500 });
  }
}
