import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateDi003GroupedBarSet,
  independentlyVerifyDi003QuestionSet,
  type Di003ExamProfile,
  type Di003TaskKind,
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

const profiles: readonly Di003ExamProfile[] = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"];
const taskKinds: readonly Di003TaskKind[] = [
  "CROSS_SERIES_DIFFERENCE",
  "COMBINED_CATEGORY_RATIO",
  "PERCENT_CHANGE_WITHIN_SERIES",
  "CATEGORY_SHARE_OF_SERIES_TOTAL",
  "TOTAL_SERIES_PERCENT_EXCESS",
];

const answerPositions = new Map<string, Set<number>>();
for (const profile of profiles) {
  for (const taskKind of taskKinds) {
    answerPositions.set(`${profile}:${taskKind}`, new Set<number>());
  }
}

const stimulusFingerprints = new Set<string>();
const differenceCategoryCoverage = new Set<number>();
const shareCategoryCoverage = new Set<number>();
let setCount = 0;
let questionCount = 0;
let deterministicReplayChecks = 0;
let independentVerificationChecks = 0;
let optionChecks = 0;
let crossProfileStimulusChecks = 0;
let learnerSurfaceChecks = 0;

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `DI-003-PHASE2-${seedIndex}`;
  const byProfile = new Map<Di003ExamProfile, ReturnType<typeof generateDi003GroupedBarSet>>();

  for (const profile of profiles) {
    const first = generateDi003GroupedBarSet({ seed, examProfile: profile });
    const replay = generateDi003GroupedBarSet({ seed, examProfile: profile });

    assert(stable(first) === stable(replay), `${profile} ${seed} is not deterministic.`);
    deterministicReplayChecks += 1;

    assert(first.validation.valid, `${profile} ${seed} failed internal grouped-bar validation.`);
    assert(independentlyVerifyDi003QuestionSet(first), `${profile} ${seed} failed independent grouped-bar verification.`);
    independentVerificationChecks += first.questions.length;

    assert(first.stimulus.kind === "GROUPED_BAR", `${profile} ${seed} lost grouped-bar semantics.`);
    assert(first.stimulus.points.length === 5, `${profile} ${seed} must contain five bar groups.`);
    assert(first.stimulus.series.length === 2, `${profile} ${seed} must contain two visible series.`);
    assert(first.stimulus.points.every((point) => point.seriesA > 0 && point.seriesB > 0), `${profile} ${seed} contains a non-positive bar.`);
    assert(first.questions.length === 5, `${profile} ${seed} did not create five linked questions.`);
    assert(new Set(first.questions.map((question) => question.setId)).size === 1, `${profile} ${seed} lost shared set identity.`);
    assert(new Set(first.questions.map((question) => question.questionId)).size === 5, `${profile} ${seed} repeated a child question ID.`);
    assert(new Set(first.questions.map((question) => question.kind)).size === 5, `${profile} ${seed} repeated a grouped-bar task kind.`);
    assert(taskKinds.every((taskKind) => first.questions.some((question) => question.kind === taskKind)), `${profile} ${seed} is missing a required grouped-bar task.`);

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
      assert(question.optionMetadata.every((option) => option.derivation.length >= 20), `${question.questionId} contains an under-explained distractor.`);
      assert(question.explanation.keyIdea.length >= 35, `${question.questionId} key idea is too thin.`);
      assert(question.explanation.steps.length >= 2, `${question.questionId} does not have enough worked steps.`);
      assert(question.explanation.shortcut.length >= 25, `${question.questionId} shortcut is too thin.`);
      assert(question.explanation.trap.length >= 25, `${question.questionId} trap guidance is too thin.`);
      assert(!/mock[- ]?test problem|textbook problem|competitive[- ]exam problem|template|generator|question library|ql[- ]?id/iu.test(question.stem), `${question.questionId} leaks internal/editorial language.`);

      answerPositions.get(`${profile}:${question.kind}`)!.add(question.correctIndex);
      if (question.kind === "CROSS_SERIES_DIFFERENCE") differenceCategoryCoverage.add(question.evidence.categoryIndex!);
      if (question.kind === "CATEGORY_SHARE_OF_SERIES_TOTAL") shareCategoryCoverage.add(question.evidence.categoryIndex!);
      optionChecks += question.options.length;
      learnerSurfaceChecks += 1;
      questionCount += 1;
    });

    stimulusFingerprints.add(stable(first.stimulus));
    byProfile.set(profile, first);
    setCount += 1;
  }

  const ssc = byProfile.get("SSC_CGL_TIER_I")!;
  const banking = byProfile.get("BANKING_PRELIMS")!;
  assert(stable(ssc.stimulus) === stable(banking.stimulus), `Exam profile changed the grouped-bar stimulus for ${seed}.`);
  assert(ssc.optionCount === 4, `SSC ${seed} must expose four options.`);
  assert(banking.optionCount === 5, `Banking ${seed} must expose five options.`);
  crossProfileStimulusChecks += 1;
}

assert(stimulusFingerprints.size >= 95, `DI-003 produced only ${stimulusFingerprints.size} distinct grouped-bar stimuli across 100 seeds.`);
assert(differenceCategoryCoverage.size === 5, `DI-003 difference task did not reach all five categories: ${[...differenceCategoryCoverage].sort()}.`);
assert(shareCategoryCoverage.size === 5, `DI-003 share task did not reach all five categories: ${[...shareCategoryCoverage].sort()}.`);

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
  assert(!source.includes(forbiddenRandomToken), `Non-deterministic random source is prohibited in DI-003: ${file}`);
}

console.log(JSON.stringify({
  status: "PASS_DI_003_GROUPED_BAR_PHASE2",
  sets: setCount,
  questions: questionCount,
  deterministicReplayChecks,
  independentVerificationChecks,
  optionChecks,
  crossProfileStimulusChecks,
  learnerSurfaceChecks,
  distinctStimuli: stimulusFingerprints.size,
  differenceCategoryCoverage: [...differenceCategoryCoverage].sort(),
  shareCategoryCoverage: [...shareCategoryCoverage].sort(),
  answerPositionCoverage: Object.fromEntries(
    [...answerPositions].map(([key, positions]) => [key, [...positions].sort()]),
  ),
}));
