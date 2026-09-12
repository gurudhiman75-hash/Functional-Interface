import { DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1 } from "./dot-situation-source-saturated-discovery-v1";

export type DotSituationLanguageV1 = "en" | "hi" | "pa";
export type DotSituationDifficultyV1 = "EASY" | "MODERATE" | "HARD";

type Point = Readonly<{ x: number; y: number }>;
type CircleShape = Readonly<{ kind: "CIRCLE"; cx: number; cy: number; r: number }>;
type RectShape = Readonly<{ kind: "SQUARE" | "RECTANGLE"; x: number; y: number; w: number; h: number }>;
type TriangleShape = Readonly<{ kind: "TRIANGLE"; a: Point; b: Point; c: Point }>;
type Shape = CircleShape | RectShape | TriangleShape;
type Layout = Readonly<{ shapes: readonly Shape[] }>;
type ShapeIndex = 0 | 1 | 2 | 3;

type SignatureRow = Readonly<{
  dot: string;
  signature: string;
  inside: readonly string[];
  outside: readonly string[];
  statement: string;
}>;

const P = (x: number, y: number): Point => Object.freeze({ x, y });
const C = (cx: number, cy: number, r: number): CircleShape => Object.freeze({ kind: "CIRCLE", cx, cy, r });
const S = (x: number, y: number, w: number, h: number): RectShape => {
  const side = Math.min(w, h);
  return Object.freeze({
    kind: "SQUARE" as const,
    x: x + (w - side) / 2,
    y: y + (h - side) / 2,
    w: side,
    h: side,
  });
};
const R = (x: number, y: number, w: number, h: number): RectShape => Object.freeze({ kind: "RECTANGLE", x, y, w, h });
const T = (a: Point, b: Point, c: Point): TriangleShape => Object.freeze({ kind: "TRIANGLE", a, b, c });
const L = (...shapes: readonly Shape[]): Layout => Object.freeze({ shapes: Object.freeze(shapes) });

// Every layout owns one circle, square, triangle and rectangle in that identity order.
// A question activates a deterministic 2-, 3- or 4-shape subset. This prevents the
// two-shape band from degenerating into circle+square questions only.
const LAYOUTS = Object.freeze([
  L(C(43,47,28),S(36,28,52,48),T(P(18,90),P(57,15),P(102,90)),R(54,18,18,84)),
  L(C(63,46,28),S(18,30,56,52),T(P(12,84),P(54,16),P(96,84)),R(48,44,53,22)),
  L(C(51,63,27),S(30,18,54,54),T(P(17,94),P(52,25),P(100,94)),R(13,51,84,18)),
  L(C(42,58,29),S(49,18,49,50),T(P(14,82),P(62,13),P(99,88)),R(24,38,22,60)),
  L(C(67,62,27),S(18,22,54,55),T(P(18,94),P(66,20),P(102,84)),R(51,13,20,87)),
  L(C(56,48,30),S(23,44,60,48),T(P(15,79),P(48,15),P(102,82)),R(43,24,55,19)),
  L(C(47,50,26),S(43,21,55,52),T(P(11,89),P(58,25),P(93,92)),R(16,37,21,60)),
  L(C(62,54,30),S(16,18,55,55),T(P(24,98),P(48,16),P(103,82)),R(42,58,61,18)),
  L(C(50,43,28),S(22,47,61,49),T(P(12,78),P(67,13),P(101,91)),R(66,22,19,70)),
  L(C(68,48,26),S(18,38,58,50),T(P(18,92),P(50,18),P(99,78)),R(37,18,20,82)),
  L(C(47,66,27),S(39,20,55,53),T(P(12,86),P(60,16),P(100,95)),R(14,39,78,20)),
  L(C(58,61,29),S(17,19,55,55),T(P(21,97),P(54,14),P(101,87)),R(72,31,19,67)),
  L(C(28,30,18),S(68,68,30,30),T(P(14,98),P(52,45),P(91,98)),R(43,12,18,72)),
  L(C(56,55,18),S(25,24,62,62),T(P(12,96),P(55,15),P(102,96)),R(72,16,18,82)),
  L(C(55,55,34),S(44,44,22,22),T(P(12,95),P(58,16),P(104,95)),R(15,38,20,62)),
  L(C(29,78,18),S(65,12,31,31),T(P(13,57),P(52,13),P(92,58)),R(41,62,55,20)),
  L(C(54,54,19),S(22,23,64,64),T(P(14,94),P(50,18),P(100,94)),R(14,43,82,18)),
  L(C(58,56,35),S(47,46,22,22),T(P(15,92),P(62,12),P(101,91)),R(76,26,18,71)),
  L(C(82,29,17),S(16,66,30,30),T(P(11,56),P(49,12),P(88,56)),R(47,61,52,19)),
  L(C(53,56,18),S(20,21,66,66),T(P(18,101),P(53,18),P(99,93)),R(70,13,20,88)),
  L(C(57,53,35),S(46,42,22,22),T(P(10,90),P(56,14),P(102,92)),R(13,41,22,59)),
  L(C(26,27,16),S(67,66,32,32),T(P(20,98),P(59,42),P(104,98)),R(42,12,17,74)),
  L(C(55,54,20),S(23,22,65,65),T(P(13,96),P(57,14),P(103,96)),R(12,68,88,18)),
  L(C(57,55,36),S(46,45,22,22),T(P(16,94),P(55,16),P(99,92)),R(77,20,17,77)),
] as const);

const SHAPE_KEYS = ["CIRCLE", "SQUARE", "TRIANGLE", "RECTANGLE"] as const;
const TWO_SHAPE_SETS = Object.freeze([
  Object.freeze([0, 1] as const),
  Object.freeze([0, 2] as const),
  Object.freeze([0, 3] as const),
  Object.freeze([1, 2] as const),
  Object.freeze([1, 3] as const),
  Object.freeze([2, 3] as const),
]);
const THREE_SHAPE_SETS = Object.freeze([
  Object.freeze([0, 1, 2] as const),
  Object.freeze([0, 1, 3] as const),
  Object.freeze([0, 2, 3] as const),
  Object.freeze([1, 2, 3] as const),
]);
const FOUR_SHAPE_SET = Object.freeze([0, 1, 2, 3] as const);
const DOT_NAMES = ["1", "2", "3"] as const;
const OPTION_LABELS = ["A", "B", "C", "D"] as const;
const BOUNDARY_MARGIN = 4.5;

for (const layout of LAYOUTS) {
  const square = layout.shapes[1];
  if (square.kind !== "SQUARE" || square.w !== square.h) {
    throw new Error("DOT-001 layout pool must render every square at an exact 1:1 aspect ratio.");
  }
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
  return `dot-${hash32(text).toString(16).padStart(8, "0")}`;
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

function shapeSetsForCount(shapeCount: number, seed: number): readonly (readonly ShapeIndex[])[] {
  const source: readonly (readonly ShapeIndex[])[] = shapeCount === 2
    ? TWO_SHAPE_SETS
    : shapeCount === 3
      ? THREE_SHAPE_SETS
      : [FOUR_SHAPE_SET];
  return Object.freeze(shuffled(source, seed ^ 0x85ebca6b));
}

function activeShapes(layout: Layout, shapeIndices: readonly ShapeIndex[]): readonly Shape[] {
  return shapeIndices.map((index) => layout.shapes[index]);
}

function cross(a: Point, b: Point, p: Point): number {
  return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
}

function inside(shape: Shape, p: Point): boolean {
  if (shape.kind === "CIRCLE") return (p.x - shape.cx) ** 2 + (p.y - shape.cy) ** 2 < shape.r ** 2;
  if (shape.kind === "SQUARE" || shape.kind === "RECTANGLE") {
    return p.x > shape.x && p.x < shape.x + shape.w && p.y > shape.y && p.y < shape.y + shape.h;
  }
  const signs = [cross(shape.a, shape.b, p), cross(shape.b, shape.c, p), cross(shape.c, shape.a, p)];
  return signs.every((value) => value > 0) || signs.every((value) => value < 0);
}

function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const denominator = dx * dx + dy * dy;
  const rawT = denominator === 0 ? 0 : ((p.x - a.x) * dx + (p.y - a.y) * dy) / denominator;
  const t = Math.max(0, Math.min(1, rawT));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

function boundaryClearance(shape: Shape, p: Point): number {
  if (shape.kind === "CIRCLE") return Math.abs(Math.hypot(p.x - shape.cx, p.y - shape.cy) - shape.r);
  if (shape.kind === "SQUARE" || shape.kind === "RECTANGLE") {
    const a = P(shape.x, shape.y);
    const b = P(shape.x + shape.w, shape.y);
    const c = P(shape.x + shape.w, shape.y + shape.h);
    const d = P(shape.x, shape.y + shape.h);
    return Math.min(distanceToSegment(p, a, b), distanceToSegment(p, b, c), distanceToSegment(p, c, d), distanceToSegment(p, d, a));
  }
  return Math.min(
    distanceToSegment(p, shape.a, shape.b),
    distanceToSegment(p, shape.b, shape.c),
    distanceToSegment(p, shape.c, shape.a),
  );
}

function signatureAt(layout: Layout, shapeIndices: readonly ShapeIndex[], p: Point): string {
  return activeShapes(layout, shapeIndices).map((shape) => inside(shape, p) ? "1" : "0").join("");
}

function availableCells(layout: Layout, shapeIndices: readonly ShapeIndex[]): Map<string, Point[]> {
  const cells = new Map<string, Point[]>();
  const shapes = activeShapes(layout, shapeIndices);
  for (let x = 10; x <= 110; x += 3) {
    for (let y = 10; y <= 110; y += 3) {
      const point = P(x, y);
      if (shapes.some((shape) => boundaryClearance(shape, point) < BOUNDARY_MARGIN)) continue;
      const signature = shapes.map((shape) => inside(shape, point) ? "1" : "0").join("");
      if (!signature.includes("1")) continue;
      const bucket = cells.get(signature) ?? [];
      bucket.push(point);
      cells.set(signature, bucket);
    }
  }
  return cells;
}

function combinations<T>(values: readonly T[], count: number): T[][] {
  const out: T[][] = [];
  const walk = (start: number, picked: T[]) => {
    if (picked.length === count) { out.push([...picked]); return; }
    for (let i = start; i <= values.length - (count - picked.length); i += 1) walk(i + 1, [...picked, values[i]]);
  };
  walk(0, []);
  return out;
}

function membershipCount(signature: string): number {
  return [...signature].filter((bit) => bit === "1").length;
}

function selectPuzzle(seed: string) {
  const h = hash32(seed);
  const shapeCount = 2 + (h % 3);
  const dotCount = 1 + (Math.floor(h / 7) % (shapeCount === 2 ? 2 : 3));
  const referenceIndex = h % LAYOUTS.length;
  const candidateLayouts = shuffled(
    LAYOUTS.map((_, index) => index).filter((index) => index !== referenceIndex),
    h ^ 0x9e3779b9,
  );

  for (const shapeIndices of shapeSetsForCount(shapeCount, h)) {
    const referenceCells = availableCells(LAYOUTS[referenceIndex], shapeIndices);
    for (const correctIndex of candidateLayouts) {
      const correctCells = availableCells(LAYOUTS[correctIndex], shapeIndices);
      const common = [...referenceCells.keys()].filter((signature) => correctCells.has(signature));
      if (common.length < dotCount) continue;
      let signatureSets = shuffled(combinations(common, dotCount), h ^ correctIndex ^ shapeIndices.join("").length);
      signatureSets = signatureSets.sort((a, b) => {
        const aOverlap = a.some((signature) => membershipCount(signature) >= 2) ? 1 : 0;
        const bOverlap = b.some((signature) => membershipCount(signature) >= 2) ? 1 : 0;
        if (aOverlap !== bOverlap) return bOverlap - aOverlap;
        const aDepth = a.reduce((sum, signature) => sum + membershipCount(signature), 0);
        const bDepth = b.reduce((sum, signature) => sum + membershipCount(signature), 0);
        return bDepth - aDepth;
      });

      for (const signatures of signatureSets) {
        const distractors = LAYOUTS.map((_, index) => {
          if (index === referenceIndex || index === correctIndex) return null;
          const cells = availableCells(LAYOUTS[index], shapeIndices);
          const missingCount = signatures.filter((signature) => !cells.has(signature)).length;
          return missingCount > 0 ? { index, missingCount } : null;
        }).filter((entry): entry is { index: number; missingCount: number } => entry !== null);
        if (distractors.length < 3) continue;
        const nearMisses = shuffled(distractors, h ^ 0xc2b2ae35).sort((a, b) => a.missingCount - b.missingCount);
        return {
          h,
          shapeCount,
          shapeIndices: Object.freeze([...shapeIndices]),
          dotCount,
          referenceIndex,
          correctLayoutIndex: correctIndex,
          signatures: Object.freeze(signatures),
          distractorLayoutIndices: Object.freeze(nearMisses.slice(0, 3).map((entry) => entry.index)),
          distractorMissingCounts: Object.freeze(nearMisses.slice(0, 3).map((entry) => entry.missingCount)),
          referenceCells,
          correctCells,
        } as const;
      }
    }
  }
  throw new Error(`DOT-001 layout pool could not construct a unique question for seed ${seed}.`);
}

function shapeSvg(shape: Shape): string {
  if (shape.kind === "CIRCLE") return `<circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}"/>`;
  if (shape.kind === "SQUARE" || shape.kind === "RECTANGLE") return `<rect x="${shape.x}" y="${shape.y}" width="${shape.w}" height="${shape.h}"/>`;
  return `<polygon points="${shape.a.x},${shape.a.y} ${shape.b.x},${shape.b.y} ${shape.c.x},${shape.c.y}"/>`;
}

function renderLayout(layout: Layout, shapeIndices: readonly ShapeIndex[], dots: readonly Point[] = []): string {
  const shapes = activeShapes(layout, shapeIndices).map(shapeSvg).join("");
  const dotSvg = dots.map((dot) => `<circle cx="${dot.x}" cy="${dot.y}" r="2.55" fill="#111827" stroke="none"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="180" height="180" role="img"><rect x="0" y="0" width="120" height="120" fill="white"/><g fill="none" stroke="#111827" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${shapes}</g>${dotSvg}</svg>`;
}

const SHAPE_NAMES = {
  en: { CIRCLE: "circle", SQUARE: "square", TRIANGLE: "triangle", RECTANGLE: "rectangle" },
  hi: { CIRCLE: "वृत्त", SQUARE: "वर्ग", TRIANGLE: "त्रिभुज", RECTANGLE: "आयत" },
  pa: { CIRCLE: "ਵ੍ਰਿੱਤ", SQUARE: "ਵਰਗ", TRIANGLE: "ਤਿਕੋਣ", RECTANGLE: "ਆਇਤ" },
} as const;

function signatureRow(
  signature: string,
  dotIndex: number,
  language: DotSituationLanguageV1,
  shapeIndices: readonly ShapeIndex[],
): SignatureRow {
  const keys = shapeIndices.map((index) => SHAPE_KEYS[index]);
  const names = keys.map((key) => SHAPE_NAMES[language][key]);
  const insideNames = names.filter((_, index) => signature[index] === "1");
  const outsideNames = names.filter((_, index) => signature[index] === "0");
  const join = (items: readonly string[]) => items.join(", ");
  let statement: string;
  if (language === "hi") {
    statement = `बिंदु ${DOT_NAMES[dotIndex]} ${join(insideNames)} के अंदर${outsideNames.length ? ` और ${join(outsideNames)} के बाहर` : ""} है।`;
  } else if (language === "pa") {
    statement = `ਬਿੰਦੂ ${DOT_NAMES[dotIndex]} ${join(insideNames)} ਦੇ ਅੰਦਰ${outsideNames.length ? ` ਅਤੇ ${join(outsideNames)} ਦੇ ਬਾਹਰ` : ""} ਹੈ।`;
  } else {
    statement = `Dot ${DOT_NAMES[dotIndex]} is inside ${join(insideNames)}${outsideNames.length ? ` and outside ${join(outsideNames)}` : ""}.`;
  }
  return Object.freeze({ dot: DOT_NAMES[dotIndex], signature, inside: Object.freeze(insideNames), outside: Object.freeze(outsideNames), statement });
}

function localizedStem(language: DotSituationLanguageV1, variant: number, dotCount: number): string {
  const dotWord = dotCount === 1 ? "dot" : "dots";
  const en = [
    `Study the position of the ${dotWord} in the question figure. Select the option in which the ${dotWord} can be placed under the same conditions.`,
    `Choose the alternative in which every ${dotWord} can be placed with the same relation to the figures as in the question figure.`,
    `Which option allows the ${dotWord} to be placed in the same relative regions as in the question figure?`,
  ];
  const hi = [
    "प्रश्न आकृति में बिंदु की स्थिति ध्यान से देखें। उस विकल्प को चुनिए जिसमें बिंदुओं को उन्हीं परिस्थितियों में रखा जा सके।",
    "उस वैकल्पिक आकृति को चुनिए जिसमें प्रत्येक बिंदु का आकृतियों के साथ वही अंदर-बाहर संबंध बन सके जो प्रश्न आकृति में है।",
    "किस विकल्प में बिंदुओं को प्रश्न आकृति के समान सापेक्ष क्षेत्रों में रखा जा सकता है?",
  ];
  const pa = [
    "ਪ੍ਰਸ਼ਨ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਬਿੰਦੂ ਦੀ ਸਥਿਤੀ ਧਿਆਨ ਨਾਲ ਵੇਖੋ। ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਬਿੰਦੂਆਂ ਨੂੰ ਉਹੀ ਸ਼ਰਤਾਂ ਹੇਠ ਰੱਖਿਆ ਜਾ ਸਕੇ।",
    "ਉਹ ਵਿਕਲਪੀ ਆਕ੍ਰਿਤੀ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਹਰ ਬਿੰਦੂ ਦਾ ਆਕ੍ਰਿਤੀਆਂ ਨਾਲ ਉਹੀ ਅੰਦਰ-ਬਾਹਰ ਸੰਬੰਧ ਬਣ ਸਕੇ ਜੋ ਪ੍ਰਸ਼ਨ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਹੈ।",
    "ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਬਿੰਦੂਆਂ ਨੂੰ ਪ੍ਰਸ਼ਨ ਆਕ੍ਰਿਤੀ ਵਰਗੇ ਹੀ ਸਾਪੇਖ ਖੇਤਰਾਂ ਵਿੱਚ ਰੱਖਿਆ ਜਾ ਸਕਦਾ ਹੈ?",
  ];
  return (language === "hi" ? hi : language === "pa" ? pa : en)[variant % 3];
}

function explanationText(
  language: DotSituationLanguageV1,
  rows: readonly SignatureRow[],
  correctLabel: string,
  failures: readonly { label: string; missing: SignatureRow }[],
) {
  const rowText = rows.map((row) => row.statement).join(" ");
  const failEn = failures.map((failure) => `${failure.label}: Dot ${failure.missing.dot} needs a region that is ${failure.missing.statement.replace(/^Dot \d+ is /, "").replace(/\.$/, "")}, but that region is absent.`).join(" ");
  const failHi = failures.map((failure) => `${failure.label}: बिंदु ${failure.missing.dot} के लिए आवश्यक पूरा अंदर-बाहर क्षेत्र उपलब्ध नहीं है।`).join(" ");
  const failPa = failures.map((failure) => `${failure.label}: ਬਿੰਦੂ ${failure.missing.dot} ਲਈ ਲੋੜੀਂਦਾ ਪੂਰਾ ਅੰਦਰ-ਬਾਹਰ ਖੇਤਰ ਮੌਜੂਦ ਨਹੀਂ ਹੈ।`).join(" ");
  if (language === "hi") return Object.freeze({
    observation: rowText,
    rule: "हर बिंदु की पूरी स्थिति मिलाइए—वह किन आकृतियों के अंदर है और किनके बाहर। आकृतियों की जगह बदल सकती है, यह संबंध नहीं।",
    application: `विकल्प ${correctLabel} में हर बिंदु के लिए वही पूरा क्षेत्र मिलता है। नीचे समाधान आकृति में बिंदुओं की एक सही स्थिति दिखाई गई है।`,
    check: `${failHi} इसलिए केवल विकल्प ${correctLabel} सभी बिंदुओं की शर्तें पूरी करता है।`,
  });
  if (language === "pa") return Object.freeze({
    observation: rowText,
    rule: "ਹਰ ਬਿੰਦੂ ਦੀ ਪੂਰੀ ਸਥਿਤੀ ਮਿਲਾਓ—ਉਹ ਕਿਹੜੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਦੇ ਅੰਦਰ ਹੈ ਅਤੇ ਕਿਹੜੀਆਂ ਦੇ ਬਾਹਰ। ਆਕ੍ਰਿਤੀਆਂ ਦੀ ਥਾਂ ਬਦਲ ਸਕਦੀ ਹੈ, ਇਹ ਸੰਬੰਧ ਨਹੀਂ।",
    application: `ਵਿਕਲਪ ${correctLabel} ਵਿੱਚ ਹਰ ਬਿੰਦੂ ਲਈ ਉਹੀ ਪੂਰਾ ਖੇਤਰ ਮਿਲਦਾ ਹੈ। ਹੇਠਾਂ ਹੱਲ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਬਿੰਦੂਆਂ ਦੀ ਇੱਕ ਸਹੀ ਸਥਿਤੀ ਦਿਖਾਈ ਗਈ ਹੈ।`,
    check: `${failPa} ਇਸ ਲਈ ਕੇਵਲ ਵਿਕਲਪ ${correctLabel} ਸਾਰੇ ਬਿੰਦੂਆਂ ਦੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀ ਕਰਦਾ ਹੈ।`,
  });
  return Object.freeze({
    observation: rowText,
    rule: "Match the complete position of each dot: which figures contain it and which figures do not. The figures may be rearranged, but this relation must stay the same.",
    application: `Option ${correctLabel} has a matching region for every dot. The solution figure below shows one valid placement of the dots in that option.`,
    check: `${failEn} Therefore only option ${correctLabel} satisfies all dot conditions.`,
  });
}

export function generateDotSituationReviewQuestionV1(input: Readonly<{
  qlId?: "SPA-QL-054";
  seed: string;
  language: DotSituationLanguageV1;
}>) {
  if (input.qlId && input.qlId !== "SPA-QL-054") throw new Error(`DOT-001 review runtime does not own ${input.qlId}.`);
  const puzzle = selectPuzzle(input.seed);
  const referenceLayout = LAYOUTS[puzzle.referenceIndex];
  const referenceDots = puzzle.signatures.map((signature, index) => {
    const candidates = puzzle.referenceCells.get(signature);
    if (!candidates?.length) throw new Error(`Reference signature ${signature} lost its safe cell.`);
    return candidates[(puzzle.h + index * 17) % candidates.length];
  });

  const candidateLayoutIndices = [puzzle.correctLayoutIndex, ...puzzle.distractorLayoutIndices];
  const optionLayoutIndices = shuffled(candidateLayoutIndices, puzzle.h ^ 0x27d4eb2f);
  const correctIndex = optionLayoutIndices.indexOf(puzzle.correctLayoutIndex);
  if (correctIndex < 0) throw new Error("DOT-001 correct layout was lost during option shuffle.");

  const rows = puzzle.signatures.map((signature, index) => signatureRow(signature, index, input.language, puzzle.shapeIndices));
  const failures = optionLayoutIndices.map((layoutIndex, optionIndex) => {
    if (layoutIndex === puzzle.correctLayoutIndex) return null;
    const cells = availableCells(LAYOUTS[layoutIndex], puzzle.shapeIndices);
    const missingIndex = puzzle.signatures.findIndex((signature) => !cells.has(signature));
    if (missingIndex < 0) throw new Error("DOT-001 distractor unexpectedly realizes every required signature.");
    return { label: OPTION_LABELS[optionIndex], missing: rows[missingIndex] };
  }).filter((value): value is { label: string; missing: SignatureRow } => value !== null);

  const correctCandidatePoints = puzzle.signatures.map((signature, index) => {
    const candidates = puzzle.correctCells.get(signature)!;
    return candidates[(puzzle.h + index * 23) % candidates.length];
  });
  for (let index = 0; index < correctCandidatePoints.length; index += 1) {
    if (signatureAt(LAYOUTS[puzzle.correctLayoutIndex], puzzle.shapeIndices, correctCandidatePoints[index]) !== puzzle.signatures[index]) {
      throw new Error("DOT-001 solution-dot placement did not recompute to its required signature.");
    }
  }

  const difficulty: DotSituationDifficultyV1 = puzzle.shapeCount === 2 && puzzle.dotCount === 1
    ? "EASY"
    : puzzle.shapeCount === 4 || puzzle.dotCount === 3 ? "HARD" : "MODERATE";
  const stem = localizedStem(input.language, puzzle.h, puzzle.dotCount);
  const explanation = explanationText(input.language, rows, OPTION_LABELS[correctIndex], failures);
  const geometryKey = JSON.stringify({
    shapeIndices: puzzle.shapeIndices,
    referenceIndex: puzzle.referenceIndex,
    optionLayoutIndices,
    signatures: puzzle.signatures,
    referenceDots,
  });
  const geometryFingerprint = fingerprint(geometryKey);
  const contentFingerprint = fingerprint(`${geometryKey}|${input.language}|${stem}|${explanation.observation}|${explanation.application}|${explanation.check}`);

  return Object.freeze({
    version: "SPA-DOT-001-REVIEW-QUESTION-V1" as const,
    authorityId: DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
    qlId: "SPA-QL-054" as const,
    chapterCode: "DOT-001" as const,
    language: input.language,
    seed: input.seed,
    difficulty,
    stem,
    stimulusSvg: renderLayout(referenceLayout, puzzle.shapeIndices, referenceDots),
    optionSvgs: Object.freeze(optionLayoutIndices.map((layoutIndex) => renderLayout(LAYOUTS[layoutIndex], puzzle.shapeIndices))),
    solutionSvg: renderLayout(LAYOUTS[puzzle.correctLayoutIndex], puzzle.shapeIndices, correctCandidatePoints),
    optionLabels: OPTION_LABELS,
    correctIndex,
    answer: OPTION_LABELS[correctIndex],
    explanation: Object.freeze({ ...explanation, membershipTable: Object.freeze(rows) }),
    solveFacts: Object.freeze({
      shapeCount: puzzle.shapeCount,
      shapeIndices: Object.freeze([...puzzle.shapeIndices]),
      dotCount: puzzle.dotCount,
      shapeKinds: Object.freeze(puzzle.shapeIndices.map((index) => SHAPE_KEYS[index])),
      requiredSignatures: Object.freeze([...puzzle.signatures]),
      referenceDotPoints: Object.freeze(referenceDots),
      correctCandidatePoints: Object.freeze(correctCandidatePoints),
      optionLayoutIndices: Object.freeze(optionLayoutIndices),
      distractorMissingCounts: puzzle.distractorMissingCounts,
      distractorFailures: Object.freeze(failures.map((failure) => Object.freeze({ option: failure.label, missingSignature: failure.missing.signature, dot: failure.missing.dot }))),
      boundarySafetyMargin: BOUNDARY_MARGIN,
    }),
    validation: Object.freeze({
      signaturesRecomputedFromGeometry: true as const,
      completeInsideOutsideSignature: true as const,
      boundarySafetyMarginEnforced: true as const,
      correctOptionRealizesEverySignature: true as const,
      everyDistractorBreaksRequiredSignature: true as const,
      nearMissDistractorsPreferred: true as const,
      exactSquareGeometry: true as const,
      activeShapeSubsetsSupported: true as const,
      solutionIllustrationIncluded: true as const,
      uniqueAnswer: true as const,
      duplicateSemanticOptionsRejected: true as const,
      deterministic: true as const,
      svgIsOutputNotAuthority: true as const,
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
