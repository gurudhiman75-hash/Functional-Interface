import { generateDi005PieSet } from "./index";

const failures: Array<{ seed: string; error: string }> = [];

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `DI-005-PHASE4-${seedIndex}`;
  try {
    const set = generateDi005PieSet({ seed, examProfile: "BANKING_PRELIMS" });
    if (set.questions.some((question) => question.options.length !== 5 || new Set(question.options).size !== 5)) {
      failures.push({ seed, error: "Banking child did not expose five unique options." });
    }
  } catch (error) {
    failures.push({ seed, error: error instanceof Error ? error.message : String(error) });
  }
}

console.log(JSON.stringify({ collisionStateCount: failures.length, examples: failures.slice(0, 10) }));
if (failures.length) throw new Error(`DI-005 has ${failures.length} Banking five-option collision or generation states.`);
console.log("PASS_DI_005_BANKING_OPTION_COLLISION_SCAN");