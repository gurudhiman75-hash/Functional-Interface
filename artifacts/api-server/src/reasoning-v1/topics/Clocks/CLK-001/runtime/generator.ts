import {
  CLOCK_DESIGN_AUTHORITY,
  CLOCK_TASK_CATALOG,
  checkpointForClockTask,
  type ClockTaskId,
} from "./catalog";
import { auditClockItemDifficulty } from "./difficulty-item";
import {
  CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION,
  CLOCK_EFFECTIVE_SOURCE_AUDIT,
} from "./exam-natural-governance";
import { solveDirectClockFamily } from "./families/direct";
import { solveEventFamily } from "./families/events";
import { solveExamNaturalFaultyCoreFamily } from "./families/faulty-core-exam-natural";
import { solveExamNaturalFaultyEventFamily } from "./families/faulty-events-exam-natural";
import { solveFaultyClockFamily } from "./families/faulty";
import { solveExamNaturalHandInterchangeFamily } from "./families/hand-interchange-exam-natural";
import { solveRemainingPrototype } from "./families/remaining";
import { solveMotionOrAnglePrototype } from "./families/motion-angle";
import { solveRemediatedStrikeFamily } from "./families/strikes-remediated";
import { solveStrikeFamily } from "./families/strikes";
import { solveVisualAndSynthesisFamily } from "./families/visual-mixed";
import { normalizeSolvedClockPresentation } from "./presentation";
import type { SolvedClockPrototype } from "./solver-types";
import type { ClockQuestion, GenerateClockQuestionInput } from "./types";
import { ClockSeededRandom, makeOptions, stableFingerprint } from "./utils";

function solvePrototype(input: {
  taskId: ClockTaskId;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  seed: string;
  rng: ClockSeededRandom;
}): SolvedClockPrototype {
  const solved =
    solveEventFamily(input) ??
    solveExamNaturalFaultyEventFamily(input) ??
    solveExamNaturalFaultyCoreFamily(input) ??
    solveFaultyClockFamily(input) ??
    solveDirectClockFamily(input) ??
    solveMotionOrAnglePrototype(input) ??
    solveRemediatedStrikeFamily(input) ??
    solveStrikeFamily(input) ??
    solveExamNaturalHandInterchangeFamily(input) ??
    solveVisualAndSynthesisFamily(input) ??
    solveRemainingPrototype(input);
  if (!solved) {
    throw new Error(`No CLK-001 solver owns task ${input.taskId}.`);
  }
  if (solved.taskId !== input.taskId) {
    throw new Error(`CLK-001 solver returned mismatched task ${solved.taskId} for ${input.taskId}.`);
  }
  return normalizeSolvedClockPresentation(solved);
}

function assertContractEvidence(
  solved: SolvedClockPrototype,
  taskId: ClockTaskId,
  seed: string,
): void {
  if (!solved.contractEvidence) return;
  if (solved.answer.kind !== solved.contractEvidence.expectedAnswerKind) {
    throw new Error(
      `Answer-kind contract failed for ${taskId}/${seed}: expected ${solved.contractEvidence.expectedAnswerKind}, received ${solved.answer.kind}.`,
    );
  }
  for (const token of solved.contractEvidence.visibleStemTokens) {
    if (!solved.stem.includes(token)) {
      throw new Error(
        `Stem-scenario parity failed for ${taskId}/${seed}; missing visible token ${JSON.stringify(token)}.`,
      );
    }
  }
}

export function generateClockQuestion(input: GenerateClockQuestionInput): ClockQuestion {
  if (!CLOCK_TASK_CATALOG.some(([taskId]) => taskId === input.taskId)) {
    throw new Error(`Task ${input.taskId} is not in the sole-authority CLK-001 source-candidate catalog.`);
  }
  const locale = input.locale ?? "en-IN";
  if (locale !== "en-IN") {
    throw new Error(
      "CLK-001 localisation is blocked until the corrected English task authorities pass source saturation and human freeze.",
    );
  }

  const rng = new ClockSeededRandom(`${input.taskId}|${input.seed}|${locale}|CLK_V2_REMEDIATION`);
  const solved = solvePrototype({ taskId: input.taskId, locale, seed: input.seed, rng });
  assertContractEvidence(solved, input.taskId, input.seed);

  const correctOptionIndex = input.correctOptionIndex ?? (rng.int(0, 3) as 0 | 1 | 2 | 3);
  const options = makeOptions({ correct: solved.answer, distractors: solved.distractors, correctOptionIndex });
  const checkpointCode = checkpointForClockTask(input.taskId);
  const prototypeId = `CLK-V2-CANDIDATE-${input.taskId}`;
  const canonicalAnswerKey = solved.answer.semanticKey;
  const verifierAnswerKey = solved.verifierAnswer?.semanticKey ?? solved.answer.semanticKey;
  const hasDualAnswerOracle = solved.verifierAnswer !== undefined;
  if (hasDualAnswerOracle && canonicalAnswerKey !== verifierAnswerKey) {
    throw new Error(`Independent answer oracle disagrees for ${input.taskId}/${input.seed}/${locale}.`);
  }
  const fingerprint = stableFingerprint([
    CLOCK_DESIGN_AUTHORITY.sha256,
    input.taskId,
    input.seed,
    locale,
    solved.answer.semanticKey,
    JSON.stringify(solved.scenario),
  ]);
  const sourceAudit = CLOCK_EFFECTIVE_SOURCE_AUDIT[input.taskId];
  const disposition = CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[input.taskId];
  const difficultyAudit = auditClockItemDifficulty(input.taskId, solved);
  const difficulty = input.difficulty ?? difficultyAudit.difficulty;

  const question: ClockQuestion = {
    schemaVersion: "CLK_OPEN_DISCOVERY_V2",
    designAuthority: {
      file: CLOCK_DESIGN_AUTHORITY.file,
      sha256: CLOCK_DESIGN_AUTHORITY.sha256,
      policy: CLOCK_DESIGN_AUTHORITY.policy,
    },
    chapterCode: "CLK-001",
    checkpointCode,
    taskId: input.taskId,
    prototypeId,
    locale,
    seed: input.seed,
    difficulty,
    stem: solved.stem,
    media: solved.media,
    scenario: solved.scenario,
    answer: solved.answer,
    options,
    correctOptionIndex,
    explanation: solved.explanation,
    solveTrace: {
      canonicalAnswerKey,
      verifierAnswerKey,
      agreement: true,
      canonicalTrace: solved.canonicalTrace,
      verifierTrace: solved.verifierTrace,
      proofLevel: hasDualAnswerOracle ? "DUAL_ANSWER_ORACLE" : "STRUCTURAL_DISCOVERY_ONLY",
      contractOracle: solved.contractEvidence?.oracleName,
      stemScenarioParity: solved.contractEvidence ? true : undefined,
      answerContractVerified: solved.contractEvidence ? true : undefined,
      ...solved.solveTraceExtras,
    },
    discoveryAudit: {
      sourceEvidenceLevel: sourceAudit.evidenceLevel,
      sourceEvidenceRefs: sourceAudit.evidenceRefs,
      sourceAuditFlags: sourceAudit.flags,
      candidateDisposition: disposition.disposition,
      semanticCluster: disposition.cluster,
      declaredSourceRegistrySaturationComplete: true,
      sourceSaturationComplete: false,
      authorityFrozen: false,
      permanentQlEligible: false,
      difficultyModel: "ITEM_LEVEL_V1",
      difficultyBaselineScore: difficultyAudit.baselineScore,
      difficultyItemScore: difficultyAudit.itemScore,
      difficultyFactors: difficultyAudit.factors,
      difficultyHumanCalibrationRequired: true,
    },
    fingerprint,
    lifecycle: {
      discoveryStatus: "OPEN_EXECUTABLE_DISCOVERY",
      editorialStatus: "HUMAN_REVIEW_REQUIRED",
      solverProofStatus: hasDualAnswerOracle
        ? "DUAL_ANSWER_ORACLE_PASSED"
        : "STRUCTURAL_DISCOVERY_ONLY__REMEDIATION_REQUIRED",
      localeStatus: "ENGLISH_DISCOVERY__LOCALISATION_BLOCKED_UNTIL_ENGLISH_FREEZE",
      publicationStatus: "LOCKED",
      permanentQlId: null,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };

  if (question.options.length !== 4 || question.options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`Option contract failed for ${input.taskId}/${input.seed}/${locale}.`);
  }
  if (question.options[question.correctOptionIndex]?.semanticKey !== question.answer.semanticKey) {
    throw new Error(`Correct option binding failed for ${input.taskId}/${input.seed}/${locale}.`);
  }
  if (new Set(question.options.map((option) => option.semanticKey)).size !== 4) {
    throw new Error(`Semantic option uniqueness failed for ${input.taskId}/${input.seed}/${locale}.`);
  }
  if (new Set(question.options.map((option) => option.display)).size !== 4) {
    throw new Error(`Visible option uniqueness failed for ${input.taskId}/${input.seed}/${locale}.`);
  }
  if (question.discoveryAudit.candidateDisposition === "INTERNAL_VERIFICATION_ONLY" &&
      !question.discoveryAudit.sourceAuditFlags.includes("DO_NOT_PROMOTE_TO_LEARNER_QL")) {
    throw new Error(`Internal-only candidate ${input.taskId} is missing its do-not-promote guard.`);
  }
  return question;
}

export function generateClockCheckpointQuestions(input: {
  checkpointCode: ReturnType<typeof checkpointForClockTask>;
  seedPrefix: string;
  locale?: "en-IN" | "hi-IN" | "pa-IN";
}): ClockQuestion[] {
  return CLOCK_TASK_CATALOG
    .filter(([, checkpoint]) => checkpoint === input.checkpointCode)
    .map(([taskId], index) => generateClockQuestion({
      taskId,
      seed: `${input.seedPrefix}-${index}`,
      locale: input.locale,
      correctOptionIndex: (index % 4) as 0 | 1 | 2 | 3,
    }));
}
