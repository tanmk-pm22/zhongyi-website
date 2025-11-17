"use client";

import { useState } from "react";
import { GeneratedImage } from "@/components/GeneratedImage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { LanguageSelector, languages, type Language } from "@/components/LanguageSelector";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { Mic, Type } from "lucide-react";

const calligraphyStyles: Record<string, { id: string; name: string }[]> = {
  zh: [
    { id: "kaishu", name: "楷书" },
    { id: "xingshu", name: "行书" },
    { id: "caoshu", name: "草书" },
    { id: "lishu", name: "隶书" },
    { id: "zhuanshu", name: "篆书" },
  ],
  ar: [
    { id: "thuluth", name: "Thuluth" },
    { id: "naskh", name: "Naskh" },
    { id: "diwani", name: "Diwani" },
    { id: "kufi", name: "Kufic" },
  ],
  ja: [
    { id: "kaisho", name: "楷書" },
    { id: "gyosho", name: "行書" },
    { id: "sosho", name: "草書" },
  ],
  en: [
    { id: "copperplate", name: "Copperplate" },
    { id: "italic", name: "Italic" },
    { id: "gothic", name: "Gothic" },
  ],
  default: [
    { id: "elegant", name: "Elegant" },
    { id: "classic", name: "Classic" },
    { id: "modern", name: "Modern" },
  ],
};

export default function CalligraphyPage() {
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");
  const [language, setLanguage] = useState<Language>(languages[0]);
  const [text, setText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("kaishu");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const styles = calligraphyStyles[language.code] || calligraphyStyles.default;

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    const newStyles = calligraphyStyles[lang.code] || calligraphyStyles.default;
    setSelectedStyle(newStyles[0].id);
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate/calligraphy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          language: language.code,
          style: selectedStyle,
        }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">多语言书法生成</h1>
        <p className="text-gray-600">
          支持中文、阿拉伯语、日语等多种语言的书法艺术生成
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="space-y-6">
          {/* Language Selection */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">选择语言</h2>
            <LanguageSelector value={language} onChange={handleLanguageChange} />
          </div>

          {/* Input Mode Toggle */}
          <div className="card">
            <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
              <button
                onClick={() => setInputMode("text")}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-colors ${
                  inputMode === "text"
                    ? "bg-white shadow text-red-600"
                    : "text-gray-600"
                }`}
              >
                <Type className="w-4 h-4" />
                <span>文字输入</span>
              </button>
              <button
                onClick={() => setInputMode("voice")}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-colors ${
                  inputMode === "voice"
                    ? "bg-white shadow text-red-600"
                    : "text-gray-600"
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>语音输入</span>
              </button>
            </div>

            {inputMode === "text" ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="输入您想要生成书法的文字..."
                className="input-field h-32 resize-none"
              />
            ) : (
              <div className="py-4">
                <VoiceRecorder
                  onTranscription={(t) => setText(t)}
                  language={language.code}
                />
                {text && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">识别结果：</p>
                    <p className="text-gray-700">{text}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Style Selection */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">书法风格</h2>
            <div className="grid grid-cols-2 gap-2">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    selectedStyle === style.id
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!text.trim() || isGenerating}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            生成书法
          </button>
        </div>

        {/* Right: Result */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">生成结果</h2>
          {isGenerating ? (
            <LoadingSpinner message="AI正在创作书法作品..." />
          ) : generatedImage ? (
            <GeneratedImage imageUrl={generatedImage} title={`${language.nativeName}书法`} />
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-400">输入文字后点击生成</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
