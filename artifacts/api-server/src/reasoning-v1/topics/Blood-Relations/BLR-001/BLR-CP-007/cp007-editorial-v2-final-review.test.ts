import { strict as assert } from "node:assert";
import {
  buildBlrCp007EditorialV2FinalReviewTelemetry,
  generateBlrCp007EditorialV2FinalReviewBank,
  generateBlrCp007EditorialV2FinalReviewQuestion,
} from "./cp007-editorial-v2-final-review";

const bank = generateBlrCp007EditorialV2FinalReviewBank();
const telemetry = buildBlrCp007EditorialV2FinalReviewTelemetry(bank);

assert.equal(bank.length, 168);
assert.equal(telemetry.recordCount, 168);
assert.equal(telemetry.prototypeCount, 21);
assert.equal(telemetry.authorityCount, 5);
assert.equal(telemetry.permanentQlCount, 5);
assert.deepEqual(telemetry.answerPositions, [41, 45, 42, 40]);
assert.deepEqual(telemetry.qlCounts, {
  "BLR-QL-031": 48,
  "BLR-QL-032": 32,
  "BLR-QL-033": 24,
  "BLR-QL-034": 32,
  "BLR-QL-035": 32,
});
assert.deepEqual(telemetry.missingPersonCorrectLabelCounts, {
  P: 8,
  Q: 8,
  R: 8,
  S: 8,
});
assert.equal(telemetry.optionAnalysisCount, 672);
assert.equal(telemetry.uniqueQuestionSignatureCount, 168);
assert.equal(telemetry.invalidStatementQuestionCount, 16);
assert.equal(telemetry.humanReviewRequired, true);

const seenIds = new Set<string>();
const seenFingerprints = new Set<string>();
let naturalMissingPersonQuestions = 0;
let graphValidMissingPersonOptions = 0;
let conciseBodyChecks = 0;

function sentences(value: string): string[] {
  return value.match(/[^.!?]+[.!?]?/g)?.map((entry) => entry.trim()).filter(Boolean) ?? [];
}

function bodyWordLimit(mode: string): number {
  switch (mode) {
    case "DIRECT_LOOKUP_MINIMAL": return 60;
    case "MISSING_TOKEN": return 110;
    case "MISSING_PERSON": return 145;
    case "TWO_LINK_PATH": return 165;
    case "THREE_LINK_OR_AFFINAL_PATH": return 210;
    case "INVALID_STATEMENT_CHECK":
    case "VALID_STATEMENT_CHECK": return 150;
    default: return 180;
  }
}

for (const question of bank) {
  assert(!seenIds.has(question.itemId), `${question.itemId}: duplicate ID`);
  assert(!seenFingerprints.has(question.metadata.semanticFingerprint), `${question.itemId}: duplicate fingerprint`);
  seenIds.add(question.itemId);
  seenFingerprints.add(question.metadata.semanticFingerprint);

  const replay = generateBlrCp007EditorialV2FinalReviewQuestion(
    question.sourcePrototypeId,
    question.seed,
  );
  assert.deepEqual(replay, question, `${question.itemId}: deterministic replay`);

  const body = [
    ...question.explanation.steps,
    question.explanation.conclusion,
    question.explanation.shortcut ?? "",
    question.explanation.commonTrap ?? "",
  ].join(" ").trim();
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  assert(
    wordCount <= bodyWordLimit(question.explanation.mode),
    `${question.itemId}: ${question.explanation.mode} body is too long (${wordCount} words)`,
  );
  conciseBodyChecks += 1;

  const descriptionSentences = sentences(question.explanation.diagramProof.description);
  const normalized = descriptionSentences.map((sentence) =>
    sentence.replace(/[.!?]+$/, "").trim().toLocaleLowerCase("en-IN"),
  );
  assert.equal(
    new Set(normalized).size,
    normalized.length,
    `${question.itemId}: duplicate diagram sentence`,
  );
  assert(!/1 family links\b/i.test(question.explanation.familyTree.accessibleSummary));

  if (question.qlId !== "BLR-QL-034") continue;
  assert.equal(question.query.kind, "MISSING_PERSON");
  if (question.query.kind !== "MISSING_PERSON") throw new Error("QL-034 query mismatch");
  naturalMissingPersonQuestions += 1;
  assert.deepEqual(question.query.candidatePersonIds, ["P", "Q", "R", "S"]);
  assert(/Candidates: P, Q, R, S/.test(question.stem));
  assert(!/\bV[1-4]\b/.test(question.stem), `${question.itemId}: synthetic V label in stem`);
  assert(!/\bU\b/.test(question.stem), `${question.itemId}: stale U label in stem`);
  assert(!question.query.completeStatements.some((entry) =>
    /^(U|V[1-4])$/.test(entry.leftId) || /^(U|V[1-4])$/.test(entry.rightId),
  ), `${question.itemId}: synthetic roster statement survived`);
  assert(!question.explanation.steps.some((step) => /\b(U|V[1-4])\b/.test(step)),
    `${question.itemId}: stale roster step survived`);
  assert(question.query.completeStatements.length <= 3, `${question.itemId}: QL-034 stem remains cluttered`);
  question.options.forEach((option) => {
    assert.equal(option.graphValidity, "VALID", `${question.itemId}: invalid candidate ${option.text}`);
    assert(!option.completedStatements.some((entry) =>
      /^(U|V[1-4])$/.test(entry.leftId) || /^(U|V[1-4])$/.test(entry.rightId),
    ));
    graphValidMissingPersonOptions += 1;
  });
}

assert.equal(naturalMissingPersonQuestions, 32);
assert.equal(graphValidMissingPersonOptions, 128);
assert.equal(conciseBodyChecks, 168);

console.log(JSON.stringify({
  ...telemetry,
  naturalMissingPersonQuestions,
  graphValidMissingPersonOptions,
  conciseBodyChecks,
  syntheticRosterLabels: 0,
  staleExplanationSteps: 0,
  duplicateDiagramSentences: 0,
  verdict: "BLR-CP-007 EDITORIAL V2 FINAL HUMAN-REVIEW SURFACE PASSED; HUMAN APPROVAL STILL REQUIRED",
}, null, 2));
