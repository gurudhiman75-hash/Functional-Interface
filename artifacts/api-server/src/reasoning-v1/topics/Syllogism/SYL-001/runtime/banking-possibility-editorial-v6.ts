import type { CanonicalConclusion, SylLocale, TermId } from "../foundation/types";
import { analyzeScenario } from "./analysis";
import {
  generateBankingPossibilityReviewQuestionV4,
  type BankingPossibilityReviewQuestionV4,
} from "./banking-possibility-review-question-v4";
import type { TermAssignment } from "./localization";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";

export type BankingPossibilityEditorialQuestionV6 = Omit<BankingPossibilityReviewQuestionV4, "explanation"> & {
  explanation: readonly [string, string];
};

type ConclusionRecord = BankingPossibilityReviewQuestionV4["conclusions"][number];

function label(term: TermId, locale: SylLocale, assignment: TermAssignment): string {
  return assignment[term]?.labels[locale] ?? term;
}

function quote(value: string): string {
  return `“${value}”`;
}

function relationText(
  conclusion: CanonicalConclusion,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const s = label(conclusion.subject, locale, assignment);
  const p = label(conclusion.predicate, locale, assignment);
  if (locale === "hi-IN") {
    if (conclusion.form === "ALL") return `सभी ${s} ${p} हैं`;
    if (conclusion.form === "NO") return `कोई भी ${s} ${p} नहीं है`;
    if (conclusion.form === "SOME") return `कुछ ${s} ${p} हैं`;
    return `कुछ ${s} ${p} नहीं हैं`;
  }
  if (locale === "pa-IN") {
    if (conclusion.form === "ALL") return `ਸਾਰੇ ${s} ${p} ਹਨ`;
    if (conclusion.form === "NO") return `ਕੋਈ ਵੀ ${s} ${p} ਨਹੀਂ ਹੈ`;
    if (conclusion.form === "SOME") return `ਕੁਝ ${s} ${p} ਹਨ`;
    return `ਕੁਝ ${s} ${p} ਨਹੀਂ ਹਨ`;
  }
  if (conclusion.form === "ALL") return `all ${s} are ${p}`;
  if (conclusion.form === "NO") return `no ${s} are ${p}`;
  if (conclusion.form === "SOME") return `some ${s} are ${p}`;
  return `some ${s} are not ${p}`;
}

function premiseLead(locale: SylLocale, count: number): string {
  const numbers = Array.from({ length: count }, (_, index) => String(index + 1));
  if (locale === "hi-IN") {
    if (count === 1) return "कथन 1 को पढ़ें";
    return `कथन ${numbers.join(" और ")} को साथ पढ़ें`;
  }
  if (locale === "pa-IN") {
    if (count === 1) return "ਕਥਨ 1 ਨੂੰ ਪੜ੍ਹੋ";
    return `ਕਥਨ ${numbers.join(" ਅਤੇ ")} ਨੂੰ ਇਕੱਠੇ ਪੜ੍ਹੋ`;
  }
  if (count === 1) return "Read Statement 1";
  return `Read Statements ${numbers.join(" and ")} together`;
}

function forcedRelation(
  conclusion: CanonicalConclusion,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const s = label(conclusion.subject, locale, assignment);
  const p = label(conclusion.predicate, locale, assignment);
  if (locale === "hi-IN") {
    if (conclusion.form === "ALL") return `${quote(s)} वर्ग का हर सदस्य ${quote(p)} वर्ग के अंदर होना अनिवार्य है`;
    if (conclusion.form === "NO") return `${quote(s)} और ${quote(p)} वर्ग अलग रहना अनिवार्य हैं`;
    if (conclusion.form === "SOME") return `कम-से-कम एक आवश्यक सदस्य ${quote(s)} और ${quote(p)} दोनों वर्गों में होना अनिवार्य है`;
    return `${quote(s)} वर्ग का कम-से-कम एक आवश्यक सदस्य ${quote(p)} वर्ग से बाहर होना अनिवार्य है`;
  }
  if (locale === "pa-IN") {
    if (conclusion.form === "ALL") return `${quote(s)} ਵਰਗ ਦਾ ਹਰ ਮੈਂਬਰ ${quote(p)} ਵਰਗ ਦੇ ਅੰਦਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ`;
    if (conclusion.form === "NO") return `${quote(s)} ਅਤੇ ${quote(p)} ਵਰਗ ਵੱਖ ਰਹਿਣੇ ਲਾਜ਼ਮੀ ਹਨ`;
    if (conclusion.form === "SOME") return `ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਜ਼ਮੀ ਮੈਂਬਰ ${quote(s)} ਅਤੇ ${quote(p)} ਦੋਵਾਂ ਵਰਗਾਂ ਵਿੱਚ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ`;
    return `${quote(s)} ਵਰਗ ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਜ਼ਮੀ ਮੈਂਬਰ ${quote(p)} ਵਰਗ ਤੋਂ ਬਾਹਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ`;
  }
  if (conclusion.form === "ALL") return `every member of the ${quote(s)} class must lie inside the ${quote(p)} class`;
  if (conclusion.form === "NO") return `the ${quote(s)} and ${quote(p)} classes must be disjoint`;
  if (conclusion.form === "SOME") return `at least one required member must lie in both the ${quote(s)} and ${quote(p)} classes`;
  return `at least one required member of the ${quote(s)} class must lie outside the ${quote(p)} class`;
}

function blockingRelation(
  conclusion: CanonicalConclusion,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const opposite: CanonicalConclusion = conclusion.form === "ALL"
    ? { ...conclusion, form: "SOME_NOT" }
    : conclusion.form === "NO"
      ? { ...conclusion, form: "SOME" }
      : conclusion.form === "SOME"
        ? { ...conclusion, form: "NO" }
        : { ...conclusion, form: "ALL" };
  return forcedRelation(opposite, locale, assignment);
}

function openRegionText(
  conclusion: CanonicalConclusion,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const s = label(conclusion.subject, locale, assignment);
  const p = label(conclusion.predicate, locale, assignment);
  if (locale === "hi-IN") {
    if (conclusion.form === "SOME") return `${quote(s)} और ${quote(p)} के साझा भाग को कथन निषिद्ध नहीं करते`;
    return `${quote(s)} का ${quote(p)} से बाहर वाला भाग कथनों से निषिद्ध नहीं है`;
  }
  if (locale === "pa-IN") {
    if (conclusion.form === "SOME") return `${quote(s)} ਅਤੇ ${quote(p)} ਦਾ ਸਾਂਝਾ ਹਿੱਸਾ ਕਥਨਾਂ ਨਾਲ ਮਨਾਹੀ ਨਹੀਂ ਹੈ`;
    return `${quote(s)} ਦਾ ${quote(p)} ਤੋਂ ਬਾਹਰਲਾ ਹਿੱਸਾ ਕਥਨਾਂ ਨਾਲ ਮਨਾਹੀ ਨਹੀਂ ਹੈ`;
  }
  if (conclusion.form === "SOME") return `the shared region of the ${quote(s)} and ${quote(p)} classes is not forbidden by the statements`;
  return `the part of the ${quote(s)} class outside the ${quote(p)} class is not forbidden by the statements`;
}

function diagramEntailed(
  conclusion: CanonicalConclusion,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const s = label(conclusion.subject, locale, assignment);
  const p = label(conclusion.predicate, locale, assignment);
  if (locale === "hi-IN") {
    if (conclusion.form === "SOME") return `नीला × ${quote(s)} और ${quote(p)} दोनों वर्गों में है`;
    if (conclusion.form === "SOME_NOT") return `नीला × ${quote(s)} वर्ग में और ${quote(p)} वर्ग के बाहर है`;
    if (conclusion.form === "ALL") return `${quote(s)} वर्ग ${quote(p)} वर्ग के अंदर बाध्य है`;
    return `${quote(s)} और ${quote(p)} वर्ग अलग रहने के लिए बाध्य हैं`;
  }
  if (locale === "pa-IN") {
    if (conclusion.form === "SOME") return `ਨੀਲਾ × ${quote(s)} ਅਤੇ ${quote(p)} ਦੋਵਾਂ ਵਰਗਾਂ ਵਿੱਚ ਹੈ`;
    if (conclusion.form === "SOME_NOT") return `ਨੀਲਾ × ${quote(s)} ਵਰਗ ਵਿੱਚ ਅਤੇ ${quote(p)} ਵਰਗ ਤੋਂ ਬਾਹਰ ਹੈ`;
    if (conclusion.form === "ALL") return `${quote(s)} ਵਰਗ ${quote(p)} ਵਰਗ ਦੇ ਅੰਦਰ ਰਹਿਣ ਲਈ ਮਜਬੂਰ ਹੈ`;
    return `${quote(s)} ਅਤੇ ${quote(p)} ਵਰਗ ਵੱਖ ਰਹਿਣ ਲਈ ਮਜਬੂਰ ਹਨ`;
  }
  if (conclusion.form === "SOME") return `the blue × required by the statements lies in both the ${quote(s)} and ${quote(p)} classes`;
  if (conclusion.form === "SOME_NOT") return `the blue × required by the statements lies in the ${quote(s)} class and outside the ${quote(p)} class`;
  if (conclusion.form === "ALL") return `the ${quote(s)} class is forced inside the ${quote(p)} class`;
  return `the ${quote(s)} and ${quote(p)} classes are forced apart`;
}

function diagramBlocked(
  conclusion: CanonicalConclusion,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const s = label(conclusion.subject, locale, assignment);
  const p = label(conclusion.predicate, locale, assignment);
  if (locale === "hi-IN") {
    if (conclusion.form === "SOME") return `${quote(s)} और ${quote(p)} वर्ग अलग हैं, इसलिए × दोनों में एक साथ नहीं रखा जा सकता`;
    if (conclusion.form === "SOME_NOT") return `${quote(s)} वर्ग ${quote(p)} के अंदर बाध्य है, इसलिए ${quote(s)} का × ${quote(p)} से बाहर नहीं रखा जा सकता`;
    if (conclusion.form === "ALL") return `एक आवश्यक × ${quote(s)} में लेकिन ${quote(p)} के बाहर है, इसलिए पूरा ${quote(s)} वर्ग ${quote(p)} के अंदर नहीं हो सकता`;
    return `एक आवश्यक × ${quote(s)} और ${quote(p)} दोनों में है, इसलिए दोनों वर्ग अलग नहीं हो सकते`;
  }
  if (locale === "pa-IN") {
    if (conclusion.form === "SOME") return `${quote(s)} ਅਤੇ ${quote(p)} ਵਰਗ ਵੱਖ ਹਨ, ਇਸ ਲਈ × ਦੋਵਾਂ ਵਿੱਚ ਇਕੱਠੇ ਨਹੀਂ ਰੱਖਿਆ ਜਾ ਸਕਦਾ`;
    if (conclusion.form === "SOME_NOT") return `${quote(s)} ਵਰਗ ${quote(p)} ਦੇ ਅੰਦਰ ਰਹਿਣ ਲਈ ਮਜਬੂਰ ਹੈ, ਇਸ ਲਈ ${quote(s)} ਦਾ × ${quote(p)} ਤੋਂ ਬਾਹਰ ਨਹੀਂ ਰੱਖਿਆ ਜਾ ਸਕਦਾ`;
    if (conclusion.form === "ALL") return `ਇੱਕ ਲਾਜ਼ਮੀ × ${quote(s)} ਵਿੱਚ ਪਰ ${quote(p)} ਤੋਂ ਬਾਹਰ ਹੈ, ਇਸ ਲਈ ਪੂਰਾ ${quote(s)} ਵਰਗ ${quote(p)} ਦੇ ਅੰਦਰ ਨਹੀਂ ਹੋ ਸਕਦਾ`;
    return `ਇੱਕ ਲਾਜ਼ਮੀ × ${quote(s)} ਅਤੇ ${quote(p)} ਦੋਵਾਂ ਵਿੱਚ ਹੈ, ਇਸ ਲਈ ਦੋਵੇਂ ਵਰਗ ਵੱਖ ਨਹੀਂ ਹੋ ਸਕਦੇ`;
  }
  if (conclusion.form === "SOME") return `the ${quote(s)} and ${quote(p)} classes are forced apart, so an × cannot lie in both`;
  if (conclusion.form === "SOME_NOT") return `the ${quote(s)} class is forced inside the ${quote(p)} class, so an ${quote(s)} × cannot lie outside ${quote(p)}`;
  if (conclusion.form === "ALL") return `a required × lies in ${quote(s)} but outside ${quote(p)}, so the whole ${quote(s)} class cannot be inside ${quote(p)}`;
  return `a required × lies in both ${quote(s)} and ${quote(p)}, so the two classes cannot be disjoint`;
}

function directNotAllExplanation(
  record: ConclusionRecord,
  locale: SylLocale,
  assignment: TermAssignment,
  analysis: ReturnType<typeof analyzeScenario>,
  conclusionLabel: "I" | "II",
): string | null {
  if (record.mode !== "POSSIBILITY" || record.canonicalConclusion.form !== "SOME") return null;
  const match = analysis.premises.find((premise) =>
    premise.form === "NOT_ALL"
    && premise.subject === record.canonicalConclusion.subject
    && premise.predicate === record.canonicalConclusion.predicate);
  if (!match) return null;
  const s = label(record.canonicalConclusion.subject, locale, assignment);
  const p = label(record.canonicalConclusion.predicate, locale, assignment);
  if (locale === "hi-IN") {
    return `${conclusionLabel}: “सभी ${s} ${p} नहीं हैं” का अर्थ है कि ${quote(s)} वर्ग का कम-से-कम एक सदस्य ${quote(p)} से बाहर है; इसका अर्थ यह नहीं कि ${quote(s)} और ${quote(p)} वर्ग पूरी तरह अलग हैं। इसलिए उनका साझा भाग अभी भी संभव है और निष्कर्ष ${conclusionLabel} की संभावना सही है।`;
  }
  if (locale === "pa-IN") {
    return `${conclusionLabel}: “ਸਾਰੇ ${s} ${p} ਨਹੀਂ ਹਨ” ਦਾ ਅਰਥ ਹੈ ਕਿ ${quote(s)} ਵਰਗ ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ${quote(p)} ਤੋਂ ਬਾਹਰ ਹੈ; ਇਸ ਦਾ ਅਰਥ ਇਹ ਨਹੀਂ ਕਿ ${quote(s)} ਅਤੇ ${quote(p)} ਵਰਗ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਹਨ। ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦਾ ਸਾਂਝਾ ਹਿੱਸਾ ਅਜੇ ਵੀ ਸੰਭਵ ਹੈ ਅਤੇ ਨਤੀਜਾ ${conclusionLabel} ਦੀ ਸੰਭਾਵਨਾ ਸਹੀ ਹੈ।`;
  }
  return `${conclusionLabel}: “Not all ${s} are ${p}” guarantees at least one member of the ${quote(s)} class outside ${quote(p)}; it does not make the ${quote(s)} and ${quote(p)} classes disjoint. Their shared region is still allowed, so Conclusion ${conclusionLabel} remains possible and follows.`;
}

function explain(
  record: ConclusionRecord,
  locale: SylLocale,
  assignment: TermAssignment,
  analysis: ReturnType<typeof analyzeScenario>,
  statementCount: number,
  conclusionLabel: "I" | "II",
): string {
  const special = directNotAllExplanation(record, locale, assignment, analysis, conclusionLabel);
  if (special) return special;

  const lead = premiseLead(locale, statementCount);
  const relation = relationText(record.canonicalConclusion, locale, assignment);
  const classification = record.classification;

  if (locale === "hi-IN") {
    if (record.mode === "POSSIBILITY") {
      if (record.canBeTrue) {
        return `${conclusionLabel}: ${lead}। ${openRegionText(record.canonicalConclusion, locale, assignment)}। संभावना के लिए केवल एक वैध व्यवस्था पर्याप्त है; इसलिए ${quote(relation)} संभव है और निष्कर्ष ${conclusionLabel} अनुसरण करता है।`;
      }
      return `${conclusionLabel}: ${lead}। इन कथनों से ${blockingRelation(record.canonicalConclusion, locale, assignment)}। आरेख में भी ${diagramBlocked(record.canonicalConclusion, locale, assignment)}; इसलिए ${quote(relation)} संभव नहीं है और निष्कर्ष ${conclusionLabel} अनुसरण नहीं करता।`;
    }
    if (classification === "ENTAILED") {
      return `${conclusionLabel}: ${lead}। इन कथनों से ${forcedRelation(record.canonicalConclusion, locale, assignment)}। आरेख में ${diagramEntailed(record.canonicalConclusion, locale, assignment)}; इसलिए ${quote(relation)} हर वैध व्यवस्था में सत्य है और निष्कर्ष ${conclusionLabel} अनुसरण करता है।`;
    }
    if (classification === "CONTRADICTED") {
      return `${conclusionLabel}: ${lead}। इन कथनों से ${blockingRelation(record.canonicalConclusion, locale, assignment)}। आरेख में ${diagramBlocked(record.canonicalConclusion, locale, assignment)}; इसलिए ${quote(relation)} कथनों के विरुद्ध है और निष्कर्ष ${conclusionLabel} अनुसरण नहीं करता।`;
    }
    return `${conclusionLabel}: ${lead}। कथन ${quote(relation)} को निश्चित नहीं करते। एक वैध व्यवस्था में यह सत्य और दूसरी में असत्य हो सकता है; खुला क्षेत्र बिना नीले × के अस्तित्व का प्रमाण नहीं है। इसलिए निश्चित निष्कर्ष ${conclusionLabel} अनुसरण नहीं करता।`;
  }

  if (locale === "pa-IN") {
    if (record.mode === "POSSIBILITY") {
      if (record.canBeTrue) {
        return `${conclusionLabel}: ${lead}। ${openRegionText(record.canonicalConclusion, locale, assignment)}। ਸੰਭਾਵਨਾ ਲਈ ਕੇਵਲ ਇੱਕ ਵੈਧ ਬਣਤਰ ਕਾਫ਼ੀ ਹੈ; ਇਸ ਲਈ ${quote(relation)} ਸੰਭਵ ਹੈ ਅਤੇ ਨਤੀਜਾ ${conclusionLabel} ਸਹੀ ਹੈ।`;
      }
      return `${conclusionLabel}: ${lead}। ਇਨ੍ਹਾਂ ਕਥਨਾਂ ਤੋਂ ${blockingRelation(record.canonicalConclusion, locale, assignment)}। ਚਿੱਤਰ ਵਿੱਚ ਵੀ ${diagramBlocked(record.canonicalConclusion, locale, assignment)}; ਇਸ ਲਈ ${quote(relation)} ਸੰਭਵ ਨਹੀਂ ਹੈ ਅਤੇ ਨਤੀਜਾ ${conclusionLabel} ਸਹੀ ਨਹੀਂ ਹੈ।`;
    }
    if (classification === "ENTAILED") {
      return `${conclusionLabel}: ${lead}। ਇਨ੍ਹਾਂ ਕਥਨਾਂ ਤੋਂ ${forcedRelation(record.canonicalConclusion, locale, assignment)}। ਚਿੱਤਰ ਵਿੱਚ ${diagramEntailed(record.canonicalConclusion, locale, assignment)}; ਇਸ ਲਈ ${quote(relation)} ਹਰ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਸੱਚ ਹੈ ਅਤੇ ਨਤੀਜਾ ${conclusionLabel} ਸਹੀ ਹੈ।`;
    }
    if (classification === "CONTRADICTED") {
      return `${conclusionLabel}: ${lead}। ਇਨ੍ਹਾਂ ਕਥਨਾਂ ਤੋਂ ${blockingRelation(record.canonicalConclusion, locale, assignment)}। ਚਿੱਤਰ ਵਿੱਚ ${diagramBlocked(record.canonicalConclusion, locale, assignment)}; ਇਸ ਲਈ ${quote(relation)} ਕਥਨਾਂ ਦੇ ਵਿਰੁੱਧ ਹੈ ਅਤੇ ਨਤੀਜਾ ${conclusionLabel} ਸਹੀ ਨਹੀਂ ਹੈ।`;
    }
    return `${conclusionLabel}: ${lead}। ਕਥਨ ${quote(relation)} ਨੂੰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਕਰਦੇ। ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਇਹ ਸੱਚ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ਝੂਠ ਹੋ ਸਕਦਾ ਹੈ; ਨੀਲੇ × ਤੋਂ ਬਿਨਾਂ ਖੁੱਲ੍ਹਾ ਹਿੱਸਾ ਅਸਤਿਤਵ ਦਾ ਸਬੂਤ ਨਹੀਂ ਹੈ। ਇਸ ਲਈ ਪੱਕਾ ਨਤੀਜਾ ${conclusionLabel} ਸਹੀ ਨਹੀਂ ਹੈ।`;
  }

  if (record.mode === "POSSIBILITY") {
    if (record.canBeTrue) {
      return `${conclusionLabel}: ${lead}. ${openRegionText(record.canonicalConclusion, locale, assignment)}. A possibility conclusion needs only one valid arrangement, so ${quote(relation)} is possible and Conclusion ${conclusionLabel} follows.`;
    }
    return `${conclusionLabel}: ${lead}. The statements force that ${blockingRelation(record.canonicalConclusion, locale, assignment)}. In the diagram, ${diagramBlocked(record.canonicalConclusion, locale, assignment)}; therefore ${quote(relation)} is impossible and Conclusion ${conclusionLabel} does not follow.`;
  }
  if (classification === "ENTAILED") {
    return `${conclusionLabel}: ${lead}. The statements force that ${forcedRelation(record.canonicalConclusion, locale, assignment)}. In the diagram, ${diagramEntailed(record.canonicalConclusion, locale, assignment)}; therefore ${quote(relation)} is true in every valid arrangement and Conclusion ${conclusionLabel} follows.`;
  }
  if (classification === "CONTRADICTED") {
    return `${conclusionLabel}: ${lead}. The statements force that ${blockingRelation(record.canonicalConclusion, locale, assignment)}. In the diagram, ${diagramBlocked(record.canonicalConclusion, locale, assignment)}; therefore ${quote(relation)} conflicts with the statements and Conclusion ${conclusionLabel} does not follow.`;
  }
  return `${conclusionLabel}: ${lead}. The statements do not settle ${quote(relation)}: one valid arrangement can make it true and another can make it false. An open region without a premise-required blue × is not proof of existence, so definite Conclusion ${conclusionLabel} does not follow.`;
}

export function generateBankingPossibilityEditorialQuestionV6(
  seed: number,
  locale: SylLocale,
): BankingPossibilityEditorialQuestionV6 {
  const question = generateBankingPossibilityReviewQuestionV4(seed, locale);
  const scenario = scenariosForGroup(question.scenarioGroup).find((entry) => entry.scenarioId === question.scenarioId);
  if (!scenario) throw new Error(`${question.scenarioId}: missing scenario for editorial V6.`);
  const analysis = analyzeScenario(scenario);
  const assignment = assignTerms("SYL-QL-005", seed, analysis.termOrder);
  const explanation = question.conclusions.map((record, index) =>
    explain(record, locale, assignment, analysis, question.statements.length, index === 0 ? "I" : "II")) as [string, string];

  return {
    ...question,
    explanation,
  };
}
