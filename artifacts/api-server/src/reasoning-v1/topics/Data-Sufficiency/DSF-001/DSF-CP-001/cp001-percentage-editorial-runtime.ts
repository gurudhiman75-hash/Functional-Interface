import {
  generateDsfCp001PercentageQuestion,
  type DsfCp001PercentageQuestion,
} from "./cp001-percentage-runtime.ts";

export const DSF_CP001_PERCENTAGE_EDITORIAL_VERSION = "DSF_CP001_PERCENTAGE_EDITORIAL_V1" as const;

function naturalList(values: readonly string[]): string {
  if (values.length === 0) return "no valid answer";
  if (values.length === 1) return values[0]!;
  if (values.length === 2) return `${values[0]} or ${values[1]}`;
  if (values.length <= 5) return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
  return `${values.slice(0, 4).join(", ")} and others`;
}

function directionPhrase(answer: string): string {
  if (answer === "ABOVE") return "the final value is above the original value";
  if (answer === "BELOW") return "the final value is below the original value";
  return "the final value is equal to the original value";
}

function directionAlternatives(values: readonly string[]): string {
  const labels = values.map(directionPhrase);
  return naturalList(labels);
}

function targetDescription(question: DsfCp001PercentageQuestion): string {
  return question.targetKind === "NET_PERCENT_CHANGE"
    ? "the net percentage change from the original value"
    : "whether the final value is above, below or equal to the original value";
}

function statementReasoning(
  question: DsfCp001PercentageQuestion,
  label: "Statement I" | "Statement II",
  worldCount: number,
  targetAnswers: readonly string[],
): string {
  const sufficient = targetAnswers.length === 1;

  if (question.targetKind === "NET_PERCENT_CHANGE") {
    if (sufficient) {
      if (worldCount > 1) {
        return `${label} allows more than one pair of rates P and Q, but every valid pair gives the same net change of ${targetAnswers[0]}. So ${label} alone is sufficient.`;
      }
      return `${label} fixes the net change at ${targetAnswers[0]}. So ${label} alone is sufficient.`;
    }
    return `${label} still allows different net changes, such as ${naturalList(targetAnswers)}. So ${label} alone is not sufficient.`;
  }

  if (sufficient) {
    return `${label} shows that ${directionPhrase(targetAnswers[0]!)} in every valid case. So ${label} alone is sufficient.`;
  }
  return `${label} still allows different outcomes: ${directionAlternatives(targetAnswers)}. So ${label} alone is not sufficient.`;
}

function togetherReasoning(question: DsfCp001PercentageQuestion): string | undefined {
  if (question.canonicalAnswer !== "BOTH_TOGETHER_ONLY" && question.canonicalAnswer !== "INSUFFICIENT_EVEN_TOGETHER") {
    return undefined;
  }

  const answers = question.proof.togetherTargetAnswers;
  if (question.canonicalAnswer === "BOTH_TOGETHER_ONLY") {
    if (question.targetKind === "NET_PERCENT_CHANGE") {
      return `Using both statements together fixes the net change at ${answers[0]}. Therefore, the two statements together are sufficient.`;
    }
    return `Using both statements together shows that ${directionPhrase(answers[0]!)}. Therefore, the two statements together are sufficient.`;
  }

  if (question.targetKind === "NET_PERCENT_CHANGE") {
    return `Even after using both statements, different net changes remain possible, such as ${naturalList(answers)}. Therefore, the net percentage change cannot be determined.`;
  }
  return `Even after using both statements, different outcomes remain possible: ${directionAlternatives(answers)}. Therefore, the final direction cannot be determined.`;
}

export function realizeDsfCp001PercentageEnglish(
  semanticQuestion: DsfCp001PercentageQuestion,
): DsfCp001PercentageQuestion & { readonly editorialVersion: typeof DSF_CP001_PERCENTAGE_EDITORIAL_VERSION } {
  const prompt = semanticQuestion.targetKind === "NET_PERCENT_CHANGE"
    ? "What is the net percentage change from the original value?"
    : "Is the final value above, below or equal to the original value?";
  const stem = `P and Q are percentage rates, each a multiple of 5 from 5% to 50%. A value is increased by P% and then decreased by Q%. ${prompt}`;
  const together = togetherReasoning(semanticQuestion);

  return Object.freeze({
    ...semanticQuestion,
    editorialVersion: DSF_CP001_PERCENTAGE_EDITORIAL_VERSION,
    stem,
    questionPrompt: prompt,
    explanation: {
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
      ...(together ? { together } : {}),
      conclusion: semanticQuestion.explanation.conclusion,
    },
  });
}

export function generateDsfCp001PercentageEnglish(seed: number) {
  return realizeDsfCp001PercentageEnglish(generateDsfCp001PercentageQuestion(seed));
}

export function generateDsfCp001PercentageEnglishBatch(seeds: readonly number[]) {
  return seeds.map(generateDsfCp001PercentageEnglish);
}
