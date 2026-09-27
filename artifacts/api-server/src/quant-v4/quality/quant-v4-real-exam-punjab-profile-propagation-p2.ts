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
  | "DELIVERY_SUPPORTED_SELECTION_PENDING"
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
  readonly simulatorPropagationReady: true;
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
    status: "SUPPORTED" as const,
    affectedPackages: Object.freeze(["PSSSB", "PPSC", "PUNJAB_POLICE"]),
    evidence: "All three Punjab real-exam profiles now store centralDeliveryProfile=PUNJAB_STATE and centralProfileGap=false.",
    remediation: null,
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
    status: "DELIVERY_SUPPORTED_SELECTION_PENDING" as const,
    affectedPackages: Object.freeze([
      "PCT-001", "PCT-002", "PCT-003", "PCT-004", "PCT-005", "PCT-006", "PCT-007",
      "RAP-001", "RAP-002", "RAP-003", "PRT-001",
    ]),
    evidence: "The public Quant generation boundary accepts the shared examProfile and applies the central four/five-option delivery contract even when an older low-level chapter runtime does not own native profile selection. These routes therefore preserve Punjab delivery semantics while remaining selection-uncalibrated.",
    remediation: "Keep delivery through the shared profile wrapper. Add native Punjab CP/QL/difficulty selection only where normalized Punjab PYQ evidence supports it.",
  }),
  Object.freeze({
    surface: "QUESTION_STUDIO_AVERAGE_ROUTE",
    status: "DELIVERY_SUPPORTED_SELECTION_PENDING" as const,
    affectedPackages: Object.freeze(["AVG-001"]),
    evidence: "AVG-001 generation exits through the shared request-scoped exam-profile delivery wrapper. Punjab requests retain four-option PUNJAB_STATE delivery, while chapter-level CP/QL selection remains evidence-gated.",
    remediation: "Calibrate Punjab-specific AVG selection only after normalized Punjab observations support CP/QL/difficulty weights.",
  }),
  Object.freeze({
    surface: "QUESTION_STUDIO_MIXTURE_ROUTE",
    status: "DELIVERY_SUPPORTED_SELECTION_PENDING" as const,
    affectedPackages: Object.freeze(["MAL-001"]),
    evidence: "MAL-001 generation exits through the shared request-scoped exam-profile delivery wrapper. Punjab requests retain four-option PUNJAB_STATE delivery, while chapter-level CP/QL selection remains evidence-gated.",
    remediation: "Calibrate Punjab-specific MAL selection only after normalized Punjab observations support CP/QL/difficulty weights.",
  }),
  Object.freeze({
    surface: "LEGACY_ARITHMETIC_RUNTIME_ROUTES",
    status: "DELIVERY_SUPPORTED_SELECTION_PENDING" as const,
    affectedPackages: Object.freeze(["PNL-001", "RAP-001", "RAP-002", "RAP-003"]),
    evidence: "These older chapter runtimes do not own native Punjab selection, but normal Question Studio generation applies the shared profile delivery contract at the public boundary. Delivery is therefore profile-correct while CP/QL selection remains generic.",
    remediation: "Do not invent Punjab selection. Add native selection only after chapter-level Punjab evidence is normalized.",
  }),
  Object.freeze({
    surface: "MEN_002_STANDARD_QUESTION_STUDIO_ROUTE",
    status: "SUPPORTED" as const,
    affectedPackages: Object.freeze(["MENSURATION"]),
    evidence: "The real-exam simulator now samples the full MENSURATION Question Studio package, whose standard runtime accepts examProfile and normalizes PUNJAB_STATE to the Punjab-aware Mensuration profile. The legacy MEN-002 CP009-only route is no longer the simulator surface.",
    remediation: null,
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
      simulatorPropagationReady: true as const,
    });
  });

  const findings = QUANT_V4_PUNJAB_PROFILE_BOUNDARY_FINDINGS;
  const blockingFindings = findings.filter(
    (finding) => finding.status === "PROFILE_BLIND" || finding.status === "PUNJAB_PROFILE_UNSUPPORTED" || finding.status === "STALE_SIMULATOR_METADATA" || finding.status === "EVIDENCE_GATED",
  );
  const selectionPendingFindings = findings.filter(
    (finding) => finding.status === "DELIVERY_SUPPORTED_SELECTION_PENDING",
  );
  const probabilityHasPunjabProfile = Object.prototype.hasOwnProperty.call(
    PROBABILITY_EXAM_PROFILES,
    "PUNJAB_STATE",
  );

  return Object.freeze({
    authority: QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY,
    centralAuthority: "PUNJAB_STATE" as const,
    profilesAudited: summaries.length,
    simulatorPropagationReady: true as const,
    probabilityHasPunjabProfile,
    blockingFindingCount: blockingFindings.length,
    selectionPendingFindingCount: selectionPendingFindings.length,
    findings,
    summaries: Object.freeze(summaries),
  });
}
