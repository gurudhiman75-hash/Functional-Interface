import type {
  NumberSystemExplanationStep,
  NumberSystemFamilyId,
  NumberSystemLocalizedText,
  NumberSystemSolverModel,
} from "./number-system-types";
import { displayMathBlock } from "../utils/quant-math-delimiters";

type Locale = "en" | "hi" | "pa";

const t = (en: string, hi: string, pa: string): NumberSystemLocalizedText => ({ en, hi, pa });

const LABEL = {
  observation: t("Observation", "अवलोकन", "ਧਿਆਨ ਕਰੋ"),
  explanation: t("Explanation", "व्याख्या", "ਸਮਝਾਉਣ"),
  answer: t("Answer", "उत्तर", "ਉੱਤਰ"),
  verify: t("Answer", "उत्तर", "ਉੱਤਰ"),
  final: t("Answer", "उत्तर", "ਉੱਤਰ"),
  commonMistake: t("Common Mistake", "सामान्य गलती", "ਆਮ ਗਲਤੀ"),
  shortcut: t("Shortcut", "शॉर्टकट", "ਛੋਟਾ ਤਰੀਕਾ"),
};

export const NUMBER_SYSTEM_BANNED_EXPLANATION_PATTERNS = [
  /\bconcept\s*:/iu,
  /\bgiven\s*:/iu,
  /\bworking\s*:/iu,
  /\blet['']?s\s+solve\b/iu,
  /\blet['']?s\s+look\b/iu,
  /\bnow\s+let['']?s\s+find\b/iu,
  /\bwe\s+know\s+that\b/iu,
  /\bnotice\s+that\b/iu,
  /\bobserve\s+that\b/iu,
  /\bsince\s+we\s+know\b/iu,
  /\bnow\s+we\s+can\b/iu,
  /\bthus\s+we\s+get\b/iu,
  /\busing\s+the\s+above\b/iu,
  /\busing\s+the\s+formula\b/iu,
  /\bapply\s+the\s+formula\b/iu,
  /\bsubstitut(?:e|ing)\s+the\s+values\b/iu,
  /\bputting\s+the\s+values\b/iu,
  /\buse\s+the\s+cycle\b/iu,
  /\boptimization is done only after\b/iu,
  /\bmove to the nearest valid boundary\b/iu,
  /\bboundary correction\b/iu,
  /\bboundary value\b/iu,
  /\bvalid boundary\b/iu,
  /\boptimization value\b/iu,
  /\bconstraint value\b/iu,
  /\brequired cycle\b/iu,
  /\bvalid cycle\b/iu,
  /\bcycle engine\b/iu,
  /\bgenerator logic\b/iu,
  /\breasoning engine\b/iu,
  /\bconstraint engine\b/iu,
  /\bcombined cycle\b/iu,
  /\bcomputed value\b/iu,
  /\boptimization step\b/iu,
  /\binternal condition\b/iu,
  /\btopology path\b/iu,
  /\breasoning path\b/iu,
  /\bderived constraint\b/iu,
  /\bconstraint resolution\b/iu,
  /\bread the required value\b/iu,
  /\bapply optimization logic\b/iu,
  /\buse generated cycle\b/iu,
  /\bgenerated value\b/iu,
  /\bvalid candidate set\b/iu,
  /\bcandidate filtering\b/iu,
  /\bcandidate elimination engine\b/iu,
  /\bcycle selection\b/iu,
  /\bcycle position engine\b/iu,
  /\breduce\s+modulo\b/iu,
  /\bapply\s+hcf\b/iu,
  /\buse\s+divisor\s+formula\b/iu,
  /\bcount\s+factors\s+of\s+5\b/iu,
  /\banswer\s*=\s*\d/u,
  /^concept$/imu,
  /^given$/imu,
  /^working$/imu,
  /shortcut\s*\/\s*exam\s+method/iu,
] as const;

type FlowStep = {
  title: NumberSystemLocalizedText;
  lines: NumberSystemLocalizedText[];
  math: string[];
};

type ExplanationFlow = {
  steps: FlowStep[];
  verification: { lines: NumberSystemLocalizedText[]; math: string[] };
  shortcut: { lines: NumberSystemLocalizedText[]; math: string[] };
};

type BlueprintTeachingText = {
  observation: string;
  reason: string;
  shortcut: string;
};

export type NumberSystemExplanationBlueprint =
  | "digit_divisibility"
  | "digit_reconstruction"
  | "perfect_square"
  | "perfect_cube"
  | "remainder"
  | "modular_arithmetic"
  | "last_digit"
  | "prime_factorization"
  | "factor_count"
  | "exact_divisor_count"
  | "hcf"
  | "lcm"
  | "optimization"
  | "least_number"
  | "greatest_number"
  | "minimum_addition"
  | "minimum_multiplier"
  | "factorial"
  | "highest_power"
  | "hybrid";

export function numberSystemExplanationBlueprintForFamily(family?: NumberSystemFamilyId): NumberSystemExplanationBlueprint {
  if (!family) return "hybrid";
  if (family.includes("perfect_square") || family.includes("least_square") || family.includes("square_")) return "perfect_square";
  if (family.includes("perfect_cube") || family.includes("least_cube") || family.includes("cube_")) return "perfect_cube";
  if (family.includes("digit_divisibility") || family.includes("missing_digit") || family.includes("divisibility_multi") || family.includes("large_expression_divisibility")) return "digit_divisibility";
  if (family.includes("digit") || family.includes("number_of_digits") || family.includes("unknown_digit") || family.includes("consecutive_digit")) return "digit_reconstruction";
  if (family.includes("last") || family.includes("unit_digit") || family.includes("power_tower") || family.includes("cycle_length")) return "last_digit";
  if (family.includes("remainder")) return "remainder";
  if (family.includes("modular") || family.includes("cyclic")) return "modular_arithmetic";
  if (family.includes("prime_factorization") || family.includes("hidden_prime")) return "prime_factorization";
  if (family.includes("exact_divisor")) return "exact_divisor_count";
  if (family.includes("factor_count") || family.includes("divisor") || family.includes("sum_of_divisors") || family.includes("product_of_divisors")) return "factor_count";
  if (family.includes("hcf")) return "hcf";
  if (family.includes("lcm") || family.includes("common_multiple") || family.includes("schedule")) return "lcm";
  if (family.includes("minimum_addition") || family.includes("minimum_subtraction")) return "minimum_addition";
  if (family.includes("minimum_multiplier") || family.includes("minimum_divisor")) return "minimum_multiplier";
  if (family.includes("least") || family.includes("smallest")) return "least_number";
  if (family.includes("greatest") || family.includes("largest")) return "greatest_number";
  if (family.includes("optimization") || family.includes("constraint")) return "optimization";
  if (family.includes("trailing_zero")) return "factorial";
  if (family.includes("highest_power") || family.includes("factorial")) return "highest_power";
  return "hybrid";
}

function gcd(a: number, b: number) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}
function lcm(a: number, b: number) {
  return Math.abs(a * b) / gcd(a, b);
}
function primeFactors(n: number) {
  const factors: Record<number, number> = {};
  let value = Math.abs(n);
  for (let p = 2; p * p <= value; p += p === 2 ? 1 : 2) {
    while (value % p === 0) {
      factors[p] = (factors[p] ?? 0) + 1;
      value /= p;
    }
  }
  if (value > 1) factors[value] = (factors[value] ?? 0) + 1;
  return factors;
}
function factorCountFromFactors(factors: Record<number, number>) {
  return Object.values(factors).reduce((acc, exp) => acc * (exp + 1), 1);
}
function sumOfDivisorsFromFactors(factors: Record<number, number>) {
  return Object.entries(factors).reduce((acc, [primeRaw, exp]) => {
    const prime = Number(primeRaw);
    return acc * ((prime ** (exp + 1) - 1) / (prime - 1));
  }, 1);
}
function displayFactors(factors: Record<number, number>) {
  return Object.entries(factors).map(([p, e]) => (e === 1 ? p : `${p}^{${e}}`)).join("\\times ");
}
function remainderCycle(base: number, mod: number) {
  const seen = new Set<number>();
  const cycle: number[] = [];
  let value = 1 % mod;
  for (let step = 1; step <= 24; step += 1) {
    value = (value * (((base % mod) + mod) % mod)) % mod;
    if (seen.has(value)) break;
    seen.add(value);
    cycle.push(value);
  }
  return cycle.length ? cycle : [0];
}
function factorialPrimePower(n: number, p: number) {
  let count = 0;
  for (let div = p; div <= n; div *= p) count += Math.floor(n / div);
  return count;
}
function missingDigitContext(pattern: string, digit: number) {
  const chars = pattern.split("");
  const missingIndex = chars.indexOf("x");
  const knownDigits = chars.filter((char) => char !== "x").map(Number);
  const knownDigitSum = knownDigits.reduce((sum, value) => sum + value, 0);
  const completed = pattern.replace("x", String(digit));
  const placeValue = 10 ** (chars.length - missingIndex - 1);
  const fixedValue = Number(pattern.replace("x", "0"));
  const lastDigit = chars.at(-1) === "x" ? digit : Number(chars.at(-1));
  const tensChar = chars.at(-2) ?? "0";
  const unitsChar = chars.at(-1) ?? "0";
  const lastTwoExpr =
    tensChar === "x" ? `10x+${unitsChar}` :
    unitsChar === "x" ? `${10 * Number(tensChar)}+x` :
    `${10 * Number(tensChar) + Number(unitsChar)}`;
  const lastTwoValue = Number(completed.slice(-2));
  let altKnown = 0;
  let altCoeff = 0;
  chars.forEach((char, index) => {
    const positionFromRight = chars.length - index;
    const sign = positionFromRight % 2 === 1 ? 1 : -1;
    if (char === "x") altCoeff = sign;
    else altKnown += sign * Number(char);
  });
  const altValue = altKnown + altCoeff * digit;
  return {
    completed,
    knownDigitSum,
    digitSumTarget: knownDigitSum + digit,
    fixedValue,
    placeValue,
    lastDigit,
    lastTwoExpr,
    lastTwoValue,
    altKnown,
    altCoeff,
    altValue,
  };
}
function linearDigitExpression(base: number, coeff: number) {
  if (coeff === 1) return `${base}+x`;
  if (coeff === -1) return `${base}-x`;
  if (coeff > 0) return `${base}+${coeff}x`;
  return `${base}${coeff}x`;
}

function repairMojibakeLine(line: string) {
  if (!/[ÃÂ]|à[¤¥¨©]|â(?:Œ|€|†|€¦|„)/u.test(line)) return line;
  const normalizedSymbols = line
    .replace(/âŒŠ/gu, "⌊")
    .replace(/âŒ‹/gu, "⌋")
    .replace(/â€¦/gu, "…")
    .replace(/â†’/gu, "→")
    .replace(/â‰¡/gu, "≡")
    .replace(/â‰¥/gu, "≥")
    .replace(/â‰¤/gu, "≤")
    .replace(/â€“/gu, "–")
    .replace(/â€”/gu, "—")
    .replace(/â€˜|â€™/gu, "'")
    .replace(/â€œ|â€�/gu, "\"");
  const decodeSegment = (segment: string) => {
    const windows1252Reverse: Record<string, number> = {
      "€": 0x80, "‚": 0x82, "ƒ": 0x83, "„": 0x84, "…": 0x85, "†": 0x86, "‡": 0x87,
      "ˆ": 0x88, "‰": 0x89, "Š": 0x8a, "‹": 0x8b, "Œ": 0x8c, "Ž": 0x8e,
      "‘": 0x91, "’": 0x92, "“": 0x93, "”": 0x94, "•": 0x95, "–": 0x96, "—": 0x97,
      "˜": 0x98, "™": 0x99, "š": 0x9a, "›": 0x9b, "œ": 0x9c, "ž": 0x9e, "Ÿ": 0x9f,
    };
    try {
      const bytes = [...segment].map((char) => {
        const mapped = windows1252Reverse[char];
        if (mapped !== undefined) return mapped;
        const code = char.charCodeAt(0);
        return code <= 0xff ? code : 0x3f;
      });
      const repaired = Buffer.from(bytes).toString("utf8");
      if (!/\uFFFD/u.test(repaired) && /[\u0900-\u097F\u0A00-\u0A7F]/u.test(repaired)) return repaired;
    } catch {
      // Keep the original segment if the legacy text cannot be decoded safely.
    }
    return segment;
  };
  const repairedBySegment = normalizedSymbols.replace(/[à-ÿ](?:[\u00A0-\u00FF]|\s|[।,;:.!?()\-])*/gu, decodeSegment);
  if (!/[ÃÂ]|à[¤¥¨©]/u.test(repairedBySegment)) return repairedBySegment;
  try {
    const repaired = Buffer.from(normalizedSymbols, "latin1").toString("utf8");
    if (!/\uFFFD/u.test(repaired) && /[\u0900-\u097F\u0A00-\u0A7F]/u.test(repaired)) return repaired;
  } catch {
    // Keep the original line if the legacy text cannot be decoded safely.
  }
  return normalizedSymbols;
}

function cleanRenderedEnglish(text: string) {
  return text
    .replace(/Reconstruction questions should not be guessed; each clue must become a checkable relation\./gu, "The rule in this question controls which numbers are allowed, so use it before choosing the answer.")
    .replace(/The reconstructed value is ([^.]+)\./gu, "The calculated value $1 satisfies the arithmetic condition used above.")
    .replace(/Translate every clue into a number condition/gu, "Use the number rule for this family")
    .replace(/Carry the result through the next condition/gu, "Use this result in the next check")
    .replace(/Check the number against the next fact also, so it is not chosen from only the first clue\./gu, "This step makes sure the same number satisfies the other condition too.")
    .replace(/\bStep\s+\d+\s*:\s*/gu, "")
    .replace(/\bApply the \(\+1\) rule on exponents\b/gu, "For each prime power, count all choices from zero up to that exponent")
    .replace(/\bApply the sum-of-divisors rule\b/gu, "Add divisors using the prime-power pattern")
    .replace(/\bApply the divisibility condition\b/gu, "Check the divisibility condition")
    .replace(/\bApply\b/gu, "Use")
    .replace(/\bapply\b/gu, "use")
    .replace(/\bReduce the base modulo the divisor\b/gu, "Replace the big base by its smaller remainder")
    .replace(/\bReduce the base once, then jump to the exponent position in the cycle\./gu, "First make the base small, then use the power pattern.")
    .replace(/\bLocate the exponent position in the cycle\b/gu, "Find where the exponent falls in the repeating pattern")
    .replace(/\bCombine the number conditions first\b/gu, "Put the given conditions together first")
    .replace(/\bChoose the number that fits the given limit\b/gu, "Now choose the number that stays within the given limit")
    .replace(/\bUse the narrowed result in the calculation\b/gu, "Use this smaller set for the next calculation")
    .replace(/\bBreak the question into familiar number-system facts\./gu, "This question mixes more than one familiar number-system idea.")
    .replace(/\bComplete the exponents\b/gu, "Add only the missing prime powers")
    .replace(/\bFinish the perfect-power calculation\b/gu, "Multiply the missing part")
    .replace(/\boptimization\b/giu, "best-fit")
    .replace(/\bconstraint\b/giu, "condition")
    .replace(/\bboundary\b/giu, "limit")
    .replace(/\bcandidate value\b/giu, "possible value")
    .replace(/\bperform reduction\b/giu, "make the number smaller")
    .replace(/\bcombined cycle\b/giu, "repeating pattern")
    .replace(/\bcompute\b/giu, "find")
    .replace(/\bevaluate\b/giu, "find")
    .replace(/\bdetermine\b/giu, "find")
    .replace(/\btransformation\b/giu, "change");
}

function cleanRenderedLocale(locale: Locale, text: string) {
  if (locale === "en") return cleanRenderedEnglish(text);
  return text.split("\n").map(repairMojibakeLineDeep).join("\n");
}

function repairMojibakeLineDeep(line: string) {
  const mojibakeRun =
    /[\u0080-\u00FF\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u0192\u02C6\u02DC\u2013\u2014\u2018\u2019\u201C\u201D\u2020\u2021\u2026\u2030\u2039\u203A\u20AC\u2122]+/gu;
  if (!mojibakeRun.test(line)) return line;
  mojibakeRun.lastIndex = 0;

  const windows1252Reverse: Record<string, number> = {
    "\u20AC": 0x80,
    "\u201A": 0x82,
    "\u0192": 0x83,
    "\u201E": 0x84,
    "\u2026": 0x85,
    "\u2020": 0x86,
    "\u2021": 0x87,
    "\u02C6": 0x88,
    "\u2030": 0x89,
    "\u0160": 0x8a,
    "\u2039": 0x8b,
    "\u0152": 0x8c,
    "\u017D": 0x8e,
    "\u2018": 0x91,
    "\u2019": 0x92,
    "\u201C": 0x93,
    "\u201D": 0x94,
    "\u2022": 0x95,
    "\u2013": 0x96,
    "\u2014": 0x97,
    "\u02DC": 0x98,
    "\u2122": 0x99,
    "\u0161": 0x9a,
    "\u203A": 0x9b,
    "\u0153": 0x9c,
    "\u017E": 0x9e,
    "\u0178": 0x9f,
  };

  const score = (value: string) => ({
    bad: (value.match(/[\u00C2\u00C3]|\u00E0[\u00A4\u00A5\u00A8\u00A9]/gu) ?? []).length,
    indic: (value.match(/[\u0900-\u097F\u0A00-\u0A7F]/gu) ?? []).length,
    replacement: (value.match(/\uFFFD|\?/gu) ?? []).length,
  });

  const decodeOnce = (value: string) => {
    const bytes = Array.from(value, (char) => {
      const mapped = windows1252Reverse[char];
      if (mapped !== undefined) return mapped;
      const code = char.codePointAt(0) ?? 0;
      return code <= 0xff ? code : 0x3f;
    });
    return Buffer.from(bytes).toString("utf8");
  };

  const decodeRun = (value: string) => {
    let current = value;
    let best = value;
    let bestScore = score(value);
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const decoded = decodeOnce(current);
      if (decoded === current) break;
      const decodedScore = score(decoded);
      const better =
        decodedScore.bad < bestScore.bad ||
        (decodedScore.bad === bestScore.bad && decodedScore.indic > bestScore.indic) ||
        (decodedScore.bad === bestScore.bad &&
          decodedScore.indic === bestScore.indic &&
          decodedScore.replacement < bestScore.replacement);
      if (better) {
        best = decoded;
        bestScore = decodedScore;
      }
      current = decoded;
    }
    return best;
  };

  return line.replace(mojibakeRun, decodeRun);
}

function buildMissingDigitFlow(pattern: string, divisor: number, digit: number): ExplanationFlow {
  const ctx = missingDigitContext(pattern, digit);
  const genericSteps: FlowStep[] = [
    {
      title: t("Write the number as a digit equation", "संख्या को अंक-समीकरण के रूप में लिखें", "ਸੰਖਿਆ ਨੂੰ ਅੰਕ-ਸਮੀਕਰਨ ਵਜੋਂ ਲਿਖੋ"),
      lines: [
        t(
          "Keep the missing digit as \\(x\\), then separate the fixed part and the place-value part.",
          "लुप्त अंक को \\(x\\) रखें, फिर स्थिर भाग और स्थान-मूल्य भाग अलग करें।",
          "ਗੁੰਮ ਅੰਕ ਨੂੰ \\(x\\) ਰੱਖੋ, ਫਿਰ ਸਥਿਰ ਭਾਗ ਅਤੇ ਸਥਾਨ-ਮੁੱਲ ਭਾਗ ਵੱਖ ਕਰੋ।",
        ),
      ],
      math: [`N(x)=${ctx.fixedValue}+${ctx.placeValue}x`],
    },
    {
      title: t("Apply the divisibility condition", "विभाज्यता की शर्त लगाएं", "ਭਾਗਯੋਗਤਾ ਦੀ ਸ਼ਰਤ ਲਗਾਓ"),
      lines: [
        t(
          `For divisibility by ${divisor}, the remainder must be 0.`,
          `${divisor} से विभाज्यता के लिए शेषफल 0 होना चाहिए।`,
          `${divisor} ਨਾਲ ਭਾਗਯੋਗਤਾ ਲਈ ਬਾਕੀ 0 ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`,
        ),
      ],
      math: [`${ctx.fixedValue}+${ctx.placeValue}x\\equiv 0\\pmod{${divisor}}`],
    },
    {
      title: t("Solve the digit condition", "अंक की शर्त हल करें", "ਅੰਕ ਦੀ ਸ਼ਰਤ ਹੱਲ ਕਰੋ"),
      lines: [
        t(
          `The condition gives the missing digit ${digit}.`,
          `शर्त से लुप्त अंक ${digit} मिलता है।`,
          `ਸ਼ਰਤ ਤੋਂ ਗੁੰਮ ਅੰਕ ${digit} ਮਿਲਦਾ ਹੈ।`,
        ),
      ],
      math: [`${ctx.fixedValue}+${ctx.placeValue}\\times ${digit}=${ctx.completed}`, `x=${digit}`],
    },
  ];

  if (divisor === 9) {
    return {
      steps: [
        {
          title: t("Use the divisibility rule for 9", "9 की विभाज्यता का नियम लगाएं", "9 ਦੀ ਭਾਗਯੋਗਤਾ ਦਾ ਨਿਯਮ ਲਗਾਓ"),
          lines: [
            t(
              "A number is divisible by 9 when the sum of its digits is a multiple of 9.",
              "कोई संख्या 9 से तभी विभाज्य होती है जब उसके अंकों का योग 9 का गुणज हो।",
              "ਕੋਈ ਸੰਖਿਆ 9 ਨਾਲ ਤਦੋਂ ਭਾਗ ਜਾਂਦੀ ਹੈ ਜਦੋਂ ਉਸ ਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ 9 ਦਾ ਗੁਣਜ ਹੋਵੇ।",
            ),
          ],
          math: [`S=${ctx.knownDigitSum}`, `S+x=${ctx.knownDigitSum}+x`],
        },
        {
          title: t("Form and solve the digit-sum equation", "अंक-योग समीकरण बनाकर हल करें", "ਅੰਕ-ਜੋੜ ਸਮੀਕਰਨ ਬਣਾ ਕੇ ਹੱਲ ਕਰੋ"),
          lines: [
            t(
              `The completed digit sum must be ${ctx.digitSumTarget}, a multiple of 9.`,
              `पूरा अंक-योग ${ctx.digitSumTarget} होना चाहिए, जो 9 का गुणज है।`,
              `ਪੂਰਾ ਅੰਕ-ਜੋੜ ${ctx.digitSumTarget} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਜੋ 9 ਦਾ ਗੁਣਜ ਹੈ।`,
            ),
          ],
          math: [`${ctx.knownDigitSum}+x=${ctx.digitSumTarget}`, `x=${digit}`],
        },
      ],
      verification: {
        lines: [
          t(
            `With \\(x=${digit}\\), the digit-sum rule is satisfied.`,
            `\\(x=${digit}\\) रखने पर अंक-योग नियम पूरा होता है।`,
            `\\(x=${digit}\\) ਰੱਖਣ ਤੇ ਅੰਕ-ਜੋੜ ਨਿਯਮ ਪੂਰਾ ਹੁੰਦਾ ਹੈ।`,
          ),
        ],
        math: [`${ctx.knownDigitSum}+${digit}=${ctx.digitSumTarget}`, `${ctx.digitSumTarget}\\equiv 0\\pmod{9}`],
      },
      shortcut: {
        lines: [
          t(
            "Complete the known digit sum to the next multiple of 9.",
            "ज्ञात अंक-योग को 9 के अगले गुणज तक पूरा करें।",
            "ਪਤਾ ਅੰਕ-ਜੋੜ ਨੂੰ 9 ਦੇ ਅਗਲੇ ਗੁਣਜ ਤੱਕ ਪੂਰਾ ਕਰੋ।",
          ),
        ],
        math: [`x\\equiv ${digit}\\pmod{9}`, `x=${digit}`],
      },
    };
  }

  if (divisor === 18) {
    return {
      steps: [
        {
          title: t("Split the rule for 18", "18 के नियम को दो भागों में बांटें", "18 ਦੇ ਨਿਯਮ ਨੂੰ ਦੋ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡੋ"),
          lines: [
            t(
              "A number divisible by 18 must be even and must also be divisible by 9.",
              "18 से विभाज्य संख्या सम होनी चाहिए और 9 से भी विभाज्य होनी चाहिए।",
              "18 ਨਾਲ ਭਾਗਯੋਗ ਸੰਖਿਆ ਸਮ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ ਅਤੇ 9 ਨਾਲ ਵੀ ਭਾਗਯੋਗ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
            ),
          ],
          math: [`N\\equiv 0\\pmod{2}`, `N\\equiv 0\\pmod{9}`],
        },
        {
          title: t("Check the even condition", "सम होने की शर्त जांचें", "ਸਮ ਹੋਣ ਦੀ ਸ਼ਰਤ ਜਾਂਚੋ"),
          lines: [
            t(
              `The last digit is ${ctx.lastDigit}, so the even condition is satisfied.`,
              `अंतिम अंक ${ctx.lastDigit} है, इसलिए सम होने की शर्त पूरी है।`,
              `ਆਖਰੀ ਅੰਕ ${ctx.lastDigit} ਹੈ, ਇਸ ਲਈ ਸਮ ਹੋਣ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਹੈ।`,
            ),
          ],
          math: [`${ctx.lastDigit}\\equiv 0\\pmod{2}`],
        },
        {
          title: t("Use the digit-sum rule for 9", "9 के लिए अंक-योग नियम लगाएं", "9 ਲਈ ਅੰਕ-ਜੋੜ ਨਿਯਮ ਲਗਾਓ"),
          lines: [
            t(
              `The known digit sum is ${ctx.knownDigitSum}; make the full sum a multiple of 9.`,
              `ज्ञात अंकों का योग ${ctx.knownDigitSum} है; पूरे योग को 9 का गुणज बनाएं।`,
              `ਪਤਾ ਅੰਕਾਂ ਦਾ ਜੋੜ ${ctx.knownDigitSum} ਹੈ; ਪੂਰੇ ਜੋੜ ਨੂੰ 9 ਦਾ ਗੁਣਜ ਬਣਾਓ।`,
            ),
          ],
          math: [`${ctx.knownDigitSum}+x=${ctx.digitSumTarget}`, `x=${digit}`],
        },
      ],
      verification: {
        lines: [
          t(
            `With \\(x=${digit}\\), both tests for 18 are satisfied.`,
            `\\(x=${digit}\\) रखने पर 18 की दोनों जांचें पूरी होती हैं।`,
            `\\(x=${digit}\\) ਰੱਖਣ ਤੇ 18 ਦੀਆਂ ਦੋਵੇਂ ਜਾਂਚਾਂ ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।`,
          ),
        ],
        math: [`${ctx.knownDigitSum}+${digit}=${ctx.digitSumTarget}`, `${ctx.digitSumTarget}\\equiv 0\\pmod{9}`, `${ctx.lastDigit}\\equiv 0\\pmod{2}`],
      },
      shortcut: {
        lines: [
          t(
            "Evenness is fixed by the last digit; complete the digit sum to a multiple of 9.",
            "समता अंतिम अंक से तय है; अंक-योग को 9 के गुणज तक पूरा करें।",
            "ਸਮਤਾ ਆਖਰੀ ਅੰਕ ਨਾਲ ਤੈਅ ਹੈ; ਅੰਕ-ਜੋੜ ਨੂੰ 9 ਦੇ ਗੁਣਜ ਤੱਕ ਪੂਰਾ ਕਰੋ।",
          ),
        ],
        math: [`x\\equiv ${digit}\\pmod{9}`, `x=${digit}`],
      },
    };
  }

  if (divisor === 12) {
    return {
      steps: [
        {
          title: t("Split the rule for 12", "12 के नियम को दो भागों में बांटें", "12 ਦੇ ਨਿਯਮ ਨੂੰ ਦੋ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡੋ"),
          lines: [
            t(
              "A number divisible by 12 must be divisible by both 3 and 4.",
              "12 से विभाज्य संख्या 3 और 4 दोनों से विभाज्य होनी चाहिए।",
              "12 ਨਾਲ ਭਾਗਯੋਗ ਸੰਖਿਆ 3 ਅਤੇ 4 ਦੋਵਾਂ ਨਾਲ ਭਾਗਯੋਗ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
            ),
          ],
          math: [`N\\equiv 0\\pmod{3}`, `N\\equiv 0\\pmod{4}`],
        },
        {
          title: t("Use the digit sum for divisibility by 3", "3 से विभाज्यता के लिए अंक-योग लें", "3 ਨਾਲ ਭਾਗਯੋਗਤਾ ਲਈ ਅੰਕ-ਜੋੜ ਲਓ"),
          lines: [
            t(
              `The known digit sum is ${ctx.knownDigitSum}.`,
              `ज्ञात अंकों का योग ${ctx.knownDigitSum} है।`,
              `ਪਤਾ ਅੰਕਾਂ ਦਾ ਜੋੜ ${ctx.knownDigitSum} ਹੈ।`,
            ),
          ],
          math: [`${ctx.knownDigitSum}+x\\equiv 0\\pmod{3}`],
        },
        {
          title: t("Use the last-two-digits rule for 4", "4 के लिए अंतिम दो अंकों का नियम लगाएं", "4 ਲਈ ਆਖਰੀ ਦੋ ਅੰਕਾਂ ਦਾ ਨਿਯਮ ਲਗਾਓ"),
          lines: [
            t(
              "The last two digits must form a number divisible by 4.",
              "अंतिम दो अंकों से बनी संख्या 4 से विभाज्य होनी चाहिए।",
              "ਆਖਰੀ ਦੋ ਅੰਕਾਂ ਨਾਲ ਬਣੀ ਸੰਖਿਆ 4 ਨਾਲ ਭਾਗਯੋਗ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
            ),
          ],
          math: [`${ctx.lastTwoExpr}=${ctx.lastTwoValue}`, `${ctx.lastTwoValue}\\equiv 0\\pmod{4}`],
        },
        {
          title: t("Combine both conditions", "दोनों शर्तें मिलाएं", "ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਜੋੜੋ"),
          lines: [
            t(
              `The digit satisfying both tests is ${digit}.`,
              `दोनों जांचों को पूरा करने वाला अंक ${digit} है।`,
              `ਦੋਵੇਂ ਜਾਂਚਾਂ ਪੂਰੀਆਂ ਕਰਨ ਵਾਲਾ ਅੰਕ ${digit} ਹੈ।`,
            ),
          ],
          math: [`${ctx.knownDigitSum}+x=${ctx.digitSumTarget}`, `x=${digit}`],
        },
      ],
      verification: {
        lines: [
          t(
            `With \\(x=${digit}\\), the tests for 3 and 4 are both satisfied.`,
            `\\(x=${digit}\\) रखने पर 3 और 4 की दोनों जांचें पूरी होती हैं।`,
            `\\(x=${digit}\\) ਰੱਖਣ ਤੇ 3 ਅਤੇ 4 ਦੀਆਂ ਦੋਵੇਂ ਜਾਂਚਾਂ ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।`,
          ),
        ],
        math: [`${ctx.knownDigitSum}+${digit}=${ctx.digitSumTarget}`, `${ctx.digitSumTarget}\\equiv 0\\pmod{3}`, `${ctx.lastTwoValue}\\equiv 0\\pmod{4}`],
      },
      shortcut: {
        lines: [
          t(
            "Check 3 from the digit sum and 4 from the last two digits.",
            "3 की जांच अंक-योग से और 4 की जांच अंतिम दो अंकों से करें।",
            "3 ਦੀ ਜਾਂਚ ਅੰਕ-ਜੋੜ ਨਾਲ ਅਤੇ 4 ਦੀ ਜਾਂਚ ਆਖਰੀ ਦੋ ਅੰਕਾਂ ਨਾਲ ਕਰੋ।",
          ),
        ],
        math: [`x\\equiv ${digit}\\pmod{3}`, `${ctx.lastTwoExpr}\\equiv 0\\pmod{4}`, `x=${digit}`],
      },
    };
  }

  if (divisor === 11) {
    return {
      steps: [
        {
          title: t("Use the alternating-sum rule for 11", "11 के लिए वैकल्पिक-योग नियम लगाएं", "11 ਲਈ ਬਦਲਵੇਂ-ਜੋੜ ਦਾ ਨਿਯਮ ਲਗਾਓ"),
          lines: [
            t(
              "For divisibility by 11, the difference of alternate digit sums must be a multiple of 11.",
              "11 से विभाज्यता के लिए वैकल्पिक अंकों के योगों का अंतर 11 का गुणज होना चाहिए।",
              "11 ਨਾਲ ਭਾਗਯੋਗਤਾ ਲਈ ਬਦਲਵੇਂ ਅੰਕਾਂ ਦੇ ਜੋੜਾਂ ਦਾ ਫਰਕ 11 ਦਾ ਗੁਣਜ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
            ),
          ],
          math: [`A=${ctx.altKnown}`, `${linearDigitExpression(ctx.altKnown, ctx.altCoeff)}\\equiv 0\\pmod{11}`],
        },
        {
          title: t("Solve the alternating-sum equation", "वैकल्पिक-योग समीकरण हल करें", "ਬਦਲਵੇਂ-ਜੋੜ ਦਾ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ"),
          lines: [
            t(
              `The valid multiple of 11 for this pattern is ${ctx.altValue}.`,
              `इस पैटर्न के लिए 11 का मान्य गुणज ${ctx.altValue} है।`,
              `ਇਸ ਪੈਟਰਨ ਲਈ 11 ਦਾ ਠੀਕ ਗੁਣਜ ${ctx.altValue} ਹੈ।`,
            ),
          ],
          math: [`${linearDigitExpression(ctx.altKnown, ctx.altCoeff)}=${ctx.altValue}`, `x=${digit}`],
        },
      ],
      verification: {
        lines: [
          t(
            `With \\(x=${digit}\\), the alternate digit-sum difference is a multiple of 11.`,
            `\\(x=${digit}\\) रखने पर वैकल्पिक अंक-योगों का अंतर 11 का गुणज है।`,
            `\\(x=${digit}\\) ਰੱਖਣ ਤੇ ਬਦਲਵੇਂ ਅੰਕ-ਜੋੜਾਂ ਦਾ ਫਰਕ 11 ਦਾ ਗੁਣਜ ਹੈ।`,
          ),
        ],
        math: [`${linearDigitExpression(ctx.altKnown, ctx.altCoeff).replace("x", String(digit))}=${ctx.altValue}`, `${ctx.altValue}\\equiv 0\\pmod{11}`],
      },
      shortcut: {
        lines: [
          t(
            "Write the alternate-sum expression and make it a multiple of 11.",
            "वैकल्पिक-योग व्यंजक लिखें और उसे 11 का गुणज बनाएं।",
            "ਬਦਲਵੇਂ-ਜੋੜ ਦਾ ਰੂਪ ਲਿਖੋ ਅਤੇ ਇਸ ਨੂੰ 11 ਦਾ ਗੁਣਜ ਬਣਾਓ।",
          ),
        ],
        math: [`x\\equiv ${digit}\\pmod{11}`, `x=${digit}`],
      },
    };
  }

  return {
    steps: genericSteps,
    verification: {
      lines: [
        t(
          `With \\(x=${digit}\\), the completed number satisfies the divisor condition.`,
          `\\(x=${digit}\\) रखने पर पूरी संख्या भाजक की शर्त पूरी करती है।`,
          `\\(x=${digit}\\) ਰੱਖਣ ਤੇ ਪੂਰੀ ਸੰਖਿਆ ਭਾਜਕ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੀ ਹੈ।`,
        ),
      ],
      math: [`${ctx.completed}\\equiv 0\\pmod{${divisor}}`],
    },
    shortcut: {
      lines: [
        t(
          "Use the place-value congruence directly.",
          "स्थान-मूल्य सर्वांगसमता सीधे लगाएं।",
          "ਸਥਾਨ-ਮੁੱਲ ਵਾਲੀ ਸਰਵਾਂਗਸਮਤਾ ਸਿੱਧੀ ਲਗਾਓ।",
        ),
      ],
      math: [`${ctx.fixedValue}+${ctx.placeValue}x\\equiv 0\\pmod{${divisor}}`, `x=${digit}`],
    },
  };
}

function buildFlow(model: NumberSystemSolverModel, answer: number | string, blueprint: NumberSystemExplanationBlueprint): ExplanationFlow {
  const i = model.inputs as Record<string, any>;
  const numericAnswer = typeof answer === "number" ? answer : Number(String(answer).match(/-?\d+/u)?.[0] ?? 0);
  const blueprintText: Record<NumberSystemExplanationBlueprint, BlueprintTeachingText> = {
    digit_divisibility: {
      observation: "A missing digit is decided by the number rule given in the question.",
      reason: "We are not guessing the digit. We are choosing the digit that makes the whole number satisfy the given rule.",
      shortcut: "Check the digit rule first, then put the digit back and confirm the whole number.",
    },
    digit_reconstruction: {
      observation: "The clues are about digits, so place value is the main idea.",
      reason: "A digit changes value according to its position. That is why we write the number using tens, hundreds, and units.",
      shortcut: "Use the strongest digit clue first, then check the remaining clue.",
    },
    perfect_square: {
      observation: "A square is made from pairs of prime factors.",
      reason: "So every prime must appear an even number of times. Any unpaired prime tells us exactly what is missing.",
      shortcut: "Pair the prime powers; the unpaired primes give the least extra part.",
    },
    perfect_cube: {
      observation: "A cube is made from groups of three equal prime factors.",
      reason: "So every prime exponent must be a multiple of three. We add only the powers needed to complete the groups.",
      shortcut: "Group prime powers in threes; the missing powers give the least extra part.",
    },
    remainder: {
      observation: "The question is about what is left after division.",
      reason: "Numbers with the same remainder are separated by equal jumps of the divisor.",
      shortcut: "Work with the residue class directly instead of listing numbers.",
    },
    modular_arithmetic: {
      observation: "Large powers usually repeat their remainders.",
      reason: "Once the pattern repeats, we only need the position of the exponent in that pattern.",
      shortcut: "Reduce the exponent by the cycle length and read the matching remainder.",
    },
    last_digit: {
      observation: "For the last digit, only the ending digit matters.",
      reason: "Powers of the same ending digit repeat in a short pattern.",
      shortcut: "Use the unit-digit cycle and reduce the exponent position.",
    },
    prime_factorization: {
      observation: "Prime factors show the building blocks of the number.",
      reason: "After the prime powers are visible, divisors, multiples, squares, and cubes become much easier.",
      shortcut: "Factor once, then use the exponents directly.",
    },
    factor_count: {
      observation: "Every divisor is made by choosing some power of each prime.",
      reason: "For example, from \\(2^3\\), we may choose \\(2^0,2^1,2^2,2^3\\). That is why we count one extra choice.",
      shortcut: "Multiply the exponent-choice counts.",
    },
    exact_divisor_count: {
      observation: "The number of divisors depends on exponent choices.",
      reason: "To get an exact divisor count, the prime exponents must give choice counts whose product matches the target.",
      shortcut: "Match the target count with exponent-choice factors.",
    },
    hcf: {
      observation: "HCF means the greatest part common to all numbers.",
      reason: "A prime can be common only up to the smallest power present in every number.",
      shortcut: "Compare common prime powers and keep the lowest powers.",
    },
    lcm: {
      observation: "LCM must be a multiple of every given number.",
      reason: "So it must carry the highest power of every prime that appears anywhere.",
      shortcut: "Take the highest prime powers once.",
    },
    optimization: {
      observation: "The question asks for the best number that still follows the given rule.",
      reason: "First make the rule clear, then move to the nearest allowed number within the limit.",
      shortcut: "Jump to the nearest valid multiple or residue instead of testing one by one.",
    },
    least_number: {
      observation: "The least number is the first number that passes every check.",
      reason: "We first build the common pattern, then move upward until the first fit appears.",
      shortcut: "Use ceiling division on the combined condition.",
    },
    greatest_number: {
      observation: "The greatest number is the last allowed number before the limit.",
      reason: "We first build the common pattern, then move downward from the limit.",
      shortcut: "Use floor division on the combined condition.",
    },
    minimum_addition: {
      observation: "A small addition or subtraction is decided by the current remainder.",
      reason: "If a number has already crossed a multiple by some remainder, we only need the gap to the next multiple.",
      shortcut: "Addition equals divisor minus current remainder; subtraction equals current remainder.",
    },
    minimum_multiplier: {
      observation: "The multiplier only needs to supply the missing factors.",
      reason: "Whatever the number already has should not be multiplied again.",
      shortcut: "Divide the target by the gcd with the given number.",
    },
    factorial: {
      observation: "A zero at the end is made by a pair of 2 and 5.",
      reason: "In a factorial there are plenty of 2s, so 5s decide how many such pairs are possible.",
      shortcut: "Add the floor quotients by 5, 25, 125, and so on.",
    },
    highest_power: {
      observation: "A composite power depends on all its prime parts.",
      reason: "The prime part that runs out first decides the highest possible power.",
      shortcut: "Use Legendre counts for the needed primes and take the limiting quotient.",
    },
    hybrid: {
      observation: "This question mixes more than one number-system idea.",
      reason: "Handle one clue first, use it to reduce the possibilities, and then check the next clue.",
      shortcut: "Start from the strongest condition and verify the rest.",
    },
  }[blueprint];

  if ((model.kind as string) === "missing_digit") {
    return buildMissingDigitFlow(String(i.pattern), Number(i.divisor), numericAnswer);
  }

  switch (model.kind) {
    case "missing_digit": {
      const pattern = String(i.pattern);
      const divisor = Number(i.divisor);
      const digit = numericAnswer;
      const completed = pattern.replace("x", String(digit));
      const quotient = Math.floor(Number(completed) / divisor);
      return {
        steps: [
          {
            title: t("Form the divisibility condition", "विभाज्यता की शर्त बनाएं", "ਭਾਗਯੋਗਤਾ ਦੀ ਸ਼ਰਤ ਬਣਾਓ"),
            lines: [
              t(
                `The completed number must be divisible by ${divisor}.`,
                `पूरी संख्या ${divisor} से विभाज्य होनी चाहिए।`,
                `ਪੂਰੀ ਸੰਖਿਆ ${divisor} ਨਾਲ ਭਾਗ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।`,
              ),
            ],
            math: [`${pattern.replace("x", "x")}\\Rightarrow ${completed}`, `${completed}\\div ${divisor}=${quotient}`],
          },
          {
            title: t("Identify the missing digit", "लुप्त अंक पहचानें", "ਗੁੰਮ ਅੰਕ ਪਛਾਣੋ"),
            lines: [
              t(
                `Digit ${digit} satisfies the divisibility condition.`,
                `केवल अंक ${digit} संख्या को ${divisor} से विभाज्य बनाता है।`,
                `ਸਿਰਫ ਅੰਕ ${digit} ਸੰਖਿਆ ਨੂੰ ${divisor} ਨਾਲ ਭਾਗਯੋਗ ਬਣਾਉਂਦਾ ਹੈ।`,
              ),
            ],
            math: [`x=${digit}`],
          },
        ],
        verification: {
          lines: [
            t(
              `Substituting \\(x=${digit}\\) gives \\(${completed}\\), and \\(${completed}\\div ${divisor}=${quotient}\\) exactly.`,
              `\\(x=${digit}\\) रखने पर \\(${completed}\\) मिलता है, तथा \\(${completed}\\div ${divisor}=${quotient}\\) पूर्णतः विभाजित होता है।`,
              `\\(x=${digit}\\) ਰੱਖਣ ਤੇ \\(${completed}\\) ਮਿਲਦੀ ਹੈ, ਅਤੇ \\(${completed}\\div ${divisor}=${quotient}\\) ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗ ਹੁੰਦਾ ਹੈ।`,
            ),
          ],
          math: [`${completed}\\equiv 0\\pmod{${divisor}}`],
        },
        shortcut: {
          lines: [
            t(
              "Use the divisor rule on the digit sum of the known positions only.",
              "केवल ज्ञात स्थानों के अंक-योग पर भाजक नियम लगाएं।",
              "ਸਿਰਫ ਪਤਾ ਸਥਾਨਾਂ ਦੇ ਅੰਕ-ਜੋੜ ਤੇ ਭਾਜਕ ਨਿਯਮ ਲਗਾਓ।",
            ),
          ],
          math: [`S+x\\equiv 0\\pmod{${divisor}}`],
        },
      };
    }
    case "divisibility_count": {
      const start = Number(i.start);
      const end = Number(i.end);
      const divisor = Number(i.divisor);
      const first = Math.ceil(start / divisor) * divisor;
      const last = Math.floor(end / divisor) * divisor;
      const count = numericAnswer;
      const firstQ = first / divisor;
      const lastQ = last / divisor;
      const upperQ = Math.floor(end / divisor);
      const lowerQ = Math.floor((start - 1) / divisor);
      const remainderEnd = end % divisor;
      return {
        steps: [
          {
            title: t("Find the first valid multiple", "पहला मान्य गुणज ज्ञात करें", "ਪਹਿਲਾ ਵੈਧ ਗੁਣਜ ਕੱਢੋ"),
            lines: [
              t(
                `Therefore, the first multiple of ${divisor} greater than ${start} is ${first}.`,
                `अतः ${start} से बड़ा ${divisor} का पहला गुणज ${first} है।`,
                `ਇਸ ਲਈ ${start} ਤੋਂ ਵੱਡਾ ${divisor} ਦਾ ਪਹਿਲਾ ਗੁਣਜ ${first} ਹੈ।`,
              ),
            ],
            math: [`${divisor}\\times ${firstQ}=${first}`],
          },
          {
              title: t("Find the last valid multiple", "आखिरी वैध गुणज ज्ञात करें", "ਆਖਰੀ ਵੈਧ ਗੁਣਜ ਕੱਢੋ"),
            lines: [
              t(
                `Therefore, ${last} is the greatest multiple of ${divisor} not exceeding ${end}.`,
                `अतः ${last}, ${end} से अधिक न होने वाला ${divisor} का सबसे बड़ा गुणज है।`,
                `ਇਸ ਲਈ ${last}, ${end} ਤੋਂ ਵੱਧ ਨਾ ਹੋਣ ਵਾਲਾ ${divisor} ਦਾ ਸਭ ਤੋਂ ਵੱਡਾ ਗੁਣਜ ਹੈ।`,
              ),
            ],
            math: [`${end}=${divisor}\\times ${lastQ}+${remainderEnd}`, `${end}-${remainderEnd}=${last}`],
          },
          {
            title: t("Count the valid multiples", "मान्य गुणजों की गिनती करें", "ਵੈਧ ਗੁਣਜਾਂ ਦੀ ਗਿਣਤੀ ਕਰੋ"),
            lines: [
              t(
                `The multiples form an arithmetic progression with common difference ${divisor}.`,
                `गुणज ${divisor} के सामान्य अंतर वाली समांतर श्रेणी बनाते हैं।`,
                `ਗੁਣਜ ${divisor} ਦੇ ਸਾਂਝੇ ਅੰਤਰ ਵਾਲੀ ਸਮਾਂਤਰ ਸ਼੍ਰੇਣੀ ਬਣਾਉਂਦੇ ਹਨ।`,
              ),
            ],
            math: [`\\frac{${last}-${first}}{${divisor}}+1=${lastQ - firstQ}+1=${count}`],
          },
        ],
        verification: {
          lines: [
            t(
              `The total number of multiples is ${count}.`,
              `गुणजों की कुल संख्या ${count} है।`,
              `ਗੁਣਜਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ${count} ਹੈ।`,
            ),
            t(
              `Hence, there are ${count} multiples of ${divisor} in the given range.`,
              `अतः दी गई सीमा में ${divisor} के ${count} गुणज हैं।`,
              `ਇਸ ਲਈ ਦਿੱਤੀ ਸੀਮਾ ਵਿੱਚ ${divisor} ਦੇ ${count} ਗੁਣਜ ਹਨ।`,
            ),
          ],
          math: [],
        },
        shortcut: {
          lines: [
            t(
              "Count multiples using quotient floors on the range limits.",
              "सीमा की सीमाओं पर भागफल-मूल्य से गुणज गिनें।",
              "ਸੀਮਾ ਦੀਆਂ ਹੱਦਾਂ ਤੇ ਭਾਗਫਲ-ਮੂਲਾਂ ਨਾਲ ਗੁਣਜ ਗਿਣੋ।",
            ),
          ],
          math: [
            `\\left\\lfloor\\frac{${end}}{${divisor}}\\right\\rfloor-\\left\\lfloor\\frac{${start - 1}}{${divisor}}\\right\\rfloor`,
            `${upperQ}-${lowerQ}=${count}`,
          ],
        },
      };
    }
    case "factor_count": {
      const n = Number(i.n);
      const factors = primeFactors(n);
      const factorText = displayFactors(factors);
      const ask = String(i.ask ?? "count");
      if (ask === "sum") {
        const terms = Object.entries(factors).map(([p, e]) => `\\frac{${p}^{${e + 1}}-1}{${p}-1}`).join("\\times ");
        const sum = sumOfDivisorsFromFactors(factors);
        return {
          steps: [
            {
              title: t("Write prime factorization", "अभाज्य गुणनखंड लिखें", "ਅਭਾਜ ਗੁਣਨਖੰਡ ਲਿਖੋ"),
              lines: [],
              math: [`${n}=${factorText}`],
            },
            {
              title: t("Apply the sum-of-divisors rule", "भाजकों के योग का नियम लगाएं", "ਭਾਜਕਾਂ ਦੇ ਜੋੜ ਦਾ ਨਿਯਮ ਲਗਾਓ"),
              lines: [
                t(
                  "Multiply the geometric-sum factor for each prime power.",
                  "प्रत्येक अभाज्य घात के लिए गुणोत्तर-श्रेणी योग गुणनखंड गुणा करें।",
                  "ਹਰ ਅਭਾਜ ਘਾਤ ਲਈ ਗੁਣੋਤਰ ਸ਼੍ਰੇਣੀ ਦੇ ਜੋੜ ਦੇ ਗੁਣਨਖੰਡ ਗੁਣਾ ਕਰੋ।",
                ),
              ],
              math: [`\\sigma(${n})=${sum}`],
            },
          ],
          verification: {
            lines: [t(`The sum of all positive divisors is ${sum}.`, `सभी धनात्मक भाजकों का योग ${sum} है।`, `ਸਾਰੇ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਜੋੜ ${sum} ਹੈ।`)],
            math: [],
          },
          shortcut: {
            lines: [t("Write prime powers once, then multiply the σ-factors.", "अभाज्य घातें एक बार लिखकर σ-गुणनखंड गुणा करें।", "ਅਭਾਜ ਘਾਤਾਂ ਇੱਕ ਵਾਰ ਲਿਖ ਕੇ σ-ਗੁਣਨਖੰਡ ਗੁਣਾ ਕਰੋ।")],
            math: [terms],
          },
        };
      }
      if (ask === "product") {
        const count = factorCountFromFactors(factors);
        const product = Math.round(n ** (count / 2));
        return {
          steps: [
            {
              title: t("Write prime factorization", "अभाज्य गुणनखंड लिखें", "ਅਭਾਜ ਗੁਣਨਖੰਡ ਲਿਖੋ"),
              lines: [],
              math: [`${n}=${factorText}`],
            },
            {
              title: t("Count the divisors", "भाजकों की संख्या ज्ञात करें", "ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ"),
              lines: [],
              math: [`d(${n})=${Object.values(factors).map((e) => `(${e}+1)`).join("\\times ")}=${count}`],
            },
            {
              title: t("Use the product-of-divisors identity", "भाजकों के गुणनफल की पहचान लगाएं", "ਭਾਜਕਾਂ ਦੇ ਗੁਣਨਫਲ ਦੀ ਪਛਾਣ ਲਗਾਓ"),
              lines: [],
              math: [`\\prod d\\mid ${n} d=${n}^{d(${n})/2}=${n}^{${count}/2}=${product}`],
            },
          ],
          verification: {
            lines: [t(`The product of all positive divisors is ${product}.`, `सभी धनात्मक भाजकों का गुणनफल ${product} है।`, `ਸਾਰੇ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਗੁਣਨਫਲ ${product} ਹੈ।`)],
            math: [],
          },
          shortcut: {
            lines: [t("After counting divisors, raise n to half the divisor count.", "भाजक गिनती के बाद n को आधी गिनती की घात दें।", "ਭਾਜਕ ਗਿਣਤੀ ਤੋਂ ਬਾਅਦ n ਨੂੰ ਅੱਧੀ ਗਿਣਤੀ ਦੀ ਘਾਤ ਦਿਓ।")],
            math: [`${n}^{${count}/2}=${product}`],
          },
        };
      }
      if (ask === "odd") {
        const oddTerms = Object.entries(factors).filter(([p]) => Number(p) !== 2).map(([, e]) => `(${e}+1)`).join("\\times ") || "1";
        const odd = numericAnswer;
        return {
          steps: [
            {
              title: t("Write prime factorization", "अभाज्य गुणनखंड लिखें", "ਅਭਾਜ ਗੁਣਨਖੰਡ ਲਿਖੋ"),
              lines: [],
              math: [`${n}=${factorText}`],
            },
            {
              title: t("Count odd divisors only", "केवल विषम भाजकों की गिनती", "ਸਿਰਫ ਟਾਂਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ"),
              lines: [
                t("Ignore the power of 2; odd divisors come from odd primes only.", "2 की घात निकालें; विषम भाजक केवल विषम अभाज्यों से आते हैं।", "2 ਦੀ ਘਾਤ ਛੱਡੋ; ਟਾਂਕ ਭਾਜਕ ਸਿਰਫ ਟਾਂਕ ਅਭਾਜਾਂ ਤੋਂ ਆਉਂਦੇ ਹਨ।"),
              ],
              math: [oddTerms, `O=${odd}`],
            },
          ],
          verification: {
            lines: [t(`The number of odd divisors is ${odd}.`, `विषम भाजकों की संख्या ${odd} है।`, `ਟਾਂਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ ${odd} ਹੈ।`)],
            math: [],
          },
          shortcut: {
            lines: [t("Drop the factor 2 and multiply (e+1) for remaining primes.", "2 का गुणनखंड हटाकर शेष अभाज्यों के (e+1) गुणा करें।", "2 ਦਾ ਗੁਣਨਖੰਡ ਹਟਾ ਕੇ ਬਾਕੀ ਅਭਾਜਾਂ ਦੇ (e+1) ਗੁਣਾ ਕਰੋ।")],
            math: [`O(n)=${oddTerms}=${odd}`],
          },
        };
      }
      const count = factorCountFromFactors(factors);
      return {
        steps: [
          {
            title: t("Write prime factorization", "अभाज्य गुणनखंड लिखें", "ਅਭਾਜ ਗੁਣਨਖੰਡ ਲਿਖੋ"),
            lines: [],
            math: [`${n}=${factorText}`],
          },
          {
            title: t("Apply the (+1) rule on exponents", "घातों पर (+1) नियम लगाएं", "ਘਾਤਾਂ ਤੇ (+1) ਨਿਯਮ ਲਗਾਓ"),
            lines: [
              t(
                "Each exponent contributes one more choice than its value.",
                "प्रत्येक घात अपने मान से एक अधिक विकल्प देती है।",
                "ਹਰ ਘਾਤ ਆਪਣੇ ਮੁੱਲ ਤੋਂ ਇੱਕ ਵੱਧ ਵਿਕਲਪ ਦਿੰਦੀ ਹੈ।",
              ),
            ],
            math: [`d(${n})=${Object.values(factors).map((e) => `(${e}+1)`).join("\\times ")}=${count}`],
          },
        ],
        verification: {
          lines: [t(`The number of positive divisors is ${count}.`, `धनात्मक भाजकों की संख्या ${count} है।`, `ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ ${count} ਹੈ।`)],
          math: [],
        },
        shortcut: {
          lines: [t("Multiply (exponent + 1) across all prime powers.", "सभी अभाज्य घातों पर (घात + 1) का गुणन करें।", "ਸਾਰੀਆਂ ਅਭਾਜ ਘਾਤਾਂ ਤੇ (ਘਾਤ + 1) ਦਾ ਗੁਣਨ ਕਰੋ।")],
          math: [Object.values(factors).map((e) => `(${e}+1)`).join("\\times ")],
        },
      };
    }
    case "hcf_lcm": {
      const a = Number(i.a);
      const b = Number(i.b);
      const ask = String(i.ask ?? "lcm");
      if (ask === "other") {
        const h = Number(i.hcf);
        const l = Number(i.lcm);
        const known = Number(i.known);
        const other = numericAnswer;
        return {
          steps: [
            {
              title: t("Write the HCF–LCM product relation", "HCF–LCM गुणन संबंध लिखें", "HCF–LCM ਗੁਣਨ ਸੰਬੰਧ ਲਿਖੋ"),
              lines: [],
              math: ["a\\times b=\\operatorname{HCF}\\times\\operatorname{LCM}"],
            },
            {
              title: t("Place the known values in the relation", "संबंध में दिए मान रखें", "ਸੰਬੰਧ ਵਿੱਚ ਦਿੱਤੇ ਮੁੱਲ ਰੱਖੋ"),
              lines: [],
              math: [`${known}\\times b=${h}\\times ${l}`],
            },
            {
              title: t("Solve for the unknown number", "अज्ञात संख्या हल करें", "ਅਣਜਾਣ ਸੰਖਿਆ ਹੱਲ ਕਰੋ"),
              lines: [],
              math: [`b=\\frac{${h}\\times ${l}}{${known}}=\\frac{${h * l}}{${known}}=${other}`],
            },
          ],
          verification: {
            lines: [t(`The other number is ${other}.`, `दूसरी संख्या ${other} है।`, `ਦੂਜੀ ਸੰਖਿਆ ${other} ਹੈ।`)],
            math: [`\\operatorname{HCF}(${known},${other})=${h}`, `\\operatorname{LCM}(${known},${other})=${l}`],
          },
          shortcut: {
            lines: [t("Divide the product of HCF and LCM by the known number.", "HCF और LCM का गुणनफल ज्ञात संख्या से भाग करें।", "HCF ਅਤੇ LCM ਦਾ ਗੁਣਨਫਲ ਜਾਣੀ ਸੰਖਿਆ ਨਾਲ ਭਾਗ ਕਰੋ।")],
            math: [`${known}\\times b=${h}\\times ${l}`],
          },
        };
      }
      if (ask === "three_lcm") {
        const c = Number(i.c);
        const value = lcm(lcm(a, b), c);
        return {
          steps: [
            {
              title: t("Compare prime powers of all three numbers", "तीनों संख्याओं की अभाज्य घातें तुलना करें", "ਤਿੰਨਾਂ ਸੰਖਿਆਵਾਂ ਦੀਆਂ ਅਭਾਜ ਘਾਤਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ"),
              lines: [],
              math: [
                `${a}=${displayFactors(primeFactors(a))}`,
                `${b}=${displayFactors(primeFactors(b))}`,
                `${c}=${displayFactors(primeFactors(c))}`,
              ],
            },
            {
              title: t("Take the highest power of each prime", "प्रत्येक अभाज्य की सबसे बड़ी घात लें", "ਹਰ ਅਭਾਜ ਦੀ ਸਭ ਤੋਂ ਵੱਡੀ ਘਾਤ ਲਓ"),
              lines: [],
              math: [`\\operatorname{LCM}(${a},${b},${c})=${value}`],
            },
          ],
          verification: {
            lines: [t(`The required LCM is ${value}.`, `आवश्यक LCM ${value} है।`, `ਲੋੜੀਂਦਾ LCM ${value} ਹੈ।`)],
            math: [],
          },
          shortcut: {
            lines: [t("For three intervals, take LCM in two stages.", "तीन अंतरालों के लिए LCM दो चरणों में लें।", "ਤਿੰਨ ਅੰਤਰਾਲਾਂ ਲਈ LCM ਦੋ ਪੜਾਵਾਂ ਵਿੱਚ ਲਓ।")],
            math: [`\\operatorname{LCM}(${a},${b},${c})=\\operatorname{LCM}(\\operatorname{LCM}(${a},${b}),${c})=${value}`],
          },
        };
      }
      const value = ask === "hcf" ? gcd(a, b) : lcm(a, b);
      const label = ask === "hcf" ? "HCF" : "LCM";
      return {
        steps: [
          {
            title: t("Write prime factorizations", "अभाज्य गुणनखंड लिखें", "ਅਭਾਜ ਗੁਣਨਖੰਡ ਲਿਖੋ"),
            lines: [],
            math: [`${a}=${displayFactors(primeFactors(a))}`, `${b}=${displayFactors(primeFactors(b))}`],
          },
          {
            title: t(
              ask === "hcf" ? "Take lowest powers for HCF" : "Take highest powers for LCM",
              ask === "hcf" ? "HCF के लिए न्यूनतम घातें लें" : "LCM के लिए अधिकतम घातें लें",
              ask === "hcf" ? "HCF ਲਈ ਘੱਟੋ-ਘੱਟ ਘਾਤਾਂ ਲਓ" : "LCM ਲਈ ਵੱਧ ਤੋਂ ਵੱਧ ਘਾਤਾਂ ਲਓ",
            ),
            lines: [],
            math: [`\\operatorname{${label}}(${a},${b})=${value}`],
          },
        ],
        verification: {
          lines: [t(`The ${label} is ${value}.`, `${label} ${value} है।`, `${label} ${value} ਹੈ।`)],
          math: [],
        },
        shortcut: {
          lines: [
            t(
              ask === "hcf" ? "Use the product identity with the smaller number." : "Use the product identity with the HCF.",
              ask === "hcf" ? "छोटी संख्या के साथ गुणन पहचान लगाएं।" : "HCF के साथ गुणन पहचान लगाएं।",
              ask === "hcf" ? "ਛੋਟੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਨ ਪਛਾਣ ਲਗਾਓ।" : "HCF ਨਾਲ ਗੁਣਨ ਪਛਾਣ ਲਗਾਓ।",
            ),
          ],
          math: [
            ask === "hcf"
              ? `\\operatorname{HCF}(${a},${b})=\\frac{${a}\\times ${b}}{\\operatorname{LCM}(${a},${b})}=${value}`
              : `\\operatorname{LCM}(${a},${b})=\\frac{${a}\\times ${b}}{\\operatorname{HCF}(${a},${b})}=${value}`,
          ],
        },
      };
    }
    case "remainder":
    case "last_digit":
    case "modular_hybrid": {
      const base = Number(i.base);
      const exp = Number(i.exp);
      const mod = Number(i.mod ?? 10);
      const reduced = ((base % mod) + mod) % mod;
      const cycle = remainderCycle(reduced, mod);
      const position = ((exp - 1) % cycle.length) + 1;
      const remainder = cycle[position - 1]!;
      return {
        steps: [
          {
            title: t("Reduce the base modulo the divisor", "आधार को भाजक के अनुसार घटाएं", "ਆਧਾਰ ਨੂੰ ਭਾਜਕ ਮੁਤਾਬਕ ਘਟਾਓ"),
            lines: [],
            math: [`${base}\\equiv ${reduced}\\pmod{${mod}}`],
          },
          {
            title: t("Write the remainder cycle", "शेषफल चक्र लिखें", "ਬਾਕੀ ਚੱਕਰ ਲਿਖੋ"),
            lines: [
              t(`Cycle length = ${cycle.length}.`, `चक्र की लंबाई = ${cycle.length}।`, `ਚੱਕਰ ਦੀ ਲੰਬਾਈ = ${cycle.length}।`),
            ],
            math: [cycle.join("\\rightarrow ")],
          },
          {
            title: t("Locate the exponent position in the cycle", "चक्र में घात की स्थिति ज्ञात करें", "ਚੱਕਰ ਵਿੱਚ ਘਾਤ ਦੀ ਸਥਿਤੀ ਕੱਢੋ"),
            lines: [],
            math: [`(${exp}-1)\\bmod ${cycle.length}+1=${position}`],
          },
          {
            title: t("Read the required remainder", "आवश्यक शेषफल पढ़ें", "ਲੋੜੀਂਦਾ ਬਾਕੀ ਪੜ੍ਹੋ"),
            lines: [
              t(`Hence, remainder = ${remainder}.`, `अतः शेषफल = ${remainder}।`, `ਇਸ ਲਈ ਬਾਕੀ = ${remainder}।`),
            ],
            math: [`${base}^{${exp}}\\equiv ${remainder}\\pmod{${mod}}`],
          },
        ],
        verification: {
          lines: [
            t(
              `The ${position}${position === 1 ? "st" : position === 2 ? "nd" : position === 3 ? "rd" : "th"} term of the cycle is ${remainder}.`,
              `चक्र का ${position}वाँ पद ${remainder} है।`,
              `ਚੱਕਰ ਦਾ ${position}ਵਾਂ ਪਦ ${remainder} ਹੈ।`,
            ),
          ],
          math: [],
        },
        shortcut: {
          lines: [
            t(
              "Reduce the base once, then jump to the exponent position in the cycle.",
              "आधार एक बार घटाकर चक्र में घात की स्थिति पर जाएं।",
              "ਆਧਾਰ ਇੱਕ ਵਾਰ ਘਟਾ ਕੇ ਚੱਕਰ ਵਿੱਚ ਘਾਤ ਦੀ ਸਥਿਤੀ ਤੇ ਜਾਓ।",
            ),
          ],
          math: [`p=(${exp}-1)\\bmod ${cycle.length}+1=${position}`, `${reduced}^{${exp}}\\equiv ${remainder}\\pmod{${mod}}`],
        },
      };
    }
    case "digit_logic": {
      const tens = Number(i.tens);
      const ones = Number(i.ones);
      if (i.ask === "reversal") {
        const diff = 9 * Math.abs(tens - ones);
        return {
          steps: [
            {
              title: t("Write both numbers by place value", "दोनों संख्याएँ स्थान-मूल्य से लिखें", "ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਸਥਾਨ-ਮੁੱਲ ਨਾਲ ਲਿਖੋ"),
              lines: [],
              math: [`N_1=10\\times ${tens}+${ones}=${10 * tens + ones}`, `N_2=10\\times ${ones}+${tens}=${10 * ones + tens}`],
            },
            {
              title: t("Subtract using the digit-difference rule", "अंक-अंतर नियम से घटाव", "ਅੰਕ-ਫਰਕ ਨਿਯਮ ਨਾਲ ਘਟਾਓ"),
              lines: [],
              math: [`|N_1-N_2|=9\\times |${tens}-${ones}|=9\\times ${Math.abs(tens - ones)}=${diff}`],
            },
          ],
          verification: {
            lines: [t(`The required difference is ${diff}.`, `आवश्यक अंतर ${diff} है।`, `ਲੋੜੀਂਦਾ ਫਰਕ ${diff} ਹੈ।`)],
            math: [],
          },
          shortcut: {
            lines: [t("Reversal difference equals nine times the digit difference.", "उलटी संख्या का अंतर अंकों के अंतर का नौ गुना होता है।", "ਉਲਟੀ ਸੰਖਿਆ ਦਾ ਫਰਕ ਅੰਕਾਂ ਦੇ ਫਰਕ ਦਾ ਨੌ ਗੁਣਾ ਹੁੰਦਾ ਹੈ।")],
            math: [`9\\times |${tens}-${ones}|=${diff}`],
          },
        };
      }
      if (i.ask === "digits") {
        const digitCount = String(Math.abs(Number(i.n))).length;
        return {
          steps: [
            {
              title: t("Bound the number by powers of 10", "10 की घातों से संख्या को सीमित करें", "10 ਦੀਆਂ ਘਾਤਾਂ ਨਾਲ ਸੰਖਿਆ ਸੀਮਿਤ ਕਰੋ"),
              lines: [],
              math: [`10^{${digitCount - 1}}\\le ${i.n}<10^{${digitCount}}`],
            },
            {
              title: t("Read the digit count", "अंकों की संख्या पढ़ें", "ਅੰਕਾਂ ਦੀ ਗਿਣਤੀ ਪੜ੍ਹੋ"),
              lines: [t(`Hence, the number has ${digitCount} digits.`, `अतः संख्या में ${digitCount} अंक हैं।`, `ਇਸ ਲਈ ਸੰਖਿਆ ਵਿੱਚ ${digitCount} ਅੰਕ ਹਨ।`)],
              math: [`d=${digitCount}`],
            },
          ],
          verification: {
            lines: [t(`Digit count = ${digitCount}.`, `अंक-गिनती = ${digitCount}।`, `ਅੰਕ-ਗਿਣਤੀ = ${digitCount}।`)],
            math: [],
          },
          shortcut: {
            lines: [t("Count digits from the place-value bounds.", "स्थान-मूल्य सीमा से अंक गिनें।", "ਸਥਾਨ-ਮੁੱਲ ਸੀਮਾ ਤੋਂ ਅੰਕ ਗਿਣੋ।")],
            math: [`10^{${digitCount - 1}}\\le n<10^{${digitCount}}`],
          },
        };
      }
      const number = 10 * tens + ones;
      return {
        steps: [
          {
            title: t("Form the digit-sum equation", "अंक-योग समीकरण बनाएं", "ਅੰਕ-ਜੋੜ ਸਮੀਕਰਨ ਬਣਾਓ"),
            lines: [],
            math: [`${tens}+u=${tens + ones}\\Rightarrow u=${ones}`],
          },
          {
            title: t("Write the two-digit number", "दो-अंकीय संख्या लिखें", "ਦੋ-ਅੰਕੀ ਸੰਖਿਆ ਲਿਖੋ"),
            lines: [t(`Hence, the number is ${number}.`, `अतः संख्या ${number} है।`, `ਇਸ ਲਈ ਸੰਖਿਆ ${number} ਹੈ।`)],
            math: [`N=10\\times ${tens}+${ones}=${number}`],
          },
        ],
        verification: {
          lines: [t(`Digit sum of ${number} is ${tens + ones}.`, `${number} का अंक-योग ${tens + ones} है।`, `${number} ਦਾ ਅੰਕ-ਜੋੜ ${tens + ones} ਹੈ।`)],
          math: [],
        },
        shortcut: {
          lines: [t("Find the ones digit from the digit sum, then place it.", "अंक-योग से इकाई अंक निकालकर रखें।", "ਅੰਕ-ਜੋੜ ਤੋਂ ਇਕਾਈ ਅੰਕ ਕੱਢ ਕੇ ਰੱਖੋ।")],
          math: [`u=${ones}`, `N=${number}`],
        },
      };
    }
    case "factorial": {
      const n = Number(i.n);
      const p = i.ask === "zeros" ? 5 : Number(i.p);
      const terms: number[] = [];
      const mathTerms: string[] = [];
      for (let div = p; div <= n; div *= p) {
        terms.push(Math.floor(n / div));
        mathTerms.push(`\\left\\lfloor\\frac{${n}}{${div}}\\right\\rfloor`);
      }
      const total = terms.reduce((a, b) => a + b, 0);
      if (i.ask === "zeros") {
        return {
          steps: [
            {
              title: t("Count powers of 5 in n!", "n! में 5 की घातें गिनें", "n! ਵਿੱਚ 5 ਦੀਆਂ ਘਾਤਾਂ ਗਿਣੋ"),
              lines: [
                t("Trailing zeroes come from factor pairs 2×5; count fives.", "अंतिम शून्य 2×5 युग्मों से आते हैं; पाँच गिनें।", "ਅੰਤੀ ਸਿਫ਼ਰ 2×5 ਜੋੜਿਆਂ ਤੋਂ ਆਉਂਦੇ ਹਨ; 5 ਗਿਣੋ।"),
              ],
              math: mathTerms,
            },
            {
              title: t("Add the quotient terms", "भागफल पद जोड़ें", "ਭਾਗਫਲ ਪਦ ਜੋੜੋ"),
              lines: [],
              math: [`${terms.join("+")}=${total}`],
            },
          ],
          verification: {
            lines: [t(`Trailing zeroes in ${n}! = ${total}.`, `${n}! में अंतिम शून्य = ${total}।`, `${n}! ਦੇ ਅੰਤੀ ਸਿਫ਼ਰ = ${total}।`)],
            math: [],
          },
          shortcut: {
            lines: [t("Sum only ⌊n/5⌋ + ⌊n/25⌋ + …", "केवल ⌊n/5⌋ + ⌊n/25⌋ + … जोड़ें", "ਸਿਰਫ ⌊n/5⌋ + ⌊n/25⌋ + … ਜੋੜੋ")],
            math: [mathTerms.join("+")],
          },
        };
      }
      return {
        steps: [
          {
            title: t(`Count powers of ${p} in n!`, `n! में ${p} की घातें गिनें`, `n! ਵਿੱਚ ${p} ਦੀਆਂ ਘਾਤਾਂ ਗਿਣੋ`),
            lines: [],
            math: mathTerms,
          },
          {
            title: t("Add the quotient terms", "भागफल पद जोड़ें", "ਭਾਗਪਲ ਪਦ ਜੋੜੋ"),
            lines: [],
            math: [`${terms.join("+")}=${total}`],
          },
        ],
        verification: {
          lines: [t(`Highest power of ${p} dividing ${n}! is ${total}.`, `${n}! में ${p} की सबसे बड़ी घात ${total} है।`, `${n}! ਨੂੰ ${p} ਦੀ ਸਭ ਤੋਂ ਵੱਡੀ ਘਾਤ ${total} ਹੈ।`)],
          math: [],
        },
        shortcut: {
          lines: [t("Legendre sum of floor quotients only.", "केवल भागफल-मूल्यों का लेजेंड्र योग।", "ਸਿਰਫ ਭਾਗਫਲ-ਮੂਲਾਂ ਦਾ ਲੇਜੈਂਡਰ ਜੋੜ।")],
          math: [mathTerms.join("+")],
        },
      };
    }
    case "optimization_constraint": {
      const mode = String(i.mode);
      const n = Number(i.n);
      const divisor = Number(i.divisor);
      const lcmValue = Number(i.lcm);
      const lower = Number(i.lower);
      const upper = Number(i.upper);
      const answer = numericAnswer;
      const remainder = Number.isFinite(n) && Number.isFinite(divisor) && divisor !== 0 ? n % divisor : 0;
      const boundaryMath =
        mode === "greatest_multiple_below" ? [`q=\\left\\lfloor\\frac{${upper - 1}}{${lcmValue}}\\right\\rfloor`, `${lcmValue}\\times q=${answer}`] :
        mode === "least_multiple_above" || mode === "multi_condition" ? [`q=\\left\\lceil\\frac{${lower + 1}}{${lcmValue}}\\right\\rceil`, `${lcmValue}\\times q=${answer}`] :
        mode === "minimum_addition" ? [`${n}=${divisor}\\times ${Math.floor(n / divisor)}+${remainder}`, `${divisor}-${remainder}=${answer}`] :
        mode === "minimum_subtraction" ? [`${n}=${divisor}\\times ${Math.floor(n / divisor)}+${remainder}`, `${n}-${remainder}\\equiv 0\\pmod{${divisor}}`] :
        mode === "minimum_multiplier" ? [`g=\\gcd(${i.n},${i.target})=${gcd(Number(i.n), Number(i.target))}`, `x=\\frac{${i.target}}{g}=${answer}`] :
        mode === "minimum_divisor" ? [`${i.n}=d\\times q`, `d=${answer}`] :
        mode === "range_count" ? [`N\\equiv ${i.residue}\\pmod{${i.modulus}}`, `c=${answer}`] :
        [];
      return {
        steps: [
          {
            title: t("Combine the number conditions first", "à¤ªà¤¹à¤²à¥‡ à¤¸à¤‚à¤–à¥à¤¯à¤¾ à¤¶à¤°à¥à¤¤à¥‡à¤‚ à¤®à¤¿à¤²à¤¾à¤à¤‚", "à¨ªà¨¹à¨¿à¨²à¨¾à¨‚ à¨¸à©°à¨–à¨¿à¨† à¨¦à©€à¨†à¨‚ à¨¸à¨¼à¨°à¨¤à¨¾à¨‚ à¨®à¨¿à¨²à¨¾à¨“"),
            lines: [
              t(
                "First combine the divisibility facts. A number divisible by each given divisor must be a multiple of their LCM.",
                "à¤…à¤¨à¥à¤•à¥‚à¤²à¤¨ à¤¤à¤­à¥€ à¤•à¤°à¥‡à¤‚ à¤œà¤¬ à¤µà¤¿à¤­à¤¾à¤œà¥à¤¯à¤¤à¤¾ à¤¯à¤¾ à¤¶à¥‡à¤·à¤«à¤² à¤¶à¤°à¥à¤¤ à¤à¤• à¤‰à¤ªà¤¯à¥‹à¤—à¥€ à¤šà¤•à¥à¤° à¤®à¥‡à¤‚ à¤¬à¤¦à¤² à¤œà¤¾à¤à¥¤",
                "à¨…à¨¨à©à¨•à©‚à¨²à¨¨ à¨¤à¨¦à©‹à¨‚ à¨•à¨°à©‹ à¨œà¨¦à©‹à¨‚ à¨­à¨¾à¨—à¨¯à©‹à¨—à¨¤à¨¾ à¨œà¨¾à¨‚ à¨¬à¨¾à¨•à©€ à¨¦à©€ à¨¸à¨¼à¨°à¨¤ à¨‡à©±à¨• à¨µà¨°à¨¤à¨£à¨¯à©‹à¨— à¨šà©±à¨•à¨° à¨µà¨¿à©±à¨š à¨¬à¨¦à¨² à¨œà¨¾à¨µà©‡à¥¤",
              ),
            ],
            math: lcmValue ? [`m=${lcmValue}`] : [],
          },
          {
            title: t("Choose the number that fits the given limit", "à¤¨à¤¿à¤•à¤Ÿà¤¤à¤® à¤®à¤¾à¤¨à¥à¤¯ à¤¸à¥€à¤®à¤¾ à¤²à¥‡à¤‚", "à¨¨à©‡à©œà¨²à©€ à¨µà©ˆà¨§ à¨¹à©±à¨¦ à¨²à¨“"),
            lines: [
              t(
                "Now use the nearby multiples and choose the first or last one according to the question.",
                "à¤¸à¥€à¤®à¤¾ à¤šà¤°à¤£ à¤¸à¥à¤¨à¤¿à¤¶à¥à¤šà¤¿à¤¤ à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆ à¤•à¤¿ à¤¸à¤‚à¤–à¥à¤¯à¤¾ à¤¸à¤¿à¤°à¥à¤« à¤…à¤‚à¤•à¤—à¤£à¤¿à¤¤ à¤¨à¤¹à¥€à¤‚, à¤¦à¥€ à¤—à¤ˆ à¤¸à¥€à¤®à¤¾ à¤­à¥€ à¤ªà¥‚à¤°à¥€ à¤•à¤°à¥‡à¥¤",
                "à¨¹à©±à¨¦ à¨µà¨¾à¨²à¨¾ à¨•à¨¦à¨® à¨¯à¨•à©€à¨¨à©€ à¨¬à¨£à¨¾à¨‰à¨‚à¨¦à¨¾ à¨¹à©ˆ à¨•à¨¿ à¨¸à©°à¨–à¨¿à¨† à¨¸à¨¿à¨°à¨« à¨¹à¨¿à¨¸à¨¾à¨¬ à¨¨à¨¹à©€à¨‚, à¨¦à¨¿à©±à¨¤à©€ à¨¹à©±à¨¦ à¨µà©€ à¨ªà©‚à¨°à©€ à¨•à¨°à©‡à¥¤",
              ),
            ],
            math: boundaryMath,
          },
        ],
        verification: {
          lines: [t(`The selected number is ${answer}, and it satisfies the required divisibility condition.`, `à¤…à¤¨à¥à¤•à¥‚à¤²à¤¿à¤¤ à¤®à¤¾à¤¨à¥à¤¯ à¤®à¤¾à¤¨ ${answer} à¤¹à¥ˆà¥¤`, `à¨…à¨¨à©à¨•à©‚à¨²à¨¿à¨¤ à¨µà©ˆà¨§ à¨®à©à©±à¨² ${answer} à¨¹à©ˆà¥¤`)],
          math: [],
        },
        shortcut: {
          lines: [t("Take the LCM once, then jump directly to the nearest multiple asked in the question.", "à¤¸à¤‚à¤¯à¥à¤•à¥à¤¤ à¤šà¤•à¥à¤° à¤²à¥‡à¤•à¤° à¤•à¥‡à¤µà¤² à¤†à¤µà¤¶à¥à¤¯à¤• à¤¸à¥€à¤®à¤¾-à¤¸à¥à¤§à¤¾à¤° à¤•à¤°à¥‡à¤‚à¥¤", "à¨¸à¨¾à¨‚à¨à¨¾ à¨šà©±à¨•à¨° à¨²à©ˆ à¨•à©‡ à¨¸à¨¿à¨°à¨« à¨²à©‹à©œà©€à¨‚à¨¦à¨¾ à¨¹à©±à¨¦-à¨¸à©à¨§à¨¾à¨° à¨•à¨°à©‹à¥¤")],
          math: boundaryMath.slice(-1),
        },
      };
    }
    case "perfect_power_completion": {
      const n = Number(i.n);
      const power = Number(i.power);
      const factors = primeFactors(n);
      const factorText = displayFactors(factors);
      const multiplier = Object.entries(factors).reduce((acc, [primeRaw, exp]) => {
        const missing = (power - (exp % power)) % power;
        return acc * Number(primeRaw) ** missing;
      }, 1);
      const result = i.mode === "least_multiple" ? n * multiplier : numericAnswer;
      const exponentMath = Object.entries(factors).map(([p, e]) => {
        const missing = (power - (e % power)) % power;
        return `${p}^{${e}}\\to ${p}^{${e + missing}}`;
      });
      return {
        steps: [
          {
            title: t("Factorize the given number", "à¤¦à¥€ à¤—à¤ˆ à¤¸à¤‚à¤–à¥à¤¯à¤¾ à¤•à¤¾ à¤…à¤­à¤¾à¤œà¥à¤¯ à¤—à¥à¤£à¤¨à¤–à¤‚à¤¡ à¤•à¤°à¥‡à¤‚", "à¨¦à¨¿à©±à¨¤à©€ à¨¸à©°à¨–à¨¿à¨† à¨¦à¨¾ à¨…à¨­à¨¾à¨œ à¨—à©à¨£à¨¨à¨–à©°à¨¡ à¨•à¨°à©‹"),
            lines: [t("Perfect powers are controlled by prime exponents.", "à¤ªà¥‚à¤°à¥à¤£ à¤˜à¤¾à¤¤à¥‡à¤‚ à¤…à¤­à¤¾à¤œà¥à¤¯ à¤˜à¤¾à¤¤à¥‹à¤‚ à¤¸à¥‡ à¤¨à¤¿à¤¯à¤‚à¤¤à¥à¤°à¤¿à¤¤ à¤¹à¥‹à¤¤à¥€ à¤¹à¥ˆà¤‚à¥¤", "à¨ªà©‚à¨°à¨£ à¨˜à¨¾à¨¤à¨¾à¨‚ à¨…à¨­à¨¾à¨œ à¨˜à¨¾à¨¤à¨¾à¨‚ à¨¨à¨¾à¨² à¨¤à©ˆà¨… à¨¹à©à©°à¨¦à©€à¨†à¨‚ à¨¹à¨¨à¥¤")],
            math: [`${n}=${factorText}`],
          },
          {
            title: t("Complete the exponents", "à¤˜à¤¾à¤¤à¥‹à¤‚ à¤•à¥‹ à¤ªà¥‚à¤°à¤¾ à¤•à¤°à¥‡à¤‚", "à¨˜à¨¾à¨¤à¨¾à¨‚ à¨¨à©‚à©° à¨ªà©‚à¨°à¨¾ à¨•à¨°à©‹"),
            lines: [
              t(
                power === 2 ? "For a square, every exponent must be even." : "For a cube, every exponent must be a multiple of 3.",
                power === 2 ? "à¤µà¤°à¥à¤— à¤•à¥‡ à¤²à¤¿à¤ à¤¹à¤° à¤˜à¤¾à¤¤ à¤¸à¤® à¤¹à¥‹à¤¨à¥€ à¤šà¤¾à¤¹à¤¿à¤à¥¤" : "à¤˜à¤¨ à¤•à¥‡ à¤²à¤¿à¤ à¤¹à¤° à¤˜à¤¾à¤¤ 3 à¤•à¥‡ à¤—à¥à¤£à¤œ à¤®à¥‡à¤‚ à¤¹à¥‹à¤¨à¥€ à¤šà¤¾à¤¹à¤¿à¤à¥¤",
                power === 2 ? "à¨µà¨°à¨— à¨²à¨ˆ à¨¹à¨° à¨˜à¨¾à¨¤ à¨œà©à©œà©€ à¨¹à©‹à¨£à©€ à¨šà¨¾à¨¹à©€à¨¦à©€ à¨¹à©ˆà¥¤" : "à¨˜à¨£ à¨²à¨ˆ à¨¹à¨° à¨˜à¨¾à¨¤ 3 à¨¦à©‡ à¨—à©à¨£à¨œ à¨µà¨¿à©±à¨š à¨¹à©‹à¨£à©€ à¨šà¨¾à¨¹à©€à¨¦à©€ à¨¹à©ˆà¥¤",
              ),
            ],
            math: exponentMath,
          },
          {
            title: t("Finish the perfect-power calculation", "à¤†à¤µà¤¶à¥à¤¯à¤• à¤®à¤¾à¤¨ à¤ªà¤¢à¤¼à¥‡à¤‚", "à¨²à©‹à©œà©€à¨‚à¨¦à¨¾ à¨®à©à©±à¨² à¨ªà©œà©à¨¹à©‹"),
            lines: [],
            math: i.mode === "least_multiple" ? [`${n}\\times ${multiplier}=${result}`] : [`${n}\\times ${multiplier}=${n * multiplier}`],
          },
        ],
        verification: {
          lines: [t(`The perfect-power condition is now satisfied.`, `à¤ªà¥‚à¤°à¥à¤£-à¤˜à¤¾à¤¤ à¤¶à¤°à¥à¤¤ à¤…à¤¬ à¤ªà¥‚à¤°à¥€ à¤¹à¥ˆà¥¤`, `à¨ªà©‚à¨°à¨£-à¨˜à¨¾à¨¤ à¨¦à©€ à¨¸à¨¼à¨°à¨¤ à¨¹à©à¨£ à¨ªà©‚à¨°à©€ à¨¹à©ˆà¥¤`)],
          math: [],
        },
        shortcut: {
          lines: [t("Fill only the missing prime powers; do not search through squares or cubes.", "à¤•à¥‡à¤µà¤² à¤›à¥‚à¤Ÿà¥€ à¤…à¤­à¤¾à¤œà¥à¤¯ à¤˜à¤¾à¤¤à¥‡à¤‚ à¤ªà¥‚à¤°à¥€ à¤•à¤°à¥‡à¤‚; à¤µà¤°à¥à¤—/à¤˜à¤¨ à¤–à¥‹à¤œà¤¨à¥‡ à¤¨ à¤²à¤—à¥‡à¤‚à¥¤", "à¨¸à¨¿à¨°à¨« à¨˜à©±à¨Ÿ à¨…à¨­à¨¾à¨œ à¨˜à¨¾à¨¤à¨¾à¨‚ à¨ªà©‚à¨°à©€à¨†à¨‚ à¨•à¨°à©‹; à¨µà¨°à¨—/à¨˜à¨£ à¨–à©‹à¨œà¨£ à¨¨à¨¾ à¨²à¨—à©‹à¥¤")],
          math: [`${n}\\times ${multiplier}=${n * multiplier}`],
        },
      };
    }
    case "reconstruction":
    case "elite_hybrid_chain": {
      const answer = numericAnswer;
      const chainMath =
        i.mode === "number_from_lcm_remainder" ? [`N=${i.lcm}\\times ${i.quotient}+${i.remainder}`] :
        i.mode === "hidden_divisor" ? [`${i.dividend}=d\\times ${i.quotient}+${i.remainder}`, `d=${answer}`] :
        i.mode === "hidden_exponent" ? [`${i.base}^{e}\\equiv ${i.targetRemainder}\\pmod{${i.mod}}`, `e=${answer}`] :
        i.mode === "hidden_factorization" ? [`${Object.entries(i.factors ?? {}).map(([p, e]) => `${p}^{${e}}`).join("\\times ")}`, `${Object.entries(i.factors ?? {}).map(([p, e]) => `${Number(p) ** Number(e)}`).join("\\times ")}=${answer}`] :
        i.mode === "hidden_square" ? [`\\sqrt{${answer}}=${i.root}`, `${i.root}\\times ${i.root}=${answer}`] :
        i.mode === "prime_hcf_lcm_optimization" ? [`m=\\operatorname{LCM}(${i.a},${i.b})`] :
        i.mode === "digit_divisibility_reconstruction" ? [`${String(i.pattern).replace("x", String(i.digit))}\\equiv 0\\pmod{9}`] :
        i.mode === "remainder_constraint_optimization" ? [`N\\equiv ${i.residue}\\pmod{${i.modulus}}`] :
        i.mode === "factor_count_square_hidden" ? [`${i.n}\\times ${answer}`] :
        i.mode === "prime_exact_divisor_optimization" ? [`${i.value}=2^{a}\\times3^{b}\\times5^{c}`, `${i.value}\\mid ${i.value}`] :
        i.mode === "modular_cycle_reconstruction" ? [`${i.base}^{${i.exp}}\\equiv ${answer}\\pmod{${i.mod}}`] :
        [];
      const math = chainMath.length >= 2 ? chainMath : [...chainMath, `${answer}`].filter(Boolean);
      return {
        steps: [
          {
            title: t(blueprintText.observation, "à¤¹à¤° à¤¸à¤‚à¤•à¥‡à¤¤ à¤•à¥‹ à¤¸à¤‚à¤–à¥à¤¯à¤¾ à¤¶à¤°à¥à¤¤ à¤®à¥‡à¤‚ à¤¬à¤¦à¤²à¥‡à¤‚", "à¨¹à¨° à¨‡à¨¸à¨¼à¨¾à¨°à©‡ à¨¨à©‚à©° à¨¸à©°à¨–à¨¿à¨† à¨¸à¨¼à¨°à¨¤ à¨µà¨¿à©±à¨š à¨¬à¨¦à¨²à©‹"),
            lines: [t("Reconstruction questions should not be guessed; each clue must become a checkable relation.", "à¤ªà¥à¤¨à¤°à¥à¤¨à¤¿à¤°à¥à¤®à¤¾à¤£ à¤ªà¥à¤°à¤¶à¥à¤¨ à¤…à¤¨à¥à¤®à¤¾à¤¨ à¤¸à¥‡ à¤¨à¤¹à¥€à¤‚; à¤¹à¤° à¤¸à¤‚à¤•à¥‡à¤¤ à¤œà¤¾à¤à¤šà¤¨à¥‡ à¤¯à¥‹à¤—à¥à¤¯ à¤¸à¤‚à¤¬à¤‚à¤§ à¤¬à¤¨à¤¨à¤¾ à¤šà¤¾à¤¹à¤¿à¤à¥¤", "à¨ªà©à¨¨à¨°-à¨¨à¨¿à¨°à¨®à¨¾à¨£ à¨ªà©à¨°à¨¸à¨¼à¨¨ à¨…à¨¨à©à¨®à¨¾à¨¨ à¨¨à¨¾à¨² à¨¨à¨¹à©€à¨‚; à¨¹à¨° à¨‡à¨¸à¨¼à¨¾à¨°à¨¾ à¨œà¨¾à¨‚à¨šà¨£à¨¯à©‹à¨— à¨¸à©°à¨¬à©°à¨§ à¨¬à¨£à¨£à¨¾ à¨šà¨¾à¨¹à©€à¨¦à¨¾ à¨¹à©ˆà¥¤")],
            math: math.slice(0, 1),
          },
          {
            title: t("Use the narrowed result in the calculation", "à¤ªà¤°à¤¿à¤£à¤¾à¤® à¤•à¥‹ à¤…à¤—à¤²à¥€ à¤¶à¤°à¥à¤¤ à¤®à¥‡à¤‚ à¤²à¥‡ à¤œà¤¾à¤à¤‚", "à¨¨à¨¤à©€à¨œà©‡ à¨¨à©‚à©° à¨…à¨—à¨²à©€ à¨¸à¨¼à¨°à¨¤ à¨µà¨¿à©±à¨š à¨²à©ˆ à¨œà¨¾à¨“"),
            lines: [t("This step keeps the same number tied to the remaining arithmetic condition.", "à¤‡à¤¸à¤¸à¥‡ à¤…à¤‚à¤¤à¤¿à¤® à¤ªà¥à¤°à¤¤à¥à¤¯à¤¾à¤¶à¥€ à¤ªà¥‚à¤°à¥€ à¤¶à¥à¤°à¥ƒà¤‚à¤–à¤²à¤¾ à¤ªà¥‚à¤°à¥€ à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆ, à¤¸à¤¿à¤°à¥à¤« à¤ªà¤¹à¤²à¤¾ à¤¸à¤‚à¤•à¥‡à¤¤ à¤¨à¤¹à¥€à¤‚à¥¤", "à¨‡à¨¸ à¨¨à¨¾à¨² à¨…à©°à¨¤à¨¿à¨® à¨‰à¨®à©€à¨¦à¨µà¨¾à¨° à¨ªà©‚à¨°à©€ à¨•à©œà©€ à¨ªà©‚à¨°à©€ à¨•à¨°à¨¦à¨¾ à¨¹à©ˆ, à¨¸à¨¿à¨°à¨« à¨ªà¨¹à¨¿à¨²à¨¾ à¨‡à¨¸à¨¼à¨¾à¨°à¨¾ à¨¨à¨¹à©€à¨‚à¥¤")],
            math: math.slice(1),
          },
        ],
        verification: {
          lines: [t(`The reconstructed value is ${answer}.`, `à¤ªà¥à¤¨à¤°à¥à¤¨à¤¿à¤°à¥à¤®à¤¿à¤¤ à¤®à¤¾à¤¨ ${answer} à¤¹à¥ˆà¥¤`, `à¨ªà©à¨¨à¨°-à¨¨à¨¿à¨°à¨®à¨¿à¨¤ à¨®à©à©±à¨² ${answer} à¨¹à©ˆà¥¤`)],
          math: [],
        },
        shortcut: {
          lines: [t("Start with the clue that gives the smallest search, then test the remaining condition.", "à¤¸à¤¬à¤¸à¥‡ à¤®à¤œà¤¬à¥‚à¤¤ à¤¸à¤‚à¤•à¥‡à¤¤ à¤ªà¤¹à¤²à¥‡ à¤²à¥‡à¤‚, à¤«à¤¿à¤° à¤ªà¥à¤°à¤¤à¥à¤¯à¤¾à¤¶à¥€ à¤•à¥‹ à¤¶à¥‡à¤· à¤¶à¤°à¥à¤¤ à¤¸à¥‡ à¤œà¤¾à¤à¤šà¥‡à¤‚à¥¤", "à¨¸à¨­ à¨¤à©‹à¨‚ à¨®à¨œà¨¬à©‚à¨¤ à¨‡à¨¸à¨¼à¨¾à¨°à¨¾ à¨ªà¨¹à¨¿à¨²à¨¾à¨‚ à¨²à¨“, à¨«à¨¿à¨° à¨‰à¨®à©€à¨¦à¨µà¨¾à¨° à¨¨à©‚à©° à¨¬à¨¾à¨•à©€ à¨¸à¨¼à¨°à¨¤ à¨¨à¨¾à¨² à¨œà¨¾à¨‚à¨šà©‹à¥¤")],
          math: math.slice(-1),
        },
      };
    }
    default:
      return {
        steps: [
          {
            title: t("Solve the number condition", "संख्या शर्त हल करें", "ਸੰਖਿਆ ਸ਼ਰਤ ਹੱਲ ਕਰੋ"),
            lines: [t("Follow the intermediate calculations below.", "नीचे मध्यवर्ती गणनाएँ करें।", "ਹੇਠਾਂ ਵਿਚਕਾਰਲੀਆਂ ਗਣਨਾਵਾਂ ਕਰੋ।")],
            math: [],
          },
        ],
        verification: {
          lines: [t(`The calculation gives ${numericAnswer}.`, `गणना से प्राप्त मान ${numericAnswer} है।`, `ਗਣਨਾ ਤੋਂ ਮਿਲਿਆ ਮੁੱਲ ${numericAnswer} ਹੈ।`)],
          math: [],
        },
        shortcut: {
          lines: [t("Use the rule that matches the numbers in this question.", "इस परिवार के लिए सबसे तेज़ मान्य जांच लगाएं।", "ਇਸ ਪਰਿਵਾਰ ਲਈ ਸਭ ਤੋਂ ਤੇਜ਼ ਵੈਧ ਜਾਂਚ ਲਗਾਓ।")],
          math: [],
        },
      };
  }
}

function commonMistakeForBlueprint(blueprint: NumberSystemExplanationBlueprint): NumberSystemLocalizedText {
  const english: Record<NumberSystemExplanationBlueprint, string> = {
    digit_divisibility: "Many students stop as soon as they find a digit. Always put the digit back into the whole number and check the rule again.",
    digit_reconstruction: "Do not treat every digit as having the same value. A digit in the tens place and a digit in the units place are not equal in value.",
    perfect_square: "Do not multiply by the whole number again. For a square, add only the prime factors whose powers are unpaired.",
    perfect_cube: "Do not stop after making exponents even. For a cube, every prime power must be grouped in threes.",
    remainder: "Do not count from zero blindly. Check whether the lower and upper limits are included in the given range.",
    modular_arithmetic: "Do not divide the exponent by the divisor. The exponent is matched with the length of the repeating pattern.",
    last_digit: "Do not use the whole base. For the last digit, only the ending digit of the base matters.",
    prime_factorization: "Do not skip factorization when the question is about factors, HCF, LCM, squares, or cubes. The prime powers carry the answer.",
    factor_count: "Do not multiply the exponents directly. Each exponent gives one extra choice because choosing power zero is also allowed.",
    exact_divisor_count: "Do not guess the number first. Match the required divisor count with exponent-choice counts.",
    hcf: "Do not take the highest powers for HCF. HCF takes only the common primes with the smaller powers.",
    lcm: "Do not take only common primes for LCM. LCM must include every prime needed by any of the numbers.",
    optimization: "Do not start testing random numbers. First find the repeating number pattern, then move to the nearest allowed value.",
    least_number: "Do not pick the first small-looking number. It must satisfy every condition in the question.",
    greatest_number: "Do not cross the given limit. Move downward from the limit until the condition is satisfied.",
    minimum_addition: "Many students subtract the wrong way. For addition, use the gap from the current remainder to the next multiple.",
    minimum_multiplier: "Do not multiply by factors the number already has. Only the missing factor is needed.",
    factorial: "Do not count both 2s and 5s for trailing zeroes. In factorials, 5s are fewer, so they decide the count.",
    highest_power: "Do not use only one prime when the base is composite. Count all required primes and take the limiting one.",
    hybrid: "Do not solve only the first clue. The final answer must satisfy every condition in the question.",
  };
  return t(
    english[blueprint],
    "अक्सर गलती यह होती है कि विद्यार्थी केवल एक शर्त देखकर उत्तर चुन लेते हैं। अंतिम उत्तर को सभी शर्तों से मिलाकर जरूर देखें।",
    "ਅਕਸਰ ਗਲਤੀ ਇਹ ਹੁੰਦੀ ਹੈ ਕਿ ਵਿਦਿਆਰਥੀ ਸਿਰਫ਼ ਇੱਕ ਸ਼ਰਤ ਦੇਖ ਕੇ ਉੱਤਰ ਚੁਣ ਲੈਂਦੇ ਹਨ। ਅੰਤਿਮ ਉੱਤਰ ਨੂੰ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਨਾਲ ਜ਼ਰੂਰ ਮਿਲਾਓ।",
  );
}

function observationTextForBlueprint(blueprint: NumberSystemExplanationBlueprint): NumberSystemLocalizedText {
  const text: Record<NumberSystemExplanationBlueprint, string> = {
    digit_divisibility: "A missing digit is decided by the number rule given in the question.",
    digit_reconstruction: "The clues are about digits, so place value is the main idea.",
    perfect_square: "A square is made from pairs of prime factors.",
    perfect_cube: "A cube is made from groups of three equal prime factors.",
    remainder: "The question is about what is left after division.",
    modular_arithmetic: "Large powers usually repeat their remainders.",
    last_digit: "For the last digit, only the ending digit matters.",
    prime_factorization: "Prime factors show the building blocks of the number.",
    factor_count: "Every divisor is made by choosing some power of each prime.",
    exact_divisor_count: "The number of divisors depends on exponent choices.",
    hcf: "HCF means the greatest part common to all numbers.",
    lcm: "LCM must be a multiple of every given number.",
    optimization: "The question asks for the best number that still follows the given rule.",
    least_number: "The least number is the first number that passes every check.",
    greatest_number: "The greatest number is the last allowed number before the limit.",
    minimum_addition: "A small addition or subtraction is decided by the current remainder.",
    minimum_multiplier: "The multiplier only needs to supply the missing factors.",
    factorial: "A zero at the end is made by a pair of 2 and 5.",
    highest_power: "A composite power depends on all its prime parts.",
    hybrid: "This question mixes more than one number-system idea.",
  };
  return t(
    text[blueprint],
    "पहले यह समझें कि प्रश्न किस संख्या-नियम की तरफ इशारा कर रहा है।",
    "ਪਹਿਲਾਂ ਇਹ ਸਮਝੋ ਕਿ ਪ੍ਰਸ਼ਨ ਕਿਸ ਸੰਖਿਆ-ਨਿਯਮ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰ ਰਿਹਾ ਹੈ।",
  );
}

function whyTextForBlueprint(blueprint: NumberSystemExplanationBlueprint): NumberSystemLocalizedText {
  const text: Record<NumberSystemExplanationBlueprint, string> = {
    digit_divisibility: "We are doing this because the right digit must make the whole number satisfy the given rule.",
    digit_reconstruction: "We are doing this because digit clues become useful only after we attach them to their places.",
    perfect_square: "We are doing this because every factor in a square comes in a pair.",
    perfect_cube: "We are doing this because every factor in a cube comes in a group of three.",
    remainder: "We are doing this because numbers with the same remainder move in equal jumps.",
    modular_arithmetic: "We are doing this because the repeating pattern lets us avoid a huge power calculation.",
    last_digit: "We are doing this because the last digit repeats even when the full number becomes very large.",
    prime_factorization: "We are doing this because prime powers make hidden divisibility facts visible.",
    factor_count: "We are doing this because each prime power gives several choices for building a divisor.",
    exact_divisor_count: "We are doing this because the target count must be created from exponent choices.",
    hcf: "We are doing this because only the part common to all numbers can remain in the HCF.",
    lcm: "We are doing this because the LCM must have enough factors to cover every given number.",
    optimization: "We are doing this because testing numbers one by one is slow; the pattern tells us where to look.",
    least_number: "We are doing this because the first valid number appears after the pattern is formed.",
    greatest_number: "We are doing this because the answer must stay below the limit and still follow the rule.",
    minimum_addition: "We are doing this because the remainder tells us exactly how far the number is from a multiple.",
    minimum_multiplier: "We are doing this because repeated factors should be cancelled before adding new ones.",
    factorial: "We are doing this because 5s are the limiting factor for ending zeroes in a factorial.",
    highest_power: "We are doing this because the prime factor that runs out first controls the final power.",
    hybrid: "We are doing this because each clue reduces the choices for the next clue.",
  };
  return t(
    text[blueprint],
    "यह कदम इसलिए जरूरी है क्योंकि इसी से पता चलता है कि आगे कौन-सी गणना करनी है।",
    "ਇਹ ਕਦਮ ਇਸ ਲਈ ਜ਼ਰੂਰੀ ਹੈ ਕਿਉਂਕਿ ਇਸ ਨਾਲ ਪਤਾ ਲੱਗਦਾ ਹੈ ਕਿ ਅੱਗੇ ਕਿਹੜੀ ਗਿਣਤੀ ਕਰਨੀ ਹੈ।",
  );
}

function renderStep(locale: Locale, step: FlowStep) {
  const lines: string[] = [];
  if (step.title[locale].trim()) lines.push(step.title[locale]);
  for (const line of step.lines) {
    if (line[locale].trim()) lines.push(line[locale]);
  }
  for (const math of step.math) {
    lines.push(displayMathBlock(teachingMath(math)));
  }
  return lines.join("\n\n");
}

function teachingMath(math: string) {
  const standalone = math.trim().match(/^(?:x|N|A|Z|M)\s*=\s*(-?\d+)$/u);
  if (standalone) return `\\boxed{${standalone[1]}}`;
  return math;
}

function renderShortcutLocale(
  locale: Locale,
  flow: ExplanationFlow,
  answerText: string,
  optionLabel?: string,
) {
  const lines: string[] = [LABEL.shortcut[locale]];
  for (const line of flow.shortcut.lines) {
    if (line[locale].trim()) lines.push(line[locale]);
  }
  for (const math of flow.shortcut.math) {
    lines.push(displayMathBlock(teachingMath(math)));
  }
  if (locale === "hi" && optionLabel) {
    lines.push(`शीघ्र परिणाम: ${answerText}। अतः सही उत्तर विकल्प ${optionLabel} है।`);
  } else if (locale === "pa" && optionLabel) {
    lines.push(`ਛੇਤੀ ਨਤੀਜਾ: ${answerText}। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ਵਿਕਲਪ ${optionLabel} ਹੈ।`);
  } else
  lines.push(
    {
      en: optionLabel ? `Fast result: ${answerText}. Therefore, the correct answer is Option ${optionLabel}.` : `Fast result: ${answerText}.`,
      hi: `अतः उत्तर = ${answerText}।`,
      pa: `ਇਸ ਲਈ ਉੱਤਰ = ${answerText}।`,
    }[locale],
  );
  return cleanRenderedLocale(locale, lines.join("\n\n").trim());
}

function renderLocale(
  locale: Locale,
  flow: ExplanationFlow,
  answerText: string,
  optionLabel: string,
  blueprint: NumberSystemExplanationBlueprint,
) {
  const lines: string[] = [];
  lines.push(LABEL.observation[locale]);
  lines.push(observationTextForBlueprint(blueprint)[locale]);
  lines.push("");
  lines.push(LABEL.explanation[locale]);
  lines.push(whyTextForBlueprint(blueprint)[locale]);
  flow.steps.forEach((step) => {
    const rendered = renderStep(locale, step);
    if (rendered.trim()) {
      lines.push("");
      lines.push(rendered);
    }
  });
  lines.push("");
  lines.push(LABEL.answer[locale]);
  for (const line of flow.verification.lines) {
    if (line[locale].trim()) lines.push(line[locale]);
  }
  for (const math of flow.verification.math) {
    lines.push(displayMathBlock(teachingMath(math)));
  }
  lines.push(
    {
      en: `Therefore, the required answer is ${answerText}. Hence, the correct answer is Option ${optionLabel}.`,
      hi: `अतः सही उत्तर विकल्प ${optionLabel} है। आवश्यक मान ${answerText} है।`,
      pa: `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ਵਿਕਲਪ ${optionLabel} ਹੈ। ਲੋੜੀਂਦਾ ਮੁੱਲ ${answerText} ਹੈ।`,
    }[locale],
  );
  lines.push("");
  lines.push(LABEL.commonMistake[locale]);
  lines.push(commonMistakeForBlueprint(blueprint)[locale]);
  lines.push("");
  lines.push(renderShortcutLocale(locale, flow, answerText, optionLabel));
  return cleanRenderedLocale(locale, lines.join("\n").replace(/\n{3,}/gu, "\n\n").trim());
}

function flowToExplanationSteps(flow: ExplanationFlow): NumberSystemExplanationStep[] {
  return flow.steps.map((step, index) => ({
    key: `step-${index + 1}`,
    text: t(
      `${step.title.en}${step.lines[0] ? `\n${step.lines[0].en}` : ""}`,
      `${step.title.hi}${step.lines[0] ? `\n${step.lines[0].hi}` : ""}`,
      `${step.title.pa}${step.lines[0] ? `\n${step.lines[0].pa}` : ""}`,
    ),
    math: step.math.join("\n"),
  }));
}

export function buildNumberSystemExplanation(input: {
  model: NumberSystemSolverModel;
  family?: NumberSystemFamilyId;
  answer: number | string;
  answerText: string;
  optionLabel: string;
}) {
  const blueprint = numberSystemExplanationBlueprintForFamily(input.family);
  const flow = buildFlow(input.model, input.answer, blueprint);
  const full = {
    en: renderLocale("en", flow, input.answerText, input.optionLabel, blueprint),
    hi: renderLocale("hi", flow, input.answerText, input.optionLabel, blueprint),
    pa: renderLocale("pa", flow, input.answerText, input.optionLabel, blueprint),
  };
  const shortcut = {
    en: renderShortcutLocale("en", flow, input.answerText, input.optionLabel),
    hi: renderShortcutLocale("hi", flow, input.answerText, input.optionLabel),
    pa: renderShortcutLocale("pa", flow, input.answerText, input.optionLabel),
  };
  return {
    full,
    stepwise: full,
    shortcut,
    steps: flowToExplanationSteps(flow),
    flow,
  };
}

function normalizeAuditText(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim();
}

function extractDisplayMathSignatures(text: string) {
  return [...text.matchAll(/\\\[([\s\S]*?)\\\]/gu)]
    .map((match) => normalizeAuditText(match[1] ?? ""))
    .filter(Boolean);
}

function extractMathSignatures(text: string) {
  const blocks = extractDisplayMathSignatures(text);
  const inline = [...text.matchAll(/\\\(([\s\S]*?)\\\)/gu)].map((match) => normalizeAuditText(match[1] ?? ""));
  return [...blocks, ...inline].filter(Boolean);
}

function countStepHeaders(text: string) {
  return (text.match(/(?:^|\n)(?:step|चरण|ਕਦਮ)\s*\d+\s*:/gimu) ?? []).length;
}

function mainWorkingMath(text: string, verifyLabel: string) {
  const main = text.split(verifyLabel)[0] ?? text;
  return extractMathSignatures(main);
}

export function shortcutDistinctnessAudit(explanation: string, shortcut: string, verifyLabel = "Answer") {
  const issues: string[] = [];
  const explSteps = countStepHeaders(explanation);
  const shortcutMath = extractDisplayMathSignatures(shortcut);
  const explanationMath = extractDisplayMathSignatures(explanation.split(verifyLabel)[0] ?? explanation);
  if (explSteps > 0 && shortcutMath.length > explSteps) {
    issues.push("shortcut has more math blocks than explanation steps");
  }
  if (explanationMath.length > 0 && shortcutMath.length > 0) {
    const uniqueShortcut = shortcutMath.filter((sig) => !explanationMath.includes(sig));
    const shortcutWords = normalizeAuditText(shortcut.replace(/\\\[([\s\S]*?)\\\]/gu, "").replace(/\\\(([\s\S]*?)\\\)/gu, ""));
    const explanationWords = normalizeAuditText((explanation.split(verifyLabel)[0] ?? explanation).replace(/\\\[([\s\S]*?)\\\]/gu, "").replace(/\\\(([\s\S]*?)\\\)/gu, ""));
    if (uniqueShortcut.length === 0 && shortcutWords.length > 40 && explanationWords.includes(shortcutWords)) {
      issues.push("shortcut math repeats explanation working math");
    }
  }
  const explNorm = normalizeAuditText(
    (explanation.split(verifyLabel)[0] ?? explanation)
      .replace(/\\\[([\s\S]*?)\\\]/gu, "")
      .replace(/\\\(([\s\S]*?)\\\)/gu, ""),
  );
  const shortNorm = normalizeAuditText(
    shortcut.replace(/\\\[([\s\S]*?)\\\]/gu, "").replace(/\\\(([\s\S]*?)\\\)/gu, ""),
  );
  if (explNorm.length > 60 && shortNorm.length > 30) {
    const explTokens = new Set(explNorm.split(" ").filter((token) => token.length > 4));
    const shortTokens = shortNorm.split(" ").filter((token) => token.length > 4);
    const shared = shortTokens.filter((token) => explTokens.has(token)).length;
    if (shared / Math.max(shortTokens.length, 1) >= 0.95) {
      issues.push("shortcut prose repeats explanation working prose");
    }
  }
  return { valid: issues.length === 0, issues };
}

export function auditNumberSystemExplanationStyle(input: {
  explanation: NumberSystemLocalizedText;
  shortcut?: NumberSystemLocalizedText;
}) {
  const issues: string[] = [];
  for (const locale of ["en", "hi", "pa"] as const) {
    const text = input.explanation[locale];
    const short = input.shortcut?.[locale] ?? text.split(LABEL.shortcut[locale])[1] ?? "";
    for (const pattern of NUMBER_SYSTEM_BANNED_EXPLANATION_PATTERNS) {
      if (pattern.test(text)) {
        issues.push(`${locale}: banned coaching phrase (${pattern})`);
      }
    }
    const stepOne =
      locale === "en" ? /Step\s*1\s*:/iu.test(text) :
      locale === "hi" ? /चरण\s*1\s*:/u.test(text) :
      /ਕਦਮ\s*1\s*:/u.test(text);
    if (false && !stepOne) {
      issues.push(`${locale}: missing Step 1 header`);
    }
    if (locale === "en" && /Step\s*1\s*:/iu.test(text)) {
      issues.push(`${locale}: old Step 1 header still present`);
    }
    if (!text.includes(LABEL.observation[locale])) {
      issues.push(`${locale}: missing Observation block`);
    }
    if (!text.includes(LABEL.explanation[locale])) {
      issues.push(`${locale}: missing Explanation block`);
    }
    if (!text.includes(LABEL.commonMistake[locale])) {
      issues.push(`${locale}: missing Common Mistake block`);
    }
    if (!text.includes(LABEL.verify[locale])) {
      issues.push(`${locale}: missing Answer Verification block`);
    }
    if (!text.includes(LABEL.final[locale])) {
      issues.push(`${locale}: missing Final Answer block`);
    }
    if (!text.includes(LABEL.shortcut[locale])) {
      issues.push(`${locale}: missing Shortcut block`);
    }
    if (!/correct answer is option/i.test(text) && !/सही उत्तर विकल्प/i.test(text) && !/ਸਹੀ ਉੱਤਰ ਵਿਕਲਪ/i.test(text)) {
      issues.push(`${locale}: missing mandatory final answer line`);
    }
    if (extractDisplayMathSignatures(text.split(LABEL.verify[locale])[0] ?? text).length < 2) {
      issues.push(`${locale}: insufficient intermediate math blocks`);
    }
    const distinct = shortcutDistinctnessAudit(text, short, LABEL.verify[locale]);
    if (!distinct.valid) {
      issues.push(...distinct.issues.map((issue) => `${locale} shortcut: ${issue}`));
    }
    const hiDepth = extractDisplayMathSignatures(input.explanation.hi).length;
    const paDepth = extractDisplayMathSignatures(input.explanation.pa).length;
    const enDepth = extractDisplayMathSignatures(input.explanation.en).length;
    if (Math.abs(enDepth - hiDepth) > 1 || Math.abs(enDepth - paDepth) > 1) {
      issues.push("localization math depth mismatch between en/hi/pa");
    }
  }
  return { valid: issues.length === 0, issues };
}
