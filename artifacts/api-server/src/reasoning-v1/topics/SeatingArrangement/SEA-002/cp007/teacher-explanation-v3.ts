import type {
  Sea002Cp007ProductionCaselet,
  Sea002Cp007ProductionClue,
} from "./production-caselet-v1.ts";
import { renderSea002Cp007TeacherExplanationV2 } from "./teacher-explanation-v2.ts";

type Facing = "N" | "S";

function arrow(value: Facing) {
  return value === "N" ? "↑" : "↓";
}

function facingWord(value: Facing) {
  return value === "N" ? "north" : "south";
}

function oppositeFacing(value: Facing): Facing {
  return value === "N" ? "S" : "N";
}

function fullFacingDerivation(caselet: Sea002Cp007ProductionCaselet): string[] {
  const anchor = caselet.clues.find((clue) => clue.kind === "FACING_ANCHOR");
  if (!anchor || anchor.kind !== "FACING_ANCHOR") throw new Error("Facing anchor missing.");

  const relations = caselet.clues.filter(
    (clue): clue is Extract<Sea002Cp007ProductionClue, { kind: "FACING_RELATION" }> =>
      clue.kind === "FACING_RELATION",
  );
  const known = new Map<string, Facing>([[anchor.person, anchor.facing]]);
  const used = new Set<Sea002Cp007ProductionClue>();
  const lines = [`- ${anchor.person} ${arrow(anchor.facing)} (${facingWord(anchor.facing)}) is given.`];

  while (known.size < caselet.participants.length) {
    let progressed = false;
    for (const clue of relations) {
      if (used.has(clue)) continue;
      const left = known.get(clue.left);
      const right = known.get(clue.right);
      if (!left && !right) continue;
      if (left && right) {
        used.add(clue);
        continue;
      }

      const knownPerson = left ? clue.left : clue.right;
      const knownFacing = left ?? right!;
      const nextPerson = left ? clue.right : clue.left;
      const nextFacing = clue.relation === "SAME"
        ? knownFacing
        : oppositeFacing(knownFacing);
      known.set(nextPerson, nextFacing);
      used.add(clue);
      lines.push(
        `- ${clue.left} and ${clue.right} face ${clue.relation === "SAME" ? "the same way" : "opposite ways"}; ${knownPerson} ${arrow(knownFacing)} (${facingWord(knownFacing)}) ⇒ ${nextPerson} ${arrow(nextFacing)} (${facingWord(nextFacing)}).`,
      );
      progressed = true;
    }
    if (!progressed) break;
  }

  if (known.size !== caselet.participants.length) {
    throw new Error(`Could not establish all CP007 facings for ${caselet.caseletId}.`);
  }
  return lines;
}

function replaceStepOne(
  original: string,
  stepOnePrefix: string,
  stepTwoPrefix: string,
  replacementLines: readonly string[],
): string {
  const start = original.indexOf(stepOnePrefix);
  const end = original.indexOf(stepTwoPrefix);
  if (start < 0 || end < 0 || end <= start) {
    throw new Error("Could not replace CP007 facing-preparation block.");
  }
  return [
    original.slice(0, start),
    ...replacementLines,
    original.slice(end),
  ].join("\n").replace(/\n{3,}/g, "\n\n");
}

export function renderSea002Cp007TeacherExplanationV3(
  caselet: Sea002Cp007ProductionCaselet,
): string {
  const v2 = renderSea002Cp007TeacherExplanationV2(caselet);

  if (caselet.authorityKey === "CP007-AUTH-01") {
    return replaceStepOne(
      v2,
      "1) Fix the reference person's facing:",
      "2) Build ",
      [
        "1) Settle the facing directions before using any left/right placement clue:",
        ...fullFacingDerivation(caselet),
      ],
    );
  }

  if (caselet.authorityKey === "CP007-AUTH-04") {
    return replaceStepOne(
      v2,
      "1) First fix the reference person's facing:",
      "2) Translate ",
      [
        "1) Settle the facing directions before building either row:",
        ...fullFacingDerivation(caselet),
      ],
    );
  }

  return v2;
}
