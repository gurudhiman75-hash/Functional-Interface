export type SapCp006Difficulty = "EASY" | "MEDIUM" | "HARD";
export type SapCp006TaskDirection = "INVERSE" | "COMPARISON" | "ORDERING" | "SYNTHESIS" | "VERIFICATION";

export const SAP_CP006_PROTOTYPE_IDS = [
  "SAP-CP006-PROT-MISSING-MIXED-ADDEND",
  "SAP-CP006-PROT-MISSING-MIXED-FACTOR",
  "SAP-CP006-PROT-MISSING-MIXED-DIVISOR",
  "SAP-CP006-PROT-MISSING-BRACKET-VALUE",
  "SAP-CP006-PROT-MISSING-DECIMAL-MIXED",
  "SAP-CP006-PROT-COMPOSED-POWER-MISSING",
  "SAP-CP006-PROT-COMPARE-EXACT-EXPRESSIONS",
  "SAP-CP006-PROT-ORDER-MIXED-REPRESENTATIONS",
  "SAP-CP006-PROT-EQUIVALENT-EXPRESSION",
  "SAP-CP006-PROT-CORRECT-SIMPLIFICATION-STATEMENT",
  "SAP-CP006-PROT-CANDIDATE-SUBSTITUTION",
  "SAP-CP006-PROT-STATEMENT-COMBINATION",
] as const;

export type SapCp006PrototypeId = typeof SAP_CP006_PROTOTYPE_IDS[number];

export interface SapCp006CatalogueEntry {
  prototypeId: SapCp006PrototypeId;
  proposedPermanentQlId: string;
  title: string;
  difficulty: SapCp006Difficulty;
  taskDirection: SapCp006TaskDirection;
  authorityScope: string;
}

const TITLES: readonly [string, SapCp006Difficulty, SapCp006TaskDirection, string][] = [
  ["Missing mixed addend", "MEDIUM", "INVERSE", "missing addend across fraction and percentage components"],
  ["Missing mixed factor", "MEDIUM", "INVERSE", "missing factor inside a mixed exact expression"],
  ["Missing mixed divisor", "HARD", "INVERSE", "missing divisor inside a mixed exact expression"],
  ["Missing bracket value", "MEDIUM", "INVERSE", "missing complete bracketed value in a composed exact structure"],
  ["Missing decimal in mixed equality", "MEDIUM", "INVERSE", "missing decimal combined with fraction and percentage representations"],
  ["Composed missing exponent", "HARD", "INVERSE", "bounded exponent recovery inside a factorial, power and fraction composition"],
  ["Compare exact expressions", "MEDIUM", "COMPARISON", "comparison of two exact expressions across representations"],
  ["Order mixed exact values", "HARD", "ORDERING", "ordering several exact values shown in mixed representations"],
  ["Equivalent exact expression", "MEDIUM", "SYNTHESIS", "selecting an equivalent exact expression"],
  ["Correct simplification statement", "MEDIUM", "SYNTHESIS", "selecting the one exact simplification statement that preserves value"],
  ["Candidate substitution", "MEDIUM", "VERIFICATION", "selecting a candidate by exact substitution into a mixed expression"],
  ["Exact statement combination", "HARD", "SYNTHESIS", "combining truth values of two exact arithmetic statements"],
];

export const SAP_CP006_CATALOGUE: readonly SapCp006CatalogueEntry[] =
  SAP_CP006_PROTOTYPE_IDS.map((prototypeId, index) => ({
    prototypeId,
    proposedPermanentQlId: `SAP-QL-${String(92 + index).padStart(3, "0")}`,
    title: TITLES[index]![0],
    difficulty: TITLES[index]![1],
    taskDirection: TITLES[index]![2],
    authorityScope: TITLES[index]![3],
  }));

export interface SapCp006Option {
  value: string;
  isCorrect: boolean;
  misconceptionId: string | null;
  analysis: string;
}

export interface SapCp006Oracle {
  kind: SapCp006PrototypeId;
  data: Readonly<Record<string, number>>;
}

export interface SapCp006Package {
  prototypeId: SapCp006PrototypeId;
  proposedPermanentQlId: string;
  seed: number;
  difficulty: SapCp006Difficulty;
  taskDirection: SapCp006TaskDirection;
  stem: string;
  canonicalAnswer: string;
  options: readonly SapCp006Option[];
  correctIndex: number;
  explanation: {
    coreConcept: string;
    steps: readonly string[];
    finalAnswer: string;
    verification: readonly string[];
  };
  oracle: SapCp006Oracle;
  canonicalPayloadKey: string;
  generationIdentity: string;
  validation: { ok: boolean; errors: readonly string[] };
  lifecycle: {
    permanentQlId: null;
    contentStatus: "ENGLISH_REVIEW_CANDIDATE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  };
}

interface Rational { n: bigint; d: bigint; }

const LIFECYCLE: SapCp006Package["lifecycle"] = {
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
};

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}

function rat(n: bigint | number, d: bigint | number = 1n): Rational {
  let numerator = BigInt(n), denominator = BigInt(d);
  if (denominator === 0n) throw new Error("Zero denominator.");
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  const divisor = gcd(numerator, denominator);
  return { n: numerator / divisor, d: denominator / divisor };
}

function add(a: Rational, b: Rational): Rational { return rat(a.n * b.d + b.n * a.d, a.d * b.d); }
function sub(a: Rational, b: Rational): Rational { return rat(a.n * b.d - b.n * a.d, a.d * b.d); }
function mul(a: Rational, b: Rational): Rational { return rat(a.n * b.n, a.d * b.d); }
function div(a: Rational, b: Rational): Rational {
  if (b.n === 0n) throw new Error("Division by zero.");
  return rat(a.n * b.d, a.d * b.n);
}
function cmp(a: Rational, b: Rational): number {
  const value = a.n * b.d - b.n * a.d;
  return value < 0n ? -1 : value > 0n ? 1 : 0;
}
function format(value: Rational): string { return value.d === 1n ? value.n.toString() : `${value.n}/${value.d}`; }
function percent(value: number): Rational { return rat(value, 100); }
function factorial(n: number): bigint {
  let result = 1n;
  for (let i = 2; i <= n; i += 1) result *= BigInt(i);
  return result;
}
function pow(base: number, exponent: number): bigint {
  return BigInt(base) ** BigInt(exponent);
}
function decimalFromHundredths(value: number): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}

function rng(seed: number): () => number {
  let state = (seed >>> 0) || 0x243f6a88;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function pickInt(random: () => number, min: number, max: number): number {
  return min + Math.floor(random() * (max - min + 1));
}
function pick<T>(random: () => number, values: readonly T[]): T {
  return values[Math.floor(random() * values.length)]!;
}
function rotate<T>(items: readonly T[], offset: number): T[] {
  const shift = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

function numericOptions(
  answer: Rational,
  wrong: readonly { value: Rational; misconceptionId: string; analysis: string }[],
  seed: number,
): readonly SapCp006Option[] {
  const answerText = format(answer);
  const seen = new Set<string>([answerText]);
  const candidates = wrong.filter((item) => {
    const key = format(item.value);
    if (item.value.n <= 0n || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 3);
  let bump = 1;
  while (candidates.length < 3) {
    const value = add(answer, rat(bump));
    const key = format(value);
    if (value.n > 0n && !seen.has(key)) {
      seen.add(key);
      candidates.push({
        value,
        misconceptionId: "ARITHMETIC_NEAR_MISS",
        analysis: "This is a nearby positive candidate that fails when substituted back into the complete displayed equality.",
      });
    }
    bump += 1;
  }
  const items: SapCp006Option[] = [
    { value: answerText, isCorrect: true, misconceptionId: null, analysis: "This value makes the complete displayed equality true when substituted exactly." },
    ...candidates.map((item) => ({ value: format(item.value), isCorrect: false, misconceptionId: item.misconceptionId, analysis: item.analysis })),
  ];
  return Object.freeze(rotate(items, seed % 4));
}

function decimalOptions(answerHundredths: number, seed: number): readonly SapCp006Option[] {
  const values = [answerHundredths, answerHundredths + 10, Math.max(1, answerHundredths - 10), answerHundredths + 25];
  const seen = new Set<number>();
  const unique: number[] = [];
  for (const value of values) if (value > 0 && !seen.has(value)) { seen.add(value); unique.push(value); }
  let bump = 5;
  while (unique.length < 4) {
    const value = answerHundredths + bump;
    if (!seen.has(value)) { seen.add(value); unique.push(value); }
    bump += 5;
  }
  const items: SapCp006Option[] = unique.slice(0, 4).map((value) => ({
    value: decimalFromHundredths(value),
    isCorrect: value === answerHundredths,
    misconceptionId: value === answerHundredths ? null : "DECIMAL_INVERSE_SLIP",
    analysis: value === answerHundredths
      ? "This decimal restores the exact equality when converted to hundredths."
      : "This decimal is close to the required value but fails exact substitution into the mixed equality.",
  }));
  return Object.freeze(rotate(items, seed % 4));
}

function categoricalOptions(
  correct: string,
  wrong: readonly { value: string; misconceptionId: string; analysis: string }[],
  seed: number,
): readonly SapCp006Option[] {
  const items: SapCp006Option[] = [
    { value: correct, isCorrect: true, misconceptionId: null, analysis: "This option matches the exact evaluation of every relevant expression or statement." },
    ...wrong.map((item) => ({ ...item, isCorrect: false })),
  ];
  if (items.length !== 4 || new Set(items.map((item) => item.value)).size !== 4) throw new Error("Categorical options must contain four distinct values.");
  return Object.freeze(rotate(items, seed % 4));
}

interface Built {
  stem: string;
  answer: string;
  options: readonly SapCp006Option[];
  data: Record<string, number>;
  steps: string[];
  verification: string[];
}

const FRACTIONS = [[1,2],[1,4],[3,4],[2,5],[3,5],[4,5],[2,3],[5,6],[3,8],[5,8]] as const;
const TERMINATING_DENOMS = [2, 4, 5, 10, 20, 25] as const;

function build(prototypeId: SapCp006PrototypeId, seed: number): Built {
  const random = rng(seed * 15485863 + SAP_CP006_PROTOTYPE_IDS.indexOf(prototypeId) * 32452843 + 31);

  switch (prototypeId) {
    case "SAP-CP006-PROT-MISSING-MIXED-ADDEND": {
      const [a,b] = pick(random, FRACTIONS), p = pickInt(random, 10, 60), x = pickInt(random, 2, 12);
      const target = add(add(rat(x), rat(a,b)), percent(p));
      const answer = rat(x);
      const options = numericOptions(answer, [
        { value: sub(answer, percent(p)), misconceptionId: "PERCENT_NOT_REMOVED", analysis: "This removes the percentage component from the unknown itself instead of first isolating the complete known part of the equality." },
        { value: add(answer, rat(a,b)), misconceptionId: "FRACTION_ADDED_TWICE", analysis: "This carries the known fraction to the unknown side in the wrong direction, so substitution makes the left side too large." },
        { value: add(answer, percent(p)), misconceptionId: "PERCENT_ADDED_TWICE", analysis: "This adds the known percentage again instead of subtracting it while isolating the missing addend." },
      ], seed);
      return {
        stem: `Find □: □ + ${a}/${b} + ${p}% = ${format(target)}.`,
        answer: format(answer), options, data: { a,b,p,x },
        steps: [`The known part is ${a}/${b} + ${p}/100. Subtract that complete known value from ${format(target)}.`, `The remaining value is ${x}.`],
        verification: [`Substitute □ = ${x}.`, `${x} + ${a}/${b} + ${p}% = ${format(target)}, so the equality is restored exactly.`],
      };
    }

    case "SAP-CP006-PROT-MISSING-MIXED-FACTOR": {
      const [a,b] = pick(random, FRACTIONS), p = pickInt(random, 5, 40), x = pickInt(random, 2, 9);
      const target = add(mul(rat(x), rat(a,b)), percent(p));
      const answer = rat(x);
      const options = numericOptions(answer, [
        { value: mul(answer, rat(a,b)), misconceptionId: "FACTOR_NOT_ISOLATED", analysis: "This gives the product of the unknown and the visible fraction rather than isolating the missing factor itself." },
        { value: div(answer, rat(a,b)), misconceptionId: "RECIPROCAL_ISOLATION_ERROR", analysis: "This applies the reciprocal adjustment to the already isolated answer, producing a value that fails substitution." },
        { value: add(answer, percent(p)), misconceptionId: "PERCENT_CARRIED_INTO_FACTOR", analysis: "This mixes the additive percentage term into the multiplicative unknown instead of removing the additive term first." },
      ], seed);
      return {
        stem: `Find □: (□ × ${a}/${b}) + ${p}% = ${format(target)}.`,
        answer: format(answer), options, data: { a,b,p,x },
        steps: [`First subtract ${p}% from ${format(target)} to isolate □ × ${a}/${b}.`, `Then divide by ${a}/${b}; the missing factor is ${x}.`],
        verification: [`Substitute □ = ${x}.`, `(${x} × ${a}/${b}) + ${p}% = ${format(target)} exactly.`],
      };
    }

    case "SAP-CP006-PROT-MISSING-MIXED-DIVISOR": {
      const [a,b] = pick(random, FRACTIONS), p = pickInt(random, 5, 35), x = pickInt(random, 2, 8);
      const target = add(div(rat(a,b), rat(x)), percent(p));
      const answer = rat(x);
      const options = numericOptions(answer, [
        { value: rat(1,x), misconceptionId: "DIVISOR_RECIPROCATED", analysis: "This uses the reciprocal of the required divisor, which changes division by x into multiplication by x." },
        { value: rat(x + 1), misconceptionId: "DIVISOR_OFF_BY_ONE", analysis: "This nearby divisor does not reproduce the exact quotient after the percentage term is removed." },
        { value: rat(Math.max(1,x - 1)), misconceptionId: "DIVISOR_OFF_BY_ONE", analysis: "This nearby divisor makes the quotient too large and therefore fails exact substitution." },
      ], seed);
      return {
        stem: `Find □: (${a}/${b} ÷ □) + ${p}% = ${format(target)}.`,
        answer: format(answer), options, data: { a,b,p,x },
        steps: [`Subtract ${p}% from the right side to recover the quotient ${a}/${b} ÷ □.`, `The unique positive integer divisor that gives that exact quotient is ${x}.`],
        verification: [`Substitute □ = ${x}.`, `(${a}/${b} ÷ ${x}) + ${p}% = ${format(target)} exactly.`],
      };
    }

    case "SAP-CP006-PROT-MISSING-BRACKET-VALUE": {
      const [m,n] = pick(random, FRACTIONS), p = pickInt(random, 5, 30), c = pickInt(random, 2, 6);
      const box = rat(m,n);
      const target = mul(add(box, percent(p)), rat(c));
      const options = numericOptions(box, [
        { value: add(box, percent(p)), misconceptionId: "BRACKET_PERCENT_LEFT_INSIDE", analysis: "This returns the whole bracket after the percentage was added rather than the missing bracket value represented by the box." },
        { value: mul(box, rat(c)), misconceptionId: "OUTER_MULTIPLIER_LEFT_ATTACHED", analysis: "This leaves the outer multiplier attached to the unknown instead of undoing the outer operation first." },
        { value: div(box, rat(c)), misconceptionId: "OUTER_MULTIPLIER_APPLIED_TWICE", analysis: "This divides the already isolated bracket value by the outer multiplier a second time." },
      ], seed);
      return {
        stem: `If (□ + ${p}%) × ${c} = ${format(target)}, find the exact value represented by □.`,
        answer: format(box), options, data: { m,n,p,c },
        steps: [`Divide ${format(target)} by ${c} to recover the complete bracket value.`, `Subtract ${p}% from that bracket value; □ = ${format(box)}.`],
        verification: [`Substitute □ = ${format(box)}.`, `(${format(box)} + ${p}%) × ${c} = ${format(target)} exactly.`],
      };
    }

    case "SAP-CP006-PROT-MISSING-DECIMAL-MIXED": {
      const b = pick(random, TERMINATING_DENOMS), a = pickInt(random, 1, b - 1), p = pickInt(random, 5, 40);
      const hundredths = pickInt(random, 2, 18) * 5;
      const value = rat(hundredths, 100);
      const target = add(add(value, rat(a,b)), percent(p));
      const answer = decimalFromHundredths(hundredths);
      const options = decimalOptions(hundredths, seed);
      return {
        stem: `The box is a decimal. Find □: □ + ${a}/${b} + ${p}% = ${format(target)}.`,
        answer, options, data: { a,b,p,hundredths },
        steps: [`Subtract ${a}/${b} and ${p}% from ${format(target)}.`, `The remaining exact value is ${format(value)}, which as a decimal is ${answer}.`],
        verification: [`Convert ${answer} to ${hundredths}/100.`, `${answer} + ${a}/${b} + ${p}% = ${format(target)} exactly.`],
      };
    }

    case "SAP-CP006-PROT-COMPOSED-POWER-MISSING": {
      const factN = pickInt(random, 3, 5), base = pickInt(random, 2, 4), exponent = pickInt(random, 2, 4);
      const [a,b] = pick(random, FRACTIONS);
      const target = add(add(rat(factorial(factN)), rat(pow(base, exponent))), rat(a,b));
      const correct = String(exponent);
      const candidates = [1,2,3,4,5].filter((value) => value !== exponent).slice(0,3).map((value) => ({
        value: String(value), misconceptionId: "POWER_CANDIDATE_FAILS_SUBSTITUTION", analysis: `Using exponent ${value} changes ${base}^□ and therefore does not reproduce the exact target.`
      }));
      const options = categoricalOptions(correct, candidates, seed);
      return {
        stem: `Find the integer □: ${factN}! + ${base}^□ + ${a}/${b} = ${format(target)}.`,
        answer: correct, options, data: { factN,base,exponent,a,b },
        steps: [`Subtract ${factN}! and ${a}/${b} from the right side to isolate ${base}^□.`, `The remaining power is ${base}^${exponent}, so □ = ${exponent}.`],
        verification: [`Test the candidate exponent ${exponent}.`, `${factN}! + ${base}^${exponent} + ${a}/${b} = ${format(target)} exactly.`],
      };
    }

    case "SAP-CP006-PROT-COMPARE-EXACT-EXPRESSIONS": {
      const [a,b] = pick(random, FRACTIONS), p = pickInt(random, 15, 65), relation = seed % 3;
      const offset = relation === 0 ? 0 : relation === 1 ? 10 : -10;
      const rightHundredths = p + offset;
      const left = add(rat(a,b), percent(p));
      const right = add(rat(a,b), rat(rightHundredths,100));
      const answer = cmp(left,right) > 0 ? "A > B" : cmp(left,right) < 0 ? "A < B" : "A = B";
      const options = categoricalOptions(answer, ["A > B","A < B","A = B","Cannot be determined"].filter((v) => v !== answer).map((value) => ({
        value, misconceptionId: "EXACT_COMPARISON_ERROR", analysis: "This comparison disagrees with the exact common-denominator evaluation of the two fully numeric expressions."
      })).slice(0,3), seed);
      return {
        stem: `Compare A = ${a}/${b} + ${p}% and B = ${a}/${b} + ${decimalFromHundredths(rightHundredths)}.`,
        answer, options, data: { a,b,p,rightHundredths },
        steps: [`Convert ${p}% to ${decimalFromHundredths(p)} while keeping ${a}/${b} unchanged on both sides.`, `Exact comparison gives ${answer}.`],
        verification: [`A = ${format(left)} and B = ${format(right)}.`, `Cross-multiplication of these exact rationals confirms ${answer}.`],
      };
    }

    case "SAP-CP006-PROT-ORDER-MIXED-REPRESENTATIONS": {
      const base = pickInt(random, 15, 35), gaps = [pickInt(random,8,15),pickInt(random,8,15),pickInt(random,8,15)];
      const sortedValues = [base, base+gaps[0]!, base+gaps[0]!+gaps[1]!, base+gaps[0]!+gaps[1]!+gaps[2]!];
      const permutation = rotate([0,1,2,3], seed % 4);
      if (seed % 2 === 1) [permutation[1], permutation[2]] = [permutation[2]!, permutation[1]!];
      const assigned = permutation.map((index) => sortedValues[index]!);
      const labels = ["A","B","C","D"];
      const valueByLabel = Object.fromEntries(labels.map((label,index) => [label, assigned[index]!])) as Record<string,number>;
      const orderedLabels = [...labels].sort((x,y) => valueByLabel[x]! - valueByLabel[y]!);
      const answer = orderedLabels.join(" < ");
      const aVal = assigned[0]!, bVal = assigned[1]!, cVal = assigned[2]!, dVal = assigned[3]!;
      const reverse = [...orderedLabels].reverse().join(" < ");
      const swapMiddle = [orderedLabels[0]!, orderedLabels[2]!, orderedLabels[1]!, orderedLabels[3]!].join(" < ");
      const rotateWrong = [orderedLabels[1]!, orderedLabels[0]!, orderedLabels[2]!, orderedLabels[3]!].join(" < ");
      const options = categoricalOptions(answer, [
        { value: reverse, misconceptionId: "ORDER_REVERSED", analysis: "This lists the exact values from greatest to least even though the question asks for increasing order." },
        { value: swapMiddle, misconceptionId: "MIDDLE_VALUES_SWAPPED", analysis: "The endpoints are placed correctly, but the two middle exact values are compared in the wrong order." },
        { value: rotateWrong, misconceptionId: "FIRST_PAIR_SWAPPED", analysis: "This reverses the two smallest exact values while leaving the rest of the ordering unchanged." },
      ], seed);
      const dPercent = dVal - 10;
      return {
        stem: `Arrange in increasing order: A = ${aVal}/100, B = ${bVal}%, C = ${decimalFromHundredths(cVal)}, D = ${dPercent}% + 0.10.`,
        answer, options, data: { aVal,bVal,cVal,dVal },
        steps: [`Write all four quantities in hundredths: A=${aVal}/100, B=${bVal}/100, C=${cVal}/100, D=${dVal}/100.`, `Comparing their numerators gives ${answer}.`],
        verification: [`The exact hundredth numerators are ${aVal}, ${bVal}, ${cVal}, ${dVal}.`, `Sorting those four integers independently reproduces ${answer}.`],
      };
    }

    case "SAP-CP006-PROT-EQUIVALENT-EXPRESSION": {
      const [a,b] = pick(random, FRACTIONS), p = pickInt(random, 10, 60);
      const numerator = a*100 + p*b, denominator = b*100;
      const answer = `${numerator}/${denominator}`;
      const wrong = [
        { value: `${a+p}/${b+100}`, misconceptionId: "ADDS_NUMERATORS_AND_DENOMINATORS", analysis: "This incorrectly adds numerators and denominators across unlike fraction representations instead of using a common denominator." },
        { value: `${a*100+p}/${denominator}`, misconceptionId: "PERCENT_DENOMINATOR_FACTOR_MISSED", analysis: "This treats p% as p/(100b) without multiplying the percentage numerator by the fraction denominator b." },
        { value: `${a+p*b}/${denominator}`, misconceptionId: "FRACTION_SCALE_FACTOR_MISSED", analysis: "This fails to multiply the original fraction numerator by 100 when converting both terms to denominator 100b." },
      ];
      const options = categoricalOptions(answer, wrong, seed);
      return {
        stem: `Which fraction is exactly equivalent to ${a}/${b} + ${p}%?`,
        answer, options, data: { a,b,p,numerator,denominator },
        steps: [`Write ${p}% as ${p}/100.`, `Using common denominator ${denominator}, the numerator is ${a}×100 + ${p}×${b} = ${numerator}.`],
        verification: [`Evaluate ${a}/${b} + ${p}/100 exactly.`, `It equals ${answer}; the other displayed fractions do not.`],
      };
    }

    case "SAP-CP006-PROT-CORRECT-SIMPLIFICATION-STATEMENT": {
      const [a,b] = pick(random, FRACTIONS), p = pickInt(random, 10, 60), numerator = a*100+p*b, denominator=b*100;
      const prefix = `${a}/${b} + ${p}%`;
      const answer = `${prefix} = ${numerator}/${denominator}`;
      const wrong = [
        { value: `${prefix} = ${a+p}/${b+100}`, misconceptionId: "ILLEGAL_FRACTION_ADDITION", analysis: "This adds the two denominators directly, which is not a valid rule for adding fractions with different denominators." },
        { value: `${prefix} = ${a*100+p}/${denominator}`, misconceptionId: "PERCENT_NUMERATOR_NOT_SCALED", analysis: "This omits the factor b required when p/100 is rewritten over the common denominator 100b." },
        { value: `${prefix} = ${a+p*b}/${denominator}`, misconceptionId: "FRACTION_NUMERATOR_NOT_SCALED", analysis: "This omits the factor 100 required when a/b is rewritten over the common denominator 100b." },
      ];
      const options = categoricalOptions(answer, wrong, seed);
      return {
        stem: `Which simplification statement is correct?`,
        answer, options, data: { a,b,p,numerator,denominator },
        steps: [`Convert ${p}% to ${p}/100 and use common denominator ${denominator}.`, `The exact combined numerator is ${numerator}, so the correct statement is ${answer}.`],
        verification: [`Evaluate both sides of the selected equality independently.`, `Both reduce to ${format(add(rat(a,b),percent(p)))}.`],
      };
    }

    case "SAP-CP006-PROT-CANDIDATE-SUBSTITUTION": {
      const [a,b] = pick(random, FRACTIONS), p = pickInt(random, 5, 35), x = pickInt(random, 2, 9);
      const target = add(mul(rat(x),rat(a,b)),percent(p));
      const candidateValues = [x, x+1, Math.max(1,x-1), x+2];
      const seen = new Set<number>();
      const unique = candidateValues.filter((value) => !seen.has(value) && seen.add(value)).slice(0,4);
      while (unique.length < 4) unique.push(x + unique.length + 2);
      const items = unique.map((value) => ({
        value: String(value), isCorrect: value === x, misconceptionId: value === x ? null : "SUBSTITUTION_MISMATCH",
        analysis: value === x ? "Substitution reproduces the right side exactly." : `Substituting ${value} changes the multiplicative term, so the equality does not hold exactly.`
      }));
      const options = Object.freeze(rotate(items, seed % 4));
      return {
        stem: `Which candidate value of x makes (x × ${a}/${b}) + ${p}% = ${format(target)} exactly true?`,
        answer: String(x), options, data: { a,b,p,x },
        steps: [`Substitute the candidate values into x × ${a}/${b}.`, `Only x = ${x} makes the complete left side equal ${format(target)}.`],
        verification: [`For x=${x}, the left side is ${format(target)}.`, `The other three candidates produce different exact rational values.`],
      };
    }

    case "SAP-CP006-PROT-STATEMENT-COMBINATION": {
      const [a,b] = pick(random, FRACTIONS), p = pickInt(random, 10, 50), mask = seed % 4;
      const value = add(rat(a,b),percent(p));
      const statement1True = (mask & 1) !== 0;
      const statement2True = (mask & 2) !== 0;
      const claimed1 = statement1True ? value : add(value,rat(1,100));
      const threshold = statement2True ? sub(value,rat(1,10)) : add(value,rat(1,10));
      const answer = statement1True && statement2True ? "Both I and II" : statement1True ? "Only I" : statement2True ? "Only II" : "Neither I nor II";
      const all = ["Both I and II","Only I","Only II","Neither I nor II"];
      const options = categoricalOptions(answer, all.filter((v) => v !== answer).map((value) => ({
        value, misconceptionId: "STATEMENT_TRUTH_COMBINATION_ERROR", analysis: "This combination assigns at least one statement the wrong truth value after exact evaluation."
      })), seed);
      return {
        stem: `For E = ${a}/${b} + ${p}%, consider: I. E = ${format(claimed1)}. II. E > ${format(threshold)}. Which option is correct?`,
        answer, options, data: { a,b,p,statement1True: statement1True?1:0,statement2True: statement2True?1:0 },
        steps: [`Evaluate E exactly as ${format(value)}.`, `Statement I is ${statement1True?"true":"false"}; Statement II is ${statement2True?"true":"false"}. Therefore ${answer}.`],
        verification: [`Compare ${format(value)} with the equality claim ${format(claimed1)}.`, `Compare ${format(value)} with threshold ${format(threshold)}; the two independent checks give ${answer}.`],
      };
    }
  }
}

function validate(pkg: Omit<SapCp006Package,"validation">): { ok:boolean; errors:readonly string[] } {
  const errors:string[] = [];
  if (pkg.options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(pkg.options.map((option) => option.value)).size !== 4) errors.push("Options must be distinct.");
  if (pkg.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (pkg.options[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Correct index is not answer-bound.");
  if (pkg.explanation.steps.length < 2 || pkg.explanation.verification.length < 2) errors.push("Explanation and independent verification must each contain at least two steps.");
  if (pkg.lifecycle.permanentQlId !== null || pkg.lifecycle.active || pkg.lifecycle.questionStudioDiscoverable) errors.push("Foundation lifecycle must remain inactive and unallocated.");
  return { ok: errors.length===0, errors:Object.freeze(errors) };
}

const CORE: Record<SapCp006PrototypeId,string> = {
  "SAP-CP006-PROT-MISSING-MIXED-ADDEND": "Isolate the unknown only after combining or removing every known exact component; then prove the inverse result by substituting it into the original mixed equality.",
  "SAP-CP006-PROT-MISSING-MIXED-FACTOR": "Undo additive terms before undoing multiplication. A candidate factor is accepted only if exact substitution restores the complete mixed expression.",
  "SAP-CP006-PROT-MISSING-MIXED-DIVISOR": "For a missing divisor, first isolate the quotient and then recover the divisor from the exact dividend-to-quotient relationship; reciprocal mistakes must fail substitution.",
  "SAP-CP006-PROT-MISSING-BRACKET-VALUE": "Reverse the outer operation before opening the bracket. The box represents the exact missing bracket component, not the entire transformed bracket.",
  "SAP-CP006-PROT-MISSING-DECIMAL-MIXED": "Convert the mixed known terms exactly, isolate the missing value, and only then express that exact rational value in the decimal representation requested by the question.",
  "SAP-CP006-PROT-COMPOSED-POWER-MISSING": "A bounded missing exponent inside a composed exact expression should be isolated from the factorial and fraction terms and then verified by direct integer-power substitution.",
  "SAP-CP006-PROT-COMPARE-EXACT-EXPRESSIONS": "Comparison requires exact common-value evaluation; representation differences such as percent versus decimal must not be mistaken for magnitude differences.",
  "SAP-CP006-PROT-ORDER-MIXED-REPRESENTATIONS": "Convert all displayed quantities to one exact comparable scale before ordering them. The ordering is determined by value, not by the visual form of the representation.",
  "SAP-CP006-PROT-EQUIVALENT-EXPRESSION": "Two expressions are equivalent only when exact common-denominator evaluation gives the same rational value; visual similarity is not enough.",
  "SAP-CP006-PROT-CORRECT-SIMPLIFICATION-STATEMENT": "A valid simplification statement must preserve the exact value on both sides of the equality. Each candidate statement can be checked independently.",
  "SAP-CP006-PROT-CANDIDATE-SUBSTITUTION": "Candidate verification is a forward proof: substitute each candidate into the fixed expression and accept only the value that reproduces the target exactly.",
  "SAP-CP006-PROT-STATEMENT-COMBINATION": "Evaluate the underlying exact expression once, then judge each statement independently before combining their truth values into the final option.",
};

export function generateSapCp006(prototypeId:SapCp006PrototypeId, seed:number):SapCp006Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const catalogue = SAP_CP006_CATALOGUE.find((entry) => entry.prototypeId===prototypeId)!;
  const built = build(prototypeId,seed);
  const correctIndex = built.options.findIndex((option) => option.isCorrect);
  const oracle: SapCp006Oracle = { kind: prototypeId, data:Object.freeze({...built.data}) };
  const partial: Omit<SapCp006Package,"validation"> = {
    prototypeId,
    proposedPermanentQlId: catalogue.proposedPermanentQlId,
    seed,
    difficulty: catalogue.difficulty,
    taskDirection: catalogue.taskDirection,
    stem: built.stem,
    canonicalAnswer: built.answer,
    options: built.options,
    correctIndex,
    explanation: {
      coreConcept: CORE[prototypeId],
      steps:Object.freeze(built.steps),
      finalAnswer:`Therefore, the answer is ${built.answer}.`,
      verification:Object.freeze(built.verification),
    },
    oracle,
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem:built.stem, answer:built.answer, data:built.data }),
    generationIdentity: `${prototypeId}:seed:${seed}:${JSON.stringify(built.data)}`,
    lifecycle:LIFECYCLE,
  };
  return Object.freeze({ ...partial, validation:validate(partial) });
}

export function generateSapCp006Sweep(perPrototype=100):readonly SapCp006Package[] {
  if (!Number.isInteger(perPrototype) || perPrototype < 1) throw new Error("perPrototype must be positive.");
  return SAP_CP006_PROTOTYPE_IDS.flatMap((prototypeId,index) =>
    Array.from({length:perPrototype},(_,seedIndex) => generateSapCp006(prototypeId,index*20_000+seedIndex+1)),
  );
}
