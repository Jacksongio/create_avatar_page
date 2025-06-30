import 'dotenv/config';
import OpenAI from 'openai';
import readline from 'readline';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * CLI testing function to ensure character chat works. along with formatting
 * the description. 
 *
 * Usage (with tsx / ts-node):
 *   npx tsx components/llm/characterChat.ts
 *
 * Type "exit" or "quit" to end the session.
 */

if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY env var is missing');
  process.exit(1);
}

async function main() {
  // Read concise description stored by frontend.
const FILE_PATH = path.join(process.cwd(), 'cache', 'character_description.txt');
let conciseDescription: string;
try {
  conciseDescription = (await fs.readFile(FILE_PATH, 'utf8')).trim();
} catch (err) {
  console.error('No stored character description found. Generate one via the web UI first.');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The system prompt makes the assistant adopt the persona (it is the character).
const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content: `You are ${conciseDescription}. Speak and act in first person as this character. Stay in character.`,
  },
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt() {
  rl.question('You: ', async (input) => {
    const userMessage = input.trim();

    // Handle exit keywords gracefully.
    if (['exit', 'quit', 'q'].includes(userMessage.toLowerCase())) {
      rl.close();
      process.exit(0);
    }

    messages.push({ role: 'user', content: userMessage });

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
      });

      const reply = completion.choices[0]?.message?.content?.trim() ?? '';
      console.log(`AI: ${reply}\n`);
      messages.push({ role: 'assistant', content: reply });
    } catch (error) {
      console.error('OpenAI API error:', error);
    }

    prompt();
  });
}

console.log('Chat started. Type your messages below. (exit / quit to end)');
  prompt();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
