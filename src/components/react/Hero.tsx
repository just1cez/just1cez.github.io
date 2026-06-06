import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { SITE } from "../../site.config";

const LINES = [
  "正在打基础，也在探索 AI 和工程。",
  "算法、课程笔记、论文初读与硬件折腾。",
  "这是我此刻的理解，它可能是错的。",
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
      className="glass relative overflow-hidden rounded-2xl p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accentWarm/10 blur-3xl" />

      <div className="relative space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-accent">
          <svg className="h-3 w-3 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5L7 19M19 17L5 7" /></svg>
          {SITE.author} · {SITE.subtitle}
        </span>

        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-fg sm:text-3.5xl">
            欢迎来到我的博客
          </h1>
          <p className="mt-1 font-mono text-sm uppercase tracking-wide text-fgMuted">
            Welcome to my blog
          </p>
        </div>

        <div className="flex h-7 items-center font-mono text-sm text-accent">
          <span>{text}</span>
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-accent" />
        </div>
      </div>
    </motion.section>
  );
}
