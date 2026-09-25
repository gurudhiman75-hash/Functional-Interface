export const DIR_CP002_RULES = [
  {
    ruleId: "DIR_PATH_ENDPOINT_DIRECTION",
    label: "Endpoint direction after an ordered path",
    solverCapabilities: ["EVALUATE_ORDERED_PATH", "CLASSIFY_ENDPOINT_VECTOR", "REVERSE_QUERY_REFERENCE"],
  },
  {
    ruleId: "DIR_PATH_ENDPOINT_AND_FACING",
    label: "Endpoint direction and final facing after an ordered path",
    solverCapabilities: ["EVALUATE_ORDERED_PATH", "CLASSIFY_ENDPOINT_VECTOR", "TRACK_FINAL_FACING"],
  },
] as const;

export type DirCp002RuleId = (typeof DIR_CP002_RULES)[number]["ruleId"];
