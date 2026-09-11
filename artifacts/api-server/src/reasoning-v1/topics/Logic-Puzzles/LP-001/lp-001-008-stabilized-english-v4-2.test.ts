import assert from "node:assert/strict";
import { generateLp001BatchStabilizedV4 } from "./lp-001-008-stabilized-english-v4.ts";
import {
  LP_001_008_STABILIZED_ENGLISH_V4_2,
  buildLp001ClueBundles,
  generateLp001BatchStabilizedV4_2,
} from "./lp-001-008-stabilized-english-v4-2.ts";

function semanticChild(child: any) {
  const { explanation: _explanation, ...rest } = child;
  return rest;
}

assert.equal(LP_001_008_STABILIZED_ENGLISH_V4_2.lp001ClueRule, "CLUB_REPETITIONS_ONLY");
assert.equal(LP_001_008_STABILIZED_ENGLISH_V4_2.singleClues, "UNCHANGED");
assert.equal(LP_001_008_STABILIZED_ENGLISH_V4_2.semanticCluesRetained, true);

const seed = "lp-v4-2-club-repetitions-proof";
const base = generateLp001BatchStabilizedV4(seed, 100);
const revised = generateLp001BatchStabilizedV4_2(seed, 100);
assert.equal(revised.length, base.length);

let exclusionBundles = 0;
let differentBundles = 0;
let totalBundledClauses = 0;

for (let index = 0; index < revised.length; index += 1) {
  const before = base[index]!;
  const after = revised[index]!;

  assert.equal(after.caseletId, before.caseletId);
  assert.deepEqual(after.assignment, before.assignment, `${after.caseletId}: assignment changed`);
  assert.deepEqual(after.people, before.people, `${after.caseletId}: people changed`);
  assert.deepEqual(after.groups, before.groups, `${after.caseletId}: groups changed`);
  assert.deepEqual(after.clues, before.clues, `${after.caseletId}: semantic clues changed`);
  assert.equal(after.difficultyBand, before.difficultyBand, `${after.caseletId}: difficulty changed`);
  assert.deepEqual(after.children.map(semanticChild), before.children.map(semanticChild), `${after.caseletId}: question/options/answers changed`);

  const bundles = buildLp001ClueBundles(after);
  const indexes = bundles.flatMap((bundle) => bundle.originalIndexes).sort((a, b) => a - b);
  assert.deepEqual(indexes, before.clues.map((_, clueIndex) => clueIndex), `${after.caseletId}: a semantic clue was lost or duplicated while bundling`);
  assert.deepEqual(after.learnerFacingClues, bundles.map((bundle) => bundle.text));

  for (const bundle of bundles) {
    if (bundle.clues.length === 1) {
      assert.equal(bundle.text, bundle.clues[0]!.text, `${after.caseletId}: a non-repeated clue was rewritten`);
      continue;
    }
    totalBundledClauses += bundle.clues.length;
    const kinds = new Set(bundle.clues.map((clue) => clue.kind));
    assert.equal(kinds.size, 1, `${after.caseletId}: unrelated clue types were merged`);
    const kind = bundle.clues[0]!.kind;
    if (kind === "NOT_IN_GROUP") {
      exclusionBundles += 1;
      assert.match(bundle.text, /\bneither\b.+\bnor\b/iu, `${after.caseletId}: repeated exclusions were not clubbed as neither/nor`);
      assert.doesNotMatch(bundle.text, /\beither\b/iu, `${after.caseletId}: old overlapping either/or rewrite survived`);
    } else if (kind === "DIFFERENT_GROUPS") {
      differentBundles += 1;
      assert.match(bundle.text, /\bdifferent\b.+\bboth\b|\bdifferent\b.+\beach\b/iu, `${after.caseletId}: repeated different-group clauses were not clubbed`);
    } else {
      assert.fail(`${after.caseletId}: ${kind} clauses should not be bundled`);
    }
  }

  const explanation = after.children[0]!.explanation.lines.join("\n\n");
  for (const displayClue of after.learnerFacingClues) assert.ok(explanation.includes(displayClue), `${after.caseletId}: displayed clue missing from explanation`);
  assert.ok(explanation.includes("| Person | Panel / group |"), `${after.caseletId}: progressive table missing`);
}

assert.ok(exclusionBundles > 0, "Expected repeated LP-001 exclusions to be clubbed in the proof sample.");
assert.ok(differentBundles > 0, "Expected repeated LP-001 different-group clauses to be clubbed in the proof sample.");
assert.ok(totalBundledClauses > 0);

const reference = generateLp001BatchStabilizedV4_2("lp-001-008-review-v3-3:LP-001", 12)[0]!;
assert.deepEqual(reference.learnerFacingClues, [
  "Bhavna and Meera sit on the same panel.",
  "Mohan is in a different panel from both Yash and Varun.",
  "Bhavna is assigned to neither Classroom Observation nor Assessment Review.",
  "Mohan is not on the Assessment Review panel.",
]);
assert.equal(reference.learnerFacingClues.length, 4, "Reference case should reduce six repetitive clauses to four learner-facing clues.");
assert.doesNotMatch(reference.learnerFacingClues.join("\n"), /\beither\b/iu, "Reference case still contains the ambiguous overlapping either/or rewrite.");

console.log(`LP-001 V4.2 passed for ${revised.length} caselets: only repeated clauses were clubbed; ${exclusionBundles} exclusion bundles and ${differentBundles} repeated-difference bundles verified without semantic drift.`);
