# Justice's Blog

基于 Astro + Tailwind CSS 的个人技术博客 / 知识花园，定位是算法、深度学习、图像复原、工程实践和硬件折腾的长期记录站。

## 功能

- 首页个人入口：`Justice / HITSZ CS`、正在关注、精选文章、最近更新、技术方向标签、GitHub / RSS / About
- Tech / Life 两个内容分区，支持标签页、文章归档、站内搜索、RSS、sitemap、robots.txt
- 文章页支持目录、阅读进度条、标题锚点、代码块文件名、语言标记、复制按钮、数学公式、上一篇 / 下一篇、相关阅读
- MDX 写作组件：论文信息卡、算法题结构卡、提示块
- 明暗主题切换、移动端导航、Open Graph 与结构化数据
- GitHub Actions 自动构建并部署到 GitHub Pages

## 本地开发

```bash
npm install
npm run dev
```

`npm run dev` 会显示 `draft: true` 的草稿，适合本地预览。

## 构建

```bash
npm run build
```

生产构建会自动隐藏 `draft: true` 的文章；发布前把 frontmatter 改成 `draft: false` 即可。

## 写新文章

使用脚本创建文章，slug 只用小写字母、数字和连字符：

```bash
npm run new:post -- tech my-algorithm-note
npm run new:post -- algorithm luogu-pxxxx
npm run new:post -- paper my-paper-reading
npm run new:post -- life my-pc-build
```

脚本会从 `templates/` 复制模板到对应目录：

- `tech` -> `src/content/tech/*.mdx`
- `algorithm` -> `src/content/tech/*.mdx`
- `paper` -> `src/content/tech/*.mdx`
- `life` -> `src/content/life/*.md`

常用 frontmatter：

```yaml
---
title: "文章标题"
date: 2026-05-27
updated: 2026-05-27
tags: ["Algorithm", "C++"]
category: "tech"
description: "一句话说明这篇文章解决什么问题。"
cover: "/images/example.jpg"
featured: false
series: "系列名称"
draft: true
---
```

- `draft: true`：本地可见，线上不可见
- `featured: true`：优先进入首页精选文章
- `series`：用于文章页、搜索、相关文章的主题关联
- `cover`：用于 Open Graph 图片；文件放在 `public/` 下时用 `/images/name.jpg` 这类路径

## MDX 组件

技术和论文文章推荐使用 `.mdx`，可以在正文中引入结构化组件：

```mdx
import { AlgorithmCard, Callout, PaperCard } from "../../components/mdx";

<Callout type="tip" title="结论">
三到五句话写清楚这篇文章最值得记住的东西。
</Callout>

<AlgorithmCard title="题目 / 方法名" difficulty="中等" complexity="O(n log n)">
写题意、核心思路、复杂度和坑点。
</AlgorithmCard>

<PaperCard
  title="论文标题"
  venue="CVPR 2026"
  task="图像复原"
  link="https://example.com"
/>
```

代码块可以写文件名，文章页会显示在代码块顶部：

````md
```cpp title="solution.cpp"
int main() {}
```
````

## 部署

推送到 `main` 分支即可自动部署到 GitHub Pages。

### 首次配置

1. 在仓库 Settings → Pages 中，Source 选择 **GitHub Actions**
2. 如需自定义域名，设置 `SITE_URL` 仓库变量（Settings → Secrets and variables → Variables → `SITE_URL`）
3. 如果部署到项目页，例如 `https://user.github.io/blog/`，再设置仓库变量 `BASE_PATH=/blog`

当前远程仓库是用户站形式时，`SITE_URL` 可保持默认，`BASE_PATH` 可保持 `/`。

## 发布检查

```bash
npm run build
git status -sb
git push origin main:main
```

如果推送时报 workflow 权限错误，说明当前 Personal Access Token 没有 `workflow` scope，不能创建或修改 `.github/workflows/deploy.yml`。这个权限是 GitHub 的保护机制，避免低权限 token 篡改 CI/CD 流程。给 token 增加 `workflow` 权限，或改用有权限的认证方式后再 push。
