import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateDi007MissingSet,
  independentlyVerifyDi007QuestionSet,
  type Di007ExamProfile,
  type Di007TaskKind,
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

const profiles: readonly Di007ExamProfile[] = ["BANKING_PRELIMS", "BANKING_MAINS"];
const taskKinds: readonly Di007TaskKind[] = [
  "RECOVER_MISSING_VALUE",
  "MISSING_TO_PAIRED_RATIO",
  "B_TOTAL_AS_PERCENT_OF_A_TOTAL",
  "HIDDEN_ROW_COMBINED_TOTAL",
  "MISSING_SHARE_OF_B_TOTAL",
];

const answerPositions = new Map<string, Set<number>>();
for (const profile of profiles) {
  for (const taskKind of taskKinds) answerPositions.set(`${profile}:${taskKind}`, new Set<number>());
}

const baseStimulusFingerprints = new Set<string>();
const hiddenIndexCoverage = new Set<number>();
const recoveryModeCoverage = new Map<Di007ExamProfile, Set<string>>([
  ["BANKING_PRELIMS", new Set<string>()],
  ["BANKING_MAINS", new Set<string>()],
]);
let setCount = 0;
let questionCount = 0;
let deterministicReplayChecks = 0;
let independentVerificationChecks = 0;
let optionChecks = 0;
let fiveOptionChildChecks = 0;
let crossProfileBaseStateChecks = 0;
let learnerSurfaceChecks = 0;

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `DI-007-PHASE6-${seedIndex}`;
  const byProfile = new Map<Di007ExamProfile, ReturnType<typeof generateDi007MissingSet>>();

  for (const profile of profiles) {
    const first = generateDi007MissingSet({ seed, examProfile: profile });
    const replay = generateDi007MissingSet({ seed, examProfile: profile });

    assert(stable(first) === stable(replay), `${profile} ${seed} is not deterministic.`);
    deterministicReplayChecks += 1;

    assert(first.validation.valid, `${profile} ${seed} failed internal Missing DI validation.`);
    assert(independentlyVerifyDi007QuestionSet(first), `${profile} ${seed} failed independent Missing DI verification.`);
    independentVerificationChecks += first.questions.length;

    assert(first.stimulus.kind === "MISSING_TABLE", `${profile} ${seed} lost Missing DI semantics.`);
    assert(first.stimulus.points.length === 5, `${profile} ${seed} must contain five rows.`);
    assert(first.stimulus.points.filter((point) => point.displaySeriesB === "?").length === 1, `${profile} ${seed} must hide exactly one Series B value.`);
    assert(first.stimulus.points[first.stimulus.hiddenIndex]?.displaySeriesB === "?", `${profile} ${seed} hidden index does not match the missing cell.`);
    assert(first.questions.length === 5, `${profile} ${seed} did not create five linked questions.`);
    assert(new Set(first.questions.map((question) => question.setId)).size === 1, `${profile} ${seed} lost shared set identity.`);
    assert(new Set(first.questions.map((question) => question.questionId)).size === 5, `${profile} ${seed} repeated a child question ID.`);
    assert(new Set(first.questions.map((question) => question.kind)).size === 5, `${profile} ${seed} repeated a Missing DI task kind.`);
    assert(taskKinds.every((taskKind) => first.questions.some((question) => question.kind === taskKind)), `${profile} ${seed} is missing a required Missing DI task.`);

    assert(first.traceability.questionBankStatus === "NOT_STORED", `${profile} ${seed} leaked Question Bank eligibility.`);
    assert(first.traceability.testEligibility === "INELIGIBLE", `${profile} ${seed} leaked test eligibility.`);
    assert(!first.traceability.publiclyPublishable, `${profile} ${seed} leaked public publication.`);
    assert(!first.traceability.questionStudioDiscoverable, `${profile} ${seed} leaked Question Studio discovery.`);

    first.questions.forEach((question) => {
      assert(question.options.length === 5, `${question.questionId} does not have five banking options.`);
      assert(question.optionMetadata.length === 5, `${question.questionId} option metadata count is wrong.`);
      assert(new Set(question.options).size === 5, `${question.questionId} contains duplicate displayed options.`);
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
      fiveOptionChildChecks += 1;
      optionChecks += question.options.length;
      learnerSurfaceChecks += 1;
      questionCount += 1;
    });

    hiddenIndexCoverage.add(first.stimulus.hiddenIndex);
    recoveryModeCoverage.get(profile)!.add(first.stimulus.aggregateCondition.mode);
    baseStimulusFingerprints.add(stable({ points: first.stimulus.points, hiddenIndex: first.stimulus.hiddenIndex }));
    byProfile.set(profile, first);
    setCount += 1;
  }

  const prelims = byProfile.get("BANKING_PRELIMS")!;
  const mains = byProfile.get("BANKING_MAINS")!;
  assert(stable(prelims.stimulus.points) === stable(mains.stimulus.points), `Exam profile changed the underlying table values for ${seed}.`);
  assert(prelims.stimulus.hiddenIndex === mains.stimulus.hiddenIndex, `Exam profile changed the hidden cell for ${seed}.`);
  assert(prelims.optionCount === 5 && mains.optionCount === 5, `${seed} lost five-option banking fidelity.`);
  crossProfileBaseStateChecks += 1;
}

assert(baseStimulusFingerprints.size >= 95, `DI-007 produced only ${baseStimulusFingerprints.size} distinct base Missing DI states across 100 seeds.`);
assert(hiddenIndexCoverage.size === 5, `DI-007 hidden cell did not reach all five rows: ${[...hiddenIndexCoverage].sort()}.`);
assert(recoveryModeCoverage.get("BANKING_PRELIMS")!.size === 3, `DI-007 Prelims exercised only ${recoveryModeCoverage.get("BANKING_PRELIMS")!.size}/3 recovery modes.`);
assert(recoveryModeCoverage.get("BANKING_MAINS")!.size === 5, `DI-007 Mains exercised only ${recoveryModeCoverage.get("BANKING_MAINS")!.size}/5 recovery modes.`);
assert(fiveOptionChildChecks === 1000, `DI-007 completed only ${fiveOptionChildChecks}/1000 five-option child checks.`);

for (const profile of profiles) {
  for (const taskKind of taskKinds) {
    const positions = answerPositions.get(`${profile}:${taskKind}`)!;
    assert(positions.size === 5, `${profile}:${taskKind} reached only answer positions ${[...positions].sort()} instead of all five.`);
  }
}

const scope = dirname(fileURLToPath(import.meta.url));
const forbiddenRandomToken = "Math" + ".random(";
for (const file of walkFiles(scope).filter((path) => path.endsWith(".ts"))) {
  const source = readFileSync(file, "utf8");
  assert(!source.includes(forbiddenRandomToken), `Non-deterministic random source is prohibited in DI-007: ${file}`);
}

console.log(JSON.stringify({
  status: "PASS_DI_007_MISSING_PHASE6",
  sets: setCount,
  questions: questionCount,
  deterministicReplayChecks,
  independentVerificationChecks,
  optionChecks,
  fiveOptionChildChecks,
  crossProfileBaseStateChecks,
  learnerSurfaceChecks,
  distinctBaseStates: baseStimulusFingerprints.size,
  hiddenIndexCoverage: [...hiddenIndexCoverage].sort(),
  recoveryModeCoverage: Object.fromEntries([...recoveryModeCoverage].map(([profile, modes]) => [profile, [...modes].sort()])),
  answerPositionCoverage: Object.fromEntries([...answerPositions].map(([key, positions]) => [key, [...positions].sort()])),
}));
