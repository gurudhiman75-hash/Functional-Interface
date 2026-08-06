import {
  asNumber,
  divisorCountFromState,
  divisorCountOfInteger,
  divisorsFromState,
  factorExpression,
  factorMath,
  factorisationTextToMath,
  geometricSum,
  integerFromState,
  math,
  oddDivisorCountFromState,
  ordinalPower,
  primePowers,
  product,
  secondPrimePowers,
  setText,
  squareDivisorCountFromState,
} from "./english-remediation-common";

function numberList(values) {
  return values.length === 0 ? "none" : values.join(", ");
}

function exponentValues(start, end) {
  const values = [];
  for (let value = start; value <= end; value += 1) values.push(value);
  return values;
}

function multiplesUpTo(step, end) {
  const values = [];
  for (let value = 0; value <= end; value += step) values.push(value);
  return values;
}

function parseFactorisation(value) {
  if (typeof value !== "string" || value.trim() === "" || value.trim() === "1") return [];
  return value.split(/\s*×\s*/u).map((term, index) => {
    const match = term.trim().match(/^(\d+)(?:\^(\d+))?$/u);
    if (!match) throw new Error(`Invalid factorisation term ${index}: ${term}`);
    return { prime: Number(match[1]), exponent: Number(match[2] ?? 1) };
  });
}

function factorPairs(value) {
  const pairs = [];
  for (let left = 1; left <= value; left += 1) {
    if (value % left === 0) pairs.push([left, value / left]);
  }
  return pairs;
}

function formatPairs(pairs) {
  return pairs.length === 0
    ? "none"
    : pairs.map(([left, right]) => `(${left}, ${right})`).join(", ");
}

function simpleExplanation(coreConcept, strategy, steps, speedMethod, traps, finalAnswer) {
  if (traps.length !== 3) throw new Error("A student explanation must contain exactly three short checks");
  return {
    coreConcept,
    givenDataAndStrategy: strategy,
    stepByStep: steps,
    examSpeedMethod: speedMethod,
    commonTraps: traps,
    finalAnswer,
  };
}

function choiceLine(prime, exponent) {
  const values = exponentValues(0, exponent);
  return `For ${math(`${prime}^{${exponent}}`)}, the divisor may use exponent ${numberList(values)}. That gives ${values.length} ${values.length === 1 ? "choice" : "choices"}.`;
}

function divisorFormula(state) {
  return state.map(({ exponent }) => `(${exponent}+1)`).join(" \\times ");
}

function sumBlock(prime, exponent) {
  const terms = [];
  for (let power = 0; power <= exponent; power += 1) {
    terms.push(power === 0 ? "1" : power === 1 ? String(prime) : `${prime}^{${power}}`);
  }
  return {
    expression: terms.join("+"),
    value: geometricSum(prime, exponent),
  };
}

function targetLabel(power) {
  const label = ordinalPower(power);
  return label.replace(/^perfect\s+/u, "");
}

function buildQl046(input) {
  const state = primePowers(input.hiddenState);
  const proper = /\bproper\b/iu.test(input.stem);
  const total = divisorCountFromState(state);
  const steps = state.map(({ prime, exponent }) => choiceLine(prime, exponent));
  steps.push(`Multiply the choices: ${math(`${divisorFormula(state)}=${total}`)}.`);
  if (proper) steps.push(`A proper divisor cannot be n itself, so ${math(`${total}-1=${input.canonicalAnswer}`)}.`);
  else steps.push(`So n has ${input.canonicalAnswer} positive divisors.`);

  return simpleExplanation(
    `A divisor of ${factorMath(state)} is made by choosing how many times each prime is used.`,
    `${state.map(({ prime, exponent }) => `${prime} can be used from 0 to ${exponent} times`).join("; ")}.`,
    steps,
    proper
      ? "Add 1 to every exponent, multiply, then subtract 1 for n."
      : "Add 1 to every exponent and multiply.",
    [
      `Exponent 0 is allowed, so ${state[0].prime} gives ${state[0].exponent + 1} choices, not ${state[0].exponent}.`,
      "The choice counts are multiplied, not added.",
      proper ? "Remove only n; 1 is still a proper divisor." : "The count includes both 1 and n.",
    ],
    input.canonicalAnswer,
  );
}

function buildQl047(input) {
  const state = primePowers(input.hiddenState);
  const total = divisorCountFromState(state);
  const odd = oddDivisorCountFromState(state);
  const wantsEven = /\beven\b/iu.test(input.stem);
  const hasTwo = state.some(({ prime }) => prime === 2);
  const steps = [];

  if (hasTwo) {
    const two = state.find(({ prime }) => prime === 2);
    steps.push(`For an odd divisor, the exponent of 2 must be 0. So the factor ${math(`2^{${two.exponent}}`)} gives only 1 choice.`);
  } else {
    steps.push("n has no factor 2, so every divisor of n is odd.");
  }

  const oddState = state.filter(({ prime }) => prime !== 2);
  steps.push(
    oddState.length === 0
      ? "There are no odd-prime factors, so the odd-divisor count is 1."
      : `For the remaining primes, the choices give ${math(`${divisorFormula(oddState)}=${odd}`)} odd divisors.`,
  );

  if (wantsEven) {
    steps.push(`All divisors: ${math(`${divisorFormula(state)}=${total}`)}.`);
    steps.push(`Even divisors ${math(`=${total}-${odd}=${input.canonicalAnswer}`)}.`);
  } else {
    steps.push(`Therefore the number of odd divisors is ${input.canonicalAnswer}.`);
  }

  return simpleExplanation(
    wantsEven ? "Count all divisors, then remove the odd ones." : "An odd divisor cannot contain a factor 2.",
    `Use the prime powers in ${factorMath(state)} and treat the factor 2 separately.`,
    steps,
    wantsEven ? "Even divisors = all divisors − odd divisors." : "Set the exponent of 2 to 0, then count the remaining choices.",
    [
      hasTwo ? "An odd divisor uses 2 zero times." : "Because n is odd, it has no even divisor.",
      "Do not use the full divisor count when only odd divisors are asked.",
      wantsEven ? "Subtract odd divisors from the total." : `The answer is ${odd}, not the total ${total}.`,
    ],
    input.canonicalAnswer,
  );
}

function buildQl048(input) {
  const state = primePowers(input.hiddenState);
  const requirement = parseFactorisation(input.hiddenState.requirementFactorisation);
  const requirementMap = new Map(requirement.map(({ prime, exponent }) => [prime, exponent]));
  const counts = state.map(({ prime, exponent }) => {
    const minimum = requirementMap.get(prime) ?? 0;
    return { prime, exponent, minimum, choices: Math.max(0, exponent - minimum + 1) };
  });
  const divisible = counts.reduce((value, item) => value * item.choices, 1);
  const total = divisorCountFromState(state);
  const wantsNot = /\bnot divisible\b/iu.test(input.stem);
  const reqMath = factorisationTextToMath(String(input.hiddenState.requirementFactorisation));
  const steps = counts.map(({ prime, minimum, exponent, choices }) => {
    const values = exponentValues(minimum, exponent);
    return `For prime ${prime}, the exponent may be ${numberList(values)}. That gives ${choices} choices.`;
  });
  steps.push(`Divisors divisible by ${reqMath}: ${math(`${counts.map(({ choices }) => choices).join(" \\times ")}=${divisible}`)}.`);
  if (wantsNot) steps.push(`Not divisible by ${reqMath}: ${math(`${total}-${divisible}=${input.canonicalAnswer}`)}.`);
  else steps.push(`So the required number of divisors is ${input.canonicalAnswer}.`);

  return simpleExplanation(
    `To be divisible by ${reqMath}, a divisor must contain every prime power shown in ${reqMath}.`,
    `Start each required prime at its minimum exponent and count the allowed choices up to the exponent in n.`,
    steps,
    wantsNot ? "Find the divisible group first, then subtract it from all divisors." : "Count the allowed exponents for each prime and multiply.",
    [
      `A prime not written in ${reqMath} may still appear with any allowed exponent.`,
      "A required exponent is the starting point, not the only choice.",
      wantsNot ? "Subtract from the total only after finding the divisible group." : "Every required prime power must be present.",
    ],
    input.canonicalAnswer,
  );
}

function buildQl049(input) {
  const first = String(input.hiddenState.firstRequirement);
  const second = String(input.hiddenState.secondRequirement);
  const firstCount = asNumber(input.hiddenState.divisibleByFirst, "divisibleByFirst");
  const both = asNumber(input.hiddenState.divisibleByBoth, "divisibleByBoth");
  const firstMath = factorisationTextToMath(first);
  const secondMath = factorisationTextToMath(second);

  return simpleExplanation(
    `We need divisors that pass the ${firstMath} condition but fail the ${secondMath} condition.`,
    `Count divisors divisible by ${firstMath}, then remove those also divisible by ${secondMath}.`,
    [
      `Divisors divisible by ${firstMath}: ${firstCount}.`,
      `Among them, ${both} are also divisible by ${secondMath}.`,
      `Required count ${math(`=${firstCount}-${both}=${input.canonicalAnswer}`)}.`,
    ],
    "Count the first group and subtract the overlap.",
    [
      `The full first group has ${firstCount} divisors, but ${both} of them must be removed.`,
      `Counting only the overlap gives ${both}, not the required answer.`,
      "Use subtraction here because the words say “but not”.",
    ],
    input.canonicalAnswer,
  );
}

function buildQl050(input) {
  const state = primePowers(input.hiddenState);
  const power = Number.isFinite(Number(input.hiddenState.power))
    ? Number(input.hiddenState.power)
    : /perfect squares?/iu.test(input.stem)
      ? 2
      : /perfect cubes?/iu.test(input.stem)
        ? 3
        : /perfect fifth powers?/iu.test(input.stem)
          ? 5
          : (() => { throw new Error("Unable to identify the requested perfect power"); })();
  const label = targetLabel(power);
  const choiceCounts = state.map(({ exponent }) => multiplesUpTo(power, exponent).length);
  const steps = state.map(({ prime, exponent }) => {
    const legal = multiplesUpTo(power, exponent);
    return `For prime ${prime}, the exponent can be ${numberList(legal)}. That gives ${legal.length} ${legal.length === 1 ? "choice" : "choices"}.`;
  });
  steps.push(`Total ${label}: ${math(`${choiceCounts.join(" \\times ")}=${input.canonicalAnswer}`)}.`);

  const rule = power === 2
    ? "every prime exponent must be even"
    : power === 3
      ? "every prime exponent must be a multiple of 3"
      : `every prime exponent must be a multiple of ${power}`;

  return simpleExplanation(
    `For a divisor to be a ${label.slice(0, -1)}, ${rule}.`,
    `Look at each prime in ${factorMath(state)} and keep only exponents 0, ${power}, ${2 * power}, … that do not exceed the given exponent.`,
    steps,
    `For an exponent a, count 0, ${power}, ${2 * power}, … up to a, then multiply the counts.`,
    [
      "Exponent 0 is allowed because 1 is a perfect power.",
      `Use jumps of ${power}; do not use every exponent.`,
      "Multiply the allowed choices for the different primes.",
    ],
    input.canonicalAnswer,
  );
}

function buildQl051(input) {
  const state = primePowers(input.hiddenState);
  const proper = /\bproper\b/iu.test(input.stem);
  const blocks = state.map(({ prime, exponent }) => ({ prime, exponent, ...sumBlock(prime, exponent) }));
  const allSum = product(blocks.map(({ value }) => value));
  const n = integerFromState(state);
  const steps = blocks.map(({ prime, exponent, expression, value }) =>
    `${math(`${prime}^{${exponent}}`)} contributes ${math(`${expression}=${value}`)}.`,
  );
  steps.push(`Sum of all divisors ${math(`=${blocks.map(({ value }) => value).join(" \\times ")}=${allSum}`)}.`);
  if (proper) steps.push(`Proper-divisor sum ${math(`=${allSum}-${n}=${input.canonicalAnswer}`)} because n itself is removed.`);
  else steps.push(`Therefore the required sum is ${input.canonicalAnswer}.`);

  return simpleExplanation(
    `For ${factorMath(state)}, add the possible powers of each prime, then multiply those sums.`,
    `Work separately with the prime-power parts of ${factorMath(state)}.`,
    steps,
    proper ? "Find the sum of all divisors first, then subtract n." : "Add each prime-power block first, then multiply the block sums.",
    [
      "This is a divisor-sum question, not a divisor-count question.",
      "Multiply the prime-block sums; do not add the block totals.",
      proper ? `Subtract n=${n} only once.` : "The sum includes both 1 and n.",
    ],
    input.canonicalAnswer,
  );
}

function buildQl052(input) {
  const count = asNumber(input.hiddenState.divisorCount, "divisorCount");
  const isSquare = Boolean(input.hiddenState.perfectSquareState);
  const pairs = Math.floor(count / 2);
  const steps = [
    `The ${count} divisors can be matched from the two ends: smallest with largest, second-smallest with second-largest, and so on.`,
    `Each complete pair has product n.`,
  ];
  if (isSquare) {
    steps.push(`There are ${pairs} complete pairs and one middle divisor ${math("\\sqrt{n}")}.`);
    steps.push(`Product ${math(`=n^{${pairs}}\\sqrt{n}`)}.`);
  } else {
    steps.push(`There are ${math(`${count}\\div2=${pairs}`)} complete pairs.`);
    steps.push(`Product ${math(`=n^{${pairs}}`)}.`);
  }

  return simpleExplanation(
    `The ${count} divisors come in matching pairs, and each pair multiplies to n.`,
    `Use the given divisor count ${count}; there is no need to multiply all divisors one by one.`,
    steps,
    isSquare ? "For an odd divisor count, keep the middle divisor √n." : "For an even divisor count, the number of pairs is d(n)/2.",
    [
      `Use ${pairs} complete pairs, not ${count} copies of n.`,
      isSquare ? "Do not forget the unpaired middle divisor √n." : "There is no unpaired middle divisor because the count is even.",
      "Keep the answer in power form; expanding a huge number adds no value.",
    ],
    input.canonicalAnswer,
  );
}

function buildQl053(input) {
  const state = primePowers(input.hiddenState);
  const divisors = divisorsFromState(state);
  const steps = [];
  let current = [1];
  for (const { prime, exponent } of state) {
    const powers = exponentValues(0, exponent).map((value) => prime ** value);
    steps.push(`Powers of ${prime} available here are ${numberList(powers)}.`);
    current = [...new Set(current.flatMap((value) => powers.map((power) => value * power)))].sort((a, b) => a - b);
  }
  steps.push(`Combining these powers gives ${setText(divisors)}.`);
  steps.push(`Check: ${math(`${divisorFormula(state)}=${divisors.length}`)} divisors are listed.`);

  return simpleExplanation(
    `Every divisor of ${factorMath(state)} is formed by taking one allowed power of each prime and multiplying them.`,
    `Build the list from the prime powers in ${factorMath(state)}.`,
    steps,
    "Make the list in blocks and check its size with the divisor-count formula.",
    [
      "Include 1 by choosing exponent 0 for every prime.",
      `Include n=${integerFromState(state)} by choosing every full exponent.`,
      `The final list must contain exactly ${divisors.length} different numbers.`,
    ],
    input.canonicalAnswer,
  );
}

function buildQl054(input) {
  const target = asNumber(input.hiddenState.targetDivisorCount, "targetDivisorCount");
  const known = asNumber(input.hiddenState.knownChoiceProduct, "knownChoiceProduct");
  const hiddenChoices = asNumber(input.hiddenState.hiddenChoiceCount, "hiddenChoiceCount");
  const x = hiddenChoices - 1;

  return simpleExplanation(
    `In this question, x contributes x+1 choices and the known part contributes ${known} choices.`,
    `The complete divisor count is ${target}.`,
    [
      `${math(`(x+1)\\times${known}=${target}`)}.`,
      `${math(`x+1=${target}\\div${known}=${hiddenChoices}`)}.`,
      `${math(`x=${hiddenChoices}-1=${x}`)}.`,
    ],
    "Divide by the known part first; subtract 1 at the end.",
    [
      `The value ${hiddenChoices} is x+1, not x.`,
      "Use multiplication between the prime-choice counts.",
      `Do not subtract ${known} from ${target}; divide ${target} by ${known}.`,
    ],
    input.canonicalAnswer,
  );
}

function buildQl055(input) {
  const prime = asNumber(input.hiddenState.prime, "prime");
  const target = asNumber(input.hiddenState.targetDivisorCount, "targetDivisorCount");
  const exponent = asNumber(input.hiddenState.exponent, "exponent");

  return simpleExplanation(
    `A power of ${prime}, written ${math(`${prime}^{a}`)}, has a+1 positive divisors.`,
    `Set a+1 equal to ${target}.`,
    [
      `${math(`a+1=${target}`)}.`,
      `${math(`a=${target}-1=${exponent}`)}.`,
      `So the number is ${math(`${prime}^{${exponent}}`)}.`,
    ],
    "For a prime power, exponent = number of divisors − 1.",
    [
      `Using exponent ${target} would give ${target + 1} divisors.`,
      "Do not multiply the prime by the exponent.",
      "Leave the answer in prime-power form when that is what the question asks.",
    ],
    input.canonicalAnswer,
  );
}

function choicePatterns(target, minimumFactor = 2) {
  const results = [];
  function walk(remaining, start, factors) {
    if (remaining === 1) {
      results.push(factors.map((factor) => factor - 1).sort((a, b) => b - a));
      return;
    }
    for (let factor = start; factor <= remaining; factor += 1) {
      if (remaining % factor === 0) walk(remaining / factor, factor, [...factors, factor]);
    }
  }
  walk(target, minimumFactor, []);
  return results;
}

function firstPrimes(oddOnly, count) {
  const primes = [];
  for (let value = oddOnly ? 3 : 2; primes.length < count; value += 1) {
    let prime = value >= 2;
    for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
      if (value % divisor === 0) {
        prime = false;
        break;
      }
    }
    if (prime && (!oddOnly || value % 2 === 1)) primes.push(value);
  }
  return primes;
}

function minimumForPattern(pattern, parity) {
  const primes = firstPrimes(parity === "ODD", pattern.length);
  if (parity === "EVEN" && primes[0] !== 2) primes.unshift(2);
  const usedPrimes = primes.slice(0, pattern.length);
  return pattern.reduce((value, exponent, index) => value * usedPrimes[index] ** exponent, 1);
}

function buildQl056(input) {
  const target = asNumber(input.hiddenState.targetDivisorCount, "targetDivisorCount");
  const parity = typeof input.hiddenState.parity === "string" ? input.hiddenState.parity : "ANY";
  const state = primePowers(input.hiddenState);
  const answer = asNumber(input.hiddenState.integerValue, "integerValue");
  const patterns = choicePatterns(target);
  const candidates = patterns
    .map((pattern) => ({ pattern, value: minimumForPattern(pattern, parity) }))
    .filter(({ value }) => parity !== "EVEN" || value % 2 === 0)
    .sort((left, right) => left.value - right.value);
  const preview = candidates.slice(0, 3).map(({ pattern, value }) => {
    const primes = firstPrimes(parity === "ODD", pattern.length);
    const expression = pattern
      .map((exponent, index) => exponent === 1 ? String(primes[index]) : `${primes[index]}^{${exponent}}`)
      .join(" \\times ");
    return `${math(expression)}=${value}`;
  });

  return simpleExplanation(
    `To get exactly ${target} divisors, the numbers (exponent+1) must multiply to ${target}.`,
    `Compare the smallest number from each possible exponent pattern${parity === "ANY" ? "" : ` while keeping the number ${parity.toLowerCase()}`}.`,
    [
      `The smallest candidate from each pattern is: ${preview.join("; ")}.`,
      `The smallest valid one is ${math(`${answer}=${factorExpression(state)}`)}.`,
      `Check: ${math(`${divisorFormula(state)}=${target}`)}.`,
    ],
    "Compare exponent patterns using the smallest allowed primes.",
    [
      "One prime-power form is not always the smallest form.",
      parity === "ODD" ? "Use odd primes only." : parity === "EVEN" ? "The final number must contain a factor 2." : "Start with the smallest primes.",
      "Put the larger exponent on the smaller prime.",
    ],
    input.canonicalAnswer,
  );
}

function parityMatches(value, parity) {
  return parity === "ANY" || (parity === "ODD" ? value % 2 === 1 : value % 2 === 0);
}

function buildQl057(input) {
  const bound = asNumber(input.hiddenState.bound, "bound");
  const target = asNumber(input.hiddenState.targetDivisorCount, "targetDivisorCount");
  const parity = typeof input.hiddenState.parity === "string" ? input.hiddenState.parity : "ANY";
  const hasSolution = input.hiddenState.existenceClass !== "NO_SOLUTION";
  const answer = hasSolution ? Number(input.canonicalAnswer) : null;
  const rejected = [];
  for (let value = bound; value >= 1 && rejected.length < 3; value -= 1) {
    if (!parityMatches(value, parity)) continue;
    if (answer !== null && value === answer) break;
    rejected.push([value, divisorCountOfInteger(value)]);
  }
  const steps = rejected.map(([value, count]) => `${value} has ${count} positive divisors, so it does not work.`);
  if (hasSolution) {
    const state = primePowers(input.hiddenState);
    steps.push(`${math(`${answer}=${factorExpression(state)}`)} has ${target} positive divisors.`);
    steps.push(`It is the first valid number found when checking downward from ${bound}, so it is the greatest one.`);
  } else {
    steps.push(`No ${parity === "ANY" ? "" : `${parity.toLowerCase()} `}number from ${bound} down to 1 has exactly ${target} divisors.`);
  }

  return simpleExplanation(
    `The answer must be at most ${bound}${parity === "ANY" ? "" : `, must be ${parity.toLowerCase()}`}, and must have exactly ${target} divisors.`,
    `Check numbers downward from ${bound}; stop at the first one that meets every condition.`,
    steps,
    parity === "ANY" ? "Start from the bound and move downward." : `Start from the bound and check only ${parity.toLowerCase()} numbers.`,
    [
      `A number close to ${bound} is not enough; its divisor count must be ${target}.`,
      parity === "ANY" ? "Check every integer in descending order." : `Skip numbers that are not ${parity.toLowerCase()}.`,
      hasSolution ? `Do not stop below ${answer}; ${answer} is already valid.` : "A no-solution answer is possible when every candidate fails.",
    ],
    input.canonicalAnswer,
  );
}

function buildQl058(input) {
  const state = primePowers(input.hiddenState);
  const bound = asNumber(input.hiddenState.bound, "bound");
  const divisors = divisorsFromState(state);
  const allowed = divisors.filter((value) => value <= bound);
  const answer = allowed[allowed.length - 1];
  const lastValues = allowed.slice(Math.max(0, allowed.length - 5));

  return simpleExplanation(
    `We need a divisor of ${factorMath(state)} that is not greater than ${bound}.`,
    `List the divisors near ${bound} and choose the largest one still inside the limit.`,
    [
      `Divisors at or below ${bound} end with ${numberList(lastValues)}.`,
      `${answer} divides ${integerFromState(state)} because ${math(`${integerFromState(state)}\\div${answer}=${integerFromState(state) / answer}`)}.`,
      `No larger divisor is at or below ${bound}, so the answer is ${answer}.`,
    ],
    "Check divisors close to the bound instead of listing every divisor from the start.",
    [
      `${bound} itself need not be a divisor.`,
      `Any divisor greater than ${bound} is outside the question.`,
      `A smaller divisor than ${answer} is valid but not the greatest.`,
    ],
    input.canonicalAnswer,
  );
}

function buildQl059(input) {
  const state = primePowers(input.hiddenState);
  const divisors = divisorsFromState(state);
  const index = asNumber(input.hiddenState.requestedIndex, "requestedIndex");
  const answer = divisors[index - 1];
  const steps = [];
  if (divisors.length <= 15) {
    steps.push(`In increasing order: ${divisors.join(", ")}.`);
  } else {
    const start = Math.max(0, index - 3);
    const end = Math.min(divisors.length, index + 2);
    steps.push(`Around position ${index}, the divisors are ${divisors.slice(start, end).join(", ")}.`);
  }
  steps.push(`Position ${index} contains ${answer}.`);
  steps.push(`Therefore the required divisor is ${answer}.`);

  return simpleExplanation(
    `For ${factorMath(state)}, the positions start from 1 after the divisors are arranged from smallest to largest.`,
    `Order the divisors and read position ${index}.`,
    steps,
    index === 1 ? "The first positive divisor is always 1." : index === divisors.length ? "The last positive divisor is always n." : "Use one-based positions: first means position 1.",
    [
      "Position 1 is the first divisor, not position 0.",
      `The number ${index} is the position, not automatically the divisor.`,
      "A paired divisor may appear far from the requested position.",
    ],
    input.canonicalAnswer,
  );
}

function buildQl060(input) {
  const lower = asNumber(input.hiddenState.lower, "lower");
  const upper = asNumber(input.hiddenState.upper, "upper");
  const target = asNumber(input.hiddenState.targetDivisorCount, "targetDivisorCount");
  const matches = Array.isArray(input.hiddenState.matches) ? input.hiddenState.matches.map(Number) : [];
  const structuralRule = target === 2
    ? "A number has exactly 2 positive divisors only when it is prime."
    : target === 3
      ? "A number has exactly 3 positive divisors only when it is the square of a prime."
      : `Check the divisor count of each number in the interval.`;

  const steps = [
    target === 2 ? `Look for primes from ${lower} to ${upper}.` : target === 3 ? `Look for prime squares from ${lower} to ${upper}.` : `Check each number from ${lower} to ${upper}.`,
    matches.length === 0
      ? `There is no matching number from ${lower} to ${upper}.`
      : `The matching numbers are ${matches.join(", ")}.`,
    `Number of matches ${math(`=${matches.length}`)}.`,
  ];

  return simpleExplanation(
    `${structuralRule} Here the interval is ${math(`[${lower},${upper}]`)}.`,
    `Apply the rule only from ${lower} to ${upper}, including both ends.`,
    steps,
    target === 2 ? "Look for primes in the interval." : target === 3 ? "Look for squares of primes in the interval." : "Count only values whose divisor count is exact.",
    [
      `The endpoints ${lower} and ${upper} are included.`,
      `The answer is the number of matches, not the target ${target}.`,
      "Do not add the matching integers; count them.",
    ],
    input.canonicalAnswer,
  );
}

function metricWorking(kind, state) {
  if (kind === "TOTAL_DIVISORS") {
    return {
      label: "positive divisors",
      value: divisorCountFromState(state),
      formula: `${divisorFormula(state)}=${divisorCountFromState(state)}`,
    };
  }
  if (kind === "ODD_DIVISORS") {
    const oddState = state.filter(({ prime }) => prime !== 2);
    return {
      label: "odd positive divisors",
      value: oddDivisorCountFromState(state),
      formula: `${oddState.length ? divisorFormula(oddState) : "1"}=${oddDivisorCountFromState(state)}`,
    };
  }
  return {
    label: "perfect-square positive divisors",
    value: squareDivisorCountFromState(state),
    formula: `${state.map(({ exponent }) => `(\\lfloor ${exponent}/2\\rfloor+1)`).join(" \\times ")}=${squareDivisorCountFromState(state)}`,
  };
}

function buildQl061(input) {
  const state = primePowers(input.hiddenState);
  const kind = String(input.hiddenState.propertyKind);
  const claimed = String(input.hiddenState.claimedValue);
  const actual = String(input.hiddenState.actualValue);
  const working = metricWorking(kind, state);
  const correct = actual === claimed;

  return simpleExplanation(
    `For ${factorMath(state)}, calculate the ${working.label} and compare it with the student's ${claimed}.`,
    `The calculation must give exactly ${claimed} for the claim to be correct.`,
    [
      `${working.label[0].toUpperCase()}${working.label.slice(1)}: ${math(working.formula)}.`,
      `${math(`${actual}${correct ? "=" : "\\ne"}${claimed}`)}.`,
      correct ? `The claim is correct.` : `The claim is incorrect; the actual value is ${actual}.`,
    ],
    "Calculate first, then judge the claim.",
    [
      `A value close to ${actual} is still wrong unless it is exactly ${actual}.`,
      `Use the formula for ${working.label}, not a different divisor count.`,
      "Do not reverse the final correct/incorrect decision.",
    ],
    input.canonicalAnswer,
  );
}

function buildQl062(input) {
  const state = primePowers(input.hiddenState);
  const claims = Array.isArray(input.hiddenState.claims) ? input.hiddenState.claims.map(Number) : [];
  const total = divisorCountFromState(state);
  const odd = oddDivisorCountFromState(state);
  const square = squareDivisorCountFromState(state);
  const actuals = [total, odd, square];
  const labels = ["I", "II", "III"];
  const names = ["positive divisors", "odd divisors", "square divisors"];
  const formulas = [
    divisorFormula(state),
    divisorFormula(state.filter(({ prime }) => prime !== 2)) || "1",
    state.map(({ exponent }) => `(\\lfloor ${exponent}/2\\rfloor+1)`).join(" \\times "),
  ];
  const steps = labels.map((label, index) =>
    `${label}: ${names[index]} ${math(`=${formulas[index]}=${actuals[index]}`)}. It says ${claims[index]}, so ${label} is ${actuals[index] === claims[index] ? "true" : "false"}.`,
  );

  return simpleExplanation(
    `For ${factorMath(state)}, check I, II and III separately because they ask for different counts.`,
    `Compare each calculated value with the number written in that statement.`,
    steps,
    "Write the three answers in one row: total, odd, square.",
    [
      "The total-divisor formula cannot be copied unchanged for odd divisors.",
      "For square divisors, each chosen exponent must be even.",
      "Check all three statements before selecting the option.",
    ],
    input.canonicalAnswer,
  );
}

function buildQl063(input) {
  const n = asNumber(input.hiddenState.integerValue, "integerValue");
  const visible = asNumber(input.hiddenState.visiblePartner, "visiblePartner");
  const answer = Number(input.canonicalAnswer);

  return simpleExplanation(
    `In the row ${visible}×?=${n}, the two factors must multiply to ${n}.`,
    `Divide ${n} by ${visible}.`,
    [
      `${math(`?=${n}\\div${visible}`)}.`,
      `${math(`?=${answer}`)}.`,
      `Check: ${math(`${visible}\\times${answer}=${n}`)}.`,
    ],
    "Missing partner = number ÷ visible partner.",
    [
      `Copying ${visible} would give ${visible * visible}, not ${n}.`,
      "Use division, not subtraction.",
      "There is no need to write every divisor pair.",
    ],
    input.canonicalAnswer,
  );
}

function buildQl064(input) {
  const maximum = asNumber(input.hiddenState.maximumExponent, "maximumExponent");
  const target = asNumber(input.hiddenState.targetDivisorCount, "targetDivisorCount");
  const all = factorPairs(target).map(([left, right]) => [left - 1, right - 1]);
  const valid = all.filter(([x, y]) => x >= 0 && y >= 0 && x <= maximum && y <= maximum);

  return simpleExplanation(
    `For ${math("n=p^{x}q^{y}")}, exactly ${target} divisors means ${math(`(x+1)(y+1)=${target}`)}.`,
    `Keep only pairs with x and y from 0 to ${maximum}.`,
    [
      `Ordered factor pairs of ${target}: ${formatPairs(factorPairs(target))}.`,
      `Subtract 1 from both entries: ${formatPairs(all)}.`,
      `Pairs inside the limit: ${formatPairs(valid)}. Their number is ${valid.length}.`,
    ],
    "List ordered factor pairs, subtract 1, then apply the limit.",
    [
      "Reversed pairs are different because (x,y) is ordered.",
      `Any x or y greater than ${maximum} must be removed.`,
      `The answer is the number of valid pairs, not ${target}.`,
    ],
    input.canonicalAnswer,
  );
}

function buildQl065(input) {
  const maximum = asNumber(input.hiddenState.maximumExponent, "maximumExponent");
  const target = asNumber(input.hiddenState.targetDivisorCount, "targetDivisorCount");
  const all = factorPairs(target).map(([left, right]) => [left - 1, right - 1]);
  const valid = all.filter(([x, y]) => x >= 0 && y >= 0 && x <= maximum && y <= maximum);

  return simpleExplanation(
    `For exactly ${target} divisors, ${math(`(x+1)(y+1)=${target}`)}.`,
    `Turn the factor pairs of ${target} into exponent pairs and keep exponents from 0 to ${maximum}.`,
    [
      `Factor pairs for x+1 and y+1: ${formatPairs(factorPairs(target))}.`,
      `After subtracting 1: ${formatPairs(all)}.`,
      `Valid ordered pairs: ${formatPairs(valid)}.`,
    ],
    "Turn each factor pair into an exponent pair immediately.",
    [
      "Keep both (x,y) and (y,x) when they are different.",
      "Subtract 1 from both entries, not from only one.",
      `Remove any pair with an exponent above ${maximum}.`,
    ],
    input.canonicalAnswer,
  );
}

function buildQl066(input) {
  const total = asNumber(input.hiddenState.totalDivisors, "totalDivisors");
  const odd = asNumber(input.hiddenState.oddDivisors, "oddDivisors");
  const primes = Array.isArray(input.hiddenState.oddPrimes) ? input.hiddenState.oddPrimes.map(Number) : [];
  const possible = Array.isArray(input.hiddenState.possibleIntegers) ? input.hiddenState.possibleIntegers.map(String) : [];
  const b = odd - 1;
  const aChoice = total / odd;
  const validA = Number.isInteger(aChoice);
  const a = aChoice - 1;
  const steps = [
    `Odd divisors come only from ${math("p^{b}")}, so ${math(`b+1=${odd}`)} and ${math(`b=${b}`)}.`,
    validA
      ? `Total divisors give ${math(`(a+1)\\times${odd}=${total}`)}, so ${math(`a+1=${aChoice}`)} and ${math(`a=${a}`)}.`
      : `${math(`a+1=${total}\\div${odd}`)} is not a whole number, so no integer exponent a is possible.`,
  ];
  if (validA) {
    steps.push(
      possible.length === 0
        ? `The exponents do not produce any allowed value of n.`
        : b === 0
          ? `Since ${math("p^{0}=1")}, every allowed p gives the same number: ${math(`n=2^{${a}}=${possible[0]}`)}.`
          : `Using p from {${primes.join(", ")}} gives ${setText(possible)}.`,
    );
  } else {
    steps.push("Therefore the required set is empty.");
  }

  return simpleExplanation(
    `Here n has ${total} divisors and ${odd} odd divisors. Use these two counts to find a and b.`,
    "Find b from the odd-divisor count first, then use the total count to find a.",
    steps,
    "Use (all divisors) ÷ (odd divisors) = a+1.",
    [
      "a and b must be whole numbers within the given limits.",
      `When b=0, changing p does not change n because ${math("p^{0}=1")}.`,
      "List each possible value only once.",
    ],
    input.canonicalAnswer,
  );
}

function buildQl067(input) {
  const candidates = Array.isArray(input.hiddenState.candidateStates) ? input.hiddenState.candidateStates.map(String) : [];
  const targetTotal = asNumber(input.hiddenState.totalDivisors, "totalDivisors");
  const targetSquare = asNumber(input.hiddenState.squareDivisors, "squareDivisors");
  const rows = candidates.map((candidate) => {
    const state = parseFactorisation(candidate);
    return {
      candidate,
      total: divisorCountFromState(state),
      square: squareDivisorCountFromState(state),
    };
  });
  const steps = rows.map(({ candidate, total, square }) =>
    `${factorisationTextToMath(candidate)} gives ${total} positive divisors and ${square} square divisors${total === targetTotal && square === targetSquare ? "; it matches both" : ""}.`,
  );

  return simpleExplanation(
    `The correct option must have ${targetTotal} positive divisors and ${targetSquare} square divisors.`,
    `Calculate both counts for every displayed factorisation.`,
    steps,
    "Reject an option as soon as either count is wrong.",
    [
      `Matching only the total ${targetTotal} is not enough.`,
      `Matching only the square-divisor count ${targetSquare} is not enough.`,
      "Keep each exponent with its own prime while calculating.",
    ],
    input.canonicalAnswer,
  );
}

function buildQl068(input) {
  const first = primePowers(input.hiddenState);
  const second = secondPrimePowers(input.hiddenState);
  const kind = String(input.hiddenState.metricKind);
  const firstWork = metricWorking(kind, first);
  const secondWork = metricWorking(kind, second);
  const comparison = firstWork.value === secondWork.value ? "=" : firstWork.value > secondWork.value ? ">" : "<";

  return simpleExplanation(
    `Compare the ${firstWork.label} of ${factorMath(first)} and ${factorMath(second)}.`,
    `Calculate the same count for A and B separately.`,
    [
      `A: ${math(firstWork.formula)}.`,
      `B: ${math(secondWork.formula)}.`,
      `${math(`${firstWork.value}${comparison}${secondWork.value}`)}, so ${input.canonicalAnswer}.`,
    ],
    "Write the two calculated counts side by side before comparing.",
    [
      "Do not compare the sizes of A and B themselves.",
      "Use the same divisor rule for both numbers.",
      "Keep A's value and B's value in the correct order.",
    ],
    input.canonicalAnswer,
  );
}

function buildQl069(input) {
  const first = Array.isArray(input.hiddenState.firstCandidates) ? input.hiddenState.firstCandidates.map(Number) : [];
  const second = Array.isArray(input.hiddenState.secondCandidates) ? input.hiddenState.secondCandidates.map(Number) : [];
  const combined = Array.isArray(input.hiddenState.combinedCandidates) ? input.hiddenState.combinedCandidates.map(Number) : [];

  return simpleExplanation(
    `For this question, a statement is enough only when it leaves one possible value of x.`,
    "Find the possible x-values from Statement I, from Statement II, and then from both together.",
    [
      `Statement I leaves x in {${first.join(", ")}}. ${first.length === 1 ? "So I alone is sufficient." : "So I alone is not sufficient."}`,
      `Statement II leaves x in {${second.join(", ")}}. ${second.length === 1 ? "So II alone is sufficient." : "So II alone is not sufficient."}`,
      `Using both statements leaves x in {${combined.join(", ")}}. ${combined.length === 1 ? "Together they give one value." : "Together they still do not give one value."}`,
    ],
    "Count the possible x-values: one value means sufficient.",
    [
      "A statement is not sufficient merely because the hidden answer satisfies it.",
      "More than one possible x-value means the statement is not sufficient.",
      "When neither statement works alone, check their common values.",
    ],
    input.canonicalAnswer,
  );
}

const BUILDERS = {
  "NUM-QL-046": buildQl046,
  "NUM-QL-047": buildQl047,
  "NUM-QL-048": buildQl048,
  "NUM-QL-049": buildQl049,
  "NUM-QL-050": buildQl050,
  "NUM-QL-051": buildQl051,
  "NUM-QL-052": buildQl052,
  "NUM-QL-053": buildQl053,
  "NUM-QL-054": buildQl054,
  "NUM-QL-055": buildQl055,
  "NUM-QL-056": buildQl056,
  "NUM-QL-057": buildQl057,
  "NUM-QL-058": buildQl058,
  "NUM-QL-059": buildQl059,
  "NUM-QL-060": buildQl060,
  "NUM-QL-061": buildQl061,
  "NUM-QL-062": buildQl062,
  "NUM-QL-063": buildQl063,
  "NUM-QL-064": buildQl064,
  "NUM-QL-065": buildQl065,
  "NUM-QL-066": buildQl066,
  "NUM-QL-067": buildQl067,
  "NUM-QL-068": buildQl068,
  "NUM-QL-069": buildQl069,
};

export function buildNumCp005StudentExplanation(input) {
  const builder = BUILDERS[input.qlId];
  if (!builder) throw new Error(`No student explanation builder for ${input.qlId}`);
  return builder(input);
}
