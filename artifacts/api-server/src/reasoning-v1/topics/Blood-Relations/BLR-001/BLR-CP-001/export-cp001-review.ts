import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  BLR_CP001_REVIEW_REGISTRY,
  type BlrCp001ProvisionalAuthority,
  type BlrCp001ReviewQuestion,
} from "./cp001-review-registry";

const REVIEW_SEEDS = [0, 1, 2, 3, 12, 25, 38, 51] as const;
const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

interface ReviewRecord {
  authority: BlrCp001ProvisionalAuthority;
  prototypeId: string;
  seed: number;
  difficulty: string;
  renderer: string;
  answerType: string;
  stem: string;
  options: readonly {
    letter: string;
    value: string;
    isCorrect: boolean;
    errorLabel: string | null;
  }[];
  correctLetter: string;
  correctValue: string;
  coreConcept: readonly string[];
  normalizedClues: readonly string[];
  familyTreeGrid: string;
  generationAnalysis: readonly string[];
  ruleStatement: string;
  queryPath: readonly string[];
  conclusion: string;
  examShortcut: string;
  distractorAnalysis: readonly {
    optionValue: string;
    errorLabel: string;
    studentWarning: string;
  }[];
  closestTrapRejection: string | null;
  personNames: Readonly<Record<string, string>>;
  query: unknown;
  metadata: BlrCp001ReviewQuestion["metadata"];
}

function makeRecord(
  authority: BlrCp001ProvisionalAuthority,
  question: BlrCp001ReviewQuestion,
): ReviewRecord {
  return {
    authority,
    prototypeId: question.prototypeId,
    seed: question.seed,
    difficulty: question.difficulty,
    renderer: question.renderer,
    answerType: question.answerType,
    stem: question.stem,
    options: question.options.map((option, index) => ({
      letter: OPTION_LETTERS[index]!,
      value: option.value,
      isCorrect: option.isCorrect,
      errorLabel: option.errorLabel ?? null,
    })),
    correctLetter: OPTION_LETTERS[question.correctIndex]!,
    correctValue: question.options[question.correctIndex]!.value,
    coreConcept: question.explanation.coreConcept ?? [],
    normalizedClues: question.explanation.normalizedClues,
    familyTreeGrid: question.explanation.familyTreeGrid ?? "",
    generationAnalysis: question.explanation.generationAnalysis ?? [],
    ruleStatement: question.explanation.ruleStatement,
    queryPath: question.explanation.queryPath,
    conclusion: question.explanation.conclusion,
    examShortcut: question.explanation.examShortcut ?? "",
    distractorAnalysis: question.explanation.distractorAnalysis ?? [],
    closestTrapRejection:
      question.explanation.closestTrapRejection ?? null,
    personNames: question.structuredPrompt.personNames,
    query: question.structuredPrompt.query,
    metadata: question.metadata,
  };
}

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function toCsv(records: readonly ReviewRecord[]): string {
  const headings = [
    "authority",
    "prototypeId",
    "seed",
    "difficulty",
    "renderer",
    "answerType",
    "stem",
    "optionA",
    "optionB",
    "optionC",
    "optionD",
    "correctLetter",
    "correctValue",
    "coreConcept",
    "normalizedClues",
    "familyTreeGrid",
    "generationAnalysis",
    "ruleStatement",
    "queryPath",
    "conclusion",
    "examShortcut",
    "distractorAnalysis",
    "closestTrapRejection",
    "query",
    "metadata",
  ];
  const rows = records.map((record) => [
    record.authority,
    record.prototypeId,
    record.seed,
    record.difficulty,
    record.renderer,
    record.answerType,
    record.stem,
    record.options[0]!.value,
    record.options[1]!.value,
    record.options[2]!.value,
    record.options[3]!.value,
    record.correctLetter,
    record.correctValue,
    record.coreConcept.join(" | "),
    record.normalizedClues.join(" | "),
    record.familyTreeGrid,
    record.generationAnalysis.join(" | "),
    record.ruleStatement,
    record.queryPath.join(" | "),
    record.conclusion,
    record.examShortcut,
    record.distractorAnalysis,
    record.closestTrapRejection ?? "",
    record.query,
    record.metadata,
  ]);

  return [
    headings.map(csvCell).join(","),
    ...rows.map((row) => row.map(csvCell).join(",")),
  ].join("\n");
}

function escapeHtml(value: unknown): string {
  const text =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function list(items: readonly string[]): string {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function toHtml(records: readonly ReviewRecord[]): string {
  const cards = records
    .map((record, recordIndex) => {
      const options = record.options
        .map(
          (option) => `
            <li class="${option.isCorrect ? "correct" : "wrong"}">
              <strong>${option.letter}.</strong> ${escapeHtml(option.value)}
              ${option.isCorrect ? '<span class="badge">Correct</span>' : `<span class="error">${escapeHtml(option.errorLabel ?? "")}</span>`}
            </li>`,
        )
        .join("");
      const distractors = record.distractorAnalysis
        .map(
          (item) => `
            <li>
              <strong>${escapeHtml(item.optionValue)}</strong>
              <span class="error-code">${escapeHtml(item.errorLabel)}</span><br>
              ${escapeHtml(item.studentWarning)}
            </li>`,
        )
        .join("");

      return `
      <article class="card">
        <header>
          <span class="index">${recordIndex + 1}</span>
          <div>
            <h2>${escapeHtml(record.authority)}</h2>
            <p>${escapeHtml(record.prototypeId)} · seed ${record.seed} · ${escapeHtml(record.difficulty)} · ${escapeHtml(record.answerType)}</p>
          </div>
        </header>
        <section>
          <h3>Question</h3>
          <p class="stem">${escapeHtml(record.stem)}</p>
          <ol class="options">${options}</ol>
        </section>
        <section class="explanation">
          <h3>📌 Tier 1 — Core Concept &amp; Generation Mapping</h3>
          <ul>${list(record.coreConcept)}</ul>
          <p><strong>Solver rule:</strong> ${escapeHtml(record.ruleStatement)}</p>

          <h3>📝 Tier 2 — Step-by-Step Family Tree Solution</h3>
          <pre class="tree">${escapeHtml(record.familyTreeGrid)}</pre>
          <p><strong>Normalised clues</strong></p>
          <ul>${list(record.normalizedClues)}</ul>
          <p><strong>Generation arithmetic</strong></p>
          <ul>${list(record.generationAnalysis)}</ul>
          <p><strong>Reasoning path</strong></p>
          <ol>${list(record.queryPath)}</ol>
          <p class="conclusion"><strong>Conclusion:</strong> ${escapeHtml(record.conclusion)}</p>

          <h3>💡 Tier 3 — 10-Second Exam Shortcut</h3>
          <p>${escapeHtml(record.examShortcut)}</p>

          <h3>⚠️ Tier 4 — Common Traps &amp; Distractor Analysis</h3>
          <ul class="trap-list">${distractors}</ul>
          <p><strong>Closest trap:</strong> ${escapeHtml(record.closestTrapRejection ?? "")}</p>
        </section>
        <details>
          <summary>Structured review metadata</summary>
          <pre>${escapeHtml({
            personNames: record.personNames,
            query: record.query,
            metadata: record.metadata,
          })}</pre>
        </details>
      </article>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>BLR-CP-001 Remediated English Review Pack</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; background: #f4f5f7; color: #17202a; }
    main { max-width: 1080px; margin: 0 auto; padding: 32px 20px 80px; }
    .intro, .card { background: white; border: 1px solid #d9dee5; border-radius: 14px; padding: 24px; margin-bottom: 22px; }
    .card header { display: flex; gap: 14px; align-items: flex-start; border-bottom: 1px solid #e6e9ee; padding-bottom: 14px; }
    .index { display: inline-grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: #e9eef6; font-weight: 700; }
    h1, h2, h3 { margin-top: 0; }
    header p { margin: 4px 0 0; color: #566573; }
    .stem { font-size: 1.08rem; line-height: 1.65; }
    .options { padding-left: 0; list-style: none; }
    .options li { border: 1px solid #dfe4ea; border-radius: 9px; padding: 11px 12px; margin: 8px 0; }
    .options li.correct { border-width: 2px; }
    .badge, .error { float: right; margin-left: 12px; font-size: .82rem; }
    .badge { font-weight: 700; }
    .error, .error-code { color: #5d6d7e; }
    .error-code { margin-left: 8px; font-family: ui-monospace, monospace; font-size: .8rem; }
    .explanation { background: #fafbfc; border-radius: 10px; padding: 18px; margin-top: 18px; }
    .explanation h3 { margin-top: 26px; padding-top: 8px; border-top: 1px solid #e6e9ee; }
    .explanation h3:first-child { margin-top: 0; border-top: 0; }
    .tree { white-space: pre; overflow-x: auto; background: #f0f3f6; border: 1px solid #dfe4ea; padding: 16px; border-radius: 8px; line-height: 1.5; }
    .trap-list li { margin-bottom: 12px; }
    .conclusion { font-size: 1.04rem; }
    li, p { line-height: 1.55; }
    details pre { white-space: pre-wrap; overflow-wrap: anywhere; background: #f4f5f7; padding: 14px; border-radius: 8px; }
  </style>
</head>
<body>
  <main>
    <section class="intro">
      <h1>BLR-CP-001 Remediated English Review Pack</h1>
      <p>${records.length} deterministic questions across eleven exploratory prototypes and seven provisional solve authorities. Stems and explanations have passed the human-audit remediation gate. These remain review-only prototypes with no permanent QL IDs or publication eligibility.</p>
    </section>
    ${cards}
  </main>
</body>
</html>`;
}

const outputDirectory = process.argv[2] ?? "blr-cp001-review-output";
const records: ReviewRecord[] = [];
for (const entry of BLR_CP001_REVIEW_REGISTRY) {
  for (const seed of REVIEW_SEEDS) {
    records.push(makeRecord(entry.authority, entry.generate(seed)));
  }
}

const authorityCounts = Object.fromEntries(
  [...new Set(records.map((record) => record.authority))].map((authority) => [
    authority,
    records.filter((record) => record.authority === authority).length,
  ]),
);
const answerPositions = OPTION_LETTERS.map(
  (letter) => records.filter((record) => record.correctLetter === letter).length,
);
const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-001",
  status: "REVIEW_ONLY_HUMAN_AUDIT_REMEDIATED",
  remediationVersion: "blr-cp001-editorial-v2",
  permanentQlCount: 0,
  prototypeCount: BLR_CP001_REVIEW_REGISTRY.length,
  provisionalAuthorityCount: Object.keys(authorityCounts).length,
  recordCount: records.length,
  reviewSeeds: REVIEW_SEEDS,
  authorityCounts,
  answerPositions,
  pedagogyTiers: [
    "CORE_CONCEPT_AND_GENERATION_MAPPING",
    "STEP_BY_STEP_FAMILY_TREE",
    "TEN_SECOND_EXAM_SHORTCUT",
    "DISTRACTOR_ANALYSIS",
  ],
};

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(
    path.join(outputDirectory, "blr-cp001-review.jsonl"),
    `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp001-review.csv"),
    `${toCsv(records)}\n`,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp001-review.html"),
    toHtml(records),
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp001-review-summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  ),
]);

console.log("BLR-CP-001 remediated English review pack exported.", summary);
