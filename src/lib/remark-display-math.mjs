// Obsidian renders a paragraph that holds nothing but `$$...$$` as display math. remark-math only does that
// when the `$$` fences sit on their own lines, so promote the one-line form to the same `math` node it builds.
function isBlank(node) {
  return node.type === "text" && !node.value.trim();
}

function displayMath(value, position) {
  return {
    type: "math",
    meta: null,
    value,
    position,
    data: {
      hName: "pre",
      hChildren: [
        {
          type: "element",
          tagName: "code",
          properties: { className: ["language-math", "math-display"] },
          children: [{ type: "text", value }],
        },
      ],
    },
  };
}

export function remarkDisplayMath() {
  return (tree, file) => {
    const source = String(file?.value ?? "");

    function visit(parent) {
      if (!Array.isArray(parent.children)) return;

      parent.children.forEach((child, index) => {
        if (child.type === "paragraph") {
          const content = child.children.filter((node) => !isBlank(node));
          const [math] = content;
          const start = math?.position?.start?.offset;
          const end = math?.position?.end?.offset;

          if (content.length === 1 && math.type === "inlineMath" && start != null && end != null) {
            const raw = source.slice(start, end);
            if (raw.startsWith("$$") && raw.endsWith("$$")) parent.children[index] = displayMath(math.value, child.position);
          }
          return;
        }

        visit(child);
      });
    }

    visit(tree);
  };
}
