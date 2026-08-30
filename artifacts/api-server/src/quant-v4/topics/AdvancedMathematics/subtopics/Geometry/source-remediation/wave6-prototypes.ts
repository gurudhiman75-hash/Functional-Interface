import {
  perpendicularBisectorDirectConclusion,
  type GeoDiagramModel,
} from "../../../../../shared/geometry";
import { GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES as BASE_WAVE6_PROTOTYPES } from "./wave6-prototypes-base";
import {
  approximate,
  collinear,
  finalizeGapWave6Question,
  perpendicular,
  pointDistance,
  wave6Verifier,
} from "./wave6-utils";
import type { GapWave6PrototypeDefinition, GapWave6Question } from "./wave6-types";

const EXACT_T_Y = 81.15384615384616;

function point(model: GeoDiagramModel, id: string) {
  const result = model.points.find((candidate) => candidate.id === id);
  if (!result) throw new Error(`Wave 6 remediation point ${id} missing`);
  return result;
}

function exactT(model: GeoDiagramModel): GeoDiagramModel {
  return {
    ...model,
    points: model.points.map((candidate) => candidate.id === "T"
      ? { ...candidate, y: EXACT_T_Y }
      : candidate),
  };
}

function cleanDirectSolution(raw: GapWave6Question, model: GeoDiagramModel): GeoDiagramModel {
  const answerText = raw.answer;
  return {
    ...model,
    angleMarks: model.angleMarks.filter((mark) => !mark.id.startsWith("derived-")),
    labels: model.labels
      .filter((label) => label.id !== "derived-equality-label")
      .map((label) => label.id === "answer-label"
        ? { ...label, text: `∠TPQ = ∠PQR = ${answerText}`, x: 140, y: 205 }
        : label),
  };
}

function cleanRhombusSolution(model: GeoDiagramModel): GeoDiagramModel {
  const slots = new Map<string, Readonly<{ x: number; y: number }>>([
    ["given-so", { x: 260, y: 55 }],
    ["given-oq", { x: 260, y: 85 }],
    ["derived-collinear", { x: 260, y: 115 }],
    ["answer-sq", { x: 260, y: 145 }],
  ]);
  return {
    ...model,
    labels: model.labels.map((label) => {
      const slot = slots.get(label.id);
      if (!slot) return label;
      if (label.id === "derived-collinear") return { ...label, text: "O lies on SQ", ...slot };
      return { ...label, ...slot };
    }),
  };
}

function cleanCentroidStem(model: GeoDiagramModel): GeoDiagramModel {
  return {
    ...model,
    labels: model.labels.map((label) => label.id === "given-centroid-segment"
      ? { ...label, x: 220 }
      : label),
  };
}

function cleanCentroidSolution(model: GeoDiagramModel): GeoDiagramModel {
  return {
    ...model,
    labels: model.labels.map((label) => {
      if (label.id === "ag-label" || label.id === "gd-label") return { ...label, x: 220 };
      if (label.id === "ratio-label") return { ...label, text: "AG:GD = 2:1", x: 220, y: 105 };
      return label;
    }),
  };
}

function cleanMidpointSolution(model: GeoDiagramModel): GeoDiagramModel {
  return {
    ...model,
    labels: model.labels
      .filter((label) => label.id !== "derived-midpoint")
      .map((label) => label.id === "answer-ec"
        ? { ...label, x: 120, y: 220 }
        : label),
  };
}

function refinalize(raw: GapWave6Question, diagramModel: GeoDiagramModel | undefined, solutionDiagramModel: GeoDiagramModel): GapWave6Question {
  return finalizeGapWave6Question({
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
    diagramDisposition: raw.diagramDisposition,
    diagramModel,
    solutionDiagramModel,
  });
}

function remediateDirectQuestion(seed: string): GapWave6Question {
  const raw = BASE_WAVE6_PROTOTYPES[0].generate(seed);
  if (!raw.diagramModel) throw new Error("Wave 6 direct stem diagram missing before remediation");

  const diagramModel = exactT(raw.diagramModel);
  const solutionDiagramModel = cleanDirectSolution(raw, exactT(raw.solutionDiagramModel));
  const P = point(diagramModel, "P");
  const Q = point(diagramModel, "Q");
  const R = point(diagramModel, "R");
  const S = point(diagramModel, "S");
  const T = point(diagramModel, "T");
  const topology = approximate(pointDistance(P, S), pointDistance(S, Q))
    && perpendicular(P, Q, S, T)
    && collinear(R, T, Q)
    && approximate(pointDistance(T, P), pointDistance(T, Q))
    && perpendicularBisectorDirectConclusion() === "EQUIDISTANT_FROM_ENDPOINTS";

  return finalizeGapWave6Question({
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
    independentVerifierResult: wave6Verifier("HIGH_PRECISION_COORDINATE", topology, [
      "S is the midpoint of PQ in the coordinate model",
      "ST is perpendicular to PQ",
      "T lies exactly on QR and on the perpendicular bisector of PQ",
      "independent distance check confirms TP = TQ",
    ]),
    diagramDisposition: raw.diagramDisposition,
    diagramModel,
    solutionDiagramModel,
  });
}

function remediateRhombusQuestion(seed: string): GapWave6Question {
  const raw = BASE_WAVE6_PROTOTYPES[1].generate(seed);
  return refinalize(raw, raw.diagramModel, cleanRhombusSolution(raw.solutionDiagramModel));
}

function remediateCentroidQuestion(seed: string): GapWave6Question {
  const raw = BASE_WAVE6_PROTOTYPES[2].generate(seed);
  if (!raw.diagramModel) throw new Error("Wave 6 centroid stem diagram missing before remediation");
  return refinalize(raw, cleanCentroidStem(raw.diagramModel), cleanCentroidSolution(raw.solutionDiagramModel));
}

function remediateMidpointQuestion(seed: string): GapWave6Question {
  const raw = BASE_WAVE6_PROTOTYPES[3].generate(seed);
  return refinalize(raw, raw.diagramModel, cleanMidpointSolution(raw.solutionDiagramModel));
}

export const GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES: readonly GapWave6PrototypeDefinition[] = Object.freeze(
  BASE_WAVE6_PROTOTYPES.map((prototype, index) => {
    if (index === 0) return Object.freeze({ ...prototype, generate: remediateDirectQuestion });
    if (index === 1) return Object.freeze({ ...prototype, generate: remediateRhombusQuestion });
    if (index === 2) return Object.freeze({ ...prototype, generate: remediateCentroidQuestion });
    if (index === 3) return Object.freeze({ ...prototype, generate: remediateMidpointQuestion });
    return prototype;
  }),
);
