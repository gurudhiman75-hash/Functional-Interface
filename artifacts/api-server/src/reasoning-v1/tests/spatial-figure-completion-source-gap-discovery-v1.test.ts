import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  FGC_001_SOURCE_GAP_PROTOTYPES_V1,
  generateFigureCompletionSourceGapQuestionV1,
  type FigureCompletionSourceGapPrototypeV1,
  type FigureCompletionSourceGapQuestionV1,
} from "../foundation/spatial/figure-completion-source-gap-discovery-v1";
import { renderSpatialSceneToSvg } from "../foundation/spatial/svg-renderer";
import { validateLearnerVisibleExplanationV2, validateSpatialPerceptualOptionUniquenessV2 } from "../foundation/spatial/gap-question-perceptual-v2";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "../foundation/spatial/validator";

const TARGET_PER_PROTOTYPE = 80;
const MAX_ATTEMPTS_PER_PROTOTYPE = 500;
const REVIEW_PER_PROTOTYPE = 8;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isRetryable(error: unknown): boolean {
  return error instanceof Error && (
    error.message.includes("semantically equivalent source-gap options") ||
    error.message.includes("perceptually equivalent source-gap options")
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function expectedOpposite(direction: string): string {
  switch (direction) {
    case "UP": return "DOWN";
    case "RIGHT": return "LEFT";
    case "DOWN": return "UP";
    case "LEFT": return "RIGHT";
    default: throw new Error(`Unknown direction ${direction}.`);
  }
}

function assertSourceSpecificProperties(question: FigureCompletionSourceGapQuestionV1): void {
  const correct = question.options[question.correctOptionIndex]!;
  if (question.prototypeId === "FGC-PROT-09-COMPONENT-COUNT-ORIENTATION") {
    const evidence = question.solverEvidence.propertyEvidence;
    assert(evidence.correctGlobalCircleCount === 3, `${question.seed}: P09 must prove exactly three global circles.`);
    assert(evidence.referenceArrowDirection, `${question.seed}: P09 reference arrow direction missing.`);
    assert(evidence.requiredArrowDirection === expectedOpposite(evidence.referenceArrowDirection), `${question.seed}: P09 arrow must be opposite to reference.`);
    assert(correct.scene.nodes.filter((node) => node.role === "completion-circle").length === 1, `${question.seed}: P09 correct option must add exactly one circle.`);
    const countError = question.options.find((option) => option.misconception === "COMPONENT_COUNT_ERROR");
    const orientationError = question.options.find((option) => option.misconception === "ARROW_ORIENTATION_ERROR");
    const bothError = question.options.find((option) => option.misconception === "COUNT_AND_ORIENTATION_ERROR");
    assert(countError && countError.scene.nodes.filter((node) => node.role === "completion-circle").length === 2, `${question.seed}: P09 count-error option must add two circles.`);
    assert(orientationError, `${question.seed}: P09 orientation-error option missing.`);
    assert(bothError && bothError.scene.nodes.filter((node) => node.role === "completion-circle").length === 2, `${question.seed}: P09 combined-error option must add two circles.`);
    assert(question.solverEvidence.sourceAnchor.includes("three circles"), `${question.seed}: P09 source anchor must retain the SSC count rule.`);
    assert(question.solverEvidence.sourceAnchor.includes("opposite"), `${question.seed}: P09 source anchor must retain the SSC direction rule.`);
    return;
  }

  const evidence = question.solverEvidence.propertyEvidence;
  assert(evidence.contactRule === "MATCH_FILL_STATE", `${question.seed}: P10 contact-state rule missing.`);
  assert(evidence.shapeRule === "ORTHOGONAL_CORNER", `${question.seed}: P10 shape-class rule missing.`);
  assert(evidence.flipRule === "NO_VERTICAL_FLIP", `${question.seed}: P10 flip rule missing.`);
  assert(correct.scene.nodes.filter((node) => node.role === "orthogonal-corner").length === 2, `${question.seed}: P10 correct option must retain the orthogonal corner.`);
  const correctFilled = correct.scene.nodes.find((node) => node.role === "contact-partner-filled");
  const correctOutline = correct.scene.nodes.find((node) => node.role === "contact-partner-outline");
  assert(correctFilled?.style?.fill === "currentColor", `${question.seed}: P10 filled contact partner lost filled state.`);
  assert(correctOutline?.style?.fill === "none", `${question.seed}: P10 outline contact partner lost outline state.`);
  const shapeError = question.options.find((option) => option.misconception === "SHAPE_CLASS_ERROR");
  const stateError = question.options.find((option) => option.misconception === "CONTACT_STATE_ERROR");
  const flipError = question.options.find((option) => option.misconception === "VERTICAL_FLIP_ERROR");
  assert(shapeError?.scene.nodes.some((node) => node.role === "slanted-corner"), `${question.seed}: P10 shape-class error must be visibly slanted.`);
  assert(stateError, `${question.seed}: P10 contact-state error missing.`);
  assert(flipError?.scene.nodes.some((node) => node.role === "flipped-corner"), `${question.seed}: P10 vertical-flip error must visibly flip the guide.`);
  assert(question.solverEvidence.sourceAnchor.includes("rhombus-vs-square"), `${question.seed}: P10 source anchor must retain shape-class evidence.`);
  assert(question.solverEvidence.sourceAnchor.includes("contact"), `${question.seed}: P10 source anchor must retain contact-state evidence.`);
}

interface PrototypeProof {
  prototypeId: FigureCompletionSourceGapPrototypeV1;
  accepted: FigureCompletionSourceGapQuestionV1[];
  attempts: number;
  generationRejects: number;
  duplicateRejects: number;
  correctSlots: [number, number, number, number];
}

function provePrototype(prototypeId: FigureCompletionSourceGapPrototypeV1): PrototypeProof {
  const accepted: FigureCompletionSourceGapQuestionV1[] = [];
  const seen = new Set<string>();
  const correctSlots: [number, number, number, number] = [0, 0, 0, 0];
  let attempts = 0;
  let generationRejects = 0;
  let duplicateRejects = 0;

  for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_PROTOTYPE && accepted.length < TARGET_PER_PROTOTYPE; attempt += 1) {
    attempts += 1;
    const seed = `FGC-SOURCE-GAP:${prototypeId}:${String(attempt).padStart(4, "0")}`;
    const desiredCorrectOptionIndex = (accepted.length % 4) as 0 | 1 | 2 | 3;
    let question: FigureCompletionSourceGapQuestionV1;
    try {
      question = generateFigureCompletionSourceGapQuestionV1({ prototypeId, seed, desiredCorrectOptionIndex });
    } catch (error) {
      if (isRetryable(error)) {
        generationRejects += 1;
        continue;
      }
      throw error;
    }
    if (seen.has(question.contentFingerprint)) {
      duplicateRejects += 1;
      continue;
    }
    seen.add(question.contentFingerprint);

    assert(question.permanentQlId === null, `${prototypeId}: permanent QL allocation is forbidden in source-gap discovery.`);
    assert(!question.lifecycle.questionStudioDiscoverable, `${prototypeId}: Question Studio must remain off.`);
    assert(!question.lifecycle.questionBankWritable, `${prototypeId}: Question Bank writes must remain off.`);
    assert(!question.lifecycle.testEligible, `${prototypeId}: test eligibility must remain off.`);
    assert(!question.lifecycle.publiclyPublishable, `${prototypeId}: publication must remain off.`);
    assert(question.answer === (["A", "B", "C", "D"] as const)[question.correctOptionIndex], `${prototypeId}: answer letter mismatch.`);
    assert(question.solverEvidence.matchingOptionIndexes.length === 1 && question.solverEvidence.matchingOptionIndexes[0] === question.correctOptionIndex, `${prototypeId}: completion oracle mismatch.`);
    assert(question.options[question.correctOptionIndex]?.misconception === "CORRECT_FRAGMENT", `${prototypeId}: correct misconception ownership lost.`);
    assert(new Set(question.options.map((option) => option.misconception)).size === 4, `${prototypeId}: four misconception identities must be unique.`);

    assert(validateSpatialScene(question.stimulusScene).ok, `${prototypeId}: invalid stimulus scene.`);
    assert(validateSpatialOptionUniqueness(question.options.map((option) => option.scene)).ok, `${prototypeId}: semantic option uniqueness failed.`);
    assert(validateSpatialPerceptualOptionUniquenessV2(question.options.map((option) => option.scene)).ok, `${prototypeId}: perceptual option uniqueness failed.`);
    const explanation = validateLearnerVisibleExplanationV2([
      question.explanation.observation,
      question.explanation.rule,
      question.explanation.application,
      question.explanation.check,
    ]);
    assert(explanation.ok, `${prototypeId}: learner-visible explanation failed: ${explanation.errors.join(", ")}`);
    assertSourceSpecificProperties(question);

    const replay = generateFigureCompletionSourceGapQuestionV1({ prototypeId, seed, desiredCorrectOptionIndex });
    assert(replay.deliveryFingerprint === question.deliveryFingerprint, `${prototypeId}: deterministic replay failed.`);
    renderSpatialSceneToSvg(question.stimulusScene, { ariaLabel: "FGC source-gap stimulus" });
    question.options.forEach((option, index) => renderSpatialSceneToSvg(option.scene, { ariaLabel: `FGC source-gap option ${index + 1}` }));

    accepted.push(question);
    correctSlots[question.correctOptionIndex] += 1;
  }

  assert(accepted.length === TARGET_PER_PROTOTYPE, `${prototypeId}: reached ${accepted.length}/${TARGET_PER_PROTOTYPE} accepted questions after ${attempts} attempts.`);
  assert(correctSlots.every((count) => count === TARGET_PER_PROTOTYPE / 4), `${prototypeId}: correct-option slots are not exactly balanced: ${correctSlots.join("/")}.`);
  return { prototypeId, accepted, attempts, generationRejects, duplicateRejects, correctSlots };
}

function renderCard(question: FigureCompletionSourceGapQuestionV1, ordinal: number): string {
  const stimulus = renderSpatialSceneToSvg(question.stimulusScene, { ariaLabel: `FGC source-gap review ${ordinal}` });
  const options = question.options.map((option, index) => {
    const label = (["A", "B", "C", "D"] as const)[index];
    const svg = renderSpatialSceneToSvg(option.scene, { ariaLabel: `Option ${label}` });
    return `<div class="option"><strong>${label}</strong>${svg}<small>${escapeHtml(option.misconception)}</small></div>`;
  }).join("");
  const explanation = [question.explanation.observation, question.explanation.rule, question.explanation.application, question.explanation.check]
    .map((part) => `<li>${escapeHtml(part)}</li>`).join("");
  return `<article class="card"><h2>${ordinal}. ${escapeHtml(question.prototypeId)} — ${question.difficulty}</h2><p>${escapeHtml(question.stem)}</p><div class="stimulus">${stimulus}</div><div class="options">${options}</div><p><strong>Answer: ${question.answer}</strong></p><ol>${explanation}</ol><p class="source">${escapeHtml(question.solverEvidence.sourceAnchor)}</p><p class="seed">${escapeHtml(question.seed)}</p></article>`;
}

const results = FGC_001_SOURCE_GAP_PROTOTYPES_V1.map(provePrototype);
const accepted = results.flatMap((result) => result.accepted);
assert(accepted.length === 160, "FGC source-gap proof must contain 160 accepted questions.");
assert(new Set(accepted.map((question) => question.contentFingerprint)).size === accepted.length, "FGC source-gap cross-prototype content collision detected.");

const reviewQuestions = results.flatMap((result) => result.accepted.slice(0, REVIEW_PER_PROTOTYPE));
const proof = {
  version: "FGC-001-SOURCE-GAP-DISCOVERY-PROOF-V1",
  chapterCode: "FGC-001",
  status: "PASS_FGC_001_SSC_SOURCE_GAP_EXECUTABLE_DISCOVERY_V1",
  permanentQlCount: 0,
  sourceScope: {
    SSC: "DIRECT_PREVIOUS_PAPER_GAP_EVIDENCE_EXECUTABLE",
    Banking: "NOT_ESTABLISHED",
    PunjabState: "NOT_ESTABLISHED",
  },
  targetPerPrototype: TARGET_PER_PROTOTYPE,
  totalAccepted: accepted.length,
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
  taxonomyDisposition: {
    "FGC-PROT-09-COMPONENT-COUNT-ORIENTATION": "MERGE_INTO_FGC_CAND_B_FEATURE_PROPERTY_COMPLETION",
    "FGC-PROT-10-SHAPE-CONTACT-STATE": "MERGE_INTO_FGC_CAND_D_COMPOUND_SYMMETRY_STATE",
    newCandidateAuthorityCount: 0,
  },
  lifecycle: {
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
};

const outputDir = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, "spa-fgc-001-source-gap-discovery-v1-review.json"), JSON.stringify(reviewQuestions, null, 2));
writeFileSync(resolve(outputDir, "spa-fgc-001-source-gap-discovery-v1-evidence.json"), JSON.stringify(proof, null, 2));
const cards = reviewQuestions.map((question, index) => renderCard(question, index + 1)).join("\n");
writeFileSync(resolve(outputDir, "spa-fgc-001-source-gap-discovery-v1-review.html"), `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FGC-001 SSC Source-Gap Review</title><style>body{font-family:Arial,sans-serif;margin:20px;line-height:1.45}.card{max-width:900px;margin:0 auto 36px;padding:20px;border:1px solid #bbb;border-radius:10px}.stimulus{max-width:460px;margin:16px auto}.stimulus svg{width:100%;height:auto}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.option{border:1px solid #ccc;padding:8px;text-align:center}.option svg{width:100%;min-width:104px;height:auto}.option small,.source,.seed{display:block;font-size:12px;color:#555;overflow-wrap:anywhere}@media(max-width:640px){.options{grid-template-columns:repeat(2,minmax(0,1fr))}.option svg{min-width:104px}}</style></head><body><h1>FGC-001 — SSC Source-Gap Discovery V1</h1><p>16 learner-review questions across two source-evidenced representation gaps. Permanent QLs and downstream lifecycle remain off.</p>${cards}</body></html>`);

console.log(JSON.stringify(proof, null, 2));
console.log("PASS_FGC_001_SSC_SOURCE_GAP_EXECUTABLE_DISCOVERY_V1");
