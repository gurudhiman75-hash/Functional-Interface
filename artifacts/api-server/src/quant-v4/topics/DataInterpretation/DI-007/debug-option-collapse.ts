import { generateDi007MissingSet, type Di007ExamProfile } from "./index";

const profiles: readonly Di007ExamProfile[] = ["BANKING_PRELIMS", "BANKING_MAINS"];
const failures: Array<{ seed: string; profile: Di007ExamProfile; error: string }> = [];

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `DI-007-PHASE6-${seedIndex}`;
  for (const profile of profiles) {
    try {
      const set = generateDi007MissingSet({ seed, examProfile: profile });
      if (set.questions.some((question) => question.options.length !== 5 || new Set(question.options).size !== 5)) {
        failures.push({ seed, profile, error: "Child did not expose five unique options." });
      }
    } catch (error) {
      failures.push({ seed, profile, error: error instanceof Error ? error.message : String(error) });
    }
  }
}

console.log(JSON.stringify({ failureStateCount: failures.length, examples: failures.slice(0, 12) }));
if (failures.length) throw new Error(`DI-007 has ${failures.length} five-option collision or generation states.`);
console.log("PASS_DI_007_OPTION_COLLISION_SCAN");
