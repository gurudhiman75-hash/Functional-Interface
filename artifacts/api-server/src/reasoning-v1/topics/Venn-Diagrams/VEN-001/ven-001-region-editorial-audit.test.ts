import assert from "node:assert/strict";
import { generateVen001NextCheckpointBatch } from "./ven-001-next-checkpoints.ts";

const instructionOpeners = [
  /^Study the diagram\b/i,
  /^Look at the diagram\b/i,
  /^आरेख देखें/u,
  /^चित्र देखें/u,
  /^ਚਿੱਤਰ ਵੇਖੋ/u,
];
const equalityAssignments = /\b[ABC]\s*=\s*/u;

let checked = 0;
for (const language of ["en", "hi", "pa"] as const) {
  for (let seedIndex = 0; seedIndex < 8; seedIndex += 1) {
    const result = generateVen001NextCheckpointBatch({
      packageId: "VEN-001",
      patternId: "VEN-CP004",
      language,
      count: 8,
      seed: `ven-cp004-editorial:${language}:${seedIndex}`,
    });
    for (const question of result.questions) {
      const stem = String(question.stem).trim();
      for (const pattern of instructionOpeners) {
        assert.equal(pattern.test(stem), false, `${language}: instruction-style opener leaked: ${stem}`);
      }
      assert.doesNotMatch(stem, equalityAssignments, `${language}: equality assignment leaked: ${stem}`);
      assert.ok(/\bA\b/u.test(stem) && /\bB\b/u.test(stem), `${language}: diagram-label mapping is missing`);
      assert.ok(stem.length > 35);
      checked += 1;
    }
  }
}

console.log(JSON.stringify({
  status: "PASS_VEN_001_CP004_REGION_STEM_EDITORIAL_AUDIT_V1",
  checkedQuestions: checked,
  languages: ["en", "hi", "pa"],
  instructionStyleOpeners: 0,
  equalityAssignments: 0,
}, null, 2));
