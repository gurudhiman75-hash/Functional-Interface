import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  MEN_CP011_CONICAL_MATERIAL_AUTHORITY,
  auditMenCp011ConicalMaterialBatch,
  generateMenCp011ConicalMaterialReviewBatch,
} from "./conical-material";

const batch = generateMenCp011ConicalMaterialReviewBatch();
const audit = auditMenCp011ConicalMaterialBatch(batch.records);
const outputBase = resolve(
  process.cwd(),
  "dist/quant-v4/men-cp011-conical-material-wave01-review",
);
mkdirSync(dirname(outputBase), { recursive: true });

const replacer = (_key: string, value: unknown) =>
  typeof value === "bigint" ? value.toString() : value;

writeFileSync(
  `${outputBase}.json`,
  JSON.stringify(
    {
      authority: MEN_CP011_CONICAL_MATERIAL_AUTHORITY,
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
  "# MEN-CP-011 Conical Material Wave 01 Review",
  "",
  "## Summary",
  "",
  "```text",
  `Authority:                 ${MEN_CP011_CONICAL_MATERIAL_AUTHORITY}`,
  `Runtime prototypes:        ${audit.prototypeCount}`,
  `Review records:            ${audit.recordCount}`,
  `Unique exact stems:        ${audit.exactStemCount}`,
  `Unique stem/options:       ${audit.exactQuestionOptionCount}`,
  `Unique physical states:    ${audit.uniquePhysicalStateCount}`,
  `Correct positions:         A${audit.answerPositionCounts.A} B${audit.answerPositionCounts.B} C${audit.answerPositionCounts.C} D${audit.answerPositionCounts.D}`,
  `Units:                     cm=${audit.unitCounts.cm}, m=${audit.unitCounts.m}`,
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
    `### ${question.prototypeId} — ${question.state.fixtureId} — ${question.state.unit} — ${question.state.piPolicy}`,
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
      authority: MEN_CP011_CONICAL_MATERIAL_AUTHORITY,
      records: audit.recordCount,
      prototypes: audit.prototypeCount,
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
