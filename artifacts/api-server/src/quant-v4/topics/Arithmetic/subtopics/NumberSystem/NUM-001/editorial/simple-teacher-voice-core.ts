// @ts-nocheck
import { formatStandaloneIntegersForEnglishIndia } from "./english-stem-style";
import { normaliseNumberSystemReviewMath } from "./explanation-rendering";

export const SIMPLE_NUMBER_SYSTEM_QL_TITLES = Object.freeze({
  "NUM-QL-001": "Divisibility check",
  "NUM-QL-002": "Find the missing digit",
  "NUM-QL-003": "Largest or smallest valid digit",
  "NUM-QL-004": "Count the valid digits",
  "NUM-QL-005": "Add the valid digits",
  "NUM-QL-006": "Complete set of valid digits",
  "NUM-QL-007": "Largest or smallest completed number",
  "NUM-QL-008": "Find the ordered digit pair",
  "NUM-QL-009": "Count the ordered digit pairs",
  "NUM-QL-010": "Complete set of ordered digit pairs",
  "NUM-QL-011": "Number of ordered-pair solutions",
  "NUM-QL-012": "Smallest or greatest n-digit multiple",
  "NUM-QL-013": "Count multiples in a range",
  "NUM-QL-014": "Divisibility of a repeated number",
  "NUM-QL-015": "Addition with a divisibility condition",
  "NUM-QL-016": "Missing-digit data sufficiency",
  "NUM-QL-017": "Check divisibility statements",
  "NUM-QL-018": "Prime, composite, unit or neither",
  "NUM-QL-019": "Prime numbers in a range",
  "NUM-QL-020": "Count prime numbers in a range",
  "NUM-QL-021": "Next, previous or smallest prime",
  "NUM-QL-022": "Prime number from range and digit sum",
  "NUM-QL-023": "Check prime-number statements",
  "NUM-QL-024": "Prime factorisation",
  "NUM-QL-025": "Smallest or largest prime factor",
  "NUM-QL-026": "Count distinct prime factors",
  "NUM-QL-027": "Count prime factors with repetition",
  "NUM-QL-028": "Find the number from its prime factors",
  "NUM-QL-029": "Compare two prime-factor forms",
  "NUM-QL-030": "Find the missing prime",
  "NUM-QL-031": "Find the missing exponent",
  "NUM-QL-032": "Choose the co-prime pair",
  "NUM-QL-033": "Complete set of co-prime numbers",
  "NUM-QL-034": "Count co-prime numbers",
  "NUM-QL-035": "Find the co-prime value",
  "NUM-QL-036": "Pairwise and collective co-primality",
  "NUM-QL-037": "Check co-prime statements",
  "NUM-QL-038": "Find two consecutive primes",
  "NUM-QL-039": "Find three consecutive primes",
  "NUM-QL-040": "Least prime divisor",
  "NUM-QL-041": "Prime divisor of an expression",
  "NUM-QL-042": "Possible prime-number statement",
  "NUM-QL-043": "Complete a factor tree",
  "NUM-QL-044": "Prime-number data sufficiency",
  "NUM-QL-045": "Smallest change that makes a prime",
});

export const COMPOSITE_RULE_PARTS = Object.freeze({
  6: [2, 3],
  12: [3, 4],
  15: [3, 5],
  18: [2, 9],
  24: [3, 8],
  36: [4, 9],
  45: [5, 9],
  72: [8, 9],
  99: [9, 11],
});

export function rawText(value) {
  return String(value ?? "").trim();
}

export function cleanText(value) {
  return formatStandaloneIntegersForEnglishIndia(
    normaliseNumberSystemReviewMath(rawText(value)),
  )
    .replace(/Compute or infer/gi, "Find")
    .replace(/Exact testing leaves/gi, "Solving the rule gives")
    .replace(/admissible domain/gi, "possible digits")
    .replace(/admissible/gi, "possible")
    .replace(/candidate set/gi, "possible values")
    .replace(/cardinality/gi, "number of values")
    .replace(/target projection/gi, "required answer")
    .replace(/remainder status/gi, "remainder")
    .replace(/governing condition/gi, "math rule")
    .replace(/resulting class/gi, "answer")
    .replace(/metric/gi, "value")
    .replace(/minimum signed integer adjustment/gi, "smallest positive or negative change")
    .replace(/divisor polarity selection/gi, "divisibility check")
    .replace(/prime-number terminology/gi, "prime-number rule")
    .replace(/\bstatus\b/gi, "result")
    .replace(/\benumerate\b/gi, "check")
    .replace(/\benumeration\b/gi, "checking")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function formatNumber(value) {
  return formatStandaloneIntegersForEnglishIndia(String(value));
}

export function mathNumber(value) {
  return `$${formatNumber(value)}$`;
}

export function mathValue(value) {
  let source = cleanText(value)
    .replace(/×/g, "\\times")
    .replace(/÷/g, "\\div");
  if (/^\$[\s\S]*\$$/u.test(source)) return source;
  if (source.startsWith("{") && source.endsWith("}")) {
    source = `\\{${source.slice(1, -1)}\\}`;
  }
  return `$${source}$`;
}

export function displayEquation(source) {
  return `$$${String(source).replace(/×/g, "\\times").replace(/÷/g, "\\div")}$$`;
}

export function titleCaseClass(value) {
  const text = rawText(value);
  const classes = {
    PRIME: "Prime",
    COMPOSITE: "Composite",
    UNIT: "Unit",
    NEITHER: "Neither prime nor composite",
    EQUAL: "Equal",
    CANNOT_BE_DETERMINED: "Cannot be determined",
  };
  return classes[text] ?? text;
}

export function studentOptionDisplay(value) {
  const text = titleCaseClass(value);
  if (/^[+-]?\d[\d,]*$/u.test(text)) return mathNumber(text.replaceAll(",", ""));
  if (/^[{(].*[})]$/u.test(text) || /[=^×÷]/u.test(text)) return mathValue(text);
  return cleanText(text);
}

export function optionValues(row) {
  return row.checkpoint === "NUM-CP-003"
    ? row.question.options.map(String)
    : row.question.options.map((option) => String(option.value));
}

export function correctIndex(row) {
  return Number(row.question.correctIndex);
}

export function correctAnswerDisplay(row) {
  const index = correctIndex(row);
  return {
    label: String.fromCharCode(65 + index),
    value: studentOptionDisplay(optionValues(row)[index]),
  };
}

export function gcd(a, b) {
  let x = Math.abs(Number(a));
  let y = Math.abs(Number(b));
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

export function isPrime(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let divisor = 3; divisor * divisor <= n; divisor += 2) {
    if (n % divisor === 0) return false;
  }
  return true;
}

export function primeFactors(value) {
  let n = Math.abs(Number(value));
  const factors = [];
  for (let prime = 2; prime * prime <= n; prime += prime === 2 ? 1 : 2) {
    if (n % prime !== 0) continue;
    let exponent = 0;
    while (n % prime === 0) {
      n /= prime;
      exponent += 1;
    }
    factors.push({ prime, exponent });
  }
  if (n > 1) factors.push({ prime: n, exponent: 1 });
  return factors;
}

export function factorisationMath(factors) {
  return factors.map(({ prime, exponent }) =>
    exponent === 1 ? String(prime) : `${prime}^{${exponent}}`).join(" \\times ");
}

export function factorisationPlain(factors) {
  return factors.map(({ prime, exponent }) =>
    exponent === 1 ? String(prime) : `${prime}^${exponent}`).join(" × ");
}

export function productFromFactors(factors) {
  return factors.reduce((product, factor) =>
    product * (factor.prime ** factor.exponent), 1);
}

export function digitSum(value) {
  return [...String(value).replace(/\D/g, "")].reduce((sum, digit) => sum + Number(digit), 0);
}

export function alternatingSums(value) {
  const digits = [...String(value).replace(/\D/g, "")].map(Number);
  const first = digits.filter((_digit, index) => index % 2 === 0).reduce((a, b) => a + b, 0);
  const second = digits.filter((_digit, index) => index % 2 === 1).reduce((a, b) => a + b, 0);
  return { first, second, difference: Math.abs(first - second) };
}

export function fillTemplate(template, assignment) {
  return String(template)
    .replaceAll("X", String(assignment.x))
    .replaceAll("Y", String(assignment.y ?? 0));
}

export function setText(values) {
  return `{${values.join(", ")}}`;
}

export function pairText(pair) {
  return `(${pair[0]}, ${pair[1]})`;
}

export function pairSetText(pairs) {
  return `{${pairs.map(pairText).join(", ")}}`;
}

export function assignmentLabel(assignment) {
  return assignment.y === undefined
    ? `$X = ${assignment.x}$`
    : `$(X, Y) = (${assignment.x}, ${assignment.y})$`;
}

export function primitiveDivisors(divisors) {
  const result = [];
  for (const raw of divisors) {
    const divisor = Number(raw);
    const parts = COMPOSITE_RULE_PARTS[divisor] ?? [divisor];
    for (const part of parts) if (!result.includes(part)) result.push(part);
  }
  return result;
}

export function ruleSentence(divisor) {
  const parts = COMPOSITE_RULE_PARTS[Number(divisor)];
  if (parts) {
    return `To check divisibility by ${mathNumber(divisor)}, check the rules for ${mathNumber(parts[0])} and ${mathNumber(parts[1])}.`;
  }
  const rules = {
    2: "the last digit must be even",
    3: "the sum of the digits must be a multiple of 3",
    4: "the last two digits must form a multiple of 4",
    5: "the last digit must be 0 or 5",
    8: "the last three digits must form a multiple of 8",
    9: "the sum of the digits must be a multiple of 9",
    10: "the last digit must be 0",
    11: "the difference between the two alternating digit sums must be 0 or a multiple of 11",
    25: "the last two digits must be 00, 25, 50 or 75",
  };
  return `For divisibility by ${mathNumber(divisor)}, ${rules[Number(divisor)] ?? "the division must leave remainder 0"}.`;
}

export function divisibilityEvidence(numberValue, divisorValue) {
  const numberText = String(numberValue).replace(/\D/g, "");
  const n = BigInt(numberText || "0");
  const d = BigInt(divisorValue);
  const divisor = Number(divisorValue);
  const remainder = n % d;
  const quotient = n / d;
  if (divisor === 2 || divisor === 5 || divisor === 10) {
    const last = Number(numberText.at(-1));
    const condition = divisor === 2 ? last % 2 === 0 : divisor === 5 ? [0, 5].includes(last) : last === 0;
    return {
      divides: condition,
      remainder,
      text: `The last digit is ${mathNumber(last)}. ${condition ? "It satisfies" : "It does not satisfy"} the rule for ${mathNumber(divisor)}.`,
    };
  }
  if (divisor === 3 || divisor === 9) {
    const sum = digitSum(numberText);
    return {
      divides: sum % divisor === 0,
      remainder,
      text: `The digit sum is ${displayEquation([...numberText].join(" + ") + ` = ${sum}`)} ${mathNumber(sum)} ${sum % divisor === 0 ? "is" : "is not"} a multiple of ${mathNumber(divisor)}.`,
    };
  }
  if (divisor === 4 || divisor === 25) {
    const suffix = Number(numberText.slice(-2));
    return {
      divides: suffix % divisor === 0,
      remainder,
      text: `The last two digits form ${mathNumber(suffix)}. ${displayEquation(`${suffix} \\div ${divisor} = ${Math.floor(suffix / divisor)}${suffix % divisor ? `\\text{ remainder }${suffix % divisor}` : ""}`)} `,
    };
  }
  if (divisor === 8) {
    const suffix = Number(numberText.slice(-3));
    return {
      divides: suffix % 8 === 0,
      remainder,
      text: `The last three digits form ${mathNumber(suffix)}. ${displayEquation(`${suffix} \\div 8 = ${Math.floor(suffix / 8)}${suffix % 8 ? `\\text{ remainder }${suffix % 8}` : ""}`)}`,
    };
  }
  if (divisor === 11) {
    const sums = alternatingSums(numberText);
    return {
      divides: sums.difference % 11 === 0,
      remainder,
      text: `The alternating sums are ${mathNumber(sums.first)} and ${mathNumber(sums.second)}. Their difference is ${mathNumber(sums.difference)}, ${sums.difference % 11 === 0 ? "so the rule for 11 is satisfied" : "so the rule for 11 fails"}.`,
    };
  }
  const parts = COMPOSITE_RULE_PARTS[divisor];
  if (parts) {
    const evidence = parts.map((part) => divisibilityEvidence(numberText, part));
    return {
      divides: evidence.every((item) => item.divides),
      remainder,
      text: `Check ${mathNumber(parts[0])} and ${mathNumber(parts[1])}: ${evidence.map((item) => item.text).join(" ")}`,
    };
  }
  return {
    divides: remainder === 0n,
    remainder,
    text: remainder === 0n
      ? `${displayEquation(`${formatNumber(n)} \\div ${divisor} = ${formatNumber(quotient)}`)} The remainder is ${mathNumber(0)}.`
      : `${displayEquation(`${formatNumber(n)} = ${divisor} \\times ${formatNumber(quotient)} + ${remainder}`)} The remainder is ${mathNumber(remainder)}.`,
  };
}

export function templateDigitSum(template) {
  let fixed = 0;
  let xCount = 0;
  let yCount = 0;
  const terms = [];
  for (const character of String(template)) {
    if (character === "X") {
      xCount += 1;
      terms.push("X");
    } else if (character === "Y") {
      yCount += 1;
      terms.push("Y");
    } else {
      fixed += Number(character);
      terms.push(character);
    }
  }
  const symbolic = [
    fixed || null,
    xCount === 1 ? "X" : xCount > 1 ? `${xCount}X` : null,
    yCount === 1 ? "Y" : yCount > 1 ? `${yCount}Y` : null,
  ].filter(Boolean).join(" + ") || "0";
  return { expanded: terms.join(" + "), fixed, xCount, yCount, symbolic };
}

export function templateRuleSteps(template, divisor, assignments) {
  if (divisor === 3 || divisor === 9) {
    const details = templateDigitSum(template);
    return [
      `**Use the digit-sum rule for ${mathNumber(divisor)}.** ${displayEquation(`${details.expanded} = ${details.symbolic}`)}`,
      ...assignments.map((assignment) => {
        const total = details.fixed + details.xCount * assignment.x + details.yCount * (assignment.y ?? 0);
        return `${assignmentLabel(assignment)} gives ${displayEquation(`${total} = ${divisor} \\times ${total / divisor}`)} so the digit sum is a multiple of ${mathNumber(divisor)}.`;
      }),
    ];
  }
  if (divisor === 2 || divisor === 5 || divisor === 10) {
    const last = String(template).at(-1);
    if (!/[XY]/.test(last)) {
      return [`**Use the last-digit rule for ${mathNumber(divisor)}.** The last digit is ${mathNumber(last)}, so this condition is already satisfied.`];
    }
    return [
      `**Use the last-digit rule for ${mathNumber(divisor)}.**`,
      ...assignments.map((assignment) => {
        const lastDigit = fillTemplate(last, assignment);
        return `${assignmentLabel(assignment)} gives last digit ${mathNumber(lastDigit)}, so the rule is satisfied.`;
      }),
    ];
  }
  if ([4, 25, 8].includes(divisor)) {
    const length = divisor === 8 ? 3 : 2;
    const suffixTemplate = String(template).slice(-length);
    if (!/[XY]/.test(suffixTemplate)) {
      const suffix = Number(suffixTemplate);
      return [`**Use the last-${length === 2 ? "two" : "three"}-digit rule for ${mathNumber(divisor)}.** ${displayEquation(`${suffixTemplate} = ${suffix},\\quad ${suffix} \\div ${divisor} = ${suffix / divisor}`)} This condition is satisfied for every possible missing digit.`];
    }
    return [
      `**Use the last-${length === 2 ? "two" : "three"}-digit rule for ${mathNumber(divisor)}.**`,
      ...assignments.map((assignment) => {
        const suffix = Number(fillTemplate(suffixTemplate, assignment));
        return `${assignmentLabel(assignment)} gives ${mathNumber(suffix)}. ${displayEquation(`${suffix} \\div ${divisor} = ${suffix / divisor}`)} The division is exact.`;
      }),
    ];
  }
  if (divisor === 11) {
    return [
      `**Use the rule for ${mathNumber(11)}.** Compare the two alternating digit sums.`,
      ...assignments.map((assignment) => {
        const completed = fillTemplate(template, assignment);
        const sums = alternatingSums(completed);
        return `${assignmentLabel(assignment)} gives ${displayEquation(`|${sums.first} - ${sums.second}| = ${sums.difference}`)} The difference is ${mathNumber(sums.difference)}, a multiple of ${mathNumber(11)}.`;
      }),
    ];
  }
  return [
    `**Check divisibility by ${mathNumber(divisor)}.**`,
    ...assignments.map((assignment) => {
      const completed = BigInt(fillTemplate(template, assignment));
      return `${assignmentLabel(assignment)} forms ${mathNumber(completed)}. ${displayEquation(`${formatNumber(completed)} \\div ${divisor} = ${formatNumber(completed / BigInt(divisor))}`)} The division is exact.`;
    }),
  ];
}

export function simpleDiagnostic(text) {
  return cleanText(text)
    .replace(/does not equal the exact/gi, "does not match the")
    .replace(/This option /gi, "This ")
    .replace(/at least one divisibility constraint/gi, "one or more divisibility rules")
    .replace(/the requested extremum/gi, "the required largest or smallest value")
    .replace(/fails the requested boundary condition/gi, "is not the required boundary multiple")
    .replace(/candidate-set sizes/gi, "numbers of possible values")
    .replace(/this does not match/gi, "so this is not")
    .replace(/therefore the displayed assertion is false/gi, "so the statement is false");
}

export function parseNumericOption(value) {
  const cleaned = String(value).replaceAll(",", "");
  return /^-?\d+$/u.test(cleaned) ? Number(cleaned) : null;
}

export function parseAdjustmentSet(value) {
  return [...String(value).matchAll(/[+-]?\d+/g)].map((match) => Number(match[0]));
}

export function parseIntegerList(value) {
  return [...String(value).matchAll(/-?\d+/g)].map((match) => Number(match[0]));
}

export function smallestNonTrivialDivisor(value) {
  const n = Math.abs(Number(value));
  if (!Number.isInteger(n) || n < 2) return null;
  if (n % 2 === 0) return n === 2 ? null : 2;
  for (let divisor = 3; divisor * divisor <= n; divisor += 2) {
    if (n % divisor === 0) return divisor;
  }
  return null;
}

export function listDifference(left, right) {
  return left.filter((value) => !right.includes(value));
}
