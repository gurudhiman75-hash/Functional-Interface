import type {
  BlrDifficulty,
  BlrExplanationTrace,
  BlrGender,
  BlrRelationId,
  BlrRenderer,
  DirectRelationClue,
} from "../foundation/types";

export type BlrLineageSide = "PATERNAL" | "MATERNAL";

export type BlrExactLineageRelationId =
  | "PATERNAL_GRANDFATHER"
  | "PATERNAL_GRANDMOTHER"
  | "MATERNAL_GRANDFATHER"
  | "MATERNAL_GRANDMOTHER"
  | "PATERNAL_UNCLE"
  | "PATERNAL_AUNT"
  | "MATERNAL_UNCLE"
  | "MATERNAL_AUNT";

export type BlrCp001LineagePrototypeId =
  | "BLR-CP001-PROT-IDENTIFY-PERSON-BY-GENDER"
  | "BLR-CP001-PROT-EXACT-LINEAGE-RELATION";

export type BlrCp001LineageTaskKind =
  | "IDENTIFY_PERSON_BY_GENDER"
  | "SOLVE_EXACT_LINEAGE_RELATION";

export type BlrCp001LineageAnswerType =
  | "PERSON_NAME"
  | "EXACT_LINEAGE_RELATION";

export type BlrCp001LineageRuleId =
  | "BLOOD_GRAPH_GENDER"
  | "BLOOD_GRAPH_EXACT_LINEAGE";

export type BlrCp001LineageQuery =
  | {
      kind: "IDENTIFY_PERSON_BY_GENDER";
      targetGender: Exclude<BlrGender, "UNKNOWN">;
      candidatePersonIds: readonly string[];
    }
  | {
      kind: "SOLVE_EXACT_LINEAGE_RELATION";
      subjectId: string;
      referenceId: string;
    };

export interface BlrCp001LineageStructuredPrompt {
  clues: readonly DirectRelationClue[];
  personNames: Readonly<Record<string, string>>;
  query: BlrCp001LineageQuery;
}

export interface BlrCp001LineageOption {
  value: string;
  answerKey: string;
  isCorrect: boolean;
  errorLabel?: string;
}

export interface GeneratedBlrCp001LineagePrototypeQuestion {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-001";
  prototypeId: BlrCp001LineagePrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  ruleId: BlrCp001LineageRuleId;
  seed: number;
  locale: "en-IN";
  difficulty: BlrDifficulty;
  renderer: BlrRenderer;
  answerType: BlrCp001LineageAnswerType;
  stem: string;
  structuredPrompt: BlrCp001LineageStructuredPrompt;
  options: readonly BlrCp001LineageOption[];
  correctIndex: number;
  explanation: BlrExplanationTrace;
  metadata: {
    runtimeVersion: "blr-cp001-lineage-prototype-v1";
    taskKind: BlrCp001LineageTaskKind;
    scenarioId: string;
    correctAnswerKey: string;
    hiddenFingerprint: string;
    clueCount: number;
    personCount: number;
    graphEdgeCount: number;
    pathLength: number | null;
    targetGender: Exclude<BlrGender, "UNKNOWN"> | null;
    lineageSide: BlrLineageSide | null;
    broadRelationId: BlrRelationId | null;
    exactLineageRelationId: BlrExactLineageRelationId | null;
    ambiguityAccepted: true;
    independentSolverAgreed: true;
    familyGraphValid: true;
    distractorErrorLabels: readonly string[];
  };
}
