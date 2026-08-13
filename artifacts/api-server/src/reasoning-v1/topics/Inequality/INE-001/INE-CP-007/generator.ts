import { createComparisonConstraint } from "../foundation/relations";
import { SeededRandom, stableHash } from "../foundation/prng";
import { strongestDefiniteRelation } from "../foundation/relations";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type { ComparisonRelation } from "../foundation/types";
import {
  buildIneCp006CodeMap,
  ordinaryRelationSymbol,
  ordinaryRelationWords,
  renderCodeKey,
} from "../INE-CP-006/coded-renderer";
import { getIneCp007PrototypeContract } from "./contracts";
import type {
  GeneratedIneCp007Question,
  IneCp007Option,
  IneCp007PrototypeId,
  IneCp007Scenario,
} from "./types";
import { validateIneCp007Question } from "./validator";

const RELATIONS: readonly ComparisonRelation[] = [
  "GREATER_THAN",
  "LESS_THAN",
  "EQUAL_TO",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN_OR_EQUAL",
];

function balancedIndex(namespace: string, seed: number): number {
  const block = Math.floor((seed >>> 0) / 4);
  const slot = (seed >>> 0) % 4;
  const random = new SeededRandom(
    Number.parseInt(stableHash([namespace, block, "cp007-position-v1"]), 16),
  );
  return random.shuffle([0, 1, 2, 3])[slot]!;
}

function placeCorrect(
  correct: IneCp007Option,
  distractors: readonly IneCp007Option[],
  namespace: string,
  seed: number,
) {
  const correctIndex = balancedIndex(namespace, seed);
  let next = 0;
  return {
    correctIndex,
    options: Array.from({ length: 4 }, (_, index) =>
      index === correctIndex ? correct : distractors[next++]!,
    ),
  };
}

function relationOptions(
  target: ComparisonRelation,
  scenario: IneCp007Scenario,
  seed: number,
  render: (relation: ComparisonRelation) => string,
) {
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash([scenario.taskKind, "cp007-options-v1"]), 16),
  );
  const correct: IneCp007Option = {
    value: render(target),
    relation: target,
    isCorrect: true,
  };
  const distractors = random
    .shuffle(RELATIONS.filter((relation) => relation !== target))
    .slice(0, 3)
    .map((relation): IneCp007Option => ({
      value: render(relation),
      relation,
      isCorrect: false,
      errorLabel: "SELECTED_WRONG_RELATION_OR_CODE",
    }));
  return placeCorrect(correct, distractors, scenario.taskKind, seed);
}

function relationEvidence(
  relation: ComparisonRelation,
  symbol: string,
): readonly string[] {
  switch (relation) {
    case "GREATER_THAN":
      return [`8 ${symbol} 3 is true`, `5 ${symbol} 5 is false`];
    case "GREATER_THAN_OR_EQUAL":
      return [`8 ${symbol} 3 is true`, `5 ${symbol} 5 is true`];
    case "LESS_THAN":
      return [`3 ${symbol} 8 is true`, `5 ${symbol} 5 is false`];
    case "LESS_THAN_OR_EQUAL":
      return [`3 ${symbol} 8 is true`, `5 ${symbol} 5 is true`];
    case "EQUAL_TO":
      return [`5 ${symbol} 5 is true`, `8 ${symbol} 3 is false`];
  }
}

function mapSummary(
  codeMap: IneCp007Scenario["codeMap"],
  relations = RELATIONS,
): string {
  return relations
    .map(
      (relation) =>
        `${codeMap.symbolByRelation[relation]} = ${ordinaryRelationSymbol(relation)}`,
    )
    .join(", ");
}

function swappedMapSummary(
  scenario: IneCp007Scenario,
  first: number,
  second: number,
): string {
  const assignments = RELATIONS.map((relation) => ({
    symbol: scenario.codeMap.symbolByRelation[relation],
    relation,
  }));
  [assignments[first]!.relation, assignments[second]!.relation] = [
    assignments[second]!.relation,
    assignments[first]!.relation,
  ];
  return assignments
    .map(
      (entry) =>
        `${entry.symbol} = ${ordinaryRelationSymbol(entry.relation)}`,
    )
    .join(", ");
}

function buildQuestion(
  prototypeId: IneCp007PrototypeId,
  seed: number,
): Omit<GeneratedIneCp007Question, "recordId" | "metadata"> {
  const contract = getIneCp007PrototypeContract(prototypeId);
  const codeMap = buildIneCp006CodeMap(seed, "ASCII_EXAM_PROFILE");
  const targetRelation = RELATIONS[((seed % 5) + 5) % 5]!;
  const scenario: IneCp007Scenario = {
    taskKind: contract.taskKind,
    codeMap,
    targetRelation,
    evidence: [],
    codeKey: [],
    candidateRelations: RELATIONS,
  };
  const relationSymbol = ordinaryRelationSymbol(targetRelation);
  let stem = "";
  let displayedEvidence: readonly string[] = [];
  let displayedCodeKey: readonly string[] = [];
  let explanation = "";
  let optionResult: { options: readonly IneCp007Option[]; correctIndex: number };

  if (contract.taskKind === "MISSING_OPERATOR") {
    displayedCodeKey = renderCodeKey(codeMap).map((entry) => entry.text);
    const equalCode = codeMap.symbolByRelation.EQUAL_TO;
    displayedEvidence = [
      `P ___ Q ${equalCode} R`,
      `Required strongest relation: P ${relationSymbol} R`,
    ];
    scenario.evidence = displayedEvidence;
    scenario.codeKey = displayedCodeKey;
    const first = createComparisonConstraint("P", targetRelation, "Q", "S1");
    const second = createComparisonConstraint("Q", "EQUAL_TO", "R", "S2");
    const strongest = strongestDefiniteRelation(
      assertSolverAgreement([first, second], "P", "R").modelEvidence
        .possibleAtomicRelations,
    );
    if (strongest !== targetRelation)
      throw new Error("Missing-operator scenario did not preserve the target relation.");
    optionResult = relationOptions(
      targetRelation,
      scenario,
      seed,
      (relation) => codeMap.symbolByRelation[relation],
    );
    stem = "Which coded symbol should fill the blank so that the required strongest relation is obtained?";
    explanation = `Q = R, so replacing Q with R does not change the comparison. To obtain P ${relationSymbol} R, the blank must be ${codeMap.symbolByRelation[targetRelation]} (${relationSymbol}).`;
  } else if (contract.taskKind === "SELECT_EXPRESSION") {
    displayedCodeKey = renderCodeKey(codeMap).map((entry) => entry.text);
    displayedEvidence = [`Required strongest relation: P ${relationSymbol} R`];
    scenario.evidence = displayedEvidence;
    scenario.codeKey = displayedCodeKey;
    const equalCode = codeMap.symbolByRelation.EQUAL_TO;
    optionResult = relationOptions(
      targetRelation,
      scenario,
      seed,
      (relation) => `P ${codeMap.symbolByRelation[relation]} Q ${equalCode} R`,
    );
    stem = "Which coded expression establishes the required strongest relation?";
    explanation = `Q = R, so only the first symbol decides the answer. ${codeMap.symbolByRelation[targetRelation]} means ${relationSymbol}, giving P ${relationSymbol} Q = R and therefore P ${relationSymbol} R.`;
  } else if (contract.taskKind === "RECOVER_MAP") {
    const missingSymbol = codeMap.symbolByRelation[targetRelation];
    displayedCodeKey = renderCodeKey(codeMap)
      .filter((entry) => entry.relation !== targetRelation)
      .map((entry) => entry.text);
    displayedEvidence = [
      "The five symbols have five different meanings: >, <, =, ≥ and ≤.",
      `Meaning of ${missingSymbol}: ?`,
    ];
    scenario.evidence = displayedEvidence;
    scenario.codeKey = displayedCodeKey;
    optionResult = relationOptions(
      targetRelation,
      scenario,
      seed,
      ordinaryRelationWords,
    );
    stem = `What must ${missingSymbol} mean to complete the one-to-one code map?`;
    explanation = `The other four meanings are already used. The only meaning left for ${missingSymbol} is ${ordinaryRelationWords(targetRelation)}.`;
  } else {
    displayedEvidence = RELATIONS.flatMap((relation) =>
      relationEvidence(relation, codeMap.symbolByRelation[relation]),
    );
    scenario.evidence = displayedEvidence;
    const correct: IneCp007Option = {
      value: mapSummary(codeMap),
      isCorrect: true,
    };
    const distractors: IneCp007Option[] = [
      [0, 3],
      [1, 4],
      [0, 1],
    ].map(([first, second]) => ({
      value: swappedMapSummary(scenario, first!, second!),
      isCorrect: false,
      errorLabel: "MAP_CONTRADICTS_TEST_EVIDENCE",
    }));
    optionResult = placeCorrect(correct, distractors, scenario.taskKind, seed);
    stem = "Which complete code map is consistent with every test result?";
    explanation = `Equal-value tests distinguish strict from inclusive signs. Checking all the results gives: ${mapSummary(codeMap)}.`;
  }

  return {
    packageId: "INE-001",
    checkpointId: "INE-CP-007",
    prototypeId,
    authorityId: contract.authorityId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    seed,
    locale: "en-IN",
    difficulty:
      contract.taskKind === "MISSING_OPERATOR" ||
      contract.taskKind === "SELECT_EXPRESSION"
        ? "HARD"
        : "MEDIUM",
    stem,
    displayedCodeKey,
    displayedEvidence,
    options: optionResult.options,
    correctIndex: optionResult.correctIndex,
    explanation,
    structuredScenario: scenario,
  };
}

export function generateIneCp007Question(
  prototypeId: IneCp007PrototypeId,
  seed = 0,
): GeneratedIneCp007Question {
  const contract = getIneCp007PrototypeContract(prototypeId);
  const core = buildQuestion(prototypeId, seed);
  const question: GeneratedIneCp007Question = {
    ...core,
    recordId: `INE-CP007-${stableHash([prototypeId, seed, "record-v1"]).toUpperCase()}`,
    metadata: {
      runtimeVersion: "ine-cp007-prototype-v1",
      reviewStatus: "PENDING_MANUAL_REVIEW",
      deliveryProfile: contract.deliveryProfile,
      examApplicability: contract.examApplicability,
      localeReadiness: "ENGLISH_ONLY",
      releaseGate: "MANUAL_REVIEW_REQUIRED",
      contentHash: stableHash([
        core.stem,
        ...core.displayedCodeKey,
        ...core.displayedEvidence,
        ...core.options.map((entry) => entry.value),
        core.explanation,
      ]),
      sourceLedgerIds: contract.sourceLedgerIds,
      independentSolverAgreed: true,
    },
  };
  const validation = validateIneCp007Question(question);
  if (!validation.valid)
    throw new Error(`${prototypeId}/${seed}: ${validation.errors.join(" ")}`);
  return question;
}
