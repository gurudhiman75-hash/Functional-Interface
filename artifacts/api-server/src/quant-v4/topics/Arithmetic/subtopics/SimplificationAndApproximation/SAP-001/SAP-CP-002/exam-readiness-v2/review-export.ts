import {
  SAP_CP002_ALL_PROTOTYPE_IDS,
  SAP_CP002_TEMPLATE_MAP,
  type SapCp002PrototypeId,
} from "../SAP-CP-002-AUTHORITY-AND-TEMPLATE-MAP";
import {
  SAP_CP002_TEMPLATE_TO_PERMANENT_QL,
  type SapCp002PermanentQlId,
} from "../permanent-runtime/runtime";
import { generateSapCp002FinalExamReadinessV2Package } from "./final-runtime";
import type { SapCp002ExamReadinessV2Package, SapCp002ReviewRecord } from "./types";

const TARGETS: Readonly<Record<SapCp002PermanentQlId, number>> = Object.freeze({
  "SAP-QL-017": 18,
  "SAP-QL-018": 18,
  "SAP-QL-019": 18,
  "SAP-QL-020": 18,
  "SAP-QL-021": 18,
  "SAP-QL-022": 18,
  "SAP-QL-023": 18,
  "SAP-QL-024": 18,
  "SAP-QL-025": 18,
  "SAP-QL-026": 18,
  "SAP-QL-027": 18,
  "SAP-QL-028": 17,
  "SAP-QL-029": 17,
  "SAP-QL-030": 17,
  "SAP-QL-031": 17,
  "SAP-QL-032": 17,
  "SAP-QL-033": 17,
});

function prototypesForQl(qlId: SapCp002PermanentQlId): readonly SapCp002PrototypeId[] {
  return Object.freeze(SAP_CP002_ALL_PROTOTYPE_IDS.filter((prototypeId) => (
    SAP_CP002_TEMPLATE_TO_PERMANENT_QL[SAP_CP002_TEMPLATE_MAP[prototypeId]] === qlId
  )));
}

function normalizedPayloadKey(pkg: SapCp002ExamReadinessV2Package): string {
  return [
    pkg.permanentQlId,
    pkg.mathematicalFingerprint,
    pkg.canonicalAnswer,
  ].join("|");
}

function chooseForQl(qlId: SapCp002PermanentQlId, target: number): readonly SapCp002ExamReadinessV2Package[] {
  const prototypes = prototypesForQl(qlId);
  if (prototypes.length === 0) throw new Error(`${qlId} has no executable prototype ancestry.`);
  const selected: SapCp002ExamReadinessV2Package[] = [];
  const seen = new Set<string>();
  let seed = 1;
  let cursor = 0;
  while (selected.length < target && seed <= 2_000) {
    const prototypeId = prototypes[cursor % prototypes.length]!;
    const pkg = generateSapCp002FinalExamReadinessV2Package(prototypeId, seed);
    cursor += 1;
    if (cursor % prototypes.length === 0) seed += 1;
    if (!pkg.validation.ok) continue;
    const key = normalizedPayloadKey(pkg);
    if (seen.has(key)) continue;
    seen.add(key);
    selected.push(pkg);
  }
  if (selected.length !== target) {
    throw new Error(`${qlId} produced only ${selected.length} unique validated items; ${target} are required.`);
  }
  return Object.freeze(selected);
}

export function generateSapCp002ExamReadinessV2ReviewPackages(): readonly SapCp002ExamReadinessV2Package[] {
  const packages: SapCp002ExamReadinessV2Package[] = [];
  for (const [qlId, target] of Object.entries(TARGETS) as [SapCp002PermanentQlId, number][]) {
    packages.push(...chooseForQl(qlId, target));
  }
  return Object.freeze(packages);
}

export function generateSapCp002ExamReadinessV2ReviewRecords(): readonly SapCp002ReviewRecord[] {
  return Object.freeze(generateSapCp002ExamReadinessV2ReviewPackages().map((pkg, index) => Object.freeze({
    questionId: `SAP-CP002-V2-REV-${String(index + 1).padStart(3, "0")}`,
    packageId: "SAP-001" as const,
    checkpointId: "SAP-CP-002" as const,
    permanentQlId: pkg.permanentQlId,
    solveModeLabel: pkg.solveModeLabel,
    solveModeSubtype: pkg.solveModeSubtype,
    taskDirection: pkg.taskDirection,
    difficulty: pkg.difficulty,
    difficultyScore: pkg.difficultyScore,
    seed: pkg.seed,
    stem: pkg.stem,
    options: pkg.options,
    correctIndex: pkg.correctIndex,
    correctAnswer: pkg.canonicalAnswer,
    explanation: pkg.explanation,
    validation: pkg.validation,
    humanReviewStatus: "PENDING" as const,
    reviewerNotes: "" as const,
    payloadFingerprint: pkg.payloadFingerprint,
  })));
}

export const SAP_CP002_V2_REVIEW_TARGETS = TARGETS;
