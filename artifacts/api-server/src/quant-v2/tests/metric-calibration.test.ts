import assert from "node:assert/strict";
import test from "node:test";
import {
  PERCENTAGE_MOTIF_FACTORY_LIST,
} from "../canonical/percentage-motif-factories";
import type { EditorialRealization } from "../editorial/editorial-types";
import { realizeEditorialProblem } from "../editorial/stem-realizer";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { createProblemSignature } from "../utils/problem-signature";
import {
  createCalibratedQualityReport,
  validateMetricCalibration,
  validateMetricCalibrationBatch,
} from "../validators/metric-calibration-validator";

function spread(values: readonly number[]) {
  return Math.max(...values) - Math.min(...values);
}

function degradedRealization(
  realization: EditorialRealization,
): EditorialRealization {
  return {
    ...realization,
    scenario: {
      family: "general_percentage",
      opening: "In a percentage problem",
      entityLabel: "value",
      domainNoun: "value",
    },
    explanation: [
      "Required value =",
      "100 - 20",
      "= 80",
      "Required value =",
      "80 x 100 / 20",
      "= 400",
      "Therefore, final value = 400",
    ].join("\n"),
    naturalization: {
      ...realization.naturalization,
      phraseVariants: ["generic:required_value"],
      explanationPatternIds: ["generic:repeated"],
    },
  };
}

test("calibrated metrics differentiate operational quality", () => {
  const reports = [];
  const overallScores: number[] = [];
  const realismScores: number[] = [];
  const compactnessScores: number[] = [];
  const tiers = new Set<string>();
  const confidenceLevels = new Set<string>();
  let deterministicChecks = 0;
  let institutionalRealismTotal = 0;
  let genericRealismTotal = 0;
  let institutionalCount = 0;
  let genericCount = 0;

  for (let index = 0; index < 5000; index += 1) {
    const factory =
      PERCENTAGE_MOTIF_FACTORY_LIST[
        index % PERCENTAGE_MOTIF_FACTORY_LIST.length
      ]!;
    const seed =
      Math.floor(index / PERCENTAGE_MOTIF_FACTORY_LIST.length) + 1;
    const problem = factory(seed);
    const graph = buildReasoningGraph(problem);
    const signature = createProblemSignature(problem);
    const realization = realizeEditorialProblem({
      problem,
      graph,
      seed: `${index}:${signature}`,
    });
    const report = createCalibratedQualityReport(problem, graph, realization);
    const secondReport = createCalibratedQualityReport(
      problem,
      graph,
      realization,
    );

    assert.deepEqual(
      secondReport.metrics,
      report.metrics,
      "calibrated scoring must be deterministic",
    );
    const single = validateMetricCalibration(report);
    assert.equal(
      single.valid,
      true,
      `single calibration failed: ${single.issues.join("; ")}`,
    );

    reports.push(report);
    overallScores.push(report.metrics.overallQualityScore);
    realismScores.push(report.metrics.editorialRealismScore);
    compactnessScores.push(report.metrics.narrationCompactnessScore);
    tiers.add(report.tier);
    confidenceLevels.add(report.confidence);

    if (
      [
        "district_population_survey",
        "census_report",
        "recruitment_test",
        "warehouse_stock_audit",
        "petroleum_consumption_survey",
      ].includes(realization.scenario.family)
    ) {
      institutionalRealismTotal += report.metrics.domainRealismScore;
      institutionalCount += 1;
    }
    if (
      [
        "general_percentage",
        "product_pricing",
        "mixture_container",
      ].includes(realization.scenario.family)
    ) {
      genericRealismTotal += report.metrics.domainRealismScore;
      genericCount += 1;
    }

    if (index % 499 === 0) {
      deterministicChecks += 1;
    }
  }

  const batch = validateMetricCalibrationBatch(reports);
  assert.equal(
    batch.valid,
    true,
    `batch calibration failed: ${batch.issues.join("; ")}`,
  );
  assert.ok(deterministicChecks > 0, "determinism spot checks must run");
  assert.ok(spread(overallScores) >= 14, "overall scores need operational spread");
  assert.ok(spread(realismScores) >= 16, "realism scores need visible spread");
  assert.ok(spread(compactnessScores) >= 8, "compactness scores need visible spread");
  assert.ok(tiers.size >= 3, "quality tiers must differentiate samples");
  assert.ok(confidenceLevels.size >= 2, "confidence levels must differentiate samples");
  assert.ok(
    overallScores.filter((score) => score >= 97).length / overallScores.length < 0.18,
    "calibrated scoring must avoid saturation",
  );
  assert.ok(
    institutionalCount > 0 && genericCount > 0,
    "realism comparison groups must be present",
  );
  assert.ok(
    institutionalRealismTotal / institutionalCount >
      genericRealismTotal / genericCount,
    "institutional scenarios should score above generic scenarios",
  );
});

test("calibrated metrics penalize repetition and weak realism smoothly", () => {
  const problem = PERCENTAGE_MOTIF_FACTORY_LIST[0]!(1);
  const graph = buildReasoningGraph(problem);
  const realization = realizeEditorialProblem({
    problem,
    graph,
    seed: createProblemSignature(problem),
  });
  const strongReport = createCalibratedQualityReport(
    problem,
    graph,
    realization,
  );
  const weakReport = createCalibratedQualityReport(
    problem,
    graph,
    degradedRealization(realization),
  );

  assert.ok(
    strongReport.metrics.overallQualityScore >
      weakReport.metrics.overallQualityScore,
    "strong realization should outrank degraded realization",
  );
  assert.ok(
    strongReport.metrics.domainRealismScore >
      weakReport.metrics.domainRealismScore,
    "generic scenario should reduce domain realism",
  );
  assert.ok(
    strongReport.metrics.repetitionResistanceScore >
      weakReport.metrics.repetitionResistanceScore,
    "repeated narration should reduce repetition resistance",
  );
  assert.ok(
    weakReport.penaltyBreakdown.length > 0 ||
      weakReport.repetitionPenalties.some((entry) => !entry.includes("no repeated")),
    "degraded report should explain penalties",
  );
});

export {};
