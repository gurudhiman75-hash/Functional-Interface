import type { SapCp004Package } from "./runtime";
import { applySapCp004ExplanationRemediation } from "./explanation-remediation-v2";

type Explanation = SapCp004Package["explanation"];

function power(base: bigint, exponent: number): bigint {
  let result = 1n;
  for (let index = 0; index < exponent; index += 1) result *= base;
  return result;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}

function ordinalName(index: number): string {
  if (index === 4) return "fourth";
  if (index === 5) return "fifth";
  return `${index}th`;
}

function explanation(coreConcept: string, steps: readonly string[], answer: string): Explanation {
  return Object.freeze({
    coreConcept,
    steps: Object.freeze([...steps]),
    finalAnswer: `Answer: ${answer}.`,
  });
}

function refine(pkg: SapCp004Package): SapCp004Package {
  const data = pkg.oracle.data;
  const mode = data.mode ?? 0;
  let revised = pkg.explanation;

  if (pkg.prototypeId === "SAP-CP004-PROT-ZERO-ONE-EXPONENT" && mode === 2) {
    const base = data.base!;
    const other = data.other!;
    const multiplier = data.multiplier!;
    revised = explanation(
      "Resolve the zero and first powers before applying the coefficient and final addition.",
      [
        `${base}^0 = 1 and ${other}^1 = ${other}.`,
        `${multiplier} × 1 + ${other} = ${multiplier} + ${other} = ${pkg.canonicalAnswer}.`,
      ],
      pkg.canonicalAnswer,
    );
  }

  if (pkg.prototypeId === "SAP-CP004-PROT-NEGATIVE-BASE-PARITY") {
    const base = data.base!;
    const exponent = data.exponent!;
    const signedPower = power(BigInt(-base), exponent);
    const parity = exponent % 2 === 0 ? "even" : "odd";
    const signEffect = exponent % 2 === 0 ? "positive" : "negative";
    const core = `The parentheses make −${base} the complete base; this is different from a minus written outside the power. An ${parity} exponent makes the powered value ${signEffect}.`;
    if (mode === 1) {
      revised = explanation(core, [`(-${base})^${exponent} = ${signedPower}.`, `${data.add!} - (${signedPower}) = ${pkg.canonicalAnswer}.`], pkg.canonicalAnswer);
    } else if (mode === 2) {
      const product = BigInt(data.multiplier!) * signedPower;
      revised = explanation(core, [
        `(-${base})^${exponent} = ${signedPower}.`,
        `${data.multiplier!} × ${signedPower} = ${product}.`,
        `${product} + ${data.add!} = ${pkg.canonicalAnswer}.`,
      ], pkg.canonicalAnswer);
    } else if (mode === 3) {
      revised = explanation(core, [`(-${base})^${exponent} = ${signedPower}.`, `${signedPower} - ${data.add!} = ${pkg.canonicalAnswer}.`], pkg.canonicalAnswer);
    } else {
      revised = explanation(core, [`(-${base})^${exponent} = ${signedPower}.`, `${signedPower} + ${data.add!} = ${pkg.canonicalAnswer}.`], pkg.canonicalAnswer);
    }
  }

  if (pkg.prototypeId === "SAP-CP004-PROT-FRACTION-POWER") {
    const numerator = BigInt(data.numerator!);
    const denominator = BigInt(data.denominator!);
    const exponent = data.exponent!;
    const common = gcd(numerator, denominator);
    if (common > 1n) {
      const reducedNumerator = numerator / common;
      const reducedDenominator = denominator / common;
      revised = explanation(
        "Fast method: reduce the fraction first, then apply the power to the smaller numerator and denominator.",
        [
          `${numerator}/${denominator} = ${reducedNumerator}/${reducedDenominator}.`,
          `(${reducedNumerator}/${reducedDenominator})^${exponent} = ${power(reducedNumerator, exponent)}/${power(reducedDenominator, exponent)}.`,
        ],
        pkg.canonicalAnswer,
      );
    }
  }

  if (pkg.prototypeId === "SAP-CP004-PROT-BOUNDED-NTH-ROOT") {
    const root = data.root!;
    const index = data.index!;
    const radicand = data.radicand!;
    const ordinal = ordinalName(index);
    revised = explanation(
      `Recognise the perfect ${ordinal} power; the principal ${ordinal} root is the positive base that produces it.`,
      [`${root}^${index} = ${radicand}.`, `So the principal ${ordinal} root of ${radicand} is ${root}.`],
      pkg.canonicalAnswer,
    );
  }

  if (pkg.prototypeId === "SAP-CP004-PROT-EXACT-ROOT-OF-FRACTION") {
    const numeratorRoot = BigInt(data.numeratorRoot!);
    const denominatorRoot = BigInt(data.denominatorRoot!);
    const index = data.index!;
    const numerator = power(numeratorRoot, index);
    const denominator = power(denominatorRoot, index);
    const numeratorExpression = index === 2 ? `√${numerator}` : `∛${numerator}`;
    const denominatorExpression = index === 2 ? `√${denominator}` : `∛${denominator}`;
    const fullExpression = index === 2 ? `√(${numerator}/${denominator})` : `∛(${numerator}/${denominator})`;
    const common = gcd(numeratorRoot, denominatorRoot);
    const steps = [
      `${numeratorExpression} = ${numeratorRoot} and ${denominatorExpression} = ${denominatorRoot}.`,
      `${fullExpression} = ${numeratorRoot}/${denominatorRoot}.`,
    ];
    if (common > 1n) {
      steps.push(`Divide numerator and denominator by ${common}: ${numeratorRoot}/${denominatorRoot} = ${pkg.canonicalAnswer}.`);
    } else {
      steps.push(`${numeratorRoot} and ${denominatorRoot} are coprime, so ${numeratorRoot}/${denominatorRoot} is already reduced.`);
    }
    revised = explanation(
      "Take the exact root of the numerator and denominator separately, then reduce only when a common factor exists.",
      steps,
      pkg.canonicalAnswer,
    );
  }

  if (pkg.prototypeId === "SAP-CP004-PROT-POWER-ROOT-CANCELLATION") {
    const base = data.base!;
    const index = data.index ?? 2;
    const isProductSurface = pkg.stem.includes(" × ");
    const displayedStructure = isProductSurface
      ? index === 2
        ? `√(${base} × ${base})`
        : `∛(${base} × ${base} × ${base})`
      : index === 2
        ? `√(${base}^2)`
        : `∛(${base}^3)`;
    revised = explanation(
      "Fast method: do not expand the large power or product; the matching root and power structure undo each other for this positive base.",
      [`${displayedStructure} = ${base}.`, `${base} + ${data.add!} = ${pkg.canonicalAnswer}.`],
      pkg.canonicalAnswer,
    );
  }

  const errors = [...pkg.validation.errors];
  if (revised.steps.length < 2 || revised.steps.length > 4) errors.push("The refined explanation must contain two to four focused steps.");
  if (revised.finalAnswer !== `Answer: ${pkg.canonicalAnswer}.`) errors.push("The refined explanation final line is not exactly answer-bound.");
  if (revised.steps.some((step) => /=\s*(-?\d+(?:\/\d+)?)\s*=\s*\1\.$/.test(step))) {
    errors.push("A repeated terminal result remains in the refined explanation.");
  }

  return Object.freeze({
    ...pkg,
    explanation: revised,
    generationIdentity: `${pkg.generationIdentity}:EXPLANATION-V3`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

export function applySapCp004ExplanationRemediationV3(pkg: SapCp004Package): SapCp004Package {
  return refine(applySapCp004ExplanationRemediation(pkg));
}
