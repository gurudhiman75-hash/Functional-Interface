import assert from "node:assert/strict";
import { renderDiPieSvg, DI_PIE_COLOR_PALETTE, DI_PIE_VISUAL_THEME } from "../visuals/pie-svg";
import { generateDi005V2Set, DI005_V2_TASK_KINDS } from "./pie-set-v2";
import { verifyDi005V2Question } from "./independent-verifier-v2";
import type { Di005V2ExamProfile, Di005V2TaskKind } from "./pie-v2-types";

const profiles: readonly Di005V2ExamProfile[] = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"];
const seeds = Array.from({ length: 120 }, (_, index) => `DI005-V2-STRESS-${String(index + 1).padStart(3, "0")}`);
const taskCounts = new Map<Di005V2TaskKind, number>();
const stemSurfaces = new Map<Di005V2TaskKind, Set<string>>();
const correctPositions = new Map<string, Set<number>>();
const contexts = new Set<string>();
const sharePatterns = new Set<string>();
const hiddenPositions = new Set<number>();
const stimuli = new Set<string>();
const orderSignatures = new Set<string>();
let sets = 0;
let questions = 0;
let independentVerifications = 0;
let optionChecks = 0;
let deterministicReplays = 0;
let crossProfileStimulusChecks = 0;

function projection(set: ReturnType<typeof generateDi005V2Set>) {
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
    const first = generateDi005V2Set({ seed, examProfile: profile });
    const replay = generateDi005V2Set({ seed, examProfile: profile });
    assert.deepEqual(projection(first), projection(replay), `${profile}/${seed} is not deterministic.`);
    deterministicReplays += 1;
    assert.equal(first.validation.valid, true, `${profile}/${seed} failed built-in validation.`);
    assert.equal(first.questions.length, 5);
    assert.equal(new Set(first.questions.map((question) => question.kind)).size, 5);
    assert.equal(first.questions.filter((question) => question.difficulty === "Easy").length, 1);
    assert.equal(first.questions.filter((question) => question.difficulty === "Medium").length, 2);
    assert.equal(first.questions.filter((question) => question.difficulty === "Hard").length, 2);
    assert.equal("svg" in (first.stimulus as unknown as Record<string, unknown>), false, "Semantic stimulus must not embed SVG.");
    assert.equal(first.traceability.questionStudioDiscoverable, false);
    assert.equal(first.traceability.questionBankWritable, false);
    assert.equal(first.traceability.testEligible, false);
    assert.equal(first.traceability.mockTestEligible, false);
    assert.equal(first.traceability.publiclyPublishable, false);
    assert.equal(first.traceability.automaticStudentPublication, false);
    assert.equal(first.traceability.productionReleaseAuthorized, false);

    sets += 1;
    contexts.add(first.stimulus.contextId);
    sharePatterns.add(first.stimulus.slices.map((slice) => slice.percent).slice().sort((a, b) => a - b).join("-"));
    hiddenPositions.add(first.stimulus.hiddenPercentIndex);
    stimuli.add(JSON.stringify(first.stimulus));
    orderSignatures.add(first.questions.map((question) => question.kind).join("|"));

    for (const question of first.questions) {
      questions += 1;
      taskCounts.set(question.kind, (taskCounts.get(question.kind) ?? 0) + 1);
      if (!stemSurfaces.has(question.kind)) stemSurfaces.set(question.kind, new Set());
      stemSurfaces.get(question.kind)!.add(question.stemSurfaceId);
      const positionKey = `${profile}:${question.kind}`;
      if (!correctPositions.has(positionKey)) correctPositions.set(positionKey, new Set());
      correctPositions.get(positionKey)!.add(question.correctIndex);

      assert.equal(question.options.length, profile === "SSC_CGL_TIER_I" ? 4 : 5);
      assert.equal(new Set(question.options).size, question.options.length);
      assert.equal(question.options[question.correctIndex], question.answer);
      optionChecks += question.options.length;
      const verification = verifyDi005V2Question(first, question);
      assert.equal(verification.valid, true, `${profile}/${seed}/${question.kind}: ${verification.expected} != ${verification.actual}`);
      independentVerifications += 1;
      const learnerText = [question.stem, question.explanation.keyIdea, ...question.explanation.steps].join(" ").toLowerCase();
      for (const blocked of ["associated", "shortcut", "common trap", "trap"]) {
        assert.equal(learnerText.includes(blocked), false, `${question.kind} leaked blocked wording: ${blocked}`);
      }
    }

    const svg = renderDiPieSvg(first.stimulus);
    assert.match(svg, /data-di-presentation-layer="shared"/u);
    assert.match(svg, /data-pie-chart="true"/u);
    assert.match(svg, new RegExp(`data-di-chart-theme="${DI_PIE_VISUAL_THEME}"`, "u"));
    assert.match(svg, new RegExp(`data-color-palette="${DI_PIE_COLOR_PALETTE}"`, "u"));
    assert.equal((svg.match(/data-slice="true"/gu) ?? []).length, 5, "Renderer must draw exactly five pie slices.");
    assert.equal((svg.match(/data-slice-label=/gu) ?? []).length, 5, "Renderer must draw exactly five sector labels.");
    assert.match(svg, />\?</u, "Renderer must visibly preserve the hidden percentage marker.");
  }
}

for (const seed of seeds) {
  const ssc = generateDi005V2Set({ seed, examProfile: "SSC_CGL_TIER_I" });
  const banking = generateDi005V2Set({ seed, examProfile: "BANKING_PRELIMS" });
  assert.deepEqual(ssc.stimulus, banking.stimulus, `${seed} changed stimulus across exam profiles.`);
  assert.deepEqual(ssc.questions.map((question) => [question.kind, question.difficulty, question.stem]), banking.questions.map((question) => [question.kind, question.difficulty, question.stem]), `${seed} changed question selection across exam profiles.`);
  crossProfileStimulusChecks += 1;
}

assert.equal(sets, 240);
assert.equal(questions, 1200);
assert.equal(deterministicReplays, 240);
assert.equal(independentVerifications, 1200);
assert.equal(crossProfileStimulusChecks, 120);
assert.ok(optionChecks >= 4800);
assert.equal(contexts.size, 6, "All six neutral contexts must be exercised.");
assert.equal(sharePatterns.size, 5, "All five share patterns must be exercised.");
assert.equal(hiddenPositions.size, 5, "Every sector position must appear as the hidden label.");
assert.ok(stimuli.size >= 100, `Expected at least 100 distinct stimuli, saw ${stimuli.size}.`);
assert.ok(orderSignatures.size >= 60, `Expected at least 60 five-question order signatures, saw ${orderSignatures.size}.`);

for (const kind of DI005_V2_TASK_KINDS) {
  assert.ok((taskCounts.get(kind) ?? 0) >= 15, `${kind} appeared too rarely.`);
  assert.equal(stemSurfaces.get(kind)?.size, 3, `${kind} did not exercise all three stem surfaces.`);
  for (const profile of profiles) {
    const positions = correctPositions.get(`${profile}:${kind}`) ?? new Set<number>();
    const expectedPositions = profile === "SSC_CGL_TIER_I" ? 4 : 5;
    assert.equal(positions.size, expectedPositions, `${profile}/${kind} did not cover every correct-option position.`);
  }
}

console.log(JSON.stringify({
  status: "PASS_DI_005_PIE_V2",
  sets,
  questions,
  deterministicReplays,
  independentVerifications,
  optionChecks,
  crossProfileStimulusChecks,
  contexts: [...contexts].sort(),
  sharePatterns: [...sharePatterns].sort(),
  hiddenPositions: [...hiddenPositions].sort(),
  distinctStimuli: stimuli.size,
  orderSignatures: orderSignatures.size,
  taskKinds: DI005_V2_TASK_KINDS,
  diagramTheme: DI_PIE_VISUAL_THEME,
  palette: DI_PIE_COLOR_PALETTE,
}));
