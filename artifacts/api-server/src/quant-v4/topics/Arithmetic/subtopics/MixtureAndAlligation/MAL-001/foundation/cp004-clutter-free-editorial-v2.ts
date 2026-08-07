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
  toLatex,
} from "./rational";
import {
  MAL_CP004_ENGLISH_RELEASE,
  MAL_CP004_PERMANENT_ALLOCATION,
  MAL_CP004_PERMANENT_RUNTIME_ID,
  runMalCp004EnglishReleasePipeline as runMalCp004EnglishReleasePipelineV1,
  type MalCp004PermanentQlId,
  type MalCp004ReleasedQuestion,
} from "./cp004-permanent-runtime";
import type { MalCp004Wave04OptionAudit } from "./cp004-unified-runtime-wave04-types";
import type { MalReasoningGraph, Rational } from "./types";

export const MAL_CP004_CLUTTER_FREE_PRESENTATION_ID =
  "MAL-CP004-EN-SOLUTION-FIRST-PRESENTATION-V2" as const;

export const MAL_CP004_CLUTTER_FREE_RUNTIME_ID =
  MAL_CP004_PERMANENT_RUNTIME_ID;

export const MAL_CP004_CLUTTER_FREE_PRESENTATION_RUNTIME_ID =
  "MAL-CP004-EN-PRESENTATION-RUNTIME-V2" as const;

export const MAL_CP004_ENGLISH_RELEASE_V2 = Object.freeze({
  ...MAL_CP004_ENGLISH_RELEASE,
  releaseId: "MAL-CP004-EN-v2" as const,
  runtimeId: MAL_CP004_PERMANENT_RUNTIME_ID,
  presentationRuntimeId: MAL_CP004_CLUTTER_FREE_PRESENTATION_RUNTIME_ID,
  sourcePermanentRuntimeId: MAL_CP004_PERMANENT_RUNTIME_ID,
  editorialStatus: "SOLUTION_FIRST_REMEDIATION_REVIEW_CANDIDATE" as const,
  reviewMethod:
    "EDITORIAL_OVERLAY_WITH_EXACT_MATHEMATICAL_ANSWER_AND_LIFECYCLE_PARITY" as const,
  approvalNote:
    "V2 keeps MAL-QL-038..047, exact mathematics, answers and release permissions unchanged while improving stems, distractors and the learner-facing solution. Human review is required before merge.",
});

const SECTION_TITLES = {
  solution: "Solution",
  answer: "Answer",
  moreHelp: "More help",
} as const;

export interface MalCp004ClutterFreeOptionalHelp {
  collapsedByDefault: true;
  commonMistake?: string;
  verification?: string;
}

export interface MalCp004ClutterFreeExplanation {
  layoutId: "MAL-CP004-EN-SOLUTION-FIRST-V2";
  sectionTitles: typeof SECTION_TITLES;
  solution: string[];
  answer: string;
  visibleLines: string[];
  lines: string[];
  optionalHelp: MalCp004ClutterFreeOptionalHelp;
}

type BaseTraceability = MalCp004ReleasedQuestion["traceability"];
type BaseValidation = MalCp004ReleasedQuestion["validation"];

export type MalCp004ClutterFreeQuestion = Omit<
  MalCp004ReleasedQuestion,
  | "stem"
  | "options"
  | "correctIndex"
  | "optionAudit"
  | "explanationId"
  | "explanation"
  | "reasoningGraph"
  | "allocationStatus"
  | "parameters"
  | "validation"
  | "traceability"
> & {
  stem: string;
  options: string[];
  correctIndex: number;
  optionAudit: MalCp004Wave04OptionAudit[];
  presentationRuntimeId: typeof MAL_CP004_CLUTTER_FREE_PRESENTATION_RUNTIME_ID;
  sourcePermanentRuntimeId: typeof MAL_CP004_PERMANENT_RUNTIME_ID;
  explanationId: string;
  explanation: MalCp004ClutterFreeExplanation;
  reasoningGraph: MalReasoningGraph;
  allocationStatus: "RELEASED_ENGLISH_V2";
  parameters: MalCp004ReleasedQuestion["parameters"] & {
    editorialPresentationVersion: typeof MAL_CP004_CLUTTER_FREE_PRESENTATION_ID;
  };
  validation: BaseValidation;
  traceability: Omit<BaseTraceability, "releaseId"> & {
    releaseId: "MAL-CP004-EN-v2";
    presentationVersion: typeof MAL_CP004_CLUTTER_FREE_PRESENTATION_ID;
    presentationRuntimeId: typeof MAL_CP004_CLUTTER_FREE_PRESENTATION_RUNTIME_ID;
  };
};

const VERIFICATION_HELP_QLS = new Set<MalCp004PermanentQlId>([
  "MAL-QL-045",
  "MAL-QL-047",
]);

function exactRational(
  question: MalCp004ReleasedQuestion,
  key: string,
): Rational {
  const value = question.exactState[key];
  if (!value || typeof value === "string") {
    throw new Error(`${question.questionId}: exact state '${key}' is not rational.`);
  }
  return value;
}

function exactString(
  question: MalCp004ReleasedQuestion,
  key: string,
): string {
  const value = question.exactState[key];
  if (typeof value !== "string") {
    throw new Error(`${question.questionId}: exact state '${key}' is not text.`);
  }
  return value;
}

function normalizedLine(value: string): string {
  return value.trim().replace(/\s+/gu, " ");
}

function math(value: string): string {
  return `\\(${value}\\)`;
}

function latex(value: Rational): string {
  return toLatex(value);
}

function percent(value: Rational): string {
  return `${formatRational(multiplyRational(value, rational(100)))}%`;
}

function quantity(value: Rational, unit: "litres" | "kg"): string {
  return `${formatRational(value)} ${unit}`;
}

function cleanVolumeStem(question: MalCp004ReleasedQuestion): string {
  let stem = normalizedLine(question.stem)
    .replace(/\bchemical A\b/giu, "acid")
    .replace(/\bliquid A\b/giu, "concentrate")
    .replace(/\bliquid B\b/giu, "water")
    .replace(/\bsugar\b/giu, "syrup concentrate")
    .replace(/\bsalt\b/giu, "acid")
    .replace(/\bstrength\b/giu, "concentration")
    .replace(/\bA complete\b/gu, "A")
    .replace(/\bThe complete solution\b/gu, "A solution")
    .replace(/\bcomplete solution quantity\b/giu, "total volume")
    .replace(/\bcomplete mixture\b/giu, "mixture")
    .replace(/\bFor a stored solution, a solution\b/gu, "A solution")
    .replace(
      /Only the water quantity changes:\s*(1 litre|[0-9]+(?: [0-9/]+)? litres) of water evaporates\./iu,
      "If $1 of water evaporates,",
    )
    .replace(/\blitres of water is added\b/giu, "litres of water are added")
    .replace(/\bcalculate the new ([^?]+)\?/iu, "what is the new $1?")
    .replace(/\bWhat percent acid remains in the final solution\?/u, "What is the final acid concentration?")
    .replace(/\s+,/gu, ",")
    .replace(/,\s*what/gu, ", what");

  stem = `${stem[0]?.toUpperCase() ?? ""}${stem.slice(1)}`;
  if (!stem.endsWith("?")) stem = `${stem.replace(/[.!]+$/u, "")}?`;
  return stem;
}

function moistureStem(question: MalCp004ReleasedQuestion): string {
  const material = exactString(question, "material");
  const finalMaterial = exactString(question, "finalMaterial");
  const initialMoisture = percent(exactRational(question, "initialMoisture"));
  const finalMoisture = percent(exactRational(question, "finalMoisture"));

  if (question.permanentQlId === "MAL-QL-046") {
    const initialMass = quantity(exactRational(question, "initialMass"), "kg");
    if (question.representationVariant === "MOISTURE_LOST") {
      return `A ${initialMass} batch of ${material} contains ${initialMoisture} moisture. After drying, the ${finalMaterial} contains ${finalMoisture} moisture. How much moisture is lost?`;
    }
    return `A ${initialMass} batch of ${material} contains ${initialMoisture} moisture. After drying, the moisture content is ${finalMoisture}. What is the final mass of the ${finalMaterial}?`;
  }

  const finalMass = quantity(exactRational(question, "finalMass"), "kg");
  return `After drying, ${finalMass} of ${finalMaterial} contains ${finalMoisture} moisture. The original ${material} contained ${initialMoisture} moisture. What was its initial mass?`;
}

function editorialStem(question: MalCp004ReleasedQuestion): string {
  return question.permanentQlId === "MAL-QL-046" ||
    question.permanentQlId === "MAL-QL-047"
    ? moistureStem(question)
    : cleanVolumeStem(question);
}

function solutionLines(question: MalCp004ReleasedQuestion): string[] {
  switch (question.permanentQlId) {
    case "MAL-QL-038": {
      const total = exactRational(question, "total");
      const requestedRate = divideRational(question.answerValue, total);
      return [
        `${math(`\\text{Required quantity}=${latex(total)}\\times${latex(requestedRate)}=${latex(question.answerValue)}`)} litres.`,
      ];
    }
    case "MAL-QL-039": {
      const total = exactRational(question, "total");
      const tracked = exactRational(question, "trackedAmount");
      return [
        `${math(`\\text{Concentration}=\\frac{${latex(tracked)}}{${latex(total)}}\\times100=${latex(multiplyRational(question.answerValue, rational(100)))}\\%`)}.`,
      ];
    }
    case "MAL-QL-040": {
      const givenAmount = exactRational(question, "givenAmount");
      const givenRate = exactRational(question, "givenRate");
      return [
        `${math(`\\text{Total volume}=\\frac{${latex(givenAmount)}}{${latex(givenRate)}}=${latex(question.answerValue)}`)} litres.`,
      ];
    }
    case "MAL-QL-041": {
      const initialTotal = exactRational(question, "initialTotal");
      const initialRate = exactRational(question, "initialRate");
      const targetRate = exactRational(question, "targetRate");
      const tracked = exactRational(question, "initialTracked");
      const finalTotal = exactRational(question, "finalTotal");
      return [
        `${math(`\\text{Solute}= ${latex(initialTotal)}\\times${latex(initialRate)}=${latex(tracked)}`)} litres.`,
        `${math(`\\text{Required total}=\\frac{${latex(tracked)}}{${latex(targetRate)}}=${latex(finalTotal)}`)} litres.`,
        `${math(`\\text{Water added}=${latex(finalTotal)}-${latex(initialTotal)}=${latex(question.answerValue)}`)} litres.`,
      ];
    }
    case "MAL-QL-042": {
      const initialTotal = exactRational(question, "initialTotal");
      const conservedOther = exactRational(question, "conservedOther");
      const targetRate = exactRational(question, "targetRate");
      const solventRate = subtractRational(rational(1), targetRate);
      const finalTotal = exactRational(question, "finalTotal");
      return [
        `${math(`\\text{Solvent remains }${latex(conservedOther)}\\text{ litres}`)}.`,
        `${math(`\\text{Required total}=\\frac{${latex(conservedOther)}}{${latex(solventRate)}}=${latex(finalTotal)}`)} litres.`,
        `${math(`\\text{Pure solute added}=${latex(finalTotal)}-${latex(initialTotal)}=${latex(question.answerValue)}`)} litres.`,
      ];
    }
    case "MAL-QL-043": {
      const initialTotal = exactRational(question, "initialTotal");
      const initialRate = exactRational(question, "initialRate");
      const targetRate = exactRational(question, "targetRate");
      const tracked = exactRational(question, "initialTracked");
      const finalTotal = exactRational(question, "finalTotal");
      const lines = [
        `${math(`\\text{Solute}= ${latex(initialTotal)}\\times${latex(initialRate)}=${latex(tracked)}`)} litres.`,
        `${math(`\\text{Final volume}=\\frac{${latex(tracked)}}{${latex(targetRate)}}=${latex(finalTotal)}`)} litres.`,
      ];
      if (question.representationVariant === "EVAPORATED_AMOUNT") {
        lines.push(
          `${math(`\\text{Water evaporated}=${latex(initialTotal)}-${latex(finalTotal)}=${latex(question.answerValue)}`)} litres.`,
        );
      }
      return lines;
    }
    case "MAL-QL-044": {
      const initialTotal = exactRational(question, "initialTotal");
      const initialRate = exactRational(question, "initialRate");
      const tracked = exactRational(question, "trackedAmount");
      const solventChange = exactRational(question, "solventChange");
      const finalTotal = exactRational(question, "finalTotal");
      const direction = exactString(question, "direction");
      const operation = direction === "ADD" ? "+" : "-";
      return [
        `${math(`\\text{Solute}= ${latex(initialTotal)}\\times${latex(initialRate)}=${latex(tracked)}`)} litres.`,
        `${math(`\\text{Final volume}=${latex(initialTotal)}${operation}${latex(solventChange)}=${latex(finalTotal)}`)} litres.`,
        `${math(`\\text{Final concentration}=\\frac{${latex(tracked)}}{${latex(finalTotal)}}\\times100=${latex(multiplyRational(question.answerValue, rational(100)))}\\%`)}.`,
      ];
    }
    case "MAL-QL-045": {
      const evaporated = exactRational(question, "evaporated");
      const initialRate = exactRational(question, "initialRate");
      const targetRate = exactRational(question, "targetRate");
      const rateDifference = subtractRational(targetRate, initialRate);
      const numerator = multiplyRational(targetRate, evaporated);
      return [
        `Let the initial volume be ${math("V")} litres.`,
        `${math(`${latex(initialRate)}V=${latex(targetRate)}(V-${latex(evaporated)})`)} because the solute amount is unchanged.`,
        `${math(`V=\\frac{${latex(targetRate)}\\times${latex(evaporated)}}{${latex(rateDifference)}}=${latex(divideRational(numerator, rateDifference))}`)} litres.`,
      ];
    }
    case "MAL-QL-046": {
      const initialMass = exactRational(question, "initialMass");
      const initialMoisture = exactRational(question, "initialMoisture");
      const finalMoisture = exactRational(question, "finalMoisture");
      const dryMatter = exactRational(question, "dryMatter");
      const finalMass = exactRational(question, "finalMass");
      const initialDryRate = subtractRational(rational(1), initialMoisture);
      const finalDryRate = subtractRational(rational(1), finalMoisture);
      const lines = [
        `${math(`\\text{Dry matter}=${latex(initialMass)}\\times${latex(initialDryRate)}=${latex(dryMatter)}`)} kg.`,
        `${math(`\\text{Final mass}=\\frac{${latex(dryMatter)}}{${latex(finalDryRate)}}=${latex(finalMass)}`)} kg.`,
      ];
      if (question.representationVariant === "MOISTURE_LOST") {
        lines.push(
          `${math(`\\text{Moisture lost}=${latex(initialMass)}-${latex(finalMass)}=${latex(question.answerValue)}`)} kg.`,
        );
      }
      return lines;
    }
    case "MAL-QL-047": {
      const initialMoisture = exactRational(question, "initialMoisture");
      const finalMoisture = exactRational(question, "finalMoisture");
      const dryMatter = exactRational(question, "dryMatter");
      const finalMass = exactRational(question, "finalMass");
      const initialDryRate = subtractRational(rational(1), initialMoisture);
      const finalDryRate = subtractRational(rational(1), finalMoisture);
      return [
        `${math(`\\text{Dry matter}=${latex(finalMass)}\\times${latex(finalDryRate)}=${latex(dryMatter)}`)} kg.`,
        `${math(`\\text{Initial mass}=\\frac{${latex(dryMatter)}}{${latex(initialDryRate)}}=${latex(question.answerValue)}`)} kg.`,
      ];
    }
  }
}

function commonMistake(qlId: MalCp004PermanentQlId): string {
  switch (qlId) {
    case "MAL-QL-038":
      return "Use the percentage of the component being asked for, not automatically the remaining percentage.";
    case "MAL-QL-039":
      return "Divide the component quantity by the total mixture, not by the other component.";
    case "MAL-QL-040":
      return "Divide by the fraction represented by the given component; do not multiply by it.";
    case "MAL-QL-041":
      return "The required total volume is not the amount of water added; subtract the initial volume at the end.";
    case "MAL-QL-042":
      return "Adding pure solute increases both the solute quantity and the total volume by the same amount.";
    case "MAL-QL-043":
      return "Only solvent evaporates, so the solute quantity remains unchanged.";
    case "MAL-QL-044":
      return "Update the total volume before calculating the final concentration.";
    case "MAL-QL-045":
      return "After evaporation, the final volume is V minus the evaporated quantity, not V.";
    case "MAL-QL-046":
    case "MAL-QL-047":
      return "Moisture changes during drying, but dry matter remains unchanged.";
  }
}

function optionalVerification(question: MalCp004ReleasedQuestion): string | undefined {
  if (!VERIFICATION_HELP_QLS.has(question.permanentQlId)) return undefined;
  return normalizedLine(question.explanation.verification);
}

interface DistractorCandidate {
  value: Rational;
  misconceptionId: string;
}

function candidateValues(question: MalCp004ReleasedQuestion): DistractorCandidate[] {
  const answer = question.answerValue;
  switch (question.permanentQlId) {
    case "MAL-QL-038": {
      const total = exactRational(question, "total");
      const other = subtractRational(total, answer);
      return [
        { value: other, misconceptionId: "used_complementary_component" },
        {
          value: addRational(answer, divideRational(total, rational(10))),
          misconceptionId: "added_ten_percent_of_total",
        },
        {
          value: subtractRational(answer, divideRational(total, rational(10))),
          misconceptionId: "subtracted_ten_percent_of_total",
        },
        { value: total, misconceptionId: "reported_total_mixture" },
      ];
    }
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
      ];
    }
    case "MAL-QL-041": {
      const initialTotal = exactRational(question, "initialTotal");
      const finalTotal = exactRational(question, "finalTotal");
      const initialRate = exactRational(question, "initialRate");
      const targetRate = exactRational(question, "targetRate");
      return [
        { value: finalTotal, misconceptionId: "reported_required_final_total" },
        {
          value: multiplyRational(
            initialTotal,
            subtractRational(initialRate, targetRate),
          ),
          misconceptionId: "treated_percentage_drop_as_quantity",
        },
        {
          value: multiplyRational(initialTotal, targetRate),
          misconceptionId: "used_target_component_quantity",
        },
      ];
    }
    case "MAL-QL-042": {
      const initialTotal = exactRational(question, "initialTotal");
      const finalTotal = exactRational(question, "finalTotal");
      const initialRate = exactRational(question, "initialRate");
      const targetRate = exactRational(question, "targetRate");
      return [
        { value: finalTotal, misconceptionId: "reported_required_final_total" },
        {
          value: multiplyRational(
            initialTotal,
            subtractRational(targetRate, initialRate),
          ),
          misconceptionId: "treated_percentage_rise_as_quantity",
        },
        {
          value: subtractRational(finalTotal, exactRational(question, "initialTracked")),
          misconceptionId: "subtracted_initial_solute_from_final_total",
        },
      ];
    }
    case "MAL-QL-043": {
      const initialTotal = exactRational(question, "initialTotal");
      const finalTotal = exactRational(question, "finalTotal");
      const evaporated = exactRational(question, "evaporatedAmount");
      const initialTracked = exactRational(question, "initialTracked");
      return question.representationVariant === "EVAPORATED_AMOUNT"
        ? [
            { value: finalTotal, misconceptionId: "reported_final_volume" },
            { value: initialTracked, misconceptionId: "reported_solute_quantity" },
            {
              value: subtractRational(initialTotal, initialTracked),
              misconceptionId: "reported_initial_solvent_quantity",
            },
          ]
        : [
            { value: evaporated, misconceptionId: "reported_evaporated_quantity" },
            { value: initialTotal, misconceptionId: "kept_total_unchanged" },
            { value: initialTracked, misconceptionId: "reported_solute_quantity" },
          ];
    }
    case "MAL-QL-044": {
      const initialRate = exactRational(question, "initialRate");
      const tracked = exactRational(question, "trackedAmount");
      const finalOther = exactRational(question, "finalOther");
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
      ];
    }
    case "MAL-QL-046": {
      const initialMass = exactRational(question, "initialMass");
      const dryMatter = exactRational(question, "dryMatter");
      const finalMass = exactRational(question, "finalMass");
      const finalMoistureAmount = exactRational(question, "finalMoistureAmount");
      const initialMoistureAmount = exactRational(question, "initialMoistureAmount");
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
          ]
        : [
            { value: initialMass, misconceptionId: "kept_mass_unchanged" },
            { value: dryMatter, misconceptionId: "reported_dry_matter" },
            {
              value: subtractRational(initialMass, finalMoistureAmount),
              misconceptionId: "subtracted_final_moisture_from_initial_mass",
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
      ];
    }
  }
}

function acceptableDistractor(
  question: MalCp004ReleasedQuestion,
  value: Rational,
): boolean {
  if (compareRational(value, rational(0)) <= 0) return false;
  if (equalsRational(value, question.answerValue)) return false;
  if (question.answerUnit === "percent" && compareRational(value, rational(1)) >= 0) {
    return false;
  }
  if (question.permanentQlId === "MAL-QL-038") {
    return compareRational(value, exactRational(question, "total")) <= 0;
  }
  if (question.permanentQlId === "MAL-QL-040") {
    return compareRational(value, exactRational(question, "givenAmount")) >= 0;
  }
  return true;
}

function fallbackCandidates(question: MalCp004ReleasedQuestion): DistractorCandidate[] {
  const answer = question.answerValue;
  const offsets = question.answerUnit === "percent"
    ? [rational(1, 20), rational(1, 10), rational(3, 20), rational(1, 4)]
    : [rational(1), rational(2), rational(5), rational(10)];
  return offsets.flatMap((offset, index) => [
    {
      value: addRational(answer, offset),
      misconceptionId: `arithmetic_overestimate_${index + 1}`,
    },
    {
      value: subtractRational(answer, offset),
      misconceptionId: `arithmetic_underestimate_${index + 1}`,
    },
  ]);
}

function formatOption(
  question: MalCp004ReleasedQuestion,
  value: Rational,
): string {
  return question.answerUnit === "percent"
    ? percent(value)
    : quantity(value, question.answerUnit);
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function editorialOptions(question: MalCp004ReleasedQuestion): {
  options: string[];
  correctIndex: number;
  optionAudit: MalCp004Wave04OptionAudit[];
} {
  const chosen: DistractorCandidate[] = [];
  const seen = new Set<string>([rationalKey(question.answerValue)]);
  for (const candidate of [...candidateValues(question), ...fallbackCandidates(question)]) {
    const key = rationalKey(candidate.value);
    if (seen.has(key) || !acceptableDistractor(question, candidate.value)) continue;
    const text = formatOption(question, candidate.value);
    if (chosen.some((entry) => formatOption(question, entry.value) === text)) continue;
    seen.add(key);
    chosen.push(candidate);
    if (chosen.length === 3) break;
  }
  if (chosen.length !== 3) {
    throw new Error(`${question.questionId}: could not build three editorial distractors.`);
  }

  const correctIndex = hash(`${question.seed}:editorial-options-v2`) % 4;
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
    const candidate = chosen[wrongIndex++]!;
    const text = formatOption(question, candidate.value);
    options.push(text);
    optionAudit.push({
      text,
      value: candidate.value,
      misconceptionId: candidate.misconceptionId,
      isCorrect: false,
    });
  }
  return { options, correctIndex, optionAudit };
}

function clutterFreeExplanation(
  question: MalCp004ReleasedQuestion,
): MalCp004ClutterFreeExplanation {
  const solution = solutionLines(question);
  const answer = question.answer;
  const visibleLines = [...solution, `Answer: ${answer}`];
  const verification = optionalVerification(question);
  const optionalHelp: MalCp004ClutterFreeOptionalHelp = {
    collapsedByDefault: true,
    commonMistake: commonMistake(question.permanentQlId),
    ...(verification ? { verification } : {}),
  };
  return {
    layoutId: "MAL-CP004-EN-SOLUTION-FIRST-V2",
    sectionTitles: SECTION_TITLES,
    solution,
    answer,
    visibleLines,
    lines: visibleLines,
    optionalHelp,
  };
}

function reasoningGraph(
  stem: string,
  explanation: MalCp004ClutterFreeExplanation,
): MalReasoningGraph {
  const derivations = explanation.solution.map((line, index) => ({
    id: `derivation-${index + 1}`,
    kind: "DERIVATION" as const,
    text: line,
    dependsOn: [index === 0 ? "given-1" : `derivation-${index}`],
  }));
  const lastDerivation = derivations.at(-1)?.id ?? "given-1";
  return {
    nodes: [
      { id: "given-1", kind: "GIVEN", text: stem, dependsOn: [] },
      ...derivations,
      {
        id: "conclusion-1",
        kind: "CONCLUSION",
        text: `Answer: ${explanation.answer}`,
        dependsOn: [lastDerivation],
      },
    ],
  };
}

function assertClutterFree(question: MalCp004ClutterFreeQuestion): void {
  const explanation = question.explanation;
  if (question.runtimeId !== MAL_CP004_PERMANENT_RUNTIME_ID) {
    throw new Error(`${question.questionId}: permanent runtime identity changed.`);
  }
  if (
    question.presentationRuntimeId !==
    MAL_CP004_CLUTTER_FREE_PRESENTATION_RUNTIME_ID
  ) {
    throw new Error(`${question.questionId}: V2 presentation runtime is missing.`);
  }
  if (explanation.layoutId !== "MAL-CP004-EN-SOLUTION-FIRST-V2") {
    throw new Error(`${question.questionId}: wrong solution-first layout identity.`);
  }
  if (explanation.solution.length === 0 || explanation.solution.length > 4) {
    throw new Error(`${question.questionId}: solution length is outside the 1-4 line policy.`);
  }
  if (explanation.visibleLines.join("\n") !== explanation.lines.join("\n")) {
    throw new Error(`${question.questionId}: visible and compatibility lines differ.`);
  }
  if (explanation.optionalHelp.collapsedByDefault !== true) {
    throw new Error(`${question.questionId}: optional help is not collapsed by default.`);
  }
  if (Object.hasOwn(explanation.optionalHelp, "whyOtherOptionsAreWrong")) {
    throw new Error(`${question.questionId}: compulsory option analysis leaked to learners.`);
  }
  if (question.options.length !== 4 || new Set(question.options).size !== 4) {
    throw new Error(`${question.questionId}: editorial options are not four unique values.`);
  }
  if (question.options[question.correctIndex] !== question.answer) {
    throw new Error(`${question.questionId}: correct option does not match the answer.`);
  }
  const visibleText = explanation.visibleLines.join("\n");
  const forbiddenVisibleLabels = [
    /10-second/iu,
    /exam shortcut/iu,
    /fast method/iu,
    /quick check/iu,
    /common traps/iu,
    /distractor analysis/iu,
    /core concept/iu,
    /step-by-step/iu,
    /solving gives/iu,
  ];
  for (const pattern of forbiddenVisibleLabels) {
    if (pattern.test(visibleText)) {
      throw new Error(
        `${question.questionId}: cluttered learner label remains visible: ${pattern}.`,
      );
    }
  }
  if (/\d+\/\d+\/\d+/u.test(visibleText)) {
    throw new Error(`${question.questionId}: ambiguous chained division remains visible.`);
  }
  if (
    VERIFICATION_HELP_QLS.has(question.permanentQlId) !==
    Object.hasOwn(explanation.optionalHelp, "verification")
  ) {
    throw new Error(`${question.questionId}: verification-help policy is inconsistent.`);
  }
}

export function runMalCp004EnglishClutterFreeV2Pipeline(
  input: {
    questionLanguageId: MalCp004PermanentQlId;
    seed?: string;
    language?: "en";
  },
): MalCp004ClutterFreeQuestion {
  const base = runMalCp004EnglishReleasePipelineV1(input);
  const stem = editorialStem(base);
  const options = editorialOptions(base);
  const explanation = clutterFreeExplanation(base);
  const question: MalCp004ClutterFreeQuestion = {
    ...base,
    stem,
    ...options,
    presentationRuntimeId: MAL_CP004_CLUTTER_FREE_PRESENTATION_RUNTIME_ID,
    sourcePermanentRuntimeId: MAL_CP004_PERMANENT_RUNTIME_ID,
    explanationId: `${base.permanentQlId}-EN-SOLUTION-FIRST-V2`,
    explanation,
    reasoningGraph: reasoningGraph(stem, explanation),
    allocationStatus: "RELEASED_ENGLISH_V2",
    parameters: {
      ...base.parameters,
      editorialPresentationVersion: MAL_CP004_CLUTTER_FREE_PRESENTATION_ID,
    },
    validation: {
      ...base.validation,
      checks: [
        ...base.validation.checks,
        {
          name: "SOLUTION_FIRST_VISIBLE_EXPLANATION",
          passed: true,
          message:
            "The learner surface uses one compact Solution block followed by the answer.",
        },
        {
          name: "EDITORIAL_STEM_AND_DISTRACTOR_REMEDIATION",
          passed: true,
          message:
            "Awkward stems and implausible distractors are replaced without changing the exact answer.",
        },
        {
          name: "NO_COMPULSORY_OPTION_ANALYSIS",
          passed: true,
          message:
            "Detailed option audits remain internal; learners receive only one optional common mistake.",
        },
        {
          name: "NO_FORCED_FAST_METHOD",
          passed: true,
          message: "No compulsory Fast Method is emitted.",
        },
      ],
    },
    traceability: {
      ...base.traceability,
      releaseId: "MAL-CP004-EN-v2",
      presentationVersion: MAL_CP004_CLUTTER_FREE_PRESENTATION_ID,
      presentationRuntimeId: MAL_CP004_CLUTTER_FREE_PRESENTATION_RUNTIME_ID,
    },
  };

  assertClutterFree(question);
  return question;
}

export function malCp004ClutterFreeStable(
  question: MalCp004ClutterFreeQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}

export const MAL_CP004_CLUTTER_FREE_QL_IDS =
  MAL_CP004_PERMANENT_ALLOCATION.map((entry) => entry.qlId);
