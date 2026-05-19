/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        accent: "var(--color-accent)",
        bg: "var(--color-bg)",
        bgSoft: "var(--color-bg-soft)",
        fg: "var(--color-fg)",
        fgMuted: "var(--color-fg-muted)",
        border: "var(--color-border)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};