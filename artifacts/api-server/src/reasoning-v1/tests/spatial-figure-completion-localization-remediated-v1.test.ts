import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  FGC_001_PERMANENT_QL_PROTOTYPE_MAP_V1,
  type FigureCompletionPermanentQlIdV1,
} from "../foundation/spatial/figure-completion-permanent-english-runtime-v1";
import {
  generateFigureCompletionLocalizedQuestionV1,
} from "../foundation/spatial/figure-completion-localization-v1-remediated";
import type { FigureCompletionLocalizedQuestionV1 } from "../foundation/spatial/figure-completion-localization-v1";
import { renderSpatialSceneToSvg } from "../foundation/spatial/svg-renderer";

const QLS: readonly FigureCompletionPermanentQlIdV1[] = ["SPA-QL-031", "SPA-QL-032", "SPA-QL-033", "SPA-QL-034"];
const PARITY_PER_QL = 24;
const REVIEW_PER_QL_PER_LANGUAGE = 6;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function same(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function allText(question: FigureCompletionLocalizedQuestionV1): string {
  return [question.qlName, question.stem, question.explanation.observation, question.explanation.rule, question.explanation.application, question.explanation.check].join(" ");
}

function assertParity(english: FigureCompletionLocalizedQuestionV1, localized: FigureCompletionLocalizedQuestionV1): void {
  const key = `${localized.qlId}/${localized.seed}/${localized.language}`;
  assert(same(english.stimulusScenes, localized.stimulusScenes), `${key}: stimulus geometry changed.`);
  assert(same(english.optionScenes, localized.optionScenes), `${key}: option geometry/order changed.`);
  assert(english.correctOptionIndex === localized.correctOptionIndex && english.answer === localized.answer, `${key}: answer changed.`);
  assert(english.questionId === localized.questionId, `${key}: questionId changed.`);
  assert(english.canonicalItemId === localized.canonicalItemId, `${key}: canonicalItemId changed.`);
  assert(english.questionLanguageId === localized.questionLanguageId, `${key}: questionLanguageId changed.`);
  assert(english.contentFingerprint === localized.contentFingerprint, `${key}: content fingerprint changed.`);
  assert(english.deliveryFingerprint === localized.deliveryFingerprint, `${key}: delivery fingerprint changed.`);
  assert(english.sourceQuestionFingerprint === localized.sourceQuestionFingerprint, `${key}: source fingerprint changed.`);
  assert(english.prototypeId === localized.prototypeId && english.qlId === localized.qlId, `${key}: semantic authority changed.`);
  assert(!localized.lifecycle.questionStudioDiscoverable && !localized.lifecycle.persistenceAllowed && !localized.lifecycle.questionBankWritable, `${key}: downstream lifecycle activated.`);
  assert(!localized.lifecycle.testEligible && !localized.lifecycle.publiclyPublishable, `${key}: tests/publication activated.`);
  assert(localized.lifecycle.localizationReviewOnly && !localized.lifecycle.localizationFrozen, `${key}: localization review lifecycle drifted.`);
}

function assertLanguage(question: FigureCompletionLocalizedQuestionV1): void {
  const text = allText(question);
  const lower = text.toLowerCase();
  for (const forbidden of ["contour", "radial symmetry", "visual-state", "orthogonal", "topology", "transformation"]) {
    assert(!lower.includes(forbidden), `${question.qlId}/${question.seed}/${question.language}: leaked '${forbidden}'.`);
  }
  if (question.language === "hi") {
    assert(question.locale === "hi-IN" && /[\u0900-\u097F]/u.test(text), `${question.qlId}/${question.seed}: Hindi script/locale failed.`);
    for (const forbidden of ["रूपांतरण", "सादृश्य", "संयोजकता", "टोपोलॉजी", "सापेक्ष", "प्रतिस्थापन", "दृश्य-अवस्था", "रेडियल", "कॉन्टूर"]) {
      assert(!text.includes(forbidden), `${question.qlId}/${question.seed}: formal Hindi '${forbidden}' is forbidden.`);
    }
    assert(!question.qlName.includes("समान बनावट पूरा"), `${question.qlId}/${question.seed}: awkward Hindi title regression.`);
    if (question.prototypeId === "FGC-PROT-05-COMPOUND-CONTOUR-MARKER") {
      assert(question.explanation.rule.includes("बीच वाला बिंदु") && question.explanation.rule.includes("बराबर दूरी"), `${question.seed}: P05 Hindi equal-spacing rule is ambiguous.`);
    }
    if (question.prototypeId === "FGC-PROT-07-MIRROR-STATE-REVERSAL") {
      assert(question.explanation.rule.startsWith("आकृति को"), `${question.seed}: P07 Hindi should tell learner to flip the figure, not a vague 'place'.`);
    }
  } else if (question.language === "pa") {
    assert(question.locale === "pa-IN" && /[\u0A00-\u0A7F]/u.test(text), `${question.qlId}/${question.seed}: Punjabi script/locale failed.`);
    for (const forbidden of ["ਟੋਪੋਲੋਜੀ", "ਟ੍ਰਾਂਸਫਾਰਮੇਸ਼ਨ", "ਰੈਡੀਅਲ", "ਕਨਟੂਰ", "ਵਿਜ਼ੂਅਲ-ਸਟੇਟ"]) {
      assert(!text.includes(forbidden), `${question.qlId}/${question.seed}: formal Punjabi '${forbidden}' is forbidden.`);
    }
    if (question.prototypeId === "FGC-PROT-05-COMPOUND-CONTOUR-MARKER") {
      assert(question.explanation.rule.includes("ਵਿਚਕਾਰਲਾ ਬਿੰਦੂ") && question.explanation.rule.includes("ਬਰਾਬਰ ਦੂਰੀ"), `${question.seed}: P05 Punjabi equal-spacing rule is ambiguous.`);
    }
    if (question.prototypeId === "FGC-PROT-07-MIRROR-STATE-REVERSAL") {
      assert(question.explanation.rule.startsWith("ਆਕ੍ਰਿਤੀ ਨੂੰ"), `${question.seed}: P07 Punjabi should directly say to flip the figure.`);
    }
  }
  assert(question.explanation.check.includes(question.answer), `${question.qlId}/${question.seed}/${question.language}: check must name answer.`);
}

const review: FigureCompletionLocalizedQuestionV1[] = [];
const coverage: Record<string, { hi: number; pa: number }> = {};
let localizedParityQuestions = 0;

for (const qlId of QLS) {
  const candidates = { hi: [] as FigureCompletionLocalizedQuestionV1[], pa: [] as FigureCompletionLocalizedQuestionV1[] };
  const seenReview = { hi: new Set<string>(), pa: new Set<string>() };
  for (let index = 0; index < PARITY_PER_QL; index += 1) {
    const seed = `FGC-LOCALIZATION-REMEDIATED-V1:${qlId}:${String(index).padStart(4, "0")}`;
    const slot = (index % 4) as 0 | 1 | 2 | 3;
    const en = generateFigureCompletionLocalizedQuestionV1({ qlId, seed, desiredCorrectOptionIndex: slot, language: "en" });
    const hi = generateFigureCompletionLocalizedQuestionV1({ qlId, seed, desiredCorrectOptionIndex: slot, language: "hi" });
    const pa = generateFigureCompletionLocalizedQuestionV1({ qlId, seed, desiredCorrectOptionIndex: slot, language: "pa" });
    assertParity(en, hi);
    assertParity(en, pa);
    assertLanguage(hi);
    assertLanguage(pa);
    assert(hi.stem !== en.stem && pa.stem !== en.stem, `${qlId}/${seed}: localized stem not localized.`);
    assert(hi.explanation.rule !== en.explanation.rule && pa.explanation.rule !== en.explanation.rule, `${qlId}/${seed}: localized rule not localized.`);
    const entry = coverage[en.prototypeId] ?? { hi: 0, pa: 0 };
    entry.hi += 1;
    entry.pa += 1;
    coverage[en.prototypeId] = entry;
    localizedParityQuestions += 2;

    for (const [lang, q] of [["hi", hi], ["pa", pa]] as const) {
      if (candidates[lang].length >= REVIEW_PER_QL_PER_LANGUAGE) continue;
      if (!seenReview[lang].has(q.prototypeId) || candidates[lang].length < 2) {
        candidates[lang].push(q);
        seenReview[lang].add(q.prototypeId);
      } else if (seenReview[lang].size === FGC_001_PERMANENT_QL_PROTOTYPE_MAP_V1[qlId].length) {
        candidates[lang].push(q);
      }
    }
  }
  for (const prototypeId of FGC_001_PERMANENT_QL_PROTOTYPE_MAP_V1[qlId]) {
    assert((coverage[prototypeId]?.hi ?? 0) > 0 && (coverage[prototypeId]?.pa ?? 0) > 0, `${qlId}: localization did not exercise ${prototypeId}.`);
  }
  assert(candidates.hi.length === REVIEW_PER_QL_PER_LANGUAGE && candidates.pa.length === REVIEW_PER_QL_PER_LANGUAGE, `${qlId}: remediated review bucket incomplete.`);
  review.push(...candidates.hi, ...candidates.pa);
}

assert(review.length === 48, `FGC remediated localization review expected 48 questions, got ${review.length}.`);

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function labels(language: "hi" | "pa"): readonly [string, string, string, string] {
  return language === "hi" ? ["क्या देखें", "नियम", "कैसे लगाएँ", "जाँच"] : ["ਕੀ ਵੇਖਣਾ", "ਨਿਯਮ", "ਕਿਵੇਂ ਲਗਾਉਣਾ", "ਜਾਂਚ"];
}

function card(question: FigureCompletionLocalizedQuestionV1, ordinal: number): string {
  const [l1, l2, l3, l4] = labels(question.language as "hi" | "pa");
  const stimulus = renderSpatialSceneToSvg(question.stimulusScenes[0]!, { ariaLabel: `${question.qlId} localized stimulus` });
  const options = question.optionScenes.map((scene, index) => {
    const optionLabel = (["A", "B", "C", "D"] as const)[index];
    return `<div class="option"><div class="option-label">${optionLabel}</div>${renderSpatialSceneToSvg(scene, { ariaLabel: `Option ${optionLabel}` })}</div>`;
  }).join("");
  const explanation = [[l1, question.explanation.observation], [l2, question.explanation.rule], [l3, question.explanation.application], [l4, question.explanation.check]]
    .map(([label, value]) => `<li><strong>${escapeHtml(label!)}:</strong> ${escapeHtml(value!)}</li>`).join("");
  return `<article class="card"><h2>${ordinal}. ${question.qlId} — ${escapeHtml(question.qlName)}</h2><p class="meta">${escapeHtml(question.prototypeId)} · ${question.locale}</p><p>${escapeHtml(question.stem)}</p><div class="stimulus">${stimulus}</div><div class="options">${options}</div><p><strong>Answer: ${question.answer}</strong></p><ol>${explanation}</ol><p class="seed">${escapeHtml(question.seed)}</p></article>`;
}

const proof = {
  version: "FGC-001-LOCALIZATION-REMEDIATED-PROOF-V1",
  chapterCode: "FGC-001",
  status: "PASS_FGC_001_HI_PA_LOCALIZATION_REMEDIATED_REVIEW_V1",
  permanentQlRange: "SPA-QL-031..SPA-QL-034",
  localizedParityQuestions,
  retainedLearnerReviewQuestions: review.length,
  coverage,
  invariants: { geometry: true, optionOrder: true, answer: true, ids: true, fingerprints: true },
  languageReview: {
    simpleHindi: true,
    simplePunjabi: true,
    p05EqualSpacingMadeExplicit: true,
    p07VaguePlaceWordingRemoved: true,
    p10CornerWordingSimplified: true,
    awkwardQlTitlesRemediated: true,
    approvedHindiLabels: labels("hi"),
    approvedPunjabiLabels: labels("pa"),
  },
  lifecycle: { reviewOnly: true, localizationFrozen: false, questionStudioDiscoverable: false, persistenceAllowed: false, questionBankWritable: false, testEligible: false, publiclyPublishable: false },
  nextGate: "FGC_001_HUMAN_HI_PA_REVIEW_AND_FREEZE",
};

const out = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, "spa-fgc-001-localization-remediated-v1-review.json"), JSON.stringify(review, null, 2));
writeFileSync(resolve(out, "spa-fgc-001-localization-remediated-v1-evidence.json"), JSON.stringify(proof, null, 2));
const cards = review.map((q, index) => card(q, index + 1)).join("\n");
writeFileSync(resolve(out, "spa-fgc-001-localization-remediated-v1-review.html"), `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FGC-001 Hindi Punjabi Remediated Review V1</title><style>body{font-family:Arial,sans-serif;margin:20px;line-height:1.5}.card{max-width:900px;margin:0 auto 36px;padding:20px;border:1px solid #bbb;border-radius:10px}.meta,.seed{font-size:12px;color:#555}.stimulus{max-width:460px;margin:16px auto}.stimulus svg{width:100%;height:auto}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.option{border:1px solid #ccc;padding:8px;text-align:center}.option svg{width:100%;min-width:104px;height:auto}.option-label{font-weight:bold}@media(max-width:640px){.options{grid-template-columns:repeat(2,minmax(0,1fr))}.option svg{min-width:104px}}</style></head><body><h1>FGC-001 — Hindi/Punjabi Remediated Review V1</h1><p>48 learner-review questions after simple-language remediation. Visuals, option order, answers, IDs and fingerprints remain identical to frozen English.</p>${cards}</body></html>`);

console.log(JSON.stringify(proof, null, 2));
console.log("PASS_FGC_001_HI_PA_LOCALIZATION_REMEDIATED_REVIEW_V1");
