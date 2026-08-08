import type { GeneratedBlrCp007EditorialV4Question } from "./cp007-editorial-v4-model";
import {
  remodelQl031 as remodelQl031Base,
  remodelQl032 as remodelQl032Base,
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

export function remodelQl031(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
): GeneratedBlrCp007EditorialV4Question {
  return remodelQl031Base(collisionSafeQuestion(question), codeKey);
}

export function remodelQl032(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
): GeneratedBlrCp007EditorialV4Question {
  return remodelQl032Base(collisionSafeQuestion(question), codeKey);
}
