export type ClusterPresentationMode = "DIRECT_COMPLETION" | "PAIR_SELECTION";

const RULE_FAMILIES = [
  ["Uniform forward shift", "CLUSTER_UNIFORM_SHIFT_FORWARD"],
  ["Uniform backward shift", "CLUSTER_UNIFORM_SHIFT_BACKWARD"],
  ["Fixed position-dependent shifts", "CLUSTER_POSITIONAL_FIXED_SHIFTS"],
  ["Alternating positive and negative shifts", "CLUSTER_ALTERNATING_SIGN_SHIFT"],
  ["Increasing positional shifts", "CLUSTER_INCREASING_SHIFT"],
  ["Decreasing positional shifts", "CLUSTER_DECREASING_SHIFT"],
  ["Reverse complete cluster", "CLUSTER_REVERSE"],
  ["Exchange adjacent letter pairs", "CLUSTER_ADJACENT_PAIR_SWAP"],
  ["Exchange first and last letters", "CLUSTER_FIRST_LAST_SWAP"],
  ["Rotate cluster to the left", "CLUSTER_ROTATE_LEFT"],
  ["Rotate cluster to the right", "CLUSTER_ROTATE_RIGHT"],
  ["Replace by opposite alphabet letters", "CLUSTER_OPPOSITE_SUBSTITUTION"],
  ["Transform odd positions", "CLUSTER_ODD_POSITION_TRANSFORM"],
  ["Transform even positions", "CLUSTER_EVEN_POSITION_TRANSFORM"],
  ["Reverse then apply positional shifts", "CLUSTER_REVERSE_THEN_SHIFT"],
  ["Apply positional shifts then reverse", "CLUSTER_SHIFT_THEN_REVERSE"],
  ["Delete a named position", "CLUSTER_DELETE_POSITION"],
  ["Insert a derived letter", "CLUSTER_INSERT_DERIVED_LETTER"],
  ["Expand letters to alphabet neighbours", "CLUSTER_NEIGHBOUR_EXPANSION"],
  ["Two-stage mixed cluster transform", "CLUSTER_TWO_STAGE_MIXED"],
  ["Exchange equal outer blocks", "CLUSTER_HALF_BLOCK_SWAP"],
  ["Reverse each half or outer block", "CLUSTER_REVERSE_EACH_BLOCK"],
  ["Regroup odd and even positions", "CLUSTER_PARITY_REGROUP"],
  ["Arrange letters alphabetically", "CLUSTER_ALPHABETICAL_SORT"],
] as const;

export type AnaCp006RuleId = (typeof RULE_FAMILIES)[number][1];

export const ANA_CP006_QLS = RULE_FAMILIES.flatMap(([title, ruleId], familyIndex) =>
  (["DIRECT_COMPLETION", "PAIR_SELECTION"] as const).map((presentationMode, modeIndex) => {
    const qlNumber = 161 + familyIndex * 2 + modeIndex;
    return {
      qlId: `ANA-QL-${String(qlNumber).padStart(3, "0")}`,
      cpId: "ANA-CP-006",
      title: `${title} — ${presentationMode === "DIRECT_COMPLETION" ? "direct completion" : "pair selection"}`,
      taskKind: "letterClusterTransform",
      solveMode: "CLUSTER_RULE",
      ruleId,
      presentationMode: presentationMode as ClusterPresentationMode,
      difficultyBand: presentationMode === "PAIR_SELECTION"
        ? "HARD"
        : familyIndex < 2 || [6, 7, 8, 9, 10, 11].includes(familyIndex)
          ? "EASY_TO_MEDIUM"
          : familyIndex >= 14 && familyIndex <= 19
            ? "MEDIUM_TO_HARD"
            : "MEDIUM",
      answerType: presentationMode === "DIRECT_COMPLETION" ? "LETTER_CLUSTER" : "LETTER_CLUSTER_PAIR",
      requiredDatasets: ["alphabet.core"] as const,
      requiredVariables: ["sourceCluster", "ruleParams", "targetCluster"] as const,
      distractorKinds: ["partialTransform", "wrongOrder", "wrongDirection"] as const,
      renderer: "STRUCTURED_TEXT",
      localeMode: "TRANSLATABLE",
      implementationCheckpoint: "ANA-CP-006",
      status: "IMPLEMENTED" as const,
    };
  }),
);

export type AnaCp006Ql = (typeof ANA_CP006_QLS)[number];

export function anaCp006QlById(qlId: string): AnaCp006Ql {
  const ql = ANA_CP006_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ANA-CP-006 QL: ${qlId}`);
  return ql;
}
