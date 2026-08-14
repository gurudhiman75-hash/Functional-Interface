import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { canonicalDigest } from "./canonical.ts";
import { sea001LocalizedLearnerSurface, type Sea001LocalizedReviewCaselet } from "./localization/candidate-localizer.ts";
import { sea001ExplanationParityDiagnostics } from "./localization/explanation-parity.ts";
import {
  buildSea001ExplanationParityCandidate,
  sea001EnglishExplanationAuthority,
} from "./localization/explanation-parity-candidate.ts";
import { SEA001_REVIEW_CANONICAL_NAMES } from "./localization/name-pack.ts";
import {
  SEA001_TRANSLATION_TARGET_LOCALES,
  type Sea001TranslatedLocale,
  sea001CanonicalParityFingerprint,
} from "./localization/readiness.ts";
import { buildSea001SaturationCorpus, selectManualReviewCorpus, type AuditCaselet } from "./saturation/corpus.ts";

function escapeHtml(value: unknown): string {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function localeLabel(locale: Sea001TranslatedLocale): string { return locale === "hi-IN" ? "Hindi" : "Punjabi"; }
function localizedContentFingerprint(caselet: Sea001LocalizedReviewCaselet): string {
  return canonicalDigest({
    locale: caselet.locale,
    canonicalCaseletId: caselet.canonicalCaseletId,
    canonicalParityFingerprint: caselet.canonicalParityFingerprint,
    setupText: caselet.setupText,
    clueTexts: caselet.clueTexts,
    sharedExplanation: caselet.sharedExplanation,
    diagramText: caselet.diagramText ?? caselet.diagram?.text ?? "",
    children: caselet.children.map((child) => ({
      text: child.text,
      options: child.options.map((option) => ({ display: option.display, explanation: option.explanation })),
      explanation: child.explanation,
    })),
  });
}

function assertNativeExportCandidate(canonical: AuditCaselet, localized: Sea001LocalizedReviewCaselet): void {
  const expectedParity = sea001CanonicalParityFingerprint(canonical);
  const englishAuthority = sea001EnglishExplanationAuthority(canonical);
  if (localized.canonicalCaseletId !== canonical.caseletId) throw new Error(`${canonical.caseletId}/${localized.locale}: export canonical caselet identity changed`);
  if (localized.canonicalParityFingerprint !== expectedParity || sea001CanonicalParityFingerprint(localized) !== expectedParity) {
    throw new Error(`${canonical.caseletId}/${localized.locale}: export semantic parity changed`);
  }
  const explanationParity = sea001ExplanationParityDiagnostics(englishAuthority, localized);
  if (explanationParity.sharedEnglishBlocks !== explanationParity.sharedLocalizedBlocks) throw new Error(`${canonical.caseletId}/${localized.locale}: export approved-English explanation block parity changed`);
  if (explanationParity.childExplanations !== canonical.children.length) throw new Error(`${canonical.caseletId}/${localized.locale}: export correct-explanation coverage changed`);
  const sourceOptionCount = canonical.children.reduce((sum, child) => sum + child.options.length, 0);
  if (explanationParity.optionRationales !== sourceOptionCount) throw new Error(`${canonical.caseletId}/${localized.locale}: export option-rationale parity changed`);

  const learnerSurface = sea001LocalizedLearnerSurface(localized);
  const latinTokens = learnerSurface.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) ?? [];
  if (latinTokens.length !== 0) throw new Error(`${canonical.caseletId}/${localized.locale}: export contains Latin learner text: ${latinTokens.slice(0,8).join(", ")}`);
  for (const canonicalName of SEA001_REVIEW_CANONICAL_NAMES) if (new RegExp(`\\b${canonicalName}\\b`).test(learnerSurface)) throw new Error(`${canonical.caseletId}/${localized.locale}: export exposes canonical Latin name ${canonicalName}`);
  if (!localized.humanLanguageReviewRequired) throw new Error(`${canonical.caseletId}/${localized.locale}: export must require human language review`);
  if (localized.productDeliveryUnlocked || localized.productionStagingApproved) throw new Error(`${canonical.caseletId}/${localized.locale}: export cannot unlock delivery or staging`);
}

function buildRecord(canonical: AuditCaselet, localized: Sea001LocalizedReviewCaselet, reviewNo: number) {
  const canonicalFingerprint = sea001CanonicalParityFingerprint(canonical);
  const englishAuthority = sea001EnglishExplanationAuthority(canonical);
  return {
    reviewNo,
    packageId: "SEA-001",
    locale: localized.locale,
    canonicalLocale: "en-IN",
    checkpointId: canonical.checkpointId,
    blueprintAuthorityId: canonical.blueprintAuthorityId,
    caseletId: canonical.caseletId,
    canonicalParityFingerprint: canonicalFingerprint,
    localizedContentFingerprint: localizedContentFingerprint(localized),
    explanationParity: sea001ExplanationParityDiagnostics(englishAuthority, localized),
    english: {
      setup: canonical.setupText,
      clues: canonical.clueTexts,
      arrangement: canonical.diagramText ?? canonical.diagram?.text ?? "",
      sharedExplanation: englishAuthority.sharedExplanation,
      children: canonical.children.map((child) => ({
        questionOrder: child.questionOrder,
        queryContractId: child.queryContractId,
        question: child.text,
        options: child.options.map((option) => ({ display: option.display, isCorrect: option.isCorrect, explanation: option.explanation })),
        answerIndex: child.answerIndex,
        explanation: child.explanation,
      })),
    },
    localized: {
      setup: localized.setupText,
      clues: localized.clueTexts,
      arrangement: localized.diagramText ?? localized.diagram?.text ?? "",
      sharedExplanation: localized.sharedExplanation,
      children: localized.children.map((child) => ({
        questionOrder: child.questionOrder,
        queryContractId: child.queryContractId,
        question: child.text,
        options: child.options.map((option) => ({ display: option.display, isCorrect: option.isCorrect, explanation: option.explanation })),
        answerIndex: child.answerIndex,
        explanation: child.explanation,
      })),
    },
    review: {
      explanationStructureParity: "AUTOMATED_PROVED",
      semanticParity: "AUTOMATED_PROVED",
      terminologyAccuracy: "PENDING_HUMAN_REVIEW",
      setupNaturalness: "PENDING_HUMAN_REVIEW",
      clueClarity: "PENDING_HUMAN_REVIEW",
      directionLanguage: "PENDING_HUMAN_REVIEW",
      questionNaturalness: "PENDING_HUMAN_REVIEW",
      optionNaturalness: "PENDING_HUMAN_REVIEW",
      explanationTeachingQuality: "PENDING_HUMAN_REVIEW",
      explanationFaithfulnessToEnglish: "PENDING_HUMAN_REVIEW",
      grammarFluency: "PENDING_HUMAN_REVIEW",
      editorialDecision: "PENDING_HUMAN_REVIEW",
      reviewNotes: "",
    },
  };
}

function renderHtml(locale: Sea001TranslatedLocale, records: readonly ReturnType<typeof buildRecord>[]): string {
  const language = localeLabel(locale);
  const sections = records.map((record) => `
<section class="caselet">
  <h2>${record.reviewNo}. ${escapeHtml(record.checkpointId)} · ${escapeHtml(record.blueprintAuthorityId)}</h2>
  <p class="meta"><strong>Caselet:</strong> ${escapeHtml(record.caseletId)}<br><strong>Canonical semantic fingerprint:</strong> <code>${escapeHtml(record.canonicalParityFingerprint)}</code><br><strong>Localized content fingerprint:</strong> <code>${escapeHtml(record.localizedContentFingerprint)}</code><br><strong>Explanation blocks:</strong> EN ${record.explanationParity.sharedEnglishBlocks} / ${language} ${record.explanationParity.sharedLocalizedBlocks}</p>
  <div class="grid"><div><h3>Frozen English</h3><p>${escapeHtml(record.english.setup)}</p><ol>${record.english.clues.map((clue) => `<li>${escapeHtml(clue)}</li>`).join("")}</ol></div><div><h3>${language}</h3><p>${escapeHtml(record.localized.setup)}</p><ol>${record.localized.clues.map((clue) => `<li>${escapeHtml(clue)}</li>`).join("")}</ol></div></div>
  <div class="grid"><div><h3>Approved English solution authority</h3><pre>${escapeHtml(record.english.sharedExplanation)}</pre></div><div><h3>${language} solution — same teaching blocks</h3><pre>${escapeHtml(record.localized.sharedExplanation)}</pre></div></div>
  <h3>Questions and explanation parity</h3>
  ${record.localized.children.map((child,index)=>{const english=record.english.children[index]!;return `<article class="child"><div class="grid"><div><h4>English Q${english.questionOrder} · ${escapeHtml(english.queryContractId)}</h4><p>${escapeHtml(english.question)}</p><p><strong>Correct-answer explanation:</strong> ${escapeHtml(english.explanation)}</p></div><div><h4>${language} Q${child.questionOrder}</h4><p>${escapeHtml(child.question)}</p><p><strong>Correct-answer explanation:</strong> ${escapeHtml(child.explanation)}</p></div></div><ol type="A">${child.options.map((option,optionIndex)=>{const sourceOption=english.options[optionIndex]!;return `<li><strong>${escapeHtml(option.display)}</strong>${option.isCorrect?" ✓":""}<div class="grid option-grid"><div><small><strong>EN rationale:</strong> ${escapeHtml(sourceOption.explanation)}</small></div><div><small><strong>${language} rationale:</strong> ${escapeHtml(option.explanation)}</small></div></div></li>`;}).join("")}</ol></article>`;}).join("")}
  <h3>Human language review</h3><p><strong>Decision:</strong> PENDING_HUMAN_REVIEW. Verify that every ${language} teaching step, case rejection/acceptance, correct-answer explanation and wrong-option misconception conveys the same reasoning as the approved English authority. Automated structural parity is not human language approval.</p>
</section>`).join("\n");
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><title>SEA-001 ${language} explanation-parity review</title><style>body{font-family:system-ui,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;max-width:1350px;margin:0 auto;padding:24px;line-height:1.5}.caselet{border:1px solid #bbb;border-radius:12px;padding:20px;margin:24px 0}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.child{border-top:1px solid #ddd;padding-top:14px;margin-top:16px}.option-grid{margin:6px 0 12px}pre{white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px}code{overflow-wrap:anywhere}.meta,.source,small{opacity:.82}@media(max-width:760px){.grid{grid-template-columns:1fr}}</style></head><body><h1>SEA-001 — ${language} 100-caselet explanation-parity review</h1><p>The approved English review presentation is the sole teaching authority. The ${language} explanation preserves the same teaching-block order, case branches, correct-answer reasoning and option-specific misconception rationales. Human language approval is still required.</p>${sections}</body></html>`;
}

const outputDir=process.env.SEA_001_LOCALIZED_REVIEW_OUTPUT_DIR??"/tmp/sea-001-localized-review";
await mkdir(outputDir,{recursive:true});
const saturation=buildSea001SaturationCorpus(40);
const canonicalReview=selectManualReviewCorpus(saturation.caselets,5);
if(canonicalReview.length!==100) throw new Error(`Expected 100 canonical caselets, observed ${canonicalReview.length}`);

const ledgerEntries:Array<{locale:Sea001TranslatedLocale;caseletId:string;canonicalParityFingerprint:string;localizedContentFingerprint:string;decision:"PENDING_HUMAN_REVIEW";reviewerId:null;reviewedAt:null;notes:string;}>=[];
for(const locale of SEA001_TRANSLATION_TARGET_LOCALES){
  const localized=canonicalReview.map((caselet)=>buildSea001ExplanationParityCandidate(caselet,locale));
  localized.forEach((candidate,index)=>assertNativeExportCandidate(canonicalReview[index]!,candidate));
  const records=localized.map((caselet,index)=>buildRecord(canonicalReview[index]!,caselet,index+1));
  for(const record of records) ledgerEntries.push({locale,caseletId:record.caseletId,canonicalParityFingerprint:record.canonicalParityFingerprint,localizedContentFingerprint:record.localizedContentFingerprint,decision:"PENDING_HUMAN_REVIEW",reviewerId:null,reviewedAt:null,notes:""});
  const slug=locale==="hi-IN"?"hi":"pa";
  const payload={authority:"SEA Seating Arrangement Master End-to-End Family Design V3 merged",englishExplanationAuthority:"SEA-001 approved review presentation via compileSea001TeachingExplanationFromUnknown",localizationAuthority:"SEA001_EXPLANATION_PARITY_REVIEW",renderer:"SEA001_NATIVE_REVIEW_V2_EXPLANATION_PARITY",locale,status:"EXECUTABLE_EXPLANATION_PARITY_HUMAN_REVIEW_REQUIRED",canonicalEnglishFrozen:true,semanticParity:"AUTOMATED_PROVED",explanationStructureParity:"AUTOMATED_PROVED",humanLanguageReview:"PENDING",productDeliveryUnlocked:false,records};
  await writeFile(join(outputDir,`sea-001-${slug}-review-100.json`),`${JSON.stringify(payload,null,2)}\n`,"utf8");
  await writeFile(join(outputDir,`sea-001-${slug}-review-100.html`),renderHtml(locale,records),"utf8");
  const surfaceDigest=canonicalDigest(localized.map((caselet)=>({caseletId:caselet.caseletId,learnerSurface:sea001LocalizedLearnerSurface(caselet)})));
  console.log("WROTE_SEA_001_EXPLANATION_PARITY_REVIEW",locale,records.length,surfaceDigest);
}

const ledger={packageId:"SEA-001",renderer:"SEA001_NATIVE_REVIEW_V2_EXPLANATION_PARITY",status:"PENDING_HINDI_PUNJABI_EXPLANATION_PARITY_HUMAN_REVIEW",instructions:["Review Hindi and Punjabi independently against the approved English explanation presentation.","For every caselet, verify the same case branches, clue order, accept/reject reasoning and final arrangement.","For every child question, verify the same correct-answer reasoning and the same wrong-option misconception rationale.","Do not change semantic answers, option correctness, query contracts or solve identities during language review.","Set decision to ACCEPT, REWRITE or REJECT and sign reviewerId/reviewedAt for every non-pending entry.","Multilingual freeze and activation remain locked until all required language reviews are explicitly approved."],entries:ledgerEntries};
await writeFile(join(outputDir,"sea-001-localized-review-ledger-template.json"),`${JSON.stringify(ledger,null,2)}\n`,"utf8");
const summary={packageId:"SEA-001",renderer:"SEA001_NATIVE_REVIEW_V2_EXPLANATION_PARITY",canonicalLocale:"en-IN",targetLocales:SEA001_TRANSLATION_TARGET_LOCALES,canonicalCaselets:canonicalReview.length,localizedCaselets:ledgerEntries.length,localizedChildQuestions:ledgerEntries.length*4,semanticParity:"AUTOMATED_PROVED",explanationStructureParity:"AUTOMATED_PROVED",humanLanguageReview:"PENDING",questionStudioRegistered:false,questionBankWritable:false,testEligible:false,publiclyPublishable:false};
await writeFile(join(outputDir,"sea-001-localized-review-summary.json"),`${JSON.stringify(summary,null,2)}\n`,"utf8");
console.log("WROTE_SEA_001_EXPLANATION_PARITY_REVIEW_LEDGER",ledgerEntries.length,outputDir);
