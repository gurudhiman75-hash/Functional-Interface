import { generateDi003GroupedBarSet, type Di003ExamProfile } from "./index";

const profiles: readonly Di003ExamProfile[] = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"];

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `DI-003-PHASE2-${seedIndex}`;
  for (const profile of profiles) {
    try {
      generateDi003GroupedBarSet({ seed, examProfile: profile });
    } catch (error) {
      console.error(JSON.stringify({ seed, profile, error: error instanceof Error ? error.message : String(error) }));
      throw error;
    }
  }
}

console.log("PASS_DI_003_OPTION_COLLAPSE_DEBUG");
