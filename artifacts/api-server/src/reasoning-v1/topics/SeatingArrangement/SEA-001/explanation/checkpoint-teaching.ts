import { enumerateMixedFacingProduction } from "../cp002/solvers.ts";
import type { MixedFacingCaseletRecord, MixedFacingModel, MixedPersonId } from "../cp002/types.ts";
import { enumerateCircularProduction } from "../cp003/solvers.ts";
import type { CircularCaseletRecord, CircularSolverModel, PersonId } from "../cp003/types.ts";
import { enumerateOutwardProduction } from "../cp004/solvers.ts";
import type { OutwardCaseletRecord, OutwardPersonId, OutwardSolverModel } from "../cp004/types.ts";
import { enumerateMixedCircleProduction } from "../cp005/solvers.ts";
import type { MixedCircleCaseletRecord, MixedCircleConstraint, MixedCircleModel, MixedCirclePersonId } from "../cp005/types.ts";
import type { SeatingCaseletRecord } from "../types.ts";
import { compileCaseEliminationExplanation, type TeachingCaseModel } from "./teaching-trace.ts";

export type Sea001TeachingCaselet =
  | SeatingCaseletRecord
  | MixedFacingCaseletRecord
  | CircularCaseletRecord
  | OutwardCaseletRecord
  | MixedCircleCaseletRecord;

function mixedRowModel(model: MixedFacingModel): TeachingCaseModel {
  return {
    key: model.canonicalKey,
    display: model.seatOrder
      .map((personId, index) => `${index + 1}:${personId}${model.facings[personId] === "NORTH" ? "↑" : "↓"}`)
      .join(" | "),
  };
}

function centreCircleModel(model: CircularSolverModel): TeachingCaseModel {
  const start = model.clockwiseOrder[0] ?? "?";
  return {
    key: model.canonicalKey,
    display: `${model.clockwiseOrder.join(" → ")} → ${start} (clockwise)`,
  };
}

function outwardCircleModel(model: OutwardSolverModel): TeachingCaseModel {
  const start = model.clockwiseOrder[0] ?? "?";
  return {
    key: model.canonicalKey,
    display: `${model.clockwiseOrder.join(" → ")} → ${start} (clockwise, all facing outward)`,
  };
}

function mixedCircleModel(model: MixedCircleModel): TeachingCaseModel {
  const start = model.clockwiseOrder[0] ?? "?";
  return {
    key: model.canonicalKey,
    display: `${model.clockwiseOrder
      .map((personId) => `${personId}${model.facings[personId] === "CENTER" ? "↘" : "↗"}`)
      .join(" → ")} → ${start} (clockwise; ↘ centre, ↗ outward)`,
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
  const finalModel = enumerateMixedFacingProduction({ persons, constraints: caselet.constraints, maxModels: 2 })[0];
  if (!finalModel) return caselet.sharedExplanation;

  return compileCaseEliminationExplanation({
    intro: [
      "Number the seats from left to right.",
      "For a left/right clue, look at the reference person's facing first. A north-facing person's left is towards our left; a south-facing person's left is towards our right.",
      "If a clue still permits more than one arrangement, keep the useful cases open instead of guessing a seat.",
    ],
    clues: caselet.clueTexts.map((text) => ({ text })),
    enumeratePrefix: (clueCount, maxModels) => enumerateMixedFacingProduction({
      persons,
      constraints: caselet.constraints.slice(0, clueCount),
      maxModels,
    }).map(mixedRowModel),
    finalModel: mixedRowModel(finalModel),
    finalHeading: "Therefore, the final row and facing pattern are:",
  });
}

function compileCp003(caselet: CircularCaseletRecord): string {
  const finalKey = caselet.solverOracleAgreement.productionKeys[0];
  if (!finalKey) return caselet.sharedExplanation;
  const persons = personsFromCircularKey(finalKey);
  const landmarkAnchored = caselet.topologySnapshot.landmark !== undefined;
  const finalModel = enumerateCircularProduction({ persons, constraints: caselet.constraints, landmarkAnchored, maxModels: 2 })[0];
  if (!finalModel) return caselet.sharedExplanation;
  const landmark = caselet.topologySnapshot.landmark?.id.toLowerCase();

  return compileCaseEliminationExplanation({
    intro: [
      landmark
        ? `Use the displayed ${landmark} as the fixed drawing reference.`
        : "Place one person at any convenient point only to draw the circle. Rotating the complete arrangement does not create a different case.",
      "Since everyone faces the centre, left is clockwise and right is anticlockwise.",
      "Keep two or three meaningful cases only when the clues have not yet fixed one arrangement.",
    ],
    clues: caselet.clueTexts.map((text) => ({ text })),
    enumeratePrefix: (clueCount, maxModels) => enumerateCircularProduction({
      persons,
      constraints: caselet.constraints.slice(0, clueCount),
      landmarkAnchored,
      maxModels,
    }).map(centreCircleModel),
    finalModel: centreCircleModel(finalModel),
    finalHeading: "Therefore, the final clockwise arrangement is:",
  });
}

function compileCp004(caselet: OutwardCaseletRecord): string {
  const finalKey = caselet.solverOracleAgreement.productionKeys[0];
  if (!finalKey) return caselet.sharedExplanation;
  const persons = personsFromOutwardKey(finalKey);
  const landmarkAnchored = caselet.topologySnapshot.landmark !== undefined;
  const finalModel = enumerateOutwardProduction({ persons, constraints: caselet.constraints, landmarkAnchored, maxModels: 2 })[0];
  if (!finalModel) return caselet.sharedExplanation;
  const landmark = caselet.topologySnapshot.landmark?.id.toLowerCase();

  return compileCaseEliminationExplanation({
    intro: [
      landmark
        ? `Use the displayed ${landmark} as the fixed drawing reference.`
        : "Place one person at any convenient point only to draw the circle. Rotating the complete arrangement does not create a different case.",
      "Since everyone faces outward, left is anticlockwise and right is clockwise.",
      "Keep the small number of meaningful cases open until a later clue rules one out.",
    ],
    clues: caselet.clueTexts.map((text) => ({ text })),
    enumeratePrefix: (clueCount, maxModels) => enumerateOutwardProduction({
      persons,
      constraints: caselet.constraints.slice(0, clueCount),
      landmarkAnchored,
      maxModels,
    }).map(outwardCircleModel),
    finalModel: outwardCircleModel(finalModel),
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
  const finalModel = enumerateMixedCircleProduction({ persons, constraints: caselet.constraints, maxModels: 2 })[0];
  if (!finalModel) return caselet.sharedExplanation;

  return compileCaseEliminationExplanation({
    intro: [
      "Place one person at any convenient point only to draw the circle. Rotating the complete arrangement does not create a different case.",
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
    }).map(mixedCircleModel),
    finalModel: mixedCircleModel(finalModel),
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
