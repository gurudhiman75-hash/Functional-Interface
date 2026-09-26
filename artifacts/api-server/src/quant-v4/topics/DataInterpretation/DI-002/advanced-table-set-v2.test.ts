import { generateDi002V2Set, DI002_V2_CONTEXT_COUNT, DI002_V2_OBJECT_LABEL_COUNT, DI002_V2_TASK_KINDS } from "./advanced-table-set-v2";
import { independentlyVerifyDi002V2Set } from "./independent-verifier-v2";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const taskSeen = new Set<string>();
const contextSeen = new Set<string>();
const surfaces = new Map<string, Set<string>>();
const answerPositions = {
  SSC_CGL_TIER_I: new Set<number>(),
  BANKING_PRELIMS: new Set<number>(),
};

let sets = 0;
let questions = 0;

for (let seedIndex = 0; seedIndex < 240; seedIndex += 1) {
  const seed = `DI002-V2-STRESS-${seedIndex}`;
  const ssc = generateDi002V2Set({ seed, examProfile: "SSC_CGL_TIER_I" });
  const bank = generateDi002V2Set({ seed, examProfile: "BANKING_PRELIMS" });

  assert(JSON.stringify(ssc.stimulus) === JSON.stringify(bank.stimulus), `${seed}: exam profile changed the shared mathematical table.`);

  for (const set of [ssc, bank] as const) {
    sets += 1;
    questions += set.questions.length;
    assert(set.validation.valid, `${seed}: embedded validation failed for ${set.examProfile}.`);
    assert(set.questions.length === 5, `${seed}: expected five linked questions.`);
    assert(set.questions.filter((q) => q.difficulty === "Easy").length === 1, `${seed}: Easy count drifted.`);
    assert(set.questions.filter((q) => q.difficulty === "Medium").length === 2, `${seed}: Medium count drifted.`);
    assert(set.questions.filter((q) => q.difficulty === "Hard").length === 2, `${seed}: Hard count drifted.`);

    const independent = independentlyVerifyDi002V2Set(set);
    assert(independent.valid, `${seed}: independent arithmetic verification failed for ${set.examProfile}.`);

    contextSeen.add(set.stimulus.contextId);
    const reconstructedApplicants = set.stimulus.rows.map((row) => (row.selected * 100) / row.selectionPercent);
    const reconstructedRejected = set.stimulus.rows.map((row, index) => reconstructedApplicants[index]! - row.selected);
    assert(new Set(reconstructedApplicants).size >= 4, `${seed}: Applicants column is artificially repetitive.`);
    assert(new Set(reconstructedRejected).size >= 4, `${seed}: derived rejected counts are artificially repetitive.`);

    for (const question of set.questions) {
      taskSeen.add(question.kind);
      const byTask = surfaces.get(question.kind) ?? new Set<string>();
      byTask.add(question.stemSurfaceId);
      surfaces.set(question.kind, byTask);
      answerPositions[set.examProfile].add(question.correctIndex);

      assert(question.options.length === set.optionCount, `${seed}/${question.kind}: wrong option count.`);
      assert(new Set(question.options).size === set.optionCount, `${seed}/${question.kind}: duplicate options.`);
      assert(question.options[question.correctIndex] === question.answer, `${seed}/${question.kind}: correct index mismatch.`);
      assert(!/\bassociated\b/iu.test(question.stem), `${seed}/${question.kind}: mechanical 'associated' wording leaked into the stem.`);
      assert(!/\d+\.\d+%/u.test(question.stem + " " + question.answer), `${seed}/${question.kind}: decimal percentage leaked to the learner surface.`);
      assert(!/Selected\(|Applicants\(/u.test(question.stem), `${seed}/${question.kind}: formula-like table notation leaked into an exam stem.`);
      assert((question.explanation as any).shortcut === undefined && (question.explanation as any).trap === undefined, `${seed}/${question.kind}: forced shortcut/trap fields returned.`);

      if (["DIRECT_SELECTION_RATE", "SELECTED_SHARE_OF_TOTAL", "COMBINED_SELECTION_RATE"].includes(question.kind)) {
        for (const option of question.options) {
          const match = option.match(/^(\d+)%$/u);
          assert(match && Number(match[1]) >= 0 && Number(match[1]) <= 100, `${seed}/${question.kind}: bounded percentage distractor escaped 0–100: ${option}.`);
        }
      }
      if (question.kind === "SELECTION_RATE_POINT_GAP") {
        for (const option of question.options) {
          const points = option.match(/^(\d+) percentage points$/u);
          if (points) assert(Number(points[1]) >= 10 && Number(points[1]) <= 40, `${seed}/${question.kind}: implausible percentage-point distractor: ${option}.`);
        }
      }

      if (question.difficulty === "Hard") {
        assert(question.explanation.steps.length >= 3, `${seed}/${question.kind}: Hard explanation is not multi-step.`);
      }
    }
  }
}

assert(DI002_V2_OBJECT_LABEL_COUNT === 144, `DI-002 V2 object pool drifted to ${DI002_V2_OBJECT_LABEL_COUNT}; expected 144.`);
assert(DI002_V2_OBJECT_LABEL_COUNT === 144, `DI-002 V2 object pool breadth drifted to ${DI002_V2_OBJECT_LABEL_COUNT}; expected 144.`);
assert(taskSeen.size === DI002_V2_TASK_KINDS.length, `Only ${taskSeen.size}/${DI002_V2_TASK_KINDS.length} DI-002 V2 task families were exercised.`);
assert(contextSeen.size === DI002_V2_CONTEXT_COUNT, `Only ${contextSeen.size}/${DI002_V2_CONTEXT_COUNT} DI-002 V2 contexts were exercised.`);
for (const task of DI002_V2_TASK_KINDS) {
  assert((surfaces.get(task)?.size ?? 0) === 3, `${task}: not all three stem surfaces were exercised.`);
}
assert(answerPositions.SSC_CGL_TIER_I.size === 4, "SSC DI-002 V2 did not reach all four answer positions.");
assert(answerPositions.BANKING_PRELIMS.size === 5, "Banking DI-002 V2 did not reach all five answer positions.");

const replayA = generateDi002V2Set({ seed: "DI002-V2-DETERMINISTIC", examProfile: "BANKING_PRELIMS" });
const replayB = generateDi002V2Set({ seed: "DI002-V2-DETERMINISTIC", examProfile: "BANKING_PRELIMS" });
assert(JSON.stringify(replayA) === JSON.stringify(replayB), "DI-002 V2 deterministic replay failed.");

console.log(JSON.stringify({
  status: "PASS_DI_002_V2_REVIEW_CANDIDATE",
  sets,
  questions,
  taskFamilies: taskSeen.size,
  contexts: contextSeen.size,
  configuredObjectLabels: DI002_V2_OBJECT_LABEL_COUNT,
  configuredObjectLabels: DI002_V2_OBJECT_LABEL_COUNT,
  stemSurfacesPerTask: 3,
  sscAnswerPositions: [...answerPositions.SSC_CGL_TIER_I].sort(),
  bankingAnswerPositions: [...answerPositions.BANKING_PRELIMS].sort(),
}));
