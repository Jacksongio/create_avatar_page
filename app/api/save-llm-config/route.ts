import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

interface LLMConfig {
  temperature: number;
  top_p: number;
  max_tokens: number;
  presence_penalty: number;
}

export async function POST(request: Request) {
  try {
    const config: LLMConfig = await request.json();

    // Basic validation
    if (
      typeof config.temperature !== "number" ||
      typeof config.top_p !== "number" ||
      typeof config.max_tokens !== "number" ||
      typeof config.presence_penalty !== "number"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "llmConfig.json");

    // Ensure the data directory exists
    await fs.mkdir(dataDir, { recursive: true });

    // Save the config to a JSON file
    await fs.writeFile(filePath, JSON.stringify(config, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save LLM config", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
