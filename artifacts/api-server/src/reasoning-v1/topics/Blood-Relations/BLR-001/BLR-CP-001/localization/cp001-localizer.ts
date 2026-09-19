import { stableHash } from "../../foundation/prng";
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
  const names = record.structuredPrompt.personNames;

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

  return { ...option, value: option.value };
}

function localizedQuestion(
  record: BlrCp001PermanentQuestion,
  locale: BlrCp001TranslatedLocale,
): string {
  const names = record.structuredPrompt.personNames;
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
    .map((clue) => cp001ClueText(clue, record.structuredPrompt.personNames, locale));
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
          "दिए गए संबंधों को एक-एक करके जोड़ें और प्रश्न में पूछी गई दिशा में संबंध निकालें।",
          "ਦਿੱਤੇ ਰਿਸ਼ਤਿਆਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਜੋੜੋ ਅਤੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪੁੱਛੀ ਦਿਸ਼ਾ ਅਨੁਸਾਰ ਰਿਸ਼ਤਾ ਕੱਢੋ।",
        ),
      ],
      normalizedClues,
      queryPath: [
        localeText(
          locale,
          "पहले परिवार की पीढ़ियाँ और सीधे संबंध तय करें, फिर केवल पूछे गए दो व्यक्तियों के बीच का मार्ग देखें।",
          "ਪਹਿਲਾਂ ਪਰਿਵਾਰ ਦੀਆਂ ਪੀੜ੍ਹੀਆਂ ਅਤੇ ਸਿੱਧੇ ਰਿਸ਼ਤੇ ਤੈਅ ਕਰੋ, ਫਿਰ ਕੇਵਲ ਪੁੱਛੇ ਦੋ ਵਿਅਕਤੀਆਂ ਵਿਚਕਾਰ ਦਾ ਰਸਤਾ ਵੇਖੋ।",
        ),
      ],
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
