import { clsCp006ParseOption } from "./alphabet-domain";
import { auditClsCp006Items } from "./runtime";
import type {
  ClsCp006AmbiguityAudit,
  GeneratedClsCp006Question,
} from "./types";

export function independentlyVerifyClsCp006Question(
  question: GeneratedClsCp006Question,
): ClsCp006AmbiguityAudit {
  const reparsedItems = question.options.map(clsCp006ParseOption);
  return auditClsCp006Items(
    reparsedItems,
    question.intendedRuleId,
    question.correctIndex,
  );
}
