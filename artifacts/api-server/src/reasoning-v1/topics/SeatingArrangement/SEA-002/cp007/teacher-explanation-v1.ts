import type {
  Sea002Cp007ProductionCaselet,
  Sea002Cp007ProductionClue,
} from "./production-caselet-v1.ts";

type Facing = "N" | "S";
type Row = "TOP" | "BOTTOM";
type Direction = "LEFT" | "RIGHT";

function facingWord(value: Facing) {
  return value === "N" ? "north" : "south";
}

function facingArrow(value: Facing) {
  return value === "N" ? "↑" : "↓";
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

function physicalSide(facing: Facing, direction: Direction): "left" | "right" {
  if (facing === "N") return direction === "LEFT" ? "left" : "right";
  return direction === "LEFT" ? "right" : "left";
}

function renderPerson(caselet: Sea002Cp007ProductionCaselet, id: string) {
  const item = participant(caselet, id);
  return `${item.id}${facingArrow(item.facing)}`;
}

function renderFinalArrangement(
  caselet: Sea002Cp007ProductionCaselet,
  heading = "Final arrangement",
): string {
  const positions = Array.from({ length: caselet.width }, (_, index) => String(index + 1));
  const row = (targetRow: Row) => caselet.participants
    .filter((item) => item.seat.row === targetRow)
    .sort((left, right) => left.seat.position - right.seat.position)
    .map((item) => `${item.id}${facingArrow(item.facing)}`);

  return [
    `${heading} (left to right; ↑ = north, ↓ = south):`,
    `Position  | ${positions.join(" | ")}`,
    `Upper row | ${row("TOP").join(" | ")}`,
    `Lower row | ${row("BOTTOM").join(" | ")}`,
  ].join("\n");
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

function renderFacingChain(caselet: Sea002Cp007ProductionCaselet, target: string): string[] {
  const anchor = caselet.clues.find((clue) => clue.kind === "FACING_ANCHOR");
  if (!anchor || anchor.kind !== "FACING_ANCHOR") throw new Error("Facing anchor missing.");

  const steps = [`${anchor.person}${facingArrow(anchor.facing)} is given.`];
  if (anchor.person === target) return steps;

  let knownPerson = anchor.person;
  let knownFacing = anchor.facing;
  for (const clue of facingPath(caselet, target)) {
    if (clue.kind !== "FACING_RELATION") continue;
    const nextPerson = clue.left === knownPerson ? clue.right : clue.left;
    const nextFacing = clue.relation === "SAME" ? knownFacing : oppositeFacing(knownFacing);
    steps.push(
      `${nextPerson} faces ${clue.relation === "SAME" ? "the same way as" : "opposite to"} ${knownPerson} ⇒ ${nextPerson}${facingArrow(nextFacing)}.`,
    );
    knownPerson = nextPerson;
    knownFacing = nextFacing;
  }
  return steps;
}

function renderFacingChainBlock(caselet: Sea002Cp007ProductionCaselet, target: string): string {
  return [
    "Facing chain:",
    ...renderFacingChain(caselet, target).map((step, index) => `${index + 1}. ${step}`),
  ].join("\n");
}

function rowRelation(clue: Sea002Cp007ProductionClue):
  | { left: string; right: string; relation: "SAME" | "DIFFERENT"; reason: string }
  | null {
  if (clue.kind === "SAME_ROW_OFFSET") {
    return {
      left: clue.subject,
      right: clue.reference,
      relation: "SAME",
      reason: `${clue.subject} is to the ${clue.direction.toLowerCase()} of ${clue.reference}`,
    };
  }
  if (clue.kind === "OPPOSITE") {
    return {
      left: clue.left,
      right: clue.right,
      relation: "DIFFERENT",
      reason: `${clue.left} sits opposite ${clue.right}`,
    };
  }
  if (clue.kind === "DIAGONAL") {
    return {
      left: clue.subject,
      right: clue.reference,
      relation: "DIFFERENT",
      reason: `${clue.subject} sits diagonally from ${clue.reference}`,
    };
  }
  return null;
}

function renderRowChain(caselet: Sea002Cp007ProductionCaselet, target: string): string[] {
  const anchor = caselet.clues.find((clue) => clue.kind === "ROW_ANCHOR");
  if (!anchor || anchor.kind !== "ROW_ANCHOR") {
    return [`${target}'s row is already given by the row-membership list.`];
  }
  if (anchor.person === target) {
    return [`${anchor.person} is given in the ${rowWord(anchor.row)} row.`];
  }

  const relations = caselet.clues
    .map(rowRelation)
    .filter((item): item is NonNullable<ReturnType<typeof rowRelation>> => item !== null);
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
        const links: Array<{ person: string; previous: string; relation: (typeof relations)[number] }> = [];
        let node = target;
        while (node !== anchor.person) {
          const link = parent.get(node);
          if (!link) throw new Error(`Broken row path to ${target}.`);
          links.push({ person: node, previous: link.previous, relation: link.relation });
          node = link.previous;
        }
        links.reverse();

        const steps = [`${anchor.person} is given in the ${rowWord(anchor.row)} row.`];
        for (const link of links) {
          const derivedRow = rows.get(link.person)!;
          steps.push(
            `${link.relation.reason}. This keeps ${link.person} in the ${link.relation.relation === "SAME" ? "same" : "other"} row ⇒ ${rowWord(derivedRow)} row.`,
          );
        }
        return steps;
      }
      queue.push(next);
    }
  }

  throw new Error(`No row-membership path to ${target}.`);
}

function renderRowChainBlock(caselet: Sea002Cp007ProductionCaselet, target: string): string {
  return [
    "Row chain:",
    ...renderRowChain(caselet, target).map((step, index) => `${index + 1}. ${step}`),
  ].join("\n");
}

function sameRowCluesFor(
  caselet: Sea002Cp007ProductionCaselet,
  row: Row,
): Array<Extract<Sea002Cp007ProductionClue, { kind: "SAME_ROW_OFFSET" }>> {
  return caselet.clues
    .filter((clue): clue is Extract<Sea002Cp007ProductionClue, { kind: "SAME_ROW_OFFSET" }> => clue.kind === "SAME_ROW_OFFSET")
    .filter((clue) => participant(caselet, clue.reference).seat.row === row)
    .sort((left, right) => {
      const leftPosition = Math.min(
        participant(caselet, left.reference).seat.position,
        participant(caselet, left.subject).seat.position,
      );
      const rightPosition = Math.min(
        participant(caselet, right.reference).seat.position,
        participant(caselet, right.subject).seat.position,
      );
      return leftPosition - rightPosition;
    });
}

function renderSameRowConstruction(caselet: Sea002Cp007ProductionCaselet, row: Row): string {
  const clues = sameRowCluesFor(caselet, row);
  const lines = [`${row === "TOP" ? "Upper" : "Lower"}-row blocks:`];

  for (const clue of clues) {
    const reference = participant(caselet, clue.reference);
    const subject = participant(caselet, clue.subject);
    const side = physicalSide(reference.facing, clue.direction);
    const pair = side === "right"
      ? `${renderPerson(caselet, clue.reference)} — ${renderPerson(caselet, clue.subject)}`
      : `${renderPerson(caselet, clue.subject)} — ${renderPerson(caselet, clue.reference)}`;
    lines.push(
      `- ${clue.reference}${facingArrow(reference.facing)} faces ${facingWord(reference.facing)}, so ${clue.reference}'s ${clue.direction.toLowerCase()} is toward the ${side} side of the page. Therefore the adjacent block is ${pair}.`,
    );
    if (subject.seat.row !== reference.seat.row) throw new Error("Same-row clue crossed rows.");
  }

  const finalRow = caselet.participants
    .filter((item) => item.seat.row === row)
    .sort((left, right) => left.seat.position - right.seat.position)
    .map((item) => `${item.id}${facingArrow(item.facing)}`)
    .join(" — ");
  lines.push(`Combining the blocks gives: ${finalRow}.`);
  return lines.join("\n");
}

function renderAlignment(caselet: Sea002Cp007ProductionCaselet): string {
  const lines = ["Align the two rows:"];
  const opposite = caselet.clues.filter((clue) => clue.kind === "OPPOSITE");
  const diagonal = caselet.clues.filter((clue) => clue.kind === "DIAGONAL");

  for (const clue of opposite) {
    if (clue.kind !== "OPPOSITE") continue;
    const left = participant(caselet, clue.left);
    lines.push(
      `- ${clue.left} sits opposite ${clue.right}, so they must occupy the same position in different rows (position ${left.seat.position + 1}).`,
    );
  }

  for (const clue of diagonal) {
    if (clue.kind !== "DIAGONAL") continue;
    const reference = participant(caselet, clue.reference);
    const subject = participant(caselet, clue.subject);
    const side = physicalSide(reference.facing, clue.direction);
    lines.push(
      `- ${clue.reference}${facingArrow(reference.facing)} faces ${facingWord(reference.facing)}. Its ${clue.direction.toLowerCase()} is toward the ${side} side, so ${clue.subject} must be in the other row one position to that side (position ${subject.seat.position + 1}).`,
    );
  }
  return lines.join("\n");
}

function parseReference(question: string): string {
  const sameRow = question.match(/\bof ([A-Za-z]+)\?$/u);
  if (sameRow) return sameRow[1]!;
  const diagonal = question.match(/\bfrom ([A-Za-z]+) in \1's (?:left|right)-hand direction\?$/u);
  if (diagonal) return diagonal[1]!;
  throw new Error(`Could not parse reference from question: ${question}`);
}

function parseDirection(question: string): Direction {
  if (/\bleft\b/iu.test(question)) return "LEFT";
  if (/\bright\b/iu.test(question)) return "RIGHT";
  throw new Error(`Could not parse direction from question: ${question}`);
}

function directSameRowClue(
  caselet: Sea002Cp007ProductionCaselet,
  reference: string,
  answer: string,
  direction: Direction,
) {
  return caselet.clues.find((clue) =>
    clue.kind === "SAME_ROW_OFFSET"
    && clue.reference === reference
    && clue.subject === answer
    && clue.direction === direction,
  );
}

function renderAuthority01(caselet: Sea002Cp007ProductionCaselet): string {
  const reference = parseReference(caselet.question);
  const direction = parseDirection(caselet.question);
  const direct = directSameRowClue(caselet, reference, caselet.answer, direction);

  if (direct?.kind === "SAME_ROW_OFFSET") {
    return [
      "Method: match the reference person and direction before doing any arrangement work.",
      `The clue says ${caselet.answer} sits immediately to the ${direction.toLowerCase()} of ${reference}. The question asks for the person immediately to the same ${direction.toLowerCase()} of the same reference, ${reference}.`,
      `So this clue itself answers the question. We do not even need ${reference}'s facing because the clue and the question use the same person's ${direction.toLowerCase()}.`,
      `Therefore, the answer is ${caselet.answer}.`,
    ].join("\n");
  }

  const ref = participant(caselet, reference);
  const answer = participant(caselet, caselet.answer);
  const side = physicalSide(ref.facing, direction);
  return [
    `Method: first find ${reference}'s facing, then translate ${reference}'s ${direction.toLowerCase()} into a physical side of the row.`,
    renderFacingChainBlock(caselet, reference),
    `${reference}${facingArrow(ref.facing)} faces ${facingWord(ref.facing)}, so ${reference}'s ${direction.toLowerCase()} is toward the ${side} side of the page.`,
    renderSameRowConstruction(caselet, ref.seat.row),
    renderFinalArrangement(caselet),
    `In the final arrangement, the immediate ${direction.toLowerCase()} seat from ${reference}'s point of view is occupied by ${caselet.answer}. Therefore, the answer is ${caselet.answer}.`,
    `Check: ${caselet.answer} is at position ${answer.seat.position + 1} in the ${rowWord(answer.seat.row)} row.`,
  ].join("\n");
}

function renderAuthority02(caselet: Sea002Cp007ProductionCaselet): string {
  const targetMatch = caselet.question.match(/does ([A-Za-z]+) face\?/u);
  const target = targetMatch?.[1];
  if (!target) throw new Error(`Could not parse facing target from question: ${caselet.question}`);
  const targetParticipant = participant(caselet, target);

  return [
    "Method: ignore the seating-position clues. Only the facing chain is needed.",
    renderFacingChainBlock(caselet, target),
    `So ${target}${facingArrow(targetParticipant.facing)} faces ${facingWord(targetParticipant.facing)}. Therefore, the answer is ${caselet.answer}.`,
  ].join("\n");
}

function renderAuthority03(caselet: Sea002Cp007ProductionCaselet): string {
  const targetMatch = caselet.question.match(/gives ([A-Za-z]+)'s row/u);
  const target = targetMatch?.[1];
  if (!target) throw new Error(`Could not parse row/facing target from question: ${caselet.question}`);
  const targetParticipant = participant(caselet, target);

  return [
    `Method: solve ${target}'s row and facing separately, then combine the two results.`,
    renderRowChainBlock(caselet, target),
    renderFacingChainBlock(caselet, target),
    renderFinalArrangement(caselet, "Verification arrangement"),
    `The arrangement confirms ${target}${facingArrow(targetParticipant.facing)} is in the ${rowWord(targetParticipant.seat.row)} row and faces ${facingWord(targetParticipant.facing)}. Therefore, the answer is ${caselet.answer}.`,
  ].join("\n");
}

function renderAuthority04(caselet: Sea002Cp007ProductionCaselet): string {
  const reference = parseReference(caselet.question);
  const direction = parseDirection(caselet.question);
  const ref = participant(caselet, reference);
  const answer = participant(caselet, caselet.answer);
  const side = physicalSide(ref.facing, direction);

  return [
    `Method: determine ${reference}'s facing, build the two row blocks, align the rows, and only then read the diagonal.`,
    renderFacingChainBlock(caselet, reference),
    "Build the rows:",
    renderSameRowConstruction(caselet, "TOP"),
    renderSameRowConstruction(caselet, "BOTTOM"),
    renderAlignment(caselet),
    renderFinalArrangement(caselet),
    `${reference}${facingArrow(ref.facing)} is at position ${ref.seat.position + 1}. Because ${reference} faces ${facingWord(ref.facing)}, ${reference}'s ${direction.toLowerCase()} is toward the ${side} side of the page. Move one position to that side and switch to the other row: position ${answer.seat.position + 1} contains ${caselet.answer}.`,
    `Therefore, the answer is ${caselet.answer}.`,
  ].join("\n");
}

export function renderSea002Cp007TeacherExplanation(caselet: Sea002Cp007ProductionCaselet): string {
  switch (caselet.authorityKey) {
    case "CP007-AUTH-01":
      return renderAuthority01(caselet);
    case "CP007-AUTH-02":
      return renderAuthority02(caselet);
    case "CP007-AUTH-03":
      return renderAuthority03(caselet);
    case "CP007-AUTH-04":
      return renderAuthority04(caselet);
  }
}
