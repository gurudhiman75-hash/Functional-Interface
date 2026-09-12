import {
  matchEmbeddedGraphV1,
  type EmbeddedGraphV1,
} from "./embedded-figure-graph-v1";
import {
  renderEmbeddedGraphSvgV1,
} from "./embedded-figure-production-generator-v1";
import {
  generateEmbeddedFigureWholeOptionConnectivityQuestionV1,
} from "./embedded-figure-whole-option-connectivity-remediation-v1";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9 } from "./spatial-permanent-ql-allocation-v9";
import { SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1 } from "./spatial-final-held-gap-saturation-v1";

export type SpatialFinalHeldGapLanguageV1 = "en" | "hi" | "pa";
export type SpatialFinalHeldGapDifficultyV1 = "Easy" | "Medium" | "Hard";
export type SpatialFinalHeldGapQlIdV1 = "SPA-QL-048" | "SPA-QL-049" | "SPA-QL-050";
export type CurvedPrimitiveTargetV1 = "CIRCLE" | "SEMICIRCLE";

type ReviewLifecycleV1 = Readonly<{
  reviewOnly: true;
  permanentQlAllocated: true;
  learnerContentFrozen: false;
  questionStudioDiscoverable: false;
  persistenceAllowed: false;
  questionBankWritable: false;
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
}>;

export type SpatialFinalHeldGapNumericQuestionV1 = Readonly<{
  version: "SPA-FINAL-HELD-GAP-NUMERIC-QUESTION-V1";
  packageId: "SPA-001-FINAL-HELD-GAPS-REVIEW";
  qlId: "SPA-QL-048" | "SPA-QL-049";
  chapterCode: "FCT-001";
  qlName: string;
  language: SpatialFinalHeldGapLanguageV1;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  difficultyBand: SpatialFinalHeldGapDifficultyV1;
  seed: string;
  stem: string;
  stimulusSvgs: readonly [string];
  options: readonly [number, number, number, number];
  correctIndex: number;
  answer: number;
  explanation: Readonly<{
    rule: string;
    working: readonly string[];
    answerLine: string;
  }>;
  solveFacts: Readonly<Record<string, string | number | readonly number[]>>;
  geometryFingerprint: string;
  contentFingerprint: string;
  lifecycle: ReviewLifecycleV1;
}>;

export type SpatialFinalHeldGapEmbeddedQuestionV1 = Readonly<{
  version: "SPA-FINAL-HELD-GAP-EMBEDDED-QUESTION-V1";
  packageId: "SPA-001-FINAL-HELD-GAPS-REVIEW";
  qlId: "SPA-QL-050";
  chapterCode: "EMB-001";
  qlName: "Embedded figure identification with rotation allowed";
  language: SpatialFinalHeldGapLanguageV1;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  difficultyBand: SpatialFinalHeldGapDifficultyV1;
  seed: string;
  stem: string;
  stimulusSvgs: readonly [string];
  optionSvgs: readonly [string, string, string, string];
  correctIndex: number;
  answer: "A" | "B" | "C" | "D";
  explanation: Readonly<{
    rule: string;
    working: readonly string[];
    answerLine: string;
  }>;
  solveFacts: Readonly<{
    displayRotationDegrees: number;
    matchedRotationDegrees: number;
    reflectionUsed: false;
    fixedOrientationWouldMatchCorrectOption: false;
  }>;
  geometryFingerprint: string;
  contentFingerprint: string;
  lifecycle: ReviewLifecycleV1;
}>;

export type SpatialFinalHeldGapReviewQuestionV1 =
  | SpatialFinalHeldGapNumericQuestionV1
  | SpatialFinalHeldGapEmbeddedQuestionV1;

export const SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V1 = Object.freeze({
  authorityId: "SPA-FND-001-FINAL-HELD-GAP-REVIEW-RUNTIME-V1" as const,
  sourceAuditAuthorityId: SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.authorityId,
  allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.authorityId,
  qlIds: Object.freeze(["SPA-QL-048", "SPA-QL-049", "SPA-QL-050"] as const),
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  rendererPolicy: Object.freeze({
    background: "WHITE" as const,
    stroke: "#111827" as const,
    strokeWidth: 1.35,
    randomWholeFigureTilt: false,
    clippingAllowed: false,
  }),
  solvePolicies: Object.freeze({
    straightLineCounting: "COUNT_MAXIMAL_CONTINUOUS_STRAIGHT_LINES_NOT_INTERSECTION_SEGMENTS" as const,
    curvedPrimitiveCounting: "COUNT_COMPLETE_DRAWN_TARGET_PRIMITIVES_ONCE" as const,
    embeddedFigure: "ROTATION_ALLOWED_REFLECTION_DISALLOWED_EXACT_GRAPH_MATCH" as const,
  }),
  status: "REVIEW_RUNTIME_IMPLEMENTED_NOT_FROZEN" as const,
  lifecycle: Object.freeze({
    permanentQlAllocated: true,
    learnerContentFrozen: false,
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  }),
  nextGate: "SPA_FINAL_HELD_GAP_DIRECT_VISUAL_AND_EDITORIAL_REVIEW_V1" as const,
} as const);

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

function locale(language: SpatialFinalHeldGapLanguageV1): "en-IN" | "hi-IN" | "pa-IN" {
  return language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
}

function lifecycle(): ReviewLifecycleV1 {
  return Object.freeze({
    reviewOnly: true,
    permanentQlAllocated: true,
    learnerContentFrozen: false,
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  });
}

function numericOptions(correct: number, seed: string): readonly [number, number, number, number] {
  const candidates = [correct - 2, correct - 1, correct + 1, correct + 2, correct + 3]
    .filter((value) => value > 0 && value !== correct);
  const unique = [...new Set(candidates)].slice(0, 3);
  while (unique.length < 3) unique.push(correct + unique.length + 2);
  const values = [correct, ...unique] as number[];
  const shift = hash32(`${seed}:option-shift`) % 4;
  return Object.freeze(Array.from({ length: 4 }, (_, index) => values[(index + shift) % 4]!) as unknown as [number, number, number, number]);
}

function correctIndex(options: readonly number[], answer: number): number {
  const index = options.indexOf(answer);
  if (index < 0) throw new Error("Correct numeric answer is missing from options.");
  return index;
}

function difficultyForCount(count: number): SpatialFinalHeldGapDifficultyV1 {
  if (count <= 6) return "Easy";
  if (count <= 9) return "Medium";
  return "Hard";
}

type LinePrimitive = Readonly<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  group: "HORIZONTAL" | "VERTICAL" | "RISING_DIAGONAL" | "FALLING_DIAGONAL" | "RADIAL";
}>;

function canonicalLineSignature(line: LinePrimitive): string {
  const dx = line.x2 - line.x1;
  const dy = line.y2 - line.y1;
  const length = Math.hypot(dx, dy);
  if (length < 1e-8) throw new Error("Line primitive cannot have zero length.");
  let a = dy / length;
  let b = -dx / length;
  let c = -(a * line.x1 + b * line.y1);
  if (a < -1e-9 || (Math.abs(a) <= 1e-9 && b < 0)) {
    a *= -1;
    b *= -1;
    c *= -1;
  }
  return `${a.toFixed(6)}:${b.toFixed(6)}:${c.toFixed(6)}`;
}

function renderLines(lines: readonly LinePrimitive[]): string {
  const body = lines.map((line) =>
    `<line x1="${line.x1.toFixed(2)}" y1="${line.y1.toFixed(2)}" x2="${line.x2.toFixed(2)}" y2="${line.y2.toFixed(2)}"/>`,
  ).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" width="240" height="180"><rect width="240" height="180" fill="white"/><g fill="none" stroke="#111827" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
}

function buildLineScene(seed: string): Readonly<{ lines: readonly LinePrimitive[]; groups: Readonly<Record<string, number>>; motif: string }> {
  const h = hash32(`${seed}:line-scene`);
  const motif = h % 3;
  if (motif === 0) {
    const horizontal = 2 + (h % 4);
    const vertical = 2 + ((h >>> 4) % 4);
    const lines: LinePrimitive[] = [];
    for (let index = 0; index < horizontal; index += 1) {
      const y = 32 + index * (116 / Math.max(1, horizontal - 1));
      lines.push(Object.freeze({ x1: 30, y1: y, x2: 210, y2: y, group: "HORIZONTAL" }));
    }
    for (let index = 0; index < vertical; index += 1) {
      const x = 42 + index * (156 / Math.max(1, vertical - 1));
      lines.push(Object.freeze({ x1: x, y1: 20, x2: x, y2: 160, group: "VERTICAL" }));
    }
    return Object.freeze({ lines: Object.freeze(lines), groups: Object.freeze({ horizontal, vertical }), motif: "ORTHOGONAL_GRID" });
  }
  if (motif === 1) {
    const rising = 2 + (h % 4);
    const falling = 2 + ((h >>> 5) % 4);
    const lines: LinePrimitive[] = [];
    for (let index = 0; index < rising; index += 1) {
      const offset = index * 18;
      lines.push(Object.freeze({ x1: 28 + offset, y1: 150, x2: 136 + offset, y2: 30, group: "RISING_DIAGONAL" }));
    }
    for (let index = 0; index < falling; index += 1) {
      const offset = index * 18;
      lines.push(Object.freeze({ x1: 28 + offset, y1: 30, x2: 136 + offset, y2: 150, group: "FALLING_DIAGONAL" }));
    }
    return Object.freeze({ lines: Object.freeze(lines), groups: Object.freeze({ rising, falling }), motif: "CROSSHATCH" });
  }
  const radial = 5 + (h % 6);
  const cx = 120;
  const cy = 90;
  const radius = 72;
  const lines: LinePrimitive[] = [];
  for (let index = 0; index < radial; index += 1) {
    const angle = (Math.PI * index) / radial;
    lines.push(Object.freeze({
      x1: cx - Math.cos(angle) * radius,
      y1: cy - Math.sin(angle) * radius,
      x2: cx + Math.cos(angle) * radius,
      y2: cy + Math.sin(angle) * radius,
      group: "RADIAL",
    }));
  }
  return Object.freeze({ lines: Object.freeze(lines), groups: Object.freeze({ radial }), motif: "RADIAL_DIAMETERS" });
}

function lineSurface(language: SpatialFinalHeldGapLanguageV1, groups: Readonly<Record<string, number>>, count: number) {
  const entries = Object.entries(groups);
  if (language === "hi") {
    return {
      stem: "दी गई आकृति में कुल कितनी सीधी रेखाएँ हैं?",
      rule: "प्रतिच्छेदन बिंदुओं से बनी छोटी-छोटी खंडों को अलग रेखा न मानें; एक ही दिशा में लगातार चलने वाली पूरी सीधी रेखा को एक बार गिनें।",
      working: entries.map(([name, value]) => `${name}: ${value}`).concat(`कुल = ${entries.map(([, value]) => value).join(" + ")} = ${count}`),
      answerLine: `अतः सही उत्तर ${count} है।`,
    } as const;
  }
  if (language === "pa") {
    return {
      stem: "ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੀਆਂ ਸਿੱਧੀਆਂ ਰੇਖਾਵਾਂ ਹਨ?",
      rule: "ਕਟਾਉ ਬਿੰਦੂਆਂ ਨਾਲ ਬਣੇ ਛੋਟੇ ਟੁਕੜਿਆਂ ਨੂੰ ਵੱਖਰੀ ਰੇਖਾ ਨਾ ਗਿਣੋ; ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਲਗਾਤਾਰ ਚੱਲਦੀ ਪੂਰੀ ਸਿੱਧੀ ਰੇਖਾ ਨੂੰ ਇੱਕ ਵਾਰ ਗਿਣੋ।",
      working: entries.map(([name, value]) => `${name}: ${value}`).concat(`ਕੁੱਲ = ${entries.map(([, value]) => value).join(" + ")} = ${count}`),
      answerLine: `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${count} ਹੈ।`,
    } as const;
  }
  return {
    stem: "How many straight lines are there in the given figure?",
    rule: "Count each maximal continuous straight line once. Intersections divide a line visually, but they do not create extra straight lines.",
    working: entries.map(([name, value]) => `${name}: ${value}`).concat(`Total = ${entries.map(([, value]) => value).join(" + ")} = ${count}`),
    answerLine: `Therefore, the correct answer is ${count}.`,
  } as const;
}

export function generateStraightLineCountingReviewV1(input: Readonly<{ seed: string; language: SpatialFinalHeldGapLanguageV1 }>): SpatialFinalHeldGapNumericQuestionV1 {
  const scene = buildLineScene(input.seed);
  const signatures = new Set(scene.lines.map(canonicalLineSignature));
  if (signatures.size !== scene.lines.length) throw new Error(`QL048 duplicate geometric line detected for seed ${input.seed}.`);
  const answer = signatures.size;
  const options = numericOptions(answer, `${input.seed}:ql048`);
  const surface = lineSurface(input.language, scene.groups, answer);
  const geometryFingerprint = `spa048-${hashHex(scene.lines.map(canonicalLineSignature).sort().join("|"))}`;
  const contentFingerprint = `spa048c-${hashHex(`${geometryFingerprint}:${surface.stem}:${options.join(",")}`)}`;
  return Object.freeze({
    version: "SPA-FINAL-HELD-GAP-NUMERIC-QUESTION-V1",
    packageId: "SPA-001-FINAL-HELD-GAPS-REVIEW",
    qlId: "SPA-QL-048",
    chapterCode: "FCT-001",
    qlName: "Systematic counting of straight lines",
    language: input.language,
    locale: locale(input.language),
    difficultyBand: difficultyForCount(answer),
    seed: input.seed,
    stem: surface.stem,
    stimulusSvgs: Object.freeze([renderLines(scene.lines)]) as readonly [string],
    options,
    correctIndex: correctIndex(options, answer),
    answer,
    explanation: Object.freeze({ rule: surface.rule, working: Object.freeze([...surface.working]), answerLine: surface.answerLine }),
    solveFacts: Object.freeze({ motif: scene.motif, ...scene.groups, verifiedUniqueStraightLines: answer }),
    geometryFingerprint,
    contentFingerprint,
    lifecycle: lifecycle(),
  });
}

type CurvedPrimitive = Readonly<{
  kind: CurvedPrimitiveTargetV1;
  cx: number;
  cy: number;
  r: number;
  orientation?: "UP" | "DOWN" | "LEFT" | "RIGHT";
}>;

function buildCurvedScene(seed: string): Readonly<{ target: CurvedPrimitiveTargetV1; primitives: readonly CurvedPrimitive[]; motif: string }> {
  const h = hash32(`${seed}:curved-scene`);
  const target: CurvedPrimitiveTargetV1 = h % 2 === 0 ? "CIRCLE" : "SEMICIRCLE";
  const count = 5 + ((h >>> 3) % 7);
  const primitives: CurvedPrimitive[] = [];
  if (target === "CIRCLE") {
    if ((h >>> 8) % 2 === 0) {
      for (let index = 0; index < count; index += 1) {
        primitives.push(Object.freeze({ kind: "CIRCLE", cx: 120, cy: 90, r: 12 + index * (62 / Math.max(1, count - 1)) }));
      }
      return Object.freeze({ target, primitives: Object.freeze(primitives), motif: "CONCENTRIC_RINGS" });
    }
    const columns = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / columns);
    for (let index = 0; index < count; index += 1) {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const xStep = 150 / Math.max(1, columns - 1);
      const yStep = 104 / Math.max(1, rows - 1);
      primitives.push(Object.freeze({ kind: "CIRCLE", cx: 45 + col * xStep, cy: 38 + row * yStep, r: 15 }));
    }
    return Object.freeze({ target, primitives: Object.freeze(primitives), motif: "CIRCLE_ARRAY" });
  }
  const orientations = ["UP", "DOWN", "LEFT", "RIGHT"] as const;
  if ((h >>> 8) % 2 === 0) {
    for (let index = 0; index < count; index += 1) {
      primitives.push(Object.freeze({
        kind: "SEMICIRCLE",
        cx: 120,
        cy: 90,
        r: 14 + index * (58 / Math.max(1, count - 1)),
        orientation: index % 2 === 0 ? "UP" : "DOWN",
      }));
    }
    return Object.freeze({ target, primitives: Object.freeze(primitives), motif: "NESTED_SEMICIRCLES" });
  }
  const columns = Math.ceil(Math.sqrt(count));
  for (let index = 0; index < count; index += 1) {
    const col = index % columns;
    const row = Math.floor(index / columns);
    primitives.push(Object.freeze({
      kind: "SEMICIRCLE",
      cx: 42 + col * 52,
      cy: 44 + row * 55,
      r: 18,
      orientation: orientations[index % orientations.length],
    }));
  }
  return Object.freeze({ target, primitives: Object.freeze(primitives), motif: "SEMICIRCLE_ARRAY" });
}

function primitiveSignature(primitive: CurvedPrimitive): string {
  return `${primitive.kind}:${primitive.cx.toFixed(3)}:${primitive.cy.toFixed(3)}:${primitive.r.toFixed(3)}:${primitive.orientation ?? "FULL"}`;
}

function semicirclePath(p: CurvedPrimitive): string {
  const { cx, cy, r } = p;
  switch (p.orientation) {
    case "DOWN": return `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy} L ${cx - r} ${cy}`;
    case "LEFT": return `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} L ${cx} ${cy - r}`;
    case "RIGHT": return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} L ${cx} ${cy - r}`;
    case "UP":
    default: return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} L ${cx - r} ${cy}`;
  }
}

function renderCurved(primitives: readonly CurvedPrimitive[]): string {
  const body = primitives.map((primitive) => primitive.kind === "CIRCLE"
    ? `<circle cx="${primitive.cx.toFixed(2)}" cy="${primitive.cy.toFixed(2)}" r="${primitive.r.toFixed(2)}"/>`
    : `<path d="${semicirclePath(primitive)}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" width="240" height="180"><rect width="240" height="180" fill="white"/><g fill="none" stroke="#111827" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
}

function curvedSurface(language: SpatialFinalHeldGapLanguageV1, target: CurvedPrimitiveTargetV1, count: number) {
  const englishNoun = target === "CIRCLE" ? "circles" : "semicircles";
  if (language === "hi") {
    const noun = target === "CIRCLE" ? "वृत्त" : "अर्धवृत्त";
    return {
      stem: `दी गई आकृति में कुल कितने ${noun} हैं?`,
      rule: `हर पूर्ण बने हुए ${noun} को केवल एक बार गिनें। आकार या स्थिति बदलने से वह नया प्रकार नहीं बनता।`,
      working: [`आकृति को क्रम से देखकर ${noun} की संख्या = ${count}`],
      answerLine: `अतः सही उत्तर ${count} है।`,
    } as const;
  }
  if (language === "pa") {
    const noun = target === "CIRCLE" ? "ਵਰਤੁੱਲ" : "ਅਰਧ-ਵਰਤੁੱਲ";
    return {
      stem: `ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${noun} ਹਨ?`,
      rule: `ਹਰ ਪੂਰਾ ਬਣਿਆ ਹੋਇਆ ${noun} ਸਿਰਫ਼ ਇੱਕ ਵਾਰ ਗਿਣੋ। ਆਕਾਰ ਜਾਂ ਸਥਿਤੀ ਬਦਲਣ ਨਾਲ ਉਹ ਨਵਾਂ ਪ੍ਰਕਾਰ ਨਹੀਂ ਬਣਦਾ।`,
      working: [`ਆਕ੍ਰਿਤੀ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਦੇਖਣ ਤੇ ${noun} ਦੀ ਗਿਣਤੀ = ${count}`],
      answerLine: `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${count} ਹੈ।`,
    } as const;
  }
  return {
    stem: `How many ${englishNoun} are there in the given figure?`,
    rule: `Count each complete drawn ${target === "CIRCLE" ? "circle" : "semicircle"} once. Organize the figure by size or position so none is skipped or counted twice.`,
    working: [`Systematic count of complete ${englishNoun} = ${count}`],
    answerLine: `Therefore, the correct answer is ${count}.`,
  } as const;
}

export function generateCurvedPrimitiveCountingReviewV1(input: Readonly<{ seed: string; language: SpatialFinalHeldGapLanguageV1 }>): SpatialFinalHeldGapNumericQuestionV1 {
  const scene = buildCurvedScene(input.seed);
  const signatures = new Set(scene.primitives.map(primitiveSignature));
  if (signatures.size !== scene.primitives.length) throw new Error(`QL049 duplicate curved primitive detected for seed ${input.seed}.`);
  if (scene.primitives.some((primitive) => primitive.kind !== scene.target)) throw new Error(`QL049 target/scene mismatch for seed ${input.seed}.`);
  const answer = signatures.size;
  const options = numericOptions(answer, `${input.seed}:ql049`);
  const surface = curvedSurface(input.language, scene.target, answer);
  const geometryFingerprint = `spa049-${hashHex(scene.primitives.map(primitiveSignature).sort().join("|"))}`;
  const contentFingerprint = `spa049c-${hashHex(`${geometryFingerprint}:${surface.stem}:${options.join(",")}`)}`;
  return Object.freeze({
    version: "SPA-FINAL-HELD-GAP-NUMERIC-QUESTION-V1",
    packageId: "SPA-001-FINAL-HELD-GAPS-REVIEW",
    qlId: "SPA-QL-049",
    chapterCode: "FCT-001",
    qlName: "Systematic counting of circles and semicircles",
    language: input.language,
    locale: locale(input.language),
    difficultyBand: difficultyForCount(answer),
    seed: input.seed,
    stem: surface.stem,
    stimulusSvgs: Object.freeze([renderCurved(scene.primitives)]) as readonly [string],
    options,
    correctIndex: correctIndex(options, answer),
    answer,
    explanation: Object.freeze({ rule: surface.rule, working: Object.freeze([...surface.working]), answerLine: surface.answerLine }),
    solveFacts: Object.freeze({ motif: scene.motif, target: scene.target, verifiedPrimitiveCount: answer }),
    geometryFingerprint,
    contentFingerprint,
    lifecycle: lifecycle(),
  });
}

function rotateGraph(graph: EmbeddedGraphV1, degrees: number): EmbeddedGraphV1 {
  const radians = degrees * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const cx = graph.vertices.reduce((sum, vertex) => sum + vertex.x, 0) / graph.vertices.length;
  const cy = graph.vertices.reduce((sum, vertex) => sum + vertex.y, 0) / graph.vertices.length;
  return Object.freeze({
    vertices: Object.freeze(graph.vertices.map((vertex) => {
      const x = vertex.x - cx;
      const y = vertex.y - cy;
      return Object.freeze({ id: vertex.id, x: cx + x * cos - y * sin, y: cy + x * sin + y * cos });
    })),
    edges: graph.edges,
  });
}

function embeddedSurface(language: SpatialFinalHeldGapLanguageV1, rotation: number, matchedRotation: number, answer: "A" | "B" | "C" | "D") {
  if (language === "hi") {
    return {
      stem: "उस विकल्प को चुनिए जिसमें दी गई आकृति छिपी हुई है। आकृति को घुमाया जा सकता है, लेकिन दर्पण प्रतिबिंब स्वीकार्य नहीं है।",
      rule: "आकृति का आकार और जोड़ वही रहने चाहिए। उसे घुमाना मान्य है, लेकिन पलटना या दर्पण-प्रतिबिंब बनाना मान्य नहीं है।",
      working: [`दिए गए लक्ष्य को ${rotation}° घुमाकर विकल्पों से मिलाएँ।`, `सही विकल्प में वही जोड़ ${Math.abs(Math.round(matchedRotation))}° के घुमाव से मिलता है।`],
      answerLine: `अतः सही विकल्प ${answer} है।`,
    } as const;
  }
  if (language === "pa") {
    return {
      stem: "ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਲੁਕੀ ਹੋਈ ਹੈ। ਆਕ੍ਰਿਤੀ ਨੂੰ ਘੁਮਾਇਆ ਜਾ ਸਕਦਾ ਹੈ, ਪਰ ਦਰਪਣ-ਪ੍ਰਤੀਬਿੰਬ ਮਨਜ਼ੂਰ ਨਹੀਂ ਹੈ।",
      rule: "ਆਕ੍ਰਿਤੀ ਦੀ ਬਣਤਰ ਅਤੇ ਜੋੜ ਉਹੀ ਰਹਿਣੇ ਚਾਹੀਦੇ ਹਨ। ਘੁਮਾਉਣਾ ਮਨਜ਼ੂਰ ਹੈ, ਪਰ ਪਲਟਣਾ ਜਾਂ ਦਰਪਣ-ਪ੍ਰਤੀਬਿੰਬ ਬਣਾਉਣਾ ਮਨਜ਼ੂਰ ਨਹੀਂ ਹੈ।",
      working: [`ਦਿੱਤੇ ਲਕਸ਼ ਨੂੰ ${rotation}° ਘੁਮਾ ਕੇ ਵਿਕਲਪਾਂ ਨਾਲ ਮਿਲਾਓ।`, `ਸਹੀ ਵਿਕਲਪ ਵਿੱਚ ਉਹੀ ਜੋੜ ${Math.abs(Math.round(matchedRotation))}° ਦੇ ਘੁਮਾਅ ਨਾਲ ਮਿਲਦਾ ਹੈ।`],
      answerLine: `ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ ${answer} ਹੈ।`,
    } as const;
  }
  return {
    stem: "Select the option in which the given figure is embedded. Rotation is allowed, but reflection is not allowed.",
    rule: "The same connections and shape must be present. You may rotate the target, but you may not flip or mirror it.",
    working: [`Compare the target after a ${rotation}° display rotation.`, `The matching option contains the same connected subfigure under a ${Math.abs(Math.round(matchedRotation))}° rotation without reflection.`],
    answerLine: `Therefore, option ${answer} is correct.`,
  } as const;
}

export function generateRotationAllowedEmbeddedReviewV1(input: Readonly<{ seed: string; language: SpatialFinalHeldGapLanguageV1 }>): SpatialFinalHeldGapEmbeddedQuestionV1 {
  const angles = [45, 90, 135, 180, 225, 270, 315] as const;
  for (let retry = 0; retry < 60; retry += 1) {
    const sourceSeed = `${input.seed}:rot:${retry}`;
    const source = generateEmbeddedFigureWholeOptionConnectivityQuestionV1(sourceSeed);
    const displayRotationDegrees = angles[hash32(`${sourceSeed}:angle`) % angles.length]!;
    const targetGraph = rotateGraph(source.targetGraph, displayRotationDegrees);
    const results = source.optionGraphs.map((option) => matchEmbeddedGraphV1(targetGraph, option, "ROTATION_ALLOWED_REFLECTION_DISALLOWED"));
    const matched = results.map((result, index) => result.matched ? index : -1).filter((index) => index >= 0);
    if (matched.length !== 1 || matched[0] !== source.correctIndex) continue;
    const correctResult = results[source.correctIndex]!;
    if (!correctResult.matched || correctResult.reflected) continue;
    const fixed = matchEmbeddedGraphV1(targetGraph, source.optionGraphs[source.correctIndex]!, "FIXED_ORIENTATION");
    if (fixed.matched) continue;
    const answer = ["A", "B", "C", "D"][source.correctIndex] as "A" | "B" | "C" | "D";
    const surface = embeddedSurface(input.language, displayRotationDegrees, correctResult.rotationDegrees, answer);
    const geometryFingerprint = `spa050-${hashHex(`${source.geometryFingerprint}:${displayRotationDegrees}`)}`;
    const contentFingerprint = `spa050c-${hashHex(`${geometryFingerprint}:${surface.stem}:${source.correctIndex}`)}`;
    return Object.freeze({
      version: "SPA-FINAL-HELD-GAP-EMBEDDED-QUESTION-V1",
      packageId: "SPA-001-FINAL-HELD-GAPS-REVIEW",
      qlId: "SPA-QL-050",
      chapterCode: "EMB-001",
      qlName: "Embedded figure identification with rotation allowed",
      language: input.language,
      locale: locale(input.language),
      difficultyBand: source.difficulty === "L1" ? "Easy" : source.difficulty === "L3" ? "Hard" : "Medium",
      seed: input.seed,
      stem: surface.stem,
      stimulusSvgs: Object.freeze([renderEmbeddedGraphSvgV1(targetGraph, "TARGET")]) as readonly [string],
      optionSvgs: Object.freeze([...source.optionSvgs]) as unknown as readonly [string, string, string, string],
      correctIndex: source.correctIndex,
      answer,
      explanation: Object.freeze({ rule: surface.rule, working: Object.freeze([...surface.working]), answerLine: surface.answerLine }),
      solveFacts: Object.freeze({
        displayRotationDegrees,
        matchedRotationDegrees: correctResult.rotationDegrees,
        reflectionUsed: false,
        fixedOrientationWouldMatchCorrectOption: false,
      }),
      geometryFingerprint,
      contentFingerprint,
      lifecycle: lifecycle(),
    });
  }
  throw new Error(`QL050 rotation-allowed embedded generation exhausted deterministic retries for seed ${input.seed}.`);
}

export function generateSpatialFinalHeldGapReviewQuestionV1(input: Readonly<{
  qlId: SpatialFinalHeldGapQlIdV1;
  seed: string;
  language: SpatialFinalHeldGapLanguageV1;
}>): SpatialFinalHeldGapReviewQuestionV1 {
  if (!input.seed.trim()) throw new Error("Final Spatial held-gap review generation requires an explicit seed.");
  if (input.qlId === "SPA-QL-048") return generateStraightLineCountingReviewV1(input);
  if (input.qlId === "SPA-QL-049") return generateCurvedPrimitiveCountingReviewV1(input);
  return generateRotationAllowedEmbeddedReviewV1(input);
}

export function generateSpatialFinalHeldGapReviewBatchV1(input: Readonly<{
  qlId: SpatialFinalHeldGapQlIdV1;
  seed: string;
  language: SpatialFinalHeldGapLanguageV1;
  count: number;
}>): readonly SpatialFinalHeldGapReviewQuestionV1[] {
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 30) {
    throw new Error("Final Spatial held-gap review batch count must be an integer from 1 to 30.");
  }
  const output: SpatialFinalHeldGapReviewQuestionV1[] = [];
  const geometries = new Set<string>();
  for (let index = 0; index < input.count; index += 1) {
    let accepted: SpatialFinalHeldGapReviewQuestionV1 | null = null;
    for (let retry = 0; retry < 50; retry += 1) {
      const question = generateSpatialFinalHeldGapReviewQuestionV1({
        qlId: input.qlId,
        seed: `${input.seed}:${index}:${retry}`,
        language: input.language,
      });
      if (geometries.has(question.geometryFingerprint)) continue;
      geometries.add(question.geometryFingerprint);
      accepted = question;
      break;
    }
    if (!accepted) throw new Error(`${input.qlId}: unable to produce geometry-unique review item at index ${index}.`);
    output.push(accepted);
  }
  return Object.freeze(output);
}
