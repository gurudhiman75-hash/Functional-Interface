import {
  evaluateExactRationalPower,
  exactNthRoot,
  formatRational,
  proofEvent,
  rational,
  rationalExponent,
  rationalKey,
  sriInt,
  sriPick,
  type Rational,
} from "../../../../shared/surds-indices";
import { rationalAnswer, rationalDistractors } from "./discovery-answer-utils";
import { finalizeSriDiscoveryQuestion } from "./discovery-runtime";
import type { SriDiscoveryQuestion } from "./discovery-types";
import { classificationDistractors } from "./SRI-002/surd-discovery-utils";

export const SRI_SOURCE_SATURATION_OVERRIDE_IDS = new Set(["C002-F", "C007-D"] as const);

function pow(base: number, exponent: number): bigint {
  return BigInt(base) ** BigInt(exponent);
}

function exactDecimal(value: Rational): string {
  let denominator = value.denominator;
  let twos = 0;
  let fives = 0;
  while (denominator % 2n === 0n) {
    denominator /= 2n;
    twos += 1;
  }
  while (denominator % 5n === 0n) {
    denominator /= 5n;
    fives += 1;
  }
  if (denominator !== 1n) throw new Error("Exact decimal override requires a terminating rational");
  const places = Math.max(twos, fives);
  const scaled = value.numerator * (10n ** BigInt(places)) / value.denominator;
  const negative = scaled < 0n;
  const digits = (negative ? -scaled : scaled).toString().padStart(places + 1, "0");
  if (places === 0) return `${negative ? "-" : ""}${digits}`;
  const whole = digits.slice(0, -places) || "0";
  const fraction = digits.slice(-places).replace(/0+$/g, "");
  return `${negative ? "-" : ""}${whole}${fraction ? `.${fraction}` : ""}`;
}

function generateC002F(seed: string): SriDiscoveryQuestion {
  const denominator = sriPick(`${seed}:denominator`, [2, 3]);
  const numerator = sriPick(`${seed}:numerator`, [1, 2]);
  const q = sriPick(`${seed}:q`, [2, 5]);
  const p = sriPick(`${seed}:p`, [1, 3, 7, 9].filter((value) => value !== q && value % q !== 0));
  const baseValue = rational(pow(p, denominator), pow(q, denominator));
  const solver = evaluateExactRationalPower(baseValue, rationalExponent(numerator, denominator));
  const independent = rational(pow(p, numerator), pow(q, numerator));
  const displayAsDecimal = sriPick(`${seed}:surface-kind`, [true, false]);
  const baseText = displayAsDecimal ? exactDecimal(baseValue) : formatRational(baseValue);
  const answer = rationalAnswer(solver);
  const stem = sriPick(`${seed}:surface`, [
    `Evaluate (${baseText})^(${numerator}/${denominator}).`,
    `Find the exact value of (${baseText})^(${numerator}/${denominator}).`,
    `Use fractional-index laws to simplify (${baseText})^(${numerator}/${denominator}).`,
    `Evaluate the rational base (${baseText}) raised to ${numerator}/${denominator}.`,
  ]);
  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-001", checkpointId: "SRI-CP-002", candidateId: "C002-F", seed,
    state: { base: formatRational(baseValue), surfaceBase: baseText, displayAsDecimal, numerator, denominator, rootNumerator: p, rootDenominator: q },
    stem, answer,
    canonicalSolverKey: answer.canonicalKey,
    independentVerifierKey: `R:${rationalKey(independent)}`,
    distractors: rationalDistractors(solver),
    explanation: {
      given: `An exact rational base is raised to the fractional index ${numerator}/${denominator}.`,
      asked: "Evaluate the expression exactly.",
      method: "Treat the base as an exact rational number, take the denominator-th root of numerator and denominator, then apply the numerator power.",
      working: [
        `${formatRational(baseValue)} = (${p}/${q})^${denominator}`,
        `(${formatRational(baseValue)})^(${numerator}/${denominator}) = (${p}/${q})^${numerator}`,
        `= ${formatRational(independent)}.`,
      ],
      answer: answer.text,
    },
    proofEvents: [proofEvent("SOLVE", "exact rational fractional-index evaluation", { base: formatRational(baseValue), exponent: `${numerator}/${denominator}` }, { answer: answer.text })],
  });
}

function generateC007D(seed: string): SriDiscoveryQuestion {
  const index = sriPick(`${seed}:class-index`, [2, 3, 4, 5]);
  const rationalMode = sriPick(`${seed}:class-mode`, [true, false]);
  const root = sriInt(`${seed}:class-root`, 2, 6);
  const residual = sriPick(`${seed}:class-factor`, [2, 3, 5, 7]);
  const radicand = rationalMode ? pow(root, index) : pow(root, index) * BigInt(residual);
  const exact = exactNthRoot(radicand, index);
  const solverClass = exact === null ? "SURD" : "RATIONAL";
  const verifierClass = rationalMode ? "RATIONAL" : "SURD";
  const rootText = index === 2 ? `\\sqrt{${radicand}}` : `\\sqrt[${index}]{${radicand}}`;
  const answer = { text: solverClass === "RATIONAL" ? "Rational" : "Surd", canonicalKey: `T:${solverClass}` };
  const stem = sriPick(`${seed}:surface`, [
    `Classify ${rootText} as rational or a surd.`,
    `Is ${rootText} rational or a surd?`,
    `Determine whether ${rootText} has an exact rational value.`,
    `Choose the correct classification of the radical ${rootText}.`,
  ]);
  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-002", checkpointId: "SRI-CP-007", candidateId: "C007-D", seed,
    state: { radicand: radicand.toString(), index, rationalMode },
    stem, answer,
    canonicalSolverKey: answer.canonicalKey,
    independentVerifierKey: `T:${verifierClass}`,
    distractors: classificationDistractors(solverClass),
    explanation: {
      given: `A positive ${index}th-root radical is given.`,
      asked: "Classify it as rational or a surd.",
      method: `Check whether the radicand is an exact ${index}th power.`,
      working: exact === null
        ? [`${radicand} is not a perfect ${index}th power, so the radical remains irrational.`]
        : [`${radicand}=${exact}^${index}, so the radical equals ${exact}.`],
      answer: answer.text,
    },
    proofEvents: [proofEvent("NORMALIZE", "exact nth-power classification", { radicand: radicand.toString(), index: String(index) }, { class: solverClass })],
  });
}

export function generateSriSourceSaturationObjectOverride(candidateId: string, seed: string): SriDiscoveryQuestion {
  if (candidateId === "C002-F") return generateC002F(seed);
  if (candidateId === "C007-D") return generateC007D(seed);
  throw new Error(`Unknown SRI saturation object override: ${candidateId}`);
}
