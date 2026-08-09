import type {
  CircularCaseletRecord,
  CircularConstraint,
  CircularDiagramScene,
  CircularOption,
  CircularSemanticValue,
} from "../cp003/types.ts";

export interface SeatingStudioClueRecord {
  readonly clueId: string;
  readonly text: string;
  readonly typedConstraint: CircularConstraint;
  readonly classification: "BLUEPRINT" | "SUPPORTING";
}

export interface SeatingStudioParentRecord {
  readonly caseletId: string;
  readonly chapterId: "REAS-SEA";
  readonly packageId: "SEA-001" | "SEA-002" | "SEA-003";
  readonly checkpointId: string;
  readonly blueprintAuthorityId: string;
  readonly seed: string;
  readonly locale: "en-IN" | "hi-IN" | "pa-IN";
  readonly setupText: string;
  readonly clueRecords: readonly SeatingStudioClueRecord[];
  readonly diagramScene?: CircularDiagramScene;
  readonly topologySnapshot: unknown;
  readonly hiddenStateFingerprint: string;
  readonly clueSetFingerprint: string;
  readonly symmetryPolicy: Readonly<Record<string, unknown>>;
  readonly solutionPolicy: "UNIQUE_CLASS" | "CONTROLLED_MODEL_SET";
  readonly solutionClassCount: number;
  readonly solverOracleAgreement: boolean;
  readonly queryFactFingerprints: readonly string[];
  readonly checkpointSkillCoverage: readonly string[];
  readonly crossQuestionLeakagePassed: boolean;
  readonly queryMixFreezeStatus: "OPEN" | "FROZEN";
  readonly proofTrace: readonly unknown[];
  readonly childQuestionIds: readonly string[];
  readonly reviewStatus: "DISCOVERY" | "APPROVED" | "REWRITE" | "REJECT";
  readonly englishFreezeStatus: "NOT_STARTED" | "IN_REVIEW" | "FROZEN";
  readonly bankStatus: "LOCKED" | "WRITABLE";
  readonly testEligibility: boolean;
  readonly publiclyPublishable: boolean;
}

export interface SeatingStudioOptionRecord {
  readonly optionOrder: 1 | 2 | 3 | 4;
  readonly display: string;
  readonly semanticValue: CircularSemanticValue;
  readonly semanticFingerprint: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?: string;
  readonly recomputation: Readonly<Record<string, unknown>>;
  readonly explanation: string;
}

export interface SeatingStudioChildRecord {
  readonly questionId: string;
  readonly caseletId: string;
  readonly questionOrder: 1 | 2 | 3 | 4 | 5;
  readonly queryContractId: string;
  readonly questionText: string;
  readonly answerType: string;
  readonly answerProjection: CircularSemanticValue;
  readonly modelSetUsed: readonly string[];
  readonly options: readonly SeatingStudioOptionRecord[];
  readonly correctIndex: 0 | 1 | 2 | 3;
  readonly questionExplanation: string;
  readonly difficulty: {
    readonly status: "UNASSESSED";
    readonly featureVector: Readonly<Record<string, number>>;
  };
  readonly reviewStatus: "DISCOVERY" | "APPROVED" | "REWRITE" | "REJECT";
}

export interface SeatingStudioCaseletBundle {
  readonly parent: SeatingStudioParentRecord;
  readonly children: readonly SeatingStudioChildRecord[];
}

function projectOption(option: CircularOption, index: number): SeatingStudioOptionRecord {
  return {
    optionOrder: (index + 1) as 1 | 2 | 3 | 4,
    display: option.display,
    semanticValue: option.semanticValue,
    semanticFingerprint: option.semanticFingerprint,
    isCorrect: option.isCorrect,
    ...(option.misconceptionId ? { misconceptionId: option.misconceptionId } : {}),
    recomputation: option.recomputation,
    explanation: option.explanation,
  };
}

export function projectCircularCaseletToQuestionStudio(caselet: CircularCaseletRecord): SeatingStudioCaseletBundle {
  const blueprintIds = new Set(caselet.blueprintCoverageConstraintIds);
  const clueRecords = caselet.constraints.map((constraint, index): SeatingStudioClueRecord => ({
    clueId: constraint.id,
    text: caselet.clueTexts[index] ?? "",
    typedConstraint: constraint,
    classification: blueprintIds.has(constraint.id) ? "BLUEPRINT" : "SUPPORTING",
  }));

  const childQuestionIds = caselet.children.map((child) => `${caselet.caseletId}-Q${child.questionOrder}`);
  const children = caselet.children.map((child, index): SeatingStudioChildRecord => ({
    questionId: childQuestionIds[index] as string,
    caseletId: caselet.caseletId,
    questionOrder: child.questionOrder,
    queryContractId: child.queryContractId,
    questionText: child.text,
    answerType: child.answerType,
    answerProjection: child.answer,
    modelSetUsed: caselet.solverOracleAgreement.productionKeys,
    options: child.options.map(projectOption),
    correctIndex: child.answerIndex,
    questionExplanation: child.explanation,
    difficulty: { status: "UNASSESSED", featureVector: {} },
    reviewStatus: "DISCOVERY",
  }));

  return {
    parent: {
      caseletId: caselet.caseletId,
      chapterId: caselet.chapterId,
      packageId: caselet.packageId,
      checkpointId: caselet.checkpointId,
      blueprintAuthorityId: caselet.blueprintAuthorityId,
      seed: caselet.seed,
      locale: caselet.locale,
      setupText: caselet.setupText,
      clueRecords,
      diagramScene: caselet.diagram,
      topologySnapshot: caselet.topologySnapshot,
      hiddenStateFingerprint: caselet.hiddenStateFingerprint,
      clueSetFingerprint: caselet.clueSetFingerprint,
      symmetryPolicy: {
        rotationEquivalent: caselet.topologySnapshot.landmark === undefined,
        landmarkAnchored: caselet.topologySnapshot.landmark !== undefined,
      },
      solutionPolicy: caselet.solutionPolicy,
      solutionClassCount: caselet.solutionClassCount,
      solverOracleAgreement: caselet.solverOracleAgreement.passed,
      queryFactFingerprints: caselet.queryFactFingerprints,
      checkpointSkillCoverage: caselet.checkpointSkillCoverage,
      crossQuestionLeakagePassed: caselet.crossQuestionLeakagePassed,
      queryMixFreezeStatus: "OPEN",
      proofTrace: caselet.proofTrace,
      childQuestionIds,
      reviewStatus: "DISCOVERY",
      englishFreezeStatus: "NOT_STARTED",
      bankStatus: "LOCKED",
      testEligibility: caselet.lifecycle.testEligible,
      publiclyPublishable: caselet.lifecycle.publiclyPublishable,
    },
    children,
  };
}
