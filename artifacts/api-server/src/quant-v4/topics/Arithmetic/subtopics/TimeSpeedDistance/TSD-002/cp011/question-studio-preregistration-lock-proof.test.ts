import { readFileSync } from "node:fs";
import { TSD_CP011_ENGLISH_FREEZE_APPROVAL } from "./english-freeze-registry";
import { TSD_CP011_LOCALIZATION_FREEZE_APPROVAL } from "./localization-freeze-registry";
import { TSD_CP011_STUDIO_CANDIDATE_PACKAGE } from "./question-studio-candidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-011 post-freeze preregistration proof failed: ${message}`);
}

const routeIndex = readFileSync("artifacts/api-server/src/routes/index.ts", "utf8");
const adminApi = readFileSync("artifacts/admin-app/src/features/question-studio/api.ts", "utf8");
const adminHook = readFileSync("artifacts/admin-app/src/features/question-studio/useQuestionStudio.ts", "utf8");

assert(TSD_CP011_ENGLISH_FREEZE_APPROVAL.englishFreezeStatus === "FROZEN", "English content is not frozen before preregistration audit");
assert(TSD_CP011_LOCALIZATION_FREEZE_APPROVAL.hindi === "FROZEN" && TSD_CP011_LOCALIZATION_FREEZE_APPROVAL.punjabi === "FROZEN", "native content is not frozen before preregistration audit");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus === "NOT_REGISTERED", "candidate package claims registration before explicit Studio promotion");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.routeMounted === false, "candidate package claims mounted route before explicit Studio promotion");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.productionSelectorVisible === false, "candidate package claims selector visibility before explicit Studio promotion");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.reviewedCombinationsPerLocale === 168, "frozen preregistration capacity changed");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.reviewedMultilingualCombinations === 504, "frozen multilingual capacity changed");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.persistenceAllowed === false, "content freeze silently enabled persistence");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.questionBankWritable === false, "content freeze silently enabled Question Bank writes");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.testEligible === false, "content freeze silently enabled tests");
assert(TSD_CP011_STUDIO_CANDIDATE_PACKAGE.publiclyPublishable === false, "content freeze silently enabled publishing");
assert(!routeIndex.includes("admin-question-studio-time-speed-distance-cp011"), "CP011 route mounted before explicit Studio promotion");
assert(!routeIndex.includes("time-speed-distance/cp011"), "CP011 route path leaked into production route index before explicit Studio promotion");
assert(!adminApi.includes("TSD_CP011_SELECTOR_PACKAGE_ID"), "CP011 selector API wired before explicit Studio promotion");
assert(!adminApi.includes("/time-speed-distance/cp011"), "CP011 frontend API endpoint wired before explicit Studio promotion");
assert(!adminHook.includes("TSD_CP011_SELECTOR_PACKAGE_ID"), "CP011 production hook wired before explicit Studio promotion");
assert(!adminHook.includes("cp011-review"), "CP011 production selector marker wired before explicit Studio promotion");

console.log("TSD-CP-011 FROZEN CONTENT / PRODUCTION PREREGISTRATION LOCK: PASS");
console.log(JSON.stringify({
  english: TSD_CP011_ENGLISH_FREEZE_APPROVAL.englishFreezeStatus,
  hindi: TSD_CP011_LOCALIZATION_FREEZE_APPROVAL.hindi,
  punjabi: TSD_CP011_LOCALIZATION_FREEZE_APPROVAL.punjabi,
  combinationsPerLocale: 168,
  multilingualCombinations: 504,
  registration: "NOT_REGISTERED",
  routeMounted: false,
  productionSelectorVisible: false,
  persistenceAllowed: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
