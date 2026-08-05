import { decodeScenario, relationOf } from "../BLR-CP-006/cp006-graph";
import type {
  BlrCp006CodedStatement,
  BlrCp006DirectRelation,
  BlrCp006Graph,
  BlrCp006Relation,
  BlrCp006Scenario,
} from "../BLR-CP-006/cp006-model";
import type {
  BlrCp007PrototypeId,
  BlrCp007Query,
  BlrCp007Scenario,
} from "./cp007-model";
import {
  BLR_CP007_V2_ANSWER_POSITION_PATTERNS,
  positiveModulo,
  shuffled,
  type BlrCp007V2FailureCode,
  type BlrCp007V2Option,
} from "./cp007-v2-model";

export function codedLine(value: BlrCp006CodedStatement): string {
  return `${value.leftId} ${value.token} ${value.rightId}`;
}

export function expressionText(
  statements: readonly BlrCp006CodedStatement[],
): string {
  return statements.map(codedLine).join("; ");
}

export function relationForCodeToken(
  scenario: BlrCp007Scenario,
  token: string,
): BlrCp006DirectRelation {
  const found = scenario.codeKey.find((entry) => entry.token === token);
  if (!found) throw new Error(`${scenario.scenarioId}: unknown token ${token}.`);
  return found.relationId;
}

export function targetForQuery(
  query: BlrCp007Query,
): { subjectId: string; relationId: BlrCp006Relation; referenceId: string } | undefined {
  if (
    query.kind === "SELECT_EXPRESSION" ||
    query.kind === "MISSING_TOKEN" ||
    query.kind === "MISSING_TOKEN_PAIR" ||
    query.kind === "MISSING_PERSON"
  ) return query.target;
  return undefined;
}

export function decodeBlrCp007V2(
  scenario: BlrCp007Scenario,
  statements: readonly BlrCp006CodedStatement[],
  suffix: string,
): { graph: BlrCp006Graph; decodedStatements: readonly string[] } {
  if (!statements.length) throw new Error(`${scenario.scenarioId}: no statement.`);
  const first = statements[0]!;
  const cp006Scenario: BlrCp006Scenario = {
    scenarioId: `${scenario.scenarioId}::${suffix}`,
    topologyId: scenario.topologyId,
    keyStyle: scenario.keyStyle,
    codeKey: scenario.codeKey,
    statements,
    expressionLines: statements.map(codedLine),
    query: {
      kind: "RELATION",
      subjectId: first.leftId,
      referenceId: first.rightId,
    },
    authority: "RESOLVE_CODED_RELATION",
    prototypeId: "BLR-CP006-PROT-DIRECT-FORWARD",
    qlId: "BLR-QL-026",
    stem: "CP-007 V2 option validation",
  };
  return decodeScenario(cp006Scenario);
}

function safeRelation(
  graph: BlrCp006Graph,
  subjectId: string,
  referenceId: string,
): BlrCp006Relation | undefined {
  try {
    return relationOf(graph, subjectId, referenceId);
  } catch {
    return undefined;
  }
}

interface EvaluatedStatements {
  graph: BlrCp006Graph;
  decodedStatements: readonly string[];
  actualRelation?: BlrCp006Relation;
  targetSatisfied?: boolean;
  statementValidity?: "VALID" | "INVALID";
}

function evaluateStatements(
  scenario: BlrCp007Scenario,
  statements: readonly BlrCp006CodedStatement[],
  semanticKey: string,
  claim?: {
    subjectId: string;
    relationId: BlrCp006Relation;
    referenceId: string;
  },
): EvaluatedStatements | undefined {
  try {
    const decoded = decodeBlrCp007V2(scenario, statements, semanticKey);
    const target = targetForQuery(scenario.query);
    const actualRelation = claim
      ? safeRelation(decoded.graph, claim.subjectId, claim.referenceId)
      : target
        ? safeRelation(decoded.graph, target.subjectId, target.referenceId)
        : undefined;
    return {
      graph: decoded.graph,
      decodedStatements: decoded.decodedStatements,
      actualRelation,
      targetSatisfied: target ? actualRelation === target.relationId : undefined,
      statementValidity: claim
        ? actualRelation === claim.relationId
          ? "VALID"
          : "INVALID"
        : undefined,
    };
  } catch {
    return undefined;
  }
}

function substituteToken(
  statements: readonly BlrCp006CodedStatement[],
  index: number,
  token: string,
): readonly BlrCp006CodedStatement[] {
  return statements.map((entry, current) =>
    current === index ? { ...entry, token } : entry,
  );
}

function substitutePair(
  statements: readonly BlrCp006CodedStatement[],
  indices: readonly [number, number],
  tokens: readonly [string, string],
): readonly BlrCp006CodedStatement[] {
  return statements.map((entry, index) => {
    if (index === indices[0]) return { ...entry, token: tokens[0] };
    if (index === indices[1]) return { ...entry, token: tokens[1] };
    return entry;
  });
}

function substitutePerson(
  query: Extract<BlrCp007Query, { kind: "MISSING_PERSON" }>,
  personId: string,
): readonly BlrCp006CodedStatement[] {
  return query.completeStatements.map((entry, index) => {
    if (index !== query.blankStatementIndex) return entry;
    return query.blankSide === "LEFT"
      ? { ...entry, leftId: personId }
      : { ...entry, rightId: personId };
  });
}

const GENDER_PAIRS: readonly (readonly [BlrCp006Relation, BlrCp006Relation])[] = [
  ["FATHER", "MOTHER"],
  ["SON", "DAUGHTER"],
  ["BROTHER", "SISTER"],
  ["HUSBAND", "WIFE"],
  ["GRANDFATHER", "GRANDMOTHER"],
  ["GRANDSON", "GRANDDAUGHTER"],
  ["UNCLE", "AUNT"],
  ["NEPHEW", "NIECE"],
  ["FATHER_IN_LAW", "MOTHER_IN_LAW"],
  ["SON_IN_LAW", "DAUGHTER_IN_LAW"],
  ["BROTHER_IN_LAW", "SISTER_IN_LAW"],
];

const INVERSE_RELATIONS: Readonly<Record<string, BlrCp006Relation>> = {
  FATHER: "CHILD",
  MOTHER: "CHILD",
  PARENT: "CHILD",
  SON: "PARENT",
  DAUGHTER: "PARENT",
  CHILD: "PARENT",
  HUSBAND: "WIFE",
  WIFE: "HUSBAND",
  GRANDFATHER: "GRANDCHILD",
  GRANDMOTHER: "GRANDCHILD",
  GRANDPARENT: "GRANDCHILD",
  GRANDSON: "GRANDPARENT",
  GRANDDAUGHTER: "GRANDPARENT",
  GRANDCHILD: "GRANDPARENT",
  UNCLE: "NEPHEW_OR_NIECE",
  AUNT: "NEPHEW_OR_NIECE",
  NEPHEW: "UNCLE_OR_AUNT",
  NIECE: "UNCLE_OR_AUNT",
  FATHER_IN_LAW: "CHILD_IN_LAW",
  MOTHER_IN_LAW: "CHILD_IN_LAW",
  SON_IN_LAW: "PARENT_IN_LAW",
  DAUGHTER_IN_LAW: "PARENT_IN_LAW",
};

function generationBand(relation: BlrCp006Relation): number {
  if (
    ["FATHER", "MOTHER", "PARENT", "FATHER_IN_LAW", "MOTHER_IN_LAW", "PARENT_IN_LAW"].includes(
      relation,
    )
  ) return 1;
  if (
    ["SON", "DAUGHTER", "CHILD", "SON_IN_LAW", "DAUGHTER_IN_LAW", "CHILD_IN_LAW"].includes(
      relation,
    )
  ) return -1;
  if (["GRANDFATHER", "GRANDMOTHER", "GRANDPARENT"].includes(relation)) return 2;
  if (["GRANDSON", "GRANDDAUGHTER", "GRANDCHILD"].includes(relation)) return -2;
  return 0;
}

function classifyRelationFailure(
  target: { subjectId: string; relationId: BlrCp006Relation; referenceId: string },
  actual?: BlrCp006Relation,
): BlrCp007V2FailureCode {
  if (!actual) return "DISCONNECTED_PATH";
  if (INVERSE_RELATIONS[target.relationId] === actual) return "REVERSED_DIRECTION";
  if (
    GENDER_PAIRS.some(
      ([left, right]) =>
        (target.relationId === left && actual === right) ||
        (target.relationId === right && actual === left),
    )
  ) return "WRONG_GENDER";
  if (generationBand(target.relationId) !== generationBand(actual)) {
    return "WRONG_GENERATION";
  }
  return "WRONG_RELATION";
}

function selectExpressionOptions(scenario: BlrCp007Scenario): BlrCp007V2Option[] {
  if (scenario.query.kind !== "SELECT_EXPRESSION") throw new Error("Wrong query kind.");
  const target = scenario.query.target;
  const candidates = [...scenario.query.candidates];
  const correct = candidates.find((candidate) =>
    evaluateStatements(scenario, candidate.statements, candidate.semanticKey)?.targetSatisfied,
  );
  if (!correct) throw new Error(`${scenario.scenarioId}: no correct expression.`);

  const candidatePool = [...candidates];
  for (let index = 0; index < correct.statements.length; index += 1) {
    for (const definition of scenario.codeKey) {
      if (definition.token === correct.statements[index]!.token) continue;
      candidatePool.push({
        text: "",
        statements: substituteToken(correct.statements, index, definition.token),
        semanticKey: `V2_MUTATE_TOKEN_${index}_${definition.token}`,
      });
    }
    candidatePool.push({
      text: "",
      statements: correct.statements.map((entry, current) =>
        current === index
          ? { ...entry, leftId: entry.rightId, rightId: entry.leftId }
          : entry,
      ),
      semanticKey: `V2_REVERSE_LINK_${index}`,
    });
  }

  const rows = candidatePool
    .map((candidate) => ({
      candidate,
      evaluation: evaluateStatements(
        scenario,
        candidate.statements,
        candidate.semanticKey,
      ),
    }))
    .filter(
      (row): row is typeof row & { evaluation: EvaluatedStatements } =>
        Boolean(row.evaluation),
    )
    .filter(
      (row, index, all) =>
        all.findIndex(
          (seen) =>
            expressionText(seen.candidate.statements) ===
            expressionText(row.candidate.statements),
        ) === index,
    );
  const correctRow = rows.find(
    (row) =>
      row.evaluation.targetSatisfied &&
      expressionText(row.candidate.statements) === expressionText(correct.statements),
  );
  if (!correctRow) throw new Error(`${scenario.scenarioId}: correct expression lost.`);
  const wrongRows = shuffled(
    rows.filter((row) => !row.evaluation.targetSatisfied),
    `${scenario.scenarioId}|valid-expression-wrongs`,
  );
  if (wrongRows.length < 3) {
    throw new Error(`${scenario.scenarioId}: fewer than three graph-valid distractors.`);
  }
  return [correctRow, ...wrongRows.slice(0, 3)].map((row) => {
    const isCorrect = row === correctRow;
    return {
      text: expressionText(row.candidate.statements),
      semanticKey: row.candidate.semanticKey,
      isCorrect,
      failureCode: isCorrect
        ? undefined
        : classifyRelationFailure(target, row.evaluation.actualRelation),
      graphValidity: "VALID" as const,
      targetSatisfied: row.evaluation.targetSatisfied,
      decodedAssertions: row.evaluation.decodedStatements,
      actualRelation: row.evaluation.actualRelation,
      statements: row.candidate.statements,
      completionValue: { kind: "EXPRESSION" as const },
    };
  });
}

function missingTokenOptions(scenario: BlrCp007Scenario): BlrCp007V2Option[] {
  if (scenario.query.kind !== "MISSING_TOKEN") throw new Error("Wrong query kind.");
  const requiredToken =
    scenario.query.completeStatements[scenario.query.blankStatementIndex]!.token;
  const requiredRelation = relationForCodeToken(scenario, requiredToken);
  const rows = scenario.codeKey
    .map((definition) => {
      const statements = substituteToken(
        scenario.query.completeStatements,
        scenario.query.blankStatementIndex,
        definition.token,
      );
      return {
        definition,
        statements,
        evaluation: evaluateStatements(
          scenario,
          statements,
          `TOKEN_${definition.token}`,
        ),
      };
    })
    .filter(
      (row): row is typeof row & { evaluation: EvaluatedStatements } =>
        Boolean(row.evaluation),
    );
  const correct = rows.find((row) => row.definition.token === requiredToken);
  if (!correct) throw new Error(`${scenario.scenarioId}: correct token is invalid.`);
  const wrongs = shuffled(
    rows.filter((row) => row !== correct),
    `${scenario.scenarioId}|valid-token-wrongs`,
  );
  if (wrongs.length < 3) throw new Error(`${scenario.scenarioId}: insufficient token distractors.`);
  return [correct, ...wrongs.slice(0, 3)].map((row) => {
    const isCorrect = row === correct;
    const actualDirect = row.definition.relationId;
    const genderSwap = GENDER_PAIRS.some(
      ([left, right]) =>
        (requiredRelation === left && actualDirect === right) ||
        (requiredRelation === right && actualDirect === left),
    );
    return {
      text: row.definition.token,
      semanticKey: `TOKEN_${row.definition.token}`,
      isCorrect,
      failureCode: isCorrect
        ? undefined
        : genderSwap
          ? "WRONG_GENDER"
          : "WRONG_TOKEN_MEANING",
      graphValidity: "VALID" as const,
      targetSatisfied: row.evaluation.targetSatisfied,
      decodedAssertions: row.evaluation.decodedStatements,
      actualRelation: row.evaluation.actualRelation,
      statements: row.statements,
      completionValue: { kind: "TOKEN" as const, token: row.definition.token },
    };
  });
}

function missingPairOptions(scenario: BlrCp007Scenario): BlrCp007V2Option[] {
  if (scenario.query.kind !== "MISSING_TOKEN_PAIR") throw new Error("Wrong query kind.");
  const indices = scenario.query.blankStatementIndices;
  const required = [
    scenario.query.completeStatements[indices[0]]!.token,
    scenario.query.completeStatements[indices[1]]!.token,
  ] as const;
  const rows: {
    tokens: readonly [string, string];
    statements: readonly BlrCp006CodedStatement[];
    evaluation: EvaluatedStatements;
  }[] = [];
  for (const first of scenario.codeKey) {
    for (const second of scenario.codeKey) {
      const tokens = [first.token, second.token] as const;
      const statements = substitutePair(
        scenario.query.completeStatements,
        indices,
        tokens,
      );
      const evaluation = evaluateStatements(
        scenario,
        statements,
        `PAIR_${first.token}_${second.token}`,
      );
      if (evaluation) rows.push({ tokens, statements, evaluation });
    }
  }
  const correct = rows.find(
    (row) => row.tokens[0] === required[0] && row.tokens[1] === required[1],
  );
  if (!correct) throw new Error(`${scenario.scenarioId}: correct pair is invalid.`);
  const wrongs = shuffled(
    rows.filter(
      (row) => row.tokens[0] !== required[0] || row.tokens[1] !== required[1],
    ),
    `${scenario.scenarioId}|valid-pair-wrongs`,
  );
  const preferred = [
    wrongs.find(
      (row) => row.tokens[0] === required[1] && row.tokens[1] === required[0],
    ),
    wrongs.find(
      (row) => row.tokens[0] !== required[0] && row.tokens[1] === required[1],
    ),
    wrongs.find(
      (row) => row.tokens[0] === required[0] && row.tokens[1] !== required[1],
    ),
  ].filter((row): row is (typeof wrongs)[number] => Boolean(row));
  for (const row of wrongs) {
    if (preferred.length >= 3) break;
    if (!preferred.includes(row)) preferred.push(row);
  }
  if (preferred.length < 3) throw new Error(`${scenario.scenarioId}: insufficient pair distractors.`);
  return [correct, ...preferred.slice(0, 3)].map((row) => {
    const isCorrect = row === correct;
    const firstWrong = row.tokens[0] !== required[0];
    const secondWrong = row.tokens[1] !== required[1];
    const failureCode: BlrCp007V2FailureCode | undefined = isCorrect
      ? undefined
      : row.tokens[0] === required[1] && row.tokens[1] === required[0]
        ? "TOKENS_SWAPPED"
        : firstWrong && secondWrong
          ? "BOTH_TOKENS_WRONG"
          : firstWrong
            ? "FIRST_TOKEN_WRONG"
            : "SECOND_TOKEN_WRONG";
    return {
      text: `${row.tokens[0]}, ${row.tokens[1]}`,
      semanticKey: `PAIR_${row.tokens[0]}_${row.tokens[1]}`,
      isCorrect,
      failureCode,
      graphValidity: "VALID" as const,
      targetSatisfied: row.evaluation.targetSatisfied,
      decodedAssertions: row.evaluation.decodedStatements,
      actualRelation: row.evaluation.actualRelation,
      statements: row.statements,
      completionValue: { kind: "TOKEN_PAIR" as const, tokens: row.tokens },
    };
  });
}

function missingPersonOptions(scenario: BlrCp007Scenario): BlrCp007V2Option[] {
  if (scenario.query.kind !== "MISSING_PERSON") throw new Error("Wrong query kind.");
  const rows = scenario.query.candidatePersonIds
    .map((personId) => {
      const statements = substitutePerson(scenario.query, personId);
      return {
        personId,
        statements,
        evaluation: evaluateStatements(
          scenario,
          statements,
          `PERSON_${personId}`,
        ),
      };
    })
    .filter(
      (row): row is typeof row & { evaluation: EvaluatedStatements } =>
        Boolean(row.evaluation),
    );
  if (rows.length !== 4) {
    throw new Error(`${scenario.scenarioId}: every person option must form a valid graph.`);
  }
  const correctRows = rows.filter((row) => row.evaluation.targetSatisfied);
  if (correctRows.length !== 1) {
    throw new Error(`${scenario.scenarioId}: expected one correct person, got ${correctRows.length}.`);
  }
  const correct = correctRows[0]!;
  return rows.map((row) => ({
    text: row.personId,
    semanticKey: `PERSON_${row.personId}`,
    isCorrect: row === correct,
    failureCode: row === correct ? undefined : "WRONG_PERSON_IDENTITY",
    graphValidity: "VALID" as const,
    targetSatisfied: row.evaluation.targetSatisfied,
    decodedAssertions: row.evaluation.decodedStatements,
    actualRelation: row.evaluation.actualRelation,
    statements: row.statements,
    completionValue: { kind: "PERSON" as const, personId: row.personId },
  }));
}

function validityOptions(scenario: BlrCp007Scenario): BlrCp007V2Option[] {
  if (scenario.query.kind !== "SELECT_VALIDITY") throw new Error("Wrong query kind.");
  const options = scenario.query.candidates.map((candidate) => {
    if (!candidate.claim) {
      throw new Error(`${scenario.scenarioId}: validity candidate lacks claim.`);
    }
    const evaluation = evaluateStatements(
      scenario,
      candidate.statements,
      candidate.semanticKey,
      candidate.claim,
    );
    if (!evaluation) {
      throw new Error(`${scenario.scenarioId}: validity option graph is invalid.`);
    }
    const isCorrect = scenario.query.desiredStatus === evaluation.statementValidity;
    return {
      text: `${expressionText(candidate.statements)} — ${candidate.claim.subjectId} is the ${candidate.claim.relationId.toLocaleLowerCase("en-IN").replaceAll("_", " ")} of ${candidate.claim.referenceId}`,
      semanticKey: candidate.semanticKey,
      isCorrect,
      failureCode: isCorrect
        ? undefined
        : scenario.query.desiredStatus === "INVALID"
          ? ("VALID_STATEMENT_NOT_REQUESTED" as const)
          : ("INVALID_INTERPRETATION_SELECTED" as const),
      graphValidity: "VALID" as const,
      statementValidity: evaluation.statementValidity,
      decodedAssertions: evaluation.decodedStatements,
      actualRelation: evaluation.actualRelation,
      statements: candidate.statements,
      claim: candidate.claim,
      completionValue: { kind: "VALIDITY" as const },
    };
  });
  if (options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`${scenario.scenarioId}: validity task must have one answer.`);
  }
  return options;
}

export function buildBlrCp007V2Options(
  scenario: BlrCp007Scenario,
): BlrCp007V2Option[] {
  const raw =
    scenario.query.kind === "SELECT_EXPRESSION"
      ? selectExpressionOptions(scenario)
      : scenario.query.kind === "MISSING_TOKEN"
        ? missingTokenOptions(scenario)
        : scenario.query.kind === "MISSING_TOKEN_PAIR"
          ? missingPairOptions(scenario)
          : scenario.query.kind === "MISSING_PERSON"
            ? missingPersonOptions(scenario)
            : validityOptions(scenario);
  if (raw.length !== 4 || raw.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`${scenario.scenarioId}: invalid V2 option contract.`);
  }
  return raw;
}

export function orderBlrCp007V2Options(
  prototypeId: BlrCp007PrototypeId,
  seed: number,
  raw: readonly BlrCp007V2Option[],
): readonly BlrCp007V2Option[] {
  const correct = raw.find((option) => option.isCorrect)!;
  const wrongs = shuffled(
    raw.filter((option) => !option.isCorrect),
    `${prototypeId}|${seed}|wrong-option-order-v2`,
  );
  const pattern = BLR_CP007_V2_ANSWER_POSITION_PATTERNS.get(prototypeId);
  if (!pattern) throw new Error(`Missing answer-position pattern for ${prototypeId}.`);
  const correctIndex = pattern[positiveModulo(seed, pattern.length)]!;
  const output = [...wrongs];
  output.splice(correctIndex, 0, correct);
  return output;
}
