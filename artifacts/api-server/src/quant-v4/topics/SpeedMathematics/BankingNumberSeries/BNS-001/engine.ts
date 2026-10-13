import { ADVANCED_PATTERNS } from "./advanced-verifier";
import { generateAdvancedBns, BNS_MAINS_PATTERNS } from "./advanced-engine";
import { localizeBns001 } from "./localization";
import { independentGrammarMatches, independentWrongTermRepairs } from "./independent-verifier";
import type {
  Bns001Difficulty,
  Bns001Language,
  Bns001Option,
  Bns001PatternKind,
  Bns001Question,
  Bns001TaskKind,
} from "./types";

const PATTERNS: readonly Bns001PatternKind[] = [
  "ARITHMETIC_DIFFERENCE",
  "PROGRESSIVE_DIFFERENCE",
  "GEOMETRIC_MULTIPLICATION",
  "MULTIPLY_AND_ADD",
  "INTERLEAVED_ARITHMETIC",
];

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: string): () => number {
  let state = hashSeed(seed) || 0x9e3779b9;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(random: () => number, values: readonly T[]): T {
  return values[Math.floor(random() * values.length)]!;
}

function shuffle<T>(random: () => number, values: readonly T[]): T[] {
  const output = [...values];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [output[index], output[target]] = [output[target]!, output[index]!];
  }
  return output;
}

function differences(series: readonly number[]): number[] {
  return series.slice(1).map((value, index) => value - series[index]!);
}

function allEqual(values: readonly number[]): boolean {
  return values.length > 0 && values.every((value) => value === values[0]);
}

function matchesPattern(pattern: Bns001PatternKind, series: readonly number[]): boolean {
  if (series.length < 6 || series.some((value) => !Number.isSafeInteger(value) || value <= 0)) return false;

  if (pattern === "ARITHMETIC_DIFFERENCE") {
    return allEqual(differences(series));
  }

  if (pattern === "PROGRESSIVE_DIFFERENCE") {
    const first = differences(series);
    const second = differences(first);
    return first.length >= 4 && allEqual(second) && second[0] !== 0;
  }

  if (pattern === "GEOMETRIC_MULTIPLICATION") {
    for (const multiplier of [2, 3, 4]) {
      if (series.slice(1).every((value, index) => value === series[index]! * multiplier)) return true;
    }
    return false;
  }

  if (pattern === "MULTIPLY_AND_ADD") {
    for (const multiplier of [2, 3, 4]) {
      const addend = series[1]! - series[0]! * multiplier;
      if (addend === 0) continue;
      if (series.slice(1).every((value, index) => value === series[index]! * multiplier + addend)) return true;
    }
    return false;
  }

  const even = series.filter((_value, index) => index % 2 === 0);
  const odd = series.filter((_value, index) => index % 2 === 1);
  if (even.length < 3 || odd.length < 3) return false;
  const evenDiff = differences(even);
  const oddDiff = differences(odd);
  return allEqual(evenDiff) && allEqual(oddDiff) && evenDiff[0] !== oddDiff[0];
}

export function supportedGrammarMatches(series: readonly number[]): Bns001PatternKind[] {
  return PATTERNS.filter((pattern) => matchesPattern(pattern, series));
}

type PatternState = Readonly<{
  patternKind: Bns001PatternKind;
  difficulty: Bns001Difficulty;
  series: readonly number[];
  keyRule: string;
  working: readonly string[];
  nextDistractors: readonly Readonly<{ value: number; id: string; derivation: string }>[];
}>;

function buildPatternState(seed: string, patternKind: Bns001PatternKind, attempt: number): PatternState {
  const random = seededRandom(`${seed}:${patternKind}:${attempt}`);

  if (patternKind === "ARITHMETIC_DIFFERENCE") {
    const start = pick(random, [18, 24, 31, 37, 42, 55]);
    const diff = pick(random, [4, 6, 7, 9, 11, 13]);
    const series = Array.from({ length: 7 }, (_unused, index) => start + index * diff);
    const last = series[5]!;
    return {
      patternKind,
      difficulty: "Easy",
      series,
      keyRule: `Each term increases by ${diff}.`,
      working: [`Common difference = ${series[1]} - ${series[0]} = ${diff}.`, `${last} + ${diff} = ${series[6]}.`],
      nextDistractors: [
        { value: last + 2 * diff, id: "DOUBLE_COMMON_DIFFERENCE", derivation: `Adds twice the common difference (${2 * diff}) to the last visible term.` },
        { value: last - diff, id: "SUBTRACT_COMMON_DIFFERENCE", derivation: `Moves backward by ${diff} instead of continuing forward.` },
        { value: last + diff + 1, id: "OFF_BY_ONE_DIFFERENCE_HIGH", derivation: `Treats the common difference as ${diff + 1}.` },
        { value: last + diff - 1, id: "OFF_BY_ONE_DIFFERENCE_LOW", derivation: `Treats the common difference as ${diff - 1}.` },
        { value: last + series[4]!, id: "ADD_PREVIOUS_TERM", derivation: "Adds the previous term instead of the common difference." },
      ],
    };
  }

  if (patternKind === "PROGRESSIVE_DIFFERENCE") {
    const start = pick(random, [9, 14, 20, 27, 35, 38, 49]);
    const firstDiff = pick(random, [3, 4, 5, 6, 7, 21, 22]);
    const step = pick(random, [1, 2, 3, 4, 7]);
    const series = [start];
    for (let transition = 0; transition < 6; transition += 1) {
      series.push(series[series.length - 1]! + firstDiff + transition * step);
    }
    const diffs = differences(series);
    const last = series[5]!;
    const previousDiff = diffs[4]!;
    const nextDiff = diffs[5]!;
    return {
      patternKind,
      difficulty: "Medium",
      series,
      keyRule: `The differences form an arithmetic progression, increasing by ${step}.`,
      working: [`Differences: ${diffs.slice(0, 5).join(", ")}.`, `Next difference = ${previousDiff} + ${step} = ${nextDiff}.`, `${last} + ${nextDiff} = ${series[6]}.`],
      nextDistractors: [
        { value: last + previousDiff, id: "REPEAT_PREVIOUS_DIFFERENCE", derivation: `Repeats the previous difference ${previousDiff} instead of increasing it by ${step}.` },
        { value: last + previousDiff + 2 * step, id: "DOUBLE_DIFFERENCE_STEP", derivation: `Advances the difference by ${2 * step} instead of ${step}.` },
        { value: last + firstDiff, id: "RESTART_DIFFERENCE_SEQUENCE", derivation: `Restarts the difference pattern at ${firstDiff}.` },
        { value: last + step, id: "ADD_SECOND_DIFFERENCE_ONLY", derivation: `Adds only the second-difference step ${step} to the term.` },
        { value: last + previousDiff - step, id: "REVERSE_DIFFERENCE_PROGRESS", derivation: `Moves the difference backward by ${step}.` },
      ],
    };
  }

  if (patternKind === "GEOMETRIC_MULTIPLICATION") {
    const start = pick(random, [2, 3, 4, 5, 6]);
    const multiplier = pick(random, [2, 3]);
    const series = [start];
    for (let index = 1; index < 7; index += 1) series.push(series[index - 1]! * multiplier);
    const last = series[5]!;
    return {
      patternKind,
      difficulty: multiplier === 2 ? "Easy" : "Medium",
      series,
      keyRule: `Each term is multiplied by ${multiplier}.`,
      working: [`${series[1]} ÷ ${series[0]} = ${multiplier} and the same multiplier continues.`, `${last} × ${multiplier} = ${series[6]}.`],
      nextDistractors: [
        { value: last * (multiplier + 1), id: "MULTIPLIER_ONE_TOO_HIGH", derivation: `Uses multiplier ${multiplier + 1} instead of ${multiplier}.` },
        { value: last + multiplier, id: "ADD_MULTIPLIER", derivation: `Adds ${multiplier} instead of multiplying by it.` },
        { value: last * multiplier + multiplier, id: "MULTIPLY_THEN_ADD_MULTIPLIER", derivation: `Multiplies correctly, then unnecessarily adds ${multiplier}.` },
        { value: last + series[4]!, id: "ADD_PREVIOUS_TERM", derivation: "Adds the previous term to the last term instead of using the common multiplier." },
        { value: multiplier > 2 ? last * (multiplier - 1) : last + last / 2, id: "MULTIPLIER_TOO_LOW", derivation: "Uses a smaller growth operation than the repeated multiplier." },
      ],
    };
  }

  if (patternKind === "MULTIPLY_AND_ADD") {
    const start = pick(random, [3, 4, 5, 6, 7]);
    const multiplier = pick(random, [2, 3]);
    const addend = pick(random, [-7, -5, -3, -1, 1, 2, 3, 4, 5]);
    const signedAdd = `${addend < 0 ? "−" : "+"} ${Math.abs(addend)}`;
    const series = [start];
    for (let index = 1; index < 7; index += 1) series.push(series[index - 1]! * multiplier + addend);
    const last = series[5]!;
    return {
      patternKind,
      difficulty: "Medium",
      series,
      keyRule: `Multiply by ${multiplier}, then ${addend < 0 ? "subtract" : "add"} ${Math.abs(addend)}.`,
      working: [`${series[0]} × ${multiplier} ${signedAdd} = ${series[1]}.`, `${last} × ${multiplier} ${signedAdd} = ${series[6]}.`],
      nextDistractors: [
        { value: last * multiplier, id: "OMIT_ADDEND", derivation: `Multiplies by ${multiplier} but omits the final ${signedAdd}.` },
        { value: (last + addend) * multiplier, id: "ADD_BEFORE_MULTIPLY", derivation: `Adds ${addend} before multiplying, changing the operation order.` },
        { value: last * multiplier - addend, id: "SUBTRACT_ADDEND", derivation: `Uses −${addend} instead of +${addend}.` },
        { value: last * (multiplier + 1) + addend, id: "MULTIPLIER_ONE_TOO_HIGH", derivation: `Uses multiplier ${multiplier + 1} while keeping the addend.` },
        { value: last + multiplier + addend, id: "ADD_BOTH_CONSTANTS", derivation: "Adds the multiplier and addend instead of applying multiplication first." },
      ],
    };
  }

  const startA = pick(random, [12, 18, 24, 30]);
  const startB = pick(random, [41, 47, 53, 59]);
  const diffA = pick(random, [5, 7, 9]);
  let diffB = pick(random, [4, 6, 8, 10]);
  if (diffB === diffA) diffB += 2;
  const series = Array.from({ length: 7 }, (_unused, index) => {
    if (index % 2 === 0) return startA + (index / 2) * diffA;
    return startB + ((index - 1) / 2) * diffB;
  });
  const lastSameParity = series[4]!;
  return {
    patternKind,
    difficulty: "Hard",
    series,
    keyRule: `Split the series into odd and even positions: one row increases by ${diffA}, the other by ${diffB}.`,
    working: [`Odd-position row: ${series[0]}, ${series[2]}, ${series[4]} ... (+${diffA}).`, `Even-position row: ${series[1]}, ${series[3]}, ${series[5]} ... (+${diffB}).`, `${lastSameParity} + ${diffA} = ${series[6]}.`],
    nextDistractors: [
      { value: lastSameParity + diffB, id: "USE_OTHER_ROW_DIFFERENCE", derivation: `Uses the even-row difference ${diffB} on the odd-position row.` },
      { value: series[5]! + diffA, id: "CONTINUE_FROM_ADJACENT_TERM", derivation: "Continues from the immediately previous term instead of the previous term in the same interleaved row." },
      { value: series[5]! + diffB, id: "CONTINUE_OTHER_ROW", derivation: "Extends the other interleaved row instead of the target row." },
      { value: lastSameParity + diffA + diffB, id: "ADD_BOTH_ROW_DIFFERENCES", derivation: "Adds both row differences to the target row." },
      { value: lastSameParity - diffA, id: "REVERSE_TARGET_ROW", derivation: `Moves backward by ${diffA} in the target row.` },
    ],
  };
}

function questionStem(taskKind: Bns001TaskKind, visible: readonly (number | "?")[]): string {
  const sequence = visible.join(", ");
  if (taskKind === "WRONG_TERM") return `Which number is wrong in the series? ${sequence}`;
  return taskKind === "NEXT_TERM"
    ? `What should come next in the series? ${sequence}, ?`
    : `What number should replace the question mark in the series? ${sequence}`;
}

function insertCandidate(visible: readonly (number | "?")[], hiddenIndex: number, candidate: number): number[] {
  return visible.map((value, index) => index === hiddenIndex ? candidate : Number(value)) as number[];
}

function buildMissingCandidates(fullSeries: readonly number[], hiddenIndex: number, state: PatternState): Array<{ value: number; id: string; derivation: string }> {
  const correct = fullSeries[hiddenIndex]!;
  const previous = fullSeries[hiddenIndex - 1]!;
  const next = fullSeries[hiddenIndex + 1]!;
  const candidates = [
    { value: previous, id: "COPY_PREVIOUS_TERM", derivation: "Copies the previous visible term into the missing position." },
    { value: next, id: "COPY_NEXT_TERM", derivation: "Copies the next visible term into the missing position." },
    { value: Math.floor((previous + next) / 2), id: "LOCAL_AVERAGE", derivation: "Assumes the missing value is the arithmetic mean of its two neighbours." },
    { value: previous + (next - previous), id: "JUMP_DIRECTLY_TO_NEXT", derivation: "Uses the entire neighbour-to-neighbour gap as the next step and lands on the following term." },
    { value: Math.max(1, correct - 1), id: "OFF_BY_ONE_LOW", derivation: "Follows the apparent magnitude but misses the required value by one." },
    { value: correct + 1, id: "OFF_BY_ONE_HIGH", derivation: "Follows the apparent magnitude but overshoots the required value by one." },
    { value: Math.max(1, previous + Math.abs(next - previous) * 2), id: "DOUBLE_LOCAL_GAP", derivation: "Doubles the local visible gap instead of reconstructing the governing series rule." },
  ];

  if (state.patternKind === "INTERLEAVED_ARITHMETIC") {
    const otherRowIndex = hiddenIndex % 2 === 0 ? hiddenIndex - 1 : hiddenIndex + 1;
    if (otherRowIndex >= 0 && otherRowIndex < fullSeries.length) {
      candidates.push({ value: fullSeries[otherRowIndex]!, id: "COPY_OTHER_INTERLEAVED_ROW", derivation: "Uses the adjacent term from the other interleaved row." });
    }
  }
  return candidates;
}

function buildOptions(
  seed: string,
  taskKind: Bns001TaskKind,
  fullSeries: readonly number[],
  visible: readonly (number | "?")[],
  hiddenIndex: number | null,
  state: PatternState,
): { options: string[]; optionMetadata: Bns001Option[]; correctIndex: number } {
  const correct = taskKind === "NEXT_TERM" ? fullSeries[6]! : fullSeries[hiddenIndex!]!;
  const candidatePool = taskKind === "NEXT_TERM"
    ? state.nextDistractors
    : buildMissingCandidates(fullSeries, hiddenIndex!, state);

  const accepted: Bns001Option[] = [{ text: String(correct), misconceptionId: "CORRECT", derivation: "Satisfies the unique supported series grammar across the complete sequence." }];
  const seen = new Set<number>([correct]);

  for (const candidate of candidatePool) {
    if (!Number.isSafeInteger(candidate.value) || candidate.value <= 0 || seen.has(candidate.value)) continue;
    const candidateSeries = taskKind === "NEXT_TERM"
      ? [...fullSeries.slice(0, 6), candidate.value]
      : insertCandidate(visible, hiddenIndex!, candidate.value);
    if (independentGrammarMatches(candidateSeries).length !== 0) continue;
    seen.add(candidate.value);
    accepted.push({ text: String(candidate.value), misconceptionId: candidate.id, derivation: candidate.derivation });
    if (accepted.length === 5) break;
  }

  if (accepted.length < 5) throw new Error(`BNS-001 could construct only ${accepted.length} grammar-safe options.`);
  const shuffled = shuffle(seededRandom(`${seed}:options`), accepted);
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function missingTermWorking(state: PatternState, hiddenIndex: number): readonly string[] {
  const series = state.series;
  const before = series[hiddenIndex - 1]!;
  const correct = series[hiddenIndex]!;
  const after = series[hiddenIndex + 1]!;
  if (state.patternKind === "INTERLEAVED_ARITHMETIC") {
    const positions = [0, 1, 2, 3, 4, 5].filter((index) => index % 2 === hiddenIndex % 2 && index !== hiddenIndex);
    const first = positions[0]!;
    const second = positions[1]!;
    const jumps = (second - first) / 2;
    const increment = (series[second]! - series[first]!) / jumps;
    const previous = series[hiddenIndex - 2]!;
    return [
      "Treat the odd-position and even-position terms as separate rows.",
      `In the row containing the gap, positions ${first + 1} and ${second + 1} give (${series[second]} - ${series[first]}) ÷ ${jumps} = ${increment} per jump.`,
      `Missing term = ${previous} + ${increment} = ${correct}.`,
      ...(hiddenIndex + 2 < 6 ? [`Check the next term in this row: ${correct} + ${increment} = ${series[hiddenIndex + 2]}.`] : []),
    ];
  }
  if (state.patternKind === "ARITHMETIC_DIFFERENCE" || state.patternKind === "PROGRESSIVE_DIFFERENCE") {
    const gapDifference = correct - before;
    const followingDifference = after - correct;
    // A visible triple exists after a gap at position 3, or before later gaps.
    const start = hiddenIndex === 2 ? 3 : 0;
    const first = series[start]!;
    const second = series[start + 1]!;
    const third = series[start + 2]!;
    const rise = (third - second) - (second - first);
    const offset = hiddenIndex - 1 - start;
    return [
      state.keyRule,
      `Visible differences include ${second} - ${first} = ${second - first} and ${third} - ${second} = ${third - second}.`,
      ...(state.patternKind === "PROGRESSIVE_DIFFERENCE" ? [
        `Difference into the gap = ${second - first} ${offset < 0 ? "−" : "+"} ${Math.abs(offset)} × ${rise} = ${gapDifference}.`,
      ] : []),
      `The difference into position ${hiddenIndex + 1} is ${gapDifference}; missing term = ${before} + ${gapDifference} = ${correct}.`,
      `Check the following step: ${correct} + ${followingDifference} = ${after}.`,
    ];
  }
  const start = hiddenIndex === 2 ? 3 : 0;
  const first = series[start]!;
  const second = series[start + 1]!;
  const third = series[start + 2]!;
  if (state.patternKind === "GEOMETRIC_MULTIPLICATION") {
    const multiplier = second / first;
    return [
      `Visible ratios: ${second} ÷ ${first} = ${multiplier} and ${third} ÷ ${second} = ${multiplier}.`,
      `Missing term = ${before} × ${multiplier} = ${correct}.`,
      `Check the following step: ${correct} × ${multiplier} = ${after}.`,
    ];
  }
  const multiplier = (third - second) / (second - first);
  const addend = second - first * multiplier;
  const operation = `× ${multiplier}${addend === 0 ? "" : ` ${addend < 0 ? "−" : "+"} ${Math.abs(addend)}`}`;
  return [
    `Two visible differences are ${second - first} and ${third - second}; their ratio is ${multiplier}.`,
    `The fixed addend is ${second} − ${first} × ${multiplier} = ${addend}.`,
    `The rule is multiply by ${multiplier}${addend === 0 ? "" : `, then ${addend < 0 ? "subtract" : "add"} ${Math.abs(addend)}`}: ${first} ${operation} = ${second}.`,
    `Missing term = ${before} ${operation} = ${correct}.`,
    `Check the following step: ${correct} ${operation} = ${after}.`,
  ];
}

function generateBaseBns001Question(input: {
  seed?: string;
  taskKind?: Bns001TaskKind;
  patternKind?: Bns001PatternKind;
} = {}): Bns001Question {
  const seed = input.seed ?? "BNS-001:PHASE0";
  const random = seededRandom(`${seed}:selector`);
  const taskKind = input.taskKind ?? pick(random, ["NEXT_TERM", "MISSING_TERM"] as const);
  const requestedPattern = input.patternKind ?? pick(random, PATTERNS);
  if (taskKind !== "NEXT_TERM" && taskKind !== "MISSING_TERM" && taskKind !== "WRONG_TERM") {
    throw new Error(`BNS-001 unsupported task kind: ${String(taskKind)}.`);
  }
  if (!PATTERNS.includes(requestedPattern)) {
    throw new Error(`BNS-001 unsupported pattern kind: ${String(requestedPattern)}.`);
  }

  for (let attempt = 0; attempt < 64; attempt += 1) {
    const initial = buildPatternState(seed, requestedPattern, attempt);
    const extended = [...initial.series];
    if (taskKind === "WRONG_TERM") {
      while (extended.length < 9) {
        const n = extended.length;
        const firstDifference = extended[1]! - extended[0]!;
        const rise = extended[2]! - 2 * extended[1]! + extended[0]!;
        const multiplier = (extended[2]! - extended[1]!) / firstDifference;
        const next = requestedPattern === "ARITHMETIC_DIFFERENCE" ? extended[n - 1]! + firstDifference
          : requestedPattern === "PROGRESSIVE_DIFFERENCE" ? extended[n - 1]! + firstDifference + (n - 1) * rise
          : requestedPattern === "GEOMETRIC_MULTIPLICATION" ? extended[n - 1]! * (extended[1]! / extended[0]!)
          : requestedPattern === "MULTIPLY_AND_ADD" ? extended[n - 1]! * multiplier + extended[1]! - extended[0]! * multiplier
          : extended[n - 2]! + extended[n % 2 + 2]! - extended[n % 2]!;
        extended.push(next);
      }
    }
    const state: PatternState = { ...initial, series: extended };
    if (state.series.some((value) => value > 50_000)) continue;
    const fullMatches = supportedGrammarMatches(state.series);
    if (fullMatches.length !== 1 || fullMatches[0] !== requestedPattern) continue;

    const hiddenIndex = taskKind !== "NEXT_TERM"
      ? pick(seededRandom(`${seed}:${attempt}:hidden`), [2, 3, 4] as const)
      : null;
    const visible: Array<number | "?"> = taskKind === "NEXT_TERM"
      ? [...state.series.slice(0, 6)]
      : state.series.slice(0, 6).map((value, index) => index === hiddenIndex ? "?" : value);

    if (taskKind === "WRONG_TERM") {
      const incorrect = state.series[hiddenIndex!]! + pick(seededRandom(`${seed}:${attempt}:corruption`), [-3, -2, -1, 1, 2, 3]);
      const corrupted = state.series.slice(0, 8).map((n, i) => i === hiddenIndex ? incorrect : n);
      if (new Set(corrupted).size !== 8) continue;
      const repairs = independentWrongTermRepairs(corrupted);
      if (repairs.length !== 1 || repairs[0]!.index !== hiddenIndex || repairs[0]!.pattern !== requestedPattern) continue;
      const distractors = corrupted.filter((_n, i) => i !== hiddenIndex).slice(0, 4);
      const metadata = shuffle(seededRandom(`${seed}:options`), [
        { text: String(incorrect), misconceptionId: "CORRECT", derivation: "This displayed term alone breaks the governing rule." },
        ...distractors.map((n) => ({ text: String(n), misconceptionId: "REJECT_VALID_TERM", derivation: "Rejects a term that already fits the corrected series." })),
      ]);
      const correctIndex = metadata.findIndex((o) => o.misconceptionId === "CORRECT");
      return {
        packageId: "BNS-001", questionId: `BNS-001-${hashSeed(`${seed}:${taskKind}:${requestedPattern}`).toString(36)}`,
        seed, language: "en", examProfile: "BANKING_PRELIMS", optionCount: 5,
        taskKind, patternKind: requestedPattern, difficulty: state.difficulty,
        visibleSeries: corrupted, stem: questionStem(taskKind, corrupted),
        options: metadata.map((o) => o.text), optionMetadata: metadata, correctIndex, answer: String(incorrect),
        explanation: {
          keyRule: state.keyRule,
          working: [...missingTermWorking(state, hiddenIndex!).map((line) => line.replace(/Missing term|missing term/g, "Required term")),
            `Position ${hiddenIndex! + 1} should contain ${state.series[hiddenIndex!]}, but the series shows ${incorrect}.`,
            `The wrong number is ${incorrect}; replace it with ${state.series[hiddenIndex!]}.`],
          shortcut: "Check the pattern on both sides of the suspected wrong term.",
          trap: "The answer is the wrong displayed number, while the replacement belongs in the explanation.",
        },
        proof: { fullSeries: state.series, hiddenIndex, canonicalNext: state.series[8]!,
          supportedGrammarMatches: fullMatches, independentVerifier: "PASS" },
        traceability: { packageId: "BNS-001", contractVersion: "BNS-001-CONTENT-REVIEW-V3",
          ownership: "SPEED_MATHEMATICS_BANKING_NUMBER_SERIES", numberSystemOwnership: false,
          reasoningLetterSeriesOwnership: false, reviewStatus: "UNREVIEWED", questionStudioDiscoverable: false,
          questionBankStatus: "NOT_STORED", testEligibility: "INELIGIBLE", publiclyPublishable: false },
      };
    }

    try {
      const optionPackage = buildOptions(seed, taskKind, state.series, visible, hiddenIndex, state);
      const correct = taskKind === "NEXT_TERM" ? state.series[6]! : state.series[hiddenIndex!]!;
      const completedForProof = taskKind === "NEXT_TERM"
        ? state.series
        : insertCandidate(visible, hiddenIndex!, correct);
      const proofMatches = supportedGrammarMatches(completedForProof);
      if (proofMatches.length !== 1 || proofMatches[0] !== requestedPattern) continue;

      const questionId = `BNS-001-${hashSeed(`${seed}:${taskKind}:${requestedPattern}`).toString(36)}`;
      const working = taskKind === "NEXT_TERM"
        ? state.working
        : missingTermWorking(state, hiddenIndex!);

      return {
        packageId: "BNS-001",
        questionId,
        seed,
        language: "en",
        examProfile: "BANKING_PRELIMS",
        optionCount: 5,
        taskKind,
        patternKind: requestedPattern,
        difficulty: state.difficulty,
        visibleSeries: visible,
        stem: questionStem(taskKind, visible),
        options: optionPackage.options,
        optionMetadata: optionPackage.optionMetadata,
        correctIndex: optionPackage.correctIndex,
        answer: String(correct),
        explanation: {
          keyRule: state.keyRule,
          working,
          shortcut: requestedPattern === "INTERLEAVED_ARITHMETIC"
            ? "Split odd and even positions before doing any arithmetic."
            : "Compare consecutive operations first; do not guess from the size of the terms.",
          trap: optionPackage.optionMetadata.find((option) => option.misconceptionId !== "CORRECT")?.derivation ?? "Check the governing rule across every visible transition.",
        },
        proof: {
          fullSeries: state.series,
          hiddenIndex,
          canonicalNext: state.series[6]!,
          supportedGrammarMatches: proofMatches,
          independentVerifier: "PASS",
        },
        traceability: {
          packageId: "BNS-001",
          contractVersion: "BNS-001-CONTENT-REVIEW-V3",
          ownership: "SPEED_MATHEMATICS_BANKING_NUMBER_SERIES",
          numberSystemOwnership: false,
          reasoningLetterSeriesOwnership: false,
          reviewStatus: "UNREVIEWED",
          questionStudioDiscoverable: false,
          questionBankStatus: "NOT_STORED",
          testEligibility: "INELIGIBLE",
          publiclyPublishable: false,
        },
      };
    } catch {
      continue;
    }
  }

  throw new Error(`BNS-001 could not construct a unique ${requestedPattern} / ${taskKind} question for seed ${seed}.`);
}

export function generateBns001Question(input: {
  seed?: string;
  taskKind?: Bns001TaskKind;
  patternKind?: Bns001PatternKind;
  language?: Bns001Language;
  examProfile?: "BANKING_PRELIMS" | "BANKING_MAINS";
} = {}): Bns001Question {
  const language = input.language ?? "en";
  if (!["en", "hi", "pa"].includes(language)) throw new Error(`BNS-001 unsupported language: ${String(language)}.`);
  const profile = input.examProfile ?? "BANKING_PRELIMS";
  if (!["BANKING_PRELIMS", "BANKING_MAINS"].includes(profile)) throw new Error("BNS-001 unsupported exam profile.");
  const candidates = profile === "BANKING_MAINS" ? BNS_MAINS_PATTERNS : [...PATTERNS, ...ADVANCED_PATTERNS];
  const pattern = input.patternKind ?? pick(seededRandom(`${input.seed ?? "BNS-DEFAULT"}:chapter-family`), candidates);
  if (pattern && ADVANCED_PATTERNS.includes(pattern)) return generateAdvancedBns({ ...input, language, patternKind: pattern, examProfile: profile });
  if (profile === "BANKING_MAINS") throw new Error("BNS-001 pattern outside the bounded Mains profile.");
  return localizeBns001(generateBaseBns001Question({ ...input, patternKind: pattern }), language);
}
