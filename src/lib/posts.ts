import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { CATEGORY_META, POST_STAGE_META, postPath, tagSlug } from "../site.config";
import type { BlogCategory, PostStage } from "../site.config";

export type PostEntry = CollectionEntry<"tech"> | CollectionEntry<"life">;
export type BlogPost = PostEntry;
export type PostSummary = {
  title: string;
  href: string;
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
export type PostCardItem = {
  title: string;
  href: string;
  date: string;
  category: BlogCategory;
  categoryLabel: string;
  stageLabel: string;
  series?: string;
  featured?: boolean;
  tags: string[];
  description?: string;
};
export type SearchIndexEntry = {
  title: string;
  description: string;
  body: string;
  category: BlogCategory;
  tags: string[];
  series: string;
  stage: PostStage;
  stageLabel: string;
  draft: boolean;
  date: string;
  updated: string;
  url: string;
};
export type TagGroup = {
  tag: string;
  slug: string;
  count: number;
  posts: PostSummary[];
};
export type SeriesGroup = {
  name: string;
  count: number;
  latestDate: Date;
  posts: PostSummary[];
};
export type SingletonSeries = {
  name: string;
  post: PostSummary;
};

const includeDrafts = import.meta.env.DEV;

export async function getAllPosts(): Promise<PostEntry[]> {
  const [techPosts, lifePosts] = await Promise.all([
    getCollection("tech", ({ data }) => includeDrafts || !data.draft),
    getCollection("life", ({ data }) => includeDrafts || !data.draft),
  ]);

  return [...techPosts, ...lifePosts].sort(sortByDateDesc);
}

export async function getPostsByCategory(category: BlogCategory): Promise<PostEntry[]> {
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
    href: postPath(post.data.category, post.id),
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

export function toPostCardItem(post: BlogPost): PostCardItem {
  return {
    title: post.data.title,
    href: postPath(post.data.category, post.id),
    date: post.data.date.toLocaleDateString("zh-CN"),
    category: post.data.category,
    categoryLabel: CATEGORY_META[post.data.category].label,
    stageLabel: POST_STAGE_META[post.data.stage].label,
    series: post.data.series,
    featured: post.data.featured,
    tags: post.data.tags ?? [],
    description: post.data.description,
  };
}

export async function toSearchIndexEntry(post: BlogPost): Promise<SearchIndexEntry> {
  const body = getExcerpt(post.body ?? "", 700);

  return {
    title: post.data.title,
    description: post.data.description ?? "",
    body,
    category: post.data.category,
    tags: post.data.tags,
    series: post.data.series ?? "",
    stage: post.data.stage,
    stageLabel: POST_STAGE_META[post.data.stage].label,
    draft: post.data.draft,
    date: post.data.date.toISOString(),
    updated: post.data.updated?.toISOString() ?? "",
    url: postPath(post.data.category, post.id),
  };
}

export async function buildSearchIndex(posts: BlogPost[]) {
  return Promise.all(posts.map(toSearchIndexEntry));
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

export function getTagGroups(posts: BlogPost[]): TagGroup[] {
  const groups = new Map<string, PostSummary[]>();

  for (const post of posts) {
    const summary = toPostSummary(post);
    for (const tag of post.data.tags) {
      if (!groups.has(tag)) groups.set(tag, []);
      groups.get(tag)!.push(summary);
    }
  }

  return Array.from(groups.entries())
    .map(([tag, items]) => ({
      tag,
      slug: tagSlug(tag),
      count: items.length,
      posts: items.sort((a, b) => b.date.valueOf() - a.date.valueOf()),
    }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.tag.localeCompare(b.tag, "zh-CN");
    });
}

export function getCategoryCounts(posts: BlogPost[]) {
  return posts.reduce((counts, post) => {
    counts[post.data.category] = (counts[post.data.category] ?? 0) + 1;
    return counts;
  }, {} as Record<BlogCategory, number>);
}

export function getSeriesGroups(posts: BlogPost[]) {
  const groups = new Map<string, PostSummary[]>();

  for (const post of posts) {
    const key = post.data.series;
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(toPostSummary(post));
  }

  const sorted = Array.from(groups.entries())
    .map(([name, items]) => {
      const sortedPosts = items.sort((a, b) => b.date.valueOf() - a.date.valueOf());
      return {
        name,
        count: sortedPosts.length,
        latestDate: sortedPosts[0].date,
        posts: sortedPosts,
      };
    })
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.latestDate.valueOf() - a.latestDate.valueOf();
    });

  return {
    groupedSeries: sorted.filter((group) => group.count >= 2),
    singletonSeries: sorted
      .filter((group) => group.count === 1)
      .map((group) => ({ name: group.name, post: group.posts[0] }))
      .sort((a, b) => b.post.date.valueOf() - a.post.date.valueOf()),
  };
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
