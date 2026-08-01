import {
  runMalCp002EnglishReleasePipeline,
  type MalCp002PermanentQlId,
  type MalCp002ReleasedQuestion,
} from "./cp002-permanent-runtime";
import {
  applyMalCp002EditorialRemediationV2,
  type MalCp002EditorialRemediationV2Question,
} from "./cp002-editorial-remediation-v2";

const ALGEBRAIC_SCALE_QL_IDS = new Set<MalCp002PermanentQlId>([
  "MAL-QL-023",
  "MAL-QL-024",
  "MAL-QL-028",
]);

function normalizeLegacyEditorialText(value: string): string {
  return value
    .replace(/\bpure[-\s]+component\b/giu, "single item")
    .replace(/\bpure[-\s]+([a-z][a-z ]*)/giu, "$1")
    .replace(/\bfixed counterpart\b/giu, "quantity of the other item")
    .replace(/\bunchanged counterpart\b/giu, "item not involved in the operation")
    .replace(/\bcounterpart component\b/giu, "other item");
}

function protectAlgebraicScaleTerms(value: string): string {
  const protectedTokens: string[] = [];
  const protect = (math: string): string => {
    const key = `@@ALGEBRA_${protectedTokens.length}@@`;
    protectedTokens.push(`$${math}$`);
    return key;
  };

  let output = normalizeLegacyEditorialText(value).replace(
    /\b([xy])\s*=\s*(-?\d+(?:\s+\d+\/\d+|\/\d+)?)\b/gu,
    (_match, variable: string, number: string) =>
      protect(`${variable} = ${number}`),
  );

  output = output.replace(
    /\b(-?\d+(?:\s+\d+\/\d+|\/\d+)?)([xy])\b/gu,
    (_match, coefficient: string, variable: string) =>
      protect(`${coefficient}${variable}`),
  );

  protectedTokens.forEach((token, index) => {
    output = output.replace(`@@ALGEBRA_${index}@@`, token);
  });
  return output;
}

function prepareEditorialQuestion(
  question: MalCp002ReleasedQuestion,
): MalCp002ReleasedQuestion {
  const transform = ALGEBRAIC_SCALE_QL_IDS.has(question.questionLanguageId)
    ? protectAlgebraicScaleTerms
    : normalizeLegacyEditorialText;

  return {
    ...question,
    stem: transform(question.stem),
    answer: transform(question.answer),
    options: question.options.map(transform),
    optionAudit: question.optionAudit.map((item) => ({
      ...item,
      text: transform(item.text),
    })),
    explanation: {
      ...question.explanation,
      coreConcept: transform(question.explanation.coreConcept),
      formula: transform(question.explanation.formula),
      steps: question.explanation.steps.map(transform),
      verification: transform(question.explanation.verification),
      conclusion: transform(question.explanation.conclusion),
      examShortcut: transform(question.explanation.examShortcut),
      commonTrap: transform(question.explanation.commonTrap),
      lines: question.explanation.lines.map(transform),
    },
    reasoningGraph: {
      nodes: question.reasoningGraph.nodes.map((node) => ({
        ...node,
        text: transform(node.text),
      })),
    },
  };
}

export function runMalCp002EnglishEditorialRemediationV2Pipeline(
  input: {
    questionLanguageId?: MalCp002PermanentQlId | string;
    seed?: string;
    language?: "en";
  } = {},
): MalCp002EditorialRemediationV2Question {
  const released = runMalCp002EnglishReleasePipeline({
    questionLanguageId: input.questionLanguageId as
      | MalCp002PermanentQlId
      | undefined,
    seed: input.seed,
    language: input.language,
  });
  return applyMalCp002EditorialRemediationV2(
    prepareEditorialQuestion(released),
  );
}
