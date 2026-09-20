export type PunjabiDifficulty = "Easy" | "Medium" | "Hard";

export interface PunjabiQuestionMetadata {
  engine: "punjabi-v1";
  packageId: "PUN-001";
  cpId: string;
  familyId: string;
  subtype: string;
  difficulty: PunjabiDifficulty;
  language: "pa-Guru";
  seed: number;
  authorityIds: readonly string[];
  generatorRevision: string;
  fingerprint: string;
  lifecycle: "REVIEW_ONLY";
}

export interface PunjabiGeneratedQuestion {
  id: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  explanation: string;
  difficulty: PunjabiDifficulty;
  metadata: PunjabiQuestionMetadata;
}

export interface PunjabiQuestionFamilyDefinition {
  familyId: string;
  subtype: string;
  name: string;
  targetDifficulties: readonly PunjabiDifficulty[];
  generate: (seed: number, difficulty: PunjabiDifficulty) => PunjabiGeneratedQuestion;
}
