import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import { rehypeObsidianCallouts } from "./src/lib/rehype-obsidian-callouts.mjs";
import { remarkDisplayMath } from "./src/lib/remark-display-math.mjs";

const site = process.env.SITE_URL || "https://just1cez.github.io";
const base = process.env.BASE_PATH || "/";

function codeBlockFilename() {
  return {
    pre(node) {
      const raw = this.options?.meta?.__raw;
      if (!raw) return;

      const match = raw.match(/(?:title|filename)=["']([^"']+)["']|(?:title|filename)=([^\s]+)/);
      const filename = match?.[1] || match?.[2];
      if (filename) node.properties.dataFilename = filename;
    },
  };
}

// Line numbers only help in longer blocks; short snippets get `is-short` and the CSS hides the gutter.
function shortCodeBlock(maxLines = 5) {
  return {
    pre(node) {
      if (this.lines.length <= maxLines) this.addClassToHast(node, "is-short");
    },
  };
}

export default defineConfig({
  site,
  base,
  output: "static",
  trailingSlash: "never",
  compressHTML: true,
  devToolbar: {
    enabled: false,
  },
  markdown: {
    processor: unified({
      // Match Obsidian's defaults: one-line `$$...$$` is display math, and a single newline is a line break.
      remarkPlugins: [remarkMath, remarkDisplayMath, remarkBreaks],
      rehypePlugins: [rehypeObsidianCallouts, rehypeKatex],
    }),
    shikiConfig: {
      themes: {
        light: "github-light-high-contrast",
        dark: "gruvbox-dark-medium",
      },
      transformers: [codeBlockFilename(), shortCodeBlock()],
    },
  },
  integrations: [
    // /rust stays unlisted until its first note is published; drop this filter then (see README, Rust 学习笔记).
    sitemap({ filter: (page) => !/\/rust\/?$/.test(page) }),
    react(),
  ],
});
