import type { NumCp008PermanentPackage } from "./permanent-runtime.ts";

type State = Readonly<Record<string, unknown>>;

function n(state: State, key: string): number {
  const value = state[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value)) {
    throw new Error(`NUM-CP-008 explanation polish expected integer ${key}`);
  }
  return value;
}

function mod(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function inverse(a: number, modulus: number): number | undefined {
  for (let x = 1; x < modulus; x += 1) {
    if (mod(a * x, modulus) === 1) return x;
  }
  return undefined;
}

function lowerConclusion(step: string): string {
  return step
    .replace(/^Hence Only /u, "Hence only ")
    .replace(/^Therefore Both /u, "Therefore both ")
    .replace(/^Therefore Statement /u, "Therefore statement ")
    .replace(/^Therefore Exactly /u, "Therefore exactly ")
    .replace(/^Therefore More /u, "Therefore more ");
}

function polishExplanation(q: NumCp008PermanentPackage): NumCp008PermanentPackage["explanation"] {
  const state = q.hiddenState as State;

  if (q.temporaryPrototypeId === "NUM-CP008-PROT-003") {
    const base = n(state, "base");
    const exponent = n(state, "exponent");
    const divisor = n(state, "modulus");
    const answer = n(state, "residue");
    const first = mod(base, divisor);
    const square = mod(first * first, divisor);

    if (exponent >= 2 && square === 0) {
      return Object.freeze({
        coreConcept: "Sometimes a large power becomes easy after checking only the square of the base.",
        strategy: `We need the remainder of ${base}^${exponent} on division by ${divisor}. First check ${base}^2 before doing any longer power work.`,
        steps: Object.freeze([
          `${base}^2 = ${base * base}, and ${base * base} is exactly divisible by ${divisor}.`,
          `Since ${exponent} is at least 2, ${base}^${exponent} contains ${base}^2 as a factor and is therefore also divisible by ${divisor}.`,
          `So the required remainder is ${answer}.`,
        ]),
        finalAnswer: q.canonicalAnswer,
      });
    }
  }

  if (q.temporaryPrototypeId === "NUM-CP008-PROT-014") {
    const base = n(state, "base");
    const highestExponent = n(state, "highestExponent");
    const divisor = n(state, "modulus");
    const factor = base - 1;
    const inv = gcd(factor, divisor) === 1 ? inverse(factor, divisor) : undefined;
    const answer = Number(q.canonicalAnswer);

    if (factor > 0 && inv !== undefined && Number.isSafeInteger(answer)) {
      let powerRemainder = 1;
      for (let i = 0; i < highestExponent + 1; i += 1) {
        powerRemainder = mod(powerRemainder * base, divisor);
      }
      const numeratorRemainder = mod(powerRemainder - 1, divisor);
      const final = mod(numeratorRemainder * inv, divisor);

      return Object.freeze({
        coreConcept: "For a geometric sum, multiplying by one less than the base makes the middle terms cancel.",
        strategy: `Let S = 1 + ${base} + ${base}^2 + ... + ${base}^${highestExponent}. We need only the remainder of S when divided by ${divisor}.`,
        steps: Object.freeze([
          `${factor}S = ${base}^${highestExponent + 1} − 1.`,
          `${base}^${highestExponent + 1} leaves remainder ${powerRemainder}, so ${factor}S leaves remainder ${numeratorRemainder}.`,
          `${factor} × ${inv} leaves remainder 1 when divided by ${divisor}. Multiply the last remainder condition by ${inv}: S has the same remainder as ${numeratorRemainder} × ${inv}.`,
          `${numeratorRemainder} × ${inv} = ${numeratorRemainder * inv}, which leaves remainder ${final}. Therefore S leaves remainder ${answer}.`,
        ]),
        finalAnswer: q.canonicalAnswer,
      });
    }
  }

  const polishedSteps = q.explanation.steps.map(lowerConclusion);
  if (polishedSteps.some((step, index) => step !== q.explanation.steps[index])) {
    return Object.freeze({
      ...q.explanation,
      steps: Object.freeze(polishedSteps),
    });
  }

  return q.explanation;
}

export function polishNumCp008EnglishExplanationHumanV3(q: NumCp008PermanentPackage): NumCp008PermanentPackage {
  return Object.freeze({
    ...q,
    explanation: polishExplanation(q),
  }) as NumCp008PermanentPackage;
}
