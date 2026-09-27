import {
  DI004_V2_CONTEXT_COUNT,
  DI004_V2_ENTITY_LABEL_COUNT,
  DI004_V2_SERIES_PAIR_COUNT,
  DI004_V2_TASK_KINDS,
  generateDi004V2Set,
} from "./line-set-v2";
import { independentlyVerifyDi004V2Set } from "./independent-verifier-v2";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const taskSeen = new Set<string>();
const contextSeen = new Set<string>();
const pairSeen = new Set<string>();
const surfaces = new Map<string, Set<string>>();
const answerPositions = {
  SSC_CGL_TIER_I: new Set<number>(),
  BANKING_PRELIMS: new Set<number>(),
};

let sets = 0;
let questions = 0;

for (let seedIndex = 0; seedIndex < 240; seedIndex += 1) {
  const seed = `DI004-V2-STRESS-${seedIndex}`;
  const ssc = generateDi004V2Set({ seed, examProfile: "SSC_CGL_TIER_I" });
  const bank = generateDi004V2Set({ seed, examProfile: "BANKING_PRELIMS" });

  assert(JSON.stringify(ssc.stimulus) === JSON.stringify(bank.stimulus), `${seed}: exam profile changed the line stimulus.`);

  for (const set of [ssc, bank] as const) {
    sets += 1;
    questions += set.questions.length;
    assert(set.validation.valid, `${seed}: embedded validation failed for ${set.examProfile}.`);
    assert(set.questions.length === 5, `${seed}: expected five linked questions.`);
    assert(set.questions.filter((q) => q.difficulty === "Easy").length === 1, `${seed}: Easy count drifted.`);
    assert(set.questions.filter((q) => q.difficulty === "Medium").length === 2, `${seed}: Medium count drifted.`);
    assert(set.questions.filter((q) => q.difficulty === "Hard").length === 2, `${seed}: Hard count drifted.`);

    const independent = independentlyVerifyDi004V2Set(set);
    assert(independent.valid, `${seed}: independent verification failed for ${set.examProfile}.`);

    contextSeen.add(set.stimulus.contextId);
    pairSeen.add(`${set.stimulus.series[0].label}|${set.stimulus.series[1].label}`);

    const valuesA = set.stimulus.points.map((point) => point.seriesA);
    const valuesB = set.stimulus.points.map((point) => point.seriesB);
    assert(set.stimulus.points.length === 6, `${seed}: line graph lost six-period shape.`);
    assert(set.stimulus.points.every((point) => Number.isSafeInteger(point.seriesA) && Number.isSafeInteger(point.seriesB) && point.seriesA > 0 && point.seriesB > 0), `${seed}: invalid plotted value.`);
    assert(valuesA.some((value, index) => value < valuesB[index]!) && valuesA.some((value, index) => value > valuesB[index]!), `${seed}: graph lost line-order reversal.`);

    for (const question of set.questions) {
      taskSeen.add(question.kind);
      const byTask = surfaces.get(question.kind) ?? new Set<string>();
      byTask.add(question.stemSurfaceId);
      surfaces.set(question.kind, byTask);
      answerPositions[set.examProfile].add(question.correctIndex);

      assert(question.options.length === set.optionCount, `${seed}/${question.kind}: wrong option count.`);
      assert(new Set(question.options).size === set.optionCount, `${seed}/${question.kind}: duplicate options.`);
      assert(question.options[question.correctIndex] === question.answer, `${seed}/${question.kind}: correct-index mismatch.`);
      assert(!/\bassociated\b/iu.test(question.stem), `${seed}/${question.kind}: mechanical 'associated' wording leaked into the stem.`);
      assert(!/\d+\.\d+%/u.test(question.stem + " " + question.answer), `${seed}/${question.kind}: decimal percentage leaked to learner surface.`);
      assert((question.explanation as any).shortcut === undefined && (question.explanation as any).trap === undefined, `${seed}/${question.kind}: forced shortcut/trap fields returned.`);
      assert(question.explanation.steps.length >= 2, `${seed}/${question.kind}: explanation is too thin.`);

      if (question.difficulty === "Easy") {
        assert(["CROSS_SERIES_DIFFERENCE", "COMBINED_PERIOD_TOTAL"].includes(question.kind), `${seed}/${question.kind}: Easy route must require arithmetic rather than direct lookup.`);
      }
      if (question.difficulty === "Hard") {
        assert(question.explanation.steps.length >= 3, `${seed}/${question.kind}: Hard route is not multi-step.`);
      }
      if (question.kind === "TOTAL_SERIES_RATIO" || question.kind === "THREE_VS_THREE_RATIO" || question.kind === "TWO_PERIOD_SERIES_RATIO") {
        assert(question.answer !== "1:1", `${seed}/${question.kind}: ratio collapsed to trivial 1:1.`);
      }
      if (question.kind === "TOTAL_SERIES_PERCENT_EXCESS") {
        assert(question.answer !== "0%", `${seed}/TOTAL_SERIES_PERCENT_EXCESS: rounded answer collapsed to 0%.`);
      }
    }
  }
}

assert(DI004_V2_CONTEXT_COUNT === 6, `DI-004 V2 context count drifted to ${DI004_V2_CONTEXT_COUNT}.`);
assert(DI004_V2_SERIES_PAIR_COUNT === 72, `DI-004 V2 pair pool drifted to ${DI004_V2_SERIES_PAIR_COUNT}.`);
assert(DI004_V2_ENTITY_LABEL_COUNT === 144, `DI-004 V2 entity-label breadth drifted to ${DI004_V2_ENTITY_LABEL_COUNT}.`);
assert(taskSeen.size === DI004_V2_TASK_KINDS.length, `Only ${taskSeen.size}/${DI004_V2_TASK_KINDS.length} DI-004 V2 task families were exercised.`);
assert(contextSeen.size === DI004_V2_CONTEXT_COUNT, `Only ${contextSeen.size}/${DI004_V2_CONTEXT_COUNT} DI-004 V2 contexts were exercised.`);
assert(pairSeen.size >= 50, `DI-004 V2 exercised only ${pairSeen.size}/${DI004_V2_SERIES_PAIR_COUNT} configured series pairs.`);
for (const task of DI004_V2_TASK_KINDS) {
  assert((surfaces.get(task)?.size ?? 0) === 3, `${task}: not all three stem surfaces were exercised.`);
}
assert(answerPositions.SSC_CGL_TIER_I.size === 4, "SSC DI-004 V2 did not reach all four answer positions.");
assert(answerPositions.BANKING_PRELIMS.size === 5, "Banking DI-004 V2 did not reach all five answer positions.");

const replayA = generateDi004V2Set({ seed: "DI004-V2-DETERMINISTIC", examProfile: "BANKING_PRELIMS" });
const replayB = generateDi004V2Set({ seed: "DI004-V2-DETERMINISTIC", examProfile: "BANKING_PRELIMS" });
assert(JSON.stringify(replayA) === JSON.stringify(replayB), "DI-004 V2 deterministic replay failed.");

console.log(JSON.stringify({
  status: "PASS_DI_004_V2_REVIEW_CANDIDATE",
  sets,
  questions,
  taskFamilies: taskSeen.size,
  contexts: contextSeen.size,
  exercisedSeriesPairs: pairSeen.size,
  configuredSeriesPairs: DI004_V2_SERIES_PAIR_COUNT,
  configuredEntityLabels: DI004_V2_ENTITY_LABEL_COUNT,
  stemSurfacesPerTask: 3,
  sscAnswerPositions: [...answerPositions.SSC_CGL_TIER_I].sort(),
  bankingAnswerPositions: [...answerPositions.BANKING_PRELIMS].sort(),
}));
