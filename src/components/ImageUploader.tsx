"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { clsx } from "clsx";

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  currentImage?: string;
  onClear?: () => void;
}

export function ImageUploader({ onImageSelect, currentImage, onClear }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageSelect(file, result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleClear = () => {
    setPreview(null);
    onClear?.();
  };

  if (preview) {
    return (
      <div className="relative">
        <img
          src={preview}
          alt="Uploaded preview"
          className="w-full h-64 object-contain rounded-lg bg-gray-100"
        />
        <button
          onClick={handleClear}
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={clsx(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive
          ? "border-red-500 bg-red-50"
          : "border-gray-300 hover:border-red-400 hover:bg-red-50"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          {isDragActive ? (
            <Upload className="w-8 h-8 text-red-500" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div>
          <p className="text-gray-600 font-medium">
            {isDragActive ? "放开以上传图片" : "拖拽图片到这里，或点击选择"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            支持 PNG, JPG, WEBP (最大 10MB)
          </p>
        </div>
      </div>
    </div>
  );
}
