import { buildSearchIndex, getAllPosts } from "../lib/posts";

export async function GET() {
  const posts = await getAllPosts();
  const entries = await buildSearchIndex(posts);

  return new Response(
    JSON.stringify(entries),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    },
  );
}
