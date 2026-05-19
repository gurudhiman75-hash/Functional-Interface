import assert from "node:assert/strict";
import test from "node:test";
import {
  PERCENTAGE_MOTIF_FACTORY_LIST,
} from "../canonical/percentage-motif-factories";
import { realizeEditorialProblem } from "../editorial/stem-realizer";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { createProblemSignature } from "../utils/problem-signature";
import { validatePercentageProblem } from "../validators/problem-validator";
import { validateReasoningGraph } from "../validators/reasoning-validator";
import { validateRealism } from "../validators/realism-validator";
import { validateEditorialRealization } from "../validators/editorial-validator";
import {
  validateEditorialNaturalization,
  validateEditorialNaturalizationBatch,
} from "../validators/editorial-naturalization-validator";

const UNSAFE_MATH_PATTERN = /[\\$<>\[\]`]/u;
const LEGACY_SUBTYPES = new Set([
  "increase_then_decrease",
  "reverse_percentage",
  "restore_original",
  "salary_revision",
  "price_consumption",
  "profit_loss",
  "mixture_percentage",
]);
const CONTEXTUAL_NOUN_PATTERN =
  /\b(machine|appliance|salary|employee|marks|test|town|population|fuel|purchase|retailer|shopkeeper|trader|mixture|solution|quantity|price)\b/iu;

test("editorial naturalization reduces template feel", () => {
  const realizations = [];
  const rhythmProfiles = new Set<string>();
  const phraseVariantsByType = new Map<string, Set<string>>();
  let shortcutCapable = 0;
  let shortcutSurfaced = 0;
  let contextualLegacyCount = 0;
  let legacyCount = 0;

  for (let index = 0; index < 1000; index += 1) {
    const factory =
      PERCENTAGE_MOTIF_FACTORY_LIST[
        index % PERCENTAGE_MOTIF_FACTORY_LIST.length
      ]!;
    const seed =
      Math.floor(index / PERCENTAGE_MOTIF_FACTORY_LIST.length) + 1;
    const problem = factory(seed);
    const graph = buildReasoningGraph(problem);
    const realization = realizeEditorialProblem({
      problem,
      graph,
      seed: `${index}:${createProblemSignature(problem)}`,
    });
    const label = `${problem.subtype} sample ${index + 1}`;

    assert.equal(
      validatePercentageProblem(problem).valid,
      true,
      `${label} canonical validation failed`,
    );
    assert.equal(
      validateReasoningGraph(problem, graph).valid,
      true,
      `${label} reasoning validation failed`,
    );
    assert.equal(
      validateRealism(problem).valid,
      true,
      `${label} realism validation failed`,
    );

    const editorial = validateEditorialRealization(
      problem,
      graph,
      realization,
    );
    assert.equal(
      editorial.valid,
      true,
      `${label} editorial validation failed: ${editorial.issues.join("; ")}`,
    );

    const naturalization = validateEditorialNaturalization(
      realization,
      graph,
    );
    assert.equal(
      naturalization.valid,
      true,
      `${label} naturalization validation failed: ${naturalization.issues.join("; ")}`,
    );

    assert.ok(
      !UNSAFE_MATH_PATTERN.test(realization.explanation),
      `${label} explanation must remain MathJax-compatible`,
    );
    assert.ok(
      graph.steps.some((step) => {
        const value = step.outputVariable
          ? problem.variables[step.outputVariable] ?? problem.answer
          : undefined;
        return typeof value === "number" &&
          (
            realization.explanation.includes(String(Number.isInteger(value) ? value : Number(value.toFixed(2)))) ||
            realization.explanation.includes(String(Math.abs(Number.isInteger(value) ? value : Number(value.toFixed(2)))))
          );
      }),
      `${label} explanation must include graph-derived equations`,
    );

    rhythmProfiles.add(realization.naturalization.rhythmProfile);
    for (const variant of realization.naturalization.phraseVariants) {
      const [stepType] = variant.split(":", 1);
      const variants = phraseVariantsByType.get(stepType) ?? new Set<string>();
      variants.add(variant);
      phraseVariantsByType.set(stepType, variants);
    }

    if (graph.shortcutEquation) {
      shortcutCapable += 1;
      if (realization.naturalization.shortcutSurfaced) {
        shortcutSurfaced += 1;
      }
    } else {
      assert.equal(
        realization.naturalization.shortcutSurfaced,
        false,
        `${label} must not surface a shortcut without graph support`,
      );
    }

    if (LEGACY_SUBTYPES.has(problem.subtype)) {
      legacyCount += 1;
      if (CONTEXTUAL_NOUN_PATTERN.test(realization.stem)) {
        contextualLegacyCount += 1;
      }
    }

    realizations.push(realization);
  }

  const batch = validateEditorialNaturalizationBatch(realizations);
  assert.equal(
    batch.valid,
    true,
    `naturalization batch validation failed: ${batch.issues.join("; ")}`,
  );
  assert.equal(rhythmProfiles.size, 4, "all rhythm profiles must appear");
  assert.ok(shortcutCapable > 0, "shortcut-capable samples must exist");
  assert.ok(shortcutSurfaced > 0, "shortcut surfacing must appear");
  assert.equal(
    contextualLegacyCount,
    legacyCount,
    "legacy stems must use contextual nouns",
  );

  for (const [stepType, variants] of phraseVariantsByType) {
    if (variants.size > 1) {
      continue;
    }

    const occurrenceCount = realizations.reduce(
      (count, realization) =>
        count +
        realization.naturalization.phraseVariants.filter((variant) =>
          variant.startsWith(`${stepType}:`),
        ).length,
      0,
    );
    assert.ok(
      occurrenceCount < 20,
      `${stepType} should rotate phrase variants when repeated`,
    );
  }
});

export {};
