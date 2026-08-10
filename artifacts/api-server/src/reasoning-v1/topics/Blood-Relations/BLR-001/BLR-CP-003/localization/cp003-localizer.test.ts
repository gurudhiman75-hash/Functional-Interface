import assert from "node:assert/strict";
import { generateBlrCp003FinalApprovedBank } from "../cp003-final-approved-bank";
import {
  BLR_CP003_HUMAN_REVIEW_BLOCKER,
  blrCp003CanonicalParityProjection,
  localizeBlrCp003Question,
  type GeneratedBlrCp003LocalizedQuestion,
} from "./cp003-localizer";
import type { BlrCp003TranslatedLocale } from "./cp003-language-pack";

const canonical = generateBlrCp003FinalApprovedBank();

function buildLocale(locale: BlrCp003TranslatedLocale): readonly GeneratedBlrCp003LocalizedQuestion[] {
  const built: GeneratedBlrCp003LocalizedQuestion[] = [];
  const gaps = new Set<string>();
  for (const source of canonical) {
    try {
      built.push(localizeBlrCp003Question(source, locale));
    } catch (error) {
      gaps.add(error instanceof Error ? error.message : String(error));
    }
  }
  if (gaps.size > 0) {
    console.error(JSON.stringify({ locale, localizationCoverageGaps: [...gaps].sort() }, null, 2));
    assert.fail(`${locale}: ${gaps.size} localization coverage gaps remain.`);
  }
  return built;
}

const hindi = buildLocale("hi-IN");
const punjabi = buildLocale("pa-IN");

assert.equal(canonical.length, 298);
assert.equal(hindi.length, 298);
assert.equal(punjabi.length, 298);

const expectedQlCounts = {
  "BLR-QL-009": 108,
  "BLR-QL-010": 108,
  "BLR-QL-011": 66,
  "BLR-QL-012": 16,
};

for (const bank of [hindi, punjabi]) {
  assert.deepEqual(
    Object.fromEntries(Object.keys(expectedQlCounts).map((qlId) => [
      qlId,
      bank.filter((record) => record.qlId === qlId).length,
    ])),
    expectedQlCounts,
  );
  assert.equal(new Set(bank.map((record) => record.itemId)).size, 298);
  assert.equal(new Set(bank.map((record) => record.questionLanguageId)).size, 298);
  assert.ok(bank.every((record) => record.reviewOnly));
  assert.ok(bank.every((record) => !record.publiclyPublishable));
  assert.ok(bank.every((record) => !record.questionStudioVisible));
  assert.ok(bank.every((record) => !record.questionBankEligible));
  assert.ok(bank.every((record) => !record.mockTestEligible));
  assert.ok(bank.every((record) => !record.metadata.productDeliveryUnlocked));
  assert.ok(bank.every((record) => record.metadata.humanLanguageReviewRequired));
  assert.ok(bank.every((record) => record.metadata.activeEditorialBlockers.length === 1));
  assert.ok(bank.every((record) => record.metadata.activeEditorialBlockers[0] === BLR_CP003_HUMAN_REVIEW_BLOCKER));
}

function stripNames(text: string, source: (typeof canonical)[number]): string {
  let value = text;
  for (const node of source.proceduralLogic.nodes) value = value.split(node.label).join("");
  return value;
}

const forbiddenEnglish = /\b(?:study|following|married|unmarried|mother|father|son|daughter|children|child|siblings?|spouse|wife|husband|parents?|brother|sister|cousins?|which|select|option)\b/i;

for (let index = 0; index < canonical.length; index += 1) {
  const source = canonical[index]!;
  const hi = hindi[index]!;
  const pa = punjabi[index]!;
  assert.deepEqual(blrCp003CanonicalParityProjection(hi), blrCp003CanonicalParityProjection(source));
  assert.deepEqual(blrCp003CanonicalParityProjection(pa), blrCp003CanonicalParityProjection(source));
  assert.equal(hi.correctIndex, source.correctIndex);
  assert.equal(pa.correctIndex, source.correctIndex);
  assert.equal(hi.answerSemanticKey, source.answerSemanticKey);
  assert.equal(pa.answerSemanticKey, source.answerSemanticKey);
  assert.ok(/[\u0900-\u097F]/u.test(stripNames(`${hi.sharedPrompt} ${hi.stem}`, source)), `${source.itemId}: Hindi script missing`);
  assert.ok(/[\u0A00-\u0A7F]/u.test(stripNames(`${pa.sharedPrompt} ${pa.stem}`, source)), `${source.itemId}: Punjabi script missing`);
  assert.ok(!forbiddenEnglish.test(stripNames(`${hi.sharedPrompt} ${hi.stem}`, source)), `${source.itemId}: English leaked into Hindi learner text`);
  assert.ok(!forbiddenEnglish.test(stripNames(`${pa.sharedPrompt} ${pa.stem}`, source)), `${source.itemId}: English leaked into Punjabi learner text`);
  assert.equal(hi.metadata.canonicalSemanticFingerprint, source.metadata.semanticFingerprint);
  assert.equal(pa.metadata.canonicalSemanticFingerprint, source.metadata.semanticFingerprint);
  assert.equal(hi.options.length, 4);
  assert.equal(pa.options.length, 4);
  assert.equal(hi.editorial.optionAnalysis.length, 4);
  assert.equal(pa.editorial.optionAnalysis.length, 4);
}

console.log(JSON.stringify({
  verdict: "BLR_CP003_HI_PA_LOCALISATION_REVIEW_CANDIDATE_PROVED",
  canonicalCount: canonical.length,
  hindiCount: hindi.length,
  punjabiCount: punjabi.length,
  multilingualCandidateCount: hindi.length + punjabi.length,
  qlCounts: expectedQlCounts,
  semanticParity: true,
  humanLanguageReviewRequired: true,
  productDeliveryUnlocked: false,
}, null, 2));
