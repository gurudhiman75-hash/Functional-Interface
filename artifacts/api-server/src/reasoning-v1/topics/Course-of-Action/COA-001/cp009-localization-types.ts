export type CoaCp009FullLocale = "hi-IN" | "pa-IN";

export type CoaCp009LocalizedActionText = Readonly<{
  semanticActionId: string;
  text: string;
  explanation: string;
}>;

export type CoaCp009LocalizedScenarioText = Readonly<{
  semanticAuthorityId: string;
  locale: CoaCp009FullLocale;
  statement: string;
  actions: readonly [CoaCp009LocalizedActionText, CoaCp009LocalizedActionText];
}>;

export type CoaCp009LocalizedThreeActionText = Readonly<{
  semanticAuthorityId: string;
  locale: CoaCp009FullLocale;
  statement: string;
  actions: readonly [
    CoaCp009LocalizedActionText,
    CoaCp009LocalizedActionText,
    CoaCp009LocalizedActionText,
  ];
}>;

export type CoaCp009LocalizedEitherText = Readonly<{
  semanticAuthorityId: string;
  locale: CoaCp009FullLocale;
  statement: string;
  actions: readonly [CoaCp009LocalizedActionText, CoaCp009LocalizedActionText];
  pairReason: string;
}>;
