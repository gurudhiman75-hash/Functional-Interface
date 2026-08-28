import {
  matchEmbeddedGraphV1,
  validateEmbeddedGraphV1,
  type EmbeddedEdgeV1,
  type EmbeddedGraphV1,
  type EmbeddedVertexV1,
} from "./embedded-figure-graph-v1";
import { renderEmbeddedGraphSvgV1 } from "./embedded-figure-production-generator-v1";
import {
  EMBEDDED_FIGURE_VISUAL_REALISM_REMEDIATION_V1,
  generateEmbeddedFigureVisualRealismQuestionV1,
  type EmbeddedVisualRealismQuestionV1,
} from "./embedded-figure-visual-realism-remediation-v1";

export const EMBEDDED_FIGURE_WHOLE_OPTION_CONNECTIVITY_REMEDIATION_V1 = Object.freeze({
  authorityId: "EMB-001-WHOLE-OPTION-CONNECTIVITY-REMEDIATION-V1" as const,
  sourceVisualAuthority: EMBEDDED_FIGURE_VISUAL_REALISM_REMEDIATION_V1.authorityId,
  purpose: "REMOVE_DETACHED_OPTION_ISLANDS_WHILE_PRESERVING_EXACT_EMBEDDING_SEMANTICS" as const,
  requiresEveryOptionSingleConnectedComponent: true,
  bridgesDisconnectedComponentsWithBentTwoEdgePaths: true,
  addsNoDirectBridgeEdgeBetweenLegacyComponents: true,
  reSolvesEveryOption: true,
  geometryFingerprintIgnoresSeed: true,
  geometryFingerprintIgnoresAnswerPosition: true,
  geometryFingerprintIgnoresWholeFigureTranslationAndUniformScale: true,
  permanentQlAllocationAuthorized: false,
  questionStudioRegistered: false,
  automaticStudentPublication: false,
});

export type EmbeddedWholeOptionConnectivityQuestionV1 = Readonly<EmbeddedVisualRealismQuestionV1 & {
  sourceVisualGeometryFingerprint: string;
  geometryFingerprint: string;
  connectivityRemediationAuthority: typeof EMBEDDED_FIGURE_WHOLE_OPTION_CONNECTIVITY_REMEDIATION_V1.authorityId;
  connectivityValidation: Readonly<{
    valid: true;
    everyOptionSingleConnectedComponent: true;
    exactlyOneEmbeddedOptionAfterConnectivityRemediation: true;
    solverCorrectIndex: number;
    sourceComponentCounts: readonly number[];
    finalComponentCounts: readonly number[];
    bridgePathCounts: readonly number[];
  }>;
}>;

function hash32(text: string, seed = 0x811c9dc5): number {
  let hash = seed >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function fingerprint(text: string): string {
  const a = hash32(text, 0x811c9dc5).toString(16).padStart(8, "0");
  const b = hash32([...text].reverse().join(""), 0x9e3779b9).toString(16).padStart(8, "0");
  return `${a}${b}`;
}

class RngV1 {
  private state: number;
  constructor(seed: string) {
    this.state = hash32(seed, 0x6d2b79f5) || 0x12345678;
  }
  next(): number {
    let x = this.state >>> 0;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return this.state / 0x100000000;
  }
  range(min: number, max: number): number {
    return min + (max - min) * this.next();
  }
}

function point(id: string, x: number, y: number): EmbeddedVertexV1 {
  return Object.freeze({ id, x, y });
}

function line(id: string, a: string, b: string): EmbeddedEdgeV1 {
  return Object.freeze({ id, a, b, kind: "LINE" });
}

function clamp(value: number): number {
  return Math.min(113, Math.max(7, value));
}

function graphComponents(graph: EmbeddedGraphV1): readonly (readonly string[])[] {
  const adjacency = new Map<string, Set<string>>();
  for (const vertex of graph.vertices) adjacency.set(vertex.id, new Set());
  for (const edge of graph.edges) {
    adjacency.get(edge.a)?.add(edge.b);
    adjacency.get(edge.b)?.add(edge.a);
  }
  const unseen = new Set(graph.vertices.map((vertex) => vertex.id));
  const components: string[][] = [];
  while (unseen.size > 0) {
    const start = [...unseen].sort()[0]!;
    unseen.delete(start);
    const queue = [start];
    const component: string[] = [];
    while (queue.length > 0) {
      const current = queue.shift()!;
      component.push(current);
      for (const next of adjacency.get(current) ?? []) {
        if (!unseen.has(next)) continue;
        unseen.delete(next);
        queue.push(next);
      }
    }
    components.push(component.sort());
  }
  return Object.freeze(components.map((component) => Object.freeze(component)));
}

function distance(a: EmbeddedVertexV1, b: EmbeddedVertexV1): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function nearestComponentPair(
  graph: EmbeddedGraphV1,
  components: readonly (readonly string[])[],
): Readonly<{ a: EmbeddedVertexV1; b: EmbeddedVertexV1 }> {
  const byId = new Map(graph.vertices.map((vertex) => [vertex.id, vertex]));
  let best: { a: EmbeddedVertexV1; b: EmbeddedVertexV1; distance: number } | null = null;
  for (let i = 0; i < components.length; i += 1) {
    for (let j = i + 1; j < components.length; j += 1) {
      for (const aId of components[i]!) {
        for (const bId of components[j]!) {
          const a = byId.get(aId)!;
          const b = byId.get(bId)!;
          const d = distance(a, b);
          if (!best || d < best.distance) best = { a, b, distance: d };
        }
      }
    }
  }
  if (!best) throw new Error("EMB connectivity remediation could not find two disconnected components.");
  return Object.freeze({ a: best.a, b: best.b });
}

function bridgePoint(
  a: EmbeddedVertexV1,
  b: EmbeddedVertexV1,
  rng: RngV1,
  id: string,
): EmbeddedVertexV1 {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.max(Math.hypot(dx, dy), 0.001);
  const midpointX = (a.x + b.x) / 2;
  const midpointY = (a.y + b.y) / 2;
  const sign = rng.next() < 0.5 ? -1 : 1;
  const offset = Math.min(13, Math.max(7, length * rng.range(0.18, 0.32))) * sign;
  const x = clamp(midpointX - (dy / length) * offset);
  const y = clamp(midpointY + (dx / length) * offset);
  return point(id, x, y);
}

function connectWholeOption(
  source: EmbeddedGraphV1,
  seed: string,
  optionIndex: number,
  connectivityAttempt: number,
): Readonly<{
  graph: EmbeddedGraphV1;
  sourceComponentCount: number;
  finalComponentCount: 1;
  bridgePathCount: number;
}> | null {
  const sourceComponents = graphComponents(source);
  if (sourceComponents.length === 1) {
    return Object.freeze({ graph: source, sourceComponentCount: 1, finalComponentCount: 1, bridgePathCount: 0 });
  }

  const rng = new RngV1(`${seed}:whole-option-connectivity:${optionIndex}:${connectivityAttempt}`);
  let vertices: EmbeddedVertexV1[] = [...source.vertices];
  let edges: EmbeddedEdgeV1[] = [...source.edges];
  let bridgePathCount = 0;

  while (true) {
    const current = Object.freeze({ vertices: Object.freeze(vertices), edges: Object.freeze(edges) });
    const components = graphComponents(current);
    if (components.length === 1) break;
    if (bridgePathCount > 8) return null;

    const pair = nearestComponentPair(current, components);
    const bridgeId = `woc${optionIndex}_${connectivityAttempt}_v${bridgePathCount}`;
    const bridge = bridgePoint(pair.a, pair.b, rng, bridgeId);
    if (distance(pair.a, bridge) < 4 || distance(pair.b, bridge) < 4) return null;
    if (vertices.some((vertex) => vertex.id !== pair.a.id && vertex.id !== pair.b.id && distance(vertex, bridge) < 3.5)) return null;

    vertices = [...vertices, bridge];
    edges = [
      ...edges,
      line(`woc${optionIndex}_${connectivityAttempt}_e${bridgePathCount}a`, pair.a.id, bridge.id),
      line(`woc${optionIndex}_${connectivityAttempt}_e${bridgePathCount}b`, bridge.id, pair.b.id),
    ];
    bridgePathCount += 1;
  }

  const graph = Object.freeze({ vertices: Object.freeze(vertices), edges: Object.freeze(edges) });
  if (!validateEmbeddedGraphV1(graph).valid) return null;
  const finalComponentCount = graphComponents(graph).length;
  if (finalComponentCount !== 1) return null;
  return Object.freeze({
    graph,
    sourceComponentCount: sourceComponents.length,
    finalComponentCount: 1,
    bridgePathCount,
  });
}

function canonicalVisualGraph(graph: EmbeddedGraphV1): string {
  const minX = Math.min(...graph.vertices.map((vertex) => vertex.x));
  const minY = Math.min(...graph.vertices.map((vertex) => vertex.y));
  const maxX = Math.max(...graph.vertices.map((vertex) => vertex.x));
  const maxY = Math.max(...graph.vertices.map((vertex) => vertex.y));
  const extent = Math.max(maxX - minX, maxY - minY, 1);
  const normalized = graph.vertices.map((vertex) => ({ id: vertex.id, x: (vertex.x - minX) / extent, y: (vertex.y - minY) / extent }));
  const ordered = [...normalized].sort((a, b) => a.x - b.x || a.y - b.y || a.id.localeCompare(b.id));
  const canonicalIndex = new Map(ordered.map((vertex, index) => [vertex.id, index]));
  const vertices = ordered.map((vertex) => `${vertex.x.toFixed(4)},${vertex.y.toFixed(4)}`);
  const edges = graph.edges.map((edge) => {
    const a = canonicalIndex.get(edge.a)!;
    const b = canonicalIndex.get(edge.b)!;
    const pair = a < b ? `${a}-${b}` : `${b}-${a}`;
    return edge.kind === "LINE" ? `L:${pair}` : `A:${pair}:${edge.bulge.toFixed(4)}`;
  }).sort();
  return `${vertices.join("|")}#${edges.join("|")}`;
}

function geometryFingerprint(targetFingerprint: string, options: readonly EmbeddedGraphV1[]): string {
  return `embg2-${fingerprint([targetFingerprint, ...options.map(canonicalVisualGraph).sort()].join("||"))}`;
}

export function generateEmbeddedFigureWholeOptionConnectivityQuestionV1(seed: string): EmbeddedWholeOptionConnectivityQuestionV1 {
  const source = generateEmbeddedFigureVisualRealismQuestionV1(seed);

  for (let connectivityAttempt = 0; connectivityAttempt < 40; connectivityAttempt += 1) {
    const rebuilt = source.optionGraphs.map((option, optionIndex) => connectWholeOption(option, seed, optionIndex, connectivityAttempt));
    if (rebuilt.some((result) => result === null)) continue;
    const resolved = rebuilt as readonly NonNullable<(typeof rebuilt)[number]>[];
    const optionGraphs = resolved.map((result) => result.graph);
    const solver = optionGraphs.map((option) => matchEmbeddedGraphV1(source.targetGraph, option, "FIXED_ORIENTATION"));
    const matchedIndices = solver.map((result, index) => result.matched ? index : -1).filter((index) => index >= 0);
    if (matchedIndices.length !== 1 || matchedIndices[0] !== source.correctIndex) continue;
    if (optionGraphs.some((option) => graphComponents(option).length !== 1)) continue;

    const geometry = geometryFingerprint(source.targetFingerprint, optionGraphs);
    const content = `embwoc1-${fingerprint([geometry, String(source.stemVariant), String(source.correctIndex)].join("||"))}`;
    return Object.freeze({
      ...source,
      optionGraphs: Object.freeze(optionGraphs),
      optionSvgs: Object.freeze(optionGraphs.map((option) => renderEmbeddedGraphSvgV1(option, "HOST"))),
      sourceVisualGeometryFingerprint: source.geometryFingerprint,
      contentFingerprint: content,
      geometryFingerprint: geometry,
      connectivityRemediationAuthority: EMBEDDED_FIGURE_WHOLE_OPTION_CONNECTIVITY_REMEDIATION_V1.authorityId,
      validation: Object.freeze({ ...source.validation, solverCorrectIndex: matchedIndices[0]! }),
      connectivityValidation: Object.freeze({
        valid: true,
        everyOptionSingleConnectedComponent: true,
        exactlyOneEmbeddedOptionAfterConnectivityRemediation: true,
        solverCorrectIndex: matchedIndices[0]!,
        sourceComponentCounts: Object.freeze(resolved.map((result) => result.sourceComponentCount)),
        finalComponentCounts: Object.freeze(resolved.map((result) => result.finalComponentCount)),
        bridgePathCounts: Object.freeze(resolved.map((result) => result.bridgePathCount)),
      }),
    });
  }

  throw new Error(`EMB-001 whole-option connectivity remediation exhausted deterministic retries for seed ${seed}.`);
}

export function generateEmbeddedFigureWholeOptionConnectivityBatchV1(input: Readonly<{ seed: string; count: number }>): readonly EmbeddedWholeOptionConnectivityQuestionV1[] {
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 50) throw new Error("EMB-001 whole-option connectivity batch count must be an integer from 1 to 50.");
  const questions: EmbeddedWholeOptionConnectivityQuestionV1[] = [];
  const geometryFingerprints = new Set<string>();
  for (let index = 0; index < input.count; index += 1) {
    let accepted: EmbeddedWholeOptionConnectivityQuestionV1 | null = null;
    for (let retry = 0; retry < 30; retry += 1) {
      const candidate = generateEmbeddedFigureWholeOptionConnectivityQuestionV1(`${input.seed}:${index}:${retry}`);
      if (!geometryFingerprints.has(candidate.geometryFingerprint)) {
        accepted = candidate;
        break;
      }
    }
    if (!accepted) throw new Error(`EMB-001 whole-option connectivity batch could not produce geometry-unique item at index ${index}.`);
    geometryFingerprints.add(accepted.geometryFingerprint);
    questions.push(accepted);
  }
  return Object.freeze(questions);
}
