import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const dist = path.join(process.cwd(), "dist");

async function read(relativePath) {
  return readFile(path.join(dist, relativePath), "utf8");
}

const [home, articles, tech, life, article, macbookGuide, cppTips, dgosr, about, search, searchJson, rss, notFound] = await Promise.all([
  read("index.html"),
  read("articles/index.html"),
  read("tech/index.html"),
  read("life/index.html"),
  read("tech/start-here/index.html"),
  read("tech/macbook-new-student-guide/index.html"),
  read("tech/cpp-tips/index.html"),
  read("tech/dgosr/index.html"),
  read("about/index.html"),
  read("search/index.html"),
  read("search.json"),
  read("rss.xml"),
  read("404.html"),
]);
const searchEntries = JSON.parse(searchJson);
const techCount = searchEntries.filter((entry) => entry.category === "tech").length;
const lifeCount = searchEntries.filter((entry) => entry.category === "life").length;
const archiveYears = [...new Set(searchEntries.map((entry) => new Date(entry.date).getUTCFullYear()))];
const canonicalUrl = home.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
assert.ok(canonicalUrl, "the homepage should have a canonical URL");
const avatarUrl = new URL("images/avatar.jpg", canonicalUrl).href;

assert.match(home, /<meta property="og:type" content="website">/);
assert.ok(home.includes(`<meta property="og:image" content="${avatarUrl}">`));
assert.match(home, /<img[^>]+src="\/images\/avatar\.jpg"/);
assert.match(home, /aria-label="主导航"/);
assert.match(home, /href="\/articles"[^>]*>\s*文章\s*<\/a>/);
assert.match(articles, /<title>文章 — Justice<\/title>/);
assert.match(articles, new RegExp(`${searchEntries.length} 篇文章`));
assert.match(articles, /aria-label="文章浏览"/);
assert.match(articles, new RegExp(`全部\\s*${searchEntries.length}`));
assert.match(articles, new RegExp(`href="/tech"[^>]*>\\s*技术 ${techCount}\\s*</a>`));
assert.match(articles, new RegExp(`href="/life"[^>]*>\\s*生活 ${lifeCount}\\s*</a>`));
assert.match(articles, /href="\/tags"/);
assert.match(articles, /href="\/series"/);
assert.match(articles, /约 \d+ 分钟/);
archiveYears.forEach((year) => assert.match(articles, new RegExp(`id="archive-year-${year}"`)));
assert.match(tech, /<title>技术笔记 — Justice<\/title>/);
assert.match(life, /<title>生活杂谈 — Justice<\/title>/);
assert.match(home, /<time>\d{4}\/\d{2}\/\d{2}<\/time>/, "list dates should be zero-padded so the date column lines up");
assert.match(home, /id="home-title"[^>]*>Justice<\/h1>\s*<p[^>]*>[^<]{4,}<\/p>/, "the homepage hero should carry a one-line intro");
assert.match(home, /<aside[^>]*aria-label="近况"/, "the homepage should have the now/project sidebar");
assert.match(home, /id="work"/, "the 项目 nav link targets /#work");
assert.match(home, /class="stage-tag/, "post cards should render the stage tag");
assert.match(home, /id="home-title" class="[^"]*tracking-\[-0\.025em\]/, "the Latin Justice wordmark keeps its tight tracking");
assert.match(about, /aria-label="自述">\s*<p>HITSZ 计科在读/, "the about page opens with the same intro as the homepage");
assert.match(about, /为什么开这个博客，我也说不出什么特别的理由。/, "the about page keeps the author's own sentence");
assert.match(article, /<meta property="og:type" content="article">/);
assert.match(article, /"@type":"BlogPosting"/);
assert.ok(article.includes(`"image":"${avatarUrl}"`));
assert.match(article, /"timeRequired":"PT\d+M"/);
assert.match(article, /约 \d+ 分钟/);
assert.match(article, /<article class="[^"]*\bmin-w-0\b/, "the post column must be allowed to shrink so wide code and tables scroll instead of widening the page on mobile");
assert.match(macbookGuide, /<title>MacBook 新生配置指北 — Justice<\/title>/);
assert.match(macbookGuide, /\/images\/posts\/macbook-new-student-guide\/macos-app-security-setting\.png/);
assert.match(macbookGuide, /<pre\b[^>]*\bclass="astro-code\b[^"]*\bis-short\b/, "short code blocks should be marked so their line numbers are hidden");
assert.match(macbookGuide, /<pre\b[^>]*\bclass="astro-code\b(?![^"]*\bis-short\b)[^"]*"/, "long code blocks should keep line numbers");
assert.match(dgosr, /class="katex-display"/, "a paragraph that is only $$...$$ should render as display math");
assert.doesNotMatch(dgosr, /<pre[^>]*>\s*<code class="language-math/, "display math should be rendered by KaTeX, not left as a code block");
assert.match(cppTips, /<p class="obsidian-callout-title">竞赛代码速查<\/p>\s*<p>难度：基础模板<br>/, "single newlines inside a callout should render as line breaks");
assert.match(about, /<img[^>]+src="\/images\/avatar\.jpg"/);
assert.match(search, /<h1 class="page-title">搜索<\/h1>/);
assert.match(rss, /<rss[\s>]/);
assert.match(notFound, /<title>404 — Justice<\/title>/);
assert.match(notFound, /aria-label="主导航"/, "the 404 page should use the shared site layout");

// Web-font @font-face rules must not sit in render-blocking CSS; they load from a separate print->all stylesheet.
// <noscript> fallbacks only load when JavaScript is off, so they don't block rendering for everyone else.
const stylesheets = [...home.replace(/<noscript>[\s\S]*?<\/noscript>/g, "").matchAll(/<link rel="stylesheet" href="([^"]+)"([^>]*)>/g)].map(([, href, rest]) => ({ href, async: /media="print"/.test(rest) }));
const fontFaceRule = /@font-face\s*{[^}]*Noto Serif SC/;
for (const { href, async } of stylesheets) {
  const css = await read(href.replace(/^\//, ""));
  if (async) assert.match(css, fontFaceRule, `async stylesheet ${href} should carry the Noto Serif SC @font-face rules`);
  else assert.doesNotMatch(css, fontFaceRule, `render-blocking stylesheet ${href} should not carry web-font @font-face rules`);
}
assert.ok(stylesheets.some((s) => s.async), "the web-font stylesheet should load without blocking render");

// A page that asks not to be indexed must not be listed in the sitemap (and vice versa for /rust once it launches).
const [rustPage, sitemap] = await Promise.all([read("rust/index.html"), read("sitemap-0.xml")]);
const rustNoindex = /<meta name="robots" content="noindex">/.test(rustPage);
assert.equal(/\/rust<\/loc>/.test(sitemap), !rustNoindex, rustNoindex ? "/rust is noindex, so it must stay out of the sitemap" : "/rust is published now: remove the sitemap filter in astro.config.mjs");

const homeIslands = home.match(/<astro-island\b/g) ?? [];
assert.equal(homeIslands.length, 0, "the editorial homepage should ship without hydrated islands");
const articlesIslands = articles.match(/<astro-island\b/g) ?? [];
assert.equal(articlesIslands.length, 0, "the article archive should ship without hydrated islands");
const searchIslands = search.match(/<astro-island\b/g) ?? [];
assert.equal(searchIslands.length, 1, "the search page should hydrate only the interactive search UI");

assert.ok(Array.isArray(searchEntries) && searchEntries.length > 0, "search.json should contain published posts");
assert.ok(searchEntries.every((entry) => entry.draft === false), "search.json must not expose drafts");
assert.equal(new Set(searchEntries.map((entry) => entry.url)).size, searchEntries.length, "search URLs must be unique");
const macbookEntry = searchEntries.find((entry) => entry.url.endsWith("/tech/macbook-new-student-guide"));
assert.ok(macbookEntry?.body.includes("Ghostty"), "search.json should index the full post body, not just an excerpt");

console.log("Build smoke test passed: home, article index, category, post, search, RSS, and 404 outputs are valid.");
