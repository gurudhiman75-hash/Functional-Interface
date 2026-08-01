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

function protectAlgebraicScaleTerms(value: string): string {
  const protectedTokens: string[] = [];
  const protect = (math: string): string => {
    const key = `@@ALGEBRA_${protectedTokens.length}@@`;
    protectedTokens.push(`$${math}$`);
    return key;
  };

  let output = value.replace(
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

function prepareAlgebraicScaleQuestion(
  question: MalCp002ReleasedQuestion,
): MalCp002ReleasedQuestion {
  if (!ALGEBRAIC_SCALE_QL_IDS.has(question.questionLanguageId)) {
    return question;
  }

  return {
    ...question,
    stem: protectAlgebraicScaleTerms(question.stem),
    explanation: {
      ...question.explanation,
      coreConcept: protectAlgebraicScaleTerms(
        question.explanation.coreConcept,
      ),
      formula: protectAlgebraicScaleTerms(question.explanation.formula),
      steps: question.explanation.steps.map(protectAlgebraicScaleTerms),
      verification: protectAlgebraicScaleTerms(
        question.explanation.verification,
      ),
      conclusion: protectAlgebraicScaleTerms(
        question.explanation.conclusion,
      ),
      examShortcut: protectAlgebraicScaleTerms(
        question.explanation.examShortcut,
      ),
      commonTrap: protectAlgebraicScaleTerms(
        question.explanation.commonTrap,
      ),
      lines: question.explanation.lines.map(protectAlgebraicScaleTerms),
    },
    reasoningGraph: {
      nodes: question.reasoningGraph.nodes.map((node) => ({
        ...node,
        text: protectAlgebraicScaleTerms(node.text),
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
    prepareAlgebraicScaleQuestion(released),
  );
}
