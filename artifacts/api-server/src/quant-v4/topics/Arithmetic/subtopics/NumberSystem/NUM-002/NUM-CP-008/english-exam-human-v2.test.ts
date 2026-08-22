import assert from "node:assert/strict";

import { presentNumCp008EnglishAnswer } from "./english-answer-presentation-v2.ts";
import { NUM_CP008_PERMANENT_ALLOCATION } from "./permanent-allocation.ts";
import { generateNumCp008Permanent, type NumCp008PermanentQlId } from "./permanent-runtime.ts";
import { generateNumCp008Wave01ReviewFinal } from "./wave01/runtime-review-final.ts";
import type { NumCp008Wave01PrototypeId } from "./wave01/types.ts";
import { generateNumCp008Wave02ReviewFinal } from "./wave02/runtime-review-final.ts";
import type { NumCp008Wave02PrototypeId } from "./wave02/types.ts";
import { generateNumCp008Wave03Reviewed } from "./wave03/runtime-review-final.ts";
import type { NumCp008Wave03PrototypeId } from "./wave03/types.ts";
import { generateNumCp008Wave04Reviewed } from "./wave04/runtime-review-final.ts";
import type { NumCp008Wave04PrototypeId } from "./wave04/types.ts";

function prototypeNumber(prototypeId: string): number {
  const match = prototypeId.match(/(\d{3})$/);
  if (!match) throw new Error(`Malformed prototype id ${prototypeId}`);
  return Number(match[1]);
}

function sourceFor(prototypeId: string, seed: number) {
  const number = prototypeNumber(prototypeId);
  if (number <= 8) return generateNumCp008Wave01ReviewFinal(prototypeId as NumCp008Wave01PrototypeId, seed);
  if (number <= 16) return generateNumCp008Wave02ReviewFinal(prototypeId as NumCp008Wave02PrototypeId, seed);
  if (number <= 24) return generateNumCp008Wave03Reviewed(prototypeId as NumCp008Wave03PrototypeId, seed);
  return generateNumCp008Wave04Reviewed(prototypeId as NumCp008Wave04PrototypeId, seed);
}

function words(value: string): number {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

const STEM_ACADEMIC = /(?:≡|\\pmod|\bmodulo\b|\bcongruence(?:s)?\b|\bresidue class(?:es)?\b|\bclassify the system\b|\bgeneralized CRT\b|\bnormalis(?:e|ation)|\bnormalize\b)/iu;
const EXPLANATION_ACADEMIC = /(?:\bgeneralized CRT\b|\bcongruence(?:s)?\b|\bresidue class(?:es)?\b|\bmodulo\b|\bnormalis(?:e|ation)|\bnormalize\b)/iu;
const ANSWER_ACADEMIC = /(?:\bmodulo\b|\bresidue class(?:es)?\b|\bcompatible\b|\bincompatible\b)/iu;
const STEM_GRAMMAR_DEFECT = /(?:must leaves remainder|all integers from[^?.\n]{0,160}that leaves remainder|values leaves remainder|they leaves remainder|conditions \(leaves remainder)/iu;
const IMPLEMENTATION_LEAK = /prototype|generator|fingerprint|hidden state|authority package/iu;

let checked = 0;
let changedStems = 0;
let changedExplanations = 0;
let humanizedAnswerLabels = 0;
let downstreamActivations = 0;
const qlReach = new Set<string>();
const prototypeReach = new Set<string>();

for (const allocation of NUM_CP008_PERMANENT_ALLOCATION) {
  const qlId = allocation.qlId as NumCp008PermanentQlId;
  qlReach.add(qlId);

  for (let seed = 1; seed <= 120; seed += 1) {
    const prototypeId = allocation.prototypes[(seed - 1) % allocation.prototypes.length]!;
    const source = sourceFor(prototypeId, seed);
    const final = generateNumCp008Permanent(qlId, seed);
    const label = `${qlId}/${prototypeId}/${seed}`;
    prototypeReach.add(prototypeId);

    assert.equal(final.temporaryPrototypeId, source.temporaryPrototypeId, `${label}: prototype drift`);
    assert.equal(final.seed, source.seed, `${label}: seed drift`);
    assert.equal(final.difficulty, source.difficulty, `${label}: difficulty drift`);
    assert.equal(final.answerSemantic, source.answerSemantic, `${label}: answer semantic drift`);
    assert.equal(final.representation, source.representation, `${label}: representation drift`);
    assert.deepEqual(final.options, source.options, `${label}: option/distractor drift`);
    assert.equal(final.correctIndex, source.correctIndex, `${label}: correct-index drift`);
    assert.equal(final.canonicalAnswer, source.canonicalAnswer, `${label}: canonical answer drift`);
    assert.equal(final.verifierAnswer, source.verifierAnswer, `${label}: verifier drift`);
    assert.deepEqual(final.hiddenState, source.hiddenState, `${label}: hidden-state drift`);
    assert.equal(final.mathematicalFingerprint, source.mathematicalFingerprint, `${label}: fingerprint drift`);
    assert.deepEqual(final.sourceAncestry, source.sourceAncestry, `${label}: source ancestry drift`);
    assert.deepEqual(final.prototypeAncestry, source.prototypeAncestry, `${label}: prototype ancestry drift`);

    assert.doesNotMatch(final.stem, STEM_ACADEMIC, `${label}: academic wording leaked into stem: ${final.stem}`);
    assert.doesNotMatch(final.stem, STEM_GRAMMAR_DEFECT, `${label}: grammar defect leaked into stem: ${final.stem}`);
    assert.ok(words(final.stem) <= 85, `${label}: stem too long (${words(final.stem)} words)`);
    const explanationText = [final.explanation.coreConcept, final.explanation.strategy, ...final.explanation.steps].join(" ");
    assert.doesNotMatch(explanationText, EXPLANATION_ACADEMIC, `${label}: academic wording leaked into explanation`);
    assert.doesNotMatch(`${final.stem} ${explanationText}`, IMPLEMENTATION_LEAK, `${label}: implementation vocabulary leak`);
    assert.ok(words(explanationText) <= 145, `${label}: explanation too long (${words(explanationText)} words)`);
    assert.ok(final.explanation.coreConcept.trim().length > 0, `${label}: missing simple concept`);
    assert.ok(final.explanation.strategy.trim().length > 0, `${label}: missing simple strategy`);
    assert.ok(final.explanation.steps.length >= 2, `${label}: explanation too thin`);
    assert.equal(final.explanation.finalAnswer, final.canonicalAnswer, `${label}: final answer drift`);

    for (const option of final.options) {
      const displayed = presentNumCp008EnglishAnswer(option.value);
      assert.doesNotMatch(displayed, ANSWER_ACADEMIC, `${label}: academic answer label leaked to learner: ${displayed}`);
      if (displayed !== option.value) humanizedAnswerLabels += 1;
    }
    const displayedAnswer = presentNumCp008EnglishAnswer(final.canonicalAnswer);
    assert.equal(displayedAnswer, presentNumCp008EnglishAnswer(final.options[final.correctIndex]!.value), `${label}: displayed answer binding drift`);

    if (final.stem !== source.stem) changedStems += 1;
    if (JSON.stringify(final.explanation) !== JSON.stringify(source.explanation)) changedExplanations += 1;

    const lifecycle = final.lifecycle;
    downstreamActivations += Number(lifecycle.active)
      + Number(lifecycle.questionStudioDiscoverable)
      + Number(lifecycle.questionBankWritable)
      + Number(lifecycle.testEligible)
      + Number(lifecycle.publiclyPublishable);

    checked += 1;
  }
}

assert.equal(checked, 19 * 120);
assert.equal(qlReach.size, 19);
assert.equal(prototypeReach.size, 26);
assert.ok(changedStems >= Math.floor(checked * 0.95), `Expected at least 95% of sampled stems to be editorially rewritten, got ${changedStems}/${checked}`);
assert.equal(changedExplanations, checked, "Every sampled English explanation should use the human surface");
assert.ok(humanizedAnswerLabels > 0, "Expected academic source labels to be humanized at presentation time");
assert.equal(downstreamActivations, 0, "English editorial work must not open downstream lifecycle gates");

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_ENGLISH_EXAM_HUMAN_V2",
  packagesChecked: checked,
  permanentQlReach: qlReach.size,
  prototypeReach: prototypeReach.size,
  changedStems,
  changedExplanations,
  humanizedAnswerLabels,
  answerChanges: 0,
  optionSemanticChanges: 0,
  fingerprintChanges: 0,
  downstreamActivations,
}, null, 2));
