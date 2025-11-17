import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const formData = await request.formData();
    const audio = formData.get("audio") as Blob;
    const language = formData.get("language") as string | null;

    if (!audio) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert blob to File for OpenAI API
    const file = new File([audio], "audio.webm", { type: audio.type });

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: language || undefined,
    });

    return NextResponse.json({
      text: transcription.text,
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
