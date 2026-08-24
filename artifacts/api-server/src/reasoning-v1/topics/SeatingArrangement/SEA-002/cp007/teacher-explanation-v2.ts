import type {
  Sea002Cp007ProductionCaselet,
  Sea002Cp007ProductionClue,
} from "./production-caselet-v1.ts";

type Facing = "N" | "S";
type Row = "TOP" | "BOTTOM";

function arrow(value: Facing) {
  return value === "N" ? "↑" : "↓";
}

function facingWord(value: Facing) {
  return value === "N" ? "north" : "south";
}

function rowWord(value: Row) {
  return value === "TOP" ? "upper" : "lower";
}

function oppositeFacing(value: Facing): Facing {
  return value === "N" ? "S" : "N";
}

function oppositeRow(value: Row): Row {
  return value === "TOP" ? "BOTTOM" : "TOP";
}

function participant(caselet: Sea002Cp007ProductionCaselet, id: string) {
  const found = caselet.participants.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown participant ${id}.`);
  return found;
}

function renderRowDiagram(
  caselet: Sea002Cp007ProductionCaselet,
  row: Row,
  highlight: readonly string[] = [],
) {
  const highlighted = new Set(highlight);
  const seats = caselet.participants
    .filter((item) => item.seat.row === row)
    .sort((left, right) => left.seat.position - right.seat.position)
    .map((item) => {
      const value = `P${item.seat.position + 1} ${item.id}${arrow(item.facing)}`;
      return highlighted.has(item.id) ? `[${value}]` : value;
    })
    .join(" | ");
  return `${row === "TOP" ? "Upper" : "Lower"}: ${seats}`;
}

function renderDiagram(
  caselet: Sea002Cp007ProductionCaselet,
  highlight: readonly string[] = [],
) {
  return [
    "Arrangement (our left → right):",
    renderRowDiagram(caselet, "TOP", highlight),
    renderRowDiagram(caselet, "BOTTOM", highlight),
    "↑ = north, ↓ = south",
  ].join("\n");
}

function pointOfViewRule(person: string, facing: Facing) {
  return facing === "N"
    ? `${person} faces north ${arrow(facing)}, so ${person}'s left/right are the same as our left/right.`
    : `${person} faces south ${arrow(facing)}, so ${person}'s left/right are reversed from our view: ${person}'s right is our left and ${person}'s left is our right.`;
}

function facingPath(caselet: Sea002Cp007ProductionCaselet, target: string): Sea002Cp007ProductionClue[] {
  const anchor = caselet.clues.find((clue) => clue.kind === "FACING_ANCHOR");
  if (!anchor || anchor.kind !== "FACING_ANCHOR") throw new Error("Facing anchor missing.");
  if (anchor.person === target) return [];

  const relations = caselet.clues.filter((clue) => clue.kind === "FACING_RELATION");
  const queue = [anchor.person];
  const seen = new Set(queue);
  const parent = new Map<string, { previous: string; clue: Sea002Cp007ProductionClue }>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const clue of relations) {
      if (clue.kind !== "FACING_RELATION") continue;
      const next = clue.left === current ? clue.right : clue.right === current ? clue.left : null;
      if (!next || seen.has(next)) continue;
      seen.add(next);
      parent.set(next, { previous: current, clue });
      if (next === target) {
        const path: Sea002Cp007ProductionClue[] = [];
        let node = target;
        while (node !== anchor.person) {
          const link = parent.get(node);
          if (!link) throw new Error(`Broken facing path to ${target}.`);
          path.push(link.clue);
          node = link.previous;
        }
        return path.reverse();
      }
      queue.push(next);
    }
  }
  throw new Error(`No facing path to ${target}.`);
}

function facingProofLines(caselet: Sea002Cp007ProductionCaselet, target: string): string[] {
  const anchor = caselet.clues.find((clue) => clue.kind === "FACING_ANCHOR");
  if (!anchor || anchor.kind !== "FACING_ANCHOR") throw new Error("Facing anchor missing.");

  const lines = [`- ${anchor.person} ${arrow(anchor.facing)} (${facingWord(anchor.facing)}) is given.`];
  if (anchor.person === target) return lines;

  let knownPerson = anchor.person;
  let knownFacing = anchor.facing;
  for (const clue of facingPath(caselet, target)) {
    if (clue.kind !== "FACING_RELATION") continue;
    const nextPerson = clue.left === knownPerson ? clue.right : clue.left;
    const nextFacing = clue.relation === "SAME" ? knownFacing : oppositeFacing(knownFacing);
    lines.push(
      `- ${clue.left} and ${clue.right} face ${clue.relation === "SAME" ? "the same way" : "opposite ways"} ⇒ ${nextPerson} ${arrow(nextFacing)}.`,
    );
    knownPerson = nextPerson;
    knownFacing = nextFacing;
  }
  return lines;
}

function rowRelation(clue: Sea002Cp007ProductionClue):
  | { left: string; right: string; relation: "SAME" | "DIFFERENT"; text: string }
  | null {
  if (clue.kind === "SAME_ROW_OFFSET") {
    return {
      left: clue.subject,
      right: clue.reference,
      relation: "SAME",
      text: `${clue.subject} is ${clue.direction.toLowerCase()} of ${clue.reference}`,
    };
  }
  if (clue.kind === "OPPOSITE") {
    return { left: clue.left, right: clue.right, relation: "DIFFERENT", text: `${clue.left} is opposite ${clue.right}` };
  }
  if (clue.kind === "DIAGONAL") {
    return { left: clue.subject, right: clue.reference, relation: "DIFFERENT", text: `${clue.subject} is diagonal to ${clue.reference}` };
  }
  return null;
}

function rowProofLines(caselet: Sea002Cp007ProductionCaselet, target: string): string[] {
  const anchor = caselet.clues.find((clue) => clue.kind === "ROW_ANCHOR");
  if (!anchor || anchor.kind !== "ROW_ANCHOR") {
    return [`- The row membership list already tells us ${target}'s row.`];
  }
  const lines = [`- ${anchor.person} is given in the ${rowWord(anchor.row)} row.`];
  if (anchor.person === target) return lines;

  const relations = caselet.clues.map(rowRelation).filter((item): item is NonNullable<ReturnType<typeof rowRelation>> => item !== null);
  const queue = [anchor.person];
  const rows = new Map<string, Row>([[anchor.person, anchor.row]]);
  const parent = new Map<string, { previous: string; relation: (typeof relations)[number] }>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentRow = rows.get(current)!;
    for (const relation of relations) {
      const next = relation.left === current ? relation.right : relation.right === current ? relation.left : null;
      if (!next || rows.has(next)) continue;
      const nextRow = relation.relation === "SAME" ? currentRow : oppositeRow(currentRow);
      rows.set(next, nextRow);
      parent.set(next, { previous: current, relation });
      if (next === target) {
        const chain: Array<{ person: string; relation: (typeof relations)[number] }> = [];
        let node = target;
        while (node !== anchor.person) {
          const link = parent.get(node);
          if (!link) throw new Error(`Broken row path to ${target}.`);
          chain.push({ person: node, relation: link.relation });
          node = link.previous;
        }
        chain.reverse();
        for (const link of chain) {
          const resolved = rows.get(link.person)!;
          lines.push(
            `- ${link.relation.text} ⇒ ${link.person} is in the ${link.relation.relation === "SAME" ? "same" : "other"} row ⇒ ${rowWord(resolved)} row.`,
          );
        }
        return lines;
      }
      queue.push(next);
    }
  }
  throw new Error(`No row path to ${target}.`);
}

function sameRowPlacementLines(caselet: Sea002Cp007ProductionCaselet, row: Row): string[] {
  return caselet.clues
    .filter((clue) => clue.kind === "SAME_ROW_OFFSET")
    .filter((clue) => participant(caselet, clue.reference).seat.row === row)
    .map((clue) => {
      if (clue.kind !== "SAME_ROW_OFFSET") throw new Error("Unexpected clue kind.");
      const reference = participant(caselet, clue.reference);
      const subject = participant(caselet, clue.subject);
      const physicalSide = subject.seat.position < reference.seat.position ? "our left" : "our right";
      return `- ${clue.subject} is ${clue.direction.toLowerCase()} of ${clue.reference}; ${clue.reference} ${arrow(reference.facing)} ⇒ place ${clue.subject} immediately to ${physicalSide} of ${clue.reference}.`;
    });
}

function alignmentLines(caselet: Sea002Cp007ProductionCaselet): string[] {
  const lines: string[] = [];
  const opposite = caselet.clues.find((clue) => clue.kind === "OPPOSITE");
  const diagonal = caselet.clues.find((clue) => clue.kind === "DIAGONAL");
  if (opposite?.kind === "OPPOSITE") {
    lines.push(`- ${opposite.left} opposite ${opposite.right} ⇒ they occupy the same position in the two rows.`);
  }
  if (diagonal?.kind === "DIAGONAL") {
    const reference = participant(caselet, diagonal.reference);
    const subject = participant(caselet, diagonal.subject);
    const physicalSide = subject.seat.position < reference.seat.position ? "our left" : "our right";
    lines.push(`- ${diagonal.subject} is diagonal to ${diagonal.reference} on ${diagonal.reference}'s ${diagonal.direction.toLowerCase()}; ${diagonal.reference} ${arrow(reference.facing)} ⇒ ${diagonal.subject} is one position to ${physicalSide} in the other row.`);
  }
  return lines;
}

function parseReference(question: string): string {
  const sameRow = question.match(/\bof ([A-Za-z]+)\?$/u);
  if (sameRow) return sameRow[1]!;
  const diagonal = question.match(/\bfrom ([A-Za-z]+) in \1's (?:left|right)-hand direction\?$/u);
  if (diagonal) return diagonal[1]!;
  throw new Error(`Could not parse reference from question: ${question}`);
}

function parseDirection(question: string): "LEFT" | "RIGHT" {
  if (/\bleft\b/iu.test(question)) return "LEFT";
  if (/\bright\b/iu.test(question)) return "RIGHT";
  throw new Error(`Could not parse direction from question: ${question}`);
}

function renderAuthority01(caselet: Sea002Cp007ProductionCaselet): string {
  const referenceId = parseReference(caselet.question);
  const direction = parseDirection(caselet.question);
  const reference = participant(caselet, referenceId);
  const answer = participant(caselet, caselet.answer);

  return [
    `Asked: who is immediately to the ${direction.toLowerCase()} of ${referenceId}?`,
    "1) Fix the reference person's facing:",
    ...facingProofLines(caselet, referenceId),
    `2) Build ${referenceId}'s row from the position clues:`,
    ...sameRowPlacementLines(caselet, reference.seat.row),
    ...alignmentLines(caselet),
    renderRowDiagram(caselet, reference.seat.row, [referenceId, caselet.answer]),
    `3) Read left/right from ${referenceId}'s point of view. ${pointOfViewRule(referenceId, reference.facing)}`,
    `${referenceId} is at P${reference.seat.position + 1}; one place to ${referenceId}'s ${direction.toLowerCase()} is P${answer.seat.position + 1}, occupied by ${caselet.answer}.`,
    `Answer: ${caselet.answer}.`,
  ].join("\n");
}

function renderAuthority02(caselet: Sea002Cp007ProductionCaselet): string {
  const match = caselet.question.match(/does ([A-Za-z]+) face\?/u);
  const target = match?.[1];
  if (!target) throw new Error(`Could not parse facing target from ${caselet.question}.`);
  const resolved = participant(caselet, target);
  return [
    `Asked: which direction does ${target} face? We do not need to arrange the rows for this question.`,
    "Follow only the facing chain:",
    ...facingProofLines(caselet, target),
    `So ${target} ${arrow(resolved.facing)} = ${facingWord(resolved.facing)}.`,
    `Answer: ${caselet.answer}.`,
  ].join("\n");
}

function renderAuthority03(caselet: Sea002Cp007ProductionCaselet): string {
  const match = caselet.question.match(/gives ([A-Za-z]+)'s row/u);
  const target = match?.[1];
  if (!target) throw new Error(`Could not parse row/facing target from ${caselet.question}.`);
  const resolved = participant(caselet, target);
  return [
    `Asked: determine both ${target}'s row and facing. Solve the two parts separately.`,
    "1) Row membership:",
    ...rowProofLines(caselet, target),
    `Therefore ${target} belongs to the ${rowWord(resolved.seat.row)} row.`,
    "2) Facing direction:",
    ...facingProofLines(caselet, target),
    `Therefore ${target} faces ${facingWord(resolved.facing)} ${arrow(resolved.facing)}.`,
    "Check the resolved arrangement:",
    renderDiagram(caselet, [target]),
    `Answer: ${caselet.answer}.`,
  ].join("\n");
}

function renderAuthority04(caselet: Sea002Cp007ProductionCaselet): string {
  const referenceId = parseReference(caselet.question);
  const direction = parseDirection(caselet.question);
  const reference = participant(caselet, referenceId);
  const answer = participant(caselet, caselet.answer);

  return [
    `Asked: who is diagonally to ${referenceId}'s ${direction.toLowerCase()}?`,
    "1) First fix the reference person's facing:",
    ...facingProofLines(caselet, referenceId),
    `2) Translate ${referenceId}'s left/right correctly. ${pointOfViewRule(referenceId, reference.facing)}`,
    "3) Build and align the two rows:",
    ...sameRowPlacementLines(caselet, "TOP"),
    ...sameRowPlacementLines(caselet, "BOTTOM"),
    ...alignmentLines(caselet),
    renderDiagram(caselet, [referenceId, caselet.answer]),
    `4) ${referenceId} is at P${reference.seat.position + 1}. One place to ${referenceId}'s ${direction.toLowerCase()} is P${answer.seat.position + 1}; diagonal means take that position in the other row. ${caselet.answer} is there.`,
    `Answer: ${caselet.answer}.`,
  ].join("\n");
}

export function renderSea002Cp007TeacherExplanationV2(caselet: Sea002Cp007ProductionCaselet): string {
  switch (caselet.authorityKey) {
    case "CP007-AUTH-01": return renderAuthority01(caselet);
    case "CP007-AUTH-02": return renderAuthority02(caselet);
    case "CP007-AUTH-03": return renderAuthority03(caselet);
    case "CP007-AUTH-04": return renderAuthority04(caselet);
  }
}
