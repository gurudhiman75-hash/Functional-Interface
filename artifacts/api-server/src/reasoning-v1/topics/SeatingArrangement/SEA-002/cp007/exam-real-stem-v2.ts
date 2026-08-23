import type {
  Sea002Cp007ProductionCaselet,
  Sea002Cp007ProductionClue,
} from "./production-caselet-v1.ts";

function samePair(left: string, right: string, clue: Sea002Cp007ProductionClue) {
  return clue.kind === "FACING_RELATION"
    && ((clue.left === left && clue.right === right) || (clue.left === right && clue.right === left));
}

function facingSuffix(
  left: string,
  right: string,
  clues: readonly Sea002Cp007ProductionClue[],
  used: Set<Sea002Cp007ProductionClue>,
): string {
  const relation = clues.find((clue) => samePair(left, right, clue));
  if (!relation || relation.kind !== "FACING_RELATION") return "";
  used.add(relation);
  return relation.relation === "SAME"
    ? " The two face in the same direction."
    : " The two face in opposite directions.";
}

function renderPositionClue(
  clue: Sea002Cp007ProductionClue,
  all: readonly Sea002Cp007ProductionClue[],
  used: Set<Sea002Cp007ProductionClue>,
): string | null {
  if (clue.kind === "SAME_ROW_OFFSET") {
    used.add(clue);
    const placement = clue.distance === 1
      ? `immediately to the ${clue.direction.toLowerCase()} of`
      : `${clue.distance} positions to the ${clue.direction.toLowerCase()} of`;
    return `${clue.subject} sits ${placement} ${clue.reference}.${facingSuffix(clue.subject, clue.reference, all, used)}`;
  }
  if (clue.kind === "OPPOSITE") {
    used.add(clue);
    return `${clue.left} sits opposite ${clue.right}.${facingSuffix(clue.left, clue.right, all, used)}`;
  }
  if (clue.kind === "DIAGONAL") {
    used.add(clue);
    return `${clue.subject} sits diagonally from ${clue.reference} in ${clue.reference}'s ${clue.direction.toLowerCase()}-hand direction.${facingSuffix(clue.subject, clue.reference, all, used)}`;
  }
  return null;
}

export function renderSea002Cp007ExamRealStem(caselet: Sea002Cp007ProductionCaselet): string {
  const used = new Set<Sea002Cp007ProductionClue>();
  const anchor = caselet.clues.find((clue) => clue.kind === "FACING_ANCHOR");
  const sentences: string[] = [];
  if (anchor?.kind === "FACING_ANCHOR") {
    used.add(anchor);
    sentences.push(`${anchor.person} faces ${anchor.facing === "N" ? "north" : "south"}.`);
  }

  for (const clue of caselet.clues) {
    if (used.has(clue)) continue;
    const rendered = renderPositionClue(clue, caselet.clues, used);
    if (rendered) sentences.push(rendered);
  }

  const residualFacing = caselet.clues.filter(
    (clue): clue is Extract<Sea002Cp007ProductionClue, { kind: "FACING_RELATION" }> =>
      !used.has(clue) && clue.kind === "FACING_RELATION",
  );
  if (residualFacing.length > 0) {
    residualFacing.forEach((clue) => used.add(clue));
    const compact = residualFacing.map((clue) =>
      `${clue.left}–${clue.right}: ${clue.relation === "SAME" ? "same" : "opposite"}`,
    );
    sentences.push(`For the remaining facing relations, ${compact.join("; ")}.`);
  }

  return `Two parallel rows contain ${caselet.width} persons each. The upper-row members are ${[...caselet.rowGroups.top].sort().join(", ")}; the lower-row members are ${[...caselet.rowGroups.bottom].sort().join(", ")}. Some persons face north and some face south. ${sentences.join(" ")}`;
}

export function countSea002Cp007ExamRealClueSentences(caselet: Sea002Cp007ProductionCaselet): number {
  const stem = renderSea002Cp007ExamRealStem(caselet);
  const prefixSentences = 3;
  const sentenceCount = (stem.match(/\./g) ?? []).length;
  return Math.max(0, sentenceCount - prefixSentences);
}
