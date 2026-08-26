import assert from "node:assert/strict";

import {
  SEA002_CP008_ENGLISH_REVIEW_SET_V1,
  type Sea002Cp008ReviewCandidate,
} from "./production-review-v1.ts";
import { SEA002_CP008_PERMANENT_QL_IDS } from "./permanent/registry.ts";

function words(value: string): number {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function queryIsDirect(candidate: Sea002Cp008ReviewCandidate): boolean {
  return candidate.clues.some((clue) => {
    if (candidate.query.kind === "OPPOSITE") {
      return clue.kind === "OPPOSITE"
        && ((clue.a === candidate.query.reference && clue.b === candidate.answer)
          || (clue.b === candidate.query.reference && clue.a === candidate.answer));
    }
    if (candidate.query.kind === "RELATIVE_METRIC") {
      return clue.kind === "RELATIVE_METRIC"
        && clue.reference === candidate.query.reference
        && clue.subject === candidate.answer
        && clue.direction === candidate.query.direction
        && clue.metres === candidate.query.metres;
    }
    return clue.kind === "RELATIVE"
      && clue.reference === candidate.query.reference
      && clue.subject === candidate.answer
      && clue.direction === candidate.query.direction
      && clue.steps === candidate.query.steps;
  });
}

assert.equal(SEA002_CP008_ENGLISH_REVIEW_SET_V1.length, 42);
assert.equal(new Set(SEA002_CP008_ENGLISH_REVIEW_SET_V1.map((candidate) => candidate.fingerprint)).size, 42);
assert.equal(new Set(SEA002_CP008_ENGLISH_REVIEW_SET_V1.map((candidate) => candidate.stem)).size, 42);

let maxStemWords = 0;
let maxExplanationWords = 0;
let mixedFacingCandidates = 0;
let nonDirectChecks = 0;

for (const permanentQlId of SEA002_CP008_PERMANENT_QL_IDS) {
  const group = SEA002_CP008_ENGLISH_REVIEW_SET_V1.filter((candidate) => candidate.permanentQlId === permanentQlId);
  assert.equal(group.length, 6, `${permanentQlId}: expected six canonical review surfaces`);
  assert.deepEqual(group.map((candidate) => candidate.difficulty).sort(), ["Easy", "Easy", "Hard", "Hard", "Medium", "Medium"]);
  assert.equal(new Set(group.map((candidate) => candidate.seed)).size, 6);
  assert.ok(new Set(group.map((candidate) => candidate.examLineage)).size >= 3, `${permanentQlId}: lineage pool too thin`);
}

for (const candidate of SEA002_CP008_ENGLISH_REVIEW_SET_V1) {
  assert.equal(candidate.reviewStatus, "ENGLISH_REVIEW_CANDIDATE_HUMAN_APPROVAL_PENDING");
  assert.equal(candidate.active, false);
  assert.equal(candidate.questionStudioDiscoverable, false);
  assert.equal(candidate.questionBankWritable, false);
  assert.equal(candidate.publiclyPublishable, false);
  assert.equal(candidate.options.length, 4);
  assert.equal(new Set(candidate.options).size, 4);
  assert.equal(candidate.options[candidate.correctOptionIndex], candidate.answer);
  assert.equal(candidate.options.filter((option) => option === candidate.answer).length, 1);
  assert.equal(candidate.fingerprint.length, 64);
  assert.equal(queryIsDirect(candidate), false, `${candidate.permanentQlId}/${candidate.variantIndex}: query copied directly from clue`);
  nonDirectChecks += 1;

  const stemWords = words(candidate.stem);
  const explanationWords = words(candidate.explanation);
  maxStemWords = Math.max(maxStemWords, stemWords);
  maxExplanationWords = Math.max(maxExplanationWords, explanationWords);
  assert.ok(stemWords >= 70, `${candidate.permanentQlId}/${candidate.variantIndex}: stem suspiciously thin (${stemWords})`);
  assert.ok(stemWords <= 240, `${candidate.permanentQlId}/${candidate.variantIndex}: stem too cluttered (${stemWords})`);
  assert.ok(explanationWords >= 25, `${candidate.permanentQlId}/${candidate.variantIndex}: explanation too thin`);
  assert.ok(explanationWords <= 115, `${candidate.permanentQlId}/${candidate.variantIndex}: explanation too long`);
  assert.match(candidate.explanation, new RegExp(`\\b${candidate.answer}\\b`, "u"));
  assert.doesNotMatch(candidate.stem, /prototype|constraint spine|seatIndex|structural fingerprint|column/iu);
  assert.doesNotMatch(candidate.explanation, /prototype|constraint spine|seatIndex|structural fingerprint|column/iu);
  assert.doesNotMatch(candidate.stem, /\b(?:sits|faces)\/(?:sit|face)\b/iu);

  if (new Set(candidate.participants.map((participant) => participant.facing)).size > 1) mixedFacingCandidates += 1;
}

const ql029 = SEA002_CP008_ENGLISH_REVIEW_SET_V1.filter((candidate) => candidate.permanentQlId === "SEA-QL-029");
assert.ok(ql029.some((candidate) => candidate.facingMode === "CORNERS_IN_SIDES_OUT"));
assert.ok(ql029.some((candidate) => candidate.facingMode === "CORNERS_OUT_SIDES_IN"));
const ql032 = SEA002_CP008_ENGLISH_REVIEW_SET_V1.filter((candidate) => candidate.permanentQlId === "SEA-QL-032");
assert.ok(ql032.some((candidate) => candidate.facingMode === "ALL_IN"));
assert.ok(ql032.some((candidate) => candidate.facingMode === "ALL_OUT"));
const ql035 = SEA002_CP008_ENGLISH_REVIEW_SET_V1.filter((candidate) => candidate.permanentQlId === "SEA-QL-035");
assert.ok(ql035.every((candidate) => /60 m/u.test(candidate.stem)));
assert.ok(ql035.every((candidate) => /5 m/u.test(candidate.stem)));
assert.ok(mixedFacingCandidates >= 12);

console.log("PASS_SEA002_CP008_ENGLISH_REVIEW_V1");
console.log("canonical English surfaces", SEA002_CP008_ENGLISH_REVIEW_SET_V1.length);
console.log("permanent QLs covered", SEA002_CP008_PERMANENT_QL_IDS.length);
console.log("surfaces per QL", 6);
console.log("non-direct query checks", nonDirectChecks);
console.log("mixed-facing surfaces", mixedFacingCandidates);
console.log("max stem words", maxStemWords);
console.log("max explanation words", maxExplanationWords);
console.log("human approval", "PENDING");
console.log("Studio/Bank/public", false, false, false);
