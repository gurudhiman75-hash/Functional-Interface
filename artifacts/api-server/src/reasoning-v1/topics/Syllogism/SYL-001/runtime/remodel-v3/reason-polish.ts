import type { SylLocale } from "../../foundation/types";
import type { SylStructuredProofCoreV3 } from "./proof";
import type { SylStatementMeaningV3, SylVisibleOptionAnalysisV3 } from "./types";

function stripTerminal(value: string): string {
  return value.trim().replace(/[।.!?;:]+$/u, "");
}

function quoted(value: string): string {
  return `“${stripTerminal(value)}”`;
}

function cleanupLegacyReason(value: string): string {
  return value
    .replace(/\s*\.\s*;/g, ";")
    .replace(/\.{2,}/g, ".")
    .replace(/।{2,}/g, "।")
    .replace(/\s+([,.;:!?।])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function extractQuotedConclusion(value: string): string | null {
  return value.match(/“([^”]+)”/u)?.[1]?.trim() ?? null;
}

function joinNatural(values: readonly string[], locale: SylLocale): string {
  const clean = values.map(stripTerminal).filter(Boolean);
  if (clean.length <= 1) return clean[0] ?? "";
  if (clean.length === 2) {
    const connector = locale === "en-IN" ? " and " : locale === "hi-IN" ? " और " : " ਅਤੇ ";
    return `${clean[0]}${connector}${clean[1]}`;
  }
  const connector = locale === "en-IN" ? ", and " : locale === "hi-IN" ? ", और " : ", ਅਤੇ ";
  return `${clean.slice(0, -1).join(", ")}${connector}${clean.at(-1)}`;
}

function statementReference(index: number, locale: SylLocale): string {
  if (locale === "hi-IN") return `कथन ${index}`;
  if (locale === "pa-IN") return `ਕਥਨ ${index}`;
  return `Statement ${index}`;
}

function naturalRelationMeaning(relation: string, locale: SylLocale): string | null {
  const onlyAFew = relation.match(/^(.+?) ∩ (.+?) ≠ ∅; \1 \\ \2 ≠ ∅$/u);
  if (onlyAFew) {
    const [, subject, predicate] = onlyAFew;
    if (locale === "hi-IN") return `${subject} का कम-से-कम एक सदस्य ${predicate} में है और कम-से-कम एक सदस्य ${predicate} में नहीं है।`;
    if (locale === "pa-IN") return `${subject} ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ${predicate} ਵਿੱਚ ਹੈ ਅਤੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ${predicate} ਵਿੱਚ ਨਹੀਂ ਹੈ।`;
    return `At least one member of ${subject} belongs to ${predicate}, and at least one member of ${subject} does not belong to ${predicate}.`;
  }

  const subset = relation.match(/^(.+?) ⊆ (.+)$/u);
  if (subset) {
    const [, subject, predicate] = subset;
    if (locale === "hi-IN") return `${subject} का हर सदस्य ${predicate} में है।`;
    if (locale === "pa-IN") return `${subject} ਦਾ ਹਰ ਮੈਂਬਰ ${predicate} ਵਿੱਚ ਹੈ।`;
    return `Every member of ${subject} belongs to ${predicate}.`;
  }

  const disjoint = relation.match(/^(.+?) ∩ (.+?) = ∅$/u);
  if (disjoint) {
    const [, subject, predicate] = disjoint;
    if (locale === "hi-IN") return `${subject} और ${predicate} के बीच कोई साझा सदस्य नहीं है।`;
    if (locale === "pa-IN") return `${subject} ਅਤੇ ${predicate} ਵਿਚਕਾਰ ਕੋਈ ਸਾਂਝਾ ਮੈਂਬਰ ਨਹੀਂ ਹੈ।`;
    return `${subject} and ${predicate} have no common member.`;
  }

  const overlap = relation.match(/^(.+?) ∩ (.+?) ≠ ∅$/u);
  if (overlap) {
    const [, subject, predicate] = overlap;
    if (locale === "hi-IN") return `कम-से-कम एक सदस्य ${subject} और ${predicate} दोनों में है।`;
    if (locale === "pa-IN") return `ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ${subject} ਅਤੇ ${predicate} ਦੋਵਾਂ ਵਿੱਚ ਹੈ।`;
    return `At least one member belongs to both ${subject} and ${predicate}.`;
  }

  const outside = relation.match(/^(.+?) \\ (.+?) ≠ ∅$/u);
  if (outside) {
    const [, subject, predicate] = outside;
    if (locale === "hi-IN") return `${subject} का कम-से-कम एक सदस्य ${predicate} में नहीं है।`;
    if (locale === "pa-IN") return `${subject} ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ${predicate} ਵਿੱਚ ਨਹੀਂ ਹੈ।`;
    return `At least one member of ${subject} does not belong to ${predicate}.`;
  }

  const identity = relation.match(/^(.+?) = (.+)$/u);
  if (identity) {
    const [, subject, predicate] = identity;
    if (locale === "hi-IN") return `${subject} और ${predicate} एक ही वर्ग को दर्शाते हैं।`;
    if (locale === "pa-IN") return `${subject} ਅਤੇ ${predicate} ਇੱਕੋ ਵਰਗ ਨੂੰ ਦਰਸਾਉਂਦੇ ਹਨ।`;
    return `${subject} and ${predicate} name the same class.`;
  }
  return null;
}

function naturalizeStatementMeanings(
  meanings: readonly SylStatementMeaningV3[],
  locale: SylLocale,
): readonly SylStatementMeaningV3[] {
  return Object.freeze(meanings.map((meaning) => Object.freeze({
    ...meaning,
    normalizedMeaning: naturalRelationMeaning(meaning.normalizedRelation, locale) ?? meaning.normalizedMeaning,
  })));
}

function decisiveFacts(
  analysis: SylVisibleOptionAnalysisV3,
  core: SylStructuredProofCoreV3,
  locale: SylLocale,
): readonly string[] {
  return Object.freeze(analysis.premiseIdsUsed.map((premiseId) => {
    const meaning = core.statementMeanings.find((entry) => entry.premiseId === premiseId);
    if (!meaning) return premiseId;
    return `${statementReference(meaning.displayIndex, locale)}: ${stripTerminal(meaning.normalizedMeaning)}`;
  }));
}

function proofModelSentence(
  analysis: SylVisibleOptionAnalysisV3,
  locale: SylLocale,
): string {
  const hasTrue = analysis.proofEvidence.satisfyingModel !== null;
  const hasFalse = analysis.proofEvidence.counterModel !== null;
  if (locale === "hi-IN") {
    if (hasTrue && hasFalse) return "संरचित प्रमाण में एक सही मॉडल इसे सत्य और दूसरा सही मॉडल इसे असत्य बनाता है";
    if (hasTrue) return "संरचित प्रमाण में कम-से-कम एक सही मॉडल इस संबंध को दिखाता है";
    if (hasFalse) return "संरचित प्रमाण में एक सही प्रतिमॉडल इस दावे को असत्य बनाता है";
    return "कथनों ने इस संबंध को अनिवार्य नहीं किया है";
  }
  if (locale === "pa-IN") {
    if (hasTrue && hasFalse) return "ਬਣਤਰਬੱਧ ਪ੍ਰਮਾਣ ਵਿੱਚ ਇੱਕ ਠੀਕ ਮਾਡਲ ਇਸ ਨੂੰ ਸਹੀ ਅਤੇ ਦੂਜਾ ਠੀਕ ਮਾਡਲ ਇਸ ਨੂੰ ਗਲਤ ਬਣਾਉਂਦਾ ਹੈ";
    if (hasTrue) return "ਬਣਤਰਬੱਧ ਪ੍ਰਮਾਣ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਠੀਕ ਮਾਡਲ ਇਹ ਸੰਬੰਧ ਦਿਖਾਉਂਦਾ ਹੈ";
    if (hasFalse) return "ਬਣਤਰਬੱਧ ਪ੍ਰਮਾਣ ਵਿੱਚ ਇੱਕ ਠੀਕ ਵਿਰੋਧੀ ਮਾਡਲ ਇਸ ਦਾਅਵੇ ਨੂੰ ਗਲਤ ਬਣਾਉਂਦਾ ਹੈ";
    return "ਕਥਨਾਂ ਨੇ ਇਹ ਸੰਬੰਧ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕੀਤਾ";
  }
  if (hasTrue && hasFalse) return "the structured proof contains one valid model where it is true and another where it is false";
  if (hasTrue) return "the structured proof contains at least one valid model that realises this relation";
  if (hasFalse) return "the structured proof contains a valid countermodel that makes this claim false";
  return "the statements do not force this relation";
}

function polishedStatementReason(
  analysis: SylVisibleOptionAnalysisV3,
  core: SylStructuredProofCoreV3,
  locale: SylLocale,
): string {
  const facts = decisiveFacts(analysis, core, locale);
  const factText = joinNatural(facts, locale);
  const option = quoted(analysis.optionText);
  const modelSentence = proofModelSentence(analysis, locale);

  if (locale === "hi-IN") {
    if (analysis.logicalStatus === "ENTAILED") {
      return `${factText}। इन निर्णायक तथ्यों को जोड़ने पर ${option} हर सही व्यवस्था में सत्य रहता है।`;
    }
    if (analysis.logicalStatus === "IMPOSSIBLE") {
      return `${factText}। ${option} को ऐसा संबंध चाहिए जो इन सीमाओं से टकराता है; इसलिए यह विकल्प असंभव है।`;
    }
    return `${factText}। ये तथ्य ${option} को निश्चित नहीं करते; ${modelSentence}। इसलिए यह संभव है, पर निश्चित नहीं।`;
  }
  if (locale === "pa-IN") {
    if (analysis.logicalStatus === "ENTAILED") {
      return `${factText}। ਇਨ੍ਹਾਂ ਫੈਸਲਾ ਕਰਨ ਵਾਲੇ ਤੱਥਾਂ ਨੂੰ ਜੋੜਨ ਉੱਤੇ ${option} ਹਰ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਸਹੀ ਰਹਿੰਦਾ ਹੈ।`;
    }
    if (analysis.logicalStatus === "IMPOSSIBLE") {
      return `${factText}। ${option} ਲਈ ਅਜਿਹਾ ਸੰਬੰਧ ਚਾਹੀਦਾ ਹੈ ਜੋ ਇਨ੍ਹਾਂ ਹੱਦਾਂ ਨਾਲ ਟਕਰਾਉਂਦਾ ਹੈ; ਇਸ ਲਈ ਇਹ ਵਿਕਲਪ ਅਸੰਭਵ ਹੈ।`;
    }
    return `${factText}। ਇਹ ਤੱਥ ${option} ਨੂੰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਕਰਦੇ; ${modelSentence}। ਇਸ ਲਈ ਇਹ ਸੰਭਵ ਹੈ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ।`;
  }
  if (analysis.logicalStatus === "ENTAILED") {
    return `${factText}. Together, these decisive facts make ${option} true in every valid arrangement.`;
  }
  if (analysis.logicalStatus === "IMPOSSIBLE") {
    return `${factText}. ${option} requires a relation that conflicts with these boundaries, so the option is impossible.`;
  }
  return `${factText}. These facts do not determine ${option}; ${modelSentence}. Therefore, it is possible but not definite.`;
}

function isStatementConclusionOption(analysis: SylVisibleOptionAnalysisV3): boolean {
  return /^(?:ALL|NO|SOME|SOME_NOT):/.test(analysis.semanticValue);
}

function hasConclusionEvidence(analysis: SylVisibleOptionAnalysisV3): boolean {
  return /^(?:ALL|NO|SOME|SOME_NOT)\(/.test(analysis.proofEvidence.requiredRelation);
}

function conclusionSurfaceForReason(analysis: SylVisibleOptionAnalysisV3): string | null {
  if (isStatementConclusionOption(analysis)) return analysis.optionText;
  if (analysis.taskDisposition !== "CORRECT_FOR_TASK" || !hasConclusionEvidence(analysis)) return null;
  return extractQuotedConclusion(analysis.studentReason);
}

function finalSentence(index: number, text: string, locale: SylLocale): string {
  if (locale === "hi-IN") return `अतः विकल्प ${index} — ${stripTerminal(text)} सही है।`;
  if (locale === "pa-IN") return `ਇਸ ਲਈ ਵਿਕਲਪ ${index} — ${stripTerminal(text)} ਸਹੀ ਹੈ।`;
  return `Therefore, Option ${index} — ${stripTerminal(text)} is correct.`;
}

export function polishStructuredProofCoreV3(
  core: SylStructuredProofCoreV3,
  locale: SylLocale,
): SylStructuredProofCoreV3 {
  const statementMeanings = naturalizeStatementMeanings(core.statementMeanings, locale);
  const naturalCore: SylStructuredProofCoreV3 = Object.freeze({ ...core, statementMeanings });
  const optionAnalysis = Object.freeze(naturalCore.optionAnalysis.map((analysis) => {
    const conclusionSurface = conclusionSurfaceForReason(analysis);
    const proofAnalysis: SylVisibleOptionAnalysisV3 = conclusionSurface === null
      ? analysis
      : Object.freeze({ ...analysis, optionText: conclusionSurface });
    return Object.freeze({
      ...analysis,
      studentReason: conclusionSurface === null
        ? cleanupLegacyReason(analysis.studentReason)
        : polishedStatementReason(proofAnalysis, naturalCore, locale),
    });
  }));
  const correct = optionAnalysis.find((analysis) => analysis.taskDisposition === "CORRECT_FOR_TASK");
  if (!correct) throw new Error("V3 proof polish cannot find the correct visible option.");
  const decisiveMeanings = correct.premiseIdsUsed
    .map((premiseId) => statementMeanings.find((entry) => entry.premiseId === premiseId))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const reasoningSteps = Object.freeze([
    ...decisiveMeanings.map((meaning) => `${statementReference(meaning.displayIndex, locale)}: ${stripTerminal(meaning.normalizedMeaning)}.`),
    correct.studentReason,
  ]);
  const correctOptionProof = Object.freeze({
    ...naturalCore.correctOptionProof,
    reasoningSteps,
    studentProof: `${reasoningSteps.join(" ")} ${finalSentence(correct.displayIndex, correct.optionText, locale)}`,
  });
  const combinedRelation = `${joinNatural(decisiveMeanings.map((meaning) => meaning.normalizedMeaning), locale)}. ${correct.studentReason}`;
  return Object.freeze({
    ...naturalCore,
    optionAnalysis,
    correctOptionProof,
    combinedRelation,
  });
}
