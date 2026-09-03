import fs from "node:fs";
import path from "node:path";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V11 } from "./com003-review-synthesis-v11";

function clean(value: unknown) {
  return String(value ?? "").replace(/\r?\n/g, " ").trim();
}

export function buildCom003QuestionReviewMarkdownV11() {
  const out: string[] = [
    "# COM-003 — Office & Productivity Software",
    "",
    "**English V11 · Plain Standard Exam Language Review Candidate**",
    "",
    "- 19 permanent QLs",
    "- 228 questions",
    "- 12 questions per QL",
    "- Balanced fact coverage within each QL",
    "- Review only",
    "",
    "> **Stem rule:** Keep the wording short and familiar to SSC/banking/state-exam candidates. Examples: ‘Which shortcut is used to copy selected text?’, ‘What is Ctrl+C used for?’, ‘Which feature is used to find text?’, and ‘Which file extension is used for a modern Excel workbook?’. Avoid editorial terms such as ‘appropriate’, ‘action’, ‘task’, ‘correctly represents’, and ‘practical effect’.",
    "",
    "> **Governance:** This corpus is not frozen and is not authorized for localization, Question Studio replacement, question-bank writes, test eligibility, or publication until product review approves it.",
    "",
  ];

  for (const ql of COM003_PERMANENT_QLS) {
    const questions = COM003_ENGLISH_REVIEW_CORPUS_V11.filter((q) => q.qlId === ql.qlId);
    out.push("---", "", `## ${ql.qlId} — ${ql.title}`, "");
    questions.forEach((q, index) => {
      out.push(`### Q${index + 1}`, "");
      out.push(`**Surface:** \`${q.surfaceMode}\`  `);
      out.push(`**Fact ID:** \`${q.targetFactId}\``, "");
      out.push(clean(q.stem), "");
      q.options.forEach((option, optionIndex) => {
        out.push(`${String.fromCharCode(65 + optionIndex)}. ${clean(option)}`);
      });
      out.push("", `**Answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${clean(q.canonicalAnswer)}`, "");
      out.push(`**Explanation:** ${clean(q.explanation)}`, "");
    });
  }

  return out.join("\n").trimEnd() + "\n";
}

export function writeCom003QuestionReviewMarkdownV11(outputDir = path.resolve("dist/com003-review-v11")) {
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, "COM-003-Office-Productivity-English-Question-Review-V11.md");
  fs.writeFileSync(outputPath, buildCom003QuestionReviewMarkdownV11(), "utf8");
  return outputPath;
}

if (process.argv[1]?.includes("com003-question-review-md-v11")) {
  const outputPath = writeCom003QuestionReviewMarkdownV11();
  console.log(`[COM003-V11-MD] ${outputPath}`);
  console.log(`[COM003-V11-MD] questions=${COM003_ENGLISH_REVIEW_CORPUS_V11.length}`);
}
