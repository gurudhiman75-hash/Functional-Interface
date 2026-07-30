import fs from "node:fs";
import path from "node:path";

const root = path.resolve(
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001",
);
const output = path.resolve(
  "dist/quant-v4/pnl-001-english-editorial-audit",
);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function parseCsv(value) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const next = value[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const headers = rows.shift();
  if (!headers) return [];
  return rows.filter((item) => item.length > 1).map((item) =>
    Object.fromEntries(headers.map((header, index) => [header, item[index] ?? ""])),
  );
}

function normalise(value) {
  return value
    .toLowerCase()
    .replace(/₹\s*[\d,.]+(?:\.\d+)?/g, "₹#")
    .replace(/\b\d+(?:\.\d+)?%/g, "#%")
    .replace(/\b\d+(?:\.\d+)?\b/g, "#")
    .replace(/\b(?:x|y|n|r|q|d|c|s|m)\b/g, "x")
    .replace(/\s+/g, " ")
    .trim();
}

const findings = readJson(
  path.join(output, "pnl-001-english-editorial-findings.json"),
);
const metrics = readJson(
  path.join(output, "pnl-001-english-editorial-metrics.json"),
);
const rows = parseCsv(
  fs.readFileSync(
    path.join(output, "pnl-001-english-editorial-review.csv"),
    "utf8",
  ),
);

if (findings.fatalFindings.length) {
  throw new Error(`Fatal findings remain: ${JSON.stringify(findings.fatalFindings)}`);
}

const codeCounts = {};
for (const finding of findings.editorialFindings) {
  codeCounts[finding.code] = (codeCounts[finding.code] ?? 0) + 1;
}
if (codeCounts["SAME-QL-STEM-REPEAT"]) {
  throw new Error(
    `Sampling still reports same-QL stem repeats: ${JSON.stringify(
      findings.editorialFindings.filter(
        (item) => item.code === "SAME-QL-STEM-REPEAT",
      ),
    )}`,
  );
}

const diversity = new Map(
  metrics.candidateDiversityByQl.map((item) => [item.qlId, item]),
);
for (const qlId of ["PNL-QL-082", "PNL-QL-144", "PNL-QL-183"]) {
  if ((diversity.get(qlId)?.candidateStemCount ?? 0) < 2) {
    throw new Error(`${qlId} candidate pool did not expose runtime stem diversity.`);
  }
}

const rowsByQl = new Map();
for (const row of rows) {
  const group = rowsByQl.get(row.qlId) ?? [];
  group.push(row);
  rowsByQl.set(row.qlId, group);
}
for (const [qlId, info] of diversity) {
  const selected = new Set(
    (rowsByQl.get(qlId) ?? []).map((row) => normalise(row.stem)),
  );
  const expected = Math.min(3, info.candidateStemCount);
  if (selected.size < expected) {
    throw new Error(
      `${qlId}: selected ${selected.size} stem fingerprints, expected ${expected}.`,
    );
  }
}

const sortedCodeCounts = Object.fromEntries(
  Object.entries(codeCounts).sort(([left], [right]) => left.localeCompare(right)),
);
const report = `# PNL-001 English Editorial Audit Sampling Hardening

## Result

The chapter audit now samples from 48 mixed deterministic candidates per QL and selects review rows by maximising visible-stem diversity first and displayed-answer diversity second.

\`\`\`text
QLs:                              ${metrics.qlCount}
Review rows:                      ${metrics.reviewRows}
Candidate seeds per QL:           ${metrics.candidateSeedsPerQl}
Fatal findings:                   ${metrics.fatalFindingCount}
Editorial findings:               ${metrics.editorialFindingCount}
Same-QL stem repeats:             ${metrics.sameQlStemRepeatCount}
Same-QL displayed-answer repeats: ${metrics.sameQlAnswerRepeatCount}
Contractually fixed answers:      ${metrics.contractuallyFixedAnswerCount}
Audit status:                     ${metrics.auditStatus}
\`\`\`

## Corrected false sampling signals

The earlier correlated candidate seed family repeatedly selected one preset for \`PNL-QL-082\`, \`PNL-QL-144\` and \`PNL-QL-183\`, even though their checkpoint runtime proofs demonstrated varied stems. The mixed-salt candidate pool now exposes and selects their available runtime variation.

## Fixed-answer classification

A repeated answer is classified as \`CONTRACTUALLY-FIXED-ANSWER\` only when all 48 deterministic candidates produce the same displayed answer. This separates statement, data-sufficiency and other fixed-classification tasks from accidental review-sample repetition.

Fixed-answer QLs:

\`\`\`text
${metrics.contractuallyFixedAnswerQls.join(", ") || "None"}
\`\`\`

## Remaining editorial debt

\`\`\`json
${JSON.stringify(sortedCodeCounts, null, 2)}
\`\`\`

The remaining repeated openings, closings and paragraphs come from shared frozen Editorial V2 prose and require targeted editorial decisions. They are no longer mixed with false same-stem findings caused by correlated audit seeds.

## Safety boundary

No solver, stem template, option, Question Studio route, Question Bank write, test eligibility or publication metadata changed. Generated packages remain unreviewed dynamic candidates, not stored, test-ineligible and non-public.
`;
fs.writeFileSync(
  path.join(root, "PNL-001-ENGLISH-EDITORIAL-SAMPLING-HARDENING.md"),
  report,
);

console.log(
  JSON.stringify(
    {
      status: "PASS_PNL_ENGLISH_AUDIT_SAMPLING_HARDENING",
      editorialFindingCount: metrics.editorialFindingCount,
      sameQlStemRepeatCount: metrics.sameQlStemRepeatCount,
      contractuallyFixedAnswerCount: metrics.contractuallyFixedAnswerCount,
      issueCodeCounts: sortedCodeCounts,
    },
    null,
    2,
  ),
);
