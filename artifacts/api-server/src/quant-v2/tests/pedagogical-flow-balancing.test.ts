import assert from "node:assert/strict";
import test from "node:test";
import { PERCENTAGE_MOTIF_FACTORY_LIST } from "../canonical/percentage-motif-factories";
import { realizeEditorialProblem } from "../editorial/stem-realizer";
import { renderLocalizedRealization } from "../localization/renderers/language-renderer";
import {
  createPedagogicalFlowMetrics,
  validatePedagogicalFlow,
} from "../validators/pedagogical-flow-validator";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { createProblemSignature } from "../utils/problem-signature";

const SAMPLE_COUNT = 4000;

function buildSample(index: number) {
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
    seed: `pedagogy:${index}:${signature}`,
  });
  const hi = renderLocalizedRealization({
    language: "hi",
    problem,
    graph,
    editorial: realization,
  });
  const pa = renderLocalizedRealization({
    language: "pa",
    problem,
    graph,
    editorial: realization,
  });

  return {
    problem,
    graph,
    signature,
    realization,
    localized: [hi, pa],
  };
}

test("pedagogical flow balancing preserves derivation across multilingual samples", () => {
  let shortcutSamples = 0;
  let bridgeSamples = 0;
  let minimumScore = 100;

  for (let index = 0; index < SAMPLE_COUNT; index += 1) {
    const sample = buildSample(index);
    const validation = validatePedagogicalFlow(sample);
    const metrics = createPedagogicalFlowMetrics(sample);
    minimumScore = Math.min(
      minimumScore,
      metrics.pedagogicalContinuityScore,
    );

    assert.equal(
      validation.valid,
      true,
      `${sample.signature}: ${validation.issues.join(" | ")}`,
    );
    assert.ok(
      metrics.derivationVisibilityScore >= 78,
      sample.signature,
    );
    assert.ok(metrics.shortcutBalanceScore >= 78, sample.signature);
    assert.ok(
      metrics.explanationCompletenessScore >= 78,
      sample.signature,
    );
    assert.ok(
      metrics.collisionSuppressionScore >= 78,
      sample.signature,
    );

    if (sample.realization.naturalization.shortcutSurfaced) {
      shortcutSamples += 1;
      assert.ok(
        sample.realization.explanation.includes("Using the percentage relation:"),
        sample.signature,
      );
      assert.ok(
        sample.localized.every((item) =>
          item.explanation.includes(
            item.language === "hi"
              ? "प्रतिशत संबंध से:"
              : "ਪ੍ਰਤੀਸ਼ਤ ਸੰਬੰਧ ਨਾਲ:",
          ),
        ),
        sample.signature,
      );
      bridgeSamples += 1;
    }
  }

  assert.ok(shortcutSamples > 0);
  assert.equal(bridgeSamples, shortcutSamples);
  assert.ok(minimumScore >= 78);
});

export {};

