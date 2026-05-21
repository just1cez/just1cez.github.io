import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = (await Promise.all([
    ...await getCollection("tech"),
    ...await getCollection("life"),
  ]))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "Justice's Blog",
    description: "A personal blog for tech & life.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || "",
      link: `/${post.data.category}/${post.id}`,
    })),
  });
}