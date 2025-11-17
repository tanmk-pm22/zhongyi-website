"use client";

import { useState } from "react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { GeneratedImage } from "@/components/GeneratedImage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { LanguageSelector, languages, type Language } from "@/components/LanguageSelector";
import { Volume2, Edit3 } from "lucide-react";

export default function VoiceToPage() {
  const [language, setLanguage] = useState<Language>(languages[0]);
  const [transcribedText, setTranscribedText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleTranscription = (text: string) => {
    setTranscribedText(text);
    setGeneratedImage(null);
  };

  const handleGenerate = async () => {
    if (!transcribedText.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate/text-to-papercut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: transcribedText,
          language: language.code,
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

  const playText = () => {
    if ('speechSynthesis' in window && transcribedText) {
      const utterance = new SpeechSynthesisUtterance(transcribedText);
      utterance.lang = language.code === 'zh' ? 'zh-CN' : language.code;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">语音生成剪纸</h1>
        <p className="text-gray-600">用语音描述您的想法，支持99种语言</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Voice Input */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">选择语言</h2>
            <LanguageSelector value={language} onChange={setLanguage} />
            <p className="text-sm text-gray-500 mt-2">
              选择您将使用的语音语言
            </p>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-6 text-center">录制语音</h2>
            <VoiceRecorder
              onTranscription={handleTranscription}
              language={language.code}
            />
          </div>

          {/* Transcribed Text */}
          {transcribedText && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">识别结果</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={playText}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="朗读"
                  >
                    <Volume2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="编辑"
                  >
                    <Edit3 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {isEditing ? (
                <textarea
                  value={transcribedText}
                  onChange={(e) => setTranscribedText(e.target.value)}
                  className="input-field h-24 resize-none"
                />
              ) : (
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {transcribedText}
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!transcribedText.trim() || isGenerating}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            生成剪纸
          </button>
        </div>

        {/* Right: Result */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">生成结果</h2>
          {isGenerating ? (
            <LoadingSpinner message="AI正在根据语音创作剪纸..." />
          ) : generatedImage ? (
            <GeneratedImage imageUrl={generatedImage} title="语音生成剪纸" />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-center">
                录制语音后点击生成
                <br />
                <span className="text-sm">支持99种语言</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
