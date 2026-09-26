import assert from "node:assert/strict";

import { RNK_001_CHAPTER_AUTHORITY } from "./manifest";
import { generateRnk001QuestionStudioBatch } from "./rnk-001-question-studio-integration-v2";

const bannedStemPatterns = [
  /\bassociated\b/iu,
  /\bbest describes\b/iu,
  /requested physical end/iu,
  /\bstart end\b/iu,
  /\bend end\b/iu,
  /\bthe first person\b/iu,
  /\bthe second person\b/iu,
  /\bcanonical\b/iu,
  /\bauthority(?:Id)?\b/iu,
  /\bprototype(?:Id)?\b/iu,
  /\bruntime fingerprint\b/iu,
  /\breview metadata\b/iu,
  /\bundefined\b/iu,
  /\bNaN\b/u,
  /\[object Object\]/u,
];

const bannedOptionPatterns = [
  /\bcanonical\b/iu,
  /\bauthority(?:Id)?\b/iu,
  /\bprototype(?:Id)?\b/iu,
  /\bruntime fingerprint\b/iu,
  /\breview metadata\b/iu,
  /\bundefined\b/iu,
  /\bNaN\b/u,
  /\[object Object\]/u,
];

const genericWrongExplanation = /^(?:wrong|incorrect|not correct|this is wrong|this option is wrong)\.?$/iu;

function stringOptions(question: Record<string, any>): string[] {
  return (question.options as readonly unknown[]).map((option) => String(option).trim());
}

function sourceOptionRecords(question: Record<string, any>): Array<Record<string, any>> {
  const source = question.source as Record<string, any> | undefined;
  if (!source || !Array.isArray(source.options)) return [];
  return source.options.filter(
    (option: unknown): option is Record<string, any> => typeof option === "object" && option !== null,
  );
}

let totalGenerated = 0;
let structuredWrongExplanationsChecked = 0;
const diversity: Record<string, number> = {};

for (const qlId of RNK_001_CHAPTER_AUTHORITY.permanentQlIds) {
  const batch = await generateRnk001QuestionStudioBatch({
    packageId: "RNK-001",
    canonicalProblemId: qlId,
    language: "en",
    count: 6,
    seed: `rnk-wave04:${qlId}`,
  });

  assert.equal(batch.questions.length, 6, `${qlId} must produce six review instances`);
  const stems = new Set<string>();

  for (const raw of batch.questions as Array<Record<string, any>>) {
    totalGenerated += 1;

    const stem = String(raw.stem ?? "").trim();
    stems.add(stem);
    assert.ok(stem.length >= 20, `${qlId} stem is too thin to be exam-ready`);
    assert.ok(stem.length <= 1800, `${qlId} stem is excessively long`);
    assert.equal(/\s{3,}/u.test(stem), false, `${qlId} has broken whitespace`);

    for (const pattern of bannedStemPatterns) {
      assert.doesNotMatch(stem, pattern, `${qlId} leaked mechanical/internal wording into the stem`);
    }

    if (qlId >= "RNK-QL-018" && qlId <= "RNK-QL-026") {
      assert.doesNotMatch(stem, /What are [A-Z][A-Za-z'’-]*'s rank .+ and [A-Z][A-Za-z'’-]*'s rank .+, respectively\?/u);
      assert.doesNotMatch(stem, /What were [A-Z][A-Za-z'’-]*'s original rank .+ and [A-Z][A-Za-z'’-]*'s original rank .+, respectively\?/u);
    }

    const options = stringOptions(raw);
    assert.ok(options.length === 4 || options.length === 5, `${qlId} must expose four or five options`);
    assert.equal(new Set(options).size, options.length, `${qlId} contains duplicate options`);
    assert.ok(options.every((option) => option.length > 0), `${qlId} contains an empty option`);

    for (const option of options) {
      for (const pattern of bannedOptionPatterns) {
        assert.doesNotMatch(option, pattern, `${qlId} leaked implementation wording into an option`);
      }
    }

    assert.equal(raw.correctIndex >= 0 && raw.correctIndex < options.length, true);
    assert.equal(options[raw.correctIndex], String(raw.answer).trim());

    const records = sourceOptionRecords(raw);
    if (records.length > 0) {
      for (let index = 0; index < records.length; index += 1) {
        if (index === raw.correctIndex) continue;
        const explanation = typeof records[index]!.explanation === "string"
          ? records[index]!.explanation.trim()
          : "";
        if (!explanation) continue;
        structuredWrongExplanationsChecked += 1;
        assert.doesNotMatch(explanation, genericWrongExplanation, `${qlId} has a generic wrong-option explanation`);
        assert.ok(explanation.length >= 12, `${qlId} wrong-option explanation is too shallow`);
      }
    }

    assert.equal(raw.questionBankWritable, false);
    assert.equal(raw.testEligible, false);
    assert.equal(raw.mockTestEligible, false);
    assert.equal(raw.publiclyPublishable, false);
    assert.equal(raw.productionReleaseAuthorized, false);
  }

  diversity[qlId] = stems.size;
  assert.ok(stems.size >= 2, `${qlId} generated six times but did not vary its learner stem`);
}

assert.ok(structuredWrongExplanationsChecked >= 60, "Wave 04 must exercise a substantial structured-distractor sample");

console.log(JSON.stringify({
  verdict: "PASS_RNK_001_FINAL_AUDIT_WAVE_04_STEM_AND_DISTRACTOR_QUALITY",
  qlCoverage: "RNK-QL-001..042",
  generatedEnglishInstancesAudited: totalGenerated,
  structuredWrongExplanationsChecked,
  minimumDistinctStemsPerQl: Math.min(...Object.values(diversity)),
  bannedMechanicalStemLanguage: true,
  optionUniquenessGuard: true,
  reasonSpecificStructuredDistractorGuard: true,
  lifecycle: "REVIEW_ONLY",
}, null, 2));
