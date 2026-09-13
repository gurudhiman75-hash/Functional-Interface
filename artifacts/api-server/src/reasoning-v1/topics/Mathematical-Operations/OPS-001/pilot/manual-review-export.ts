import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  OPS_REPRESENTATIVE_PILOT_IDS,
  generateOpsRepresentativePilot,
  type OpsPilotExplanationStep,
  type OpsPilotOption,
  type OpsPilotQuestion,
} from "./representative-pilots";
import {
  OPS_SUPPLEMENTARY_PILOT_IDS,
  generateOpsSupplementaryPilot,
} from "./supplementary-pilots";
import {
  OPS_FINAL_CANDIDATE_PILOT_IDS,
  generateOpsFinalCandidatePilot,
} from "./final-candidate-pilots";
import { localizeOpsPilotQuestion } from "./localization";

type ReviewLocale = "en-IN" | "hi-IN" | "pa-IN";
type ReviewStatus = "RETAINED" | "MERGED_PRESENTATION_VARIANT";

interface ReviewQuestion {
  candidateId: string;
  checkpointId: string;
  seed: number;
  locale: ReviewLocale;
  taskKind: string;
  solveMode: string;
  renderer: string;
  stem: string;
  options: readonly OpsPilotOption[];
  correctIndex: number;
  answer: string;
  explanation: {
    ruleStatement: string;
    steps: readonly OpsPilotExplanationStep[];
    conclusion: string;
  };
  proof: {
    unique: true;
    solverRoute: string;
    eligibleCandidateCount: number;
    survivingCandidateCount: 1;
    semanticFingerprint: string;
  };
  metadata: Readonly<Record<string, string | number | boolean>>;
}

interface ReviewRecord extends ReviewQuestion {
  reviewId: string;
  reviewStatus: ReviewStatus;
  mergedInto: string | null;
}

const ENGLISH_REVIEW_SEEDS = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55] as const;
const LOCALIZED_REVIEW_SEEDS = [0, 3, 7, 13, 21] as const;
const MERGED_INTO: Readonly<Record<string, string>> = {
  "OPS-CAND-002": "OPS-CAND-001",
  "OPS-CAND-006": "OPS-CAND-004",
  "OPS-CAND-031": "OPS-CAND-030",
};

const ALL_CANDIDATE_IDS = [
  ...OPS_REPRESENTATIVE_PILOT_IDS,
  ...OPS_SUPPLEMENTARY_PILOT_IDS,
  ...OPS_FINAL_CANDIDATE_PILOT_IDS,
].sort((left, right) => left.localeCompare(right));

const CONSOLIDATED_CANDIDATE_IDS = ALL_CANDIDATE_IDS.filter((candidateId) => !MERGED_INTO[candidateId]);
const REPRESENTATIVE_ID_SET = new Set<string>(OPS_REPRESENTATIVE_PILOT_IDS);
const SUPPLEMENTARY_ID_SET = new Set<string>(OPS_SUPPLEMENTARY_PILOT_IDS);

function generateEnglish(candidateId: string, seed: number): ReviewQuestion {
  if (REPRESENTATIVE_ID_SET.has(candidateId)) {
    return generateOpsRepresentativePilot(candidateId as (typeof OPS_REPRESENTATIVE_PILOT_IDS)[number], seed);
  }
  if (SUPPLEMENTARY_ID_SET.has(candidateId)) {
    return generateOpsSupplementaryPilot(candidateId as (typeof OPS_SUPPLEMENTARY_PILOT_IDS)[number], seed);
  }
  return generateOpsFinalCandidatePilot(candidateId as (typeof OPS_FINAL_CANDIDATE_PILOT_IDS)[number], seed);
}

function toRecord(question: ReviewQuestion): ReviewRecord {
  const mergedInto = MERGED_INTO[question.candidateId] ?? null;
  return {
    ...question,
    reviewId: `${question.candidateId}-${question.locale}-S${String(question.seed).padStart(3, "0")}`,
    reviewStatus: mergedInto ? "MERGED_PRESENTATION_VARIANT" : "RETAINED",
    mergedInto,
  };
}

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function optionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

function questionCard(record: ReviewRecord, ordinal: number): string {
  const mergeBadge = record.mergedInto
    ? `<span class="badge merged">Merged into ${escapeHtml(record.mergedInto)}</span>`
    : `<span class="badge retained">Retained</span>`;
  const options = record.options.map((option, index) => `
      <li><span class="option-label">${optionLabel(index)}</span><span>${escapeHtml(option.value)}</span></li>`).join("");
  const steps = record.explanation.steps.map((step, index) => `
        <li><strong>${index + 1}. ${escapeHtml(step.label)}</strong><br><code>${escapeHtml(step.expression)}</code><br><span>${escapeHtml(step.result)}</span></li>`).join("");
  const metadata = Object.entries(record.metadata).map(([key, value]) => `<tr><th>${escapeHtml(key)}</th><td>${escapeHtml(value)}</td></tr>`).join("");
  return `
  <article class="question-card" data-cp="${escapeHtml(record.checkpointId)}" data-candidate="${escapeHtml(record.candidateId)}" data-locale="${escapeHtml(record.locale)}">
    <header>
      <div>
        <span class="ordinal">#${ordinal}</span>
        <strong>${escapeHtml(record.reviewId)}</strong>
        ${mergeBadge}
      </div>
      <div class="meta-line">${escapeHtml(record.checkpointId)} · ${escapeHtml(record.taskKind)} · ${escapeHtml(record.renderer)}</div>
    </header>
    <section class="question-body">
      <h3>${escapeHtml(record.stem)}</h3>
      <ol class="options">${options}</ol>
    </section>
    <section class="review-grid">
      <label><input type="checkbox"> Stem natural</label>
      <label><input type="checkbox"> Meaning unambiguous</label>
      <label><input type="checkbox"> Options plausible</label>
      <label><input type="checkbox"> Answer verified</label>
      <label><input type="checkbox"> Explanation useful</label>
      <label><input type="checkbox"> Layout/script safe</label>
    </section>
    <label class="notes-label">Reviewer notes<textarea rows="3" placeholder="Record wording, option, answer, explanation, translation or rendering issues..."></textarea></label>
    <details class="answer-panel">
      <summary>Answer, explanation and solver proof</summary>
      <p><strong>Correct option:</strong> ${optionLabel(record.correctIndex)} — ${escapeHtml(record.answer)}</p>
      <p><strong>Rule:</strong> ${escapeHtml(record.explanation.ruleStatement)}</p>
      <ol class="steps">${steps}</ol>
      <p><strong>Conclusion:</strong> ${escapeHtml(record.explanation.conclusion)}</p>
      <table>
        <tr><th>Solve mode</th><td>${escapeHtml(record.solveMode)}</td></tr>
        <tr><th>Solver route</th><td>${escapeHtml(record.proof.solverRoute)}</td></tr>
        <tr><th>Eligible candidates</th><td>${record.proof.eligibleCandidateCount}</td></tr>
        <tr><th>Survivors</th><td>${record.proof.survivingCandidateCount}</td></tr>
        <tr><th>Fingerprint</th><td><code>${escapeHtml(record.proof.semanticFingerprint)}</code></td></tr>
        ${metadata}
      </table>
    </details>
  </article>`;
}

function renderHtml(title: string, records: readonly ReviewRecord[], subtitle: string): string {
  const checkpoints = [...new Set(records.map((record) => record.checkpointId))].sort();
  const candidates = [...new Set(records.map((record) => record.candidateId))].sort();
  const cards = records.map((record, index) => questionCard(record, index + 1)).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
:root { font-family: Inter, system-ui, -apple-system, "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif; line-height: 1.45; color: #171717; background: #f4f4f5; }
body { margin: 0; }
.toolbar { position: sticky; top: 0; z-index: 5; padding: 12px 18px; background: rgba(255,255,255,.97); border-bottom: 1px solid #d4d4d8; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.toolbar input, .toolbar select, .toolbar button { padding: 8px 10px; border: 1px solid #a1a1aa; border-radius: 6px; background: white; }
main { max-width: 1050px; margin: 0 auto; padding: 24px; }
.hero { background: white; border: 1px solid #d4d4d8; border-radius: 10px; padding: 20px; margin-bottom: 18px; }
.question-card { background: white; border: 1px solid #d4d4d8; border-radius: 10px; margin: 18px 0; overflow: hidden; break-inside: avoid; }
.question-card > header { padding: 12px 16px; background: #fafafa; border-bottom: 1px solid #e4e4e7; display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.ordinal { color: #52525b; margin-right: 8px; }.meta-line { color: #52525b; font-size: .86rem; }
.badge { display: inline-block; margin-left: 8px; padding: 2px 7px; border-radius: 999px; font-size: .72rem; font-weight: 700; }.retained { background: #dcfce7; }.merged { background: #fef3c7; }
.question-body { padding: 16px; }.question-body h3 { margin-top: 0; font-size: 1.08rem; }.options { list-style: none; padding: 0; display: grid; gap: 8px; }.options li { border: 1px solid #e4e4e7; border-radius: 7px; padding: 9px; display: flex; gap: 10px; }.option-label { min-width: 24px; height: 24px; border-radius: 50%; background: #e4e4e7; text-align: center; font-weight: 700; }
.review-grid { padding: 0 16px 12px; display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 8px; font-size: .9rem; }.notes-label { display: block; padding: 0 16px 14px; font-weight: 700; }.notes-label textarea { width: 100%; box-sizing: border-box; margin-top: 5px; padding: 8px; font: inherit; }
.answer-panel { border-top: 1px solid #e4e4e7; padding: 12px 16px; background: #fafafa; }.answer-panel summary { cursor: pointer; font-weight: 700; }.steps li { margin-bottom: 9px; }.answer-panel table { border-collapse: collapse; width: 100%; font-size: .86rem; }.answer-panel th, .answer-panel td { border: 1px solid #d4d4d8; padding: 6px; vertical-align: top; }.answer-panel th { width: 180px; text-align: left; }
.hidden { display: none !important; }
@media print { .toolbar { display: none; } main { max-width: none; padding: 0; } .question-card { page-break-inside: avoid; } details { display: block; } details > * { display: block; } textarea { border: 1px solid #999; } }
</style>
</head>
<body>
<div class="toolbar">
  <input id="search" placeholder="Search stem, candidate or ID">
  <select id="cp"><option value="">All CPs</option>${checkpoints.map((cp) => `<option>${escapeHtml(cp)}</option>`).join("")}</select>
  <select id="candidate"><option value="">All candidates</option>${candidates.map((candidate) => `<option>${escapeHtml(candidate)}</option>`).join("")}</select>
  <button type="button" onclick="toggleAnswers(true)">Open answers</button>
  <button type="button" onclick="toggleAnswers(false)">Close answers</button>
  <button type="button" onclick="window.print()">Print / Save PDF</button>
  <span id="visibleCount"></span>
</div>
<main>
<section class="hero"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p><p><strong>${records.length}</strong> questions · answers are collapsed initially · checkboxes and note fields are for manual review.</p></section>
${cards}
</main>
<script>
const cards = [...document.querySelectorAll('.question-card')];
const search = document.getElementById('search');
const cp = document.getElementById('cp');
const candidate = document.getElementById('candidate');
const visibleCount = document.getElementById('visibleCount');
function filterCards() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  for (const card of cards) {
    const match = (!query || card.textContent.toLowerCase().includes(query)) && (!cp.value || card.dataset.cp === cp.value) && (!candidate.value || card.dataset.candidate === candidate.value);
    card.classList.toggle('hidden', !match);
    if (match) visible += 1;
  }
  visibleCount.textContent = visible + ' visible';
}
function toggleAnswers(open) { for (const detail of document.querySelectorAll('.answer-panel')) detail.open = open; }
search.addEventListener('input', filterCards); cp.addEventListener('change', filterCards); candidate.addEventListener('change', filterCards); filterCards();
</script>
</body>
</html>`;
}

function renderMarkdown(title: string, records: readonly ReviewRecord[], subtitle: string): string {
  const lines: string[] = [`# ${title}`, "", subtitle, "", `Questions: ${records.length}`, ""];
  records.forEach((record, index) => {
    lines.push(`## ${index + 1}. ${record.reviewId}`);
    lines.push("");
    lines.push(`- CP: \`${record.checkpointId}\``);
    lines.push(`- Status: \`${record.reviewStatus}\`${record.mergedInto ? ` → \`${record.mergedInto}\`` : ""}`);
    lines.push(`- Task: \`${record.taskKind}\``);
    lines.push(`- Solve mode: \`${record.solveMode}\``);
    lines.push("");
    lines.push(`**Question:** ${record.stem}`);
    lines.push("");
    record.options.forEach((option, optionIndex) => lines.push(`${optionLabel(optionIndex)}. ${option.value}`));
    lines.push("");
    lines.push("<details><summary>Answer and explanation</summary>");
    lines.push("");
    lines.push(`**Answer:** ${optionLabel(record.correctIndex)} — ${record.answer}`);
    lines.push("");
    lines.push(`**Rule:** ${record.explanation.ruleStatement}`);
    lines.push("");
    record.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. **${step.label}:** ${step.expression} → ${step.result}`));
    lines.push("");
    lines.push(`**Conclusion:** ${record.explanation.conclusion}`);
    lines.push("");
    lines.push(`**Solver:** ${record.proof.solverRoute}; eligible ${record.proof.eligibleCandidateCount}; survivors ${record.proof.survivingCandidateCount}`);
    lines.push("");
    lines.push("</details>");
    lines.push("");
    lines.push("Reviewer: [ ] stem  [ ] clarity  [ ] options  [ ] answer  [ ] explanation  [ ] layout/script");
    lines.push("");
    lines.push("Notes: ________________________________________________");
    lines.push("");
  });
  return lines.join("\n");
}

function renderCsv(records: readonly ReviewRecord[]): string {
  const headers = [
    "reviewId", "reviewStatus", "mergedInto", "candidateId", "checkpointId", "seed", "locale", "taskKind", "solveMode", "renderer", "stem",
    "optionA", "optionB", "optionC", "optionD", "correctIndex", "answer", "ruleStatement", "steps", "conclusion", "solverRoute",
    "eligibleCandidateCount", "survivingCandidateCount", "semanticFingerprint", "metadataJson",
  ];
  const rows = records.map((record) => [
    record.reviewId, record.reviewStatus, record.mergedInto ?? "", record.candidateId, record.checkpointId, record.seed, record.locale,
    record.taskKind, record.solveMode, record.renderer, record.stem,
    record.options[0]?.value ?? "", record.options[1]?.value ?? "", record.options[2]?.value ?? "", record.options[3]?.value ?? "",
    record.correctIndex, record.answer, record.explanation.ruleStatement,
    record.explanation.steps.map((step) => `${step.label}: ${step.expression} -> ${step.result}`).join(" | "), record.explanation.conclusion,
    record.proof.solverRoute, record.proof.eligibleCandidateCount, record.proof.survivingCandidateCount, record.proof.semanticFingerprint,
    record.metadata,
  ]);
  return [headers.map(csvCell).join(","), ...rows.map((row) => row.map(csvCell).join(","))].join("\n");
}

function generateEnglishRecords(candidateIds: readonly string[]): ReviewRecord[] {
  return candidateIds.flatMap((candidateId) => ENGLISH_REVIEW_SEEDS.map((seed) => toRecord(generateEnglish(candidateId, seed))));
}

function generateLocalizedRecords(locale: "hi-IN" | "pa-IN"): ReviewRecord[] {
  return OPS_REPRESENTATIVE_PILOT_IDS.flatMap((candidateId) => LOCALIZED_REVIEW_SEEDS.map((seed) => {
    const english = generateOpsRepresentativePilot(candidateId, seed);
    return toRecord(localizeOpsPilotQuestion(english, locale) as ReviewQuestion);
  }));
}

async function main(): Promise<void> {
  const outputDir = resolve(process.argv[2] ?? "ops-001-manual-review");
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  if (ALL_CANDIDATE_IDS.length !== 34) throw new Error(`Expected 34 pre-merge candidates; found ${ALL_CANDIDATE_IDS.length}.`);
  if (CONSOLIDATED_CANDIDATE_IDS.length !== 31) throw new Error(`Expected 31 consolidated candidates; found ${CONSOLIDATED_CANDIDATE_IDS.length}.`);

  const allEnglish = generateEnglishRecords(ALL_CANDIDATE_IDS);
  const consolidatedEnglish = generateEnglishRecords(CONSOLIDATED_CANDIDATE_IDS);
  const hindi = generateLocalizedRecords("hi-IN");
  const punjabi = generateLocalizedRecords("pa-IN");
  const allRecords = [...allEnglish, ...hindi, ...punjabi];

  const premergeSubtitle = "All 34 pre-merge candidate contracts, including the three presentation variants proposed for merger. Ten deterministic seeds per candidate.";
  const consolidatedSubtitle = "The 31 runtime-consolidated logical contracts proposed for final chapter review. Ten deterministic seeds per contract.";
  const localizedSubtitle = "Representative multilingual review only: the 12 contracts currently covered by the Hindi/Punjabi parity renderer, five deterministic seeds each.";

  await Promise.all([
    writeFile(resolve(outputDir, "OPS-001-EN-PREMERGE-34.html"), renderHtml("OPS-001 English pre-merge review", allEnglish, premergeSubtitle), "utf8"),
    writeFile(resolve(outputDir, "OPS-001-EN-CONSOLIDATED-31.html"), renderHtml("OPS-001 English consolidated review", consolidatedEnglish, consolidatedSubtitle), "utf8"),
    writeFile(resolve(outputDir, "OPS-001-HI-REPRESENTATIVE.html"), renderHtml("OPS-001 Hindi representative review", hindi, localizedSubtitle), "utf8"),
    writeFile(resolve(outputDir, "OPS-001-PA-REPRESENTATIVE.html"), renderHtml("OPS-001 Punjabi representative review", punjabi, localizedSubtitle), "utf8"),
    writeFile(resolve(outputDir, "OPS-001-EN-CONSOLIDATED-31.md"), renderMarkdown("OPS-001 English consolidated review", consolidatedEnglish, consolidatedSubtitle), "utf8"),
    writeFile(resolve(outputDir, "OPS-001-HI-REPRESENTATIVE.md"), renderMarkdown("OPS-001 Hindi representative review", hindi, localizedSubtitle), "utf8"),
    writeFile(resolve(outputDir, "OPS-001-PA-REPRESENTATIVE.md"), renderMarkdown("OPS-001 Punjabi representative review", punjabi, localizedSubtitle), "utf8"),
    writeFile(resolve(outputDir, "OPS-001-REVIEW-INDEX.csv"), renderCsv(allRecords), "utf8"),
    writeFile(resolve(outputDir, "OPS-001-REVIEW-DATA.json"), JSON.stringify({
      generatedAt: new Date().toISOString(),
      branch: "feat/ops-001-end-to-end-design",
      premergeCandidateIds: ALL_CANDIDATE_IDS,
      consolidatedCandidateIds: CONSOLIDATED_CANDIDATE_IDS,
      mergedInto: MERGED_INTO,
      englishSeeds: ENGLISH_REVIEW_SEEDS,
      localizedSeeds: LOCALIZED_REVIEW_SEEDS,
      counts: {
        englishPremerge: allEnglish.length,
        englishConsolidated: consolidatedEnglish.length,
        hindiRepresentative: hindi.length,
        punjabiRepresentative: punjabi.length,
        indexedRecords: allRecords.length,
      },
      records: allRecords,
    }, null, 2), "utf8"),
    writeFile(resolve(outputDir, "README.md"), `# OPS-001 manual review bundle

## Recommended starting file

Open \`OPS-001-EN-CONSOLIDATED-31.html\` first. It contains 310 questions: ten deterministic seeds for each of the 31 runtime-consolidated logical contracts.

## Files

- \`OPS-001-EN-CONSOLIDATED-31.html\`: primary English manual review, 310 questions.
- \`OPS-001-EN-PREMERGE-34.html\`: 340 questions across all original candidates, including merged variants 002, 006 and 031.
- \`OPS-001-HI-REPRESENTATIVE.html\`: 60 Hindi questions across the 12 currently localized representative contracts.
- \`OPS-001-PA-REPRESENTATIVE.html\`: 60 Punjabi questions across the 12 currently localized representative contracts.
- Markdown versions: convenient for code-editor review and comments.
- \`OPS-001-REVIEW-INDEX.csv\`: one row per review question for sorting and issue tracking.
- \`OPS-001-REVIEW-DATA.json\`: complete structured export with options, answers, explanations, solver proof and metadata.

## Important limitation

Hindi and Punjabi files are representative, not full 31-contract exports. Full multilingual expansion is the next implementation gate; these files expose the current localized runtime honestly rather than auto-translating unsupported contracts.

## Suggested review order

1. Stem naturalness and real-exam feel.
2. Whether replacement/interchange scope is unmistakable.
3. Whole-number versus digit wording.
4. Option plausibility and duplicate meaning.
5. Correct answer and complete-pool uniqueness.
6. Explanation clarity and non-mechanical prose.
7. Hindi/Punjabi terminology, script and line wrapping.

The HTML files include filters, checkboxes, note fields, collapsible answers and print-to-PDF support.
`, "utf8"),
  ]);

  console.log("OPS-001 manual review bundle generated.", {
    outputDir,
    englishPremerge: allEnglish.length,
    englishConsolidated: consolidatedEnglish.length,
    hindiRepresentative: hindi.length,
    punjabiRepresentative: punjabi.length,
    indexedRecords: allRecords.length,
  });
}

await main();
