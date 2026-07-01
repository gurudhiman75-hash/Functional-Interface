import assert from "node:assert/strict";
import { routeExplanationExecution } from "../../../../../../common/eev2/routing";
import { formatExplanationSteps, validateExplanationPipeline } from "../../../../../../common/explanation-engine";
import { TaskKindTeacherRenderer } from "../../../../../../common/teacher-renderer";
import { getQuestionEntry } from "../library";
import { PCT_001_QUESTION_DEFINITIONS } from "./registry";
import {
  instantiatePct001QuestionDefinition,
  validateQuestionDefinition,
} from "./resolver";
import { buildPct001QuestionDefinitionReport } from "./question-definition-report";

assert.equal(PCT_001_QUESTION_DEFINITIONS.length, 20);
assert.equal(
  new Set(PCT_001_QUESTION_DEFINITIONS.map((item) => item.definitionId)).size,
  20,
);

for (const definition of PCT_001_QUESTION_DEFINITIONS) {
  assert.deepEqual(validateQuestionDefinition(definition), []);
  assert.equal(definition.stem.ownership, "HUMAN_OWNED");
  assert.equal(definition.stem.provenanceStatus, "APPROVED");
  assert.ok(
    getQuestionEntry("PCT-CP-002", definition.stem.qlId, "en").template,
  );
  assert.ok(definition.variables.ratePairs.length > 0);
  assert.ok(definition.variables.unitValues.length > 0);
  assert.ok(
    definition.explanation.requiredRoles.includes(
      "SINGLE_UNIT_DERIVATION",
    ),
  );

  for (const seed of ["alpha", "beta", "gamma"]) {
    const first = instantiatePct001QuestionDefinition(
      definition.definitionId,
      seed,
    );
    const second = instantiatePct001QuestionDefinition(
      definition.definitionId,
      seed,
    );
    assert.deepEqual(first, second, `${definition.definitionId} is not deterministic`);
    assert.equal(first.parameters.taskKind, "percentOfKnownNumber");
    assert.equal(first.parameters.questionLanguageId, definition.stem.qlId);
    assert.equal(
      first.parameters.sourceTrace.variableRangeSource,
      `question-definitions/${definition.definitionId}/definition.ts`,
    );
    assert.equal(
      first.plan.detailMode,
      definition.explanation.detailMode,
    );
    assert.deepEqual(
      first.plan.roles
        .filter((role) => role.roleKind !== "VERIFICATION")
        .map((role) => role.roleKind),
      definition.explanation.requiredRoles,
    );
    assert.ok(
      first.plan.roles.some(
        (role) => role.roleKind === "SINGLE_UNIT_DERIVATION",
      ),
    );
    assert.ok(
      first.blocks.some(
        (block) => block.semanticRole === "UNIT_VALUE_GROUP",
      ),
    );
    assert.ok(first.lines.length > 0);
    assert.ok(
      first.validations.every((validation) => validation.valid),
      `${definition.definitionId} failed EEV2 validation`,
    );

    const evidence = first.solver.educationalEvidence!;
    assert.equal(
      evidence.derivedValues.singleUnitValue *
        evidence.sourceValues.knownUnitCount,
      evidence.sourceValues.knownQuantity,
    );
    assert.equal(
      evidence.derivedValues.singleUnitValue *
        evidence.sourceValues.targetUnitCount,
      evidence.derivedValues.targetQuantity,
    );
    assert.equal(
      evidence.derivedValues.targetQuantity,
      first.solver.numericAnswer,
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
    assert.ok(legacyLines.length > 0);

    if (seed === "alpha") {
      const answer = String(first.solver.numericAnswer);
      const shadow = await routeExplanationExecution(
        {
          mode: "shadow",
          input: { definitionId: definition.definitionId, seed },
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
              validation: {
                status: "passed",
                failureCodes: [],
              },
            };
          },
        },
      );
      assert.equal(shadow.mode, "shadow");
      assert.equal(shadow.publicEngine, "v1");
      assert.equal(shadow.shadow.comparison.mathematicalParity, true);
      assert.equal(shadow.shadow.comparison.failureStatus.v2, "none");
      assert.ok(shadow.shadow.v2Output);
    }
  }
}

const report = buildPct001QuestionDefinitionReport();
assert.equal(report.definitionCount, 20);
assert.equal(report.approvedStemProvenance, 20);
assert.equal(report.fallbackStemProvenance, 0);
assert.equal(report.questionSpecificVariableOwnership, 20);
assert.equal(report.questionSpecificExplanationOwnership, 20);
assert.deepEqual(report.productionLayersModified, []);
assert.deepEqual(report.qlCoverage, {
  "PCT-QL-017": 4,
  "PCT-QL-117": 4,
  "PCT-QL-217": 4,
  "PCT-QL-317": 4,
  "PCT-QL-417": 4,
});

console.log(
  `CONTENT-001 passed: ${report.definitionCount} question definitions, ` +
    `${report.approvedStemProvenance} approved stems, no production-layer changes.`,
);
