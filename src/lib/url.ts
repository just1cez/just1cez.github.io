const EXTERNAL_URL = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

export function withBasePath(path = "/", baseUrl = "/") {
  if (EXTERNAL_URL.test(path) || path.startsWith("#")) return path;

  const base = baseUrl === "/" ? "" : baseUrl.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/` || "/";

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function withoutBasePath(path: string, baseUrl = "/") {
  const base = baseUrl === "/" ? "" : normalizePath(baseUrl);
  const cleanPath = normalizePath(path);

  if (!base) return cleanPath;
  if (cleanPath === base) return "/";
  if (cleanPath.startsWith(`${base}/`)) return cleanPath.slice(base.length) || "/";
  return cleanPath;
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

export type TagSlugOwner<T> = { tag: string; source: T };

export function registerTagSlug<T>(owners: Map<string, TagSlugOwner<T>>, tag: string, source: T) {
  const slug = tagSlug(tag);
  const owner = owners.get(slug);

  if (owner && owner.tag !== tag) return { slug, owner };
  if (!owner) owners.set(slug, { tag, source });
  return null;
}
