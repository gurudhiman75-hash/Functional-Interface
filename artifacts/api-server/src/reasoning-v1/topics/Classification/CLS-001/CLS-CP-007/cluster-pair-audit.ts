import { clsCp007ParsePairOption } from "./cluster-pair-domain";
import { auditClsCp007PairItems } from "./cluster-pair-runtime";
import type {
  ClsCp007PairAmbiguityAudit,
  GeneratedClsCp007PairQuestion,
} from "./cluster-pair-types";

export function independentlyVerifyClsCp007PairQuestion(
  question: GeneratedClsCp007PairQuestion,
): ClsCp007PairAmbiguityAudit {
  const reparsed = question.options.map(clsCp007ParsePairOption);
  return auditClsCp007PairItems(
    reparsed,
    question.intendedRuleId,
    question.correctIndex,
  );
}
