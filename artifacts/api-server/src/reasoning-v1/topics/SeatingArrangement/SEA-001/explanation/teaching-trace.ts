export interface TeachingCaseModel {
  readonly key: string;
  readonly display: string;
}

export interface TeachingTraceClue {
  readonly text: string;
}

export interface TeachingTraceInput {
  readonly intro: readonly string[];
  readonly clues: readonly TeachingTraceClue[];
  readonly enumeratePrefix: (clueCount: number, maxModels: number) => readonly TeachingCaseModel[];
  readonly finalModel: TeachingCaseModel;
  readonly finalHeading?: string;
}

function uniqueModels(models: readonly TeachingCaseModel[]): TeachingCaseModel[] {
  const byKey = new Map<string, TeachingCaseModel>();
  for (const model of models) byKey.set(model.key, model);
  return [...byKey.values()];
}

function caseLines(models: readonly TeachingCaseModel[]): string[] {
  return models.map((model, index) => `Case ${index + 1}: ${model.display}`);
}

function numberWord(value: number): string {
  const words: Record<number, string> = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
  };
  return words[value] ?? String(value);
}

function ordinalSteps(value: string): string {
  const normalized = value.toLowerCase();
  const words: Record<string, number> = {
    immediate: 1,
    immediately: 1,
    first: 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
    sixth: 6,
    seventh: 7,
    eighth: 8,
  };
  const numeric = words[normalized] ?? Number.parseInt(normalized, 10);
  if (!Number.isFinite(numeric)) return `${value} seats`;
  return `${numberWord(numeric)} seat${numeric === 1 ? "" : "s"}`;
}

/** Turn a clue into one simple thing the student can do on the drawing. */
export function studentClueAction(text: string): string {
  let match = text.match(/^(.+?) sits immediately (clockwise|anticlockwise) from (.+?)\.$/i);
  if (match) {
    const [, subject, direction, from] = match;
    return `Put ${subject} in the very next seat ${direction?.toLowerCase()} from ${from}.`;
  }

  match = text.match(/^(.+?) sits (first|second|third|fourth|fifth|sixth|seventh|eighth|\d+(?:st|nd|rd|th)) (clockwise|anticlockwise) from (.+?)\.$/i);
  if (match) {
    const [, subject, distance, direction, from] = match;
    return `Start from ${from}. Count ${ordinalSteps(distance ?? "")} ${direction?.toLowerCase()} and put ${subject} there.`;
  }

  match = text.match(/^Exactly (\d+) person(?:s)? sit(?:s)? between (.+?) and (.+?) when counted (clockwise|anticlockwise) from (.+?)\.$/i);
  if (match) {
    const gap = Number(match[1]);
    const first = match[2];
    const second = match[3];
    const direction = match[4]?.toLowerCase();
    const from = match[5];
    const other = from === first ? second : first;
    const distance = gap + 1;
    return `${numberWord(gap)[0]?.toUpperCase()}${numberWord(gap).slice(1)} person${gap === 1 ? "" : "s"} in between means ${other} is ${numberWord(distance)} seats away from ${from}. Count ${numberWord(distance)} seats ${direction} from ${from} and put ${other} there.`;
  }

  match = text.match(/^Exactly (\d+) person(?:s)? sit(?:s)? between (.+?) and (.+?)\.$/i);
  if (match) {
    const gap = Number(match[1]);
    const first = match[2];
    const second = match[3];
    const distance = gap + 1;
    return `${numberWord(gap)[0]?.toUpperCase()}${numberWord(gap).slice(1)} person${gap === 1 ? "" : "s"} in between means ${first} and ${second} are ${numberWord(distance)} seats apart. Once one is placed, count ${numberWord(distance)} seats to place the other.`;
  }

  match = text.match(/^(.+?) does not sit (?:adjacent to|next to) (.+?)\.$/i);
  if (match) {
    const [, first, second] = match;
    return `${first} and ${second} cannot sit next to each other. If one is already placed, the other cannot take either seat beside that person.`;
  }

  match = text.match(/^(.+?) sits (?:adjacent to|next to) (.+?)\.$/i);
  if (match) {
    const [, subject, beside] = match;
    return `${subject} must sit next to ${beside}. Keep both sides possible for now; another clue may decide the side.`;
  }

  match = text.match(/^(.+?) sits (immediately|first|second|third|fourth|fifth|sixth|seventh|eighth|\d+(?:st|nd|rd|th)) to the (left|right) of (.+?)\.$/i);
  if (match) {
    const [, subject, distance, side, from] = match;
    return `First see which way ${from} is facing. Then count ${ordinalSteps(distance ?? "")} to ${from}'s ${side?.toLowerCase()} and put ${subject} there.`;
  }

  match = text.match(/^(.+?) sits at (?:the )?(left|right) end\.$/i);
  if (match) {
    const [, subject, side] = match;
    return `Put ${subject} at the ${side?.toLowerCase()} end.`;
  }

  match = text.match(/^(.+?) sits at the extreme (left|right) end\.$/i);
  if (match) {
    const [, subject, side] = match;
    return `Put ${subject} at the ${side?.toLowerCase()} end. Start the row from this fixed seat.`;
  }

  match = text.match(/^(.+?) sits at one of the extreme ends\.$/i);
  if (match) {
    const subject = match[1];
    return `${subject} must be at either the first seat or the last seat. Keep both possibilities until another clue decides.`;
  }

  match = text.match(/^(.+?) sits in a middle seat\.$/i);
  if (match) {
    const subject = match[1];
    return `${subject} must be in a middle seat. If there are two middle seats, keep both possible for now.`;
  }

  match = text.match(/^(.+?) sits (\d+)(?:st|nd|rd|th) from the (left|right) end\.$/i);
  if (match) {
    const [, subject, position, side] = match;
    return `Count ${position} seats from the ${side?.toLowerCase()} end and put ${subject} there.`;
  }

  match = text.match(/^(.+?) sits opposite (.+?)\.$/i);
  if (match) {
    const [, subject, opposite] = match;
    return `Put ${subject} directly opposite ${opposite}.`;
  }

  match = text.match(/^(.+?) sits at the seat nearest the (entrance|stage|door)\.$/i);
  if (match) {
    const [, subject, place] = match;
    return `Put ${subject} in the seat nearest the ${place?.toLowerCase()}. Start the circle from this fixed seat.`;
  }

  match = text.match(/^(.+?) faces (north|south|the centre|centre|outward)\.$/i);
  if (match) {
    const [, subject, facing] = match;
    return `Draw ${subject}'s arrow facing ${facing?.toLowerCase()}. Keep this arrow in mind whenever a left/right clue uses ${subject}.`;
  }

  match = text.match(/^(.+?) face the centre; (.+?) face outward\.$/i);
  if (match) {
    const [, centreGroup, outwardGroup] = match;
    return `Mark ${centreGroup} facing the centre and ${outwardGroup} facing outward. Do this before using the left/right clues.`;
  }

  match = text.match(/^(.+?) and (.+?) face the same direction\.$/i);
  if (match) {
    const [, first, second] = match;
    return `${first} and ${second} face the same way. As soon as one person's facing is known, mark the other the same way.`;
  }

  match = text.match(/^(.+?) and (.+?) face opposite directions\.$/i);
  if (match) {
    const [, first, second] = match;
    return `${first} and ${second} face opposite ways. As soon as one person's facing is known, mark the other the opposite way.`;
  }

  match = text.match(/^If (.+?), (.+?); otherwise (.+?)\.$/i);
  if (match) {
    const [, condition, whenTrue, whenFalse] = match;
    return `Do not guess this yet. If "${condition}" is true, use "${whenTrue}". If it is not true, use "${whenFalse}". Another clue will tell us which one applies.`;
  }

  return "Put this clue on the drawing in the simplest possible way, and check it again after the other seats are filled.";
}

function detailedClueLines(clues: readonly TeachingTraceClue[], offset = 0): string[] {
  return clues.flatMap((clue, index) => [
    `Step ${offset + index + 1}: ${clue.text}`,
    `So: ${studentClueAction(clue.text)}`,
  ]);
}

function directExplanation(input: TeachingTraceInput): string {
  return [
    ...input.intro,
    "Now take the clues one by one:",
    ...detailedClueLines(input.clues),
    "After all the clues are used, only one arrangement fits.",
    input.finalHeading ?? "Final arrangement:",
    input.finalModel.display,
  ].join("\n\n");
}

function physicalDirection(relative: "left" | "right", facing: "north" | "south"): "left" | "right" {
  if (facing === "north") return relative;
  return relative === "left" ? "right" : "left";
}

function compileEndFacingInference(input: TeachingTraceInput): string | null {
  if (!input.intro.some((line) => /not everyone faces the same way/i.test(line))) return null;

  for (let endIndex = 0; endIndex < input.clues.length; endIndex += 1) {
    const endText = input.clues[endIndex]?.text ?? "";
    const endMatch = endText.match(/^(.+?) sits at the extreme (left|right) end\.$/i);
    if (!endMatch) continue;
    const person = endMatch[1]?.trim();
    const end = endMatch[2]?.toLowerCase() as "left" | "right" | undefined;
    if (!person || !end) continue;

    const facingAlreadyStated = input.clues.some((clue, index) =>
      index <= endIndex && new RegExp(`^${person.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} faces (?:north|south)\\.$`, "i").test(clue.text));
    if (facingAlreadyStated) continue;

    for (let relativeIndex = endIndex + 1; relativeIndex < input.clues.length; relativeIndex += 1) {
      const relativeText = input.clues[relativeIndex]?.text ?? "";
      const relativeMatch = relativeText.match(/^(.+?) sits immediately to the (left|right) of (.+?)\.$/i);
      if (!relativeMatch) continue;
      const subject = relativeMatch[1]?.trim();
      const relative = relativeMatch[2]?.toLowerCase() as "left" | "right" | undefined;
      const relativePerson = relativeMatch[3]?.trim();
      if (!subject || !relative || relativePerson !== person) continue;

      const northSide = physicalDirection(relative, "north");
      const southSide = physicalDirection(relative, "south");
      const northImpossible = (end === "left" && northSide === "left") || (end === "right" && northSide === "right");
      const southImpossible = (end === "left" && southSide === "left") || (end === "right" && southSide === "right");
      if (northImpossible === southImpossible) continue;

      const wrongFacing = northImpossible ? "north" : "south";
      const rightFacing = northImpossible ? "south" : "north";
      const wrongSide = northImpossible ? northSide : southSide;
      const rightSide = northImpossible ? southSide : northSide;
      const wrongCase = northImpossible ? 1 : 2;
      const rightCase = northImpossible ? 2 : 1;
      const lines = [...input.intro];
      lines.push(`Start with clue ${endIndex + 1}: ${endText}`);
      lines.push(`We do not yet know which way ${person} faces, so try both:`);
      lines.push(`Case 1: ${person} faces north.`);
      lines.push(`Case 2: ${person} faces south.`);
      lines.push(`Now use clue ${relativeIndex + 1}: ${relativeText}`);
      lines.push(`Case ${wrongCase} ❌ — if ${person} faces ${wrongFacing}, ${person}'s ${relative} is towards our ${wrongSide}. From the ${end} end, ${subject} would fall outside the row. So this case is wrong.`);
      lines.push(`Case ${rightCase} ✅ — if ${person} faces ${rightFacing}, ${person}'s ${relative} is towards our ${rightSide}. ${subject} can sit in the next seat inside the row.`);
      lines.push(`So ${person} must face ${rightFacing}.`);
      const remaining = input.clues
        .map((clue, index) => ({ clue, index }))
        .filter(({ index }) => index !== endIndex && index !== relativeIndex);
      if (remaining.length > 0) {
        lines.push("Now fill the rest of the row:");
        for (const { clue, index } of remaining) {
          lines.push(`Clue ${index + 1}: ${clue.text}`);
          lines.push(`So: ${studentClueAction(clue.text)}`);
        }
      }
      lines.push(input.finalHeading ?? "Final arrangement:");
      lines.push(input.finalModel.display);
      return lines.join("\n\n");
    }
  }
  return null;
}

export function compileCaseEliminationExplanation(input: TeachingTraceInput): string {
  if (input.clues.length === 0) {
    return [...input.intro, input.finalHeading ?? "Final arrangement:", input.finalModel.display].join("\n\n");
  }

  const inferredFacing = compileEndFacingInference(input);
  if (inferredFacing) return inferredFacing;

  const lastBranchablePrefix = Math.max(1, input.clues.length - 1);
  let branchPrefix = 0;
  let branchModels: TeachingCaseModel[] = [];

  for (let clueCount = 1; clueCount <= lastBranchablePrefix; clueCount += 1) {
    const models = uniqueModels(input.enumeratePrefix(clueCount, 4));
    if (models.length >= 2 && models.length <= 3) {
      branchPrefix = clueCount;
      branchModels = models;
      break;
    }
  }

  if (branchPrefix === 0 || branchModels.length < 2) return directExplanation(input);
  if (!branchModels.some((model) => model.key === input.finalModel.key)) return directExplanation(input);

  const lines: string[] = [...input.intro];
  lines.push(branchPrefix === 1 ? "Start with this clue:" : `Start by using clues 1 to ${branchPrefix}:`);
  for (let index = 0; index < branchPrefix; index += 1) {
    const clue = input.clues[index];
    if (!clue) continue;
    lines.push(`${index + 1}. ${clue.text}`);
    lines.push(`So: ${studentClueAction(clue.text)}`);
  }
  lines.push(`At this point, there are ${branchModels.length} possible ways:`);
  lines.push(caseLines(branchModels).join("\n"));

  let activeKeys = new Set(branchModels.map((model) => model.key));
  const shownLaterClues = new Set<number>();

  for (let clueCount = branchPrefix + 1; clueCount <= input.clues.length && activeKeys.size > 1; clueCount += 1) {
    const prefixModels = uniqueModels(input.enumeratePrefix(clueCount, 4));
    if (prefixModels.length >= 4) continue;
    const survivingKeys = new Set(prefixModels.map((model) => model.key));
    const removed = branchModels.filter((model) => activeKeys.has(model.key) && !survivingKeys.has(model.key));
    if (removed.length === 0) continue;

    shownLaterClues.add(clueCount - 1);
    const clue = input.clues[clueCount - 1];
    if (!clue) continue;
    lines.push(`Now use clue ${clueCount}: ${clue.text}`);
    lines.push(`So: ${studentClueAction(clue.text)}`);
    for (const model of branchModels) {
      if (!activeKeys.has(model.key)) continue;
      const caseNumber = branchModels.findIndex((candidate) => candidate.key === model.key) + 1;
      lines.push(survivingKeys.has(model.key)
        ? `Case ${caseNumber} ✅ — this clue works here.`
        : `Case ${caseNumber} ❌ — this clue does not fit, so this case is wrong.`);
    }
    activeKeys = new Set([...activeKeys].filter((key) => survivingKeys.has(key)));
  }

  const finalCaseIndex = branchModels.findIndex((model) => model.key === input.finalModel.key);
  if (activeKeys.size === 1 && finalCaseIndex >= 0 && activeKeys.has(input.finalModel.key)) {
    lines.push(`Only Case ${finalCaseIndex + 1} is left. Keep it and fill the empty seats.`);
  } else {
    return directExplanation(input);
  }

  const laterClues = input.clues
    .map((clue, index) => ({ clue, index }))
    .filter(({ index }) => index >= branchPrefix && !shownLaterClues.has(index));
  if (laterClues.length > 0) {
    lines.push("Now use the clues not used yet:");
    for (const { clue, index } of laterClues) {
      lines.push(`Clue ${index + 1}: ${clue.text}`);
      lines.push(`So: ${studentClueAction(clue.text)}`);
    }
  }

  lines.push(input.finalHeading ?? "Final arrangement:");
  lines.push(input.finalModel.display);
  return lines.join("\n\n");
}
