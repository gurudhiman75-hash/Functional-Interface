import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  getBlrCp001ReviewEntry,
  type BlrCp001ReviewQuestion,
} from "./cp001-review-registry";

const GREAT_RELATIONS = [
  "GREAT_GRANDFATHER",
  "GREAT_GRANDMOTHER",
  "GREAT_GRANDSON",
  "GREAT_GRANDDAUGHTER",
] as const;
const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

type GreatRelationId = (typeof GREAT_RELATIONS)[number];

interface GapReviewRecord {
  relationId: GreatRelationId;
  seed: number;
  difficulty: string;
  stem: string;
  options: readonly {
    letter: string;
    value: string;
    isCorrect: boolean;
    errorLabel: string | null;
  }[];
  correctLetter: string;
  coreConcept: readonly string[];
  familyTreeGrid: string;
  generationAnalysis: readonly string[];
  examShortcut: string;
  distractorAnalysis: readonly unknown[];
  conclusion: string;
  metadata: BlrCp001ReviewQuestion["metadata"];
}

function escapeHtml(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function recordFor(
  relationId: GreatRelationId,
  question: BlrCp001ReviewQuestion,
): GapReviewRecord {
  return {
    relationId,
    seed: question.seed,
    difficulty: question.difficulty,
    stem: question.stem,
    options: question.options.map((option, index) => ({
      letter: OPTION_LETTERS[index]!,
      value: option.value,
      isCorrect: option.isCorrect,
      errorLabel: option.errorLabel ?? null,
    })),
    correctLetter: OPTION_LETTERS[question.correctIndex]!,
    coreConcept: question.explanation.coreConcept ?? [],
    familyTreeGrid: question.explanation.familyTreeGrid ?? "",
    generationAnalysis: question.explanation.generationAnalysis ?? [],
    examShortcut: question.explanation.examShortcut ?? "",
    distractorAnalysis: question.explanation.distractorAnalysis ?? [],
    conclusion: question.explanation.conclusion,
    metadata: question.metadata,
  };
}

function toHtml(records: readonly GapReviewRecord[]): string {
  const cards = records
    .map((record, index) => {
      const options = record.options
        .map(
          (option) =>
            `<li><strong>${option.letter}.</strong> ${escapeHtml(option.value)}${
              option.isCorrect
                ? " <strong>✓</strong>"
                : ` <small>[${escapeHtml(option.errorLabel)}]</small>`
            }</li>`,
        )
        .join("");
      return `<article>
        <h2>${index + 1}. ${escapeHtml(record.relationId)} · seed ${record.seed}</h2>
        <p>${escapeHtml(record.stem)}</p>
        <ol>${options}</ol>
        <h3>Core concept</h3>
        <ul>${record.coreConcept.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
        <h3>Family tree and generation map</h3>
        <pre>${escapeHtml(record.familyTreeGrid)}</pre>
        <h3>Generation analysis</h3>
        <ol>${record.generationAnalysis.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol>
        <p><strong>10-second shortcut:</strong> ${escapeHtml(record.examShortcut)}</p>
        <h3>Distractor analysis</h3>
        <pre>${escapeHtml(record.distractorAnalysis)}</pre>
        <p><strong>Conclusion:</strong> ${escapeHtml(record.conclusion)}</p>
      </article>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>BLR-CP-001 Second Source-Gap Review</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; background: #f5f6f8; color: #17202a; }
    main { max-width: 1000px; margin: 0 auto; padding: 28px 18px 70px; }
    article, header { background: white; border: 1px solid #d8dee7; border-radius: 12px; padding: 22px; margin-bottom: 20px; }
    h1, h2, h3 { margin-top: 0; }
    li, p { line-height: 1.55; }
    pre { white-space: pre-wrap; overflow-wrap: anywhere; background: #f3f5f7; border-radius: 8px; padding: 14px; }
  </style>
</head>
<body><main>
<header>
  <h1>BLR-CP-001 Second Source-and-Gap Review</h1>
  <p>Sixteen deterministic review questions: four great-generation relations × four answer positions. These extend the existing named-relation authority and do not create a new prototype or permanent QL.</p>
</header>
${cards}
</main></body></html>`;
}

const entry = getBlrCp001ReviewEntry(
  "BLR-CP001-PROT-COMPOSED-THREE-EDGE",
);
const selected = new Map<GreatRelationId, Map<number, BlrCp001ReviewQuestion>>(
  GREAT_RELATIONS.map((relationId) => [relationId, new Map()]),
);

for (let seed = 0; seed < 5000; seed += 1) {
  const question = entry.generate(seed);
  const relationId = String(question.metadata.relationId) as GreatRelationId;
  if (!GREAT_RELATIONS.includes(relationId)) continue;
  const byPosition = selected.get(relationId)!;
  if (!byPosition.has(question.correctIndex)) {
    byPosition.set(question.correctIndex, question);
  }
  if ([...selected.values()].every((entries) => entries.size === 4)) break;
}

for (const relationId of GREAT_RELATIONS) {
  if (selected.get(relationId)?.size !== 4) {
    throw new Error(`Unable to export four answer positions for ${relationId}.`);
  }
}

const records = GREAT_RELATIONS.flatMap((relationId) =>
  [...selected.get(relationId)!.entries()]
    .sort(([left], [right]) => left - right)
    .map(([, question]) => recordFor(relationId, question)),
);
const answerPositions = OPTION_LETTERS.map(
  (letter) => records.filter((record) => record.correctLetter === letter).length,
);
const relationCounts = Object.fromEntries(
  GREAT_RELATIONS.map((relationId) => [
    relationId,
    records.filter((record) => record.relationId === relationId).length,
  ]),
);
const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-001",
  audit: "SECOND_SOURCE_AND_GAP",
  authority: entry.authority,
  prototypeId: entry.prototypeId,
  permanentQlCount: 0,
  newAuthorityCount: 0,
  recordCount: records.length,
  relationCounts,
  answerPositions,
};

const outputDirectory = process.argv[2] ?? "blr-cp001-review-output";
await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(
    path.join(outputDirectory, "blr-cp001-second-gap-review.jsonl"),
    `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp001-second-gap-review.csv"),
    [
      ["relationId", "seed", "difficulty", "stem", "correctLetter", "examShortcut", "familyTreeGrid", "generationAnalysis", "metadata"].map(csvCell).join(","),
      ...records.map((record) =>
        [
          record.relationId,
          record.seed,
          record.difficulty,
          record.stem,
          record.correctLetter,
          record.examShortcut,
          record.familyTreeGrid,
          record.generationAnalysis,
          record.metadata,
        ].map(csvCell).join(","),
      ),
    ].join("\n") + "\n",
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp001-second-gap-review.html"),
    toHtml(records),
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp001-second-gap-summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  ),
]);

console.log("BLR-CP-001 second source-gap review exported.", summary);
