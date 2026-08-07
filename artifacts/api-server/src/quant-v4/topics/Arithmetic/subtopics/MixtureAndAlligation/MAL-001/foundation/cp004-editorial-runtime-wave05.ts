import {
  addRational,
  divideRational,
  equalsRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import type { Rational } from "./types";
import type { MalCp004Wave03EffectiveContractId } from "./cp004-equivalence-authority-wave03";
import {
  generateMalCp004Wave04Question,
  verifyMalCp004Wave04Question,
} from "./cp004-unified-runtime-wave04";
import {
  MAL_CP004_WAVE04_RUNTIME_ID,
  type MalCp004Wave04Question,
} from "./cp004-unified-runtime-wave04-types";

export const MAL_CP004_WAVE05_RUNTIME_ID =
  "MAL-CP004-EN-EDITORIAL-REVIEW-V1" as const;

export interface MalCp004Wave05DistractorAnalysis {
  optionLetter: "A" | "B" | "C" | "D";
  displayedValue: string;
  misconceptionLabel: string;
  wrongCalculation: string;
  correction: string;
  reviewerMisconceptionId: string;
}

export type MalCp004Wave05EditorialQuestion = Omit<
  MalCp004Wave04Question,
  "runtimeId" | "explanation" | "maturity" | "allocationStatus"
> & {
  runtimeId: typeof MAL_CP004_WAVE05_RUNTIME_ID;
  baseRuntimeId: typeof MAL_CP004_WAVE04_RUNTIME_ID;
  explanation: {
    layoutId: "MAL-CP004-EN-FOUR-TIER-EDITORIAL-V1";
    coreConceptAndFormula: string;
    stepByStepSolution: string[];
    examSpeedShortcut: string;
    distractorAnalysis: MalCp004Wave05DistractorAnalysis[];
    verification: string;
    conclusion: string;
  };
  editorialValidation: { ok: boolean; errors: string[] };
  maturity: "ENGLISH_EDITORIAL_REVIEW_CANDIDATE";
  allocationStatus: "UNALLOCATED_EDITORIAL_REVIEW";
  reviewStatus: "READY_FOR_HUMAN_REVIEW";
};

interface NamedRational {
  key: string;
  label: string;
  value: Rational;
}

function isRational(value: Rational | string): value is Rational {
  return typeof value !== "string";
}

function stateLabel(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/gu, "$1 $2")
    .replace(/_/gu, " ")
    .toLowerCase();
}

function stateRationals(question: MalCp004Wave04Question): NamedRational[] {
  return Object.entries(question.exactState)
    .filter((entry): entry is [string, Rational] => isRational(entry[1]))
    .map(([key, value]) => ({ key, label: stateLabel(key), value }));
}

function optionLetter(index: number): "A" | "B" | "C" | "D" {
  const letters = ["A", "B", "C", "D"] as const;
  return letters[index] ?? "D";
}

function misconceptionLabel(misconceptionId: string): string {
  const words = misconceptionId.replace(/_/gu, " ");
  const replacements: readonly [RegExp, string][] = [
    [/^reported /u, "directly reporting "],
    [/^used /u, "using "],
    [/^applied /u, "applying "],
    [/^divided /u, "dividing "],
    [/^forgot /u, "forgetting "],
    [/^treated /u, "treating "],
    [/^subtracted /u, "subtracting "],
    [/^added /u, "adding "],
    [/^halved /u, "halving "],
  ];
  const transformed = replacements.reduce(
    (value, [pattern, replacement]) => value.replace(pattern, replacement),
    words,
  );
  return `${transformed[0]?.toUpperCase() ?? ""}${transformed.slice(1)}`;
}

function findDirectStateExpression(
  question: MalCp004Wave04Question,
  optionValue: Rational,
): string | null {
  const direct = stateRationals(question).find((entry) =>
    equalsRational(entry.value, optionValue),
  );
  return direct
    ? `${direct.label} = ${formatRational(direct.value)}`
    : null;
}

function findAnswerScaleExpression(
  question: MalCp004Wave04Question,
  optionValue: Rational,
): string | null {
  const answer = question.answerValue;
  const candidates = [
    {
      value: multiplyRational(answer, rational(2)),
      text: `2 × ${question.answer}`,
    },
    {
      value: divideRational(answer, rational(2)),
      text: `${question.answer} ÷ 2`,
    },
    {
      value: multiplyRational(answer, rational(3, 2)),
      text: `3/2 × ${question.answer}`,
    },
  ];
  return candidates.find((candidate) =>
    equalsRational(candidate.value, optionValue),
  )?.text ?? null;
}

function findPairExpression(
  question: MalCp004Wave04Question,
  optionValue: Rational,
): string | null {
  const entries = stateRationals(question);
  for (const left of entries) {
    for (const right of entries) {
      const candidates: { value: Rational; symbol: string }[] = [
        { value: addRational(left.value, right.value), symbol: "+" },
        { value: subtractRational(left.value, right.value), symbol: "−" },
        { value: multiplyRational(left.value, right.value), symbol: "×" },
      ];
      if (right.value.numerator !== 0n) {
        candidates.push({
          value: divideRational(left.value, right.value),
          symbol: "÷",
        });
      }
      const match = candidates.find((candidate) =>
        equalsRational(candidate.value, optionValue),
      );
      if (match) {
        return `${left.label} ${match.symbol} ${right.label} = ${formatRational(optionValue)}`;
      }
    }
  }
  return null;
}

function wrongCalculation(
  question: MalCp004Wave04Question,
  optionValue: Rational,
  misconceptionId: string,
): string {
  const expression =
    findDirectStateExpression(question, optionValue) ??
    findAnswerScaleExpression(question, optionValue) ??
    findPairExpression(question, optionValue);
  if (expression) return `${expression} → ${question.answerUnit === "percent" ? `${formatRational(multiplyRational(optionValue, rational(100)))}%` : `${formatRational(optionValue)} ${question.answerUnit}`}`;

  const first = stateRationals(question)[0];
  return first
    ? `Starting from ${first.label} = ${formatRational(first.value)}, the “${misconceptionLabel(misconceptionId).toLowerCase()}” route produces ${question.answerUnit === "percent" ? `${formatRational(multiplyRational(optionValue, rational(100)))}%` : `${formatRational(optionValue)} ${question.answerUnit}`}.`
    : `The “${misconceptionLabel(misconceptionId).toLowerCase()}” route produces the displayed value.`;
}

function coreConceptAndFormula(
  contractId: MalCp004Wave03EffectiveContractId,
): string {
  switch (contractId) {
    case "MAL-CP004-EFF-COMPONENT-AMOUNT":
      return "A percentage is a fraction of the complete mixture: $\\text{component quantity}=\\text{total quantity}\\times\\text{component fraction}$.";
    case "MAL-CP004-EFF-CONCENTRATION":
      return "Concentration compares the required component with the complete mixture: $\\text{concentration}=\\frac{\\text{component quantity}}{\\text{total quantity}}\\times100\\%$.";
    case "MAL-CP004-EFF-TOTAL-FROM-COMPONENT-RATE":
      return "Recover the complete mixture by dividing the known component by its fraction: $\\text{total}=\\frac{\\text{known component}}{\\text{known fraction}}$.";
    case "MAL-CP004-EFF-PURE-SOLUTE-ADDITION-TARGET":
      return "When pure solute is added, the solvent amount is conserved: $\\text{solvent before}=\\text{solvent after}$.";
    case "MAL-CP004-EFF-MOISTURE-FORWARD":
    case "MAL-CP004-EFF-MOISTURE-INVERSE":
      return "Dry matter remains unchanged during drying: $\\text{dry matter before}=\\text{dry matter after}$.";
    default:
      return "When only solvent is added or removed, the solute amount is conserved: $\\text{solute before}=\\text{solute after}$.";
  }
}

function examSpeedShortcut(question: MalCp004Wave04Question): string {
  const numericalSteps = question.explanation.calculation
    .filter((step) => /\d/u.test(step))
    .slice(-2);
  return [
    question.explanation.fastMethod,
    "With these values:",
    ...numericalSteps,
    `Therefore, the answer is ${question.answer}.`,
  ].join(" ");
}

function buildDistractorAnalysis(
  question: MalCp004Wave04Question,
): MalCp004Wave05DistractorAnalysis[] {
  return question.optionAudit.flatMap((option, index) => {
    if (option.isCorrect) return [];
    const letter = optionLetter(index);
    const label = misconceptionLabel(option.misconceptionId);
    return [
      {
        optionLetter: letter,
        displayedValue: option.text,
        misconceptionLabel: label,
        wrongCalculation: `Option ${letter} (${option.text}): ${wrongCalculation(
          question,
          option.value,
          option.misconceptionId,
        )}`,
        correction: `This does not preserve the governing quantity. Using the correct conserved-quantity relation gives ${question.answer}.`,
        reviewerMisconceptionId: option.misconceptionId,
      },
    ];
  });
}

function validateEditorialQuestion(
  question: Omit<MalCp004Wave05EditorialQuestion, "editorialValidation">,
): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const independent = verifyMalCp004Wave04Question(
    question as unknown as MalCp004Wave04Question,
  );
  if (!independent.ok) errors.push(...independent.errors);
  if (!question.explanation.coreConceptAndFormula.includes("$")) {
    errors.push("Core concept omits the governing formula.");
  }
  if (question.explanation.stepByStepSolution.length < 2) {
    errors.push("Step-by-step solution is too shallow.");
  }
  if (!question.explanation.examSpeedShortcut.includes(question.answer)) {
    errors.push("Shortcut omits the state-specific answer.");
  }
  if ((question.explanation.examSpeedShortcut.match(/\d/gu) ?? []).length < 2) {
    errors.push("Shortcut is not numerical enough.");
  }
  if (question.explanation.distractorAnalysis.length !== 3) {
    errors.push("All three displayed distractors are not analysed.");
  }
  for (const trap of question.explanation.distractorAnalysis) {
    if (!trap.wrongCalculation.includes(`Option ${trap.optionLetter}`)) {
      errors.push("Distractor analysis omits its displayed option letter.");
    }
    if (!trap.wrongCalculation.includes(trap.displayedValue)) {
      errors.push("Distractor analysis omits its displayed value.");
    }
    if (!/\d/u.test(trap.wrongCalculation)) {
      errors.push("Distractor analysis is not number-specific.");
    }
  }
  if (question.permanentQlId !== null) {
    errors.push("Permanent QL leaked into Wave 05 review.");
  }
  if (
    question.active ||
    question.publiclyPublishable ||
    question.questionStudioDiscoverable ||
    question.questionBankWritable ||
    question.testEligible
  ) {
    errors.push("A Wave 05 product flag became enabled.");
  }
  return { ok: errors.length === 0, errors };
}

export function generateMalCp004Wave05EditorialQuestion(
  effectiveContractId: MalCp004Wave03EffectiveContractId,
  seed = `mal-cp004-wave05:${effectiveContractId}:default`,
): MalCp004Wave05EditorialQuestion {
  const base = generateMalCp004Wave04Question(effectiveContractId, seed);
  const withoutValidation: Omit<
    MalCp004Wave05EditorialQuestion,
    "editorialValidation"
  > = {
    ...base,
    runtimeId: MAL_CP004_WAVE05_RUNTIME_ID,
    baseRuntimeId: MAL_CP004_WAVE04_RUNTIME_ID,
    explanation: {
      layoutId: "MAL-CP004-EN-FOUR-TIER-EDITORIAL-V1",
      coreConceptAndFormula: coreConceptAndFormula(effectiveContractId),
      stepByStepSolution: [...base.explanation.calculation],
      examSpeedShortcut: examSpeedShortcut(base),
      distractorAnalysis: buildDistractorAnalysis(base),
      verification: base.explanation.verification,
      conclusion: base.explanation.conclusion,
    },
    maturity: "ENGLISH_EDITORIAL_REVIEW_CANDIDATE",
    allocationStatus: "UNALLOCATED_EDITORIAL_REVIEW",
    reviewStatus: "READY_FOR_HUMAN_REVIEW",
  };
  return {
    ...withoutValidation,
    editorialValidation: validateEditorialQuestion(withoutValidation),
  };
}

export function malCp004Wave05Stable(
  question: MalCp004Wave05EditorialQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}
