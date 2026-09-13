import { createRng } from "../../../../core/deterministic-rng";
import type { PunjabiCheckpointDefinition, PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiReviewBatch } from "../../../../core/types";
import { generateCP012V2F01, generateCP012V2F02, generateCP012V2F03, generateCP012V2F04, generateCP012V2F05, generateCP012V2F06, generateCP012V2F07, generateCP012V2F08 } from "./CP012-v2-families";

export const PUN_001_CP012_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP012", packageId: "PUN-001", name: "Proverbs & Pragmatics", nameGurmukhi: "ਅਖਾਣ / ਕਹਾਵਤਾਂ",
  description: "Canonical Punjabi proverbs tested through meaning, authentic completion, reviewed situation use, and semantic pair discrimination.",
  families: [
    { familyId: "F01", name: "Direct Proverb Meaning", description: "Direct proverb-to-meaning recognition.", targetDifficulties: ["Easy"], generate: generateCP012V2F01 },
    { familyId: "F02", name: "Forward Proverb Completion", description: "First half to authentic second half; Medium uses closer semantic peers.", targetDifficulties: ["Easy","Medium"], generate: generateCP012V2F02 },
    { familyId: "F03", name: "Reverse Proverb Completion", description: "Second half to authentic first half.", targetDifficulties: ["Medium","Hard"], generate: generateCP012V2F03 },
    { familyId: "F04", name: "Authored Situation to Proverb", description: "Select the proverb fitting the reviewed situation.", targetDifficulties: ["Medium","Hard"], generate: generateCP012V2F04 },
    { familyId: "F05", name: "Meaning to Proverb", description: "Reverse semantic recognition; Medium uses near-meaning confusables.", targetDifficulties: ["Easy","Medium"], generate: generateCP012V2F05 },
    { familyId: "F06", name: "Correct Proverb-Meaning Pair", description: "Identify the one correct proverb/meaning mapping.", targetDifficulties: ["Medium","Hard"], generate: generateCP012V2F06 },
    { familyId: "F07", name: "Incorrect Proverb-Meaning Pair", description: "Identify the one incorrect mapping among reviewed pairs.", targetDifficulties: ["Medium","Hard"], generate: generateCP012V2F07 },
    { familyId: "F08", name: "Two Meaning-to-Proverb Mapping", description: "Resolve two related meanings to their proverbs in order.", targetDifficulties: ["Hard"], generate: generateCP012V2F08 },
  ],
};

const eligible: Record<PunjabiDifficulty, readonly string[]> = {
  Easy: ["F01","F02","F05"],
  Medium: ["F02","F03","F04","F05","F06","F07"],
  Hard: ["F03","F04","F06","F07","F08"],
};

export function generateCP012Question(seed: number, difficulty: PunjabiDifficulty = "Medium", requestedFamilyId?: string): PunjabiGeneratedQuestion {
  const families = eligible[difficulty];
  const familyId = requestedFamilyId ?? createRng(seed).pickOne(families);
  if (!families.includes(familyId)) throw new Error(`CP012 family ${familyId} is not authorized for ${difficulty}`);
  switch (familyId) {
    case "F01": return generateCP012V2F01(seed, difficulty);
    case "F02": return generateCP012V2F02(seed, difficulty);
    case "F03": return generateCP012V2F03(seed, difficulty);
    case "F04": return generateCP012V2F04(seed, difficulty);
    case "F05": return generateCP012V2F05(seed, difficulty);
    case "F06": return generateCP012V2F06(seed, difficulty);
    case "F07": return generateCP012V2F07(seed, difficulty);
    case "F08": return generateCP012V2F08(seed, difficulty);
    default: throw new Error(`Unknown CP012 question family: '${familyId}'`);
  }
}

export function generateCP012ReviewBatch(count: number = 120, seedStart: number = 23000): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3), mediumCount = Math.floor(count / 3), hardCount = count - easyCount - mediumCount;
  let seed = seedStart;
  for (let i = 0; i < easyCount; i++) { const fams = eligible.Easy; questions.push(generateCP012Question(seed, "Easy", fams[i % fams.length])); seed++; }
  for (let i = 0; i < mediumCount; i++) { const fams = eligible.Medium; questions.push(generateCP012Question(seed, "Medium", fams[i % fams.length])); seed++; }
  for (let i = 0; i < hardCount; i++) { const fams = eligible.Hard; questions.push(generateCP012Question(seed, "Hard", fams[i % fams.length])); seed++; }
  return { batchId: `BATCH-CP012-V2-${seedStart}-${count}`, packageId: "PUN-001", cpId: "PUN-001-CP012", generatedAt: new Date().toISOString(), totalQuestions: questions.length, distribution: { easy: easyCount, medium: mediumCount, hard: hardCount }, questions };
}
