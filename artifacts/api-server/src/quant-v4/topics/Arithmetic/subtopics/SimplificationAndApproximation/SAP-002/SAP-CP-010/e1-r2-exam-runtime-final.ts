import {
  e1r2Math,
  numericOptions,
  squareRoot,
  type SapE1R2Package,
} from "../../SAP-E1-R2-TYPES";
import {
  SAP_CP010_E1_R2_STRUCTURES,
  generateSapCp010E1R2 as generateCandidate,
  type SapCp010E1R2Structure,
} from "./e1-r2-exam-runtime";

export { SAP_CP010_E1_R2_STRUCTURES };
export type { SapCp010E1R2Structure };

const ROOT_HUNDREDTHS: Readonly<Record<number, number>> = Object.freeze({
  2: 141,
  3: 173,
  5: 224,
  6: 245,
  7: 265,
  10: 316,
  11: 332,
  15: 387,
});

function roundHalfUp2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function fmt(value: number, places = 2): string {
  const rounded = Math.round((value + Number.EPSILON) * 10 ** places) / 10 ** places;
  return rounded.toFixed(places).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function suppliedHundredths(q: SapE1R2Package): number {
  const direct = Number(q.oracle.data.suppliedHundredths);
  if (Number.isFinite(direct) && direct > 0) return direct;
  const n = Number(q.oracle.data.n);
  const value = ROOT_HUNDREDTHS[n];
  if (!value) throw new Error(`${q.structureId}/${q.seed}: missing supplied-root value for ${n}.`);
  return value;
}

function expected(q: SapE1R2Package): number {
  const d = q.oracle.data;
  const h = suppliedHundredths(q);
  switch (q.structureId) {
    case "CP010-R2-SUPPLIED-ROOT-PLUS":
      return Number(d.factor) * h / 100 + Number(d.c);
    case "CP010-R2-SUPPLIED-ROOT-PRODUCT":
      return Number(d.m) * Number(d.factor) * h / 100 - Number(d.c);
    case "CP010-R2-SUPPLIED-ROOT-DECIMAL-SCALE":
      return Number(d.factor) * h / 1000 + Number(d.c);
    case "CP010-R2-SUPPLIED-ROOT-MIXED":
      return Number(d.m) * Number(d.factor) * h / 100 + Number(d.c);
    case "CP010-R2-SUPPLIED-ROOT-DIFFERENCE":
      return 2 * h / 100 + Number(d.c);
    case "CP010-R2-SUPPLIED-ROOT-QUOTIENT":
      return (Number(d.factor) * h / 100 + Number(d.c)) / Number(d.q);
    default:
      return Number(q.canonicalAnswer);
  }
}

function suppliedSteps(q: SapE1R2Package, answer: number): readonly string[] {
  const d = q.oracle.data;
  const n = Number(d.n);
  const h = suppliedHundredths(q);
  const supplied = h / 100;
  const factor = Number(d.factor);
  const scaled = factor * supplied;

  switch (q.structureId) {
    case "CP010-R2-SUPPLIED-ROOT-PLUS":
      return Object.freeze([
        `${e1r2Math(`${squareRoot(d.target)} = ${factor}${squareRoot(n)}`)}, so ${e1r2Math(squareRoot(d.target))} ≈ ${fmt(scaled)}.`,
        `${fmt(scaled)} + ${Number(d.c)} ≈ ${fmt(answer)}.`,
      ]);
    case "CP010-R2-SUPPLIED-ROOT-PRODUCT":
      return Object.freeze([
        `${e1r2Math(`${squareRoot(d.target)} = ${factor}${squareRoot(n)}`)}, so ${e1r2Math(squareRoot(d.target))} ≈ ${fmt(scaled)}.`,
        `${Number(d.m)} × ${fmt(scaled)} - ${Number(d.c)} ≈ ${fmt(answer)}.`,
      ]);
    case "CP010-R2-SUPPLIED-ROOT-DECIMAL-SCALE": {
      const scaledDecimal = factor * supplied / 10;
      return Object.freeze([
        `${e1r2Math(`${squareRoot(d.target)} = \\frac{${factor}}{10}${squareRoot(n)}`)} ≈ ${fmt(scaledDecimal, 3)}.`,
        `${fmt(scaledDecimal, 3)} + ${Number(d.c)} = ${fmt(scaledDecimal + Number(d.c), 3)} ≈ ${fmt(answer)}.`,
      ]);
    }
    case "CP010-R2-SUPPLIED-ROOT-MIXED":
      return Object.freeze([
        `${e1r2Math(`${squareRoot(d.target)} = ${factor}${squareRoot(n)}`)}, so ${e1r2Math(squareRoot(d.target))} ≈ ${fmt(scaled)}.`,
        `${Number(d.m)} × ${fmt(scaled)} + ${Number(d.c)} ≈ ${fmt(answer)}.`,
      ]);
    case "CP010-R2-SUPPLIED-ROOT-DIFFERENCE": {
      const f1 = Number(d.factor1), f2 = Number(d.factor2);
      return Object.freeze([
        `${e1r2Math(`${squareRoot(d.target1)} - ${squareRoot(d.target2)} = (${f1}-${f2})${squareRoot(n)} = 2${squareRoot(n)}`)}.`,
        `2 × ${fmt(supplied)} + ${Number(d.c)} ≈ ${fmt(answer)}.`,
      ]);
    }
    case "CP010-R2-SUPPLIED-ROOT-QUOTIENT": {
      const numerator = scaled + Number(d.c);
      return Object.freeze([
        `${e1r2Math(squareRoot(d.target))} ≈ ${fmt(scaled)}, so the numerator is approximately ${fmt(numerator)}.`,
        `${fmt(numerator)} ÷ ${Number(d.q)} ≈ ${fmt(answer)}.`,
      ]);
    }
    default:
      return q.explanation.steps;
  }
}

function correctSupplied(q: SapE1R2Package): SapE1R2Package {
  if (!q.structureId.includes("SUPPLIED-ROOT")) return q;
  const answerNumber = roundHalfUp2(expected(q));
  const answer = fmt(answerNumber);
  const options = numericOptions(answerNumber, q.correctIndex, 0.1, 2);
  const steps = suppliedSteps(q, answerNumber);
  const explanation = Object.freeze({
    ...q.explanation,
    steps,
    finalAnswer: `Therefore, the approximate value is ${answer}.`,
  });
  const data = Object.freeze({ ...q.oracle.data, finalHundredths: Math.round(answerNumber * 100) });
  const payload = JSON.stringify({
    profile: q.profile,
    checkpointId: q.checkpointId,
    structureId: q.structureId,
    seed: q.seed,
    stem: q.stem,
    answer,
    data,
    presentation: "DETERMINISTIC_HALF_UP_V2",
  });
  const errors = [...q.validation.errors].filter(error => !/answer-bound/i.test(error));
  if (options[q.correctIndex]?.value !== answer) errors.push("Corrected supplied-root option is not answer-bound.");
  if (new Set(options.map(option => option.value)).size !== 4) errors.push("Corrected supplied-root options are not distinct.");
  return Object.freeze({
    ...q,
    canonicalAnswer: answer,
    options,
    explanation,
    oracle: Object.freeze({ ...q.oracle, data }),
    canonicalPayloadKey: payload,
    generationIdentity: `${q.generationIdentity}:FINAL-HALF-UP:${payload}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

export function generateSapCp010E1R2(structureId: SapCp010E1R2Structure, seed: number): SapE1R2Package {
  return correctSupplied(generateCandidate(structureId, seed));
}
