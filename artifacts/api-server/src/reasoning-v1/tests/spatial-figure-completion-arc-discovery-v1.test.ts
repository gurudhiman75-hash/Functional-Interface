import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  FGC_001_ARC_PROTOTYPE_V1,
  generateFigureCompletionArcQuestionV1,
  type FigureCompletionArcQuestionV1,
} from "../foundation/spatial/figure-completion-arc-discovery-v1";
import { renderSpatialSceneToSvg } from "../foundation/spatial/svg-renderer";
import { validateSpatialScene, validateSpatialOptionUniqueness } from "../foundation/spatial/validator";
import {
  validateLearnerVisibleExplanationV2,
  validateSpatialPerceptualOptionUniquenessV2,
} from "../foundation/spatial/gap-question-perceptual-v2";

const TARGET = 80;
const MAX_ATTEMPTS = 500;
const REVIEW_COUNT = 8;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const accepted: FigureCompletionArcQuestionV1[] = [];
const seen = new Set<string>();
const correctSlots: [number, number, number, number] = [0, 0, 0, 0];
let attempts = 0;
let duplicateRejects = 0;

for (let index = 0; index < MAX_ATTEMPTS && accepted.length < TARGET; index += 1) {
  attempts += 1;
  const seed = `FGC-ARC:${String(index).padStart(4, "0")}`;
  const desiredCorrectOptionIndex = (accepted.length % 4) as 0 | 1 | 2 | 3;
  const question = generateFigureCompletionArcQuestionV1({ seed, desiredCorrectOptionIndex });
  if (seen.has(question.contentFingerprint)) {
    duplicateRejects += 1;
    continue;
  }
  seen.add(question.contentFingerprint);

  assert(question.permanentQlId === null, "FGC arc stress family must not allocate a permanent QL.");
  assert(question.lifecycle.maturity === "EXECUTABLE_DISCOVERY_PROOF", "FGC arc maturity drifted.");
  assert(!question.lifecycle.questionStudioDiscoverable, "FGC arc Question Studio must remain off.");
  assert(!question.lifecycle.questionBankWritable, "FGC arc Question Bank writes must remain off.");
  assert(!question.lifecycle.testEligible, "FGC arc test eligibility must remain off.");
  assert(!question.lifecycle.publiclyPublishable, "FGC arc publication must remain off.");
  assert(question.answer === (["A", "B", "C", "D"] as const)[question.correctOptionIndex], "FGC arc answer letter mismatch.");
  assert(question.solverEvidence.matchingOptionIndexes.length === 1, "FGC arc solver must find exactly one completion.");
  assert(question.solverEvidence.matchingOptionIndexes[0] === question.correctOptionIndex, "FGC arc solver answer mismatch.");
  assert(question.options[question.correctOptionIndex]?.misconception === "CORRECT_FRAGMENT", "FGC arc correct option lost ownership.");
  assert(new Set(question.options.map((option) => option.misconception)).size === 4, "FGC arc misconception ownership must be unique.");

  assert(validateSpatialScene(question.stimulusScene).ok, "FGC arc stimulus scene is invalid.");
  assert(validateSpatialOptionUniqueness(question.options.map((option) => option.scene)).ok, "FGC arc semantic option uniqueness failed.");
  assert(validateSpatialPerceptualOptionUniquenessV2(question.options.map((option) => option.scene)).ok, "FGC arc perceptual option uniqueness failed.");
  const explanation = validateLearnerVisibleExplanationV2([
    question.explanation.observation,
    question.explanation.rule,
    question.explanation.application,
    question.explanation.check,
  ]);
  assert(explanation.ok, `FGC arc explanation failed: ${explanation.errors.join(", ")}`);

  const replay = generateFigureCompletionArcQuestionV1({ seed, desiredCorrectOptionIndex });
  assert(replay.deliveryFingerprint === question.deliveryFingerprint, "FGC arc deterministic replay failed.");
  renderSpatialSceneToSvg(question.stimulusScene, { ariaLabel: "FGC arc completion stimulus" });
  question.options.forEach((option, optionIndex) => {
    renderSpatialSceneToSvg(option.scene, { ariaLabel: `FGC arc option ${optionIndex + 1}` });
  });

  accepted.push(question);
  correctSlots[question.correctOptionIndex] += 1;
}

assert(accepted.length === TARGET, `FGC arc stress family reached ${accepted.length}/${TARGET} unique questions after ${attempts} attempts.`);
assert(correctSlots.every((count) => count === TARGET / 4), `FGC arc answer slots are not balanced: ${correctSlots.join("/")}.`);

const review = accepted.slice(0, REVIEW_COUNT);
const evidence = {
  version: "FGC-001-ARC-DISCOVERY-PROOF-V1",
  chapterCode: "FGC-001",
  prototypeId: FGC_001_ARC_PROTOTYPE_V1,
  status: "PASS_FGC_001_ARC_DISCOVERY_V1",
  permanentQlCount: 0,
  disposition: "PROVISIONAL_REPRESENTATION_STRESS_CANDIDATE_MERGE_INTO_SYMMETRY",
  sourceScope: {
    SSC: "DIRECT_CHSL_ARC_COMPLETION_EVIDENCE_PRESENT",
    Banking: "NOT_SATURATED",
    PunjabState: "NOT_ESTABLISHED",
  },
  target: TARGET,
  accepted: accepted.length,
  attempts,
  duplicateRejects,
  correctSlots,
  reviewQuestionCount: review.length,
  lifecycle: accepted[0]!.lifecycle,
};

function reviewCard(question: FigureCompletionArcQuestionV1, ordinal: number): string {
  const stimulus = renderSpatialSceneToSvg(question.stimulusScene, { ariaLabel: `FGC arc review ${ordinal} stimulus` });
  const options = question.options.map((option, index) => {
    const label = (["A", "B", "C", "D"] as const)[index];
    return `<div class="option"><div class="label">${label}</div>${renderSpatialSceneToSvg(option.scene, { ariaLabel: `Option ${label}` })}<div class="misconception">${escapeHtml(option.misconception)}</div></div>`;
  }).join("");
  const explanation = [question.explanation.observation, question.explanation.rule, question.explanation.application, question.explanation.check]
    .map((part) => `<li>${escapeHtml(part)}</li>`).join("");
  return `<article class="card"><h2>${ordinal}. ${question.prototypeId}</h2><p>${escapeHtml(question.stem)}</p><div class="stimulus">${stimulus}</div><div class="options">${options}</div><p><strong>Answer: ${question.answer}</strong></p><ol>${explanation}</ol><p class="seed">${escapeHtml(question.seed)}</p></article>`;
}

const outputDir = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, "spa-fgc-001-arc-discovery-v1-evidence.json"), JSON.stringify(evidence, null, 2));
writeFileSync(resolve(outputDir, "spa-fgc-001-arc-discovery-v1-review.json"), JSON.stringify(review, null, 2));
const cards = review.map((question, index) => reviewCard(question, index + 1)).join("\n");
writeFileSync(resolve(outputDir, "spa-fgc-001-arc-discovery-v1-review.html"), `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FGC-001 Arc Discovery Review</title><style>body{font-family:Arial,sans-serif;margin:20px;line-height:1.45}.card{max-width:900px;margin:0 auto 36px;padding:20px;border:1px solid #bbb;border-radius:10px;break-inside:avoid}.stimulus{max-width:460px;margin:16px auto}.stimulus svg{width:100%;height:auto}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.option{border:1px solid #ccc;padding:8px;text-align:center}.option svg{width:100%;min-width:104px;height:auto}.label{font-weight:bold;margin-bottom:4px}.misconception,.seed{font-size:12px;color:#555;overflow-wrap:anywhere}@media(max-width:640px){.options{grid-template-columns:repeat(2,minmax(0,1fr))}.option svg{min-width:104px}}</style></head><body><h1>FGC-001 Figure Completion — Arc Symmetry Stress Review</h1><p>8 learner-review questions proving actual quarter-circle completion geometry. This remains a provisional representation stress family and consumes no permanent QL.</p>${cards}</body></html>`);

console.log(JSON.stringify(evidence, null, 2));
console.log("PASS_FGC_001_ARC_DISCOVERY_V1");
