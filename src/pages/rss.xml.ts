import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { POST_STAGE_META, SITE, postPath, withBase } from "../site.config";
import { getAllPosts } from "../lib/posts";

export async function GET(context: APIContext) {
  const posts = await getAllPosts();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: new URL(withBase("/"), context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: `[${POST_STAGE_META[post.data.stage].label}] ${post.data.description || ""}`,
      link: postPath(post.data.category, post.id),
    })),
  });
}
