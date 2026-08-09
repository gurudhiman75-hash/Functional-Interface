import type { GeneratedBlrCp007EditorialV4Question } from "./cp007-editorial-v4-model";
import {
  remodelQl031 as remodelQl031Base,
  remodelQl032 as remodelQl032Base,
  remodelQl033 as remodelQl033Base,
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

function ql031Guidance(prototype: string): { shortcut: string; commonTrap: string } {
  if (prototype.includes("DIRECT-FORWARD")) return {
    shortcut: "Match the subject, direct relation and reference person in the same left-to-right order.",
    commonTrap: "A symbol with the right family meaning is still wrong if the two people are reversed.",
  };
  if (prototype.includes("DIRECT-REVERSE")) return {
    shortcut: "Translate the target into its inverse statement before comparing the options.",
    commonTrap: "Father/son, mother/daughter and husband/wife reverse into different direct relations.",
  };
  if (prototype.includes("TWO-LINK-FORWARD")) return {
    shortcut: "Trace the first link into the second and compare the resulting two-generation relation.",
    commonTrap: "Do not accept an option merely because its first coded link is correct.",
  };
  if (prototype.includes("TWO-LINK-REVERSE")) return {
    shortcut: "Check both link meanings and both directions before naming the final relation.",
    commonTrap: "Reversing either link can change parent-in-law into child-in-law or break the path.",
  };
  if (prototype.includes("THREE-LINK")) return {
    shortcut: "Follow the three-person path in order and ignore any option that changes a middle link.",
    commonTrap: "A correct first and last link cannot repair an incorrect middle relationship.",
  };
  return {
    shortcut: "Mark the marriage link first, then connect the blood relation on the correct side.",
    commonTrap: "Do not confuse sibling-of-spouse with spouse-of-sibling; both are in-law routes but use different chains.",
  };
}

function ql032Guidance(prototype: string): { shortcut: string; commonTrap: string } {
  if (prototype.includes("MISSING-TOKEN-DIRECT")) return {
    shortcut: "Identify the direct relation required at the blank and select its symbol from the key.",
    commonTrap: "Keep the two people in their displayed order; the inverse relation uses a different symbol.",
  };
  if (prototype.includes("MISSING-TOKEN-REVERSE")) return {
    shortcut: "Rewrite the target as the inverse direct statement, then choose that symbol.",
    commonTrap: "The blank symbol names the inverse direct relation, not the final relation stated in the question.",
  };
  if (prototype.includes("FIRST-LINK")) return {
    shortcut: "Work backward from the final relation to determine the first link of the chain.",
    commonTrap: "Do not choose a symbol for the overall relation; only the missing first link is coded.",
  };
  return {
    shortcut: "Use the known first link to determine which second link produces the target relation.",
    commonTrap: "The missing symbol represents the second direct link, not the derived relation of the full chain.",
  };
}

function ql033Guidance(prototype: string): { shortcut: string; commonTrap: string } {
  if (prototype.includes("TWO-LINK")) return {
    shortcut: "Solve the first and second blanks separately, then verify the resulting two-link relation.",
    commonTrap: "An option is wrong even when one symbol is correct if the other blank breaks the chain.",
  };
  if (prototype.includes("THREE-LINK")) return {
    shortcut: "Fix the two missing positions, then trace all three links before selecting the pair.",
    commonTrap: "Do not swap the pair merely because both required symbols appear in the option.",
  };
  return {
    shortcut: "Identify the blood link and marriage link independently, then place them in blank order.",
    commonTrap: "In-law relations depend on which side of the marriage each blood relation belongs to.",
  };
}

export function remodelQl031(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
): GeneratedBlrCp007EditorialV4Question {
  const remodelled = remodelQl031Base(collisionSafeQuestion(question), codeKey);
  const guidance = ql031Guidance(question.sourcePrototypeId);
  return {
    ...remodelled,
    stem: ql031Stem(remodelled),
    explanation: { ...remodelled.explanation, ...guidance },
  };
}

export function remodelQl032(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
): GeneratedBlrCp007EditorialV4Question {
  const remodelled = remodelQl032Base(collisionSafeQuestion(question), codeKey);
  return {
    ...remodelled,
    explanation: { ...remodelled.explanation, ...ql032Guidance(question.sourcePrototypeId) },
  };
}

export function remodelQl033(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
): GeneratedBlrCp007EditorialV4Question {
  const remodelled = remodelQl033Base(question, codeKey);
  return {
    ...remodelled,
    explanation: { ...remodelled.explanation, ...ql033Guidance(question.sourcePrototypeId) },
  };
}