import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { formatDescription } from '@/components/llm/descriptionFormatter';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, characterDescription } = await req.json();

    if (!Array.isArray(messages) || typeof characterDescription !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const chatMessages = [...messages];

    // If first user message, seed with character persona.
    const hasSystemPrompt = chatMessages.some((m) => m.role === 'system');
    if (!hasSystemPrompt) {
      const concise = await formatDescription(characterDescription);
      chatMessages.unshift({
        role: 'system',
        content: `You are ${concise}. Speak and act in first person as this character. Stay in character.`,
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: chatMessages,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || '';
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
