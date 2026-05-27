import { getCollection } from "astro:content";
import type { BlogCategory } from "../site.config";

export type BlogPost = Awaited<ReturnType<typeof getAllPosts>>[number];

export async function getAllPosts() {
  const [techPosts, lifePosts] = await Promise.all([
    getCollection("tech", ({ data }) => !data.draft),
    getCollection("life", ({ data }) => !data.draft),
  ]);

  return [...techPosts, ...lifePosts].sort(sortByDateDesc);
}

export async function getPostsByCategory(category: BlogCategory) {
  const posts = await getCollection(category, ({ data }) => !data.draft);
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
