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
  IneCp007NumericTest,
} from "./types";
import { validateIneCp007Question } from "./validator";

const RELATIONS: readonly ComparisonRelation[] = [
  "GREATER_THAN",
  "LESS_THAN",
  "EQUAL_TO",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN_OR_EQUAL",
];

const ENTITY_TRIPLETS: readonly (readonly [string, string, string])[] = [
  ["P", "Q", "R"],
  ["M", "N", "T"],
  ["H", "K", "L"],
  ["C", "D", "F"],
  ["W", "X", "Y"],
  ["G", "J", "V"],
  ["S", "U", "Z"],
  ["E", "I", "O"],
  ["N", "V", "W"],
  ["D", "K", "S"],
  ["F", "R", "T"],
  ["J", "M", "P"],
];

const NUMBER_CASES: readonly {
  high: number;
  low: number;
  equal: number;
}[] = [
  { high: 8, low: 3, equal: 5 },
  { high: 12, low: 7, equal: 9 },
  { high: 15, low: 6, equal: 11 },
  { high: 21, low: 14, equal: 8 },
  { high: 18, low: 5, equal: 13 },
  { high: 25, low: 9, equal: 7 },
  { high: 17, low: 4, equal: 10 },
  { high: 30, low: 16, equal: 12 },
  { high: 19, low: 2, equal: 6 },
  { high: 24, low: 11, equal: 15 },
  { high: 14, low: 1, equal: 4 },
  { high: 27, low: 13, equal: 16 },
];

function entityNamesFor(seed: number) {
  const names =
    ENTITY_TRIPLETS[
      ((seed % ENTITY_TRIPLETS.length) + ENTITY_TRIPLETS.length) %
        ENTITY_TRIPLETS.length
    ]!;
  return { left: names[0], middle: names[1], right: names[2] };
}

function numberCaseFor(seed: number) {
  return NUMBER_CASES[
    ((seed % NUMBER_CASES.length) + NUMBER_CASES.length) % NUMBER_CASES.length
  ]!;
}

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

function relationTests(
  relation: ComparisonRelation,
  values: { high: number; low: number; equal: number },
): readonly IneCp007NumericTest[] {
  switch (relation) {
    case "GREATER_THAN":
      return [
        { left: values.high, right: values.low, expected: true },
        { left: values.equal, right: values.equal, expected: false },
      ];
    case "GREATER_THAN_OR_EQUAL":
      return [
        { left: values.high, right: values.low, expected: true },
        { left: values.equal, right: values.equal, expected: true },
      ];
    case "LESS_THAN":
      return [
        { left: values.low, right: values.high, expected: true },
        { left: values.equal, right: values.equal, expected: false },
      ];
    case "LESS_THAN_OR_EQUAL":
      return [
        { left: values.low, right: values.high, expected: true },
        { left: values.equal, right: values.equal, expected: true },
      ];
    case "EQUAL_TO":
      return [
        { left: values.equal, right: values.equal, expected: true },
        { left: values.high, right: values.low, expected: false },
      ];
  }
}

function renderNumericTests(
  tests: readonly IneCp007NumericTest[],
  symbol: string,
): string[] {
  return tests.map(
    (test) =>
      `${test.left} ${symbol} ${test.right} is ${test.expected ? "true" : "false"}`,
  );
}

function foilRelationFor(relation: ComparisonRelation): ComparisonRelation {
  switch (relation) {
    case "GREATER_THAN":
      return "GREATER_THAN_OR_EQUAL";
    case "GREATER_THAN_OR_EQUAL":
      return "GREATER_THAN";
    case "LESS_THAN":
      return "LESS_THAN_OR_EQUAL";
    case "LESS_THAN_OR_EQUAL":
      return "LESS_THAN";
    case "EQUAL_TO":
      return "GREATER_THAN_OR_EQUAL";
  }
}

function recoveryExplanation(
  symbol: string,
  target: ComparisonRelation,
  foil: ComparisonRelation,
  tests: readonly IneCp007NumericTest[],
): string {
  const targetSign = ordinaryRelationSymbol(target);
  const foilSign = ordinaryRelationSymbol(foil);
  if (target === "GREATER_THAN" || target === "LESS_THAN")
    return `From the three known entries, ${symbol} can only mean ${targetSign} or ${foilSign}. The result ${tests[1]!.left} ${symbol} ${tests[1]!.right} is false rules out ${foilSign}, because equality is allowed in ${foilSign}. Therefore, ${symbol} means ${targetSign} (${ordinaryRelationWords(target)}).`;
  if (
    target === "GREATER_THAN_OR_EQUAL" ||
    target === "LESS_THAN_OR_EQUAL"
  )
    return `From the three known entries, ${symbol} can only mean ${targetSign} or ${foilSign}. The result ${tests[1]!.left} ${symbol} ${tests[1]!.right} is true rules out the strict sign ${foilSign}. Therefore, ${symbol} means ${targetSign} (${ordinaryRelationWords(target)}).`;
  return `From the three known entries, ${symbol} can only mean ${targetSign} or ${foilSign}. Although ${tests[0]!.left} ${symbol} ${tests[0]!.right} is true for both, ${tests[1]!.left} ${symbol} ${tests[1]!.right} is false. It would be true for ${foilSign}, so ${symbol} must mean ${targetSign} (${ordinaryRelationWords(target)}).`;
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
  const entityNames = entityNamesFor(seed);
  const numberCase = numberCaseFor(seed);
  const scenario: IneCp007Scenario = {
    taskKind: contract.taskKind,
    codeMap,
    targetRelation,
    evidence: [],
    codeKey: [],
    candidateRelations: RELATIONS,
    entityNames,
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
      `${entityNames.left} ___ ${entityNames.middle} ${equalCode} ${entityNames.right}`,
      `Required strongest relation: ${entityNames.left} ${relationSymbol} ${entityNames.right}`,
    ];
    scenario.evidence = displayedEvidence;
    scenario.codeKey = displayedCodeKey;
    const first = createComparisonConstraint(
      entityNames.left,
      targetRelation,
      entityNames.middle,
      "S1",
    );
    const second = createComparisonConstraint(
      entityNames.middle,
      "EQUAL_TO",
      entityNames.right,
      "S2",
    );
    const strongest = strongestDefiniteRelation(
      assertSolverAgreement(
        [first, second],
        entityNames.left,
        entityNames.right,
      ).modelEvidence.possibleAtomicRelations,
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
    explanation = `${entityNames.middle} = ${entityNames.right}, so replacing ${entityNames.middle} with ${entityNames.right} does not change the comparison. To obtain ${entityNames.left} ${relationSymbol} ${entityNames.right}, the blank must be ${codeMap.symbolByRelation[targetRelation]} (${relationSymbol}).`;
  } else if (contract.taskKind === "SELECT_EXPRESSION") {
    displayedCodeKey = renderCodeKey(codeMap).map((entry) => entry.text);
    displayedEvidence = [
      `Required strongest relation: ${entityNames.left} ${relationSymbol} ${entityNames.right}`,
    ];
    scenario.evidence = displayedEvidence;
    scenario.codeKey = displayedCodeKey;
    const equalCode = codeMap.symbolByRelation.EQUAL_TO;
    optionResult = relationOptions(
      targetRelation,
      scenario,
      seed,
      (relation) =>
        `${entityNames.left} ${codeMap.symbolByRelation[relation]} ${entityNames.middle} ${equalCode} ${entityNames.right}`,
    );
    stem = "Which coded expression establishes the required strongest relation?";
    explanation = `${entityNames.middle} = ${entityNames.right}, so only the first symbol decides the answer. ${codeMap.symbolByRelation[targetRelation]} means ${relationSymbol}, giving ${entityNames.left} ${relationSymbol} ${entityNames.middle} = ${entityNames.right} and therefore ${entityNames.left} ${relationSymbol} ${entityNames.right}.`;
  } else if (contract.taskKind === "RECOVER_MAP") {
    const missingSymbol = codeMap.symbolByRelation[targetRelation];
    const foilRelation = foilRelationFor(targetRelation);
    const tests = relationTests(targetRelation, numberCase);
    displayedCodeKey = renderCodeKey(codeMap)
      .filter(
        (entry) =>
          entry.relation !== targetRelation && entry.relation !== foilRelation,
      )
      .map((entry) => entry.text);
    displayedEvidence = [
      "The five symbols have five different meanings: >, <, =, ≥ and ≤.",
      `Only two meanings remain for ${missingSymbol}: ${ordinaryRelationSymbol(targetRelation)} or ${ordinaryRelationSymbol(foilRelation)}.`,
      ...renderNumericTests(tests, missingSymbol),
    ];
    scenario.evidence = displayedEvidence;
    scenario.codeKey = displayedCodeKey;
    scenario.candidateRelations = [targetRelation, foilRelation];
    scenario.numericTests = tests;
    optionResult = relationOptions(
      targetRelation,
      scenario,
      seed,
      ordinaryRelationWords,
    );
    stem = `Use the test results to determine what the coded symbol '${missingSymbol}' means.`;
    explanation = recoveryExplanation(
      missingSymbol,
      targetRelation,
      foilRelation,
      tests,
    );
  } else {
    displayedEvidence = RELATIONS.flatMap((relation) =>
      renderNumericTests(
        relationTests(relation, numberCase),
        codeMap.symbolByRelation[relation],
      ),
    );
    scenario.evidence = displayedEvidence;
    const correct: IneCp007Option = {
      value: mapSummary(codeMap),
      isCorrect: true,
    };
    const swapPool = RELATIONS.flatMap((_relation, first) =>
      RELATIONS.slice(first + 1).map(
        (_other, offset) => [first, first + offset + 1] as const,
      ),
    );
    const distractorRandom = new SeededRandom(
      seed ^
        Number.parseInt(
          stableHash([scenario.taskKind, "map-distractors-v2"]),
          16,
        ),
    );
    const distractors: IneCp007Option[] = distractorRandom
      .shuffle(swapPool)
      .slice(0, 3)
      .map(([first, second]) => ({
        value: swappedMapSummary(scenario, first, second),
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
