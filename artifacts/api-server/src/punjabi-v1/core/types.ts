export type PunjabiDifficulty = "Easy" | "Medium" | "Hard";
export type PunjabiLanguage = "pa" | "pa-Guru";

export interface PunjabiQuestionMetadata {
  engine: "punjabi-v1";
  packageId: string;
  cpId: string;
  familyId: string;
  difficulty: PunjabiDifficulty;
  language: PunjabiLanguage;
  seed: number;
  authorityIds: readonly string[];
  generatorRevision: string;
  fingerprint: string;
  tags?: readonly string[];
}

export interface PunjabiQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  misconceptionTag?: string;
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

export interface PunjabiReviewBatch {
  batchId: string;
  packageId: string;
  cpId: string;
  generatedAt: string;
  totalQuestions: number;
  distribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  questions: readonly PunjabiGeneratedQuestion[];
}

export interface PunjabiQuestionFamilyDefinition {
  familyId: string;
  name: string;
  description: string;
  targetDifficulties: readonly PunjabiDifficulty[];
  generate: (seed: number, difficulty: PunjabiDifficulty) => PunjabiGeneratedQuestion;
}

export interface PunjabiCheckpointDefinition {
  cpId: string;
  packageId: string;
  name: string;
  nameGurmukhi: string;
  description: string;
  families: readonly PunjabiQuestionFamilyDefinition[];
}
