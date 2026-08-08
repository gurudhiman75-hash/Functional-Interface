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
    givenDataAndStrategy: `The first condition gives ${first} divisors, while ${overlap} of them also satisfy the excluded condition.`,
    stepByStep: [
      `Divisors satisfying the required condition: ${first}.`,
      `Divisors satisfying both conditions: ${overlap}.`,
      `Required count ${math(`${first}-${overlap}=${answer}`)}.`,
    ],
    examSpeedMethod: "Use required count = first-condition count − overlap count.",
    commonTraps: [
      "Subtract only the overlap, not every divisor satisfying the second condition.",
      "A divisor satisfying both conditions is included in the first count before removal.",
      "Check the permitted exponent range for each prime.",
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
      coreConcept: `For ${factorisation}, the ${count} divisors form ${pairCount} pairs, each with product n.`,
      givenDataAndStrategy: "Apply the divisor-product theorem directly; do not expand the numerical value of n.",
      stepByStep: [
        `${math(`d(n)=${count}`)} is even, so there are ${math(`${count}\\div2=${pairCount}`)} complete pairs.`,
        "Each pair is d and n/d, so its product is n.",
        `Hence the product of all positive divisors is ${math(`n^{${pairCount}}`)}.`,
      ],
      examSpeedMethod: `For even d(n), use ${math("n^{d(n)/2}")} directly.`,
      commonTraps: [
        "Do not calculate the full value of n when the answer is required in terms of n.",
        `The ${count} divisors form ${pairCount} pairs, not ${count} pairs.`,
        "Pair the smallest divisor with the largest and continue inward.",
      ],
      finalAnswer: input.canonicalAnswer,
    };
  }
  return {
    ...explanation,
    coreConcept: `For ${factorisation}, an odd divisor count means n is a perfect square and ${math("\\sqrt n")} is unpaired.`,
    givenDataAndStrategy: "Apply the odd-count form of the divisor-product theorem without expanding n.",
    stepByStep: [
      `${math(`d(n)=${count}`)} is odd, so n is a perfect square.`,
      `There are ${math(`(${count}-1)\\div2=${pairCount}`)} complete pairs and the middle divisor is ${math("\\sqrt n")}.`,
      `Hence the product is ${math(`n^{${pairCount}}\\sqrt n`)}.`,
    ],
    examSpeedMethod: `For odd d(n), use ${math("n^{(d(n)-1)/2}\\sqrt n")}.`,
    commonTraps: [
      "Do not omit the middle divisor \(\\sqrt n\).",
      "Do not expand n when the requested result is symbolic.",
      "An odd divisor count occurs only for a perfect square.",
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
    if (parityMatches(value, parity) && divisorCountOfInteger(value) === target) validValues.push(value);
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
      coreConcept: `${math(`d(n)=${target}`)} gives the exponent patterns ${patternLine}.`,
      givenDataAndStrategy: `Generate only ${formLine}, impose the ${parity.toLowerCase()} condition, and find the smallest possible value.`,
      stepByStep: [
        `Possible prime-exponent forms are ${formLine}.`,
        `The smallest value satisfying both conditions is ${factorMath(state)}=${smallest}.`,
        `${smallest}>${bound}, so no qualifying integer lies within the bound.`,
      ],
      examSpeedMethod: "Construct the smallest number from the allowed exponent patterns; stop if it exceeds the bound.",
      commonTraps: [
        "Do not check every integer one by one.",
        "Apply the parity restriction while constructing candidates.",
        "Use distinct primes for different entries of an exponent pattern.",
      ],
      finalAnswer: input.canonicalAnswer,
    };
  }

  const answer = Number(input.canonicalAnswer);
  const topValues = validValues.slice(-3);
  const answerState = factorInteger(answer);
  return {
    ...explanation,
    coreConcept: `${math(`d(n)=${target}`)} gives the exponent patterns ${patternLine}.`,
    givenDataAndStrategy: `Generate only ${formLine}, impose the ${parity.toLowerCase()} condition, and retain values not exceeding ${bound}.`,
    stepByStep: [
      `Possible prime-exponent forms are ${formLine}.`,
      `Generating these forms within the bound gives the largest valid values ${topValues.join(", ")}.`,
      `${factorMath(answerState)}=${answer} and ${math(`d(${answer})=${divisorCountFromState(answerState)}`)}.`,
      `No generated value lies between ${answer + 1} and ${bound}; therefore ${answer} is greatest.`,
    ],
    examSpeedMethod: "Write the exponent patterns first, then generate only candidates near the upper bound.",
    commonTraps: [
      "Do not test every integer below the bound.",
      "Include every exponent pattern that gives the target divisor count.",
      "After finding a valid number, rule out all larger generated candidates.",
    ],
    finalAnswer: input.canonicalAnswer,
  };
}

function ql061(input, explanation) {
  const actual = String(input.hiddenState.actualValue);
  const claimed = String(input.hiddenState.claimedValue);
  const relation = actual === claimed ? "=" : "\\ne";
  const verdict = actual === claimed ? "correct" : "incorrect";
  return {
    ...explanation,
    stepByStep: [
      explanation.stepByStep[0],
      `${math(`${actual}${relation}${claimed}`)}, so the claim is ${verdict}.`,
    ],
    examSpeedMethod: "Calculate the requested property once, then compare it directly with the claim.",
    commonTraps: [
      "Do not judge the claim before calculating the requested property.",
      `Compare the claim with ${actual}, not a nearby value.`,
      "The selected option must contain a logically consistent value and verdict.",
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
      "Verify the completed row by multiplication.",
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
  const steps = [`${math(`b+1=${odd}`)}, so ${math(`b=${odd - 1}`)}.`];
  if (a === null || b === null || total % odd !== 0) {
    steps.push(`${math(`a+1=${total}\\div${odd}`)} is not a permitted whole number.`);
    steps.push("Therefore no value of n satisfies both divisor conditions.");
  } else {
    steps.push(`${math(`a+1=${total}\\div${odd}=${a + 1}`)}, so ${math(`a=${a}`)}.`);
    if (b === 0) {
      steps.push(`${math(`n=2^{${a}}p^{0}=2^{${a}}`)}, so all allowed primes give the same value ${values[0]}.`);
    } else {
      const substitutions = primes.map((prime, index) =>
        math(`2^{${a}}\\times${prime}^{${b}}=${values[index]}`)).join(", ");
      steps.push(`Substitute the allowed primes: ${substitutions}.`);
    }
  }
  return {
    ...explanation,
    coreConcept: `For ${math("n=2^{a}p^{b}")}, odd divisors equal ${math("b+1")} and total divisors equal ${math("(a+1)(b+1)")}.`,
    givenDataAndStrategy: "Find b from the odd-divisor count, then divide the total count by b+1 to find a+1.",
    stepByStep: steps,
    examSpeedMethod: "After finding b, use total divisors ÷ odd divisors = a+1.",
    commonTraps: [
      "Both exponents must be whole numbers within the stated bounds.",
      "Test every allowed odd prime when b>0.",
      "When b=0, do not repeat the same numerical value for different primes.",
    ],
    finalAnswer: input.canonicalAnswer,
  };
}

function setMath(values) {
  return math(`\\{${values.join(",")}\\}`);
}

function extractDisplayedPower(text) {
  const marker = "2^{";
  const start = text.indexOf(marker);
  if (start < 0) return null;
  const end = text.indexOf("}", start + marker.length);
  if (end < 0) return null;
  const value = Number(text.slice(start + marker.length, end));
  return Number.isInteger(value) ? value : null;
}

function setName(label) {
  return label === "I" ? "S_I" : "S_{II}";
}

function deriveStatement(text, k, candidates, label) {
  const targetSet = setName(label);
  let match = text.match(/^n has exactly (\d+) positive divisors\.$/u);
  if (match) {
    const total = Number(match[1]);
    const coefficient = k + 1;
    return `${label}: ${math(`d(n)=(x+1)(${k}+1)=${coefficient}(x+1)=${total}`)}, so ${math(`x=${total}\\div${coefficient}-1=${candidates[0]}`)} and ${targetSet}=${setMath(candidates)}.`;
  }
  match = text.match(/^n has exactly (\d+) even positive divisors\.$/u);
  if (match) {
    const even = Number(match[1]);
    const coefficient = k + 1;
    return `${label}: the even-divisor count is ${math(`x(${k}+1)=${coefficient}x=${even}`)}, so ${math(`x=${candidates[0]}`)} and ${targetSet}=${setMath(candidates)}.`;
  }
  if (text.startsWith("n is divisible by")) {
    const power = extractDisplayedPower(text);
    return `${label}: ${math(`2^{${power}}\\mid n`)} means ${math(`x\\ge${power}`)}, so ${targetSet}=${setMath(candidates)}.`;
  }
  if (text.startsWith("n is not divisible by")) {
    const power = extractDisplayedPower(text);
    return `${label}: ${math(`2^{${power}}\\nmid n`)} means ${math(`x<${power}`)}, so ${targetSet}=${setMath(candidates)}.`;
  }
  if (text === "n is a perfect square.") {
    return `${label}: the fixed exponent ${k} is even, so n is a square exactly when x is even; hence ${targetSet}=${setMath(candidates)}.`;
  }
  return `${label}: applying the stated condition gives ${targetSet}=${setMath(candidates)}.`;
}

function ql069(input, explanation) {
  const marker = " Statement II: ";
  const firstStart = input.stem.indexOf("Statement I: ");
  const secondStart = input.stem.indexOf(marker);
  const firstText = firstStart >= 0 && secondStart >= 0
    ? input.stem.slice(firstStart + "Statement I: ".length, secondStart)
    : "";
  const secondText = secondStart >= 0 ? input.stem.slice(secondStart + marker.length) : "";
  const k = Number(input.hiddenState.knownExponent);
  const first = input.hiddenState.firstCandidates ?? [];
  const second = input.hiddenState.secondCandidates ?? [];
  const combined = input.hiddenState.combinedCandidates ?? [];
  return {
    ...explanation,
    coreConcept: `For ${math(`n=2^{x}\\times3^{${k}}`)}, convert each statement into an explicit set of possible x-values.`,
    givenDataAndStrategy: "Derive both candidate sets from their equations or divisibility conditions, then examine their sizes and intersection.",
    stepByStep: [
      deriveStatement(firstText, k, first, "I"),
      deriveStatement(secondText, k, second, "II"),
      `Together, ${math(`S_I\\cap S_{II}=\\{${combined.join(",")}\\}`)}.`,
      `Statement I leaves ${first.length} value${first.length === 1 ? "" : "s"}; Statement II leaves ${second.length}; together they leave ${combined.length}. Therefore: ${input.canonicalAnswer}`,
    ],
    examSpeedMethod: "Write the two x-sets directly; a statement is sufficient alone only when its set has one value.",
    commonTraps: [
      `The fixed exponent ${k} belongs to 3; only x is unknown.`,
      "Do not call a statement sufficient when it leaves multiple x-values.",
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
