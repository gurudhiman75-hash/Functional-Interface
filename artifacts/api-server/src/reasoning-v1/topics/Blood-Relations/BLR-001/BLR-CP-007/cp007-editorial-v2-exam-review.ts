import { decodeScenario, relationOf } from "../BLR-CP-006/cp006-graph";
import {
  relationDisplay,
  type BlrCp006CodedStatement,
  type BlrCp006Graph,
  type BlrCp006Relation,
  type BlrCp006Scenario,
} from "../BLR-CP-006/cp006-model";
import {
  semanticFingerprint,
  type BlrCp007PrototypeId,
  type BlrCp007Query,
} from "./cp007-model";
import {
  buildBlrCp007EditorialV2FinalReviewTelemetry,
  generateBlrCp007EditorialV2FinalReviewQuestion,
} from "./cp007-editorial-v2-final-review";
import type {
  BlrCp007EditorialV2Telemetry,
  BlrCp007V2FailureCode,
  BlrCp007V2Option,
  GeneratedBlrCp007EditorialV2Question,
} from "./cp007-editorial-v2-model";
import { BLR_CP007_PROTOTYPES } from "./cp007-prototypes";

function relationText(value: BlrCp006Relation | undefined): string {
  return value
    ? relationDisplay(value).toLocaleLowerCase("en-IN")
    : "relation not established";
}

function statementLine(value: BlrCp006CodedStatement): string {
  return `${value.leftId} ${value.token} ${value.rightId}`;
}

function expressionText(values: readonly BlrCp006CodedStatement[]): string {
  return values.map(statementLine).join("; ");
}

function decode(
  question: GeneratedBlrCp007EditorialV2Question,
  statements: readonly BlrCp006CodedStatement[],
  suffix: string,
): { graph: BlrCp006Graph; decodedStatements: readonly string[] } | undefined {
  if (!statements.length) return undefined;
  const first = statements[0]!;
  const scenario: BlrCp006Scenario = {
    scenarioId: `${question.scenarioId}::DISTRACTOR-REPAIR::${suffix}`,
    topologyId: "CP007_EDITORIAL_V2_VALID_DISTRACTOR",
    keyStyle: question.keyStyle,
    codeKey: question.codeKey,
    statements,
    expressionLines: statements.map(statementLine),
    query: { kind: "RELATION", subjectId: first.leftId, referenceId: first.rightId },
    authority: "RESOLVE_CODED_RELATION",
    prototypeId: "BLR-CP006-PROT-DIRECT-FORWARD",
    qlId: "BLR-QL-026",
    stem: "Valid distractor reconstruction",
  };
  try {
    return decodeScenario(scenario);
  } catch {
    return undefined;
  }
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

const GENDER_COUNTERPARTS: Readonly<Record<string, string>> = {
  FATHER: "MOTHER", MOTHER: "FATHER", SON: "DAUGHTER", DAUGHTER: "SON",
  BROTHER: "SISTER", SISTER: "BROTHER", HUSBAND: "WIFE", WIFE: "HUSBAND",
  GRANDFATHER: "GRANDMOTHER", GRANDMOTHER: "GRANDFATHER",
  GRANDSON: "GRANDDAUGHTER", GRANDDAUGHTER: "GRANDSON",
  UNCLE: "AUNT", AUNT: "UNCLE", NEPHEW: "NIECE", NIECE: "NEPHEW",
  FATHER_IN_LAW: "MOTHER_IN_LAW", MOTHER_IN_LAW: "FATHER_IN_LAW",
  SON_IN_LAW: "DAUGHTER_IN_LAW", DAUGHTER_IN_LAW: "SON_IN_LAW",
  BROTHER_IN_LAW: "SISTER_IN_LAW", SISTER_IN_LAW: "BROTHER_IN_LAW",
};

function relationTier(value: BlrCp006Relation): number {
  if (/GRAND/.test(value)) return 2;
  if (/FATHER|MOTHER|PARENT|SON|DAUGHTER|CHILD/.test(value)) return 1;
  return 0;
}

function failureFor(
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

function relationExplanation(
  target: { subjectId: string; relationId: BlrCp006Relation; referenceId: string },
  actual: BlrCp006Relation | undefined,
  failure: BlrCp007V2FailureCode,
): string {
  if (failure === "REVERSED_DIRECTION") {
    return `The coded direction is reversed; it does not make ${target.subjectId} the ${relationText(target.relationId)} of ${target.referenceId}.`;
  }
  if (failure === "BROKEN_CHAIN") {
    return `The coded statements form a valid family graph, but they do not connect ${target.subjectId} to ${target.referenceId} through the required relation.`;
  }
  return `The valid coded graph makes ${target.subjectId} the ${relationText(actual)} of ${target.referenceId}, not the ${relationText(target.relationId)}.`;
}

function substituteToken(
  statements: readonly BlrCp006CodedStatement[],
  index: number,
  token: string,
): readonly BlrCp006CodedStatement[] {
  return statements.map((entry, current) => current === index ? { ...entry, token } : entry);
}

function substitutePair(
  statements: readonly BlrCp006CodedStatement[],
  indices: readonly [number, number],
  pair: readonly [string, string],
): readonly BlrCp006CodedStatement[] {
  return statements.map((entry, current) => {
    if (current === indices[0]) return { ...entry, token: pair[0] };
    if (current === indices[1]) return { ...entry, token: pair[1] };
    return entry;
  });
}

function candidateExpressionStatements(
  question: GeneratedBlrCp007EditorialV2Question,
  option: BlrCp007V2Option,
): readonly (readonly BlrCp006CodedStatement[])[] {
  const candidates: BlrCp006CodedStatement[][] = [];
  option.completedStatements.forEach((statement, index) => {
    question.codeKey.forEach((key) => {
      if (key.token === statement.token) return;
      candidates.push(option.completedStatements.map((entry, current) =>
        current === index ? { ...entry, token: key.token } : { ...entry },
      ));
    });
    candidates.push(option.completedStatements.map((entry, current) =>
      current === index
        ? { ...entry, leftId: entry.rightId, rightId: entry.leftId }
        : { ...entry },
    ));
  });
  return candidates;
}

function repairedFailureCodeForPair(
  pair: readonly [string, string],
  correct: readonly [string, string],
): BlrCp007V2FailureCode {
  const first = pair[0] === correct[0];
  const second = pair[1] === correct[1];
  if (pair[0] === correct[1] && pair[1] === correct[0]) return "TOKENS_SWAPPED";
  if (!first && !second) return "BOTH_TOKENS_WRONG";
  return first ? "SECOND_TOKEN_WRONG" : "FIRST_TOKEN_WRONG";
}

function repairInvalidOption(input: {
  question: GeneratedBlrCp007EditorialV2Question;
  option: BlrCp007V2Option;
  usedTexts: Set<string>;
  optionIndex: number;
}): BlrCp007V2Option {
  const { question, option, usedTexts } = input;
  const query = question.query;
  const target = targetFor(query);
  if (!target) return option;

  let candidates: readonly {
    text: string;
    statements: readonly BlrCp006CodedStatement[];
    failureCode?: BlrCp007V2FailureCode;
    explanation?: string;
  }[] = [];

  if (query.kind === "SELECT_EXPRESSION") {
    candidates = candidateExpressionStatements(question, option).map((statements) => ({
      text: expressionText(statements),
      statements,
    }));
  } else if (query.kind === "MISSING_TOKEN") {
    const correctToken = query.completeStatements[query.blankStatementIndex]!.token;
    const required = question.codeKey.find((entry) => entry.token === correctToken)?.relationId;
    candidates = question.codeKey
      .filter((entry) => entry.token !== correctToken)
      .map((entry) => ({
        text: entry.token,
        statements: substituteToken(query.completeStatements, query.blankStatementIndex, entry.token),
        failureCode: "WRONG_TOKEN_MEANING" as const,
        explanation: `${entry.token} means “${relationText(entry.relationId)}”, but the blank requires “${relationText(required)}”.`,
      }));
  } else if (query.kind === "MISSING_TOKEN_PAIR") {
    const correct: readonly [string, string] = [
      query.completeStatements[query.blankStatementIndices[0]]!.token,
      query.completeStatements[query.blankStatementIndices[1]]!.token,
    ];
    const pairs: [string, string][] = [];
    question.codeKey.forEach((first) => question.codeKey.forEach((second) => {
      if (first.token === correct[0] && second.token === correct[1]) return;
      pairs.push([first.token, second.token]);
    }));
    candidates = pairs.map((pair) => {
      const failureCode = repairedFailureCodeForPair(pair, correct);
      const explanation = failureCode === "TOKENS_SWAPPED"
        ? "The two required tokens are placed in the opposite blanks."
        : failureCode === "FIRST_TOKEN_WRONG"
          ? `The second blank is correct, but the first requires ${correct[0]}, not ${pair[0]}.`
          : failureCode === "SECOND_TOKEN_WRONG"
            ? `The first blank is correct, but the second requires ${correct[1]}, not ${pair[1]}.`
            : `The blanks require ${correct[0]} and ${correct[1]} in that order.`;
      return {
        text: `${pair[0]}, ${pair[1]}`,
        statements: substitutePair(query.completeStatements, query.blankStatementIndices, pair),
        failureCode,
        explanation,
      };
    });
  } else {
    return option;
  }

  for (const candidate of candidates) {
    if (usedTexts.has(candidate.text)) continue;
    const decoded = decode(question, candidate.statements, `OPTION-${input.optionIndex}-${candidate.text}`);
    if (!decoded) continue;
    const actual = actualRelation(decoded.graph, target.subjectId, target.referenceId);
    if (actual === target.relationId) continue;
    const failureCode = candidate.failureCode ?? failureFor(decoded.graph, target, actual);
    const explanation = candidate.explanation ?? relationExplanation(target, actual, failureCode);
    return {
      ...option,
      text: candidate.text,
      semanticKey: `REPAIRED::${option.semanticKey}::${semanticFingerprint([candidate.text, ...candidate.statements.flatMap((entry) => [entry.leftId, entry.token, entry.rightId])]).slice(0, 8)}`,
      completedStatements: candidate.statements,
      decodedAssertions: decoded.decodedStatements,
      graphValidity: "VALID",
      statementValidity: "NOT_APPLICABLE",
      targetRelationSatisfied: false,
      isCorrectAnswerForTask: false,
      failureCode,
      actualRelation: actual,
      studentExplanation: explanation,
    };
  }
  throw new Error(`${question.itemId}: no valid replacement found for invalid option ${option.text}.`);
}

function repairQuestion(
  question: GeneratedBlrCp007EditorialV2Question,
): GeneratedBlrCp007EditorialV2Question {
  const usedTexts = new Set(question.options.map((option) => option.text));
  const options = question.options.map((option, index) => {
    if (option.graphValidity === "VALID" || option.isCorrectAnswerForTask) return option;
    usedTexts.delete(option.text);
    const repaired = repairInvalidOption({ question, option, usedTexts, optionIndex: index });
    usedTexts.add(repaired.text);
    return repaired;
  });
  if (new Set(options.map((option) => option.text)).size !== 4) {
    throw new Error(`${question.itemId}: distractor repair created duplicate text.`);
  }
  if (options.filter((option) => option.isCorrectAnswerForTask).length !== 1) {
    throw new Error(`${question.itemId}: distractor repair changed answer uniqueness.`);
  }
  const fingerprint = semanticFingerprint([
    question.metadata.runtimeVersion,
    "EXAM-REALISTIC-DISTRACTORS",
    question.sourcePrototypeId,
    question.seed,
    question.stem,
    ...options.map((option) => option.text),
    question.correctIndex,
  ]);
  const itemId = `${question.itemId.split("-F")[0]}-E${fingerprint.slice(0, 8)}`;
  return {
    ...question,
    itemId,
    options,
    explanation: {
      ...question.explanation,
      optionAnalysis: options.map((option, index) => ({
        optionLabel: ["A", "B", "C", "D"][index] as "A" | "B" | "C" | "D",
        optionText: option.text,
        statementValidity: option.statementValidity,
        isCorrectAnswerForTask: option.isCorrectAnswerForTask,
        failureCode: option.failureCode,
        explanation: option.studentExplanation,
      })),
    },
    reviewProof: {
      ...question.reviewProof,
      questionId: itemId,
      semanticFingerprint: fingerprint,
    },
    metadata: {
      ...question.metadata,
      semanticFingerprint: fingerprint,
    },
  };
}

export function generateBlrCp007EditorialV2ExamReviewQuestion(
  prototypeId: BlrCp007PrototypeId,
  seed: number,
): GeneratedBlrCp007EditorialV2Question {
  return repairQuestion(
    generateBlrCp007EditorialV2FinalReviewQuestion(prototypeId, seed),
  );
}

export function generateBlrCp007EditorialV2ExamReviewBank(): readonly GeneratedBlrCp007EditorialV2Question[] {
  return BLR_CP007_PROTOTYPES.flatMap((prototype) =>
    Array.from({ length: 8 }, (_, seed) =>
      generateBlrCp007EditorialV2ExamReviewQuestion(prototype.prototypeId, seed),
    ),
  );
}

export function buildBlrCp007EditorialV2ExamReviewTelemetry(
  bank = generateBlrCp007EditorialV2ExamReviewBank(),
): BlrCp007EditorialV2Telemetry {
  return buildBlrCp007EditorialV2FinalReviewTelemetry(bank);
}
