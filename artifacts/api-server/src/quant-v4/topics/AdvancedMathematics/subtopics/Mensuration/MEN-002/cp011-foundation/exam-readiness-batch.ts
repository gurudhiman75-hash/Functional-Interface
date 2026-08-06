import { getMenCp011FoundationPrototypeIds } from "./registry";
import {
  generateMenCp011FoundationPrototype,
  type MenCp011UnitRepresentationPackage,
} from "./runtime";
import {
  getMenCp011MeasurementProfiles,
  MEN_CP011_MEASUREMENT_AUTHORITY,
  type MenCp011MeasurementProfileId,
} from "./measurement-profiles";
import {
  getMenCp011PhysicalStateCatalog,
  menCp011PhysicalStateKey,
  MEN_CP011_STATE_POOL_AUTHORITY,
} from "./state-pool";
import type { MenCp011PrototypeId } from "./types";

export interface MenCp011BatchAudit {
  statePoolAuthority: typeof MEN_CP011_STATE_POOL_AUTHORITY;
  measurementAuthority: typeof MEN_CP011_MEASUREMENT_AUTHORITY;
  physicalStatePoolSize: number;
  recordCount: number;
  exactStemCount: number;
  exactQuestionOptionCount: number;
  normalizedStemGroupCount: number;
  maximumNormalizedStemRepetition: number;
  uniquePhysicalStateCount: number;
  uniqueRadialPairCount: number;
  uniqueHeightCount: number;
  answerPositionCounts: Record<"A" | "B" | "C" | "D", number>;
  answerPositionSequences: Record<MenCp011PrototypeId, string>;
  measurementProfileCounts: Record<MenCp011MeasurementProfileId, number>;
  representationUnitMatrix: Record<
    MenCp011PrototypeId,
    Record<MenCp011MeasurementProfileId, number>
  >;
  mixedUnitRecordCount: number;
  blockers: string[];
  publicationEligible: false;
}

export interface MenCp011ReviewBatch {
  records: MenCp011UnitRepresentationPackage[];
  audit: MenCp011BatchAudit;
}

const LABELS = ["A", "B", "C", "D"] as const;

function normalizedStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/\s+/g, " ")
    .trim();
}

function radialPairKey(question: MenCp011UnitRepresentationPackage) {
  return `${question.state.outerRadius}|${question.state.innerRadius}`;
}

function questionOptionKey(question: MenCp011UnitRepresentationPackage) {
  return [
    question.stem,
    ...question.options.map((option) => option.display),
  ].join("\n");
}

function duplicateCount(values: readonly string[]) {
  return values.length - new Set(values).size;
}

function emptyProfileCounts(): Record<MenCp011MeasurementProfileId, number> {
  return Object.fromEntries(
    getMenCp011MeasurementProfiles().map((profile) => [profile.id, 0]),
  ) as Record<MenCp011MeasurementProfileId, number>;
}

export function auditMenCp011ReviewBatch(
  records: readonly MenCp011UnitRepresentationPackage[],
): MenCp011BatchAudit {
  const exactStems = records.map((question) => question.stem);
  const exactQuestionOptions = records.map(questionOptionKey);
  const normalized = records.map((question) => normalizedStem(question.stem));
  const normalizedCounts = new Map<string, number>();
  for (const key of normalized) {
    normalizedCounts.set(key, (normalizedCounts.get(key) ?? 0) + 1);
  }
  const stateKeys = records.map((question) =>
    menCp011PhysicalStateKey(question.state),
  );
  const radialPairs = records.map(radialPairKey);
  const heights = records.map((question) => question.state.height.toString());
  const answerPositionCounts = { A: 0, B: 0, C: 0, D: 0 };
  const measurementProfileCounts = emptyProfileCounts();
  const representationUnitMatrix = Object.fromEntries(
    getMenCp011FoundationPrototypeIds().map((prototypeId) => [
      prototypeId,
      emptyProfileCounts(),
    ]),
  ) as Record<
    MenCp011PrototypeId,
    Record<MenCp011MeasurementProfileId, number>
  >;

  for (const question of records) {
    const label = question.options[question.correctIndex]!.label;
    answerPositionCounts[label] += 1;
    measurementProfileCounts[question.measurementProfile.id] += 1;
    representationUnitMatrix[question.prototypeId][question.measurementProfile.id] += 1;
  }

  const answerPositionSequences = Object.fromEntries(
    getMenCp011FoundationPrototypeIds().map((prototypeId) => [
      prototypeId,
      records
        .filter((question) => question.prototypeId === prototypeId)
        .map((question) => question.options[question.correctIndex]!.label)
        .join(""),
    ]),
  ) as Record<MenCp011PrototypeId, string>;
  const blockers = [
    "CHAPTER_COVERAGE_INCOMPLETE",
    "PERMANENT_QLS_UNALLOCATED",
    "MANUAL_ENGLISH_REVIEW_PENDING",
  ];

  return {
    statePoolAuthority: MEN_CP011_STATE_POOL_AUTHORITY,
    measurementAuthority: MEN_CP011_MEASUREMENT_AUTHORITY,
    physicalStatePoolSize: getMenCp011PhysicalStateCatalog().length,
    recordCount: records.length,
    exactStemCount: new Set(exactStems).size,
    exactQuestionOptionCount: new Set(exactQuestionOptions).size,
    normalizedStemGroupCount: normalizedCounts.size,
    maximumNormalizedStemRepetition: Math.max(...normalizedCounts.values()),
    uniquePhysicalStateCount: new Set(stateKeys).size,
    uniqueRadialPairCount: new Set(radialPairs).size,
    uniqueHeightCount: new Set(heights).size,
    answerPositionCounts,
    answerPositionSequences,
    measurementProfileCounts,
    representationUnitMatrix,
    mixedUnitRecordCount: records.filter(
      (question) => question.measurementProfile.mixedUnits,
    ).length,
    blockers,
    publicationEligible: false,
  };
}

export function generateMenCp011ReviewBatch(
  seedNamespace = "men-cp011-exam-readiness-wave01",
  recordsPerPrototype = 12,
): MenCp011ReviewBatch {
  if (recordsPerPrototype !== 12) {
    throw new Error("The current MEN-CP-011 review batch authority requires exactly 12 records per prototype.");
  }

  const prototypeIds = getMenCp011FoundationPrototypeIds();
  const profiles = getMenCp011MeasurementProfiles();
  const records: MenCp011UnitRepresentationPackage[] = [];
  const usedExactStems = new Set<string>();
  const usedQuestionOptions = new Set<string>();
  const usedPhysicalStates = new Set<string>();
  const normalizedCounts = new Map<string, number>();

  prototypeIds.forEach((prototypeId, prototypeIndex) => {
    const positionCounts = [0, 0, 0, 0];
    const profileCounts = emptyProfileCounts();
    const preferredStart = prototypeIndex % LABELS.length;

    for (let sampleIndex = 0; sampleIndex < recordsPerPrototype; sampleIndex += 1) {
      let accepted: MenCp011UnitRepresentationPackage | null = null;
      const targetProfile = profiles[(sampleIndex + prototypeIndex) % profiles.length]!;
      const preferredPositions = Array.from({ length: LABELS.length }, (_, offset) =>
        (preferredStart + sampleIndex + offset) % LABELS.length,
      ).filter((position) => positionCounts[position]! < 3);

      for (const preferredPosition of preferredPositions) {
        for (let attempt = 0; attempt < 32768; attempt += 1) {
          const seed = `${seedNamespace}:${prototypeId}:${sampleIndex + 1}:profile-${targetProfile.id}:position-${preferredPosition}:candidate-${attempt}`;
          const candidate = generateMenCp011FoundationPrototype(prototypeId, seed);
          const stemKey = candidate.stem;
          const optionKey = questionOptionKey(candidate);
          const normalizedKey = normalizedStem(candidate.stem);
          const stateKey = menCp011PhysicalStateKey(candidate.state);

          if (candidate.measurementProfile.id !== targetProfile.id) continue;
          if (profileCounts[targetProfile.id] >= 3) continue;
          if (candidate.correctIndex !== preferredPosition) continue;
          if (positionCounts[preferredPosition]! >= 3) continue;
          if (usedExactStems.has(stemKey)) continue;
          if (usedQuestionOptions.has(optionKey)) continue;
          if (usedPhysicalStates.has(stateKey)) continue;
          if ((normalizedCounts.get(normalizedKey) ?? 0) >= 3) continue;

          accepted = candidate;
          usedExactStems.add(stemKey);
          usedQuestionOptions.add(optionKey);
          usedPhysicalStates.add(stateKey);
          normalizedCounts.set(normalizedKey, (normalizedCounts.get(normalizedKey) ?? 0) + 1);
          positionCounts[preferredPosition] += 1;
          profileCounts[targetProfile.id] += 1;
          break;
        }
        if (accepted) break;
      }

      if (!accepted) {
        throw new Error(
          `Unable to construct a unique-state, profile-balanced, position-balanced MEN-CP-011 review record for ${prototypeId} sample ${sampleIndex + 1}.`,
        );
      }
      records.push(accepted);
    }

    if (!positionCounts.every((count) => count === 3)) {
      throw new Error(`${prototypeId} must contribute exactly three correct answers in each option position.`);
    }
    if (!Object.values(profileCounts).every((count) => count === 3)) {
      throw new Error(`${prototypeId} must contribute exactly three records from every Phase 2B measurement profile.`);
    }
  });

  const audit = auditMenCp011ReviewBatch(records);
  if (duplicateCount(records.map((question) => question.stem)) !== 0) {
    throw new Error("The MEN-CP-011 review batch contains an exact duplicate stem.");
  }
  if (duplicateCount(records.map(questionOptionKey)) !== 0) {
    throw new Error("The MEN-CP-011 review batch contains an exact duplicate stem-and-option package.");
  }
  if (audit.uniquePhysicalStateCount !== records.length) {
    throw new Error("Every MEN-CP-011 Phase 2B review record must use a unique physical state.");
  }
  if (audit.physicalStatePoolSize !== 72) {
    throw new Error("The MEN-CP-011 physical-state authority must contain exactly 72 states.");
  }
  if (audit.maximumNormalizedStemRepetition > 3) {
    throw new Error("A normalized MEN-CP-011 stem skeleton appears more than three times.");
  }
  if (new Set(Object.values(audit.answerPositionSequences)).size !== prototypeIds.length) {
    throw new Error("MEN-CP-011 prototypes may not share the same answer-position sequence.");
  }
  if (!Object.values(audit.answerPositionCounts).every((count) => count === 12)) {
    throw new Error("The 48-record MEN-CP-011 review batch must balance A, B, C and D exactly.");
  }
  if (!Object.values(audit.measurementProfileCounts).every((count) => count === 12)) {
    throw new Error("Every Phase 2B measurement profile must appear exactly 12 times in the review batch.");
  }
  if (!Object.values(audit.representationUnitMatrix).every((row) =>
    Object.values(row).every((count) => count === 3)
  )) {
    throw new Error("Every existing pipe representation must be proved three times in every measurement profile.");
  }

  return { records, audit };
}
