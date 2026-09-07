import { generateDi004LineSet, type Di004ExamProfile } from "./index";

const profiles: readonly Di004ExamProfile[] = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"];

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `DI-004-PHASE3-${seedIndex}`;
  for (const profile of profiles) {
    try {
      generateDi004LineSet({ seed, examProfile: profile });
    } catch (error) {
      console.error(JSON.stringify({ seed, profile, error: error instanceof Error ? error.message : String(error) }));
      throw error;
    }
  }
}

console.log("PASS_DI_004_OPTION_COLLAPSE_SEED_SCAN");
