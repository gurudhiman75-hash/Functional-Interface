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
import { integerAnswer, rationalAnswer, rationalDistractors } from "./discovery-answer-utils";
import { finalizeSriDiscoveryQuestion } from "./discovery-runtime";
import type { SriDiscoveryQuestion } from "./discovery-types";
import { classificationDistractors } from "./SRI-002/surd-discovery-utils";

export const SRI_SOURCE_SATURATION_OVERRIDE_IDS = new Set(["C002-F", "C007-D", "C012-B"] as const);

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
  const [numerator, denominator] = sriPick(`${seed}:fraction`, [[1, 2], [1, 3], [2, 3]] as const);
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
      given: `An exact rational base is raised to the reduced fractional index ${numerator}/${denominator}.`,
      asked: "Evaluate the expression exactly.",
      method: "Take the exact root indicated by the denominator from both numerator and denominator of the base, then apply the numerator power.",
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
  const rootName = index === 2 ? "square root" : index === 3 ? "cube root" : `${index}th root`;
  const powerName = index === 2 ? "perfect square" : index === 3 ? "perfect cube" : `perfect ${index}th power`;
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
      given: `A positive ${rootName} expression is given.`,
      asked: "Classify it as rational or a surd.",
      method: `Check whether the radicand is a ${powerName}.`,
      working: exact === null
        ? [`${radicand} is not a ${powerName}, so the radical remains irrational.`]
        : [`${radicand}=${exact}^${index}, so the radical equals ${exact}.`],
      answer: answer.text,
    },
    proofEvents: [proofEvent("NORMALIZE", "exact nth-power classification", { radicand: radicand.toString(), index: String(index) }, { class: solverClass })],
  });
}

function generateC012B(seed: string): SriDiscoveryQuestion {
  const [numerator, denominator] = sriPick(`${seed}:fraction`, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]] as const);
  const root = sriInt(`${seed}:root`, 2, 6);
  const visibleBase = Number(pow(root, denominator));
  const result = Number(pow(root, numerator));
  const answer = integerAnswer(result);
  const radical = denominator === 2
    ? `\\sqrt{${visibleBase}^{${numerator}}}`
    : `\\sqrt[${denominator}]{${visibleBase}^{${numerator}}}`;
  const powerName = denominator === 2 ? "perfect square" : denominator === 3 ? "perfect cube" : "perfect fourth power";
  const stem = sriPick(`${seed}:surface`, [
    `Evaluate ${visibleBase}^{${numerator}/${denominator}} by converting it to ${radical}.`,
    `Rewrite ${visibleBase}^{${numerator}/${denominator}} as a radical and simplify exactly.`,
    `Use radical form to find the exact value of ${visibleBase}^{${numerator}/${denominator}}.`,
    `Convert the fractional index ${visibleBase}^{${numerator}/${denominator}} to a root before evaluating it.`,
  ]);
  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-002", checkpointId: "SRI-CP-012", candidateId: "C012-B", seed,
    state: { root, visibleBase, numerator, denominator },
    stem, answer,
    canonicalSolverKey: answer.canonicalKey,
    independentVerifierKey: integerAnswer(result).canonicalKey,
    distractors: rationalDistractors(rational(result)),
    explanation: {
      given: `The base is a ${powerName}, and the exponent ${numerator}/${denominator} is already in lowest terms.`,
      asked: "Evaluate the fractional-index expression through its radical form.",
      method: "The denominator tells which root to take; the numerator tells which power to apply after taking that root.",
      working: [
        `${visibleBase}=${root}^${denominator}`,
        `${visibleBase}^{${numerator}/${denominator}}=(${root})^${numerator}=${result}`,
      ],
      answer: answer.text,
    },
    proofEvents: [proofEvent("SOLVE", "reduced fractional-index evaluation through exact radical form", { base: String(visibleBase), exponent: `${numerator}/${denominator}` }, { answer: String(result) })],
  });
}

export function generateSriSourceSaturationObjectOverride(candidateId: string, seed: string): SriDiscoveryQuestion {
  if (candidateId === "C002-F") return generateC002F(seed);
  if (candidateId === "C007-D") return generateC007D(seed);
  if (candidateId === "C012-B") return generateC012B(seed);
  throw new Error(`Unknown SRI saturation object override: ${candidateId}`);
}
