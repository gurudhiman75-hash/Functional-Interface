import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  buildStemAuditReport,
  type StemAuditReport,
} from "./stem-audit-report";

export type StemProvenanceStatus =
  | "APPROVED"
  | "PARTIAL"
  | "FALLBACK"
  | "UNKNOWN";

export interface StemAuditRecord {
  questionId: string;
  qlId: string;
  canonicalProblem: "PCT-CP-002";
  taskKind: "percentOfKnownNumber";
  language: "en";
  renderedStem: string;
  stemFamilyId: string;
  stemId: string;
  sourceFile: string;
  libraryFile: string;
  templateFile: string;
  archetypeId: "PCT-001";
  selectionPath: string;
  fallbackUsage: "YES";
  provenanceStatus: StemProvenanceStatus;
  templatePattern: string;
  approvedAssetUsedForWording: false;
  normalLanguagePipelineUsed: false;
}

interface CsvQuestionRow {
  questionId: string;
  qlId: string;
  difficulty: string;
  context: string;
  questionText: string;
  answer: string;
  approval: string;
  reviewerNotes: string;
  status: string;
}

interface CsvMetadataRow {
  questionId: string;
  qlId: string;
  difficulty: string;
  contextKind: string;
  context: string;
  semanticUnit: string;
  direction: string;
  numericProfile: string;
}

const QUALIFICATION_ROOT = join(
  process.cwd(),
  "src",
  "quant-v4",
  "topics",
  "Arithmetic",
  "subtopics",
  "Percentage",
  "PCT-001",
  "eev2",
  "percent-of-known-number",
  "qualification",
);

export const STEM_AUDIT_INPUTS = {
  questionsCsv: join(QUALIFICATION_ROOT, "csv-001", "questions.csv"),
  metadataCsv: join(QUALIFICATION_ROOT, "csv-001", "metadata.csv"),
} as const;

export const STEM_AUDIT_OUTPUT = join(
  QUALIFICATION_ROOT,
  "audit",
  "stem-provenance.csv",
);

function parseCsv(text: string): readonly Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]!;
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        cell += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(cell);
      cell = "";
    } else if (character === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }
  const headers = rows[0] ?? [];
  return rows.slice(1).filter((values) => values.length > 1).map((values) =>
    Object.fromEntries(
      headers.map((header, index) => [header, values[index] ?? ""]),
    ),
  );
}

function templatePattern(qlId: string): string {
  const patterns: Record<string, string> = {
    "PCT-QL-017": "IF_EQUALS_FIND",
    "PCT-QL-117": "WE_KNOW_WHAT_IS",
    "PCT-QL-217": "VALUE_CORRESPONDING_FIND",
    "PCT-QL-317": "QUESTION_STATES_DETERMINE",
    "PCT-QL-417": "GIVEN_THAT_WHAT_IS",
  };
  return patterns[qlId] ?? "UNKNOWN_INLINE_PATTERN";
}

function stemId(qlId: string): string {
  return `CSV-001-INLINE-${qlId}`;
}

export async function auditStemProvenance(): Promise<{
  records: readonly StemAuditRecord[];
  report: StemAuditReport;
}> {
  const [questionText, metadataText] = await Promise.all([
    readFile(STEM_AUDIT_INPUTS.questionsCsv, "utf8"),
    readFile(STEM_AUDIT_INPUTS.metadataCsv, "utf8"),
  ]);
  const questions = parseCsv(questionText) as unknown as readonly CsvQuestionRow[];
  const metadata = parseCsv(metadataText) as unknown as readonly CsvMetadataRow[];
  const metadataById = new Map(metadata.map((row) => [row.questionId, row]));

  const records = questions.map((question): StemAuditRecord => {
    const matchingMetadata = metadataById.get(question.questionId);
    if (!matchingMetadata) {
      throw new Error(`Missing metadata row for ${question.questionId}`);
    }
    if (matchingMetadata.qlId !== question.qlId) {
      throw new Error(`QL mismatch for ${question.questionId}`);
    }
    return {
      questionId: question.questionId,
      qlId: question.qlId,
      canonicalProblem: "PCT-CP-002",
      taskKind: "percentOfKnownNumber",
      language: "en",
      renderedStem: question.questionText,
      stemFamilyId: "CSV-001-INLINE-CONTEXTUAL-PILOT",
      stemId: stemId(question.qlId),
      sourceFile:
        "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/eev2/percent-of-known-number/qualification/csv-pilot.ts",
      libraryFile:
        "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-language.en.json (consulted for metadata, not wording)",
      templateFile:
        "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/eev2/percent-of-known-number/qualification/csv-pilot.ts:236",
      archetypeId: "PCT-001",
      selectionPath:
        `questions.csv -> CSV-001 pilotCase() -> qlId ${question.qlId} -> ` +
        "questionFor() inline template -> CSV export",
      fallbackUsage: "YES",
      provenanceStatus: "FALLBACK",
      templatePattern: templatePattern(question.qlId),
      approvedAssetUsedForWording: false,
      normalLanguagePipelineUsed: false,
    };
  });

  return {
    records,
    report: buildStemAuditReport(records),
  };
}

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export async function exportStemProvenanceCsv(): Promise<{
  output: string;
  report: StemAuditReport;
}> {
  const { records, report } = await auditStemProvenance();
  const headers: readonly (keyof StemAuditRecord)[] = [
    "questionId",
    "qlId",
    "canonicalProblem",
    "taskKind",
    "language",
    "renderedStem",
    "stemFamilyId",
    "stemId",
    "sourceFile",
    "libraryFile",
    "templateFile",
    "archetypeId",
    "selectionPath",
    "fallbackUsage",
    "provenanceStatus",
    "templatePattern",
    "approvedAssetUsedForWording",
    "normalLanguagePipelineUsed",
  ];
  const output = [
    headers.map(csvCell).join(","),
    ...records.map((record) =>
      headers.map((header) => csvCell(record[header])).join(","),
    ),
  ].join("\r\n");
  await writeFile(STEM_AUDIT_OUTPUT, output, "utf8");
  return { output: STEM_AUDIT_OUTPUT, report };
}

const invokedPath = process.argv[1]?.replace(/\\/g, "/") ?? "";
if (
  invokedPath.endsWith("/stem-audit.mjs") &&
  pathToFileURL(process.argv[1]!).href === import.meta.url
) {
  console.log(JSON.stringify(await exportStemProvenanceCsv(), null, 2));
}

