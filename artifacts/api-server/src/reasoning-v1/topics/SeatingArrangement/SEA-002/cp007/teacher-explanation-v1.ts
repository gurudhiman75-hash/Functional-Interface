import type {
  Sea002Cp007ProductionCaselet,
  Sea002Cp007ProductionClue,
} from "./production-caselet-v1.ts";

type Facing = "N" | "S";
type Row = "TOP" | "BOTTOM";

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

function renderRow(caselet: Sea002Cp007ProductionCaselet, row: Row) {
  return caselet.participants
    .filter((item) => item.seat.row === row)
    .sort((left, right) => left.seat.position - right.seat.position)
    .map((item, index) => `position ${index + 1}: ${item.id}`)
    .join("; ");
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

function renderFacingProof(caselet: Sea002Cp007ProductionCaselet, target: string): string {
  const anchor = caselet.clues.find((clue) => clue.kind === "FACING_ANCHOR");
  if (!anchor || anchor.kind !== "FACING_ANCHOR") throw new Error("Facing anchor missing.");

  if (anchor.person === target) {
    return `${anchor.person} is directly given as facing ${facingWord(anchor.facing)}.`;
  }

  const steps = [`${anchor.person} faces ${facingWord(anchor.facing)}.`];
  let knownPerson = anchor.person;
  let knownFacing = anchor.facing;

  for (const clue of facingPath(caselet, target)) {
    if (clue.kind !== "FACING_RELATION") continue;
    const nextPerson = clue.left === knownPerson ? clue.right : clue.left;
    const nextFacing = clue.relation === "SAME" ? knownFacing : oppositeFacing(knownFacing);
    steps.push(
      `${clue.left} and ${clue.right} face in ${clue.relation === "SAME" ? "the same" : "opposite"} directions, so ${nextPerson} faces ${facingWord(nextFacing)}.`,
    );
    knownPerson = nextPerson;
    knownFacing = nextFacing;
  }

  return steps.join(" ");
}

function rowRelation(clue: Sea002Cp007ProductionClue):
  | { left: string; right: string; relation: "SAME" | "DIFFERENT"; reason: string }
  | null {
  if (clue.kind === "SAME_ROW_OFFSET") {
    return {
      left: clue.subject,
      right: clue.reference,
      relation: "SAME",
      reason: `${clue.subject} is stated to be to the ${clue.direction.toLowerCase()} of ${clue.reference}`,
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

function renderRowProof(caselet: Sea002Cp007ProductionCaselet, target: string): string {
  const anchor = caselet.clues.find((clue) => clue.kind === "ROW_ANCHOR");
  if (!anchor || anchor.kind !== "ROW_ANCHOR") {
    return `${target}'s row is already supplied in the row membership list.`;
  }
  if (anchor.person === target) {
    return `${anchor.person} is directly given in the ${rowWord(anchor.row)} row.`;
  }

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
            `${link.relation.reason}. Therefore ${link.person} is in the ${link.relation.relation === "SAME" ? "same" : "other"} row, i.e. the ${rowWord(derivedRow)} row.`,
          );
        }
        return steps.join(" ");
      }
      queue.push(next);
    }
  }

  throw new Error(`No row-membership path to ${target}.`);
}

function parseReference(question: string): string {
  const match = question.match(/\bof ([A-Za-z]+)\?$/u);
  if (!match) throw new Error(`Could not parse reference from question: ${question}`);
  return match[1]!;
}

function parseDirection(question: string): "LEFT" | "RIGHT" {
  if (/\bleft\b/iu.test(question)) return "LEFT";
  if (/\bright\b/iu.test(question)) return "RIGHT";
  throw new Error(`Could not parse direction from question: ${question}`);
}

function directSameRowClue(
  caselet: Sea002Cp007ProductionCaselet,
  reference: string,
  answer: string,
  direction: "LEFT" | "RIGHT",
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
      `Because the statement itself gives ${caselet.answer}'s position relative to ${reference}, there is no need to solve the whole arrangement.`,
      `It says that ${caselet.answer} sits ${direct.distance === 1 ? "immediately" : `${direct.distance} positions`} to the ${direction.toLowerCase()} of ${reference}, so ${caselet.answer} directly satisfies what the question asks.`,
      `Therefore, the answer is ${caselet.answer}.`,
    ].join("\n");
  }

  const ref = participant(caselet, reference);
  const answer = participant(caselet, caselet.answer);
  return [
    `First determine ${reference}'s facing: ${renderFacingProof(caselet, reference)}`,
    `The ${rowWord(ref.seat.row)} row from left to right is ${renderRow(caselet, ref.seat.row)}.`,
    `${reference} faces ${facingWord(ref.facing)}. From ${reference}'s point of view, moving ${direction.toLowerCase()} reaches position ${answer.seat.position + 1}, occupied by ${caselet.answer}.`,
    `Therefore, the answer is ${caselet.answer}.`,
  ].join("\n");
}

function renderAuthority02(caselet: Sea002Cp007ProductionCaselet): string {
  const targetMatch = caselet.question.match(/does ([A-Za-z]+) face\?/u);
  const target = targetMatch?.[1];
  if (!target) throw new Error(`Could not parse facing target from question: ${caselet.question}`);

  return [
    `This question asks only for ${target}'s facing, so the seating order is not required.`,
    renderFacingProof(caselet, target),
    `Hence ${target} faces ${caselet.answer.toLowerCase()}. Therefore, the answer is ${caselet.answer}.`,
  ].join("\n");
}

function renderAuthority03(caselet: Sea002Cp007ProductionCaselet): string {
  const targetMatch = caselet.question.match(/gives ([A-Za-z]+)'s row/u);
  const target = targetMatch?.[1];
  if (!target) throw new Error(`Could not parse row/facing target from question: ${caselet.question}`);
  const targetParticipant = participant(caselet, target);

  return [
    `We need two things for ${target}: the row and the facing direction.`,
    `For the row: ${renderRowProof(caselet, target)}`,
    `For the facing: ${renderFacingProof(caselet, target)}`,
    `So ${target} is in the ${rowWord(targetParticipant.seat.row)} row and faces ${facingWord(targetParticipant.facing)}. Therefore, the answer is ${caselet.answer}.`,
  ].join("\n");
}

function renderAuthority04(caselet: Sea002Cp007ProductionCaselet): string {
  const reference = parseReference(caselet.question);
  const direction = parseDirection(caselet.question);
  const ref = participant(caselet, reference);
  const answer = participant(caselet, caselet.answer);
  const opposite = caselet.clues.find((clue) => clue.kind === "OPPOSITE");
  const diagonal = caselet.clues.find((clue) => clue.kind === "DIAGONAL");

  const alignment = [
    opposite?.kind === "OPPOSITE" ? `${opposite.left} opposite ${opposite.right}` : null,
    diagonal?.kind === "DIAGONAL" ? `${diagonal.subject} diagonally placed from ${diagonal.reference}` : null,
  ].filter(Boolean).join(" and ");

  return [
    `First determine ${reference}'s facing because left/right changes with the direction a person faces. ${renderFacingProof(caselet, reference)}`,
    `Next arrange the two rows using the same-row chains; ${alignment} fixes how the two rows line up. The upper row is ${renderRow(caselet, "TOP")}. The lower row is ${renderRow(caselet, "BOTTOM")}.`,
    `${reference} is at position ${ref.seat.position + 1} and faces ${facingWord(ref.facing)}. Moving one position to ${reference}'s ${direction.toLowerCase()} and then looking at the other row reaches position ${answer.seat.position + 1}, where ${caselet.answer} sits.`,
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
