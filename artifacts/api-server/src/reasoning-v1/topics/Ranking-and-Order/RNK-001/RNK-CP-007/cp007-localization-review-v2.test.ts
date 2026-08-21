import assert from "node:assert/strict";

import { RNK_PARTITION_SCHEMES_V2 } from "../foundation/rnk-derived-object-pool-v2";
import {
  RNK_CP007_EXPECTED_PERMANENT_PROJECTION_SHA256,
  buildRnkCp007PermanentRuntime,
  rnkCp007PermanentProjectionSha256,
} from "./cp007-permanent-runtime-v1";
import {
  rnkCp007CanonicalSemanticFingerprint,
  type RnkCp007LocalizedLocale,
} from "./cp007-localization-review-v1";
import {
  RNK_CP007_LOCALIZATION_REVIEW_V2_AUTHORITY,
  RNK_CP007_LOCALIZATION_REVIEW_V2_EDITORIAL,
  RNK_CP007_LOCALIZATION_REVIEW_V2_VERSION,
  buildRnkCp007LocalizedReviewBankV2,
  buildRnkCp007MultilingualReviewCandidateV2,
  rnkCp007NativeObliquePlural,
  type RnkCp007LocalizedReviewQuestionV2,
} from "./cp007-localization-review-v2";

const canonical = buildRnkCp007PermanentRuntime();
const first = buildRnkCp007MultilingualReviewCandidateV2();
const second = buildRnkCp007MultilingualReviewCandidateV2();
const hindi = first.hindi;
const punjabi = first.punjabi;

assert.equal(canonical.length, 192);
assert.equal(hindi.length, 192);
assert.equal(punjabi.length, 192);
assert.deepEqual(first, second, "CP007 V2 localization must be deterministic");
assert.deepEqual(hindi, buildRnkCp007LocalizedReviewBankV2("hi-IN"));
assert.deepEqual(punjabi, buildRnkCp007LocalizedReviewBankV2("pa-IN"));
assert.equal(
  rnkCp007PermanentProjectionSha256(canonical),
  RNK_CP007_EXPECTED_PERMANENT_PROJECTION_SHA256,
  "V2 learner editorial must not move the frozen English projection",
);

const devanagari = /[\u0900-\u097F]/u;
const gurmukhi = /[\u0A00-\u0A7F]/u;
const residualEnglishWord = /[A-Za-z]{2,}/u;
const badHindiCompactRank = /ऊपर से \d+वें है/u;
const badPunjabiCompactRank = /ਉੱਪਰੋਂ \d+ਵੇਂ ਹੈ/u;
const badHindiMembership = /(?:लड़के|लड़कियाँ|विद्यार्थी|अभ्यर्थी|प्रशिक्षु|प्रतिभागी|कर्मचारी|आवेदक|परीक्षार्थी) में से/u;
const badPunjabiMembership = /(?:ਮੁੰਡੇ|ਵਿਦਿਆਰਥੀ|ਉਮੀਦਵਾਰ|ਸਿਖਿਆਰਥੀ|ਭਾਗੀਦਾਰ|ਕਰਮਚਾਰੀ|ਅਰਜ਼ੀਦਾਰ|ਪਰੀਖਿਆਰਥੀ) ਵਿੱਚੋਂ/u;

for (const partition of RNK_PARTITION_SCHEMES_V2) {
  for (const locale of ["hi-IN", "pa-IN"] as const) {
    const key = locale === "hi-IN" ? "hi" : "pa";
    assert.doesNotThrow(() => rnkCp007NativeObliquePlural(partition.wholeLabels[key], locale));
    assert.doesNotThrow(() => rnkCp007NativeObliquePlural(partition.categories[0][key], locale));
    assert.doesNotThrow(() => rnkCp007NativeObliquePlural(partition.categories[1][key], locale));
  }
}

const modeCounts = new Map<string, number>();
const styleCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const answerPositionCounts = [0, 0, 0, 0];
const canonicalFingerprints = new Set<string>();
const hindiLocalizationFingerprints = new Set<string>();
const punjabiLocalizationFingerprints = new Set<string>();
let compactHindiChecked = 0;
let compactPunjabiChecked = 0;

function assertLocalizedRecord(
  localized: RnkCp007LocalizedReviewQuestionV2,
  source: (typeof canonical)[number],
  locale: RnkCp007LocalizedLocale,
): void {
  assert.equal(localized.locale, locale);
  assert.equal(localized.canonicalLocale, "en-IN");
  assert.equal(localized.permanentProfile.permanentQlId, "RNK-QL-042");
  assert.equal(localized.permanentProfile.authorityId, "CATEGORY_COMPOSITION_AROUND_RANK");
  assert.equal(localized.permanentProfile.permanentOrdinal, source.permanentProfile.permanentOrdinal);
  assert.equal(localized.candidateOrdinal, source.candidateOrdinal);
  assert.equal(localized.mode, source.mode);
  assert.equal(localized.difficulty, source.difficulty);
  assert.equal(localized.answerIndex, source.answerIndex);
  assert.equal(localized.answer, source.answer);
  assert.deepEqual(localized.options, source.options);
  assert.deepEqual(localized.state, source.state);
  assert.deepEqual(localized.evidence, source.evidence);
  assert.equal(localized.mathematicalFingerprint, source.mathematicalFingerprint);
  assert.equal(localized.permanentRuntimeFingerprint, source.permanentRuntimeFingerprint);
  assert.equal(localized.reviewMetadata.partitionId, source.reviewMetadata.partitionId);
  assert.equal(localized.reviewMetadata.surfaceProfile.style, source.reviewMetadata.surfaceProfile.style);
  assert.equal(localized.reviewMetadata.requestedCategory, source.reviewMetadata.requestedCategory);
  assert.equal(localized.reviewMetadata.requestedSide, source.reviewMetadata.requestedSide);
  assert.equal(localized.reviewMetadata.canonicalTargetName, source.reviewMetadata.targetName);

  const combinedLearnerText = `${localized.stem}\n${localized.explanation}`;
  if (locale === "hi-IN") {
    assert.match(combinedLearnerText, devanagari);
    assert.equal(badHindiCompactRank.test(localized.stem), false, localized.stem);
    assert.equal(badHindiMembership.test(localized.stem), false, localized.stem);
  } else {
    assert.match(combinedLearnerText, gurmukhi);
    assert.equal(badPunjabiCompactRank.test(localized.stem), false, localized.stem);
    assert.equal(badPunjabiMembership.test(localized.stem), false, localized.stem);
  }
  assert.equal(residualEnglishWord.test(combinedLearnerText), false, combinedLearnerText);
  assert.equal(/[{}]/u.test(combinedLearnerText), false, "placeholder leak detected");
  assert.equal(localized.stem.includes("रहने वाले"), false);
  assert.equal(localized.stem.includes("ਰਹਿਣ ਵਾਲੇ"), false);

  if (source.reviewMetadata.surfaceProfile.style === "COMPACT_RATIO") {
    if (locale === "hi-IN") {
      assert.match(
        localized.stem,
        new RegExp(`ऊपर से ${source.state.targetRankFromTop}वें स्थान पर है`, "u"),
      );
      compactHindiChecked += 1;
    } else {
      assert.match(
        localized.stem,
        new RegExp(`ਉੱਪਰੋਂ ${source.state.targetRankFromTop}ਵੇਂ ਸਥਾਨ 'ਤੇ ਹੈ`, "u"),
      );
      compactPunjabiChecked += 1;
    }
  }

  assert.equal(localized.reviewMetadata.localization.version, RNK_CP007_LOCALIZATION_REVIEW_V2_VERSION);
  assert.equal(localized.reviewMetadata.localization.locale, locale);
  assert.equal(localized.reviewMetadata.localization.editorialVersion, RNK_CP007_LOCALIZATION_REVIEW_V2_EDITORIAL);
  assert.equal(localized.reviewMetadata.localization.humanLanguageReviewRequired, true);

  assert.equal(localized.lifecycle.permanentQlAllocated, true);
  assert.equal(localized.lifecycle.englishFrozen, true);
  assert.equal(localized.lifecycle.questionStudio, "DISABLED");
  assert.equal(localized.lifecycle.persistence, "DISABLED");
  assert.equal(localized.lifecycle.questionBank, "NOT_STORED");
  assert.equal(localized.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(localized.lifecycle.publiclyPublishable, false);
  assert.equal(localized.lifecycle.hindiPunjabi, "REVIEW_CANDIDATE");
  assert.equal(localized.lifecycle.humanLanguageReviewRequired, true);
  assert.equal(localized.lifecycle.productDeliveryUnlocked, false);

  assert.equal(localized.localizationProof.authority, RNK_CP007_LOCALIZATION_REVIEW_V2_AUTHORITY);
  assert.equal(localized.localizationProof.editorialVersion, RNK_CP007_LOCALIZATION_REVIEW_V2_EDITORIAL);
  assert.equal(localized.localizationProof.sourceAuthority, "RNK_CP007_ENGLISH_FREEZE_V1");
  assert.equal(localized.localizationProof.semanticParity, "EXECUTABLE_PROVED");
  assert.equal(localized.localizationProof.humanLanguageReviewRequired, true);
  assert.equal(localized.localizationProof.multilingualFreezeGranted, false);
  assert.equal(localized.localizationProof.productDeliveryUnlocked, false);
  assert.equal(
    localized.localizationProof.canonicalSemanticFingerprint,
    rnkCp007CanonicalSemanticFingerprint(source),
  );
}

for (let index = 0; index < canonical.length; index += 1) {
  const source = canonical[index]!;
  const hi = hindi[index]!;
  const pa = punjabi[index]!;
  assertLocalizedRecord(hi, source, "hi-IN");
  assertLocalizedRecord(pa, source, "pa-IN");

  assert.equal(hi.localizationProof.canonicalItemId, pa.localizationProof.canonicalItemId);
  assert.equal(
    hi.localizationProof.canonicalSemanticFingerprint,
    pa.localizationProof.canonicalSemanticFingerprint,
  );
  assert.notEqual(
    hi.localizationProof.localizationFingerprint,
    pa.localizationProof.localizationFingerprint,
  );

  canonicalFingerprints.add(hi.localizationProof.canonicalSemanticFingerprint);
  hindiLocalizationFingerprints.add(hi.localizationProof.localizationFingerprint);
  punjabiLocalizationFingerprints.add(pa.localizationProof.localizationFingerprint);

  modeCounts.set(source.mode, (modeCounts.get(source.mode) ?? 0) + 1);
  styleCounts.set(
    source.reviewMetadata.surfaceProfile.style,
    (styleCounts.get(source.reviewMetadata.surfaceProfile.style) ?? 0) + 1,
  );
  difficultyCounts.set(source.difficulty, (difficultyCounts.get(source.difficulty) ?? 0) + 1);
  answerPositionCounts[source.answerIndex] += 1;
}

assert.equal(canonicalFingerprints.size, 192);
assert.equal(hindiLocalizationFingerprints.size, 192);
assert.equal(punjabiLocalizationFingerprints.size, 192);
assert.deepEqual([...modeCounts.values()].sort((a, b) => a - b), [48, 48, 48, 48]);
assert.deepEqual([...styleCounts.values()].sort((a, b) => a - b), [48, 48, 48, 48]);
assert.equal(difficultyCounts.get("MEDIUM"), 144);
assert.equal(difficultyCounts.get("HARD"), 48);
assert.deepEqual(answerPositionCounts, [48, 48, 48, 48]);
assert.equal(compactHindiChecked, 48);
assert.equal(compactPunjabiChecked, 48);

const serialized = JSON.stringify({ hindi, punjabi });
assert.equal(serialized.includes("RNK-QL-043"), false, "RNK-QL-043 must remain unallocated");

console.log(JSON.stringify({
  status: "PASS",
  version: RNK_CP007_LOCALIZATION_REVIEW_V2_VERSION,
  editorialVersion: RNK_CP007_LOCALIZATION_REVIEW_V2_EDITORIAL,
  authority: RNK_CP007_LOCALIZATION_REVIEW_V2_AUTHORITY,
  canonicalQuestions: canonical.length,
  hindiReviewCandidates: hindi.length,
  punjabiReviewCandidates: punjabi.length,
  totalLocalizedReviewCandidates: hindi.length + punjabi.length,
  compactRankGrammarChecks: compactHindiChecked + compactPunjabiChecked,
  permanentQl: "RNK-QL-042",
  nextAvailableQl: "RNK-QL-043",
  semanticParity: "EXECUTABLE_PROVED",
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
  questionStudio: "DISABLED",
  persistence: "DISABLED",
  publicPublication: false,
}, null, 2));
