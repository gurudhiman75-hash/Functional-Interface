import { seatingArrangementMotifs } from "./src/lib/motifs/seating-arrangement";
import {
  createAnySeatingScenario,
  createLinearSeatingScenario,
} from "./src/lib/reasoning/seating-engine";

const results: Array<{
  mode: string;
  motif: string;
  difficulty: string;
  ok: number;
  fail: number;
}> = [];

for (const difficulty of [
  "Easy",
  "Medium",
  "Hard",
] as const) {
  for (const motif of seatingArrangementMotifs) {
    let ok = 0;
    let fail = 0;

    for (let i = 0; i < 100; i++) {
      try {
        createAnySeatingScenario(
          motif,
          difficulty,
        );
        ok += 1;
      } catch {
        fail += 1;
      }
    }

    results.push({
      mode: "any",
      motif: motif.id,
      difficulty,
      ok,
      fail,
    });
  }
}

for (const difficulty of [
  "Easy",
  "Medium",
  "Hard",
] as const) {
  for (const motif of seatingArrangementMotifs) {
    let ok = 0;
    let fail = 0;

    for (let i = 0; i < 100; i++) {
      try {
        createLinearSeatingScenario(
          motif,
          difficulty,
        );
        ok += 1;
      } catch {
        fail += 1;
      }
    }

    results.push({
      mode: "linear",
      motif: motif.id,
      difficulty,
      ok,
      fail,
    });
  }
}

console.log(
  JSON.stringify(results, null, 2),
);
