import { strict as assert } from "node:assert";

import { generateCom001HumanReviewV2Candidate } from "./com001-human-review-remediation-v2";

const reviewCases = [
  ...["COM-001-QL-002", "COM-001-QL-003"].flatMap((qlId) =>
    ["A", "B", "C"].map((variant) => ({ qlId, seed: `human-review-wave2:${qlId}:${variant}` })),
  ),
  ...["A", "B", "C", "D", "E", "F"].map((variant) => ({
    qlId: "COM-001-QL-007",
    seed: `human-review-wave2:COM-001-QL-007:${variant}`,
  })),
  { qlId: "COM-001-QL-009", seed: "human-review-wave2:COM-001-QL-009:blocker" },
];

const samples = reviewCases.map(({ qlId, seed }) => generateCom001HumanReviewV2Candidate({ qlId, seed }));
assert.equal(samples.length, 13);
assert.equal(samples.at(-1)?.humanReviewV2.status, "BLOCKED_PENDING_MODEL");
assert.ok(samples.filter((q) => q.qlId === "COM-001-QL-002").every((q) => q.explanation.startsWith("The correct classification for ")));
assert.ok(samples.filter((q) => q.qlId === "COM-001-QL-002").every((q) => !/CPU registers (?:is|belongs)/iu.test(q.explanation)));
assert.ok(samples.filter((q) => q.qlId === "COM-001-QL-007").every((q) => !q.options.includes("RDX removable disk")));
assert.ok(samples.filter((q) => q.qlId === "COM-001-QL-003").every((q) => !/is used to (?:stores|holds|keeps|provides)/iu.test(q.explanation)));

for (const [index, q] of samples.entries()) {
  console.log(`[COM001-HUMAN-REVIEW-WAVE2 ${String(index + 1).padStart(2, "0")}/13] ${JSON.stringify({
    qlId: q.qlId,
    seed: reviewCases[index]?.seed,
    status: q.humanReviewV2.status,
    reason: q.humanReviewV2.reason,
    stem: q.stem,
    options: q.options,
    correctIndex: q.correctIndex,
    canonicalAnswer: q.canonicalAnswer,
    explanation: q.explanation,
    sourceIds: q.sourceIds,
  })}`);
}
