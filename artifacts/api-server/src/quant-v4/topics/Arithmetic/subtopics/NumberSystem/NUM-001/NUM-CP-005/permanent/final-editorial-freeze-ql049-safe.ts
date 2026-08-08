import {
  factorMath,
  math,
  primePowers,
} from "./english-remediation-common";

export function applyNumCp005FinalQl049Derivation(input, priorExplanation, finalExplanation) {
  if (input.qlId !== "NUM-QL-049") return finalExplanation;
  const first = Number(input.hiddenState.divisibleByFirst);
  const overlap = Number(input.hiddenState.divisibleByBoth);
  const factorisation = factorMath(primePowers(input.hiddenState));
  const firstDerivation = priorExplanation.stepByStep[0]
    ?? `First-condition count ${math(`=${first}`)}.`;
  const overlapDerivation = priorExplanation.stepByStep[1]
    ?? `Overlap count ${math(`=${overlap}`)}.`;
  return {
    ...finalExplanation,
    coreConcept: `For ${factorisation}, count the divisors satisfying the required condition and remove only those that also satisfy the excluded condition.`,
    givenDataAndStrategy: `In this factorisation, the first condition gives ${first} divisors and the overlap gives ${overlap}.`,
    stepByStep: [
      firstDerivation,
      overlapDerivation,
      `Required count ${math(`=${first}-${overlap}=${first - overlap}`)}.`,
    ],
    finalAnswer: input.canonicalAnswer,
  };
}
