import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const dist = path.join(process.cwd(), "dist");

async function read(relativePath) {
  return readFile(path.join(dist, relativePath), "utf8");
}

const [home, tech, life, article, search, searchJson, rss, notFound] = await Promise.all([
  read("index.html"),
  read("tech/index.html"),
  read("life/index.html"),
  read("tech/start-here/index.html"),
  read("search/index.html"),
  read("search.json"),
  read("rss.xml"),
  read("404.html"),
]);

assert.match(home, /<meta property="og:type" content="website">/);
assert.match(home, /aria-label="主导航"/);
assert.match(tech, /<title>Tech - Justice&#39;s Blog<\/title>/);
assert.match(life, /<title>Life - Justice&#39;s Blog<\/title>/);
assert.match(article, /<meta property="og:type" content="article">/);
assert.match(article, /"@type":"BlogPosting"/);
assert.match(search, /全站文章检索/);
assert.match(rss, /<rss[\s>]/);
assert.match(notFound, /<title>404 - Justice&#39;s Blog<\/title>/);

const homeIslands = home.match(/<astro-island\b/g) ?? [];
assert.equal(homeIslands.length, 1, "the homepage should hydrate only the interactive Hero");
const searchIslands = search.match(/<astro-island\b/g) ?? [];
assert.equal(searchIslands.length, 1, "the search page should hydrate only the interactive search UI");

const searchEntries = JSON.parse(searchJson);
assert.ok(Array.isArray(searchEntries) && searchEntries.length > 0, "search.json should contain published posts");
assert.ok(searchEntries.every((entry) => entry.draft === false), "search.json must not expose drafts");
assert.equal(new Set(searchEntries.map((entry) => entry.url)).size, searchEntries.length, "search URLs must be unique");

console.log("Build smoke test passed: home, category, article, search, RSS, and 404 outputs are valid.");
