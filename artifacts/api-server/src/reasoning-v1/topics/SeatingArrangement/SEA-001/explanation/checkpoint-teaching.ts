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

function appendRemainingTeachingSteps(
  lines: string[],
  clueTexts: readonly string[],
  alreadyUsed: ReadonlySet<number>,
): void {
  const remaining = clueTexts
    .map((text, index) => ({ text, index }))
    .filter(({ index }) => !alreadyUsed.has(index));
  if (remaining.length === 0) return;
  lines.push("Now complete the surviving case clue by clue:");
  for (const { text, index } of remaining) {
    lines.push(`Clue ${index + 1}: ${text}`);
    lines.push(`What this tells us: ${studentClueAction(text)}`);
  }
  lines.push("As each person is placed, cross out occupied or forbidden seats. If only one legal seat remains for a person, place that person there before moving on.");
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
  drawingAnchor?: PersonId,
): TeachingCaseModel {
  const displayed = rotateToAnchor(model.clockwiseOrder, drawingAnchor);
  const start = displayed[0];
  return {
    key: model.canonicalKey,
    display: `${displayed.map((personId) => shown(personId, displayNames)).join(" → ")} → ${start ? shown(start, displayNames) : "?"} (clockwise)`,
  };
}

function outwardCircleModel(
  model: OutwardSolverModel,
  displayNames: DisplayNames,
  drawingAnchor?: OutwardPersonId,
): TeachingCaseModel {
  const displayed = rotateToAnchor(model.clockwiseOrder, drawingAnchor);
  const start = displayed[0];
  return {
    key: model.canonicalKey,
    display: `${displayed.map((personId) => shown(personId, displayNames)).join(" → ")} → ${start ? shown(start, displayNames) : "?"} (clockwise, all facing outward)`,
  };
}

function mixedCircleModel(
  model: MixedCircleModel,
  displayNames: DisplayNames,
  drawingAnchor?: MixedCirclePersonId,
): TeachingCaseModel {
  const displayed = rotateToAnchor(model.clockwiseOrder, drawingAnchor);
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
      "Number the seats from left to right.",
      "For a left/right clue, look at the reference person's facing first. A north-facing person's left is towards our left; a south-facing person's left is towards our right.",
      "If a clue still permits two or three meaningful placements, keep those cases open instead of guessing a seat.",
    ],
    clues: caselet.clueTexts.map((text) => ({ text })),
    enumeratePrefix: (clueCount, maxModels) => enumerateMixedFacingProduction({
      persons,
      constraints: caselet.constraints.slice(0, clueCount),
      maxModels,
    }).map((model) => mixedRowModel(model, displayNames)),
    finalModel: mixedRowModel(finalModel, displayNames),
    finalHeading: "Therefore, the final row and facing pattern are:",
  });
}

function compileCentreAdjacencyCases(
  caselet: CircularCaseletRecord,
  persons: readonly PersonId[],
  displayNames: DisplayNames,
  landmarkAnchored: boolean,
  finalModel: CircularSolverModel,
  drawingAnchor: PersonId,
  intro: readonly string[],
): string | null {
  for (let branchIndex = 0; branchIndex < caselet.constraints.length; branchIndex += 1) {
    const branch = caselet.constraints[branchIndex];
    if (!branch || branch.kind !== "ADJACENT") continue;
    const assumptions: CircularConstraint[] = [
      { id: `SEA-TEACH-CP003-CW-${branch.id}`, kind: "CYCLIC_POSITION", referenceId: branch.firstId, subjectId: branch.secondId, direction: "CLOCKWISE", steps: 1 },
      { id: `SEA-TEACH-CP003-ACW-${branch.id}`, kind: "CYCLIC_POSITION", referenceId: branch.firstId, subjectId: branch.secondId, direction: "ANTICLOCKWISE", steps: 1 },
    ];
    const survives = (throughIndex: number, assumption: CircularConstraint): boolean => enumerateCircularProduction({
      persons,
      constraints: [...caselet.constraints.slice(0, throughIndex + 1), assumption],
      landmarkAnchored,
      maxModels: 1,
    }).length > 0;
    let active = assumptions.map((assumption, originalIndex) => ({ assumption, originalIndex }))
      .filter(({ assumption }) => survives(branchIndex, assumption));
    if (active.length !== 2) continue;
    const steps: Array<{ clueIndex: number; active: typeof active }> = [];
    for (let clueIndex = branchIndex + 1; clueIndex < caselet.constraints.length && active.length > 1; clueIndex += 1) {
      const after = active.filter(({ assumption }) => survives(clueIndex, assumption));
      if (after.length === 0 || after.length === active.length) continue;
      active = after;
      steps.push({ clueIndex, active });
    }
    if (active.length !== 1 || steps.length === 0) continue;

    const first = shown(branch.firstId, displayNames);
    const second = shown(branch.secondId, displayNames);
    const lines = [...intro];
    lines.push(`Start with clue ${branchIndex + 1}: ${caselet.clueTexts[branchIndex]}`);
    lines.push("With the first person used only as a drawing reference, this adjacency gives two orientations:");
    lines.push(`Case 1: ${first} → ${second} clockwise.`);
    lines.push(`Case 2: ${second} → ${first} clockwise.`);
    let live = new Set([0, 1]);
    for (const step of steps) {
      const next = new Set(step.active.map((entry) => entry.originalIndex));
      lines.push(`Now use clue ${step.clueIndex + 1}: ${caselet.clueTexts[step.clueIndex]}`);
      lines.push(`What this tells us: ${studentClueAction(caselet.clueTexts[step.clueIndex] ?? "")}`);
      for (const caseIndex of [...live]) {
        lines.push(next.has(caseIndex)
          ? `Case ${caseIndex + 1} ✅ — it still satisfies the clues.`
          : `Case ${caseIndex + 1} ❌ — cancel it because this clue fixes the opposite orientation.`);
      }
      live = next;
    }
    lines.push(`Only Case ${[...live][0]! + 1} remains. Keep this orientation and finish the open seats.`);
    appendRemainingTeachingSteps(lines, caselet.clueTexts, new Set([branchIndex, ...steps.map((step) => step.clueIndex)]));
    lines.push("Therefore, the final clockwise arrangement is:");
    lines.push(centreCircleModel(finalModel, displayNames, drawingAnchor).display);
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
  const drawingAnchor = landmarkAnchored
    ? finalModel.clockwiseOrder[0] as PersonId
    : finalModel.clockwiseOrder[seedIndex(caselet.seed, finalModel.clockwiseOrder.length)] as PersonId;
  const intro = [
    landmark
      ? `Use the displayed ${landmark} as the fixed drawing reference.`
      : `Use ${shown(drawingAnchor, displayNames)} as a convenient drawing reference only. Rotating the complete arrangement does not create a different case.`,
    "Since everyone faces the centre, left is clockwise and right is anticlockwise.",
    "Keep two or three meaningful cases only when a clue genuinely leaves those alternatives open.",
  ];

  const adjacencyTeaching = compileCentreAdjacencyCases(caselet, persons, displayNames, landmarkAnchored, finalModel, drawingAnchor, intro);
  if (adjacencyTeaching) return adjacencyTeaching;

  return compileCaseEliminationExplanation({
    intro,
    clues: caselet.clueTexts.map((text) => ({ text })),
    enumeratePrefix: (clueCount, maxModels) => enumerateCircularProduction({
      persons,
      constraints: caselet.constraints.slice(0, clueCount),
      landmarkAnchored,
      maxModels,
    }).map((model) => centreCircleModel(model, displayNames, drawingAnchor)),
    finalModel: centreCircleModel(finalModel, displayNames, drawingAnchor),
    finalHeading: "Therefore, the final clockwise arrangement is:",
  });
}

function compileOutwardAdjacencyCases(
  caselet: OutwardCaseletRecord,
  persons: readonly OutwardPersonId[],
  displayNames: DisplayNames,
  landmarkAnchored: boolean,
  finalModel: OutwardSolverModel,
  drawingAnchor: OutwardPersonId,
  intro: readonly string[],
): string | null {
  for (let branchIndex = 0; branchIndex < caselet.constraints.length; branchIndex += 1) {
    const branch = caselet.constraints[branchIndex];
    if (!branch || branch.kind !== "ADJACENT") continue;
    const assumptions: OutwardConstraint[] = [
      { id: `SEA-TEACH-CP004-CW-${branch.id}`, kind: "CYCLIC_POSITION", referenceId: branch.firstId, subjectId: branch.secondId, direction: "CLOCKWISE", steps: 1 },
      { id: `SEA-TEACH-CP004-ACW-${branch.id}`, kind: "CYCLIC_POSITION", referenceId: branch.firstId, subjectId: branch.secondId, direction: "ANTICLOCKWISE", steps: 1 },
    ];
    const survives = (throughIndex: number, assumption: OutwardConstraint): boolean => enumerateOutwardProduction({
      persons,
      constraints: [...caselet.constraints.slice(0, throughIndex + 1), assumption],
      landmarkAnchored,
      maxModels: 1,
    }).length > 0;
    let active = assumptions.map((assumption, originalIndex) => ({ assumption, originalIndex }))
      .filter(({ assumption }) => survives(branchIndex, assumption));
    if (active.length !== 2) continue;
    const steps: Array<{ clueIndex: number; active: typeof active }> = [];
    for (let clueIndex = branchIndex + 1; clueIndex < caselet.constraints.length && active.length > 1; clueIndex += 1) {
      const after = active.filter(({ assumption }) => survives(clueIndex, assumption));
      if (after.length === 0 || after.length === active.length) continue;
      active = after;
      steps.push({ clueIndex, active });
    }
    if (active.length !== 1 || steps.length === 0) continue;

    const first = shown(branch.firstId, displayNames);
    const second = shown(branch.secondId, displayNames);
    const lines = [...intro];
    lines.push(`Start with clue ${branchIndex + 1}: ${caselet.clueTexts[branchIndex]}`);
    lines.push("With the first person used only as a drawing reference, this adjacency gives two orientations:");
    lines.push(`Case 1: ${first} → ${second} clockwise.`);
    lines.push(`Case 2: ${second} → ${first} clockwise.`);
    let live = new Set([0, 1]);
    for (const step of steps) {
      const next = new Set(step.active.map((entry) => entry.originalIndex));
      lines.push(`Now use clue ${step.clueIndex + 1}: ${caselet.clueTexts[step.clueIndex]}`);
      lines.push(`What this tells us: ${studentClueAction(caselet.clueTexts[step.clueIndex] ?? "")}`);
      for (const caseIndex of [...live]) {
        lines.push(next.has(caseIndex)
          ? `Case ${caseIndex + 1} ✅ — it still satisfies the clues.`
          : `Case ${caseIndex + 1} ❌ — cancel it because this clue fixes the opposite orientation.`);
      }
      live = next;
    }
    lines.push(`Only Case ${[...live][0]! + 1} remains. Keep this orientation and finish the open seats.`);
    appendRemainingTeachingSteps(lines, caselet.clueTexts, new Set([branchIndex, ...steps.map((step) => step.clueIndex)]));
    lines.push("Therefore, the final clockwise arrangement is:");
    lines.push(outwardCircleModel(finalModel, displayNames, drawingAnchor).display);
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
  const drawingAnchor = landmarkAnchored
    ? finalModel.clockwiseOrder[0] as OutwardPersonId
    : finalModel.clockwiseOrder[seedIndex(caselet.seed, finalModel.clockwiseOrder.length)] as OutwardPersonId;
  const intro = [
    landmark
      ? `Use the displayed ${landmark} as the fixed drawing reference.`
      : `Use ${shown(drawingAnchor, displayNames)} as a convenient drawing reference only. Rotating the complete arrangement does not create a different case.`,
    "Since everyone faces outward, left is anticlockwise and right is clockwise.",
    "Keep the small number of meaningful cases open until a later clue rules one out.",
  ];

  const adjacencyTeaching = compileOutwardAdjacencyCases(caselet, persons, displayNames, landmarkAnchored, finalModel, drawingAnchor, intro);
  if (adjacencyTeaching) return adjacencyTeaching;

  return compileCaseEliminationExplanation({
    intro,
    clues: caselet.clueTexts.map((text) => ({ text })),
    enumeratePrefix: (clueCount, maxModels) => enumerateOutwardProduction({
      persons,
      constraints: caselet.constraints.slice(0, clueCount),
      landmarkAnchored,
      maxModels,
    }).map((model) => outwardCircleModel(model, displayNames, drawingAnchor)),
    finalModel: outwardCircleModel(finalModel, displayNames, drawingAnchor),
    finalHeading: "Therefore, the final clockwise arrangement is:",
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
  const drawingAnchor = finalModel.clockwiseOrder[seedIndex(caselet.seed, finalModel.clockwiseOrder.length)] as MixedCirclePersonId;

  return compileCaseEliminationExplanation({
    intro: [
      `Use ${shown(drawingAnchor, displayNames)} as a convenient drawing reference only. Rotating the complete arrangement does not create a different case.`,
      "Before using a left/right clue, resolve the reference person's facing. For a centre-facing person, left is clockwise; for an outward-facing person, left is anticlockwise.",
      caselet.blueprintAuthorityId === "SEA-PBA-020"
        ? "For an if-then facing clue, keep both meaningful possibilities open only until another clue decides which condition is true."
        : "When more than one placement remains, compare only the useful cases and cancel a case as soon as a clue contradicts it.",
    ],
    clues: caselet.clueTexts.map((text) => ({ text })),
    enumeratePrefix: (clueCount, maxModels) => enumerateMixedCircleProduction({
      persons,
      constraints: cp005ConstraintsForVisiblePrefix(caselet, clueCount),
      maxModels,
    }).map((model) => mixedCircleModel(model, displayNames, drawingAnchor)),
    finalModel: mixedCircleModel(finalModel, displayNames, drawingAnchor),
    finalHeading: "Therefore, the final clockwise arrangement and facings are:",
  });
}

/**
 * Student-facing explanation compiler for the whole SEA-001 package.
 * It consumes already verified caselets and never changes their answer state,
 * options, lifecycle, clue semantics, or authority coverage.
 */
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
