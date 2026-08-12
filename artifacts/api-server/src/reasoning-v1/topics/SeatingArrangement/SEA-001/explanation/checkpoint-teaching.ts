import { enumerateMixedFacingProduction } from "../cp002/solvers.ts";
import type { MixedFacingCaseletRecord, MixedFacingModel, MixedPersonId } from "../cp002/types.ts";
import { enumerateCircularProduction } from "../cp003/solvers.ts";
import type { CircularCaseletRecord, CircularConstraint, CircularSolverModel, PersonId } from "../cp003/types.ts";
import { enumerateOutwardProduction } from "../cp004/solvers.ts";
import type { OutwardCaseletRecord, OutwardConstraint, OutwardPersonId, OutwardSolverModel } from "../cp004/types.ts";
import { enumerateMixedCircleProduction } from "../cp005/solvers.ts";
import type { MixedCircleCaseletRecord, MixedCircleConstraint, MixedCircleModel, MixedCirclePersonId } from "../cp005/types.ts";
import type { SeatingCaseletRecord } from "../types.ts";
import { compileCaseEliminationExplanation, studentClueAction, type TeachingCaseModel } from "./teaching-trace.ts";

export type Sea001TeachingCaselet =
  | SeatingCaseletRecord
  | MixedFacingCaseletRecord
  | CircularCaseletRecord
  | OutwardCaseletRecord
  | MixedCircleCaseletRecord;

type DisplayNames = Readonly<Record<string, string>>;

function seedIndex(seed: string, count: number): number {
  let hash = 0x811c9dc5;
  for (const character of seed) hash = Math.imul(hash ^ character.charCodeAt(0), 0x01000193);
  return count === 0 ? 0 : (hash >>> 0) % count;
}

function personIdOrdinal(personId: string): number {
  const match = personId.match(/^P(\d+)$/);
  return match?.[1] ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function displayNameMap(setupText: string, personIds: readonly string[]): DisplayNames {
  const names = setupText.match(/persons—(.+?)—are sitting/i)?.[1]
    ?.split(",")
    .map((name) => name.trim())
    .filter(Boolean) ?? [];
  const identityOrder = [...new Set(personIds)].sort((left, right) => {
    const numeric = personIdOrdinal(left) - personIdOrdinal(right);
    return numeric !== 0 ? numeric : left.localeCompare(right);
  });
  return Object.fromEntries(identityOrder.map((personId, index) => [personId, names[index] ?? personId]));
}

function shown(personId: string, displayNames: DisplayNames): string {
  return displayNames[personId] ?? personId;
}

interface IndexedTeachingClue {
  readonly text: string;
  readonly index: number;
}

function clueNumberList(indices: readonly number[]): string {
  const values = [...new Set(indices)].sort((left, right) => left - right).map((index) => String(index + 1));
  if (values.length <= 1) return values[0] ?? "";
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

function linkedClockwiseGroup(remaining: readonly IndexedTeachingClue[]): string | null {
  const nextPerson = new Map<string, { readonly person: string; readonly index: number }>();
  for (const clue of remaining) {
    const match = clue.text.match(/^(.+?) sits immediately clockwise from (.+?)\.$/i);
    if (!match?.[1] || !match[2]) continue;
    nextPerson.set(match[2].trim(), { person: match[1].trim(), index: clue.index });
  }

  for (const clue of remaining) {
    const match = clue.text.match(/^Exactly (\d+) person(?:s)? sit(?:s)? between (.+?) and (.+?) when counted clockwise from (.+?)\.$/i);
    if (!match?.[1] || !match[2] || !match[3] || !match[4]) continue;
    const gap = Number(match[1]);
    const first = match[2].trim();
    const second = match[3].trim();
    const from = match[4].trim();
    const other = from === first ? second : first;
    const group = [from];
    const used = [clue.index];
    let current = from;
    let complete = true;

    for (let step = 0; step < gap; step += 1) {
      const next = nextPerson.get(current);
      if (!next || group.includes(next.person)) {
        complete = false;
        break;
      }
      group.push(next.person);
      used.push(next.index);
      current = next.person;
    }
    if (!complete) continue;
    group.push(other);

    current = other;
    while (true) {
      const next = nextPerson.get(current);
      if (!next || group.includes(next.person)) break;
      group.push(next.person);
      used.push(next.index);
      current = next.person;
    }

    if (group.length < 3 || used.length < 2) continue;
    return `Clues ${clueNumberList(used)} put these people together in this clockwise order: ${group.join(" → ")}. Write them together in your circle.`;
  }
  return null;
}

function appendRemainingTeachingSteps(
  lines: string[],
  clueTexts: readonly string[],
  alreadyUsed: ReadonlySet<number>,
): void {
  const remaining = clueTexts
    .map((text, index) => ({ text, index }))
    .filter(({ index }) => !alreadyUsed.has(index));
  if (remaining.length === 0) return;

  lines.push("Now fill the empty seats:");
  for (const { text, index } of remaining) {
    lines.push(`Clue ${index + 1}: ${text}`);
    lines.push(`So: ${studentClueAction(text)}`);
  }

  const group = linkedClockwiseGroup(remaining);
  if (group) {
    lines.push(group);
    if (remaining.some(({ text }) => /does not sit adjacent to/i.test(text))) {
      lines.push("Try this group in the empty seats. If one place makes the forbidden pair sit next to each other, that place is wrong. Use the other place.");
    }
  }

  lines.push("Keep marking the seats as you fill them. If only one seat is left for someone, put that person there.");
}

function rotateToAnchor<T extends string>(order: readonly T[], anchor?: T): T[] {
  if (!anchor || order.length === 0) return [...order];
  const index = order.indexOf(anchor);
  if (index < 0) return [...order];
  return [...order.slice(index), ...order.slice(0, index)];
}

function mixedRowModel(model: MixedFacingModel, displayNames: DisplayNames): TeachingCaseModel {
  return {
    key: model.canonicalKey,
    display: model.seatOrder
      .map((personId, index) => `${index + 1}:${shown(personId, displayNames)}${model.facings[personId] === "NORTH" ? "↑" : "↓"}`)
      .join(" | "),
  };
}

function centreCircleModel(
  model: CircularSolverModel,
  displayNames: DisplayNames,
  drawingStart?: PersonId,
): TeachingCaseModel {
  const displayed = rotateToAnchor(model.clockwiseOrder, drawingStart);
  const start = displayed[0];
  return {
    key: model.canonicalKey,
    display: `${displayed.map((personId) => shown(personId, displayNames)).join(" → ")} → ${start ? shown(start, displayNames) : "?"} (clockwise)`,
  };
}

function outwardCircleModel(
  model: OutwardSolverModel,
  displayNames: DisplayNames,
  drawingStart?: OutwardPersonId,
): TeachingCaseModel {
  const displayed = rotateToAnchor(model.clockwiseOrder, drawingStart);
  const start = displayed[0];
  return {
    key: model.canonicalKey,
    display: `${displayed.map((personId) => shown(personId, displayNames)).join(" → ")} → ${start ? shown(start, displayNames) : "?"} (clockwise, all facing outward)`,
  };
}

function mixedCircleModel(
  model: MixedCircleModel,
  displayNames: DisplayNames,
  drawingStart?: MixedCirclePersonId,
): TeachingCaseModel {
  const displayed = rotateToAnchor(model.clockwiseOrder, drawingStart);
  const start = displayed[0];
  return {
    key: model.canonicalKey,
    display: `${displayed
      .map((personId) => `${shown(personId, displayNames)}${model.facings[personId] === "CENTER" ? "↘" : "↗"}`)
      .join(" → ")} → ${start ? shown(start, displayNames) : "?"} (clockwise; ↘ centre, ↗ outward)`,
  };
}

function personsFromMixedKey(key: string): MixedPersonId[] {
  const orderPart = key.split("|")[0] ?? "";
  return orderPart.split(">").filter(Boolean) as MixedPersonId[];
}

function personsFromCircularKey(key: string): PersonId[] {
  return key.split("|").filter(Boolean) as PersonId[];
}

function personsFromOutwardKey(key: string): OutwardPersonId[] {
  return key.split("|").filter(Boolean) as OutwardPersonId[];
}

function personsFromMixedCircleKey(key: string): MixedCirclePersonId[] {
  const orderPart = key.split("|")[0] ?? "";
  return orderPart.split(">").filter(Boolean) as MixedCirclePersonId[];
}

function compileCp002(caselet: MixedFacingCaseletRecord): string {
  const finalKey = caselet.solverOracleAgreement.productionKeys[0];
  if (!finalKey) return caselet.sharedExplanation;
  const persons = personsFromMixedKey(finalKey);
  const displayNames = displayNameMap(caselet.setupText, persons);
  const finalModel = enumerateMixedFacingProduction({ persons, constraints: caselet.constraints, maxModels: 2 })[0];
  if (!finalModel) return caselet.sharedExplanation;

  return compileCaseEliminationExplanation({
    intro: [
      "Number the seats 1, 2, 3... from left to right.",
      "Not everyone faces the same way. For a left/right clue, first see which way the person after 'of' is facing. If that person faces north, left is our left. If that person faces south, left is our right.",
      "If two or three places are possible, keep them for a moment. A later clue will decide the correct one.",
    ],
    clues: caselet.clueTexts.map((text) => ({ text })),
    enumeratePrefix: (clueCount, maxModels) => enumerateMixedFacingProduction({
      persons,
      constraints: caselet.constraints.slice(0, clueCount),
      maxModels,
    }).map((model) => mixedRowModel(model, displayNames)),
    finalModel: mixedRowModel(finalModel, displayNames),
    finalHeading: "So the final row is:",
  });
}

function compileCentreAdjacencyCases(
  caselet: CircularCaseletRecord,
  persons: readonly PersonId[],
  displayNames: DisplayNames,
  landmarkAnchored: boolean,
  finalModel: CircularSolverModel,
  drawingStart: PersonId,
  intro: readonly string[],
): string | null {
  for (let startIndex = 0; startIndex < caselet.constraints.length; startIndex += 1) {
    const clueConstraint = caselet.constraints[startIndex];
    if (!clueConstraint || clueConstraint.kind !== "ADJACENT") continue;

    const assumptions: CircularConstraint[] = [
      { id: `SEA-TEACH-CP003-CW-${clueConstraint.id}`, kind: "CYCLIC_POSITION", referenceId: clueConstraint.firstId, subjectId: clueConstraint.secondId, direction: "CLOCKWISE", steps: 1 },
      { id: `SEA-TEACH-CP003-ACW-${clueConstraint.id}`, kind: "CYCLIC_POSITION", referenceId: clueConstraint.firstId, subjectId: clueConstraint.secondId, direction: "ANTICLOCKWISE", steps: 1 },
    ];
    const works = (throughIndex: number, assumption: CircularConstraint): boolean => enumerateCircularProduction({
      persons,
      constraints: [...caselet.constraints.slice(0, throughIndex + 1), assumption],
      landmarkAnchored,
      maxModels: 1,
    }).length > 0;

    let possible = assumptions.map((assumption, originalIndex) => ({ assumption, originalIndex }))
      .filter(({ assumption }) => works(startIndex, assumption));
    if (possible.length !== 2) continue;

    const decidingSteps: Array<{ clueIndex: number; possible: typeof possible }> = [];
    for (let clueIndex = startIndex + 1; clueIndex < caselet.constraints.length && possible.length > 1; clueIndex += 1) {
      const after = possible.filter(({ assumption }) => works(clueIndex, assumption));
      if (after.length === 0 || after.length === possible.length) continue;
      possible = after;
      decidingSteps.push({ clueIndex, possible });
    }
    if (possible.length !== 1 || decidingSteps.length === 0) continue;

    const first = shown(clueConstraint.firstId, displayNames);
    const second = shown(clueConstraint.secondId, displayNames);
    const lines = [...intro];
    lines.push(`Start with clue ${startIndex + 1}: ${caselet.clueTexts[startIndex]}`);
    lines.push("This clue only says that the two people sit together, so try both orders around the circle:");
    lines.push(`Case 1: ${first} → ${second} clockwise.`);
    lines.push(`Case 2: ${second} → ${first} clockwise.`);

    let live = new Set([0, 1]);
    for (const step of decidingSteps) {
      const next = new Set(step.possible.map((entry) => entry.originalIndex));
      lines.push(`Now use clue ${step.clueIndex + 1}: ${caselet.clueTexts[step.clueIndex]}`);
      lines.push(`So: ${studentClueAction(caselet.clueTexts[step.clueIndex] ?? "")}`);
      for (const caseIndex of [...live]) {
        lines.push(next.has(caseIndex)
          ? `Case ${caseIndex + 1} ✅ — this clue works here.`
          : `Case ${caseIndex + 1} ❌ — this clue does not fit, so this case is wrong.`);
      }
      live = next;
    }

    lines.push(`Only Case ${[...live][0]! + 1} is left. Keep it and fill the empty seats.`);
    appendRemainingTeachingSteps(lines, caselet.clueTexts, new Set([startIndex, ...decidingSteps.map((step) => step.clueIndex)]));
    lines.push("So the final clockwise order is:");
    lines.push(centreCircleModel(finalModel, displayNames, drawingStart).display);
    return lines.join("\n\n");
  }
  return null;
}

function compileCp003(caselet: CircularCaseletRecord): string {
  const finalKey = caselet.solverOracleAgreement.productionKeys[0];
  if (!finalKey) return caselet.sharedExplanation;
  const persons = personsFromCircularKey(finalKey);
  const displayNames = displayNameMap(caselet.setupText, persons);
  const landmarkAnchored = caselet.topologySnapshot.landmark !== undefined;
  const finalModel = enumerateCircularProduction({ persons, constraints: caselet.constraints, landmarkAnchored, maxModels: 2 })[0];
  if (!finalModel) return caselet.sharedExplanation;
  const landmark = caselet.topologySnapshot.landmark?.id.toLowerCase();
  const drawingStart = landmarkAnchored
    ? finalModel.clockwiseOrder[0] as PersonId
    : finalModel.clockwiseOrder[seedIndex(caselet.seed, finalModel.clockwiseOrder.length)] as PersonId;

  const intro = [
    landmark
      ? `Start the circle from the seat shown nearest the ${landmark}.`
      : `Put ${shown(drawingStart, displayNames)} anywhere to start your circle. Turning the whole circle does not make a new answer.`,
    "Everyone faces the centre. So left means clockwise and right means anticlockwise.",
    "If two or three ways are possible, keep them for a moment. A later clue will show which one is correct.",
  ];

  const adjacencyTeaching = compileCentreAdjacencyCases(caselet, persons, displayNames, landmarkAnchored, finalModel, drawingStart, intro);
  if (adjacencyTeaching) return adjacencyTeaching;

  return compileCaseEliminationExplanation({
    intro,
    clues: caselet.clueTexts.map((text) => ({ text })),
    enumeratePrefix: (clueCount, maxModels) => enumerateCircularProduction({
      persons,
      constraints: caselet.constraints.slice(0, clueCount),
      landmarkAnchored,
      maxModels,
    }).map((model) => centreCircleModel(model, displayNames, drawingStart)),
    finalModel: centreCircleModel(finalModel, displayNames, drawingStart),
    finalHeading: "So the final clockwise order is:",
  });
}

function compileOutwardAdjacencyCases(
  caselet: OutwardCaseletRecord,
  persons: readonly OutwardPersonId[],
  displayNames: DisplayNames,
  landmarkAnchored: boolean,
  finalModel: OutwardSolverModel,
  drawingStart: OutwardPersonId,
  intro: readonly string[],
): string | null {
  for (let startIndex = 0; startIndex < caselet.constraints.length; startIndex += 1) {
    const clueConstraint = caselet.constraints[startIndex];
    if (!clueConstraint || clueConstraint.kind !== "ADJACENT") continue;

    const assumptions: OutwardConstraint[] = [
      { id: `SEA-TEACH-CP004-CW-${clueConstraint.id}`, kind: "CYCLIC_POSITION", referenceId: clueConstraint.firstId, subjectId: clueConstraint.secondId, direction: "CLOCKWISE", steps: 1 },
      { id: `SEA-TEACH-CP004-ACW-${clueConstraint.id}`, kind: "CYCLIC_POSITION", referenceId: clueConstraint.firstId, subjectId: clueConstraint.secondId, direction: "ANTICLOCKWISE", steps: 1 },
    ];
    const works = (throughIndex: number, assumption: OutwardConstraint): boolean => enumerateOutwardProduction({
      persons,
      constraints: [...caselet.constraints.slice(0, throughIndex + 1), assumption],
      landmarkAnchored,
      maxModels: 1,
    }).length > 0;

    let possible = assumptions.map((assumption, originalIndex) => ({ assumption, originalIndex }))
      .filter(({ assumption }) => works(startIndex, assumption));
    if (possible.length !== 2) continue;

    const decidingSteps: Array<{ clueIndex: number; possible: typeof possible }> = [];
    for (let clueIndex = startIndex + 1; clueIndex < caselet.constraints.length && possible.length > 1; clueIndex += 1) {
      const after = possible.filter(({ assumption }) => works(clueIndex, assumption));
      if (after.length === 0 || after.length === possible.length) continue;
      possible = after;
      decidingSteps.push({ clueIndex, possible });
    }
    if (possible.length !== 1 || decidingSteps.length === 0) continue;

    const first = shown(clueConstraint.firstId, displayNames);
    const second = shown(clueConstraint.secondId, displayNames);
    const lines = [...intro];
    lines.push(`Start with clue ${startIndex + 1}: ${caselet.clueTexts[startIndex]}`);
    lines.push("This clue only says that the two people sit together, so try both orders around the circle:");
    lines.push(`Case 1: ${first} → ${second} clockwise.`);
    lines.push(`Case 2: ${second} → ${first} clockwise.`);

    let live = new Set([0, 1]);
    for (const step of decidingSteps) {
      const next = new Set(step.possible.map((entry) => entry.originalIndex));
      lines.push(`Now use clue ${step.clueIndex + 1}: ${caselet.clueTexts[step.clueIndex]}`);
      lines.push(`So: ${studentClueAction(caselet.clueTexts[step.clueIndex] ?? "")}`);
      for (const caseIndex of [...live]) {
        lines.push(next.has(caseIndex)
          ? `Case ${caseIndex + 1} ✅ — this clue works here.`
          : `Case ${caseIndex + 1} ❌ — this clue does not fit, so this case is wrong.`);
      }
      live = next;
    }

    lines.push(`Only Case ${[...live][0]! + 1} is left. Keep it and fill the empty seats.`);
    appendRemainingTeachingSteps(lines, caselet.clueTexts, new Set([startIndex, ...decidingSteps.map((step) => step.clueIndex)]));
    lines.push("So the final clockwise order is:");
    lines.push(outwardCircleModel(finalModel, displayNames, drawingStart).display);
    return lines.join("\n\n");
  }
  return null;
}

function compileCp004(caselet: OutwardCaseletRecord): string {
  const finalKey = caselet.solverOracleAgreement.productionKeys[0];
  if (!finalKey) return caselet.sharedExplanation;
  const persons = personsFromOutwardKey(finalKey);
  const displayNames = displayNameMap(caselet.setupText, persons);
  const landmarkAnchored = caselet.topologySnapshot.landmark !== undefined;
  const finalModel = enumerateOutwardProduction({ persons, constraints: caselet.constraints, landmarkAnchored, maxModels: 2 })[0];
  if (!finalModel) return caselet.sharedExplanation;
  const landmark = caselet.topologySnapshot.landmark?.id.toLowerCase();
  const drawingStart = landmarkAnchored
    ? finalModel.clockwiseOrder[0] as OutwardPersonId
    : finalModel.clockwiseOrder[seedIndex(caselet.seed, finalModel.clockwiseOrder.length)] as OutwardPersonId;

  const intro = [
    landmark
      ? `Start the circle from the seat shown nearest the ${landmark}.`
      : `Put ${shown(drawingStart, displayNames)} anywhere to start your circle. Turning the whole circle does not make a new answer.`,
    "Everyone faces outward. So left means anticlockwise and right means clockwise.",
    "If two or three ways are possible, keep them for a moment. A later clue will show which one is correct.",
  ];

  const adjacencyTeaching = compileOutwardAdjacencyCases(caselet, persons, displayNames, landmarkAnchored, finalModel, drawingStart, intro);
  if (adjacencyTeaching) return adjacencyTeaching;

  return compileCaseEliminationExplanation({
    intro,
    clues: caselet.clueTexts.map((text) => ({ text })),
    enumeratePrefix: (clueCount, maxModels) => enumerateOutwardProduction({
      persons,
      constraints: caselet.constraints.slice(0, clueCount),
      landmarkAnchored,
      maxModels,
    }).map((model) => outwardCircleModel(model, displayNames, drawingStart)),
    finalModel: outwardCircleModel(finalModel, displayNames, drawingStart),
    finalHeading: "So the final clockwise order is:",
  });
}

function cp005ConstraintsForVisiblePrefix(
  caselet: MixedCircleCaseletRecord,
  visibleClueCount: number,
): readonly MixedCircleConstraint[] {
  const facing = caselet.constraints.filter((constraint) => constraint.kind === "FACING");
  const groupedFacing = facing.length > 1 && caselet.clueTexts.length === caselet.constraints.length - facing.length + 1;
  if (!groupedFacing) return caselet.constraints.slice(0, visibleClueCount);
  if (visibleClueCount <= 0) return [];
  const nonFacing = caselet.constraints.filter((constraint) => constraint.kind !== "FACING");
  return [...facing, ...nonFacing.slice(0, visibleClueCount - 1)];
}

function compileCp005(caselet: MixedCircleCaseletRecord): string {
  const finalKey = caselet.solverOracleAgreement.productionKeys[0];
  if (!finalKey) return caselet.sharedExplanation;
  const persons = personsFromMixedCircleKey(finalKey);
  const displayNames = displayNameMap(caselet.setupText, persons);
  const finalModel = enumerateMixedCircleProduction({ persons, constraints: caselet.constraints, maxModels: 2 })[0];
  if (!finalModel) return caselet.sharedExplanation;
  const drawingStart = finalModel.clockwiseOrder[seedIndex(caselet.seed, finalModel.clockwiseOrder.length)] as MixedCirclePersonId;

  return compileCaseEliminationExplanation({
    intro: [
      `Put ${shown(drawingStart, displayNames)} anywhere to start your circle. Turning the whole circle does not make a new answer.`,
      "For every left/right clue, first see whether that person faces the centre or outward. If the person faces the centre, left means clockwise. If the person faces outward, left means anticlockwise.",
      caselet.blueprintAuthorityId === "SEA-PBA-020"
        ? "For an if/otherwise clue, do not guess. Keep both possibilities until another clue tells us which one is true."
        : "If a clue gives two possible ways, keep both for a moment. As soon as a later clue does not fit one case, cross that case out.",
    ],
    clues: caselet.clueTexts.map((text) => ({ text })),
    enumeratePrefix: (clueCount, maxModels) => enumerateMixedCircleProduction({
      persons,
      constraints: cp005ConstraintsForVisiblePrefix(caselet, clueCount),
      maxModels,
    }).map((model) => mixedCircleModel(model, displayNames, drawingStart)),
    finalModel: mixedCircleModel(finalModel, displayNames, drawingStart),
    finalHeading: "So the final circle is:",
  });
}

export function compileSea001TeachingExplanation(caselet: Sea001TeachingCaselet): string {
  switch (caselet.checkpointId) {
    case "SEA-CP-001":
      return caselet.sharedExplanation;
    case "SEA-CP-002":
      return compileCp002(caselet);
    case "SEA-CP-003":
      return compileCp003(caselet);
    case "SEA-CP-004":
      return compileCp004(caselet);
    case "SEA-CP-005":
      return compileCp005(caselet);
  }
}

export function compileSea001TeachingExplanationFromUnknown(value: unknown): string {
  return compileSea001TeachingExplanation(value as Sea001TeachingCaselet);
}
