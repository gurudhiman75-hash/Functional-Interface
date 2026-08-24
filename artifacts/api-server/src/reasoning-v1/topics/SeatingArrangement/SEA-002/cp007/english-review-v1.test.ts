import assert from "node:assert/strict";

import {
  generateSea002Cp007ProductionCaselet,
  independentlySolveSea002Cp007Caselet,
  type Sea002Cp007CandidateAuthorityKey,
} from "./production-caselet-v2.ts";
import { renderSea002Cp007TeacherExplanationV2 } from "./teacher-explanation-v2.ts";

const AUTHORITIES = ["CP007-AUTH-01", "CP007-AUTH-02", "CP007-AUTH-03", "CP007-AUTH-04"] as const satisfies readonly Sea002Cp007CandidateAuthorityKey[];
let surfaces = 0;
let answerCoverageChecks = 0;
let structureChecks = 0;
let visualTeachingChecks = 0;
let querySpecificChecks = 0;
let auth01InferenceChecks = 0;

for (const authorityKey of AUTHORITIES) {
  for (let index = 0; index < 20; index += 1) {
    const width = authorityKey === "CP007-AUTH-04" ? 4 + (index % 3) : 3 + (index % 4);
    const caselet = generateSea002Cp007ProductionCaselet(`english-surface:${authorityKey}:${index}`, width, authorityKey);
    assert.equal(independentlySolveSea002Cp007Caselet(caselet).solutionCount, 1);
    const explanation = renderSea002Cp007TeacherExplanationV2(caselet);
    surfaces += 1;

    assert.ok(explanation.startsWith("Asked:"));
    assert.ok(explanation.includes(`Answer: ${caselet.answer}.`));
    assert.ok(explanation.includes(caselet.answer), "Explanation must name the actual answer.");
    assert.ok(/[↑↓]/u.test(explanation));
    assert.equal(/\bcolumns?\b/i.test(explanation), false);
    assert.equal(/solver|oracle|fingerprint|coordinate/i.test(explanation), false);
    assert.equal(/undefined|null/i.test(explanation), false);
    assert.equal(explanation.includes("Following the same/opposite-facing clues gives"), false);
    assert.equal(explanation.includes("settles as P1:"), false);
    structureChecks += 9;
    answerCoverageChecks += 1;

    if (authorityKey === "CP007-AUTH-01") {
      const reference = caselet.question.match(/\bof ([A-Za-z]+)\?$/u)?.[1];
      assert.ok(reference);
      const directPair = caselet.clues.some((clue) =>
        clue.kind === "SAME_ROW_OFFSET"
        && ((clue.subject === reference && clue.reference === caselet.answer)
          || (clue.subject === caselet.answer && clue.reference === reference)),
      );
      assert.equal(directPair, false, `${caselet.caseletId} must not ask a directly clued neighbour pair.`);
      assert.ok(explanation.includes("1) Fix the reference person's facing:"));
      assert.ok(explanation.includes(`2) Build ${reference}'s row from the position clues:`));
      assert.ok(explanation.includes(`3) Read left/right from ${reference}'s point of view.`));
      assert.match(explanation, /left\/right are (?:the same as|reversed from) our/iu);
      assert.ok(explanation.includes("Final arrangement (our left → right):"));
      assert.ok(explanation.includes("Position : 1"));
      assert.ok(explanation.includes("Upper row:"));
      assert.ok(explanation.includes("Lower row:"));
      assert.ok(explanation.includes("↑ = north, ↓ = south"));
      visualTeachingChecks += 8;
      querySpecificChecks += 3;
      auth01InferenceChecks += 1;
    }

    if (authorityKey === "CP007-AUTH-02") {
      assert.ok(explanation.includes("We do not need to arrange the rows for this question."));
      assert.ok(explanation.includes("Follow only the facing chain:"));
      assert.match(explanation, /⇒ [A-Za-z]+ [↑↓]/u);
      assert.equal(explanation.includes("Final arrangement"), false);
      assert.equal(explanation.includes("Upper row:"), false);
      assert.equal(explanation.includes("Lower row:"), false);
      visualTeachingChecks += 3;
      querySpecificChecks += 3;
    }

    if (authorityKey === "CP007-AUTH-03") {
      assert.ok(explanation.includes("1) Row membership:"));
      assert.ok(explanation.includes("2) Facing direction:"));
      assert.match(explanation, /same row|other row/iu);
      assert.ok(explanation.includes("Check the resolved arrangement:"));
      assert.ok(explanation.includes("Final arrangement (our left → right):"));
      assert.ok(explanation.includes("Position : 1"));
      assert.ok(explanation.includes("Upper row:"));
      assert.ok(explanation.includes("Lower row:"));
      assert.ok(explanation.includes("↑ = north, ↓ = south"));
      visualTeachingChecks += 7;
      querySpecificChecks += 2;
    }

    if (authorityKey === "CP007-AUTH-04") {
      assert.ok(explanation.includes("1) First fix the reference person's facing:"));
      assert.ok(explanation.includes("2) Translate"));
      assert.ok(explanation.includes("3) Build and align the two rows:"));
      assert.match(explanation, /place [A-Za-z]+ immediately to our (?:left|right) of [A-Za-z]+/iu);
      assert.match(explanation, /opposite .* ⇒ they occupy the same position in the two rows/iu);
      assert.ok(explanation.includes("Final arrangement (our left → right):"));
      assert.ok(explanation.includes("Position : 1"));
      assert.ok(explanation.includes("Upper row:"));
      assert.ok(explanation.includes("Lower row:"));
      assert.ok(explanation.includes("diagonal means take that position in the other row"));
      assert.ok(explanation.includes("↑ = north, ↓ = south"));
      visualTeachingChecks += 10;
      querySpecificChecks += 3;
    }
  }
}

assert.equal(auth01InferenceChecks, 20);
console.log("PASS_SEA002_CP007_ENGLISH_SURFACE_V5_VISUAL_DEDUCTION_TEACHING");
console.log("teacher explanations", surfaces);
console.log("answer coverage checks", answerCoverageChecks);
console.log("structure checks", structureChecks);
console.log("visual teaching checks", visualTeachingChecks);
console.log("query-specific checks", querySpecificChecks);
console.log("AUTH01 inferred-query checks", auth01InferenceChecks);
console.log("learner column residue", 0);
console.log("English approval remains", false);
