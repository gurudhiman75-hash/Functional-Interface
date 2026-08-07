import {
  SAP_CP002_ALL_PROTOTYPE_IDS,
  SAP_CP002_TEMPLATE_MAP,
  type SapCp002PrototypeId,
} from "../SAP-CP-002-AUTHORITY-AND-TEMPLATE-MAP";
import {
  SAP_CP002_TEMPLATE_TO_PERMANENT_QL,
  type SapCp002PermanentQlId,
} from "../permanent-runtime/runtime";
import { generateSapCp002ExamReadinessV4Package } from "./runtime";
import type { SapCp002ExamReadinessV4Package, SapCp002V4ReviewRecord } from "./types";

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

function chooseForQl(
  qlId: SapCp002PermanentQlId,
  target: number,
): readonly SapCp002ExamReadinessV4Package[] {
  const prototypes = prototypesForQl(qlId);
  if (prototypes.length === 0) throw new Error(`${qlId} has no executable prototype ancestry.`);
  const selected: SapCp002ExamReadinessV4Package[] = [];
  const canonicalKeys = new Set<string>();
  const identities = new Set<string>();
  let seed = 1;
  let cursor = 0;

  while (selected.length < target && seed <= 10_000) {
    const prototypeId = prototypes[cursor % prototypes.length]!;
    const pkg = generateSapCp002ExamReadinessV4Package(prototypeId, seed);
    cursor += 1;
    if (cursor % prototypes.length === 0) seed += 1;
    if (!pkg.validation.ok) continue;
    if (canonicalKeys.has(pkg.canonicalPayloadKey)) continue;
    if (identities.has(pkg.generationIdentity)) throw new Error(`Duplicate identity ${pkg.generationIdentity}.`);
    canonicalKeys.add(pkg.canonicalPayloadKey);
    identities.add(pkg.generationIdentity);
    selected.push(pkg);
  }

  if (selected.length !== target) {
    throw new Error(`${qlId} produced only ${selected.length} unique validated V4 items; ${target} are required.`);
  }
  if (qlId === "SAP-QL-020") {
    const subtypes = new Set(selected.map((pkg) => pkg.solveModeSubtype));
    if (!subtypes.has("FRACTION_OPERATION_CHAIN") || !subtypes.has("INTEGER_WITH_FRACTIONAL_PRODUCT")) {
      throw new Error("SAP-QL-020 review selection must include both actual solve subtypes.");
    }
  }
  return Object.freeze(selected);
}

export function generateSapCp002ExamReadinessV4ReviewPackages(): readonly SapCp002ExamReadinessV4Package[] {
  const packages: SapCp002ExamReadinessV4Package[] = [];
  for (const [qlId, target] of Object.entries(TARGETS) as [SapCp002PermanentQlId, number][]) {
    packages.push(...chooseForQl(qlId, target));
  }
  if (new Set(packages.map((pkg) => pkg.canonicalPayloadKey)).size !== packages.length) {
    throw new Error("V4 review export contains a semantic duplicate.");
  }
  if (new Set(packages.map((pkg) => pkg.generationIdentity)).size !== packages.length) {
    throw new Error("V4 review export contains a generation-identity collision.");
  }
  return Object.freeze(packages);
}

export function generateSapCp002ExamReadinessV4ReviewRecords(): readonly SapCp002V4ReviewRecord[] {
  return Object.freeze(generateSapCp002ExamReadinessV4ReviewPackages().map((pkg, index) => Object.freeze({
    questionId: `SAP-CP002-V4-REV-${String(index + 1).padStart(3, "0")}`,
    packageId: "SAP-001" as const,
    checkpointId: "SAP-CP-002" as const,
    permanentQlId: pkg.permanentQlId,
    temporaryPrototypeId: pkg.temporaryPrototypeId,
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
    answerSemanticValue: pkg.answerSemanticValue,
    explanation: pkg.explanation,
    validation: pkg.validation,
    humanReviewStatus: "PENDING" as const,
    reviewerNotes: "" as const,
    canonicalPayloadKey: pkg.canonicalPayloadKey,
    payloadFingerprint: pkg.payloadFingerprint,
    generationIdentity: pkg.generationIdentity,
  })));
}

export const SAP_CP002_V4_REVIEW_TARGETS = TARGETS;
