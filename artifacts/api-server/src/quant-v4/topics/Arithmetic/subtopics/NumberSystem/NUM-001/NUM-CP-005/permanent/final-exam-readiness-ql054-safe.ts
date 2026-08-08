import {
  buildOptions,
  math,
  wrong,
} from "./english-remediation-common";

const CASES = [
  { hiddenPrime: 2, exponent: 2, known: [{ prime: 3, exponent: 1 }] },
  { hiddenPrime: 3, exponent: 4, known: [{ prime: 5, exponent: 1 }] },
  { hiddenPrime: 2, exponent: 6, known: [{ prime: 7, exponent: 3 }, { prime: 13, exponent: 2 }] },
  { hiddenPrime: 5, exponent: 3, known: [{ prime: 2, exponent: 2 }] },
  { hiddenPrime: 3, exponent: 3, known: [{ prime: 7, exponent: 1 }] },
  { hiddenPrime: 2, exponent: 4, known: [{ prime: 5, exponent: 2 }, { prime: 7, exponent: 3 }] },
  { hiddenPrime: 7, exponent: 2, known: [{ prime: 2, exponent: 3 }] },
  { hiddenPrime: 2, exponent: 2, known: [{ prime: 3, exponent: 3 }] },
  { hiddenPrime: 2, exponent: 7, known: [{ prime: 7, exponent: 2 }, { prime: 17, exponent: 2 }] },
  { hiddenPrime: 11, exponent: 2, known: [{ prime: 2, exponent: 1 }, { prime: 3, exponent: 1 }] },
  { hiddenPrime: 5, exponent: 5, known: [{ prime: 2, exponent: 1 }] },
  { hiddenPrime: 3, exponent: 2, known: [{ prime: 2, exponent: 2 }, { prime: 5, exponent: 1 }] },
  { hiddenPrime: 2, exponent: 5, known: [{ prime: 3, exponent: 2 }] },
  { hiddenPrime: 7, exponent: 4, known: [{ prime: 2, exponent: 1 }] },
  { hiddenPrime: 3, exponent: 6, known: [{ prime: 2, exponent: 1 }, { prime: 5, exponent: 1 }] },
  { hiddenPrime: 5, exponent: 2, known: [{ prime: 2, exponent: 3 }, { prime: 3, exponent: 1 }] },
  { hiddenPrime: 2, exponent: 3, known: [{ prime: 5, exponent: 2 }] },
  { hiddenPrime: 13, exponent: 2, known: [{ prime: 2, exponent: 2 }] },
  { hiddenPrime: 3, exponent: 5, known: [{ prime: 7, exponent: 2 }] },
  { hiddenPrime: 2, exponent: 8, known: [{ prime: 3, exponent: 1 }] },
] as const;

function knownText(known) {
  return known.map(({ prime, exponent }) =>
    exponent === 1 ? String(prime) : `${prime}^{${exponent}}`).join(" \\times ");
}

function factorisationText(hiddenPrime, exponent, known) {
  return [
    exponent === 1 ? String(hiddenPrime) : `${hiddenPrime}^${exponent}`,
    ...known.map(({ prime, exponent: knownExponent }) =>
      knownExponent === 1 ? String(prime) : `${prime}^${knownExponent}`),
  ].join(" × ");
}

export function applyNumCp005FinalQl054Safe(source, result) {
  const selected = CASES[(source.seed - 1) % CASES.length];
  const knownChoiceProduct = selected.known.reduce(
    (value, { exponent }) => value * (exponent + 1),
    1,
  );
  const targetDivisorCount = (selected.exponent + 1) * knownChoiceProduct;
  const correct = String(selected.exponent);
  const candidates = [
    {
      value: String(selected.exponent + 1),
      id: "NUM-CP005-TRAP-RETURNED-CHOICE-COUNT",
      reason: "This is x+1, the number of exponent choices, not x.",
    },
    {
      value: String(Math.max(0, selected.exponent - 1)),
      id: "NUM-CP005-TRAP-SUBTRACTED-TWICE",
      reason: "After finding x+1, subtract 1 only once.",
    },
    {
      value: String(targetDivisorCount),
      id: "NUM-CP005-TRAP-RETURNED-TARGET-DIVISOR-COUNT",
      reason: "The target divisor count is not the unknown exponent.",
    },
    {
      value: String(knownChoiceProduct),
      id: "NUM-CP005-TRAP-RETURNED-KNOWN-CHOICE-PRODUCT",
      reason: "This is the contribution from the known prime powers.",
    },
    {
      value: String(selected.exponent + 2),
      id: "NUM-CP005-TRAP-ONE-TOO-HIGH",
      reason: "The recovered exponent is one smaller than this value.",
    },
  ];
  const options = buildOptions(
    correct,
    candidates.map(({ value, id, reason }) => wrong(value, id, reason)),
    result.correctIndex,
  );
  const state = [
    { prime: selected.hiddenPrime, exponent: selected.exponent },
    ...selected.known.map((entry) => ({ ...entry })),
  ].sort((left, right) => left.prime - right.prime);
  const difficulty = selected.known.length === 1 && knownChoiceProduct <= 4
    ? "EASY"
    : selected.known.length === 1
      ? "MEDIUM"
      : "HARD";

  return {
    ...result,
    stem: `If ${math(`n=${selected.hiddenPrime}^{x} \\times ${knownText(selected.known)}`)} has exactly ${targetDivisorCount} positive divisors, find x.`,
    options,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      ...source.hiddenState,
      factorState: state,
      factorisation: factorisationText(selected.hiddenPrime, selected.exponent, selected.known),
      hiddenPrime: selected.hiddenPrime,
      targetDivisorCount: String(targetDivisorCount),
      knownChoiceProduct: String(knownChoiceProduct),
      hiddenChoiceCount: String(selected.exponent + 1),
    },
    difficulty,
    mathematicalFingerprint: `NUM-QL-054|${selected.hiddenPrime}|${selected.exponent}|${knownText(selected.known)}`,
  };
}
