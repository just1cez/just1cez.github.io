import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const templates = {
  tech: "tech-post.md",
  algorithm: "algorithm-post.md",
  paper: "paper-reading.md",
  life: "life-post.md",
};

const [, , kind = "tech", slug] = process.argv;

if (!templates[kind]) {
  console.error(`Unknown post type "${kind}". Use one of: ${Object.keys(templates).join(", ")}`);
  process.exit(1);
}

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Usage: npm run new:post -- <tech|algorithm|paper|life> my-post-slug");
  console.error("Slug should use lowercase letters, numbers, and hyphens.");
  process.exit(1);
}

const category = kind === "life" ? "life" : "tech";
const ext = path.extname(templates[kind]);
const targetDir = path.join(process.cwd(), "src", "content", category);
const target = path.join(targetDir, `${slug}${ext}`);
const imageDir = path.join(process.cwd(), "public", "images", "posts", slug);
const template = path.join(process.cwd(), "templates", templates[kind]);

if (existsSync(target)) {
  console.error(`Post already exists: ${target}`);
  process.exit(1);
}

await mkdir(targetDir, { recursive: true });
await mkdir(imageDir, { recursive: true });
const today = new Date().toISOString().slice(0, 10);
const content = (await readFile(template, "utf8"))
  .replaceAll("YYYY-MM-DD", today)
  .replace("title: \"文章标题\"", `title: \"${slug.replace(/-/g, " ")}\"`);

await writeFile(target, content);

console.log(`Created ${path.relative(process.cwd(), target)}`);
console.log(`Created ${path.relative(process.cwd(), imageDir)}/`);
