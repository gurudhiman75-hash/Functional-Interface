import assert from "node:assert/strict";

import {
  RNK_CP007_EXPECTED_PERMANENT_PROJECTION_SHA256,
  buildRnkCp007PermanentRuntime,
  rnkCp007PermanentProjectionSha256,
} from "./cp007-permanent-runtime-v1";
import {
  RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_VERSION,
  buildRnkCp007PercentagePresentationBank,
} from "./cp007-percentage-presentation-adapter-v1";

const canonical = buildRnkCp007PermanentRuntime();
const english = buildRnkCp007PercentagePresentationBank("en-IN");
const hindi = buildRnkCp007PercentagePresentationBank("hi-IN");
const punjabi = buildRnkCp007PercentagePresentationBank("pa-IN");
const replay = buildRnkCp007PercentagePresentationBank("pa-IN");

assert.equal(rnkCp007PermanentProjectionSha256(canonical), RNK_CP007_EXPECTED_PERMANENT_PROJECTION_SHA256);
assert.ok(english.length > 0, "percentage adapter must expose at least one source-backed boys/girls question");
assert.equal(hindi.length, english.length);
assert.equal(punjabi.length, english.length);
assert.deepEqual(replay, punjabi, "percentage adapter must replay deterministically");

let hasFortySixty = false;

for (let index = 0; index < english.length; index += 1) {
  const en = english[index]! as Record<string, any>;
  const hi = hindi[index]! as Record<string, any>;
  const pa = punjabi[index]! as Record<string, any>;
  const profile = en.percentagePresentation;

  assert.equal(profile.version, RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_VERSION);
  assert.equal(profile.targetQlId, "RNK-QL-042");
  assert.equal(profile.newQlAllocated, false);
  assert.equal(profile.mathematicalAuthorityChanged, false);
  assert.equal(profile.examProfileDeliveryOnly, true);
  assert.equal(profile.percentageA + profile.percentageB, 100);
  assert.equal((en.state.total * profile.percentageA) / 100, en.state.categoryATotal);
  assert.equal((en.state.total * profile.percentageB) / 100, en.state.categoryBTotal);
  assert.equal(en.permanentProfile.permanentQlId, "RNK-QL-042");
  assert.equal(en.reviewMetadata.partitionId, "boys-girls");
  assert.equal(hi.permanentRuntimeFingerprint, en.permanentRuntimeFingerprint);
  assert.equal(pa.permanentRuntimeFingerprint, en.permanentRuntimeFingerprint);
  assert.equal(hi.mathematicalFingerprint, en.mathematicalFingerprint);
  assert.equal(pa.mathematicalFingerprint, en.mathematicalFingerprint);
  assert.deepEqual(hi.options, en.options);
  assert.deepEqual(pa.options, en.options);
  assert.equal(hi.answerIndex, en.answerIndex);
  assert.equal(pa.answerIndex, en.answerIndex);
  assert.equal(hi.answer, en.answer);
  assert.equal(pa.answer, en.answer);
  assert.equal(en.lifecycle.questionStudio, "DISABLED");
  assert.equal(en.lifecycle.persistence, "DISABLED");
  assert.equal(en.lifecycle.questionBank, "NOT_STORED");
  assert.equal(en.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(en.lifecycle.publiclyPublishable, false);

  assert.match(en.stem, /%/u);
  assert.match(hi.stem, /%/u);
  assert.match(pa.stem, /%/u);
  assert.doesNotMatch(en.stem, /ratio|\d+:\d+/iu);
  assert.doesNotMatch(hi.stem, /अनुपात|\d+:\d+/u);
  assert.doesNotMatch(pa.stem, /ਅਨੁਪਾਤ|\d+:\d+/u);
  assert.match(en.explanation, /%/u);
  assert.match(hi.explanation, /%/u);
  assert.match(pa.explanation, /%/u);

  if (
    (profile.percentageA === 40 && profile.percentageB === 60) ||
    (profile.percentageA === 60 && profile.percentageB === 40)
  ) {
    hasFortySixty = true;
  }
}

assert.equal(hasFortySixty, true, "adapter must cover the SSC-style 40/60 partition lane");

console.log(JSON.stringify({
  status: "PASS",
  version: RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_VERSION,
  eligibleQuestions: english.length,
  locales: ["en-IN", "hi-IN", "pa-IN"],
  hasFortySixty,
  frozenPermanentProjection: RNK_CP007_EXPECTED_PERMANENT_PROJECTION_SHA256,
  newQlAllocated: false,
  multilingualFreezeGranted: false,
}, null, 2));
