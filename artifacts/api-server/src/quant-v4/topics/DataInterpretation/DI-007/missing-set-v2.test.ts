import "./localization-review-v1.test";
import {
  generateDi007V2ReviewSet,
} from "./missing-set-v2";
import {
  independentlyVerifyDi007V2Set,
} from "./independent-verifier-v2";
import type {
  Di007V2ContextId,
  Di007V2ExamProfile,
  Di007V2TaskKind,
} from "./missing-v2-types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

const profiles: readonly Di007V2ExamProfile[] = ["BANKING_PRELIMS", "BANKING_MAINS"];
const allTasks: readonly Di007V2TaskKind[] = [
  "VISIBLE_ROW_COMBINED_TOTAL",
  "VISIBLE_ROW_DIFFERENCE",
  "RECOVER_MISSING_VALUE",
  "HIDDEN_ROW_COMBINED_TOTAL",
  "MISSING_TO_PAIRED_RATIO",
  "B_TOTAL_AS_PERCENT_OF_A_TOTAL",
  "MISSING_SHARE_OF_B_TOTAL",
  "VISIBLE_TWO_ROW_B_TOTAL",
  "MISSING_AS_PERCENT_OF_PAIRED_A",
  "COMBINED_HIDDEN_VISIBLE_SHARE_OF_B_TOTAL",
  "HIDDEN_VS_VISIBLE_B_PERCENT_EXCESS",
  "HIDDEN_ROW_TO_VISIBLE_ROW_TOTAL_RATIO",
];

const allContexts: readonly Di007V2ContextId[] = [
  "BANK_BRANCH_APPLICATIONS",
  "INSURANCE_POLICIES",
  "FACTORY_OUTPUT",
  "COURSE_ENROLMENT",
  "ONLINE_ORDERS",
  "BOOK_ISSUES",
];

const taskCounts = new Map<Di007V2TaskKind, number>(allTasks.map((task) => [task, 0]));
const stemVariants = new Map<Di007V2TaskKind, Set<number>>(allTasks.map((task) => [task, new Set<number>()]));
const answerPositions = new Map<string, Set<number>>();
for (const profile of profiles) for (const task of allTasks) answerPositions.set(`${profile}:${task}`, new Set<number>());

const contexts = new Set<Di007V2ContextId>();
const hiddenIndices = new Set<number>();
const recoveryModes = new Map<Di007V2ExamProfile, Set<string>>([
  ["BANKING_PRELIMS", new Set()],
  ["BANKING_MAINS", new Set()],
]);
const stateFingerprints = new Set<string>();
const orderFingerprints = new Set<string>();

let sets = 0;
let questions = 0;
let deterministicReplays = 0;
let independentVerifications = 0;
let optionChecks = 0;
let crossProfileStimulusChecks = 0;

for (let seedIndex = 1; seedIndex <= 120; seedIndex += 1) {
  const seed = `DI-007-V2-STRESS-${seedIndex}`;
  const byProfile = new Map<Di007V2ExamProfile, ReturnType<typeof generateDi007V2ReviewSet>>();

  for (const profile of profiles) {
    const first = generateDi007V2ReviewSet({ seed, examProfile: profile });
    const replay = generateDi007V2ReviewSet({ seed, examProfile: profile });

    assert(stable(first) === stable(replay), `${profile} ${seed} is not deterministic.`);
    deterministicReplays += 1;

    assert(first.validation.valid, `${profile} ${seed} failed V2 validation.`);
    assert(independentlyVerifyDi007V2Set(first), `${profile} ${seed} failed independent verification.`);
    independentVerifications += first.questions.length;

    assert(first.questions.length === 5, `${profile} ${seed} must contain five linked questions.`);
    const difficultyCounts = first.questions.reduce<Record<string, number>>((acc, question) => {
      acc[question.difficulty] = (acc[question.difficulty] ?? 0) + 1;
      return acc;
    }, {});
    assert(difficultyCounts.Easy === 1 && difficultyCounts.Medium === 2 && difficultyCounts.Hard === 2, `${profile} ${seed} lost the 1E+2M+2H contract.`);
    assert(new Set(first.questions.map((question) => question.kind)).size === 5, `${profile} ${seed} repeated a task family.`);
    assert(first.optionCount === 5, `${profile} ${seed} lost banking five-option delivery.`);
    assert(first.traceability.questionStudioDiscoverable === false, `${profile} ${seed} leaked Question Studio discovery.`);
    assert(first.traceability.questionBankWritable === false && first.traceability.testEligible === false && first.traceability.mockTestEligible === false, `${profile} ${seed} widened learner lifecycle authority.`);
    assert(first.traceability.publiclyPublishable === false && first.traceability.automaticStudentPublication === false && first.traceability.productionReleaseAuthorized === false, `${profile} ${seed} widened publication authority.`);

    assert(!/\bSeries A\b|\bSeries B\b|\bfirst-series\b|\bsecond-series\b|\btwo-series\b/iu.test(first.stimulus.title + " " + first.stimulus.instruction + " " + first.questions.map((question) => question.stem + " " + question.explanation.keyIdea + " " + question.explanation.steps.join(" ")).join(" ")), `${profile} ${seed} leaked generic series learner wording.`);
    assert(first.stimulus.seriesALabel.length >= 8 && first.stimulus.seriesBLabel.length >= 8, `${profile} ${seed} has weak context labels.`);

    for (const question of first.questions) {
      assert(question.options.length === 5 && new Set(question.options).size === 5, `${question.questionId} does not have five unique options.`);
      assert(question.options[question.correctIndex] === question.answer, `${question.questionId} correctIndex is not bound to the answer.`);
      assert(question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1, `${question.questionId} does not have one correct metadata entry.`);
      assert(question.explanation.keyIdea.length >= 35 && question.explanation.steps.length >= 2, `${question.questionId} explanation is too thin.`);
      assert(!/shortcut|trap|template|generator|question library|mock-test problem/iu.test(question.stem + " " + question.explanation.keyIdea + " " + question.explanation.steps.join(" ")), `${question.questionId} leaked editorial/template language.`);
      assert(String(question.kind) !== "DIRECT_VISIBLE_VALUE", `${question.questionId} reintroduced the retired zero-operation direct lookup family.`);
      if (question.difficulty === "Easy") {
        assert(["VISIBLE_ROW_COMBINED_TOTAL", "VISIBLE_ROW_DIFFERENCE"].includes(question.kind), `${question.questionId} Easy route must require arithmetic.`);
        assert(question.explanation.steps.length >= 2, `${question.questionId} Easy explanation is too thin.`);
      }

      taskCounts.set(question.kind, taskCounts.get(question.kind)! + 1);
      stemVariants.get(question.kind)!.add(question.stemVariant);
      answerPositions.get(`${profile}:${question.kind}`)!.add(question.correctIndex);
      optionChecks += question.options.length;
      questions += 1;
    }

    contexts.add(first.stimulus.contextId);
    hiddenIndices.add(first.stimulus.hiddenIndex);
    recoveryModes.get(profile)!.add(first.stimulus.aggregateCondition.mode);
    stateFingerprints.add(stable({
      contextId: first.stimulus.contextId,
      points: first.stimulus.points,
      hiddenIndex: first.stimulus.hiddenIndex,
    }));
    orderFingerprints.add(first.questions.map((question) => question.kind).join("|"));
    byProfile.set(profile, first);
    sets += 1;
  }

  const prelims = byProfile.get("BANKING_PRELIMS")!;
  const mains = byProfile.get("BANKING_MAINS")!;
  assert(prelims.stimulus.contextId === mains.stimulus.contextId, `Profile changed context for ${seed}.`);
  assert(stable(prelims.stimulus.points) === stable(mains.stimulus.points), `Profile changed table values for ${seed}.`);
  assert(prelims.stimulus.hiddenIndex === mains.stimulus.hiddenIndex, `Profile changed hidden cell for ${seed}.`);
  crossProfileStimulusChecks += 1;
}

assert(contexts.size === allContexts.length, `DI-007 V2 covered only ${contexts.size}/${allContexts.length} contexts.`);
assert(hiddenIndices.size === 5, `DI-007 V2 did not use all five hidden-row positions.`);
assert(recoveryModes.get("BANKING_PRELIMS")!.size === 3, `Prelims covered only ${recoveryModes.get("BANKING_PRELIMS")!.size}/3 recovery modes.`);
assert(recoveryModes.get("BANKING_MAINS")!.size === 5, `Mains covered only ${recoveryModes.get("BANKING_MAINS")!.size}/5 recovery modes.`);
assert(stateFingerprints.size >= 110, `DI-007 V2 produced only ${stateFingerprints.size} distinct mathematical states.`);
assert(orderFingerprints.size >= 30, `DI-007 V2 produced only ${orderFingerprints.size} question-order signatures.`);

for (const task of allTasks) {
  assert(taskCounts.get(task)! >= 25, `${task} appeared only ${taskCounts.get(task)} times.`);
  assert(stemVariants.get(task)!.size === 3, `${task} did not exercise all three stem surfaces.`);
}

for (const profile of profiles) {
  for (const task of allTasks) {
    const positions = answerPositions.get(`${profile}:${task}`)!;
    assert(positions.size >= 4, `${profile}:${task} reached only answer positions ${[...positions].sort()}.`);
  }
}

console.log(JSON.stringify({
  status: "PASS_DI_007_MISSING_V2",
  sets,
  questions,
  deterministicReplays,
  independentVerifications,
  optionChecks,
  crossProfileStimulusChecks,
  contexts: [...contexts].sort(),
  hiddenIndices: [...hiddenIndices].sort(),
  recoveryModes: Object.fromEntries([...recoveryModes].map(([profile, modes]) => [profile, [...modes].sort()])),
  taskCounts: Object.fromEntries(taskCounts),
  stemVariantCoverage: Object.fromEntries([...stemVariants].map(([task, variants]) => [task, [...variants].sort()])),
  distinctStates: stateFingerprints.size,
  orderSignatures: orderFingerprints.size,
}));
