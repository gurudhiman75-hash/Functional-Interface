import type { SapCp002ExamReadinessV2Package, SapCp002V2Difficulty } from "../exam-readiness-v2/types";
import type { SapCp002V3Explanation, SapCp002V3Option, SapCp002V3SolveModeSubtype, SapCp002V3Validation } from "./types";
import {
  BANNED, type ExprNode, type Rat, ensureSentence, extractExpression, formatRat, gcd, normalizeSentence,
  parseRat, renderNode, solveNode, uniqueSentences, visibleOperands,
} from "./exact";

function coreConcept(pkg: SapCp002ExamReadinessV2Package): string {
  const byQl: Readonly<Record<string, string>> = Object.freeze({
    "SAP-QL-017": "For addition or subtraction, use equivalent fractions with the least common denominator needed by the visible operands.",
    "SAP-QL-018": "Cancel only common factors from a numerator and a denominator before multiplying the remaining factors.",
    "SAP-QL-019": "Division by a fraction means multiplication by the reciprocal of the divisor; the dividend is not inverted.",
    "SAP-QL-020": "Apply multiplication or division before the outer addition or subtraction, while keeping the integer part in scope.",
    "SAP-QL-021": "Convert every mixed number to an improper fraction before carrying out the operation.",
    "SAP-QL-022": "Evaluate the grouped fraction first, then apply the scoped fraction-of operation.",
    "SAP-QL-023": "Treat the numerator and denominator as complete blocks before dividing them.",
    "SAP-QL-024": "Preserve every sign and bracket until the enclosed fraction work is complete.",
    "SAP-QL-025": "Use (x + y)(x − y) = x² − y² when the two visible brackets form a sum-and-difference pair.",
    "SAP-QL-026": "Evaluate the complete grouped expression before taking its reciprocal.",
    "SAP-QL-027": "A complement is the whole minus the total used part.",
    "SAP-QL-028": "Evaluate a continued fraction from the deepest denominator outward.",
    "SAP-QL-029": "Isolate the missing numerator or denominator and then use exact equivalence or cross multiplication.",
    "SAP-QL-030": "Isolate the missing fraction operand with the inverse operation and verify it by substitution.",
    "SAP-QL-031": "Compare complete evaluated values, not visible numerators or denominators in isolation.",
    "SAP-QL-032": "The correct choice must satisfy both numerical equivalence and the lowest-terms condition.",
    "SAP-QL-033": "The answer is the earliest line that fails to preserve the exact value of the preceding line.",
  });
  return byQl[pkg.permanentQlId] ?? "Use exact rational arithmetic and preserve the displayed operation order.";
}

function examSpeedMethod(pkg: SapCp002ExamReadinessV2Package): string {
  const byQl: Readonly<Record<string, string>> = Object.freeze({
    "SAP-QL-017": "Reduce visible fractions first when useful, then use the least common denominator rather than an arbitrary larger denominator.",
    "SAP-QL-018": "Cross-cancel before multiplying; do not multiply large numerators and denominators first.",
    "SAP-QL-019": "Write one reciprocal line, cancel, and multiply.",
    "SAP-QL-025": "Recognize the difference-of-squares pattern before expanding either bracket.",
    "SAP-QL-027": "Combine the used parts first and subtract their total from one.",
    "SAP-QL-028": "Work from the innermost fraction outward one layer at a time.",
    "SAP-QL-031": "Reduce both sides or compare by one exact cross product; decimals are unnecessary.",
    "SAP-QL-032": "Find the reduced result first, then scan the options for both value and form.",
    "SAP-QL-033": "Compare consecutive lines and stop at the first failed equivalence.",
  });
  return byQl[pkg.permanentQlId] ?? "Use the shortest exact route and verify the final value once.";
}

export function explanationFor(
  pkg: SapCp002ExamReadinessV2Package,
  stem: string,
  answer: string,
  answerSemanticValue: string,
  options: readonly SapCp002V3Option[],
  ast: ExprNode | null,
  visible: readonly string[],
): SapCp002V3Explanation {
  let steps: readonly string[];
  let methodId: string;
  let strategy: string;
  let finalAnswer: string;
  if (pkg.permanentQlId === "SAP-QL-031") {
    methodId = "EXACT_RELATION_AND_REASON_V3";
    strategy = "Evaluate A and B independently, subtract B from A, and use the sign of the exact difference to select the only valid relation-and-reason statement.";
    steps = uniqueSentences([
      "Simplify the complete expression labelled A.",
      "Simplify the complete expression labelled B.",
      `The exact comparison gives ${answerSemanticValue}`,
    ]);
    finalAnswer = `Hence, ${answerSemanticValue}.`;
  } else if (pkg.permanentQlId === "SAP-QL-032") {
    methodId = "VALUE_THEN_LOWEST_TERM_FORM_V3";
    strategy = "Evaluate the exact visible expression, reduce the result once, and reject any option that fails either the value test or the lowest-terms test.";
    steps = uniqueSentences([
      `The exact expression reduces to ${answer}`,
      "Check each option for numerical equivalence.",
      `Among equivalent forms, select ${answer} because its numerator and denominator have no common factor greater than one`,
    ]);
    finalAnswer = `The unique equivalent option in lowest terms is ${answer}.`;
  } else if (pkg.permanentQlId === "SAP-QL-033") {
    methodId = `${pkg.explanation.methodId}_V3`;
    strategy = "Check each displayed transformation against the preceding line and stop at the first value-changing step.";
    steps = uniqueSentences(pkg.explanation.stepByStep);
    finalAnswer = pkg.explanation.finalAnswer;
  } else if (pkg.taskDirection === "INVERSE") {
    methodId = `${pkg.solveModeSubtype}_VISIBLE_EQUALITY_V3`;
    strategy = `Use only the values visible in the equality${visible.length ? `: ${visible.join(", ")}` : ""}; isolate the blank before calculating.`;
    steps = uniqueSentences([
      "Write the displayed equality without replacing any visible fraction by an unintroduced equivalent form.",
      "Apply the inverse operation needed to isolate the blank.",
      `The isolated value is ${answer}`,
      `Substituting ${answer} makes the displayed equality true`,
    ]);
    finalAnswer = `The missing value is ${answer}.`;
  } else if (ast) {
    const solved = solveNode(ast);
    methodId = pkg.permanentQlId === "SAP-QL-018"
      ? "VISIBLE_CROSS_CANCELLATION_V3"
      : pkg.permanentQlId === "SAP-QL-019"
        ? "VISIBLE_DIVIDEND_RECIPROCAL_V3"
        : pkg.permanentQlId === "SAP-QL-025"
          ? "DIFFERENCE_OF_SQUARES_V3"
          : "VISIBLE_OPERAND_EXACT_ROUTE_V3";
    const expression = extractExpression(stem) ?? renderNode(ast);
    strategy = `Start from the exact displayed expression ${expression}; every equivalent fraction used below is introduced in the same line.`;
    steps = uniqueSentences([...solved.steps, `The reduced result is ${formatRat(solved.value)}`]).slice(0, 7);
    finalAnswer = `Therefore, the answer is ${answer}.`;
  } else {
    methodId = "VISIBLE_OPERAND_SAFE_FALLBACK_V3";
    strategy = `Use the exact values shown in the question${visible.length ? `: ${visible.join(", ")}` : ""}; do not introduce hidden operand aliases.`;
    steps = uniqueSentences([
      "Apply the displayed operations in their exact order.",
      `Reduce the completed result to ${answer}`,
    ]);
    finalAnswer = `Therefore, the answer is ${answer}.`;
  }
  const traps = options
    .filter((option) => !option.isCorrect)
    .map((option) => `Option ${option.displayIndex} (${option.value}): ${option.analysis}`)
    .slice(0, 3);
  return Object.freeze({
    answerContract: pkg.explanation.answerContract,
    methodId,
    coreConcept: ensureSentence(coreConcept(pkg)),
    givenDataAndStrategy: ensureSentence(strategy),
    stepByStep: Object.freeze(steps),
    examSpeedMethod: ensureSentence(examSpeedMethod(pkg)),
    commonTraps: Object.freeze(traps.map(ensureSentence)),
    finalAnswer: ensureSentence(finalAnswer),
    visibleOperandSet: visible,
    provenanceStatus: "VISIBLE_OPERANDS_ONLY",
  });
}

export function semanticDifficulty(
  pkg: SapCp002ExamReadinessV2Package,
  subtype: SapCp002V3SolveModeSubtype,
  ast: ExprNode | null,
  stem: string,
): { readonly score: number; readonly difficulty: SapCp002V2Difficulty; readonly evidence: readonly string[] } {
  const baseWeights: Readonly<Record<string, number>> = Object.freeze({
    FRACTION_SUM_DIFFERENCE: 1,
    FRACTION_PRODUCT_COMPLETE_REDUCTION: 2,
    FRACTION_DIVISION_RECIPROCAL: 3,
    FRACTION_OPERATION_CHAIN: 3,
    INTEGER_WITH_FRACTIONAL_PRODUCT: 3,
    MIXED_NUMBER_CONVERSION: 3,
    SCOPED_FRACTION_OF_GROUP: 3,
    COMPLETE_BLOCK_COMPLEX_FRACTION: 5,
    SIGNED_FRACTION_BRACKET_SCOPE: 4,
    SUM_DIFFERENCE_IDENTITY: 2,
    RECIPROCAL_OF_COMPLETE_GROUP: 3,
    FRACTION_COMPLEMENT: 2,
    BOUNDED_CONTINUED_FRACTION: 5,
    MISSING_NUMERATOR: 2,
    MISSING_DENOMINATOR: 3,
    MISSING_FRACTION_OPERAND: 3,
    EXACT_FRACTION_COMPARISON: 3,
    VALUE_AND_LOWEST_TERM_FORM: 3,
    FIRST_INVALID_TRANSFORMATION: 4,
    INTEGER_WITH_GROUPED_FRACTION_OPERATION: 3,
  });
  const expression = extractExpression(stem) ?? "";
  const fractions = visibleOperands(stem).map(parseRat).filter((value): value is Rat => value !== null);
  const denominators = new Set(fractions.map((value) => value.d.toString()));
  const operations = expression.match(/[+\-*/]/g)?.length ?? 0;
  const signChanges = expression.match(/-(?=\d|\()/g)?.length ?? 0;
  const reciprocalCount = expression.match(/\//g)?.length ?? 0;
  const depth = (() => {
    let current = 0;
    let maximum = 0;
    for (const character of expression) {
      if (character === "(") maximum = Math.max(maximum, ++current);
      if (character === ")") current = Math.max(0, current - 1);
    }
    return maximum;
  })();
  let score = baseWeights[subtype] ?? 2;
  score += Math.min(2, Math.max(0, operations - 1));
  score += Math.min(2, Math.max(0, denominators.size - 1));
  score += Math.min(2, Math.max(0, depth - 1));
  score += Math.min(2, signChanges);
  if (pkg.taskDirection === "INVERSE") score += 1;
  if (pkg.taskDirection === "COMPARISON" || pkg.taskDirection === "SELECTION") score += 1;
  if (pkg.taskDirection === "DIAGNOSIS") {
    const family = Number(pkg.explanation.methodId.match(/DIAGNOSIS_(\d+)/)?.[1] ?? 0);
    score += family >= 2 ? 2 : 1;
    if (/No error/i.test(pkg.canonicalAnswer)) score += 1;
  }
  if (pkg.permanentQlId === "SAP-QL-018" && ast?.kind === "BINARY" && ast.op === "*") {
    const left = solveNode(ast.left).value;
    const right = solveNode(ast.right).value;
    if (gcd(left.n, right.d) > 1n || gcd(right.n, left.d) > 1n) score -= 1;
  }
  if (pkg.canonicalAnswer === "0" || pkg.canonicalAnswer === "1") score -= 1;
  score = Math.max(1, score);
  const difficulty: SapCp002V2Difficulty = score <= 4 ? "EASY" : score <= 7 ? "MEDIUM" : "HARD";
  return Object.freeze({
    score,
    difficulty,
    evidence: Object.freeze([
      `solve subtype ${subtype}`,
      `${operations} semantic operations`,
      `${denominators.size} distinct reduced denominator families`,
      `expression depth ${depth}`,
      `${signChanges} material sign changes`,
      `${reciprocalCount} visible division or fraction-bar markers`,
      `semantic score ${score}`,
    ]),
  });
}

function sentenceHashes(explanation: SapCp002V3Explanation): readonly string[] {
  return Object.freeze([
    explanation.coreConcept,
    explanation.givenDataAndStrategy,
    ...explanation.stepByStep,
    explanation.examSpeedMethod,
    ...explanation.commonTraps,
    explanation.finalAnswer,
  ].map(normalizeSentence).filter((value) => value.length >= 18));
}

export function validateV3(
  pkg: SapCp002ExamReadinessV2Package,
  subtype: SapCp002V3SolveModeSubtype,
  stem: string,
  answer: string,
  semanticAnswer: string,
  options: readonly SapCp002V3Option[],
  correctIndex: number,
  explanation: SapCp002V3Explanation,
  canonicalKey: string,
  generationIdentity: string,
): SapCp002V3Validation {
  const errors: string[] = [];
  if (options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(options.map((option) => option.value)).size !== 4) errors.push("Option strings are not unique.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (!options[correctIndex]?.isCorrect) errors.push("Correct index does not identify the correct option.");
  if (options[correctIndex]?.value !== answer) errors.push("Correct option text does not match the V3 answer.");
  if (options.some((option, index) => option.displayIndex !== index + 1)) errors.push("Display indices do not match final option order.");
  if (new Set(sentenceHashes(explanation)).size !== sentenceHashes(explanation).length) errors.push("Explanation repeats a material sentence.");
  const text = [
    explanation.coreConcept,
    explanation.givenDataAndStrategy,
    ...explanation.stepByStep,
    explanation.examSpeedMethod,
    ...explanation.commonTraps,
    explanation.finalAnswer,
  ].join(" ");
  if (BANNED.test(text)) errors.push("Explanation contains banned or self-justifying boilerplate.");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount > 150) errors.push("Explanation exceeds 150 words.");
  if (explanation.stepByStep.length < 2) errors.push("Explanation needs at least two material steps.");
  if (explanation.commonTraps.length !== 3) errors.push("Explanation needs exactly three option-specific traps.");
  const optionOrderSafe = options.every((option, index) => option.displayIndex === index + 1)
    && options[correctIndex]?.isCorrect === true;
  const visibleOperandProvenancePassed = explanation.provenanceStatus === "VISIBLE_OPERANDS_ONLY"
    && explanation.visibleOperandSet.every((operand) => stem.includes(operand));
  if (!visibleOperandProvenancePassed) errors.push("Explanation provenance is not tied to the visible operands.");
  const strictRouteQl = pkg.permanentQlId === "SAP-QL-017"
    || pkg.permanentQlId === "SAP-QL-031"
    || pkg.permanentQlId === "SAP-QL-032"
    || pkg.permanentQlId === "SAP-QL-033";
  const distractorReproducibilityPassed = options
    .filter((option) => !option.isCorrect)
    .every((option) => option.reproducibleFromVisibleStem
      && (!strictRouteQl || option.routeOperands.every((operand) => stem.includes(operand))));
  if (!distractorReproducibilityPassed) errors.push("At least one distractor is not reproducible from the visible question.");
  const generationIdentityPassed = generationIdentity.split("|").length === 6;
  if (!generationIdentityPassed) errors.push("Generation identity does not use the V3 six-field schema.");
  const canonicalIdentityPassed = canonicalKey.startsWith("SAP_CP002_CANONICAL_V3|");
  if (!canonicalIdentityPassed) errors.push("Canonical semantic identity is missing.");
  if (pkg.permanentQlId === "SAP-QL-020") {
    if (!new Set(["FRACTION_OPERATION_CHAIN", "INTEGER_WITH_FRACTIONAL_PRODUCT"]).has(subtype)) {
      errors.push("QL-020 was not split into its two actual solve subtypes.");
    }
  }
  if (pkg.permanentQlId === "SAP-QL-031") {
    if (/cannot be determined/i.test(options.map((option) => option.value).join(" "))) errors.push("Comparison contains cannot-determine distractor.");
    if (!options.every((option) => /because/i.test(option.value))) errors.push("Comparison options are not homogeneous relation-and-reason statements.");
    if (!/^A\s*[<>=]\s*B$/.test(semanticAnswer)) errors.push("Comparison semantic answer is malformed.");
  }
  const numericEquivalentOptionCount = options.filter((option) => option.numericEquivalenceToCorrect).length;
  const fullConditionCorrectOptionCount = options.filter((option) => option.satisfiesRequiredForm).length;
  if (pkg.permanentQlId === "SAP-QL-032" && fullConditionCorrectOptionCount !== 1) {
    errors.push("Reduced-form selection needs exactly one value-and-form correct option.");
  }
  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    sentenceHashes: sentenceHashes(explanation),
    numericEquivalentOptionCount,
    fullConditionCorrectOptionCount,
    explanationWordCount: wordCount,
    optionOrderSafe,
    visibleOperandProvenancePassed,
    distractorReproducibilityPassed,
    generationIdentityPassed,
    canonicalIdentityPassed,
    difficultyInvariantPassed: true,
  });
}
