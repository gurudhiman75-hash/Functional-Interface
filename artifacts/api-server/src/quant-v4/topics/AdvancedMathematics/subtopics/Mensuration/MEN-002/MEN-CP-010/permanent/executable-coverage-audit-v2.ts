import { MEN_CP_010_DISCOVERY_V2_CANDIDATES } from "../../cp010-foundation/discovery-v2-ledger";
import { MEN_CP_010_SATURATION_V3_ROWS } from "../../cp010-foundation/saturation-v3-ledger";
import { listMenCp010ExamReadyEnglishSources } from "./runtime-v3";

export const MEN_CP_010_EXECUTABLE_COVERAGE_AUDIT_V2_AUTHORITY =
  "MEN-CP010-EXECUTABLE-COVERAGE-AUDIT-V2" as const;

const RUNTIME_SOURCE_IDS = new Set(listMenCp010ExamReadyEnglishSources().map((row) => row.sourceId));

/**
 * Wave-02 had three executable discovery representations that were absorbed by
 * a permanent cluster but never actually surfaced in the V1 permanent runtime.
 * V2 supplies stronger exam-facing replacements rather than pretending that a
 * ledger mention is runtime coverage.
 */
const WAVE02_REPLACEMENTS: Readonly<Record<string, string>> = {
  "CP010-D2-SIMILAR-FRUSTUM-FULL-MINUS-CUT": "EXAM-V2-SQUARE-FRUSTUM-FULL-MINUS-CUT",
  "CP010-D2-APP-LAMPSHADE-AREA": "EXAM-V2-FRUSTUM-LAMPSHADE-SHEET-AREA",
  "CP010-D2-APP-PYRAMID-TENT-CANVAS": "EXAM-V2-PYRAMID-SURFACE-FROM-VERTICAL-HEIGHT",
};

const DESIGN_REPRESENTATION_REPLACEMENTS: Readonly<Record<string, string>> = {
  "V3-REGULAR-PYRAMID-VOLUME": "EXAM-V2-PYRAMID-VOLUME-EQUILATERAL-BASE",
  "V3-NUMERICAL-PI-REPRESENTATION": "EXAM-V2-CONICAL-FRUSTUM-VOLUME-CLEAN-PI",
  "V3-TRUNCATED-CONE-CONTEXT": "EXAM-V2-CONICAL-FRUSTUM-VOLUME-CLEAN-PI",
  "V3-TRUNCATED-PYRAMID-CONTEXT": "EXAM-V2-SQUARE-FRUSTUM-FULL-MINUS-CUT",
};

function disposition(sourceId: string, replacements: Readonly<Record<string, string>>) {
  if (RUNTIME_SOURCE_IDS.has(sourceId)) {
    return { sourceId, status: "DIRECT_RUNTIME" as const, runtimeSourceId: sourceId };
  }
  const replacement = replacements[sourceId];
  if (replacement && RUNTIME_SOURCE_IDS.has(replacement)) {
    return { sourceId, status: "EXAM_REALISM_REPLACEMENT" as const, runtimeSourceId: replacement };
  }
  return { sourceId, status: "MISSING" as const, runtimeSourceId: null };
}

export function auditMenCp010ExecutableCoverageV2() {
  const wave02Executable = MEN_CP_010_DISCOVERY_V2_CANDIDATES.filter((row) => row.executable);
  const wave03Executable = MEN_CP_010_SATURATION_V3_ROWS.filter((row) => row.executable);
  const wave02 = wave02Executable.map((row) => disposition(row.id, WAVE02_REPLACEMENTS));
  const wave03 = wave03Executable.map((row) => disposition(row.id, {}));
  const designRepresentations = Object.keys(DESIGN_REPRESENTATION_REPLACEMENTS).map((sourceId) =>
    disposition(sourceId, DESIGN_REPRESENTATION_REPLACEMENTS),
  );

  return {
    authority: MEN_CP_010_EXECUTABLE_COVERAGE_AUDIT_V2_AUTHORITY,
    runtimeSourceCount: RUNTIME_SOURCE_IDS.size,
    wave02ExecutableCount: wave02Executable.length,
    wave02DirectRuntimeCount: wave02.filter((row) => row.status === "DIRECT_RUNTIME").length,
    wave02ReplacementCount: wave02.filter((row) => row.status === "EXAM_REALISM_REPLACEMENT").length,
    wave02MissingCount: wave02.filter((row) => row.status === "MISSING").length,
    wave03ExecutableCount: wave03Executable.length,
    wave03MissingCount: wave03.filter((row) => row.status === "MISSING").length,
    designRepresentationMissingCount: designRepresentations.filter((row) => row.status === "MISSING").length,
    wave02,
    wave03,
    designRepresentations,
    coverageClosed:
      wave02.every((row) => row.status !== "MISSING") &&
      wave03.every((row) => row.status !== "MISSING") &&
      designRepresentations.every((row) => row.status !== "MISSING"),
  } as const;
}
