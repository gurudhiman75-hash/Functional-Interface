import assert from "node:assert/strict";
import test from "node:test";
import type { Pattern } from "../../lib/core/generator-engine";
import { createQuantV2PercentageQuestionCandidate } from "../../lib/quant-v2/percentage-admin-adapter";
import {
  anchorEntry,
  detectAnchorKeys,
} from "../semantic/anchorLexicon";
import { validateSemanticConsistency } from "../validators/semantic-consistency-validator";

const SAMPLE_COUNT = 20000;

const percentagePattern: Pattern = {
  id: "semantic-coherence-percentage",
  type: "formula",
  section: "Quant",
  topic: "percentage",
  subtopic: "percentage",
  difficulty: "Medium",
  templateVariants: ["Semantic coherence percentage pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-percentage",
};

test("quant-v2 multilingual samples keep semantic anchors, domains, and explanations coherent", () => {
  const previousFlag = process.env.QUANT_V2_PERCENTAGE_ENABLED;
  process.env.QUANT_V2_PERCENTAGE_ENABLED = "1";

  try {
    let commercialAnchorCount = 0;
    let electionCount = 0;
    let localizedExplanationCount = 0;

    for (let index = 0; index < SAMPLE_COUNT; index += 1) {
      const question = createQuantV2PercentageQuestionCandidate(
        percentagePattern,
        {
          seed: `semantic-coherence:${index}`,
          examProfile: "ssc",
        },
      );
      const quantV2 = question.debugMetadata?.quantV2 as any;
      const report = validateSemanticConsistency(question);

      assert.equal(report.valid, true, report.issues.join(" | "));
      assert.equal(
        quantV2.validatorReports.semanticConsistency.valid,
        true,
        quantV2.validatorReports.semanticConsistency.issues.join(" | "),
      );
      assert.ok(report.metrics.semanticAnchorConsistencyScore >= 90);
      assert.ok(report.metrics.domainIntegrityScore >= 90);
      assert.ok(report.metrics.explanationLocalizationScore >= 90);
      assert.ok(report.metrics.distractorRealismScore >= 88);
      assert.ok(quantV2.canonicalScenario);
      assert.ok(quantV2.semanticMetadata.canonicalScenario);

      const englishAnchors = detectAnchorKeys(question.text, "en");
      const commercialAnchor = englishAnchors.find(
        (key) => anchorEntry(key)?.domain === "commercial",
      );
      if (commercialAnchor) {
        commercialAnchorCount += 1;
        assert.ok(
          detectAnchorKeys(question.textHi ?? "", "hi").includes(
            commercialAnchor,
          ),
          `Hindi stem drifted from ${commercialAnchor}: ${question.textHi}`,
        );
        assert.ok(
          detectAnchorKeys(question.textPa ?? "", "pa").includes(
            commercialAnchor,
          ),
          `Punjabi stem drifted from ${commercialAnchor}: ${question.textPa}`,
        );
      }

      if (quantV2.category === "election") {
        electionCount += 1;
        const allAnchors = [
          ...detectAnchorKeys(question.text, "en"),
          ...detectAnchorKeys(question.textHi ?? "", "hi"),
          ...detectAnchorKeys(question.textPa ?? "", "pa"),
        ];
        assert.equal(
          allAnchors.some((key) => anchorEntry(key)?.domain === "commercial"),
          false,
          `Election stem leaked commercial object: ${question.text}`,
        );
      }

      if (question.explanationHi && question.explanationPa) {
        localizedExplanationCount += 1;
        assert.ok(!question.explanationHi.includes("Votes remaining for other candidates"));
        assert.ok(!question.explanationPa.includes("Votes remaining for other candidates"));
        assert.ok(!question.explanationHi.includes("Profit percentage"));
        assert.ok(!question.explanationPa.includes("Profit percentage"));
      }
    }

    assert.ok(commercialAnchorCount > 0);
    assert.ok(electionCount > 0);
    assert.equal(localizedExplanationCount, SAMPLE_COUNT);
  } finally {
    if (previousFlag === undefined) {
      delete process.env.QUANT_V2_PERCENTAGE_ENABLED;
    } else {
      process.env.QUANT_V2_PERCENTAGE_ENABLED = previousFlag;
    }
  }
});

export {};

