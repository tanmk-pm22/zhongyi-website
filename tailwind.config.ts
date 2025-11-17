import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          red: '#DC2626',
          gold: '#F59E0B',
          cream: '#FEF3C7',
        },
      },
      fontFamily: {
        chinese: ['Noto Serif SC', 'serif'],
        arabic: ['Noto Naskh Arabic', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
