import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

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

export default defineConfig({
  site,
  base,
  output: "static",
  trailingSlash: "never",
  devToolbar: {
    enabled: false,
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "dracula",
      },
      transformers: [codeBlockFilename()],
    },
  },
  integrations: [
    mdx(),
    sitemap(),
    react(),
  ],
});
