import {
  enumerateRectanglesV1,
  enumerateSquaresV1,
  enumerateTrianglesV1,
  type CountingFigureGraphV1,
} from "./counting-figures-graph-v1";
import { enumerateSimpleQuadrilateralsV2 } from "./counting-figures-graph-v2";
import { FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1 } from "./counting-figures-cp002-saturation-v1";

export type CountingFigureTargetShapeV1 = "TRIANGLE" | "SQUARE" | "RECTANGLE" | "QUADRILATERAL";
export type CountingFigureDifficultyV1 = "EASY" | "MEDIUM" | "HARD";
export type CountingFigureMotifFamilyV1 =
  | "TRIANGLE_FAN"
  | "CROSSED_QUADRILATERAL_TRIANGLES"
  | "SQUARE_GRID"
  | "ROTATED_SQUARE_GRID"
  | "RECTANGULAR_GRID_SQUARES"
  | "IRREGULAR_RECTANGLE_GRID"
  | "QUADRILATERAL_STRIP";

export type CountingFigureDistractorKindV1 =
  | "CORRECT"
  | "SMALLEST_ONLY"
  | "OMIT_LARGEST"
  | "MISS_COMPOSITE_CLASS"
  | "DOUBLE_COUNT_LARGEST"
  | "NEAR_MISS";

export type CountingFigureCandidateQuestionV1 = Readonly<{
  authority: typeof FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.authorityId;
  chapterCode: "FCT-001";
  candidateId: "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION";
  seed: string;
  targetShape: CountingFigureTargetShapeV1;
  motifFamily: CountingFigureMotifFamilyV1;
  structuralVariant: string;
  difficulty: CountingFigureDifficultyV1;
  stemVariant: number;
  stem: string;
  graph: CountingFigureGraphV1;
  svg: string;
  correctCount: number;
  constructionExpectedCount: number;
  options: readonly [number, number, number, number];
  correctIndex: number;
  optionEvidence: readonly Readonly<{ value: number; kind: CountingFigureDistractorKindV1 }>[];
  explanation: Readonly<{
    observation: string;
    rule: string;
    application: string;
    check: string;
  }>;
  geometryFingerprint: string;
  structuralFingerprint: string;
  contentFingerprint: string;
}>;

export const FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1 = Object.freeze({
  authorityId: "FCT-001-PRODUCTION-GENERATOR-V1" as const,
  chapterCode: "FCT-001" as const,
  status: "CP003_DETERMINISTIC_PRODUCTION_CANDIDATE" as const,
  candidateId: FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.retainedCandidate.candidateId,
  motifFamilies: [
    "TRIANGLE_FAN",
    "CROSSED_QUADRILATERAL_TRIANGLES",
    "SQUARE_GRID",
    "ROTATED_SQUARE_GRID",
    "RECTANGULAR_GRID_SQUARES",
    "IRREGULAR_RECTANGLE_GRID",
    "QUADRILATERAL_STRIP",
  ] as const,
  targetShapes: ["TRIANGLE", "SQUARE", "RECTANGLE", "QUADRILATERAL"] as const,
  stemVariantCount: 8,
  exactGraphSolverRequired: true,
  independentConstructionCountRequired: true,
  misconceptionOwnedDistractorsRequired: true,
  permanentQlAllocated: false,
  questionStudioDiscoverable: false,
  automaticStudentPublication: false,
});

const MASK_32 = 0xffffffff;

function hash32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function hashHex(input: string): string {
  return hash32(input).toString(16).padStart(8, "0");
}

function rngFor(seed: string): () => number {
  let state = hash32(seed) || 0x12345678;
  return () => {
    state = (state + 0x6d2b79f5) & MASK_32;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, values: readonly T[]): T {
  return values[Math.min(values.length - 1, Math.floor(rng() * values.length))]!;
}

function chooseInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function chooseAngle(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

function rotateGraph(graph: CountingFigureGraphV1, degrees: number): CountingFigureGraphV1 {
  if (Math.abs(degrees) < 1e-9) return graph;
  const radians = degrees * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const cx = graph.vertices.reduce((sum, vertex) => sum + vertex.x, 0) / graph.vertices.length;
  const cy = graph.vertices.reduce((sum, vertex) => sum + vertex.y, 0) / graph.vertices.length;
  return {
    vertices: graph.vertices.map((vertex) => {
      const x = vertex.x - cx;
      const y = vertex.y - cy;
      return {
        id: vertex.id,
        x: cx + x * cos - y * sin,
        y: cy + x * sin + y * cos,
      };
    }),
    edges: graph.edges,
  };
}

function completeGrid(
  xCoordinates: readonly number[],
  yCoordinates: readonly number[],
): CountingFigureGraphV1 {
  const vertices: { id: string; x: number; y: number }[] = [];
  const edges: { id: string; a: string; b: string; kind: "LINE" }[] = [];
  for (let y = 0; y < yCoordinates.length; y += 1) {
    for (let x = 0; x < xCoordinates.length; x += 1) {
      vertices.push({ id: `p${x}_${y}`, x: xCoordinates[x]!, y: yCoordinates[y]! });
    }
  }
  for (let y = 0; y < yCoordinates.length; y += 1) {
    for (let x = 0; x < xCoordinates.length - 1; x += 1) {
      edges.push({ id: `h${x}_${y}`, a: `p${x}_${y}`, b: `p${x + 1}_${y}`, kind: "LINE" });
    }
  }
  for (let x = 0; x < xCoordinates.length; x += 1) {
    for (let y = 0; y < yCoordinates.length - 1; y += 1) {
      edges.push({ id: `v${x}_${y}`, a: `p${x}_${y}`, b: `p${x}_${y + 1}`, kind: "LINE" });
    }
  }
  return { vertices, edges };
}

function triangleFan(segments: number, apexOffset: number, rotation: number): CountingFigureGraphV1 {
  const vertices: { id: string; x: number; y: number }[] = [];
  const edges: { id: string; a: string; b: string; kind: "LINE" }[] = [];
  for (let i = 0; i <= segments; i += 1) vertices.push({ id: `b${i}`, x: i * 20, y: 55 });
  vertices.push({ id: "a", x: segments * 10 + apexOffset, y: 0 });
  for (let i = 0; i < segments; i += 1) {
    edges.push({ id: `base${i}`, a: `b${i}`, b: `b${i + 1}`, kind: "LINE" });
  }
  for (let i = 0; i <= segments; i += 1) {
    edges.push({ id: `ray${i}`, a: "a", b: `b${i}`, kind: "LINE" });
  }
  return rotateGraph({ vertices, edges }, rotation);
}

function crossedQuadrilateral(rotation: number, skew: number): CountingFigureGraphV1 {
  const vertices = [
    { id: "A", x: 0, y: 0 },
    { id: "B", x: 70 + skew, y: 0 },
    { id: "C", x: 70, y: 70 },
    { id: "D", x: -skew, y: 70 },
    { id: "O", x: 35, y: 35 },
  ];
  const edges = [
    { id: "ab", a: "A", b: "B", kind: "LINE" as const },
    { id: "bc", a: "B", b: "C", kind: "LINE" as const },
    { id: "cd", a: "C", b: "D", kind: "LINE" as const },
    { id: "da", a: "D", b: "A", kind: "LINE" as const },
    { id: "ao", a: "A", b: "O", kind: "LINE" as const },
    { id: "oc", a: "O", b: "C", kind: "LINE" as const },
    { id: "bo", a: "B", b: "O", kind: "LINE" as const },
    { id: "od", a: "O", b: "D", kind: "LINE" as const },
  ];
  return rotateGraph({ vertices, edges }, rotation);
}

function squareGrid(columns: number, rows: number, rotation: number): CountingFigureGraphV1 {
  const xs = Array.from({ length: columns + 1 }, (_, index) => index * 18);
  const ys = Array.from({ length: rows + 1 }, (_, index) => index * 18);
  return rotateGraph(completeGrid(xs, ys), rotation);
}

function irregularRectangleGrid(columns: number, rows: number, rotation: number, jitter: number): CountingFigureGraphV1 {
  const xs = Array.from({ length: columns + 1 }, (_, index) => index * (18 + jitter));
  const ys = Array.from({ length: rows + 1 }, (_, index) => index * (11.3 + jitter * 0.17));
  return rotateGraph(completeGrid(xs, ys), rotation);
}

function quadrilateralStrip(cells: number, slant: number, rotation: number): CountingFigureGraphV1 {
  const vertices: { id: string; x: number; y: number }[] = [];
  const edges: { id: string; a: string; b: string; kind: "LINE" }[] = [];
  for (let i = 0; i <= cells; i += 1) {
    vertices.push({ id: `t${i}`, x: i * 18, y: 0 });
    vertices.push({ id: `b${i}`, x: i * 18 + slant, y: 45 });
  }
  for (let i = 0; i < cells; i += 1) {
    edges.push({ id: `top${i}`, a: `t${i}`, b: `t${i + 1}`, kind: "LINE" });
    edges.push({ id: `bottom${i}`, a: `b${i}`, b: `b${i + 1}`, kind: "LINE" });
  }
  for (let i = 0; i <= cells; i += 1) {
    edges.push({ id: `side${i}`, a: `t${i}`, b: `b${i}`, kind: "LINE" });
  }
  return rotateGraph({ vertices, edges }, rotation);
}

function choose2(value: number): number {
  return value * (value - 1) / 2;
}

function squareGridCount(columns: number, rows: number): number {
  let total = 0;
  for (let size = 1; size <= Math.min(columns, rows); size += 1) {
    total += (columns - size + 1) * (rows - size + 1);
  }
  return total;
}

function solverCount(targetShape: CountingFigureTargetShapeV1, graph: CountingFigureGraphV1): number {
  switch (targetShape) {
    case "TRIANGLE": return enumerateTrianglesV1(graph).length;
    case "SQUARE": return enumerateSquaresV1(graph).length;
    case "RECTANGLE": return enumerateRectanglesV1(graph, "INCLUDE_SQUARES").length;
    case "QUADRILATERAL": return enumerateSimpleQuadrilateralsV2(graph).length;
  }
}

function plural(targetShape: CountingFigureTargetShapeV1): string {
  switch (targetShape) {
    case "TRIANGLE": return "triangles";
    case "SQUARE": return "squares";
    case "RECTANGLE": return "rectangles";
    case "QUADRILATERAL": return "quadrilaterals";
  }
}

function stems(targetShape: CountingFigureTargetShapeV1): readonly string[] {
  const noun = plural(targetShape);
  return [
    `How many ${noun} are there in the given figure?`,
    `Count the total number of ${noun} in the figure.`,
    `Find the number of ${noun} present in the complete figure.`,
    `How many different ${noun} can be traced in this figure?`,
    `Count all the ${noun}, including larger ones formed from smaller parts.`,
    `What is the total number of ${noun} in the diagram?`,
    `Examine the figure carefully. How many ${noun} does it contain?`,
    `Select the total count of ${noun} present in the figure.`,
  ];
}

function difficultyFor(count: number): CountingFigureDifficultyV1 {
  if (count <= 8) return "EASY";
  if (count <= 14) return "MEDIUM";
  return "HARD";
}

function groupsForFan(segments: number): readonly number[] {
  return Array.from({ length: segments }, (_, index) => segments - index);
}

function groupsForSquareGrid(columns: number, rows: number): readonly number[] {
  return Array.from({ length: Math.min(columns, rows) }, (_, index) => {
    const size = index + 1;
    return (columns - size + 1) * (rows - size + 1);
  });
}

function groupsForRectangleGrid(columns: number, rows: number): readonly number[] {
  const groups: number[] = [];
  for (let width = 1; width <= columns; width += 1) {
    for (let height = 1; height <= rows; height += 1) {
      groups.push((columns - width + 1) * (rows - height + 1));
    }
  }
  return groups;
}

function groupsForStrip(cells: number): readonly number[] {
  return Array.from({ length: cells }, (_, index) => cells - index);
}

type BuiltMotif = Readonly<{
  targetShape: CountingFigureTargetShapeV1;
  motifFamily: CountingFigureMotifFamilyV1;
  structuralVariant: string;
  graph: CountingFigureGraphV1;
  constructionExpectedCount: number;
  groups: readonly number[];
}>;

function buildMotif(seed: string, targetShape: CountingFigureTargetShapeV1, rng: () => number): BuiltMotif {
  if (targetShape === "TRIANGLE") {
    const motif = pick(rng, ["FAN", "CROSS"] as const);
    if (motif === "CROSS") {
      const rotation = chooseAngle(rng, -18, 18);
      const skew = chooseAngle(rng, -5, 5);
      return {
        targetShape,
        motifFamily: "CROSSED_QUADRILATERAL_TRIANGLES",
        structuralVariant: "crossed-quad-x",
        graph: crossedQuadrilateral(rotation, skew),
        constructionExpectedCount: 8,
        groups: [4, 4],
      };
    }
    const segments = chooseInt(rng, 3, 6);
    const apexOffset = chooseAngle(rng, -7, 7);
    const rotation = chooseAngle(rng, -12, 12);
    return {
      targetShape,
      motifFamily: "TRIANGLE_FAN",
      structuralVariant: `fan-${segments}`,
      graph: triangleFan(segments, apexOffset, rotation),
      constructionExpectedCount: segments * (segments + 1) / 2,
      groups: groupsForFan(segments),
    };
  }

  if (targetShape === "SQUARE") {
    const motif = pick(rng, ["GRID", "ROTATED", "RECT_GRID"] as const);
    if (motif === "GRID") {
      const size = chooseInt(rng, 2, 4);
      return {
        targetShape,
        motifFamily: "SQUARE_GRID",
        structuralVariant: `square-grid-${size}x${size}`,
        graph: squareGrid(size, size, chooseAngle(rng, -4, 4)),
        constructionExpectedCount: squareGridCount(size, size),
        groups: groupsForSquareGrid(size, size),
      };
    }
    if (motif === "ROTATED") {
      const size = chooseInt(rng, 2, 4);
      return {
        targetShape,
        motifFamily: "ROTATED_SQUARE_GRID",
        structuralVariant: `rotated-square-grid-${size}x${size}`,
        graph: squareGrid(size, size, chooseAngle(rng, 22, 58)),
        constructionExpectedCount: squareGridCount(size, size),
        groups: groupsForSquareGrid(size, size),
      };
    }
    const [columns, rows] = pick(rng, [[2, 3], [2, 4], [3, 3], [3, 4]] as const);
    return {
      targetShape,
      motifFamily: "RECTANGULAR_GRID_SQUARES",
      structuralVariant: `rect-square-grid-${columns}x${rows}`,
      graph: squareGrid(columns, rows, chooseAngle(rng, -10, 10)),
      constructionExpectedCount: squareGridCount(columns, rows),
      groups: groupsForSquareGrid(columns, rows),
    };
  }

  if (targetShape === "RECTANGLE") {
    const [columns, rows] = pick(rng, [[1, 3], [1, 4], [2, 2], [2, 3]] as const);
    const jitter = chooseAngle(rng, 0.2, 2.2);
    return {
      targetShape,
      motifFamily: "IRREGULAR_RECTANGLE_GRID",
      structuralVariant: `irregular-rectangle-grid-${columns}x${rows}`,
      graph: irregularRectangleGrid(columns, rows, chooseAngle(rng, -13, 13), jitter),
      constructionExpectedCount: choose2(columns + 1) * choose2(rows + 1),
      groups: groupsForRectangleGrid(columns, rows),
    };
  }

  const cells = chooseInt(rng, 3, 6);
  const slant = chooseAngle(rng, 5, 14);
  return {
    targetShape,
    motifFamily: "QUADRILATERAL_STRIP",
    structuralVariant: `quadrilateral-strip-${cells}`,
    graph: quadrilateralStrip(cells, slant, chooseAngle(rng, -18, 18)),
    constructionExpectedCount: choose2(cells + 1),
    groups: groupsForStrip(cells),
  };
}

function normalizeGraphForSvg(graph: CountingFigureGraphV1): ReadonlyMap<string, Readonly<{ x: number; y: number }>> {
  const xs = graph.vertices.map((vertex) => vertex.x);
  const ys = graph.vertices.map((vertex) => vertex.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = Math.max(1e-6, maxX - minX);
  const height = Math.max(1e-6, maxY - minY);
  const scale = Math.min(96 / width, 96 / height);
  const offsetX = 60 - (minX + maxX) * scale / 2;
  const offsetY = 60 - (minY + maxY) * scale / 2;
  return new Map(graph.vertices.map((vertex) => [vertex.id, {
    x: vertex.x * scale + offsetX,
    y: vertex.y * scale + offsetY,
  }] as const));
}

export function renderCountingFigureSvgV1(graph: CountingFigureGraphV1): string {
  const points = normalizeGraphForSvg(graph);
  const lines = graph.edges.map((edge) => {
    const a = points.get(edge.a)!;
    const b = points.get(edge.b)!;
    return `<line x1="${a.x.toFixed(3)}" y1="${a.y.toFixed(3)}" x2="${b.x.toFixed(3)}" y2="${b.y.toFixed(3)}" />`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="Counting figures diagram"><rect width="120" height="120" fill="white"/><g fill="none" stroke="#111827" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${lines}</g></svg>`;
}

function graphFingerprint(graph: CountingFigureGraphV1): string {
  const vertices = [...graph.vertices]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((vertex) => `${vertex.id}:${vertex.x.toFixed(5)},${vertex.y.toFixed(5)}`)
    .join(";");
  const edges = [...graph.edges]
    .map((edge) => [edge.a, edge.b].sort().join("-"))
    .sort()
    .join(";");
  return `fctg-${hashHex(`${vertices}|${edges}`)}`;
}

function distractors(correct: number, groups: readonly number[]): readonly Readonly<{ value: number; kind: CountingFigureDistractorKindV1 }>[] {
  const smallestOnly = groups[0] ?? Math.max(1, correct - 2);
  const largestGroup = groups.at(-1) ?? 1;
  const halfIndex = Math.max(1, Math.ceil(groups.length / 2));
  const missComposite = groups.slice(0, halfIndex).reduce((sum, count) => sum + count, 0);
  const candidates: Readonly<{ value: number; kind: CountingFigureDistractorKindV1 }>[] = [
    { value: smallestOnly, kind: "SMALLEST_ONLY" },
    { value: correct - largestGroup, kind: "OMIT_LARGEST" },
    { value: missComposite, kind: "MISS_COMPOSITE_CLASS" },
    { value: correct + largestGroup, kind: "DOUBLE_COUNT_LARGEST" },
    { value: correct - 1, kind: "NEAR_MISS" },
    { value: correct + 1, kind: "NEAR_MISS" },
    { value: correct + 2, kind: "NEAR_MISS" },
  ];
  const seen = new Set<number>([correct]);
  const selected: Readonly<{ value: number; kind: CountingFigureDistractorKindV1 }>[] = [];
  for (const candidate of candidates) {
    if (candidate.value <= 0 || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    selected.push(candidate);
    if (selected.length === 3) break;
  }
  if (selected.length !== 3) throw new Error(`Unable to build three unique distractors for answer ${correct}.`);
  return selected;
}

function shuffleOptions(
  seed: string,
  correct: number,
  distractorEvidence: readonly Readonly<{ value: number; kind: CountingFigureDistractorKindV1 }>[],
): Readonly<{
  options: readonly [number, number, number, number];
  correctIndex: number;
  evidence: readonly Readonly<{ value: number; kind: CountingFigureDistractorKindV1 }>[];
}> {
  const rng = rngFor(`${seed}:options`);
  const entries = [{ value: correct, kind: "CORRECT" as const }, ...distractorEvidence];
  for (let i = entries.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [entries[i], entries[j]] = [entries[j]!, entries[i]!];
  }
  const options = entries.map((entry) => entry.value) as [number, number, number, number];
  return Object.freeze({
    options: Object.freeze(options),
    correctIndex: entries.findIndex((entry) => entry.kind === "CORRECT"),
    evidence: Object.freeze(entries.map((entry) => Object.freeze(entry))),
  });
}

function explanationFor(
  targetShape: CountingFigureTargetShapeV1,
  groups: readonly number[],
  correctCount: number,
  optionEvidence: readonly Readonly<{ value: number; kind: CountingFigureDistractorKindV1 }>[],
): CountingFigureCandidateQuestionV1["explanation"] {
  const noun = plural(targetShape);
  const terms = groups.filter((count) => count > 0);
  const breakdown = terms.join(" + ");
  const nearest = optionEvidence
    .filter((entry) => entry.kind !== "CORRECT")
    .sort((a, b) => Math.abs(a.value - correctCount) - Math.abs(b.value - correctCount))[0];
  return Object.freeze({
    observation: `We need the total number of ${noun}, not only the smallest visible ones.`,
    rule: `Count each distinct closed ${targetShape.toLowerCase()} once, then group the figures by increasing span or size.`,
    application: `The size/span groups contain ${breakdown} figures. Their total is ${correctCount}.`,
    check: nearest
      ? `The nearby option ${nearest.value} comes from an incomplete or repeated count (${nearest.kind.toLowerCase().replaceAll("_", " ")}). The complete count is ${correctCount}.`
      : `Rechecking every size class gives ${correctCount}.`,
  });
}

export function generateCountingFigureCandidateV1(input: Readonly<{
  seed: string;
  targetShape?: CountingFigureTargetShapeV1;
}>): CountingFigureCandidateQuestionV1 {
  if (!input.seed.trim()) throw new Error("FCT seed must be non-empty.");
  const rng = rngFor(input.seed);
  const targetShape = input.targetShape ?? pick(rng, FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.targetShapes);
  const built = buildMotif(input.seed, targetShape, rng);
  const exactCount = solverCount(targetShape, built.graph);
  if (exactCount !== built.constructionExpectedCount) {
    throw new Error(
      `${built.motifFamily} construction count ${built.constructionExpectedCount} disagrees with exact graph solver ${exactCount}.`,
    );
  }
  const distractorEvidence = distractors(exactCount, built.groups);
  const optionSet = shuffleOptions(input.seed, exactCount, distractorEvidence);
  const stemVariant = Math.floor(rng() * FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.stemVariantCount);
  const stem = stems(targetShape)[stemVariant]!;
  const geometryFingerprint = graphFingerprint(built.graph);
  const structuralFingerprint = `fcts-${hashHex(`${targetShape}|${built.motifFamily}|${built.structuralVariant}`)}`;
  const contentFingerprint = `fctc-${hashHex(`${stem}|${targetShape}|${geometryFingerprint}|${optionSet.options.join(",")}`)}`;
  return Object.freeze({
    authority: FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.authorityId,
    chapterCode: "FCT-001",
    candidateId: "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION",
    seed: input.seed,
    targetShape,
    motifFamily: built.motifFamily,
    structuralVariant: built.structuralVariant,
    difficulty: difficultyFor(exactCount),
    stemVariant,
    stem,
    graph: built.graph,
    svg: renderCountingFigureSvgV1(built.graph),
    correctCount: exactCount,
    constructionExpectedCount: built.constructionExpectedCount,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    optionEvidence: optionSet.evidence,
    explanation: explanationFor(targetShape, built.groups, exactCount, optionSet.evidence),
    geometryFingerprint,
    structuralFingerprint,
    contentFingerprint,
  });
}

export function generateCountingFigureCandidateBatchV1(input: Readonly<{
  seed: string;
  count: number;
  targetShape?: CountingFigureTargetShapeV1;
}>): readonly CountingFigureCandidateQuestionV1[] {
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 50) {
    throw new Error("FCT candidate batch count must be an integer from 1 to 50.");
  }
  const questions = Array.from({ length: input.count }, (_, index) =>
    generateCountingFigureCandidateV1({
      seed: `${input.seed}:${index}`,
      targetShape: input.targetShape,
    }),
  );
  if (new Set(questions.map((question) => question.contentFingerprint)).size !== questions.length) {
    throw new Error("FCT candidate batch produced duplicate content fingerprints.");
  }
  return Object.freeze(questions);
}
