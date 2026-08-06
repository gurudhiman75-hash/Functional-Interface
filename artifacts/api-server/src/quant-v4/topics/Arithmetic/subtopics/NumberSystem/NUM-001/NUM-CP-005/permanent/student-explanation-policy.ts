function normalizeLine(value) {
  return value.trim().toLowerCase().replace(/\s+/gu, " ");
}

function fixSimpleGrammar(value) {
  return value
    .replace(/(^|[\s(])1 choices\b/gu, "$11 choice")
    .replace(/\b1 positive divisors\b/gu, "1 positive divisor")
    .replace(/\b1 odd divisors\b/gu, "1 odd divisor")
    .replace(/\b1 square divisors\b/gu, "1 square divisor")
    .replace(/\b1 divisors\b/gu, "1 divisor")
    .replace(/\b1 are\b/gu, "1 is")
    .replace(/\bcalculate the (positive divisors|odd positive divisors|perfect-square positive divisors)\b/giu, "calculate the number of $1")
    .replace(/\\\)=(-?\d+)/gu, "=$1\\)")
    .replace(/\b2th\b/gu, "2nd")
    .replace(/\b3th\b/gu, "3rd")
    .replace(/\.\.+$/gu, ".");
}

function wordCount(value) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function divisorCount(value) {
  if (!Number.isInteger(value) || value < 1) return 0;
  let count = 0;
  for (let divisor = 1; divisor * divisor <= value; divisor += 1) {
    if (value % divisor !== 0) continue;
    count += divisor * divisor === value ? 1 : 2;
  }
  return count;
}

function parityMatches(value, parity) {
  return parity === "ANY" || (parity === "ODD" ? value % 2 === 1 : value % 2 === 0);
}

function chunks(values, size) {
  const result = [];
  for (let index = 0; index < values.length; index += size) {
    result.push(values.slice(index, index + size));
  }
  return result;
}

const machineLanguagePattern =
  /\b(?:governed|admissible|independently|exponent-choice|set-difference|canonical|verifier|semantic|bounded optimisation|retain)\b/iu;

function questionSpecificOpeningStep(input) {
  if (input.qlId !== "NUM-QL-064" && input.qlId !== "NUM-QL-065") return null;
  const target = Number(input.hiddenState.targetDivisorCount);
  if (!Number.isFinite(target)) {
    throw new Error(`${input.qlId}/${input.seed}: missing divisor-count target`);
  }
  return `Start with \\((x+1)(y+1)=${target}\\).`;
}

function factorText(state) {
  return state.map((entry) => {
    const prime = Number(entry?.prime);
    const exponent = Number(entry?.exponent);
    return exponent === 1 ? String(prime) : `${prime}^{${exponent}}`;
  }).join(" \\times ");
}

function primePowerLabel(entry) {
  const prime = Number(entry?.prime);
  const exponent = Number(entry?.exponent);
  return exponent === 1 ? String(prime) : `${prime}^{${exponent}}`;
}

function isRedundantAnswerRestatement(step, input) {
  const text = step.trim();
  if (!/^(?:so|therefore|hence)\b/iu.test(text)) return false;
  if (/(?:=|\\times|\\div|\\frac|\\lfloor)/u.test(text)) return false;
  const answer = String(input.canonicalAnswer).replaceAll("\\", "");
  const plainText = text.replaceAll("\\", "");
  return answer.length > 0 && plainText.includes(answer);
}

function polishQuestionSpecificText(input, explanation) {
  const result = {
    ...explanation,
    stepByStep: [...explanation.stepByStep],
    commonTraps: [...explanation.commonTraps],
  };

  if (input.qlId === "NUM-QL-047") {
    const factorState = Array.isArray(input.hiddenState.factorState) ? input.hiddenState.factorState : [];
    const hasFactorTwo = factorState.some((entry) => Number(entry?.prime) === 2);
    const asksForOdd = /\bodd\b/iu.test(input.stem);
    if (!hasFactorTwo && asksForOdd) {
      const choiceSteps = factorState.map((entry) => {
        const prime = Number(entry?.prime);
        const exponent = Number(entry?.exponent);
        const choices = Array.from({ length: exponent + 1 }, (_unused, index) => index).join(", ");
        return `For \\(${primePowerLabel(entry)}\\), the exponent can be ${choices}. That gives ${exponent + 1} choices.`;
      });
      const formula = factorState.map((entry) => `(${Number(entry?.exponent)}+1)`).join(" \\times ");
      result.coreConcept = "Since n has no factor 2, every positive divisor of n is odd.";
      result.givenDataAndStrategy = "Count the divisors directly from the prime exponents.";
      result.stepByStep = [
        ...choiceSteps,
        `Multiply the choices: \\(${formula}=${input.canonicalAnswer}\\).`,
      ];
      result.examSpeedMethod = "For an odd number, the odd-divisor count equals the total divisor count.";
      result.commonTraps = [
        "Do not remove any divisor; every positive divisor here is odd.",
        "Exponent 0 is included for each prime.",
        "Multiply the choice counts for the different primes.",
      ];
    }
  }

  if (input.qlId === "NUM-QL-048") {
    result.commonTraps = [
      "For a required prime, exponent 0 is not allowed.",
      "Start from the exponent shown in the condition and include every larger allowed exponent.",
      "Multiply the number of choices for the different primes.",
    ];
  }

  if (input.qlId === "NUM-QL-049") {
    const firstCount = Number(input.hiddenState.divisibleByFirst);
    const overlap = Number(input.hiddenState.divisibleByBoth);
    result.commonTraps = [
      `The first count is ${firstCount}, but it still includes divisors that satisfy both conditions.`,
      `The overlap is ${overlap}; remove it from ${firstCount}.`,
      `The words “but not” mean ${firstCount}-${overlap}=${input.canonicalAnswer}.`,
    ];
  }

  if (input.qlId === "NUM-QL-056") {
    const state = Array.isArray(input.hiddenState.factorState) ? input.hiddenState.factorState : [];
    if (state.length === 1) {
      const exponent = Number(state[0]?.exponent);
      const target = Number(input.hiddenState.targetDivisorCount);
      const expression = factorText(state);
      const answer = String(input.hiddenState.integerValue);
      result.stepByStep = [
        `The exponent must be ${exponent} because ${exponent}+1=${target}.`,
        `Using the smallest allowed prime gives \\(n=${expression}=${answer}\\).`,
        `Check: \\(d(n)=${exponent}+1=${target}\\).`,
      ];
    }
  }

  if (input.qlId === "NUM-QL-057") {
    const bound = Number(input.hiddenState.bound);
    const target = Number(input.hiddenState.targetDivisorCount);
    const parity = typeof input.hiddenState.parity === "string" ? input.hiddenState.parity : "ANY";
    const numericAnswer = /^\d+$/u.test(String(input.canonicalAnswer))
      ? Number(input.canonicalAnswer)
      : null;
    const checked = [];
    const stoppingPoint = numericAnswer ?? 0;
    for (let value = bound; value > stoppingPoint; value -= 1) {
      if (parityMatches(value, parity)) checked.push(value);
    }
    result.stepByStep = chunks(checked, 5).map((group, index) => {
      const calculations = group.map((value) => `d(${value})=${divisorCount(value)}`).join(", ");
      return `${index === 0 ? "Checking downward" : "Continue"}: \\(${calculations}\\).`;
    });
    if (numericAnswer !== null) {
      const state = Array.isArray(input.hiddenState.factorState) ? input.hiddenState.factorState : [];
      const expression = state.length > 0 ? factorText(state) : String(numericAnswer);
      result.stepByStep.push(`The next candidate is \\(${numericAnswer}=${expression}\\), and \\(d(${numericAnswer})=${target}\\).`);
      result.stepByStep.push(`It is the first valid candidate, so it is the greatest possible value.`);
      result.commonTraps = [
        `Every allowed candidate above ${numericAnswer} must be ruled out.`,
        parity === "ANY" ? "Check the integers in descending order." : `Check only ${parity.toLowerCase()} integers.`,
        `Stop at ${numericAnswer}; the first valid candidate is the greatest one.`,
      ];
    } else {
      result.stepByStep.push(`None of the allowed candidates has exactly ${target} positive divisors.`);
      result.commonTraps = [
        "Do not assume that a valid number must exist.",
        parity === "ANY" ? "Check the whole allowed interval." : `Check only ${parity.toLowerCase()} integers in the interval.`,
        `Every candidate must have exactly ${target} positive divisors.`,
      ];
    }
  }

  if (input.qlId === "NUM-QL-059") {
    const index = Number(input.hiddenState.requestedIndex);
    const positionClass = String(input.hiddenState.positionClass ?? "MIDDLE");
    const orderedWorking = result.stepByStep[0];
    result.stepByStep = [
      orderedWorking,
      `At position ${index}, \\(d_{${index}}=${input.canonicalAnswer}\\).`,
    ];
    if (positionClass === "FIRST") {
      result.commonTraps = [
        "1 is the first divisor because 1 divides every positive integer.",
        "Position 1 means the first entry; positions do not begin at 0.",
        "Do not choose n, which is the last divisor in the ordered list.",
      ];
    } else if (positionClass === "LAST") {
      result.commonTraps = [
        "The last positive divisor is n itself.",
        "Count positions from 1, not from 0.",
        "Do not choose 1, which is the first divisor.",
      ];
    } else {
      result.commonTraps = [
        "Arrange all divisors in increasing order before reading the position.",
        `Read position ${index} from a list that starts at position 1.`,
        "Do not return the position number unless that number is actually at the position.",
      ];
    }
  }

  if (input.qlId === "NUM-QL-061") {
    const actual = String(input.hiddenState.actualValue);
    const claimed = String(input.hiddenState.claimedValue);
    const correct = actual === claimed;
    result.stepByStep = [
      ...result.stepByStep,
      correct
        ? `The calculated value ${actual} matches the claimed value ${claimed}, so the claim is correct.`
        : `The calculated value ${actual} does not match ${claimed}, so the claim is incorrect.`,
    ];
  }

  if (input.qlId === "NUM-QL-064" || input.qlId === "NUM-QL-065") {
    result.coreConcept = "A divisor is formed by choosing a power of p and a power of q.";
  }

  if (input.qlId === "NUM-QL-068") {
    const first = Number(input.hiddenState.firstValue);
    const second = Number(input.hiddenState.secondValue);
    const conclusion = first > second
      ? "Number A has more divisors."
      : first < second
        ? "Number B has more divisors."
        : "Both numbers have the same number of divisors.";
    const sign = first > second ? ">" : first < second ? "<" : "=";
    result.stepByStep = [
      ...result.stepByStep.slice(0, -1),
      `Since \\(${first}${sign}${second}\\), ${conclusion}`,
    ];
    result.finalAnswer = `${conclusion.slice(0, -1)} because ${first} ${sign} ${second}.`;
  }

  if (input.qlId === "NUM-QL-069") {
    const first = Array.isArray(input.hiddenState.firstCandidates) ? input.hiddenState.firstCandidates : [];
    const second = Array.isArray(input.hiddenState.secondCandidates) ? input.hiddenState.secondCandidates : [];
    const combined = Array.isArray(input.hiddenState.combinedCandidates) ? input.hiddenState.combinedCandidates : [];
    const firstSufficient = first.length === 1;
    const secondSufficient = second.length === 1;
    result.commonTraps = [
      "One remaining value of x means sufficient; more than one means insufficient.",
      firstSufficient
        ? "Statement I already fixes x, so both statements are not required."
        : `Statement I leaves ${first.length} possible values, so it is not enough alone.`,
      secondSufficient
        ? "Statement II already fixes x, so both statements are not required."
        : combined.length === 1
          ? "Statement II is not enough alone; use the common value from both statements."
          : "Even together, the statements leave more than one possible value.",
    ];
  }

  return result;
}

export function enforceNumCp005StudentExplanationPolicy(input, explanation) {
  const questionSpecific = polishQuestionSpecificText(input, explanation);
  const coreConcept = fixSimpleGrammar(questionSpecific.coreConcept);
  const givenDataAndStrategy = fixSimpleGrammar(questionSpecific.givenDataAndStrategy);
  const finalAnswer = fixSimpleGrammar(questionSpecific.finalAnswer);
  const seen = new Set([
    normalizeLine(coreConcept),
    normalizeLine(givenDataAndStrategy),
    normalizeLine(finalAnswer),
  ]);

  const openingStep = questionSpecificOpeningStep(input);
  const rawSteps = openingStep
    ? [openingStep, ...questionSpecific.stepByStep]
    : questionSpecific.stepByStep;
  const stepByStep = [];
  for (const rawStep of rawSteps) {
    const step = fixSimpleGrammar(rawStep);
    if (isRedundantAnswerRestatement(step, input)) continue;
    const normalized = normalizeLine(step);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    stepByStep.push(step);
  }

  const examSpeedMethod = fixSimpleGrammar(questionSpecific.examSpeedMethod);
  const traps = questionSpecific.commonTraps.map(fixSimpleGrammar);
  const commonTraps = [...new Map(traps.map((trap) => [normalizeLine(trap), trap])).values()];

  const polished = {
    coreConcept,
    givenDataAndStrategy,
    stepByStep,
    examSpeedMethod,
    commonTraps,
    finalAnswer,
  };

  const lines = [
    polished.coreConcept,
    polished.givenDataAndStrategy,
    ...polished.stepByStep,
    polished.examSpeedMethod,
    ...polished.commonTraps,
    polished.finalAnswer,
  ];
  const joined = lines.join("\n");

  if (machineLanguagePattern.test(joined)) {
    throw new Error(`${input.qlId}/${input.seed}: machine-like wording entered the student explanation`);
  }
  if (/(^|[\s(])1 choices\b/iu.test(joined) || /\b(?:1th|2th|3th)\b/iu.test(joined)) {
    throw new Error(`${input.qlId}/${input.seed}: broken learner-facing grammar`);
  }
  if (polished.stepByStep.length < 2) {
    throw new Error(`${input.qlId}/${input.seed}: explanation needs at least two working steps`);
  }
  if (polished.commonTraps.length !== 3) {
    throw new Error(`${input.qlId}/${input.seed}: three different question checks are required`);
  }
  if (lines.some((line) => wordCount(line) > 32)) {
    throw new Error(`${input.qlId}/${input.seed}: explanation sentence is too long`);
  }
  if (input.qlId !== "NUM-QL-068" && !polished.finalAnswer.includes(input.canonicalAnswer)) {
    throw new Error(`${input.qlId}/${input.seed}: final answer does not match the question`);
  }
  if (input.qlId === "NUM-QL-068" && !/Number A|Number B|same number of divisors/iu.test(polished.finalAnswer)) {
    throw new Error(`${input.qlId}/${input.seed}: comparison conclusion is missing`);
  }

  return polished;
}
