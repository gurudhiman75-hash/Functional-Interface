import { COD_CP001_QUESTION_LOGICS } from "./question-language.en";
import { generateCodCp001Question } from "./generator";

export function exportCodCp001Review(seed = 1): string {
  const rows = ["qlId,ruleId,difficulty,renderer,stem,displayedEvidence,options,correctAnswer,ruleStatement"];
  for (const logic of COD_CP001_QUESTION_LOGICS) {
    const question = generateCodCp001Question(logic.qlId, seed);
    const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
    rows.push([
      question.qlId,
      question.ruleId,
      question.difficulty,
      question.renderer,
      quote(question.stem),
      quote([
        ...question.structuredPrompt.evidence.map((pair) => `${pair.source} → ${pair.code}`),
        ...(question.structuredPrompt.mappingTable?.map((entry) => `${entry.source} → ${entry.code ?? "?"}`) ?? []),
      ].join(" | ")),
      quote(question.options.map((option, index) => `${index + 1}. ${option.value}`).join(" | ")),
      quote(question.options[question.correctIndex]!.value),
      quote(question.explanation.ruleStatement),
    ].join(","));
  }
  return rows.join("\n");
}
