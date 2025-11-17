"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Scissors, Mic, Type, BookOpen, Image, Globe } from "lucide-react";

const features = [
  {
    icon: Image,
    title: "照片转剪纸",
    description: "上传照片，AI自动转换为传统剪纸风格",
    href: "/create/photo",
    color: "bg-red-500",
  },
  {
    icon: Type,
    title: "文字生成剪纸",
    description: "输入文字描述，AI生成精美剪纸图案",
    href: "/create/text",
    color: "bg-amber-500",
  },
  {
    icon: Mic,
    title: "语音生成剪纸",
    description: "支持99种语言语音输入，智能生成剪纸",
    href: "/create/voice",
    color: "bg-emerald-500",
  },
  {
    icon: Globe,
    title: "多语言书法",
    description: "中文、阿拉伯文、日文等多语言书法生成",
    href: "/calligraphy",
    color: "bg-blue-500",
  },
  {
    icon: BookOpen,
    title: "剪纸教程",
    description: "AI教导折纸剪纸技巧，从入门到精通",
    href: "/tutorial",
    color: "bg-purple-500",
  },
  {
    icon: Scissors,
    title: "我的作品",
    description: "查看和管理所有生成的剪纸作品",
    href: "/gallery",
    color: "bg-pink-500",
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-red-600 mb-4 font-chinese">
            AI传统剪纸设计
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            将现代AI技术与传统剪纸艺术完美结合，支持照片、文字、语音多种输入方式，
            覆盖99种语言，让每个人都能创作属于自己的剪纸艺术
          </p>
        </motion.div>

        {/* Decorative Paper Cut */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
            <Scissors className="w-16 h-16 text-white" />
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={feature.href}>
              <div className="card hover:scale-105 transition-transform duration-200 cursor-pointer h-full">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Language Support Section */}
      <section className="card paper-pattern">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          支持的语言
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "中文", "English", "العربية", "日本語", "한국어",
            "हिन्दी", "ไทย", "Tiếng Việt", "Español", "Français",
            "Deutsch", "Русский", "Português", "Italiano", "Nederlands"
          ].map((lang) => (
            <span
              key={lang}
              className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm border"
            >
              {lang}
            </span>
          ))}
          <span className="px-3 py-1 bg-red-100 rounded-full text-sm text-red-600 font-semibold">
            +84 更多语言
          </span>
        </div>
      </section>
    </div>
  );
}
