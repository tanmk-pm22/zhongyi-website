"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Scissors, FoldVertical, MessageCircle, ChevronRight, Play, Flower2, Star, LucideIcon } from "lucide-react";

interface Lesson {
  title: string;
  duration: string;
  content: string;
  steps?: string[];
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  lessons: Lesson[];
}

const tutorials: Tutorial[] = [
  {
    id: "basics",
    title: "剪纸基础",
    description: "学习剪纸的基本工具和技巧",
    icon: Scissors,
    lessons: [
      { title: "工具准备", duration: "5分钟", content: "准备尖头小剪刀、红色宣纸、铅笔、橡皮、刻刀（可选）" },
      { title: "纸张选择", duration: "3分钟", content: "推荐使用红色宣纸或彩色手工纸，厚度适中易于折叠" },
      { title: "基础剪法", duration: "10分钟", content: "直线剪、曲线剪、锯齿剪、月牙剪等基本技法" },
      { title: "安全注意事项", duration: "3分钟", content: "使用剪刀时注意安全，剪刀尖朝下放置" },
    ],
  },
  {
    id: "folding",
    title: "折叠技法",
    description: "掌握各种折纸方法",
    icon: FoldVertical,
    lessons: [
      {
        title: "对折法（二折）",
        duration: "5分钟",
        content: "将纸对折一次，可剪出左右对称图案。适合：蝴蝶、花瓶、人物",
        steps: ["将正方形纸对折", "在折边画半个图案", "沿线剪下", "展开即得对称图案"]
      },
      {
        title: "三角折（三折）",
        duration: "5分钟",
        content: "折成三角形，适合剪三瓣花、三角形图案",
        steps: ["正方形纸对角折", "再将两角向中心折", "形成三角形", "剪出图案后展开"]
      },
      {
        title: "四折法",
        duration: "8分钟",
        content: "两次对折，可剪出四方对称图案。适合：窗花、福字",
        steps: ["正方形纸横向对折", "再纵向对折", "在角上画图案", "剪后展开成四方对称"]
      },
      {
        title: "五折法",
        duration: "10分钟",
        content: "折成五等分，适合剪五角星、五瓣花",
        steps: ["正方形纸对折", "找到中点，将一角折向中点", "另一角反向折叠", "形成五等分扇形", "剪出图案"]
      },
      {
        title: "六折法",
        duration: "10分钟",
        content: "折成六等分，适合剪雪花、六瓣花",
        steps: ["正方形纸对折成三角形", "将三角形三等分折叠", "形成六层扇形", "剪出图案展开"]
      },
      {
        title: "八折法",
        duration: "12分钟",
        content: "三次对折，可剪出八方对称图案。适合：复杂窗花",
        steps: ["正方形纸对折", "再对折成小正方形", "对角折成三角形", "剪出图案展开成八方对称"]
      },
    ],
  },
  {
    id: "tuanhua",
    title: "折剪团花",
    description: "学习传统团花的折剪技法",
    icon: Flower2,
    lessons: [
      {
        title: "团花基础",
        duration: "8分钟",
        content: "团花是圆形对称剪纸，寓意团圆美满",
        steps: ["准备圆形或正方形纸", "根据瓣数选择折法", "在扇形上设计图案", "剪后展开成放射状"]
      },
      {
        title: "四瓣团花",
        duration: "10分钟",
        content: "最简单的团花，适合初学者",
        steps: ["正方形纸两次对折", "画出四分之一图案", "注意保持连接点", "剪后展开成四瓣花"]
      },
      {
        title: "六瓣团花",
        duration: "12分钟",
        content: "经典团花造型，如雪花",
        steps: ["正方形纸对角折", "三等分折叠", "设计六分之一图案", "剪后展开成六瓣"]
      },
      {
        title: "八瓣团花",
        duration: "15分钟",
        content: "复杂精美的团花",
        steps: ["正方形纸三次对折", "画出八分之一图案", "细节要精细", "展开成八瓣团花"]
      },
      {
        title: "十二瓣团花",
        duration: "18分钟",
        content: "高难度团花，需要耐心",
        steps: ["六折后再对折", "画出十二分之一图案", "线条要简洁", "小心展开"]
      },
    ],
  },
  {
    id: "patterns",
    title: "图案设计",
    description: "学习传统图案的设计原则",
    icon: BookOpen,
    lessons: [
      {
        title: "对称图案",
        duration: "8分钟",
        content: "左右对称或中心对称，是剪纸最基本的构图方式",
        steps: ["确定对称轴", "只需设计一半", "注意连接点位置", "展开后检查平衡"]
      },
      {
        title: "连续图案",
        duration: "10分钟",
        content: "重复排列的图案，适合做边框装饰",
        steps: ["设计单元图案", "确保首尾可连接", "折叠成风琴式", "一次剪出多个重复"]
      },
      {
        title: "吉祥图案",
        duration: "12分钟",
        content: "龙凤、鱼、蝙蝠等寓意吉祥的传统图案",
        steps: ["了解图案寓意", "简化造型特征", "保持连接完整", "添加装饰纹样"]
      },
      {
        title: "生肖图案",
        duration: "15分钟",
        content: "十二生肖的剪纸造型设计",
        steps: ["抓住动物特征", "夸张关键部位", "添加吉祥元素", "注意整体平衡"]
      },
      {
        title: "文字图案",
        duration: "10分钟",
        content: "福、禄、寿、喜等吉祥文字",
        steps: ["选择适合字体", "简化笔画结构", "确保字形连接", "可添加边框装饰"]
      },
    ],
  },
];

// 折剪团花详细教程数据
const tuanhuaGuides = [
  {
    name: "六瓣雪花",
    difficulty: "初级",
    folds: 6,
    steps: [
      "准备一张正方形红纸",
      "对角折成三角形",
      "将三角形底边三等分",
      "左右两角分别向中心折叠",
      "在扇形上画雪花图案",
      "沿线剪下，注意保持连接",
      "轻轻展开成六瓣雪花"
    ]
  },
  {
    name: "八瓣窗花",
    difficulty: "中级",
    folds: 8,
    steps: [
      "准备正方形纸",
      "对折成长方形",
      "再对折成小正方形",
      "对角折成三角形",
      "在三角形上设计图案",
      "从内向外依次剪",
      "展开成八方对称窗花"
    ]
  },
  {
    name: "十二瓣莲花",
    difficulty: "高级",
    folds: 12,
    steps: [
      "正方形纸对角折",
      "三等分折成扇形",
      "再对折一次",
      "画出花瓣轮廓",
      "添加内部纹理",
      "细心剪出细节",
      "缓慢展开成莲花"
    ]
  }
];

const faqItems = [
  {
    question: "初学者应该从哪里开始？",
    answer: "建议从四折法开始，先剪简单的窗花。掌握后再学六折雪花，循序渐进。",
  },
  {
    question: "剪纸需要什么工具？",
    answer: "基本工具：尖头小剪刀、红色宣纸或彩纸、铅笔、橡皮。高级可使用刻刀和切割垫。",
  },
  {
    question: "如何避免剪断图案？",
    answer: "设计时确保所有部分相连，剪的时候从内向外剪，先剪细节再剪轮廓。每个图案元素至少要有一个连接点。",
  },
  {
    question: "折纸时怎样保证对齐？",
    answer: "折叠时边角对齐要准确，用指甲压实折痕。折好后可用夹子固定，防止剪时移动。",
  },
  {
    question: "如何设计团花图案？",
    answer: "先确定瓣数和折法，在扇形纸上只需设计一瓣的图案。注意在折边处保留连接点，展开后才能完整。",
  },
  {
    question: "AI生成的图案如何剪？",
    answer: "下载AI生成的图案后打印，将图案贴在折好的纸上作为模板，沿线条剪即可。AI会自动保证图案的连接性。",
  },
];

export default function TutorialPage() {
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
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

  const currentTutorial = tutorials.find(t => t.id === selectedTutorial);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">剪纸教程</h1>
        <p className="text-gray-600">从入门到精通，学习传统折纸剪纸艺术</p>
      </div>

      {/* Tutorial Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tutorials.map((tutorial, index) => (
          <motion.div
            key={tutorial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className={`card cursor-pointer transition-all hover:scale-105 h-full ${
                selectedTutorial === tutorial.id ? "ring-2 ring-red-500" : ""
              }`}
              onClick={() => {
                setSelectedTutorial(selectedTutorial === tutorial.id ? null : tutorial.id);
                setSelectedLesson(null);
              }}
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <tutorial.icon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{tutorial.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{tutorial.description}</p>
              <p className="text-xs text-gray-400">{tutorial.lessons.length} 节课程</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Tutorial Content */}
      {currentTutorial && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <currentTutorial.icon className="w-6 h-6 text-red-600 mr-2" />
            {currentTutorial.title}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Lesson List */}
            <div className="space-y-2">
              {currentTutorial.lessons.map((lesson, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedLesson === i
                      ? "bg-red-50 border-2 border-red-300"
                      : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                  }`}
                  onClick={() => setSelectedLesson(selectedLesson === i ? null : i)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Play className={`w-4 h-4 ${selectedLesson === i ? "text-red-500" : "text-gray-400"}`} />
                      <span className="font-medium text-sm">{lesson.title}</span>
                    </div>
                    <span className="text-xs text-gray-400">{lesson.duration}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Lesson Detail */}
            <div className="bg-gray-50 rounded-lg p-4">
              {selectedLesson !== null ? (
                <div>
                  <h3 className="font-semibold mb-3">
                    {currentTutorial.lessons[selectedLesson].title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {currentTutorial.lessons[selectedLesson].content}
                  </p>

                  {currentTutorial.lessons[selectedLesson].steps && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">步骤：</h4>
                      <ol className="list-decimal list-inside space-y-1">
                        {currentTutorial.lessons[selectedLesson].steps?.map((step, i) => (
                          <li key={i} className="text-sm text-gray-600">{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>选择左侧课程查看详情</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* 折剪团花快速指南 */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold">折剪团花快速指南</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {tuanhuaGuides.map((guide, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{guide.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  guide.difficulty === "初级" ? "bg-green-100 text-green-600" :
                  guide.difficulty === "中级" ? "bg-amber-100 text-amber-600" :
                  "bg-red-100 text-red-600"
                }`}>
                  {guide.difficulty}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{guide.folds}折法</p>
              <ol className="list-decimal list-inside space-y-1">
                {guide.steps.map((step, i) => (
                  <li key={i} className="text-xs text-gray-600">{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
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
            placeholder="例如：如何折出六瓣团花？怎样设计窗花图案？"
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
            <p className="text-gray-700 whitespace-pre-line">{aiResponse}</p>
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
