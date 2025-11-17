"use client";

import { useState, useRef } from "react";
import { Download, Printer, Share2, Loader2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface GeneratedImageProps {
  imageUrl: string;
  title?: string;
}

export function GeneratedImage({ imageUrl, title = "AI剪纸作品" }: GeneratedImageProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: title,
  });

  const handleDownload = async (format: "png" | "svg") => {
    setIsDownloading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${title}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
      alert("下载失败，请重试");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: "看看我用AI生成的剪纸作品！",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("链接已复制到剪贴板");
    }
  };

  return (
    <div className="space-y-4">
      {/* Image Display */}
      <div ref={printRef} className="paper-cut-frame">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleDownload("png")}
          disabled={isDownloading}
          className="btn-primary flex items-center space-x-2"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>下载 PNG</span>
        </button>

        <button
          onClick={() => handlePrint()}
          className="btn-secondary flex items-center space-x-2"
        >
          <Printer className="w-4 h-4" />
          <span>打印</span>
        </button>

        <button
          onClick={handleShare}
          className="btn-outline flex items-center space-x-2"
        >
          <Share2 className="w-4 h-4" />
          <span>分享</span>
        </button>
      </div>
    </div>
  );
}
