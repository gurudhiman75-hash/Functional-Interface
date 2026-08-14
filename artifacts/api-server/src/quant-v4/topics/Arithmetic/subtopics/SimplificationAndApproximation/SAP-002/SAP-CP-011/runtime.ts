import {
  e2Math,
  fmt,
  nearbyNumericOptions,
  optionSet,
  packageE2,
  squareRoot,
  type SapE2Package,
  type SapE2Profile,
} from "../../SAP-E2-TYPES";

export const SAP_CP011_E2_STRUCTURES = Object.freeze([
  "CP011-E2-CLOSEST-MIXED-EXPRESSION",
  "CP011-E2-CLOSEST-FRACTION-PRODUCT",
  "CP011-E2-NEAREST-MULTIPLE-TEN",
  "CP011-E2-CLOSEST-ROOT-OPTION",
  "CP011-E2-ABSOLUTE-ERROR",
  "CP011-E2-PERCENTAGE-ERROR",
  "CP011-E2-OVER-UNDER-DIRECTION",
  "CP011-E2-COMPARE-ESTIMATE-ACCURACY",
  "CP011-E2-COMPOSED-ROUNDING-BOUND",
  "CP011-E2-OPTION-WITHIN-TOLERANCE",
  "CP011-E2-GUARANTEED-NEAREST-FROM-INTERVAL",
  "CP011-E2-AMBIGUOUS-OPTION-DIAGNOSIS",
] as const);
export type SapCp011E2Structure = typeof SAP_CP011_E2_STRUCTURES[number];

const OFFSETS = Object.freeze([-0.42, -0.28, -0.16, -0.07, 0.08, 0.19, 0.31, 0.44]);
function common(seed: number) {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("CP011 seed must be 1..100.");
  const p = seed - 1;
  const anchor = 18 + p;
  const a = 8 + (p % 17);
  const b = 3 + ((p * 3) % 8);
  const m = 2 + ((p * 5) % 5);
  const c = 4 + ((p * 7) % 11);
  return { p, anchor, a, b, m, c, correctIndex: p % 4 };
}
function off(seed: number, salt: number): number { return OFFSETS[(seed * 3 + salt * 5) % OFFSETS.length]!; }
function wrong(value: string, id: string, analysis: string) { return { value, id, analysis }; }

function finish(args: {
  profile?: SapE2Profile;
  structureId: SapCp011E2Structure;
  seed: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  decisionCount: number;
  stem: string;
  answer: string;
  options: ReturnType<typeof optionSet>;
  concept: string;
  steps: readonly string[];
  data: Readonly<Record<string, number | string>>;
}): SapE2Package {
  return packageE2({
    profile: args.profile ?? "BANK",
    checkpointId: "SAP-CP-011",
    structureId: args.structureId,
    seed: args.seed,
    difficulty: args.difficulty,
    decisionCount: args.decisionCount,
    stem: args.stem,
    canonicalAnswer: args.answer,
    options: args.options,
    correctIndex: (args.seed - 1) % 4,
    explanation: Object.freeze({ coreConcept: args.concept, steps: Object.freeze(args.steps), finalAnswer: `Therefore, ${args.answer} is the correct choice.` }),
    oracle: Object.freeze({ kind: args.structureId, data: args.data }),
  });
}

function closestMixed(seed: number): SapE2Package {
  const { anchor, b, c, correctIndex } = common(seed);
  const x = anchor + off(seed, 0), y = b + off(seed, 1), z = c + off(seed, 2);
  const exact = x * y + z;
  const nearest = Math.round(exact);
  const candidates = [nearest - 5, nearest, nearest + 4, nearest + 9].map(String);
  const answer = String(nearest);
  const others = candidates.filter(v => v !== answer).map((v, i) => wrong(v, `DISTANCE_${i + 1}`, "This option is farther from the exact expression value."));
  return finish({ structureId: "CP011-E2-CLOSEST-MIXED-EXPRESSION", seed, difficulty: "MEDIUM", decisionCount: 4,
    stem: `Which option is closest to the value of ${e2Math(`${fmt(x)} \\times ${fmt(y)} + ${fmt(z)}`)}?`, answer,
    options: optionSet(answer, correctIndex, others), concept: "Estimate the product and addition, then compare the remaining options by distance.",
    steps: [`The expression is about ${fmt(exact, 2)}.`, `Among the options, ${answer} has the smallest distance from this value.`],
    data: Object.freeze({ x100: Math.round(x * 100), y100: Math.round(y * 100), z100: Math.round(z * 100), exact10000: Math.round(exact * 10000), nearest }) });
}

function closestFractionProduct(seed: number): SapE2Package {
  const { p, anchor, correctIndex } = common(seed);
  const n = 11 + (p % 19);
  const scale = 20 + anchor;
  const exact = scale * (n + 3) / (n + 1);
  const answer = String(Math.round(exact));
  const a = Number(answer);
  return finish({ structureId: "CP011-E2-CLOSEST-FRACTION-PRODUCT", seed, difficulty: "MEDIUM", decisionCount: 4,
    stem: `Which option is closest to ${e2Math(`${scale} \\times \\frac{${n}}{${n + 1}} \\times \\frac{${n + 3}}{${n}}`)}?`, answer,
    options: optionSet(answer, correctIndex, [wrong(String(a - 4), "NO_CANCELLATION", "The fractions were multiplied without using the common factor efficiently."), wrong(String(a + 3), "ROUND_HIGH", "The final value was rounded too high."), wrong(String(a + 7), "SCALE_SLIP", "The scale factor was handled incorrectly.")]),
    concept: "Cancel the common factor first, then judge the nearest option from the reduced fraction.",
    steps: [`The product reduces to ${e2Math(`${scale} \\times \\frac{${n + 3}}{${n + 1}}`)}, which is about ${fmt(exact, 2)}.`, `${answer} is the nearest listed value.`],
    data: Object.freeze({ n, scale, exactNumerator: scale * (n + 3), exactDenominator: n + 1, nearest: a }) });
}

function nearestMultipleTen(seed: number): SapE2Package {
  const { anchor, b, c, correctIndex } = common(seed);
  const x = anchor + off(seed, 3), y = b + off(seed, 4), z = c + off(seed, 5);
  const exact = x * y - z;
  const nearest = Math.round(exact / 10) * 10;
  const answer = String(nearest);
  return finish({ structureId: "CP011-E2-NEAREST-MULTIPLE-TEN", seed, difficulty: "MEDIUM", decisionCount: 4,
    stem: `The value of ${e2Math(`${fmt(x)} \\times ${fmt(y)} - ${fmt(z)}`)} is nearest to which multiple of 10?`, answer,
    options: optionSet(answer, correctIndex, [wrong(String(nearest - 20), "LOW_BENCHMARK", "A lower benchmark was chosen."), wrong(String(nearest + 10), "HIGH_BENCHMARK", "The value was pushed to the next higher multiple."), wrong(String(nearest + 20), "PRODUCT_SLIP", "A multiplication slip moved the estimate too far.")]),
    concept: "Estimate the expression first and only then choose the nearest multiple of ten.",
    steps: [`The expression is approximately ${fmt(exact, 1)}.`, `The closest multiple of 10 is ${answer}.`],
    data: Object.freeze({ x100: Math.round(x * 100), y100: Math.round(y * 100), z100: Math.round(z * 100), exact10000: Math.round(exact * 10000), nearest }) });
}

function closestRootOption(seed: number): SapE2Package {
  const { anchor, m, c, correctIndex } = common(seed);
  const rootBase = 12 + (seed % 17);
  const radicand100 = rootBase * rootBase * 100 + Math.round(off(seed, 1) * 100);
  const radicand = radicand100 / 100;
  const multiplier = m + off(seed, 2);
  const exact = Math.sqrt(radicand) * multiplier + c;
  const nearest = Math.round(exact);
  const answer = String(nearest);
  return finish({ structureId: "CP011-E2-CLOSEST-ROOT-OPTION", seed, difficulty: "HARD", decisionCount: 5,
    stem: `Which option is closest to ${e2Math(`${squareRoot(fmt(radicand))} \\times ${fmt(multiplier)} + ${c}`)}?`, answer,
    options: optionSet(answer, correctIndex, [wrong(String(nearest - 5), "ROOT_LOW", "The square root was estimated from the lower wrong benchmark."), wrong(String(nearest + 4), "MULTIPLIER_HIGH", "The multiplier was rounded too high."), wrong(String(nearest + 8), "DOUBLE_ROUND", "Several terms were rounded in the same direction.")]),
    concept: "Use the nearby perfect square, estimate the product, then compare option distances.",
    steps: [`${fmt(radicand)} is close to ${rootBase ** 2}, so the root is close to ${rootBase}; the whole expression is about ${fmt(exact, 2)}.`, `${answer} is the uniquely nearest option.`],
    data: Object.freeze({ radicand100, multiplier100: Math.round(multiplier * 100), c, rootBase, exact1000: Math.round(exact * 1000), nearest, anchor }) });
}

function absoluteError(seed: number): SapE2Package {
  const { anchor, b, correctIndex } = common(seed);
  const exact100 = anchor * 100 + 25 + (seed % 5) * 5;
  const delta100 = 20 + (seed % 7) * 5;
  const estimate100 = seed % 2 ? exact100 + delta100 : exact100 - delta100;
  const answer = fmt(delta100 / 100, 2);
  const d = delta100 / 100;
  return finish({ profile: "SSC", structureId: "CP011-E2-ABSOLUTE-ERROR", seed, difficulty: "MEDIUM", decisionCount: 2,
    stem: `The exact value of an arithmetic expression is ${fmt(exact100 / 100, 2)}, while a quick estimate gives ${fmt(estimate100 / 100, 2)}. What is the absolute error?`, answer,
    options: optionSet(answer, correctIndex, [wrong(fmt(d + 0.1, 2), "ADD_TENTH", "The difference was overstated by 0.1."), wrong(fmt(Math.abs(estimate100) / 100, 2), "REPORT_ESTIMATE", "The estimate itself was reported instead of the error."), wrong(fmt(d * 2, 2), "DOUBLE_ERROR", "The difference was counted twice.")]),
    concept: "Absolute error is the positive distance between the exact value and the estimate.", steps: [`Take the absolute difference: ${e2Math(`|${fmt(exact100 / 100, 2)}-${fmt(estimate100 / 100, 2)}|`)}.`, `The difference is ${answer}.`],
    data: Object.freeze({ exact100, estimate100, delta100, b }) });
}

function percentageError(seed: number): SapE2Package {
  const { anchor, correctIndex } = common(seed);
  const exact = (anchor + 2) * 10;
  const pct = [2, 4, 5, 8][seed % 4]!;
  const estimate = exact * (100 + (seed % 2 ? pct : -pct)) / 100;
  const answer = `${pct}%`;
  return finish({ profile: "SSC", structureId: "CP011-E2-PERCENTAGE-ERROR", seed, difficulty: "MEDIUM", decisionCount: 3,
    stem: `An expression has exact value ${exact}, but it was estimated as ${fmt(estimate, 1)}. What is the percentage error in the estimate?`, answer,
    options: optionSet(answer, correctIndex, [wrong(`${pct + 2}%`, "DENOMINATOR_SLIP", "The wrong denominator was used in the error percentage."), wrong(`${pct * 2}%`, "DOUBLE_ERROR", "The absolute difference was effectively counted twice."), wrong(`${Math.max(1, pct - 1)}%`, "ROUND_LOW", "The error percentage was rounded too low.")]),
    concept: "Compare the absolute error with the exact value, not with the estimate.", steps: [`Absolute error = ${fmt(Math.abs(estimate - exact), 1)}.`, `${e2Math(`\\frac{${fmt(Math.abs(estimate - exact), 1)}}{${exact}} \\times 100 = ${pct}\\%`)}.`],
    data: Object.freeze({ exact, estimate100: Math.round(estimate * 100), pct, anchor }) });
}

function overUnder(seed: number): SapE2Package {
  const { anchor, b, correctIndex } = common(seed);
  const high = seed % 2 === 0;
  const x = anchor + (high ? -0.4 : 0.4);
  const y = b + (high ? -0.3 : 0.3);
  const exact = x * y;
  const estimate = anchor * b;
  const answer = high ? "Overestimate" : "Underestimate";
  return finish({ structureId: "CP011-E2-OVER-UNDER-DIRECTION", seed, difficulty: "MEDIUM", decisionCount: 3,
    stem: `For ${e2Math(`${fmt(x)} \\times ${fmt(y)}`)}, replacing the two factors by ${anchor} and ${b} gives ${estimate}. This estimate is best described as:`, answer,
    options: optionSet(answer, correctIndex, [wrong(high ? "Underestimate" : "Overestimate", "DIRECTION_REVERSED", "The direction of the rounding effect was reversed."), wrong("Exact", "ASSUME_EXACT", "Rounded factors were incorrectly treated as exact."), wrong("Cannot be determined", "IGNORE_DIRECTION", "Both factor changes have a known common direction here.")]),
    concept: "Track whether both positive factors were moved up or down before multiplying.", steps: [`The exact product is about ${fmt(exact, 2)}, while the rounded product is ${estimate}.`, `${estimate} is ${high ? "above" : "below"} the exact value, so it is an ${answer.toLowerCase()}.`],
    data: Object.freeze({ x100: Math.round(x * 100), y100: Math.round(y * 100), estimate, exact10000: Math.round(exact * 10000), direction: answer }) });
}

function compareAccuracy(seed: number): SapE2Package {
  const { anchor, correctIndex } = common(seed);
  const exact100 = (anchor * 100) + 37;
  const d1 = 20 + (seed % 6) * 5;
  const d2 = d1 + 15 + (seed % 4) * 5;
  const e1 = exact100 + (seed % 2 ? d1 : -d1);
  const e2 = exact100 - (seed % 2 ? d2 : -d2);
  const answer = `Estimate 1 (${fmt(e1 / 100, 2)})`;
  return finish({ structureId: "CP011-E2-COMPARE-ESTIMATE-ACCURACY", seed, difficulty: "MEDIUM", decisionCount: 3,
    stem: `The exact value of an expression is ${fmt(exact100 / 100, 2)}. Two estimates are ${fmt(e1 / 100, 2)} and ${fmt(e2 / 100, 2)}. Which statement is correct?`, answer,
    options: optionSet(answer, correctIndex, [wrong(`Estimate 2 (${fmt(e2 / 100, 2)})`, "CHOOSE_FARTHER", "The estimate with the larger absolute error was selected."), wrong("Both are equally accurate", "IGNORE_GAP", "The two absolute errors are not equal."), wrong("Neither can be compared", "NO_COMPARISON", "Both estimates are directly comparable with the same exact value.")]),
    concept: "The more accurate estimate has the smaller absolute error.", steps: [`Estimate 1 has error ${fmt(d1 / 100, 2)}; Estimate 2 has error ${fmt(d2 / 100, 2)}.`, `Since ${fmt(d1 / 100, 2)} is smaller, ${answer} is more accurate.`],
    data: Object.freeze({ exact100, e1, e2, d1, d2 }) });
}

function composedBound(seed: number): SapE2Package {
  const { anchor, b, correctIndex } = common(seed);
  const sum = anchor + b;
  const answer = `${sum - 1} < x + y < ${sum + 1}`;
  return finish({ profile: "SSC", structureId: "CP011-E2-COMPOSED-ROUNDING-BOUND", seed, difficulty: "HARD", decisionCount: 4,
    stem: `A positive number x rounds to ${anchor} and a positive number y rounds to ${b}, each to the nearest integer. Which interval must contain x + y?`, answer,
    options: optionSet(answer, correctIndex, [wrong(`${sum - 0.5} < x + y < ${sum + 0.5}`, "ONE_ERROR_BAND", "Only one rounding uncertainty was allowed for two rounded terms."), wrong(`${sum - 2} < x + y < ${sum + 2}`, "TOO_WIDE", "The interval is valid but not the tightest listed bound."), wrong(`${sum} < x + y < ${sum + 1}`, "DROP_LOWER_SIDE", "Values below the rounded sum were incorrectly excluded.")]),
    concept: "Each rounded term can differ by less than 0.5, so the sum can differ by less than 1.", steps: [`x lies within 0.5 of ${anchor}, and y lies within 0.5 of ${b}.`, `Adding the two error bands gives ${answer}.`],
    data: Object.freeze({ anchor, b, sum, lower: sum - 1, upper: sum + 1 }) });
}

function withinTolerance(seed: number): SapE2Package {
  const { anchor, correctIndex } = common(seed);
  const exact100 = anchor * 100 + 43;
  const tolerance100 = 30 + (seed % 4) * 10;
  const good100 = exact100 + (seed % 2 ? Math.floor(tolerance100 / 2) : -Math.floor(tolerance100 / 2));
  const bad1 = exact100 + tolerance100 + 15;
  const bad2 = exact100 - tolerance100 - 20;
  const bad3 = exact100 + tolerance100 * 2;
  const answer = fmt(good100 / 100, 2);
  return finish({ structureId: "CP011-E2-OPTION-WITHIN-TOLERANCE", seed, difficulty: "MEDIUM", decisionCount: 3,
    stem: `The exact value of an expression is ${fmt(exact100 / 100, 2)}. Which option is within ±${fmt(tolerance100 / 100, 2)} of the exact value?`, answer,
    options: optionSet(answer, correctIndex, [wrong(fmt(bad1 / 100, 2), "JUST_OUTSIDE_HIGH", "This value lies just outside the allowed tolerance."), wrong(fmt(bad2 / 100, 2), "JUST_OUTSIDE_LOW", "This value lies below the allowed tolerance band."), wrong(fmt(bad3 / 100, 2), "FAR_OUTSIDE", "This value is well outside the allowed band.")]),
    concept: "Form the tolerance band around the exact value and test each option against it.", steps: [`Allowed values lie from ${fmt((exact100 - tolerance100) / 100, 2)} to ${fmt((exact100 + tolerance100) / 100, 2)}.`, `${answer} is the only option inside this band.`],
    data: Object.freeze({ exact100, tolerance100, good100, bad1, bad2, bad3 }) });
}

function guaranteedNearest(seed: number): SapE2Package {
  const { anchor, correctIndex } = common(seed);
  const centre = anchor * 10;
  const lower = centre - 2;
  const upper = centre + 2;
  const answer = String(centre);
  return finish({ structureId: "CP011-E2-GUARANTEED-NEAREST-FROM-INTERVAL", seed, difficulty: "HARD", decisionCount: 4,
    stem: `An expression is known to lie between ${lower} and ${upper}. Which option is guaranteed to be the nearest for every value in this interval?`, answer,
    options: optionSet(answer, correctIndex, [wrong(String(centre - 8), "LEFT_OPTION", "This option becomes too far from the upper end of the interval."), wrong(String(centre + 8), "RIGHT_OPTION", "This option becomes too far from the lower end of the interval."), wrong(String(centre + 15), "FAR_OPTION", "This option is not competitive anywhere in the interval.")]),
    concept: "A guaranteed nearest option must beat every other option at both ends of the possible-value interval.", steps: [`Every possible value is at most 2 away from ${centre}.`, `The other options are at least 6 away even at their favourable interval end, so ${answer} is guaranteed nearest.`],
    data: Object.freeze({ centre, lower, upper, left: centre - 8, right: centre + 8, far: centre + 15 }) });
}

function ambiguousDiagnosis(seed: number): SapE2Package {
  const { anchor, correctIndex } = common(seed);
  const left = anchor * 10;
  const right = left + 10;
  const lower = left + 4;
  const upper = left + 6;
  const answer = "No unique nearest option can be guaranteed";
  return finish({ structureId: "CP011-E2-AMBIGUOUS-OPTION-DIAGNOSIS", seed, difficulty: "HARD", decisionCount: 4,
    stem: `An expression is known only to lie between ${lower} and ${upper}. The two closest listed options are ${left} and ${right}. What can be concluded?`, answer,
    options: optionSet(answer, correctIndex, [wrong(`${left} is definitely nearest`, "FORCE_LEFT", "Values near the upper end are closer to the right option."), wrong(`${right} is definitely nearest`, "FORCE_RIGHT", "Values near the lower end are closer to the left option."), wrong("Both options are always equally near", "ALWAYS_TIE", "Only the midpoint is an exact tie; the full interval is not.")]),
    concept: "If the possible interval crosses the midpoint of two options, nearest-option uniqueness is not guaranteed.", steps: [`The midpoint of ${left} and ${right} is ${left + 5}.`, `The interval ${lower} to ${upper} lies on both sides of that midpoint, so ${answer.toLowerCase()}.`],
    data: Object.freeze({ left, right, lower, upper, midpoint: left + 5 }) });
}

export function generateSapCp011E2(structureId: SapCp011E2Structure, seed: number): SapE2Package {
  switch (structureId) {
    case "CP011-E2-CLOSEST-MIXED-EXPRESSION": return closestMixed(seed);
    case "CP011-E2-CLOSEST-FRACTION-PRODUCT": return closestFractionProduct(seed);
    case "CP011-E2-NEAREST-MULTIPLE-TEN": return nearestMultipleTen(seed);
    case "CP011-E2-CLOSEST-ROOT-OPTION": return closestRootOption(seed);
    case "CP011-E2-ABSOLUTE-ERROR": return absoluteError(seed);
    case "CP011-E2-PERCENTAGE-ERROR": return percentageError(seed);
    case "CP011-E2-OVER-UNDER-DIRECTION": return overUnder(seed);
    case "CP011-E2-COMPARE-ESTIMATE-ACCURACY": return compareAccuracy(seed);
    case "CP011-E2-COMPOSED-ROUNDING-BOUND": return composedBound(seed);
    case "CP011-E2-OPTION-WITHIN-TOLERANCE": return withinTolerance(seed);
    case "CP011-E2-GUARANTEED-NEAREST-FROM-INTERVAL": return guaranteedNearest(seed);
    case "CP011-E2-AMBIGUOUS-OPTION-DIAGNOSIS": return ambiguousDiagnosis(seed);
  }
}
