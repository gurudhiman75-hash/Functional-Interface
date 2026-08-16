import type { SylLocale } from "../foundation/types";
import { analyzeScenario } from "./analysis";
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
import {
  generateBankingPossibilityShellV2,
  type BankingPossibilityConclusionV2,
  type BankingPossibilityShellQuestionV2,
} from "./banking-possibility-shell-v2";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";

export type BankingPossibilityEditorialDiagramV3 =
  | BankingPossibilityCombinedDiagramV3
  | BankingFourTermDiagramV4;

export interface BankingPossibilityVisualPolicyV3 {
  stemDiagram: "NONE";
  solutionDiagram: "ONE_COMBINED_PREMISE_DIAGRAM";
  disclosure: "AFTER_ATTEMPT";
  separateConclusionDiagrams: false;
  counterexampleSupplement: "TEXT_ONLY_WHEN_NEEDED_V3";
}

export type BankingPossibilityEditorialV3Question = BankingPossibilityShellQuestionV2 & {
  editorialAuthority: "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3";
  semanticAuthority: "SYL_001_BANKING_POSSIBILITY_SHELL_V2";
  explanation: readonly [string, string];
  diagram: BankingPossibilityEditorialDiagramV3;
  visualPolicy: BankingPossibilityVisualPolicyV3;
};

const VISUAL_POLICY_V3: BankingPossibilityVisualPolicyV3 = Object.freeze({
  stemDiagram: "NONE",
  solutionDiagram: "ONE_COMBINED_PREMISE_DIAGRAM",
  disclosure: "AFTER_ATTEMPT",
  separateConclusionDiagrams: false,
  counterexampleSupplement: "TEXT_ONLY_WHEN_NEEDED_V3",
});

type Assignment = ReturnType<typeof assignTerms>;

function pick(locale: SylLocale, en: string, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : locale === "pa-IN" ? pa : en;
}

function context(question: BankingPossibilityShellQuestionV2): { assignment: Assignment } {
  const scenario = scenariosForGroup(question.scenarioGroup).find((entry) =>
    entry.scenarioId === question.scenarioId);
  if (!scenario) throw new Error(`${question.scenarioId}: missing scenario for Banking possibility Editorial V3.`);
  return { assignment: assignTerms("SYL-QL-005", question.seed, analyzeScenario(scenario).termOrder) };
}

function termLabel(
  question: BankingPossibilityShellQuestionV2,
  assignment: Assignment,
  conclusion: BankingPossibilityConclusionV2,
  side: "subject" | "predicate",
): string {
  const termId = conclusion.canonicalConclusion[side];
  const value = assignment[termId]?.labels[question.locale];
  if (!value) throw new Error(`${question.seed}/${termId}: missing Banking possibility Editorial V3 term label.`);
  return value;
}

function cls(locale: SylLocale, value: string): string {
  return pick(locale, `the “${value}” class`, `“${value}” वर्ग`, `“${value}” ਵਰਗ`);
}

function verdict(locale: SylLocale, label: "I" | "II", follows: boolean): string {
  return follows
    ? pick(locale,
      `Therefore Conclusion ${label} follows.`,
      `इसलिए निष्कर्ष ${label} अनुसरण करता है।`,
      `ਇਸ ਲਈ ਨਤੀਜਾ ${label} ਸਹੀ ਹੈ।`)
    : pick(locale,
      `Therefore Conclusion ${label} does not follow.`,
      `इसलिए निष्कर्ष ${label} अनुसरण नहीं करता।`,
      `ਇਸ ਲਈ ਨਤੀਜਾ ${label} ਸਹੀ ਨਹੀਂ ਹੈ।`);
}

function ordinaryReason(
  locale: SylLocale,
  conclusion: BankingPossibilityConclusionV2,
  subject: string,
  predicate: string,
): string {
  const s = cls(locale, subject);
  const p = cls(locale, predicate);
  const form = conclusion.canonicalConclusion.form;

  if (conclusion.classification === "ENTAILED") {
    if (form === "ALL") return pick(locale,
      `The statements force every member of ${s} inside ${p}`,
      `कथन ${s} के हर सदस्य को ${p} के अंदर रखना अनिवार्य करते हैं`,
      `ਕਥਨ ${s} ਦੇ ਹਰ ਮੈਂਬਰ ਨੂੰ ${p} ਦੇ ਅੰਦਰ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ`);
    if (form === "NO") return pick(locale,
      `The statements force ${s} and ${p} to remain disjoint`,
      `कथन ${s} और ${p} को पूरी तरह अलग रखना अनिवार्य करते हैं`,
      `ਕਥਨ ${s} ਅਤੇ ${p} ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ`);
    if (form === "SOME") return pick(locale,
      `The statements force at least one member to belong to both ${s} and ${p}`,
      `कथन कम-से-कम एक सदस्य को ${s} और ${p} दोनों में होना अनिवार्य करते हैं`,
      `ਕਥਨ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਨੂੰ ${s} ਅਤੇ ${p} ਦੋਵਾਂ ਵਿੱਚ ਹੋਣਾ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ`);
    return pick(locale,
      `The statements force at least one member of ${s} outside ${p}`,
      `कथन ${s} के कम-से-कम एक सदस्य को ${p} से बाहर रखना अनिवार्य करते हैं`,
      `ਕਥਨ ${s} ਦੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਨੂੰ ${p} ਤੋਂ ਬਾਹਰ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ`);
  }

  if (conclusion.classification === "CONTRADICTED") {
    if (form === "ALL") return pick(locale,
      `The statements force at least one member of ${s} outside ${p}, so full containment cannot hold`,
      `कथन ${s} के कम-से-कम एक सदस्य को ${p} से बाहर रखते हैं, इसलिए पूरा ${s} वर्ग ${p} के अंदर नहीं हो सकता`,
      `ਕਥਨ ${s} ਦੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਨੂੰ ${p} ਤੋਂ ਬਾਹਰ ਰੱਖਦੇ ਹਨ, ਇਸ ਲਈ ਪੂਰਾ ${s} ਵਰਗ ${p} ਦੇ ਅੰਦਰ ਨਹੀਂ ਹੋ ਸਕਦਾ`);
    if (form === "NO") return pick(locale,
      `The statements force a shared member of ${s} and ${p}, so complete separation cannot hold`,
      `कथन ${s} और ${p} में साझा सदस्य अनिवार्य करते हैं, इसलिए दोनों वर्ग पूरी तरह अलग नहीं हो सकते`,
      `ਕਥਨ ${s} ਅਤੇ ${p} ਵਿੱਚ ਸਾਂਝਾ ਮੈਂਬਰ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ, ਇਸ ਲਈ ਦੋਵੇਂ ਵਰਗ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਨਹੀਂ ਹੋ ਸਕਦੇ`);
    if (form === "SOME") return pick(locale,
      `The statements force ${s} and ${p} apart, so a shared member cannot exist`,
      `कथन ${s} और ${p} को अलग रखते हैं, इसलिए साझा सदस्य नहीं हो सकता`,
      `ਕਥਨ ${s} ਅਤੇ ${p} ਨੂੰ ਵੱਖ ਰੱਖਦੇ ਹਨ, ਇਸ ਲਈ ਸਾਂਝਾ ਮੈਂਬਰ ਨਹੀਂ ਹੋ ਸਕਦਾ`);
    return pick(locale,
      `The statements force every existing member of ${s} inside ${p}, so an outside member cannot exist`,
      `कथन ${s} के हर मौजूद सदस्य को ${p} के अंदर रखते हैं, इसलिए ${p} से बाहर ऐसा सदस्य नहीं हो सकता`,
      `ਕਥਨ ${s} ਦੇ ਹਰ ਮੌਜੂਦ ਮੈਂਬਰ ਨੂੰ ${p} ਦੇ ਅੰਦਰ ਰੱਖਦੇ ਹਨ, ਇਸ ਲਈ ${p} ਤੋਂ ਬਾਹਰ ਅਜਿਹਾ ਮੈਂਬਰ ਨਹੀਂ ਹੋ ਸਕਦਾ`);
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
    `कथन ${s} और ${p} में साझा सदस्य होना निश्चित नहीं करते`,
    `ਕਥਨ ${s} ਅਤੇ ${p} ਵਿੱਚ ਸਾਂਝਾ ਮੈਂਬਰ ਹੋਣਾ ਪੱਕਾ ਨਹੀਂ ਕਰਦੇ`);
  return pick(locale,
    `The statements do not force any member of ${s} outside ${p}`,
    `कथन ${s} के किसी सदस्य को ${p} से बाहर रखना निश्चित नहीं करते`,
    `ਕਥਨ ${s} ਦੇ ਕਿਸੇ ਮੈਂਬਰ ਨੂੰ ${p} ਤੋਂ ਬਾਹਰ ਰੱਖਣਾ ਪੱਕਾ ਨਹੀਂ ਕਰਦੇ`);
}

function possibilityReason(
  locale: SylLocale,
  conclusion: BankingPossibilityConclusionV2,
  subject: string,
  predicate: string,
): string {
  const s = cls(locale, subject);
  const p = cls(locale, predicate);
  const form = conclusion.canonicalConclusion.form;
  const disposition = conclusion.possibilityDisposition;

  if (disposition === "OPEN_POSSIBILITY") {
    if (form === "ALL") return pick(locale,
      `A valid arrangement can place every member of ${s} inside ${p}, while the statements do not force that full containment`,
      `एक वैध व्यवस्था में ${s} के हर सदस्य को ${p} के अंदर रखा जा सकता है, जबकि कथन इस पूरे समावेशन को अनिवार्य नहीं करते`,
      `ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ${s} ਦੇ ਹਰ ਮੈਂਬਰ ਨੂੰ ${p} ਦੇ ਅੰਦਰ ਰੱਖਿਆ ਜਾ ਸਕਦਾ ਹੈ, ਜਦਕਿ ਕਥਨ ਇਸ ਪੂਰੇ ਸਮਾਵੇਸ਼ ਨੂੰ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਰਦੇ`);
    if (form === "SOME") return pick(locale,
      `A valid arrangement can contain a shared member of ${s} and ${p}, while the statements do not force that overlap`,
      `एक वैध व्यवस्था में ${s} और ${p} का साझा सदस्य हो सकता है, जबकि कथन इस मेल को अनिवार्य नहीं करते`,
      `ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ${s} ਅਤੇ ${p} ਦਾ ਸਾਂਝਾ ਮੈਂਬਰ ਹੋ ਸਕਦਾ ਹੈ, ਜਦਕਿ ਕਥਨ ਇਸ ਮਿਲਾਪ ਨੂੰ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਰਦੇ`);
    return pick(locale,
      `A valid arrangement can leave at least one member of ${s} outside ${p}, while the statements do not force that outside member`,
      `एक वैध व्यवस्था में ${s} का कम-से-कम एक सदस्य ${p} से बाहर हो सकता है, जबकि कथन ऐसे बाहर वाले सदस्य को अनिवार्य नहीं करते`,
      `ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ${s} ਦਾ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ${p} ਤੋਂ ਬਾਹਰ ਹੋ ਸਕਦਾ ਹੈ, ਜਦਕਿ ਕਥਨ ਅਜਿਹੇ ਬਾਹਰਲੇ ਮੈਂਬਰ ਨੂੰ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਰਦੇ`);
  }

  if (disposition === "ALREADY_DEFINITE") {
    if (form === "ALL") return pick(locale,
      `The statements already force every member of ${s} inside ${p}; this is definite, not merely an open possibility`,
      `कथन पहले ही ${s} के हर सदस्य को ${p} के अंदर रखना अनिवार्य करते हैं; यह संबंध निश्चित है, केवल खुली संभावना नहीं`,
      `ਕਥਨ ਪਹਿਲਾਂ ਹੀ ${s} ਦੇ ਹਰ ਮੈਂਬਰ ਨੂੰ ${p} ਦੇ ਅੰਦਰ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ; ਇਹ ਸੰਬੰਧ ਪੱਕਾ ਹੈ, ਸਿਰਫ਼ ਖੁੱਲ੍ਹੀ ਸੰਭਾਵਨਾ ਨਹੀਂ`);
    if (form === "SOME") return pick(locale,
      `The statements already force a shared member of ${s} and ${p}; the overlap is definite, not merely an open possibility`,
      `कथन पहले ही ${s} और ${p} का साझा सदस्य अनिवार्य करते हैं; यह मेल निश्चित है, केवल खुली संभावना नहीं`,
      `ਕਥਨ ਪਹਿਲਾਂ ਹੀ ${s} ਅਤੇ ${p} ਦਾ ਸਾਂਝਾ ਮੈਂਬਰ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ; ਇਹ ਮਿਲਾਪ ਪੱਕਾ ਹੈ, ਸਿਰਫ਼ ਖੁੱਲ੍ਹੀ ਸੰਭਾਵਨਾ ਨਹੀਂ`);
    return pick(locale,
      `The statements already force at least one member of ${s} outside ${p}; the outside member is definite, not merely an open possibility`,
      `कथन पहले ही ${s} के कम-से-कम एक सदस्य को ${p} से बाहर रखना अनिवार्य करते हैं; यह स्थिति निश्चित है, केवल खुली संभावना नहीं`,
      `ਕਥਨ ਪਹਿਲਾਂ ਹੀ ${s} ਦੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਨੂੰ ${p} ਤੋਂ ਬਾਹਰ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਕਰਦੇ ਹਨ; ਇਹ ਹਾਲਤ ਪੱਕੀ ਹੈ, ਸਿਰਫ਼ ਖੁੱਲ੍ਹੀ ਸੰਭਾਵਨਾ ਨਹੀਂ`);
  }

  if (form === "ALL") return pick(locale,
    `The statements force at least one member of ${s} outside ${p}, so no valid arrangement can place all of ${s} inside ${p}`,
    `कथन ${s} के कम-से-कम एक सदस्य को ${p} से बाहर रखते हैं, इसलिए किसी वैध व्यवस्था में पूरा ${s} वर्ग ${p} के अंदर नहीं हो सकता`,
    `ਕਥਨ ${s} ਦੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮੈਂਬਰ ਨੂੰ ${p} ਤੋਂ ਬਾਹਰ ਰੱਖਦੇ ਹਨ, ਇਸ ਲਈ ਕਿਸੇ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਪੂਰਾ ${s} ਵਰਗ ${p} ਦੇ ਅੰਦਰ ਨਹੀਂ ਹੋ ਸਕਦਾ`);
  if (form === "SOME") return pick(locale,
    `The statements force ${s} and ${p} apart, so no valid arrangement can give them a shared member`,
    `कथन ${s} और ${p} को अलग रखते हैं, इसलिए किसी वैध व्यवस्था में उनका साझा सदस्य नहीं हो सकता`,
    `ਕਥਨ ${s} ਅਤੇ ${p} ਨੂੰ ਵੱਖ ਰੱਖਦੇ ਹਨ, ਇਸ ਲਈ ਕਿਸੇ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦਾ ਸਾਂਝਾ ਮੈਂਬਰ ਨਹੀਂ ਹੋ ਸਕਦਾ`);
  return pick(locale,
    `The statements force every existing member of ${s} inside ${p}, so no valid arrangement can leave a member of ${s} outside ${p}`,
    `कथन ${s} के हर मौजूद सदस्य को ${p} के अंदर रखते हैं, इसलिए किसी वैध व्यवस्था में ${s} का सदस्य ${p} से बाहर नहीं रह सकता`,
    `ਕਥਨ ${s} ਦੇ ਹਰ ਮੌਜੂਦ ਮੈਂਬਰ ਨੂੰ ${p} ਦੇ ਅੰਦਰ ਰੱਖਦੇ ਹਨ, ਇਸ ਲਈ ਕਿਸੇ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ${s} ਦਾ ਮੈਂਬਰ ${p} ਤੋਂ ਬਾਹਰ ਨਹੀਂ ਰਹਿ ਸਕਦਾ`);
}

function explanationLine(
  question: BankingPossibilityShellQuestionV2,
  assignment: Assignment,
  conclusion: BankingPossibilityConclusionV2,
  label: "I" | "II",
): string {
  const subject = termLabel(question, assignment, conclusion, "subject");
  const predicate = termLabel(question, assignment, conclusion, "predicate");
  const reason = conclusion.mode === "POSSIBILITY"
    ? possibilityReason(question.locale, conclusion, subject, predicate)
    : ordinaryReason(question.locale, conclusion, subject, predicate);
  return `${reason}. ${verdict(question.locale, label, conclusion.follows)}`;
}

function v1Carrier(question: BankingPossibilityShellQuestionV2): BankingPossibilityShellQuestionV1 {
  return {
    authority: "SYL_001_BANKING_POSSIBILITY_SHELL_V1",
    prototypeId: "SYL-PROTOTYPE-BANK-POSSIBILITY-001",
    seed: question.seed,
    locale: question.locale,
    scenarioId: question.scenarioId,
    scenarioGroup: question.scenarioGroup,
    sourcePatternId: question.sourcePatternId,
    statements: question.statements,
    conclusions: question.conclusions.map((entry): BankingPossibilityConclusionV1 => ({
      mode: entry.mode,
      canonicalConclusion: entry.canonicalConclusion,
      text: entry.text,
      follows: entry.follows,
      classification: entry.classification,
      canBeTrue: entry.canBeTrue,
      canBeFalse: entry.canBeFalse,
      witnessModelAvailable: entry.witnessModelAvailable,
      counterModelAvailable: entry.counterModelAvailable,
    })),
    options: question.options,
    correctIndex: question.correctIndex,
    semanticAnswer: question.semanticAnswer,
    explanation: question.explanation,
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

function diagramFor(question: BankingPossibilityShellQuestionV2): BankingPossibilityEditorialDiagramV3 {
  const carrier = v1Carrier(question);
  const primary = renderBankingPossibilityCombinedDiagramV3(carrier);
  if (primary.enabled) return primary;
  if (question.scenarioId === "SYL-SC-CORE-009") return renderBankingFourTermPremiseVennV4(carrier);
  throw new Error(`${question.seed}/${question.locale}/${question.scenarioId}: Banking possibility Editorial V3 diagram omitted.`);
}

export function generateBankingPossibilityEditorialV3(
  seed: number,
  locale: SylLocale,
): BankingPossibilityEditorialV3Question {
  const base = generateBankingPossibilityShellV2(seed, locale);
  const { assignment } = context(base);
  const explanation = [
    explanationLine(base, assignment, base.conclusions[0], "I"),
    explanationLine(base, assignment, base.conclusions[1], "II"),
  ] as const;
  return {
    ...base,
    editorialAuthority: "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3",
    semanticAuthority: "SYL_001_BANKING_POSSIBILITY_SHELL_V2",
    explanation,
    diagram: diagramFor(base),
    visualPolicy: VISUAL_POLICY_V3,
  };
}

export const SYL_BANKING_POSSIBILITY_EDITORIAL_V3 = Object.freeze({
  authorityId: "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3",
  semanticAuthority: "SYL_001_BANKING_POSSIBILITY_SHELL_V2",
  status: "HUMAN_REVIEW_CANDIDATE_NOT_REGISTERED_NOT_ACTIVE",
  explanationPolicy: "TERM_SPECIFIC_DISPOSITION_AWARE_REASONING_V3",
  diagramPolicy: "ONE_COMBINED_PREMISE_DIAGRAM_AFTER_ATTEMPT_V3",
  separateConclusionDiagrams: false,
  registeredQlCreated: false,
  connectedToProductionGenerator: false,
  questionStudioVisible: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  activationPermitted: false,
});
