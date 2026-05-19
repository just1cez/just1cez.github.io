---
title: "线段树从入门到实战"
date: 2026-05-18
tags: ["C++", "Algorithm", "数据结构"]
category: "tech"
description: "详解线段树的原理与 C++ 实现，含区间修改与懒标记。"
---

## 引入

给定长度为 $n$ 的数组 $a$，需要支持两种操作：

1. **区间修改**：将 $[l,r]$ 中每个元素加上 $\Delta$
2. **区间查询**：求 $\sum_{i=l}^{r} a_i$

暴力做法 $O(n)$，线段树将两种操作均优化到 $O(\log n)$。

## 建树

```cpp
struct Node { int l, r, sum, lazy; } t[N << 2];

void build(int p, int l, int r) {
    t[p].l = l; t[p].r = r;
    if (l == r) { t[p].sum = a[l]; return; }
    int mid = (l + r) >> 1;
    build(p << 1, l, mid);
    build(p << 1 | 1, mid + 1, r);
    t[p].sum = t[p << 1].sum + t[p << 1 | 1].sum;
}
```

## 懒标记

下推 `lazy` 标记，保证延迟修改只在必要时传播：

$$
\text{pushdown}(p):\quad
\begin{cases}
t[p \ll 1].\text{sum} += \text{len} \times t[p].\text{lazy} \\
t[p \ll 1].\text{lazy} += t[p].\text{lazy} \\
t[p \ll 1 | 1] \text{ 同理}
\end{cases}
$$

## 复杂度分析

| 操作       | 时间复杂度   |
| ---------- | ------------ |
| 建树       | $O(n)$       |
| 区间修改   | $O(\log n)$  |
| 区间查询   | $O(\log n)$  |

空间复杂度 $O(4n)$，实际开 $4n$ 即可。

## 小结

线段树是处理**区间问题**的核心数据结构之一，掌握懒标记后可扩展至区间最值、区间 gcd 等场景。