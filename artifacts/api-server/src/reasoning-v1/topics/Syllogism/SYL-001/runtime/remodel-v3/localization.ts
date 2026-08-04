import type {
  CanonicalConclusion,
  SurfacePremise,
  SylLocale,
  TermId,
} from "../../foundation/types";
import {
  renderConclusion,
  renderPremise,
  type TermAssignment,
} from "../localization";
import type {
  SylLogicalStatusV3,
  SylTaskDispositionV3,
} from "./types";

export interface SylV3Headings {
  understand: string;
  combine: string;
  options: string;
  correctProof: string;
  fastRule: string;
  diagram: string;
  finalAnswer: string;
}

export function v3Headings(locale: SylLocale): SylV3Headings {
  if (locale === "hi-IN") return {
    understand: "1. कथनों को समझें",
    combine: "2. कथनों को जोड़ें",
    options: "3. हर विकल्प की जाँच",
    correctProof: "4. सही विकल्प क्यों सही है",
    fastRule: "5. तेज़ परीक्षा नियम",
    diagram: "6. सही विकल्प का संयुक्त आरेख",
    finalAnswer: "7. अंतिम उत्तर",
  };
  if (locale === "pa-IN") return {
    understand: "1. ਕਥਨਾਂ ਨੂੰ ਸਮਝੋ",
    combine: "2. ਕਥਨਾਂ ਨੂੰ ਜੋੜੋ",
    options: "3. ਹਰ ਵਿਕਲਪ ਦੀ ਜਾਂਚ",
    correctProof: "4. ਸਹੀ ਵਿਕਲਪ ਕਿਉਂ ਸਹੀ ਹੈ",
    fastRule: "5. ਤੇਜ਼ ਪ੍ਰੀਖਿਆ ਨਿਯਮ",
    diagram: "6. ਸਹੀ ਵਿਕਲਪ ਦਾ ਜੋੜਿਆ ਚਿੱਤਰ",
    finalAnswer: "7. ਅੰਤਿਮ ਉੱਤਰ",
  };
  return {
    understand: "1. Understand the statements",
    combine: "2. Combine the statements",
    options: "3. Check each visible option",
    correctProof: "4. Why the correct option is right",
    fastRule: "5. Fast exam rule",
    diagram: "6. One combined diagram for the correct option",
    finalAnswer: "7. Final answer",
  };
}

export function existenceDirection(locale: SylLocale): string {
  if (locale === "hi-IN") {
    return "इस अध्याय में कथनों में आए प्रत्येक वर्ग में कम-से-कम एक सदस्य माना गया है।";
  }
  if (locale === "pa-IN") {
    return "ਇਸ ਅਧਿਆਇ ਵਿੱਚ ਕਥਨਾਂ ਵਿੱਚ ਆਏ ਹਰ ਵਰਗ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਮੰਨਿਆ ਗਿਆ ਹੈ।";
  }
  return "For this chapter, every class named in the statements is treated as having at least one member.";
}

function label(termId: TermId, locale: SylLocale, assignment: TermAssignment): string {
  return assignment[termId]?.labels[locale] ?? termId;
}

export function premiseMeaning(
  premise: SurfacePremise,
  locale: SylLocale,
  assignment: TermAssignment,
): { meaning: string; relation: string } {
  const subject = label(premise.subject, locale, assignment);
  const predicate = label(premise.predicate, locale, assignment);
  if (locale === "hi-IN") {
    switch (premise.form) {
      case "ALL": return { meaning: `${subject} का प्रत्येक सदस्य ${predicate} में है।`, relation: `${subject} ⊆ ${predicate}` };
      case "NO": return { meaning: `${subject} और ${predicate} का कोई सदस्य साझा नहीं है।`, relation: `${subject} ∩ ${predicate} = ∅` };
      case "SOME":
      case "A_FEW": return { meaning: `कम-से-कम एक सदस्य ${subject} और ${predicate} दोनों में है।`, relation: `${subject} ∩ ${predicate} ≠ ∅` };
      case "SOME_NOT":
      case "NOT_ALL": return { meaning: `कम-से-कम एक ${subject}, ${predicate} में नहीं है।`, relation: `${subject} \\ ${predicate} ≠ ∅` };
      case "ONLY": return { meaning: `‘केवल ${subject}, ${predicate} हैं’ का अर्थ है: सभी ${predicate}, ${subject} हैं।`, relation: `${predicate} ⊆ ${subject}` };
      case "ARE_ONLY": return { meaning: `सभी ${subject}, ${predicate} हैं।`, relation: `${subject} ⊆ ${predicate}` };
      case "ONLY_A_FEW": return { meaning: `कुछ ${subject}, ${predicate} हैं और कुछ ${subject}, ${predicate} नहीं हैं।`, relation: `${subject} ∩ ${predicate} ≠ ∅; ${subject} \\ ${predicate} ≠ ∅` };
      case "IDENTITY": return { meaning: `${subject} और ${predicate} एक ही वर्ग हैं।`, relation: `${subject} = ${predicate}` };
      case "FEW": throw new Error("Plain FEW is not admitted by SYL-001.");
    }
  }
  if (locale === "pa-IN") {
    switch (premise.form) {
      case "ALL": return { meaning: `${subject} ਦਾ ਹਰ ਮੈਂਬਰ ${predicate} ਵਿੱਚ ਹੈ।`, relation: `${subject} ⊆ ${predicate}` };
      case "NO": return { meaning: `${subject} ਅਤੇ ${predicate} ਦਾ ਕੋਈ ਮੈਂਬਰ ਸਾਂਝਾ ਨਹੀਂ ਹੈ।`, relation: `${subject} ∩ ${predicate} = ∅` };
      case "SOME":
      case "A_FEW": return { meaning: `ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ${subject} ਅਤੇ ${predicate} ਦੋਵਾਂ ਵਿੱਚ ਹੈ।`, relation: `${subject} ∩ ${predicate} ≠ ∅` };
      case "SOME_NOT":
      case "NOT_ALL": return { meaning: `ਘੱਟੋ-ਘੱਟ ਇੱਕ ${subject}, ${predicate} ਵਿੱਚ ਨਹੀਂ ਹੈ।`, relation: `${subject} \\ ${predicate} ≠ ∅` };
      case "ONLY": return { meaning: `‘ਕੇਵਲ ${subject}, ${predicate} ਹਨ’ ਦਾ ਅਰਥ ਹੈ: ਸਾਰੇ ${predicate}, ${subject} ਹਨ।`, relation: `${predicate} ⊆ ${subject}` };
      case "ARE_ONLY": return { meaning: `ਸਾਰੇ ${subject}, ${predicate} ਹਨ।`, relation: `${subject} ⊆ ${predicate}` };
      case "ONLY_A_FEW": return { meaning: `ਕੁਝ ${subject}, ${predicate} ਹਨ ਅਤੇ ਕੁਝ ${subject}, ${predicate} ਨਹੀਂ ਹਨ।`, relation: `${subject} ∩ ${predicate} ≠ ∅; ${subject} \\ ${predicate} ≠ ∅` };
      case "IDENTITY": return { meaning: `${subject} ਅਤੇ ${predicate} ਇੱਕੋ ਵਰਗ ਹਨ।`, relation: `${subject} = ${predicate}` };
      case "FEW": throw new Error("Plain FEW is not admitted by SYL-001.");
    }
  }
  switch (premise.form) {
    case "ALL": return { meaning: `Every ${subject} is a ${predicate}.`, relation: `${subject} ⊆ ${predicate}` };
    case "NO": return { meaning: `Nothing can be both a ${subject} and a ${predicate}.`, relation: `${subject} ∩ ${predicate} = ∅` };
    case "SOME":
    case "A_FEW": return { meaning: `At least one member is both a ${subject} and a ${predicate}.`, relation: `${subject} ∩ ${predicate} ≠ ∅` };
    case "SOME_NOT":
    case "NOT_ALL": return { meaning: `At least one ${subject} is not a ${predicate}.`, relation: `${subject} \\ ${predicate} ≠ ∅` };
    case "ONLY": return { meaning: `“Only ${subject} are ${predicate}” means every ${predicate} is a ${subject}.`, relation: `${predicate} ⊆ ${subject}` };
    case "ARE_ONLY": return { meaning: `Every ${subject} is a ${predicate}.`, relation: `${subject} ⊆ ${predicate}` };
    case "ONLY_A_FEW": return { meaning: `Some ${subject} are ${predicate}, and some ${subject} are not ${predicate}.`, relation: `${subject} ∩ ${predicate} ≠ ∅; ${subject} \\ ${predicate} ≠ ∅` };
    case "IDENTITY": return { meaning: `${subject} and ${predicate} are the same class.`, relation: `${subject} = ${predicate}` };
    case "FEW": throw new Error("Plain FEW is not admitted by SYL-001.");
  }
}

export function renderedPremise(
  premise: SurfacePremise,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  return renderPremise(premise, locale, assignment);
}

export function renderedConclusion(
  conclusion: CanonicalConclusion,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  return renderConclusion(conclusion, locale, assignment);
}

export function studentVerdict(
  logicalStatus: SylLogicalStatusV3,
  disposition: SylTaskDispositionV3,
  locale: SylLocale,
): string {
  const correct = disposition === "CORRECT_FOR_TASK";
  if (locale === "hi-IN") {
    if (correct && logicalStatus === "ENTAILED") return "सही — निश्चित रूप से अनुसरण करता है";
    if (correct && logicalStatus === "POSSIBLE_NOT_ENTAILED") return "सही — संभव है, पर निश्चित नहीं";
    if (correct && logicalStatus === "IMPOSSIBLE") return "सही — असंभव निष्कर्ष";
    if (logicalStatus === "ENTAILED") return "यह सत्य है, लेकिन इस प्रश्न का अपेक्षित उत्तर नहीं";
    if (logicalStatus === "IMPOSSIBLE") return "गलत — असंभव";
    return "गलत — संभव है, पर निश्चित नहीं";
  }
  if (locale === "pa-IN") {
    if (correct && logicalStatus === "ENTAILED") return "ਸਹੀ — ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਨਿਕਲਦਾ ਹੈ";
    if (correct && logicalStatus === "POSSIBLE_NOT_ENTAILED") return "ਸਹੀ — ਸੰਭਵ ਹੈ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ";
    if (correct && logicalStatus === "IMPOSSIBLE") return "ਸਹੀ — ਅਸੰਭਵ ਨਤੀਜਾ";
    if (logicalStatus === "ENTAILED") return "ਇਹ ਸਹੀ ਹੈ, ਪਰ ਇਸ ਪ੍ਰਸ਼ਨ ਦਾ ਮੰਗਿਆ ਜਵਾਬ ਨਹੀਂ";
    if (logicalStatus === "IMPOSSIBLE") return "ਗਲਤ — ਅਸੰਭਵ";
    return "ਗਲਤ — ਸੰਭਵ ਹੈ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ";
  }
  if (correct && logicalStatus === "ENTAILED") return "Correct — definitely follows";
  if (correct && logicalStatus === "POSSIBLE_NOT_ENTAILED") return "Correct — genuinely possible, but not definite";
  if (correct && logicalStatus === "IMPOSSIBLE") return "Correct — impossible conclusion";
  if (logicalStatus === "ENTAILED") return "True, but not the response requested by this task";
  if (logicalStatus === "IMPOSSIBLE") return "Wrong — impossible";
  return "Wrong — possible, but not definite";
}

export function optionPrefix(index: number, text: string, locale: SylLocale): string {
  if (locale === "hi-IN") return `विकल्प ${index}: ${text}`;
  if (locale === "pa-IN") return `ਵਿਕਲਪ ${index}: ${text}`;
  return `Option ${index}: ${text}`;
}

export function correctProofSentence(
  optionIndex: number,
  optionText: string,
  locale: SylLocale,
): string {
  if (locale === "hi-IN") return `अतः विकल्प ${optionIndex} — ${optionText} सही है।`;
  if (locale === "pa-IN") return `ਇਸ ਲਈ ਵਿਕਲਪ ${optionIndex} — ${optionText} ਸਹੀ ਹੈ।`;
  return `Therefore, Option ${optionIndex} — ${optionText} is correct.`;
}

export function combinedRelationIntro(locale: SylLocale): string {
  if (locale === "hi-IN") return "निर्णायक कथनों को एक साथ रखने पर:";
  if (locale === "pa-IN") return "ਫੈਸਲਾ ਕਰਨ ਵਾਲੇ ਕਥਨਾਂ ਨੂੰ ਇਕੱਠੇ ਰੱਖਣ ਉੱਤੇ:";
  return "Putting the decisive statements together:";
}

export function modelStateLabel(
  purpose: "SATISFIES_CORRECT_OPTION" | "FALSIFIES_CORRECT_OPTION" | "PREMISE_MODEL",
  locale: SylLocale,
): string {
  if (locale === "hi-IN") {
    if (purpose === "SATISFIES_CORRECT_OPTION") return "विकल्प सत्य होने का सही मॉडल";
    if (purpose === "FALSIFIES_CORRECT_OPTION") return "विकल्प असत्य होने का सही मॉडल";
    return "कथनों का सही मॉडल";
  }
  if (locale === "pa-IN") {
    if (purpose === "SATISFIES_CORRECT_OPTION") return "ਵਿਕਲਪ ਸਹੀ ਹੋਣ ਵਾਲਾ ਠੀਕ ਮਾਡਲ";
    if (purpose === "FALSIFIES_CORRECT_OPTION") return "ਵਿਕਲਪ ਗਲਤ ਹੋਣ ਵਾਲਾ ਠੀਕ ਮਾਡਲ";
    return "ਕਥਨਾਂ ਦਾ ਠੀਕ ਮਾਡਲ";
  }
  if (purpose === "SATISFIES_CORRECT_OPTION") return "Valid model where the option is true";
  if (purpose === "FALSIFIES_CORRECT_OPTION") return "Valid model where the option is false";
  return "Valid model of the statements";
}
