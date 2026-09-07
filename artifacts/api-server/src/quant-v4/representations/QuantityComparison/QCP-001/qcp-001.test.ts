import {
  QCP_001_RELATION_CLASSES,
  QCP_001_SOURCE_FAMILIES,
  generateQcp001Question,
  independentlyVerifyQcp001Question,
  type Qcp001ExamProfile,
} from "./index";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const profiles: readonly Qcp001ExamProfile[] = ["BANKING_PRELIMS", "BANKING_MAINS"];
const expectedPairs = new Set(
  QCP_001_SOURCE_FAMILIES.flatMap((left) => QCP_001_SOURCE_FAMILIES.map((right) => `${left}->${right}`)),
);

let questions = 0;
let deterministicReplayChecks = 0;
let independentVerificationChecks = 0;
let optionChecks = 0;
let learnerSurfaceChecks = 0;
let mainsComplexityChecks = 0;

const relationCoverage = new Map<Qcp001ExamProfile, Set<string>>();
const sourcePairCoverage = new Map<Qcp001ExamProfile, Set<string>>();
const answerPositionCoverage = new Map<Qcp001ExamProfile, Set<number>>();
const evidenceModeCoverage = new Map<Qcp001ExamProfile, Set<string>>();

for (const profile of profiles) {
  relationCoverage.set(profile, new Set());
  sourcePairCoverage.set(profile, new Set());
  answerPositionCoverage.set(profile, new Set());
  evidenceModeCoverage.set(profile, new Set());
}

for (let seedIndex = 1; seedIndex <= 150; seedIndex += 1) {
  const byProfile = new Map<Qcp001ExamProfile, ReturnType<typeof generateQcp001Question>>();

  for (const profile of profiles) {
    const seed = `QCP-001-PHASE0:${seedIndex}`;
    const first = generateQcp001Question({ seed, examProfile: profile });
    const replay = generateQcp001Question({ seed, examProfile: profile });
    byProfile.set(profile, first);

    assert(JSON.stringify(first) === JSON.stringify(replay), `${profile}/${seedIndex}: deterministic replay failed.`);
    deterministicReplayChecks += 1;

    const independent = independentlyVerifyQcp001Question(first);
    assert(independent.valid, `${profile}/${seedIndex}: independent verification failed: ${JSON.stringify(independent.checks)}`);
    independentVerificationChecks += 1;

    assert(first.validation.valid, `${profile}/${seedIndex}: package validation is not green.`);
    assert(first.examProfile === profile, `${profile}/${seedIndex}: exam profile drifted.`);
    assert(first.options.length === 5 && first.optionCount === 5, `${profile}/${seedIndex}: banking option count is not five.`);
    assert(new Set(first.options).size === 5, `${profile}/${seedIndex}: displayed options are not unique.`);
    assert(first.optionMetadata.filter((option) => option.isCorrect).length === 1, `${profile}/${seedIndex}: expected exactly one correct option.`);
    assert(first.optionMetadata[first.correctIndex]?.relationClass === first.answerClass, `${profile}/${seedIndex}: correct option metadata is misaligned.`);
    assert(first.explanation.distractorAnalysis.length === 4, `${profile}/${seedIndex}: all four wrong options must be diagnosed.`);
    optionChecks += first.options.length;

    assert(!/QCP-001|PCT-001|RAP-001|NUM-001|source package|generator|template/i.test(`${first.direction}\n${first.stem}`), `${profile}/${seedIndex}: learner stem leaked implementation language.`);
    assert(!/QCP-001|source package|generator|template/i.test(JSON.stringify(first.explanation)), `${profile}/${seedIndex}: explanation leaked implementation language.`);
    learnerSurfaceChecks += 1;

    assert(first.traceability.reviewStatus === "UNREVIEWED", `${profile}/${seedIndex}: Phase 0 review status must remain UNREVIEWED.`);
    assert(first.traceability.questionStudioDiscoverable === false, `${profile}/${seedIndex}: Question Studio must remain closed.`);
    assert(first.traceability.questionBankStatus === "NOT_STORED", `${profile}/${seedIndex}: Question Bank must remain locked.`);
    assert(first.traceability.testEligibility === "INELIGIBLE", `${profile}/${seedIndex}: mock/test eligibility must remain locked.`);
    assert(first.traceability.publiclyPublishable === false, `${profile}/${seedIndex}: public publication must remain locked.`);

    relationCoverage.get(profile)!.add(first.answerClass);
    sourcePairCoverage.get(profile)!.add(`${first.quantityI.sourceFamily}->${first.quantityII.sourceFamily}`);
    answerPositionCoverage.get(profile)!.add(first.correctIndex);
    evidenceModeCoverage.get(profile)!.add(first.answerEvidenceMode);
    questions += 1;
  }

  const prelims = byProfile.get("BANKING_PRELIMS")!;
  const mains = byProfile.get("BANKING_MAINS")!;
  const prelimsStateCount = prelims.quantityI.states.length + prelims.quantityII.states.length;
  const mainsStateCount = mains.quantityI.states.length + mains.quantityII.states.length;
  assert(mainsStateCount > prelimsStateCount, `Seed ${seedIndex}: Banking Mains must increase admissible-state reasoning depth rather than only inflate numbers.`);
  assert(mains.answerClass === prelims.answerClass, `Seed ${seedIndex}: profile difficulty must not silently change the intended relation class.`);
  assert(
    mains.quantityI.sourceFamily === prelims.quantityI.sourceFamily && mains.quantityII.sourceFamily === prelims.quantityII.sourceFamily,
    `Seed ${seedIndex}: source-family ownership must stay stable across banking profiles.`,
  );
  mainsComplexityChecks += 1;
}

for (const profile of profiles) {
  assert(relationCoverage.get(profile)!.size === QCP_001_RELATION_CLASSES.length, `${profile}: not all five exclusive relation classes were exercised.`);
  assert(sourcePairCoverage.get(profile)!.size === expectedPairs.size, `${profile}: not all nine ordered source-family pairs were exercised.`);
  assert(answerPositionCoverage.get(profile)!.size === 5, `${profile}: correct answers did not reach A/B/C/D/E positions.`);
}

assert(evidenceModeCoverage.get("BANKING_PRELIMS")!.has("EXACT_EQUALITY"), "Banking Prelims must exercise the equality branch of the combined option.");
assert(evidenceModeCoverage.get("BANKING_PRELIMS")!.has("RELATION_CANNOT_BE_ESTABLISHED"), "Banking Prelims must exercise the indeterminate branch of the combined option.");
assert(evidenceModeCoverage.get("BANKING_MAINS")!.has("RELATION_CANNOT_BE_ESTABLISHED"), "Banking Mains must exercise genuinely indeterminate quantity sets.");

console.log(JSON.stringify({
  status: "PASS_QCP_001_PHASE0",
  questions,
  deterministicReplayChecks,
  independentVerificationChecks,
  optionChecks,
  learnerSurfaceChecks,
  mainsComplexityChecks,
  relationClassesPerProfile: Object.fromEntries([...relationCoverage].map(([profile, values]) => [profile, values.size])),
  sourcePairsPerProfile: Object.fromEntries([...sourcePairCoverage].map(([profile, values]) => [profile, values.size])),
  answerPositionsPerProfile: Object.fromEntries([...answerPositionCoverage].map(([profile, values]) => [profile, [...values].sort()])),
  evidenceModesPerProfile: Object.fromEntries([...evidenceModeCoverage].map(([profile, values]) => [profile, [...values].sort()])),
}));
