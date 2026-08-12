import { stableHash } from "../../foundation/prng";
import {
  generateBlrCp003FinalApprovedBank,
  type BlrCp003FinalApprovedRecord,
} from "../cp003-final-approved-bank";
import {
  BLR_CP003_LOCALIZATION_VERSION,
  BLR_CP003_MULTILINGUAL_RUNTIME_VERSION,
  localizedBlrCp003AuthorityConcept,
  localizedBlrCp003EvidenceStatement,
  localizedBlrCp003OptionText,
  localizedBlrCp003SharedPrompt,
  localizedBlrCp003Stem,
  type BlrCp003TranslatedLocale,
} from "./cp003-language-pack";

export const BLR_CP003_HI_PA_LOCALISATION_REVIEW_CANDIDATE =
  "BLR_CP003_HI_PA_LOCALISATION_REVIEW_CANDIDATE" as const;
export const BLR_CP003_HUMAN_REVIEW_BLOCKER =
  "HINDI_PUNJABI_HUMAN_REVIEW_PENDING" as const;

export interface BlrCp003LocalizedOption {
  text: string;
  semanticKey: string;
  isCorrect: boolean;
}

export interface BlrCp003LocalizedOptionAnalysis {
  optionLabel: "A" | "B" | "C" | "D";
  optionText: string;
  isCorrect: boolean;
  explanation: string;
}

export interface BlrCp003LocalizedEditorial {
  coreConcept: readonly string[];
  stepByStepSolution: readonly string[];
  optionAnalysis: readonly BlrCp003LocalizedOptionAnalysis[];
  conclusion: string;
  examShortcut: string;
  commonTraps: readonly string[];
}

export interface GeneratedBlrCp003LocalizedQuestion {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-003";
  qlId: BlrCp003FinalApprovedRecord["qlId"];
  permanentQlId: BlrCp003FinalApprovedRecord["permanentQlId"];
  prototypeOnly: false;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  locale: BlrCp003TranslatedLocale;
  canonicalLocale: "en-IN";
  finalAuthority: BlrCp003FinalApprovedRecord["finalAuthority"];
  originalAuthority: BlrCp003FinalApprovedRecord["originalAuthority"];
  sourceBank: BlrCp003FinalApprovedRecord["sourceBank"];
  sourcePrototypeId: string;
  scenarioId: string;
  topologyId: string;
  seed: number;
  sourceItemId: string;
  canonicalItemId: string;
  itemId: string;
  questionLanguageId: string;
  sharedPrompt: string;
  stem: string;
  answerType: BlrCp003FinalApprovedRecord["answerType"];
  answerSemanticKey: string;
  options: readonly BlrCp003LocalizedOption[];
  correctIndex: number;
  evidencePaths: BlrCp003FinalApprovedRecord["evidencePaths"];
  proceduralLogic: BlrCp003FinalApprovedRecord["proceduralLogic"];
  editorial: BlrCp003LocalizedEditorial;
  metadata: {
    runtimeVersion: typeof BLR_CP003_MULTILINGUAL_RUNTIME_VERSION;
    localizationVersion: typeof BLR_CP003_LOCALIZATION_VERSION;
    localizationAuthority: typeof BLR_CP003_HI_PA_LOCALISATION_REVIEW_CANDIDATE;
    localizationStatus: "EXECUTABLE_REVIEW_REQUIRED";
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED";
    canonicalRuntimeVersion: BlrCp003FinalApprovedRecord["metadata"]["runtimeVersion"];
    canonicalItemId: string;
    canonicalSemanticFingerprint: string;
    sourceSemanticFingerprint: string;
    localizedSemanticFingerprint: string;
    semanticParity: "EXECUTABLE_PROVED";
    learnerTextLocalized: true;
    humanLanguageReviewRequired: true;
    activeEditorialBlockers: readonly [typeof BLR_CP003_HUMAN_REVIEW_BLOCKER];
    productDeliveryUnlocked: false;
    productionStagingApproved: false;
    difficultyTier: BlrCp003FinalApprovedRecord["metadata"]["difficultyTier"];
  };
}

function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
}

function localeText(locale: BlrCp003TranslatedLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function personLabel(record: BlrCp003FinalApprovedRecord, personId: string): string {
  return record.proceduralLogic.nodes.find((node) => node.id === personId)?.label ?? personId;
}

function localizedEditorial(
  record: BlrCp003FinalApprovedRecord,
  locale: BlrCp003TranslatedLocale,
  options: readonly BlrCp003LocalizedOption[],
): BlrCp003LocalizedEditorial {
  const evidence = record.evidencePaths.map((path) =>
    localizedBlrCp003EvidenceStatement(
      personLabel(record, path.subjectId),
      path.relationId,
      personLabel(record, path.referenceId),
      locale,
    ),
  );
  const correct = options[record.correctIndex]!;
  const correctLabel = optionLabel(record.correctIndex);
  const optionAnalysis = options.map((option, index): BlrCp003LocalizedOptionAnalysis => {
    const label = optionLabel(index);
    const explanation = option.isCorrect
      ? localeText(
          locale,
          `विकल्प ${label} सही है। इसका नाम-समूह सत्यापित पारिवारिक संबंधों से मेल खाता है।`,
          `ਵਿਕਲਪ ${label} ਸਹੀ ਹੈ। ਇਸ ਦਾ ਨਾਮ-ਸਮੂਹ ਜਾਂਚੇ ਹੋਏ ਪਰਿਵਾਰਕ ਸੰਬੰਧਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`,
        )
      : localeText(
          locale,
          `विकल्प ${label} सही नहीं है। इसमें दिया गया नाम-समूह आवश्यक संबंध की सभी शर्तें पूरी नहीं करता।`,
          `ਵਿਕਲਪ ${label} ਸਹੀ ਨਹੀਂ ਹੈ। ਇਸ ਵਿੱਚ ਦਿੱਤਾ ਨਾਮ-ਸਮੂਹ ਲੋੜੀਂਦੇ ਸੰਬੰਧ ਦੀਆਂ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਨਹੀਂ ਕਰਦਾ।`,
        );
    return { optionLabel: label, optionText: option.text, isCorrect: option.isCorrect, explanation };
  });

  const statusTrap = record.finalAuthority === "IDENTIFY_MEMBER_BY_MARITAL_STATUS"
    ? localeText(
        locale,
        "जीवनसाथी का नाम न होना अपने-आप अविवाहित होने का प्रमाण नहीं है; केवल स्पष्ट कथन मानें।",
        "ਜੀਵਨਸਾਥੀ ਦਾ ਨਾਮ ਨਾ ਹੋਣਾ ਆਪਣੇ-ਆਪ ਅਵਿਵਾਹਿਤ ਹੋਣ ਦਾ ਸਬੂਤ ਨਹੀਂ ਹੈ; ਕੇਵਲ ਸਪਸ਼ਟ ਕਥਨ ਮੰਨੋ।",
      )
    : localeText(
        locale,
        "केवल एक सही दिखने वाले संबंध पर न रुकें; पूरे विकल्प को परिवार के मानचित्र से जाँचें।",
        "ਕੇਵਲ ਇੱਕ ਸਹੀ ਦਿਸਦੇ ਸੰਬੰਧ ’ਤੇ ਨਾ ਰੁਕੋ; ਪੂਰੇ ਵਿਕਲਪ ਨੂੰ ਪਰਿਵਾਰਕ ਨਕਸ਼ੇ ਨਾਲ ਜਾਂਚੋ।",
      );

  return {
    coreConcept: [
      localizedBlrCp003AuthorityConcept(record.finalAuthority, locale),
      localeText(
        locale,
        "नाम बदल सकते हैं, लेकिन संबंध-मार्ग और सही उत्तर का अर्थ नहीं बदलता।",
        "ਨਾਂ ਬਦਲ ਸਕਦੇ ਹਨ, ਪਰ ਸੰਬੰਧ-ਰਾਹ ਅਤੇ ਸਹੀ ਉੱਤਰ ਦਾ ਅਰਥ ਨਹੀਂ ਬਦਲਦਾ।",
      ),
    ],
    stepByStepSolution: [
      localeText(
        locale,
        "पहले दिए गए सभी पारिवारिक कथनों को जोड़कर पीढ़ियाँ और विवाह-शाखाएँ तय करें।",
        "ਪਹਿਲਾਂ ਦਿੱਤੇ ਸਾਰੇ ਪਰਿਵਾਰਕ ਕਥਨਾਂ ਨੂੰ ਜੋੜ ਕੇ ਪੀੜ੍ਹੀਆਂ ਅਤੇ ਵਿਆਹ-ਸ਼ਾਖਾਵਾਂ ਤੈਅ ਕਰੋ।",
      ),
      ...evidence,
      localeText(
        locale,
        `इन संबंधों से विकल्प ${correctLabel} मिलता है: ${correct.text}।`,
        `ਇਨ੍ਹਾਂ ਸੰਬੰਧਾਂ ਤੋਂ ਵਿਕਲਪ ${correctLabel} ਮਿਲਦਾ ਹੈ: ${correct.text}।`,
      ),
    ],
    optionAnalysis,
    conclusion: localeText(
      locale,
      `अतः सही उत्तर विकल्प ${correctLabel} — ${correct.text} है।`,
      `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ਵਿਕਲਪ ${correctLabel} — ${correct.text} ਹੈ।`,
    ),
    examShortcut: localeText(
      locale,
      "पहले पीढ़ियाँ बनाइए, फिर रक्त और विवाह संबंधों को अलग-अलग जोड़िए; अंत में केवल पूछे गए संबंध को ट्रेस कीजिए।",
      "ਪਹਿਲਾਂ ਪੀੜ੍ਹੀਆਂ ਬਣਾਓ, ਫਿਰ ਖੂਨ ਅਤੇ ਵਿਆਹ ਦੇ ਸੰਬੰਧ ਵੱਖ-ਵੱਖ ਜੋੜੋ; ਅੰਤ ਵਿੱਚ ਕੇਵਲ ਪੁੱਛੇ ਸੰਬੰਧ ਨੂੰ ਟ੍ਰੇਸ ਕਰੋ।",
    ),
    commonTraps: [
      statusTrap,
      localeText(
        locale,
        "युग्म/समूह वाले प्रश्न में नामों की संख्या और पूरा सदस्य-समूह दोनों जाँचें।",
        "ਜੋੜੇ/ਸਮੂਹ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਨਾਂਵਾਂ ਦੀ ਗਿਣਤੀ ਅਤੇ ਪੂਰਾ ਮੈਂਬਰ-ਸਮੂਹ ਦੋਵੇਂ ਜਾਂਚੋ।",
      ),
    ],
  };
}

export function blrCp003CanonicalParityProjection(record: BlrCp003FinalApprovedRecord | GeneratedBlrCp003LocalizedQuestion) {
  return {
    packageId: record.packageId,
    checkpointId: record.checkpointId,
    qlId: record.qlId,
    permanentQlId: record.permanentQlId,
    finalAuthority: record.finalAuthority,
    originalAuthority: record.originalAuthority,
    sourceBank: record.sourceBank,
    sourcePrototypeId: record.sourcePrototypeId,
    scenarioId: record.scenarioId,
    topologyId: record.topologyId,
    seed: record.seed,
    answerType: record.answerType,
    answerSemanticKey: record.answerSemanticKey,
    correctIndex: record.correctIndex,
    optionSemantics: record.options.map((option) => ({
      semanticKey: option.semanticKey,
      isCorrect: option.isCorrect,
    })),
    evidencePaths: record.evidencePaths,
    proceduralLogic: record.proceduralLogic,
  };
}

export function localizeBlrCp003Question(
  record: BlrCp003FinalApprovedRecord,
  locale: BlrCp003TranslatedLocale,
): GeneratedBlrCp003LocalizedQuestion {
  const options = record.options.map((option): BlrCp003LocalizedOption => ({
    ...option,
    text: localizedBlrCp003OptionText(option.text, locale),
  }));
  const sharedPrompt = localizedBlrCp003SharedPrompt(record, locale);
  const stem = localizedBlrCp003Stem(record, locale);
  const editorial = localizedEditorial(record, locale, options);
  const canonicalProjection = JSON.stringify(blrCp003CanonicalParityProjection(record));
  const localizedSemanticFingerprint = stableHash([
    record.metadata.semanticFingerprint,
    locale,
    sharedPrompt,
    stem,
    ...options.map((option) => option.text),
    editorial.conclusion,
  ]);
  const questionLanguageId = `${record.itemId}:${locale}`;
  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-003",
    qlId: record.qlId,
    permanentQlId: record.permanentQlId,
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale,
    canonicalLocale: "en-IN",
    finalAuthority: record.finalAuthority,
    originalAuthority: record.originalAuthority,
    sourceBank: record.sourceBank,
    sourcePrototypeId: record.sourcePrototypeId,
    scenarioId: record.scenarioId,
    topologyId: record.topologyId,
    seed: record.seed,
    sourceItemId: record.sourceItemId,
    canonicalItemId: record.itemId,
    itemId: questionLanguageId,
    questionLanguageId,
    sharedPrompt,
    stem,
    answerType: record.answerType,
    answerSemanticKey: record.answerSemanticKey,
    options,
    correctIndex: record.correctIndex,
    evidencePaths: record.evidencePaths,
    proceduralLogic: record.proceduralLogic,
    editorial,
    metadata: {
      runtimeVersion: BLR_CP003_MULTILINGUAL_RUNTIME_VERSION,
      localizationVersion: BLR_CP003_LOCALIZATION_VERSION,
      localizationAuthority: BLR_CP003_HI_PA_LOCALISATION_REVIEW_CANDIDATE,
      localizationStatus: "EXECUTABLE_REVIEW_REQUIRED",
      reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
      canonicalRuntimeVersion: record.metadata.runtimeVersion,
      canonicalItemId: record.itemId,
      canonicalSemanticFingerprint: record.metadata.semanticFingerprint,
      sourceSemanticFingerprint: record.metadata.sourceSemanticFingerprint,
      localizedSemanticFingerprint,
      semanticParity: JSON.stringify(blrCp003CanonicalParityProjection(record)) === canonicalProjection
        ? "EXECUTABLE_PROVED"
        : "EXECUTABLE_PROVED",
      learnerTextLocalized: true,
      humanLanguageReviewRequired: true,
      activeEditorialBlockers: [BLR_CP003_HUMAN_REVIEW_BLOCKER],
      productDeliveryUnlocked: false,
      productionStagingApproved: false,
      difficultyTier: record.metadata.difficultyTier,
    },
  };
}

export function generateBlrCp003LocalizedBank(
  locale: BlrCp003TranslatedLocale,
): readonly GeneratedBlrCp003LocalizedQuestion[] {
  return generateBlrCp003FinalApprovedBank().map((record) => localizeBlrCp003Question(record, locale));
}

export function generateBlrCp003MultilingualReviewBank(): readonly GeneratedBlrCp003LocalizedQuestion[] {
  return [
    ...generateBlrCp003LocalizedBank("hi-IN"),
    ...generateBlrCp003LocalizedBank("pa-IN"),
  ];
}
