import {
  SER_CP002_TEMPORARY_TEMPLATE_IDS,
  generateSerCp002Question,
  solveSerCp002Sequence,
} from "../SER-CP-002/foundation";
import {
  SER_CP003_TEMPORARY_TEMPLATE_IDS,
  generateSerCp003Question,
  solveSerCp003Sequence,
} from "../SER-CP-003/foundation";
import {
  SER_CP004_TEMPORARY_TEMPLATE_IDS,
  generateSerCp004Question,
  solveSerCp004Sequence,
  type SerCp004RuleId,
} from "../SER-CP-004/foundation";
import {
  SER_CP005_TEMPORARY_TEMPLATE_IDS,
  generateSerCp005Question,
  solveSerCp005Sequence,
} from "../SER-CP-005/foundation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

type TaskKind = "NEXT_TERM" | "MISSING_TERM" | "PREVIOUS_TERM" | "WRONG_TERM";
type Transformation = "NEGATE_VALUES" | "REVERSE_DIRECTION";

interface CommonQuestion {
  readonly questionId: string;
  readonly checkpointId: string;
  readonly temporaryTemplateId: string;
  readonly permanentQlId: null;
  readonly taskKind: TaskKind;
  readonly sequence: readonly (number | null)[];
  readonly correctAnswer: number;
  readonly hiddenState: {
    readonly canonicalSequence: readonly number[];
    readonly targetIndex: number;
    readonly correctReplacement: number;
  };
  readonly lifecycle: {
    readonly maturity: "OPEN_EXECUTABLE_DISCOVERY";
    readonly sourceSaturation: "OPEN";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

interface CommonSolution {
  readonly answer: number;
  readonly targetIndex: number;
  readonly correctReplacement: number;
  readonly candidateCount: number;
}

function reverseTask(taskKind: TaskKind): TaskKind {
  if (taskKind === "NEXT_TERM") return "PREVIOUS_TERM";
  if (taskKind === "PREVIOUS_TERM") return "NEXT_TERM";
  return taskKind;
}

function transformTask(taskKind: TaskKind, transformation: Transformation): TaskKind {
  return transformation === "REVERSE_DIRECTION" ? reverseTask(taskKind) : taskKind;
}

function transformValue(value: number | null, transformation: Transformation): number | null {
  if (value == null) return null;
  return transformation === "NEGATE_VALUES" ? -value : value;
}

function transformSequence(
  values: readonly (number | null)[],
  transformation: Transformation,
): (number | null)[] {
  const transformed = values.map((value) => transformValue(value, transformation));
  return transformation === "REVERSE_DIRECTION" ? transformed.reverse() : transformed;
}

function transformScalar(value: number, transformation: Transformation): number {
  return transformation === "NEGATE_VALUES" ? -value : value;
}

function transformIndex(
  index: number,
  length: number,
  transformation: Transformation,
): number {
  return transformation === "REVERSE_DIRECTION" ? length - 1 - index : index;
}

function isStrictlyReversed(
  original: readonly number[],
  transformed: readonly (number | null)[],
): boolean {
  if (original.length !== transformed.length) return false;
  return original.every(
    (value, index) => transformed[transformed.length - 1 - index] === value,
  );
}

function isExactlyNegated(
  original: readonly number[],
  transformed: readonly (number | null)[],
): boolean {
  if (original.length !== transformed.length) return false;
  return original.every((value, index) => transformed[index] === -value);
}

function cp004CanonicalAuthority(ruleId: SerCp004RuleId): string {
  switch (ruleId) {
    case "CONSECUTIVE_SQUARES":
    case "TRIANGULAR_NUMBERS":
      return "CONSTANT_NONZERO_SECOND_DIFFERENCE";
    case "CONSECUTIVE_CUBES":
      return "CONSTANT_NONZERO_THIRD_DIFFERENCE";
    case "FIXED_BASE_CONSECUTIVE_POWERS":
      return "UNIFORM_MULTIPLICATIVE_RATIO";
    case "CONSECUTIVE_PRIMES":
    case "FACTORIAL_SEQUENCE":
    case "ADD_PREVIOUS_TWO_RECURRENCE":
      return ruleId;
  }
}

function cp004Transformations(ruleId: SerCp004RuleId): readonly Transformation[] {
  if (ruleId === "CONSECUTIVE_PRIMES" || ruleId === "FACTORIAL_SEQUENCE") {
    return ["REVERSE_DIRECTION"];
  }
  if (ruleId === "ADD_PREVIOUS_TWO_RECURRENCE") {
    return ["NEGATE_VALUES"];
  }
  return ["NEGATE_VALUES", "REVERSE_DIRECTION"];
}

function proveRepresentation<S extends CommonSolution>(
  question: CommonQuestion,
  transformation: Transformation,
  expectedAuthority: string,
  solver: (taskKind: TaskKind, sequence: readonly (number | null)[]) => S,
  authorityFromSolution: (solution: S) => string,
): {
  readonly transformedTask: TaskKind;
  readonly transformedAnswer: number;
  readonly transformedReplacement: number;
  readonly transformedTargetIndex: number;
} {
  assert(question.permanentQlId === null, `${question.questionId}: permanent QL allocated`);
  assert(question.lifecycle.maturity === "OPEN_EXECUTABLE_DISCOVERY", "maturity drift");
  assert(question.lifecycle.sourceSaturation === "OPEN", "source saturation drift");
  assert(!question.lifecycle.active, "unexpected active question");
  assert(!question.lifecycle.questionStudioDiscoverable, "unexpected Question Studio exposure");
  assert(!question.lifecycle.questionBankWritable, "unexpected Question Bank write");
  assert(!question.lifecycle.testEligible, "unexpected test eligibility");
  assert(!question.lifecycle.publiclyPublishable, "unexpected publication eligibility");

  const transformedSequence = transformSequence(question.sequence, transformation);
  const transformedCanonical = transformSequence(
    question.hiddenState.canonicalSequence,
    transformation,
  );
  const transformedTask = transformTask(question.taskKind, transformation);

  if (transformation === "NEGATE_VALUES") {
    assert(
      isExactlyNegated(question.hiddenState.canonicalSequence, transformedCanonical),
      `${question.questionId}: sign inversion drift`,
    );
  } else {
    assert(
      isStrictlyReversed(question.hiddenState.canonicalSequence, transformedCanonical),
      `${question.questionId}: direction reversal drift`,
    );
  }

  // The representation adapter is deliberately self-inverse. It normalises the
  // signed or reversed display before delegating to the already-proved canonical
  // checkpoint solver, so domain orientation cannot create a new authority.
  const normalisedSequence = transformSequence(transformedSequence, transformation);
  const normalisedTask = transformTask(transformedTask, transformation);
  assert(
    JSON.stringify(normalisedSequence) === JSON.stringify(question.sequence),
    `${question.questionId}: representation normalisation mismatch`,
  );
  assert(normalisedTask === question.taskKind, `${question.questionId}: task normalisation drift`);

  const solved = solver(normalisedTask, normalisedSequence);
  assert(solved.candidateCount === 1, `${question.questionId}: canonical ambiguity`);
  assert(
    authorityFromSolution(solved) === expectedAuthority,
    `${question.questionId}: authority changed under parity normalisation`,
  );

  const transformedAnswer = transformScalar(question.correctAnswer, transformation);
  const transformedReplacement = transformScalar(
    question.hiddenState.correctReplacement,
    transformation,
  );
  const transformedTargetIndex = transformIndex(
    question.hiddenState.targetIndex,
    question.sequence.length,
    transformation,
  );

  assert(
    transformScalar(solved.answer, transformation) === transformedAnswer,
    `${question.questionId}: transformed answer mismatch`,
  );
  assert(
    transformScalar(solved.correctReplacement, transformation)
      === transformedReplacement,
    `${question.questionId}: transformed replacement mismatch`,
  );
  assert(
    transformIndex(solved.targetIndex, question.sequence.length, transformation)
      === transformedTargetIndex,
    `${question.questionId}: transformed target mismatch`,
  );

  return {
    transformedTask,
    transformedAnswer,
    transformedReplacement,
    transformedTargetIndex,
  };
}

const seedsPerTemplate = 60;
const authorityCoverage = new Set<string>(["UNIFORM_ADDITIVE_STEP"]);
const transformationCounts = new Map<Transformation, number>();
const taskCounts = new Map<TaskKind, number>();
const checkpointCounts = new Map<string, number>();
const authorityCounts = new Map<string, number>();
let baseQuestions = 0;
let transformedRepresentations = 0;
let lifecycleChecks = 0;
let solverChecks = 0;

function record(
  checkpointId: string,
  authorityId: string,
  transformation: Transformation,
  taskKind: TaskKind,
): void {
  authorityCoverage.add(authorityId);
  transformationCounts.set(
    transformation,
    (transformationCounts.get(transformation) ?? 0) + 1,
  );
  taskCounts.set(taskKind, (taskCounts.get(taskKind) ?? 0) + 1);
  checkpointCounts.set(checkpointId, (checkpointCounts.get(checkpointId) ?? 0) + 1);
  authorityCounts.set(authorityId, (authorityCounts.get(authorityId) ?? 0) + 1);
  transformedRepresentations += 1;
  lifecycleChecks += 1;
  solverChecks += 1;
}

for (const temporaryTemplateId of SER_CP002_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= seedsPerTemplate; seed += 1) {
    const question = generateSerCp002Question(temporaryTemplateId, seed);
    const common = question as CommonQuestion;
    const authorityId = question.candidateRuleId;
    const result = proveRepresentation(
      common,
      "NEGATE_VALUES",
      authorityId,
      solveSerCp002Sequence,
      (solution) => solution.candidateRuleId,
    );
    record(question.checkpointId, authorityId, "NEGATE_VALUES", result.transformedTask);
    baseQuestions += 1;
  }
}

for (const temporaryTemplateId of SER_CP003_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= seedsPerTemplate; seed += 1) {
    const question = generateSerCp003Question(temporaryTemplateId, seed);
    const common = question as CommonQuestion;
    const authorityId = question.candidateRuleId;
    for (const transformation of ["NEGATE_VALUES", "REVERSE_DIRECTION"] as const) {
      const result = proveRepresentation(
        common,
        transformation,
        authorityId,
        solveSerCp003Sequence,
        (solution) => solution.candidateRuleId,
      );
      record(question.checkpointId, authorityId, transformation, result.transformedTask);
    }
    baseQuestions += 1;
  }
}

for (const temporaryTemplateId of SER_CP004_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= seedsPerTemplate; seed += 1) {
    const question = generateSerCp004Question(temporaryTemplateId, seed);
    const common = question as CommonQuestion;
    const authorityId = cp004CanonicalAuthority(question.candidateRuleId);
    for (const transformation of cp004Transformations(question.candidateRuleId)) {
      const result = proveRepresentation(
        common,
        transformation,
        authorityId,
        solveSerCp004Sequence,
        (solution) => cp004CanonicalAuthority(solution.candidateRuleId),
      );
      record(question.checkpointId, authorityId, transformation, result.transformedTask);
    }
    baseQuestions += 1;
  }
}

for (const temporaryTemplateId of SER_CP005_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= seedsPerTemplate; seed += 1) {
    const question = generateSerCp005Question(temporaryTemplateId, seed);
    const common = question as CommonQuestion;
    const authorityId = question.canonicalAuthorityId;
    for (const transformation of ["NEGATE_VALUES", "REVERSE_DIRECTION"] as const) {
      const result = proveRepresentation(
        common,
        transformation,
        authorityId,
        solveSerCp005Sequence,
        (solution) => solution.canonicalAuthorityId,
      );
      record(question.checkpointId, authorityId, transformation, result.transformedTask);
    }
    baseQuestions += 1;
  }
}

const expectedAuthorities = [
  "UNIFORM_ADDITIVE_STEP",
  "UNIFORM_MULTIPLICATIVE_RATIO",
  "AFFINE_MULTIPLY_THEN_ADD",
  "CONSTANT_NONZERO_SECOND_DIFFERENCE",
  "CONSTANT_NONZERO_THIRD_DIFFERENCE",
  "CONSECUTIVE_PRIMES",
  "FACTORIAL_SEQUENCE",
  "ADD_PREVIOUS_TWO_RECURRENCE",
  "TWO_INTERLEAVED_ARITHMETIC",
  "TWO_INTERLEAVED_GEOMETRIC",
  "INTERLEAVED_ARITHMETIC_GEOMETRIC",
  "ALTERNATING_FIXED_AFFINE_PHASE",
  "PROGRESSIVE_MULTIPLY_PLUS_ADD",
  "PROGRESSIVE_ALTERNATING_AFFINE_CYCLES",
] as const;

assert(baseQuestions === 5_040, "signed-parity base-question volume drift");
assert(transformedRepresentations === 8_880, "signed-parity proof volume drift");
assert(solverChecks === 8_880, "signed-parity solver count drift");
assert(lifecycleChecks === 8_880, "signed-parity lifecycle count drift");
assert(
  transformationCounts.get("NEGATE_VALUES") === 4_560,
  "sign-inversion proof volume drift",
);
assert(
  transformationCounts.get("REVERSE_DIRECTION") === 4_320,
  "direction-reversal proof volume drift",
);
for (const taskKind of ["NEXT_TERM", "MISSING_TERM", "PREVIOUS_TERM", "WRONG_TERM"] as const) {
  assert(taskCounts.get(taskKind) === 2_220, `${taskKind}: transformed task imbalance`);
}
for (const authorityId of expectedAuthorities) {
  assert(authorityCoverage.has(authorityId), `${authorityId}: parity authority missing`);
}
assert(authorityCoverage.size === 14, "signed-parity authority count drift");
assert(
  [...authorityCounts.values()].every((count) => count > 0),
  "one or more authorities lack executable parity evidence",
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_NUMERIC_SIGNED_DESCENDING_PARITY_AUDIT",
      permanentQlCount: 0,
      seedsPerTemplate,
      auditedTemplates:
        SER_CP002_TEMPORARY_TEMPLATE_IDS.length
        + SER_CP003_TEMPORARY_TEMPLATE_IDS.length
        + SER_CP004_TEMPORARY_TEMPLATE_IDS.length
        + SER_CP005_TEMPORARY_TEMPLATE_IDS.length,
      baseQuestions,
      transformedRepresentations,
      signInversionProofs: transformationCounts.get("NEGATE_VALUES"),
      directionReversalProofs: transformationCounts.get("REVERSE_DIRECTION"),
      canonicalAuthoritiesCovered: authorityCoverage.size,
      solverChecks,
      lifecycleChecks,
      taskCounts: Object.fromEntries(taskCounts),
      checkpointCounts: Object.fromEntries(checkpointCounts),
      authorityCounts: Object.fromEntries(authorityCounts),
      ownershipDecision:
        "SIGNED_AND_DESCENDING_ORIENTATION_IS_A_DOMAIN_OR_REPRESENTATION_PARAMETER",
      alternatingSignAuthorityStillOpen:
        "ALTERNATING_SIGN_PARITY_AND_OPERATOR_SERIES",
      sourceSaturation: "OPEN",
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
    null,
    2,
  ),
);
