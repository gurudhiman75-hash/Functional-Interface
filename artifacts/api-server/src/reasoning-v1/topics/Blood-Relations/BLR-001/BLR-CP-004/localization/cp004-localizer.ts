import {
  generateBlrCp003FinalApprovedBank,
  type BlrCp003FinalApprovedRecord,
} from "../../BLR-CP-003/cp003-final-approved-bank";
import { localizedBlrCp003SharedPromptCompleteV6 } from "../../BLR-CP-003/localization/cp003-passage-grammar-v6";
import { generateBlrCp004FrozenBank } from "../cp004-bank";
import type { GeneratedBlrCp004Question } from "../cp004-model";
import {
  BLR_CP004_LOCALIZATION_VERSION,
  BLR_CP004_MULTILINGUAL_RUNTIME_VERSION,
  localeText,
  localizedBlrCp004AuthorityConcept,
  localizedBlrCp004OptionText,
  localizedBlrCp004Shortcut,
  localizedBlrCp004Stem,
  localizedBlrCp004VectorText,
  type BlrCp004TranslatedLocale,
} from "./cp004-language-pack";

export const BLR_CP004_HI_PA_LOCALISATION_REVIEW_CANDIDATE =
  "BLR_CP004_HI_PA_LOCALISATION_REVIEW_CANDIDATE" as const;
export const BLR_CP004_HUMAN_REVIEW_BLOCKER =
  "HINDI_PUNJABI_HUMAN_REVIEW_PENDING" as const;

export type GeneratedBlrCp004LocalizedQuestion = Omit<
  GeneratedBlrCp004Question,
  "locale" | "sharedPrompt" | "stem" | "options" | "explanation" | "metadata"
> & {
  locale: BlrCp004TranslatedLocale;
  canonicalLocale: "en-IN";
  canonicalItemId: string;
  questionLanguageId: string;
  sharedPrompt: string;
  stem: string;
  options: GeneratedBlrCp004Question["options"];
  explanation: GeneratedBlrCp004Question["explanation"];
  metadata: GeneratedBlrCp004Question["metadata"] & {
    localizationRuntimeVersion: typeof BLR_CP004_MULTILINGUAL_RUNTIME_VERSION;
    localizationVersion: typeof BLR_CP004_LOCALIZATION_VERSION;
    localizationAuthority: typeof BLR_CP004_HI_PA_LOCALISATION_REVIEW_CANDIDATE;
    localizationStatus: "EXECUTABLE_REVIEW_REQUIRED";
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED";
    canonicalItemId: string;
    canonicalSemanticFingerprint: string;
    semanticParity: "EXECUTABLE_PROVED";
    learnerTextLocalized: true;
    humanLanguageReviewRequired: true;
    activeEditorialBlockers: readonly [typeof BLR_CP004_HUMAN_REVIEW_BLOCKER];
    productDeliveryUnlocked: false;
    productionStagingApproved: false;
  };
};

function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
}

const sourceByItemId = new Map<string, BlrCp003FinalApprovedRecord>(
  generateBlrCp003FinalApprovedBank().map((record) => [record.itemId, record]),
);

function sourceFor(record: GeneratedBlrCp004Question): BlrCp003FinalApprovedRecord {
  const source = sourceByItemId.get(record.sourceItemId);
  if (!source) throw new Error(`CP-004 localization: missing CP-003 source ${record.sourceItemId}.`);
  return source;
}

function labelFor(source: BlrCp003FinalApprovedRecord, personId: string): string {
  return source.proceduralLogic.nodes.find((node) => node.id === personId)?.label ?? personId;
}

function renderPairKey(
  source: BlrCp003FinalApprovedRecord,
  key: string,
  locale: BlrCp004TranslatedLocale,
): string {
  if (key.includes("->")) {
    const [left, right] = key.split("->");
    return `${labelFor(source, left!)} → ${labelFor(source, right!)}`;
  }
  const [left, right] = key.split("::");
  return localeText(
    locale,
    `${labelFor(source, left!)} और ${labelFor(source, right!)}`,
    `${labelFor(source, left!)} ਅਤੇ ${labelFor(source, right!)}`,
  );
}

function localizedWorking(
  record: GeneratedBlrCp004Question,
  source: BlrCp003FinalApprovedRecord,
  locale: BlrCp004TranslatedLocale,
): readonly string[] {
  if (record.answer.kind === "COUNT_VECTOR") {
    const value = record.answer.value;
    return [
      localeText(locale, `पुरुष सदस्य = ${value[0]}।`, `ਪੁਰਸ਼ ਮੈਂਬਰ = ${value[0]}।`),
      localeText(locale, `महिला सदस्य = ${value[1]}।`, `ਮਹਿਲਾ ਮੈਂਬਰ = ${value[1]}।`),
      localeText(locale, `विवाहित जोड़े = ${value[2]}।`, `ਵਿਆਹੇ ਜੋੜੇ = ${value[2]}।`),
      localeText(locale, `पीढ़ियाँ = ${value[3]}।`, `ਪੀੜ੍ਹੀਆਂ = ${value[3]}।`),
    ];
  }

  if (record.answer.countedMemberIds.length) {
    const names = record.answer.countedMemberIds.map((id) => labelFor(source, id)).join(", ");
    return [
      localeText(locale, `गिने गए सदस्य: ${names}।`, `ਗਿਣੇ ਗਏ ਮੈਂਬਰ: ${names}।`),
      localeText(locale, `कुल संख्या = ${record.answer.value}।`, `ਕੁੱਲ ਗਿਣਤੀ = ${record.answer.value}।`),
    ];
  }

  if (record.answer.countedPairKeys.length) {
    const pairs = record.answer.countedPairKeys
      .map((key) => renderPairKey(source, key, locale))
      .join("; ");
    return [
      localeText(locale, `गिने गए संबंध-युग्म: ${pairs}।`, `ਗਿਣੇ ਗਏ ਸੰਬੰਧ-ਜੋੜੇ: ${pairs}।`),
      localeText(locale, `कुल संख्या = ${record.answer.value}।`, `ਕੁੱਲ ਗਿਣਤੀ = ${record.answer.value}।`),
    ];
  }

  if (record.answer.value === 0) {
    return [
      localeText(locale, "मांगी गई श्रेणी में कोई योग्य सदस्य या युग्म नहीं है।", "ਮੰਗੀ ਗਈ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਕੋਈ ਯੋਗ ਮੈਂਬਰ ਜਾਂ ਜੋੜਾ ਨਹੀਂ ਹੈ।"),
      localeText(locale, "कुल संख्या = 0।", "ਕੁੱਲ ਗਿਣਤੀ = 0।"),
    ];
  }

  return [
    localeText(locale, "पूर्ण परिवार-मानचित्र पर मांगी गई इकाइयों को अलग-अलग चिन्हित करें।", "ਪੂਰੇ ਪਰਿਵਾਰਕ ਨਕਸ਼ੇ ’ਤੇ ਮੰਗੀਆਂ ਇਕਾਈਆਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਨਿਸ਼ਾਨਿਤ ਕਰੋ।"),
    localeText(locale, `सत्यापित संख्या = ${record.answer.value}।`, `ਜਾਂਚੀ ਗਿਣਤੀ = ${record.answer.value}।`),
  ];
}

function localizedExplanation(
  record: GeneratedBlrCp004Question,
  source: BlrCp003FinalApprovedRecord,
  locale: BlrCp004TranslatedLocale,
  options: GeneratedBlrCp004Question["options"],
): GeneratedBlrCp004Question["explanation"] {
  const correctLabel = optionLabel(record.correctIndex);
  const conclusion = record.answer.kind === "COUNT_VECTOR"
    ? localeText(
        locale,
        `अतः सही संरचना ${localizedBlrCp004VectorText(record.answer.value, locale)} है; सही उत्तर विकल्प ${correctLabel} है।`,
        `ਇਸ ਲਈ ਸਹੀ ਬਣਤਰ ${localizedBlrCp004VectorText(record.answer.value, locale)} ਹੈ; ਸਹੀ ਉੱਤਰ ਵਿਕਲਪ ${correctLabel} ਹੈ।`,
      )
    : localeText(
        locale,
        `अतः सत्यापित संख्या ${record.answer.value} है; सही उत्तर विकल्प ${correctLabel} है।`,
        `ਇਸ ਲਈ ਜਾਂਚੀ ਗਿਣਤੀ ${record.answer.value} ਹੈ; ਸਹੀ ਉੱਤਰ ਵਿਕਲਪ ${correctLabel} ਹੈ।`,
      );

  return {
    coreConcept: localizedBlrCp004AuthorityConcept(record, locale),
    working: localizedWorking(record, source, locale),
    conclusion,
    examShortcut: localizedBlrCp004Shortcut(record, locale),
    optionAnalysis: options.map((option, index) => {
      const label = optionLabel(index);
      return {
        optionLabel: label,
        optionText: option.text,
        isCorrect: option.isCorrect,
        explanation: option.isCorrect
          ? localeText(
              locale,
              `विकल्प ${label} सही है। यह सत्यापित गणना से पूरी तरह मेल खाता है।`,
              `ਵਿਕਲਪ ${label} ਸਹੀ ਹੈ। ਇਹ ਜਾਂਚੀ ਗਿਣਤੀ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੇਲ ਖਾਂਦਾ ਹੈ।`,
            )
          : localeText(
              locale,
              `विकल्प ${label} सही नहीं है। इसमें कोई योग्य सदस्य या युग्म छूटा है, अतिरिक्त गिना गया है, या कोई घटक गलत है।`,
              `ਵਿਕਲਪ ${label} ਸਹੀ ਨਹੀਂ ਹੈ। ਇਸ ਵਿੱਚ ਕੋਈ ਯੋਗ ਮੈਂਬਰ ਜਾਂ ਜੋੜਾ ਛੁੱਟਿਆ ਹੈ, ਵਾਧੂ ਗਿਣਿਆ ਗਿਆ ਹੈ, ਜਾਂ ਕੋਈ ਭਾਗ ਗਲਤ ਹੈ।`,
            ),
      };
    }),
    familyTree: record.explanation.familyTree,
  };
}

export function localizeBlrCp004Question(
  record: GeneratedBlrCp004Question,
  locale: BlrCp004TranslatedLocale,
): GeneratedBlrCp004LocalizedQuestion {
  const source = sourceFor(record);
  const options = record.options.map((option) => ({
    ...option,
    text: localizedBlrCp004OptionText(option, locale),
  }));
  const localeSuffix = locale === "hi-IN" ? "hi" : "pa";
  return {
    ...record,
    locale,
    canonicalLocale: "en-IN",
    canonicalItemId: record.itemId,
    itemId: `${record.itemId}-${localeSuffix}`,
    questionLanguageId: `${record.itemId}:${locale}`,
    sharedPrompt: localizedBlrCp003SharedPromptCompleteV6(source, locale),
    stem: localizedBlrCp004Stem(record, locale),
    options,
    explanation: localizedExplanation(record, source, locale, options),
    metadata: {
      ...record.metadata,
      localizationRuntimeVersion: BLR_CP004_MULTILINGUAL_RUNTIME_VERSION,
      localizationVersion: BLR_CP004_LOCALIZATION_VERSION,
      localizationAuthority: BLR_CP004_HI_PA_LOCALISATION_REVIEW_CANDIDATE,
      localizationStatus: "EXECUTABLE_REVIEW_REQUIRED",
      reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
      canonicalItemId: record.itemId,
      canonicalSemanticFingerprint: record.metadata.semanticFingerprint,
      semanticParity: "EXECUTABLE_PROVED",
      learnerTextLocalized: true,
      humanLanguageReviewRequired: true,
      activeEditorialBlockers: [BLR_CP004_HUMAN_REVIEW_BLOCKER],
      productDeliveryUnlocked: false,
      productionStagingApproved: false,
    },
  };
}

const cache = new Map<BlrCp004TranslatedLocale, readonly GeneratedBlrCp004LocalizedQuestion[]>();

export function generateBlrCp004LocalizedReviewBank(
  locale: BlrCp004TranslatedLocale,
): readonly GeneratedBlrCp004LocalizedQuestion[] {
  const existing = cache.get(locale);
  if (existing) return existing;
  const bank = generateBlrCp004FrozenBank().map((record) => localizeBlrCp004Question(record, locale));
  cache.set(locale, bank);
  return bank;
}

export function blrCp004CanonicalParityProjection(
  record: GeneratedBlrCp004Question | GeneratedBlrCp004LocalizedQuestion,
) {
  return {
    packageId: record.packageId,
    checkpointId: record.checkpointId,
    qlId: record.qlId,
    permanentQlId: record.permanentQlId,
    solveAuthority: record.solveAuthority,
    sourcePrototypeId: record.sourcePrototypeId,
    sourceGroupKey: record.sourceGroupKey,
    sourceItemId: record.sourceItemId,
    scenarioId: record.scenarioId,
    topologyId: record.topologyId,
    seed: record.seed,
    answerType: record.answerType,
    optionSemantics: record.options.map((option) => ({
      semanticKey: option.semanticKey,
      isCorrect: option.isCorrect,
      errorLabel: option.errorLabel,
    })),
    correctIndex: record.correctIndex,
    answer: record.answer,
    familyTree: record.explanation.familyTree,
    semanticFingerprint: record.metadata.semanticFingerprint,
  };
}
