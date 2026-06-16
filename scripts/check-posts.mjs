import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const contentRoot = path.join(root, "src", "content");
const publicRoot = path.join(root, "public");
const postExts = new Set([".md"]);
const requiredFields = ["title", "date", "tags", "category", "description", "stage"];
const allowedCategories = new Set(["tech", "life"]);
const allowedStages = new Set(["study", "paper", "done", "evergreen", "pitfall", "snippet"]);
const externalTarget = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;
const ignoredSchemes = /^(?:mailto:|tel:|javascript:)/i;

const errors = [];
const warnings = [];

function report(list, file, message) {
  list.push(`${path.relative(root, file)}: ${message}`);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else if (postExts.has(path.extname(entry.name))) files.push(target);
  }

  return files;
}

function parseFrontmatter(file, source) {
  const opening = source.match(/^---\r?\n/);
  if (!opening) {
    report(errors, file, "missing frontmatter block");
    return { data: {}, body: source };
  }

  const rest = source.slice(opening[0].length);
  const closing = rest.match(/\r?\n---(?:\r?\n|$)/);
  if (!closing || closing.index === undefined) {
    report(errors, file, "frontmatter block is not closed");
    return { data: {}, body: source };
  }

  const raw = rest.slice(0, closing.index);
  const body = rest.slice(closing.index + closing[0].length);
  const data = {};

  raw.split(/\r?\n/).forEach((line, index) => {
    if (!line.trim() || line.trimStart().startsWith("#")) return;

    const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!match) {
      report(warnings, file, `frontmatter line ${index + 1} was skipped: ${line.trim()}`);
      return;
    }

    data[match[1]] = parseValue(match[2].trim());
  });

  return { data, body };
}

function parseValue(value) {
  if (value === "true") return true;
  if (value === "false") return false;

  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((item) => parseValue(item.trim()));
  }

  return value;
}

function isValidDate(value) {
  if (typeof value !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function stripCodeBlocks(source) {
  return source.replace(/```[\s\S]*?```/g, "").replace(/~~~[\s\S]*?~~~/g, "");
}

function extractTargets(source) {
  const targets = [];
  const body = stripCodeBlocks(source);
  const markdownLink = /!?\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;

  for (const match of body.matchAll(markdownLink)) targets.push(match[1]);

  return targets;
}

function targetPath(file, target) {
  const cleanTarget = target.split(/[?#]/)[0];
  if (!cleanTarget || externalTarget.test(cleanTarget) || ignoredSchemes.test(cleanTarget)) return null;

  const decoded = decodeURIComponent(cleanTarget);
  if (decoded.startsWith("/")) return path.join(publicRoot, decoded);
  return path.resolve(path.dirname(file), decoded);
}

function checkFrontmatter(file, data) {
  for (const field of requiredFields) {
    if (!(field in data)) report(errors, file, `missing required frontmatter field "${field}"`);
  }

  if (typeof data.title !== "string" || !data.title.trim()) {
    report(errors, file, "title must be a non-empty string");
  }

  if (!isValidDate(data.date)) {
    report(errors, file, "date must use YYYY-MM-DD");
  }

  if ("updated" in data && !isValidDate(data.updated)) {
    report(errors, file, "updated must use YYYY-MM-DD");
  }

  if (isValidDate(data.date) && isValidDate(data.updated) && data.updated < data.date) {
    report(errors, file, "updated cannot be earlier than date");
  }

  if (!Array.isArray(data.tags) || data.tags.length === 0 || data.tags.some((tag) => typeof tag !== "string" || !tag.trim())) {
    report(errors, file, "tags must be a non-empty string array");
  }

  const folderCategory = path.relative(contentRoot, path.dirname(file)).split(path.sep)[0];
  if (!allowedCategories.has(data.category)) {
    report(errors, file, 'category must be "tech" or "life"');
  } else if (data.category !== folderCategory) {
    report(errors, file, `category "${data.category}" does not match folder "${folderCategory}"`);
  }

  if (typeof data.description !== "string" || data.description.trim().length < 10) {
    report(errors, file, "description must be at least 10 characters");
  }

  if (typeof data.description === "string" && data.description.trim().length > 120) {
    report(warnings, file, "description is longer than 120 characters; keep summaries concise for cards and RSS");
  }

  if (!allowedStages.has(data.stage)) {
    report(errors, file, `stage must be one of: ${Array.from(allowedStages).join(", ")}`);
  }

  for (const field of ["draft", "featured"]) {
    if (field in data && typeof data[field] !== "boolean") {
      report(errors, file, `${field} must be true or false`);
    }
  }

  if (!("series" in data)) {
    report(warnings, file, "series is missing; add it when the post belongs to a long-running topic");
  }
}

function checkLocalTargets(file, body) {
  for (const target of extractTargets(body)) {
    const resolved = targetPath(file, target);
    if (resolved && !existsSync(resolved)) {
      report(errors, file, `local target does not exist: ${target}`);
    }
  }
}

const files = (await walk(contentRoot)).sort();

for (const file of files) {
  const source = await readFile(file, "utf8");
  const { data, body } = parseFrontmatter(file, source);

  checkFrontmatter(file, data);
  checkLocalTargets(file, body);
}

if (warnings.length) {
  console.warn(`\nWarnings (${warnings.length})`);
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

if (errors.length) {
  console.error(`\nErrors (${errors.length})`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Checked ${files.length} posts. No blocking issues found.`);
