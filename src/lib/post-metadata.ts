export type ArchiveYearGroup<T> = {
  year: number;
  posts: T[];
};

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

export function estimateReadingMinutes(markdown: string) {
  const text = stripMarkdown(markdown);
  const hanCount = text.match(/\p{Script=Han}/gu)?.length ?? 0;
  const nonHanText = text.replace(/\p{Script=Han}/gu, " ");
  const wordCount = nonHanText.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  return Math.max(1, Math.ceil(hanCount / 300 + wordCount / 200));
}

export function groupByUtcYear<T>(items: T[], getDate: (item: T) => Date): ArchiveYearGroup<T>[] {
  const groups = new Map<number, T[]>();

  for (const item of items) {
    const year = getDate(item).getUTCFullYear();
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(item);
  }

  return Array.from(groups.entries())
    .sort(([yearA], [yearB]) => yearB - yearA)
    .map(([year, posts]) => ({
      year,
      posts: [...posts].sort((a, b) => getDate(b).valueOf() - getDate(a).valueOf()),
    }));
}
