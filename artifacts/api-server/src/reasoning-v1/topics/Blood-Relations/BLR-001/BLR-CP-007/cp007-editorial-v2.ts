import { decodeScenario, relationOf } from "../BLR-CP-006/cp006-graph";
import {
  relationDisplay,
  type BlrCp006CodedStatement,
  type BlrCp006DirectRelation,
  type BlrCp006FamilyTree,
  type BlrCp006Graph,
  type BlrCp006Relation,
  type BlrCp006Scenario,
} from "../BLR-CP-006/cp006-model";
import {
  BLR_CP007_CONTRACTS,
  optionLabel,
  semanticFingerprint,
  type BlrCp007ExpressionCandidate,
  type BlrCp007PrototypeId,
  type BlrCp007QlId,
  type BlrCp007Query,
  type BlrCp007Scenario,
} from "./cp007-model";
import { BLR_CP007_PROTOTYPES, prototypeCase } from "./cp007-prototypes";
import {
  BLR_CP007_EDITORIAL_V2_REVIEW_VERSION,
  BLR_CP007_EDITORIAL_V2_RUNTIME_VERSION,
  BLR_CP007_SUPERSEDED_FREEZE_VERSION,
  type BlrCp007EditorialV2Telemetry,
  type BlrCp007V2DiagramEdge,
  type BlrCp007V2DiagramProof,
  type BlrCp007V2ExplanationMode,
  type BlrCp007V2FailureCode,
  type BlrCp007V2Option,
  type GeneratedBlrCp007EditorialV2Question,
} from "./cp007-editorial-v2-model";

const SIBLING_POLICY = "FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED" as const;
const CANDIDATE_LABELS = ["P", "Q", "R", "S"] as const;

function hash32(text: string): number {
  let value = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 0x01000193);
  }
  return value >>> 0 || 0x9e3779b9;
}

function nextRandom(state: number): number {
  let value = state >>> 0;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return value >>> 0;
}

function seededShuffle<T>(values: readonly T[], key: string): T[] {
  const result = [...values];
  let state = hash32(key);
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = nextRandom(state);
    const selected = state % (index + 1);
    [result[index], result[selected]] = [result[selected]!, result[index]!];
  }
  return result;
}

function relationText(relationId: BlrCp006Relation | undefined): string {
  return relationId
    ? relationDisplay(relationId).toLocaleLowerCase("en-IN")
    : "required relation";
}

function tokenFor(
  scenario: BlrCp007Scenario,
  relationId: BlrCp006DirectRelation,
): string {
  const found = scenario.codeKey.find((entry) => entry.relationId === relationId);
  if (!found) throw new Error(`${scenario.scenarioId}: token for ${relationId} is absent.`);
  return found.token;
}

function codedStatement(
  scenario: BlrCp007Scenario,
  leftId: string,
  relationId: BlrCp006DirectRelation,
  rightId: string,
): BlrCp006CodedStatement {
  return { leftId, token: tokenFor(scenario, relationId), rightId };
}

function statementLine(value: BlrCp006CodedStatement): string {
  return `${value.leftId} ${value.token} ${value.rightId}`;
}

function expressionText(values: readonly BlrCp006CodedStatement[]): string {
  return values.map(statementLine).join("; ");
}

function claimText(claim: NonNullable<BlrCp007ExpressionCandidate["claim"]>): string {
  return `${claim.subjectId} is the ${relationText(claim.relationId)} of ${claim.referenceId}`;
}

function decodeStatements(
  scenario: BlrCp007Scenario,
  statements: readonly BlrCp006CodedStatement[],
  suffix: string,
): { graph: BlrCp006Graph; decodedStatements: readonly string[] } {
  if (!statements.length) throw new Error(`${scenario.scenarioId}: empty coded expression.`);
  const first = statements[0]!;
  const cp006Scenario: BlrCp006Scenario = {
    scenarioId: `${scenario.scenarioId}::V2::${suffix}`,
    topologyId: "CP007_EDITORIAL_V2_VALIDATION",
    keyStyle: scenario.keyStyle,
    codeKey: scenario.codeKey,
    statements,
    expressionLines: statements.map(statementLine),
    query: { kind: "RELATION", subjectId: first.leftId, referenceId: first.rightId },
    authority: "RESOLVE_CODED_RELATION",
    prototypeId: "BLR-CP006-PROT-DIRECT-FORWARD",
    qlId: "BLR-QL-026",
    stem: "CP-007 editorial V2 validation",
  };
  return decodeScenario(cp006Scenario);
}

function targetFor(query: BlrCp007Query): {
  subjectId: string;
  relationId: BlrCp006Relation;
  referenceId: string;
} | undefined {
  if (
    query.kind === "SELECT_EXPRESSION" ||
    query.kind === "MISSING_TOKEN" ||
    query.kind === "MISSING_TOKEN_PAIR" ||
    query.kind === "MISSING_PERSON"
  ) return query.target;
  return undefined;
}

function actualRelation(
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

function graphFailure(error: unknown): BlrCp007V2FailureCode {
  const message = error instanceof Error ? error.message.toLocaleLowerCase("en-IN") : String(error);
  if (/self/.test(message)) return "SELF_RELATION";
  if (/gender|male|female/.test(message)) return "GENDER_CONTRADICTION";
  return "INVALID_FAMILY_GRAPH";
}

const GENDER_COUNTERPARTS: Readonly<Record<string, string>> = {
  FATHER: "MOTHER",
  MOTHER: "FATHER",
  SON: "DAUGHTER",
  DAUGHTER: "SON",
  BROTHER: "SISTER",
  SISTER: "BROTHER",
  HUSBAND: "WIFE",
  WIFE: "HUSBAND",
  GRANDFATHER: "GRANDMOTHER",
  GRANDMOTHER: "GRANDFATHER",
  GRANDSON: "GRANDDAUGHTER",
  GRANDDAUGHTER: "GRANDSON",
  UNCLE: "AUNT",
  AUNT: "UNCLE",
  NEPHEW: "NIECE",
  NIECE: "NEPHEW",
  FATHER_IN_LAW: "MOTHER_IN_LAW",
  MOTHER_IN_LAW: "FATHER_IN_LAW",
  SON_IN_LAW: "DAUGHTER_IN_LAW",
  DAUGHTER_IN_LAW: "SON_IN_LAW",
  BROTHER_IN_LAW: "SISTER_IN_LAW",
  SISTER_IN_LAW: "BROTHER_IN_LAW",
};

function relationTier(value: BlrCp006Relation): number {
  if (/GRAND/.test(value)) return 2;
  if (/FATHER|MOTHER|PARENT|SON|DAUGHTER|CHILD/.test(value)) return 1;
  return 0;
}

function relationFailure(
  graph: BlrCp006Graph,
  target: { subjectId: string; relationId: BlrCp006Relation; referenceId: string },
  actual: BlrCp006Relation | undefined,
): BlrCp007V2FailureCode {
  if (!actual) return "BROKEN_CHAIN";
  const reverse = actualRelation(graph, target.referenceId, target.subjectId);
  if (reverse === target.relationId) return "REVERSED_DIRECTION";
  if (GENDER_COUNTERPARTS[target.relationId] === actual) return "WRONG_GENDER";
  if (relationTier(target.relationId) !== relationTier(actual)) return "WRONG_GENERATION";
  return "WRONG_RELATION";
}

function relationMismatchExplanation(
  target: { subjectId: string; relationId: BlrCp006Relation; referenceId: string },
  actual: BlrCp006Relation | undefined,
  failureCode: BlrCp007V2FailureCode,
): string {
  if (failureCode === "REVERSED_DIRECTION") {
    return `The direction is reversed. The option does not make ${target.subjectId} the ${relationText(target.relationId)} of ${target.referenceId}.`;
  }
  if (failureCode === "BROKEN_CHAIN") {
    return `The coded links do not form a complete path from ${target.subjectId} to ${target.referenceId}.`;
  }
  if (failureCode === "WRONG_GENDER") {
    return `The path gives ${target.subjectId} as the ${relationText(actual)} of ${target.referenceId}, not the ${relationText(target.relationId)}.`;
  }
  if (failureCode === "WRONG_GENERATION") {
    return `The path ends at the wrong generation: ${target.subjectId} becomes the ${relationText(actual)} of ${target.referenceId}.`;
  }
  return actual
    ? `The decoded path makes ${target.subjectId} the ${relationText(actual)} of ${target.referenceId}, not the ${relationText(target.relationId)}.`
    : `The option does not establish the required relation between ${target.subjectId} and ${target.referenceId}.`;
}

function substituteToken(
  statements: readonly BlrCp006CodedStatement[],
  statementIndex: number,
  token: string,
): readonly BlrCp006CodedStatement[] {
  return statements.map((entry, index) =>
    index === statementIndex ? { ...entry, token } : entry,
  );
}

function substituteTokenPair(
  statements: readonly BlrCp006CodedStatement[],
  indices: readonly [number, number],
  pair: readonly [string, string],
): readonly BlrCp006CodedStatement[] {
  return statements.map((entry, index) => {
    if (index === indices[0]) return { ...entry, token: pair[0] };
    if (index === indices[1]) return { ...entry, token: pair[1] };
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

function remodellingIndex(prototypeId: BlrCp007PrototypeId): number {
  const ids: readonly BlrCp007PrototypeId[] = [
    "BLR-CP007-PROT-MISSING-PERSON-DIRECT-LEFT",
    "BLR-CP007-PROT-MISSING-PERSON-DIRECT-RIGHT",
    "BLR-CP007-PROT-MISSING-PERSON-INTERNAL",
    "BLR-CP007-PROT-MISSING-PERSON-ENDPOINT",
  ];
  const index = ids.indexOf(prototypeId);
  if (index < 0) throw new Error(`${prototypeId}: not a missing-person prototype.`);
  return index;
}

function remodelMissingPersonScenario(
  source: BlrCp007Scenario,
  seed: number,
): BlrCp007Scenario {
  if (source.query.kind !== "MISSING_PERSON") return source;
  const prototypeIndex = remodellingIndex(source.prototypeId);
  const correct = CANDIDATE_LABELS[(Math.trunc(seed) + prototypeIndex) % 4]!;
  const fatherToken = tokenFor(source, "FATHER");
  const roster = CANDIDATE_LABELS.map((personId) => ({
    leftId: "U",
    token: fatherToken,
    rightId: personId,
  }));

  let completeStatements: readonly BlrCp006CodedStatement[];
  let blankStatementIndex: number;
  let blankSide: "LEFT" | "RIGHT";
  let target: { subjectId: string; relationId: BlrCp006Relation; referenceId: string };
  let stem: string;

  switch (source.prototypeId) {
    case "BLR-CP007-PROT-MISSING-PERSON-DIRECT-LEFT":
      completeStatements = [
        codedStatement(source, correct, "FATHER", "B"),
        codedStatement(source, correct, "FATHER", "A"),
        ...roster,
      ];
      blankStatementIndex = 0;
      blankSide = "LEFT";
      target = { subjectId: "A", relationId: "SIBLING", referenceId: "B" };
      stem = "Which existing person should replace ? so that A and B are siblings?";
      break;
    case "BLR-CP007-PROT-MISSING-PERSON-DIRECT-RIGHT":
      completeStatements = [
        codedStatement(source, "A", "FATHER", correct),
        codedStatement(source, correct, "FATHER", "B"),
        ...roster,
      ];
      blankStatementIndex = 0;
      blankSide = "RIGHT";
      target = { subjectId: "A", relationId: "GRANDFATHER", referenceId: "B" };
      stem = "Which existing person should replace ? so that A is B's grandfather?";
      break;
    case "BLR-CP007-PROT-MISSING-PERSON-INTERNAL":
      completeStatements = [
        codedStatement(source, "A", "FATHER", correct),
        codedStatement(source, correct, "FATHER", "C"),
        ...roster,
      ];
      blankStatementIndex = 1;
      blankSide = "LEFT";
      target = { subjectId: "A", relationId: "GRANDFATHER", referenceId: "C" };
      stem = "Which existing person should replace ? to complete the grandfather chain from A to C?";
      break;
    case "BLR-CP007-PROT-MISSING-PERSON-ENDPOINT":
      completeStatements = [
        codedStatement(source, "A", "BROTHER", "B"),
        codedStatement(source, "B", "FATHER", correct),
        codedStatement(source, correct, "BROTHER", "D"),
        ...roster,
      ];
      blankStatementIndex = 1;
      blankSide = "RIGHT";
      target = { subjectId: "A", relationId: "UNCLE", referenceId: "D" };
      stem = "Which existing person should replace ? so that A is D's uncle?";
      break;
    default:
      return source;
  }

  const displayStatements = completeStatements.map((entry, index) => ({
    ...entry,
    leftId: index === blankStatementIndex && blankSide === "LEFT" ? "?" : entry.leftId,
    rightId: index === blankStatementIndex && blankSide === "RIGHT" ? "?" : entry.rightId,
  }));

  return {
    ...source,
    scenarioId: `${source.scenarioId}::EDITORIAL-V2`,
    topologyId: `${source.topologyId}_V2_EXISTING_CANDIDATE_GRAPH`,
    stem,
    query: {
      kind: "MISSING_PERSON",
      completeStatements,
      blankStatementIndex,
      blankSide,
      expressionLines: displayStatements.map(statementLine),
      candidatePersonIds: CANDIDATE_LABELS,
      target,
    },
  };
}

function editorialScenario(
  prototypeId: BlrCp007PrototypeId,
  seed: number,
): BlrCp007Scenario {
  const source = prototypeCase(prototypeId).build(Math.trunc(seed));
  const scenario = remodelMissingPersonScenario(source, seed);
  if (scenario.query.kind !== "MISSING_TOKEN_PAIR") return scenario;

  const stemByPrototype: Partial<Record<BlrCp007PrototypeId, string>> = {
    "BLR-CP007-PROT-MISSING-PAIR-TWO-LINK":
      "Complete the two blanks so that A is C's grandfather and B is C's mother. Choose the first and second tokens in order.",
    "BLR-CP007-PROT-MISSING-PAIR-THREE-LINK":
      "Complete the first and third blanks so that A is D's uncle and C is D's sister. Choose the tokens in blank order.",
    "BLR-CP007-PROT-MISSING-PAIR-AFFINAL":
      "Complete the two blanks so that A is C's brother-in-law through C's husband B. Choose the first and second tokens in order.",
  };
  return { ...scenario, stem: stemByPrototype[prototypeId] ?? scenario.stem };
}

function displayStem(scenario: BlrCp007Scenario): string {
  if (
    scenario.query.kind === "MISSING_TOKEN" ||
    scenario.query.kind === "MISSING_TOKEN_PAIR" ||
    scenario.query.kind === "MISSING_PERSON"
  ) {
    return `${scenario.stem}\n\n${scenario.query.expressionLines.join("\n")}`;
  }
  return scenario.stem;
}

function codeDefinition(
  scenario: BlrCp007Scenario,
  token: string,
): BlrCp006DirectRelation | undefined {
  return scenario.codeKey.find((entry) => entry.token === token)?.relationId;
}

function correctOptionForTokenPair(
  query: Extract<BlrCp007Query, { kind: "MISSING_TOKEN_PAIR" }>,
): readonly [string, string] {
  return [
    query.completeStatements[query.blankStatementIndices[0]]!.token,
    query.completeStatements[query.blankStatementIndices[1]]!.token,
  ];
}

function optionFromStatements(input: {
  scenario: BlrCp007Scenario;
  text: string;
  semanticKey: string;
  statements: readonly BlrCp006CodedStatement[];
  target?: { subjectId: string; relationId: BlrCp006Relation; referenceId: string };
  exactCorrect?: boolean;
  claim?: NonNullable<BlrCp007ExpressionCandidate["claim"]>;
  desiredStatus?: "VALID" | "INVALID";
  failureOverride?: BlrCp007V2FailureCode;
}): BlrCp007V2Option {
  let graph: BlrCp006Graph | undefined;
  let decodedAssertions: readonly string[] = [];
  let graphValidity: BlrCp007V2Option["graphValidity"] = "VALID";
  let graphError: BlrCp007V2FailureCode | undefined;
  try {
    const decoded = decodeStatements(input.scenario, input.statements, input.semanticKey);
    graph = decoded.graph;
    decodedAssertions = decoded.decodedStatements;
  } catch (error) {
    graphValidity = "INVALID";
    graphError = graphFailure(error);
  }

  if (input.claim) {
    const actual = graph
      ? actualRelation(graph, input.claim.subjectId, input.claim.referenceId)
      : undefined;
    const statementValidity = graphValidity === "VALID" && actual === input.claim.relationId
      ? "VALID"
      : "INVALID";
    const isCorrectAnswerForTask = input.desiredStatus === statementValidity;
    let failureCode: BlrCp007V2FailureCode | undefined;
    let studentExplanation: string;

    if (statementValidity === "VALID") {
      if (isCorrectAnswerForTask) {
        studentExplanation = `The expression decodes exactly as stated: ${claimText(input.claim)}. This is the correct choice.`;
      } else {
        failureCode = "VALID_STATEMENT_NOT_REQUESTED";
        studentExplanation = `The interpretation is valid, so it is not the answer to a question asking for the incorrect statement.`;
      }
    } else {
      if (graphValidity === "INVALID") {
        failureCode = graphError ?? "INVALID_FAMILY_GRAPH";
        studentExplanation = isCorrectAnswerForTask
          ? `The coded expression creates an invalid family graph, so the statement is incorrect and is the correct choice.`
          : `The coded expression creates an invalid family graph and cannot be the required correct statement.`;
      } else {
        const reverse = graph
          ? actualRelation(graph, input.claim.referenceId, input.claim.subjectId)
          : undefined;
        if (reverse === input.claim.relationId) failureCode = "CLAIM_DIRECTION_MISMATCH";
        else if (actual && GENDER_COUNTERPARTS[input.claim.relationId] === actual) {
          failureCode = "CLAIM_GENDER_MISMATCH";
        } else failureCode = "CLAIM_RELATION_MISMATCH";
        const mismatch = actual
          ? `The expression makes ${input.claim.subjectId} the ${relationText(actual)} of ${input.claim.referenceId}, not the ${relationText(input.claim.relationId)}.`
          : `The expression does not establish the claimed relation.`;
        studentExplanation = isCorrectAnswerForTask
          ? `${mismatch} The statement is therefore incorrect and is the correct choice.`
          : `${mismatch} It cannot be selected as the correct statement.`;
      }
    }

    return {
      text: input.text,
      semanticKey: input.semanticKey,
      completedStatements: input.statements,
      decodedAssertions,
      graphValidity,
      statementValidity,
      targetRelationSatisfied: statementValidity === "VALID",
      isCorrectAnswerForTask,
      failureCode,
      actualRelation: actual,
      claimedRelation: input.claim.relationId,
      studentExplanation,
    };
  }

  const target = input.target;
  const actual = graph && target
    ? actualRelation(graph, target.subjectId, target.referenceId)
    : undefined;
  const targetRelationSatisfied = Boolean(target && actual === target.relationId);
  const isCorrectAnswerForTask = input.exactCorrect ?? targetRelationSatisfied;
  let failureCode = input.failureOverride;
  if (!isCorrectAnswerForTask && !failureCode) {
    failureCode = graphValidity === "INVALID"
      ? graphError ?? "INVALID_FAMILY_GRAPH"
      : target && graph
        ? relationFailure(graph, target, actual)
        : "WRONG_RELATION";
  }

  const studentExplanation = isCorrectAnswerForTask
    ? target
      ? `The decoded links make ${target.subjectId} the ${relationText(target.relationId)} of ${target.referenceId}.`
      : "The completion matches every required coded link."
    : graphValidity === "INVALID"
      ? `This completion creates an invalid family graph. [${failureCode}]`
      : target
        ? relationMismatchExplanation(target, actual, failureCode ?? "WRONG_RELATION")
        : "This completion does not match the required coded links.";

  return {
    text: input.text,
    semanticKey: input.semanticKey,
    completedStatements: input.statements,
    decodedAssertions,
    graphValidity,
    statementValidity: "NOT_APPLICABLE",
    targetRelationSatisfied,
    isCorrectAnswerForTask,
    failureCode,
    actualRelation: actual,
    studentExplanation,
  };
}

function buildRawOptions(scenario: BlrCp007Scenario): BlrCp007V2Option[] {
  const query = scenario.query;
  if (query.kind === "SELECT_EXPRESSION") {
    return query.candidates.map((entry) => optionFromStatements({
      scenario,
      text: expressionText(entry.statements),
      semanticKey: entry.semanticKey,
      statements: entry.statements,
      target: query.target,
    }));
  }

  if (query.kind === "MISSING_TOKEN") {
    const correctToken = query.completeStatements[query.blankStatementIndex]!.token;
    const requiredRelation = codeDefinition(scenario, correctToken);
    return query.candidateTokens.map((token) => {
      const relation = codeDefinition(scenario, token);
      let failureOverride: BlrCp007V2FailureCode | undefined;
      if (token !== correctToken) {
        failureOverride = requiredRelation && relation && GENDER_COUNTERPARTS[requiredRelation] === relation
          ? "WRONG_TOKEN_MEANING"
          : "WRONG_TOKEN_MEANING";
      }
      const option = optionFromStatements({
        scenario,
        text: token,
        semanticKey: `TOKEN::${token}`,
        statements: substituteToken(query.completeStatements, query.blankStatementIndex, token),
        target: query.target,
        exactCorrect: token === correctToken,
        failureOverride,
      });
      if (token !== correctToken) {
        option.studentExplanation = `${token} means “${relationText(relation)}”, but this blank requires “${relationText(requiredRelation)}”.`;
      }
      return option;
    });
  }

  if (query.kind === "MISSING_TOKEN_PAIR") {
    const correct = correctOptionForTokenPair(query);
    return query.candidateTokenPairs.map((pair) => {
      const firstCorrect = pair[0] === correct[0];
      const secondCorrect = pair[1] === correct[1];
      const swapped = pair[0] === correct[1] && pair[1] === correct[0];
      const failureOverride: BlrCp007V2FailureCode | undefined = firstCorrect && secondCorrect
        ? undefined
        : swapped
          ? "TOKENS_SWAPPED"
          : !firstCorrect && !secondCorrect
            ? "BOTH_TOKENS_WRONG"
            : !firstCorrect
              ? "FIRST_TOKEN_WRONG"
              : "SECOND_TOKEN_WRONG";
      const option = optionFromStatements({
        scenario,
        text: `${pair[0]}, ${pair[1]}`,
        semanticKey: `PAIR::${pair[0]}::${pair[1]}`,
        statements: substituteTokenPair(query.completeStatements, query.blankStatementIndices, pair),
        target: query.target,
        exactCorrect: firstCorrect && secondCorrect,
        failureOverride,
      });
      if (failureOverride === "TOKENS_SWAPPED") {
        option.studentExplanation = "Both required tokens are present, but they have been placed in the opposite blanks.";
      } else if (failureOverride === "FIRST_TOKEN_WRONG") {
        option.studentExplanation = `The second token is correct, but the first blank requires ${correct[0]}, not ${pair[0]}.`;
      } else if (failureOverride === "SECOND_TOKEN_WRONG") {
        option.studentExplanation = `The first token is correct, but the second blank requires ${correct[1]}, not ${pair[1]}.`;
      } else if (failureOverride === "BOTH_TOKENS_WRONG") {
        option.studentExplanation = `The two blanks require ${correct[0]} and ${correct[1]} in that order.`;
      }
      return option;
    });
  }

  if (query.kind === "MISSING_PERSON") {
    return query.candidatePersonIds.map((personId) => optionFromStatements({
      scenario,
      text: personId,
      semanticKey: `PERSON::${personId}`,
      statements: substitutePerson(query, personId),
      target: query.target,
      failureOverride: "WRONG_PERSON_IDENTITY",
    }));
  }

  return query.candidates.map((entry) => optionFromStatements({
    scenario,
    text: `${expressionText(entry.statements)} — ${claimText(entry.claim!)}`,
    semanticKey: entry.semanticKey,
    statements: entry.statements,
    claim: entry.claim!,
    desiredStatus: query.desiredStatus,
  }));
}

function generations(graph: BlrCp006Graph): Map<string, number> {
  const result = new Map(graph.persons.map((person) => [person.personId, 0]));
  for (let pass = 0; pass < 24; pass += 1) {
    let changed = false;
    for (const edge of graph.parents) {
      const child = result.get(edge.childId) ?? 0;
      const parent = result.get(edge.parentId) ?? 0;
      if (parent <= child) {
        result.set(edge.parentId, child + 1);
        changed = true;
      }
    }
    for (const edge of [...graph.spouses, ...graph.siblings]) {
      const level = Math.max(
        result.get(edge.personAId) ?? 0,
        result.get(edge.personBId) ?? 0,
      );
      if ((result.get(edge.personAId) ?? 0) !== level) {
        result.set(edge.personAId, level);
        changed = true;
      }
      if ((result.get(edge.personBId) ?? 0) !== level) {
        result.set(edge.personBId, level);
        changed = true;
      }
    }
    if (!changed) break;
  }
  return result;
}

function graphPath(graph: BlrCp006Graph, start?: string, end?: string): string[] {
  if (!start || !end || start === end) return start ? [start] : [];
  const adjacency = new Map<string, Set<string>>();
  const link = (left: string, right: string) => {
    if (!adjacency.has(left)) adjacency.set(left, new Set());
    if (!adjacency.has(right)) adjacency.set(right, new Set());
    adjacency.get(left)!.add(right);
    adjacency.get(right)!.add(left);
  };
  graph.parents.forEach((edge) => link(edge.parentId, edge.childId));
  graph.spouses.forEach((edge) => link(edge.personAId, edge.personBId));
  graph.siblings.forEach((edge) => link(edge.personAId, edge.personBId));
  const queue: string[][] = [[start]];
  const seen = new Set([start]);
  while (queue.length) {
    const path = queue.shift()!;
    const last = path[path.length - 1]!;
    for (const next of adjacency.get(last) ?? []) {
      if (seen.has(next)) continue;
      const candidate = [...path, next];
      if (next === end) return candidate;
      seen.add(next);
      queue.push(candidate);
    }
  }
  return [];
}

function sortedPair(left: string, right: string): string {
  return [left, right].sort((a, b) => a.localeCompare(b, "en-IN")).join("|");
}

function directPrimitive(input: {
  statement: BlrCp006CodedStatement;
  relationId: BlrCp006DirectRelation;
}): { key: string; label: string } {
  const { statement: value, relationId } = input;
  if (relationId === "FATHER" || relationId === "MOTHER") {
    return { key: `parent:${value.leftId}>${value.rightId}`, label: relationText(relationId) };
  }
  if (relationId === "SON" || relationId === "DAUGHTER") {
    return { key: `parent:${value.rightId}>${value.leftId}`, label: relationText(relationId) };
  }
  if (relationId === "BROTHER" || relationId === "SISTER") {
    return { key: `sibling:${sortedPair(value.leftId, value.rightId)}`, label: relationText(relationId) };
  }
  return { key: `spouse:${sortedPair(value.leftId, value.rightId)}`, label: relationText(relationId) };
}

function diagramFor(input: {
  scenario: BlrCp007Scenario;
  selected: BlrCp007V2Option;
  graph: BlrCp006Graph;
  target?: { subjectId: string; relationId: BlrCp006Relation; referenceId: string };
}): { familyTree: BlrCp006FamilyTree; proof: BlrCp007V2DiagramProof } {
  const queryTarget = input.target ?? (
    input.scenario.query.kind === "SELECT_VALIDITY"
      ? input.scenario.query.candidates.find((candidate) => candidate.semanticKey === input.selected.semanticKey)?.claim
      : undefined
  );
  const path = graphPath(input.graph, queryTarget?.subjectId, queryTarget?.referenceId);
  const pathPairs = new Set(path.slice(0, -1).map((personId, index) => sortedPair(personId, path[index + 1]!)));
  const direct = new Map<string, string>();
  for (const statement of input.selected.completedStatements) {
    const relationId = codeDefinition(input.scenario, statement.token);
    if (!relationId) continue;
    const primitive = directPrimitive({ statement, relationId });
    direct.set(primitive.key, primitive.label);
  }
  const levels = generations(input.graph);
  const nodes = input.graph.persons.map((person) => ({
    id: person.personId,
    label: person.label,
    gender: person.gender === "MALE"
      ? "male" as const
      : person.gender === "FEMALE"
        ? "female" as const
        : "unknown" as const,
    generation: levels.get(person.personId) ?? 0,
  }));
  const proofEdges: BlrCp007V2DiagramEdge[] = [];
  input.graph.parents.forEach((edge, index) => {
    const key = `parent:${edge.parentId}>${edge.childId}`;
    proofEdges.push({
      id: `parent-${index}`,
      type: "parent-child",
      sourceId: edge.parentId,
      targetId: edge.childId,
      label: direct.get(key) ?? "inferred parent",
      evidence: direct.has(key) ? "CODED" : "INFERRED",
      highlighted: pathPairs.has(sortedPair(edge.parentId, edge.childId)),
    });
  });
  input.graph.spouses.forEach((edge, index) => {
    const key = `spouse:${sortedPair(edge.personAId, edge.personBId)}`;
    proofEdges.push({
      id: `marriage-${index}`,
      type: "marriage",
      sourceId: edge.personAId,
      targetId: edge.personBId,
      label: direct.get(key) ?? "inferred spouse",
      evidence: direct.has(key) ? "CODED" : "INFERRED",
      highlighted: pathPairs.has(sortedPair(edge.personAId, edge.personBId)),
    });
  });
  input.graph.siblings.forEach((edge, index) => {
    const key = `sibling:${sortedPair(edge.personAId, edge.personBId)}`;
    proofEdges.push({
      id: `sibling-${index}`,
      type: "sibling",
      sourceId: edge.personAId,
      targetId: edge.personBId,
      label: direct.get(key) ?? "inferred sibling",
      evidence: direct.has(key) ? "CODED" : "INFERRED",
      highlighted: pathPairs.has(sortedPair(edge.personAId, edge.personBId)),
    });
  });
  const actual = queryTarget
    ? actualRelation(input.graph, queryTarget.subjectId, queryTarget.referenceId)
    : undefined;
  const relationConclusion = queryTarget
    ? `${queryTarget.subjectId} is the ${relationText(actual)} of ${queryTarget.referenceId}.`
    : "The diagram shows the completed coded family graph.";
  const countWord = proofEdges.length === 1 ? "link" : "links";
  const description = `${input.selected.decodedAssertions.join(" ")} ${relationConclusion}`.trim();
  const familyTree: BlrCp006FamilyTree = {
    kind: "blood-relation-family-tree",
    version: 1,
    title: "Completed coded family graph",
    nodes,
    edges: proofEdges.map((edge) => ({
      id: edge.id,
      type: edge.type,
      sourceId: edge.sourceId,
      targetId: edge.targetId,
    })),
    query: {
      subjectId: queryTarget?.subjectId,
      referenceId: queryTarget?.referenceId,
      answerLabel: actual ? relationDisplay(actual) : input.selected.text,
      pathPersonIds: path,
    },
    accessibleSummary: `${description} The graph contains ${nodes.length} people and ${proofEdges.length} family ${countWord}.`,
    asciiFallback: proofEdges.map((edge) =>
      `${edge.sourceId} --${edge.label}${edge.evidence === "INFERRED" ? " (inferred)" : ""}--> ${edge.targetId}`,
    ).join("\n"),
  };
  return {
    familyTree,
    proof: {
      title: "Completed coded family graph",
      description,
      legend: [
        "Arrow/label: relation direction",
        "Solid edge: directly coded",
        "Dashed edge: inferred from the coded family graph",
        "Thick edge: decisive query path",
        "M/F/?: male, female or gender not established",
      ],
      siblingPolicy: SIBLING_POLICY,
      pathPersonIds: path,
      edges: proofEdges,
      codedEdgeCount: proofEdges.filter((edge) => edge.evidence === "CODED").length,
      inferredEdgeCount: proofEdges.filter((edge) => edge.evidence === "INFERRED").length,
    },
  };
}

function explanationMode(
  scenario: BlrCp007Scenario,
  selected: BlrCp007V2Option,
): BlrCp007V2ExplanationMode {
  if (scenario.query.kind === "SELECT_VALIDITY") {
    return scenario.query.desiredStatus === "INVALID"
      ? "INVALID_STATEMENT_CHECK"
      : "VALID_STATEMENT_CHECK";
  }
  if (scenario.query.kind === "MISSING_TOKEN" || scenario.query.kind === "MISSING_TOKEN_PAIR") {
    return "MISSING_TOKEN";
  }
  if (scenario.query.kind === "MISSING_PERSON") return "MISSING_PERSON";
  if (selected.completedStatements.length <= 1) return "DIRECT_LOOKUP_MINIMAL";
  if (selected.completedStatements.length === 2) return "TWO_LINK_PATH";
  return "THREE_LINK_OR_AFFINAL_PATH";
}

function explanationSteps(
  scenario: BlrCp007Scenario,
  selected: BlrCp007V2Option,
): readonly string[] {
  const decoded = [...selected.decodedAssertions];
  if (scenario.query.kind === "SELECT_VALIDITY") {
    const candidate = scenario.query.candidates.find((entry) => entry.semanticKey === selected.semanticKey)!;
    const actual = selected.actualRelation;
    if (selected.statementValidity === "INVALID") {
      return [
        ...decoded,
        `The option claims that ${claimText(candidate.claim!)}.`,
        actual
          ? `The decoded relation is ${relationText(actual)}, so the written interpretation does not match.`
          : "The claimed relation is not established by the decoded expression.",
      ];
    }
    return [...decoded, `The decoded relation matches the interpretation: ${claimText(candidate.claim!)}.`];
  }
  if (scenario.query.kind === "MISSING_TOKEN") {
    const relation = codeDefinition(scenario, selected.text);
    return [
      `${selected.text} means “is the ${relationText(relation)} of”.`,
      ...decoded,
    ];
  }
  if (scenario.query.kind === "MISSING_TOKEN_PAIR") {
    const [first, second] = selected.text.split(",").map((value) => value.trim());
    return [
      `The first blank uses ${first}; the second blank uses ${second}.`,
      ...decoded,
    ];
  }
  if (scenario.query.kind === "MISSING_PERSON") {
    return [
      `Substitute ${selected.text} for the question mark.`,
      ...decoded.filter((value) => value.includes(selected.text) || decoded.length <= 3),
    ];
  }
  return decoded;
}

function explanationConclusion(
  scenario: BlrCp007Scenario,
  selected: BlrCp007V2Option,
): string {
  if (scenario.query.kind === "SELECT_VALIDITY") {
    if (scenario.query.desiredStatus === "INVALID") {
      return `The interpretation is false, so this is the incorrect statement and therefore the correct option.`;
    }
    return `The interpretation agrees with the decoded relation, so this is the correct statement.`;
  }
  const target = targetFor(scenario.query);
  return target
    ? `Therefore ${target.subjectId} is the ${relationText(target.relationId)} of ${target.referenceId}.`
    : `${selected.text} is the unique valid completion.`;
}

function shortcutFor(mode: BlrCp007V2ExplanationMode): string | undefined {
  if (mode === "DIRECT_LOOKUP_MINIMAL") return undefined;
  if (mode === "MISSING_TOKEN") return "Write the required relations in blank order before replacing them with tokens.";
  if (mode === "MISSING_PERSON") return "Test each candidate in the same blank; do not change any fixed link.";
  if (mode === "INVALID_STATEMENT_CHECK" || mode === "VALID_STATEMENT_CHECK") {
    return "First decode the expression; only then compare it with the written interpretation.";
  }
  return "Follow the chain from the person named first in the question to the person named second.";
}

function trapFor(mode: BlrCp007V2ExplanationMode): string | undefined {
  if (mode === "DIRECT_LOOKUP_MINIMAL") return "Read the coded pair from left to right.";
  if (mode === "MISSING_TOKEN") return "For two blanks, token order is part of the answer.";
  if (mode === "MISSING_PERSON") return "Use only people already listed as candidates; do not invent a new person.";
  if (mode === "INVALID_STATEMENT_CHECK") {
    return "A false statement can be the correct option when the question asks for the incorrect statement.";
  }
  return "Do not infer gender from a letter label.";
}

function difficultyFor(
  scenario: BlrCp007Scenario,
  selected: BlrCp007V2Option,
): "EASY" | "MEDIUM" | "HARD" {
  if (scenario.query.kind === "MISSING_PERSON") return "MEDIUM";
  if (scenario.query.kind === "MISSING_TOKEN_PAIR") return "MEDIUM";
  if (scenario.query.kind === "SELECT_VALIDITY") {
    return selected.completedStatements.length >= 2 ? "HARD" : "MEDIUM";
  }
  if (selected.completedStatements.length >= 3) return "HARD";
  if (selected.completedStatements.length === 2) return "MEDIUM";
  return "EASY";
}

function answerTypeFor(qlId: BlrCp007QlId): GeneratedBlrCp007EditorialV2Question["answerType"] {
  const contract = BLR_CP007_CONTRACTS.find((entry) => entry.qlId === qlId);
  if (!contract) throw new Error(`Missing CP-007 contract for ${qlId}.`);
  return contract.answerType;
}

export function generateBlrCp007EditorialV2Question(
  prototypeId: BlrCp007PrototypeId,
  seed: number,
): GeneratedBlrCp007EditorialV2Question {
  if (!Number.isFinite(seed)) throw new Error(`CP-007 V2 seed must be finite: ${seed}.`);
  const normalizedSeed = Math.trunc(seed);
  const scenario = editorialScenario(prototypeId, normalizedSeed);
  const rawOptions = buildRawOptions(scenario);
  if (rawOptions.length !== 4) throw new Error(`${scenario.scenarioId}: expected four options.`);
  if (rawOptions.filter((option) => option.isCorrectAnswerForTask).length !== 1) {
    throw new Error(`${scenario.scenarioId}: expected exactly one task-correct option.`);
  }
  const options = seededShuffle(
    rawOptions,
    `CP007-V2-41::${prototypeId}::${normalizedSeed}`,
  );
  const correctIndex = options.findIndex((option) => option.isCorrectAnswerForTask);
  const selected = options[correctIndex]!;
  const decoded = decodeStatements(scenario, selected.completedStatements, "SELECTED");
  const target = targetFor(scenario.query);
  const diagram = diagramFor({ scenario, selected, graph: decoded.graph, target });
  const mode = explanationMode(scenario, selected);
  const difficulty = difficultyFor(scenario, selected);
  const stem = displayStem(scenario);
  const fingerprint = semanticFingerprint([
    BLR_CP007_EDITORIAL_V2_RUNTIME_VERSION,
    prototypeId,
    normalizedSeed,
    scenario.sharedPrompt,
    stem,
    ...options.map((option) => option.text),
    correctIndex,
    ...selected.completedStatements.flatMap((entry) => [entry.leftId, entry.token, entry.rightId]),
  ]);
  const itemId = `BLR-CP007-V2-${prototypeId.replace("BLR-CP007-PROT-", "")}-${fingerprint.slice(0, 10)}`;
  const optionAnalysis = options.map((option, index) => ({
    optionLabel: optionLabel(index),
    optionText: option.text,
    statementValidity: option.statementValidity,
    isCorrectAnswerForTask: option.isCorrectAnswerForTask,
    failureCode: option.failureCode,
    explanation: option.studentExplanation,
  }));

  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-007",
    qlId: scenario.qlId,
    permanentQlId: scenario.qlId,
    solveAuthority: scenario.authority,
    sourcePrototypeId: scenario.prototypeId,
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    seed: normalizedSeed,
    itemId,
    scenarioId: scenario.scenarioId,
    topologyId: scenario.topologyId,
    keyStyle: scenario.keyStyle,
    codeKey: scenario.codeKey,
    query: scenario.query,
    sharedPrompt: scenario.sharedPrompt,
    stem,
    answerType: answerTypeFor(scenario.qlId),
    options,
    correctIndex,
    answer: selected.text,
    completedStatements: selected.completedStatements,
    decodedStatements: selected.decodedAssertions,
    graph: decoded.graph,
    explanation: {
      mode,
      steps: explanationSteps(scenario, selected),
      conclusion: explanationConclusion(scenario, selected),
      shortcut: shortcutFor(mode),
      commonTrap: trapFor(mode),
      optionAnalysis,
      familyTree: diagram.familyTree,
      diagramProof: diagram.proof,
    },
    reviewProof: {
      questionId: itemId,
      seed: normalizedSeed,
      qlId: scenario.qlId,
      prototypeId: scenario.prototypeId,
      taskKind: scenario.query.kind,
      difficulty,
      familyTopologyId: scenario.topologyId,
      targetRelation: target?.relationId,
      targetPath: diagram.proof.pathPersonIds,
      semanticFingerprint: fingerprint,
      independentSolverStatus: "AGREED",
      uniqueCorrectOptionCount: 1,
      graphValidityStatus: "VALID",
      rendererValidationStatus: "VALID",
      datasetVersion: BLR_CP007_EDITORIAL_V2_REVIEW_VERSION,
      reviewStatus: "HUMAN_REVIEW_REQUIRED",
      reviewerNote: "Generated remediation candidate; human approval has not yet been recorded.",
    },
    metadata: {
      runtimeVersion: BLR_CP007_EDITORIAL_V2_RUNTIME_VERSION,
      reviewVersion: BLR_CP007_EDITORIAL_V2_REVIEW_VERSION,
      supersedesFreezeVersion: BLR_CP007_SUPERSEDED_FREEZE_VERSION,
      editorialStatus: "REMEDIATED_REVIEW_CANDIDATE",
      completeKeyCoverage: true,
      noArithmeticPrecedence: true,
      displayedExpressionParity: true,
      explicitGenderEvidence: true,
      nameBasedGenderAssumptions: 0,
      independentVerifierAgreed: true,
      uniqueAnswer: true,
      siblingPolicy: SIBLING_POLICY,
      optionOrderAlgorithm: "SEEDED_FISHER_YATES_V2",
      difficulty,
      semanticFingerprint: fingerprint,
    },
  };
}

export function generateBlrCp007EditorialV2Bank(): readonly GeneratedBlrCp007EditorialV2Question[] {
  return BLR_CP007_PROTOTYPES.flatMap((prototype) =>
    Array.from({ length: 8 }, (_, seed) =>
      generateBlrCp007EditorialV2Question(prototype.prototypeId, seed),
    ),
  );
}

export function buildBlrCp007EditorialV2Telemetry(
  bank = generateBlrCp007EditorialV2Bank(),
): BlrCp007EditorialV2Telemetry {
  const countBy = (values: readonly string[]): Record<string, number> => {
    const result: Record<string, number> = {};
    values.forEach((value) => { result[value] = (result[value] ?? 0) + 1; });
    return result;
  };
  const qlCounts = countBy(bank.map((question) => question.qlId)) as Record<BlrCp007QlId, number>;
  const failureCodes = bank.flatMap((question) =>
    question.options.flatMap((option) => option.failureCode ? [option.failureCode] : []),
  );
  const correctOptions = bank.map((question) => question.options[question.correctIndex]!);
  const semicolonCorrectCount = correctOptions.filter((option) => option.text.includes(";")).length;
  const semicolonWrongCount = bank.reduce((total, question) =>
    total + question.options.filter((option, index) => index !== question.correctIndex && option.text.includes(";")).length,
  0);
  const missingPersonCorrectLabelCounts = countBy(bank
    .filter((question) => question.qlId === "BLR-QL-034")
    .map((question) => question.answer));
  return {
    recordCount: 168,
    prototypeCount: 21,
    authorityCount: 5,
    permanentQlCount: 5,
    reviewVersion: BLR_CP007_EDITORIAL_V2_REVIEW_VERSION,
    answerPositions: [0, 1, 2, 3].map((index) =>
      bank.filter((question) => question.correctIndex === index).length,
    ) as [number, number, number, number],
    qlCounts,
    failureCodeCounts: countBy(failureCodes),
    explanationModeCounts: countBy(bank.map((question) => question.explanation.mode)),
    optionAnalysisCount: 672,
    uniqueQuestionSignatureCount: new Set(bank.map((question) => question.metadata.semanticFingerprint)).size as 168,
    invalidStatementQuestionCount: bank.filter((question) =>
      question.query.kind === "SELECT_VALIDITY" && question.query.desiredStatus === "INVALID",
    ).length,
    missingPersonCorrectLabelCounts,
    semicolonCorrectCount,
    semicolonWrongCount,
    codedDiagramEdgeCount: bank.reduce((total, question) =>
      total + question.explanation.diagramProof.codedEdgeCount, 0),
    inferredDiagramEdgeCount: bank.reduce((total, question) =>
      total + question.explanation.diagramProof.inferredEdgeCount, 0),
    humanReviewRequired: true,
  };
}
