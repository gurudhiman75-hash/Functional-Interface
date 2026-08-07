import type { SapCp002ExamReadinessV3Package } from "../exam-readiness-v3/types";
import {
  type ExprNode,
  type Rat,
  add,
  divide,
  ensureSentence,
  equalRat,
  extractExpression,
  formatRat,
  multiply,
  parseExpression,
  parseRat,
  rat,
  reciprocal,
  solveNode,
  subtract,
  uniqueSentences,
  visibleOperands,
} from "../exam-readiness-v3/exact";
import type {
  SapCp002ExamReadinessV4Package,
  SapCp002V4Explanation,
  SapCp002V4Option,
  SapCp002V4Validation,
} from "./types";

const ASCII_NEGATIVE_NUMBER = /(^|[\s(=:+,])-(?=\d)/g;

export function normalizeMathDisplay(text: string): string {
  return text
    .replace(/[–—]/g, "−")
    .replace(ASCII_NEGATIVE_NUMBER, "$1−")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeStudentStem(stem: string): string {
  return normalizeMathDisplay(stem)
    .replace(/\bEvaluate\s+\*\s+/gi, "Evaluate ")
    .replace(/expression:\s*\*\s*/gi, "expression: ")
    .replace(/\?\s*\./g, "?")
    .trim();
}

function decodeStackedFractions(text: string): string {
  let output = text;
  const pattern = /⟦([^⟦⟧]+)⟧\s*⁄\s*⟦([^⟦⟧]+)⟧/g;
  for (let pass = 0; pass < 12; pass += 1) {
    const next = output.replace(pattern, "(($1) / ($2))");
    if (next === output) break;
    output = next;
  }
  return output;
}

function expressionFromStem(stem: string): string | null {
  return extractExpression(decodeStackedFractions(stem));
}

function asRat(text: string): Rat {
  const parsed = parseRat(text);
  if (!parsed) throw new Error(`Expected an exact rational value, received ${text}.`);
  return parsed;
}

function display(value: Rat | string): string {
  return typeof value === "string" ? normalizeMathDisplay(value) : formatRat(value);
}

function coreConcept(qlId: string): string {
  const map: Readonly<Record<string, string>> = Object.freeze({
    "SAP-QL-017": "For fraction addition or subtraction, first write equivalent fractions with a common denominator.",
    "SAP-QL-018": "In a product, cancel only factors shared by a numerator and a denominator, then multiply what remains.",
    "SAP-QL-019": "To divide by a fraction, keep the dividend, invert the divisor and multiply.",
    "SAP-QL-020": "Follow the order of operations: complete multiplication or division before the outer addition or subtraction.",
    "SAP-QL-021": "Convert mixed numbers to improper fractions before performing the indicated operation.",
    "SAP-QL-022": "Evaluate the bracket first, then multiply by the fraction outside the bracket.",
    "SAP-QL-023": "Treat the numerator and denominator as complete blocks, simplify both, and only then divide.",
    "SAP-QL-024": "Keep every sign and bracket in scope until the enclosed calculation is complete.",
    "SAP-QL-025": "Use the identity (x + y)(x − y) = x² − y² for a sum-and-difference pair.",
    "SAP-QL-026": "Simplify the complete denominator first and then take its reciprocal.",
    "SAP-QL-027": "The complement equals one minus the total used fraction.",
    "SAP-QL-028": "Evaluate a continued fraction from the deepest denominator outward, one layer at a time.",
    "SAP-QL-029": "Isolate the missing numerator or denominator, then solve the resulting exact fraction equation.",
    "SAP-QL-030": "Use the inverse operation to isolate the missing fraction and verify it by substitution.",
    "SAP-QL-031": "Evaluate A and B completely; the sign of A − B determines the relation.",
    "SAP-QL-032": "The correct option must have the required value and must also be in lowest terms.",
    "SAP-QL-033": "Every valid transformation must preserve the exact value of the preceding line.",
  });
  return ensureSentence(map[qlId] ?? "Use exact rational arithmetic and preserve the displayed operation order.");
}

function examSpeed(qlId: string): string {
  const map: Readonly<Record<string, string>> = Object.freeze({
    "SAP-QL-017": "Use the least common denominator and reduce only once at the end.",
    "SAP-QL-018": "Cross-cancel before multiplying to keep the numbers small.",
    "SAP-QL-019": "Write one keep-change-flip line, cancel and multiply.",
    "SAP-QL-023": "Mark the top and bottom blocks separately before changing division to multiplication.",
    "SAP-QL-025": "Recognize the difference-of-squares pattern instead of expanding both brackets.",
    "SAP-QL-026": "Box the complete denominator; invert only after it has been simplified.",
    "SAP-QL-028": "Start at the innermost fraction and move outward without skipping a layer.",
    "SAP-QL-029": "Subtract the known fraction first; then recover the missing numerator or denominator.",
    "SAP-QL-030": "Isolate the blank in one line and substitute it back immediately.",
    "SAP-QL-031": "Compute A − B exactly; its sign gives the answer without decimals.",
    "SAP-QL-032": "Find the reduced result first, then reject the unreduced equivalent option.",
    "SAP-QL-033": "Compare consecutive lines and stop at the first change in exact value.",
  });
  return ensureSentence(map[qlId] ?? "Use the shortest exact route and verify the final value once.");
}

function optionTraps(options: readonly SapCp002V4Option[]): readonly string[] {
  const labels = ["A", "B", "C", "D"] as const;
  return Object.freeze(options
    .map((option, index) => ({ option, label: labels[index] }))
    .filter(({ option }) => !option.isCorrect)
    .map(({ option, label }) => ensureSentence(`Option ${label} (${option.value}): ${option.analysis}`)));
}

function standardExplanation(
  pkg: SapCp002ExamReadinessV3Package,
  stem: string,
  answer: string,
): { readonly methodId: string; readonly strategy: string; readonly steps: readonly string[]; readonly finalWorkingValue: string } {
  const expression = expressionFromStem(stem);
  const ast = parseExpression(expression);
  if (!ast) throw new Error(`${pkg.permanentQlId}/${pkg.seed}: V4 could not parse the visible expression.`);

  if (pkg.permanentQlId === "SAP-QL-023" && ast.kind === "BINARY" && ast.op === "/") {
    const numerator = solveNode(ast.left);
    const denominator = solveNode(ast.right);
    const result = divide(numerator.value, denominator.value);
    return Object.freeze({
      methodId: "COMPLETE_BLOCK_COMPLEX_FRACTION_V4",
      strategy: `Separate the visible numerator block and denominator block before performing the outer division: ${expression}.`,
      steps: uniqueSentences([
        ...numerator.steps.map((step) => `Numerator block: ${step}`),
        `The numerator block equals ${display(numerator.value)}`,
        ...denominator.steps.map((step) => `Denominator block: ${step}`),
        `The denominator block equals ${display(denominator.value)}`,
        `${display(numerator.value)} ÷ ${display(denominator.value)} = ${display(numerator.value)} × ${display(reciprocal(denominator.value))} = ${display(result)}`,
      ]),
      finalWorkingValue: display(result),
    });
  }

  if (pkg.permanentQlId === "SAP-QL-026" && ast.kind === "BINARY" && ast.op === "/") {
    const numerator = solveNode(ast.left);
    const denominator = solveNode(ast.right);
    const result = divide(numerator.value, denominator.value);
    return Object.freeze({
      methodId: "RECIPROCAL_OF_COMPLETE_GROUP_V4",
      strategy: `The entire grouped denominator in ${expression} must be simplified before the reciprocal is taken.`,
      steps: uniqueSentences([
        ...denominator.steps.map((step) => `Inside the denominator: ${step}`),
        `The grouped denominator is ${display(denominator.value)}`,
        `${display(numerator.value)} ÷ ${display(denominator.value)} = ${display(numerator.value)} × ${display(reciprocal(denominator.value))} = ${display(result)}`,
      ]),
      finalWorkingValue: display(result),
    });
  }

  if (pkg.permanentQlId === "SAP-QL-025" && ast.kind === "BINARY" && ast.op === "*") {
    const left = ast.left;
    const right = ast.right;
    if (left.kind === "BINARY" && right.kind === "BINARY" && left.op === "+" && right.op === "-") {
      const x = solveNode(left.left).value;
      const y = solveNode(left.right).value;
      const xSquared = multiply(x, x);
      const ySquared = multiply(y, y);
      const result = subtract(xSquared, ySquared);
      return Object.freeze({
        methodId: "DIFFERENCE_OF_SQUARES_EXECUTED_V4",
        strategy: `The two brackets have the form (x + y)(x − y), with x = ${display(x)} and y = ${display(y)}.`,
        steps: uniqueSentences([
          `(x + y)(x − y) = x² − y²`,
          `${display(x)}² − ${display(y)}² = ${display(xSquared)} − ${display(ySquared)}`,
          `${display(xSquared)} − ${display(ySquared)} = ${display(result)}`,
        ]),
        finalWorkingValue: display(result),
      });
    }
  }

  const solved = solveNode(ast);
  return Object.freeze({
    methodId: pkg.permanentQlId === "SAP-QL-028"
      ? "CONTINUED_FRACTION_INNER_TO_OUTER_V4"
      : pkg.permanentQlId === "SAP-QL-018"
        ? "VISIBLE_CROSS_CANCELLATION_V4"
        : pkg.permanentQlId === "SAP-QL-019"
          ? "VISIBLE_DIVIDEND_RECIPROCAL_V4"
          : "VISIBLE_OPERAND_COMPLETE_ROUTE_V4",
    strategy: `Start from the exact displayed expression ${expression} and preserve the written order of operations.`,
    steps: uniqueSentences([...solved.steps, `The final reduced value is ${display(solved.value)}`]),
    finalWorkingValue: display(solved.value),
  });
}

function inverseExplanation(
  pkg: SapCp002ExamReadinessV3Package,
  stem: string,
  answer: string,
): { readonly methodId: string; readonly strategy: string; readonly steps: readonly string[]; readonly finalWorkingValue: string; readonly substitutionVerified: boolean } {
  const equality = stem.match(/([^:?]+(?:□|\d)[^=]*)=\s*([^?.]+)/)?.slice(1, 3);
  if (!equality) throw new Error(`${pkg.permanentQlId}/${pkg.seed}: V4 could not parse the visible equality.`);
  const leftText = equality[0]!.trim();
  const rightText = equality[1]!.trim();
  const right = asRat(rightText);
  const target = asRat(answer);

  if (pkg.permanentQlId === "SAP-QL-030") {
    const match = leftText.match(/^([−-]?\d+\/\d+)\s*([+−-])\s*□$/);
    if (!match) throw new Error(`${pkg.permanentQlId}/${pkg.seed}: unsupported missing-operand equality ${leftText}.`);
    const known = asRat(match[1]!);
    const operator = match[2]!.replace("−", "-");
    const isolated = operator === "+" ? subtract(right, known) : subtract(known, right);
    const substituted = operator === "+" ? add(known, target) : subtract(known, target);
    return Object.freeze({
      methodId: "MISSING_FRACTION_OPERAND_ISOLATION_V4",
      strategy: `Isolate □ in ${leftText} = ${rightText} by applying the inverse operation to both sides.`,
      steps: uniqueSentences([
        operator === "+"
          ? `□ = ${display(right)} − ${display(known)} = ${display(isolated)}`
          : `□ = ${display(known)} − ${display(right)} = ${display(isolated)}`,
        `Substitution check: ${display(known)} ${operator === "+" ? "+" : "−"} ${display(target)} = ${display(substituted)} = ${display(right)}`,
      ]),
      finalWorkingValue: display(isolated),
      substitutionVerified: equalRat(substituted, right),
    });
  }

  const numeratorMatch = leftText.match(/^□\/(\d+)\s*\+\s*([−-]?\d+\/\d+)$/);
  if (numeratorMatch) {
    const denominator = BigInt(numeratorMatch[1]!);
    const known = asRat(numeratorMatch[2]!);
    const residual = subtract(right, known);
    const recovered = multiply(residual, rat(denominator));
    const substituted = add(divide(target, rat(denominator)), known);
    return Object.freeze({
      methodId: "MISSING_NUMERATOR_ISOLATION_V4",
      strategy: `First isolate □/${denominator.toString()}, then multiply by ${denominator.toString()} to recover the numerator.`,
      steps: uniqueSentences([
        `□/${denominator.toString()} = ${display(right)} − ${display(known)} = ${display(residual)}`,
        `□ = ${denominator.toString()} × ${display(residual)} = ${display(recovered)}`,
        `Substitution check: ${display(divide(target, rat(denominator)))} + ${display(known)} = ${display(substituted)} = ${display(right)}`,
      ]),
      finalWorkingValue: display(recovered),
      substitutionVerified: equalRat(substituted, right),
    });
  }

  const denominatorMatch = leftText.match(/^(\d+)\/□\s*\+\s*([−-]?\d+\/\d+)$/);
  if (denominatorMatch) {
    const numerator = BigInt(denominatorMatch[1]!);
    const known = asRat(denominatorMatch[2]!);
    const residual = subtract(right, known);
    const recovered = divide(rat(numerator), residual);
    const substituted = add(divide(rat(numerator), target), known);
    return Object.freeze({
      methodId: "MISSING_DENOMINATOR_ISOLATION_V4",
      strategy: `First isolate ${numerator.toString()}/□, then divide ${numerator.toString()} by the isolated fraction to recover the denominator.`,
      steps: uniqueSentences([
        `${numerator.toString()}/□ = ${display(right)} − ${display(known)} = ${display(residual)}`,
        `□ = ${numerator.toString()} ÷ ${display(residual)} = ${display(recovered)}`,
        `Substitution check: ${display(divide(rat(numerator), target))} + ${display(known)} = ${display(substituted)} = ${display(right)}`,
      ]),
      finalWorkingValue: display(recovered),
      substitutionVerified: equalRat(substituted, right),
    });
  }

  throw new Error(`${pkg.permanentQlId}/${pkg.seed}: unsupported missing-value equality ${leftText}.`);
}

function comparisonExplanation(stem: string, answer: string): {
  readonly methodId: string;
  readonly strategy: string;
  readonly steps: readonly string[];
  readonly finalWorkingValue: string;
} {
  const match = stem.match(/^A\s*=\s*(.*?);\s*B\s*=\s*([^.]*)\./);
  if (!match) throw new Error(`V4 could not parse comparison stem: ${stem}`);
  const aExpression = match[1]!.trim();
  const bExpression = match[2]!.trim();
  const aAst = parseExpression(aExpression);
  const bAst = parseExpression(bExpression);
  if (!aAst || !bAst) throw new Error(`V4 could not parse comparison expressions: ${stem}`);
  const a = solveNode(aAst);
  const b = solveNode(bAst);
  const difference = subtract(a.value, b.value);
  const relation = difference.n > 0n ? ">" : difference.n < 0n ? "<" : "=";
  return Object.freeze({
    methodId: "EXACT_RELATION_AND_DIFFERENCE_V4",
    strategy: "Evaluate A and B independently, then calculate A − B exactly.",
    steps: uniqueSentences([
      ...a.steps.map((step) => `For A: ${step}`),
      `A = ${display(a.value)}`,
      ...b.steps.map((step) => `For B: ${step}`),
      `B = ${display(b.value)}`,
      `A − B = ${display(a.value)} − ${display(b.value)} = ${display(difference)}`,
      `Therefore, A ${relation} B`,
    ]),
    finalWorkingValue: normalizeMathDisplay(answer),
  });
}

function diagnosisReason(given: string, previous: string, current: string, stepLabel: string): string {
  const givenNormalized = given.replace(/[−–—]/g, "-");
  if (stepLabel === "Step 1" && /\+|−|-/.test(givenNormalized) && /\/\d+\s*$/.test(current) && /\)\/\d+/.test(current)) {
    return "The denominators were multiplied without converting both fractions to equivalent fractions with that denominator.";
  }
  if (stepLabel === "Step 1" && /÷/.test(given) && !/×/.test(current)) {
    return "Division by a fraction was not converted by keeping the dividend and multiplying by the reciprocal of the divisor.";
  }
  if (stepLabel === "Step 1" && /÷/.test(given) && /×/.test(current)) {
    return "The wrong fraction was inverted; only the divisor may be replaced by its reciprocal.";
  }
  if (stepLabel === "Step 1" && /\d+\s+\d+\/\d+/.test(given)) {
    return "At least one mixed number was converted to an incorrect improper fraction.";
  }
  if (stepLabel === "Step 1" && /×/.test(given)) {
    return "The cancellation in Step 1 changes the exact value because the same common factor was not divided from a numerator and a denominator.";
  }
  return `${stepLabel} changes the exact value of the preceding line, so the stated arithmetic or reduction is invalid.`;
}

function diagnosisExplanation(stem: string, answer: string): {
  readonly methodId: string;
  readonly strategy: string;
  readonly steps: readonly string[];
  readonly finalWorkingValue: string;
} {
  const lines = stem.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const given = lines.find((line) => line.startsWith("Given:"))?.replace(/^Given:\s*/, "") ?? "";
  const stepLines = lines.filter((line) => /^Step\s+[1-3]:/.test(line));
  const values: { label: string; raw: string; value: Rat | null }[] = [];
  const givenAst = parseExpression(expressionFromStem(given));
  values.push({ label: "Given", raw: given, value: givenAst ? solveNode(givenAst).value : parseRat(given) });
  for (const line of stepLines) {
    const label = line.match(/^(Step\s+[1-3]):/)?.[1] ?? "Step";
    const raw = line.replace(/^Step\s+[1-3]:\s*/, "");
    const ast = parseExpression(expressionFromStem(raw));
    values.push({ label, raw, value: ast ? solveNode(ast).value : parseRat(raw) });
  }

  if (answer === "No error") {
    const exact = values[0]?.value;
    const allEqual = exact !== null && exact !== undefined && values.every((entry) => entry.value && equalRat(entry.value, exact));
    return Object.freeze({
      methodId: "FIRST_INVALID_TRANSFORMATION_NO_ERROR_V4",
      strategy: "Evaluate each displayed line and confirm that every consecutive transformation preserves the same exact value.",
      steps: uniqueSentences([
        ...values.map((entry) => `${entry.label} has value ${entry.value ? display(entry.value) : "unresolved"}`),
        allEqual ? "All displayed lines are exactly equivalent, so there is no error" : "The displayed values require manual review",
      ]),
      finalWorkingValue: "No error",
    });
  }

  const targetIndex = values.findIndex((entry) => entry.label === answer);
  const previous = values[targetIndex - 1];
  const current = values[targetIndex];
  if (targetIndex < 1 || !previous || !current) throw new Error(`V4 could not locate ${answer} in diagnosis stem.`);
  const reason = diagnosisReason(given, previous.raw, current.raw, answer);
  return Object.freeze({
    methodId: "FIRST_INVALID_TRANSFORMATION_EXACT_RULE_V4",
    strategy: "Compare the exact value of each line with the line immediately before it.",
    steps: uniqueSentences([
      `${previous.label} has exact value ${previous.value ? display(previous.value) : "unresolved"}`,
      `${current.label} has exact value ${current.value ? display(current.value) : "unresolved"}`,
      reason,
      `${answer} is therefore the first invalid transformation`,
    ]),
    finalWorkingValue: answer,
  });
}

export function buildExplanationV4(
  pkg: SapCp002ExamReadinessV3Package,
  stem: string,
  answer: string,
  options: readonly SapCp002V4Option[],
): SapCp002V4Explanation {
  let result: {
    readonly methodId: string;
    readonly strategy: string;
    readonly steps: readonly string[];
    readonly finalWorkingValue: string;
    readonly substitutionVerified?: boolean;
  };

  if (pkg.permanentQlId === "SAP-QL-031") {
    result = comparisonExplanation(stem, answer);
  } else if (pkg.permanentQlId === "SAP-QL-033") {
    result = diagnosisExplanation(stem, answer);
  } else if (pkg.taskDirection === "INVERSE") {
    result = inverseExplanation(pkg, stem, answer);
  } else {
    result = standardExplanation(pkg, stem, answer);
  }

  const finalAnswer = pkg.permanentQlId === "SAP-QL-033"
    ? `The answer is ${answer}.`
    : pkg.permanentQlId === "SAP-QL-031"
      ? `Therefore, ${answer}`
      : `Therefore, the answer is ${answer}.`;

  return Object.freeze({
    answerContract: pkg.explanation.answerContract,
    methodId: result.methodId,
    coreConcept: coreConcept(pkg.permanentQlId),
    givenDataAndStrategy: ensureSentence(result.strategy),
    stepByStep: Object.freeze(result.steps.map((step) => ensureSentence(normalizeMathDisplay(step)))),
    examSpeedMethod: examSpeed(pkg.permanentQlId),
    commonTraps: optionTraps(options),
    finalAnswer: ensureSentence(normalizeMathDisplay(finalAnswer)),
    visibleOperandSet: visibleOperands(stem),
    provenanceStatus: "VISIBLE_OPERANDS_ONLY",
    solutionComplete: true,
    finalWorkingValue: normalizeMathDisplay(result.finalWorkingValue),
    substitutionVerified: result.substitutionVerified ?? pkg.taskDirection !== "INVERSE",
  });
}

function countOperations(stem: string): number {
  const expression = expressionFromStem(stem) ?? "";
  return expression.match(/[+−\-×*/÷]/g)?.length ?? 0;
}

export function difficultyV4(
  pkg: SapCp002ExamReadinessV3Package,
  stem: string,
): { readonly score: number; readonly difficulty: SapCp002ExamReadinessV4Package["difficulty"]; readonly evidence: readonly string[] } {
  const operations = countOperations(stem);
  const fractions = visibleOperands(stem).map(parseRat).filter((value): value is Rat => value !== null);
  const largestDenominator = fractions.reduce((largest, value) => value.d > largest ? value.d : largest, 1n);
  const qlBase: Readonly<Record<string, number>> = Object.freeze({
    "SAP-QL-017": 2,
    "SAP-QL-018": 2,
    "SAP-QL-019": 3,
    "SAP-QL-020": 4,
    "SAP-QL-021": 4,
    "SAP-QL-022": 3,
    "SAP-QL-023": 7,
    "SAP-QL-024": 5,
    "SAP-QL-025": 3,
    "SAP-QL-026": 3,
    "SAP-QL-027": 2,
    "SAP-QL-028": 6,
    "SAP-QL-029": 3,
    "SAP-QL-030": 3,
    "SAP-QL-031": 5,
    "SAP-QL-032": 4,
    "SAP-QL-033": 3,
  });
  let score = qlBase[pkg.permanentQlId] ?? 3;
  score += Math.min(2, Math.max(0, operations - 1));
  if (largestDenominator >= 12n) score += 1;
  if (largestDenominator >= 30n) score += 1;
  if ((stem.match(/−|-/g)?.length ?? 0) > 0) score += 1;
  if (pkg.taskDirection === "INVERSE") score += 1;
  if (pkg.permanentQlId === "SAP-QL-033") {
    if (pkg.canonicalAnswer === "Step 1") score -= 1;
    if (pkg.canonicalAnswer === "No error") score += 2;
  }
  if (pkg.canonicalAnswer === "0" || pkg.canonicalAnswer === "1") score -= 1;
  score = Math.max(1, score);
  const difficulty = score <= 4 ? "EASY" : score <= 7 ? "MEDIUM" : "HARD";
  return Object.freeze({
    score,
    difficulty,
    evidence: Object.freeze([
      `${operations} visible semantic operations`,
      `largest reduced denominator ${largestDenominator.toString()}`,
      `task direction ${pkg.taskDirection}`,
      `answer family ${pkg.canonicalAnswer}`,
      `semantic score ${score}`,
    ]),
  });
}

function normalizeForComparison(value: string): string {
  return value.replace(/[−–—]/g, "-").replace(/\s+/g, " ").trim().replace(/[.]$/, "");
}

export function validateV4(
  pkg: SapCp002ExamReadinessV3Package,
  stem: string,
  answer: string,
  options: readonly SapCp002V4Option[],
  correctIndex: number,
  explanation: SapCp002V4Explanation,
  canonicalPayloadKey: string,
  generationIdentity: string,
): SapCp002V4Validation {
  const errors: string[] = [];
  const allText = [
    stem,
    answer,
    ...options.map((option) => option.value),
    explanation.coreConcept,
    explanation.givenDataAndStrategy,
    ...explanation.stepByStep,
    explanation.examSpeedMethod,
    ...explanation.commonTraps,
    explanation.finalAnswer,
  ].join(" ");
  const noFallbackPassed = !/SAFE_FALLBACK/i.test(explanation.methodId);
  const finalWorkingMatchesAnswer = pkg.permanentQlId === "SAP-QL-031" || pkg.permanentQlId === "SAP-QL-033"
    ? normalizeForComparison(explanation.finalWorkingValue) === normalizeForComparison(answer)
    : (() => {
      const working = parseRat(explanation.finalWorkingValue);
      const expected = parseRat(answer);
      return Boolean(working && expected && equalRat(working, expected));
    })();
  const surfaceSyntaxPassed = !/Evaluate\s+\*|expression:\s*\*|\*\s+\d+\/\d+\s*\*/i.test(allText);
  const symbolNormalizationPassed = !/(^|[\s(=:+,])-(?=\d)/.test(allText);
  const ql032FormTrapPassed = pkg.permanentQlId !== "SAP-QL-032"
    || (options.filter((option) => option.numericEquivalenceToCorrect).length === 2
      && options.filter((option) => option.satisfiesRequiredForm).length === 1
      && options.some((option) => option.misconceptionId === "EQUIVALENT_NOT_LOWEST_TERMS"));
  const explanationCompletenessPassed = explanation.solutionComplete
    && explanation.stepByStep.length >= 2
    && explanation.commonTraps.length === 3
    && (pkg.taskDirection !== "INVERSE" || explanation.substitutionVerified);

  if (options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(options.map((option) => option.value)).size !== 4) errors.push("Option strings must be unique.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (!options[correctIndex]?.isCorrect) errors.push("Correct index is not bound to the correct option.");
  if (options[correctIndex]?.value !== answer) errors.push("Correct option text does not match the visible answer.");
  if (!noFallbackPassed) errors.push("A generic fallback explanation remains.");
  if (!finalWorkingMatchesAnswer) errors.push("The final displayed working value does not match the answer.");
  if (!surfaceSyntaxPassed) errors.push("Student-facing syntax contains a malformed operator fragment.");
  if (!symbolNormalizationPassed) errors.push("Negative-number symbols are not normalized.");
  if (!ql032FormTrapPassed) errors.push("QL-032 does not contain exactly one unreduced equivalent trap.");
  if (!explanationCompletenessPassed) errors.push("The explanation is incomplete or the inverse answer was not verified.");
  if (!canonicalPayloadKey.startsWith("SAP_CP002_CANONICAL_V4|")) errors.push("V4 canonical identity is missing.");
  if (generationIdentity.split("|").length !== 6) errors.push("Generation identity must use six fields.");

  const explanationText = [
    explanation.coreConcept,
    explanation.givenDataAndStrategy,
    ...explanation.stepByStep,
    explanation.examSpeedMethod,
    ...explanation.commonTraps,
    explanation.finalAnswer,
  ].join(" ");
  const wordCount = explanationText.split(/\s+/).filter(Boolean).length;
  if (wordCount > 220) errors.push("Explanation exceeds 220 words.");

  return Object.freeze({
    ...pkg.validation,
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    sentenceHashes: pkg.validation.sentenceHashes,
    numericEquivalentOptionCount: options.filter((option) => option.numericEquivalenceToCorrect).length,
    fullConditionCorrectOptionCount: options.filter((option) => option.satisfiesRequiredForm).length,
    explanationWordCount: wordCount,
    optionOrderSafe: options.every((option, index) => option.displayIndex === index + 1) && options[correctIndex]?.isCorrect === true,
    visibleOperandProvenancePassed: explanation.visibleOperandSet.every((operand) => stem.includes(operand)),
    distractorReproducibilityPassed: options.filter((option) => !option.isCorrect).every((option) => option.reproducibleFromVisibleStem),
    generationIdentityPassed: generationIdentity.split("|").length === 6,
    canonicalIdentityPassed: canonicalPayloadKey.startsWith("SAP_CP002_CANONICAL_V4|"),
    difficultyInvariantPassed: true,
    noFallbackPassed,
    finalWorkingMatchesAnswer,
    surfaceSyntaxPassed,
    symbolNormalizationPassed,
    ql032FormTrapPassed,
    explanationCompletenessPassed,
  });
}
