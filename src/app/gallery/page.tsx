"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Trash2, Search, Filter, Grid, List } from "lucide-react";

// Mock data - in real app, this would come from a database/API
const mockArtworks = [
  {
    id: "1",
    imageUrl: "/placeholder-dragon.png",
    title: "龙凤呈祥",
    type: "text",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    imageUrl: "/placeholder-flower.png",
    title: "荷花蜻蜓",
    type: "photo",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    imageUrl: "/placeholder-zodiac.png",
    title: "生肖虎",
    type: "voice",
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    imageUrl: "/placeholder-calligraphy.png",
    title: "福字书法",
    type: "calligraphy",
    createdAt: "2024-01-12",
  },
];

const typeLabels: Record<string, string> = {
  text: "文字生成",
  photo: "照片转换",
  voice: "语音生成",
  calligraphy: "书法作品",
};

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [artworks] = useState(mockArtworks);

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || artwork.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDownload = (imageUrl: string, title: string) => {
    // In real app, this would trigger actual download
    console.log("Downloading:", imageUrl, title);
    alert(`下载 ${title}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个作品吗？")) {
      // In real app, this would delete from database
      console.log("Deleting:", id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">我的作品</h1>
        <p className="text-gray-600">管理您创作的所有剪纸和书法作品</p>
      </div>

      {/* Toolbar */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索作品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedType || ""}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="input-field py-2"
              >
                <option value="">全部类型</option>
                <option value="text">文字生成</option>
                <option value="photo">照片转换</option>
                <option value="voice">语音生成</option>
                <option value="calligraphy">书法作品</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow" : ""}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow" : ""}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Artworks */}
      {filteredArtworks.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">
            {searchQuery || selectedType ? "没有找到匹配的作品" : "还没有作品，去创作一个吧！"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="card p-3 group"
            >
              <div className="relative aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  {/* Placeholder - in real app, show actual image */}
                  <span className="text-4xl">✂️</span>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleDownload(artwork.imageUrl, artwork.title)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(artwork.id)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              <h3 className="font-medium text-sm truncate">{artwork.title}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">{typeLabels[artwork.type]}</span>
                <span className="text-xs text-gray-400">{artwork.createdAt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✂️</span>
                </div>
                <div>
                  <h3 className="font-medium">{artwork.title}</h3>
                  <p className="text-sm text-gray-500">
                    {typeLabels[artwork.type]} · {artwork.createdAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(artwork.imageUrl, artwork.title)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(artwork.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
