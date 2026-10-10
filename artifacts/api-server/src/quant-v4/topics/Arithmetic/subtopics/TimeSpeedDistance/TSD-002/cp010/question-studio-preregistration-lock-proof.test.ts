import { readFileSync } from "node:fs";
import { TSD_CP010_ENGLISH_FREEZE_APPROVAL } from "./english-freeze-registry";
import { TSD_CP010_LOCALIZATION_FREEZE_APPROVAL } from "./localization-freeze-registry";
import { TSD_CP010_STUDIO_CANDIDATE_PACKAGE } from "./question-studio-candidate-adapter-exam-real";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 post-freeze preregistration proof failed: ${message}`);
}

const routeIndex = readFileSync("artifacts/api-server/src/routes/index.ts", "utf8");
const adminApi = readFileSync("artifacts/admin-app/src/features/question-studio/api.ts", "utf8");
const adminHook = readFileSync("artifacts/admin-app/src/features/question-studio/useQuestionStudio.ts", "utf8");

assert(TSD_CP010_ENGLISH_FREEZE_APPROVAL.englishFreezeStatus === "FROZEN", "English content is not frozen before preregistration audit");
assert(TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.hindi === "FROZEN" && TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.punjabi === "FROZEN", "native content is not frozen before preregistration audit");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus === "NOT_REGISTERED", "candidate package claims registration before explicit Studio promotion");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.routeMounted === false, "candidate package claims mounted route before explicit Studio promotion");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.productionSelectorVisible === false, "candidate package claims selector visibility before explicit Studio promotion");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.compatibleCombinationsPerLocale === 471, "frozen preregistration capacity changed");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.deterministicMultilingualCombinations === 1413, "frozen multilingual capacity changed");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.stemAuthoringPolicy === "SSC_BANK_PUNJAB_OFFICIAL_PAPER_RACE_LANGUAGE", "official-paper V3 stem policy changed");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.representationPolicy === "CAPABILITY_BEATS_BY_START_RATIO_TWO_RACE_EVIDENCE", "V3 representation policy changed");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.persistenceAllowed === false, "content freeze silently enabled persistence");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.questionBankWritable === false, "content freeze silently enabled Question Bank writes");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.testEligible === false, "content freeze silently enabled tests");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.publiclyPublishable === false, "content freeze silently enabled publishing");
assert(!routeIndex.includes("admin-question-studio-time-speed-distance-cp010"), "CP010 route mounted before explicit Studio promotion");
assert(!routeIndex.includes("time-speed-distance/cp010"), "CP010 route path leaked into production route index before explicit Studio promotion");
assert(!adminApi.includes("TSD_CP010_SELECTOR_PACKAGE_ID"), "CP010 selector API wired before explicit Studio promotion");
assert(!adminApi.includes("/time-speed-distance/cp010"), "CP010 frontend API endpoint wired before explicit Studio promotion");
assert(!adminHook.includes("TSD_CP010_SELECTOR_PACKAGE_ID"), "CP010 production hook wired before explicit Studio promotion");
assert(!adminHook.includes("cp010-review"), "CP010 production selector marker wired before explicit Studio promotion");

console.log("TSD-CP-010 FROZEN CONTENT / PRODUCTION PREREGISTRATION LOCK: PASS");
console.log(JSON.stringify({
  english: TSD_CP010_ENGLISH_FREEZE_APPROVAL.englishFreezeStatus,
  hindi: TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.hindi,
  punjabi: TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.punjabi,
  combinationsPerLocale: 471,
  multilingualCombinations: 1413,
  registration: "NOT_REGISTERED",
  routeMounted: false,
  productionSelectorVisible: false,
  persistenceAllowed: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
