import { postPath } from "../site.config";
import { getAllPosts } from "../lib/posts";

export async function GET() {
  const posts = await getAllPosts();

  return new Response(
    JSON.stringify(
      posts.map((post) => ({
        title: post.data.title,
        description: post.data.description ?? "",
        category: post.data.category,
        tags: post.data.tags,
        date: post.data.date.toISOString(),
        url: postPath(post.data.category, post.id),
      })),
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    },
  );
}
