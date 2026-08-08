import type { GeneratedBlrCp007EditorialV4Question } from "./cp007-editorial-v4-model";
import {
  remodelQl031 as remodelQl031Base,
  remodelQl032 as remodelQl032Base,
  targetSentence as targetSentenceBase,
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
} from "./cp007-editorial-v4-wave3-core";

function renameSourcePerson(
  question: GeneratedBlrCp007EditorialV4Question,
  from: string,
  to: string,
): GeneratedBlrCp007EditorialV4Question {
  const people = new Set(question.completedStatements.flatMap((statement) => [statement.leftId, statement.rightId]));
  if (!people.has(from)) return question;
  const replace = (value: string): string => value.replace(new RegExp(`\\b${from}\\b`, "g"), to);
  const remap = (value: unknown): unknown => {
    if (typeof value === "string") return replace(value);
    if (Array.isArray(value)) return value.map(remap);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, remap(entry)]));
  };
  return remap(question) as GeneratedBlrCp007EditorialV4Question;
}

function collisionSafeQuestion(
  question: GeneratedBlrCp007EditorialV4Question,
): GeneratedBlrCp007EditorialV4Question {
  const requiresEvidence = question.sourcePrototypeId.includes("DIRECT-REVERSE") ||
    question.sourcePrototypeId.includes("MISSING-TOKEN-REVERSE");
  return requiresEvidence ? renameSourcePerson(question, "G", "G0") : question;
}

function ql031Stem(question: GeneratedBlrCp007EditorialV4Question): string {
  if (question.query.kind !== "SELECT_EXPRESSION") return question.stem;
  const target = targetSentenceBase(question.query.target);
  const prototype = question.sourcePrototypeId;
  if (prototype.includes("SELECT-DIRECT-FORWARD")) {
    return `Which left-to-right coded statement shows that ${target}?`;
  }
  if (prototype.includes("SELECT-DIRECT-REVERSE")) {
    return `Which coded statement, after applying the inverse relation, shows that ${target}?`;
  }
  if (prototype.includes("SELECT-TWO-LINK-FORWARD")) {
    return `Which two-link coded family chain establishes that ${target}?`;
  }
  if (prototype.includes("SELECT-TWO-LINK-REVERSE")) {
    return `Which two-link coded chain, with both relation directions checked, establishes that ${target}?`;
  }
  if (prototype.includes("SELECT-THREE-LINK")) {
    return `Which three-link coded family chain establishes that ${target}?`;
  }
  return `Which coded chain correctly establishes the marriage-based relation that ${target}?`;
}

export function remodelQl031(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
): GeneratedBlrCp007EditorialV4Question {
  const remodelled = remodelQl031Base(collisionSafeQuestion(question), codeKey);
  return { ...remodelled, stem: ql031Stem(remodelled) };
}

export function remodelQl032(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
): GeneratedBlrCp007EditorialV4Question {
  return remodelQl032Base(collisionSafeQuestion(question), codeKey);
}