import type { GeoDiagramModel } from "../../../../../shared/geometry";
import { GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES as BASE_WAVE7_PROTOTYPES } from "./wave7-prototypes-base";
import { finalizeGapWave7Question } from "./wave7-utils";
import type { GapWave7PrototypeDefinition, GapWave7Question } from "./wave7-types";

function withCircleRadius(model: GeoDiagramModel, radius: number): GeoDiagramModel {
  return {
    ...model,
    circles: model.circles.map((circle) => circle.id === "circle-o" ? { ...circle, radius } : circle),
  };
}

function refinalize(raw: GapWave7Question, diagramModel: GeoDiagramModel, solutionDiagramModel: GeoDiagramModel): GapWave7Question {
  return finalizeGapWave7Question({
    cpId: raw.cpId,
    temporaryPrototypeId: raw.temporaryPrototypeId,
    sourceGapId: raw.sourceGapId,
    sourceEvidenceIds: raw.sourceEvidenceIds,
    solveMode: raw.solveMode,
    seed: raw.seed,
    stem: raw.stem,
    options: raw.options,
    correctIndex: raw.correctIndex,
    optionAnalysis: raw.optionAnalysis,
    explanation: raw.explanation,
    theoremTrace: raw.theoremTrace,
    displayedClueIds: raw.displayedClueIds,
    minimalityProof: raw.minimalityProof,
    independentVerifierResult: raw.independentVerifierResult,
    diagramModel,
    solutionDiagramModel,
  });
}

function exactify(index: number, seed: string): GapWave7Question {
  const raw = BASE_WAVE7_PROTOTYPES[index].generate(seed);
  if (index === 1) {
    const radius = Math.hypot(75, 34);
    return refinalize(raw, withCircleRadius(raw.diagramModel, radius), withCircleRadius(raw.solutionDiagramModel, radius));
  }
  if (index === 2) {
    const radius = Math.hypot(75, 65);
    return refinalize(raw, withCircleRadius(raw.diagramModel, radius), withCircleRadius(raw.solutionDiagramModel, radius));
  }
  return raw;
}

export const GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES: readonly GapWave7PrototypeDefinition[] = Object.freeze(
  BASE_WAVE7_PROTOTYPES.map((prototype, index) => Object.freeze({
    ...prototype,
    generate: (seed: string) => exactify(index, seed),
  })),
);
