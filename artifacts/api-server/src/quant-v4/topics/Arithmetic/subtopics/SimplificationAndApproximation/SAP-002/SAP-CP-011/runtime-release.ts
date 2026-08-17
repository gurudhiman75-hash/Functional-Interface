import { e2Math, fmt, optionSet, packageE2, type SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP011_E2_STRUCTURES, generateSapCp011E2 as generateFinal, type SapCp011E2Structure } from "./runtime-final";

export { SAP_CP011_E2_STRUCTURES };
export type { SapCp011E2Structure };

function wrong(value: string, id: string, analysis: string) { return { value, id, analysis }; }

function closestFractionProduct(seed: number): SapE2Package {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("CP011 seed must be 1..100.");
  const p = seed - 1;
  const anchor = 18 + p;
  const correctIndex = p % 4;
  const n = 11 + (p % 19);
  const scale = 20 + anchor;
  const exact = scale * (n + 3) / (n + 1);
  const nearest = Math.round(exact);
  const answer = String(nearest);
  return packageE2({
    profile: "BANK",
    checkpointId: "SAP-CP-011",
    structureId: "CP011-E2-CLOSEST-FRACTION-PRODUCT",
    seed,
    difficulty: "MEDIUM",
    decisionCount: 4,
    stem: `Which option is closest to ${e2Math(`${scale} \\times \\frac{${n}}{${n + 1}} \\times \\frac{${n + 3}}{${n}}`)}?`,
    canonicalAnswer: answer,
    options: optionSet(answer, correctIndex, [
      wrong(String(nearest - 4), "EARLY_ROUND_LOW", "The reduced value was rounded down too early, pulling the final estimate too low."),
      wrong(String(nearest + 3), "ROUND_HIGH", "The final value was rounded too high."),
      wrong(String(nearest + 7), "SCALE_SLIP", "The scale factor was handled incorrectly."),
    ]),
    correctIndex,
    explanation: Object.freeze({
      coreConcept: "Cancel the common factor first, then judge the nearest option from the reduced fraction.",
      steps: Object.freeze([
        `The product reduces to ${e2Math(`${scale} \\times \\frac{${n + 3}}{${n + 1}}`)}, which is about ${fmt(exact, 2)}.`,
        `${answer} is the nearest listed value.`,
      ]),
      finalAnswer: `Therefore, ${answer} is the correct choice.`,
    }),
    oracle: Object.freeze({ kind: "CP011-E2-CLOSEST-FRACTION-PRODUCT", data: Object.freeze({ n, scale, exactNumerator: scale * (n + 3), exactDenominator: n + 1, nearest }) }),
  });
}

function composedRoundingBound(seed: number): SapE2Package {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("CP011 seed must be 1..100.");
  const p = seed - 1;
  const anchor = 18 + p;
  const b = 3 + ((p * 3) % 8);
  const correctIndex = p % 4;
  const sum = anchor + b;
  const lower = sum - 1;
  const upper = sum + 1;
  const answer = `${lower} ≤ x + y < ${upper}`;
  return packageE2({
    profile: "SSC",
    checkpointId: "SAP-CP-011",
    structureId: "CP011-E2-COMPOSED-ROUNDING-BOUND",
    seed,
    difficulty: "HARD",
    decisionCount: 4,
    stem: `A positive number x rounds to ${anchor} and a positive number y rounds to ${b}, each to the nearest integer. Which is the tightest interval that must contain x + y?`,
    canonicalAnswer: answer,
    options: optionSet(answer, correctIndex, [
      wrong(`${sum - 0.5} ≤ x + y < ${sum + 0.5}`, "ONE_ERROR_BAND", "Only one rounding uncertainty was allowed for two rounded terms."),
      wrong(`${lower} < x + y < ${upper}`, "EXCLUDE_ATTAINABLE_LOWER_ENDPOINT", "The lower endpoint is attainable when both numbers are exactly 0.5 below their rounded integers."),
      wrong(`${sum - 2} ≤ x + y < ${sum + 2}`, "NOT_TIGHTEST", "This wider interval contains all possibilities but is not the tightest interval requested."),
    ]),
    correctIndex,
    explanation: Object.freeze({
      coreConcept: "Nearest-integer rounding gives a half-open interval: the lower half is included and the upper half is excluded.",
      steps: Object.freeze([
        `${anchor - 0.5} ≤ x < ${anchor + 0.5} and ${b - 0.5} ≤ y < ${b + 0.5}.`,
        `Adding the two intervals gives ${answer}.`,
      ]),
      finalAnswer: `Therefore, ${answer}.`,
    }),
    oracle: Object.freeze({ kind: "CP011-E2-COMPOSED-ROUNDING-BOUND", data: Object.freeze({ anchor, b, sum, lower, upper, lowerInclusive: "true", upperInclusive: "false" }) }),
  });
}

export function generateSapCp011E2(structureId: SapCp011E2Structure, seed: number): SapE2Package {
  if (structureId === "CP011-E2-CLOSEST-FRACTION-PRODUCT") return closestFractionProduct(seed);
  if (structureId === "CP011-E2-COMPOSED-ROUNDING-BOUND") return composedRoundingBound(seed);
  return generateFinal(structureId, seed);
}
