import {
  matchEmbeddedGraphV1,
  validateEmbeddedGraphV1,
  type EmbeddedEdgeV1,
  type EmbeddedGraphV1,
  type EmbeddedVertexV1,
} from "./embedded-figure-graph-v1";
import { EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1 } from "./embedded-figure-source-saturated-discovery-v1";

export type EmbeddedDifficultyV1 = "L1" | "L2" | "L3";
export type EmbeddedDistractorKindV1 =
  | "ROTATION_TRAP"
  | "REFLECTION_TRAP"
  | "MISSING_EDGE"
  | "WRONG_INCIDENCE"
  | "NON_UNIFORM_SCALE";

export type EmbeddedMotifV1 = Readonly<{
  motifId: string;
  family: string;
  variant: number;
  graph: EmbeddedGraphV1;
}>;

export type EmbeddedGeneratedQuestionV1 = Readonly<{
  chapterCode: "EMB-001";
  proposalId: "EMB-PROP-01";
  qlStatus: "PROPOSED_NOT_PERMANENT";
  seed: string;
  generationAttempt: number;
  difficulty: EmbeddedDifficultyV1;
  motifId: string;
  motifFamily: string;
  motifVariant: number;
  equivalencePolicy: "FIXED_ORIENTATION";
  stemVariant: number;
  stem: string;
  targetGraph: EmbeddedGraphV1;
  optionGraphs: readonly EmbeddedGraphV1[];
  targetSvg: string;
  optionSvgs: readonly string[];
  correctIndex: number;
  answer: "A" | "B" | "C" | "D";
  distractorKindsByIndex: readonly (EmbeddedDistractorKindV1 | "CORRECT")[];
  targetScaleInCorrectHost: number;
  contentFingerprint: string;
  targetFingerprint: string;
  explanation: Readonly<{
    observation: string;
    rule: string;
    application: string;
    check: string;
  }>;
  validation: Readonly<{
    valid: true;
    graphValid: true;
    exactlyOneEmbeddedOption: true;
    optionSemanticUniqueness: true;
    solverCorrectIndex: number;
  }>;
  lifecycle: Readonly<{
    permanentQlAllocated: false;
    questionStudioRegistered: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>;
}>;

export const EMBEDDED_FIGURE_PRODUCTION_GENERATOR_AUTHORITY_V1 = Object.freeze({
  authorityId: "EMB-001-PRODUCTION-GENERATOR-V1" as const,
  chapterCode: "EMB-001" as const,
  proposalId: "EMB-PROP-01" as const,
  sourceDiscoveryAuthority: EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  policy: "FIXED_ORIENTATION" as const,
  motifCount: 32,
  distractorKinds: Object.freeze([
    "ROTATION_TRAP",
    "REFLECTION_TRAP",
    "MISSING_EDGE",
    "WRONG_INCIDENCE",
    "NON_UNIFORM_SCALE",
  ] as const),
  permanentQlAllocationAuthorized: false,
  questionStudioRegistered: false,
  automaticStudentPublication: false,
});

function point(id: string, x: number, y: number): EmbeddedVertexV1 {
  return Object.freeze({ id, x, y });
}

function line(id: string, a: string, b: string): EmbeddedEdgeV1 {
  return Object.freeze({ id, a, b, kind: "LINE" });
}

function graph(points: readonly EmbeddedVertexV1[], pairs: readonly (readonly [string, string])[]): EmbeddedGraphV1 {
  return Object.freeze({
    vertices: Object.freeze([...points]),
    edges: Object.freeze(pairs.map(([a, b], index) => line(`e${index}`, a, b))),
  });
}

function buildMotifFamily(family: string, variant: number): EmbeddedMotifV1 {
  const a = variant;
  if (family === "OPEN_ZIG") {
    const g = graph(
      [point("A", 0, 0), point("B", 2 + a * 0.25, 0), point("C", 1 + a * 0.1, 1 + a * 0.2), point("D", 3.5 + a * 0.2, 2 + a * 0.1), point("E", 4.2 + a * 0.15, 0.7 + a * 0.12)],
      [["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"]],
    );
    return Object.freeze({ motifId: `${family}-${variant}`, family, variant, graph: g });
  }
  if (family === "STEP_BRANCH") {
    const g = graph(
      [point("A", 0, 0), point("B", 2 + a * 0.2, 0), point("C", 2 + a * 0.2, 1.2 + a * 0.15), point("D", 4 + a * 0.25, 1.2 + a * 0.15), point("E", 4.8 + a * 0.15, 2.7 + a * 0.1), point("F", 3.1 + a * 0.1, 3.4 + a * 0.22)],
      [["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"], ["D", "F"]],
    );
    return Object.freeze({ motifId: `${family}-${variant}`, family, variant, graph: g });
  }
  if (family === "TRIANGLE_SPUR") {
    const g = graph(
      [point("A", 0, 2 + a * 0.1), point("B", 1.6 + a * 0.2, 0), point("C", 3.8 + a * 0.25, 2 + a * 0.1), point("D", 1.7 + a * 0.1, 2.2 + a * 0.2), point("E", 2.5 + a * 0.15, 3.7 + a * 0.15)],
      [["A", "B"], ["B", "C"], ["C", "A"], ["A", "D"], ["D", "E"]],
    );
    return Object.freeze({ motifId: `${family}-${variant}`, family, variant, graph: g });
  }
  if (family === "QUAD_TAIL") {
    const g = graph(
      [point("A", 0, 0.5 + a * 0.1), point("B", 2.4 + a * 0.2, 0), point("C", 3.5 + a * 0.15, 2 + a * 0.2), point("D", 1 + a * 0.1, 2.8 + a * 0.15), point("E", 4.7 + a * 0.18, 3.1 + a * 0.08)],
      [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["C", "E"]],
    );
    return Object.freeze({ motifId: `${family}-${variant}`, family, variant, graph: g });
  }
  if (family === "FORK_CHAIN") {
    const g = graph(
      [point("A", 0, 1.4 + a * 0.12), point("B", 1.8 + a * 0.18, 1.4 + a * 0.12), point("C", 3.4 + a * 0.16, 0), point("D", 3.2 + a * 0.15, 2.8 + a * 0.18), point("E", 4.9 + a * 0.2, 3.7 + a * 0.08), point("F", 5.3 + a * 0.12, 1.8 + a * 0.12)],
      [["A", "B"], ["B", "C"], ["B", "D"], ["D", "E"], ["D", "F"]],
    );
    return Object.freeze({ motifId: `${family}-${variant}`, family, variant, graph: g });
  }
  if (family === "HOOK_CHEVRON") {
    const g = graph(
      [point("A", 0, 0), point("B", 0, 2.2 + a * 0.2), point("C", 1.7 + a * 0.15, 3.2 + a * 0.1), point("D", 3.3 + a * 0.2, 1.5 + a * 0.12), point("E", 4.8 + a * 0.15, 2.6 + a * 0.18), point("F", 3.5 + a * 0.1, 4 + a * 0.2)],
      [["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"], ["D", "F"]],
    );
    return Object.freeze({ motifId: `${family}-${variant}`, family, variant, graph: g });
  }
  if (family === "KITE_SPUR") {
    const g = graph(
      [point("A", 0, 1.8 + a * 0.1), point("B", 1.7 + a * 0.2, 0), point("C", 4 + a * 0.15, 1.3 + a * 0.12), point("D", 2.1 + a * 0.1, 3.5 + a * 0.22), point("E", 4.8 + a * 0.2, 3.9 + a * 0.1), point("F", 1 + a * 0.1, 4.6 + a * 0.12)],
      [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["D", "E"], ["D", "F"]],
    );
    return Object.freeze({ motifId: `${family}-${variant}`, family, variant, graph: g });
  }
  const g = graph(
    [point("A", 0, 0), point("B", 2.2 + a * 0.2, 0.3 + a * 0.05), point("C", 3.6 + a * 0.15, 1.8 + a * 0.2), point("D", 2.7 + a * 0.12, 3.8 + a * 0.18), point("E", 0.7 + a * 0.1, 3.1 + a * 0.12), point("F", 4.8 + a * 0.2, 4.4 + a * 0.08)],
    [["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"], ["E", "A"], ["B", "D"], ["D", "F"]],
  );
  return Object.freeze({ motifId: `${family}-${variant}`, family, variant, graph: g });
}

const MOTIF_FAMILIES = Object.freeze([
  "OPEN_ZIG",
  "STEP_BRANCH",
  "TRIANGLE_SPUR",
  "QUAD_TAIL",
  "FORK_CHAIN",
  "HOOK_CHEVRON",
  "KITE_SPUR",
  "ASYM_FRAME",
] as const);

export const EMBEDDED_FIGURE_MOTIFS_V1: readonly EmbeddedMotifV1[] = Object.freeze(
  MOTIF_FAMILIES.flatMap((family) => [0, 1, 2, 3].map((variant) => buildMotifFamily(family, variant))),
);

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
  shuffle<T>(values: readonly T[]): T[] {
    const copy = [...values];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = this.int(i + 1);
      [copy[i], copy[j]] = [copy[j]!, copy[i]!];
    }
    return copy;
  }
}

function trailingNumber(seed: string): number | null {
  const match = seed.match(/(\d+)$/);
  return match ? Number(match[1]) : null;
}

function balancedSlot(seed: string, modulo: number): number {
  const numeric = trailingNumber(seed);
  return numeric === null ? hash32(seed) % modulo : numeric % modulo;
}

function difficultyForSeed(seed: string): EmbeddedDifficultyV1 {
  return (["L1", "L2", "L3"] as const)[balancedSlot(seed, 3)]!;
}

function canonicalGraph(graphValue: EmbeddedGraphV1): string {
  const vertices = [...graphValue.vertices]
    .map((vertex) => `${vertex.id}:${vertex.x.toFixed(5)},${vertex.y.toFixed(5)}`)
    .sort();
  const edges = [...graphValue.edges]
    .map((edge) => edge.kind === "LINE"
      ? `${edge.id}:L:${[edge.a, edge.b].sort().join("-")}`
      : `${edge.id}:A:${edge.a}-${edge.b}:${edge.bulge.toFixed(5)}`)
    .sort();
  return `${vertices.join("|")}#${edges.join("|")}`;
}

function canonicalTargetShape(graphValue: EmbeddedGraphV1): string {
  const sortedVertices = [...graphValue.vertices].sort((a, b) => a.id.localeCompare(b.id));
  const minX = Math.min(...sortedVertices.map((vertex) => vertex.x));
  const minY = Math.min(...sortedVertices.map((vertex) => vertex.y));
  const maxX = Math.max(...sortedVertices.map((vertex) => vertex.x));
  const maxY = Math.max(...sortedVertices.map((vertex) => vertex.y));
  const extent = Math.max(maxX - minX, maxY - minY, 1);
  const vertices = sortedVertices.map((vertex) => `${vertex.id}:${((vertex.x - minX) / extent).toFixed(5)},${((vertex.y - minY) / extent).toFixed(5)}`);
  const edges = [...graphValue.edges].map((edge) => `${edge.kind}:${[edge.a, edge.b].sort().join("-")}`).sort();
  return `${vertices.join("|")}#${edges.join("|")}`;
}

type TransformSpecV1 = Readonly<{
  scaleX: number;
  scaleY: number;
  rotationDegrees: number;
  reflected: boolean;
  centerX: number;
  centerY: number;
  prefix: string;
}>;

function transformGraph(target: EmbeddedGraphV1, spec: TransformSpecV1): EmbeddedGraphV1 {
  const xs = target.vertices.map((vertex) => vertex.x);
  const ys = target.vertices.map((vertex) => vertex.y);
  const originX = (Math.min(...xs) + Math.max(...xs)) / 2;
  const originY = (Math.min(...ys) + Math.max(...ys)) / 2;
  const angle = spec.rotationDegrees * Math.PI / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const idMap = new Map<string, string>();
  const vertices = target.vertices.map((vertex, index) => {
    const id = `${spec.prefix}v${index}`;
    idMap.set(vertex.id, id);
    let x = vertex.x - originX;
    let y = vertex.y - originY;
    if (spec.reflected) x *= -1;
    x *= spec.scaleX;
    y *= spec.scaleY;
    const rx = x * cos - y * sin;
    const ry = x * sin + y * cos;
    return point(id, spec.centerX + rx, spec.centerY + ry);
  });
  const edges = target.edges.map((edge, index): EmbeddedEdgeV1 => {
    const a = idMap.get(edge.a)!;
    const b = idMap.get(edge.b)!;
    if (edge.kind === "LINE") return line(`${spec.prefix}e${index}`, a, b);
    const reflectedBulge = spec.reflected ? -edge.bulge : edge.bulge;
    return Object.freeze({ id: `${spec.prefix}e${index}`, a, b, kind: "ARC", bulge: reflectedBulge });
  });
  return Object.freeze({ vertices: Object.freeze(vertices), edges: Object.freeze(edges) });
}

function addNoise(base: EmbeddedGraphV1, rng: RngV1, edgeCount: number, prefix: string): EmbeddedGraphV1 {
  const vertices = [...base.vertices];
  const edges = [...base.edges];
  const baseIds = base.vertices.map((vertex) => vertex.id);
  for (let index = 0; index < edgeCount; index += 1) {
    const firstId = `${prefix}n${index}a`;
    const secondId = `${prefix}n${index}b`;
    let first = point(firstId, rng.range(8, 112), rng.range(8, 112));
    let second = point(secondId, rng.range(8, 112), rng.range(8, 112));
    if (Math.hypot(first.x - second.x, first.y - second.y) < 12) {
      second = point(secondId, Math.min(112, first.x + 18 + rng.range(0, 12)), Math.max(8, first.y - 15 - rng.range(0, 12)));
    }
    vertices.push(first, second);
    const anchorToTarget = index % 3 === 0 && baseIds.length > 0;
    const a = anchorToTarget ? rng.pick(baseIds) : firstId;
    const b = anchorToTarget ? secondId : secondId;
    edges.push(line(`${prefix}noise${index}`, a, b));
  }
  return Object.freeze({ vertices: Object.freeze(vertices), edges: Object.freeze(edges) });
}

function mutateMissingEdge(base: EmbeddedGraphV1, rng: RngV1): EmbeddedGraphV1 {
  const removeIndex = rng.int(base.edges.length);
  return Object.freeze({ vertices: base.vertices, edges: Object.freeze(base.edges.filter((_, index) => index !== removeIndex)) });
}

function mutateWrongIncidence(base: EmbeddedGraphV1, rng: RngV1): EmbeddedGraphV1 {
  const edges = [...base.edges];
  const index = rng.int(edges.length);
  const edge = edges[index]!;
  const candidates = base.vertices.map((vertex) => vertex.id).filter((id) => id !== edge.a && id !== edge.b);
  if (candidates.length === 0) return mutateMissingEdge(base, rng);
  const replacement = rng.pick(candidates);
  edges[index] = edge.kind === "LINE"
    ? line(edge.id, edge.a, replacement)
    : Object.freeze({ ...edge, b: replacement });
  return Object.freeze({ vertices: base.vertices, edges: Object.freeze(edges) });
}

function noiseCount(difficulty: EmbeddedDifficultyV1, rng: RngV1): number {
  if (difficulty === "L1") return 3 + rng.int(2);
  if (difficulty === "L2") return 6 + rng.int(3);
  return 9 + rng.int(4);
}

function buildCorrectHost(target: EmbeddedGraphV1, difficulty: EmbeddedDifficultyV1, rng: RngV1, prefix: string): { graph: EmbeddedGraphV1; scale: number } {
  const scale = difficulty === "L1" ? rng.range(8.5, 10) : difficulty === "L2" ? rng.range(9, 11.5) : rng.range(8, 12.5);
  const transformed = transformGraph(target, {
    scaleX: scale,
    scaleY: scale,
    rotationDegrees: 0,
    reflected: false,
    centerX: rng.range(50, 70),
    centerY: rng.range(50, 70),
    prefix,
  });
  return { graph: addNoise(transformed, rng, noiseCount(difficulty, rng), prefix), scale };
}

function buildDistractorHost(
  target: EmbeddedGraphV1,
  kind: EmbeddedDistractorKindV1,
  difficulty: EmbeddedDifficultyV1,
  rng: RngV1,
  prefix: string,
): EmbeddedGraphV1 {
  const scale = rng.range(8.2, 11.8);
  const centerX = rng.range(48, 72);
  const centerY = rng.range(48, 72);
  let transformed: EmbeddedGraphV1;
  if (kind === "ROTATION_TRAP") {
    transformed = transformGraph(target, { scaleX: scale, scaleY: scale, rotationDegrees: rng.pick([90, -90, 180]), reflected: false, centerX, centerY, prefix });
  } else if (kind === "REFLECTION_TRAP") {
    transformed = transformGraph(target, { scaleX: scale, scaleY: scale, rotationDegrees: 0, reflected: true, centerX, centerY, prefix });
  } else if (kind === "NON_UNIFORM_SCALE") {
    transformed = transformGraph(target, { scaleX: scale, scaleY: scale * rng.pick([0.68, 0.76, 1.28, 1.4]), rotationDegrees: 0, reflected: false, centerX, centerY, prefix });
  } else {
    transformed = transformGraph(target, { scaleX: scale, scaleY: scale, rotationDegrees: 0, reflected: false, centerX, centerY, prefix });
    transformed = kind === "MISSING_EDGE" ? mutateMissingEdge(transformed, rng) : mutateWrongIncidence(transformed, rng);
  }
  return addNoise(transformed, rng, noiseCount(difficulty, rng), prefix);
}

function graphBounds(graphValue: EmbeddedGraphV1): Readonly<{ minX: number; minY: number; maxX: number; maxY: number }> {
  return {
    minX: Math.min(...graphValue.vertices.map((vertex) => vertex.x)),
    minY: Math.min(...graphValue.vertices.map((vertex) => vertex.y)),
    maxX: Math.max(...graphValue.vertices.map((vertex) => vertex.x)),
    maxY: Math.max(...graphValue.vertices.map((vertex) => vertex.y)),
  };
}

function escapeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function renderEmbeddedGraphSvgV1(graphValue: EmbeddedGraphV1, mode: "TARGET" | "HOST"): string {
  const canvas = 120;
  let projected = graphValue;
  if (mode === "TARGET") {
    const bounds = graphBounds(graphValue);
    const width = Math.max(bounds.maxX - bounds.minX, 0.1);
    const height = Math.max(bounds.maxY - bounds.minY, 0.1);
    const scale = 86 / Math.max(width, height);
    projected = Object.freeze({
      vertices: Object.freeze(graphValue.vertices.map((vertex) => point(vertex.id, 60 + (vertex.x - (bounds.minX + bounds.maxX) / 2) * scale, 60 + (vertex.y - (bounds.minY + bounds.maxY) / 2) * scale))),
      edges: graphValue.edges,
    });
  }
  const byId = new Map(projected.vertices.map((vertex) => [vertex.id, vertex]));
  const parts: string[] = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas} ${canvas}" role="img" aria-label="${escapeXml(mode === "TARGET" ? "target embedded figure" : "option figure")}">`, `<rect width="120" height="120" fill="white"/>`, `<g fill="none" stroke="black" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">`];
  for (const edge of projected.edges) {
    const a = byId.get(edge.a)!;
    const b = byId.get(edge.b)!;
    if (edge.kind === "LINE") {
      parts.push(`<line x1="${a.x.toFixed(2)}" y1="${a.y.toFixed(2)}" x2="${b.x.toFixed(2)}" y2="${b.y.toFixed(2)}"/>`);
    } else {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const length = Math.max(Math.hypot(dx, dy), 0.001);
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      const controlX = midX - (dy / length) * edge.bulge * length;
      const controlY = midY + (dx / length) * edge.bulge * length;
      parts.push(`<path d="M ${a.x.toFixed(2)} ${a.y.toFixed(2)} Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${b.x.toFixed(2)} ${b.y.toFixed(2)}"/>`);
    }
  }
  parts.push("</g></svg>");
  return parts.join("");
}

const STEMS = Object.freeze([
  "Select the option figure in which the given figure is embedded. Rotation is not allowed.",
  "Which option contains the question figure as a part without rotating it?",
  "Find the option in which the target figure is hidden in the same orientation.",
  "The target may appear at a different size. Which option contains its exact structure without rotation?",
  "Choose the option that contains all the lines and connections of the given figure in the same orientation.",
  "In which option is the given figure concealed as an exact part? Do not rotate the target.",
  "Trace the given figure inside the options. Which option preserves its complete structure and orientation?",
  "Select the option where the question figure occurs exactly as shown; extra lines may be present, but rotation is not allowed.",
]);

function answerLabel(index: number): "A" | "B" | "C" | "D" {
  return (["A", "B", "C", "D"] as const)[index]!;
}

function distractorDescription(kind: EmbeddedDistractorKindV1): string {
  if (kind === "ROTATION_TRAP") return "a rotated copy";
  if (kind === "REFLECTION_TRAP") return "a mirror-reversed copy";
  if (kind === "MISSING_EDGE") return "a trace with a required segment missing";
  if (kind === "WRONG_INCIDENCE") return "a near-match with one connection joined to the wrong point";
  return "a stretched near-match whose proportions are not a uniform scale of the target";
}

function anchorDescription(target: EmbeddedGraphV1): string {
  const degree = new Map(target.vertices.map((vertex) => [vertex.id, 0]));
  for (const edge of target.edges) {
    degree.set(edge.a, (degree.get(edge.a) ?? 0) + 1);
    degree.set(edge.b, (degree.get(edge.b) ?? 0) + 1);
  }
  const ranked = [...degree.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const [id, count] = ranked[0]!;
  return count >= 3 ? `the junction where ${count} segments meet` : `the distinctive turn around point ${id}`;
}

function buildQuestion(seed: string, attempt: number): EmbeddedGeneratedQuestionV1 | null {
  const rng = new RngV1(`${seed}:attempt:${attempt}`);
  const difficulty = difficultyForSeed(seed);
  const motif = EMBEDDED_FIGURE_MOTIFS_V1[balancedSlot(`${seed}:motif`, EMBEDDED_FIGURE_MOTIFS_V1.length)]!;
  const target = motif.graph;
  const correctIndex = balancedSlot(seed, 4);
  const correct = buildCorrectHost(target, difficulty, rng, `c${attempt}_`);
  const distractorKinds = rng.shuffle(EMBEDDED_FIGURE_PRODUCTION_GENERATOR_AUTHORITY_V1.distractorKinds).slice(0, 3);
  const distractors = distractorKinds.map((kind, index) => buildDistractorHost(target, kind, difficulty, rng, `d${attempt}_${index}_`));
  const options: EmbeddedGraphV1[] = [];
  const kinds: (EmbeddedDistractorKindV1 | "CORRECT")[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push(correct.graph);
      kinds.push("CORRECT");
    } else {
      options.push(distractors[distractorIndex]!);
      kinds.push(distractorKinds[distractorIndex]!);
      distractorIndex += 1;
    }
  }

  if (!validateEmbeddedGraphV1(target).valid || !options.every((option) => validateEmbeddedGraphV1(option).valid)) return null;
  const solver = options.map((option) => matchEmbeddedGraphV1(target, option, "FIXED_ORIENTATION"));
  const matches = solver.map((result) => result.matched);
  if (matches.filter(Boolean).length !== 1 || !matches[correctIndex]) return null;
  const optionCanonicals = options.map(canonicalGraph);
  if (new Set(optionCanonicals).size !== 4) return null;

  const stemVariant = balancedSlot(`${seed}:stem`, STEMS.length);
  const answer = answerLabel(correctIndex);
  const targetFingerprint = `embt1-${fingerprint(canonicalTargetShape(target))}`;
  const contentFingerprint = `emb1-${fingerprint([seed, motif.motifId, stemVariant, correctIndex, canonicalGraph(target), ...optionCanonicals].join("||"))}`;
  const traps = kinds.filter((kind): kind is EmbeddedDistractorKindV1 => kind !== "CORRECT").map(distractorDescription);
  const explanation = Object.freeze({
    observation: `Start with ${anchorDescription(target)} and follow all ${target.edges.length} required segments from that anchor.`,
    rule: "The complete target must appear in the same orientation. Its size may change and extra lines in an option may cross or extend beyond it, but no target segment or connection may change.",
    application: `Option ${answer} preserves every required connection at one uniform scale. The other options use ${traps.join(", ")}.`,
    check: `Tracing the target edge by edge gives one exact match only: option ${answer}.`,
  });

  return Object.freeze({
    chapterCode: "EMB-001",
    proposalId: "EMB-PROP-01",
    qlStatus: "PROPOSED_NOT_PERMANENT",
    seed,
    generationAttempt: attempt,
    difficulty,
    motifId: motif.motifId,
    motifFamily: motif.family,
    motifVariant: motif.variant,
    equivalencePolicy: "FIXED_ORIENTATION",
    stemVariant,
    stem: STEMS[stemVariant]!,
    targetGraph: target,
    optionGraphs: Object.freeze(options),
    targetSvg: renderEmbeddedGraphSvgV1(target, "TARGET"),
    optionSvgs: Object.freeze(options.map((option) => renderEmbeddedGraphSvgV1(option, "HOST"))),
    correctIndex,
    answer,
    distractorKindsByIndex: Object.freeze(kinds),
    targetScaleInCorrectHost: correct.scale,
    contentFingerprint,
    targetFingerprint,
    explanation,
    validation: Object.freeze({
      valid: true,
      graphValid: true,
      exactlyOneEmbeddedOption: true,
      optionSemanticUniqueness: true,
      solverCorrectIndex: matches.findIndex(Boolean),
    }),
    lifecycle: Object.freeze({
      permanentQlAllocated: false,
      questionStudioRegistered: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    }),
  });
}

export function generateEmbeddedFigureQuestionV1(seed: string): EmbeddedGeneratedQuestionV1 {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const question = buildQuestion(seed, attempt);
    if (question) return question;
  }
  throw new Error(`EMB-001 generator exhausted deterministic retries for seed ${seed}.`);
}

export function generateEmbeddedFigureBatchV1(input: Readonly<{ seed: string; count: number }>): readonly EmbeddedGeneratedQuestionV1[] {
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 50) throw new Error("EMB-001 batch count must be an integer from 1 to 50.");
  const questions: EmbeddedGeneratedQuestionV1[] = [];
  const fingerprints = new Set<string>();
  for (let index = 0; index < input.count; index += 1) {
    let accepted: EmbeddedGeneratedQuestionV1 | null = null;
    for (let retry = 0; retry < 20; retry += 1) {
      const candidate = generateEmbeddedFigureQuestionV1(`${input.seed}:${index}:${retry}`);
      if (!fingerprints.has(candidate.contentFingerprint)) {
        accepted = candidate;
        break;
      }
    }
    if (!accepted) throw new Error(`EMB-001 batch could not produce unique item at index ${index}.`);
    fingerprints.add(accepted.contentFingerprint);
    questions.push(accepted);
  }
  return Object.freeze(questions);
}
