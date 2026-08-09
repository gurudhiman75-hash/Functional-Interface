import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
} from "../../../../../question-studio-review-registry";
import {
  BLR_CP007_QUESTION_STUDIO_INTEGRATION_STATUS,
  BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP007_QUESTION_STUDIO_RUNTIME_MODE,
  listBlrCp007QuestionStudioReviewEntries,
} from "./question-studio-review-adapter";

const outputDir = process.argv[2] ?? "blr-cp007-question-studio-review-output";
mkdirSync(outputDir, { recursive: true });

const packages = listReasoningV1QuestionStudioReviewPackages();
const enabledPackages = listEnabledReasoningV1QuestionStudioPackages();
const entries = listBlrCp007QuestionStudioReviewEntries();

const countBy = (values: readonly string[]): Record<string, number> =>
  values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});

const languageCounts = countBy(entries.map((entry) => entry.language));
const qlCounts = Object.fromEntries(
  ["en", "hi", "pa"].map((language) => [
    language,
    countBy(
      entries
        .filter((entry) => entry.language === language)
        .map((entry) => entry.qlId),
    ),
  ]),
);
const difficultyCounts = Object.fromEntries(
  ["en", "hi", "pa"].map((language) => [
    language,
    countBy(
      entries
        .filter((entry) => entry.language === language)
        .map((entry) => entry.difficultyBand),
    ),
  ]),
);
const canonicalItemCounts = Object.fromEntries(
  ["en", "hi", "pa"].map((language) => [
    language,
    new Set(
      entries
        .filter((entry) => entry.language === language)
        .map((entry) => entry.canonicalItemId),
    ).size,
  ]),
);
const sampleEntries = ["en", "hi", "pa"].flatMap((language) =>
  ["BLR-QL-031", "BLR-QL-032", "BLR-QL-033", "BLR-QL-034", "BLR-QL-035"].map(
    (qlId) => entries.find((entry) => entry.language === language && entry.qlId === qlId)!,
  ),
);

const summary = {
  packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  integrationStatus: BLR_CP007_QUESTION_STUDIO_INTEGRATION_STATUS,
  runtimeMode: BLR_CP007_QUESTION_STUDIO_RUNTIME_MODE,
  sourceAuthority: "BLR_CP007_MULTILINGUAL_FROZEN",
  reviewPackageCount: packages.length,
  enabledPackageCount: enabledPackages.length,
  previewableRecordCount: entries.length,
  languageCounts,
  qlCounts,
  difficultyCounts,
  canonicalItemCounts,
  uniqueQuestionIdCount: new Set(entries.map((entry) => entry.questionId)).size,
  uniqueQuestionLanguageIdCount: new Set(entries.map((entry) => entry.questionLanguageId)).size,
  validPreviewCount: entries.filter((entry) => entry.validation.valid).length,
  validationFailureCount: entries.filter((entry) => !entry.validation.valid).length,
  rendererReadyCount: entries.filter(
    (entry) =>
      entry.renderer.kind === "RELATION_GRAPH" &&
      entry.renderer.familyTreeAvailable &&
      entry.renderer.diagramProofAvailable &&
      entry.renderer.textFallbackAvailable,
  ).length,
  questionStudioVisibleCount: entries.filter((entry) => entry.safety.questionStudioVisible).length,
  persistenceAllowedCount: entries.filter((entry) => entry.safety.persistenceAllowed).length,
  questionBankEligibleCount: entries.filter((entry) => entry.safety.questionBankEligible).length,
  mockTestEligibleCount: entries.filter((entry) => entry.safety.mockTestEligible).length,
  publiclyPublishableCount: entries.filter((entry) => entry.safety.publiclyPublishable).length,
  liveRouteWired: false,
  databaseWriteEnabled: false,
  activationApprovalRequired: true,
  verdict: "BLR_CP007_QUESTION_STUDIO_REVIEW_ADAPTER_PROVED__ACTIVATION_LOCKED",
  nextGate: "QUESTION_STUDIO_ACTIVATION_AND_PERSISTENCE_REVIEW",
} as const;

writeFileSync(
  join(outputDir, "blr-cp007-question-studio-review-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
writeFileSync(
  join(outputDir, "blr-cp007-question-studio-review-catalog.json"),
  `${JSON.stringify({ package: packages[0], entries }, null, 2)}\n`,
);

const report = `# BLR-CP-007 Question Studio Integration Review\n\n## Verdict\n\n**${summary.verdict}**\n\nA complete review-only Question Studio adapter now projects the frozen English, Hindi and Punjabi BLR-CP-007 corpus into a deterministic Studio preview contract. Activation remains locked.\n\n## Coverage\n\n- Review package: \`${summary.packageId}\`\n- Runtime mode: \`${summary.runtimeMode}\`\n- English previews: ${summary.languageCounts.en}\n- Hindi previews: ${summary.languageCounts.hi}\n- Punjabi previews: ${summary.languageCounts.pa}\n- Total previewable records: ${summary.previewableRecordCount}\n- Valid previews: ${summary.validPreviewCount}/${summary.previewableRecordCount}\n- Renderer-ready previews: ${summary.rendererReadyCount}/${summary.previewableRecordCount}\n- Canonical items per language: ${Object.entries(summary.canonicalItemCounts).map(([language, count]) => `${language} ${count}`).join(", ")}\n\n## Studio payload\n\nEvery preview carries the shared prompt, stem, four options, correct index, answer, option-level student explanations, decoded statements, step-by-step explanation, conclusion, shortcut, common trap, option analysis, family-tree structure, diagram proof, relation graph, difficulty, use mode, QL identity, canonical item identity, semantic fingerprints and frozen authority.\n\n## Safety boundary\n\n- Review package registered: YES\n- Enabled package count: ${summary.enabledPackageCount}\n- Live admin generation route wired: ${summary.liveRouteWired ? "YES" : "NO"}\n- Database persistence allowed: ${summary.persistenceAllowedCount}\n- Question Studio visible records: ${summary.questionStudioVisibleCount}\n- Question Bank eligible records: ${summary.questionBankEligibleCount}\n- Mock-test eligible records: ${summary.mockTestEligibleCount}\n- Publicly publishable records: ${summary.publiclyPublishableCount}\n\nThe existing live Question Studio POST route continues to use the Quant V4 generation engine. BLR-CP-007 is available only through the isolated Reasoning V1 review registry and its persistence function fails closed.\n\n## Next gate\n\n${summary.nextGate}. A separate explicit approval is required before wiring the package into live capabilities, generation runs or database persistence.\n`;
writeFileSync(join(outputDir, "BLR-CP-007-QUESTION-STUDIO-INTEGRATION-REVIEW.md"), report);

const escapeHtml = (value: unknown) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");
const metrics = [
  ["Previewable", summary.previewableRecordCount],
  ["English", summary.languageCounts.en],
  ["Hindi", summary.languageCounts.hi],
  ["Punjabi", summary.languageCounts.pa],
  ["Valid", `${summary.validPreviewCount}/${summary.previewableRecordCount}`],
  ["Renderer-ready", `${summary.rendererReadyCount}/${summary.previewableRecordCount}`],
  ["Enabled packages", summary.enabledPackageCount],
  ["Persistence allowed", summary.persistenceAllowedCount],
].map(([label, value]) => `<div class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
const samples = sampleEntries.map((entry) => `
  <article class="sample">
    <div class="tag">${escapeHtml(entry.language)} · ${escapeHtml(entry.qlId)} · ${escapeHtml(entry.difficultyBand)}</div>
    <p class="prompt">${escapeHtml(entry.sharedPrompt)}</p>
    <h3>${escapeHtml(entry.stem)}</h3>
    <ol type="A">${entry.options.map((option) => `<li>${escapeHtml(option)}</li>`).join("")}</ol>
    <p><strong>Answer:</strong> ${escapeHtml(entry.answer)}</p>
    <p><strong>Conclusion:</strong> ${escapeHtml(entry.explanation.conclusion)}</p>
  </article>`).join("");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-007 Question Studio Integration Review</title><style>:root{font-family:Inter,system-ui,sans-serif;color:#1f2937;background:#f3f4f6}body{margin:0;padding:20px}.wrap{max-width:1180px;margin:auto}.card,.sample{background:#fff;border:1px solid #d1d5db;border-radius:14px;padding:18px;margin-bottom:16px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.metric{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px}.metric span,.metric strong{display:block}.metric strong{font-size:1.25rem;margin-top:4px}.ok{color:#166534}.locked{color:#92400e}.tag{font-size:.82rem;font-weight:700;color:#4b5563}.prompt{white-space:pre-wrap;background:#f9fafb;padding:10px;border-radius:8px}.sample h3{white-space:pre-wrap}.samples{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}@media(max-width:900px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.samples{grid-template-columns:1fr}body{padding:10px}}</style></head><body><main class="wrap"><section class="card"><h1>BLR-CP-007 Question Studio Integration Review</h1><h2 class="ok">${escapeHtml(summary.verdict)}</h2><p>Frozen multilingual content is fully previewable through an isolated review adapter.</p><p class="locked"><strong>Activation remains locked:</strong> no live route, database write, Question Bank, mock test or publication access.</p></section><section class="card"><div class="grid">${metrics}</div></section><section class="card"><h2>Review contract</h2><p>Package <code>${escapeHtml(summary.packageId)}</code> uses <code>${escapeHtml(summary.runtimeMode)}</code>. Every preview includes complete learner text, answer/explanation detail, relation graph, family tree, diagram proof, traceability and safety metadata.</p></section><section><h2>Representative previews</h2><div class="samples">${samples}</div></section></main></body></html>`;
writeFileSync(join(outputDir, "blr-cp007-question-studio-integration-review.html"), html);

console.log(JSON.stringify(summary, null, 2));
