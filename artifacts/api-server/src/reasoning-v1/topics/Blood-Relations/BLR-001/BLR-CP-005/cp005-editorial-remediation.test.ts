import assert from "node:assert/strict";

import { generateBlrCp005FrozenBank } from "./cp005-bank";
import { BLR_CP005_EDITORIAL_VERSION } from "./cp005-editorial";

const bank = generateBlrCp005FrozenBank();

assert.equal(BLR_CP005_EDITORIAL_VERSION, "BLR_CP005_ENGLISH_EXAM_GRADE_EDITORIAL_V1");
assert.equal(bank.length, 184);

const forbiddenLearnerPhrases = [
  /gender of .* is not stated/i,
  /whose gender is not stated/i,
  /nothing states whether/i,
  /no other family relation is given/i,
  /available clues do not identify/i,
  /available information does not identify/i,
  /no clue distinguishes/i,
  /exact number of additional children is not stated/i,
];

const stripTerminalPunctuation = (value: string): string => value.replace(/[.!?]+$/, "");

for (const question of bank) {
  const learnerText = `${question.sharedPrompt} ${question.stem}`;
  for (const pattern of forbiddenLearnerPhrases) {
    assert.equal(pattern.test(learnerText), false, `${question.itemId}: ${pattern}`);
  }

  assert.ok(question.explanation.coreConcept.length >= 2, question.itemId);
  assert.ok(
    question.explanation.modelAudit.length >= question.modelSpace.modelCount,
    question.itemId,
  );
  assert.ok(question.explanation.conclusion.length >= 35, question.itemId);
  assert.ok(question.explanation.examShortcut.length >= 35, question.itemId);
  assert.ok(
    question.explanation.modelAudit.every((line) => !/\.;/.test(line)),
    question.itemId,
  );
  assert.ok(
    question.explanation.modelAudit.every((line) => !/\.\./.test(line)),
    question.itemId,
  );

  if (question.querySpec.kind === "CLAIM_STATUS") {
    const allowedClaims = new Set(
      question.querySpec.claims.map((claim) => stripTerminalPunctuation(claim.text)),
    );
    for (const line of question.explanation.modelAudit.slice(0, question.modelSpace.modelCount)) {
      const payload = line.split(" — ")[1];
      assert.ok(payload, `${question.itemId}: malformed claim audit line`);
      if (payload === "none of the offered statements.") continue;
      for (const statement of stripTerminalPunctuation(payload).split("; ")) {
        assert.ok(
          allowedClaims.has(stripTerminalPunctuation(statement)),
          `${question.itemId}: altered claim text: ${statement}`,
        );
      }
    }
  }

  assert.equal(question.explanation.optionAnalysis.length, 4, question.itemId);

  for (const analysis of question.explanation.optionAnalysis) {
    assert.ok(/\[[A-Z0-9_]+\]$/.test(analysis.explanation), `${question.itemId}: ${analysis.explanation}`);
    assert.ok(analysis.explanation.length >= 70, question.itemId);
  }

  for (let index = 0; index < question.modelSpace.modelCount; index += 1) {
    assert.ok(
      question.explanation.modelAudit.some((line) => line.startsWith(`Model ${index + 1} (`)),
      `${question.itemId}: missing Model ${index + 1}`,
    );
  }
}

const mapping = Object.fromEntries(
  [...new Set(bank.map((question) => question.qlId))]
    .sort()
    .map((qlId) => [qlId, [...new Set(bank.filter((question) => question.qlId === qlId).map((question) => question.solveAuthority))]]),
);
assert.deepEqual(mapping, {
  "BLR-QL-018": ["RESOLVE_INVARIANT_RELATION"],
  "BLR-QL-019": ["RESOLVE_RELATION_UNCERTAINTY"],
  "BLR-QL-020": ["SELECT_CLAIM_BY_MODEL_STATUS"],
  "BLR-QL-021": ["IDENTIFY_PERSON_BY_MODEL_STATUS"],
  "BLR-QL-022": ["RESOLVE_PERSON_IDENTITY_UNCERTAINTY"],
  "BLR-QL-023": ["DETERMINE_COUNT_BOUND"],
  "BLR-QL-024": ["SELECT_COUNT_BY_MODEL_STATUS"],
  "BLR-QL-025": ["RESOLVE_COUNT_DETERMINACY"],
});

console.log(
  JSON.stringify(
    {
      editorialVersion: BLR_CP005_EDITORIAL_VERSION,
      reviewedQuestions: bank.length,
      forbiddenMetaPhrases: 0,
      explanationsWithFourTiers: bank.length,
      optionAnalysesWithDiagnosticCodes: bank.length * 4,
      verdict: "BLR-CP-005 EXAM-GRADE EDITORIAL REMEDIATION PASSED",
    },
    null,
    2,
  ),
);
