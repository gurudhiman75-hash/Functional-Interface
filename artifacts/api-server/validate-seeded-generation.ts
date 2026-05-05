import assert from "node:assert/strict";
import {
  generateFromPattern,
  type Pattern,
} from "./src/lib/generator";
import { ALL_PATTERNS } from "./src/lib/patterns";

function getPattern(
  patternId: string,
) {
  const pattern = ALL_PATTERNS.find(
    (entry) => entry.id === patternId,
  );

  if (!pattern) {
    throw new Error(
      `Pattern '${patternId}' not found.`,
    );
  }

  return pattern as Pattern;
}

async function verifySeedReplay(
  patternId: string,
  count: number,
  seed: string,
) {
  const pattern =
    getPattern(patternId);
  const first =
    await generateFromPattern(pattern, count, {
      seed,
    });
  const second =
    await generateFromPattern(pattern, count, {
      seed,
    });

  assert.deepEqual(
    first.questions,
    second.questions,
    `Seed replay failed for pattern '${patternId}'.`,
  );
  assert.equal(
    first.generationContext
      ?.generationId,
    second.generationContext
      ?.generationId,
    `Generation id replay failed for pattern '${patternId}'.`,
  );

  return {
    patternId,
    seed,
    questionCount: count,
    generationId:
      first.generationContext
        ?.generationId,
  };
}

async function main() {
  const checks = [
    await verifySeedReplay(
      "seating-linear-easy",
      1,
      "seat-seed-001",
    ),
    await verifySeedReplay(
      "seating-linear-medium",
      2,
      "seat-seed-002",
    ),
  ];

  console.log(
    JSON.stringify(
      {
        ok: true,
        checks,
      },
      null,
      2,
    ),
  );
}

void main();
