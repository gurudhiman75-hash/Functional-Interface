export const DIR_CP003_RULES = [
  {
    ruleId: "DIR_SHORTEST_DISPLACEMENT",
    label: "Shortest distance after an ordered path",
    solverCapabilities: ["EVALUATE_ORDERED_PATH", "COMPUTE_NET_COMPONENTS", "COMPUTE_EXACT_DISPLACEMENT"],
  },
  {
    ruleId: "DIR_DIRECTION_AND_DISPLACEMENT",
    label: "Endpoint direction and shortest distance after an ordered path",
    solverCapabilities: ["EVALUATE_ORDERED_PATH", "CLASSIFY_ENDPOINT_VECTOR", "COMPUTE_EXACT_DISPLACEMENT", "REVERSE_QUERY_REFERENCE"],
  },
  {
    ruleId: "DIR_TRAVEL_DISTANCE_VS_DISPLACEMENT",
    label: "Total distance travelled and shortest displacement",
    solverCapabilities: ["SUM_PATH_LENGTH", "COMPUTE_NET_COMPONENTS", "COMPUTE_EXACT_DISPLACEMENT"],
  },
  {
    ruleId: "DIR_MISSING_ORTHOGONAL_DISTANCE",
    label: "Recover one missing movement distance from a target endpoint",
    solverCapabilities: ["REPLAY_PARTIAL_PATH", "SOLVE_SINGLE_UNKNOWN_ORTHOGONAL_DISTANCE", "VERIFY_TARGET_ENDPOINT"],
  },
  {
    ruleId: "DIR_CONTROLLED_NON_INTEGER_DISPLACEMENT",
    label: "Controlled radical or rounded displacement",
    solverCapabilities: ["COMPUTE_NET_COMPONENTS", "SIMPLIFY_RADICAL_DISTANCE", "ROUND_AT_FINAL_DISPLAY"],
  },
] as const;

export type DirCp003RuleId = (typeof DIR_CP003_RULES)[number]["ruleId"];
