import type { BlrCp006Relation } from "../../BLR-CP-006/cp006-model";
import {
  generateBlrCp007EnglishFrozenBank,
  type GeneratedBlrCp007EnglishFrozenQuestion,
} from "../cp007-english-frozen";
import {
  BLR_CP007_LOCALIZATION_VERSION,
  BLR_CP007_MULTILINGUAL_RUNTIME_VERSION,
  localizedBlrCp007DiagramEdgeLabel,
  localizedBlrCp007DirectStatement,
  localizedBlrCp007Join,
  localizedBlrCp007OptionLabel,
  localizedBlrCp007RelationLabel,
  localizedBlrCp007RelationStatement,
  localizedBlrCp007SharedPrompt,
  localizedBlrCp007TargetClause,
  type BlrCp007TranslatedLocale,
} from "./cp007-language-pack";

const LOCALISATION_BLOCKER = "HINDI_PUNJABI_HUMAN_REVIEW_PENDING" as const;

export type GeneratedBlrCp007LocalizedQuestion = Omit<
  GeneratedBlrCp007EnglishFrozenQuestion,
  | "locale"
  | "sharedPrompt"
  | "stem"
  | "options"
  | "answer"
  | "decodedStatements"
  | "explanation"
  | "reviewProof"
  | "metadata"
  | "v4ReviewProof"
> & {
  readonly locale: BlrCp007TranslatedLocale;
  readonly sharedPrompt: string;
  readonly stem: string;
  readonly options: readonly (Omit<
    GeneratedBlrCp007EnglishFrozenQuestion["options"][number],
    "text" | "studentExplanation"
  > & {
    readonly text: string;
    readonly studentExplanation: string;
  })[];
  readonly answer: string;
  readonly decodedStatements: readonly string[];
  readonly explanation: Omit<
    GeneratedBlrCp007EnglishFrozenQuestion["explanation"],
    | "steps"
    | "conclusion"
    | "shortcut"
    | "commonTrap"
    | "optionAnalysis"
    | "familyTree"
    | "diagramProof"
  > & {
    readonly steps: readonly string[];
    readonly conclusion: string;
    readonly shortcut?: string;
    readonly commonTrap?: string;
    readonly optionAnalysis: readonly (Omit<
      GeneratedBlrCp007EnglishFrozenQuestion["explanation"]["optionAnalysis"][number],
      "optionText" | "explanation"
    > & {
      readonly optionText: string;
      readonly explanation: string;
    })[];
    readonly familyTree: GeneratedBlrCp007EnglishFrozenQuestion["explanation"]["familyTree"];
    readonly diagramProof: GeneratedBlrCp007EnglishFrozenQuestion["explanation"]["diagramProof"];
  };
  readonly reviewProof: Omit<
    GeneratedBlrCp007EnglishFrozenQuestion["reviewProof"],
    "reviewStatus" | "reviewerNote"
  > & {
    readonly reviewStatus: "LOCALIZED_REVIEW_REQUIRED";
    readonly reviewerNote: string;
  };
  readonly metadata: Omit<
    GeneratedBlrCp007EnglishFrozenQuestion["metadata"],
    "activeEditorialBlockers"
  > & {
    readonly activeEditorialBlockers: readonly [typeof LOCALISATION_BLOCKER];
    readonly locale: BlrCp007TranslatedLocale;
    readonly canonicalLocale: "en-IN";
    readonly canonicalRuntimeVersion: string;
    readonly multilingualRuntimeVersion: typeof BLR_CP007_MULTILINGUAL_RUNTIME_VERSION;
    readonly localizationVersion: typeof BLR_CP007_LOCALIZATION_VERSION;
    readonly localizationStatus: "EXECUTABLE_REVIEW_REQUIRED";
    readonly canonicalItemId: string;
    readonly canonicalSemanticFingerprint: string;
  };
  readonly v4ReviewProof: Omit<
    GeneratedBlrCp007EnglishFrozenQuestion["v4ReviewProof"],
    "activeEditorialBlockers" | "humanReviewRequired"
  > & {
    readonly activeEditorialBlockers: readonly [typeof LOCALISATION_BLOCKER];
    readonly humanReviewRequired: true;
  };
  readonly localisationProof: {
    readonly authority: "BLR_CP007_HI_PA_LOCALISATION_REVIEW_CANDIDATE";
    readonly sourceAuthority: "BLR_CP007_ENGLISH_FROZEN";
    readonly canonicalLocale: "en-IN";
    readonly locale: BlrCp007TranslatedLocale;
    readonly learnerTextLocalized: true;
    readonly semanticParity: "EXECUTABLE_PROVED";
    readonly humanLanguageReviewRequired: true;
    readonly productDeliveryUnlocked: false;
  };
};

function targetOf(question: GeneratedBlrCp007EnglishFrozenQuestion): {
  subjectId: string;
  relationId: BlrCp006Relation;
  referenceId: string;
} | undefined {
  return question.query.kind === "SELECT_VALIDITY"
    ? undefined
    : question.query.target;
}

function expressionBlock(lines: readonly string[]): string {
  return lines.join("\n");
}

function localizedStem(
  question: GeneratedBlrCp007EnglishFrozenQuestion,
  locale: BlrCp007TranslatedLocale,
): string {
  const target = targetOf(question);
  const variant = question.seed % 4;

  if (question.query.kind === "SELECT_EXPRESSION" && target) {
    const clause = localizedBlrCp007TargetClause(
      target.subjectId,
      target.relationId,
      target.referenceId,
      locale,
    );
    const hindi = [
      `कौन-सी कूटित श्रृंखला से यह सिद्ध होता है कि ${clause}?`,
      `सही कूटित विकल्प चुनिए, जिससे यह सिद्ध होता है कि ${clause}।`,
      `बाएँ से दाएँ पढ़ने पर कौन-सा विकल्प यह संबंध स्थापित करता है कि ${clause}?`,
      `कौन-सा कूटित कथन अपेक्षित संबंध बनाता है, अर्थात ${clause}?`,
    ];
    const punjabi = [
      `ਕਿਹੜੀ ਕੋਡਿਤ ਲੜੀ ਤੋਂ ਇਹ ਸਾਬਤ ਹੁੰਦਾ ਹੈ ਕਿ ${clause}?`,
      `ਸਹੀ ਕੋਡਿਤ ਵਿਕਲਪ ਚੁਣੋ, ਜਿਸ ਨਾਲ ਇਹ ਸਾਬਤ ਹੁੰਦਾ ਹੈ ਕਿ ${clause}।`,
      `ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਪੜ੍ਹਨ ਉੱਤੇ ਕਿਹੜਾ ਵਿਕਲਪ ਇਹ ਸੰਬੰਧ ਬਣਾਉਂਦਾ ਹੈ ਕਿ ${clause}?`,
      `ਕਿਹੜਾ ਕੋਡਿਤ ਕਥਨ ਲੋੜੀਂਦਾ ਸੰਬੰਧ ਬਣਾਉਂਦਾ ਹੈ, ਅਰਥਾਤ ${clause}?`,
    ];
    return (locale === "hi-IN" ? hindi : punjabi)[variant]!;
  }

  if (question.query.kind === "MISSING_TOKEN" && target) {
    const clause = localizedBlrCp007TargetClause(
      target.subjectId,
      target.relationId,
      target.referenceId,
      locale,
    );
    const lead = locale === "hi-IN"
      ? `? की जगह कौन-सा संकेत आएगा, जिससे यह सिद्ध होता है कि ${clause}?`
      : `? ਦੀ ਥਾਂ ਕਿਹੜਾ ਸੰਕੇਤ ਆਵੇਗਾ, ਜਿਸ ਨਾਲ ਇਹ ਸਾਬਤ ਹੁੰਦਾ ਹੈ ਕਿ ${clause}?`;
    return `${lead}\n\n${expressionBlock(question.query.expressionLines)}`;
  }

  if (question.query.kind === "MISSING_TOKEN_PAIR" && target) {
    const clause = localizedBlrCp007TargetClause(
      target.subjectId,
      target.relationId,
      target.referenceId,
      locale,
    );
    const lead = locale === "hi-IN"
      ? `रिक्त स्थानों के क्रम में दो संकेत चुनिए, जिससे यह सिद्ध होता है कि ${clause}।`
      : `ਖਾਲੀ ਥਾਵਾਂ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਦੋ ਸੰਕੇਤ ਚੁਣੋ, ਜਿਸ ਨਾਲ ਇਹ ਸਾਬਤ ਹੁੰਦਾ ਹੈ ਕਿ ${clause}।`;
    return `${lead}\n\n${expressionBlock(question.query.expressionLines)}`;
  }

  if (question.query.kind === "MISSING_PERSON" && target) {
    const clause = localizedBlrCp007TargetClause(
      target.subjectId,
      target.relationId,
      target.referenceId,
      locale,
    );
    const candidates = question.query.candidatePersonIds.join(", ");
    const lead = locale === "hi-IN"
      ? `? की जगह कौन-सा व्यक्ति आएगा, जिससे यह सिद्ध होता है कि ${clause}?\nउम्मीदवार: ${candidates}`
      : `? ਦੀ ਥਾਂ ਕਿਹੜਾ ਵਿਅਕਤੀ ਆਵੇਗਾ, ਜਿਸ ਨਾਲ ਇਹ ਸਾਬਤ ਹੁੰਦਾ ਹੈ ਕਿ ${clause}?\nਉਮੀਦਵਾਰ: ${candidates}`;
    return `${lead}\n\n${expressionBlock(question.query.expressionLines)}`;
  }

  if (question.query.kind === "SELECT_VALIDITY") {
    const direct = question.sourcePrototypeId.includes("DIRECT");
    if (locale === "hi-IN") {
      return question.query.desiredStatus === "VALID"
        ? `कौन-सा विकल्प अपने कूटित कथन और लिखी हुई व्याख्या का सही मिलान करता है? चारों ${direct ? "सीधे" : "व्युत्पन्न"} संबंध जाँचिए।`
        : `किस विकल्प में कूटित कथन और लिखी हुई व्याख्या आपस में मेल नहीं खाते? चारों ${direct ? "सीधे" : "व्युत्पन्न"} संबंध जाँचिए।`;
    }
    return question.query.desiredStatus === "VALID"
      ? `ਕਿਹੜਾ ਵਿਕਲਪ ਆਪਣੇ ਕੋਡਿਤ ਕਥਨ ਅਤੇ ਲਿਖੀ ਵਿਆਖਿਆ ਦਾ ਸਹੀ ਮੇਲ ਦਿੰਦਾ ਹੈ? ਚਾਰੇ ${direct ? "ਸਿੱਧੇ" : "ਨਿਕਲੇ ਹੋਏ"} ਸੰਬੰਧ ਜਾਂਚੋ।`
      : `ਕਿਸ ਵਿਕਲਪ ਵਿੱਚ ਕੋਡਿਤ ਕਥਨ ਅਤੇ ਲਿਖੀ ਵਿਆਖਿਆ ਆਪਸ ਵਿੱਚ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ? ਚਾਰੇ ${direct ? "ਸਿੱਧੇ" : "ਨਿਕਲੇ ਹੋਏ"} ਸੰਬੰਧ ਜਾਂਚੋ।`;
  }

  throw new Error(`Unsupported BLR-CP-007 localisation query: ${question.query.kind}`);
}

function localizedOptionText(
  question: GeneratedBlrCp007EnglishFrozenQuestion,
  optionIndex: number,
  locale: BlrCp007TranslatedLocale,
): string {
  const option = question.options[optionIndex]!;
  if (question.query.kind !== "SELECT_VALIDITY") return option.text;
  const candidate = question.query.candidates[optionIndex];
  const claim = candidate?.claim;
  if (!claim) return option.text.split(" — ")[0] ?? option.text;
  const code = option.text.split(" — ")[0] ?? option.text;
  return `${code} — ${localizedBlrCp007RelationStatement(
    claim.subjectId,
    claim.relationId,
    claim.referenceId,
    locale,
  )}`;
}

function localizedOptionExplanation(
  question: GeneratedBlrCp007EnglishFrozenQuestion,
  optionIndex: number,
  locale: BlrCp007TranslatedLocale,
): string {
  const option = question.options[optionIndex]!;

  if (question.query.kind === "SELECT_VALIDITY") {
    const claim = question.query.candidates[optionIndex]?.claim;
    if (!claim || !option.actualRelation) {
      return locale === "hi-IN"
        ? "इस विकल्प को खोलने पर लिखी हुई व्याख्या की पुष्टि नहीं होती।"
        : "ਇਸ ਵਿਕਲਪ ਨੂੰ ਖੋਲ੍ਹਣ ਉੱਤੇ ਲਿਖੀ ਵਿਆਖਿਆ ਦੀ ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੁੰਦੀ।";
    }
    const actual = localizedBlrCp007RelationStatement(
      claim.subjectId,
      option.actualRelation,
      claim.referenceId,
      locale,
    );
    const claimedRelation = option.claimedRelation ?? claim.relationId;
    const claimed = localizedBlrCp007RelationStatement(
      claim.subjectId,
      claimedRelation,
      claim.referenceId,
      locale,
    );
    if (option.statementValidity === "VALID") {
      return locale === "hi-IN"
        ? `कोड खोलने पर ${actual} लिखी हुई व्याख्या भी यही संबंध बताती है, इसलिए मिलान सही है।`
        : `ਕੋਡ ਖੋਲ੍ਹਣ ਉੱਤੇ ${actual} ਲਿਖੀ ਵਿਆਖਿਆ ਵੀ ਇਹੀ ਸੰਬੰਧ ਦੱਸਦੀ ਹੈ, ਇਸ ਲਈ ਮੇਲ ਸਹੀ ਹੈ।`;
    }
    return locale === "hi-IN"
      ? `कोड खोलने पर ${actual} लेकिन विकल्प में ${claimed} इसलिए दोनों में मेल नहीं है।`
      : `ਕੋਡ ਖੋਲ੍ਹਣ ਉੱਤੇ ${actual} ਪਰ ਵਿਕਲਪ ਵਿੱਚ ${claimed} ਇਸ ਲਈ ਦੋਹਾਂ ਵਿੱਚ ਮੇਲ ਨਹੀਂ ਹੈ।`;
  }

  const target = targetOf(question);
  if (!target) throw new Error("Target is required for construction localisation");
  const targetSentence = localizedBlrCp007RelationStatement(
    target.subjectId,
    target.relationId,
    target.referenceId,
    locale,
  );

  if (option.isCorrectAnswerForTask) {
    return locale === "hi-IN"
      ? `इस विकल्प से ${targetSentence} इसलिए यही सही उत्तर है।`
      : `ਇਸ ਵਿਕਲਪ ਨਾਲ ${targetSentence} ਇਸ ਲਈ ਇਹੀ ਸਹੀ ਉੱਤਰ ਹੈ।`;
  }

  if (option.actualRelation) {
    const actual = localizedBlrCp007RelationStatement(
      target.subjectId,
      option.actualRelation,
      target.referenceId,
      locale,
    );
    const wanted = localizedBlrCp007RelationLabel(target.relationId, locale);
    return locale === "hi-IN"
      ? `इस विकल्प से ${actual} अपेक्षित संबंध “${wanted}” नहीं बनता।`
      : `ਇਸ ਵਿਕਲਪ ਨਾਲ ${actual} ਲੋੜੀਂਦਾ ਸੰਬੰਧ “${wanted}” ਨਹੀਂ ਬਣਦਾ।`;
  }

  return locale === "hi-IN"
    ? "इस विकल्प से पूछे गए दोनों व्यक्तियों के बीच आवश्यक संबंध-पथ पूरा नहीं होता।"
    : "ਇਸ ਵਿਕਲਪ ਨਾਲ ਪੁੱਛੇ ਗਏ ਦੋਹਾਂ ਵਿਅਕਤੀਆਂ ਵਿਚਕਾਰ ਲੋੜੀਂਦਾ ਸੰਬੰਧ-ਰਸਤਾ ਪੂਰਾ ਨਹੀਂ ਹੁੰਦਾ।";
}

function localizedSteps(
  question: GeneratedBlrCp007EnglishFrozenQuestion,
  locale: BlrCp007TranslatedLocale,
  localizedAnswer: string,
): readonly string[] {
  const label = localizedBlrCp007OptionLabel(question.correctIndex);
  const target = targetOf(question);
  const targetSentence = target
    ? localizedBlrCp007RelationStatement(
        target.subjectId,
        target.relationId,
        target.referenceId,
        locale,
      )
    : undefined;

  if (question.qlId === "BLR-QL-031") {
    return locale === "hi-IN"
      ? [
          "पहले कोड-कुंजी से हर संकेत का अर्थ पढ़िए।",
          "प्रत्येक विकल्प की श्रृंखला को बाएँ से दाएँ जोड़िए।",
          `केवल विकल्प ${label} से ${targetSentence}`,
        ]
      : [
          "ਪਹਿਲਾਂ ਕੋਡ-ਕੁੰਜੀ ਤੋਂ ਹਰ ਸੰਕੇਤ ਦਾ ਅਰਥ ਪੜ੍ਹੋ।",
          "ਹਰ ਵਿਕਲਪ ਦੀ ਲੜੀ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਜੋੜੋ।",
          `ਸਿਰਫ਼ ਵਿਕਲਪ ${label} ਨਾਲ ${targetSentence}`,
        ];
  }

  if (question.qlId === "BLR-QL-032") {
    const token = question.options[question.correctIndex]!.text;
    const definition = question.codeKey.find((entry) => entry.token === token);
    const meaning = definition
      ? localizedBlrCp007RelationLabel(definition.relationId, locale)
      : token;
    return locale === "hi-IN"
      ? [
          "ज्ञात कड़ियों से रिक्त स्थान वाली सीधी संबंध-कड़ी तय कीजिए।",
          `${token} का अर्थ “${meaning}” है।`,
          `इसे रखने पर ${targetSentence}`,
        ]
      : [
          "ਜਾਣੀਆਂ ਕੜੀਆਂ ਤੋਂ ਖਾਲੀ ਥਾਂ ਵਾਲੀ ਸਿੱਧੀ ਸੰਬੰਧ-ਕੜੀ ਤੈਅ ਕਰੋ।",
          `${token} ਦਾ ਅਰਥ “${meaning}” ਹੈ।`,
          `ਇਸ ਨੂੰ ਰੱਖਣ ਉੱਤੇ ${targetSentence}`,
        ];
  }

  if (question.qlId === "BLR-QL-033") {
    return locale === "hi-IN"
      ? [
          "दोनों रिक्त स्थानों की सीधी संबंध-कड़ियाँ अलग-अलग तय कीजिए।",
          `संकेतों को उसी क्रम में रखिए: ${localizedAnswer.replace(/^[A-D]\.\s*/, "")}।`,
          `पूरी श्रृंखला जाँचने पर ${targetSentence}`,
        ]
      : [
          "ਦੋਹਾਂ ਖਾਲੀ ਥਾਵਾਂ ਦੀਆਂ ਸਿੱਧੀਆਂ ਸੰਬੰਧ-ਕੜੀਆਂ ਵੱਖ-ਵੱਖ ਤੈਅ ਕਰੋ।",
          `ਸੰਕੇਤ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖੋ: ${localizedAnswer.replace(/^[A-D]\.\s*/, "")}।`,
          `ਪੂਰੀ ਲੜੀ ਜਾਂਚਣ ਉੱਤੇ ${targetSentence}`,
        ];
  }

  if (question.qlId === "BLR-QL-034") {
    const person = question.options[question.correctIndex]!.text;
    return locale === "hi-IN"
      ? [
          "पहले पूछे गए दोनों व्यक्तियों के बीच आवश्यक संबंध-पथ पहचानिए।",
          "हर उम्मीदवार को ? की जगह रखकर केवल निर्णायक पथ जाँचिए।",
          `केवल ${person} रखने पर ${targetSentence}`,
        ]
      : [
          "ਪਹਿਲਾਂ ਪੁੱਛੇ ਗਏ ਦੋਹਾਂ ਵਿਅਕਤੀਆਂ ਵਿਚਕਾਰ ਲੋੜੀਂਦਾ ਸੰਬੰਧ-ਰਸਤਾ ਪਛਾਣੋ।",
          "ਹਰ ਉਮੀਦਵਾਰ ਨੂੰ ? ਦੀ ਥਾਂ ਰੱਖ ਕੇ ਸਿਰਫ਼ ਫੈਸਲਾਕੁਨ ਰਸਤਾ ਜਾਂਚੋ।",
          `ਸਿਰਫ਼ ${person} ਰੱਖਣ ਉੱਤੇ ${targetSentence}`,
        ];
  }

  return locale === "hi-IN"
    ? [
        "हर कूटित कथन को बाएँ से दाएँ खोलिए।",
        "निकले हुए संबंध की लिखी हुई व्याख्या से तुलना कीजिए।",
        question.query.kind === "SELECT_VALIDITY" && question.query.desiredStatus === "VALID"
          ? `विकल्प ${label} में दोनों का सही मेल है।`
          : `विकल्प ${label} में दोनों का मेल नहीं है।`,
      ]
    : [
        "ਹਰ ਕੋਡਿਤ ਕਥਨ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਖੋਲ੍ਹੋ।",
        "ਨਿਕਲੇ ਸੰਬੰਧ ਦੀ ਲਿਖੀ ਵਿਆਖਿਆ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।",
        question.query.kind === "SELECT_VALIDITY" && question.query.desiredStatus === "VALID"
          ? `ਵਿਕਲਪ ${label} ਵਿੱਚ ਦੋਹਾਂ ਦਾ ਸਹੀ ਮੇਲ ਹੈ।`
          : `ਵਿਕਲਪ ${label} ਵਿੱਚ ਦੋਹਾਂ ਦਾ ਮੇਲ ਨਹੀਂ ਹੈ।`,
      ];
}

function localizedConclusion(
  question: GeneratedBlrCp007EnglishFrozenQuestion,
  locale: BlrCp007TranslatedLocale,
  localizedAnswer: string,
): string {
  const label = localizedBlrCp007OptionLabel(question.correctIndex);
  if (question.qlId === "BLR-QL-034") {
    const person = question.options[question.correctIndex]!.text;
    return locale === "hi-IN"
      ? `निष्कर्ष: ? की जगह ${person} आएगा; इसलिए विकल्प ${label} सही है।`
      : `ਨਤੀਜਾ: ? ਦੀ ਥਾਂ ${person} ਆਵੇਗਾ; ਇਸ ਲਈ ਵਿਕਲਪ ${label} ਸਹੀ ਹੈ।`;
  }
  return locale === "hi-IN"
    ? `निष्कर्ष: सही उत्तर ${localizedAnswer} है।`
    : `ਨਤੀਜਾ: ਸਹੀ ਉੱਤਰ ${localizedAnswer} ਹੈ।`;
}

function localizedShortcutAndTrap(
  question: GeneratedBlrCp007EnglishFrozenQuestion,
  locale: BlrCp007TranslatedLocale,
): Readonly<{ shortcut: string; trap: string }> {
  const reverse = question.sourcePrototypeId.includes("REVERSE");
  const affinal = question.sourcePrototypeId.includes("AFFINAL");
  if (locale === "hi-IN") {
    const shortcut = question.qlId === "BLR-QL-034"
      ? "पहले लक्ष्य तक सबसे छोटा संबंध-पथ खोजिए; बाकी शाखाओं का उपयोग केवल सही उम्मीदवार पहचानने के लिए करें।"
      : question.qlId === "BLR-QL-035"
        ? "पहले कोड से वास्तविक संबंध निकालिए, फिर उसे लिखी हुई व्याख्या से मिलाइए।"
        : question.qlId === "BLR-QL-033"
          ? "दोनों रिक्त स्थान अलग-अलग हल करें और अंत में पूरी श्रृंखला एक बार जाँचें।"
          : "व्यक्ति-क्रम, सीधा संबंध और संदर्भ व्यक्ति—इन तीनों को एक साथ मिलाइए।";
    const trap = affinal
      ? "विवाह से जुड़े भाई-बहन और भाई-बहन के जीवनसाथी की श्रृंखलाएँ अलग होती हैं; कड़ियों का क्रम न बदलें।"
      : reverse
        ? "उल्टे रूप में पहले तय करें कि किसका संबंध किससे पूछा गया है; केवल सही संबंध-शब्द पर्याप्त नहीं है।"
        : "सही संकेत भी गलत हो जाता है यदि बाएँ और दाएँ व्यक्तियों का क्रम उलट दिया जाए।";
    return { shortcut, trap };
  }
  const shortcut = question.qlId === "BLR-QL-034"
    ? "ਪਹਿਲਾਂ ਨਿਸ਼ਾਨੇ ਤੱਕ ਸਭ ਤੋਂ ਛੋਟਾ ਸੰਬੰਧ-ਰਸਤਾ ਲੱਭੋ; ਬਾਕੀ ਸ਼ਾਖਾਵਾਂ ਸਿਰਫ਼ ਸਹੀ ਉਮੀਦਵਾਰ ਪਛਾਣਣ ਲਈ ਵਰਤੋ।"
    : question.qlId === "BLR-QL-035"
      ? "ਪਹਿਲਾਂ ਕੋਡ ਤੋਂ ਅਸਲ ਸੰਬੰਧ ਕੱਢੋ, ਫਿਰ ਉਸ ਨੂੰ ਲਿਖੀ ਵਿਆਖਿਆ ਨਾਲ ਮਿਲਾਓ।"
      : question.qlId === "BLR-QL-033"
        ? "ਦੋਹਾਂ ਖਾਲੀ ਥਾਵਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਹੱਲ ਕਰੋ ਅਤੇ ਅੰਤ ਵਿੱਚ ਪੂਰੀ ਲੜੀ ਇੱਕ ਵਾਰ ਜਾਂਚੋ।"
        : "ਵਿਅਕਤੀ-ਕ੍ਰਮ, ਸਿੱਧਾ ਸੰਬੰਧ ਅਤੇ ਹਵਾਲਾ ਵਿਅਕਤੀ—ਤਿੰਨਾਂ ਨੂੰ ਇਕੱਠੇ ਮਿਲਾਓ।";
  const trap = affinal
    ? "ਵਿਆਹ ਰਾਹੀਂ ਜੁੜੇ ਭੈਣ-ਭਰਾ ਅਤੇ ਭੈਣ-ਭਰਾ ਦੇ ਜੀਵਨਸਾਥੀ ਦੀਆਂ ਲੜੀਆਂ ਵੱਖ ਹੁੰਦੀਆਂ ਹਨ; ਕੜੀਆਂ ਦਾ ਕ੍ਰਮ ਨਾ ਬਦਲੋ।"
    : reverse
      ? "ਉਲਟ ਰੂਪ ਵਿੱਚ ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਕਿਸ ਦਾ ਸੰਬੰਧ ਕਿਸ ਨਾਲ ਪੁੱਛਿਆ ਗਿਆ ਹੈ; ਸਿਰਫ਼ ਸਹੀ ਸੰਬੰਧ-ਸ਼ਬਦ ਕਾਫ਼ੀ ਨਹੀਂ।"
      : "ਸਹੀ ਸੰਕੇਤ ਵੀ ਗਲਤ ਹੋ ਜਾਂਦਾ ਹੈ ਜੇ ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਵਿਅਕਤੀਆਂ ਦਾ ਕ੍ਰਮ ਉਲਟ ਦਿੱਤਾ ਜਾਵੇ।";
  return { shortcut, trap };
}

function localizedFamilyTree(
  question: GeneratedBlrCp007EnglishFrozenQuestion,
  locale: BlrCp007TranslatedLocale,
): GeneratedBlrCp007EnglishFrozenQuestion["explanation"]["familyTree"] {
  const tree = question.explanation.familyTree;
  const path = tree.query.pathPersonIds.join(" → ");
  return {
    ...tree,
    title: locale === "hi-IN" ? "परिवार संबंध आरेख" : "ਪਰਿਵਾਰਕ ਸੰਬੰਧ ਚਿੱਤਰ",
    accessibleSummary: locale === "hi-IN"
      ? `आरेख में प्रश्न का आवश्यक संबंध-पथ दिखाया गया है: ${path}।`
      : `ਚਿੱਤਰ ਵਿੱਚ ਪ੍ਰਸ਼ਨ ਲਈ ਲੋੜੀਂਦਾ ਸੰਬੰਧ-ਰਸਤਾ ਦਿਖਾਇਆ ਗਿਆ ਹੈ: ${path}।`,
    asciiFallback: path || tree.asciiFallback,
  };
}

function localizedDiagramProof(
  question: GeneratedBlrCp007EnglishFrozenQuestion,
  locale: BlrCp007TranslatedLocale,
): GeneratedBlrCp007EnglishFrozenQuestion["explanation"]["diagramProof"] {
  const proof = question.explanation.diagramProof;
  return {
    ...proof,
    title: locale === "hi-IN" ? "संबंध-पथ की जाँच" : "ਸੰਬੰਧ-ਰਸਤੇ ਦੀ ਜਾਂਚ",
    description: locale === "hi-IN"
      ? "कोडित कड़ियों और उनसे निकले आवश्यक संबंध को क्रम से दिखाया गया है।"
      : "ਕੋਡਿਤ ਕੜੀਆਂ ਅਤੇ ਉਨ੍ਹਾਂ ਤੋਂ ਨਿਕਲੇ ਲੋੜੀਂਦੇ ਸੰਬੰਧ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਦਿਖਾਇਆ ਗਿਆ ਹੈ।",
    legend: locale === "hi-IN"
      ? ["ठोस कड़ी: कोड में दी गई", "सहायक कड़ी: संबंध से निकली", "उभरा हुआ पथ: उत्तर के लिए निर्णायक"]
      : ["ਪੱਕੀ ਕੜੀ: ਕੋਡ ਵਿੱਚ ਦਿੱਤੀ", "ਸਹਾਇਕ ਕੜੀ: ਸੰਬੰਧ ਤੋਂ ਨਿਕਲੀ", "ਉਭਰਿਆ ਰਸਤਾ: ਉੱਤਰ ਲਈ ਫੈਸਲਾਕੁਨ"],
    edges: proof.edges.map((edge) => ({
      ...edge,
      label: localizedBlrCp007DiagramEdgeLabel(edge.type, locale),
    })),
  };
}

export function localizeBlrCp007Question(
  question: GeneratedBlrCp007EnglishFrozenQuestion,
  locale: BlrCp007TranslatedLocale,
): GeneratedBlrCp007LocalizedQuestion {
  const localizedOptions = question.options.map((option, optionIndex) => ({
    ...option,
    text: localizedOptionText(question, optionIndex, locale),
    studentExplanation: localizedOptionExplanation(question, optionIndex, locale),
  }));
  const answer = `${localizedBlrCp007OptionLabel(question.correctIndex)}. ${localizedOptions[question.correctIndex]!.text}`;
  const shortcutAndTrap = localizedShortcutAndTrap(question, locale);

  return {
    ...question,
    locale,
    sharedPrompt: localizedBlrCp007SharedPrompt(question.codeKey, locale),
    stem: localizedStem(question, locale),
    options: localizedOptions,
    answer,
    decodedStatements: question.completedStatements.map((statement) =>
      localizedBlrCp007DirectStatement(statement, question.codeKey, locale)),
    explanation: {
      ...question.explanation,
      steps: localizedSteps(question, locale, answer),
      conclusion: localizedConclusion(question, locale, answer),
      shortcut: shortcutAndTrap.shortcut,
      commonTrap: shortcutAndTrap.trap,
      optionAnalysis: question.explanation.optionAnalysis.map((analysis, optionIndex) => ({
        ...analysis,
        optionText: localizedOptions[optionIndex]!.text,
        explanation: localizedOptions[optionIndex]!.studentExplanation,
      })),
      familyTree: localizedFamilyTree(question, locale),
      diagramProof: localizedDiagramProof(question, locale),
    },
    reviewProof: {
      ...question.reviewProof,
      reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
      reviewerNote: `Executable ${locale} localisation generated from the frozen English authority. Semantic parity is proved; natural-language human review remains required.`,
    },
    metadata: {
      ...question.metadata,
      activeEditorialBlockers: [LOCALISATION_BLOCKER],
      locale,
      canonicalLocale: "en-IN",
      canonicalRuntimeVersion: question.metadata.runtimeVersion,
      multilingualRuntimeVersion: BLR_CP007_MULTILINGUAL_RUNTIME_VERSION,
      localizationVersion: BLR_CP007_LOCALIZATION_VERSION,
      localizationStatus: "EXECUTABLE_REVIEW_REQUIRED",
      canonicalItemId: question.itemId,
      canonicalSemanticFingerprint: question.metadata.semanticFingerprint,
    },
    v4ReviewProof: {
      ...question.v4ReviewProof,
      activeEditorialBlockers: [LOCALISATION_BLOCKER],
      humanReviewRequired: true,
    },
    localisationProof: {
      authority: "BLR_CP007_HI_PA_LOCALISATION_REVIEW_CANDIDATE",
      sourceAuthority: "BLR_CP007_ENGLISH_FROZEN",
      canonicalLocale: "en-IN",
      locale,
      learnerTextLocalized: true,
      semanticParity: "EXECUTABLE_PROVED",
      humanLanguageReviewRequired: true,
      productDeliveryUnlocked: false,
    },
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
  };
}

export function generateBlrCp007LocalizedBank(
  locale: BlrCp007TranslatedLocale,
): readonly GeneratedBlrCp007LocalizedQuestion[] {
  return generateBlrCp007EnglishFrozenBank().map((question) =>
    localizeBlrCp007Question(question, locale));
}

export function generateBlrCp007MultilingualReviewBundle(): Readonly<{
  english: readonly GeneratedBlrCp007EnglishFrozenQuestion[];
  hindi: readonly GeneratedBlrCp007LocalizedQuestion[];
  punjabi: readonly GeneratedBlrCp007LocalizedQuestion[];
}> {
  return {
    english: generateBlrCp007EnglishFrozenBank(),
    hindi: generateBlrCp007LocalizedBank("hi-IN"),
    punjabi: generateBlrCp007LocalizedBank("pa-IN"),
  };
}

export function blrCp007CanonicalParityProjection(
  question: GeneratedBlrCp007EnglishFrozenQuestion | GeneratedBlrCp007LocalizedQuestion,
): unknown {
  return {
    packageId: question.packageId,
    checkpointId: question.checkpointId,
    qlId: question.qlId,
    permanentQlId: question.permanentQlId,
    solveAuthority: question.solveAuthority,
    sourcePrototypeId: question.sourcePrototypeId,
    semanticScenarioId: question.semanticScenarioId,
    seed: question.seed,
    itemId: question.itemId,
    scenarioId: question.scenarioId,
    topologyId: question.topologyId,
    keyStyle: question.keyStyle,
    codeKey: question.codeKey,
    query: question.query,
    answerType: question.answerType,
    correctIndex: question.correctIndex,
    completedStatements: question.completedStatements,
    graph: question.graph,
    delivery: question.delivery,
    optionSemantics: question.options.map((option) => ({
      semanticKey: option.semanticKey,
      completedStatements: option.completedStatements,
      decodedAssertions: option.decodedAssertions,
      graphValidity: option.graphValidity,
      statementValidity: option.statementValidity,
      targetRelationSatisfied: option.targetRelationSatisfied,
      isCorrectAnswerForTask: option.isCorrectAnswerForTask,
      failureCode: option.failureCode,
      actualRelation: option.actualRelation,
      claimedRelation: option.claimedRelation,
    })),
    familyTree: {
      nodes: question.explanation.familyTree.nodes,
      edges: question.explanation.familyTree.edges,
      query: question.explanation.familyTree.query,
    },
    diagramProof: {
      siblingPolicy: question.explanation.diagramProof.siblingPolicy,
      pathPersonIds: question.explanation.diagramProof.pathPersonIds,
      edges: question.explanation.diagramProof.edges.map((edge) => ({
        id: edge.id,
        type: edge.type,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        evidence: edge.evidence,
        highlighted: edge.highlighted,
      })),
      codedEdgeCount: question.explanation.diagramProof.codedEdgeCount,
      inferredEdgeCount: question.explanation.diagramProof.inferredEdgeCount,
    },
    difficulty: question.metadata.difficulty,
    semanticFingerprint: question.metadata.semanticFingerprint,
    v4EditorialFingerprint: question.metadata.v4EditorialFingerprint,
    reviewTargetRelation: question.reviewProof.targetRelation,
    reviewTargetPath: question.reviewProof.targetPath,
  };
}

export function blrCp007SemanticParityIsExact(
  localized: readonly GeneratedBlrCp007LocalizedQuestion[],
): boolean {
  const english = generateBlrCp007EnglishFrozenBank();
  return JSON.stringify(english.map(blrCp007CanonicalParityProjection))
    === JSON.stringify(localized.map(blrCp007CanonicalParityProjection));
}

export function blrCp007LocalizedQuestionText(
  question: GeneratedBlrCp007LocalizedQuestion,
): string {
  return [
    question.sharedPrompt,
    question.stem,
    ...question.options.map((option) => option.text),
    ...question.options.map((option) => option.studentExplanation),
    ...question.decodedStatements,
    ...question.explanation.steps,
    question.explanation.conclusion,
    question.explanation.shortcut ?? "",
    question.explanation.commonTrap ?? "",
    ...question.explanation.optionAnalysis.map((analysis) => analysis.explanation),
    question.explanation.familyTree.title,
    question.explanation.familyTree.accessibleSummary,
    question.explanation.diagramProof.title,
    question.explanation.diagramProof.description,
    ...question.explanation.diagramProof.legend,
    ...question.explanation.diagramProof.edges.map((edge) => edge.label),
  ].join("\n");
}

export function blrCp007LocalizedOptionCodePart(text: string): string {
  return text.split(" — ")[0] ?? text;
}

export function blrCp007LocalizedCandidateList(
  question: GeneratedBlrCp007LocalizedQuestion,
): string {
  return question.query.kind === "MISSING_PERSON"
    ? localizedBlrCp007Join(question.query.candidatePersonIds, question.locale)
    : "";
}
