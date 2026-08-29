import type { StaAnswerSet, StaOption, StaQuestion, StaRenderedCandidate } from "./types.ts";

export type StaLocalizedLocale = "hi-IN" | "pa-IN";

export interface StaLocalizedCandidateCopy {
  readonly textVariants: readonly [string, ...string[]];
  readonly rationale: string;
}

export interface StaLocalizedScenarioCopy {
  readonly statementVariants: readonly [string, ...string[]];
  readonly candidates: Readonly<Record<string, StaLocalizedCandidateCopy>>;
}

export type StaLocalizationBundle = Readonly<Record<string, StaLocalizedScenarioCopy>>;

export interface StaLocalizedLifecycle {
  readonly maturity: "PERMANENT_QL_SEMANTIC_FREEZE";
  readonly permanentQlCount: 4;
  readonly englishCorpusStatus: "FROZEN_V2";
  readonly hindiPunjabiStatus: "QL001_REVIEW_CANDIDATE";
  readonly localizedQlIds: readonly ["STA-QL-001"];
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export interface StaLocalizedQuestion extends Omit<StaQuestion, "locale" | "statement" | "candidates" | "options" | "explanation" | "lifecycle"> {
  readonly locale: StaLocalizedLocale;
  readonly statement: string;
  readonly candidates: readonly [StaRenderedCandidate, StaRenderedCandidate] | readonly [StaRenderedCandidate, StaRenderedCandidate, StaRenderedCandidate];
  readonly options: readonly [StaOption, StaOption, StaOption, StaOption];
  readonly answerSet: StaAnswerSet;
  readonly explanation: string;
  readonly lifecycle: StaLocalizedLifecycle;
}
