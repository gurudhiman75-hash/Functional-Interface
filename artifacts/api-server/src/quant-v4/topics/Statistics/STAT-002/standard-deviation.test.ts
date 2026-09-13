import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  generateStat002Question,
  STAT002_CONTRACTS,
} from "./standard-deviation";
import { independentlyVerifyStat002Question } from "./independent-verifier";
import type { Stat002ContractId, Stat002ExamProfile } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const profiles: readonly Stat002ExamProfile[] = ["SSC_CGL_TIER_II", "SSC_CGL_JSO"];
const answerPositions = new Map<string, Set<number>>();
const stemStructures = new Map<string, Set<string>>();
const misconceptionFamilies = new Map<string, Set<string>>();
const solveModes = new Set<string>();
const difficulties = new Set<string>();
let questionCount = 0;
let replayCount = 0;
let independentVerificationCount = 0;
let optionCheckCount = 0;

function normalizeStem(stem: string) {
  return stem
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/(?:#,\s*){2,}#/g, "DATA")
    .replace(/\s+/g, " ")
    .trim();
}

for (const profile of profiles) {
  for (const contractId of STAT002_CONTRACTS) {
    const key = `${profile}:${contractId}`;
    answerPositions.set(key, new Set());
    stemStructures.set(key, new Set());
    misconceptionFamilies.set(key, new Set());

    for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
      const seed = `STAT-002-P0-${profile}-${contractId}-${seedIndex}`;
      const question = generateStat002Question({ seed, examProfile: profile, contractId });
      const replay = generateStat002Question({ seed, examProfile: profile, contractId });

      assert(JSON.stringify(question) === JSON.stringify(replay), `${key} seed ${seedIndex} is not deterministic.`);
      replayCount += 1;
      assert(independentlyVerifyStat002Question(question), `${key} seed ${seedIndex} failed independent verification.`);
      independentVerificationCount += 1;
      assert(question.options.length === 4 && new Set(question.options).size === 4, `${key} seed ${seedIndex} does not have four unique options.`);
      assert(question.options[question.correctIndex] === question.answer, `${key} seed ${seedIndex} has a broken correct index.`);
      assert(question.traceability.questionStudioDiscoverable === false, `${key} unexpectedly opened Question Studio discovery.`);
      assert(question.traceability.questionBankStatus === "NOT_STORED", `${key} unexpectedly changed Question Bank state.`);
      assert(question.traceability.testEligibility === "INELIGIBLE", `${key} unexpectedly became test eligible.`);
      assert(question.traceability.mockTestEligible === false, `${key} unexpectedly became mock eligible.`);
      assert(question.traceability.publiclyPublishable === false, `${key} unexpectedly became publicly publishable.`);
      assert(question.traceability.automaticStudentPublication === false, `${key} unexpectedly enabled automatic student publication.`);
      assert(!/shortcut|common trap|trick/iu.test(question.explanation.keyIdea), `${key} leaked shortcut/trap boilerplate into the key idea.`);

      answerPositions.get(key)!.add(question.correctIndex);
      stemStructures.get(key)!.add(normalizeStem(question.stem));
      question.optionMetadata
        .filter((option) => option.misconceptionId !== "CORRECT")
        .forEach((option) => misconceptionFamilies.get(key)!.add(option.misconceptionId));
      solveModes.add(question.solveMode);
      difficulties.add(question.difficulty);
      optionCheckCount += question.options.length;
      questionCount += 1;
    }
  }
}

for (const profile of profiles) {
  for (const contractId of STAT002_CONTRACTS) {
    const key = `${profile}:${contractId}`;
    assert(answerPositions.get(key)!.size === 4, `${key} did not cover all A-D correct-answer positions.`);
    assert(stemStructures.get(key)!.size >= 3, `${key} did not exercise all three exam-style stem surfaces.`);
    assert(misconceptionFamilies.get(key)!.size >= 3, `${key} has fewer than three misconception families.`);
  }
}

assert(solveModes.size === STAT002_CONTRACTS.length, "STAT-002 did not exercise every solve mode.");
assert(difficulties.has("Easy") && difficulties.has("Medium") && difficulties.has("Hard"), "STAT-002 did not exercise all difficulty bands.");

const source = readFileSync(fileURLToPath(new URL("./standard-deviation.ts", import.meta.url)), "utf8");
assert(!source.includes("Math.random"), "STAT-002 must not use Math.random.");

console.log(JSON.stringify({
  status: "PASS_STAT_002_STANDARD_DEVIATION_P0",
  questions: questionCount,
  deterministicReplayChecks: replayCount,
  independentVerificationChecks: independentVerificationCount,
  optionChecks: optionCheckCount,
  profiles,
  contractCount: STAT002_CONTRACTS.length,
  solveModes: [...solveModes].sort(),
  difficulties: [...difficulties].sort(),
}));
