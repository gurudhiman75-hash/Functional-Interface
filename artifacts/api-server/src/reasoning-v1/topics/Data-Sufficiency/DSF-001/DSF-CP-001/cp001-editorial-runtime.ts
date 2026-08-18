import {
  generateDsfCp001NumberSystemQuestion,
  type DsfCp001NumberSystemQuestion,
} from "./cp001-number-system-runtime.ts";

export const DSF_CP001_EDITORIAL_VERSION = "DSF_CP001_EDITORIAL_V1" as const;

function naturalList(values: readonly number[]): string {
  if (values.length === 0) return "no value";
  if (values.length === 1) return String(values[0]);
  if (values.length === 2) return `${values[0]} or ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}

function targetLabel(question: DsfCp001NumberSystemQuestion): string {
  return question.targetKind === "MISSING_DIGIT" ? "the value of X" : "whether X is even or odd";
}

function statementReasoning(
  question: DsfCp001NumberSystemQuestion,
  label: "Statement I" | "Statement II",
  digits: readonly number[],
  targetAnswers: readonly string[],
  sufficient: boolean,
): string {
  const possible = naturalList(digits);

  if (question.targetKind === "MISSING_DIGIT") {
    if (sufficient) {
      return `${label} gives X = ${targetAnswers[0]}. Therefore, ${label} alone is sufficient.`;
    }
    return `${label} allows X to be ${possible}. Since X is not fixed, ${label} alone is not sufficient.`;
  }

  if (sufficient) {
    const parity = String(targetAnswers[0] ?? "").toLowerCase();
    if (digits.length === 1) {
      return `${label} gives X = ${digits[0]}, which is ${parity}. Therefore, ${label} alone is sufficient.`;
    }
    return `${label} allows X to be ${possible}. Every possible value is ${parity}, so ${label} alone is sufficient.`;
  }

  return `${label} allows X to be ${possible}. These possibilities do not all have the same parity, so ${label} alone is not sufficient.`;
}

function togetherReasoning(question: DsfCp001NumberSystemQuestion): string | undefined {
  const proof = question.proof;
  if (question.canonicalAnswer !== "BOTH_TOGETHER_ONLY" && question.canonicalAnswer !== "INSUFFICIENT_EVEN_TOGETHER") {
    return undefined;
  }

  const possible = naturalList(proof.togetherDigits);
  if (question.canonicalAnswer === "BOTH_TOGETHER_ONLY") {
    if (question.targetKind === "MISSING_DIGIT") {
      return `Using both statements together gives X = ${proof.togetherTargetAnswers[0]}. Thus the two statements together are sufficient.`;
    }
    const parity = String(proof.togetherTargetAnswers[0] ?? "").toLowerCase();
    return `Using both statements together, X can be ${possible}. Every remaining value is ${parity}, so together the statements are sufficient.`;
  }

  if (question.targetKind === "MISSING_DIGIT") {
    return `Even after using both statements, X can still be ${possible}. Therefore, the value of X cannot be determined.`;
  }
  return `Even after using both statements, X can still be ${possible}, including different parities. Therefore, the answer cannot be determined.`;
}

export function realizeDsfCp001English(
  semanticQuestion: DsfCp001NumberSystemQuestion,
): DsfCp001NumberSystemQuestion & { readonly editorialVersion: typeof DSF_CP001_EDITORIAL_VERSION } {
  const prompt = semanticQuestion.targetKind === "MISSING_DIGIT"
    ? "What is the value of X?"
    : "Is X even or odd?";
  const stem = `In the three-digit number ${semanticQuestion.stem.match(/number\s+(\d\dX)/i)?.[1] ?? "ABX"}, X is a digit. ${prompt}`;

  const explanation = {
    askedTarget: `We need to determine ${targetLabel(semanticQuestion)}.`,
    statementI: statementReasoning(
      semanticQuestion,
      "Statement I",
      semanticQuestion.proof.statementIDigits,
      semanticQuestion.proof.statementITargetAnswers,
      semanticQuestion.proof.statementITargetAnswers.length === 1,
    ),
    statementII: statementReasoning(
      semanticQuestion,
      "Statement II",
      semanticQuestion.proof.statementIIDigits,
      semanticQuestion.proof.statementIITargetAnswers,
      semanticQuestion.proof.statementIITargetAnswers.length === 1,
    ),
    ...(togetherReasoning(semanticQuestion) ? { together: togetherReasoning(semanticQuestion) } : {}),
    conclusion: semanticQuestion.explanation.conclusion,
  };

  return Object.freeze({
    ...semanticQuestion,
    editorialVersion: DSF_CP001_EDITORIAL_VERSION,
    stem,
    questionPrompt: prompt,
    explanation,
  });
}

export function generateDsfCp001NumberSystemEnglish(seed: number) {
  return realizeDsfCp001English(generateDsfCp001NumberSystemQuestion(seed));
}

export function generateDsfCp001NumberSystemEnglishBatch(seeds: readonly number[]) {
  return seeds.map(generateDsfCp001NumberSystemEnglish);
}
