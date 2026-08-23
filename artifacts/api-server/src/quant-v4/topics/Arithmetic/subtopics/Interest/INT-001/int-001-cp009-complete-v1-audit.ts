import { eq } from "./cp003-exam-model";
import {
  INT_CP009_PERMANENT_ALLOCATION,
  INT_CP009_PERMANENT_QL_IDS,
} from "./cp009-permanent-allocation-v1";
import {
  generateIntCp009Permanent,
  getIntCp009PrototypeForPermanentQl,
} from "./cp009-production-runtime-v1";
import { generateIntCp009Localized } from "./cp009-localization-v2";
import { generateIntCp009Frozen, INT_CP009_RELEASE_ID } from "./cp009-final-freeze-v1";
import {
  generateIntCp009QuestionStudioBatch,
  isIntCp009QuestionStudioRequest,
  listIntCp009QuestionStudioPackages,
} from "./cp009-question-studio-integration-v1";
import { solveIntCp009Prototype, verifyIntCp009PrototypeAnswer } from "./cp009-dated-cash-flow-exam-ready-v3-polish";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

assert(INT_CP009_PERMANENT_QL_IDS.length === 5, "CP009 permanent QL count must be five");
assert(new Set(INT_CP009_PERMANENT_QL_IDS).size === 5, "CP009 permanent QLs must be unique");
assert(INT_CP009_PERMANENT_QL_IDS.join(",") === "INT-QL-125,INT-QL-126,INT-QL-127,INT-QL-128,INT-QL-129", "CP009 permanent range drifted");
assert(INT_CP009_PERMANENT_ALLOCATION.flatMap((entry) => entry.sourcePrototypeIds).length === 8, "CP009 must preserve eight source variants");
assert(new Set(INT_CP009_PERMANENT_ALLOCATION.flatMap((entry) => entry.sourcePrototypeIds)).size === 8, "CP009 source variants collide");

let productionQuestions = 0;
let deterministicChecks = 0;
let solverVerifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let realismChecks = 0;
const sourceCoverage = new Set<string>();
const stemCoverage = new Set<string>();
const positionCounts = [0, 0, 0, 0];
const fingerprintByQl = new Map<string, Set<string>>();

for (const qlId of INT_CP009_PERMANENT_QL_IDS) {
  fingerprintByQl.set(qlId, new Set());
  for (let index = 0; index < 1000; index += 1) {
    const seed = `cp009:production:${qlId}:${index}`;
    const q = generateIntCp009Permanent(qlId, seed) as any;
    productionQuestions += 1;
    if (index % 10 === 0) {
      assert(stable(q) === stable(generateIntCp009Permanent(qlId, seed)), `${qlId}/${seed}: nondeterministic permanent replay`);
      deterministicChecks += 1;
    }
    assert(eq(solveIntCp009Prototype(q.mathematicalState), q.answer), `${qlId}/${seed}: solver drift`);
    assert(verifyIntCp009PrototypeAnswer(q.mathematicalState, q.answer), `${qlId}/${seed}: verifier drift`);
    solverVerifierChecks += 2;
    assert(q.options.length === 4, `${qlId}/${seed}: option count drift`);
    assert(q.options[q.correctIndex]?.text === q.correctAnswer, `${qlId}/${seed}: answer ownership drift`);
    assert(q.options.filter((option: any) => option.text === q.correctAnswer).length === 1, `${qlId}/${seed}: correct answer duplicated in options`);
    optionChecks += 3;
    positionCounts[q.correctIndex] += 1;
    sourceCoverage.add(q.sourcePrototypeId);
    stemCoverage.add(`${q.sourcePrototypeId}:${q.stemFamilyId}`);
    fingerprintByQl.get(qlId)!.add(q.mathematicalFingerprint);
    assert(q.permanentQlId === qlId && q.lifecycle.permanentIdentityAllocated === true, `${qlId}/${seed}: permanent identity missing`);
    assert(q.lifecycle.productionRuntimeReady === true && q.lifecycle.active === true, `${qlId}/${seed}: production runtime not active`);
    assert(q.lifecycle.questionStudioDiscoverable === false && q.lifecycle.questionBankWritable === false && q.lifecycle.testEligible === false && q.lifecycle.publiclyPublishable === false, `${qlId}/${seed}: downstream lifecycle leaked before freeze adapter`);
    lifecycleChecks += 3;
    const learner = `${q.stem}\n${q.explanation.keyIdea}\n${q.explanation.steps.join("\n")}`;
    assert(!/(?:undefined|null|NaN|after after|half-year period)/u.test(learner), `${qlId}/${seed}: learner editorial token leaked`);
    const amounts = [...learner.matchAll(/₹([\d,]+(?:\.\d+)?)/gu)].map((m) => Number(m[1]!.replaceAll(",", "")));
    assert(amounts.every((amount) => amount <= 2_000_000), `${qlId}/${seed}: unrealistic money outlier`);
    realismChecks += 2;
    assert(getIntCp009PrototypeForPermanentQl(qlId, seed) === q.sourcePrototypeId, `${qlId}/${seed}: source routing nondeterminism`);
  }
}
assert(productionQuestions === 5000, `Expected 5000 production questions, got ${productionQuestions}`);
assert(sourceCoverage.size === 8, `Expected eight source variants, got ${sourceCoverage.size}`);
assert(stemCoverage.size === 24, `Expected 24 source/stem combinations, got ${stemCoverage.size}`);
assert(positionCounts.every((count) => count > 700), `Answer positions too imbalanced: ${positionCounts.join("/")}`);
for (const [qlId, fingerprints] of fingerprintByQl) assert(fingerprints.size >= 50, `${qlId}: mathematical state pool too thin (${fingerprints.size})`);

let localizedQuestions = 0;
let localizationParityChecks = 0;
let localizationScriptChecks = 0;
let localizationTerminologyChecks = 0;
for (const qlId of INT_CP009_PERMANENT_QL_IDS) {
  for (let index = 0; index < 200; index += 1) {
    const seed = `cp009:locale:${qlId}:${index}`;
    const en = generateIntCp009Permanent(qlId, seed) as any;
    for (const language of ["hi", "pa"] as const) {
      const q = generateIntCp009Localized(qlId, seed, language) as any;
      localizedQuestions += 1;
      assert(q.correctIndex === en.correctIndex && q.correctAnswer === en.correctAnswer, `${qlId}/${seed}/${language}: answer binding changed`);
      assert(stable(q.answer) === stable(en.answer) && q.mathematicalFingerprint === en.mathematicalFingerprint, `${qlId}/${seed}/${language}: mathematics changed in localization`);
      assert(stable(q.options) === stable(en.options), `${qlId}/${seed}/${language}: options changed in localization`);
      localizationParityChecks += 3;
      assert(language === "hi" ? /[\u0900-\u097f]/u.test(q.stem) : /[\u0a00-\u0a7f]/u.test(q.stem), `${qlId}/${seed}/${language}: native script missing from stem`);
      assert(language === "hi" ? /[\u0900-\u097f]/u.test(q.explanation.keyIdea) : /[\u0a00-\u0a7f]/u.test(q.explanation.keyIdea), `${qlId}/${seed}/${language}: native script missing from explanation`);
      assert(q.explanation.steps.length === 4 && q.explanation.steps.some((step: string) => step.includes("=")), `${qlId}/${seed}/${language}: localized worked arithmetic too thin`);
      const localizedLearner = `${q.stem}\n${q.explanation.keyIdea}\n${q.explanation.steps.join("\n")}\n${q.explanation.finalAnswer}`;
      assert(!/(?:undefined|null|NaN|after after)/u.test(localizedLearner), `${qlId}/${seed}/${language}: invalid localization token`);
      localizationScriptChecks += 4;
      if (language === "pa") {
        assert(!localizedLearner.includes("ਚੱਕਰਵੱਧੀ"), `${qlId}/${seed}: deprecated Punjabi compound-interest term leaked`);
        assert(localizedLearner.includes("ਮਿਸ਼ਰਤ ਵਿਆਜ"), `${qlId}/${seed}: approved Punjabi compound-interest term missing`);
        localizationTerminologyChecks += 2;
      }
    }
  }
}
assert(localizedQuestions === 2000, `Expected 2000 localized audit questions, got ${localizedQuestions}`);

let frozenQuestions = 0;
let freezeChecks = 0;
for (const qlId of INT_CP009_PERMANENT_QL_IDS) {
  for (let index = 0; index < 200; index += 1) {
    const seed = `cp009:freeze:${qlId}:${index}`;
    for (const language of ["en", "hi", "pa"] as const) {
      const q = generateIntCp009Frozen(qlId, seed, language) as any;
      frozenQuestions += 1;
      assert(q.releaseId === INT_CP009_RELEASE_ID && q.lifecycle.learnerContentFrozen === true, `${qlId}/${seed}/${language}: learner freeze missing`);
      assert(q.lifecycle.englishContentFrozen === true && q.lifecycle.localizationFrozen === true, `${qlId}/${seed}/${language}: language freeze missing`);
      assert(q.lifecycle.questionStudioDiscoverable === false && q.lifecycle.questionBankWritable === false && q.lifecycle.testEligible === false && q.lifecycle.publiclyPublishable === false, `${qlId}/${seed}/${language}: frozen source leaked downstream`);
      assert(Object.isFrozen(q) && Object.isFrozen(q.lifecycle), `${qlId}/${seed}/${language}: freeze object mutable`);
      if (language === "pa") {
        const frozenLearner = `${q.stem}\n${q.explanation.keyIdea}\n${q.explanation.steps.join("\n")}\n${q.explanation.finalAnswer}`;
        assert(!frozenLearner.includes("ਚੱਕਰਵੱਧੀ"), `${qlId}/${seed}: deprecated Punjabi term entered frozen authority`);
        assert(frozenLearner.includes("ਮਿਸ਼ਰਤ ਵਿਆਜ"), `${qlId}/${seed}: approved Punjabi term missing from frozen authority`);
      }
      freezeChecks += 4;
    }
  }
}
assert(frozenQuestions === 3000, `Expected 3000 frozen audit questions, got ${frozenQuestions}`);

async function auditQuestionStudio() {
  assert(isIntCp009QuestionStudioRequest({ canonicalProblemId: "INT-CP-009" }), "CP009 Question Studio selector failed");
  assert(isIntCp009QuestionStudioRequest({ questionLanguageId: "INT-QL-127" }), "CP009 QL selector failed");
  const capability = listIntCp009QuestionStudioPackages()[0]!;
  assert(capability.enabled === true && capability.permanentQlCount === 5, "CP009 Question Studio capability not active");
  assert(capability.questionBankWritable === false && capability.testEligible === false && capability.publiclyPublishable === false, "CP009 Question Studio capability leaked downstream");

  let studioQuestions = 0;
  let studioChecks = 0;
  for (const language of ["en", "hi", "pa"] as const) {
    const batch = await generateIntCp009QuestionStudioBatch({ canonicalProblemId: "INT-CP-009", language, seed: `cp009:studio:${language}`, count: 25 });
    assert(batch.questions.length === 25 && batch.questionPackages.length === 25, `${language}: Question Studio count drift`);
    studioQuestions += batch.questions.length;
    for (const q of batch.questions as any[]) {
      assert(q.questionStudioDiscoverable === true && q.runtimeMode === "QUESTION_STUDIO_ACTIVE", `${language}: studio activation missing`);
      assert(q.questionBankWritable === false && q.testEligible === false && q.publiclyPublishable === false, `${language}: studio question leaked downstream`);
      assert(q.options[q.correctIndex] === q.answer, `${language}: studio answer binding drift`);
      studioChecks += 3;
    }
  }
  for (const qlId of INT_CP009_PERMANENT_QL_IDS) {
    const batch = await generateIntCp009QuestionStudioBatch({ canonicalProblemId: "INT-CP-009", questionLanguageId: qlId, language: "en", seed: `cp009:studio:${qlId}`, count: 3 });
    assert(batch.questions.every((q: any) => q.questionLanguageId === qlId), `${qlId}: explicit QL routing drift`);
    studioQuestions += batch.questions.length;
    studioChecks += batch.questions.length;
  }
  return { studioQuestions, studioChecks };
}

const studio = await auditQuestionStudio();
console.log(JSON.stringify({
  completionVersion: "INT-CP-009-COMPLETE-v1",
  permanentQlRange: `${INT_CP009_PERMANENT_QL_IDS[0]}..${INT_CP009_PERMANENT_QL_IDS.at(-1)}`,
  permanentQlCount: 5,
  authorities: INT_CP009_PERMANENT_ALLOCATION.length,
  preservedSourceVariants: sourceCoverage.size,
  preservedStemFamilies: stemCoverage.size,
  productionQuestions,
  deterministicChecks,
  solverVerifierChecks,
  optionChecks,
  lifecycleChecks,
  realismChecks,
  answerPositions: positionCounts,
  localizedQuestions,
  localizationParityChecks,
  localizationScriptChecks,
  localizationTerminologyChecks,
  frozenQuestions,
  freezeChecks,
  studioQuestions: studio.studioQuestions,
  studioChecks: studio.studioChecks,
  releaseId: INT_CP009_RELEASE_ID,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP009_COMPLETE_V1_AUDIT");
