const rows = [
  ["COLUMNWISE_FIXED_CLUSTER_MOVEMENT", "A/B/C", "next, missing, previous, wrong, next-two, missing-two, wrong→replacement", "covered; mirror/complement collision still open"],
  ["COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT", "A", "next, missing, previous, wrong", "covered for progressive position jumps"],
  ["TWO_INTERLEAVED_CLUSTER_SERIES", "A/B/C", "next, missing, previous, wrong, next-two", "covered"],
  ["K_INTERLEAVED_CLUSTER_SERIES", "C", "next, missing, previous, wrong", "partial; k=3 proved, k=4 open"],
  ["CYCLIC_CLUSTER_PERMUTATION", "A/C", "next, missing, previous, wrong, next-two", "partial; non-rotational permutations open"],
  ["EDGE_DELETION_WORD_SEQUENCE", "A/C", "next, missing, wrong, next-two", "covered for front/end/alternating edge deletion"],
  ["VARIABLE_LENGTH_CONSECUTIVE_CLUSTER", "A", "next, missing, wrong", "covered for shrinking consecutive groups"],
  ["GROWING_CONSECUTIVE_CLUSTER", "B/C", "next, missing, previous, wrong, next-two", "covered"],
  ["CUMULATIVE_PREFIX_CLUSTER", "B", "next, missing, previous, wrong", "covered for suffix addition; interior insertion open"],
  ["SYMMETRIC_EDGE_GROWTH", "B/C", "next, missing, previous, wrong, next-two", "covered for two-edge growth"],
  ["REPEATED_BLOCK_COMPLETION", "A/B", "flat gaps, grouped gaps", "covered"],
  ["ALTERNATING_BLOCK_COMPLETION", "A/B", "flat gaps, grouped gaps", "covered"],
] as const;

const lines = [
  "# SER-CP-007 provisional authority matrix",
  "",
  "| Authority | Waves | Executable tasks | Gap state |",
  "|---|---:|---|---|",
  ...rows.map(([authority, waves, tasks, state]) =>
    `| \`${authority}\` | ${waves} | ${tasks} | ${state} |`,
  ),
  "",
  "## Freeze result",
  "",
  "```text",
  "English discovery freeze: BLOCKED",
  "Permanent QLs:            0",
  "Next wave:                permutation, complement, insertion and k-row saturation",
  "```",
  "",
];

console.log(lines.join("\n"));
