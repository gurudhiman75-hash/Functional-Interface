import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
} from "../../../../question-studio/engine-types.ts";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 as lifecycle } from "../../../../question-studio/standard-lifecycle.ts";

export const VEN_001_SHAPE_REGION_CP_ID = "VEN-CP011" as const;
type L = QuestionStudioLanguage;
type T = Record<L, string>;
const tr = (en: string, hi: string, pa: string): T => ({ en, hi, pa });
const CONTEXTS = [
  {
    id: "SCHOOL_ACTIVITIES",
    sets: [
      tr(
        "students who read the school newspaper",
        "विद्यालय का समाचार-पत्र पढ़ने वाले विद्यार्थी",
        "ਸਕੂਲ ਦਾ ਅਖ਼ਬਾਰ ਪੜ੍ਹਨ ਵਾਲੇ ਵਿਦਿਆਰਥੀ",
      ),
      tr(
        "students who play a team sport",
        "टीम खेल खेलने वाले विद्यार्थी",
        "ਟੀਮ ਖੇਡ ਖੇਡਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ",
      ),
      tr(
        "students who attend the science club",
        "विज्ञान क्लब में जाने वाले विद्यार्थी",
        "ਵਿਗਿਆਨ ਕਲੱਬ ਵਿੱਚ ਜਾਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ",
      ),
    ],
  },
  {
    id: "COMMUNITY_SURVEY",
    sets: [
      tr(
        "residents who use the public library",
        "सार्वजनिक पुस्तकालय का उपयोग करने वाले निवासी",
        "ਜਨਤਕ ਲਾਇਬ੍ਰੇਰੀ ਵਰਤਣ ਵਾਲੇ ਵਸਨੀਕ",
      ),
      tr(
        "residents who use the sports centre",
        "खेल केंद्र का उपयोग करने वाले निवासी",
        "ਖੇਡ ਕੇਂਦਰ ਵਰਤਣ ਵਾਲੇ ਵਸਨੀਕ",
      ),
      tr(
        "residents who attend cultural events",
        "सांस्कृतिक कार्यक्रमों में जाने वाले निवासी",
        "ਸੱਭਿਆਚਾਰਕ ਸਮਾਗਮਾਂ ਵਿੱਚ ਜਾਣ ਵਾਲੇ ਵਸਨੀਕ",
      ),
    ],
  },
  {
    id: "TRAINING_COURSE",
    sets: [
      tr(
        "trainees who completed the safety module",
        "सुरक्षा मॉड्यूल पूरा करने वाले प्रशिक्षु",
        "ਸੁਰੱਖਿਆ ਮੋਡੀਊਲ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਸਿਖਿਆਰਥੀ",
      ),
      tr(
        "trainees who completed the digital-skills module",
        "डिजिटल-कौशल मॉड्यूल पूरा करने वाले प्रशिक्षु",
        "ਡਿਜ਼ਿਟਲ-ਹੁਨਰ ਮੋਡੀਊਲ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਸਿਖਿਆਰਥੀ",
      ),
      tr(
        "trainees who completed the first-aid module",
        "प्राथमिक उपचार मॉड्यूल पूरा करने वाले प्रशिक्षु",
        "ਮੁੱਢਲੀ ਸਹਾਇਤਾ ਮੋਡੀਊਲ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਸਿਖਿਆਰਥੀ",
      ),
    ],
  },
  {
    id: "MEDIA_PREFERENCES",
    sets: [
      tr(
        "people who read the daily paper",
        "दैनिक समाचार-पत्र पढ़ने वाले लोग",
        "ਰੋਜ਼ਾਨਾ ਅਖ਼ਬਾਰ ਪੜ੍ਹਨ ਵਾਲੇ ਲੋਕ",
      ),
      tr(
        "people who listen to a news podcast",
        "समाचार पॉडकास्ट सुनने वाले लोग",
        "ਖ਼ਬਰਾਂ ਦਾ ਪੌਡਕਾਸਟ ਸੁਣਨ ਵਾਲੇ ਲੋਕ",
      ),
      tr(
        "people who watch the evening bulletin",
        "शाम का समाचार बुलेटिन देखने वाले लोग",
        "ਸ਼ਾਮ ਦਾ ਖ਼ਬਰ ਬੁਲੇਟਿਨ ਦੇਖਣ ਵਾਲੇ ਲੋਕ",
      ),
    ],
  },
  {
    id: "HEALTH_CAMP",
    sets: [
      tr(
        "visitors who received a blood-pressure check",
        "रक्तचाप जाँच कराने वाले आगंतुक",
        "ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਦੀ ਜਾਂਚ ਕਰਵਾਉਣ ਵਾਲੇ ਆਏ ਲੋਕ",
      ),
      tr(
        "visitors who received a vision check",
        "दृष्टि जाँच कराने वाले आगंतुक",
        "ਨਜ਼ਰ ਦੀ ਜਾਂਚ ਕਰਵਾਉਣ ਵਾਲੇ ਆਏ ਲੋਕ",
      ),
      tr(
        "visitors who received a diabetes check",
        "मधुमेह जाँच कराने वाले आगंतुक",
        "ਸ਼ੂਗਰ ਦੀ ਜਾਂਚ ਕਰਵਾਉਣ ਵਾਲੇ ਆਏ ਲੋਕ",
      ),
    ],
  },
  {
    id: "WORKPLACE_TOOLS",
    sets: [
      tr(
        "staff who use the project dashboard",
        "परियोजना डैशबोर्ड का उपयोग करने वाले कर्मचारी",
        "ਪ੍ਰੋਜੈਕਟ ਡੈਸ਼ਬੋਰਡ ਵਰਤਣ ਵਾਲੇ ਕਰਮਚਾਰੀ",
      ),
      tr(
        "staff who use the shared calendar",
        "साझा कैलेंडर का उपयोग करने वाले कर्मचारी",
        "ਸਾਂਝਾ ਕੈਲੰਡਰ ਵਰਤਣ ਵਾਲੇ ਕਰਮਚਾਰੀ",
      ),
      tr(
        "staff who use the team chat",
        "टीम चैट का उपयोग करने वाले कर्मचारी",
        "ਟੀਮ ਚੈਟ ਵਰਤਣ ਵਾਲੇ ਕਰਮਚਾਰੀ",
      ),
    ],
  },
  {
    id: "TRAVEL_SURVEY",
    sets: [
      tr(
        "travellers who used a bus",
        "बस से यात्रा करने वाले यात्री",
        "ਬੱਸ ਰਾਹੀਂ ਸਫ਼ਰ ਕਰਨ ਵਾਲੇ ਯਾਤਰੀ",
      ),
      tr(
        "travellers who used a train",
        "रेलगाड़ी से यात्रा करने वाले यात्री",
        "ਰੇਲ ਰਾਹੀਂ ਸਫ਼ਰ ਕਰਨ ਵਾਲੇ ਯਾਤਰੀ",
      ),
      tr(
        "travellers who used a bicycle",
        "साइकिल से यात्रा करने वाले यात्री",
        "ਸਾਈਕਲ ਰਾਹੀਂ ਸਫ਼ਰ ਕਰਨ ਵਾਲੇ ਯਾਤਰੀ",
      ),
    ],
  },
  {
    id: "WEEKEND_HOBBIES",
    sets: [
      tr("people who garden", "बागवानी करने वाले लोग", "ਬਾਗਬਾਨੀ ਕਰਨ ਵਾਲੇ ਲੋਕ"),
      tr(
        "people who cook a new recipe",
        "नई रेसिपी बनाने वाले लोग",
        "ਨਵੀਂ ਰੈਸਿਪੀ ਬਣਾਉਣ ਵਾਲੇ ਲੋਕ",
      ),
      tr(
        "people who take photographs",
        "तस्वीरें लेने वाले लोग",
        "ਤਸਵੀਰਾਂ ਖਿੱਚਣ ਵਾਲੇ ਲੋਕ",
      ),
    ],
  },
] as const;
type Context = (typeof CONTEXTS)[number];
const QUESTIONS: readonly {
  key: string;
  masks: number[];
  label: T;
  pattern: "single" | "pair" | "triple" | "union" | "exactly-one";
}[] = [
  {
    key: "only-A",
    masks: [1],
    label: tr(
      "only the first activity",
      "केवल पहली गतिविधि",
      "ਸਿਰਫ਼ ਪਹਿਲੀ ਗਤੀਵਿਧੀ",
    ),
    pattern: "single",
  },
  {
    key: "only-B",
    masks: [2],
    label: tr(
      "only the second activity",
      "केवल दूसरी गतिविधि",
      "ਸਿਰਫ਼ ਦੂਜੀ ਗਤੀਵਿਧੀ",
    ),
    pattern: "single",
  },
  {
    key: "only-C",
    masks: [4],
    label: tr(
      "only the third activity",
      "केवल तीसरी गतिविधि",
      "ਸਿਰਫ਼ ਤੀਜੀ ਗਤੀਵਿਧੀ",
    ),
    pattern: "single",
  },
  {
    key: "A-and-B-not-C",
    masks: [3],
    label: tr(
      "in the first and second activities, but not the third",
      "पहली और दूसरी गतिविधि में, लेकिन तीसरी में नहीं",
      "ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਗਤੀਵਿਧੀ ਵਿੱਚ, ਪਰ ਤੀਜੀ ਵਿੱਚ ਨਹੀਂ",
    ),
    pattern: "pair",
  },
  {
    key: "A-and-C-not-B",
    masks: [5],
    label: tr(
      "in the first and third activities, but not the second",
      "पहली और तीसरी गतिविधि में, लेकिन दूसरी में नहीं",
      "ਪਹਿਲੀ ਅਤੇ ਤੀਜੀ ਗਤੀਵਿਧੀ ਵਿੱਚ, ਪਰ ਦੂਜੀ ਵਿੱਚ ਨਹੀਂ",
    ),
    pattern: "pair",
  },
  {
    key: "B-and-C-not-A",
    masks: [6],
    label: tr(
      "in the second and third activities, but not the first",
      "दूसरी और तीसरी गतिविधि में, लेकिन पहली में नहीं",
      "ਦੂਜੀ ਅਤੇ ਤੀਜੀ ਗਤੀਵਿਧੀ ਵਿੱਚ, ਪਰ ਪਹਿਲੀ ਵਿੱਚ ਨਹੀਂ",
    ),
    pattern: "pair",
  },
  {
    key: "all-three",
    masks: [7],
    label: tr(
      "inside all three shapes",
      "तीनों आकृतियों के भीतर",
      "ਤਿੰਨਾਂ ਆਕਾਰਾਂ ਦੇ ਅੰਦਰ",
    ),
    pattern: "triple",
  },
  {
    key: "at-least-two",
    masks: [3, 5, 6, 7],
    label: tr(
      "inside at least two shapes",
      "कम-से-कम दो आकृतियों के भीतर",
      "ਘੱਟੋ-ਘੱਟ ਦੋ ਆਕਾਰਾਂ ਦੇ ਅੰਦਰ",
    ),
    pattern: "union",
  },
  {
    key: "exactly-one",
    masks: [1, 2, 4],
    label: tr(
      "inside exactly one shape",
      "ठीक एक आकृति के भीतर",
      "ਠੀਕ ਇੱਕ ਆਕਾਰ ਦੇ ਅੰਦਰ",
    ),
    pattern: "exactly-one",
  },
  {
    key: "any-shape",
    masks: [1, 2, 3, 4, 5, 6, 7],
    label: tr(
      "inside at least one shape",
      "कम-से-कम एक आकृति के भीतर",
      "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਆਕਾਰ ਦੇ ਅੰਦਰ",
    ),
    pattern: "union",
  },
];
function hash(s: string): number {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function text(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}
type ShapeKind =
  | "circle"
  | "ellipse"
  | "rectangle"
  | "square"
  | "triangle"
  | "right-triangle"
  | "diamond"
  | "trapezoid"
  | "pentagon";
export type ShapeLayout = {
  id: string;
  shapes: readonly [ShapeKind, ShapeKind, ShapeKind];
};
export const LAYOUTS: readonly ShapeLayout[] = [
  {
    id: "CIRCLE_RECTANGLE_TRIANGLE",
    shapes: ["circle", "rectangle", "triangle"],
  },
  {
    id: "ELLIPSE_RECTANGLE_TRIANGLE",
    shapes: ["ellipse", "rectangle", "triangle"],
  },
  { id: "CIRCLE_SQUARE_TRIANGLE", shapes: ["circle", "square", "triangle"] },
  {
    id: "CIRCLE_RECTANGLE_DIAMOND",
    shapes: ["circle", "rectangle", "diamond"],
  },
  { id: "ELLIPSE_SQUARE_DIAMOND", shapes: ["ellipse", "square", "diamond"] },
  {
    id: "ELLIPSE_RECTANGLE_DIAMOND",
    shapes: ["ellipse", "rectangle", "diamond"],
  },
  {
    id: "CIRCLE_RECTANGLE_RIGHT_TRIANGLE",
    shapes: ["circle", "rectangle", "right-triangle"],
  },
  {
    id: "ELLIPSE_RECTANGLE_TRAPEZOID",
    shapes: ["ellipse", "rectangle", "trapezoid"],
  },
  {
    id: "CIRCLE_RECTANGLE_PENTAGON",
    shapes: ["circle", "rectangle", "pentagon"],
  },
];
const POLYGONS = {
  triangle: [
    [304, 95],
    [64, 433],
    [538, 463],
  ],
  diamond: [
    [304, 95],
    [538, 279],
    [304, 463],
    [64, 279],
  ],
  "right-triangle": [
    [120, 100],
    [340, 100],
    [120, 480],
  ],
  trapezoid: [
    [176, 92],
    [430, 92],
    [556, 478],
    [54, 478],
  ],
  pentagon: [
    [304, 76],
    [566, 266],
    [466, 478],
    [142, 478],
    [42, 266],
  ],
} as const;
function inside(shape: ShapeKind, x: number, y: number): boolean {
  if (shape === "circle") return (x - 397) ** 2 + (y - 237) ** 2 < 175 ** 2;
  if (shape === "ellipse")
    return (x - 397) ** 2 / 225 ** 2 + (y - 237) ** 2 / 150 ** 2 < 1;
  if (shape === "rectangle") return x > 76 && x < 575 && y > 200 && y < 374;
  if (shape === "square") return x > 180 && x < 520 && y > 170 && y < 510;
  const points = POLYGONS[shape];
  let hit = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i]!,
      [xj, yj] = points[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      hit = !hit;
  }
  return hit;
}
function segDist(
  x: number,
  y: number,
  a: readonly number[],
  b: readonly number[],
): number {
  const dx = b[0]! - a[0]!,
    dy = b[1]! - a[1]!;
  const t = Math.max(
    0,
    Math.min(1, ((x - a[0]!) * dx + (y - a[1]!) * dy) / (dx * dx + dy * dy)),
  );
  return Math.hypot(x - a[0]! - t * dx, y - a[1]! - t * dy);
}
function clearance(shape: ShapeKind, x: number, y: number): number {
  if (shape === "circle") return Math.abs(Math.hypot(x - 397, y - 237) - 175);
  if (shape === "ellipse")
    return Math.abs(Math.hypot((x - 397) / 225, (y - 237) / 150) - 1) * 150;
  if (shape === "rectangle" || shape === "square") {
    const [left, top, right, bottom] =
      shape === "rectangle" ? [76, 200, 575, 374] : [180, 170, 520, 510];
    if (inside(shape, x, y))
      return Math.min(x - left, right - x, y - top, bottom - y);
    return Math.hypot(
      Math.max(left - x, 0, x - right),
      Math.max(top - y, 0, y - bottom),
    );
  }
  const points = POLYGONS[shape];
  return Math.min(
    ...points.map((a, i) => segDist(x, y, a, points[(i + 1) % points.length]!)),
  );
}
const POINT_CACHE = new Map<string, readonly (readonly [number, number])[]>();
export function pointsFor(
  layout: ShapeLayout,
): readonly (readonly [number, number])[] {
  const cached = POINT_CACHE.get(layout.id);
  if (cached) return cached;
  const best: ({ x: number; y: number; margin: number } | undefined)[] =
    Array(8).fill(undefined);
  for (let y = 72; y < 488; y += 3)
    for (let x = 24; x < 620; x += 3) {
      const mask = maskAt(layout, x, y);
      const margin = Math.min(
        ...layout.shapes.map((shape) => clearance(shape, x, y)),
      );
      if (margin < 20 || (x < 160 && y < 90)) continue;
      if (!best[mask] || margin > best[mask]!.margin)
        best[mask] = { x, y, margin };
    }
  if (best.some((point) => !point))
    throw new Error(
      `Shape layout ${layout.id} lacks readable masks: ${best
        .map((point, mask) => (point ? "" : mask))
        .filter(Boolean)
        .join(",")}`,
    );
  const result = best.map((point) => [point!.x, point!.y] as const);
  POINT_CACHE.set(layout.id, result);
  return result;
}
export function maskAt(layout: ShapeLayout, x: number, y: number): number {
  return layout.shapes.reduce(
    (mask, shape, i) => mask | (inside(shape, x, y) ? 1 << i : 0),
    0,
  );
}
export function pointClearance(
  layout: ShapeLayout,
  x: number,
  y: number,
): number {
  return Math.min(...layout.shapes.map((shape) => clearance(shape, x, y)));
}
function shapeMarkup(shape: ShapeKind, color: string): string {
  const style = `fill="${color}" fill-opacity=".28" stroke="${color}" stroke-width="3"`;
  if (shape === "circle") return `<circle cx="397" cy="237" r="175" ${style}/>`;
  if (shape === "ellipse")
    return `<ellipse cx="397" cy="237" rx="225" ry="150" ${style}/>`;
  if (shape === "rectangle")
    return `<rect x="76" y="200" width="499" height="174" ${style}/>`;
  if (shape === "square")
    return `<rect x="180" y="170" width="340" height="340" ${style}/>`;
  if (shape === "right-triangle")
    return `<polygon points="${POLYGONS[shape].map(([x, y]) => `${x},${y}`).join(" ")}" ${style}/><path d="M 150 100 L 150 130 L 120 130" fill="none" stroke="${color}" stroke-width="3"/>`;
  return `<polygon points="${POLYGONS[shape].map(([x, y]) => `${x},${y}`).join(" ")}" ${style}/>`;
}
const SHAPE_LABELS: Record<ShapeKind, T> = {
  circle: tr("circle", "वृत्त", "ਚੱਕਰ"),
  ellipse: tr("ellipse", "दीर्घवृत्त", "ਅੰਡਾਕਾਰ"),
  rectangle: tr("rectangle", "आयत", "ਆਇਤ"),
  square: tr("square", "वर्ग", "ਵਰਗ"),
  triangle: tr("triangle", "त्रिभुज", "ਤਿਕੋਣ"),
  "right-triangle": tr("right-angled triangle", "समकोण त्रिभुज", "ਸਮਕੋਣ ਤਿਕੋਣ"),
  diamond: tr("diamond", "हीराकार", "ਹੀਰੇ ਵਰਗਾ ਆਕਾਰ"),
  trapezoid: tr("trapezoid", "समलंब चतुर्भुज", "ਸਮਲੰਬ ਚਤੁਰਭੁਜ"),
  pentagon: tr("pentagon", "पंचभुज", "ਪੰਜਭੁਜ"),
};
function regionName(mask: number, l: L): string {
  const en = [
    "outside all three shapes",
    "first shape only",
    "second shape only",
    "first and second shapes only",
    "third shape only",
    "first and third shapes only",
    "second and third shapes only",
    "all three shapes",
  ];
  const hi = [
    "तीनों आकृतियों के बाहर",
    "केवल पहली आकृति",
    "केवल दूसरी आकृति",
    "पहली और दूसरी आकृति, तीसरी के बिना",
    "केवल तीसरी आकृति",
    "पहली और तीसरी आकृति, दूसरी के बिना",
    "दूसरी और तीसरी आकृति, पहली के बिना",
    "तीनों आकृतियाँ",
  ];
  const pa = [
    "ਤਿੰਨਾਂ ਆਕਾਰਾਂ ਤੋਂ ਬਾਹਰ",
    "ਸਿਰਫ਼ ਪਹਿਲਾ ਆਕਾਰ",
    "ਸਿਰਫ਼ ਦੂਜਾ ਆਕਾਰ",
    "ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਆਕਾਰ, ਤੀਜੇ ਤੋਂ ਬਿਨਾਂ",
    "ਸਿਰਫ਼ ਤੀਜਾ ਆਕਾਰ",
    "ਪਹਿਲੇ ਅਤੇ ਤੀਜੇ ਆਕਾਰ, ਦੂਜੇ ਤੋਂ ਬਿਨਾਂ",
    "ਦੂਜੇ ਅਤੇ ਤੀਜੇ ਆਕਾਰ, ਪਹਿਲੇ ਤੋਂ ਬਿਨਾਂ",
    "ਤਿੰਨੇ ਆਕਾਰ",
  ];
  return (l === "en" ? en : l === "hi" ? hi : pa)[mask]!;
}
function svg(
  r: readonly number[],
  c: Context,
  l: L,
  layout: ShapeLayout,
): string {
  const points = pointsFor(layout),
    categories = c.sets.map((x) => x[l]);
  const labels = layout.shapes.map(
    (shape, i) => `${"ABC"[i]} — ${SHAPE_LABELS[shape][l]} = ${categories[i]}`,
  );
  const marks = layout.shapes
    .map((shape, i) =>
      shapeMarkup(shape, ["#25845f", "#7b4ab5", "#d28b21"][i]!),
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 500" role="img" aria-label="Counts in three overlapping geometric shapes"><rect x="4" y="4" width="632" height="492" rx="10" fill="#fff" stroke="#b8c3cf"/>${marks}<g font-family="sans-serif" font-size="13" fill="#152536"><text x="8" y="23">${labels[0]}</text><text x="8" y="42">${labels[1]}</text><text x="8" y="61">${labels[2]}</text></g><g font-family="sans-serif" font-size="16" font-weight="600" text-anchor="middle" dominant-baseline="middle" fill="#152536">${r.map((v, m) => `<text x="${points[m]![0]}" y="${points[m]![1]}" data-mask="${m}">${v}</text>`).join("")}</g><metadata data-layout="${layout.id}" data-label-clearance="20"/></svg>`;
}
function stem(
  c: Context,
  q: (typeof QUESTIONS)[number],
  l: L,
  layout: ShapeLayout,
): string {
  const shapeNames = layout.shapes.map((shape) => SHAPE_LABELS[shape][l]);
  const title =
    l === "en"
      ? `A survey records three activities: ${c.sets.map((s) => s[l]).join("; ")}. The ${shapeNames[0]} represents the first activity, the ${shapeNames[1]} the second, and the ${shapeNames[2]} the third. The numbers show counts in the separate regions.`
      : l === "hi"
        ? `एक सर्वेक्षण में तीन गतिविधियाँ दर्ज की गईं: ${c.sets.map((s) => s[l]).join("; ")}। ${shapeNames[0]} पहली, ${shapeNames[1]} दूसरी और ${shapeNames[2]} तीसरी गतिविधि दर्शाते हैं। संख्याएँ अलग-अलग क्षेत्रों की गिनती दिखाती हैं।`
        : `ਇੱਕ ਸਰਵੇਖਣ ਵਿੱਚ ਤਿੰਨ ਗਤੀਵਿਧੀਆਂ ਦਰਜ ਕੀਤੀਆਂ ਗਈਆਂ: ${c.sets.map((s) => s[l]).join("; ")}। ${shapeNames[0]} ਪਹਿਲੀ, ${shapeNames[1]} ਦੂਜੀ ਅਤੇ ${shapeNames[2]} ਤੀਜੀ ਗਤੀਵਿਧੀ ਦਰਸਾਉਂਦੇ ਹਨ। ਗਿਣਤੀਆਂ ਵੱਖਰੇ ਖੇਤਰਾਂ ਲਈ ਹਨ।`;
  const ask =
    l === "en"
      ? `How many are ${q.label[l]}?`
      : l === "hi"
        ? `कितने लोग ${q.label[l]} हैं?`
        : `ਕਿੰਨੇ ਲੋਕ ${q.label[l]} ਹਨ?`;
  return `${title} ${ask}`;
}
export function isVen001ShapeRegionRequest(
  req: QuestionStudioGenerationRequest,
): boolean {
  const selectors = [
    req.packageId,
    req.patternId,
    req.canonicalProblemId,
    req.questionLanguageId,
  ].map((v) => text(v).toUpperCase());
  return (
    selectors.includes(VEN_001_SHAPE_REGION_CP_ID) ||
    selectors.includes("VEN-001-SHAPE-REGIONS")
  );
}
export function generateVen001ShapeRegionBatch(
  req: QuestionStudioGenerationRequest,
): QuestionStudioGenerationResult {
  if (req.runtimeMode && req.runtimeMode !== "review-only")
    throw new Error("VEN-001 shape-region questions are review-only");
  const l = req.language ?? "en";
  if (!(l === "en" || l === "hi" || l === "pa"))
    throw new Error(`Unsupported VEN-001 language: ${l}`);
  const count = req.count ?? 5;
  if (!Number.isInteger(count) || count < 1 || count > 50)
    throw new Error("VEN-CP011 batch count must be 1–50");
  const seed = text(req.seed) || "ven-001-shape-regions-review-v1";
  const questions = Array.from({ length: count }, (_, i) => {
    const c = CONTEXTS[hash(`${seed}:context:${i}`) % CONTEXTS.length]!;
    const q = QUESTIONS[hash(`${seed}:query:${i}`) % QUESTIONS.length]!;
    const layout = LAYOUTS[i % LAYOUTS.length]!;
    const regions = Array.from(
      { length: 8 },
      (_, m) => 8 + (hash(`${seed}:${i}:${c.id}:${m}`) % 42),
    );
    const answer = q.masks.reduce((sum, m) => sum + regions[m]!, 0);
    const distractors = [
      ...new Set(
        [
          answer + regions[(q.masks[0]! + 1) % 8]!,
          Math.max(0, answer - regions[(q.masks[0]! + 2) % 8]!),
          answer + regions[(q.masks[0]! + 3) % 8]!,
        ].map(String),
      ),
    ];
    for (let delta = 1; distractors.length < 3; delta++) {
      const v = String(answer + delta);
      if (v !== String(answer) && !distractors.includes(v)) distractors.push(v);
    }
    const options = [String(answer), ...distractors.slice(0, 3)].sort(
      (a, b) => hash(`${seed}:${i}:${a}`) - hash(`${seed}:${i}:${b}`),
    );
    const correctIndex = options.indexOf(String(answer));
    let explanation: string;
    const namedValues = q.masks.map(
      (m) => `${regionName(m, l)}: ${regions[m]}`,
    );
    const calculation = q.masks.map((m) => String(regions[m])).join(" + ");
    if (l === "en")
      explanation = `Use ${namedValues.join(q.masks.length === 2 ? " and " : "; ")}. These are the ${q.label[l]} region${q.masks.length > 1 ? "s" : ""}; the remaining diagram regions do not meet that condition. ${calculation} = ${answer}.`;
    else if (l === "hi")
      explanation = `${namedValues.join("; ")}। यही ${q.label[l]} वाले क्षेत्र हैं; आरेख के बाकी क्षेत्र इस शर्त में नहीं आते। ${calculation} = ${answer}।`;
    else
      explanation = `${namedValues.join("; ")}। ਇਹ ${q.label[l]} ਵਾਲੇ ਖੇਤਰ ਹਨ; ਚਿੱਤਰ ਦੇ ਬਾਕੀ ਖੇਤਰ ਇਸ ਸ਼ਰਤ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੇ। ${calculation} = ${answer}।`;
    const id = `VEN-CP011:${c.id}:${q.key}:${hash(`${seed}:${i}`)}:${l}`;
    const questionStem = stem(c, q, l, layout);
    return {
      ...lifecycle,
      id,
      questionId: id,
      packageId: "VEN-001",
      patternId: VEN_001_SHAPE_REGION_CP_ID,
      cpId: VEN_001_SHAPE_REGION_CP_ID,
      checkpointId: VEN_001_SHAPE_REGION_CP_ID,
      subject: "Reasoning Ability",
      contentDomain: "Geometric Venn diagram region reading",
      topic: "Venn Diagrams",
      subtopic: "Geometric shape region counts",
      language: l,
      locale: l === "en" ? "en-IN" : l === "hi" ? "hi-IN" : "pa-IN",
      stem: questionStem,
      text: questionStem,
      options,
      optionLabels: ["A", "B", "C", "D"],
      correctIndex,
      correct: correctIndex,
      answer: "ABCD"[correctIndex],
      canonicalAnswer: String(answer),
      explanation,
      stimulusSvgs: [svg(regions, c, l, layout)],
      explanationSvgs: [svg(regions, c, l, layout)],
      optionDetails: options.map((value, j) => ({
        label: "ABCD"[j],
        text: value,
        isCorrect: j === correctIndex,
      })),
      difficulty: "Medium",
      difficultyLabel: "Medium",
      difficultyAuthority: "PROVISIONAL_OPERATION_BASED",
      questionOperation: "GEOMETRIC_REGION_COUNT",
      generationSeed: seed,
      reviewStatus: "REVIEW_CANDIDATE_TRILINGUAL",
      runtimeMode: "review-only",
      reviewOnly: true,
      readOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
      sharedStimulus: questionStem,
      semanticMetadata: {
        scenarioId: c.id,
        shapeLayoutId: layout.id,
        shapeTypes: layout.shapes,
        queryKey: q.key,
        queryPattern: q.pattern,
        shapeSetLabels: c.sets.map((s) => s[l]),
        exclusiveRegions: regions,
        selectedMasks: q.masks,
      },
      validation: {
        exactlyOneCorrect:
          options.filter((x) => x === String(answer)).length === 1,
        fourUniqueOptions: new Set(options).size === 4,
        allEightRegionsVisible: regions.length === 8,
        shapeLayoutHasEightRegions: true,
        labelClearancePx: 20,
        localeParityPendingHumanReview: true,
      },
    };
  });
  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: "VEN-001",
      requestedCheckpoint: VEN_001_SHAPE_REGION_CP_ID,
      language: l,
      seed,
      count,
      reviewOnly: true,
      questionBankWritable: false,
    },
  };
}
