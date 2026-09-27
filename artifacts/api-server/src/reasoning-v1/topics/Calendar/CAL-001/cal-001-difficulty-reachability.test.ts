import assert from "node:assert/strict";
import { CALENDAR_PERMANENT_QL_IDS } from "./permanent-contracts.ts";
import {
  generateCal001QuestionStudioBatch,
  runCal001QuestionStudioPipeline,
} from "./question-studio-runtime.ts";

const bands = ["Easy", "Medium", "Hard"] as const;
const matrix: Record<string, string[]> = {};

for (const qlId of CALENDAR_PERMANENT_QL_IDS) {
  matrix[qlId] = [];

  for (const band of bands) {
    let reached = false;

    for (let seedIndex = 0; seedIndex < 8; seedIndex++) {
      try {
        const pkg = runCal001QuestionStudioPipeline(qlId, {
          language: "en",
          difficultyBand: band,
          seed: `cal-difficulty-audit:${qlId}:${band}:${seedIndex}`,
        });

        assert.equal(
          pkg.difficultyBand,
          band,
          `${qlId}: requested ${band} but generated ${pkg.difficultyBand}.`,
        );
        reached = true;
        break;
      } catch (error) {
        assert(
          error instanceof Error &&
            error.message.includes("requested difficulty"),
          `${qlId} ${band}: unexpected generation failure.`,
        );
      }
    }

    if (reached) matrix[qlId]!.push(band);
  }

  assert(
    matrix[qlId]!.length >= 1,
    `${qlId}: no natural difficulty band is reachable.`,
  );
}

for (const band of bands) {
  const batch = await generateCal001QuestionStudioBatch({
    language: "en",
    difficulty: band,
    count: 12,
    seed: `cal-difficulty-mixed:${band}`,
  });

  assert.equal(batch.questions.length, 12);
  assert(
    batch.questions.every((question) => question.difficulty === band),
    `Mixed ${band} batch silently returned another difficulty.`,
  );
}

console.log(JSON.stringify({
  status: "PASS_CAL_001_DIFFICULTY_REACHABILITY",
  qlCount: CALENDAR_PERMANENT_QL_IDS.length,
  matrix,
}, null, 2));
