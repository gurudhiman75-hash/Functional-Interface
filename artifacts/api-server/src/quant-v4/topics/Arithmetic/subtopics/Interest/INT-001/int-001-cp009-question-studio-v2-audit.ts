import { INT_CP009_PERMANENT_QL_IDS } from "./cp009-permanent-allocation-v1";
import {
  generateIntCp009QuestionStudioBatch,
  INT_CP009_QUESTION_STUDIO_INTEGRATION_VERSION,
  isIntCp009QuestionStudioRequest,
  listIntCp009QuestionStudioPackages,
} from "./cp009-question-studio-integration-v2";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(INT_CP009_QUESTION_STUDIO_INTEGRATION_VERSION === "INT-CP-009-QS-v2-json-safe", "CP009 Question Studio version drifted");
assert(isIntCp009QuestionStudioRequest({ canonicalProblemId: "INT-CP-009" }), "CP009 selector failed");
assert(isIntCp009QuestionStudioRequest({ questionLanguageId: "INT-QL-129" }), "CP009 QL selector failed");
const capability = listIntCp009QuestionStudioPackages()[0]!;
assert(capability.enabled === true && capability.permanentQlCount === 5, "CP009 capability inactive");
assert(capability.questionBankWritable === false && capability.testEligible === false && capability.publiclyPublishable === false, "CP009 capability leaked downstream");

let questions = 0;
let jsonChecks = 0;
let routingChecks = 0;
let scriptChecks = 0;
let lifecycleChecks = 0;
const sourceVariants = new Set<string>();

for (const language of ["en", "hi", "pa"] as const) {
  for (const qlId of INT_CP009_PERMANENT_QL_IDS) {
    const batch = await generateIntCp009QuestionStudioBatch({
      canonicalProblemId: "INT-CP-009",
      questionLanguageId: qlId,
      language,
      seed: `cp009:qs-v2:${language}:${qlId}`,
      count: 20,
    }) as any;
    assert(batch.questions.length === 20 && batch.questionPackages.length === 20, `${language}/${qlId}: count drift`);
    const encoded = JSON.stringify(batch);
    assert(encoded.length > 0 && !encoded.includes("[object BigInt]"), `${language}/${qlId}: JSON encoding failed`);
    assert(!encoded.includes('"numerator":') || !/\d+n/u.test(encoded), `${language}/${qlId}: bigint suffix leaked`);
    jsonChecks += 3;
    questions += batch.questions.length;

    for (const q of batch.questions) {
      assert(q.questionLanguageId === qlId && q.canonicalProblemId === "INT-CP-009", `${language}/${qlId}: explicit routing drift`);
      assert(q.options[q.correctIndex] === q.answer, `${language}/${qlId}: answer binding drift`);
      routingChecks += 2;
      sourceVariants.add(q.taskKind);
      assert(q.questionStudioDiscoverable === true && q.runtimeMode === "QUESTION_STUDIO_ACTIVE", `${language}/${qlId}: Studio activation missing`);
      assert(q.questionBankWritable === false && q.testEligible === false && q.publiclyPublishable === false, `${language}/${qlId}: downstream gate leaked`);
      lifecycleChecks += 2;
      if (language === "hi") {
        assert(/[\u0900-\u097f]/u.test(q.stem) && /[\u0900-\u097f]/u.test(q.explanation), `${qlId}: Hindi script missing`);
        scriptChecks += 1;
      }
      if (language === "pa") {
        assert(/[\u0a00-\u0a7f]/u.test(q.stem) && /[\u0a00-\u0a7f]/u.test(q.explanation), `${qlId}: Punjabi script missing`);
        scriptChecks += 1;
      }
    }
  }
}

assert(questions === 300, `Expected 300 Question Studio audit questions, got ${questions}`);
assert(sourceVariants.size === 8, `Expected all eight source variants across seeded Studio audit, got ${sourceVariants.size}`);

console.log(JSON.stringify({
  integrationVersion: INT_CP009_QUESTION_STUDIO_INTEGRATION_VERSION,
  permanentQlCount: INT_CP009_PERMANENT_QL_IDS.length,
  questions,
  jsonChecks,
  routingChecks,
  scriptChecks,
  lifecycleChecks,
  sourceVariants: sourceVariants.size,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP009_QUESTION_STUDIO_V2_AUDIT");
