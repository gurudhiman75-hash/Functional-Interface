import { generateCP001Question } from "../packages/PUN-001/checkpoints/CP001/generator";
import { generateCP002Question } from "../packages/PUN-001/checkpoints/CP002/generator";
import { generateCP003Question } from "../packages/PUN-001/checkpoints/CP003/generator";
import { generateCP004Question } from "../packages/PUN-001/checkpoints/CP004/generator";
import { generateCP005Question } from "../packages/PUN-001/checkpoints/CP005/generator";
import { generateCP006Question } from "../packages/PUN-001/checkpoints/CP006/generator";
import { generateCP007Question } from "../packages/PUN-001/checkpoints/CP007/generator";
import { generateCP008Question } from "../packages/PUN-001/checkpoints/CP008/generator";
import { generateCP009Question } from "../packages/PUN-001/checkpoints/CP009/generator";
import { generateCP010Question } from "../packages/PUN-001/checkpoints/CP010/generator";
import { generateCP011Question } from "../packages/PUN-001/checkpoints/CP011/generator";
import { generateCP012Question } from "../packages/PUN-001/checkpoints/CP012/generator";
import { generateCP013Question } from "../packages/PUN-001/checkpoints/CP013/generator";
import { generateCP014Question } from "../packages/PUN-001/checkpoints/CP014/generator";
import type { PunjabiDifficulty } from "../core/types";

const generators: Record<string, (seed: number, diff: PunjabiDifficulty) => any> = {
  CP001: generateCP001Question,
  CP002: generateCP002Question,
  CP003: generateCP003Question,
  CP004: generateCP004Question,
  CP005: generateCP005Question,
  CP006: generateCP006Question,
  CP007: generateCP007Question,
  CP008: generateCP008Question,
  CP009: generateCP009Question,
  CP010: generateCP010Question,
  CP011: generateCP011Question,
  CP012: generateCP012Question,
  CP013: generateCP013Question,
  CP014: generateCP014Question,
};

console.log("================================================================================");
console.log("  EXAMTREE PUNJABI CONTENT ENGINE (punjabi-v1) EXHAUSTIVE SCALE AUDIT (500 SEEDS)");
console.log("================================================================================");

const SEED_COUNT = 500;
const difficulties: PunjabiDifficulty[] = ["Easy", "Medium", "Hard"];

let totalSampledStems = 0;
let totalSampledQuestions = 0;

for (const [cpId, gen] of Object.entries(generators)) {
  const stems = new Set<string>();
  const questions = new Set<string>();

  for (let seed = 1; seed <= SEED_COUNT; seed++) {
    for (const diff of difficulties) {
      try {
        const q = gen(seed, diff);
        stems.add(q.stem);
        questions.add(`${q.stem} | ${q.options[q.correctIndex]} | ${[...q.options].sort().join("::")}`);
      } catch (err) {
        console.error(`Error in ${cpId} seed=${seed} diff=${diff}:`, err);
      }
    }
  }

  totalSampledStems += stems.size;
  totalSampledQuestions += questions.size;
  console.log(
    `  ${cpId.padEnd(8)}: ${String(stems.size).padStart(5)} unique stems | ${String(questions.size).padStart(5)} distinct questions (from 1,500 samples)`
  );
}

console.log("================================================================================");
console.log(`  TOTAL SAMPLED DISTINCT STEMS (500 seeds x 3 diffs = 21,000 queries): ${totalSampledStems}`);
console.log(`  TOTAL SAMPLED DISTINCT QUESTIONS (unique stem+options+key combinations): ${totalSampledQuestions}`);
console.log("================================================================================");
