import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  EMB_001_DISCOVERY_HARDENING_AUTHORITY_V1_1,
  EMB_001_PROTOTYPES_V1,
  generateEmbeddedFigureDiscoveryQuestionV1_1,
  type EmbeddedFigurePrototypeV1,
  type EmbeddedFigureQuestionV1,
} from "../foundation/spatial/embedded-figures-discovery-v1-1";
import {
  figureGraphFingerprintV1,
  spatialSceneToFigureGraphV1,
} from "../foundation/spatial/figure-graph-v1";
import { renderSpatialSceneToSvg } from "../foundation/spatial/svg-renderer";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "../foundation/spatial/validator";
import {
  validateLearnerVisibleExplanationV2,
  validateSpatialPerceptualOptionUniquenessV2,
} from "../foundation/spatial/gap-question-perceptual-v2";
import type { SpatialScene } from "../foundation/spatial/types";

const TARGET_PER_PROTOTYPE = 80;
const MAX_ATTEMPTS_PER_PROTOTYPE = 1200;
const REVIEW_PER_PROTOTYPE = 6;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function retryable(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.message.includes("unique answer") ||
    error.message.includes("not semantically unique") ||
    error.message.includes("perceptually") ||
    error.message.includes("option scenes are not unique");
}

function idAndOrderChanged(scene: SpatialScene): SpatialScene {
  return {
    ...scene,
    id: `${scene.id}:id-order-audit`,
    nodes: [...scene.nodes].reverse().map((node, index) => ({ ...node, id: `renamed-${index}` })),
  };
}

interface PrototypeProof {
  prototypeId: EmbeddedFigurePrototypeV1;
  accepted: EmbeddedFigureQuestionV1[];
  attempts: number;
  generationRejects: number;
  perceptualRejects: number;
  duplicateRejects: number;
  correctSlots: [number, number, number, number];
}

function provePrototype(prototypeId: EmbeddedFigurePrototypeV1): PrototypeProof {
  const accepted: EmbeddedFigureQuestionV1[] = [];
  const seenContent = new Set<string>();
  const correctSlots: [number, number, number, number] = [0, 0, 0, 0];
  let attempts = 0;
  let generationRejects = 0;
  let perceptualRejects = 0;
  let duplicateRejects = 0;

  for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_PROTOTYPE && accepted.length < TARGET_PER_PROTOTYPE; attempt += 1) {
    attempts += 1;
    const seed = `EMB-DISCOVERY-V1:${prototypeId}:${String(attempt).padStart(4, "0")}`;
    const desiredCorrectOptionIndex = (accepted.length % 4) as 0 | 1 | 2 | 3;
    let question: EmbeddedFigureQuestionV1;
    try {
      question = generateEmbeddedFigureDiscoveryQuestionV1_1({ prototypeId, seed, desiredCorrectOptionIndex });
    } catch (error) {
      if (!retryable(error)) throw error;
      generationRejects += 1;
      continue;
    }

    if (seenContent.has(question.contentFingerprint)) {
      duplicateRejects += 1;
      continue;
    }

    assert(question.permanentQlId === null, `${prototypeId}: discovery must not allocate a permanent QL.`);
    assert(question.lifecycle.maturity === "EXECUTABLE_DISCOVERY_PROOF", `${prototypeId}: incorrect maturity.`);
    assert(!question.lifecycle.questionStudioDiscoverable, `${prototypeId}: Question Studio must remain off.`);
    assert(question.lifecycle.questionStudioRegistration === "NOT_REGISTERED", `${prototypeId}: registration must remain locked.`);
    assert(!question.lifecycle.questionBankWritable, `${prototypeId}: Question Bank must remain off.`);
    assert(!question.lifecycle.testEligible, `${prototypeId}: test eligibility must remain off.`);
    assert(!question.lifecycle.publiclyPublishable, `${prototypeId}: public publication must remain off.`);
    assert(!question.lifecycle.automaticPublication, `${prototypeId}: automatic publication must remain off.`);
    assert(question.options.length === 4, `${prototypeId}: expected exactly four options.`);
    assert(question.answer === (["A", "B", "C", "D"] as const)[question.correctOptionIndex], `${prototypeId}: answer letter mismatch.`);
    assert(question.correctOptionIndex === desiredCorrectOptionIndex, `${prototypeId}: requested answer slot was not preserved.`);
    assert(question.solverEvidence.matchingOptionIndexes.length === 1, `${prototypeId}: graph solver found ${question.solverEvidence.matchingOptionIndexes.length} matching options.`);
    assert(question.solverEvidence.matchingOptionIndexes[0] === question.correctOptionIndex, `${prototypeId}: graph solver answer mismatch.`);
    assert(question.options[question.correctOptionIndex]?.misconception === "CORRECT_EMBEDDING", `${prototypeId}: correct-option misconception ownership lost.`);
    assert(new Set(question.options.map((option) => option.misconception)).size === 4, `${prototypeId}: misconception labels must be unique.`);
    assert(question.matchPolicy.allowScale === false, `${prototypeId}: undeclared scaling must remain forbidden.`);
    assert(question.matchPolicy.allowReflection === false, `${prototypeId}: reflection must remain disallowed in V1.`);
    assert(validateSpatialScene(question.targetScene).ok, `${prototypeId}: target scene is invalid.`);
    question.options.forEach((option, index) => assert(validateSpatialScene(option.scene).ok, `${prototypeId}: option ${index} scene invalid.`));
    assert(validateSpatialOptionUniqueness(question.options.map((option) => option.scene)).ok, `${prototypeId}: semantic option uniqueness failed.`);

    const perceptual = validateSpatialPerceptualOptionUniquenessV2(question.options.map((option) => option.scene));
    if (!perceptual.ok) {
      perceptualRejects += 1;
      continue;
    }

    const explanation = validateLearnerVisibleExplanationV2([
      question.explanation.observation,
      question.explanation.rule,
      question.explanation.application,
      question.explanation.check,
    ]);
    assert(explanation.ok, `${prototypeId}: explanation failed learner visibility: ${explanation.errors.join(", ")}`);

    const targetGraph = spatialSceneToFigureGraphV1(question.targetScene);
    const renamedGraph = spatialSceneToFigureGraphV1(idAndOrderChanged(question.targetScene));
    assert(figureGraphFingerprintV1(targetGraph) === figureGraphFingerprintV1(renamedGraph), `${prototypeId}: graph fingerprint depends on node IDs/order.`);
    assert(question.solverEvidence.targetGraphFingerprint === figureGraphFingerprintV1(targetGraph), `${prototypeId}: target graph evidence mismatch.`);

    const reflectedOption = question.options.find((option) => option.misconception === "REFLECTED_TARGET_ONLY");
    if (reflectedOption) assert(reflectedOption.embeddingCount === 0, `${prototypeId}: reflected distractor passed while reflection is disallowed.`);

    if (prototypeId === "EMB-PROT-06-MIXED-CURVE-LINE") {
      assert(targetGraph.arcs.length === 1, `${prototypeId}: mixed-curve target must contain one exact arc.`);
      const wrongRadius = question.options.find((option) => option.misconception === "WRONG_CURVE_RADIUS");
      const wrongSweep = question.options.find((option) => option.misconception === "WRONG_CURVE_SWEEP");
      assert(wrongRadius?.embeddingCount === 0, `${prototypeId}: wrong-radius arc passed the graph matcher.`);
      assert(wrongSweep?.embeddingCount === 0, `${prototypeId}: wrong-sweep arc passed the graph matcher.`);
    }

    const correctScene = question.options[question.correctOptionIndex]!.scene;
    assert(correctScene.nodes.filter((node) => node.role === "clutter").length >= 4, `${prototypeId}: correct host is not sufficiently embedded in clutter.`);
    assert(correctScene.nodes.every((node) => node.style?.stroke !== "#d00"), `${prototypeId}: target must not be highlighted in learner options.`);

    const replay = generateEmbeddedFigureDiscoveryQuestionV1_1({ prototypeId, seed, desiredCorrectOptionIndex });
    assert(replay.deliveryFingerprint === question.deliveryFingerprint, `${prototypeId}: deterministic replay failed.`);
    const alternate = generateEmbeddedFigureDiscoveryQuestionV1_1({ prototypeId, seed: `${seed}:ALT`, desiredCorrectOptionIndex });
    assert(alternate.contentFingerprint !== question.contentFingerprint, `${prototypeId}: alternate seed did not diverge.`);

    renderSpatialSceneToSvg(question.targetScene, { ariaLabel: "Embedded figure target" });
    question.options.forEach((option, index) => renderSpatialSceneToSvg(option.scene, { ariaLabel: `Embedded figure option ${index + 1}` }));

    seenContent.add(question.contentFingerprint);
    accepted.push(question);
    correctSlots[question.correctOptionIndex] += 1;
  }

  assert(accepted.length === TARGET_PER_PROTOTYPE, `${prototypeId}: only ${accepted.length}/${TARGET_PER_PROTOTYPE} accepted after ${attempts} attempts.`);
  assert(correctSlots.every((count) => count === 20), `${prototypeId}: answer slots not balanced: ${correctSlots.join("/")}.`);
  return { prototypeId, accepted, attempts, generationRejects, perceptualRejects, duplicateRejects, correctSlots };
}

function renderReviewCard(question: EmbeddedFigureQuestionV1, ordinal: number): string {
  const target = renderSpatialSceneToSvg(question.targetScene, { ariaLabel: `EMB review ${ordinal} problem figure` });
  const options = question.options.map((option, index) => {
    const label = (["A", "B", "C", "D"] as const)[index];
    return `<div class="option"><div class="label">${label}</div>${renderSpatialSceneToSvg(option.scene, { ariaLabel: `EMB option ${label}` })}<div class="misconception">${escapeHtml(option.misconception)}</div></div>`;
  }).join("");
  const explanation = [question.explanation.observation, question.explanation.rule, question.explanation.application, question.explanation.check]
    .map((part) => `<li>${escapeHtml(part)}</li>`).join("");
  return `<article class="card"><h2>${ordinal}. ${escapeHtml(question.prototypeId)} — ${question.difficulty}</h2><p>${escapeHtml(question.stem)}</p><div class="target"><div class="problem-label">Problem figure</div>${target}</div><div class="options">${options}</div><p><strong>Answer: ${question.answer}</strong></p><ol>${explanation}</ol><p class="seed">${escapeHtml(question.seed)}</p></article>`;
}

assert(EMB_001_DISCOVERY_HARDENING_AUTHORITY_V1_1.permanentQlAllocationAllowed === false, "EMB hardening must not authorize permanent QLs.");
assert(EMB_001_DISCOVERY_HARDENING_AUTHORITY_V1_1.questionStudioRegistrationAllowed === false, "EMB hardening must not authorize Question Studio registration.");

const results = EMB_001_PROTOTYPES_V1.map(provePrototype);
const accepted = results.flatMap((result) => result.accepted);
assert(accepted.length === 480, `EMB-001 total accepted mismatch: ${accepted.length}.`);
assert(new Set(accepted.map((question) => question.contentFingerprint)).size === accepted.length, "EMB-001 cross-prototype content collision detected.");

const reviewQuestions = results.flatMap((result) => result.accepted.slice(0, REVIEW_PER_PROTOTYPE));
assert(reviewQuestions.length === 36, `EMB review pack expected 36 questions, got ${reviewQuestions.length}.`);

const evidence = {
  version: "EMB-001-EXECUTABLE-DISCOVERY-V1",
  chapterCode: "EMB-001",
  status: "PASS_EMB_001_EXECUTABLE_DISCOVERY_V1",
  hardeningAuthority: EMB_001_DISCOVERY_HARDENING_AUTHORITY_V1_1,
  provisionalFamilyCount: EMB_001_PROTOTYPES_V1.length,
  permanentQlCount: 0,
  earliestPossibleFutureSpatialId: "SPA-QL-041",
  namespaceAllocated: false,
  targetPerPrototype: TARGET_PER_PROTOTYPE,
  totalAccepted: accepted.length,
  totalAttempts: results.reduce((sum, result) => sum + result.attempts, 0),
  generationRejects: results.reduce((sum, result) => sum + result.generationRejects, 0),
  perceptualRejects: results.reduce((sum, result) => sum + result.perceptualRejects, 0),
  duplicateRejects: results.reduce((sum, result) => sum + result.duplicateRejects, 0),
  reviewQuestionCount: reviewQuestions.length,
  graphAuthority: {
    exactPermittedSubstructure: true,
    rotationParameterSupported: true,
    reflectionDefaultAllowed: false,
    scalingAllowed: false,
    nodeIdAndOrderIndependentFingerprint: true,
    exactArcMatching: true,
  },
  prototypes: results.map((result) => ({
    prototypeId: result.prototypeId,
    accepted: result.accepted.length,
    attempts: result.attempts,
    generationRejects: result.generationRejects,
    perceptualRejects: result.perceptualRejects,
    duplicateRejects: result.duplicateRejects,
    correctSlots: result.correctSlots,
    uniqueContent: new Set(result.accepted.map((question) => question.contentFingerprint)).size,
  })),
  sourceScope: {
    SSC: "DISCOVERY_SCOPE_ONLY",
    Railway: "DISCOVERY_SCOPE_ONLY",
    Banking: "NOT_ESTABLISHED",
    PunjabState: "NOT_ESTABLISHED",
  },
  lifecycle: {
    questionStudioDiscoverable: false,
    questionStudioRegistration: "NOT_REGISTERED",
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticPublication: false,
    nextGate: "EMB_001_SOURCE_SATURATION_AND_MERGE_SPLIT_V1",
  },
};

const outputDir = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, "spa-emb-001-discovery-v1-review.json"), JSON.stringify(reviewQuestions, null, 2));
writeFileSync(resolve(outputDir, "spa-emb-001-discovery-v1-evidence.json"), JSON.stringify(evidence, null, 2));
const cards = reviewQuestions.map((question, index) => renderReviewCard(question, index + 1)).join("\n");
writeFileSync(resolve(outputDir, "spa-emb-001-discovery-v1-review.html"), `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>EMB-001 Embedded Figures Discovery V1</title><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;background:#fff;color:#111;line-height:1.45}.wrap{max-width:1120px;margin:auto;padding:18px}.card{margin:0 auto 34px;padding:18px;border:1px solid #bbb;border-radius:10px;background:#fff;break-inside:avoid}.target{width:min(250px,100%);margin:14px auto 20px;padding:8px;border:1px solid #ddd;background:#fff}.target svg{width:100%;height:auto;background:#fff}.problem-label{text-align:center;font-size:12px;font-weight:bold;margin-bottom:4px}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.option{border:1px solid #ccc;padding:8px;text-align:center;background:#fff;overflow:hidden}.option svg{width:100%;min-width:112px;height:auto;background:#fff}.label{font-weight:bold}.misconception,.seed{font-size:12px;color:#555;overflow-wrap:anywhere}@media(max-width:760px){.options{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:420px){.options{grid-template-columns:1fr}}</style></head><body><main class="wrap"><h1>EMB-001 Embedded Figures — Executable Discovery V1</h1><p>36 representative discovery questions. Problem figures and answer figures use identical black line styling; no learner option highlights the hidden target. Permanent QLs, Question Studio, Question Bank and test/public eligibility remain off.</p>${cards}</main></body></html>`);
console.log(JSON.stringify(evidence, null, 2));
console.log("PASS_EMB_001_EXECUTABLE_DISCOVERY_V1");
