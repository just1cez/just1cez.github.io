export const SITE = {
  title: "Justice's Blog",
  author: "Justice",
  description: "算法入门、AI 探索、大一课程与硬件折腾记录。",
  locale: "zh-CN",
  github: "https://github.com/just1cez",
  avatar: "/images/avatar.jpg",
} as const;

export const CATEGORY_META = {
  tech: {
    label: "Tech",
    title: "技术笔记",
    description: "算法入门、AI 探索、课程笔记、论文初读和工程练习记录。",
  },
  life: {
    label: "Life",
    title: "生活杂谈",
    description: "硬件折腾、日常观察和学习之外的轻量记录。",
  },
} as const;

export type BlogCategory = keyof typeof CATEGORY_META;

export const POST_STAGE_META = {
  intro: {
    label: "入门笔记",
    description: "正在打基础时整理的学习记录。",
  },
  paper: {
    label: "论文初读",
    description: "第一轮论文阅读和理解记录。",
  },
  tinkering: {
    label: "折腾记录",
    description: "硬件、工具或项目实践过程。",
  },
  reference: {
    label: "速查模板",
    description: "以后可以直接回头查的清单或模板。",
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
  return encodeURIComponent(tag.trim()).replace(/%2F/gi, "-").replace(/%5C/gi, "-");
}

export function tagPath(tag: string) {
  return withBase(`/tags/${tagSlug(tag)}`);
}
