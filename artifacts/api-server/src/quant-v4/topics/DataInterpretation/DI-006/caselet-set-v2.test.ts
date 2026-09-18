import assert from "node:assert/strict";
import { DI006_V2_TASK_KINDS, generateDi006V2Set } from "./caselet-set-v2";
import { verifyDi006V2Question } from "./independent-verifier-v2";
import type { Di006V2ExamProfile, Di006V2TaskKind } from "./caselet-v2-types";

const profiles: readonly Di006V2ExamProfile[] = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"];
const seeds = Array.from({ length: 120 }, (_, index) => "DI006-V2-STRESS-" + String(index + 1).padStart(3, "0"));
const taskCounts = new Map<Di006V2TaskKind, number>();
const stemSurfaces = new Map<Di006V2TaskKind, Set<string>>();
const answerPositions = new Map<string, Set<number>>();
const contexts = new Set<string>();
const topologies = new Set<string>();
const valueSignatures = new Set<string>();
const stimuli = new Set<string>();
const orderSignatures = new Set<string>();
let sets = 0;
let questions = 0;
let deterministicReplays = 0;
let independentVerifications = 0;
let optionChecks = 0;
let crossProfileStimulusChecks = 0;

function projection(set: ReturnType<typeof generateDi006V2Set>) {
  return {
    setId: set.setId,
    stimulus: set.stimulus,
    questions: set.questions.map((question) => ({
      kind: question.kind,
      difficulty: question.difficulty,
      stemSurfaceId: question.stemSurfaceId,
      stem: question.stem,
      options: question.options,
      correctIndex: question.correctIndex,
      answer: question.answer,
      explanation: question.explanation,
      evidence: question.evidence,
    })),
  };
}

for (const profile of profiles) {
  for (const seed of seeds) {
    const first = generateDi006V2Set({ seed, examProfile: profile });
    const replay = generateDi006V2Set({ seed, examProfile: profile });
    assert.deepEqual(projection(first), projection(replay), profile + "/" + seed + " is not deterministic.");
    deterministicReplays += 1;

    assert.equal(first.validation.valid, true);
    assert.equal(first.questions.length, 5);
    assert.equal(new Set(first.questions.map((question) => question.kind)).size, 5);
    assert.equal(first.questions.filter((question) => question.difficulty === "Easy").length, 1);
    assert.equal(first.questions.filter((question) => question.difficulty === "Medium").length, 2);
    assert.equal(first.questions.filter((question) => question.difficulty === "Hard").length, 2);
    assert.equal(first.traceability.questionStudioDiscoverable, false);
    assert.equal(first.traceability.questionBankWritable, false);
    assert.equal(first.traceability.testEligible, false);
    assert.equal(first.traceability.mockTestEligible, false);
    assert.equal(first.traceability.publiclyPublishable, false);
    assert.equal(first.traceability.automaticStudentPublication, false);
    assert.equal(first.traceability.productionReleaseAuthorized, false);
    assert.equal(first.stimulus.categories.length, 5);
    assert.equal(first.stimulus.relations.length, 3);
    assert.ok(first.stimulus.learnerText.length > 180);
    assert.doesNotMatch(first.stimulus.learnerText, /\btable\b|\brow\b|\bcolumn\b/iu);
    assert.doesNotMatch(first.stimulus.learnerText, /Together, the five categories accounted for|accounted for \d+/iu, profile + "/" + seed + " leaked generic caselet boilerplate.");

    sets += 1;
    contexts.add(first.stimulus.contextId);
    topologies.add(first.stimulus.topologyId);
    const values = first.questions.map((question) => question.answer).join("|");
    valueSignatures.add(first.stimulus.totalValue + ":" + values);
    stimuli.add(JSON.stringify(first.stimulus));
    orderSignatures.add(first.questions.map((question) => question.kind).join("|"));

    for (const question of first.questions) {
      questions += 1;
      taskCounts.set(question.kind, (taskCounts.get(question.kind) ?? 0) + 1);
      if (!stemSurfaces.has(question.kind)) stemSurfaces.set(question.kind, new Set());
      stemSurfaces.get(question.kind)!.add(question.stemSurfaceId);
      const positionKey = profile + ":" + question.kind;
      if (!answerPositions.has(positionKey)) answerPositions.set(positionKey, new Set());
      answerPositions.get(positionKey)!.add(question.correctIndex);

      assert.equal(question.options.length, profile === "SSC_CGL_TIER_I" ? 4 : 5);
      assert.equal(new Set(question.options).size, question.options.length);
      assert.equal(question.options[question.correctIndex], question.answer);
      assert.ok(question.explanation.keyIdea.length >= 35);
      assert.ok(question.explanation.steps.length >= 1);
      const learnerText = [question.stem, question.explanation.keyIdea, ...question.explanation.steps].join(" ").toLowerCase();
      for (const blocked of ["associated", "shortcut", "common trap", "trap"]) {
        assert.equal(learnerText.includes(blocked), false, question.kind + " leaked blocked wording: " + blocked);
      }

      if (question.kind === "SHARE_OF_TOTAL") {
        for (const option of question.options) {
          assert.match(option, /^\d+(?:\.\d+)?%$/u, profile + "/" + seed + " share option is not a percentage: " + option);
          assert.ok(Number(option.replace("%", "")) <= 100, profile + "/" + seed + " share option exceeds 100%: " + option);
        }
        assert.ok(
          question.optionMetadata.every((option) => option.misconceptionId === "CORRECT" || option.misconceptionId.startsWith("USE_OTHER_CATEGORY_SHARE_") || option.misconceptionId === "USE_COMPLEMENT_SHARE"),
          profile + "/" + seed + " share task used a non-caselet distractor.",
        );
      }

      if (question.kind === "DIFFERENCE_BETWEEN_VALUES") {
        const allowed = new Set([
          "CORRECT",
          "ADD_INSTEAD_OF_SUBTRACT",
          "USE_LARGER_ONLY",
          "USE_SMALLER_ONLY",
          "USE_AVERAGE_INSTEAD_OF_DIFFERENCE",
        ]);
        assert.ok(
          question.optionMetadata.every((option) => allowed.has(option.misconceptionId) || option.misconceptionId.startsWith("USE_WRONG_PAIR_DIFFERENCE_")),
          profile + "/" + seed + " difference task used an arbitrary fallback distractor.",
        );
        assert.ok(!question.optionMetadata.some((option) => option.misconceptionId.startsWith("FALLBACK_VALUE_")), profile + "/" + seed + " difference task fell back to a nearby-number filler.");
      }

      const verification = verifyDi006V2Question(first, question);
      assert.equal(verification.valid, true, profile + "/" + seed + "/" + question.kind + ": " + verification.expected + " != " + verification.actual);
      independentVerifications += 1;
      optionChecks += question.options.length;
    }
  }
}

for (const seed of seeds) {
  const ssc = generateDi006V2Set({ seed, examProfile: "SSC_CGL_TIER_I" });
  const banking = generateDi006V2Set({ seed, examProfile: "BANKING_PRELIMS" });
  assert.deepEqual(ssc.stimulus, banking.stimulus, seed + " changed stimulus across profiles.");
  assert.deepEqual(
    ssc.questions.map((question) => [question.kind, question.difficulty, question.stem]),
    banking.questions.map((question) => [question.kind, question.difficulty, question.stem]),
    seed + " changed task selection or stems across profiles.",
  );
  crossProfileStimulusChecks += 1;
}

assert.equal(sets, 240);
assert.equal(questions, 1200);
assert.equal(deterministicReplays, 240);
assert.equal(independentVerifications, 1200);
assert.equal(crossProfileStimulusChecks, 120);
assert.ok(optionChecks >= 4800);
assert.equal(contexts.size, 6, "All six caselet contexts must be exercised.");
assert.equal(topologies.size, 4, "All four relation topologies must be exercised.");
assert.ok(valueSignatures.size >= 80, "Expected broad arithmetic-state variety.");
assert.ok(stimuli.size >= 100, "Expected at least 100 distinct caselet stimuli.");
assert.ok(orderSignatures.size >= 50, "Expected broad five-question order variety.");

for (const kind of DI006_V2_TASK_KINDS) {
  assert.ok((taskCounts.get(kind) ?? 0) >= 20, kind + " appeared too rarely.");
  assert.equal(stemSurfaces.get(kind)?.size, 3, kind + " did not exercise all three stem surfaces.");
  for (const profile of profiles) {
    const positions = answerPositions.get(profile + ":" + kind) ?? new Set<number>();
    const expectedPositions = profile === "SSC_CGL_TIER_I" ? 4 : 5;
    assert.equal(positions.size, expectedPositions, profile + "/" + kind + " did not cover every correct-option position.");
  }
}

console.log(JSON.stringify({
  status: "PASS_DI_006_CASELET_V2",
  sets,
  questions,
  deterministicReplays,
  independentVerifications,
  optionChecks,
  crossProfileStimulusChecks,
  contexts: [...contexts].sort(),
  topologies: [...topologies].sort(),
  distinctStimuli: stimuli.size,
  valueSignatures: valueSignatures.size,
  orderSignatures: orderSignatures.size,
  taskKinds: DI006_V2_TASK_KINDS,
}));
