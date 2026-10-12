const calloutMarker = /^\[!([A-Za-z][\w-]*)][ \t]*/;

function hasContent(nodes) {
  return nodes.some((node) => node.type !== "text" || node.value.trim());
}

function isBreak(node) {
  return node.type === "element" && node.tagName === "br";
}

// Split a paragraph's inline nodes at the first line break: the marker line is the title, the rest is the body.
// A line break is a `<br>` (remark-breaks turns soft breaks into these) or a raw "\n" inside a text node.
function splitFirstLine(nodes) {
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];

    if (isBreak(node)) {
      // mdast-util-to-hast emits a "\n" text node right after every <br>; drop it so the body doesn't start with one.
      const [next, ...rest] = nodes.slice(index + 1);
      const body = next?.type === "text" && next.value.startsWith("\n") ? [{ type: "text", value: next.value.slice(1) }, ...rest] : nodes.slice(index + 1);
      return [nodes.slice(0, index), body.filter((child) => child.type !== "text" || child.value)];
    }

    const breakAt = node.type === "text" ? node.value.indexOf("\n") : -1;
    if (breakAt === -1) continue;

    const head = node.value.slice(0, breakAt);
    const tail = node.value.slice(breakAt + 1);
    return [
      [...nodes.slice(0, index), ...(head ? [{ type: "text", value: head }] : [])],
      [...(tail ? [{ type: "text", value: tail }] : []), ...nodes.slice(index + 1)],
    ];
  }

  return [nodes, []];
}

export function rehypeObsidianCallouts() {
  function visit(node) {
    if (!node || typeof node !== "object") return;

    if (node.type === "element" && node.tagName === "blockquote") {
      const firstChild = node.children?.find((child) => child.type === "element" && child.tagName === "p");
      const firstText = firstChild?.children?.[0];
      const match = firstText?.type === "text" ? firstText.value.match(calloutMarker) : null;

      if (match) {
        const type = match[1].toLowerCase();
        firstText.value = firstText.value.slice(match[0].length);
        const [titleNodes, bodyNodes] = splitFirstLine(firstChild.children);

        node.tagName = "aside";
        node.properties = {
          ...(node.properties ?? {}),
          className: ["obsidian-callout", `obsidian-callout-${type}`],
        };

        firstChild.children = hasContent(titleNodes) ? titleNodes : [{ type: "text", value: type }];
        firstChild.properties = {
          ...(firstChild.properties ?? {}),
          className: ["obsidian-callout-title"],
        };

        if (hasContent(bodyNodes)) {
          const titleIndex = node.children.indexOf(firstChild);
          node.children.splice(titleIndex + 1, 0, {
            type: "element",
            tagName: "p",
            properties: {},
            children: bodyNodes,
          });
        }
      }
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) visit(child);
    }
  }

  return (tree) => visit(tree);
}
