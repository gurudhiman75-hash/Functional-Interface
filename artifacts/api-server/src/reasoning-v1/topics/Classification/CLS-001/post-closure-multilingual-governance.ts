import {
  generateClsCp003LocalizedQuestionV5,
  type GeneratedClsCp003LocalizedQuestionV5,
} from "./CLS-CP-003/cp003-localized-runtime-v5.ts";
import type {
  ClsCp003LocalizedLocale,
  ClsCp003LocalizedQlId,
} from "./CLS-CP-003/cp003-localized-contracts.ts";
import {
  generateClsCp004LocalizedQuestion,
  type ClsCp004TranslatedLocale,
} from "./CLS-CP-004/cp004-localized-runtime.ts";
import {
  generateClsCp007LocalizedClusterQuestion,
  generateClsCp007LocalizedPairQuestion,
  type ClsCp007LocalizedLocale,
} from "./CLS-CP-007/cp007-localized-runtime.ts";
import type { ClsCp007PrototypeId } from "./CLS-CP-007/types.ts";

export const CLS_001_POST_CLOSURE_MULTILINGUAL_GOVERNANCE_AUTHORITY =
  "CLS_001_POST_CLOSURE_MULTILINGUAL_REVIEW_FREEZE_RECONCILIATION_2026_10_04" as const;

export const CLS_001_REVIEW_FROZEN_CHECKPOINTS = Object.freeze([
  "CLS-CP-003",
  "CLS-CP-004",
  "CLS-CP-007",
] as const);

const POST_CLOSURE_REVIEW_STATUS =
  "APPROVED_MULTILINGUAL_REVIEW_FROZEN" as const;
const POST_CLOSURE_LOCALIZATION_STATUS =
  "MULTILINGUAL_REVIEW_FROZEN" as const;

function withReviewFreeze<T extends Readonly<Record<string, any>>>(
  question: T,
) {
  return Object.freeze({
    ...question,
    metadata: Object.freeze({
      ...question.metadata,
      postClosureGovernanceAuthority:
        CLS_001_POST_CLOSURE_MULTILINGUAL_GOVERNANCE_AUTHORITY,
      postClosureReviewFreezeStatus: POST_CLOSURE_LOCALIZATION_STATUS,
    }),
    lifecycle: Object.freeze({
      ...question.lifecycle,
      reviewStatus: POST_CLOSURE_REVIEW_STATUS,
    }),
  });
}

export function generateClsCp003PostClosureFrozenQuestion(
  qlId: ClsCp003LocalizedQlId,
  locale: ClsCp003LocalizedLocale,
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  const source = generateClsCp003LocalizedQuestionV5(
    qlId,
    locale,
    seed,
    requestedOptionCount,
  );
  return withReviewFreeze(source);
}

export function generateClsCp004PostClosureFrozenQuestion(
  locale: ClsCp004TranslatedLocale,
  seed = 0,
) {
  const source = generateClsCp004LocalizedQuestion(locale, seed);
  return Object.freeze({
    ...withReviewFreeze(source),
    metadata: Object.freeze({
      ...source.metadata,
      localizationStatus: POST_CLOSURE_LOCALIZATION_STATUS,
      postClosureGovernanceAuthority:
        CLS_001_POST_CLOSURE_MULTILINGUAL_GOVERNANCE_AUTHORITY,
      postClosureReviewFreezeStatus: POST_CLOSURE_LOCALIZATION_STATUS,
    }),
    lifecycle: Object.freeze({
      ...source.lifecycle,
      reviewStatus: POST_CLOSURE_REVIEW_STATUS,
    }),
  });
}

export function generateClsCp007PostClosureFrozenClusterQuestion(
  locale: ClsCp007LocalizedLocale,
  prototypeId: ClsCp007PrototypeId,
  seed: number,
  optionCount: 4 | 5 = 4,
) {
  const source = generateClsCp007LocalizedClusterQuestion(
    locale,
    prototypeId,
    seed,
    optionCount,
  );
  return Object.freeze({
    ...withReviewFreeze(source),
    metadata: Object.freeze({
      ...source.metadata,
      localizationStatus: POST_CLOSURE_LOCALIZATION_STATUS,
      postClosureGovernanceAuthority:
        CLS_001_POST_CLOSURE_MULTILINGUAL_GOVERNANCE_AUTHORITY,
      postClosureReviewFreezeStatus: POST_CLOSURE_LOCALIZATION_STATUS,
    }),
    lifecycle: Object.freeze({
      ...source.lifecycle,
      reviewStatus: POST_CLOSURE_REVIEW_STATUS,
    }),
  });
}

export function generateClsCp007PostClosureFrozenPairQuestion(
  locale: ClsCp007LocalizedLocale,
  seed: number,
  optionCount: 4 | 5 = 4,
) {
  const source = generateClsCp007LocalizedPairQuestion(
    locale,
    seed,
    optionCount,
  );
  return Object.freeze({
    ...withReviewFreeze(source),
    metadata: Object.freeze({
      ...source.metadata,
      localizationStatus: POST_CLOSURE_LOCALIZATION_STATUS,
      postClosureGovernanceAuthority:
        CLS_001_POST_CLOSURE_MULTILINGUAL_GOVERNANCE_AUTHORITY,
      postClosureReviewFreezeStatus: POST_CLOSURE_LOCALIZATION_STATUS,
    }),
    lifecycle: Object.freeze({
      ...source.lifecycle,
      reviewStatus: POST_CLOSURE_REVIEW_STATUS,
    }),
  });
}

export type GeneratedClsCp003PostClosureFrozenQuestion =
  ReturnType<typeof generateClsCp003PostClosureFrozenQuestion>;
export type GeneratedClsCp004PostClosureFrozenQuestion =
  ReturnType<typeof generateClsCp004PostClosureFrozenQuestion>;
export type GeneratedClsCp007PostClosureFrozenClusterQuestion =
  ReturnType<typeof generateClsCp007PostClosureFrozenClusterQuestion>;
export type GeneratedClsCp007PostClosureFrozenPairQuestion =
  ReturnType<typeof generateClsCp007PostClosureFrozenPairQuestion>;

export function assertCls001PostClosureLifecycle(
  question: Readonly<Record<string, any>>,
): void {
  if (question.questionStudioVisible !== false) {
    throw new Error("CLS-001 review-frozen output must remain hidden from Question Studio");
  }
  if (question.lifecycle?.questionStudioDiscoverable !== false) {
    throw new Error("CLS-001 review-frozen output became Question Studio discoverable");
  }
  if (question.lifecycle?.questionBankStatus !== "NOT_STORED") {
    throw new Error("CLS-001 review-frozen output changed Question Bank status");
  }
  if (question.lifecycle?.testEligibility !== "INELIGIBLE") {
    throw new Error("CLS-001 review-frozen output became test eligible");
  }
  if (question.lifecycle?.publiclyPublishable !== false) {
    throw new Error("CLS-001 review-frozen output became publicly publishable");
  }
}
