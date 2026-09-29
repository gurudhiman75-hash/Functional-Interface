import assert from "node:assert/strict";
import { CLK_001_PERMANENT_CONTRACTS } from "./permanent-contracts";
import { generateClk001QuestionStudioBatch } from "./question-studio-integration";

let ownedTasks = 0;
let mergedVariantOwnership = 0;

for (const contract of CLK_001_PERMANENT_CONTRACTS) {
  ownedTasks += contract.ownedTaskIds.length;
  mergedVariantOwnership += Math.max(0, contract.ownedTaskIds.length - 1);

  const result = await generateClk001QuestionStudioBatch({
    packageId: "CLK-001",
    canonicalProblemId: contract.qlId,
    language: "en",
    count: 8,
    seed: "clk-wave1-anchor-only-" + contract.qlId,
  });

  const taskIds = new Set(result.questions.map((question) =>
    String((question.traceability as any).anchorTaskId),
  ));
  assert.deepEqual([...taskIds], [contract.anchorTaskId]);
}

assert.equal(CLK_001_PERMANENT_CONTRACTS.length, 23);
assert.ok(ownedTasks > 23, "Permanent contracts should own merged variants in addition to anchors.");
assert.ok(mergedVariantOwnership > 0, "Wave 1 expects merged-variant ownership.");
assert.ok(mergedVariantOwnership >= 40, "Clock taxonomy owns substantial merged breadth.");

console.log(JSON.stringify({
  status: "PASS_CLK_001_WAVE1_BREADTH_DIAGNOSIS",
  permanentQlCount: CLK_001_PERMANENT_CONTRACTS.length,
  ownedAuthorableSemanticTasks: ownedTasks,
  mergedVariantOwnership,
  questionStudioCurrentBehavior: "ANCHOR_ONLY",
  multilingualParityConstraint: "DO_NOT_ENABLE_VARIANTS_UNTIL_LOCALIZATION_SUPPORTS_THEM",
}, null, 2));
