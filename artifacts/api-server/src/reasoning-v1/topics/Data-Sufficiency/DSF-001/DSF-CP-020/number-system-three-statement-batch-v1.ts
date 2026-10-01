import { createHash } from "node:crypto";

import {
  fillSingleDigit,
  isDivisible,
  numeralToBigInt,
} from "../../../../../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/foundation/divisibility.ts";
import {
  evaluateFiniteDomainTriple,
  type ThreeStatementSufficiencyEvaluation,
} from "../DSF-CP-015/three-statement-foundation.ts";
import {
  buildThreeStatementAnswerOptions,
  isKnownThreeStatementSemanticKey,
  renderThreeStatementSemanticLabel,
  type DsfCp015ThreeStatementSemanticKey,
} from "../DSF-CP-015/three-statement-answer-profile.ts";

export const DSF_CP020_NUM_QL002_RUNTIME_VERSION = "DSF_CP020_NUM_QL002_RUNTIME_V1" as const;
export const DSF_CP020_CHECKPOINT_ID = "DSF-CP-020" as const;

const TEMPLATES = ["42X", "57X", "63X", "84X", "91X", "36X", "72X", "48X"] as const;
type Template = (typeof TEMPLATES)[number];

type NumberWorld = Readonly<{
  digit: number;
  numeral: string;
  value: bigint;
}>;

type NumberProblem = Readonly<{
  template: Template;
  anchorDigit: number;
}>;

type StatementFamily =
  | "NUMBER_DIVISIBILITY"
  | "DIGIT_PARITY"
  | "DIGIT_PRIMALITY"
  | "DIGIT_BOUND"
  | "DIGIT_MULTIPLE";

type NumberStatement = Readonly<{
  id: string;
  family: StatementFamily;
  text: string;
  test: (world: NumberWorld) => boolean;
}>;

type CandidateTriple = Readonly<{
  statementI: NumberStatement;
  statementII: NumberStatement;
  statementIII: NumberStatement;
  evaluation: ThreeStatementSufficiencyEvaluation<number>;
  semanticKey: DsfCp015ThreeStatementSemanticKey;
  quality: number;
}>;

const PRIME_DIGITS = new Set([2, 3, 5, 7]);

function stableHash(text: string): number {
  let hash = 2166136261;
  for (const character of text) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function randomIndex(seed: string, length: number): number {
  if (length <= 0) throw new Error("CP020 cannot pick from an empty candidate set.");
  return stableHash(seed) % length;
}

function worldsFor(template: Template): readonly NumberWorld[] {
  return Object.freeze(Array.from({ length: 10 }, (_, digit) => {
    const numeral = fillSingleDigit(template, digit);
    return Object.freeze({ digit, numeral, value: numeralToBigInt(numeral) });
  }));
}

const WORLD_CACHE = new Map<Template, readonly NumberWorld[]>();

function baseWorlds(problem: NumberProblem): readonly NumberWorld[] {
  let worlds = WORLD_CACHE.get(problem.template);
  if (!worlds) {
    worlds = worldsFor(problem.template);
    WORLD_CACHE.set(problem.template, worlds);
  }
  return worlds;
}

const adapter = {
  adapterId: "DSF-CP020-NUM-001-THREE-STATEMENT-BATCH-V1",
  domainFamily: "QUANT" as const,
  sourceChapterId: "NUM-001",
  enumerateBaseWorlds: (problem: NumberProblem) => baseWorlds(problem),
  statementHolds: (_problem: NumberProblem, world: NumberWorld, statement: NumberStatement) => statement.test(world),
  evaluateTarget: (_problem: NumberProblem, world: NumberWorld) => world.digit,
  normalizeAnswer: (answer: number) => String(answer),
};

function statement(
  id: string,
  family: StatementFamily,
  text: string,
  test: (world: NumberWorld) => boolean,
): NumberStatement {
  return Object.freeze({ id, family, text, test });
}

function statementUniverse(): readonly NumberStatement[] {
  const statements: NumberStatement[] = [];

  for (const divisor of [2n, 3n, 4n, 5n, 6n, 8n, 9n] as const) {
    statements.push(statement(
      `NUMBER_DIVISIBLE_${divisor}`,
      "NUMBER_DIVISIBILITY",
      `The completed number is divisible by ${divisor}.`,
      (world) => isDivisible(world.value, divisor),
    ));
  }

  statements.push(
    statement("DIGIT_EVEN", "DIGIT_PARITY", "X is an even digit.", (world) => world.digit % 2 === 0),
    statement("DIGIT_ODD", "DIGIT_PARITY", "X is an odd digit.", (world) => world.digit % 2 === 1),
    statement("DIGIT_PRIME", "DIGIT_PRIMALITY", "X is a prime digit.", (world) => PRIME_DIGITS.has(world.digit)),
    statement("DIGIT_NOT_PRIME", "DIGIT_PRIMALITY", "X is not a prime digit.", (world) => !PRIME_DIGITS.has(world.digit)),
  );

  for (const bound of [3, 5, 7, 9] as const) {
    statements.push(statement(
      `DIGIT_LT_${bound}`,
      "DIGIT_BOUND",
      `X is less than ${bound}.`,
      (world) => world.digit < bound,
    ));
  }
  for (const bound of [1, 3, 5, 7] as const) {
    statements.push(statement(
      `DIGIT_GE_${bound}`,
      "DIGIT_BOUND",
      `X is at least ${bound}.`,
      (world) => world.digit >= bound,
    ));
  }

  statements.push(
    statement("DIGIT_MULTIPLE_3", "DIGIT_MULTIPLE", "X is a multiple of 3.", (world) => world.digit % 3 === 0),
    statement("DIGIT_NOT_MULTIPLE_3", "DIGIT_MULTIPLE", "X is not a multiple of 3.", (world) => world.digit % 3 !== 0),
  );

  return Object.freeze(statements);
}

const STATEMENT_UNIVERSE = statementUniverse();
const CANDIDATE_CACHE = new Map<string, readonly CandidateTriple[]>();

function candidateQuality(
  statementI: NumberStatement,
  statementII: NumberStatement,
  statementIII: NumberStatement,
  evaluation: ThreeStatementSufficiencyEvaluation<number>,
): number {
  const familyCount = new Set([statementI.family, statementII.family, statementIII.family]).size;
  const statementBreadths = [statementI, statementII, statementIII].map((s) =>
    evaluation.subsetEvaluations.find((entry) => entry.statementIds.length === 1
      && entry.statementIds[0] === (s === statementI ? "I" : s === statementII ? "II" : "III"))?.result.worldCount ?? 0
  );
  const breadthScore = statementBreadths.reduce((sum, count) => sum + Math.min(count, 7), 0);
  const minimalSizeScore = evaluation.minimalSufficientSets.reduce((sum, subset) => sum + subset.length, 0);
  return familyCount * 10 + breadthScore + minimalSizeScore;
}

function candidateTriples(problem: NumberProblem): readonly CandidateTriple[] {
  const cacheKey = `${problem.template}:${problem.anchorDigit}`;
  const cached = CANDIDATE_CACHE.get(cacheKey);
  if (cached) return cached;

  const anchor = baseWorlds(problem).find((world) => world.digit === problem.anchorDigit);
  if (!anchor) throw new Error(`CP020 missing anchor digit ${problem.anchorDigit}.`);

  const trueStatements = STATEMENT_UNIVERSE.filter((candidate) => candidate.test(anchor));
  const triples: CandidateTriple[] = [];

  for (let i = 0; i < trueStatements.length; i += 1) {
    for (let j = 0; j < trueStatements.length; j += 1) {
      if (j === i) continue;
      for (let k = 0; k < trueStatements.length; k += 1) {
        if (k === i || k === j) continue;
        const statementI = trueStatements[i]!;
        const statementII = trueStatements[j]!;
        const statementIII = trueStatements[k]!;
        if (new Set([statementI.family, statementII.family, statementIII.family]).size < 2) continue;

        try {
          const evaluation = evaluateFiniteDomainTriple(adapter, problem, statementI, statementII, statementIII);
          if (!isKnownThreeStatementSemanticKey(evaluation.semanticKey)) continue;
          triples.push(Object.freeze({
            statementI,
            statementII,
            statementIII,
            evaluation,
            semanticKey: evaluation.semanticKey,
            quality: candidateQuality(statementI, statementII, statementIII, evaluation),
          }));
        } catch {
          // Reject invalid/inconsistent candidates.
        }
      }
    }
  }

  const bestByIdentity = new Map<string, CandidateTriple>();
  for (const triple of triples) {
    const identity = `${triple.semanticKey}|${triple.statementI.id}|${triple.statementII.id}|${triple.statementIII.id}`;
    const current = bestByIdentity.get(identity);
    if (!current || triple.quality > current.quality) bestByIdentity.set(identity, triple);
  }

  const result = Object.freeze([...bestByIdentity.values()]);
  if (!result.length) throw new Error(`CP020 produced no valid triples for ${cacheKey}.`);
  CANDIDATE_CACHE.set(cacheKey, result);
  return result;
}

function selectProblem(seed: string, attempt: number): NumberProblem {
  const template = TEMPLATES[randomIndex(`${seed}:template:${attempt}`, TEMPLATES.length)]!;
  const anchorDigit = randomIndex(`${seed}:digit:${attempt}`, 10);
  return Object.freeze({ template, anchorDigit });
}

function semanticBreadthForProblem(problem: NumberProblem): readonly DsfCp015ThreeStatementSemanticKey[] {
  return Object.freeze([...new Set(candidateTriples(problem).map((triple) => triple.semanticKey))].sort());
}

function selectTriple(seed: string): Readonly<{ problem: NumberProblem; triple: CandidateTriple }> {
  let best: { problem: NumberProblem; candidates: readonly CandidateTriple[]; semanticCount: number } | undefined;

  for (let attempt = 0; attempt < 80; attempt += 1) {
    const problem = selectProblem(seed, attempt);
    const candidates = candidateTriples(problem);
    const semanticCount = new Set(candidates.map((candidate) => candidate.semanticKey)).size;
    if (!best || semanticCount > best.semanticCount) best = { problem, candidates, semanticCount };
    if (semanticCount >= 5) {
      const keys = [...new Set(candidates.map((candidate) => candidate.semanticKey))].sort();
      const desired = keys[randomIndex(`${seed}:semantic:${attempt}`, keys.length)]!;
      const matching = candidates.filter((candidate) => candidate.semanticKey === desired);
      const topQuality = Math.max(...matching.map((candidate) => candidate.quality));
      const shortlist = matching.filter((candidate) => candidate.quality >= topQuality - 2);
      return Object.freeze({
        problem,
        triple: shortlist[randomIndex(`${seed}:triple:${attempt}`, shortlist.length)]!,
      });
    }
  }

  if (!best) throw new Error("CP020 could not synthesize a Number System three-statement problem.");
  const topQuality = Math.max(...best.candidates.map((candidate) => candidate.quality));
  const shortlist = best.candidates.filter((candidate) => candidate.quality >= topQuality - 2);
  return Object.freeze({
    problem: best.problem,
    triple: shortlist[randomIndex(`${seed}:fallback`, shortlist.length)]!,
  });
}

function subsetResult(
  evaluation: ThreeStatementSufficiencyEvaluation<number>,
  ids: readonly ("I" | "II" | "III")[],
) {
  return evaluation.subsetEvaluations.find((entry) =>
    entry.statementIds.length === ids.length && ids.every((id) => entry.statementIds.includes(id))
  )?.result;
}

function explanationFor(
  problem: NumberProblem,
  triple: CandidateTriple,
): string {
  const singleI = subsetResult(triple.evaluation, ["I"]);
  const singleII = subsetResult(triple.evaluation, ["II"]);
  const singleIII = subsetResult(triple.evaluation, ["III"]);
  const describe = (label: string, result: typeof singleI) => {
    if (!result) return `${label}: no evaluation.`;
    if (result.sufficient) return `${label} alone fixes X = ${result.normalizedTargetAnswers[0]}.`;
    const sample = result.normalizedTargetAnswers.slice(0, 3).join(", ");
    return `${label} alone leaves multiple possible digits${sample ? ` such as ${sample}` : ""}.`;
  };
  return [
    `We need the digit X in ${problem.template}.`,
    describe("Statement I", singleI),
    describe("Statement II", singleII),
    describe("Statement III", singleIII),
    `The minimal sufficient statement set is classified as ${renderThreeStatementSemanticLabel(triple.semanticKey)}`,
  ].join(" ");
}

export interface DsfCp020NumberSystemQuestion {
  readonly packageId: "DSF-001";
  readonly checkpointId: "DSF-CP-020";
  readonly qlId: "DSF-QL-002";
  readonly language: "en";
  readonly locale: "en-IN";
  readonly statementCount: 3;
  readonly semanticKey: DsfCp015ThreeStatementSemanticKey;
}

export function generateDsfCp020NumberSystemQuestion(seed: string | number): DsfCp020NumberSystemQuestion & Readonly<Record<string, any>> {
  const seedText = String(seed);
  const { problem, triple } = selectTriple(seedText);
  const answerOptions = buildThreeStatementAnswerOptions(triple.semanticKey, stableHash(seedText));
  const correctIndex = answerOptions.findIndex((option) => option.isCorrect);
  const generationIdentity = createHash("sha256")
    .update(`${DSF_CP020_NUM_QL002_RUNTIME_VERSION}|${seedText}|${problem.template}|${problem.anchorDigit}|${triple.statementI.id}|${triple.statementII.id}|${triple.statementIII.id}`)
    .digest("hex")
    .slice(0, 24);

  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: DSF_CP020_CHECKPOINT_ID,
    qlId: "DSF-QL-002" as const,
    runtimeVersion: DSF_CP020_NUM_QL002_RUNTIME_VERSION,
    language: "en" as const,
    locale: "en-IN" as const,
    seed: seedText,
    sourceChapterId: "NUM-001" as const,
    sourceCapability: "NUM-001/foundation/divisibility" as const,
    taskContract: "THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS" as const,
    answerSemantic: "MINIMAL_SUFFICIENT_STATEMENT_SUBSET" as const,
    statementCount: 3 as const,
    problemTemplate: problem.template,
    anchorDigit: problem.anchorDigit,
    stem: `What digit does X represent in the number ${problem.template}?`,
    questionPrompt: `What digit does X represent in ${problem.template}?`,
    statements: Object.freeze([
      Object.freeze({ id: "I" as const, statementRuleId: triple.statementI.id, statementFamily: triple.statementI.family, text: triple.statementI.text }),
      Object.freeze({ id: "II" as const, statementRuleId: triple.statementII.id, statementFamily: triple.statementII.family, text: triple.statementII.text }),
      Object.freeze({ id: "III" as const, statementRuleId: triple.statementIII.id, statementFamily: triple.statementIII.family, text: triple.statementIII.text }),
    ] as const),
    options: answerOptions,
    correctIndex,
    canonicalAnswer: triple.semanticKey,
    semanticKey: triple.semanticKey,
    explanation: explanationFor(problem, triple),
    proof: Object.freeze({
      baseWorldCount: triple.evaluation.base.worldCount,
      subsetEvaluations: triple.evaluation.subsetEvaluations.map((entry) => Object.freeze({
        statementIds: entry.statementIds,
        worldCount: entry.result.worldCount,
        sufficient: entry.result.sufficient,
        normalizedTargetAnswers: entry.result.normalizedTargetAnswers,
      })),
      minimalSufficientSets: triple.evaluation.minimalSufficientSets,
      allThreeWorldCount: triple.evaluation.allThree.worldCount,
      allThreeSufficient: triple.evaluation.allThree.sufficient,
      semanticKey: triple.semanticKey,
      semanticBreadthAtAnchor: semanticBreadthForProblem(problem),
    }),
    generationIdentity,
    lifecycle: Object.freeze({
      contentStatus: "CP020_QL002_NUMBER_SYSTEM_BATCH_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}

export function generateDsfCp020NumberSystemBatch(seed: string, count = 10) {
  const safeCount = Math.min(50, Math.max(1, Math.floor(count)));
  return Object.freeze(Array.from({ length: safeCount }, (_, index) =>
    generateDsfCp020NumberSystemQuestion(`${seed}:${index}`)
  ));
}
