import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  FGC_001_SYMMETRY_PROTOTYPES_V1,
  generateFigureCompletionSymmetryQuestionV1,
  type FigureCompletionSymmetryPrototypeV1,
  type FigureCompletionSymmetryQuestionV1,
} from "../foundation/spatial/figure-completion-symmetry-discovery-v1";
import { renderSpatialSceneToSvg } from "../foundation/spatial/svg-renderer";
import { validateSpatialScene, validateSpatialOptionUniqueness } from "../foundation/spatial/validator";
import {
  validateLearnerVisibleExplanationV2,
  validateSpatialPerceptualOptionUniquenessV2,
} from "../foundation/spatial/gap-question-perceptual-v2";

const TARGET_PER_PROTOTYPE = 80;
const MAX_ATTEMPTS_PER_PROTOTYPE = 500;
const REVIEW_PER_PROTOTYPE = 8;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isRetryableGenerationReject(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.message.includes("semantically equivalent symmetry options") ||
    error.message.includes("perceptually equivalent symmetry options");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

interface PrototypeProofResult {
  prototypeId: FigureCompletionSymmetryPrototypeV1;
  accepted: FigureCompletionSymmetryQuestionV1[];
  attempts: number;
  generationRejects: number;
  duplicateRejects: number;
  correctSlots: [number, number, number, number];
}

function provePrototype(prototypeId: FigureCompletionSymmetryPrototypeV1): PrototypeProofResult {
  const accepted: FigureCompletionSymmetryQuestionV1[] = [];
  const seenContent = new Set<string>();
  const correctSlots: [number, number, number, number] = [0, 0, 0, 0];
  let attempts = 0;
  let generationRejects = 0;
  let duplicateRejects = 0;

  for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_PROTOTYPE && accepted.length < TARGET_PER_PROTOTYPE; attempt += 1) {
    attempts += 1;
    const seed = `FGC-SYMMETRY:${prototypeId}:${String(attempt).padStart(4, "0")}`;
    const desiredCorrectOptionIndex = (accepted.length % 4) as 0 | 1 | 2 | 3;
    let question: FigureCompletionSymmetryQuestionV1;
    try {
      question = generateFigureCompletionSymmetryQuestionV1({
        prototypeId,
        seed,
        desiredCorrectOptionIndex,
      });
    } catch (error) {
      if (!isRetryableGenerationReject(error)) throw error;
      generationRejects += 1;
      continue;
    }

    if (seenContent.has(question.contentFingerprint)) {
      duplicateRejects += 1;
      continue;
    }
    seenContent.add(question.contentFingerprint);

    assert(question.permanentQlId === null, `${prototypeId}: discovery must not allocate a permanent QL.`);
    assert(question.lifecycle.maturity === "EXECUTABLE_DISCOVERY_PROOF", `${prototypeId}: wrong discovery maturity.`);
    assert(!question.lifecycle.questionStudioDiscoverable, `${prototypeId}: Question Studio must remain off.`);
    assert(!question.lifecycle.questionBankWritable, `${prototypeId}: Question Bank writes must remain off.`);
    assert(!question.lifecycle.testEligible, `${prototypeId}: test eligibility must remain off.`);
    assert(!question.lifecycle.publiclyPublishable, `${prototypeId}: public publication must remain off.`);
    assert(question.answer === (["A", "B", "C", "D"] as const)[question.correctOptionIndex], `${prototypeId}: answer letter mismatch.`);
    assert(question.solverEvidence.matchingOptionIndexes.length === 1, `${prototypeId}: solver must find exactly one completion.`);
    assert(question.solverEvidence.matchingOptionIndexes[0] === question.correctOptionIndex, `${prototypeId}: solver answer mismatch.`);
    assert(question.options[question.correctOptionIndex]?.misconception === "CORRECT_FRAGMENT", `${prototypeId}: correct option lost ownership.`);
    assert(new Set(question.options.map((option) => option.misconception)).size === 4, `${prototypeId}: misconception ownership must be unique.`);

    const stimulusValidation = validateSpatialScene(question.stimulusScene);
    assert(stimulusValidation.ok, `${prototypeId}: invalid stimulus scene.`);
    const semanticOptions = validateSpatialOptionUniqueness(question.options.map((option) => option.scene));
    assert(semanticOptions.ok, `${prototypeId}: semantic option uniqueness failed.`);
    const perceptualOptions = validateSpatialPerceptualOptionUniquenessV2(question.options.map((option) => option.scene));
    assert(perceptualOptions.ok, `${prototypeId}: perceptual option uniqueness failed.`);
    const explanationValidation = validateLearnerVisibleExplanationV2([
      question.explanation.observation,
      question.explanation.rule,
      question.explanation.application,
      question.explanation.check,
    ]);
    assert(explanationValidation.ok, `${prototypeId}: learner explanation failed: ${explanationValidation.errors.join(", ")}`);

    const replay = generateFigureCompletionSymmetryQuestionV1({
      prototypeId,
      seed,
      desiredCorrectOptionIndex,
    });
    assert(replay.deliveryFingerprint === question.deliveryFingerprint, `${prototypeId}: deterministic replay failed.`);

    renderSpatialSceneToSvg(question.stimulusScene, { ariaLabel: "Figure completion symmetry stimulus" });
    question.options.forEach((option, index) => {
      renderSpatialSceneToSvg(option.scene, { ariaLabel: `Figure completion symmetry option ${index + 1}` });
    });

    accepted.push(question);
    correctSlots[question.correctOptionIndex] += 1;
  }

  assert(accepted.length === TARGET_PER_PROTOTYPE, `${prototypeId}: reached ${accepted.length}/${TARGET_PER_PROTOTYPE} accepted questions after ${attempts} attempts.`);
  assert(correctSlots.every((count) => count === TARGET_PER_PROTOTYPE / 4), `${prototypeId}: answer slots are not exactly balanced: ${correctSlots.join("/")}.`);
  return { prototypeId, accepted, attempts, generationRejects, duplicateRejects, correctSlots };
}

function renderReviewCard(question: FigureCompletionSymmetryQuestionV1, ordinal: number): string {
  const stimulusSvg = renderSpatialSceneToSvg(question.stimulusScene, { ariaLabel: `FGC symmetry review ${ordinal} stimulus` });
  const optionSvgs = question.options.map((option, index) => {
    const label = (["A", "B", "C", "D"] as const)[index];
    return `<div class="option"><div class="label">${label}</div>${renderSpatialSceneToSvg(option.scene, { ariaLabel: `Option ${label}` })}<div class="misconception">${escapeHtml(option.misconception)}</div></div>`;
  }).join("");
  const explanation = [
    question.explanation.observation,
    question.explanation.rule,
    question.explanation.application,
    question.explanation.check,
  ].map((part) => `<li>${escapeHtml(part)}</li>`).join("");
  return `<article class="card"><h2>${ordinal}. ${escapeHtml(question.prototypeId)} — ${question.difficulty}</h2><p>${escapeHtml(question.stem)}</p><div class="stimulus">${stimulusSvg}</div><div class="options">${optionSvgs}</div><p><strong>Answer: ${question.answer}</strong></p><ol>${explanation}</ol><p class="seed">${escapeHtml(question.seed)}</p></article>`;
}

const results = FGC_001_SYMMETRY_PROTOTYPES_V1.map(provePrototype);
const allAccepted = results.flatMap((result) => result.accepted);
assert(allAccepted.length === FGC_001_SYMMETRY_PROTOTYPES_V1.length * TARGET_PER_PROTOTYPE, "FGC symmetry total accepted count mismatch.");
assert(new Set(allAccepted.map((question) => question.contentFingerprint)).size === allAccepted.length, "FGC symmetry cross-prototype content collision detected.");

const reviewQuestions = results.flatMap((result) => result.accepted.slice(0, REVIEW_PER_PROTOTYPE));
const proof = {
  version: "FGC-001-SYMMETRY-DISCOVERY-PROOF-V1",
  chapterCode: "FGC-001",
  status: "PASS_FGC_001_SYMMETRY_DISCOVERY_V1",
  permanentQlCount: 0,
  sourceScope: {
    SSC: "DIRECT_PAPER_EVIDENCE_PRESENT",
    Banking: "NOT_SATURATED",
    PunjabState: "NOT_ESTABLISHED",
  },
  sourceAnchors: [
    "SSC MTS 2017 Shift 3: left/right mirror symmetry completion",
    "SSC MTS 2024 Shift 3: mirror relation plus black/white reversal",
    "SSC CHSL 2025: missing-quadrant geometric symmetry completion",
  ],
  targetPerPrototype: TARGET_PER_PROTOTYPE,
  totalAccepted: allAccepted.length,
  totalAttempts: results.reduce((sum, result) => sum + result.attempts, 0),
  generationRejects: results.reduce((sum, result) => sum + result.generationRejects, 0),
  duplicateRejects: results.reduce((sum, result) => sum + result.duplicateRejects, 0),
  reviewQuestionCount: reviewQuestions.length,
  prototypes: results.map((result) => ({
    prototypeId: result.prototypeId,
    accepted: result.accepted.length,
    attempts: result.attempts,
    generationRejects: result.generationRejects,
    duplicateRejects: result.duplicateRejects,
    correctSlots: result.correctSlots,
    uniqueContent: new Set(result.accepted.map((question) => question.contentFingerprint)).size,
  })),
  lifecycle: {
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
};

const outputDir = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, "spa-fgc-001-symmetry-discovery-v1-review.json"), JSON.stringify(reviewQuestions, null, 2));
writeFileSync(resolve(outputDir, "spa-fgc-001-symmetry-discovery-v1-evidence.json"), JSON.stringify(proof, null, 2));
const cards = reviewQuestions.map((question, index) => renderReviewCard(question, index + 1)).join("\n");
writeFileSync(resolve(outputDir, "spa-fgc-001-symmetry-discovery-v1-review.html"), `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FGC-001 Symmetry Discovery Review</title><style>body{font-family:Arial,sans-serif;margin:20px;line-height:1.45}.card{max-width:900px;margin:0 auto 36px;padding:20px;border:1px solid #bbb;border-radius:10px;break-inside:avoid}.stimulus{max-width:460px;margin:16px auto}.stimulus svg{width:100%;height:auto}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.option{border:1px solid #ccc;padding:8px;text-align:center}.option svg{width:100%;min-width:104px;height:auto}.label{font-weight:bold;margin-bottom:4px}.misconception,.seed{font-size:12px;color:#555;overflow-wrap:anywhere}@media(max-width:640px){.options{grid-template-columns:repeat(2,minmax(0,1fr))}.option svg{min-width:104px}}</style></head><body><h1>FGC-001 Figure Completion — Symmetry Discovery V1</h1><p>16 deterministic learner-review questions across two additional SSC-evidenced provisional families. Permanent QLs and Question Studio remain off.</p>${cards}</body></html>`);

console.log(JSON.stringify(proof, null, 2));
console.log("PASS_FGC_001_SYMMETRY_DISCOVERY_V1");
