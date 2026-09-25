export const DIR_CP001_RULES = [
  {
    ruleId: "DIR_ORIENTATION_SEQUENCE_FORWARD",
    label: "Final facing after an ordered turn sequence",
    answerDemand: "FINAL_FACING",
    solverCapabilities: ["COMPOSE_ROTATIONS"],
  },
  {
    ruleId: "DIR_ORIENTATION_SEQUENCE_INVERSE",
    label: "Initial facing reconstructed from final facing and turns",
    answerDemand: "INITIAL_FACING",
    solverCapabilities: ["COMPOSE_ROTATIONS", "INVERT_ROTATION_SEQUENCE"],
  },
  {
    ruleId: "DIR_RELATIVE_TURN_RECONSTRUCTION",
    label: "Missing relative turn reconstructed from initial and final facing",
    answerDemand: "MISSING_TURN",
    solverCapabilities: ["TEST_CANDIDATE_ROTATIONS", "PROVE_UNIQUE_ROTATION"],
  },
] as const;

export type DirCp001RuleId = (typeof DIR_CP001_RULES)[number]["ruleId"];

export function dirCp001Rule(ruleId: string): (typeof DIR_CP001_RULES)[number] {
  const rule = DIR_CP001_RULES.find((candidate) => candidate.ruleId === ruleId);
  if (!rule) {
    throw new Error(`Unknown DIR-CP-001 rule: ${ruleId}`);
  }
  return rule;
}
