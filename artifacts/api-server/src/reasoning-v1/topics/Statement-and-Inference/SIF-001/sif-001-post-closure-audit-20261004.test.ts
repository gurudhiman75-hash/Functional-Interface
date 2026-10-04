import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { listSifAuthorities } from "./authorities.ts";
import { answerIndexFor, assertSifAuthority, canonicalSifCandidates, solveSifScenario, SIF_SUPPORT_PROOF_AUTHORITY } from "./solver.ts";
import { renderSifAuthority } from "./generator.ts";
import { assertSifExplanationAnswerConsistency, validateSifAuthority } from "./validators.ts";
import { SIF_CP_IDS, type GeneratedSifQuestion, type SifAnswerClass, type SifLocale, type SifScenarioAuthority } from "./types.ts";

const LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly SifLocale[];
const EXPECTED_AUTHORITY_COUNT = 630;

function swapAnswer(answer: SifAnswerClass): SifAnswerClass {
  if (answer === "ONLY_I") return "ONLY_II";
  if (answer === "ONLY_II") return "ONLY_I";
  return answer;
}

function displayOrder(
  question: GeneratedSifQuestion,
  authority: SifScenarioAuthority,
  locale: SifLocale,
): "I_II" | "II_I" {
  const [candidateI, candidateII] = canonicalSifCandidates(authority);
  assert.notEqual(
    candidateI.text[locale],
    candidateII.text[locale],
    `${authority.id}/${locale}: inference I and II text must remain distinct`,
  );

  if (
    question.inferences[0] === candidateI.text[locale]
    && question.inferences[1] === candidateII.text[locale]
  ) return "I_II";

  if (
    question.inferences[0] === candidateII.text[locale]
    && question.inferences[1] === candidateI.text[locale]
  ) return "II_I";

  throw new Error(`${authority.id}/${locale}: rendered inference text is not keyed to candidate IDs`);
}

function semanticRow(authority: SifScenarioAuthority): unknown {
  const [candidateI, candidateII] = canonicalSifCandidates(authority);
  return {
    id: authority.id,
    cpId: authority.cpId,
    difficulty: authority.difficulty,
    domain: authority.domain,
    mechanisms: [...authority.mechanisms],
    statement: authority.statement,
    facts: authority.facts.map((fact) => ({ id: fact.id, text: fact.text })),
    candidates: [candidateI, candidateII].map((candidate) => ({
      id: candidate.id,
      text: candidate.text,
      strength: candidate.strength,
      supportFactIds: [...candidate.supportFactIds],
      distractorType: candidate.distractorType ?? null,
    })),
    explanation: authority.explanation,
    identityGuard: authority.identityGuard,
  };
}

const semanticRows: unknown[] = [];
let authorityCount = 0;
let storedReversedOrderCount = 0;
let renderedSurfaceCount = 0;
let dualOrderAuthorityCount = 0;

for (const cpId of SIF_CP_IDS) {
  const pool = listSifAuthorities(cpId);
  assert.ok(pool.length > 0, `${cpId}: authority pool missing`);

  for (const authority of pool) {
    authorityCount += 1;
    semanticRows.push(semanticRow(authority));

    assertSifAuthority(authority);
    assertSifExplanationAnswerConsistency(authority);
    assert.ok(
      validateSifAuthority(authority).every((gate) => gate.passed),
      `${authority.id}: validation gate failed`,
    );

    if (authority.candidates[0].id === "II") storedReversedOrderCount += 1;

    const sourceAnswer = solveSifScenario(authority);
    const cycleZeroOrders = new Set<string>();
    const cycleOneOrders = new Set<string>();

    for (const locale of LOCALES) {
      const cycleZero = renderSifAuthority({
        authority,
        locale,
        seed: 0,
        poolSize: pool.length,
      });
      const cycleOne = renderSifAuthority({
        authority,
        locale,
        seed: pool.length,
        poolSize: pool.length,
      });

      for (const [cycle, question] of [[0, cycleZero], [1, cycleOne]] as const) {
        const order = displayOrder(question, authority, locale);
        const expectedAnswer = order === "I_II" ? sourceAnswer : swapAnswer(sourceAnswer);

        assert.equal(question.answerClass, expectedAnswer, `${authority.id}/${locale}/cycle-${cycle}: answer/display mismatch`);
        assert.equal(question.correctIndex, answerIndexFor(expectedAnswer), `${authority.id}/${locale}/cycle-${cycle}: answer index mismatch`);
        assert.equal(question.options[question.correctIndex] !== undefined, true);
        assert.equal(question.metadata.solver, "SIF_STRENGTH_BACKED_SUPPORT_V2");
        assert.equal(question.metadata.questionBankWritable, false);
        assert.equal(question.metadata.testEligible, false);
        assert.equal(question.metadata.mockEligible, false);
        assert.equal(question.metadata.publicEligible, false);
        renderedSurfaceCount += 1;

        if (cycle === 0) cycleZeroOrders.add(order);
        else cycleOneOrders.add(order);
      }
    }

    assert.equal(cycleZeroOrders.size, 1, `${authority.id}: locale presentation-order drift in cycle 0`);
    assert.equal(cycleOneOrders.size, 1, `${authority.id}: locale presentation-order drift in cycle 1`);

    if (authority.cpId === "SIF-CP002") {
      assert.deepEqual([...cycleZeroOrders], ["I_II"], `${authority.id}: CP002 approved baseline order drifted`);
      assert.deepEqual([...cycleOneOrders], ["I_II"], `${authority.id}: CP002 approved baseline order drifted`);
    } else {
      assert.notDeepEqual(
        [...cycleZeroOrders],
        [...cycleOneOrders],
        `${authority.id}: authority remains permanently tied to one I/II presentation order`,
      );
      dualOrderAuthorityCount += 1;
    }
  }
}

assert.equal(authorityCount, EXPECTED_AUTHORITY_COUNT, "SIF frozen authority inventory drifted");
assert.equal(renderedSurfaceCount, EXPECTED_AUTHORITY_COUNT * LOCALES.length * 2);
assert.ok(storedReversedOrderCount > 0, "post-closure audit expected to cover historically reversed candidate storage");

const semanticDigest = createHash("sha256")
  .update(JSON.stringify(semanticRows))
  .digest("hex");

// Fail-closed proof: changing only the legacy follows bit cannot silently change
// the answer because support is derived from strength and the disagreement is rejected.
const driftAuthority = listSifAuthorities("SIF-CP001").find((authority) => !authority.id.endsWith("-EITHER"));
assert.ok(driftAuthority, "SIF-CP001 needs a non-EITHER proof sample");
const driftCandidates = driftAuthority.candidates.map((candidate, index) =>
  index === 0 ? { ...candidate, follows: !candidate.follows } : candidate,
) as unknown as SifScenarioAuthority["candidates"];
assert.throws(
  () => solveSifScenario({ ...driftAuthority, candidates: driftCandidates }),
  /follows metadata disagrees with strength-backed support proof/i,
);

console.log(JSON.stringify({
  status: "PASS_SIF_001_POST_CLOSURE_AUDIT_20261004",
  authorityCount,
  locales: LOCALES,
  renderedSurfaceCount,
  storedReversedOrderCount,
  dualOrderAuthorityCount,
  supportProofAuthority: SIF_SUPPORT_PROOF_AUTHORITY,
  semanticDigest,
  questionBankWritable: false,
  testEligible: false,
  mockEligible: false,
  publiclyPublishable: false,
}, null, 2));
