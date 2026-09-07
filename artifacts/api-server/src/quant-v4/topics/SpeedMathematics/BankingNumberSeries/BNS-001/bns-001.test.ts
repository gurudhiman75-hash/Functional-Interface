import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateBns001Question,
  independentlyVerifyBns001Question,
  independentGrammarMatches,
  supportedGrammarMatches,
  type Bns001PatternKind,
  type Bns001TaskKind,
} from "./index";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

function walkFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walkFiles(path) : [path];
  });
}

const patterns: readonly Bns001PatternKind[] = [
  "ARITHMETIC_DIFFERENCE",
  "PROGRESSIVE_DIFFERENCE",
  "GEOMETRIC_MULTIPLICATION",
  "MULTIPLY_AND_ADD",
  "INTERLEAVED_ARITHMETIC",
];
const tasks: readonly Bns001TaskKind[] = ["NEXT_TERM", "MISSING_TERM"];

const minimumDistinctVisibleStates: Readonly<Record<Bns001PatternKind, number>> = {
  ARITHMETIC_DIFFERENCE: 30,
  PROGRESSIVE_DIFFERENCE: 42,
  GEOMETRIC_MULTIPLICATION: 9,
  MULTIPLY_AND_ADD: 38,
  INTERLEAVED_ARITHMETIC: 65,
};

const answerPositions = new Map<string, Set<number>>();
const hiddenPositions = new Map<Bns001PatternKind, Set<number>>(
  patterns.map((pattern) => [pattern, new Set<number>()]),
);
const fingerprints = new Map<string, Set<string>>();
let questionCount = 0;
let deterministicReplayChecks = 0;
let independentVerificationChecks = 0;
let distractorGrammarChecks = 0;
let internalIndependentParityChecks = 0;

for (const patternKind of patterns) {
  for (const taskKind of tasks) {
    const familyKey = `${patternKind}:${taskKind}`;
    answerPositions.set(familyKey, new Set<number>());
    fingerprints.set(familyKey, new Set<string>());

    for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
      const seed = `BNS-001-PHASE0-${patternKind}-${taskKind}-${seedIndex}`;
      const first = generateBns001Question({ seed, patternKind, taskKind });
      const replay = generateBns001Question({ seed, patternKind, taskKind });

      assert(stable(first) === stable(replay), `${familyKey} seed ${seedIndex} is not deterministic.`);
      deterministicReplayChecks += 1;

      assert(first.examProfile === "BANKING_PRELIMS", `${first.questionId} lost Banking profile ownership.`);
      assert(first.optionCount === 5 && first.options.length === 5, `${first.questionId} must expose five options.`);
      assert(new Set(first.options).size === 5, `${first.questionId} contains duplicate displayed options.`);
      assert(first.optionMetadata.length === 5, `${first.questionId} option metadata is incomplete.`);
      assert(first.optionMetadata[first.correctIndex]?.misconceptionId === "CORRECT", `${first.questionId} correct-index binding is invalid.`);
      assert(first.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1, `${first.questionId} has multiple CORRECT metadata entries.`);
      assert(first.options[first.correctIndex] === first.answer, `${first.questionId} correct option does not equal the answer.`);
      assert(first.optionMetadata.every((option) => option.derivation.length >= 20), `${first.questionId} contains an under-explained option.`);
      assert(first.explanation.keyRule.length >= 20, `${first.questionId} key rule is too thin.`);
      assert(first.explanation.working.length >= 2, `${first.questionId} does not contain a worked explanation.`);
      assert(first.explanation.shortcut.length >= 20, `${first.questionId} shortcut is too thin.`);
      assert(first.explanation.trap.length >= 20, `${first.questionId} trap is too thin.`);
      assert(!/mock[- ]?test problem|textbook problem|competitive[- ]exam problem|template|generator/iu.test(first.stem), `${first.questionId} leaks generator/editorial language.`);
      assert(first.traceability.questionBankStatus === "NOT_STORED", `${first.questionId} leaked Question Bank eligibility.`);
      assert(first.traceability.testEligibility === "INELIGIBLE", `${first.questionId} leaked test eligibility.`);
      assert(!first.traceability.publiclyPublishable, `${first.questionId} leaked public publication.`);
      assert(!first.traceability.questionStudioDiscoverable, `${first.questionId} leaked Question Studio discovery.`);

      const independent = independentlyVerifyBns001Question(first);
      assert(independent.valid, `${first.questionId} failed the independent grammar verifier.`);
      independentVerificationChecks += 1;

      assert(
        stable([...supportedGrammarMatches(first.proof.fullSeries)].sort()) ===
          stable([...independentGrammarMatches(first.proof.fullSeries)].sort()),
        `${first.questionId} internal and independent grammar engines disagree on the canonical series.`,
      );
      internalIndependentParityChecks += 1;

      first.options.forEach((option, optionIndex) => {
        if (optionIndex === first.correctIndex) return;
        const candidate = Number(option);
        const completed = first.taskKind === "NEXT_TERM"
          ? [...first.visibleSeries.map(Number), candidate]
          : first.visibleSeries.map((value, index) => index === first.proof.hiddenIndex ? candidate : Number(value));
        assert(
          !independentGrammarMatches(completed).includes(first.patternKind),
          `${first.questionId} distractor ${option} independently satisfies ${first.patternKind}.`,
        );
        distractorGrammarChecks += 1;
      });

      if (first.taskKind === "MISSING_TERM") {
        assert(first.proof.hiddenIndex !== null, `${first.questionId} missing-term item has no hidden index.`);
        assert([2, 3, 4].includes(first.proof.hiddenIndex), `${first.questionId} hidden index is outside the Phase-0 contract.`);
        assert(first.visibleSeries[first.proof.hiddenIndex] === "?", `${first.questionId} question mark is not at the proof hidden index.`);
        hiddenPositions.get(patternKind)!.add(first.proof.hiddenIndex);
      } else {
        assert(first.proof.hiddenIndex === null, `${first.questionId} next-term item unexpectedly has a hidden index.`);
        assert(first.visibleSeries.length === 6, `${first.questionId} next-term item must show six source terms.`);
      }

      answerPositions.get(familyKey)!.add(first.correctIndex);
      fingerprints.get(familyKey)!.add(stable(first.visibleSeries));
      questionCount += 1;
    }
  }
}

for (const [familyKey, positions] of answerPositions) {
  assert(positions.size === 5, `${familyKey} did not reach all five correct-answer positions: ${[...positions].sort()}.`);
}
for (const patternKind of patterns) {
  const positions = hiddenPositions.get(patternKind)!;
  assert(positions.size === 3, `${patternKind} missing-term generation did not reach hidden positions 3, 4 and 5.`);
}
for (const [familyKey, states] of fingerprints) {
  const patternKind = familyKey.split(":")[0] as Bns001PatternKind;
  const minimum = minimumDistinctVisibleStates[patternKind];
  assert(states.size >= minimum, `${familyKey} produced only ${states.size} distinct visible states; Phase-0 floor is ${minimum}.`);
}

const scope = dirname(fileURLToPath(import.meta.url));
const forbiddenRandomToken = "Math" + ".random(";
for (const file of walkFiles(scope).filter((path) => path.endsWith(".ts"))) {
  const source = readFileSync(file, "utf8");
  assert(!source.includes(forbiddenRandomToken), `Non-deterministic random source is prohibited in BNS-001: ${file}`);
}

console.log(JSON.stringify({
  status: "PASS_BNS_001_BANKING_NUMBER_SERIES_PHASE0",
  questions: questionCount,
  deterministicReplayChecks,
  independentVerificationChecks,
  distractorGrammarChecks,
  internalIndependentParityChecks,
  families: patterns.length * tasks.length,
  answerPositionCoverage: Object.fromEntries([...answerPositions].map(([key, value]) => [key, [...value].sort()])),
  hiddenPositionCoverage: Object.fromEntries([...hiddenPositions].map(([key, value]) => [key, [...value].sort()])),
  distinctVisibleStates: Object.fromEntries([...fingerprints].map(([key, value]) => [key, value.size])),
}));
