import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
  classifyTwoStatementResults,
  findMinimalSufficientSubsets,
  optionForClass,
  type SufficiencyClass,
  type SufficiencyEvaluation,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import { generateAlgCp014DiscoveryItem } from "../../../../../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/ALG-002/ALG-CP-014/generator.ts";
import type {
  AlgCp014DiscoveryItem,
  AlgCp014SingleVariableStatement,
} from "../../../../../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/ALG-002/ALG-CP-014/types.ts";
import {
  ALG_ENGLISH_V3_FREEZE_APPROVAL,
} from "../../../../../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/permanent/english-freeze-v3.ts";
import {
  getAlgPermanentAllocation,
} from "../../../../../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/permanent/allocation.ts";
import {
  allRealIntervals,
  divideRational,
  equalsRational,
  formatRational,
  intersectIntervalSets,
  isZeroRational,
  solveLinearEquation,
  solveLinearInequality,
  solveLinearSystem2V,
  type LinearSystem2V,
  type Rational,
  type RationalIntervalSet,
} from "../../../../../quant-v4/shared/algebra/index.ts";

export const DSF_CP001_ALGEBRA_RUNTIME_VERSION = "DSF_CP001_ALGEBRA_RUNTIME_V1" as const;
export const DSF_CP001_ALGEBRA_SOLVE_MODES = [
  "DSF-SM-ALG-SINGLE-VARIABLE-X",
  "DSF-SM-ALG-LINEAR-SYSTEM-X",
] as const;

export type DsfCp001AlgebraSolveMode = (typeof DSF_CP001_ALGEBRA_SOLVE_MODES)[number];
export type DsfCp001AlgebraDifficulty = "Medium" | "Hard";

type AlgebraSourcePrototypeId =
  | "ALG-CP014-CAND-004"
  | "ALG-CP014-CAND-005"
  | "ALG-CP014-CAND-006"
  | "ALG-CP014-CAND-007"
  | "ALG-CP014-CAND-008";

type SymbolicCardinality = "EMPTY" | "ONE" | "MANY";

interface SymbolicTargetState {
  readonly cardinality: SymbolicCardinality;
  readonly consistent: boolean;
  readonly sufficient: boolean;
  readonly uniqueAnswer?: string;
  readonly reason:
    | "LINEAR_EQUATION_UNIQUE"
    | "LINEAR_EQUATION_ALL_REAL"
    | "LINEAR_EQUATION_INCONSISTENT"
    | "INEQUALITY_RANGE"
    | "INTERSECTION_SINGLETON"
    | "INTERSECTION_MULTIPLE"
    | "INTERSECTION_EMPTY"
    | "ROW_FIXES_TARGET"
    | "ROW_COUPLES_TWO_VARIABLES"
    | "ROW_IDENTITY"
    | "ROW_INCONSISTENT"
    | "UNIQUE_LINEAR_SYSTEM"
    | "DEPENDENT_LINEAR_SYSTEM"
    | "INCONSISTENT_LINEAR_SYSTEM";
}

interface AlgebraSymbolicEvaluation {
  readonly statementI: SymbolicTargetState;
  readonly statementII: SymbolicTargetState;
  readonly together: SymbolicTargetState;
  readonly canonical: TwoStatementSufficiencyEvaluation<string>;
}

const SOURCE_PROTOTYPE_FOR_CLASS: Readonly<Record<SufficiencyClass, AlgebraSourcePrototypeId>> = {
  STATEMENT_I_ONLY: "ALG-CP014-CAND-004",
  STATEMENT_II_ONLY: "ALG-CP014-CAND-005",
  EACH_STATEMENT_ALONE: "ALG-CP014-CAND-006",
  BOTH_TOGETHER_ONLY: "ALG-CP014-CAND-007",
  INSUFFICIENT_EVEN_TOGETHER: "ALG-CP014-CAND-008",
};

const SOURCE_VERDICT_TO_DSF_CLASS = {
  STATEMENT_I_ALONE: "STATEMENT_I_ONLY",
  STATEMENT_II_ALONE: "STATEMENT_II_ONLY",
  EITHER_ALONE: "EACH_STATEMENT_ALONE",
  BOTH_TOGETHER: "BOTH_TOGETHER_ONLY",
  NOT_SUFFICIENT: "INSUFFICIENT_EVEN_TOGETHER",
} as const satisfies Readonly<Record<string, SufficiencyClass>>;

export interface DsfCp001AlgebraQuestion {
  readonly packageId: "DSF-001";
  readonly checkpointId: "DSF-CP-001";
  readonly qlId: "DSF-QL-001";
  readonly runtimeVersion: typeof DSF_CP001_ALGEBRA_RUNTIME_VERSION;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: DsfCp001AlgebraDifficulty;
  readonly domainFamily: "QUANT";
  readonly sourceChapterId: "ALG-002";
  readonly sourcePermanentQlId: "ALG-QL-040";
  readonly sourceCpId: "ALG-CP-014";
  readonly sourceFreezeId: "ALG-EN-v3-frozen";
  readonly sourcePrototypeId: AlgebraSourcePrototypeId;
  readonly sourceCapability: "ALG-QL-040/ALG-CP-014 + quant-v4/shared/algebra exact solvers";
  readonly solveModeId: DsfCp001AlgebraSolveMode;
  readonly targetKind: "EXACT_VALUE_X";
  readonly answerContractId: "DS_STANDARD_5";
  readonly taskDirection: "DATA_SUFFICIENCY";
  readonly answerSemantic: "SUFFICIENCY_CLASS";
  readonly baseCondition: string;
  readonly stem: string;
  readonly questionPrompt: string;
  readonly statements: readonly [
    { readonly id: "I"; readonly text: string },
    { readonly id: "II"; readonly text: string },
  ];
  readonly options: readonly {
    readonly key: "A" | "B" | "C" | "D" | "E";
    readonly value: string;
    readonly semanticClass: SufficiencyClass;
    readonly isCorrect: boolean;
  }[];
  readonly correctIndex: number;
  readonly canonicalAnswer: SufficiencyClass;
  readonly explanation: {
    readonly askedTarget: string;
    readonly statementI: string;
    readonly statementII: string;
    readonly together?: string;
    readonly conclusion: string;
  };
  readonly proof: {
    readonly statementI: SymbolicTargetState;
    readonly statementII: SymbolicTargetState;
    readonly together: SymbolicTargetState;
    readonly minimalSufficientSets: readonly (readonly string[])[];
    readonly sourceVerdict: string;
    readonly sourceVerdictMappedClass: SufficiencyClass;
    readonly sourceAndDsfClassificationAgree: true;
    readonly symbolicProofNote: "Cardinality is solved symbolically over the Algebra source domain; no bounded finite-world approximation is used.";
  };
  readonly sourceAncestry: readonly ["ALG-002", "ALG-QL-040", "ALG-CP-014", "ALG-EN-v3-frozen"];
  readonly generationIdentity: string;
  readonly validation: { readonly ok: true; readonly errors: readonly [] };
  readonly lifecycle: {
    readonly contentStatus: "ENGLISH_REVIEW_CANDIDATE";
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  const text = `${DSF_CP001_ALGEBRA_RUNTIME_VERSION}:${seed}:${salt}`;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function desiredClass(seed: number): SufficiencyClass {
  return SUFFICIENCY_CLASSES[hashSeed(seed, "class") % SUFFICIENCY_CLASSES.length]!;
}

function pointSet(value: Rational): RationalIntervalSet {
  return [{ lower: value, lowerClosed: true, upper: value, upperClosed: true }];
}

function equationSet(statement: Extract<AlgCp014SingleVariableStatement, { kind: "LINEAR_EQUATION" }>): RationalIntervalSet {
  const solution = solveLinearEquation(statement.equation);
  if (solution.kind === "UNIQUE") return pointSet(solution.value);
  if (solution.kind === "INFINITE_SOLUTIONS") return allRealIntervals();
  return [];
}

function statementSet(statement: AlgCp014SingleVariableStatement): RationalIntervalSet {
  return statement.kind === "LINEAR_EQUATION"
    ? equationSet(statement)
    : solveLinearInequality(statement.a, statement.b, statement.operator);
}

function singletonValue(set: RationalIntervalSet): Rational | undefined {
  if (set.length !== 1) return undefined;
  const interval = set[0]!;
  if (
    interval.lower === null
    || interval.upper === null
    || !interval.lowerClosed
    || !interval.upperClosed
    || !equalsRational(interval.lower, interval.upper)
  ) return undefined;
  return interval.lower;
}

function intervalState(
  set: RationalIntervalSet,
  uniqueReason: SymbolicTargetState["reason"],
  multipleReason: SymbolicTargetState["reason"],
  emptyReason: SymbolicTargetState["reason"],
): SymbolicTargetState {
  if (set.length === 0) {
    return { cardinality: "EMPTY", consistent: false, sufficient: false, reason: emptyReason };
  }
  const value = singletonValue(set);
  if (value) {
    return {
      cardinality: "ONE",
      consistent: true,
      sufficient: true,
      uniqueAnswer: formatRational(value),
      reason: uniqueReason,
    };
  }
  return { cardinality: "MANY", consistent: true, sufficient: false, reason: multipleReason };
}

function singleStatementState(statement: AlgCp014SingleVariableStatement): SymbolicTargetState {
  if (statement.kind === "LINEAR_EQUATION") {
    const solved = solveLinearEquation(statement.equation);
    if (solved.kind === "UNIQUE") {
      return {
        cardinality: "ONE",
        consistent: true,
        sufficient: true,
        uniqueAnswer: formatRational(solved.value),
        reason: "LINEAR_EQUATION_UNIQUE",
      };
    }
    if (solved.kind === "NO_SOLUTION") {
      return {
        cardinality: "EMPTY",
        consistent: false,
        sufficient: false,
        reason: "LINEAR_EQUATION_INCONSISTENT",
      };
    }
    return {
      cardinality: "MANY",
      consistent: true,
      sufficient: false,
      reason: "LINEAR_EQUATION_ALL_REAL",
    };
  }
  return intervalState(
    statementSet(statement),
    "INTERSECTION_SINGLETON",
    "INEQUALITY_RANGE",
    "INTERSECTION_EMPTY",
  );
}

function rowTargetState(a: Rational, b: Rational, c: Rational, target: "x" | "y"): SymbolicTargetState {
  const targetCoefficient = target === "x" ? a : b;
  const otherCoefficient = target === "x" ? b : a;
  if (isZeroRational(targetCoefficient) && isZeroRational(otherCoefficient)) {
    return isZeroRational(c)
      ? { cardinality: "MANY", consistent: true, sufficient: false, reason: "ROW_IDENTITY" }
      : { cardinality: "EMPTY", consistent: false, sufficient: false, reason: "ROW_INCONSISTENT" };
  }
  if (isZeroRational(otherCoefficient) && !isZeroRational(targetCoefficient)) {
    return {
      cardinality: "ONE",
      consistent: true,
      sufficient: true,
      uniqueAnswer: formatRational(divideRational(c, targetCoefficient)),
      reason: "ROW_FIXES_TARGET",
    };
  }
  return {
    cardinality: "MANY",
    consistent: true,
    sufficient: false,
    reason: "ROW_COUPLES_TWO_VARIABLES",
  };
}

function systemTogetherState(system: LinearSystem2V, target: "x" | "y"): SymbolicTargetState {
  const solved = solveLinearSystem2V(system);
  if (solved.kind === "UNIQUE") {
    return {
      cardinality: "ONE",
      consistent: true,
      sufficient: true,
      uniqueAnswer: formatRational(target === "x" ? solved.x : solved.y),
      reason: "UNIQUE_LINEAR_SYSTEM",
    };
  }
  if (solved.kind === "NO_SOLUTION") {
    return {
      cardinality: "EMPTY",
      consistent: false,
      sufficient: false,
      reason: "INCONSISTENT_LINEAR_SYSTEM",
    };
  }

  const first = rowTargetState(system.a1, system.b1, system.c1, target);
  const second = rowTargetState(system.a2, system.b2, system.c2, target);
  const unique = first.sufficient ? first : second.sufficient ? second : undefined;
  if (unique) {
    return {
      cardinality: "ONE",
      consistent: true,
      sufficient: true,
      uniqueAnswer: unique.uniqueAnswer,
      reason: "ROW_FIXES_TARGET",
    };
  }
  return {
    cardinality: "MANY",
    consistent: true,
    sufficient: false,
    reason: "DEPENDENT_LINEAR_SYSTEM",
  };
}

function classifierProjection(state: SymbolicTargetState, label: string): SufficiencyEvaluation<string> {
  if (!state.consistent) {
    return {
      consistent: false,
      worldCount: 0,
      normalizedTargetAnswers: [],
      sufficient: false,
    };
  }
  if (state.sufficient) {
    const answer = state.uniqueAnswer;
    if (!answer) throw new Error(`${label}: symbolic unique target is missing its answer`);
    return {
      consistent: true,
      worldCount: 1,
      normalizedTargetAnswers: [answer],
      sufficient: true,
      uniqueAnswer: answer,
    };
  }
  // The canonical classifier only needs to know that at least two target answers remain.
  // These are symbolic cardinality witnesses, not a bounded enumeration of Algebra worlds.
  return {
    consistent: true,
    worldCount: 2,
    normalizedTargetAnswers: [`${label}:TARGET_A`, `${label}:TARGET_B`],
    sufficient: false,
  };
}

function evaluateSourceMath(raw: AlgCp014DiscoveryItem): AlgebraSymbolicEvaluation {
  let statementI: SymbolicTargetState;
  let statementII: SymbolicTargetState;
  let together: SymbolicTargetState;

  if (raw.math.kind === "DS_SINGLE_VARIABLE") {
    statementI = singleStatementState(raw.math.statementI);
    statementII = singleStatementState(raw.math.statementII);
    together = intervalState(
      intersectIntervalSets(statementSet(raw.math.statementI), statementSet(raw.math.statementII)),
      "INTERSECTION_SINGLETON",
      "INTERSECTION_MULTIPLE",
      "INTERSECTION_EMPTY",
    );
  } else if (raw.math.kind === "DS_SYSTEM") {
    const { system, target } = raw.math;
    statementI = rowTargetState(system.a1, system.b1, system.c1, target);
    statementII = rowTargetState(system.a2, system.b2, system.c2, target);
    together = systemTogetherState(system, target);
  } else {
    throw new Error(`${raw.candidateId}: Algebra DSF adapter received non-DS source math ${raw.math.kind}`);
  }

  const i = classifierProjection(statementI, "I");
  const ii = classifierProjection(statementII, "II");
  const both = classifierProjection(together, "I+II");
  const classification = classifyTwoStatementResults(i, ii, both);
  const minimalSufficientSets = findMinimalSufficientSubsets([
    { statementIds: ["I"], result: i },
    { statementIds: ["II"], result: ii },
    { statementIds: ["I", "II"], result: both },
  ]);

  return {
    statementI,
    statementII,
    together,
    canonical: {
      statementI: i,
      statementII: ii,
      together: both,
      classification,
      minimalSufficientSets,
    },
  };
}

function sanitizeStatement(text: string): string {
  return text.replace(/^I{1,2}\.\s*/, "").trim();
}

function stateExplanation(label: "Statement I" | "Statement II", state: SymbolicTargetState): string {
  if (state.sufficient) {
    return `${label} fixes x = ${state.uniqueAnswer}. So ${label} alone is sufficient.`;
  }
  if (state.reason === "INEQUALITY_RANGE") {
    return `${label} only restricts x to a range, so more than one value of x is still possible. Therefore ${label} alone is not sufficient.`;
  }
  if (state.reason === "ROW_COUPLES_TWO_VARIABLES") {
    return `${label} is one equation involving both x and y, so x can still take more than one value. Therefore ${label} alone is not sufficient.`;
  }
  return `${label} leaves more than one possible value of x. Therefore ${label} alone is not sufficient.`;
}

function togetherExplanation(state: SymbolicTargetState): string {
  if (state.sufficient) {
    return `Using both statements together fixes x = ${state.uniqueAnswer}. Therefore the two statements together are sufficient.`;
  }
  if (state.reason === "DEPENDENT_LINEAR_SYSTEM") {
    return "The two equations are dependent, so they still describe only one independent constraint in x and y. More than one value of x remains possible.";
  }
  return "Even after using both statements, more than one value of x remains possible, so x cannot be uniquely determined.";
}

function validateSourceAuthority(): void {
  const allocation = getAlgPermanentAllocation("ALG-QL-040");
  if (allocation.cpId !== "ALG-CP-014" || allocation.title !== "Algebraic data sufficiency") {
    throw new Error("Algebra source authority for ALG-QL-040 changed");
  }
  if (!allocation.permanentIdentityFrozen || !allocation.semanticContractFrozen) {
    throw new Error("Algebra ALG-QL-040 semantic authority is not frozen");
  }
  if (
    ALG_ENGLISH_V3_FREEZE_APPROVAL.approvedReviewAuthority !== "ALG-EN-review-v3"
    || !ALG_ENGLISH_V3_FREEZE_APPROVAL.englishImplementationFrozen
    || !ALG_ENGLISH_V3_FREEZE_APPROVAL.solverAuthorityFrozen
  ) {
    throw new Error("Algebra English V3/source solver authority is not frozen");
  }
}

function generationIdentity(seed: number, raw: AlgCp014DiscoveryItem, semanticClass: SufficiencyClass): string {
  return createHash("sha256")
    .update(JSON.stringify({
      runtime: DSF_CP001_ALGEBRA_RUNTIME_VERSION,
      seed,
      sourcePrototypeId: raw.candidateId,
      semanticClass,
      statements: raw.statements,
    }))
    .digest("hex")
    .slice(0, 24);
}

export function generateDsfCp001AlgebraEnglish(seed: number): DsfCp001AlgebraQuestion {
  if (!Number.isInteger(seed) || seed < 0) throw new Error("DSF Algebra seed must be a non-negative integer");
  validateSourceAuthority();

  const intendedClass = desiredClass(seed);
  const sourcePrototypeId = SOURCE_PROTOTYPE_FOR_CLASS[intendedClass];
  const raw = generateAlgCp014DiscoveryItem(sourcePrototypeId, seed);
  if (raw.answer.kind !== "DATA_SUFFICIENCY" || !raw.statements) {
    throw new Error(`${sourcePrototypeId}: source Algebra prototype is not a two-statement DS item`);
  }

  const evaluation = evaluateSourceMath(raw);
  const canonicalAnswer = evaluation.canonical.classification;
  const sourceVerdictMappedClass = SOURCE_VERDICT_TO_DSF_CLASS[raw.answer.value];
  if (canonicalAnswer !== intendedClass) {
    throw new Error(`${sourcePrototypeId}: intended ${intendedClass}, DSF solver proved ${canonicalAnswer}`);
  }
  if (sourceVerdictMappedClass !== canonicalAnswer) {
    throw new Error(`${sourcePrototypeId}: source verdict ${raw.answer.value} disagrees with DSF ${canonicalAnswer}`);
  }

  const options = DS_STANDARD_5_EN.options.map((option) => ({
    key: option.key,
    value: option.text,
    semanticClass: option.semanticClass,
    isCorrect: option.semanticClass === canonicalAnswer,
  }));
  const correct = optionForClass(DS_STANDARD_5_EN, canonicalAnswer);
  const correctIndex = options.findIndex((option) => option.key === correct.key);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`${sourcePrototypeId}: DS_STANDARD_5 did not produce exactly one correct option`);
  }

  const solveModeId: DsfCp001AlgebraSolveMode = raw.math.kind === "DS_SYSTEM"
    ? "DSF-SM-ALG-LINEAR-SYSTEM-X"
    : "DSF-SM-ALG-SINGLE-VARIABLE-X";
  const difficulty: DsfCp001AlgebraDifficulty = raw.math.kind === "DS_SYSTEM" ? "Hard" : "Medium";
  const conclusion = correct.text;
  const needsTogether = canonicalAnswer === "BOTH_TOGETHER_ONLY" || canonicalAnswer === "INSUFFICIENT_EVEN_TOGETHER";

  return {
    packageId: "DSF-001",
    checkpointId: "DSF-CP-001",
    qlId: "DSF-QL-001",
    runtimeVersion: DSF_CP001_ALGEBRA_RUNTIME_VERSION,
    seed,
    locale: "en-IN",
    difficulty,
    domainFamily: "QUANT",
    sourceChapterId: "ALG-002",
    sourcePermanentQlId: "ALG-QL-040",
    sourceCpId: "ALG-CP-014",
    sourceFreezeId: "ALG-EN-v3-frozen",
    sourcePrototypeId,
    sourceCapability: "ALG-QL-040/ALG-CP-014 + quant-v4/shared/algebra exact solvers",
    solveModeId,
    targetKind: "EXACT_VALUE_X",
    answerContractId: "DS_STANDARD_5",
    taskDirection: "DATA_SUFFICIENCY",
    answerSemantic: "SUFFICIENCY_CLASS",
    baseCondition: "x and y, where present, are real numbers.",
    stem: "Can the value of x be uniquely determined from the statements below?",
    questionPrompt: "Decide whether Statement I, Statement II, or both are sufficient to determine x uniquely.",
    statements: [
      { id: "I", text: sanitizeStatement(raw.statements[0]) },
      { id: "II", text: sanitizeStatement(raw.statements[1]) },
    ],
    options,
    correctIndex,
    canonicalAnswer,
    explanation: {
      askedTarget: "We need to determine one unique value of x.",
      statementI: stateExplanation("Statement I", evaluation.statementI),
      statementII: stateExplanation("Statement II", evaluation.statementII),
      ...(needsTogether ? { together: togetherExplanation(evaluation.together) } : {}),
      conclusion,
    },
    proof: {
      statementI: evaluation.statementI,
      statementII: evaluation.statementII,
      together: evaluation.together,
      minimalSufficientSets: evaluation.canonical.minimalSufficientSets,
      sourceVerdict: raw.answer.value,
      sourceVerdictMappedClass,
      sourceAndDsfClassificationAgree: true,
      symbolicProofNote: "Cardinality is solved symbolically over the Algebra source domain; no bounded finite-world approximation is used.",
    },
    sourceAncestry: ["ALG-002", "ALG-QL-040", "ALG-CP-014", "ALG-EN-v3-frozen"],
    generationIdentity: generationIdentity(seed, raw, canonicalAnswer),
    validation: { ok: true, errors: [] },
    lifecycle: {
      contentStatus: "ENGLISH_REVIEW_CANDIDATE",
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}
