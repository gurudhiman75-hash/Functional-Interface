import { readFileSync } from "node:fs";
import { TSD_CP010_STUDIO_CANDIDATE_PACKAGE } from "./question-studio-candidate-adapter-exam-real";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 pre-freeze registration proof failed: ${message}`);
}

const routeIndex = readFileSync("artifacts/api-server/src/routes/index.ts", "utf8");
const adminApi = readFileSync("artifacts/admin-app/src/features/question-studio/api.ts", "utf8");
const adminHook = readFileSync("artifacts/admin-app/src/features/question-studio/useQuestionStudio.ts", "utf8");

assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.questionStudioRegistrationStatus === "NOT_REGISTERED", "candidate package claims registration");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.routeMounted === false, "candidate package claims mounted route");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.productionSelectorVisible === false, "candidate package claims selector visibility");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.compatibleCombinationsPerLocale === 471, "locked pre-freeze capacity changed");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.deterministicMultilingualCombinations === 1413, "locked multilingual capacity changed");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.stemAuthoringPolicy === "SSC_BANK_PUNJAB_OFFICIAL_PAPER_RACE_LANGUAGE", "official-paper V3 stem policy changed");
assert(TSD_CP010_STUDIO_CANDIDATE_PACKAGE.representationPolicy === "CAPABILITY_BEATS_BY_START_RATIO_TWO_RACE_EVIDENCE", "V3 representation policy changed");
assert(!routeIndex.includes("admin-question-studio-time-speed-distance-cp010"), "CP010 route was mounted before approval");
assert(!routeIndex.includes("time-speed-distance/cp010"), "CP010 route path leaked into production route index");
assert(!adminApi.includes("TSD_CP010_SELECTOR_PACKAGE_ID"), "CP010 selector API was wired before approval");
assert(!adminApi.includes("/time-speed-distance/cp010"), "CP010 frontend API endpoint was wired before approval");
assert(!adminHook.includes("TSD_CP010_SELECTOR_PACKAGE_ID"), "CP010 production hook was wired before approval");
assert(!adminHook.includes("cp010-review"), "CP010 production selector marker was wired before approval");

console.log("TSD-CP-010 PRE-FREEZE OFFICIAL-PAPER V3 PRODUCTION REGISTRATION LOCK: PASS");
console.log(JSON.stringify({
  combinationsPerLocale: 471,
  multilingualCombinations: 1413,
  stemAuthoringPolicy: "SSC_BANK_PUNJAB_OFFICIAL_PAPER_RACE_LANGUAGE",
  representationPolicy: "CAPABILITY_BEATS_BY_START_RATIO_TWO_RACE_EVIDENCE",
  registration: "NOT_REGISTERED",
  routeMounted: false,
  productionSelectorVisible: false,
  persistenceAllowed: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
