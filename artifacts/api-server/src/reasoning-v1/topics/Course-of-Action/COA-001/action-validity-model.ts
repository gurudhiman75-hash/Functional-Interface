import type { CoaActionAuthority, CoaAnswerClass, CoaVerdict } from "./types.ts";

export function evaluateCoaAction(action: CoaActionAuthority): CoaVerdict {
  if (action.relevance === "UNRELATED") return "DOES_NOT_FOLLOW";
  if (action.actionability !== "ACTIONABLE") return "DOES_NOT_FOLLOW";
  if (action.authorityFit === "OUTSIDE_SCOPE") return "DOES_NOT_FOLLOW";
  if (action.feasibility === "IMPOSSIBLE") return "DOES_NOT_FOLLOW";
  if (action.proportionality !== "PROPORTIONATE") return "DOES_NOT_FOLLOW";
  if (action.evidenceFit !== "SUPPORTED") return "DOES_NOT_FOLLOW";
  if (action.expectedUtility === "LOW" || action.expectedUtility === "HARMFUL") return "DOES_NOT_FOLLOW";
  if (action.urgencyFit === "MISMATCHED") return "DOES_NOT_FOLLOW";
  if (action.constraintFit === "VIOLATES") return "DOES_NOT_FOLLOW";
  if (action.sequenceFit === "WRONG_ORDER" || action.sequenceFit === "REDUNDANT_AFTER_PRIOR") return "DOES_NOT_FOLLOW";
  return "FOLLOWS";
}

export function answerClassForCoaActions(actions: readonly [CoaActionAuthority, CoaActionAuthority]): CoaAnswerClass {
  const first = evaluateCoaAction(actions[0]);
  const second = evaluateCoaAction(actions[1]);
  if (first === "FOLLOWS" && second === "FOLLOWS") return "BOTH";
  if (first === "FOLLOWS") return "ONLY_I";
  if (second === "FOLLOWS") return "ONLY_II";
  return "NEITHER";
}

export function assertCoaActionAuthorityConsistent(action: CoaActionAuthority): void {
  const actual = evaluateCoaAction(action);
  if (actual !== action.expectedVerdict) {
    throw new Error(`${action.id}: expected ${action.expectedVerdict}, semantic model returned ${actual}`);
  }
  if (action.reasonCodes.length === 0) {
    throw new Error(`${action.id}: at least one authored reason code is required`);
  }
  if (action.expectedVerdict === "FOLLOWS") {
    if (action.relevance === "UNRELATED" || action.actionability !== "ACTIONABLE" || action.authorityFit === "OUTSIDE_SCOPE") {
      throw new Error(`${action.id}: a following action cannot fail basic relevance/actionability/authority checks`);
    }
  }
}
