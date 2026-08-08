import {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
  SER_CP007_TEMPLATE_PROBES,
} from "./authority-compression-contract";
import {
  editorialTaskKindFor,
  proofModelFor,
} from "../SER-CP-007-ENGLISH-REMODEL/adaptive-review";

function subtypeFor(sourceRuleId: string): string {
  switch (sourceRuleId) {
    case "CYCLIC_CLUSTER_ROTATION":
    case "NEXT_TWO_ROTATION":
    case "UNIFORM_FRAME_CASE_MARKER_ROTATION":
      return "CYCLIC_ROTATION";
    case "PAIRWISE_ADJACENT_SWAP_PERMUTATION":
      return "PAIRWISE_ADJACENT_SWAP";
    case "FULL_REVERSAL_PERMUTATION":
      return "FULL_REVERSAL";
    case "ODD_EVEN_POSITION_REORDERING":
      return "ODD_EVEN_REORDER";
    default:
      return sourceRuleId;
  }
}

const grouped = new Map<string, typeof SER_CP007_TEMPLATE_PROBES[number][]>();
for (const probe of SER_CP007_TEMPLATE_PROBES) {
  const candidateAuthorityId =
    SER_CP007_CANDIDATE_13_MAP[probe.originalAuthorityId];
  const group = grouped.get(candidateAuthorityId) ?? [];
  group.push(probe);
  grouped.set(candidateAuthorityId, group);
}

if (SER_CP007_DISCOVERY_AUTHORITY_IDS.length !== 17) {
  throw new Error("Expected 17 discovery authorities.");
}
if (SER_CP007_TEMPLATE_PROBES.length !== 140) {
  throw new Error("Expected 140 temporary templates.");
}
if (grouped.size !== 13) throw new Error("Expected 13 candidate authorities.");

const lines: string[] = [
  "# SER-CP-007 corrected 13-authority decision matrix",
  "",
  "The matrix preserves all 17 discovery authorities and 140 temporary templates beneath the recommended 13 solve contracts.",
  "",
  "| Candidate authority | Source authorities | Proof model | Templates | Editorial tasks | Subtypes / source rules | Decision |",
  "|---|---|---|---:|---|---|---|",
];

for (const [candidateAuthorityId, probes] of [...grouped.entries()].sort(
  ([left], [right]) => left.localeCompare(right),
)) {
  const sourceAuthorities = [
    ...new Set(probes.map((probe) => probe.originalAuthorityId)),
  ].sort();
  const proofModels = [...new Set(sourceAuthorities.map(proofModelFor))].sort();
  const taskCounts = new Map<string, number>();
  for (const probe of probes) {
    const task = editorialTaskKindFor(probe.taskKind);
    taskCounts.set(task, (taskCounts.get(task) ?? 0) + 1);
  }
  const tasks = [...taskCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([task, count]) => `${task} (${count})`)
    .join("<br>");
  const subtypes = [...new Set(probes.map((probe) => subtypeFor(probe.sourceRuleId)))]
    .sort()
    .join("<br>");
  lines.push(
    `| \`${candidateAuthorityId}\` | ${sourceAuthorities
      .map((authority) => `\`${authority}\``)
      .join("<br>")} | ${proofModels.join("<br>")} | ${probes.length} | ${tasks} | ${subtypes} | [ ] Retain [ ] Reject merge [ ] Split |`,
  );
}

lines.push("", "## Detailed trace", "");

for (const [candidateAuthorityId, probes] of [...grouped.entries()].sort(
  ([left], [right]) => left.localeCompare(right),
)) {
  lines.push(
    `### ${candidateAuthorityId}`,
    "",
    "| Template | Wave | Original authority | Editorial task | Subtype / source rule |",
    "|---|---|---|---|---|",
  );
  for (const probe of [...probes].sort((left, right) =>
    left.temporaryTemplateId.localeCompare(right.temporaryTemplateId),
  )) {
    lines.push(
      `| \`${probe.temporaryTemplateId}\` | ${probe.waveId} | \`${probe.originalAuthorityId}\` | ${editorialTaskKindFor(probe.taskKind)} | \`${subtypeFor(probe.sourceRuleId)}\` |`,
    );
  }
  lines.push(
    "",
    "Review:",
    "",
    "- [ ] One mathematical invariant",
    "- [ ] Subtypes remain distinguishable",
    "- [ ] Learner renderer remains subtype-appropriate",
    "- [ ] Distractors remain misconception-specific",
    "- [ ] Source and weighting metadata remain intact",
    "- [ ] Recoverability remains enforced per template",
    "- [ ] Merge/retention approved",
    "",
    "Notes:",
    "",
    "> ",
    "",
    "---",
    "",
  );
}

lines.push(
  "# Final decision",
  "",
  "```text",
  `Candidate authorities: ${grouped.size}`,
  `Original authorities:  ${SER_CP007_DISCOVERY_AUTHORITY_IDS.length}`,
  `Templates:             ${SER_CP007_TEMPLATE_PROBES.length}`,
  "Permanent QLs:        0",
  "```",
  "",
  "- [ ] Adopt 13-authority contract-first policy",
  "- [ ] Use 14-authority fallback",
  "- [ ] Require another split/merge pass",
  "- [ ] Full English V2 pack approved",
  "- [ ] Real metadata preservation approved",
  "- [ ] Permanent freeze may begin",
  "",
  "Final notes:",
  "",
  "> ",
);

console.log(lines.join("\n"));
