import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateBankingPossibilityReviewQuestionV3 } from "./banking-possibility-review-question-v3";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);

let records = 0;
let enabled = 0;
let omitted = 0;
const omissionReasons: Record<string, number> = {};
const omittedByScenario: Record<string, number> = {};
const enabledByLocale: Record<string, number> = {};
const enabledByGroup: Record<string, number> = {};
const geometrySources: Record<string, number> = {};
const seedStatus = new Map<number, boolean>();
const seedGeometrySource = new Map<number, string>();

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

for (const seed of seeds) {
  for (const locale of locales) {
    const question = generateBankingPossibilityReviewQuestionV3(seed, locale);
    records += 1;

    assert.equal(question.diagram.schemaVersion, "banking-possibility-combined-diagram-v3");
    assert.equal(question.diagram.renderer, "V5_EXACT_WITH_SAFETY_GATED_SUPPLEMENTAL_TEMPLATES");
    assert.equal(question.diagram.pipelineMode, "CONCLUSION_MASK");
    assert.equal(question.diagram.premiseOnly, true);
    assert.ok(!("diagrams" in question), `${seed}/${locale}: legacy two-diagram field must not exist`);
    assert.ok(question.diagram.diagramCount === 0 || question.diagram.diagramCount === 1);
    increment(geometrySources, question.diagram.geometrySource);

    const priorSeedStatus = seedStatus.get(seed);
    if (priorSeedStatus === undefined) seedStatus.set(seed, question.diagram.enabled);
    else assert.equal(
      question.diagram.enabled,
      priorSeedStatus,
      `${seed}: diagram enablement must be locale-invariant`,
    );
    const priorSource = seedGeometrySource.get(seed);
    if (priorSource === undefined) seedGeometrySource.set(seed, question.diagram.geometrySource);
    else assert.equal(
      question.diagram.geometrySource,
      priorSource,
      `${seed}: geometry source must be locale-invariant`,
    );

    if (!question.diagram.enabled) {
      omitted += 1;
      assert.equal(question.scenarioId, "SYL-SC-CORE-009", `${seed}/${locale}: only the four-term CORE-009 family may omit`);
      assert.equal(question.diagram.geometrySource, "OMITTED");
      assert.equal(question.diagram.diagramCount, 0);
      assert.equal(question.diagram.svg, null);
      assert.equal(question.diagram.caption, null);
      assert.equal(question.diagram.accessibleDescription, null);
      assert.ok(question.diagram.omissionReason);
      increment(omissionReasons, question.diagram.omissionReason ?? "UNKNOWN");
      increment(omittedByScenario, question.scenarioId);
      continue;
    }

    enabled += 1;
    assert.notEqual(question.scenarioId, "SYL-SC-CORE-009", `${seed}/${locale}: four-term CORE-009 must remain omitted`);
    assert.ok(
      question.diagram.geometrySource === "APPROVED_V5_EXACT"
      || question.diagram.geometrySource === "SAFETY_GATED_SUPPLEMENTAL_TEMPLATE",
    );
    increment(enabledByLocale, locale);
    increment(enabledByGroup, question.scenarioGroup);
    assert.equal(question.diagram.diagramCount, 1);
    assert.equal(question.diagram.omissionReason, null);
    assert.ok(question.diagram.svg);
    assert.ok(question.diagram.caption);
    assert.ok(question.diagram.accessibleDescription);
    assert.match(question.diagram.svg ?? "", /<svg\b/u);
    assert.equal((question.diagram.svg ?? "").match(/<svg\b/gu)?.length ?? 0, 1);
    assert.match(question.diagram.svg ?? "", /data-banking-combined-venn="true"/u);
    assert.match(question.diagram.svg ?? "", /data-premise-only="true"/u);
    assert.match(question.diagram.svg ?? "", /data-diagram-count="1"/u);
    assert.doesNotMatch(question.diagram.svg ?? "", /<script\b/iu);
    assert.doesNotMatch(question.diagram.svg ?? "", /<foreignObject\b/iu);
    assert.ok(
      (question.diagram.svg ?? "").includes("data-set="),
      `${seed}/${locale}: enabled combined diagram must contain named set geometry`,
    );
  }
}

for (const locale of locales) {
  const first = generateBankingPossibilityReviewQuestionV3(0, locale);
  assert.equal(first.scenarioId, "SYL-SC-CORE-007");
  assert.equal(first.diagram.enabled, true, `seed 0/${locale}: first review question must retain one combined diagram`);
  assert.equal(first.diagram.geometrySource, "SAFETY_GATED_SUPPLEMENTAL_TEMPLATE");
  assert.equal(first.diagram.diagramCount, 1);
}

assert.equal(records, 240);
assert.equal(enabled, 228);
assert.equal(omitted, 12);
assert.deepEqual(geometrySources, {
  SAFETY_GATED_SUPPLEMENTAL_TEMPLATE: 123,
  APPROVED_V5_EXACT: 105,
  OMITTED: 12,
});
assert.deepEqual(omittedByScenario, { "SYL-SC-CORE-009": 12 });
assert.deepEqual(enabledByLocale, { "en-IN": 76, "hi-IN": 76, "pa-IN": 76 });
assert.equal(enabled + omitted, records);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_SINGLE_COMBINED_DIAGRAM_V3",
  records,
  diagramSlots: records,
  enabled,
  omitted,
  geometrySources,
  omissionReasons,
  omittedByScenario,
  enabledByLocale,
  enabledByGroup,
  firstQuestion: {
    scenarioId: "SYL-SC-CORE-007",
    enabled: true,
    geometrySource: "SAFETY_GATED_SUPPLEMENTAL_TEMPLATE",
  },
  contract: {
    oneQuestionLevelDiagram: true,
    perConclusionDiagramsRemoved: true,
    everySelectedThreeTermRecordHasOneDiagram: true,
    fourTermRecordsRemainOmitted: true,
    premiseOnlyGeometry: true,
    pipelineMode: "CONCLUSION_MASK",
    primaryRenderer: "existing approved learner-v5 exact Venn pipeline",
    supplementalRenderer: "narrow finite templates with existing V5 witness and strong-relation safety gates",
    supplementalIsProductApproved: false,
    firstQuestionDiagramRequired: true,
    deliveryActivationChanged: false,
  },
}, null, 2));
