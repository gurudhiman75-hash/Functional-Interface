import {
  generateRnkCp002AuthorityQuestion,
  type RnkCp002AuthorityReviewQuestion,
} from './cp002-authority-runtime';
import type { RnkCp002AuthorityId } from './cp002-consolidation';

const CANONICAL_FIRST = 'The first person is nearer the start end';
const CANONICAL_SECOND = 'The second person is nearer the start end';
const CANONICAL_IMPOSSIBLE = 'The proposed total is impossible';
const CANONICAL_BOTH = 'Both orders are possible';

interface ContextLanguage {
  readonly start: string;
  readonly end: string;
  readonly group: string;
  readonly singular: string;
  readonly plural: string;
  readonly memberHeading: string;
}

function contextLanguage(
  contextId: RnkCp002AuthorityReviewQuestion['contextId'],
): ContextLanguage {
  switch (contextId) {
    case 'MERIT_LIST':
      return { start: 'the top', end: 'the bottom', group: 'merit list', singular: 'candidate', plural: 'candidates', memberHeading: 'Candidates' };
    case 'HORIZONTAL_ROW':
      return { start: 'the left end', end: 'the right end', group: 'row', singular: 'person', plural: 'people', memberHeading: 'People' };
    case 'QUEUE':
      return { start: 'the front', end: 'the back', group: 'queue', singular: 'person', plural: 'people', memberHeading: 'People' };
  }
}

function requestedEndPhrase(question: RnkCp002AuthorityReviewQuestion): string | null {
  const evidence = question.displayedEvidence;
  const language = contextLanguage(question.contextId);
  if (evidence.kind === 'COMPARE_SAME_END') {
    if (evidence.requested === 'NEARER_SUPPLIED_END') return evidence.side === 'START' ? language.start : language.end;
    return evidence.requested === 'TOWARD_START' ? language.start : language.end;
  }
  if (evidence.kind === 'COMPARE_MIXED_END') return evidence.requested === 'TOWARD_START' ? language.start : language.end;
  return null;
}

function contextualOrderStatus(canonical: string, firstName: string, secondName: string, startPhrase: string): string {
  if (canonical === CANONICAL_FIRST) return `${firstName} is nearer ${startPhrase}`;
  if (canonical === CANONICAL_SECOND) return `${secondName} is nearer ${startPhrase}`;
  if (canonical === CANONICAL_BOTH) return `${firstName} and ${secondName} can appear in either order`;
  return canonical;
}

function replaceCanonicalOrderLanguage(
  text: string,
  firstName: string,
  secondName: string,
  language: ContextLanguage,
): string {
  return text
    .replaceAll(CANONICAL_FIRST, `${firstName} is nearer ${language.start}`)
    .replaceAll(CANONICAL_SECOND, `${secondName} is nearer ${language.start}`)
    .replaceAll(CANONICAL_BOTH, `${firstName} and ${secondName} can appear in either order`)
    .replaceAll('the first person', firstName)
    .replaceAll('the second person', secondName)
    .replaceAll('The first person', firstName)
    .replaceAll('The second person', secondName)
    .replaceAll('the start end', language.start)
    .replaceAll('the end end', language.end);
}

function normalizeFinalLearnerText(text: string): string {
  return text
    .replaceAll('the the ', 'the ')
    .replace(/\bwith no (?:people|candidates) between them\b/gi, 'with no one between them')
    .replace(/\bThere are no (?:people|candidates) between them\b/g, 'No one is between them')
    .replace(/\bthere are no (?:people|candidates) between them\b/g, 'no one is between them')
    .replace(/\s+/g, ' ')
    .trim();
}

function contextualBetweenConclusion(
  answer: string | number,
  firstName: string,
  secondName: string,
  language: ContextLanguage,
): string {
  const count = Number(answer);
  if (count === 0) return `Therefore, no one is between ${firstName} and ${secondName}.`;
  if (count === 1) return `Therefore, one ${language.singular} is between ${firstName} and ${secondName}.`;
  return `Therefore, ${count} ${language.plural} are between ${firstName} and ${secondName}.`;
}

function contextualTotalConclusion(answer: string | number, language: ContextLanguage): string {
  return `Therefore, the ${language.group} has ${answer} ${language.plural}.`;
}

export type RnkCp002EnglishReviewedAuthorityQuestion = RnkCp002AuthorityReviewQuestion & {
  readonly reviewMetadata: {
    readonly canonicalAnswer: string | number;
    readonly canonicalOptionValues: readonly (string | number)[];
    readonly canonicalAuthorityId: RnkCp002AuthorityId;
    readonly sourcePrototypeId: string;
    readonly reviewLayer: 'CP002_ENGLISH_REVIEW_V1';
  };
};

export function generateEnglishReviewedRnkCp002AuthorityQuestion(
  authorityId: RnkCp002AuthorityId,
  seed: number,
): RnkCp002EnglishReviewedAuthorityQuestion {
  const raw = generateRnkCp002AuthorityQuestion(authorityId, seed);
  const firstName = raw.firstName;
  const secondName = raw.secondName;
  const language = contextLanguage(raw.contextId);
  const requestedPhrase = requestedEndPhrase(raw);
  const canonicalAnswer = raw.answer;
  const canonicalOptionValues = raw.options.map((item) => item.value);

  let stem = raw.stem;
  let answer: string | number = raw.answer;
  let options = raw.options.map((item) => ({ ...item }));
  let keyRule = raw.explanation.keyRule;
  let steps = [...raw.explanation.stepByStepSolution];
  let shortcut = raw.explanation.examSpeedShortcut;
  let conclusion = raw.explanation.conclusion;

  if (authorityId === 'RNK-CP002-AUTH-01-PEOPLE-BETWEEN-NORMALIZED-POSITIONS') {
    keyRule = keyRule.replace(/^Members\b/, language.memberHeading);
    steps = steps.map((text) => text.replace(/^Members between\b/, `${language.memberHeading} between`));
    conclusion = contextualBetweenConclusion(answer, firstName, secondName, language);
  }
  if (authorityId === 'RNK-CP002-AUTH-02-POSITION-GAP-NORMALIZED-POSITIONS') conclusion = `Therefore, their positions differ by ${answer}.`;
  if (authorityId === 'RNK-CP002-AUTH-03-TARGET-RANK-FROM-REFERENCE-AND-SEPARATION') conclusion = `Therefore, ${secondName}'s rank is ${answer}.`;

  if (authorityId === 'RNK-CP002-AUTH-04-COMPARE-NORMALIZED-POSITIONS') {
    if (!requestedPhrase) throw new Error(`Missing requested-end phrase for ${authorityId}:${seed}`);
    stem = stem.replace(/Who is nearer the (?:start|end) end\?$/, `Who is nearer ${requestedPhrase}?`);
    keyRule = keyRule.replace('requested physical end', `requested side (${requestedPhrase})`);
    steps = steps.map((text) => text.replaceAll('the requested end', requestedPhrase));
    shortcut = shortcut.replace('that end', requestedPhrase);
    conclusion = `${answer} is nearer ${requestedPhrase}.`;
  }

  if (authorityId === 'RNK-CP002-AUTH-05-TOTAL-FROM-MIXED-ENDS-KNOWN-ORDER' || authorityId === 'RNK-CP002-AUTH-06-EXTREME-TOTAL-UNKNOWN-ORDER') {
    conclusion = contextualTotalConclusion(answer, language);
  }
  if (authorityId === 'RNK-CP002-AUTH-07-EXACT-TOTAL-OR-INDETERMINATE') {
    conclusion = String(answer) === 'Cannot be determined'
      ? 'Therefore, the exact total cannot be determined.'
      : contextualTotalConclusion(answer, language);
  }

  if (authorityId === 'RNK-CP002-AUTH-08-PROPOSED-TOTAL-ORDER-STATUS') {
    answer = contextualOrderStatus(String(raw.answer), firstName, secondName, language.start);
    options = raw.options.map((item) => {
      const contextualValue = contextualOrderStatus(String(item.value), firstName, secondName, language.start);
      return {
        ...item,
        value: contextualValue,
        label: contextualValue,
        explanation: replaceCanonicalOrderLanguage(item.explanation, firstName, secondName, language),
      };
    });
    keyRule = replaceCanonicalOrderLanguage(keyRule, firstName, secondName, language);
    steps = steps.map((text) => replaceCanonicalOrderLanguage(text, firstName, secondName, language));
    shortcut = replaceCanonicalOrderLanguage(shortcut, firstName, secondName, language);
    conclusion = answer === CANONICAL_IMPOSSIBLE ? 'Therefore, the proposed total is impossible.' : `Therefore, ${answer}.`;
  }

  stem = normalizeFinalLearnerText(stem);
  options = options.map((item) => ({ ...item, explanation: normalizeFinalLearnerText(item.explanation) }));
  keyRule = normalizeFinalLearnerText(keyRule);
  steps = steps.map(normalizeFinalLearnerText);
  shortcut = normalizeFinalLearnerText(shortcut);
  conclusion = normalizeFinalLearnerText(conclusion);
  const optionAnalysis = options.map((item, index) => `Option ${index + 1} (${item.label}): ${item.explanation}`);

  return {
    ...raw,
    stem,
    answer: answer as never,
    options: options as never,
    explanation: { keyRule, stepByStepSolution: steps, examSpeedShortcut: shortcut, optionAnalysis, conclusion },
    reviewMetadata: {
      canonicalAnswer,
      canonicalOptionValues,
      canonicalAuthorityId: authorityId,
      sourcePrototypeId: raw.sourcePrototypeId,
      reviewLayer: 'CP002_ENGLISH_REVIEW_V1',
    },
  };
}
