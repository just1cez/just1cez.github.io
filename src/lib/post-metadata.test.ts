import { describe, expect, it } from "vitest";
import { estimateReadingMinutes, groupByUtcYear } from "./post-metadata";

describe("reading time", () => {
  it("counts Chinese characters at 300 characters per minute", () => {
    expect(estimateReadingMinutes("中".repeat(301))).toBe(2);
  });

  it("counts English and numeric tokens at 200 words per minute", () => {
    const words = Array.from({ length: 201 }, (_, index) => `word${index}`).join(" ");
    expect(estimateReadingMinutes(words)).toBe(2);
  });

  it("combines Chinese and English reading time", () => {
    const words = Array.from({ length: 100 }, (_, index) => `word${index}`).join(" ");
    expect(estimateReadingMinutes(`${"中".repeat(150)} ${words}`)).toBe(1);
  });

  it("excludes fenced code blocks", () => {
    expect(estimateReadingMinutes(`正文\n\n\`\`\`text\n${"中".repeat(600)}\n\`\`\``)).toBe(1);
  });

  it("returns at least one minute for empty content", () => {
    expect(estimateReadingMinutes("")).toBe(1);
  });
});

describe("archive grouping", () => {
  it("groups by UTC year and sorts years and posts newest first", () => {
    const posts = [
      { id: "older", date: new Date("2025-03-01T00:00:00Z") },
      { id: "newest", date: new Date("2026-09-22T00:00:00Z") },
      { id: "newer", date: new Date("2026-05-19T00:00:00Z") },
      { id: "utc-boundary", date: new Date("2025-12-31T20:00:00-08:00") },
    ];

    const groups = groupByUtcYear(posts, (post) => post.date);

    expect(groups.map((group) => group.year)).toEqual([2026, 2025]);
    expect(groups[0].posts.map((post) => post.id)).toEqual(["newest", "newer", "utc-boundary"]);
    expect(groups[1].posts.map((post) => post.id)).toEqual(["older"]);
  });
});
