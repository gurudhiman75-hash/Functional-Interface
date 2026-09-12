import {
  generateSta001Question,
  STA001_CONTRACTS,
  type Sta001ContractId,
  type Sta001ExamProfile,
} from "./index";

const profiles: readonly Sta001ExamProfile[] = ["SSC_CGL_TIER_II", "SSC_CGL_JSO"];
const failures: Array<{ seed: string; profile: Sta001ExamProfile; contractId: Sta001ContractId; error: string }> = [];

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `STAT-001-P0-${seedIndex}`;
  for (const profile of profiles) {
    for (const contractId of STA001_CONTRACTS) {
      try {
        generateSta001Question({ seed, examProfile: profile, contractId });
      } catch (error) {
        failures.push({
          seed,
          profile,
          contractId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }
}

console.log(JSON.stringify({ failureStateCount: failures.length, examples: failures.slice(0, 20) }));
if (failures.length) throw new Error(`STAT-001 generation scan found ${failures.length} failing states.`);
console.log("PASS_STA_001_GENERATION_SCAN");
