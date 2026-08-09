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
} from "./cp007-model";
import {
  buildBlrCp007EditorialV2FinalReviewTelemetry,
  generateBlrCp007EditorialV2FinalReviewQuestion,
} from "./cp007-editorial-v2-final-review";
import { generateBlrCp007EditorialV2ExamReviewQuestion } from "./cp007-editorial-v2-exam-review";
import type {
  BlrCp007EditorialV2Telemetry,
  GeneratedBlrCp007EditorialV2Question,
} from "./cp007-editorial-v2-model";
import { BLR_CP007_PROTOTYPES } from "./cp007-prototypes";

const REMODELLED_PROTOTYPE = "BLR-CP007-PROT-MISSING-TOKEN-FIRST-LINK" as const;

function relationText(value: BlrCp006Relation | undefined): string {
  return value
    ? relationDisplay(value).toLocaleLowerCase("en-IN")
    : "relation not established";
}

function statementLine(value: BlrCp006CodedStatement): string {
  return `${value.leftId} ${value.token} ${value.rightId}`;
}

function decode(
  question: GeneratedBlrCp007EditorialV2Question,
  statements: readonly BlrCp006CodedStatement[],
  suffix: string,
): { graph: BlrCp006Graph; decodedStatements: readonly string[] } {
  const first = statements[0]!;
  const scenario: BlrCp006Scenario = {
    scenarioId: `${question.scenarioId}::KEY-REMODEL::${suffix}`,
    topologyId: "CP007_EDITORIAL_V2_GRAPH_FRIENDLY_KEY",
    keyStyle: question.keyStyle,
    codeKey: question.codeKey,
    statements,
    expressionLines: statements.map(statementLine),
    query: { kind: "RELATION", subjectId: first.leftId, referenceId: first.rightId },
    authority: "RESOLVE_CODED_RELATION",
    prototypeId: "BLR-CP006-PROT-DIRECT-FORWARD",
    qlId: "BLR-QL-026",
    stem: "Graph-friendly token-key verification",
  };
  return decodeScenario(scenario);
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

function prompt(question: GeneratedBlrCp007EditorialV2Question): string {
  return `Use the following code meanings: ${question.codeKey.map((entry) =>
    `${entry.token} means “is the ${relationText(entry.relationId)} of”`,
  ).join("; ")}. Each coded pair is read from left to right.`;
}

function remodelFirstLinkKey(
  source: GeneratedBlrCp007EditorialV2Question,
): GeneratedBlrCp007EditorialV2Question {
  if (source.query.kind !== "MISSING_TOKEN") {
    throw new Error(`${source.itemId}: expected a missing-token query.`);
  }
  const codeKey = source.codeKey.map((entry) =>
    entry.relationId === "WIFE" ? { ...entry, relationId: "HUSBAND" as const } : entry,
  );
  const question: GeneratedBlrCp007EditorialV2Question = {
    ...source,
    codeKey,
    sharedPrompt: "",
  };
  question.sharedPrompt = prompt(question);
  const correctToken = source.query.completeStatements[source.query.blankStatementIndex]!.token;
  const requiredRelation = codeKey.find((entry) => entry.token === correctToken)?.relationId;
  const target = source.query.target;
  const options = source.options.map((option) => {
    const decoded = decode(question, option.completedStatements, option.semanticKey);
    const actual = actualRelation(decoded.graph, target.subjectId, target.referenceId);
    const correct = option.text === correctToken;
    const tokenRelation = codeKey.find((entry) => entry.token === option.text)?.relationId;
    return {
      ...option,
      semanticKey: tokenRelation === "HUSBAND"
        ? `KEY_REPAIRED::${option.semanticKey}`
        : option.semanticKey,
      decodedAssertions: decoded.decodedStatements,
      graphValidity: "VALID" as const,
      targetRelationSatisfied: correct,
      isCorrectAnswerForTask: correct,
      failureCode: correct ? undefined : "WRONG_TOKEN_MEANING" as const,
      actualRelation: actual,
      studentExplanation: correct
        ? `The decoded links make ${target.subjectId} the ${relationText(target.relationId)} of ${target.referenceId}.`
        : `${option.text} means “${relationText(tokenRelation)}”, but this blank requires “${relationText(requiredRelation)}”.`,
    };
  });
  if (options.some((option) => option.graphValidity !== "VALID")) {
    throw new Error(`${source.itemId}: graph-friendly key still has an invalid option.`);
  }
  if (options.filter((option) => option.isCorrectAnswerForTask).length !== 1) {
    throw new Error(`${source.itemId}: graph-friendly key changed answer uniqueness.`);
  }
  const fingerprint = semanticFingerprint([
    source.metadata.runtimeVersion,
    "GRAPH-FRIENDLY-KEY",
    source.sourcePrototypeId,
    source.seed,
    question.sharedPrompt,
    source.stem,
    ...options.map((option) => option.text),
    source.correctIndex,
  ]);
  const itemId = `${source.itemId.split("-E")[0]}-K${fingerprint.slice(0, 8)}`;
  return {
    ...question,
    itemId,
    options,
    explanation: {
      ...source.explanation,
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
      ...source.reviewProof,
      questionId: itemId,
      semanticFingerprint: fingerprint,
    },
    metadata: {
      ...source.metadata,
      semanticFingerprint: fingerprint,
    },
  };
}

export function generateBlrCp007EditorialV2ExamReviewFinalQuestion(
  prototypeId: BlrCp007PrototypeId,
  seed: number,
): GeneratedBlrCp007EditorialV2Question {
  if (prototypeId === REMODELLED_PROTOTYPE) {
    return remodelFirstLinkKey(
      generateBlrCp007EditorialV2FinalReviewQuestion(prototypeId, seed),
    );
  }
  return generateBlrCp007EditorialV2ExamReviewQuestion(prototypeId, seed);
}

export function generateBlrCp007EditorialV2ExamReviewFinalBank(): readonly GeneratedBlrCp007EditorialV2Question[] {
  return BLR_CP007_PROTOTYPES.flatMap((prototype) =>
    Array.from({ length: 8 }, (_, seed) =>
      generateBlrCp007EditorialV2ExamReviewFinalQuestion(prototype.prototypeId, seed),
    ),
  );
}

export function buildBlrCp007EditorialV2ExamReviewFinalTelemetry(
  bank = generateBlrCp007EditorialV2ExamReviewFinalBank(),
): BlrCp007EditorialV2Telemetry {
  return buildBlrCp007EditorialV2FinalReviewTelemetry(bank);
}
