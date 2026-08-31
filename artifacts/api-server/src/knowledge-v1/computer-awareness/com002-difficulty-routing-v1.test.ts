import assert from "node:assert/strict";

import {
  classifyCom002DifficultyV1,
  COM002_DIFFICULTY_CLASSIFIER_VERSION_V1,
  type Com002DifficultyV1,
} from "./com002-difficulty-routing-v1";
import { generateCom002ReviewQuestionV3 } from "./com002-review-synthesis-v3";

const qlIds = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);

const distribution: Record<Com002DifficultyV1, number> = {
  Easy: 0,
  Medium: 0,
  Hard: 0,
};
const support = new Map<string, Set<Com002DifficultyV1>>();
let audited = 0;

for (const qlId of qlIds) {
  const qlSupport = new Set<Com002DifficultyV1>();
  support.set(qlId, qlSupport);
  for (let index = 0; index < 40; index += 1) {
    const seed = `difficulty-v1-v3:${qlId}:${index}`;
    const question = generateCom002ReviewQuestionV3({ qlId, seed });
    const replay = classifyCom002DifficultyV1(question);
    const decision = classifyCom002DifficultyV1(question);

    assert.deepEqual(replay, decision, `${qlId}/${seed}: difficulty replay drift`);
    assert.equal(decision.classifierVersion, COM002_DIFFICULTY_CLASSIFIER_VERSION_V1);
    assert.equal(decision.reviewOnlyCandidate, true);
    assert.equal(decision.productionClaimAuthorized, false);
    assert.ok(["Easy", "Medium", "Hard"].includes(decision.difficulty));

    if (qlId === "COM-002-QL-013") {
      assert.equal(decision.difficulty, "Hard");
      assert.equal(decision.topology, "MULTI_FACT_COMPOSITION");
    }

    distribution[decision.difficulty] += 1;
    qlSupport.add(decision.difficulty);
    audited += 1;
  }
}

assert.equal(audited, 520);
assert.ok(distribution.Easy > 0, "COM-002 difficulty candidate must produce Easy questions");
assert.ok(distribution.Medium > 0, "COM-002 difficulty candidate must produce Medium questions");
assert.ok(distribution.Hard > 0, "COM-002 difficulty candidate must produce Hard questions");
assert.deepEqual([...support.get("COM-002-QL-013")!], ["Hard"]);

console.log("[COM002-DIFFICULTY-V1-CANDIDATE]", {
  contentGenerator: "V3",
  audited,
  distribution,
  qlSupport: Object.fromEntries(
    [...support.entries()].map(([qlId, values]) => [qlId, [...values].sort()]),
  ),
});
