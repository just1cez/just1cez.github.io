import { describe, expect, it } from "vitest";
import { rankRelatedPosts, relatedPostScore, shouldIncludeDraft } from "./post-logic";
import type { RelatedPostLike } from "./post-logic";

function post(
  id: string,
  category: string,
  tags: string[],
  date: string,
  series?: string,
): RelatedPostLike {
  return { id, data: { category, tags, series, date: new Date(`${date}T00:00:00Z`) } };
}

describe("draft filtering", () => {
  it("always includes published posts and includes drafts only in development", () => {
    expect(shouldIncludeDraft({ draft: false }, false)).toBe(true);
    expect(shouldIncludeDraft({}, false)).toBe(true);
    expect(shouldIncludeDraft({ draft: true }, false)).toBe(false);
    expect(shouldIncludeDraft({ draft: true }, true)).toBe(true);
  });
});

describe("related post ranking", () => {
  const current = post("current", "tech", ["AI", "C++"], "2026-05-20", "course");

  it("weights shared tags above series and category matches", () => {
    expect(relatedPostScore(current, post("candidate", "tech", ["AI"], "2026-05-19", "course"))).toBe(6);
  });

  it("excludes the current post, drops unrelated posts, orders by score, and respects the limit", () => {
    const candidates = [
      current,
      post("same-series", "tech", ["AI"], "2026-05-18", "course"),
      post("two-tags", "tech", ["AI", "C++"], "2026-05-17"),
      post("same-category", "tech", [], "2026-05-21"),
      post("unrelated", "life", [], "2026-05-22"),
    ];

    expect(rankRelatedPosts(current, candidates, 2).map(({ id }) => id)).toEqual(["two-tags", "same-series"]);
  });

  it("uses recency to break equal scores", () => {
    const older = post("older", "life", ["AI"], "2026-05-18");
    const newer = post("newer", "life", ["AI"], "2026-05-19");
    expect(rankRelatedPosts(current, [older, newer]).map(({ id }) => id)).toEqual(["newer", "older"]);
  });
});
