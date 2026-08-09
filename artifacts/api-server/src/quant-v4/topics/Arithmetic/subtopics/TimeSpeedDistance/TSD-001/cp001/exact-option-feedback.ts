import type {
  TsdCp001GeneratedQuestion,
  TsdCp001OptionAnalysis,
} from "./runtime-types";

const EQUATION = /(?:\d|\b[A-D]\b)[^.!?]{0,100}(?:=|×|÷|\\times|\\div)[^.!?]{0,100}\d/;

export function hasTsdCalculationEvidence(value: string): boolean {
  return EQUATION.test(value.replace(/\s+/g, " "));
}

function withoutDisplayedOption(reason: string, optionText: string): string {
  return reason.replace(optionText, "").replace(/^[✅⚠️\s:.-]+/, "").trim();
}

function normalizeCalculationLine(line: string): string {
  return line
    .trim()
    .replace(/^[•*-]\s*/, "")
    .replace(/^Therefore,?\s*/i, "")
    .replace(/^So,?\s*/i, "")
    .replace(/^(?:=|×|÷|\\times|\\div)\s*/, "")
    .trim();
}

function calculationCertificate(question: TsdCp001GeneratedQuestion): string {
  const candidates = [
    ...question.explanation.stepByStepSolution,
    ...question.explanation.working,
  ]
    .filter((line) => /(?:=|×|÷|\\times|\\div)/.test(line))
    .map(normalizeCalculationLine)
    .filter(Boolean);

  const finalLine = [...candidates].reverse().find((line) => line.includes(question.answerText))
    ?? candidates[candidates.length - 1];
  const operationLine = [...candidates]
    .reverse()
    .find((line) => line !== finalLine && /(?:×|÷|\\times|\\div|=)/.test(line));

  if (!finalLine) {
    throw new Error(`${question.questionLanguageId}: no exact calculation line is available`);
  }
  const certificate = [operationLine, finalLine].filter(Boolean).join(" ");
  if (/^(?:=|×|÷|\\times|\\div)\b/.test(certificate)) {
    throw new Error(`${question.questionLanguageId}: calculation certificate starts with an operator`);
  }
  return certificate;
}

export function ensureCp001ExactOptionFeedback(
  question: TsdCp001GeneratedQuestion,
): TsdCp001GeneratedQuestion {
  const certificate = calculationCertificate(question);
  const optionAnalysis = Object.freeze(question.explanation.optionAnalysis.map((entry): TsdCp001OptionAnalysis => {
    const remainder = withoutDisplayedOption(entry.reason, entry.text);
    if (hasTsdCalculationEvidence(remainder)) return entry;
    return Object.freeze({
      ...entry,
      reason: `${entry.reason.replace(/\s+$/, "")} Check: ${certificate}`,
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
