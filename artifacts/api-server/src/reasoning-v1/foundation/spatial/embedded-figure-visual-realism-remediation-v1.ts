import {
  matchEmbeddedGraphV1,
  validateEmbeddedGraphV1,
  type EmbeddedEdgeV1,
  type EmbeddedGraphV1,
  type EmbeddedVertexV1,
} from "./embedded-figure-graph-v1";
import {
  EMBEDDED_FIGURE_PRODUCTION_GENERATOR_AUTHORITY_V1,
  generateEmbeddedFigureQuestionV1,
  renderEmbeddedGraphSvgV1,
  type EmbeddedGeneratedQuestionV1,
} from "./embedded-figure-production-generator-v1";

export const EMBEDDED_FIGURE_VISUAL_REALISM_REMEDIATION_V1 = Object.freeze({
  authorityId: "EMB-001-VISUAL-REALISM-REMEDIATION-V1" as const,
  sourceGeneratorAuthority: EMBEDDED_FIGURE_PRODUCTION_GENERATOR_AUTHORITY_V1.authorityId,
  purpose: "REPLACE_FLOATING_RANDOM_CLUTTER_WITH_CONNECTED_EXAM_LIKE_CONCEALMENT_GEOMETRY" as const,
  invariantPolicy: "FIXED_ORIENTATION" as const,
  preservesTargetMotif: true,
  preservesDistractorOwnership: true,
  preservesCorrectAnswer: true,
  reSolvesEveryOption: true,
  geometryFingerprintIgnoresSeed: true,
  geometryFingerprintIgnoresAnswerPosition: true,
  geometryFingerprintIgnoresWholeFigureTranslationAndUniformScale: true,
  permanentQlAllocationAuthorized: false,
  questionStudioRegistered: false,
  automaticStudentPublication: false,
});

export type EmbeddedVisualRealismQuestionV1 = Readonly<EmbeddedGeneratedQuestionV1 & {
  sourceContentFingerprint: string;
  geometryFingerprint: string;
  visualRemediationAuthority: typeof EMBEDDED_FIGURE_VISUAL_REALISM_REMEDIATION_V1.authorityId;
  visualValidation: Readonly<{
    valid: true;
    noFloatingConcealmentEdges: true;
    allConcealmentVerticesAttachedToHost: true;
    exactlyOneEmbeddedOptionAfterRemediation: true;
    solverCorrectIndex: number;
    concealmentEdgeCounts: readonly number[];
    concealmentVertexCounts: readonly number[];
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
  int(maxExclusive: number): number {
    return Math.floor(this.next() * maxExclusive);
  }
  range(min: number, max: number): number {
    return min + (max - min) * this.next();
  }
  pick<T>(values: readonly T[]): T {
    return values[this.int(values.length)]!;
  }
}

function point(id: string, x: number, y: number): EmbeddedVertexV1 {
  return Object.freeze({ id, x, y });
}

function line(id: string, a: string, b: string): EmbeddedEdgeV1 {
  return Object.freeze({ id, a, b, kind: "LINE" });
}

function isLegacyNoiseVertex(id: string): boolean {
  return /n\d+[ab]$/.test(id);
}

function stripLegacyFloatingNoise(graph: EmbeddedGraphV1): EmbeddedGraphV1 {
  return Object.freeze({
    vertices: Object.freeze(graph.vertices.filter((vertex) => !isLegacyNoiseVertex(vertex.id))),
    edges: Object.freeze(graph.edges.filter((edge) => !edge.id.includes("noise"))),
  });
}

function distance(a: EmbeddedVertexV1, b: EmbeddedVertexV1): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value: number): number {
  return Math.min(113, Math.max(7, value));
}

function hasEdge(edges: readonly EmbeddedEdgeV1[], a: string, b: string): boolean {
  return edges.some((edge) => (edge.a === a && edge.b === b) || (edge.a === b && edge.b === a));
}

function desiredConcealmentEdgeCount(difficulty: EmbeddedGeneratedQuestionV1["difficulty"], rng: RngV1): number {
  if (difficulty === "L1") return 4 + rng.int(2);
  if (difficulty === "L2") return 7 + rng.int(3);
  return 10 + rng.int(4);
}

const ANGLES = Object.freeze([0, 28, 45, 62, 90, 118, 135, 152, 180, 208, 225, 242, 270, 298, 315, 332]);

function createAttachedPoint(
  anchor: EmbeddedVertexV1,
  existing: readonly EmbeddedVertexV1[],
  rng: RngV1,
  id: string,
): EmbeddedVertexV1 | null {
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const angle = rng.pick(ANGLES) * Math.PI / 180;
    const length = rng.range(15, 32);
    const candidate = point(
      id,
      clamp(anchor.x + Math.cos(angle) * length),
      clamp(anchor.y + Math.sin(angle) * length),
    );
    if (distance(anchor, candidate) < 12) continue;
    if (existing.some((vertex) => distance(vertex, candidate) < 5.5)) continue;
    return candidate;
  }
  return null;
}

function buildConnectedConcealment(
  base: EmbeddedGraphV1,
  difficulty: EmbeddedGeneratedQuestionV1["difficulty"],
  seed: string,
  optionIndex: number,
  visualAttempt: number,
): Readonly<{ graph: EmbeddedGraphV1; concealmentEdgeCount: number; concealmentVertexCount: number }> | null {
  const rng = new RngV1(`${seed}:connected-concealment:${optionIndex}:${visualAttempt}`);
  const vertices: EmbeddedVertexV1[] = [...base.vertices];
  const edges: EmbeddedEdgeV1[] = [...base.edges];
  const baseVertexIds = new Set(base.vertices.map((vertex) => vertex.id));
  const desiredEdges = desiredConcealmentEdgeCount(difficulty, rng);
  const concealmentVertexIds = new Set<string>();
  let addedEdges = 0;
  let guard = 0;

  while (addedEdges < desiredEdges && guard < desiredEdges * 20) {
    guard += 1;
    const recentVertices = vertices.slice(Math.max(0, vertices.length - 8));
    const anchorPool = addedEdges < 2
      ? base.vertices
      : rng.next() < 0.58
        ? recentVertices
        : vertices;
    const anchor = rng.pick(anchorPool);
    const newId = `vr${optionIndex}_${visualAttempt}_v${concealmentVertexIds.size}`;
    const candidate = createAttachedPoint(anchor, vertices, rng, newId);
    if (!candidate) continue;

    vertices.push(candidate);
    concealmentVertexIds.add(candidate.id);
    edges.push(line(`vr${optionIndex}_${visualAttempt}_e${addedEdges}`, anchor.id, candidate.id));
    addedEdges += 1;

    // Exam-style meshes often close a small triangle or quadrilateral. Add a second
    // attachment only when it is short enough to remain visually coherent.
    if (addedEdges < desiredEdges && rng.next() < (difficulty === "L1" ? 0.18 : difficulty === "L2" ? 0.34 : 0.46)) {
      const bridgeCandidates = vertices.filter((vertex) =>
        vertex.id !== candidate.id
        && vertex.id !== anchor.id
        && distance(vertex, candidate) >= 12
        && distance(vertex, candidate) <= 42
        && !hasEdge(edges, vertex.id, candidate.id),
      );
      if (bridgeCandidates.length > 0) {
        const bridge = rng.pick(bridgeCandidates);
        edges.push(line(`vr${optionIndex}_${visualAttempt}_e${addedEdges}`, candidate.id, bridge.id));
        addedEdges += 1;
      }
    }
  }

  if (addedEdges !== desiredEdges) return null;

  const graph = Object.freeze({ vertices: Object.freeze(vertices), edges: Object.freeze(edges) });
  if (!validateEmbeddedGraphV1(graph).valid) return null;

  const concealmentEdges = graph.edges.filter((edge) => edge.id.startsWith(`vr${optionIndex}_${visualAttempt}_e`));
  if (concealmentEdges.length !== desiredEdges) return null;
  if (concealmentEdges.some((edge) => !baseVertexIds.has(edge.a) && !baseVertexIds.has(edge.b) && !concealmentVertexIds.has(edge.a) && !concealmentVertexIds.has(edge.b))) return null;

  // Every concealment vertex must be reachable from at least one original host vertex.
  const adjacency = new Map<string, Set<string>>();
  for (const vertex of graph.vertices) adjacency.set(vertex.id, new Set());
  for (const edge of graph.edges) {
    adjacency.get(edge.a)?.add(edge.b);
    adjacency.get(edge.b)?.add(edge.a);
  }
  const seen = new Set<string>(baseVertexIds);
  const queue = [...baseVertexIds];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const next of adjacency.get(current) ?? []) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  if ([...concealmentVertexIds].some((id) => !seen.has(id))) return null;

  return Object.freeze({
    graph,
    concealmentEdgeCount: concealmentEdges.length,
    concealmentVertexCount: concealmentVertexIds.size,
  });
}

function canonicalVisualGraph(graph: EmbeddedGraphV1): string {
  const minX = Math.min(...graph.vertices.map((vertex) => vertex.x));
  const minY = Math.min(...graph.vertices.map((vertex) => vertex.y));
  const maxX = Math.max(...graph.vertices.map((vertex) => vertex.x));
  const maxY = Math.max(...graph.vertices.map((vertex) => vertex.y));
  const extent = Math.max(maxX - minX, maxY - minY, 1);
  const normalized = graph.vertices.map((vertex) => ({
    id: vertex.id,
    x: (vertex.x - minX) / extent,
    y: (vertex.y - minY) / extent,
  }));
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
  const optionShapes = options.map(canonicalVisualGraph).sort();
  return `embg1-${fingerprint([targetFingerprint, ...optionShapes].join("||"))}`;
}

export function generateEmbeddedFigureVisualRealismQuestionV1(seed: string): EmbeddedVisualRealismQuestionV1 {
  const base = generateEmbeddedFigureQuestionV1(seed);
  const stripped = base.optionGraphs.map(stripLegacyFloatingNoise);

  for (let visualAttempt = 0; visualAttempt < 60; visualAttempt += 1) {
    const rebuilt = stripped.map((option, optionIndex) => buildConnectedConcealment(option, base.difficulty, seed, optionIndex, visualAttempt));
    if (rebuilt.some((result) => result === null)) continue;
    const resolved = rebuilt as readonly NonNullable<(typeof rebuilt)[number]>[];
    const optionGraphs = resolved.map((result) => result.graph);
    const solver = optionGraphs.map((option) => matchEmbeddedGraphV1(base.targetGraph, option, "FIXED_ORIENTATION"));
    const matchedIndices = solver.map((result, index) => result.matched ? index : -1).filter((index) => index >= 0);
    if (matchedIndices.length !== 1 || matchedIndices[0] !== base.correctIndex) continue;

    const geometry = geometryFingerprint(base.targetFingerprint, optionGraphs);
    const content = `embvr1-${fingerprint([geometry, String(base.stemVariant), String(base.correctIndex)].join("||"))}`;
    return Object.freeze({
      ...base,
      optionGraphs: Object.freeze(optionGraphs),
      optionSvgs: Object.freeze(optionGraphs.map((option) => renderEmbeddedGraphSvgV1(option, "HOST"))),
      sourceContentFingerprint: base.contentFingerprint,
      contentFingerprint: content,
      geometryFingerprint: geometry,
      visualRemediationAuthority: EMBEDDED_FIGURE_VISUAL_REALISM_REMEDIATION_V1.authorityId,
      validation: Object.freeze({
        ...base.validation,
        solverCorrectIndex: matchedIndices[0]!,
      }),
      visualValidation: Object.freeze({
        valid: true,
        noFloatingConcealmentEdges: true,
        allConcealmentVerticesAttachedToHost: true,
        exactlyOneEmbeddedOptionAfterRemediation: true,
        solverCorrectIndex: matchedIndices[0]!,
        concealmentEdgeCounts: Object.freeze(resolved.map((result) => result.concealmentEdgeCount)),
        concealmentVertexCounts: Object.freeze(resolved.map((result) => result.concealmentVertexCount)),
      }),
    });
  }

  throw new Error(`EMB-001 visual-realism remediation exhausted deterministic retries for seed ${seed}.`);
}

export function generateEmbeddedFigureVisualRealismBatchV1(input: Readonly<{ seed: string; count: number }>): readonly EmbeddedVisualRealismQuestionV1[] {
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 50) throw new Error("EMB-001 visual-realism batch count must be an integer from 1 to 50.");
  const questions: EmbeddedVisualRealismQuestionV1[] = [];
  const geometryFingerprints = new Set<string>();
  for (let index = 0; index < input.count; index += 1) {
    let accepted: EmbeddedVisualRealismQuestionV1 | null = null;
    for (let retry = 0; retry < 30; retry += 1) {
      const candidate = generateEmbeddedFigureVisualRealismQuestionV1(`${input.seed}:${index}:${retry}`);
      if (!geometryFingerprints.has(candidate.geometryFingerprint)) {
        accepted = candidate;
        break;
      }
    }
    if (!accepted) throw new Error(`EMB-001 visual-realism batch could not produce geometry-unique item at index ${index}.`);
    geometryFingerprints.add(accepted.geometryFingerprint);
    questions.push(accepted);
  }
  return Object.freeze(questions);
}
