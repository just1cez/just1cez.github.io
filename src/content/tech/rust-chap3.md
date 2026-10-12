---
title: "Rust 学习笔记（三）：通用编程概念"
date: 2026-09-30
tags: ["Rust", "学习笔记"]
category: "tech"
description: "整理 Rust 第三章中的变量、类型、函数、表达式与控制流，并记录从 C++ 迁移时容易混淆的细节。"
featured: false
series: "Rust 学习笔记"
stage: "study"
draft: true
---

> [!summary] 
> Rust 第三章讨论变量、基础类型、函数、注释和控制流。大多数概念与 C++ 类似，需要注意的：变量默认不可变、遮蔽会创建新变量、代码块可以产生值，以及 `if` 和 `loop` 本身也是表达式。

## 变量与可变性

### 变量默认不可变

Rust 使用 `let` 声明变量，变量默认不可变：

```rust
let x = 3;
```

下面的代码无法通过编译：

```rust
let x = 3;
x = 4;
```

如果变量后续确实需要改变，要显式添加 `mut`：

```rust
let mut x = 3;
x = 4;
```

`mut` 不只是语法要求，也是在向代码阅读者说明：这个值之后会发生变化。

### 常量

常量使用 `const` 声明：

```rust
const MAX_SCORE: i32 = 100;
```

常量具有以下特点：

- 必须显式标注类型；
- 不能使用 `mut`；
- 必须能在编译阶段确定值；
- 通常使用全大写字母和下划线命名。

### 遮蔽

Rust 允许使用 `let` 创建同名的新变量：

```rust
let spaces = "   ";
let spaces = spaces.len();
```

第一行的 `spaces` 是字符串切片，第二行根据它创建了一个新的整数变量。这个过程叫作 **遮蔽（shadowing）**。

遮蔽不是修改旧变量，而是让同名的新变量暂时盖住旧变量，因此前后类型可以不同。相比之下，`mut` 修改的是同一个变量，不能改变其类型。

## 数据类型

Rust 是静态类型语言：编译器必须在编译阶段确定每个值的类型。不过，大部分情况下编译器可以自动推断，不需要处处手写类型。

```rust
let x = 3;        // 推断为 i32
let y: u64 = 10; // 显式标注为 u64
```

### 标量类型

常见标量类型包括：

- 整数：`i8`、`i16`、`i32`、`i64`、`i128`，以及对应的无符号类型 `u8` 等；
- 与平台位数相关的整数：`isize`、`usize`，常用于索引和集合长度；
- 浮点数：`f32`、`f64`；
- 布尔值：`bool`，只有 `true` 和 `false`；
- 字符：`char`，使用单引号，例如 `'A'`、`'中'`、`'🦀'`。

Rust 不会像 C++ 那样自动把数字转换为布尔值：

```rust
let number = 3;

if number != 0 {
    println!("number is not zero");
}
```

`if number { ... }` 在 Rust 中无法通过编译，因为条件必须明确为 `bool`。

### 元组

元组可以把不同类型、固定数量的值组合起来：

```rust
let user: (&str, i32, bool) = ("justice", 18, true);
```

可以使用位置索引读取元素：

```rust
let name = user.0;
let age = user.1;
```

也可以通过模式匹配一次性解构：

```rust
let (name, age, active) = user;
```

空元组 `()` 被称为 **unit 类型**，常用来表示“没有有意义的返回值”。

### 数组

数组中的元素必须具有相同类型，长度也是类型的一部分：

```rust
let scores: [i32; 3] = [11, 22, 33];
```

其中 `i32` 是元素类型，`3` 是数组长度。数组长度固定，使用下标访问：

```rust
let first = scores[0];
```

### 切片

切片不拥有数据，而是借用一段连续的数据：

```rust
let numbers = [1, 2, 3, 4, 5];
let middle: &[i32] = &numbers[1..4];

assert_eq!(middle, &[2, 3, 4]);
```

这里的 `1..4` 左闭右开，包括下标 `1`，不包括下标 `4`。`middle` 没有复制出一个新数组，只是观察原数组的一部分。这会在所有权与借用章节中继续展开。

## 函数

Rust 使用 `fn` 定义函数，参数类型和返回类型都写在函数签名中：

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

这段签名表示：函数接收两个 `i32`，并返回一个 `i32`。

没有返回有效数据的函数可以省略返回类型：

```rust
fn print_measurement(value: i32, unit: char) {
    println!("{value}{unit}");
}
```

变量可以直接写在格式字符串的 `{}` 中。与 C 的 `printf` 不同，Rust 的格式化会受到编译器检查。

### 语句与表达式

- **语句（statement）**执行一个动作，不产生可供使用的结果；
- **表达式（expression）**计算并产生一个值。

`let` 是语句：

```rust
let x = 3;
```

`x + 1` 是表达式：

```rust
x + 1
```

代码块也可以是表达式：

```rust
let y = {
    let x = 1;
    x + 1
};

assert_eq!(y, 2);
```

最后一行 `x + 1` 没有分号，因此它的值成为整个代码块的值。加上分号后，计算结果会被丢弃，代码块只产生 `()`。

函数通常利用最后一个表达式隐式返回：

```rust
fn square(x: i32) -> i32 {
    x * x
}
```

也可以使用 `return` 提前返回：

```rust
fn absolute(x: i32) -> i32 {
    if x < 0 {
        return -x;
    }

    x
}
```

## 注释

普通注释以 `//` 开始：

```rust
// 这是一行注释
let answer = 42;
```

注释更适合解释“为什么这样写”，而不是重复代码已经表达清楚的内容。

## 控制流

### `if` 表达式

基本写法与 C++ 相似，但条件必须是 `bool`：

```rust
let condition = true;

if condition {
    println!("condition is true");
} else {
    println!("condition is false");
}
```

`if` 本身也是表达式，可以直接产生一个值：

```rust
let condition = false;
let x = if condition { 3 } else { 4 };

assert_eq!(x, 4);
```

因为变量在编译阶段必须具有确定的类型，所以所有可能执行的分支必须产生相同类型的值。

### `loop`

`loop` 会一直重复，直到遇到 `break`：

```rust
let mut counter = 0;

loop {
    counter += 1;
    if counter == 10 {
        break;
    }
}
```

`loop` 也可以通过 `break` 返回一个值：

```rust
let mut counter = 0;

let result = loop {
    counter += 1;
    if counter == 10 {
        break counter * 2;
    }
};

assert_eq!(result, 20);
```

`continue` 会跳过本轮剩余代码，立即进入下一轮循环。

### `while`

当条件为 `true` 时持续执行：

```rust
let mut number = 3;

while number != 0 {
    println!("{number}");
    number -= 1;
}
```

### `for`

`for` 常用于遍历集合：

```rust
let scores = [11, 22, 33];

for score in scores {
    println!("{score}");
}
```

也可以遍历范围：

```rust
for number in 1..4 {
    println!("{number}");
}
```

`1..4` 包含 `1、2、3`，不包含 `4`；如果需要包含右端点，可以写成 `1..=4`。

## 和 C++ 的区别

> [!tip] 重要部分
> 第三章的大部分控制流都与 C++ 相似。真正需要重新建立直觉的是不可变性、表达式、切片，以及后续的所有权和借用。

| 场景 | C++ 中的常见写法 | Rust 中的写法 |
|---|---|---|
| 可变变量 | 普通变量通常可变 | 需要 `let mut` |
| 条件判断 | 整数可隐式作为真假 | 条件必须是 `bool` |
| 固定数组 | `int a[3]` | `[i32; 3]` |
| 数组的一段 | 指针和长度、容器迭代器 | `&[T]` 切片 |
| 函数返回值 | 常用 `return` | 常用最后一个无分号表达式 |
| 分支产生值 | 通常先声明变量再赋值 | `let x = if ... { ... } else { ... };` |
