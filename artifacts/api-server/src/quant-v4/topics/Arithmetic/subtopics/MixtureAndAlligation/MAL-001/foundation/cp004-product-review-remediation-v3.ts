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
  reduceRationalRatio,
  subtractRational,
} from "./rational";
import type { Rational } from "./types";

export const MAL_CP004_PRODUCT_REVIEW_REMEDIATION_ID =
  "MAL-CP004-EN-PRODUCT-REVIEW-REMEDIATION-V3" as const;

export const MAL_CP004_PRODUCT_REVIEW_CANDIDATE = Object.freeze({
  candidateId: "MAL-CP004-EN-v2" as const,
  sourceReleasedId: "MAL-CP004-EN-v1" as const,
  presentationStatus: "CANDIDATE" as const,
  presentationReviewStatus: "PENDING_PRODUCT_REVIEW" as const,
  presentationRuntimeMode: "REVIEW_ONLY" as const,
  coreMathematicalReleaseStatus: "RELEASED" as const,
  questionStudioPreview: true,
  questionBankWritableByCandidate: false,
  testEligibleByCandidate: false,
  publiclyPublishableByCandidate: false,
  remediationId: MAL_CP004_PRODUCT_REVIEW_REMEDIATION_ID,
});

type BaseQuestion = MalCp004AlligationQuestion;
type BaseExplanation = BaseQuestion["explanation"];
type BaseOptionalHelp = BaseExplanation["optionalHelp"];
type BaseTraceability = BaseQuestion["traceability"];
type BaseParameters = BaseQuestion["parameters"];

type CandidateLifecycleKey =
  | "allocationStatus"
  | "releaseStatus"
  | "runtimeMode"
  | "reviewStatus"
  | "questionBankStatus"
  | "testEligibility"
  | "active"
  | "publiclyPublishable"
  | "questionStudioDiscoverable"
  | "questionBankWritable"
  | "testEligible"
  | "options"
  | "correctIndex"
  | "optionAudit"
  | "parameters"
  | "traceability"
  | "explanation";

export interface MalCp004ResponsiveAlligationCross
  extends MalCp004AlligationCross {
  visual: MalCp001AlligationCrossVisual;
  visualDirective: string;
  renderLines: string[];
}

export type MalCp004ProductReviewQuestion = Omit<
  BaseQuestion,
  CandidateLifecycleKey
> & {
  allocationStatus: "V2_PRESENTATION_CANDIDATE";
  releaseStatus: "PRESENTATION_CANDIDATE";
  runtimeMode: "REVIEW_ONLY";
  reviewStatus: "PENDING_PRODUCT_REVIEW";
  questionBankStatus: "V1_RELEASE_ONLY";
  testEligibility: "V1_RELEASE_ONLY";
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: true;
  questionBankWritable: false;
  testEligible: false;
  options: string[];
  correctIndex: number;
  optionAudit: MalCp004Wave04OptionAudit[];
  parameters: BaseParameters & {
    requestedSeed: string;
    selectedSeed: string;
    valueQualitySelectionAttempt: number;
    valueQualityPolicy: "INTEGER_EASY_COMPONENT_ANSWER" | "SOURCE_STATE_UNCHANGED";
    productReviewRemediationId: typeof MAL_CP004_PRODUCT_REVIEW_REMEDIATION_ID;
  };
  traceability: Omit<
    BaseTraceability,
    | "releaseId"
    | "runtimeMode"
    | "reviewStatus"
    | "questionBankStatus"
    | "testEligibility"
    | "publiclyPublishable"
  > & {
    releaseId: "MAL-CP004-EN-v2-CANDIDATE";
    sourceReleasedId: "MAL-CP004-EN-v1";
    runtimeMode: "REVIEW_ONLY";
    reviewStatus: "PENDING_PRODUCT_REVIEW";
    questionBankStatus: "V1_RELEASE_ONLY";
    testEligibility: "V1_RELEASE_ONLY";
    publiclyPublishable: false;
    requestedSeed: string;
    selectedSeed: string;
    productReviewRemediationId: typeof MAL_CP004_PRODUCT_REVIEW_REMEDIATION_ID;
  };
  explanation: Omit<BaseExplanation, "optionalHelp"> & {
    optionalHelp: Omit<BaseOptionalHelp, "alternativeMethod"> & {
      alternativeMethod?: MalCp004ResponsiveAlligationCross;
    };
  };
};

interface DistractorCandidate {
  value: Rational;
  misconceptionId: string;
}

function exactRational(question: BaseQuestion, key: string): Rational {
  const value = question.exactState[key];
  if (!value || typeof value === "string") {
    throw new Error(`${question.questionId}: exact state '${key}' is not rational.`);
  }
  return value;
}

function exactString(question: BaseQuestion, key: string): string {
  const value = question.exactState[key];
  if (typeof value !== "string") {
    throw new Error(`${question.questionId}: exact state '${key}' is not text.`);
  }
  return value;
}

function percentagePoints(value: Rational): Rational {
  return multiplyRational(value, rational(100));
}

function percentageText(value: Rational): string {
  return `${formatRational(percentagePoints(value))}%`;
}

function quantityText(
  question: BaseQuestion,
  value: Rational,
): string {
  return question.answerUnit === "percent"
    ? percentageText(value)
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

function ql038Candidates(question: BaseQuestion): DistractorCandidate[] {
  const total = exactRational(question, "total");
  const answer = question.answerValue;
  const requestedRate = divideRational(answer, total);
  const printedPercentage = percentagePoints(requestedRate);
  return [
    {
      value: subtractRational(total, answer),
      misconceptionId: "used_complementary_component",
    },
    {
      value: printedPercentage,
      misconceptionId: "copied_percentage_as_litres",
    },
    {
      value: subtractRational(total, printedPercentage),
      misconceptionId: "subtracted_percentage_number_from_total",
    },
    {
      value: divideRational(answer, rational(100)),
      misconceptionId: "divided_by_100_twice",
    },
    {
      value: multiplyRational(answer, requestedRate),
      misconceptionId: "multiplied_by_component_fraction_twice",
    },
    {
      value: total,
      misconceptionId: "reported_total_mixture",
    },
  ];
}

function methodCandidates(question: BaseQuestion): DistractorCandidate[] {
  switch (question.permanentQlId) {
    case "MAL-QL-038":
      return ql038Candidates(question);
    case "MAL-QL-039": {
      const total = exactRational(question, "total");
      const tracked = exactRational(question, "trackedAmount");
      const other = exactRational(question, "otherAmount");
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
          value: divideRational(tracked, addRational(total, other)),
          misconceptionId: "added_other_component_twice_to_total",
        },
        {
          value: divideRational(other, addRational(total, tracked)),
          misconceptionId: "used_other_component_and_inflated_total",
        },
      ];
    }
    case "MAL-QL-040": {
      const amount = exactRational(question, "givenAmount");
      const rate = exactRational(question, "givenRate");
      const otherRate = subtractRational(rational(1), rate);
      return [
        {
          value: multiplyRational(amount, rate),
          misconceptionId: "multiplied_instead_of_dividing",
        },
        {
          value: divideRational(amount, otherRate),
          misconceptionId: "used_other_component_fraction",
        },
        {
          value: addRational(amount, multiplyRational(amount, rate)),
          misconceptionId: "added_percentage_to_known_amount",
        },
        {
          value: addRational(amount, divideRational(amount, otherRate)),
          misconceptionId: "added_component_to_wrong_reconstructed_total",
        },
        {
          value: amount,
          misconceptionId: "reported_known_component_quantity",
        },
      ];
    }
    case "MAL-QL-041": {
      const initialTotal = exactRational(question, "initialTotal");
      const finalTotal = exactRational(question, "finalTotal");
      const initialRate = exactRational(question, "initialRate");
      const targetRate = exactRational(question, "targetRate");
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
          value: exactRational(question, "initialTracked"),
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
    case "MAL-QL-042": {
      const initialTotal = exactRational(question, "initialTotal");
      const finalTotal = exactRational(question, "finalTotal");
      const initialRate = exactRational(question, "initialRate");
      const targetRate = exactRational(question, "targetRate");
      const rise = subtractRational(targetRate, initialRate);
      return [
        { value: finalTotal, misconceptionId: "reported_required_final_total" },
        {
          value: multiplyRational(initialTotal, rise),
          misconceptionId: "treated_percentage_rise_as_quantity",
        },
        {
          value: subtractRational(
            finalTotal,
            exactRational(question, "initialTracked"),
          ),
          misconceptionId: "subtracted_initial_solute_from_final_total",
        },
        {
          value: exactRational(question, "initialTracked"),
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
    case "MAL-QL-043": {
      const initialTotal = exactRational(question, "initialTotal");
      const finalTotal = exactRational(question, "finalTotal");
      const evaporated = exactRational(question, "evaporatedAmount");
      const tracked = exactRational(question, "initialTracked");
      const initialSolvent = subtractRational(initialTotal, tracked);
      return question.representationVariant === "EVAPORATED_AMOUNT"
        ? [
            { value: finalTotal, misconceptionId: "reported_final_volume" },
            { value: tracked, misconceptionId: "reported_solute_quantity" },
            {
              value: initialSolvent,
              misconceptionId: "reported_initial_solvent_quantity",
            },
            { value: initialTotal, misconceptionId: "reported_initial_volume" },
            {
              value: subtractRational(initialSolvent, evaporated),
              misconceptionId: "reported_remaining_solvent_quantity",
            },
          ]
        : [
            {
              value: evaporated,
              misconceptionId: "reported_evaporated_quantity",
            },
            { value: initialTotal, misconceptionId: "kept_total_unchanged" },
            { value: tracked, misconceptionId: "reported_solute_quantity" },
            {
              value: initialSolvent,
              misconceptionId: "reported_initial_solvent_quantity",
            },
            {
              value: subtractRational(initialSolvent, evaporated),
              misconceptionId: "reported_remaining_solvent_quantity",
            },
          ];
    }
    case "MAL-QL-044": {
      const initialRate = exactRational(question, "initialRate");
      const tracked = exactRational(question, "trackedAmount");
      const finalOther = exactRational(question, "finalOther");
      const finalTotal = exactRational(question, "finalTotal");
      const solventChange = exactRational(question, "solventChange");
      const initialTotal = exactRational(question, "initialTotal");
      const changeRate = divideRational(solventChange, initialTotal);
      return [
        { value: initialRate, misconceptionId: "kept_concentration_unchanged" },
        {
          value: divideRational(tracked, finalOther),
          misconceptionId: "divided_by_solvent_instead_of_total",
        },
        {
          value:
            exactString(question, "direction") === "ADD"
              ? subtractRational(initialRate, changeRate)
              : addRational(initialRate, changeRate),
          misconceptionId: "treated_volume_change_as_percentage_points",
        },
        {
          value: divideRational(finalOther, finalTotal),
          misconceptionId: "reported_final_solvent_percentage",
        },
        {
          value: divideRational(solventChange, finalTotal),
          misconceptionId: "reported_changed_solvent_share",
        },
      ];
    }
    case "MAL-QL-045": {
      const evaporated = exactRational(question, "evaporated");
      const initialRate = exactRational(question, "initialRate");
      const targetRate = exactRational(question, "targetRate");
      const finalTotal = exactRational(question, "finalTotal");
      return [
        { value: finalTotal, misconceptionId: "reported_final_volume" },
        {
          value: divideRational(evaporated, targetRate),
          misconceptionId: "divided_evaporation_by_final_rate",
        },
        {
          value: divideRational(evaporated, initialRate),
          misconceptionId: "divided_evaporation_by_initial_rate",
        },
        {
          value: divideRational(
            evaporated,
            subtractRational(targetRate, initialRate),
          ),
          misconceptionId: "omitted_final_rate_from_numerator",
        },
        { value: evaporated, misconceptionId: "reported_evaporated_quantity" },
      ];
    }
    case "MAL-QL-046": {
      const initialMass = exactRational(question, "initialMass");
      const dryMatter = exactRational(question, "dryMatter");
      const finalMass = exactRational(question, "finalMass");
      const finalMoistureAmount = exactRational(
        question,
        "finalMoistureAmount",
      );
      const initialMoistureAmount = exactRational(
        question,
        "initialMoistureAmount",
      );
      return question.representationVariant === "MOISTURE_LOST"
        ? [
            {
              value: initialMoistureAmount,
              misconceptionId: "assumed_all_initial_moisture_was_lost",
            },
            {
              value: finalMoistureAmount,
              misconceptionId: "reported_remaining_moisture",
            },
            { value: finalMass, misconceptionId: "reported_final_mass" },
            { value: dryMatter, misconceptionId: "reported_dry_matter" },
            { value: initialMass, misconceptionId: "reported_initial_mass" },
          ]
        : [
            { value: initialMass, misconceptionId: "kept_mass_unchanged" },
            { value: dryMatter, misconceptionId: "reported_dry_matter" },
            {
              value: subtractRational(initialMass, finalMoistureAmount),
              misconceptionId: "subtracted_final_moisture_from_initial_mass",
            },
            {
              value: initialMoistureAmount,
              misconceptionId: "reported_initial_moisture_quantity",
            },
            {
              value: finalMoistureAmount,
              misconceptionId: "reported_final_moisture_quantity",
            },
          ];
    }
    case "MAL-QL-047": {
      const finalMass = exactRational(question, "finalMass");
      const dryMatter = exactRational(question, "dryMatter");
      const initialMoisture = exactRational(question, "initialMoisture");
      return [
        { value: finalMass, misconceptionId: "reported_final_mass" },
        { value: dryMatter, misconceptionId: "reported_dry_matter" },
        {
          value: multiplyRational(
            finalMass,
            subtractRational(rational(1), initialMoisture),
          ),
          misconceptionId: "multiplied_by_initial_dry_fraction",
        },
        {
          value: divideRational(
            finalMass,
            subtractRational(rational(1), initialMoisture),
          ),
          misconceptionId: "divided_final_mass_by_initial_dry_fraction",
        },
        {
          value: multiplyRational(finalMass, initialMoisture),
          misconceptionId: "reported_initial_moisture_share_of_final_mass",
        },
      ];
    }
  }
}

function acceptableDistractor(question: BaseQuestion, value: Rational): boolean {
  if (compareRational(value, rational(0)) <= 0) return false;
  if (equalsRational(value, question.answerValue)) return false;
  if (question.answerUnit === "percent") {
    return compareRational(value, rational(1)) < 0;
  }
  if (question.permanentQlId === "MAL-QL-038") {
    return compareRational(value, exactRational(question, "total")) <= 0;
  }
  if (question.permanentQlId === "MAL-QL-040") {
    return compareRational(value, exactRational(question, "givenAmount")) >= 0;
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
  const selected: DistractorCandidate[] = [];
  const seenValues = new Set<string>([rationalKey(question.answerValue)]);
  const seenText = new Set<string>([question.answer]);

  for (const candidate of methodCandidates(question)) {
    if (!acceptableDistractor(question, candidate.value)) continue;
    const valueKey = rationalKey(candidate.value);
    const text = quantityText(question, candidate.value);
    if (seenValues.has(valueKey) || seenText.has(text)) continue;
    seenValues.add(valueKey);
    seenText.add(text);
    selected.push(candidate);
    if (selected.length === 3) break;
  }

  if (selected.length !== 3) {
    throw new Error(
      `${question.questionId}: fewer than three method-derived distractors survived.`,
    );
  }

  const correctIndex = hash(`${requestedSeed}:mal-cp004-method-options-v3`) % 4;
  const options: string[] = [];
  const optionAudit: MalCp004Wave04OptionAudit[] = [];
  let wrongIndex = 0;
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
    const distractor = selected[wrongIndex++]!;
    const text = quantityText(question, distractor.value);
    options.push(text);
    optionAudit.push({
      text,
      value: distractor.value,
      misconceptionId: distractor.misconceptionId,
      isCorrect: false,
    });
  }
  return { options, correctIndex, optionAudit };
}

function visualForAlligation(
  question: BaseQuestion,
): MalCp001AlligationCrossVisual | undefined {
  if (question.permanentQlId === "MAL-QL-041") {
    const initialTotal = exactRational(question, "initialTotal");
    const initialRate = exactRational(question, "initialRate");
    const targetRate = exactRational(question, "targetRate");
    const waterRate = rational(0);
    const waterDifference = subtractRational(initialRate, targetRate);
    const originalDifference = subtractRational(targetRate, waterRate);
    return {
      version: 1,
      kind: "cross",
      title: "Alligation Cross — Dilution",
      lower: { label: "Water", value: "0%" },
      higher: {
        label: "Original solution",
        value: percentageText(initialRate),
        quantity: `${formatRational(initialTotal)} litres`,
      },
      mean: { label: "Target concentration", value: percentageText(targetRate) },
      lowerPart: {
        label: "Water part",
        value: formatRational(percentagePoints(waterDifference)),
        expression: `${formatRational(percentagePoints(initialRate))} - ${formatRational(percentagePoints(targetRate))}`,
      },
      higherPart: {
        label: "Original solution part",
        value: formatRational(percentagePoints(originalDifference)),
        expression: `${formatRational(percentagePoints(targetRate))} - 0`,
      },
    };
  }
  if (question.permanentQlId === "MAL-QL-042") {
    const initialTotal = exactRational(question, "initialTotal");
    const initialRate = exactRational(question, "initialRate");
    const targetRate = exactRational(question, "targetRate");
    const pureRate = rational(1);
    const originalDifference = subtractRational(pureRate, targetRate);
    const pureDifference = subtractRational(targetRate, initialRate);
    return {
      version: 1,
      kind: "cross",
      title: "Alligation Cross — Pure Solute Addition",
      lower: {
        label: "Original solution",
        value: percentageText(initialRate),
        quantity: `${formatRational(initialTotal)} litres`,
      },
      higher: { label: "Pure solute", value: "100%" },
      mean: { label: "Target concentration", value: percentageText(targetRate) },
      lowerPart: {
        label: "Original solution part",
        value: formatRational(percentagePoints(originalDifference)),
        expression: `100 - ${formatRational(percentagePoints(targetRate))}`,
      },
      higherPart: {
        label: "Pure solute part",
        value: formatRational(percentagePoints(pureDifference)),
        expression: `${formatRational(percentagePoints(targetRate))} - ${formatRational(percentagePoints(initialRate))}`,
      },
    };
  }
  return undefined;
}

function responsiveAlternative(
  question: BaseQuestion,
): MalCp004ResponsiveAlligationCross | undefined {
  const alternative = question.explanation.optionalHelp.alternativeMethod;
  if (!alternative) return undefined;
  const visual = visualForAlligation(question);
  if (!visual) {
    throw new Error(`${question.questionId}: alligation help has no responsive visual.`);
  }
  const visualDirective = serializeMalCp001AlligationVisual(visual);
  return {
    ...alternative,
    visual,
    visualDirective,
    renderLines: [
      visualDirective,
      `${alternative.ratioLabel} = ${alternative.ratio}`,
      alternative.calculation,
      alternative.result,
    ],
  };
}

function selectSourceQuestion(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): {
  requestedSeed: string;
  selectedSeed: string;
  attempt: number;
  question: BaseQuestion;
} {
  const requestedSeed =
    input.seed ?? `mal-cp004-product-review:${input.questionLanguageId}:default`;
  const maximumAttempts = input.questionLanguageId === "MAL-QL-038" ? 64 : 1;

  for (let attempt = 0; attempt < maximumAttempts; attempt += 1) {
    const selectedSeed =
      attempt === 0
        ? requestedSeed
        : `${requestedSeed}:integer-component-answer:${attempt}`;
    const question = runMalCp004EnglishAlligationV2Pipeline({
      questionLanguageId: input.questionLanguageId,
      seed: selectedSeed,
      language: "en",
    });
    if (
      input.questionLanguageId !== "MAL-QL-038" ||
      question.answerValue.denominator === 1n
    ) {
      return { requestedSeed, selectedSeed, attempt, question };
    }
  }

  throw new Error(
    `${input.questionLanguageId}/${requestedSeed}: could not select an integer-answer Easy state.`,
  );
}

function assertProductReviewQuestion(
  question: MalCp004ProductReviewQuestion,
): void {
  const prefix = `${question.permanentQlId}/${question.parameters.requestedSeed}`;
  if (
    question.releaseStatus !== "PRESENTATION_CANDIDATE" ||
    question.runtimeMode !== "REVIEW_ONLY" ||
    question.reviewStatus !== "PENDING_PRODUCT_REVIEW"
  ) {
    throw new Error(`${prefix}: V2 presentation lifecycle is not review-only.`);
  }
  if (
    question.active ||
    question.publiclyPublishable ||
    question.questionBankWritable ||
    question.testEligible
  ) {
    throw new Error(`${prefix}: candidate presentation claims a delivery permission.`);
  }
  if (!question.questionStudioDiscoverable) {
    throw new Error(`${prefix}: candidate is unavailable for Question Studio review.`);
  }
  if (
    question.options.length !== 4 ||
    new Set(question.options).size !== 4 ||
    question.options[question.correctIndex] !== question.answer
  ) {
    throw new Error(`${prefix}: option reconstruction is invalid.`);
  }
  for (const option of question.optionAudit) {
    if (!option.isCorrect && /(?:arithmetic|offset|ten_percent_of_total)/iu.test(option.misconceptionId)) {
      throw new Error(`${prefix}: arbitrary-offset distractor remains.`);
    }
  }
  if (
    question.permanentQlId === "MAL-QL-038" &&
    question.answerValue.denominator !== 1n
  ) {
    throw new Error(`${prefix}: Easy component answer is not integral.`);
  }
  const alternative = question.explanation.optionalHelp.alternativeMethod;
  const applicable =
    question.permanentQlId === "MAL-QL-041" ||
    question.permanentQlId === "MAL-QL-042";
  if (applicable !== Boolean(alternative)) {
    throw new Error(`${prefix}: selective alligation policy changed.`);
  }
  if (alternative) {
    if (!alternative.visualDirective.startsWith("[[EXAMTREE_ALLIGATION_SVG_V1:")) {
      throw new Error(`${prefix}: shared alligation SVG directive is missing.`);
    }
    if (alternative.renderLines[0] !== alternative.visualDirective) {
      throw new Error(`${prefix}: visual directive is not first in optional rendering.`);
    }
    const [firstPart, secondPart] = reduceRationalRatio(
      rational(BigInt(alternative.top.quantityPart.replace(/\s+/gu, ""))),
      rational(BigInt(alternative.bottom.quantityPart.replace(/\s+/gu, ""))),
    );
    if (!firstPart || !secondPart) {
      throw new Error(`${prefix}: alligation ratio is invalid.`);
    }
  }
}

export function runMalCp004EnglishProductReviewV3Pipeline(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp004ProductReviewQuestion {
  const selection = selectSourceQuestion(input);
  const base = selection.question;
  const options = rebuildOptions(base, selection.requestedSeed);
  const alternativeMethod = responsiveAlternative(base);

  const question: MalCp004ProductReviewQuestion = {
    ...base,
    ...options,
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
          name: "PRESENTATION_LIFECYCLE_HONESTY",
          passed: true,
          message:
            "The V1 mathematical release remains released; the V2 presentation remains review-only pending product approval.",
        },
        {
          name: "METHOD_DERIVED_DISTRACTORS_ONLY",
          passed: true,
          message:
            "Every displayed wrong option comes from a named calculation error; arbitrary offsets are forbidden.",
        },
        {
          name: "QL038_INTEGER_EASY_ANSWER_POLICY",
          passed: true,
          message:
            "MAL-QL-038 deterministically selects an exam-friendly state with an integral component answer.",
        },
        {
          name: "SHARED_RESPONSIVE_ALLIGATION_SVG",
          passed: true,
          message:
            "Applicable optional alligation help uses the shared EXAMTREE_ALLIGATION_SVG_V1 renderer directive.",
        },
      ],
    },
  };

  assertProductReviewQuestion(question);
  return question;
}

export function malCp004ProductReviewStable(
  question: MalCp004ProductReviewQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}
