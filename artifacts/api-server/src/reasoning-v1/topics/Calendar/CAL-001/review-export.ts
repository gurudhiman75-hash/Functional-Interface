import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CALENDAR_PROTOTYPES } from "./registry.ts";
import { generateCalendarQuestion } from "./runtime.ts";
import { selectExamReadyReviewQuestions, CALENDAR_CURATED_REVIEW_POLICY } from "./review-selection.ts";
import { toCalendarQuestionStudioReviewRecord } from "./question-studio-contract.ts";

const outputDir = process.env.CAL_REVIEW_OUTPUT_DIR ?? join(process.cwd(), "dist", "reasoning-v1");
mkdirSync(outputDir, { recursive: true });

const auditRows = CALENDAR_PROTOTYPES.flatMap((definition) =>
  Array.from({ length: 12 }, (_, seed) => toCalendarQuestionStudioReviewRecord(generateCalendarQuestion(definition.id, seed, "en-IN"))),
);
const curatedRows = CALENDAR_PROTOTYPES.flatMap((definition) =>
  selectExamReadyReviewQuestions(definition.id, "en-IN").map(toCalendarQuestionStudioReviewRecord),
);

function writeJson(path: string, rows: Record<string, unknown>[], kind: string): void {
  writeFileSync(path, `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    lifecycle: "DISCOVERY_NOT_FROZEN",
    kind,
    permanentQlCount: 0,
    prototypeCount: CALENDAR_PROTOTYPES.length,
    questionsPerPrototype: rows.length / CALENDAR_PROTOTYPES.length,
    totalQuestions: rows.length,
    selectionPolicy: kind === "CURATED_5_PER_PROVISIONAL_QL" ? CALENDAR_CURATED_REVIEW_POLICY : undefined,
    rows,
  }, null, 2)}\n`);
}

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

const headers = [
  "checkpoint", "prototypeAuthority", "seed", "difficulty", "stem", "options", "answerIndex",
  "canonicalAnswer", "explanation", "distractors", "coverageFlags", "lifecycle",
];

function writeCsv(path: string, rows: Record<string, unknown>[]): void {
  const csvLines = [headers.map(csvCell).join(",")];
  for (const row of rows) {
    const studentView = row.studentView as Record<string, unknown>;
    csvLines.push([
      row.checkpoint, row.prototypeAuthority, row.seed, row.difficulty, studentView.stem,
      studentView.options, studentView.answerIndex, row.canonicalAnswer, studentView.explanation,
      row.distractors, row.coverageFlags, row.lifecycle,
    ].map(csvCell).join(","));
  }
  writeFileSync(path, `${csvLines.join("\n")}\n`);
}

function writeMarkdown(path: string, rows: Record<string, unknown>[], title: string, questionsPerPrototype: number): void {
  const markdown: string[] = [
    `# ${title}`,
    "",
    "- Lifecycle: executable discovery; not frozen",
    "- Permanent QLs: 0",
    `- Provisional QLs: ${CALENDAR_PROTOTYPES.length}`,
    `- Questions per provisional QL: ${questionsPerPrototype}`,
    `- Total questions: ${rows.length}`,
    "- Question Bank/test/publication locks: closed",
    "",
  ];
  for (const definition of CALENDAR_PROTOTYPES) {
    const samples = rows.filter((row) => row.prototypeAuthority === definition.id);
    markdown.push(`## ${definition.checkpoint} · ${definition.id} — ${definition.title}`, "", `Operation: ${definition.operation}`, "");
    for (const sample of samples) {
      const studentView = sample.studentView as { stem: string; options: string[]; answerIndex: number; explanation: unknown };
      markdown.push(`### Seed ${sample.seed} · ${sample.difficulty}`, "", studentView.stem, "");
      studentView.options.forEach((option, index) => markdown.push(`${String.fromCharCode(65 + index)}. ${option}${index === studentView.answerIndex ? " **(correct)**" : ""}`));
      markdown.push("", "**Explanation**", "", "```json", JSON.stringify(studentView.explanation, null, 2), "```", "");
    }
  }
  writeFileSync(path, `${markdown.join("\n")}\n`);
}

const auditJsonPath = join(outputDir, "cal-001-english-prototype-review.json");
const auditCsvPath = join(outputDir, "cal-001-english-prototype-review.csv");
const auditMarkdownPath = join(outputDir, "cal-001-english-prototype-review.md");
writeJson(auditJsonPath, auditRows, "AUDIT_12_PER_PROVISIONAL_QL");
writeCsv(auditCsvPath, auditRows);
writeMarkdown(auditMarkdownPath, auditRows, "CAL-001 English Audit Review Pack", 12);

const curatedJsonPath = join(outputDir, "cal-001-english-curated-review-5q.json");
const curatedCsvPath = join(outputDir, "cal-001-english-curated-review-5q.csv");
const curatedMarkdownPath = join(outputDir, "cal-001-english-curated-review-5q.md");
writeJson(curatedJsonPath, curatedRows, "CURATED_5_PER_PROVISIONAL_QL");
writeCsv(curatedCsvPath, curatedRows);
writeMarkdown(curatedMarkdownPath, curatedRows, "CAL-001 CP-wise and Provisional-QL-wise Curated Review Pack", 5);

console.log(JSON.stringify({
  status: "PASS_CAL_001_EXAM_READY_REVIEW_EXPORT",
  auditRows: auditRows.length,
  curatedRows: curatedRows.length,
  prototypeCount: CALENDAR_PROTOTYPES.length,
  questionsPerPrototype: 5,
  permanentQlCount: 0,
  auditJsonPath,
  curatedJsonPath,
  curatedCsvPath,
  curatedMarkdownPath,
}, null, 2));
