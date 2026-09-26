import { reconstructUniqueOrder } from "./RNK-CP-004/cp004-foundation";

export const RNK_001_NATIVE_ARRANGEMENT_PRESENTATION_V1 =
  "RNK_001_NATIVE_ARRANGEMENT_CLUE_BY_CLUE_V1" as const;

export type RnkNativeArrangementLocale = "hi-IN" | "pa-IN";

type AnyQuestion = Record<string, any>;
type Edge = readonly [string, string];

const TARGET_QLS = new Set([
  "RNK-QL-027",
  "RNK-QL-028",
  "RNK-QL-029",
  "RNK-QL-030",
  "RNK-QL-031",
  "RNK-QL-032",
  "RNK-QL-033",
  "RNK-QL-034",
]);

const HINDI_ORDINALS = [
  "पहली", "दूसरी", "तीसरी", "चौथी", "पाँचवीं",
  "छठी", "सातवीं", "आठवीं", "नौवीं", "दसवीं",
] as const;
const PUNJABI_ORDINALS = [
  "ਪਹਿਲੀ", "ਦੂਜੀ", "ਤੀਜੀ", "ਚੌਥੀ", "ਪੰਜਵੀਂ",
  "ਛੇਵੀਂ", "ਸੱਤਵੀਂ", "ਅੱਠਵੀਂ", "ਨੌਵੀਂ", "ਦਸਵੀਂ",
] as const;

function localizedNameMap(localized: AnyQuestion): ReadonlyMap<string, string> {
  const canonical = Array.isArray(localized.canonicalNames) ? localized.canonicalNames : [];
  const native = Array.isArray(localized.localizedNames) ? localized.localizedNames : [];
  if (canonical.length === 0 || canonical.length !== native.length) {
    throw new Error("RNK native arrangement presentation requires aligned canonical/localized names.");
  }
  return new Map(canonical.map((name: string, index: number) => [name, String(native[index])]));
}

function localizedFrozenOrder(canonical: AnyQuestion, localized: AnyQuestion): readonly string[] {
  const evidence = canonical.displayedEvidence;
  if (!evidence || !Array.isArray(evidence.entities) || !Array.isArray(evidence.clues)) {
    throw new Error("RNK native arrangement presentation requires CP004 displayed evidence.");
  }
  const order = reconstructUniqueOrder(evidence.entities, evidence.clues);
  const names = localizedNameMap(localized);
  return order.map((name: string) => {
    const value = names.get(name);
    if (!value) throw new Error(`RNK native arrangement presentation cannot localize ${name}.`);
    return value;
  });
}

function localizedClues(localized: AnyQuestion): readonly string[] {
  const stem = String(localized.stem ?? "");
  const clues = stem
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
  if (clues.length < 4) {
    throw new Error(`RNK native arrangement presentation expected >=4 displayed clues, found ${clues.length}.`);
  }
  return clues;
}

function relationForNativeClue(
  clue: string,
  order: readonly string[],
  locale: RnkNativeArrangementLocale,
): Edge {
  const orderIndex = new Map(order.map((name, index) => [name, index]));
  const mentioned = order
    .filter((name) => clue.includes(name))
    .sort((left, right) => clue.indexOf(left) - clue.indexOf(right));
  if (mentioned.length !== 2) {
    throw new Error(`RNK native clue must mention exactly two ordered names: '${clue}'.`);
  }

  const first = mentioned[0]!;
  const second = mentioned[1]!;
  let relation: Edge;
  if (locale === "hi-IN") {
    if (/नीचे/u.test(clue)) relation = [second, first];
    else if (/(?:ऊपर|बेहतर|ऊँचा)/u.test(clue)) relation = [first, second];
    else throw new Error(`RNK Hindi clue direction not recognized: '${clue}'.`);
  } else {
    if (/ਹੇਠਾਂ/u.test(clue)) relation = [second, first];
    else if (/(?:ਉੱਪਰ|ਬਿਹਤਰ|ਉੱਚਾ)/u.test(clue)) relation = [first, second];
    else throw new Error(`RNK Punjabi clue direction not recognized: '${clue}'.`);
  }

  const higherIndex = orderIndex.get(relation[0]);
  const lowerIndex = orderIndex.get(relation[1]);
  if (higherIndex == null || lowerIndex == null || higherIndex >= lowerIndex) {
    throw new Error(`RNK native clue contradicts frozen order: '${clue}' -> ${relation[0]} > ${relation[1]}.`);
  }
  return relation;
}

function longestPath(order: readonly string[], edges: readonly Edge[]): readonly string[] {
  const successors = new Map(order.map((name) => [name, [] as string[]]));
  for (const [higher, lower] of edges) successors.get(higher)?.push(lower);
  const memo = new Map<string, readonly string[]>();

  function visit(name: string): readonly string[] {
    const cached = memo.get(name);
    if (cached) return cached;
    let best: readonly string[] = [name];
    for (const next of successors.get(name) ?? []) {
      const candidate = [name, ...visit(next)];
      if (candidate.length > best.length) best = candidate;
    }
    memo.set(name, best);
    return best;
  }

  let best: readonly string[] = [];
  for (const name of order) {
    const candidate = visit(name);
    if (candidate.length > best.length) best = candidate;
  }
  return best;
}

export function buildRnkNativeArrangementPresentationV1(input: Readonly<{
  qlId: string;
  locale: RnkNativeArrangementLocale;
  canonicalQuestion: AnyQuestion;
  localizedQuestion: AnyQuestion;
  answer: string;
}>): string | null {
  if (!TARGET_QLS.has(input.qlId)) return null;

  const order = localizedFrozenOrder(input.canonicalQuestion, input.localizedQuestion);
  const clues = localizedClues(input.localizedQuestion);
  const ordinals = input.locale === "hi-IN" ? HINDI_ORDINALS : PUNJABI_ORDINALS;
  const edges: Edge[] = [];
  const steps: string[] = [];
  let previousLongest = 0;

  clues.forEach((clue, index) => {
    const relation = relationForNativeClue(clue, order, input.locale);
    if (!edges.some(([higher, lower]) => higher === relation[0] && lower === relation[1])) {
      edges.push(relation);
    }
    const chain = longestPath(order, edges);
    const ordinal = ordinals[index] ?? String(index + 1);
    if (input.locale === "hi-IN") {
      let line = `${ordinal} तुलना से: ${relation[0]} > ${relation[1]}।`;
      if (chain.length >= 3 && chain.length > previousLongest) {
        line += ` इससे श्रृंखला बनती है: ${chain.join(" > ")}।`;
      }
      steps.push(line);
    } else {
      let line = `${ordinal} ਤੁਲਨਾ ਤੋਂ: ${relation[0]} > ${relation[1]}।`;
      if (chain.length >= 3 && chain.length > previousLongest) {
        line += ` ਇਸ ਨਾਲ ਲੜੀ ਬਣਦੀ ਹੈ: ${chain.join(" > ")}।`;
      }
      steps.push(line);
    }
    previousLongest = Math.max(previousLongest, chain.length);
  });

  steps.push(input.locale === "hi-IN"
    ? `सभी संबंध जोड़ने पर पूरा क्रम है: ${order.join(" > ")}।`
    : `ਸਾਰੇ ਸੰਬੰਧ ਜੋੜਨ ਤੋਂ ਬਾਅਦ ਪੂਰਾ ਕ੍ਰਮ ਹੈ: ${order.join(" > ")}।`);
  steps.push(input.locale === "hi-IN"
    ? `अतः सही उत्तर: ${input.answer}।`
    : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ: ${input.answer}।`);

  if (steps.length < clues.length + 2) {
    throw new Error("RNK native arrangement construction path is incomplete.");
  }
  return steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
}
