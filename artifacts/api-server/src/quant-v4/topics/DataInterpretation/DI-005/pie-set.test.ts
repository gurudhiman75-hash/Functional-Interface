import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateDi005PieSet,
  independentlyVerifyDi005QuestionSet,
  type Di005ExamProfile,
  type Di005TaskKind,
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

const profiles: readonly Di005ExamProfile[] = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"];
const taskKinds: readonly Di005TaskKind[] = [
  "MISSING_SECTOR_PERCENT",
  "SECTOR_ANGLE_DEGREES",
  "SECTOR_COUNT_FROM_TOTAL",
  "RATIO_OF_TWO_SECTORS",
  "RELATIVE_SECTOR_PERCENT_EXCESS",
];

const answerPositions = new Map<string, Set<number>>();
for (const profile of profiles) {
  for (const taskKind of taskKinds) answerPositions.set(`${profile}:${taskKind}`, new Set<number>());
}

const stimulusFingerprints = new Set<string>();
const hiddenIndexCoverage = new Set<number>();
const angleIndexCoverage = new Set<number>();
const countIndexCoverage = new Set<number>();
const ratioPairCoverage = new Set<string>();
const excessPairCoverage = new Set<string>();
const totalCoverage = new Set<number>();
let setCount = 0;
let questionCount = 0;
let deterministicReplayChecks = 0;
let independentVerificationChecks = 0;
let optionChecks = 0;
let bankingFiveOptionChecks = 0;
let crossProfileStimulusChecks = 0;
let learnerSurfaceChecks = 0;

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `DI-005-PHASE4-${seedIndex}`;
  const byProfile = new Map<Di005ExamProfile, ReturnType<typeof generateDi005PieSet>>();

  for (const profile of profiles) {
    const first = generateDi005PieSet({ seed, examProfile: profile });
    const replay = generateDi005PieSet({ seed, examProfile: profile });

    assert(stable(first) === stable(replay), `${profile} ${seed} is not deterministic.`);
    deterministicReplayChecks += 1;

    assert(first.validation.valid, `${profile} ${seed} failed internal pie-chart validation.`);
    assert(independentlyVerifyDi005QuestionSet(first), `${profile} ${seed} failed independent pie-chart verification.`);
    independentVerificationChecks += first.questions.length;

    assert(first.stimulus.kind === "PIE", `${profile} ${seed} lost pie-chart semantics.`);
    assert(first.stimulus.slices.length === 5, `${profile} ${seed} must contain five pie sectors.`);
    assert(first.stimulus.slices.reduce((sum, slice) => sum + slice.percent, 0) === 100, `${profile} ${seed} sector shares do not total 100%.`);
    assert(first.stimulus.slices.reduce((sum, slice) => sum + slice.angleDegrees, 0) === 360, `${profile} ${seed} sector angles do not total 360°.`);
    assert(new Set(first.stimulus.slices.map((slice) => slice.percent)).size === 5, `${profile} ${seed} repeated a sector share.`);
    assert(first.stimulus.slices.filter((slice) => slice.displayPercent === "?").length === 1, `${profile} ${seed} must hide exactly one sector percentage.`);
    assert(first.questions.length === 5, `${profile} ${seed} did not create five linked questions.`);
    assert(new Set(first.questions.map((question) => question.setId)).size === 1, `${profile} ${seed} lost shared set identity.`);
    assert(new Set(first.questions.map((question) => question.questionId)).size === 5, `${profile} ${seed} repeated a child question ID.`);
    assert(new Set(first.questions.map((question) => question.kind)).size === 5, `${profile} ${seed} repeated a pie-chart task kind.`);
    assert(taskKinds.every((taskKind) => first.questions.some((question) => question.kind === taskKind)), `${profile} ${seed} is missing a required pie-chart task.`);

    assert(first.traceability.questionBankStatus === "NOT_STORED", `${profile} ${seed} leaked Question Bank eligibility.`);
    assert(first.traceability.testEligibility === "INELIGIBLE", `${profile} ${seed} leaked test eligibility.`);
    assert(!first.traceability.publiclyPublishable, `${profile} ${seed} leaked public publication.`);
    assert(!first.traceability.questionStudioDiscoverable, `${profile} ${seed} leaked Question Studio discovery.`);

    first.questions.forEach((question) => {
      assert(question.options.length === first.optionCount, `${question.questionId} has wrong option count.`);
      assert(question.optionMetadata.length === first.optionCount, `${question.questionId} option metadata count is wrong.`);
      assert(new Set(question.options).size === question.options.length, `${question.questionId} contains duplicate displayed options.`);
      assert(question.optionMetadata[question.correctIndex]?.misconceptionId === "CORRECT", `${question.questionId} correct-index metadata binding failed.`);
      assert(question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1, `${question.questionId} has multiple correct metadata entries.`);
      assert(question.options[question.correctIndex] === question.answer, `${question.questionId} answer does not match the correct option.`);
      assert(question.options.filter((option) => option === question.answer).length === 1, `${question.questionId} displays the answer more than once.`);
      assert(question.optionMetadata.every((option) => option.derivation.length >= 20), `${question.questionId} contains an under-explained option.`);
      assert(question.explanation.keyIdea.length >= 40, `${question.questionId} key idea is too thin.`);
      assert(question.explanation.steps.length >= 2, `${question.questionId} does not have enough worked steps.`);
      assert(question.explanation.shortcut.length >= 25, `${question.questionId} shortcut is too thin.`);
      assert(question.explanation.trap.length >= 30, `${question.questionId} trap guidance is too thin.`);
      assert(!/mock[- ]?test problem|textbook problem|competitive[- ]exam problem|template|generator|question library|ql[- ]?id/iu.test(question.stem), `${question.questionId} leaks internal/editorial language.`);

      answerPositions.get(`${profile}:${question.kind}`)!.add(question.correctIndex);
      if (question.kind === "SECTOR_ANGLE_DEGREES") angleIndexCoverage.add(question.evidence.categoryIndex!);
      if (question.kind === "SECTOR_COUNT_FROM_TOTAL") countIndexCoverage.add(question.evidence.categoryIndex!);
      if (question.kind === "RATIO_OF_TWO_SECTORS") ratioPairCoverage.add(`${question.evidence.firstIndex}:${question.evidence.secondIndex}`);
      if (question.kind === "RELATIVE_SECTOR_PERCENT_EXCESS") excessPairCoverage.add(`${question.evidence.largerIndex}:${question.evidence.smallerIndex}`);
      if (profile === "BANKING_PRELIMS") bankingFiveOptionChecks += question.options.length === 5 ? 1 : 0;
      optionChecks += question.options.length;
      learnerSurfaceChecks += 1;
      questionCount += 1;
    });

    hiddenIndexCoverage.add(first.stimulus.hiddenPercentIndex);
    totalCoverage.add(first.stimulus.totalStudents);
    stimulusFingerprints.add(stable(first.stimulus));
    byProfile.set(profile, first);
    setCount += 1;
  }

  const ssc = byProfile.get("SSC_CGL_TIER_I")!;
  const banking = byProfile.get("BANKING_PRELIMS")!;
  assert(stable(ssc.stimulus) === stable(banking.stimulus), `Exam profile changed the pie stimulus for ${seed}.`);
  assert(ssc.optionCount === 4, `SSC ${seed} must expose four options.`);
  assert(banking.optionCount === 5, `Banking ${seed} must expose five options.`);
  crossProfileStimulusChecks += 1;
}

assert(stimulusFingerprints.size >= 95, `DI-005 produced only ${stimulusFingerprints.size} distinct pie stimuli across 100 seeds.`);
assert(hiddenIndexCoverage.size === 5, `DI-005 missing-sector task did not hide all five sectors: ${[...hiddenIndexCoverage].sort()}.`);
assert(angleIndexCoverage.size === 5, `DI-005 angle task did not reach all five sectors: ${[...angleIndexCoverage].sort()}.`);
assert(countIndexCoverage.size === 5, `DI-005 count task did not reach all five sectors: ${[...countIndexCoverage].sort()}.`);
assert(ratioPairCoverage.size >= 12, `DI-005 ratio task reached only ${ratioPairCoverage.size} ordered sector pairs.`);
assert(excessPairCoverage.size >= 8, `DI-005 relative-excess task reached only ${excessPairCoverage.size} ordered larger/smaller pairs.`);
assert(totalCoverage.size === 6, `DI-005 total-student pool coverage reached only ${[...totalCoverage].sort()}.`);
assert(bankingFiveOptionChecks === 500, `DI-005 completed only ${bankingFiveOptionChecks}/500 Banking five-option child checks.`);

for (const profile of profiles) {
  const expectedPositionCount = profile === "SSC_CGL_TIER_I" ? 4 : 5;
  for (const taskKind of taskKinds) {
    const positions = answerPositions.get(`${profile}:${taskKind}`)!;
    assert(
      positions.size === expectedPositionCount,
      `${profile}:${taskKind} reached only answer positions ${[...positions].sort()} instead of all ${expectedPositionCount}.`,
    );
  }
}

const scope = dirname(fileURLToPath(import.meta.url));
const forbiddenRandomToken = "Math" + ".random(";
for (const file of walkFiles(scope).filter((path) => path.endsWith(".ts"))) {
  const source = readFileSync(file, "utf8");
  assert(!source.includes(forbiddenRandomToken), `Non-deterministic random source is prohibited in DI-005: ${file}`);
}

console.log(JSON.stringify({
  status: "PASS_DI_005_PIE_PHASE4",
  sets: setCount,
  questions: questionCount,
  deterministicReplayChecks,
  independentVerificationChecks,
  optionChecks,
  bankingFiveOptionChecks,
  crossProfileStimulusChecks,
  learnerSurfaceChecks,
  distinctStimuli: stimulusFingerprints.size,
  hiddenIndexCoverage: [...hiddenIndexCoverage].sort(),
  angleIndexCoverage: [...angleIndexCoverage].sort(),
  countIndexCoverage: [...countIndexCoverage].sort(),
  ratioPairCoverage: ratioPairCoverage.size,
  excessPairCoverage: excessPairCoverage.size,
  totalCoverage: [...totalCoverage].sort(),
  answerPositionCoverage: Object.fromEntries([...answerPositions].map(([key, positions]) => [key, [...positions].sort()])),
}));