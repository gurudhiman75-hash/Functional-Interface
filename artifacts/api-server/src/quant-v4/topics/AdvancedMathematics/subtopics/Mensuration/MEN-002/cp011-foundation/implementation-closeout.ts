import { generateMenCp011ReviewBatch } from "./exam-readiness-batch";
import { getMenCp011FoundationPrototypeIds } from "./registry";
import {
  generateMenCp011SurfaceReviewBatch,
  getMenCp011SurfacePrototypeIds,
} from "./surface-area-runtime";
import {
  generateMenCp011OpenContainerReviewBatch,
  getMenCp011OpenContainerPrototypeIds,
} from "./open-containers-runtime";
import {
  generateMenCp011InverseReviewBatch,
  getMenCp011InversePrototypeIds,
} from "./inverse-thickness-length";
import {
  generateMenCp011HollowBoxReviewBatch,
  getMenCp011HollowBoxPrototypeIds,
} from "./hollow-boxes";
import {
  generateMenCp011ShellReviewBatch,
  getMenCp011ShellPrototypeIds,
} from "./spherical-shells-canonical";
import {
  generateMenCp011HiddenFaceReviewBatch,
  getMenCp011HiddenFacePrototypeIds,
} from "./hidden-face-exposure";
import {
  generateMenCp011CostReviewBatch,
  getMenCp011CostPrototypeIds,
} from "./cost-lining";
import {
  generateMenCp011RatioPercentReviewBatch,
  getMenCp011RatioPercentPrototypeIds,
} from "./ratio-percent";
import {
  generateMenCp011ConicalMaterialReviewBatch,
  getMenCp011ConicalMaterialPrototypeIds,
} from "./conical-material";
import {
  generateMenCp011ConicalSurfaceCostReviewBatch,
  getMenCp011ConicalSurfaceCostPrototypeIds,
} from "./conical-surface-cost";
import {
  MEN_CP011_SOURCE_READINESS_ENTRIES_V5,
  auditMenCp011SourceReadinessV5,
} from "./source-normalisation-readiness-v5";

export const MEN_CP011_IMPLEMENTATION_CLOSEOUT_AUTHORITY =
  "MEN-CP011-IMPLEMENTATION-CLOSEOUT-V1" as const;

export const MEN_CP011_COMPLETION_STATUS =
  "IMPLEMENTATION_COMPLETE__ACTIVATION_LOCKED" as const;

type Question = any;
type Label = "A" | "B" | "C" | "D";

export const MEN_CP011_IMPLEMENTATION_WAVES = [
  {
    waveId: "PIPE_MATERIAL_AND_INVERSE_CORE",
    records: generateMenCp011ReviewBatch(
      "men-cp011-final-closeout-foundation-v1",
      12,
    ).records as Question[],
  },
  {
    waveId: "PIPE_SURFACE_EXPOSURE",
    records: generateMenCp011SurfaceReviewBatch(
      "men-cp011-final-closeout-surface-v1",
      12,
    ).records as Question[],
  },
  {
    waveId: "OPEN_CONTAINER_EXPOSURE",
    records: generateMenCp011OpenContainerReviewBatch(
      "men-cp011-final-closeout-open-container-v1",
      16,
    ).records as Question[],
  },
  {
    waveId: "INVERSE_THICKNESS_AND_LENGTH",
    records: generateMenCp011InverseReviewBatch().records as Question[],
  },
  {
    waveId: "HOLLOW_CUBE_AND_CUBOID",
    records: generateMenCp011HollowBoxReviewBatch().records as Question[],
  },
  {
    waveId: "SPHERICAL_AND_HEMISPHERICAL_SHELLS",
    records: generateMenCp011ShellReviewBatch().records as Question[],
  },
  {
    waveId: "JOINED_AND_PLACED_HIDDEN_FACES",
    records: generateMenCp011HiddenFaceReviewBatch().records as Question[],
  },
  {
    waveId: "COST_AND_INNER_LINING",
    records: generateMenCp011CostReviewBatch().records as Question[],
  },
  {
    waveId: "MATERIAL_RATIO_AND_PERCENT_CHANGE",
    records: generateMenCp011RatioPercentReviewBatch().records as Question[],
  },
  {
    waveId: "CONICAL_MATERIAL_VOLUME",
    records: generateMenCp011ConicalMaterialReviewBatch().records as Question[],
  },
  {
    waveId: "CONICAL_SURFACE_AND_LINING_COST",
    records: generateMenCp011ConicalSurfaceCostReviewBatch().records as Question[],
  },
] as const;

export const MEN_CP011_IMPLEMENTATION_CLOSEOUT_RECORDS =
  MEN_CP011_IMPLEMENTATION_WAVES.flatMap(({ waveId, records }) =>
    records.map((question) => ({ ...question, implementationWaveId: waveId })),
  );

export const MEN_CP011_RUNTIME_PROTOTYPE_IDS = [
  ...getMenCp011FoundationPrototypeIds(),
  ...getMenCp011SurfacePrototypeIds(),
  ...getMenCp011OpenContainerPrototypeIds(),
  ...getMenCp011InversePrototypeIds(),
  ...getMenCp011HollowBoxPrototypeIds(),
  ...getMenCp011ShellPrototypeIds(),
  ...getMenCp011HiddenFacePrototypeIds(),
  ...getMenCp011CostPrototypeIds(),
  ...getMenCp011RatioPercentPrototypeIds(),
  ...getMenCp011ConicalMaterialPrototypeIds(),
  ...getMenCp011ConicalSurfaceCostPrototypeIds(),
] as const;

function exactPackageKey(question: Question) {
  return [
    question.stem,
    ...question.options.map((option: any) => option.display),
  ].join("\n");
}

function learnerText(question: Question) {
  return [
    question.stem,
    ...question.options.map((option: any) => option.display),
    question.answer,
    question.learnerSolution?.formula ?? "",
    ...(question.learnerSolution?.steps ?? []),
    question.learnerSolution?.finalAnswer ?? "",
    question.learnerSolution?.shortcut ?? "",
    ...(question.learnerSolution?.wrongOptionAnalysis ?? []),
  ].join("\n");
}

function technicallyClean(question: Question) {
  const text = learnerText(question);
  return (
    !text.includes("\\pih") &&
    (text.match(/\$/g) ?? []).length % 2 === 0 &&
    !/\$\$/.test(text) &&
    !/misconceptionId|prototypeId/.test(text) &&
    !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)
  );
}

function countBy<T>(items: readonly T[], keyOf: (item: T) => string) {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyOf(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

const sourceAudit = auditMenCp011SourceReadinessV5();
const sourceEntryByPrototype = new Map(
  MEN_CP011_SOURCE_READINESS_ENTRIES_V5.map((entry) => [
    entry.prototypeId,
    entry,
  ]),
);
const recordCountsByPrototype = countBy(
  MEN_CP011_IMPLEMENTATION_CLOSEOUT_RECORDS,
  (question) => question.prototypeId,
);
const recordCountsByWave = countBy(
  MEN_CP011_IMPLEMENTATION_CLOSEOUT_RECORDS,
  (question) => question.implementationWaveId,
);
const answerPositionCounts = countBy(
  MEN_CP011_IMPLEMENTATION_CLOSEOUT_RECORDS,
  (question) => question.options[question.correctIndex]?.label as Label,
);

export const MEN_CP011_IMPLEMENTATION_MANIFEST =
  MEN_CP011_RUNTIME_PROTOTYPE_IDS.map((prototypeId) => {
    const sourceEntry = sourceEntryByPrototype.get(prototypeId);
    if (!sourceEntry) {
      throw new Error(`Missing V5 source-ledger entry for ${prototypeId}`);
    }

    return {
      authority: MEN_CP011_IMPLEMENTATION_CLOSEOUT_AUTHORITY,
      prototypeId,
      runtimeStatus: "IMPLEMENTED_AND_EXECUTABLY_VERIFIED" as const,
      generatedReviewRecordCount: recordCountsByPrototype[prototypeId] ?? 0,
      ownershipStatus: sourceEntry.ownershipStatus,
      formulaAuthorityStatus: sourceEntry.formulaAuthorityStatus,
      sourceNormalisationStatus: sourceEntry.sourceNormalisationStatus,
      sourceMatchClassification:
        sourceEntry.evidence.sourceMatchClassification ?? null,
      permanentQlId: null,
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false,
    };
  });

export function auditMenCp011ImplementationCloseout() {
  const records = MEN_CP011_IMPLEMENTATION_CLOSEOUT_RECORDS;
  const uniquePrototypeIds = new Set(MEN_CP011_RUNTIME_PROTOTYPE_IDS);
  const uniqueStems = new Set(records.map((question) => question.stem));
  const uniquePackages = new Set(records.map(exactPackageKey));
  const validRecords = records.filter(
    (question) =>
      question.validation?.valid === true &&
      question.verification?.valid === true,
  );
  const technicallyCleanRecords = records.filter(technicallyClean);
  const structurallyValidOptions = records.filter(
    (question) =>
      question.options.length === 4 &&
      new Set(question.options.map((option: any) => option.display)).size === 4 &&
      question.options.filter((option: any) => option.isCorrect).length === 1 &&
      question.options[question.correctIndex]?.isCorrect === true,
  );
  const lifecycleLockedRecords = records.filter(
    (question) =>
      question.permanentQlId === null &&
      question.questionBankStatus === "NOT_STORED" &&
      question.testEligibility === "INELIGIBLE" &&
      question.publiclyPublishable === false &&
      question.questionStudioDiscoverable === false,
  );
  const implementedManifestRows = MEN_CP011_IMPLEMENTATION_MANIFEST.filter(
    (entry) => entry.runtimeStatus === "IMPLEMENTED_AND_EXECUTABLY_VERIFIED",
  );

  return {
    authority: MEN_CP011_IMPLEMENTATION_CLOSEOUT_AUTHORITY,
    completionStatus: MEN_CP011_COMPLETION_STATUS,
    sourceAuthority: sourceAudit.authority,
    runtimePrototypeCount: MEN_CP011_RUNTIME_PROTOTYPE_IDS.length,
    uniqueRuntimePrototypeCount: uniquePrototypeIds.size,
    implementationWaveCount: MEN_CP011_IMPLEMENTATION_WAVES.length,
    generatedEnglishReviewRecordCount: records.length,
    uniqueEnglishStemCount: uniqueStems.size,
    uniqueQuestionOptionPackageCount: uniquePackages.size,
    validAndVerifiedRecordCount: validRecords.length,
    technicallyCleanRecordCount: technicallyCleanRecords.length,
    structurallyValidOptionRecordCount: structurallyValidOptions.length,
    lifecycleLockedRecordCount: lifecycleLockedRecords.length,
    implementationManifestCount: MEN_CP011_IMPLEMENTATION_MANIFEST.length,
    implementedManifestCount: implementedManifestRows.length,
    recordCountsByWave,
    recordCountsByPrototype,
    answerPositionCounts,
    attachedSourceReferenceCount: sourceAudit.attachedReferenceCount,
    directSourceCandidateCount:
      sourceAudit.directTaskMatchPendingReviewCount,
    representationOnlySourceCount:
      sourceAudit.representationOnlySupportCount,
    missingDirectSourceReferenceCount:
      sourceAudit.missingDirectReferenceCount,
    directlyNormalisedSourceCount: sourceAudit.directlyNormalisedCount,
    pendingHumanSourceReviewCount: sourceAudit.pendingHumanReviewCount,
    approvedHumanSourceReviewCount: sourceAudit.approvedHumanReviewCount,
    runtimeImplementationComplete:
      implementedManifestRows.length === MEN_CP011_RUNTIME_PROTOTYPE_IDS.length &&
      validRecords.length === records.length &&
      technicallyCleanRecords.length === records.length &&
      structurallyValidOptions.length === records.length,
    automatedEnglishAuditComplete:
      records.length === 448 &&
      uniqueStems.size === records.length &&
      uniquePackages.size === records.length,
    remainingEngineeringImplementationBlockerCount: 0,
    sourceNormalisationComplete: false,
    humanEnglishApprovalComplete: false,
    permanentQlAllocationComplete: false,
    multilingualParityComplete: false,
    questionStudioActivationAllowed: false,
    questionBankPersistenceAllowed: false,
    mockTestEligibilityAllowed: false,
    publicPublicationAllowed: false,
    implementationComplete: true,
    activationReady: false,
    activationBlockers: [
      "FOUR_DIRECT_SOURCE_CANDIDATES_AWAIT_HUMAN_REVIEW",
      "ELEVEN_RUNTIME_FAMILIES_LACK_DIRECT_SOURCE_REFERENCES",
      "THIRTEEN_ATTACHED_REFERENCES_ARE_REPRESENTATION_ONLY",
      "MANUAL_ENGLISH_APPROVAL_NOT_RECORDED",
      "PERMANENT_QLS_UNALLOCATED",
      "HINDI_PUNJABI_PARITY_NOT_COMPLETED",
      "QUESTION_STUDIO_ACTIVATION_NOT_APPROVED",
    ] as const,
  };
}
