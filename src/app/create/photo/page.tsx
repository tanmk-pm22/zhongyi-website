"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { GeneratedImage } from "@/components/GeneratedImage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { CameraCapture } from "@/components/CameraCapture";
import { Sliders, Camera, Upload, Sun, Moon } from "lucide-react";

const paperCutStyles = [
  { id: "traditional", name: "传统红色", description: "经典红白剪纸风格" },
  { id: "golden", name: "金色喜庆", description: "金色调节日风格" },
  { id: "blue", name: "青花瓷", description: "蓝白青花瓷风格" },
  { id: "multicolor", name: "多彩套色", description: "多层套色剪纸" },
];

const cuttingMethods = [
  {
    id: "yang",
    name: "阳刻",
    description: "保留线条，剪去空白",
    icon: Sun,
  },
  {
    id: "yin",
    name: "阴刻",
    description: "保留空白，剪去线条",
    icon: Moon,
  },
];

export default function PhotoToPage() {
  const [inputMode, setInputMode] = useState<"upload" | "camera">("upload");
  const [showCamera, setShowCamera] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("traditional");
  const [selectedCuttingMethod, setSelectedCuttingMethod] = useState("yang");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{yang?: string; yin?: string}>({});
  const [detailLevel, setDetailLevel] = useState(50);
  const [generateBoth, setGenerateBoth] = useState(true);

  const handleImageSelect = (_file: File, preview: string) => {
    setUploadedImage(preview);
    setGeneratedImages({});
  };

  const handleCameraCapture = (imageData: string) => {
    setUploadedImage(imageData);
    setShowCamera(false);
    setGeneratedImages({});
  };

  const handleGenerate = async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    setGeneratedImages({});

    try {
      if (generateBoth) {
        // Generate both yin and yang versions
        const [yangResult, yinResult] = await Promise.all([
          generatePaperCut("yang"),
          generatePaperCut("yin"),
        ]);
        setGeneratedImages({
          yang: yangResult,
          yin: yinResult,
        });
      } else {
        // Generate only selected method
        const result = await generatePaperCut(selectedCuttingMethod);
        setGeneratedImages({
          [selectedCuttingMethod]: result,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePaperCut = async (cuttingMethod: string): Promise<string> => {
    const response = await fetch("/api/generate/photo-to-papercut", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: uploadedImage,
        style: selectedStyle,
        detailLevel,
        cuttingMethod,
      }),
    });

    if (!response.ok) throw new Error("Generation failed");

    const data = await response.json();
    return data.imageUrl;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">照片转剪纸</h1>
        <p className="text-gray-600">上传照片或现场拍照，AI转换为传统剪纸风格（阴阳两种剪法）</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Upload/Camera and Settings */}
        <div className="space-y-6">
          {/* Input Mode Toggle */}
          <div className="card">
            <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
              <button
                onClick={() => setInputMode("upload")}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-colors ${
                  inputMode === "upload"
                    ? "bg-white shadow text-red-600"
                    : "text-gray-600"
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>上传图片</span>
              </button>
              <button
                onClick={() => setInputMode("camera")}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-colors ${
                  inputMode === "camera"
                    ? "bg-white shadow text-red-600"
                    : "text-gray-600"
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>现场拍照</span>
              </button>
            </div>

            {inputMode === "upload" ? (
              <ImageUploader
                onImageSelect={handleImageSelect}
                currentImage={uploadedImage || undefined}
                onClear={() => setUploadedImage(null)}
              />
            ) : (
              <div className="text-center py-8">
                {uploadedImage ? (
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Captured"
                      className="w-full h-64 object-contain rounded-lg bg-gray-100"
                    />
                    <button
                      onClick={() => setShowCamera(true)}
                      className="mt-4 btn-outline"
                    >
                      重新拍照
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCamera(true)}
                    className="btn-primary flex items-center space-x-2 mx-auto"
                  >
                    <Camera className="w-5 h-5" />
                    <span>打开相机</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Style Selection */}
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

          {/* Cutting Method Selection */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">剪法选择</h2>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={generateBoth}
                  onChange={(e) => setGenerateBoth(e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span>同时生成阴阳两版</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {cuttingMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedCuttingMethod(method.id)}
                  disabled={generateBoth}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    generateBoth
                      ? "border-red-300 bg-red-50 opacity-75"
                      : selectedCuttingMethod === method.id
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <method.icon className={`w-5 h-5 ${
                      method.id === "yang" ? "text-amber-500" : "text-indigo-500"
                    }`} />
                    <span className="font-medium">{method.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">{method.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Detail Level */}
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
            {generateBoth ? "生成阴阳两版剪纸" : "生成剪纸"}
          </button>
        </div>

        {/* Right: Results */}
        <div className="space-y-6">
          {isGenerating ? (
            <div className="card">
              <LoadingSpinner message={generateBoth ? "AI正在生成阴阳两版剪纸..." : "AI正在转换剪纸..."} />
            </div>
          ) : Object.keys(generatedImages).length > 0 ? (
            <>
              {generatedImages.yang && (
                <div className="card">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <h2 className="text-lg font-semibold">阳刻版本</h2>
                  </div>
                  <GeneratedImage imageUrl={generatedImages.yang} title="阳刻剪纸" />
                </div>
              )}
              {generatedImages.yin && (
                <div className="card">
                  <div className="flex items-center space-x-2 mb-4">
                    <Moon className="w-5 h-5 text-indigo-500" />
                    <h2 className="text-lg font-semibold">阴刻版本</h2>
                  </div>
                  <GeneratedImage imageUrl={generatedImages.yin} title="阴刻剪纸" />
                </div>
              )}
            </>
          ) : (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">生成结果</h2>
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <div className="flex space-x-4 mb-4">
                  <Sun className="w-8 h-8 text-amber-300" />
                  <Moon className="w-8 h-8 text-indigo-300" />
                </div>
                <p className="text-gray-400 text-center">
                  上传照片或拍照后点击生成
                  <br />
                  <span className="text-sm">将生成阴阳两种剪法</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}
