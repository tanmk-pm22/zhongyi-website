"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { GeneratedImage } from "@/components/GeneratedImage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Sliders } from "lucide-react";

const paperCutStyles = [
  { id: "traditional", name: "传统红色", description: "经典红白剪纸风格" },
  { id: "golden", name: "金色喜庆", description: "金色调节日风格" },
  { id: "blue", name: "青花瓷", description: "蓝白青花瓷风格" },
  { id: "multicolor", name: "多彩套色", description: "多层套色剪纸" },
];

export default function PhotoToPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("traditional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [detailLevel, setDetailLevel] = useState(50);

  const handleImageSelect = (_file: File, preview: string) => {
    setUploadedImage(preview);
    setGeneratedImage(null);
  };

  const handleGenerate = async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate/photo-to-papercut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: uploadedImage,
          style: selectedStyle,
          detailLevel,
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">照片转剪纸</h1>
        <p className="text-gray-600">上传照片，AI将其转换为传统剪纸风格</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Upload and Settings */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">上传照片</h2>
            <ImageUploader
              onImageSelect={handleImageSelect}
              currentImage={uploadedImage || undefined}
              onClear={() => setUploadedImage(null)}
            />
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">剪纸风格</h2>
            <div className="grid grid-cols-2 gap-3">
              {paperCutStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedStyle === style.id
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <p className="font-medium text-sm">{style.name}</p>
                  <p className="text-xs text-gray-500">{style.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">细节程度</h2>
              <Sliders className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={detailLevel}
              onChange={(e) => setDetailLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>简洁</span>
              <span>{detailLevel}%</span>
              <span>精细</span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!uploadedImage || isGenerating}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            生成剪纸
          </button>
        </div>

        {/* Right: Result */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">生成结果</h2>
          {isGenerating ? (
            <LoadingSpinner message="AI正在将照片转换为剪纸..." />
          ) : generatedImage ? (
            <GeneratedImage imageUrl={generatedImage} title="照片剪纸" />
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-400">上传照片后点击生成</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
