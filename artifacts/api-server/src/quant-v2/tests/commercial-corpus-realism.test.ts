import assert from "node:assert/strict";
import test from "node:test";
import type { Pattern } from "../../lib/core/generator-engine";
import { createQuantV2PercentageQuestionCandidate } from "../../lib/quant-v2/percentage-admin-adapter";
import { validateCommercialCorpusRealism } from "../validators/commercial-corpus-realism-validator";
import { leakedInternalExplanationTerms } from "../quality/teacher-explanation-normalizer";
import { semanticDuplicateKey } from "../quality/corpus-fingerprints";

const SAMPLE_COUNT = 20000;
const DISALLOWED_LOCALIZED_ASCII_RE = /\b[A-Za-z]{2,}\b/u;
const BROKEN_ENGLISH_STEM_RE =
  /Compared with|has \d+(?:\.\d+)?% (?:more|less) value|percentage difference|Find the total value|pure component/iu;

function finalLine(text: string | null | undefined) {
  return String(text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1);
}

function incompleteFinalLine(text: string | null | undefined) {
  const line = finalLine(text);
  return (
    !line ||
    /[:=]\s*$/u.test(line) ||
    /(?:[+\-*/xX]|\()\s*$/u.test(line) ||
    !/\d/u.test(line)
  );
}

const percentagePattern: Pattern = {
  id: "commercial-realism-percentage",
  type: "formula",
  section: "Quant",
  topic: "percentage",
  subtopic: "percentage",
  difficulty: "Medium",
  templateVariants: ["Commercial realism percentage pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-percentage",
};

test("quant-v2 commercial corpus exposes examiner intent, fingerprints, and anti-template signals", () => {
  const previousFlag = process.env.QUANT_V2_PERCENTAGE_ENABLED;
  process.env.QUANT_V2_PERCENTAGE_ENABLED = "1";

  try {
    const samples = [];
    const compositeFingerprints = new Set<string>();
    const semanticDuplicateKeys = new Map<string, number>();
    const intentCounts: Record<string, number> = {};
    let lowPlausibilityCount = 0;
    let leakageCount = 0;

    for (let index = 0; index < SAMPLE_COUNT; index += 1) {
      const question = createQuantV2PercentageQuestionCandidate(
        percentagePattern,
        {
          seed: `commercial-realism:${index}`,
          examProfile: "ssc",
        },
      );
      const quantV2 = question.debugMetadata?.quantV2 as any;
      const problem = quantV2.canonicalProblem;
      const graph = quantV2.reasoningGraph;
      const editorial = quantV2.editorial;
      const fingerprints = quantV2.semanticMetadata.corpusFingerprints;
      const examinerIntent = quantV2.semanticMetadata.examinerIntent;
      const distractorIntelligence = quantV2.semanticMetadata.distractorIntelligence;

      samples.push({ problem, graph, editorial });
      compositeFingerprints.add(fingerprints.compositeFingerprint);
      const duplicateKey = semanticDuplicateKey(fingerprints);
      semanticDuplicateKeys.set(
        duplicateKey,
        (semanticDuplicateKeys.get(duplicateKey) ?? 0) + 1,
      );
      intentCounts[examinerIntent.primaryIntent] =
        (intentCounts[examinerIntent.primaryIntent] ?? 0) + 1;
      leakageCount += leakedInternalExplanationTerms(question.explanation).length;

      assert.equal(
        BROKEN_ENGLISH_STEM_RE.test(question.text),
        false,
        question.text,
      );
      assert.equal(
        DISALLOWED_LOCALIZED_ASCII_RE.test(String(question.explanationHi ?? "")),
        false,
        String(question.explanationHi ?? ""),
      );
      assert.equal(
        DISALLOWED_LOCALIZED_ASCII_RE.test(String(question.explanationPa ?? "")),
        false,
        String(question.explanationPa ?? ""),
      );
      assert.equal(
        incompleteFinalLine(question.explanationHi),
        false,
        String(question.explanationHi ?? ""),
      );
      assert.equal(
        incompleteFinalLine(question.explanationPa),
        false,
        String(question.explanationPa ?? ""),
      );
      const realismScore = Number(question.examRealismMetadata?.realismScore ?? 0);
      if (problem.subtype === "salary_revision") {
        assert.ok(realismScore <= 72, `salary realism cap failed: ${realismScore}`);
      }
      if (problem.subtype === "restore_original") {
        assert.ok(realismScore <= 72, `restore realism cap failed: ${realismScore}`);
      }
      if (problem.subtype === "price_consumption") {
        assert.ok(realismScore <= 75, `price-consumption realism cap failed: ${realismScore}`);
      }
      if (
        problem.subtype === "relational_percentage" &&
        Number(problem.variables.relationCount ?? 1) <= 1
      ) {
        assert.ok(realismScore <= 70, `single relation realism cap failed: ${realismScore}`);
      }

      assert.ok(fingerprints.topologyFingerprint);
      assert.ok(fingerprints.operationFingerprint);
      assert.ok(fingerprints.percentageVectorFingerprint);
      assert.ok(fingerprints.numericInstantiationFingerprint);
      assert.ok(fingerprints.semanticIntentFingerprint);
      assert.ok(fingerprints.distractorPatternFingerprint !== undefined);
      assert.ok(examinerIntent.primaryIntent);
      assert.ok(examinerIntent.intentQualityScore >= 55);
      assert.ok(Array.isArray(distractorIntelligence));
      assert.ok(distractorIntelligence.length >= 3);

      for (const distractor of distractorIntelligence) {
        assert.ok(distractor.trapType);
        assert.ok(distractor.reasoningPath.length > 0);
        if (distractor.plausibility < 45 || distractor.eliminateRisk > 75) {
          lowPlausibilityCount += 1;
        }
      }
    }

    const duplicateCount = [...semanticDuplicateKeys.values()].reduce(
      (sum, count) => sum + Math.max(0, count - 1),
      0,
    );
    const commercialAudit = validateCommercialCorpusRealism(samples);

    assert.equal(
      commercialAudit.valid,
      true,
      `${commercialAudit.issues.join(" | ")} :: ${JSON.stringify(commercialAudit.metrics)}`,
    );
    assert.ok(compositeFingerprints.size > SAMPLE_COUNT * 0.04);
    assert.ok(duplicateCount / SAMPLE_COUNT <= 0.96);
    assert.ok(Object.keys(intentCounts).length >= 7);
    assert.ok(lowPlausibilityCount / (SAMPLE_COUNT * 3) < 0.18);
    assert.equal(leakageCount, 0);
  } finally {
    if (previousFlag === undefined) {
      delete process.env.QUANT_V2_PERCENTAGE_ENABLED;
    } else {
      process.env.QUANT_V2_PERCENTAGE_ENABLED = previousFlag;
    }
  }
});

export {};
