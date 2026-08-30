import type { StcDifficulty, StcLocale, StcQlId } from "./types.ts";

export const STC_V2_SURFACE_ARCHETYPES = [
  "ADVICE_WARNING",
  "CONDITIONAL_TRIGGER",
  "CONTRAST_CONCESSION",
  "DIRECT_COMPARISON",
  "EVENT_SEQUENCE",
  "EVERYDAY_OBSERVATION",
  "FORECAST_OUTLOOK",
  "NUMERIC_SNAPSHOT",
  "ONE_LINE_FACT",
  "PUBLIC_NOTICE",
  "QUOTED_CLAIM",
  "RULE_ELIGIBILITY",
  "SURVEY_REPORT",
] as const;

export type StcV2SurfaceArchetype = (typeof STC_V2_SURFACE_ARCHETYPES)[number];
export type StcV2AnswerClass = "ONLY_I" | "ONLY_II" | "BOTH" | "NEITHER";

export interface StcV2EditorialAuthority {
  readonly id: string;
  readonly qlId: StcQlId;
  readonly difficulty: StcDifficulty;
  readonly surfaceArchetype: StcV2SurfaceArchetype;
  readonly statement: string;
  readonly conclusions: readonly [string, string];
  readonly answerClass: StcV2AnswerClass;
  readonly explanation: readonly [string, string];
}

export interface GeneratedStcV2EditorialQuestion {
  readonly chapterId: "STC-001";
  readonly version: "V2.1";
  readonly checkpointId: "STC-CP-001" | "STC-CP-002" | "STC-CP-003";
  readonly qlId: StcQlId;
  readonly scenarioId: string;
  readonly locale: StcLocale;
  readonly seed: number;
  readonly difficulty: StcDifficulty;
  readonly surfaceArchetype: StcV2SurfaceArchetype;
  readonly stem: string;
  readonly conclusions: readonly [string, string];
  readonly options: readonly [string, string, string, string];
  readonly correctIndex: number;
  readonly answerClass: StcV2AnswerClass;
  readonly explanation: string;
  readonly metadata: Readonly<{
    authority: "CURATED_EDITORIAL_ENTAILMENT_V2";
    surfaceArchetype: StcV2SurfaceArchetype;
    repeatedInstructionEmbeddedInStem: false;
    localizedByScenarioId: true;
    antiGamingScheduler: "STC_V2_1_NON_PERIODIC_16_SLOT";
    presentationSlot: number;
    scheduleBlock: number;
    conclusionsReversed: boolean;
    saturationReady: false;
    reviewOnly: true;
    questionBankWritable: false;
    testEligible: false;
    mockEligible: false;
    publicEligible: false;
    automaticPublication: false;
  }>;
}
