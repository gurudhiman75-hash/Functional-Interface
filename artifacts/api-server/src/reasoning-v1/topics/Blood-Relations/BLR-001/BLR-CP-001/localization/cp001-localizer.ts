import { stableHash } from "../../foundation/prng";
import {
  localizeBlrPersonName,
  localizeBlrPersonNamesInText,
} from "../../foundation/localized-person-names";
import type { BlrRelationId, DirectRelationClue } from "../../foundation/types";
import type { GenerationRelationId } from "../../foundation/family-analysis";
import {
  generateBlrCp001Question,
  type BlrCp001PermanentQuestion,
} from "../cp001-runtime";
import type { BlrCp001QlId } from "../cp001-permanent-contracts";
import type { BlrCp001AdvancedQuery } from "../advanced-prototype-types";
import type {
  BlrCp001LineageQuery,
  BlrExactLineageRelationId,
} from "../lineage-prototype-types";
import {
  BLR_CP001_LOCALIZATION_VERSION,
  BLR_CP001_MULTILINGUAL_RUNTIME_VERSION,
  cp001ClueText,
  cp001ExactLineageLabel,
  cp001GenerationLabel,
  cp001IdentifyPersonQuestion,
  cp001RelationLabel,
  cp001RelationQuestion,
  cp001RelationStatement,
  localeText,
  type BlrCp001TranslatedLocale,
} from "./cp001-language-pack";

export const BLR_CP001_HI_PA_LOCALISATION_REVIEW_CANDIDATE =
  "BLR_CP001_HI_PA_LOCALISATION_REVIEW_CANDIDATE" as const;
export const BLR_CP001_HUMAN_REVIEW_BLOCKER =
  "HINDI_PUNJABI_HUMAN_REVIEW_PENDING" as const;

type RawOption = BlrCp001PermanentQuestion["options"][number] & {
  relationId?: BlrRelationId;
  answerKey?: string;
};

export interface GeneratedBlrCp001LocalizedQuestion {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-001";
  qlId: BlrCp001QlId;
  permanentQlId: BlrCp001QlId;
  prototypeOnly: false;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  ruleId: string;
  seed: number;
  locale: BlrCp001TranslatedLocale;
  canonicalLocale: "en-IN";
  difficulty: string;
  renderer: string;
  answerType: string;
  stem: string;
  structuredPrompt: BlrCp001PermanentQuestion["structuredPrompt"];
  options: readonly (RawOption & { value: string })[];
  correctIndex: number;
  explanation: {
    coreConcept: readonly string[];
    normalizedClues: readonly string[];
    queryPath: readonly string[];
    conclusion: string;
    familyTree: null;
  };
  canonicalItemId: string;
  itemId: string;
  questionLanguageId: string;
  metadata: Omit<BlrCp001PermanentQuestion["metadata"], "runtimeVersion"> & {
    runtimeVersion: typeof BLR_CP001_MULTILINGUAL_RUNTIME_VERSION;
    canonicalRuntimeVersion: "blr-cp001-runtime-v1";
    localizationVersion: typeof BLR_CP001_LOCALIZATION_VERSION;
    localizationAuthority: typeof BLR_CP001_HI_PA_LOCALISATION_REVIEW_CANDIDATE;
    localizationStatus: "EXECUTABLE_REVIEW_REQUIRED";
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED";
    canonicalSemanticFingerprint: string;
    localizedSemanticFingerprint: string;
    semanticParity: "EXECUTABLE_PROVED";
    learnerTextLocalized: true;
    humanLanguageReviewRequired: true;
    activeEditorialBlockers: readonly [typeof BLR_CP001_HUMAN_REVIEW_BLOCKER];
    productDeliveryUnlocked: false;
    productionStagingApproved: false;
  };
}

function queryOf(record: BlrCp001PermanentQuestion):
  | { kind: "RELATION"; query: { subjectId: string; referenceId: string } }
  | { kind: "ADVANCED"; query: BlrCp001AdvancedQuery }
  | { kind: "LINEAGE"; query: BlrCp001LineageQuery } {
  const query = record.structuredPrompt.query as any;
  if (typeof query?.kind === "string") {
    if (
      query.kind === "IDENTIFY_PERSON_BY_GENDER"
      || query.kind === "SOLVE_EXACT_LINEAGE_RELATION"
    ) return { kind: "LINEAGE", query };
    return { kind: "ADVANCED", query };
  }
  return { kind: "RELATION", query };
}

function localizeOption(
  option: RawOption,
  record: BlrCp001PermanentQuestion,
  locale: BlrCp001TranslatedLocale,
): RawOption & { value: string } {
  const key = option.answerKey ?? "";
  const names = Object.fromEntries(
    Object.entries(record.structuredPrompt.personNames).map(([id, name]) => [
      id,
      localizeBlrPersonName(name, locale),
    ]),
  ) as Readonly<Record<string, string>>;

  const relationId = option.relationId
    ?? (key.startsWith("RELATION:") ? key.slice("RELATION:".length) as BlrRelationId : undefined);
  if (relationId) {
    return { ...option, value: cp001RelationLabel(relationId, locale) };
  }

  if (key.startsWith("GENERATION:")) {
    const id = key.slice("GENERATION:".length) as GenerationRelationId;
    return { ...option, value: cp001GenerationLabel(id, locale) };
  }

  if (key.startsWith("EXACT_LINEAGE:")) {
    const id = key.slice("EXACT_LINEAGE:".length) as BlrExactLineageRelationId;
    return { ...option, value: cp001ExactLineageLabel(id, locale) };
  }

  if (key.startsWith("PAIR:")) {
    const [subjectId, referenceId] = key.slice("PAIR:".length).split(">");
    return {
      ...option,
      value: `${names[subjectId!] ?? subjectId} — ${names[referenceId!] ?? referenceId}`,
    };
  }

  if (key.startsWith("CLAIM:")) {
    const [, subjectId, relationIdRaw, referenceId] = key.split(":");
    return {
      ...option,
      value: cp001RelationStatement(
        names[subjectId!] ?? subjectId!,
        relationIdRaw as BlrRelationId,
        names[referenceId!] ?? referenceId!,
        locale,
      ),
    };
  }

  return { ...option, value: localizeBlrPersonNamesInText(option.value, locale) };
}

function localizedQuestion(
  record: BlrCp001PermanentQuestion,
  locale: BlrCp001TranslatedLocale,
): string {
  const names = Object.fromEntries(
    Object.entries(record.structuredPrompt.personNames).map(([id, name]) => [
      id,
      localizeBlrPersonName(name, locale),
    ]),
  ) as Readonly<Record<string, string>>;
  const wrapped = queryOf(record);

  if (wrapped.kind === "RELATION") {
    return cp001RelationQuestion(
      names[wrapped.query.subjectId] ?? wrapped.query.subjectId,
      names[wrapped.query.referenceId] ?? wrapped.query.referenceId,
      locale,
    );
  }

  const query = wrapped.query as BlrCp001AdvancedQuery | BlrCp001LineageQuery;
  switch (query.kind) {
    case "IDENTIFY_PERSON_BY_RELATION":
      return cp001IdentifyPersonQuestion(
        names[query.referenceId] ?? query.referenceId,
        query.relationId,
        locale,
      );
    case "IDENTIFY_ORDERED_PAIR": {
      const relation = cp001RelationLabel(query.relationId, locale);
      return localeText(
        locale,
        `कौन-सा युग्म सही क्रम में ऐसा है जिसमें पहला व्यक्ति दूसरे का ${relation} है?`,
        `ਕਿਹੜਾ ਜੋੜਾ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਐਸਾ ਹੈ ਜਿਸ ਵਿੱਚ ਪਹਿਲਾ ਵਿਅਕਤੀ ਦੂਜੇ ਦਾ ${relation} ਹੈ?`,
      );
    }
    case "SELECT_RELATION_CLAIM":
      return query.targetTruth === "TRUE"
        ? localeText(locale, "निम्न में से कौन-सा कथन सही है?", "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?")
        : localeText(locale, "निम्न में से कौन-सा कथन गलत है?", "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਗਲਤ ਹੈ?");
    case "COMPARE_GENERATIONS":
      return localeText(
        locale,
        `${names[query.subjectId] ?? query.subjectId}, ${names[query.referenceId] ?? query.referenceId} की तुलना में किस पीढ़ी में है?`,
        `${names[query.subjectId] ?? query.subjectId}, ${names[query.referenceId] ?? query.referenceId} ਨਾਲੋਂ ਕਿਹੜੀ ਪੀੜ੍ਹੀ ਵਿੱਚ ਹੈ?`,
      );
    case "SOLVE_BRANCHING_RELATION":
      return cp001RelationQuestion(
        names[query.subjectId] ?? query.subjectId,
        names[query.referenceId] ?? query.referenceId,
        locale,
      );
    case "IDENTIFY_PERSON_BY_GENDER":
      return query.targetGender === "MALE"
        ? localeText(locale, "निम्न में से कौन पुरुष है?", "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕੌਣ ਪੁਰਸ਼ ਹੈ?")
        : localeText(locale, "निम्न में से कौन महिला है?", "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕੌਣ ਮਹਿਲਾ ਹੈ?");
    case "SOLVE_EXACT_LINEAGE_RELATION":
      return localeText(
        locale,
        `${names[query.subjectId] ?? query.subjectId} का ${names[query.referenceId] ?? query.referenceId} से सटीक पारिवारिक संबंध क्या है?`,
        `${names[query.subjectId] ?? query.subjectId} ਦਾ ${names[query.referenceId] ?? query.referenceId} ਨਾਲ ਸਟੀਕ ਪਰਿਵਾਰਕ ਰਿਸ਼ਤਾ ਕੀ ਹੈ?`,
      );
  }
}

function localizedReasoningSteps(
  record: BlrCp001PermanentQuestion,
  locale: BlrCp001TranslatedLocale,
  correctValue: string,
): readonly string[] {
  const names = record.structuredPrompt.personNames;
  const wrapped = queryOf(record);

  if (wrapped.kind === "RELATION") {
    const subject = names[wrapped.query.subjectId] ?? wrapped.query.subjectId;
    const reference = names[wrapped.query.referenceId] ?? wrapped.query.referenceId;
    return [
      localeText(
        locale,
        `प्रश्न ${subject} का ${reference} से संबंध पूछता है। संबंधों को ${subject} से ${reference} की दिशा में जोड़ें।`,
        `ਪ੍ਰਸ਼ਨ ${subject} ਦਾ ${reference} ਨਾਲ ਰਿਸ਼ਤਾ ਪੁੱਛਦਾ ਹੈ। ਰਿਸ਼ਤਿਆਂ ਨੂੰ ${subject} ਤੋਂ ${reference} ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਜੋੜੋ।`,
      ),
      localeText(
        locale,
        `दिए गए संबंधों को जोड़ने पर ${subject} का ${reference} से संबंध ${correctValue} बनता है।`,
        `ਦਿੱਤੇ ਰਿਸ਼ਤਿਆਂ ਨੂੰ ਜੋੜਨ ਉੱਤੇ ${subject} ਦਾ ${reference} ਨਾਲ ਰਿਸ਼ਤਾ ${correctValue} ਬਣਦਾ ਹੈ।`,
      ),
    ];
  }

  const query = wrapped.query as BlrCp001AdvancedQuery | BlrCp001LineageQuery;
  switch (query.kind) {
    case "IDENTIFY_PERSON_BY_RELATION": {
      const reference = names[query.referenceId] ?? query.referenceId;
      const relation = cp001RelationLabel(query.relationId, locale);
      return [
        localeText(
          locale,
          `पहले ${reference} से ${relation} का संबंध रखने वाले व्यक्ति को परिवार में खोजें।`,
          `ਪਹਿਲਾਂ ${reference} ਨਾਲ ${relation} ਦਾ ਰਿਸ਼ਤਾ ਰੱਖਣ ਵਾਲੇ ਵਿਅਕਤੀ ਨੂੰ ਪਰਿਵਾਰ ਵਿੱਚ ਲੱਭੋ।`,
        ),
        localeText(
          locale,
          `सभी दिए गए संबंध मिलाने पर यह व्यक्ति ${correctValue} है।`,
          `ਸਾਰੇ ਦਿੱਤੇ ਰਿਸ਼ਤੇ ਮਿਲਾਉਣ ਉੱਤੇ ਇਹ ਵਿਅਕਤੀ ${correctValue} ਹੈ।`,
        ),
      ];
    }
    case "IDENTIFY_ORDERED_PAIR": {
      const relation = cp001RelationLabel(query.relationId, locale);
      return [
        localeText(
          locale,
          `हर विकल्प में पहले व्यक्ति का दूसरे व्यक्ति से संबंध जाँचें; माँगा गया संबंध ${relation} है।`,
          `ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਪਹਿਲੇ ਵਿਅਕਤੀ ਦਾ ਦੂਜੇ ਵਿਅਕਤੀ ਨਾਲ ਰਿਸ਼ਤਾ ਜਾਂਚੋ; ਮੰਗਿਆ ਰਿਸ਼ਤਾ ${relation} ਹੈ।`,
        ),
        localeText(
          locale,
          `सही क्रम वाला युग्म ${correctValue} है।`,
          `ਸਹੀ ਕ੍ਰਮ ਵਾਲਾ ਜੋੜਾ ${correctValue} ਹੈ।`,
        ),
      ];
    }
    case "SELECT_RELATION_CLAIM":
      return [
        localeText(
          locale,
          query.targetTruth === "TRUE"
            ? "परिवार के बने हुए संबंधों से प्रत्येक कथन जाँचें और केवल सही कथन चुनें।"
            : "परिवार के बने हुए संबंधों से प्रत्येक कथन जाँचें और केवल गलत कथन चुनें।",
          query.targetTruth === "TRUE"
            ? "ਬਣੇ ਹੋਏ ਪਰਿਵਾਰਕ ਰਿਸ਼ਤਿਆਂ ਨਾਲ ਹਰ ਕਥਨ ਜਾਂਚੋ ਅਤੇ ਕੇਵਲ ਸਹੀ ਕਥਨ ਚੁਣੋ।"
            : "ਬਣੇ ਹੋਏ ਪਰਿਵਾਰਕ ਰਿਸ਼ਤਿਆਂ ਨਾਲ ਹਰ ਕਥਨ ਜਾਂਚੋ ਅਤੇ ਕੇਵਲ ਗਲਤ ਕਥਨ ਚੁਣੋ।",
        ),
        localeText(
          locale,
          `शर्त पूरी करने वाला कथन है: ${correctValue}`,
          `ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲਾ ਕਥਨ ਹੈ: ${correctValue}`,
        ),
      ];
    case "COMPARE_GENERATIONS": {
      const subject = names[query.subjectId] ?? query.subjectId;
      const reference = names[query.referenceId] ?? query.referenceId;
      return [
        localeText(
          locale,
          `${subject} और ${reference} को परिवार की पीढ़ियों में रखकर उनके स्तर की तुलना करें।`,
          `${subject} ਅਤੇ ${reference} ਨੂੰ ਪਰਿਵਾਰ ਦੀਆਂ ਪੀੜ੍ਹੀਆਂ ਵਿੱਚ ਰੱਖ ਕੇ ਉਨ੍ਹਾਂ ਦੇ ਪੱਧਰ ਦੀ ਤੁਲਨਾ ਕਰੋ।`,
        ),
        localeText(
          locale,
          `तुलना करने पर ${subject}, ${reference} के सापेक्ष ${correctValue} है।`,
          `ਤੁਲਨਾ ਕਰਨ ਉੱਤੇ ${subject}, ${reference} ਦੇ ਮੁਕਾਬਲੇ ${correctValue} ਹੈ।`,
        ),
      ];
    }
    case "SOLVE_BRANCHING_RELATION": {
      const subject = names[query.subjectId] ?? query.subjectId;
      const reference = names[query.referenceId] ?? query.referenceId;
      return [
        localeText(
          locale,
          "दोनों पारिवारिक शाखाएँ पूरी बनाइए और फिर पूछे गए व्यक्तियों के बीच का मार्ग जोड़िए।",
          "ਦੋਵੇਂ ਪਰਿਵਾਰਕ ਸ਼ਾਖਾਵਾਂ ਪੂਰੀਆਂ ਬਣਾਓ ਅਤੇ ਫਿਰ ਪੁੱਛੇ ਵਿਅਕਤੀਆਂ ਵਿਚਕਾਰ ਦਾ ਰਸਤਾ ਜੋੜੋ।",
        ),
        localeText(
          locale,
          `इस मार्ग से ${subject} का ${reference} से संबंध ${correctValue} मिलता है।`,
          `ਇਸ ਰਸਤੇ ਤੋਂ ${subject} ਦਾ ${reference} ਨਾਲ ਰਿਸ਼ਤਾ ${correctValue} ਮਿਲਦਾ ਹੈ।`,
        ),
      ];
    }
    case "IDENTIFY_PERSON_BY_GENDER":
      return [
        localeText(
          locale,
          "नाम देखकर लिंग का अनुमान न लगाएँ। पिता, माता, भाई, बहन, पति या पत्नी जैसे स्पष्ट संबंधों से लिंग तय करें।",
          "ਨਾਂ ਦੇਖ ਕੇ ਲਿੰਗ ਦਾ ਅੰਦਾਜ਼ਾ ਨਾ ਲਗਾਓ। ਪਿਤਾ, ਮਾਤਾ, ਭਰਾ, ਭੈਣ, ਪਤੀ ਜਾਂ ਪਤਨੀ ਵਰਗੇ ਸਪਸ਼ਟ ਰਿਸ਼ਤਿਆਂ ਤੋਂ ਲਿੰਗ ਤੈਅ ਕਰੋ।",
        ),
        localeText(
          locale,
          `दिए गए संबंधों के आधार पर आवश्यक व्यक्ति ${correctValue} है।`,
          `ਦਿੱਤੇ ਰਿਸ਼ਤਿਆਂ ਦੇ ਆਧਾਰ ਉੱਤੇ ਲੋੜੀਂਦਾ ਵਿਅਕਤੀ ${correctValue} ਹੈ।`,
        ),
      ];
    case "SOLVE_EXACT_LINEAGE_RELATION": {
      const subject = names[query.subjectId] ?? query.subjectId;
      const reference = names[query.referenceId] ?? query.referenceId;
      return [
        localeText(
          locale,
          "पहले सामान्य संबंध निकालें। फिर बीच में आने वाले माता या पिता से तय करें कि संबंध पितृ पक्ष का है या मातृ पक्ष का।",
          "ਪਹਿਲਾਂ ਆਮ ਰਿਸ਼ਤਾ ਕੱਢੋ। ਫਿਰ ਵਿਚਕਾਰ ਆਉਣ ਵਾਲੇ ਮਾਤਾ ਜਾਂ ਪਿਤਾ ਤੋਂ ਤੈਅ ਕਰੋ ਕਿ ਰਿਸ਼ਤਾ ਪਿਤਰੀ ਪੱਖ ਦਾ ਹੈ ਜਾਂ ਮਾਤਰੀ ਪੱਖ ਦਾ।",
        ),
        localeText(
          locale,
          `इससे ${subject} का ${reference} से सटीक संबंध ${correctValue} मिलता है।`,
          `ਇਸ ਤੋਂ ${subject} ਦਾ ${reference} ਨਾਲ ਸਟੀਕ ਰਿਸ਼ਤਾ ${correctValue} ਮਿਲਦਾ ਹੈ।`,
        ),
      ];
    }
  }
}

function canonicalProjection(record: BlrCp001PermanentQuestion | GeneratedBlrCp001LocalizedQuestion) {
  return {
    packageId: record.packageId,
    checkpointId: record.checkpointId,
    qlId: record.qlId,
    permanentQlId: record.permanentQlId,
    ruleId: record.ruleId,
    seed: record.seed,
    difficulty: record.difficulty,
    renderer: record.renderer,
    answerType: record.answerType,
    correctIndex: record.correctIndex,
    sourcePrototypeId: record.metadata.sourcePrototypeId,
    hiddenFingerprint: record.metadata.hiddenFingerprint,
    solveAuthority: record.metadata.solveAuthority,
    structuredPrompt: record.structuredPrompt,
    optionSemantics: record.options.map((option: any) => ({
      answerKey: option.answerKey ?? null,
      relationId: option.relationId ?? null,
      isCorrect: option.isCorrect,
      errorLabel: option.errorLabel ?? null,
    })),
  };
}

export function localizeBlrCp001Question(
  record: BlrCp001PermanentQuestion,
  locale: BlrCp001TranslatedLocale,
): GeneratedBlrCp001LocalizedQuestion {
  const normalizedClues = (record.structuredPrompt.clues as readonly DirectRelationClue[])
    .map((clue) =>
      localizeBlrPersonNamesInText(
        cp001ClueText(clue, record.structuredPrompt.personNames, locale),
        locale,
      ),
    );
  const question = localizedQuestion(record, locale);
  const stem = [...normalizedClues, question].join(" ");
  const options = record.options.map((option) =>
    localizeOption(option as RawOption, record, locale),
  );
  const correct = options[record.correctIndex]!;
  const canonicalItemId = [
    record.checkpointId,
    record.qlId,
    String(record.metadata.sourcePrototypeId),
    record.seed,
    String(record.metadata.hiddenFingerprint),
  ].join(":");
  const questionLanguageId = `${canonicalItemId}:${locale}`;
  const localizedSemanticFingerprint = stableHash([
    String(record.metadata.hiddenFingerprint),
    locale,
    stem,
    ...options.map((option) => option.value),
  ]);
  const semanticCandidate = {
    ...record,
    locale,
    stem,
    options,
  } as unknown as GeneratedBlrCp001LocalizedQuestion;
  const semanticParity =
    JSON.stringify(canonicalProjection(record))
    === JSON.stringify(canonicalProjection(semanticCandidate));
  if (!semanticParity) {
    throw new Error(
      `CP-001 localization semantic parity failed for ${record.qlId}/${record.seed}/${locale}.`,
    );
  }

  return {
    ...record,
    questionBankEligible: false,
    locale,
    canonicalLocale: "en-IN",
    stem,
    options,
    explanation: {
      coreConcept: [
        localeText(
          locale,
          "पहले दिए गए पारिवारिक संबंधों को साफ क्रम में रखें। फिर प्रश्न की शर्त के अनुसार केवल जरूरी संबंध या व्यक्ति पर ध्यान दें।",
          "ਪਹਿਲਾਂ ਦਿੱਤੇ ਪਰਿਵਾਰਕ ਰਿਸ਼ਤਿਆਂ ਨੂੰ ਸਾਫ਼ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖੋ। ਫਿਰ ਪ੍ਰਸ਼ਨ ਦੀ ਸ਼ਰਤ ਅਨੁਸਾਰ ਕੇਵਲ ਲੋੜੀਂਦੇ ਰਿਸ਼ਤੇ ਜਾਂ ਵਿਅਕਤੀ ਉੱਤੇ ਧਿਆਨ ਦਿਓ।",
        ),
      ],
      normalizedClues,
      queryPath: localizedReasoningSteps(record, locale, correct.value),
      conclusion: localeText(
        locale,
        `अतः सही उत्तर है: ${correct.value}।`,
        `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ਹੈ: ${correct.value}।`,
      ),
      familyTree: null,
    },
    canonicalItemId,
    itemId: questionLanguageId,
    questionLanguageId,
    metadata: {
      ...record.metadata,
      runtimeVersion: BLR_CP001_MULTILINGUAL_RUNTIME_VERSION,
      canonicalRuntimeVersion: "blr-cp001-runtime-v1",
      localizationVersion: BLR_CP001_LOCALIZATION_VERSION,
      localizationAuthority: BLR_CP001_HI_PA_LOCALISATION_REVIEW_CANDIDATE,
      localizationStatus: "EXECUTABLE_REVIEW_REQUIRED",
      reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
      canonicalSemanticFingerprint: String(record.metadata.hiddenFingerprint),
      localizedSemanticFingerprint,
      semanticParity: "EXECUTABLE_PROVED",
      learnerTextLocalized: true,
      humanLanguageReviewRequired: true,
      activeEditorialBlockers: [BLR_CP001_HUMAN_REVIEW_BLOCKER],
      productDeliveryUnlocked: false,
      productionStagingApproved: false,
    },
  };
}

export function generateBlrCp001LocalizedQuestion(
  qlId: BlrCp001QlId,
  seed: number,
  locale: BlrCp001TranslatedLocale,
): GeneratedBlrCp001LocalizedQuestion {
  return localizeBlrCp001Question(generateBlrCp001Question(qlId, seed), locale);
}

export function blrCp001CanonicalParityProjection(
  record: BlrCp001PermanentQuestion | GeneratedBlrCp001LocalizedQuestion,
) {
  return canonicalProjection(record);
}
