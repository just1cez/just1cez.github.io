import { describe, expect, it } from "vitest";
import { normalizePath, registerTagSlug, tagSlug, withBasePath, withoutBasePath } from "./url";

describe("URL helpers", () => {
  it("adds and removes a project base path without changing external URLs", () => {
    expect(withBasePath("/tech/post", "/blog/")).toBe("/blog/tech/post");
    expect(withBasePath("/", "/blog/")).toBe("/blog/");
    expect(withBasePath("https://example.com/post", "/blog/")).toBe("https://example.com/post");
    expect(withBasePath("#section", "/blog/")).toBe("#section");
    expect(withoutBasePath("/blog/tech/post/", "/blog/")).toBe("/tech/post");
    expect(withoutBasePath("/blog", "/blog/")).toBe("/");
  });

  it("normalizes only trailing slashes on non-root paths", () => {
    expect(normalizePath("/")).toBe("/");
    expect(normalizePath("/tech/")).toBe("/tech");
    expect(normalizePath("/tech/post")).toBe("/tech/post");
  });

  it("creates stable tag slugs for punctuation, spaces, and Unicode", () => {
    expect(tagSlug("C++")).toBe("C-plus-plus");
    expect(tagSlug("AI & ML")).toBe("AI-and-ML");
    expect(tagSlug("  图像  去噪  ")).toBe("图像-去噪");
    expect(tagSlug("???")).toBe("tag");
    expect(tagSlug("C++")).toBe(tagSlug("C plus plus"));
  });

  it("reports distinct tags that resolve to the same route", () => {
    const owners = new Map();
    expect(registerTagSlug(owners, "C++", "first.md")).toBeNull();
    expect(registerTagSlug(owners, "C plus plus", "second.md")).toEqual({
      slug: "C-plus-plus",
      owner: { tag: "C++", source: "first.md" },
    });
  });
});
