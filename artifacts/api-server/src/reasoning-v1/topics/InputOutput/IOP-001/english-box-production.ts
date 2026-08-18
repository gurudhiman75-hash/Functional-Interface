import type {
  IopEnglishChildQuestion,
  IopEnglishOption,
  IopEnglishProductionCaselet,
  IopEnglishTrace,
} from "./english-production-types.ts";

interface BoxInput { readonly a: number; readonly b: number }
type Pairing = "SYMMETRIC" | "ADJACENT";
type ProductPattern = "CROSS" | "STRAIGHT";
type Combine = "Q_PLUS_TENS_MINUS_ONES" | "Q_PLUS_TENS_PLUS_ONES" | "Q_PLUS_ONES_MINUS_TENS";
type Quotient = "NEXT_OVER_CURRENT" | "CURRENT_OVER_NEXT";
type Final = "ABS_DIFF" | "SUM";
interface BoxRule {
  readonly pairing: Pairing;
  readonly productPattern: ProductPattern;
  readonly combine: Combine;
  readonly quotient: Quotient;
  readonly final: Final;
}

const RULE: BoxRule = {
  pairing: "SYMMETRIC",
  productPattern: "CROSS",
  combine: "Q_PLUS_TENS_MINUS_ONES",
  quotient: "NEXT_OVER_CURRENT",
  final: "ABS_DIFF",
};

const RULE_EXPLANATION = "The six input boxes are paired symmetrically (1 with 4, 2 with 5, 3 with 6). Step 1 forms the two cross-products for each pair. In Step 2, add the one-digit cross-product to the tens digit of the two-digit cross-product and subtract its units digit. Step 3 divides the next Step-2 value by the current one for adjacent pairs. Step 4 is the absolute difference of the two quotients.";

function hashSeed(seed: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash || 0x9e3779b9;
}

function makeRng(seed: string): () => number {
  let state = hashSeed(seed);
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0x100000000;
  };
}

function shuffle<T>(values: readonly T[], rng: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(rng() * (index + 1));
    [result[index], result[other]] = [result[other]!, result[index]!];
  }
  return result;
}

function pairs(pairing: Pairing): readonly (readonly [number, number])[] {
  return pairing === "SYMMETRIC" ? [[0, 3], [1, 4], [2, 5]] : [[0, 1], [2, 3], [4, 5]];
}

function products(left: BoxInput, right: BoxInput, pattern: ProductPattern): readonly [number, number] {
  return pattern === "CROSS" ? [left.a * right.b, left.b * right.a] : [left.a * right.a, left.b * right.b];
}

function combine(p: number, q: number, rule: Combine): number {
  const tens = Math.floor(Math.abs(p) / 10) % 10;
  const ones = Math.abs(p) % 10;
  if (rule === "Q_PLUS_TENS_PLUS_ONES") return q + tens + ones;
  if (rule === "Q_PLUS_ONES_MINUS_TENS") return q + ones - tens;
  return q + tens - ones;
}

function fixed2(value: number): string {
  return (Math.round(value * 100) / 100).toFixed(2);
}

function traceFingerprint(trace: IopEnglishTrace): string {
  return [trace.input, ...trace.steps].map((row) => row.join("\u241f")).join("\u241e");
}

function execute(rule: BoxRule, input: readonly BoxInput[]): IopEnglishTrace {
  const step1 = pairs(rule.pairing).map(([i, j]) => products(input[i]!, input[j]!, rule.productPattern));
  const step2 = step1.map(([p, q]) => combine(p, q, rule.combine));
  if (step2.some((value) => value === 0)) throw new Error("Box rule produced a zero divisor");
  const ratios = [0, 1].map((index) => rule.quotient === "NEXT_OVER_CURRENT"
    ? step2[index + 1]! / step2[index]!
    : step2[index]! / step2[index + 1]!);
  const finalValue = rule.final === "ABS_DIFF" ? Math.abs(ratios[0]! - ratios[1]!) : ratios[0]! + ratios[1]!;
  return {
    input: input.map((box, index) => `B${index + 1}[${box.a},${box.b}]`),
    steps: [
      step1.map(([p, q], index) => `G${index + 1}(${p},${q})`),
      step2.map(String),
      ratios.map(fixed2),
      [fixed2(finalValue)],
    ],
  };
}

function oracle(rule: BoxRule, input: readonly BoxInput[]): IopEnglishTrace {
  const indexPairs = rule.pairing === "SYMMETRIC" ? [[0, 3], [1, 4], [2, 5]] as const : [[0, 1], [2, 3], [4, 5]] as const;
  const one: [number, number][] = [];
  for (const [i, j] of indexPairs) {
    const l = input[i]!;
    const r = input[j]!;
    one.push(rule.productPattern === "CROSS" ? [l.a * r.b, l.b * r.a] : [l.a * r.a, l.b * r.b]);
  }
  const two = one.map(([p, q]) => {
    const tens = Math.trunc(p / 10) % 10;
    const units = p % 10;
    if (rule.combine === "Q_PLUS_TENS_PLUS_ONES") return q + tens + units;
    if (rule.combine === "Q_PLUS_ONES_MINUS_TENS") return q + units - tens;
    return q + tens - units;
  });
  if (two.some((value) => value === 0)) throw new Error("Box oracle produced a zero divisor");
  const r1 = rule.quotient === "NEXT_OVER_CURRENT" ? two[1]! / two[0]! : two[0]! / two[1]!;
  const r2 = rule.quotient === "NEXT_OVER_CURRENT" ? two[2]! / two[1]! : two[1]! / two[2]!;
  const last = rule.final === "ABS_DIFF" ? Math.abs(r1 - r2) : r1 + r2;
  return {
    input: input.map((box, index) => `B${index + 1}[${box.a},${box.b}]`),
    steps: [
      one.map(([p, q], index) => `G${index + 1}(${p},${q})`),
      two.map(String),
      [fixed2(r1), fixed2(r2)],
      [fixed2(last)],
    ],
  };
}

interface ValidGroup {
  readonly left: BoxInput;
  readonly right: BoxInput;
  readonly step2: number;
}

function validGroups(): readonly ValidGroup[] {
  const result: ValidGroup[] = [];
  for (let a = 1; a <= 9; a += 1) for (let b = 1; b <= 9; b += 1) {
    for (let c = 1; c <= 9; c += 1) for (let d = 1; d <= 9; d += 1) {
      const p = a * d;
      const q = b * c;
      if (p < 10 || p > 99 || q < 1 || q > 9) continue;
      const value = combine(p, q, "Q_PLUS_TENS_MINUS_ONES");
      if (value <= 0) continue;
      result.push({ left: { a, b }, right: { a: c, b: d }, step2: value });
    }
  }
  return result;
}

const VALID_GROUPS = validGroups();

function boxKey(box: BoxInput): string { return `${box.a},${box.b}`; }

function createSourceShapedInput(seed: string): readonly BoxInput[] {
  const candidates = shuffle(VALID_GROUPS, makeRng(seed));
  const chosen: ValidGroup[] = [];
  const usedStep2 = new Set<number>();
  const usedBoxes = new Set<string>();
  for (const candidate of candidates) {
    if (usedStep2.has(candidate.step2)) continue;
    if (usedBoxes.has(boxKey(candidate.left)) || usedBoxes.has(boxKey(candidate.right))) continue;
    chosen.push(candidate);
    usedStep2.add(candidate.step2);
    usedBoxes.add(boxKey(candidate.left));
    usedBoxes.add(boxKey(candidate.right));
    if (chosen.length === 3) break;
  }
  if (chosen.length !== 3) throw new Error(`Unable to construct three source-shaped box groups for ${seed}`);
  return [...chosen.map((group) => group.left), ...chosen.map((group) => group.right)];
}

function competingRules(): readonly BoxRule[] {
  const result: BoxRule[] = [];
  for (const pairing of ["SYMMETRIC", "ADJACENT"] as const)
    for (const productPattern of ["CROSS", "STRAIGHT"] as const)
      for (const combineRule of ["Q_PLUS_TENS_MINUS_ONES", "Q_PLUS_TENS_PLUS_ONES", "Q_PLUS_ONES_MINUS_TENS"] as const)
        for (const quotient of ["NEXT_OVER_CURRENT", "CURRENT_OVER_NEXT"] as const)
          for (const final of ["ABS_DIFF", "SUM"] as const)
            result.push({ pairing, productPattern, combine: combineRule, quotient, final });
  return result;
}

function ruleFingerprint(rule: BoxRule): string {
  return [rule.pairing, rule.productPattern, rule.combine, rule.quotient, rule.final].join(":");
}

function identifiable(trace: IopEnglishTrace, input: readonly BoxInput[]): boolean {
  const expected = traceFingerprint(trace);
  const matches = new Set<string>();
  for (const candidate of competingRules()) {
    try {
      if (traceFingerprint(execute(candidate, input)) === expected) matches.add(ruleFingerprint(candidate));
    } catch {
      // Invalid alternative cannot explain the illustration.
    }
  }
  return matches.size === 1 && matches.has(ruleFingerprint(RULE));
}

function safeTrace(seed: string, requireIdentifiable: boolean): IopEnglishTrace {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const input = createSourceShapedInput(`${seed}|${attempt}`);
    const actual = execute(RULE, input);
    if (traceFingerprint(actual) !== traceFingerprint(oracle(RULE, input))) throw new Error(`Box executor/oracle mismatch for ${seed}`);
    if (new Set([actual.input, ...actual.steps].map((row) => row.join("\u241f"))).size !== actual.steps.length + 1) continue;
    if (!requireIdentifiable || identifiable(actual, input)) return actual;
  }
  throw new Error(`Unable to construct an identifiable box trace for ${seed}`);
}

function option(display: string, fingerprint: string, correct: boolean, misconception: string): IopEnglishOption {
  return { display, semanticFingerprint: fingerprint, isCorrect: correct, misconception };
}

function rowText(row: readonly string[]): string { return row.join("  "); }

function rowOptions(correct: readonly string[], alternatives: readonly (readonly string[])[], seed: string): IopEnglishChildQuestion["options"] {
  const fp = correct.join("\u241f");
  const wrong: IopEnglishOption[] = [];
  for (const row of alternatives) {
    const candidateFp = row.join("\u241f");
    if (candidateFp !== fp && !wrong.some((entry) => entry.semanticFingerprint === `ROW:${candidateFp}`)) {
      wrong.push(option(rowText(row), `ROW:${candidateFp}`, false, "wrong-stage-state"));
    }
  }
  if (correct.length === 1) {
    const value = Number(correct[0]);
    for (const delta of [1, -1, 2, -2]) wrong.push(option(fixed2(value + delta), `NUM:${fixed2(value + delta)}`, false, "arithmetic-slip"));
  } else {
    const reversed = [...correct].reverse();
    wrong.push(option(rowText(reversed), `ROW:${reversed.join("\u241f")}`, false, "reversed-order"));
    const rotated = [...correct.slice(1), correct[0]!];
    wrong.push(option(rowText(rotated), `ROW:${rotated.join("\u241f")}`, false, "shifted-order"));
  }
  const uniqueWrong = [...new Map(wrong.map((entry) => [entry.semanticFingerprint, entry])).values()].slice(0, 3);
  if (uniqueWrong.length < 3) throw new Error(`Insufficient box distractors for ${seed}`);
  const values = shuffle([option(rowText(correct), `ROW:${fp}`, true, "correct"), ...uniqueWrong], makeRng(seed));
  return [values[0]!, values[1]!, values[2]!, values[3]!];
}

function child(
  questionOrder: 1 | 2 | 3 | 4,
  kind: IopEnglishChildQuestion["kind"],
  evidence: IopEnglishChildQuestion["evidence"],
  text: string,
  options: IopEnglishChildQuestion["options"],
  answerDisplay: string,
  explanation: string,
): IopEnglishChildQuestion {
  const answerIndex = options.findIndex((entry) => entry.isCorrect) as 0 | 1 | 2 | 3;
  return { questionOrder, kind, evidence, text, options, answerIndex, answerDisplay, explanation };
}

export function generateIopEnglishBoxProductionCaselet(seed: string): IopEnglishProductionCaselet {
  const demonstration = safeTrace(`${seed}|DEMO`, true);
  const target = safeTrace(`${seed}|TARGET`, false);
  const finalRow = target.steps[3]!;
  const step2 = target.steps[1]!;
  const step1 = target.steps[0]!;
  const step3 = target.steps[2]!;

  const q1Options = rowOptions(finalRow, [step1, step2, step3], `${seed}|Q1`);
  const q2Options = rowOptions(step2, [step1, step3, finalRow], `${seed}|Q2`);
  const q3Options = rowOptions(step2, [step1, step3, finalRow], `${seed}|Q3`);
  const countOptions = shuffle([
    option("3 steps", "COUNT:3", true, "correct"),
    option("2 steps", "COUNT:2", false, "off-by-one"),
    option("1 step", "COUNT:1", false, "premature-final"),
    option("4 steps", "COUNT:4", false, "counts-current-step"),
  ], makeRng(`${seed}|Q4`)) as IopEnglishOption[];
  const q4Options = [countOptions[0]!, countOptions[1]!, countOptions[2]!, countOptions[3]!] as IopEnglishChildQuestion["options"];

  const children: IopEnglishProductionCaselet["children"] = [
    child(1, "FINAL_OUTPUT", { kind: "FINAL_OUTPUT" }, "Which of the following is the final output for the new boxes?", q1Options, rowText(finalRow), `${RULE_EXPLANATION} The final value is ${rowText(finalRow)}.`),
    child(2, "PREVIOUS_STEP", { kind: "PREVIOUS_STEP", currentStepNumber: 3 }, `The machine is at ${rowText(step3)} in Step 3. Which of the following was Step 2?`, q2Options, rowText(step2), `${RULE_EXPLANATION} One stage earlier, Step 2 is ${rowText(step2)}.`),
    child(3, "MISSING_STEP", { kind: "MISSING_STEP", missingStepNumber: 2 }, `Step 1 is ${rowText(step1)} and Step 3 is ${rowText(step3)}. Which arrangement is the missing Step 2?`, q3Options, rowText(step2), `${RULE_EXPLANATION} Applying the Step-2 digit rule to Step 1 gives ${rowText(step2)}.`),
    child(4, "REMAINING_STEP_COUNT", { kind: "REMAINING_STEP_COUNT", stepNumber: 1 }, "After Step 1, how many more steps are required to reach the final output?", q4Options, "3 steps", `${RULE_EXPLANATION} The final state is Step 4, so after Step 1 the answer is 3 steps.`),
  ];

  return {
    caseletId: `IOP-001-EN-IOP-QL-008-${hashSeed(seed).toString(16).padStart(8, "0")}`,
    packageId: "IOP-001",
    chapterId: "REAS-INP",
    qlId: "IOP-QL-008",
    sourceModeId: "QL008_BOX_CROSS_MULTIPLY_COMBINE_DIVIDE_DIFFERENCE",
    seed,
    locale: "en-IN",
    examProfile: "BANKING",
    difficulty: "Hard",
    directions: "An input-output machine performs a fixed sequence of operations on six numbered boxes. Study the complete illustration carefully and apply the same sequence to the new boxes.",
    demonstration,
    target,
    ruleExplanation: RULE_EXPLANATION,
    sourceEvidenceIds: ["AFFAIRSCLOUD_MACHINE_INPUT_OUTPUT_SET37"],
    safeguards: { sourceWhitelisted: true, ruleIdentifiable: true, oracleParity: true, queryOracleParity: true },
    children,
    lifecycle: {
      maturity: "ENGLISH_REVIEW_CANDIDATE",
      permanentQlCount: 8,
      englishFreeze: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      hindiPunjabiStatus: "NOT_STARTED",
    },
  };
}
