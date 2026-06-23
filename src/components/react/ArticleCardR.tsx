import React from "react";
import { ChevronRight, Calendar, Bookmark, Heart } from "lucide-react";

export interface PostItem {
  title: string;
  href: string;
  date: string;
  category: "tech" | "life";
  categoryLabel: string;
  stageLabel: string;
  series?: string;
  featured?: boolean;
  tags: string[];
  description?: string;
}

export function ArticleCardR({ post }: { post: PostItem }) {
  const isTech = post.category === "tech";

  return (
    <a
      href={post.href}
      className="group relative flex items-start justify-between gap-4 overflow-hidden rounded-md border border-border/70 bg-bgSoft/40 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/70 hover:shadow-[0_14px_36px_rgba(45,35,80,0.08)] dark:bg-bgSoft/20"
    >
      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent">
            {post.stageLabel}
          </span>
          {post.series && (
            <span className="rounded-sm border border-border bg-bgSoft px-2 py-0.5 font-mono text-[11px] text-fgMuted">
              {post.series}
            </span>
          )}
          {post.featured && (
            <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent">
              Selected ✧
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 font-serif text-base font-bold leading-snug tracking-tight text-fg transition-colors duration-200 group-hover:text-accent">
          {post.title}
        </h3>

        {post.description && (
          <p className="line-clamp-2 text-[13px] leading-relaxed text-fgMuted">{post.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-[12px] text-fgMuted">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 opacity-60" />
            {post.date}
          </span>
          <span className="select-none opacity-40">•</span>
          <span className="flex items-center gap-1">
            {isTech ? (
              <Bookmark className="h-3 w-3 text-accentWarm opacity-80" />
            ) : (
              <Heart className="h-3 w-3 text-accent opacity-80" />
            )}
            <span className="font-semibold">{post.categoryLabel}</span>
          </span>
          {post.tags.length > 0 && <span className="select-none opacity-40">•</span>}
          <span className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <span key={tag} className="opacity-80">#{tag}</span>
            ))}
          </span>
        </div>
      </div>

      <ChevronRight className="h-5 w-5 flex-none self-center text-border transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent" />
    </a>
  );
}
