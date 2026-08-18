import { createHash } from "node:crypto";

import { RNK_PARTITION_SCHEMES_V2 } from "../foundation/rnk-derived-object-pool-v2";
import {
  buildRnkCp007PermanentRuntime,
  type RnkCp007PermanentQuestion,
} from "./cp007-permanent-runtime-v1";
import {
  buildRnkCp007LocalizedReviewBankV4,
  type RnkCp007LocalizedReviewQuestionV4,
} from "./cp007-localization-review-v4";

export const RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_VERSION =
  "RNK_CP007_QL042_PERCENTAGE_PRESENTATION_ADAPTER_V1" as const;
export const RNK_CP007_PERCENTAGE_PRESENTATION_AUTHORITY =
  "CATEGORY_COMPOSITION_PERCENTAGE_PRESENTATION_TO_RNK_QL_042" as const;

export type RnkCp007PercentageAdapterLocale = "en-IN" | "hi-IN" | "pa-IN";
type AnyQuestion = Record<string, any>;

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function percentPart(part: number, total: number): number | null {
  const scaled = part * 100;
  if (scaled % total !== 0) return null;
  const value = scaled / total;
  if (value < 20 || value > 80 || value % 5 !== 0) return null;
  return value;
}

function percentages(question: RnkCp007PermanentQuestion): readonly [number, number] | null {
  const a = percentPart(question.state.categoryATotal, question.state.total);
  const b = percentPart(question.state.categoryBTotal, question.state.total);
  if (a === null || b === null || a + b !== 100) return null;
  return [a, b];
}

function eligible(question: RnkCp007PermanentQuestion): boolean {
  return question.reviewMetadata.partitionId === "boys-girls" && percentages(question) !== null;
}

function partitionLabels(locale: RnkCp007PercentageAdapterLocale) {
  const partition = RNK_PARTITION_SCHEMES_V2.find((entry) => entry.id === "boys-girls");
  if (!partition) throw new Error("CP007 percentage adapter missing boys-girls partition");
  const key = locale === "en-IN" ? "en" : locale === "hi-IN" ? "hi" : "pa";
  return {
    whole: partition.wholeLabels[key],
    a: partition.categories[0][key],
    b: partition.categories[1][key],
  };
}

function side(locale: RnkCp007PercentageAdapterLocale, value: "AHEAD" | "AFTER"): string {
  if (locale === "en-IN") return value === "AHEAD" ? "ahead of" : "behind";
  if (locale === "hi-IN") return value === "AHEAD" ? "आगे" : "पीछे";
  return value === "AHEAD" ? "ਅੱਗੇ" : "ਪਿੱਛੇ";
}

function categoryTotal(question: RnkCp007PermanentQuestion, category: "A" | "B"): number {
  return category === "A" ? question.state.categoryATotal : question.state.categoryBTotal;
}

function targetAdjustment(question: RnkCp007PermanentQuestion, category: "A" | "B"): number {
  return question.state.targetCategory === category ? 1 : 0;
}

function targetName(
  canonical: RnkCp007PermanentQuestion,
  localized: AnyQuestion | null,
): string {
  return localized ? localized.reviewMetadata.targetName : canonical.reviewMetadata.targetName;
}

function renderStem(
  canonical: RnkCp007PermanentQuestion,
  localized: AnyQuestion | null,
  locale: RnkCp007PercentageAdapterLocale,
): string {
  const parts = percentages(canonical);
  if (!parts) throw new Error("CP007 percentage adapter received non-integral percentage state");
  const [percentA, percentB] = parts;
  const labels = partitionLabels(locale);
  const name = targetName(canonical, localized);
  const targetLabel = canonical.state.targetCategory === "A" ? labels.a : labels.b;
  const evidenceLabel = canonical.evidence.category === "A" ? labels.a : labels.b;
  const requestedLabel = canonical.reviewMetadata.requestedCategory === "A" ? labels.a : labels.b;
  const evidenceSide = side(locale, canonical.evidence.side);
  const requestedSide = side(locale, canonical.reviewMetadata.requestedSide);

  if (locale === "en-IN") {
    return [
      `A ranked class has ${canonical.state.total} ${labels.whole}.`,
      `${labels.a} make up ${percentA}% and ${labels.b} ${percentB}% of the class.`,
      `${name}, who is one of the ${targetLabel}, is ${canonical.state.targetRankFromTop}th from the top.`,
      `Exactly ${canonical.evidence.count} ${evidenceLabel} are ${evidenceSide} ${name}.`,
      `How many ${requestedLabel} are ${requestedSide} ${name}?`,
    ].join(" ");
  }

  if (locale === "hi-IN") {
    return [
      `एक रैंक की गई कक्षा में कुल ${canonical.state.total} ${labels.whole} हैं।`,
      `इनमें ${percentA}% ${labels.a} और ${percentB}% ${labels.b} हैं।`,
      `${name}, जो ${targetLabel} में से है, ऊपर से ${canonical.state.targetRankFromTop}वें स्थान पर है।`,
      `ठीक ${canonical.evidence.count} ${evidenceLabel} ${name} से ${evidenceSide} हैं।`,
      `${name} से ${requestedSide} कितने ${requestedLabel} हैं?`,
    ].join(" ");
  }

  return [
    `ਇੱਕ ਦਰਜਾਬੰਦੀ ਵਾਲੀ ਕਲਾਸ ਵਿੱਚ ਕੁੱਲ ${canonical.state.total} ${labels.whole} ਹਨ।`,
    `ਇਨ੍ਹਾਂ ਵਿੱਚ ${percentA}% ${labels.a} ਅਤੇ ${percentB}% ${labels.b} ਹਨ।`,
    `${name}, ਜੋ ${targetLabel} ਵਿੱਚੋਂ ਹੈ, ਉੱਪਰੋਂ ${canonical.state.targetRankFromTop}ਵੇਂ ਸਥਾਨ ਉੱਤੇ ਹੈ।`,
    `ਠੀਕ ${canonical.evidence.count} ${evidenceLabel} ${name} ਤੋਂ ${evidenceSide} ਹਨ।`,
    `${name} ਤੋਂ ${requestedSide} ਕਿੰਨੇ ${requestedLabel} ਹਨ?`,
  ].join(" ");
}

function renderExplanation(
  canonical: RnkCp007PermanentQuestion,
  locale: RnkCp007PercentageAdapterLocale,
): string {
  const parts = percentages(canonical);
  if (!parts) throw new Error("CP007 percentage adapter received non-integral percentage state");
  const [percentA, percentB] = parts;
  const labels = partitionLabels(locale);
  const evidenceLabel = canonical.evidence.category === "A" ? labels.a : labels.b;
  const requestedLabel = canonical.reviewMetadata.requestedCategory === "A" ? labels.a : labels.b;
  const totalAhead = canonical.state.targetRankFromTop - 1;
  const evidenceAdjustment = targetAdjustment(canonical, canonical.evidence.category);
  const evidenceAhead = canonical.evidence.side === "AHEAD"
    ? canonical.evidence.count
    : categoryTotal(canonical, canonical.evidence.category)
      - canonical.evidence.count
      - evidenceAdjustment;
  const requestedAhead = totalAhead - evidenceAhead;
  const requestedAdjustment = targetAdjustment(canonical, canonical.reviewMetadata.requestedCategory);
  const requestedTotal = categoryTotal(canonical, canonical.reviewMetadata.requestedCategory);

  if (locale === "en-IN") {
    const intro = `${percentA}% of ${canonical.state.total} = ${canonical.state.categoryATotal} ${labels.a}, and ${percentB}% = ${canonical.state.categoryBTotal} ${labels.b}. Rank ${canonical.state.targetRankFromTop} means ${totalAhead} people are ahead.`;
    const evidence = canonical.evidence.side === "AHEAD"
      ? `${canonical.evidence.count} ${evidenceLabel} are given ahead.`
      : `${evidenceLabel} ahead = ${categoryTotal(canonical, canonical.evidence.category)} - ${canonical.evidence.count}${evidenceAdjustment ? " - 1" : ""} = ${evidenceAhead}.`;
    if (canonical.reviewMetadata.requestedSide === "AHEAD") {
      return `${intro} ${evidence} Therefore ${requestedLabel} ahead = ${totalAhead} - ${evidenceAhead} = ${canonical.answer}.`;
    }
    return `${intro} ${evidence} So ${requestedLabel} ahead = ${requestedAhead}. Hence ${requestedLabel} behind = ${requestedTotal} - ${requestedAhead}${requestedAdjustment ? " - 1" : ""} = ${canonical.answer}.`;
  }

  if (locale === "hi-IN") {
    const intro = `${canonical.state.total} का ${percentA}% = ${canonical.state.categoryATotal} ${labels.a} और ${percentB}% = ${canonical.state.categoryBTotal} ${labels.b}। ऊपर से ${canonical.state.targetRankFromTop}वाँ स्थान होने से ${totalAhead} सदस्य आगे हैं।`;
    const evidence = canonical.evidence.side === "AHEAD"
      ? `${canonical.evidence.count} ${evidenceLabel} पहले से आगे दिए गए हैं।`
      : `${evidenceLabel} आगे = ${categoryTotal(canonical, canonical.evidence.category)} - ${canonical.evidence.count}${evidenceAdjustment ? " - 1" : ""} = ${evidenceAhead}।`;
    if (canonical.reviewMetadata.requestedSide === "AHEAD") {
      return `${intro} ${evidence} इसलिए आगे ${requestedLabel} = ${totalAhead} - ${evidenceAhead} = ${canonical.answer}।`;
    }
    return `${intro} ${evidence} इसलिए आगे ${requestedLabel} = ${requestedAhead}। अतः पीछे ${requestedLabel} = ${requestedTotal} - ${requestedAhead}${requestedAdjustment ? " - 1" : ""} = ${canonical.answer}।`;
  }

  const intro = `${canonical.state.total} ਦਾ ${percentA}% = ${canonical.state.categoryATotal} ${labels.a} ਅਤੇ ${percentB}% = ${canonical.state.categoryBTotal} ${labels.b}। ਉੱਪਰੋਂ ${canonical.state.targetRankFromTop}ਵਾਂ ਸਥਾਨ ਹੋਣ ਕਰਕੇ ${totalAhead} ਮੈਂਬਰ ਅੱਗੇ ਹਨ।`;
  const evidence = canonical.evidence.side === "AHEAD"
    ? `${canonical.evidence.count} ${evidenceLabel} ਪਹਿਲਾਂ ਹੀ ਅੱਗੇ ਦਿੱਤੇ ਹਨ।`
    : `${evidenceLabel} ਅੱਗੇ = ${categoryTotal(canonical, canonical.evidence.category)} - ${canonical.evidence.count}${evidenceAdjustment ? " - 1" : ""} = ${evidenceAhead}।`;
  if (canonical.reviewMetadata.requestedSide === "AHEAD") {
    return `${intro} ${evidence} ਇਸ ਲਈ ਅੱਗੇ ${requestedLabel} = ${totalAhead} - ${evidenceAhead} = ${canonical.answer}।`;
  }
  return `${intro} ${evidence} ਇਸ ਲਈ ਅੱਗੇ ${requestedLabel} = ${requestedAhead}। ਇਸ ਕਰਕੇ ਪਿੱਛੇ ${requestedLabel} = ${requestedTotal} - ${requestedAhead}${requestedAdjustment ? " - 1" : ""} = ${canonical.answer}।`;
}

function adapt(
  canonical: RnkCp007PermanentQuestion,
  localized: RnkCp007LocalizedReviewQuestionV4 | null,
  locale: RnkCp007PercentageAdapterLocale,
): AnyQuestion {
  if (!eligible(canonical)) throw new Error("CP007 percentage adapter called for ineligible question");
  const source = (localized ?? canonical) as AnyQuestion;
  const stem = renderStem(canonical, localized, locale);
  const explanation = renderExplanation(canonical, locale);
  const adapterFingerprint = sha256({
    version: RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_VERSION,
    permanentRuntimeFingerprint: canonical.permanentRuntimeFingerprint,
    locale,
    stem,
    explanation,
  });
  return {
    ...source,
    locale,
    stem,
    explanation,
    percentagePresentation: {
      version: RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_VERSION,
      authority: RNK_CP007_PERCENTAGE_PRESENTATION_AUTHORITY,
      targetQlId: "RNK-QL-042",
      percentageA: percentages(canonical)![0],
      percentageB: percentages(canonical)![1],
      normalizedCategoryATotal: canonical.state.categoryATotal,
      normalizedCategoryBTotal: canonical.state.categoryBTotal,
      sourcePermanentRuntimeFingerprint: canonical.permanentRuntimeFingerprint,
      canonicalMathematicalFingerprint: canonical.mathematicalFingerprint,
      adapterFingerprint,
      mathematicalAuthorityChanged: false,
      newQlAllocated: false,
      examProfileDeliveryOnly: true,
    },
  };
}

export function buildRnkCp007PercentagePresentationBank(
  locale: RnkCp007PercentageAdapterLocale,
): readonly AnyQuestion[] {
  const canonical = buildRnkCp007PermanentRuntime();
  const localized = locale === "en-IN" ? null : buildRnkCp007LocalizedReviewBankV4(locale);
  return canonical.flatMap((question, index) => {
    if (!eligible(question)) return [];
    return [adapt(question, localized ? localized[index]! : null, locale)];
  });
}
