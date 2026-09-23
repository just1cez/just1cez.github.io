import React, { useEffect, useMemo, useState } from "react";
import type { SearchIndexEntry } from "../../lib/posts";

type SearchCategory = "All" | "tech" | "life";

function readQueryFromLocation() {
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

function readCategoryFromLocation(): SearchCategory {
  const value = new URLSearchParams(window.location.search).get("category");
  return value === "tech" || value === "life" ? value : "All";
}

export default function SearchIsland({ indexUrl }: { indexUrl: string }) {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<SearchIndexEntry[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SearchCategory>("All");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setQuery(readQueryFromLocation());
    setCategory(readCategoryFromLocation());
    setMounted(true);
  }, []);

  useEffect(() => {
    let ignore = false;
    setLoaded(false);
    setError(false);
    fetch(indexUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Search index failed: ${response.status}`);
        return response.json() as Promise<SearchIndexEntry[]>;
      })
      .then((data) => {
        if (!ignore) {
          setPosts(data);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError(true);
          setLoaded(true);
        }
      });
    return () => { ignore = true; };
  }, [indexUrl]);

  useEffect(() => {
    if (!mounted) return;
    const url = new URL(window.location.href);
    const cleanQuery = query.trim();
    if (cleanQuery) url.searchParams.set("q", cleanQuery);
    else url.searchParams.delete("q");
    if (category === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", category);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [category, mounted, query]);

  const results = useMemo(() => {
    const value = query.toLowerCase().trim();
    if (!value) return [];
    return posts.filter((post) => {
      if (category !== "All" && post.category !== category) return false;
      return [post.title, post.description, post.body, ...post.tags].join(" ").toLowerCase().includes(value);
    });
  }, [posts, query, category]);

  const hasQuery = query.trim().length > 0;

  return (
    <div>
      <header className="page-heading">
        <h1 className="page-title">搜索</h1>
      </header>

      <div className="space-y-4 py-6">
        <label htmlFor="site-search" className="sr-only">搜索文章</label>
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索文章……"
          className="w-full border border-border bg-bg px-4 py-3 text-base text-fg outline-none placeholder:text-muted focus:border-focus"
        />

        <div className="flex flex-wrap items-center gap-2 text-sm" role="group" aria-label="分类筛选">
          {(["All", "tech", "life"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
              className={`border-b px-1 py-1 ${category === value ? "border-link text-fg" : "border-transparent text-muted hover:text-fg"}`}
            >
              {value === "All" ? "全部" : value === "tech" ? "技术" : "生活"}
            </button>
          ))}
          {query && <button type="button" onClick={() => setQuery("")} className="ml-auto text-link">清空</button>}
        </div>

      </div>

      <section aria-live="polite">
        <div className="flex items-center justify-between border-b border-border pb-3 text-xs text-muted">
          <span>结果</span>
          <span>{error ? "索引加载失败" : loaded ? hasQuery ? `${results.length} 篇` : "等待搜索" : "加载中…"}</span>
        </div>

        {error ? (
          <p className="py-10 text-sm text-muted">搜索索引加载失败，请刷新页面重试。</p>
        ) : loaded && !hasQuery ? (
          <p className="py-10 text-sm text-muted">输入关键词开始搜索。</p>
        ) : results.length > 0 ? (
          <div className="divide-y divide-border">
            {results.map((post) => (
              <article key={post.url} className="py-5 sm:grid sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-6">
                <div className="mb-2 text-xs text-muted sm:mb-0 sm:pt-1">
                  <time>{new Date(post.date).toLocaleDateString("zh-CN")}</time>
                  <span className="ml-2 sm:ml-0 sm:mt-1 sm:block">{post.category === "tech" ? "Tech" : "Life"}</span>
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-fg"><a href={post.url} className="hover:text-link">{post.title}</a></h2>
                  {post.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{post.description}</p>}
                </div>
              </article>
            ))}
          </div>
        ) : loaded ? (
          <p className="py-10 text-sm text-muted">没有找到相关文章。</p>
        ) : null}
      </section>
    </div>
  );
}
