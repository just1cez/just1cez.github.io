/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        fg: "var(--color-fg)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        link: "var(--color-link)",
        linkHover: "var(--color-link-hover)",
        focus: "var(--color-focus)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      fontSize: {
        "3.5xl": ["2rem", { lineHeight: "2.4rem" }],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            h1: {
              fontFamily: "var(--font-serif)",
              fontWeight: "700",
            },
            h2: {
              fontFamily: "var(--font-serif)",
              fontWeight: "700",
            },
            h3: {
              fontFamily: "var(--font-serif)",
              fontWeight: "700",
            },
            a: {
              color: "var(--color-link)",
              textDecoration: "underline",
              textDecorationThickness: "0.1em",
              textDecorationColor: "color-mix(in srgb, var(--color-link) 45%, transparent)",
              textUnderlineOffset: "2px",
              transition: "color 0.3s, background-color 0.3s, text-decoration-color 0.3s",
              "&:hover": {
                color: "var(--color-link-hover)",
                backgroundColor: "transparent",
                textDecorationColor: "var(--color-link-hover)",
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
              color: "var(--color-link)",
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
              borderLeftColor: "var(--color-link)",
              color: "var(--color-muted)",
              fontStyle: "normal",
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
              color: "var(--color-link)",
              "&:hover": {
                color: "var(--color-link-hover)",
                backgroundColor: "transparent",
              },
            },
            strong: { color: "var(--color-fg)" },
            code: { color: "var(--color-inline-code-text)" },
            "a code": { color: "var(--color-link)" },
            blockquote: { color: "var(--color-muted)" },
            th: { color: "var(--color-fg)" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: "class",
};
