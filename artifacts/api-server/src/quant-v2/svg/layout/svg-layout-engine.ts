import type {
  SvgLayoutGraph,
  SvgLayoutNode,
  SvgPedagogyGraph,
} from "../contracts/svg-visualization-types";

function wrap(text: string, maxChars: number) {
  const words = text.split(/\s+/u).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }
  return lines.length > 0 ? lines : [text];
}

function equationLines(equation: string | undefined) {
  if (!equation) {
    return [];
  }
  if (equation.length <= 42) {
    return [equation];
  }
  return equation
    .replace(/\s*=\s*/gu, " = ")
    .split(/\s*;\s*/u)
    .flatMap((part) => wrap(part, 42));
}

export function layoutSvgPedagogyGraph(
  graph: SvgPedagogyGraph,
): SvgLayoutGraph {
  const width = 720;
  const cardWidth = 560;
  const x = 80;
  const gap = 24;
  let y = 78;

  const nodes: SvgLayoutNode[] = graph.nodes.map((node) => {
    const labelLines = wrap(node.label, 34);
    const eqLines = equationLines(node.equation);
    const height = Math.max(
      76,
      28 + labelLines.length * 20 + eqLines.length * 22,
    );
    const layoutNode: SvgLayoutNode = {
      ...node,
      x,
      y,
      width: cardWidth,
      height,
      labelLines,
      equationLines: eqLines,
    };
    y += height + gap;
    return layoutNode;
  });

  return {
    ...graph,
    width,
    height: y + 28,
    nodes,
  };
}

