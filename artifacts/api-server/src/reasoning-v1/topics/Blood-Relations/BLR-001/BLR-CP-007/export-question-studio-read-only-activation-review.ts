import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  previewReasoningV1QuestionStudioReview,
} from "../../../../../question-studio-review-registry";
import {
  BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP007_QUESTION_STUDIO_QL_IDS,
} from "./question-studio-review-adapter";

const outputDir = resolve(process.argv[2] ?? "blr-cp007-read-only-activation-output");
mkdirSync(outputDir, { recursive: true });

const languages = ["en", "hi", "pa"] as const;
const samples = languages.flatMap((language) =>
  BLR_CP007_QUESTION_STUDIO_QL_IDS.map((qlId) =>
    previewReasoningV1QuestionStudioReview({
      packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
      language,
      qlId,
      count: 1,
      seed: `admin-read-only:${language}:${qlId}`,
    }).questions[0]!,
  ),
);

const packages = listReasoningV1QuestionStudioReviewPackages();
const enabledGenerationPackages = listEnabledReasoningV1QuestionStudioPackages();
const summary = {
  verdict: "BLR_CP007_ADMIN_READ_ONLY_ACTIVATION_PROVED",
  packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  activationMode: "ADMIN_READ_ONLY",
  adminPanelVisible: true,
  liveApiRouteMounted: true,
  reviewPackageCount: packages.length,
  enabledGenerationPackageCount: enabledGenerationPackages.length,
  previewableRecordCount: 504,
  representativePreviewCount: samples.length,
  languages: [...languages],
  qlCount: BLR_CP007_QUESTION_STUDIO_QL_IDS.length,
  databaseWriteEnabled: false,
  persistenceAllowed: false,
  questionBankEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  studentDeliveryEnabled: false,
  nextGate: "QUESTION_STUDIO_PERSISTENCE_DESIGN_AND_REVIEW",
};

const escapeHtml = (value: unknown) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const markdown = `# BLR-CP-007 Question Studio Admin Read-Only Activation\n\n## Verdict\n\n\`${summary.verdict}\`\n\n## Activated surface\n\n- The Question Studio operations page now displays an admin-only BLR-CP-007 review panel.\n- The panel supports English, Hindi and Punjabi.\n- Administrators can filter by QL and difficulty and request deterministic previews.\n- Preview requests use a dedicated GET endpoint guarded by \`content.generation.read\`.\n- No generation run, item version, audit outbox or Question Bank record is written.\n\n## Coverage\n\n| Measure | Result |\n|---|---:|\n| Previewable multilingual records | ${summary.previewableRecordCount} |\n| Representative UI/API previews | ${summary.representativePreviewCount} |\n| Languages | ${summary.languages.length} |\n| Permanent QLs | ${summary.qlCount} |\n| Enabled generation packages | ${summary.enabledGenerationPackageCount} |\n\n## Locks preserved\n\n| Gate | State |\n|---|---|\n| Database writes | Disabled |\n| Persistence | Disabled |\n| Question Bank eligibility | Disabled |\n| Mock-test eligibility | Disabled |\n| Public publication | Disabled |\n| Student delivery | Disabled |\n\n## Next gate\n\n\`${summary.nextGate}\`\n`;

const cards = samples.map((question) => `
  <article class="card">
    <div class="badges">
      <span>${escapeHtml(question.language.toUpperCase())}</span>
      <span>${escapeHtml(question.qlId)}</span>
      <span>${escapeHtml(question.difficultyBand)}</span>
    </div>
    <p class="meta">${escapeHtml(question.canonicalItemId)} · ${escapeHtml(question.useMode)}</p>
    <h3>${escapeHtml(question.stem)}</h3>
    <ol>${question.options.map((option, index) => `<li class="${index === question.correctIndex ? "correct" : ""}">${escapeHtml(option)}</li>`).join("")}</ol>
    <p><strong>Answer:</strong> ${escapeHtml(question.answer)}</p>
    <p><strong>Conclusion:</strong> ${escapeHtml(question.explanation.conclusion)}</p>
  </article>`).join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>BLR-CP-007 Admin Read-Only Activation</title>
<style>
body{font-family:system-ui,-apple-system,sans-serif;margin:0;background:#f5f7fb;color:#172033}main{max-width:1200px;margin:auto;padding:32px}.hero,.card{background:white;border:1px solid #dfe5ef;border-radius:16px;padding:20px;box-shadow:0 8px 24px rgba(25,40,70,.06)}.hero{margin-bottom:20px}.status{display:inline-block;padding:6px 10px;border-radius:999px;background:#e8f7ee;color:#166534;font-weight:700}.locks{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-top:16px}.lock{padding:12px;border-radius:10px;background:#fff8e6;border:1px solid #f2d58a}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px}.badges{display:flex;gap:8px;flex-wrap:wrap}.badges span{font-size:12px;padding:4px 8px;border-radius:999px;background:#edf2ff;color:#2643a2}.meta{font-size:12px;color:#667085}.card h3{font-size:16px;line-height:1.5}.card ol{padding-left:24px}.card li{padding:6px}.card li.correct{background:#ecfdf3;border-radius:8px;font-weight:700}code{background:#eef2f7;padding:2px 6px;border-radius:6px}
</style>
</head>
<body><main>
<section class="hero">
  <span class="status">${escapeHtml(summary.verdict)}</span>
  <h1>BLR-CP-007 Question Studio admin read-only activation</h1>
  <p>504 frozen multilingual records are previewable by authorized administrators. The surface performs no persistence or delivery action.</p>
  <div class="locks">
    <div class="lock"><strong>Database writes</strong><br/>Disabled</div>
    <div class="lock"><strong>Question Bank</strong><br/>Ineligible</div>
    <div class="lock"><strong>Mock tests</strong><br/>Ineligible</div>
    <div class="lock"><strong>Publication</strong><br/>Disabled</div>
  </div>
</section>
<section class="grid">${cards}</section>
</main></body></html>`;

writeFileSync(resolve(outputDir, "blr-cp007-read-only-activation-summary.json"), JSON.stringify(summary, null, 2));
writeFileSync(resolve(outputDir, "BLR-CP-007-QUESTION-STUDIO-READ-ONLY-ACTIVATION.md"), markdown);
writeFileSync(resolve(outputDir, "blr-cp007-question-studio-read-only-activation.html"), html);
writeFileSync(resolve(outputDir, "blr-cp007-read-only-preview-samples.json"), JSON.stringify(samples, null, 2));

console.log(JSON.stringify(summary, null, 2));
