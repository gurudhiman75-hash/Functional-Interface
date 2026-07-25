import { generateCodCp004Question } from "./generator";
import { COD_CP004_QUESTION_LOGICS } from "./question-language.en";

export function exportCodCp004Review(seed = 1): string {
  const rows = ["qlId,ruleId,context,difficulty,renderer,wrapUsed,stem,evidence,options,correctAnswer,ruleStatement"];
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
  for (const logic of COD_CP004_QUESTION_LOGICS) {
    const question = generateCodCp004Question(logic.qlId, seed);
    rows.push([
      question.qlId,
      question.ruleId,
      quote(JSON.stringify(question.ruleContext)),
      question.difficulty,
      question.renderer,
      String(question.metadata.wrapUsed),
      quote(question.stem),
      quote(question.structuredPrompt.evidence.map((pair) => `${pair.source} → ${pair.code}`).join(" | ")),
      quote(question.options.map((option, index) => `${index + 1}. ${option.value}`).join(" | ")),
      quote(question.options[question.correctIndex]!.value),
      quote(question.explanation.ruleStatement),
    ].join(","));
  }
  return rows.join("\n");
}
