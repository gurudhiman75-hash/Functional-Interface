import type {
  CanonicalConclusion,
  SurfacePremise,
  SylLocale,
} from "../foundation/types";
import type {
  CategoryTerm,
  ModalAnswer,
  PairClassificationStatus,
  PairSemanticStatus,
  SylTaskKind,
} from "./types";

export type TermAssignment = Readonly<Record<string, CategoryTerm>>;

function termRecord(termId: string, assignment: TermAssignment): CategoryTerm {
  const term = assignment[termId];
  if (!term) throw new Error(`Missing term assignment for ${termId}.`);
  return term;
}

function label(termId: string, locale: SylLocale, assignment: TermAssignment): string {
  return termRecord(termId, assignment).labels[locale];
}

function singularLabel(termId: string, locale: SylLocale, assignment: TermAssignment): string {
  return termRecord(termId, assignment).singularLabels[locale];
}

function paAll(termId: string, assignment: TermAssignment): "ਸਾਰੇ" | "ਸਾਰੀਆਂ" {
  return termRecord(termId, assignment).paGender === "F" ? "ਸਾਰੀਆਂ" : "ਸਾਰੇ";
}

export function renderPremise(
  premise: SurfacePremise,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const subject = label(premise.subject, locale, assignment);
  const predicate = label(premise.predicate, locale, assignment);
  const singularSubject = singularLabel(premise.subject, locale, assignment);
  const singularPredicate = singularLabel(premise.predicate, locale, assignment);

  if (locale === "en-IN") {
    switch (premise.form) {
      case "ALL": return `All ${subject} are ${predicate}.`;
      case "NO": return `No ${subject} are ${predicate}.`;
      case "SOME": return `Some ${subject} are ${predicate}.`;
      case "SOME_NOT": return `Some ${subject} are not ${predicate}.`;
      case "ONLY": return `Only ${subject} are ${predicate}.`;
      case "ARE_ONLY": return `${subject[0].toUpperCase()}${subject.slice(1)} are only ${predicate}.`;
      case "A_FEW": return `A few ${subject} are ${predicate}.`;
      case "ONLY_A_FEW": return `Only a few ${subject} are ${predicate}.`;
      case "NOT_ALL": return `Not all ${subject} are ${predicate}.`;
      case "IDENTITY": return `All ${subject} are ${predicate}, and all ${predicate} are ${subject}.`;
      case "FEW": return `Few ${subject} are ${predicate}.`;
    }
  }

  if (locale === "hi-IN") {
    switch (premise.form) {
      case "ALL": return `सभी ${subject} ${predicate} हैं।`;
      case "NO": return `कोई भी ${singularSubject} ${singularPredicate} नहीं है।`;
      case "SOME": return `कुछ ${subject} ${predicate} हैं।`;
      case "SOME_NOT": return `कुछ ${subject} ${predicate} नहीं हैं।`;
      case "ONLY": return `केवल ${subject} ही ${predicate} हैं।`;
      case "ARE_ONLY": return `सभी ${subject} केवल ${predicate} हैं।`;
      case "A_FEW": return `कुछ ${subject} ${predicate} हैं।`;
      case "ONLY_A_FEW": return `केवल कुछ ${subject} ${predicate} हैं।`;
      case "NOT_ALL": return `कम-से-कम कुछ ${subject} ${predicate} नहीं हैं।`;
      case "IDENTITY": return `सभी ${subject} ${predicate} हैं और सभी ${predicate} ${subject} हैं।`;
      case "FEW": return `बहुत कम ${subject} ${predicate} हैं।`;
    }
  }

  switch (premise.form) {
    case "ALL": return `${paAll(premise.subject, assignment)} ${subject} ${predicate} ਹਨ।`;
    case "NO": return `ਕੋਈ ਵੀ ${singularSubject} ${singularPredicate} ਨਹੀਂ ਹੈ।`;
    case "SOME": return `ਕੁਝ ${subject} ${predicate} ਹਨ।`;
    case "SOME_NOT": return `ਕੁਝ ${subject} ${predicate} ਨਹੀਂ ਹਨ।`;
    case "ONLY": return `ਕੇਵਲ ${subject} ਹੀ ${predicate} ਹਨ।`;
    case "ARE_ONLY": return `${paAll(premise.subject, assignment)} ${subject} ਕੇਵਲ ${predicate} ਹਨ।`;
    case "A_FEW": return `ਕੁਝ ${subject} ${predicate} ਹਨ।`;
    case "ONLY_A_FEW": return `ਕੇਵਲ ਕੁਝ ${subject} ${predicate} ਹਨ।`;
    case "NOT_ALL": return `ਘੱਟੋ-ਘੱਟ ਕੁਝ ${subject} ${predicate} ਨਹੀਂ ਹਨ।`;
    case "IDENTITY": return `${paAll(premise.subject, assignment)} ${subject} ${predicate} ਹਨ ਅਤੇ ${paAll(premise.predicate, assignment)} ${predicate} ${subject} ਹਨ।`;
    case "FEW": return `ਬਹੁਤ ਥੋੜ੍ਹੇ ${subject} ${predicate} ਹਨ।`;
  }
}

export function renderConclusion(
  conclusion: CanonicalConclusion,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  return renderPremise({
    premiseId: conclusion.conclusionId,
    form: conclusion.form,
    subject: conclusion.subject,
    predicate: conclusion.predicate,
  }, locale, assignment);
}

export function renderNormalizedPremise(
  premise: SurfacePremise,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  if (premise.form === "ONLY") {
    const reversed: SurfacePremise = {
      ...premise,
      form: "ALL",
      subject: premise.predicate,
      predicate: premise.subject,
    };
    if (locale === "en-IN") return `${renderPremise(premise, locale, assignment)} means ${renderPremise(reversed, locale, assignment)}`;
    if (locale === "hi-IN") return `${renderPremise(premise, locale, assignment)} का अर्थ है: ${renderPremise(reversed, locale, assignment)}`;
    return `${renderPremise(premise, locale, assignment)} ਦਾ ਅਰਥ ਹੈ: ${renderPremise(reversed, locale, assignment)}`;
  }
  if (premise.form === "ONLY_A_FEW") {
    const overlap = renderPremise({ ...premise, form: "SOME" }, locale, assignment);
    const outside = renderPremise({ ...premise, form: "SOME_NOT" }, locale, assignment);
    if (locale === "en-IN") return `${renderPremise(premise, locale, assignment)} gives both: ${overlap} ${outside}`;
    if (locale === "hi-IN") return `${renderPremise(premise, locale, assignment)} से दो बातें निश्चित होती हैं: ${overlap} ${outside}`;
    return `${renderPremise(premise, locale, assignment)} ਤੋਂ ਦੋ ਗੱਲਾਂ ਪੱਕੀਆਂ ਹੁੰਦੀਆਂ ਹਨ: ${overlap} ${outside}`;
  }
  return renderPremise(premise, locale, assignment);
}

export function taskInstruction(task: SylTaskKind, locale: SylLocale): string {
  const en: Record<SylTaskKind, string> = {
    SELECT_DEFINITE_CONCLUSION: "Select the conclusion that definitely follows.",
    SELECT_NON_FOLLOWING_CONCLUSION: "Select the conclusion that does not necessarily follow.",
    TWO_CONCLUSION_FOLLOW_MASK: "Choose the option that correctly describes conclusions I and II.",
    THREE_CONCLUSION_FOLLOW_MASK: "Choose the option that correctly describes conclusions I, II and III.",
    SELECT_GENUINE_POSSIBILITY: "Select the conclusion that is possible but not definitely true.",
    SELECT_IMPOSSIBLE_CONCLUSION: "Select the conclusion that is impossible.",
    CLASSIFY_CONCLUSION_MODALITY: "Classify the given conclusion.",
    TWO_CONCLUSION_EITHER_OR: "Choose the correct relationship between conclusions I and II.",
    CLASSIFY_CONCLUSION_PAIR: "Classify the relationship between conclusions I and II.",
    ONLY_SELECT_DEFINITE_CONCLUSION: "Using the directional meaning of ‘only’, select the conclusion that definitely follows.",
    ONLY_TWO_CONCLUSION_MASK: "Using the directional meaning of ‘only’, choose the correct conclusion combination.",
    ONLY_MODAL_CLASSIFICATION: "Using the directional meaning of ‘only’, classify the given conclusion.",
    FEW_SELECT_DEFINITE_CONCLUSION: "Using the exact meaning of ‘a few’, ‘only a few’, or ‘not all’, select the conclusion that definitely follows.",
    FEW_MODAL_CLASSIFICATION: "Using the exact few-family and ‘not all’ constraints, classify the given conclusion.",
    FEW_TWO_CONCLUSION_MASK: "Using the exact few-family and ‘not all’ constraints, choose the correct conclusion combination.",
    MIXED_TWO_CONCLUSION_MASK: "Solve the mixed-form statements and choose the correct conclusion combination.",
    MIXED_THREE_CONCLUSION_MASK: "Solve the mixed-form statements and choose the correct three-conclusion combination.",
    MIXED_MODAL_CLASSIFICATION: "Solve the mixed-form statements and classify the given conclusion.",
  };
  if (locale === "en-IN") return en[task];

  const hi: Record<SylTaskKind, string> = {
    SELECT_DEFINITE_CONCLUSION: "उस निष्कर्ष को चुनिए जो निश्चित रूप से अनुसरण करता है।",
    SELECT_NON_FOLLOWING_CONCLUSION: "उस निष्कर्ष को चुनिए जो आवश्यक रूप से अनुसरण नहीं करता।",
    TWO_CONCLUSION_FOLLOW_MASK: "निष्कर्ष I और II के बारे में सही विकल्प चुनिए।",
    THREE_CONCLUSION_FOLLOW_MASK: "निष्कर्ष I, II और III के बारे में सही विकल्प चुनिए।",
    SELECT_GENUINE_POSSIBILITY: "उस निष्कर्ष को चुनिए जो संभव है, पर निश्चित नहीं है।",
    SELECT_IMPOSSIBLE_CONCLUSION: "उस निष्कर्ष को चुनिए जो असंभव है।",
    CLASSIFY_CONCLUSION_MODALITY: "दिए गए निष्कर्ष की सही स्थिति चुनिए।",
    TWO_CONCLUSION_EITHER_OR: "निष्कर्ष I और II के बीच सही संबंध चुनिए।",
    CLASSIFY_CONCLUSION_PAIR: "निष्कर्ष I और II के संबंध की सही स्थिति चुनिए।",
    ONLY_SELECT_DEFINITE_CONCLUSION: "‘केवल’ की सही दिशा लगाकर निश्चित निष्कर्ष चुनिए।",
    ONLY_TWO_CONCLUSION_MASK: "‘केवल’ की सही दिशा लगाकर सही निष्कर्ष-संयोजन चुनिए।",
    ONLY_MODAL_CLASSIFICATION: "‘केवल’ की सही दिशा लगाकर निष्कर्ष की स्थिति चुनिए।",
    FEW_SELECT_DEFINITE_CONCLUSION: "‘कुछ’, ‘केवल कुछ’ और ‘सभी नहीं’ का सही अर्थ लगाकर निश्चित निष्कर्ष चुनिए।",
    FEW_MODAL_CLASSIFICATION: "‘कुछ’ और ‘सभी नहीं’ की सही शर्तें लगाकर निष्कर्ष की स्थिति चुनिए।",
    FEW_TWO_CONCLUSION_MASK: "‘कुछ’ और ‘सभी नहीं’ की सही शर्तें लगाकर सही निष्कर्ष-संयोजन चुनिए।",
    MIXED_TWO_CONCLUSION_MASK: "मिश्रित कथनों को हल करके सही निष्कर्ष-संयोजन चुनिए।",
    MIXED_THREE_CONCLUSION_MASK: "मिश्रित कथनों को हल करके तीन निष्कर्षों का सही संयोजन चुनिए।",
    MIXED_MODAL_CLASSIFICATION: "मिश्रित कथनों को हल करके निष्कर्ष की सही स्थिति चुनिए।",
  };
  if (locale === "hi-IN") return hi[task];

  const pa: Record<SylTaskKind, string> = {
    SELECT_DEFINITE_CONCLUSION: "ਉਹ ਨਤੀਜਾ ਚੁਣੋ ਜੋ ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ ਹੈ।",
    SELECT_NON_FOLLOWING_CONCLUSION: "ਉਹ ਨਤੀਜਾ ਚੁਣੋ ਜੋ ਲਾਜ਼ਮੀ ਤੌਰ 'ਤੇ ਸਹੀ ਨਹੀਂ ਹੈ।",
    TWO_CONCLUSION_FOLLOW_MASK: "ਨਤੀਜੇ I ਅਤੇ II ਬਾਰੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।",
    THREE_CONCLUSION_FOLLOW_MASK: "ਨਤੀਜੇ I, II ਅਤੇ III ਬਾਰੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।",
    SELECT_GENUINE_POSSIBILITY: "ਉਹ ਨਤੀਜਾ ਚੁਣੋ ਜੋ ਸੰਭਵ ਹੈ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ।",
    SELECT_IMPOSSIBLE_CONCLUSION: "ਉਹ ਨਤੀਜਾ ਚੁਣੋ ਜੋ ਅਸੰਭਵ ਹੈ।",
    CLASSIFY_CONCLUSION_MODALITY: "ਦਿੱਤੇ ਨਤੀਜੇ ਦੀ ਸਹੀ ਸਥਿਤੀ ਚੁਣੋ।",
    TWO_CONCLUSION_EITHER_OR: "ਨਤੀਜੇ I ਅਤੇ II ਵਿਚਲਾ ਸਹੀ ਸੰਬੰਧ ਚੁਣੋ।",
    CLASSIFY_CONCLUSION_PAIR: "ਨਤੀਜੇ I ਅਤੇ II ਦੇ ਸੰਬੰਧ ਦੀ ਸਹੀ ਸਥਿਤੀ ਚੁਣੋ।",
    ONLY_SELECT_DEFINITE_CONCLUSION: "‘ਕੇਵਲ’ ਦੀ ਸਹੀ ਦਿਸ਼ਾ ਲਗਾ ਕੇ ਨਿਸ਼ਚਿਤ ਨਤੀਜਾ ਚੁਣੋ।",
    ONLY_TWO_CONCLUSION_MASK: "‘ਕੇਵਲ’ ਦੀ ਸਹੀ ਦਿਸ਼ਾ ਲਗਾ ਕੇ ਸਹੀ ਨਤੀਜਾ-ਜੋੜ ਚੁਣੋ।",
    ONLY_MODAL_CLASSIFICATION: "‘ਕੇਵਲ’ ਦੀ ਸਹੀ ਦਿਸ਼ਾ ਲਗਾ ਕੇ ਨਤੀਜੇ ਦੀ ਸਥਿਤੀ ਚੁਣੋ।",
    FEW_SELECT_DEFINITE_CONCLUSION: "‘ਕੁਝ’, ‘ਕੇਵਲ ਕੁਝ’ ਅਤੇ ‘ਸਾਰੇ ਨਹੀਂ’ ਦਾ ਸਹੀ ਅਰਥ ਲਗਾ ਕੇ ਨਿਸ਼ਚਿਤ ਨਤੀਜਾ ਚੁਣੋ।",
    FEW_MODAL_CLASSIFICATION: "‘ਕੁਝ’ ਅਤੇ ‘ਸਾਰੇ ਨਹੀਂ’ ਦੀਆਂ ਸਹੀ ਸ਼ਰਤਾਂ ਲਗਾ ਕੇ ਨਤੀਜੇ ਦੀ ਸਥਿਤੀ ਚੁਣੋ।",
    FEW_TWO_CONCLUSION_MASK: "‘ਕੁਝ’ ਅਤੇ ‘ਸਾਰੇ ਨਹੀਂ’ ਦੀਆਂ ਸਹੀ ਸ਼ਰਤਾਂ ਲਗਾ ਕੇ ਸਹੀ ਨਤੀਜਾ-ਜੋੜ ਚੁਣੋ।",
    MIXED_TWO_CONCLUSION_MASK: "ਮਿਲੇ-ਜੁਲੇ ਕਥਨਾਂ ਨੂੰ ਹੱਲ ਕਰਕੇ ਸਹੀ ਨਤੀਜਾ-ਜੋੜ ਚੁਣੋ।",
    MIXED_THREE_CONCLUSION_MASK: "ਮਿਲੇ-ਜੁਲੇ ਕਥਨਾਂ ਨੂੰ ਹੱਲ ਕਰਕੇ ਤਿੰਨ ਨਤੀਜਿਆਂ ਦਾ ਸਹੀ ਜੋੜ ਚੁਣੋ।",
    MIXED_MODAL_CLASSIFICATION: "ਮਿਲੇ-ਜੁਲੇ ਕਥਨਾਂ ਨੂੰ ਹੱਲ ਕਰਕੇ ਨਤੀਜੇ ਦੀ ਸਹੀ ਸਥਿਤੀ ਚੁਣੋ।",
  };
  return pa[task];
}

export function commonPreamble(locale: SylLocale): string {
  if (locale === "en-IN") return "Treat every statement as true, even if it differs from common knowledge.";
  if (locale === "hi-IN") return "सभी कथनों को सत्य मानिए, चाहे वे सामान्य ज्ञान से अलग हों।";
  return "ਸਾਰੇ ਕਥਨਾਂ ਨੂੰ ਸਹੀ ਮੰਨੋ, ਭਾਵੇਂ ਉਹ ਆਮ ਜਾਣਕਾਰੀ ਤੋਂ ਵੱਖ ਹੋਣ।";
}

export function pairSemanticLabel(status: PairSemanticStatus, locale: SylLocale): string {
  const en: Record<PairSemanticStatus, string> = {
    ONLY_FIRST_FOLLOWS: "Only conclusion I follows",
    ONLY_SECOND_FOLLOWS: "Only conclusion II follows",
    BOTH_FOLLOW: "Both conclusions I and II follow",
    NEITHER_FOLLOWS: "Neither conclusion I nor II follows",
    EITHER_OR_FOLLOWS: "Either conclusion I or conclusion II follows",
  };
  const hi: Record<PairSemanticStatus, string> = {
    ONLY_FIRST_FOLLOWS: "केवल निष्कर्ष I अनुसरण करता है",
    ONLY_SECOND_FOLLOWS: "केवल निष्कर्ष II अनुसरण करता है",
    BOTH_FOLLOW: "निष्कर्ष I और II दोनों अनुसरण करते हैं",
    NEITHER_FOLLOWS: "न तो निष्कर्ष I और न ही निष्कर्ष II अनुसरण करता है",
    EITHER_OR_FOLLOWS: "निष्कर्ष I या निष्कर्ष II में से केवल एक अनुसरण करता है",
  };
  const pa: Record<PairSemanticStatus, string> = {
    ONLY_FIRST_FOLLOWS: "ਕੇਵਲ ਨਤੀਜਾ I ਸਹੀ ਹੈ",
    ONLY_SECOND_FOLLOWS: "ਕੇਵਲ ਨਤੀਜਾ II ਸਹੀ ਹੈ",
    BOTH_FOLLOW: "ਨਤੀਜੇ I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ",
    NEITHER_FOLLOWS: "ਨਾ ਨਤੀਜਾ I ਅਤੇ ਨਾ ਹੀ ਨਤੀਜਾ II ਸਹੀ ਹੈ",
    EITHER_OR_FOLLOWS: "ਨਤੀਜਾ I ਜਾਂ ਨਤੀਜਾ II ਵਿੱਚੋਂ ਕੇਵਲ ਇੱਕ ਸਹੀ ਹੈ",
  };
  return locale === "en-IN" ? en[status] : locale === "hi-IN" ? hi[status] : pa[status];
}

export function pairClassificationLabel(status: PairClassificationStatus, locale: SylLocale): string {
  const en: Record<PairClassificationStatus, string> = {
    EITHER_OR: "They form a genuine either-or pair",
    BOTH_FOLLOW: "Both conclusions definitely follow",
    ONLY_FIRST_FOLLOWS: "Only conclusion I definitely follows",
    ONLY_SECOND_FOLLOWS: "Only conclusion II definitely follows",
    NO_COMPLEMENTARY_RELATION: "They do not form a complementary pair",
  };
  const hi: Record<PairClassificationStatus, string> = {
    EITHER_OR: "दोनों निष्कर्ष एक सही ‘या तो–या’ पूरक जोड़ी बनाते हैं",
    BOTH_FOLLOW: "दोनों निष्कर्ष निश्चित रूप से अनुसरण करते हैं",
    ONLY_FIRST_FOLLOWS: "केवल निष्कर्ष I निश्चित रूप से अनुसरण करता है",
    ONLY_SECOND_FOLLOWS: "केवल निष्कर्ष II निश्चित रूप से अनुसरण करता है",
    NO_COMPLEMENTARY_RELATION: "दोनों निष्कर्ष पूरक जोड़ी नहीं बनाते",
  };
  const pa: Record<PairClassificationStatus, string> = {
    EITHER_OR: "ਦੋਵੇਂ ਨਤੀਜੇ ਇੱਕ ਸਹੀ ‘ਜਾਂ-ਤਾਂ’ ਪੂਰਕ ਜੋੜੀ ਬਣਾਉਂਦੇ ਹਨ",
    BOTH_FOLLOW: "ਦੋਵੇਂ ਨਤੀਜੇ ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ ਹਨ",
    ONLY_FIRST_FOLLOWS: "ਕੇਵਲ ਨਤੀਜਾ I ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ ਹੈ",
    ONLY_SECOND_FOLLOWS: "ਕੇਵਲ ਨਤੀਜਾ II ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ ਹੈ",
    NO_COMPLEMENTARY_RELATION: "ਦੋਵੇਂ ਨਤੀਜੇ ਪੂਰਕ ਜੋੜੀ ਨਹੀਂ ਬਣਾਉਂਦੇ",
  };
  return locale === "en-IN" ? en[status] : locale === "hi-IN" ? hi[status] : pa[status];
}

export function modalLabel(status: ModalAnswer, locale: SylLocale): string {
  const en: Record<ModalAnswer, string> = {
    DEFINITELY_TRUE: "Definitely true",
    POSSIBLY_TRUE_NOT_DEFINITE: "Possible, but not definitely true",
    IMPOSSIBLE: "Impossible",
    PREMISES_INCONSISTENT: "The statements are inconsistent",
  };
  const hi: Record<ModalAnswer, string> = {
    DEFINITELY_TRUE: "निश्चित रूप से सत्य",
    POSSIBLY_TRUE_NOT_DEFINITE: "संभव, पर निश्चित रूप से सत्य नहीं",
    IMPOSSIBLE: "असंभव",
    PREMISES_INCONSISTENT: "कथन परस्पर असंगत हैं",
  };
  const pa: Record<ModalAnswer, string> = {
    DEFINITELY_TRUE: "ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ",
    POSSIBLY_TRUE_NOT_DEFINITE: "ਸੰਭਵ, ਪਰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ",
    IMPOSSIBLE: "ਅਸੰਭਵ",
    PREMISES_INCONSISTENT: "ਕਥਨ ਆਪਸ ਵਿੱਚ ਅਸੰਗਤ ਹਨ",
  };
  return locale === "en-IN" ? en[status] : locale === "hi-IN" ? hi[status] : pa[status];
}

export function maskLabel(mask: number, conclusionCount: 2 | 3, locale: SylLocale): string {
  if (conclusionCount === 2) {
    const status: PairSemanticStatus = mask === 1
      ? "ONLY_FIRST_FOLLOWS"
      : mask === 2
        ? "ONLY_SECOND_FOLLOWS"
        : mask === 3
          ? "BOTH_FOLLOW"
          : "NEITHER_FOLLOWS";
    return pairSemanticLabel(status, locale);
  }
  const labels = ["I", "II", "III"];
  const selected = labels.filter((_, index) => (mask & (1 << index)) !== 0);
  if (locale === "en-IN") {
    if (selected.length === 0) return "None of the conclusions follows";
    if (selected.length === 3) return "All three conclusions follow";
    return `Only conclusion${selected.length > 1 ? "s" : ""} ${selected.join(" and ")} follow${selected.length === 1 ? "s" : ""}`;
  }
  if (locale === "hi-IN") {
    if (selected.length === 0) return "कोई भी निष्कर्ष अनुसरण नहीं करता";
    if (selected.length === 3) return "तीनों निष्कर्ष अनुसरण करते हैं";
    return selected.length === 1
      ? `केवल निष्कर्ष ${selected[0]} अनुसरण करता है`
      : `केवल निष्कर्ष ${selected.join(" और ")} अनुसरण करते हैं`;
  }
  if (selected.length === 0) return "ਕੋਈ ਵੀ ਨਤੀਜਾ ਸਹੀ ਨਹੀਂ ਹੈ";
  if (selected.length === 3) return "ਤਿੰਨੇ ਨਤੀਜੇ ਸਹੀ ਹਨ";
  return selected.length === 1
    ? `ਕੇਵਲ ਨਤੀਜਾ ${selected[0]} ਸਹੀ ਹੈ`
    : `ਕੇਵਲ ਨਤੀਜੇ ${selected.join(" ਅਤੇ ")} ਸਹੀ ਹਨ`;
}
