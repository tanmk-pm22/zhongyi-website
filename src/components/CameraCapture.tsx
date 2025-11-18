"use client";

import { useState, useRef, useCallback } from "react";
import { Camera, SwitchCamera, X, Check } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError(null);
    } catch (err) {
      console.error("Camera error:", err);
      setError("无法访问相机，请检查权限设置");
    }
  }, [facingMode, stream]);

  // Start camera on mount
  useState(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  });

  const switchCamera = async () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
    await startCamera();
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(imageData);
      }
    }
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      // Stop camera
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {error ? (
        <div className="flex flex-col items-center justify-center h-full text-white p-4">
          <p className="text-center mb-4">{error}</p>
          <button onClick={handleClose} className="btn-primary">
            关闭
          </button>
        </div>
      ) : capturedImage ? (
        // Preview captured image
        <div className="relative h-full">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-contain"
          />

          {/* Action buttons */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-8">
            <button
              onClick={retake}
              className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center"
            >
              <X className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={confirmCapture}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>
      ) : (
        // Camera view
        <div className="relative h-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            onLoadedMetadata={() => videoRef.current?.play()}
          />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 p-2 bg-black/50 rounded-full"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Switch camera button */}
          <button
            onClick={switchCamera}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full"
          >
            <SwitchCamera className="w-6 h-6 text-white" />
          </button>

          {/* Capture button */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <button
              onClick={capturePhoto}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-gray-300"
            >
              <Camera className="w-8 h-8 text-gray-800" />
            </button>
          </div>

          {/* Guide text */}
          <div className="absolute top-20 left-0 right-0 text-center">
            <p className="text-white text-sm bg-black/30 inline-block px-4 py-2 rounded-full">
              对准要转换的图案
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
