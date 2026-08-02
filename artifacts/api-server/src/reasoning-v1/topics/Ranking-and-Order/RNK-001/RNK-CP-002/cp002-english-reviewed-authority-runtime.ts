import {
  generateRnkCp002AuthorityQuestion,
  type RnkCp002AuthorityReviewQuestion,
} from './cp002-authority-runtime';
import type { RnkCp002AuthorityId } from './cp002-consolidation';

const CANONICAL_FIRST = 'The first person is nearer the start end';
const CANONICAL_SECOND = 'The second person is nearer the start end';
const CANONICAL_IMPOSSIBLE = 'The proposed total is impossible';
const CANONICAL_BOTH = 'Both orders are possible';

interface ContextEnds {
  readonly start: string;
  readonly end: string;
}

function contextEnds(contextId: RnkCp002AuthorityReviewQuestion['contextId']): ContextEnds {
  switch (contextId) {
    case 'MERIT_LIST':
      return { start: 'top', end: 'bottom' };
    case 'HORIZONTAL_ROW':
      return { start: 'left', end: 'right' };
    case 'QUEUE':
      return { start: 'front', end: 'back' };
  }
}

function requestedEndLabel(question: RnkCp002AuthorityReviewQuestion): string | null {
  const evidence = question.displayedEvidence;
  const ends = contextEnds(question.contextId);
  if (evidence.kind === 'COMPARE_SAME_END') {
    if (evidence.requested === 'NEARER_SUPPLIED_END') {
      return evidence.side === 'START' ? ends.start : ends.end;
    }
    return evidence.requested === 'TOWARD_START' ? ends.start : ends.end;
  }
  if (evidence.kind === 'COMPARE_MIXED_END') {
    return evidence.requested === 'TOWARD_START' ? ends.start : ends.end;
  }
  return null;
}

function contextualOrderStatus(
  canonical: string,
  firstName: string,
  secondName: string,
  startLabel: string,
): string {
  if (canonical === CANONICAL_FIRST) return `${firstName} is nearer the ${startLabel} end`;
  if (canonical === CANONICAL_SECOND) return `${secondName} is nearer the ${startLabel} end`;
  if (canonical === CANONICAL_BOTH) return `${firstName} and ${secondName} can appear in either order`;
  return canonical;
}

function replaceCanonicalOrderLanguage(
  text: string,
  firstName: string,
  secondName: string,
  startLabel: string,
): string {
  return text
    .replaceAll(CANONICAL_FIRST, `${firstName} is nearer the ${startLabel} end`)
    .replaceAll(CANONICAL_SECOND, `${secondName} is nearer the ${startLabel} end`)
    .replaceAll(CANONICAL_BOTH, `${firstName} and ${secondName} can appear in either order`)
    .replaceAll('the first person', firstName)
    .replaceAll('the second person', secondName)
    .replaceAll('The first person', firstName)
    .replaceAll('The second person', secondName)
    .replaceAll('the start end', `the ${startLabel} end`)
    .replaceAll('the end end', `the ${contextEndsForStart(startLabel).end} end`);
}

function contextEndsForStart(startLabel: string): ContextEnds {
  if (startLabel === 'top') return { start: 'top', end: 'bottom' };
  if (startLabel === 'left') return { start: 'left', end: 'right' };
  return { start: 'front', end: 'back' };
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
  const ends = contextEnds(raw.contextId);
  const requestedLabel = requestedEndLabel(raw);
  const canonicalAnswer = raw.answer;
  const canonicalOptionValues = raw.options.map((item) => item.value);

  let stem = raw.stem;
  let answer: string | number = raw.answer;
  let options = raw.options.map((item) => ({ ...item }));
  let keyRule = raw.explanation.keyRule;
  let steps = [...raw.explanation.stepByStepSolution];
  let shortcut = raw.explanation.examSpeedShortcut;
  let conclusion = raw.explanation.conclusion;

  if (authorityId === 'RNK-CP002-AUTH-04-COMPARE-NORMALIZED-POSITIONS') {
    if (!requestedLabel) throw new Error(`Missing requested-end label for ${authorityId}:${seed}`);
    stem = stem
      .replace(/Who is nearer the (?:start|end) end\?$/, `Who is nearer the ${requestedLabel} end?`);
    keyRule = keyRule.replace('requested physical end', `requested ${requestedLabel} end`);
    steps = steps.map((text) => text.replaceAll('requested end', `${requestedLabel} end`));
    shortcut = shortcut.replace('that end', `the ${requestedLabel} end`);
    conclusion = `${answer} is nearer the ${requestedLabel} end.`;
  }

  if (authorityId === 'RNK-CP002-AUTH-08-PROPOSED-TOTAL-ORDER-STATUS') {
    answer = contextualOrderStatus(String(raw.answer), firstName, secondName, ends.start);
    options = raw.options.map((item) => {
      const contextualValue = contextualOrderStatus(String(item.value), firstName, secondName, ends.start);
      return {
        ...item,
        value: contextualValue,
        label: contextualValue,
        explanation: replaceCanonicalOrderLanguage(item.explanation, firstName, secondName, ends.start),
      };
    });
    keyRule = replaceCanonicalOrderLanguage(keyRule, firstName, secondName, ends.start);
    steps = steps.map((text) => replaceCanonicalOrderLanguage(text, firstName, secondName, ends.start));
    shortcut = replaceCanonicalOrderLanguage(shortcut, firstName, secondName, ends.start);
    conclusion = answer === CANONICAL_IMPOSSIBLE
      ? 'Therefore, the proposed total is impossible.'
      : `Therefore, ${answer}.`;
  }

  const optionAnalysis = options.map(
    (item, index) => `Option ${index + 1} (${item.label}): ${item.explanation}`,
  );

  return {
    ...raw,
    stem,
    answer: answer as never,
    options: options as never,
    explanation: {
      keyRule,
      stepByStepSolution: steps,
      examSpeedShortcut: shortcut,
      optionAnalysis,
      conclusion,
    },
    reviewMetadata: {
      canonicalAnswer,
      canonicalOptionValues,
      canonicalAuthorityId: authorityId,
      sourcePrototypeId: raw.sourcePrototypeId,
      reviewLayer: 'CP002_ENGLISH_REVIEW_V1',
    },
  };
}
