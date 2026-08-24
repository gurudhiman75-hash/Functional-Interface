import {
  applyPfcTpfStudioEditorialV1,
  PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1,
  type PfcTpfStudioEditorialQuestionV1,
} from "./paper-folding-question-studio-editorial-v1";
import type { PfcTpfStudioQuestionV1 } from "./paper-folding-question-studio-seeded-runtime-v1";

export const PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1_1 = Object.freeze({
  authorityId: "PFC-TPF-QUESTION-STUDIO-EDITORIAL-V1.1" as const,
  supersedesAuthorityId: PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1.authorityId,
  purpose: "HARDEN_STUDENT_FIRST_HINDI_PUNJABI_EDITORIAL_WORDING" as const,
  remediation: {
    hindiLearnerFacingEnglishJargonRemoved: true,
    punjabiLearnerFacingEnglishJargonRemoved: true,
    geometryAndAnswerInvariantsPreserved: true,
    exactRenderedTextFingerprint: true,
    deterministicStemVariantBalancing: true,
    sequentialAuditSeedsCoverAllFourStemVariants: true,
  },
  status: "EDITORIAL_REVIEW_CANDIDATE" as const,
  registrationAllowed: false,
} as const);

export type PfcTpfStudioEditorialQuestionV1_1 = PfcTpfStudioEditorialQuestionV1 & {
  editorial: PfcTpfStudioEditorialQuestionV1["editorial"] & {
    hardeningAuthorityId: typeof PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1_1.authorityId;
  };
};

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shortHash(value: string): string {
  return hash32(value).toString(16).padStart(8, "0");
}

function balancedStemVariant(question: PfcTpfStudioQuestionV1): number {
  // Sequential seed families are common in Studio batches and audits. Mixing the
  // stable prefix with the trailing ordinal guarantees a balanced 0..3 cycle
  // instead of relying on hash-modulo sampling that can accidentally omit a style.
  const match = question.seed.match(/^(.*):(\d+)$/);
  if (match) {
    const prefixOffset = hash32(`${match[1]}:${question.qlId}:stem-balance`) % 4;
    return (prefixOffset + Number(match[2])) % 4;
  }
  return hash32(`${question.seed}:${question.qlId}:stem-balance`) % 4;
}

function applyBaseEditorialWithStemVariant(
  question: PfcTpfStudioQuestionV1,
  targetStemVariant: number,
): PfcTpfStudioEditorialQuestionV1 {
  // V1 owns the actual multilingual templates. We search a private editorial-only
  // seed until V1 selects the required template, then restore the real generation
  // seed so geometry provenance and delivery identity remain unchanged.
  for (let attempt = 0; attempt < 64; attempt += 1) {
    const editorialOnlySeed = `${question.generationSeed}:balanced-stem:${targetStemVariant}:${attempt}`;
    const edited = applyPfcTpfStudioEditorialV1({
      ...question,
      generationSeed: editorialOnlySeed,
    });
    if (edited.editorial.stemVariant !== targetStemVariant) continue;
    return {
      ...edited,
      generationSeed: question.generationSeed,
    };
  }
  throw new Error(`${question.qlId}/${question.seed}: unable to resolve balanced stem variant ${targetStemVariant}.`);
}

function hardenLocalizedText(value: string, language: PfcTpfStudioQuestionV1["language"]): string {
  if (language === "hi") {
    return value
      .replaceAll("सुपरइम्पोज़्ड", "मिली हुई")
      .replaceAll("फ्रेम", "एक ही जगह");
  }
  if (language === "pa") {
    return value
      .replaceAll("ਸੁਪਰਇੰਪੋਜ਼ਡ", "ਮਿਲੀ ਹੋਈ")
      .replaceAll("ਫਰੇਮ", "ਇੱਕੋ ਥਾਂ");
  }
  return value;
}

export function applyPfcTpfStudioEditorialV1_1(question: PfcTpfStudioQuestionV1): PfcTpfStudioEditorialQuestionV1_1 {
  const targetStemVariant = balancedStemVariant(question);
  const edited = applyBaseEditorialWithStemVariant(question, targetStemVariant);
  const language = edited.language;
  const stem = hardenLocalizedText(edited.stem, language);
  const explanation = {
    observation: hardenLocalizedText(edited.explanation.observation, language),
    rule: hardenLocalizedText(edited.explanation.rule, language),
    application: hardenLocalizedText(edited.explanation.application, language),
    check: hardenLocalizedText(edited.explanation.check, language),
  };
  const editorialFingerprint = `pfc-tpf-ed-${shortHash(JSON.stringify({ stem, explanation }))}`;
  return {
    ...edited,
    stem,
    explanation,
    editorial: {
      ...edited.editorial,
      stemVariant: targetStemVariant,
      editorialFingerprint,
      hardeningAuthorityId: PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1_1.authorityId,
    },
  };
}
