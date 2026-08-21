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
        ? { ...label, text: `∠TPQ = ∠PQR = ${answerText}`, x: 235, y: 205 }
        : label),
  };
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

export const GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES: readonly GapWave6PrototypeDefinition[] = Object.freeze(
  BASE_WAVE6_PROTOTYPES.map((prototype, index) => index === 0
    ? Object.freeze({ ...prototype, generate: remediateDirectQuestion })
    : prototype),
);
