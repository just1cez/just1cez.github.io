# Blog

基于 Astro + Tailwind CSS 的个人博客，支持 GitHub Pages 部署。

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
draft: false
---
```