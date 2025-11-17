// Language types
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  scripts?: string[];
}

// Paper cut style types
export interface PaperCutStyle {
  id: string;
  name: string;
  description: string;
}

// Calligraphy style types
export interface CalligraphyStyle {
  id: string;
  name: string;
}

// Artwork types
export type ArtworkType = "text" | "photo" | "voice" | "calligraphy";

export interface Artwork {
  id: string;
  imageUrl: string;
  title: string;
  type: ArtworkType;
  prompt?: string;
  language?: string;
  style?: string;
  createdAt: string;
}

// API request types
export interface TextToPaperCutRequest {
  prompt: string;
  language?: string;
}

export interface PhotoToPaperCutRequest {
  image: string;
  style: string;
  detailLevel: number;
}

export interface CalligraphyRequest {
  text: string;
  language: string;
  style: string;
}

export interface TranscribeRequest {
  audio: Blob;
  language?: string;
}

// API response types
export interface GenerationResponse {
  imageUrl: string;
  prompt?: string;
}

export interface TranscriptionResponse {
  text: string;
}

export interface TutorialResponse {
  answer: string;
}

// Tutorial types
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Lesson {
  title: string;
  duration: string;
  content?: string;
  videoUrl?: string;
}

// FAQ types
export interface FAQItem {
  question: string;
  answer: string;
}
