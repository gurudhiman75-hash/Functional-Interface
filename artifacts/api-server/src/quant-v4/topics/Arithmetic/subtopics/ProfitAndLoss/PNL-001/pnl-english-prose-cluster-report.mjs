import fs from "node:fs";
import path from "node:path";

const root = path.resolve(
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001",
);
const output = path.resolve(
  "dist/quant-v4/pnl-001-english-editorial-audit",
);
const findings = JSON.parse(
  fs.readFileSync(
    path.join(output, "pnl-001-english-editorial-findings.json"),
    "utf8",
  ),
);
const metrics = JSON.parse(
  fs.readFileSync(
    path.join(output, "pnl-001-english-editorial-metrics.json"),
    "utf8",
  ),
);

if (findings.fatalFindings.length) {
  throw new Error(
    `Fatal findings remain: ${JSON.stringify(findings.fatalFindings)}`,
  );
}

const counts = {};
for (const finding of findings.editorialFindings) {
  counts[finding.code] = (counts[finding.code] ?? 0) + 1;
}
const expectedMaximums = {
  "CONTRACTUALLY-FIXED-ANSWER": 7,
  "REPEATED-EXPLANATION-OPENING": 5,
  "REPEATED-EXPLANATION-CLOSING": 2,
  "REPEATED-EXPLANATION-PARAGRAPH": 3,
};
for (const [code, maximum] of Object.entries(expectedMaximums)) {
  if ((counts[code] ?? 0) > maximum) {
    throw new Error(`${code} count ${counts[code]} exceeds maximum ${maximum}.`);
  }
}
for (const code of [
  "SAME-QL-STEM-REPEAT",
  "SAME-QL-ANSWER-REPEAT",
  "CONTRACTUALLY-FIXED-STEM",
]) {
  if (counts[code]) throw new Error(`Unexpected ${code}: ${counts[code]}`);
}
if (findings.editorialFindings.length > 17) {
  throw new Error(
    `Editorial finding count ${findings.editorialFindings.length} exceeds wave target 17.`,
  );
}

const forbiddenPatterns = [
  "a fractional profit or loss must be converted with close attention to the stated base.",
  "when several lots or groups are involved, the overall result must come from total money rather than an average of percentages.",
  "the required price or rate on the remaining stock must first cover the gap left after earlier sales or damage recovery.",
  "do not average the group percentages unless all group cost bases are equal.",
  "do not apply the target percentage only to the unsold units; the target concerns the entire inventory.",
  "do not multiply every fraction by # without checking whether its denominator is cost or selling price.",
];
for (const pattern of forbiddenPatterns) {
  const matched = findings.editorialFindings.filter(
    (finding) => finding.message === pattern,
  );
  if (matched.length) {
    throw new Error(`Targeted repeated pattern remains: ${pattern}`);
  }
}

const sortedCounts = Object.fromEntries(
  Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)),
);
const report = [
  "# PNL-001 English Prose Cluster Wave 01",
  "",
  "## Scope",
  "",
  "This wave removes shared Editorial V2 prose from twelve English QLs and corrects the PNL-QL-092 data-sufficiency contract.",
  "",
  "### CP-001 fraction-to-rate",
  "",
  "- PNL-QL-024: profit fraction of cost price;",
  "- PNL-QL-025: loss fraction of cost price;",
  "- PNL-QL-026: profit fraction of selling price converted to cost base;",
  "- PNL-QL-027: loss fraction of selling price converted to cost base.",
  "",
  "### CP-003 grouped inventory",
  "",
  "- PNL-QL-071: multiple-lot overall percentage;",
  "- PNL-QL-077: weighted group-rate result;",
  "- PNL-QL-088: table-ledger overall result;",
  "- PNL-QL-093: overall profit or loss amount.",
  "",
  "### CP-003 remaining-stock inverse",
  "",
  "- PNL-QL-075: damaged-stock recovery and good-unit price;",
  "- PNL-QL-080: remaining-unit selling price;",
  "- PNL-QL-081: remaining-stock profit or loss rate;",
  "- PNL-QL-092: two-statement data sufficiency.",
  "",
  "## QL-092 correction",
  "",
  "- The visible target is rendered from targetRatePercent and targetDirection instead of a hard-coded 10% profit.",
  "- Statement I and Statement II are never identical.",
  "- The EITHER class uses two differently worded but independently complete fact sets.",
  "- Generated working evaluates statement sufficiency rather than describing an answer label as a unit price.",
  "- A 96-seed regression requires all four standard sufficiency classes and verifies the facts behind each class.",
  "",
  "## Audit result",
  "",
  "```text",
  `QLs:                              ${metrics.qlCount}`,
  `Review rows:                      ${metrics.reviewRows}`,
  `Candidate packages:              ${metrics.qlCount * metrics.candidateSeedsPerQl}`,
  `Fatal findings:                   ${metrics.fatalFindingCount}`,
  "Editorial findings before wave:  46",
  `Editorial findings after wave:   ${metrics.editorialFindingCount}`,
  `Unresolved same-QL stem repeats: ${metrics.sameQlStemRepeatCount}`,
  `Unresolved same-QL answer repeats:${metrics.sameQlAnswerRepeatCount}`,
  `Audit status:                     ${metrics.auditStatus}`,
  "```",
  "",
  "Remaining finding counts:",
  "",
  "```json",
  JSON.stringify(sortedCounts, null, 2),
  "```",
  "",
  "## Regression boundary",
  "",
  "The permanent cluster regression rejects a meaningful normalized editorial paragraph or opening shared across different QLs in any of the three corrected clusters. Existing CP-001 and CP-003 dynamic seed sweeps, Editorial V2 source parity, render proofs and the chapter audit must also remain green.",
  "",
  "## Safety boundary",
  "",
  "No solver equations, answer semantics, option lifecycle, Question Studio route, Question Bank write, test eligibility or publication metadata changed. Dynamic packages remain unreviewed, not stored, test-ineligible and non-public.",
  "",
].join("\n");
fs.writeFileSync(
  path.join(root, "PNL-001-ENGLISH-PROSE-CLUSTER-WAVE-01.md"),
  report,
);

console.log(
  JSON.stringify(
    {
      status: "PASS_PNL_ENGLISH_PROSE_CLUSTER_WAVE_01",
      beforeFindings: 46,
      afterFindings: metrics.editorialFindingCount,
      findingCounts: sortedCounts,
    },
    null,
    2,
  ),
);
