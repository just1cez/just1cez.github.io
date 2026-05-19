/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        accent: "#3b82f6",
        accentDark: "#2563eb",
        bg: "#ffffff",
        bgSoft: "#f8fafc",
        fg: "#1e293b",
        fgMuted: "#64748b",
        border: "#e2e8f0",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: { color: theme("colors.accent"), textDecoration: "underline" },
            code: {
              backgroundColor: theme("colors.bgSoft"),
              padding: "0.15em 0.3em",
              borderRadius: "0.25em",
              fontWeight: "400",
            },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
          },
        },
      }),
    },
  },
  plugins: [],
  darkMode: "class",
};