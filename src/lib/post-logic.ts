export type RelatedPostLike = {
  id: string;
  data: {
    category: string;
    date: Date;
    tags: string[];
    series?: string;
  };
};

export function shouldIncludeDraft(data: { draft?: boolean }, includeDrafts: boolean) {
  return includeDrafts || !data.draft;
}

export function relatedPostScore(current: RelatedPostLike, candidate: RelatedPostLike) {
  const sharedTags = candidate.data.tags.filter((tag) => current.data.tags.includes(tag)).length;
  const sameCategory = candidate.data.category === current.data.category ? 1 : 0;
  const sameSeries = current.data.series && candidate.data.series === current.data.series ? 2 : 0;

  return sharedTags * 3 + sameSeries + sameCategory;
}

export function rankRelatedPosts<T extends RelatedPostLike>(current: T, posts: T[], limit = 3) {
  return posts
    .filter((post) => post.id !== current.id || post.data.category !== current.data.category)
    .map((post) => ({ post, score: relatedPostScore(current, post) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.post.data.date.valueOf() - a.post.data.date.valueOf();
    })
    .slice(0, limit)
    .map(({ post }) => post);
}
