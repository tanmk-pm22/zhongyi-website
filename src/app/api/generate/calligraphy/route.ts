import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const { text, language, style } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    // Build calligraphy prompt based on language and style
    const prompt = buildCalligraphyPrompt(text, language, style);

    // Generate calligraphy image
    const output = await replicate.run(
      "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      {
        input: {
          prompt: prompt,
          negative_prompt: "blurry, low quality, distorted text, wrong characters, misspelled, watermark, signature",
          width: 1024,
          height: 512,
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
      text,
      language,
      style,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate calligraphy" },
      { status: 500 }
    );
  }
}

function buildCalligraphyPrompt(text: string, language: string, style: string): string {
  // Language-specific styling
  const languageStyles: Record<string, Record<string, string>> = {
    zh: {
      kaishu: "Chinese calligraphy in regular script (楷书), brush ink on rice paper",
      xingshu: "Chinese calligraphy in running script (行书), fluid brush strokes",
      caoshu: "Chinese calligraphy in cursive script (草书), dynamic flowing style",
      lishu: "Chinese calligraphy in clerical script (隶书), official style",
      zhuanshu: "Chinese calligraphy in seal script (篆书), ancient style",
    },
    ar: {
      thuluth: "Arabic calligraphy in Thuluth style, elegant curves, golden ink",
      naskh: "Arabic calligraphy in Naskh style, clear readable script",
      diwani: "Arabic calligraphy in Diwani style, decorative court style",
      kufi: "Arabic calligraphy in Kufic style, geometric angular",
    },
    ja: {
      kaisho: "Japanese calligraphy in kaisho style (楷書), block letters",
      gyosho: "Japanese calligraphy in gyosho style (行書), semi-cursive",
      sosho: "Japanese calligraphy in sosho style (草書), cursive",
    },
    en: {
      copperplate: "English calligraphy in Copperplate style, elegant flowing script",
      italic: "English calligraphy in Italic style, slanted beautiful letters",
      gothic: "English calligraphy in Gothic blackletter style, medieval",
    },
  };

  const defaultStyle = "elegant calligraphy style, artistic lettering, professional";

  const stylePrompt = languageStyles[language]?.[style] || defaultStyle;
  const quality = "high quality, masterpiece, detailed, clean background, centered";

  return `"${text}" written in ${stylePrompt}, ${quality}`;
}
