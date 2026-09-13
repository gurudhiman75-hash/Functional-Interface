import { createRng } from "../../../../core/deterministic-rng";
import type { PunjabiCheckpointDefinition, PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiReviewBatch } from "../../../../core/types";
import { generateCP014V2F01, generateCP014V2F02, generateCP014V2F03, generateCP014V2F04, generateCP014V2F05, generateCP014V2F06, generateCP014V2F07, generateCP014V2F08 } from "./CP014-v2-families";

export const CP014_V2_ELIGIBLE: Record<PunjabiDifficulty, readonly string[]> = {
  Easy: ["F01", "F04"],
  Medium: ["F01", "F02", "F03", "F04", "F05", "F06"],
  Hard: ["F02", "F03", "F06", "F07", "F08"],
};

export const PUN_001_CP014_V2_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP014", packageId: "PUN-001", name: "Reading Comprehension & Translation", nameGurmukhi: "ਪਾਠ-ਬੋਧ ਅਤੇ ਪ੍ਰਬੰਧਕੀ ਅਨੁਵਾਦ",
  description: "Governed reading comprehension and bidirectional administrative terminology with semantic difficulty routing.",
  families: [
    { familyId: "F01", name: "Factual Retrieval", description: "Direct passage evidence retrieval.", targetDifficulties: ["Easy", "Medium"], generate: generateCP014V2F01 },
    { familyId: "F02", name: "Inference", description: "Inference from passage context.", targetDifficulties: ["Medium", "Hard"], generate: generateCP014V2F02 },
    { familyId: "F03", name: "Title / Summary", description: "Central idea, title, or summary selection.", targetDifficulties: ["Medium", "Hard"], generate: generateCP014V2F03 },
    { familyId: "F04", name: "English to Punjabi", description: "Official terminology English to Punjabi.", targetDifficulties: ["Easy", "Medium"], generate: generateCP014V2F04 },
    { familyId: "F05", name: "Punjabi to English", description: "Official terminology Punjabi to English.", targetDifficulties: ["Medium"], generate: generateCP014V2F05 },
    { familyId: "F06", name: "Correct Terminology Pair", description: "Correct English-Punjabi administrative pair.", targetDifficulties: ["Medium", "Hard"], generate: generateCP014V2F06 },
    { familyId: "F07", name: "Dual Passage Resolution", description: "Two questions from one passage in order.", targetDifficulties: ["Hard"], generate: generateCP014V2F07 },
    { familyId: "F08", name: "Terminology Pair Verification", description: "Two-step administrative pair verification.", targetDifficulties: ["Hard"], generate: generateCP014V2F08 },
  ],
};
const generators: Record<string, (seed: number, difficulty: PunjabiDifficulty) => PunjabiGeneratedQuestion> = { F01: generateCP014V2F01, F02: generateCP014V2F02, F03: generateCP014V2F03, F04: generateCP014V2F04, F05: generateCP014V2F05, F06: generateCP014V2F06, F07: generateCP014V2F07, F08: generateCP014V2F08 };
export function generateCP014V2Question(seed: number, difficulty: PunjabiDifficulty = "Medium", requestedFamilyId?: string): PunjabiGeneratedQuestion {
  const familyId = requestedFamilyId ?? createRng(seed + 14014).pickOne(CP014_V2_ELIGIBLE[difficulty]);
  if (!CP014_V2_ELIGIBLE[difficulty].includes(familyId)) throw new Error(`CP014 V2 family ${familyId} is not authorized for ${difficulty}`);
  const generator = generators[familyId]; if (!generator) throw new Error(`Unknown CP014 V2 family ${familyId}`); return generator(seed, difficulty);
}
export function generateCP014V2ReviewBatch(count = 120, seedStart = 28000): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = []; const easy = Math.floor(count / 3), medium = Math.floor(count / 3), hard = count - easy - medium; let seed = seedStart;
  for (let i = 0; i < easy; i++) questions.push(generateCP014V2Question(seed++, "Easy"));
  for (let i = 0; i < medium; i++) questions.push(generateCP014V2Question(seed++, "Medium"));
  for (let i = 0; i < hard; i++) questions.push(generateCP014V2Question(seed++, "Hard"));
  return { batchId: `BATCH-CP014-V2-${seedStart}-${count}`, packageId: "PUN-001", cpId: "PUN-001-CP014", generatedAt: new Date().toISOString(), totalQuestions: questions.length, distribution: { easy, medium, hard }, questions };
}
