import { generateDi008V2ReviewSet } from "./arithmetic-set-v2";
import { independentlyVerifyDi008V2Set } from "./independent-verifier-v2";
import type { Di008V2ContextId, Di008V2ExamProfile, Di008V2TaskKind } from "./arithmetic-v2-types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

const profiles: readonly Di008V2ExamProfile[] = ["BANKING_PRELIMS", "BANKING_MAINS"];
const allTasks: readonly Di008V2TaskKind[] = [
  "UNIT_INCREASE",
  "REVENUE_AMOUNT",
  "PERCENT_CHANGE",
  "PROFIT_AMOUNT",
  "PROFIT_PERCENT",
  "REVENUE_SHARE",
  "PROFIT_RATIO",
  "AVERAGE_PROFIT",
  "COMBINED_PERCENT_CHANGE",
  "COMBINED_PROFIT_PERCENT",
  "GROUP_REVENUE_RATIO",
  "WEIGHTED_AVERAGE_SELLING_PRICE",
];
const allContexts: readonly Di008V2ContextId[] = [
  "STATIONERY_WHOLESALE",
  "PACKAGED_FOODS",
  "SPORTS_GOODS",
  "ELECTRONIC_ACCESSORIES",
  "HOUSEHOLD_ITEMS",
  "OFFICE_SUPPLIES",
];

const taskCounts = new Map<Di008V2TaskKind, number>(allTasks.map((task) => [task, 0]));
const stemVariants = new Map<Di008V2TaskKind, Set<number>>(allTasks.map((task) => [task, new Set<number>()]));
const answerPositions = new Map<string, Set<number>>();
for (const profile of profiles) for (const task of allTasks) answerPositions.set(profile + ":" + task, new Set<number>());

const contexts = new Set<Di008V2ContextId>();
const labelsByContext = new Map<Di008V2ContextId, Set<string>>(allContexts.map((context) => [context, new Set<string>()]));
const allLearnerLabels = new Set<string>();
const stateFingerprints = new Set<string>();
const orderFingerprints = new Set<string>();
let sets = 0;
let questions = 0;
let deterministicReplays = 0;
let independentVerifications = 0;
let optionChecks = 0;
let crossProfileStimulusChecks = 0;
let prelimsSingleMediumChecks = 0;
let mainsAggregateChecks = 0;

for (let seedIndex = 1; seedIndex <= 160; seedIndex += 1) {
  const seed = "DI-008-V2-STRESS-" + seedIndex;
  const byProfile = new Map<Di008V2ExamProfile, ReturnType<typeof generateDi008V2ReviewSet>>();

  for (const profile of profiles) {
    const first = generateDi008V2ReviewSet({ seed, examProfile: profile });
    const replay = generateDi008V2ReviewSet({ seed, examProfile: profile });

    assert(stable(first) === stable(replay), profile + " " + seed + " is not deterministic.");
    deterministicReplays += 1;
    assert(first.validation.valid, profile + " " + seed + " failed V2 validation.");
    assert(independentlyVerifyDi008V2Set(first), profile + " " + seed + " failed independent verification.");
    independentVerifications += first.questions.length;

    const difficultyCounts = first.questions.reduce<Record<string, number>>((acc, question) => {
      acc[question.difficulty] = (acc[question.difficulty] ?? 0) + 1;
      return acc;
    }, {});
    assert(first.questions.length === 5, profile + " " + seed + " must contain five linked questions.");
    assert(difficultyCounts.Easy === 1 && difficultyCounts.Medium === 2 && difficultyCounts.Hard === 2, profile + " " + seed + " lost the 1E+2M+2H contract.");
    assert(new Set(first.questions.map((question) => question.kind)).size === 5, profile + " " + seed + " repeated a task family.");
    assert(first.optionCount === 5, profile + " " + seed + " lost five-option delivery.");
    assert(first.traceability.questionStudioDiscoverable === false, profile + " " + seed + " leaked Question Studio discovery.");
    assert(first.traceability.questionBankWritable === false && first.traceability.testEligible === false && first.traceability.mockTestEligible === false, profile + " " + seed + " widened learner lifecycle authority.");
    assert(first.traceability.publiclyPublishable === false && first.traceability.automaticStudentPublication === false && first.traceability.productionReleaseAuthorized === false, profile + " " + seed + " widened publication authority.");

    assert(!/\bProduct [A-E]\b|shortcut|trap|template|generator/iu.test(first.stimulus.title + " " + first.stimulus.instruction + " " + first.questions.map((question) => question.stem + " " + question.explanation.keyIdea + " " + question.explanation.steps.join(" ")).join(" ")), profile + " " + seed + " leaked generic/editorial learner wording.");

    for (const question of first.questions) {
      assert(question.options.length === 5 && new Set(question.options).size === 5, question.questionId + " does not have five unique options.");
      assert(question.options[question.correctIndex] === question.answer, question.questionId + " correctIndex is not bound to the answer.");
      assert(question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1, question.questionId + " does not have one correct metadata entry.");
      assert(question.explanation.keyIdea.length >= 35 && question.explanation.steps.length >= 2, question.questionId + " explanation is too thin.");

      if (profile === "BANKING_PRELIMS" && ["PERCENT_CHANGE", "PROFIT_AMOUNT", "PROFIT_PERCENT"].includes(question.kind)) {
        assert(question.evidence.primaryIndices.length === 1, question.questionId + " should remain single-item at Prelims medium level.");
        prelimsSingleMediumChecks += 1;
      }
      if (profile === "BANKING_MAINS" && question.difficulty !== "Easy") {
        assert(question.evidence.primaryIndices.length >= 2, question.questionId + " should require aggregation/weighting at Mains medium/hard level.");
        mainsAggregateChecks += 1;
      }

      taskCounts.set(question.kind, taskCounts.get(question.kind)! + 1);
      stemVariants.get(question.kind)!.add(question.stemVariant);
      answerPositions.get(profile + ":" + question.kind)!.add(question.correctIndex);
      optionChecks += question.options.length;
      questions += 1;
    }

    contexts.add(first.stimulus.contextId);
    for (const row of first.stimulus.rows) {
      labelsByContext.get(first.stimulus.contextId)!.add(row.label);
      allLearnerLabels.add(row.label);
    }
    stateFingerprints.add(stable({ contextId: first.stimulus.contextId, rows: first.stimulus.rows }));
    orderFingerprints.add(first.questions.map((question) => question.kind).join("|"));
    byProfile.set(profile, first);
    sets += 1;
  }

  const prelims = byProfile.get("BANKING_PRELIMS")!;
  const mains = byProfile.get("BANKING_MAINS")!;
  assert(prelims.stimulus.contextId === mains.stimulus.contextId, "Profile changed context for " + seed + ".");
  assert(stable(prelims.stimulus.rows) === stable(mains.stimulus.rows), "Profile changed shared business data for " + seed + ".");
  crossProfileStimulusChecks += 1;
}

assert(contexts.size === allContexts.length, "DI-008 V2 covered only " + contexts.size + "/" + allContexts.length + " contexts.");
assert(allLearnerLabels.size === 144, "DI-008 V2 exercised only " + allLearnerLabels.size + "/144 configured learner-facing object labels.");
for (const context of allContexts) {
  assert(labelsByContext.get(context)!.size === 24, context + " exercised only " + labelsByContext.get(context)!.size + "/24 configured object labels.");
}
assert(stateFingerprints.size >= 150, "DI-008 V2 produced only " + stateFingerprints.size + " distinct mathematical states.");
assert(orderFingerprints.size >= 60, "DI-008 V2 produced only " + orderFingerprints.size + " question-order signatures.");
assert(prelimsSingleMediumChecks > 100, "Prelims direct/single-item medium arithmetic was not exercised enough.");
assert(mainsAggregateChecks > 500, "Mains aggregate/weighted arithmetic was not exercised enough.");

for (const task of allTasks) {
  assert(taskCounts.get(task)! >= 70, task + " appeared only " + taskCounts.get(task) + " times.");
  assert(stemVariants.get(task)!.size === 3, task + " did not exercise all three stem surfaces.");
}

for (const profile of profiles) {
  for (const task of allTasks) {
    const positions = answerPositions.get(profile + ":" + task)!;
    assert(positions.size === 5, profile + ":" + task + " reached only answer positions " + [...positions].sort().join(",") + ".");
  }
}

console.log(JSON.stringify({
  status: "PASS_DI_008_ARITHMETIC_V2",
  sets,
  questions,
  deterministicReplays,
  independentVerifications,
  optionChecks,
  crossProfileStimulusChecks,
  prelimsSingleMediumChecks,
  mainsAggregateChecks,
  contexts: [...contexts].sort(),
  learnerObjectLabels: allLearnerLabels.size,
  labelsByContext: Object.fromEntries([...labelsByContext].map(([context, labels]) => [context, labels.size])),
  taskCounts: Object.fromEntries(taskCounts),
  stemVariantCoverage: Object.fromEntries([...stemVariants].map(([task, variants]) => [task, [...variants].sort()])),
  distinctStates: stateFingerprints.size,
  orderSignatures: orderFingerprints.size,
}));
