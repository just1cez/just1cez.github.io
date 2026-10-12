import { describe, expect, it } from "vitest";
import { remarkDisplayMath } from "./remark-display-math.mjs";

type Node = { type: string; value?: string; children?: Node[]; position?: { start: { offset: number }; end: { offset: number } } };

// Build a paragraph whose single inline-math child points at `raw` inside `source`.
function mathParagraph(source: string, raw: string, value: string, extra: Node[] = []): Node {
  const start = source.indexOf(raw);
  return {
    type: "paragraph",
    children: [...extra, { type: "inlineMath", value, position: { start: { offset: start }, end: { offset: start + raw.length } } }],
  };
}

function transform(source: string, ...children: Node[]) {
  const tree: Node = { type: "root", children };
  remarkDisplayMath()(tree, { value: source });
  return tree.children!;
}

describe("one-line display math", () => {
  it("promotes a paragraph that is only $$...$$ to display math", () => {
    const source = "前文\n\n$$S \\approx S_H$$\n";
    const [node] = transform(source, mathParagraph(source, "$$S \\approx S_H$$", "S \\approx S_H"));
    expect(node).toMatchObject({
      type: "math",
      value: "S \\approx S_H",
      data: { hName: "pre", hChildren: [{ tagName: "code", properties: { className: ["language-math", "math-display"] } }] },
    });
  });

  it("keeps single-dollar math inline even when it fills the paragraph", () => {
    const source = "$x$\n";
    const [node] = transform(source, mathParagraph(source, "$x$", "x"));
    expect(node.type).toBe("paragraph");
  });

  it("keeps $$...$$ inline when the paragraph also has text", () => {
    const source = "结果是 $$x$$\n";
    const [node] = transform(source, mathParagraph(source, "$$x$$", "x", [{ type: "text", value: "结果是 " }]));
    expect(node.type).toBe("paragraph");
  });

  it("also promotes math nested in blockquotes and lists", () => {
    const source = "> $$a+b$$\n";
    const quote: Node = { type: "blockquote", children: [mathParagraph(source, "$$a+b$$", "a+b")] };
    const [node] = transform(source, quote);
    expect(node.children![0].type).toBe("math");
  });
});
