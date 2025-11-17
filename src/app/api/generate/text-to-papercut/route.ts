import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, language } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "No prompt provided" },
        { status: 400 }
      );
    }

    // Optimize prompt for paper cutting style
    const optimizedPrompt = buildPaperCutPrompt(prompt, language);

    // Generate image using Stable Diffusion XL
    const output = await replicate.run(
      "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      {
        input: {
          prompt: optimizedPrompt,
          negative_prompt: "blurry, gradient, soft edges, photorealistic, 3d render, shadows, watermark, text, low quality, deformed",
          width: 1024,
          height: 1024,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 30,
          guidance_scale: 7.5,
        },
      }
    );

    const imageUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({
      imageUrl,
      prompt: optimizedPrompt,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}

function buildPaperCutPrompt(userPrompt: string, language?: string): string {
  const baseStyle = "Chinese paper cut art, jianzhi style, traditional folk art";
  const technicalDetails = "red silhouette on white background, intricate cutouts, symmetrical design, negative space, high contrast, sharp edges, detailed patterns, clean lines";
  const quality = "high quality, masterpiece, best quality, detailed";

  // Add language-specific context if needed
  let contextPrefix = "";
  if (language === "ar") {
    contextPrefix = "Arabic inspired, ";
  } else if (language === "ja") {
    contextPrefix = "Japanese kirie style, ";
  }

  return `${contextPrefix}${baseStyle}, ${userPrompt}, ${technicalDetails}, ${quality}`;
}
