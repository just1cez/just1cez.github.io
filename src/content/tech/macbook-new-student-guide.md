---
title: "MacBook 新生配置指北"
date: 2026-09-22
tags: ["macOS", "开发环境", "新生指南"]
category: "tech"
description: "面向第一次使用 MacBook 的同学，从日常操作开始，逐步完成常用软件、终端、Git 和基础开发环境配置。"
series: "新生指南"
stage: "evergreen"
featured: false
draft: false
---

本文旨在帮助初次使用 MacOS 的同学快速上手。由于网络上的教程参差不齐，笔者在得到许多人的帮助下才磕磕绊绊地完成了基本的配置，因此决定写些东西出来。

如果你此前一直使用 Windows，第一次看到 macOS 的键盘布局、文件路径和终端时觉得陌生很正常。这份指北面向第一次使用 MacBook 的同学，从日常操作开始，带你逐步完成常用软件和基础开发环境的配置。

macOS 是类 Unix 系统，有 Linux 使用经验的同学会更容易上手；没有经验也不用担心，不用急着一次完成所有内容，按需阅读即可。

> **安全提醒**
>
> **不要执行来源不明的终端命令，更不要因为报错就随手在命令前加 `sudo`。本文涉及的安装命令也建议先确认用途，并以链接中的官方网站和项目文档为准。API Key、密码等敏感信息不要发给他人，也不要提交到 Git 仓库。**

## 1. 从 Windows 切换过来，需要知道什么

| Windows | macOS | 说明 |
| --- | --- | --- |
| `Ctrl` | `Command（⌘）` | 复制、粘贴、保存等常用快捷键通常把 `Ctrl` 换成 `Command` |
| `Alt` | `Option（⌥）` | 常用于输入特殊字符或触发附加操作 |
| 文件资源管理器 | 访达（Finder） | 管理文件和文件夹 |
| 开始菜单搜索 | 聚焦搜索（Spotlight） | 按 `Command + 空格` 搜索应用和文件 |
| 任务栏 | 程序坞（Dock） | 显示常用和正在运行的应用 |
| `C:\Users\你的名字` | `/Users/你的名字`，终端中简写为 `~` | 当前用户的主目录 |

还需要注意几点：

- 点击窗口左上角的红色按钮通常只是关闭窗口，应用可能仍在运行；使用 `Command + Q` 才是退出应用。
- macOS 的路径使用 `/`，没有 `C:`、`D:` 盘符。
- 文件名以 `.` 开头时默认隐藏，可在访达中按 `Command + Shift + .` 显示或隐藏。
- 安装应用时，既可以从 App Store 获取，也可以从开发者官网下载；不必为了方便而使用来路不明的安装包。

更多快捷键可查看 [Apple 官方说明](https://support.apple.com/102650)。

## 2. 先把系统调整顺手

### 2.1 更新系统

打开：

```text
系统设置 → 通用 → 软件更新
```

建议先安装系统提供的最新稳定更新，再继续配置。更新前保存好正在编辑的文件。由于版本号变化很快，本文不写死“最新版”编号，以“软件更新”页面显示的内容为准。

### 2.2 调整常用选项

以下设置没有唯一答案，可按个人习惯选择：

- `系统设置 → 触控板 → 轻点来点按`：减少按压触控板的次数。
- `系统设置 → 键盘`：调整按键重复速度和输入法。
- `系统设置 → 桌面与程序坞`：选择是否自动隐藏程序坞。
- `访达 → 设置 → 高级 → 显示所有文件扩展名`：便于区分 `.py`、`.md`、`.zip` 等文件。
- `系统设置 → 隐私与安全性`：检查 FileVault、防火墙和应用权限。
- 登录自己的 Apple 账户，并确认“查找”功能是否符合自己的使用需要。

建议先保留 Spotlight。它已经能完成大多数应用启动和文件搜索；确实需要更强的快捷操作时，再尝试 Raycast 等替代工具。

### 2.3 安装应用前检查安全设置

打开：

```text
系统设置 → 隐私与安全性 → 安全性
```

在“允许以下来源的应用程序”中，通常建议保持 **App Store 与已知开发者**。这样既可以安装 App Store 应用，也可以安装经过 Apple 开发者身份签名的软件。

![“隐私与安全性”中的应用来源设置](/images/posts/macbook-new-student-guide/macos-app-security-setting.png)

如果系统拦截了某个应用，先确认它是否来自开发者官网、名称是否正确，再决定是否放行。不要为了省事关闭系统安全机制，也不要打开来源不明的软件。

## 3. 准备终端和 Homebrew

如果暂时只使用浏览器和办公软件，可以先跳过这一节。

### 3.1 打开终端

按 `Command + 空格`，输入“终端”并回车。终端是通过文字命令操作电脑的工具，不是另一个操作系统。macOS 默认使用的 Shell 是 `zsh`。

如果课程需要 Git、编译器等开发工具，可安装 Apple 提供的命令行工具：

```bash
xcode-select --install
```

在弹出的窗口中确认安装。若系统提示已经安装，可以直接继续。完成后验证：

```bash
git --version
```

### 3.2 安装 Homebrew
注意到Homebrew 有图形化界面，虽然我没用过。

Homebrew 是 macOS 常用的软件包管理工具，作用有些类似 Windows 上的 winget：它能统一安装和更新许多命令行工具与图形界面应用。

打开 [Homebrew 官网](https://brew.sh/)，复制页面提供的最新安装命令。安装过程中会出现较多英文输出，只要最后没有明显的 `Error`，通常就是正常的。

脚本结束后，终端会显示一段 **Next steps**。请继续执行其中用于配置环境变量的命令，然后关闭并重新打开终端。Apple 芯片和 Intel 芯片的默认安装路径不同，所以应以安装器给出的内容为准，不要照抄别人的 PATH。

验证安装：

```bash
brew --version
```

常用命令：

```bash
brew search 软件名          # 搜索软件
brew install 软件名         # 安装命令行工具
brew install --cask 应用名  # 安装图形界面应用
brew update                 # 更新软件列表
brew upgrade                # 更新已安装的软件
```

Homebrew 也有第三方图形界面工具，但不是必需品。本指北使用命令行，是因为课程文档和官方说明通常也采用这种方式，遇到问题时更容易排查。

## 4. 安装常用应用

应用按需安装即可。下表列出的都是图形界面应用，在 Homebrew 中称为 **Cask**：

| 应用 | 用途 | Cask 名称 |
| --- | --- | --- |
| Visual Studio Code | 编写代码和文本 | `visual-studio-code` |
| Ghostty | 支持 GPU 加速渲染的终端应用 | `ghostty` |
| Google Chrome | 浏览器 | `google-chrome` |
| Obsidian | Markdown 笔记 | `obsidian` |
| Keka | 解压缩工具 | `keka` |
| Stats | 菜单栏系统状态 | `stats` |
| Raycast | 应用启动、搜索和快捷操作 | `raycast` |

例如，安装 VS Code、Ghostty 和 Raycast：

```bash
brew install --cask visual-studio-code ghostty raycast
```

### 4.1 终端应用怎么选

系统自带的“终端”已经够用。Ghostty、Kitty 和 iTerm2 都是可选替代品：

- **Ghostty**：界面简洁，支持 GPU 加速渲染。（推荐）
- **Kitty**：功能丰富，同样使用 GPU 渲染。
- **iTerm2**：历史较久，资料和插件较多。

选择其中一个即可。它们只是终端窗口不同，不会改变后续命令的含义。字体、字号、配色、背景透明度等也都可以日后在终端应用中调整。

### 4.2 配置 VS Code

第一次打开 VS Code 后：

1. 按 `Command + Shift + P` 打开命令面板。
2. 搜索并运行 `Shell Command: Install 'code' command in PATH`。
3. 重新打开终端，执行 `code .`，即可用 VS Code 打开当前文件夹。
4. 如需同步设置，可在账户或齿轮菜单中开启 Settings Sync，并使用 GitHub 或 Microsoft 账户登录。

扩展可以随用随装。例如 Python 课程可安装 Python 和 Pylance；保持精简通常更容易维护。

### 4.3 更多软件从哪里找

[Awesome Mac 中文版](https://github.com/jaywcjlove/awesome-mac/blob/master/README-zh.md) 收集了许多 macOS 软件，可按需求查找。清单只适合用来发现软件，安装前仍应核对开发者、官网和权限要求。

如果确实需要网络代理工具，可按所在地法律、校园网络规定和自己的服务配置选择。Shadowrocket 需要从特定地区的 App Store 获取，支持的协议类型较多；相关账号、订阅和配置只能来自可信来源。本指北不展开网络代理配置。

## 5. 第一次使用终端

先掌握基础命令，再考虑美化终端：

| 命令 | 作用 | 示例 |
| --- | --- | --- |
| `pwd` | 显示当前所在目录 | `pwd` |
| `ls` | 列出当前目录内容 | `ls -la` |
| `cd` | 进入目录 | `cd ~/Documents` |
| `cd ..` | 返回上一级目录 | `cd ..` |
| `mkdir` | 新建文件夹 | `mkdir demo` |
| `cat` | 查看较短的文本文件 | `cat README.md` |
| `grep` | 在文本中查找内容 | `grep "TODO" README.md` |
| `open` | 用图形界面打开文件或目录 | `open .` |
| `clear` | 清空当前终端显示 | `clear` |

几个容易误解的现象：

- 输入系统密码时，屏幕上不会出现圆点或星号，但系统仍在接收输入；输入完成后按回车即可。
- 命令和许多开发工具区分大小写，名称需要完全一致。
- `~` 表示主目录；`~/.zshrc` 是 zsh 的用户配置文件。
- 遇到权限报错时先别急着加 `sudo`，尤其不要运行 `sudo brew ...`。先看清报错，确认文件归属和推荐的安装方式。
- 一次执行一条命令，确认没有明显报错后再继续。暂时看不懂的命令可以先跳过。

## 6. 配置 Git

将示例内容换成自己的姓名和邮箱：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"
```

检查配置：

```bash
git config --global --list
```

这里的姓名和邮箱会写入 Git 提交记录，不是网站登录账号。若课程或组织对邮箱有要求，以其说明为准。

## 7. 课程需要什么，就安装什么

同一种工具先选择一套即可。建议先看课程 README 或教师要求的版本，再选择下面对应的部分。

### 7.1 Python：推荐使用 uv 管理项目

macOS 自带的 Python 主要供系统使用。课程项目建议使用独立环境，避免不同项目的依赖互相影响。

```bash
brew install uv
uv init hello-python
cd hello-python
uv add requests
uv run python -c "import requests; print(requests.__version__)"
```

`uv` 会为项目管理 Python 版本、虚拟环境和依赖。更多用法见 [uv 官方项目指南](https://docs.astral.sh/uv/guides/projects/)。

### 7.2 C++

安装 Apple 命令行工具后，通常已经可以使用 Apple Clang。假设当前目录中有 `hello.cpp`：

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, world!\n";
    return 0;
}
```

编译并运行：

```bash
clang++ -std=c++23 hello.cpp -o hello
./hello
```

如果课程明确要求较新的 Homebrew LLVM，可再安装：

```bash
brew install llvm
"$(brew --prefix llvm)/bin/clang++" -std=c++23 hello.cpp -o hello
```

具体 C++ 标准和编译器版本应以课程要求为准。

### 7.3 Node.js

```bash
brew install node
node --version
npm --version
```

若课程指定了 Node.js 版本，再按课程说明安装版本管理器；初学阶段不需要同时安装 `npm`、`pnpm`、`yarn` 等多个包管理器。

### 7.4 Go、Zig 等语言

只在课程或项目明确需要时安装：

```bash
brew install go
brew install zig
```

## 8. 选做：让终端更顺手

下面的工具能提高效率，但都不是 Git、Python 或 C++ 的必需品。建议先熟悉第 5 节的基础命令，再逐个添加。

### 8.1 常用命令行工具

```bash
brew install eza zoxide bat ripgrep fd fzf btop zellij lazygit git-delta
```

| 工具 | 作用 |
| --- | --- |
| `eza` | 更易读的文件列表 |
| `zoxide` | 根据历史记录快速跳转目录 |
| `bat` | 带语法高亮地查看文本文件 |
| `ripgrep`（`rg`） | 在项目中快速搜索文本 |
| `fd` | 更易用的文件搜索 |
| `fzf` | 模糊搜索和交互选择 |
| `btop` | 查看 CPU、内存和进程 |
| `zellij` | 在一个终端中管理多个窗格和会话 |
| `lazygit`、`git-delta` | 改善 Git 的交互和差异显示 |

刚开始可以保留 `ls` 和 `cd` 的默认行为，这样课程文档中的命令与自己电脑上的表现更一致。

### 8.2 Oh My Zsh、补全与主题

Oh My Zsh、自动建议、语法高亮和 Powerlevel10k 只改善使用体验，不影响开发工具运行。

| 工具 | 作用 |
| --- | --- |
| Oh My Zsh | 统一管理 zsh 的插件和主题 |
| zsh-autosuggestions | 根据历史命令显示建议 |
| zsh-syntax-highlighting | 输入时标出有效和可能有误的命令 |
| Powerlevel10k | 在提示符中显示路径、Git 状态等信息 |

使用 [Oh My Zsh 官网](https://ohmyz.sh/) 提供的安装命令。安装器会创建新的 `~/.zshrc`；如果原来已经有这个文件，请先留意其中是否有需要保留的 PATH 或代理配置。

安装插件和主题：

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions \
  "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions"

git clone https://github.com/zsh-users/zsh-syntax-highlighting.git \
  "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting"

git clone --depth=1 https://github.com/romkatv/powerlevel10k.git \
  "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
```

每条命令只需执行一次。如果提示目标目录已经存在，说明对应工具可能已经安装。

用 VS Code 打开配置文件：

```bash
code ~/.zshrc
```

找到已有的 `ZSH_THEME` 和 `plugins`，修改为：

```zsh
ZSH_THEME="powerlevel10k/powerlevel10k"

plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
)
```

不要再添加一组重复配置；`zsh-syntax-highlighting` 建议放在插件列表最后。保存后重新启动 zsh：

```bash
exec zsh
```

Powerlevel10k 通常会自动打开配置向导，也可以手动运行：

```bash
p10k configure
```

如果图标显示成方框，通常是终端字体不支持。可以安装字体：

```bash
brew install --cask font-meslo-for-powerlevel10k
```

也可以选择 JetBrains Mono Nerd Font 等 Nerd Font，然后在终端应用的设置中启用。

## 9. 遇到问题时先看这里

### 9.1 提示 `command not found: brew`

重新查看 Homebrew 安装结束时的 **Next steps**，执行其中的环境配置命令，然后重开终端。

### 9.2 提示 `command not found: code`

在 VS Code 中按 `Command + Shift + P`，运行 `Shell Command: Install 'code' command in PATH`，然后重开终端。

### 9.3 `brew`、`git` 或 `curl` 突然无法联网

先检查浏览器能否联网，再检查终端是否残留代理变量：

```bash
env | grep -i proxy
```

如果代理软件已经关闭而这些变量仍有值，可在当前终端临时清除：

```bash
unset http_proxy https_proxy all_proxy HTTP_PROXY HTTPS_PROXY ALL_PROXY
```

代理需要使用时再开启会更稳妥。如果在 `~/.zshrc` 中无条件自动开启代理，代理软件未运行时，所有新终端都可能无法联网。

### 9.4 不确定自己的 Mac 芯片类型

```bash
uname -m
```

输出 `arm64` 表示 Apple 芯片，`x86_64` 表示 Intel 芯片。多数情况下按安装器给出的提示操作即可，不需要手动判断安装路径。

## 10. 检查与日常维护

按自己的安装范围执行：

```bash
git --version
brew --version
code --version
uv --version
clang++ --version
```

没有安装的工具出现 `command not found` 很正常，只需要检查自己实际安装过的项目。能够完成课程要求的开发和提交工作即可，不必追求把所有工具都装齐。

日常更新 Homebrew 管理的软件：

```bash
brew update
brew upgrade
brew cleanup
```

系统、App Store 应用和课程指定环境仍需按各自方式更新。更新大型工具前，可以先确认当前课程是否依赖某个特定版本。

## 11. 进阶选做：安装 OMP 并接入 DeepSeek

> 本节面向已经熟悉终端、Git 和配置文件的同学。AI 编程工具可能产生费用，也可能生成错误或不安全的代码。不要上传作业答案、个人隐私、学校内部资料或密钥；生成的代码必须由自己理解、检查和测试。

Claude Code、Codex、OMP 等工具的安装方式和模型支持变化较快。本节只记录 OMP 的一种配置方法；出现差异时，以 [OMP 项目文档](https://github.com/can1357/oh-my-pi) 和 [DeepSeek API 文档](https://api-docs.deepseek.com/) 为准。

### 11.1 安装 OMP

已经安装 Homebrew 时，可运行：

```bash
brew install can1357/tap/omp
```

也可以使用项目官网提供的安装脚本：

```bash
curl -fsSL https://omp.sh/install | sh
```

不要从相似域名或第三方帖子复制脚本。安装完成后验证：

```bash
omp --version
```

如需 zsh 命令补全，把下面一行加入 `~/.zshrc`，再重开终端：

```zsh
eval "$(omp completions zsh)"
```

### 11.2 配置 DeepSeek API Key

先在 DeepSeek 官方平台创建 API Key。不要把真实密钥写进教程、截图或 Git 仓库。

在 `~/.zshrc` 中添加：

```zsh
export DEEPSEEK_API_KEY="sk-xxxxxxxx"
```

保存后重新打开终端，或运行 `exec zsh`。示例中的 `sk-xxxxxxxx` 必须替换为自己的密钥。

### 11.3 添加模型配置

打开 `~/.omp/agent/models.yml`；如果文件不存在，可以新建。加入下面的 provider。若文件中已经有顶层 `providers:`，只需把 `deepseek:` 及其内容合并进去，不要再写第二个 `providers:`。

```yaml
providers:
  deepseek:
    baseUrl: https://api.deepseek.com
    api: openai-completions
    apiKey: DEEPSEEK_API_KEY
    authHeader: true
    models:
      - id: deepseek-v4-pro
        name: DeepSeek V4 Pro
        reasoning: true
        thinking:
          minLevel: high
          maxLevel: xhigh
          mode: effort
        input: [text]
        contextWindow: 1000000
        maxTokens: 384000
        compat:
          supportsDeveloperRole: false
          supportsReasoningEffort: true
          maxTokensField: max_tokens
          reasoningEffortMap:
            high: high
            xhigh: max
          supportsToolChoice: false
          requiresReasoningContentForToolCalls: true
          requiresAssistantContentForToolCalls: true
          extraBody:
            thinking:
              type: enabled

      - id: deepseek-v4-flash
        name: DeepSeek V4 Flash
        reasoning: true
        thinking:
          minLevel: high
          maxLevel: xhigh
          mode: effort
        input: [text]
        contextWindow: 1000000
        maxTokens: 384000
        compat:
          supportsDeveloperRole: false
          supportsReasoningEffort: true
          maxTokensField: max_tokens
          reasoningEffortMap:
            high: high
            xhigh: max
          supportsToolChoice: false
          requiresReasoningContentForToolCalls: true
          requiresAssistantContentForToolCalls: true
          extraBody:
            thinking:
              type: enabled
```

检查模型是否被识别：

```bash
omp models find deepseek
```

确认无误后运行：

```bash
omp
```

模型名称、上下文长度和兼容字段可能随 OMP 或 DeepSeek 更新。若验证失败，先对照双方官方文档，不要反复粘贴来源不明的配置。

## 写在最后

如果你做到了这里，这台 MacBook 已经能够满足日常学习和基础开发的需要。第一次使用 macOS，不必追求一步到位——MacBook 也未必需要替代你熟悉的所有设备；课程需要什么，再回来安装什么。

终端命令不需要死记。执行前大致了解它要做什么，遇到问题时认真查看报错，并为重要文件保留备份，是很好的使用习惯。

希望这份指北能帮你少绕一些弯路！
