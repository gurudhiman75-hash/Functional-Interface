import {
  generateStaExamFormatQuestionV2,
  STA_EXAM_PROFILE_IDS_V2,
  type StaExamFormatQuestionV2,
  type StaExamProfileIdV2,
} from "./exam-format-extension-v2.ts";
import type { StaExamLocale } from "./exam-format-extension.ts";
import { STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST } from "./multilingual-freeze-manifest.ts";

export const STA_001_MULTILINGUAL_FROZEN_LIFECYCLE = Object.freeze({
  semanticQls: "FROZEN" as const,
  englishCorpus: "FROZEN_V2" as const,
  ql001HindiPunjabi: "FROZEN_V2" as const,
  ql002HindiPunjabi: "FROZEN_V2" as const,
  ql003HindiPunjabi: "FROZEN_V2" as const,
  ql004HindiPunjabi: "FROZEN_V3" as const,
  examFormatStatus: "FROZEN_CERTIFIED_V2" as const,
  multilingualChapterFrozen: true as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

type ReplaceLifecycle<T> = T extends { readonly lifecycle: unknown }
  ? Omit<T, "lifecycle"> & { readonly lifecycle: typeof STA_001_MULTILINGUAL_FROZEN_LIFECYCLE }
  : never;

export type Sta001MultilingualFrozenQuestion = ReplaceLifecycle<StaExamFormatQuestionV2>;
export type Sta001FrozenPresentationProfile = StaExamProfileIdV2;
export type Sta001FrozenLocale = StaExamLocale;

export const STA_001_MULTILINGUAL_FROZEN_PROFILE_IDS = Object.freeze([...STA_EXAM_PROFILE_IDS_V2]) as readonly Sta001FrozenPresentationProfile[];
export const STA_001_MULTILINGUAL_FROZEN_LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const);

const BANK_5X5_SPARSE_SOURCE_ERROR = /BANK_4X5 selected a scenario without BANK_5X5 overlay/u;
const BANK_5X5_MAX_SOURCE_PROBES = 4096;

function resolveFrozenSourceQuestion(
  requestedSeed: string,
  locale: Sta001FrozenLocale,
  profileId: Sta001FrozenPresentationProfile,
): StaExamFormatQuestionV2 {
  if (profileId !== "BANK_5X5") {
    return generateStaExamFormatQuestionV2(requestedSeed, locale, profileId);
  }

  for (let probe = 0; probe < BANK_5X5_MAX_SOURCE_PROBES; probe += 1) {
    const sourceSeed = probe === 0
      ? requestedSeed
      : `${requestedSeed}:BANK_5X5:eligible:${probe}`;
    try {
      return generateStaExamFormatQuestionV2(sourceSeed, locale, profileId);
    } catch (error) {
      if (error instanceof Error && BANK_5X5_SPARSE_SOURCE_ERROR.test(error.message)) continue;
      throw error;
    }
  }
  throw new Error(
    `${requestedSeed}: unable to resolve an approved BANK_5X5 source scenario after ${BANK_5X5_MAX_SOURCE_PROBES} deterministic probes`,
  );
}

export function generateSta001MultilingualFrozenQuestion(
  seed: string,
  locale: Sta001FrozenLocale,
  profileId: Sta001FrozenPresentationProfile,
): Sta001MultilingualFrozenQuestion {
  if (!STA_001_MULTILINGUAL_FROZEN_PROFILE_IDS.includes(profileId)) {
    throw new Error(`Unsupported frozen STA presentation profile '${String(profileId)}'.`);
  }
  if (!(STA_001_MULTILINGUAL_FROZEN_LOCALES as readonly string[]).includes(locale)) {
    throw new Error(`Unsupported frozen STA locale '${String(locale)}'.`);
  }

  const source = resolveFrozenSourceQuestion(seed, locale, profileId);
  const frozen = {
    ...source,
    lifecycle: STA_001_MULTILINGUAL_FROZEN_LIFECYCLE,
  } as Sta001MultilingualFrozenQuestion;

  assertSta001MultilingualFrozenQuestion(frozen);
  return frozen;
}

export function assertSta001MultilingualFrozenQuestion(question: Sta001MultilingualFrozenQuestion): void {
  if (question.packageId !== "STA-001") throw new Error(`${question.questionId}: package identity drift`);
  if (question.chapterId !== "REAS-STA") throw new Error(`${question.questionId}: chapter identity drift`);
  if (!(STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.permanentQlIds as readonly string[]).includes(question.qlId)) {
    throw new Error(`${question.questionId}: unknown permanent STA QL ${question.qlId}`);
  }
  if (!STA_001_MULTILINGUAL_FROZEN_PROFILE_IDS.includes(question.presentationProfile)) {
    throw new Error(`${question.questionId}: unfrozen presentation profile ${question.presentationProfile}`);
  }
  if (!(STA_001_MULTILINGUAL_FROZEN_LOCALES as readonly string[]).includes(question.locale)) {
    throw new Error(`${question.questionId}: unfrozen locale ${question.locale}`);
  }
  if (question.options.length !== question.optionCount) throw new Error(`${question.questionId}: option count mismatch`);
  if (question.candidates.length !== question.candidateCount) throw new Error(`${question.questionId}: assumption count mismatch`);
  if (question.options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${question.questionId}: expected exactly one correct option`);
  if (!question.options[question.answerIndex]?.isCorrect) throw new Error(`${question.questionId}: correct-option index mismatch`);
  if (!question.oracleParity) throw new Error(`${question.questionId}: oracle parity missing`);
  if (!question.statement.trim() || !question.instruction.trim() || !question.explanation.trim()) {
    throw new Error(`${question.questionId}: incomplete learner-facing surface`);
  }
  if (question.lifecycle.semanticQls !== "FROZEN") throw new Error(`${question.questionId}: semantic QLs not frozen`);
  if (question.lifecycle.englishCorpus !== "FROZEN_V2") throw new Error(`${question.questionId}: English authority not frozen`);
  if (question.lifecycle.ql001HindiPunjabi !== "FROZEN_V2") throw new Error(`${question.questionId}: QL001 localization not frozen`);
  if (question.lifecycle.ql002HindiPunjabi !== "FROZEN_V2") throw new Error(`${question.questionId}: QL002 localization not frozen`);
  if (question.lifecycle.ql003HindiPunjabi !== "FROZEN_V2") throw new Error(`${question.questionId}: QL003 localization not frozen`);
  if (question.lifecycle.ql004HindiPunjabi !== "FROZEN_V3") throw new Error(`${question.questionId}: QL004 localization not frozen`);
  if (!question.lifecycle.multilingualChapterFrozen) throw new Error(`${question.questionId}: multilingual chapter freeze missing`);
  if (question.lifecycle.questionStudioDiscoverable) throw new Error(`${question.questionId}: source runtime must remain Studio-inactive`);
  if (question.lifecycle.questionBankWritable) throw new Error(`${question.questionId}: Question Bank gate opened`);
  if (question.lifecycle.testEligible) throw new Error(`${question.questionId}: test gate opened`);
  if (question.lifecycle.mockTestEligible) throw new Error(`${question.questionId}: mock gate opened`);
  if (question.lifecycle.publiclyPublishable) throw new Error(`${question.questionId}: public gate opened`);
  if (question.lifecycle.automaticStudentPublication) throw new Error(`${question.questionId}: automatic publication gate opened`);
}
