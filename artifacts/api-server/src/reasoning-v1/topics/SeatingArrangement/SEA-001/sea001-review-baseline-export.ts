import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { SEA_001_BLUEPRINTS } from "./manifest.ts";
import { generateSeaCp001Caselet } from "./generation/caselet-assembler.ts";
import { generateMixedFacingCaselet, SEA_CP002_BLUEPRINTS } from "./cp002/generator.ts";
import { generateCircularCaselet, SEA_CP003_BLUEPRINTS } from "./cp003/generator.ts";
import { generateOutwardCaselet, SEA_CP004_BLUEPRINTS } from "./cp004/generator.ts";
import { generateMixedCircularCaselet, SEA_CP005_BLUEPRINTS } from "./cp005/generator.ts";

const outputDirectory = process.env.SEA_001_REVIEW_OUTPUT_DIR ?? "./dist/sea-001-review-baseline";

interface ReviewOption {
  readonly display: string;
  readonly isCorrect: boolean;
}

interface ReviewChild {
  readonly questionOrder: number;
  readonly queryContractId: string;
  readonly text: string;
  readonly options: readonly ReviewOption[];
  readonly answer: unknown;
  readonly explanation: string;
}

interface ReviewCaselet {
  readonly reviewOrdinal: number;
  readonly checkpointId: string;
  readonly blueprintAuthorityId: string;
  readonly caseletId: string;
  readonly seed: string;
  readonly setupText: string;
  readonly clueTexts: readonly string[];
  readonly diagramText: string;
  readonly sharedExplanation: string;
  readonly children: readonly ReviewChild[];
  readonly reviewStatus: "UNREVIEWED";
  readonly reviewerNotes: "";
}

type CaseletLike = {
  readonly checkpointId: string;
  readonly blueprintAuthorityId: string;
  readonly caseletId: string;
  readonly seed: string;
  readonly setupText: string;
  readonly clueTexts: readonly string[];
  readonly diagramText: string;
  readonly sharedExplanation: string;
  readonly children: readonly {
    readonly questionOrder: number;
    readonly queryContractId: string;
    readonly text: string;
    readonly options: readonly { readonly display: string; readonly isCorrect: boolean }[];
    readonly answer: unknown;
    readonly explanation: string;
  }[];
};

function normaliseCaselet(caselet: CaseletLike, reviewOrdinal: number): ReviewCaselet {
  return {
    reviewOrdinal,
    checkpointId: caselet.checkpointId,
    blueprintAuthorityId: caselet.blueprintAuthorityId,
    caseletId: caselet.caseletId,
    seed: caselet.seed,
    setupText: caselet.setupText,
    clueTexts: caselet.clueTexts,
    diagramText: caselet.diagramText,
    sharedExplanation: caselet.sharedExplanation,
    children: caselet.children.map((child) => ({
      questionOrder: child.questionOrder,
      queryContractId: child.queryContractId,
      text: child.text,
      options: child.options.map((option) => ({ display: option.display, isCorrect: option.isCorrect })),
      answer: child.answer,
      explanation: child.explanation,
    })),
    reviewStatus: "UNREVIEWED",
    reviewerNotes: "",
  };
}

const caselets: ReviewCaselet[] = [];
let ordinal = 1;

for (const blueprintId of SEA_001_BLUEPRINTS) {
  for (let index = 0; index < 5; index += 1) {
    const generated = generateSeaCp001Caselet({
      blueprintId,
      seed: `SEA-001-ENGLISH-REVIEW-CP001-${blueprintId}-${String(index).padStart(2, "0")}`,
    });
    caselets.push(normaliseCaselet(generated, ordinal++));
  }
}

for (const blueprintId of SEA_CP002_BLUEPRINTS) {
  for (let index = 0; index < 5; index += 1) {
    const generated = generateMixedFacingCaselet(
      `SEA-001-ENGLISH-REVIEW-CP002-${blueprintId}-${String(index).padStart(2, "0")}`,
      blueprintId,
    );
    caselets.push(normaliseCaselet(generated, ordinal++));
  }
}

for (const blueprintId of SEA_CP003_BLUEPRINTS) {
  for (let index = 0; index < 5; index += 1) {
    const generated = generateCircularCaselet(
      `SEA-001-ENGLISH-REVIEW-CP003-${blueprintId}-${String(index).padStart(2, "0")}`,
      blueprintId,
    );
    caselets.push(normaliseCaselet(generated, ordinal++));
  }
}

for (const blueprintId of SEA_CP004_BLUEPRINTS) {
  for (let index = 0; index < 5; index += 1) {
    const generated = generateOutwardCaselet(
      `SEA-001-ENGLISH-REVIEW-CP004-${blueprintId}-${String(index).padStart(2, "0")}`,
      blueprintId,
    );
    caselets.push(normaliseCaselet(generated, ordinal++));
  }
}

for (const blueprintId of SEA_CP005_BLUEPRINTS) {
  for (let index = 0; index < 5; index += 1) {
    const generated = generateMixedCircularCaselet(
      `SEA-001-ENGLISH-REVIEW-CP005-${blueprintId}-${String(index).padStart(2, "0")}`,
      blueprintId,
    );
    caselets.push(normaliseCaselet(generated, ordinal++));
  }
}

if (caselets.length !== 100) throw new Error(`Expected 100 SEA-001 review caselets, received ${caselets.length}`);
for (const checkpointId of ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"] as const) {
  const count = caselets.filter((caselet) => caselet.checkpointId === checkpointId).length;
  if (count !== 20) throw new Error(`${checkpointId} review baseline must contain exactly 20 caselets; received ${count}`);
}

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function answerText(value: unknown): string {
  return Array.isArray(value) ? value.join(" → ") : String(value);
}

const csvRows: unknown[][] = [[
  "reviewOrdinal",
  "checkpointId",
  "blueprintAuthorityId",
  "caseletId",
  "seed",
  "setupText",
  "clueTexts",
  "diagramText",
  "questions",
  "options",
  "answers",
  "explanations",
  "sharedExplanation",
  "reviewStatus",
  "reviewerNotes",
]];
for (const caselet of caselets) {
  csvRows.push([
    caselet.reviewOrdinal,
    caselet.checkpointId,
    caselet.blueprintAuthorityId,
    caselet.caseletId,
    caselet.seed,
    caselet.setupText,
    caselet.clueTexts.join("\n"),
    caselet.diagramText,
    caselet.children.map((child) => `Q${child.questionOrder} [${child.queryContractId}] ${child.text}`).join("\n"),
    caselet.children.map((child) => child.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option.display}`).join(" | ")).join("\n"),
    caselet.children.map((child) => answerText(child.answer)).join("\n"),
    caselet.children.map((child) => child.explanation).join("\n"),
    caselet.sharedExplanation,
    caselet.reviewStatus,
    caselet.reviewerNotes,
  ]);
}
const csv = csvRows.map((row) => row.map(csvCell).join(",")).join("\n");

const checkpointCounts = Object.fromEntries(
  ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"].map((checkpointId) => [
    checkpointId,
    caselets.filter((caselet) => caselet.checkpointId === checkpointId).length,
  ]),
);

const cards = caselets.map((caselet) => `
<article class="caselet" data-checkpoint="${escapeHtml(caselet.checkpointId)}" data-blueprint="${escapeHtml(caselet.blueprintAuthorityId)}">
  <header>
    <span class="ordinal">#${caselet.reviewOrdinal}</span>
    <h2>${escapeHtml(caselet.checkpointId)} · ${escapeHtml(caselet.blueprintAuthorityId)}</h2>
    <div class="meta">${escapeHtml(caselet.caseletId)} · ${escapeHtml(caselet.seed)}</div>
  </header>
  <section class="directions"><strong>Directions:</strong> ${escapeHtml(caselet.setupText)}</section>
  <section><h3>Clues</h3><ol>${caselet.clueTexts.map((clue) => `<li>${escapeHtml(clue)}</li>`).join("")}</ol></section>
  <section><h3>Arrangement / diagram</h3><pre class="diagram">${escapeHtml(caselet.diagramText)}</pre></section>
  ${caselet.children.map((child) => `
  <section class="question">
    <h3>Q${child.questionOrder} · ${escapeHtml(child.queryContractId)}</h3>
    <p class="stem">${escapeHtml(child.text)}</p>
    <ol type="A" class="options">${child.options.map((option) => `<li>${escapeHtml(option.display)}</li>`).join("")}</ol>
    <details>
      <summary>Answer and explanation</summary>
      <p><strong>Answer:</strong> ${escapeHtml(answerText(child.answer))}</p>
      <p>${escapeHtml(child.explanation)}</p>
    </details>
  </section>`).join("")}
  <details class="shared"><summary>Shared solution</summary><pre>${escapeHtml(caselet.sharedExplanation)}</pre></details>
  <section class="review">
    <label>Status
      <select>
        <option selected>UNREVIEWED</option>
        <option>APPROVED</option>
        <option>NEEDS_FIX</option>
        <option>REJECT</option>
      </select>
    </label>
    <label>Reviewer notes<textarea rows="4" placeholder="Record English/exam-readiness issues here"></textarea></label>
  </section>
</article>`).join("\n");

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>SEA-001 English Review Baseline — 100 Caselets</title>
<style>
body{font-family:Arial,sans-serif;max-width:1080px;margin:24px auto;padding:0 18px;line-height:1.5;background:#fafafa;color:#1f2937}
h1{margin-bottom:4px}.subtitle{margin-top:0;color:#4b5563}.summary{background:white;border:1px solid #d1d5db;border-radius:12px;padding:14px 18px;margin:18px 0}.caselet{background:white;border:1px solid #d1d5db;border-radius:14px;padding:20px;margin:22px 0}.caselet header{border-bottom:1px solid #e5e7eb;padding-bottom:10px}.caselet h2{display:inline;margin-left:8px}.ordinal{font-weight:700}.meta{font-size:12px;color:#6b7280;margin-top:6px}.directions{margin-top:16px}.diagram{white-space:pre-wrap;background:#f3f4f6;padding:12px;border-radius:8px;overflow:auto}.question{border-top:1px solid #e5e7eb;margin-top:16px;padding-top:10px}.stem{font-weight:600}.options li{margin:4px 0}.shared{margin:18px 0}.shared pre{white-space:pre-wrap}.review{border-top:2px solid #d1d5db;padding-top:14px;display:grid;gap:10px}.review label{font-weight:600}.review select{margin-left:8px}.review textarea{display:block;width:100%;box-sizing:border-box;margin-top:6px;font-family:inherit}details{margin-top:8px}summary{cursor:pointer;font-weight:600}
</style>
</head>
<body>
<h1>SEA-001 English Review Baseline</h1>
<p class="subtitle">100 caselets · 20 per checkpoint · 5 per provisional blueprint authority. This artifact is a review candidate only; no item is approved by generation.</p>
<div class="summary">
  <strong>Coverage:</strong> ${Object.entries(checkpointCounts).map(([checkpoint, count]) => `${checkpoint}: ${count}`).join(" · ")}<br>
  <strong>Review rule:</strong> inspect directions, clue naturalness, answer/options, explanation clarity, and exam realism. Mark every caselet explicitly.
</div>
${cards}
</body>
</html>`;

const manifest = {
  packageId: "SEA-001",
  status: "PENDING_HUMAN_REVIEW",
  caseletCount: caselets.length,
  checkpointCounts,
  perBlueprintCount: 5,
  permanentQlCount: 0,
  generatedAtPolicy: "DETERMINISTIC_SEEDS_ONLY_NO_WALL_CLOCK_IN_CONTENT",
};

await mkdir(outputDirectory, { recursive: true });
await writeFile(join(outputDirectory, "sea-001-english-review-baseline.json"), `${JSON.stringify({ manifest, caselets }, null, 2)}\n`);
await writeFile(join(outputDirectory, "sea-001-english-review-baseline.csv"), `${csv}\n`);
await writeFile(join(outputDirectory, "sea-001-english-review-baseline.html"), html);
await writeFile(join(outputDirectory, "sea-001-english-review-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log("PASS_SEA_001_ENGLISH_REVIEW_BASELINE_EXPORT");
console.log(`caselets ${caselets.length}`);
console.log(`checkpointCounts ${JSON.stringify(checkpointCounts)}`);
console.log("perBlueprintCount 5");
console.log("reviewStatus PENDING_HUMAN_REVIEW");
console.log("permanentQLs 0");
console.log(`output ${outputDirectory}`);
