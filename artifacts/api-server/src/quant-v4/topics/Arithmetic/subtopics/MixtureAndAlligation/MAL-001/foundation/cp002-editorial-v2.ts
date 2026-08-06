import {
  MAL_CP002_PERMANENT_ALLOCATION,
  runMalCp002EnglishReleasePipeline as runMalCp002EnglishReleasePipelineV1,
  type MalCp002PermanentQlId,
  type MalCp002ReleasedQuestion,
} from "./cp002-permanent-runtime";
import { MAL_CP002_EDITORIAL_V2, MAL_CP002_EDITORIAL_V2_ID, sourceEditorial, naturalVisual, type Explanation } from "./cp002-editorial-v2-common";
import { totalRatioAdjustmentEditorial, otherComponentEditorial, originalTotalEditorial } from "./cp002-editorial-v2-families1";
import { forwardReplacementEditorial, invarianceEditorial, operationChoiceEditorial } from "./cp002-editorial-v2-families2";
import { threeComponentEditorial } from "./cp002-editorial-v2-families3";

export { MAL_CP002_EDITORIAL_V2, MAL_CP002_EDITORIAL_V2_ID } from "./cp002-editorial-v2-common";

function customEditorial(
  question: MalCp002ReleasedQuestion,
): { stem: string; explanation: Explanation } {
  switch (question.permanentQlId) {
    case "MAL-QL-020":
    case "MAL-QL-021":
      return totalRatioAdjustmentEditorial(question);
    case "MAL-QL-022":
      return otherComponentEditorial(question);
    case "MAL-QL-023":
    case "MAL-QL-024":
      return originalTotalEditorial(question);
    case "MAL-QL-025":
      return forwardReplacementEditorial(question);
    case "MAL-QL-026":
      return invarianceEditorial(question);
    case "MAL-QL-027":
      return operationChoiceEditorial(question);
    case "MAL-QL-028":
      return threeComponentEditorial(question);
    default:
      return sourceEditorial(question);
  }
}

function assertEditorialV2(
  question: MalCp002ReleasedQuestion,
): void {
  const learnerText = [
    question.stem,
    question.explanation.coreConcept,
    question.explanation.formula,
    ...question.explanation.steps,
    question.explanation.verification,
    question.explanation.conclusion,
    question.explanation.examShortcut,
    question.explanation.commonTrap,
  ].join("\n");

  const forbidden = [
    /\balligation\b/iu,
    /\bpure\b/iu,
    /\bfixed counterpart\b/iu,
    /\bunaltered component\b/iu,
    /\bunchanged component\b/iu,
    /\bchanged component\b/iu,
    /\|[^|\n]+\|/u,
    /\b1 parts\b/iu,
    /\[cite(?:_start|:)|googleusercontent|immersive_entry_chip/iu,
  ];
  for (const pattern of forbidden) {
    if (pattern.test(learnerText)) {
      throw new Error(
        `${question.questionId}: editorial V2 violation ${pattern}.`,
      );
    }
  }
  if (!question.stem.endsWith("?")) {
    throw new Error(`${question.questionId}: stem is not interrogative.`);
  }
  if (!question.explanation.formula.includes("\\[")) {
    throw new Error(
      `${question.questionId}: formula has no displayed MathJax.`,
    );
  }
  if (
    question.explanation.steps.some(
      (step) => !step.includes("\\(") && !step.includes("\\["),
    )
  ) {
    throw new Error(
      `${question.questionId}: a worked step has no MathJax.`,
    );
  }
}

export function runMalCp002EnglishEditorialV2Pipeline(
  input: {
    questionLanguageId?: MalCp002PermanentQlId;
    seed?: string;
    language?: "en";
  } = {},
): MalCp002ReleasedQuestion {
  const base = runMalCp002EnglishReleasePipelineV1(input);
  const editorial = customEditorial(base);
  const question: MalCp002ReleasedQuestion = {
    ...base,
    stem: editorial.stem,
    explanationId: `${base.permanentQlId}-EN-CONSERVED-PART-MATHJAX-V2`,
    parameters: {
      ...base.parameters,
      editorialVersion: MAL_CP002_EDITORIAL_V2_ID,
      pedagogicalMethod: "CONSERVED_RATIO_PART",
      alligationAllowed: false,
    },
    explanation: editorial.explanation,
    diagram: naturalVisual(base.diagram),
    validation: {
      ...base.validation,
      checks: [
        ...base.validation.checks,
        {
          name: "editorial-v2-natural-stem",
          passed: true,
          message: "The stem uses a natural competitive-exam voice.",
        },
        {
          name: "editorial-v2-conserved-part-method",
          passed: true,
          message: "CP-002 uses ratio conservation and no alligation.",
        },
        {
          name: "editorial-v2-mathjax",
          passed: true,
          message: "Worked arithmetic uses MathJax with no skipped direction.",
        },
      ],
    },
  };
  assertEditorialV2(question);
  return question;
}

export const MAL_CP002_EDITORIAL_V2_QL_IDS =
  MAL_CP002_PERMANENT_ALLOCATION.map((entry) => entry.qlId);
