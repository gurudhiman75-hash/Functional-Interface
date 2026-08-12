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

/**
 * Convert a clue into a small student action. The explanation should tell the
 * learner what to mark on the sketch, not merely repeat the clue or ask them to
 * "use the remaining clues" on their own.
 */
export function studentClueAction(text: string): string {
  let match = text.match(/^(.+?) sits immediately (clockwise|anticlockwise) from (.+?)\.$/i);
  if (match) {
    const [, subject, direction, reference] = match;
    return `Place ${subject} in the next seat ${direction?.toLowerCase()} from ${reference}.`;
  }

  match = text.match(/^Exactly (\d+) person(?:s)? sit(?:s)? between (.+?) and (.+?) when counted (clockwise|anticlockwise) from (.+?)\.$/i);
  if (match) {
    const gap = Number(match[1]);
    const first = match[2];
    const second = match[3];
    const direction = match[4]?.toLowerCase();
    const reference = match[5];
    const target = reference === first ? second : first;
    const distance = gap + 1;
    return `Starting from ${reference}, move ${numberWord(distance)} seat${distance === 1 ? "" : "s"} ${direction}; ${target} must occupy that seat. This leaves exactly ${numberWord(gap)} person${gap === 1 ? "" : "s"} in between.`;
  }

  match = text.match(/^(.+?) does not sit adjacent to (.+?)\.$/i);
  if (match) {
    const [, first, second] = match;
    return `${first} and ${second} cannot be neighbours. If either one is already placed, cross out both seats beside that person for the other.`;
  }

  match = text.match(/^(.+?) sits adjacent to (.+?)\.$/i);
  if (match) {
    const [, subject, reference] = match;
    return `Keep ${subject} in one of the two neighbouring seats of ${reference}. Do not choose the side yet unless another clue fixes it.`;
  }

  match = text.match(/^(.+?) sits (immediately|first|second|third|fourth|fifth|sixth|seventh|eighth|\d+(?:st|nd|rd|th)) to the (left|right) of (.+?)\.$/i);
  if (match) {
    const [, subject, distance, side, reference] = match;
    const stepText = distance?.toLowerCase() === "immediately" || distance?.toLowerCase() === "first"
      ? "one seat"
      : `${distance?.toLowerCase()} seat`;
    return `Use ${reference} as the reference person. Move ${stepText} to ${reference}'s ${side?.toLowerCase()} and place ${subject} there. First convert left/right according to ${reference}'s facing.`;
  }

  match = text.match(/^(.+?) sits at the extreme (left|right) end\.$/i);
  if (match) {
    const [, subject, side] = match;
    return `Fix ${subject} at the extreme ${side?.toLowerCase()} seat first; this gives you a strong anchor for the remaining placements.`;
  }

  match = text.match(/^(.+?) faces (north|south|the centre|centre|outward)\.$/i);
  if (match) {
    const [, subject, facing] = match;
    return `Mark ${subject}'s facing as ${facing?.toLowerCase()} before using any left/right clue that refers to ${subject}.`;
  }

  match = text.match(/^(.+?) and (.+?) face the same direction\.$/i);
  if (match) {
    const [, first, second] = match;
    return `Give ${first} and ${second} the same facing. Once either facing is known, copy it to the other person.`;
  }

  match = text.match(/^(.+?) and (.+?) face opposite directions\.$/i);
  if (match) {
    const [, first, second] = match;
    return `Give ${first} and ${second} opposite facings. Once either facing is known, the other person's facing is fixed automatically.`;
  }

  match = text.match(/^If (.+?), (.+?); otherwise (.+?)\.$/i);
  if (match) {
    const [, condition, whenTrue, whenFalse] = match;
    return `Keep the condition "${condition}" open for now. If it becomes true, use "${whenTrue}"; if not, use "${whenFalse}". Do not choose a branch without a supporting clue.`;
  }

  return "Translate this clue onto the sketch as a restriction. Keep any still-possible seat open until a later clue rules it in or out.";
}

function detailedClueLines(clues: readonly TeachingTraceClue[], offset = 0): string[] {
  return clues.flatMap((clue, index) => [
    `Step ${offset + index + 1}: ${clue.text}`,
    `What this tells us: ${studentClueAction(clue.text)}`,
  ]);
}

function directExplanation(input: TeachingTraceInput): string {
  return [
    ...input.intro,
    "Work through the clues one at a time:",
    ...detailedClueLines(input.clues),
    "After carrying these placements and restrictions forward, only one complete arrangement remains.",
    input.finalHeading ?? "Final arrangement:",
    input.finalModel.display,
  ].join("\n\n");
}

function physicalDirection(relative: "left" | "right", facing: "north" | "south"): "left" | "right" {
  if (facing === "north") return relative;
  return relative === "left" ? "right" : "left";
}

/**
 * Mixed-facing exam questions often infer an unstated facing from an end seat.
 * Example: X is at the extreme left; Y is immediately left of X. If X faced
 * north, Y would fall outside the row, so X must face south. A complete-model
 * enumerator can miss this as a useful teaching branch because many other seats
 * are still free. Detect and explain this local two-case inference explicitly.
 */
function compileEndFacingInference(input: TeachingTraceInput): string | null {
  if (!input.intro.some((line) => /reference person's facing/i.test(line))) return null;

  for (let endIndex = 0; endIndex < input.clues.length; endIndex += 1) {
    const endText = input.clues[endIndex]?.text ?? "";
    const endMatch = endText.match(/^(.+?) sits at the extreme (left|right) end\.$/i);
    if (!endMatch) continue;
    const reference = endMatch[1]?.trim();
    const end = endMatch[2]?.toLowerCase() as "left" | "right" | undefined;
    if (!reference || !end) continue;

    const facingAlreadyStated = input.clues.some((clue, index) =>
      index <= endIndex && new RegExp(`^${reference.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} faces (?:north|south)\\.$`, "i").test(clue.text));
    if (facingAlreadyStated) continue;

    for (let relativeIndex = endIndex + 1; relativeIndex < input.clues.length; relativeIndex += 1) {
      const relativeText = input.clues[relativeIndex]?.text ?? "";
      const relativeMatch = relativeText.match(/^(.+?) sits immediately to the (left|right) of (.+?)\.$/i);
      if (!relativeMatch) continue;
      const subject = relativeMatch[1]?.trim();
      const relative = relativeMatch[2]?.toLowerCase() as "left" | "right" | undefined;
      const relativeReference = relativeMatch[3]?.trim();
      if (!subject || !relative || relativeReference !== reference) continue;

      const northPhysical = physicalDirection(relative, "north");
      const southPhysical = physicalDirection(relative, "south");
      const northImpossible = (end === "left" && northPhysical === "left") || (end === "right" && northPhysical === "right");
      const southImpossible = (end === "left" && southPhysical === "left") || (end === "right" && southPhysical === "right");
      if (northImpossible === southImpossible) continue;

      const impossibleFacing = northImpossible ? "north" : "south";
      const possibleFacing = northImpossible ? "south" : "north";
      const impossiblePhysical = northImpossible ? northPhysical : southPhysical;
      const possiblePhysical = northImpossible ? southPhysical : northPhysical;
      const impossibleCase = northImpossible ? 1 : 2;
      const possibleCase = northImpossible ? 2 : 1;
      const lines = [...input.intro];
      lines.push(`Start with clue ${endIndex + 1}: ${endText}`);
      lines.push(`${reference}'s facing is not stated yet, so keep both facing cases open:`);
      lines.push(`Case 1: ${reference} faces north.`);
      lines.push(`Case 2: ${reference} faces south.`);
      lines.push(`Now use clue ${relativeIndex + 1}: ${relativeText}`);
      lines.push(`Case ${impossibleCase} ❌ — cancel it because if ${reference} faces ${impossibleFacing}, ${reference}'s ${relative} is physically to our ${impossiblePhysical}. From the extreme ${end} end, that would place ${subject} outside the row.`);
      lines.push(`Case ${possibleCase} ✅ — keep it because if ${reference} faces ${possibleFacing}, ${reference}'s ${relative} is physically to our ${possiblePhysical}, so ${subject} can occupy the adjacent seat inside the row.`);
      lines.push(`Therefore, ${reference} must face ${possibleFacing}. Keep this facing fixed.`);
      const remaining = input.clues
        .map((clue, index) => ({ clue, index }))
        .filter(({ index }) => index !== endIndex && index !== relativeIndex);
      if (remaining.length > 0) {
        lines.push("Now complete the row clue by clue:");
        for (const { clue, index } of remaining) {
          lines.push(`Clue ${index + 1}: ${clue.text}`);
          lines.push(`What this tells us: ${studentClueAction(clue.text)}`);
        }
      }
      lines.push(input.finalHeading ?? "Final arrangement:");
      lines.push(input.finalModel.display);
      return lines.join("\n\n");
    }
  }
  return null;
}

/**
 * Compile verified prefix narrowing into a student-facing case/elimination trace.
 * Cases are exposed only when the enumerator proves that exactly two or three
 * complete possibilities remain. We never display arbitrary completions merely
 * because a larger search space was truncated to three examples.
 */
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
  lines.push(branchPrefix === 1 ? "Start with this clue:" : `First combine clues 1 to ${branchPrefix}:`);
  for (let index = 0; index < branchPrefix; index += 1) {
    const clue = input.clues[index];
    if (!clue) continue;
    lines.push(`${index + 1}. ${clue.text}`);
    lines.push(`What this tells us: ${studentClueAction(clue.text)}`);
  }
  lines.push(`At this stage, exactly ${branchModels.length} cases are possible:`);
  lines.push(caseLines(branchModels).join("\n"));

  let activeKeys = new Set(branchModels.map((model) => model.key));
  const shownLaterClues = new Set<number>();

  for (let clueCount = branchPrefix + 1; clueCount <= input.clues.length && activeKeys.size > 1; clueCount += 1) {
    const prefixModels = uniqueModels(input.enumeratePrefix(clueCount, 4));
    if (prefixModels.length >= 4) continue;
    const survivingKeys = new Set(prefixModels.map((model) => model.key));
    const eliminated = branchModels.filter((model) => activeKeys.has(model.key) && !survivingKeys.has(model.key));
    if (eliminated.length === 0) continue;

    shownLaterClues.add(clueCount - 1);
    const clue = input.clues[clueCount - 1];
    if (!clue) continue;
    lines.push(`Now use clue ${clueCount}: ${clue.text}`);
    lines.push(`What this tells us: ${studentClueAction(clue.text)}`);
    for (const model of branchModels) {
      if (!activeKeys.has(model.key)) continue;
      const caseNumber = branchModels.findIndex((candidate) => candidate.key === model.key) + 1;
      lines.push(survivingKeys.has(model.key)
        ? `Case ${caseNumber} ✅ — it still fits this clue.`
        : `Case ${caseNumber} ❌ — cancel it because it does not satisfy this clue.`);
    }
    activeKeys = new Set([...activeKeys].filter((key) => survivingKeys.has(key)));
  }

  const finalCaseIndex = branchModels.findIndex((model) => model.key === input.finalModel.key);
  if (activeKeys.size === 1 && finalCaseIndex >= 0 && activeKeys.has(input.finalModel.key)) {
    lines.push(`Only Case ${finalCaseIndex + 1} remains, so keep that case and finish its open seats.`);
  } else {
    return directExplanation(input);
  }

  const unshownLater = input.clues
    .map((clue, index) => ({ clue, index }))
    .filter(({ index }) => index >= branchPrefix && !shownLaterClues.has(index));
  if (unshownLater.length > 0) {
    lines.push("Finish and cross-check the surviving case with the clues not yet used:");
    for (const { clue, index } of unshownLater) {
      lines.push(`Clue ${index + 1}: ${clue.text}`);
      lines.push(`What this tells us: ${studentClueAction(clue.text)}`);
    }
  }

  lines.push(input.finalHeading ?? "Final arrangement:");
  lines.push(input.finalModel.display);
  return lines.join("\n\n");
}
