import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  FGC_001_PERMANENT_QL_PROTOTYPE_MAP_V1,
  type FigureCompletionPermanentQlIdV1,
} from "../foundation/spatial/figure-completion-permanent-english-runtime-v1";
import {
  generateFigureCompletionLocalizedQuestionV1,
  type FigureCompletionLocalizedQuestionV1,
} from "../foundation/spatial/figure-completion-localization-v1";
import { renderSpatialSceneToSvg } from "../foundation/spatial/svg-renderer";

const QLS: readonly FigureCompletionPermanentQlIdV1[] = [
  "SPA-QL-031",
  "SPA-QL-032",
  "SPA-QL-033",
  "SPA-QL-034",
];
const PARITY_PER_QL = 24;
const REVIEW_PER_QL_PER_LANGUAGE = 6;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function deepEqualJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function learnerText(question: FigureCompletionLocalizedQuestionV1): string {
  return [
    question.qlName,
    question.stem,
    question.explanation.observation,
    question.explanation.rule,
    question.explanation.application,
    question.explanation.check,
  ].join(" ");
}

function assertInvariantParity(
  english: FigureCompletionLocalizedQuestionV1,
  localized: FigureCompletionLocalizedQuestionV1,
): void {
  const key = `${localized.qlId}/${localized.seed}/${localized.language}`;
  assert(deepEqualJson(localized.stimulusScenes, english.stimulusScenes), `${key}: stimulus geometry changed during localization.`);
  assert(deepEqualJson(localized.optionScenes, english.optionScenes), `${key}: option geometry/order changed during localization.`);
  assert(localized.correctOptionIndex === english.correctOptionIndex, `${key}: correct option index changed.`);
  assert(localized.answer === english.answer, `${key}: answer changed.`);
  assert(localized.questionId === english.questionId, `${key}: questionId changed.`);
  assert(localized.canonicalItemId === english.canonicalItemId, `${key}: canonicalItemId changed.`);
  assert(localized.questionLanguageId === english.questionLanguageId, `${key}: questionLanguageId changed.`);
  assert(localized.contentFingerprint === english.contentFingerprint, `${key}: content fingerprint changed.`);
  assert(localized.deliveryFingerprint === english.deliveryFingerprint, `${key}: delivery fingerprint changed.`);
  assert(localized.sourceQuestionFingerprint === english.sourceQuestionFingerprint, `${key}: source fingerprint changed.`);
  assert(deepEqualJson(localized.validation, english.validation), `${key}: validation evidence changed.`);
  assert(deepEqualJson(localized.renderer, english.renderer), `${key}: renderer contract changed.`);
  assert(localized.prototypeId === english.prototypeId, `${key}: representation/prototype changed.`);
  assert(localized.qlId === english.qlId, `${key}: permanent QL changed.`);
  assert(localized.candidateAuthorityId === english.candidateAuthorityId, `${key}: reasoning authority changed.`);
  assert(localized.localization.geometryInvariant, `${key}: geometry invariant flag missing.`);
  assert(localized.localization.optionOrderInvariant, `${key}: option-order invariant flag missing.`);
  assert(localized.localization.answerInvariant, `${key}: answer invariant flag missing.`);
  assert(localized.localization.idInvariant, `${key}: ID invariant flag missing.`);
  assert(localized.localization.fingerprintInvariant, `${key}: fingerprint invariant flag missing.`);
  assert(localized.lifecycle.reviewOnly && localized.lifecycle.localizationReviewOnly, `${key}: localization must remain review-only.`);
  assert(!localized.lifecycle.questionStudioDiscoverable, `${key}: Question Studio must remain off.`);
  assert(localized.lifecycle.registrationStatus === "NOT_REGISTERED", `${key}: registration must remain off.`);
  assert(!localized.lifecycle.persistenceAllowed && !localized.lifecycle.questionBankWritable, `${key}: persistence/QB writes must remain off.`);
  assert(!localized.lifecycle.testEligible && !localized.lifecycle.publiclyPublishable, `${key}: tests/publication must remain off.`);
  assert(!localized.lifecycle.localizationFrozen, `${key}: localization cannot be frozen before human review.`);
}

const bannedHindi = [
  "रूपांतरण",
  "सादृश्य",
  "संयोजकता",
  "टोपोलॉजी",
  "सापेक्ष",
  "प्रतिस्थापन",
  "दृश्य-अवस्था",
  "रेडियल",
  "कॉन्टूर",
];
const bannedPunjabi = [
  "ਟੋਪੋਲੋਜੀ",
  "ਟ੍ਰਾਂਸਫਾਰਮੇਸ਼ਨ",
  "ਰੈਡੀਅਲ",
  "ਕਨਟੂਰ",
  "ਵਿਜ਼ੂਅਲ-ਸਟੇਟ",
];
const bannedEnglishTechnical = [
  "contour",
  "radial symmetry",
  "visual-state",
  "orthogonal",
  "topology",
  "transformation",
];

function assertSimpleLocalizedLanguage(question: FigureCompletionLocalizedQuestionV1): void {
  const text = learnerText(question);
  const lower = text.toLowerCase();
  if (question.language === "hi") {
    assert(question.locale === "hi-IN", `${question.qlId}/${question.seed}: Hindi locale drifted.`);
    assert(/[\u0900-\u097F]/u.test(text), `${question.qlId}/${question.seed}: Hindi learner text lacks Devanagari.`);
    for (const word of bannedHindi) assert(!text.includes(word), `${question.qlId}/${question.seed}: formal Hindi term '${word}' is forbidden.`);
  } else if (question.language === "pa") {
    assert(question.locale === "pa-IN", `${question.qlId}/${question.seed}: Punjabi locale drifted.`);
    assert(/[\u0A00-\u0A7F]/u.test(text), `${question.qlId}/${question.seed}: Punjabi learner text lacks Gurmukhi.`);
    for (const word of bannedPunjabi) assert(!text.includes(word), `${question.qlId}/${question.seed}: formal Punjabi term '${word}' is forbidden.`);
  }
  for (const word of bannedEnglishTechnical) {
    assert(!lower.includes(word), `${question.qlId}/${question.seed}/${question.language}: technical English term '${word}' leaked into localized text.`);
  }
  assert(question.explanation.check.includes(question.answer), `${question.qlId}/${question.seed}/${question.language}: check must name the actual answer option.`);
}

interface ReviewBucket {
  hi: FigureCompletionLocalizedQuestionV1[];
  pa: FigureCompletionLocalizedQuestionV1[];
}

const reviewByQl = new Map<FigureCompletionPermanentQlIdV1, ReviewBucket>();
const prototypeCoverage: Record<string, { hi: number; pa: number }> = {};
let parityQuestions = 0;

for (const qlId of QLS) {
  const bucket: ReviewBucket = { hi: [], pa: [] };
  reviewByQl.set(qlId, bucket);
  const seenReviewPrototypes = { hi: new Set<string>(), pa: new Set<string>() };

  for (let index = 0; index < PARITY_PER_QL; index += 1) {
    const seed = `FGC-LOCALIZATION-V1:${qlId}:${String(index).padStart(4, "0")}`;
    const desiredCorrectOptionIndex = (index % 4) as 0 | 1 | 2 | 3;
    const english = generateFigureCompletionLocalizedQuestionV1({ qlId, seed, desiredCorrectOptionIndex, language: "en" });
    const hindi = generateFigureCompletionLocalizedQuestionV1({ qlId, seed, desiredCorrectOptionIndex, language: "hi" });
    const punjabi = generateFigureCompletionLocalizedQuestionV1({ qlId, seed, desiredCorrectOptionIndex, language: "pa" });

    assert(english.language === "en" && english.locale === "en-IN", `${qlId}/${seed}: English wrapper contract drifted.`);
    assertInvariantParity(english, hindi);
    assertInvariantParity(english, punjabi);
    assertSimpleLocalizedLanguage(hindi);
    assertSimpleLocalizedLanguage(punjabi);
    assert(hindi.stem !== english.stem && punjabi.stem !== english.stem, `${qlId}/${seed}: localized stem must differ from English.`);
    assert(hindi.explanation.rule !== english.explanation.rule, `${qlId}/${seed}: Hindi rule must be localized.`);
    assert(punjabi.explanation.rule !== english.explanation.rule, `${qlId}/${seed}: Punjabi rule must be localized.`);

    const coverage = prototypeCoverage[english.prototypeId] ?? { hi: 0, pa: 0 };
    coverage.hi += 1;
    coverage.pa += 1;
    prototypeCoverage[english.prototypeId] = coverage;
    parityQuestions += 2;

    for (const [language, localized] of [["hi", hindi], ["pa", punjabi]] as const) {
      const target = bucket[language];
      const seen = seenReviewPrototypes[language];
      if (!seen.has(localized.prototypeId) || target.length < REVIEW_PER_QL_PER_LANGUAGE) {
        if (target.length < REVIEW_PER_QL_PER_LANGUAGE) {
          target.push(localized);
          seen.add(localized.prototypeId);
        }
      }
    }
  }

  const allowed = FGC_001_PERMANENT_QL_PROTOTYPE_MAP_V1[qlId];
  for (const prototypeId of allowed) {
    assert((prototypeCoverage[prototypeId]?.hi ?? 0) > 0, `${qlId}: Hindi parity did not exercise ${prototypeId}.`);
    assert((prototypeCoverage[prototypeId]?.pa ?? 0) > 0, `${qlId}: Punjabi parity did not exercise ${prototypeId}.`);
  }
  assert(bucket.hi.length === REVIEW_PER_QL_PER_LANGUAGE, `${qlId}: Hindi review bucket incomplete.`);
  assert(bucket.pa.length === REVIEW_PER_QL_PER_LANGUAGE, `${qlId}: Punjabi review bucket incomplete.`);
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function labels(language: "hi" | "pa"): readonly [string, string, string, string] {
  return language === "hi"
    ? ["क्या देखें", "नियम", "कैसे लगाएँ", "जाँच"]
    : ["ਕੀ ਵੇਖਣਾ", "ਨਿਯਮ", "ਕਿਵੇਂ ਲਗਾਉਣਾ", "ਜਾਂਚ"];
}

function reviewCard(question: FigureCompletionLocalizedQuestionV1, ordinal: number): string {
  const [observationLabel, ruleLabel, applicationLabel, checkLabel] = labels(question.language as "hi" | "pa");
  const stimulus = renderSpatialSceneToSvg(question.stimulusScenes[0]!, { ariaLabel: `${question.qlId} localized stimulus` });
  const options = question.optionScenes.map((scene, index) => {
    const optionLabel = (["A", "B", "C", "D"] as const)[index];
    return `<div class="option"><div class="option-label">${optionLabel}</div>${renderSpatialSceneToSvg(scene, { ariaLabel: `Option ${optionLabel}` })}</div>`;
  }).join("");
  const explanation = [
    [observationLabel, question.explanation.observation],
    [ruleLabel, question.explanation.rule],
    [applicationLabel, question.explanation.application],
    [checkLabel, question.explanation.check],
  ].map(([label, value]) => `<li><strong>${escapeHtml(label!)}:</strong> ${escapeHtml(value!)}</li>`).join("");
  return `<article class="card"><h2>${ordinal}. ${question.qlId} — ${escapeHtml(question.qlName)}</h2><p class="meta">${escapeHtml(question.prototypeId)} · ${question.locale}</p><p>${escapeHtml(question.stem)}</p><div class="stimulus">${stimulus}</div><div class="options">${options}</div><p><strong>Answer: ${question.answer}</strong></p><ol>${explanation}</ol><p class="seed">${escapeHtml(question.seed)}</p></article>`;
}

const reviewQuestions: FigureCompletionLocalizedQuestionV1[] = [];
for (const qlId of QLS) {
  const bucket = reviewByQl.get(qlId)!;
  reviewQuestions.push(...bucket.hi, ...bucket.pa);
}
assert(reviewQuestions.length === 48, `FGC localization review expected 48 questions, got ${reviewQuestions.length}.`);

const proof = {
  version: "FGC-001-LOCALIZATION-PROOF-V1",
  chapterCode: "FGC-001",
  status: "PASS_FGC_001_HI_PA_LOCALIZATION_REVIEW_V1",
  permanentQlRange: "SPA-QL-031..SPA-QL-034",
  languages: ["en", "hi", "pa"],
  locales: ["en-IN", "hi-IN", "pa-IN"],
  paritySeedsPerQl: PARITY_PER_QL,
  localizedParityQuestions: parityQuestions,
  retainedLearnerReviewQuestions: reviewQuestions.length,
  prototypeCoverage,
  invariants: {
    geometry: true,
    optionOrder: true,
    answer: true,
    ids: true,
    fingerprints: true,
  },
  simpleLanguage: {
    approvedHindiLabels: labels("hi"),
    approvedPunjabiLabels: labels("pa"),
    formalHindiTermsRejected: bannedHindi,
    formalPunjabiTermsRejected: bannedPunjabi,
    technicalEnglishLeakageRejected: bannedEnglishTechnical,
  },
  lifecycle: {
    reviewOnly: true,
    localizationFrozen: false,
    questionStudioDiscoverable: false,
    registrationStatus: "NOT_REGISTERED",
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
  nextGate: "FGC_001_HUMAN_HI_PA_REVIEW_AND_FREEZE",
};

const out = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, "spa-fgc-001-localization-v1-review.json"), JSON.stringify(reviewQuestions, null, 2));
writeFileSync(resolve(out, "spa-fgc-001-localization-v1-evidence.json"), JSON.stringify(proof, null, 2));
const cards = reviewQuestions.map((question, index) => reviewCard(question, index + 1)).join("\n");
writeFileSync(resolve(out, "spa-fgc-001-localization-v1-review.html"), `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FGC-001 Hindi Punjabi Review V1</title><style>body{font-family:Arial,sans-serif;margin:20px;line-height:1.5}.card{max-width:900px;margin:0 auto 36px;padding:20px;border:1px solid #bbb;border-radius:10px;break-inside:avoid}.meta,.seed{font-size:12px;color:#555;overflow-wrap:anywhere}.stimulus{max-width:460px;margin:16px auto}.stimulus svg{width:100%;height:auto}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.option{border:1px solid #ccc;padding:8px;text-align:center}.option svg{width:100%;min-width:104px;height:auto}.option-label{font-weight:bold;margin-bottom:4px}@media(max-width:640px){.options{grid-template-columns:repeat(2,minmax(0,1fr))}.option svg{min-width:104px}}</style></head><body><h1>FGC-001 — Hindi/Punjabi Localization Review V1</h1><p>48 learner-review questions across SPA-QL-031..034. Geometry, option order, answers, IDs and fingerprints are identical to the frozen English question for the same seed. Question Studio and downstream lifecycle remain off pending human localization approval.</p>${cards}</body></html>`);

console.log(JSON.stringify(proof, null, 2));
console.log("PASS_FGC_001_HI_PA_LOCALIZATION_REVIEW_V1");
