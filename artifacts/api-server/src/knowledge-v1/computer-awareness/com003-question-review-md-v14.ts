import fs from "node:fs";
import path from "node:path";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V14 } from "./com003-review-synthesis-v14";

function clean(value: unknown) {
  return String(value ?? "").replace(/\r?\n/g, " ").trim();
}

export function buildCom003QuestionReviewMarkdownV14() {
  const out: string[] = [
    "# COM-003 — Office & Productivity Software",
    "",
    "**English V14 · Simple Direct Exam Language Review Candidate**",
    "",
    "- 19 permanent QLs",
    "- 228 questions",
    "- 12 questions per QL",
    "- Balanced fact coverage",
    "- Strict stem/answer binding",
    "- Review only",
    "",
    "> **Stem rule:** Keep learner-facing questions short and familiar: ‘Which shortcut is used to copy selected text?’, ‘What is Ctrl+C used for?’, ‘Which feature is used to find text?’, ‘Which file extension is used for a modern Excel workbook?’. Do not use generator/editorial wording in the stem.",
    "",
    "> **Governance:** V12 was technically green but rejected after manual wording review. V14 remains review-only and is not authorized for localization, Question Studio replacement, question-bank writes, test eligibility, or publication until product review approves it.",
    "",
  ];

  for (const ql of COM003_PERMANENT_QLS) {
    const questions = COM003_ENGLISH_REVIEW_CORPUS_V14.filter((q) => q.qlId === ql.qlId);
    out.push("---", "", `## ${ql.qlId} — ${ql.title}`, "");
    questions.forEach((q, index) => {
      out.push(`### Q${index + 1}`, "");
      out.push(`**Surface:** \`${q.surfaceMode}\`  `);
      out.push(`**Fact ID:** \`${q.targetFactId}\``, "");
      out.push(clean(q.stem), "");
      q.options.forEach((option, optionIndex) => out.push(`${String.fromCharCode(65 + optionIndex)}. ${clean(option)}`));
      out.push("", `**Answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${clean(q.canonicalAnswer)}`, "");
      out.push(`**Explanation:** ${clean(q.explanation)}`, "");
    });
  }

  return out.join("\n").trimEnd() + "\n";
}

export function writeCom003QuestionReviewMarkdownV14(outputDir = path.resolve("dist/com003-review-v14")) {
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, "COM-003-Office-Productivity-English-Question-Review-V14.md");
  fs.writeFileSync(outputPath, buildCom003QuestionReviewMarkdownV14(), "utf8");
  return outputPath;
}

if (process.argv[1]?.includes("com003-question-review-md-v14")) {
  const outputPath = writeCom003QuestionReviewMarkdownV14();
  console.log(`[COM003-V14-MD] ${outputPath}`);
  console.log(`[COM003-V14-MD] questions=${COM003_ENGLISH_REVIEW_CORPUS_V14.length}`);
}
