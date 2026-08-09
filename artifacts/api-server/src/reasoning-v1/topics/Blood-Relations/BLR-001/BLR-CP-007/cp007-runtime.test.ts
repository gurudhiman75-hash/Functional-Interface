import { strict as assert } from "node:assert";
import { BLR_CP007_CONTRACTS } from "./cp007-model";
import {
  buildBlrCp007Telemetry,
  generateBlrCp007FrozenBank,
  generateBlrCp007Question,
} from "./cp007-runtime";
import { independentlyVerifyBlrCp007Question } from "./cp007-independent-verifier";

const bank = generateBlrCp007FrozenBank();
const telemetry = buildBlrCp007Telemetry(bank);

assert.equal(bank.length, 168);
assert.equal(telemetry.recordCount, 168);
assert.equal(telemetry.prototypeCount, 21);
assert.equal(telemetry.topologyCount, 21);
assert.equal(telemetry.authorityCount, 5);
assert.equal(telemetry.permanentQlCount, 5);
assert.equal(telemetry.statementCount, 296);
assert.deepEqual(telemetry.answerPositions, [42, 42, 42, 42]);
assert.equal(telemetry.uniqueQuestionSignatureCount, 168);
assert.equal(telemetry.permanentQlRange, "BLR-QL-031..BLR-QL-035");
assert.equal(telemetry.nextAvailableChapterQlId, "BLR-QL-036");
assert.deepEqual(telemetry.qlCounts, {
  "BLR-QL-031": 48,
  "BLR-QL-032": 32,
  "BLR-QL-033": 24,
  "BLR-QL-034": 32,
  "BLR-QL-035": 32,
});

const itemIds = new Set<string>();
const fingerprints = new Set<string>();
let independentlyVerified = 0;
let displayedParityCount = 0;
let decodedStatementCount = 0;
let optionAnalysisCount = 0;

for (const question of bank) {
  assert(!itemIds.has(question.itemId), `${question.itemId}: duplicate item ID`);
  assert(!fingerprints.has(question.metadata.semanticFingerprint), `${question.itemId}: duplicate fingerprint`);
  itemIds.add(question.itemId);
  fingerprints.add(question.metadata.semanticFingerprint);

  assert.equal(question.options.length, 4, `${question.itemId}: option count`);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1, `${question.itemId}: correct option count`);
  assert.equal(question.options[question.correctIndex]!.text, question.answer, `${question.itemId}: answer parity`);
  assert.equal(question.metadata.nameBasedGenderAssumptions, 0, `${question.itemId}: name-based gender`);
  assert.equal(question.metadata.explicitGenderEvidence, true, `${question.itemId}: explicit gender evidence`);
  assert.equal(question.metadata.displayedExpressionParity, true, `${question.itemId}: display parity metadata`);
  assert.equal(question.metadata.uniqueAnswer, true, `${question.itemId}: uniqueness`);
  assert.equal(question.metadata.independentVerifierAgreed, true, `${question.itemId}: independent flag`);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.questionBankEligible, false);
  assert.equal(question.mockTestEligible, false);

  const contract = BLR_CP007_CONTRACTS.find((entry) => entry.qlId === question.qlId);
  if (!contract) throw new Error(`${question.itemId}: missing contract`);
  assert.equal(contract.solveAuthority, question.solveAuthority, `${question.itemId}: authority ownership`);
  assert.equal(contract.answerType, question.answerType, `${question.itemId}: answer type`);

  const keyTokens = new Set(question.codeKey.map((entry) => entry.token));
  assert.equal(keyTokens.size, question.codeKey.length, `${question.itemId}: unique key tokens`);
  question.completedStatements.forEach((coded) => {
    assert(keyTokens.has(coded.token), `${question.itemId}: completed token absent from key`);
  });

  const replay = generateBlrCp007Question(question.sourcePrototypeId, question.seed);
  assert.deepEqual(replay, question, `${question.itemId}: deterministic replay`);

  const independent = independentlyVerifyBlrCp007Question(question);
  assert.equal(independent.expectedCorrectIndex, question.correctIndex, `${question.itemId}: independent correct index`);
  assert.equal(independent.answerMatches, true, `${question.itemId}: independent answer`);
  assert.equal(independent.completedGraphMatches, true, `${question.itemId}: independent graph`);
  assert.equal(independent.displayedParity, true, `${question.itemId}: independent displayed parity`);
  independentlyVerified += 1;
  displayedParityCount += Number(independent.displayedParity);

  assert(question.explanation.coreConcept.length >= 2, `${question.itemId}: core concept`);
  assert(question.explanation.constructionAudit.length >= 2, `${question.itemId}: construction audit`);
  assert(question.explanation.graphAudit.length >= 2, `${question.itemId}: graph audit`);
  assert(question.explanation.examShortcut.length >= 30, `${question.itemId}: shortcut`);
  assert.equal(question.explanation.optionAnalysis.length, 4, `${question.itemId}: option analysis`);
  question.explanation.optionAnalysis.forEach((entry) => {
    assert(/\[[A-Z_]+\]$/.test(entry.explanation), `${question.itemId}: diagnostic code`);
  });
  assert.equal(question.explanation.familyTree.kind, "blood-relation-family-tree");
  assert.equal(question.explanation.familyTree.version, 1);
  assert(question.explanation.familyTree.nodes.length >= 2, `${question.itemId}: diagram nodes`);
  assert(question.explanation.familyTree.edges.length >= 1, `${question.itemId}: diagram edges`);
  assert(question.explanation.familyTree.asciiFallback.length > 0, `${question.itemId}: ASCII fallback`);

  const learnerText = [
    question.sharedPrompt,
    question.stem,
    ...question.options.map((option) => option.text),
    ...question.explanation.coreConcept,
    ...question.explanation.constructionAudit,
    ...question.explanation.graphAudit,
    question.explanation.conclusion,
    question.explanation.examShortcut,
    ...question.explanation.commonTraps,
  ].join("\n");
  assert(!/gender (?:is|was) inferred from (?:the )?(?:name|letter)/i.test(learnerText), `${question.itemId}: name inference`);
  assert(!/prototype|runtime|semantic fingerprint|solver metadata/i.test(learnerText), `${question.itemId}: internal leakage`);

  decodedStatementCount += question.completedStatements.length;
  optionAnalysisCount += question.explanation.optionAnalysis.length;
}

assert.equal(independentlyVerified, 168);
assert.equal(displayedParityCount, 168);
assert.equal(decodedStatementCount, 296);
assert.equal(optionAnalysisCount, 672);

console.log(JSON.stringify({
  runtimeVersion: bank[0]!.metadata.runtimeVersion,
  freezeVersion: bank[0]!.metadata.freezeVersion,
  ...telemetry,
  independentlyVerifiedQuestions: independentlyVerified,
  displayedExpressionParityQuestions: displayedParityCount,
  optionAnalyses: optionAnalysisCount,
  nameBasedGenderAssumptions: 0,
  verdict: "BLR-CP-007 CODED RELATION CONSTRUCTION IS DISCOVERY-FROZEN WITH FIVE PERMANENT REVIEW-ONLY QLS",
}, null, 2));
