import assert from "node:assert/strict";

import {
  generateSea002Cp007ProductionCaselet,
  independentlySolveSea002Cp007Caselet,
  type Sea002Cp007CandidateAuthorityKey,
} from "./production-caselet-v2.ts";
import { renderSea002Cp007TeacherExplanation } from "./teacher-explanation-v1.ts";

const AUTHORITIES = ["CP007-AUTH-01", "CP007-AUTH-02", "CP007-AUTH-03", "CP007-AUTH-04"] as const satisfies readonly Sea002Cp007CandidateAuthorityKey[];
let surfaces = 0;
let answerCoverageChecks = 0;
let structureChecks = 0;
let constructionChecks = 0;
let querySpecificChecks = 0;
let auth01InferenceChecks = 0;

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
    assert.ok(explanation.startsWith("Method:"));
    assert.ok(explanation.split("\n").length >= 3);
    assert.ok(/[↑↓]/u.test(explanation));
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
      assert.equal(explanation.includes("clue itself answers the question"), false);
      assert.equal(explanation.includes("match the reference person and direction"), false);
      assert.ok(explanation.includes("Facing chain:"));
      assert.match(explanation, /faces (?:north|south), so [A-Za-z]+'s (?:left|right) is toward the (?:left|right) side of the page/iu);
      assert.ok(explanation.includes("row blocks:"));
      assert.ok(explanation.includes("Final arrangement (left to right; ↑ = north, ↓ = south):"));
      assert.ok(explanation.includes("Position  | 1"));
      assert.ok(explanation.includes("Upper row |"));
      assert.ok(explanation.includes("Lower row |"));
      assert.ok(explanation.includes("point of view"));
      constructionChecks += 7;
      querySpecificChecks += 4;
      auth01InferenceChecks += 1;
    }

    if (authorityKey === "CP007-AUTH-02") {
      assert.ok(explanation.includes("Only the facing chain is needed"));
      assert.ok(explanation.includes("Facing chain:"));
      assert.match(explanation, /⇒ [A-Za-z]+[↑↓]/u);
      assert.equal(explanation.includes("Final arrangement"), false);
      assert.equal(explanation.includes("row blocks:"), false);
      constructionChecks += 3;
      querySpecificChecks += 2;
    }

    if (authorityKey === "CP007-AUTH-03") {
      assert.ok(explanation.includes("Row chain:"));
      assert.ok(explanation.includes("Facing chain:"));
      assert.match(explanation, /same row|other row/iu);
      assert.ok(explanation.includes("Verification arrangement (left to right; ↑ = north, ↓ = south):"));
      assert.ok(explanation.includes("Position  | 1"));
      assert.ok(explanation.includes("Upper row |"));
      assert.ok(explanation.includes("Lower row |"));
      constructionChecks += 6;
      querySpecificChecks += 2;
    }

    if (authorityKey === "CP007-AUTH-04") {
      assert.ok(explanation.includes("Build the rows:"));
      assert.ok(explanation.includes("Upper-row blocks:"));
      assert.ok(explanation.includes("Lower-row blocks:"));
      assert.ok(explanation.includes("Align the two rows:"));
      assert.match(explanation, /faces (?:north|south), so [A-Za-z]+'s (?:left|right) is toward the (?:left|right) side of the page/iu);
      assert.ok(explanation.includes("Final arrangement (left to right; ↑ = north, ↓ = south):"));
      assert.ok(explanation.includes("Position  | 1"));
      assert.ok(explanation.includes("Upper row |"));
      assert.ok(explanation.includes("Lower row |"));
      assert.ok(explanation.includes("switch to the other row"));
      constructionChecks += 9;
      querySpecificChecks += 2;
    }
  }
}

assert.equal(auth01InferenceChecks, 20);
console.log("PASS_SEA002_CP007_ENGLISH_SURFACE_V4_NON_DIRECT_CONSTRUCTION");
console.log("teacher explanations", surfaces);
console.log("answer coverage checks", answerCoverageChecks);
console.log("structure checks", structureChecks);
console.log("construction teaching checks", constructionChecks);
console.log("query-specific checks", querySpecificChecks);
console.log("AUTH01 inferred-query checks", auth01InferenceChecks);
console.log("learner column residue", 0);
console.log("English approval remains", false);
