# Blog

基于 Astro + Tailwind CSS 的个人博客，支持 GitHub Pages 静态部署。

## 功能

- Tech / Life 两个内容分区
- 标签页、标签索引、文章归档、站内搜索、RSS、sitemap、robots.txt
- Markdown / MDX、数学公式、代码高亮、代码复制
- 明暗主题切换，移动端导航
- Open Graph 与结构化数据
- 支持 GitHub Pages 用户站和项目页部署

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署

推送到 `main` 分支即可自动部署到 GitHub Pages。

### 首次配置

1. 在仓库 Settings → Pages 中，Source 选择 **GitHub Actions**
2. 如需自定义域名，设置 `SITE_URL` 仓库变量（Settings → Secrets and variables → Variables → `SITE_URL`）
3. 如果部署到项目页，例如 `https://user.github.io/blog/`，再设置仓库变量 `BASE_PATH=/blog`

当前远程仓库是用户站形式时，`SITE_URL` 可保持默认，`BASE_PATH` 可保持 `/`。

## 内容管理

- **技术区**：`src/content/tech/` — 支持 `.md` 和 `.mdx`
- **生活区**：`src/content/life/` — 支持 `.md` 和 `.mdx`

每篇文章 Frontmatter 格式：

```yaml
---
title: "文章标题"
date: 2026-05-19
tags: ["Tag1", "Tag2"]
category: "tech"  # 或 "life"
description: "文章描述"
cover: "/images/example.jpg"
draft: false
---
```

`cover` 可选，用于文章 Open Graph 图片；图片放在 `public/` 下时以 `/` 开头引用。
