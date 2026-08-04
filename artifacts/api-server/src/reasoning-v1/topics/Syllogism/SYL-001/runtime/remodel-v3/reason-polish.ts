import type { SylLocale } from "../../foundation/types";
import type { SylStructuredProofCoreV3 } from "./proof";
import type { SylVisibleOptionAnalysisV3 } from "./types";

function stripTerminal(value: string): string {
  return value.trim().replace(/[।.!?;:]+$/u, "");
}

function quoted(value: string): string {
  return `“${stripTerminal(value)}”`;
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

function finalSentence(index: number, text: string, locale: SylLocale): string {
  if (locale === "hi-IN") return `अतः विकल्प ${index} — ${stripTerminal(text)} सही है।`;
  if (locale === "pa-IN") return `ਇਸ ਲਈ ਵਿਕਲਪ ${index} — ${stripTerminal(text)} ਸਹੀ ਹੈ।`;
  return `Therefore, Option ${index} — ${stripTerminal(text)} is correct.`;
}

export function polishStructuredProofCoreV3(
  core: SylStructuredProofCoreV3,
  locale: SylLocale,
): SylStructuredProofCoreV3 {
  const optionAnalysis = Object.freeze(core.optionAnalysis.map((analysis) => Object.freeze({
    ...analysis,
    studentReason: isStatementConclusionOption(analysis)
      ? polishedStatementReason(analysis, core, locale)
      : analysis.studentReason.replace(/\s+/g, " ").trim(),
  })));
  const correct = optionAnalysis.find((analysis) => analysis.taskDisposition === "CORRECT_FOR_TASK");
  if (!correct) throw new Error("V3 proof polish cannot find the correct visible option.");
  const decisiveMeanings = correct.premiseIdsUsed
    .map((premiseId) => core.statementMeanings.find((entry) => entry.premiseId === premiseId))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const reasoningSteps = Object.freeze([
    ...decisiveMeanings.map((meaning) => `${statementReference(meaning.displayIndex, locale)}: ${stripTerminal(meaning.normalizedMeaning)}.`),
    correct.studentReason,
  ]);
  const correctOptionProof = Object.freeze({
    ...core.correctOptionProof,
    reasoningSteps,
    studentProof: `${reasoningSteps.join(" ")} ${finalSentence(correct.displayIndex, correct.optionText, locale)}`,
  });
  const combinedRelation = `${joinNatural(decisiveMeanings.map((meaning) => meaning.normalizedMeaning), locale)}. ${correct.studentReason}`;
  return Object.freeze({
    ...core,
    optionAnalysis,
    correctOptionProof,
    combinedRelation,
  });
}
