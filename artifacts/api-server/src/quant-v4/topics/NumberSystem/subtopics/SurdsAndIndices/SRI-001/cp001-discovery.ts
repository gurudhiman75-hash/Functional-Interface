import { proofEvent, sriInt, sriPick } from "../../../../../shared/surds-indices";
import { finalizeSriDiscoveryQuestion, type SriDistractor } from "../discovery-runtime";
import type { SriCandidateAnswer, SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";

export const SRI_CP001_CANDIDATES: readonly SriCandidateDescriptor[] = [
  { candidateId: "C001-A", checkpointId: "SRI-CP-001", title: "multiply same-base integer powers", sourceDisposition: "KEEP" },
  { candidateId: "C001-B", checkpointId: "SRI-CP-001", title: "divide same-base integer powers", sourceDisposition: "KEEP" },
  { candidateId: "C001-C", checkpointId: "SRI-CP-001", title: "power raised to a power", sourceDisposition: "KEEP" },
  { candidateId: "C001-D", checkpointId: "SRI-CP-001", title: "mixed product/quotient compression", sourceDisposition: "KEEP" },
  { candidateId: "C001-E", checkpointId: "SRI-CP-001", title: "zero exponent with non-zero base", sourceDisposition: "NEW" },
  { candidateId: "C001-F", checkpointId: "SRI-CP-001", title: "multiply different bases carrying the same exponent", sourceDisposition: "NEW" },
  { candidateId: "C001-G", checkpointId: "SRI-CP-001", title: "divide different bases carrying the same exponent", sourceDisposition: "NEW" },
  { candidateId: "C001-H", checkpointId: "SRI-CP-001", title: "choose an equivalent expression using index laws", sourceDisposition: "EXPAND" },
] as const;

function powBigInt(base: number, exponent: number): bigint {
  let result = 1n;
  const b = BigInt(base);
  for (let i = 0; i < exponent; i += 1) result *= b;
  return result;
}

function valueAnswer(text: string, value: bigint): SriCandidateAnswer {
  return { text, canonicalKey: `V:${value}` };
}

function expressionDistractors(items: readonly { text: string; value: bigint; misconceptionId: string }[]): SriDistractor[] {
  const seen = new Set<string>();
  const output: SriDistractor[] = [];
  for (const item of items) {
    const canonicalKey = `V:${item.value}`;
    if (!seen.has(canonicalKey)) {
      seen.add(canonicalKey);
      output.push({ text: item.text, canonicalKey, misconceptionId: item.misconceptionId });
    }
  }
  return output;
}

function common(
  candidateId: string,
  seed: string,
  state: Readonly<Record<string, string | number | boolean>>,
  stem: string,
  answer: SriCandidateAnswer,
  verifierKey: string,
  distractors: readonly SriDistractor[],
  method: string,
  working: readonly string[],
): SriDiscoveryQuestion {
  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-001",
    checkpointId: "SRI-CP-001",
    candidateId,
    seed,
    state,
    stem,
    answer,
    canonicalSolverKey: answer.canonicalKey,
    independentVerifierKey: verifierKey,
    distractors,
    explanation: {
      given: stem.replace(/\?$/, ""),
      asked: "Simplify the index expression using the applicable law.",
      method,
      working,
      answer: answer.text,
    },
    proofEvents: [proofEvent("SOLVE", method, { stem }, { answer: answer.text })],
  });
}

export function generateSriCp001Candidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  const base = sriPick(`${seed}:base`, [2, 3, 5, 7]);
  const m = sriInt(`${seed}:m`, 2, 5);
  const n = sriInt(`${seed}:n`, 2, 5);

  switch (candidateId) {
    case "C001-A": {
      const exponent = m + n;
      const value = powBigInt(base, m) * powBigInt(base, n);
      const answer = valueAnswer(`${base}^${exponent}`, powBigInt(base, exponent));
      return common(candidateId, seed, { base, m, n }, `Simplify ${base}^${m} × ${base}^${n}.`, answer, `V:${value}`,
        expressionDistractors([
          { text: `${base}^${m * n}`, value: powBigInt(base, m * n), misconceptionId: "MULTIPLY_EXPONENTS" },
          { text: `${base}^${Math.abs(m - n)}`, value: powBigInt(base, Math.abs(m - n)), misconceptionId: "SUBTRACT_EXPONENTS" },
          { text: `${base * base}^${m + n}`, value: powBigInt(base * base, m + n), misconceptionId: "MULTIPLY_BASES_TOO" },
          { text: `${base}^${m + n + 1}`, value: powBigInt(base, m + n + 1), misconceptionId: "OFF_BY_ONE" },
        ]),
        "For the same base, multiplication adds exponents.", [`${base}^${m} × ${base}^${n} = ${base}^(${m}+${n})`, `= ${base}^${exponent}`]);
    }
    case "C001-B": {
      const top = m + n + 1;
      const exponent = top - n;
      const numerator = powBigInt(base, top);
      const denominator = powBigInt(base, n);
      const value = numerator / denominator;
      const answer = valueAnswer(`${base}^${exponent}`, powBigInt(base, exponent));
      return common(candidateId, seed, { base, top, n }, `Simplify ${base}^${top} ÷ ${base}^${n}.`, answer, `V:${value}`,
        expressionDistractors([
          { text: `${base}^${top + n}`, value: powBigInt(base, top + n), misconceptionId: "ADD_ON_DIVISION" },
          { text: `${base}^${top * n}`, value: powBigInt(base, top * n), misconceptionId: "MULTIPLY_EXPONENTS" },
          { text: `${base}^${exponent + 1}`, value: powBigInt(base, exponent + 1), misconceptionId: "OFF_BY_ONE" },
        ]),
        "For the same base, division subtracts the denominator exponent.", [`${base}^${top} ÷ ${base}^${n} = ${base}^(${top}-${n})`, `= ${base}^${exponent}`]);
    }
    case "C001-C": {
      // Five bases break the modulo-4 correlation between base, m and n in the deterministic picker.
      const powerBase = sriPick(`${seed}:power-base`, [2, 3, 5, 7, 11]);
      const exponent = m * n;
      const value = powBigInt(powSmall(powerBase, m), n);
      const answer = valueAnswer(`${powerBase}^${exponent}`, powBigInt(powerBase, exponent));
      return common(candidateId, seed, { base: powerBase, m, n }, `Simplify (${powerBase}^${m})^${n}.`, answer, `V:${value}`,
        expressionDistractors([
          { text: `${powerBase}^${m + n}`, value: powBigInt(powerBase, m + n), misconceptionId: "ADD_EXPONENTS_IN_POWER" },
          { text: `${powerBase * n}^${m}`, value: powBigInt(powerBase * n, m), misconceptionId: "MULTIPLY_BASE_BY_OUTER" },
          { text: `${powerBase}^${Math.abs(m - n)}`, value: powBigInt(powerBase, Math.abs(m - n)), misconceptionId: "SUBTRACT_EXPONENTS" },
        ]),
        "A power raised to another power multiplies the exponents.", [`(${powerBase}^${m})^${n} = ${powerBase}^(${m}×${n})`, `= ${powerBase}^${exponent}`]);
    }
    case "C001-D": {
      const p = sriInt(`${seed}:p`, 1, Math.max(1, m + n - 1));
      const exponent = m + n - p;
      const value = (powBigInt(base, m) * powBigInt(base, n)) / powBigInt(base, p);
      const answer = valueAnswer(`${base}^${exponent}`, powBigInt(base, exponent));
      return common(candidateId, seed, { base, m, n, p }, `Simplify (${base}^${m} × ${base}^${n}) ÷ ${base}^${p}.`, answer, `V:${value}`,
        expressionDistractors([
          { text: `${base}^${m + n + p}`, value: powBigInt(base, m + n + p), misconceptionId: "ADD_ALL_EXPONENTS" },
          { text: `${base}^${Math.abs(m - n - p)}`, value: powBigInt(base, Math.abs(m - n - p)), misconceptionId: "WRONG_OPERATION_ORDER" },
          { text: `${base}^${m * n - p}`, value: powBigInt(base, Math.max(0, m * n - p)), misconceptionId: "MULTIPLY_PRODUCT_EXPONENTS" },
        ]),
        "Combine same-base factors by adding numerator exponents and subtracting the denominator exponent.", [`Exponent = ${m}+${n}-${p} = ${exponent}`, `So the expression is ${base}^${exponent}.`]);
    }
    case "C001-E": {
      const zeroBase = sriPick(`${seed}:zero-base`, [2, 3, 5, 7, 11, 13, 17]);
      const value = 1n;
      const answer = valueAnswer("1", value);
      return common(candidateId, seed, { base: zeroBase }, `Find the value of ${zeroBase}^0.`, answer, "V:1",
        expressionDistractors([
          { text: "0", value: 0n, misconceptionId: "ZERO_EXPONENT_GIVES_ZERO" },
          { text: `${zeroBase}`, value: BigInt(zeroBase), misconceptionId: "IGNORE_EXPONENT" },
          { text: `${zeroBase}^2`, value: powBigInt(zeroBase, 2), misconceptionId: "REPLACE_ZERO_WITH_TWO" },
        ]),
        "Any non-zero number raised to the power 0 equals 1.", [`${zeroBase} ≠ 0`, `${zeroBase}^0 = 1`]);
    }
    case "C001-F": {
      const secondBase = sriPick(`${seed}:second-base`, [2, 3, 4, 5].filter((x) => x !== base));
      const exponent = sriInt(`${seed}:shared-exp`, 2, 4);
      const combinedBase = base * secondBase;
      const value = powBigInt(base, exponent) * powBigInt(secondBase, exponent);
      const answer = valueAnswer(`${combinedBase}^${exponent}`, powBigInt(combinedBase, exponent));
      return common(candidateId, seed, { base, secondBase, exponent }, `Simplify ${base}^${exponent} × ${secondBase}^${exponent}.`, answer, `V:${value}`,
        expressionDistractors([
          { text: `${base + secondBase}^${exponent}`, value: powBigInt(base + secondBase, exponent), misconceptionId: "ADD_BASES" },
          { text: `${combinedBase}^${exponent * 2}`, value: powBigInt(combinedBase, exponent * 2), misconceptionId: "DOUBLE_SHARED_EXPONENT" },
          { text: `${base * secondBase}`, value: BigInt(base * secondBase), misconceptionId: "DROP_EXPONENT" },
        ]),
        "When the exponent is the same, multiply the bases and retain that exponent.", [`${base}^${exponent} × ${secondBase}^${exponent} = (${base}×${secondBase})^${exponent}`, `= ${combinedBase}^${exponent}`]);
    }
    case "C001-G": {
      const pair = sriPick(`${seed}:pair`, [[6, 3], [8, 4], [10, 5], [12, 4]] as const);
      const exponent = sriInt(`${seed}:shared-exp`, 2, 4);
      const quotientBase = pair[0] / pair[1];
      const value = powBigInt(pair[0], exponent) / powBigInt(pair[1], exponent);
      const answer = valueAnswer(`${quotientBase}^${exponent}`, powBigInt(quotientBase, exponent));
      return common(candidateId, seed, { numeratorBase: pair[0], denominatorBase: pair[1], exponent }, `Simplify ${pair[0]}^${exponent} ÷ ${pair[1]}^${exponent}.`, answer, `V:${value}`,
        expressionDistractors([
          { text: `${pair[0] - pair[1]}^${exponent}`, value: powBigInt(pair[0] - pair[1], exponent), misconceptionId: "SUBTRACT_BASES" },
          { text: `${quotientBase}^${exponent * 2}`, value: powBigInt(quotientBase, exponent * 2), misconceptionId: "DOUBLE_SHARED_EXPONENT" },
          { text: `${quotientBase}`, value: BigInt(quotientBase), misconceptionId: "DROP_EXPONENT" },
        ]),
        "When equal exponents are divided, divide the bases and retain the exponent.", [`${pair[0]}^${exponent} ÷ ${pair[1]}^${exponent} = (${pair[0]}/${pair[1]})^${exponent}`, `= ${quotientBase}^${exponent}`]);
    }
    case "C001-H": {
      const p = sriInt(`${seed}:p`, 1, Math.max(1, m + n - 1));
      const exponent = m + n - p;
      const value = (powBigInt(base, m) * powBigInt(base, n)) / powBigInt(base, p);
      const answer = valueAnswer(`${base}^${exponent}`, value);
      return common(candidateId, seed, { base, m, n, p }, `Which expression is equivalent to (${base}^${m} × ${base}^${n})/${base}^${p}?`, answer, `V:${value}`,
        expressionDistractors([
          { text: `${base}^${m + n + p}`, value: powBigInt(base, m + n + p), misconceptionId: "ADD_DENOMINATOR_EXPONENT" },
          { text: `${base}^${m * n - p}`, value: powBigInt(base, Math.max(0, m * n - p)), misconceptionId: "MULTIPLY_NUMERATOR_EXPONENTS" },
          { text: `${base}^${Math.abs(m - n - p)}`, value: powBigInt(base, Math.abs(m - n - p)), misconceptionId: "SUBTRACT_ALL_EXPONENTS" },
        ]),
        "Reduce the expression to one same-base exponent and choose the matching form.", [`${m}+${n}-${p} = ${exponent}`, `Equivalent form: ${base}^${exponent}`]);
    }
    default:
      throw new Error(`Unknown SRI-CP-001 candidate: ${candidateId}`);
  }
}

function powSmall(base: number, exponent: number): number {
  let result = 1;
  for (let i = 0; i < exponent; i += 1) result *= base;
  return result;
}
