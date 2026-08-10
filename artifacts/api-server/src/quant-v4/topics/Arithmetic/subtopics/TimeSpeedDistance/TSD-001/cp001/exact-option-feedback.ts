import type {
  TsdCp001GeneratedQuestion,
  TsdCp001OptionAnalysis,
} from "./runtime-types";

const EQUATION = /(?:\d|\b[A-D]\b)[^.!?]{0,120}(?:=|×|÷|\+|−|-|\\times|\\div)[^.!?]{0,120}\d/;

export function hasTsdCalculationEvidence(value: string): boolean {
  return EQUATION.test(value.replace(/\s+/g, " "));
}

function withoutDisplayedOption(reason: string, optionText: string): string {
  return reason.replace(optionText, "").replace(/^[✅⚠️\s:.-]+/, "").trim();
}

function cleanLine(line: string): string {
  return line
    .trim()
    .replace(/^[•*-]\s*/, "")
    .replace(/^Therefore,?\s*/i, "")
    .replace(/^So,?\s*/i, "")
    .replace(/[.\s]+$/, "")
    .trim();
}

function joinAsEquation(operationLine: string | undefined, finalLine: string): string {
  const final = cleanLine(finalLine);
  const operation = operationLine ? cleanLine(operationLine) : "";

  if (final.startsWith("=")) {
    const result = final.replace(/^=\s*/, "").trim();
    if (!operation) return result;
    return operation.endsWith("=") ? `${operation} ${result}` : `${operation} = ${result}`;
  }

  if (/(?:=|×|÷|\+|−|-|\\times|\\div)/.test(final) && /=/.test(final)) {
    return final;
  }

  if (operation) {
    if (operation.includes(final)) return operation;
    return operation.endsWith("=") ? `${operation} ${final}` : `${operation} = ${final}`;
  }

  return final;
}

function calculationCertificate(question: TsdCp001GeneratedQuestion): string {
  const candidates = [
    ...question.explanation.stepByStepSolution,
    ...question.explanation.working,
  ].filter((line) => /(?:=|×|÷|\+|−|-|\\times|\\div)/.test(line));

  const finalLine = [...candidates].reverse().find((line) => line.includes(question.answerText))
    ?? candidates[candidates.length - 1];
  if (!finalLine) {
    throw new Error(`${question.questionLanguageId}: no exact calculation line is available`);
  }

  const operationLine = [...candidates]
    .reverse()
    .find((line) => line !== finalLine && /(?:×|÷|\+|−|-|\\times|\\div|=)/.test(line));
  const certificate = joinAsEquation(operationLine, finalLine)
    .replace(/\s+/g, " ")
    .trim();

  if (/^(?:=|×|÷|\+|−|-|\\times|\\div)\b/.test(certificate)) {
    throw new Error(`${question.questionLanguageId}: calculation certificate starts with an operator`);
  }
  if (/(?:×|÷|\+|−|-|\\times|\\div)/.test(certificate) && !/=/.test(certificate)) {
    throw new Error(`${question.questionLanguageId}: calculation certificate has an operation but no equals sign`);
  }
  return certificate;
}

export function ensureCp001ExactOptionFeedback(
  question: TsdCp001GeneratedQuestion,
): TsdCp001GeneratedQuestion {
  const certificate = calculationCertificate(question);
  const optionAnalysis = Object.freeze(question.explanation.optionAnalysis.map((entry): TsdCp001OptionAnalysis => {
    const remainder = withoutDisplayedOption(entry.reason, entry.text);
    if (hasTsdCalculationEvidence(remainder) && /=/.test(remainder)) return entry;
    return Object.freeze({
      ...entry,
      reason: `${entry.reason.replace(/[.\s]+$/, "")}. Correct check: ${certificate}.`,
    });
  }));

  return Object.freeze({
    ...question,
    explanation: Object.freeze({
      ...question.explanation,
      optionAnalysis,
    }),
  });
}
