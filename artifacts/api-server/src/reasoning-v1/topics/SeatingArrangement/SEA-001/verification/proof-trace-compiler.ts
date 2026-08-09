import type { CircularCaseletRecord, CircularProofEvent } from "../cp003/types.ts";

export interface CircularTeachingTrace {
  readonly sourceEventIds: readonly string[];
  readonly lines: readonly string[];
  readonly text: string;
}

function eventLine(event: CircularProofEvent): string | null {
  switch (event.kind) {
    case "ROTATION_SYMMETRY_BREAK":
      return null;
    case "LANDMARK_ABSOLUTE_ANCHOR":
      return event.statement;
    case "OPPOSITE_PLACEMENT":
      return `Place the opposite pair first: ${event.statement}`;
    case "CLOCKWISE_CHAIN":
      return `Use the directional clue: ${event.statement}`;
    case "ARC_COUNT":
      return `Count only along the stated arc: ${event.statement}`;
    case "ADJACENCY_ELIMINATION":
      return `Apply the adjacency condition: ${event.statement}`;
    case "ONLY_REMAINING_POSITION":
      return "Fill the remaining position after all stated conditions have been applied.";
  }
}

export function compileCircularTeachingTrace(caselet: CircularCaseletRecord): CircularTeachingTrace {
  const solvedOrder = caselet.solverOracleAgreement.productionKeys[0]?.split("|") ?? [];
  if (solvedOrder.length !== caselet.topologySnapshot.seatCount) {
    throw new Error(`Cannot compile teaching trace for ${caselet.caseletId}: solved order is incomplete`);
  }

  const landmark = caselet.topologySnapshot.landmark?.id.toLowerCase();
  const lines: string[] = [
    landmark
      ? `Begin with the seat nearest the ${landmark}, which is shown at the top of the diagram.`
      : `Place ${solvedOrder[0]} at any convenient seat. In an unmarked circle, rotating the complete arrangement does not change the answer.`,
    "Because everyone faces the centre, a person's left is clockwise and right is anticlockwise.",
  ];

  for (const event of caselet.proofTrace) {
    const line = eventLine(event);
    if (line && !lines.includes(line)) lines.push(line);
  }

  lines.push(`The final clockwise arrangement is ${caselet.diagram.text}.`);
  lines.push("This arrangement satisfies every clue and is the only valid circular solution class.");

  const text = lines.join("\n");
  if (/\b(dfs|backtracking|recursive|search node)\b/i.test(text)) {
    throw new Error("Raw solver language leaked into the teaching trace");
  }

  return {
    sourceEventIds: caselet.proofTrace.map((event) => event.id),
    lines,
    text,
  };
}
