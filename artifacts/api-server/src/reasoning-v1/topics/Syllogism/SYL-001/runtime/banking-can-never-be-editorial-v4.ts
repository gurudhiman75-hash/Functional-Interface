import type { SylLocale } from "../foundation/types";
import { analyzeScenario } from "./analysis";
import {
  generateBankingCanNeverEditorialV3,
  type BankingCanNeverEditorialV3Question,
} from "./banking-can-never-be-editorial-v3";
import type { BankingCanNeverConclusionV1 } from "./banking-can-never-be-shell-v1";
import {
  renderBankingPossibilityCombinedDiagramV3,
  type BankingPossibilityCombinedDiagramV3,
} from "./banking-possibility-combined-diagram-v3";
import {
  renderBankingFourTermPremiseVennV4,
  type BankingFourTermDiagramV4,
} from "./banking-possibility-four-term-venn-v4";
import type {
  BankingPossibilityConclusionV1,
  BankingPossibilityShellQuestionV1,
} from "./banking-possibility-shell-v1";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";
import type { PairSemanticStatus } from "./types";

export type BankingCanNeverCombinedDiagramV4 = BankingPossibilityCombinedDiagramV3 | BankingFourTermDiagramV4;

export interface BankingCanNeverVisualPolicyV4 {
  stemDiagram: "NONE";
  solutionDiagram: "ONE_COMBINED_PREMISE_DIAGRAM";
  disclosure: "AFTER_ATTEMPT";
  separateConclusionDiagrams: false;
  counterexampleSupplement: "TEXT_ONLY_WHEN_NEEDED_V4";
}

export type BankingCanNeverEditorialV4Question = Omit<BankingCanNeverEditorialV3Question, "editorialAuthority" | "explanation"> & {
  editorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4";
  explanation: readonly [string, string];
  diagram: BankingCanNeverCombinedDiagramV4;
  visualPolicy: BankingCanNeverVisualPolicyV4;
};

const VISUAL_POLICY_V4: BankingCanNeverVisualPolicyV4 = Object.freeze({
  stemDiagram: "NONE",
  solutionDiagram: "ONE_COMBINED_PREMISE_DIAGRAM",
  disclosure: "AFTER_ATTEMPT",
  separateConclusionDiagrams: false,
  counterexampleSupplement: "TEXT_ONLY_WHEN_NEEDED_V4",
});

type Assignment = ReturnType<typeof assignTerms>;

function pick(locale: SylLocale, en: string, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : locale === "pa-IN" ? pa : en;
}

function assignmentFor(question: BankingCanNeverEditorialV3Question): Assignment {
  const scenario = scenariosForGroup(question.scenarioGroup).find((entry) => entry.scenarioId === question.scenarioId);
  if (!scenario) throw new Error(`${question.scenarioId}: missing scenario for editorial V4.`);
  return assignTerms("SYL-QL-005", question.seed, analyzeScenario(scenario).termOrder);
}

function labelFor(
  question: BankingCanNeverEditorialV3Question,
  assignment: Assignment,
  conclusion: BankingCanNeverConclusionV1,
  side: "subject" | "predicate",
): string {
  const termId = conclusion.canonicalConclusion[side];
  const value = assignment[termId]?.labels[question.locale];
  if (!value) throw new Error(`${question.seed}/${termId}: missing V4 term label.`);
  return value;
}

function cls(locale: SylLocale, value: string): string {
  return pick(locale, `the “${value}” class`, `“${value}” वर्ग`, `“${value}” ਵਰਗ`);
}

function verdict(locale: SylLocale, label: "I" | "II", follows: boolean): string {
  return follows
    ? pick(locale, `Therefore Conclusion ${label} follows.`, `इसलिए निष्कर्ष ${label} अनुसरण करता है।`, `ਇਸ ਲਈ ਨਤੀਜਾ ${label} ਸਹੀ ਹੈ।`)
    : pick(locale, `Therefore Conclusion ${label} does not follow.`, `इसलिए निष्कर्ष ${label} अनुसरण नहीं करता।`, `ਇਸ ਲਈ ਨਤੀਜਾ ${label} ਸਹੀ ਨਹੀਂ ਹੈ।`);
}

function ordinaryReason(
  locale: SylLocale,
  conclusion: BankingCanNeverConclusionV1,
  subject: string,
  predicate: string,
): string {
  const s = cls(locale, subject);
  const p = cls(locale, predicate);
  const form = conclusion.canonicalConclusion.form;

  if (conclusion.classification === "ENTAILED") {
    if (form === "ALL") return pick(locale,
      `The combined premise diagram forces every member of ${s} inside ${p}`,
      `संयुक्त आरेख ${s} के हर सदस्य को ${p} के अंदर रखना अनिवार्य करता है`,
      `ਇਕੱਠਾ ਚਿੱਤਰ ${s} ਦੇ ਹਰ ਮੈਂਬਰ ਨੂੰ ${p} ਦੇ ਅੰਦਰ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਕਰਦਾ ਹੈ`);
    if (form === "NO") return pick(locale,
      `The combined premise diagram forces ${s} and ${p} to remain disjoint`,
      `संयुक्त आरेख ${s} और ${p} को पूरी तरह अलग रखना अनिवार्य करता है`,
      `ਇਕੱਠਾ ਚਿੱਤਰ ${s} ਅਤੇ ${p} ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਕਰਦਾ ਹੈ`);
    if (form === "SOME") return pick(locale,
      `The combined premise diagram forces at least one member to lie in both ${s} and ${p}`,
      `संयुक्त आरेख कम-से-कम एक सदस्य को ${s} और ${p} दोनों में होना अनिवार्य करता है`,
      `ਇਕੱਠਾ ਚਿੱਤਰ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਨੂੰ ${s} ਅਤੇ ${p} ਦੋਵਾਂ ਵਿੱਚ ਹੋਣਾ ਲਾਜ਼ਮੀ ਕਰਦਾ ਹੈ`);
    return pick(locale,
      `The combined premise diagram forces at least one member of ${s} outside ${p}`,
      `संयुक्त आरेख कम-से-कम एक सदस्य को ${s} में और ${p} से बाहर होना अनिवार्य करता है`,
      `ਇਕੱਠਾ ਚਿੱਤਰ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਨੂੰ ${s} ਵਿੱਚ ਅਤੇ ${p} ਤੋਂ ਬਾਹਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਕਰਦਾ ਹੈ`);
  }

  if (conclusion.classification === "CONTRADICTED") {
    if (form === "ALL") return pick(locale,
      `The statements force at least one member of ${s} outside ${p}, so full containment is impossible`,
      `कथन ${s} के कम-से-कम एक सदस्य को ${p} से बाहर रखते हैं, इसलिए पूरा वर्ग अंदर नहीं हो सकता`,
      `ਕਥਨ ${s} ਦੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਨੂੰ ${p} ਤੋਂ ਬਾਹਰ ਰੱਖਦੇ ਹਨ, ਇਸ ਲਈ ਪੂਰਾ ਵਰਗ ਅੰਦਰ ਨਹੀਂ ਹੋ ਸਕਦਾ`);
    if (form === "NO") return pick(locale,
      `The statements force a shared member of ${s} and ${p}, so complete separation is impossible`,
      `कथन ${s} और ${p} में साझा सदस्य अनिवार्य करते हैं, इसलिए दोनों वर्ग अलग नहीं हो सकते`,
      `ਕਥਨ ${s} ਅਤੇ ${p} ਵਿੱਚ ਸਾਂਝਾ ਮੈਂਬਰ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ, ਇਸ ਲਈ ਦੋਵੇਂ ਵਰਗ ਵੱਖ ਨਹੀਂ ਹੋ ਸਕਦੇ`);
    if (form === "SOME") return pick(locale,
      `The statements force ${s} and ${p} apart, so a shared member is impossible`,
      `कथन ${s} और ${p} को अलग रखते हैं, इसलिए साझा सदस्य असंभव है`,
      `ਕਥਨ ${s} ਅਤੇ ${p} ਨੂੰ ਵੱਖ ਰੱਖਦੇ ਹਨ, ਇਸ ਲਈ ਸਾਂਝਾ ਮੈਂਬਰ ਅਸੰਭਵ ਹੈ`);
    return pick(locale,
      `The statements force every existing member of ${s} inside ${p}, so an outside member is impossible`,
      `कथन ${s} के हर मौजूद सदस्य को ${p} के अंदर रखते हैं, इसलिए बाहर वाला सदस्य असंभव है`,
      `ਕਥਨ ${s} ਦੇ ਹਰ ਮੌਜੂਦ ਮੈਂਬਰ ਨੂੰ ${p} ਦੇ ਅੰਦਰ ਰੱਖਦੇ ਹਨ, ਇਸ ਲਈ ਬਾਹਰਲਾ ਮੈਂਬਰ ਅਸੰਭਵ ਹੈ`);
  }

  if (form === "ALL") return pick(locale,
    `The statements do not force every member of ${s} inside ${p}`,
    `कथन ${s} के हर सदस्य को ${p} के अंदर रखना निश्चित नहीं करते`,
    `ਕਥਨ ${s} ਦੇ ਹਰ ਮੈਂਬਰ ਨੂੰ ${p} ਦੇ ਅੰਦਰ ਰੱਖਣਾ ਪੱਕਾ ਨਹੀਂ ਕਰਦੇ`);
  if (form === "NO") return pick(locale,
    `The statements do not force ${s} and ${p} to remain disjoint`,
    `कथन ${s} और ${p} को पूरी तरह अलग रखना निश्चित नहीं करते`,
    `ਕਥਨ ${s} ਅਤੇ ${p} ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਰੱਖਣਾ ਪੱਕਾ ਨਹੀਂ ਕਰਦੇ`);
  if (form === "SOME") return pick(locale,
    `The statements do not force a shared member of ${s} and ${p}`,
    `कथन ${s} और ${p} में साझा सदस्य निश्चित नहीं करते`,
    `ਕਥਨ ${s} ਅਤੇ ${p} ਵਿੱਚ ਸਾਂਝਾ ਮੈਂਬਰ ਪੱਕਾ ਨਹੀਂ ਕਰਦੇ`);
  return pick(locale,
    `The statements do not force any member of ${s} outside ${p}`,
    `कथन ${s} के किसी सदस्य को ${p} से बाहर रहना निश्चित नहीं करते`,
    `ਕਥਨ ${s} ਦੇ ਕਿਸੇ ਮੈਂਬਰ ਨੂੰ ${p} ਤੋਂ ਬਾਹਰ ਰਹਿਣਾ ਪੱਕਾ ਨਹੀਂ ਕਰਦੇ`);
}

function modalReason(
  locale: SylLocale,
  conclusion: BankingCanNeverConclusionV1,
  subject: string,
  predicate: string,
): string {
  const s = cls(locale, subject);
  const p = cls(locale, predicate);

  if (conclusion.surfaceKind === "ALL_CAN_NEVER") {
    if (conclusion.follows) return pick(locale,
      `The combined premise diagram forces at least one member of ${s} outside ${p}; no valid arrangement can place all of ${s} inside ${p}`,
      `संयुक्त आरेख ${s} के कम-से-कम एक सदस्य को ${p} से बाहर रखता है; इसलिए सभी ${s} का ${p} में होना असंभव है`,
      `ਇਕੱਠਾ ਚਿੱਤਰ ${s} ਦੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਨੂੰ ${p} ਤੋਂ ਬਾਹਰ ਰੱਖਦਾ ਹੈ; ਇਸ ਲਈ ਸਾਰੇ ${s} ਦਾ ${p} ਵਿੱਚ ਹੋਣਾ ਅਸੰਭਵ ਹੈ`);
    if (conclusion.classification === "ENTAILED") return pick(locale,
      `The statements force every member of ${s} inside ${p}; the all-in relation is required, not impossible`,
      `कथन ${s} के हर सदस्य को ${p} के अंदर रखते हैं; इसलिए सभी ${s} का ${p} में होना असंभव नहीं, बल्कि निश्चित है`,
      `ਕਥਨ ${s} ਦੇ ਹਰ ਮੈਂਬਰ ਨੂੰ ${p} ਦੇ ਅੰਦਰ ਰੱਖਦੇ ਹਨ; ਇਸ ਲਈ ਸਾਰੇ ${s} ਦਾ ${p} ਵਿੱਚ ਹੋਣਾ ਅਸੰਭਵ ਨਹੀਂ, ਸਗੋਂ ਪੱਕਾ ਹੈ`);
    return pick(locale,
      `The statements still allow a valid arrangement with all of ${s} inside ${p}; “all can never be” is not proved`,
      `कथन एक वैध व्यवस्था में सभी ${s} को ${p} के अंदर रखने की अनुमति देते हैं; इसलिए “सभी कभी नहीं” सिद्ध नहीं होता`,
      `ਕਥਨ ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਸਾਰੇ ${s} ਨੂੰ ${p} ਦੇ ਅੰਦਰ ਰੱਖਣ ਦੀ ਆਗਿਆ ਦਿੰਦੇ ਹਨ; ਇਸ ਲਈ “ਸਾਰੇ ਕਦੇ ਨਹੀਂ” ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ`);
  }

  if (conclusion.follows) return pick(locale,
    `The combined premise diagram forces at least one member of ${s} outside ${p}; this is the definite negative member required by “some can never be”`,
    `संयुक्त आरेख ${s} के कम-से-कम एक सदस्य को ${p} से बाहर रखना निश्चित करता है; यही आवश्यक नकारात्मक सदस्य है`,
    `ਇਕੱਠਾ ਚਿੱਤਰ ${s} ਦੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਨੂੰ ${p} ਤੋਂ ਬਾਹਰ ਰੱਖਣਾ ਪੱਕਾ ਕਰਦਾ ਹੈ; ਇਹੀ ਲੋੜੀਂਦਾ ਨਕਾਰਾਤਮਕ ਮੈਂਬਰ ਹੈ`);
  if (conclusion.classification === "CONTRADICTED") return pick(locale,
    `The statements force every existing member of ${s} inside ${p}; an outside member is impossible`,
    `कथन ${s} के हर मौजूद सदस्य को ${p} के अंदर रखते हैं; इसलिए बाहर वाला आवश्यक सदस्य असंभव है`,
    `ਕਥਨ ${s} ਦੇ ਹਰ ਮੌਜੂਦ ਮੈਂਬਰ ਨੂੰ ${p} ਦੇ ਅੰਦਰ ਰੱਖਦੇ ਹਨ; ਇਸ ਲਈ ਬਾਹਰਲਾ ਲੋੜੀਂਦਾ ਮੈਂਬਰ ਅਸੰਭਵ ਹੈ`);
  return pick(locale,
    `A member of ${s} may lie outside ${p}, but the statements do not force such a member in every valid arrangement`,
    `कोई ${s} सदस्य ${p} से बाहर हो सकता है, लेकिन कथन ऐसे सदस्य को हर वैध व्यवस्था में अनिवार्य नहीं करते`,
    `ਕੋਈ ${s} ਮੈਂਬਰ ${p} ਤੋਂ ਬਾਹਰ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਕਥਨ ਅਜਿਹੇ ਮੈਂਬਰ ਨੂੰ ਹਰ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਰਦੇ`);
}

function explanationLine(
  question: BankingCanNeverEditorialV3Question,
  assignment: Assignment,
  conclusion: BankingCanNeverConclusionV1,
  label: "I" | "II",
): string {
  const subject = labelFor(question, assignment, conclusion, "subject");
  const predicate = labelFor(question, assignment, conclusion, "predicate");
  const reason = conclusion.mode === "CAN_NEVER_BE"
    ? modalReason(question.locale, conclusion, subject, predicate)
    : ordinaryReason(question.locale, conclusion, subject, predicate);
  return `${label}: ${reason}${question.locale === "en-IN" ? ". " : "। "}${verdict(question.locale, label, conclusion.follows)}`;
}

function carrierStatus(first: boolean, second: boolean): PairSemanticStatus {
  if (first && second) return "BOTH_FOLLOW";
  if (first) return "ONLY_FIRST_FOLLOWS";
  if (second) return "ONLY_SECOND_FOLLOWS";
  return "NEITHER_FOLLOWS";
}

function geometryConclusion(entry: BankingCanNeverConclusionV1): BankingPossibilityConclusionV1 {
  const follows = entry.classification === "ENTAILED";
  return {
    mode: "DEFINITE",
    canonicalConclusion: entry.canonicalConclusion,
    text: entry.text,
    follows,
    classification: entry.classification,
    canBeTrue: entry.canBeTrue,
    canBeFalse: entry.canBeFalse,
    witnessModelAvailable: entry.canBeTrue,
    counterModelAvailable: entry.canBeFalse,
  };
}

function geometryCarrier(question: BankingCanNeverEditorialV3Question): BankingPossibilityShellQuestionV1 {
  const conclusions = question.conclusions.map(geometryConclusion);
  if (conclusions.length !== 2) throw new Error(`${question.seed}/${question.locale}: expected two geometry conclusions.`);
  const semanticAnswer = carrierStatus(conclusions[0].follows, conclusions[1].follows);
  const options = question.options.map((entry) => ({
    ...entry,
    isCorrect: entry.semanticValue === semanticAnswer,
    errorLabel: entry.semanticValue === semanticAnswer ? null : "WRONG_COMBINATION_LABEL",
  }));
  const correctIndex = options.findIndex((entry) => entry.isCorrect);
  if (correctIndex < 0) throw new Error(`${question.seed}/${question.locale}: no geometry-carrier answer.`);

  // Compatibility carrier only. The inherited renderer requires its historical
  // 1/1 metadata shape; actual can-never semantics never read this metadata.
  return {
    authority: "SYL_001_BANKING_POSSIBILITY_SHELL_V1",
    prototypeId: "SYL-PROTOTYPE-BANK-POSSIBILITY-001",
    seed: question.seed,
    locale: question.locale,
    scenarioId: question.scenarioId,
    scenarioGroup: question.scenarioGroup,
    sourcePatternId: question.sourcePatternId,
    statements: question.statements,
    conclusions,
    options,
    correctIndex,
    semanticAnswer,
    explanation: [],
    metadata: {
      answerTemplateId: "BANK_FIVE_OPTION_V1",
      renderer: "CONCLUSION_COMBINATION",
      possibilityConclusionCount: 1,
      definiteConclusionCount: 1,
      legacyQlChanged: false,
      registeredQlCreated: false,
      connectedToProfilePlanner: false,
      questionStudioVisible: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}

function combinedDiagram(question: BankingCanNeverEditorialV3Question): BankingCanNeverCombinedDiagramV4 {
  const carrier = geometryCarrier(question);
  const primary = renderBankingPossibilityCombinedDiagramV3(carrier);
  if (primary.enabled) return primary;
  if (question.scenarioId === "SYL-SC-CORE-009") return renderBankingFourTermPremiseVennV4(carrier);
  throw new Error(`${question.seed}/${question.locale}/${question.scenarioId}: combined premise diagram omitted.`);
}

export function generateBankingCanNeverEditorialV4(seed: number, locale: SylLocale): BankingCanNeverEditorialV4Question {
  const base = generateBankingCanNeverEditorialV3(seed, locale);
  const assignment = assignmentFor(base);
  const explanation = base.conclusions.map((entry, index) =>
    explanationLine(base, assignment, entry, index === 0 ? "I" : "II")) as [string, string];
  return {
    ...base,
    editorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4",
    explanation,
    diagram: combinedDiagram(base),
    visualPolicy: VISUAL_POLICY_V4,
  };
}

export const SYL_BANKING_CAN_NEVER_BE_EDITORIAL_V4 = Object.freeze({
  authorityId: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4",
  semanticAuthority: "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2",
  priorEditorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V3",
  explanationPolicy: "CONCISE_TERM_SPECIFIC_DIAGRAM_ASSISTED_REASONING_V4",
  completePremiseEvidenceRetainedInternally: true,
  solutionDiagramPolicy: "ONE_COMBINED_PREMISE_DIAGRAM",
  stemDiagramPolicy: "NONE",
  disclosure: "AFTER_ATTEMPT",
  separateConclusionDiagrams: false,
  changesSemantics: false,
  changesStatements: false,
  changesConclusions: false,
  changesOptions: false,
  changesCorrectIndex: false,
  activationPermitted: false,
});
