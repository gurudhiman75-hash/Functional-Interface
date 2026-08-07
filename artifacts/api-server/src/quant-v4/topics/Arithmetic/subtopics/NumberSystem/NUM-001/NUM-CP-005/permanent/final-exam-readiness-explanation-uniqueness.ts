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

function setText(values) {
  return Array.isArray(values) && values.length > 0
    ? values.join(", ")
    : "none";
}

function ql069(input, explanation) {
  const k = Number(input.hiddenState.knownExponent);
  const first = input.hiddenState.firstCandidates;
  const second = input.hiddenState.secondCandidates;
  const combined = input.hiddenState.combinedCandidates;
  return {
    ...explanation,
    coreConcept: `For ${math(`n=2^{x}\\times3^{${k}}`)}, each statement leaves a set of possible values of x.`,
    givenDataAndStrategy: `Test the visible conditions only for ${math("x\\in\\{0,1,2,3,4,5\\}")}; then compare the two remaining sets.`,
    stepByStep: [
      `Statement I leaves ${math(`S_I=\\{${setText(first)}\\}`)}.`,
      `Statement II leaves ${math(`S_{II}=\\{${setText(second)}\\}`)}.`,
      `Using both statements gives ${math(`S_I\\cap S_{II}=\\{${setText(combined)}\\}`)}.`,
      combined.length === 1
        ? `The common set contains only x=${combined[0]}, so the combined information fixes x.`
        : combined.length === 0
          ? "The statements have no common valid value of x, so they do not determine a valid answer."
          : `The common set still contains ${combined.length} values, so x is not uniquely fixed.`,
    ],
    examSpeedMethod: `Write the possible x-values from each statement and inspect their intersection.`,
    commonTraps: [
      `The fixed exponent ${k} belongs to 3; only x is unknown.`,
      "A statement is sufficient alone only when its candidate set has one value.",
      "When neither statement is sufficient alone, check the intersection before deciding.",
    ],
    finalAnswer: input.canonicalAnswer,
  };
}

export function applyNumCp005ExplanationUniqueness(input, explanation) {
  if (input.qlId === "NUM-QL-052") return ql052(input, explanation);
  if (input.qlId === "NUM-QL-054") return ql054(input, explanation);
  if (input.qlId === "NUM-QL-069") return ql069(input, explanation);
  return explanation;
}
