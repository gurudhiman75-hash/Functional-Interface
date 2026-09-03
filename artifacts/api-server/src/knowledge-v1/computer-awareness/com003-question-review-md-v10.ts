import fs from "node:fs";
import path from "node:path";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V10 } from "./com003-review-synthesis-v10";

function clean(value: unknown) {
  return String(value ?? "").replace(/\r?\n/g, " ").trim();
}

export function buildCom003QuestionReviewMarkdownV10() {
  const out: string[] = [
    "# COM-003 — Office & Productivity Software",
    "",
    "**English V10 · Simple Standard Exam Language Review Candidate**",
    "",
    "- 19 permanent QLs",
    "- 228 questions",
    "- 12 questions per QL",
    "- Balanced fact coverage within each QL",
    "- Review only",
    "",
    "> **Language rule:** Learner-facing stems use short, standard exam wording such as ‘Which shortcut is used to…?’, ‘Which feature is used to…?’, ‘What is … used for?’, and ‘Which file extension is used for…?’. Internal surface-family metadata does not control the wording.",
    "",
    "> **Governance:** This corpus is not frozen and is not authorized for localization, Question Studio replacement, question-bank writes, test eligibility, or publication until product review approves it.",
    "",
  ];

  for (const ql of COM003_PERMANENT_QLS) {
    const questions = COM003_ENGLISH_REVIEW_CORPUS_V10.filter((q) => q.qlId === ql.qlId);
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

export function writeCom003QuestionReviewMarkdownV10(outputDir = path.resolve("dist/com003-review-v10")) {
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, "COM-003-Office-Productivity-English-Question-Review-V10.md");
  fs.writeFileSync(outputPath, buildCom003QuestionReviewMarkdownV10(), "utf8");
  return outputPath;
}

if (process.argv[1]?.includes("com003-question-review-md-v10")) {
  const outputPath = writeCom003QuestionReviewMarkdownV10();
  console.log(`[COM003-V10-MD] ${outputPath}`);
  console.log(`[COM003-V10-MD] questions=${COM003_ENGLISH_REVIEW_CORPUS_V10.length}`);
}
