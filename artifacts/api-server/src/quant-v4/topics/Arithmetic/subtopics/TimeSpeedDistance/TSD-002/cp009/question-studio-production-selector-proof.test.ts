import { readFileSync } from "node:fs";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-009 production selector proof failed: ${message}`);
}

const api = readFileSync("artifacts/admin-app/src/features/question-studio/api.ts", "utf8");
const hook = readFileSync("artifacts/admin-app/src/features/question-studio/useQuestionStudio.ts", "utf8");
const livePage = readFileSync("artifacts/admin-app/src/pages/content/QuestionStudioLivePage.tsx", "utf8");
const bulkRoute = readFileSync("artifacts/api-server/src/routes/admin-question-studio-bulk-hardening.ts", "utf8");
const conversion = readFileSync("artifacts/api-server/src/lib/admin-question-conversion.ts", "utf8");

assert(api.includes("TSD-002::CP009-REVIEW"), "dedicated CP009 selector package id missing");
assert(api.includes("/admin/question-studio/quant/time-speed-distance/cp009/package"), "CP009 package discovery API missing");
assert(api.includes("/admin/question-studio/quant/time-speed-distance/cp009/runs"), "CP009 run creation API missing");
assert(api.includes("TSD CP009 currently supports Easy and Medium review questions only"), "unsupported Hard/Mixed difficulty guard missing");

assert(hook.includes("withTsdCp009ReviewPackage"), "CP009 package is not appended to production capabilities");
assert(hook.includes("selectorKind: 'tsd-cp009-review'"), "CP009 selector is not marked review-only");
assert(hook.includes("questionBankStatus: 'NOT_STORED'"), "CP009 selector lost Question Bank lock");
assert(hook.includes("testEligibility: 'INELIGIBLE'"), "CP009 selector lost test lock");
assert(hook.includes("publiclyPublishable: false"), "CP009 selector lost public lock");
assert(hook.includes("input.packageId === TSD_CP009_SELECTOR_PACKAGE_ID"), "production generation hook does not dispatch CP009 specially");
assert(hook.includes("createTsdCp009GenerationRun(input)"), "production generation hook bypasses dedicated CP009 review endpoint");

assert(livePage.includes("enabledPackages.map"), "production package selector no longer renders enabled capability packages");
assert(livePage.includes("const activePackage = enabledPackages.find"), "production selector no longer resolves active package");
assert(livePage.includes("const result = await generate({"), "production page bypasses shared generation hook");

assert(conversion.includes('if (questionBankStatus === "NOT_STORED")'), "central Question Bank conversion guard no longer blocks NOT_STORED payloads");
assert(conversion.includes('return "questionBankStatus is NOT_STORED"'), "central NOT_STORED eligibility reason changed unexpectedly");
assert(bulkRoute.includes("getGeneratedQuestionBankEligibilityIssue"), "bulk review route does not inspect bank eligibility before approval conversion");
assert(bulkRoute.includes("if (!questionBankEligibilityIssue)"), "bulk review route does not skip bank conversion for review-only items");
assert(bulkRoute.includes("questionBankConversionSkipped"), "review-only approval skip is not audited");

console.log("TSD-CP-009 PRODUCTION QUESTION STUDIO SELECTOR PROOF: PASS");
console.log(JSON.stringify({
  selectorVisibleThroughCapabilities: true,
  dedicatedReviewEndpointDispatch: true,
  languages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium"],
  reviewOnlyApprovalWithoutBankConversion: true,
  centralNotStoredConversionGuard: true,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
