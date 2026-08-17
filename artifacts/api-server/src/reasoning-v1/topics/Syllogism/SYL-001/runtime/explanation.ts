import type {
  CanonicalConclusion,
  InternalConclusionClass,
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import { conclusionSemanticKey } from "./analysis";
import {
  renderPedagogicalVennDiagram,
  type PedagogicalDiagramFocus,
} from "./diagram";
import {
  renderConclusion,
  renderPremise,
  type TermAssignment,
} from "./localization";
import type { SelectedLogic } from "./selection";
import type {
  GeneratedSylOption,
  PedagogicalVerdict,
  SylConclusionTeachingStep,
  SylExplanationTrace,
  SylPremiseTeachingPoint,
  SylQlDefinition,
} from "./types";

const ROMAN = ["I", "II", "III", "IV"];

function termLabel(termId: TermId, locale: SylLocale, assignment: TermAssignment): string {
  return assignment[termId]?.labels[locale] ?? termId;
}

function quoted(value: string, locale: SylLocale): string {
  return locale === "en-IN" ? `“${value}”` : `‘${value}’`;
}

function coreRule(definition: SylQlDefinition, locale: SylLocale): string {
  const modal = definition.taskKind.includes("MODAL")
    || definition.taskKind.includes("POSSIBILITY")
    || definition.taskKind.includes("IMPOSSIBLE");
  const pair = definition.taskKind.includes("EITHER_OR")
    || definition.taskKind === "CLASSIFY_CONCLUSION_PAIR";
  if (locale === "hi-IN") {
    if (pair) return "पहले दोनों निष्कर्षों को अलग-अलग जाँचें। ‘या तो’ तभी सही होगा जब दोनों अकेले निश्चित न हों, दोनों साथ सत्य न हो सकें और दोनों साथ असत्य भी न हो सकें।";
    if (modal) return "संभावना के लिए एक सही वेन चित्र पर्याप्त है, लेकिन निश्चित निष्कर्ष हर सही वेन चित्र में सत्य रहना चाहिए।";
    return "कोई निष्कर्ष तभी निश्चित रूप से अनुसरण करता है जब वह कथनों के अनुसार बनने वाले हर सही वेन चित्र में सत्य रहे।";
  }
  if (locale === "pa-IN") {
    if (pair) return "ਪਹਿਲਾਂ ਦੋਵੇਂ ਨਤੀਜਿਆਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਜਾਂਚੋ। ‘ਜਾਂ-ਤਾਂ’ ਸਿਰਫ਼ ਉਦੋਂ ਸਹੀ ਹੈ ਜਦੋਂ ਕੋਈ ਵੀ ਨਤੀਜਾ ਇਕੱਲਾ ਲਾਜ਼ਮੀ ਨਾ ਹੋਵੇ, ਦੋਵੇਂ ਇਕੱਠੇ ਸਹੀ ਨਾ ਹੋ ਸਕਣ ਅਤੇ ਦੋਵੇਂ ਇਕੱਠੇ ਗਲਤ ਵੀ ਨਾ ਹੋ ਸਕਣ।";
    if (modal) return "ਸੰਭਾਵਨਾ ਲਈ ਇੱਕ ਠੀਕ ਵੇਨ ਚਿੱਤਰ ਕਾਫ਼ੀ ਹੈ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਤੀਜਾ ਹਰ ਠੀਕ ਵੇਨ ਚਿੱਤਰ ਵਿੱਚ ਸਹੀ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ।";
    return "ਕੋਈ ਨਤੀਜਾ ਤਦੋਂ ਹੀ ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ ਹੁੰਦਾ ਹੈ ਜਦੋਂ ਉਹ ਕਥਨਾਂ ਅਨੁਸਾਰ ਬਣਦੇ ਹਰ ਠੀਕ ਵੇਨ ਚਿੱਤਰ ਵਿੱਚ ਸਹੀ ਰਹੇ।";
  }
  if (pair) return "Check both conclusions separately first. An either-or result is valid only when neither conclusion follows alone, they cannot both be true, and they cannot both be false.";
  if (modal) return "One valid Venn diagram is enough to prove possibility, but a definite conclusion must remain true in every valid Venn diagram.";
  return "A conclusion definitely follows only when it remains true in every valid Venn diagram allowed by the statements.";
}

function headings(locale: SylLocale): {
  tier1: string;
  tier2: string;
  tier3: string;
  tier4: string;
} {
  if (locale === "hi-IN") return {
    tier1: "📌 स्तर 1: मूल नियम और कथनों का अर्थ",
    tier2: "📝 स्तर 2: निष्कर्षों की चरण-दर-चरण जाँच",
    tier3: "⚡ स्तर 3: परीक्षा शॉर्टकट",
    tier4: "⚠️ स्तर 4: सामान्य भूल",
  };
  if (locale === "pa-IN") return {
    tier1: "📌 ਪੱਧਰ 1: ਮੁੱਖ ਨਿਯਮ ਅਤੇ ਕਥਨਾਂ ਦਾ ਅਰਥ",
    tier2: "📝 ਪੱਧਰ 2: ਨਤੀਜਿਆਂ ਦੀ ਕਦਮ-ਦਰ-ਕਦਮ ਜਾਂਚ",
    tier3: "⚡ ਪੱਧਰ 3: ਪ੍ਰੀਖਿਆ ਸ਼ਾਰਟਕੱਟ",
    tier4: "⚠️ ਪੱਧਰ 4: ਆਮ ਗਲਤੀ",
  };
  return {
    tier1: "📌 Tier 1: Core Rule and Premise Meaning",
    tier2: "📝 Tier 2: Step-by-Step Conclusion Analysis",
    tier3: "⚡ Tier 3: Exam Speed Shortcut",
    tier4: "⚠️ Tier 4: Common Student Trap",
  };
}

function premiseNaturalRule(
  premise: SurfacePremise,
  locale: SylLocale,
  assignment: TermAssignment,
): { naturalRule: string; compactRule: string } {
  const subject = termLabel(premise.subject, locale, assignment);
  const predicate = termLabel(premise.predicate, locale, assignment);
  const symbolSubject = subject;
  const symbolPredicate = predicate;

  const en = (): { naturalRule: string; compactRule: string } => {
    switch (premise.form) {
      case "ALL": return { naturalRule: `The entire ${subject} set must stay inside ${predicate}.`, compactRule: `${symbolSubject} ⊆ ${symbolPredicate}` };
      case "NO": return { naturalRule: `${subject} and ${predicate} must remain completely separate.`, compactRule: `${symbolSubject} ∩ ${symbolPredicate} = ∅` };
      case "SOME":
      case "A_FEW": return { naturalRule: `At least one member is common to ${subject} and ${predicate}.`, compactRule: `${symbolSubject} ∩ ${symbolPredicate} ≠ ∅` };
      case "SOME_NOT":
      case "NOT_ALL": return { naturalRule: `At least one ${subject} member must stay outside ${predicate}.`, compactRule: `${symbolSubject} \\ ${symbolPredicate} ≠ ∅` };
      case "ONLY": return { naturalRule: `The word “only” reverses the inclusion: every ${predicate} must be a ${subject}.`, compactRule: `${symbolPredicate} ⊆ ${symbolSubject}` };
      case "ARE_ONLY": return { naturalRule: `Every ${subject} must lie inside ${predicate}.`, compactRule: `${symbolSubject} ⊆ ${symbolPredicate}` };
      case "ONLY_A_FEW": return { naturalRule: `Some ${subject} are ${predicate}, and some ${subject} must remain outside ${predicate}.`, compactRule: `${symbolSubject} ∩ ${symbolPredicate} ≠ ∅; ${symbolSubject} \\ ${symbolPredicate} ≠ ∅` };
      case "IDENTITY": return { naturalRule: `${subject} and ${predicate} represent the same set.`, compactRule: `${symbolSubject} = ${symbolPredicate}` };
      case "FEW": throw new Error("Plain FEW is not admitted by the frozen SYL-001 profile.");
    }
  };

  if (locale === "en-IN") return en();
  if (locale === "hi-IN") {
    switch (premise.form) {
      case "ALL": return { naturalRule: `“${subject}” का पूरा गोला “${predicate}” के गोले के अंदर रहेगा।`, compactRule: `${symbolSubject} ⊆ ${symbolPredicate}` };
      case "NO": return { naturalRule: `“${subject}” और “${predicate}” के गोले पूरी तरह अलग रहेंगे।`, compactRule: `${symbolSubject} ∩ ${symbolPredicate} = ∅` };
      case "SOME":
      case "A_FEW": return { naturalRule: `“${subject}” और “${predicate}” के साझा हिस्से में कम-से-कम एक सदस्य निश्चित है।`, compactRule: `${symbolSubject} ∩ ${symbolPredicate} ≠ ∅` };
      case "SOME_NOT":
      case "NOT_ALL": return { naturalRule: `“${subject}” समूह का कम-से-कम एक सदस्य “${predicate}” से बाहर रहेगा।`, compactRule: `${symbolSubject} \\ ${symbolPredicate} ≠ ∅` };
      case "ONLY": return { naturalRule: `‘केवल’ दिशा पलट देता है: “${predicate}” वाला पूरा गोला “${subject}” के अंदर रहेगा।`, compactRule: `${symbolPredicate} ⊆ ${symbolSubject}` };
      case "ARE_ONLY": return { naturalRule: `“${subject}” वाला पूरा गोला “${predicate}” के अंदर रहेगा।`, compactRule: `${symbolSubject} ⊆ ${symbolPredicate}` };
      case "ONLY_A_FEW": return { naturalRule: `“${subject}” का एक हिस्सा “${predicate}” में है और एक हिस्सा बाहर है।`, compactRule: `${symbolSubject} ∩ ${symbolPredicate} ≠ ∅; ${symbolSubject} \\ ${symbolPredicate} ≠ ∅` };
      case "IDENTITY": return { naturalRule: `“${subject}” और “${predicate}” एक ही समूह हैं।`, compactRule: `${symbolSubject} = ${symbolPredicate}` };
      case "FEW": throw new Error("Plain FEW is not admitted by the frozen SYL-001 profile.");
    }
  }
  switch (premise.form) {
    case "ALL": return { naturalRule: `“${subject}” ਵਾਲਾ ਪੂਰਾ ਗੋਲ “${predicate}” ਵਾਲੇ ਗੋਲ ਦੇ ਅੰਦਰ ਰਹੇਗਾ।`, compactRule: `${symbolSubject} ⊆ ${symbolPredicate}` };
    case "NO": return { naturalRule: `“${subject}” ਅਤੇ “${predicate}” ਵਾਲੇ ਗੋਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਰਹਿਣਗੇ।`, compactRule: `${symbolSubject} ∩ ${symbolPredicate} = ∅` };
    case "SOME":
    case "A_FEW": return { naturalRule: `“${subject}” ਅਤੇ “${predicate}” ਵਾਲੇ ਗੋਲਾਂ ਦੇ ਸਾਂਝੇ ਹਿੱਸੇ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਪੱਕਾ ਹੈ।`, compactRule: `${symbolSubject} ∩ ${symbolPredicate} ≠ ∅` };
    case "SOME_NOT":
    case "NOT_ALL": return { naturalRule: `“${subject}” ਵਾਲੇ ਗੋਲ ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ “${predicate}” ਵਾਲੇ ਗੋਲ ਤੋਂ ਬਾਹਰ ਰਹੇਗਾ।`, compactRule: `${symbolSubject} \\ ${symbolPredicate} ≠ ∅` };
    case "ONLY": return { naturalRule: `‘ਕੇਵਲ’ ਦਿਸ਼ਾ ਉਲਟ ਦਿੰਦਾ ਹੈ: “${predicate}” ਵਾਲਾ ਪੂਰਾ ਗੋਲ “${subject}” ਦੇ ਅੰਦਰ ਰਹੇਗਾ।`, compactRule: `${symbolPredicate} ⊆ ${symbolSubject}` };
    case "ARE_ONLY": return { naturalRule: `“${subject}” ਵਾਲਾ ਪੂਰਾ ਗੋਲ “${predicate}” ਦੇ ਅੰਦਰ ਰਹੇਗਾ।`, compactRule: `${symbolSubject} ⊆ ${symbolPredicate}` };
    case "ONLY_A_FEW": return { naturalRule: `“${subject}” ਦਾ ਇੱਕ ਹਿੱਸਾ “${predicate}” ਵਿੱਚ ਹੈ ਅਤੇ ਇੱਕ ਹਿੱਸਾ ਬਾਹਰ ਹੈ।`, compactRule: `${symbolSubject} ∩ ${symbolPredicate} ≠ ∅; ${symbolSubject} \\ ${symbolPredicate} ≠ ∅` };
    case "IDENTITY": return { naturalRule: `“${subject}” ਅਤੇ “${predicate}” ਇੱਕੋ ਸਮੂਹ ਹਨ।`, compactRule: `${symbolSubject} = ${symbolPredicate}` };
    case "FEW": throw new Error("Plain FEW is not admitted by the frozen SYL-001 profile.");
  }
}

function teachingPoint(
  premise: SurfacePremise,
  locale: SylLocale,
  assignment: TermAssignment,
): SylPremiseTeachingPoint {
  const rule = premiseNaturalRule(premise, locale, assignment);
  return {
    premiseId: premise.premiseId,
    statement: renderPremise(premise, locale, assignment),
    naturalRule: rule.naturalRule,
    compactRule: rule.compactRule,
  };
}

function verdict(classification: InternalConclusionClass): PedagogicalVerdict {
  if (classification === "ENTAILED") return "DEFINITELY_FOLLOWS";
  if (classification === "CONTRADICTED") return "IMPOSSIBLE";
  return "POSSIBILITY_ONLY";
}

function verdictLabel(value: PedagogicalVerdict, locale: SylLocale): string {
  if (locale === "hi-IN") {
    if (value === "DEFINITELY_FOLLOWS") return "सही — निश्चित रूप से अनुसरण करता है";
    if (value === "IMPOSSIBLE") return "गलत — असंभव";
    return "गलत — केवल संभावना, निश्चित नहीं";
  }
  if (locale === "pa-IN") {
    if (value === "DEFINITELY_FOLLOWS") return "ਸਹੀ — ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ";
    if (value === "IMPOSSIBLE") return "ਗਲਤ — ਅਸੰਭਵ";
    return "ਗਲਤ — ਸਿਰਫ਼ ਸੰਭਾਵਨਾ, ਨਿਸ਼ਚਿਤ ਨਹੀਂ";
  }
  if (value === "DEFINITELY_FOLLOWS") return "Correct — Definitely Follows";
  if (value === "IMPOSSIBLE") return "Incorrect — Impossible";
  return "Incorrect — Possibility Only, Not Definite";
}

function premiseReferences(
  premiseIds: readonly string[],
  displayedPremises: readonly SurfacePremise[],
  locale: SylLocale,
): string {
  const positions = premiseIds
    .map((premiseId) => displayedPremises.findIndex((premise) => premise.premiseId === premiseId))
    .filter((index) => index >= 0)
    .map((index) => index + 1);
  if (positions.length === 0) return "";
  const joined = positions.join(locale === "en-IN" ? " and " : locale === "hi-IN" ? " और " : " ਅਤੇ ");
  if (locale === "hi-IN") return `कथन ${joined}`;
  if (locale === "pa-IN") return `ਕਥਨ ${joined}`;
  return `Statement${positions.length > 1 ? "s" : ""} ${joined}`;
}

function directConflictReason(
  conclusion: CanonicalConclusion,
  premises: readonly SurfacePremise[],
  locale: SylLocale,
  assignment: TermAssignment,
): string | null {
  const samePair = premises.find((premise) =>
    premise.subject === conclusion.subject && premise.predicate === conclusion.predicate);
  const reversedPair = premises.find((premise) =>
    premise.subject === conclusion.predicate && premise.predicate === conclusion.subject);
  const subject = termLabel(conclusion.subject, locale, assignment);
  const predicate = termLabel(conclusion.predicate, locale, assignment);

  const conflict = (statement: SurfacePremise): string => {
    const rendered = renderPremise(statement, locale, assignment);
    if (locale === "hi-IN") return `${quoted(rendered, locale)} इस दावे की आवश्यक सीमा को सीधे रोकता है।`;
    if (locale === "pa-IN") return `${quoted(rendered, locale)} ਇਸ ਦਾਅਵੇ ਲਈ ਲੋੜੀਂਦੇ ਸੰਬੰਧ ਨੂੰ ਸਿੱਧਾ ਰੋਕਦਾ ਹੈ।`;
    return `${quoted(rendered, locale)} directly blocks the relation required by this conclusion.`;
  };

  if (conclusion.form === "ALL" && samePair && ["NO", "SOME_NOT", "NOT_ALL", "ONLY_A_FEW"].includes(samePair.form)) return conflict(samePair);
  if (conclusion.form === "NO" && samePair && ["SOME", "A_FEW", "ONLY_A_FEW"].includes(samePair.form)) return conflict(samePair);
  if (conclusion.form === "SOME" && samePair?.form === "NO") return conflict(samePair);
  if (conclusion.form === "SOME_NOT" && samePair && ["ALL", "ARE_ONLY", "IDENTITY"].includes(samePair.form)) return conflict(samePair);
  if (conclusion.form === "SOME" && reversedPair?.form === "NO") return conflict(reversedPair);
  if (conclusion.form === "NO" && reversedPair && ["SOME", "A_FEW", "ONLY_A_FEW"].includes(reversedPair.form)) return conflict(reversedPair);

  if (locale === "hi-IN") return `${subject} और ${predicate} के बीच माँगा गया संबंध कथनों के साथ बन ही नहीं सकता।`;
  if (locale === "pa-IN") return `${subject} ਅਤੇ ${predicate} ਵਿਚਕਾਰ ਮੰਗਿਆ ਗਿਆ ਸੰਬੰਧ ਕਥਨਾਂ ਨਾਲ ਬਣ ਹੀ ਨਹੀਂ ਸਕਦਾ।`;
  return `The required relation between ${subject} and ${predicate} cannot be fitted into the statement boundaries.`;
}

function chainReason(
  conclusion: CanonicalConclusion,
  premises: readonly SurfacePremise[],
  locale: SylLocale,
  assignment: TermAssignment,
): string | null {
  for (const first of premises) {
    for (const second of premises) {
      if (first === second || first.predicate !== second.subject) continue;
      const a = termLabel(first.subject, locale, assignment);
      const b = termLabel(first.predicate, locale, assignment);
      const c = termLabel(second.predicate, locale, assignment);
      if ((first.form === "SOME" || first.form === "A_FEW") && second.form === "NO"
        && conclusion.form === "SOME_NOT" && conclusion.subject === first.subject && conclusion.predicate === second.predicate) {
        if (locale === "hi-IN") return `जो सदस्य “${a}” और “${b}” दोनों में है, वह “${c}” में नहीं हो सकता, क्योंकि “${b}” और “${c}” पूरी तरह अलग हैं।`;
        if (locale === "pa-IN") return `ਜੋ ਮੈਂਬਰ “${a}” ਅਤੇ “${b}” ਦੋਵਾਂ ਵਿੱਚ ਹੈ, ਉਹ “${c}” ਵਿੱਚ ਨਹੀਂ ਹੋ ਸਕਦਾ, ਕਿਉਂਕਿ “${b}” ਅਤੇ “${c}” ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਹਨ।`;
        return `The member guaranteed to be in both ${a} and ${b} cannot be in ${c}, because ${b} and ${c} are completely separate.`;
      }
      if ((first.form === "SOME" || first.form === "A_FEW") && ["ALL", "ARE_ONLY"].includes(second.form)
        && conclusion.form === "SOME" && conclusion.subject === first.subject && conclusion.predicate === second.predicate) {
        if (locale === "hi-IN") return `जो सदस्य “${a}” और “${b}” दोनों में है, वह “${c}” में भी होगा, क्योंकि पूरा “${b}” समूह “${c}” के अंदर है।`;
        if (locale === "pa-IN") return `ਜੋ ਮੈਂਬਰ “${a}” ਅਤੇ “${b}” ਦੋਵਾਂ ਵਿੱਚ ਹੈ, ਉਹ “${c}” ਵਿੱਚ ਵੀ ਹੋਵੇਗਾ, ਕਿਉਂਕਿ ਪੂਰਾ “${b}” ਸਮੂਹ “${c}” ਦੇ ਅੰਦਰ ਹੈ।`;
        return `The member guaranteed to be in both ${a} and ${b} must also be in ${c}, because the whole ${b} set lies inside ${c}.`;
      }
      if (["ALL", "ARE_ONLY"].includes(first.form) && ["ALL", "ARE_ONLY"].includes(second.form)
        && conclusion.form === "ALL" && conclusion.subject === first.subject && conclusion.predicate === second.predicate) {
        if (locale === "hi-IN") return `“${a}” का पूरा गोला “${b}” के अंदर है और “${b}” का पूरा गोला “${c}” के अंदर है; इसलिए पूरा “${a}”, “${c}” के अंदर होगा।`;
        if (locale === "pa-IN") return `“${a}” ਵਾਲਾ ਪੂਰਾ ਗੋਲ “${b}” ਦੇ ਅੰਦਰ ਹੈ ਅਤੇ “${b}” ਵਾਲਾ ਪੂਰਾ ਗੋਲ “${c}” ਦੇ ਅੰਦਰ ਹੈ; ਇਸ ਲਈ ਪੂਰਾ “${a}”, “${c}” ਦੇ ਅੰਦਰ ਹੋਵੇਗਾ।`;
        return `${a} lies inside ${b}, and ${b} lies inside ${c}; therefore the whole ${a} set lies inside ${c}.`;
      }
      if (["ALL", "ARE_ONLY"].includes(first.form) && second.form === "NO"
        && conclusion.form === "NO" && conclusion.subject === first.subject && conclusion.predicate === second.predicate) {
        if (locale === "hi-IN") return `“${a}” का पूरा गोला “${b}” के अंदर है और “${b}”, “${c}” से अलग है; इसलिए “${a}” भी “${c}” से अलग रहेगा।`;
        if (locale === "pa-IN") return `“${a}” ਵਾਲਾ ਪੂਰਾ ਗੋਲ “${b}” ਦੇ ਅੰਦਰ ਹੈ ਅਤੇ “${b}”, “${c}” ਤੋਂ ਵੱਖ ਹੈ; ਇਸ ਲਈ “${a}” ਵੀ “${c}” ਤੋਂ ਵੱਖ ਰਹੇਗਾ।`;
        return `The whole ${a} set lies inside ${b}, and ${b} is separate from ${c}; therefore ${a} is also separate from ${c}.`;
      }
    }
  }
  return null;
}

function conclusionReason(
  classification: InternalConclusionClass,
  conclusion: CanonicalConclusion,
  relevantPremises: readonly SurfacePremise[],
  referenceText: string,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const chain = chainReason(conclusion, relevantPremises, locale, assignment);
  if (classification === "ENTAILED") {
    if (chain) return `${chain}${referenceText ? ` (${referenceText})` : ""}`;
    if (locale === "hi-IN") return `यह संबंध ${referenceText || "कथनों"} से अनिवार्य है। बाकी खुले हिस्सों को बदलने पर भी निष्कर्ष नहीं टूटता।`;
    if (locale === "pa-IN") return `ਇਹ ਸੰਬੰਧ ${referenceText || "ਕਥਨਾਂ"} ਤੋਂ ਲਾਜ਼ਮੀ ਹੈ। ਬਾਕੀ ਖੁੱਲ੍ਹੇ ਹਿੱਸੇ ਬਦਲਣ ਉੱਤੇ ਵੀ ਨਤੀਜਾ ਨਹੀਂ ਟੁੱਟਦਾ।`;
    return `This relation is forced by ${referenceText || "the statements"}. Moving any unforced parts cannot make the conclusion false.`;
  }
  if (classification === "CONTRADICTED") {
    const conflict = directConflictReason(conclusion, relevantPremises, locale, assignment);
    return `${conflict}${referenceText ? ` (${referenceText})` : ""}`;
  }
  const subject = termLabel(conclusion.subject, locale, assignment);
  const predicate = termLabel(conclusion.predicate, locale, assignment);
  if (locale === "hi-IN") return `“${subject}” और “${predicate}” के बीच पूरा संबंध तय नहीं है। एक सही वेन चित्र में यह संबंध बन सकता है और दूसरे में नहीं; इसलिए यह निश्चित निष्कर्ष नहीं है${referenceText ? ` (${referenceText})` : ""}।`;
  if (locale === "pa-IN") return `“${subject}” ਅਤੇ “${predicate}” ਵਿਚਕਾਰ ਪੂਰਾ ਸੰਬੰਧ ਤੈਅ ਨਹੀਂ ਹੈ। ਇੱਕ ਠੀਕ ਵੇਨ ਚਿੱਤਰ ਵਿੱਚ ਇਹ ਸੰਬੰਧ ਬਣ ਸਕਦਾ ਹੈ ਅਤੇ ਦੂਜੇ ਵਿੱਚ ਨਹੀਂ; ਇਸ ਲਈ ਇਹ ਨਿਸ਼ਚਿਤ ਨਤੀਜਾ ਨਹੀਂ ਹੈ${referenceText ? ` (${referenceText})` : ""}।`;
  return `The complete relation between ${subject} and ${predicate} is not fixed. One valid Venn diagram can show it and another can avoid it, so it is not definite${referenceText ? ` (${referenceText})` : ""}.`;
}

function conclusionStep(
  candidate: SelectedLogic["conclusions"][number],
  index: number,
  displayedPremises: readonly SurfacePremise[],
  locale: SylLocale,
  assignment: TermAssignment,
): SylConclusionTeachingStep {
  const rendered = renderConclusion(candidate.conclusion, locale, assignment);
  const label = ROMAN[index] ?? String(index + 1);
  const supporting = candidate.verdictImpactPremiseIds.length > 0
    ? candidate.verdictImpactPremiseIds
    : candidate.impactPremiseIds.length > 0
      ? candidate.impactPremiseIds
      : displayedPremises.map((premise) => premise.premiseId);
  const relevantPremises = displayedPremises.filter((premise) => supporting.includes(premise.premiseId));
  const value = verdict(candidate.profile.classification);
  return {
    label,
    conclusion: rendered,
    verdict: value,
    verdictLabel: verdictLabel(value, locale),
    reasoning: conclusionReason(
      candidate.profile.classification,
      candidate.conclusion,
      relevantPremises.length > 0 ? relevantPremises : displayedPremises,
      premiseReferences(supporting, displayedPremises, locale),
      locale,
      assignment,
    ),
    supportingPremiseIds: supporting,
  };
}

function combinationSummary(
  definition: SylQlDefinition,
  correctAnswer: string,
  locale: SylLocale,
): string | null {
  if (definition.renderer === "STATEMENT_OPTIONS" || definition.renderer === "MODAL_CLASSIFICATION") return null;
  if (locale === "hi-IN") return `हर निष्कर्ष को अलग-अलग जाँचने के बाद सही संयोजन है: ${correctAnswer}`;
  if (locale === "pa-IN") return `ਹਰ ਨਤੀਜੇ ਨੂੰ ਵੱਖ-ਵੱਖ ਜਾਂਚਣ ਤੋਂ ਬਾਅਦ ਸਹੀ ਜੋੜ ਹੈ: ${correctAnswer}`;
  return `After checking each conclusion separately, the correct combination is: ${correctAnswer}`;
}

function shortcut(
  definition: SylQlDefinition,
  premises: readonly SurfacePremise[],
  locale: SylLocale,
  assignment: TermAssignment,
): { shortcut: string; application: string } {
  const only = premises.find((premise) => premise.form === "ONLY");
  const onlyFew = premises.find((premise) => premise.form === "ONLY_A_FEW");
  const notAll = premises.find((premise) => premise.form === "NOT_ALL");
  if (only) {
    const a = termLabel(only.subject, locale, assignment);
    const b = termLabel(only.predicate, locale, assignment);
    if (locale === "hi-IN") return { shortcut: "‘केवल A ही B हैं’ को तुरंत ‘सभी B, A हैं’ में बदलें।", application: `यहाँ हर ${b}, ${a} होगा; उल्टा निष्कर्ष अपने-आप नहीं मिलेगा।` };
    if (locale === "pa-IN") return { shortcut: "‘ਕੇਵਲ A ਹੀ B ਹਨ’ ਨੂੰ ਤੁਰੰਤ ‘ਸਾਰੇ B, A ਹਨ’ ਵਿੱਚ ਬਦਲੋ।", application: `ਇੱਥੇ ਹਰ ${b}, ${a} ਹੋਵੇਗਾ; ਉਲਟ ਨਤੀਜਾ ਆਪਣੇ-ਆਪ ਨਹੀਂ ਮਿਲਦਾ।` };
    return { shortcut: "Rewrite ‘Only A are B’ immediately as ‘All B are A’.", application: `Here every ${b} is ${a}; the reverse relation is not automatic.` };
  }
  if (onlyFew) {
    const a = termLabel(onlyFew.subject, locale, assignment);
    const b = termLabel(onlyFew.predicate, locale, assignment);
    if (locale === "hi-IN") return { shortcut: "‘केवल कुछ A, B हैं’ को दो निश्चित बातों में तोड़ें: कुछ A, B हैं + कुछ A, B नहीं हैं।", application: `${a} का एक हिस्सा ${b} में और एक हिस्सा ${b} से बाहर रखना अनिवार्य है।` };
    if (locale === "pa-IN") return { shortcut: "‘ਕੇਵਲ ਕੁਝ A, B ਹਨ’ ਨੂੰ ਦੋ ਪੱਕੀਆਂ ਗੱਲਾਂ ਵਿੱਚ ਤੋੜੋ: ਕੁਝ A, B ਹਨ + ਕੁਝ A, B ਨਹੀਂ ਹਨ।", application: `${a} ਦਾ ਇੱਕ ਹਿੱਸਾ ${b} ਵਿੱਚ ਅਤੇ ਇੱਕ ਹਿੱਸਾ ${b} ਤੋਂ ਬਾਹਰ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਹੈ।` };
    return { shortcut: "Split ‘Only a few A are B’ into two facts: Some A are B + Some A are not B.", application: `One part of ${a} must lie in ${b}, while another part must stay outside ${b}.` };
  }
  if (notAll) {
    const a = termLabel(notAll.subject, locale, assignment);
    const b = termLabel(notAll.predicate, locale, assignment);
    if (locale === "hi-IN") return { shortcut: "‘सभी A, B नहीं हैं’ का सुरक्षित अर्थ लें: कुछ A, B नहीं हैं।", application: `कम-से-कम एक ${a}, ${b} से बाहर निश्चित है।` };
    if (locale === "pa-IN") return { shortcut: "‘ਸਾਰੇ A, B ਨਹੀਂ ਹਨ’ ਦਾ ਸੁਰੱਖਿਅਤ ਅਰਥ ਲਵੋ: ਕੁਝ A, B ਨਹੀਂ ਹਨ।", application: `ਘੱਟੋ-ਘੱਟ ਇੱਕ ${a}, ${b} ਤੋਂ ਬਾਹਰ ਪੱਕਾ ਹੈ।` };
    return { shortcut: "Convert ‘Not all A are B’ directly into ‘Some A are not B’.", application: `At least one ${a} member is definitely outside ${b}.` };
  }

  for (const first of premises) {
    for (const second of premises) {
      if (first === second || first.predicate !== second.subject) continue;
      const a = termLabel(first.subject, locale, assignment);
      const b = termLabel(first.predicate, locale, assignment);
      const c = termLabel(second.predicate, locale, assignment);
      const some = first.form === "SOME" || first.form === "A_FEW";
      const all = first.form === "ALL" || first.form === "ARE_ONLY";
      if (some && second.form === "NO") {
        if (locale === "hi-IN") return { shortcut: "Some A are B + No B is C ⇒ Some A are not C", application: `“${a}” और “${b}” के साझा हिस्से वाला सदस्य “${c}” नहीं हो सकता।` };
        if (locale === "pa-IN") return { shortcut: "Some A are B + No B is C ⇒ Some A are not C", application: `“${a}” ਅਤੇ “${b}” ਦੇ ਸਾਂਝੇ ਹਿੱਸੇ ਵਾਲਾ ਮੈਂਬਰ “${c}” ਨਹੀਂ ਹੋ ਸਕਦਾ।` };
        return { shortcut: "Some A are B + No B is C ⇒ Some A are not C", application: `The member in the ${a}–${b} overlap cannot belong to ${c}.` };
      }
      if (some && ["ALL", "ARE_ONLY"].includes(second.form)) {
        if (locale === "hi-IN") return { shortcut: "Some A are B + All B are C ⇒ Some A are C", application: `“${a}” और “${b}” के साझा हिस्से वाला सदस्य “${c}” में भी पहुँच जाता है।` };
        if (locale === "pa-IN") return { shortcut: "Some A are B + All B are C ⇒ Some A are C", application: `“${a}” ਅਤੇ “${b}” ਦੇ ਸਾਂਝੇ ਹਿੱਸੇ ਵਾਲਾ ਮੈਂਬਰ “${c}” ਵਿੱਚ ਵੀ ਪਹੁੰਚ ਜਾਂਦਾ ਹੈ।` };
        return { shortcut: "Some A are B + All B are C ⇒ Some A are C", application: `The member in the ${a}–${b} overlap is carried into ${c}.` };
      }
      if (all && ["ALL", "ARE_ONLY"].includes(second.form)) {
        if (locale === "hi-IN") return { shortcut: "All A are B + All B are C ⇒ All A are C", application: `${a} → ${b} → ${c} की सीधी श्रृंखला बनाएँ।` };
        if (locale === "pa-IN") return { shortcut: "All A are B + All B are C ⇒ All A are C", application: `${a} → ${b} → ${c} ਦੀ ਸਿੱਧੀ ਲੜੀ ਬਣਾਓ।` };
        return { shortcut: "All A are B + All B are C ⇒ All A are C", application: `Read the direct chain ${a} → ${b} → ${c}.` };
      }
      if (all && second.form === "NO") {
        if (locale === "hi-IN") return { shortcut: "All A are B + No B is C ⇒ No A is C", application: `${a}, ${b} के अंदर है और ${b}, ${c} से अलग है।` };
        if (locale === "pa-IN") return { shortcut: "All A are B + No B is C ⇒ No A is C", application: `${a}, ${b} ਦੇ ਅੰਦਰ ਹੈ ਅਤੇ ${b}, ${c} ਤੋਂ ਵੱਖ ਹੈ।` };
        return { shortcut: "All A are B + No B is C ⇒ No A is C", application: `${a} lies inside ${b}, which is separate from ${c}.` };
      }
    }
  }

  if (definition.taskKind.includes("EITHER_OR") || definition.taskKind === "CLASSIFY_CONCLUSION_PAIR") {
    if (locale === "hi-IN") return { shortcut: "‘या तो’ के लिए A–O या E–I जैसी पूरक जोड़ी देखें, फिर दोनों-साथ-सत्य और दोनों-साथ-असत्य को रोकें।", application: "सिर्फ विरोधी शब्द देखकर ‘या तो’ न चुनें; चारों जाँचें पूरी करें।" };
    if (locale === "pa-IN") return { shortcut: "‘ਜਾਂ-ਤਾਂ’ ਲਈ A–O ਜਾਂ E–I ਵਰਗੀ ਪੂਰਕ ਜੋੜੀ ਵੇਖੋ, ਫਿਰ ਦੋਵੇਂ-ਇਕੱਠੇ-ਸਹੀ ਅਤੇ ਦੋਵੇਂ-ਇਕੱਠੇ-ਗਲਤ ਨੂੰ ਰੋਕੋ।", application: "ਸਿਰਫ਼ ਉਲਟ ਸ਼ਬਦ ਵੇਖ ਕੇ ‘ਜਾਂ-ਤਾਂ’ ਨਾ ਚੁਣੋ; ਚਾਰਾਂ ਜਾਂਚਾਂ ਪੂਰੀਆਂ ਕਰੋ।" };
    return { shortcut: "For either-or, look for an A–O or E–I complementary pair, then rule out both-true and both-false cases.", application: "Opposite-looking wording alone is not enough; complete all four checks." };
  }

  if (locale === "hi-IN") return { shortcut: "पहले ‘सभी/कोई नहीं’ से सीमाएँ बनाएँ, फिर ‘कुछ’ वाले सदस्य को उसी श्रृंखला में आगे बढ़ाएँ।", application: "दिशा न पलटें और केवल वही संबंध लें जो कथनों से मजबूर है।" };
  if (locale === "pa-IN") return { shortcut: "ਪਹਿਲਾਂ ‘ਸਾਰੇ/ਕੋਈ ਨਹੀਂ’ ਨਾਲ ਹੱਦਾਂ ਬਣਾਓ, ਫਿਰ ‘ਕੁਝ’ ਵਾਲੇ ਮੈਂਬਰ ਨੂੰ ਉਸੇ ਲੜੀ ਵਿੱਚ ਅੱਗੇ ਲਿਜਾਓ।", application: "ਦਿਸ਼ਾ ਨਾ ਉਲਟੋ ਅਤੇ ਸਿਰਫ਼ ਉਹੀ ਸੰਬੰਧ ਲਵੋ ਜੋ ਕਥਨਾਂ ਤੋਂ ਲਾਜ਼ਮੀ ਹੈ।" };
  return { shortcut: "Build the boundaries with All/No first, then carry any Some-witness through that chain.", application: "Do not reverse directions or assume an overlap that the statements do not force." };
}

function trap(
  definition: SylQlDefinition,
  options: readonly GeneratedSylOption[],
  locale: SylLocale,
): { warning: string; diagnosticTag: string } {
  let diagnosticTag = options.find((option) => !option.isCorrect && option.errorLabel)?.errorLabel
    ?? "POSSIBILITY_TREATED_AS_DEFINITE";
  if (definition.scenarioGroup === "ONLY") diagnosticTag = "ONLY_DIRECTION_REVERSED";
  else if (definition.scenarioGroup === "FEW") diagnosticTag = "ONLY_FEW_REDUCED_TO_SOME";
  else if (definition.taskKind.includes("THREE_CONCLUSION")) diagnosticTag = "THREE_CONCLUSION_MASK_ERROR";
  else if (definition.taskKind.includes("EITHER_OR") || definition.taskKind === "CLASSIFY_CONCLUSION_PAIR") diagnosticTag = "EITHER_OR_NOT_EXCLUSIVE_OR_EXHAUSTIVE";
  else if (definition.taskKind.includes("MODAL") || definition.taskKind.includes("POSSIBILITY")) diagnosticTag = "POSSIBILITY_TREATED_AS_DEFINITE";

  if (locale === "hi-IN") {
    if (diagnosticTag === "ONLY_DIRECTION_REVERSED") return { warning: "‘केवल’ देखकर दोनों समूहों को बराबर न मानें। वाक्य की दिशा उलटकर ही समावेशन लिखें।", diagnosticTag };
    if (diagnosticTag === "ONLY_FEW_REDUCED_TO_SOME") return { warning: "‘केवल कुछ’ में दो बातें होती हैं—कुछ अंदर और कुछ बाहर। बाहर वाले हिस्से को भूलना उत्तर बदल देता है।", diagnosticTag };
    if (diagnosticTag.startsWith("EITHER_OR")) return { warning: "दो निष्कर्ष विपरीत दिखें तो भी तुरंत ‘या तो’ न चुनें। दोनों-साथ-सत्य और दोनों-साथ-असत्य की जाँच जरूरी है।", diagnosticTag };
    if (diagnosticTag === "THREE_CONCLUSION_MASK_ERROR") return { warning: "तीनों निष्कर्ष अलग-अलग जाँचें; एक सही निष्कर्ष देखकर पूरा संयोजन अनुमान से न चुनें।", diagnosticTag };
    return { warning: "किसी एक सुविधाजनक वेन चित्र को निश्चित प्रमाण न मानें। जो संबंध एक चित्र में बन सकता है, वह हर चित्र में बनना जरूरी नहीं है।", diagnosticTag };
  }
  if (locale === "pa-IN") {
    if (diagnosticTag === "ONLY_DIRECTION_REVERSED") return { warning: "‘ਕੇਵਲ’ ਵੇਖ ਕੇ ਦੋਵੇਂ ਸਮੂਹਾਂ ਨੂੰ ਬਰਾਬਰ ਨਾ ਮੰਨੋ। ਵਾਕ ਦੀ ਦਿਸ਼ਾ ਉਲਟ ਕੇ ਹੀ ਅੰਦਰਲਾ ਸੰਬੰਧ ਲਿਖੋ।", diagnosticTag };
    if (diagnosticTag === "ONLY_FEW_REDUCED_TO_SOME") return { warning: "‘ਕੇਵਲ ਕੁਝ’ ਵਿੱਚ ਦੋ ਗੱਲਾਂ ਹੁੰਦੀਆਂ ਹਨ—ਕੁਝ ਅੰਦਰ ਅਤੇ ਕੁਝ ਬਾਹਰ। ਬਾਹਰ ਵਾਲਾ ਹਿੱਸਾ ਭੁੱਲਣ ਨਾਲ ਉੱਤਰ ਬਦਲ ਜਾਂਦਾ ਹੈ।", diagnosticTag };
    if (diagnosticTag.startsWith("EITHER_OR")) return { warning: "ਦੋ ਨਤੀਜੇ ਉਲਟ ਲੱਗਣ ਤਾਂ ਵੀ ਤੁਰੰਤ ‘ਜਾਂ-ਤਾਂ’ ਨਾ ਚੁਣੋ। ਦੋਵੇਂ-ਇਕੱਠੇ-ਸਹੀ ਅਤੇ ਦੋਵੇਂ-ਇਕੱਠੇ-ਗਲਤ ਦੀ ਜਾਂਚ ਲਾਜ਼ਮੀ ਹੈ।", diagnosticTag };
    if (diagnosticTag === "THREE_CONCLUSION_MASK_ERROR") return { warning: "ਤਿੰਨਾਂ ਨਤੀਜਿਆਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਜਾਂਚੋ; ਇੱਕ ਸਹੀ ਨਤੀਜਾ ਵੇਖ ਕੇ ਪੂਰਾ ਜੋੜ ਅੰਦਾਜ਼ੇ ਨਾਲ ਨਾ ਚੁਣੋ।", diagnosticTag };
    return { warning: "ਕਿਸੇ ਇੱਕ ਸੁਵਿਧਾਜਨਕ ਵੇਨ ਚਿੱਤਰ ਨੂੰ ਨਿਸ਼ਚਿਤ ਸਬੂਤ ਨਾ ਮੰਨੋ। ਜੋ ਸੰਬੰਧ ਇੱਕ ਚਿੱਤਰ ਵਿੱਚ ਬਣ ਸਕਦਾ ਹੈ, ਉਹ ਹਰ ਚਿੱਤਰ ਵਿੱਚ ਬਣਨਾ ਲਾਜ਼ਮੀ ਨਹੀਂ।", diagnosticTag };
  }
  if (diagnosticTag === "ONLY_DIRECTION_REVERSED") return { warning: "Do not treat ‘only’ as equality. Reverse the inclusion direction exactly once.", diagnosticTag };
  if (diagnosticTag === "ONLY_FEW_REDUCED_TO_SOME") return { warning: "‘Only a few’ gives two facts: some inside and some outside. Forgetting the outside part changes the answer.", diagnosticTag };
  if (diagnosticTag.startsWith("EITHER_OR")) return { warning: "Opposite-looking conclusions are not automatically either-or. Test both-true and both-false cases.", diagnosticTag };
  if (diagnosticTag === "THREE_CONCLUSION_MASK_ERROR") return { warning: "Evaluate all three conclusions separately; do not guess the full combination after spotting one correct conclusion.", diagnosticTag };
  return { warning: "Do not treat one convenient Venn diagram as a definite proof. A relation that can appear in one diagram need not hold in every diagram.", diagnosticTag };
}

function focusConclusions(
  definition: SylQlDefinition,
  selected: SelectedLogic,
  correctOption: GeneratedSylOption,
): readonly PedagogicalDiagramFocus[] {
  const bySemantic = selected.conclusions.find((candidate) =>
    conclusionSemanticKey(candidate) === correctOption.semanticValue);
  if (bySemantic) {
    const index = selected.conclusions.indexOf(bySemantic);
    const primary: PedagogicalDiagramFocus = {
      label: ROMAN[index] ?? String(index + 1),
      conclusion: bySemantic.conclusion,
      classification: bySemantic.profile.classification,
    };
    if (bySemantic.profile.classification === "ENTAILED") {
      const uncertainty = selected.conclusions.find((candidate) => candidate.profile.classification === "UNDETERMINED");
      if (uncertainty) {
        const uncertaintyIndex = selected.conclusions.indexOf(uncertainty);
        return [primary, {
          label: ROMAN[uncertaintyIndex] ?? String(uncertaintyIndex + 1),
          conclusion: uncertainty.conclusion,
          classification: uncertainty.profile.classification,
        }];
      }
    }
    return [primary];
  }
  if (definition.renderer === "MODAL_CLASSIFICATION") {
    return selected.conclusions.map((candidate, index) => ({
      label: ROMAN[index] ?? String(index + 1),
      conclusion: candidate.conclusion,
      classification: candidate.profile.classification,
    }));
  }
  return selected.conclusions.slice(0, 3).map((candidate, index) => ({
    label: ROMAN[index] ?? String(index + 1),
    conclusion: candidate.conclusion,
    classification: candidate.profile.classification,
  }));
}

export function buildExplanation(
  definition: SylQlDefinition,
  selected: SelectedLogic,
  displayedPremises: readonly SurfacePremise[],
  locale: SylLocale,
  assignment: TermAssignment,
  options: readonly GeneratedSylOption[],
): SylExplanationTrace {
  const correctOption = options.find((option) => option.isCorrect);
  if (!correctOption) throw new Error("Explanation cannot find the correct option.");
  const copy = headings(locale);
  const steps = selected.conclusions.map((candidate, index) =>
    conclusionStep(candidate, index, displayedPremises, locale, assignment));
  const speed = shortcut(definition, displayedPremises, locale, assignment);
  const warning = trap(definition, options, locale);
  const focus = focusConclusions(definition, selected, correctOption);
  const diagram = renderPedagogicalVennDiagram(
    displayedPremises,
    focus,
    selected.pairStatus,
    locale,
    assignment,
    `${definition.qlId}-${selected.analysis.scenario.scenarioId}`,
  );

  return {
    schemaVersion: "syl-pedagogy-v2",
    tier1Concept: {
      heading: copy.tier1,
      coreRule: coreRule(definition, locale),
      premiseBreakdown: displayedPremises.map((premise) => teachingPoint(premise, locale, assignment)),
    },
    tier2StepByStep: {
      heading: copy.tier2,
      conclusionSteps: steps,
      combinationSummary: combinationSummary(definition, correctOption.text, locale),
    },
    tier3Shortcut: {
      heading: copy.tier3,
      shortcut: speed.shortcut,
      application: speed.application,
    },
    tier4Trap: {
      heading: copy.tier4,
      studentWarning: warning.warning,
      diagnosticTag: warning.diagnosticTag,
    },
    finalAnswer: correctOption.text,
    diagramRole: diagram.role,
    diagramMode: diagram.mode,
    diagramTitle: diagram.title,
    diagramCaption: diagram.caption,
    overlappingVennSvg: diagram.svg,
  };
}
