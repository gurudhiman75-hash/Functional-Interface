import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { buildSea001SaturationCorpus, selectManualReviewCorpus, structuralVariantFingerprint } from "./saturation/corpus.ts";
import { auditSea001Corpus } from "./saturation/residual-audit.ts";

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

const outputDir = process.env.SEA_001_REVIEW_OUTPUT_DIR ?? "/tmp/sea-001-review";
await mkdir(outputDir, { recursive: true });

const smallCorpus = buildSea001SaturationCorpus(5);
const review = selectManualReviewCorpus(smallCorpus.caselets, 5);
const audit = auditSea001Corpus(
  review,
  smallCorpus.rejectedExactDuplicateCandidates,
  smallCorpus.rejectedNormalizedClueSetCandidates,
);

const records = review.map((caselet, index) => ({
  reviewNo: index + 1,
  packageId: "SEA-001",
  checkpointId: caselet.checkpointId,
  blueprintAuthorityId: caselet.blueprintAuthorityId,
  structuralVariantFingerprint: structuralVariantFingerprint(caselet),
  caseletId: caselet.caseletId,
  seed: caselet.seed,
  setup: caselet.setupText,
  clues: caselet.clueTexts,
  arrangement: caselet.diagramText ?? caselet.diagram?.text ?? "",
  sharedExplanation: caselet.sharedExplanation,
  children: caselet.children.map((child) => ({
    questionOrder: child.questionOrder,
    queryContractId: child.queryContractId,
    answerType: child.answerType,
    question: child.text,
    options: child.options.map((option, optionIndex) => ({
      option: optionIndex + 1,
      display: option.display,
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId ?? null,
      recomputation: option.recomputation,
      explanation: option.explanation,
    })),
    answerIndex: child.answerIndex,
    answer: child.answer,
    explanation: child.explanation,
  })),
  review: {
    setupNaturalness: "PENDING_HUMAN_REVIEW",
    clueClarity: "PENDING_HUMAN_REVIEW",
    queryFamilyDiversity: "PENDING_HUMAN_REVIEW",
    answerLeakageSafety: "PENDING_HUMAN_REVIEW",
    checkpointSkillCoverage: "PENDING_HUMAN_REVIEW",
    answerSequenceNaturalness: "PENDING_HUMAN_REVIEW",
    facingClarity: "PENDING_HUMAN_REVIEW",
    inferenceCoherence: "PENDING_HUMAN_REVIEW",
    difficultyRealism: "PENDING_HUMAN_REVIEW",
    diagramCorrectness: "PENDING_HUMAN_REVIEW",
    repetition: "PENDING_HUMAN_REVIEW",
    translationRisk: "PENDING_HUMAN_REVIEW",
    editorialDecision: "PENDING_HUMAN_REVIEW",
    reviewNotes: "",
  },
}));

const jsonPayload = {
  authority: "SEA Seating Arrangement Master End-to-End Family Design V3 merged",
  status: "HUMAN_REVIEW_CANDIDATE_NOT_FROZEN",
  reviewPolicy: "20 caselets per checkpoint; REWRITE and REJECT must be zero before freeze",
  counts: {
    caselets: records.length,
    children: records.reduce((sum, record) => sum + record.children.length, 0),
    checkpointDistribution: audit.checkpointDistribution,
    blueprintDistribution: audit.blueprintDistribution,
  },
  records,
};

const csvHeader = [
  "reviewNo", "checkpointId", "blueprintAuthorityId", "structuralVariantFingerprint", "caseletId", "seed",
  "setup", "clues", "arrangement", "sharedExplanation", "childrenJson", "editorialDecision", "reviewNotes",
].join(",");
const csvRows = records.map((record) => [
  record.reviewNo,
  record.checkpointId,
  record.blueprintAuthorityId,
  record.structuralVariantFingerprint,
  record.caseletId,
  record.seed,
  record.setup,
  record.clues,
  record.arrangement,
  record.sharedExplanation,
  record.children,
  record.review.editorialDecision,
  record.review.reviewNotes,
].map(csvCell).join(","));

const htmlSections = records.map((record) => `
<section class="caselet">
  <h2>${record.reviewNo}. ${escapeHtml(record.checkpointId)} · ${escapeHtml(record.blueprintAuthorityId)}</h2>
  <p><strong>Caselet:</strong> ${escapeHtml(record.caseletId)}</p>
  <p><strong>Structural variant:</strong> <code>${escapeHtml(record.structuralVariantFingerprint)}</code></p>
  <h3>Directions</h3><p>${escapeHtml(record.setup)}</p>
  <ol>${record.clues.map((clue) => `<li>${escapeHtml(clue)}</li>`).join("")}</ol>
  <h3>Solved arrangement</h3><pre>${escapeHtml(record.arrangement)}</pre>
  <h3>Shared explanation</h3><pre>${escapeHtml(record.sharedExplanation)}</pre>
  <h3>Child questions</h3>
  ${record.children.map((child) => `
    <article class="child">
      <h4>Q${child.questionOrder} · ${escapeHtml(child.queryContractId)}</h4>
      <p>${escapeHtml(child.question)}</p>
      <ol type="A">${child.options.map((option) => `<li><strong>${escapeHtml(option.display)}</strong>${option.isCorrect ? " ✓" : ""}<br><small>${escapeHtml(option.misconceptionId ?? "CORRECT")} · ${escapeHtml(option.explanation)}</small></li>`).join("")}</ol>
      <p><strong>Answer:</strong> ${escapeHtml(child.answer)}</p>
      <p><strong>Explanation:</strong> ${escapeHtml(child.explanation)}</p>
    </article>`).join("")}
  <h3>Human review</h3>
  <p><strong>Editorial decision:</strong> PENDING_HUMAN_REVIEW</p>
  <p>Review setup naturalness, clue clarity, query diversity, leakage safety, skill coverage, facing clarity, inference coherence, difficulty realism, diagram correctness, repetition, translation risk, option quality and explanation quality.</p>
</section>`).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><title>SEA-001 100-caselet English review</title><style>
body{font-family:system-ui,sans-serif;max-width:1100px;margin:0 auto;padding:24px;line-height:1.45} .caselet{border:1px solid #bbb;border-radius:12px;padding:20px;margin:24px 0}.child{border-top:1px solid #ddd;padding-top:10px;margin-top:14px}pre{white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px}code{overflow-wrap:anywhere}small{opacity:.8}
</style></head><body><h1>SEA-001 — 100-caselet English manual-review candidate</h1><p>This is review evidence, not an English freeze. Exactly 20 caselets are included per checkpoint.</p>${htmlSections}</body></html>`;

await writeFile(join(outputDir, "sea-001-review-100.json"), `${JSON.stringify(jsonPayload, null, 2)}\n`, "utf8");
await writeFile(join(outputDir, "sea-001-review-100.csv"), `${csvHeader}\n${csvRows.join("\n")}\n`, "utf8");
await writeFile(join(outputDir, "sea-001-review-100.html"), html, "utf8");

console.log("WROTE_SEA_001_REVIEW", records.length, outputDir);
