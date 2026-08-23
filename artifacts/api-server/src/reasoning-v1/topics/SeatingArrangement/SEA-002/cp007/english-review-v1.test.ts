import assert from "node:assert/strict";

import {
  generateSea002Cp007ProductionCaselet,
  independentlySolveSea002Cp007Caselet,
  type Sea002Cp007CandidateAuthorityKey,
} from "./production-caselet-v1.ts";
import { renderSea002Cp007TeacherExplanation } from "./teacher-explanation-v1.ts";

const AUTHORITIES = ["CP007-AUTH-01", "CP007-AUTH-02", "CP007-AUTH-03", "CP007-AUTH-04"] as const satisfies readonly Sea002Cp007CandidateAuthorityKey[];
let surfaces = 0;
let nameCoverageChecks = 0;
let structureChecks = 0;

for (const authorityKey of AUTHORITIES) {
  for (let index = 0; index < 20; index += 1) {
    const width = authorityKey === "CP007-AUTH-04" ? 4 + (index % 3) : 3 + (index % 4);
    const caselet = generateSea002Cp007ProductionCaselet(`english-surface:${authorityKey}:${index}`, width, authorityKey);
    assert.equal(independentlySolveSea002Cp007Caselet(caselet).solutionCount, 1);
    const explanation = renderSea002Cp007TeacherExplanation(caselet);
    surfaces += 1;

    assert.ok(explanation.includes("Start with the facing information."));
    assert.ok(explanation.includes("The upper row settles as P1:"));
    assert.ok(explanation.includes("The lower row settles as P1:"));
    assert.ok(explanation.includes(`Therefore, the answer is ${caselet.answer}.`));
    assert.equal(/\bcolumns?\b/i.test(explanation), false);
    assert.equal(/solver|oracle|fingerprint|coordinate/i.test(explanation), false);
    assert.equal(/undefined|null/i.test(explanation), false);
    structureChecks += 7;

    for (const participant of caselet.participants) {
      assert.ok(explanation.includes(participant.id), `${participant.id} missing from teacher explanation.`);
      nameCoverageChecks += 1;
    }
  }
}

console.log("PASS_SEA002_CP007_ENGLISH_SURFACE_V1");
console.log("teacher explanations", surfaces);
console.log("participant-name coverage checks", nameCoverageChecks);
console.log("structure checks", structureChecks);
console.log("learner column residue", 0);
console.log("permanent QLs allocated", 0);
