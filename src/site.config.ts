export const SITE = {
  title: "Justice's Blog",
  author: "Justice",
  description: "算法入门、AI 探索、大一课程与硬件折腾记录。",
  locale: "zh-CN",
  github: "https://github.com/just1cez",
  avatar: "/images/avatar.jpg",
  subtitle: "HITSZ CS · Personal Blog",
} as const;

export const QUOTE = {
  en: "We can only see a short distance ahead, but we can see plenty there that needs to be done.",
  zh: "我们只能看清眼前的一小段距离，但即便如此，仍有许多工作在等待着我们。",
  author: "Alan Turing",
} as const;

export const PROFILE_GROUPS = [
  { label: "正在学习", items: ["算法入门", "AI 入门探索", "大一课程"] },
  { label: "平时爱好", items: ["游戏", "PC 硬件", "装机折腾"] },
  { label: "想开始学", items: ["Machine Learning", "AI Infra", "Python", "Rust"] },
] as const;

export const CATEGORY_META = {
  tech: {
    label: "Tech",
    title: "技术笔记",
    description: "算法入门、C++、AI 探索、课程笔记和工程练习记录。很多文章会保留学习现场，不急着写成定论。",
  },
  life: {
    label: "Life",
    title: "生活杂谈",
    description: "硬件折腾、日常观察和学习之外的轻量记录。",
  },
} as const;

export type BlogCategory = keyof typeof CATEGORY_META;

export const POST_STAGE_META = {
  study: {
    label: "课程学习笔记",
    description: "正在打基础时整理的学习记录。",
  },
  paper: {
    label: "论文学习",
    description: "第一轮论文阅读和理解记录。",
  },
  done: {
    label: "已完结",
    description: "已经理解透彻、可以放心参考的成稿。",
  },
  evergreen: {
    label: "长期维护",
    description: "会持续更新补充的常青笔记。",
  },
  pitfall: {
    label: "踩坑记录",
    description: "报错排查和避坑经验。",
  },
  snippet: {
    label: "随手记",
    description: "零碎想法和不成体系的短笔记。",
  },
} as const;

export type PostStage = keyof typeof POST_STAGE_META;

const BASE_URL = import.meta.env.BASE_URL ?? "/";
const EXTERNAL_URL = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

export function withBase(path = "/") {
  if (EXTERNAL_URL.test(path) || path.startsWith("#")) return path;

  const base = BASE_URL === "/" ? "" : BASE_URL.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/` || "/";

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function withoutBase(path: string) {
  const base = BASE_URL === "/" ? "" : normalizePath(BASE_URL);
  const cleanPath = normalizePath(path);

  if (!base) return cleanPath;
  if (cleanPath === base) return "/";
  if (cleanPath.startsWith(`${base}/`)) return cleanPath.slice(base.length) || "/";
  return cleanPath;
}

export function categoryPath(category: BlogCategory) {
  return withBase(`/${category}`);
}

export function postPath(category: BlogCategory | string, slug: string) {
  return withBase(`/${category}/${slug}`);
}

export function tagSlug(tag: string) {
  const slug = tag
    .trim()
    .normalize("NFKC")
    .replace(/\+/g, "-plus")
    .replace(/&/g, "-and-")
    .replace(/[/?#%[\]@!$'()*,:;=\\]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "tag";
}

export function tagPath(tag: string) {
  return withBase(`/tags/${tagSlug(tag)}`);
}
