import type { BlrCp001ReviewQuestion } from "./cp001-review-registry";

const GREAT_GENERATION_SHORTCUTS: Readonly<Record<string, string>> = {
  GREAT_GRANDFATHER:
    "Three downward parent-to-child links from a male ancestor give great-grandfather; count +3 generations from the reference person.",
  GREAT_GRANDMOTHER:
    "Three downward parent-to-child links from a female ancestor give great-grandmother; count +3 generations from the reference person.",
  GREAT_GRANDSON:
    "Three upward child-to-parent links from a male descendant give great-grandson; count -3 generations from the reference person.",
  GREAT_GRANDDAUGHTER:
    "Three upward child-to-parent links from a female descendant give great-granddaughter; count -3 generations from the reference person.",
};

/**
 * Applies the learner-facing additions required by the second source/gap audit.
 * The mathematical graph, answer key and distractor identities remain untouched.
 */
export function applyCp001SecondGapEditorial(
  question: BlrCp001ReviewQuestion,
): BlrCp001ReviewQuestion {
  const relationId =
    typeof question.metadata.relationId === "string"
      ? question.metadata.relationId
      : null;
  const shortcut = relationId ? GREAT_GENERATION_SHORTCUTS[relationId] : null;
  if (!shortcut) return question;

  const existingCore = question.explanation.coreConcept ?? [];
  const generationRule =
    "Great-generation rule: three parent-child moves separate the two people, so the generation difference must be exactly 3 before gender selects the final title.";

  return {
    ...question,
    explanation: {
      ...question.explanation,
      coreConcept: existingCore.includes(generationRule)
        ? existingCore
        : [...existingCore, generationRule],
      examShortcut: shortcut,
    },
    metadata: {
      ...question.metadata,
      sourceGapAuditVersion: "blr-cp001-second-gap-v1",
    },
  };
}
