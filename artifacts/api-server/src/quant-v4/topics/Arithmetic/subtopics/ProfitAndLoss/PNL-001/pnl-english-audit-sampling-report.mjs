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
for (const code of ["SAME-QL-STEM-REPEAT", "SAME-QL-ANSWER-REPEAT"]) {
  if (codeCounts[code]) {
    throw new Error(
      `Sampling still reports ${code}: ${JSON.stringify(
        findings.editorialFindings.filter((item) => item.code === code),
      )}`,
    );
  }
}

const diversity = new Map(
  metrics.candidateDiversityByQl.map((item) => [item.qlId, item]),
);
for (const qlId of ["PNL-QL-082", "PNL-QL-144", "PNL-QL-183"]) {
  if ((diversity.get(qlId)?.exactCandidateStemCount ?? 0) < 2) {
    throw new Error(`${qlId} candidate pool did not expose exact stem diversity.`);
  }
}

const rowsByQl = new Map();
for (const row of rows) {
  const group = rowsByQl.get(row.qlId) ?? [];
  group.push(row);
  rowsByQl.set(row.qlId, group);
}
for (const [qlId, info] of diversity) {
  const selectedRows = rowsByQl.get(qlId) ?? [];
  const exactSelected = new Set(selectedRows.map((row) => row.stem));
  const normalizedSelected = new Set(
    selectedRows.map((row) => normalise(row.stem)),
  );
  const expectedExact = Math.min(3, info.exactCandidateStemCount);
  const expectedNormalized = Math.min(3, info.normalizedCandidateStemCount);
  if (exactSelected.size < expectedExact) {
    throw new Error(
      `${qlId}: selected ${exactSelected.size} exact stems, expected ${expectedExact}.`,
    );
  }
  if (normalizedSelected.size < expectedNormalized) {
    throw new Error(
      `${qlId}: selected ${normalizedSelected.size} normalized stems, expected ${expectedNormalized}.`,
    );
  }
}

const sortedCodeCounts = Object.fromEntries(
  Object.entries(codeCounts).sort(([left], [right]) => left.localeCompare(right)),
);
const report = `# PNL-001 English Editorial Audit Sampling Hardening

## Result

The chapter audit now samples from 48 mixed deterministic candidates per QL. It first maximises semantic stem shape and displayed-answer diversity, then exact visible-value variation.

\`\`\`text
QLs:                              ${metrics.qlCount}
Review rows:                      ${metrics.reviewRows}
Candidate seeds per QL:           ${metrics.candidateSeedsPerQl}
Fatal findings:                   ${metrics.fatalFindingCount}
Editorial findings:               ${metrics.editorialFindingCount}
Unresolved same-QL stem repeats:  ${metrics.sameQlStemRepeatCount}
Unresolved same-QL answer repeats:${metrics.sameQlAnswerRepeatCount}
Contractually fixed stems:        ${metrics.contractuallyFixedStemCount}
Contractually fixed answers:      ${metrics.contractuallyFixedAnswerCount}
Audit status:                     ${metrics.auditStatus}
\`\`\`

## Corrected false sampling signals

The earlier correlated candidate seed family repeatedly selected one exact preset for \`PNL-QL-082\`, \`PNL-QL-144\` and \`PNL-QL-183\`, even though their checkpoint runtimes expose multiple exact stems. The mixed-salt candidate pool now selects all available exact variation up to the three review rows while still preferring distinct normalized stem shapes.

## Fixed-task classification

A repeated stem or answer is classified as contractually fixed only when all 48 deterministic candidates agree.

Fixed-stem QLs:

\`\`\`text
${metrics.contractuallyFixedStemQls.join(", ") || "None"}
\`\`\`

Fixed-answer QLs:

\`\`\`text
${metrics.contractuallyFixedAnswerQls.join(", ") || "None"}
\`\`\`

## Remaining editorial debt

\`\`\`json
${JSON.stringify(sortedCodeCounts, null, 2)}
\`\`\`

The remaining repeated openings, closings and paragraphs come from shared frozen Editorial V2 prose and require targeted editorial decisions. They are no longer mixed with false same-stem or same-answer findings caused by review-sample selection.

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
      sameQlAnswerRepeatCount: metrics.sameQlAnswerRepeatCount,
      contractuallyFixedStemCount: metrics.contractuallyFixedStemCount,
      contractuallyFixedAnswerCount: metrics.contractuallyFixedAnswerCount,
      issueCodeCounts: sortedCodeCounts,
    },
    null,
    2,
  ),
);
