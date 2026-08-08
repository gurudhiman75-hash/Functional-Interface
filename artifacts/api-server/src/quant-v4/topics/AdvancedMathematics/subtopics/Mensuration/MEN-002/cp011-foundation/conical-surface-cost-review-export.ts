import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY,
  auditMenCp011ConicalSurfaceCostBatch,
  generateMenCp011ConicalSurfaceCostReviewBatch,
} from "./conical-surface-cost";

const batch = generateMenCp011ConicalSurfaceCostReviewBatch();
const audit = auditMenCp011ConicalSurfaceCostBatch(batch.records);
const outputBase = resolve(
  process.cwd(),
  "dist/quant-v4/men-cp011-conical-surface-cost-wave01-review",
);
mkdirSync(dirname(outputBase), { recursive: true });

const replacer = (_key: string, value: unknown) =>
  typeof value === "bigint" ? value.toString() : value;

writeFileSync(
  `${outputBase}.json`,
  JSON.stringify(
    {
      authority: MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY,
      generatedAt: new Date().toISOString(),
      audit,
      records: batch.records,
    },
    replacer,
    2,
  ),
  "utf8",
);

const lines = [
  "# MEN-CP-011 Conical Surface and Lining Cost Wave 01 Review",
  "",
  "## Summary",
  "",
  "```text",
  `Authority:                 ${MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY}`,
  `Runtime prototypes:        ${audit.prototypeCount}`,
  `Review records:            ${audit.recordCount}`,
  `Area records:              ${audit.targetCounts.AREA}`,
  `Cost records:              ${audit.targetCounts.COST}`,
  `Unique exact stems:        ${audit.exactStemCount}`,
  `Unique stem/options:       ${audit.exactQuestionOptionCount}`,
  `Unique physical states:    ${audit.uniquePhysicalStateCount}`,
  `Correct positions:         A${audit.answerPositionCounts.A} B${audit.answerPositionCounts.B} C${audit.answerPositionCounts.C} D${audit.answerPositionCounts.D}`,
  `Units:                     cm=${audit.unitCounts.cm ?? 0}, m=${audit.unitCounts.m ?? 0}`,
  `Pi policies:               exact=${audit.piPolicyCounts.EXACT_PI}, 22/7=${audit.piPolicyCounts.PI_22_OVER_7}, 3.14=${audit.piPolicyCounts.PI_3_14}`,
  "Permanent QLs:             0",
  "Question Studio:           disabled",
  "Publication eligible:      false",
  "```",
  "",
  "## Review records",
  "",
];

for (const question of batch.records) {
  lines.push(
    `### ${question.prototypeId} — ${question.state.fixtureId} — ${question.state.piPolicy}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option) =>
        `${option.label}. ${option.display}${option.isCorrect ? " **(correct)**" : ""}`,
    ),
    "",
    `**Answer:** ${question.answer}`,
    "",
    `**Target:** \`${question.target}\``,
    "",
    `**Relation:** \`${question.state.relation}\``,
    "",
    `**Formula:** ${question.learnerSolution.formula}`,
    "",
    ...question.learnerSolution.steps.map((step) => `- ${step}`),
    "",
    `**Shortcut:** ${question.learnerSolution.shortcut}`,
    "",
    ...question.learnerSolution.wrongOptionAnalysis.map(
      (analysis) => `- ${analysis}`,
    ),
    "",
    `**Independent verification:** ${question.verification.method}`,
    "",
    `**Validation:** ${question.validation.valid ? "PASS" : "FAIL"}`,
    "",
  );
}

writeFileSync(`${outputBase}.md`, lines.join("\n"), "utf8");

console.log(
  JSON.stringify(
    {
      authority: MEN_CP011_CONICAL_SURFACE_COST_AUTHORITY,
      records: audit.recordCount,
      prototypes: audit.prototypeCount,
      targets: audit.targetCounts,
      exactStems: audit.exactStemCount,
      uniquePhysicalStates: audit.uniquePhysicalStateCount,
      answerPositionCounts: audit.answerPositionCounts,
      unitCounts: audit.unitCounts,
      piPolicyCounts: audit.piPolicyCounts,
      publicationEligible: audit.publicationEligible,
      outputJson: `${outputBase}.json`,
      outputMarkdown: `${outputBase}.md`,
    },
    null,
    2,
  ),
);
