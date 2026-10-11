import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateBns001Question,
  independentlyVerifyBns001Question,
  independentGrammarMatches,
  independentWrongTermRepairs,
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

let wrongTermChecks = 0;
for (const patternKind of patterns) {
  const positions = new Set<number>();
  const answerIndexes = new Set<number>();
  for (let i = 0; i < 100; i += 1) {
    const input = { seed: `BNS-WRONG-${patternKind}-${i}`, taskKind: "WRONG_TERM" as const, patternKind };
    const question = generateBns001Question(input);
    assert(stable(question) === stable(generateBns001Question(input)), "Wrong-term replay changed.");
    assert(question.visibleSeries.length === 8, "Wrong-term proof requires eight visible terms.");
    assert(independentlyVerifyBns001Question(question).valid, "Wrong-term independent verification failed.");
    const repairs = independentWrongTermRepairs(question.visibleSeries.map(Number));
    assert(repairs.length === 1, "Wrong-term series has multiple admissible repairs.");
    assert(question.answer === String(question.visibleSeries[repairs[0]!.index]), "Wrong-term answer must identify the displayed error.");
    assert(question.answer !== String(repairs[0]!.replacement), "Wrong-term answer confuses error and replacement.");
    assert(question.options.every((n) => question.visibleSeries.includes(Number(n))), "Wrong-term choices must be displayed terms.");
    assert(new Set(question.options).size === 5, "Wrong-term options contain duplicates.");
    assert(question.explanation.working.some((line) => line.includes("replace it with")), "Wrong-term explanation lacks replacement.");
    const forged = { ...question, proof: { ...question.proof, fullSeries: Array(9).fill(999), canonicalNext: -1 } };
    assert(independentlyVerifyBns001Question(forged).valid, "Verifier improperly trusts generator arithmetic proof.");
    const damaged = { ...question, visibleSeries: question.visibleSeries.map((n, index) => index === 0 ? Number(n) + 101 : n) };
    assert(!independentlyVerifyBns001Question(damaged).valid, "Verifier accepted two corrupted terms.");
    positions.add(question.proof.hiddenIndex!);
    answerIndexes.add(question.correctIndex);
    wrongTermChecks += 1;
  }
  assert(positions.size === 3 && answerIndexes.size === 5, "Wrong-term positions or answer indexes lack coverage.");
}
assert(independentWrongTermRepairs([12, 41, 18, 47, 26, 53]).length === 0, "Six-term wrong-series package must not pass the unique-repair contract.");

let localizedChecks = 0;
for (const patternKind of patterns) {
  for (const taskKind of [...tasks, "WRONG_TERM"] as const) {
    for (let i = 0; i < 32; i += 1) {
      const input = { seed: `BNS-NATIVE-${patternKind}-${taskKind}-${i}`, taskKind, patternKind };
      const english = generateBns001Question(input);
      for (const language of ["hi", "pa"] as const) {
        const native = generateBns001Question({ ...input, language });
        assert(stable(native.options) === stable(english.options) && native.answer === english.answer,
          "Localization changed mathematical options or answer.");
        assert(independentlyVerifyBns001Question(native).valid, "Native question failed independent verification.");
        assert(stable(native) === stable(generateBns001Question({ ...input, language })), "Native replay changed.");
        const text = native.stem + native.explanation.keyRule + native.explanation.working.join(" ") + native.explanation.trap;
        assert(!/[A-Za-z]/u.test(text), "Native learner text contains English fallback.");
        assert(native.explanation.working.length >= 2 && /[=]/u.test(text), "Native explanation lacks calculations.");
        localizedChecks += 1;
      }
    }
  }
}
// Publisher practice examples, independently adjudicated; these are not PYQs.
for (const series of [[49,71,100,136,179,229], [38,45,53,62,72,83]]) {
  assert(independentGrammarMatches(series).includes("PROGRESSIVE_DIFFERENCE"), "Source progressive-difference fixture failed.");
}

const scope = dirname(fileURLToPath(import.meta.url));
// These packages retain the mathematically correct answer but violate the
// learner contract. The independent verifier must reject them nonetheless.
const missingFixture = generateBns001Question({ seed: "BNS-SHAPE-REGRESSION", taskKind: "MISSING_TERM" });
const wrongIndex = missingFixture.options.findIndex((_option, index) => index !== missingFixture.correctIndex);
const malformedFixtures = [
  { ...missingFixture, options: missingFixture.options.filter((_option, index) => index !== wrongIndex) },
  { ...missingFixture, options: [...missingFixture.options, "999999"] },
  { ...missingFixture, optionCount: 4 },
  { ...missingFixture, taskKind: "UNKNOWN_TASK" },
  { ...missingFixture, proof: { ...missingFixture.proof, hiddenIndex: 0 } },
  { ...missingFixture, visibleSeries: [...missingFixture.visibleSeries, 999] },
];
for (const fixture of malformedFixtures) {
  assert(!independentlyVerifyBns001Question(fixture as typeof missingFixture).valid,
    "Independent BNS verifier accepted a malformed learner package with a correct mathematical answer.");
}
for (const input of [{ taskKind: "UNKNOWN_TASK" }, { patternKind: "UNKNOWN_GRAMMAR" }]) {
  let rejected = false;
  try { generateBns001Question(input as Parameters<typeof generateBns001Question>[0]); }
  catch (error) { rejected = error instanceof Error && /unsupported/u.test(error.message); }
  assert(rejected, "BNS generation must reject unsupported selectors before emitting learner content.");
}
const forbiddenRandomToken = "Math" + ".random(";
for (const file of walkFiles(scope).filter((path) => path.endsWith(".ts"))) {
  const source = readFileSync(file, "utf8");
  assert(!source.includes(forbiddenRandomToken), `Non-deterministic random source is prohibited in BNS-001: ${file}`);
}

console.log(JSON.stringify({
  status: "PASS_BNS_001_CONTENT_REVIEW_V2",
  questions: questionCount,
  wrongTermChecks,
  localizedChecks,
  totalQuestions: questionCount + wrongTermChecks,
  deterministicReplayChecks,
  independentVerificationChecks,
  distractorGrammarChecks,
  internalIndependentParityChecks,
  families: patterns.length * tasks.length,
  malformedPackageRejections: malformedFixtures.length,
  answerPositionCoverage: Object.fromEntries([...answerPositions].map(([key, value]) => [key, [...value].sort()])),
  hiddenPositionCoverage: Object.fromEntries([...hiddenPositions].map(([key, value]) => [key, [...value].sort()])),
  distinctVisibleStates: Object.fromEntries([...fingerprints].map(([key, value]) => [key, value.size])),
}));
