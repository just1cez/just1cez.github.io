/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        accent: { DEFAULT: "#3b82f6", dark: "#60a5fa" },
        bg: { DEFAULT: "#ffffff", dark: "#0f172a" },
        bgSoft: { DEFAULT: "#f8fafc", dark: "#1e293b" },
        fg: { DEFAULT: "#1e293b", dark: "#e2e8f0" },
        fgMuted: { DEFAULT: "#64748b", dark: "#94a3b8" },
        border: { DEFAULT: "#e2e8f0", dark: "#334155" },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};