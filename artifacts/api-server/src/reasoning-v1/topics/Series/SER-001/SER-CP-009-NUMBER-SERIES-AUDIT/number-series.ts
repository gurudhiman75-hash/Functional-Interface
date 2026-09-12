export const SER_CP009_NUMBER_SERIES_QL_IDS = [
  "SER-QL-029",
  "SER-QL-030",
  "SER-QL-031",
  "SER-QL-032",
  "SER-QL-033",
  "SER-QL-034",
  "SER-QL-035",
  "SER-QL-036",
  "SER-QL-037",
  "SER-QL-038",
  "SER-QL-039",
  "SER-QL-040",
  "SER-QL-041",
  "SER-QL-042",
] as const;

export type SerCp009QlId = (typeof SER_CP009_NUMBER_SERIES_QL_IDS)[number];
export type SerCp009Locale = "en-IN" | "hi-IN" | "pa-IN";
export type SerCp009Difficulty = "EASY" | "MEDIUM" | "HARD";
export type SerCp009TaskKind = "NEXT_TERM" | "MISSING_TERM" | "WRONG_TERM" | "MULTI_MISSING" | "OPTION_RELATION";

export interface SerCp009Option {
  readonly value: string;
  readonly errorLabel: string | null;
}

export interface GeneratedSerCp009Question {
  readonly packageId: "SER-001";
  readonly checkpointId: "SER-CP-009";
  readonly qlId: SerCp009QlId;
  readonly seed: number;
  readonly locale: SerCp009Locale;
  readonly language: "en" | "hi" | "pa";
  readonly taskKind: SerCp009TaskKind;
  readonly stem: string;
  readonly options: readonly SerCp009Option[];
  readonly correctIndex: number;
  readonly correctAnswer: string;
  readonly explanation: readonly string[];
  readonly difficulty: SerCp009Difficulty;
  readonly structuralFeatures: Readonly<Record<string, string | number | boolean>>;
  readonly examProfile: "SSC_REASONING";
  readonly optionCount: 4;
  readonly maturity: "SOURCE_GAP_PROTOTYPE";
  readonly reviewOnly: true;
  readonly permanentQlId: null;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly mockTestEligible: false;
  readonly publiclyPublishable: false;
}

export const SER_CP009_QL_AUTHORITIES = Object.freeze([
  ["SER-QL-029", "FIXED_DIFFERENCE_NUMBER_SERIES"],
  ["SER-QL-030", "PROGRESSIVE_DIFFERENCE_NUMBER_SERIES"],
  ["SER-QL-031", "FIGURATE_DIFFERENCE_NUMBER_SERIES"],
  ["SER-QL-032", "CONSTANT_RATIO_NUMBER_SERIES"],
  ["SER-QL-033", "ALTERNATING_OPERATION_NUMBER_SERIES"],
  ["SER-QL-034", "INTERLEAVED_DOUBLE_NUMBER_SERIES"],
  ["SER-QL-035", "PROGRESSIVE_MULTIPLIER_ADJUSTMENT_SERIES"],
  ["SER-QL-036", "DIRECT_POWER_NUMBER_SERIES"],
  ["SER-QL-037", "PRIME_DIFFERENCE_NUMBER_SERIES"],
  ["SER-QL-038", "FIBONACCI_LIKE_NUMBER_SERIES"],
  ["SER-QL-039", "DIGIT_ROTATION_NUMBER_SERIES"],
  ["SER-QL-040", "WRONG_TERM_POWER_SERIES"],
  ["SER-QL-041", "GROUPED_MULTI_MISSING_NUMBER_SERIES"],
  ["SER-QL-042", "INTERNAL_DIGIT_RELATION_OPTION_SERIES"],
] as const);

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53] as const;

function createPrng(seed: number): () => number {
  let state = (seed ^ 0x9e3779b9) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function int(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function pick<T>(rng: () => number, values: readonly T[]): T {
  return values[Math.floor(rng() * values.length)]!;
}

function language(locale: SerCp009Locale): "en" | "hi" | "pa" {
  return locale === "en-IN" ? "en" : locale === "hi-IN" ? "hi" : "pa";
}

function local(locale: SerCp009Locale, en: string, hi: string, pa: string): string {
  return locale === "en-IN" ? en : locale === "hi-IN" ? hi : pa;
}

function instruction(locale: SerCp009Locale, task: SerCp009TaskKind): string {
  if (task === "WRONG_TERM") {
    return local(locale, "Which number is wrong in the following series?", "निम्नलिखित श्रृंखला में कौन-सी संख्या गलत है?", "ਹੇਠਾਂ ਦਿੱਤੀ ਲੜੀ ਵਿੱਚ ਕਿਹੜੀ ਸੰਖਿਆ ਗਲਤ ਹੈ?");
  }
  if (task === "MULTI_MISSING") {
    return local(locale, "Which set of numbers will replace the blanks in the series?", "श्रृंखला में रिक्त स्थानों पर कौन-सी संख्याएँ आएँगी?", "ਲੜੀ ਵਿੱਚ ਖਾਲੀ ਥਾਵਾਂ 'ਤੇ ਕਿਹੜੀਆਂ ਸੰਖਿਆਵਾਂ ਆਉਣਗੀਆਂ?");
  }
  if (task === "OPTION_RELATION") {
    return local(locale, "Which number will replace the question mark and follow the same relation?", "कौन-सी संख्या प्रश्नवाचक चिन्ह के स्थान पर आकर समान संबंध का पालन करेगी?", "ਕਿਹੜੀ ਸੰਖਿਆ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਆ ਕੇ ਉਹੀ ਸੰਬੰਧ ਬਣਾਏਗੀ?");
  }
  return local(locale, "Which number will replace the question mark in the following series?", "निम्नलिखित श्रृंखला में प्रश्नवाचक चिन्ह के स्थान पर कौन-सी संख्या आएगी?", "ਹੇਠਾਂ ਦਿੱਤੀ ਲੜੀ ਵਿੱਚ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਕਿਹੜੀ ਸੰਖਿਆ ਆਵੇਗੀ?");
}

function asLine(values: readonly (number | string)[]): string {
  return values.join(", ");
}

function qlNumber(qlId: SerCp009QlId): number {
  return Number(qlId.slice(-3));
}

function difficultyFromStructure(features: { layers: number; channels: number; diagnostic?: boolean; internalGap?: boolean }): SerCp009Difficulty {
  const score = features.layers + Math.max(0, features.channels - 1) + (features.diagnostic ? 2 : 0) + (features.internalGap ? 1 : 0);
  if (score >= 5) return "HARD";
  if (score >= 3) return "MEDIUM";
  return "EASY";
}

function placeOptions(correct: string, wrong: readonly { value: string; errorLabel: string }[], correctIndex: number): readonly SerCp009Option[] {
  const seen = new Set<string>([correct]);
  const candidates: SerCp009Option[] = [];
  for (const candidate of wrong) {
    if (seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    candidates.push({ value: candidate.value, errorLabel: candidate.errorLabel });
    if (candidates.length === 3) break;
  }
  if (candidates.length !== 3) throw new Error(`Need three unique distractors for ${correct}.`);
  const options = [...candidates];
  options.splice(correctIndex, 0, { value: correct, errorLabel: null });
  return Object.freeze(options);
}

function numericOptions(correct: number, anchors: readonly number[], correctIndex: number): readonly SerCp009Option[] {
  const delta = Math.max(1, Math.abs(anchors.at(-1)! - anchors.at(-2)!));
  const wrong = [
    { value: String(correct + 1), errorLabel: "ARITHMETIC_SLIP_PLUS_ONE" },
    { value: String(correct - 1), errorLabel: "ARITHMETIC_SLIP_MINUS_ONE" },
    { value: String(correct + delta), errorLabel: "REPEATED_PREVIOUS_CHANGE" },
    { value: String(correct - delta), errorLabel: "WRONG_CHANGE_DIRECTION" },
    { value: String(correct + 2 * Math.max(1, Math.floor(delta / 2))), errorLabel: "OVER_EXTENDED_CHANGE" },
  ];
  return placeOptions(String(correct), wrong, correctIndex);
}

function basePayload(
  qlId: SerCp009QlId,
  seed: number,
  locale: SerCp009Locale,
  taskKind: SerCp009TaskKind,
  correctAnswer: string,
  options: readonly SerCp009Option[],
  stem: string,
  explanation: readonly string[],
  features: Readonly<Record<string, string | number | boolean>>,
  difficulty: SerCp009Difficulty,
): GeneratedSerCp009Question {
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  if (correctIndex < 0 || options[correctIndex]?.value !== correctAnswer) throw new Error(`${qlId}: invalid correct option.`);
  return Object.freeze({
    packageId: "SER-001",
    checkpointId: "SER-CP-009",
    qlId,
    seed,
    locale,
    language: language(locale),
    taskKind,
    stem,
    options,
    correctIndex,
    correctAnswer,
    explanation: Object.freeze([...explanation]),
    difficulty,
    structuralFeatures: Object.freeze({ ...features }),
    examProfile: "SSC_REASONING",
    optionCount: 4,
    maturity: "SOURCE_GAP_PROTOTYPE",
    reviewOnly: true,
    permanentQlId: null,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    mockTestEligible: false,
    publiclyPublishable: false,
  });
}

function exactIntegerCubeRoot(value: number): number | null {
  const root = Math.round(Math.cbrt(value));
  return root ** 3 === value ? root : null;
}

function triangularRoot(value: number): number | null {
  const n = Math.round((Math.sqrt(8 * value + 1) - 1) / 2);
  return n * (n + 1) / 2 === value ? n : null;
}

function rotatePrefixLeft(value: string): string {
  if (!/^\d{4}$/.test(value)) throw new Error(`Expected four-digit token, received ${value}.`);
  return `${value[1]}${value[2]}${value[0]}${value[3]}`;
}

function digitRelationHolds(value: string): boolean {
  if (!/^\d{3}$/.test(value)) return false;
  return Number(value[1]) === Number(value[0]) + Number(value[2]);
}

function parseSeries(stem: string): string[] {
  const line = stem.split("\n").at(-1)?.trim() ?? stem.trim();
  return line.split(",").map((token) => token.trim()).filter(Boolean);
}

function parseNumber(token: string): number {
  const value = Number(token);
  if (!Number.isFinite(value)) throw new Error(`Expected numeric term, received ${token}.`);
  return value;
}

export function solveVisibleNumberSeries(
  qlId: SerCp009QlId,
  stem: string,
  options: readonly string[] = [],
): string {
  const tokens = parseSeries(stem);

  if (qlId === "SER-QL-029") {
    if (tokens.at(-1) !== "?" || tokens.length < 5) throw new Error("QL029 malformed.");
    const known = tokens.slice(0, -1).map(parseNumber);
    const d = known[1]! - known[0]!;
    if (known.slice(1).some((value, index) => value - known[index]! !== d)) throw new Error("QL029 is not constant-difference.");
    return String(known.at(-1)! + d);
  }

  if (qlId === "SER-QL-030") {
    if (tokens.length !== 6 || tokens[0] === "?" || tokens[1] === "?" || tokens[2] === "?") throw new Error("QL030 needs three opening anchors.");
    const t0 = parseNumber(tokens[0]!);
    const t1 = parseNumber(tokens[1]!);
    const t2 = parseNumber(tokens[2]!);
    const d0 = t1 - t0;
    const second = (t2 - t1) - d0;
    if (second === 0) throw new Error("QL030 degenerates to fixed difference.");
    const expected = [t0];
    let gap = d0;
    for (let i = 1; i < 6; i += 1) {
      expected.push(expected[i - 1]! + gap);
      gap += second;
    }
    let target = -1;
    for (let i = 0; i < tokens.length; i += 1) {
      if (tokens[i] === "?") {
        if (target !== -1) throw new Error("QL030 supports one missing term.");
        target = i;
      } else if (parseNumber(tokens[i]!) !== expected[i]) {
        throw new Error("QL030 visible evidence conflicts with the inferred second difference.");
      }
    }
    if (target < 0) throw new Error("QL030 has no missing term.");
    return String(expected[target]);
  }

  if (qlId === "SER-QL-031") {
    if (tokens.at(-1) !== "?" || tokens.length < 5) throw new Error("QL031 malformed.");
    const values = tokens.slice(0, -1).map(parseNumber);
    const diffs = values.slice(1).map((value, index) => value - values[index]!);
    const sign = Math.sign(diffs[0]!);
    if (sign === 0 || diffs.some((d) => Math.sign(d) !== sign)) throw new Error("QL031 needs one signed figurate-difference direction.");
    const abs = diffs.map(Math.abs);
    const candidates: number[] = [];

    const squareRoots = abs.map((value) => Number.isInteger(Math.sqrt(value)) ? Math.sqrt(value) : null);
    if (squareRoots.every((value) => value !== null) && squareRoots.slice(1).every((value, i) => value! - squareRoots[i]! === 1)) {
      candidates.push(sign * (squareRoots.at(-1)! + 1) ** 2);
    }
    const cubeRoots = abs.map(exactIntegerCubeRoot);
    if (cubeRoots.every((value) => value !== null) && cubeRoots.slice(1).every((value, i) => value! - cubeRoots[i]! === 1)) {
      candidates.push(sign * (cubeRoots.at(-1)! + 1) ** 3);
    }
    const triRoots = abs.map(triangularRoot);
    if (triRoots.every((value) => value !== null) && triRoots.slice(1).every((value, i) => value! - triRoots[i]! === 1)) {
      const next = triRoots.at(-1)! + 1;
      candidates.push(sign * (next * (next + 1) / 2));
    }
    const unique = [...new Set(candidates)];
    if (unique.length !== 1) throw new Error(`QL031 figurate pattern is ambiguous (${unique.length} candidates).`);
    return String(values.at(-1)! + unique[0]!);
  }

  if (qlId === "SER-QL-032") {
    if (tokens.at(-1) !== "?" || tokens.length < 5) throw new Error("QL032 malformed.");
    const values = tokens.slice(0, -1).map(parseNumber);
    if (values[0] === 0 || values[1] === 0) throw new Error("QL032 cannot infer ratio from zero.");
    const multiplyFactor = values[1]! / values[0]!;
    if (Number.isInteger(multiplyFactor) && multiplyFactor >= 2 && values.slice(1).every((value, i) => value === values[i]! * multiplyFactor)) {
      return String(values.at(-1)! * multiplyFactor);
    }
    const divideFactor = values[0]! / values[1]!;
    if (Number.isInteger(divideFactor) && divideFactor >= 2 && values.slice(1).every((value, i) => values[i]! === value * divideFactor)) {
      return String(values.at(-1)! / divideFactor);
    }
    throw new Error("QL032 has no exact constant integer ratio.");
  }

  if (qlId === "SER-QL-033") {
    if (tokens.at(-1) !== "?" || tokens.length !== 7) throw new Error("QL033 malformed.");
    const values = tokens.slice(0, -1).map(parseNumber);
    const add = values[1]! - values[0]!;
    const multiply = values[2]! / values[1]!;
    if (!Number.isInteger(multiply) || multiply < 2 || add === 0) throw new Error("QL033 invalid operation cycle.");
    for (let i = 1; i < values.length; i += 1) {
      const expected = i % 2 === 1 ? values[i - 1]! + add : values[i - 1]! * multiply;
      if (values[i] !== expected) throw new Error("QL033 does not repeat +a, ×b.");
    }
    return String(values.at(-1)! * multiply);
  }

  if (qlId === "SER-QL-034") {
    if (tokens.length !== 8 || tokens.at(-1) !== "?") throw new Error("QL034 malformed.");
    const values = tokens.slice(0, -1).map(parseNumber);
    const rowA = [values[0]!, values[2]!, values[4]!, values[6]!];
    const rowB = [values[1]!, values[3]!, values[5]!];
    const da = rowA[1]! - rowA[0]!;
    const db = rowB[1]! - rowB[0]!;
    if (!rowA.slice(1).every((v, i) => v - rowA[i]! === da)) throw new Error("QL034 odd row is inconsistent.");
    if (!rowB.slice(1).every((v, i) => v - rowB[i]! === db)) throw new Error("QL034 even row is inconsistent.");
    if (da === db) throw new Error("QL034 rows degenerate to the same change.");
    return String(rowB.at(-1)! + db);
  }

  if (qlId === "SER-QL-035") {
    if (tokens.length !== 6 || tokens[4] !== "?") throw new Error("QL035 must hide the fifth term.");
    const visible = tokens.map((token) => token === "?" ? null : parseNumber(token));
    const answers = new Set<number>();
    for (let firstMultiplier = 2; firstMultiplier <= 5; firstMultiplier += 1) {
      for (let adjustment = -3; adjustment <= 3; adjustment += 1) {
        const built = [visible[0]!];
        for (let i = 1; i < 6; i += 1) built.push(built[i - 1]! * (firstMultiplier + i - 1) + adjustment);
        if (built.every((value, i) => visible[i] === null || visible[i] === value)) answers.add(built[4]!);
      }
    }
    if (answers.size !== 1) throw new Error(`QL035 visible state has ${answers.size} supported rules.`);
    return String([...answers][0]);
  }

  if (qlId === "SER-QL-036") {
    if (tokens.length !== 6 || tokens.filter((token) => token === "?").length !== 1) throw new Error("QL036 malformed.");
    const visible = tokens.map((token) => token === "?" ? null : parseNumber(token));
    const target = tokens.indexOf("?");
    const answers = new Set<number>();
    for (let base = 1; base <= 12; base += 1) {
      for (let step = 1; step <= 3; step += 1) {
        for (const power of [2, 3] as const) {
          for (const offset of [-1, 0, 1] as const) {
            const built = Array.from({ length: 6 }, (_, i) => (base + i * step) ** power + offset);
            if (built.every((value, i) => visible[i] === null || visible[i] === value)) answers.add(built[target]!);
          }
        }
      }
    }
    if (answers.size !== 1) throw new Error(`QL036 visible state has ${answers.size} supported rules.`);
    return String([...answers][0]);
  }

  if (qlId === "SER-QL-037") {
    if (tokens.at(-1) !== "?" || tokens.length < 5) throw new Error("QL037 malformed.");
    const values = tokens.slice(0, -1).map(parseNumber);
    const diffs = values.slice(1).map((value, i) => value - values[i]!);
    const matches: number[] = [];
    for (const stride of [1, 2] as const) {
      for (let start = 0; start < PRIMES.length; start += 1) {
        if (diffs.every((d, i) => PRIMES[start + i * stride] === d)) {
          const next = PRIMES[start + diffs.length * stride];
          if (next !== undefined) matches.push(next);
        }
      }
    }
    const unique = [...new Set(matches)];
    if (unique.length !== 1) throw new Error(`QL037 prime pattern is ambiguous (${unique.length}).`);
    return String(values.at(-1)! + unique[0]!);
  }

  if (qlId === "SER-QL-038") {
    if (tokens.at(-1) !== "?" || tokens.length < 5) throw new Error("QL038 malformed.");
    const values = tokens.slice(0, -1).map(parseNumber);
    for (let i = 2; i < values.length; i += 1) {
      if (values[i] !== values[i - 1]! + values[i - 2]!) throw new Error("QL038 is not Fibonacci-like.");
    }
    return String(values.at(-1)! + values.at(-2)!);
  }

  if (qlId === "SER-QL-039") {
    if (tokens.at(-1) !== "?" || tokens.length !== 5) throw new Error("QL039 malformed.");
    const values = tokens.slice(0, -1);
    if (!values.every((value) => /^\d{4}$/.test(value))) throw new Error("QL039 needs four-digit tokens.");
    for (let i = 1; i < values.length; i += 1) {
      if (rotatePrefixLeft(values[i - 1]!) !== values[i]) throw new Error("QL039 prefix rotation is inconsistent.");
    }
    return rotatePrefixLeft(values.at(-1)!);
  }

  if (qlId === "SER-QL-040") {
    if (tokens.length !== 6 || tokens.some((token) => token === "?")) throw new Error("QL040 malformed.");
    const values = tokens.map(parseNumber);
    const wrongValues = new Set<number>();
    for (let base = 1; base <= 10; base += 1) {
      for (let step = 1; step <= 2; step += 1) {
        for (const power of [2, 3] as const) {
          for (const offset of [-1, 0, 1] as const) {
            const expected = values.map((_, i) => (base + i * step) ** power + offset);
            const mismatches = values.map((value, i) => value === expected[i] ? -1 : i).filter((i) => i >= 0);
            if (mismatches.length === 1) wrongValues.add(values[mismatches[0]!]!);
          }
        }
      }
    }
    if (wrongValues.size !== 1) throw new Error(`QL040 has ${wrongValues.size} plausible wrong terms.`);
    return String([...wrongValues][0]);
  }

  if (qlId === "SER-QL-041") {
    if (tokens.length !== 8 || tokens[6] !== "?" || tokens[7] !== "?") throw new Error("QL041 malformed.");
    const a0 = parseNumber(tokens[0]!);
    const b0 = parseNumber(tokens[1]!);
    const marker = parseNumber(tokens[2]!);
    const a1 = parseNumber(tokens[3]!);
    const b1 = parseNumber(tokens[4]!);
    if (parseNumber(tokens[5]!) !== marker) throw new Error("QL041 fixed marker does not repeat.");
    const da = a1 - a0;
    const db = b1 - b0;
    if (da === 0 || db === 0 || da === db) throw new Error("QL041 needs two distinct progressing rows.");
    return `${a1 + da}, ${b1 + db}`;
  }

  if (qlId === "SER-QL-042") {
    if (tokens.at(-1) !== "?" || tokens.length !== 5) throw new Error("QL042 malformed.");
    const shown = tokens.slice(0, -1);
    if (!shown.every(digitRelationHolds)) throw new Error("QL042 displayed terms do not share the internal digit relation.");
    const matching = options.filter(digitRelationHolds);
    if (matching.length !== 1) throw new Error(`QL042 has ${matching.length} relation-preserving options.`);
    return matching[0]!;
  }

  const unreachable: never = qlId;
  throw new Error(`Unsupported QL ${unreachable}`);
}

function build029(seed: number, locale: SerCp009Locale): GeneratedSerCp009Question {
  const rng = createPrng(seed ^ 29_029);
  const direction = rng() < 0.35 ? -1 : 1;
  const d = direction * int(rng, 3, 15);
  const start = direction > 0 ? int(rng, 8, 70) : int(rng, 90, 180);
  const values = Array.from({ length: 6 }, (_, i) => start + i * d);
  const correct = values[5]!;
  const correctIndex = (seed + 29) % 4;
  const options = numericOptions(correct, values.slice(0, 5), correctIndex);
  const features = { layers: 1, channels: 1, signedDifference: d, reasoningLayers: 1 };
  return basePayload("SER-QL-029", seed, locale, "NEXT_TERM", String(correct), options,
    `${instruction(locale, "NEXT_TERM")}\n${asLine([...values.slice(0, 5), "?"])}`,
    [
      local(locale, `The difference stays ${d > 0 ? "+" : ""}${d}.`, `हर बार अंतर ${d > 0 ? "+" : ""}${d} है।`, `ਹਰ ਵਾਰ ਅੰਤਰ ${d > 0 ? "+" : ""}${d} ਹੈ।`),
      `${values[3]} → ${values[4]} → ${correct}`,
      local(locale, `So the missing number is ${correct}.`, `अतः लुप्त संख्या ${correct} है।`, `ਇਸ ਲਈ ਲੁਪਤ ਸੰਖਿਆ ${correct} ਹੈ।`),
    ], features, difficultyFromStructure(features));
}

function build030(seed: number, locale: SerCp009Locale): GeneratedSerCp009Question {
  const rng = createPrng(seed ^ 30_030);
  const mode = seed % 3;
  let d0: number;
  let second: number;
  let start: number;
  if (mode === 0) {
    d0 = int(rng, 4, 14); second = int(rng, 2, 7); start = int(rng, 8, 45);
  } else if (mode === 1) {
    d0 = -int(rng, 7, 18); second = -int(rng, 2, 8); start = int(rng, 180, 300);
  } else {
    d0 = -int(rng, 35, 65); second = int(rng, 5, 12); start = int(rng, 330, 480);
  }
  const values = [start];
  let gap = d0;
  for (let i = 1; i < 6; i += 1) { values.push(values[i - 1]! + gap); gap += second; }
  const target = seed % 2 === 0 ? 5 : 3;
  const visible = values.map((value, i) => i === target ? "?" : String(value));
  const correct = values[target]!;
  const correctIndex = (seed + 30) % 4;
  const wrong = [
    { value: String(values[target - 1]! + d0), errorLabel: "REPEATED_FIRST_DIFFERENCE" },
    { value: String(correct + second), errorLabel: "ADVANCED_SECOND_DIFFERENCE_EARLY" },
    { value: String(correct - second), errorLabel: "FAILED_TO_ADVANCE_DIFFERENCE" },
    { value: String(correct + 1), errorLabel: "ARITHMETIC_SLIP" },
  ];
  const options = placeOptions(String(correct), wrong, correctIndex);
  const features = { layers: 2, channels: 1, internalGap: target < 5, firstDifference: d0, secondDifference: second, reasoningLayers: 2 };
  const diffs = values.slice(1).map((value, i) => value - values[i]!);
  return basePayload("SER-QL-030", seed, locale, target < 5 ? "MISSING_TERM" : "NEXT_TERM", String(correct), options,
    `${instruction(locale, target < 5 ? "MISSING_TERM" : "NEXT_TERM")}\n${visible.join(", ")}`,
    [
      local(locale, `First differences: ${diffs.join(", ")}.`, `प्रथम अंतर: ${diffs.join(", ")}।`, `ਪਹਿਲੇ ਅੰਤਰ: ${diffs.join(", ")}।`),
      local(locale, `The differences themselves change by ${second > 0 ? "+" : ""}${second}.`, `अंतर स्वयं ${second > 0 ? "+" : ""}${second} से बदलते हैं।`, `ਅੰਤਰ ਆਪਣੇ ਆਪ ${second > 0 ? "+" : ""}${second} ਨਾਲ ਬਦਲਦੇ ਹਨ।`),
      local(locale, `Therefore the missing number is ${correct}.`, `इसलिए लुप्त संख्या ${correct} है।`, `ਇਸ ਲਈ ਲੁਪਤ ਸੰਖਿਆ ${correct} ਹੈ।`),
    ], features, difficultyFromStructure({ layers: 2, channels: 1, internalGap: target < 5 }));
}

function figurateValue(kind: "SQUARE" | "CUBE" | "TRIANGULAR", n: number): number {
  if (kind === "SQUARE") return n ** 2;
  if (kind === "CUBE") return n ** 3;
  return n * (n + 1) / 2;
}

function build031(seed: number, locale: SerCp009Locale): GeneratedSerCp009Question {
  const rng = createPrng(seed ^ 31_031);
  const kind = pick(rng, ["SQUARE", "CUBE", "TRIANGULAR"] as const);
  const n0 = kind === "CUBE" ? int(rng, 2, 4) : int(rng, 2, 6);
  const start = int(rng, 5, 45);
  const sign = seed % 5 === 0 ? -1 : 1;
  const values = [start];
  for (let i = 0; i < 5; i += 1) values.push(values.at(-1)! + sign * figurateValue(kind, n0 + i));
  if (Math.min(...values) <= 0) return build031(seed + 71, locale);
  const correct = values[5]!;
  const diffs = values.slice(1).map((v, i) => v - values[i]!);
  const nextDiff = sign * figurateValue(kind, n0 + 4);
  const options = placeOptions(String(correct), [
    { value: String(values[4]! + diffs[3]!), errorLabel: "REPEATED_PREVIOUS_FIGURATE_DIFFERENCE" },
    { value: String(correct + sign * (n0 + 4)), errorLabel: "USED_ROOT_INSTEAD_OF_FIGURATE_VALUE" },
    { value: String(correct - nextDiff), errorLabel: "WRONG_SIGN" },
    { value: String(correct + 1), errorLabel: "ARITHMETIC_SLIP" },
  ], (seed + 31) % 4);
  const layers = kind === "CUBE" ? 3 : 2;
  const features = { layers, channels: 1, figurateKind: kind, figurateStart: n0, reasoningLayers: layers };
  return basePayload("SER-QL-031", seed, locale, "NEXT_TERM", String(correct), options,
    `${instruction(locale, "NEXT_TERM")}\n${asLine([...values.slice(0, 5), "?"])}`,
    [
      local(locale, `Differences: ${diffs.join(", ")}.`, `अंतर: ${diffs.join(", ")}।`, `ਅੰਤਰ: ${diffs.join(", ")}।`),
      local(locale, `These are consecutive ${kind.toLowerCase()}-based values.`, `ये क्रमिक ${kind === "SQUARE" ? "वर्ग" : kind === "CUBE" ? "घन" : "त्रिभुज"} संख्याओं पर आधारित अंतर हैं।`, `ਇਹ ਲਗਾਤਾਰ ${kind === "SQUARE" ? "ਵਰਗ" : kind === "CUBE" ? "ਘਣ" : "ਤਿਕੋਣੀ"} ਸੰਖਿਆਵਾਂ 'ਤੇ ਆਧਾਰਿਤ ਅੰਤਰ ਹਨ।`),
      local(locale, `Using the next difference gives ${correct}.`, `अगला अंतर लगाने पर ${correct} मिलता है।`, `ਅਗਲਾ ਅੰਤਰ ਲਗਾਉਣ 'ਤੇ ${correct} ਮਿਲਦਾ ਹੈ।`),
    ], features, difficultyFromStructure({ layers, channels: 1 }));
}

function build032(seed: number, locale: SerCp009Locale): GeneratedSerCp009Question {
  const rng = createPrng(seed ^ 32_032);
  const factor = int(rng, 2, 5);
  const division = seed % 3 === 0;
  let values: number[];
  if (division) {
    const tail = int(rng, 2, 8);
    values = Array.from({ length: 6 }, (_, i) => tail * factor ** (5 - i));
  } else {
    const start = int(rng, 2, 9);
    values = Array.from({ length: 6 }, (_, i) => start * factor ** i);
  }
  const correct = values[5]!;
  const options = numericOptions(correct, values.slice(0, 5), (seed + 32) % 4);
  const features = { layers: 1, channels: 1, operation: division ? "DIVIDE" : "MULTIPLY", factor, reasoningLayers: 1 };
  return basePayload("SER-QL-032", seed, locale, "NEXT_TERM", String(correct), options,
    `${instruction(locale, "NEXT_TERM")}\n${asLine([...values.slice(0, 5), "?"])}`,
    [
      local(locale, `Each term is ${division ? "divided" : "multiplied"} by ${factor}.`, `हर पद को ${factor} से ${division ? "भाग" : "गुणा"} किया गया है।`, `ਹਰ ਪਦ ਨੂੰ ${factor} ਨਾਲ ${division ? "ਭਾਗ" : "ਗੁਣਾ"} ਕੀਤਾ ਗਿਆ ਹੈ।`),
      `${values[3]} → ${values[4]} → ${correct}`,
      local(locale, `So the answer is ${correct}.`, `अतः उत्तर ${correct} है।`, `ਇਸ ਲਈ ਉੱਤਰ ${correct} ਹੈ।`),
    ], features, difficultyFromStructure(features));
}

function build033(seed: number, locale: SerCp009Locale): GeneratedSerCp009Question {
  const rng = createPrng(seed ^ 33_033);
  const add = int(rng, 2, 9);
  const multiply = int(rng, 2, 4);
  const values = [int(rng, 2, 12)];
  for (let i = 1; i < 7; i += 1) values.push(i % 2 === 1 ? values[i - 1]! + add : values[i - 1]! * multiply);
  const correct = values[6]!;
  const options = placeOptions(String(correct), [
    { value: String(values[5]! + add), errorLabel: "MISSED_ALTERNATION_REPEATED_ADD" },
    { value: String(values[5]! * (multiply + 1)), errorLabel: "WRONG_MULTIPLIER" },
    { value: String(correct + add), errorLabel: "APPLIED_BOTH_OPERATIONS" },
    { value: String(correct - 1), errorLabel: "ARITHMETIC_SLIP" },
  ], (seed + 33) % 4);
  const features = { layers: 2, channels: 1, operationCycle: `+${add},×${multiply}`, operationSwitches: 5, reasoningLayers: 2 };
  return basePayload("SER-QL-033", seed, locale, "NEXT_TERM", String(correct), options,
    `${instruction(locale, "NEXT_TERM")}\n${asLine([...values.slice(0, 6), "?"])}`,
    [
      local(locale, `The operations alternate: +${add}, ×${multiply}, +${add}, ×${multiply}, ...`, `क्रियाएँ बारी-बारी से हैं: +${add}, ×${multiply}, +${add}, ×${multiply}, ...`, `ਕਿਰਿਆਵਾਂ ਵਾਰੀ-ਵਾਰੀ ਹਨ: +${add}, ×${multiply}, +${add}, ×${multiply}, ...`),
      `${values[4]} + ${add} = ${values[5]}; ${values[5]} × ${multiply} = ${correct}.`,
      local(locale, `Hence the missing number is ${correct}.`, `अतः लुप्त संख्या ${correct} है।`, `ਇਸ ਲਈ ਲੁਪਤ ਸੰਖਿਆ ${correct} ਹੈ।`),
    ], features, difficultyFromStructure(features));
}

function build034(seed: number, locale: SerCp009Locale): GeneratedSerCp009Question {
  const rng = createPrng(seed ^ 34_034);
  const a0 = int(rng, 5, 35);
  const b0 = int(rng, 45, 90);
  const da = int(rng, 3, 12);
  let db = -int(rng, 4, 13);
  if (db === da) db -= 1;
  const rowA = Array.from({ length: 4 }, (_, i) => a0 + i * da);
  const rowB = Array.from({ length: 4 }, (_, i) => b0 + i * db);
  const values: (number | string)[] = [];
  for (let i = 0; i < 4; i += 1) { values.push(rowA[i]!); values.push(i === 3 ? "?" : rowB[i]!); }
  const correct = rowB[3]!;
  const options = placeOptions(String(correct), [
    { value: String(rowB[2]! + da), errorLabel: "USED_OTHER_ROW_DIFFERENCE" },
    { value: String(rowB[2]! - db), errorLabel: "WRONG_ROW_DIRECTION" },
    { value: String(rowA[3]! + da), errorLabel: "CONTINUED_ODD_ROW" },
    { value: String(correct + 1), errorLabel: "ARITHMETIC_SLIP" },
  ], (seed + 34) % 4);
  const features = { layers: 2, channels: 2, oddRowDifference: da, evenRowDifference: db, reasoningLayers: 2 };
  return basePayload("SER-QL-034", seed, locale, "NEXT_TERM", String(correct), options,
    `${instruction(locale, "NEXT_TERM")}\n${asLine(values)}`,
    [
      local(locale, `Split the series into odd and even positions.`, `श्रृंखला को विषम और सम स्थानों में बाँटें।`, `ਲੜੀ ਨੂੰ ਬੇ-ਜੋੜ ਅਤੇ ਜੋੜ ਸਥਾਨਾਂ ਵਿੱਚ ਵੰਡੋ।`),
      `Odd: ${rowA.join(" → ")} (${da > 0 ? "+" : ""}${da}); Even: ${rowB.slice(0, 3).join(" → ")} (${db}).`,
      local(locale, `The next even-row term is ${correct}.`, `सम-स्थान वाली पंक्ति का अगला पद ${correct} है।`, `ਜੋੜ-ਸਥਾਨ ਵਾਲੀ ਕਤਾਰ ਦਾ ਅਗਲਾ ਪਦ ${correct} ਹੈ।`),
    ], features, difficultyFromStructure(features));
}

function build035(seed: number, locale: SerCp009Locale): GeneratedSerCp009Question {
  const rng = createPrng(seed ^ 35_035);
  const firstMultiplier = int(rng, 2, 3);
  const adjustment = int(rng, 1, 3) * (seed % 5 === 0 ? -1 : 1);
  const values = [int(rng, 1, 5)];
  for (let i = 1; i < 6; i += 1) values.push(values[i - 1]! * (firstMultiplier + i - 1) + adjustment);
  if (Math.min(...values) <= 0) return build035(seed + 43, locale);
  const correct = values[4]!;
  const visible = values.map((value, i) => i === 4 ? "?" : String(value));
  const options = placeOptions(String(correct), [
    { value: String(values[3]! * (firstMultiplier + 2) + adjustment), errorLabel: "REPEATED_PREVIOUS_MULTIPLIER" },
    { value: String(values[3]! * (firstMultiplier + 3)), errorLabel: "DROPPED_FIXED_ADJUSTMENT" },
    { value: String(values[3]! * (firstMultiplier + 3) - adjustment), errorLabel: "REVERSED_ADJUSTMENT" },
    { value: String(correct + 1), errorLabel: "ARITHMETIC_SLIP" },
  ], (seed + 35) % 4);
  const features = { layers: 3, channels: 1, internalGap: true, firstMultiplier, multiplierStep: 1, adjustment, reasoningLayers: 3 };
  return basePayload("SER-QL-035", seed, locale, "MISSING_TERM", String(correct), options,
    `${instruction(locale, "MISSING_TERM")}\n${visible.join(", ")}`,
    [
      local(locale, `The multipliers increase by 1 while the adjustment stays ${adjustment > 0 ? "+" : ""}${adjustment}.`, `गुणक 1-1 बढ़ते हैं और समायोजन ${adjustment > 0 ? "+" : ""}${adjustment} स्थिर रहता है।`, `ਗੁਣਕ 1-1 ਵੱਧਦੇ ਹਨ ਅਤੇ ਸੋਧ ${adjustment > 0 ? "+" : ""}${adjustment} ਇੱਕੋ ਰਹਿੰਦੀ ਹੈ।`),
      `${values[0]} × ${firstMultiplier} ${adjustment >= 0 ? "+" : "−"} ${Math.abs(adjustment)} = ${values[1]}; ...; ${values[3]} × ${firstMultiplier + 3} ${adjustment >= 0 ? "+" : "−"} ${Math.abs(adjustment)} = ${correct}.`,
      `${correct} × ${firstMultiplier + 4} ${adjustment >= 0 ? "+" : "−"} ${Math.abs(adjustment)} = ${values[5]} (${local(locale, "check", "जाँच", "ਜਾਂਚ")}).`,
    ], features, difficultyFromStructure({ layers: 3, channels: 1, internalGap: true }));
}

function build036(seed: number, locale: SerCp009Locale): GeneratedSerCp009Question {
  const rng = createPrng(seed ^ 36_036);
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const power = pick(rng, [2, 3] as const);
    const base = int(rng, 2, power === 3 ? 4 : 6);
    const step = int(rng, 1, 2);
    const offset = pick(rng, [-1, 0, 1] as const);
    const values = Array.from({ length: 6 }, (_, i) => (base + i * step) ** power + offset);
    const target = seed % 2 === 0 ? 5 : 4;
    const visible = values.map((value, i) => i === target ? "?" : String(value));
    const stem = `${instruction(locale, target === 5 ? "NEXT_TERM" : "MISSING_TERM")}\n${visible.join(", ")}`;
    let solved: string;
    try { solved = solveVisibleNumberSeries("SER-QL-036", stem); } catch { continue; }
    const correct = values[target]!;
    if (solved !== String(correct)) continue;
    const options = placeOptions(String(correct), [
      { value: String((base + target * step) ** power), errorLabel: "IGNORED_FIXED_OFFSET" },
      { value: String((base + (target - 1) * step) ** power + offset), errorLabel: "REPEATED_PREVIOUS_POWER_TERM" },
      { value: String(correct + (offset === 0 ? 2 : -offset)), errorLabel: "WRONG_OFFSET" },
      { value: String(correct + 1), errorLabel: "ARITHMETIC_SLIP" },
    ], (seed + 36) % 4);
    const layers = power === 3 ? 3 : 2;
    const features = { layers, channels: 1, internalGap: target < 5, power, baseStep: step, fixedOffset: offset, reasoningLayers: layers };
    return basePayload("SER-QL-036", seed, locale, target === 5 ? "NEXT_TERM" : "MISSING_TERM", String(correct), options, stem,
      [
        local(locale, `The terms follow a power pattern with power ${power} and fixed offset ${offset}.`, `पद घात ${power} और स्थिर समायोजन ${offset} वाले पैटर्न पर हैं।`, `ਪਦ ਘਾਤ ${power} ਅਤੇ ਸਥਿਰ ਸੋਧ ${offset} ਵਾਲੇ ਪੈਟਰਨ 'ਤੇ ਹਨ।`),
        `${values.map((v, i) => `${base + i * step}^${power}${offset === 0 ? "" : offset > 0 ? `+${offset}` : offset}=${v}`).slice(0, target + 1).join("; ")}.`,
        local(locale, `Therefore the required number is ${correct}.`, `अतः आवश्यक संख्या ${correct} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਸੰਖਿਆ ${correct} ਹੈ।`),
      ], features, difficultyFromStructure({ layers, channels: 1, internalGap: target < 5 }));
  }
  throw new Error(`SER-QL-036 could not build an unambiguous instance for seed ${seed}.`);
}

function build037(seed: number, locale: SerCp009Locale): GeneratedSerCp009Question {
  const rng = createPrng(seed ^ 37_037);
  const stride = seed % 3 === 0 ? 2 : 1;
  const startPrimeIndex = int(rng, 1, stride === 2 ? 4 : 7);
  const values = [int(rng, 8, 40)];
  const usedPrimes: number[] = [];
  for (let i = 0; i < 5; i += 1) {
    const p = PRIMES[startPrimeIndex + i * stride]!;
    usedPrimes.push(p);
    values.push(values.at(-1)! + p);
  }
  const correct = values[5]!;
  const options = placeOptions(String(correct), [
    { value: String(values[4]! + usedPrimes[3]!), errorLabel: "REPEATED_PREVIOUS_PRIME" },
    { value: String(values[4]! + usedPrimes[4]! + 2), errorLabel: "USED_NEIGHBORING_NON_PRIME" },
    { value: String(values[4]! + PRIMES[startPrimeIndex + 4]!), errorLabel: "MISSED_ALTERNATE_PRIME_STRIDE" },
    { value: String(correct - 1), errorLabel: "ARITHMETIC_SLIP" },
  ], (seed + 37) % 4);
  const layers = stride === 2 ? 3 : 2;
  const features = { layers, channels: 1, primeStride: stride, reasoningLayers: layers };
  return basePayload("SER-QL-037", seed, locale, "NEXT_TERM", String(correct), options,
    `${instruction(locale, "NEXT_TERM")}\n${asLine([...values.slice(0, 5), "?"])}`,
    [
      local(locale, `Successive differences are prime numbers: ${usedPrimes.slice(0, 4).join(", ")}.`, `क्रमिक अंतर अभाज्य संख्याएँ हैं: ${usedPrimes.slice(0, 4).join(", ")}।`, `ਲਗਾਤਾਰ ਅੰਤਰ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਹਨ: ${usedPrimes.slice(0, 4).join(", ")}।`),
      local(locale, `The prime stride is ${stride === 1 ? "consecutive primes" : "every second prime"}.`, `यह ${stride === 1 ? "क्रमिक अभाज्य" : "एक-एक अभाज्य छोड़कर"} चलता है।`, `ਇਹ ${stride === 1 ? "ਲਗਾਤਾਰ ਅਭਾਜ" : "ਇੱਕ-ਇੱਕ ਅਭਾਜ ਛੱਡ ਕੇ"} ਚੱਲਦਾ ਹੈ।`),
      `${values[4]} + ${usedPrimes[4]} = ${correct}.`,
    ], features, difficultyFromStructure(features));
}

function build038(seed: number, locale: SerCp009Locale): GeneratedSerCp009Question {
  const rng = createPrng(seed ^ 38_038);
  const values = [int(rng, 1, 8), int(rng, 2, 11)];
  if (values[0] === values[1]) values[1]! += 1;
  while (values.length < 7) values.push(values.at(-1)! + values.at(-2)!);
  const correct = values[6]!;
  const options = placeOptions(String(correct), [
    { value: String(values[5]! + values[3]!), errorLabel: "ADDED_WRONG_PREVIOUS_TERM" },
    { value: String(values[5]! * 2), errorLabel: "DOUBLED_LAST_TERM" },
    { value: String(values[5]! + values[4]! + 1), errorLabel: "ARITHMETIC_SLIP" },
    { value: String(values[5]! + values[4]! - 1), errorLabel: "ARITHMETIC_SLIP_MINUS_ONE" },
  ], (seed + 38) % 4);
  const features = { layers: 2, channels: 1, recurrenceOrder: 2, reasoningLayers: 2 };
  return basePayload("SER-QL-038", seed, locale, "NEXT_TERM", String(correct), options,
    `${instruction(locale, "NEXT_TERM")}\n${asLine([...values.slice(0, 6), "?"])}`,
    [
      local(locale, "Each term is the sum of the previous two terms.", "हर पद पिछली दो संख्याओं का योग है।", "ਹਰ ਪਦ ਪਿਛਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਦਾ ਜੋੜ ਹੈ।"),
      `${values[3]} + ${values[4]} = ${values[5]}; ${values[4]} + ${values[5]} = ${correct}.`,
      local(locale, `So the next number is ${correct}.`, `अतः अगली संख्या ${correct} है।`, `ਇਸ ਲਈ ਅਗਲੀ ਸੰਖਿਆ ${correct} ਹੈ।`),
    ], features, difficultyFromStructure(features));
}

function build039(seed: number, locale: SerCp009Locale): GeneratedSerCp009Question {
  const rng = createPrng(seed ^ 39_039);
  const digits: string[] = [];
  while (digits.length < 4) {
    const d = String(int(rng, digits.length === 0 ? 1 : 0, 9));
    if (!digits.includes(d)) digits.push(d);
  }
  let token = digits.join("");
  const values = [token];
  for (let i = 0; i < 3; i += 1) { token = rotatePrefixLeft(token); values.push(token); }
  const correct = rotatePrefixLeft(values.at(-1)!);
  const wrong = [
    { value: `${values.at(-1)![2]}${values.at(-1)![0]}${values.at(-1)![1]}${values.at(-1)![3]}`, errorLabel: "ROTATED_PREFIX_WRONG_DIRECTION" },
    { value: `${correct[1]}${correct[0]}${correct[2]}${correct[3]}`, errorLabel: "SWAPPED_FIRST_TWO_DIGITS" },
    { value: `${correct.slice(0, 3)}${values[0]![0]}`, errorLabel: "MOVED_FIXED_LAST_DIGIT" },
    { value: String(Number(correct) + 1), errorLabel: "TREATED_AS_ARITHMETIC_SERIES" },
  ];
  const options = placeOptions(correct, wrong, (seed + 39) % 4);
  const features = { layers: 2, channels: 2, digitBlockLength: 3, fixedDigitCount: 1, reasoningLayers: 2 };
  return basePayload("SER-QL-039", seed, locale, "NEXT_TERM", correct, options,
    `${instruction(locale, "NEXT_TERM")}\n${asLine([...values, "?"])}`,
    [
      local(locale, "The last digit stays fixed; the first three digits rotate one place to the left.", "अंतिम अंक स्थिर रहता है; पहले तीन अंक एक स्थान बाईं ओर घूमते हैं।", "ਆਖਰੀ ਅੰਕ ਇੱਕੋ ਰਹਿੰਦਾ ਹੈ; ਪਹਿਲੇ ਤਿੰਨ ਅੰਕ ਇੱਕ ਥਾਂ ਖੱਬੇ ਘੁੰਮਦੇ ਹਨ।"),
      `${values.join(" → ")} → ${correct}.`,
      local(locale, `Hence the next term is ${correct}.`, `अतः अगला पद ${correct} है।`, `ਇਸ ਲਈ ਅਗਲਾ ਪਦ ${correct} ਹੈ।`),
    ], features, difficultyFromStructure(features));
}

function build040(seed: number, locale: SerCp009Locale): GeneratedSerCp009Question {
  const rng = createPrng(seed ^ 40_040);
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const power = pick(rng, [2, 3] as const);
    const base = int(rng, 1, power === 3 ? 4 : 6);
    const step = int(rng, 1, 2);
    const offset = pick(rng, [-1, 0, 1] as const);
    const clean = Array.from({ length: 6 }, (_, i) => (base + i * step) ** power + offset);
    const wrongIndex = 2 + (seed + attempt) % 3;
    const shown = [...clean];
    const corruption = int(rng, 2, 7) * (rng() < 0.5 ? -1 : 1);
    shown[wrongIndex]! += corruption;
    const stem = `${instruction(locale, "WRONG_TERM")}\n${shown.join(", ")}`;
    let solved: string;
    try { solved = solveVisibleNumberSeries("SER-QL-040", stem); } catch { continue; }
    const correct = String(shown[wrongIndex]!);
    if (solved !== correct) continue;
    const distractorValues = shown.filter((_, i) => i !== wrongIndex).slice(0, 5).map((value, i) => ({ value: String(value), errorLabel: `CHECKED_CORRECT_TERM_${i + 1}` }));
    const options = placeOptions(correct, distractorValues, (seed + 40) % 4);
    const features = { layers: power === 3 ? 3 : 2, channels: 1, diagnostic: true, power, fixedOffset: offset, wrongPosition: wrongIndex + 1, reasoningLayers: power === 3 ? 3 : 2 };
    return basePayload("SER-QL-040", seed, locale, "WRONG_TERM", correct, options, stem,
      [
        local(locale, `The intended terms follow power ${power} with fixed offset ${offset}.`, `सही पैटर्न घात ${power} और स्थिर समायोजन ${offset} का है।`, `ਸਹੀ ਪੈਟਰਨ ਘਾਤ ${power} ਅਤੇ ਸਥਿਰ ਸੋਧ ${offset} ਦਾ ਹੈ।`),
        `${clean.map((value, i) => `${(base + i * step)}^${power}${offset === 0 ? "" : offset > 0 ? `+${offset}` : offset}=${value}`).join("; ")}.`,
        local(locale, `${correct} is the only displayed term that breaks this pattern.`, `${correct} ही एकमात्र प्रदर्शित पद है जो इस पैटर्न को तोड़ता है।`, `${correct} ਹੀ ਇਕੱਲਾ ਦਿੱਤਾ ਪਦ ਹੈ ਜੋ ਇਸ ਪੈਟਰਨ ਨੂੰ ਤੋੜਦਾ ਹੈ।`),
      ], features, difficultyFromStructure({ layers: power === 3 ? 3 : 2, channels: 1, diagnostic: true }));
  }
  throw new Error(`SER-QL-040 could not build an unambiguous wrong-term instance for seed ${seed}.`);
}

function build041(seed: number, locale: SerCp009Locale): GeneratedSerCp009Question {
  const rng = createPrng(seed ^ 41_041);
  const a0 = int(rng, 2, 15);
  const b0 = int(rng, 3, 18);
  const da = int(rng, 4, 11);
  let db = int(rng, 2, 9);
  if (db === da) db += 1;
  const marker = int(rng, 25, 60);
  const a1 = a0 + da;
  const b1 = b0 + db;
  const correctA = a1 + da;
  const correctB = b1 + db;
  const correct = `${correctA}, ${correctB}`;
  const visible = [a0, b0, marker, a1, b1, marker, "?", "?"];
  const options = placeOptions(correct, [
    { value: `${correctB}, ${correctA}`, errorLabel: "REVERSED_ROW_ORDER" },
    { value: `${a1 + db}, ${b1 + da}`, errorLabel: "SWAPPED_ROW_DIFFERENCES" },
    { value: `${correctA}, ${marker}`, errorLabel: "INSERTED_FIXED_MARKER_TOO_EARLY" },
    { value: `${correctA + 1}, ${correctB + 1}`, errorLabel: "ARITHMETIC_SLIP" },
  ], (seed + 41) % 4);
  const features = { layers: 2, channels: 3, internalGap: true, fixedMarker: marker, rowADifference: da, rowBDifference: db, reasoningLayers: 2 };
  return basePayload("SER-QL-041", seed, locale, "MULTI_MISSING", correct, options,
    `${instruction(locale, "MULTI_MISSING")}\n${asLine(visible)}`,
    [
      local(locale, "Read the terms in repeating groups of three.", "पदों को तीन-तीन के दोहराते समूहों में पढ़ें।", "ਪਦਾਂ ਨੂੰ ਤਿੰਨ-ਤਿੰਨ ਦੇ ਦੁਹਰਾਉਂਦੇ ਸਮੂਹਾਂ ਵਿੱਚ ਪੜ੍ਹੋ।"),
      `Row 1: ${a0} → ${a1} → ${correctA} (+${da}); Row 2: ${b0} → ${b1} → ${correctB} (+${db}); marker: ${marker}.`,
      local(locale, `So the two blanks are ${correct}.`, `अतः दोनों रिक्त स्थान ${correct} हैं।`, `ਇਸ ਲਈ ਦੋਵੇਂ ਖਾਲੀ ਥਾਵਾਂ ${correct} ਹਨ।`),
    ], features, difficultyFromStructure({ layers: 2, channels: 3, internalGap: true }));
}

function validRelationNumber(first: number, third: number): string {
  const middle = first + third;
  if (middle > 9) throw new Error("Digit-relation sum must fit one digit.");
  return `${first}${middle}${third}`;
}

function build042(seed: number, locale: SerCp009Locale): GeneratedSerCp009Question {
  const rng = createPrng(seed ^ 42_042);
  const shown: string[] = [];
  while (shown.length < 4) {
    const first = int(rng, 1, 5);
    const third = int(rng, 1, 4);
    if (first + third > 9) continue;
    const value = validRelationNumber(first, third);
    if (!shown.includes(value)) shown.push(value);
  }
  let correct = "";
  while (!correct || shown.includes(correct)) {
    const first = int(rng, 1, 5);
    const third = int(rng, 1, 4);
    if (first + third <= 9) correct = validRelationNumber(first, third);
  }
  const wrong: { value: string; errorLabel: string }[] = [];
  const correctDigits = correct.split("").map(Number);
  for (const delta of [1, -1, 2, -2]) {
    const middle = correctDigits[1]! + delta;
    if (middle >= 0 && middle <= 9) wrong.push({ value: `${correctDigits[0]}${middle}${correctDigits[2]}`, errorLabel: "BROKE_MIDDLE_EQUALS_OUTER_SUM" });
  }
  const options = placeOptions(correct, wrong, (seed + 42) % 4);
  const features = { layers: 1, channels: 3, optionConstrained: true, relation: "MIDDLE_DIGIT_EQUALS_OUTER_DIGIT_SUM", reasoningLayers: 1 };
  return basePayload("SER-QL-042", seed, locale, "OPTION_RELATION", correct, options,
    `${instruction(locale, "OPTION_RELATION")}\n${shown.join(", ")}, ?`,
    [
      local(locale, "In every shown number, the middle digit equals the sum of the first and third digits.", "हर दी गई संख्या में बीच का अंक पहले और तीसरे अंक के योग के बराबर है।", "ਹਰ ਦਿੱਤੀ ਸੰਖਿਆ ਵਿੱਚ ਵਿਚਕਾਰਲਾ ਅੰਕ ਪਹਿਲੇ ਅਤੇ ਤੀਜੇ ਅੰਕ ਦੇ ਜੋੜ ਦੇ ਬਰਾਬਰ ਹੈ।"),
      shown.map((value) => `${value[0]} + ${value[2]} = ${value[1]}`).join("; "),
      local(locale, `${correct} is the only option with the same relation.`, `${correct} ही एकमात्र विकल्प है जिसमें वही संबंध है।`, `${correct} ਹੀ ਇਕੱਲਾ ਵਿਕਲਪ ਹੈ ਜਿਸ ਵਿੱਚ ਉਹੀ ਸੰਬੰਧ ਹੈ।`),
    ], features, difficultyFromStructure({ layers: 1, channels: 3 }));
}

export function generateSerCp009NumberSeries(
  qlId: SerCp009QlId,
  seed = 1,
  locale: SerCp009Locale = "en-IN",
): GeneratedSerCp009Question {
  switch (qlId) {
    case "SER-QL-029": return build029(seed, locale);
    case "SER-QL-030": return build030(seed, locale);
    case "SER-QL-031": return build031(seed, locale);
    case "SER-QL-032": return build032(seed, locale);
    case "SER-QL-033": return build033(seed, locale);
    case "SER-QL-034": return build034(seed, locale);
    case "SER-QL-035": return build035(seed, locale);
    case "SER-QL-036": return build036(seed, locale);
    case "SER-QL-037": return build037(seed, locale);
    case "SER-QL-038": return build038(seed, locale);
    case "SER-QL-039": return build039(seed, locale);
    case "SER-QL-040": return build040(seed, locale);
    case "SER-QL-041": return build041(seed, locale);
    case "SER-QL-042": return build042(seed, locale);
  }
}
