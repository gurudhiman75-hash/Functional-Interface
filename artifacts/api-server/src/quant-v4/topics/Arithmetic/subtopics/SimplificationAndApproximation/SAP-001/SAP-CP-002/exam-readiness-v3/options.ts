import type { SapCp002ExamReadinessV2Package } from "../exam-readiness-v2/types";
import type { SapCp002V3Option, SapCp002V3SolveModeSubtype } from "./types";
import {
  type ExprNode, type Rat, add, canonicalNode, divide, equalRat, extractExpression, formatRat,
  multiply, normalizeFingerprint, parseRat, rat, reciprocal, solveNode, subtract,
} from "./exact";

interface OptionDraft {
  readonly value: string;
  readonly semanticValue?: string;
  readonly misconceptionId: string | null;
  readonly analysis: string;
  readonly routeOperands: readonly string[];
  readonly reproducibleFromVisibleStem: boolean;
  readonly isCorrect: boolean;
  readonly numericEquivalenceToCorrect: boolean;
  readonly satisfiesRequiredForm: boolean;
}

export function splitMode(pkg: SapCp002ExamReadinessV2Package): {
  readonly label: string;
  readonly subtype: SapCp002V3SolveModeSubtype;
} {
  if (pkg.permanentQlId !== "SAP-QL-020") {
    return Object.freeze({ label: pkg.solveModeLabel, subtype: pkg.solveModeSubtype });
  }
  if (pkg.temporaryPrototypeId === "SAP-CP002-PROT-MIXED-FRACTION-OPERATION-CHAIN") {
    return Object.freeze({ label: "Fraction operation chain", subtype: "FRACTION_OPERATION_CHAIN" });
  }
  return Object.freeze({ label: "Integer with fractional product", subtype: "INTEGER_WITH_FRACTIONAL_PRODUCT" });
}

export function canonicalPayloadKey(
  pkg: SapCp002ExamReadinessV2Package,
  subtype: SapCp002V3SolveModeSubtype,
  ast: ExprNode | null,
): string {
  const semanticMath = ast ? canonicalNode(ast) : normalizeFingerprint(pkg.mathematicalFingerprint);
  return [
    "SAP_CP002_CANONICAL_V3",
    pkg.permanentQlId,
    subtype,
    pkg.taskDirection,
    semanticMath,
    pkg.canonicalAnswer.replace(/−/g, "-"),
  ].join("|");
}

function hash32(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function shuffled<T>(values: readonly T[], key: string): readonly T[] {
  const output = [...values];
  let state = hash32(key) || 0x9e3779b9;
  const next = (): number => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return state >>> 0;
  };
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swap = next() % (index + 1);
    [output[index], output[swap]] = [output[swap]!, output[index]!];
  }
  return Object.freeze(output);
}

export function makeOption(draft: OptionDraft, displayIndex = 0): SapCp002V3Option {
  return Object.freeze({
    ...draft,
    semanticValue: draft.semanticValue ?? draft.value,
    displayIndex,
  });
}

function uniqueWrongCandidates(
  correct: Rat,
  candidates: readonly Omit<OptionDraft, "isCorrect" | "numericEquivalenceToCorrect" | "satisfiesRequiredForm">[],
  visible: readonly string[],
): readonly OptionDraft[] {
  const used = new Set<string>([formatRat(correct)]);
  const output: OptionDraft[] = [];
  for (const candidate of candidates) {
    const parsed = parseRat(candidate.value);
    if (!parsed || equalRat(parsed, correct) || used.has(candidate.value)) continue;
    used.add(candidate.value);
    output.push(Object.freeze({
      ...candidate,
      routeOperands: candidate.routeOperands.length > 0 ? candidate.routeOperands : visible,
      isCorrect: false,
      numericEquivalenceToCorrect: false,
      satisfiesRequiredForm: false,
    }));
    if (output.length === 3) break;
  }
  let delta = 1n;
  while (output.length < 3) {
    const fallback = rat(correct.n + delta, correct.d);
    const value = formatRat(fallback);
    delta += 1n;
    if (equalRat(fallback, correct) || used.has(value)) continue;
    used.add(value);
    output.push(Object.freeze({
      value,
      semanticValue: value,
      misconceptionId: "FINAL_NUMERATOR_ARITHMETIC_SLIP",
      analysis: "The final numerator was changed by one after the exact operation had already been set up.",
      routeOperands: visible,
      reproducibleFromVisibleStem: true,
      isCorrect: false,
      numericEquivalenceToCorrect: false,
      satisfiesRequiredForm: false,
    }));
  }
  return Object.freeze(output);
}

function firstAddSub(node: ExprNode): { readonly op: "+" | "-"; readonly left: ExprNode; readonly right: ExprNode } | null {
  if (node.kind !== "BINARY") return null;
  if (node.op === "+" || node.op === "-") return Object.freeze({ op: node.op, left: node.left, right: node.right });
  return firstAddSub(node.left) ?? firstAddSub(node.right);
}

function ql017Options(pkg: SapCp002ExamReadinessV2Package, ast: ExprNode, visible: readonly string[]): readonly OptionDraft[] {
  const correct = parseRat(pkg.canonicalAnswer);
  const firstPair = firstAddSub(ast);
  if (!correct || !firstPair) return numericOptions(pkg, ast, visible);
  const left = solveNode(firstPair.left).value;
  const right = solveNode(firstPair.right).value;
  const sign = firstPair.op === "+" ? 1n : -1n;
  const direct = rat(left.n + sign * right.n, left.d + right.d);
  const productDenominator = rat(left.n + sign * right.n, left.d * right.d);
  const crossNumeratorAddedDenominator = rat(
    left.n * right.d + sign * right.n * left.d,
    left.d + right.d,
  );
  const candidates = [
    {
      value: formatRat(direct),
      misconceptionId: "ADDED_NUMERATORS_AND_DENOMINATORS",
      analysis: "The numerators and denominators were combined directly instead of first making equivalent fractions.",
      routeOperands: visible.slice(0, 2),
      reproducibleFromVisibleStem: true,
    },
    {
      value: formatRat(productDenominator),
      misconceptionId: "USED_PRODUCT_DENOMINATOR_WITHOUT_CROSS_SCALING",
      analysis: "The denominators were multiplied, but the numerators were not cross-scaled to equivalent fractions.",
      routeOperands: visible.slice(0, 2),
      reproducibleFromVisibleStem: true,
    },
    {
      value: formatRat(crossNumeratorAddedDenominator),
      misconceptionId: "CROSS_MULTIPLIED_BUT_ADDED_DENOMINATORS",
      analysis: "The cross-scaled numerator was paired with an added denominator, so the resulting fraction is not equivalent.",
      routeOperands: visible.slice(0, 2),
      reproducibleFromVisibleStem: true,
    },
    {
      value: formatRat(rat(-correct.n, correct.d)),
      misconceptionId: "FINAL_SIGN_REVERSED",
      analysis: "The exact magnitude is retained but the final sign is reversed.",
      routeOperands: visible,
      reproducibleFromVisibleStem: true,
    },
  ];
  return Object.freeze([
    Object.freeze({
      value: pkg.canonicalAnswer,
      semanticValue: pkg.canonicalAnswer,
      misconceptionId: null,
      analysis: "This is the exact result obtained from the visible fractions and is already in lowest terms.",
      routeOperands: visible,
      reproducibleFromVisibleStem: true,
      isCorrect: true,
      numericEquivalenceToCorrect: true,
      satisfiesRequiredForm: true,
    }),
    ...uniqueWrongCandidates(correct, candidates, visible),
  ]);
}

function specialNumericCandidates(pkg: SapCp002ExamReadinessV2Package, ast: ExprNode, visible: readonly string[]): readonly Omit<OptionDraft, "isCorrect" | "numericEquivalenceToCorrect" | "satisfiesRequiredForm">[] {
  if (ast.kind !== "BINARY") return [];
  const left = solveNode(ast.left).value;
  const right = solveNode(ast.right).value;
  const candidates: Omit<OptionDraft, "isCorrect" | "numericEquivalenceToCorrect" | "satisfiesRequiredForm">[] = [];
  const addCandidate = (value: Rat, id: string, analysis: string): void => {
    candidates.push(Object.freeze({
      value: formatRat(value),
      misconceptionId: id,
      analysis,
      routeOperands: visible,
      reproducibleFromVisibleStem: true,
    }));
  };
  if (pkg.permanentQlId === "SAP-QL-018" || ast.op === "*") {
    addCandidate(add(left, right), "ADDED_INSTEAD_OF_MULTIPLIED", "The two factors were added instead of multiplied.");
    addCandidate(subtract(left, right), "SUBTRACTED_INSTEAD_OF_MULTIPLIED", "The second factor was subtracted instead of multiplying the factors.");
  }
  if (pkg.permanentQlId === "SAP-QL-019" || ast.op === "/") {
    addCandidate(multiply(left, right), "RECIPROCAL_OMITTED", "The divisor was multiplied as written instead of being inverted first.");
    if (left.n !== 0n) addCandidate(divide(right, left), "DIVISION_REVERSED", "The divisor and dividend were reversed.");
  }
  if (pkg.permanentQlId === "SAP-QL-027" && ast.op === "-") {
    addCandidate(right, "USED_PART_INSTEAD_OF_COMPLEMENT", "The used part was selected instead of subtracting it from the whole.");
    addCandidate(add(left, right), "ADDED_TO_WHOLE", "The used fractions were added to the whole instead of subtracted.");
  }
  if (pkg.permanentQlId === "SAP-QL-025") {
    addCandidate(add(multiply(left, left), multiply(right, right)), "SUM_OF_SQUARES", "The difference-of-squares identity was changed into a sum of squares.");
  }
  if (ast.op === "+") addCandidate(subtract(left, right), "FINAL_OPERATION_REVERSED", "The last addition was performed as subtraction.");
  if (ast.op === "-") addCandidate(add(left, right), "SUBTRACTION_CHANGED_TO_ADDITION", "The final subtraction sign was treated as addition.");
  return Object.freeze(candidates);
}

function alteredRoot(node: ExprNode): Rat | null {
  if (node.kind !== "BINARY") return null;
  const left = solveNode(node.left).value;
  const right = solveNode(node.right).value;
  if (node.op === "+") return subtract(left, right);
  if (node.op === "-") return subtract(right, left);
  if (node.op === "*") return add(left, right);
  if (left.n === 0n) return null;
  return divide(right, left);
}

function numericOptions(pkg: SapCp002ExamReadinessV2Package, ast: ExprNode, visible: readonly string[]): readonly OptionDraft[] {
  const correct = parseRat(pkg.canonicalAnswer);
  if (!correct) return Object.freeze(pkg.options.map((option) => Object.freeze({
    ...option,
    semanticValue: option.value,
    routeOperands: visible,
    reproducibleFromVisibleStem: true,
  })) as unknown as readonly OptionDraft[]);
  const solved = solveNode(ast);
  const candidates = [...specialNumericCandidates(pkg, ast, visible)];
  if (ast.kind === "BINARY") {
    const left = solveNode(ast.left).value;
    candidates.push(Object.freeze({
      value: formatRat(left),
      misconceptionId: "OMITTED_FINAL_OPERATION",
      analysis: "The last operation was omitted, so only the left-hand intermediate value was reported.",
      routeOperands: visible,
      reproducibleFromVisibleStem: true,
    }));
  }
  const altered = alteredRoot(ast);
  if (altered) candidates.push(Object.freeze({
    value: formatRat(altered),
    misconceptionId: "FINAL_OPERATION_MISREAD",
    analysis: "The final operation was replaced by a different operation or reversed order.",
    routeOperands: visible,
    reproducibleFromVisibleStem: true,
  }));
  candidates.push(Object.freeze({
    value: formatRat(rat(-correct.n, correct.d)),
    misconceptionId: "FINAL_SIGN_REVERSED",
    analysis: "The exact magnitude was found but the final sign was reversed.",
    routeOperands: visible,
    reproducibleFromVisibleStem: true,
  }));
  if (correct.n !== 0n) candidates.push(Object.freeze({
    value: formatRat(reciprocal(correct)),
    misconceptionId: "FINAL_RECIPROCAL_TAKEN",
    analysis: "The reciprocal of the completed result was reported instead of the result itself.",
    routeOperands: visible,
    reproducibleFromVisibleStem: true,
  }));
  const wrong = uniqueWrongCandidates(correct, candidates, visible);
  return Object.freeze([
    Object.freeze({
      value: formatRat(solved.value),
      semanticValue: formatRat(solved.value),
      misconceptionId: null,
      analysis: "This value follows from the exact visible expression and is in lowest terms.",
      routeOperands: visible,
      reproducibleFromVisibleStem: true,
      isCorrect: true,
      numericEquivalenceToCorrect: true,
      satisfiesRequiredForm: true,
    }),
    ...wrong,
  ]);
}

function inverseOptions(pkg: SapCp002ExamReadinessV2Package, visible: readonly string[]): readonly OptionDraft[] {
  const correct = parseRat(pkg.canonicalAnswer);
  if (!correct) return Object.freeze(pkg.options.map((option) => Object.freeze({
    ...option,
    semanticValue: option.value,
    routeOperands: visible,
    reproducibleFromVisibleStem: true,
  })) as unknown as readonly OptionDraft[]);
  const candidates: Omit<OptionDraft, "isCorrect" | "numericEquivalenceToCorrect" | "satisfiesRequiredForm">[] = [
    {
      value: formatRat(rat(-correct.n, correct.d)),
      misconceptionId: "INVERSE_OPERATION_SIGN_ERROR",
      analysis: "The inverse operation was applied with the wrong sign.",
      routeOperands: visible,
      reproducibleFromVisibleStem: true,
    },
    {
      value: correct.n === 0n ? formatRat(rat(1n)) : formatRat(reciprocal(correct)),
      misconceptionId: "RECIPROCAL_OF_REQUIRED_VALUE",
      analysis: "The reciprocal of the isolated value was selected.",
      routeOperands: visible,
      reproducibleFromVisibleStem: true,
    },
    {
      value: formatRat(rat(correct.n + 1n, correct.d)),
      misconceptionId: "ISOLATION_ARITHMETIC_SLIP",
      analysis: "The blank was isolated correctly, but the final numerator arithmetic is one unit too large.",
      routeOperands: visible,
      reproducibleFromVisibleStem: true,
    },
    {
      value: formatRat(rat(correct.n, correct.d + 1n)),
      misconceptionId: "DENOMINATOR_RECOVERY_SLIP",
      analysis: "The recovered denominator is one unit too large.",
      routeOperands: visible,
      reproducibleFromVisibleStem: true,
    },
  ];
  return Object.freeze([
    Object.freeze({
      value: pkg.canonicalAnswer,
      semanticValue: pkg.canonicalAnswer,
      misconceptionId: null,
      analysis: "Substitution of this value makes the displayed equality exact.",
      routeOperands: visible,
      reproducibleFromVisibleStem: true,
      isCorrect: true,
      numericEquivalenceToCorrect: true,
      satisfiesRequiredForm: true,
    }),
    ...uniqueWrongCandidates(correct, candidates, visible),
  ]);
}

function comparisonOptions(pkg: SapCp002ExamReadinessV2Package, visible: readonly string[]): {
  readonly stem: string;
  readonly answer: string;
  readonly semantic: string;
  readonly options: readonly OptionDraft[];
} {
  const relation = pkg.canonicalAnswer.match(/A\s*([<>=])\s*B/)?.[1] ?? pkg.canonicalAnswer.trim();
  const claim = relation === ">" ? "A − B > 0" : relation === "<" ? "A − B < 0" : "A − B = 0";
  const correct = `A ${relation} B because exact evaluation gives ${claim}.`;
  const alternatives = [">", "<", "="].filter((candidate) => candidate !== relation);
  const wrong = alternatives.map((candidate) => {
    const wrongClaim = candidate === ">" ? "A − B > 0" : candidate === "<" ? "A − B < 0" : "A − B = 0";
    return Object.freeze({
      value: `A ${candidate} B because exact evaluation gives ${wrongClaim}.`,
      semanticValue: `A ${candidate} B`,
      misconceptionId: "WRONG_EXACT_RELATION",
      analysis: "This relation contradicts the sign of the exact difference A − B.",
      routeOperands: visible,
      reproducibleFromVisibleStem: true,
      isCorrect: false,
      numericEquivalenceToCorrect: false,
      satisfiesRequiredForm: false,
    });
  });
  const heuristic = Object.freeze({
    value: `A ${relation} B because the larger visible denominator alone decides the result.`,
    semanticValue: `A ${relation} B`,
    misconceptionId: "INVALID_DENOMINATOR_HEURISTIC",
    analysis: "The relation may match, but denominator size alone is not a valid reason for comparing complete fraction expressions.",
    routeOperands: visible,
    reproducibleFromVisibleStem: true,
    isCorrect: false,
    numericEquivalenceToCorrect: false,
    satisfiesRequiredForm: false,
  });
  const correctDraft = Object.freeze({
    value: correct,
    semanticValue: `A ${relation} B`,
    misconceptionId: null,
    analysis: "Both complete expressions are evaluated exactly, and the sign of A − B proves the relation.",
    routeOperands: visible,
    reproducibleFromVisibleStem: true,
    isCorrect: true,
    numericEquivalenceToCorrect: true,
    satisfiesRequiredForm: true,
  });
  const baseStem = pkg.stem
    .replace(/Evaluate A and B exactly\. Which statement is correct\?/gi, "")
    .replace(/Choose the correct relation between A and B\.?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return Object.freeze({
    stem: `${baseStem} Evaluate A and B exactly. Which option gives both the correct relation and a valid reason?`.trim(),
    answer: correct,
    semantic: `A ${relation} B`,
    options: Object.freeze([correctDraft, ...wrong, heuristic]),
  });
}

export function ownedOptions(pkg: SapCp002ExamReadinessV2Package, ast: ExprNode | null, visible: readonly string[]): {
  readonly stem: string;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly answerSemanticValue: string;
  readonly options: readonly OptionDraft[];
} {
  if (pkg.permanentQlId === "SAP-QL-031") {
    const comparison = comparisonOptions(pkg, visible);
    return Object.freeze({
      stem: comparison.stem,
      canonicalAnswer: comparison.answer,
      verifierAnswer: comparison.answer,
      answerSemanticValue: comparison.semantic,
      options: comparison.options,
    });
  }
  if (pkg.permanentQlId === "SAP-QL-032" || pkg.permanentQlId === "SAP-QL-033") {
    const expression = extractExpression(pkg.stem);
    const stem = pkg.permanentQlId === "SAP-QL-032" && expression
      ? `Evaluate ${expression}. Which option has the same value and is already in lowest terms?`
      : pkg.stem;
    return Object.freeze({
      stem,
      canonicalAnswer: pkg.canonicalAnswer,
      verifierAnswer: pkg.verifierAnswer,
      answerSemanticValue: pkg.canonicalAnswer,
      options: Object.freeze(pkg.options.map((option) => Object.freeze({
        ...option,
        semanticValue: option.value,
        routeOperands: visible,
        reproducibleFromVisibleStem: true,
      }))),
    });
  }
  if (pkg.taskDirection === "INVERSE") {
    return Object.freeze({
      stem: pkg.stem,
      canonicalAnswer: pkg.canonicalAnswer,
      verifierAnswer: pkg.verifierAnswer,
      answerSemanticValue: pkg.canonicalAnswer,
      options: inverseOptions(pkg, visible),
    });
  }
  if (ast) {
    return Object.freeze({
      stem: pkg.stem,
      canonicalAnswer: pkg.canonicalAnswer,
      verifierAnswer: pkg.verifierAnswer,
      answerSemanticValue: pkg.canonicalAnswer,
      options: pkg.permanentQlId === "SAP-QL-017" ? ql017Options(pkg, ast, visible) : numericOptions(pkg, ast, visible),
    });
  }
  return Object.freeze({
    stem: pkg.stem,
    canonicalAnswer: pkg.canonicalAnswer,
    verifierAnswer: pkg.verifierAnswer,
    answerSemanticValue: pkg.canonicalAnswer,
    options: Object.freeze(pkg.options.map((option) => Object.freeze({
      ...option,
      semanticValue: option.value,
      routeOperands: visible,
      reproducibleFromVisibleStem: true,
    }))),
  });
}
