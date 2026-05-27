import { getCollection } from "astro:content";
import type { BlogCategory, PostStage } from "../site.config";

export type BlogPost = Awaited<ReturnType<typeof getAllPosts>>[number];
export type PostSummary = {
  title: string;
  date: Date;
  updated?: Date;
  category: BlogCategory;
  slug: string;
  description?: string;
  tags: string[];
  series?: string;
  stage: PostStage;
  draft: boolean;
};

const includeDrafts = import.meta.env.DEV;

export async function getAllPosts() {
  const [techPosts, lifePosts] = await Promise.all([
    getCollection("tech", ({ data }) => includeDrafts || !data.draft),
    getCollection("life", ({ data }) => includeDrafts || !data.draft),
  ]);

  return [...techPosts, ...lifePosts].sort(sortByDateDesc);
}

export async function getPostsByCategory(category: BlogCategory) {
  const posts = await getCollection(category, ({ data }) => includeDrafts || !data.draft);
  return posts.sort(sortByDateDesc);
}

export function sortByDateDesc(a: { data: { date: Date } }, b: { data: { date: Date } }) {
  return b.data.date.valueOf() - a.data.date.valueOf();
}

export function getAllTags(posts: BlogPost[]) {
  const countByTag = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      countByTag.set(tag, (countByTag.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(countByTag, ([tag, count]) => ({ tag, count })).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.tag.localeCompare(b.tag, "zh-CN");
  });
}

export function toPostSummary(post: BlogPost): PostSummary {
  return {
    title: post.data.title,
    date: post.data.date,
    updated: post.data.updated,
    category: post.data.category,
    slug: post.id,
    description: post.data.description,
    tags: post.data.tags,
    series: post.data.series,
    stage: post.data.stage,
    draft: post.data.draft,
  };
}

export function getFeaturedPosts(posts: BlogPost[], limit = 5) {
  const featured = posts.filter((post) => post.data.featured);
  return (featured.length ? featured : posts).slice(0, limit);
}

export function getRelatedPosts(current: BlogPost, posts: BlogPost[], limit = 3) {
  return posts
    .filter((post) => post.id !== current.id || post.data.category !== current.data.category)
    .map((post) => {
      const sharedTags = post.data.tags.filter((tag) => current.data.tags.includes(tag)).length;
      const sameCategory = post.data.category === current.data.category ? 1 : 0;
      const sameSeries = current.data.series && post.data.series === current.data.series ? 2 : 0;

      return {
        post,
        score: sharedTags * 3 + sameSeries + sameCategory,
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.post.data.date.valueOf() - a.post.data.date.valueOf();
    })
    .slice(0, limit)
    .map(({ post }) => toPostSummary(post));
}

export function getFocusTags(posts: BlogPost[], preferred: string[], limit = 10) {
  const tags = getAllTags(posts);
  const byName = new Map(tags.map((item) => [item.tag, item]));
  const picked = preferred
    .map((tag) => byName.get(tag) ?? { tag, count: 0 })
    .filter((item, index, arr) => arr.findIndex((other) => other.tag === item.tag) === index);
  const rest = tags.filter((item) => !picked.some((pickedItem) => pickedItem.tag === item.tag));

  return [...picked, ...rest].slice(0, limit);
}

export function stripMarkdown(markdown: string) {
  return markdown
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^import\s+.+?;$/gm, " ")
    .replace(/<\/?[A-Z][\w.]*(?:\s[^>]*)?>/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[{}()[\],;]+/g, " ")
    .replace(/[#>*_\-~|$]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getExcerpt(markdown: string, maxLength = 220) {
  const text = stripMarkdown(markdown);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}
