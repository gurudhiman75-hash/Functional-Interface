import assert from "node:assert/strict";
import { ENG001_CP001_CANDIDATES, generateEng001Cp001Question } from "../chapters/error-spotting/ENG-001/CP001/eng-001-cp001";
import { validateEng001Cp001Candidate, validateEng001Cp001Question } from "../chapters/error-spotting/ENG-001/CP001/eng-001-cp001-validator";
import { SUBJECT_VERB_AGREEMENT_RULES } from "../grammar/subject-verb-agreement";

for (const candidate of ENG001_CP001_CANDIDATES) {
  const result = validateEng001Cp001Candidate(candidate);
  assert.equal(result.ok, true, `${candidate.candidateId}: ${result.issues.map((entry) => entry.message).join(" | ")}`);
}

assert.equal(SUBJECT_VERB_AGREEMENT_RULES.length, 10, "CP001 V1 must register exactly the ten blueprint starter rule families.");

for (const rule of SUBJECT_VERB_AGREEMENT_RULES) {
  const candidates = ENG001_CP001_CANDIDATES.filter((candidate) => candidate.ruleId === rule.ruleId);
  assert.ok(candidates.length >= 1, `${rule.ruleId} has no sentence candidates.`);
  for (const difficulty of rule.allowedDifficulties) {
    assert.ok(candidates.some((candidate) => candidate.difficulty === difficulty), `${rule.ruleId} lacks a ${difficulty} candidate.`);
  }
}

const qlIds = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"] as const;
for (const qlId of qlIds) {
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    for (let index = 0; index < 30; index += 1) {
      const input = { qlId, difficulty, seed: `eng001-cp001:${qlId}:${difficulty}:${index}` } as const;
      const first = generateEng001Cp001Question(input);
      const second = generateEng001Cp001Question(input);
      assert.deepEqual(first, second, `Generation is not deterministic for ${input.seed}`);
      const validation = validateEng001Cp001Question(first);
      assert.equal(validation.ok, true, `${first.questionId}: ${validation.issues.map((entry) => entry.message).join(" | ")}`);
      assert.equal(first.metadata.reviewOnly, true);
      if (qlId === "ENG-001-QL001") {
        assert.equal(first.segments.length, 4);
        assert.equal(first.options.includes("No error"), false);
      }
      if (qlId === "ENG-001-QL002") {
        assert.equal(first.segments.length, 3);
        assert.equal(first.options.at(-1), "No error");
        assert.equal(first.metadata.hasNoError, false);
      }
      if (qlId === "ENG-001-QL007") {
        assert.equal(first.options.at(-1), "No error");
        assert.equal(first.options[first.correctOptionIndex], "No error");
        assert.equal(first.metadata.hasNoError, true);
      }
    }
  }
}

console.log(`ENG-001-CP001 V1 structural tests passed for ${ENG001_CP001_CANDIDATES.length} candidates.`);
