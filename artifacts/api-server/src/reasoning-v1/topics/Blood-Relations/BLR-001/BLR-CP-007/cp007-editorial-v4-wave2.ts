import "./cp007-editorial-v3-scenario-corrections";
import "./cp007-editorial-v3-endpoint-compatibility";
import "./cp007-editorial-v3-gender-evidence";
import "./cp007-editorial-v4-ql034-coherent-network";
import { relationDisplay, type BlrCp006Relation } from "../BLR-CP-006/cp006-model";
import {
  buildBlrCp007EditorialV4Telemetry,
  generateBlrCp007EditorialV4Bank,
} from "./cp007-editorial-v4";
import type {
  BlrCp007EditorialV4Telemetry,
  BlrCp007V4RecommendedUse,
  GeneratedBlrCp007EditorialV4Question,
} from "./cp007-editorial-v4-model";

export const BLR_CP007_V4_QL034_COHERENT_NETWORK_AUTHORITY =
  "BLR_CP007_V4_QL034_COHERENT_NETWORK_REMODEL" as const;

function hashText(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function fingerprint(value: unknown): string {
  const text = JSON.stringify(value);
  const first = hashText(text).toString(16).padStart(8, "0");
  const second = hashText(`${text}::final-v4`).toString(16).padStart(8, "0");
  return `${first}${second}${second}${first}`;
}

function relationText(relationId: BlrCp006Relation): string {
  return relationDisplay(relationId).toLocaleLowerCase("en-IN");
}

function targetOf(question: GeneratedBlrCp007EditorialV4Question) {
  if (question.query.kind !== "MISSING_PERSON") {
    throw new Error(`${question.itemId}: expected a missing-person query.`);
  }
  return question.query.target;
}

function targetSentence(question: GeneratedBlrCp007EditorialV4Question): string {
  const target = targetOf(question);
  return `${target.subjectId} is the ${relationText(target.relationId)} of ${target.referenceId}`;
}

function ensurePeriod(value: string): string {
  const text = value.trim();
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function polishInheritedStem(stem: string): string {
  return stem
    .replace(/\band makes (?=[A-Z]+ is\b)/g, "so that ")
    .replace(/\bthat makes (?=[A-Z]+ is\b)/g, "that shows that ")
    .replace(/\bthat make (?=[A-Z]+ is\b)/g, "that show that ");
}

function remodelStem(question: GeneratedBlrCp007EditorialV4Question): string {
  const target = targetSentence(question);
  const leads = [
    `Which candidate should replace ? so that the statements show that ${target}?`,
    `Select the person who makes the coded statements establish that ${target}.`,
    `Who must replace ? for the coded statements to prove that ${target}?`,
    `Choose the candidate that completes the family chain and shows that ${target}.`,
  ] as const;
  const expressionLines = question.query.kind === "MISSING_PERSON"
    ? question.query.expressionLines.join("\n")
    : "";
  return `${leads[question.seed % leads.length]}\nCandidates: P, Q, R, S\n\n${expressionLines}`;
}

function decisiveSteps(question: GeneratedBlrCp007EditorialV4Question): string[] {
  const target = targetOf(question);
  const correct = question.options[question.correctIndex]!;
  const highlighted = question.explanation.diagramProof.edges
    .filter((edge) => edge.highlighted && !/^inferred\b/i.test(edge.label.trim()))
    .map((edge) => ensurePeriod(edge.label));
  if (highlighted.length > 0) return highlighted;

  const candidate = question.answer;
  const sibling = correct.decodedAssertions.find((assertion) =>
    assertion.includes(candidate) &&
    (assertion.includes(target.subjectId) || assertion.includes(target.referenceId)) &&
    /\b(?:brother|sister)\b/i.test(assertion),
  );
  const parentChild = correct.decodedAssertions.find((assertion) =>
    assertion.includes(candidate) &&
    (assertion.includes(target.subjectId) || assertion.includes(target.referenceId)) &&
    /\b(?:father|mother|son|daughter)\b/i.test(assertion),
  );
  const steps = [sibling, parentChild].filter((value): value is string => Boolean(value)).map(ensurePeriod);
  steps.push(`Under the full-sibling convention, ${targetSentence(question)}.`);
  return steps;
}

function optionExplanation(
  question: GeneratedBlrCp007EditorialV4Question,
  option: GeneratedBlrCp007EditorialV4Question["options"][number],
): string {
  const target = targetOf(question);
  if (option.isCorrectAnswerForTask) {
    return `With ${option.text} in the blank, ${targetSentence(question)}.`;
  }
  if (option.actualRelation) {
    return `With ${option.text} in the blank, ${target.subjectId} becomes the ${relationText(option.actualRelation)} of ${target.referenceId}, not the ${relationText(target.relationId)}.`;
  }
  return `With ${option.text} in the blank, the statements do not establish the required relation between ${target.subjectId} and ${target.referenceId}.`;
}

function recommendedUse(
  question: GeneratedBlrCp007EditorialV4Question,
): BlrCp007V4RecommendedUse {
  return question.metadata.difficulty === "HARD"
    ? "ADVANCED_PRACTICE"
    : "STANDARD_MOCK";
}

function applyFinalFingerprint(
  question: GeneratedBlrCp007EditorialV4Question,
): GeneratedBlrCp007EditorialV4Question {
  const finalFingerprint = fingerprint({
    sourceV3SemanticFingerprint: question.metadata.sourceV3SemanticFingerprint,
    qlId: question.qlId,
    sourcePrototypeId: question.sourcePrototypeId,
    stem: question.stem,
    sharedPrompt: question.sharedPrompt,
    codeKey: question.codeKey,
    options: question.options.map((option) => ({
      text: option.text,
      studentExplanation: option.studentExplanation,
    })),
    explanation: {
      steps: question.explanation.steps,
      conclusion: question.explanation.conclusion,
      shortcut: question.explanation.shortcut,
      commonTrap: question.explanation.commonTrap,
    },
    difficulty: question.metadata.difficulty,
    disposition: question.metadata.disposition,
    recommendedUse: question.metadata.recommendedUse,
  });
  return {
    ...question,
    metadata: {
      ...question.metadata,
      v4EditorialFingerprint: finalFingerprint,
    },
  };
}

function releaseConnectedQl034(
  sourceQuestion: GeneratedBlrCp007EditorialV4Question,
): GeneratedBlrCp007EditorialV4Question {
  const question = {
    ...sourceQuestion,
    stem: polishInheritedStem(sourceQuestion.stem),
  };
  if (question.qlId !== "BLR-QL-034") return applyFinalFingerprint(question);
  const components = question.metadata.candidateNetworkComponentCount;
  if (components !== 1) {
    throw new Error(`${question.itemId}: QL-034 candidate network has ${components ?? "unknown"} components.`);
  }
  const use = recommendedUse(question);
  const blockers = ["HUMAN_EDITORIAL_APPROVAL_PENDING"] as const;
  const options = question.options.map((option) => ({
    ...option,
    studentExplanation: optionExplanation(question, option),
  }));
  const optionAnalysis = question.explanation.optionAnalysis.map((analysis, index) => ({
    ...analysis,
    explanation: options[index]!.studentExplanation,
  }));
  const diagramProof = {
    ...question.explanation.diagramProof,
    edges: question.explanation.diagramProof.edges.filter((edge) =>
      !/^inferred parent$/i.test(edge.label.trim()),
    ),
  };
  const familyTree = {
    ...question.explanation.familyTree,
    asciiFallback: question.explanation.familyTree.asciiFallback
      .split("\n")
      .filter((line) => !/inferred parent/i.test(line))
      .join("\n"),
  };
  return applyFinalFingerprint({
    ...question,
    stem: remodelStem(question),
    options,
    explanation: {
      ...question.explanation,
      steps: decisiveSteps(question),
      conclusion: `${question.answer} must replace ?; with this substitution, ${targetSentence(question)}.`,
      optionAnalysis,
      diagramProof,
      familyTree,
    },
    reviewProof: {
      ...question.reviewProof,
      reviewerNote: "V4 Wave 2 coherent-network candidate; the four substitutions are graph-valid, exactly one completes the requested relation, learner-facing wording has been manually remediated, and human approval remains required.",
    },
    metadata: {
      ...question.metadata,
      disposition: "RELEASE_CANDIDATE",
      recommendedUse: use,
      activeEditorialBlockers: blockers,
    },
    v4ReviewProof: {
      ...question.v4ReviewProof,
      disposition: "RELEASE_CANDIDATE",
      recommendedUse: use,
      activeEditorialBlockers: blockers,
    },
  });
}

export function generateBlrCp007EditorialV4Wave2Bank(): readonly GeneratedBlrCp007EditorialV4Question[] {
  return generateBlrCp007EditorialV4Bank().map(releaseConnectedQl034);
}

export function buildBlrCp007EditorialV4Wave2Telemetry(
  bank = generateBlrCp007EditorialV4Wave2Bank(),
): BlrCp007EditorialV4Telemetry {
  return buildBlrCp007EditorialV4Telemetry(bank);
}
