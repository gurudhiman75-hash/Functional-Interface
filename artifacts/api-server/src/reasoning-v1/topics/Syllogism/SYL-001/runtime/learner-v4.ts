import type {
  SurfacePremise,
  TermId,
} from "../foundation/types";
import { learnerCopyV4 } from "./learner-v4-localization";
import {
  SYL_LEARNER_V4_AUTHORITY,
  type SylLearnerBuildInputV4,
  type SylLearnerConclusionResultV4,
  type SylLearnerExplanationModeV4,
  type SylLearnerOptionAnalysisV4,
  type SylLearnerOptionVerdictV4,
  type SylLearnerPresentationV4,
} from "./learner-v4-types";
import type {
  SylOptionReasonCodeV3,
  SylStructuredProofV3,
  SylVisibleOptionAnalysisV3,
} from "./structured-proof-v3-types";
import { renderVennDiagramV4 } from "./venn-diagram-v4";

const MASK_TASKS = new Set([
  "TWO_CONCLUSION_FOLLOW_MASK",
  "THREE_CONCLUSION_FOLLOW_MASK",
  "ONLY_TWO_CONCLUSION_MASK",
  "FEW_TWO_CONCLUSION_MASK",
  "MIXED_TWO_CONCLUSION_MASK",
  "MIXED_THREE_CONCLUSION_MASK",
]);

const MODAL_TASKS = new Set([
  "CLASSIFY_CONCLUSION_MODALITY",
  "ONLY_MODAL_CLASSIFICATION",
  "FEW_MODAL_CLASSIFICATION",
  "MIXED_MODAL_CLASSIFICATION",
]);

function cleanSentence(value: string, locale: SylLearnerBuildInputV4["locale"]): string {
  const text = value.trim().replace(/\s+/gu, " ").replace(/[.!?।]+$/u, "");
  if (!text) return "";
  return locale === "en-IN" ? `${text}.` : `${text}।`;
}

function countWords(values: readonly string[]): number {
  return values
    .join(" ")
    .trim()
    .split(/\s+/u)
    .filter(Boolean)
    .length;
}

function unique<T>(values: readonly T[]): readonly T[] {
  return [...new Set(values)];
}

function modeFor(proof: SylStructuredProofV3, input: SylLearnerBuildInputV4): SylLearnerExplanationModeV4 {
  const correct = proof.visibleOptionAnalysis.find((entry) => entry.displayIndex === input.correctIndex + 1);
  if (MASK_TASKS.has(input.taskKind)) return "CONCLUSION_MASK";
  if (input.taskKind === "TWO_CONCLUSION_EITHER_OR") return "EITHER_OR";
  if (
    MODAL_TASKS.has(input.taskKind)
    && correct?.semanticStatus === "UNDETERMINED"
  ) return "POSSIBLE_NOT_DEFINITE";

  switch (proof.correctOptionProof.proofType) {
    case "WITNESS_TRANSFER": return "WITNESS_TRANSFER";
    case "IMPOSSIBILITY_CONFLICT": return "DIRECT_CONTRADICTION";
    case "COUNTERMODEL": return "COUNTEREXAMPLE";
    case "SATISFYING_MODEL": return "POSSIBILITY_MODEL";
    case "TRUE_FALSE_MODELS": return "DUAL_MODEL";
    case "MASK_DERIVATION": return "CONCLUSION_MASK";
    case "EITHER_OR_EXACT_ONE": return "EITHER_OR";
    case "FORCED_RELATION": return "DIRECT_CHAIN";
  }
}

function decisiveStatements(proof: SylStructuredProofV3, input: SylLearnerBuildInputV4): readonly string[] {
  const ids = new Set(proof.correctOptionProof.premiseIdsUsed);
  const result = input.displayedPremises
    .map((premise, index) => ({ premise, statement: input.statements[index] }))
    .filter(({ premise }) => ids.has(premise.premiseId))
    .map(({ statement }) => cleanSentence(statement, input.locale));
  return unique(result.length > 0 ? result : input.statements.map((statement) => cleanSentence(statement, input.locale))).slice(0, 3);
}

function joinedLabels(terms: readonly TermId[], input: SylLearnerBuildInputV4): string {
  const labels = unique(terms.map((term) => input.termLabels[term] ?? term));
  if (input.locale === "hi-IN") return labels.join(" और ");
  if (input.locale === "pa-IN") return labels.join(" ਅਤੇ ");
  if (labels.length <= 1) return labels[0] ?? "";
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels.at(-1)}`;
}

interface InferredWitnessV4 {
  memberOf: readonly TermId[];
  outsideOf: readonly TermId[];
}

function inferredWitness(
  proof: SylStructuredProofV3,
  input: SylLearnerBuildInputV4,
): InferredWitnessV4 | null {
  const decisiveIds = new Set(proof.correctOptionProof.premiseIdsUsed);
  const premises = input.displayedPremises.filter((premise) => decisiveIds.has(premise.premiseId));
  const memberOf = new Set<TermId>();
  const outsideOf = new Set<TermId>();
  const stored = proof.combinedReasoning.witnesses[0];

  if (stored) {
    stored.memberOf.forEach((term) => memberOf.add(term));
    stored.outsideOf.forEach((term) => outsideOf.add(term));
  } else {
    const existential = premises.find((premise) =>
      ["SOME", "A_FEW", "SOME_NOT", "NOT_ALL", "ONLY_A_FEW"].includes(premise.form));
    if (!existential) return null;
    memberOf.add(existential.subject);
    if (["SOME", "A_FEW", "ONLY_A_FEW"].includes(existential.form)) {
      memberOf.add(existential.predicate);
    } else {
      outsideOf.add(existential.predicate);
    }
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const premise of premises) {
      const addMember = (term: TermId) => {
        if (!memberOf.has(term)) { memberOf.add(term); changed = true; }
      };
      const addOutside = (term: TermId) => {
        if (!outsideOf.has(term)) { outsideOf.add(term); changed = true; }
      };
      if (["ALL", "ARE_ONLY"].includes(premise.form) && memberOf.has(premise.subject)) {
        addMember(premise.predicate);
      }
      if (premise.form === "ONLY" && memberOf.has(premise.predicate)) {
        addMember(premise.subject);
      }
      if (premise.form === "IDENTITY") {
        if (memberOf.has(premise.subject)) addMember(premise.predicate);
        if (memberOf.has(premise.predicate)) addMember(premise.subject);
      }
      if (premise.form === "NO") {
        if (memberOf.has(premise.subject)) addOutside(premise.predicate);
        if (memberOf.has(premise.predicate)) addOutside(premise.subject);
      }
    }
  }

  return { memberOf: [...memberOf], outsideOf: [...outsideOf] };
}

function witnessBridge(proof: SylStructuredProofV3, input: SylLearnerBuildInputV4): string {
  const witness = inferredWitness(proof, input);
  const copy = learnerCopyV4(input.locale);
  if (!witness) return copy.directChainBridge;
  return copy.witnessSameMember(
    joinedLabels(witness.memberOf, input),
    witness.outsideOf.length > 0 ? joinedLabels(witness.outsideOf, input) : null,
  );
}

function conclusionSentence(
  mode: SylLearnerExplanationModeV4,
  input: SylLearnerBuildInputV4,
  answerText: string,
): string {
  const answer = answerText.trim().replace(/[.!?।]+$/u, "");
  if (input.locale === "hi-IN") {
    if (mode === "COUNTEREXAMPLE") return "इसलिए, यह निष्कर्ष निश्चित रूप से नहीं निकलता।";
    if (mode === "DIRECT_CONTRADICTION") return "इसलिए, यह निष्कर्ष असंभव है।";
    if (mode === "POSSIBILITY_MODEL") return "इसलिए, यह निष्कर्ष संभव है।";
    if (mode === "DUAL_MODEL" || mode === "POSSIBLE_NOT_DEFINITE") return "इसलिए, निष्कर्ष संभव है, लेकिन निश्चित नहीं है।";
    if (MODAL_TASKS.has(input.taskKind)) return `इसलिए, निष्कर्ष ${answer} है।`;
    return `इसलिए, ${answer}।`;
  }
  if (input.locale === "pa-IN") {
    if (mode === "COUNTEREXAMPLE") return "ਇਸ ਲਈ, ਇਹ ਨਤੀਜਾ ਨਿਸ਼ਚਿਤ ਤੌਰ ’ਤੇ ਨਹੀਂ ਨਿਕਲਦਾ।";
    if (mode === "DIRECT_CONTRADICTION") return "ਇਸ ਲਈ, ਇਹ ਨਤੀਜਾ ਅਸੰਭਵ ਹੈ।";
    if (mode === "POSSIBILITY_MODEL") return "ਇਸ ਲਈ, ਇਹ ਨਤੀਜਾ ਸੰਭਵ ਹੈ।";
    if (mode === "DUAL_MODEL" || mode === "POSSIBLE_NOT_DEFINITE") return "ਇਸ ਲਈ, ਨਤੀਜਾ ਸੰਭਵ ਹੈ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੈ।";
    if (MODAL_TASKS.has(input.taskKind)) return `ਇਸ ਲਈ, ਨਤੀਜਾ ${answer} ਹੈ।`;
    return `ਇਸ ਲਈ, ${answer}।`;
  }
  if (mode === "COUNTEREXAMPLE") return "Therefore, this conclusion does not definitely follow.";
  if (mode === "DIRECT_CONTRADICTION") return "Therefore, this conclusion is impossible.";
  if (mode === "POSSIBILITY_MODEL") return "Therefore, this conclusion is possible.";
  if (mode === "DUAL_MODEL" || mode === "POSSIBLE_NOT_DEFINITE") return "Therefore, the conclusion is possible, but not definite.";
  if (MODAL_TASKS.has(input.taskKind)) return `Therefore, the conclusion is ${answer.toLocaleLowerCase("en-IN")}.`;
  return `Therefore, ${answer}.`;
}

function materiallyDependsOnExistencePolicy(
  proof: SylStructuredProofV3,
  input: SylLearnerBuildInputV4,
): boolean {
  if (!proof.existencePolicy.dependentAnswer) return false;
  const decisiveIds = new Set(proof.correctOptionProof.premiseIdsUsed);
  const hasExplicitWitness = input.displayedPremises.some((premise) =>
    decisiveIds.has(premise.premiseId)
    && ["SOME", "SOME_NOT", "A_FEW", "NOT_ALL", "ONLY_A_FEW"].includes(premise.form));
  return !hasExplicitWitness;
}

function shortReasoning(
  mode: SylLearnerExplanationModeV4,
  proof: SylStructuredProofV3,
  input: SylLearnerBuildInputV4,
): readonly string[] {
  const copy = learnerCopyV4(input.locale);
  const statements = decisiveStatements(proof, input);

  switch (mode) {
    case "DIRECT_CHAIN":
      return [...statements, copy.directChainBridge];
    case "WITNESS_TRANSFER":
      return [...statements, witnessBridge(proof, input)];
    case "DIRECT_CONTRADICTION": {
      const witness = inferredWitness(proof, input);
      return witness
        ? [...statements, witnessBridge(proof, input)]
        : [...statements, copy.directContradiction];
    }
    case "POSSIBLE_NOT_DEFINITE":
      return [copy.possibleNotDefinite, copy.dualTrue, copy.dualFalse];
    case "COUNTEREXAMPLE":
      return [copy.counterexample];
    case "POSSIBILITY_MODEL":
      return [copy.possibilityModel];
    case "DUAL_MODEL":
      return [copy.dualTrue, copy.dualFalse];
    case "CONCLUSION_MASK":
      return [];
    case "EITHER_OR":
      return copy.eitherOr;
  }
}

function conclusionResults(input: SylLearnerBuildInputV4): readonly SylLearnerConclusionResultV4[] {
  const copy = learnerCopyV4(input.locale);
  return input.reviewLogic.conclusionEvaluations.map((evaluation, index) => ({
    displayIndex: index + 1,
    label: `${copy.conclusion} ${["I", "II", "III", "IV"][index] ?? index + 1}`,
    text: input.conclusions[index] ?? evaluation.conclusionId,
    follows: evaluation.classification === "ENTAILED",
    shortReason: evaluation.classification === "ENTAILED"
      ? null
      : evaluation.classification === "CONTRADICTED"
        ? copy.directContradiction
        : copy.possibleNotDefinite,
  }));
}

function verdictFor(analysis: SylVisibleOptionAnalysisV3): SylLearnerOptionVerdictV4 {
  switch (analysis.reasonCode) {
    case "DIRECT_CONTRADICTION":
    case "IMPOSSIBLE_IN_ALL_MODELS":
      return "IMPOSSIBLE";
    case "REVERSAL_ERROR":
    case "ONLY_DIRECTION_ERROR":
      return "WRONG_DIRECTION";
    case "POSSIBILITY_MISTAKEN_FOR_CERTAINTY":
    case "VALID_SATISFYING_MODEL":
      return "POSSIBLE_NOT_DEFINITE";
    case "MASK_MISMATCH":
      return "WRONG_MASK";
    case "EITHER_OR_NOT_EXCLUSIVE":
    case "EITHER_OR_NOT_EXHAUSTIVE":
    case "PAIR_CLASSIFICATION_MISMATCH":
      return "INVALID_PAIR";
    case "CERTAINTY_NOT_REQUESTED":
    case "TASK_NOT_REQUESTED":
      return "NOT_REQUESTED";
    case "VALID_COUNTERMODEL":
    case "WITNESS_MISMATCH":
    case "ONLY_A_FEW_TWO_FACTS":
    case "NOT_ALL_NORMALIZATION":
    case "FORCED_WITNESS_TRANSFER":
    case "COMPLETE_PROOF":
      return "NOT_PROVED";
  }
}

function stripTechnical(value: string): string {
  return value
    .replace(/\bSYL-[A-Z0-9-]+\b/gu, "")
    .replace(/\b(?:ENTAILED|CONTRADICTED|UNDETERMINED|FORCED_WITNESS_TRANSFER|VALID_COUNTERMODEL|VALID_SATISFYING_MODEL)\b/gu, "")
    .replace(/([।.!?])\1+/gu, "$1")
    .replace(/\s+/gu, " ")
    .replace(/\s+([,.!?।])/gu, "$1")
    .trim();
}

function cappedNaturalReason(value: string): string {
  const cleaned = stripTechnical(value);
  const sentences = cleaned.split(/(?<=[.!?।])\s+/u).filter(Boolean).slice(0, 2);
  const words = sentences.join(" ").split(/\s+/u).filter(Boolean);
  const result = words.slice(0, 42).join(" ").replace(/[.!?।]*$/u, "");
  return result ? `${result}${cleaned.includes("।") ? "।" : "."}` : "";
}

function fallbackReason(
  code: SylOptionReasonCodeV3,
  locale: SylLearnerBuildInputV4["locale"],
): string {
  if (locale === "hi-IN") {
    switch (code) {
      case "DIRECT_CONTRADICTION":
      case "IMPOSSIBLE_IN_ALL_MODELS": return "यह विकल्प कथनों के सीधे विरुद्ध है, इसलिए सत्य नहीं हो सकता।";
      case "REVERSAL_ERROR":
      case "ONLY_DIRECTION_ERROR": return "इस विकल्प ने संबंध की दिशा उलट दी है। उल्टा संबंध सिद्ध नहीं है।";
      case "POSSIBILITY_MISTAKEN_FOR_CERTAINTY":
      case "VALID_SATISFYING_MODEL": return "यह संभव हो सकता है, लेकिन कथन इसे निश्चित रूप से सिद्ध नहीं करते।";
      case "WITNESS_MISMATCH": return "दो ‘कुछ’ कथनों में एक ही सदस्य होना अनिवार्य नहीं है।";
      case "ONLY_A_FEW_TWO_FACTS": return "‘केवल कुछ’ एक साझा सदस्य और एक बाहर का सदस्य—दोनों सिद्ध करता है।";
      case "NOT_ALL_NORMALIZATION": return "‘सभी नहीं’ कम-से-कम एक सदस्य को बाहर सिद्ध करता है; यह ‘कोई नहीं’ नहीं है।";
      case "VALID_COUNTERMODEL": return "एक सही व्यवस्था में कथन सत्य रहते हैं, लेकिन यह विकल्प असत्य हो जाता है।";
      case "MASK_MISMATCH": return "यह विकल्प निष्कर्षों के सही निकलता/नहीं निकलता क्रम से मेल नहीं खाता।";
      case "EITHER_OR_NOT_EXCLUSIVE": return "दोनों निष्कर्ष एक साथ सत्य हो सकते हैं, इसलिए यह सही ‘या तो–या’ जोड़ी नहीं है।";
      case "EITHER_OR_NOT_EXHAUSTIVE": return "दोनों निष्कर्ष एक साथ असत्य हो सकते हैं, इसलिए ठीक एक सत्य होना अनिवार्य नहीं है।";
      case "PAIR_CLASSIFICATION_MISMATCH": return "इस विकल्प में निष्कर्ष-जोड़ी का सही संबंध नहीं दिया गया है।";
      case "CERTAINTY_NOT_REQUESTED":
      case "TASK_NOT_REQUESTED": return "यह बात सही हो सकती है, लेकिन प्रश्न जिस परिणाम को पूछता है वह यह नहीं है।";
      case "FORCED_WITNESS_TRANSFER":
      case "COMPLETE_PROOF": return "कथन किसी दूसरे विकल्प को सिद्ध करते हैं; यह विकल्प आवश्यक परिणाम नहीं है।";
    }
  }
  if (locale === "pa-IN") {
    switch (code) {
      case "DIRECT_CONTRADICTION":
      case "IMPOSSIBLE_IN_ALL_MODELS": return "ਇਹ ਵਿਕਲਪ ਕਥਨਾਂ ਦੇ ਸਿੱਧੇ ਉਲਟ ਹੈ, ਇਸ ਲਈ ਸਹੀ ਨਹੀਂ ਹੋ ਸਕਦਾ।";
      case "REVERSAL_ERROR":
      case "ONLY_DIRECTION_ERROR": return "ਇਸ ਵਿਕਲਪ ਨੇ ਸੰਬੰਧ ਦੀ ਦਿਸ਼ਾ ਉਲਟੀ ਕਰ ਦਿੱਤੀ ਹੈ। ਉਲਟ ਸੰਬੰਧ ਸਾਬਤ ਨਹੀਂ ਹੈ।";
      case "POSSIBILITY_MISTAKEN_FOR_CERTAINTY":
      case "VALID_SATISFYING_MODEL": return "ਇਹ ਸੰਭਵ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਕਥਨ ਇਸ ਨੂੰ ਨਿਸ਼ਚਿਤ ਤੌਰ ’ਤੇ ਸਾਬਤ ਨਹੀਂ ਕਰਦੇ।";
      case "WITNESS_MISMATCH": return "ਦੋ ‘ਕੁਝ’ ਕਥਨਾਂ ਵਿੱਚ ਇੱਕੋ ਮੈਂਬਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।";
      case "ONLY_A_FEW_TWO_FACTS": return "‘ਕੇਵਲ ਕੁਝ’ ਇੱਕ ਸਾਂਝਾ ਮੈਂਬਰ ਅਤੇ ਇੱਕ ਬਾਹਰਲਾ ਮੈਂਬਰ—ਦੋਵੇਂ ਸਾਬਤ ਕਰਦਾ ਹੈ।";
      case "NOT_ALL_NORMALIZATION": return "‘ਸਾਰੇ ਨਹੀਂ’ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਨੂੰ ਬਾਹਰ ਸਾਬਤ ਕਰਦਾ ਹੈ; ਇਹ ‘ਕੋਈ ਨਹੀਂ’ ਨਹੀਂ ਹੈ।";
      case "VALID_COUNTERMODEL": return "ਇੱਕ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਕਥਨ ਸਹੀ ਰਹਿੰਦੇ ਹਨ, ਪਰ ਇਹ ਵਿਕਲਪ ਗਲਤ ਹੋ ਜਾਂਦਾ ਹੈ।";
      case "MASK_MISMATCH": return "ਇਹ ਵਿਕਲਪ ਨਤੀਜਿਆਂ ਦੇ ਸਹੀ ਨਿਕਲਦਾ/ਨਹੀਂ ਨਿਕਲਦਾ ਕ੍ਰਮ ਨਾਲ ਨਹੀਂ ਮਿਲਦਾ।";
      case "EITHER_OR_NOT_EXCLUSIVE": return "ਦੋਵੇਂ ਨਤੀਜੇ ਇਕੱਠੇ ਸਹੀ ਹੋ ਸਕਦੇ ਹਨ, ਇਸ ਲਈ ਇਹ ਠੀਕ ‘ਜਾਂ ਤਾਂ–ਜਾਂ’ ਜੋੜੀ ਨਹੀਂ ਹੈ।";
      case "EITHER_OR_NOT_EXHAUSTIVE": return "ਦੋਵੇਂ ਨਤੀਜੇ ਇਕੱਠੇ ਗਲਤ ਹੋ ਸਕਦੇ ਹਨ, ਇਸ ਲਈ ਠੀਕ ਇੱਕ ਦਾ ਸਹੀ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।";
      case "PAIR_CLASSIFICATION_MISMATCH": return "ਇਸ ਵਿਕਲਪ ਵਿੱਚ ਨਤੀਜਾ-ਜੋੜੀ ਦਾ ਸਹੀ ਸੰਬੰਧ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ।";
      case "CERTAINTY_NOT_REQUESTED":
      case "TASK_NOT_REQUESTED": return "ਇਹ ਗੱਲ ਸਹੀ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਸਵਾਲ ਜਿਸ ਨਤੀਜੇ ਨੂੰ ਪੁੱਛਦਾ ਹੈ ਉਹ ਇਹ ਨਹੀਂ ਹੈ।";
      case "FORCED_WITNESS_TRANSFER":
      case "COMPLETE_PROOF": return "ਕਥਨ ਕਿਸੇ ਹੋਰ ਵਿਕਲਪ ਨੂੰ ਸਾਬਤ ਕਰਦੇ ਹਨ; ਇਹ ਲਾਜ਼ਮੀ ਨਤੀਜਾ ਨਹੀਂ ਹੈ।";
    }
  }
  switch (code) {
    case "DIRECT_CONTRADICTION":
    case "IMPOSSIBLE_IN_ALL_MODELS": return "It directly conflicts with the statements, so it cannot be true.";
    case "REVERSAL_ERROR":
    case "ONLY_DIRECTION_ERROR": return "It reverses the relation. The converse is not guaranteed.";
    case "POSSIBILITY_MISTAKEN_FOR_CERTAINTY":
    case "VALID_SATISFYING_MODEL": return "It may be true, but the statements do not prove it with certainty.";
    case "WITNESS_MISMATCH": return "Two ‘some’ statements do not have to refer to the same member.";
    case "ONLY_A_FEW_TWO_FACTS": return "‘Only a few’ proves both an overlap and a member outside; this option uses only one part.";
    case "NOT_ALL_NORMALIZATION": return "‘Not all’ proves at least one member is outside; it does not mean none are inside.";
    case "VALID_COUNTERMODEL": return "A valid arrangement keeps every statement true while this option is false.";
    case "MASK_MISMATCH": return "Its follows/does-not-follow pattern does not match the conclusions.";
    case "EITHER_OR_NOT_EXCLUSIVE": return "Both conclusions can be true together, so this is not a valid either-or pair.";
    case "EITHER_OR_NOT_EXHAUSTIVE": return "Both conclusions can be false together, so exactly one is not guaranteed.";
    case "PAIR_CLASSIFICATION_MISMATCH": return "It gives the wrong relationship between the two conclusions.";
    case "CERTAINTY_NOT_REQUESTED":
    case "TASK_NOT_REQUESTED": return "This may be true, but it is not the result asked for.";
    case "FORCED_WITNESS_TRANSFER":
    case "COMPLETE_PROOF": return "The statements prove a different option; this is not the required result.";
  }
}

function wrongOptions(
  proof: SylStructuredProofV3,
  input: SylLearnerBuildInputV4,
): readonly SylLearnerOptionAnalysisV4[] {
  const copy = learnerCopyV4(input.locale);
  return proof.visibleOptionAnalysis
    .filter((analysis) => !analysis.isCorrectForTask)
    .map((analysis) => {
      const cleaned = cappedNaturalReason(analysis.studentReason);
      const reason = countWords([cleaned]) >= 7
        ? cleaned
        : fallbackReason(analysis.reasonCode, input.locale);
      const verdict = verdictFor(analysis);
      return {
        displayIndex: analysis.displayIndex,
        text: analysis.text,
        verdict,
        verdictLabel: copy.verdicts[verdict],
        studentReason: reason,
      };
    });
}

function relationText(premise: SurfacePremise, input: SylLearnerBuildInputV4): {
  subject: string;
  predicate: string;
} {
  return {
    subject: input.termLabels[premise.subject] ?? premise.subject,
    predicate: input.termLabels[premise.predicate] ?? premise.predicate,
  };
}

function shortcutFor(
  mode: SylLearnerExplanationModeV4,
  input: SylLearnerBuildInputV4,
): string | null {
  const premises = input.displayedPremises;
  const some = premises.find((entry) => entry.form === "SOME" || entry.form === "A_FEW");
  const no = premises.find((entry) => entry.form === "NO");
  if (mode === "WITNESS_TRANSFER" && some && no) {
    const shared = [some.subject, some.predicate].find((term) => term === no.subject || term === no.predicate);
    if (shared) {
      const a = some.subject === shared ? some.predicate : some.subject;
      const c = no.subject === shared ? no.predicate : no.subject;
      const A = input.termLabels[a] ?? a;
      const B = input.termLabels[shared] ?? shared;
      const C = input.termLabels[c] ?? c;
      if (input.locale === "hi-IN") return `कुछ ${A}, ${B} हैं + कोई ${B}, ${C} नहीं है ⇒ कुछ ${A}, ${C} नहीं हैं।`;
      if (input.locale === "pa-IN") return `ਕੁਝ ${A}, ${B} ਹਨ + ਕੋਈ ${B}, ${C} ਨਹੀਂ ਹੈ ⇒ ਕੁਝ ${A}, ${C} ਨਹੀਂ ਹਨ।`;
      return `Some ${A} are ${B} + No ${B} is ${C} ⇒ Some ${A} are not ${C}.`;
    }
  }

  const only = premises.find((entry) => entry.form === "ONLY");
  if (only) {
    const { subject: A, predicate: B } = relationText(only, input);
    if (input.locale === "hi-IN") return `केवल ${A}, ${B} हैं ⇒ सभी ${B}, ${A} हैं।`;
    if (input.locale === "pa-IN") return `ਕੇਵਲ ${A}, ${B} ਹਨ ⇒ ਸਾਰੇ ${B}, ${A} ਹਨ।`;
    return `Only ${A} are ${B} ⇒ All ${B} are ${A}.`;
  }

  const onlyFew = premises.find((entry) => entry.form === "ONLY_A_FEW");
  if (onlyFew) {
    const { subject: A, predicate: B } = relationText(onlyFew, input);
    if (input.locale === "hi-IN") return `केवल कुछ ${A}, ${B} हैं ⇒ कुछ ${A}, ${B} हैं + कुछ ${A}, ${B} नहीं हैं।`;
    if (input.locale === "pa-IN") return `ਕੇਵਲ ਕੁਝ ${A}, ${B} ਹਨ ⇒ ਕੁਝ ${A}, ${B} ਹਨ + ਕੁਝ ${A}, ${B} ਨਹੀਂ ਹਨ।`;
    return `Only a few ${A} are ${B} ⇒ Some ${A} are ${B} + Some ${A} are not ${B}.`;
  }

  const notAll = premises.find((entry) => entry.form === "NOT_ALL");
  if (notAll) {
    const { subject: A, predicate: B } = relationText(notAll, input);
    if (input.locale === "hi-IN") return `सभी ${A}, ${B} नहीं हैं ⇒ कुछ ${A}, ${B} नहीं हैं।`;
    if (input.locale === "pa-IN") return `ਸਾਰੇ ${A}, ${B} ਨਹੀਂ ਹਨ ⇒ ਕੁਝ ${A}, ${B} ਨਹੀਂ ਹਨ।`;
    return `Not all ${A} are ${B} ⇒ Some ${A} are not ${B}.`;
  }

  const all = premises.filter((entry) => entry.form === "ALL" || entry.form === "ARE_ONLY");
  if (mode === "DIRECT_CHAIN" && all.length >= 2) {
    const first = all[0];
    const second = all.find((entry) => entry.subject === first.predicate);
    if (second) {
      const A = input.termLabels[first.subject] ?? first.subject;
      const B = input.termLabels[first.predicate] ?? first.predicate;
      const C = input.termLabels[second.predicate] ?? second.predicate;
      if (input.locale === "hi-IN") return `सभी ${A}, ${B} हैं + सभी ${B}, ${C} हैं ⇒ सभी ${A}, ${C} हैं।`;
      if (input.locale === "pa-IN") return `ਸਾਰੇ ${A}, ${B} ਹਨ + ਸਾਰੇ ${B}, ${C} ਹਨ ⇒ ਸਾਰੇ ${A}, ${C} ਹਨ।`;
      return `All ${A} are ${B} + All ${B} are ${C} ⇒ All ${A} are ${C}.`;
    }
  }
  return null;
}

function termOrder(input: SylLearnerBuildInputV4): readonly TermId[] {
  return Object.keys(input.termLabels).sort() as TermId[];
}

export function buildLearnerPresentationV4(
  proof: SylStructuredProofV3,
  input: SylLearnerBuildInputV4,
): SylLearnerPresentationV4 {
  const copy = learnerCopyV4(input.locale);
  const correctOption = input.options[input.correctIndex];
  if (!correctOption?.isCorrect) {
    throw new Error(`${input.qlId} V4 could not resolve the keyed option.`);
  }
  const mode = modeFor(proof, input);
  const reasoning = shortReasoning(mode, proof, input);
  const results = mode === "CONCLUSION_MASK" ? conclusionResults(input) : [];
  const conclusion = conclusionSentence(mode, input, correctOption.text);
  const shortcut = shortcutFor(mode, input);
  const diagram = renderVennDiagramV4(proof, {
    locale: input.locale,
    displayedPremises: input.displayedPremises,
    termLabels: input.termLabels,
    learnerMode: mode,
    correctSemanticValue: correctOption.semanticValue,
  });
  const premiseIds = unique([
    ...proof.correctOptionProof.premiseIdsUsed,
    ...proof.visibleOptionAnalysis.flatMap((entry) => entry.premiseIdsUsed),
  ]);
  const reasonCodes = unique(proof.visibleOptionAnalysis.map((entry) => entry.reasonCode));

  return {
    authority: SYL_LEARNER_V4_AUTHORITY,
    schemaVersion: "syl-learner-v4",
    locale: input.locale,
    answer: {
      displayIndex: input.correctIndex + 1,
      text: correctOption.text,
      label: copy.correctAnswer,
    },
    learnerExplanation: {
      mode,
      shortReasoning: reasoning,
      conclusion,
      conclusionResults: results,
      showDiagram: diagram.enabled,
      showShortcut: shortcut !== null,
      shortcut,
      showOptionAnalysisCollapsed: true,
      existenceNote: materiallyDependsOnExistencePolicy(proof, input) ? copy.existenceNote : null,
      wordCount: countWords([...reasoning, ...results.map((entry) => `${entry.label} ${entry.follows ? copy.follows : copy.doesNotFollow} ${entry.shortReason ?? ""}`), conclusion]),
    },
    optionAnalysis: wrongOptions(proof, input),
    diagram,
    administratorProof: {
      hiddenByDefault: true,
      structuredProofAuthority: proof.authority,
      identity: proof.identity,
      sourcePatternId: input.sourcePatternId,
      scenarioId: input.scenarioId,
      taskKind: input.taskKind,
      existencePolicy: proof.existencePolicy,
      validationEvidence: proof.validationEvidence,
      humanReview: proof.humanReview,
      normalizedPremises: input.structuredPrompt.premises,
      canonicalConclusions: input.canonicalConclusions,
      premiseIds,
      reasonCodes,
      proofModel: proof.correctOptionProof.proofModel,
      counterModel: proof.correctOptionProof.counterModel,
      alternateModel: proof.diagramSpec.alternateModel,
      termOrder: termOrder(input),
      diagramSpecification: {
        v3: proof.diagramSpec,
        v4Mode: diagram.mode,
      },
      nativeEditorialStatus: "NOT_RUN",
    },
    lifecycle: {
      reviewStatus: "REVISE",
      public: false,
      questionStudioEnabled: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
    },
  };
}
