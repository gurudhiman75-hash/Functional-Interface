import {
  e2Math,
  fmt,
  optionSet,
  packageE2,
  squareRoot,
  type SapE2Package,
} from "../../SAP-E2-TYPES";

export const SAP_CP012_E3_EXPLICIT_POWER_REVERSE = "CP012-E3-EXPLICIT-POWER-REVERSE-SYNTHESIS" as const;
const OFF = Object.freeze([-0.004, -0.003, -0.002, -0.001, 0.001, 0.002, 0.003, 0.004]);
function off(seed: number, salt: number): number { return OFF[(seed * 5 + salt * 3) % OFF.length]!; }
function wrong(value: string, id: string, analysis: string) { return { value, id, analysis }; }
function ipow(base: number, exponent: number): number { return base ** exponent; }

function powerChain(seed: number): SapE2Package {
  const p = seed - 1, correctIndex = p % 4;
  const q = (seed - 2) / 3;
  const g = 3 + (q % 3);
  const a = 3 + (q % 4);
  const b = 2 + ((q * 2) % 5);
  const c = 1 + (q % 2);
  const leftExponent = a + b - c;
  const missingExponent = 2 + ((q * 3) % 4);
  const rightPower = 1 + (q % 3);
  const rightExponent = leftExponent + missingExponent - rightPower;
  const answer = ipow(g, missingExponent);
  const g1 = g + off(seed, 0), g2 = g + off(seed, 1), leftDen = ipow(g, c) + off(seed, 2);
  const rightBase = ipow(g, rightPower) + off(seed, 3), g3 = g + off(seed, 4);
  const actualLeft = g1 ** a * g2 ** b / leftDen;
  const actualRightKnown = rightBase * g3 ** rightExponent;
  const actualMissing = actualRightKnown / actualLeft;
  const answerText = String(answer);
  const lower = ipow(g, Math.max(1, missingExponent - 1));
  const higher = ipow(g, missingExponent + 1);
  return packageE2({
    profile: "BANK", checkpointId: "SAP-CP-012", structureId: SAP_CP012_E3_EXPLICIT_POWER_REVERSE, seed,
    difficulty: "HARD", decisionCount: 8,
    stem: `What approximate value should replace ? in ${e2Math(`(${fmt(g1, 3)})^{${a}} \\times (${fmt(g2, 3)})^{${b}} \\div ${fmt(leftDen, 3)} = ${fmt(rightBase, 3)} \\times (${fmt(g3, 3)})^{${rightExponent}} \\div ?`)}?`,
    canonicalAnswer: answerText,
    options: optionSet(answerText, correctIndex, [
      wrong(String(lower), "MISSING_EXPONENT_ONE_LOW", "The common-base exponents are combined correctly except that the recovered missing exponent is one too low."),
      wrong(String(higher), "MISSING_EXPONENT_ONE_HIGH", "The common-base exponents are combined correctly except that the recovered missing exponent is one too high."),
      wrong(String(missingExponent), "REPORT_EXPONENT_NOT_POWER", "The correct missing exponent is recovered, but the exponent itself is reported instead of evaluating the corresponding power of the common base."),
    ]), correctIndex,
    explanation: Object.freeze({
      coreConcept: "Round the near-common bases first, combine the numeric exponents on each side, then invert the remaining power ratio to recover the missing value.",
      steps: Object.freeze([
        `Using ${g} as the nearby base, the left side becomes ${g}^(${a}+${b}-${c}) = ${g}^${leftExponent}.`,
        `The known right side is ${g}^(${rightPower}+${rightExponent}) ÷ ?, so ? ≈ ${g}^${missingExponent} = ${answer}.`,
      ]),
      finalAnswer: `Therefore, ? ≈ ${answer}.`,
    }),
    oracle: Object.freeze({ kind: SAP_CP012_E3_EXPLICIT_POWER_REVERSE, data: Object.freeze({
      mode: "POWER_CHAIN", g, a, b, c, leftExponent, missingExponent, rightPower, rightExponent, answer,
      g1_1000: Math.round(g1 * 1000), g2_1000: Math.round(g2 * 1000), leftDen_1000: Math.round(leftDen * 1000),
      rightBase_1000: Math.round(rightBase * 1000), g3_1000: Math.round(g3 * 1000), actualMissing_100000: Math.round(actualMissing * 100000),
      e3Disposition: "EXPAND_EXISTING_CP012_MIXED_SYNTHESIS_NO_NEW_QL",
    }) }),
  });
}

function powerRootChain(seed: number): SapE2Package {
  const p = seed - 1, correctIndex = p % 4;
  const q = (seed - 1) / 3;
  const g = 3 + (q % 3);
  const root = 6 + ((q * 5) % 17);
  const denominatorExponent = 1 + (q % 3);
  const missingExponent = 2 + ((q * 3) % 4);
  const numeratorExponent = denominatorExponent + missingExponent;
  const radicand = root * root + off(seed, 0);
  const g1 = g + off(seed, 1), g2 = g + off(seed, 2), scale = root + off(seed, 3);
  const actualLeft = Math.sqrt(radicand) * g1 ** numeratorExponent / g2 ** denominatorExponent;
  const actualMissing = actualLeft / scale;
  const answer = ipow(g, missingExponent), answerText = String(answer);
  return packageE2({
    profile: "BANK", checkpointId: "SAP-CP-012", structureId: SAP_CP012_E3_EXPLICIT_POWER_REVERSE, seed,
    difficulty: "HARD", decisionCount: 8,
    stem: `What approximate value should replace ? in ${e2Math(`${squareRoot(fmt(radicand, 3))} \\times (${fmt(g1, 3)})^{${numeratorExponent}} \\div (${fmt(g2, 3)})^{${denominatorExponent}} = ? \\times ${fmt(scale, 3)}`)}?`,
    canonicalAnswer: answerText,
    options: optionSet(answerText, correctIndex, [
      wrong(String(ipow(g, Math.max(1, missingExponent - 1))), "POWER_DIFFERENCE_ONE_LOW", "The root is handled correctly, but the difference of the two explicit exponents is taken one too low."),
      wrong(String(ipow(g, missingExponent + 1)), "POWER_DIFFERENCE_ONE_HIGH", "The root is handled correctly, but the difference of the two explicit exponents is taken one too high."),
      wrong(String(missingExponent), "REPORT_EXPONENT_NOT_POWER", "The exponent difference is found correctly, but that exponent is reported instead of evaluating the remaining power of the common base."),
    ]), correctIndex,
    explanation: Object.freeze({
      coreConcept: "Use the nearby perfect square, cancel the matching scale, and subtract the explicit common-base exponents before evaluating the remaining power.",
      steps: Object.freeze([
        `${squareRoot(root * root)} = ${root}; the factor ${root} cancels with the right-side scale after approximation.`,
        `So ? ≈ ${g}^(${numeratorExponent}-${denominatorExponent}) = ${g}^${missingExponent} = ${answer}.`,
      ]),
      finalAnswer: `Therefore, ? ≈ ${answer}.`,
    }),
    oracle: Object.freeze({ kind: SAP_CP012_E3_EXPLICIT_POWER_REVERSE, data: Object.freeze({
      mode: "POWER_ROOT_CHAIN", g, root, numeratorExponent, denominatorExponent, missingExponent, answer,
      radicand_1000: Math.round(radicand * 1000), g1_1000: Math.round(g1 * 1000), g2_1000: Math.round(g2 * 1000), scale_1000: Math.round(scale * 1000),
      actualMissing_100000: Math.round(actualMissing * 100000), e3Disposition: "EXPAND_EXISTING_CP012_MIXED_SYNTHESIS_NO_NEW_QL",
    }) }),
  });
}

function missingExponentChain(seed: number): SapE2Package {
  const p = seed - 1, correctIndex = p % 4;
  const q = seed / 3 - 1;
  const g = 3 + (q % 4);
  const a = 2 + (q % 3);
  const b = 2 + (q % 2) * 2;
  const c = 2 + (q % 5);
  const outerExponent = 2;
  const answerExponent = 3 + ((q * 7) % 6);
  const finalExponent = answerExponent - a - b + outerExponent * (c + 1);
  const g1 = g + off(seed, 0), g2 = g + off(seed, 1), g3 = g + off(seed, 2), g4 = g + off(seed, 3), g5 = g + off(seed, 4), g6 = g + off(seed, 5);
  const denominatorBlock = (g3 ** c * g4) ** outerExponent;
  const actualLeft = g1 ** a * g2 ** b / denominatorBlock * g5 ** finalExponent;
  const actualExponent = Math.log(actualLeft) / Math.log(g6);
  const answerText = String(answerExponent);
  return packageE2({
    profile: "BANK", checkpointId: "SAP-CP-012", structureId: SAP_CP012_E3_EXPLICIT_POWER_REVERSE, seed,
    difficulty: "HARD", decisionCount: 9,
    stem: `What approximate value should replace ? in ${e2Math(`\\frac{(${fmt(g1, 3)})^{${a}} \\times (${fmt(g2, 3)})^{${b}}}{\\left((${fmt(g3, 3)})^{${c}} \\times ${fmt(g4, 3)}\\right)^{${outerExponent}}} \\times (${fmt(g5, 3)})^{${finalExponent}} = (${fmt(g6, 3)})^{?}`)}?`,
    canonicalAnswer: answerText,
    options: optionSet(answerText, correctIndex, [
      wrong(String(answerExponent - 1), "EXPONENT_ONE_LOW", "The common-base exponent arithmetic is carried through, but the final exponent is one too low."),
      wrong(String(answerExponent + 1), "EXPONENT_ONE_HIGH", "The common-base exponent arithmetic is carried through, but the final exponent is one too high."),
      wrong(String(answerExponent + c + 1), "IGNORE_OUTER_DENOMINATOR_POWER", "The outer power on the denominator block is ignored, so too little exponent is subtracted from the numerator total."),
    ]), correctIndex,
    explanation: Object.freeze({
      coreConcept: "Round all near-equal bases to one common base, expand the power on the denominator block, then equate the resulting exponents.",
      steps: Object.freeze([
        `Using ${g} as the common base, the denominator contributes exponent ${outerExponent} × (${c}+1) = ${outerExponent * (c + 1)}.`,
        `Hence ? ≈ ${a} + ${b} + ${finalExponent} - ${outerExponent * (c + 1)} = ${answerExponent}.`,
      ]),
      finalAnswer: `Therefore, ? ≈ ${answerExponent}.`,
    }),
    oracle: Object.freeze({ kind: SAP_CP012_E3_EXPLICIT_POWER_REVERSE, data: Object.freeze({
      mode: "MISSING_EXPONENT", g, a, b, c, outerExponent, finalExponent, answerExponent,
      g1_1000: Math.round(g1 * 1000), g2_1000: Math.round(g2 * 1000), g3_1000: Math.round(g3 * 1000), g4_1000: Math.round(g4 * 1000), g5_1000: Math.round(g5 * 1000), g6_1000: Math.round(g6 * 1000),
      actualMissing_100000: Math.round(actualExponent * 100000), e3Disposition: "EXPAND_EXISTING_CP012_MIXED_SYNTHESIS_NO_NEW_QL",
    }) }),
  });
}

export function generateSapCp012E3(seed: number): SapE2Package {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("CP012 E3 seed must be 1..100.");
  if (seed % 3 === 0) return missingExponentChain(seed);
  if (seed % 3 === 1) return powerRootChain(seed);
  return powerChain(seed);
}
