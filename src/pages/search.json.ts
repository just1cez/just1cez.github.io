import { POST_STAGE_META, postPath } from "../site.config";
import { getAllPosts, getExcerpt } from "../lib/posts";

export async function GET() {
  const posts = await getAllPosts();
  const entries = await Promise.all(
    posts.map(async (post) => {
      const markdown = await post.body;
      const body = getExcerpt(markdown, 700);

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
    }),
  );

  return new Response(
    JSON.stringify(entries),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    },
  );
}
