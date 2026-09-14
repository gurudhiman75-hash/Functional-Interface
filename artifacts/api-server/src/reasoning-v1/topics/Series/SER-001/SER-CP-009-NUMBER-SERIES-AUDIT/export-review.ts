import {
  generateSerCp009NumberSeries,
  SER_CP009_NUMBER_SERIES_QL_IDS,
} from "./number-series";

const authorityTitle: Record<(typeof SER_CP009_NUMBER_SERIES_QL_IDS)[number], string> = {
  "SER-QL-029": "Fixed difference",
  "SER-QL-030": "Progressive difference",
  "SER-QL-031": "Figurate differences",
  "SER-QL-032": "Constant multiplication/division",
  "SER-QL-033": "Alternating operations",
  "SER-QL-034": "Interleaved double series",
  "SER-QL-035": "Progressive multiplier with fixed adjustment",
  "SER-QL-036": "Direct square/cube series",
  "SER-QL-037": "Prime differences",
  "SER-QL-038": "Fibonacci-like recurrence",
  "SER-QL-039": "Digit-block rotation",
  "SER-QL-040": "Wrong term in power series",
  "SER-QL-041": "Grouped multi-missing series",
  "SER-QL-042": "Internal digit relation",
};

const lines: string[] = [
  "# SER-CP-009 — Pure Number Series manual review pack",
  "",
  "> Review-only provisional content. None of `SER-QL-029..042` is permanent or Question-Studio discoverable yet.",
  "",
  "Direct recent source anchors: SSC CGL 2022 `382, 322, 272, 232, 202, ?`; SSC CGL 2023 `232, 221, 199, ?, 122, 67`; SSC CGL 2024 `1, 3, 10, 41, ?, 1237`.",
  "",
];

for (const qlId of SER_CP009_NUMBER_SERIES_QL_IDS) {
  const seed = Number(qlId.slice(-3)) * 7 + 3;
  const question = generateSerCp009NumberSeries(qlId, seed, "en-IN");
  lines.push(`## ${qlId} — ${authorityTitle[qlId]}`);
  lines.push("");
  lines.push(`**Difficulty:** ${question.difficulty}  `);
  lines.push(`**Task:** ${question.taskKind}  `);
  lines.push(`**Seed:** ${question.seed}`);
  lines.push("");
  lines.push(question.stem);
  lines.push("");
  question.options.forEach((option, index) => {
    lines.push(`${String.fromCharCode(65 + index)}. ${option.value}${index === question.correctIndex ? " **✓**" : ""}`);
  });
  lines.push("");
  lines.push(`**Answer:** ${question.correctAnswer}`);
  lines.push("");
  lines.push("**Explanation**");
  for (const step of question.explanation) lines.push(`- ${step}`);
  lines.push("");
  lines.push(`**Structural metadata:** \`${JSON.stringify(question.structuralFeatures)}\``);
  lines.push("");
}

console.log(lines.join("\n"));
