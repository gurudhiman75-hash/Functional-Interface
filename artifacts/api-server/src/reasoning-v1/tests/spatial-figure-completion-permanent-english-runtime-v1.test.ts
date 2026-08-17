import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  FGC_001_PERMANENT_QL_PROTOTYPE_MAP_V1,
  generateFigureCompletionPermanentEnglishQuestionV1,
  type FigureCompletionPermanentEnglishQuestionV1,
  type FigureCompletionPermanentQlIdV1,
} from "../foundation/spatial/figure-completion-permanent-english-runtime-v1";
import { SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2 } from "../foundation/spatial/spatial-permanent-ql-allocation-v2";
import { renderSpatialSceneToSvg } from "../foundation/spatial/svg-renderer";
import { validateLearnerVisibleExplanationV2, validateSpatialPerceptualOptionUniquenessV2 } from "../foundation/spatial/gap-question-perceptual-v2";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "../foundation/spatial/validator";

const TARGET_PER_QL = 80;
const MAX_ATTEMPTS_PER_QL = 1200;
const REVIEW_PER_QL = 12;
const QL_IDS = SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2.map((entry) => entry.permanentQlId) as FigureCompletionPermanentQlIdV1[];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

interface QlProof {
  qlId: FigureCompletionPermanentQlIdV1;
  questions: FigureCompletionPermanentEnglishQuestionV1[];
  attempts: number;
  duplicateRejects: number;
  correctSlots: [number, number, number, number];
  prototypeCounts: Record<string, number>;
}

function proveQl(qlId: FigureCompletionPermanentQlIdV1): QlProof {
  const questions: FigureCompletionPermanentEnglishQuestionV1[] = [];
  const seen = new Set<string>();
  const correctSlots: [number, number, number, number] = [0, 0, 0, 0];
  const prototypeCounts: Record<string, number> = {};
  let attempts = 0;
  let duplicateRejects = 0;

  for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_QL && questions.length < TARGET_PER_QL; attempt += 1) {
    attempts += 1;
    const seed = `FGC-PERMANENT-ENGLISH-REVIEW:${qlId}:${String(attempt).padStart(4, "0")}`;
    const desiredCorrectOptionIndex = (questions.length % 4) as 0 | 1 | 2 | 3;
    const question = generateFigureCompletionPermanentEnglishQuestionV1({ qlId, seed, desiredCorrectOptionIndex });

    assert(question.qlId === qlId, `${qlId}/${seed}: QL identity drifted.`);
    assert(question.chapterCode === "FGC-001", `${qlId}/${seed}: chapter identity drifted.`);
    assert(question.language === "en" && question.locale === "en-IN", `${qlId}/${seed}: English locale contract drifted.`);
    assert(question.correctOptionIndex === desiredCorrectOptionIndex, `${qlId}/${seed}: requested answer slot not preserved.`);
    assert(question.answer === (["A", "B", "C", "D"] as const)[desiredCorrectOptionIndex], `${qlId}/${seed}: answer letter mismatch.`);
    assert(question.stimulusScenes.length === 1, `${qlId}/${seed}: FGC permanent runtime requires one stimulus scene.`);
    assert(question.optionScenes.length === 4, `${qlId}/${seed}: FGC permanent runtime requires exactly four options.`);
    assert(validateSpatialScene(question.stimulusScenes[0]!).ok, `${qlId}/${seed}: invalid stimulus scene.`);
    assert(question.optionScenes.every((scene) => validateSpatialScene(scene).ok), `${qlId}/${seed}: invalid option scene.`);
    assert(validateSpatialOptionUniqueness(question.optionScenes).ok, `${qlId}/${seed}: semantic option collision.`);
    assert(validateSpatialPerceptualOptionUniquenessV2(question.optionScenes).ok, `${qlId}/${seed}: perceptual option collision.`);
    const explanation = validateLearnerVisibleExplanationV2([
      question.explanation.observation,
      question.explanation.rule,
      question.explanation.application,
      question.explanation.check,
    ]);
    assert(explanation.ok, `${qlId}/${seed}: learner explanation failed: ${explanation.errors.join(", ")}`);
    assert(question.explanation.rule.trim().length >= 25, `${qlId}/${seed}: rule is too generic.`);
    assert(question.explanation.application.trim().length >= 25, `${qlId}/${seed}: application is too generic.`);
    assert(question.validation.valid && question.validation.uniqueAnswer, `${qlId}/${seed}: runtime validation contract not green.`);
    assert(question.renderer.mobileMinimumOptionPixels === 104, `${qlId}/${seed}: mobile review size drifted.`);
    assert(question.lifecycle.maturity === "PERMANENT_ENGLISH_RUNTIME_REVIEW", `${qlId}/${seed}: wrong lifecycle maturity.`);
    assert(question.lifecycle.reviewOnly, `${qlId}/${seed}: permanent English runtime must remain review-only.`);
    assert(!question.lifecycle.questionStudioDiscoverable, `${qlId}/${seed}: Question Studio must remain off before English approval.`);
    assert(question.lifecycle.registrationStatus === "NOT_REGISTERED", `${qlId}/${seed}: FGC must remain unregistered.`);
    assert(!question.lifecycle.persistenceAllowed, `${qlId}/${seed}: persistence must remain off.`);
    assert(!question.lifecycle.questionBankWritable, `${qlId}/${seed}: Question Bank writes must remain off.`);
    assert(!question.lifecycle.testEligible, `${qlId}/${seed}: test eligibility must remain off.`);
    assert(!question.lifecycle.publiclyPublishable, `${qlId}/${seed}: publication must remain off.`);
    assert(!question.lifecycle.hindiPunjabiGeneration, `${qlId}/${seed}: multilingual generation must remain off.`);

    const replay = generateFigureCompletionPermanentEnglishQuestionV1({ qlId, seed, desiredCorrectOptionIndex });
    assert(replay.deliveryFingerprint === question.deliveryFingerprint, `${qlId}/${seed}: deterministic replay failed.`);
    assert(replay.questionId === question.questionId, `${qlId}/${seed}: deterministic question ID failed.`);

    if (seen.has(question.contentFingerprint)) {
      duplicateRejects += 1;
      continue;
    }
    seen.add(question.contentFingerprint);

    renderSpatialSceneToSvg(question.stimulusScenes[0]!, { ariaLabel: `${qlId} stimulus` });
    question.optionScenes.forEach((scene, optionIndex) => renderSpatialSceneToSvg(scene, { ariaLabel: `${qlId} option ${optionIndex + 1}` }));

    questions.push(question);
    correctSlots[question.correctOptionIndex] += 1;
    prototypeCounts[question.prototypeId] = (prototypeCounts[question.prototypeId] ?? 0) + 1;
  }

  assert(questions.length === TARGET_PER_QL, `${qlId}: reached ${questions.length}/${TARGET_PER_QL} unique permanent-runtime questions after ${attempts} attempts.`);
  assert(correctSlots.every((count) => count === TARGET_PER_QL / 4), `${qlId}: answer positions are not exactly balanced: ${correctSlots.join("/")}.`);
  const allowedPrototypes = FGC_001_PERMANENT_QL_PROTOTYPE_MAP_V1[qlId];
  assert(Object.keys(prototypeCounts).every((prototypeId) => allowedPrototypes.includes(prototypeId as never)), `${qlId}: generated prototype outside permanent authority.`);
  for (const prototypeId of allowedPrototypes) {
    assert((prototypeCounts[prototypeId] ?? 0) >= 4, `${qlId}: representation ${prototypeId} is under-exercised (${prototypeCounts[prototypeId] ?? 0}/${TARGET_PER_QL}).`);
  }
  return { qlId, questions, attempts, duplicateRejects, correctSlots, prototypeCounts };
}

function reviewCard(question: FigureCompletionPermanentEnglishQuestionV1, ordinal: number): string {
  const stimulus = renderSpatialSceneToSvg(question.stimulusScenes[0]!, { ariaLabel: `${question.qlId} review stimulus ${ordinal}` });
  const options = question.optionScenes.map((scene, index) => {
    const label = (["A", "B", "C", "D"] as const)[index];
    return `<div class="option"><div class="label">${label}</div>${renderSpatialSceneToSvg(scene, { ariaLabel: `Option ${label}` })}</div>`;
  }).join("");
  const explanation = [
    ["Observation", question.explanation.observation],
    ["Rule", question.explanation.rule],
    ["Application", question.explanation.application],
    ["Check", question.explanation.check],
  ].map(([label, value]) => `<li><strong>${label}:</strong> ${escapeHtml(value!)}</li>`).join("");
  return `<article class="card"><h2>${ordinal}. ${question.qlId} — ${escapeHtml(question.qlName)}</h2><p class="meta">${escapeHtml(question.prototypeId)} · ${question.baseDifficulty}</p><p>${escapeHtml(question.stem)}</p><div class="stimulus">${stimulus}</div><div class="options">${options}</div><p><strong>Answer: ${question.answer}</strong></p><ol>${explanation}</ol><p class="seed">${escapeHtml(question.seed)}</p></article>`;
}

const results = QL_IDS.map(proveQl);
const allQuestions = results.flatMap((result) => result.questions);
assert(allQuestions.length === 320, "FGC permanent English runtime proof must contain 320 unique questions.");
assert(new Set(allQuestions.map((question) => question.contentFingerprint)).size === 320, "FGC permanent English runtime contains cross-QL content collisions.");
assert(new Set(allQuestions.map((question) => question.questionId)).size === 320, "FGC permanent English runtime contains duplicate question IDs.");

const reviewQuestions = results.flatMap((result) => result.questions.slice(0, REVIEW_PER_QL));
assert(reviewQuestions.length === 48, "FGC permanent English learner-review pack must contain 48 questions.");

const proof = {
  version: "FGC-001-PERMANENT-ENGLISH-RUNTIME-PROOF-V1",
  chapterCode: "FGC-001",
  status: "PASS_FGC_001_PERMANENT_ENGLISH_RUNTIME_V1",
  permanentQlRange: "SPA-QL-031..SPA-QL-034",
  permanentQlCount: 4,
  targetPerQl: TARGET_PER_QL,
  totalAccepted: allQuestions.length,
  totalAttempts: results.reduce((sum, result) => sum + result.attempts, 0),
  duplicateRejects: results.reduce((sum, result) => sum + result.duplicateRejects, 0),
  learnerReviewQuestionCount: reviewQuestions.length,
  qls: results.map((result) => ({
    qlId: result.qlId,
    qlName: result.questions[0]!.qlName,
    candidateAuthorityId: result.questions[0]!.candidateAuthorityId,
    accepted: result.questions.length,
    attempts: result.attempts,
    duplicateRejects: result.duplicateRejects,
    correctSlots: result.correctSlots,
    prototypeCounts: result.prototypeCounts,
    uniqueContent: new Set(result.questions.map((question) => question.contentFingerprint)).size,
  })),
  lifecycle: {
    reviewOnly: true,
    questionStudioDiscoverable: false,
    registrationStatus: "NOT_REGISTERED",
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    hindiPunjabiGeneration: false,
  },
  nextGate: "FGC_001_HUMAN_ENGLISH_REVIEW_AND_FREEZE",
};

const out = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, "spa-fgc-001-permanent-english-runtime-v1-review.json"), JSON.stringify(reviewQuestions, null, 2));
writeFileSync(resolve(out, "spa-fgc-001-permanent-english-runtime-v1-evidence.json"), JSON.stringify(proof, null, 2));
const cards = reviewQuestions.map((question, index) => reviewCard(question, index + 1)).join("\n");
writeFileSync(resolve(out, "spa-fgc-001-permanent-english-runtime-v1-review.html"), `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FGC-001 Permanent English Review V1</title><style>body{font-family:Arial,sans-serif;margin:20px;line-height:1.45}.card{max-width:900px;margin:0 auto 36px;padding:20px;border:1px solid #bbb;border-radius:10px;break-inside:avoid}.meta,.seed{font-size:12px;color:#555;overflow-wrap:anywhere}.stimulus{max-width:460px;margin:16px auto}.stimulus svg{width:100%;height:auto}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.option{border:1px solid #ccc;padding:8px;text-align:center}.option svg{width:100%;min-width:104px;height:auto}.label{font-weight:bold;margin-bottom:4px}@media(max-width:640px){.options{grid-template-columns:repeat(2,minmax(0,1fr))}.option svg{min-width:104px}}</style></head><body><h1>FGC-001 — Permanent English Runtime Review V1</h1><p>48 deterministic learner-review questions across permanent SPA-QL-031..034. The scale proof accepts only unique semantic questions; duplicate seeds are rejected at corpus level. Question Studio, persistence, Question Bank, tests, publication and multilingual generation remain off pending human English approval.</p>${cards}</body></html>`);

console.log(JSON.stringify(proof, null, 2));
console.log("PASS_FGC_001_PERMANENT_ENGLISH_RUNTIME_V1");
