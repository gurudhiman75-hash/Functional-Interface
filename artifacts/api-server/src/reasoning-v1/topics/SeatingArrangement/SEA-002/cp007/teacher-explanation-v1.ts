import type { Sea002Cp007ProductionCaselet } from "./production-caselet-v1.ts";

function facingWord(value: "N" | "S") {
  return value === "N" ? "north" : "south";
}

function renderRow(caselet: Sea002Cp007ProductionCaselet, row: "TOP" | "BOTTOM") {
  return caselet.participants
    .filter((participant) => participant.seat.row === row)
    .sort((left, right) => left.seat.position - right.seat.position)
    .map((participant) => `P${participant.seat.position + 1}: ${participant.id} (${facingWord(participant.facing)})`)
    .join(" | ");
}

export function renderSea002Cp007TeacherExplanation(caselet: Sea002Cp007ProductionCaselet): string {
  const north = caselet.participants.filter((p) => p.facing === "N").map((p) => p.id).sort();
  const south = caselet.participants.filter((p) => p.facing === "S").map((p) => p.id).sort();
  const facingAnchor = caselet.clues.find((clue) => clue.kind === "FACING_ANCHOR");
  const opposite = caselet.clues.find((clue) => clue.kind === "OPPOSITE");
  const diagonal = caselet.clues.find((clue) => clue.kind === "DIAGONAL");

  const steps = [
    `Start with the facing information. ${facingAnchor?.kind === "FACING_ANCHOR" ? `${facingAnchor.person} faces ${facingWord(facingAnchor.facing)}. ` : ""}Following the same/opposite-facing clues gives north-facing: ${north.join(", ")}; south-facing: ${south.join(", ")}.`,
    `Now use each person's own facing while reading left/right clues. The upper row settles as ${renderRow(caselet, "TOP")}.`,
    `For the lower row, use the remaining left/right chain together with ${opposite?.kind === "OPPOSITE" ? `${opposite.left} opposite ${opposite.right}` : "the opposite-position clue"}${diagonal?.kind === "DIAGONAL" ? ` and the diagonal clue involving ${diagonal.reference}` : ""}. The lower row settles as ${renderRow(caselet, "BOTTOM")}.`,
    caselet.explanation,
    `Therefore, the answer is ${caselet.answer}.`,
  ];

  return steps.join("\n");
}
