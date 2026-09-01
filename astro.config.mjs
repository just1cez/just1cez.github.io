import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
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

function rehypeObsidianCallouts() {
  const calloutMarker = /^\[!([A-Za-z][\w-]*)]\s*([^\n]*)/;

  function visit(node) {
    if (!node || typeof node !== "object") return;

    if (node.type === "element" && node.tagName === "blockquote") {
      const firstChild = node.children?.find((child) => child.type === "element" && child.tagName === "p");
      const firstText = firstChild?.children?.find((child) => child.type === "text");
      const match = firstText?.value?.match(calloutMarker);

      if (match) {
        const type = match[1].toLowerCase();
        const title = match[2] || type;
        const rest = firstText.value.slice(match[0].length).replace(/^\n/, "");

        node.tagName = "aside";
        node.properties = {
          ...(node.properties ?? {}),
          className: ["obsidian-callout", `obsidian-callout-${type}`],
        };

        firstText.value = title;
        firstChild.properties = {
          ...(firstChild.properties ?? {}),
          className: ["obsidian-callout-title"],
        };

        if (rest.trim()) {
          const titleIndex = node.children.indexOf(firstChild);
          node.children.splice(titleIndex + 1, 0, {
            type: "element",
            tagName: "p",
            properties: {},
            children: [{ type: "text", value: rest }],
          });
        }
      }
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) visit(child);
    }
  }

  return (tree) => visit(tree);
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
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeObsidianCallouts, rehypeKatex],
    }),
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "dracula",
      },
      transformers: [codeBlockFilename()],
    },
  },
  integrations: [
    sitemap(),
    react(),
  ],
});
