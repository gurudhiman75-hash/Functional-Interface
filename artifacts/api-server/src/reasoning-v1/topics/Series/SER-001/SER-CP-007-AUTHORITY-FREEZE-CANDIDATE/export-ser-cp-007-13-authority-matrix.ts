import {
  SER_CP007_TEMPORARY_TEMPLATES,
} from "../SER-CP-007/foundation";
import {
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATES,
} from "../SER-CP-007-WAVE-B/foundation-expanded";
import {
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATES,
} from "../SER-CP-007-WAVE-C/foundation-refined";
import {
  SER_CP007_WAVE_D_TEMPORARY_TEMPLATES,
} from "../SER-CP-007-WAVE-D/foundation";
import {
  SER_CP007_WAVE_E_TEMPORARY_TEMPLATES,
} from "../SER-CP-007-WAVE-E/foundation";
import {
  editorialTaskKindFor,
  proofModelFor,
} from "../SER-CP-007-ENGLISH-REMODEL/adaptive-review";

type TemplateRow = {
  readonly temporaryTemplateId: string;
  readonly originalAuthorityId: string;
  readonly sourceRuleId: string;
  readonly taskKind: string;
};

const rows: TemplateRow[] = [
  ...SER_CP007_TEMPORARY_TEMPLATES,
  ...SER_CP007_WAVE_B_TEMPORARY_TEMPLATES,
  ...SER_CP007_WAVE_C_TEMPORARY_TEMPLATES,
  ...SER_CP007_WAVE_D_TEMPORARY_TEMPLATES,
  ...SER_CP007_WAVE_E_TEMPORARY_TEMPLATES,
].map((template) => ({
  temporaryTemplateId: template.temporaryTemplateId,
  originalAuthorityId: template.canonicalAuthorityId,
  sourceRuleId: template.sourceRuleId,
  taskKind: editorialTaskKindFor(template.taskKind),
}));

const candidateAuthorityFor: Readonly<Record<string, string>> = {
  ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE:
    "ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE",
  ALTERNATING_BLOCK_COMPLETION: "PERIODIC_BLOCK_COMPLETION",
  COLUMNWISE_FIXED_CLUSTER_MOVEMENT: "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
  COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT:
    "COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT",
  CUMULATIVE_PREFIX_CLUSTER: "CUMULATIVE_PREFIX_CLUSTER",
  CYCLIC_CLUSTER_PERMUTATION: "POSITION_PERMUTATION_CLUSTER",
  EDGE_DELETION_WORD_SEQUENCE: "EDGE_DELETION_WORD_SEQUENCE",
  FIXED_POSITION_PERMUTATION_CLUSTER: "POSITION_PERMUTATION_CLUSTER",
  GROWING_CONSECUTIVE_CLUSTER: "DIRECTIONAL_CONSECUTIVE_CLUSTER",
  K_INTERLEAVED_CLUSTER_SERIES: "INTERLEAVED_CLUSTER_SERIES",
  MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME:
    "MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME",
  PATTERNED_INTERIOR_INSERTION_GROWTH:
    "PATTERNED_INTERIOR_INSERTION_GROWTH",
  PROGRESSIVE_POSITIONAL_SUBSTITUTION:
    "PROGRESSIVE_POSITIONAL_SUBSTITUTION",
  REPEATED_BLOCK_COMPLETION: "PERIODIC_BLOCK_COMPLETION",
  SYMMETRIC_EDGE_GROWTH: "SYMMETRIC_EDGE_GROWTH",
  TWO_INTERLEAVED_CLUSTER_SERIES: "INTERLEAVED_CLUSTER_SERIES",
  VARIABLE_LENGTH_CONSECUTIVE_CLUSTER:
    "DIRECTIONAL_CONSECUTIVE_CLUSTER",
};

function subtypeFor(row: TemplateRow): string {
  switch (row.sourceRuleId) {
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
      return row.sourceRuleId;
  }
}

const grouped = new Map<string, TemplateRow[]>();
for (const row of rows) {
  const candidateAuthorityId = candidateAuthorityFor[row.originalAuthorityId];
  if (!candidateAuthorityId) {
    throw new Error(`Missing candidate authority for ${row.originalAuthorityId}`);
  }
  const group = grouped.get(candidateAuthorityId) ?? [];
  group.push(row);
  grouped.set(candidateAuthorityId, group);
}

if (rows.length !== 140) throw new Error(`Expected 140 templates, found ${rows.length}`);
if (grouped.size !== 13) throw new Error(`Expected 13 candidates, found ${grouped.size}`);

const lines: string[] = [
  "# SER-CP-007 contract-first 13-authority decision matrix",
  "",
  "This matrix preserves the 17 discovery authorities and all 140 temporary templates beneath the recommended 13 solve contracts.",
  "",
  "| Candidate authority | Source authorities | Proof model | Templates | Editorial tasks | Subtypes / source rules | Decision |",
  "|---|---|---|---:|---|---|---|",
];

for (const [candidateAuthorityId, candidateRows] of [...grouped.entries()].sort(
  ([left], [right]) => left.localeCompare(right),
)) {
  const sourceAuthorities = [
    ...new Set(candidateRows.map((row) => row.originalAuthorityId)),
  ].sort();
  const proofModels = [...new Set(sourceAuthorities.map(proofModelFor))].sort();
  const taskCounts = new Map<string, number>();
  for (const row of candidateRows) {
    taskCounts.set(row.taskKind, (taskCounts.get(row.taskKind) ?? 0) + 1);
  }
  const tasks = [...taskCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([task, count]) => `${task} (${count})`)
    .join("<br>");
  const subtypes = [...new Set(candidateRows.map(subtypeFor))].sort().join("<br>");
  lines.push(
    `| \`${candidateAuthorityId}\` | ${sourceAuthorities
      .map((authority) => `\`${authority}\``)
      .join("<br>")} | ${proofModels.join("<br>")} | ${candidateRows.length} | ${tasks} | ${subtypes} | [ ] Retain [ ] Reject merge [ ] Split |`,
  );
}

lines.push(
  "",
  "## Detailed template trace",
  "",
);

for (const [candidateAuthorityId, candidateRows] of [...grouped.entries()].sort(
  ([left], [right]) => left.localeCompare(right),
)) {
  lines.push(`### ${candidateAuthorityId}`, "", "| Template | Original authority | Editorial task | Subtype / source rule |", "|---|---|---|---|");
  for (const row of candidateRows.sort((left, right) =>
    left.temporaryTemplateId.localeCompare(right.temporaryTemplateId),
  )) {
    lines.push(
      `| \`${row.temporaryTemplateId}\` | \`${row.originalAuthorityId}\` | ${row.taskKind} | \`${subtypeFor(row)}\` |`,
    );
  }
  lines.push(
    "",
    "Authority review:",
    "",
    "- [ ] Mathematical invariant is one contract",
    "- [ ] Subtypes remain distinguishable",
    "- [ ] Learner renderer remains subtype-appropriate",
    "- [ ] Distractors remain misconception-specific",
    "- [ ] Source and weighting metadata remain intact",
    "- [ ] Recoverability remains enforced per template",
    "- [ ] Merge approved",
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
  "# Final policy decision",
  "",
  "```text",
  `Candidate authorities: ${grouped.size}`,
  `Original authorities:  ${new Set(rows.map((row) => row.originalAuthorityId)).size}`,
  `Templates:             ${rows.length}`,
  "Permanent QLs:        0",
  "```",
  "",
  "- [ ] Adopt 13-authority contract-first policy",
  "- [ ] Use 14-authority fallback",
  "- [ ] Require another split/merge pass",
  "- [ ] Full English V2 pack approved",
  "- [ ] Production metadata preservation approved",
  "- [ ] Permanent freeze may begin",
  "",
  "Final notes:",
  "",
  "> ",
);

console.log(lines.join("\n"));
