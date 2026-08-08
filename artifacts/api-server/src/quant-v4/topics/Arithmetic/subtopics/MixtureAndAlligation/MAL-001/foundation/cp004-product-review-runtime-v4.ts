import {
  runMalCp004EnglishAlligationV2Pipeline,
  type MalCp004AlligationQuestion,
  type MalCp004AlligationCross,
} from "./cp004-alligation-help-v2";
import {
  serializeMalCp001AlligationVisual,
  type MalCp001AlligationCrossVisual,
} from "./cp001-release-editorial-v2";
import type { MalCp004PermanentQlId } from "./cp004-permanent-runtime";
import {
  MAL_CP004_PRODUCT_REVIEW_REMEDIATION_ID,
  runMalCp004EnglishProductReviewV3Pipeline,
  type MalCp004ProductReviewQuestion,
  type MalCp004ResponsiveAlligationCross,
} from "./cp004-product-review-remediation-v3";
import type { MalCp004Wave04OptionAudit } from "./cp004-unified-runtime-wave04-types";
import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  formatRational,
  multiplyRational,
  rational,
  rationalKey,
  subtractRational,
} from "./rational";
import type { Rational } from "./types";

export const MAL_CP004_PRODUCT_REVIEW_RUNTIME_V4 =
  "MAL-CP004-EN-PRODUCT-REVIEW-RUNTIME-V4" as const;

type BaseQuestion = MalCp004AlligationQuestion;

interface Candidate {
  value: Rational;
  misconceptionId: string;
}

const OVERRIDE_QLS = new Set<MalCp004PermanentQlId>([
  "MAL-QL-038",
  "MAL-QL-039",
  "MAL-QL-041",
  "MAL-QL-042",
]);

function exact(question: BaseQuestion, key: string): Rational {
  const value = question.exactState[key];
  if (!value || typeof value === "string") {
    throw new Error(`${question.questionId}: '${key}' is not an exact rational.`);
  }
  return value;
}

function percentValue(value: Rational): Rational {
  return multiplyRational(value, rational(100));
}

function percentText(value: Rational): string {
  return `${formatRational(percentValue(value))}%`;
}

function optionText(question: BaseQuestion, value: Rational): string {
  return question.answerUnit === "percent"
    ? percentText(value)
    : `${formatRational(value)} ${question.answerUnit}`;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function ql038Candidates(question: BaseQuestion): Candidate[] {
  const total = exact(question, "total");
  const answer = question.answerValue;
  const rate = divideRational(answer, total);
  const printedPercent = percentValue(rate);
  return [
    {
      value: subtractRational(total, answer),
      misconceptionId: "used_complementary_component",
    },
    {
      value: printedPercent,
      misconceptionId: "copied_percentage_as_litres",
    },
    {
      value: subtractRational(total, printedPercent),
      misconceptionId: "subtracted_percentage_number_from_total",
    },
    {
      value: divideRational(answer, rational(100)),
      misconceptionId: "divided_by_100_twice",
    },
    {
      value: multiplyRational(answer, rate),
      misconceptionId: "multiplied_by_component_fraction_twice",
    },
    { value: total, misconceptionId: "reported_total_mixture" },
  ];
}

function ql039Candidates(question: BaseQuestion): Candidate[] {
  const total = exact(question, "total");
  const tracked = exact(question, "trackedAmount");
  const other = exact(question, "otherAmount");
  const halfTracked = divideRational(tracked, rational(2));
  const halfOther = divideRational(other, rational(2));
  return [
    {
      value: divideRational(other, total),
      misconceptionId: "used_complementary_percentage",
    },
    {
      value: divideRational(tracked, other),
      misconceptionId: "divided_by_other_component",
    },
    {
      value: divideRational(tracked, addRational(total, tracked)),
      misconceptionId: "added_component_twice_to_total",
    },
    {
      value: divideRational(tracked, multiplyRational(total, rational(2))),
      misconceptionId: "doubled_total_before_dividing",
    },
    {
      value: divideRational(tracked, subtractRational(total, halfTracked)),
      misconceptionId: "removed_half_component_from_denominator",
    },
    {
      value: divideRational(tracked, addRational(total, halfOther)),
      misconceptionId: "added_half_other_component_to_total",
    },
    {
      value: divideRational(addRational(tracked, halfOther), total),
      misconceptionId: "counted_half_other_component_as_requested_component",
    },
  ];
}

function ql041Candidates(question: BaseQuestion): Candidate[] {
  const initialTotal = exact(question, "initialTotal");
  const finalTotal = exact(question, "finalTotal");
  const initialRate = exact(question, "initialRate");
  const targetRate = exact(question, "targetRate");
  const drop = subtractRational(initialRate, targetRate);
  return [
    { value: finalTotal, misconceptionId: "reported_required_final_total" },
    {
      value: multiplyRational(initialTotal, drop),
      misconceptionId: "treated_percentage_drop_as_quantity",
    },
    {
      value: multiplyRational(initialTotal, targetRate),
      misconceptionId: "used_target_component_quantity",
    },
    {
      value: exact(question, "initialTracked"),
      misconceptionId: "reported_conserved_solute_quantity",
    },
    {
      value: multiplyRational(
        initialTotal,
        divideRational(drop, initialRate),
      ),
      misconceptionId: "divided_percentage_drop_by_initial_rate",
    },
    { value: initialTotal, misconceptionId: "reported_initial_volume" },
  ];
}

function ql042Candidates(question: BaseQuestion): Candidate[] {
  const initialTotal = exact(question, "initialTotal");
  const finalTotal = exact(question, "finalTotal");
  const initialRate = exact(question, "initialRate");
  const targetRate = exact(question, "targetRate");
  const rise = subtractRational(targetRate, initialRate);
  return [
    { value: finalTotal, misconceptionId: "reported_required_final_total" },
    {
      value: multiplyRational(initialTotal, rise),
      misconceptionId: "treated_percentage_rise_as_quantity",
    },
    {
      value: subtractRational(finalTotal, exact(question, "initialTracked")),
      misconceptionId: "subtracted_initial_solute_from_final_total",
    },
    {
      value: exact(question, "initialTracked"),
      misconceptionId: "reported_initial_solute_quantity",
    },
    {
      value: multiplyRational(
        initialTotal,
        divideRational(rise, targetRate),
      ),
      misconceptionId: "used_target_rate_as_denominator",
    },
    { value: initialTotal, misconceptionId: "reported_initial_volume" },
  ];
}

function candidates(question: BaseQuestion): Candidate[] {
  switch (question.permanentQlId) {
    case "MAL-QL-038":
      return ql038Candidates(question);
    case "MAL-QL-039":
      return ql039Candidates(question);
    case "MAL-QL-041":
      return ql041Candidates(question);
    case "MAL-QL-042":
      return ql042Candidates(question);
    default:
      return [];
  }
}

function acceptable(question: BaseQuestion, value: Rational): boolean {
  if (compareRational(value, rational(0)) <= 0) return false;
  if (equalsRational(value, question.answerValue)) return false;
  if (question.answerUnit === "percent") {
    return compareRational(value, rational(1)) < 0;
  }
  if (question.permanentQlId === "MAL-QL-038") {
    return compareRational(value, exact(question, "total")) <= 0;
  }
  return true;
}

function rebuildOptions(
  question: BaseQuestion,
  requestedSeed: string,
): {
  options: string[];
  correctIndex: number;
  optionAudit: MalCp004Wave04OptionAudit[];
} {
  const selected: Candidate[] = [];
  const values = new Set<string>([rationalKey(question.answerValue)]);
  const texts = new Set<string>([question.answer]);
  for (const candidate of candidates(question)) {
    if (!acceptable(question, candidate.value)) continue;
    const key = rationalKey(candidate.value);
    const text = optionText(question, candidate.value);
    if (values.has(key) || texts.has(text)) continue;
    values.add(key);
    texts.add(text);
    selected.push(candidate);
    if (selected.length === 3) break;
  }
  if (selected.length !== 3) {
    throw new Error(
      `${question.questionId}: V4 could not retain three method-derived distractors.`,
    );
  }

  const correctIndex = hash(`${requestedSeed}:mal-cp004-method-options-v4`) % 4;
  const options: string[] = [];
  const optionAudit: MalCp004Wave04OptionAudit[] = [];
  let wrong = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push(question.answer);
      optionAudit.push({
        text: question.answer,
        value: question.answerValue,
        misconceptionId: "correct",
        isCorrect: true,
      });
      continue;
    }
    const entry = selected[wrong++]!;
    const text = optionText(question, entry.value);
    options.push(text);
    optionAudit.push({
      text,
      value: entry.value,
      misconceptionId: entry.misconceptionId,
      isCorrect: false,
    });
  }
  return { options, correctIndex, optionAudit };
}

function crossVisual(
  question: BaseQuestion,
): MalCp001AlligationCrossVisual | undefined {
  if (question.permanentQlId === "MAL-QL-041") {
    const initialTotal = exact(question, "initialTotal");
    const initialRate = exact(question, "initialRate");
    const targetRate = exact(question, "targetRate");
    const waterPart = subtractRational(initialRate, targetRate);
    const originalPart = targetRate;
    return {
      version: 1,
      kind: "cross",
      title: "Alligation Cross — Dilution",
      lower: { label: "Water", value: "0%" },
      higher: {
        label: "Original solution",
        value: percentText(initialRate),
        quantity: `${formatRational(initialTotal)} litres`,
      },
      mean: { label: "Target concentration", value: percentText(targetRate) },
      lowerPart: {
        label: "Water part",
        value: formatRational(percentValue(waterPart)),
        expression: `${formatRational(percentValue(initialRate))} - ${formatRational(percentValue(targetRate))}`,
      },
      higherPart: {
        label: "Original solution part",
        value: formatRational(percentValue(originalPart)),
        expression: `${formatRational(percentValue(targetRate))} - 0`,
      },
    };
  }
  if (question.permanentQlId === "MAL-QL-042") {
    const initialTotal = exact(question, "initialTotal");
    const initialRate = exact(question, "initialRate");
    const targetRate = exact(question, "targetRate");
    const originalPart = subtractRational(rational(1), targetRate);
    const purePart = subtractRational(targetRate, initialRate);
    return {
      version: 1,
      kind: "cross",
      title: "Alligation Cross — Pure Solute Addition",
      lower: {
        label: "Original solution",
        value: percentText(initialRate),
        quantity: `${formatRational(initialTotal)} litres`,
      },
      higher: { label: "Pure solute", value: "100%" },
      mean: { label: "Target concentration", value: percentText(targetRate) },
      lowerPart: {
        label: "Original solution part",
        value: formatRational(percentValue(originalPart)),
        expression: `100 - ${formatRational(percentValue(targetRate))}`,
      },
      higherPart: {
        label: "Pure solute part",
        value: formatRational(percentValue(purePart)),
        expression: `${formatRational(percentValue(targetRate))} - ${formatRational(percentValue(initialRate))}`,
      },
    };
  }
  return undefined;
}

function responsiveAlternative(
  question: BaseQuestion,
): MalCp004ResponsiveAlligationCross | undefined {
  const source = question.explanation.optionalHelp.alternativeMethod;
  if (!source) return undefined;
  const visual = crossVisual(question);
  if (!visual) {
    throw new Error(`${question.questionId}: alligation visual authority is missing.`);
  }
  const visualDirective = serializeMalCp001AlligationVisual(visual);
  return {
    ...(source as MalCp004AlligationCross),
    visual,
    visualDirective,
    renderLines: [
      visualDirective,
      `${source.ratioLabel} = ${source.ratio}`,
      source.calculation,
      source.result,
    ],
  };
}

function select(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): {
  requestedSeed: string;
  selectedSeed: string;
  attempt: number;
  base: BaseQuestion;
} {
  const requestedSeed =
    input.seed ?? `mal-cp004-product-review-v4:${input.questionLanguageId}:default`;
  const attempts = input.questionLanguageId === "MAL-QL-038" ? 64 : 1;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const selectedSeed =
      attempt === 0
        ? requestedSeed
        : `${requestedSeed}:integer-component-answer:${attempt}`;
    const base = runMalCp004EnglishAlligationV2Pipeline({
      questionLanguageId: input.questionLanguageId,
      seed: selectedSeed,
      language: "en",
    });
    if (
      input.questionLanguageId !== "MAL-QL-038" ||
      base.answerValue.denominator === 1n
    ) {
      return { requestedSeed, selectedSeed, attempt, base };
    }
  }
  throw new Error(
    `${input.questionLanguageId}/${requestedSeed}: no integral Easy state was found.`,
  );
}

function overrideQuestion(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp004ProductReviewQuestion {
  const selection = select(input);
  const base = selection.base;
  const rebuilt = rebuildOptions(base, selection.requestedSeed);
  const alternativeMethod = responsiveAlternative(base);

  const question = {
    ...base,
    ...rebuilt,
    allocationStatus: "V2_PRESENTATION_CANDIDATE",
    releaseStatus: "PRESENTATION_CANDIDATE",
    runtimeMode: "REVIEW_ONLY",
    reviewStatus: "PENDING_PRODUCT_REVIEW",
    questionBankStatus: "V1_RELEASE_ONLY",
    testEligibility: "V1_RELEASE_ONLY",
    active: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: true,
    questionBankWritable: false,
    testEligible: false,
    parameters: {
      ...base.parameters,
      requestedSeed: selection.requestedSeed,
      selectedSeed: selection.selectedSeed,
      valueQualitySelectionAttempt: selection.attempt,
      valueQualityPolicy:
        base.permanentQlId === "MAL-QL-038"
          ? "INTEGER_EASY_COMPONENT_ANSWER"
          : "SOURCE_STATE_UNCHANGED",
      productReviewRemediationId: MAL_CP004_PRODUCT_REVIEW_REMEDIATION_ID,
      productReviewRuntimeId: MAL_CP004_PRODUCT_REVIEW_RUNTIME_V4,
    },
    traceability: {
      ...base.traceability,
      releaseId: "MAL-CP004-EN-v2-CANDIDATE",
      sourceReleasedId: "MAL-CP004-EN-v1",
      runtimeMode: "REVIEW_ONLY",
      reviewStatus: "PENDING_PRODUCT_REVIEW",
      questionBankStatus: "V1_RELEASE_ONLY",
      testEligibility: "V1_RELEASE_ONLY",
      publiclyPublishable: false,
      requestedSeed: selection.requestedSeed,
      selectedSeed: selection.selectedSeed,
      productReviewRemediationId: MAL_CP004_PRODUCT_REVIEW_REMEDIATION_ID,
      productReviewRuntimeId: MAL_CP004_PRODUCT_REVIEW_RUNTIME_V4,
    },
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
          name: "PRODUCT_REVIEW_RUNTIME_V4",
          passed: true,
          message:
            "The V4 review runtime preserves lifecycle honesty and hardens edge-state distractor diversity.",
        },
        {
          name: "METHOD_DERIVED_OPTIONS_V4",
          passed: true,
          message:
            "All displayed wrong options are generated from explicit calculation mistakes.",
        },
        {
          name: "SHARED_ALLIGATION_SVG_V4",
          passed: true,
          message:
            "Applicable alligation help uses the shared responsive SVG directive.",
        },
      ],
    },
  } as unknown as MalCp004ProductReviewQuestion;

  if (
    question.options.length !== 4 ||
    new Set(question.options).size !== 4 ||
    question.options[question.correctIndex] !== question.answer
  ) {
    throw new Error(`${question.questionId}: V4 option package is invalid.`);
  }
  if (
    question.permanentQlId === "MAL-QL-038" &&
    question.answerValue.denominator !== 1n
  ) {
    throw new Error(`${question.questionId}: V4 Easy answer is fractional.`);
  }
  const alternative = question.explanation.optionalHelp.alternativeMethod;
  if (alternative && !alternative.visualDirective.startsWith("[[EXAMTREE_ALLIGATION_SVG_V1:")) {
    throw new Error(`${question.questionId}: V4 shared visual directive is invalid.`);
  }
  return question;
}

export function runMalCp004EnglishProductReviewV4Pipeline(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp004ProductReviewQuestion {
  if (OVERRIDE_QLS.has(input.questionLanguageId)) {
    return overrideQuestion(input);
  }
  return runMalCp004EnglishProductReviewV3Pipeline(input);
}

export function malCp004ProductReviewV4Stable(
  question: MalCp004ProductReviewQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}
