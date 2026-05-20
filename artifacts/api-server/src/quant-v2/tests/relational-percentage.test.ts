import assert from "node:assert/strict";
import test from "node:test";
import type { Pattern } from "../../lib/core/generator-engine";
import { createQuantV2PercentageQuestionCandidate } from "../../lib/quant-v2/percentage-admin-adapter";
import { createRelationalPercentageProblem } from "../canonical/percentage-motif-factories";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { validatePercentageProblem } from "../validators/problem-validator";
import { validateReasoningGraph } from "../validators/reasoning-validator";
import { validateTopology } from "../validators/topology-validator";
import { validateRelationalPercentage } from "../validators/relational-percentage-validator";

const SAMPLE_COUNT = 20000;
const DEVANAGARI_RE = /[\u0900-\u097F]/u;
const GURMUKHI_RE = /[\u0A00-\u0A7F]/u;

const relationalPattern: Pattern = {
  id: "relational-percentage-expansion",
  type: "formula",
  section: "Quant",
  topic: "percentage",
  subtopic: "percentage",
  difficulty: "Hard",
  templateVariants: ["Relational percentage expansion pattern"],
  variables: {},
  formula: "quant-v2",
};

test("relational percentage canonical graphs are valid at scale", () => {
  const variants = new Set<string>();
  const difficulties = new Set<string>();

  for (let index = 0; index < SAMPLE_COUNT; index += 1) {
    const problem = createRelationalPercentageProblem(`relational:${index}`);
    const graph = buildReasoningGraph(problem);

    variants.add(String(problem.topology?.variant));
    difficulties.add(problem.difficulty);

    const canonical = validatePercentageProblem(problem);
    const reasoning = validateReasoningGraph(problem, graph);
    const topology = validateTopology(problem, graph);
    const relational = validateRelationalPercentage(problem, graph);
    assert.equal(canonical.valid, true, canonical.issues.join(" | "));
    assert.equal(reasoning.valid, true, reasoning.issues.join(" | "));
    assert.equal(topology.valid, true, topology.issues.join(" | "));
    assert.equal(relational.valid, true, relational.issues.join(" | "));
    assert.equal(problem.subtype, "relational_percentage");
    assert.equal(problem.reasoningPattern, "relational_chain");
    assert.ok(graph.steps.some((step) => step.type === "relation_normalization"));
    assert.ok(graph.steps.some((step) => step.type === "comparison_inference"));
  }

  assert.ok(variants.size >= 5);
  assert.ok(difficulties.has("easy"));
  assert.ok(difficulties.has("medium"));
  assert.ok(difficulties.has("hard"));
});

test("admin quant-v2 flow emits multilingual relational percentage samples", () => {
  const previousFlag = process.env.QUANT_V2_PERCENTAGE_ENABLED;
  process.env.QUANT_V2_PERCENTAGE_ENABLED = "1";

  try {
    let relationalCount = 0;

    for (let index = 0; index < 4000; index += 1) {
      const question = createQuantV2PercentageQuestionCandidate(
        relationalPattern,
        {
          seed: `relational-admin:${index}`,
          forcedMotifId: "perc_relational_chain",
          examProfile: "ssc",
        },
      );
      const quantV2 = question.debugMetadata?.quantV2 as any;
      if (quantV2.subtype !== "relational_percentage") {
        continue;
      }
      relationalCount += 1;
      assert.match(question.text, /more or less than/iu);
      assert.ok(question.textHi && DEVANAGARI_RE.test(question.textHi));
      assert.ok(question.textPa && GURMUKHI_RE.test(question.textPa));
      assert.ok(question.options.some((option) => /% (?:more|less)/iu.test(option)));
      assert.equal(
        quantV2.validatorReports.relationalPercentage.valid,
        true,
        quantV2.validatorReports.relationalPercentage.issues.join(" | "),
      );
      assert.ok(quantV2.reasoningGraph.steps.length >= 4);
      assert.ok(quantV2.topology?.family);
    }

    assert.ok(relationalCount >= 3000);
  } finally {
    if (previousFlag === undefined) {
      delete process.env.QUANT_V2_PERCENTAGE_ENABLED;
    } else {
      process.env.QUANT_V2_PERCENTAGE_ENABLED = previousFlag;
    }
  }
});

export {};
