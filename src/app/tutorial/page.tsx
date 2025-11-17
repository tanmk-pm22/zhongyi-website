"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Scissors, FoldVertical, MessageCircle, ChevronRight, Play } from "lucide-react";

const tutorials = [
  {
    id: "basics",
    title: "剪纸基础",
    description: "学习剪纸的基本工具和技巧",
    icon: Scissors,
    lessons: [
      { title: "工具准备", duration: "5分钟" },
      { title: "纸张选择", duration: "3分钟" },
      { title: "基础剪法", duration: "10分钟" },
      { title: "安全注意事项", duration: "3分钟" },
    ],
  },
  {
    id: "folding",
    title: "折叠技法",
    description: "掌握各种折纸方法",
    icon: FoldVertical,
    lessons: [
      { title: "对折法", duration: "5分钟" },
      { title: "三角折", duration: "5分钟" },
      { title: "四折法", duration: "8分钟" },
      { title: "六折法", duration: "10分钟" },
      { title: "八折法", duration: "12分钟" },
    ],
  },
  {
    id: "patterns",
    title: "图案设计",
    description: "学习传统图案的设计原则",
    icon: BookOpen,
    lessons: [
      { title: "对称图案", duration: "8分钟" },
      { title: "连续图案", duration: "10分钟" },
      { title: "吉祥图案", duration: "12分钟" },
      { title: "生肖图案", duration: "15分钟" },
    ],
  },
];

const faqItems = [
  {
    question: "初学者应该从哪里开始？",
    answer: "建议从基础折叠和简单的对称图案开始，如雪花、窗花等。熟练后再尝试复杂的图案。",
  },
  {
    question: "剪纸需要什么工具？",
    answer: "基本工具包括：剪刀（尖头小剪刀最佳）、红色宣纸或彩纸、铅笔、橡皮。高级可使用刻刀和切割垫。",
  },
  {
    question: "如何避免剪断图案？",
    answer: "关键是保持图案的连接性。设计时确保所有部分相连，剪的时候从内向外剪，先剪细节再剪轮廓。",
  },
  {
    question: "AI生成的图案如何剪？",
    answer: "AI生成的图案会自动考虑连接性。下载后打印，将图案贴在折好的纸上，沿线条剪即可。",
  },
];

export default function TutorialPage() {
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return;

    setIsAsking(true);
    try {
      const response = await fetch("/api/tutorial/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: aiQuestion }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setAiResponse(data.answer);
    } catch (error) {
      console.error("Error:", error);
      setAiResponse("抱歉，暂时无法回答您的问题，请稍后再试。");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">剪纸教程</h1>
        <p className="text-gray-600">从入门到精通，AI辅助学习传统剪纸艺术</p>
      </div>

      {/* Tutorial Categories */}
      <div className="grid md:grid-cols-3 gap-6">
        {tutorials.map((tutorial, index) => (
          <motion.div
            key={tutorial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className={`card cursor-pointer transition-all hover:scale-105 ${
                selectedTutorial === tutorial.id ? "ring-2 ring-red-500" : ""
              }`}
              onClick={() => setSelectedTutorial(
                selectedTutorial === tutorial.id ? null : tutorial.id
              )}
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <tutorial.icon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{tutorial.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{tutorial.description}</p>
              <p className="text-xs text-gray-400">{tutorial.lessons.length} 节课程</p>
            </div>

            {/* Expanded Lessons */}
            {selectedTutorial === tutorial.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 bg-gray-50 rounded-lg p-4"
              >
                {tutorial.lessons.map((lesson, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <Play className="w-4 h-4 text-red-500" />
                      <span className="text-sm">{lesson.title}</span>
                    </div>
                    <span className="text-xs text-gray-400">{lesson.duration}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* AI Assistant */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI剪纸助手</h2>
            <p className="text-sm text-gray-500">有问题？问我吧！</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder="例如：如何剪出均匀的窗花？"
            className="input-field flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
          />
          <button
            onClick={handleAskAI}
            disabled={!aiQuestion.trim() || isAsking}
            className="btn-primary disabled:opacity-50"
          >
            {isAsking ? "思考中..." : "提问"}
          </button>
        </div>

        {aiResponse && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-700">{aiResponse}</p>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">常见问题</h2>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <details key={index} className="group">
              <summary className="flex items-center justify-between cursor-pointer py-2">
                <span className="font-medium">{item.question}</span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-gray-600 text-sm pl-4 pb-2">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
