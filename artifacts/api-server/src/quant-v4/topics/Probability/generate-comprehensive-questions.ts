import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const outputPath = join(root, "PROBABILITY-COMPREHENSIVE-QUESTIONS-AND-EXPLANATIONS.md");

interface ReviewRow {
  packageId: string;
  examProfile: string;
  cpId: string;
  qlId: string;
  difficulty: string;
  stem: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  correctOption: string;
  answer: string;
  explanation: string;
  validationValid: string;
  mathematicalStatus: string;
  editorialStatus: string;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]!;

    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (character !== "\r") {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (quoted) throw new Error("CSV ended inside a quoted field.");
  return rows.filter((item) => item.some((value) => value.length > 0));
}

function readReviewFile(packageId: "PRB-001" | "PRB-002"): ReviewRow[] {
  const path = join(root, packageId, "human-review-en.csv");
  const rows = parseCsv(readFileSync(path, "utf8"));
  const header = rows.shift();
  if (!header) throw new Error(`${packageId} review file has no header.`);

  return rows.map((values, rowIndex) => {
    const record = Object.fromEntries(header.map((column, columnIndex) => [column, values[columnIndex] ?? ""])) as unknown as ReviewRow;
    if (!record.qlId || !record.stem || !record.answer || !record.explanation) {
      throw new Error(`${packageId} row ${rowIndex + 2} is incomplete.`);
    }
    if (record.validationValid !== "true" || record.mathematicalStatus !== "AUTOMATED_PASS") {
      throw new Error(`${record.qlId} is not mathematically validated.`);
    }
    return record;
  });
}

function profileLabel(profile: string): string {
  const labels: Record<string, string> = {
    SSC_CGL_CHSL: "SSC CGL/CHSL",
    SSC_CGL_JSO: "SSC CGL JSO/Statistics",
    BANKING_PRELIMS: "Banking Prelims",
    BANKING_MAINS: "Banking Mains",
    GENERIC_PRACTICE: "Generic Practice",
  };
  return labels[profile] ?? profile.replace(/_/g, " ");
}

function optionLines(row: ReviewRow): string[] {
  const options = [row.optionA, row.optionB, row.optionC, row.optionD, row.optionE];
  return options
    .map((option, index) => ({ option, letter: String.fromCharCode(65 + index) }))
    .filter(({ option }) => option.length > 0)
    .map(({ option, letter }) => `- **${letter}.** ${option}`);
}

function renderPackage(packageId: "PRB-001" | "PRB-002", rows: ReviewRow[], startNumber: number): { lines: string[]; nextNumber: number } {
  const lines: string[] = [];
  const profile = profileLabel(rows[0]?.examProfile ?? "");
  lines.push(`## ${packageId} — ${profile}`);
  lines.push("");
  lines.push(`**Questions:** ${rows.length}`);
  lines.push("");

  const byCp = new Map<string, ReviewRow[]>();
  for (const row of rows) byCp.set(row.cpId, [...(byCp.get(row.cpId) ?? []), row]);

  let questionNumber = startNumber;
  for (const [cpId, cpRows] of [...byCp.entries()].sort(([left], [right]) => left.localeCompare(right))) {
    lines.push(`### ${cpId}`);
    lines.push("");

    for (const row of cpRows) {
      lines.push(`#### Question ${questionNumber} — ${row.qlId} (${row.difficulty})`);
      lines.push("");
      lines.push(`**Question:** ${row.stem}`);
      lines.push("");
      lines.push("**Options:**");
      lines.push("");
      lines.push(...optionLines(row));
      lines.push("");
      lines.push(`**Correct answer:** ${row.correctOption}. ${row.answer}`);
      lines.push("");
      lines.push(`**Explanation:** ${row.explanation}`);
      lines.push("");
      lines.push("---");
      lines.push("");
      questionNumber += 1;
    }
  }

  return { lines, nextNumber: questionNumber };
}

const prb001 = readReviewFile("PRB-001");
const prb002 = readReviewFile("PRB-002");
const allRows = [...prb001, ...prb002];

if (prb001.length !== 75) throw new Error(`Expected 75 PRB-001 questions, found ${prb001.length}.`);
if (prb002.length !== 60) throw new Error(`Expected 60 PRB-002 questions, found ${prb002.length}.`);
if (allRows.length !== 135) throw new Error(`Expected 135 total questions, found ${allRows.length}.`);

const uniqueVisibleQuestions = new Set(allRows.map((row) => `${row.stem.toLowerCase().replace(/\s+/g, " ").trim()}|${row.answer}`));
if (uniqueVisibleQuestions.size !== allRows.length) throw new Error("Comprehensive Markdown source contains duplicate visible questions.");

const markdown: string[] = [
  "# Probability — Comprehensive Questions and Explanations",
  "",
  "> ExamTree English editorial-review set for SSC and banking examinations.",
  "> Every explanation uses the shortest complete method possible.",
  "",
  "## Coverage Summary",
  "",
  "| Package | Exam profile | Questions | Options per question |",
  "|---|---|---:|---:|",
  "| PRB-001 | SSC CGL/CHSL | 75 | 4 |",
  "| PRB-002 | Banking Mains | 60 | 5 |",
  "| **Total** | — | **135** | — |",
  "",
  "## Explanation Standard",
  "",
  "Most solutions follow three simple steps:",
  "",
  "1. Find the total possible cases.",
  "2. Find the required cases.",
  "3. Divide and simplify.",
  "",
  "For successive draws, complements, conditional probability and counting questions, only the extra step actually needed is shown.",
  "",
];

const firstPackage = renderPackage("PRB-001", prb001, 1);
markdown.push(...firstPackage.lines);
const secondPackage = renderPackage("PRB-002", prb002, firstPackage.nextNumber);
markdown.push(...secondPackage.lines);

const output = `${markdown.join("\n").trim()}\n`;
writeFileSync(outputPath, output);

const questionHeadingCount = (output.match(/^#### Question /gm) ?? []).length;
const answerCount = (output.match(/^\*\*Correct answer:\*\*/gm) ?? []).length;
const explanationCount = (output.match(/^\*\*Explanation:\*\*/gm) ?? []).length;
if (questionHeadingCount !== 135 || answerCount !== 135 || explanationCount !== 135) {
  throw new Error(`Markdown proof failed: questions=${questionHeadingCount}, answers=${answerCount}, explanations=${explanationCount}.`);
}

console.log(JSON.stringify({
  outputPath,
  questions: allRows.length,
  uniqueVisibleQuestions: uniqueVisibleQuestions.size,
  prb001: prb001.length,
  prb002: prb002.length,
}));
