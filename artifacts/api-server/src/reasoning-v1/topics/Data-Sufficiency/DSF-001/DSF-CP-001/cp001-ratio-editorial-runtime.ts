import {
  generateDsfCp001RatioQuestion,
  type DsfCp001RatioQuestion,
} from "./cp001-ratio-runtime.ts";

export const DSF_CP001_RATIO_EDITORIAL_VERSION = "DSF_CP001_RATIO_EDITORIAL_V1" as const;

function naturalList(values: readonly string[]): string {
  if (values.length === 0) return "no valid answer";
  if (values.length === 1) return values[0]!;
  if (values.length === 2) return `${values[0]} or ${values[1]}`;
  if (values.length <= 5) return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
  return `${values.slice(0, 4).join(", ")} and others`;
}

function targetDescription(question: DsfCp001RatioQuestion): string {
  return question.targetKind === "RATIO_AB" ? "the ratio A:B" : "whether A or B is greater";
}

function comparisonMeaning(answer: string): string {
  return answer === "A" ? "A is greater than B" : "B is greater than A";
}

function statementReasoning(
  question: DsfCp001RatioQuestion,
  label: "Statement I" | "Statement II",
  worldCount: number,
  targetAnswers: readonly string[],
): string {
  const sufficient = targetAnswers.length === 1;

  if (question.targetKind === "RATIO_AB") {
    if (sufficient) {
      if (worldCount > 1) {
        return `${label} allows more than one pair of values for A and B, but every valid pair has A:B = ${targetAnswers[0]}. So ${label} alone is sufficient.`;
      }
      return `${label} fixes A:B = ${targetAnswers[0]}. So ${label} alone is sufficient.`;
    }
    return `${label} still allows different ratios for A:B, such as ${naturalList(targetAnswers)}. So ${label} alone is not sufficient.`;
  }

  if (sufficient) {
    return `${label} makes ${comparisonMeaning(targetAnswers[0]!)} in every valid case. So ${label} alone is sufficient.`;
  }
  return `${label} allows cases with A greater than B and cases with B greater than A. So ${label} alone is not sufficient.`;
}

function togetherReasoning(question: DsfCp001RatioQuestion): string | undefined {
  if (question.canonicalAnswer !== "BOTH_TOGETHER_ONLY" && question.canonicalAnswer !== "INSUFFICIENT_EVEN_TOGETHER") {
    return undefined;
  }

  const answers = question.proof.togetherTargetAnswers;
  if (question.canonicalAnswer === "BOTH_TOGETHER_ONLY") {
    if (question.targetKind === "RATIO_AB") {
      return `Using both statements together fixes A:B = ${answers[0]}. Therefore, the two statements together are sufficient.`;
    }
    return `Using both statements together shows that ${comparisonMeaning(answers[0]!)}. Therefore, the two statements together are sufficient.`;
  }

  if (question.targetKind === "RATIO_AB") {
    return `Even after using both statements, different ratios for A:B are still possible, such as ${naturalList(answers)}. Therefore, the ratio cannot be determined.`;
  }
  return "Even after using both statements, both A > B and B > A remain possible. Therefore, which quantity is greater cannot be determined.";
}

export function realizeDsfCp001RatioEnglish(
  semanticQuestion: DsfCp001RatioQuestion,
): DsfCp001RatioQuestion & { readonly editorialVersion: typeof DSF_CP001_RATIO_EDITORIAL_VERSION } {
  const prompt = semanticQuestion.targetKind === "RATIO_AB"
    ? "What is the ratio A:B in its simplest form?"
    : "Which is greater, A or B?";
  const stem = `A and B are distinct positive integers between 2 and 18. ${prompt}`;

  const explanation = {
    askedTarget: `We need to determine ${targetDescription(semanticQuestion)}.`,
    statementI: statementReasoning(
      semanticQuestion,
      "Statement I",
      semanticQuestion.proof.statementIWorldCount,
      semanticQuestion.proof.statementITargetAnswers,
    ),
    statementII: statementReasoning(
      semanticQuestion,
      "Statement II",
      semanticQuestion.proof.statementIIWorldCount,
      semanticQuestion.proof.statementIITargetAnswers,
    ),
    ...(togetherReasoning(semanticQuestion) ? { together: togetherReasoning(semanticQuestion) } : {}),
    conclusion: semanticQuestion.explanation.conclusion,
  };

  return Object.freeze({
    ...semanticQuestion,
    editorialVersion: DSF_CP001_RATIO_EDITORIAL_VERSION,
    stem,
    questionPrompt: prompt,
    explanation,
  });
}

export function generateDsfCp001RatioEnglish(seed: number) {
  return realizeDsfCp001RatioEnglish(generateDsfCp001RatioQuestion(seed));
}

export function generateDsfCp001RatioEnglishBatch(seeds: readonly number[]) {
  return seeds.map(generateDsfCp001RatioEnglish);
}
