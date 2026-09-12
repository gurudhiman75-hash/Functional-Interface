import { generateArgCp012QuestionStudioBatch } from "./cp012-question-studio-adapter.ts";
import { generateArgCp012RealPaperQuestion } from "./cp012-editorial-real-paper-remediation.ts";
import type { ArgLocale } from "./types.ts";

const ROMAN = ["I", "II", "III", "IV"] as const;

function block(title: string, question: Readonly<Record<string, any>>): string {
  const lines: string[] = [];
  lines.push(`## ${title}`);
  lines.push("");
  lines.push(`- QL: ${question.qlId}`);
  lines.push(`- Difficulty: ${question.difficultyLabel ?? question.difficulty}`);
  lines.push(`- Profile: ${question.profile ?? question.profileMode ?? "core"}`);
  lines.push(`- Locale: ${question.locale}`);
  if (question.metadata?.cardinalityMode) lines.push(`- Cardinality mode: ${question.metadata.cardinalityMode}`);
  lines.push("");
  lines.push(`**Statement:** ${question.statement}`);
  lines.push("");
  lines.push("**Arguments:**");
  for (let index = 0; index < question.arguments.length; index += 1) {
    lines.push(`${ROMAN[index]}. ${question.arguments[index]}`);
  }
  lines.push("");
  lines.push("**Options:**");
  for (let index = 0; index < question.options.length; index += 1) {
    lines.push(`${String.fromCharCode(65 + index)}. ${question.options[index]}`);
  }
  lines.push("");
  const answerText = question.options[question.correctIndex] ?? question.answer ?? question.canonicalAnswer;
  lines.push(`**Answer:** ${answerText}`);
  lines.push("");
  lines.push(`**Explanation:** ${question.explanation}`);
  lines.push("");
  return lines.join("\n");
}

function realPaper(title: string, input: {
  qlId: "ARG-QL-001" | "ARG-QL-002" | "ARG-QL-003" | "ARG-QL-004" | "ARG-QL-005" | "ARG-QL-006";
  locale: ArgLocale;
  seed: number;
  profile: "SSC_RECENT_2X4" | "BANKING_CLASSIC_2X5" | "BANKING_COMBO_3X5" | "BANKING_COMBO_4X5";
  difficulty: "Easy" | "Medium" | "Hard";
}) {
  return block(title, generateArgCp012RealPaperQuestion(input) as unknown as Readonly<Record<string, any>>);
}

function core(title: string, input: {
  qlId: "ARG-QL-001" | "ARG-QL-002" | "ARG-QL-003" | "ARG-QL-004" | "ARG-QL-005" | "ARG-QL-006";
  language: "en" | "hi" | "pa";
  difficulty: "Easy" | "Medium" | "Hard";
  seed: string;
}) {
  const result = generateArgCp012QuestionStudioBatch({ ...input, count: 1 });
  return block(title, result.questions[0] as unknown as Readonly<Record<string, any>>);
}

const output = [
  "# ARG-001 CP012 — Deterministic Learner-Facing Review Samples",
  "",
  "Generated directly from the CP012 runtime. Learner release remains locked.",
  "",
  core("1. Core / English / Easy", { qlId: "ARG-QL-002", language: "en", difficulty: "Easy", seed: "CP012-REVIEW-CORE-EASY" }),
  core("2. Core / English / Medium", { qlId: "ARG-QL-004", language: "en", difficulty: "Medium", seed: "CP012-REVIEW-CORE-MEDIUM" }),
  core("3. Core / Punjabi / Hard", { qlId: "ARG-QL-005", language: "pa", difficulty: "Hard", seed: "CP012-REVIEW-CORE-HARD-PA" }),
  realPaper("4. SSC 2×4 / corrected grievance-contact scenario", { qlId: "ARG-QL-001", locale: "en-IN", seed: 2, profile: "SSC_RECENT_2X4", difficulty: "Easy" }),
  realPaper("5. Banking classic 2×5", { qlId: "ARG-QL-002", locale: "en-IN", seed: 0, profile: "BANKING_CLASSIC_2X5", difficulty: "Medium" }),
  realPaper("6. Banking 3×5 / Medium / one strong", { qlId: "ARG-QL-003", locale: "en-IN", seed: 0, profile: "BANKING_COMBO_3X5", difficulty: "Medium" }),
  realPaper("7. Banking 3×5 / Medium / two strong", { qlId: "ARG-QL-003", locale: "en-IN", seed: 4, profile: "BANKING_COMBO_3X5", difficulty: "Medium" }),
  realPaper("8. Banking 3×5 / Hard / two strong", { qlId: "ARG-QL-006", locale: "en-IN", seed: 0, profile: "BANKING_COMBO_3X5", difficulty: "Hard" }),
  realPaper("9. Banking 3×5 / Hard / one strong", { qlId: "ARG-QL-006", locale: "en-IN", seed: 4, profile: "BANKING_COMBO_3X5", difficulty: "Hard" }),
  realPaper("10. Banking 4×5 / two strong", { qlId: "ARG-QL-004", locale: "en-IN", seed: 0, profile: "BANKING_COMBO_4X5", difficulty: "Hard" }),
  realPaper("11. Banking 4×5 / three strong", { qlId: "ARG-QL-004", locale: "en-IN", seed: 4, profile: "BANKING_COMBO_4X5", difficulty: "Hard" }),
  realPaper("12. Banking 4×5 / one strong", { qlId: "ARG-QL-004", locale: "en-IN", seed: 8, profile: "BANKING_COMBO_4X5", difficulty: "Hard" }),
  realPaper("13. Banking 4×5 / Hindi localization", { qlId: "ARG-QL-005", locale: "hi-IN", seed: 4, profile: "BANKING_COMBO_4X5", difficulty: "Hard" }),
  realPaper("14. Banking 4×5 / Punjabi localization", { qlId: "ARG-QL-005", locale: "pa-IN", seed: 8, profile: "BANKING_COMBO_4X5", difficulty: "Hard" }),
  realPaper("15. SSC 2×4 / Hindi grievance-contact copy", { qlId: "ARG-QL-001", locale: "hi-IN", seed: 3, profile: "SSC_RECENT_2X4", difficulty: "Easy" }),
].join("\n");

console.log(output);
