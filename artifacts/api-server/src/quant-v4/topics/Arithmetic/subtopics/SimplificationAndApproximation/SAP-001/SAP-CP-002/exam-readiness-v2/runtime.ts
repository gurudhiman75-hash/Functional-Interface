import {
  generateSapCp002PermanentEnglishPackage,
  type SapCp002PermanentEnglishPackage,
} from "../permanent-runtime/runtime";
import type { SapCp002PrototypeId } from "../SAP-CP-002-AUTHORITY-AND-TEMPLATE-MAP";
import type {
  SapCp002ExamReadinessV2Package,
  SapCp002V2AnswerContract,
  SapCp002V2Difficulty,
  SapCp002V2Explanation,
  SapCp002V2Option,
  SapCp002V2SolveModeSubtype,
  SapCp002V2Validation,
} from "./types";

interface Rat {
  readonly n: bigint;
  readonly d: bigint;
}

interface ModeMeta {
  readonly label: string;
  readonly subtype: SapCp002V2SolveModeSubtype;
  readonly baseDifficultyWeight: number;
}

interface RemodeledSurface {
  readonly stem: string;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly options: readonly SapCp002V2Option[];
  readonly correctIndex: number;
  readonly explanation?: SapCp002V2Explanation;
  readonly mathematicalFingerprint?: string;
}

const MODE_META: Readonly<Record<SapCp002PrototypeId, ModeMeta>> = Object.freeze({
  "SAP-CP002-PROT-FRACTION-SUM-DIFFERENCE": {
    label: "Fraction sum or difference",
    subtype: "FRACTION_SUM_DIFFERENCE",
    baseDifficultyWeight: 1,
  },
  "SAP-CP002-PROT-FRACTION-PRODUCT-CANCELLATION": {
    label: "Fraction product with complete cancellation",
    subtype: "FRACTION_PRODUCT_COMPLETE_REDUCTION",
    baseDifficultyWeight: 1,
  },
  "SAP-CP002-PROT-FRACTION-DIVISION-RECIPROCAL": {
    label: "Fraction division by reciprocal",
    subtype: "FRACTION_DIVISION_RECIPROCAL",
    baseDifficultyWeight: 2,
  },
  "SAP-CP002-PROT-MIXED-FRACTION-OPERATION-CHAIN": {
    label: "Integer with grouped fraction operation",
    subtype: "INTEGER_WITH_GROUPED_FRACTION_OPERATION",
    baseDifficultyWeight: 2,
  },
  "SAP-CP002-PROT-FRACTION-EXPRESSION-INTEGER-PART": {
    label: "Integer with grouped fraction operation",
    subtype: "INTEGER_WITH_GROUPED_FRACTION_OPERATION",
    baseDifficultyWeight: 2,
  },
  "SAP-CP002-PROT-MIXED-NUMBERS-CONVERT-EVALUATE": {
    label: "Mixed-number conversion and evaluation",
    subtype: "MIXED_NUMBER_CONVERSION",
    baseDifficultyWeight: 2,
  },
  "SAP-CP002-PROT-FRACTION-OF-FRACTION": {
    label: "Fraction of a grouped fraction",
    subtype: "SCOPED_FRACTION_OF_GROUP",
    baseDifficultyWeight: 2,
  },
  "SAP-CP002-PROT-NESTED-COMPLEX-FRACTION": {
    label: "Complete-block complex fraction",
    subtype: "COMPLETE_BLOCK_COMPLEX_FRACTION",
    baseDifficultyWeight: 4,
  },
  "SAP-CP002-PROT-SIGNED-FRACTION-BRACKETS": {
    label: "Signed fractions and bracket scope",
    subtype: "SIGNED_FRACTION_BRACKET_SCOPE",
    baseDifficultyWeight: 3,
  },
  "SAP-CP002-PROT-PRODUCT-SUM-DIFFERENCE": {
    label: "Product of fractional sum and difference",
    subtype: "SUM_DIFFERENCE_IDENTITY",
    baseDifficultyWeight: 3,
  },
  "SAP-CP002-PROT-RECIPROCAL-EXPRESSION": {
    label: "Reciprocal of a complete grouped expression",
    subtype: "RECIPROCAL_OF_COMPLETE_GROUP",
    baseDifficultyWeight: 3,
  },
  "SAP-CP002-PROT-FRACTION-COMPLEMENT": {
    label: "Fraction complement",
    subtype: "FRACTION_COMPLEMENT",
    baseDifficultyWeight: 1,
  },
  "SAP-CP002-PROT-BOUNDED-CONTINUED-FRACTION": {
    label: "Bounded continued fraction",
    subtype: "BOUNDED_CONTINUED_FRACTION",
    baseDifficultyWeight: 5,
  },
  "SAP-CP002-PROT-MISSING-NUMERATOR": {
    label: "Missing numerator",
    subtype: "MISSING_NUMERATOR",
    baseDifficultyWeight: 2,
  },
  "SAP-CP002-PROT-MISSING-DENOMINATOR": {
    label: "Missing denominator",
    subtype: "MISSING_DENOMINATOR",
    baseDifficultyWeight: 3,
  },
  "SAP-CP002-PROT-MISSING-FRACTION-OPERAND": {
    label: "Missing fraction operand",
    subtype: "MISSING_FRACTION_OPERAND",
    baseDifficultyWeight: 3,
  },
  "SAP-CP002-PROT-COMPARE-EVALUATED-FRACTIONS": {
    label: "Compare evaluated fraction expressions",
    subtype: "EXACT_FRACTION_COMPARISON",
    baseDifficultyWeight: 3,
  },
  "SAP-CP002-PROT-SELECT-EQUIVALENT-REDUCED-FRACTION": {
    label: "Select the unique equivalent fraction in lowest terms",
    subtype: "VALUE_AND_LOWEST_TERM_FORM",
    baseDifficultyWeight: 3,
  },
  "SAP-CP002-PROT-IDENTIFY-INCORRECT-FRACTION-STEP": {
    label: "Identify the first invalid fraction transformation",
    subtype: "FIRST_INVALID_TRANSFORMATION",
    baseDifficultyWeight: 4,
  },
});

const BANNED_EXPLANATION = /(?:the denominator work is kept exact throughout|quick substitution or reverse calculation|therefore the exact answer remains|greatest common factor leaves the value unchanged)/i;
const FRACTION_PATTERN = /[−-]?\d+\/\d+/g;

function abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x === 0n ? 1n : x;
}

function rat(n: bigint, d: bigint = 1n): Rat {
  if (d === 0n) throw new Error("A rational denominator cannot be zero.");
  const sign = d < 0n ? -1n : 1n;
  const divisor = gcd(n, d);
  return Object.freeze({ n: (n / divisor) * sign, d: abs(d / divisor) });
}

function add(left: Rat, right: Rat): Rat {
  return rat(left.n * right.d + right.n * left.d, left.d * right.d);
}

function subtract(left: Rat, right: Rat): Rat {
  return rat(left.n * right.d - right.n * left.d, left.d * right.d);
}

function multiply(left: Rat, right: Rat): Rat {
  return rat(left.n * right.n, left.d * right.d);
}

function divide(left: Rat, right: Rat): Rat {
  if (right.n === 0n) throw new Error("Division by zero is not allowed.");
  return rat(left.n * right.d, left.d * right.n);
}

function square(value: Rat): Rat {
  return multiply(value, value);
}

function formatRat(value: Rat): string {
  const sign = value.n < 0n ? "−" : "";
  const numerator = abs(value.n).toString();
  return value.d === 1n ? `${sign}${numerator}` : `${sign}${numerator}/${value.d.toString()}`;
}

function parseRat(text: string): Rat | null {
  const normalized = text.trim().replace(/−/g, "-");
  const fraction = normalized.match(/^(-?\d+)\/(\d+)$/);
  if (fraction) return rat(BigInt(fraction[1]!), BigInt(fraction[2]!));
  if (/^-?\d+$/.test(normalized)) return rat(BigInt(normalized));
  return null;
}

function equalRat(left: Rat, right: Rat): boolean {
  return left.n === right.n && left.d === right.d;
}

function isLowestTerms(text: string): boolean {
  const normalized = text.trim().replace(/−/g, "-");
  const match = normalized.match(/^(-?\d+)\/(\d+)$/);
  if (!match) return /^-?\d+$/.test(normalized);
  return gcd(BigInt(match[1]!), BigInt(match[2]!)) === 1n;
}

function ensureSentence(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) return trimmed;
  return /[.!?:]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function normalizeSentence(text: string): string {
  return text
    .toLowerCase()
    .replace(/[−–—]/g, "-")
    .replace(/[^a-z0-9/<>+=-]+/g, " ")
    .trim();
}

function uniqueSentences(sentences: readonly string[]): readonly string[] {
  const output: string[] = [];
  const seen = new Set<string>();
  for (const raw of sentences) {
    const sentence = ensureSentence(raw);
    if (!sentence || BANNED_EXPLANATION.test(sentence)) continue;
    const key = normalizeSentence(sentence);
    if (key.length >= 18 && seen.has(key)) continue;
    if (key.length >= 18) seen.add(key);
    output.push(sentence);
  }
  return Object.freeze(output);
}

function extractFractionTokens(text: string): readonly string[] {
  return Object.freeze(text.match(FRACTION_PATTERN) ?? []);
}

function answerContractFor(base: SapCp002PermanentEnglishPackage): SapCp002V2AnswerContract {
  if (base.taskDirection === "COMPARISON") return "COMPARISON_STATEMENT";
  if (base.taskDirection === "SELECTION") return "LOWEST_TERM_SELECTION";
  if (base.taskDirection === "DIAGNOSIS") return "FIRST_ERROR_SELECTION";
  if (base.answerSemantic === "MISSING_INTEGER") return "MISSING_INTEGER";
  if (base.answerSemantic === "MISSING_RATIONAL") return "MISSING_RATIONAL";
  return "SIMPLIFIED_RATIONAL";
}

function optionFromBase(
  option: SapCp002PermanentEnglishPackage["options"][number],
  correctAnswer: string,
  requireLowestTerms: boolean,
): SapCp002V2Option {
  const optionValue = parseRat(option.value);
  const correctValue = parseRat(correctAnswer);
  const numericEquivalent = optionValue !== null && correctValue !== null
    ? equalRat(optionValue, correctValue)
    : option.value === correctAnswer;
  return Object.freeze({
    value: option.value,
    isCorrect: option.isCorrect,
    misconceptionId: option.misconceptionId,
    analysis: ensureSentence(option.analysis),
    numericEquivalenceToCorrect: numericEquivalent,
    satisfiesRequiredForm: option.isCorrect && (!requireLowestTerms || isLowestTerms(option.value)),
  });
}

function optionSetFromBase(
  base: SapCp002PermanentEnglishPackage,
  correctAnswer = base.canonicalAnswer,
): readonly SapCp002V2Option[] {
  return Object.freeze(base.options.map((option) => optionFromBase(
    option,
    correctAnswer,
    base.taskDirection === "SELECTION",
  )));
}

function misconceptionTraps(options: readonly SapCp002V2Option[]): readonly string[] {
  return Object.freeze(options.filter((option) => !option.isCorrect).map((option) => ensureSentence(option.analysis)).slice(0, 3));
}

function reducedFactorNarration(stem: string, answer: string): readonly string[] | null {
  const tokens = extractFractionTokens(stem);
  if (tokens.length < 2) return null;
  const values = tokens.map(parseRat);
  if (values.some((value) => value === null)) return null;
  const original = tokens.slice(0, Math.min(tokens.length, 3));
  const reduced = values.slice(0, original.length).map((value) => formatRat(value!));
  let product = rat(1n);
  for (const value of values.slice(0, original.length)) product = multiply(product, value!);
  return uniqueSentences([
    `Reduce each factor before multiplying: ${original.map((token, index) => `${token} = ${reduced[index]}`).join(", ")}`,
    `Multiply the reduced factors to obtain ${formatRat(product)}`,
    `The result in lowest terms is ${answer}`,
  ]);
}

function divisionNarration(stem: string, answer: string): readonly string[] | null {
  const tokens = extractFractionTokens(stem);
  if (tokens.length < 2) return null;
  const left = parseRat(tokens[0]!);
  const right = parseRat(tokens[1]!);
  if (!left || !right || right.n === 0n) return null;
  const reciprocal = rat(right.d, right.n);
  const result = divide(left, right);
  return uniqueSentences([
    `Keep the dividend ${tokens[0]} and replace division by multiplication with the reciprocal ${formatRat(reciprocal)}`,
    `${tokens[0]} ÷ ${tokens[1]} = ${tokens[0]} × ${formatRat(reciprocal)}`,
    `Cancel common factors, multiply, and reduce to ${formatRat(result)}`,
    `Therefore, the answer is ${answer}`,
  ]);
}

function identityNarration(stem: string, answer: string): readonly string[] | null {
  const tokens = extractFractionTokens(stem);
  if (tokens.length < 4) return null;
  const x = parseRat(tokens[0]!);
  const y = parseRat(tokens[1]!);
  if (!x || !y) return null;
  const result = subtract(square(x), square(y));
  return uniqueSentences([
    `The two brackets have the form (x + y)(x − y), where x = ${tokens[0]} and y = ${tokens[1]}`,
    `Use (x + y)(x − y) = x² − y² instead of multiplying both brackets separately`,
    `${formatRat(square(x))} − ${formatRat(square(y))} = ${formatRat(result)}`,
    `Therefore, the answer is ${answer}`,
  ]);
}

function genericForwardExplanation(
  base: SapCp002PermanentEnglishPackage,
  options: readonly SapCp002V2Option[],
  answer: string,
): SapCp002V2Explanation {
  const special = base.permanentQlId === "SAP-QL-018"
    ? reducedFactorNarration(base.stem, answer)
    : base.permanentQlId === "SAP-QL-019"
      ? divisionNarration(base.stem, answer)
      : base.permanentQlId === "SAP-QL-025"
        ? identityNarration(base.stem, answer)
        : null;
  const steps = special ?? uniqueSentences(base.explanation.stepByStep);
  const methodId = base.permanentQlId === "SAP-QL-018"
    ? "COMPLETE_PRE_REDUCTION"
    : base.permanentQlId === "SAP-QL-019"
      ? "INVERT_DIVISOR_THEN_CANCEL"
      : base.permanentQlId === "SAP-QL-025"
        ? "DIFFERENCE_OF_SQUARES"
        : base.permanentQlId === "SAP-QL-028"
          ? "DEEPEST_LAYER_OUTWARD"
          : "EXACT_SHORTEST_VALID_ROUTE";
  return Object.freeze({
    answerContract: "SIMPLIFIED_RATIONAL",
    methodId,
    coreConcept: ensureSentence(base.explanation.coreConcept),
    givenDataAndStrategy: ensureSentence(base.explanation.givenDataAndStrategy),
    stepByStep: steps,
    examSpeedMethod: ensureSentence(
      base.permanentQlId === "SAP-QL-025"
        ? "Recognize the paired sum-and-difference structure and use the identity before expanding any brackets"
        : base.explanation.examSpeedMethod,
    ),
    commonTraps: misconceptionTraps(options),
    finalAnswer: `Therefore, the answer is ${answer}.`,
  });
}

function inverseExplanation(
  base: SapCp002PermanentEnglishPackage,
  options: readonly SapCp002V2Option[],
  answer: string,
  meta: ModeMeta,
): SapCp002V2Explanation {
  const componentLine = meta.subtype === "MISSING_NUMERATOR"
    ? "After isolating the unknown fraction, scale it to the displayed denominator and read the numerator"
    : meta.subtype === "MISSING_DENOMINATOR"
      ? "After isolating the unknown fraction, use exact cross multiplication to recover the denominator"
      : "Apply the inverse additive operation while preserving the order of subtraction";
  return Object.freeze({
    answerContract: base.answerSemantic === "MISSING_INTEGER" ? "MISSING_INTEGER" : "MISSING_RATIONAL",
    methodId: meta.subtype,
    coreConcept: ensureSentence(base.explanation.coreConcept),
    givenDataAndStrategy: ensureSentence(componentLine),
    stepByStep: uniqueSentences(base.explanation.stepByStep),
    examSpeedMethod: ensureSentence("Write the isolation equation first, then calculate exactly and verify by one substitution"),
    commonTraps: misconceptionTraps(options),
    finalAnswer: `The missing value is ${answer}.`,
  });
}

function stripNeutralComparisonPadding(stem: string): string {
  return stem
    .replace(/\s*\+\s*(\d+\/\d+)\s*[−-]\s*\1/g, "")
    .replace(/Choose the correct relation between A and B\.?/i, "Evaluate A and B exactly. Which statement is correct?")
    .replace(/Which relation is correct\?/i, "Evaluate A and B exactly. Which statement is correct?")
    .replace(/\s+/g, " ")
    .trim();
}

function comparisonSurface(base: SapCp002PermanentEnglishPackage): RemodeledSurface {
  const relation = base.canonicalAnswer;
  const answer = `A ${relation} B`;
  const simpleStatements = ["A > B", "A < B", "A = B"];
  const wrongRelation = simpleStatements.find((value) => value !== answer) ?? "A < B";
  const reasonVariants = [
    `${wrongRelation} because only the visible denominators should be compared`,
    `${wrongRelation} because the larger visible numerator always decides the result`,
    `${wrongRelation} because unlike denominators prevent exact comparison`,
  ] as const;
  const fourth = reasonVariants[(base.seed - 1) % reasonVariants.length]!;
  const raw = [...simpleStatements, fourth];
  const correctIndex = (base.seed + 1) % 4;
  const ordered: string[] = [];
  const wrong = raw.filter((value) => value !== answer);
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    ordered.push(index === correctIndex ? answer : wrong[wrongIndex++]!);
  }
  const options = Object.freeze(ordered.map((value) => Object.freeze({
    value,
    isCorrect: value === answer,
    misconceptionId: value === answer ? null : value.includes("because") ? "INVALID_VISIBLE_COMPONENT_COMPARISON" : "WRONG_EXACT_RELATION",
    analysis: value === answer
      ? "Both complete expressions have been evaluated exactly before comparison."
      : value.includes("denominators")
        ? "Denominator size alone does not determine the value of a fraction expression."
        : value.includes("numerator")
          ? "Visible numerators cannot be compared before the complete expressions are reduced."
          : value.includes("prevent")
            ? "Unlike denominators can be compared exactly by reduction or cross multiplication."
            : "This relation does not match the exact reduced values of A and B.",
    numericEquivalenceToCorrect: false,
    satisfiesRequiredForm: value === answer,
  })));
  const explanation: SapCp002V2Explanation = Object.freeze({
    answerContract: "COMPARISON_STATEMENT",
    methodId: "REDUCE_THEN_COMPARE_EXACTLY",
    coreConcept: "A relation between two fraction expressions is decided only after both complete expressions are evaluated exactly.",
    givenDataAndStrategy: "Simplify A and B independently, then compare their reduced values by cross multiplication or a common denominator.",
    stepByStep: uniqueSentences(base.explanation.stepByStep),
    examSpeedMethod: "Cancel any equal terms first and compare reduced fractions without converting them to decimals.",
    commonTraps: misconceptionTraps(options),
    finalAnswer: `Hence, ${answer}.`,
  });
  return Object.freeze({
    stem: stripNeutralComparisonPadding(base.stem),
    canonicalAnswer: answer,
    verifierAnswer: answer,
    options,
    correctIndex,
    explanation,
  });
}

function nearbyWrongFraction(correct: Rat, used: Set<string>, seed: number): string {
  for (let offset = 1n; offset <= 20n; offset += 1n) {
    const direction = (seed + Number(offset)) % 2 === 0 ? 1n : -1n;
    const candidate = rat(correct.n + direction * offset, correct.d);
    const text = formatRat(candidate);
    if (!used.has(text) && !equalRat(candidate, correct)) return text;
  }
  throw new Error("Unable to construct a unique reduced-form distractor.");
}

function selectionSurface(base: SapCp002PermanentEnglishPackage): RemodeledSurface {
  const correct = parseRat(base.canonicalAnswer);
  if (!correct) throw new Error("Reduced-form selection requires a rational correct answer.");
  const keepUnreducedEquivalent = base.seed % 3 === 0;
  const used = new Set<string>();
  const options: SapCp002V2Option[] = [];
  for (const original of base.options) {
    const parsed = parseRat(original.value);
    const equivalent = parsed !== null && equalRat(parsed, correct);
    if (original.isCorrect) {
      used.add(original.value);
      options.push(Object.freeze({
        value: original.value,
        isCorrect: true,
        misconceptionId: null,
        analysis: "This option has the exact value and is already written in lowest terms.",
        numericEquivalenceToCorrect: true,
        satisfiesRequiredForm: true,
      }));
      continue;
    }
    if (equivalent && !keepUnreducedEquivalent) {
      const replacement = nearbyWrongFraction(correct, used, base.seed + options.length);
      used.add(replacement);
      options.push(Object.freeze({
        value: replacement,
        isCorrect: false,
        misconceptionId: "VALUE_CHANGED_DURING_REDUCTION",
        analysis: "The numerator or denominator was changed without dividing both by the same common factor.",
        numericEquivalenceToCorrect: false,
        satisfiesRequiredForm: false,
      }));
      continue;
    }
    if (equivalent) {
      used.add(original.value);
      options.push(Object.freeze({
        value: original.value,
        isCorrect: false,
        misconceptionId: "UNREDUCED_EQUIVALENT",
        analysis: "This fraction has the correct numerical value but does not satisfy the instruction to choose the lowest-term form.",
        numericEquivalenceToCorrect: true,
        satisfiesRequiredForm: false,
      }));
      continue;
    }
    if (used.has(original.value)) {
      const replacement = nearbyWrongFraction(correct, used, base.seed + options.length + 11);
      used.add(replacement);
      options.push(Object.freeze({
        value: replacement,
        isCorrect: false,
        misconceptionId: "REDUCTION_ARITHMETIC_ERROR",
        analysis: "This value results from changing one fraction component during reduction.",
        numericEquivalenceToCorrect: false,
        satisfiesRequiredForm: false,
      }));
      continue;
    }
    used.add(original.value);
    options.push(Object.freeze({
      value: original.value,
      isCorrect: false,
      misconceptionId: original.misconceptionId ?? "WRONG_REDUCED_VALUE",
      analysis: ensureSentence(original.analysis),
      numericEquivalenceToCorrect: false,
      satisfiesRequiredForm: false,
    }));
  }
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const explanation: SapCp002V2Explanation = Object.freeze({
    answerContract: "LOWEST_TERM_SELECTION",
    methodId: "VALUE_THEN_FORM_CHECK",
    coreConcept: "The required option must satisfy two conditions: exact numerical equivalence and lowest-term form.",
    givenDataAndStrategy: "Evaluate the source expression exactly, reduce the result, then reject options that fail either the value test or the form test.",
    stepByStep: uniqueSentences([
      ...base.explanation.stepByStep,
      keepUnreducedEquivalent
        ? `An unreduced equivalent may have the same value as ${base.canonicalAnswer}, but it is rejected because the stem requires lowest terms`
        : `Only ${base.canonicalAnswer} matches the exact reduced value`,
    ]),
    examSpeedMethod: "Reduce the source result before scanning the options; then check divisibility of both numerator and denominator.",
    commonTraps: misconceptionTraps(options),
    finalAnswer: `The unique option satisfying both value and lowest-term form is ${base.canonicalAnswer}.`,
  });
  return Object.freeze({
    stem: `Evaluate the expression exactly and select the unique option that is both numerically equal to the result and written in lowest terms. ${base.stem}`,
    canonicalAnswer: base.canonicalAnswer,
    verifierAnswer: base.verifierAnswer,
    options: Object.freeze(options),
    correctIndex,
    explanation,
  });
}

function orderedTextOptions(
  values: readonly string[],
  answer: string,
  seed: number,
  analyses: Readonly<Record<string, { id: string; analysis: string }>>,
): { readonly options: readonly SapCp002V2Option[]; readonly correctIndex: number } {
  const correctIndex = (seed + 2) % 4;
  const wrong = values.filter((value) => value !== answer);
  const ordered: string[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) ordered.push(index === correctIndex ? answer : wrong[wrongIndex++]!);
  return Object.freeze({
    correctIndex,
    options: Object.freeze(ordered.map((value) => {
      const evidence = analyses[value] ?? { id: "WRONG_DIAGNOSIS", analysis: "This is not the earliest invalid transformation." };
      return Object.freeze({
        value,
        isCorrect: value === answer,
        misconceptionId: value === answer ? null : evidence.id,
        analysis: value === answer ? "This is the earliest transformation that fails exact-value preservation." : ensureSentence(evidence.analysis),
        numericEquivalenceToCorrect: false,
        satisfiesRequiredForm: value === answer,
      });
    })),
  });
}

function diagnosisCase(base: SapCp002PermanentEnglishPackage): RemodeledSurface {
  const family = (base.seed - 1) % 5;
  const errorSlot = Math.floor((base.seed - 1) / 5) % 4;
  const a = 1 + (base.seed % 4);
  const b = 5 + (base.seed % 5);
  const c = 1 + ((base.seed * 3) % 4);
  const d = 6 + ((base.seed * 5) % 5);
  const left = rat(BigInt(a), BigInt(b));
  const right = rat(BigInt(c), BigInt(d));
  let given: string;
  let validSteps: [string, string, string];
  let invalidSteps: [string, string, string];
  let rule: string;
  let fingerprint: string;

  if (family === 0) {
    const common = b * d;
    const first = a * d;
    const second = c * b;
    const total = first + second;
    given = `${a}/${b} + ${c}/${d}`;
    validSteps = [`(${first} + ${second})/${common}`, `${total}/${common}`, formatRat(add(left, right))];
    invalidSteps = [`(${a} + ${c})/${common}`, `${total}/${b + d}`, formatRat(rat(BigInt(total + 1), BigInt(common)))];
    rule = "Scale both numerators when creating the common denominator, then reduce without changing the value";
    fingerprint = `ADD:${a}/${b}:${c}/${d}:${errorSlot}`;
  } else if (family === 1) {
    const common = b * d;
    const first = a * d;
    const second = c * b;
    const difference = first - second;
    given = `${a}/${b} − ${c}/${d}`;
    validSteps = [`(${first} − ${second})/${common}`, `${difference}/${common}`, formatRat(subtract(left, right))];
    invalidSteps = [`(${second} − ${first})/${common}`, `${first + second}/${common}`, formatRat(rat(BigInt(difference - 1), BigInt(common)))];
    rule = "Preserve subtraction order through common-denominator scaling and reduction";
    fingerprint = `SUB:${a}/${b}:${c}/${d}:${errorSlot}`;
  } else if (family === 2) {
    const p = 2 + (base.seed % 5);
    const q = 2 + ((base.seed * 2) % 5);
    const first = rat(BigInt(2 * p), BigInt(3 * q));
    const second = rat(BigInt(3 * q), BigInt(5));
    const product = multiply(first, second);
    given = `${2 * p}/${3 * q} × ${3 * q}/5`;
    validSteps = [`${2 * p}/1 × 1/5`, `${2 * p}/5`, formatRat(product)];
    invalidSteps = [`${2 * p}/1 × 3/5`, `${2 * p}/${3 * q + 5}`, formatRat(rat(product.n + 1n, product.d))];
    rule = "Cancel only common factors from a numerator and a denominator, then multiply the remaining factors";
    fingerprint = `MUL:${p}:${q}:${errorSlot}`;
  } else if (family === 3) {
    const quotient = divide(left, right);
    given = `${a}/${b} ÷ ${c}/${d}`;
    validSteps = [`${a}/${b} × ${d}/${c}`, `${a * d}/${b * c}`, formatRat(quotient)];
    invalidSteps = [`${b}/${a} × ${c}/${d}`, `${a * c}/${b * d}`, formatRat(rat(quotient.n - 1n, quotient.d))];
    rule = "Keep the dividend and invert only the divisor before multiplying";
    fingerprint = `DIV:${a}/${b}:${c}/${d}:${errorSlot}`;
  } else {
    const whole1 = 1 + (base.seed % 4);
    const whole2 = 1 + ((base.seed * 2) % 3);
    const n1 = 1 + (base.seed % 2);
    const n2 = 1 + ((base.seed + 1) % 2);
    const improper1 = whole1 * b + n1;
    const improper2 = whole2 * d + n2;
    const mixedLeft = rat(BigInt(improper1), BigInt(b));
    const mixedRight = rat(BigInt(improper2), BigInt(d));
    const total = add(mixedLeft, mixedRight);
    given = `${whole1} ${n1}/${b} + ${whole2} ${n2}/${d}`;
    validSteps = [`${improper1}/${b} + ${improper2}/${d}`, `(${improper1 * d} + ${improper2 * b})/${b * d}`, formatRat(total)];
    invalidSteps = [`${whole1 * b}/${b} + ${whole2 * d}/${d}`, `(${improper1 + improper2})/${b * d}`, formatRat(rat(total.n + 1n, total.d))];
    rule = "Convert each mixed number by multiplying the whole part by the denominator and then adding the numerator";
    fingerprint = `MIXED:${whole1}:${n1}/${b}:${whole2}:${n2}/${d}:${errorSlot}`;
  }

  const answer = errorSlot === 3 ? "No error" : `Step ${errorSlot + 1}`;
  const steps = validSteps.map((step, index) => index === errorSlot ? invalidSteps[index]! : step) as [string, string, string];
  const stem = [
    "Review the exact fraction work below. Identify the first invalid transformation, or choose No error if every step is valid.",
    `Given: ${given}`,
    `Step 1: ${steps[0]}`,
    `Step 2: ${steps[1]}`,
    `Step 3: ${steps[2]}`,
  ].join("\n");
  const optionSet = orderedTextOptions(
    ["Step 1", "Step 2", "Step 3", "No error"],
    answer,
    base.seed,
    {
      "Step 1": { id: "FIRST_ERROR_AT_STEP_1", analysis: "Step 1 is wrong only when it changes the operation, scaling, conversion or reciprocal rule." },
      "Step 2": { id: "FIRST_ERROR_AT_STEP_2", analysis: "Step 2 is wrong only if Step 1 is still equivalent and the next arithmetic transition changes value." },
      "Step 3": { id: "FIRST_ERROR_AT_STEP_3", analysis: "Step 3 is wrong only when the earlier transformations are valid and the final reduction changes value." },
      "No error": { id: "MISSED_INVALID_TRANSFORMATION", analysis: "No error is valid only when all three transformations preserve the exact value." },
    },
  );
  const explanation: SapCp002V2Explanation = Object.freeze({
    answerContract: "FIRST_ERROR_SELECTION",
    methodId: `DIAGNOSIS_${family}_${errorSlot}`,
    coreConcept: "The first incorrect step is the earliest transformation that fails to preserve the exact value of the preceding line.",
    givenDataAndStrategy: ensureSentence(rule),
    stepByStep: uniqueSentences([
      `Check Step 1 against the governing rule: ${errorSlot === 0 ? "it changes the value" : "it is valid"}`,
      errorSlot === 0 ? "Stop at Step 1 because later lines are consequences" : `Check Step 2: ${errorSlot === 1 ? "it is the first value-changing line" : "it remains equivalent"}`,
      errorSlot === 2 ? "Step 3 is the first invalid transformation" : errorSlot === 3 ? "All three transformations preserve the exact value" : `The required answer is ${answer}`,
    ]),
    examSpeedMethod: "Compare consecutive lines and stop at the first failed equivalence instead of recomputing every later line.",
    commonTraps: misconceptionTraps(optionSet.options),
    finalAnswer: answer === "No error" ? "All displayed transformations are valid, so the answer is No error." : `The first invalid transformation is ${answer}.`,
  });
  return Object.freeze({
    stem,
    canonicalAnswer: answer,
    verifierAnswer: answer,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    explanation,
    mathematicalFingerprint: fingerprint,
  });
}

function remodelSurface(base: SapCp002PermanentEnglishPackage): RemodeledSurface {
  if (base.permanentQlId === "SAP-QL-031") return comparisonSurface(base);
  if (base.permanentQlId === "SAP-QL-032") return selectionSurface(base);
  if (base.permanentQlId === "SAP-QL-033") return diagnosisCase(base);
  return Object.freeze({
    stem: base.stem,
    canonicalAnswer: base.canonicalAnswer,
    verifierAnswer: base.verifierAnswer,
    options: optionSetFromBase(base),
    correctIndex: base.correctIndex,
  });
}

function difficultyFor(
  base: SapCp002PermanentEnglishPackage,
  stem: string,
  meta: ModeMeta,
): { readonly score: number; readonly difficulty: SapCp002V2Difficulty; readonly evidence: readonly string[] } {
  const fractions = extractFractionTokens(stem);
  const operators = stem.match(/[+×÷−]|\bof\b|⁄/g) ?? [];
  const groups = stem.match(/[()[\]{}⟦⟧]/g) ?? [];
  const negativeCount = (stem.match(/−(?=\d|\()/g) ?? []).length;
  const reciprocalCount = (stem.match(/\breciprocal\b|1\s*\/\s*[[(]|÷/gi) ?? []).length;
  const numbers = (stem.match(/\d+/g) ?? []).map(Number);
  const maxNumber = numbers.length ? Math.max(...numbers) : 0;
  let score = meta.baseDifficultyWeight;
  score += Math.min(3, Math.max(0, fractions.length - 2));
  score += Math.min(2, Math.max(0, operators.length - 1));
  score += Math.min(2, Math.floor(groups.length / 4));
  score += Math.min(2, negativeCount);
  score += Math.min(2, reciprocalCount);
  if (base.taskDirection === "INVERSE") score += 1;
  if (base.taskDirection === "COMPARISON" || base.taskDirection === "SELECTION") score += 1;
  if (base.taskDirection === "DIAGNOSIS") score += 2;
  if (maxNumber >= 30) score += 1;
  if (maxNumber >= 100) score += 1;
  if (/([−-])\s*\(([^)]+)\)/.test(stem)) score += 1;
  if (/([+−-])\s*([−-]?\d+\/\d+)\s*\1\s*\2/.test(stem)) score -= 2;
  score = Math.max(1, score);
  const difficulty: SapCp002V2Difficulty = score <= 4 ? "EASY" : score <= 7 ? "MEDIUM" : "HARD";
  const evidence = Object.freeze([
    `${fractions.length} visible fraction values`,
    `${operators.length} material operation markers`,
    `${Math.floor(groups.length / 2)} explicit groups or fraction blocks`,
    `${negativeCount} material sign changes`,
    `answer direction ${base.taskDirection}`,
    `structural score ${score}`,
  ]);
  return Object.freeze({ score, difficulty, evidence });
}

function buildExplanation(
  base: SapCp002PermanentEnglishPackage,
  surface: RemodeledSurface,
  meta: ModeMeta,
): SapCp002V2Explanation {
  if (surface.explanation) return surface.explanation;
  if (base.taskDirection === "INVERSE") return inverseExplanation(base, surface.options, surface.canonicalAnswer, meta);
  return genericForwardExplanation(base, surface.options, surface.canonicalAnswer);
}

function sentenceHashes(explanation: SapCp002V2Explanation): readonly string[] {
  const source = [
    explanation.coreConcept,
    explanation.givenDataAndStrategy,
    ...explanation.stepByStep,
    explanation.examSpeedMethod,
    ...explanation.commonTraps,
    explanation.finalAnswer,
  ];
  return Object.freeze(source.map(normalizeSentence).filter((value) => value.length >= 18));
}

function validate(
  base: SapCp002PermanentEnglishPackage,
  surface: RemodeledSurface,
  explanation: SapCp002V2Explanation,
  meta: ModeMeta,
): SapCp002V2Validation {
  const errors: string[] = [];
  if (surface.canonicalAnswer !== surface.verifierAnswer) errors.push("Canonical and verifier answers differ.");
  if (surface.options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(surface.options.map((option) => option.value)).size !== 4) errors.push("Option strings are not unique.");
  if (surface.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be keyed correct.");
  if (!surface.options[surface.correctIndex]?.isCorrect) errors.push("Correct index does not identify the keyed option.");
  if (surface.options[surface.correctIndex]?.value !== surface.canonicalAnswer) errors.push("Correct option text does not match the canonical answer.");
  const hashes = sentenceHashes(explanation);
  if (new Set(hashes).size !== hashes.length) errors.push("The explanation contains a repeated sentence.");
  const allExplanation = [
    explanation.coreConcept,
    explanation.givenDataAndStrategy,
    ...explanation.stepByStep,
    explanation.examSpeedMethod,
    ...explanation.commonTraps,
    explanation.finalAnswer,
  ].join(" ");
  if (BANNED_EXPLANATION.test(allExplanation)) errors.push("Banned generic explanation boilerplate is present.");
  const wordCount = allExplanation.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount > 150) errors.push("Explanation exceeds the 150-word review threshold.");
  if (explanation.stepByStep.length < 2) errors.push("At least two material solution steps are required.");
  if (explanation.commonTraps.length !== 3) errors.push("Exactly three concrete trap explanations are required.");
  if (base.taskDirection === "COMPARISON" && /numerator and denominator|greatest common factor/i.test(explanation.finalAnswer)) {
    errors.push("Comparison conclusion contains fraction-reduction boilerplate.");
  }
  if (base.taskDirection === "DIAGNOSIS" && /numerator and denominator|greatest common factor/i.test(explanation.finalAnswer)) {
    errors.push("Diagnosis conclusion contains fraction-reduction boilerplate.");
  }
  if (base.permanentQlId === "SAP-QL-031") {
    if (/Cannot be determined/i.test(surface.options.map((option) => option.value).join(" "))) errors.push("Comparison options contain the structurally impossible cannot-determine distractor.");
    if (/\+\s*(\d+\/\d+)\s*[−-]\s*\1/.test(surface.stem)) errors.push("Comparison stem retains synthetic plus-minus padding.");
  }
  const numericEquivalentOptionCount = surface.options.filter((option) => option.numericEquivalenceToCorrect).length;
  const fullConditionCorrectOptionCount = surface.options.filter((option) => option.satisfiesRequiredForm).length;
  if (base.permanentQlId === "SAP-QL-032") {
    if (fullConditionCorrectOptionCount !== 1) errors.push("Reduced-form selection must have exactly one option satisfying value and form.");
    if (numericEquivalentOptionCount > 2) errors.push("Too many options are numerically equivalent to the correct value.");
    if (numericEquivalentOptionCount === 2 && !/lowest terms/i.test(allExplanation)) errors.push("Equivalent unreduced distractor is not explicitly rejected by form.");
  }
  if (base.temporaryPrototypeId === "SAP-CP002-PROT-MISSING-NUMERATOR" && meta.subtype !== "MISSING_NUMERATOR") {
    errors.push("Missing-numerator metadata is incorrect.");
  }
  if (base.temporaryPrototypeId === "SAP-CP002-PROT-MISSING-DENOMINATOR" && meta.subtype !== "MISSING_DENOMINATOR") {
    errors.push("Missing-denominator metadata is incorrect.");
  }
  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    sentenceHashes: hashes,
    numericEquivalentOptionCount,
    fullConditionCorrectOptionCount,
    explanationWordCount: wordCount,
  });
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${label} must be a positive integer.`);
}

export function generateSapCp002ExamReadinessV2Package(
  prototypeId: SapCp002PrototypeId,
  seed: number,
): SapCp002ExamReadinessV2Package {
  assertPositiveInteger(seed, "SAP-CP-002 exam-readiness v2 seed");
  const base = generateSapCp002PermanentEnglishPackage(prototypeId, seed);
  const meta = MODE_META[prototypeId];
  const surface = remodelSurface(base);
  const explanation = buildExplanation(base, surface, meta);
  const difficulty = difficultyFor(base, surface.stem, meta);
  const validation = validate(base, surface, explanation, meta);
  const mathematicalFingerprint = surface.mathematicalFingerprint ?? base.mathematicalFingerprint;
  const payloadFingerprint = [
    base.permanentQlId,
    prototypeId,
    mathematicalFingerprint,
    normalizeSentence(surface.stem),
    surface.canonicalAnswer,
  ].join("|");
  const lifecycle = Object.freeze({
    permanentQlId: base.permanentQlId,
    identityStatus: "PERMANENT_ID_RETAINED" as const,
    contentStatus: "EDITORIALLY_UNFROZEN_V2_HUMAN_REVIEW_PENDING" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });
  return Object.freeze({
    ...base,
    mathematicalFingerprint,
    difficulty: difficulty.difficulty,
    difficultyScore: difficulty.score,
    difficultyEvidence: difficulty.evidence,
    solveModeLabel: meta.label,
    solveModeSubtype: meta.subtype,
    stem: surface.stem,
    canonicalAnswer: surface.canonicalAnswer,
    verifierAnswer: surface.verifierAnswer,
    options: surface.options,
    correctIndex: surface.correctIndex,
    explanation,
    editorialStatus: "EDITORIALLY_UNFROZEN_REMODELED_V2",
    reviewDecision: "AUTO_VALIDATED_HUMAN_REVIEW_PENDING",
    humanReviewStatus: "PENDING",
    reviewVersion: "SAP_CP002_EXAM_READINESS_V2",
    payloadFingerprint,
    validation,
    lifecycle,
  });
}

export function generateSapCp002ExamReadinessV2Sweep(
  seedsPerPrototype: number,
): readonly SapCp002ExamReadinessV2Package[] {
  assertPositiveInteger(seedsPerPrototype, "SAP-CP-002 exam-readiness v2 sweep size");
  const prototypeIds = Object.keys(MODE_META) as SapCp002PrototypeId[];
  const packages: SapCp002ExamReadinessV2Package[] = [];
  for (const prototypeId of prototypeIds) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp002ExamReadinessV2Package(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}

export const SAP_CP002_EXAM_READINESS_V2_STATE = Object.freeze({
  sourceAudit: "SAP-CP002-300Q-EXAM-READINESS-CRITICAL-REVIEW.md" as const,
  permanentIdentityPolicy: "RETAIN_SAP_QL_017_TO_033" as const,
  editorialState: "UNFROZEN_REMODELED_V2_HUMAN_REVIEW_PENDING" as const,
  reviewVersion: "SAP_CP002_EXAM_READINESS_V2" as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});
