import { clsCp007ParseOption } from "./cluster-domain";
import { auditClsCp007Items } from "./runtime";
import type {
  ClsCp007AmbiguityAudit,
  GeneratedClsCp007Question,
} from "./types";

export function independentlyVerifyClsCp007Question(
  question: GeneratedClsCp007Question,
): ClsCp007AmbiguityAudit {
  const reparsedItems = question.options.map(clsCp007ParseOption);
  return auditClsCp007Items(
    reparsedItems,
    question.intendedRuleId,
    question.correctIndex,
  );
}
