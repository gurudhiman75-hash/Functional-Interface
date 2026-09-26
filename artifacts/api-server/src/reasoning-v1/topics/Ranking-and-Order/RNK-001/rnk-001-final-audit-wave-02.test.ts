import assert from "node:assert/strict";

import { generateRnk001QuestionStudioBatch } from "./rnk-001-question-studio-integration-v2";

const ADVANCED_RELATION_QLS = [
  "RNK-QL-036",
  "RNK-QL-037",
  "RNK-QL-038",
  "RNK-QL-039",
  "RNK-QL-040",
  "RNK-QL-041",
] as const;

const LANGUAGES = ["en", "hi", "pa"] as const;

function assertLifecycleLocked(question: Record<string, any>) {
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.automaticStudentPublication, false);
  assert.equal(question.productionReleaseAuthorized, false);
}

function regexpEscape(value: string): string {
  return value.replace(/[\\^$.*+?()[\]{}|]/gu, "\\$&");
}

let audited = 0;

for (const language of LANGUAGES) {
  for (const qlId of ADVANCED_RELATION_QLS) {
    const batch = await generateRnk001QuestionStudioBatch({
      packageId: "RNK-001",
      canonicalProblemId: qlId,
      language,
      count: 6,
      seed: `rnk-wave02:${language}:${qlId}`,
    });

    assert.equal(batch.questions.length, 6);

    for (const raw of batch.questions as Array<Record<string, any>>) {
      audited += 1;
      assert.equal(raw.qlId, qlId);
      assert.equal(raw.language, language);
      assert.equal(raw.validation.valid, true);
      assert.equal(new Set(raw.options).size, raw.options.length);
      assert.equal(raw.correctIndex >= 0 && raw.correctIndex < raw.options.length, true);

      const source = raw.source as Record<string, any>;
      const sourceQuery = String(source.stem ?? "").trim();
      const clues = Array.isArray(source.clues)
        ? source.clues.map(String).map((value) => value.trim()).filter(Boolean)
        : [];

      assert.ok(clues.length >= 3, `${qlId} must carry its solve-relevant comparison statements`);
      assert.ok(String(raw.stem).length > sourceQuery.length, `${qlId} learner stem must include more than the bare query`);
      for (const clue of clues) {
        assert.match(String(raw.stem), new RegExp(regexpEscape(clue), "u"));
      }

      if (qlId <= "RNK-QL-038" && typeof source.instruction === "string" && source.instruction.trim()) {
        assert.ok(String(raw.stem).includes(source.instruction.trim()), `${qlId} must preserve its setup/instruction`);
      }

      const explanation = String(raw.explanation ?? "").trim();
      assert.ok(explanation.length > 0, `${qlId} explanation must be visible`);
      assert.doesNotMatch(explanation, /^\s*\[/u);
      assert.doesNotMatch(explanation, /\["/u);
      assert.doesNotMatch(explanation, /"\]/u);
      assert.ok(explanation.split(/\n+/u).filter(Boolean).length >= 1);

      if (language === "hi") {
        assert.match(String(raw.stem), /[ऀ-ॿ]/u);
        assert.match(explanation, /[ऀ-ॿ]/u);
      }
      if (language === "pa") {
        assert.match(String(raw.stem), /[਀-੿]/u);
        assert.match(explanation, /[਀-੿]/u);
      }

      assertLifecycleLocked(raw);
    }
  }
}

const ql036 = (await generateRnk001QuestionStudioBatch({
  packageId: "RNK-001",
  canonicalProblemId: "RNK-QL-036",
  language: "en",
  count: 1,
  seed: "rnk-wave02-visible-example",
})).questions[0] as Record<string, any>;

assert.match(String(ql036.stem), /^.+\n\n1\. .+\n2\. .+/su);
assert.doesNotMatch(String(ql036.explanation), /^\s*\[/u);

console.log(JSON.stringify({
  verdict: "PASS_RNK_001_FINAL_AUDIT_WAVE_02_SOLVE_RELEVANT_PRESENTATION",
  qls: [...ADVANCED_RELATION_QLS],
  languages: [...LANGUAGES],
  generatedInstancesAudited: audited,
  presentationFixes: [
    "CP005 instruction + clues + query visible",
    "CP006 clues + query visible",
    "array explanations rendered as learner steps",
  ],
  authorityChanged: false,
  qlAllocationChanged: false,
  lifecycle: "REVIEW_ONLY",
}, null, 2));
