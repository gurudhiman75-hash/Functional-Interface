import assert from "node:assert/strict";

import { NUM_CP008_PERMANENT_ALLOCATION } from "./permanent-allocation.ts";
import { generateNumCp008Permanent, type NumCp008PermanentQlId } from "./permanent-runtime.ts";
import {
  generateNumCp008QuestionStudioBatch,
  listNumCp008QuestionStudioPackages,
} from "./question-studio-integration.ts";

function wordCount(text: string): number {
  return text.trim().split(/\s+/u).filter(Boolean).length;
}

const ACADEMIC_LEAK = /(?:\bcongruence(?:s)?\b|\bresidue class(?:es)?\b|\bmodulo\b|\bgeneralized CRT\b|\bnormalis(?:e|ation)\b|\bnormalize\b)/iu;
const IMPLEMENTATION_LEAK = /(?:prototype|generator|fingerprint|hidden state|authority package)/iu;
const MALFORMED = /\b(?:undefined|null|NaN)\b/u;

let packages = 0;
let explanationChecks = 0;
let qsChecks = 0;
let minExplanationWords = Number.POSITIVE_INFINITY;
let maxExplanationWords = 0;
let minStepCount = Number.POSITIVE_INFINITY;
let maxStepCount = 0;
const qlReach = new Set<string>();
const prototypeReach = new Set<string>();

for (const allocation of NUM_CP008_PERMANENT_ALLOCATION) {
  const qlId = allocation.qlId as NumCp008PermanentQlId;
  qlReach.add(qlId);

  for (let seed = 1; seed <= 120; seed += 1) {
    const first = generateNumCp008Permanent(qlId, seed);
    const second = generateNumCp008Permanent(qlId, seed);
    const label = `${qlId}/${seed}`;

    assert.deepEqual(first, second, `${label}: deterministic replay drift`);
    assert.equal(first.permanentQlId, qlId, `${label}: QL drift`);
    assert.equal(first.canonicalAnswer, first.verifierAnswer, `${label}: verifier drift`);
    assert.equal(first.options[first.correctIndex]?.value, first.canonicalAnswer, `${label}: answer-option binding drift`);
    assert.equal(first.explanation.finalAnswer, first.canonicalAnswer, `${label}: explanation answer drift`);

    const explanationText = [
      first.explanation.coreConcept,
      first.explanation.strategy,
      ...first.explanation.steps,
    ].join(" ");
    const words = wordCount(explanationText);
    const stepCount = first.explanation.steps.length;

    assert.ok(wordCount(first.explanation.coreConcept) >= 6, `${label}: concept is too thin`);
    assert.ok(wordCount(first.explanation.strategy) >= 9, `${label}: strategy is too thin`);
    assert.ok(stepCount >= 2, `${label}: worked solution needs at least two steps`);
    assert.ok(words >= 35, `${label}: explanation is still too thin (${words} words)`);
    assert.ok(words <= 190, `${label}: explanation became too long (${words} words)`);
    assert.doesNotMatch(explanationText, ACADEMIC_LEAK, `${label}: academic vocabulary leaked into learner explanation`);
    assert.doesNotMatch(explanationText, IMPLEMENTATION_LEAK, `${label}: implementation vocabulary leaked into learner explanation`);
    assert.doesNotMatch(explanationText, MALFORMED, `${label}: malformed learner value`);
    assert.ok(/[0-9]/u.test(explanationText), `${label}: worked solution contains no concrete calculation/value`);

    assert.equal(first.lifecycle.questionStudioDiscoverable, false);
    assert.equal(first.lifecycle.questionBankWritable, false);
    assert.equal(first.lifecycle.testEligible, false);
    assert.equal(first.lifecycle.publiclyPublishable, false);

    minExplanationWords = Math.min(minExplanationWords, words);
    maxExplanationWords = Math.max(maxExplanationWords, words);
    minStepCount = Math.min(minStepCount, stepCount);
    maxStepCount = Math.max(maxStepCount, stepCount);
    prototypeReach.add(first.temporaryPrototypeId);
    explanationChecks += 1;
    packages += 1;
  }

  const preview = await generateNumCp008QuestionStudioBatch({
    packageId: "NUM-002",
    canonicalProblemId: "NUM-CP-008",
    questionLanguageId: qlId,
    language: "en",
    seed: `cp008-v3-explanation:${qlId}`,
    count: 1,
  });
  const question = preview.questions[0]!;
  assert.equal(question.questionLanguageId, qlId);
  assert.equal(question.answer, question.options[question.correctIndex]);
  assert.ok(wordCount(question.explanation) >= 40, `${qlId}: Question Studio explanation is too thin`);
  assert.doesNotMatch(question.explanation, ACADEMIC_LEAK, `${qlId}: academic wording leaked through Question Studio`);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.publiclyPublishable, false);
  qsChecks += 1;
}

const capability = listNumCp008QuestionStudioPackages()[0]!;
assert.equal(capability.name, "NUM-002 Number System — Advanced Remainder Problems & Modular Conditions");
assert.equal(capability.label, "Number System — Advanced Remainder Problems & Modular Conditions");
assert.equal(capability.canonicalProblems[0]?.label, "Advanced remainder problems and combined remainder conditions");
assert.equal(capability.permanentQlCount, 19);
assert.equal(capability.questionBankWritable, false);
assert.equal(capability.testEligible, false);
assert.equal(capability.publiclyPublishable, false);

assert.equal(packages, 19 * 120);
assert.equal(explanationChecks, packages);
assert.equal(qlReach.size, 19);
assert.equal(prototypeReach.size, 26);
assert.equal(qsChecks, 19);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_ENGLISH_EXPLANATION_HUMAN_V3",
  packages,
  permanentQlReach: qlReach.size,
  prototypeReach: prototypeReach.size,
  explanationChecks,
  questionStudioChecks: qsChecks,
  minExplanationWords,
  maxExplanationWords,
  minStepCount,
  maxStepCount,
  questionStudioName: capability.name,
  downstreamActivations: 0,
}, null, 2));
