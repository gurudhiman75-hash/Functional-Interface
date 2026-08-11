import type { CanonicalConclusion, SylLocale, TermId } from "../foundation/types";
import { analyzeScenario } from "./analysis";
import {
  generateBankingPossibilityReviewQuestionV4,
  type BankingPossibilityReviewQuestionV4,
} from "./banking-possibility-review-question-v4";
import type { TermAssignment } from "./localization";
import { createPrng, shuffle } from "./prng";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";

export type BankingPossibilityEditorialCandidate = Omit<BankingPossibilityReviewQuestionV4, "explanation"> & {
  explanation: readonly [string, string];
};

type ConclusionRecord = BankingPossibilityReviewQuestionV4["conclusions"][number];

interface DiagramWitness {
  inside: ReadonlySet<TermId>;
  outside: ReadonlySet<TermId>;
}

function classLabel(term: TermId, locale: SylLocale, assignment: TermAssignment): string {
  return assignment[term]?.labels[locale] ?? term;
}

function premiseLead(locale: SylLocale, count: number): string {
  const numbers = Array.from({ length: count }, (_, index) => String(index + 1));
  if (locale === "hi-IN") return count === 1 ? "कथन 1 को पढ़ें" : `कथन ${numbers.join(" और ")} को साथ पढ़ें`;
  if (locale === "pa-IN") return count === 1 ? "ਕਥਨ 1 ਨੂੰ ਪੜ੍ਹੋ" : `ਕਥਨ ${numbers.join(" ਅਤੇ ")} ਨੂੰ ਇਕੱਠੇ ਪੜ੍ਹੋ`;
  return count === 1 ? "Read Statement 1" : `Read Statements ${numbers.join(" and ")} together`;
}

function diagramWitnesses(svg: string): readonly DiagramWitness[] {
  return [...svg.matchAll(/<g data-witness="decisive"[^>]*data-inside="([^"]*)"[^>]*data-outside="([^"]*)"/gu)]
    .map((match) => ({
      inside: new Set(match[1].split(",").filter(Boolean)),
      outside: new Set(match[2].split(",").filter(Boolean)),
    }));
}

function witnessSatisfies(entry: DiagramWitness, conclusion: CanonicalConclusion): boolean {
  if (conclusion.form === "SOME") {
    return entry.inside.has(conclusion.subject) && entry.inside.has(conclusion.predicate);
  }
  if (conclusion.form === "SOME_NOT") {
    return entry.inside.has(conclusion.subject) && entry.outside.has(conclusion.predicate);
  }
  return false;
}

function visibleWitness(svg: string, conclusion: CanonicalConclusion): boolean {
  return diagramWitnesses(svg).some((entry) => witnessSatisfies(entry, conclusion));
}

function oppositeExistential(conclusion: CanonicalConclusion): CanonicalConclusion | null {
  if (conclusion.form === "ALL") return { ...conclusion, form: "SOME_NOT" };
  if (conclusion.form === "NO") return { ...conclusion, form: "SOME" };
  return null;
}

function finish(locale: SylLocale, label: "I" | "II", follows: boolean): string {
  if (locale === "hi-IN") return follows ? `इसलिए निष्कर्ष ${label} अनुसरण करता है।` : `इसलिए निष्कर्ष ${label} अनुसरण नहीं करता।`;
  if (locale === "pa-IN") return follows ? `ਇਸ ਲਈ ਨਤੀਜਾ ${label} ਸਹੀ ਹੈ।` : `ਇਸ ਲਈ ਨਤੀਜਾ ${label} ਸਹੀ ਨਹੀਂ ਹੈ।`;
  return follows ? `Therefore Conclusion ${label} follows.` : `Therefore Conclusion ${label} does not follow.`;
}

function possibleRegion(
  conclusion: CanonicalConclusion,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const subject = classLabel(conclusion.subject, locale, assignment);
  const predicate = classLabel(conclusion.predicate, locale, assignment);
  if (locale === "hi-IN") {
    return conclusion.form === "SOME"
      ? `“${subject}” और “${predicate}” वर्गों का साझा भाग कथनों से निषिद्ध नहीं है। संभावना वाले निष्कर्ष के लिए एक वैध व्यवस्था पर्याप्त है।`
      : `“${subject}” वर्ग का “${predicate}” से बाहर वाला भाग कथनों से निषिद्ध नहीं है। संभावना वाले निष्कर्ष के लिए एक वैध व्यवस्था पर्याप्त है।`;
  }
  if (locale === "pa-IN") {
    return conclusion.form === "SOME"
      ? `“${subject}” ਅਤੇ “${predicate}” ਵਰਗਾਂ ਦਾ ਸਾਂਝਾ ਹਿੱਸਾ ਕਥਨਾਂ ਨਾਲ ਮਨਾਹੀ ਨਹੀਂ ਹੈ। ਸੰਭਾਵਨਾ ਵਾਲੇ ਨਤੀਜੇ ਲਈ ਇੱਕ ਵੈਧ ਬਣਤਰ ਕਾਫ਼ੀ ਹੈ।`
      : `“${subject}” ਵਰਗ ਦਾ “${predicate}” ਤੋਂ ਬਾਹਰਲਾ ਹਿੱਸਾ ਕਥਨਾਂ ਨਾਲ ਮਨਾਹੀ ਨਹੀਂ ਹੈ। ਸੰਭਾਵਨਾ ਵਾਲੇ ਨਤੀਜੇ ਲਈ ਇੱਕ ਵੈਧ ਬਣਤਰ ਕਾਫ਼ੀ ਹੈ।`;
  }
  return conclusion.form === "SOME"
    ? `The shared region of the “${subject}” and “${predicate}” classes is not forbidden by the statements. A possibility conclusion needs only one valid arrangement.`
    : `The part of the “${subject}” class outside the “${predicate}” class is not forbidden by the statements. A possibility conclusion needs only one valid arrangement.`;
}

function blockedExistential(
  conclusion: CanonicalConclusion,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const subject = classLabel(conclusion.subject, locale, assignment);
  const predicate = classLabel(conclusion.predicate, locale, assignment);
  if (locale === "hi-IN") {
    return conclusion.form === "SOME"
      ? `कथन “${subject}” और “${predicate}” वर्गों को अलग रखते हैं। आरेख में भी दोनों वर्ग अलग हैं, इसलिए एक ही × दोनों में नहीं रखा जा सकता।`
      : `कथन “${subject}” वर्ग को “${predicate}” वर्ग के अंदर रखते हैं। इसलिए “${subject}” का कोई × “${predicate}” से बाहर नहीं रखा जा सकता।`;
  }
  if (locale === "pa-IN") {
    return conclusion.form === "SOME"
      ? `ਕਥਨ “${subject}” ਅਤੇ “${predicate}” ਵਰਗਾਂ ਨੂੰ ਵੱਖ ਰੱਖਦੇ ਹਨ। ਚਿੱਤਰ ਵਿੱਚ ਵੀ ਦੋਵੇਂ ਵਰਗ ਵੱਖ ਹਨ, ਇਸ ਲਈ ਇੱਕੋ × ਦੋਵਾਂ ਵਿੱਚ ਨਹੀਂ ਰੱਖਿਆ ਜਾ ਸਕਦਾ।`
      : `ਕਥਨ “${subject}” ਵਰਗ ਨੂੰ “${predicate}” ਵਰਗ ਦੇ ਅੰਦਰ ਰੱਖਦੇ ਹਨ। ਇਸ ਲਈ “${subject}” ਦਾ ਕੋਈ × “${predicate}” ਤੋਂ ਬਾਹਰ ਨਹੀਂ ਰੱਖਿਆ ਜਾ ਸਕਦਾ।`;
  }
  return conclusion.form === "SOME"
    ? `The statements force the “${subject}” and “${predicate}” classes apart. The diagram shows the same separation, so one × cannot lie in both classes.`
    : `The statements force the “${subject}” class inside the “${predicate}” class. Therefore an × for “${subject}” cannot be placed outside “${predicate}”.`;
}

function definiteUniversal(
  record: ConclusionRecord,
  locale: SylLocale,
  assignment: TermAssignment,
  label: "I" | "II",
  lead: string,
): string {
  const subject = classLabel(record.canonicalConclusion.subject, locale, assignment);
  const predicate = classLabel(record.canonicalConclusion.predicate, locale, assignment);
  const form = record.canonicalConclusion.form;
  const classification = record.classification;

  if (classification === "ENTAILED") {
    if (locale === "hi-IN") {
      const body = form === "ALL"
        ? `कथन पूरे “${subject}” वर्ग को “${predicate}” वर्ग के अंदर रखना अनिवार्य करते हैं। आरेख में भी यही containment दिखता है।`
        : `कथन “${subject}” और “${predicate}” वर्गों को अलग रखना अनिवार्य करते हैं। आरेख में भी दोनों वर्ग अलग हैं।`;
      return `${label}: ${lead}। ${body} ${finish(locale, label, true)}`;
    }
    if (locale === "pa-IN") {
      const body = form === "ALL"
        ? `ਕਥਨ ਪੂਰੇ “${subject}” ਵਰਗ ਨੂੰ “${predicate}” ਵਰਗ ਦੇ ਅੰਦਰ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ। ਚਿੱਤਰ ਵਿੱਚ ਵੀ ਇਹੀ containment ਦਿਖਦਾ ਹੈ।`
        : `ਕਥਨ “${subject}” ਅਤੇ “${predicate}” ਵਰਗਾਂ ਨੂੰ ਵੱਖ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ। ਚਿੱਤਰ ਵਿੱਚ ਵੀ ਦੋਵੇਂ ਵਰਗ ਵੱਖ ਹਨ।`;
      return `${label}: ${lead}। ${body} ${finish(locale, label, true)}`;
    }
    const body = form === "ALL"
      ? `The statements force the whole “${subject}” class inside the “${predicate}” class, and the diagram shows the same containment.`
      : `The statements force the “${subject}” and “${predicate}” classes apart, and the diagram shows the same separation.`;
    return `${label}: ${lead}. ${body} ${finish(locale, label, true)}`;
  }

  if (classification === "UNDETERMINED") {
    if (locale === "hi-IN") {
      const body = form === "ALL"
        ? `कथन पूरे “${subject}” वर्ग को “${predicate}” के अंदर रखना अनिवार्य नहीं करते। एक वैध व्यवस्था में पूरा वर्ग अंदर हो सकता है और दूसरी में उसका कुछ भाग बाहर रह सकता है।`
        : `कथन “${subject}” और “${predicate}” वर्गों को अलग रखना अनिवार्य नहीं करते। एक वैध व्यवस्था में वे अलग और दूसरी में ओवरलैप कर सकते हैं।`;
      return `${label}: ${lead}। ${body} ${finish(locale, label, false)}`;
    }
    if (locale === "pa-IN") {
      const body = form === "ALL"
        ? `ਕਥਨ ਪੂਰੇ “${subject}” ਵਰਗ ਨੂੰ “${predicate}” ਦੇ ਅੰਦਰ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਰਦੇ। ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਪੂਰਾ ਵਰਗ ਅੰਦਰ ਹੋ ਸਕਦਾ ਹੈ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ਉਸ ਦਾ ਕੁਝ ਹਿੱਸਾ ਬਾਹਰ ਰਹਿ ਸਕਦਾ ਹੈ।`
        : `ਕਥਨ “${subject}” ਅਤੇ “${predicate}” ਵਰਗਾਂ ਨੂੰ ਵੱਖ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਰਦੇ। ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਉਹ ਵੱਖ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ਓਵਰਲੈਪ ਕਰ ਸਕਦੇ ਹਨ।`;
      return `${label}: ${lead}। ${body} ${finish(locale, label, false)}`;
    }
    const body = form === "ALL"
      ? `The statements do not force the whole “${subject}” class inside the “${predicate}” class. One valid arrangement can show full containment and another can leave part of “${subject}” outside “${predicate}”.`
      : `The statements do not force the “${subject}” and “${predicate}” classes to be disjoint. One valid arrangement can separate them and another can let them overlap.`;
    return `${label}: ${lead}. ${body} ${finish(locale, label, false)}`;
  }

  throw new Error(`definiteUniversal called for contradicted ${form}`);
}

function contradictedUniversal(
  record: ConclusionRecord,
  locale: SylLocale,
  assignment: TermAssignment,
  label: "I" | "II",
  lead: string,
  svg: string,
): string {
  const conclusion = record.canonicalConclusion;
  const subject = classLabel(conclusion.subject, locale, assignment);
  const predicate = classLabel(conclusion.predicate, locale, assignment);
  const opposite = oppositeExistential(conclusion)!;
  const hasWitness = visibleWitness(svg, opposite);

  if (conclusion.form === "ALL") {
    if (hasWitness) {
      if (locale === "hi-IN") return `${label}: ${lead}। नीला × “${subject}” वर्ग में लेकिन “${predicate}” वर्ग के बाहर है। इसलिए पूरा “${subject}” वर्ग “${predicate}” के अंदर नहीं हो सकता। ${finish(locale, label, false)}`;
      if (locale === "pa-IN") return `${label}: ${lead}। ਨੀਲਾ × “${subject}” ਵਰਗ ਵਿੱਚ ਪਰ “${predicate}” ਵਰਗ ਤੋਂ ਬਾਹਰ ਹੈ। ਇਸ ਲਈ ਪੂਰਾ “${subject}” ਵਰਗ “${predicate}” ਦੇ ਅੰਦਰ ਨਹੀਂ ਹੋ ਸਕਦਾ। ${finish(locale, label, false)}`;
      return `${label}: ${lead}. The blue × lies in the “${subject}” class but outside the “${predicate}” class. Therefore the whole “${subject}” class cannot be inside “${predicate}”. ${finish(locale, label, false)}`;
    }
    if (locale === "hi-IN") return `${label}: ${lead}। कथनों का पालन करते हुए पूरे “${subject}” वर्ग को “${predicate}” वर्ग के अंदर नहीं रखा जा सकता। ${finish(locale, label, false)}`;
    if (locale === "pa-IN") return `${label}: ${lead}। ਕਥਨਾਂ ਦੀ ਪਾਲਣਾ ਕਰਦੇ ਹੋਏ ਪੂਰੇ “${subject}” ਵਰਗ ਨੂੰ “${predicate}” ਵਰਗ ਦੇ ਅੰਦਰ ਨਹੀਂ ਰੱਖਿਆ ਜਾ ਸਕਦਾ। ${finish(locale, label, false)}`;
    return `${label}: ${lead}. The whole “${subject}” class cannot be placed inside the “${predicate}” class without violating the statements. ${finish(locale, label, false)}`;
  }

  if (hasWitness) {
    if (locale === "hi-IN") return `${label}: ${lead}। नीला × “${subject}” और “${predicate}” दोनों वर्गों में है। इसलिए दोनों वर्ग पूरी तरह अलग नहीं हो सकते। ${finish(locale, label, false)}`;
    if (locale === "pa-IN") return `${label}: ${lead}। ਨੀਲਾ × “${subject}” ਅਤੇ “${predicate}” ਦੋਵਾਂ ਵਰਗਾਂ ਵਿੱਚ ਹੈ। ਇਸ ਲਈ ਦੋਵੇਂ ਵਰਗ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਨਹੀਂ ਹੋ ਸਕਦੇ। ${finish(locale, label, false)}`;
    return `${label}: ${lead}. The blue × lies in both the “${subject}” and “${predicate}” classes. Therefore the two classes cannot be completely disjoint. ${finish(locale, label, false)}`;
  }

  if (locale === "hi-IN") return `${label}: ${lead}। कथनों से “${subject}” और “${predicate}” के बीच साझा सदस्यता अनिवार्य है, इसलिए दोनों वर्ग पूरी तरह अलग नहीं हो सकते। संक्षिप्त आरेख केवल इस अस्तित्व को दोहराने के लिए अतिरिक्त × नहीं जोड़ता। ${finish(locale, label, false)}`;
  if (locale === "pa-IN") return `${label}: ${lead}। ਕਥਨਾਂ ਤੋਂ “${subject}” ਅਤੇ “${predicate}” ਵਿਚ ਸਾਂਝੀ ਮੈਂਬਰਸ਼ਿਪ ਲਾਜ਼ਮੀ ਹੈ, ਇਸ ਲਈ ਦੋਵੇਂ ਵਰਗ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਨਹੀਂ ਹੋ ਸਕਦੇ। ਸੰਖੇਪ ਚਿੱਤਰ ਸਿਰਫ਼ ਇਸ ਅਸਤਿਤਵ ਨੂੰ ਦੁਹਰਾਉਣ ਲਈ ਵਾਧੂ × ਨਹੀਂ ਜੋੜਦਾ। ${finish(locale, label, false)}`;
  return `${label}: ${lead}. The statements force common membership between the “${subject}” and “${predicate}” classes, so they cannot be completely disjoint. The compact diagram does not add an extra × merely to repeat that existence. ${finish(locale, label, false)}`;
}

function definiteExistential(
  record: ConclusionRecord,
  locale: SylLocale,
  assignment: TermAssignment,
  label: "I" | "II",
  lead: string,
  svg: string,
): string {
  const conclusion = record.canonicalConclusion;
  const subject = classLabel(conclusion.subject, locale, assignment);
  const predicate = classLabel(conclusion.predicate, locale, assignment);

  if (record.classification === "ENTAILED") {
    const hasWitness = visibleWitness(svg, conclusion);
    if (hasWitness) {
      if (locale === "hi-IN") {
        const body = conclusion.form === "SOME"
          ? `नीला × “${subject}” और “${predicate}” दोनों वर्गों में है।`
          : `नीला × “${subject}” वर्ग में और “${predicate}” वर्ग के बाहर है।`;
        return `${label}: ${lead}। ${body} यह वही सदस्य है जिसे कथन अनिवार्य करते हैं। ${finish(locale, label, true)}`;
      }
      if (locale === "pa-IN") {
        const body = conclusion.form === "SOME"
          ? `ਨੀਲਾ × “${subject}” ਅਤੇ “${predicate}” ਦੋਵਾਂ ਵਰਗਾਂ ਵਿੱਚ ਹੈ।`
          : `ਨੀਲਾ × “${subject}” ਵਰਗ ਵਿੱਚ ਅਤੇ “${predicate}” ਵਰਗ ਤੋਂ ਬਾਹਰ ਹੈ।`;
        return `${label}: ${lead}। ${body} ਇਹ ਉਹੀ ਮੈਂਬਰ ਹੈ ਜਿਸ ਨੂੰ ਕਥਨ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ। ${finish(locale, label, true)}`;
      }
      const body = conclusion.form === "SOME"
        ? `The blue × lies in both the “${subject}” and “${predicate}” classes.`
        : `The blue × lies in the “${subject}” class and outside the “${predicate}” class.`;
      return `${label}: ${lead}. ${body} It is the member required by the statements. ${finish(locale, label, true)}`;
    }

    if (locale === "hi-IN") return `${label}: ${lead}। कथनों के शब्दों और संबंधों से आवश्यक सदस्य का अस्तित्व निश्चित है। संक्षिप्त आरेख केवल उसी अस्तित्व को दोहराने के लिए अतिरिक्त × नहीं जोड़ता। ${finish(locale, label, true)}`;
    if (locale === "pa-IN") return `${label}: ${lead}। ਕਥਨਾਂ ਦੇ ਸ਼ਬਦਾਂ ਅਤੇ ਸੰਬੰਧਾਂ ਤੋਂ ਲੋੜੀਂਦੇ ਮੈਂਬਰ ਦਾ ਅਸਤਿਤਵ ਨਿਸ਼ਚਿਤ ਹੈ। ਸੰਖੇਪ ਚਿੱਤਰ ਸਿਰਫ਼ ਉਸੇ ਅਸਤਿਤਵ ਨੂੰ ਦੁਹਰਾਉਣ ਲਈ ਵਾਧੂ × ਨਹੀਂ ਜੋੜਦਾ। ${finish(locale, label, true)}`;
    return `${label}: ${lead}. The wording and relations in the statements guarantee the required member. The compact diagram does not add an extra × merely to repeat that existence. ${finish(locale, label, true)}`;
  }

  if (record.classification === "CONTRADICTED") {
    return `${label}: ${lead}${locale === "en-IN" ? ". " : "। "}${blockedExistential(conclusion, locale, assignment)} ${finish(locale, label, false)}`;
  }

  if (locale === "hi-IN") return `${label}: ${lead}। कथन “${subject}” और “${predicate}” के आवश्यक सदस्य को निश्चित नहीं करते। आरेख में संबंधित क्षेत्र हो सकता है, पर वहाँ कथन से आवश्यक नीला × नहीं है। ${finish(locale, label, false)}`;
  if (locale === "pa-IN") return `${label}: ${lead}। ਕਥਨ “${subject}” ਅਤੇ “${predicate}” ਲਈ ਲੋੜੀਂਦੇ ਮੈਂਬਰ ਨੂੰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਕਰਦੇ। ਚਿੱਤਰ ਵਿੱਚ ਸੰਬੰਧਿਤ ਹਿੱਸਾ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਉੱਥੇ ਕਥਨ ਤੋਂ ਲੋੜੀਂਦਾ ਨੀਲਾ × ਨਹੀਂ ਹੈ। ${finish(locale, label, false)}`;
  return `${label}: ${lead}. The statements do not guarantee a member in the required “${subject}”/“${predicate}” region. That region may exist geometrically, but there is no premise-required blue × there. ${finish(locale, label, false)}`;
}

function directNotAllPossibility(
  record: ConclusionRecord,
  locale: SylLocale,
  assignment: TermAssignment,
  displayedPremises: readonly { form: string; subject: TermId; predicate: TermId }[],
  label: "I" | "II",
): string | null {
  if (record.mode !== "POSSIBILITY" || record.canonicalConclusion.form !== "SOME") return null;
  const matchIndex = displayedPremises.findIndex((premise) =>
    premise.form === "NOT_ALL"
    && premise.subject === record.canonicalConclusion.subject
    && premise.predicate === record.canonicalConclusion.predicate);
  if (matchIndex < 0) return null;
  const subject = classLabel(record.canonicalConclusion.subject, locale, assignment);
  const predicate = classLabel(record.canonicalConclusion.predicate, locale, assignment);
  if (locale === "hi-IN") return `${label}: कथन ${matchIndex + 1} कहता है कि सभी “${subject}” “${predicate}” नहीं हैं; इसका अर्थ यह नहीं कि दोनों वर्ग पूरी तरह अलग हैं। उनका साझा भाग अभी भी संभव है। ${finish(locale, label, true)}`;
  if (locale === "pa-IN") return `${label}: ਕਥਨ ${matchIndex + 1} ਕਹਿੰਦਾ ਹੈ ਕਿ ਸਾਰੇ “${subject}” “${predicate}” ਨਹੀਂ ਹਨ; ਇਸ ਦਾ ਅਰਥ ਇਹ ਨਹੀਂ ਕਿ ਦੋਵੇਂ ਵਰਗ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਹਨ। ਉਨ੍ਹਾਂ ਦਾ ਸਾਂਝਾ ਹਿੱਸਾ ਅਜੇ ਵੀ ਸੰਭਵ ਹੈ। ${finish(locale, label, true)}`;
  return `${label}: Statement ${matchIndex + 1} says not all “${subject}” are “${predicate}”; that does not mean the two classes are completely disjoint. Their shared region is still possible. ${finish(locale, label, true)}`;
}

function explain(
  record: ConclusionRecord,
  locale: SylLocale,
  assignment: TermAssignment,
  statementCount: number,
  displayedPremises: readonly { form: string; subject: TermId; predicate: TermId }[],
  label: "I" | "II",
  svg: string,
): string {
  const special = directNotAllPossibility(record, locale, assignment, displayedPremises, label);
  if (special) return special;
  const lead = premiseLead(locale, statementCount);

  if (record.mode === "POSSIBILITY") {
    const body = record.canBeTrue
      ? possibleRegion(record.canonicalConclusion, locale, assignment)
      : blockedExistential(record.canonicalConclusion, locale, assignment);
    return `${label}: ${lead}${locale === "en-IN" ? ". " : "। "}${body} ${finish(locale, label, record.canBeTrue)}`;
  }

  if (record.canonicalConclusion.form === "ALL" || record.canonicalConclusion.form === "NO") {
    return record.classification === "CONTRADICTED"
      ? contradictedUniversal(record, locale, assignment, label, lead, svg)
      : definiteUniversal(record, locale, assignment, label, lead);
  }
  return definiteExistential(record, locale, assignment, label, lead, svg);
}

export function generateBankingPossibilityEditorialCandidate(
  seed: number,
  locale: SylLocale,
): BankingPossibilityEditorialCandidate {
  const question = generateBankingPossibilityReviewQuestionV4(seed, locale);
  const scenario = scenariosForGroup(question.scenarioGroup).find((entry) => entry.scenarioId === question.scenarioId);
  if (!scenario) throw new Error(`${question.scenarioId}: missing scenario for editorial candidate.`);
  const analysis = analyzeScenario(scenario);
  const assignment = assignTerms("SYL-QL-005", seed, analysis.termOrder);
  const displayedPremises = shuffle(
    analysis.premises,
    createPrng(`SYL-PROTOTYPE-BANK-POSSIBILITY-001:${seed}:premises`),
  );
  const explanation = question.conclusions.map((record, index) => explain(
    record,
    locale,
    assignment,
    question.statements.length,
    displayedPremises,
    index === 0 ? "I" : "II",
    question.diagram.svg,
  )) as [string, string];

  return { ...question, explanation };
}
