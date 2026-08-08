import type {
  BlrCp006CodeDefinition,
  BlrCp006DirectRelation,
} from "../BLR-CP-006/cp006-model";
import type { BlrCp007ExpressionCandidate } from "./cp007-model";
import { buildBlrCp007EditorialV4Telemetry } from "./cp007-editorial-v4";
import type {
  BlrCp007EditorialV4Telemetry,
  GeneratedBlrCp007EditorialV4Question,
} from "./cp007-editorial-v4-model";
import { generateBlrCp007EditorialV4Wave2Bank } from "./cp007-editorial-v4-wave2";
import {
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
  remodelQl031,
  remodelQl032,
  remodelQl033,
  statementText,
  targetSentence,
  type Target,
} from "./cp007-editorial-v4-wave3-safe-core";
import { remodelQl034 } from "./cp007-editorial-v4-wave3-ql034";

export const BLR_CP007_V4_WAVE3_SELF_REVIEW_AUTHORITY =
  "BLR_CP007_V4_SELF_REVIEW_REMEDIATION" as const;

export interface BlrCp007V4Wave3Telemetry extends BlrCp007EditorialV4Telemetry {
  ql032BlankMeaningMismatchCount: number;
  learnerTokenWordOccurrences: number;
  codePersonCollisionCount: number;
  ql031SinglePositionDerivedDistractorCount: number;
  ql033FixedBlankOptionCount: number;
  ql034DistinctDecisiveStructureCount: number;
  ql034BroadTargetCount: number;
  directValidityEasyCount: number;
}

function remodelQl035(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
): GeneratedBlrCp007EditorialV4Question {
  if (question.query.kind !== "SELECT_VALIDITY") throw new Error(`${question.itemId}: expected SELECT_VALIDITY.`);
  const options = question.options.map((sourceOption) => {
    const statements = sourceOption.completedStatements.map((statement) =>
      remapStatement(statement, question.codeKey, codeKey),
    );
    const candidate = question.query.candidates.find((value) => value.semanticKey === sourceOption.semanticKey);
    if (!candidate?.claim) throw new Error(`${question.itemId}: missing validity claim for ${sourceOption.semanticKey}.`);
    const claim = candidate.claim;
    const target: Target = claim;
    const evaluated = evaluate(codeKey, statements, target, `${question.itemId}-VALIDITY-${sourceOption.semanticKey}`);
    const valid = evaluated.actual === claim.relationId;
    const expression = statements.map(statementText).join("; ");
    const text = `${expression} — ${targetSentence(claim)}`;
    return {
      ...sourceOption,
      text,
      completedStatements: statements,
      decodedAssertions: evaluated.decodedStatements,
      statementValidity: valid ? "VALID" as const : "INVALID" as const,
      targetRelationSatisfied: valid,
      actualRelation: evaluated.actual,
      studentExplanation: valid
        ? `${evaluated.decodedStatements.join(" ")} The written interpretation matches the actual relation.`
        : `${evaluated.decodedStatements.join(" ")} The actual relation is ${evaluated.actual ? relationText(evaluated.actual) : "not established"}, so the written interpretation is incorrect.`,
    };
  });
  const candidates: readonly BlrCp007ExpressionCandidate[] = options.map((option) => {
    const source = question.query.kind === "SELECT_VALIDITY"
      ? question.query.candidates.find((value) => value.semanticKey === option.semanticKey)!
      : undefined;
    return {
      text: option.text,
      statements: option.completedStatements,
      semanticKey: option.semanticKey,
      claim: source!.claim,
    };
  });
  const correct = options[question.correctIndex]!;
  const sourceCorrect = candidates[question.correctIndex]!;
  const evaluated = evaluate(codeKey, correct.completedStatements, sourceCorrect.claim!, `${question.itemId}-VALIDITY-FINAL`);
  return {
    ...question,
    keyStyle: "SYMBOL",
    codeKey,
    sharedPrompt: promptFor(codeKey),
    query: { kind: "SELECT_VALIDITY", desiredStatus: question.query.desiredStatus, candidates },
    stem: question.query.desiredStatus === "VALID"
      ? "Which coded statement and interpretation is correct?"
      : "Which coded statement and interpretation is incorrect?",
    options,
    answer: correct.text,
    completedStatements: correct.completedStatements,
    decodedStatements: evaluated.decodedStatements,
    graph: evaluated.graph,
    explanation: {
      ...question.explanation,
      steps: correct.decodedAssertions,
      conclusion: `Option ${OPTION_LABELS[question.correctIndex]} is the required ${question.query.desiredStatus === "VALID" ? "correct" : "incorrect"} statement.`,
      shortcut: "Decode each option and compare its actual relation with the written interpretation.",
      commonTrap: question.query.desiredStatus === "VALID"
        ? "Do not select an option whose code is valid but whose written interpretation is wrong."
        : "The question asks for the incorrect interpretation, not merely the most complex option.",
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

function finaliseQuestion(
  source: GeneratedBlrCp007EditorialV4Question,
  ql034Index: number,
): GeneratedBlrCp007EditorialV4Question {
  const groupKey = source.delivery.mode === "SHARED_SET" ? source.delivery.setId! : source.itemId;
  const relations = source.delivery.mode === "SHARED_SET" ||
    source.qlId === "BLR-QL-031" || source.qlId === "BLR-QL-032"
    ? DIRECT_RELATIONS
    : source.codeKey.map((entry) => entry.relationId);
  const codeKey = codeKeyFor(`${groupKey}-V4-WAVE3`, relations);
  let question: GeneratedBlrCp007EditorialV4Question;
  if (source.qlId === "BLR-QL-031") question = remodelQl031(source, codeKey);
  else if (source.qlId === "BLR-QL-032") question = remodelQl032(source, codeKey);
  else if (source.qlId === "BLR-QL-033") question = remodelQl033(source, codeKey);
  else if (source.qlId === "BLR-QL-034") question = remodelQl034(source, ql034Index);
  else question = remodelQl035(source, codeKey);

  const difficulty = question.qlId === "BLR-QL-034"
    ? question.metadata.difficulty
    : displayDifficulty(question);
  const use = recommendedUse(question, difficulty);
  const finalFingerprint = fingerprint({
    qlId: question.qlId,
    sourcePrototypeId: question.sourcePrototypeId,
    semanticScenarioId: question.semanticScenarioId,
    codeKey: question.codeKey,
    stem: question.stem,
    options: question.options.map((option) => ({ text: option.text, explanation: option.studentExplanation })),
    correctIndex: question.correctIndex,
    explanation: {
      steps: question.explanation.steps,
      conclusion: question.explanation.conclusion,
      shortcut: question.explanation.shortcut,
      commonTrap: question.explanation.commonTrap,
    },
  });
  return {
    ...question,
    reviewProof: {
      ...question.reviewProof,
      difficulty,
      semanticFingerprint: finalFingerprint,
      reviewerNote: `${question.reviewProof.reviewerNote} Final Wave 3 self-review approval remains pending.`,
    },
    metadata: {
      ...question.metadata,
      difficulty,
      v4EditorialFingerprint: finalFingerprint,
      disposition: question.metadata.disposition,
      recommendedUse: use,
      activeEditorialBlockers: ["HUMAN_EDITORIAL_APPROVAL_PENDING"],
    },
    v4ReviewProof: {
      ...question.v4ReviewProof,
      disposition: question.metadata.disposition,
      recommendedUse: use,
      activeEditorialBlockers: ["HUMAN_EDITORIAL_APPROVAL_PENDING"],
    },
  };
}

export function generateBlrCp007EditorialV4Wave3Bank(): readonly GeneratedBlrCp007EditorialV4Question[] {
  let ql034Index = 0;
  return generateBlrCp007EditorialV4Wave2Bank().map((question) => {
    const index = question.qlId === "BLR-QL-034" ? ql034Index++ : -1;
    return finaliseQuestion(question, index);
  });
}

function learnerText(question: GeneratedBlrCp007EditorialV4Question): string {
  return JSON.stringify({
    sharedPrompt: question.sharedPrompt,
    stem: question.stem,
    answer: question.answer,
    options: question.options.map((option) => ({ text: option.text, explanation: option.studentExplanation })),
    explanation: question.explanation,
  });
}

function personIds(question: GeneratedBlrCp007EditorialV4Question): Set<string> {
  return new Set(question.completedStatements.flatMap((statement) => [statement.leftId, statement.rightId]));
}

function ql031SinglePosition(question: GeneratedBlrCp007EditorialV4Question): boolean {
  if (
    question.qlId !== "BLR-QL-031" ||
    question.query.kind !== "SELECT_EXPRESSION" ||
    question.sourcePrototypeId.includes("SELECT-DIRECT")
  ) return false;
  const correct = question.options[question.correctIndex]!.completedStatements;
  if (correct.length < 2) return false;
  const changed = question.options
    .filter((option) => !option.isCorrectAnswerForTask)
    .map((option) => changedPositions(correct, option.completedStatements));
  return new Set(changed.flat()).size < 2;
}

function ql033FixedBlank(question: GeneratedBlrCp007EditorialV4Question): boolean {
  if (question.qlId !== "BLR-QL-033") return false;
  const pairs = question.options.map((option) => option.text.split(", "));
  return new Set(pairs.map((pair) => pair[0])).size === 1 || new Set(pairs.map((pair) => pair[1])).size === 1;
}

export function buildBlrCp007EditorialV4Wave3Telemetry(
  bank = generateBlrCp007EditorialV4Wave3Bank(),
): BlrCp007V4Wave3Telemetry {
  const base = buildBlrCp007EditorialV4Telemetry(bank);
  const ql032BlankMeaningMismatchCount = bank.filter((question) => {
    if (question.qlId !== "BLR-QL-032") return false;
    const correct = question.options[question.correctIndex]!;
    const relationId = correct.semanticKey as BlrCp006DirectRelation;
    return !question.explanation.conclusion.includes(relationText(relationId));
  }).length;
  const learnerTokenWordOccurrences = bank.reduce((sum, question) =>
    sum + (learnerText(question).match(/\btoken(?:s)?\b/gi)?.length ?? 0), 0);
  const codePersonCollisionCount = bank.reduce((sum, question) => {
    const people = personIds(question);
    return sum + question.codeKey.filter((entry) => people.has(entry.token)).length;
  }, 0);
  const ql034 = bank.filter((question) => question.qlId === "BLR-QL-034");
  return {
    ...base,
    ql032BlankMeaningMismatchCount,
    learnerTokenWordOccurrences,
    codePersonCollisionCount,
    ql031SinglePositionDerivedDistractorCount: bank.filter(ql031SinglePosition).length,
    ql033FixedBlankOptionCount: bank.filter(ql033FixedBlank).length,
    ql034DistinctDecisiveStructureCount: new Set(ql034.map((question) =>
      question.topologyId.replace(/-(?:M|F)-[PQRS]$/, ""),
    )).size,
    ql034BroadTargetCount: ql034.filter((question) =>
      ["UNCLE_OR_AUNT", "NEPHEW_OR_NIECE"].includes(question.reviewProof.targetRelation ?? ""),
    ).length,
    directValidityEasyCount: bank.filter((question) =>
      question.qlId === "BLR-QL-035" && question.sourcePrototypeId.includes("DIRECT") && question.metadata.difficulty === "EASY",
    ).length,
  };
}
