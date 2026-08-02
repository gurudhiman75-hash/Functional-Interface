import type { SylLocale } from "../foundation/types";
import { describeModel, renderEvidenceDiagram } from "./diagram";
import {
  renderConclusion,
  renderNormalizedPremise,
  type TermAssignment,
} from "./localization";
import type { SelectedLogic } from "./selection";
import type {
  GeneratedSylOption,
  SylExplanationTrace,
  SylQlDefinition,
} from "./types";

const ROMAN = ["I", "II", "III", "IV"];

function ruleText(definition: SylQlDefinition, locale: SylLocale): string {
  if (locale === "hi-IN") {
    if (definition.taskKind.includes("MODAL") || definition.taskKind.includes("POSSIBILITY") || definition.taskKind.includes("IMPOSSIBLE")) {
      return "संभावना के लिए कम-से-कम एक मान्य व्यवस्था चाहिए; निश्चित निष्कर्ष के लिए हर मान्य व्यवस्था में सत्य होना आवश्यक है।";
    }
    if (definition.taskKind.includes("EITHER_OR") || definition.taskKind === "CLASSIFY_CONCLUSION_PAIR") {
      return "वास्तविक या-तो जोड़ी में दोनों निष्कर्ष एक साथ सत्य नहीं हो सकते और दोनों एक साथ असत्य भी नहीं हो सकते।";
    }
    return "निश्चित निष्कर्ष वही है जिसे कथनों के रहते किसी भी मान्य व्यवस्था में झुठलाया न जा सके।";
  }
  if (locale === "pa-IN") {
    if (definition.taskKind.includes("MODAL") || definition.taskKind.includes("POSSIBILITY") || definition.taskKind.includes("IMPOSSIBLE")) {
      return "ਸੰਭਾਵਨਾ ਲਈ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੰਨੀ ਹੋਈ ਬਣਤਰ ਚਾਹੀਦੀ ਹੈ; ਨਿਸ਼ਚਿਤ ਨਤੀਜਾ ਹਰ ਮੰਨੀ ਹੋਈ ਬਣਤਰ ਵਿੱਚ ਸਹੀ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।";
    }
    if (definition.taskKind.includes("EITHER_OR") || definition.taskKind === "CLASSIFY_CONCLUSION_PAIR") {
      return "ਅਸਲੀ ਜਾਂ-ਤਾਂ ਜੋੜੀ ਵਿੱਚ ਦੋਵੇਂ ਨਤੀਜੇ ਇਕੱਠੇ ਸਹੀ ਨਹੀਂ ਹੋ ਸਕਦੇ ਅਤੇ ਦੋਵੇਂ ਇਕੱਠੇ ਗਲਤ ਵੀ ਨਹੀਂ ਹੋ ਸਕਦੇ।";
    }
    return "ਨਿਸ਼ਚਿਤ ਨਤੀਜਾ ਉਹੀ ਹੈ ਜਿਸ ਨੂੰ ਕਥਨਾਂ ਦੇ ਰਹਿੰਦੇ ਕਿਸੇ ਮੰਨੀ ਹੋਈ ਬਣਤਰ ਨਾਲ ਗਲਤ ਨਾ ਕੀਤਾ ਜਾ ਸਕੇ।";
  }
  if (definition.taskKind.includes("MODAL") || definition.taskKind.includes("POSSIBILITY") || definition.taskKind.includes("IMPOSSIBLE")) {
    return "Possibility needs at least one valid arrangement; a definite conclusion must remain true in every valid arrangement.";
  }
  if (definition.taskKind.includes("EITHER_OR") || definition.taskKind === "CLASSIFY_CONCLUSION_PAIR") {
    return "A genuine either-or pair cannot be jointly true and cannot be jointly false, while neither member follows alone.";
  }
  return "A definite conclusion is one for which no valid counter-arrangement exists under the statements.";
}

function verdictText(
  classification: string,
  canBeTrue: boolean,
  canBeFalse: boolean,
  locale: SylLocale,
): string {
  if (locale === "hi-IN") {
    if (classification === "ENTAILED") return "यह हर मान्य व्यवस्था में सत्य है; इसलिए यह निश्चित रूप से अनुसरण करता है।";
    if (classification === "CONTRADICTED") return "यह किसी भी मान्य व्यवस्था में सत्य नहीं हो सकता; इसलिए यह असंभव है।";
    return `यह एक मान्य व्यवस्था में सत्य और दूसरी में असत्य हो सकता है (${canBeTrue ? "सत्य संभव" : ""}${canBeTrue && canBeFalse ? ", " : ""}${canBeFalse ? "असत्य संभव" : ""}); इसलिए यह केवल संभावना है।`;
  }
  if (locale === "pa-IN") {
    if (classification === "ENTAILED") return "ਇਹ ਹਰ ਮੰਨੀ ਹੋਈ ਬਣਤਰ ਵਿੱਚ ਸਹੀ ਹੈ; ਇਸ ਲਈ ਇਹ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਸਹੀ ਹੈ।";
    if (classification === "CONTRADICTED") return "ਇਹ ਕਿਸੇ ਵੀ ਮੰਨੀ ਹੋਈ ਬਣਤਰ ਵਿੱਚ ਸਹੀ ਨਹੀਂ ਹੋ ਸਕਦਾ; ਇਸ ਲਈ ਇਹ ਅਸੰਭਵ ਹੈ।";
    return `ਇਹ ਇੱਕ ਮੰਨੀ ਹੋਈ ਬਣਤਰ ਵਿੱਚ ਸਹੀ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ਗਲਤ ਹੋ ਸਕਦਾ ਹੈ (${canBeTrue ? "ਸਹੀ ਸੰਭਵ" : ""}${canBeTrue && canBeFalse ? ", " : ""}${canBeFalse ? "ਗਲਤ ਸੰਭਵ" : ""}); ਇਸ ਲਈ ਇਹ ਕੇਵਲ ਸੰਭਾਵਨਾ ਹੈ।`;
  }
  if (classification === "ENTAILED") return "It is true in every valid arrangement, so it definitely follows.";
  if (classification === "CONTRADICTED") return "It cannot be true in any valid arrangement, so it is impossible.";
  return `It can be true in one valid arrangement and false in another (canBeTrue=${canBeTrue}, canBeFalse=${canBeFalse}), so it is possible but not definite.`;
}

function quickMethod(locale: SylLocale): string {
  if (locale === "hi-IN") return "जल्दी जाँच: ‘सभी’ की दिशा न पलटें, ‘केवल’ की दिशा पलटें, और संभावना को निश्चित निष्कर्ष न मानें।";
  if (locale === "pa-IN") return "ਤੇਜ਼ ਜਾਂਚ: ‘ਸਾਰੇ’ ਦੀ ਦਿਸ਼ਾ ਨਾ ਉਲਟੋ, ‘ਕੇਵਲ’ ਦੀ ਦਿਸ਼ਾ ਉਲਟੋ ਅਤੇ ਸੰਭਾਵਨਾ ਨੂੰ ਨਿਸ਼ਚਿਤ ਨਤੀਜਾ ਨਾ ਮੰਨੋ।";
  return "Quick check: do not reverse ‘all’; reverse the direction of ‘only’; never treat a possible relation as compulsory.";
}

function commonMistake(definition: SylQlDefinition, locale: SylLocale): string {
  const only = definition.scenarioGroup === "ONLY" || definition.scenarioGroup === "MIXED";
  const few = definition.scenarioGroup === "FEW" || definition.scenarioGroup === "MIXED";
  if (locale === "hi-IN") {
    if (only) return "सामान्य भूल: ‘केवल A ही B हैं’ को A और B की समानता मान लेना। सही अर्थ है—सभी B, A हैं।";
    if (few) return "सामान्य भूल: ‘केवल कुछ A, B हैं’ से केवल ‘कुछ A, B हैं’ लेना और ‘कुछ A, B नहीं हैं’ को छोड़ देना।";
    return "सामान्य भूल: किसी एक सुविधाजनक वेन-चित्र को एकमात्र संभव व्यवस्था मान लेना।";
  }
  if (locale === "pa-IN") {
    if (only) return "ਆਮ ਗਲਤੀ: ‘ਕੇਵਲ A ਹੀ B ਹਨ’ ਨੂੰ A ਅਤੇ B ਦੀ ਬਰਾਬਰੀ ਮੰਨ ਲੈਣਾ। ਸਹੀ ਅਰਥ ਹੈ—ਸਾਰੇ B, A ਹਨ।";
    if (few) return "ਆਮ ਗਲਤੀ: ‘ਕੇਵਲ ਕੁਝ A, B ਹਨ’ ਤੋਂ ਸਿਰਫ਼ ‘ਕੁਝ A, B ਹਨ’ ਲੈਣਾ ਅਤੇ ‘ਕੁਝ A, B ਨਹੀਂ ਹਨ’ ਛੱਡ ਦੇਣਾ।";
    return "ਆਮ ਗਲਤੀ: ਇੱਕ ਸੁਵਿਧਾਜਨਕ ਵੇਨ ਚਿੱਤਰ ਨੂੰ ਇਕੱਲੀ ਸੰਭਵ ਬਣਤਰ ਮੰਨ ਲੈਣਾ।";
  }
  if (only) return "Common mistake: treating ‘Only A are B’ as identity. It means all B are A, not all A are B.";
  if (few) return "Common mistake: reducing ‘Only a few A are B’ to only an overlap and forgetting that some A must remain outside B.";
  return "Common mistake: treating one convenient Venn picture as the only valid arrangement.";
}

function diagramRole(selected: SelectedLogic): SylExplanationTrace["diagramRole"] {
  if (selected.pairStatus === "EITHER_OR" || selected.pairStatus === "EITHER_OR_FOLLOWS") return "EITHER_OR_ALTERNATIVES";
  const correct = selected.conclusions.find((candidate) => candidate.profile.classification === "ENTAILED");
  if (correct) return "FORCED_RELATION";
  if (selected.conclusions.some((candidate) => candidate.profile.classification === "UNDETERMINED")) return "POSSIBLE_WITNESS";
  return "COUNTERMODEL";
}

export function buildExplanation(
  definition: SylQlDefinition,
  selected: SelectedLogic,
  locale: SylLocale,
  assignment: TermAssignment,
  options: readonly GeneratedSylOption[],
): SylExplanationTrace {
  const correctOption = options.find((option) => option.isCorrect);
  if (!correctOption) throw new Error("Explanation cannot find the correct option.");

  const normalizedPremises = selected.analysis.premises.map((premise) =>
    renderNormalizedPremise(premise, locale, assignment));
  const conclusionAnalysis = selected.conclusions.map((candidate, index) => {
    const rendered = renderConclusion(candidate.conclusion, locale, assignment);
    const label = ROMAN[index] ?? String(index + 1);
    return `${label}. ${rendered} ${verdictText(
      candidate.profile.classification,
      candidate.profile.canBeTrue,
      candidate.profile.canBeFalse,
      locale,
    )}`;
  });

  const modelEvidence = selected.conclusions.flatMap((candidate, index) => {
    const label = ROMAN[index] ?? String(index + 1);
    if (candidate.profile.classification === "ENTAILED") {
      return [`${label}: ${describeModel(candidate.profile.witnessModel, locale, assignment)}`];
    }
    if (candidate.profile.classification === "CONTRADICTED") {
      return [`${label}: ${describeModel(candidate.profile.counterModel, locale, assignment)}`];
    }
    return [
      `${label}: ${describeModel(candidate.profile.witnessModel, locale, assignment)}`,
      `${label}: ${describeModel(candidate.profile.counterModel, locale, assignment)}`,
    ];
  });

  const preferredModel = selected.conclusions.find((candidate) => candidate.profile.witnessModel)?.profile.witnessModel
    ?? selected.conclusions.find((candidate) => candidate.profile.counterModel)?.profile.counterModel
    ?? null;

  return {
    rule: ruleText(definition, locale),
    normalizedPremises,
    conclusionAnalysis,
    modelEvidence,
    finalAnswer: correctOption.text,
    quickMethod: quickMethod(locale),
    commonMistake: commonMistake(definition, locale),
    diagramRole: diagramRole(selected),
    diagramSvg: renderEvidenceDiagram(
      preferredModel,
      locale,
      assignment,
      `${definition.qlId}-${selected.analysis.scenario.scenarioId}`.replaceAll(/[^a-zA-Z0-9-]/g, "-"),
    ),
  };
}
