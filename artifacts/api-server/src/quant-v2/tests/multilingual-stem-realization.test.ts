import assert from "node:assert/strict";
import test from "node:test";
import { PERCENTAGE_MOTIF_FACTORY_LIST } from "../canonical/percentage-motif-factories";
import { realizeEditorialProblem } from "../editorial/stem-realizer";
import { renderLocalizedRealization } from "../localization/renderers/language-renderer";
import { validateMultilingualStem } from "../localization/validators/multilingual-stem-validator";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { createProblemSignature } from "../utils/problem-signature";
import {
  createQuantV2PercentageQuestionCandidate,
} from "../../lib/quant-v2/percentage-admin-adapter";
import type { Pattern } from "../../lib/core/generator-engine";

const SAMPLE_COUNT = 3000;
const DEVANAGARI_RE = /[\u0900-\u097F]/u;
const GURMUKHI_RE = /[\u0A00-\u0A7F]/u;

const percentagePattern: Pattern = {
  id: "multilingual-stem-percentage",
  type: "formula",
  section: "Quant",
  topic: "percentage",
  subtopic: "percentage",
  difficulty: "Medium",
  templateVariants: ["Multilingual stem percentage pattern"],
  variables: {},
  formula: "quant-v2",
};

function buildSample(index: number) {
  const factory =
    PERCENTAGE_MOTIF_FACTORY_LIST[
      index % PERCENTAGE_MOTIF_FACTORY_LIST.length
    ]!;
  const seed = `multilingual-stem:${index}`;
  const problem = factory(seed);
  const graph = buildReasoningGraph(problem);
  const signature = createProblemSignature(problem);
  const editorial = realizeEditorialProblem({
    problem,
    graph,
    seed: `${seed}:${signature}`,
  });
  return { problem, graph, signature, editorial };
}

test("Hindi and Punjabi stems are semantic native realizations, not English fallbacks", () => {
  const seenSubtypes = new Set<string>();
  const seenHindiStems = new Set<string>();
  const seenPunjabiStems = new Set<string>();

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
    assert.notEqual(hi.stem, sample.editorial.stem, sample.signature);
    assert.notEqual(pa.stem, sample.editorial.stem, sample.signature);
    assert.ok(DEVANAGARI_RE.test(hi.stem), sample.signature);
    assert.ok(GURMUKHI_RE.test(pa.stem), sample.signature);
    assert.ok(hi.explanation.length > 0, sample.signature);
    assert.ok(pa.explanation.length > 0, sample.signature);

    const hiValidation = validateMultilingualStem({
      language: "hi",
      source: sample.editorial,
      localized: hi,
      problem: sample.problem,
    });
    const paValidation = validateMultilingualStem({
      language: "pa",
      source: sample.editorial,
      localized: pa,
      problem: sample.problem,
    });

    assert.equal(
      hiValidation.valid,
      true,
      `${sample.signature} ${hiValidation.issues.join(" | ")} ${hi.stem}`,
    );
    assert.equal(
      paValidation.valid,
      true,
      `${sample.signature} ${paValidation.issues.join(" | ")} ${pa.stem}`,
    );
    assert.ok(hiValidation.metrics.stemLocalizationScore >= 95);
    assert.ok(paValidation.metrics.stemLocalizationScore >= 95);

    seenSubtypes.add(sample.problem.subtype);
    seenHindiStems.add(hi.stem);
    seenPunjabiStems.add(pa.stem);
  }

  assert.ok(seenSubtypes.size >= 9);
  assert.ok(seenHindiStems.size > 100);
  assert.ok(seenPunjabiStems.size > 100);
});

test("admin quant-v2 payload exposes localized Hindi and Punjabi question text", () => {
  const previousFlag = process.env.QUANT_V2_PERCENTAGE_ENABLED;
  process.env.QUANT_V2_PERCENTAGE_ENABLED = "1";

  try {
    for (let index = 0; index < 120; index += 1) {
      const question = createQuantV2PercentageQuestionCandidate(
        percentagePattern,
        {
          seed: `admin-multilingual-stem:${index}`,
        },
      );

      assert.ok(question.textHi, "Hindi admin stem missing");
      assert.ok(question.textPa, "Punjabi admin stem missing");
      assert.ok(DEVANAGARI_RE.test(question.textHi), question.textHi);
      assert.ok(GURMUKHI_RE.test(question.textPa), question.textPa);
      assert.notEqual(question.textHi, question.text);
      assert.notEqual(question.textPa, question.text);

      const native = question.nativeRealization as any;
      assert.equal(native.hi.stem, question.textHi);
      assert.equal(native.pa.stem, question.textPa);
      assert.ok(native.hi.explanation.length > 0);
      assert.ok(native.pa.explanation.length > 0);
    }
  } finally {
    if (previousFlag === undefined) {
      delete process.env.QUANT_V2_PERCENTAGE_ENABLED;
    } else {
      process.env.QUANT_V2_PERCENTAGE_ENABLED = previousFlag;
    }
  }
});

export {};
