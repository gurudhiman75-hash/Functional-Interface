import { generateQuestion, listQuantV4Packages } from "../../../../../generation-engine";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const pkg = listQuantV4Packages().find((entry: any) => entry.packageId === "TSD-001") as any;
assert(pkg, "Quant V4 package registry does not expose TSD-001");
assert(pkg.enabled === true, "TSD-001 package is not enabled in Question Studio");
assert(pkg.cpIds?.length === 1 && pkg.cpIds[0] === "TSD-CP-005", "TSD-001 Studio package must expose only frozen CP005");
assert(JSON.stringify(pkg.supportedLanguages) === JSON.stringify(["en", "hi", "pa"]), "TSD-001 Studio languages drifted");
assert(pkg.runtimeMode === "QUESTION_STUDIO_REVIEW_ACTIVE", "TSD-001 runtime mode is not review-active");
assert(pkg.questionBankStatus === "NOT_STORED", "TSD-001 package unlocked Question Bank storage");
assert(pkg.testEligibility === "INELIGIBLE", "TSD-001 package unlocked test eligibility");
assert(pkg.publiclyPublishable === false, "TSD-001 package unlocked publication");

let routed = 0;
for (const language of ["en", "hi", "pa"] as const) {
  const result = await generateQuestion({
    packageId: "TSD-001",
    canonicalProblemId: "TSD-CP-005",
    questionLanguageId: "TSD-QL-064",
    language,
    seed: `engine-proof:${language}`,
    count: 7,
  });
  assert(result.questions.length === 7, `${language}: actual Quant engine did not return requested TSD batch`);
  for (const question of result.questions as any[]) {
    assert(question.packageId === "TSD-001", `${language}: request escaped TSD adapter`);
    assert(question.canonicalProblemId === "TSD-CP-005", `${language}: checkpoint drifted`);
    assert(question.questionLanguageId === "TSD-QL-064", `${language}: QL filter drifted`);
    assert(question.language === language, `${language}: language drifted`);
    assert(question.runtimeMode === "QUESTION_STUDIO_REVIEW_ACTIVE", `${language}: runtime mode drifted`);
    assert(question.questionBankStatus === "NOT_STORED", `${language}: Bank unlocked`);
    assert(question.testEligibility === "INELIGIBLE", `${language}: tests unlocked`);
    assert(question.publiclyPublishable === false, `${language}: publication unlocked`);
    routed += 1;
  }
}

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP005_ACTUAL_QUANT_V4_QUESTION_STUDIO_ENGINE_CONNECTION",
  packageId: "TSD-001",
  checkpointIds: ["TSD-CP-005"],
  supportedLanguages: ["en", "hi", "pa"],
  routedQuestionsChecked: routed,
  runtimeMode: "QUESTION_STUDIO_REVIEW_ACTIVE",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
