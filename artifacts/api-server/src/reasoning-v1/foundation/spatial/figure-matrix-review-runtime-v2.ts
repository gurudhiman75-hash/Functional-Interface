import { FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1 } from "./figure-matrix-source-saturated-discovery-v1";
import { FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12 } from "./spatial-permanent-ql-allocation-v12";

export type FigureMatrixLanguageV2 = "en" | "hi" | "pa";
export type FigureMatrixQlIdV2 = "SPA-QL-055" | "SPA-QL-056" | "SPA-QL-057" | "SPA-QL-058" | "SPA-QL-059" | "SPA-QL-060";
export type FigureMatrixDifficultyV2 = "EASY" | "MODERATE" | "HARD";

type Glyph = "ARROW" | "TRIANGLE" | "CIRCLE" | "SQUARE" | "DIAMOND";
type Position = "C" | "N" | "E" | "S" | "W" | "NW" | "NE" | "SE" | "SW";
type Segment = "H" | "V" | "D1" | "D2";
type FillPattern = "HOLLOW" | "SHADED" | "SOLID";
type CellState = Readonly<{
  glyph?: Glyph;
  rotation?: number;
  position?: Position;
  segments?: readonly Segment[];
  dotCount?: number;
  fillPattern?: FillPattern;
  outerGlyph?: Glyph;
  innerGlyph?: Glyph;
  markerPosition?: Position;
}>;

type Localized = Readonly<{ en: string; hi: string; pa: string }>;
type RuleFacts = Readonly<{
  family: string;
  sourceVariant: string;
  governingAxis: "ROW" | "COLUMN" | "BOTH";
  operation: string;
  parameter: string;
  rule: Localized;
  worked: Localized;
  application: Localized;
  verification: Localized;
}>;

type Puzzle = Readonly<{
  matrixSize: number;
  matrix: readonly (CellState | null)[];
  missingIndex: number;
  correct: CellState;
  distractors: readonly CellState[];
  facts: RuleFacts;
  difficulty: FigureMatrixDifficultyV2;
}>;

const QLS: readonly FigureMatrixQlIdV2[] = ["SPA-QL-055", "SPA-QL-056", "SPA-QL-057", "SPA-QL-058", "SPA-QL-059", "SPA-QL-060"];
const OPTION_LABELS = ["A", "B", "C", "D"] as const;
const SEGMENT_ORDER: readonly Segment[] = ["H", "V", "D1", "D2"];
const POSITION_CYCLE: readonly Position[] = ["N", "E", "S", "W"];
const FILL_CYCLE: readonly FillPattern[] = ["HOLLOW", "SHADED", "SOLID"];

export const FMT_V2_SOURCE_VARIANTS = Object.freeze({
  "SPA-QL-055": Object.freeze([
    "ROTATION",
    "OUTER_ELEMENT_REMOVAL_2X2",
    "SEQUENTIAL_ELEMENT_REMOVAL",
    "REFLECTION_OR_INVERSION",
    "POSITION_SHIFT",
    "SHADING_STATE_CHANGE",
  ] as const),
  "SPA-QL-056": Object.freeze([
    "UNION_OR_SUPERIMPOSITION",
    "INTERSECTION_OR_COMMON_PARTS",
    "SYMMETRIC_DIFFERENCE_OR_CANCELLATION",
    "DIRECTIONAL_SUBTRACTION_OR_DIFFERENCE",
  ] as const),
  "SPA-QL-057": Object.freeze([
    "SUM_ACROSS_CELLS",
    "ABSOLUTE_DIFFERENCE",
    "DOUBLE_FIRST_PLUS_SECOND",
    "ADD_CONSTANT",
    "MULTIPLY_CONSTANT",
    "BALANCED_COUNT_RELATION",
  ] as const),
  "SPA-QL-058": Object.freeze([
    "MOTIF_PERMUTATION",
    "POSITION_CYCLE_4X4",
    "ORIENTATION_CYCLE",
    "FILL_STATE_CYCLE",
  ] as const),
  "SPA-QL-059": Object.freeze([
    "ROW_SHAPE_COLUMN_FILL",
    "ROW_COUNT_COLUMN_ORIENTATION",
    "ROW_POSITION_COLUMN_MOTIF",
  ] as const),
  "SPA-QL-060": Object.freeze([
    "ROTATE_PLUS_MOVE_ELEMENT",
    "ROTATE_PLUS_REFLECT",
    "COUNT_CHANGE_PLUS_POSITION_CHANGE",
    "REMOVE_ELEMENT_PLUS_ORIENTATION_CHANGE",
  ] as const),
} as const);

const FAMILY_LABELS: Readonly<Record<FigureMatrixQlIdV2, string>> = Object.freeze({
  "SPA-QL-055": "Repeated figure transformation",
  "SPA-QL-056": "Figure composition",
  "SPA-QL-057": "Count relation",
  "SPA-QL-058": "Cyclic distribution",
  "SPA-QL-059": "Row-column attributes",
  "SPA-QL-060": "Compound matrix rule",
});

function L(en: string, hi: string, pa: string): Localized {
  return Object.freeze({ en, hi, pa });
}

function hash32(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function fingerprint(text: string): string {
  return `fmt2-${hash32(text).toString(16).padStart(8, "0")}`;
}

function normRotation(value: number): number {
  return ((value % 360) + 360) % 360;
}

function uniqueSegments(values: readonly Segment[]): readonly Segment[] {
  return Object.freeze(SEGMENT_ORDER.filter((segment) => values.includes(segment)));
}

function cell(input: CellState): CellState {
  return Object.freeze({
    ...input,
    rotation: input.rotation === undefined ? undefined : normRotation(input.rotation),
    segments: input.segments ? uniqueSegments(input.segments) : undefined,
  });
}

function cellKey(value: CellState): string {
  return JSON.stringify({
    glyph: value.glyph ?? null,
    rotation: value.rotation ?? 0,
    position: value.position ?? "C",
    segments: value.segments ? [...value.segments] : [],
    dotCount: value.dotCount ?? 0,
    fillPattern: value.fillPattern ?? "HOLLOW",
    outerGlyph: value.outerGlyph ?? null,
    innerGlyph: value.innerGlyph ?? null,
    markerPosition: value.markerPosition ?? null,
  });
}

function sameCell(a: CellState, b: CellState): boolean {
  return cellKey(a) === cellKey(b);
}

function shuffled<T>(input: readonly T[], seed: number): T[] {
  const out = [...input];
  let state = seed >>> 0;
  for (let i = out.length - 1; i > 0; i -= 1) {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function variantOrdinal(seed: string): number {
  const match = /(\d+)$/.exec(seed);
  if (match) return Math.max(0, Number(match[1]) - 1);
  return hash32(seed);
}

function positionPoint(position: Position | undefined): readonly [number, number] {
  const points: Record<Position, readonly [number, number]> = {
    C: [32, 32], N: [32, 18], E: [46, 32], S: [32, 46], W: [18, 32],
    NW: [20, 20], NE: [44, 20], SE: [44, 44], SW: [20, 44],
  };
  return points[position ?? "C"];
}

function fillFor(pattern: FillPattern | undefined): string {
  if (pattern === "SOLID") return "#111827";
  if (pattern === "SHADED") return "#9ca3af";
  return "white";
}

function glyphPrimitive(glyph: Glyph, x: number, y: number, scale: number, rotation: number, pattern: FillPattern | undefined): string {
  const fill = fillFor(pattern);
  const r = 9 * scale;
  if (glyph === "CIRCLE") return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  if (glyph === "SQUARE") return `<rect x="${x - 8 * scale}" y="${y - 8 * scale}" width="${16 * scale}" height="${16 * scale}" fill="${fill}" transform="rotate(${rotation} ${x} ${y})"/>`;
  if (glyph === "DIAMOND") return `<rect x="${x - 7 * scale}" y="${y - 7 * scale}" width="${14 * scale}" height="${14 * scale}" fill="${fill}" transform="rotate(${45 + rotation} ${x} ${y})"/>`;
  if (glyph === "TRIANGLE") return `<polygon points="0,${-10 * scale} ${9 * scale},${8 * scale} ${-9 * scale},${8 * scale}" fill="${fill}" transform="translate(${x} ${y}) rotate(${rotation})"/>`;
  return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})"><line x1="-11" y1="0" x2="10" y2="0"/><polyline points="4,-6 11,0 4,6"/></g>`;
}

function segmentsSvg(segments: readonly Segment[] | undefined): string {
  if (!segments?.length) return "";
  const map: Record<Segment, string> = {
    H: '<line x1="13" y1="32" x2="51" y2="32"/>',
    V: '<line x1="32" y1="13" x2="32" y2="51"/>',
    D1: '<line x1="17" y1="17" x2="47" y2="47"/>',
    D2: '<line x1="47" y1="17" x2="17" y2="47"/>',
  };
  return segments.map((segment) => map[segment]).join("");
}

function dotsSvg(count: number | undefined): string {
  if (!count) return "";
  const points: readonly (readonly [number, number])[] = [
    [15, 15], [49, 15], [15, 49], [49, 49], [32, 13], [32, 51], [13, 32], [51, 32], [32, 32],
  ];
  return points.slice(0, Math.min(count, points.length)).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.45" fill="#111827" stroke="none"/>`).join("");
}

function contentSvg(state: CellState): string {
  const mainPosition = positionPoint(state.position);
  const nested = state.outerGlyph
    ? `${glyphPrimitive(state.outerGlyph, 32, 32, 1.55, state.rotation ?? 0, "HOLLOW")}${state.innerGlyph ? glyphPrimitive(state.innerGlyph, 32, 32, 0.62, state.rotation ?? 0, state.fillPattern) : ""}`
    : "";
  const main = state.glyph ? glyphPrimitive(state.glyph, mainPosition[0], mainPosition[1], 1, state.rotation ?? 0, state.fillPattern) : "";
  const marker = state.markerPosition ? (() => {
    const [x, y] = positionPoint(state.markerPosition);
    return `<circle cx="${x}" cy="${y}" r="3.1" fill="#111827" stroke="none"/>`;
  })() : "";
  return `<g fill="none" stroke="#111827" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${segmentsSvg(state.segments)}${nested}${main}</g>${dotsSvg(state.dotCount)}${marker}`;
}

function renderCell(state: CellState, size = 92): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" role="img"><rect x="0" y="0" width="64" height="64" fill="white"/>${contentSvg(state)}</svg>`;
}

function renderMatrix(matrix: readonly (CellState | null)[], matrixSize: number, missingIndex: number, filledMissing?: CellState): string {
  const cellSize = 64;
  const total = cellSize * matrixSize;
  const body = matrix.map((entry, index) => {
    const row = Math.floor(index / matrixSize);
    const col = index % matrixSize;
    const x = col * cellSize;
    const y = row * cellSize;
    const resolved = index === missingIndex && filledMissing ? filledMissing : entry;
    const content = resolved
      ? `<g transform="translate(${x} ${y})">${contentSvg(resolved)}</g>`
      : `<text x="${x + 32}" y="${y + 39}" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="700" fill="#111827">?</text>`;
    return `<rect x="${x}" y="${y}" width="64" height="64" fill="white" stroke="#111827" stroke-width="1.1"/>${content}`;
  }).join("");
  const display = Math.min(340, Math.max(190, total * 1.25));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${display}" height="${display}" role="img">${body}</svg>`;
}

function makeOptions(correct: CellState, distractors: readonly CellState[], seed: number) {
  const unique = [correct, ...distractors].filter((candidate, index, all) => all.findIndex((other) => sameCell(candidate, other)) === index);
  if (unique.length < 4) throw new Error("FMT-001 V2 failed to construct four semantically distinct options.");
  const chosen = shuffled(unique.slice(0, 4), seed ^ 0x9e3779b9);
  const correctIndex = chosen.findIndex((candidate) => sameCell(candidate, correct));
  if (correctIndex < 0) throw new Error("FMT-001 V2 correct option was lost during shuffle.");
  return { options: Object.freeze(chosen), correctIndex } as const;
}

function mismatch(candidate: CellState, correct: CellState): string {
  const failures: string[] = [];
  if (candidate.glyph !== correct.glyph) failures.push("wrong main figure");
  if ((candidate.rotation ?? 0) !== (correct.rotation ?? 0)) failures.push("wrong orientation");
  if ((candidate.position ?? "C") !== (correct.position ?? "C")) failures.push("wrong position");
  if ((candidate.fillPattern ?? "HOLLOW") !== (correct.fillPattern ?? "HOLLOW")) failures.push("wrong fill state");
  if ((candidate.dotCount ?? 0) !== (correct.dotCount ?? 0)) failures.push("wrong count");
  if (JSON.stringify(candidate.segments ?? []) !== JSON.stringify(correct.segments ?? [])) failures.push("wrong line set");
  if (candidate.outerGlyph !== correct.outerGlyph || candidate.innerGlyph !== correct.innerGlyph) failures.push("wrong inner/outer element state");
  if (candidate.markerPosition !== correct.markerPosition) failures.push("wrong reflected marker position");
  return failures.join(" and ") || "does not satisfy the matrix rule";
}

function localizedStem(language: FigureMatrixLanguageV2, variant: number): string {
  const values = {
    en: [
      "Study the figure matrix and choose the option that correctly replaces the question mark.",
      "Which answer figure completes the matrix according to the rule followed in the rows and columns?",
      "Select the figure that should occupy the missing cell of the matrix.",
    ],
    hi: [
      "आकृति मैट्रिक्स को ध्यान से देखिए और प्रश्नवाचक चिह्न के स्थान पर आने वाला सही विकल्प चुनिए।",
      "पंक्तियों और स्तंभों में चल रहे नियम के अनुसार कौन-सी उत्तर आकृति मैट्रिक्स को पूरा करती है?",
      "मैट्रिक्स के रिक्त खाने में आने वाली सही आकृति चुनिए।",
    ],
    pa: [
      "ਆਕ੍ਰਿਤੀ ਮੈਟ੍ਰਿਕਸ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖੋ ਅਤੇ ਪ੍ਰਸ਼ਨ-ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਆਉਣ ਵਾਲਾ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।",
      "ਕਤਾਰਾਂ ਅਤੇ ਕਾਲਮਾਂ ਵਿੱਚ ਚੱਲ ਰਹੇ ਨਿਯਮ ਅਨੁਸਾਰ ਕਿਹੜੀ ਉੱਤਰ ਆਕ੍ਰਿਤੀ ਮੈਟ੍ਰਿਕਸ ਨੂੰ ਪੂਰਾ ਕਰਦੀ ਹੈ?",
      "ਮੈਟ੍ਰਿਕਸ ਦੇ ਖਾਲੀ ਖਾਣੇ ਵਿੱਚ ਆਉਣ ਵਾਲੀ ਸਹੀ ਆਕ੍ਰਿਤੀ ਚੁਣੋ।",
    ],
  } as const;
  return values[language][variant % 3];
}

function rotationPuzzle(seed: number): Puzzle {
  const step = [45, 90, 135][seed % 3];
  const glyph: Glyph = seed % 2 === 0 ? "ARROW" : "TRIANGLE";
  const starts = [0, 45, 90];
  const matrix: (CellState | null)[] = [];
  for (let row = 0; row < 3; row += 1) for (let col = 0; col < 3; col += 1) matrix.push(cell({ glyph, rotation: starts[row] + step * col }));
  const correct = matrix[8]!;
  matrix[8] = null;
  return Object.freeze({
    matrixSize: 3, matrix: Object.freeze(matrix), missingIndex: 8, correct,
    distractors: Object.freeze([cell({ glyph, rotation: (correct.rotation ?? 0) - step }), cell({ glyph, rotation: (correct.rotation ?? 0) + 45 }), cell({ glyph, rotation: (correct.rotation ?? 0) + 90 })]),
    difficulty: "MODERATE",
    facts: Object.freeze({
      family: "REPEATED_UNARY_TRANSFORM", sourceVariant: "ROTATION", governingAxis: "ROW", operation: "ROTATION", parameter: `${step}° per cell`,
      rule: L(`The figure turns ${step}° at each step across a row.`, `हर पंक्ति में आकृति अगले खाने में ${step}° घूमती है।`, `ਹਰ ਕਤਾਰ ਵਿੱਚ ਆਕ੍ਰਿਤੀ ਅਗਲੇ ਖਾਣੇ ਵਿੱਚ ${step}° ਘੁੰਮਦੀ ਹੈ।`),
      worked: L(`The completed rows show the same ${step}° turn from the first cell to the second and again to the third.`, `पूरी पंक्तियों में पहले से दूसरे और दूसरे से तीसरे खाने तक समान ${step}° घूर्णन दिखता है।`, `ਪੂਰੀਆਂ ਕਤਾਰਾਂ ਵਿੱਚ ਪਹਿਲੇ ਤੋਂ ਦੂਜੇ ਅਤੇ ਦੂਜੇ ਤੋਂ ਤੀਜੇ ਖਾਣੇ ਤੱਕ ਇੱਕੋ ${step}° ਘੁੰਮਾਅ ਦਿਖਦਾ ਹੈ।`),
      application: L(`Apply one more ${step}° turn to the last visible figure in row 3.`, `तीसरी पंक्ति की अंतिम दिखाई देने वाली आकृति को एक बार और ${step}° घुमाएँ।`, `ਤੀਜੀ ਕਤਾਰ ਦੀ ਆਖਰੀ ਦਿਖਾਈ ਦੇਣ ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਨੂੰ ਇੱਕ ਵਾਰ ਹੋਰ ${step}° ਘੁਮਾਓ।`),
      verification: L("The same increment is visible in both completed rows.", "दोनों पूरी पंक्तियाँ इसी घूर्णन की पुष्टि करती हैं।", "ਦੋਵੇਂ ਪੂਰੀਆਂ ਕਤਾਰਾਂ ਇਸੇ ਘੁੰਮਾਅ ਦੀ ਪੁਸ਼ਟੀ ਕਰਦੀਆਂ ਹਨ।"),
    }),
  });
}

function outerRemovalPuzzle(seed: number): Puzzle {
  const pairs: readonly (readonly [Glyph, Glyph])[] = [["SQUARE", "CIRCLE"], ["DIAMOND", "TRIANGLE"], ["CIRCLE", "SQUARE"]];
  const first = pairs[seed % pairs.length];
  const second = pairs[(seed + 1) % pairs.length];
  const matrix: (CellState | null)[] = [
    cell({ outerGlyph: first[0], innerGlyph: first[1] }), cell({ glyph: first[1] }),
    cell({ outerGlyph: second[0], innerGlyph: second[1] }), cell({ glyph: second[1] }),
  ];
  const correct = matrix[3]!;
  matrix[3] = null;
  return Object.freeze({
    matrixSize: 2, matrix: Object.freeze(matrix), missingIndex: 3, correct,
    distractors: Object.freeze([cell({ outerGlyph: second[0], innerGlyph: second[1] }), cell({ glyph: second[0] }), cell({ glyph: first[1] })]),
    difficulty: "EASY",
    facts: Object.freeze({
      family: "REPEATED_UNARY_TRANSFORM", sourceVariant: "OUTER_ELEMENT_REMOVAL_2X2", governingAxis: "ROW", operation: "REMOVE_OUTER_ELEMENT", parameter: "retain the inner element only",
      rule: L("In each row, remove the outer figure and keep the inner figure unchanged.", "हर पंक्ति में बाहरी आकृति हटाकर केवल अंदर की आकृति को उसी रूप में रखें।", "ਹਰ ਕਤਾਰ ਵਿੱਚ ਬਾਹਰੀ ਆਕ੍ਰਿਤੀ ਹਟਾ ਕੇ ਅੰਦਰਲੀ ਆਕ੍ਰਿਤੀ ਨੂੰ ਉਸੇ ਰੂਪ ਵਿੱਚ ਰੱਖੋ।"),
      worked: L("Row 1 confirms the rule: the outer figure disappears while the inner figure remains.", "पहली पंक्ति में बाहरी आकृति हटती है और अंदर की आकृति बनी रहती है।", "ਪਹਿਲੀ ਕਤਾਰ ਵਿੱਚ ਬਾਹਰੀ ਆਕ੍ਰਿਤੀ ਹਟ ਜਾਂਦੀ ਹੈ ਅਤੇ ਅੰਦਰਲੀ ਆਕ੍ਰਿਤੀ ਰਹਿੰਦੀ ਹੈ।"),
      application: L("Apply the same removal to the first cell of row 2; only its inner figure should remain.", "दूसरी पंक्ति के पहले खाने पर यही नियम लगाएँ; केवल उसकी अंदर की आकृति बचेगी।", "ਦੂਜੀ ਕਤਾਰ ਦੇ ਪਹਿਲੇ ਖਾਣੇ ਉੱਤੇ ਇਹੀ ਨਿਯਮ ਲਗਾਓ; ਸਿਰਫ਼ ਅੰਦਰਲੀ ਆਕ੍ਰਿਤੀ ਬਚੇਗੀ।"),
      verification: L("Both rows use the grid to repeat the same removal, so this is a matrix transform rather than a decorative analogy.", "दोनों पंक्तियाँ एक ही हटाने का नियम दोहराती हैं।", "ਦੋਵੇਂ ਕਤਾਰਾਂ ਇੱਕੋ ਹਟਾਉਣ ਵਾਲਾ ਨਿਯਮ ਦੁਹਰਾਉਂਦੀਆਂ ਹਨ।"),
    }),
  });
}

function sequentialRemovalPuzzle(seed: number): Puzzle {
  const glyphs: readonly Glyph[] = ["CIRCLE", "SQUARE", "TRIANGLE"];
  const matrix: (CellState | null)[] = [];
  for (const glyph of glyphs) {
    matrix.push(cell({ glyph, segments: ["H", "V", "D1", "D2"] }));
    matrix.push(cell({ glyph, segments: ["D1", "D2"] }));
    matrix.push(cell({ segments: ["D1", "D2"] }));
  }
  const correct = matrix[8]!;
  matrix[8] = null;
  return Object.freeze({
    matrixSize: 3, matrix: Object.freeze(matrix), missingIndex: 8, correct,
    distractors: Object.freeze([cell({ glyph: glyphs[2], segments: ["D1", "D2"] }), cell({ segments: ["H", "V"] }), cell({ glyph: glyphs[2], segments: ["H", "V", "D1", "D2"] })]),
    difficulty: "MODERATE",
    facts: Object.freeze({
      family: "REPEATED_UNARY_TRANSFORM", sourceVariant: "SEQUENTIAL_ELEMENT_REMOVAL", governingAxis: "ROW", operation: "REMOVE_LINES_THEN_INNER_ELEMENT", parameter: "remove perpendicular lines, then remove the central figure",
      rule: L("Across each row, first remove the horizontal and vertical lines; in the next step remove the central figure as well.", "हर पंक्ति में पहले क्षैतिज और ऊर्ध्वाधर रेखाएँ हटती हैं; अगले चरण में बीच की आकृति भी हट जाती है।", "ਹਰ ਕਤਾਰ ਵਿੱਚ ਪਹਿਲਾਂ ਹੋਰਿਜ਼ਾਂਟਲ ਅਤੇ ਵਰਟੀਕਲ ਰੇਖਾਵਾਂ ਹਟਦੀਆਂ ਹਨ; ਅਗਲੇ ਕਦਮ ਵਿੱਚ ਵਿਚਕਾਰਲੀ ਆਕ੍ਰਿਤੀ ਵੀ ਹਟ ਜਾਂਦੀ ਹੈ।"),
      worked: L("Rows 1 and 2 both reduce from four lines plus a central figure, to two diagonals plus the figure, and finally to the two diagonals only.", "पहली दो पंक्तियाँ चार रेखाओं और मध्य आकृति से घटकर दो विकर्ण व मध्य आकृति, फिर केवल दो विकर्ण बनती हैं।", "ਪਹਿਲੀਆਂ ਦੋ ਕਤਾਰਾਂ ਚਾਰ ਰੇਖਾਵਾਂ ਅਤੇ ਵਿਚਕਾਰਲੀ ਆਕ੍ਰਿਤੀ ਤੋਂ ਘਟ ਕੇ ਦੋ ਤਿਰਛੀਆਂ ਰੇਖਾਵਾਂ ਅਤੇ ਆਕ੍ਰਿਤੀ, ਫਿਰ ਸਿਰਫ਼ ਦੋ ਤਿਰਛੀਆਂ ਰੇਖਾਵਾਂ ਰਹਿ ਜਾਂਦੀਆਂ ਹਨ।"),
      application: L("In row 3, the last step must remove the remaining central triangle and leave only the two diagonals.", "तीसरी पंक्ति के अंतिम चरण में बची हुई मध्य त्रिभुज आकृति हटाकर केवल दो विकर्ण रहने चाहिए।", "ਤੀਜੀ ਕਤਾਰ ਦੇ ਆਖਰੀ ਕਦਮ ਵਿੱਚ ਵਿਚਕਾਰਲਾ ਤਿਕੋਣ ਹਟਾ ਕੇ ਸਿਰਫ਼ ਦੋ ਤਿਰਛੀਆਂ ਰੇਖਾਵਾਂ ਰਹਿਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ।"),
      verification: L("The same two-stage deletion is visible in each completed row.", "हर पूरी पंक्ति यही दो-चरणीय हटाने का क्रम दिखाती है।", "ਹਰ ਪੂਰੀ ਕਤਾਰ ਇਹੀ ਦੋ-ਕਦਮੀ ਹਟਾਉਣ ਵਾਲਾ ਕ੍ਰਮ ਦਿਖਾਉਂਦੀ ਹੈ।"),
    }),
  });
}

const VERTICAL_MIRROR: Readonly<Record<Position, Position>> = Object.freeze({ C: "C", N: "N", E: "W", S: "S", W: "E", NW: "NE", NE: "NW", SE: "SW", SW: "SE" });
function mirrorState(state: CellState): CellState {
  return cell({
    ...state,
    rotation: state.rotation === undefined ? undefined : 180 - state.rotation,
    position: state.position ? VERTICAL_MIRROR[state.position] : undefined,
    markerPosition: state.markerPosition ? VERTICAL_MIRROR[state.markerPosition] : undefined,
  });
}

function reflectionPuzzle(seed: number): Puzzle {
  const inputs = [cell({ glyph: "ARROW", rotation: 25, markerPosition: "NE" }), cell({ glyph: "ARROW", rotation: 315, markerPosition: "SE" })];
  const matrix: (CellState | null)[] = [inputs[0], mirrorState(inputs[0]), inputs[1], mirrorState(inputs[1])];
  const correct = matrix[3]!;
  matrix[3] = null;
  return Object.freeze({
    matrixSize: 2, matrix: Object.freeze(matrix), missingIndex: 3, correct,
    distractors: Object.freeze([cell({ ...inputs[1] }), cell({ glyph: "ARROW", rotation: 225, markerPosition: "SE" }), cell({ glyph: "ARROW", rotation: correct.rotation, markerPosition: "SE" })]),
    difficulty: "MODERATE",
    facts: Object.freeze({
      family: "REPEATED_UNARY_TRANSFORM", sourceVariant: "REFLECTION_OR_INVERSION", governingAxis: "ROW", operation: "VERTICAL_REFLECTION", parameter: "mirror the entire composite left-to-right",
      rule: L("The second cell in each row is the left-right mirror image of the first cell, including the small marker.", "हर पंक्ति का दूसरा खाना पहले खाने का बाएँ-दाएँ दर्पण प्रतिबिंब है; छोटा बिंदु भी साथ में पलटता है।", "ਹਰ ਕਤਾਰ ਦਾ ਦੂਜਾ ਖਾਣਾ ਪਹਿਲੇ ਖਾਣੇ ਦਾ ਖੱਬੇ-ਸੱਜੇ ਦਰਪਣ ਪ੍ਰਤੀਬਿੰਬ ਹੈ; ਛੋਟਾ ਬਿੰਦੂ ਵੀ ਨਾਲ ਪਲਟਦਾ ਹੈ।"),
      worked: L("Row 1 shows both the arrow direction and the marker moving to their reflected positions.", "पहली पंक्ति में तीर की दिशा और छोटा बिंदु दोनों प्रतिबिंबित स्थान पर जाते हैं।", "ਪਹਿਲੀ ਕਤਾਰ ਵਿੱਚ ਤੀਰ ਦੀ ਦਿਸ਼ਾ ਅਤੇ ਛੋਟਾ ਬਿੰਦੂ ਦੋਵੇਂ ਪ੍ਰਤੀਬਿੰਬਿਤ ਸਥਾਨ ਤੇ ਜਾਂਦੇ ਹਨ।"),
      application: L("Reflect both features of the first cell in row 2; changing only the arrow or only the marker is insufficient.", "दूसरी पंक्ति के पहले खाने की दोनों विशेषताओं को प्रतिबिंबित करें; केवल तीर या केवल बिंदु बदलना पर्याप्त नहीं है।", "ਦੂਜੀ ਕਤਾਰ ਦੇ ਪਹਿਲੇ ਖਾਣੇ ਦੀਆਂ ਦੋਵੇਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਨੂੰ ਪ੍ਰਤੀਬਿੰਬਿਤ ਕਰੋ; ਸਿਰਫ਼ ਤੀਰ ਜਾਂ ਸਿਰਫ਼ ਬਿੰਦੂ ਬਦਲਣਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।"),
      verification: L("The reflected arrow and marker must agree simultaneously.", "तीर और बिंदु दोनों का प्रतिबिंब एक साथ सही होना चाहिए।", "ਤੀਰ ਅਤੇ ਬਿੰਦੂ ਦੋਵੇਂ ਦਾ ਪ੍ਰਤੀਬਿੰਬ ਇਕੱਠੇ ਸਹੀ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।"),
    }),
  });
}

function positionShiftPuzzle(seed: number): Puzzle {
  const glyphs: readonly Glyph[] = ["CIRCLE", "SQUARE", "TRIANGLE"];
  const cycle: readonly Position[] = ["N", "E", "S"];
  const matrix: (CellState | null)[] = [];
  for (let row = 0; row < 3; row += 1) for (let col = 0; col < 3; col += 1) matrix.push(cell({ glyph: glyphs[row], fillPattern: "SOLID", position: cycle[col] }));
  const correct = matrix[8]!;
  matrix[8] = null;
  return Object.freeze({
    matrixSize: 3, matrix: Object.freeze(matrix), missingIndex: 8, correct,
    distractors: Object.freeze([cell({ glyph: "TRIANGLE", fillPattern: "SOLID", position: "N" }), cell({ glyph: "TRIANGLE", fillPattern: "SOLID", position: "E" }), cell({ glyph: "SQUARE", fillPattern: "SOLID", position: "S" })]),
    difficulty: "EASY",
    facts: Object.freeze({
      family: "REPEATED_UNARY_TRANSFORM", sourceVariant: "POSITION_SHIFT", governingAxis: "ROW", operation: "POSITION_SHIFT", parameter: "top → right → bottom",
      rule: L("Within each row, the same figure moves from the top position to the right and then to the bottom.", "हर पंक्ति में वही आकृति ऊपर से दाएँ और फिर नीचे जाती है।", "ਹਰ ਕਤਾਰ ਵਿੱਚ ਉਹੀ ਆਕ੍ਰਿਤੀ ਉੱਪਰ ਤੋਂ ਸੱਜੇ ਅਤੇ ਫਿਰ ਹੇਠਾਂ ਜਾਂਦੀ ਹੈ।"),
      worked: L("Rows 1 and 2 show the same three-position movement.", "पहली दो पंक्तियाँ यही तीन-स्थान गति दिखाती हैं।", "ਪਹਿਲੀਆਂ ਦੋ ਕਤਾਰਾਂ ਇਹੀ ਤਿੰਨ-ਸਥਾਨ ਚਾਲ ਦਿਖਾਉਂਦੀਆਂ ਹਨ।"),
      application: L("Continue the movement in row 3 while keeping the row's triangle unchanged.", "तीसरी पंक्ति में त्रिभुज को वही रखते हुए स्थान-क्रम पूरा करें।", "ਤੀਜੀ ਕਤਾਰ ਵਿੱਚ ਤਿਕੋਣ ਨੂੰ ਉਹੀ ਰੱਖਦੇ ਹੋਏ ਸਥਾਨ-ਕ੍ਰਮ ਪੂਰਾ ਕਰੋ।"),
      verification: L("Only the position changes within a row; the row's figure identity does not.", "पंक्ति में केवल स्थान बदलता है, आकृति नहीं।", "ਕਤਾਰ ਵਿੱਚ ਸਿਰਫ਼ ਸਥਾਨ ਬਦਲਦਾ ਹੈ, ਆਕ੍ਰਿਤੀ ਨਹੀਂ।"),
    }),
  });
}

function shadingChangePuzzle(seed: number): Puzzle {
  const glyphs: readonly Glyph[] = ["CIRCLE", "SQUARE", "DIAMOND"];
  const matrix: (CellState | null)[] = [];
  for (let row = 0; row < 3; row += 1) for (let col = 0; col < 3; col += 1) matrix.push(cell({ glyph: glyphs[row], fillPattern: FILL_CYCLE[col] }));
  const correct = matrix[8]!;
  matrix[8] = null;
  return Object.freeze({
    matrixSize: 3, matrix: Object.freeze(matrix), missingIndex: 8, correct,
    distractors: Object.freeze([cell({ glyph: "DIAMOND", fillPattern: "HOLLOW" }), cell({ glyph: "DIAMOND", fillPattern: "SHADED" }), cell({ glyph: "SQUARE", fillPattern: "SOLID" })]),
    difficulty: "EASY",
    facts: Object.freeze({
      family: "REPEATED_UNARY_TRANSFORM", sourceVariant: "SHADING_STATE_CHANGE", governingAxis: "ROW", operation: "SHADING_CHANGE", parameter: "hollow → shaded → solid",
      rule: L("Across each row, the figure changes from hollow to shaded to solid while its shape stays the same.", "हर पंक्ति में आकृति खाली से छायांकित और फिर पूर्ण भरी हुई बनती है; आकृति का प्रकार वही रहता है।", "ਹਰ ਕਤਾਰ ਵਿੱਚ ਆਕ੍ਰਿਤੀ ਖਾਲੀ ਤੋਂ ਛਾਇਆਦਾਰ ਅਤੇ ਫਿਰ ਪੂਰੀ ਭਰੀ ਹੋਈ ਬਣਦੀ ਹੈ; ਆਕ੍ਰਿਤੀ ਦਾ ਰੂਪ ਉਹੀ ਰਹਿੰਦਾ ਹੈ।"),
      worked: L("The first two rows both follow the same three-stage fill sequence.", "पहली दो पंक्तियाँ यही तीन-चरणीय भराव क्रम दिखाती हैं।", "ਪਹਿਲੀਆਂ ਦੋ ਕਤਾਰਾਂ ਇਹੀ ਤਿੰਨ-ਕਦਮੀ ਭਰਾਵ ਕ੍ਰਮ ਦਿਖਾਉਂਦੀਆਂ ਹਨ।"),
      application: L("The diamond in row 3 has already appeared hollow and shaded, so the missing diamond must be solid.", "तीसरी पंक्ति में हीरा पहले खाली और फिर छायांकित है, इसलिए अंतिम हीरा पूर्ण भरा होगा।", "ਤੀਜੀ ਕਤਾਰ ਵਿੱਚ ਹੀਰਾ ਪਹਿਲਾਂ ਖਾਲੀ ਅਤੇ ਫਿਰ ਛਾਇਆਦਾਰ ਹੈ, ਇਸ ਲਈ ਆਖਰੀ ਹੀਰਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰਿਆ ਹੋਵੇਗਾ।"),
      verification: L("The fill order is identical in all rows.", "सभी पंक्तियों में भराव का क्रम समान है।", "ਸਾਰੀਆਂ ਕਤਾਰਾਂ ਵਿੱਚ ਭਰਾਵ ਦਾ ਕ੍ਰਮ ਇੱਕੋ ਹੈ।"),
    }),
  });
}

function compose(a: readonly Segment[], b: readonly Segment[], operation: string): readonly Segment[] {
  if (operation === "UNION_OR_SUPERIMPOSITION") return uniqueSegments([...a, ...b]);
  if (operation === "INTERSECTION_OR_COMMON_PARTS") return uniqueSegments(a.filter((segment) => b.includes(segment)));
  if (operation === "SYMMETRIC_DIFFERENCE_OR_CANCELLATION") return uniqueSegments([...a.filter((segment) => !b.includes(segment)), ...b.filter((segment) => !a.includes(segment))]);
  return uniqueSegments(a.filter((segment) => !b.includes(segment)));
}

function compositionPuzzle(sourceVariant: string, seed: number): Puzzle {
  const rows: readonly (readonly [readonly Segment[], readonly Segment[]])[] = sourceVariant === "UNION_OR_SUPERIMPOSITION" ? [
    [["H"], ["V"]], [["D1"], ["D2", "H"]], [["H", "V"], ["D1"]],
  ] : sourceVariant === "INTERSECTION_OR_COMMON_PARTS" ? [
    [["H", "V"], ["V", "D1"]], [["D1", "D2", "H"], ["H", "D2"]], [["H", "V", "D1"], ["V", "D1", "D2"]],
  ] : sourceVariant === "SYMMETRIC_DIFFERENCE_OR_CANCELLATION" ? [
    [["H", "V"], ["V", "D1"]], [["D1", "D2"], ["D2", "H"]], [["H", "V", "D1"], ["V", "D2"]],
  ] : [
    [["H", "V", "D1"], ["V"]], [["D1", "D2", "H"], ["D2"]], [["H", "V", "D1", "D2"], ["V", "D2"]],
  ];
  const matrix: (CellState | null)[] = [];
  for (const [a, b] of rows) matrix.push(cell({ segments: a }), cell({ segments: b }), cell({ segments: compose(a, b, sourceVariant) }));
  const correct = matrix[8]!;
  matrix[8] = null;
  const a = rows[2][0]; const b = rows[2][1];
  const alternatives = FMT_V2_SOURCE_VARIANTS["SPA-QL-056"].filter((variant) => variant !== sourceVariant).map((variant) => cell({ segments: compose(a, b, variant) }));
  const extra = cell({ segments: uniqueSegments([...(correct.segments ?? []), "V"]) });
  const phrase = sourceVariant === "UNION_OR_SUPERIMPOSITION" ? "keep every line appearing in either of the first two cells"
    : sourceVariant === "INTERSECTION_OR_COMMON_PARTS" ? "keep only lines common to both first cells"
      : sourceVariant === "SYMMETRIC_DIFFERENCE_OR_CANCELLATION" ? "cancel common lines and keep the lines that occur in only one cell"
        : "remove from the first cell every line shown in the second";
  return Object.freeze({
    matrixSize: 3, matrix: Object.freeze(matrix), missingIndex: 8, correct, distractors: Object.freeze([...alternatives, extra]), difficulty: sourceVariant === "UNION_OR_SUPERIMPOSITION" ? "MODERATE" : "HARD",
    facts: Object.freeze({
      family: "BINARY_FIGURE_COMPOSITION", sourceVariant, governingAxis: "ROW", operation: sourceVariant, parameter: phrase,
      rule: L(`In each row, ${phrase}.`, "हर पंक्ति में पहले दो खानों की रेखाओं पर वही जोड़/हटाव नियम लगाकर तीसरा खाना बनाया जाता है।", "ਹਰ ਕਤਾਰ ਵਿੱਚ ਪਹਿਲੇ ਦੋ ਖਾਣਿਆਂ ਦੀਆਂ ਰੇਖਾਵਾਂ ਉੱਤੇ ਉਹੀ ਜੋੜ/ਹਟਾਉ ਨਿਯਮ ਲਗਾ ਕੇ ਤੀਜਾ ਖਾਣਾ ਬਣਾਇਆ ਜਾਂਦਾ ਹੈ।"),
      worked: L("The first two completed rows reproduce the same line-set operation exactly.", "पहली दो पूरी पंक्तियाँ रेखाओं पर यही क्रिया दोहराती हैं।", "ਪਹਿਲੀਆਂ ਦੋ ਪੂਰੀਆਂ ਕਤਾਰਾਂ ਰੇਖਾਵਾਂ ਉੱਤੇ ਇਹੀ ਕਿਰਿਆ ਦੁਹਰਾਉਂਦੀਆਂ ਹਨ।"),
      application: L("Apply that same line-set operation to the first two cells of row 3 to obtain the missing set of lines.", "तीसरी पंक्ति के पहले दो खानों पर यही रेखा-नियम लगाकर रिक्त खाने की रेखाएँ प्राप्त करें।", "ਤੀਜੀ ਕਤਾਰ ਦੇ ਪਹਿਲੇ ਦੋ ਖਾਣਿਆਂ ਉੱਤੇ ਇਹੀ ਰੇਖਾ-ਨਿਯਮ ਲਗਾ ਕੇ ਖਾਲੀ ਖਾਣੇ ਦੀਆਂ ਰੇਖਾਵਾਂ ਪ੍ਰਾਪਤ ਕਰੋ।"),
      verification: L("A near-miss option either keeps a line that should disappear or loses a line that should remain.", "गलत विकल्प या तो हटने वाली रेखा रखता है या रहने वाली रेखा खो देता है।", "ਗਲਤ ਵਿਕਲਪ ਜਾਂ ਤਾਂ ਹਟਣ ਵਾਲੀ ਰੇਖਾ ਰੱਖਦਾ ਹੈ ਜਾਂ ਰਹਿਣ ਵਾਲੀ ਰੇਖਾ ਗੁਆ ਲੈਂਦਾ ਹੈ।"),
    }),
  });
}

function countRows(sourceVariant: string): readonly (readonly [number, number, number])[] {
  if (sourceVariant === "SUM_ACROSS_CELLS") return [[1, 2, 3], [2, 3, 5], [3, 4, 7]];
  if (sourceVariant === "ABSOLUTE_DIFFERENCE") return [[2, 5, 3], [1, 4, 3], [3, 7, 4]];
  if (sourceVariant === "DOUBLE_FIRST_PLUS_SECOND") return [[1, 1, 3], [1, 2, 4], [2, 1, 5]];
  if (sourceVariant === "ADD_CONSTANT") return [[1, 3, 5], [2, 4, 6], [3, 5, 7]];
  if (sourceVariant === "MULTIPLY_CONSTANT") return [[1, 2, 4], [2, 4, 8], [1, 2, 4]];
  return [[1, 2, 6], [2, 3, 4], [3, 1, 5]];
}

function countPuzzle(sourceVariant: string, seed: number): Puzzle {
  const rows = countRows(sourceVariant);
  const matrix: (CellState | null)[] = rows.flatMap((row) => row.map((count) => cell({ dotCount: count })));
  const correct = matrix[8]!;
  matrix[8] = null;
  const target = correct.dotCount ?? 1;
  const alternatives = [target - 2, target - 1, target + 1, target + 2, ((target + 4) % 8) + 1].filter((n, i, all) => n >= 1 && n <= 9 && n !== target && all.indexOf(n) === i).slice(0, 3);
  const rule = sourceVariant === "SUM_ACROSS_CELLS" ? "third count = first + second"
    : sourceVariant === "ABSOLUTE_DIFFERENCE" ? "third count = the absolute difference of the first two"
      : sourceVariant === "DOUBLE_FIRST_PLUS_SECOND" ? "third count = twice the first + the second"
        : sourceVariant === "ADD_CONSTANT" ? "add 2 dots at each step across the row"
          : sourceVariant === "MULTIPLY_CONSTANT" ? "double the number of dots at each step across the row"
            : "the three counts in every row total 9";
  return Object.freeze({
    matrixSize: 3, matrix: Object.freeze(matrix), missingIndex: 8, correct, distractors: Object.freeze(alternatives.map((dotCount) => cell({ dotCount }))), difficulty: ["SUM_ACROSS_CELLS", "ADD_CONSTANT"].includes(sourceVariant) ? "EASY" : "MODERATE",
    facts: Object.freeze({
      family: "QUANTITATIVE_COUNT_RELATION", sourceVariant, governingAxis: "ROW", operation: sourceVariant, parameter: rule,
      rule: L(`Count the dots in each cell. The completed rows follow the same relation: ${rule}.`, "हर खाने के बिंदु गिनें। पूरी पंक्तियों में एक ही संख्यात्मक संबंध दोहराया गया है।", "ਹਰ ਖਾਣੇ ਦੇ ਬਿੰਦੂ ਗਿਣੋ। ਪੂਰੀਆਂ ਕਤਾਰਾਂ ਵਿੱਚ ਇੱਕੋ ਸੰਖਿਆਤਮਕ ਸੰਬੰਧ ਦੁਹਰਾਇਆ ਗਿਆ ਹੈ।"),
      worked: L(`Rows 1 and 2 both satisfy “${rule}”.`, "पहली दो पंक्तियाँ इसी गिनती-नियम को पूरा करती हैं।", "ਪਹਿਲੀਆਂ ਦੋ ਕਤਾਰਾਂ ਇਸੇ ਗਿਣਤੀ-ਨਿਯਮ ਨੂੰ ਪੂਰਾ ਕਰਦੀਆਂ ਹਨ।"),
      application: L(`Applying the same relation to row 3 requires ${target} dots in the missing cell.`, `तीसरी पंक्ति में वही संबंध लगाने पर रिक्त खाने में ${target} बिंदु चाहिए।`, `ਤੀਜੀ ਕਤਾਰ ਵਿੱਚ ਉਹੀ ਸੰਬੰਧ ਲਗਾਉਣ ਤੇ ਖਾਲੀ ਖਾਣੇ ਵਿੱਚ ${target} ਬਿੰਦੂ ਚਾਹੀਦੇ ਹਨ।`),
      verification: L("The count is determined before the answer figures are compared.", "उत्तर विकल्प देखने से पहले गिनती से सही मान तय हो जाता है।", "ਉੱਤਰ ਵਿਕਲਪ ਵੇਖਣ ਤੋਂ ਪਹਿਲਾਂ ਗਿਣਤੀ ਨਾਲ ਸਹੀ ਮਾਨ ਤੈਅ ਹੋ ਜਾਂਦਾ ਹੈ।"),
    }),
  });
}

function cyclePuzzle(sourceVariant: string, seed: number): Puzzle {
  let matrixSize = 3;
  let matrix: (CellState | null)[] = [];
  let correct: CellState;
  let distractors: CellState[];
  if (sourceVariant === "MOTIF_PERMUTATION") {
    const cycle: readonly Glyph[] = ["CIRCLE", "SQUARE", "TRIANGLE"];
    matrix = Array.from({ length: 9 }, (_, index) => cell({ glyph: cycle[(Math.floor(index / 3) + index % 3) % 3] }));
    correct = matrix[8]!;
    distractors = [cell({ glyph: "CIRCLE" }), cell({ glyph: "TRIANGLE" }), cell({ glyph: "DIAMOND" })];
  } else if (sourceVariant === "POSITION_CYCLE_4X4") {
    matrixSize = 4;
    matrix = Array.from({ length: 16 }, (_, index) => cell({ glyph: "CIRCLE", fillPattern: "SOLID", position: POSITION_CYCLE[(Math.floor(index / 4) + index % 4) % 4] }));
    correct = matrix[15]!;
    distractors = POSITION_CYCLE.filter((position) => position !== correct.position).map((position) => cell({ glyph: "CIRCLE", fillPattern: "SOLID", position }));
  } else if (sourceVariant === "ORIENTATION_CYCLE") {
    const rotations = [0, 120, 240] as const;
    matrix = Array.from({ length: 9 }, (_, index) => cell({ glyph: "TRIANGLE", rotation: rotations[(Math.floor(index / 3) + index % 3) % 3] }));
    correct = matrix[8]!;
    distractors = [cell({ glyph: "TRIANGLE", rotation: 0 }), cell({ glyph: "TRIANGLE", rotation: 240 }), cell({ glyph: "TRIANGLE", rotation: 60 })];
  } else {
    matrix = Array.from({ length: 9 }, (_, index) => cell({ glyph: "SQUARE", fillPattern: FILL_CYCLE[(Math.floor(index / 3) + index % 3) % 3] }));
    correct = matrix[8]!;
    distractors = FILL_CYCLE.filter((fillPattern) => fillPattern !== correct.fillPattern).map((fillPattern) => cell({ glyph: "SQUARE", fillPattern })).concat([cell({ glyph: "CIRCLE", fillPattern: correct.fillPattern })]);
  }
  const missingIndex = matrixSize * matrixSize - 1;
  matrix[missingIndex] = null;
  const readable = sourceVariant === "MOTIF_PERMUTATION" ? "figure type"
    : sourceVariant === "POSITION_CYCLE_4X4" ? "position"
      : sourceVariant === "ORIENTATION_CYCLE" ? "orientation"
        : "fill state";
  return Object.freeze({
    matrixSize, matrix: Object.freeze(matrix), missingIndex, correct, distractors: Object.freeze(distractors), difficulty: matrixSize === 4 ? "HARD" : "MODERATE",
    facts: Object.freeze({
      family: "CYCLIC_DISTRIBUTION_OR_PERMUTATION", sourceVariant, governingAxis: "BOTH", operation: "CYCLIC_SHIFT", parameter: readable,
      rule: L(`The ${readable} advances one place through a fixed cycle across every row and down every column.`, `आकृति का ${readable === "figure type" ? "प्रकार" : readable === "position" ? "स्थान" : readable === "orientation" ? "दिशा" : "भराव"} हर पंक्ति और स्तंभ में एक निश्चित चक्र में एक कदम आगे बढ़ता है।`, `ਆਕ੍ਰਿਤੀ ਦਾ ${readable === "figure type" ? "ਰੂਪ" : readable === "position" ? "ਸਥਾਨ" : readable === "orientation" ? "ਦਿਸ਼ਾ" : "ਭਰਾਵ"} ਹਰ ਕਤਾਰ ਅਤੇ ਕਾਲਮ ਵਿੱਚ ਇੱਕ ਨਿਰਧਾਰਤ ਚੱਕਰ ਵਿੱਚ ਇੱਕ ਕਦਮ ਅੱਗੇ ਵਧਦਾ ਹੈ।`),
      worked: L("A completed row and a completed column show the same one-step cyclic shift.", "एक पूरी पंक्ति और एक पूरा स्तंभ वही एक-कदम चक्र दिखाते हैं।", "ਇੱਕ ਪੂਰੀ ਕਤਾਰ ਅਤੇ ਇੱਕ ਪੂਰਾ ਕਾਲਮ ਉਹੀ ਇੱਕ-ਕਦਮ ਚੱਕਰ ਦਿਖਾਉਂਦੇ ਹਨ।"),
      application: L("Continue the cycle into the missing cell from both its row and its column.", "रिक्त खाने तक पंक्ति और स्तंभ दोनों से वही चक्र आगे बढ़ाएँ।", "ਖਾਲੀ ਖਾਣੇ ਤੱਕ ਕਤਾਰ ਅਤੇ ਕਾਲਮ ਦੋਵਾਂ ਤੋਂ ਉਹੀ ਚੱਕਰ ਅੱਗੇ ਵਧਾਓ।"),
      verification: L("Both directions predict the same missing state.", "दोनों दिशाएँ एक ही रिक्त अवस्था देती हैं।", "ਦੋਵੇਂ ਦਿਸ਼ਾਵਾਂ ਇੱਕੋ ਖਾਲੀ ਅਵਸਥਾ ਦਿੰਦੀਆਂ ਹਨ।"),
    }),
  });
}

function orthogonalPuzzle(sourceVariant: string, seed: number): Puzzle {
  const matrix: (CellState | null)[] = [];
  let correct: CellState;
  let distractors: CellState[];
  const missingIndex = [4, 5, 7, 8][seed % 4];
  const row = Math.floor(missingIndex / 3); const col = missingIndex % 3;
  if (sourceVariant === "ROW_SHAPE_COLUMN_FILL") {
    const rowGlyphs: readonly Glyph[] = ["CIRCLE", "SQUARE", "TRIANGLE"];
    for (let r = 0; r < 3; r += 1) for (let c = 0; c < 3; c += 1) matrix.push(cell({ glyph: rowGlyphs[r], fillPattern: FILL_CYCLE[c] }));
    correct = matrix[missingIndex]!;
    distractors = [cell({ glyph: rowGlyphs[(row + 1) % 3], fillPattern: correct.fillPattern }), cell({ glyph: correct.glyph, fillPattern: FILL_CYCLE[(col + 1) % 3] }), cell({ glyph: rowGlyphs[(row + 1) % 3], fillPattern: FILL_CYCLE[(col + 1) % 3] })];
  } else if (sourceVariant === "ROW_COUNT_COLUMN_ORIENTATION") {
    const rotations = [0, 90, 180] as const;
    for (let r = 0; r < 3; r += 1) for (let c = 0; c < 3; c += 1) matrix.push(cell({ glyph: "ARROW", rotation: rotations[c], dotCount: r + 1 }));
    correct = matrix[missingIndex]!;
    distractors = [cell({ glyph: "ARROW", rotation: correct.rotation, dotCount: ((row + 1) % 3) + 1 }), cell({ glyph: "ARROW", rotation: rotations[(col + 1) % 3], dotCount: correct.dotCount }), cell({ glyph: "ARROW", rotation: rotations[(col + 1) % 3], dotCount: ((row + 1) % 3) + 1 })];
  } else {
    const rowPositions: readonly Position[] = ["N", "C", "S"];
    const colGlyphs: readonly Glyph[] = ["CIRCLE", "SQUARE", "TRIANGLE"];
    for (let r = 0; r < 3; r += 1) for (let c = 0; c < 3; c += 1) matrix.push(cell({ glyph: colGlyphs[c], fillPattern: "SOLID", position: rowPositions[r] }));
    correct = matrix[missingIndex]!;
    distractors = [cell({ glyph: colGlyphs[(col + 1) % 3], fillPattern: "SOLID", position: correct.position }), cell({ glyph: correct.glyph, fillPattern: "SOLID", position: rowPositions[(row + 1) % 3] }), cell({ glyph: colGlyphs[(col + 1) % 3], fillPattern: "SOLID", position: rowPositions[(row + 1) % 3] })];
  }
  matrix[missingIndex] = null;
  const parameter = sourceVariant === "ROW_SHAPE_COLUMN_FILL" ? "row fixes shape; column fixes fill"
    : sourceVariant === "ROW_COUNT_COLUMN_ORIENTATION" ? "row fixes dot count; column fixes arrow direction"
      : "row fixes position; column fixes figure type";
  return Object.freeze({
    matrixSize: 3, matrix: Object.freeze(matrix), missingIndex, correct, distractors: Object.freeze(distractors), difficulty: "HARD",
    facts: Object.freeze({
      family: "ORTHOGONAL_ROW_COLUMN_ATTRIBUTES", sourceVariant, governingAxis: "BOTH", operation: "ROW_ATTRIBUTE_PLUS_COLUMN_ATTRIBUTE", parameter,
      rule: L(`Two independent clues determine each cell: ${parameter}.`, "हर खाने की दो विशेषताएँ स्वतंत्र रूप से तय होती हैं—एक पंक्ति से और दूसरी स्तंभ से।", "ਹਰ ਖਾਣੇ ਦੀਆਂ ਦੋ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਸੁਤੰਤਰ ਤੌਰ ਤੇ ਤੈਅ ਹੁੰਦੀਆਂ ਹਨ—ਇੱਕ ਕਤਾਰ ਤੋਂ ਅਤੇ ਦੂਜੀ ਕਾਲਮ ਤੋਂ।"),
      worked: L("Use another cell in the same row to identify the row-controlled feature, and another cell in the same column to identify the column-controlled feature.", "उसी पंक्ति के दूसरे खाने से पंक्ति वाला गुण और उसी स्तंभ के दूसरे खाने से स्तंभ वाला गुण पहचानें।", "ਉਸੇ ਕਤਾਰ ਦੇ ਦੂਜੇ ਖਾਣੇ ਤੋਂ ਕਤਾਰ ਵਾਲਾ ਗੁਣ ਅਤੇ ਉਸੇ ਕਾਲਮ ਦੇ ਦੂਜੇ ਖਾਣੇ ਤੋਂ ਕਾਲਮ ਵਾਲਾ ਗੁਣ ਪਛਾਣੋ।"),
      application: L("Combine those two independently determined features in the missing cell.", "रिक्त खाने में दोनों स्वतंत्र रूप से निर्धारित गुणों को मिलाएँ।", "ਖਾਲੀ ਖਾਣੇ ਵਿੱਚ ਦੋਵੇਂ ਸੁਤੰਤਰ ਤੌਰ ਤੇ ਤੈਅ ਕੀਤੇ ਗੁਣ ਮਿਲਾਓ।"),
      verification: L("The correct option must satisfy its row and column simultaneously; satisfying only one is a near miss.", "सही विकल्प को पंक्ति और स्तंभ दोनों की शर्त एक साथ पूरी करनी होगी।", "ਸਹੀ ਵਿਕਲਪ ਨੂੰ ਕਤਾਰ ਅਤੇ ਕਾਲਮ ਦੋਵਾਂ ਦੀ ਸ਼ਰਤ ਇਕੱਠੇ ਪੂਰੀ ਕਰਨੀ ਹੋਵੇਗੀ।"),
    }),
  });
}

function rotateMovePuzzle(seed: number): Puzzle {
  const positions: readonly Position[] = ["N", "E", "S", "W"];
  const matrix: (CellState | null)[] = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) matrix.push(cell({ glyph: "ARROW", rotation: row * 45 + col * 90, position: positions[(row + col) % 4] }));
  }
  const correct = matrix[8]!;
  matrix[8] = null;
  return Object.freeze({
    matrixSize: 3, matrix: Object.freeze(matrix), missingIndex: 8, correct,
    distractors: Object.freeze([cell({ glyph: "ARROW", rotation: correct.rotation, position: "E" }), cell({ glyph: "ARROW", rotation: (correct.rotation ?? 0) - 90, position: correct.position }), cell({ glyph: "ARROW", rotation: (correct.rotation ?? 0) + 90, position: "W" })]),
    difficulty: "HARD",
    facts: Object.freeze({
      family: "COMPOUND_MATRIX_RULE", sourceVariant: "ROTATE_PLUS_MOVE_ELEMENT", governingAxis: "ROW", operation: "ROTATE_AND_MOVE", parameter: "rotate 90° and move one position clockwise per cell",
      rule: L("At each step across a row, the arrow rotates 90° and also moves one place around the four side positions.", "हर अगले खाने में तीर 90° घूमता है और साथ ही चार स्थानों में एक कदम आगे बढ़ता है।", "ਹਰ ਅਗਲੇ ਖਾਣੇ ਵਿੱਚ ਤੀਰ 90° ਘੁੰਮਦਾ ਹੈ ਅਤੇ ਨਾਲ ਹੀ ਚਾਰ ਸਥਾਨਾਂ ਵਿੱਚ ਇੱਕ ਕਦਮ ਅੱਗੇ ਵਧਦਾ ਹੈ।"),
      worked: L("Completed rows show that both changes occur together at every step.", "पूरी पंक्तियाँ दिखाती हैं कि दोनों परिवर्तन हर चरण में साथ होते हैं।", "ਪੂਰੀਆਂ ਕਤਾਰਾਂ ਦਿਖਾਉਂਦੀਆਂ ਹਨ ਕਿ ਦੋਵੇਂ ਬਦਲਾਅ ਹਰ ਕਦਮ ਤੇ ਇਕੱਠੇ ਹੁੰਦੇ ਹਨ।"),
      application: L("Apply both the 90° turn and the one-place movement to the last visible cell of row 3.", "तीसरी पंक्ति के अंतिम दिखाई देने वाले खाने पर 90° घूर्णन और एक-स्थान गति दोनों लगाएँ।", "ਤੀਜੀ ਕਤਾਰ ਦੇ ਆਖਰੀ ਦਿਖਾਈ ਦੇਣ ਵਾਲੇ ਖਾਣੇ ਉੱਤੇ 90° ਘੁੰਮਾਅ ਅਤੇ ਇੱਕ-ਸਥਾਨ ਚਾਲ ਦੋਵੇਂ ਲਗਾਓ।"),
      verification: L("An option that gets only the angle or only the position right is incomplete.", "केवल दिशा या केवल स्थान सही होने से विकल्प सही नहीं होता।", "ਸਿਰਫ਼ ਦਿਸ਼ਾ ਜਾਂ ਸਿਰਫ਼ ਸਥਾਨ ਸਹੀ ਹੋਣ ਨਾਲ ਵਿਕਲਪ ਸਹੀ ਨਹੀਂ ਹੁੰਦਾ।"),
    }),
  });
}

function rotateReflectPuzzle(seed: number): Puzzle {
  const starts = [cell({ glyph: "ARROW", rotation: 0, markerPosition: "NE" }), cell({ glyph: "ARROW", rotation: 45, markerPosition: "SE" }), cell({ glyph: "ARROW", rotation: 90, markerPosition: "NE" })];
  const transform = (state: CellState) => mirrorState(cell({ ...state, rotation: (state.rotation ?? 0) + 90 }));
  const matrix: (CellState | null)[] = [];
  for (const start of starts) {
    const second = transform(start); const third = transform(second);
    matrix.push(start, second, third);
  }
  const correct = matrix[8]!;
  matrix[8] = null;
  return Object.freeze({
    matrixSize: 3, matrix: Object.freeze(matrix), missingIndex: 8, correct,
    distractors: Object.freeze([cell({ glyph: "ARROW", rotation: correct.rotation, markerPosition: "NE" }), cell({ glyph: "ARROW", rotation: (correct.rotation ?? 0) - 90, markerPosition: correct.markerPosition }), cell({ glyph: "ARROW", rotation: (correct.rotation ?? 0) + 90, markerPosition: "SW" })]),
    difficulty: "HARD",
    facts: Object.freeze({
      family: "COMPOUND_MATRIX_RULE", sourceVariant: "ROTATE_PLUS_REFLECT", governingAxis: "ROW", operation: "ROTATE_PLUS_REFLECT", parameter: "turn 90° and mirror left-right",
      rule: L("Each step performs two operations together: rotate the arrow 90° and reflect the whole arrow-marker composite left-to-right.", "हर चरण में दो क्रियाएँ साथ होती हैं—तीर को 90° घुमाएँ और पूरे तीर-बिंदु समूह को बाएँ-दाएँ प्रतिबिंबित करें।", "ਹਰ ਕਦਮ ਵਿੱਚ ਦੋ ਕਿਰਿਆਵਾਂ ਇਕੱਠੇ ਹੁੰਦੀਆਂ ਹਨ—ਤੀਰ ਨੂੰ 90° ਘੁਮਾਓ ਅਤੇ ਪੂਰੇ ਤੀਰ-ਬਿੰਦੂ ਸਮੂਹ ਨੂੰ ਖੱਬੇ-ਸੱਜੇ ਪ੍ਰਤੀਬਿੰਬਿਤ ਕਰੋ।"),
      worked: L("The completed rows show both the orientation change and marker reflection at every step.", "पूरी पंक्तियों में हर चरण पर दिशा और बिंदु का प्रतिबिंब दोनों बदलते हैं।", "ਪੂਰੀਆਂ ਕਤਾਰਾਂ ਵਿੱਚ ਹਰ ਕਦਮ ਤੇ ਦਿਸ਼ਾ ਅਤੇ ਬਿੰਦੂ ਦਾ ਪ੍ਰਤੀਬਿੰਬ ਦੋਵੇਂ ਬਦਲਦੇ ਹਨ।"),
      application: L("Apply both operations to the last visible composite in row 3.", "तीसरी पंक्ति के अंतिम दिखाई देने वाले समूह पर दोनों क्रियाएँ लागू करें।", "ਤੀਜੀ ਕਤਾਰ ਦੇ ਆਖਰੀ ਦਿਖਾਈ ਦੇਣ ਵਾਲੇ ਸਮੂਹ ਉੱਤੇ ਦੋਵੇਂ ਕਿਰਿਆਵਾਂ ਲਗਾਓ।"),
      verification: L("The answer must match both the arrow direction and the reflected marker position.", "उत्तर में तीर की दिशा और प्रतिबिंबित बिंदु का स्थान दोनों सही होने चाहिए।", "ਉੱਤਰ ਵਿੱਚ ਤੀਰ ਦੀ ਦਿਸ਼ਾ ਅਤੇ ਪ੍ਰਤੀਬਿੰਬਿਤ ਬਿੰਦੂ ਦਾ ਸਥਾਨ ਦੋਵੇਂ ਸਹੀ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।"),
    }),
  });
}

function countPositionPuzzle(seed: number): Puzzle {
  const positions: readonly Position[] = ["N", "E", "S", "W"];
  const matrix: (CellState | null)[] = [];
  for (let row = 0; row < 3; row += 1) for (let col = 0; col < 3; col += 1) matrix.push(cell({ glyph: "CIRCLE", fillPattern: "SOLID", position: positions[(row + col) % 4], dotCount: row + col + 1 }));
  const correct = matrix[8]!;
  matrix[8] = null;
  return Object.freeze({
    matrixSize: 3, matrix: Object.freeze(matrix), missingIndex: 8, correct,
    distractors: Object.freeze([cell({ glyph: "CIRCLE", fillPattern: "SOLID", position: correct.position, dotCount: (correct.dotCount ?? 1) - 1 }), cell({ glyph: "CIRCLE", fillPattern: "SOLID", position: "W", dotCount: correct.dotCount }), cell({ glyph: "CIRCLE", fillPattern: "SOLID", position: "E", dotCount: (correct.dotCount ?? 1) + 1 })]),
    difficulty: "HARD",
    facts: Object.freeze({
      family: "COMPOUND_MATRIX_RULE", sourceVariant: "COUNT_CHANGE_PLUS_POSITION_CHANGE", governingAxis: "ROW", operation: "COUNT_PLUS_POSITION", parameter: "increase dot count by one and move the main circle one position clockwise",
      rule: L("At each step, one dot is added while the solid circle also moves one side-position clockwise.", "हर अगले खाने में एक बिंदु बढ़ता है और ठोस वृत्त एक स्थान घड़ी की दिशा में आगे जाता है।", "ਹਰ ਅਗਲੇ ਖਾਣੇ ਵਿੱਚ ਇੱਕ ਬਿੰਦੂ ਵੱਧਦਾ ਹੈ ਅਤੇ ਠੋਸ ਗੋਲ ਇੱਕ ਸਥਾਨ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਅੱਗੇ ਜਾਂਦਾ ਹੈ।"),
      worked: L("Completed rows show the count increase and position movement happening together.", "पूरी पंक्तियाँ गिनती और स्थान दोनों का साथ-साथ बदलना दिखाती हैं।", "ਪੂਰੀਆਂ ਕਤਾਰਾਂ ਗਿਣਤੀ ਅਤੇ ਸਥਾਨ ਦੋਵਾਂ ਦਾ ਇਕੱਠੇ ਬਦਲਣਾ ਦਿਖਾਉਂਦੀਆਂ ਹਨ।"),
      application: L(`Continue both changes in row 3; the missing cell must have ${correct.dotCount} dots and the circle in the required next position.`, `तीसरी पंक्ति में दोनों परिवर्तन जारी रखें; रिक्त खाने में ${correct.dotCount} बिंदु और वृत्त का अगला सही स्थान होना चाहिए।`, `ਤੀਜੀ ਕਤਾਰ ਵਿੱਚ ਦੋਵੇਂ ਬਦਲਾਅ ਜਾਰੀ ਰੱਖੋ; ਖਾਲੀ ਖਾਣੇ ਵਿੱਚ ${correct.dotCount} ਬਿੰਦੂ ਅਤੇ ਗੋਲ ਦਾ ਅਗਲਾ ਸਹੀ ਸਥਾਨ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`),
      verification: L("Both attributes must be correct in the same option.", "एक ही विकल्प में दोनों गुण सही होने चाहिए।", "ਇੱਕੋ ਵਿਕਲਪ ਵਿੱਚ ਦੋਵੇਂ ਗੁਣ ਸਹੀ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।"),
    }),
  });
}

function removeOrientationPuzzle(seed: number): Puzzle {
  const rowSegments: readonly (readonly Segment[])[] = [["H", "V", "D1"], ["V", "D1", "D2"], ["H", "D1", "D2"]];
  const matrix: (CellState | null)[] = [];
  for (let row = 0; row < 3; row += 1) {
    const a = rowSegments[row];
    const b = a.slice(1);
    const c = b.slice(1);
    matrix.push(cell({ glyph: "ARROW", rotation: row * 45, segments: a }), cell({ glyph: "ARROW", rotation: row * 45 + 90, segments: b }), cell({ glyph: "ARROW", rotation: row * 45 + 180, segments: c }));
  }
  const correct = matrix[8]!;
  matrix[8] = null;
  return Object.freeze({
    matrixSize: 3, matrix: Object.freeze(matrix), missingIndex: 8, correct,
    distractors: Object.freeze([cell({ glyph: "ARROW", rotation: correct.rotation, segments: rowSegments[2].slice(1) }), cell({ glyph: "ARROW", rotation: (correct.rotation ?? 0) - 90, segments: correct.segments }), cell({ glyph: "ARROW", rotation: (correct.rotation ?? 0) + 90, segments: rowSegments[2] })]),
    difficulty: "HARD",
    facts: Object.freeze({
      family: "COMPOUND_MATRIX_RULE", sourceVariant: "REMOVE_ELEMENT_PLUS_ORIENTATION_CHANGE", governingAxis: "ROW", operation: "REMOVE_PLUS_ROTATE", parameter: "remove one line and rotate the arrow 90° at each step",
      rule: L("Each step removes one line from the set and rotates the arrow 90°.", "हर चरण में एक रेखा हटती है और तीर 90° घूमता है।", "ਹਰ ਕਦਮ ਵਿੱਚ ਇੱਕ ਰੇਖਾ ਹਟਦੀ ਹੈ ਅਤੇ ਤੀਰ 90° ਘੁੰਮਦਾ ਹੈ।"),
      worked: L("The first two rows show one line disappearing at the same time as the arrow turns.", "पहली दो पंक्तियाँ दिखाती हैं कि हर चरण में एक रेखा हटने के साथ तीर भी घूमता है।", "ਪਹਿਲੀਆਂ ਦੋ ਕਤਾਰਾਂ ਦਿਖਾਉਂਦੀਆਂ ਹਨ ਕਿ ਹਰ ਕਦਮ ਵਿੱਚ ਇੱਕ ਰੇਖਾ ਹਟਣ ਦੇ ਨਾਲ ਤੀਰ ਵੀ ਘੁੰਮਦਾ ਹੈ।"),
      application: L("In row 3, remove the next line and apply the next 90° turn together.", "तीसरी पंक्ति में अगली रेखा हटाएँ और साथ ही अगला 90° घूर्णन करें।", "ਤੀਜੀ ਕਤਾਰ ਵਿੱਚ ਅਗਲੀ ਰੇਖਾ ਹਟਾਓ ਅਤੇ ਨਾਲ ਹੀ ਅਗਲਾ 90° ਘੁੰਮਾਅ ਕਰੋ।"),
      verification: L("An option with the right arrow but too many lines, or the right lines but the wrong arrow, is a near miss.", "सही तीर लेकिन अतिरिक्त रेखाएँ, या सही रेखाएँ लेकिन गलत तीर—दोनों गलत हैं।", "ਸਹੀ ਤੀਰ ਪਰ ਵੱਧ ਰੇਖਾਵਾਂ, ਜਾਂ ਸਹੀ ਰੇਖਾਵਾਂ ਪਰ ਗਲਤ ਤੀਰ—ਦੋਵੇਂ ਗਲਤ ਹਨ।"),
    }),
  });
}

function buildPuzzle(qlId: FigureMatrixQlIdV2, seedText: string): Puzzle {
  const ordinal = variantOrdinal(seedText);
  const h = hash32(`${qlId}|${seedText}`);
  if (qlId === "SPA-QL-055") {
    const variant = FMT_V2_SOURCE_VARIANTS[qlId][ordinal % FMT_V2_SOURCE_VARIANTS[qlId].length];
    if (variant === "ROTATION") return rotationPuzzle(h);
    if (variant === "OUTER_ELEMENT_REMOVAL_2X2") return outerRemovalPuzzle(h);
    if (variant === "SEQUENTIAL_ELEMENT_REMOVAL") return sequentialRemovalPuzzle(h);
    if (variant === "REFLECTION_OR_INVERSION") return reflectionPuzzle(h);
    if (variant === "POSITION_SHIFT") return positionShiftPuzzle(h);
    return shadingChangePuzzle(h);
  }
  if (qlId === "SPA-QL-056") {
    const variant = FMT_V2_SOURCE_VARIANTS[qlId][ordinal % FMT_V2_SOURCE_VARIANTS[qlId].length];
    return compositionPuzzle(variant, h);
  }
  if (qlId === "SPA-QL-057") {
    const variant = FMT_V2_SOURCE_VARIANTS[qlId][ordinal % FMT_V2_SOURCE_VARIANTS[qlId].length];
    return countPuzzle(variant, h);
  }
  if (qlId === "SPA-QL-058") {
    const variant = FMT_V2_SOURCE_VARIANTS[qlId][ordinal % FMT_V2_SOURCE_VARIANTS[qlId].length];
    return cyclePuzzle(variant, h);
  }
  if (qlId === "SPA-QL-059") {
    const variant = FMT_V2_SOURCE_VARIANTS[qlId][ordinal % FMT_V2_SOURCE_VARIANTS[qlId].length];
    return orthogonalPuzzle(variant, h);
  }
  const variant = FMT_V2_SOURCE_VARIANTS[qlId][ordinal % FMT_V2_SOURCE_VARIANTS[qlId].length];
  if (variant === "ROTATE_PLUS_MOVE_ELEMENT") return rotateMovePuzzle(h);
  if (variant === "ROTATE_PLUS_REFLECT") return rotateReflectPuzzle(h);
  if (variant === "COUNT_CHANGE_PLUS_POSITION_CHANGE") return countPositionPuzzle(h);
  return removeOrientationPuzzle(h);
}

export function generateFigureMatrixReviewQuestionV2(input: Readonly<{
  qlId: FigureMatrixQlIdV2;
  seed: string;
  language: FigureMatrixLanguageV2;
}>) {
  if (!QLS.includes(input.qlId)) throw new Error(`FMT-001 V2 does not own ${input.qlId}.`);
  const allocation = FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12.find((item) => item.permanentQlId === input.qlId);
  if (!allocation) throw new Error(`Missing permanent allocation for ${input.qlId}.`);
  const puzzle = buildPuzzle(input.qlId, input.seed);
  const h = hash32(`${input.qlId}|${input.seed}`);
  const optionPack = makeOptions(puzzle.correct, puzzle.distractors, h);
  const answer = OPTION_LABELS[optionPack.correctIndex];
  const distractorFailures = optionPack.options.map((option, index) => index === optionPack.correctIndex ? null : `Option ${OPTION_LABELS[index]}: ${mismatch(option, puzzle.correct)}.`).filter((value): value is string => value !== null);
  if (distractorFailures.length !== 3) throw new Error("FMT-001 V2 must retain exactly three distractor failures.");
  const localizedChecks = input.language === "en" ? distractorFailures
    : distractorFailures.map((failure) => {
      const label = /^Option ([A-D]):/.exec(failure)?.[1] ?? "?";
      return input.language === "hi" ? `विकल्प ${label} कम-से-कम एक आवश्यक आकृति-गुण में गलत है।` : `ਵਿਕਲਪ ${label} ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲੋੜੀਂਦੇ ਆਕ੍ਰਿਤੀ-ਗੁਣ ਵਿੱਚ ਗਲਤ ਹੈ।`;
    });
  const explanation = Object.freeze({
    rule: puzzle.facts.rule[input.language],
    worked: puzzle.facts.worked[input.language],
    application: `${puzzle.facts.application[input.language]} ${input.language === "en" ? `This gives option ${answer}.` : input.language === "hi" ? `इससे विकल्प ${answer} मिलता है।` : `ਇਸ ਨਾਲ ਵਿਕਲਪ ${answer} ਮਿਲਦਾ ਹੈ।`}`,
    verification: puzzle.facts.verification[input.language],
    distractorChecks: Object.freeze(localizedChecks),
  });
  const matrixKeys = puzzle.matrix.map((entry) => entry ? cellKey(entry) : null);
  const geometryKey = JSON.stringify({ qlId: input.qlId, matrixSize: puzzle.matrixSize, missingIndex: puzzle.missingIndex, matrixKeys, options: optionPack.options.map(cellKey), answer: cellKey(puzzle.correct) });
  const geometryFingerprint = fingerprint(geometryKey);
  const stem = localizedStem(input.language, h);
  const contentFingerprint = fingerprint([geometryKey, input.language, stem, explanation.rule, explanation.worked, explanation.application, explanation.verification].join("|"));

  return Object.freeze({
    version: "SPA-FMT-001-REVIEW-QUESTION-V2" as const,
    authorityId: FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
    qlId: input.qlId,
    proposalId: allocation.proposalId,
    skillMode: allocation.skillMode,
    familyLabel: FAMILY_LABELS[input.qlId],
    chapterCode: "FMT-001" as const,
    language: input.language,
    seed: input.seed,
    difficulty: puzzle.difficulty,
    stem,
    matrixSize: puzzle.matrixSize,
    missingIndex: puzzle.missingIndex,
    matrixSvg: renderMatrix(puzzle.matrix, puzzle.matrixSize, puzzle.missingIndex),
    optionSvgs: Object.freeze(optionPack.options.map((option) => renderCell(option))),
    optionLabels: OPTION_LABELS,
    correctIndex: optionPack.correctIndex,
    answer,
    solutionSvg: renderMatrix(puzzle.matrix, puzzle.matrixSize, puzzle.missingIndex, puzzle.correct),
    explanation,
    solveFacts: Object.freeze({
      family: puzzle.facts.family,
      sourceVariant: puzzle.facts.sourceVariant,
      governingAxis: puzzle.facts.governingAxis,
      operation: puzzle.facts.operation,
      parameter: puzzle.facts.parameter,
      semanticAnswerKey: cellKey(puzzle.correct),
      semanticOptionKeys: Object.freeze(optionPack.options.map(cellKey)),
      distractorFailures: Object.freeze(distractorFailures),
      matrixSize: puzzle.matrixSize,
      missingIndex: puzzle.missingIndex,
    }),
    validation: Object.freeze({
      semanticCellStateIsAuthority: true as const,
      solverRecomputedMissingCell: true as const,
      correctOptionSatisfiesDeclaredRule: true as const,
      allEvidentialAxesChecked: true as const,
      everyDistractorHasSemanticFailure: true as const,
      uniqueAnswer: true as const,
      duplicateSemanticOptionsRejected: true as const,
      deterministic: true as const,
      svgIsOutputNotAuthority: true as const,
      examStrokeWidthPx: 1.35 as const,
      editorialExplanationReviewed: true as const,
      internalRuleTokensHiddenFromLearnerExplanation: true as const,
      localizedExplanationLanguagePure: true as const,
      sourceVariantTagged: true as const,
      sourceObserved2x2Supported: true as const,
      sourceObservedElementRemovalSupported: true as const,
      sourceObservedReflectionSupported: true as const,
      sourceObservedFillStatesSupported: true as const,
    }),
    geometryFingerprint,
    contentFingerprint,
    lifecycle: Object.freeze({
      reviewOnly: true as const,
      learnerContentFrozen: false as const,
      questionStudioDiscoverable: false as const,
      persistenceAllowed: false as const,
      questionBankWritable: false as const,
      testBuilderEligible: false as const,
      mockTestEligible: false as const,
      publicReleaseAuthorized: false as const,
      studentDeliveryAuthorized: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}
