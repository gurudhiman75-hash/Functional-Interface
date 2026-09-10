import { getQuantV4ExamProfileContract } from "../common/exam-profile";
import { PROBABILITY_EXAM_PROFILES } from "../topics/Probability/shared/exam-profile";
import { QUANT_V4_REAL_EXAM_PROFILES } from "./quant-v4-real-exam-simulation-p2";

export const QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY =
  "QUANT-V4-REAL-EXAM-PUNJAB-PROFILE-PROPAGATION-P2" as const;

export const QUANT_V4_PUNJAB_SIMULATION_EXAMS = Object.freeze([
  "PSSSB",
  "PPSC",
  "PUNJAB_POLICE",
] as const);

export type QuantV4PunjabSimulationExamId =
  (typeof QUANT_V4_PUNJAB_SIMULATION_EXAMS)[number];

export type QuantV4PunjabProfileBoundaryStatus =
  | "SUPPORTED"
  | "PROFILE_BLIND"
  | "EVIDENCE_GATED"
  | "PUNJAB_PROFILE_UNSUPPORTED"
  | "STALE_SIMULATOR_METADATA";

export interface QuantV4PunjabProfileBoundaryFinding {
  readonly surface: string;
  readonly status: QuantV4PunjabProfileBoundaryStatus;
  readonly affectedPackages: readonly string[];
  readonly evidence: string;
  readonly remediation: string | null;
}

export interface QuantV4PunjabExamProfileBoundarySummary {
  readonly examId: QuantV4PunjabSimulationExamId;
  readonly historicalCentralDeliveryProfile: string | null;
  readonly historicalCentralProfileGap: boolean;
  readonly centralAuthority: "PUNJAB_STATE";
  readonly centralOptionCount: number;
  readonly centralDeliveryStyle: string;
  readonly simulatorPropagationReady: false;
}

/**
 * P2 boundary audit.
 *
 * This is deliberately a capability audit rather than a wrapper that merely
 * passes `examProfile: "PUNJAB_STATE"` at the outer API. Several current
 * Question Studio routes do not accept or forward that property, so outer-call
 * success is not evidence that a chapter runtime consumed the Punjab profile.
 */
export const QUANT_V4_PUNJAB_PROFILE_BOUNDARY_FINDINGS = Object.freeze([
  Object.freeze({
    surface: "CENTRAL_EXAM_PROFILE_AUTHORITY",
    status: "SUPPORTED" as const,
    affectedPackages: Object.freeze([]),
    evidence: "The shared Quant V4 authority exposes PUNJAB_STATE as a first-class four-option PUNJAB_STATE_OBJECTIVE profile.",
    remediation: null,
  }),
  Object.freeze({
    surface: "HISTORICAL_REAL_EXAM_SIMULATOR",
    status: "STALE_SIMULATOR_METADATA" as const,
    affectedPackages: Object.freeze(["PSSSB", "PPSC", "PUNJAB_POLICE"]),
    evidence: "All three Punjab real-exam profiles still store centralDeliveryProfile=null and centralProfileGap=true.",
    remediation: "Do not consolidate the composed simulator to PUNJAB_STATE until its downstream chapter routes can actually consume that profile.",
  }),
  Object.freeze({
    surface: "REAL_EXAM_PROBABILITY_RESOLVER",
    status: "SUPPORTED" as const,
    affectedPackages: Object.freeze(["PSSSB", "PPSC", "PUNJAB_POLICE"]),
    evidence: "Punjab-family Probability slots resolve directly to PUNJAB_STATE. The Probability integration then fails closed on its evidence gate, so no SSC-generated Probability question is counted as Punjab output.",
    remediation: null,
  }),
  Object.freeze({
    surface: "CORE_GENERATION_ENGINE",
    status: "PROFILE_BLIND" as const,
    affectedPackages: Object.freeze([
      "PCT-001", "PCT-002", "PCT-003", "PCT-004", "PCT-005", "PCT-006", "PCT-007",
      "RAP-001", "RAP-002", "RAP-003", "PRT-001",
    ]),
    evidence: "QuantV4GenerationRequest in generation-engine-core has no examProfile field, and the core runtime contract forwards only difficulty/language/questionLanguageId/seed.",
    remediation: "Add a shared Quant examProfile to the core request/runtime contract and thread PUNJAB_STATE through each package before claiming Punjab-profile delivery.",
  }),
  Object.freeze({
    surface: "QUESTION_STUDIO_AVERAGE_ROUTE",
    status: "PROFILE_BLIND" as const,
    affectedPackages: Object.freeze(["AVG-001"]),
    evidence: "runAvg001QuestionStudioPipeline accepts difficulty/language/questionLanguageId/seed only; generateAverageQuestion does not forward request.examProfile.",
    remediation: "Add examProfile to the AVG-001 adapter and define Punjab-specific selection/delivery behavior.",
  }),
  Object.freeze({
    surface: "QUESTION_STUDIO_MIXTURE_ROUTE",
    status: "PROFILE_BLIND" as const,
    affectedPackages: Object.freeze(["MAL-001"]),
    evidence: "runMal001QuestionStudioPipeline accepts difficulty/language/questionLanguageId/seed only; the Question Studio route does not forward request.examProfile.",
    remediation: "Add examProfile to MAL-001 and define Punjab-specific selection/delivery behavior.",
  }),
  Object.freeze({
    surface: "LEGACY_ARITHMETIC_RUNTIME_ROUTES",
    status: "PROFILE_BLIND" as const,
    affectedPackages: Object.freeze(["PNL-001", "RAP-001", "RAP-002", "RAP-003"]),
    evidence: "The legacy runtime wrapper exposes examProfile for Probability, but the PNL/RAP runtime adapters omit it when invoking their chapter pipelines.",
    remediation: "Separate generic runtime options from Probability-only typing and thread the shared Quant profile into Arithmetic chapter adapters.",
  }),
  Object.freeze({
    surface: "MEN_002_STANDARD_QUESTION_STUDIO_ROUTE",
    status: "PROFILE_BLIND" as const,
    affectedPackages: Object.freeze(["MEN-002"]),
    evidence: "The standard MEN-CP-009 Question Studio request type has no examProfile field even though the chapter-wide Mensuration runtime has Punjab-aware weighting elsewhere.",
    remediation: "Bridge the standard MEN-002 Question Studio route to the Punjab-aware chapter delivery/runtime rather than dropping the profile at the route boundary.",
  }),
  Object.freeze({
    surface: "PROBABILITY_PROFILE_CONTRACT",
    status: "EVIDENCE_GATED" as const,
    affectedPackages: Object.freeze(["PRB-001", "PRB-002"]),
    evidence: "Question Studio recognizes PUNJAB_STATE as an explicit Probability request and rejects it with PRB_PUNJAB_PROFILE_EVIDENCE_REQUIRED before the raw Probability profile layer, which still has no native Punjab selection contract.",
    remediation: "Normalize attributable Punjab Probability observations, approve a Punjab CP/solve-mode/difficulty contract, then add the native Probability profile without reintroducing an SSC fallback.",
  }),
] satisfies readonly QuantV4PunjabProfileBoundaryFinding[]);

export function runQuantV4PunjabProfilePropagationAudit() {
  const central = getQuantV4ExamProfileContract("PUNJAB_STATE");
  const summaries: QuantV4PunjabExamProfileBoundarySummary[] = QUANT_V4_PUNJAB_SIMULATION_EXAMS.map((examId) => {
    const historical = QUANT_V4_REAL_EXAM_PROFILES.find((profile) => profile.id === examId);
    if (!historical) throw new Error(`Missing historical real-exam profile ${examId}.`);
    return Object.freeze({
      examId,
      historicalCentralDeliveryProfile: historical.centralDeliveryProfile,
      historicalCentralProfileGap: historical.centralProfileGap,
      centralAuthority: "PUNJAB_STATE" as const,
      centralOptionCount: central.optionCount,
      centralDeliveryStyle: central.deliveryStyle,
      simulatorPropagationReady: false as const,
    });
  });

  const findings = QUANT_V4_PUNJAB_PROFILE_BOUNDARY_FINDINGS;
  const blockingFindings = findings.filter((finding) => finding.status !== "SUPPORTED");
  const probabilityHasPunjabProfile = Object.prototype.hasOwnProperty.call(
    PROBABILITY_EXAM_PROFILES,
    "PUNJAB_STATE",
  );

  return Object.freeze({
    authority: QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY,
    centralAuthority: "PUNJAB_STATE" as const,
    profilesAudited: summaries.length,
    simulatorPropagationReady: false as const,
    probabilityHasPunjabProfile,
    blockingFindingCount: blockingFindings.length,
    findings,
    summaries: Object.freeze(summaries),
  });
}
