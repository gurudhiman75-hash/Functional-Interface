import {
  auditMenCp011SurfaceBatch,
  generateMenCp011SurfaceQuestion as generateDraftSurfaceQuestion,
  getMenCp011SurfacePrototypeIds,
  type MenCp011SurfacePackage,
  type MenCp011SurfacePrototypeId,
} from "./surface-area";
import { getMenCp011MeasurementProfiles } from "./measurement-profiles";
import { menCp011PhysicalStateKey } from "./state-pool";

const LABELS = ["A", "B", "C", "D"] as const;
const BALANCED_POSITION_SEQUENCES = [
  [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3],
  [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0],
  [2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1],
  [3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2],
  [0, 0, 1, 1, 2, 2, 3, 3, 0, 1, 2, 3],
  [0, 1, 2, 3, 3, 2, 1, 0, 0, 1, 2, 3],
] as const;

function repairTex(text: string) {
  return text.replace(/\\pih\b/g, "\\pi\\times h");
}

function repairQuestion(
  draft: MenCp011SurfacePackage,
): MenCp011SurfacePackage {
  const explanation = {
    ...draft.explanation,
    keyRule: repairTex(draft.explanation.keyRule),
    steps: draft.explanation.steps.map((step) => ({
      ...step,
      title: repairTex(step.title),
      body: repairTex(step.body),
      equation: step.equation ? repairTex(step.equation) : undefined,
    })),
    shortcut: repairTex(draft.explanation.shortcut),
    traps: draft.explanation.traps.map(repairTex),
  };
  const learnerSolution = {
    ...draft.learnerSolution,
    formula: repairTex(draft.learnerSolution.formula),
    steps: draft.learnerSolution.steps.map(repairTex),
    finalAnswer: repairTex(draft.learnerSolution.finalAnswer),
    shortcut: repairTex(draft.learnerSolution.shortcut),
    wrongOptionAnalysis: draft.learnerSolution.wrongOptionAnalysis.map(repairTex),
  };
  const learnerText = [
    draft.stem,
    ...draft.options.map((option) => option.display),
    learnerSolution.formula,
    ...learnerSolution.steps,
    learnerSolution.finalAnswer,
    learnerSolution.shortcut,
    ...learnerSolution.wrongOptionAnalysis,
  ].join("\n");
  const checks = draft.validation.checks.map((check) =>
    check.name === "visible TeX lint"
      ? {
          ...check,
          passed: !learnerText.includes("\\pih") &&
            (learnerText.match(/\$/g) ?? []).length % 2 === 0,
          message: "Learner TeX must use balanced delimiters and separated multiplication after \\pi; the malformed command \\pih is forbidden.",
        }
      : check,
  );
  const repaired: MenCp011SurfacePackage = {
    ...draft,
    explanation,
    learnerSolution,
    renderSurfaces: {
      ...draft.renderSurfaces,
      solution: {
        ...draft.renderSurfaces.solution,
        explanation: learnerSolution,
      },
      admin: {
        ...draft.renderSurfaces.admin,
        explanation,
      },
    },
    validation: {
      valid: checks.every((check) => check.passed),
      checks,
    },
  };
  return repaired;
}

export function generateMenCp011SurfaceQuestion(
  prototypeId: MenCp011SurfacePrototypeId,
  seed: string,
) {
  return repairQuestion(generateDraftSurfaceQuestion(prototypeId, seed));
}

function normalizedStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/\s+/g, " ")
    .trim();
}

function questionOptionKey(question: MenCp011SurfacePackage) {
  return [
    question.stem,
    ...question.options.map((option) => option.display),
  ].join("\n");
}

function physicalStateKey(question: MenCp011SurfacePackage) {
  return menCp011PhysicalStateKey({
    outerRadius: question.state.outerRadius,
    innerRadius: question.state.innerRadius,
    height: question.state.height,
    thickness: question.state.outerRadius - question.state.innerRadius,
  });
}

export function generateMenCp011SurfaceReviewBatch(
  seedNamespace = "men-cp011-phase2c-surface-review-v2",
  recordsPerPrototype = 12,
) {
  if (recordsPerPrototype !== 12) {
    throw new Error("The Phase 2C review authority requires exactly 12 records per surface prototype.");
  }
  const profiles = getMenCp011MeasurementProfiles();
  const prototypeIds = getMenCp011SurfacePrototypeIds();
  const records: MenCp011SurfacePackage[] = [];
  const usedStates = new Set<string>();
  const usedStems = new Set<string>();
  const usedQuestionOptions = new Set<string>();
  const normalizedCounts = new Map<string, number>();

  prototypeIds.forEach((prototypeId, prototypeIndex) => {
    const profileCounts = new Map(profiles.map((profile) => [profile.id, 0]));
    const positionCounts = [0, 0, 0, 0];
    const positionSequence = BALANCED_POSITION_SEQUENCES[prototypeIndex]!;

    for (let sampleIndex = 0; sampleIndex < recordsPerPrototype; sampleIndex += 1) {
      const desiredProfile = profiles[sampleIndex % profiles.length]!;
      const desiredPosition = positionSequence[sampleIndex]!;
      let accepted: MenCp011SurfacePackage | null = null;

      for (let attempt = 0; attempt < 131072; attempt += 1) {
        const candidate = generateMenCp011SurfaceQuestion(
          prototypeId,
          `${seedNamespace}:${prototypeId}:${sampleIndex + 1}:profile-${desiredProfile.id}:position-${desiredPosition}:candidate-${attempt}`,
        );
        const stateKey = physicalStateKey(candidate);
        const stemKey = candidate.stem;
        const optionKey = questionOptionKey(candidate);
        const normalizedKey = normalizedStem(candidate.stem);

        if (!candidate.validation.valid || !candidate.verification.valid) continue;
        if (candidate.measurementProfile.id !== desiredProfile.id) continue;
        if (candidate.correctIndex !== desiredPosition) continue;
        if ((profileCounts.get(desiredProfile.id) ?? 0) >= 3) continue;
        if (positionCounts[desiredPosition]! >= 3) continue;
        if (usedStates.has(stateKey)) continue;
        if (usedStems.has(stemKey)) continue;
        if (usedQuestionOptions.has(optionKey)) continue;
        if ((normalizedCounts.get(normalizedKey) ?? 0) >= 3) continue;

        accepted = candidate;
        usedStates.add(stateKey);
        usedStems.add(stemKey);
        usedQuestionOptions.add(optionKey);
        normalizedCounts.set(
          normalizedKey,
          (normalizedCounts.get(normalizedKey) ?? 0) + 1,
        );
        profileCounts.set(
          desiredProfile.id,
          (profileCounts.get(desiredProfile.id) ?? 0) + 1,
        );
        positionCounts[desiredPosition] += 1;
        break;
      }

      if (!accepted) {
        throw new Error(
          `Unable to construct Phase 2C record ${sampleIndex + 1} for ${prototypeId}.`,
        );
      }
      records.push(accepted);
    }

    if (![...profileCounts.values()].every((count) => count === 3)) {
      throw new Error(`${prototypeId} must contribute three records for every measurement profile.`);
    }
    if (!positionCounts.every((count) => count === 3)) {
      throw new Error(`${prototypeId} must contribute three answers in every option position.`);
    }
  });

  const audit = auditMenCp011SurfaceBatch(records);
  if (audit.recordCount !== 72 || audit.uniquePhysicalStateCount !== 72) {
    throw new Error("Phase 2C requires 72 records using all 72 physical states exactly once.");
  }
  if (audit.exactStemCount !== 72 || audit.exactQuestionOptionCount !== 72) {
    throw new Error("Phase 2C review records may not contain exact duplicates.");
  }
  if (audit.maximumNormalizedStemRepetition > 3) {
    throw new Error("A normalized Phase 2C stem skeleton appears more than three times.");
  }
  if (!Object.values(audit.measurementProfileCounts).every((count) => count === 18)) {
    throw new Error("Every measurement profile must appear 18 times across Phase 2C.");
  }
  if (!Object.values(audit.prototypeProfileCounts).every((count) => count === 3)) {
    throw new Error("Every surface-prototype/profile cell must contain exactly three records.");
  }
  if (!Object.values(audit.answerPositionCounts).every((count) => count === 18)) {
    throw new Error("The 72-record Phase 2C batch must balance A, B, C and D exactly.");
  }
  if (new Set(Object.values(audit.answerPositionSequences)).size !== prototypeIds.length) {
    throw new Error("All six surface prototypes must use distinct balanced answer-position sequences.");
  }
  return { records, audit };
}

export {
  MEN_CP011_SURFACE_AREA_AUTHORITY,
  MEN_CP011_SURFACE_PROTOTYPES,
  auditMenCp011SurfaceBatch,
  getMenCp011SurfaceDefinition,
  getMenCp011SurfacePrototypeIds,
} from "./surface-area";
export type {
  MenCp011SurfaceAreaUnit,
  MenCp011SurfaceBatchAudit,
  MenCp011SurfaceDefinition,
  MenCp011SurfaceId,
  MenCp011SurfaceLearnerSolution,
  MenCp011SurfaceOption,
  MenCp011SurfacePackage,
  MenCp011SurfacePrototypeId,
  MenCp011SurfaceSolveMode,
  MenCp011SurfaceState,
} from "./surface-area";
