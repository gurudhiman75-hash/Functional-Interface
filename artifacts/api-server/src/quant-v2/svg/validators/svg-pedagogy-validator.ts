import type { SvgLayoutGraph } from "../contracts/svg-visualization-types";

export interface SvgPedagogyMetrics {
  visualizationCoverage: number;
  layoutQualityScore: number;
  pedagogicalClarityScore: number;
  multilingualSvgSafety: number;
  nodeContinuityScore: number;
  derivationVisibilityScore: number;
}

export interface SvgValidationResult {
  valid: boolean;
  issues: string[];
  metrics: SvgPedagogyMetrics;
}

const EQUATION_PATTERN = /\d\s*(?:×|x|\+|-|\/|\^|=)\s*\d/u;
const UNSAFE_SVG_PATTERN = /<script|onload=|onclick=|javascript:/iu;

function hasOverlap(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}

function score(issueCount: number, penalty = 25) {
  return Math.max(0, 100 - issueCount * penalty);
}

export function validateSvgPedagogyGraph(
  graph: SvgLayoutGraph,
  svg: string,
): SvgValidationResult {
  const issues: string[] = [];
  const expectedEdges = Math.max(0, graph.nodes.length - 1);
  const continuityIssues =
    graph.edges.length !== expectedEdges
      ? 1
      : graph.edges.filter((edge, index) =>
          edge.from !== graph.nodes[index]?.id ||
          edge.to !== graph.nodes[index + 1]?.id,
        ).length;

  if (graph.nodes.length < 2) {
    issues.push("Visualization graph has too few nodes.");
  }
  if (continuityIssues > 0) {
    issues.push("Visualization graph has broken node continuity.");
  }

  let overlaps = 0;
  for (let i = 0; i < graph.nodes.length; i += 1) {
    for (let j = i + 1; j < graph.nodes.length; j += 1) {
      if (hasOverlap(graph.nodes[i]!, graph.nodes[j]!)) {
        overlaps += 1;
      }
    }
  }
  if (overlaps > 0) {
    issues.push("SVG layout contains overlapping nodes.");
  }

  const equationNodeCount = graph.nodes.filter((node) =>
    node.equationLines.some((line) => EQUATION_PATTERN.test(line)),
  ).length;
  if (equationNodeCount === 0) {
    issues.push("Visualization has no visible derivation equations.");
  }
  if (UNSAFE_SVG_PATTERN.test(svg)) {
    issues.push("SVG contains unsafe rendering content.");
  }
  if (!svg.includes("<svg") || !svg.includes("</svg>")) {
    issues.push("SVG output is incomplete.");
  }

  const metrics: SvgPedagogyMetrics = {
    visualizationCoverage: graph.nodes.length >= 2 ? 100 : 60,
    layoutQualityScore: score(overlaps, 35),
    pedagogicalClarityScore: score(
      (graph.nodes.length < 3 ? 1 : 0) + (equationNodeCount === 0 ? 1 : 0),
      20,
    ),
    multilingualSvgSafety: UNSAFE_SVG_PATTERN.test(svg) ? 0 : 100,
    nodeContinuityScore: score(continuityIssues, 30),
    derivationVisibilityScore: equationNodeCount > 0 ? 100 : 40,
  };

  return {
    valid: issues.length === 0,
    issues,
    metrics,
  };
}

