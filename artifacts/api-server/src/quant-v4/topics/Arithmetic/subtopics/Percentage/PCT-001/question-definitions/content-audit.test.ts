import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { routeExplanationExecution } from "../../../../../../common/eev2/routing";
import {
  formatExplanationSteps,
  validateExplanationPipeline,
} from "../../../../../../common/explanation-engine";
import { TaskKindTeacherRenderer } from "../../../../../../common/teacher-renderer";
import {
  buildQ001Q020ContentAudit,
  serializeQ001Q020AuditCsv,
} from "./content-audit";
import { buildQ001Q020ContentAuditReport } from "./content-audit-report";
import { instantiatePct001QuestionDefinition } from "./resolver";

const rows = buildQ001Q020ContentAudit();
const repeatedRows = buildQ001Q020ContentAudit();
assert.deepEqual(rows, repeatedRows);
assert.equal(rows.length, 20);
assert.equal(new Set(rows.map((row) => row.questionId)).size, 20);

const report = buildQ001Q020ContentAuditReport(rows);
assert.equal(report.questionCount, 20);
assert.equal(report.realisticStemCount, 8);
assert.equal(report.abstractStemCount, 20);
assert.deepEqual(report.contextDistribution, {
  "Abstract quantity": 20,
});
assert.deepEqual(report.explanationDistribution, {
  "Semi-specific": 20,
});
assert.deepEqual(report.difficultyDistribution, {
  "Micro-emergent": 20,
});
assert.deepEqual(report.hintDistribution, { Minimal: 20 });
assert.deepEqual(report.misconceptionDistribution, { Minimal: 20 });
assert.deepEqual(report.migrationReadinessDistribution, { PARTIAL: 20 });
assert.deepEqual(report.immediatelySuitableForPackageMigration, []);
assert.equal(report.structurallyMigratableDefinitions.length, 20);
assert.equal(report.humanEffortEstimate.level, "HIGH");

for (const row of rows) {
  assert.equal(row.contextType, "Abstract quantity");
  assert.equal(row.explanationClassification, "Semi-specific");
  assert.equal(row.difficultyClassification, "Micro-emergent");
  assert.equal(row.hintPresence, "Minimal");
  assert.equal(row.misconceptionPresence, "Minimal");
  assert.equal(row.migrationReadiness, "PARTIAL");
  assert.ok(row.educationalRichnessScore >= 50);
  assert.ok(row.educationalRichnessScore < 80);

  const first = instantiatePct001QuestionDefinition(
    row.questionId as Parameters<
      typeof instantiatePct001QuestionDefinition
    >[0],
    "CONTENT-003A",
  );
  const second = instantiatePct001QuestionDefinition(
    row.questionId as Parameters<
      typeof instantiatePct001QuestionDefinition
    >[0],
    "CONTENT-003A",
  );
  assert.deepEqual(first, second);
  assert.ok(first.validations.every((validation) => validation.valid));
  assert.equal(
    first.solver.educationalEvidence!.derivedValues.targetQuantity,
    first.solver.numericAnswer,
  );
  assert.equal(first.definition.stem.ownership, "HUMAN_OWNED");
  assert.equal(first.definition.difficulty.authority, "QUESTION_DEFINITION");
  assert.equal(
    first.definition.explanation.roleSelectionAuthority,
    "QUESTION_DEFINITION",
  );

  const legacySteps = validateExplanationPipeline(
    {
      variables: first.parameters.variables,
      derivedValues: first.solver.evidence,
      entities: {},
      answer: first.solver.answer,
    },
    new TaskKindTeacherRenderer(
      first.parameters.taskKind,
      first.solver.mathJax,
    ),
  );
  const legacyLines = formatExplanationSteps(legacySteps);
  const answer = String(first.solver.numericAnswer);
  const shadow = await routeExplanationExecution(
    {
      mode: "shadow",
      input: first.parameters.questionId,
      comparisonTimestamp: "2026-06-22T00:00:00.000Z",
    },
    {
      executeV1() {
        return {
          engine: "v1",
          authoritativeRepresentation: "lines",
          output: { lines: legacyLines },
          answer,
          explanationLines: legacyLines,
          deterministicIdentity: `${first.parameters.questionId}:v1`,
          engineVersion: "teacher-renderer-v1",
          locale: "en",
          detailMode: first.plan.detailMode,
          validation: { status: "passed", failureCodes: [] },
        };
      },
      executeV2() {
        return {
          engine: "v2",
          authoritativeRepresentation: "blocks",
          output: { blocks: first.blocks, lines: first.lines },
          answer,
          explanationLines: first.lines,
          blocks: first.blocks,
          deterministicIdentity: `${first.parameters.questionId}:v2`,
          engineVersion: "eev2-unit-value-v1",
          locale: "en",
          detailMode: first.plan.detailMode,
          validation: { status: "passed", failureCodes: [] },
        };
      },
    },
  );
  assert.equal(shadow.mode, "shadow");
  assert.equal(shadow.shadow.comparison.mathematicalParity, true);
  assert.equal(shadow.shadow.comparison.failureStatus.v2, "none");
}

const csvPath = resolve(
  process.cwd(),
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-definitions/q001-q020-audit.csv",
);
assert.equal(
  await readFile(csvPath, "utf8"),
  serializeQ001Q020AuditCsv(rows),
);

console.log(
  `CONTENT-003A passed: ${report.questionCount} definitions audited; ` +
    `${report.migrationReadinessDistribution.PARTIAL} partial, ` +
    `${report.immediatelySuitableForPackageMigration.length} ready.`,
);

