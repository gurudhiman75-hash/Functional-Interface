import { createHash } from "node:crypto";

import {
  RNK_PARTITION_SCHEMES_V2,
  type RnkPartitionScheme,
} from "../foundation/rnk-derived-object-pool-v2";
import {
  RNK_PERSON_POOL_V2,
  type RnkObjectLocale,
} from "../foundation/rnk-object-pool-v2";
import {
  type RnkCp007CategoryId,
  type RnkCp007Side,
  type RnkCp007CategorySurfaceStyle,
} from "./cp007-category-composition-editorial-v2";
import {
  buildRnkCp007PermanentRuntime,
  type RnkCp007PermanentQuestion,
} from "./cp007-permanent-runtime-v1";

export const RNK_CP007_LOCALIZATION_REVIEW_VERSION =
  "RNK_CP007_HI_PA_LOCALIZATION_REVIEW_V1" as const;
export const RNK_CP007_LOCALIZATION_REVIEW_AUTHORITY =
  "RNK_CP007_HI_PA_LOCALIZATION_REVIEW_CANDIDATE" as const;

export type RnkCp007LocalizedLocale = "hi-IN" | "pa-IN";

export type RnkCp007LocalizedReviewQuestion = Omit<
  RnkCp007PermanentQuestion,
  "stem" | "explanation" | "reviewMetadata" | "lifecycle"
> & {
  readonly locale: RnkCp007LocalizedLocale;
  readonly canonicalLocale: "en-IN";
  readonly stem: string;
  readonly explanation: string;
  readonly reviewMetadata: Omit<RnkCp007PermanentQuestion["reviewMetadata"], "targetName"> & {
    readonly targetName: string;
    readonly canonicalTargetName: string;
    readonly localization: Readonly<{
      version: typeof RNK_CP007_LOCALIZATION_REVIEW_VERSION;
      locale: RnkCp007LocalizedLocale;
      learnerTextLocalized: true;
      humanLanguageReviewRequired: true;
    }>;
  };
  readonly lifecycle: Omit<RnkCp007PermanentQuestion["lifecycle"], "hindiPunjabi"> & {
    readonly hindiPunjabi: "REVIEW_CANDIDATE";
    readonly humanLanguageReviewRequired: true;
    readonly productDeliveryUnlocked: false;
  };
  readonly localizationProof: Readonly<{
    authority: typeof RNK_CP007_LOCALIZATION_REVIEW_AUTHORITY;
    sourceAuthority: "RNK_CP007_ENGLISH_FREEZE_V1";
    canonicalLocale: "en-IN";
    locale: RnkCp007LocalizedLocale;
    canonicalItemId: string;
    canonicalSemanticFingerprint: string;
    localizationFingerprint: string;
    learnerTextLocalized: true;
    semanticParity: "EXECUTABLE_PROVED";
    humanLanguageReviewRequired: true;
    multilingualFreezeGranted: false;
    productDeliveryUnlocked: false;
  }>;
};

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function objectLocale(locale: RnkCp007LocalizedLocale): Exclude<RnkObjectLocale, "en"> {
  return locale === "hi-IN" ? "hi" : "pa";
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function partitionFor(question: RnkCp007PermanentQuestion): RnkPartitionScheme {
  const partition = RNK_PARTITION_SCHEMES_V2.find(
    (entry) => entry.id === question.reviewMetadata.partitionId,
  );
  if (!partition) throw new Error(`Unknown RNK CP007 partition ${question.reviewMetadata.partitionId}`);
  return partition;
}

function localizedTargetName(
  canonicalName: string,
  locale: RnkCp007LocalizedLocale,
): string {
  const person = RNK_PERSON_POOL_V2.find((entry) => entry.names.en === canonicalName);
  if (!person) throw new Error(`Unknown RNK CP007 target name ${canonicalName}`);
  return person.names[objectLocale(locale)];
}

function categoryTotal(
  question: RnkCp007PermanentQuestion,
  category: RnkCp007CategoryId,
): number {
  return category === "A" ? question.state.categoryATotal : question.state.categoryBTotal;
}

function targetAdjustment(
  question: RnkCp007PermanentQuestion,
  category: RnkCp007CategoryId,
): number {
  return question.state.targetCategory === category ? 1 : 0;
}

function localizedLabels(
  question: RnkCp007PermanentQuestion,
  locale: RnkCp007LocalizedLocale,
): {
  whole: string;
  labelA: string;
  labelB: string;
  targetLabel: string;
  evidenceLabel: string;
  requestedLabel: string;
  targetName: string;
} {
  const partition = partitionFor(question);
  const key = objectLocale(locale);
  const labelA = partition.categories[0][key];
  const labelB = partition.categories[1][key];
  return {
    whole: partition.wholeLabels[key],
    labelA,
    labelB,
    targetLabel: question.state.targetCategory === "A" ? labelA : labelB,
    evidenceLabel: question.evidence.category === "A" ? labelA : labelB,
    requestedLabel: question.reviewMetadata.requestedCategory === "A" ? labelA : labelB,
    targetName: localizedTargetName(question.reviewMetadata.targetName, locale),
  };
}

function localizedSide(
  side: RnkCp007Side,
  locale: RnkCp007LocalizedLocale,
): string {
  if (locale === "hi-IN") return side === "AHEAD" ? "आगे" : "पीछे";
  return side === "AHEAD" ? "ਅੱਗੇ" : "ਪਿੱਛੇ";
}

function renderHindiStem(
  question: RnkCp007PermanentQuestion,
  style: RnkCp007CategorySurfaceStyle,
): string {
  const labels = localizedLabels(question, "hi-IN");
  const state = question.state;
  const divisor = gcd(state.categoryATotal, state.categoryBTotal);
  const ratioA = state.categoryATotal / divisor;
  const ratioB = state.categoryBTotal / divisor;
  const evidenceSide = localizedSide(question.evidence.side, "hi-IN");
  const requestedSide = localizedSide(question.reviewMetadata.requestedSide, "hi-IN");
  const rank = `${state.targetRankFromTop}वें`;

  if (style === "RANKED_LIST") {
    return [
      `एक क्रमबद्ध सूची में कुल ${state.total} ${labels.whole} हैं।`,
      `${labels.labelA} और ${labels.labelB} की संख्या का अनुपात ${ratioA}:${ratioB} है।`,
      `${labels.targetName}, जो ${labels.targetLabel} में से है, ऊपर से ${rank} स्थान पर है।`,
      `ठीक ${question.evidence.count} ${labels.evidenceLabel} ${labels.targetName} से ${evidenceSide} हैं।`,
      `${labels.targetName} से ${requestedSide} कितने ${labels.requestedLabel} हैं?`,
    ].join(" ");
  }

  if (style === "ORDER_OF_MERIT") {
    return [
      `योग्यता-क्रम में रखे गए ${state.total} ${labels.whole} में ${labels.labelA} और ${labels.labelB} का अनुपात ${ratioA}:${ratioB} है।`,
      `${labels.targetName}, जो ${labels.targetLabel} में से है, ऊपर से ${rank} स्थान पर है।`,
      `${labels.evidenceLabel} में से ठीक ${question.evidence.count} ${labels.targetName} से ${evidenceSide} हैं।`,
      `${labels.targetName} से ${requestedSide} रहने वाले ${labels.requestedLabel} की संख्या ज्ञात कीजिए।`,
    ].join(" ");
  }

  if (style === "COMPACT_RATIO") {
    return [
      `ऊपर से नीचे तक रैंक किए गए ${state.total} ${labels.whole} में ${labels.labelA}:${labels.labelB} = ${ratioA}:${ratioB} है।`,
      `${labels.targetName}, जो ${labels.targetLabel} में से है, ऊपर से ${rank} है।`,
      `${question.evidence.count} ${labels.evidenceLabel} ${labels.targetName} से ${evidenceSide} हैं।`,
      `${labels.targetName} से ${requestedSide} ${labels.requestedLabel} कितने हैं?`,
    ].join(" ");
  }

  return [
    `कुल ${state.total} ${labels.whole} की रैंकिंग में ${labels.labelA} और ${labels.labelB} की संख्या का अनुपात ${ratioA}:${ratioB} है।`,
    `${labels.targetName}, जो ${labels.targetLabel} में से है, ऊपर से ${rank} स्थान पर है।`,
    `ठीक ${question.evidence.count} ${labels.evidenceLabel} ${labels.targetName} से ${evidenceSide} हैं।`,
    `${labels.targetName} से ${requestedSide} कितने ${labels.requestedLabel} हैं?`,
  ].join(" ");
}

function renderPunjabiStem(
  question: RnkCp007PermanentQuestion,
  style: RnkCp007CategorySurfaceStyle,
): string {
  const labels = localizedLabels(question, "pa-IN");
  const state = question.state;
  const divisor = gcd(state.categoryATotal, state.categoryBTotal);
  const ratioA = state.categoryATotal / divisor;
  const ratioB = state.categoryBTotal / divisor;
  const evidenceSide = localizedSide(question.evidence.side, "pa-IN");
  const requestedSide = localizedSide(question.reviewMetadata.requestedSide, "pa-IN");
  const rank = `${state.targetRankFromTop}ਵੇਂ`;

  if (style === "RANKED_LIST") {
    return [
      `ਇੱਕ ਕ੍ਰਮਬੱਧ ਸੂਚੀ ਵਿੱਚ ਕੁੱਲ ${state.total} ${labels.whole} ਹਨ।`,
      `${labels.labelA} ਅਤੇ ${labels.labelB} ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${ratioA}:${ratioB} ਹੈ।`,
      `${labels.targetName}, ਜੋ ${labels.targetLabel} ਵਿੱਚੋਂ ਹੈ, ਉੱਪਰੋਂ ${rank} ਸਥਾਨ 'ਤੇ ਹੈ।`,
      `ਠੀਕ ${question.evidence.count} ${labels.evidenceLabel} ${labels.targetName} ਤੋਂ ${evidenceSide} ਹਨ।`,
      `${labels.targetName} ਤੋਂ ${requestedSide} ਕਿੰਨੇ ${labels.requestedLabel} ਹਨ?`,
    ].join(" ");
  }

  if (style === "ORDER_OF_MERIT") {
    return [
      `ਯੋਗਤਾ-ਕ੍ਰਮ ਵਿੱਚ ਰੱਖੇ ${state.total} ${labels.whole} ਵਿੱਚ ${labels.labelA} ਅਤੇ ${labels.labelB} ਦਾ ਅਨੁਪਾਤ ${ratioA}:${ratioB} ਹੈ।`,
      `${labels.targetName}, ਜੋ ${labels.targetLabel} ਵਿੱਚੋਂ ਹੈ, ਉੱਪਰੋਂ ${rank} ਸਥਾਨ 'ਤੇ ਹੈ।`,
      `${labels.evidenceLabel} ਵਿੱਚੋਂ ਠੀਕ ${question.evidence.count} ${labels.targetName} ਤੋਂ ${evidenceSide} ਹਨ।`,
      `${labels.targetName} ਤੋਂ ${requestedSide} ਰਹਿਣ ਵਾਲੇ ${labels.requestedLabel} ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`,
    ].join(" ");
  }

  if (style === "COMPACT_RATIO") {
    return [
      `ਉੱਪਰੋਂ ਹੇਠਾਂ ਤੱਕ ਦਰਜਾਬੰਦੀ ਕੀਤੇ ${state.total} ${labels.whole} ਵਿੱਚ ${labels.labelA}:${labels.labelB} = ${ratioA}:${ratioB} ਹੈ।`,
      `${labels.targetName}, ਜੋ ${labels.targetLabel} ਵਿੱਚੋਂ ਹੈ, ਉੱਪਰੋਂ ${rank} ਹੈ।`,
      `${question.evidence.count} ${labels.evidenceLabel} ${labels.targetName} ਤੋਂ ${evidenceSide} ਹਨ।`,
      `${labels.targetName} ਤੋਂ ${requestedSide} ${labels.requestedLabel} ਕਿੰਨੇ ਹਨ?`,
    ].join(" ");
  }

  return [
    `ਕੁੱਲ ${state.total} ${labels.whole} ਦੀ ਦਰਜਾਬੰਦੀ ਵਿੱਚ ${labels.labelA} ਅਤੇ ${labels.labelB} ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${ratioA}:${ratioB} ਹੈ।`,
    `${labels.targetName}, ਜੋ ${labels.targetLabel} ਵਿੱਚੋਂ ਹੈ, ਉੱਪਰੋਂ ${rank} ਸਥਾਨ 'ਤੇ ਹੈ।`,
    `ਠੀਕ ${question.evidence.count} ${labels.evidenceLabel} ${labels.targetName} ਤੋਂ ${evidenceSide} ਹਨ।`,
    `${labels.targetName} ਤੋਂ ${requestedSide} ਕਿੰਨੇ ${labels.requestedLabel} ਹਨ?`,
  ].join(" ");
}

function renderHindiExplanation(question: RnkCp007PermanentQuestion): string {
  const labels = localizedLabels(question, "hi-IN");
  const state = question.state;
  const totalAhead = state.targetRankFromTop - 1;
  const evidenceAdjustment = targetAdjustment(question, question.evidence.category);
  const evidenceAhead = question.evidence.side === "AHEAD"
    ? question.evidence.count
    : categoryTotal(question, question.evidence.category)
      - question.evidence.count
      - evidenceAdjustment;
  const requestedAhead = totalAhead - evidenceAhead;

  const evidenceStep = question.evidence.side === "AHEAD"
    ? `दिए गए अनुसार ${question.evidence.count} ${labels.evidenceLabel} पहले से ${labels.targetName} से आगे हैं।`
    : `कुल ${categoryTotal(question, question.evidence.category)} ${labels.evidenceLabel} हैं। इनमें ${question.evidence.count} ${labels.targetName} से पीछे हैं${evidenceAdjustment ? ` और ${labels.targetName} स्वयं इसी वर्ग में है` : ""}; इसलिए आगे वाले ${labels.evidenceLabel} = ${categoryTotal(question, question.evidence.category)} - ${question.evidence.count}${evidenceAdjustment ? " - 1" : ""} = ${evidenceAhead}।`;

  const prefix = `अनुपात से ${state.categoryATotal} ${labels.labelA} और ${state.categoryBTotal} ${labels.labelB} मिलते हैं। ऊपर से ${state.targetRankFromTop}वाँ स्थान होने का अर्थ है कि ${totalAhead} सदस्य आगे हैं। ${evidenceStep}`;

  if (question.reviewMetadata.requestedSide === "AHEAD") {
    return `${prefix} अतः ${labels.requestedLabel} में आगे वालों की संख्या = ${totalAhead} - ${evidenceAhead} = ${question.answer}।`;
  }

  const requestedAdjustment = targetAdjustment(question, question.reviewMetadata.requestedCategory);
  return `${prefix} इसलिए ${labels.requestedLabel} में ${requestedAhead} सदस्य आगे हैं। अतः पीछे वालों की संख्या = ${categoryTotal(question, question.reviewMetadata.requestedCategory)} - ${requestedAhead}${requestedAdjustment ? " - 1" : ""} = ${question.answer}।`;
}

function renderPunjabiExplanation(question: RnkCp007PermanentQuestion): string {
  const labels = localizedLabels(question, "pa-IN");
  const state = question.state;
  const totalAhead = state.targetRankFromTop - 1;
  const evidenceAdjustment = targetAdjustment(question, question.evidence.category);
  const evidenceAhead = question.evidence.side === "AHEAD"
    ? question.evidence.count
    : categoryTotal(question, question.evidence.category)
      - question.evidence.count
      - evidenceAdjustment;
  const requestedAhead = totalAhead - evidenceAhead;

  const evidenceStep = question.evidence.side === "AHEAD"
    ? `ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਅਨੁਸਾਰ ${question.evidence.count} ${labels.evidenceLabel} ਪਹਿਲਾਂ ਹੀ ${labels.targetName} ਤੋਂ ਅੱਗੇ ਹਨ।`
    : `ਕੁੱਲ ${categoryTotal(question, question.evidence.category)} ${labels.evidenceLabel} ਹਨ। ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ${question.evidence.count} ${labels.targetName} ਤੋਂ ਪਿੱਛੇ ਹਨ${evidenceAdjustment ? ` ਅਤੇ ${labels.targetName} ਖੁਦ ਇਸੇ ਵਰਗ ਵਿੱਚ ਹੈ` : ""}; ਇਸ ਲਈ ਅੱਗੇ ਵਾਲੇ ${labels.evidenceLabel} = ${categoryTotal(question, question.evidence.category)} - ${question.evidence.count}${evidenceAdjustment ? " - 1" : ""} = ${evidenceAhead}।`;

  const prefix = `ਅਨੁਪਾਤ ਤੋਂ ${state.categoryATotal} ${labels.labelA} ਅਤੇ ${state.categoryBTotal} ${labels.labelB} ਮਿਲਦੇ ਹਨ। ਉੱਪਰੋਂ ${state.targetRankFromTop}ਵਾਂ ਸਥਾਨ ਹੋਣ ਦਾ ਅਰਥ ਹੈ ਕਿ ${totalAhead} ਮੈਂਬਰ ਅੱਗੇ ਹਨ। ${evidenceStep}`;

  if (question.reviewMetadata.requestedSide === "AHEAD") {
    return `${prefix} ਇਸ ਲਈ ${labels.requestedLabel} ਵਿੱਚ ਅੱਗੇ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ = ${totalAhead} - ${evidenceAhead} = ${question.answer}।`;
  }

  const requestedAdjustment = targetAdjustment(question, question.reviewMetadata.requestedCategory);
  return `${prefix} ਇਸ ਕਰਕੇ ${labels.requestedLabel} ਵਿੱਚ ${requestedAhead} ਮੈਂਬਰ ਅੱਗੇ ਹਨ। ਇਸ ਲਈ ਪਿੱਛੇ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ = ${categoryTotal(question, question.reviewMetadata.requestedCategory)} - ${requestedAhead}${requestedAdjustment ? " - 1" : ""} = ${question.answer}।`;
}

export function rnkCp007CanonicalSemanticFingerprint(
  question: RnkCp007PermanentQuestion,
): string {
  return sha256({
    permanentQlId: question.permanentProfile.permanentQlId,
    authorityId: question.permanentProfile.authorityId,
    permanentOrdinal: question.permanentProfile.permanentOrdinal,
    mode: question.mode,
    candidateOrdinal: question.candidateOrdinal,
    difficulty: question.difficulty,
    surfaceStyle: question.reviewMetadata.surfaceProfile.style,
    partitionId: question.reviewMetadata.partitionId,
    requestedCategory: question.reviewMetadata.requestedCategory,
    requestedSide: question.reviewMetadata.requestedSide,
    state: question.state,
    evidence: question.evidence,
    options: question.options,
    answerIndex: question.answerIndex,
    answer: question.answer,
    mathematicalFingerprint: question.mathematicalFingerprint,
    permanentRuntimeFingerprint: question.permanentRuntimeFingerprint,
  });
}

export function localizeRnkCp007PermanentQuestion(
  question: RnkCp007PermanentQuestion,
  locale: RnkCp007LocalizedLocale,
): RnkCp007LocalizedReviewQuestion {
  const style = question.reviewMetadata.surfaceProfile.style;
  const stem = locale === "hi-IN"
    ? renderHindiStem(question, style)
    : renderPunjabiStem(question, style);
  const explanation = locale === "hi-IN"
    ? renderHindiExplanation(question)
    : renderPunjabiExplanation(question);
  const targetName = localizedTargetName(question.reviewMetadata.targetName, locale);
  const canonicalSemanticFingerprint = rnkCp007CanonicalSemanticFingerprint(question);
  const canonicalItemId = `${question.permanentProfile.permanentQlId}:${String(question.permanentProfile.permanentOrdinal).padStart(3, "0")}`;
  const localizationFingerprint = sha256({
    version: RNK_CP007_LOCALIZATION_REVIEW_VERSION,
    canonicalItemId,
    canonicalSemanticFingerprint,
    locale,
    stem,
    explanation,
  });

  return {
    ...question,
    locale,
    canonicalLocale: "en-IN",
    stem,
    explanation,
    reviewMetadata: {
      ...question.reviewMetadata,
      targetName,
      canonicalTargetName: question.reviewMetadata.targetName,
      localization: {
        version: RNK_CP007_LOCALIZATION_REVIEW_VERSION,
        locale,
        learnerTextLocalized: true,
        humanLanguageReviewRequired: true,
      },
    },
    lifecycle: {
      permanentQlAllocated: true,
      englishFrozen: true,
      questionStudio: "DISABLED",
      persistence: "DISABLED",
      questionBank: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      hindiPunjabi: "REVIEW_CANDIDATE",
      humanLanguageReviewRequired: true,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      authority: RNK_CP007_LOCALIZATION_REVIEW_AUTHORITY,
      sourceAuthority: "RNK_CP007_ENGLISH_FREEZE_V1",
      canonicalLocale: "en-IN",
      locale,
      canonicalItemId,
      canonicalSemanticFingerprint,
      localizationFingerprint,
      learnerTextLocalized: true,
      semanticParity: "EXECUTABLE_PROVED",
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      productDeliveryUnlocked: false,
    },
  };
}

export function buildRnkCp007LocalizedReviewBank(
  locale: RnkCp007LocalizedLocale,
): readonly RnkCp007LocalizedReviewQuestion[] {
  return buildRnkCp007PermanentRuntime().map((question) =>
    localizeRnkCp007PermanentQuestion(question, locale),
  );
}

export function buildRnkCp007MultilingualReviewCandidate(): Readonly<{
  hindi: readonly RnkCp007LocalizedReviewQuestion[];
  punjabi: readonly RnkCp007LocalizedReviewQuestion[];
}> {
  return {
    hindi: buildRnkCp007LocalizedReviewBank("hi-IN"),
    punjabi: buildRnkCp007LocalizedReviewBank("pa-IN"),
  };
}
