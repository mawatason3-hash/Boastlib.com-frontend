import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#061023",
          blue: "#3b82f6",
          purple: "#8b5cf6",
          gold: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};

export default config;
