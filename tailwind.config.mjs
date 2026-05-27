/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        accent: "var(--color-accent)",
        accentWarm: "var(--color-accent-warm)",
        bg: "var(--color-bg)",
        bgSoft: "var(--color-bg-soft)",
        fg: "var(--color-fg)",
        fgMuted: "var(--color-fg-muted)",
        border: "var(--color-border)",
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', "STSong", "serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            h1: {
              fontFamily: '"Noto Serif SC", "Source Han Serif SC", STSong, serif',
              fontWeight: "700",
            },
            h2: {
              fontFamily: '"Noto Serif SC", "Source Han Serif SC", STSong, serif',
              fontWeight: "700",
            },
            h3: {
              fontFamily: '"Noto Serif SC", "Source Han Serif SC", STSong, serif',
              fontWeight: "700",
            },
            a: {
              color: "var(--color-accent)",
              textDecoration: "underline",
              textDecorationThickness: "0.1em",
              textDecorationColor: "var(--color-accent)",
              textUnderlineOffset: "2px",
              transition: "color 0.3s, background-color 0.3s, text-decoration-color 0.3s",
              "&:hover": {
                color: "var(--color-bg)",
                backgroundColor: "var(--color-accent)",
                textDecorationColor: "var(--color-accent)",
              },
            },
            strong: { color: "var(--color-fg)" },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
            code: {
              color: "var(--color-inline-code-text)",
              background: "var(--color-inline-code-bg)",
              borderRadius: "0.25rem",
              padding: "0.125rem 0.375rem",
              fontWeight: "500",
              fontSize: "0.875em",
            },
            "a code": {
              color: "var(--color-accent)",
              background: "transparent",
            },
            "pre code": {
              color: "inherit",
              background: "transparent",
              padding: "0",
              fontWeight: "inherit",
              fontSize: "inherit",
            },
            blockquote: {
              borderLeftColor: "var(--color-accent)",
              color: "var(--color-fg-muted)",
              fontStyle: "italic",
            },
            hr: { borderColor: "var(--color-border)" },
            th: { color: "var(--color-fg)" },
            "thead th": { borderBottomColor: "var(--color-border)" },
            "tbody tr": { borderBottomColor: "var(--color-border)" },
          },
        },
        invert: {
          css: {
            a: {
              color: "var(--color-accent)",
              "&:hover": {
                color: "var(--color-bg)",
                backgroundColor: "var(--color-accent)",
              },
            },
            strong: { color: "var(--color-fg)" },
            code: { color: "var(--color-inline-code-text)" },
            "a code": { color: "var(--color-accent)" },
            blockquote: { color: "var(--color-fg-muted)" },
            th: { color: "var(--color-fg)" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: "class",
};
