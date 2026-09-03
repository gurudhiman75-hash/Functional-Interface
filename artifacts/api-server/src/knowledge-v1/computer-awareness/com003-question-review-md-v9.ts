import fs from "node:fs";
import path from "node:path";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V9 } from "./com003-review-synthesis-v9";

function clean(value: unknown) {
  return String(value ?? "").replace(/\r?\n/g, " ").trim();
}

export function buildCom003QuestionReviewMarkdownV9() {
  const out: string[] = [
    "# COM-003 — Office & Productivity Software",
    "",
    "**English V9 · Simple Standard Exam Language Review Candidate**",
    "",
    "- 19 permanent QLs",
    "- 228 questions",
    "- 12 questions per QL",
    "- Review only",
    "",
    "> **Language rule:** Stems use simple exam wording. Internal surface-family metadata does not control learner-facing phrasing.",
    "",
    "> **Governance:** This corpus is not frozen and is not authorized for localization, Question Studio replacement, question-bank writes, test eligibility, or publication until product review approves it.",
    "",
  ];

  for (const ql of COM003_PERMANENT_QLS) {
    const questions = COM003_ENGLISH_REVIEW_CORPUS_V9.filter((q) => q.qlId === ql.qlId);
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

export function writeCom003QuestionReviewMarkdownV9(outputDir = path.resolve("dist/com003-review-v9")) {
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, "COM-003-Office-Productivity-English-Question-Review-V9.md");
  fs.writeFileSync(outputPath, buildCom003QuestionReviewMarkdownV9(), "utf8");
  return outputPath;
}

if (process.argv[1]?.includes("com003-question-review-md-v9")) {
  const outputPath = writeCom003QuestionReviewMarkdownV9();
  console.log(`[COM003-V9-MD] ${outputPath}`);
  console.log(`[COM003-V9-MD] questions=${COM003_ENGLISH_REVIEW_CORPUS_V9.length}`);
}
