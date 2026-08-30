import assert from "node:assert/strict";

import { COM002_EDITORIALLY_APPROVED_FACTS } from "./com002-editorial-review";
import { generateCom002ReviewQuestionV2 } from "./com002-review-synthesis-v2";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V3,
  generateCom002ReviewQuestionV3,
  listCom002ReviewV3QlIds,
} from "./com002-review-synthesis-v3";

const SAFE_Q13_RELATIONS = new Set([
  "license_class",
  "file_operation_effect",
  "extension_file_type",
  "shortcut_action",
]);

function withoutId<T extends { questionId: string }>(value: T) {
  const { questionId: _questionId, ...rest } = value;
  return rest;
}

const qlIds = listCom002ReviewV3QlIds();
assert.equal(COM002_ENGLISH_GENERATOR_VERSION_V3, "COM-002-ENGLISH-GENERATOR-V3-CANDIDATE-1");
assert.equal(qlIds.length, 13);

let audited = 0;
let ql004CoreSurfaceCount = 0;
let ql004ComponentRoleCount = 0;
let ql013Count = 0;

for (const qlId of qlIds) {
  for (let index = 0; index < 40; index += 1) {
    const seed = `english-v3-candidate:${qlId}:${index}`;
    const question = generateCom002ReviewQuestionV3({ qlId, seed });
    const replay = generateCom002ReviewQuestionV3({ qlId, seed });

    assert.deepEqual(replay, question, `${qlId}/${seed}: deterministic V3 replay drift`);
    assert.ok(question.questionId.endsWith("-V3"), `${qlId}/${seed}: V3 questionId missing`);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.runtimeRegistered, false);
    assert.doesNotMatch(question.stem, /classified here as/i);
    assert.doesNotMatch(question.explanation, /classified here as/i);

    if (qlId !== "COM-002-QL-004" && qlId !== "COM-002-QL-013") {
      const historical = generateCom002ReviewQuestionV2({ qlId, seed });
      assert.deepEqual(
        withoutId(question),
        withoutId(historical),
        `${qlId}/${seed}: V3 drifted outside the scoped QL-004/QL-013 remediation`,
      );
    }

    if (qlId === "COM-002-QL-004") {
      if (question.surfaceMode === "CORE_COMPONENT") {
        ql004CoreSurfaceCount += 1;
        assert.equal(question.targetFactId, "com002-kernel-core");
        assert.equal(question.stem, "Which component forms the core of an operating system?");
        assert.equal(question.canonicalAnswer, "Kernel");
        assert.equal(question.explanation, "The kernel is the core component of an operating system.");
        assert.ok(question.sourceFactIds.includes("com002-kernel-core"));
      }
      if (question.surfaceMode === "COMPONENT_TO_ROLE") {
        ql004ComponentRoleCount += 1;
        assert.equal(
          question.stem,
          "Which option best states the kernel's principal role in an operating system?",
        );
      }
    }

    if (qlId === "COM-002-QL-013") {
      ql013Count += 1;
      assert.equal(question.surfaceMode, "MULTI_STATEMENT_TRUTH_VECTOR");
      assert.equal(question.solverAuthority, "KNOWLEDGE_COMPOSITION_VERIFIER");
      assert.doesNotMatch(question.stem, /macOS is classified as mobile operating system/i);
      for (const factId of question.sourceFactIds) {
        const fact = COM002_EDITORIALLY_APPROVED_FACTS.find((candidate) => candidate.factId === factId);
        assert.ok(fact, `${seed}: unknown QL-013 provenance fact ${factId}`);
        assert.ok(
          SAFE_Q13_RELATIONS.has(fact!.relation),
          `${seed}: unsafe QL-013 relation ${fact!.relation}/${factId}`,
        );
        assert.notEqual(fact!.relation, "software_classification");
        assert.notEqual(fact!.relation, "os_type_property");
      }
    }

    audited += 1;
  }
}

assert.equal(audited, 520);
assert.ok(ql004CoreSurfaceCount > 0, "V3 audit must exercise QL-004 CORE_COMPONENT");
assert.ok(ql004ComponentRoleCount > 0, "V3 audit must exercise QL-004 COMPONENT_TO_ROLE");
assert.equal(ql013Count, 40);

console.log("[COM002-REVIEW-SYNTHESIS-V3] PASS", {
  questions: audited,
  ql004CoreSurfaceCount,
  ql004ComponentRoleCount,
  ql013Count,
});
