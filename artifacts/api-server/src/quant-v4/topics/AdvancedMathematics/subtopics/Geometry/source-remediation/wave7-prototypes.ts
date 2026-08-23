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

function withoutEqualLengthMarks(model: GeoDiagramModel): GeoDiagramModel {
  return { ...model, equalLengthMarks: [] };
}

function withLabelPosition(model: GeoDiagramModel, labelId: string, x: number, y: number): GeoDiagramModel {
  return {
    ...model,
    labels: model.labels.map((label) => label.id === labelId ? { ...label, x, y } : label),
  };
}

function withPointPosition(model: GeoDiagramModel, pointId: string, x: number, y: number): GeoDiagramModel {
  return {
    ...model,
    points: model.points.map((point) => point.id === pointId ? { ...point, x, y } : point),
  };
}

function withAngleLabelRadii(model: GeoDiagramModel, radii: Readonly<Record<string, number>>): GeoDiagramModel {
  return {
    ...model,
    angleMarks: model.angleMarks.map((mark) => radii[mark.id] === undefined ? mark : { ...mark, labelRadius: radii[mark.id] }),
  };
}

function simplifySemicircleSolution(model: GeoDiagramModel, answer: string): GeoDiagramModel {
  const b = model.points.find((point) => point.id === "B");
  if (!b) throw new Error("Wave 7 semicircle-chain solution is missing point B");
  return {
    ...model,
    angleMarks: model.angleMarks
      .filter((mark) => mark.id !== "derived-abd")
      .map((mark) => mark.id === "answer-cbd" ? { ...mark, label: undefined } : mark),
    labels: [
      ...model.labels,
      { id: "answer-cbd-text", text: `∠CBD = ${answer}`, x: b.x - 20, y: b.y + 30 },
    ],
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
    const stem = withoutEqualLengthMarks(withCircleRadius(raw.diagramModel, radius));
    const solution = withoutEqualLengthMarks(
      withLabelPosition(withCircleRadius(raw.solutionDiagramModel, radius), "derived-on", 130, 205),
    );
    return refinalize(raw, stem, solution);
  }
  if (index === 2) {
    const radius = Math.hypot(75, 65);
    const stem = withCircleRadius(raw.diagramModel, radius);
    const solution = withLabelPosition(withCircleRadius(raw.solutionDiagramModel, radius), "answer-angle", 180, 140);
    return refinalize(raw, stem, solution);
  }
  if (index === 3) {
    const sRadians = 25 * Math.PI / 180;
    const x = 130 + 82 * Math.cos(sRadians);
    const y = 110 + 82 * Math.sin(sRadians);
    return refinalize(raw, withPointPosition(raw.diagramModel, "S", x, y), withPointPosition(raw.solutionDiagramModel, "S", x, y));
  }
  if (index === 5) {
    const stem = withAngleLabelRadii(raw.diagramModel, { "given-apd": 50 });
    const solution = simplifySemicircleSolution(
      withAngleLabelRadii(raw.solutionDiagramModel, { "given-apd": 50 }),
      raw.answer,
    );
    return refinalize(raw, stem, solution);
  }
  return raw;
}

export const GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES: readonly GapWave7PrototypeDefinition[] = Object.freeze(
  BASE_WAVE7_PROTOTYPES.map((prototype, index) => Object.freeze({
    ...prototype,
    generate: (seed: string) => exactify(index, seed),
  })),
);
