"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  language?: string;
}

export function VoiceRecorder({ onTranscription, language }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach(track => track.stop());
        await processAudio(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("无法访问麦克风，请检查权限设置");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      if (language) {
        formData.append("language", language);
      }

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      const data = await response.json();
      onTranscription(data.text);
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("语音处理失败，请重试");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {isRecording && (
          <div className="absolute inset-0 bg-red-500 rounded-full recording-pulse" />
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={clsx(
            "relative w-20 h-20 rounded-full flex items-center justify-center transition-all",
            isRecording
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-200 hover:bg-gray-300",
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
        >
          {isProcessing ? (
            <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
          ) : isRecording ? (
            <Square className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-gray-600" />
          )}
        </button>
      </div>

      <div className="text-center">
        {isProcessing ? (
          <p className="text-gray-600">正在处理语音...</p>
        ) : isRecording ? (
          <>
            <p className="text-red-600 font-medium">正在录音</p>
            <p className="text-2xl font-mono">{formatDuration(duration)}</p>
          </>
        ) : (
          <p className="text-gray-500">点击开始录音</p>
        )}
      </div>
    </div>
  );
}
