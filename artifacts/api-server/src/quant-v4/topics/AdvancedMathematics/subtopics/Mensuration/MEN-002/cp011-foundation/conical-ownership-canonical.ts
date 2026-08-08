import {
  MEN_CP011_CONICAL_OWNERSHIP_AUTHORITY,
  MEN_CP011_CONICAL_OWNERSHIP_FIXTURES,
  classifyMenCp011ConicalScenario as classifyDraftScenario,
  type MenCp011ConicalOwnershipDecision,
  type MenCp011ConicalScenario,
} from "./conical-ownership.ts";

export {
  MEN_CP011_CONICAL_OWNERSHIP_AUTHORITY,
  MEN_CP011_CONICAL_OWNERSHIP_FIXTURES,
};

export type {
  MenCp011ConeDimensions,
  MenCp011ConicalOwner,
  MenCp011ConicalOwnershipDecision,
  MenCp011ConicalRelation,
  MenCp011ConicalScenario,
  MenCp011ConicalTask,
} from "./conical-ownership.ts";

export function classifyMenCp011ConicalScenario(
  scenario: MenCp011ConicalScenario,
): MenCp011ConicalOwnershipDecision {
  const draft = classifyDraftScenario(scenario);
  if (draft.executable || draft.owner === "REJECT_UNDERSPECIFIED") {
    return draft;
  }
  return {
    ...draft,
    owner: "REJECT_UNDERSPECIFIED",
    reason: `Rejected before implementation: ${draft.reason}`,
  };
}
