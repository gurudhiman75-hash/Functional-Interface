import type { StcLocale } from "./types.ts";

export type StcV2LocalizedLocale = Exclude<StcLocale, "en-IN">;

export interface StcV2LocalizedText {
  readonly statement: string;
  readonly conclusions: readonly [string, string];
  readonly explanation: readonly [string, string];
}

export interface StcV2LocalizationEntry {
  readonly id: string;
  readonly localized: Readonly<Record<StcV2LocalizedLocale, StcV2LocalizedText>>;
}
