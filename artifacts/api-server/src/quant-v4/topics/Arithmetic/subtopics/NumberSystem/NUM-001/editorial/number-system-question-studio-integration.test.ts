// @ts-nocheck
import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../../../question-studio-generation-engine";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const packages = listQuantV4Packages();
const numPackage = packages.find((entry: any) => entry.packageId === "NUM-001");
assert(numPackage, "NUM-001 is missing from Question Studio capabilities");
assert(numPackage.enabled === true, "NUM-001 is disabled in Question Studio");
assert(numPackage.runtimeMode === "QUESTION_STUDIO_ACTIVE",
  "NUM-001 runtime mode is not Question Studio active");
assert(numPackage.questionBankStatus === "NOT_STORED",
  "NUM-001 Question Bank gate is not closed");
assert(numPackage.testEligibility === "INELIGIBLE",
  "NUM-001 test gate is not closed");
assert(numPackage.publiclyPublishable === false,
  "NUM-001 publication gate is not closed");
assert(JSON.stringify(numPackage.cpIds) === JSON.stringify(["NUM-CP-003", "NUM-CP-004"]),
  "NUM-001 capability CP list is incorrect");
assert(JSON.stringify(numPackage.supportedLanguages) === JSON.stringify(["en"]),
  "NUM-001 capability language list is incorrect");

const cp003 = await generateQuestion({
  packageId: "NUM-001",
  canonicalProblemId: "NUM-CP-003",
  questionLanguageId: "NUM-QL-001",
  language: "en",
  seed: "num-question-studio-integration-cp003",
  count: 2,
});
assert(cp003.questions.length === 2, "CP-003 Question Studio batch count mismatch");
assert(cp003.questionPackages.every((question: any) =>
  question.canonicalProblemId === "NUM-CP-003"
  && question.questionLanguageId === "NUM-QL-001"),
  "CP-003 explicit QL routing failed");

const cp004 = await generateQuestion({
  packageId: "NUM-001",
  canonicalProblemId: "NUM-CP-004",
  questionLanguageId: "NUM-QL-045",
  language: "en",
  seed: "num-question-studio-integration-cp004",
  count: 2,
});
assert(cp004.questions.length === 2, "CP-004 Question Studio batch count mismatch");
assert(cp004.questionPackages.every((question: any) =>
  question.canonicalProblemId === "NUM-CP-004"
  && question.questionLanguageId === "NUM-QL-045"),
  "CP-004 explicit QL routing failed");

for (const result of [cp003, cp004]) {
  assert(result.generationContext.runtimeMode === "QUESTION_STUDIO_ACTIVE",
    "generation context is not Question Studio active");
  assert(result.generationContext.questionBankStatus === "NOT_STORED",
    "generation context opened Question Bank writes");
  assert(result.generationContext.testEligibility === "INELIGIBLE",
    "generation context opened test eligibility");
  assert(result.generationContext.publiclyPublishable === false,
    "generation context opened publication");

  for (const question of result.questions) {
    assert(question.packageId === "NUM-001", "preview package ID mismatch");
    assert(question.runtimeMode === "QUESTION_STUDIO_ACTIVE",
      "preview runtime is not Question Studio active");
    assert(question.questionBankStatus === "NOT_STORED",
      "preview Question Bank gate opened");
    assert(question.testEligibility === "INELIGIBLE",
      "preview test gate opened");
    assert(question.publiclyPublishable === false,
      "preview publication gate opened");
    assert(Array.isArray(question.options) && question.options.length >= 4,
      "preview options are missing");
    assert(typeof question.explanation === "string" && question.explanation.length > 0,
      "preview explanation is missing");
  }
}

let unsupportedLanguageRejected = false;
try {
  await generateQuestion({
    packageId: "NUM-001",
    language: "hi",
    count: 1,
  });
} catch {
  unsupportedLanguageRejected = true;
}
assert(unsupportedLanguageRejected, "NUM-001 accepted an unapproved language");

console.log(JSON.stringify({
  status: "PASS_NUM_001_QUESTION_STUDIO_INTEGRATION",
  packageId: numPackage.packageId,
  cpIds: numPackage.cpIds,
  supportedLanguages: numPackage.supportedLanguages,
  generatedCp003: cp003.questions.length,
  generatedCp004: cp004.questions.length,
  runtimeMode: numPackage.runtimeMode,
  questionBankStatus: numPackage.questionBankStatus,
  testEligibility: numPackage.testEligibility,
  publiclyPublishable: numPackage.publiclyPublishable,
}, null, 2));
