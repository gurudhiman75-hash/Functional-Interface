import assert from "node:assert/strict";
import { canonicalSetKey, uniqueSorted } from "./canonical-set";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import { verifySentenceCodeConstraintsBruteForce } from "./independent-verifier";
import { analyzeSentenceCodeRowMinimality } from "./row-minimality";
import {
  classifyWordsToTokenSetRelation,
  classifyWordTokenRelation,
  possibleMissingTokens,
  queryDomain,
} from "./solution-space";
import {
  generateAbstractSentenceCodeTopology,
  SENTENCE_CODE_TOPOLOGY_KINDS,
  type GeneratedSentenceCodeTopology,
  type SentenceCodeTopologyKind,
} from "./topology-generator";
import type { AbstractSentenceCodeRow, SentenceCodeSolutionSpace } from "./types";

function row(generated: GeneratedSentenceCodeTopology, rowId: string): AbstractSentenceCodeRow {
  const found = generated.puzzle.rows.find((candidate) => candidate.rowId === rowId);
  if (!found) throw new Error(`Missing generated row '${rowId}'`);
  return found;
}

function intersection(left: readonly string[], right: readonly string[]): string[] {
  const rightSet = new Set(right);
  return uniqueSorted(left.filter((value) => rightSet.has(value)));
}

function difference(left: readonly string[], right: readonly string[]): string[] {
  const rightSet = new Set(right);
  return uniqueSorted(left.filter((value) => !rightSet.has(value)));
}

function solutionKeys(space: SentenceCodeSolutionSpace): string[] {
  return space.solutions.map((solution) => Object.entries(solution.wordToToken)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([wordId, token]) => `${wordId}=${token}`)
    .join("|"))
    .sort();
}

function verifyDualSolvers(generated: GeneratedSentenceCodeTopology): void {
  const production = solveSentenceCodeConstraints(generated.puzzle);
  const verifier = verifySentenceCodeConstraintsBruteForce(generated.puzzle, { maxAssignments: 10_000 });
  assert.equal(production.solutionCount, verifier.solutionCount, `${generated.kind}/${generated.seed} solution count`);
  assert.deepEqual(production.candidateTokensByWord, verifier.candidateTokensByWord, `${generated.kind}/${generated.seed} word candidates`);
  assert.deepEqual(production.candidateWordsByToken, verifier.candidateWordsByToken, `${generated.kind}/${generated.seed} token candidates`);
  assert.deepEqual(production.invariantPairs, verifier.invariantPairs, `${generated.kind}/${generated.seed} invariant pairs`);
  assert.deepEqual(solutionKeys(production), solutionKeys(verifier), `${generated.kind}/${generated.seed} complete mappings`);
}

function verifyRowsMatchHiddenMapping(generated: GeneratedSentenceCodeTopology): void {
  for (const currentRow of generated.puzzle.rows) {
    assert.equal(
      canonicalSetKey(currentRow.wordIds.map((wordId) => generated.hiddenMapping[wordId]!)),
      canonicalSetKey(currentRow.codeTokens),
      `${generated.kind}/${generated.seed}/${currentRow.rowId} hidden mapping mismatch`,
    );
  }
}

function verifyTopologyObligation(generated: GeneratedSentenceCodeTopology): void {
  const r1 = row(generated, "r1");
  const r2 = generated.puzzle.rows.some((candidate) => candidate.rowId === "r2") ? row(generated, "r2") : undefined;
  const r3 = generated.puzzle.rows.some((candidate) => candidate.rowId === "r3") ? row(generated, "r3") : undefined;
  const r4 = generated.puzzle.rows.some((candidate) => candidate.rowId === "r4") ? row(generated, "r4") : undefined;

  if (generated.kind === "DIRECT_SINGLE_INTERSECTION") {
    assert.deepEqual(intersection(r1.wordIds, r2!.wordIds), [generated.targetWordId]);
    assert.deepEqual(intersection(r1.codeTokens, r2!.codeTokens), [generated.targetToken]);
    return;
  }

  if (generated.kind === "CHAINED_SINGLETON_PROPAGATION" || generated.kind === "MISSING_MEMBER_COMPLETION") {
    const helperWord = generated.roleWordIds.HELPER!;
    const helperToken = generated.roleTokens.HELPER!;
    const firstWordOverlap = intersection(r1.wordIds, r2!.wordIds);
    const firstTokenOverlap = intersection(r1.codeTokens, r2!.codeTokens);
    assert.deepEqual(firstWordOverlap, uniqueSorted([generated.roleWordIds.TARGET!, helperWord]));
    assert.deepEqual(firstTokenOverlap, uniqueSorted([generated.roleTokens.TARGET!, helperToken]));
    assert.deepEqual(intersection(r1.wordIds, r3!.wordIds), [helperWord]);
    assert.deepEqual(intersection(r1.codeTokens, r3!.codeTokens), [helperToken]);
    assert.deepEqual(difference(firstWordOverlap, [helperWord]), [generated.roleWordIds.TARGET!]);
    assert.deepEqual(difference(firstTokenOverlap, [helperToken]), [generated.roleTokens.TARGET!]);
    return;
  }

  if (generated.kind === "SET_DIFFERENCE_ELIMINATION") {
    const overlapWords = intersection(r1.wordIds, r2!.wordIds);
    const overlapTokens = intersection(r1.codeTokens, r2!.codeTokens);
    assert.equal(overlapWords.length, 3);
    assert.equal(overlapTokens.length, 3);
    assert.deepEqual(difference(overlapWords, r3!.wordIds), [generated.targetWordId]);
    assert.deepEqual(difference(overlapTokens, r3!.codeTokens), [generated.targetToken]);
    return;
  }

  if (generated.kind === "FORKED_EVIDENCE_JOIN") {
    const sharedWords = intersection(r1.wordIds, r3!.wordIds);
    const sharedTokens = intersection(r1.codeTokens, r3!.codeTokens);
    const sharedAWord = generated.roleWordIds.SHARED_A!;
    const sharedAToken = generated.roleTokens.SHARED_A!;
    const sharedBWord = generated.roleWordIds.SHARED_B!;
    const sharedBToken = generated.roleTokens.SHARED_B!;

    assert.deepEqual(sharedWords, uniqueSorted([generated.targetWordId, sharedAWord, sharedBWord]));
    assert.deepEqual(sharedTokens, uniqueSorted([generated.targetToken, sharedAToken, sharedBToken]));
    assert.deepEqual(intersection(sharedWords, r2!.wordIds), [sharedAWord]);
    assert.deepEqual(intersection(sharedTokens, r2!.codeTokens), [sharedAToken]);
    assert.deepEqual(intersection(sharedWords, r4!.wordIds), [sharedBWord]);
    assert.deepEqual(intersection(sharedTokens, r4!.codeTokens), [sharedBToken]);
    assert.deepEqual(difference(sharedWords, [sharedAWord, sharedBWord]), [generated.targetWordId]);
    assert.deepEqual(difference(sharedTokens, [sharedAToken, sharedBToken]), [generated.targetToken]);
    assert.deepEqual(
      [r1, r2!, r3!, r4!].map((current) => current.wordIds).reduce((current, next) => intersection(current, next)),
      [],
      "Forked target must not be obtainable as the member common to all rows",
    );
    assert.deepEqual(
      [r1, r2!, r3!, r4!].map((current) => current.codeTokens).reduce((current, next) => intersection(current, next)),
      [],
      "Forked target code must not be obtainable as the code common to all rows",
    );
    return;
  }

  if (generated.kind === "GLOBAL_BIJECTION_DEDUCTION") {
    const rows = [r1, r2!, r3!];
    for (let left = 0; left < rows.length; left += 1) {
      for (let right = left + 1; right < rows.length; right += 1) {
        const sharedWords = intersection(rows[left]!.wordIds, rows[right]!.wordIds);
        const sharedTokens = intersection(rows[left]!.codeTokens, rows[right]!.codeTokens);
        assert.equal(sharedWords.includes(generated.targetWordId), true);
        assert.equal(sharedTokens.includes(generated.targetToken), true);
        assert.equal(sharedWords.length, 2);
        assert.equal(sharedTokens.length, 2);
      }
    }
    return;
  }

  if (generated.kind === "CONTROLLED_PARTIAL_INFORMATION") {
    const partnerWord = generated.roleWordIds.TARGET_PARTNER!;
    const partnerToken = generated.roleTokens.TARGET_PARTNER!;
    const space = solveSentenceCodeConstraints(generated.puzzle);
    assert.deepEqual(space.candidateTokensByWord[generated.targetWordId], uniqueSorted([generated.targetToken, partnerToken]));
    assert.deepEqual(space.candidateTokensByWord[partnerWord], uniqueSorted([generated.targetToken, partnerToken]));
    return;
  }

  if (generated.kind === "PHRASE_SET_COMPOSITION") {
    const space = solveSentenceCodeConstraints(generated.puzzle);
    assert.equal(classifyWordTokenRelation(space, generated.phraseWordIds![0]!, generated.phraseTokens![0]!), "POSSIBLE");
    assert.equal(classifyWordsToTokenSetRelation(space, generated.phraseWordIds!, generated.phraseTokens!), "DEFINITE");
  }
}

const fingerprints = new Map<SentenceCodeTopologyKind, Set<string>>();
const renderedVariants = new Map<SentenceCodeTopologyKind, Set<string>>();
const solutionCounts = new Map<SentenceCodeTopologyKind, Set<number>>();
let generatedCases = 0;
let completeMappingsVerified = 0;
let minimalityChecks = 0;
let missingPresentations = 0;

for (const kind of SENTENCE_CODE_TOPOLOGY_KINDS) {
  fingerprints.set(kind, new Set<string>());
  renderedVariants.set(kind, new Set<string>());
  solutionCounts.set(kind, new Set<number>());

  for (let seed = 1; seed <= 120; seed += 1) {
    const first = generateAbstractSentenceCodeTopology(kind, seed);
    const second = generateAbstractSentenceCodeTopology(kind, seed);
    assert.deepEqual(first, second, `${kind}/${seed} must be deterministic`);
    assert.equal("qlId" in first, false);
    assert.equal(JSON.stringify(first).includes("COD-QL-"), false);

    const space = solveSentenceCodeConstraints(first.puzzle);
    assert.equal(space.solutionCount, first.expectedSolutionCount);
    assert.equal(queryDomain(space, first.query).length, first.expectedQueryDomainSize);
    verifyRowsMatchHiddenMapping(first);
    verifyTopologyObligation(first);
    verifyDualSolvers(first);

    const minimality = analyzeSentenceCodeRowMinimality(first.puzzle, first.query);
    if (first.requireAllRowsForQuery) {
      assert.equal(minimality.allRowsContribute, true, `${kind}/${seed} has a redundant row`);
    }
    minimalityChecks += first.puzzle.rows.length;

    if (kind === "CONTROLLED_PARTIAL_INFORMATION") {
      assert.equal(classifyWordTokenRelation(space, first.targetWordId, first.targetToken), "POSSIBLE");
    } else if (kind === "PHRASE_SET_COMPOSITION") {
      assert.equal(classifyWordsToTokenSetRelation(space, first.phraseWordIds!, first.phraseTokens!), "DEFINITE");
    } else {
      assert.equal(classifyWordTokenRelation(space, first.targetWordId, first.targetToken), "DEFINITE");
    }

    if (kind === "MISSING_MEMBER_COMPLETION") {
      const presentation = first.missingPresentation!;
      assert.deepEqual(
        possibleMissingTokens(space, presentation.wordIds, presentation.knownTokens),
        [presentation.expectedMissingToken],
      );
      assert.equal(presentation.missingWordId, first.targetWordId);
      assert.equal(presentation.expectedMissingToken, first.targetToken);
      missingPresentations += 1;
    } else {
      assert.equal(first.missingPresentation, undefined);
    }

    fingerprints.get(kind)!.add(first.topologyFingerprint);
    renderedVariants.get(kind)!.add(JSON.stringify(first.puzzle));
    solutionCounts.get(kind)!.add(space.solutionCount);
    generatedCases += 1;
    completeMappingsVerified += space.solutionCount;
  }

  assert.equal(fingerprints.get(kind)!.size, 1, `${kind} fingerprint must be label/order invariant`);
  assert.ok(renderedVariants.get(kind)!.size >= 100, `${kind} lacks deterministic runtime variation`);
  assert.equal(solutionCounts.get(kind)!.size, 1, `${kind} solution multiplicity drifted across seeds`);
}

assert.equal(generatedCases, SENTENCE_CODE_TOPOLOGY_KINDS.length * 120);
assert.equal(missingPresentations, 120);
assert.equal(
  fingerprints.get("CHAINED_SINGLETON_PROPAGATION")!.values().next().value,
  fingerprints.get("MISSING_MEMBER_COMPLETION")!.values().next().value,
  "Missing-member is a presentation contract over the chained abstract topology",
);
assert.equal(
  fingerprints.get("CONTROLLED_PARTIAL_INFORMATION")!.values().next().value,
  fingerprints.get("PHRASE_SET_COMPOSITION")!.values().next().value,
  "Phrase-set composition may share the same hidden topology while changing query semantics",
);
assert.notEqual(
  fingerprints.get("DIRECT_SINGLE_INTERSECTION")!.values().next().value,
  fingerprints.get("GLOBAL_BIJECTION_DEDUCTION")!.values().next().value,
);
assert.notEqual(
  fingerprints.get("FORKED_EVIDENCE_JOIN")!.values().next().value,
  fingerprints.get("GLOBAL_BIJECTION_DEDUCTION")!.values().next().value,
);

console.log(JSON.stringify({
  checkpoint: "COD-CP-009",
  maturity: "ABSTRACT_TOPOLOGY_PROOF",
  permanentQlsCreated: 0,
  topologyKinds: SENTENCE_CODE_TOPOLOGY_KINDS,
  generatedCases,
  seedsPerTopology: 120,
  completeMappingsVerified,
  minimalityChecks,
  missingPresentations,
  fingerprints: Object.fromEntries(
    SENTENCE_CODE_TOPOLOGY_KINDS.map((kind) => [kind, [...fingerprints.get(kind)!][0]]),
  ),
  renderedVariantCounts: Object.fromEntries(
    SENTENCE_CODE_TOPOLOGY_KINDS.map((kind) => [kind, renderedVariants.get(kind)!.size]),
  ),
  verdict: "PASS — ABSTRACT SENTENCE-CODE TOPOLOGY GENERATION",
}, null, 2));
