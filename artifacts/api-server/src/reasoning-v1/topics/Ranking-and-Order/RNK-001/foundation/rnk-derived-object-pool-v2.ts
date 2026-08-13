import type { RnkObjectLocale } from "./rnk-object-pool-v2";

export interface RnkSymbolicRankableObject {
  readonly id: string;
  readonly symbol: string;
  readonly labels: Readonly<Record<RnkObjectLocale, string>>;
  readonly learnerFacingModes: readonly ("SYMBOL_ONLY" | "OBJECT_LABEL")[];
}

export type RnkDerivedQuantityDomainId =
  | "WEIGHT"
  | "MONEY_BALANCE"
  | "AGE"
  | "POPULATION_COUNT"
  | "SCORE"
  | "TIME_TAKEN"
  | "HEIGHT"
  | "INCOME";

export interface RnkDerivedQuantityDomain {
  readonly id: RnkDerivedQuantityDomainId;
  readonly labels: Readonly<Record<RnkObjectLocale, string>>;
  readonly higherMeaning: Readonly<Record<RnkObjectLocale, string>>;
  readonly lowerMeaning: Readonly<Record<RnkObjectLocale, string>>;
  readonly supportedOperations: readonly RnkDerivedOperationKind[];
}

export interface RnkPartitionScheme {
  readonly id: string;
  readonly wholeLabels: Readonly<Record<RnkObjectLocale, string>>;
  readonly categories: readonly [
    Readonly<Record<RnkObjectLocale, string>>,
    Readonly<Record<RnkObjectLocale, string>>,
  ];
  readonly examAuthenticity: "SOURCE_BACKED" | "NEUTRAL_VARIANT";
}

export type RnkDerivedOperationKind =
  | "TRANSFER"
  | "MULTIPLIER"
  | "FRACTION_OF"
  | "EXACT_DIFFERENCE"
  | "SUM_COMPARISON"
  | "CATEGORY_RATIO"
  | "CATEGORY_AHEAD_COUNT"
  | "BOUNDED_CONSECUTIVE_VALUES";

export interface RnkDerivedOperationSurface {
  readonly kind: RnkDerivedOperationKind;
  readonly templates: Readonly<Record<RnkObjectLocale, readonly string[]>>;
}

function localized(en: string, hi: string, pa: string): Readonly<Record<RnkObjectLocale, string>> {
  return { en: en.normalize("NFC"), hi: hi.normalize("NFC"), pa: pa.normalize("NFC") };
}

function symbolic(symbol: string, ordinal: number): RnkSymbolicRankableObject {
  return {
    id: `symbolic-${String(ordinal).padStart(2, "0")}-${symbol.toLowerCase()}`,
    symbol,
    labels: localized(`Object ${symbol}`, `वस्तु ${symbol}`, `ਵਸਤੂ ${symbol}`),
    learnerFacingModes: ["SYMBOL_ONLY", "OBJECT_LABEL"],
  };
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const GREEK_SAFE = [
  "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "P11", "P12", "P13",
  "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10", "Q11", "Q12", "Q13",
] as const;

/**
 * 52 neutral symbolic objects for future derived-quantity ranking questions.
 * Frozen CP001..CP006 do not import this pool.
 */
export const RNK_SYMBOLIC_OBJECT_POOL_V2: readonly RnkSymbolicRankableObject[] = [
  ...ALPHABET.map((symbol, index) => symbolic(symbol, index + 1)),
  ...GREEK_SAFE.map((symbol, index) => symbolic(symbol, ALPHABET.length + index + 1)),
] as const;

export const RNK_DERIVED_QUANTITY_DOMAINS_V2: readonly RnkDerivedQuantityDomain[] = [
  {
    id: "WEIGHT",
    labels: localized("weight", "वज़न", "ਵਜ਼ਨ"),
    higherMeaning: localized("heavier", "अधिक भारी", "ਵੱਧ ਭਾਰੀ"),
    lowerMeaning: localized("lighter", "कम भारी", "ਘੱਟ ਭਾਰੀ"),
    supportedOperations: ["MULTIPLIER", "FRACTION_OF", "SUM_COMPARISON", "EXACT_DIFFERENCE"],
  },
  {
    id: "MONEY_BALANCE",
    labels: localized("money balance", "धनराशि", "ਧਨ ਰਕਮ"),
    higherMeaning: localized("has more money", "के पास अधिक धन है", "ਕੋਲ ਵੱਧ ਧਨ ਹੈ"),
    lowerMeaning: localized("has less money", "के पास कम धन है", "ਕੋਲ ਘੱਟ ਧਨ ਹੈ"),
    supportedOperations: ["TRANSFER", "EXACT_DIFFERENCE", "SUM_COMPARISON"],
  },
  {
    id: "AGE",
    labels: localized("age", "आयु", "ਉਮਰ"),
    higherMeaning: localized("older", "अधिक आयु का", "ਵੱਧ ਉਮਰ ਦਾ"),
    lowerMeaning: localized("younger", "कम आयु का", "ਘੱਟ ਉਮਰ ਦਾ"),
    supportedOperations: ["EXACT_DIFFERENCE", "BOUNDED_CONSECUTIVE_VALUES"],
  },
  {
    id: "POPULATION_COUNT",
    labels: localized("group count", "समूह संख्या", "ਸਮੂਹ ਗਿਣਤੀ"),
    higherMeaning: localized("has the larger count", "की संख्या अधिक है", "ਦੀ ਗਿਣਤੀ ਵੱਧ ਹੈ"),
    lowerMeaning: localized("has the smaller count", "की संख्या कम है", "ਦੀ ਗਿਣਤੀ ਘੱਟ ਹੈ"),
    supportedOperations: ["CATEGORY_RATIO", "CATEGORY_AHEAD_COUNT", "EXACT_DIFFERENCE"],
  },
  {
    id: "SCORE",
    labels: localized("score", "अंक", "ਅੰਕ"),
    higherMeaning: localized("scored more", "ने अधिक अंक प्राप्त किए", "ਨੇ ਵੱਧ ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ"),
    lowerMeaning: localized("scored less", "ने कम अंक प्राप्त किए", "ਨੇ ਘੱਟ ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ"),
    supportedOperations: ["EXACT_DIFFERENCE", "MULTIPLIER", "FRACTION_OF"],
  },
  {
    id: "TIME_TAKEN",
    labels: localized("time taken", "लिया गया समय", "ਲੱਗਿਆ ਸਮਾਂ"),
    higherMeaning: localized("took more time", "ने अधिक समय लिया", "ਨੇ ਵੱਧ ਸਮਾਂ ਲਿਆ"),
    lowerMeaning: localized("took less time", "ने कम समय लिया", "ਨੇ ਘੱਟ ਸਮਾਂ ਲਿਆ"),
    supportedOperations: ["EXACT_DIFFERENCE", "MULTIPLIER", "FRACTION_OF"],
  },
  {
    id: "HEIGHT",
    labels: localized("height", "ऊँचाई", "ਕੱਦ"),
    higherMeaning: localized("is taller", "की ऊँचाई अधिक है", "ਦਾ ਕੱਦ ਵੱਧ ਹੈ"),
    lowerMeaning: localized("is shorter", "की ऊँचाई कम है", "ਦਾ ਕੱਦ ਘੱਟ ਹੈ"),
    supportedOperations: ["EXACT_DIFFERENCE", "MULTIPLIER", "FRACTION_OF"],
  },
  {
    id: "INCOME",
    labels: localized("income", "आय", "ਆਮਦਨ"),
    higherMeaning: localized("has higher income", "की आय अधिक है", "ਦੀ ਆਮਦਨ ਵੱਧ ਹੈ"),
    lowerMeaning: localized("has lower income", "की आय कम है", "ਦੀ ਆਮਦਨ ਘੱਟ ਹੈ"),
    supportedOperations: ["EXACT_DIFFERENCE", "MULTIPLIER", "FRACTION_OF", "SUM_COMPARISON"],
  },
] as const;

export const RNK_PARTITION_SCHEMES_V2: readonly RnkPartitionScheme[] = [
  {
    id: "boys-girls",
    wholeLabels: localized("students", "विद्यार्थी", "ਵਿਦਿਆਰਥੀ"),
    categories: [localized("boys", "लड़के", "ਮੁੰਡੇ"), localized("girls", "लड़कियाँ", "ਕੁੜੀਆਂ")],
    examAuthenticity: "SOURCE_BACKED",
  },
  {
    id: "section-a-b",
    wholeLabels: localized("students", "विद्यार्थी", "ਵਿਦਿਆਰਥੀ"),
    categories: [localized("Section A students", "सेक्शन A के विद्यार्थी", "ਸੈਕਸ਼ਨ A ਦੇ ਵਿਦਿਆਰਥੀ"), localized("Section B students", "सेक्शन B के विद्यार्थी", "ਸੈਕਸ਼ਨ B ਦੇ ਵਿਦਿਆਰਥੀ")],
    examAuthenticity: "NEUTRAL_VARIANT",
  },
  {
    id: "morning-evening-batch",
    wholeLabels: localized("candidates", "अभ्यर्थी", "ਉਮੀਦਵਾਰ"),
    categories: [localized("morning-batch candidates", "सुबह बैच के अभ्यर्थी", "ਸਵੇਰ ਬੈਚ ਦੇ ਉਮੀਦਵਾਰ"), localized("evening-batch candidates", "शाम बैच के अभ्यर्थी", "ਸ਼ਾਮ ਬੈਚ ਦੇ ਉਮੀਦਵਾਰ")],
    examAuthenticity: "NEUTRAL_VARIANT",
  },
  {
    id: "batch-p-q",
    wholeLabels: localized("trainees", "प्रशिक्षु", "ਸਿਖਿਆਰਥੀ"),
    categories: [localized("Batch P trainees", "बैच P के प्रशिक्षु", "ਬੈਚ P ਦੇ ਸਿਖਿਆਰਥੀ"), localized("Batch Q trainees", "बैच Q के प्रशिक्षु", "ਬੈਚ Q ਦੇ ਸਿਖਿਆਰਥੀ")],
    examAuthenticity: "NEUTRAL_VARIANT",
  },
  {
    id: "group-x-y",
    wholeLabels: localized("participants", "प्रतिभागी", "ਭਾਗੀਦਾਰ"),
    categories: [localized("Group X participants", "समूह X के प्रतिभागी", "ਗਰੁੱਪ X ਦੇ ਭਾਗੀਦਾਰ"), localized("Group Y participants", "समूह Y के प्रतिभागी", "ਗਰੁੱਪ Y ਦੇ ਭਾਗੀਦਾਰ")],
    examAuthenticity: "NEUTRAL_VARIANT",
  },
  {
    id: "shift-one-two",
    wholeLabels: localized("employees", "कर्मचारी", "ਕਰਮਚਾਰੀ"),
    categories: [localized("first-shift employees", "पहली पाली के कर्मचारी", "ਪਹਿਲੀ ਸ਼ਿਫਟ ਦੇ ਕਰਮਚਾਰੀ"), localized("second-shift employees", "दूसरी पाली के कर्मचारी", "ਦੂਜੀ ਸ਼ਿਫਟ ਦੇ ਕਰਮਚਾਰੀ")],
    examAuthenticity: "NEUTRAL_VARIANT",
  },
  {
    id: "team-a-b",
    wholeLabels: localized("participants", "प्रतिभागी", "ਭਾਗੀਦਾਰ"),
    categories: [localized("Team A participants", "टीम A के प्रतिभागी", "ਟੀਮ A ਦੇ ਭਾਗੀਦਾਰ"), localized("Team B participants", "टीम B के प्रतिभागी", "ਟੀਮ B ਦੇ ਭਾਗੀਦਾਰ")],
    examAuthenticity: "NEUTRAL_VARIANT",
  },
  {
    id: "set-m-n",
    wholeLabels: localized("candidates", "अभ्यर्थी", "ਉਮੀਦਵਾਰ"),
    categories: [localized("Set M candidates", "सेट M के अभ्यर्थी", "ਸੈੱਟ M ਦੇ ਉਮੀਦਵਾਰ"), localized("Set N candidates", "सेट N के अभ्यर्थी", "ਸੈੱਟ N ਦੇ ਉਮੀਦਵਾਰ")],
    examAuthenticity: "NEUTRAL_VARIANT",
  },
  {
    id: "first-second-year",
    wholeLabels: localized("students", "विद्यार्थी", "ਵਿਦਿਆਰਥੀ"),
    categories: [localized("first-year students", "प्रथम वर्ष के विद्यार्थी", "ਪਹਿਲੇ ਸਾਲ ਦੇ ਵਿਦਿਆਰਥੀ"), localized("second-year students", "द्वितीय वर्ष के विद्यार्थी", "ਦੂਜੇ ਸਾਲ ਦੇ ਵਿਦਿਆਰਥੀ")],
    examAuthenticity: "NEUTRAL_VARIANT",
  },
  {
    id: "desk-a-b",
    wholeLabels: localized("applicants", "आवेदक", "ਅਰਜ਼ੀਦਾਰ"),
    categories: [localized("Desk A applicants", "डेस्क A के आवेदक", "ਡੈਸਕ A ਦੇ ਅਰਜ਼ੀਦਾਰ"), localized("Desk B applicants", "डेस्क B के आवेदक", "ਡੈਸਕ B ਦੇ ਅਰਜ਼ੀਦਾਰ")],
    examAuthenticity: "NEUTRAL_VARIANT",
  },
  {
    id: "centre-p-q",
    wholeLabels: localized("examinees", "परीक्षार्थी", "ਪਰੀਖਿਆਰਥੀ"),
    categories: [localized("Centre P examinees", "केंद्र P के परीक्षार्थी", "ਕੇਂਦਰ P ਦੇ ਪਰੀਖਿਆਰਥੀ"), localized("Centre Q examinees", "केंद्र Q के परीक्षार्थी", "ਕੇਂਦਰ Q ਦੇ ਪਰੀਖਿਆਰਥੀ")],
    examAuthenticity: "NEUTRAL_VARIANT",
  },
  {
    id: "list-a-b",
    wholeLabels: localized("qualifiers", "योग्य अभ्यर्थी", "ਯੋਗ ਉਮੀਦਵਾਰ"),
    categories: [localized("List A qualifiers", "सूची A के योग्य अभ्यर्थी", "ਸੂਚੀ A ਦੇ ਯੋਗ ਉਮੀਦਵਾਰ"), localized("List B qualifiers", "सूची B के योग्य अभ्यर्थी", "ਸੂਚੀ B ਦੇ ਯੋਗ ਉਮੀਦਵਾਰ")],
    examAuthenticity: "NEUTRAL_VARIANT",
  },
] as const;

export const RNK_DERIVED_OPERATION_SURFACES_V2: readonly RnkDerivedOperationSurface[] = [
  {
    kind: "TRANSFER",
    templates: {
      en: ["{A} transfers {X} to {B}.", "{B} receives {X} from {A}."],
      hi: ["{A}, {B} को {X} देता है।", "{B} को {A} से {X} मिलता है।"],
      pa: ["{A}, {B} ਨੂੰ {X} ਦਿੰਦਾ ਹੈ।", "{B} ਨੂੰ {A} ਤੋਂ {X} ਮਿਲਦਾ ਹੈ।"],
    },
  },
  {
    kind: "MULTIPLIER",
    templates: {
      en: ["{A} is {K} times {B}.", "The value for {A} is {K} times the value for {B}."],
      hi: ["{A}, {B} का {K} गुना है।", "{A} का मान {B} के मान का {K} गुना है।"],
      pa: ["{A}, {B} ਦਾ {K} ਗੁਣਾ ਹੈ।", "{A} ਦਾ ਮੁੱਲ {B} ਦੇ ਮੁੱਲ ਦਾ {K} ਗੁਣਾ ਹੈ।"],
    },
  },
  {
    kind: "FRACTION_OF",
    templates: {
      en: ["{A} is {F} of {B}.", "The value for {A} is {F} of the value for {B}."],
      hi: ["{A}, {B} का {F} है।", "{A} का मान {B} के मान का {F} है।"],
      pa: ["{A}, {B} ਦਾ {F} ਹੈ।", "{A} ਦਾ ਮੁੱਲ {B} ਦੇ ਮੁੱਲ ਦਾ {F} ਹੈ।"],
    },
  },
  {
    kind: "EXACT_DIFFERENCE",
    templates: {
      en: ["{A} is exactly {D} more than {B}.", "{B} is exactly {D} less than {A}."],
      hi: ["{A}, {B} से ठीक {D} अधिक है।", "{B}, {A} से ठीक {D} कम है।"],
      pa: ["{A}, {B} ਤੋਂ ਠੀਕ {D} ਵੱਧ ਹੈ।", "{B}, {A} ਤੋਂ ਠੀਕ {D} ਘੱਟ ਹੈ।"],
    },
  },
  {
    kind: "SUM_COMPARISON",
    templates: {
      en: ["The combined value of {A} and {B} is less than {C}.", "{C} exceeds the combined value of {A} and {B}."],
      hi: ["{A} और {B} का संयुक्त मान {C} से कम है।", "{C}, {A} और {B} के संयुक्त मान से अधिक है।"],
      pa: ["{A} ਅਤੇ {B} ਦਾ ਮਿਲਿਆ ਮੁੱਲ {C} ਤੋਂ ਘੱਟ ਹੈ।", "{C}, {A} ਅਤੇ {B} ਦੇ ਮਿਲੇ ਮੁੱਲ ਤੋਂ ਵੱਧ ਹੈ।"],
    },
  },
  {
    kind: "CATEGORY_RATIO",
    templates: {
      en: ["The number in {A} is {K} times the number in {B}.", "{A} and {B} are in the ratio {R}."],
      hi: ["{A} की संख्या {B} की संख्या की {K} गुना है।", "{A} और {B} की संख्या का अनुपात {R} है।"],
      pa: ["{A} ਦੀ ਗਿਣਤੀ {B} ਦੀ ਗਿਣਤੀ ਦਾ {K} ਗੁਣਾ ਹੈ।", "{A} ਅਤੇ {B} ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ {R} ਹੈ।"],
    },
  },
  {
    kind: "CATEGORY_AHEAD_COUNT",
    templates: {
      en: ["Exactly {N} members of {A} are ranked ahead of {P}.", "There are {N} members of {A} above {P} in the ranking."],
      hi: ["{A} के ठीक {N} सदस्य {P} से आगे रैंक किए गए हैं।", "रैंकिंग में {P} से ऊपर {A} के {N} सदस्य हैं।"],
      pa: ["{A} ਦੇ ਠੀਕ {N} ਮੈਂਬਰ {P} ਤੋਂ ਅੱਗੇ ਰੈਂਕ ਕੀਤੇ ਗਏ ਹਨ।", "ਰੈਂਕਿੰਗ ਵਿੱਚ {P} ਤੋਂ ਉੱਪਰ {A} ਦੇ {N} ਮੈਂਬਰ ਹਨ।"],
    },
  },
  {
    kind: "BOUNDED_CONSECUTIVE_VALUES",
    templates: {
      en: ["The values are distinct consecutive integers from {L} to {H}.", "The lowest value is {L} and the highest value is {H}, with every integer in between used once."],
      hi: ["मान {L} से {H} तक अलग-अलग क्रमागत पूर्णांक हैं।", "सबसे छोटा मान {L} और सबसे बड़ा मान {H} है तथा बीच का हर पूर्णांक एक बार प्रयुक्त होता है।"],
      pa: ["ਮੁੱਲ {L} ਤੋਂ {H} ਤੱਕ ਵੱਖ-ਵੱਖ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕ ਹਨ।", "ਸਭ ਤੋਂ ਘੱਟ ਮੁੱਲ {L} ਅਤੇ ਸਭ ਤੋਂ ਵੱਧ ਮੁੱਲ {H} ਹੈ ਅਤੇ ਵਿਚਕਾਰਲਾ ਹਰ ਪੂਰਨ ਅੰਕ ਇੱਕ ਵਾਰ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"],
    },
  },
] as const;

function mix32(value: number): number {
  let x = value >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function pick<T>(values: readonly T[], seed: number, salt: number): T {
  if (values.length === 0) throw new Error("Cannot select from an empty RNK derived-object pool.");
  return values[mix32(seed ^ salt) % values.length]!;
}

export function selectRnkSymbolicObjects(seed: number, count: number): readonly RnkSymbolicRankableObject[] {
  if (!Number.isInteger(count) || count < 1 || count > RNK_SYMBOLIC_OBJECT_POOL_V2.length) {
    throw new Error(`Invalid RNK symbolic-object count: ${count}`);
  }
  const keyed = RNK_SYMBOLIC_OBJECT_POOL_V2
    .map((entry, index) => ({ entry, key: mix32(seed ^ Math.imul(index + 1, 0x9e3779b1)) }))
    .sort((a, b) => a.key - b.key || a.entry.id.localeCompare(b.entry.id));
  return keyed.slice(0, count).map(({ entry }) => entry);
}

export function selectRnkDerivedQuantityDomain(seed: number): RnkDerivedQuantityDomain {
  return pick(RNK_DERIVED_QUANTITY_DOMAINS_V2, seed, 0x5155414e);
}

export function selectRnkPartitionScheme(seed: number): RnkPartitionScheme {
  return pick(RNK_PARTITION_SCHEMES_V2, seed, 0x50415254);
}

export function rnkDerivedOperationSurface(kind: RnkDerivedOperationKind): RnkDerivedOperationSurface {
  const found = RNK_DERIVED_OPERATION_SURFACES_V2.find((entry) => entry.kind === kind);
  if (!found) throw new Error(`Missing RNK derived operation surface: ${kind}`);
  return found;
}
