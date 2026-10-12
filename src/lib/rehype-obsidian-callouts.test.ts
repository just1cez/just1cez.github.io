import { describe, expect, it } from "vitest";
import { rehypeObsidianCallouts } from "./rehype-obsidian-callouts.mjs";

type Node = {
  type: string;
  value?: string;
  tagName?: string;
  properties?: { className?: string[] };
  children?: Node[];
};

const text = (value: string): Node => ({ type: "text", value });
const element = (tagName: string, children: Node[]): Node => ({ type: "element", tagName, properties: {}, children });

function render(node: Node): string {
  if (node.type === "text") return node.value ?? "";
  const inner = (node.children ?? []).map(render).join("");
  if (node.type === "root") return inner;
  const className = node.properties?.className?.join(" ");
  return `<${node.tagName}${className ? ` class="${className}"` : ""}>${inner}</${node.tagName}>`;
}

function transform(...paragraph: Node[]) {
  const tree: Node = { type: "root", children: [element("blockquote", [element("p", paragraph)])] };
  rehypeObsidianCallouts()(tree);
  return render(tree);
}

describe("obsidian callouts", () => {
  it("uses the marker line as the title and the following lines as the body", () => {
    expect(transform(text("[!tip] 使用方式\n先找模板\n再调整边界"))).toBe(
      '<aside class="obsidian-callout obsidian-callout-tip"><p class="obsidian-callout-title">使用方式</p><p>先找模板\n再调整边界</p></aside>',
    );
  });

  it("falls back to the callout type when the title is empty instead of promoting the body", () => {
    expect(transform(text("[!Summary]\n第三章讨论 "), element("code", [text("if")]), text(" 表达式。"))).toBe(
      '<aside class="obsidian-callout obsidian-callout-summary"><p class="obsidian-callout-title">summary</p><p>第三章讨论 <code>if</code> 表达式。</p></aside>',
    );
  });

  it("keeps inline elements with the line they belong to", () => {
    expect(transform(text("[!info] 论文 "), element("code", [text("LGC")]), text("\n链接："), element("a", [text("DOI")]))).toBe(
      '<aside class="obsidian-callout obsidian-callout-info"><p class="obsidian-callout-title">论文 <code>LGC</code></p><p>链接：<a>DOI</a></p></aside>',
    );
  });

  it("splits at <br> when soft breaks were turned into hard breaks", () => {
    expect(transform(text("[!summary] 竞赛代码速查"), element("br", []), text("\n"), text("难度：基础模板"), element("br", []), text("\n"), text("复杂度：按片段使用"))).toBe(
      '<aside class="obsidian-callout obsidian-callout-summary"><p class="obsidian-callout-title">竞赛代码速查</p><p>难度：基础模板<br></br>\n复杂度：按片段使用</p></aside>',
    );
  });

  it("falls back to the type name when the marker line is empty and followed by <br>", () => {
    expect(transform(text("[!summary]"), element("br", []), text("\n"), text("Rust 第三章"))).toBe(
      '<aside class="obsidian-callout obsidian-callout-summary"><p class="obsidian-callout-title">summary</p><p>Rust 第三章</p></aside>',
    );
  });

  it("leaves ordinary blockquotes alone", () => {
    expect(transform(text("普通引用"))).toBe("<blockquote><p>普通引用</p></blockquote>");
  });
});
