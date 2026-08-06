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
      const count = String(input.canonicalAnswer);
      result.coreConcept = "Because n is odd, all its positive divisors are odd.";
      result.givenDataAndStrategy = "Count all positive divisors of n; this is also the number of odd divisors.";
      result.examSpeedMethod = "For an odd n, odd-divisor count = total divisor count.";
      result.commonTraps = [
        "n has no factor 2, so none of its divisors can be even.",
        "Do not remove any divisor; every positive divisor here is odd.",
        `The odd-divisor count and the total divisor count are both ${count}.`,
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

  if (input.qlId === "NUM-QL-059") {
    const index = Number(input.hiddenState.requestedIndex);
    const positionClass = String(input.hiddenState.positionClass ?? "MIDDLE");
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
        `Position ${index} means the ${index}th entry in a one-based list.`,
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

  if (input.qlId === "NUM-QL-068") {
    const first = String(input.hiddenState.firstValue);
    const second = String(input.hiddenState.secondValue);
    const outcome = String(input.canonicalAnswer).split(";").at(-1)?.trim().replace(/\.$/u, "") ?? "";
    const conclusion = outcome === "Number A"
      ? "Number A has more divisors."
      : outcome === "Number B"
        ? "Number B has more divisors."
        : "Both numbers have the same number of divisors.";
    result.stepByStep = [
      ...result.stepByStep.slice(0, -1),
      `A has ${first} divisors and B has ${second}. ${conclusion}`,
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
  if (!polished.finalAnswer.includes(input.canonicalAnswer)) {
    throw new Error(`${input.qlId}/${input.seed}: final answer does not match the question`);
  }

  return polished;
}
