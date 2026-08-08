import {
  divideRational,
  equalsRational,
  formatRational,
  multiplyRational,
  rational,
  reduceRationalRatio,
  subtractRational,
} from "./rational";
import {
  runMalCp004EnglishSolutionFirstV2Pipeline,
} from "./cp004-solution-first-grammar-v2";
import type {
  MalCp004ClutterFreeQuestion,
} from "./cp004-clutter-free-editorial-v2";
import type { MalCp004PermanentQlId } from "./cp004-permanent-runtime";
import type { Rational } from "./types";

export const MAL_CP004_ALLIGATION_HELP_ID =
  "MAL-CP004-EN-SELECTIVE-ALLIGATION-CROSS-V2" as const;

export interface MalCp004AlligationCrossRow {
  label: string;
  concentration: string;
  quantityPart: string;
}

export interface MalCp004AlligationCross {
  methodId: typeof MAL_CP004_ALLIGATION_HELP_ID;
  title: "Alternative method: Alligation cross";
  top: MalCp004AlligationCrossRow;
  targetConcentration: string;
  bottom: MalCp004AlligationCrossRow;
  crossLines: [string, string, string];
  ratioLabel: string;
  ratio: string;
  calculation: string;
  result: string;
}

export type MalCp004AlligationQuestion = MalCp004ClutterFreeQuestion & {
  explanation: MalCp004ClutterFreeQuestion["explanation"] & {
    optionalHelp: MalCp004ClutterFreeQuestion["explanation"]["optionalHelp"] & {
      alternativeMethod?: MalCp004AlligationCross;
    };
  };
};

const ALLIGATION_QLS = new Set<MalCp004PermanentQlId>([
  "MAL-QL-041",
  "MAL-QL-042",
]);

function exactRational(
  question: MalCp004ClutterFreeQuestion,
  key: string,
): Rational {
  const value = question.exactState[key];
  if (!value || typeof value === "string") {
    throw new Error(`${question.questionId}: exact state '${key}' is not rational.`);
  }
  return value;
}

function percentage(value: Rational): string {
  return `${formatRational(multiplyRational(value, rational(100)))}%`;
}

function percentagePoints(value: Rational): string {
  return formatRational(multiplyRational(value, rational(100)));
}

function ratioText(first: Rational, second: Rational): string {
  return `${formatRational(first)} : ${formatRational(second)}`;
}

function crossLines(input: {
  top: MalCp004AlligationCrossRow;
  targetConcentration: string;
  bottom: MalCp004AlligationCrossRow;
}): [string, string, string] {
  const topLabel = `${input.top.label} ${input.top.concentration}`.padEnd(31);
  const bottomLabel = `${input.bottom.label} ${input.bottom.concentration}`.padEnd(31);
  return [
    `${topLabel}╲   ╱   ${input.top.quantityPart} parts`,
    `${"Target".padEnd(13)}${input.targetConcentration.padStart(9)}`,
    `${bottomLabel}╱   ╲   ${input.bottom.quantityPart} parts`,
  ];
}

function dilutionAlligation(
  question: MalCp004ClutterFreeQuestion,
): MalCp004AlligationCross {
  const initialTotal = exactRational(question, "initialTotal");
  const initialRate = exactRational(question, "initialRate");
  const targetRate = exactRational(question, "targetRate");
  const waterRate = rational(0);
  const originalPart = subtractRational(targetRate, waterRate);
  const waterPart = subtractRational(initialRate, targetRate);
  const [originalRatio, waterRatio] = reduceRationalRatio(
    originalPart,
    waterPart,
  );
  const computedAnswer = multiplyRational(
    initialTotal,
    divideRational(waterRatio, originalRatio),
  );
  if (!equalsRational(computedAnswer, question.answerValue)) {
    throw new Error(`${question.questionId}: alligation dilution result is not the exact answer.`);
  }

  const top: MalCp004AlligationCrossRow = {
    label: "Original solution",
    concentration: percentage(initialRate),
    quantityPart: percentagePoints(originalPart),
  };
  const bottom: MalCp004AlligationCrossRow = {
    label: "Water",
    concentration: "0%",
    quantityPart: percentagePoints(waterPart),
  };
  const targetConcentration = percentage(targetRate);

  return {
    methodId: MAL_CP004_ALLIGATION_HELP_ID,
    title: "Alternative method: Alligation cross",
    top,
    targetConcentration,
    bottom,
    crossLines: crossLines({ top, targetConcentration, bottom }),
    ratioLabel: "Original solution : water",
    ratio: ratioText(originalRatio, waterRatio),
    calculation: `\\(\\text{Water added}=${formatRational(initialTotal)}\\times\\frac{${formatRational(waterRatio)}}{${formatRational(originalRatio)}}=${formatRational(computedAnswer)}\\) litres.`,
    result: `${question.answer} of water must be added.`,
  };
}

function pureSoluteAlligation(
  question: MalCp004ClutterFreeQuestion,
): MalCp004AlligationCross {
  const initialTotal = exactRational(question, "initialTotal");
  const initialRate = exactRational(question, "initialRate");
  const targetRate = exactRational(question, "targetRate");
  const pureRate = rational(1);
  const pureSolutePart = subtractRational(targetRate, initialRate);
  const originalPart = subtractRational(pureRate, targetRate);
  const [pureSoluteRatio, originalRatio] = reduceRationalRatio(
    pureSolutePart,
    originalPart,
  );
  const computedAnswer = multiplyRational(
    initialTotal,
    divideRational(pureSoluteRatio, originalRatio),
  );
  if (!equalsRational(computedAnswer, question.answerValue)) {
    throw new Error(`${question.questionId}: alligation pure-solute result is not the exact answer.`);
  }

  const top: MalCp004AlligationCrossRow = {
    label: "Pure solute",
    concentration: "100%",
    quantityPart: percentagePoints(pureSolutePart),
  };
  const bottom: MalCp004AlligationCrossRow = {
    label: "Original solution",
    concentration: percentage(initialRate),
    quantityPart: percentagePoints(originalPart),
  };
  const targetConcentration = percentage(targetRate);

  return {
    methodId: MAL_CP004_ALLIGATION_HELP_ID,
    title: "Alternative method: Alligation cross",
    top,
    targetConcentration,
    bottom,
    crossLines: crossLines({ top, targetConcentration, bottom }),
    ratioLabel: "Original solution : pure solute",
    ratio: ratioText(originalRatio, pureSoluteRatio),
    calculation: `\\(\\text{Pure solute added}=${formatRational(initialTotal)}\\times\\frac{${formatRational(pureSoluteRatio)}}{${formatRational(originalRatio)}}=${formatRational(computedAnswer)}\\) litres.`,
    result: `${question.answer} of pure solute must be added.`,
  };
}

function alligationCross(
  question: MalCp004ClutterFreeQuestion,
): MalCp004AlligationCross | undefined {
  if (question.permanentQlId === "MAL-QL-041") {
    return dilutionAlligation(question);
  }
  if (question.permanentQlId === "MAL-QL-042") {
    return pureSoluteAlligation(question);
  }
  return undefined;
}

function assertSelectiveAlligation(question: MalCp004AlligationQuestion): void {
  const alternative = question.explanation.optionalHelp.alternativeMethod;
  const expected = ALLIGATION_QLS.has(question.permanentQlId);
  if (expected !== Boolean(alternative)) {
    throw new Error(`${question.questionId}: selective alligation policy is inconsistent.`);
  }
  if (!alternative) return;
  if (alternative.methodId !== MAL_CP004_ALLIGATION_HELP_ID) {
    throw new Error(`${question.questionId}: wrong alligation method identity.`);
  }
  if (alternative.crossLines.length !== 3) {
    throw new Error(`${question.questionId}: alligation cross is incomplete.`);
  }
  if (!alternative.calculation.includes(formatRational(question.answerValue))) {
    throw new Error(`${question.questionId}: alligation calculation omits the answer.`);
  }
  if (/alligation/iu.test(question.explanation.visibleLines.join("\n"))) {
    throw new Error(`${question.questionId}: optional alligation leaked into the default view.`);
  }
}

export function runMalCp004EnglishAlligationV2Pipeline(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp004AlligationQuestion {
  const base = runMalCp004EnglishSolutionFirstV2Pipeline(input);
  const alternativeMethod = alligationCross(base);
  const question: MalCp004AlligationQuestion = {
    ...base,
    explanation: {
      ...base.explanation,
      optionalHelp: {
        ...base.explanation.optionalHelp,
        ...(alternativeMethod ? { alternativeMethod } : {}),
      },
    },
    validation: {
      ...base.validation,
      checks: [
        ...base.validation.checks,
        {
          name: "SELECTIVE_ALLIGATION_CROSS",
          passed: true,
          message: alternativeMethod
            ? "A mathematically exact alligation cross is available under More help."
            : "Alligation is omitted because it is not a natural method for this question family.",
        },
      ],
    },
  };
  assertSelectiveAlligation(question);
  return question;
}

export function malCp004AlligationStable(
  question: MalCp004AlligationQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}
