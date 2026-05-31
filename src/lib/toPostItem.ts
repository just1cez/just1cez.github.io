import type { CollectionEntry } from "astro:content";
import { CATEGORY_META, POST_STAGE_META, postPath } from "../site.config";
import type { PostItem } from "../components/react/ArticleCardR";

export function toPostItem(post: CollectionEntry<"blog">): PostItem {
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
