"use client";

import { useState } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { clsx } from "clsx";

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  scripts?: string[];
}

export const languages: Language[] = [
  { code: "zh", name: "Chinese", nativeName: "中文", scripts: ["楷书", "行书", "草书", "隶书", "篆书"] },
  { code: "ar", name: "Arabic", nativeName: "العربية", scripts: ["Thuluth", "Naskh", "Diwani", "Kufi"] },
  { code: "ja", name: "Japanese", nativeName: "日本語", scripts: ["楷書", "行書", "草書"] },
  { code: "ko", name: "Korean", nativeName: "한국어", scripts: ["정자", "흘림체"] },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", scripts: ["Devanagari"] },
  { code: "th", name: "Thai", nativeName: "ไทย", scripts: ["Traditional"] },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "en", name: "English", nativeName: "English", scripts: ["Copperplate", "Italic", "Gothic"] },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "he", name: "Hebrew", nativeName: "עברית" },
  { code: "fa", name: "Persian", nativeName: "فارسی" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
  { code: "da", name: "Danish", nativeName: "Dansk" },
  { code: "no", name: "Norwegian", nativeName: "Norsk" },
  { code: "fi", name: "Finnish", nativeName: "Suomi" },
  { code: "cs", name: "Czech", nativeName: "Čeština" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar" },
  { code: "ro", name: "Romanian", nativeName: "Română" },
];

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
  showScripts?: boolean;
}

export function LanguageSelector({ value, onChange, showScripts = false }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(search.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-red-400 transition-colors"
      >
        <span className="flex items-center space-x-2">
          <span className="font-medium">{value.nativeName}</span>
          <span className="text-gray-400">({value.name})</span>
        </span>
        <ChevronDown className={clsx("w-5 h-5 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索语言..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-red-400"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-60">
            {filteredLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onChange(lang);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={clsx(
                  "w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors",
                  value.code === lang.code && "bg-red-50"
                )}
              >
                <span className="flex items-center space-x-2">
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-gray-400 text-sm">({lang.name})</span>
                </span>
                {value.code === lang.code && (
                  <Check className="w-4 h-4 text-red-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
