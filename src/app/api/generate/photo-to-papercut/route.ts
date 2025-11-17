import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const { image, style, detailLevel } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Build style-specific prompts
    const styleConfig = getStyleConfig(style);

    // Calculate strength based on detail level
    const strength = Math.max(0.3, Math.min(0.9, detailLevel / 100));

    // Use ControlNet with Canny edge detection for photo to paper cut
    const output = await replicate.run(
      "jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613",
      {
        input: {
          image: image,
          prompt: styleConfig.prompt,
          negative_prompt: styleConfig.negativePrompt,
          num_samples: "1",
          image_resolution: "768",
          ddim_steps: 30,
          scale: 9,
          seed: -1,
          eta: 0,
          a_prompt: "best quality, extremely detailed",
          n_prompt: "longbody, lowres, bad anatomy, bad hands, missing fingers",
          detect_resolution: 512,
          low_threshold: 100,
          high_threshold: 200,
          strength: strength,
        },
      }
    );

    const imageUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({
      imageUrl,
      style,
      detailLevel,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}

function getStyleConfig(style: string) {
  const configs: Record<string, { prompt: string; negativePrompt: string }> = {
    traditional: {
      prompt: "Chinese paper cut art, jianzhi, red silhouette on white background, traditional folk art, intricate cutouts, symmetrical, high contrast, sharp edges",
      negativePrompt: "gradient, soft edges, photorealistic, 3d, shadows, blurry",
    },
    golden: {
      prompt: "Chinese paper cut art, golden color on red background, festive, luxury, traditional patterns, intricate details, symmetrical design",
      negativePrompt: "gradient, soft edges, photorealistic, 3d, shadows, blurry, silver",
    },
    blue: {
      prompt: "Chinese paper cut art in blue and white porcelain style, qinghua, delicate patterns, traditional Chinese, intricate cutouts",
      negativePrompt: "gradient, soft edges, photorealistic, 3d, shadows, red",
    },
    multicolor: {
      prompt: "Multi-layered Chinese paper cut art, colorful, multiple layers, traditional folk art, vibrant colors, intricate patterns",
      negativePrompt: "gradient, soft edges, photorealistic, 3d, blurry, monochrome",
    },
  };

  return configs[style] || configs.traditional;
}
