import type { ExplanationTrace } from "./types";

export interface CodingPedagogyInput {
  checkpointId: string;
  ruleId: string;
  taskKind: string;
}

function referenceAid(input: CodingPedagogyInput): readonly string[] {
  if (input.checkpointId === "COD-CP-001") {
    return [
      "Direct mapping: each source letter keeps one fixed code wherever it appears.",
      "Write only the target letters and their established codes, then preserve the target order.",
    ];
  }

  if (input.checkpointId === "COD-CP-002") {
    if (input.ruleId === "Z1A26_SEQUENCE_CODE") {
      return ["Reverse alphabet ranks: A=26, B=25, C=24, …, Y=2, Z=1."];
    }
    if (input.ruleId === "POSITION_WEIGHTED_SUM") {
      return [
        "Alphabet checkpoints: A=1, E=5, J=10, O=15, T=20, Y=25, Z=26.",
        "Formula: code = Σ(alphabet rank × position number), with positions counted from 1.",
      ];
    }
    if (input.ruleId === "ODD_EVEN_POSITION_DIFFERENCE") {
      return [
        "Alphabet checkpoints: A=1, E=5, J=10, O=15, T=20, Y=25, Z=26.",
        "Formula: code = |sum of odd-position ranks − sum of even-position ranks|.",
      ];
    }
    return ["Alphabet checkpoints: A=1, E=5, J=10, O=15, T=20, Y=25, Z=26."];
  }

  if (input.checkpointId === "COD-CP-003") {
    return input.ruleId === "OPPOSITE_ALPHABET_MAP"
      ? ["Opposite alphabet pairs: A↔Z, B↔Y, C↔X, D↔W, E↔V, F↔U, …, M↔N."]
      : ["Use a cyclic alphabet: moving forward after Z returns to A, and moving backward before A returns to Z."];
  }

  if (input.checkpointId === "COD-CP-004") {
    return [
      "Number the letters from left to right as positions 1, 2, 3, … before applying the position rule.",
      "Use cyclic wrapping whenever a shift crosses A or Z.",
    ];
  }

  if (input.checkpointId === "COD-CP-005") {
    return ["Write source positions 1, 2, 3, … above the word and follow the same output-position order shown by the examples."];
  }

  return [
    "Keep two visible working lines: original → intermediate → final code.",
    "Complete both stages in order; while decoding, undo stage 2 first and stage 1 second.",
  ];
}

function quickMethod(input: CodingPedagogyInput): string {
  if (input.checkpointId === "COD-CP-001") return "Map only the letters required by the target; do not rebuild the entire table.";
  if (input.checkpointId === "COD-CP-002") {
    if (input.ruleId === "POSITION_WEIGHTED_SUM") return "Write ranks and position numbers in two rows, multiply column-wise, then add once.";
    if (input.ruleId === "ODD_EVEN_POSITION_DIFFERENCE") return "Make separate odd-position and even-position totals before taking the positive difference.";
    if (input.ruleId === "Z1A26_SEQUENCE_CODE") return "Use reverse rank = 27 − ordinary rank.";
    return "Use the EJOTY checkpoints (5, 10, 15, 20, 25) to recall nearby alphabet ranks quickly.";
  }
  if (input.checkpointId === "COD-CP-003") {
    return input.ruleId === "OPPOSITE_ALPHABET_MAP"
      ? "Opposite partners always have ordinary ranks summing to 27."
      : "Find the fixed shift from one clear letter pair, then verify it on a second pair before applying it.";
  }
  if (input.checkpointId === "COD-CP-004") return "Write the movement under each position first; this prevents phase, class and endpoint swaps.";
  if (input.checkpointId === "COD-CP-005") return "Solve with position numbers rather than repeatedly moving the letters mentally.";
  return input.taskKind.includes("DECODE")
    ? "Reverse the pipeline: undo the second stage first, then reconstruct the original word from stage 1."
    : "Write the intermediate result before applying the second transformation; never combine the two stages mentally.";
}

export function enrichCodingExplanation(trace: ExplanationTrace, input: CodingPedagogyInput): ExplanationTrace {
  return {
    ...trace,
    referenceAid: referenceAid(input),
    quickMethod: quickMethod(input),
    commonTrapAlert: trace.closestTrapRejection,
  };
}
