import { mkdirSync, writeFileSync } from "node:fs";

import { SPATIAL_PERMANENT_QL_ALLOCATIONS_V1 } from "../foundation/spatial/spatial-permanent-ql-allocation-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "../foundation/spatial/spatial-question-studio-integration-v1";
import { SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1 } from "../foundation/spatial/spatial-question-studio-localization-v1";
import { generateSpatialProductionStudioQuestionV1 } from "../foundation/spatial/spatial-question-studio-production-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function geometryProjection(question: ReturnType<typeof generateSpatialProductionStudioQuestionV1>) {
  return {
    qlId: question.qlId,
    chapterCode: question.chapterCode,
    generationSeed: question.generationSeed,
    mode: question.mode,
    stimulusSvgs: question.stimulusSvgs,
    optionSvgs: question.optionSvgs,
    optionLabels: question.optionLabels,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalItemId: question.canonicalItemId,
    contentFingerprint: question.contentFingerprint,
    renderer: question.renderer,
    validation: question.validation,
  };
}

function learnerText(question: ReturnType<typeof generateSpatialProductionStudioQuestionV1>) {
  return [
    question.qlName,
    question.stem,
    question.explanation.observation,
    question.explanation.rule,
    question.explanation.application,
    question.explanation.check,
  ].join("\n");
}

function scriptGate(question: ReturnType<typeof generateSpatialProductionStudioQuestionV1>) {
  const text = learnerText(question);
  if (question.language === "hi") {
    assert(/[\u0904-\u0939\u0958-\u0961]/u.test(text), `${question.qlId}: Hindi review text has no Devanagari letters.`);
    assert(!/[\u0a05-\u0a39\u0a59-\u0a5e]/u.test(text), `${question.qlId}: Hindi review text leaked Gurmukhi letters.`);
  }
  if (question.language === "pa") {
    assert(/[\u0a05-\u0a39\u0a59-\u0a5e]/u.test(text), `${question.qlId}: Punjabi review text has no Gurmukhi letters.`);
    assert(!/[\u0904-\u0939\u0958-\u0961]/u.test(text), `${question.qlId}: Punjabi review text leaked Devanagari letters.`);
  }
  if (question.language !== "en") {
    assert(
      !/\b(choose|select|figure|mirror|water|series|observe|rule|apply|check|option)\b/i.test(text),
      `${question.qlId}/${question.language}: learner-facing English instruction leakage.`,
    );
  }
}

function figureStrip(svgs: readonly string[], prefix: string, labels?: readonly string[]) {
  return `<div class="figure-strip">${svgs.map((svg, index) => {
    const caption = labels?.[index] ?? String(index + 1);
    return `<div class="figure"><div class="figure-cap">${esc(prefix)} ${esc(caption)}</div>${svg}</div>`;
  }).join("")}</div>`;
}

function languagePanel(
  languageLabel: string,
  question: ReturnType<typeof generateSpatialProductionStudioQuestionV1>,
  keys: { observation: string; rule: string; application: string; check: string },
) {
  return `<div class="language-card"><h4>${esc(languageLabel)}</h4><div class="ql-name">${esc(question.qlName)}</div><p class="stem">${esc(question.stem)}</p><div class="explanation"><p><strong>${esc(keys.observation)}:</strong> ${esc(question.explanation.observation)}</p><p><strong>${esc(keys.rule)}:</strong> ${esc(question.explanation.rule)}</p><p><strong>${esc(keys.application)}:</strong> ${esc(question.explanation.application)}</p><p><strong>${esc(keys.check)}:</strong> ${esc(question.explanation.check)}</p></div></div>`;
}

const samples = SPATIAL_PERMANENT_QL_ALLOCATIONS_V1.map((allocation) => {
  const seed = `SPA-HI-PA-HUMAN-REVIEW:${allocation.permanentQlId}:V1`;
  const en = generateSpatialProductionStudioQuestionV1({ qlId: allocation.permanentQlId, seed, language: "en" });
  const hi = generateSpatialProductionStudioQuestionV1({ qlId: allocation.permanentQlId, seed, language: "hi" });
  const pa = generateSpatialProductionStudioQuestionV1({ qlId: allocation.permanentQlId, seed, language: "pa" });

  assert(JSON.stringify(geometryProjection(en)) === JSON.stringify(geometryProjection(hi)), `${allocation.permanentQlId}: English/Hindi geometry-answer parity failed.`);
  assert(JSON.stringify(geometryProjection(en)) === JSON.stringify(geometryProjection(pa)), `${allocation.permanentQlId}: English/Punjabi geometry-answer parity failed.`);
  assert(en.canonicalItemId === hi.canonicalItemId && en.canonicalItemId === pa.canonicalItemId, `${allocation.permanentQlId}: canonical item linkage differs by language.`);
  assert(new Set([en.questionLanguageId, hi.questionLanguageId, pa.questionLanguageId]).size === 3, `${allocation.permanentQlId}: language IDs are not distinct.`);
  assert(en.stem !== hi.stem && en.stem !== pa.stem && hi.stem !== pa.stem, `${allocation.permanentQlId}: stems are not distinctly localized.`);
  assert(en.lifecycle.manualApprovalRequired && hi.lifecycle.manualApprovalRequired && pa.lifecycle.manualApprovalRequired, `${allocation.permanentQlId}: manual approval contract changed.`);
  assert(!en.lifecycle.automaticStudentPublication && !hi.lifecycle.automaticStudentPublication && !pa.lifecycle.automaticStudentPublication, `${allocation.permanentQlId}: automatic publication was enabled.`);
  scriptGate(hi);
  scriptGate(pa);

  return {
    permanentQlId: allocation.permanentQlId,
    proposalId: allocation.proposalId,
    chapterCode: allocation.chapterCode,
    difficulty: en.difficultyBand,
    mode: en.mode,
    seed,
    correctOption: en.answer,
    canonicalItemId: en.canonicalItemId,
    contentFingerprint: en.contentFingerprint,
    stimulusSvgs: en.stimulusSvgs,
    optionSvgs: en.optionSvgs,
    optionLabels: en.optionLabels,
    languages: {
      en: {
        questionLanguageId: en.questionLanguageId,
        qlName: en.qlName,
        stem: en.stem,
        explanation: en.explanation,
      },
      hi: {
        questionLanguageId: hi.questionLanguageId,
        qlName: hi.qlName,
        stem: hi.stem,
        explanation: hi.explanation,
      },
      pa: {
        questionLanguageId: pa.questionLanguageId,
        qlName: pa.qlName,
        stem: pa.stem,
        explanation: pa.explanation,
      },
    },
  };
});

assert(samples.length === 30, `Expected 30 permanent QL review samples, got ${samples.length}.`);
assert(new Set(samples.map((sample) => sample.permanentQlId)).size === 30, "Review pack does not cover 30 unique permanent QLs.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.supportedLanguages.join(",") === "en,hi,pa", "SPA-001 no longer exposes en/hi/pa.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.hindiPunjabiGeneration, "SPA-001 Hindi/Punjabi generation is disabled.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.localizationAuthority === SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1, "Localization authority changed.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.manualApprovalRequired, "Manual approval is no longer required.");
assert(!SPATIAL_QUESTION_STUDIO_PACKAGE_V1.automaticStudentPublication, "Automatic student publication must remain disabled.");

const sections = samples.map((sample, index) => {
  const en = sample.languages.en;
  const hi = sample.languages.hi;
  const pa = sample.languages.pa;
  return `<section class="ql" id="${esc(sample.permanentQlId)}"><div class="ql-head"><div><div class="eyebrow">${index + 1} / 30 · ${esc(sample.chapterCode)} · ${esc(sample.difficulty)}</div><h2>${esc(sample.permanentQlId)} — ${esc(en.qlName)}</h2><div class="meta">Mode: ${esc(sample.mode)} · ${esc(sample.contentFingerprint)}</div></div><div class="answer-pill">Correct: ${esc(sample.correctOption)}</div></div>${sample.stimulusSvgs.length ? `<h3>Shared stimulus</h3>${figureStrip(sample.stimulusSvgs, "Figure")}` : ""}<h3>Shared options</h3>${figureStrip(sample.optionSvgs, "Option", sample.optionLabels)}<div class="language-grid">${languagePanel("English", { ...sample, ...en, language: "en", explanation: en.explanation } as any, { observation: "Observe", rule: "Rule", application: "Apply", check: "Check" })}${languagePanel("हिन्दी", { ...sample, ...hi, language: "hi", explanation: hi.explanation } as any, { observation: "अवलोकन", rule: "नियम", application: "प्रयोग", check: "जाँच" })}${languagePanel("ਪੰਜਾਬੀ", { ...sample, ...pa, language: "pa", explanation: pa.explanation } as any, { observation: "ਨਿਰੀਖਣ", rule: "ਨਿਯਮ", application: "ਲਾਗੂ ਕਰੋ", check: "ਜਾਂਚ" })}</div><div class="review-box"><strong>Human editorial review</strong><div class="checks"><label><input type="checkbox"> Meaning matches English exactly</label><label><input type="checkbox"> Hindi sounds natural for an exam student</label><label><input type="checkbox"> Punjabi sounds natural for an exam student</label><label><input type="checkbox"> Terminology is consistent</label><label><input type="checkbox"> Explanation is specific to this generated rule</label><label><input type="checkbox"> No awkward literal translation</label></div><div class="notes">Reviewer notes: ________________________________________________</div></div></section>`;
}).join("\n");

const chapterCounts = Object.fromEntries(
  [...new Set(samples.map((sample) => sample.chapterCode))].map((chapterCode) => [
    chapterCode,
    samples.filter((sample) => sample.chapterCode === chapterCode).length,
  ]),
);

const reviewJson = {
  version: "SPA-FND-001-HI-PA-HUMAN-REVIEW-PACK-V1",
  reviewStatus: "HINDI_PUNJABI_HUMAN_EDITORIAL_REVIEW_PENDING",
  packageId: "SPA-001",
  localizationAuthority: SPATIAL_HI_PA_LOCALIZATION_AUTHORITY_V1,
  releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
  coverage: {
    permanentQls: samples.length,
    languages: ["en", "hi", "pa"],
    samplesPerQl: 1,
    totalLanguageRenderings: samples.length * 3,
    chapterCounts,
  },
  parityContract: {
    geometryByteIdentical: true,
    optionOrderIdentical: true,
    correctAnswerIdentical: true,
    canonicalItemSharedAcrossLanguages: true,
    distinctQuestionLanguageIds: true,
  },
  holdsExcluded: [...SPATIAL_QUESTION_STUDIO_PACKAGE_V1.holdsUnallocated],
  lifecycle: {
    standardQuestionStudioLifecycle: true,
    manualApprovalRequired: true,
    automaticStudentPublication: false,
  },
  samples,
};

const evidence = {
  status: "PASS_SPA_FND_001_HI_PA_HUMAN_REVIEW_PACK_READY_V1",
  coverage: reviewJson.coverage,
  checks: {
    allThirtyPermanentQlsRepresented: true,
    englishHindiPunjabiGeometryParity: true,
    answerParity: true,
    canonicalItemLinkage: true,
    distinctLanguageIds: true,
    hindiDevanagariGate: true,
    punjabiGurmukhiGate: true,
    crossScriptLeakageGate: true,
    englishInstructionLeakageGate: true,
    manualApprovalPreserved: true,
    automaticPublicationStillDisabled: true,
    holdsRemainExcluded: true,
  },
  reviewStatus: reviewJson.reviewStatus,
  nextGate: "SPA_001_HI_PA_HUMAN_EDITORIAL_APPROVAL_V1",
};

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ExamTree Spatial Hindi Punjabi Human Review V1</title><style>body{margin:0;background:#f3f4f6;color:#111827;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}main{max-width:1380px;margin:auto;padding:24px}.summary,.ql{background:#fff;border:1px solid #d1d5db;border-radius:14px;padding:20px;margin-bottom:22px}.summary h1{margin-top:0}.summary .pending{font-weight:700;color:#92400e;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px}.summary-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.metric{border:1px solid #e5e7eb;border-radius:9px;padding:10px}.metric b{display:block;font-size:20px}.ql-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.eyebrow,.meta{font-size:12px;color:#6b7280}.ql h2{margin:5px 0}.answer-pill{white-space:nowrap;background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;font-weight:700;border-radius:999px;padding:7px 11px}.figure-strip{display:flex;flex-wrap:wrap;gap:12px;margin:10px 0 18px}.figure{width:128px;min-height:128px;border:1px solid #d1d5db;border-radius:9px;padding:7px;background:#fff;text-align:center}.figure svg{width:100%;height:auto;display:block}.figure-cap{font-size:11px;color:#6b7280;margin-bottom:4px}.language-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px}.language-card{border:1px solid #d1d5db;border-radius:10px;padding:13px;background:#fafafa}.language-card h4{margin:0 0 7px}.ql-name{font-size:12px;color:#6b7280;margin-bottom:8px}.stem{font-weight:650;line-height:1.5}.explanation{border-top:1px solid #e5e7eb;margin-top:10px;padding-top:8px}.explanation p{margin:7px 0;line-height:1.48}.review-box{margin-top:16px;border:1px dashed #9ca3af;border-radius:10px;padding:12px;background:#fff}.checks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:9px;font-size:13px}.checks label{display:flex;gap:6px;align-items:flex-start}.notes{margin-top:12px;font-size:13px;color:#4b5563}@media(max-width:900px){.summary-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.language-grid{grid-template-columns:1fr}.checks{grid-template-columns:1fr}}@media(max-width:520px){main{padding:8px}.summary,.ql{padding:12px;border-radius:10px}.summary-grid{grid-template-columns:1fr 1fr}.figure{width:104px;min-height:104px}.ql-head{display:block}.answer-pill{display:inline-block;margin-top:8px}}</style></head><body><main><section class="summary"><h1>ExamTree Spatial — Hindi & Punjabi Human Review V1</h1><p><strong>Purpose:</strong> editorial review only. The diagram, option order and correct answer are frozen to the approved English authority; reviewers should judge wording, naturalness, terminology and explanation quality.</p><div class="summary-grid"><div class="metric"><b>30</b>Permanent QLs</div><div class="metric"><b>30</b>Representative questions</div><div class="metric"><b>90</b>Language renderings</div><div class="metric"><b>3</b>English / हिन्दी / ਪੰਜਾਬੀ</div></div><p class="pending">Status: Hindi/Punjabi human editorial approval is pending. Do not change SVG geometry during language remediation.</p><p>Reviewer focus: exact meaning parity, natural exam-style Hindi/Punjabi, consistent reasoning terminology, question-specific Apply/Check steps, and absence of literal/awkward translation. The two intentional held patterns remain excluded.</p></section>${sections}</main></body></html>`;

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-hi-pa-human-review-pack-v1.json", JSON.stringify(reviewJson, null, 2));
writeFileSync("dist/reasoning-v1/spatial/spa-hi-pa-human-review-pack-v1.html", html);
writeFileSync("dist/reasoning-v1/spatial/spa-hi-pa-human-review-pack-v1-evidence.json", JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence, null, 2));
