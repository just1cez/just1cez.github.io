---
title: "C++ 竞赛常用技巧速查"
date: 2026-05-19
tags: ["C++", "Algorithm", "竞赛"]
category: "tech"
description: "字符串转数字、环形处理、快速幂、坐标变换、vector 去重等竞赛常用代码片段。"
---

## 字符串与数字互转

单个字符转数字：

```cpp
char c = '7';
int x = c - '0'; // x = 7
```

多位字符串转数字（手动实现）：

```cpp
string str = "123";
int x = 0;
for (char c : str) {
    x = 10 * x + (c - '0'); // 1 -> 12 -> 123
}
```

直接用 STL：

```cpp
string str = "123";
int x = stoi(str); // x = 123
```

## ASCII 大小写关系

`'a' - 'A' = 32`，转换只需加减 32：

```cpp
char upper = 'a' - 32; // 'A'
char lower = 'A' + 32; // 'a'
```

## 字符串流拼接

```cpp
stringstream ss;
ss << "awa" << 1 << "qaq";
string s = ss.str(); // s = "awa1qaq"
```

## 环形结构取模

防止负数溢出、获取正确环形索引：

```cpp
pos = (pos % n + n) % n;
```

## 坐标旋转

$(i, j)$ 绕 $(x, y)$ 逆时针旋转 90°：

1. 以 $(x,y)$ 为原点：$(i, j) \to (i-x, \ j-y)$
2. 逆时针 90°：$(i-x, \ j-y) \to (j-y, \ x-i)$
3. 变回原坐标系：$(x + y - j, \ y - x + i)$

```cpp
tmp = a;
a[x + y - j][y - x + i] = tmp[i][j];
```

## 二维坐标系方向数组

行变化为 $x$（上下），列变化为 $y$（左右）：

```cpp
int dx[4] = {-1, 0, 1, 0};
int dy[4] = {0, 1, 0, -1}; // N, E, S, W
```

状态转移时先判断边界：

```cpp
int nx = x + dx[dir];
if (nx < 0 || nx >= n) { /* 临界处理 */ }
else x = nx;
```

## vector 去重

```cpp
sort(a.begin(), a.end());
a.erase(unique(a.begin(), a.end()), a.end());
```

`unique` 将相邻重复元素移至末尾，配合 `erase` 删除。

## 数字字符串降序排序

```cpp
bool cmp(string a, string b) {
    if (a.size() != b.size()) return a.size() > b.size();
    return a > b;
}
```

先比较位数，位数相同再比较字典序。

## 快速幂

计算 $\text{base}^P$，时间复杂度 $O(\log P)$：

```cpp
int ans = 1;
while (P > 0) {
    if (P % 2 == 1) ans = mul(ans, base);
    base = mul(base, base);
    P /= 2;
}
```

原理：将指数 $P$ 转为二进制。例如 $P = 13 = 1101_2$：

$$\text{base}^{13} = \text{base}^8 \times \text{base}^4 \times \text{base}^1$$

- $P \bmod 2 = 1$：当前位为 1，乘入 `ans`
- $P \bmod 2 = 0$：跳过
- `base = base²`：向前进位

## 竞赛编码习惯

- 存储题目数据尽量使用**全局变量**
- 模拟时关注**状态量**而非过程量