import type { CanonicalConclusion, SurfacePremise, SylLocale, TermId } from "../foundation/types";
import { analyzeScenario, conclusionSemanticKey } from "./analysis";
import type { BankingConclusionModeV1 } from "./banking-possibility-shell-v1";
import {
  generateBankingPossibilityReviewQuestionV4,
  type BankingPossibilityReviewQuestionV4,
} from "./banking-possibility-review-question-v4";
import type { TermAssignment } from "./localization";
import { createPrng, shuffle } from "./prng";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";
import type { EvaluatedConclusion } from "./types";

export type BankingPossibilityEditorialQuestionV5 = Omit<BankingPossibilityReviewQuestionV4, "explanation"> & {
  explanation: readonly [string, string];
};

interface ExplanationContext {
  locale: SylLocale;
  label: "I" | "II";
  mode: BankingConclusionModeV1;
  conclusion: CanonicalConclusion;
  candidate: EvaluatedConclusion;
  assignment: TermAssignment;
  displayedPremises: readonly SurfacePremise[];
  statements: readonly string[];
}

function termLabel(term: TermId, locale: SylLocale, assignment: TermAssignment): string {
  return assignment[term]?.labels[locale] ?? term;
}

function relationText(
  conclusion: CanonicalConclusion,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const subject = termLabel(conclusion.subject, locale, assignment);
  const predicate = termLabel(conclusion.predicate, locale, assignment);
  if (locale === "hi-IN") {
    switch (conclusion.form) {
      case "ALL": return `सभी ${subject} ${predicate} हैं`;
      case "NO": return `कोई भी ${subject} ${predicate} नहीं है`;
      case "SOME": return `कुछ ${subject} ${predicate} हैं`;
      case "SOME_NOT": return `कुछ ${subject} ${predicate} नहीं हैं`;
    }
  }
  if (locale === "pa-IN") {
    switch (conclusion.form) {
      case "ALL": return `ਸਾਰੇ ${subject} ${predicate} ਹਨ`;
      case "NO": return `ਕੋਈ ਵੀ ${subject} ${predicate} ਨਹੀਂ ਹੈ`;
      case "SOME": return `ਕੁਝ ${subject} ${predicate} ਹਨ`;
      case "SOME_NOT": return `ਕੁਝ ${subject} ${predicate} ਨਹੀਂ ਹਨ`;
    }
  }
  switch (conclusion.form) {
    case "ALL": return `all ${subject} are ${predicate}`;
    case "NO": return `no ${subject} are ${predicate}`;
    case "SOME": return `some ${subject} are ${predicate}`;
    case "SOME_NOT": return `some ${subject} are not ${predicate}`;
  }
}

function forcedText(
  conclusion: CanonicalConclusion,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const subject = termLabel(conclusion.subject, locale, assignment);
  const predicate = termLabel(conclusion.predicate, locale, assignment);
  if (locale === "hi-IN") {
    switch (conclusion.form) {
      case "ALL": return `हर ${subject} का ${predicate} होना अनिवार्य है`;
      case "NO": return `${subject} और ${predicate} का अलग रहना अनिवार्य है`;
      case "SOME": return `कम-से-कम एक ${subject} का ${predicate} भी होना अनिवार्य है`;
      case "SOME_NOT": return `कम-से-कम एक ${subject} का ${predicate} न होना अनिवार्य है`;
    }
  }
  if (locale === "pa-IN") {
    switch (conclusion.form) {
      case "ALL": return `ਹਰ ${subject} ਦਾ ${predicate} ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ`;
      case "NO": return `${subject} ਅਤੇ ${predicate} ਦਾ ਵੱਖ ਰਹਿਣਾ ਲਾਜ਼ਮੀ ਹੈ`;
      case "SOME": return `ਘੱਟੋ-ਘੱਟ ਇੱਕ ${subject} ਦਾ ${predicate} ਵੀ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ`;
      case "SOME_NOT": return `ਘੱਟੋ-ਘੱਟ ਇੱਕ ${subject} ਦਾ ${predicate} ਨਾ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ`;
    }
  }
  switch (conclusion.form) {
    case "ALL": return `every ${subject} must be ${predicate}`;
    case "NO": return `${subject} and ${predicate} must be disjoint`;
    case "SOME": return `at least one ${subject} must also be ${predicate}`;
    case "SOME_NOT": return `at least one ${subject} must lie outside ${predicate}`;
  }
}

function blockingText(
  conclusion: CanonicalConclusion,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const subject = termLabel(conclusion.subject, locale, assignment);
  const predicate = termLabel(conclusion.predicate, locale, assignment);
  if (locale === "hi-IN") {
    switch (conclusion.form) {
      case "ALL": return `कम-से-कम एक ${subject} का ${predicate} से बाहर होना अनिवार्य है`;
      case "NO": return `कम-से-कम एक ${subject} का ${predicate} भी होना अनिवार्य है`;
      case "SOME": return `${subject} और ${predicate} का अलग रहना अनिवार्य है`;
      case "SOME_NOT": return `हर ${subject} का ${predicate} होना अनिवार्य है`;
    }
  }
  if (locale === "pa-IN") {
    switch (conclusion.form) {
      case "ALL": return `ਘੱਟੋ-ਘੱਟ ਇੱਕ ${subject} ਦਾ ${predicate} ਤੋਂ ਬਾਹਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ`;
      case "NO": return `ਘੱਟੋ-ਘੱਟ ਇੱਕ ${subject} ਦਾ ${predicate} ਵੀ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ`;
      case "SOME": return `${subject} ਅਤੇ ${predicate} ਦਾ ਵੱਖ ਰਹਿਣਾ ਲਾਜ਼ਮੀ ਹੈ`;
      case "SOME_NOT": return `ਹਰ ${subject} ਦਾ ${predicate} ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ`;
    }
  }
  switch (conclusion.form) {
    case "ALL": return `at least one ${subject} must lie outside ${predicate}`;
    case "NO": return `at least one ${subject} must also be ${predicate}`;
    case "SOME": return `${subject} and ${predicate} must be disjoint`;
    case "SOME_NOT": return `every ${subject} must be ${predicate}`;
  }
}

function possiblePlacementText(
  conclusion: CanonicalConclusion,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const subject = termLabel(conclusion.subject, locale, assignment);
  const predicate = termLabel(conclusion.predicate, locale, assignment);
  if (locale === "hi-IN") {
    if (conclusion.form === "SOME") return `एक वैध वेन व्यवस्था में कम-से-कम एक ${subject}, ${predicate} भी हो सकता है`;
    if (conclusion.form === "SOME_NOT") return `एक वैध वेन व्यवस्था में कम-से-कम एक ${subject}, ${predicate} से बाहर हो सकता है`;
  }
  if (locale === "pa-IN") {
    if (conclusion.form === "SOME") return `ਇੱਕ ਵੈਧ ਵੇਨ ਬਣਤਰ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ${subject}, ${predicate} ਵੀ ਹੋ ਸਕਦਾ ਹੈ`;
    if (conclusion.form === "SOME_NOT") return `ਇੱਕ ਵੈਧ ਵੇਨ ਬਣਤਰ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ${subject}, ${predicate} ਤੋਂ ਬਾਹਰ ਹੋ ਸਕਦਾ ਹੈ`;
  }
  if (conclusion.form === "SOME") return `a valid Venn arrangement can place at least one ${subject} inside ${predicate}`;
  if (conclusion.form === "SOME_NOT") return `a valid Venn arrangement can place at least one ${subject} outside ${predicate}`;
  return relationText(conclusion, locale, assignment);
}

function impactIds(candidate: EvaluatedConclusion, mode: BankingConclusionModeV1): readonly string[] {
  const ids = mode === "POSSIBILITY"
    ? candidate.impactPremiseIds
    : candidate.verdictImpactPremiseIds;
  return ids.length > 0 ? ids : candidate.impactPremiseIds;
}

function statementNumbers(
  ids: readonly string[],
  displayedPremises: readonly SurfacePremise[],
): readonly number[] {
  const wanted = new Set(ids);
  const values = displayedPremises
    .map((premise, index) => wanted.has(premise.premiseId) ? index + 1 : -1)
    .filter((index) => index > 0);
  return values.length > 0 ? values : displayedPremises.map((_, index) => index + 1);
}

function evidenceLead(
  context: ExplanationContext,
): string {
  const numbers = statementNumbers(
    impactIds(context.candidate, context.mode),
    context.displayedPremises,
  );
  if (numbers.length === 1) {
    const number = numbers[0];
    const statement = context.statements[number - 1] ?? "";
    if (context.locale === "hi-IN") return `कथन ${number} (“${statement}”) को देखें`;
    if (context.locale === "pa-IN") return `ਕਥਨ ${number} (“${statement}”) ਨੂੰ ਵੇਖੋ`;
    return `Look at Statement ${number} (“${statement}”)`;
  }
  const joined = numbers.join(context.locale === "en-IN" ? " and " : context.locale === "hi-IN" ? " और " : " ਅਤੇ ");
  if (context.locale === "hi-IN") return `कथन ${joined} को साथ पढ़ें`;
  if (context.locale === "pa-IN") return `ਕਥਨ ${joined} ਨੂੰ ਇਕੱਠੇ ਪੜ੍ਹੋ`;
  return `Read Statements ${joined} together`;
}

function directNotAllPossibility(
  context: ExplanationContext,
): string | null {
  if (context.mode !== "POSSIBILITY" || context.conclusion.form !== "SOME") return null;
  const matching = context.displayedPremises.find((premise) =>
    premise.form === "NOT_ALL"
    && premise.subject === context.conclusion.subject
    && premise.predicate === context.conclusion.predicate);
  if (!matching) return null;
  const index = context.displayedPremises.indexOf(matching) + 1;
  const subject = termLabel(context.conclusion.subject, context.locale, context.assignment);
  const predicate = termLabel(context.conclusion.predicate, context.locale, context.assignment);
  if (context.locale === "hi-IN") {
    return `${context.label}: कथन ${index} में “सभी ${subject} ${predicate} नहीं हैं” का अर्थ है कि कम-से-कम एक ${subject}, ${predicate} नहीं है; इसका अर्थ “कोई ${subject} ${predicate} नहीं है” नहीं होता। इसलिए कुछ ${subject} के ${predicate} होने की संभावना बनी रहती है और निष्कर्ष ${context.label} अनुसरण करता है।`;
  }
  if (context.locale === "pa-IN") {
    return `${context.label}: ਕਥਨ ${index} ਵਿੱਚ “ਸਾਰੇ ${subject} ${predicate} ਨਹੀਂ ਹਨ” ਦਾ ਅਰਥ ਹੈ ਕਿ ਘੱਟੋ-ਘੱਟ ਇੱਕ ${subject}, ${predicate} ਨਹੀਂ ਹੈ; ਇਸ ਦਾ ਅਰਥ “ਕੋਈ ${subject} ${predicate} ਨਹੀਂ ਹੈ” ਨਹੀਂ ਹੁੰਦਾ। ਇਸ ਲਈ ਕੁਝ ${subject} ਦੇ ${predicate} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਬਣੀ ਰਹਿੰਦੀ ਹੈ ਅਤੇ ਨਤੀਜਾ ${context.label} ਸਹੀ ਹੈ।`;
  }
  return `${context.label}: Statement ${index} says not all ${subject} are ${predicate}; that guarantees at least one ${subject} outside ${predicate}, but it does not mean no ${subject} are ${predicate}. Therefore some ${subject} being ${predicate} remains possible, so Conclusion ${context.label} follows.`;
}

function explainConclusion(context: ExplanationContext): string {
  const special = directNotAllPossibility(context);
  if (special) return special;

  const lead = evidenceLead(context);
  const relation = relationText(context.conclusion, context.locale, context.assignment);
  const classification = context.candidate.profile.classification;

  if (context.locale === "hi-IN") {
    if (context.mode === "POSSIBILITY") {
      if (context.candidate.profile.canBeTrue) {
        return `${context.label}: ${lead}। ये कथन “${relation}” को रोकते नहीं हैं। ${possiblePlacementText(context.conclusion, context.locale, context.assignment)}; इसलिए निष्कर्ष ${context.label} की संभावना सही है।`;
      }
      return `${context.label}: ${lead}। इन कथनों से ${blockingText(context.conclusion, context.locale, context.assignment)}। इसलिए “${relation}” किसी भी वैध वेन व्यवस्था में संभव नहीं है और निष्कर्ष ${context.label} अनुसरण नहीं करता।`;
    }
    if (classification === "ENTAILED") {
      return `${context.label}: ${lead}। इन कथनों से ${forcedText(context.conclusion, context.locale, context.assignment)}। इसलिए “${relation}” हर वैध वेन व्यवस्था में सत्य है और निष्कर्ष ${context.label} अनुसरण करता है।`;
    }
    if (classification === "CONTRADICTED") {
      return `${context.label}: ${lead}। इन कथनों से ${blockingText(context.conclusion, context.locale, context.assignment)}। यह “${relation}” के विरुद्ध है, इसलिए निष्कर्ष ${context.label} अनुसरण नहीं करता।`;
    }
    return `${context.label}: ${lead}। ये कथन “${relation}” को निश्चित नहीं करते। यह संबंध एक वैध वेन व्यवस्था में सत्य और दूसरी में असत्य हो सकता है, इसलिए इसे निश्चित निष्कर्ष नहीं माना जा सकता।`;
  }

  if (context.locale === "pa-IN") {
    if (context.mode === "POSSIBILITY") {
      if (context.candidate.profile.canBeTrue) {
        return `${context.label}: ${lead}। ਇਹ ਕਥਨ “${relation}” ਨੂੰ ਰੋਕਦੇ ਨਹੀਂ ਹਨ। ${possiblePlacementText(context.conclusion, context.locale, context.assignment)}; ਇਸ ਲਈ ਨਤੀਜਾ ${context.label} ਦੀ ਸੰਭਾਵਨਾ ਸਹੀ ਹੈ।`;
      }
      return `${context.label}: ${lead}। ਇਨ੍ਹਾਂ ਕਥਨਾਂ ਤੋਂ ${blockingText(context.conclusion, context.locale, context.assignment)}। ਇਸ ਲਈ “${relation}” ਕਿਸੇ ਵੀ ਵੈਧ ਵੇਨ ਬਣਤਰ ਵਿੱਚ ਸੰਭਵ ਨਹੀਂ ਹੈ ਅਤੇ ਨਤੀਜਾ ${context.label} ਸਹੀ ਨਹੀਂ ਹੈ।`;
    }
    if (classification === "ENTAILED") {
      return `${context.label}: ${lead}। ਇਨ੍ਹਾਂ ਕਥਨਾਂ ਤੋਂ ${forcedText(context.conclusion, context.locale, context.assignment)}। ਇਸ ਲਈ “${relation}” ਹਰ ਵੈਧ ਵੇਨ ਬਣਤਰ ਵਿੱਚ ਸੱਚ ਹੈ ਅਤੇ ਨਤੀਜਾ ${context.label} ਸਹੀ ਹੈ।`;
    }
    if (classification === "CONTRADICTED") {
      return `${context.label}: ${lead}। ਇਨ੍ਹਾਂ ਕਥਨਾਂ ਤੋਂ ${blockingText(context.conclusion, context.locale, context.assignment)}। ਇਹ “${relation}” ਦੇ ਵਿਰੁੱਧ ਹੈ, ਇਸ ਲਈ ਨਤੀਜਾ ${context.label} ਸਹੀ ਨਹੀਂ ਹੈ।`;
    }
    return `${context.label}: ${lead}। ਇਹ ਕਥਨ “${relation}” ਨੂੰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਕਰਦੇ। ਇਹ ਸੰਬੰਧ ਇੱਕ ਵੈਧ ਵੇਨ ਬਣਤਰ ਵਿੱਚ ਸੱਚ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ਝੂਠ ਹੋ ਸਕਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਪੱਕਾ ਨਤੀਜਾ ਨਹੀਂ ਹੈ।`;
  }

  if (context.mode === "POSSIBILITY") {
    if (context.candidate.profile.canBeTrue) {
      return `${context.label}: ${lead}. The statements do not block “${relation}”. ${possiblePlacementText(context.conclusion, context.locale, context.assignment)}, so Conclusion ${context.label} is a valid possibility.`;
    }
    return `${context.label}: ${lead}. Together they force that ${blockingText(context.conclusion, context.locale, context.assignment)}. Therefore “${relation}” cannot occur in any valid Venn arrangement, so Conclusion ${context.label} does not follow.`;
  }
  if (classification === "ENTAILED") {
    return `${context.label}: ${lead}. Together they force that ${forcedText(context.conclusion, context.locale, context.assignment)}. Therefore “${relation}” is true in every valid Venn arrangement, so Conclusion ${context.label} follows.`;
  }
  if (classification === "CONTRADICTED") {
    return `${context.label}: ${lead}. Together they force that ${blockingText(context.conclusion, context.locale, context.assignment)}. That conflicts with “${relation}”, so Conclusion ${context.label} does not follow.`;
  }
  return `${context.label}: ${lead}. The statements leave “${relation}” undecided: it can be true in one valid Venn arrangement and false in another. A definite conclusion must hold in every valid arrangement, so Conclusion ${context.label} does not follow.`;
}

export function generateBankingPossibilityEditorialQuestionV5(
  seed: number,
  locale: SylLocale,
): BankingPossibilityEditorialQuestionV5 {
  const question = generateBankingPossibilityReviewQuestionV4(seed, locale);
  const scenario = scenariosForGroup(question.scenarioGroup).find((entry) => entry.scenarioId === question.scenarioId);
  if (!scenario) throw new Error(`${question.scenarioId}: missing scenario for editorial V5.`);
  const analysis = analyzeScenario(scenario);
  const assignment = assignTerms("SYL-QL-005", seed, analysis.termOrder);
  const displayedPremises = shuffle(
    analysis.premises,
    createPrng(`SYL-PROTOTYPE-BANK-POSSIBILITY-001:${seed}:premises`),
  );

  const explanation = question.conclusions.map((entry, index) => {
    const candidate = analysis.candidates.find((candidateEntry) =>
      conclusionSemanticKey(candidateEntry) === `${entry.canonicalConclusion.form}:${entry.canonicalConclusion.subject}:${entry.canonicalConclusion.predicate}`);
    if (!candidate) throw new Error(`${seed}/${locale}: candidate missing for conclusion ${index + 1}.`);
    return explainConclusion({
      locale,
      label: index === 0 ? "I" : "II",
      mode: entry.mode,
      conclusion: entry.canonicalConclusion,
      candidate,
      assignment,
      displayedPremises,
      statements: question.statements,
    });
  }) as [string, string];

  return {
    ...question,
    explanation,
  };
}
