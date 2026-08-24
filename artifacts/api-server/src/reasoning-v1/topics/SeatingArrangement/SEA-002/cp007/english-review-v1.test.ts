import assert from "node:assert/strict";

import {
  generateSea002Cp007ProductionCaselet,
  independentlySolveSea002Cp007Caselet,
  type Sea002Cp007CandidateAuthorityKey,
} from "./production-caselet-v1.ts";
import { renderSea002Cp007TeacherExplanation } from "./teacher-explanation-v1.ts";

const AUTHORITIES = ["CP007-AUTH-01", "CP007-AUTH-02", "CP007-AUTH-03", "CP007-AUTH-04"] as const satisfies readonly Sea002Cp007CandidateAuthorityKey[];
let surfaces = 0;
let answerCoverageChecks = 0;
let structureChecks = 0;
let causalReasoningChecks = 0;
let querySpecificChecks = 0;

for (const authorityKey of AUTHORITIES) {
  for (let index = 0; index < 20; index += 1) {
    const width = authorityKey === "CP007-AUTH-04" ? 4 + (index % 3) : 3 + (index % 4);
    const caselet = generateSea002Cp007ProductionCaselet(`english-surface:${authorityKey}:${index}`, width, authorityKey);
    assert.equal(independentlySolveSea002Cp007Caselet(caselet).solutionCount, 1);
    const explanation = renderSea002Cp007TeacherExplanation(caselet);
    surfaces += 1;

    assert.ok(explanation.includes(`Therefore, the answer is ${caselet.answer}.`));
    assert.ok(explanation.includes(caselet.answer), "Explanation must name the actual answer.");
    assert.equal(/\bcolumns?\b/i.test(explanation), false);
    assert.equal(/solver|oracle|fingerprint|coordinate/i.test(explanation), false);
    assert.equal(/undefined|null/i.test(explanation), false);
    assert.equal(explanation.includes("Following the same/opposite-facing clues gives"), false);
    assert.equal(explanation.includes("settles as P1:"), false);
    assert.ok(explanation.split("\n").length >= 3 && explanation.split("\n").length <= 5);
    structureChecks += 8;
    answerCoverageChecks += 1;

    const causalMarkers = explanation.match(/\b(?:so|therefore|hence|because)\b/giu) ?? [];
    assert.ok(causalMarkers.length >= 2, `${caselet.caseletId} must explain deductions causally.`);
    causalReasoningChecks += 1;

    if (authorityKey === "CP007-AUTH-01") {
      assert.ok(
        explanation.includes("there is no need to solve the whole arrangement")
        || explanation.includes("First determine"),
      );
      querySpecificChecks += 1;
    }

    if (authorityKey === "CP007-AUTH-02") {
      assert.ok(explanation.includes("the seating order is not required"));
      assert.equal(explanation.includes("The upper row is"), false);
      assert.equal(explanation.includes("The lower row is"), false);
      querySpecificChecks += 3;
    }

    if (authorityKey === "CP007-AUTH-03") {
      assert.ok(explanation.includes("For the row:"));
      assert.ok(explanation.includes("For the facing:"));
      assert.match(explanation, /same row|other row/iu);
      querySpecificChecks += 3;
    }

    if (authorityKey === "CP007-AUTH-04") {
      assert.ok(explanation.includes("left/right changes with the direction a person faces"));
      assert.ok(explanation.includes("The upper row is position 1:"));
      assert.ok(explanation.includes("The lower row is position 1:"));
      assert.ok(explanation.includes("looking at the other row"));
      querySpecificChecks += 4;
    }
  }
}

console.log("PASS_SEA002_CP007_ENGLISH_SURFACE_V2_HELPFUL");
console.log("teacher explanations", surfaces);
console.log("answer coverage checks", answerCoverageChecks);
console.log("structure checks", structureChecks);
console.log("causal reasoning checks", causalReasoningChecks);
console.log("query-specific checks", querySpecificChecks);
console.log("learner column residue", 0);
console.log("English approval remains", false);
