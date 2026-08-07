import {
  divisorCountFromState,
  divisorsFromState,
  factorMath,
  integerFromState,
  math,
  primePowers,
} from "./english-remediation-common";

function ql052(input, explanation) {
  const state = primePowers(input.hiddenState);
  const n = integerFromState(state);
  const count = divisorCountFromState(state);
  const divisors = divisorsFromState(state);
  const pairCount = Math.floor(count / 2);
  const firstPair = [divisors[0], divisors[divisors.length - 1]];
  const secondPair = divisors.length >= 4
    ? [divisors[1], divisors[divisors.length - 2]]
    : null;
  const steps = [
    `${factorMath(state)} gives ${math(`n=${n}`)} and ${math(`d(n)=${count}`)}.`,
    `The first divisor pair is ${math(`${firstPair[0]}\\times${firstPair[1]}=${n}`)}${secondPair ? `; the next is ${math(`${secondPair[0]}\\times${secondPair[1]}=${n}`)}` : ""}.`,
  ];
  if (count % 2 === 0) {
    steps.push(`There are ${math(`${count}\\div2=${pairCount}`)} complete pairs, each with product n.`);
    steps.push(`Therefore the product of all divisors is ${math(`n^{${pairCount}}`)}.`);
  } else {
    const middle = divisors[pairCount];
    steps.push(`There are ${pairCount} complete pairs and the middle divisor is ${math(`\\sqrt{n}=${middle}`)}.`);
    steps.push(`Therefore the product is ${math(`n^{${pairCount}}\\sqrt{n}`)}.`);
  }
  return {
    ...explanation,
    coreConcept: `The divisors of ${factorMath(state)} can be paired so that each pair has product ${n}.`,
    givenDataAndStrategy: `Use the actual divisor count ${count} to find how many complete pairs are formed.`,
    stepByStep: steps,
    examSpeedMethod: count % 2 === 0
      ? `Since ${count} is even, use ${math(`n^{d(n)/2}=n^{${pairCount}}`)}.`
      : `Since ${count} is odd, use ${math(`n^{(d(n)-1)/2}\\sqrt{n}=n^{${pairCount}}\\sqrt{n}`)}.`,
    commonTraps: [
      `The pair product is ${n}, not the sum of the two divisors.`,
      count % 2 === 0
        ? `The ${count} divisors form ${pairCount} pairs, not ${count} pairs.`
        : `The middle divisor ${divisors[pairCount]} is unpaired and must be included.`,
      "Keep the result in the requested power form instead of expanding a very large integer.",
    ],
    finalAnswer: input.canonicalAnswer,
  };
}

function ql054(input, explanation) {
  const state = primePowers(input.hiddenState);
  const hiddenPrime = Number(input.hiddenState.hiddenPrime);
  const target = Number(input.hiddenState.targetDivisorCount);
  const known = state.filter(({ prime }) => prime !== hiddenPrime);
  const knownProduct = known.reduce((value, { exponent }) => value * (exponent + 1), 1);
  const hiddenChoiceCount = target / knownProduct;
  const exponent = hiddenChoiceCount - 1;
  const knownFormula = known.map(({ exponent: knownExponent }) => `(${knownExponent}+1)`).join(" \\times ") || "1";
  return {
    ...explanation,
    coreConcept: `In ${factorMath(state).replace(new RegExp(`${hiddenPrime}\\^\\{?${exponent}\\}?`, "u"), `${hiddenPrime}^{x}`)}, the unknown power contributes x+1 divisor choices.`,
    givenDataAndStrategy: `The known prime powers contribute ${knownProduct} choices, while the total divisor count is ${target}.`,
    stepByStep: [
      `Known-part choices: ${math(`${knownFormula}=${knownProduct}`)}.`,
      `So ${math(`(x+1)\\times${knownProduct}=${target}`)}.`,
      `${math(`x+1=${target}\\div${knownProduct}=${hiddenChoiceCount}`)}.`,
      `${math(`x=${hiddenChoiceCount}-1=${exponent}`)}.`,
    ],
    examSpeedMethod: `Divide ${target} by the known contribution ${knownProduct}, then subtract 1.`,
    commonTraps: [
      `${hiddenChoiceCount} is the value of x+1, not x.`,
      `The known factors contribute ${knownProduct} choices; they are multiplied with x+1.`,
      `Divide ${target} by ${knownProduct} before subtracting 1.`,
    ],
    finalAnswer: input.canonicalAnswer,
  };
}

export function applyNumCp005ExplanationUniqueness(input, explanation) {
  if (input.qlId === "NUM-QL-052") return ql052(input, explanation);
  if (input.qlId === "NUM-QL-054") return ql054(input, explanation);
  return explanation;
}
