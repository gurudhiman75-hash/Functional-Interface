import type {
  CanonicalModel,
  InternalConclusionClass,
  SylLocale,
  TermId,
} from "../foundation/types";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import {
  SYL_LEARNER_V5_AUTHORITY,
  type SylLearnerConclusionResultV5,
  type SylLearnerExplanationModeV5,
  type SylLearnerModelEvidenceV5,
  type SylLearnerOptionAnalysisV5,
  type SylLearnerPresentationV5,
} from "./learner-v5-types";
import type {
  SylSemanticStatusV3,
  SylTaskStatusV3,
} from "./structured-proof-v3-types";

interface LearnerCopyV5 {
  preTestDirection: string;
  conclusion: string;
  definitelyFollows: string;
  impossible: string;
  possibleNotDefinite: string;
  premisesInconsistent: string;
  notApplicable: string;
  forcedByStatements: (conclusion: string, statements: string) => string;
  ruledOutByStatements: (conclusion: string, statements: string) => string;
  leftOpenByStatements: (conclusion: string) => string;
  finalAnswer: (answer: string) => string;
  exactlyOne: string;
  modelTrue: (description: string, conclusion: string) => string;
  modelFalse: (description: string, conclusion: string) => string;
  possibilityModel: (description: string, conclusion: string) => string;
  counterexample: (description: string, conclusion: string) => string;
  memberInsideOutside: (inside: string, outside: string | null) => string;
  taskMismatch: string;
  definiteNotRequested: string;
  possibleNotRequested: string;
  impossibleNotRequested: string;
}

const COPY: Readonly<Record<SylLocale, LearnerCopyV5>> = {
  "en-IN": {
    preTestDirection: "For this chapter, every class named in the statements is treated as non-empty.",
    conclusion: "Conclusion",
    definitelyFollows: "Definitely follows",
    impossible: "Impossible",
    possibleNotDefinite: "Possible, but not definite",
    premisesInconsistent: "Statements are inconsistent",
    notApplicable: "Not applicable",
    forcedByStatements: (conclusion, statements) => `${statements} Together, these statements force “${conclusion}”.`,
    ruledOutByStatements: (conclusion, statements) => `${statements} Together, these statements rule out “${conclusion}”.`,
    leftOpenByStatements: (conclusion) => `The statements neither force nor rule out “${conclusion}”.`,
    finalAnswer: (answer) => `Therefore, ${answer}.`,
    exactlyOne: "The two conclusions are complementary: they cannot both be true and cannot both be false. Therefore, exactly one follows.",
    modelTrue: (description, conclusion) => `Model 1 — conclusion true: ${description} This makes “${conclusion}” true while preserving every statement.`,
    modelFalse: (description, conclusion) => `Model 2 — conclusion false: ${description} This makes “${conclusion}” false while preserving every statement.`,
    possibilityModel: (description, conclusion) => `One valid model: ${description} This makes “${conclusion}” true, so it is possible.`,
    counterexample: (description, conclusion) => `Counterexample: ${description} Every statement remains true, but “${conclusion}” is false.`,
    memberInsideOutside: (inside, outside) => outside
      ? `one member lies in ${inside} and outside ${outside}.`
      : `one member lies in ${inside}.`,
    taskMismatch: "Its logical status does not match what the question asks for.",
    definiteNotRequested: "It definitely follows, so it is not the requested uncertain or non-following conclusion.",
    possibleNotRequested: "It is possible but not definite, so it does not satisfy a task asking for certainty or impossibility.",
    impossibleNotRequested: "It is impossible, so it does not satisfy a task asking for a definite or possible conclusion.",
  },
  "hi-IN": {
    preTestDirection: "इस अध्याय में कथनों में दिए गए प्रत्येक वर्ग को गैर-रिक्त माना जाएगा।",
    conclusion: "निष्कर्ष",
    definitelyFollows: "निश्चित रूप से निकलता है",
    impossible: "असंभव",
    possibleNotDefinite: "संभव, लेकिन निश्चित नहीं",
    premisesInconsistent: "कथन असंगत हैं",
    notApplicable: "लागू नहीं",
    forcedByStatements: (conclusion, statements) => `${statements} ये कथन मिलकर “${conclusion}” को निश्चित करते हैं।`,
    ruledOutByStatements: (conclusion, statements) => `${statements} ये कथन मिलकर “${conclusion}” को असंभव बनाते हैं।`,
    leftOpenByStatements: (conclusion) => `कथन “${conclusion}” को न तो निश्चित करते हैं और न ही असंभव बनाते हैं।`,
    finalAnswer: (answer) => `अतः, ${answer}।`,
    exactlyOne: "दोनों निष्कर्ष पूरक हैं: दोनों एक साथ सत्य नहीं हो सकते और दोनों एक साथ असत्य भी नहीं हो सकते। इसलिए ठीक एक निष्कर्ष निकलता है।",
    modelTrue: (description, conclusion) => `मॉडल 1 — निष्कर्ष सत्य: ${description} इससे सभी कथन सही रहते हैं और “${conclusion}” सत्य होता है।`,
    modelFalse: (description, conclusion) => `मॉडल 2 — निष्कर्ष असत्य: ${description} इससे सभी कथन सही रहते हैं और “${conclusion}” असत्य होता है।`,
    possibilityModel: (description, conclusion) => `एक वैध मॉडल: ${description} इसमें “${conclusion}” सत्य है, इसलिए यह संभव है।`,
    counterexample: (description, conclusion) => `प्रति-उदाहरण: ${description} सभी कथन सही रहते हैं, लेकिन “${conclusion}” असत्य है।`,
    memberInsideOutside: (inside, outside) => outside
      ? `एक सदस्य ${inside} में है और ${outside} में नहीं है।`
      : `एक सदस्य ${inside} में है।`,
    taskMismatch: "इसकी तार्किक स्थिति प्रश्न की मांग से मेल नहीं खाती।",
    definiteNotRequested: "यह निश्चित रूप से निकलता है, इसलिए यह मांगा गया अनिश्चित या न निकलने वाला निष्कर्ष नहीं है।",
    possibleNotRequested: "यह संभव है लेकिन निश्चित नहीं, इसलिए निश्चितता या असंभवता पूछने वाले कार्य के लिए सही नहीं है।",
    impossibleNotRequested: "यह असंभव है, इसलिए निश्चित या संभव निष्कर्ष पूछने वाले कार्य के लिए सही नहीं है।",
  },
  "pa-IN": {
    preTestDirection: "ਇਸ ਅਧਿਆਇ ਵਿੱਚ ਕਥਨਾਂ ਵਿੱਚ ਦਿੱਤੇ ਹਰ ਵਰਗ ਨੂੰ ਗੈਰ-ਖਾਲੀ ਮੰਨਿਆ ਜਾਵੇਗਾ।",
    conclusion: "ਨਤੀਜਾ",
    definitelyFollows: "ਨਿਸ਼ਚਿਤ ਤੌਰ ’ਤੇ ਨਿਕਲਦਾ ਹੈ",
    impossible: "ਅਸੰਭਵ",
    possibleNotDefinite: "ਸੰਭਵ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ",
    premisesInconsistent: "ਕਥਨ ਅਸੰਗਤ ਹਨ",
    notApplicable: "ਲਾਗੂ ਨਹੀਂ",
    forcedByStatements: (conclusion, statements) => `${statements} ਇਹ ਕਥਨ ਮਿਲ ਕੇ “${conclusion}” ਨੂੰ ਨਿਸ਼ਚਿਤ ਕਰਦੇ ਹਨ।`,
    ruledOutByStatements: (conclusion, statements) => `${statements} ਇਹ ਕਥਨ ਮਿਲ ਕੇ “${conclusion}” ਨੂੰ ਅਸੰਭਵ ਬਣਾਉਂਦੇ ਹਨ।`,
    leftOpenByStatements: (conclusion) => `ਕਥਨ “${conclusion}” ਨੂੰ ਨਾ ਨਿਸ਼ਚਿਤ ਕਰਦੇ ਹਨ ਅਤੇ ਨਾ ਹੀ ਅਸੰਭਵ ਬਣਾਉਂਦੇ ਹਨ।`,
    finalAnswer: (answer) => `ਇਸ ਲਈ, ${answer}।`,
    exactlyOne: "ਦੋਵੇਂ ਨਤੀਜੇ ਪੂਰਕ ਹਨ: ਦੋਵੇਂ ਇਕੱਠੇ ਸਹੀ ਨਹੀਂ ਹੋ ਸਕਦੇ ਅਤੇ ਦੋਵੇਂ ਇਕੱਠੇ ਗਲਤ ਵੀ ਨਹੀਂ ਹੋ ਸਕਦੇ। ਇਸ ਲਈ ਠੀਕ ਇੱਕ ਨਤੀਜਾ ਨਿਕਲਦਾ ਹੈ।",
    modelTrue: (description, conclusion) => `ਮਾਡਲ 1 — ਨਤੀਜਾ ਸਹੀ: ${description} ਇਸ ਵਿੱਚ ਸਾਰੇ ਕਥਨ ਸਹੀ ਰਹਿੰਦੇ ਹਨ ਅਤੇ “${conclusion}” ਸਹੀ ਹੁੰਦਾ ਹੈ।`,
    modelFalse: (description, conclusion) => `ਮਾਡਲ 2 — ਨਤੀਜਾ ਗਲਤ: ${description} ਇਸ ਵਿੱਚ ਸਾਰੇ ਕਥਨ ਸਹੀ ਰਹਿੰਦੇ ਹਨ ਅਤੇ “${conclusion}” ਗਲਤ ਹੁੰਦਾ ਹੈ।`,
    possibilityModel: (description, conclusion) => `ਇੱਕ ਵੈਧ ਮਾਡਲ: ${description} ਇਸ ਵਿੱਚ “${conclusion}” ਸਹੀ ਹੈ, ਇਸ ਲਈ ਇਹ ਸੰਭਵ ਹੈ।`,
    counterexample: (description, conclusion) => `ਵਿਰੋਧੀ ਉਦਾਹਰਨ: ${description} ਸਾਰੇ ਕਥਨ ਸਹੀ ਰਹਿੰਦੇ ਹਨ, ਪਰ “${conclusion}” ਗਲਤ ਹੈ।`,
    memberInsideOutside: (inside, outside) => outside
      ? `ਇੱਕ ਵਸਤੂ ${inside} ਵਿੱਚ ਹੈ ਅਤੇ ${outside} ਵਿੱਚ ਨਹੀਂ ਹੈ।`
      : `ਇੱਕ ਵਸਤੂ ${inside} ਵਿੱਚ ਹੈ।`,
    taskMismatch: "ਇਸ ਦੀ ਤਾਰਕਿਕ ਸਥਿਤੀ ਪ੍ਰਸ਼ਨ ਦੀ ਮੰਗ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦੀ।",
    definiteNotRequested: "ਇਹ ਨਿਸ਼ਚਿਤ ਤੌਰ ’ਤੇ ਨਿਕਲਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਮੰਗਿਆ ਗਿਆ ਅਨਿਸ਼ਚਿਤ ਜਾਂ ਨਾ ਨਿਕਲਣ ਵਾਲਾ ਨਤੀਜਾ ਨਹੀਂ ਹੈ।",
    possibleNotRequested: "ਇਹ ਸੰਭਵ ਹੈ ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ, ਇਸ ਲਈ ਨਿਸ਼ਚਿਤਤਾ ਜਾਂ ਅਸੰਭਵਤਾ ਪੁੱਛਣ ਵਾਲੇ ਕੰਮ ਲਈ ਸਹੀ ਨਹੀਂ ਹੈ।",
    impossibleNotRequested: "ਇਹ ਅਸੰਭਵ ਹੈ, ਇਸ ਲਈ ਨਿਸ਼ਚਿਤ ਜਾਂ ਸੰਭਵ ਨਤੀਜਾ ਪੁੱਛਣ ਵਾਲੇ ਕੰਮ ਲਈ ਸਹੀ ਨਹੀਂ ਹੈ।",
  },
};

const MASK_TASKS = new Set([
  "TWO_CONCLUSION_FOLLOW_MASK",
  "THREE_CONCLUSION_FOLLOW_MASK",
  "ONLY_TWO_CONCLUSION_MASK",
  "FEW_TWO_CONCLUSION_MASK",
  "MIXED_TWO_CONCLUSION_MASK",
  "MIXED_THREE_CONCLUSION_MASK",
]);

const MODEL_MODES = new Set<SylLearnerExplanationModeV5>([
  "COUNTEREXAMPLE",
  "POSSIBILITY_MODEL",
  "DUAL_MODEL",
  "POSSIBLE_NOT_DEFINITE",
]);

function cleanSentence(value: string): string {
  return value.trim().replace(/\s+/gu, " ").replace(/([.!?।])\1+/gu, "$1");
}

function withoutTerminalPunctuation(value: string): string {
  return cleanSentence(value).replace(/[.!?।]+$/u, "");
}

function unique(values: readonly string[]): readonly string[] {
  return [...new Set(values.filter(Boolean))];
}

function joinLabels(values: readonly string[], locale: SylLocale): string {
  const labels = unique(values);
  if (labels.length <= 1) return labels[0] ?? "";
  if (locale === "hi-IN") return labels.join(" और ");
  if (locale === "pa-IN") return labels.join(" ਅਤੇ ");
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels.at(-1)}`;
}

function isGenuineEitherOr(question: GeneratedSylQuestionV4): boolean {
  return question.metadata.pairStatus === "EITHER_OR_FOLLOWS"
    || question.metadata.pairStatus === "EITHER_OR";
}

function explanationMode(question: GeneratedSylQuestionV4): SylLearnerExplanationModeV5 {
  if (question.metadata.taskKind === "TWO_CONCLUSION_EITHER_OR") {
    return isGenuineEitherOr(question) ? "EITHER_OR" : "CONCLUSION_MASK";
  }
  if (question.metadata.taskKind === "CLASSIFY_CONCLUSION_PAIR") {
    return "PAIR_CLASSIFICATION";
  }
  return question.learnerPresentationV4.learnerExplanation.mode;
}

function statusLabel(status: SylSemanticStatusV3, copy: LearnerCopyV5): string {
  switch (status) {
    case "ENTAILED": return copy.definitelyFollows;
    case "CONTRADICTED": return copy.impossible;
    case "UNDETERMINED": return copy.possibleNotDefinite;
    case "PREMISES_INCONSISTENT": return copy.premisesInconsistent;
    case "NOT_APPLICABLE": return copy.notApplicable;
  }
}

function premiseTextForIds(
  question: GeneratedSylQuestionV4,
  premiseIds: readonly string[],
): string {
  const ids = new Set(premiseIds);
  const selected = question.structuredProofV3.statementMeanings
    .filter((entry) => ids.has(entry.premiseId))
    .map((entry) => cleanSentence(entry.statement));
  const fallback = question.structuredProofV3.statementMeanings
    .filter((entry) => question.structuredProofV3.combinedReasoning.decisivePremiseIds.includes(entry.premiseId))
    .map((entry) => cleanSentence(entry.statement));
  return unique(selected.length > 0 ? selected : fallback).slice(0, 2).join(" ");
}

function conclusionReason(
  question: GeneratedSylQuestionV4,
  index: number,
  copy: LearnerCopyV5,
): string {
  const evaluation = question.reviewLogic.conclusionEvaluations[index];
  const conclusion = question.conclusions[index] ?? evaluation?.conclusionId ?? `${copy.conclusion} ${index + 1}`;
  const statements = premiseTextForIds(
    question,
    evaluation?.verdictImpactPremiseIds ?? question.structuredProofV3.combinedReasoning.decisivePremiseIds,
  );
  const usableStatements = statements || question.statements.slice(0, 2).map(cleanSentence).join(" ");
  switch (evaluation?.classification) {
    case "ENTAILED": return copy.forcedByStatements(conclusion, usableStatements);
    case "CONTRADICTED": return copy.ruledOutByStatements(conclusion, usableStatements);
    case "UNDETERMINED": return copy.leftOpenByStatements(conclusion);
    default: return copy.leftOpenByStatements(conclusion);
  }
}

function buildConclusionResults(
  question: GeneratedSylQuestionV4,
  copy: LearnerCopyV5,
): readonly SylLearnerConclusionResultV5[] {
  return question.reviewLogic.conclusionEvaluations.map((evaluation, index) => ({
    displayIndex: index + 1,
    label: `${copy.conclusion} ${["I", "II", "III", "IV"][index] ?? index + 1}`,
    text: question.conclusions[index] ?? evaluation.conclusionId,
    follows: evaluation.classification === "ENTAILED",
    status: evaluation.classification,
    shortReason: conclusionReason(question, index, copy),
  }));
}

function describeModel(
  model: CanonicalModel,
  termLabels: Readonly<Record<TermId, string>>,
  locale: SylLocale,
  copy: LearnerCopyV5,
): string {
  const regions = model.occupiedRegions.slice(0, 4).map((region) => {
    const memberTerms = new Set(region.memberTerms);
    const inside = joinLabels(region.memberTerms.map((term) => termLabels[term] ?? term), locale);
    const outsideTerms = model.termOrder.filter((term) => !memberTerms.has(term));
    const outside = outsideTerms.length > 0
      ? joinLabels(outsideTerms.map((term) => termLabels[term] ?? term), locale)
      : null;
    return copy.memberInsideOutside(inside || "the named classes", outside);
  });
  return unique(regions).join(" ");
}

interface ModelLinesV5 {
  lines: readonly string[];
  evidence: SylLearnerModelEvidenceV5;
}

function modelLines(
  question: GeneratedSylQuestionV4,
  mode: SylLearnerExplanationModeV5,
  termLabels: Readonly<Record<TermId, string>>,
  copy: LearnerCopyV5,
): ModelLinesV5 {
  const proof = question.structuredProofV3.correctOptionProof;
  const diagram = question.structuredProofV3.diagramSpec;
  const conclusion = question.conclusions[0]
    ?? question.options[question.correctIndex]?.text
    ?? question.structuredProofV3.finalAnswer;

  if (mode === "COUNTEREXAMPLE") {
    const counterModel = proof.counterModel ?? diagram.model;
    return {
      lines: counterModel
        ? [copy.counterexample(describeModel(counterModel, termLabels, question.locale, copy), conclusion)]
        : question.learnerPresentationV4.learnerExplanation.shortReasoning,
      evidence: {
        required: true,
        canonicalModelCount: counterModel ? 1 : 0,
        source: "COUNTERMODEL",
      },
    };
  }

  if (mode === "POSSIBILITY_MODEL") {
    const possibleModel = proof.proofModel ?? diagram.model;
    return {
      lines: possibleModel
        ? [copy.possibilityModel(describeModel(possibleModel, termLabels, question.locale, copy), conclusion)]
        : question.learnerPresentationV4.learnerExplanation.shortReasoning,
      evidence: {
        required: true,
        canonicalModelCount: possibleModel ? 1 : 0,
        source: "CORRECT_PROOF_MODEL",
      },
    };
  }

  if (mode === "DUAL_MODEL" || mode === "POSSIBLE_NOT_DEFINITE") {
    const trueModel = proof.proofModel ?? diagram.model;
    const falseModel = proof.counterModel ?? diagram.alternateModel;
    const lines = [
      trueModel ? copy.modelTrue(describeModel(trueModel, termLabels, question.locale, copy), conclusion) : "",
      falseModel ? copy.modelFalse(describeModel(falseModel, termLabels, question.locale, copy), conclusion) : "",
    ].filter(Boolean);
    return {
      lines: lines.length > 0 ? lines : question.learnerPresentationV4.learnerExplanation.shortReasoning,
      evidence: {
        required: true,
        canonicalModelCount: Number(Boolean(trueModel)) + Number(Boolean(falseModel)),
        source: "TRUE_FALSE_MODELS",
      },
    };
  }

  return {
    lines: question.learnerPresentationV4.learnerExplanation.shortReasoning,
    evidence: {
      required: false,
      canonicalModelCount: 0,
      source: "NOT_REQUIRED",
    },
  };
}

function taskDispositionReason(
  status: SylSemanticStatusV3,
  taskStatus: SylTaskStatusV3,
  copy: LearnerCopyV5,
): string {
  if (taskStatus === "KEYED") return "";
  if (status === "ENTAILED") return copy.definiteNotRequested;
  if (status === "UNDETERMINED") return copy.possibleNotRequested;
  if (status === "CONTRADICTED") return copy.impossibleNotRequested;
  return copy.taskMismatch;
}

function buildOptionAnalysis(
  question: GeneratedSylQuestionV4,
  copy: LearnerCopyV5,
): readonly SylLearnerOptionAnalysisV5[] {
  const v4ByIndex = new Map(
    question.learnerPresentationV4.optionAnalysis.map((entry) => [entry.displayIndex, entry]),
  );
  return question.structuredProofV3.visibleOptionAnalysis.map((analysis) => {
    const previous = v4ByIndex.get(analysis.displayIndex);
    const logicalLabel = statusLabel(analysis.semanticStatus, copy);
    const disposition = taskDispositionReason(analysis.semanticStatus, analysis.taskStatus, copy);
    const originalReason = cleanSentence(previous?.studentReason ?? analysis.studentReason);
    return {
      displayIndex: analysis.displayIndex,
      text: analysis.text,
      verdict: previous?.verdict ?? "OTHER",
      verdictLabel: logicalLabel,
      studentReason: unique([logicalLabel, disposition, originalReason]).join(" "),
      logicalStatus: analysis.semanticStatus,
      taskDisposition: analysis.taskStatus,
    };
  });
}

function hasUnknownPremisePair(question: GeneratedSylQuestionV4): boolean {
  const terms = unique(question.structuredPrompt.premises.flatMap((premise) => [premise.subject, premise.predicate]));
  const directPairs = new Set(question.structuredPrompt.premises.map((premise) =>
    [premise.subject, premise.predicate].sort().join("::")));
  for (let left = 0; left < terms.length; left += 1) {
    for (let right = left + 1; right < terms.length; right += 1) {
      if (!directPairs.has([terms[left], terms[right]].sort().join("::"))) return true;
    }
  }
  return false;
}

function remediateDiagram(
  question: GeneratedSylQuestionV4,
  resolvedMode: SylLearnerExplanationModeV5,
): SylLearnerPresentationV5["diagram"] {
  const current = question.learnerPresentationV4.diagram;
  const answerModeMismatch = current.mode === "VENN_EITHER_OR" && resolvedMode !== "EITHER_OR";
  const unknownWitnessRelation = current.mode === "VENN_WITNESS_TRANSFER" && hasUnknownPremisePair(question);
  if (!answerModeMismatch && !unknownWitnessRelation) return current;
  const reason = answerModeMismatch ? "ANSWER_MODE_MISMATCH" : "UNKNOWN_RELATION_NOT_DRAWN";
  return {
    ...current,
    enabled: false,
    mode: "OMITTED_NOT_USEFUL",
    omissionReason: reason,
    svg: null,
    caption: null,
    accessibleDescription: null,
    semanticSignature: `syl-v5:diagram-omitted:${reason}:${question.qlId}:${question.seed}`,
    modelSignature: null,
    answerSentenceEmbedded: false,
    diagramCount: 0,
  };
}

function countWords(values: readonly string[]): number {
  return values.join(" ").trim().split(/\s+/u).filter(Boolean).length;
}

export function buildLearnerPresentationV5(
  question: GeneratedSylQuestionV4,
  termLabels: Readonly<Record<TermId, string>>,
): SylLearnerPresentationV5 {
  const copy = COPY[question.locale];
  const resolvedMode = explanationMode(question);
  const conclusionResults = buildConclusionResults(question, copy);
  const answerText = question.options[question.correctIndex]?.text
    ?? question.learnerPresentationV4.answer.text;
  const isPairOrMask = MASK_TASKS.has(question.metadata.taskKind)
    || question.metadata.taskKind === "TWO_CONCLUSION_EITHER_OR"
    || question.metadata.taskKind === "CLASSIFY_CONCLUSION_PAIR";
  const model = modelLines(question, resolvedMode, termLabels, copy);

  let shortReasoning = model.lines;
  if (isPairOrMask) {
    shortReasoning = conclusionResults.map((result) => `${result.label}: ${result.shortReason}`);
    if (resolvedMode === "EITHER_OR" || (resolvedMode === "PAIR_CLASSIFICATION" && isGenuineEitherOr(question))) {
      shortReasoning = [...shortReasoning, copy.exactlyOne];
    }
  }

  const finalConclusion = isPairOrMask
    ? copy.finalAnswer(withoutTerminalPunctuation(answerText))
    : question.learnerPresentationV4.learnerExplanation.conclusion;
  const existenceNote = question.structuredProofV3.existencePolicy.dependentAnswer
    ? copy.preTestDirection
    : question.learnerPresentationV4.learnerExplanation.existenceNote;
  const diagram = remediateDiagram(question, resolvedMode);
  const optionAnalysis = buildOptionAnalysis(question, copy);
  const wordCount = countWords([
    ...shortReasoning,
    finalConclusion,
    ...conclusionResults.map((result) => result.shortReason),
    existenceNote ?? "",
  ]);

  return {
    ...question.learnerPresentationV4,
    authority: SYL_LEARNER_V5_AUTHORITY,
    schemaVersion: "syl-learner-v5",
    preTestDirection: copy.preTestDirection,
    learnerExplanation: {
      ...question.learnerPresentationV4.learnerExplanation,
      mode: resolvedMode,
      shortReasoning,
      conclusion: finalConclusion,
      conclusionResults,
      showDiagram: diagram.enabled,
      existenceNote,
      wordCount,
    },
    optionAnalysis,
    diagram,
    modelEvidence: model.evidence,
    remediationEvidence: {
      answerDerivedExplanationMode: true,
      answerDerivedDiagramMode: true,
      everyDisplayedConclusionExplained: true,
      logicalStatusSeparatedFromTaskDisposition: true,
      nonEmptyClassDirectionVisibleBeforeAttempt: true,
      unknownRelationsNeverRenderedAsProvedSeparation: true,
      nativeEnglishEditorialStatus: "PENDING",
      nativeHindiEditorialStatus: "PENDING",
      nativePunjabiEditorialStatus: "PENDING",
      humanViewportStatus: "PENDING",
      deadOptionRemediationStatus: "PENDING_SEPARATE_SOURCE_DECISION",
      mockWeightCalibrationStatus: "PENDING_SEPARATE_SOURCE_DECISION",
    },
  };
}

export function expectedLogicalLabelV5(
  locale: SylLocale,
  status: SylSemanticStatusV3,
): string {
  return statusLabel(status, COPY[locale]);
}

export function requiresConcreteModelsV5(mode: SylLearnerExplanationModeV5): boolean {
  return MODEL_MODES.has(mode);
}
