import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(request: NextRequest) {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const { image, style, detailLevel, cuttingMethod = "yang" } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Build style-specific prompts with cutting method
    const styleConfig = getStyleConfig(style, cuttingMethod);

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
      cuttingMethod,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}

function getStyleConfig(style: string, cuttingMethod: string) {
  // Cutting method modifiers
  const cuttingModifiers = {
    yang: {
      // 阳刻: Lines preserved, background removed (outline style)
      suffix: ", positive cut style, preserved outlines, detailed line work, white lines on colored background, intricate borders preserved",
      negative: ", solid fill, no outlines, silhouette only"
    },
    yin: {
      // 阴刻: Background preserved, lines removed (silhouette style)
      suffix: ", negative cut style, solid silhouette, filled shapes, colored shapes on white background, bold solid forms, no internal lines",
      negative: ", outline only, line art, wireframe"
    }
  };

  const cutting = cuttingModifiers[cuttingMethod as keyof typeof cuttingModifiers] || cuttingModifiers.yang;

  const configs: Record<string, { prompt: string; negativePrompt: string }> = {
    traditional: {
      prompt: `Chinese paper cut art, jianzhi, red and white, traditional folk art, intricate cutouts, symmetrical, high contrast, sharp edges${cutting.suffix}`,
      negativePrompt: `gradient, soft edges, photorealistic, 3d, shadows, blurry${cutting.negative}`,
    },
    golden: {
      prompt: `Chinese paper cut art, golden color on red background, festive, luxury, traditional patterns, intricate details, symmetrical design${cutting.suffix}`,
      negativePrompt: `gradient, soft edges, photorealistic, 3d, shadows, blurry, silver${cutting.negative}`,
    },
    blue: {
      prompt: `Chinese paper cut art in blue and white porcelain style, qinghua, delicate patterns, traditional Chinese, intricate cutouts${cutting.suffix}`,
      negativePrompt: `gradient, soft edges, photorealistic, 3d, shadows, red${cutting.negative}`,
    },
    multicolor: {
      prompt: `Multi-layered Chinese paper cut art, colorful, multiple layers, traditional folk art, vibrant colors, intricate patterns${cutting.suffix}`,
      negativePrompt: `gradient, soft edges, photorealistic, 3d, blurry, monochrome${cutting.negative}`,
    },
  };

  return configs[style] || configs.traditional;
}
