import {
  SER_CP009_AUDITED_QL_IDS,
  SER_CP009_REJECTED_SOURCE_GAP,
  generateSerCp009AuditedNumberSeries,
} from "./number-series-audited";

const titles: Record<(typeof SER_CP009_AUDITED_QL_IDS)[number], string> = {
  "SER-QL-029": "Fixed difference",
  "SER-QL-030": "Progressive difference",
  "SER-QL-031": "Figurate differences",
  "SER-QL-032": "Constant multiplication/division",
  "SER-QL-033": "Alternating operations",
  "SER-QL-034": "Interleaved double series",
  "SER-QL-035": "Progressive multiplier + fixed adjustment",
  "SER-QL-036": "Direct square/cube series",
  "SER-QL-037": "Prime differences",
  "SER-QL-038": "Fibonacci-like recurrence",
  "SER-QL-039": "Digit-block rotation",
  "SER-QL-040": "Wrong term in power series",
  "SER-QL-041": "Grouped multi-missing series",
};

const lines = [
  "# SER-CP-009 — Audited SSC Reasoning Number Series review pack",
  "",
  "> Review-only provisional content. No QL in this pack is Question-Studio discoverable, Question-Bank writable, mock eligible or publicly publishable.",
  "",
  "## Final ownership decision",
  "",
  `- Audited Series candidates: \`${SER_CP009_AUDITED_QL_IDS[0]}..${SER_CP009_AUDITED_QL_IDS.at(-1)}\` (${SER_CP009_AUDITED_QL_IDS.length} QLs).`,
  `- \`${SER_CP009_REJECTED_SOURCE_GAP.qlId}\` is rejected: ${SER_CP009_REJECTED_SOURCE_GAP.reason}`,
  "- The rejected identity is not reserved and cannot be promoted from this checkpoint.",
  "",
  "## Recent SSC source anchors",
  "",
  "- SSC CGL 2022: `382, 322, 272, 232, 202, ?` → `182`.",
  "- SSC CGL 2023: `232, 221, 199, ?, 122, 67` → `166`.",
  "- SSC CGL 2024: `1, 3, 10, 41, ?, 1237` → `206`.",
  "",
  "This candidate is scoped to SSC Reasoning with four options. Banking Number Series / Speed Mathematics remains a separate five-option Banking owner.",
  "",
];

for (const qlId of SER_CP009_AUDITED_QL_IDS) {
  const seed = Number(qlId.slice(-3)) * 7 + 3;
  const q = generateSerCp009AuditedNumberSeries(qlId, seed, "en-IN");
  lines.push(`## ${qlId} — ${titles[qlId]}`);
  lines.push("");
  lines.push(`**Difficulty:** ${q.difficulty}  `);
  lines.push(`**Task:** ${q.taskKind}  `);
  lines.push(`**Seed:** ${q.seed}`);
  lines.push("");
  lines.push(q.stem);
  lines.push("");
  q.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option.value}${index === q.correctIndex ? " **✓**" : ""}`));
  lines.push("");
  lines.push(`**Answer:** ${q.correctAnswer}`);
  lines.push("");
  lines.push("**Explanation**");
  q.explanation.forEach((step) => lines.push(`- ${step}`));
  lines.push("");
  lines.push(`**Structural metadata:** \`${JSON.stringify(q.structuralFeatures)}\``);
  lines.push("");
}

console.log(lines.join("\n"));
