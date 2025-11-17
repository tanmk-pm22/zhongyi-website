"use client";

import { useState } from "react";
import { GeneratedImage } from "@/components/GeneratedImage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { LanguageSelector, languages, type Language } from "@/components/LanguageSelector";
import { Sparkles, History } from "lucide-react";

const promptSuggestions = [
  "一条龙环绕着祥云",
  "双鱼戏莲花，年年有余",
  "凤凰牡丹，富贵吉祥",
  "喜鹊登梅，喜上眉梢",
  "十二生肖之虎",
  "福字窗花",
  "春节灯笼和鞭炮",
  "荷花与蜻蜓",
];

export default function TextToPage() {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState<Language>(languages[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate/text-to-papercut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          language: language.code,
        }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      setGeneratedImage(data.imageUrl);

      // Add to history
      if (!history.includes(prompt)) {
        setHistory((prev) => [prompt, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">文字生成剪纸</h1>
        <p className="text-gray-600">用任意语言描述您想要的剪纸图案，AI为您创作</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">输入语言</h2>
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">描述您的剪纸</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：一条龙环绕着祥云，下方有波浪..."
              className="input-field h-32 resize-none"
            />

            {/* Suggestions */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-1" />
                建议
              </p>
              <div className="flex flex-wrap gap-2">
                {promptSuggestions.slice(0, 4).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-red-100 rounded-full text-gray-600 hover:text-red-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <History className="w-5 h-5 mr-2" />
                历史记录
              </h2>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {history.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(item)}
                    className="w-full text-left text-sm p-2 rounded hover:bg-gray-50 truncate"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            生成剪纸
          </button>
        </div>

        {/* Right: Result */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">生成结果</h2>
          {isGenerating ? (
            <LoadingSpinner message="AI正在根据描述创作剪纸..." />
          ) : generatedImage ? (
            <GeneratedImage imageUrl={generatedImage} title="文字生成剪纸" />
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-400">输入描述后点击生成</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
