import assert from "node:assert/strict";
import { STA_ENGLISH_CORPUS_V1 } from "./english-corpus/index.ts";
import { evaluateAssumptionOracle } from "./oracle.ts";

const STOP_WORDS = new Set([
  "a", "an", "the", "to", "of", "in", "on", "at", "for", "from", "with", "and", "or", "is", "are", "be", "been", "being",
  "can", "could", "will", "would", "should", "may", "might", "must", "so", "that", "this", "these", "those", "their", "your", "our",
  "by", "as", "it", "its", "into", "through", "before", "after", "now", "new", "expected", "expects", "because",
]);

function tokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token)),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  const union = new Set([...a, ...b]);
  if (union.size === 0) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return intersection / union.size;
}

let implicitCandidates = 0;
let rejectedCandidates = 0;
let ql004RestatementChecks = 0;
let rationaleChecks = 0;

for (const scenario of STA_ENGLISH_CORPUS_V1) {
  const candidateTextSet = new Set<string>();
  const statementTextSet = new Set<string>();
  let implicitInScenario = 0;
  let rejectedInScenario = 0;

  for (const statement of scenario.statementVariants) {
    const normalized = statement.trim().toLowerCase();
    assert.ok(normalized.length >= 20, `${scenario.scenarioId}: statement variant too short`);
    assert.ok(!statementTextSet.has(normalized), `${scenario.scenarioId}: duplicate statement variant`);
    statementTextSet.add(normalized);
  }

  for (const candidate of scenario.candidates) {
    const oracle = evaluateAssumptionOracle(scenario, candidate);
    assert.equal(oracle.classification, candidate.expectedClassification, `${scenario.scenarioId}/${candidate.candidateId}: authority/oracle mismatch`);
    assert.ok(candidate.textVariants.length >= 2, `${scenario.scenarioId}/${candidate.candidateId}: insufficient wording variants`);
    assert.ok(candidate.rationale.trim().length >= 45, `${scenario.scenarioId}/${candidate.candidateId}: rationale too thin`);
    assert.ok(!/because it is assumed|because it is implicit|rule:|STA-|BREAKS_|REQUIRED_HIDDEN/i.test(candidate.rationale), `${scenario.scenarioId}/${candidate.candidateId}: circular/internal rationale`);
    rationaleChecks += 1;

    for (const text of candidate.textVariants) {
      const normalized = text.trim().toLowerCase();
      assert.ok(normalized.length >= 12, `${scenario.scenarioId}/${candidate.candidateId}: candidate text too short`);
      assert.ok(!candidateTextSet.has(normalized), `${scenario.scenarioId}: duplicate candidate wording`);
      candidateTextSet.add(normalized);
    }

    if (candidate.expectedClassification === "IMPLICIT") {
      implicitCandidates += 1;
      implicitInScenario += 1;
      assert.equal(scenario.explicitPropositionIds.includes(candidate.propositionId), false, `${scenario.scenarioId}/${candidate.candidateId}: implicit candidate is explicit`);
      assert.equal(oracle.evidenceCode, "REQUIRED_HIDDEN_DEPENDENCY", `${scenario.scenarioId}/${candidate.candidateId}: implicit candidate lacks required-dependency proof`);
    } else {
      rejectedCandidates += 1;
      rejectedInScenario += 1;
      assert.ok(candidate.misconceptionClass, `${scenario.scenarioId}/${candidate.candidateId}: rejected candidate lacks misconception class`);
    }

    if (scenario.proposedQlId === "STA-QL-004" && candidate.expectedClassification === "IMPLICIT") {
      for (const statement of scenario.statementVariants) {
        const similarity = jaccard(tokens(statement), tokens(candidate.textVariants[0]));
        assert.ok(similarity < 0.62, `${scenario.scenarioId}/${candidate.candidateId}: QL004 hidden bridge too close to statement (${similarity.toFixed(2)})`);
        ql004RestatementChecks += 1;
      }
    }
  }

  assert.ok(implicitInScenario > 0, `${scenario.scenarioId}: no implicit assumption authority`);
  if (scenario.scenarioId !== "STA-DISC-QL002-004") {
    assert.ok(rejectedInScenario > 0, `${scenario.scenarioId}: no misconception-backed rejected assumption`);
  }
}

assert.ok(implicitCandidates >= 55, `Too few implicit candidate authorities: ${implicitCandidates}`);
assert.ok(rejectedCandidates >= 55, `Too few rejected candidate authorities: ${rejectedCandidates}`);
assert.ok(ql004RestatementChecks >= 20, `Too few QL004 restatement checks: ${ql004RestatementChecks}`);

console.log("PASS_STA_001_ENGLISH_AMBIGUITY_PROOF");
console.log(`implicit candidate authorities ${implicitCandidates}`);
console.log(`rejected candidate authorities ${rejectedCandidates}`);
console.log(`rationale quality checks ${rationaleChecks}`);
console.log(`QL004 hidden-bridge restatement checks ${ql004RestatementChecks}`);
console.log("English corpus status CANDIDATE_NOT_FROZEN");
console.log("Question Studio false");
