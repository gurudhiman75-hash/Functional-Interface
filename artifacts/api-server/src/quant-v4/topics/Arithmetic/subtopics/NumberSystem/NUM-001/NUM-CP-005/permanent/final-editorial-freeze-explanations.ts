import {
  divisorCountFromState,
  divisorCountOfInteger,
  factorMath,
  math,
  primePowers,
} from "./english-remediation-common";

function factorInteger(value) {
  let remaining = value;
  const state = [];
  for (let prime = 2; prime * prime <= remaining; prime += 1) {
    if (remaining % prime !== 0) continue;
    let exponent = 0;
    while (remaining % prime === 0) {
      exponent += 1;
      remaining /= prime;
    }
    state.push({ prime, exponent });
  }
  if (remaining > 1) state.push({ prime: remaining, exponent: 1 });
  return state;
}

function parityMatches(value, parity) {
  if (parity === "EVEN") return value % 2 === 0;
  if (parity === "ODD") return value % 2 === 1;
  return true;
}

function multiplicativePartitions(value, minimum = 2, prefix = []) {
  const output = [];
  for (let factor = minimum; factor * factor <= value; factor += 1) {
    if (value % factor !== 0) continue;
    output.push(...multiplicativePartitions(value / factor, factor, [...prefix, factor]));
  }
  if (value >= minimum) output.push([...prefix, value]);
  return output;
}

function exponentPatterns(target) {
  const seen = new Set();
  const patterns = [];
  for (const factors of multiplicativePartitions(target)) {
    const pattern = factors.map((factor) => factor - 1).sort((a, b) => b - a);
    const key = pattern.join(",");
    if (seen.has(key)) continue;
    seen.add(key);
    patterns.push(pattern);
  }
  return patterns.sort((a, b) => a.length - b.length || b[0] - a[0]);
}

function patternText(pattern) {
  return `(${pattern.join(", ")})`;
}

function patternForm(pattern) {
  const letters = ["p", "q", "r", "s", "t"];
  return pattern.map((exponent, index) => exponent === 1
    ? letters[index]
    : `${letters[index]}^{${exponent}}`).join("");
}

function ql049(input, explanation) {
  const first = Number(input.hiddenState.divisibleByFirst);
  const overlap = Number(input.hiddenState.divisibleByBoth);
  const answer = first - overlap;
  return {
    ...explanation,
    coreConcept: "Count the divisors satisfying the first condition, then remove those that also satisfy the excluded condition.",
    givenDataAndStrategy: `The first condition gives ${first} divisors, while ${overlap} of them also satisfy the condition that must be excluded.`,
    stepByStep: [
      `Divisors satisfying the required divisibility condition: ${first}.`,
      `Divisors satisfying both conditions: ${overlap}.`,
      `Required count ${math(`${first}-${overlap}=${answer}`)}.`,
    ],
    examSpeedMethod: "Use required count = first-condition count − overlap count.",
    commonTraps: [
      "Do not subtract all divisors satisfying the second condition; subtract only the overlap.",
      "A divisor meeting both conditions belongs to the first count before it is removed.",
      "Check the exponent ranges prime by prime.",
    ],
    finalAnswer: input.canonicalAnswer,
  };
}

function ql052(input, explanation) {
  const state = primePowers(input.hiddenState);
  const count = Number(input.hiddenState.divisorCount);
  const pairCount = Math.floor(count / 2);
  const factorisation = factorMath(state);
  if (count % 2 === 0) {
    return {
      ...explanation,
      coreConcept: `For ${factorisation}, the ${count} divisors form ${pairCount} pairs, and every pair has product n.`,
      givenDataAndStrategy: "Use the divisor-product theorem directly; there is no need to expand the numerical value of n.",
      stepByStep: [
        `${math(`d(n)=${count}`)} is even, so the divisors form ${math(`${count}\\div2=${pairCount}`)} complete pairs.`,
        "Each pair consists of divisors d and n/d, so each pair has product n.",
        `Therefore the product of all positive divisors is ${math(`n^{${pairCount}}`)}.`,
      ],
      examSpeedMethod: `For even d(n), use ${math("n^{d(n)/2}")} immediately.`,
      commonTraps: [
        "Do not calculate the full numerical value of n; the answer is required in terms of n.",
        `There are ${pairCount} pairs, not ${count} pairs.`,
        "Pair the smallest divisor with the largest, the next smallest with the next largest, and so on.",
      ],
      finalAnswer: input.canonicalAnswer,
    };
  }
  return {
    ...explanation,
    coreConcept: `For ${factorisation}, an odd divisor count means n is a perfect square and ${math("\\sqrt n")} is unpaired.`,
    givenDataAndStrategy: "Use the odd-count form of the divisor-product theorem without expanding n.",
    stepByStep: [
      `${math(`d(n)=${count}`)} is odd, so n is a perfect square.`,
      `The divisors form ${math(`(${count}-1)\\div2=${pairCount}`)} complete pairs, with ${math("\\sqrt n")} left in the middle.`,
      `Therefore the product is ${math(`n^{${pairCount}}\\sqrt n`)}.`,
    ],
    examSpeedMethod: `For odd d(n), use ${math("n^{(d(n)-1)/2}\\sqrt n")}.`,
    commonTraps: [
      "Do not omit the middle divisor \(\\sqrt n\).",
      "Do not expand n when the required answer is symbolic.",
      "An odd number of divisors is possible only when n is a perfect square.",
    ],
    finalAnswer: input.canonicalAnswer,
  };
}

function ql057(input, explanation) {
  const target = Number(input.hiddenState.targetDivisorCount);
  const bound = Number(input.hiddenState.bound);
  const parity = String(input.hiddenState.parity ?? "ANY");
  const patterns = exponentPatterns(target);
  const forms = patterns.map(patternForm);
  const validValues = [];
  for (let value = 1; value <= bound; value += 1) {
    if (!parityMatches(value, parity)) continue;
    if (divisorCountOfInteger(value) === target) validValues.push(value);
  }
  const patternLine = patterns.map(patternText).join(", ");
  const formLine = forms.map((form) => math(form)).join(", ");

  if (input.canonicalAnswer === "No such integer") {
    let smallest = bound + 1;
    while (smallest <= 200_000) {
      if (parityMatches(smallest, parity) && divisorCountOfInteger(smallest) === target) break;
      smallest += 1;
    }
    const state = factorInteger(smallest);
    return {
      ...explanation,
      coreConcept: `The equation ${math(`d(n)=${target}`)} gives the exponent patterns ${patternLine}.`,
      givenDataAndStrategy: `Generate only the forms ${formLine}, apply the ${parity.toLowerCase()} condition, and compare the smallest possible value with ${bound}.`,
      stepByStep: [
        `Possible prime-exponent forms are ${formLine}.`,
        `The smallest value satisfying the divisor-count and parity conditions is ${factorMath(state)}=${smallest}.`,
        `${smallest}>${bound}, so no qualifying integer lies within the stated bound.`,
      ],
      examSpeedMethod: "Find the smallest number from the allowed exponent patterns; if it already exceeds the bound, stop.",
      commonTraps: [
        "Do not check every integer one by one.",
        "Apply the parity restriction while constructing the smallest candidate.",
        "A fractional or repeated prime assignment is not a valid exponent pattern.",
      ],
      finalAnswer: input.canonicalAnswer,
    };
  }

  const answer = Number(input.canonicalAnswer);
  const topValues = validValues.slice(-3);
  const answerState = factorInteger(answer);
  return {
    ...explanation,
    coreConcept: `The equation ${math(`d(n)=${target}`)} gives the exponent patterns ${patternLine}.`,
    givenDataAndStrategy: `Generate numbers only from the forms ${formLine}, apply the ${parity.toLowerCase()} condition, and retain values not exceeding ${bound}.`,
    stepByStep: [
      `Possible prime-exponent forms are ${formLine}.`,
      `Generating these forms within the bound gives the largest valid values ${topValues.join(", ")}.`,
      `${factorMath(answerState)}=${answer} and ${math(`d(${answer})=${divisorCountFromState(answerState)}`)}.`,
      `No value generated by the allowed forms lies between ${answer + 1} and ${bound}, so ${answer} is greatest.`,
    ],
    examSpeedMethod: "Write the exponent patterns first, then generate only the few values near the upper bound.",
    commonTraps: [
      "Do not test every integer below the bound.",
      "Different exponent patterns can give the same divisor count, so include every allowed form.",
      "After finding a valid number, still rule out all larger generated candidates.",
    ],
    finalAnswer: input.canonicalAnswer,
  };
}

function ql061(input, explanation) {
  const actual = String(input.hiddenState.actualValue);
  const claimed = String(input.hiddenState.claimedValue);
  const firstCalculation = explanation.stepByStep[0];
  const relation = actual === claimed ? "=" : "\\ne";
  const verdict = actual === claimed ? "correct" : "incorrect";
  return {
    ...explanation,
    stepByStep: [
      firstCalculation,
      `${math(`${actual}${relation}${claimed}`)}, so the claim is ${verdict}.`,
    ],
    examSpeedMethod: "Calculate the requested divisor property once, then compare it directly with the claim.",
    commonTraps: [
      "Do not judge the claim before calculating the requested property.",
      `The comparison must use ${actual}, not a nearby value.`,
      "Choose an option whose verdict and stated value agree with each other.",
    ],
    finalAnswer: input.canonicalAnswer,
  };
}

function ql063(input, explanation) {
  const number = Number(input.hiddenState.integerValue);
  const visible = Number(input.hiddenState.visiblePartner);
  const partner = Number(input.hiddenState.pairedFactor ?? input.canonicalAnswer);
  return {
    ...explanation,
    coreConcept: `A divisor-pair row must multiply back to ${number}.`,
    givenDataAndStrategy: `Complete ${math(`${visible}\\times ?=${number}`)} by dividing ${number} by ${visible}.`,
    stepByStep: [
      `${math(`?=${number}\\div${visible}`)}.`,
      `${math(`?=${partner}`)}.`,
      `Check: ${math(`${visible}\\times${partner}=${number}`)}.`,
    ],
    examSpeedMethod: "Missing paired factor = number ÷ visible factor.",
    commonTraps: [
      "Do not copy the visible factor unless the row is a square pair.",
      "Use division, not subtraction.",
      "Verify the row by multiplying the two factors.",
    ],
    finalAnswer: input.canonicalAnswer,
  };
}

function ql066(input, explanation) {
  const total = Number(input.hiddenState.totalDivisors);
  const odd = Number(input.hiddenState.oddDivisors);
  const a = input.hiddenState.solvedExponentA;
  const b = input.hiddenState.solvedExponentB;
  const primes = input.hiddenState.oddPrimes ?? [];
  const values = (input.hiddenState.possibleIntegers ?? []).map(Number);
  const steps = [
    `${math(`b+1=${odd}`)}, so ${math(`b=${odd}-1=${odd - 1}`)}.`,
  ];
  if (a === null || b === null || total % odd !== 0) {
    steps.push(`${math(`a+1=${total}\\div${odd}`)} is not a permitted whole-number choice.`);
    steps.push("Therefore no value of n satisfies both divisor conditions.");
  } else {
    steps.push(`${math(`a+1=${total}\\div${odd}=${a + 1}`)}, so ${math(`a=${a}`)}.`);
    if (b === 0) {
      steps.push(`${math(`n=2^{${a}}p^{0}=2^{${a}}`)}, so every allowed p gives the same value ${values[0]}.`);
    } else {
      const substitutions = primes.map((prime, index) =>
        `${math(`2^{${a}}\\times${prime}^{${b}}=${values[index]}`)}`).join(", ");
      steps.push(`Substitute the allowed primes: ${substitutions}.`);
    }
  }
  return {
    ...explanation,
    coreConcept: `For ${math("n=2^{a}p^{b}")}, odd divisors equal ${math("b+1")} and total divisors equal ${math("(a+1)(b+1)")}.`,
    givenDataAndStrategy: "Find b from the odd-divisor count, then divide the total count by b+1 to find a+1.",
    stepByStep: steps,
    examSpeedMethod: "Use total divisors ÷ odd divisors = a+1 after finding b.",
    commonTraps: [
      "Both exponents must be whole numbers within the stated bounds.",
      "Test every allowed odd prime when b>0.",
      "When b=0, all allowed primes produce the same value and should not be repeated.",
    ],
    finalAnswer: input.canonicalAnswer,
  };
}

function setMath(values) {
  return math(`\\{${values.join(",") }\\}`);
}

function deriveStatement(text, k, candidates, label) {
  let match = text.match(/^n has exactly (\d+) positive divisors\.$/u);
  if (match) {
    const total = Number(match[1]);
    const coefficient = k + 1;
    return `${label}: ${math(`d(n)=(x+1)(${k}+1)=${coefficient}(x+1)=${total}`)}, so ${math(`x=${total}\\div${coefficient}-1=${candidates[0]}`)} and ${label === "I" ? "S_I" : "S_{II}"}=${setMath(candidates)}.`;
  }
  match = text.match(/^n has exactly (\d+) even positive divisors\.$/u);
  if (match) {
    const even = Number(match[1]);
    const coefficient = k + 1;
    return `${label}: the even-divisor count is ${math(`x(${k}+1)=${coefficient}x=${even}`)}, so ${math(`x=${candidates[0]}`)} and ${label === "I" ? "S_I" : "S_{II}"}=${setMath(candidates)}.`;
  }
  match = text.match(/^n is divisible by \\(2\^\{(\d+)\}\\\)\.$/u);
  if (match) {
    const power = Number(match[1]);
    return `${label}: ${math(`2^{${power}}\\mid n`)} means ${math(`x\\ge${power}`)}, so ${label === "I" ? "S_I" : "S_{II}"}=${setMath(candidates)}.`;
  }
  match = text.match(/^n is not divisible by \\(2\^\{(\d+)\}\\\)\.$/u);
  if (match) {
    const power = Number(match[1]);
    return `${label}: ${math(`2^{${power}}\\nmid n`)} means ${math(`x<${power}`)}, so ${label === "I" ? "S_I" : "S_{II}"}=${setMath(candidates)}.`;
  }
  if (text === "n is a perfect square.") {
    return `${label}: since the fixed exponent ${k} is even, n is a square exactly when x is even; hence ${label === "I" ? "S_I" : "S_{II}"}=${setMath(candidates)}.`;
  }
  return `${label}: testing the stated condition leaves ${label === "I" ? "S_I" : "S_{II}"}=${setMath(candidates)}.`;
}

function ql069(input, explanation) {
  const stemMatch = input.stem.match(/Statement I: (.+) Statement II: (.+)$/u);
  const firstText = stemMatch?.[1] ?? "";
  const secondText = stemMatch?.[2] ?? "";
  const k = Number(input.hiddenState.knownExponent);
  const first = input.hiddenState.firstCandidates ?? [];
  const second = input.hiddenState.secondCandidates ?? [];
  const combined = input.hiddenState.combinedCandidates ?? [];
  return {
    ...explanation,
    coreConcept: `For ${math(`n=2^{x}\\times3^{${k}}`)}, convert each statement into an explicit set of possible x-values.`,
    givenDataAndStrategy: "Derive each candidate set from its equation or divisibility condition, then test sufficiency from the set sizes and their intersection.",
    stepByStep: [
      deriveStatement(firstText, k, first, "I"),
      deriveStatement(secondText, k, second, "II"),
      `Together, ${math(`S_I\\cap S_{II}=\\{${combined.join(",") }\\}`)}.`,
      `Statement I leaves ${first.length} value${first.length === 1 ? "" : "s"}; Statement II leaves ${second.length}; together they leave ${combined.length}. Therefore: ${input.canonicalAnswer}`,
    ],
    examSpeedMethod: "Write the two x-sets directly; a statement is sufficient alone only when its set has one value.",
    commonTraps: [
      `The fixed exponent ${k} belongs to 3; only x is unknown.`,
      "Do not call a statement sufficient when it leaves more than one possible x-value.",
      "When neither statement works alone, inspect the intersection before deciding.",
    ],
    finalAnswer: input.canonicalAnswer,
  };
}

export function applyNumCp005FinalEditorialFreezeExplanation(input, explanation) {
  switch (input.qlId) {
    case "NUM-QL-049": return ql049(input, explanation);
    case "NUM-QL-052": return ql052(input, explanation);
    case "NUM-QL-057": return ql057(input, explanation);
    case "NUM-QL-061": return ql061(input, explanation);
    case "NUM-QL-063": return ql063(input, explanation);
    case "NUM-QL-066": return ql066(input, explanation);
    case "NUM-QL-069": return ql069(input, explanation);
    default: return explanation;
  }
}
