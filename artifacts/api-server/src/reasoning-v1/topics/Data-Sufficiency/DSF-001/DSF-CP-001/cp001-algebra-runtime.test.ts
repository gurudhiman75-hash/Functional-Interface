import assert from "node:assert/strict";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
} from "../foundation/index.ts";
import {
  ALG_ENGLISH_V3_FREEZE_APPROVAL,
} from "../../../../../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/permanent/english-freeze-v3.ts";
import {
  getAlgPermanentAllocation,
} from "../../../../../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/permanent/allocation.ts";
import {
  getAlgPermanentPrototypeIds,
} from "../../../../../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/permanent/english-adapter.ts";
import {
  DSF_CP001_ALGEBRA_RUNTIME_VERSION,
  generateDsfCp001AlgebraEnglish,
} from "./cp001-algebra-runtime.ts";

const sourceAllocation = getAlgPermanentAllocation("ALG-QL-040");
assert.equal(sourceAllocation.cpId, "ALG-CP-014");
assert.equal(sourceAllocation.title, "Algebraic data sufficiency");
assert.equal(sourceAllocation.freezeKey, "F-C040");
assert.equal(sourceAllocation.permanentIdentityFrozen, true);
assert.equal(sourceAllocation.semanticContractFrozen, true);
assert.equal(ALG_ENGLISH_V3_FREEZE_APPROVAL.englishImplementationFrozen, true);
assert.equal(ALG_ENGLISH_V3_FREEZE_APPROVAL.solverAuthorityFrozen, true);
assert.deepEqual(getAlgPermanentPrototypeIds("ALG-QL-040"), [
  "ALG-CP014-CAND-004",
  "ALG-CP014-CAND-005",
  "ALG-CP014-CAND-006",
  "ALG-CP014-CAND-007",
  "ALG-CP014-CAND-008",
]);

const seeds = Array.from({ length: 500 }, (_, seed) => seed);
const questions = seeds.map(generateDsfCp001AlgebraEnglish);
const classCounts = Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [
  semanticClass,
  questions.filter((question) => question.canonicalAnswer === semanticClass).length,
]));

assert.deepEqual(new Set(questions.map((question) => question.canonicalAnswer)), new Set(SUFFICIENCY_CLASSES));
for (const semanticClass of SUFFICIENCY_CLASSES) {
  assert((classCounts[semanticClass] ?? 0) >= 70, `${semanticClass} is underrepresented in the 500-seed Algebra proof`);
}

const solveModeCounts = {
  singleVariable: questions.filter((question) => question.solveModeId === "DSF-SM-ALG-SINGLE-VARIABLE-X").length,
  linearSystem: questions.filter((question) => question.solveModeId === "DSF-SM-ALG-LINEAR-SYSTEM-X").length,
};
assert(solveModeCounts.singleVariable >= 200);
assert(solveModeCounts.linearSystem >= 150);

const sourcePrototypeCounts = Object.fromEntries(
  [...new Set(questions.map((question) => question.sourcePrototypeId))]
    .sort()
    .map((prototypeId) => [prototypeId, questions.filter((question) => question.sourcePrototypeId === prototypeId).length]),
);
assert.equal(Object.keys(sourcePrototypeCounts).length, 5);

const expectedOptionContract = DS_STANDARD_5_EN.options.map((option) => ({
  key: option.key,
  semanticClass: option.semanticClass,
  value: option.text,
}));

for (const question of questions) {
  assert.equal(question.runtimeVersion, DSF_CP001_ALGEBRA_RUNTIME_VERSION);
  assert.equal(question.qlId, "DSF-QL-001");
  assert.equal(question.checkpointId, "DSF-CP-001");
  assert.equal(question.sourceChapterId, "ALG-002");
  assert.equal(question.sourcePermanentQlId, "ALG-QL-040");
  assert.equal(question.sourceCpId, "ALG-CP-014");
  assert.equal(question.sourceFreezeId, "ALG-EN-v3-frozen");
  assert.equal(question.answerContractId, "DS_STANDARD_5");
  assert.equal(question.proof.sourceAndDsfClassificationAgree, true);
  assert.equal(question.proof.statementI.consistent, true);
  assert.equal(question.proof.statementII.consistent, true);
  assert.equal(question.proof.together.consistent, true);
  assert.deepEqual(
    question.options.map((option) => ({ key: option.key, semanticClass: option.semanticClass, value: option.value })),
    expectedOptionContract,
  );
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticClass, question.canonicalAnswer);
  assert.equal(question.statements.length, 2);
  assert(!question.statements[0].text.startsWith("I."));
  assert(!question.statements[1].text.startsWith("II."));
  assert(!question.stem.includes("ALG-"));
  assert(!question.questionPrompt.includes("DSF-"));
  const learnerText = JSON.stringify({
    stem: question.stem,
    prompt: question.questionPrompt,
    statements: question.statements,
    options: question.options.map((option) => option.value),
    explanation: question.explanation,
  });
  assert(!learnerText.includes("EITHER_ALONE"));
  assert(!learnerText.includes("STATEMENT_I_ONLY"));
  assert(!learnerText.includes("sourcePrototypeId"));
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
}

const repeatSeeds = [0, 1, 2, 17, 99, 241, 499];
for (const seed of repeatSeeds) {
  assert.deepEqual(generateDsfCp001AlgebraEnglish(seed), generateDsfCp001AlgebraEnglish(seed));
}

const generationIdentities = new Set(questions.map((question) => question.generationIdentity));
assert.equal(generationIdentities.size, questions.length);

const representative = SUFFICIENCY_CLASSES.map((semanticClass) => {
  const question = questions.find((entry) => entry.canonicalAnswer === semanticClass)!;
  return {
    seed: question.seed,
    class: question.canonicalAnswer,
    sourcePrototype: question.sourcePrototypeId,
    solveMode: question.solveModeId,
    difficulty: question.difficulty,
    stem: question.stem,
    statementI: question.statements[0].text,
    statementII: question.statements[1].text,
    correctOption: question.options[question.correctIndex]!.value,
    explanation: [
      question.explanation.askedTarget,
      question.explanation.statementI,
      question.explanation.statementII,
      ...(question.explanation.together ? [question.explanation.together] : []),
      question.explanation.conclusion,
    ],
  };
});

console.log(JSON.stringify({
  status: "PASS_DSF_CP_001_ALGEBRA_PRODUCTION",
  generated: questions.length,
  sourcePermanentQlId: sourceAllocation.qlId,
  sourceFreezeKey: sourceAllocation.freezeKey,
  sourceFreezeId: "ALG-EN-v3-frozen",
  classCounts,
  solveModeCounts,
  sourcePrototypeCounts,
  distinctGenerationIdentities: generationIdentities.size,
  representative,
  lifecycle: "REVIEW_ONLY_NOT_PUBLISHED",
}, null, 2));
