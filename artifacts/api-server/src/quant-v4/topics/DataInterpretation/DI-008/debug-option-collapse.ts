import { generateDi008ArithmeticSet, type Di008ExamProfile } from "./index";

const profiles: readonly Di008ExamProfile[] = ["BANKING_PRELIMS", "BANKING_MAINS"];
const failures: Array<{ seed: string; profile: Di008ExamProfile; error: string }> = [];

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `DI-008-PHASE7-${seedIndex}`;
  for (const profile of profiles) {
    try {
      generateDi008ArithmeticSet({ seed, examProfile: profile });
    } catch (error) {
      failures.push({ seed, profile, error: error instanceof Error ? error.message : String(error) });
    }
  }
}

console.log(JSON.stringify({ failureStateCount: failures.length, examples: failures.slice(0, 10) }));
if (failures.length) throw new Error(`DI-008 option/generation scan found ${failures.length} failing states.`);
console.log("PASS_DI_008_OPTION_COLLISION_SCAN");