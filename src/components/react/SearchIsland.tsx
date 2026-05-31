import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search as SearchIcon, FileWarning, Tag } from "lucide-react";

interface IndexedPost {
  title: string;
  url: string;
  date: string;
  category: string;
  description?: string;
  body?: string;
  series?: string;
  stage?: string;
  stageLabel?: string;
  tags?: string[];
  draft?: boolean;
}

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: prefersReduced ? 0 : 0.06 } } };
const item = prefersReduced
  ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
  : { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } } };

export default function SearchIsland({ indexUrl }: { indexUrl: string }) {
  const [posts, setPosts] = useState<IndexedPost[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | "tech" | "life">("All");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(indexUrl)
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, [indexUrl]);

  const focusTags = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) => (p.tags || []).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t]) => t);
  }, [posts]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return posts.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      return [p.title, p.description, p.body, ...(p.tags || [])]
        .filter(Boolean).join(" ").toLowerCase().includes(q);
    });
  }, [posts, query, category]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item} className="space-y-2">
        <span className="block font-mono text-xs uppercase tracking-widest text-accentWarm">Retriever / 检索</span>
        <h1 className="font-serif text-2xl font-bold text-fg sm:text-3.5xl">全站文章检索</h1>
        <p className="font-serif text-xs italic text-fgMuted">输入关键词，匹配标题、标签与正文内容，结果实时刷新。</p>
      </motion.div>

      <motion.div variants={item} className="space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-fgMuted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入检索词，例如 算法、AI、装机 ..."
            className="w-full rounded-md border border-border bg-bgSoft/20 py-3 pl-11 pr-4 font-serif text-sm text-fg outline-none transition-colors placeholder:text-fgMuted/65 focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex w-fit items-center gap-1.5 rounded border border-border/80 bg-bgSoft/20 p-1">
            {(["All", "tech", "life"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded px-3 py-1.5 transition-all ${category === c ? "border border-border bg-bgSoft font-medium text-accent shadow-sm" : "text-fgMuted hover:text-fg"}`}
              >
                {c === "All" ? "全部" : c === "tech" ? "Tech 技术" : "Life 生活"}
              </button>
            ))}
          </div>
          {query && (
            <button onClick={() => setQuery("")} className="font-mono text-[11px] text-accent underline">清空 [x]</button>
          )}
        </div>

        {focusTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <Tag className="mr-1 h-3.5 w-3.5 shrink-0 text-fgMuted" />
            {focusTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className={`rounded border px-2.5 py-0.5 text-[11px] transition-all ${query === tag ? "border-accent/40 bg-accent/15 font-semibold text-accent" : "border-border bg-bg text-fgMuted hover:border-accent hover:text-accent"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <motion.section variants={item} className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-2 font-mono text-xs text-fgMuted">
          <span className="uppercase tracking-wider">Match / 命中</span>
          <span>{loaded ? `找到 ${results.length} 篇` : "加载中..."}</span>
        </div>

        {results.length > 0 ? (
          <div className="space-y-2">
            {results.map((p) => (
              <a key={p.url} href={p.url} className="group flex items-start justify-between gap-4 rounded-md border border-border/70 bg-bgSoft/40 p-4 transition-all hover:border-accent dark:bg-bgSoft/20">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-fgMuted">
                    <span>{new Date(p.date).toLocaleDateString("zh-CN")}</span>
                    {p.stageLabel && <span className="rounded border border-border bg-bgSoft px-1.5 py-0.5">{p.stageLabel}</span>}
                    <span className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">{p.category}</span>
                  </div>
                  <h3 className="line-clamp-2 font-serif text-sm font-bold text-fg transition-colors group-hover:text-accent">{p.title}</h3>
                  {p.description && <p className="line-clamp-2 text-xs leading-relaxed text-fgMuted">{p.description}</p>}
                </div>
              </a>
            ))}
          </div>
        ) : loaded ? (
          <div className="space-y-3 rounded-lg border border-dotted border-border p-12 text-center">
            <FileWarning className="mx-auto h-8 w-8 animate-bounce-slow text-fgMuted/80" />
            <p className="font-serif text-sm font-bold text-fg">没有匹配的文章</p>
            <p className="mx-auto max-w-md font-serif text-xs leading-relaxed text-fgMuted">换个关键词试试，或许这个领域我还没来得及写。</p>
          </div>
        ) : null}
      </motion.section>
    </motion.div>
  );
}
