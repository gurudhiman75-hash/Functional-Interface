import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { analyzeInequalityGraph } from "../foundation/graph-solver";
import { SeededRandom, stableHash } from "../foundation/prng";
import {
  createComparisonConstraint,
  reverseRelation,
} from "../foundation/relations";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type {
  ComparisonConstraint,
  ComparisonRelation,
} from "../foundation/types";
import { formatStatement, relationSymbol } from "../INE-CP-001/presentation";
import { getIneCp008PrototypeContract } from "./contracts";
import type {
  GeneratedIneCp008Question,
  IneCp008Option,
  IneCp008PrototypeId,
  IneCp008Scenario,
} from "./types";
import { validateIneCp008Question } from "./validator";

const RELATIONS: readonly ComparisonRelation[] = [
  "GREATER_THAN",
  "LESS_THAN",
  "EQUAL_TO",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN_OR_EQUAL",
];

const ENTITY_SETS: readonly (readonly [string, string, string, string, string])[] = [
  ["P", "Q", "R", "S", "T"],
  ["A", "D", "F", "H", "K"],
  ["M", "N", "O", "U", "V"],
  ["B", "C", "G", "J", "L"],
  ["W", "X", "Y", "Z", "E"],
  ["G", "I", "K", "N", "R"],
  ["C", "E", "H", "M", "T"],
  ["D", "J", "P", "V", "Y"],
  ["F", "L", "Q", "S", "W"],
  ["B", "I", "O", "R", "U"],
  ["A", "G", "M", "X", "Z"],
  ["E", "K", "N", "T", "V"],
];

function c(
  leftId: string,
  relation: ComparisonRelation,
  rightId: string,
  sourceStatementId: string,
): ComparisonConstraint {
  return createComparisonConstraint(
    leftId,
    relation,
    rightId,
    sourceStatementId,
  );
}

function namesFor(seed: number): Readonly<Record<string, string>> {
  const names =
    ENTITY_SETS[
      ((seed % ENTITY_SETS.length) + ENTITY_SETS.length) % ENTITY_SETS.length
    ]!;
  return {
    E1: names[0],
    E2: names[1],
    E3: names[2],
    E4: names[3],
    E5: names[4],
  };
}

function balancedIndex(namespace: string, seed: number): number {
  const normalized = (Number.isFinite(seed) ? Math.trunc(seed) : 0) >>> 0;
  const block = Math.floor(normalized / 4);
  const slot = normalized % 4;
  const random = new SeededRandom(
    Number.parseInt(stableHash([namespace, block, "cp008-position-v1"]), 16),
  );
  return random.shuffle([0, 1, 2, 3])[slot]!;
}

function placeCorrect(
  correct: IneCp008Option,
  distractors: readonly IneCp008Option[],
  namespace: string,
  seed: number,
) {
  const correctIndex = balancedIndex(namespace, seed);
  let distractorIndex = 0;
  return {
    correctIndex,
    options: Array.from({ length: 4 }, (_, index) =>
      index === correctIndex ? correct : distractors[distractorIndex++]!,
    ),
  };
}

function renderStatements(
  statements: readonly ComparisonConstraint[],
  names: Readonly<Record<string, string>>,
): string {
  return statements.map((entry) => formatStatement(entry, names)).join("; ");
}

function chainForRelation(
  relation: ComparisonRelation,
  sourcePrefix: string,
): readonly ComparisonConstraint[] {
  const firstRelation: ComparisonRelation =
    relation === "GREATER_THAN"
      ? "GREATER_THAN_OR_EQUAL"
      : relation === "LESS_THAN"
        ? "LESS_THAN_OR_EQUAL"
        : relation;
  const lastRelation: ComparisonRelation =
    relation === "GREATER_THAN" || relation === "LESS_THAN"
      ? relation
      : "EQUAL_TO";
  return [
    c("E1", firstRelation, "E2", `${sourcePrefix}-1`),
    c("E2", "EQUAL_TO", "E3", `${sourcePrefix}-2`),
    c("E3", lastRelation, "E5", `${sourcePrefix}-3`),
  ];
}

function buildSelectStatementSet(
  seed: number,
  names: Readonly<Record<string, string>>,
): {
  scenario: IneCp008Scenario;
  stem: string;
  displayedStatements: readonly string[];
  optionResult: { options: readonly IneCp008Option[]; correctIndex: number };
  explanation: string;
} {
  const targetRelation = RELATIONS[((seed % 5) + 5) % 5]!;
  const targetConclusion = c("E1", targetRelation, "E5", "TARGET");
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash(["cp008-select-set"]), 16),
  );
  const distractorRelations = random
    .shuffle(RELATIONS.filter((entry) => entry !== targetRelation))
    .slice(0, 3);
  const optionFor = (
    relation: ComparisonRelation,
    isCorrect: boolean,
    index: number,
  ): IneCp008Option => {
    const statementSet = chainForRelation(relation, `SET-${index}`);
    const strongest = assertSolverAgreement(statementSet, "E1", "E5")
      .graphEvidence?.strongestDefiniteRelation;
    if (strongest !== relation)
      throw new Error("Statement-set relation was not preserved.");
    return {
      value: renderStatements(statementSet, names),
      statementSet,
      isCorrect,
      errorLabel: isCorrect ? undefined : "ESTABLISHES_A_DIFFERENT_STRONGEST_RELATION",
    };
  };
  const correct = optionFor(targetRelation, true, 0);
  const distractors = distractorRelations.map((relation, index) =>
    optionFor(relation, false, index + 1),
  );
  const optionResult = placeCorrect(correct, distractors, "SELECT_STATEMENT_SET", seed);
  const left = names.E1!;
  const right = names.E5!;
  const correctSet = correct.statementSet!;
  const combinedChain = `${left} ${relationSymbol(correctSet[0]!.relation)} ${names.E2} = ${names.E3} ${relationSymbol(correctSet[2]!.relation)} ${right}`;
  return {
    scenario: {
      taskKind: "SELECT_STATEMENT_SET",
      topologyId: "FOUR_COMPETING_INFERENCE_CHAINS",
      entityNames: names,
      baseStatements: [],
      targetConclusion,
      query: { leftId: "E1", rightId: "E5" },
    },
    stem: `Which statement set has ${left} ${relationSymbol(targetRelation)} ${right} as its strongest definite endpoint relation?`,
    displayedStatements: [`Required endpoint relation: ${left} ${relationSymbol(targetRelation)} ${right}`],
    optionResult,
    explanation: `Combine the correct set: ${combinedChain}. This gives ${left} ${relationSymbol(targetRelation)} ${right}, which is exactly the relation asked for.`,
  };
}

function buildContradictoryAddition(
  seed: number,
  names: Readonly<Record<string, string>>,
) {
  const descending = seed % 2 === 0;
  const weak: ComparisonRelation = descending
    ? "GREATER_THAN_OR_EQUAL"
    : "LESS_THAN_OR_EQUAL";
  const strict: ComparisonRelation = descending ? "GREATER_THAN" : "LESS_THAN";
  const reverseWeak: ComparisonRelation = descending
    ? "GREATER_THAN_OR_EQUAL"
    : "LESS_THAN_OR_EQUAL";
  const baseStatements = [
    c("E1", weak, "E2", "S1"),
    c("E2", strict, "E3", "S2"),
    c("E3", "EQUAL_TO", "E4", "S3"),
    c("E4", weak, "E5", "S4"),
  ];
  const contradiction = descending
    ? c("E5", reverseWeak, "E1", "C1")
    : c("E5", "LESS_THAN_OR_EQUAL", "E1", "C1");
  const consistentCandidates = descending
    ? [
        c("E1", "GREATER_THAN", "E5", "C2"),
        c("E2", "GREATER_THAN", "E4", "C3"),
        c("E3", "GREATER_THAN_OR_EQUAL", "E5", "C4"),
      ]
    : [
        c("E1", "LESS_THAN", "E5", "C2"),
        c("E2", "LESS_THAN", "E4", "C3"),
        c("E3", "LESS_THAN_OR_EQUAL", "E5", "C4"),
      ];
  if (analyzeInequalityGraph([...baseStatements, contradiction]).consistent)
    throw new Error("Contradictory option remained consistent.");
  if (
    consistentCandidates.some(
      (entry) => !analyzeInequalityGraph([...baseStatements, entry]).consistent,
    )
  )
    throw new Error("A consistent contradiction distractor became invalid.");
  const correct: IneCp008Option = {
    value: formatStatement(contradiction, names),
    statement: contradiction,
    isCorrect: true,
  };
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash(["cp008-contradiction"]), 16),
  );
  const distractors = random.shuffle(consistentCandidates).map(
    (statement): IneCp008Option => ({
      value: formatStatement(statement, names),
      statement,
      isCorrect: false,
      errorLabel: "ADDITION_IS_CONSISTENT_WITH_THE_CHAIN",
    }),
  );
  const optionResult = placeCorrect(
    correct,
    distractors,
    "CONTRADICTORY_ADDITION",
    seed,
  );
  const endpointRelation = descending ? ">" : "<";
  const reverseClaim = formatStatement(contradiction, names);
  const combinedChain = `${names.E1} ${relationSymbol(weak)} ${names.E2} ${relationSymbol(strict)} ${names.E3} = ${names.E4} ${relationSymbol(weak)} ${names.E5}`;
  return {
    scenario: {
      taskKind: "CONTRADICTORY_ADDITION" as const,
      topologyId: "STRICT_CHAIN_WITH_CANDIDATE_ADDITION",
      entityNames: names,
      baseStatements,
      query: { leftId: "E1", rightId: "E5" },
    },
    stem: "Which statement cannot be added without contradicting the given chain?",
    displayedStatements: [renderStatements(baseStatements, names)],
    optionResult,
    explanation: `Combine the given statements: ${combinedChain}. This shows ${names.E1} ${endpointRelation} ${names.E5}. The option ${reverseClaim} says the opposite, so it cannot be added.`,
  };
}

function buildReconstructRelation(
  seed: number,
  names: Readonly<Record<string, string>>,
) {
  const targetRelation = RELATIONS[((seed % 5) + 5) % 5]!;
  const reverseBlank = seed % 2 === 1;
  const requiredBlankRelation = reverseBlank
    ? reverseRelation(targetRelation)
    : targetRelation;
  const prefixRelation: ComparisonRelation =
    targetRelation === "GREATER_THAN"
      ? "GREATER_THAN_OR_EQUAL"
      : targetRelation === "LESS_THAN"
        ? "LESS_THAN_OR_EQUAL"
        : "EQUAL_TO";
  const fixedStatements = [
    c("E1", prefixRelation, "E2", "S1"),
    c("E2", "EQUAL_TO", "E3", "S2"),
    c("E4", "EQUAL_TO", "E5", "S4"),
  ];
  const optionFor = (
    relation: ComparisonRelation,
    isCorrect: boolean,
  ): IneCp008Option => {
    const missing = reverseBlank
      ? c("E4", relation, "E3", "S3")
      : c("E3", relation, "E4", "S3");
    const statementSet = [
      fixedStatements[0]!,
      fixedStatements[1]!,
      missing,
      fixedStatements[2]!,
    ];
    const strongest = assertSolverAgreement(statementSet, "E1", "E5")
      .graphEvidence?.strongestDefiniteRelation;
    return {
      value: relationSymbol(relation),
      relation,
      statementSet,
      isCorrect,
      errorLabel:
        isCorrect || strongest === targetRelation
          ? undefined
          : "PRODUCES_THE_WRONG_ENDPOINT_RELATION",
    };
  };
  const correct = optionFor(requiredBlankRelation, true);
  const omittedRelation =
    RELATIONS[(RELATIONS.indexOf(requiredBlankRelation) + 1) % RELATIONS.length]!;
  const distractors = RELATIONS
    .filter(
      (entry) =>
        entry !== requiredBlankRelation && entry !== omittedRelation,
    )
    .map((relation) => optionFor(relation, false));
  const optionResult = placeCorrect(
    correct,
    distractors,
    "RECONSTRUCT_RELATION",
    seed,
  );
  const blankText = reverseBlank
    ? `${names.E4} ___ ${names.E3}`
    : `${names.E3} ___ ${names.E4}`;
  const displayedChain = `${formatStatement(fixedStatements[0]!, names)}; ${formatStatement(fixedStatements[1]!, names)}; ${blankText}; ${formatStatement(fixedStatements[2]!, names)}`;
  const targetText = `${names.E1} ${relationSymbol(targetRelation)} ${names.E5}`;
  const blankReason = reverseBlank
    ? `We need ${names.E3} ${relationSymbol(targetRelation)} ${names.E4}, but the blank is written as ${names.E4} ___ ${names.E3}. So use ${relationSymbol(requiredBlankRelation)}.`
    : `Put ${relationSymbol(requiredBlankRelation)} in the blank.`;
  const combinedChain = `${names.E1} ${relationSymbol(prefixRelation)} ${names.E2} = ${names.E3} ${relationSymbol(targetRelation)} ${names.E4} = ${names.E5}`;
  return {
    scenario: {
      taskKind: "RECONSTRUCT_RELATION" as const,
      topologyId: "FOUR_EDGE_CHAIN_WITH_MISSING_MIDDLE_RELATION",
      entityNames: names,
      baseStatements: fixedStatements,
      targetConclusion: c("E1", targetRelation, "E5", "TARGET"),
      query: { leftId: "E1", rightId: "E5" },
    },
    stem: `Which relation should fill the blank so that the strongest endpoint relation is ${targetText}?`,
    displayedStatements: [displayedChain],
    optionResult,
    explanation: `${blankReason} The full chain becomes ${combinedChain}. Therefore, ${targetText}.`,
  };
}

function buildPossibleConclusion(
  seed: number,
  names: Readonly<Record<string, string>>,
) {
  const descending = seed % 2 === 0;
  const weak: ComparisonRelation = descending
    ? "GREATER_THAN_OR_EQUAL"
    : "LESS_THAN_OR_EQUAL";
  const strict: ComparisonRelation = descending ? "GREATER_THAN" : "LESS_THAN";
  const baseStatements = [
    c("E1", weak, "E2", "S1"),
    c("E2", "EQUAL_TO", "E3", "S2"),
    c("E3", strict, "E4", "S3"),
    c("E5", "EQUAL_TO", "E1", "S4"),
  ];
  const possibleRelation: ComparisonRelation =
    seed % 4 < 2 ? strict : "EQUAL_TO";
  const possible = c("E1", possibleRelation, "E2", "C1");
  const definite = c("E1", strict, "E4", "C2");
  const impossibleReverse = descending
    ? c("E4", "GREATER_THAN_OR_EQUAL", "E1", "C3")
    : c("E4", "LESS_THAN_OR_EQUAL", "E1", "C3");
  const impossibleEquality = c("E3", "EQUAL_TO", "E4", "C4");
  const candidates = [possible, definite, impossibleReverse, impossibleEquality];
  const entries = candidates.map((conclusion) => ({
    conclusion,
    evaluation: evaluateConclusion(baseStatements, conclusion),
  }));
  const possibleEntries = entries.filter(
    (entry) => entry.evaluation.truth === "POSSIBLY_TRUE",
  );
  if (possibleEntries.length !== 1 || possibleEntries[0]!.conclusion !== possible)
    throw new Error("Possible-conclusion scenario does not have a unique answer.");
  const correct: IneCp008Option = {
    value: formatStatement(possible, names),
    conclusion: possible,
    conclusionTruth: "POSSIBLY_TRUE",
    isCorrect: true,
  };
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash(["cp008-possible"]), 16),
  );
  const distractors = random.shuffle(entries.slice(1)).map(
    (entry): IneCp008Option => ({
      value: formatStatement(entry.conclusion, names),
      conclusion: entry.conclusion,
      conclusionTruth: entry.evaluation.truth,
      isCorrect: false,
      errorLabel:
        entry.evaluation.truth === "DEFINITELY_TRUE"
          ? "CONCLUSION_IS_DEFINITE_NOT_MERELY_POSSIBLE"
          : "CONCLUSION_IS_IMPOSSIBLE",
    }),
  );
  const optionResult = placeCorrect(
    correct,
    distractors,
    "POSSIBLE_CONCLUSION",
    seed,
  );
  const weakText = formatStatement(baseStatements[0]!, names);
  const possibleText = formatStatement(possible, names);
  const weakMeaning = descending
    ? `${names.E1} may be greater than ${names.E2}, or the two may be equal`
    : `${names.E1} may be less than ${names.E2}, or the two may be equal`;
  return {
    scenario: {
      taskKind: "POSSIBLE_CONCLUSION" as const,
      topologyId: "INCLUSIVE_EDGE_WITH_STRICT_DOWNSTREAM_CHAIN",
      entityNames: names,
      baseStatements,
      query: { leftId: "E1", rightId: "E2" },
    },
    stem: "Which conclusion is possible but is not definitely true?",
    displayedStatements: [renderStatements(baseStatements, names)],
    optionResult,
    explanation: `${weakText} means ${weakMeaning}. So ${possibleText} can be true, but it is not certain. That is why this is the correct option.`,
  };
}

export function generateIneCp008Question(
  prototypeId: IneCp008PrototypeId,
  seed = 0,
): GeneratedIneCp008Question {
  const contract = getIneCp008PrototypeContract(prototypeId);
  const names = namesFor(seed);
  const built =
    contract.taskKind === "SELECT_STATEMENT_SET"
      ? buildSelectStatementSet(seed, names)
      : contract.taskKind === "CONTRADICTORY_ADDITION"
        ? buildContradictoryAddition(seed, names)
        : contract.taskKind === "RECONSTRUCT_RELATION"
          ? buildReconstructRelation(seed, names)
          : buildPossibleConclusion(seed, names);
  const question: GeneratedIneCp008Question = {
    recordId: `INE-CP008-${stableHash([prototypeId, seed, "record-v1"]).toUpperCase()}`,
    packageId: "INE-001",
    checkpointId: "INE-CP-008",
    prototypeId,
    authorityId: contract.authorityId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    seed,
    locale: "en-IN",
    difficulty: "HARD",
    stem: built.stem,
    displayedStatements: built.displayedStatements,
    options: built.optionResult.options,
    correctIndex: built.optionResult.correctIndex,
    explanation: built.explanation,
    structuredScenario: built.scenario,
    metadata: {
      runtimeVersion: "ine-cp008-prototype-v1",
      reviewStatus: "PENDING_MANUAL_REVIEW",
      deliveryProfile: contract.deliveryProfile,
      examApplicability: contract.examApplicability,
      localeReadiness: "ENGLISH_ONLY",
      releaseGate: "MANUAL_REVIEW_REQUIRED",
      topologyId: built.scenario.topologyId,
      sourceLedgerIds: contract.sourceLedgerIds,
      contentHash: stableHash([
        built.scenario.topologyId,
        built.stem,
        ...built.displayedStatements,
        ...built.optionResult.options.map((entry) => entry.value),
        built.explanation,
      ]),
      independentSolverAgreed: true,
    },
  };
  const validation = validateIneCp008Question(question);
  if (!validation.valid)
    throw new Error(`${prototypeId}/${seed}: ${validation.errors.join(" ")}`);
  return question;
}
