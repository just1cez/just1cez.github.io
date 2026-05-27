export const SITE = {
  title: "Justice's Blog",
  author: "Justice",
  description: "算法学习、论文阅读、图像复原与工程实践记录。",
  locale: "zh-CN",
  github: "https://github.com/just1cez",
  avatar: "/images/avatar.jpg",
} as const;

export const CATEGORY_META = {
  tech: {
    label: "Tech",
    title: "技术笔记",
    description: "C++、算法、深度学习、图像复原论文和工程实践记录。",
  },
  life: {
    label: "Life",
    title: "生活杂谈",
    description: "硬件折腾、日常观察和学习之外的轻量记录。",
  },
} as const;

export type BlogCategory = keyof typeof CATEGORY_META;

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
