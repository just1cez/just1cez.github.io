import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const dist = path.join(process.cwd(), "dist");

async function read(relativePath) {
  return readFile(path.join(dist, relativePath), "utf8");
}

const [home, articles, tech, life, article, macbookGuide, about, search, searchJson, rss, notFound] = await Promise.all([
  read("index.html"),
  read("articles/index.html"),
  read("tech/index.html"),
  read("life/index.html"),
  read("tech/start-here/index.html"),
  read("tech/macbook-new-student-guide/index.html"),
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
assert.match(tech, /<title>Tech — Justice<\/title>/);
assert.match(life, /<title>Life — Justice<\/title>/);
assert.match(article, /<meta property="og:type" content="article">/);
assert.match(article, /"@type":"BlogPosting"/);
assert.ok(article.includes(`"image":"${avatarUrl}"`));
assert.match(article, /"timeRequired":"PT\d+M"/);
assert.match(article, /约 \d+ 分钟/);
assert.match(macbookGuide, /<title>MacBook 新生配置指北 — Justice<\/title>/);
assert.match(macbookGuide, /\/images\/posts\/macbook-new-student-guide\/macos-app-security-setting\.png/);
assert.match(about, /<img[^>]+src="\/images\/avatar\.jpg"/);
assert.match(search, /<h1 class="page-title">搜索<\/h1>/);
assert.match(rss, /<rss[\s>]/);
assert.match(notFound, /<title>404 — Justice<\/title>/);

const homeIslands = home.match(/<astro-island\b/g) ?? [];
assert.equal(homeIslands.length, 0, "the editorial homepage should ship without hydrated islands");
const articlesIslands = articles.match(/<astro-island\b/g) ?? [];
assert.equal(articlesIslands.length, 0, "the article archive should ship without hydrated islands");
const searchIslands = search.match(/<astro-island\b/g) ?? [];
assert.equal(searchIslands.length, 1, "the search page should hydrate only the interactive search UI");

assert.ok(Array.isArray(searchEntries) && searchEntries.length > 0, "search.json should contain published posts");
assert.ok(searchEntries.every((entry) => entry.draft === false), "search.json must not expose drafts");
assert.equal(new Set(searchEntries.map((entry) => entry.url)).size, searchEntries.length, "search URLs must be unique");

console.log("Build smoke test passed: home, article index, category, post, search, RSS, and 404 outputs are valid.");
