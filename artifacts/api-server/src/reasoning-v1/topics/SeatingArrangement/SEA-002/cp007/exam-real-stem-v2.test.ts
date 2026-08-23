import assert from "node:assert/strict";

import {
  countSea002Cp007ExamRealClueSentences,
  renderSea002Cp007ExamRealStem,
} from "./exam-real-stem-v2.ts";
import {
  generateSea002Cp007ProductionCaselet,
  independentlySolveSea002Cp007Caselet,
  type Sea002Cp007CandidateAuthorityKey,
} from "./production-caselet-v1.ts";

const AUTHORITIES = ["CP007-AUTH-01", "CP007-AUTH-02", "CP007-AUTH-03", "CP007-AUTH-04"] as const satisfies readonly Sea002Cp007CandidateAuthorityKey[];
let surfaces = 0;
let compactnessChecks = 0;
let semanticTokens = 0;

for (const authorityKey of AUTHORITIES) {
  for (let index = 0; index < 24; index += 1) {
    const width = authorityKey === "CP007-AUTH-04" ? 4 + (index % 3) : 3 + (index % 4);
    const caselet = generateSea002Cp007ProductionCaselet(`exam-real-v2:${authorityKey}:${index}`, width, authorityKey);
    assert.equal(independentlySolveSea002Cp007Caselet(caselet).solutionCount, 1);
    const stem = renderSea002Cp007ExamRealStem(caselet);
    const clueSentences = countSea002Cp007ExamRealClueSentences(caselet);
    surfaces += 1;

    assert.match(stem, /^Two parallel rows contain \d persons each\./u);
    assert.match(stem, /Some persons face north and some face south\./u);
    assert.equal(/\bcolumns?\b/iu.test(stem), false);
    assert.equal(/solver|oracle|fingerprint|coordinate/iu.test(stem), false);
    assert.equal(/undefined|null/iu.test(stem), false);
    assert.ok(clueSentences <= (2 * width + 2), `clue rendering too verbose for ${caselet.caseletId}`);
    compactnessChecks += 6;

    for (const participant of caselet.participants) {
      assert.ok(stem.includes(participant.id));
      semanticTokens += 1;
    }
    assert.ok(stem.includes("opposite") || stem.includes("diagonally"));
  }
}

console.log("PASS_SEA002_CP007_EXAM_REAL_STEM_V2");
console.log("rendered surfaces", surfaces);
console.log("compactness checks", compactnessChecks);
console.log("participant token checks", semanticTokens);
console.log("learner column residue", 0);
console.log("permanent QLs allocated", 0);
