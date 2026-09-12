export type Com001ReviewQuestion = {
  questionId: string;
  qlId: string;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  solverAuthority: string;
  reviewOnly: true;
  runtimeRegistered: false;
};

export type Com001ReviewGenerationRequest = {
  qlId: string;
  seed: string;
};
