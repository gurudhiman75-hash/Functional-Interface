import { assertKnowledgeQuestionValid } from "../question-validation";
import type { KnowledgeFact } from "../types";
import { COM002_EDITORIALLY_APPROVED_FACTS } from "./com002-editorial-review";
import {
  COM002_LOCALIZATION_VERSION_V2,
  localizeCom002QuestionV2,
  type Com002LocalizedQuestionV2,
} from "./com002-localization-v2";
import {
  localizeCom002LexemeV1,
  type Com002TargetLanguageV1,
} from "./com002-localization-lexicon-v1";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V4,
  generateCom002ReviewQuestionV4,
} from "./com002-review-synthesis-v4";

export const COM002_LOCALIZATION_VERSION_V3 =
  "COM-002-LOCALIZATION-V3-CANDIDATE-1" as const;
export const COM002_LOCALIZATION_DRAFT_AUTHORITY_V3 =
  "COM002_HI_PA_LOCALIZATION_V3_REVIEW_CANDIDATE" as const;

export type Com002LocalizedQuestionV3 = Omit<
  Com002LocalizedQuestionV2,
  "questionId" | "localizationV2" | "lifecycleV2"
> & {
  questionId: string;
  localizationV3: {
    version: typeof COM002_LOCALIZATION_VERSION_V3;
    supersedesLocalizationVersion: typeof COM002_LOCALIZATION_VERSION_V2;
    authority: typeof COM002_LOCALIZATION_DRAFT_AUTHORITY_V3;
    englishGeneratorVersion: typeof COM002_ENGLISH_GENERATOR_VERSION_V4;
    englishAuthorityStatus: "V4_CANDIDATE_EXECUTED_GREEN_AWAITING_EXPLICIT_APPROVAL";
    englishQuestionId: string;
    semanticStateInvariant: true;
    qlInvariant: true;
    cpInvariant: true;
    surfaceModeInvariant: true;
    targetFactInvariant: true;
    sourceFactsInvariant: true;
    sourceAuthorityInvariant: true;
    solverAuthorityInvariant: true;
    optionOrderInvariant: true;
    correctIndexInvariant: true;
    editorialGrammarOverlayOnly: true;
  };
  lifecycleV3: {
    englishV4Approved: false;
    localizationReviewOnly: true;
    localizationFrozen: false;
    questionStudioActive: false;
    reviewRunPersistenceAllowed: false;
    canonicalQuestionPersistenceAllowed: false;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
    productionReleaseAuthorized: false;
  };
};

function factById(factId: string | null): KnowledgeFact | null {
  if (!factId) return null;
  return COM002_EDITORIALLY_APPROVED_FACTS.find((candidate) => candidate.factId === factId) ?? null;
}

function textValue(fact: KnowledgeFact) {
  if (fact.value.kind !== "text") {
    throw new Error(`${fact.factId}: COM-002 localization V3 requires text value`);
  }
  return fact.value.text.en;
}

function localizeExact(text: string, language: Com002TargetLanguageV1) {
  return localizeCom002LexemeV1(text, language);
}

function inflectHindiPurposeWord(word: string) {
  return word.replace(/ना$/u, "ने");
}

function inflectPunjabiPurposeWord(word: string) {
  return word.replace(/ਣਾ$/u, "ਣ").replace(/ਨਾ$/u, "ਨ");
}

/** Convert learner-facing infinitives into the oblique purpose form. */
export function com002PurposePhraseV3(
  value: string,
  language: Com002TargetLanguageV1,
) {
  if (language === "hi") {
    const paired = value.replace(
      /(\S+ना) या (\S+ना)$/u,
      (_match, left: string, right: string) =>
        `${inflectHindiPurposeWord(left)} या ${inflectHindiPurposeWord(right)}`,
    );
    return paired.replace(/ना$/u, "ने");
  }

  const paired = value.replace(
    /(\S+(?:ਣਾ|ਨਾ)) ਜਾਂ (\S+(?:ਣਾ|ਨਾ))$/u,
    (_match, left: string, right: string) =>
      `${inflectPunjabiPurposeWord(left)} ਜਾਂ ${inflectPunjabiPurposeWord(right)}`,
  );
  return paired.replace(/(?:ਣਾ|ਨਾ)$/u, (ending) => ending === "ਣਾ" ? "ਣ" : "ਨ");
}

function polishPurposeConstructions(
  text: string,
  language: Com002TargetLanguageV1,
) {
  if (language === "hi") {
    return text
      .replace(
        /का उपयोग ([^।\n]+?) के लिए किया जाता है/gu,
        (_match, value: string) =>
          `का उपयोग ${com002PurposePhraseV3(value, language)} के लिए किया जाता है`,
      )
      .replace(
        /(\S+ना) या (\S+ना) के लिए/gu,
        (_match, left: string, right: string) =>
          `${inflectHindiPurposeWord(left)} या ${inflectHindiPurposeWord(right)} के लिए`,
      )
      .replace(
        /(\S+ना) के लिए/gu,
        (_match, word: string) => `${inflectHindiPurposeWord(word)} के लिए`,
      );
  }

  return text
    .replace(
      /ਦੀ ਵਰਤੋਂ ([^।\n]+?) ਲਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ/gu,
      (_match, value: string) =>
        `ਦੀ ਵਰਤੋਂ ${com002PurposePhraseV3(value, language)} ਲਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ`,
    )
    .replace(
      /(\S+(?:ਣਾ|ਨਾ)) ਜਾਂ (\S+(?:ਣਾ|ਨਾ)) ਲਈ/gu,
      (_match, left: string, right: string) =>
        `${inflectPunjabiPurposeWord(left)} ਜਾਂ ${inflectPunjabiPurposeWord(right)} ਲਈ`,
    )
    .replace(
      /(\S+(?:ਣਾ|ਨਾ)) ਲਈ/gu,
      (_match, word: string) => `${inflectPunjabiPurposeWord(word)} ਲਈ`,
    );
}

function editorialExplanation(input: {
  qlId: string;
  language: Com002TargetLanguageV1;
  surfaceMode: string;
  targetFactId: string | null;
  fallback: string;
}) {
  const target = factById(input.targetFactId);
  if (!target) return polishPurposeConstructions(input.fallback, input.language);

  const entity = localizeExact(target.entity.label.en, input.language);
  const value = localizeExact(textValue(target), input.language);
  const hi = input.language === "hi";

  if (input.qlId === "COM-002-QL-004" && target.factId === "com002-kernel-core") {
    return hi
      ? "कर्नेल ऑपरेटिंग सिस्टम का मुख्य घटक है।"
      : "ਕਰਨਲ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦਾ ਮੁੱਖ ਘਟਕ ਹੈ।";
  }

  if (input.qlId === "COM-002-QL-006") {
    return hi
      ? `${entity} का अर्थ है: ${value}।`
      : `${entity} ਦਾ ਅਰਥ ਹੈ: ${value}।`;
  }

  if (input.qlId === "COM-002-QL-007") {
    const purpose = com002PurposePhraseV3(value, input.language);
    if (purpose !== value) {
      return hi
        ? `${entity} का उपयोग ${purpose} के लिए किया जाता है।`
        : `${entity} ਦੀ ਵਰਤੋਂ ${purpose} ਲਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`;
    }
    return hi ? `${entity}: ${value}।` : `${entity}: ${value}।`;
  }

  if (input.qlId === "COM-002-QL-010") {
    return hi
      ? `${entity} क्रिया का प्रभाव है: ${value}।`
      : `${entity} ਕਾਰਵਾਈ ਦਾ ਪ੍ਰਭਾਵ ਹੈ: ${value}।`;
  }

  if (input.qlId === "COM-002-QL-012") {
    const purpose = com002PurposePhraseV3(value, input.language);
    const suffix = input.surfaceMode === "MATCHED_PAIR"
      ? (hi ? " इसलिए यही सही युग्म है।" : " ਇਸ ਲਈ ਇਹੀ ਸਹੀ ਜੋੜਾ ਹੈ।")
      : "";
    return hi
      ? `${entity} का उपयोग ${purpose} के लिए किया जाता है।${suffix}`
      : `${entity} ਦੀ ਵਰਤੋਂ ${purpose} ਲਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।${suffix}`;
  }

  return polishPurposeConstructions(input.fallback, input.language);
}

export function localizeCom002QuestionV3(input: {
  qlId: string;
  seed: string;
  language: Com002TargetLanguageV1;
}): Com002LocalizedQuestionV3 {
  const english = generateCom002ReviewQuestionV4({ qlId: input.qlId, seed: input.seed });
  const historical = localizeCom002QuestionV2(input);
  const {
    localizationV2: _localizationV2,
    lifecycleV2: _lifecycleV2,
    ...base
  } = historical;

  let stem = polishPurposeConstructions(base.stem, input.language);
  if (
    english.qlId === "COM-002-QL-004" &&
    english.surfaceMode === "COMPONENT_TO_ROLE" &&
    english.targetFactId === "com002-kernel-core"
  ) {
    stem = input.language === "hi"
      ? "ऑपरेटिंग सिस्टम में कर्नेल की सही पहचान कौन-सी है?"
      : "ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਵਿੱਚ ਕਰਨਲ ਦੀ ਸਹੀ ਪਛਾਣ ਕਿਹੜੀ ਹੈ?";
  }

  const explanation = editorialExplanation({
    qlId: english.qlId,
    language: input.language,
    surfaceMode: english.surfaceMode,
    targetFactId: english.targetFactId,
    fallback: base.explanation,
  });

  const question: Com002LocalizedQuestionV3 = {
    ...base,
    questionId: `${english.questionId}-${input.language.toUpperCase()}`,
    qlId: english.qlId,
    cpId: english.cpId,
    surfaceMode: english.surfaceMode,
    targetFactId: english.targetFactId,
    stem,
    correctIndex: english.correctIndex,
    explanation,
    sourceIds: [...english.sourceIds],
    sourceFactIds: [...english.sourceFactIds],
    solverAuthority: english.solverAuthority,
    reviewOnly: true,
    runtimeRegistered: false,
    localizationV3: {
      version: COM002_LOCALIZATION_VERSION_V3,
      supersedesLocalizationVersion: COM002_LOCALIZATION_VERSION_V2,
      authority: COM002_LOCALIZATION_DRAFT_AUTHORITY_V3,
      englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V4,
      englishAuthorityStatus: "V4_CANDIDATE_EXECUTED_GREEN_AWAITING_EXPLICIT_APPROVAL",
      englishQuestionId: english.questionId,
      semanticStateInvariant: true,
      qlInvariant: true,
      cpInvariant: true,
      surfaceModeInvariant: true,
      targetFactInvariant: true,
      sourceFactsInvariant: true,
      sourceAuthorityInvariant: true,
      solverAuthorityInvariant: true,
      optionOrderInvariant: true,
      correctIndexInvariant: true,
      editorialGrammarOverlayOnly: true,
    },
    lifecycleV3: {
      englishV4Approved: false,
      localizationReviewOnly: true,
      localizationFrozen: false,
      questionStudioActive: false,
      reviewRunPersistenceAllowed: false,
      canonicalQuestionPersistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
    },
  };

  assertKnowledgeQuestionValid({
    stem: question.stem,
    explanation: question.explanation,
    options: question.options,
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
  });

  return question;
}
