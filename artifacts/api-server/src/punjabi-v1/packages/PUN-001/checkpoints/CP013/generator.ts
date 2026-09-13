import { createRng } from "../../../../core/deterministic-rng";
import type { PunjabiCheckpointDefinition, PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiReviewBatch } from "../../../../core/types";
import {
  generateCP013V2F01,
  generateCP013V2F02,
  generateCP013V2F03,
  generateCP013V2F04,
  generateCP013V2F05,
  generateCP013V2F06,
  generateCP013V2F07,
  generateCP013V2F08,
} from "./CP013-v2-families";

const ELIGIBLE: Record<PunjabiDifficulty, readonly string[]> = {
  Easy: ["F01", "F02", "F03", "F05"],
  Medium: ["F01", "F03", "F04", "F05", "F06", "F07"],
  Hard: ["F04", "F06", "F07", "F08"],
};

export const PUN_001_CP013_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP013",
  packageId: "PUN-001",
  name: "Syntax & Sentence Diagnostics",
  nameGurmukhi: "ਵਾਕ-ਵਟਾਂਦਰਾ ਅਤੇ ਸ਼ੁੱਧੀ",
  description: "Semantic V2 coverage of sentence classification, function, transformation, correction and diagnosis.",
  families: [
    { familyId: "F01", name: "Combined Sentence Classification", description: "Structure + function classification.", targetDifficulties: ["Easy", "Medium"], generate: generateCP013V2F01 },
    { familyId: "F02", name: "Sentence Function", description: "Functional sentence classification.", targetDifficulties: ["Easy"], generate: generateCP013V2F02 },
    { familyId: "F03", name: "Forward Transformation", description: "Meaning-preserving forward sentence transformation.", targetDifficulties: ["Easy", "Medium"], generate: generateCP013V2F03 },
    { familyId: "F04", name: "Reverse Transformation", description: "Recover the original form from a reviewed transformation.", targetDifficulties: ["Medium", "Hard"], generate: generateCP013V2F04 },
    { familyId: "F05", name: "Sentence Correction", description: "Choose the grammatically correct sentence.", targetDifficulties: ["Easy", "Medium"], generate: generateCP013V2F05 },
    { familyId: "F06", name: "Error Diagnosis", description: "Identify the grammatical error type.", targetDifficulties: ["Medium", "Hard"], generate: generateCP013V2F06 },
    { familyId: "F07", name: "Valid Transformation Pair", description: "Identify a meaning-preserving transformation pair.", targetDifficulties: ["Medium", "Hard"], generate: generateCP013V2F07 },
    { familyId: "F08", name: "Dual Structural Analysis", description: "Resolve the structure of two sentences in order.", targetDifficulties: ["Hard"], generate: generateCP013V2F08 },
  ],
};

const GENERATORS: Record<string, (seed: number, difficulty: PunjabiDifficulty) => PunjabiGeneratedQuestion> = {
  F01: generateCP013V2F01, F02: generateCP013V2F02, F03: generateCP013V2F03, F04: generateCP013V2F04,
  F05: generateCP013V2F05, F06: generateCP013V2F06, F07: generateCP013V2F07, F08: generateCP013V2F08,
};

export function generateCP013Question(seed: number, difficulty: PunjabiDifficulty = "Medium", requestedFamilyId?: string): PunjabiGeneratedQuestion {
  const eligible = ELIGIBLE[difficulty];
  const familyId = requestedFamilyId ?? createRng(seed + (difficulty === "Easy" ? 131 : difficulty === "Medium" ? 137 : 139)).pickOne([...eligible]);
  if (!eligible.includes(familyId)) throw new Error(`CP013 V2 family ${familyId} is not authorized for ${difficulty}`);
  const generate = GENERATORS[familyId];
  if (!generate) throw new Error(`Unknown CP013 V2 family '${familyId}'`);
  return generate(seed, difficulty);
}

export function generateCP013ReviewBatch(count: number = 120, seedStart: number = 25000): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3), mediumCount = Math.floor(count / 3), hardCount = count - easyCount - mediumCount;
  let seed = seedStart;
  for (let i = 0; i < easyCount; i++) questions.push(generateCP013Question(seed++, "Easy", ELIGIBLE.Easy[i % ELIGIBLE.Easy.length]));
  for (let i = 0; i < mediumCount; i++) questions.push(generateCP013Question(seed++, "Medium", ELIGIBLE.Medium[i % ELIGIBLE.Medium.length]));
  for (let i = 0; i < hardCount; i++) questions.push(generateCP013Question(seed++, "Hard", ELIGIBLE.Hard[i % ELIGIBLE.Hard.length]));
  return { batchId: `BATCH-CP013-V2-${seedStart}-${count}`, packageId: "PUN-001", cpId: "PUN-001-CP013", generatedAt: new Date().toISOString(), totalQuestions: questions.length, distribution: { easy: easyCount, medium: mediumCount, hard: hardCount }, questions };
}
