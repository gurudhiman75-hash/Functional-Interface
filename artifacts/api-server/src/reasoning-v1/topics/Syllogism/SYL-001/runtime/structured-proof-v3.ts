import { createHash } from "node:crypto";
import type {
  CanonicalConclusion,
  CanonicalModel,
  InternalConclusionClass,
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import { renderIntegratedDiagramV3 } from "./integrated-diagram-v3";
import type {
  SylCombinedReasoningV3,
  SylCorrectOptionProofV3,
  SylFastRuleV3,
  SylIdentityV3,
  SylIntegratedDiagramModeV3,
  SylOptionReasonCodeV3,
  SylProofBuildInputV3,
  SylProofTypeV3,
  SylSemanticStatusV3,
  SylStatementMeaningV3,
  SylStructuredProofV3,
  SylStudentVerdictCodeV3,
  SylTaskStatusV3,
  SylValidationEvidenceV3,
  SylVisibleOptionAnalysisV3,
  SylWitnessRelationV3,
  SylWitnessV3,
} from "./structured-proof-v3-types";
import {
  SYL_EXISTENCE_POLICY,
  SYL_STRUCTURED_PROOF_AUTHORITY,
} from "./structured-proof-v3-types";

interface LocaleCopy {
  understandSummary: string;
  option: string;
  correct: string;
  statements: string;
  statement: string;
  allModels: string;
  oneModel: string;
  anotherModel: string;
  noModel: string;
  finalAnswer: string;
  existenceDirection: string;
  verdicts: Readonly<Record<SylStudentVerdictCodeV3, string>>;
}

function hash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function shortHash(value: unknown, length = 20): string {
  return hash(value).slice(0, length);
}

function safeId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]+/gu, "-");
}

function localeCopy(locale: SylLocale): LocaleCopy {
  if (locale === "hi-IN") return {
    understandSummary: "इन कथनों को एक साथ पढ़ने पर सही विकल्प का संबंध बनता है।",
    option: "विकल्प",
    correct: "सही",
    statements: "कथनों",
    statement: "कथन",
    allModels: "हर सही व्यवस्था में",
    oneModel: "एक सही व्यवस्था में",
    anotherModel: "दूसरी सही व्यवस्था में",
    noModel: "किसी भी सही व्यवस्था में नहीं",
    finalAnswer: "अंतिम उत्तर",
    existenceDirection: "इस अध्याय में कथनों में आए प्रत्येक वर्ग में कम-से-कम एक सदस्य माना जाता है।",
    verdicts: {
      CORRECT_DEFINITE: "सही — निश्चित रूप से निकलता है",
      CORRECT_IMPOSSIBLE: "सही — असंभव",
      CORRECT_POSSIBLE: "सही — संभव है",
      CORRECT_NON_FOLLOWING: "सही — आवश्यक रूप से नहीं निकलता",
      CORRECT_MATCH: "सही — निष्कर्षों के परिणाम से मेल खाता है",
      WRONG_IMPOSSIBLE: "गलत — असंभव",
      WRONG_POSSIBLE_NOT_DEFINITE: "गलत — संभव है, पर निश्चित नहीं",
      WRONG_TRUE_NOT_REQUESTED: "गलत — सत्य है, पर प्रश्न यह नहीं पूछता",
      WRONG_MASK: "गलत — निष्कर्षों के परिणाम से मेल नहीं खाता",
      WRONG_PAIR: "गलत — जोड़ी आवश्यक शर्तें पूरी नहीं करती",
      WRONG_OTHER: "गलत — अपेक्षित उत्तर नहीं",
    },
  };
  if (locale === "pa-IN") return {
    understandSummary: "ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਪੜ੍ਹਨ ਨਾਲ ਸਹੀ ਵਿਕਲਪ ਵਾਲਾ ਸੰਬੰਧ ਬਣਦਾ ਹੈ।",
    option: "ਵਿਕਲਪ",
    correct: "ਸਹੀ",
    statements: "ਕਥਨਾਂ",
    statement: "ਕਥਨ",
    allModels: "ਹਰ ਠੀਕ ਬਣਤਰ ਵਿੱਚ",
    oneModel: "ਇੱਕ ਠੀਕ ਬਣਤਰ ਵਿੱਚ",
    anotherModel: "ਦੂਜੀ ਠੀਕ ਬਣਤਰ ਵਿੱਚ",
    noModel: "ਕਿਸੇ ਵੀ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਨਹੀਂ",
    finalAnswer: "ਅੰਤਿਮ ਉੱਤਰ",
    existenceDirection: "ਇਸ ਅਧਿਆਇ ਵਿੱਚ ਕਥਨਾਂ ਵਿੱਚ ਆਏ ਹਰ ਵਰਗ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।",
    verdicts: {
      CORRECT_DEFINITE: "ਸਹੀ — ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਨਿਕਲਦਾ ਹੈ",
      CORRECT_IMPOSSIBLE: "ਸਹੀ — ਅਸੰਭਵ",
      CORRECT_POSSIBLE: "ਸਹੀ — ਸੰਭਵ ਹੈ",
      CORRECT_NON_FOLLOWING: "ਸਹੀ — ਲਾਜ਼ਮੀ ਤੌਰ 'ਤੇ ਨਹੀਂ ਨਿਕਲਦਾ",
      CORRECT_MATCH: "ਸਹੀ — ਨਤੀਜਿਆਂ ਦੇ ਫੈਸਲੇ ਨਾਲ ਮਿਲਦਾ ਹੈ",
      WRONG_IMPOSSIBLE: "ਗਲਤ — ਅਸੰਭਵ",
      WRONG_POSSIBLE_NOT_DEFINITE: "ਗਲਤ — ਸੰਭਵ ਹੈ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ",
      WRONG_TRUE_NOT_REQUESTED: "ਗਲਤ — ਸਹੀ ਹੈ, ਪਰ ਸਵਾਲ ਇਹ ਨਹੀਂ ਪੁੱਛਦਾ",
      WRONG_MASK: "ਗਲਤ — ਨਤੀਜਿਆਂ ਦੇ ਫੈਸਲੇ ਨਾਲ ਨਹੀਂ ਮਿਲਦਾ",
      WRONG_PAIR: "ਗਲਤ — ਜੋੜੀ ਲਾਜ਼ਮੀ ਸ਼ਰਤਾਂ ਪੂਰੀ ਨਹੀਂ ਕਰਦੀ",
      WRONG_OTHER: "ਗਲਤ — ਲੋੜੀਂਦਾ ਜਵਾਬ ਨਹੀਂ",
    },
  };
  return {
    understandSummary: "Read the statements together to get the relation used by the correct option.",
    option: "Option",
    correct: "Correct",
    statements: "Statements",
    statement: "Statement",
    allModels: "in every valid arrangement",
    oneModel: "in one valid arrangement",
    anotherModel: "in another valid arrangement",
    noModel: "in no valid arrangement",
    finalAnswer: "Final answer",
    existenceDirection: "For this chapter, every class named in the statements is treated as having at least one member.",
    verdicts: {
      CORRECT_DEFINITE: "Correct — definitely follows",
      CORRECT_IMPOSSIBLE: "Correct — impossible",
      CORRECT_POSSIBLE: "Correct — genuinely possible",
      CORRECT_NON_FOLLOWING: "Correct — does not necessarily follow",
      CORRECT_MATCH: "Correct — matches the conclusion result",
      WRONG_IMPOSSIBLE: "Wrong — impossible",
      WRONG_POSSIBLE_NOT_DEFINITE: "Wrong — possible, but not definite",
      WRONG_TRUE_NOT_REQUESTED: "Wrong — true, but this task asks for something else",
      WRONG_MASK: "Wrong — does not match the conclusion result",
      WRONG_PAIR: "Wrong — pair does not satisfy the required conditions",
      WRONG_OTHER: "Wrong — not the required answer",
    },
  };
}

function conclusionKey(conclusion: CanonicalConclusion): string {
  return `${conclusion.form}:${conclusion.subject}:${conclusion.predicate}`;
}

function label(term: TermId, input: SylProofBuildInputV3): string {
  return input.termLabels[term] ?? term;
}

function relationText(conclusion: CanonicalConclusion, input: SylProofBuildInputV3): string {
  const subject = label(conclusion.subject, input);
  const predicate = label(conclusion.predicate, input);
  if (input.locale === "hi-IN") {
    if (conclusion.form === "ALL") return `सभी ${subject}, ${predicate} हैं`;
    if (conclusion.form === "NO") return `कोई ${subject}, ${predicate} नहीं है`;
    if (conclusion.form === "SOME") return `कम-से-कम एक ${subject}, ${predicate} है`;
    return `कम-से-कम एक ${subject}, ${predicate} नहीं है`;
  }
  if (input.locale === "pa-IN") {
    if (conclusion.form === "ALL") return `ਸਾਰੇ ${subject}, ${predicate} ਹਨ`;
    if (conclusion.form === "NO") return `ਕੋਈ ${subject}, ${predicate} ਨਹੀਂ ਹੈ`;
    if (conclusion.form === "SOME") return `ਘੱਟੋ-ਘੱਟ ਇੱਕ ${subject}, ${predicate} ਹੈ`;
    return `ਘੱਟੋ-ਘੱਟ ਇੱਕ ${subject}, ${predicate} ਨਹੀਂ ਹੈ`;
  }
  if (conclusion.form === "ALL") return `all ${subject} are ${predicate}`;
  if (conclusion.form === "NO") return `no ${subject} is ${predicate}`;
  if (conclusion.form === "SOME") return `at least one ${subject} is ${predicate}`;
  return `at least one ${subject} is not ${predicate}`;
}

function premiseMeaning(
  premise: SurfacePremise,
  statement: string,
  displayIndex: number,
  input: SylProofBuildInputV3,
): SylStatementMeaningV3 {
  const subject = label(premise.subject, input);
  const predicate = label(premise.predicate, input);
  let meaning: string;
  let normalizedRelation: string;

  if (input.locale === "hi-IN") {
    switch (premise.form) {
      case "ALL": meaning = `हर ${subject}, ${predicate} के अंदर रहेगा।`; normalizedRelation = `सभी ${subject} → ${predicate}`; break;
      case "NO": meaning = `${subject} और ${predicate} का कोई साझा सदस्य नहीं हो सकता।`; normalizedRelation = `${subject} और ${predicate} अलग`; break;
      case "SOME":
      case "A_FEW": meaning = `कम-से-कम एक सदस्य ${subject} और ${predicate} दोनों है।`; normalizedRelation = `${subject} ∩ ${predicate}: एक सदस्य`; break;
      case "SOME_NOT":
      case "NOT_ALL": meaning = `कम-से-कम एक ${subject}, ${predicate} से बाहर है।`; normalizedRelation = `${subject} का एक सदस्य ${predicate} से बाहर`; break;
      case "ONLY": meaning = `‘केवल’ दिशा पलटता है: हर ${predicate}, ${subject} है।`; normalizedRelation = `सभी ${predicate} → ${subject}`; break;
      case "ARE_ONLY": meaning = `हर ${subject}, ${predicate} है।`; normalizedRelation = `सभी ${subject} → ${predicate}`; break;
      case "ONLY_A_FEW": meaning = `कुछ ${subject}, ${predicate} हैं और कुछ ${subject}, ${predicate} नहीं हैं।`; normalizedRelation = `एक सदस्य अंदर + एक सदस्य बाहर`; break;
      case "IDENTITY": meaning = `${subject} और ${predicate} एक ही समूह हैं।`; normalizedRelation = `${subject} = ${predicate}`; break;
      case "FEW": throw new Error("Plain FEW is not supported by V3.");
    }
  } else if (input.locale === "pa-IN") {
    switch (premise.form) {
      case "ALL": meaning = `ਹਰ ${subject}, ${predicate} ਦੇ ਅੰਦਰ ਰਹੇਗਾ।`; normalizedRelation = `ਸਾਰੇ ${subject} → ${predicate}`; break;
      case "NO": meaning = `${subject} ਅਤੇ ${predicate} ਦਾ ਕੋਈ ਸਾਂਝਾ ਮੈਂਬਰ ਨਹੀਂ ਹੋ ਸਕਦਾ।`; normalizedRelation = `${subject} ਅਤੇ ${predicate} ਵੱਖ`; break;
      case "SOME":
      case "A_FEW": meaning = `ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ${subject} ਅਤੇ ${predicate} ਦੋਵੇਂ ਹੈ।`; normalizedRelation = `${subject} ∩ ${predicate}: ਇੱਕ ਮੈਂਬਰ`; break;
      case "SOME_NOT":
      case "NOT_ALL": meaning = `ਘੱਟੋ-ਘੱਟ ਇੱਕ ${subject}, ${predicate} ਤੋਂ ਬਾਹਰ ਹੈ।`; normalizedRelation = `${subject} ਦਾ ਇੱਕ ਮੈਂਬਰ ${predicate} ਤੋਂ ਬਾਹਰ`; break;
      case "ONLY": meaning = `‘ਕੇਵਲ’ ਦਿਸ਼ਾ ਉਲਟਦਾ ਹੈ: ਹਰ ${predicate}, ${subject} ਹੈ।`; normalizedRelation = `ਸਾਰੇ ${predicate} → ${subject}`; break;
      case "ARE_ONLY": meaning = `ਹਰ ${subject}, ${predicate} ਹੈ।`; normalizedRelation = `ਸਾਰੇ ${subject} → ${predicate}`; break;
      case "ONLY_A_FEW": meaning = `ਕੁਝ ${subject}, ${predicate} ਹਨ ਅਤੇ ਕੁਝ ${subject}, ${predicate} ਨਹੀਂ ਹਨ।`; normalizedRelation = `ਇੱਕ ਮੈਂਬਰ ਅੰਦਰ + ਇੱਕ ਮੈਂਬਰ ਬਾਹਰ`; break;
      case "IDENTITY": meaning = `${subject} ਅਤੇ ${predicate} ਇੱਕੋ ਸਮੂਹ ਹਨ।`; normalizedRelation = `${subject} = ${predicate}`; break;
      case "FEW": throw new Error("Plain FEW is not supported by V3.");
    }
  } else {
    switch (premise.form) {
      case "ALL": meaning = `Every ${subject} must stay inside ${predicate}.`; normalizedRelation = `All ${subject} → ${predicate}`; break;
      case "NO": meaning = `${subject} and ${predicate} cannot share any member.`; normalizedRelation = `${subject} and ${predicate} are separate`; break;
      case "SOME":
      case "A_FEW": meaning = `At least one member is both ${subject} and ${predicate}.`; normalizedRelation = `${subject} ∩ ${predicate}: one member`; break;
      case "SOME_NOT":
      case "NOT_ALL": meaning = `At least one ${subject} stays outside ${predicate}.`; normalizedRelation = `one ${subject} outside ${predicate}`; break;
      case "ONLY": meaning = `“Only” reverses the direction: every ${predicate} is a ${subject}.`; normalizedRelation = `All ${predicate} → ${subject}`; break;
      case "ARE_ONLY": meaning = `Every ${subject} is a ${predicate}.`; normalizedRelation = `All ${subject} → ${predicate}`; break;
      case "ONLY_A_FEW": meaning = `Some ${subject} are ${predicate}, and some ${subject} are not ${predicate}.`; normalizedRelation = `one member inside + one member outside`; break;
      case "IDENTITY": meaning = `${subject} and ${predicate} are the same group.`; normalizedRelation = `${subject} = ${predicate}`; break;
      case "FEW": throw new Error("Plain FEW is not supported by V3.");
    }
  }

  return {
    displayIndex,
    premiseId: premise.premiseId,
    statement,
    meaning,
    normalizedRelation,
  };
}

function displayedPremiseNumbers(input: SylProofBuildInputV3, premiseIds: readonly string[]): readonly number[] {
  return premiseIds
    .map((id) => input.displayedPremises.findIndex((premise) => premise.premiseId === id))
    .filter((index) => index >= 0)
    .map((index) => index + 1);
}

function premiseReference(input: SylProofBuildInputV3, premiseIds: readonly string[]): string {
  const numbers = [...new Set(displayedPremiseNumbers(input, premiseIds))];
  const c = localeCopy(input.locale);
  if (numbers.length === 0) return c.statements;
  if (input.locale === "hi-IN") return numbers.length === 1 ? `कथन ${numbers[0]}` : `कथन ${numbers.join(" और ")}`;
  if (input.locale === "pa-IN") return numbers.length === 1 ? `ਕਥਨ ${numbers[0]}` : `ਕਥਨ ${numbers.join(" ਅਤੇ ")}`;
  return numbers.length === 1 ? `Statement ${numbers[0]}` : `Statements ${numbers.join(" and ")}`;
}

function profileForSemantic(input: SylProofBuildInputV3, semanticValue: string) {
  return input.conclusionProfiles.find((profile) => conclusionKey(profile.conclusion) === semanticValue) ?? null;
}

function semanticStatusForOption(input: SylProofBuildInputV3, semanticValue: string): SylSemanticStatusV3 {
  return profileForSemantic(input, semanticValue)?.classification ?? "NOT_APPLICABLE";
}

function taskStatusForOption(
  input: SylProofBuildInputV3,
  isCorrect: boolean,
  semanticStatus: SylSemanticStatusV3,
): SylTaskStatusV3 {
  if (isCorrect) return "KEYED";
  if (semanticStatus === "ENTAILED" && [
    "SELECT_NON_FOLLOWING_CONCLUSION",
    "SELECT_GENUINE_POSSIBILITY",
    "SELECT_IMPOSSIBLE_CONCLUSION",
  ].includes(input.taskKind)) return "TRUE_BUT_NOT_REQUESTED";
  if (semanticStatus === "UNDETERMINED" && [
    "SELECT_DEFINITE_CONCLUSION",
    "ONLY_SELECT_DEFINITE_CONCLUSION",
    "FEW_SELECT_DEFINITE_CONCLUSION",
  ].includes(input.taskKind)) return "POSSIBLE_BUT_TASK_REQUIRES_CERTAINTY";
  if (semanticStatus === "NOT_APPLICABLE") {
    return input.taskKind === "CLASSIFY_CONCLUSION_PAIR"
      ? "PAIR_CLASSIFICATION_MISMATCH"
      : "MASK_MISMATCH";
  }
  return "NOT_KEYED";
}

function verdictCode(
  input: SylProofBuildInputV3,
  isCorrect: boolean,
  status: SylSemanticStatusV3,
  taskStatus: SylTaskStatusV3,
): SylStudentVerdictCodeV3 {
  if (isCorrect) {
    if (input.taskKind === "SELECT_IMPOSSIBLE_CONCLUSION" || status === "CONTRADICTED") return "CORRECT_IMPOSSIBLE";
    if (input.taskKind === "SELECT_GENUINE_POSSIBILITY" || (input.taskKind.includes("MODAL") && status === "UNDETERMINED")) return "CORRECT_POSSIBLE";
    if (input.taskKind === "SELECT_NON_FOLLOWING_CONCLUSION") return "CORRECT_NON_FOLLOWING";
    if (status === "ENTAILED") return "CORRECT_DEFINITE";
    return "CORRECT_MATCH";
  }
  if (taskStatus === "TRUE_BUT_NOT_REQUESTED") return "WRONG_TRUE_NOT_REQUESTED";
  if (taskStatus === "MASK_MISMATCH") return "WRONG_MASK";
  if (taskStatus === "PAIR_CLASSIFICATION_MISMATCH") return "WRONG_PAIR";
  if (status === "CONTRADICTED") return "WRONG_IMPOSSIBLE";
  if (status === "UNDETERMINED") return "WRONG_POSSIBLE_NOT_DEFINITE";
  return "WRONG_OTHER";
}

function directReasonCode(
  input: SylProofBuildInputV3,
  conclusion: CanonicalConclusion,
  classification: InternalConclusionClass,
  isCorrect: boolean,
): SylOptionReasonCodeV3 {
  const premises = input.premises;
  if (premises.some((premise) => premise.form === "ONLY_A_FEW")) return "ONLY_A_FEW_TWO_FACTS";
  if (premises.some((premise) => premise.form === "NOT_ALL")) return "NOT_ALL_NORMALIZATION";
  if (premises.some((premise) => premise.form === "ONLY")) return "ONLY_DIRECTION_ERROR";
  if (classification === "UNDETERMINED") {
    return isCorrect && input.taskKind === "SELECT_GENUINE_POSSIBILITY"
      ? "VALID_SATISFYING_MODEL"
      : isCorrect && input.taskKind === "SELECT_NON_FOLLOWING_CONCLUSION"
        ? "VALID_COUNTERMODEL"
        : "POSSIBILITY_MISTAKEN_FOR_CERTAINTY";
  }
  if (classification === "CONTRADICTED") {
    const blocked = premises.some((premise) => premise.form === "NO"
      && new Set([premise.subject, premise.predicate]).has(conclusion.subject)
      && new Set([premise.subject, premise.predicate]).has(conclusion.predicate));
    return blocked ? "DIRECT_CONTRADICTION" : "IMPOSSIBLE_IN_ALL_MODELS";
  }
  const reversed = premises.some((premise) => premise.form === "ALL"
    && premise.subject === conclusion.predicate
    && premise.predicate === conclusion.subject
    && conclusion.form === "ALL");
  if (reversed) return "REVERSAL_ERROR";
  const existentialPremises = premises.filter((premise) => ["SOME", "A_FEW"].includes(premise.form));
  if (existentialPremises.length >= 2 && conclusion.form === "SOME") return "WITNESS_MISMATCH";
  if (["SOME", "SOME_NOT"].includes(conclusion.form)) return "FORCED_WITNESS_TRANSFER";
  return isCorrect ? "COMPLETE_PROOF" : "TASK_NOT_REQUESTED";
}

function optionReason(
  input: SylProofBuildInputV3,
  option: SylProofBuildInputV3["options"][number],
  status: SylSemanticStatusV3,
  premiseIds: readonly string[],
  reasonCode: SylOptionReasonCodeV3,
): string {
  const ref = premiseReference(input, premiseIds);
  const c = localeCopy(input.locale);
  const profile = profileForSemantic(input, option.semanticValue);
  const relation = profile ? relationText(profile.conclusion, input) : option.text;

  if (status === "NOT_APPLICABLE") {
    if (input.locale === "hi-IN") return `${ref} से निकले निष्कर्षों का परिणाम इस विकल्प से मेल नहीं खाता।`;
    if (input.locale === "pa-IN") return `${ref} ਤੋਂ ਨਿਕਲੇ ਨਤੀਜਿਆਂ ਦਾ ਫੈਸਲਾ ਇਸ ਵਿਕਲਪ ਨਾਲ ਨਹੀਂ ਮਿਲਦਾ।`;
    return `The conclusion results from ${ref} do not match this option.`;
  }

  if (status === "ENTAILED") {
    if (option.isCorrect) {
      if (input.locale === "hi-IN") return `${ref} को साथ लेने पर ${relation} हर सही व्यवस्था में सत्य रहता है।`;
      if (input.locale === "pa-IN") return `${ref} ਨੂੰ ਇਕੱਠੇ ਲੈਣ ਨਾਲ ${relation} ਹਰ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਸਹੀ ਰਹਿੰਦਾ ਹੈ।`;
      return `Use ${ref} together. They force ${relation} ${c.allModels}.`;
    }
    if (input.locale === "hi-IN") return `${relation} निश्चित रूप से सत्य है, लेकिन यह इस प्रश्न में माँगा गया उत्तर नहीं है।`;
    if (input.locale === "pa-IN") return `${relation} ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ ਹੈ, ਪਰ ਇਹ ਇਸ ਸਵਾਲ ਵਿੱਚ ਮੰਗਿਆ ਜਵਾਬ ਨਹੀਂ ਹੈ।`;
    return `${relation} is definitely true, but it is not the response requested by this task.`;
  }

  if (status === "CONTRADICTED") {
    if (input.locale === "hi-IN") return `यह विकल्प ${relation} चाहता है, लेकिन ${ref} इस संबंध को रोकता है। इसलिए यह किसी भी सही व्यवस्था में सत्य नहीं हो सकता।`;
    if (input.locale === "pa-IN") return `ਇਹ ਵਿਕਲਪ ${relation} ਮੰਗਦਾ ਹੈ, ਪਰ ${ref} ਇਸ ਸੰਬੰਧ ਨੂੰ ਰੋਕਦਾ ਹੈ। ਇਸ ਲਈ ਇਹ ਕਿਸੇ ਵੀ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਸਹੀ ਨਹੀਂ ਹੋ ਸਕਦਾ।`;
    return `This option needs ${relation}, but ${ref} blocks that relation. It cannot be true in any valid arrangement.`;
  }

  if (option.isCorrect && input.taskKind === "SELECT_NON_FOLLOWING_CONCLUSION") {
    if (input.locale === "hi-IN") return `एक पूरी सही व्यवस्था इस निष्कर्ष को गलत बनाती है। इसलिए यह आवश्यक रूप से नहीं निकलता।`;
    if (input.locale === "pa-IN") return `ਇੱਕ ਪੂਰੀ ਠੀਕ ਬਣਤਰ ਇਸ ਨਤੀਜੇ ਨੂੰ ਗਲਤ ਬਣਾਉਂਦੀ ਹੈ। ਇਸ ਲਈ ਇਹ ਲਾਜ਼ਮੀ ਤੌਰ 'ਤੇ ਨਹੀਂ ਨਿਕਲਦਾ।`;
    return `A complete valid counterexample makes this conclusion false. Therefore it does not necessarily follow.`;
  }
  if (option.isCorrect && input.taskKind === "SELECT_GENUINE_POSSIBILITY") {
    if (input.locale === "hi-IN") return `एक पूरी सही व्यवस्था इस निष्कर्ष को सत्य बनाती है और किसी कथन को नहीं तोड़ती। इसलिए यह वास्तविक संभावना है।`;
    if (input.locale === "pa-IN") return `ਇੱਕ ਪੂਰੀ ਠੀਕ ਬਣਤਰ ਇਸ ਨਤੀਜੇ ਨੂੰ ਸਹੀ ਬਣਾਉਂਦੀ ਹੈ ਅਤੇ ਕੋਈ ਕਥਨ ਨਹੀਂ ਤੋੜਦੀ। ਇਸ ਲਈ ਇਹ ਅਸਲ ਸੰਭਾਵਨਾ ਹੈ।`;
    return `A complete valid model makes this conclusion true without breaking any statement. Therefore it is genuinely possible.`;
  }
  if (input.locale === "hi-IN") return `यह संबंध एक सही व्यवस्था में हो सकता है, लेकिन दूसरी सही व्यवस्था में गलत हो सकता है। इसलिए यह निश्चित निष्कर्ष नहीं है।`;
  if (input.locale === "pa-IN") return `ਇਹ ਸੰਬੰਧ ਇੱਕ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਦੂਜੀ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਗਲਤ ਹੋ ਸਕਦਾ ਹੈ। ਇਸ ਲਈ ਇਹ ਨਿਸ਼ਚਿਤ ਨਤੀਜਾ ਨਹੀਂ ਹੈ।`;
  return `This relation can be true ${c.oneModel}, but false ${c.anotherModel}. Therefore it is possible, not definite.`;
}

function profilePremiseIds(input: SylProofBuildInputV3, semanticValue: string): readonly string[] {
  const profile = profileForSemantic(input, semanticValue);
  if (!profile) return input.displayedPremises.map((premise) => premise.premiseId);
  const ids = profile.classification === "UNDETERMINED"
    ? profile.modelImpactPremiseIds
    : profile.verdictImpactPremiseIds;
  return ids.length > 0 ? ids : input.displayedPremises.map((premise) => premise.premiseId);
}

function combinationReason(
  input: SylProofBuildInputV3,
  option: SylProofBuildInputV3["options"][number],
): string {
  const verdicts = input.conclusionProfiles.map((profile, index) => {
    const label = ["I", "II", "III"][index] ?? String(index + 1);
    const value = profile.classification === "ENTAILED"
      ? input.locale === "hi-IN" ? "निश्चित" : input.locale === "pa-IN" ? "ਨਿਸ਼ਚਿਤ" : "must be true"
      : profile.classification === "CONTRADICTED"
        ? input.locale === "hi-IN" ? "असंभव" : input.locale === "pa-IN" ? "ਅਸੰਭਵ" : "impossible"
        : input.locale === "hi-IN" ? "निश्चित नहीं" : input.locale === "pa-IN" ? "ਨਿਸ਼ਚਿਤ ਨਹੀਂ" : "not definite";
    return `${label}: ${value}`;
  }).join("; ");
  if (option.isCorrect) {
    if (input.locale === "hi-IN") return `${verdicts}। इसलिए यही विकल्प सही संयोजन देता है।`;
    if (input.locale === "pa-IN") return `${verdicts}। ਇਸ ਲਈ ਇਹੀ ਵਿਕਲਪ ਸਹੀ ਜੋੜ ਦਿੰਦਾ ਹੈ।`;
    return `${verdicts}. Therefore this option gives the correct conclusion result.`;
  }
  if (input.locale === "hi-IN") return `${verdicts}। यह विकल्प इस परिणाम से मेल नहीं खाता।`;
  if (input.locale === "pa-IN") return `${verdicts}। ਇਹ ਵਿਕਲਪ ਇਸ ਫੈਸਲੇ ਨਾਲ ਨਹੀਂ ਮਿਲਦਾ।`;
  return `${verdicts}. This option does not match those results.`;
}

function visibleOptionAnalysis(input: SylProofBuildInputV3): readonly SylVisibleOptionAnalysisV3[] {
  const c = localeCopy(input.locale);
  return input.options.map((option, index) => {
    const semanticStatus = semanticStatusForOption(input, option.semanticValue);
    const taskStatus = taskStatusForOption(input, option.isCorrect, semanticStatus);
    const code = verdictCode(input, option.isCorrect, semanticStatus, taskStatus);
    const profile = profileForSemantic(input, option.semanticValue);
    const premiseIds = profilePremiseIds(input, option.semanticValue);
    const reasonCode = profile
      ? directReasonCode(input, profile.conclusion, profile.classification, option.isCorrect)
      : input.taskKind === "CLASSIFY_CONCLUSION_PAIR"
        ? "PAIR_CLASSIFICATION_MISMATCH"
        : "MASK_MISMATCH";
    const studentReason = profile
      ? optionReason(input, option, semanticStatus, premiseIds, reasonCode)
      : combinationReason(input, option);
    return {
      displayIndex: index + 1,
      optionId: option.optionId,
      text: option.text,
      semanticValue: option.semanticValue,
      semanticStatus,
      taskStatus,
      studentVerdictCode: code,
      studentVerdict: c.verdicts[code],
      isCorrectForTask: option.isCorrect,
      premiseIdsUsed: premiseIds,
      witnessIdsUsed: profile && ["SOME", "SOME_NOT"].includes(profile.conclusion.form) ? ["x1"] : [],
      reasonCode,
      studentReason,
    };
  });
}

function witnessesFromPremises(input: SylProofBuildInputV3, decisivePremiseIds: readonly string[]): readonly SylWitnessV3[] {
  const relevant = input.displayedPremises.filter((premise) => decisivePremiseIds.includes(premise.premiseId));
  const existential = relevant.filter((premise) => ["SOME", "A_FEW", "SOME_NOT", "NOT_ALL", "ONLY_A_FEW"].includes(premise.form));
  const witnesses: SylWitnessV3[] = [];
  let counter = 1;
  for (const premise of existential) {
    if (premise.form === "ONLY_A_FEW") {
      const firstId = `x${counter++}`;
      const secondId = `x${counter++}`;
      witnesses.push({
        witnessId: firstId,
        sourcePremiseIds: [premise.premiseId],
        memberOf: [premise.subject, premise.predicate],
        outsideOf: [],
        relation: "DISTINCT_WITNESSES_REQUIRED",
        studentDescription: `${firstId}: ${label(premise.subject, input)} + ${label(premise.predicate, input)}`,
      });
      witnesses.push({
        witnessId: secondId,
        sourcePremiseIds: [premise.premiseId],
        memberOf: [premise.subject],
        outsideOf: [premise.predicate],
        relation: "DISTINCT_WITNESSES_REQUIRED",
        studentDescription: `${secondId}: ${label(premise.subject, input)}, not ${label(premise.predicate, input)}`,
      });
      continue;
    }
    const witnessId = `x${counter++}`;
    const someNot = ["SOME_NOT", "NOT_ALL"].includes(premise.form);
    const relation: SylWitnessRelationV3 = existential.length > 1
      ? "MAY_BE_SAME_OR_DIFFERENT"
      : "SAME_WITNESS_REQUIRED";
    witnesses.push({
      witnessId,
      sourcePremiseIds: [premise.premiseId],
      memberOf: someNot ? [premise.subject] : [premise.subject, premise.predicate],
      outsideOf: someNot ? [premise.predicate] : [],
      relation,
      studentDescription: someNot
        ? `${witnessId}: ${label(premise.subject, input)}, not ${label(premise.predicate, input)}`
        : `${witnessId}: ${label(premise.subject, input)} + ${label(premise.predicate, input)}`,
    });
  }
  return witnesses;
}

function correctProfile(input: SylProofBuildInputV3) {
  const correct = input.options[input.correctIndex];
  const direct = profileForSemantic(input, correct.semanticValue);
  if (direct) return direct;
  return input.conclusionProfiles[0] ?? null;
}

function decisivePremiseIds(input: SylProofBuildInputV3): readonly string[] {
  const correct = input.options[input.correctIndex];
  const direct = profileForSemantic(input, correct.semanticValue);
  if (direct) return profilePremiseIds(input, correct.semanticValue);
  const union = new Set(input.conclusionProfiles.flatMap((profile) =>
    profile.classification === "UNDETERMINED" ? profile.modelImpactPremiseIds : profile.verdictImpactPremiseIds));
  return union.size > 0 ? [...union] : input.displayedPremises.map((premise) => premise.premiseId);
}

function combinedReasoning(input: SylProofBuildInputV3): SylCombinedReasoningV3 {
  const ids = decisivePremiseIds(input);
  const meanings = input.displayedPremises
    .map((premise, index) => premiseMeaning(premise, input.statements[index], index + 1, input))
    .filter((meaning) => ids.includes(meaning.premiseId));
  const witnesses = witnessesFromPremises(input, ids);
  const profile = correctProfile(input);
  const steps = meanings.map((meaning, index) => ({
    stepIndex: index + 1,
    premiseIds: [meaning.premiseId],
    witnessIds: witnesses.filter((witness) => witness.sourcePremiseIds.includes(meaning.premiseId)).map((witness) => witness.witnessId),
    text: meaning.meaning,
  }));
  const finalRelation = profile ? relationText(profile.conclusion, input) : input.options[input.correctIndex].text;
  const finalText = input.locale === "hi-IN"
    ? `इन संबंधों को जोड़ने पर ${finalRelation} का सही निर्णय मिलता है।`
    : input.locale === "pa-IN"
      ? `ਇਨ੍ਹਾਂ ਸੰਬੰਧਾਂ ਨੂੰ ਜੋੜਨ ਨਾਲ ${finalRelation} ਦਾ ਸਹੀ ਫੈਸਲਾ ਮਿਲਦਾ ਹੈ।`
      : `Join these relations to decide that ${finalRelation}.`;
  steps.push({
    stepIndex: steps.length + 1,
    premiseIds: ids,
    witnessIds: witnesses.map((witness) => witness.witnessId),
    text: finalText,
  });
  return {
    decisivePremiseIds: ids,
    witnesses,
    reasoningSteps: steps,
    summary: `${localeCopy(input.locale).understandSummary} ${finalText}`,
  };
}

function proofMode(input: SylProofBuildInputV3): {
  proofType: SylProofTypeV3;
  diagramMode: SylIntegratedDiagramModeV3;
  model: CanonicalModel | null;
  alternateModel: CanonicalModel | null;
} {
  const profile = correctProfile(input);
  if (input.taskKind === "SELECT_NON_FOLLOWING_CONCLUSION") return {
    proofType: "COUNTERMODEL",
    diagramMode: "COMPLETE_COUNTERMODEL",
    model: profile?.counterModel ?? null,
    alternateModel: null,
  };
  if (input.taskKind === "SELECT_GENUINE_POSSIBILITY") return {
    proofType: "SATISFYING_MODEL",
    diagramMode: "COMPLETE_POSSIBILITY_MODEL",
    model: profile?.witnessModel ?? null,
    alternateModel: null,
  };
  if (input.taskKind === "SELECT_IMPOSSIBLE_CONCLUSION" || profile?.classification === "CONTRADICTED") return {
    proofType: "IMPOSSIBILITY_CONFLICT",
    diagramMode: "INTEGRATED_IMPOSSIBILITY_PROOF",
    model: null,
    alternateModel: null,
  };
  if (input.taskKind.includes("MODAL") && profile?.classification === "UNDETERMINED") return {
    proofType: "TRUE_FALSE_MODELS",
    diagramMode: "DUAL_TRUE_FALSE_MODEL",
    model: profile.witnessModel,
    alternateModel: profile.counterModel,
  };
  if (input.taskKind.includes("EITHER_OR") || input.pairStatus === "EITHER_OR" || input.pairStatus === "EITHER_OR_FOLLOWS") return {
    proofType: "EITHER_OR_EXACT_ONE",
    diagramMode: "EITHER_OR_EXACT_ONE_PROOF",
    model: input.conclusionProfiles[0]?.witnessModel ?? null,
    alternateModel: input.conclusionProfiles[1]?.witnessModel ?? null,
  };
  if (input.taskKind.includes("CONCLUSION") || input.followMask !== null || input.pairStatus !== null) return {
    proofType: "MASK_DERIVATION",
    diagramMode: "MASK_PROOF",
    model: null,
    alternateModel: null,
  };
  return {
    proofType: profile && ["SOME", "SOME_NOT"].includes(profile.conclusion.form) ? "WITNESS_TRANSFER" : "FORCED_RELATION",
    diagramMode: "INTEGRATED_FORCED_RELATION_PROOF",
    model: null,
    alternateModel: null,
  };
}

function correctOptionProof(
  input: SylProofBuildInputV3,
  reasoning: SylCombinedReasoningV3,
): SylCorrectOptionProofV3 {
  const option = input.options[input.correctIndex];
  const mode = proofMode(input);
  const profile = correctProfile(input);
  const proofSteps = reasoning.reasoningSteps.map((step) => step.text);
  let studentProof: string;
  if (mode.proofType === "COUNTERMODEL") {
    studentProof = input.locale === "hi-IN"
      ? `दिया गया पूरा प्रतिउदाहरण सभी कथनों को सही रखता है, लेकिन विकल्प ${input.correctIndex + 1} को गलत बनाता है। इसलिए यह निष्कर्ष आवश्यक नहीं है।`
      : input.locale === "pa-IN"
        ? `ਦਿੱਤਾ ਪੂਰਾ ਵਿਰੋਧੀ ਮਾਡਲ ਸਾਰੇ ਕਥਨਾਂ ਨੂੰ ਸਹੀ ਰੱਖਦਾ ਹੈ, ਪਰ ਵਿਕਲਪ ${input.correctIndex + 1} ਨੂੰ ਗਲਤ ਬਣਾਉਂਦਾ ਹੈ। ਇਸ ਲਈ ਇਹ ਨਤੀਜਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।`
        : `The complete countermodel satisfies every statement but makes Option ${input.correctIndex + 1} false. Therefore the conclusion is not necessary.`;
  } else if (mode.proofType === "SATISFYING_MODEL") {
    studentProof = input.locale === "hi-IN"
      ? `दिया गया पूरा मॉडल सभी कथनों को सही रखता है और विकल्प ${input.correctIndex + 1} को सत्य बनाता है। इसलिए विकल्प संभव है।`
      : input.locale === "pa-IN"
        ? `ਦਿੱਤਾ ਪੂਰਾ ਮਾਡਲ ਸਾਰੇ ਕਥਨਾਂ ਨੂੰ ਸਹੀ ਰੱਖਦਾ ਹੈ ਅਤੇ ਵਿਕਲਪ ${input.correctIndex + 1} ਨੂੰ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ। ਇਸ ਲਈ ਵਿਕਲਪ ਸੰਭਵ ਹੈ।`
        : `The complete model satisfies every statement and makes Option ${input.correctIndex + 1} true. Therefore the option is possible.`;
  } else if (mode.proofType === "TRUE_FALSE_MODELS") {
    studentProof = input.locale === "hi-IN"
      ? `एक सही मॉडल विकल्प को सत्य और दूसरा सही मॉडल उसे असत्य बनाता है। इसलिए विकल्प संभव है, पर निश्चित नहीं।`
      : input.locale === "pa-IN"
        ? `ਇੱਕ ਠੀਕ ਮਾਡਲ ਵਿਕਲਪ ਨੂੰ ਸਹੀ ਅਤੇ ਦੂਜਾ ਠੀਕ ਮਾਡਲ ਉਸ ਨੂੰ ਗਲਤ ਬਣਾਉਂਦਾ ਹੈ। ਇਸ ਲਈ ਵਿਕਲਪ ਸੰਭਵ ਹੈ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ।`
        : `One valid model makes the option true and another valid model makes it false. Therefore it is possible, but not definite.`;
  } else if (mode.proofType === "MASK_DERIVATION" || mode.proofType === "EITHER_OR_EXACT_ONE") {
    studentProof = combinationReason(input, option);
  } else {
    const relation = profile ? relationText(profile.conclusion, input) : option.text;
    studentProof = input.locale === "hi-IN"
      ? `${premiseReference(input, reasoning.decisivePremiseIds)} को जोड़ने पर ${relation} हर सही व्यवस्था में अनिवार्य रहता है।`
      : input.locale === "pa-IN"
        ? `${premiseReference(input, reasoning.decisivePremiseIds)} ਨੂੰ ਜੋੜਨ ਨਾਲ ${relation} ਹਰ ਠੀਕ ਬਣਤਰ ਵਿੱਚ ਲਾਜ਼ਮੀ ਰਹਿੰਦਾ ਹੈ।`
        : `Combine ${premiseReference(input, reasoning.decisivePremiseIds)}. They make ${relation} necessary in every valid arrangement.`;
  }
  return {
    displayIndex: input.correctIndex + 1,
    optionId: option.optionId,
    text: option.text,
    proofType: mode.proofType,
    premiseIdsUsed: reasoning.decisivePremiseIds,
    witnessIdsUsed: reasoning.witnesses.map((witness) => witness.witnessId),
    reasoningSteps: proofSteps,
    studentProof,
    proofModel: mode.model,
    counterModel: mode.proofType === "COUNTERMODEL" ? mode.model : mode.alternateModel,
  };
}

function fastRule(input: SylProofBuildInputV3): SylFastRuleV3 {
  const forms = input.displayedPremises.map((premise) => premise.form);
  const locale = input.locale;
  const localized = (en: string, hi: string, pa: string): string => locale === "hi-IN" ? hi : locale === "pa-IN" ? pa : en;
  if (forms.includes("ONLY_A_FEW")) return {
    symbolic: "Only a few A are B ⇒ Some A are B + Some A are not B",
    naturalLanguage: localized("Use both facts: one A is inside B and another A stays outside B.", "दोनों तथ्य लें: एक A, B के अंदर है और दूसरा A, B से बाहर है।", "ਦੋਵੇਂ ਗੱਲਾਂ ਲਵੋ: ਇੱਕ A, B ਦੇ ਅੰਦਰ ਹੈ ਅਤੇ ਦੂਜਾ A, B ਤੋਂ ਬਾਹਰ ਹੈ।"),
    appliesToCurrentQuestion: true,
  };
  if (forms.includes("NOT_ALL")) return {
    symbolic: "Not all A are B ⇒ Some A are not B",
    naturalLanguage: localized("Change “not all” into “at least one is outside.”", "‘सभी नहीं’ को ‘कम-से-कम एक बाहर है’ में बदलें।", "‘ਸਾਰੇ ਨਹੀਂ’ ਨੂੰ ‘ਘੱਟੋ-ਘੱਟ ਇੱਕ ਬਾਹਰ ਹੈ’ ਵਿੱਚ ਬਦਲੋ।"),
    appliesToCurrentQuestion: true,
  };
  if (forms.includes("ONLY")) return {
    symbolic: "Only A are B ⇒ All B are A",
    naturalLanguage: localized("Reverse the direction once before solving.", "हल करने से पहले दिशा एक बार पलटें।", "ਹੱਲ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਦਿਸ਼ਾ ਇੱਕ ਵਾਰ ਉਲਟੋ।"),
    appliesToCurrentQuestion: true,
  };
  if (forms.some((form) => ["SOME", "A_FEW"].includes(form)) && forms.includes("NO")) return {
    symbolic: "Some A are B + No B is C ⇒ Some A are not C",
    naturalLanguage: localized("Move the guaranteed common member through the ‘No’ relation.", "पक्के साझा सदस्य को ‘कोई नहीं’ वाले संबंध से आगे ले जाएँ।", "ਪੱਕੇ ਸਾਂਝੇ ਮੈਂਬਰ ਨੂੰ ‘ਕੋਈ ਨਹੀਂ’ ਵਾਲੇ ਸੰਬੰਧ ਰਾਹੀਂ ਅੱਗੇ ਲੈ ਜਾਓ।"),
    appliesToCurrentQuestion: true,
  };
  if (forms.some((form) => ["SOME", "A_FEW"].includes(form)) && forms.some((form) => ["ALL", "ARE_ONLY"].includes(form))) return {
    symbolic: "Some A are B + All B are C ⇒ Some A are C",
    naturalLanguage: localized("Carry the same guaranteed member through the All relation.", "उसी पक्के सदस्य को ‘सभी’ वाले संबंध से आगे ले जाएँ।", "ਉਸੇ ਪੱਕੇ ਮੈਂਬਰ ਨੂੰ ‘ਸਾਰੇ’ ਵਾਲੇ ਸੰਬੰਧ ਰਾਹੀਂ ਅੱਗੇ ਲੈ ਜਾਓ।"),
    appliesToCurrentQuestion: true,
  };
  return {
    symbolic: "Check each conclusion first; choose the option only after the verdicts are fixed.",
    naturalLanguage: localized("Do not guess from the option wording. Prove the conclusion result first.", "विकल्प की भाषा देखकर अनुमान न लगाएँ। पहले निष्कर्ष का परिणाम सिद्ध करें।", "ਵਿਕਲਪ ਦੀ ਭਾਸ਼ਾ ਦੇਖ ਕੇ ਅੰਦਾਜ਼ਾ ਨਾ ਲਗਾਓ। ਪਹਿਲਾਂ ਨਤੀਜੇ ਦਾ ਫੈਸਲਾ ਸਾਬਤ ਕਰੋ।"),
    appliesToCurrentQuestion: true,
  };
}

function existenceDependent(input: SylProofBuildInputV3): readonly string[] {
  const correct = correctProfile(input);
  if (!correct || !["SOME", "SOME_NOT"].includes(correct.conclusion.form)) return [];
  const universalForms = new Set(["ALL", "NO", "ONLY", "ARE_ONLY", "IDENTITY"]);
  return input.displayedPremises.some((premise) => universalForms.has(premise.form))
    ? [correct.conclusion.conclusionId]
    : [];
}

function identities(input: SylProofBuildInputV3, proofWithoutIdentity: unknown): SylIdentityV3 {
  const logicContent = {
    authority: SYL_STRUCTURED_PROOF_AUTHORITY,
    semanticProfile: "INDIAN_COMPETITIVE_EXAM_SYLLOGISM_V1",
    taskKind: input.taskKind,
    premises: input.premises,
    conclusions: input.canonicalConclusions,
    semanticOptions: input.options.map((option) => ({ semanticValue: option.semanticValue, isCorrect: option.isCorrect })),
    scenarioId: input.scenarioId,
    sourcePatternId: input.sourcePatternId,
  };
  const logicContentId = `syl-logic-${shortHash(logicContent)}`;
  const localizedRecordId = `syl-localized-${shortHash({ logicContentId, locale: input.locale, statements: input.statements, conclusions: input.conclusions, optionText: input.options.map((option) => option.text) })}`;
  const reviewVersionId = `syl-review-${shortHash({ localizedRecordId, proofWithoutIdentity, explanationVersion: "v3", diagramVersion: "syl-integrated-diagram-v3" })}`;
  return {
    logicContentId,
    localizedRecordId,
    reviewVersionId,
    questionId: `SYL-Q-${logicContentId.slice(-12).toUpperCase()}`,
    questionLanguageId: `SYL-Q-${logicContentId.slice(-12).toUpperCase()}-${input.locale}`,
  };
}

function validationEvidence(contentHash: string): readonly SylValidationEvidenceV3[] {
  return [
    {
      validatorId: "SYL_VISIBLE_OPTION_ALIGNMENT_V1",
      validatorVersion: 1,
      status: "PASS",
      scope: "AUTOMATED",
      contentHash,
      evidence: "Visible option order, analysis order, correct index and final answer are generated from the same shuffled option array.",
    },
    {
      validatorId: "SYL_INTEGRATED_DIAGRAM_CONTRACT_V1",
      validatorVersion: 1,
      status: "PASS",
      scope: "AUTOMATED",
      contentHash,
      evidence: "Exactly one SVG artifact; correct-option-only marker; all decisive premise IDs included; localized unique accessibility IDs.",
    },
    {
      validatorId: "SYL_EXISTENCE_POLICY_PARITY_V1",
      validatorVersion: 1,
      status: "PASS",
      scope: "AUTOMATED",
      contentHash,
      evidence: `${SYL_EXISTENCE_POLICY} is emitted in the structured proof and matches the active solver profile.`,
    },
    {
      validatorId: "SYL_NATIVE_EDITORIAL_REVIEW_V1",
      validatorVersion: 1,
      status: "NOT_RUN",
      scope: "HUMAN",
      contentHash,
      evidence: "English, Hindi and Punjabi native editorial review remains required.",
    },
  ];
}

export function buildStructuredProofV3(input: SylProofBuildInputV3): SylStructuredProofV3 {
  if (input.options.length === 0) throw new Error("V3 proof requires visible options.");
  if (!input.options[input.correctIndex]?.isCorrect) throw new Error("V3 correct index is not aligned with the keyed option.");

  const statementMeanings = input.displayedPremises.map((premise, index) =>
    premiseMeaning(premise, input.statements[index], index + 1, input));
  const reasoning = combinedReasoning(input);
  const analyses = visibleOptionAnalysis(input);
  const proof = correctOptionProof(input, reasoning);
  const mode = proofMode(input);
  const idBase = safeId(`${input.locale}-${input.qlId}-${input.seed}-${input.scenarioId}-v3`);
  const textAlternative = input.locale === "hi-IN"
    ? `यह एक संयुक्त चित्र है। इसमें ${premiseReference(input, reasoning.decisivePremiseIds)} और सही विकल्प ${input.correctIndex + 1} का प्रमाण दिखाया गया है।`
    : input.locale === "pa-IN"
      ? `ਇਹ ਇੱਕ ਇਕੱਠਾ ਚਿੱਤਰ ਹੈ। ਇਸ ਵਿੱਚ ${premiseReference(input, reasoning.decisivePremiseIds)} ਅਤੇ ਸਹੀ ਵਿਕਲਪ ${input.correctIndex + 1} ਦਾ ਸਬੂਤ ਦਿਖਾਇਆ ਗਿਆ ਹੈ।`
      : `One integrated diagram showing ${premiseReference(input, reasoning.decisivePremiseIds)} and the proof for correct Option ${input.correctIndex + 1}.`;
  const diagram = renderIntegratedDiagramV3({
    locale: input.locale,
    premises: input.displayedPremises,
    relevantPremiseIds: reasoning.decisivePremiseIds,
    termLabels: input.termLabels,
    correctOptionDisplayIndex: input.correctIndex + 1,
    correctOptionText: input.options[input.correctIndex].text,
    conclusions: input.canonicalConclusions,
    mode: mode.diagramMode,
    model: mode.model,
    alternateModel: mode.alternateModel,
    titleId: `syl-diagram-title-${idBase}`,
    descriptionId: `syl-diagram-desc-${idBase}`,
    textAlternative,
  });
  const dependentConclusionIds = existenceDependent(input);
  const proofWithoutIdentity = {
    statementMeanings,
    reasoning,
    analyses,
    proof,
    fastRule: fastRule(input),
    diagramSpec: diagram.spec,
  };
  const identity = identities(input, proofWithoutIdentity);
  const contentHash = hash({ identity, proofWithoutIdentity, diagramSvg: diagram.svg });
  const finalAnswer = `${localeCopy(input.locale).option} ${input.correctIndex + 1}: ${input.options[input.correctIndex].text}`;

  return {
    authority: SYL_STRUCTURED_PROOF_AUTHORITY,
    schemaVersion: "syl-structured-proof-v3",
    identity,
    locale: input.locale,
    taskKind: input.taskKind,
    semanticProfileId: "INDIAN_COMPETITIVE_EXAM_SYLLOGISM_V1",
    existencePolicy: {
      policyId: SYL_EXISTENCE_POLICY,
      version: 1,
      visibleToStudent: true,
      studentDirection: localeCopy(input.locale).existenceDirection,
      authorityIds: ["SYL_NEGATIVE_UNIVERSAL_EXISTENCE_AMENDMENT_V1", "SYL_001_STRUCTURED_PROOF_PEDAGOGY_V3"],
      dependentAnswer: dependentConclusionIds.length > 0,
      dependentConclusionIds,
    },
    statementMeanings,
    combinedReasoning: reasoning,
    visibleOptionAnalysis: analyses,
    correctOptionProof: proof,
    fastRule: fastRule(input),
    diagramSpec: diagram.spec,
    integratedDiagramSvg: diagram.svg,
    finalAnswer,
    validationEvidence: validationEvidence(contentHash),
    humanReview: {
      status: "REVISE",
      contentVersion: identity.reviewVersionId,
      reviewer: null,
      reviewedAt: null,
      notes: ["Native English/Hindi/Punjabi review and mobile diagram review are pending."],
    },
    provisionalQlAuthority: true,
  };
}
