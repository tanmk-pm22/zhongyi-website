"use client";

import { Scissors } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "AI正在创作中..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <Scissors className="w-10 h-10 text-red-600 animate-spin-slow" />
        </div>
        <div className="absolute inset-0 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
}
