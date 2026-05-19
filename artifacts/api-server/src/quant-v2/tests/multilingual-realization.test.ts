import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { PERCENTAGE_MOTIF_FACTORY_LIST } from "../canonical/percentage-motif-factories";
import { realizeEditorialProblem } from "../editorial/stem-realizer";
import { renderLocalizedRealization } from "../localization/renderers/language-renderer";
import { buildMultilingualReferenceSamples } from "../localization/renderers/export-multilingual-references";
import { validateLocalization } from "../localization/validators/localization-validator";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { createProblemSignature } from "../utils/problem-signature";

const SAMPLE_COUNT = 2000;
const DEVANAGARI_RE = /[\u0900-\u097F]/u;
const GURMUKHI_RE = /[\u0A00-\u0A7F]/u;

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
  const editorial = realizeEditorialProblem({
    problem,
    graph,
    seed: `ml-test:${index}:${signature}`,
  });
  return { problem, graph, signature, editorial };
}

test("multilingual realization preserves equations and renders semantic intents deterministically", () => {
  let hindiLabels = 0;
  let punjabiLabels = 0;
  let shortcutHeadings = 0;

  for (let index = 0; index < SAMPLE_COUNT; index += 1) {
    const sample = buildSample(index);
    const hi = renderLocalizedRealization({
      language: "hi",
      problem: sample.problem,
      graph: sample.graph,
      editorial: sample.editorial,
    });
    const pa = renderLocalizedRealization({
      language: "pa",
      problem: sample.problem,
      graph: sample.graph,
      editorial: sample.editorial,
    });
    const hiAgain = renderLocalizedRealization({
      language: "hi",
      problem: sample.problem,
      graph: sample.graph,
      editorial: sample.editorial,
    });

    assert.deepEqual(hi, hiAgain);

    const hiValidation = validateLocalization({
      source: sample.editorial,
      localized: hi,
    });
    const paValidation = validateLocalization({
      source: sample.editorial,
      localized: pa,
    });

    assert.equal(
      hiValidation.metrics.equationPreservationScore,
      100,
      sample.signature,
    );
    assert.equal(
      paValidation.metrics.equationPreservationScore,
      100,
      sample.signature,
    );
    assert.ok(
      hiValidation.metrics.localizationCoverage >= 75,
      `${sample.signature} ${JSON.stringify(hiValidation.metrics)}`,
    );
    assert.ok(
      paValidation.metrics.localizationCoverage >= 75,
      `${sample.signature} ${JSON.stringify(paValidation.metrics)}`,
    );
    assert.ok(
      hiValidation.metrics.fallbackCount <= 1,
      sample.signature,
    );
    assert.ok(
      paValidation.metrics.fallbackCount <= 1,
      sample.signature,
    );
    assert.ok(
      hiValidation.metrics.scriptConsistencyScore >= 75,
      sample.signature,
    );
    assert.ok(
      paValidation.metrics.scriptConsistencyScore >= 75,
      sample.signature,
    );

    if (DEVANAGARI_RE.test(hi.explanation)) {
      hindiLabels += 1;
    }
    if (GURMUKHI_RE.test(pa.explanation)) {
      punjabiLabels += 1;
    }
    if (
      hi.explanation.includes("शॉर्टकट:") ||
      pa.explanation.includes("ਸ਼ਾਰਟਕੱਟ:")
    ) {
      shortcutHeadings += 1;
    }
  }

  assert.ok(hindiLabels > SAMPLE_COUNT * 0.9);
  assert.ok(punjabiLabels > SAMPLE_COUNT * 0.9);
  assert.ok(shortcutHeadings > 0);
});

test("multilingual reference export shape is stable", () => {
  const samples = buildMultilingualReferenceSamples();
  assert.equal(samples.length, 60);
  for (const sample of samples) {
    assert.equal(typeof sample.english.explanation, "string");
    assert.equal(typeof sample.hindi.stem, "string");
    assert.equal(typeof sample.punjabi.stem, "string");
    assert.equal(typeof sample.hindi.explanation, "string");
    assert.equal(typeof sample.punjabi.explanation, "string");
    assert.ok(DEVANAGARI_RE.test(sample.hindi.stem));
    assert.ok(GURMUKHI_RE.test(sample.punjabi.stem));
    assert.ok(DEVANAGARI_RE.test(sample.hindi.explanation));
    assert.ok(GURMUKHI_RE.test(sample.punjabi.explanation));
    assert.equal(sample.hindi.metrics.equationPreservationScore, 100);
    assert.equal(sample.punjabi.metrics.equationPreservationScore, 100);
  }

  const apiServerDir = fs.existsSync(
    path.join(process.cwd(), "artifacts/api-server/src/quant-v2"),
  )
    ? path.join(process.cwd(), "artifacts/api-server")
    : process.cwd();
  const referencePath = path.join(
    apiServerDir,
    "src/quant-v2/stability/multilingual-reference-samples/paired-realizations.json",
  );
  if (fs.existsSync(referencePath)) {
    const exported = JSON.parse(fs.readFileSync(referencePath, "utf8")) as unknown[];
    assert.equal(exported.length, 60);
  }
});

export {};
