export type IneLocale = "en-IN" | "hi-IN" | "pa-IN";
export type IneTranslatedLocale = Exclude<IneLocale, "en-IN">;

export interface IneEnglishReviewRow {
  checkpointId?: string;
  recordId?: string;
  authorityId: string;
  seed: number;
  difficulty: string;
  deliveryProfile?: string;
  releaseTier?: string;
  examApplicability?: string;
  stem: string;
  statements?: readonly string[];
  conclusions?: readonly string[];
  conclusion?: string;
  codeKey?: readonly string[];
  evidence?: readonly string[];
  options: readonly string[];
  correctIndex?: number;
  correctOption: string;
  explanation?: string;
  mockExplanation?: string;
  mockSolution?: string;
  permanentQlId?: null;
  questionStudioVisible?: false;
}

export interface LocalizedIneQuestion {
  checkpointId: string;
  sourceRecordId: string;
  authorityId: string;
  seed: number;
  locale: IneTranslatedLocale;
  difficulty: string;
  deliveryProfile: string;
  examApplicability?: string;
  stem: string;
  statements: readonly string[];
  conclusions: readonly string[];
  codeKey: readonly string[];
  evidence: readonly string[];
  options: readonly string[];
  correctIndex: number;
  correctOption: string;
  explanation: string;
  permanentQlId: null;
  questionStudioVisible: false;
}
