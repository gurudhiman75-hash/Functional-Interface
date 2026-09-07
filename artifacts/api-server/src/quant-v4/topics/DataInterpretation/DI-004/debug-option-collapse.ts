import { generateDi004LineSet } from "./index";

let scannedSets = 0;
let scannedQuestions = 0;

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `DI-004-PHASE3-${seedIndex}`;
  try {
    const set = generateDi004LineSet({ seed, examProfile: "BANKING_PRELIMS" });
    if (set.optionCount !== 5) throw new Error(`${seed} did not retain the Banking five-option profile.`);
    if (set.questions.some((question) => question.options.length !== 5 || new Set(question.options).size !== 5)) {
      throw new Error(`${seed} contains a Banking five-option collision.`);
    }
    scannedSets += 1;
    scannedQuestions += set.questions.length;
  } catch (error) {
    console.error(JSON.stringify({ seed, error: error instanceof Error ? error.message : String(error) }));
    throw error;
  }
}

console.log(JSON.stringify({
  status: "PASS_DI_004_BANKING_OPTION_COLLISION_SCAN",
  scannedSets,
  scannedQuestions,
  collisionStates: 0,
}));
