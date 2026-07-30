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

const expectedFixedAnswers = [
  "PNL-QL-035",
  "PNL-QL-067",
  "PNL-QL-070",
  "PNL-QL-090",
  "PNL-QL-117",
  "PNL-QL-147",
  "PNL-QL-184",
];

if (findings.fatalFindings.length !== 0) {
  throw new Error(`Fatal findings remain: ${JSON.stringify(findings.fatalFindings)}`);
}
if (findings.editorialFindings.length !== 0) {
  throw new Error(
    `Editorial findings remain: ${JSON.stringify(findings.editorialFindings)}`,
  );
}
if (metrics.auditStatus !== "PASS") {
  throw new Error(`Expected audit PASS, received ${metrics.auditStatus}.`);
}
if (metrics.sameQlStemRepeatCount !== 0 || metrics.sameQlAnswerRepeatCount !== 0) {
  throw new Error(
    `Unresolved same-QL repeats remain: stems=${metrics.sameQlStemRepeatCount}, answers=${metrics.sameQlAnswerRepeatCount}.`,
  );
}
if (metrics.contractuallyFixedStemCount !== 0) {
  throw new Error(
    `Unexpected fixed stems: ${JSON.stringify(metrics.contractuallyFixedStemQls)}`,
  );
}
assertArrayEqual(
  [...metrics.contractuallyFixedAnswerQls].sort(),
  [...expectedFixedAnswers].sort(),
  "fixed-answer contracts",
);
if (metrics.repeatedOpeningPatterns.length !== 0) {
  throw new Error(
    `Repeated openings remain: ${JSON.stringify(metrics.repeatedOpeningPatterns)}`,
  );
}
if (metrics.repeatedClosingPatterns.length !== 0) {
  throw new Error(
    `Repeated closings remain: ${JSON.stringify(metrics.repeatedClosingPatterns)}`,
  );
}
if (metrics.repeatedParagraphPatterns.length !== 0) {
  throw new Error(
    `Repeated paragraphs remain: ${JSON.stringify(metrics.repeatedParagraphPatterns)}`,
  );
}

function assertArrayEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${label} mismatch: actual=${JSON.stringify(actual)}, expected=${JSON.stringify(expected)}`,
    );
  }
}

const report = `# PNL-001 English Editorial Final Freeze

## Result

The hardened chapter-wide English audit is fully green after removing the final ten repeated prose patterns and separating seven fixed-answer task contracts from editorial debt.

\`\`\`text
CPs:                               ${metrics.cpCount}
QLs:                               ${metrics.qlCount}
Candidate seeds per QL:            ${metrics.candidateSeedsPerQl}
Generated candidate packages:   ${metrics.qlCount * metrics.candidateSeedsPerQl}
Selected review rows:               ${metrics.reviewRows}
Fatal findings:                      ${metrics.fatalFindingCount}
Editorial findings:                  ${metrics.editorialFindingCount}
Unresolved same-QL stem repeats:     ${metrics.sameQlStemRepeatCount}
Unresolved same-QL answer repeats:   ${metrics.sameQlAnswerRepeatCount}
Contractually fixed stems:            ${metrics.contractuallyFixedStemCount}
Contractually fixed answers:          ${metrics.contractuallyFixedAnswerCount}
Repeated opening patterns:            ${metrics.repeatedOpeningPatterns.length}
Repeated closing patterns:            ${metrics.repeatedClosingPatterns.length}
Repeated paragraph patterns:          ${metrics.repeatedParagraphPatterns.length}
Audit status:                          ${metrics.auditStatus}
\`\`\`

## Fixed-answer contracts

These tasks legitimately return one classification for every valid deterministic candidate and are recorded as chapter metrics rather than editorial findings:

\`\`\`text
${expectedFixedAnswers.join(", ")}
\`\`\`

## Final prose corrections

- CP-001 direct profit, loss and no-change rate openings are distinct.
- CP-001 forward and reverse commercial-factor steps explain their own direction.
- CP-001 value-bound working distinguishes profit, loss and no-change cases.
- CP-002 amount, successive-discount, comparison and markup clusters use QL-specific openings.
- CP-002 direct and algebraic discount-rate steps have distinct calculation labels.
- CP-002 three-discount working no longer repeats a generic final-selling-price closing.
- CP-003 partial, spoiled, caselet and break-even inventory modes use task-specific full-cost steps.
- CP-004 two-stage, three-stage and table chains have distinct final-price closings.
- CP-005 and CP-006 percentage-conversion steps describe their actual business quantities.

## Freeze boundary

English Editorial V2 authority, committed EN/HI/PA libraries, six dynamic runtimes, Question Studio routing, freeze-readiness checks and publication locks must remain green. Reopen the English manual only for a proven mathematical, source-parity, rendering or examination-pattern defect—not for cosmetic variation.

## Safety boundary

No solver equation, answer semantic, option lifecycle, Question Studio route, Question Bank write, test eligibility or public-publication metadata changed. Dynamic candidates remain unreviewed, not stored, test-ineligible and non-public.
`;
fs.writeFileSync(
  path.join(root, "PNL-001-ENGLISH-EDITORIAL-FINAL-FREEZE.md"),
  report,
);

console.log(
  JSON.stringify(
    {
      status: "PASS_PNL_ENGLISH_EDITORIAL_FINAL_FREEZE",
      auditStatus: metrics.auditStatus,
      fatalFindingCount: metrics.fatalFindingCount,
      editorialFindingCount: metrics.editorialFindingCount,
      fixedAnswerContracts: expectedFixedAnswers,
    },
    null,
    2,
  ),
);
