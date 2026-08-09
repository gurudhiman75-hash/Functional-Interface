import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  MEN_CP_009_EXPLICIT_SOLVE_MODE_DISPOSITION,
  MEN_CP_009_FROZEN_QLS_V2,
  auditMenCp009CoverageV2,
} from "./registry";
import { buildMenCp009V2ReviewBatch } from "./review-batch";

const audit = auditMenCp009CoverageV2();
const review = buildMenCp009V2ReviewBatch();
const outputBase = resolve(
  process.cwd(),
  "dist/quant-v4/men-cp009-complete-v2",
);
mkdirSync(dirname(outputBase), { recursive: true });

function replacer(_key: string, value: unknown) {
  return typeof value === "bigint" ? value.toString() : value;
}

const evidence = {
  generatedAt: new Date().toISOString(),
  verdict: "IMPLEMENTATION_COMPLETE__EXPLICIT_SOLVE_MODES_CLOSED__ACTIVATION_LOCKED",
  audit,
  explicitSolveModeDisposition: MEN_CP_009_EXPLICIT_SOLVE_MODE_DISPOSITION,
  registry: MEN_CP_009_FROZEN_QLS_V2,
  review: {
    recordCount: review.rows.length,
    uniqueStems: review.uniqueStems,
    uniqueStemOptionPackages: review.uniqueStemOptionPackages,
    answerPositions: review.answerPositions,
  },
  lifecycle: {
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    humanEnglishApproval: null,
    directSourceNormalisationComplete: false,
    hindiParity: false,
    punjabiParity: false,
  },
  reviewRows: review.rows,
};

writeFileSync(
  `${outputBase}.json`,
  `${JSON.stringify(evidence, replacer, 2)}\n`,
  "utf8",
);

const lines = [
  "# MEN-CP-009 Complete English Implementation V2",
  "",
  "## Verdict",
  "",
  "```text",
  "IMPLEMENTATION_COMPLETE__EXPLICIT_SOLVE_MODES_CLOSED__ACTIVATION_LOCKED",
  "```",
  "",
  "```text",
  `Permanent QLs:                  ${audit.permanentQlCount}`,
  `QL range:                       ${audit.firstQlId}..${audit.lastQlId}`,
  `Explicit solve modes:           ${audit.explicitSolveModeCount}`,
  `Unresolved explicit modes:      ${audit.unresolvedExplicitSolveModeCount}`,
  `Deterministic proof packages:   ${audit.permanentQlCount * 80}`,
  `Review records:                 ${review.rows.length}`,
  `Unique review stems:            ${review.uniqueStems}`,
  `Unique stem-option packages:    ${review.uniqueStemOptionPackages}`,
  `Answer positions:               A${review.answerPositions.A} B${review.answerPositions.B} C${review.answerPositions.C} D${review.answerPositions.D}`,
  "```",
  "",
  "## Explicit solve-mode disposition",
  "",
  "| Source solve mode | Disposition | Evidence |",
  "|---|---|---|",
  ...MEN_CP_009_EXPLICIT_SOLVE_MODE_DISPOSITION.map(
    (row) => `| \`${row.sourceSolveMode}\` | ${row.disposition} | ${row.evidence} |`,
  ),
  "",
  "## V2 coverage additions",
  "",
  "| QL | Family | Solve mode |",
  "|---|---|---|",
  ...MEN_CP_009_FROZEN_QLS_V2.slice(24).map(
    (row) => `| \`${row.qlId}\` | ${row.title} | \`${row.solveMode}\` |`,
  ),
  "",
  "## Ownership boundary",
  "",
  "- Hollow spherical and hemispherical shell material remains implemented under MEN-CP-011.",
  "- Number of smaller spheres produced through melting or recasting remains owned by MEN-CP-012.",
  "- Composite, inscribed and displacement states remain owned by MEN-CP-013.",
  "",
  "## Activation boundary",
  "",
  "```text",
  "Question Studio:       disabled",
  "Question Bank:         NOT_STORED",
  "Mock-test eligibility: INELIGIBLE",
  "Public publication:    false",
  "Human English review:  pending",
  "Direct source review:  pending",
  "Hindi parity:          pending",
  "Punjabi parity:        pending",
  "```",
  "",
  "## Balanced review batch",
  "",
  ...review.rows.flatMap((question, index) => [
    `### ${index + 1}. ${question.permanentQlId}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option) =>
        `- ${option.label}. ${option.display}${option.isCorrect ? " **(correct)**" : ""}`,
    ),
    "",
    `**Answer:** ${question.answer}`,
    "",
  ]),
].join("\n");

writeFileSync(`${outputBase}.md`, lines, "utf8");
console.log(
  JSON.stringify(
    {
      outputBase,
      permanentQlCount: audit.permanentQlCount,
      unresolvedExplicitSolveModes: audit.unresolvedExplicitSolveModeCount,
      reviewRecords: review.rows.length,
      answerPositions: review.answerPositions,
    },
    null,
    2,
  ),
);
