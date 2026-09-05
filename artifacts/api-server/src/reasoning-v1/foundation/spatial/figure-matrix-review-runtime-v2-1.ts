import {
  FMT_V2_SOURCE_VARIANTS,
  generateFigureMatrixReviewQuestionV2,
  type FigureMatrixLanguageV2,
  type FigureMatrixQlIdV2,
} from "./figure-matrix-review-runtime-v2";

type Segment = "H" | "V" | "D1" | "D2";
type Marker = "NE" | "NW" | "SE" | "SW";
type ArrowMarker = Readonly<{ rotation: number; marker: Marker }>;

const OPTION_LABELS = ["A", "B", "C", "D"] as const;
const SEGMENT_ORDER: readonly Segment[] = ["H", "V", "D1", "D2"];

function hash32(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function fingerprint(text: string): string {
  return `fmt21-${hash32(text).toString(16).padStart(8, "0")}`;
}

function variantOrdinal(seed: string): number {
  const match = /(\d+)$/.exec(seed);
  return match ? Math.max(0, Number(match[1]) - 1) : hash32(seed);
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

function segmentKey(segments: readonly Segment[]): string {
  return SEGMENT_ORDER.filter((segment) => segments.includes(segment)).join("+");
}

function segmentSvg(segments: readonly Segment[], size = 92): string {
  const lines: Record<Segment, string> = {
    H: '<line x1="13" y1="32" x2="51" y2="32"/>',
    V: '<line x1="32" y1="13" x2="32" y2="51"/>',
    D1: '<line x1="17" y1="17" x2="47" y2="47"/>',
    D2: '<line x1="47" y1="17" x2="17" y2="47"/>',
  };
  const content = SEGMENT_ORDER.filter((segment) => segments.includes(segment)).map((segment) => lines[segment]).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" role="img"><rect width="64" height="64" fill="white"/><g fill="none" stroke="#111827" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${content}</g></svg>`;
}

function segmentMatrixSvg(cells: readonly (readonly Segment[] | null)[], missingIndex: number, filled?: readonly Segment[]): string {
  const body = cells.map((entry, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const x = col * 64;
    const y = row * 64;
    const resolved = index === missingIndex && filled ? filled : entry;
    const content = resolved
      ? `<g transform="translate(${x} ${y})">${segmentSvg(resolved, 64).replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g>`
      : `<text x="${x + 32}" y="${y + 39}" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="700" fill="#111827">?</text>`;
    return `<rect x="${x}" y="${y}" width="64" height="64" fill="white" stroke="#111827" stroke-width="1.1"/>${content}`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="240" height="240" role="img">${body}</svg>`;
}

function unionQuestion(input: Readonly<{ qlId: "SPA-QL-056"; seed: string; language: FigureMatrixLanguageV2 }>) {
  const scaffold = generateFigureMatrixReviewQuestionV2({ ...input, seed: `${input.seed}-2` });
  const rows: readonly (readonly [readonly Segment[], readonly Segment[], readonly Segment[]])[] = [
    [["H", "V"], ["V", "D1"], ["H", "V", "D1"]],
    [["D1", "D2", "H"], ["H", "D2"], ["H", "D1", "D2"]],
    [["H", "V", "D1"], ["V", "D2"], ["H", "V", "D1", "D2"]],
  ];
  const matrix = rows.flatMap((row) => [row[0], row[1], row[2]]) as (readonly Segment[] | null)[];
  const correct = rows[2][2];
  matrix[8] = null;
  const candidates: readonly (readonly Segment[])[] = [
    correct,
    ["V"],
    ["H", "D1", "D2"],
    ["H", "D1"],
  ];
  const options = shuffled(candidates, hash32(input.seed) ^ 0x51f15e5d);
  const correctIndex = options.findIndex((candidate) => segmentKey(candidate) === segmentKey(correct));
  const answer = OPTION_LABELS[correctIndex];
  const semanticOptionKeys = options.map(segmentKey);
  const distractorFailures = options.map((candidate, index) => index === correctIndex ? null : `Option ${OPTION_LABELS[index]}: wrong line set for superimposition.`).filter((value): value is string => value !== null);
  const explanation = input.language === "en" ? Object.freeze({
    rule: "In each row, the third cell contains every line that appears in either of the first two cells; a line present in both is still drawn once.",
    worked: "Rows 1 and 2 confirm the same superimposition rule: combine the visible line sets without cancelling a common line.",
    application: `Row 3 contains H, V and D1 in the first cell and V and D2 in the second, so the result needs H, V, D1 and D2. This gives option ${answer}.`,
    verification: "The completed rows use the same operation, and none of the required lines may disappear.",
    distractorChecks: Object.freeze(distractorFailures),
  }) : input.language === "hi" ? Object.freeze({
    rule: "हर पंक्ति में तीसरे खाने में पहले दो खानों में दिखाई देने वाली सभी रेखाएँ शामिल होती हैं; समान रेखा को केवल एक बार रखा जाता है।",
    worked: "पहली दो पूरी पंक्तियाँ यही अध्यारोपण नियम दिखाती हैं—रेखाएँ जोड़ी जाती हैं, समान रेखा रद्द नहीं होती।",
    application: `तीसरी पंक्ति में पहले खाने की रेखाओं और दूसरे खाने की रेखाओं को मिलाने पर चारों रेखाएँ चाहिए। इससे विकल्प ${answer} मिलता है।`,
    verification: "कोई आवश्यक रेखा हटनी नहीं चाहिए।",
    distractorChecks: Object.freeze(options.map((_, index) => index === correctIndex ? null : `विकल्प ${OPTION_LABELS[index]} में आवश्यक रेखा-समूह नहीं बनता।`).filter((value): value is string => value !== null)),
  }) : Object.freeze({
    rule: "ਹਰ ਕਤਾਰ ਵਿੱਚ ਤੀਜੇ ਖਾਣੇ ਵਿੱਚ ਪਹਿਲੇ ਦੋ ਖਾਣਿਆਂ ਵਿੱਚ ਦਿਖਾਈ ਦੇਣ ਵਾਲੀਆਂ ਸਾਰੀਆਂ ਰੇਖਾਵਾਂ ਸ਼ਾਮਲ ਹੁੰਦੀਆਂ ਹਨ; ਸਾਂਝੀ ਰੇਖਾ ਇੱਕ ਵਾਰ ਹੀ ਰਹਿੰਦੀ ਹੈ।",
    worked: "ਪਹਿਲੀਆਂ ਦੋ ਪੂਰੀਆਂ ਕਤਾਰਾਂ ਇਹੀ ਸੁਪਰਇੰਪੋਜ਼ੀਸ਼ਨ ਨਿਯਮ ਦਿਖਾਉਂਦੀਆਂ ਹਨ—ਰੇਖਾਵਾਂ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ, ਸਾਂਝੀ ਰੇਖਾ ਰੱਦ ਨਹੀਂ ਹੁੰਦੀ।",
    application: `ਤੀਜੀ ਕਤਾਰ ਦੇ ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਖਾਣੇ ਦੀਆਂ ਰੇਖਾਵਾਂ ਮਿਲਾਉਣ ਤੇ ਚਾਰੋਂ ਰੇਖਾਵਾਂ ਚਾਹੀਦੀਆਂ ਹਨ। ਇਸ ਨਾਲ ਵਿਕਲਪ ${answer} ਮਿਲਦਾ ਹੈ।`,
    verification: "ਕੋਈ ਲੋੜੀਂਦੀ ਰੇਖਾ ਗਾਇਬ ਨਹੀਂ ਹੋਣੀ ਚਾਹੀਦੀ।",
    distractorChecks: Object.freeze(options.map((_, index) => index === correctIndex ? null : `ਵਿਕਲਪ ${OPTION_LABELS[index]} ਲੋੜੀਂਦਾ ਰੇਖਾ-ਸਮੂਹ ਨਹੀਂ ਬਣਾਉਂਦਾ।`).filter((value): value is string => value !== null)),
  });
  const matrixSvg = segmentMatrixSvg(matrix, 8);
  const solutionSvg = segmentMatrixSvg(matrix, 8, correct);
  const optionSvgs = Object.freeze(options.map((segments) => segmentSvg(segments)));
  const geometryKey = JSON.stringify({ matrix: rows.map((row) => row.map(segmentKey)), missingIndex: 8, options: semanticOptionKeys, correct: segmentKey(correct) });
  const geometryFingerprint = fingerprint(geometryKey);
  const stem = localizedStem(input.language, hash32(input.seed));
  const contentFingerprint = fingerprint([geometryKey, input.language, stem, explanation.rule, explanation.worked, explanation.application].join("|"));
  return Object.freeze({
    ...scaffold,
    version: "SPA-FMT-001-REVIEW-QUESTION-V2.1" as const,
    seed: input.seed,
    language: input.language,
    difficulty: "MODERATE" as const,
    stem,
    matrixSize: 3,
    missingIndex: 8,
    matrixSvg,
    optionSvgs,
    correctIndex,
    answer,
    solutionSvg,
    explanation,
    solveFacts: Object.freeze({
      family: "BINARY_FIGURE_COMPOSITION",
      sourceVariant: "UNION_OR_SUPERIMPOSITION",
      governingAxis: "ROW" as const,
      operation: "UNION_OR_SUPERIMPOSITION",
      parameter: "keep every line appearing in either of the first two cells",
      semanticAnswerKey: segmentKey(correct),
      semanticOptionKeys: Object.freeze(semanticOptionKeys),
      distractorFailures: Object.freeze(distractorFailures),
      matrixSize: 3,
      missingIndex: 8,
    }),
    validation: Object.freeze({ ...scaffold.validation, unionNearMissesSemanticallyDistinct: true as const }),
    geometryFingerprint,
    contentFingerprint,
  });
}

const MIRROR: Readonly<Record<Marker, Marker>> = Object.freeze({ NE: "NW", NW: "NE", SE: "SW", SW: "SE" });
function transform(state: ArrowMarker): ArrowMarker {
  return Object.freeze({ rotation: ((90 - state.rotation) % 360 + 360) % 360, marker: MIRROR[state.marker] });
}
function arrowKey(state: ArrowMarker): string { return `${state.rotation}@${state.marker}`; }
function markerPoint(marker: Marker): readonly [number, number] {
  return marker === "NE" ? [45, 18] : marker === "NW" ? [19, 18] : marker === "SE" ? [45, 46] : [19, 46];
}
function arrowSvg(state: ArrowMarker, size = 92): string {
  const [mx, my] = markerPoint(state.marker);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" role="img"><rect width="64" height="64" fill="white"/><g transform="translate(32 32) rotate(${state.rotation})" fill="none" stroke="#111827" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><line x1="-11" y1="0" x2="10" y2="0"/><polyline points="4,-6 11,0 4,6"/></g><circle cx="${mx}" cy="${my}" r="3" fill="#111827"/></svg>`;
}
function arrowMatrixSvg(cells: readonly (ArrowMarker | null)[], missingIndex: number, filled?: ArrowMarker): string {
  const body = cells.map((entry, index) => {
    const row = Math.floor(index / 3); const col = index % 3; const x = col * 64; const y = row * 64;
    const resolved = index === missingIndex && filled ? filled : entry;
    const content = resolved ? `<g transform="translate(${x} ${y})">${arrowSvg(resolved, 64).replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g>` : `<text x="${x + 32}" y="${y + 39}" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="700" fill="#111827">?</text>`;
    return `<rect x="${x}" y="${y}" width="64" height="64" fill="white" stroke="#111827" stroke-width="1.1"/>${content}`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="240" height="240" role="img">${body}</svg>`;
}

function rotateReflectQuestion(input: Readonly<{ qlId: "SPA-QL-060"; seed: string; language: FigureMatrixLanguageV2 }>) {
  const scaffold = generateFigureMatrixReviewQuestionV2({ ...input, seed: `${input.seed}-1` });
  const starts: readonly ArrowMarker[] = [
    Object.freeze({ rotation: 0, marker: "NE" }),
    Object.freeze({ rotation: 45, marker: "SE" }),
    Object.freeze({ rotation: 90, marker: "NE" }),
  ];
  const matrix: (ArrowMarker | null)[] = [];
  for (const start of starts) {
    const second = transform(start); const third = transform(second);
    matrix.push(start, second, third);
  }
  const correct = matrix[8] as ArrowMarker;
  matrix[8] = null;
  const candidates: readonly ArrowMarker[] = [
    correct,
    Object.freeze({ rotation: correct.rotation, marker: "NW" }),
    Object.freeze({ rotation: 0, marker: correct.marker }),
    Object.freeze({ rotation: 0, marker: "NW" }),
  ];
  const options = shuffled(candidates, hash32(input.seed) ^ 0xa341316c);
  const correctIndex = options.findIndex((candidate) => arrowKey(candidate) === arrowKey(correct));
  const answer = OPTION_LABELS[correctIndex];
  const semanticOptionKeys = options.map(arrowKey);
  const distractorFailures = options.map((candidate, index) => {
    if (index === correctIndex) return null;
    const wrongRotation = candidate.rotation !== correct.rotation;
    const wrongMarker = candidate.marker !== correct.marker;
    return `Option ${OPTION_LABELS[index]}: ${wrongRotation && wrongMarker ? "wrong orientation and reflected marker position" : wrongRotation ? "wrong orientation" : "wrong reflected marker position"}.`;
  }).filter((value): value is string => value !== null);
  const explanation = input.language === "en" ? Object.freeze({
    rule: "At each step, rotate the arrow 90° and then reflect the whole arrow-marker composite left-to-right. Both changes belong to one rule.",
    worked: "Rows 1 and 2 show the same two-part transformation. Because a rotation followed by a reflection is applied again at the next step, the third cell can return to the first cell's overall state.",
    application: `Apply the same two-part transformation to the second cell of row 3. The required arrow-marker state matches option ${answer}.`,
    verification: "The arrow direction and the small marker position must both match; a one-feature match is a distractor.",
    distractorChecks: Object.freeze(distractorFailures),
  }) : input.language === "hi" ? Object.freeze({
    rule: "हर चरण में तीर को 90° घुमाएँ और फिर पूरे तीर-बिंदु समूह को बाएँ-दाएँ प्रतिबिंबित करें। दोनों परिवर्तन एक ही नियम के भाग हैं।",
    worked: "पहली दो पंक्तियाँ यही दो-भाग वाला परिवर्तन दिखाती हैं।",
    application: `तीसरी पंक्ति के दूसरे खाने पर वही दोनों परिवर्तन लगाने से विकल्प ${answer} मिलता है।`,
    verification: "तीर की दिशा और छोटे बिंदु का स्थान दोनों सही होने चाहिए।",
    distractorChecks: Object.freeze(options.map((_, index) => index === correctIndex ? null : `विकल्प ${OPTION_LABELS[index]} में दिशा या प्रतिबिंबित बिंदु का स्थान गलत है।`).filter((value): value is string => value !== null)),
  }) : Object.freeze({
    rule: "ਹਰ ਕਦਮ ਵਿੱਚ ਤੀਰ ਨੂੰ 90° ਘੁਮਾਓ ਅਤੇ ਫਿਰ ਪੂਰੇ ਤੀਰ-ਬਿੰਦੂ ਸਮੂਹ ਨੂੰ ਖੱਬੇ-ਸੱਜੇ ਪ੍ਰਤੀਬਿੰਬਿਤ ਕਰੋ। ਦੋਵੇਂ ਬਦਲਾਅ ਇੱਕੋ ਨਿਯਮ ਦੇ ਹਿੱਸੇ ਹਨ।",
    worked: "ਪਹਿਲੀਆਂ ਦੋ ਕਤਾਰਾਂ ਇਹੀ ਦੋ-ਹਿੱਸਿਆਂ ਵਾਲਾ ਬਦਲਾਅ ਦਿਖਾਉਂਦੀਆਂ ਹਨ।",
    application: `ਤੀਜੀ ਕਤਾਰ ਦੇ ਦੂਜੇ ਖਾਣੇ ਉੱਤੇ ਉਹੀ ਦੋਵੇਂ ਬਦਲਾਅ ਲਗਾਉਣ ਨਾਲ ਵਿਕਲਪ ${answer} ਮਿਲਦਾ ਹੈ।`,
    verification: "ਤੀਰ ਦੀ ਦਿਸ਼ਾ ਅਤੇ ਛੋਟੇ ਬਿੰਦੂ ਦਾ ਸਥਾਨ ਦੋਵੇਂ ਸਹੀ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।",
    distractorChecks: Object.freeze(options.map((_, index) => index === correctIndex ? null : `ਵਿਕਲਪ ${OPTION_LABELS[index]} ਵਿੱਚ ਦਿਸ਼ਾ ਜਾਂ ਪ੍ਰਤੀਬਿੰਬਿਤ ਬਿੰਦੂ ਦਾ ਸਥਾਨ ਗਲਤ ਹੈ।`).filter((value): value is string => value !== null)),
  });
  const matrixSvg = arrowMatrixSvg(matrix, 8);
  const solutionSvg = arrowMatrixSvg(matrix, 8, correct);
  const optionSvgs = Object.freeze(options.map((state) => arrowSvg(state)));
  const geometryKey = JSON.stringify({ matrix: matrix.map((state) => state ? arrowKey(state) : null), options: semanticOptionKeys, correct: arrowKey(correct) });
  const geometryFingerprint = fingerprint(geometryKey);
  const stem = localizedStem(input.language, hash32(input.seed));
  const contentFingerprint = fingerprint([geometryKey, input.language, stem, explanation.rule, explanation.worked, explanation.application].join("|"));
  return Object.freeze({
    ...scaffold,
    version: "SPA-FMT-001-REVIEW-QUESTION-V2.1" as const,
    seed: input.seed,
    language: input.language,
    difficulty: "HARD" as const,
    stem,
    matrixSize: 3,
    missingIndex: 8,
    matrixSvg,
    optionSvgs,
    correctIndex,
    answer,
    solutionSvg,
    explanation,
    solveFacts: Object.freeze({
      family: "COMPOUND_MATRIX_RULE",
      sourceVariant: "ROTATE_PLUS_REFLECT",
      governingAxis: "ROW" as const,
      operation: "ROTATE_PLUS_REFLECT",
      parameter: "rotate 90° and reflect the composite left-right",
      semanticAnswerKey: arrowKey(correct),
      semanticOptionKeys: Object.freeze(semanticOptionKeys),
      distractorFailures: Object.freeze(distractorFailures),
      matrixSize: 3,
      missingIndex: 8,
    }),
    validation: Object.freeze({ ...scaffold.validation, compoundNearMissesSemanticallyDistinct: true as const }),
    geometryFingerprint,
    contentFingerprint,
  });
}

export function generateFigureMatrixReviewQuestionV2_1(input: Readonly<{
  qlId: FigureMatrixQlIdV2;
  seed: string;
  language: FigureMatrixLanguageV2;
}>) {
  const ordinal = variantOrdinal(input.seed);
  if (input.qlId === "SPA-QL-056" && FMT_V2_SOURCE_VARIANTS[input.qlId][ordinal % 4] === "UNION_OR_SUPERIMPOSITION") {
    return unionQuestion({ ...input, qlId: "SPA-QL-056" });
  }
  if (input.qlId === "SPA-QL-060" && FMT_V2_SOURCE_VARIANTS[input.qlId][ordinal % 4] === "ROTATE_PLUS_REFLECT") {
    return rotateReflectQuestion({ ...input, qlId: "SPA-QL-060" });
  }
  const base = generateFigureMatrixReviewQuestionV2(input);
  return Object.freeze({ ...base, version: "SPA-FMT-001-REVIEW-QUESTION-V2.1" as const });
}
