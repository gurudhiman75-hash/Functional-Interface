import { div, rat, sub, type Rational } from "./cp003-exam-model";
import { maturityAmount, schemeFactor, type IntCp007Scheme } from "./cp007-scheme-equivalence-runtime-v1";
import {
  INT_CP007_ENGLISH_VERSION as INT_CP007_ENGLISH_VERSION_V4,
  generateIntCp007EnglishQuestion as generateV4,
  type IntCp007EnglishQuestion as IntCp007EnglishQuestionV4,
} from "./cp007-scheme-equivalence-english-v4";
import { solveIntCp007, type IntCp007QlId } from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_ENGLISH_VERSION = "INT-CP-007-EN-v5-latex-review" as const;
export const INT_CP007_ENGLISH_V5_SUPERSEDES = INT_CP007_ENGLISH_VERSION_V4;

export type IntCp007EnglishQuestion = Omit<IntCp007EnglishQuestionV4, "englishVersion"> & {
  readonly englishVersion: typeof INT_CP007_ENGLISH_VERSION;
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  }
  return Object.freeze(value);
}

function gcd(a: bigint, b: bigint): bigint {
  let left = a < 0n ? -a : a;
  let right = b < 0n ? -b : b;
  while (right !== 0n) [left, right] = [right, left % right];
  return left;
}

function formatRational(value: Rational, maximumDecimals = 6): string {
  const sign = value.numerator < 0n ? "-" : "";
  const numerator = value.numerator < 0n ? -value.numerator : value.numerator;
  const denominator = value.denominator;
  const whole = numerator / denominator;
  let remainder = numerator % denominator;
  if (remainder === 0n) return `${sign}${whole}`;
  let decimals = "";
  for (let index = 0; index < maximumDecimals && remainder !== 0n; index += 1) {
    remainder *= 10n;
    decimals += (remainder / denominator).toString();
    remainder %= denominator;
  }
  if (remainder === 0n) return `${sign}${whole}.${decimals}`;
  const divisor = gcd(numerator, denominator);
  return `${sign}\\frac{${numerator / divisor}}{${denominator / divisor}}`;
}

function formatFactor(value: Rational, maximumDecimals = 6): string {
  const sign = value.numerator < 0n ? "-" : "";
  const numerator = value.numerator < 0n ? -value.numerator : value.numerator;
  const denominator = value.denominator;
  const whole = numerator / denominator;
  let remainder = numerator % denominator;
  if (remainder === 0n) return `${sign}${whole}`;
  let decimals = "";
  for (let index = 0; index < maximumDecimals && remainder !== 0n; index += 1) {
    remainder *= 10n;
    decimals += (remainder / denominator).toString();
    remainder %= denominator;
  }
  if (remainder === 0n) return `${sign}${whole}.${decimals}`;

  const scale = 10n ** BigInt(maximumDecimals);
  const rounded = (numerator * scale * 2n + denominator) / (2n * denominator);
  const roundedWhole = rounded / scale;
  const roundedFraction = (rounded % scale).toString().padStart(maximumDecimals, "0").replace(/0+$/u, "");
  return `${sign}\\approx ${roundedWhole}${roundedFraction ? `.${roundedFraction}` : ""}`;
}

function formatMoneyPlain(value: Rational): string {
  const paiseNumerator = value.numerator * 100n;
  if (paiseNumerator % value.denominator !== 0n) {
    throw new Error(`CP007 V5 money must resolve to paise: ${value.numerator}/${value.denominator}`);
  }
  const paise = paiseNumerator / value.denominator;
  const rupees = paise / 100n;
  const remainder = paise % 100n;
  const source = rupees.toString();
  const tail = source.length <= 3 ? source : source.slice(-3);
  let head = source.length <= 3 ? "" : source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) {
    groups.unshift(head.slice(-2));
    head = head.slice(0, -2);
  }
  if (head) groups.unshift(head);
  const integer = groups.length ? `${groups.join(",")},${tail}` : tail;
  return remainder === 0n ? `₹${integer}` : `₹${integer}.${remainder.toString().padStart(2, "0")}`;
}

function moneyLatex(value: Rational): string {
  return formatMoneyPlain(value).slice(1).replace(/,/gu, "{,}");
}

const math = (latex: string): string => `$${latex}$`;
const percentMath = (value: Rational): string => math(`${formatRational(value)}\\%`);

function ratioText(value: Rational): string {
  const divisor = gcd(value.numerator, value.denominator);
  return `${value.numerator / divisor}:${value.denominator / divisor}`;
}

function factorBody(scheme: IntCp007Scheme, years = scheme.years): string {
  const effectiveScheme = { ...scheme, years };
  const factor = schemeFactor(effectiveScheme);
  const rate = formatRational(scheme.annualRatePercent);
  if (scheme.method === "SIMPLE") {
    return `1+\\frac{${years}\\times ${rate}}{100}=${formatFactor(factor)}`;
  }
  return `\\left(1+\\frac{${rate}}{100}\\right)^{${years}}=${formatFactor(factor)}`;
}

function amountBody(principal: Rational, factor: Rational, amount: Rational): string {
  return `${moneyLatex(principal)}\\times ${formatFactor(factor)}=${moneyLatex(amount)}`;
}

function buildExplanation(source: IntCp007EnglishQuestionV4): IntCp007EnglishQuestionV4["explanation"] {
  const state = source.mathematicalState;
  const contract: any = state.contractState;
  const answer = solveIntCp007(state);

  switch (state.qlId) {
    case "INT-QL-109": {
      const factorA = schemeFactor(contract.schemeA);
      const factorB = schemeFactor(contract.schemeB);
      const amountA = maturityAmount(contract.principal, contract.schemeA);
      const amountB = maturityAmount(contract.principal, contract.schemeB);
      return deepFreeze({
        keyIdea: "Both plans start with the same principal. Calculate each complete accumulation factor, use it to find each maturity amount, and then compare the two final amounts.",
        steps: Object.freeze([
          `The same starting principal is ${formatMoneyPlain(contract.principal)}, and the question asks which scheme gives the larger maturity amount.`,
          `Scheme A accumulation factor: ${math(factorBody(contract.schemeA))}.`,
          `Using rupees, Scheme A maturity amount is ${math(amountBody(contract.principal, factorA, amountA))}.`,
          `Scheme B accumulation factor: ${math(factorBody(contract.schemeB))}.`,
          `Using rupees, Scheme B maturity amount is ${math(amountBody(contract.principal, factorB, amountB))}. Therefore ${source.correctAnswer} gives the higher maturity amount.`,
        ]),
        finalAnswer: source.correctAnswer,
        commonMistake: "Do not compare only the stated annual rates. Simple and compound schemes can produce different maturity amounts even when their rates look similar.",
      });
    }

    case "INT-QL-110": {
      const factorA = schemeFactor(contract.schemeA);
      const factorB = schemeFactor(contract.schemeB);
      const amountA = maturityAmount(contract.principal, contract.schemeA);
      const amountB = maturityAmount(contract.principal, contract.schemeB);
      return deepFreeze({
        keyIdea: "Find the maturity amount under each complete scheme at the stated comparison date. The required answer is the positive difference between those two final amounts.",
        steps: Object.freeze([
          `The same principal ${formatMoneyPlain(contract.principal)} is used in both schemes, and the question asks for the difference between their maturity amounts.`,
          `Scheme A factor is ${math(factorBody(contract.schemeA))}, so its maturity amount is ${math(amountBody(contract.principal, factorA, amountA))}.`,
          `Scheme B factor is ${math(factorBody(contract.schemeB))}, so its maturity amount is ${math(amountBody(contract.principal, factorB, amountB))}.`,
          `Take the absolute difference of the two maturity amounts: ${math(`\\left|${moneyLatex(amountA)}-${moneyLatex(amountB)}\\right|=${moneyLatex(answer)}`)}.`,
          `Hence the maturity amounts differ by ${source.correctAnswer}.`,
        ]),
        finalAnswer: source.correctAnswer,
        commonMistake: "Do not subtract the annual rates and apply that rate difference to the principal. First calculate each full maturity amount, then subtract.",
      });
    }

    case "INT-QL-111": {
      const targetFactor = schemeFactor(contract.knownScheme);
      const targetExcess = sub(targetFactor, rat(1n));
      const missingFactor = schemeFactor({
        method: contract.missingMethod,
        annualRatePercent: answer,
        years: contract.missingYears,
      });
      const steps: string[] = [
        "The required annual rate must make the second scheme produce exactly the same maturity factor as the known scheme for the same principal.",
        `Known-scheme accumulation factor: ${math(factorBody(contract.knownScheme))}. Therefore the target factor for the second scheme is ${math(formatFactor(targetFactor))}.`,
      ];

      if (contract.missingMethod === "SIMPLE") {
        if (contract.missingYears === 1) {
          steps.push(`For one year of simple interest, ${math(`1+\\frac{r}{100}=${formatFactor(targetFactor)}`)}.`);
          steps.push(`Subtracting 1 gives ${math(`\\frac{r}{100}=${formatRational(targetExcess)}`)}.`);
          steps.push(`Multiplying by 100 gives ${math(`r=${formatRational(targetExcess)}\\times100=${formatRational(answer)}\\%`)}. Therefore the required annual rate is ${source.correctAnswer}.`);
        } else {
          const perYearExcess = div(targetExcess, rat(BigInt(contract.missingYears)));
          steps.push(`For ${contract.missingYears} years of simple interest, ${math(`1+\\frac{${contract.missingYears}r}{100}=${formatFactor(targetFactor)}`)}.`);
          steps.push(`Hence ${math(`\\frac{${contract.missingYears}r}{100}=${formatRational(targetExcess)}`)}, so ${math(`\\frac{r}{100}=${formatRational(perYearExcess)}`)}.`);
          steps.push(`Therefore ${math(`r=${formatRational(perYearExcess)}\\times100=${formatRational(answer)}\\%`)}. The required annual rate is ${source.correctAnswer}.`);
        }
      } else if (contract.missingYears === 1) {
        steps.push(`For one year of compound interest, ${math(`1+\\frac{r}{100}=${formatFactor(targetFactor)}`)}.`);
        steps.push(`Subtracting 1 gives ${math(`\\frac{r}{100}=${formatRational(targetExcess)}`)}.`);
        steps.push(`Thus ${math(`r=${formatRational(targetExcess)}\\times100=${formatRational(answer)}\\%`)}. Therefore the required annual rate is ${source.correctAnswer}.`);
      } else {
        const annualFactor = schemeFactor({
          method: "COMPOUND",
          annualRatePercent: answer,
          years: 1,
        });
        steps.push(`For ${contract.missingYears} years of annual compounding, ${math(`\\left(1+\\frac{r}{100}\\right)^{${contract.missingYears}}=${formatFactor(targetFactor)}`)}.`);
        steps.push(`Recognise the target factor as ${math(`${formatFactor(targetFactor)}=${formatFactor(annualFactor)}^{${contract.missingYears}}`)}, so ${math(`1+\\frac{r}{100}=${formatFactor(annualFactor)}`)}.`);
        steps.push(`Therefore ${math(`r=\\left(${formatFactor(annualFactor)}-1\\right)\\times100=${formatRational(answer)}\\%`)}. The required annual rate is ${source.correctAnswer}.`);
      }

      steps.push(`Check: with ${percentMath(answer)}, the second scheme has factor ${math(formatFactor(missingFactor))}, exactly matching the target factor ${math(formatFactor(targetFactor))}.`);

      return deepFreeze({
        keyIdea: "Equal principal and equal maturity amount mean the two schemes must have the same accumulation factor. Calculate the known factor, write the second scheme's factor equation, and solve explicitly for the missing rate.",
        steps: Object.freeze(steps),
        finalAnswer: source.correctAnswer,
        commonMistake: "Do not copy the known annual rate automatically. When the method or duration changes, equality of maturity values must be established through the complete accumulation factors.",
      });
    }

    case "INT-QL-112": {
      const factorA = schemeFactor(contract.schemeA);
      const factorB = schemeFactor(contract.schemeB);
      const x = answer;
      const other = sub(contract.totalPrincipal, x);
      const future = maturityAmount(x, contract.schemeA);
      return deepFreeze({
        keyIdea: "Represent Scheme A's present share by a variable and the other share by the remaining part of the total. Grow both shares to maturity, equate their future values, and solve the resulting equation.",
        steps: Object.freeze([
          `The total present sum is ${formatMoneyPlain(contract.totalPrincipal)}. Let Scheme A receive ${math("x")}; then Scheme B receives the remaining amount.`,
          `Scheme A factor is ${math(factorBody(contract.schemeA))}. Scheme B factor is ${math(factorBody(contract.schemeB))}.`,
          `Equal future values require ${math(`x\\times${formatFactor(factorA)}=\\left(${moneyLatex(contract.totalPrincipal)}-x\\right)\\times${formatFactor(factorB)}`)}.`,
          `Solving, ${math(`x=\\frac{${moneyLatex(contract.totalPrincipal)}\\times${formatFactor(factorB)}}{${formatFactor(factorA)}+${formatFactor(factorB)}}=${moneyLatex(x)}`)}. So the other present share is ${formatMoneyPlain(other)}.`,
          `Check: both parts mature to ${formatMoneyPlain(future)}. Therefore Scheme A's present share is ${source.correctAnswer}.`,
        ]),
        finalAnswer: source.correctAnswer,
        commonMistake: "Do not split the present total equally unless the two schemes have equal accumulation factors. Different growth factors generally require different present shares.",
      });
    }

    case "INT-QL-113": {
      const factorA = schemeFactor(contract.schemeA);
      const factorB = schemeFactor(contract.schemeB);
      return deepFreeze({
        keyIdea: "Equal future values require each present principal multiplied by its complete accumulation factor to give the same result. Therefore the present principals must be in the inverse ratio of the two factors.",
        steps: Object.freeze([
          "Let the two present principals be represented by separate variables. Their maturity amounts must be equal.",
          `Scheme A factor is ${math(factorBody(contract.schemeA))}. Scheme B factor is ${math(factorBody(contract.schemeB))}.`,
          `Equal maturity gives ${math(`P_A\\times${formatFactor(factorA)}=P_B\\times${formatFactor(factorB)}`)}.`,
          `Therefore ${math(`\\frac{P_A}{P_B}=\\frac{${formatFactor(factorB)}}{${formatFactor(factorA)}}=\\frac{${answer.numerator}}{${answer.denominator}}`)}.`,
          `Hence Principal A : Principal B is ${source.correctAnswer}. This is the inverse ratio of the complete accumulation factors.`,
        ]),
        finalAnswer: source.correctAnswer,
        commonMistake: "Do not use the annual-rate ratio itself. The required principal ratio comes from the complete maturity factors, and it must be taken in the inverse order.",
      });
    }

    case "INT-QL-114": {
      const year = Number(answer.numerator);
      const previousYear = year - 1;
      const aPrev = schemeFactor({ ...contract.initiallyHigherScheme, years: previousYear });
      const bPrev = schemeFactor({ ...contract.overtakingScheme, years: previousYear });
      const aNow = schemeFactor({ ...contract.initiallyHigherScheme, years: year });
      const bNow = schemeFactor({ ...contract.overtakingScheme, years: year });
      return deepFreeze({
        keyIdea: "A first-overtake answer needs two consecutive checks: Scheme B must not be ahead at the previous whole year, and it must be ahead at the selected whole year.",
        steps: Object.freeze([
          "Both schemes start with the same principal, so comparing their accumulation factors is enough; the common principal does not affect which scheme is larger.",
          `After ${previousYear} complete years, Scheme A has ${math(factorBody(contract.initiallyHigherScheme, previousYear))} and Scheme B has ${math(factorBody(contract.overtakingScheme, previousYear))}. Thus B is still not ahead.`,
          `After ${year} complete years, Scheme A has ${math(factorBody(contract.initiallyHigherScheme, year))} and Scheme B has ${math(factorBody(contract.overtakingScheme, year))}.`,
          `The comparison changes from ${math(`${formatFactor(bPrev)}\\le ${formatFactor(aPrev)}`)} at the previous year to ${math(`${formatFactor(bNow)}>${formatFactor(aNow)}`)} at year ${math(String(year))}.`,
          `Therefore the first complete year when Scheme B overtakes Scheme A is ${source.correctAnswer}.`,
        ]),
        finalAnswer: source.correctAnswer,
        commonMistake: "Do not choose a later year merely because Scheme B is also larger there. The first crossing must be proved by checking the immediately preceding whole year as well.",
      });
    }

    case "INT-QL-115": {
      const knownFactor = schemeFactor(contract.knownScheme);
      const knownFuture = maturityAmount(contract.knownPrincipal, contract.knownScheme);
      const missingFactor = schemeFactor(contract.missingScheme);
      return deepFreeze({
        keyIdea: "First calculate the maturity value produced by the known present principal. Then divide that target future value by the second scheme's accumulation factor to recover the required present principal.",
        steps: Object.freeze([
          `The known present principal is ${formatMoneyPlain(contract.knownPrincipal)}, and both schemes must finish with the same maturity amount.`,
          `Known-scheme factor: ${math(factorBody(contract.knownScheme))}. Its maturity amount, in rupees, is ${math(amountBody(contract.knownPrincipal, knownFactor, knownFuture))}.`,
          `The required-principal scheme has factor ${math(factorBody(contract.missingScheme))}.`,
          `If its present principal is ${math("P")}, then ${math(`P\\times${formatFactor(missingFactor)}=${moneyLatex(knownFuture)}`)}, so ${math(`P=\\frac{${moneyLatex(knownFuture)}}{${formatFactor(missingFactor)}}=${moneyLatex(answer)}`)}.`,
          `Checking forward gives the same maturity amount ${formatMoneyPlain(knownFuture)}. Therefore the required present principal is ${source.correctAnswer}.`,
        ]),
        finalAnswer: source.correctAnswer,
        commonMistake: "Do not assume both schemes need the same present principal. Different accumulation factors require different starting principals to reach one common future value.",
      });
    }
  }
}

export function generateIntCp007EnglishQuestion(
  qlId: IntCp007QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp007EnglishQuestion {
  const source = generateV4(qlId, seed, locale);
  return deepFreeze({
    ...source,
    englishVersion: INT_CP007_ENGLISH_VERSION,
    explanation: buildExplanation(source),
  });
}
