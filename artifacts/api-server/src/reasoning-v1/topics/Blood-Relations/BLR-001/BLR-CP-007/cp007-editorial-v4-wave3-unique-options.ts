import type {
  BlrCp006CodedStatement,
  BlrCp006DirectRelation,
} from "../BLR-CP-006/cp006-model";
import type { BlrCp007ExpressionCandidate } from "./cp007-model";
import type { BlrCp007V3Option } from "./cp007-editorial-v3-model";
import type { GeneratedBlrCp007EditorialV4Question } from "./cp007-editorial-v4-model";
import {
  DIRECT_RELATIONS,
  OPTION_LABELS,
  evaluate,
  relationText,
  remodelQl031 as remodelQl031Base,
  remodelQl032 as remodelQl032Base,
  statementText,
  targetSentence,
  tokenFor,
} from "./cp007-editorial-v4-wave3-core";
import type { BlrCp006CodeDefinition } from "../BLR-CP-006/cp006-model";

export {
  DIRECT_RELATIONS,
  OPTION_LABELS,
  changedPositions,
  codeKeyFor,
  displayDifficulty,
  evaluate,
  fingerprint,
  promptFor,
  recommendedUse,
  relationText,
  remapStatement,
  remodelQl033,
  statementText,
  targetSentence,
  type Target,
} from "./cp007-editorial-v4-wave3-safe-core";

function relationFor(
  codeKey: readonly BlrCp006CodeDefinition[],
  token: string,
): BlrCp006DirectRelation {
  const relationId = codeKey.find((entry) => entry.token === token)?.relationId;
  if (!relationId) throw new Error(`Unknown symbol ${token}.`);
  return relationId;
}

function wrongExplanation(
  target: { subjectId: string; relationId: string; referenceId: string },
  actual?: string,
): string {
  if (actual) {
    return `The decoded statement makes ${target.subjectId} the ${relationText(actual as never)} of ${target.referenceId}, not the ${relationText(target.relationId as never)}.`;
  }
  return `The decoded statement does not establish the required relation between ${target.subjectId} and ${target.referenceId}.`;
}

function selectUniqueWrongRelations(
  question: GeneratedBlrCp007EditorialV4Question,
  correctRelation: BlrCp006DirectRelation,
  buildStatements: (relationId: BlrCp006DirectRelation) => readonly BlrCp006CodedStatement[],
): readonly { relationId: BlrCp006DirectRelation; statements: readonly BlrCp006CodedStatement[]; actual?: string; decoded: readonly string[] }[] {
  const target = "target" in question.query ? question.query.target : undefined;
  if (!target) throw new Error(`${question.itemId}: query target missing.`);
  const candidates: { relationId: BlrCp006DirectRelation; statements: readonly BlrCp006CodedStatement[]; actual?: string; decoded: readonly string[] }[] = [];
  for (const relationId of DIRECT_RELATIONS) {
    if (relationId === correctRelation) continue;
    try {
      const statements = buildStatements(relationId);
      const evaluated = evaluate(question.codeKey, statements, target, `${question.itemId}-UNIQUE-${relationId}`);
      if (evaluated.actual === target.relationId) continue;
      candidates.push({
        relationId,
        statements,
        actual: evaluated.actual,
        decoded: evaluated.decodedStatements,
      });
    } catch {
      // Contradictory or graph-invalid alternatives are not learner options.
    }
  }
  const relationClasses = (relationId: BlrCp006DirectRelation): string => {
    if (["FATHER", "MOTHER"].includes(relationId)) return "PARENT";
    if (["SON", "DAUGHTER"].includes(relationId)) return "CHILD";
    if (["BROTHER", "SISTER"].includes(relationId)) return "SIBLING";
    return "SPOUSE";
  };
  candidates.sort((left, right) => {
    const leftScore = (relationClasses(left.relationId) !== relationClasses(correctRelation) ? 4 : 0) + (left.actual ? 1 : 0);
    const rightScore = (relationClasses(right.relationId) !== relationClasses(correctRelation) ? 4 : 0) + (right.actual ? 1 : 0);
    return rightScore - leftScore;
  });
  const selected: typeof candidates = [];
  const usedClasses = new Set<string>();
  for (const candidate of candidates) {
    const relationClass = relationClasses(candidate.relationId);
    if (selected.length < 2 && usedClasses.has(relationClass)) continue;
    selected.push(candidate);
    usedClasses.add(relationClass);
    if (selected.length === 3) break;
  }
  for (const candidate of candidates) {
    if (selected.length === 3) break;
    if (selected.some((value) => value.relationId === candidate.relationId)) continue;
    selected.push(candidate);
  }
  if (selected.length !== 3) throw new Error(`${question.itemId}: fewer than three uniquely wrong direct relations.`);
  return selected;
}

function rebuildReverseQl031(
  question: GeneratedBlrCp007EditorialV4Question,
): GeneratedBlrCp007EditorialV4Question {
  if (
    question.query.kind !== "SELECT_EXPRESSION" ||
    !question.sourcePrototypeId.includes("SELECT-DIRECT-REVERSE")
  ) return question;
  const correctSource = question.options[question.correctIndex]!;
  const correctRelation = relationFor(question.codeKey, correctSource.completedStatements[0]!.token);
  const target = question.query.target;
  const buildStatements = (relationId: BlrCp006DirectRelation) => correctSource.completedStatements.map((statement, index) =>
    index === 0 ? { ...statement, token: tokenFor(question.codeKey, relationId) } : { ...statement },
  );
  const evaluatedCorrect = evaluate(question.codeKey, correctSource.completedStatements, target, `${question.itemId}-UNIQUE-CORRECT`);
  if (evaluatedCorrect.actual !== target.relationId) {
    throw new Error(`${question.itemId}: designated direct-reverse answer no longer establishes the target.`);
  }
  const correct: BlrCp007V3Option = {
    ...correctSource,
    targetRelationSatisfied: true,
    isCorrectAnswerForTask: true,
    actualRelation: evaluatedCorrect.actual,
    decodedAssertions: evaluatedCorrect.decodedStatements,
    studentExplanation: `The decoded statement establishes that ${targetSentence(target)}.`,
  };
  const wrong = selectUniqueWrongRelations(question, correctRelation, buildStatements).map((candidate): BlrCp007V3Option => ({
    text: candidate.statements.map(statementText).join("; "),
    semanticKey: candidate.statements.map((statement) =>
      `${statement.leftId}:${relationFor(question.codeKey, statement.token)}:${statement.rightId}`,
    ).join("|"),
    completedStatements: candidate.statements,
    decodedAssertions: candidate.decoded,
    graphValidity: "VALID",
    statementValidity: "NOT_APPLICABLE",
    targetRelationSatisfied: false,
    isCorrectAnswerForTask: false,
    failureCode: "WRONG_RELATION",
    actualRelation: candidate.actual as never,
    studentExplanation: wrongExplanation(target, candidate.actual),
  }));
  let wrongIndex = 0;
  const options = Array.from({ length: 4 }, (_, index) =>
    index === question.correctIndex ? correct : wrong[wrongIndex++]!,
  );
  const candidates: readonly BlrCp007ExpressionCandidate[] = options.map((option) => ({
    text: option.text,
    statements: option.completedStatements,
    semanticKey: option.semanticKey,
  }));
  return {
    ...question,
    query: { kind: "SELECT_EXPRESSION", target, candidates },
    options,
    answer: correct.text,
    completedStatements: correct.completedStatements,
    decodedStatements: evaluatedCorrect.decodedStatements,
    graph: evaluatedCorrect.graph,
    explanation: {
      ...question.explanation,
      optionAnalysis: options.map((option, index) => ({
        optionLabel: OPTION_LABELS[index]!,
        optionText: option.text,
        statementValidity: option.statementValidity,
        isCorrectAnswerForTask: option.isCorrectAnswerForTask,
        failureCode: option.failureCode,
        explanation: option.studentExplanation,
      })),
    },
  };
}

function rebuildReverseQl032(
  question: GeneratedBlrCp007EditorialV4Question,
): GeneratedBlrCp007EditorialV4Question {
  if (
    question.query.kind !== "MISSING_TOKEN" ||
    !question.sourcePrototypeId.includes("MISSING-TOKEN-REVERSE")
  ) return question;
  const correctSource = question.options[question.correctIndex]!;
  const correctRelation = correctSource.semanticKey as BlrCp006DirectRelation;
  const target = question.query.target;
  const blankIndex = question.query.blankStatementIndex;
  const buildStatements = (relationId: BlrCp006DirectRelation) => correctSource.completedStatements.map((statement, index) =>
    index === blankIndex ? { ...statement, token: tokenFor(question.codeKey, relationId) } : { ...statement },
  );
  const evaluatedCorrect = evaluate(question.codeKey, correctSource.completedStatements, target, `${question.itemId}-UNIQUE-CORRECT`);
  if (evaluatedCorrect.actual !== target.relationId) {
    throw new Error(`${question.itemId}: designated reverse symbol no longer establishes the target.`);
  }
  const correct: BlrCp007V3Option = {
    ...correctSource,
    text: tokenFor(question.codeKey, correctRelation),
    targetRelationSatisfied: true,
    isCorrectAnswerForTask: true,
    actualRelation: evaluatedCorrect.actual,
    decodedAssertions: evaluatedCorrect.decodedStatements,
    studentExplanation: `${tokenFor(question.codeKey, correctRelation)} means “is the ${relationText(correctRelation)} of”. With it in the blank, ${targetSentence(target)}.`,
  };
  const wrong = selectUniqueWrongRelations(question, correctRelation, buildStatements).map((candidate): BlrCp007V3Option => {
    const symbol = tokenFor(question.codeKey, candidate.relationId);
    return {
      text: symbol,
      semanticKey: candidate.relationId,
      completedStatements: candidate.statements,
      decodedAssertions: candidate.decoded,
      graphValidity: "VALID",
      statementValidity: "NOT_APPLICABLE",
      targetRelationSatisfied: false,
      isCorrectAnswerForTask: false,
      failureCode: "WRONG_RELATION",
      actualRelation: candidate.actual as never,
      studentExplanation: `${symbol} means “is the ${relationText(candidate.relationId)} of”. ${wrongExplanation(target, candidate.actual)}`,
    };
  });
  let wrongIndex = 0;
  const options = Array.from({ length: 4 }, (_, index) =>
    index === question.correctIndex ? correct : wrong[wrongIndex++]!,
  );
  return {
    ...question,
    query: {
      ...question.query,
      candidateTokens: options.map((option) => option.text),
    },
    options,
    answer: correct.text,
    completedStatements: correct.completedStatements,
    decodedStatements: evaluatedCorrect.decodedStatements,
    graph: evaluatedCorrect.graph,
    explanation: {
      ...question.explanation,
      optionAnalysis: options.map((option, index) => ({
        optionLabel: OPTION_LABELS[index]!,
        optionText: option.text,
        statementValidity: option.statementValidity,
        isCorrectAnswerForTask: option.isCorrectAnswerForTask,
        failureCode: option.failureCode,
        explanation: option.studentExplanation,
      })),
    },
  };
}

export function remodelQl031(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
): GeneratedBlrCp007EditorialV4Question {
  return rebuildReverseQl031(remodelQl031Base(question, codeKey));
}

export function remodelQl032(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
): GeneratedBlrCp007EditorialV4Question {
  return rebuildReverseQl032(remodelQl032Base(question, codeKey));
}