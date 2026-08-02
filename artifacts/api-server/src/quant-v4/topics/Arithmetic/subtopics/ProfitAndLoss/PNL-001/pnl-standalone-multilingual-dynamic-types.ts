export const PNL_001_STANDALONE_DYNAMIC_LANGUAGES = ["en", "hi", "pa"] as const;

export type Pnl001StandaloneDynamicLanguage =
  (typeof PNL_001_STANDALONE_DYNAMIC_LANGUAGES)[number];

export type Pnl001NativeDynamicLanguage = Exclude<
  Pnl001StandaloneDynamicLanguage,
  "en"
>;
