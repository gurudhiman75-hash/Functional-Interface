import { IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1 } from "./identical-figure-source-saturated-discovery-v1";
import { IDENTICAL_FIGURE_PERMANENT_QL_ALLOCATIONS_V13 } from "./spatial-permanent-ql-allocation-v13";

export type IdenticalFigureLanguageV1 = "en" | "hi" | "pa";
export type IdenticalFigureQlIdV1 = "SPA-QL-061" | "SPA-QL-062" | "SPA-QL-063";
export type IdenticalFigureDifficultyV1 = "EASY" | "MODERATE" | "HARD";

type ShapeKind = "CIRCLE" | "SQUARE" | "TRIANGLE";
type InnerKind = "DOT" | "CROSS" | "DIAMOND";
type PartitionKind = "NONE" | "PLUS" | "X";
type TopologyRelation = "CONTAINED" | "PARTIAL_OVERLAP" | "CROSSING";
type SlotMark = "NONE" | "DOT" | "TICK" | "ARROW";
type TransformPolicy = "ROTATION_ONLY" | "ROTATION_OR_REFLECTION";
type Localized = Readonly<{ en: string; hi: string; pa: string }>;

type ComponentFigure = Readonly<{
  kind: "COMPONENT";
  outer: ShapeKind;
  inner: InnerKind;
  partition: PartitionKind;
  groupingAttribute: "OUTER" | "INNER" | "PARTITION";
}>;

type TopologyFigure = Readonly<{
  kind: "TOPOLOGY";
  relation: TopologyRelation;
  first: ShapeKind;
  second: ShapeKind;
  variant: number;
}>;

type TransformFigure = Readonly<{
  kind: "TRANSFORM";
  slots: readonly SlotMark[];
  policy: TransformPolicy;
}>;

type FigureState = ComponentFigure | TopologyFigure | TransformFigure;
type NumberGroup = readonly number[];
type Partition = readonly NumberGroup[];

type GroupRow = Readonly<{
  members: string;
  semanticKey: string;
  reason: string;
}>;

const QLS: readonly IdenticalFigureQlIdV1[] = ["SPA-QL-061", "SPA-QL-062", "SPA-QL-063"];
const OPTION_LABELS = ["A", "B", "C", "D"] as const;
const SHAPES: readonly ShapeKind[] = ["CIRCLE", "SQUARE", "TRIANGLE"];
const INNERS: readonly InnerKind[] = ["DOT", "CROSS", "DIAMOND"];
const PARTITIONS: readonly PartitionKind[] = ["NONE", "PLUS", "X"];
const ROTATION_ONLY_PATTERNS: readonly (readonly SlotMark[])[] = [
  ["DOT", "TICK", "ARROW", "NONE"],
  ["DOT", "ARROW", "NONE", "TICK"],
  ["TICK", "DOT", "NONE", "ARROW"],
];
const DIHEDRAL_PATTERNS: readonly (readonly SlotMark[])[] = [
  ["DOT", "DOT", "TICK", "NONE"],
  ["DOT", "TICK", "TICK", "NONE"],
  ["DOT", "TICK", "ARROW", "NONE"],
];

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
  return `idf-${hash32(text).toString(16).padStart(8, "0")}`;
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

function rotateSlots(slots: readonly SlotMark[], steps: number): readonly SlotMark[] {
  const n = ((steps % 4) + 4) % 4;
  return Object.freeze(slots.map((_, index) => slots[(index - n + 4) % 4]));
}

function reflectSlots(slots: readonly SlotMark[]): readonly SlotMark[] {
  // Reflect across the vertical axis: N stays, E<->W, S stays.
  return Object.freeze([slots[0], slots[3], slots[2], slots[1]]);
}

function transformCanonicalKey(slots: readonly SlotMark[], policy: TransformPolicy): string {
  const candidates: string[] = [];
  for (let rotation = 0; rotation < 4; rotation += 1) {
    candidates.push(rotateSlots(slots, rotation).join("|"));
    if (policy === "ROTATION_OR_REFLECTION") {
      candidates.push(reflectSlots(rotateSlots(slots, rotation)).join("|"));
    }
  }
  return candidates.sort()[0];
}

function figureKey(state: FigureState): string {
  if (state.kind === "COMPONENT") {
    if (state.groupingAttribute === "OUTER") return `OUTER:${state.outer}`;
    if (state.groupingAttribute === "INNER") return `INNER:${state.inner}`;
    return `PARTITION:${state.partition}`;
  }
  if (state.kind === "TOPOLOGY") return `TOPOLOGY:${state.relation}`;
  return `TRANSFORM:${state.policy}:${transformCanonicalKey(state.slots, state.policy)}`;
}

function normalizePartition(groups: readonly (readonly number[])[]): string {
  const normalized = groups
    .map((group) => [...group].sort((a, b) => a - b))
    .sort((a, b) => (a[0] ?? 0) - (b[0] ?? 0));
  return normalized.map((group) => group.join("-")).join("|");
}

function solvePartition(states: readonly FigureState[]): Partition {
  const buckets = new Map<string, number[]>();
  states.forEach((state, index) => {
    const key = figureKey(state);
    const bucket = buckets.get(key) ?? [];
    bucket.push(index + 1);
    buckets.set(key, bucket);
  });
  if (buckets.size !== 3) throw new Error(`IDF-001 expected 3 semantic groups, got ${buckets.size}.`);
  const groups = [...buckets.values()].map((group) => Object.freeze([...group].sort((a, b) => a - b)));
  if (groups.some((group) => group.length !== 3)) throw new Error("IDF-001 expected exactly three figures in every group.");
  return Object.freeze(groups.sort((a, b) => a[0] - b[0]));
}

function swappedPartition(correct: Partition, swapA: readonly [number, number], swapB?: readonly [number, number]): Partition {
  const groups = correct.map((group) => [...group]);
  const apply = ([ga, gb]: readonly [number, number]) => {
    const a = groups[ga][groups[ga].length - 1];
    const b = groups[gb][0];
    groups[ga][groups[ga].length - 1] = b;
    groups[gb][0] = a;
  };
  apply(swapA);
  if (swapB) apply(swapB);
  return Object.freeze(groups.map((group) => Object.freeze([...group].sort((a, b) => a - b))).sort((a, b) => a[0] - b[0]));
}

function makeOptions(correct: Partition, seed: number): readonly Partition[] {
  const candidates: Partition[] = [
    correct,
    swappedPartition(correct, [0, 1]),
    swappedPartition(correct, [1, 2]),
    swappedPartition(correct, [0, 2]),
    swappedPartition(correct, [0, 1], [1, 2]),
  ];
  const unique = new Map<string, Partition>();
  for (const candidate of candidates) unique.set(normalizePartition(candidate), candidate);
  if (unique.size < 4) throw new Error("IDF-001 could not construct four unique grouping options.");
  const wrong = [...unique.values()].filter((candidate) => normalizePartition(candidate) !== normalizePartition(correct));
  return Object.freeze(shuffled([correct, ...shuffled(wrong, seed ^ 0x9e3779b9).slice(0, 3)], seed ^ 0x85ebca6b));
}

function componentStates(seed: number): readonly FigureState[] {
  const groupingAttribute = (["OUTER", "INNER", "PARTITION"] as const)[seed % 3];
  const states: ComponentFigure[] = [];
  for (let group = 0; group < 3; group += 1) {
    for (let variant = 0; variant < 3; variant += 1) {
      const outer = groupingAttribute === "OUTER" ? SHAPES[group] : SHAPES[(group + variant) % 3];
      const inner = groupingAttribute === "INNER" ? INNERS[group] : INNERS[(group + variant * 2) % 3];
      const partition = groupingAttribute === "PARTITION" ? PARTITIONS[group] : PARTITIONS[(group + variant) % 3];
      states.push(Object.freeze({ kind: "COMPONENT", outer, inner, partition, groupingAttribute }));
    }
  }
  return Object.freeze(shuffled(states, seed ^ 0x27d4eb2f));
}

function topologyStates(seed: number): readonly FigureState[] {
  const relations: readonly TopologyRelation[] = ["CONTAINED", "PARTIAL_OVERLAP", "CROSSING"];
  const states: TopologyFigure[] = [];
  for (let group = 0; group < 3; group += 1) {
    for (let variant = 0; variant < 3; variant += 1) {
      states.push(Object.freeze({
        kind: "TOPOLOGY",
        relation: relations[group],
        first: SHAPES[(variant + group) % 3],
        second: SHAPES[(variant + group + 1) % 3],
        variant: (variant + Math.floor(seed / 3)) % 3,
      }));
    }
  }
  return Object.freeze(shuffled(states, seed ^ 0xc2b2ae35));
}

function transformStates(seed: number): readonly FigureState[] {
  const policy: TransformPolicy = Math.floor(seed / 5) % 2 === 0 ? "ROTATION_ONLY" : "ROTATION_OR_REFLECTION";
  const patterns = policy === "ROTATION_ONLY" ? ROTATION_ONLY_PATTERNS : DIHEDRAL_PATTERNS;
  const canonicalKeys = new Set(patterns.map((pattern) => transformCanonicalKey(pattern, policy)));
  if (canonicalKeys.size !== 3) throw new Error(`IDF-001 transform pattern bank collapsed under ${policy}.`);
  const states: TransformFigure[] = [];
  for (let group = 0; group < 3; group += 1) {
    for (let variant = 0; variant < 3; variant += 1) {
      let slots = rotateSlots(patterns[group], (variant + group + seed) % 4);
      if (policy === "ROTATION_OR_REFLECTION" && (variant + seed) % 2 === 1) slots = reflectSlots(slots);
      states.push(Object.freeze({ kind: "TRANSFORM", slots, policy }));
    }
  }
  return Object.freeze(shuffled(states, seed ^ 0x165667b1));
}

function buildStates(qlId: IdenticalFigureQlIdV1, seed: number): readonly FigureState[] {
  if (qlId === "SPA-QL-061") return componentStates(seed);
  if (qlId === "SPA-QL-062") return topologyStates(seed);
  return transformStates(seed);
}

function shapeSvg(shape: ShapeKind, cx: number, cy: number, size: number): string {
  if (shape === "CIRCLE") return `<circle cx="${cx}" cy="${cy}" r="${size}"/>`;
  if (shape === "SQUARE") return `<rect x="${cx - size}" y="${cy - size}" width="${size * 2}" height="${size * 2}"/>`;
  return `<polygon points="${cx},${cy - size - 2} ${cx + size + 2},${cy + size} ${cx - size - 2},${cy + size}"/>`;
}

function innerSvg(inner: InnerKind): string {
  if (inner === "DOT") return '<circle cx="35" cy="35" r="3" fill="#111827" stroke="none"/>';
  if (inner === "CROSS") return '<g><line x1="28" y1="28" x2="42" y2="42"/><line x1="42" y1="28" x2="28" y2="42"/></g>';
  return '<rect x="29" y="29" width="12" height="12" transform="rotate(45 35 35)"/>';
}

function componentSvg(state: ComponentFigure): string {
  const partition = state.partition === "PLUS"
    ? '<line x1="18" y1="35" x2="52" y2="35"/><line x1="35" y1="18" x2="35" y2="52"/>'
    : state.partition === "X"
      ? '<line x1="22" y1="22" x2="48" y2="48"/><line x1="48" y1="22" x2="22" y2="48"/>'
      : "";
  return `${shapeSvg(state.outer, 35, 35, 22)}${partition}${innerSvg(state.inner)}`;
}

function topologySvg(state: TopologyFigure): string {
  if (state.relation === "CONTAINED") {
    return `${shapeSvg(state.first, 35, 35, 23)}${shapeSvg(state.second, 35 + (state.variant - 1) * 2, 35, 10)}`;
  }
  if (state.relation === "PARTIAL_OVERLAP") {
    const dx = state.variant === 0 ? 13 : state.variant === 1 ? 15 : 12;
    return `${shapeSvg(state.first, 29, 35, 17)}${shapeSvg(state.second, 29 + dx, 35, 17)}`;
  }
  const offset = state.variant === 0 ? 0 : state.variant === 1 ? 2 : -2;
  return `${shapeSvg(state.first, 35, 30 + offset, 18)}${shapeSvg(state.second, 35, 41 - offset, 18)}`;
}

function transformSvg(state: TransformFigure): string {
  const points: readonly (readonly [number, number])[] = [[35, 13], [57, 35], [35, 57], [13, 35]];
  const slotSvg = state.slots.map((mark, index) => {
    if (mark === "NONE") return "";
    const [x, y] = points[index];
    const line = `<line x1="35" y1="35" x2="${x}" y2="${y}"/>`;
    if (mark === "DOT") return `${line}<circle cx="${x}" cy="${y}" r="3" fill="#111827" stroke="none"/>`;
    if (mark === "TICK") {
      const tick = index % 2 === 0
        ? `<line x1="${x - 5}" y1="${y}" x2="${x + 5}" y2="${y}"/>`
        : `<line x1="${x}" y1="${y - 5}" x2="${x}" y2="${y + 5}"/>`;
      return `${line}${tick}`;
    }
    const arrow = index === 0
      ? `<polyline points="${x - 5},${y + 6} ${x},${y} ${x + 5},${y + 6}"/>`
      : index === 1
        ? `<polyline points="${x - 6},${y - 5} ${x},${y} ${x - 6},${y + 5}"/>`
        : index === 2
          ? `<polyline points="${x - 5},${y - 6} ${x},${y} ${x + 5},${y - 6}"/>`
          : `<polyline points="${x + 6},${y - 5} ${x},${y} ${x + 6},${y + 5}"/>`;
    return `${line}${arrow}`;
  }).join("");
  return `<circle cx="35" cy="35" r="5"/>${slotSvg}`;
}

function figureSvg(state: FigureState): string {
  const body = state.kind === "COMPONENT" ? componentSvg(state) : state.kind === "TOPOLOGY" ? topologySvg(state) : transformSvg(state);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70" width="108" height="108" role="img"><rect width="70" height="70" fill="white"/><g fill="none" stroke="#111827" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
}

function bankSvg(states: readonly FigureState[]): string {
  const cards = states.map((state, index) => {
    const x = (index % 3) * 92;
    const y = Math.floor(index / 3) * 92;
    return `<g transform="translate(${x} ${y})"><rect x="2" y="2" width="84" height="84" fill="white" stroke="#d1d5db" stroke-width="1"/><text x="8" y="14" font-size="11" font-family="Arial" font-weight="700" fill="#111827">${index + 1}</text><g transform="translate(8 9) scale(.9)">${figureSvg(state).replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g></g>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 276 276" width="430" height="430" role="img"><rect width="276" height="276" fill="white"/>${cards}</svg>`;
}

function solutionSvg(states: readonly FigureState[], partition: Partition): string {
  const groupPanels = partition.map((group, groupIndex) => {
    const members = group.map((number, memberIndex) => {
      const x = 8 + memberIndex * 78;
      return `<g transform="translate(${x} 22)"><text x="0" y="0" font-size="10" font-family="Arial" font-weight="700" fill="#111827">${number}</text><g transform="translate(4 3) scale(.8)">${figureSvg(states[number - 1]).replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g></g>`;
    }).join("");
    return `<g transform="translate(0 ${groupIndex * 82})"><rect x="1" y="1" width="242" height="76" rx="6" fill="white" stroke="#9ca3af" stroke-width="1"/><text x="8" y="15" font-size="11" font-family="Arial" font-weight="700" fill="#111827">Group ${groupIndex + 1}</text>${members}</g>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 244 246" width="420" height="420" role="img"><rect width="244" height="246" fill="white"/>${groupPanels}</svg>`;
}

function partitionText(partition: Partition): string {
  return partition.map((group) => `(${group.join(", ")})`).join(", ");
}

const NAMES = {
  en: {
    outer: { CIRCLE: "circle", SQUARE: "square", TRIANGLE: "triangle" },
    inner: { DOT: "dot", CROSS: "cross", DIAMOND: "diamond" },
    partition: { NONE: "no internal partition", PLUS: "plus partition", X: "diagonal-cross partition" },
    topology: { CONTAINED: "one figure completely inside the other", PARTIAL_OVERLAP: "partial overlap", CROSSING: "crossing intersection" },
  },
  hi: {
    outer: { CIRCLE: "वृत्त", SQUARE: "वर्ग", TRIANGLE: "त्रिभुज" },
    inner: { DOT: "बिंदु", CROSS: "क्रॉस", DIAMOND: "हीरा" },
    partition: { NONE: "बिना आंतरिक विभाजन", PLUS: "प्लस विभाजन", X: "तिरछा क्रॉस विभाजन" },
    topology: { CONTAINED: "एक आकृति पूरी तरह दूसरी के अंदर", PARTIAL_OVERLAP: "आंशिक अतिव्यापन", CROSSING: "प्रतिच्छेदी ओवरलैप" },
  },
  pa: {
    outer: { CIRCLE: "ਵ੍ਰਿੱਤ", SQUARE: "ਵਰਗ", TRIANGLE: "ਤਿਕੋਣ" },
    inner: { DOT: "ਬਿੰਦੂ", CROSS: "ਕਰਾਸ", DIAMOND: "ਹੀਰਾ" },
    partition: { NONE: "ਬਿਨਾ ਅੰਦਰੂਨੀ ਵੰਡ", PLUS: "ਪਲੱਸ ਵੰਡ", X: "ਤਿਰਛੀ ਕਰਾਸ ਵੰਡ" },
    topology: { CONTAINED: "ਇੱਕ ਆਕ੍ਰਿਤੀ ਪੂਰੀ ਤਰ੍ਹਾਂ ਦੂਜੀ ਦੇ ਅੰਦਰ", PARTIAL_OVERLAP: "ਅੰਸ਼ਿਕ ਓਵਰਲੈਪ", CROSSING: "ਕੱਟਦਾ ਓਵਰਲੈਪ" },
  },
} as const;

function groupReason(state: FigureState, language: IdenticalFigureLanguageV1): string {
  const names = NAMES[language];
  if (state.kind === "COMPONENT") {
    if (state.groupingAttribute === "OUTER") {
      return language === "en" ? `same outer ${names.outer[state.outer]}` : language === "hi" ? `समान बाहरी ${names.outer[state.outer]}` : `ਇੱਕੋ ਬਾਹਰੀ ${names.outer[state.outer]}`;
    }
    if (state.groupingAttribute === "INNER") {
      return language === "en" ? `same inner ${names.inner[state.inner]}` : language === "hi" ? `समान भीतरी ${names.inner[state.inner]}` : `ਇੱਕੋ ਅੰਦਰੂਨੀ ${names.inner[state.inner]}`;
    }
    return language === "en" ? `same ${names.partition[state.partition]}` : language === "hi" ? `समान ${names.partition[state.partition]}` : `ਇੱਕੋ ${names.partition[state.partition]}`;
  }
  if (state.kind === "TOPOLOGY") return names.topology[state.relation];
  const policy = state.policy === "ROTATION_ONLY"
    ? (language === "en" ? "identical after rotation only" : language === "hi" ? "केवल घुमाने पर समान" : "ਕੇਵਲ ਘੁੰਮਾਉਣ ਨਾਲ ਇੱਕੋ")
    : (language === "en" ? "identical after allowed rotation/reflection" : language === "hi" ? "अनुमत घुमाव/प्रतिबिंब पर समान" : "ਮੰਨਿਆ ਘੁੰਮਾਓ/ਪਰਛਾਵਾਂ ਨਾਲ ਇੱਕੋ");
  return policy;
}

function stemFor(qlId: IdenticalFigureQlIdV1, language: IdenticalFigureLanguageV1, seed: number, states: readonly FigureState[]): string {
  const base = seed % 3;
  if (qlId === "SPA-QL-063") {
    const policy = (states[0] as TransformFigure).policy;
    if (language === "hi") return policy === "ROTATION_ONLY"
      ? "प्रत्येक आकृति का केवल घुमाव समान माना जाएगा; दर्पण-प्रतिबिंब समान नहीं है। सभी क्रमांकित आकृतियों का एक-एक बार उपयोग करके तीन समान समूह बनाइए और सही विकल्प चुनिए।"
      : "घुमाव तथा दर्पण-प्रतिबिंब दोनों को समानता के लिए मान्य मानिए। सभी क्रमांकित आकृतियों का एक-एक बार उपयोग करके तीन समान समूह बनाइए और सही विकल्प चुनिए।";
    if (language === "pa") return policy === "ROTATION_ONLY"
      ? "ਕੇਵਲ ਘੁੰਮਾਈ ਹੋਈ ਆਕ੍ਰਿਤੀ ਨੂੰ ਇੱਕੋ ਮੰਨੋ; ਦਰਪਣ-ਪਰਛਾਵਾਂ ਨੂੰ ਇੱਕੋ ਨਾ ਮੰਨੋ। ਹਰ ਨੰਬਰ ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਨੂੰ ਇੱਕ ਵਾਰ ਵਰਤ ਕੇ ਤਿੰਨ ਸਮਾਨ ਗਰੁੱਪ ਬਣਾਓ ਅਤੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।"
      : "ਘੁੰਮਾਓ ਅਤੇ ਦਰਪਣ-ਪਰਛਾਵਾਂ ਦੋਵੇਂ ਸਮਾਨਤਾ ਲਈ ਮੰਨੇ ਜਾਣ। ਹਰ ਨੰਬਰ ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਨੂੰ ਇੱਕ ਵਾਰ ਵਰਤ ਕੇ ਤਿੰਨ ਸਮਾਨ ਗਰੁੱਪ ਬਣਾਓ ਅਤੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।";
    return policy === "ROTATION_ONLY"
      ? "Treat only rotation as preserving an identical figure; a mirror reflection is not identical. Use every numbered figure once to form three equivalent groups and select the correct option."
      : "Treat both rotation and mirror reflection as preserving identity. Use every numbered figure once to form three equivalent groups and select the correct option.";
  }
  const en = [
    "Use each numbered figure exactly once to form three groups of similar figures. Which option gives the correct grouping?",
    "The nine figures can be separated into three groups on one consistent visual basis. Select the option that uses every figure once and forms all three groups correctly.",
    "Study the numbered figures and identify the complete three-group partition in which the members of each group share the same defining relation.",
  ];
  const hi = [
    "प्रत्येक क्रमांकित आकृति का ठीक एक बार उपयोग करके समान आकृतियों के तीन समूह बनाइए। सही समूह-विन्यास वाला विकल्प चुनिए।",
    "नौ आकृतियों को एक समान दृश्य आधार पर तीन समूहों में बाँटा जा सकता है। वह विकल्प चुनिए जो हर आकृति का एक बार उपयोग करके तीनों समूह सही बनाता है।",
    "क्रमांकित आकृतियों को देखकर वह पूर्ण तीन-समूह विभाजन चुनिए जिसमें हर समूह के सदस्यों का निर्णायक संबंध समान हो।",
  ];
  const pa = [
    "ਹਰ ਨੰਬਰ ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਨੂੰ ਠੀਕ ਇੱਕ ਵਾਰ ਵਰਤ ਕੇ ਸਮਾਨ ਆਕ੍ਰਿਤੀਆਂ ਦੇ ਤਿੰਨ ਗਰੁੱਪ ਬਣਾਓ। ਸਹੀ ਗਰੁੱਪਬੰਦੀ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।",
    "ਨੌਂ ਆਕ੍ਰਿਤੀਆਂ ਨੂੰ ਇੱਕੋ ਦ੍ਰਿਸ਼ਟੀਗਤ ਆਧਾਰ ਤੇ ਤਿੰਨ ਗਰੁੱਪਾਂ ਵਿੱਚ ਵੰਡਿਆ ਜਾ ਸਕਦਾ ਹੈ। ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜੋ ਹਰ ਆਕ੍ਰਿਤੀ ਨੂੰ ਇੱਕ ਵਾਰ ਵਰਤ ਕੇ ਤਿੰਨੇ ਗਰੁੱਪ ਠੀਕ ਬਣਾਉਂਦਾ ਹੈ।",
    "ਨੰਬਰ ਵਾਲੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਨੂੰ ਵੇਖ ਕੇ ਉਹ ਪੂਰੀ ਤਿੰਨ-ਗਰੁੱਪ ਵੰਡ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਹਰ ਗਰੁੱਪ ਦੇ ਮੈਂਬਰ ਇੱਕੋ ਨਿਰਣਾਇਕ ਸੰਬੰਧ ਸਾਂਝਾ ਕਰਦੇ ਹਨ।",
  ];
  return (language === "hi" ? hi : language === "pa" ? pa : en)[base];
}

function explanationFor(
  language: IdenticalFigureLanguageV1,
  states: readonly FigureState[],
  correct: Partition,
  optionPartitions: readonly Partition[],
  correctIndex: number,
) {
  const rows: GroupRow[] = correct.map((group) => {
    const first = states[group[0] - 1];
    return Object.freeze({
      members: group.join(", "),
      semanticKey: figureKey(first),
      reason: groupReason(first, language),
    });
  });
  const failures = optionPartitions.map((partition, index) => {
    if (index === correctIndex) return null;
    const badGroup = partition.find((group) => new Set(group.map((number) => figureKey(states[number - 1]))).size !== 1);
    if (!badGroup) throw new Error("IDF-001 distractor unexpectedly contains only valid groups.");
    return Object.freeze({ option: OPTION_LABELS[index], members: badGroup.join(", ") });
  }).filter((value): value is Readonly<{ option: string; members: string }> => value !== null);

  const correctLabel = OPTION_LABELS[correctIndex];
  const groupText = rows.map((row, index) => `${index + 1}: (${row.members}) — ${row.reason}`).join("; ");
  const failText = failures.map((failure) => `${failure.option}: (${failure.members})`).join(", ");

  if (language === "hi") return Object.freeze({
    observation: `पहले हर आकृति का निर्णायक गुण निकालें। सही समूह हैं: ${groupText}।`,
    rule: "सही उत्तर में हर क्रमांकित आकृति ठीक एक बार आती है और एक समूह के सभी सदस्यों का पूर्ण अर्थपूर्ण समूह-गुण समान होना चाहिए।",
    application: `विकल्प ${correctLabel} में तीनों समूह इस शर्त को पूरा करते हैं। केवल आकृति की जगह या घुमाव देखकर निर्णय नहीं किया गया; घोषित घटक/संबंध/रूपांतरण नीति से समानता जाँची गई है।`,
    check: `निकट-विकल्पों में कम-से-कम एक मिश्रित समूह बनता है: ${failText}। इसलिए केवल विकल्प ${correctLabel} सही है।`,
    groupTable: Object.freeze(rows),
    solutionSvg: solutionSvg(states, correct),
  });
  if (language === "pa") return Object.freeze({
    observation: `ਪਹਿਲਾਂ ਹਰ ਆਕ੍ਰਿਤੀ ਦਾ ਨਿਰਣਾਇਕ ਗੁਣ ਕੱਢੋ। ਸਹੀ ਗਰੁੱਪ ਹਨ: ${groupText}।`,
    rule: "ਸਹੀ ਉੱਤਰ ਵਿੱਚ ਹਰ ਨੰਬਰ ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਠੀਕ ਇੱਕ ਵਾਰ ਆਉਂਦੀ ਹੈ ਅਤੇ ਇੱਕ ਗਰੁੱਪ ਦੇ ਸਾਰੇ ਮੈਂਬਰਾਂ ਦਾ ਪੂਰਾ ਅਰਥਪੂਰਨ ਗਰੁੱਪ-ਗੁਣ ਇੱਕੋ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
    application: `ਵਿਕਲਪ ${correctLabel} ਵਿੱਚ ਤਿੰਨੇ ਗਰੁੱਪ ਇਹ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੇ ਹਨ। ਸਿਰਫ਼ ਥਾਂ ਜਾਂ ਘੁੰਮਾਓ ਦੇ ਆਧਾਰ ਤੇ ਨਹੀਂ, ਸਗੋਂ ਘੋਸ਼ਿਤ ਘਟਕ/ਸੰਬੰਧ/ਰੂਪਾਂਤਰ ਨੀਤੀ ਨਾਲ ਸਮਾਨਤਾ ਜਾਂਚੀ ਗਈ ਹੈ।`,
    check: `ਨੇੜਲੇ ਵਿਕਲਪਾਂ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮਿਲਿਆ-ਜੁਲਿਆ ਗਰੁੱਪ ਬਣਦਾ ਹੈ: ${failText}। ਇਸ ਲਈ ਕੇਵਲ ਵਿਕਲਪ ${correctLabel} ਸਹੀ ਹੈ।`,
    groupTable: Object.freeze(rows),
    solutionSvg: solutionSvg(states, correct),
  });
  return Object.freeze({
    observation: `Read the defining property of every figure first. The valid groups are ${groupText}.`,
    rule: "A valid answer uses every numbered figure exactly once, and every member within a group must have the same complete semantic grouping key.",
    application: `Option ${correctLabel} satisfies all three groups. Identity is checked from the declared component, topology or transform policy rather than from absolute position or superficial resemblance.`,
    check: `Each near-miss option creates at least one mixed group: ${failText}. Therefore only option ${correctLabel} is valid.`,
    groupTable: Object.freeze(rows),
    solutionSvg: solutionSvg(states, correct),
  });
}

export function generateIdenticalFigureReviewQuestionV1(input: Readonly<{
  qlId: IdenticalFigureQlIdV1;
  seed: string;
  language: IdenticalFigureLanguageV1;
}>) {
  if (!QLS.includes(input.qlId)) throw new Error(`IDF-001 review runtime does not own ${input.qlId}.`);
  if (!IDENTICAL_FIGURE_PERMANENT_QL_ALLOCATIONS_V13.some((row) => row.permanentQlId === input.qlId)) {
    throw new Error(`IDF-001 allocation missing ${input.qlId}.`);
  }
  const h = hash32(`${input.qlId}|${input.seed}`);
  const states = buildStates(input.qlId, h);
  const correct = solvePartition(states);
  const optionPartitions = makeOptions(correct, h);
  const correctIndex = optionPartitions.findIndex((partition) => normalizePartition(partition) === normalizePartition(correct));
  if (correctIndex < 0) throw new Error("IDF-001 correct partition was lost during option construction.");
  if (optionPartitions.filter((partition) => normalizePartition(partition) === normalizePartition(correct)).length !== 1) {
    throw new Error("IDF-001 option set does not contain exactly one correct partition.");
  }

  const stem = stemFor(input.qlId, input.language, h, states);
  const explanation = explanationFor(input.language, states, correct, optionPartitions, correctIndex);
  const difficulty: IdenticalFigureDifficultyV1 = input.qlId === "SPA-QL-061" ? "EASY" : input.qlId === "SPA-QL-062" ? "MODERATE" : "HARD";
  const geometryKey = JSON.stringify(states);
  const answerKey = normalizePartition(correct);
  const geometryFingerprint = fingerprint(`${input.qlId}|${geometryKey}|${optionPartitions.map(normalizePartition).join("/")}`);
  const contentFingerprint = fingerprint(`${geometryFingerprint}|${input.language}|${stem}|${explanation.observation}|${explanation.check}`);

  return Object.freeze({
    version: "SPA-IDF-001-REVIEW-QUESTION-V1" as const,
    authorityId: IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
    qlId: input.qlId,
    chapterCode: "IDF-001" as const,
    language: input.language,
    seed: input.seed,
    difficulty,
    stem,
    stimulusSvg: bankSvg(states),
    optionLabels: OPTION_LABELS,
    options: Object.freeze(optionPartitions.map((partition) => Object.freeze({
      groups: partition,
      text: partitionText(partition),
      normalizedKey: normalizePartition(partition),
    }))),
    correctIndex,
    answer: OPTION_LABELS[correctIndex],
    explanation,
    solveFacts: Object.freeze({
      bankSize: states.length,
      groupCount: correct.length,
      figuresPerGroup: correct[0]?.length ?? 0,
      semanticKeysByFigure: Object.freeze(states.map((state, index) => Object.freeze({ number: index + 1, key: figureKey(state) }))),
      correctPartition: correct,
      correctPartitionKey: answerKey,
      transformPolicy: states[0]?.kind === "TRANSFORM" ? states[0].policy : null,
      distractorFailures: Object.freeze(optionPartitions.map((partition, index) => {
        if (index === correctIndex) return null;
        const badGroup = partition.find((group) => new Set(group.map((number) => figureKey(states[number - 1]))).size !== 1)!;
        return Object.freeze({ option: OPTION_LABELS[index], mixedGroup: Object.freeze([...badGroup]) });
      }).filter((value): value is NonNullable<typeof value> => value !== null)),
    }),
    validation: Object.freeze({
      groupKeysRecomputedFromSemanticState: true as const,
      everyFigureUsedExactlyOnce: true as const,
      exactlyThreeGroups: true as const,
      exactlyThreeFiguresPerGroup: true as const,
      correctPartitionUnique: true as const,
      everyDistractorBreaksAtLeastOneGroup: true as const,
      duplicatePartitionsRejected: true as const,
      transformPolicyExplicit: input.qlId === "SPA-QL-063" ? true as const : null,
      svgIsOutputNotAuthority: true as const,
      deterministic: true as const,
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
