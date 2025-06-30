/**
 * Uses OpenAI ChatCompletion to rewrite a raw character description into a concise
 * single-sentence summary. Keep this on the **server side**–it requires the
 * `OPENAI_API_KEY` environment variable and must NOT be executed in the browser.
 *
 * Example usage (Next.js / Node):
 *
 * ```ts
 * import { formatDescription } from '@/components/llm/descriptionFormatter';
 *
 * const concise = await formatDescription(rawText);
 * ```
 */

import OpenAI from 'openai';
import 'dotenv/config';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generates a concise version of the provided description via OpenAI.
 * @param description Raw user-provided character description.
 * @param maxWords Target length (approximate). Default 60 words.
 */
export async function formatDescription(
  description: string,
  maxWords = 60,
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY env var is missing');
  }

  if (!description.trim()) {
    return '';
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.4,
    messages: [
      {
        role: 'system',
        content:
          `You are a concise writing assistant. Rewrite any character description you receive as a single, clear sentence no longer than ${maxWords} words. Preserve key visual/character traits, drop extraneous details.`,
      },
      { role: 'user', content: description.trim() },
    ],
  });

  const concise = completion.choices[0]?.message?.content?.trim();
  if (!concise) {
    throw new Error('Failed to obtain concise description from OpenAI');
  }
  return concise;
}



