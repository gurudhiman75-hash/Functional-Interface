import {
  MEN_CP011_OPEN_CONTAINER_AUTHORITY,
  MEN_CP011_OPEN_CONTAINER_PROTOTYPES,
  MEN_CP011_OPEN_CUBOID_DISPOSITION,
  auditMenCp011OpenContainerBatch,
  generateMenCp011OpenContainerQuestion as generateDraftOpenContainerQuestion,
  getMenCp011OpenContainerDefinition,
  getMenCp011OpenContainerPrototypeIds,
  proveMenCp011OpenCuboidOwnership,
  type MenCp011OpenContainerBatchAudit,
  type MenCp011OpenContainerDefinition,
  type MenCp011OpenContainerGenerationConstraints,
  type MenCp011OpenContainerPackage,
  type MenCp011OpenContainerPrototypeId,
} from "./open-containers";

export {
  MEN_CP011_OPEN_CONTAINER_AUTHORITY,
  MEN_CP011_OPEN_CONTAINER_PROTOTYPES,
  MEN_CP011_OPEN_CUBOID_DISPOSITION,
  auditMenCp011OpenContainerBatch,
  getMenCp011OpenContainerDefinition,
  getMenCp011OpenContainerPrototypeIds,
  proveMenCp011OpenCuboidOwnership,
};
export type {
  MenCp011OpenContainerBatchAudit,
  MenCp011OpenContainerDefinition,
  MenCp011OpenContainerGenerationConstraints,
  MenCp011OpenContainerPackage,
  MenCp011OpenContainerPrototypeId,
};

function isRecoverableStateCollision(error: unknown) {
  return (
    error instanceof Error &&
    error.message.includes("produced duplicate option values")
  );
}

export function generateMenCp011OpenContainerQuestion(
  prototypeId: MenCp011OpenContainerPrototypeId,
  seed: string,
  constraints: MenCp011OpenContainerGenerationConstraints = {},
): MenCp011OpenContainerPackage {
  for (let attempt = 0; attempt < 128; attempt += 1) {
    const candidateSeed =
      attempt === 0 ? seed : `${seed}:valid-state-retry-${attempt}`;
    try {
      return generateDraftOpenContainerQuestion(
        prototypeId,
        candidateSeed,
        constraints,
      );
    } catch (error) {
      if (!isRecoverableStateCollision(error)) throw error;
    }
  }
  throw new Error(
    `Unable to construct an option-distinct open-container state for ${prototypeId} and seed ${seed}.`,
  );
}

function normalizedStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/\s+/g, " ")
    .trim();
}

function physicalStateKey(question: MenCp011OpenContainerPackage) {
  return [
    question.state.linearUnit,
    question.state.radius,
    question.state.height,
  ].join("|");
}

function questionOptionKey(question: MenCp011OpenContainerPackage) {
  return [question.stem, ...question.options.map((option) => option.display)].join(
    "\n",
  );
}

export function generateMenCp011OpenContainerReviewBatch(
  seedNamespace = "men-cp011-open-container-wave01-review-v1",
  recordsPerPrototype = 16,
): {
  records: MenCp011OpenContainerPackage[];
  audit: MenCp011OpenContainerBatchAudit;
} {
  if (recordsPerPrototype !== 16) {
    throw new Error(
      "Open-container Wave 01 requires exactly 16 review records per runtime prototype.",
    );
  }
  const profiles = [
    { linearUnit: "cm", piPolicy: "EXACT_PI" },
    { linearUnit: "cm", piPolicy: "PI_22_OVER_7" },
    { linearUnit: "m", piPolicy: "EXACT_PI" },
    { linearUnit: "m", piPolicy: "PI_22_OVER_7" },
  ] as const;
  const positionSequences = [
    [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3],
    [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0],
  ] as const;
  const records: MenCp011OpenContainerPackage[] = [];
  const usedStates = new Set<string>();
  const usedStems = new Set<string>();
  const usedQuestionOptions = new Set<string>();
  const normalizedCounts = new Map<string, number>();

  getMenCp011OpenContainerPrototypeIds().forEach(
    (prototypeId, prototypeIndex) => {
      for (
        let sampleIndex = 0;
        sampleIndex < recordsPerPrototype;
        sampleIndex += 1
      ) {
        const profile = profiles[sampleIndex % profiles.length]!;
        const correctIndex = positionSequences[prototypeIndex]![
          sampleIndex
        ]! as 0 | 1 | 2 | 3;
        let accepted: MenCp011OpenContainerPackage | null = null;
        for (let attempt = 0; attempt < 4096; attempt += 1) {
          const candidate = generateMenCp011OpenContainerQuestion(
            prototypeId,
            `${seedNamespace}:${prototypeId}:${sampleIndex + 1}:candidate-${attempt}`,
            { ...profile, correctIndex },
          );
          const stateKey = physicalStateKey(candidate);
          const optionKey = questionOptionKey(candidate);
          const normalized = normalizedStem(candidate.stem);
          if (!candidate.validation.valid || !candidate.verification.valid) continue;
          if (usedStates.has(stateKey)) continue;
          if (usedStems.has(candidate.stem)) continue;
          if (usedQuestionOptions.has(optionKey)) continue;
          if ((normalizedCounts.get(normalized) ?? 0) >= 4) continue;
          accepted = candidate;
          usedStates.add(stateKey);
          usedStems.add(candidate.stem);
          usedQuestionOptions.add(optionKey);
          normalizedCounts.set(
            normalized,
            (normalizedCounts.get(normalized) ?? 0) + 1,
          );
          break;
        }
        if (!accepted) {
          throw new Error(
            `Unable to construct ${prototypeId} review record ${sampleIndex + 1}.`,
          );
        }
        records.push(accepted);
      }
    },
  );

  const audit = auditMenCp011OpenContainerBatch(records);
  if (audit.recordCount !== 32 || audit.uniquePhysicalStateCount !== 32) {
    throw new Error(
      "Open-container Wave 01 requires 32 records using 32 distinct physical states.",
    );
  }
  if (audit.exactStemCount !== 32 || audit.exactQuestionOptionCount !== 32) {
    throw new Error(
      "Open-container Wave 01 review records must be exact-package unique.",
    );
  }
  if (audit.maximumNormalizedStemRepetition > 4) {
    throw new Error(
      "An open-container normalized stem may not appear more than four times.",
    );
  }
  if (
    !Object.values(audit.answerPositionCounts).every((count) => count === 8)
  ) {
    throw new Error(
      "The 32-record batch must balance A, B, C and D at eight each.",
    );
  }
  if (!Object.values(audit.profileCounts).every((count) => count === 8)) {
    throw new Error(
      "Each unit/pi profile must appear eight times across the batch.",
    );
  }
  if (
    !Object.values(audit.prototypeProfileCounts).every((count) => count === 4)
  ) {
    throw new Error(
      "Each prototype/profile cell must contain exactly four records.",
    );
  }
  return { records, audit };
}
