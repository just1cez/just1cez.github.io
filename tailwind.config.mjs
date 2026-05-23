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
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            a: {
              color: "var(--color-accent)",
              textDecoration: "underline",
              textDecorationColor: "var(--color-accent)",
              "&:hover": {
                color: "var(--color-fg)",
                textDecorationColor: "var(--color-fg)",
              },
            },
            strong: { color: "var(--color-fg)" },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
            code: {
              color: "var(--color-fg)",
              background: "var(--color-bg-soft)",
              borderRadius: "0.25rem",
              padding: "0.125rem 0.25rem",
              fontWeight: "400",
            },
            "a code": { color: "var(--color-accent)" },
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
              "&:hover": { color: "var(--color-fg)" },
            },
            strong: { color: "var(--color-fg)" },
            code: { color: "var(--color-fg)" },
            "a code": { color: "var(--color-accent)" },
            blockquote: {
              color: "var(--color-fg-muted)",
            },
            th: { color: "var(--color-fg)" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: "class",
};