import { generateEng001Cp001QuestionV2 } from "../chapters/error-spotting/ENG-001/CP001/eng-001-cp001-v2";
import {
  buildEng001Cp001CandidateV2,
  rulesForDifficulty,
} from "../chapters/error-spotting/ENG-001/CP001/cp001-patterns-v2";
import {
  validateEng001Cp001CandidateV2,
  validateEng001Cp001QuestionV2,
} from "../chapters/error-spotting/ENG-001/CP001/eng-001-cp001-v2-validator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  for (const ruleId of rulesForDifficulty(difficulty)) {
    for (let index = 0; index < 40; index += 1) {
      const candidate = buildEng001Cp001CandidateV2({
        ruleId,
        difficulty,
        seed: `candidate:${difficulty}:${ruleId}:${index}`,
      });
      const validation = validateEng001Cp001CandidateV2(candidate);
      assert(
        validation.ok,
        `${candidate.candidateId}: ${validation.issues.map((entry) => entry.message).join(" | ")}`,
      );
    }
  }
}

for (const qlId of ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"] as const) {
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    for (let index = 0; index < 120; index += 1) {
      const input = {
        qlId,
        difficulty,
        seed: `question:${qlId}:${difficulty}:${index}`,
      } as const;
      const first = generateEng001Cp001QuestionV2(input);
      const second = generateEng001Cp001QuestionV2(input);
      assert(stable(first) === stable(second), `Non-deterministic generation for ${input.seed}`);
      const validation = validateEng001Cp001QuestionV2(first);
      assert(
        validation.ok,
        `${first.questionId}: ${validation.issues.map((entry) => entry.message).join(" | ")}`,
      );
    }
  }
}

const minimumDistinct = { easy: 70, medium: 180, hard: 120 } as const;
for (const difficulty of ["easy", "medium", "hard"] as const) {
  const surfaces = new Set<string>();
  const candidates = new Set<string>();
  for (let index = 0; index < 1200; index += 1) {
    const question = generateEng001Cp001QuestionV2({
      difficulty,
      qlId: "ENG-001-QL001",
      seed: `variety:${difficulty}:${index}`,
    });
    surfaces.add(question.correctedSentence);
    candidates.add(question.metadata.candidateId);
  }
  assert(
    surfaces.size >= minimumDistinct[difficulty],
    `${difficulty} produced only ${surfaces.size} distinct corrected sentences.`,
  );
  assert(
    candidates.size >= minimumDistinct[difficulty],
    `${difficulty} produced only ${candidates.size} distinct candidate fingerprints.`,
  );
}

let rejected = false;
try {
  generateEng001Cp001QuestionV2({
    difficulty: "easy",
    qlId: "ENG-001-QL007",
    ruleId: "GR-SVA-001",
    seed: "no-error-basic",
  });
} catch (error) {
  rejected = String(error).includes("not admitted");
}
assert(rejected, "Basic direct agreement must be rejected from the calibrated No-error pool.");

console.log("ENG-001-CP001 V2 tests passed.");
