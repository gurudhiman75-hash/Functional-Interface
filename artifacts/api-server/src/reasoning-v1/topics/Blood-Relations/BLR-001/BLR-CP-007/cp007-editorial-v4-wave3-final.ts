import type { BlrCp007V3Option } from "./cp007-editorial-v3-model";
import type { GeneratedBlrCp007EditorialV4Question } from "./cp007-editorial-v4-model";
import {
  buildBlrCp007EditorialV4Wave3Telemetry,
  generateBlrCp007EditorialV4Wave3Bank,
  type BlrCp007V4Wave3Telemetry,
} from "./cp007-editorial-v4-wave3";
import { remodelQl034 as remodelSecureQl034 } from "./cp007-editorial-v4-wave3-ql034-secure";
import { fingerprint, promptFor, targetSentence } from "./cp007-editorial-v4-wave3-core";

export const BLR_CP007_V4_WAVE3_FINAL_REVIEW_AUTHORITY =
  "BLR_CP007_V4_WAVE3_PRODUCT_OWNER_APPROVED" as const;

export interface BlrCp007V4Wave3FinalTelemetry extends BlrCp007V4Wave3Telemetry {
  semanticAmbiguityCount: number;
  malformedLearnerExplanationCount: number;
  redundantRelationQualifierCount: number;
  ql034AnswerMentionedInTargetCount: number;
  ql034MaximumStatementCount: number;
  ql034AverageStatementCount: number;
  maximumDisplayedCodeKeySize: number;
  averageDisplayedCodeKeySize: number;
}

const QL034_SHORTCUTS = [
  "Trace the shortest path from A to D first; use the remaining branch only to identify the correct candidate.",
  "Find the candidate directly connected to the decisive D-link, then verify A’s relation to that person.",
  "Ignore the side branch initially and solve the two or three statements that connect A with D.",
  "Mark the generation and gender on the A–D path before checking the candidate labels.",
  "Test each candidate in the blank against the decisive path rather than counting how often a letter appears.",
  "Resolve the relation nearest D first, then work outward to A.",
  "Use the coded chain containing A and D as the main route; the compact branch distinguishes the options.",
  "Substitute a candidate only after identifying the exact parent, sibling or spouse link required by the target.",
] as const;

const QL034_TRAPS = [
  "Every candidate appears in the connected network, but only one completes the relation asked in the question.",
  "Do not choose the candidate closest to the blank without tracing the resulting path to D.",
  "A connected candidate can still be wrong when it places A on a different branch of the family.",
  "Repeated appearance of a candidate letter does not make that candidate correct.",
  "Do not use gender alone; the candidate must also occupy the correct generation and branch.",
  "A plausible local relation is insufficient if the complete A–D relation is different.",
  "Keep spouse and sibling links separate when the route contains an in-law relation.",
  "For reverse forms, confirm who is related to whom before naming the final relation.",
] as const;

function wrongQl034Explanation(
  question: GeneratedBlrCp007EditorialV4Question,
  option: BlrCp007V3Option,
  optionIndex: number,
): string {
  if (question.query.kind !== "MISSING_PERSON") return option.studentExplanation;
  const target = question.query.target;
  if (option.actualRelation) {
    return option.studentExplanation;
  }
  const variants = [
    `With ${option.text} in the blank, the decisive chain does not reach ${target.referenceId}; the required relation between ${target.subjectId} and ${target.referenceId} is not established.`,
    `Substituting ${option.text} connects ${target.subjectId} to a different family branch, so the requested ${target.subjectId}–${target.referenceId} relation is not obtained.`,
    `Using ${option.text} leaves no valid relation path from ${target.subjectId} to ${target.referenceId} that matches the question.`,
    `With ${option.text}, the completed network does not show that ${targetSentence(target)}.`,
  ] as const;
  return variants[(question.seed + optionIndex) % variants.length];
}

function polishQl034(
  question: GeneratedBlrCp007EditorialV4Question,
): GeneratedBlrCp007EditorialV4Question {
  if (question.qlId !== "BLR-QL-034") return question;
  const options = question.options.map((option, index) => ({
    ...option,
    studentExplanation: option.isCorrectAnswerForTask
      ? option.studentExplanation
      : wrongQl034Explanation(question, option, index),
  }));
  const optionAnalysis = question.explanation.optionAnalysis.map((analysis, index) => ({
    ...analysis,
    explanation: options[index]!.studentExplanation,
  }));
  return {
    ...question,
    options,
    explanation: {
      ...question.explanation,
      shortcut: QL034_SHORTCUTS[question.seed % QL034_SHORTCUTS.length],
      commonTrap: QL034_TRAPS[question.seed % QL034_TRAPS.length],
      optionAnalysis,
    },
  };
}

function approvedWording(text: string): string {
  return text
    .replace(
      "Which coded chain correctly establishes the marriage-based relation that ",
      "Which coded chain correctly establishes that ",
    )
    .replace(
      "Marriage-based and blood-based routes must not be treated as interchangeable.",
      "Check every link in order; changing a spouse, parent or sibling link changes the result.",
    )
    .replace(
      "Mark the marriage link first, then connect the blood relation on the correct side.",
      "Identify the spouse link first, then trace the remaining family link on the correct side.",
    )
    .replace(
      "Do not confuse sibling-of-spouse with spouse-of-sibling; both are in-law routes but use different chains.",
      "Do not confuse a spouse’s sibling with a sibling’s spouse; the two chains are different.",
    )
    .replace(
      "Identify the blood link and marriage link independently, then place them in blank order.",
      "Determine the two direct relations separately, then place their symbols in blank order.",
    )
    .replace(
      "In-law relations depend on which side of the marriage each blood relation belongs to.",
      "For an in-law relation, the order of the spouse and parent or sibling links matters.",
    );
}

function polishApprovedWording(
  question: GeneratedBlrCp007EditorialV4Question,
): GeneratedBlrCp007EditorialV4Question {
  const options = question.options.map((option) => ({
    ...option,
    text: approvedWording(option.text),
    studentExplanation: approvedWording(option.studentExplanation),
  }));
  return {
    ...question,
    sharedPrompt: approvedWording(question.sharedPrompt),
    stem: approvedWording(question.stem),
    options,
    answer: approvedWording(question.answer),
    explanation: {
      ...question.explanation,
      steps: question.explanation.steps.map(approvedWording),
      conclusion: approvedWording(question.explanation.conclusion),
      shortcut: question.explanation.shortcut
        ? approvedWording(question.explanation.shortcut)
        : question.explanation.shortcut,
      commonTrap: question.explanation.commonTrap
        ? approvedWording(question.explanation.commonTrap)
        : question.explanation.commonTrap,
      optionAnalysis: question.explanation.optionAnalysis.map((analysis, index) => ({
        ...analysis,
        optionText: options[index]!.text,
        explanation: options[index]!.studentExplanation,
      })),
    },
  };
}

function deliveryGroup(question: GeneratedBlrCp007EditorialV4Question): string {
  return question.delivery.mode === "SHARED_SET"
    ? question.delivery.setId!
    : question.itemId;
}

function usedTokens(question: GeneratedBlrCp007EditorialV4Question): Set<string> {
  return new Set([
    ...question.completedStatements.map((statement) => statement.token),
    ...question.options.flatMap((option) => option.completedStatements.map((statement) => statement.token)),
  ]);
}

function finalFingerprint(question: GeneratedBlrCp007EditorialV4Question): string {
  return fingerprint({
    authority: BLR_CP007_V4_WAVE3_FINAL_REVIEW_AUTHORITY,
    qlId: question.qlId,
    sourcePrototypeId: question.sourcePrototypeId,
    semanticScenarioId: question.semanticScenarioId,
    codeKey: question.codeKey,
    sharedPrompt: question.sharedPrompt,
    stem: question.stem,
    options: question.options.map((option) => ({
      text: option.text,
      explanation: option.studentExplanation,
      targetRelationSatisfied: option.targetRelationSatisfied,
    })),
    correctIndex: question.correctIndex,
    explanation: {
      steps: question.explanation.steps,
      conclusion: question.explanation.conclusion,
      shortcut: question.explanation.shortcut,
      commonTrap: question.explanation.commonTrap,
    },
  });
}

export function generateBlrCp007EditorialV4Wave3FinalBank(): readonly GeneratedBlrCp007EditorialV4Question[] {
  let ql034Index = 0;
  const secured = generateBlrCp007EditorialV4Wave3Bank().map((question) => {
    if (question.qlId !== "BLR-QL-034") return question;
    const index = ql034Index++;
    return index >= 18 && index <= 25
      ? remodelSecureQl034(question, index)
      : question;
  });
  const polished = secured.map(polishQl034).map(polishApprovedWording);
  const tokensByGroup = new Map<string, Set<string>>();
  for (const question of polished) {
    const group = deliveryGroup(question);
    const tokens = tokensByGroup.get(group) ?? new Set<string>();
    for (const token of usedTokens(question)) tokens.add(token);
    tokensByGroup.set(group, tokens);
  }
  return polished.map((question) => {
    const groupTokens = tokensByGroup.get(deliveryGroup(question))!;
    const codeKey = question.codeKey.filter((entry) => groupTokens.has(entry.token));
    const sharedPrompt = promptFor(codeKey);
    const withDisplayKey = { ...question, codeKey, sharedPrompt };
    const editorialFingerprint = finalFingerprint(withDisplayKey);
    return {
      ...withDisplayKey,
      reviewProof: {
        ...question.reviewProof,
        semanticFingerprint: editorialFingerprint,
        reviewerNote: `${question.reviewProof.reviewerNote} Product-owner approved with final learner-facing wording polish; English freeze remains pending.`,
      },
      metadata: {
        ...question.metadata,
        v4EditorialFingerprint: editorialFingerprint,
        activeEditorialBlockers: ["ENGLISH_FREEZE_PENDING"],
      },
      v4ReviewProof: {
        ...question.v4ReviewProof,
        activeEditorialBlockers: ["ENGLISH_FREEZE_PENDING"],
      },
    };
  });
}

function visibleLearnerFields(question: GeneratedBlrCp007EditorialV4Question): readonly string[] {
  return [
    question.sharedPrompt,
    question.stem,
    ...question.options.map((option) => option.text),
    ...question.options.map((option) => option.studentExplanation),
    ...question.explanation.steps,
    question.explanation.conclusion,
    question.explanation.shortcut ?? "",
    question.explanation.commonTrap ?? "",
    ...question.explanation.optionAnalysis.map((analysis) => analysis.explanation),
  ];
}

function hasMalformedExplanation(question: GeneratedBlrCp007EditorialV4Question): boolean {
  return visibleLearnerFields(question).some((field) =>
    /\bso\s+[A-Z]+\s+is\b[^.]*\bis not established\b/i.test(field) ||
    /\bthat\s+[A-Z]+\s+is\b[^.]*\bis not established\b/i.test(field),
  );
}

export function buildBlrCp007EditorialV4Wave3FinalTelemetry(
  bank = generateBlrCp007EditorialV4Wave3FinalBank(),
): BlrCp007V4Wave3FinalTelemetry {
  const base = buildBlrCp007EditorialV4Wave3Telemetry(bank);
  const ql034 = bank.filter((question) => question.qlId === "BLR-QL-034");
  const statementCounts = ql034.map((question) => question.completedStatements.length);
  const semanticAmbiguityCount = bank.filter((question) =>
    question.qlId !== "BLR-QL-035" &&
    question.options.filter((option) => option.targetRelationSatisfied).length !== 1,
  ).length;
  const malformedLearnerExplanationCount = bank.filter(hasMalformedExplanation).length;
  const redundantRelationQualifierCount = bank.reduce((sum, question) =>
    sum + visibleLearnerFields(question).reduce((fieldSum, field) =>
      fieldSum + (field.match(/\b(?:marriage-based|blood-based)\b/gi)?.length ?? 0), 0), 0);
  const ql034AnswerMentionedInTargetCount = ql034.filter((question) => {
    if (question.query.kind !== "MISSING_PERSON") return false;
    return [question.query.target.subjectId, question.query.target.referenceId].includes(question.answer);
  }).length;
  const keySizes = bank.map((question) => question.codeKey.length);
  return {
    ...base,
    semanticAmbiguityCount,
    malformedLearnerExplanationCount,
    redundantRelationQualifierCount,
    ql034AnswerMentionedInTargetCount,
    ql034MaximumStatementCount: Math.max(...statementCounts),
    ql034AverageStatementCount: Number((statementCounts.reduce((sum, value) => sum + value, 0) / statementCounts.length).toFixed(3)),
    maximumDisplayedCodeKeySize: Math.max(...keySizes),
    averageDisplayedCodeKeySize: Number((keySizes.reduce((sum, value) => sum + value, 0) / keySizes.length).toFixed(3)),
  };
}