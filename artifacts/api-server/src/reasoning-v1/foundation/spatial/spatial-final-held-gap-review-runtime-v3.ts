import {
  generateSpatialFinalHeldGapReviewQuestionV2,
  SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V2,
} from "./spatial-final-held-gap-review-runtime-v2";
import type {
  SpatialFinalHeldGapEmbeddedQuestionV1,
  SpatialFinalHeldGapLanguageV1,
  SpatialFinalHeldGapQlIdV1,
  SpatialFinalHeldGapDifficultyV1,
  SpatialFinalHeldGapNumericQuestionV1,
} from "./spatial-final-held-gap-review-runtime-v1";

export type SpatialFinalHeldGapNumericQuestionV3 = Omit<SpatialFinalHeldGapNumericQuestionV1, "version"> & Readonly<{
  version: "SPA-FINAL-HELD-GAP-NUMERIC-QUESTION-V3";
}>;

export type SpatialFinalHeldGapReviewQuestionV3 =
  | SpatialFinalHeldGapNumericQuestionV3
  | SpatialFinalHeldGapEmbeddedQuestionV1;

export const SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3 = Object.freeze({
  ...SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V2,
  authorityId: "SPA-FND-001-FINAL-HELD-GAP-REVIEW-RUNTIME-V3-EXAM-REAL-COMPOSITES" as const,
  supersedesAuthorityId: SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V2.authorityId,
  status: "REVIEW_RUNTIME_V3_EXAM_REAL_COMPOSITES_IMPLEMENTED_NOT_FROZEN" as const,
  countingFigurePolicy: Object.freeze({
    straightLineMotifs: Object.freeze([
      "HEXAGRAM_OVERLAP",
      "PENTAGRAM",
      "TRIANGLE_MEDIANS",
      "DIAMOND_CROSS",
      "SQUARE_DIAGONAL_AXIS",
      "DOUBLE_TRIANGLE_AXIS",
    ] as const),
    curvedPrimitiveMotifs: Object.freeze([
      "CIRCLE_FLOWER_CLUSTER",
      "CIRCLE_CONCENTRIC_SATELLITES",
      "CIRCLE_INTERSECTING_CHAIN",
      "CIRCLE_NESTED_QUADS",
      "SEMICIRCLE_SCALLOP_CHAIN",
      "SEMICIRCLE_NESTED_ARCHES",
      "SEMICIRCLE_OPPOSED_FANS",
      "SEMICIRCLE_BRIDGE_ROW",
    ] as const),
    intersectionsDoNotSplitStraightLines: true,
    primitiveOverlapsDoNotCreateExtraCircles: true,
    freeWholeFigureRotation: false,
    toyGridOnlyMotifsSuppressed: true,
    plainPrimitiveArrayOnlyMotifsSuppressed: true,
  }),
  nextGate: "SPA_FINAL_HELD_GAP_DIRECT_VISUAL_AND_EDITORIAL_REVIEW_V3" as const,
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

function reviewLifecycle() {
  return Object.freeze({
    reviewOnly: true as const,
    permanentQlAllocated: true as const,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
  });
}

function numericOptions(answer: number, seed: string): readonly [number, number, number, number] {
  const distances = [1, 2, 3, 4];
  const h = hash32(`${seed}:distractors`);
  const values = new Set<number>([answer]);
  for (let index = 0; values.size < 4 && index < 20; index += 1) {
    const distance = distances[(h + index * 3) % distances.length]!;
    const sign = ((h >>> (index % 16)) & 1) === 0 ? -1 : 1;
    const candidate = answer + sign * distance;
    if (candidate > 1) values.add(candidate);
  }
  while (values.size < 4) values.add(answer + values.size + 1);
  const pool = [...values];
  const correctAt = hash32(`${seed}:position`) % 4;
  const wrong = pool.filter((value) => value !== answer);
  const output: number[] = [];
  for (let index = 0; index < 4; index += 1) output.push(index === correctAt ? answer : wrong.shift()!);
  return Object.freeze(output as unknown as [number, number, number, number]);
}

function difficultyForAnswer(answer: number): SpatialFinalHeldGapDifficultyV1 {
  if (answer <= 6) return "Easy";
  if (answer <= 9) return "Medium";
  return "Hard";
}

type Line = Readonly<{ x1: number; y1: number; x2: number; y2: number }>;
type LineScene = Readonly<{
  motif: string;
  lines: readonly Line[];
  groupCounts: readonly Readonly<{ en: string; hi: string; pa: string; count: number }>[];
}>;

function line(x1: number, y1: number, x2: number, y2: number): Line {
  return Object.freeze({ x1, y1, x2, y2 });
}

function polygonLines(cx: number, cy: number, radius: number, sides: number, startDegrees: number, step: number = 1): readonly Line[] {
  const vertices = Array.from({ length: sides }, (_, index) => {
    const angle = (startDegrees + index * 360 / sides) * Math.PI / 180;
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  });
  const seen = new Set<string>();
  const result: Line[] = [];
  for (let index = 0; index < sides; index += 1) {
    const next = (index + step) % sides;
    const a = Math.min(index, next);
    const b = Math.max(index, next);
    const key = `${a}:${b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(line(vertices[index]!.x, vertices[index]!.y, vertices[next]!.x, vertices[next]!.y));
  }
  return Object.freeze(result);
}

function canonicalLineSignature(value: Line): string {
  const dx = value.x2 - value.x1;
  const dy = value.y2 - value.y1;
  const length = Math.hypot(dx, dy);
  if (length < 0.001) throw new Error("Exam-real line motif contains a zero-length line.");
  let a = dy / length;
  let b = -dx / length;
  let c = -(a * value.x1 + b * value.y1);
  if (a < -1e-8 || (Math.abs(a) < 1e-8 && b < 0)) { a *= -1; b *= -1; c *= -1; }
  return `${a.toFixed(5)}:${b.toFixed(5)}:${c.toFixed(5)}`;
}

function buildLineScene(seed: string): LineScene {
  const motifIndex = hash32(`${seed}:exam-line-motif`) % 6;
  if (motifIndex === 0) {
    const top = polygonLines(120, 90, 73, 3, -90);
    const bottom = polygonLines(120, 90, 73, 3, 90);
    return Object.freeze({
      motif: "HEXAGRAM_OVERLAP",
      lines: Object.freeze([...top, ...bottom]),
      groupCounts: Object.freeze([
        Object.freeze({ en: "upright triangle", hi: "ऊपर की ओर त्रिभुज", pa: "ਉੱਪਰ ਵੱਲ ਤਿਕੋਣ", count: 3 }),
        Object.freeze({ en: "inverted triangle", hi: "नीचे की ओर त्रिभुज", pa: "ਹੇਠਾਂ ਵੱਲ ਤਿਕੋਣ", count: 3 }),
      ]),
    });
  }
  if (motifIndex === 1) {
    const star = polygonLines(120, 91, 77, 5, -90, 2);
    return Object.freeze({
      motif: "PENTAGRAM",
      lines: star,
      groupCounts: Object.freeze([
        Object.freeze({ en: "continuous star strokes", hi: "तारे की लगातार सीधी रेखाएँ", pa: "ਤਾਰੇ ਦੀਆਂ ਲਗਾਤਾਰ ਸਿੱਧੀਆਂ ਰੇਖਾਵਾਂ", count: 5 }),
      ]),
    });
  }
  if (motifIndex === 2) {
    const triangle = polygonLines(120, 94, 78, 3, -90);
    const vertices = [
      { x: 120, y: 16 },
      { x: 52.45, y: 133 },
      { x: 187.55, y: 133 },
    ];
    const oppositeMidpoints = [
      { x: (vertices[1]!.x + vertices[2]!.x) / 2, y: 133 },
      { x: (vertices[0]!.x + vertices[2]!.x) / 2, y: (vertices[0]!.y + vertices[2]!.y) / 2 },
      { x: (vertices[0]!.x + vertices[1]!.x) / 2, y: (vertices[0]!.y + vertices[1]!.y) / 2 },
    ];
    const medians = vertices.map((vertex, index) => line(vertex.x, vertex.y, oppositeMidpoints[index]!.x, oppositeMidpoints[index]!.y));
    return Object.freeze({
      motif: "TRIANGLE_MEDIANS",
      lines: Object.freeze([...triangle, ...medians]),
      groupCounts: Object.freeze([
        Object.freeze({ en: "outer triangle sides", hi: "बाहरी त्रिभुज की भुजाएँ", pa: "ਬਾਹਰੀ ਤਿਕੋਣ ਦੀਆਂ ਭੁਜਾਵਾਂ", count: 3 }),
        Object.freeze({ en: "full medians", hi: "पूरी माध्यिकाएँ", pa: "ਪੂਰੀਆਂ ਮੱਧਿਕਾਵਾਂ", count: 3 }),
      ]),
    });
  }
  if (motifIndex === 3) {
    const diamond = polygonLines(120, 90, 72, 4, -90);
    const axes = [line(120, 18, 120, 162), line(48, 90, 192, 90)];
    return Object.freeze({
      motif: "DIAMOND_CROSS",
      lines: Object.freeze([...diamond, ...axes]),
      groupCounts: Object.freeze([
        Object.freeze({ en: "diamond sides", hi: "हीरे जैसी आकृति की भुजाएँ", pa: "ਹੀਰੇ ਵਰਗੀ ਆਕ੍ਰਿਤੀ ਦੀਆਂ ਭੁਜਾਵਾਂ", count: 4 }),
        Object.freeze({ en: "full diagonals", hi: "पूरे विकर्ण", pa: "ਪੂਰੇ ਵਿਕਰਨ", count: 2 }),
      ]),
    });
  }
  if (motifIndex === 4) {
    const square = [line(52, 25, 188, 25), line(188, 25, 188, 155), line(188, 155, 52, 155), line(52, 155, 52, 25)];
    const diagonals = [line(52, 25, 188, 155), line(188, 25, 52, 155)];
    const axis = line(120, 25, 120, 155);
    return Object.freeze({
      motif: "SQUARE_DIAGONAL_AXIS",
      lines: Object.freeze([...square, ...diagonals, axis]),
      groupCounts: Object.freeze([
        Object.freeze({ en: "outer square sides", hi: "बाहरी वर्ग की भुजाएँ", pa: "ਬਾਹਰੀ ਵਰਗ ਦੀਆਂ ਭੁਜਾਵਾਂ", count: 4 }),
        Object.freeze({ en: "diagonals", hi: "विकर्ण", pa: "ਵਿਕਰਨ", count: 2 }),
        Object.freeze({ en: "central vertical line", hi: "बीच की खड़ी रेखा", pa: "ਵਿਚਕਾਰਲੀ ਖੜ੍ਹੀ ਰੇਖਾ", count: 1 }),
      ]),
    });
  }
  const up = polygonLines(120, 92, 70, 3, -90);
  const down = polygonLines(120, 92, 70, 3, 90);
  const axes = [line(120, 15, 120, 165), line(42, 92, 198, 92)];
  return Object.freeze({
    motif: "DOUBLE_TRIANGLE_AXIS",
    lines: Object.freeze([...up, ...down, ...axes]),
    groupCounts: Object.freeze([
      Object.freeze({ en: "two triangle outlines", hi: "दो त्रिभुजों की भुजाएँ", pa: "ਦੋ ਤਿਕੋਣਾਂ ਦੀਆਂ ਭੁਜਾਵਾਂ", count: 6 }),
      Object.freeze({ en: "central axes", hi: "बीच की अक्ष रेखाएँ", pa: "ਵਿਚਕਾਰਲੀਆਂ ਧੁਰੀ ਰੇਖਾਵਾਂ", count: 2 }),
    ]),
  });
}

function renderLineScene(scene: LineScene): string {
  const body = scene.lines.map((value) => `<line x1="${value.x1.toFixed(2)}" y1="${value.y1.toFixed(2)}" x2="${value.x2.toFixed(2)}" y2="${value.y2.toFixed(2)}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" width="240" height="180" role="img" aria-label="straight-line counting figure"><rect width="240" height="180" fill="white"/><g fill="none" stroke="#111827" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
}

function lineSurface(language: SpatialFinalHeldGapLanguageV1, scene: LineScene, answer: number) {
  const labels = scene.groupCounts.map((group) => language === "hi" ? group.hi : language === "pa" ? group.pa : group.en);
  const counts = scene.groupCounts.map((group) => group.count);
  if (language === "hi") return {
    stem: "दी गई आकृति में कुल कितनी सीधी रेखाएँ हैं?",
    rule: "हर पूरी और लगातार सीधी रेखा को एक बार गिनें। प्रतिच्छेदन बिंदु उसी रेखा को छोटे टुकड़ों में बाँटते हुए दिख सकते हैं, लेकिन उनसे नई सीधी रेखाएँ नहीं बनतीं।",
    working: scene.groupCounts.map((group, index) => `${labels[index]} = ${group.count}`).concat(`कुल = ${counts.join(" + ")} = ${answer}`),
    answerLine: `अतः सही उत्तर ${answer} है।`,
  } as const;
  if (language === "pa") return {
    stem: "ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੀਆਂ ਸਿੱਧੀਆਂ ਰੇਖਾਵਾਂ ਹਨ?",
    rule: "ਹਰ ਪੂਰੀ ਅਤੇ ਲਗਾਤਾਰ ਸਿੱਧੀ ਰੇਖਾ ਨੂੰ ਇੱਕ ਵਾਰ ਗਿਣੋ। ਕਟਾਉ ਬਿੰਦੂ ਉਸੇ ਰੇਖਾ ਨੂੰ ਛੋਟੇ ਟੁਕੜਿਆਂ ਵਿੱਚ ਵੰਡਿਆ ਹੋਇਆ ਦਿਖਾ ਸਕਦੇ ਹਨ, ਪਰ ਨਵੀਂ ਸਿੱਧੀ ਰੇਖਾ ਨਹੀਂ ਬਣਾਉਂਦੇ।",
    working: scene.groupCounts.map((group, index) => `${labels[index]} = ${group.count}`).concat(`ਕੁੱਲ = ${counts.join(" + ")} = ${answer}`),
    answerLine: `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`,
  } as const;
  return {
    stem: "How many straight lines are there in the given figure?",
    rule: "Count each complete continuous straight line once. An intersection can split its appearance into smaller pieces, but it does not create extra straight lines.",
    working: scene.groupCounts.map((group, index) => `${labels[index]} = ${group.count}`).concat(`Total = ${counts.join(" + ")} = ${answer}`),
    answerLine: `Therefore, the correct answer is ${answer}.`,
  } as const;
}

export function generateStraightLineCountingReviewV3(input: Readonly<{ seed: string; language: SpatialFinalHeldGapLanguageV1 }>): SpatialFinalHeldGapNumericQuestionV3 {
  const scene = buildLineScene(input.seed);
  const signatures = new Set(scene.lines.map(canonicalLineSignature));
  if (signatures.size !== scene.lines.length) throw new Error(`QL048 V3 has duplicate collinear whole lines for ${input.seed}.`);
  const answer = scene.groupCounts.reduce((sum, group) => sum + group.count, 0);
  if (answer !== signatures.size) throw new Error(`QL048 V3 declared count does not match geometry for ${input.seed}.`);
  const options = numericOptions(answer, `${input.seed}:ql048-v3`);
  const correctIndex = options.indexOf(answer);
  if (correctIndex < 0) throw new Error("QL048 V3 answer is missing from options.");
  const surface = lineSurface(input.language, scene, answer);
  const geometryFingerprint = `spa048v3-${hashHex(scene.lines.map(canonicalLineSignature).sort().join("|"))}`;
  return Object.freeze({
    version: "SPA-FINAL-HELD-GAP-NUMERIC-QUESTION-V3",
    packageId: "SPA-001-FINAL-HELD-GAPS-REVIEW",
    qlId: "SPA-QL-048",
    chapterCode: "FCT-001",
    qlName: "Systematic counting of straight lines",
    language: input.language,
    locale: locale(input.language),
    difficultyBand: difficultyForAnswer(answer),
    seed: input.seed,
    stem: surface.stem,
    stimulusSvgs: Object.freeze([renderLineScene(scene)]) as readonly [string],
    options,
    correctIndex,
    answer,
    explanation: Object.freeze({ rule: surface.rule, working: Object.freeze([...surface.working]), answerLine: surface.answerLine }),
    solveFacts: Object.freeze({ motif: scene.motif, groupCounts: Object.freeze(scene.groupCounts.map((group) => group.count)), verifiedUniqueStraightLines: answer }),
    geometryFingerprint,
    contentFingerprint: `spa048v3c-${hashHex(`${geometryFingerprint}:${surface.stem}:${options.join(",")}`)}`,
    lifecycle: reviewLifecycle(),
  });
}

type CirclePrimitive = Readonly<{ cx: number; cy: number; r: number }>;
type SemiPrimitive = Readonly<{ cx: number; cy: number; r: number; orientation: "UP" | "DOWN" | "LEFT" | "RIGHT" }>;
type CurvedScene = Readonly<{
  target: "CIRCLE" | "SEMICIRCLE";
  motif: string;
  circles: readonly CirclePrimitive[];
  semicircles: readonly SemiPrimitive[];
  groupCounts: readonly Readonly<{ en: string; hi: string; pa: string; count: number }>[];
}>;

function circle(cx: number, cy: number, r: number): CirclePrimitive { return Object.freeze({ cx, cy, r }); }
function semi(cx: number, cy: number, r: number, orientation: SemiPrimitive["orientation"]): SemiPrimitive { return Object.freeze({ cx, cy, r, orientation }); }

function buildCurvedScene(seed: string): CurvedScene {
  const h = hash32(`${seed}:exam-curved-motif`);
  const motifIndex = h % 8;
  if (motifIndex === 0) {
    const around = Array.from({ length: 6 }, (_, index) => {
      const angle = index * Math.PI / 3;
      return circle(120 + Math.cos(angle) * 41, 90 + Math.sin(angle) * 41, 30);
    });
    return Object.freeze({ target: "CIRCLE", motif: "CIRCLE_FLOWER_CLUSTER", circles: Object.freeze([circle(120, 90, 31), ...around]), semicircles: Object.freeze([]), groupCounts: Object.freeze([
      Object.freeze({ en: "central circle", hi: "बीच का वृत्त", pa: "ਵਿਚਕਾਰਲਾ ਵਰਤੁੱਲ", count: 1 }),
      Object.freeze({ en: "surrounding circles", hi: "चारों ओर के वृत्त", pa: "ਆਲੇ-ਦੁਆਲੇ ਦੇ ਵਰਤੁੱਲ", count: 6 }),
    ]) });
  }
  if (motifIndex === 1) {
    const concentric = [circle(120, 90, 26), circle(120, 90, 45), circle(120, 90, 64)];
    const satellites = [circle(53, 45, 20), circle(187, 45, 20), circle(53, 135, 20), circle(187, 135, 20)];
    return Object.freeze({ target: "CIRCLE", motif: "CIRCLE_CONCENTRIC_SATELLITES", circles: Object.freeze([...concentric, ...satellites]), semicircles: Object.freeze([]), groupCounts: Object.freeze([
      Object.freeze({ en: "concentric circles", hi: "समकेन्द्रीय वृत्त", pa: "ਇੱਕੋ ਕੇਂਦਰ ਵਾਲੇ ਵਰਤੁੱਲ", count: 3 }),
      Object.freeze({ en: "corner circles", hi: "कोनों के वृत्त", pa: "ਕੋਨਿਆਂ ਵਾਲੇ ਵਰਤੁੱਲ", count: 4 }),
    ]) });
  }
  if (motifIndex === 2) {
    const count = 8 + ((h >>> 4) % 4);
    const circles = Array.from({ length: count }, (_, index) => {
      const row = index % 2;
      const col = Math.floor(index / 2);
      return circle(45 + col * 30, 68 + row * 44, 25);
    });
    return Object.freeze({ target: "CIRCLE", motif: "CIRCLE_INTERSECTING_CHAIN", circles: Object.freeze(circles), semicircles: Object.freeze([]), groupCounts: Object.freeze([
      Object.freeze({ en: "overlapping circles", hi: "एक-दूसरे को काटते वृत्त", pa: "ਇੱਕ-ਦੂਜੇ ਨੂੰ ਕੱਟਦੇ ਵਰਤੁੱਲ", count }),
    ]) });
  }
  if (motifIndex === 3) {
    const centers = [[70, 55], [170, 55], [70, 125], [170, 125]] as const;
    const circles = centers.flatMap(([cx, cy], index) => [circle(cx, cy, 18), circle(cx, cy, index % 2 === 0 ? 31 : 34)]);
    return Object.freeze({ target: "CIRCLE", motif: "CIRCLE_NESTED_QUADS", circles: Object.freeze(circles), semicircles: Object.freeze([]), groupCounts: Object.freeze([
      Object.freeze({ en: "four inner circles", hi: "चार अंदरूनी वृत्त", pa: "ਚਾਰ ਅੰਦਰਲੇ ਵਰਤੁੱਲ", count: 4 }),
      Object.freeze({ en: "four outer circles", hi: "चार बाहरी वृत्त", pa: "ਚਾਰ ਬਾਹਰੀ ਵਰਤੁੱਲ", count: 4 }),
    ]) });
  }
  if (motifIndex === 4) {
    const count = 8 + ((h >>> 4) % 3);
    const semicircles = Array.from({ length: count }, (_, index) => semi(35 + index * (170 / Math.max(1, count - 1)), 90, 22, index % 2 === 0 ? "UP" : "DOWN"));
    return Object.freeze({ target: "SEMICIRCLE", motif: "SEMICIRCLE_SCALLOP_CHAIN", circles: Object.freeze([]), semicircles: Object.freeze(semicircles), groupCounts: Object.freeze([
      Object.freeze({ en: "alternating semicircles", hi: "बारी-बारी ऊपर-नीचे अर्धवृत्त", pa: "ਵਾਰੀ-ਵਾਰੀ ਉੱਪਰ-ਹੇਠਾਂ ਅਰਧ-ਵਰਤੁੱਲ", count }),
    ]) });
  }
  if (motifIndex === 5) {
    const up = [24, 39, 54, 69].map((r) => semi(120, 99, r, "UP"));
    const down = [28, 46, 64].map((r) => semi(120, 111, r, "DOWN"));
    return Object.freeze({ target: "SEMICIRCLE", motif: "SEMICIRCLE_NESTED_ARCHES", circles: Object.freeze([]), semicircles: Object.freeze([...up, ...down]), groupCounts: Object.freeze([
      Object.freeze({ en: "upper nested semicircles", hi: "ऊपर के क्रमिक अर्धवृत्त", pa: "ਉੱਪਰਲੇ ਇਕ-ਅੰਦਰ-ਇਕ ਅਰਧ-ਵਰਤੁੱਲ", count: 4 }),
      Object.freeze({ en: "lower nested semicircles", hi: "नीचे के क्रमिक अर्धवृत्त", pa: "ਹੇਠਲੇ ਇਕ-ਅੰਦਰ-ਇਕ ਅਰਧ-ਵਰਤੁੱਲ", count: 3 }),
    ]) });
  }
  if (motifIndex === 6) {
    const left = [22, 37, 52].map((r) => semi(92, 90, r, "LEFT"));
    const right = [22, 37, 52].map((r) => semi(148, 90, r, "RIGHT"));
    const topBottom = [semi(120, 90, 67, "UP"), semi(120, 90, 67, "DOWN")];
    return Object.freeze({ target: "SEMICIRCLE", motif: "SEMICIRCLE_OPPOSED_FANS", circles: Object.freeze([]), semicircles: Object.freeze([...left, ...right, ...topBottom]), groupCounts: Object.freeze([
      Object.freeze({ en: "left fan", hi: "बायाँ समूह", pa: "ਖੱਬਾ ਸਮੂਹ", count: 3 }),
      Object.freeze({ en: "right fan", hi: "दायाँ समूह", pa: "ਸੱਜਾ ਸਮੂਹ", count: 3 }),
      Object.freeze({ en: "large upper/lower pair", hi: "बड़ा ऊपर-नीचे जोड़ा", pa: "ਵੱਡਾ ਉੱਪਰ-ਹੇਠਾਂ ਜੋੜਾ", count: 2 }),
    ]) });
  }
  const top = [35, 75, 115, 155, 195].map((cx) => semi(cx, 72, 25, "UP"));
  const bottom = [55, 95, 135, 175].map((cx) => semi(cx, 118, 25, "DOWN"));
  return Object.freeze({ target: "SEMICIRCLE", motif: "SEMICIRCLE_BRIDGE_ROW", circles: Object.freeze([]), semicircles: Object.freeze([...top, ...bottom]), groupCounts: Object.freeze([
    Object.freeze({ en: "upper row", hi: "ऊपरी पंक्ति", pa: "ਉੱਪਰਲੀ ਕਤਾਰ", count: 5 }),
    Object.freeze({ en: "lower row", hi: "निचली पंक्ति", pa: "ਹੇਠਲੀ ਕਤਾਰ", count: 4 }),
  ]) });
}

function circleSignature(value: CirclePrimitive): string { return `C:${value.cx.toFixed(2)}:${value.cy.toFixed(2)}:${value.r.toFixed(2)}`; }
function semiSignature(value: SemiPrimitive): string { return `S:${value.cx.toFixed(2)}:${value.cy.toFixed(2)}:${value.r.toFixed(2)}:${value.orientation}`; }

function semiPath(value: SemiPrimitive): string {
  const { cx, cy, r } = value;
  if (value.orientation === "DOWN") return `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}`;
  if (value.orientation === "LEFT") return `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r}`;
  if (value.orientation === "RIGHT") return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r}`;
  return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
}

function semiDiameter(value: SemiPrimitive): string {
  const { cx, cy, r } = value;
  return value.orientation === "LEFT" || value.orientation === "RIGHT"
    ? `<line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}"/>`
    : `<line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}"/>`;
}

function renderCurvedScene(scene: CurvedScene): string {
  const circles = scene.circles.map((value) => `<circle cx="${value.cx}" cy="${value.cy}" r="${value.r}"/>`).join("");
  const semicircles = scene.semicircles.map((value) => `<path d="${semiPath(value)}"/>${semiDiameter(value)}`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" width="240" height="180" role="img" aria-label="curved-figure counting problem"><rect width="240" height="180" fill="white"/><g fill="none" stroke="#111827" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${circles}${semicircles}</g></svg>`;
}

function curvedSurface(language: SpatialFinalHeldGapLanguageV1, scene: CurvedScene, answer: number) {
  const isCircle = scene.target === "CIRCLE";
  const labels = scene.groupCounts.map((group) => language === "hi" ? group.hi : language === "pa" ? group.pa : group.en);
  const counts = scene.groupCounts.map((group) => group.count);
  if (language === "hi") {
    const noun = isCircle ? "वृत्त" : "अर्धवृत्त";
    return { stem: `दी गई आकृति में कुल कितने ${noun} हैं?`, rule: `आकृति को छोटे समूहों में बाँटकर हर पूर्ण बने हुए ${noun} को केवल एक बार गिनें। प्रतिच्छेदन से अतिरिक्त ${noun} तभी मानें जब उसकी पूरी सीमा वास्तव में बनी हो।`, working: scene.groupCounts.map((group, index) => `${labels[index]} = ${group.count}`).concat(`कुल = ${counts.join(" + ")} = ${answer}`), answerLine: `अतः सही उत्तर ${answer} है।` } as const;
  }
  if (language === "pa") {
    const noun = isCircle ? "ਵਰਤੁੱਲ" : "ਅਰਧ-ਵਰਤੁੱਲ";
    return { stem: `ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${noun} ਹਨ?`, rule: `ਆਕ੍ਰਿਤੀ ਨੂੰ ਛੋਟੇ ਸਮੂਹਾਂ ਵਿੱਚ ਵੰਡ ਕੇ ਹਰ ਪੂਰਾ ਬਣਿਆ ${noun} ਸਿਰਫ਼ ਇੱਕ ਵਾਰ ਗਿਣੋ। ਕਟਾਉ ਨਾਲ ਵਾਧੂ ${noun} ਤਾਂ ਹੀ ਗਿਣੋ ਜਦੋਂ ਉਸਦੀ ਪੂਰੀ ਹੱਦ ਅਸਲ ਵਿੱਚ ਬਣੀ ਹੋਵੇ।`, working: scene.groupCounts.map((group, index) => `${labels[index]} = ${group.count}`).concat(`ਕੁੱਲ = ${counts.join(" + ")} = ${answer}`), answerLine: `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।` } as const;
  }
  const noun = isCircle ? "circles" : "semicircles";
  return { stem: `How many ${noun} are there in the given figure?`, rule: `Break the diagram into convenient groups and count each complete ${isCircle ? "circle" : "semicircle"} once. An overlap creates another one only if its complete boundary is actually drawn.`, working: scene.groupCounts.map((group, index) => `${labels[index]} = ${group.count}`).concat(`Total = ${counts.join(" + ")} = ${answer}`), answerLine: `Therefore, the correct answer is ${answer}.` } as const;
}

export function generateCurvedPrimitiveCountingReviewV3(input: Readonly<{ seed: string; language: SpatialFinalHeldGapLanguageV1 }>): SpatialFinalHeldGapNumericQuestionV3 {
  const scene = buildCurvedScene(input.seed);
  const signatures = scene.target === "CIRCLE" ? scene.circles.map(circleSignature) : scene.semicircles.map(semiSignature);
  if (new Set(signatures).size !== signatures.length) throw new Error(`QL049 V3 contains duplicate declared primitives for ${input.seed}.`);
  const answer = scene.groupCounts.reduce((sum, group) => sum + group.count, 0);
  if (answer !== signatures.length) throw new Error(`QL049 V3 declared count does not match geometry for ${input.seed}.`);
  const options = numericOptions(answer, `${input.seed}:ql049-v3`);
  const correctIndex = options.indexOf(answer);
  if (correctIndex < 0) throw new Error("QL049 V3 answer is missing from options.");
  const surface = curvedSurface(input.language, scene, answer);
  const geometryFingerprint = `spa049v3-${hashHex(signatures.sort().join("|"))}`;
  return Object.freeze({
    version: "SPA-FINAL-HELD-GAP-NUMERIC-QUESTION-V3",
    packageId: "SPA-001-FINAL-HELD-GAPS-REVIEW",
    qlId: "SPA-QL-049",
    chapterCode: "FCT-001",
    qlName: "Systematic counting of circles and semicircles",
    language: input.language,
    locale: locale(input.language),
    difficultyBand: difficultyForAnswer(answer),
    seed: input.seed,
    stem: surface.stem,
    stimulusSvgs: Object.freeze([renderCurvedScene(scene)]) as readonly [string],
    options,
    correctIndex,
    answer,
    explanation: Object.freeze({ rule: surface.rule, working: Object.freeze([...surface.working]), answerLine: surface.answerLine }),
    solveFacts: Object.freeze({ motif: scene.motif, target: scene.target, groupCounts: Object.freeze(scene.groupCounts.map((group) => group.count)), verifiedPrimitiveCount: answer }),
    geometryFingerprint,
    contentFingerprint: `spa049v3c-${hashHex(`${geometryFingerprint}:${surface.stem}:${options.join(",")}`)}`,
    lifecycle: reviewLifecycle(),
  });
}

export function generateSpatialFinalHeldGapReviewQuestionV3(input: Readonly<{
  qlId: SpatialFinalHeldGapQlIdV1;
  seed: string;
  language: SpatialFinalHeldGapLanguageV1;
}>): SpatialFinalHeldGapReviewQuestionV3 {
  if (!input.seed.trim()) throw new Error("Final Spatial held-gap V3 generation requires an explicit seed.");
  if (input.qlId === "SPA-QL-048") return generateStraightLineCountingReviewV3(input);
  if (input.qlId === "SPA-QL-049") return generateCurvedPrimitiveCountingReviewV3(input);
  return generateSpatialFinalHeldGapReviewQuestionV2(input) as SpatialFinalHeldGapEmbeddedQuestionV1;
}
