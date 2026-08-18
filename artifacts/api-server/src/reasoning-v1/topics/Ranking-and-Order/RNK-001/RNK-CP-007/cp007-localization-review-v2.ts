import { createHash } from "node:crypto";

import {
  RNK_PARTITION_SCHEMES_V2,
  type RnkPartitionScheme,
} from "../foundation/rnk-derived-object-pool-v2";
import {
  type RnkCp007CategoryId,
  type RnkCp007Side,
  type RnkCp007CategorySurfaceStyle,
} from "./cp007-category-composition-editorial-v2";
import {
  buildRnkCp007PermanentRuntime,
  type RnkCp007PermanentQuestion,
} from "./cp007-permanent-runtime-v1";
import {
  localizeRnkCp007PermanentQuestion,
  type RnkCp007LocalizedLocale,
  type RnkCp007LocalizedReviewQuestion,
} from "./cp007-localization-review-v1";

export const RNK_CP007_LOCALIZATION_REVIEW_V2_VERSION =
  "RNK_CP007_HI_PA_LOCALIZATION_REVIEW_V2" as const;
export const RNK_CP007_LOCALIZATION_REVIEW_V2_AUTHORITY =
  "RNK_CP007_HI_PA_NATIVE_EDITORIAL_REVIEW_V2" as const;
export const RNK_CP007_LOCALIZATION_REVIEW_V2_EDITORIAL =
  "NATIVE_OBLIQUE_AND_RANK_GRAMMAR_V2" as const;

export type RnkCp007LocalizedReviewQuestionV2 = Omit<
  RnkCp007LocalizedReviewQuestion,
  "stem" | "explanation" | "reviewMetadata" | "localizationProof"
> & {
  readonly stem: string;
  readonly explanation: string;
  readonly reviewMetadata: Omit<RnkCp007LocalizedReviewQuestion["reviewMetadata"], "localization"> & {
    readonly localization: Readonly<{
      version: typeof RNK_CP007_LOCALIZATION_REVIEW_V2_VERSION;
      locale: RnkCp007LocalizedLocale;
      learnerTextLocalized: true;
      humanLanguageReviewRequired: true;
      editorialVersion: typeof RNK_CP007_LOCALIZATION_REVIEW_V2_EDITORIAL;
    }>;
  };
  readonly localizationProof: Omit<
    RnkCp007LocalizedReviewQuestion["localizationProof"],
    "authority" | "localizationFingerprint"
  > & {
    readonly authority: typeof RNK_CP007_LOCALIZATION_REVIEW_V2_AUTHORITY;
    readonly localizationFingerprint: string;
    readonly editorialVersion: typeof RNK_CP007_LOCALIZATION_REVIEW_V2_EDITORIAL;
  };
};

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function partitionFor(question: RnkCp007PermanentQuestion): RnkPartitionScheme {
  const partition = RNK_PARTITION_SCHEMES_V2.find(
    (entry) => entry.id === question.reviewMetadata.partitionId,
  );
  if (!partition) throw new Error(`Unknown RNK CP007 partition ${question.reviewMetadata.partitionId}`);
  return partition;
}

const HINDI_OBLIQUE_SUFFIXES: readonly (readonly [string, string])[] = [
  ["लड़कियाँ", "लड़कियों"],
  ["लड़के", "लड़कों"],
  ["विद्यार्थी", "विद्यार्थियों"],
  ["अभ्यर्थी", "अभ्यर्थियों"],
  ["प्रशिक्षु", "प्रशिक्षुओं"],
  ["प्रतिभागी", "प्रतिभागियों"],
  ["कर्मचारी", "कर्मचारियों"],
  ["आवेदक", "आवेदकों"],
  ["परीक्षार्थी", "परीक्षार्थियों"],
] as const;

const PUNJABI_OBLIQUE_SUFFIXES: readonly (readonly [string, string])[] = [
  ["ਮੁੰਡੇ", "ਮੁੰਡਿਆਂ"],
  ["ਕੁੜੀਆਂ", "ਕੁੜੀਆਂ"],
  ["ਵਿਦਿਆਰਥੀ", "ਵਿਦਿਆਰਥੀਆਂ"],
  ["ਉਮੀਦਵਾਰ", "ਉਮੀਦਵਾਰਾਂ"],
  ["ਸਿਖਿਆਰਥੀ", "ਸਿਖਿਆਰਥੀਆਂ"],
  ["ਭਾਗੀਦਾਰ", "ਭਾਗੀਦਾਰਾਂ"],
  ["ਕਰਮਚਾਰੀ", "ਕਰਮਚਾਰੀਆਂ"],
  ["ਅਰਜ਼ੀਦਾਰ", "ਅਰਜ਼ੀਦਾਰਾਂ"],
  ["ਪਰੀਖਿਆਰਥੀ", "ਪਰੀਖਿਆਰਥੀਆਂ"],
] as const;

export function rnkCp007NativeObliquePlural(
  label: string,
  locale: RnkCp007LocalizedLocale,
): string {
  const replacements = locale === "hi-IN" ? HINDI_OBLIQUE_SUFFIXES : PUNJABI_OBLIQUE_SUFFIXES;
  for (const [direct, oblique] of replacements) {
    if (label.endsWith(direct)) {
      return `${label.slice(0, label.length - direct.length)}${oblique}`;
    }
  }
  throw new Error(`No CP007 ${locale} oblique-plural rule for label: ${label}`);
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

function localizedSide(side: RnkCp007Side, locale: RnkCp007LocalizedLocale): string {
  if (locale === "hi-IN") return side === "AHEAD" ? "आगे" : "पीछे";
  return side === "AHEAD" ? "ਅੱਗੇ" : "ਪਿੱਛੇ";
}

function localizedLabels(
  question: RnkCp007PermanentQuestion,
  locale: RnkCp007LocalizedLocale,
  targetName: string,
): {
  whole: string;
  wholeOblique: string;
  labelA: string;
  labelAOblique: string;
  labelB: string;
  labelBOblique: string;
  targetLabel: string;
  targetOblique: string;
  evidenceLabel: string;
  evidenceOblique: string;
  requestedLabel: string;
  requestedOblique: string;
  targetName: string;
} {
  const partition = partitionFor(question);
  const key = locale === "hi-IN" ? "hi" : "pa";
  const whole = partition.wholeLabels[key];
  const labelA = partition.categories[0][key];
  const labelB = partition.categories[1][key];
  const targetLabel = question.state.targetCategory === "A" ? labelA : labelB;
  const evidenceLabel = question.evidence.category === "A" ? labelA : labelB;
  const requestedLabel = question.reviewMetadata.requestedCategory === "A" ? labelA : labelB;
  return {
    whole,
    wholeOblique: rnkCp007NativeObliquePlural(whole, locale),
    labelA,
    labelAOblique: rnkCp007NativeObliquePlural(labelA, locale),
    labelB,
    labelBOblique: rnkCp007NativeObliquePlural(labelB, locale),
    targetLabel,
    targetOblique: rnkCp007NativeObliquePlural(targetLabel, locale),
    evidenceLabel,
    evidenceOblique: rnkCp007NativeObliquePlural(evidenceLabel, locale),
    requestedLabel,
    requestedOblique: rnkCp007NativeObliquePlural(requestedLabel, locale),
    targetName,
  };
}

function renderHindiStem(
  question: RnkCp007PermanentQuestion,
  style: RnkCp007CategorySurfaceStyle,
  targetName: string,
): string {
  const labels = localizedLabels(question, "hi-IN", targetName);
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
      `${labels.labelAOblique} और ${labels.labelBOblique} की संख्या का अनुपात ${ratioA}:${ratioB} है।`,
      `${labels.targetName}, जो ${labels.targetOblique} में से है, ऊपर से ${rank} स्थान पर है।`,
      `ठीक ${question.evidence.count} ${labels.evidenceLabel} ${labels.targetName} से ${evidenceSide} हैं।`,
      `${labels.targetName} से ${requestedSide} कितने ${labels.requestedLabel} हैं?`,
    ].join(" ");
  }

  if (style === "ORDER_OF_MERIT") {
    return [
      `योग्यता-क्रम में रखे गए ${state.total} ${labels.wholeOblique} में ${labels.labelAOblique} और ${labels.labelBOblique} की संख्या का अनुपात ${ratioA}:${ratioB} है।`,
      `${labels.targetName}, जो ${labels.targetOblique} में से है, ऊपर से ${rank} स्थान पर है।`,
      `${labels.evidenceOblique} में से ठीक ${question.evidence.count} ${labels.targetName} से ${evidenceSide} हैं।`,
      `${labels.targetName} से ${requestedSide} ${labels.requestedOblique} की संख्या ज्ञात कीजिए।`,
    ].join(" ");
  }

  if (style === "COMPACT_RATIO") {
    return [
      `ऊपर से नीचे तक रैंक किए गए ${state.total} ${labels.wholeOblique} में ${labels.labelA}:${labels.labelB} = ${ratioA}:${ratioB} है।`,
      `${labels.targetName}, जो ${labels.targetOblique} में से है, ऊपर से ${rank} स्थान पर है।`,
      `${question.evidence.count} ${labels.evidenceLabel} ${labels.targetName} से ${evidenceSide} हैं।`,
      `${labels.targetName} से ${requestedSide} ${labels.requestedLabel} कितने हैं?`,
    ].join(" ");
  }

  return [
    `कुल ${state.total} ${labels.wholeOblique} की रैंकिंग में ${labels.labelAOblique} और ${labels.labelBOblique} की संख्या का अनुपात ${ratioA}:${ratioB} है।`,
    `${labels.targetName}, जो ${labels.targetOblique} में से है, ऊपर से ${rank} स्थान पर है।`,
    `ठीक ${question.evidence.count} ${labels.evidenceLabel} ${labels.targetName} से ${evidenceSide} हैं।`,
    `${labels.targetName} से ${requestedSide} कितने ${labels.requestedLabel} हैं?`,
  ].join(" ");
}

function renderPunjabiStem(
  question: RnkCp007PermanentQuestion,
  style: RnkCp007CategorySurfaceStyle,
  targetName: string,
): string {
  const labels = localizedLabels(question, "pa-IN", targetName);
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
      `${labels.labelAOblique} ਅਤੇ ${labels.labelBOblique} ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${ratioA}:${ratioB} ਹੈ।`,
      `${labels.targetName}, ਜੋ ${labels.targetOblique} ਵਿੱਚੋਂ ਹੈ, ਉੱਪਰੋਂ ${rank} ਸਥਾਨ 'ਤੇ ਹੈ।`,
      `ਠੀਕ ${question.evidence.count} ${labels.evidenceLabel} ${labels.targetName} ਤੋਂ ${evidenceSide} ਹਨ।`,
      `${labels.targetName} ਤੋਂ ${requestedSide} ਕਿੰਨੇ ${labels.requestedLabel} ਹਨ?`,
    ].join(" ");
  }

  if (style === "ORDER_OF_MERIT") {
    return [
      `ਯੋਗਤਾ-ਕ੍ਰਮ ਵਿੱਚ ਰੱਖੇ ${state.total} ${labels.wholeOblique} ਵਿੱਚ ${labels.labelAOblique} ਅਤੇ ${labels.labelBOblique} ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${ratioA}:${ratioB} ਹੈ।`,
      `${labels.targetName}, ਜੋ ${labels.targetOblique} ਵਿੱਚੋਂ ਹੈ, ਉੱਪਰੋਂ ${rank} ਸਥਾਨ 'ਤੇ ਹੈ।`,
      `${labels.evidenceOblique} ਵਿੱਚੋਂ ਠੀਕ ${question.evidence.count} ${labels.targetName} ਤੋਂ ${evidenceSide} ਹਨ।`,
      `${labels.targetName} ਤੋਂ ${requestedSide} ${labels.requestedOblique} ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`,
    ].join(" ");
  }

  if (style === "COMPACT_RATIO") {
    return [
      `ਉੱਪਰੋਂ ਹੇਠਾਂ ਤੱਕ ਦਰਜਾਬੰਦੀ ਕੀਤੇ ${state.total} ${labels.wholeOblique} ਵਿੱਚ ${labels.labelA}:${labels.labelB} = ${ratioA}:${ratioB} ਹੈ।`,
      `${labels.targetName}, ਜੋ ${labels.targetOblique} ਵਿੱਚੋਂ ਹੈ, ਉੱਪਰੋਂ ${rank} ਸਥਾਨ 'ਤੇ ਹੈ।`,
      `${question.evidence.count} ${labels.evidenceLabel} ${labels.targetName} ਤੋਂ ${evidenceSide} ਹਨ।`,
      `${labels.targetName} ਤੋਂ ${requestedSide} ${labels.requestedLabel} ਕਿੰਨੇ ਹਨ?`,
    ].join(" ");
  }

  return [
    `ਕੁੱਲ ${state.total} ${labels.wholeOblique} ਦੀ ਦਰਜਾਬੰਦੀ ਵਿੱਚ ${labels.labelAOblique} ਅਤੇ ${labels.labelBOblique} ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${ratioA}:${ratioB} ਹੈ।`,
    `${labels.targetName}, ਜੋ ${labels.targetOblique} ਵਿੱਚੋਂ ਹੈ, ਉੱਪਰੋਂ ${rank} ਸਥਾਨ 'ਤੇ ਹੈ।`,
    `ਠੀਕ ${question.evidence.count} ${labels.evidenceLabel} ${labels.targetName} ਤੋਂ ${evidenceSide} ਹਨ।`,
    `${labels.targetName} ਤੋਂ ${requestedSide} ਕਿੰਨੇ ${labels.requestedLabel} ਹਨ?`,
  ].join(" ");
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function renderHindiExplanation(
  question: RnkCp007PermanentQuestion,
  targetName: string,
): string {
  const labels = localizedLabels(question, "hi-IN", targetName);
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

  const prefix = `${labels.labelAOblique} की संख्या ${state.categoryATotal} और ${labels.labelBOblique} की संख्या ${state.categoryBTotal} है। ऊपर से ${state.targetRankFromTop}वाँ स्थान होने का अर्थ है कि ${totalAhead} सदस्य आगे हैं। ${evidenceStep}`;

  if (question.reviewMetadata.requestedSide === "AHEAD") {
    return `${prefix} अतः ${labels.requestedOblique} में आगे वालों की संख्या = ${totalAhead} - ${evidenceAhead} = ${question.answer}।`;
  }

  const requestedAdjustment = targetAdjustment(question, question.reviewMetadata.requestedCategory);
  return `${prefix} इसलिए ${labels.requestedOblique} में ${requestedAhead} सदस्य आगे हैं। अतः पीछे वालों की संख्या = ${categoryTotal(question, question.reviewMetadata.requestedCategory)} - ${requestedAhead}${requestedAdjustment ? " - 1" : ""} = ${question.answer}।`;
}

function renderPunjabiExplanation(
  question: RnkCp007PermanentQuestion,
  targetName: string,
): string {
  const labels = localizedLabels(question, "pa-IN", targetName);
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

  const prefix = `${labels.labelAOblique} ਦੀ ਗਿਣਤੀ ${state.categoryATotal} ਅਤੇ ${labels.labelBOblique} ਦੀ ਗਿਣਤੀ ${state.categoryBTotal} ਹੈ। ਉੱਪਰੋਂ ${state.targetRankFromTop}ਵਾਂ ਸਥਾਨ ਹੋਣ ਦਾ ਅਰਥ ਹੈ ਕਿ ${totalAhead} ਮੈਂਬਰ ਅੱਗੇ ਹਨ। ${evidenceStep}`;

  if (question.reviewMetadata.requestedSide === "AHEAD") {
    return `${prefix} ਇਸ ਲਈ ${labels.requestedOblique} ਵਿੱਚ ਅੱਗੇ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ = ${totalAhead} - ${evidenceAhead} = ${question.answer}।`;
  }

  const requestedAdjustment = targetAdjustment(question, question.reviewMetadata.requestedCategory);
  return `${prefix} ਇਸ ਕਰਕੇ ${labels.requestedOblique} ਵਿੱਚ ${requestedAhead} ਮੈਂਬਰ ਅੱਗੇ ਹਨ। ਇਸ ਲਈ ਪਿੱਛੇ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ = ${categoryTotal(question, question.reviewMetadata.requestedCategory)} - ${requestedAhead}${requestedAdjustment ? " - 1" : ""} = ${question.answer}।`;
}

export function localizeRnkCp007PermanentQuestionV2(
  question: RnkCp007PermanentQuestion,
  locale: RnkCp007LocalizedLocale,
): RnkCp007LocalizedReviewQuestionV2 {
  const base = localizeRnkCp007PermanentQuestion(question, locale);
  const style = question.reviewMetadata.surfaceProfile.style;
  const targetName = base.reviewMetadata.targetName;
  const stem = locale === "hi-IN"
    ? renderHindiStem(question, style, targetName)
    : renderPunjabiStem(question, style, targetName);
  const explanation = locale === "hi-IN"
    ? renderHindiExplanation(question, targetName)
    : renderPunjabiExplanation(question, targetName);
  const localizationFingerprint = sha256({
    version: RNK_CP007_LOCALIZATION_REVIEW_V2_VERSION,
    canonicalItemId: base.localizationProof.canonicalItemId,
    canonicalSemanticFingerprint: base.localizationProof.canonicalSemanticFingerprint,
    locale,
    stem,
    explanation,
  });

  return {
    ...base,
    stem,
    explanation,
    reviewMetadata: {
      ...base.reviewMetadata,
      localization: {
        version: RNK_CP007_LOCALIZATION_REVIEW_V2_VERSION,
        locale,
        learnerTextLocalized: true,
        humanLanguageReviewRequired: true,
        editorialVersion: RNK_CP007_LOCALIZATION_REVIEW_V2_EDITORIAL,
      },
    },
    localizationProof: {
      ...base.localizationProof,
      authority: RNK_CP007_LOCALIZATION_REVIEW_V2_AUTHORITY,
      localizationFingerprint,
      editorialVersion: RNK_CP007_LOCALIZATION_REVIEW_V2_EDITORIAL,
    },
  };
}

export function buildRnkCp007LocalizedReviewBankV2(
  locale: RnkCp007LocalizedLocale,
): readonly RnkCp007LocalizedReviewQuestionV2[] {
  return buildRnkCp007PermanentRuntime().map((question) =>
    localizeRnkCp007PermanentQuestionV2(question, locale),
  );
}

export function buildRnkCp007MultilingualReviewCandidateV2(): Readonly<{
  hindi: readonly RnkCp007LocalizedReviewQuestionV2[];
  punjabi: readonly RnkCp007LocalizedReviewQuestionV2[];
}> {
  return {
    hindi: buildRnkCp007LocalizedReviewBankV2("hi-IN"),
    punjabi: buildRnkCp007LocalizedReviewBankV2("pa-IN"),
  };
}
