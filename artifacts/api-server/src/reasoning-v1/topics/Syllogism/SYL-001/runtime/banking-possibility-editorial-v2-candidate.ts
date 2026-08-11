import type { SylLocale, TermId } from "../foundation/types";
import { analyzeScenario } from "./analysis";
import {
  generateBankingPossibilityReviewQuestionV2Corrected,
  type BankingPossibilityReviewQuestionV2Corrected,
} from "./banking-possibility-review-question-v2-corrected";
import type { TermAssignment } from "./localization";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";

export type BankingPossibilityEditorialV2Candidate = Omit<
  BankingPossibilityReviewQuestionV2Corrected,
  "explanation"
> & {
  explanation: readonly [string, string];
};

type ConclusionRecord = BankingPossibilityReviewQuestionV2Corrected["conclusions"][number];

function classLabel(term: TermId, locale: SylLocale, assignment: TermAssignment): string {
  return assignment[term]?.labels[locale] ?? term;
}

function finalVerdict(locale: SylLocale, label: "I" | "II", follows: boolean): string {
  if (locale === "hi-IN") {
    return follows
      ? `इसलिए निष्कर्ष ${label} अनुसरण करता है।`
      : `इसलिए निष्कर्ष ${label} अनुसरण नहीं करता।`;
  }
  if (locale === "pa-IN") {
    return follows
      ? `ਇਸ ਲਈ ਨਤੀਜਾ ${label} ਸਹੀ ਹੈ।`
      : `ਇਸ ਲਈ ਨਤੀਜਾ ${label} ਸਹੀ ਨਹੀਂ ਹੈ।`;
  }
  return follows
    ? `Therefore Conclusion ${label} follows.`
    : `Therefore Conclusion ${label} does not follow.`;
}

function possibilityOpenBody(
  record: ConclusionRecord,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const subject = classLabel(record.canonicalConclusion.subject, locale, assignment);
  const predicate = classLabel(record.canonicalConclusion.predicate, locale, assignment);
  const form = record.canonicalConclusion.form;

  if (locale === "hi-IN") {
    if (form === "ALL") {
      return `कथन पूरे “${subject}” वर्ग को “${predicate}” वर्ग के अंदर रखना अनिवार्य नहीं करते, लेकिन ऐसी व्यवस्था को रोकते भी नहीं हैं जिसमें सभी “${subject}” “${predicate}” हों। एक वैध व्यवस्था में यह संबंध सत्य और दूसरी में असत्य हो सकता है; इसलिए यह खुली संभावना है। बैंकिंग परीक्षा के ऐसे प्रश्नों में खुली संभावना वाला निष्कर्ष स्वीकार किया जाता है।`;
    }
    if (form === "SOME") {
      return `कथन “${subject}” और “${predicate}” के बीच कुछ साझा सदस्य होने को न तो अनिवार्य करते हैं और न ही असंभव बनाते हैं। कम-से-कम एक वैध व्यवस्था में दोनों वर्गों का साझा भाग हो सकता है और दूसरी में यह आवश्यक नहीं है; इसलिए यह खुली संभावना है। बैंकिंग परीक्षा के ऐसे प्रश्नों में खुली संभावना वाला निष्कर्ष स्वीकार किया जाता है।`;
    }
    return `कथन “${subject}” के कुछ सदस्यों को “${predicate}” से बाहर रखना न तो अनिवार्य करते हैं और न ही असंभव बनाते हैं। कम-से-कम एक वैध व्यवस्था में “${subject}” का कुछ भाग “${predicate}” से बाहर हो सकता है और दूसरी में ऐसा होना आवश्यक नहीं है; इसलिए यह खुली संभावना है। बैंकिंग परीक्षा के ऐसे प्रश्नों में खुली संभावना वाला निष्कर्ष स्वीकार किया जाता है।`;
  }

  if (locale === "pa-IN") {
    if (form === "ALL") {
      return `ਕਥਨ ਪੂਰੇ “${subject}” ਵਰਗ ਨੂੰ “${predicate}” ਵਰਗ ਦੇ ਅੰਦਰ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਰਦੇ, ਪਰ ਉਹ ਐਸੀ ਬਣਤਰ ਨੂੰ ਰੋਕਦੇ ਵੀ ਨਹੀਂ ਜਿਸ ਵਿੱਚ ਸਾਰੇ “${subject}” “${predicate}” ਹੋਣ। ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਇਹ ਸੰਬੰਧ ਸੱਚ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ਝੂਠ ਹੋ ਸਕਦਾ ਹੈ; ਇਸ ਲਈ ਇਹ ਖੁੱਲ੍ਹੀ ਸੰਭਾਵਨਾ ਹੈ। ਬੈਂਕਿੰਗ ਪ੍ਰੀਖਿਆ ਦੇ ਅਜਿਹੇ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਖੁੱਲ੍ਹੀ ਸੰਭਾਵਨਾ ਵਾਲਾ ਨਤੀਜਾ ਸਵੀਕਾਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`;
    }
    if (form === "SOME") {
      return `ਕਥਨ “${subject}” ਅਤੇ “${predicate}” ਵਿਚ ਕੁਝ ਸਾਂਝੇ ਮੈਂਬਰ ਹੋਣ ਨੂੰ ਨਾ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ ਅਤੇ ਨਾ ਅਸੰਭਵ ਬਣਾਉਂਦੇ ਹਨ। ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਦੋਵੇਂ ਵਰਗਾਂ ਦਾ ਸਾਂਝਾ ਹਿੱਸਾ ਹੋ ਸਕਦਾ ਹੈ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ਇਹ ਲਾਜ਼ਮੀ ਨਹੀਂ; ਇਸ ਲਈ ਇਹ ਖੁੱਲ੍ਹੀ ਸੰਭਾਵਨਾ ਹੈ। ਬੈਂਕਿੰਗ ਪ੍ਰੀਖਿਆ ਦੇ ਅਜਿਹੇ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਖੁੱਲ੍ਹੀ ਸੰਭਾਵਨਾ ਵਾਲਾ ਨਤੀਜਾ ਸਵੀਕਾਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`;
    }
    return `ਕਥਨ “${subject}” ਦੇ ਕੁਝ ਮੈਂਬਰਾਂ ਨੂੰ “${predicate}” ਤੋਂ ਬਾਹਰ ਰੱਖਣਾ ਨਾ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ ਅਤੇ ਨਾ ਅਸੰਭਵ ਬਣਾਉਂਦੇ ਹਨ। ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ “${subject}” ਦਾ ਕੁਝ ਹਿੱਸਾ “${predicate}” ਤੋਂ ਬਾਹਰ ਹੋ ਸਕਦਾ ਹੈ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ਇਹ ਲਾਜ਼ਮੀ ਨਹੀਂ; ਇਸ ਲਈ ਇਹ ਖੁੱਲ੍ਹੀ ਸੰਭਾਵਨਾ ਹੈ। ਬੈਂਕਿੰਗ ਪ੍ਰੀਖਿਆ ਦੇ ਅਜਿਹੇ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਖੁੱਲ੍ਹੀ ਸੰਭਾਵਨਾ ਵਾਲਾ ਨਤੀਜਾ ਸਵੀਕਾਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`;
  }

  if (form === "ALL") {
    return `The statements do not force the whole “${subject}” class inside the “${predicate}” class, but they also do not forbid an arrangement in which all “${subject}” are “${predicate}”. The relation can be true in one valid arrangement and false in another, so it is a genuine open possibility. In this Banking possibility convention, an open possibility is accepted.`;
  }
  if (form === "SOME") {
    return `The statements neither force nor forbid some overlap between the “${subject}” and “${predicate}” classes. At least one valid arrangement can contain a shared member, while another need not; therefore this is a genuine open possibility. In this Banking possibility convention, an open possibility is accepted.`;
  }
  return `The statements neither force nor forbid some “${subject}” lying outside “${predicate}”. At least one valid arrangement can place part of “${subject}” outside “${predicate}”, while another need not; therefore this is a genuine open possibility. In this Banking possibility convention, an open possibility is accepted.`;
}

function possibilityDefiniteBody(
  record: ConclusionRecord,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const subject = classLabel(record.canonicalConclusion.subject, locale, assignment);
  const predicate = classLabel(record.canonicalConclusion.predicate, locale, assignment);
  const form = record.canonicalConclusion.form;

  if (locale === "hi-IN") {
    const relation = form === "ALL"
      ? `सभी “${subject}” का “${predicate}” होना`
      : form === "SOME"
        ? `कुछ “${subject}” का “${predicate}” होना`
        : `कुछ “${subject}” का “${predicate}” न होना`;
    return `कथनों से ${relation} हर वैध व्यवस्था में पहले से निश्चित है। यह केवल “हो सकता है” वाली खुली स्थिति नहीं है। बैंकिंग परीक्षा के इस संभावना-प्रकार में जो संबंध पहले से निश्चित हो, उसे केवल संभावना के रूप में दिया गया निष्कर्ष स्वीकार नहीं किया जाता।`;
  }

  if (locale === "pa-IN") {
    const relation = form === "ALL"
      ? `ਸਾਰੇ “${subject}” ਦਾ “${predicate}” ਹੋਣਾ`
      : form === "SOME"
        ? `ਕੁਝ “${subject}” ਦਾ “${predicate}” ਹੋਣਾ`
        : `ਕੁਝ “${subject}” ਦਾ “${predicate}” ਨਾ ਹੋਣਾ`;
    return `ਕਥਨਾਂ ਤੋਂ ${relation} ਹਰ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਪਹਿਲਾਂ ਹੀ ਪੱਕਾ ਹੈ। ਇਹ ਸਿਰਫ਼ “ਹੋ ਸਕਦਾ ਹੈ” ਵਾਲੀ ਖੁੱਲ੍ਹੀ ਸਥਿਤੀ ਨਹੀਂ ਹੈ। ਬੈਂਕਿੰਗ ਪ੍ਰੀਖਿਆ ਦੇ ਇਸ ਸੰਭਾਵਨਾ-ਪ੍ਰਕਾਰ ਵਿੱਚ ਜੋ ਸੰਬੰਧ ਪਹਿਲਾਂ ਹੀ ਪੱਕਾ ਹੋਵੇ, ਉਸ ਨੂੰ ਕੇਵਲ ਸੰਭਾਵਨਾ ਵਜੋਂ ਦਿੱਤਾ ਨਤੀਜਾ ਸਵੀਕਾਰ ਨਹੀਂ ਕੀਤਾ ਜਾਂਦਾ।`;
  }

  const relation = form === "ALL"
    ? `all “${subject}” being “${predicate}”`
    : form === "SOME"
      ? `some “${subject}” being “${predicate}”`
      : `some “${subject}” not being “${predicate}”`;
  return `The statements already make ${relation} true in every valid arrangement. This is not an open “may be” relation. Under this Banking possibility convention, a relation that is already definite is not accepted when the conclusion presents it only as a possibility.`;
}

function possibilityImpossibleBody(
  record: ConclusionRecord,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const subject = classLabel(record.canonicalConclusion.subject, locale, assignment);
  const predicate = classLabel(record.canonicalConclusion.predicate, locale, assignment);
  const form = record.canonicalConclusion.form;

  if (locale === "hi-IN") {
    const relation = form === "ALL"
      ? `सभी “${subject}” को “${predicate}” के अंदर रखने वाली`
      : form === "SOME"
        ? `“${subject}” और “${predicate}” का साझा सदस्य बनाने वाली`
        : `कुछ “${subject}” को “${predicate}” से बाहर रखने वाली`;
    return `कथनों के अनुरूप कोई भी वैध व्यवस्था ${relation} स्थिति नहीं बना सकती। इसलिए यह संबंध केवल अनिश्चित नहीं, बल्कि असंभव है; संभावना वाला निष्कर्ष अनुसरण नहीं करता।`;
  }

  if (locale === "pa-IN") {
    const relation = form === "ALL"
      ? `ਸਾਰੇ “${subject}” ਨੂੰ “${predicate}” ਦੇ ਅੰਦਰ ਰੱਖਣ ਵਾਲੀ`
      : form === "SOME"
        ? `“${subject}” ਅਤੇ “${predicate}” ਦਾ ਸਾਂਝਾ ਮੈਂਬਰ ਬਣਾਉਣ ਵਾਲੀ`
        : `ਕੁਝ “${subject}” ਨੂੰ “${predicate}” ਤੋਂ ਬਾਹਰ ਰੱਖਣ ਵਾਲੀ`;
    return `ਕਥਨਾਂ ਅਨੁਸਾਰ ਕੋਈ ਵੀ ਵੈਧ ਬਣਤਰ ${relation} ਸਥਿਤੀ ਨਹੀਂ ਬਣਾ ਸਕਦੀ। ਇਸ ਲਈ ਇਹ ਸੰਬੰਧ ਸਿਰਫ਼ ਅਣਨਿਰਧਾਰਤ ਨਹੀਂ, ਸਗੋਂ ਅਸੰਭਵ ਹੈ; ਸੰਭਾਵਨਾ ਵਾਲਾ ਨਤੀਜਾ ਸਹੀ ਨਹੀਂ ਹੈ।`;
  }

  const relation = form === "ALL"
    ? `put the whole “${subject}” class inside “${predicate}”`
    : form === "SOME"
      ? `place a shared member in both “${subject}” and “${predicate}”`
      : `place some “${subject}” outside “${predicate}”`;
  return `No valid arrangement allowed by the statements can ${relation}. The relation is not merely uncertain; it is impossible, so the possibility conclusion does not follow.`;
}

function possibilityExplanation(
  record: ConclusionRecord,
  label: "I" | "II",
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const body = record.possibilityDisposition === "OPEN_POSSIBILITY"
    ? possibilityOpenBody(record, locale, assignment)
    : record.possibilityDisposition === "ALREADY_DEFINITE"
      ? possibilityDefiniteBody(record, locale, assignment)
      : possibilityImpossibleBody(record, locale, assignment);
  const separator = locale === "en-IN" ? " " : " ";
  return `${label}: ${body}${separator}${finalVerdict(locale, label, record.follows)}`;
}

function ordinaryExplanation(
  record: ConclusionRecord,
  label: "I" | "II",
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const subject = classLabel(record.canonicalConclusion.subject, locale, assignment);
  const predicate = classLabel(record.canonicalConclusion.predicate, locale, assignment);
  const form = record.canonicalConclusion.form;

  if (locale === "hi-IN") {
    if (record.classification === "ENTAILED") {
      const relation = form === "ALL"
        ? `पूरा “${subject}” वर्ग “${predicate}” के अंदर होना`
        : form === "NO"
          ? `“${subject}” और “${predicate}” का अलग होना`
          : form === "SOME"
            ? `कुछ “${subject}” का “${predicate}” होना`
            : `कुछ “${subject}” का “${predicate}” न होना`;
      return `${label}: कथन ${relation} हर वैध व्यवस्था में अनिवार्य करते हैं। सामान्य निष्कर्ष तभी अनुसरण करता है जब वह हर वैध व्यवस्था में सत्य हो। ${finalVerdict(locale, label, true)}`;
    }
    if (record.classification === "CONTRADICTED") {
      return `${label}: कथनों के अनुरूप कोई वैध व्यवस्था इस निष्कर्ष को सत्य नहीं बना सकती; कथन इसके विपरीत संबंध को बाध्य करते हैं। ${finalVerdict(locale, label, false)}`;
    }
    return `${label}: यह संबंध किसी वैध व्यवस्था में सत्य हो सकता है, लेकिन हर वैध व्यवस्था में अनिवार्य नहीं है। सामान्य निष्कर्ष के लिए केवल संभावना पर्याप्त नहीं होती। ${finalVerdict(locale, label, false)}`;
  }

  if (locale === "pa-IN") {
    if (record.classification === "ENTAILED") {
      const relation = form === "ALL"
        ? `ਪੂਰੇ “${subject}” ਵਰਗ ਦਾ “${predicate}” ਦੇ ਅੰਦਰ ਹੋਣਾ`
        : form === "NO"
          ? `“${subject}” ਅਤੇ “${predicate}” ਦਾ ਵੱਖ ਹੋਣਾ`
          : form === "SOME"
            ? `ਕੁਝ “${subject}” ਦਾ “${predicate}” ਹੋਣਾ`
            : `ਕੁਝ “${subject}” ਦਾ “${predicate}” ਨਾ ਹੋਣਾ`;
      return `${label}: ਕਥਨ ${relation} ਹਰ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ। ਆਮ ਨਤੀਜਾ ਤਦ ਹੀ ਸਹੀ ਹੁੰਦਾ ਹੈ ਜਦੋਂ ਉਹ ਹਰ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਸੱਚ ਹੋਵੇ। ${finalVerdict(locale, label, true)}`;
    }
    if (record.classification === "CONTRADICTED") {
      return `${label}: ਕਥਨਾਂ ਅਨੁਸਾਰ ਕੋਈ ਵੀ ਵੈਧ ਬਣਤਰ ਇਸ ਨਤੀਜੇ ਨੂੰ ਸੱਚ ਨਹੀਂ ਬਣਾ ਸਕਦੀ; ਕਥਨ ਇਸ ਦੇ ਉਲਟ ਸੰਬੰਧ ਨੂੰ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ। ${finalVerdict(locale, label, false)}`;
    }
    return `${label}: ਇਹ ਸੰਬੰਧ ਕਿਸੇ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਸੱਚ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਹਰ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ। ਆਮ ਨਤੀਜੇ ਲਈ ਸਿਰਫ਼ ਸੰਭਾਵਨਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੁੰਦੀ। ${finalVerdict(locale, label, false)}`;
  }

  if (record.classification === "ENTAILED") {
    const relation = form === "ALL"
      ? `the whole “${subject}” class to lie inside “${predicate}”`
      : form === "NO"
        ? `the “${subject}” and “${predicate}” classes to remain disjoint`
        : form === "SOME"
          ? `some “${subject}” to be “${predicate}”`
          : `some “${subject}” not to be “${predicate}”`;
    return `${label}: The statements force ${relation} in every valid arrangement. An ordinary conclusion follows only when it is true in every valid arrangement. ${finalVerdict(locale, label, true)}`;
  }
  if (record.classification === "CONTRADICTED") {
    return `${label}: No valid arrangement allowed by the statements can make this conclusion true; the statements force the opposite relation. ${finalVerdict(locale, label, false)}`;
  }
  return `${label}: This relation can be true in a valid arrangement, but it is not forced in every valid arrangement. Mere possibility is not enough for an ordinary conclusion. ${finalVerdict(locale, label, false)}`;
}

function explanationFor(
  record: ConclusionRecord,
  label: "I" | "II",
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  return record.mode === "POSSIBILITY"
    ? possibilityExplanation(record, label, locale, assignment)
    : ordinaryExplanation(record, label, locale, assignment);
}

export function generateBankingPossibilityEditorialV2Candidate(
  seed: number,
  locale: SylLocale,
): BankingPossibilityEditorialV2Candidate {
  const question = generateBankingPossibilityReviewQuestionV2Corrected(seed, locale);
  const scenario = scenariosForGroup(question.scenarioGroup).find((entry) =>
    entry.scenarioId === question.scenarioId);
  if (!scenario) {
    throw new Error(`${question.scenarioId}: scenario missing for corrected V2 editorial candidate.`);
  }
  const analysis = analyzeScenario(scenario);
  const assignment = assignTerms("SYL-QL-005", seed, analysis.termOrder);
  const first = question.conclusions[0];
  const second = question.conclusions[1];
  if (!first || !second) {
    throw new Error(`${seed}/${locale}: expected exactly two Banking conclusions.`);
  }

  return {
    ...question,
    explanation: [
      explanationFor(first, "I", locale, assignment),
      explanationFor(second, "II", locale, assignment),
    ],
  };
}
