import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  EMB_001_DIRECTIONAL_HARDENING_AUTHORITY_V2_1,
  EMB_001_DIRECTIONAL_PROTOTYPES_V2,
  EMB_001_SOURCE_DIRECTION_AUTHORITY_V2,
  generateEmbeddedDirectionalQuestionV2_1,
  type EmbeddedDirectionalPrototypeV2,
  type EmbeddedDirectionalQuestionV2,
} from "../foundation/spatial/embedded-figures-directional-discovery-v2-1";
import { renderSpatialSceneToSvg } from "../foundation/spatial/svg-renderer";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "../foundation/spatial/validator";
import {
  validateLearnerVisibleExplanationV2,
  validateSpatialPerceptualOptionUniquenessV2,
} from "../foundation/spatial/gap-question-perceptual-v2";

const TARGET_PER_PROTOTYPE = 80;
const MAX_ATTEMPTS = 1600;
const REVIEW_PER_PROTOTYPE = 8;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function retryable(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.message.includes("solver did not preserve") ||
    error.message.includes("perceptual") ||
    error.message.includes("option") ||
    error.message.includes("embedding");
}

interface Proof {
  prototypeId: EmbeddedDirectionalPrototypeV2;
  accepted: EmbeddedDirectionalQuestionV2[];
  attempts: number;
  generationRejects: number;
  perceptualRejects: number;
  duplicateRejects: number;
  correctSlots: [number, number, number, number];
}

function prove(prototypeId: EmbeddedDirectionalPrototypeV2): Proof {
  const accepted: EmbeddedDirectionalQuestionV2[] = [];
  const seen = new Set<string>();
  const correctSlots: [number, number, number, number] = [0, 0, 0, 0];
  let attempts = 0;
  let generationRejects = 0;
  let perceptualRejects = 0;
  let duplicateRejects = 0;

  for (let attempt = 0; attempt < MAX_ATTEMPTS && accepted.length < TARGET_PER_PROTOTYPE; attempt += 1) {
    attempts += 1;
    const seed = `EMB-DIRECTIONAL-V2:${prototypeId}:${String(attempt).padStart(4, "0")}`;
    const desiredCorrectOptionIndex = (accepted.length % 4) as 0 | 1 | 2 | 3;
    let question: EmbeddedDirectionalQuestionV2;
    try {
      question = generateEmbeddedDirectionalQuestionV2_1({ prototypeId, seed, desiredCorrectOptionIndex });
    } catch (error) {
      if (!retryable(error)) throw error;
      generationRejects += 1;
      continue;
    }

    if (seen.has(question.contentFingerprint)) {
      duplicateRejects += 1;
      continue;
    }

    assert(question.options.length === 4, `${prototypeId}: expected exactly four options.`);
    assert(question.permanentQlId === null, `${prototypeId}: discovery must not allocate a permanent QL.`);
    assert(question.provenance === "SOURCE_BACKED_CORE", `${prototypeId}: directional tasks must retain source-backed provenance.`);
    assert(question.taskDirection === "ANSWER_FIGURE_INSIDE_QUESTION_FIGURE", `${prototypeId}: wrong learner direction.`);
    assert(question.correctOptionIndex === desiredCorrectOptionIndex, `${prototypeId}: requested answer slot was not preserved.`);
    assert(question.answer === (["A", "B", "C", "D"] as const)[desiredCorrectOptionIndex], `${prototypeId}: answer letter mismatch.`);
    assert(question.solverEvidence.satisfyingOptionIndexes.length === 1, `${prototypeId}: expected one satisfying option.`);
    assert(question.solverEvidence.satisfyingOptionIndexes[0] === desiredCorrectOptionIndex, `${prototypeId}: solver answer mismatch.`);
    assert(question.matchPolicy.allowRotation, `${prototypeId}: rotation should be permitted.`);
    assert(!question.matchPolicy.allowReflection, `${prototypeId}: reflection must remain disallowed.`);
    assert(question.matchPolicy.allowScale === false, `${prototypeId}: scale must remain disallowed.`);
    assert(validateSpatialScene(question.questionScene).ok, `${prototypeId}: invalid question scene.`);
    question.options.forEach((option, index) => assert(validateSpatialScene(option.scene).ok, `${prototypeId}: invalid option ${index}.`));
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

    const counts = question.solverEvidence.optionEmbeddingCounts;
    if (prototypeId === "EMB-PROT-07-OPTION-IN-QUESTION-POSITIVE") {
      assert(question.polarity === "SELECT_EMBEDDED", `${prototypeId}: wrong polarity.`);
      assert(counts[desiredCorrectOptionIndex]! > 0, `${prototypeId}: correct option is not embedded.`);
      assert(counts.filter((count) => count > 0).length === 1, `${prototypeId}: expected exactly one embedded candidate.`);
      assert(question.options[desiredCorrectOptionIndex]!.misconception === "CORRECT_PRESENT", `${prototypeId}: correct-present ownership lost.`);
    } else {
      assert(question.polarity === "SELECT_NOT_EMBEDDED", `${prototypeId}: wrong polarity.`);
      assert(counts[desiredCorrectOptionIndex] === 0, `${prototypeId}: correct negative option unexpectedly embeds.`);
      assert(counts.filter((count) => count === 0).length === 1, `${prototypeId}: expected exactly one absent candidate.`);
      assert(counts.filter((count) => count > 0).length === 3, `${prototypeId}: expected exactly three embedded decoys.`);
      assert(question.options[desiredCorrectOptionIndex]!.misconception === "CORRECT_ABSENT", `${prototypeId}: correct-absent ownership lost.`);
    }

    const replay = generateEmbeddedDirectionalQuestionV2_1({ prototypeId, seed, desiredCorrectOptionIndex });
    assert(replay.deliveryFingerprint === question.deliveryFingerprint, `${prototypeId}: deterministic replay failed.`);
    const alternate = generateEmbeddedDirectionalQuestionV2_1({ prototypeId, seed: `${seed}:ALT`, desiredCorrectOptionIndex });
    assert(alternate.contentFingerprint !== question.contentFingerprint, `${prototypeId}: alternate seed did not diverge.`);

    renderSpatialSceneToSvg(question.questionScene, { ariaLabel: "Embedded figure question host" });
    question.options.forEach((option, index) => renderSpatialSceneToSvg(option.scene, { ariaLabel: `Embedded figure directional option ${index + 1}` }));

    seen.add(question.contentFingerprint);
    accepted.push(question);
    correctSlots[desiredCorrectOptionIndex] += 1;
  }

  assert(accepted.length === TARGET_PER_PROTOTYPE, `${prototypeId}: only ${accepted.length}/${TARGET_PER_PROTOTYPE} accepted after ${attempts} attempts.`);
  assert(correctSlots.every((count) => count === 20), `${prototypeId}: answer slots not balanced: ${correctSlots.join("/")}.`);
  return { prototypeId, accepted, attempts, generationRejects, perceptualRejects, duplicateRejects, correctSlots };
}

function reviewCard(question: EmbeddedDirectionalQuestionV2, ordinal: number): string {
  const questionSvg = renderSpatialSceneToSvg(question.questionScene, { ariaLabel: `EMB directional review ${ordinal} question figure` });
  const optionSvgs = question.options.map((option, index) => {
    const label = (["A", "B", "C", "D"] as const)[index];
    return `<div class="option"><div class="label">${label}</div>${renderSpatialSceneToSvg(option.scene, { ariaLabel: `Option ${label}` })}<div class="meta">embeddings=${option.embeddingCount}</div></div>`;
  }).join("");
  const explanation = [question.explanation.observation, question.explanation.rule, question.explanation.application, question.explanation.check]
    .map((part) => `<li>${escapeHtml(part)}</li>`).join("");
  return `<article class="card"><h2>${ordinal}. ${escapeHtml(question.prototypeId)}</h2><p>${escapeHtml(question.stem)}</p><div class="question">${questionSvg}</div><div class="options">${optionSvgs}</div><p><strong>Answer: ${question.answer}</strong></p><ol>${explanation}</ol><p class="seed">${escapeHtml(question.seed)}</p></article>`;
}

assert(EMB_001_SOURCE_DIRECTION_AUTHORITY_V2.learnerArchetypeProposal.proposedLearnerArchetypeCount === 2, "EMB source consolidation should propose two learner archetypes, not eight technical QLs.");
assert(!EMB_001_SOURCE_DIRECTION_AUTHORITY_V2.permanentQlAllocationAllowed, "EMB source authority must not allocate QLs.");
assert(EMB_001_DIRECTIONAL_HARDENING_AUTHORITY_V2_1.remediation.reverseNegativeAnswerSlotDGuaranteed, "EMB V2.1 D-slot remediation missing.");

const results = EMB_001_DIRECTIONAL_PROTOTYPES_V2.map(prove);
const accepted = results.flatMap((result) => result.accepted);
assert(accepted.length === 160, `EMB directional total accepted mismatch: ${accepted.length}.`);
assert(new Set(accepted.map((question) => question.contentFingerprint)).size === accepted.length, "EMB directional content collision detected.");

const review = results.flatMap((result) => result.accepted.slice(0, REVIEW_PER_PROTOTYPE));
assert(review.length === 16, `EMB directional review expected 16 questions, got ${review.length}.`);

const evidence = {
  version: "EMB-001-DIRECTIONAL-DISCOVERY-V2.1",
  status: "PASS_EMB_001_SOURCE_BACKED_DIRECTIONAL_DISCOVERY_V2_1",
  sourceAuthority: EMB_001_SOURCE_DIRECTION_AUTHORITY_V2,
  hardeningAuthority: EMB_001_DIRECTIONAL_HARDENING_AUTHORITY_V2_1,
  permanentQlCount: 0,
  proposedLearnerArchetypeCount: 2,
  directionalPrototypeCount: EMB_001_DIRECTIONAL_PROTOTYPES_V2.length,
  targetPerPrototype: TARGET_PER_PROTOTYPE,
  totalAccepted: accepted.length,
  totalAttempts: results.reduce((sum, result) => sum + result.attempts, 0),
  generationRejects: results.reduce((sum, result) => sum + result.generationRejects, 0),
  perceptualRejects: results.reduce((sum, result) => sum + result.perceptualRejects, 0),
  duplicateRejects: results.reduce((sum, result) => sum + result.duplicateRejects, 0),
  reviewQuestionCount: review.length,
  prototypes: results.map((result) => ({
    prototypeId: result.prototypeId,
    accepted: result.accepted.length,
    attempts: result.attempts,
    generationRejects: result.generationRejects,
    perceptualRejects: result.perceptualRejects,
    duplicateRejects: result.duplicateRejects,
    correctSlots: result.correctSlots,
  })),
  lifecycle: {
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    nextGate: "EMB_001_SOURCE_SATURATION_AND_MERGE_SPLIT_V1",
  },
};

const out = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, "spa-emb-001-directional-discovery-v2-review.json"), JSON.stringify(review, null, 2));
writeFileSync(resolve(out, "spa-emb-001-directional-discovery-v2-evidence.json"), JSON.stringify(evidence, null, 2));
const cards = review.map((question, index) => reviewCard(question, index + 1)).join("\n");
writeFileSync(resolve(out, "spa-emb-001-directional-discovery-v2-review.html"), `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>EMB-001 Directional Discovery V2.1</title><style>*{box-sizing:border-box}body{margin:0;background:#fff;color:#111;font-family:Arial,sans-serif;line-height:1.45}.wrap{max-width:1120px;margin:auto;padding:18px}.card{border:1px solid #bbb;border-radius:10px;padding:18px;margin:0 0 30px;background:#fff}.question{max-width:360px;margin:12px auto 18px}.question svg{width:100%;height:auto;background:#fff}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.option{border:1px solid #ccc;padding:8px;text-align:center;background:#fff}.option svg{width:100%;min-width:108px;height:auto;background:#fff}.label{font-weight:bold}.meta,.seed{font-size:12px;color:#555;overflow-wrap:anywhere}@media(max-width:760px){.options{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:420px){.options{grid-template-columns:1fr}}</style></head><body><main class="wrap"><h1>EMB-001 Embedded Figures — Source-Backed Directional Discovery V2.1</h1><p>Reverse-positive and reverse-negative learner tasks from the source-saturation pass. Permanent QLs and Question Studio remain off.</p>${cards}</main></body></html>`);

console.log(JSON.stringify(evidence, null, 2));
console.log("PASS_EMB_001_SOURCE_BACKED_DIRECTIONAL_DISCOVERY_V2_1");
