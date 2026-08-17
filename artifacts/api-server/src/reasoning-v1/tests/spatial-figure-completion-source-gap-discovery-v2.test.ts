import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  FGC_001_SOURCE_GAP_PROTOTYPES_V1,
  generateFigureCompletionSourceGapQuestionV2,
  type FigureCompletionSourceGapPrototypeV1,
  type FigureCompletionSourceGapQuestionV2,
} from "../foundation/spatial/figure-completion-source-gap-discovery-v2";
import { renderSpatialSceneToSvg } from "../foundation/spatial/svg-renderer";
import { validateLearnerVisibleExplanationV2, validateSpatialPerceptualOptionUniquenessV2 } from "../foundation/spatial/gap-question-perceptual-v2";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "../foundation/spatial/validator";
import type { SpatialCircleNode, SpatialLineNode, SpatialPoint } from "../foundation/spatial/types";

const TARGET = 80;
const REVIEW = 8;
const MAX_ATTEMPTS = 600;
const EPS = 1e-7;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function retryable(error: unknown): boolean {
  return error instanceof Error && (
    error.message.includes("semantically equivalent source-gap options") ||
    error.message.includes("perceptually equivalent source-gap options")
  );
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function distance(a: SpatialPoint, b: SpatialPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointSegmentDistance(point: SpatialPoint, line: SpatialLineNode): number {
  const vx = line.end.x - line.start.x;
  const vy = line.end.y - line.start.y;
  const wx = point.x - line.start.x;
  const wy = point.y - line.start.y;
  const vv = vx * vx + vy * vy;
  const t = vv <= EPS ? 0 : Math.max(0, Math.min(1, (wx * vx + wy * vy) / vv));
  return Math.hypot(point.x - (line.start.x + t * vx), point.y - (line.start.y + t * vy));
}

function assertP09Layout(question: FigureCompletionSourceGapQuestionV2): void {
  if (question.prototypeId !== "FGC-PROT-09-COMPONENT-COUNT-ORIENTATION") return;
  const evidence = question.solverEvidence.propertyEvidence;
  assert(evidence.correctGlobalCircleCount === 3, `${question.seed}: P09 must retain three-circle authority.`);
  assert(evidence.referenceArrowDirection === "LEFT" || evidence.referenceArrowDirection === "RIGHT", `${question.seed}: P09 V2 must use learner-clear horizontal reference arrows.`);
  assert(evidence.requiredArrowDirection === (evidence.referenceArrowDirection === "LEFT" ? "RIGHT" : "LEFT"), `${question.seed}: P09 arrow direction is not opposite.`);
  const correct = question.options[question.correctOptionIndex]!.scene;
  const completionCircles = correct.nodes.filter((node): node is SpatialCircleNode => node.kind === "circle" && node.role === "completion-circle");
  const completionArrow = correct.nodes.filter((node): node is SpatialLineNode => node.kind === "line" && node.role === "completion-arrow");
  assert(completionCircles.length === 1, `${question.seed}: P09 correct option must add exactly one circle.`);
  assert(completionArrow.length === 3, `${question.seed}: P09 correct option must contain one three-stroke arrow.`);
  const circle = completionCircles[0]!;
  const minimumDistance = Math.min(...completionArrow.map((segment) => pointSegmentDistance(circle.center, segment)));
  assert(minimumDistance >= circle.radius + 3, `${question.seed}: P09 circle and arrow are too close at 104px review scale.`);
  const countError = question.options.find((option) => option.misconception === "COMPONENT_COUNT_ERROR")!;
  assert(countError.scene.nodes.filter((node) => node.kind === "circle" && node.role === "completion-circle").length === 2, `${question.seed}: P09 count trap must visibly add one extra circle.`);
}

function assertP10Layout(question: FigureCompletionSourceGapQuestionV2): void {
  if (question.prototypeId !== "FGC-PROT-10-SHAPE-CONTACT-STATE") return;
  const correct = question.options[question.correctOptionIndex]!.scene;
  const filled = correct.nodes.find((node): node is SpatialCircleNode => node.kind === "circle" && node.role === "contact-partner-filled");
  const outline = correct.nodes.find((node): node is SpatialCircleNode => node.kind === "circle" && node.role === "contact-partner-outline");
  assert(filled && outline, `${question.seed}: P10 correct contact partners missing.`);
  const independentSeparation = distance(filled.center, outline.center);
  assert(independentSeparation >= filled.radius + outline.radius + 3, `${question.seed}: P10 independent contact partners visually overlap.`);
  assert(question.solverEvidence.propertyEvidence.minimumIndependentFeatureSeparation === independentSeparation, `${question.seed}: P10 separation evidence drifted.`);
  assert(question.solverEvidence.propertyEvidence.contactRule === "MATCH_FILL_STATE", `${question.seed}: P10 contact rule missing.`);
  assert(question.solverEvidence.propertyEvidence.shapeRule === "ORTHOGONAL_CORNER", `${question.seed}: P10 shape rule missing.`);
  assert(question.solverEvidence.propertyEvidence.flipRule === "NO_VERTICAL_FLIP", `${question.seed}: P10 flip rule missing.`);
  assert(filled.style?.fill === "currentColor", `${question.seed}: P10 filled partner state drifted.`);
  assert(outline.style?.fill === "none", `${question.seed}: P10 outline partner state drifted.`);
  const guideLines = correct.nodes.filter((node): node is SpatialLineNode => node.kind === "line" && node.role === "orthogonal-corner");
  assert(guideLines.length === 2, `${question.seed}: P10 correct orthogonal corner must use two lines.`);
  const a = guideLines[0]!;
  const b = guideLines[1]!;
  const av = { x: a.end.x - a.start.x, y: a.end.y - a.start.y };
  const bv = { x: b.end.x - b.start.x, y: b.end.y - b.start.y };
  assert(Math.abs(av.x * bv.x + av.y * bv.y) <= EPS, `${question.seed}: P10 correct shape corner is not orthogonal.`);
  assert(question.options.some((option) => option.misconception === "SHAPE_CLASS_ERROR" && option.scene.nodes.some((node) => node.role === "slanted-corner")), `${question.seed}: P10 slanted shape-class trap missing.`);
  assert(question.options.some((option) => option.misconception === "CONTACT_STATE_ERROR"), `${question.seed}: P10 contact-state trap missing.`);
  assert(question.options.some((option) => option.misconception === "VERTICAL_FLIP_ERROR" && option.scene.nodes.some((node) => node.role === "flipped-corner")), `${question.seed}: P10 vertical-flip trap missing.`);
}

interface Result {
  prototypeId: FigureCompletionSourceGapPrototypeV1;
  accepted: FigureCompletionSourceGapQuestionV2[];
  attempts: number;
  generationRejects: number;
  duplicateRejects: number;
  slots: [number, number, number, number];
}

function prove(prototypeId: FigureCompletionSourceGapPrototypeV1): Result {
  const accepted: FigureCompletionSourceGapQuestionV2[] = [];
  const seen = new Set<string>();
  const slots: [number, number, number, number] = [0, 0, 0, 0];
  let attempts = 0;
  let generationRejects = 0;
  let duplicateRejects = 0;

  for (let attempt = 0; attempt < MAX_ATTEMPTS && accepted.length < TARGET; attempt += 1) {
    attempts += 1;
    const seed = `FGC-SOURCE-GAP-V2:${prototypeId}:${String(attempt).padStart(4, "0")}`;
    const desiredCorrectOptionIndex = (accepted.length % 4) as 0 | 1 | 2 | 3;
    let question: FigureCompletionSourceGapQuestionV2;
    try {
      question = generateFigureCompletionSourceGapQuestionV2({ prototypeId, seed, desiredCorrectOptionIndex });
    } catch (error) {
      if (retryable(error)) { generationRejects += 1; continue; }
      throw error;
    }
    if (seen.has(question.contentFingerprint)) { duplicateRejects += 1; continue; }
    seen.add(question.contentFingerprint);

    assert(question.permanentQlId === null, `${prototypeId}: permanent QL allocation forbidden.`);
    assert(!question.lifecycle.questionStudioDiscoverable && !question.lifecycle.questionBankWritable && !question.lifecycle.testEligible && !question.lifecycle.publiclyPublishable, `${prototypeId}: discovery lifecycle must remain fully off.`);
    assert(question.answer === (["A", "B", "C", "D"] as const)[question.correctOptionIndex], `${prototypeId}: answer mismatch.`);
    assert(question.options[question.correctOptionIndex]?.misconception === "CORRECT_FRAGMENT", `${prototypeId}: correct option ownership lost.`);
    assert(new Set(question.options.map((option) => option.misconception)).size === 4, `${prototypeId}: misconception options must be unique.`);
    assert(question.solverEvidence.matchingOptionIndexes.length === 1 && question.solverEvidence.matchingOptionIndexes[0] === question.correctOptionIndex, `${prototypeId}: reconstruction oracle mismatch.`);
    assert(validateSpatialScene(question.stimulusScene).ok, `${prototypeId}: invalid stimulus.`);
    assert(validateSpatialOptionUniqueness(question.options.map((option) => option.scene)).ok, `${prototypeId}: semantic option collision.`);
    assert(validateSpatialPerceptualOptionUniquenessV2(question.options.map((option) => option.scene)).ok, `${prototypeId}: perceptual option collision.`);
    const explanation = validateLearnerVisibleExplanationV2([question.explanation.observation, question.explanation.rule, question.explanation.application, question.explanation.check]);
    assert(explanation.ok, `${prototypeId}: explanation visibility failed: ${explanation.errors.join(", ")}`);
    assertP09Layout(question);
    assertP10Layout(question);

    const replay = generateFigureCompletionSourceGapQuestionV2({ prototypeId, seed, desiredCorrectOptionIndex });
    assert(replay.deliveryFingerprint === question.deliveryFingerprint, `${prototypeId}: deterministic replay failed.`);
    renderSpatialSceneToSvg(question.stimulusScene, { ariaLabel: "FGC source gap V2 stimulus" });
    question.options.forEach((option, index) => renderSpatialSceneToSvg(option.scene, { ariaLabel: `FGC source gap V2 option ${index + 1}` }));
    accepted.push(question);
    slots[question.correctOptionIndex] += 1;
  }

  assert(accepted.length === TARGET, `${prototypeId}: reached ${accepted.length}/${TARGET} accepted V2 questions after ${attempts} attempts.`);
  assert(slots.every((count) => count === 20), `${prototypeId}: answer slots not balanced: ${slots.join("/")}.`);
  return { prototypeId, accepted, attempts, generationRejects, duplicateRejects, slots };
}

function card(question: FigureCompletionSourceGapQuestionV2, ordinal: number): string {
  const stimulus = renderSpatialSceneToSvg(question.stimulusScene, { ariaLabel: `FGC source gap V2 ${ordinal}` });
  const options = question.options.map((option, index) => {
    const label = (["A", "B", "C", "D"] as const)[index];
    return `<div class="option"><strong>${label}</strong>${renderSpatialSceneToSvg(option.scene, { ariaLabel: `Option ${label}` })}<small>${escapeHtml(option.misconception)}</small></div>`;
  }).join("");
  const explanation = [question.explanation.observation, question.explanation.rule, question.explanation.application, question.explanation.check].map((part) => `<li>${escapeHtml(part)}</li>`).join("");
  return `<article class="card"><h2>${ordinal}. ${escapeHtml(question.prototypeId)} — ${question.difficulty}</h2><p>${escapeHtml(question.stem)}</p><div class="stimulus">${stimulus}</div><div class="options">${options}</div><p><strong>Answer: ${question.answer}</strong></p><ol>${explanation}</ol><p class="source">${escapeHtml(question.solverEvidence.sourceAnchor)}</p><p class="seed">${escapeHtml(question.seed)}</p></article>`;
}

const results = FGC_001_SOURCE_GAP_PROTOTYPES_V1.map(prove);
const all = results.flatMap((result) => result.accepted);
assert(all.length === 160, "FGC source-gap V2 must prove 160 questions.");
assert(new Set(all.map((question) => question.contentFingerprint)).size === 160, "FGC source-gap V2 cross-prototype collision detected.");
const review = results.flatMap((result) => result.accepted.slice(0, REVIEW));

const proof = {
  version: "FGC-001-SOURCE-GAP-DISCOVERY-PROOF-V2",
  chapterCode: "FGC-001",
  status: "PASS_FGC_001_SSC_SOURCE_GAP_EXECUTABLE_DISCOVERY_V2",
  permanentQlCount: 0,
  humanRemediation: {
    p09HorizontalArrowCircleSeparation: true,
    p10IndependentContactPartnersSeparated: true,
    p10MatchingContactState: true,
    p10OrthogonalShapeClass: true,
    p10VerticalFlipTrap: true,
  },
  sourceScope: { SSC: "DIRECT_PREVIOUS_PAPER_GAP_EVIDENCE_EXECUTABLE", Banking: "NOT_ESTABLISHED", PunjabState: "NOT_ESTABLISHED" },
  totalAccepted: all.length,
  targetPerPrototype: TARGET,
  reviewQuestionCount: review.length,
  prototypes: results.map((result) => ({ prototypeId: result.prototypeId, accepted: result.accepted.length, attempts: result.attempts, generationRejects: result.generationRejects, duplicateRejects: result.duplicateRejects, correctSlots: result.slots, uniqueContent: new Set(result.accepted.map((question) => question.contentFingerprint)).size })),
  taxonomyDisposition: {
    "FGC-PROT-09-COMPONENT-COUNT-ORIENTATION": "MERGE_INTO_FGC_CAND_B_FEATURE_PROPERTY_COMPLETION",
    "FGC-PROT-10-SHAPE-CONTACT-STATE": "MERGE_INTO_FGC_CAND_D_COMPOUND_SYMMETRY_STATE",
    newCandidateAuthorityCount: 0,
  },
  lifecycle: { questionStudioDiscoverable: false, questionBankWritable: false, testEligible: false, publiclyPublishable: false },
};

const output = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(output, { recursive: true });
writeFileSync(resolve(output, "spa-fgc-001-source-gap-discovery-v2-review.json"), JSON.stringify(review, null, 2));
writeFileSync(resolve(output, "spa-fgc-001-source-gap-discovery-v2-evidence.json"), JSON.stringify(proof, null, 2));
const cards = review.map((question, index) => card(question, index + 1)).join("\n");
writeFileSync(resolve(output, "spa-fgc-001-source-gap-discovery-v2-review.html"), `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FGC-001 Source Gap V2</title><style>body{font-family:Arial,sans-serif;margin:20px;line-height:1.45}.card{max-width:900px;margin:0 auto 36px;padding:20px;border:1px solid #bbb;border-radius:10px}.stimulus{max-width:460px;margin:16px auto}.stimulus svg{width:100%;height:auto}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.option{border:1px solid #ccc;padding:8px;text-align:center}.option svg{width:100%;min-width:104px;height:auto}.option small,.source,.seed{display:block;font-size:12px;color:#555;overflow-wrap:anywhere}@media(max-width:640px){.options{grid-template-columns:repeat(2,minmax(0,1fr))}.option svg{min-width:104px}}</style></head><body><h1>FGC-001 — SSC Source-Gap Discovery V2</h1><p>16 learner-review questions after direct mobile-geometry remediation. Permanent QLs and downstream lifecycle remain off.</p>${cards}</body></html>`);

console.log(JSON.stringify(proof, null, 2));
console.log("PASS_FGC_001_SSC_SOURCE_GAP_EXECUTABLE_DISCOVERY_V2");
