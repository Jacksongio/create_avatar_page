import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

// POST /api/generate-character-avatar
// Generates a single avatar image and returns it as a base64 JSON object.
export async function POST(_req: NextRequest) {
  try {
    const descriptionPath = path.join(process.cwd(), 'cache', 'character_description.txt');
    const characterDescription = await fs.readFile(descriptionPath, 'utf8');

    // Add a prefix to guide the image generation style
    const imagePrompt = `Create an anime-inspired image of a corporate character in a dynamic, neon-lit office setting. The character’s appearance and actions are based on the provided description below. Incorporate their unique Weapon as a prominent prop with an exaggerated, supernatural twist. Depict them mid-action, unleashing their Special Move with vibrant visual effects that reflect its nature. Subtly weave in their Strength through a glowing aura, accessory, or background detail, and hint at their Weakness with a faint, ironic visual cue. The art style should be bold and exaggerated, blending corporate absurdity with anime flair—think 'JoJo’s Bizarre Adventure' meets office satire. Use dramatic lighting, sharp lines, and a mix of humor and menace to bring the persona to life. Here is the content to help you craft the image details:${characterDescription}`;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      size: '1024x1024',
      response_format: 'b64_json',
      n: 1,
    });

    const b64_json = response.data?.[0]?.b64_json;

    if (!b64_json) {
      return NextResponse.json({ error: 'Failed to generate image data.' }, { status: 500 });
    }

    return NextResponse.json({ b64_json });

  } catch (err) {
    console.error('[generate-character-avatar] failed', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to generate avatar', details: errorMessage }, { status: 500 });
  }
}
