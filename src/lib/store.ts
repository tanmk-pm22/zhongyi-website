import { create } from "zustand";
import { persist } from "zustand/middleware";

// Artwork type
export interface Artwork {
  id: string;
  imageUrl: string;
  title: string;
  type: "text" | "photo" | "voice" | "calligraphy";
  prompt?: string;
  createdAt: string;
}

// App state interface
interface AppState {
  // Artworks
  artworks: Artwork[];
  addArtwork: (artwork: Artwork) => void;
  removeArtwork: (id: string) => void;
  clearArtworks: () => void;

  // Generation history
  history: string[];
  addToHistory: (prompt: string) => void;
  clearHistory: () => void;

  // Settings
  defaultLanguage: string;
  setDefaultLanguage: (lang: string) => void;

  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Artworks
      artworks: [],
      addArtwork: (artwork) =>
        set((state) => ({
          artworks: [artwork, ...state.artworks],
        })),
      removeArtwork: (id) =>
        set((state) => ({
          artworks: state.artworks.filter((a) => a.id !== id),
        })),
      clearArtworks: () => set({ artworks: [] }),

      // History
      history: [],
      addToHistory: (prompt) =>
        set((state) => ({
          history: [prompt, ...state.history.filter((p) => p !== prompt)].slice(0, 20),
        })),
      clearHistory: () => set({ history: [] }),

      // Settings
      defaultLanguage: "zh",
      setDefaultLanguage: (lang) => set({ defaultLanguage: lang }),

      // Theme
      theme: "light",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "ai-papercut-storage",
      partialize: (state) => ({
        artworks: state.artworks,
        history: state.history,
        defaultLanguage: state.defaultLanguage,
        theme: state.theme,
      }),
    }
  )
);

// Selector hooks for better performance
export const useArtworks = () => useAppStore((state) => state.artworks);
export const useHistory = () => useAppStore((state) => state.history);
export const useTheme = () => useAppStore((state) => state.theme);
