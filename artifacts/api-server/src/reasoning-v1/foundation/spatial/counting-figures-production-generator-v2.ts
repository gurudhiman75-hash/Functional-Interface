import {
  enumerateRectanglesV1,
  enumerateSquaresV1,
  enumerateTrianglesV1,
  type CountingFigureGraphV1,
} from "./counting-figures-graph-v1";
import { enumerateSimpleQuadrilateralsV2 } from "./counting-figures-graph-v2";
import {
  FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1,
  generateCountingFigureCandidateV1,
  renderCountingFigureSvgV1,
  type CountingFigureCandidateQuestionV1,
  type CountingFigureDifficultyV1,
  type CountingFigureDistractorKindV1,
  type CountingFigureMotifFamilyV1,
  type CountingFigureTargetShapeV1,
} from "./counting-figures-production-generator-v1";

export type CountingFigureMotifFamilyV2 = CountingFigureMotifFamilyV1
  | "DOUBLE_TRIANGLE_FAN"
  | "DIAGONAL_SQUARE_GRID"
  | "DIAGONAL_RECTANGLE_GRID"
  | "QUADRILATERAL_LATTICE";

export const FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2 = Object.freeze({
  authorityId: "FCT-001-PRODUCTION-GENERATOR-V2-REALISM-REMEDIATED" as const,
  baseAuthorityId: FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.authorityId,
  chapterCode: "FCT-001" as const,
  status: "CP004_REALISM_REMEDIATED_PRODUCTION_CANDIDATE" as const,
  targetShapes: FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.targetShapes,
  legacyMotifFamilies: FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V1.motifFamilies,
  realismRemediationFamilies: [
    "DOUBLE_TRIANGLE_FAN",
    "DIAGONAL_SQUARE_GRID",
    "DIAGONAL_RECTANGLE_GRID",
    "QUADRILATERAL_LATTICE",
  ] as const,
  motifFamilyCount: 11,
  stemVariantCount: 8,
  exactGraphSolverRequired: true,
  independentConstructionCountRequired: true,
  triangleRotationHeldForNumericalStability: true,
  permanentQlAllocated: false,
  questionStudioDiscoverable: false,
  automaticStudentPublication: false,
});

export type CountingFigureCandidateQuestionV2 = Readonly<
  Omit<CountingFigureCandidateQuestionV1, "authority" | "motifFamily"> & {
    authority: typeof FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2.authorityId;
    motifFamily: CountingFigureMotifFamilyV2;
  }
>;

const MASK_32 = 0xffffffff;

function hash32(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
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

function chooseInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function chooseFloat(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

function pick<T>(rng: () => number, values: readonly T[]): T {
  return values[Math.min(values.length - 1, Math.floor(rng() * values.length))]!;
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
  columns: number,
  rows: number,
  stepX: number,
  stepY: number,
): CountingFigureGraphV1 {
  const vertices: { id: string; x: number; y: number }[] = [];
  const edges: { id: string; a: string; b: string; kind: "LINE" }[] = [];
  for (let y = 0; y <= rows; y += 1) {
    for (let x = 0; x <= columns; x += 1) {
      vertices.push({ id: `p${x}_${y}`, x: x * stepX, y: y * stepY });
    }
  }
  for (let y = 0; y <= rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      edges.push({ id: `h${x}_${y}`, a: `p${x}_${y}`, b: `p${x + 1}_${y}`, kind: "LINE" });
    }
  }
  for (let x = 0; x <= columns; x += 1) {
    for (let y = 0; y < rows; y += 1) {
      edges.push({ id: `v${x}_${y}`, a: `p${x}_${y}`, b: `p${x}_${y + 1}`, kind: "LINE" });
    }
  }
  return { vertices, edges };
}

function addParallelDiagonals(
  graph: CountingFigureGraphV1,
  columns: number,
  rows: number,
  selectorParity: 0 | 1,
): CountingFigureGraphV1 {
  const edges = [...graph.edges];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      if ((x + y) % 2 !== selectorParity) continue;
      edges.push({
        id: `diag${x}_${y}`,
        a: `p${x}_${y}`,
        b: `p${x + 1}_${y + 1}`,
        kind: "LINE" as const,
      });
    }
  }
  return { vertices: graph.vertices, edges };
}

function doubleTriangleFan(
  segments: number,
  topOffset: number,
  bottomOffset: number,
): CountingFigureGraphV1 {
  const vertices: { id: string; x: number; y: number }[] = [];
  const edges: { id: string; a: string; b: string; kind: "LINE" }[] = [];
  for (let index = 0; index <= segments; index += 1) {
    vertices.push({ id: `b${index}`, x: index * 20, y: 50 });
  }
  const centerX = segments * 10;
  vertices.push({ id: "top", x: centerX + topOffset, y: 0 });
  vertices.push({ id: "bottom", x: centerX + bottomOffset, y: 100 });
  for (let index = 0; index < segments; index += 1) {
    edges.push({ id: `base${index}`, a: `b${index}`, b: `b${index + 1}`, kind: "LINE" });
  }
  for (let index = 0; index <= segments; index += 1) {
    edges.push({ id: `topRay${index}`, a: "top", b: `b${index}`, kind: "LINE" });
    edges.push({ id: `bottomRay${index}`, a: "bottom", b: `b${index}`, kind: "LINE" });
  }
  return { vertices, edges };
}

function quadrilateralLattice(cells: number, slant: number, rotation: number): CountingFigureGraphV1 {
  const rows = 2;
  const vertices: { id: string; x: number; y: number }[] = [];
  const edges: { id: string; a: string; b: string; kind: "LINE" }[] = [];
  for (let row = 0; row <= rows; row += 1) {
    for (let column = 0; column <= cells; column += 1) {
      vertices.push({
        id: `p${column}_${row}`,
        x: column * 20 + row * slant,
        y: row * 28,
      });
    }
  }
  for (let row = 0; row <= rows; row += 1) {
    for (let column = 0; column < cells; column += 1) {
      edges.push({ id: `rail${column}_${row}`, a: `p${column}_${row}`, b: `p${column + 1}_${row}`, kind: "LINE" });
    }
  }
  for (let column = 0; column <= cells; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      edges.push({ id: `column${column}_${row}`, a: `p${column}_${row}`, b: `p${column}_${row + 1}`, kind: "LINE" });
    }
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

function squareGroups(columns: number, rows: number): readonly number[] {
  return Array.from({ length: Math.min(columns, rows) }, (_, index) => {
    const size = index + 1;
    return (columns - size + 1) * (rows - size + 1);
  });
}

function rectangleGroups(columns: number, rows: number): readonly number[] {
  const groups: number[] = [];
  for (let width = 1; width <= columns; width += 1) {
    for (let height = 1; height <= rows; height += 1) {
      groups.push((columns - width + 1) * (rows - height + 1));
    }
  }
  return groups;
}

function solverCount(targetShape: CountingFigureTargetShapeV1, graph: CountingFigureGraphV1): number {
  switch (targetShape) {
    case "TRIANGLE": return enumerateTrianglesV1(graph).length;
    case "SQUARE": return enumerateSquaresV1(graph).length;
    case "RECTANGLE": return enumerateRectanglesV1(graph, "INCLUDE_SQUARES").length;
    case "QUADRILATERAL": return enumerateSimpleQuadrilateralsV2(graph).length;
  }
}

function difficultyFor(count: number): CountingFigureDifficultyV1 {
  if (count <= 8) return "EASY";
  if (count <= 14) return "MEDIUM";
  return "HARD";
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

function graphFingerprint(graph: CountingFigureGraphV1): string {
  const vertices = [...graph.vertices]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((vertex) => `${vertex.id}:${vertex.x.toFixed(5)},${vertex.y.toFixed(5)}`)
    .join(";");
  const edges = [...graph.edges]
    .map((edge) => [edge.a, edge.b].sort().join("-"))
    .sort()
    .join(";");
  return `fctg2-${hashHex(`${vertices}|${edges}`)}`;
}

function distractors(correct: number, groups: readonly number[]): readonly Readonly<{ value: number; kind: CountingFigureDistractorKindV1 }>[] {
  const smallestOnly = groups[0] ?? Math.max(1, correct - 2);
  const largestGroup = groups.at(-1) ?? 1;
  const midpoint = Math.max(1, Math.ceil(groups.length / 2));
  const missComposite = groups.slice(0, midpoint).reduce((sum, count) => sum + count, 0);
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
  if (selected.length !== 3) throw new Error(`Unable to build V2 FCT distractors for ${correct}.`);
  return selected;
}

function shuffledOptions(
  seed: string,
  correct: number,
  distractorEvidence: readonly Readonly<{ value: number; kind: CountingFigureDistractorKindV1 }>[],
): Readonly<{
  options: readonly [number, number, number, number];
  correctIndex: number;
  evidence: readonly Readonly<{ value: number; kind: CountingFigureDistractorKindV1 }>[];
}> {
  const rng = rngFor(`${seed}:v2-options`);
  const entries = [{ value: correct, kind: "CORRECT" as const }, ...distractorEvidence];
  for (let index = entries.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(rng() * (index + 1));
    [entries[index], entries[swapWith]] = [entries[swapWith]!, entries[index]!];
  }
  return Object.freeze({
    options: Object.freeze(entries.map((entry) => entry.value) as [number, number, number, number]),
    correctIndex: entries.findIndex((entry) => entry.kind === "CORRECT"),
    evidence: Object.freeze(entries.map((entry) => Object.freeze(entry))),
  });
}

type EnhancedMotif = Readonly<{
  motifFamily: Exclude<CountingFigureMotifFamilyV2, CountingFigureMotifFamilyV1>;
  structuralVariant: string;
  graph: CountingFigureGraphV1;
  constructionExpectedCount: number;
  groups: readonly number[];
}>;

function buildEnhancedMotif(
  seed: string,
  targetShape: CountingFigureTargetShapeV1,
): EnhancedMotif {
  const rng = rngFor(`${seed}:enhanced`);
  if (targetShape === "TRIANGLE") {
    const segments = chooseInt(rng, 3, 5);
    const graph = doubleTriangleFan(
      segments,
      chooseFloat(rng, -7, 7),
      chooseFloat(rng, -7, 7),
    );
    return {
      motifFamily: "DOUBLE_TRIANGLE_FAN",
      structuralVariant: `double-fan-${segments}`,
      graph,
      constructionExpectedCount: segments * (segments + 1),
      groups: Array.from({ length: segments }, (_, index) => 2 * (segments - index)),
    };
  }
  if (targetShape === "SQUARE") {
    const size = chooseInt(rng, 2, 4);
    const base = completeGrid(size, size, 18, 18);
    const graph = rotateGraph(addParallelDiagonals(base, size, size, (hash32(seed) % 2) as 0 | 1), chooseFloat(rng, -24, 24));
    return {
      motifFamily: "DIAGONAL_SQUARE_GRID",
      structuralVariant: `diagonal-square-grid-${size}x${size}`,
      graph,
      constructionExpectedCount: squareGridCount(size, size),
      groups: squareGroups(size, size),
    };
  }
  if (targetShape === "RECTANGLE") {
    const [columns, rows] = pick(rng, [[2, 2], [2, 3], [3, 2]] as const);
    const base = completeGrid(columns, rows, 21, 13 + chooseFloat(rng, 0.2, 1.8));
    const graph = rotateGraph(addParallelDiagonals(base, columns, rows, (hash32(seed) % 2) as 0 | 1), chooseFloat(rng, -12, 12));
    return {
      motifFamily: "DIAGONAL_RECTANGLE_GRID",
      structuralVariant: `diagonal-rectangle-grid-${columns}x${rows}`,
      graph,
      constructionExpectedCount: choose2(columns + 1) * choose2(rows + 1),
      groups: rectangleGroups(columns, rows),
    };
  }
  const cells = chooseInt(rng, 2, 4);
  const graph = quadrilateralLattice(cells, chooseFloat(rng, 3.5, 8.5), chooseFloat(rng, -14, 14));
  return {
    motifFamily: "QUADRILATERAL_LATTICE",
    structuralVariant: `quadrilateral-lattice-${cells}x2`,
    graph,
    constructionExpectedCount: 3 * choose2(cells + 1),
    groups: Array.from({ length: cells }, (_, index) => 3 * (cells - index)),
  };
}

function enhancedQuestion(
  seed: string,
  targetShape: CountingFigureTargetShapeV1,
): CountingFigureCandidateQuestionV2 {
  const built = buildEnhancedMotif(seed, targetShape);
  const correctCount = solverCount(targetShape, built.graph);
  if (correctCount !== built.constructionExpectedCount) {
    throw new Error(
      `${built.motifFamily} construction count ${built.constructionExpectedCount} disagrees with exact solver ${correctCount}.`,
    );
  }
  const optionSet = shuffledOptions(seed, correctCount, distractors(correctCount, built.groups));
  const rng = rngFor(`${seed}:v2-stem`);
  const stemVariant = Math.floor(rng() * 8);
  const stem = stems(targetShape)[stemVariant]!;
  const geometryFingerprint = graphFingerprint(built.graph);
  const structuralFingerprint = `fcts2-${hashHex(`${targetShape}|${built.motifFamily}|${built.structuralVariant}`)}`;
  const contentFingerprint = `fctc2-${hashHex(`${stem}|${geometryFingerprint}|${optionSet.options.join(",")}`)}`;
  const noun = plural(targetShape);
  const breakdown = built.groups.join(" + ");
  const nearest = optionSet.evidence
    .filter((entry) => entry.kind !== "CORRECT")
    .sort((a, b) => Math.abs(a.value - correctCount) - Math.abs(b.value - correctCount))[0];
  return Object.freeze({
    authority: FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2.authorityId,
    chapterCode: "FCT-001",
    candidateId: "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION",
    seed,
    targetShape,
    motifFamily: built.motifFamily,
    structuralVariant: built.structuralVariant,
    difficulty: difficultyFor(correctCount),
    stemVariant,
    stem,
    graph: built.graph,
    svg: renderCountingFigureSvgV1(built.graph),
    correctCount,
    constructionExpectedCount: built.constructionExpectedCount,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    optionEvidence: optionSet.evidence,
    explanation: Object.freeze({
      observation: `The figure contains ${noun} of more than one span, so counting only the smallest parts will miss valid larger figures.`,
      rule: `Count the ${noun} systematically from smaller spans to larger spans, recording each closed figure once.`,
      application: `The successive span groups contribute ${breakdown}. Therefore the total is ${correctCount}.`,
      check: nearest
        ? `Option ${nearest.value} reflects a ${nearest.kind.toLowerCase().replaceAll("_", " ")} count. Rechecking every span gives ${correctCount}.`
        : `A second pass through all spans again gives ${correctCount}.`,
    }),
    geometryFingerprint,
    structuralFingerprint,
    contentFingerprint,
  });
}

export function generateCountingFigureCandidateV2(input: Readonly<{
  seed: string;
  targetShape?: CountingFigureTargetShapeV1;
}>): CountingFigureCandidateQuestionV2 {
  if (!input.seed.trim()) throw new Error("FCT V2 seed must be non-empty.");
  const selectionRng = rngFor(`${input.seed}:v2-family`);
  const targetShape = input.targetShape ?? pick(selectionRng, FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2.targetShapes);
  const useEnhanced = selectionRng() < 0.56;
  if (useEnhanced) return enhancedQuestion(input.seed, targetShape);
  const legacy = generateCountingFigureCandidateV1({ seed: input.seed, targetShape });
  return Object.freeze({
    ...legacy,
    authority: FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2.authorityId,
    motifFamily: legacy.motifFamily,
  });
}

export function generateCountingFigureCandidateBatchV2(input: Readonly<{
  seed: string;
  count: number;
  targetShape?: CountingFigureTargetShapeV1;
}>): readonly CountingFigureCandidateQuestionV2[] {
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 50) {
    throw new Error("FCT V2 batch count must be an integer from 1 to 50.");
  }
  const questions = Array.from({ length: input.count }, (_, index) => generateCountingFigureCandidateV2({
    seed: `${input.seed}:${index}`,
    targetShape: input.targetShape,
  }));
  if (new Set(questions.map((question) => question.contentFingerprint)).size !== questions.length) {
    throw new Error("FCT V2 batch produced duplicate content fingerprints.");
  }
  return Object.freeze(questions);
}
