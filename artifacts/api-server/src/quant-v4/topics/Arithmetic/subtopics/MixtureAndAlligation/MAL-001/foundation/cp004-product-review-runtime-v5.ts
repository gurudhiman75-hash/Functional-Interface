import {
  runMalCp004EnglishAlligationV2Pipeline,
  type MalCp004AlligationQuestion,
} from "./cp004-alligation-help-v2";
import type { MalCp004PermanentQlId } from "./cp004-permanent-runtime";
import {
  MAL_CP004_PRODUCT_REVIEW_REMEDIATION_ID,
  type MalCp004ProductReviewQuestion,
} from "./cp004-product-review-remediation-v3";
import { runMalCp004EnglishProductReviewV4Pipeline } from "./cp004-product-review-runtime-v4";
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

export const MAL_CP004_PRODUCT_REVIEW_RUNTIME_V5 =
  "MAL-CP004-EN-PRODUCT-REVIEW-RUNTIME-V5" as const;

type BaseQuestion = MalCp004AlligationQuestion;

interface Candidate {
  value: Rational;
  misconceptionId: string;
}

const V5_QLS = new Set<MalCp004PermanentQlId>([
  "MAL-QL-040",
  "MAL-QL-043",
  "MAL-QL-044",
  "MAL-QL-045",
  "MAL-QL-046",
  "MAL-QL-047",
]);

function exact(question: BaseQuestion, key: string): Rational {
  const value = question.exactState[key];
  if (!value || typeof value === "string") {
    throw new Error(`${question.questionId}: '${key}' is not an exact rational.`);
  }
  return value;
}

function exactText(question: BaseQuestion, key: string): string {
  const value = question.exactState[key];
  if (typeof value !== "string") {
    throw new Error(`${question.questionId}: '${key}' is not exact text.`);
  }
  return value;
}

function percentText(value: Rational): string {
  return `${formatRational(multiplyRational(value, rational(100)))}%`;
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

function retainedSourceCandidates(question: BaseQuestion): Candidate[] {
  return question.optionAudit
    .filter(
      (entry) =>
        !entry.isCorrect &&
        !/(?:arithmetic|offset|ten_percent_of_total)/iu.test(
          entry.misconceptionId,
        ),
    )
    .map((entry) => ({
      value: entry.value,
      misconceptionId: entry.misconceptionId,
    }));
}

function ql040Candidates(question: BaseQuestion): Candidate[] {
  const amount = exact(question, "givenAmount");
  const rate = exact(question, "givenRate");
  const otherRate = subtractRational(rational(1), rate);
  return [
    ...retainedSourceCandidates(question),
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
      misconceptionId: "added_known_amount_to_wrong_total",
    },
    { value: amount, misconceptionId: "reported_known_component_quantity" },
    {
      value: multiplyRational(amount, rational(2)),
      misconceptionId: "assumed_known_component_is_half_of_total",
    },
  ];
}

function ql043Candidates(question: BaseQuestion): Candidate[] {
  const initialTotal = exact(question, "initialTotal");
  const finalTotal = exact(question, "finalTotal");
  const evaporated = exact(question, "evaporatedAmount");
  const tracked = exact(question, "initialTracked");
  const initialRate = exact(question, "initialRate");
  const targetRate = exact(question, "targetRate");
  const initialSolvent = subtractRational(initialTotal, tracked);
  const remainingSolvent = subtractRational(initialSolvent, evaporated);
  const rateRise = subtractRational(targetRate, initialRate);
  const common = [
    ...retainedSourceCandidates(question),
    { value: finalTotal, misconceptionId: "reported_final_volume" },
    { value: evaporated, misconceptionId: "reported_evaporated_quantity" },
    { value: tracked, misconceptionId: "reported_solute_quantity" },
    {
      value: initialSolvent,
      misconceptionId: "reported_initial_solvent_quantity",
    },
    {
      value: remainingSolvent,
      misconceptionId: "reported_remaining_solvent_quantity",
    },
    { value: initialTotal, misconceptionId: "reported_initial_volume" },
    {
      value: addRational(finalTotal, tracked),
      misconceptionId: "added_solute_to_final_total",
    },
    {
      value: multiplyRational(initialTotal, rateRise),
      misconceptionId: "treated_concentration_rise_as_evaporation",
    },
    {
      value: multiplyRational(initialTotal, targetRate),
      misconceptionId: "reported_target_solute_quantity",
    },
  ];
  return common;
}

function ql044Candidates(question: BaseQuestion): Candidate[] {
  const initialRate = exact(question, "initialRate");
  const tracked = exact(question, "trackedAmount");
  const finalOther = exact(question, "finalOther");
  const solventChange = exact(question, "solventChange");
  const initialTotal = exact(question, "initialTotal");
  const finalTotal = exact(question, "finalTotal");
  const changeFromInitial = divideRational(solventChange, initialTotal);
  const changeFromFinal = divideRational(solventChange, finalTotal);
  const addedTotal = addRational(initialTotal, solventChange);
  const reducedTotal = subtractRational(initialTotal, solventChange);
  const direction = exactText(question, "direction");
  return [
    ...retainedSourceCandidates(question),
    { value: initialRate, misconceptionId: "kept_concentration_unchanged" },
    {
      value: divideRational(tracked, finalOther),
      misconceptionId: "divided_by_solvent_instead_of_total",
    },
    {
      value:
        direction === "ADD"
          ? subtractRational(initialRate, changeFromInitial)
          : addRational(initialRate, changeFromInitial),
      misconceptionId: "treated_volume_change_as_percentage_points",
    },
    {
      value: divideRational(finalOther, finalTotal),
      misconceptionId: "reported_final_solvent_percentage",
    },
    {
      value: changeFromFinal,
      misconceptionId: "reported_changed_solvent_share",
    },
    {
      value: divideRational(tracked, addedTotal),
      misconceptionId: "always_added_solvent_to_total",
    },
    {
      value: divideRational(tracked, reducedTotal),
      misconceptionId: "always_removed_solvent_from_total",
    },
  ];
}

function ql045Candidates(question: BaseQuestion): Candidate[] {
  const evaporated = exact(question, "evaporated");
  const initialRate = exact(question, "initialRate");
  const targetRate = exact(question, "targetRate");
  const finalTotal = exact(question, "finalTotal");
  const difference = subtractRational(targetRate, initialRate);
  return [
    ...retainedSourceCandidates(question),
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
      value: divideRational(evaporated, difference),
      misconceptionId: "omitted_final_rate_from_numerator",
    },
    { value: evaporated, misconceptionId: "reported_evaporated_quantity" },
    {
      value: divideRational(
        multiplyRational(initialRate, evaporated),
        difference,
      ),
      misconceptionId: "used_initial_rate_in_numerator",
    },
    {
      value: divideRational(
        multiplyRational(
          subtractRational(rational(1), targetRate),
          evaporated,
        ),
        difference,
      ),
      misconceptionId: "used_final_solvent_rate_in_numerator",
    },
  ];
}

function ql046Candidates(question: BaseQuestion): Candidate[] {
  const initialMass = exact(question, "initialMass");
  const dryMatter = exact(question, "dryMatter");
  const finalMass = exact(question, "finalMass");
  const finalMoisture = exact(question, "finalMoistureAmount");
  const initialMoisture = exact(question, "initialMoistureAmount");
  return [
    ...retainedSourceCandidates(question),
    { value: initialMass, misconceptionId: "reported_initial_mass" },
    { value: finalMass, misconceptionId: "reported_final_mass" },
    { value: dryMatter, misconceptionId: "reported_dry_matter" },
    {
      value: initialMoisture,
      misconceptionId: "reported_initial_moisture_quantity",
    },
    {
      value: finalMoisture,
      misconceptionId: "reported_final_moisture_quantity",
    },
    {
      value: subtractRational(initialMass, finalMoisture),
      misconceptionId: "subtracted_final_moisture_from_initial_mass",
    },
    {
      value: subtractRational(finalMass, finalMoisture),
      misconceptionId: "subtracted_final_moisture_from_final_mass",
    },
  ];
}

function ql047Candidates(question: BaseQuestion): Candidate[] {
  const finalMass = exact(question, "finalMass");
  const dryMatter = exact(question, "dryMatter");
  const initialMoisture = exact(question, "initialMoisture");
  const finalMoisture = exact(question, "finalMoisture");
  const initialDry = subtractRational(rational(1), initialMoisture);
  const finalDry = subtractRational(rational(1), finalMoisture);
  return [
    ...retainedSourceCandidates(question),
    { value: finalMass, misconceptionId: "reported_final_mass" },
    { value: dryMatter, misconceptionId: "reported_dry_matter" },
    {
      value: multiplyRational(finalMass, initialDry),
      misconceptionId: "multiplied_by_initial_dry_fraction",
    },
    {
      value: divideRational(finalMass, initialDry),
      misconceptionId: "divided_final_mass_by_initial_dry_fraction",
    },
    {
      value: multiplyRational(finalMass, initialMoisture),
      misconceptionId: "reported_initial_moisture_share_of_final_mass",
    },
    {
      value: divideRational(dryMatter, finalDry),
      misconceptionId: "reconstructed_final_mass_instead_of_initial_mass",
    },
    {
      value: divideRational(finalMass, finalDry),
      misconceptionId: "divided_final_mass_by_final_dry_fraction",
    },
  ];
}

function candidates(question: BaseQuestion): Candidate[] {
  switch (question.permanentQlId) {
    case "MAL-QL-040":
      return ql040Candidates(question);
    case "MAL-QL-043":
      return ql043Candidates(question);
    case "MAL-QL-044":
      return ql044Candidates(question);
    case "MAL-QL-045":
      return ql045Candidates(question);
    case "MAL-QL-046":
      return ql046Candidates(question);
    case "MAL-QL-047":
      return ql047Candidates(question);
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
  if (question.permanentQlId === "MAL-QL-040") {
    return compareRational(value, exact(question, "givenAmount")) >= 0;
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
      `${question.questionId}: V5 could not retain three method-derived distractors.`,
    );
  }

  const correctIndex = hash(`${requestedSeed}:mal-cp004-method-options-v5`) % 4;
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

function buildV5(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp004ProductReviewQuestion {
  const requestedSeed =
    input.seed ?? `mal-cp004-product-review-v5:${input.questionLanguageId}:default`;
  const base = runMalCp004EnglishAlligationV2Pipeline({
    questionLanguageId: input.questionLanguageId,
    seed: requestedSeed,
    language: "en",
  });
  const options = rebuildOptions(base, requestedSeed);

  const question = {
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
      requestedSeed,
      selectedSeed: requestedSeed,
      valueQualitySelectionAttempt: 0,
      valueQualityPolicy: "SOURCE_STATE_UNCHANGED",
      productReviewRemediationId: MAL_CP004_PRODUCT_REVIEW_REMEDIATION_ID,
      productReviewRuntimeId: MAL_CP004_PRODUCT_REVIEW_RUNTIME_V5,
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
      requestedSeed,
      selectedSeed: requestedSeed,
      productReviewRemediationId: MAL_CP004_PRODUCT_REVIEW_REMEDIATION_ID,
      productReviewRuntimeId: MAL_CP004_PRODUCT_REVIEW_RUNTIME_V5,
    },
    validation: {
      ...base.validation,
      checks: [
        ...base.validation.checks,
        {
          name: "PRODUCT_REVIEW_RUNTIME_V5",
          passed: true,
          message:
            "The V5 runtime closes all remaining option-coincidence edge states with explicit wrong methods.",
        },
        {
          name: "NO_ARBITRARY_DISTRACTOR_FALLBACK",
          passed: true,
          message:
            "The displayed option set is built without arithmetic-offset fallback values.",
        },
      ],
    },
  } as unknown as MalCp004ProductReviewQuestion;

  if (
    question.options.length !== 4 ||
    new Set(question.options).size !== 4 ||
    question.options[question.correctIndex] !== question.answer
  ) {
    throw new Error(`${question.questionId}: V5 option package is invalid.`);
  }
  if (question.explanation.optionalHelp.alternativeMethod) {
    throw new Error(`${question.questionId}: V5 intercepted an alligation-owned QL.`);
  }
  return question;
}

export function runMalCp004EnglishProductReviewV5Pipeline(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp004ProductReviewQuestion {
  if (V5_QLS.has(input.questionLanguageId)) return buildV5(input);
  return runMalCp004EnglishProductReviewV4Pipeline(input);
}

export function malCp004ProductReviewV5Stable(
  question: MalCp004ProductReviewQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}
