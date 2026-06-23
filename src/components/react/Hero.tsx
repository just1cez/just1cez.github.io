import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowDown, BookOpen, ExternalLink, Sparkles } from "lucide-react";
import { SITE, withBase } from "../../site.config";

const LINES = [
  "算法、AI 入门和工程练习，都先认真写下来。",
  "Personal Command Deck 是我正在打磨的本地桌面项目。",
  "这里保留学习现场，也保留一点冰晶味的个人审美。",
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState(LINES[0]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPrefersReduced(reduced);
    setMounted(true);
    if (!reduced) setText("");
  }, []);

  useEffect(() => {
    if (!mounted || prefersReduced) return;
    const full = LINES[lineIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && text === full) {
      timer = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && text === "") {
      setDeleting(false);
      setLineIndex((i) => (i + 1) % LINES.length);
    } else {
      timer = setTimeout(
        () => setText(full.substring(0, text.length + (deleting ? -1 : 1))),
        deleting ? 45 : 110
      );
    }
    return () => clearTimeout(timer);
  }, [text, deleting, lineIndex]);

  return (
    <motion.section
      initial={mounted ? { opacity: 0, y: 16 } : false}
      animate={mounted ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="hero-panel glass relative w-full min-w-0 max-w-full overflow-hidden rounded-lg p-5 sm:p-8"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-accent-warm),var(--color-accent),transparent)]" />

      <div className="relative grid min-w-0 gap-7 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
        <div className="min-w-0 space-y-5">
          <span className="inline-flex max-w-full flex-wrap items-center gap-1.5 rounded border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-accent sm:tracking-widest">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span className="min-w-0 break-words">{SITE.author} · {SITE.subtitle}</span>
          </span>

          <div className="space-y-3">
            <h1 className="max-w-2xl font-serif text-3xl font-bold leading-tight tracking-tight text-fg sm:text-4xl">
              Justice's Blog
            </h1>
            <p className="max-w-2xl break-words text-sm leading-7 text-fgMuted sm:text-[15px]">
              一个带一点知识花园气质的个人博客：记录算法入门、AI 探索、课程笔记、硬件折腾，以及我自己做的小项目。
            </p>
          </div>

          <div className="flex min-h-7 max-w-full flex-wrap items-center font-mono text-sm leading-7 text-accent">
            <span className="min-w-0 break-words">{text}</span>
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-accent" />
          </div>

          <div className="flex max-w-full flex-wrap gap-2 pt-1">
            <a
              href="#signature-project"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 font-serif text-sm font-bold text-bg transition-all hover:-translate-y-0.5 hover:bg-fg"
            >
              看项目展示
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href={withBase("/tech")}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-bg/60 px-4 py-2 font-serif text-sm font-bold text-fg transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <BookOpen className="h-4 w-4" />
              读技术笔记
            </a>
          </div>
        </div>

        <div className="hidden min-w-0 border-l border-border/60 pl-6 lg:block">
          <div className="space-y-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-fgMuted">Now building</p>
              <a href="https://github.com/just1cez/personal-command-deck" className="mt-1 inline-flex items-center gap-2 font-serif text-base font-bold text-fg transition-colors hover:text-accent">
                Personal Command Deck
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {["聚焦", "推进", "复盘"].map((item) => (
                <span key={item} className="rounded border border-border bg-bgSoft/65 px-2 py-1.5 font-serif text-xs font-bold text-fg">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
