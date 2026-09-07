import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateDi008ArithmeticSet,
  independentlyVerifyDi008QuestionSet,
  type Di008ExamProfile,
  type Di008TaskKind,
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

const profiles: readonly Di008ExamProfile[] = ["BANKING_PRELIMS", "BANKING_MAINS"];
const taskKinds: readonly Di008TaskKind[] = [
  "UNITS_PERCENT_CHANGE",
  "REVENUE_RATIO",
  "PROFIT_PERCENT",
  "AVERAGE_PROFIT_PER_PRODUCT",
  "REVENUE_SHARE_OF_TOTAL",
];

const answerPositions = new Map<string, Set<number>>();
const primaryRoleCoverage = new Map<string, Set<number>>();
for (const profile of profiles) {
  for (const taskKind of taskKinds) {
    answerPositions.set(`${profile}:${taskKind}`, new Set<number>());
    primaryRoleCoverage.set(`${profile}:${taskKind}`, new Set<number>());
  }
}
const secondaryRatioCoverage = new Map<Di008ExamProfile, Set<number>>([
  ["BANKING_PRELIMS", new Set<number>()],
  ["BANKING_MAINS", new Set<number>()],
]);

const stimulusFingerprints = new Set<string>();
const growthRateCoverage = new Set<number>();
const profitRateCoverage = new Set<number>();
let setCount = 0;
let questionCount = 0;
let deterministicReplayChecks = 0;
let independentVerificationChecks = 0;
let optionChecks = 0;
let fiveOptionChecks = 0;
let crossProfileStimulusChecks = 0;
let learnerSurfaceChecks = 0;
let mainsMultirowTaskChecks = 0;
let prelimsDirectTaskChecks = 0;

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `DI-008-PHASE7-${seedIndex}`;
  const byProfile = new Map<Di008ExamProfile, ReturnType<typeof generateDi008ArithmeticSet>>();

  for (const profile of profiles) {
    const first = generateDi008ArithmeticSet({ seed, examProfile: profile });
    const replay = generateDi008ArithmeticSet({ seed, examProfile: profile });

    assert(stable(first) === stable(replay), `${profile} ${seed} is not deterministic.`);
    deterministicReplayChecks += 1;
    assert(first.validation.valid, `${profile} ${seed} failed internal Arithmetic DI validation.`);
    assert(independentlyVerifyDi008QuestionSet(first), `${profile} ${seed} failed independent Arithmetic DI verification.`);
    independentVerificationChecks += first.questions.length;

    assert(first.stimulus.kind === "ARITHMETIC_TABLE", `${profile} ${seed} lost Arithmetic DI semantics.`);
    assert(first.stimulus.rows.length === 5, `${profile} ${seed} must contain five product rows.`);
    assert(first.questions.length === 5, `${profile} ${seed} did not create five linked questions.`);
    assert(new Set(first.questions.map((question) => question.questionId)).size === 5, `${profile} ${seed} repeated a question ID.`);
    assert(new Set(first.questions.map((question) => question.setId)).size === 1, `${profile} ${seed} lost shared set identity.`);
    assert(new Set(first.questions.map((question) => question.kind)).size === 5, `${profile} ${seed} repeated a task kind.`);
    assert(first.optionCount === 5, `${profile} ${seed} must expose five options.`);
    assert(first.traceability.questionBankStatus === "NOT_STORED", `${profile} ${seed} leaked Question Bank eligibility.`);
    assert(first.traceability.testEligibility === "INELIGIBLE", `${profile} ${seed} leaked test eligibility.`);
    assert(!first.traceability.publiclyPublishable, `${profile} ${seed} leaked public publication.`);
    assert(!first.traceability.questionStudioDiscoverable, `${profile} ${seed} leaked Question Studio discovery.`);

    first.stimulus.rows.forEach((row) => {
      growthRateCoverage.add(((row.unitsCurrent - row.unitsPrevious) * 100) / row.unitsPrevious);
      profitRateCoverage.add(((row.sellingPricePerUnit - row.costPerUnit) * 100) / row.costPerUnit);
    });

    for (const question of first.questions) {
      assert(question.options.length === 5, `${question.questionId} has wrong option count.`);
      assert(question.optionMetadata.length === 5, `${question.questionId} option metadata count is wrong.`);
      assert(new Set(question.options).size === 5, `${question.questionId} has duplicate displayed options.`);
      assert(question.options[question.correctIndex] === question.answer, `${question.questionId} correct option binding failed.`);
      assert(question.optionMetadata[question.correctIndex]?.misconceptionId === "CORRECT", `${question.questionId} correct metadata binding failed.`);
      assert(question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1, `${question.questionId} has multiple correct metadata entries.`);
      assert(question.options.filter((option) => option === question.answer).length === 1, `${question.questionId} displays the answer more than once.`);
      assert(question.optionMetadata.every((option) => option.derivation.length >= 24), `${question.questionId} has an under-explained distractor.`);
      assert(question.explanation.keyIdea.length >= 50, `${question.questionId} key idea is too thin.`);
      assert(question.explanation.steps.length >= 2, `${question.questionId} lacks worked steps.`);
      assert(question.explanation.shortcut.length >= 35, `${question.questionId} shortcut is too thin.`);
      assert(question.explanation.trap.length >= 30, `${question.questionId} trap guidance is too thin.`);
      assert(!/mock[- ]?test problem|textbook problem|competitive[- ]exam problem|template|generator|question library|ql[- ]?id/iu.test(question.stem), `${question.questionId} leaks internal/editorial language.`);

      answerPositions.get(`${profile}:${question.kind}`)!.add(question.correctIndex);
      question.evidence.primaryIndices.forEach((index) => primaryRoleCoverage.get(`${profile}:${question.kind}`)!.add(index));
      if (question.kind === "REVENUE_RATIO") {
        question.evidence.secondaryIndices?.forEach((index) => secondaryRatioCoverage.get(profile)!.add(index));
      }

      if (profile === "BANKING_MAINS" && question.kind !== "AVERAGE_PROFIT_PER_PRODUCT") {
        assert(question.evidence.primaryIndices.length >= 2, `${question.questionId} Mains task collapsed to a single-row calculation.`);
        mainsMultirowTaskChecks += 1;
      }
      if (profile === "BANKING_MAINS" && question.kind === "AVERAGE_PROFIT_PER_PRODUCT") {
        assert(question.evidence.primaryIndices.length === 4, `${question.questionId} Mains average must aggregate four products.`);
        mainsMultirowTaskChecks += 1;
      }
      if (profile === "BANKING_PRELIMS" && ["UNITS_PERCENT_CHANGE", "PROFIT_PERCENT", "REVENUE_SHARE_OF_TOTAL"].includes(question.kind)) {
        assert(question.evidence.primaryIndices.length === 1, `${question.questionId} Prelims direct task unexpectedly aggregates multiple products.`);
        prelimsDirectTaskChecks += 1;
      }

      optionChecks += 5;
      fiveOptionChecks += 1;
      learnerSurfaceChecks += 1;
      questionCount += 1;
    }

    stimulusFingerprints.add(stable(first.stimulus));
    byProfile.set(profile, first);
    setCount += 1;
  }

  const prelims = byProfile.get("BANKING_PRELIMS")!;
  const mains = byProfile.get("BANKING_MAINS")!;
  assert(stable(prelims.stimulus) === stable(mains.stimulus), `Exam profile changed the underlying Arithmetic DI stimulus for ${seed}.`);
  crossProfileStimulusChecks += 1;
}

assert(stimulusFingerprints.size >= 95, `DI-008 produced only ${stimulusFingerprints.size} distinct stimuli across 100 seeds.`);
assert(growthRateCoverage.size === 5, `DI-008 did not exercise all five configured growth rates: ${[...growthRateCoverage].sort((a, b) => a - b)}.`);
assert(profitRateCoverage.size === 5, `DI-008 did not exercise all five configured unit-profit rates: ${[...profitRateCoverage].sort((a, b) => a - b)}.`);
assert(fiveOptionChecks === 1000, `DI-008 completed only ${fiveOptionChecks}/1000 five-option child checks.`);
assert(mainsMultirowTaskChecks === 500, `DI-008 completed only ${mainsMultirowTaskChecks}/500 Mains aggregation checks.`);
assert(prelimsDirectTaskChecks === 300, `DI-008 completed only ${prelimsDirectTaskChecks}/300 Prelims direct-task checks.`);

for (const profile of profiles) {
  for (const taskKind of taskKinds) {
    const positions = answerPositions.get(`${profile}:${taskKind}`)!;
    assert(positions.size === 5, `${profile}:${taskKind} reached only answer positions ${[...positions].sort()} instead of all five.`);
    const roles = primaryRoleCoverage.get(`${profile}:${taskKind}`)!;
    assert(roles.size === 5, `${profile}:${taskKind} used only product indices ${[...roles].sort()} as primary roles.`);
  }
  assert(secondaryRatioCoverage.get(profile)!.size === 5, `${profile} revenue-ratio secondary side did not rotate across all five products.`);
}

const scope = dirname(fileURLToPath(import.meta.url));
const forbiddenRandomToken = "Math" + ".random(";
for (const file of walkFiles(scope).filter((path) => path.endsWith(".ts"))) {
  const source = readFileSync(file, "utf8");
  assert(!source.includes(forbiddenRandomToken), `Non-deterministic random source is prohibited in DI-008: ${file}`);
}

console.log(JSON.stringify({
  status: "PASS_DI_008_ARITHMETIC_PHASE7",
  sets: setCount,
  questions: questionCount,
  deterministicReplayChecks,
  independentVerificationChecks,
  optionChecks,
  fiveOptionChecks,
  crossProfileStimulusChecks,
  learnerSurfaceChecks,
  distinctStimuli: stimulusFingerprints.size,
  growthRateCoverage: [...growthRateCoverage].sort((a, b) => a - b),
  profitRateCoverage: [...profitRateCoverage].sort((a, b) => a - b),
  mainsMultirowTaskChecks,
  prelimsDirectTaskChecks,
  primaryRoleCoverage: Object.fromEntries([...primaryRoleCoverage].map(([key, values]) => [key, [...values].sort()])),
  answerPositionCoverage: Object.fromEntries([...answerPositions].map(([key, values]) => [key, [...values].sort()])),
}));