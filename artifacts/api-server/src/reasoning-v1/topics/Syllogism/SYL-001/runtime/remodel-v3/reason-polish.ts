import type { SylLocale } from "../../foundation/types";
import type { SylTaskKind } from "../types";
import type { SylStructuredProofCoreV3 } from "./proof";
import type { SylStatementMeaningV3, SylVisibleOptionAnalysisV3 } from "./types";

function stripTerminal(value: string): string {
  return value.trim().replace(/[।.!?;:]+$/u, "");
}

function quoted(value: string): string {
  return `“${stripTerminal(value)}”`;
}

function sentence(value: string, locale: SylLocale): string {
  const clean = stripTerminal(value);
  return `${clean}${locale === "en-IN" ? "." : "।"}`;
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
    if (locale === "hi-IN") return `“${subject}” वर्ग का कम-से-कम एक सदस्य “${predicate}” वर्ग में है और कम-से-कम एक सदस्य उस वर्ग में नहीं है।`;
    if (locale === "pa-IN") return `“${subject}” ਵਰਗ ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ “${predicate}” ਵਰਗ ਵਿੱਚ ਹੈ ਅਤੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਉਸ ਵਰਗ ਵਿੱਚ ਨਹੀਂ ਹੈ।`;
    return `At least one member of the “${subject}” class belongs to the “${predicate}” class, and at least one member does not.`;
  }

  const subset = relation.match(/^(.+?) ⊆ (.+)$/u);
  if (subset) {
    const [, subject, predicate] = subset;
    if (locale === "hi-IN") return `“${subject}” वर्ग का हर सदस्य “${predicate}” वर्ग में भी है।`;
    if (locale === "pa-IN") return `“${subject}” ਵਰਗ ਦਾ ਹਰ ਮੈਂਬਰ “${predicate}” ਵਰਗ ਵਿੱਚ ਵੀ ਹੈ।`;
    return `Every member of the “${subject}” class also belongs to the “${predicate}” class.`;
  }

  const disjoint = relation.match(/^(.+?) ∩ (.+?) = ∅$/u);
  if (disjoint) {
    const [, subject, predicate] = disjoint;
    if (locale === "hi-IN") return `“${subject}” और “${predicate}” वर्गों में कोई साझा सदस्य नहीं है।`;
    if (locale === "pa-IN") return `“${subject}” ਅਤੇ “${predicate}” ਵਰਗਾਂ ਵਿੱਚ ਕੋਈ ਸਾਂਝਾ ਮੈਂਬਰ ਨਹੀਂ ਹੈ।`;
    return `The “${subject}” and “${predicate}” classes have no common member.`;
  }

  const overlap = relation.match(/^(.+?) ∩ (.+?) ≠ ∅$/u);
  if (overlap) {
    const [, subject, predicate] = overlap;
    if (locale === "hi-IN") return `कम-से-कम एक सदस्य “${subject}” और “${predicate}” दोनों वर्गों में है।`;
    if (locale === "pa-IN") return `ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ “${subject}” ਅਤੇ “${predicate}” ਦੋਵਾਂ ਵਰਗਾਂ ਵਿੱਚ ਹੈ।`;
    return `At least one member belongs to both the “${subject}” and “${predicate}” classes.`;
  }

  const outside = relation.match(/^(.+?) \\ (.+?) ≠ ∅$/u);
  if (outside) {
    const [, subject, predicate] = outside;
    if (locale === "hi-IN") return `“${subject}” वर्ग का कम-से-कम एक सदस्य “${predicate}” वर्ग में नहीं है।`;
    if (locale === "pa-IN") return `“${subject}” ਵਰਗ ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ “${predicate}” ਵਰਗ ਵਿੱਚ ਨਹੀਂ ਹੈ।`;
    return `At least one member of the “${subject}” class does not belong to the “${predicate}” class.`;
  }

  const identity = relation.match(/^(.+?) = (.+)$/u);
  if (identity) {
    const [, subject, predicate] = identity;
    if (locale === "hi-IN") return `“${subject}” और “${predicate}” एक ही वर्ग को दर्शाते हैं।`;
    if (locale === "pa-IN") return `“${subject}” ਅਤੇ “${predicate}” ਇੱਕੋ ਵਰਗ ਨੂੰ ਦਰਸਾਉਂਦੇ ਹਨ।`;
    return `“${subject}” and “${predicate}” name the same class.`;
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
    if (hasTrue && hasFalse) return "एक सही मॉडल में यह सत्य और दूसरे सही मॉडल में असत्य है";
    if (hasTrue) return "कम-से-कम एक सही मॉडल इस संबंध को दिखाता है";
    if (hasFalse) return "एक सही प्रतिमॉडल इस दावे को असत्य बनाता है";
    return "कथन इस संबंध को अनिवार्य नहीं करते";
  }
  if (locale === "pa-IN") {
    if (hasTrue && hasFalse) return "ਇੱਕ ਠੀਕ ਮਾਡਲ ਵਿੱਚ ਇਹ ਸਹੀ ਅਤੇ ਦੂਜੇ ਠੀਕ ਮਾਡਲ ਵਿੱਚ ਗਲਤ ਹੈ";
    if (hasTrue) return "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਠੀਕ ਮਾਡਲ ਇਹ ਸੰਬੰਧ ਦਿਖਾਉਂਦਾ ਹੈ";
    if (hasFalse) return "ਇੱਕ ਠੀਕ ਵਿਰੋਧੀ ਮਾਡਲ ਇਸ ਦਾਅਵੇ ਨੂੰ ਗਲਤ ਬਣਾਉਂਦਾ ਹੈ";
    return "ਕਥਨ ਇਹ ਸੰਬੰਧ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਰਦੇ";
  }
  if (hasTrue && hasFalse) return "one valid model makes it true and another valid model makes it false";
  if (hasTrue) return "at least one valid model realises this relation";
  if (hasFalse) return "a valid countermodel makes this claim false";
  return "the statements do not force this relation";
}

function polishedStatementReason(
  analysis: SylVisibleOptionAnalysisV3,
  core: SylStructuredProofCoreV3,
  locale: SylLocale,
): string {
  const factText = joinNatural(decisiveFacts(analysis, core, locale), locale);
  const option = quoted(analysis.optionText);
  const modelSentence = proofModelSentence(analysis, locale);

  if (locale === "hi-IN") {
    if (analysis.logicalStatus === "ENTAILED") return `${factText}। इसलिए ${option} हर सही व्यवस्था में सत्य रहता है।`;
    if (analysis.logicalStatus === "IMPOSSIBLE") return `${factText}। ${option} को ऐसा संबंध चाहिए जो इन सीमाओं से टकराता है; इसलिए यह असंभव है।`;
    return `${factText}। ये तथ्य ${option} को निश्चित नहीं करते; ${modelSentence}। इसलिए यह संभव है, पर निश्चित नहीं।`;
  }
  if (locale === "pa-IN") {
    if (analysis.logicalStatus === "ENTAILED") return `${factText}। ਇਸ ਲਈ ${option} ਹਰ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਸਹੀ ਰਹਿੰਦਾ ਹੈ।`;
    if (analysis.logicalStatus === "IMPOSSIBLE") return `${factText}। ${option} ਲਈ ਅਜਿਹਾ ਸੰਬੰਧ ਚਾਹੀਦਾ ਹੈ ਜੋ ਇਨ੍ਹਾਂ ਹੱਦਾਂ ਨਾਲ ਟਕਰਾਉਂਦਾ ਹੈ; ਇਸ ਲਈ ਇਹ ਅਸੰਭਵ ਹੈ।`;
    return `${factText}। ਇਹ ਤੱਥ ${option} ਨੂੰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਕਰਦੇ; ${modelSentence}। ਇਸ ਲਈ ਇਹ ਸੰਭਵ ਹੈ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ।`;
  }
  if (analysis.logicalStatus === "ENTAILED") return `${factText}. Therefore, ${option} is true in every valid arrangement.`;
  if (analysis.logicalStatus === "IMPOSSIBLE") return `${factText}. ${option} requires a relation that conflicts with these boundaries, so it is impossible.`;
  return `${factText}. These facts do not determine ${option}; ${modelSentence}. Therefore, it is possible but not definite.`;
}

function isStatementConclusionOption(analysis: SylVisibleOptionAnalysisV3): boolean {
  return /^(?:ALL|NO|SOME|SOME_NOT):/.test(analysis.semanticValue);
}

function hasConclusionEvidence(analysis: SylVisibleOptionAnalysisV3): boolean {
  return /^(?:ALL|NO|SOME|SOME_NOT)\(/.test(analysis.proofEvidence.requiredRelation);
}

function isModalTask(taskKind: SylTaskKind): boolean {
  return taskKind.includes("MODAL") || taskKind.includes("CLASSIFY_CONCLUSION_MODALITY");
}

function isCombinationTask(taskKind: SylTaskKind): boolean {
  return taskKind.includes("MASK") || taskKind.includes("EITHER_OR") || taskKind.includes("PAIR");
}

function conclusionSurfaceForReason(analysis: SylVisibleOptionAnalysisV3): string | null {
  if (isStatementConclusionOption(analysis)) return analysis.optionText;
  if (analysis.taskDisposition !== "CORRECT_FOR_TASK" || !hasConclusionEvidence(analysis)) return null;
  return extractQuotedConclusion(analysis.studentReason);
}

function conclusionStatusSummary(value: string, locale: SylLocale): string {
  const clean = cleanupLegacyReason(value);
  const markers = locale === "en-IN"
    ? [/\.\s*Therefore the correct status/iu]
    : locale === "hi-IN"
      ? [/।\s*इसलिए सही स्थिति/iu]
      : [/।\s*ਇਸ ਲਈ ਸਹੀ ਸਥਿਤੀ/iu];
  for (const marker of markers) {
    const [summary] = clean.split(marker);
    if (summary && summary !== clean) return stripTerminal(summary);
  }
  return stripTerminal(clean.replace(/\b(?:MASK_\d+|ONLY_(?:FIRST|SECOND)_FOLLOWS|BOTH_FOLLOW|NEITHER_FOLLOWS|EITHER_OR_FOLLOWS|EITHER_OR|NO_COMPLEMENTARY_RELATION|DEFINITELY_TRUE|POSSIBLY_TRUE_NOT_DEFINITE|PREMISES_INCONSISTENT|IMPOSSIBLE)\b/gu, ""));
}

function modalVerdict(correct: boolean, locale: SylLocale): string {
  if (locale === "hi-IN") return correct ? "सही — स्थिति प्रमाण से मेल खाती है" : "गलत — स्थिति प्रमाण से मेल नहीं खाती";
  if (locale === "pa-IN") return correct ? "ਸਹੀ — ਸਥਿਤੀ ਪ੍ਰਮਾਣ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਹੈ" : "ਗਲਤ — ਸਥਿਤੀ ਪ੍ਰਮਾਣ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦੀ";
  return correct ? "Correct — classification matches the proof" : "Wrong — classification does not match the proof";
}

function combinationVerdict(correct: boolean, locale: SylLocale): string {
  if (locale === "hi-IN") return correct ? "सही — संयोजन निष्कर्षों से मेल खाता है" : "गलत — संयोजन निष्कर्षों से मेल नहीं खाता";
  if (locale === "pa-IN") return correct ? "ਸਹੀ — ਜੋੜ ਨਤੀਜਿਆਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ" : "ਗਲਤ — ਜੋੜ ਨਤੀਜਿਆਂ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ";
  return correct ? "Correct — combination matches the conclusion results" : "Wrong — combination does not match the conclusion results";
}

function statementVerdict(
  analysis: SylVisibleOptionAnalysisV3,
  taskKind: SylTaskKind,
  locale: SylLocale,
): string {
  if (analysis.taskDisposition === "CORRECT_FOR_TASK") return analysis.studentVerdict;
  if (analysis.taskDisposition !== "TRUE_BUT_NOT_REQUESTED") return analysis.studentVerdict;
  if (locale === "hi-IN") {
    if (taskKind.includes("NON_FOLLOWING")) return "इस प्रश्न के लिए गलत — यह निश्चित रूप से अनुसरण करता है";
    if (taskKind.includes("POSSIBILITY")) return "इस प्रश्न के लिए गलत — यह निश्चित है, केवल संभव नहीं";
    return "अपेक्षित उत्तर नहीं — यह निश्चित रूप से सत्य है";
  }
  if (locale === "pa-IN") {
    if (taskKind.includes("NON_FOLLOWING")) return "ਇਸ ਪ੍ਰਸ਼ਨ ਲਈ ਗਲਤ — ਇਹ ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਨਿਕਲਦਾ ਹੈ";
    if (taskKind.includes("POSSIBILITY")) return "ਇਸ ਪ੍ਰਸ਼ਨ ਲਈ ਗਲਤ — ਇਹ ਨਿਸ਼ਚਿਤ ਹੈ, ਸਿਰਫ਼ ਸੰਭਵ ਨਹੀਂ";
    return "ਮੰਗਿਆ ਜਵਾਬ ਨਹੀਂ — ਇਹ ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ ਹੈ";
  }
  if (taskKind.includes("NON_FOLLOWING")) return "Wrong for this task — it definitely follows";
  if (taskKind.includes("POSSIBILITY")) return "Wrong for this task — definite, not merely possible";
  return "Not the requested response — definitely true";
}

function modalWrongReason(
  analysis: SylVisibleOptionAnalysisV3,
  correct: SylVisibleOptionAnalysisV3,
  conclusionSurface: string,
  core: SylStructuredProofCoreV3,
  locale: SylLocale,
): string {
  const proofAnalysis = Object.freeze({ ...correct, optionText: conclusionSurface });
  const proof = polishedStatementReason(proofAnalysis, core, locale);
  if (locale === "hi-IN") return `${proof} इसलिए ${quoted(analysis.optionText)} गलत स्थिति है; सही स्थिति ${quoted(correct.optionText)} है।`;
  if (locale === "pa-IN") return `${proof} ਇਸ ਲਈ ${quoted(analysis.optionText)} ਗਲਤ ਸਥਿਤੀ ਹੈ; ਸਹੀ ਸਥਿਤੀ ${quoted(correct.optionText)} ਹੈ।`;
  return `${proof} Therefore, ${quoted(analysis.optionText)} is the wrong classification; the correct classification is ${quoted(correct.optionText)}.`;
}

function combinationReason(
  analysis: SylVisibleOptionAnalysisV3,
  correct: SylVisibleOptionAnalysisV3,
  locale: SylLocale,
): string {
  const summary = conclusionStatusSummary(correct.studentReason, locale);
  const complementary = correct.proofEvidence.proofType === "EITHER_OR_COMPLEMENT_PROOF"
    || correct.proofEvidence.proofType === "PAIR_CLASSIFICATION_PROOF";
  if (locale === "hi-IN") {
    const pairProof = complementary ? " दोनों निष्कर्ष पूरक जोड़ी बनाते हैं: वे एक साथ सत्य भी नहीं हो सकते और एक साथ असत्य भी नहीं हो सकते।" : "";
    return `${sentence(summary, locale)}${pairProof} इसलिए ${quoted(analysis.optionText)} ${analysis.taskDisposition === "CORRECT_FOR_TASK" ? "सही संयोजन है" : "वास्तविक निष्कर्ष-स्थितियों से मेल नहीं खाता"}।`;
  }
  if (locale === "pa-IN") {
    const pairProof = complementary ? " ਦੋਵੇਂ ਨਤੀਜੇ ਪੂਰਕ ਜੋੜਾ ਬਣਾਉਂਦੇ ਹਨ: ਉਹ ਇਕੱਠੇ ਸਹੀ ਵੀ ਨਹੀਂ ਹੋ ਸਕਦੇ ਅਤੇ ਇਕੱਠੇ ਗਲਤ ਵੀ ਨਹੀਂ ਹੋ ਸਕਦੇ।" : "";
    return `${sentence(summary, locale)}${pairProof} ਇਸ ਲਈ ${quoted(analysis.optionText)} ${analysis.taskDisposition === "CORRECT_FOR_TASK" ? "ਸਹੀ ਜੋੜ ਹੈ" : "ਅਸਲ ਨਤੀਜਾ-ਸਥਿਤੀਆਂ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ"}।`;
  }
  const pairProof = complementary ? " The two conclusions form a complementary pair: they cannot both be true and cannot both be false." : "";
  return `${sentence(summary, locale)}${pairProof} Therefore, ${quoted(analysis.optionText)} ${analysis.taskDisposition === "CORRECT_FOR_TASK" ? "is the correct combination" : "does not match the actual conclusion results"}.`;
}

function compactConclusionStep(
  correct: SylVisibleOptionAnalysisV3,
  conclusionSurface: string,
  taskKind: SylTaskKind,
  locale: SylLocale,
): string {
  if (isCombinationTask(taskKind)) return combinationReason(correct, correct, locale);
  const option = quoted(conclusionSurface);
  if (locale === "hi-IN") {
    if (correct.logicalStatus === "ENTAILED") return `इसलिए ${option} निश्चित रूप से अनुसरण करता है।`;
    if (correct.logicalStatus === "IMPOSSIBLE") return `इसलिए ${option} असंभव है।`;
    return `इसलिए ${option} संभव है, पर निश्चित नहीं।`;
  }
  if (locale === "pa-IN") {
    if (correct.logicalStatus === "ENTAILED") return `ਇਸ ਲਈ ${option} ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਨਿਕਲਦਾ ਹੈ।`;
    if (correct.logicalStatus === "IMPOSSIBLE") return `ਇਸ ਲਈ ${option} ਅਸੰਭਵ ਹੈ।`;
    return `ਇਸ ਲਈ ${option} ਸੰਭਵ ਹੈ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ।`;
  }
  if (correct.logicalStatus === "ENTAILED") return `Therefore, ${option} definitely follows.`;
  if (correct.logicalStatus === "IMPOSSIBLE") return `Therefore, ${option} is impossible.`;
  return `Therefore, ${option} is possible but not definite.`;
}

function finalSentence(index: number, text: string, locale: SylLocale): string {
  if (locale === "hi-IN") return `अतः विकल्प ${index} — ${stripTerminal(text)} सही है।`;
  if (locale === "pa-IN") return `ਇਸ ਲਈ ਵਿਕਲਪ ${index} — ${stripTerminal(text)} ਸਹੀ ਹੈ।`;
  return `Therefore, Option ${index} — ${stripTerminal(text)} is correct.`;
}

export function polishStructuredProofCoreV3(
  core: SylStructuredProofCoreV3,
  locale: SylLocale,
  taskKind: SylTaskKind,
): SylStructuredProofCoreV3 {
  const statementMeanings = naturalizeStatementMeanings(core.statementMeanings, locale);
  const naturalCore: SylStructuredProofCoreV3 = Object.freeze({ ...core, statementMeanings });
  const originalCorrect = naturalCore.optionAnalysis.find((analysis) => analysis.taskDisposition === "CORRECT_FOR_TASK");
  if (!originalCorrect) throw new Error("V3 proof polish cannot find the correct visible option.");
  const conclusionSurface = conclusionSurfaceForReason(originalCorrect) ?? originalCorrect.optionText;
  const correctProofAnalysis: SylVisibleOptionAnalysisV3 = Object.freeze({ ...originalCorrect, optionText: conclusionSurface });

  const optionAnalysis = Object.freeze(naturalCore.optionAnalysis.map((analysis) => {
    if (isModalTask(taskKind)) {
      const isCorrect = analysis.taskDisposition === "CORRECT_FOR_TASK";
      return Object.freeze({
        ...analysis,
        studentVerdict: modalVerdict(isCorrect, locale),
        studentReason: isCorrect
          ? polishedStatementReason(correctProofAnalysis, naturalCore, locale)
          : modalWrongReason(analysis, correctProofAnalysis, conclusionSurface, naturalCore, locale),
      });
    }
    if (isCombinationTask(taskKind)) {
      const isCorrect = analysis.taskDisposition === "CORRECT_FOR_TASK";
      return Object.freeze({
        ...analysis,
        studentVerdict: combinationVerdict(isCorrect, locale),
        studentReason: combinationReason(analysis, originalCorrect, locale),
      });
    }
    const visibleSurface = conclusionSurfaceForReason(analysis);
    const proofAnalysis: SylVisibleOptionAnalysisV3 = visibleSurface === null
      ? analysis
      : Object.freeze({ ...analysis, optionText: visibleSurface });
    return Object.freeze({
      ...analysis,
      studentVerdict: statementVerdict(analysis, taskKind, locale),
      studentReason: visibleSurface === null
        ? cleanupLegacyReason(analysis.studentReason)
        : polishedStatementReason(proofAnalysis, naturalCore, locale),
    });
  }));

  const correct = optionAnalysis.find((analysis) => analysis.taskDisposition === "CORRECT_FOR_TASK")!;
  const decisiveMeanings = correct.premiseIdsUsed
    .map((premiseId) => statementMeanings.find((entry) => entry.premiseId === premiseId))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const conclusionStep = compactConclusionStep(correct, conclusionSurface, taskKind, locale);
  const reasoningSteps = Object.freeze([
    ...decisiveMeanings.map((meaning) => sentence(`${statementReference(meaning.displayIndex, locale)}: ${meaning.normalizedMeaning}`, locale)),
    conclusionStep,
  ]);
  const correctOptionProof = Object.freeze({
    ...naturalCore.correctOptionProof,
    reasoningSteps,
    studentProof: [...reasoningSteps, finalSentence(correct.displayIndex, correct.optionText, locale)].join(" "),
  });
  const combinedRelation = [
    sentence(joinNatural(decisiveMeanings.map((meaning) => meaning.normalizedMeaning), locale), locale),
    conclusionStep,
  ].join(" ");
  return Object.freeze({
    ...naturalCore,
    optionAnalysis,
    correctOptionProof,
    combinedRelation,
  });
}
