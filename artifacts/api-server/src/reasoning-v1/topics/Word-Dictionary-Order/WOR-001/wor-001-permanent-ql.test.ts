import assert from "node:assert/strict";

import {
  WOR_001_PERMANENT_QL_IDS,
  WOR_001_PERMANENT_QL_REGISTRY,
  WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS,
  worPermanentQlIdForPrototype,
} from "./permanent-ql-registry";
import { WOR_001_ALL_PROTOTYPES } from "./prototype-registry";
import { WOR_001_QUESTION_STUDIO_ADAPTER } from "./question-studio-adapter";
import {
  buildWor001QuestionStudioPayload,
  WOR_001_QUESTION_STUDIO_RELEASE_FREEZE,
} from "./question-studio-payload";
import {
  WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewWor001QuestionStudioReview,
} from "./question-studio-review";

assert.equal(WOR_001_PERMANENT_QL_IDS.length, 8);
assert.equal(WOR_001_PERMANENT_QL_REGISTRY.length, 8);
assert.equal(new Set(WOR_001_PERMANENT_QL_IDS).size, 8);
assert.deepEqual(WOR_001_PERMANENT_QL_IDS, [
  "WOR-QL-001",
  "WOR-QL-002",
  "WOR-QL-003",
  "WOR-QL-004",
  "WOR-QL-005",
  "WOR-QL-006",
  "WOR-QL-007",
  "WOR-QL-008",
]);

for (const entry of WOR_001_PERMANENT_QL_REGISTRY) {
  assert.equal(entry.chapterId, "WOR-001");
  assert.equal(entry.allocationStatus, "PERMANENT_ID_ALLOCATED_INACTIVE");
  assert.equal(entry.editorialStatus, "HUMAN_CONTENT_REVIEW_PENDING");
  assert.equal(entry.nativeHumanSignoffStatus, "PENDING");
  assert.equal(entry.active, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.mockTestEligible, false);
  assert.equal(entry.publiclyPublishable, false);
  assert.ok(entry.mappedPrototypeIds.includes(entry.rootPrototypeId));
  assert.notEqual(entry.sourceEvidenceStatus, "EXPLORATORY_SOURCE_GAP");
}

const mappedPrototypeIds = WOR_001_PERMANENT_QL_REGISTRY.flatMap((entry) => entry.mappedPrototypeIds);
assert.equal(mappedPrototypeIds.length, 15);
assert.equal(new Set(mappedPrototypeIds).size, 15);
assert.equal(WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS.length, 9);
assert.equal(new Set(WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS).size, 9);
assert.equal(mappedPrototypeIds.length + WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS.length, WOR_001_ALL_PROTOTYPES.length);

const allPrototypeIds = new Set(WOR_001_ALL_PROTOTYPES.map((entry) => entry.prototypeId));
for (const prototypeId of mappedPrototypeIds) assert.ok(allPrototypeIds.has(prototypeId), `${prototypeId} is not executable.`);
for (const prototypeId of WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS) {
  assert.ok(allPrototypeIds.has(prototypeId), `${prototypeId} is not executable.`);
  assert.equal(worPermanentQlIdForPrototype(prototypeId), null);
  const contract = WOR_001_ALL_PROTOTYPES.find((entry) => entry.prototypeId === prototypeId)!;
  assert.equal(contract.sourceEvidenceStatus, "EXPLORATORY_SOURCE_GAP");
}

assert.equal(worPermanentQlIdForPrototype("WOR-PROT-001"), "WOR-QL-001");
assert.equal(worPermanentQlIdForPrototype("WOR-PROT-002"), "WOR-QL-001");
assert.equal(worPermanentQlIdForPrototype("WOR-PROT-016"), "WOR-QL-001");
assert.equal(worPermanentQlIdForPrototype("WOR-PROT-003"), "WOR-QL-002");
assert.equal(worPermanentQlIdForPrototype("WOR-PROT-004"), "WOR-QL-002");
assert.equal(worPermanentQlIdForPrototype("WOR-PROT-005"), "WOR-QL-003");
assert.equal(worPermanentQlIdForPrototype("WOR-PROT-009"), "WOR-QL-003");
assert.equal(worPermanentQlIdForPrototype("WOR-PROT-017"), "WOR-QL-003");
assert.equal(worPermanentQlIdForPrototype("WOR-PROT-020"), "WOR-QL-003");
assert.equal(worPermanentQlIdForPrototype("WOR-PROT-006"), "WOR-QL-004");
assert.equal(worPermanentQlIdForPrototype("WOR-PROT-018"), "WOR-QL-004");
assert.equal(worPermanentQlIdForPrototype("WOR-PROT-021"), "WOR-QL-005");
assert.equal(worPermanentQlIdForPrototype("WOR-PROT-022"), "WOR-QL-006");
assert.equal(worPermanentQlIdForPrototype("WOR-PROT-023"), "WOR-QL-007");
assert.equal(worPermanentQlIdForPrototype("WOR-PROT-024"), "WOR-QL-008");

for (const prototypeId of mappedPrototypeIds) {
  const generated = WOR_001_QUESTION_STUDIO_ADAPTER.generate(prototypeId, 180826, "en-IN");
  assert.equal(generated.permanentQlId, worPermanentQlIdForPrototype(prototypeId));
  assert.equal(generated.lifecycleStatus, "REVIEW_ONLY");
  assert.equal(generated.questionStudioVisible, true);
}
for (const prototypeId of WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS) {
  const generated = WOR_001_QUESTION_STUDIO_ADAPTER.generate(prototypeId, 180827, "en-IN");
  assert.equal(generated.permanentQlId, null);
}

assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 8);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlAllocationStatus, "ALLOCATED_INACTIVE");
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlAllocationRequired, false);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.nativeHumanSignoffRequired, true);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);

for (const language of ["en", "hi", "pa"] as const) {
  const review = previewWor001QuestionStudioReview({
    language,
    prototypeId: "WOR-PROT-024",
    difficulty: "Hard",
    seed: `permanent-ql-freeze-${language}`,
    count: 1,
  });
  const question = review.questions[0]!;
  assert.equal(question.permanentQlId, "WOR-QL-008");
  assert.equal(question.qlId, "WOR-QL-008");
  assert.equal(question.validation.valid, true);
  const payload = buildWor001QuestionStudioPayload(question);
  assert.equal(payload.permanentQlId, "WOR-QL-008");
  assert.equal(payload.qlId, "WOR-QL-008");
  assert.equal(payload.permanentQlAllocationStatus, "ALLOCATED_INACTIVE");
  assert.equal(payload.humanContentReviewStatus, "PENDING");
  assert.equal(payload.nativeHumanSignoffStatus, "PENDING");
  assert.equal(payload.releaseFreezeStatus, WOR_001_QUESTION_STUDIO_RELEASE_FREEZE);
  assert.equal(payload.questionBankWritable, false);
  assert.equal(payload.testEligible, false);
  assert.equal(payload.mockTestEligible, false);
  assert.equal(payload.publiclyPublishable, false);
  assert.equal(payload.automaticStudentPublication, false);
}

console.log("WOR-001 inactive permanent QL freeze audit passed.", {
  permanentQlCount: WOR_001_PERMANENT_QL_REGISTRY.length,
  mappedPrototypeCount: mappedPrototypeIds.length,
  sourceDeferredPrototypeCount: WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS.length,
  releaseFreeze: WOR_001_QUESTION_STUDIO_RELEASE_FREEZE,
});