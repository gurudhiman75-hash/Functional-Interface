import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
  evaluateFiniteDomainPair,
  optionForClass,
  type SufficiencyClass,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import { solveCodCp001 } from "../../../Coding-Decoding/COD-001/COD-CP-001/independent-solver.ts";
import { mappingFromEvidence } from "../../../Coding-Decoding/COD-001/foundation/mapping.ts";
import type { DirectMappingPrompt, MappingEvidence } from "../../../Coding-Decoding/COD-001/foundation/types.ts";

export const DSF_CP013_CODING_RUNTIME_VERSION = "DSF_CP013_CODING_RUNTIME_V1" as const;
export const DSF_CP013_CODING_SOLVE_MODES = [
  "DSF-SM-COD-ENCODE-FIRST-SYMBOL",
  "DSF-SM-COD-DECODE-DIGIT-1",
  "DSF-SM-COD-ENCODE-FIRST-TWO",
] as const;

export type DsfCp013CodingSolveMode = (typeof DSF_CP013_CODING_SOLVE_MODES)[number];
type Difficulty = "Easy" | "Medium" | "Hard";
type ContextId =
  | "CODE_LANGUAGE"
  | "ACCESS_KEY"
  | "ARCHIVE_KEY"
  | "TRAINING_CODE"
  | "SIGNAL_CODE"
  | "LABEL_CODE";
type StatementFamily = "SINGLE_MAPPING" | "DOUBLE_MAPPING" | "TRIPLE_MAPPING";
type SymbolTuple = readonly [string, string, string, string];

type CodingWorld = Readonly<{
  tokensByIndex: readonly [string, string, string, string];
}>;

type CodingContext = Readonly<{
  id: ContextId;
  symbols: SymbolTuple;
  intros: readonly string[];
}>;

type CodingProblem = Readonly<{
  solveMode: DsfCp013CodingSolveMode;
  context: CodingContext;
  anchor: CodingWorld;
  intro: string;
}>;

type MappingFact = Readonly<{ sourceIndex: 0 | 1 | 2 | 3; token: string }>;
type CodingStatement = Readonly<{
  id: string;
  family: StatementFamily;
  complexity: 1 | 2 | 3;
  sourceIndexes: readonly (0 | 1 | 2 | 3)[];
  text: string;
  test: (world: CodingWorld) => boolean;
}>;

type Pair = Readonly<{
  statementI: CodingStatement;
  statementII: CodingStatement;
  evaluation: TwoStatementSufficiencyEvaluation<string>;
  quality: number;
}>;

const TOKENS = ["1", "2", "3", "4"] as const;
const CONTEXTS: readonly CodingContext[] = [
  {
    id: "CODE_LANGUAGE",
    symbols: ["A", "B", "C", "D"],
    intros: [
      "In a certain code language, four source symbols are assigned digit codes.",
      "A four-symbol code language uses four different digit codes.",
      "Consider a one-to-one digit code for four source symbols.",
      "Four symbols in a code language receive distinct digit codes.",
    ],
  },
  {
    id: "ACCESS_KEY",
    symbols: ["P", "Q", "R", "S"],
    intros: [
      "An access-key system assigns one digit to each of four letter symbols.",
      "Four access-key symbols use four different digit codes.",
      "Consider a one-to-one access code for four letter symbols.",
      "A small access-key table maps four symbols to distinct digits.",
    ],
  },
  {
    id: "ARCHIVE_KEY",
    symbols: ["J", "K", "L", "M"],
    intros: [
      "An archive key maps four letters to four distinct digits.",
      "Four archive labels are represented by different one-digit codes.",
      "Consider a four-letter archive coding key.",
      "An archive uses a one-to-one mapping between four letters and four digits.",
    ],
  },
  {
    id: "TRAINING_CODE",
    symbols: ["W", "X", "Y", "Z"],
    intros: [
      "A training exercise uses a four-letter substitution code.",
      "Four training symbols are assigned four different digits.",
      "Consider the one-to-one coding key used in a training drill.",
      "A training code maps four letters to distinct digit values.",
    ],
  },
  {
    id: "SIGNAL_CODE",
    symbols: ["G", "H", "I", "J"],
    intros: [
      "A signal chart assigns distinct digits to four letter symbols.",
      "Four signal symbols use a one-to-one digit code.",
      "Consider a four-symbol signal coding table.",
      "A signal code maps four letters to four different digits.",
    ],
  },
  {
    id: "LABEL_CODE",
    symbols: ["R", "T", "U", "V"],
    intros: [
      "A label system assigns one of four digits to each of four symbols.",
      "Four label symbols are represented by distinct digit codes.",
      "Consider a one-to-one code used for four labels.",
      "A compact label code maps four letters to four different digits.",
    ],
  },
];

function permutations(values: readonly string[]): readonly (readonly [string, string, string, string])[] {
  const output: [string, string, string, string][] = [];
  for (const a of values) for (const b of values) for (const c of values) for (const d of values) {
    if (new Set([a, b, c, d]).size !== 4) continue;
    output.push([a, b, c, d]);
  }
  return Object.freeze(output.map((entry) => Object.freeze(entry)));
}

const CODING_WORLDS: readonly CodingWorld[] = Object.freeze(
  permutations(TOKENS).map((tokensByIndex) => Object.freeze({ tokensByIndex })),
);

if (CODING_WORLDS.length !== 24) throw new Error(`COD-CP-001 four-symbol bijection must contain 24 worlds; found ${CODING_WORLDS.length}.`);
export const DSF_CP013_CODING_WORLD_COUNT = CODING_WORLDS.length;

function evidenceFor(problem: CodingProblem, world: CodingWorld): readonly MappingEvidence[] {
  return problem.context.symbols.map((source, index) => ({ source, code: world.tokensByIndex[index]! }));
}

function sourceTargetAnswer(problem: CodingProblem, world: CodingWorld): string {
  const symbols = problem.context.symbols;
  const evidence = evidenceFor(problem, world);
  mappingFromEvidence(evidence, "-");
  const prompt: DirectMappingPrompt = problem.solveMode === "DSF-SM-COD-DECODE-DIGIT-1"
    ? {
        taskKind: "DECODE_TARGET",
        outputKind: "DIGIT",
        evidence,
        target: "",
        encodedTarget: "1",
        separator: "-",
      }
    : {
        taskKind: "ENCODE_TARGET",
        outputKind: "DIGIT",
        evidence,
        target: problem.solveMode === "DSF-SM-COD-ENCODE-FIRST-TWO" ? `${symbols[0]}${symbols[1]}` : symbols[0],
        separator: "-",
      };
  return solveCodCp001(prompt);
}

for (const context of CONTEXTS) {
  for (const tokensByIndex of permutations(TOKENS)) {
    const world: CodingWorld = { tokensByIndex };
    const baseProblem: Omit<CodingProblem, "solveMode"> = { context, anchor: world, intro: context.intros[0]! };
    const firstExpected = tokensByIndex[0]!;
    const decodedExpected = context.symbols[tokensByIndex.indexOf("1")]!;
    const firstTwoExpected = `${tokensByIndex[0]}-${tokensByIndex[1]}`;
    if (sourceTargetAnswer({ ...baseProblem, solveMode: "DSF-SM-COD-ENCODE-FIRST-SYMBOL" }, world) !== firstExpected) {
      throw new Error(`COD-CP-001 source parity failed for ${context.id}/encode-first.`);
    }
    if (sourceTargetAnswer({ ...baseProblem, solveMode: "DSF-SM-COD-DECODE-DIGIT-1" }, world) !== decodedExpected) {
      throw new Error(`COD-CP-001 source parity failed for ${context.id}/decode-1.`);
    }
    if (sourceTargetAnswer({ ...baseProblem, solveMode: "DSF-SM-COD-ENCODE-FIRST-TWO" }, world) !== firstTwoExpected) {
      throw new Error(`COD-CP-001 source parity failed for ${context.id}/encode-first-two.`);
    }
  }
}

const adapter = {
  adapterId: "DSF-CP013-COD-CP001-DIRECT-MAPPING-V1",
  domainFamily: "REASONING" as const,
  sourceChapterId: "COD-001",
  enumerateBaseWorlds: (_problem: CodingProblem) => CODING_WORLDS,
  statementHolds: (_problem: CodingProblem, world: CodingWorld, statement: CodingStatement) => statement.test(world),
  evaluateTarget: (problem: CodingProblem, world: CodingWorld) => sourceTargetAnswer(problem, world),
  normalizeAnswer: (answer: string) => answer,
};

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  for (const character of `${DSF_CP013_CODING_RUNTIME_VERSION}:${seed}:${salt}`) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed: number, salt: string): () => number {
  let state = hashSeed(seed, salt) || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function pick<T>(random: () => number, values: readonly T[]): T {
  if (!values.length) throw new Error("CP013 Coding cannot pick from an empty set.");
  return values[Math.floor(random() * values.length)]!;
}

function modeForSeed(seed: number): DsfCp013CodingSolveMode {
  return DSF_CP013_CODING_SOLVE_MODES[Math.abs(seed) % DSF_CP013_CODING_SOLVE_MODES.length]!;
}

function classForSeed(seed: number): SufficiencyClass {
  const block = Math.floor(Math.abs(seed) / DSF_CP013_CODING_SOLVE_MODES.length);
  return SUFFICIENCY_CLASSES[block % SUFFICIENCY_CLASSES.length]!;
}

function subsetIndexes(mask: number): readonly (0 | 1 | 2 | 3)[] {
  const indexes: (0 | 1 | 2 | 3)[] = [];
  for (let index = 0 as 0 | 1 | 2 | 3; index < 4; index = (index + 1) as 0 | 1 | 2 | 3) {
    if ((mask & (1 << index)) !== 0) indexes.push(index);
  }
  return indexes;
}

function statementFamily(size: number): StatementFamily {
  return size === 1 ? "SINGLE_MAPPING" : size === 2 ? "DOUBLE_MAPPING" : "TRIPLE_MAPPING";
}

function mappingFacts(problem: CodingProblem, indexes: readonly (0 | 1 | 2 | 3)[]): readonly MappingFact[] {
  return indexes.map((sourceIndex) => ({ sourceIndex, token: problem.anchor.tokensByIndex[sourceIndex] }));
}

function renderMappingStatement(problem: CodingProblem, facts: readonly MappingFact[], variant: number): string {
  const symbols = problem.context.symbols;
  const pairs = facts.map((fact) => `${symbols[fact.sourceIndex]}-${fact.token}`);
  if (facts.length === 1) {
    const fact = facts[0]!;
    const source = symbols[fact.sourceIndex];
    return [
      `${source} is coded as ${fact.token}.`,
      `The digit code of ${source} is ${fact.token}.`,
      `Digit ${fact.token} represents ${source}.`,
      `The mapping contains ${source} → ${fact.token}.`,
    ][variant % 4]!;
  }
  if (facts.length === 2) {
    const [first, second] = facts;
    const firstSource = symbols[first!.sourceIndex];
    const secondSource = symbols[second!.sourceIndex];
    return [
      `${firstSource} and ${secondSource} are coded as ${first!.token} and ${second!.token}, respectively.`,
      `The mapping contains ${pairs[0]} and ${pairs[1]}.`,
      `${firstSource} → ${first!.token}, while ${secondSource} → ${second!.token}.`,
      `The digit assignments for ${firstSource} and ${secondSource} are ${first!.token} and ${second!.token}, respectively.`,
    ][variant % 4]!;
  }
  const sources = facts.map((fact) => symbols[fact.sourceIndex]);
  const tokens = facts.map((fact) => fact.token);
  return [
    `${sources.join(", ")} are coded as ${tokens.join(", ")}, respectively.`,
    `The mapping contains ${pairs.join(", ")}.`,
    `${sources[0]} → ${tokens[0]}, ${sources[1]} → ${tokens[1]}, and ${sources[2]} → ${tokens[2]}.`,
    `The digit assignments for ${sources.join(", ")} are ${tokens.join(", ")}, respectively.`,
  ][variant % 4]!;
}

function buildStatementPool(problem: CodingProblem): readonly CodingStatement[] {
  const pool: CodingStatement[] = [];
  for (let mask = 1; mask < 15; mask += 1) {
    const indexes = subsetIndexes(mask);
    if (indexes.length > 3) continue;
    const facts = mappingFacts(problem, indexes);
    const id = `MAP_${indexes.join("")}_${facts.map((fact) => fact.token).join("")}`;
    const variant = hashSeed(mask + Number(problem.anchor.tokensByIndex.join("")), `${problem.context.id}:${id}`) % 4;
    pool.push({
      id,
      family: statementFamily(indexes.length),
      complexity: indexes.length as 1 | 2 | 3,
      sourceIndexes: indexes,
      text: renderMappingStatement(problem, facts, variant),
      test: (world) => facts.every((fact) => world.tokensByIndex[fact.sourceIndex] === fact.token),
    });
  }
  return pool;
}

function pairQuality(first: CodingStatement, second: CodingStatement, evaluation: TwoStatementSufficiencyEvaluation<string>): number {
  let score = first.family === second.family ? 0 : 5;
  const overlap = first.sourceIndexes.filter((index) => second.sourceIndexes.includes(index)).length;
  score -= overlap * 3;
  if (evaluation.classification === "BOTH_TOGETHER_ONLY") score += 12;
  if (evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") score += 5;
  score += Math.min(8, evaluation.statementI.worldCount + evaluation.statementII.worldCount);
  return score - first.complexity - second.complexity;
}

function synthesizePair(problem: CodingProblem, seed: number, desiredClass: SufficiencyClass): Pair {
  const statements = buildStatementPool(problem);
  const candidates: Pair[] = [];
  for (const statementI of statements) for (const statementII of statements) {
    if (statementI.id === statementII.id) continue;
    try {
      const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
      if (evaluation.classification === desiredClass) {
        candidates.push({ statementI, statementII, evaluation, quality: pairQuality(statementI, statementII, evaluation) });
      }
    } catch {
      // Reject a logically inconsistent conjunction; valid CP013 questions require at least one joint world.
    }
  }
  if (!candidates.length) throw new Error(`No COD-CP-001 DS pair for ${problem.solveMode}/${desiredClass}.`);
  const best = Math.max(...candidates.map((candidate) => candidate.quality));
  return pick(createRng(seed, `pair:${problem.solveMode}:${desiredClass}`), candidates.filter((candidate) => candidate.quality >= best - 2));
}

function targetPrompt(problem: CodingProblem): string {
  const [first, second] = problem.context.symbols;
  switch (problem.solveMode) {
    case "DSF-SM-COD-ENCODE-FIRST-SYMBOL": return `What is the digit code of ${first}?`;
    case "DSF-SM-COD-DECODE-DIGIT-1": return "Which source symbol is represented by digit 1?";
    case "DSF-SM-COD-ENCODE-FIRST-TWO": return `How is the two-symbol sequence ${first}${second} coded?`;
  }
}

function targetLabel(problem: CodingProblem): string {
  const [first, second] = problem.context.symbols;
  switch (problem.solveMode) {
    case "DSF-SM-COD-ENCODE-FIRST-SYMBOL": return `the exact digit assigned to ${first}`;
    case "DSF-SM-COD-DECODE-DIGIT-1": return "the exact source symbol assigned digit 1";
    case "DSF-SM-COD-ENCODE-FIRST-TWO": return `the exact two-digit code of ${first}${second}`;
  }
}

function difficultyFor(pair: Pair): Difficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  if (pair.evaluation.classification === "EACH_STATEMENT_ALONE") return "Easy";
  return "Medium";
}

function counterexampleText(answers: readonly string[]): string {
  if (answers.length >= 2) return `for example, the target can be ${answers[0]} or ${answers[1]}`;
  return "the target is not uniquely fixed";
}

function explanationFor(problem: CodingProblem, pair: Pair): string {
  const evaluation = pair.evaluation;
  const line = (label: string, sufficient: boolean, answers: readonly string[], worldCount: number) => sufficient
    ? `${label} is sufficient: all ${worldCount} valid one-to-one code mappings give the same target, ${answers[0]}.`
    : `${label} is not sufficient: ${counterexampleText(answers)}.`;
  return [
    `We need ${targetLabel(problem)}.`,
    line("Statement I", evaluation.statementI.sufficient, evaluation.statementI.normalizedTargetAnswers, evaluation.statementI.worldCount),
    line("Statement II", evaluation.statementII.sufficient, evaluation.statementII.normalizedTargetAnswers, evaluation.statementII.worldCount),
    line("Together", evaluation.together.sufficient, evaluation.together.normalizedTargetAnswers, evaluation.together.worldCount),
    `Hence the correct sufficiency class is ${evaluation.classification}.`,
  ].join(" ");
}

function normalizeSurface(text: string): string {
  return text.toLowerCase().replace(/\b\d+\b/g, "#").replace(/\s+/g, " ").trim();
}

export function normalizeDsfCp013CodingSurface(text: string): string {
  return normalizeSurface(text);
}

function structuralFingerprint(problem: CodingProblem, pair: Pair): string {
  return [
    problem.solveMode,
    pair.evaluation.classification,
    problem.context.id,
    pair.statementI.sourceIndexes.join(""),
    pair.statementII.sourceIndexes.join(""),
    pair.statementI.family,
    pair.statementII.family,
  ].join("|");
}

export function generateDsfCp013CodingQuestion(seed: number) {
  const solveMode = modeForSeed(seed);
  const desiredClass = classForSeed(seed);
  const contextIndex = Math.floor(Math.abs(seed) / DSF_CP013_CODING_SOLVE_MODES.length) % CONTEXTS.length;
  const context = CONTEXTS[contextIndex]!;
  const random = createRng(seed, `problem:${solveMode}:${context.id}`);
  const anchor = pick(random, CODING_WORLDS);
  const intro = context.intros[Math.abs(seed * 5) % context.intros.length]!;
  const problem: CodingProblem = { solveMode, context, anchor, intro };
  const pair = synthesizePair(problem, seed, desiredClass);
  const premise = `The symbols ${context.symbols.join(", ")} use the digits 1, 2, 3 and 4 exactly once each.`;
  const prompt = targetPrompt(problem);
  const stem = `${intro} ${premise} ${prompt}\n\nStatement I: ${pair.statementI.text}\nStatement II: ${pair.statementII.text}`;
  const correct = optionForClass(DS_STANDARD_5_EN, pair.evaluation.classification);
  const generationIdentity = createHash("sha256")
    .update(`${DSF_CP013_CODING_RUNTIME_VERSION}|${seed}|${solveMode}|${context.id}|${anchor.tokensByIndex.join("")}|${pair.statementI.id}|${pair.statementII.id}`)
    .digest("hex")
    .slice(0, 24);

  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-013" as const,
    qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP013_CODING_RUNTIME_VERSION,
    seed,
    locale: "en-IN" as const,
    difficulty: difficultyFor(pair),
    domainFamily: "REASONING" as const,
    sourceChapterId: "COD-001" as const,
    sourceCheckpointId: "COD-CP-001" as const,
    sourceWorldCount: CODING_WORLDS.length,
    sourceCapabilities: [
      "COD-CP-001/independent-solver::solveCodCp001",
      "COD-001/foundation/mapping::mappingFromEvidence",
      "COD-001/foundation/mapping::encodeWithMapping/decodeWithMapping",
    ] as const,
    solveModeId: solveMode,
    targetKind: solveMode === "DSF-SM-COD-ENCODE-FIRST-SYMBOL"
      ? "ENCODE_SINGLE_SYMBOL" as const
      : solveMode === "DSF-SM-COD-DECODE-DIGIT-1"
        ? "DECODE_SINGLE_TOKEN" as const
        : "ENCODE_SYMBOL_SEQUENCE" as const,
    contextId: context.id,
    answerContractId: "DS_STANDARD_5" as const,
    taskDirection: "DATA_SUFFICIENCY" as const,
    answerSemantic: "SUFFICIENCY_CLASS" as const,
    stem,
    questionPrompt: prompt,
    statements: [
      { id: "I" as const, statementRuleId: pair.statementI.id, statementFamily: pair.statementI.family, text: pair.statementI.text },
      { id: "II" as const, statementRuleId: pair.statementII.id, statementFamily: pair.statementII.family, text: pair.statementII.text },
    ] as const,
    options: DS_STANDARD_5_EN.options.map((option) => ({
      key: option.key,
      value: option.text,
      semanticClass: option.semanticClass,
      isCorrect: option.semanticClass === pair.evaluation.classification,
    })),
    correctIndex: DS_STANDARD_5_EN.options.findIndex((option) => option.semanticClass === pair.evaluation.classification),
    canonicalAnswer: pair.evaluation.classification,
    explanation: explanationFor(problem, pair),
    proof: {
      baseWorldCount: CODING_WORLDS.length,
      statementIWorldCount: pair.evaluation.statementI.worldCount,
      statementIIWorldCount: pair.evaluation.statementII.worldCount,
      togetherWorldCount: pair.evaluation.together.worldCount,
      statementITargetAnswers: pair.evaluation.statementI.normalizedTargetAnswers,
      statementIITargetAnswers: pair.evaluation.statementII.normalizedTargetAnswers,
      togetherTargetAnswers: pair.evaluation.together.normalizedTargetAnswers,
      minimalSufficientSets: pair.evaluation.minimalSufficientSets,
    },
    sourceAncestry: [
      "COD-001",
      "COD-CP-001",
      "DIRECT_LETTER_TO_DIGIT_MAP",
      "solveCodCp001",
      "mappingFromEvidence",
    ] as const,
    generationIdentity,
    studentSurfaceFingerprint: structuralFingerprint(problem, pair),
    lifecycle: {
      contentStatus: "CP013_REASONING_WAVE2_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
    },
    sourceAnswer: sourceTargetAnswer(problem, anchor),
    correctOptionText: correct.text,
  });
}

export function generateDsfCp013CodingBatch(seeds: readonly number[]) {
  return seeds.map(generateDsfCp013CodingQuestion);
}
