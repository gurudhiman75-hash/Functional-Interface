import type { CanonicalCategoricalForm, SylLocale } from "../foundation/types";
import { analyzeScenario } from "./analysis";
import {
  generateBankingCanNeverShellV2,
  type BankingCanNeverShellQuestionV2,
} from "./banking-can-never-be-shell-v2";
import type { BankingCanNeverConclusionV1 } from "./banking-can-never-be-shell-v1";
import { renderPremise } from "./localization";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";

export interface BankingCanNeverExplanationEvidenceV3 {
  label: "I" | "II";
  premiseIds: readonly string[];
  renderedPremises: readonly string[];
}

export type BankingCanNeverEditorialV3Question = BankingCanNeverShellQuestionV2 & {
  editorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V3";
  explanationEvidence: readonly BankingCanNeverExplanationEvidenceV3[];
};

interface ContextV3 {
  question: BankingCanNeverShellQuestionV2;
  analysis: ReturnType<typeof analyzeScenario>;
  assignment: ReturnType<typeof assignTerms>;
}

function contextFor(question: BankingCanNeverShellQuestionV2): ContextV3 {
  const scenario = scenariosForGroup(question.scenarioGroup).find((entry) =>
    entry.scenarioId === question.scenarioId);
  if (!scenario) throw new Error(`${question.scenarioId}: missing scenario for editorial V3.`);
  const analysis = analyzeScenario(scenario);
  return {
    question,
    analysis,
    assignment: assignTerms("SYL-QL-005", question.seed, analysis.termOrder),
  };
}

function termLabel(
  context: ContextV3,
  conclusion: BankingCanNeverConclusionV1,
  side: "subject" | "predicate",
): string {
  const termId = conclusion.canonicalConclusion[side];
  const label = context.assignment[termId]?.labels[context.question.locale];
  if (!label) throw new Error(`${context.question.seed}/${termId}: missing term label.`);
  return label;
}

function evidenceFor(
  context: ContextV3,
  label: "I" | "II",
): BankingCanNeverExplanationEvidenceV3 {
  // Learner explanations deliberately use the complete premise set. A prior
  // impact-premise heuristic could omit an existential premise that was still
  // required for a sound human proof (for example, NO + SOME -> SOME_NOT).
  const selected = context.analysis.premises;
  const premiseIds = selected.map((premise) => premise.premiseId);
  const renderedPremises = selected.map((premise) =>
    renderPremise(premise, context.question.locale, context.assignment));
  if (renderedPremises.length === 0) {
    throw new Error(`${context.question.seed}/${label}: explanation evidence must not be empty.`);
  }
  return { label, premiseIds, renderedPremises };
}

function quotedEvidence(locale: SylLocale, statements: readonly string[]): string {
  const quoted = statements.map((statement) => `“${statement}”`);
  if (locale === "hi-IN") {
    return quoted.length === 1
      ? `कथन ${quoted[0]} से`
      : `कथनों ${quoted.join(" तथा ")} को साथ पढ़ने पर`;
  }
  if (locale === "pa-IN") {
    return quoted.length === 1
      ? `ਕਥਨ ${quoted[0]} ਤੋਂ`
      : `ਕਥਨਾਂ ${quoted.join(" ਅਤੇ ")} ਨੂੰ ਇਕੱਠੇ ਪੜ੍ਹਨ ਨਾਲ`;
  }
  return quoted.length === 1
    ? `From the statement ${quoted[0]}`
    : `Reading ${quoted.join(" and ")} together`;
}

function localizedClass(locale: SylLocale, label: string): string {
  if (locale === "hi-IN") return `“${label}” वर्ग`;
  if (locale === "pa-IN") return `“${label}” ਵਰਗ`;
  return `the “${label}” class`;
}

function renderNegativeConclusion(
  context: ContextV3,
  conclusion: BankingCanNeverConclusionV1,
): string {
  if (conclusion.mode !== "CAN_NEVER_BE" || !conclusion.surfaceKind) return conclusion.text;
  const locale = context.question.locale;
  const subject = termLabel(context, conclusion, "subject");
  const predicate = termLabel(context, conclusion, "predicate");

  if (locale === "en-IN") return conclusion.text;
  if (locale === "hi-IN") {
    return conclusion.surfaceKind === "ALL_CAN_NEVER"
      ? `${localizedClass(locale, subject)} के सभी सदस्यों का ${localizedClass(locale, predicate)} में होना असंभव है।`
      : `${localizedClass(locale, subject)} का कम-से-कम एक सदस्य ${localizedClass(locale, predicate)} का सदस्य कभी नहीं हो सकता।`;
  }
  return conclusion.surfaceKind === "ALL_CAN_NEVER"
    ? `${localizedClass(locale, subject)} ਦੇ ਸਾਰੇ ਮੈਂਬਰਾਂ ਦਾ ${localizedClass(locale, predicate)} ਵਿੱਚ ਹੋਣਾ ਅਸੰਭਵ ਹੈ।`
    : `${localizedClass(locale, subject)} ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ${localizedClass(locale, predicate)} ਦਾ ਮੈਂਬਰ ਕਦੇ ਨਹੀਂ ਹੋ ਸਕਦਾ।`;
}

function ordinaryRelation(
  locale: SylLocale,
  form: CanonicalCategoricalForm,
  subject: string,
  predicate: string,
  classification: BankingCanNeverConclusionV1["classification"],
): string {
  const s = localizedClass(locale, subject);
  const p = localizedClass(locale, predicate);

  if (locale === "hi-IN") {
    if (classification === "ENTAILED") {
      if (form === "ALL") return `${s} का हर सदस्य ${p} में होना ही चाहिए`;
      if (form === "NO") return `${s} और ${p} का कोई सदस्य साझा नहीं हो सकता`;
      if (form === "SOME") return `कम-से-कम एक सदस्य ${s} और ${p} दोनों में होना ही चाहिए`;
      return `कम-से-कम एक सदस्य ${s} में और ${p} से बाहर होना ही चाहिए`;
    }
    if (classification === "CONTRADICTED") {
      if (form === "ALL") return `${s} के कम-से-कम एक सदस्य का ${p} से बाहर रहना निश्चित है`;
      if (form === "NO") return `${s} और ${p} में कम-से-कम एक साझा सदस्य होना निश्चित है`;
      if (form === "SOME") return `${s} और ${p} का साझा सदस्य होना असंभव है`;
      return `${s} का हर मौजूद सदस्य ${p} के भीतर रहने को बाध्य है`;
    }
    if (form === "ALL") return `${s} के हर सदस्य का ${p} में होना निश्चित नहीं है`;
    if (form === "NO") return `${s} और ${p} का पूरी तरह अलग रहना निश्चित नहीं है`;
    if (form === "SOME") return `${s} और ${p} का कोई साझा सदस्य होना निश्चित नहीं है`;
    return `${s} के किसी सदस्य का ${p} से बाहर रहना निश्चित नहीं है`;
  }

  if (locale === "pa-IN") {
    if (classification === "ENTAILED") {
      if (form === "ALL") return `${s} ਦਾ ਹਰ ਮੈਂਬਰ ${p} ਵਿੱਚ ਹੋਣਾ ਹੀ ਚਾਹੀਦਾ ਹੈ`;
      if (form === "NO") return `${s} ਅਤੇ ${p} ਦਾ ਕੋਈ ਮੈਂਬਰ ਸਾਂਝਾ ਨਹੀਂ ਹੋ ਸਕਦਾ`;
      if (form === "SOME") return `ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ${s} ਅਤੇ ${p} ਦੋਵਾਂ ਵਿੱਚ ਹੋਣਾ ਹੀ ਚਾਹੀਦਾ ਹੈ`;
      return `ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ${s} ਵਿੱਚ ਅਤੇ ${p} ਤੋਂ ਬਾਹਰ ਹੋਣਾ ਹੀ ਚਾਹੀਦਾ ਹੈ`;
    }
    if (classification === "CONTRADICTED") {
      if (form === "ALL") return `${s} ਦੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਦਾ ${p} ਤੋਂ ਬਾਹਰ ਰਹਿਣਾ ਪੱਕਾ ਹੈ`;
      if (form === "NO") return `${s} ਅਤੇ ${p} ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਾਂਝਾ ਮੈਂਬਰ ਹੋਣਾ ਪੱਕਾ ਹੈ`;
      if (form === "SOME") return `${s} ਅਤੇ ${p} ਦਾ ਸਾਂਝਾ ਮੈਂਬਰ ਹੋਣਾ ਅਸੰਭਵ ਹੈ`;
      return `${s} ਦਾ ਹਰ ਮੌਜੂਦ ਮੈਂਬਰ ${p} ਦੇ ਅੰਦਰ ਰਹਿਣ ਲਈ ਮਜਬੂਰ ਹੈ`;
    }
    if (form === "ALL") return `${s} ਦੇ ਹਰ ਮੈਂਬਰ ਦਾ ${p} ਵਿੱਚ ਹੋਣਾ ਪੱਕਾ ਨਹੀਂ ਹੈ`;
    if (form === "NO") return `${s} ਅਤੇ ${p} ਦਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਰਹਿਣਾ ਪੱਕਾ ਨਹੀਂ ਹੈ`;
    if (form === "SOME") return `${s} ਅਤੇ ${p} ਦਾ ਕੋਈ ਸਾਂਝਾ ਮੈਂਬਰ ਹੋਣਾ ਪੱਕਾ ਨਹੀਂ ਹੈ`;
    return `${s} ਦੇ ਕਿਸੇ ਮੈਂਬਰ ਦਾ ${p} ਤੋਂ ਬਾਹਰ ਰਹਿਣਾ ਪੱਕਾ ਨਹੀਂ ਹੈ`;
  }

  if (classification === "ENTAILED") {
    if (form === "ALL") return `every member of ${s} must also belong to ${p}`;
    if (form === "NO") return `${s} and ${p} must remain disjoint`;
    if (form === "SOME") return `at least one member must belong to both ${s} and ${p}`;
    return `at least one member of ${s} must remain outside ${p}`;
  }
  if (classification === "CONTRADICTED") {
    if (form === "ALL") return `at least one member of ${s} is forced to stay outside ${p}`;
    if (form === "NO") return `at least one member is forced to belong to both ${s} and ${p}`;
    if (form === "SOME") return `an overlap between ${s} and ${p} is impossible`;
    return `every existing member of ${s} is forced to stay inside ${p}`;
  }
  if (form === "ALL") return `it is not forced that every member of ${s} belongs to ${p}`;
  if (form === "NO") return `it is not forced that ${s} and ${p} are disjoint`;
  if (form === "SOME") return `no overlap between ${s} and ${p} is forced`;
  return `no member of ${s} is forced to remain outside ${p}`;
}

function explainOrdinary(
  context: ContextV3,
  conclusion: BankingCanNeverConclusionV1,
  evidence: BankingCanNeverExplanationEvidenceV3,
): string {
  const locale = context.question.locale;
  const subject = termLabel(context, conclusion, "subject");
  const predicate = termLabel(context, conclusion, "predicate");
  const lead = quotedEvidence(locale, evidence.renderedPremises);
  const relation = ordinaryRelation(
    locale,
    conclusion.canonicalConclusion.form,
    subject,
    predicate,
    conclusion.classification,
  );

  if (locale === "hi-IN") {
    return conclusion.follows
      ? `${evidence.label}: ${lead}, ${relation}। इसलिए निष्कर्ष ${evidence.label} अनुसरण करता है।`
      : conclusion.classification === "CONTRADICTED"
        ? `${evidence.label}: ${lead}, ${relation}। इसलिए दिया गया निष्कर्ष संभव नहीं है और अनुसरण नहीं करता।`
        : `${evidence.label}: ${lead}, ${relation}। इसलिए निष्कर्ष ${evidence.label} निश्चित रूप से अनुसरण नहीं करता।`;
  }
  if (locale === "pa-IN") {
    return conclusion.follows
      ? `${evidence.label}: ${lead}, ${relation}। ਇਸ ਲਈ ਨਤੀਜਾ ${evidence.label} ਸਹੀ ਹੈ।`
      : conclusion.classification === "CONTRADICTED"
        ? `${evidence.label}: ${lead}, ${relation}। ਇਸ ਲਈ ਦਿੱਤਾ ਨਤੀਜਾ ਸੰਭਵ ਨਹੀਂ ਅਤੇ ਸਹੀ ਨਹੀਂ ਹੈ।`
        : `${evidence.label}: ${lead}, ${relation}। ਇਸ ਲਈ ਨਤੀਜਾ ${evidence.label} ਲਾਜ਼ਮੀ ਤੌਰ ਤੇ ਸਹੀ ਨਹੀਂ ਹੈ।`;
  }
  return conclusion.follows
    ? `${evidence.label}: ${lead}, ${relation}. Therefore Conclusion ${evidence.label} follows.`
    : conclusion.classification === "CONTRADICTED"
      ? `${evidence.label}: ${lead}, ${relation}. Therefore the stated conclusion is impossible and does not follow.`
      : `${evidence.label}: ${lead}, ${relation}. Therefore Conclusion ${evidence.label} is not guaranteed and does not follow.`;
}

function explainModal(
  context: ContextV3,
  conclusion: BankingCanNeverConclusionV1,
  evidence: BankingCanNeverExplanationEvidenceV3,
): string {
  const locale = context.question.locale;
  const subject = termLabel(context, conclusion, "subject");
  const predicate = termLabel(context, conclusion, "predicate");
  const lead = quotedEvidence(locale, evidence.renderedPremises);
  const s = localizedClass(locale, subject);
  const p = localizedClass(locale, predicate);

  if (locale === "hi-IN") {
    if (conclusion.surfaceKind === "ALL_CAN_NEVER") {
      return conclusion.follows
        ? `${evidence.label}: ${lead}, ${s} का कम-से-कम एक सदस्य ${p} से बाहर रहना ही चाहिए। इसलिए ${s} के सभी सदस्यों का ${p} में होना असंभव है और निष्कर्ष ${evidence.label} अनुसरण करता है।`
        : `${evidence.label}: ${lead}, कम-से-कम एक वैध व्यवस्था में ${s} के सभी सदस्य ${p} में रखे जा सकते हैं। इसलिए “कभी संभव नहीं” सिद्ध नहीं होता और निष्कर्ष ${evidence.label} अनुसरण नहीं करता।`;
    }
    return conclusion.follows
      ? `${evidence.label}: ${lead}, ${s} का कम-से-कम एक सदस्य ${p} से बाहर रहना निश्चित है। इसलिए निष्कर्ष ${evidence.label} अनुसरण करता है।`
      : `${evidence.label}: ${lead}, ${s} के किसी सदस्य का ${p} से बाहर रहना हर वैध व्यवस्था में निश्चित नहीं है। इसलिए निष्कर्ष ${evidence.label} अनुसरण नहीं करता।`;
  }

  if (locale === "pa-IN") {
    if (conclusion.surfaceKind === "ALL_CAN_NEVER") {
      return conclusion.follows
        ? `${evidence.label}: ${lead}, ${s} ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ${p} ਤੋਂ ਬਾਹਰ ਰਹਿਣਾ ਹੀ ਚਾਹੀਦਾ ਹੈ। ਇਸ ਲਈ ${s} ਦੇ ਸਾਰੇ ਮੈਂਬਰਾਂ ਦਾ ${p} ਵਿੱਚ ਹੋਣਾ ਅਸੰਭਵ ਹੈ ਅਤੇ ਨਤੀਜਾ ${evidence.label} ਸਹੀ ਹੈ।`
        : `${evidence.label}: ${lead}, ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ${s} ਦੇ ਸਾਰੇ ਮੈਂਬਰ ${p} ਵਿੱਚ ਰੱਖੇ ਜਾ ਸਕਦੇ ਹਨ। ਇਸ ਲਈ “ਕਦੇ ਸੰਭਵ ਨਹੀਂ” ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ ਅਤੇ ਨਤੀਜਾ ${evidence.label} ਸਹੀ ਨਹੀਂ ਹੈ।`;
    }
    return conclusion.follows
      ? `${evidence.label}: ${lead}, ${s} ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ${p} ਤੋਂ ਬਾਹਰ ਰਹਿਣਾ ਪੱਕਾ ਹੈ। ਇਸ ਲਈ ਨਤੀਜਾ ${evidence.label} ਸਹੀ ਹੈ।`
      : `${evidence.label}: ${lead}, ${s} ਦੇ ਕਿਸੇ ਮੈਂਬਰ ਦਾ ${p} ਤੋਂ ਬਾਹਰ ਰਹਿਣਾ ਹਰ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਪੱਕਾ ਨਹੀਂ ਹੈ। ਇਸ ਲਈ ਨਤੀਜਾ ${evidence.label} ਸਹੀ ਨਹੀਂ ਹੈ।`;
  }

  if (conclusion.surfaceKind === "ALL_CAN_NEVER") {
    return conclusion.follows
      ? `${evidence.label}: ${lead}, at least one member of ${s} must remain outside ${p}. Therefore no valid arrangement can place every member of ${s} inside ${p}, so Conclusion ${evidence.label} follows.`
      : `${evidence.label}: ${lead}, at least one valid arrangement can still place every member of ${s} inside ${p}. Therefore “all ${subject} can never be ${predicate}” is not proved, so Conclusion ${evidence.label} does not follow.`;
  }
  return conclusion.follows
    ? `${evidence.label}: ${lead}, at least one member of ${s} is forced to remain outside ${p}. Therefore Conclusion ${evidence.label} follows.`
    : `${evidence.label}: ${lead}, no member of ${s} is forced to remain outside ${p} in every valid arrangement. Therefore Conclusion ${evidence.label} does not follow.`;
}

export function generateBankingCanNeverEditorialV3(
  seed: number,
  locale: SylLocale,
): BankingCanNeverEditorialV3Question {
  const base = generateBankingCanNeverShellV2(seed, locale);
  const context = contextFor(base);
  const labels = ["I", "II"] as const;
  const evidence = base.conclusions.map((_, index) => evidenceFor(context, labels[index]));
  const conclusions = base.conclusions.map((entry) => ({
    ...entry,
    text: renderNegativeConclusion(context, entry),
  }));
  const explanation = conclusions.map((entry, index) =>
    entry.mode === "CAN_NEVER_BE"
      ? explainModal(context, entry, evidence[index])
      : explainOrdinary(context, entry, evidence[index]));

  return {
    ...base,
    conclusions,
    explanation,
    editorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V3",
    explanationEvidence: evidence,
  };
}

export const SYL_BANKING_CAN_NEVER_BE_EDITORIAL_V3 = Object.freeze({
  authorityId: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V3",
  semanticAuthority: "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2",
  explanationPolicy: "COMPLETE_PREMISE_SET_RELATION_REASONING_V3",
  genericSolverExplanationPermitted: false,
  changesSemantics: false,
  changesStatements: false,
  changesOptions: false,
  changesCorrectIndex: false,
  activationPermitted: false,
});
