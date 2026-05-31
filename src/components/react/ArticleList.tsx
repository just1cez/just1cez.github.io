import React from "react";
import { motion } from "motion/react";
import { ArticleCardR, type PostItem } from "./ArticleCardR";

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: prefersReduced ? 0 : 0.08 } },
};

const item = prefersReduced
  ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
  : {
      hidden: { opacity: 0, y: 14 },
      show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
    };

interface Props {
  posts: PostItem[];
  layout?: "stack" | "grid";
}

export default function ArticleList({ posts, layout = "stack" }: Props) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={layout === "grid" ? "grid grid-cols-1 gap-6 md:grid-cols-2" : "space-y-2"}
    >
      {posts.map((post) => (
        <motion.div key={post.href} variants={item}>
          <ArticleCardR post={post} />
        </motion.div>
      ))}
    </motion.div>
  );
}
