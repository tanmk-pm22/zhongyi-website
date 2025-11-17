import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `你是一位专业的中国传统剪纸艺术老师，精通各种剪纸技法和设计原则。你的任务是帮助用户学习剪纸艺术。

你应该：
1. 用简洁明了的语言解释剪纸技巧
2. 提供实用的步骤指导
3. 解释传统图案的文化含义
4. 给出安全操作建议
5. 鼓励用户的学习热情

回答要简洁有用，控制在200字以内。`;

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: "No question provided" },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    });

    // Extract text from response
    const answer = message.content
      .filter((block) => block.type === "text")
      .map((block) => {
        if (block.type === "text") {
          return block.text;
        }
        return "";
      })
      .join("");

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error("AI assistant error:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    );
  }
}
