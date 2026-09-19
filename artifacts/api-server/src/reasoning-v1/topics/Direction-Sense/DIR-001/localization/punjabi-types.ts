export interface LocalizedDirectionOptionPunjabi {
  readonly value: unknown;
  readonly label: string;
  readonly errorLabel: string | null;
}

export interface LocalizedDirectionExplanationPunjabi {
  readonly given: string;
  readonly steps: readonly string[];
  readonly resultLine: string;
  readonly conclusion: string;
  readonly diagram?: Readonly<Record<string, unknown>>;
}

export interface LocalizedDirectionQuestionPunjabi {
  readonly locale: "pa-IN";
  readonly qlId: string;
  readonly checkpointId: string;
  readonly ruleId: string;
  readonly seed: number;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly stem: string;
  readonly structuredPrompt: Readonly<Record<string, unknown>>;
  readonly questionDiagram?: Readonly<Record<string, unknown>>;
  readonly options: readonly LocalizedDirectionOptionPunjabi[];
  readonly correctIndex: number;
  readonly correctAnswer: unknown;
  readonly explanation: LocalizedDirectionExplanationPunjabi;
  readonly metadata: Readonly<Record<string, unknown>> & {
    readonly locale: "pa-IN";
    readonly sourceLocale: "en-IN";
    readonly localizationMode: "LANGUAGE_ADAPTED";
    readonly answerParityVerified: true;
  };
}
