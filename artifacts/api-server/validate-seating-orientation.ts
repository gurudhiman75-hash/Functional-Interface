import assert from "node:assert/strict";
import type {
  SeatingClue,
} from "./src/lib/reasoning/seating-engine";
import {
  validateSeatingScenario,
} from "./src/lib/reasoning/seating-validator";

function buildAbsoluteClues(
  arrangement: string[],
) : SeatingClue[] {
  return arrangement.map(
    (person, index) => ({
      type: "absolute",
      person,
      index,
    }),
  );
}

function runAlternateFacingCheck() {
  const participants = [
    "C",
    "A",
    "B",
    "D",
    "E",
    "F",
  ];
  const arrangement = [
    "C",
    "A",
    "B",
    "D",
    "E",
    "F",
  ];
  const clues: SeatingClue[] = [
    ...buildAbsoluteClues(
      arrangement,
    ),
    {
      type: "offset",
      anchor: "A",
      person: "B",
      direction: "left",
      distance: 1,
    },
  ];

  const result =
    validateSeatingScenario(
      participants,
      arrangement,
      clues,
      undefined,
      "linear",
      "alternate",
      6,
    );

  if (!result.valid) {
    console.log(
      "alternateFacingDebug",
      JSON.stringify(result),
    );
  }

  assert.equal(
    result.valid,
    true,
    "Expected south-facing left to map to index + 1 in alternate orientation.",
  );

  return result;
}

function runParallelRowOppositeCheck() {
  const participants = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ];
  const arrangement = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ];
  const clues: SeatingClue[] = [
    ...buildAbsoluteClues(
      arrangement,
    ),
    {
      type: "facing",
      left: "B",
      right: "E",
    },
    {
      type: "facing",
      left: "C",
      right: "F",
    },
  ];

  const result =
    validateSeatingScenario(
      participants,
      arrangement,
      clues,
      undefined,
      "parallel-row",
      "north",
      6,
    );

  if (!result.valid) {
    console.log(
      "parallelRowDebug",
      JSON.stringify(result),
    );
  }

  assert.equal(
    result.solutionCount > 0,
    true,
    "Expected parallel-row facing clues to produce at least one arrangement.",
  );
  assert.equal(
    result.warnings.some((warning) =>
      warning.includes(
        "contradicted",
      ),
    ),
    false,
    "Expected getOppositeNode to correctly identify the person directly across the aisle.",
  );

  return result;
}

function main() {
  const alternate =
    runAlternateFacingCheck();
  const parallel =
    runParallelRowOppositeCheck();

  console.log(
    JSON.stringify(
      {
        ok: true,
        alternateFacing: alternate,
        parallelRow: parallel,
      },
      null,
      2,
    ),
  );
}

main();
