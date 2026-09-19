export type DirectionLocale = "en-IN" | "hi-IN" | "pa-IN";

export interface LocalizedDirectionOption {
  readonly value: unknown;
  readonly label: string;
  readonly errorLabel: string | null;
}

export interface LocalizedDirectionExplanation {
  readonly given: string;
  readonly steps: readonly string[];
  readonly resultLine: string;
  readonly conclusion: string;
  readonly diagram?: Readonly<Record<string, unknown>>;
}

export interface LocalizedDirectionQuestion {
  readonly locale: "hi-IN";
  readonly qlId: string;
  readonly checkpointId: string;
  readonly ruleId: string;
  readonly seed: number;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly stem: string;
  readonly structuredPrompt: Readonly<Record<string, unknown>>;
  readonly questionDiagram?: Readonly<Record<string, unknown>>;
  readonly options: readonly LocalizedDirectionOption[];
  readonly correctIndex: number;
  readonly correctAnswer: unknown;
  readonly explanation: LocalizedDirectionExplanation;
  readonly metadata: Readonly<Record<string, unknown>> & {
    readonly locale: "hi-IN";
    readonly sourceLocale: "en-IN";
    readonly localizationMode: "LANGUAGE_ADAPTED";
    readonly answerParityVerified: true;
  };
}
