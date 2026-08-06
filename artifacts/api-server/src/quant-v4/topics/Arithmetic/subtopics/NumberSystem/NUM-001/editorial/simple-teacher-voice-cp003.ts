// @ts-nocheck
import * as core from "./simple-teacher-voice-core";
const {
  rawText,
  cleanText,
  formatNumber,
  mathNumber,
  mathValue,
  displayEquation,
  titleCaseClass,
  studentOptionDisplay,
  optionValues,
  correctIndex,
  correctAnswerDisplay,
  gcd,
  isPrime,
  primeFactors,
  factorisationMath,
  factorisationPlain,
  productFromFactors,
  digitSum,
  alternatingSums,
  fillTemplate,
  setText,
  pairText,
  pairSetText,
  assignmentLabel,
  primitiveDivisors,
  ruleSentence,
  divisibilityEvidence,
  templateDigitSum,
  templateRuleSteps,
  simpleDiagnostic,
  parseNumericOption,
  parseAdjustmentSet,
  parseIntegerList,
  smallestNonTrivialDivisor,
  listDifference,
  SIMPLE_NUMBER_SYSTEM_QL_TITLES,
  COMPOSITE_RULE_PARTS
} = core;

export function cp003Teacher(row) {
  const state = row.question.hiddenState;
  const ql = row.allocation.qlId;

  if (state.kind === "DIRECT_DIVISIBILITY") {
    const answer = Number(row.question.answer);
    const answerEvidence = divisibilityEvidence(state.number, answer);
    return {
      mainRule: [ruleSentence(answer)],
      steps: [
        `Read the question carefully: it asks for the number that ${state.requestedPolarity === "DIVISIBLE" ? "divides exactly" : "does not divide exactly"}.`,
        ...state.divisorOptions.map((divisor) => {
          const evidence = divisibilityEvidence(state.number, divisor);
          return `**Check ${mathNumber(divisor)}:** ${evidence.text}`;
        }),
        `So the correct choice is ${mathNumber(answer)}. ${answerEvidence.divides ? "The remainder is 0." : `The remainder is ${mathNumber(answerEvidence.remainder)}.`}`,
      ],
      speedTrick: [
        `Use the shortest rule first: last digit, digit sum, last two or three digits, or the alternating-sum rule for ${mathNumber(11)}. Use long division only when no quick rule fits.`,
      ],
    };
  }

  if (state.kind === "SINGLE_DIGIT_CANDIDATE_SET") {
    const assignments = state.validDigits.map((x) => ({ x }));
    const completed = state.validDigits.map((x) => fillTemplate(state.template, { x }));
    const steps = [];
    if (String(state.template).startsWith("X")) {
      steps.push(`${mathNumber(0)} cannot be used because ${mathValue(state.template)} must remain a full number with the stated number of digits.`);
    }
    for (const divisor of state.divisors) {
      const parts = COMPOSITE_RULE_PARTS[Number(divisor)];
      if (parts) steps.push(`Split ${mathNumber(divisor)} into ${mathNumber(parts[0])} and ${mathNumber(parts[1])}; both rules must work.`);
    }
    steps.push(...primitiveDivisors(state.divisors).flatMap((divisor) =>
      templateRuleSteps(state.template, divisor, assignments)));
    steps.push(`The digits that satisfy every rule are ${mathValue(setText(state.validDigits))}.`);
    if (state.projection === "UNIQUE_VALID_DIGIT") {
      steps.push(`Only ${mathNumber(state.validDigits[0])} works, so ${mathValue(`X = ${state.validDigits[0]}`)}. The completed number is ${mathNumber(completed[0])}.`);
    } else if (state.projection === "EXTREMUM_VALID_DIGIT") {
      const largest = state.extremumDirection === "LARGEST";
      const answer = largest ? state.validDigits.at(-1) : state.validDigits[0];
      steps.push(`Choose the ${largest ? "largest" : "smallest"} valid digit: ${mathValue(`X = ${answer}`)}.`);
    } else if (state.projection === "VALID_DIGIT_COUNT") {
      steps.push(`Count the valid digits: ${mathNumber(state.validDigits.length)}.`);
    } else if (state.projection === "VALID_DIGIT_SUM") {
      const total = state.validDigits.reduce((sum, digit) => sum + digit, 0);
      steps.push(`${displayEquation(`${state.validDigits.join(" + ")} = ${total}`)} So the required sum is ${mathNumber(total)}.`);
    } else if (state.projection === "COMPLETE_VALID_DIGIT_SET") {
      steps.push(`Therefore, the complete set is ${mathValue(setText(state.validDigits))}.`);
    } else if (state.projection === "EXTREMUM_COMPLETED_NUMBER") {
      const greatest = state.extremumDirection === "GREATEST";
      const answer = greatest ? completed.at(-1) : completed[0];
      steps.push(`The completed numbers are ${completed.map(mathNumber).join(", ")}. The ${greatest ? "greatest" : "smallest"} is ${mathNumber(answer)}.`);
    }
    return {
      mainRule: [state.divisors.map(ruleSentence).join(" ")],
      steps,
      speedTrick: [
        `Start with the rule that uses the fewest digits. A last-digit or last-three-digit rule often removes most choices before you use the digit sum.`,
      ],
    };
  }

  if (state.kind === "ORDERED_PAIR_CANDIDATE_SET") {
    const assignments = state.validPairs.map(([x, y]) => ({ x, y }));
    const steps = [];
    if (state.relation?.kind === "DIGIT_SUM") {
      steps.push(`Use the extra condition first: ${displayEquation(`X + Y = ${state.relation.value}`)}`);
    }
    for (const divisor of state.divisors) {
      const parts = COMPOSITE_RULE_PARTS[Number(divisor)];
      if (parts) steps.push(`For ${mathNumber(divisor)}, both the ${mathNumber(parts[0])} rule and the ${mathNumber(parts[1])} rule must work.`);
    }
    steps.push(...primitiveDivisors(state.divisors).flatMap((divisor) =>
      templateRuleSteps(state.template, divisor, assignments)));
    steps.push(`The valid ordered pairs are ${mathValue(pairSetText(state.validPairs))}. Remember that ${mathValue("(X,Y)")} and ${mathValue("(Y,X)")} are different.`);
    if (state.projection === "UNIQUE_VALID_ORDERED_PAIR") {
      steps.push(`Only ${mathValue(pairText(state.validPairs[0]))} works, so that is the answer.`);
    } else if (state.projection === "VALID_ORDERED_PAIR_COUNT") {
      steps.push(`There are ${mathNumber(state.validPairs.length)} valid ordered pairs.`);
    } else if (state.projection === "COMPLETE_VALID_ORDERED_PAIR_SET") {
      steps.push(`So the complete answer is ${mathValue(pairSetText(state.validPairs))}.`);
    } else if (state.projection === "PAIR_SOLUTION_CLASS") {
      const count = state.validPairs.length;
      const result = count === 0 ? "No solution" : count === 1 ? "Exactly one solution" : "More than one solution";
      steps.push(`The number of valid pairs is ${mathNumber(count)}, so the correct description is **${result}**.`);
    }
    return {
      mainRule: [
        `The positions of ${mathValue("X")} and ${mathValue("Y")} matter. A pair is valid only when every given condition is satisfied.`,
      ],
      steps,
      speedTrick: [
        `Use ${mathValue("X + Y")} first when it is given. Then check the last two or three digits before doing any full-number calculation.`,
      ],
    };
  }

  if (state.kind === "DIGIT_BOUND_MULTIPLE") {
    const divisor = BigInt(state.divisor);
    const lower = BigInt(state.lowerBoundary);
    const upper = BigInt(state.upperBoundary);
    const answer = BigInt(state.answer);
    const isGreatest = state.direction === "GREATEST";
    const boundary = isGreatest ? upper : lower;
    const quotient = boundary / divisor;
    const remainder = boundary % divisor;
    const adjusted = isGreatest
      ? boundary - remainder
      : remainder === 0n ? boundary : boundary + (divisor - remainder);
    return {
      mainRule: [
        `For the greatest multiple, subtract the boundary remainder. For the smallest multiple, add what is needed to reach the next multiple.`,
      ],
      steps: [
        `The ${state.digits}-digit range is ${mathNumber(lower)} to ${mathNumber(upper)}.`,
        `${displayEquation(`${formatNumber(boundary)} = ${state.divisor} \\times ${formatNumber(quotient)} + ${remainder}`)} The boundary remainder is ${mathNumber(remainder)}.`,
        isGreatest
          ? `${displayEquation(`${formatNumber(boundary)} - ${remainder} = ${formatNumber(adjusted)}`)} This is the greatest ${state.digits}-digit multiple.`
          : `${displayEquation(`${formatNumber(boundary)} + ${divisor - remainder} = ${formatNumber(adjusted)}`)} This is the smallest ${state.digits}-digit multiple.`,
        `Therefore, the answer is ${mathNumber(answer)}.`,
      ],
      speedTrick: [
        isGreatest
          ? `Divide the upper boundary by ${mathNumber(divisor)} and subtract only the remainder.`
          : `Divide the lower boundary by ${mathNumber(divisor)} and add ${mathNumber(divisor)} minus the remainder.`,
      ],
    };
  }

  if (state.kind === "ONE_DIVISOR_RANGE") {
    const lower = BigInt(state.lower);
    const upper = BigInt(state.upper);
    const divisor = BigInt(state.divisor);
    const upperCount = upper / divisor;
    const belowLowerCount = (lower - 1n) / divisor;
    const count = upperCount - belowLowerCount;
    return {
      mainRule: [
        `The number of multiples of ${mathNumber(divisor)} from ${mathNumber(lower)} to ${mathNumber(upper)} is ${mathValue("\\lfloor U/d \\rfloor - \\lfloor (L-1)/d \\rfloor")}.`,
      ],
      steps: [
        `${displayEquation(`\\left\\lfloor \\frac{${formatNumber(upper)}}{${divisor}} \\right\\rfloor = ${upperCount}`)} This counts all multiples up to the upper limit.`,
        `${displayEquation(`\\left\\lfloor \\frac{${formatNumber(lower - 1n)}}{${divisor}} \\right\\rfloor = ${belowLowerCount}`)} This counts the multiples before the range starts.`,
        `${displayEquation(`${upperCount} - ${belowLowerCount} = ${count}`)} So there are ${mathNumber(count)} required integers.`,
      ],
      speedTrick: [
        `Use the floor-count formula. It is faster and safer than writing every multiple in the range.`,
      ],
    };
  }

  if (state.kind === "IMPLICIT_REPEATED_NUMERAL") {
    const answer = Number(row.question.answer);
    const evidence = divisibilityEvidence(state.number, answer);
    return {
      mainRule: [
        `First write the repeated block as one number. Then use the quickest divisibility rule for each option.`,
      ],
      steps: [
        `Repeating ${mathValue(state.block)} ${state.repeats} times gives ${mathNumber(state.number)}.`,
        `**Check the correct divisor ${mathNumber(answer)}:** ${evidence.text}`,
        ...state.divisorOptions.filter((value) => Number(value) !== answer).map((value) => {
          const check = divisibilityEvidence(state.number, value);
          return `**Check ${mathNumber(value)}:** ${check.text}`;
        }),
        `Only the required option divides the repeated number exactly.`,
      ],
      speedTrick: [
        `Use the last digit, digit sum or last-three-digit rule before trying full division of the long repeated number.`,
      ],
    };
  }

  if (state.kind === "LINKED_ARITHMETIC_DIVISIBILITY") {
    const validA = state.validPairs.map((pair) => pair[0]);
    const answer = state.answerDigit;
    const pairLines = state.arithmeticPairs.map(([a, b]) => `${a}→${b}`).join(", ");
    const validLines = state.validPairs.map(([a, b]) => `(${a}, ${b})`).join(", ");
    const exampleResult = fillTemplate(state.resultPattern, { x: answer, y: state.validPairs.find((pair) => pair[0] === answer)?.[1] });
    return {
      mainRule: [
        `The digits must satisfy the addition first and the divisibility rule second. Both conditions must hold for the same pair.`,
      ],
      steps: [
        `Complete the addition. The possible ${mathValue("A \\to B")} pairs are ${mathValue(pairLines)}.`,
        `Apply divisibility by ${mathNumber(state.divisor)} to the result pattern ${mathValue(state.resultPattern)}. The working pairs are ${mathValue(`{${validLines}}`)}.`,
        `The possible ${mathValue("A")} values are ${mathValue(setText(validA))}. Choose the ${state.direction.toLowerCase()} one: ${mathValue(`A = ${answer}`)}.`,
        `Check: the completed result is ${mathNumber(exampleResult)}, and it is divisible by ${mathNumber(state.divisor)}.`,
      ],
      speedTrick: [
        `Use the digit sum of the result number. You usually do not need to perform long division by ${mathNumber(state.divisor)}.`,
      ],
    };
  }

  if (state.kind === "DATA_SUFFICIENCY") {
    const classText = {
      I_ALONE: "Statement I alone is sufficient.",
      II_ALONE: "Statement II alone is sufficient.",
      EACH_ALONE: "Each statement alone is sufficient.",
      BOTH_TOGETHER: "Both statements together are sufficient, but neither alone is sufficient.",
      INSUFFICIENT: "Even both statements together are not sufficient.",
    }[state.sufficiencyClass];
    return {
      mainRule: [
        `A statement is sufficient only when it leaves exactly one possible value of ${mathValue("X")}.`,
      ],
      steps: [
        `Statement I leaves ${mathValue(setText(state.candidatesI))}. Number of possibilities: ${mathNumber(state.candidatesI.length)}.`,
        `Statement II leaves ${mathValue(setText(state.candidatesII))}. Number of possibilities: ${mathNumber(state.candidatesII.length)}.`,
        `Using both statements leaves ${mathValue(setText(state.candidatesTogether))}. Number of possibilities: ${mathNumber(state.candidatesTogether.length)}.`,
        `Therefore, **${classText}**`,
      ],
      speedTrick: [
        `Do not solve more than needed. Just count the values left by Statement I, Statement II and both together.`,
      ],
    };
  }

  if (state.kind === "CLAIM_VALIDATION") {
    const correctClaim = state.claims.find((claim) => claim.isTrue === (state.requestedPolarity === "CORRECT"));
    return {
      mainRule: [
        `Check each statement with the correct divisibility rule. A statement is true only when its wording matches the actual remainder.`,
      ],
      steps: [
        ...state.claims.map((claim) => {
          const evidence = divisibilityEvidence(claim.number, claim.divisor);
          return `**${cleanText(claim.text)}** ${evidence.text} So the statement is **${claim.isTrue ? "true" : "false"}**.`;
        }),
        `Therefore, the correct statement is **${cleanText(correctClaim.text)}**`,
      ],
      speedTrick: [
        `Match each divisor with its quickest rule. Check the last digits for ${mathNumber(8)}, digit sum for ${mathNumber(9)}, and alternating sums for ${mathNumber(11)}.`,
      ],
    };
  }

  const explanation = row.question.explanation;
  return {
    mainRule: [cleanText(explanation.coreConcept)],
    steps: [...explanation.steps.map(cleanText), cleanText(explanation.verification), cleanText(explanation.conclusion)],
    speedTrick: [cleanText(explanation.shortcut)],
  };
}

export function primeTestText(value) {
  const n = Number(value);
  if (n < 2) return `${mathNumber(n)} is less than ${mathNumber(2)}, so it is not prime.`;
  if (isPrime(n)) {
    const limit = Math.floor(Math.sqrt(n));
    return `${mathNumber(n)} is not divisible by any prime up to ${mathValue(`\\sqrt{${n}} \\approx ${limit}`)}, so it is prime.`;
  }
  const factor = primeFactors(n)[0]?.prime ?? 1;
  return `${displayEquation(`${n} = ${factor} \\times ${n / factor}`)} So ${mathNumber(n)} is composite.`;
}

export function classification(value) {
  if (value === 1) return "Unit";
  if (value <= 0) return "Neither prime nor composite";
  return isPrime(value) ? "Prime" : "Composite";
}
