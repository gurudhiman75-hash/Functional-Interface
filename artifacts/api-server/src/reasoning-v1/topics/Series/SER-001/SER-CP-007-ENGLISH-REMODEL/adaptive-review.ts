export type SerCp007EditorialTaskKind =
  | "NEXT_TERM"
  | "MISSING_TERM"
  | "PREVIOUS_TERM"
  | "REPLACE_WRONG_TERM"
  | "FILL_GAPS"
  | "FILL_GAP_GROUPS"
  | "NEXT_TWO_TERMS"
  | "MISSING_TWO_TERMS"
  | "WRONG_AND_REPLACEMENT";

export type SerCp007ProofModel =
  | "DIRECT_COLUMN_MOVEMENT"
  | "INTERLEAVED_ROWS"
  | "POSITION_TRANSFORMATION"
  | "LENGTH_OR_CONTENT_CHANGE"
  | "CONTINUOUS_GAP_COMPLETION"
  | "MARKER_OR_BOUNDARY_MOVEMENT";

export interface SerCp007EditorialQuestion {
  readonly temporaryTemplateId: string;
  readonly canonicalAuthorityId: string;
  readonly sourceRuleId: string;
  readonly taskKind: string;
  readonly seed: number;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctAnswer: string;
  readonly correctIndex: number;
  readonly explanation: {
    readonly rule: string;
    readonly steps: readonly string[];
    readonly quickMethod: string;
    readonly commonMistake: string;
    readonly trapCode: string;
    readonly conclusion: string;
  };
  readonly hiddenState?: {
    readonly canonicalTerms?: readonly string[];
    readonly answerIndex?: number;
    readonly answerIndexes?: readonly number[];
  };
}

export interface SerCp007AdaptiveReview {
  readonly editorialTaskKind: SerCp007EditorialTaskKind;
  readonly proofModel: SerCp007ProofModel;
  readonly stem: string;
  readonly review: string;
  readonly workedSteps: readonly string[];
  readonly renderedShortcut: boolean;
  readonly renderedCheck: boolean;
}

const TASK_OPENERS: Readonly<
  Partial<Record<SerCp007EditorialTaskKind, readonly string[]>>
> = {
  NEXT_TERM: [
    "Find the next letter group in the series.",
    "Which letter group should come next?",
    "Choose the group that continues the series.",
  ],
  MISSING_TERM: [
    "Which group completes the series?",
    "Choose the letter group that should replace the question mark.",
    "Find the missing letter group.",
  ],
  PREVIOUS_TERM: [
    "Which group should appear immediately before this series?",
    "Find the letter group that comes just before the first shown term.",
  ],
  REPLACE_WRONG_TERM: [
    "Which group should replace the incorrect term?",
    "Choose the correct replacement for the wrongly placed group.",
    "One group is incorrect. Which group should be written in its place?",
  ],
  NEXT_TWO_TERMS: [
    "Which two groups should come next?",
    "Choose the ordered pair that continues the series.",
  ],
  MISSING_TWO_TERMS: [
    "Which ordered pair completes the two blanks?",
    "Choose the two groups that should replace the question marks.",
  ],
  WRONG_AND_REPLACEMENT: [
    "Choose the incorrect group together with its correct replacement.",
    "Which wrong group → correct group pair fixes the series?",
  ],
};

const INTERLEAVED = new Set([
  "TWO_INTERLEAVED_CLUSTER_SERIES",
  "K_INTERLEAVED_CLUSTER_SERIES",
]);
const POSITION_TRANSFORM = new Set([
  "CYCLIC_CLUSTER_PERMUTATION",
  "FIXED_POSITION_PERMUTATION_CLUSTER",
  "ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE",
]);
const LENGTH_CHANGE = new Set([
  "EDGE_DELETION_WORD_SEQUENCE",
  "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER",
  "GROWING_CONSECUTIVE_CLUSTER",
  "CUMULATIVE_PREFIX_CLUSTER",
  "SYMMETRIC_EDGE_GROWTH",
  "PATTERNED_INTERIOR_INSERTION_GROWTH",
]);
const GAP_COMPLETION = new Set([
  "REPEATED_BLOCK_COMPLETION",
  "ALTERNATING_BLOCK_COMPLETION",
]);
const MARKER = new Set([
  "MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME",
  "PROGRESSIVE_POSITIONAL_SUBSTITUTION",
]);

export function editorialTaskKindFor(
  taskKind: string,
): SerCp007EditorialTaskKind {
  if (taskKind === "WRONG_TERM") return "REPLACE_WRONG_TERM";
  return taskKind as SerCp007EditorialTaskKind;
}

export function proofModelFor(authorityId: string): SerCp007ProofModel {
  if (INTERLEAVED.has(authorityId)) return "INTERLEAVED_ROWS";
  if (POSITION_TRANSFORM.has(authorityId)) return "POSITION_TRANSFORMATION";
  if (LENGTH_CHANGE.has(authorityId)) return "LENGTH_OR_CONTENT_CHANGE";
  if (GAP_COMPLETION.has(authorityId)) return "CONTINUOUS_GAP_COMPLETION";
  if (MARKER.has(authorityId)) return "MARKER_OR_BOUNDARY_MOVEMENT";
  return "DIRECT_COLUMN_MOVEMENT";
}

function stableIndex(question: SerCp007EditorialQuestion, length: number): number {
  let hash = question.seed;
  for (const character of question.temporaryTemplateId) {
    hash = (hash * 33 + character.charCodeAt(0)) >>> 0;
  }
  return hash % length;
}

function adaptiveStem(
  question: SerCp007EditorialQuestion,
  taskKind: SerCp007EditorialTaskKind,
): string {
  if (taskKind === "FILL_GAPS" || taskKind === "FILL_GAP_GROUPS") {
    return question.stem;
  }
  const pool = TASK_OPENERS[taskKind];
  if (!pool || pool.length === 0) return question.stem;
  const [, ...bodyLines] = question.stem.split("\n");
  const opener = pool[stableIndex(question, pool.length)]!;
  return bodyLines.length > 0 ? `${opener}\n${bodyLines.join("\n")}` : opener;
}

function uniqueSteps(steps: readonly string[]): readonly string[] {
  return [...new Set(steps.map((step) => step.trim()).filter(Boolean))];
}

const STRUCTURAL_MARKERS = [
  "Odd-position row:",
  "Even-position row:",
  "Position 1:",
  "Row 1:",
] as const;

function stripBookkeepingPrefix(step: string): string {
  if (!/^First (?:write the correct series|check the shown groups):/i.test(step)) {
    return step;
  }
  const markerIndexes = STRUCTURAL_MARKERS
    .map((marker) => step.indexOf(marker))
    .filter((index) => index >= 0);
  if (markerIndexes.length === 0) return "";
  return step.slice(Math.min(...markerIndexes)).trim();
}

function structuralSteps(steps: readonly string[]): readonly string[] {
  return uniqueSteps(
    steps
      .filter((step) => !/^Now move one step backward/i.test(step))
      .map(stripBookkeepingPrefix),
  );
}

function answerIndexesFor(
  question: SerCp007EditorialQuestion,
): readonly number[] {
  const state = question.hiddenState;
  if (!state?.canonicalTerms) return [];
  if (state.answerIndexes && state.answerIndexes.length > 0) {
    return state.answerIndexes;
  }
  if (typeof state.answerIndex === "number") return [state.answerIndex];

  const answerParts = question.correctAnswer
    .split(/,|→/)
    .map((part) => part.trim())
    .filter(Boolean);
  const indexes: number[] = [];
  for (const part of answerParts) {
    const index = state.canonicalTerms.findIndex((term) => term === part);
    if (index >= 0 && !indexes.includes(index)) indexes.push(index);
  }
  return indexes;
}

function answerTermsFor(
  question: SerCp007EditorialQuestion,
): readonly string[] {
  const terms = question.hiddenState?.canonicalTerms;
  const indexes = answerIndexesFor(question);
  if (terms && indexes.length > 0) {
    return indexes.map((index) => terms[index]!).filter(Boolean);
  }
  if (
    question.taskKind === "FILL_GAPS" ||
    question.taskKind === "FILL_GAP_GROUPS"
  ) {
    return [];
  }
  const replacement = question.correctAnswer.split("→").at(-1)?.trim();
  return replacement ? [replacement] : [question.correctAnswer];
}

function decisiveStep(
  steps: readonly string[],
  answerTerms: readonly string[],
): string | undefined {
  return [...steps]
    .reverse()
    .find((step) => answerTerms.some((answer) => step.includes(answer)));
}

function derivedAnswerStepAt(
  question: SerCp007EditorialQuestion,
  answerIndex: number,
): string | undefined {
  const terms = question.hiddenState?.canonicalTerms;
  if (!terms || !terms[answerIndex]) return undefined;

  const answer = terms[answerIndex]!;
  if (answerIndex > 0) {
    const previous = terms[answerIndex - 1]!;
    const lengthNote =
      previous.length === answer.length
        ? ""
        : ` (${previous.length} → ${answer.length} letters)`;
    return `Answer step: ${previous} → ${answer}${lengthNote}.`;
  }
  if (terms.length > 1) {
    const next = terms[1]!;
    const lengthNote =
      answer.length === next.length
        ? ""
        : ` (${answer.length} → ${next.length} letters)`;
    return `Check from the required term: ${answer} → ${next}${lengthNote}.`;
  }
  return undefined;
}

function ensureAnswerApplications(
  question: SerCp007EditorialQuestion,
  selected: readonly string[],
): readonly string[] {
  const output = [...selected];
  const answerTerms = answerTermsFor(question);
  const answerIndexes = answerIndexesFor(question);

  answerTerms.forEach((answer, position) => {
    if (output.some((step) => step.includes(answer))) return;
    const answerIndex = answerIndexes[position];
    if (answerIndex === undefined) return;
    const derived = derivedAnswerStepAt(question, answerIndex);
    if (derived) output.push(derived);
  });

  return uniqueSteps(output);
}

function selectSteps(
  question: SerCp007EditorialQuestion,
  proofModel: SerCp007ProofModel,
): readonly string[] {
  const allSteps = uniqueSteps(question.explanation.steps);
  if (allSteps.length <= 3) {
    const selected = uniqueSteps(allSteps.map(stripBookkeepingPrefix));
    return proofModel === "CONTINUOUS_GAP_COMPLETION"
      ? selected
      : ensureAnswerApplications(question, selected);
  }

  const structural = structuralSteps(allSteps);
  const usable = structural.length > 0 ? structural : allSteps;
  const answerTerms = answerTermsFor(question);
  const decisive =
    decisiveStep(usable, answerTerms) ?? usable.at(-1)!;

  if (proofModel === "DIRECT_COLUMN_MOVEMENT") {
    const positionRows = usable.filter((step) => /^Position \d+:/i.test(step));
    if (positionRows.length > 0) return positionRows;
  }

  if (proofModel === "INTERLEAVED_ROWS") {
    const rows = usable.filter(
      (step) =>
        /(?:^|-)position row:/i.test(step) || /^Row \d+:/i.test(step),
    );
    if (rows.length > 0) return ensureAnswerApplications(question, rows);
  }

  if (proofModel === "CONTINUOUS_GAP_COMPLETION") {
    return uniqueSteps([...usable.slice(0, 2), decisive]);
  }

  if (question.taskKind === "PREVIOUS_TERM") {
    const backward = allSteps.find((step) => /move one step backward/i.test(step));
    return ensureAnswerApplications(
      question,
      uniqueSteps([...(backward ? [backward] : []), decisive]),
    );
  }

  return ensureAnswerApplications(
    question,
    uniqueSteps([usable[0]!, usable[1]!, decisive]),
  );
}

function tokens(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter(Boolean),
  );
}

function similarity(left: string, right: string): number {
  const leftTokens = tokens(left);
  const rightTokens = tokens(right);
  const union = new Set([...leftTokens, ...rightTokens]);
  if (union.size === 0) return 1;
  let intersection = 0;
  for (const token of leftTokens) if (rightTokens.has(token)) intersection += 1;
  return intersection / union.size;
}

function shouldRenderShortcut(
  question: SerCp007EditorialQuestion,
  proofModel: SerCp007ProofModel,
): boolean {
  const eligible =
    proofModel === "INTERLEAVED_ROWS" ||
    proofModel === "CONTINUOUS_GAP_COMPLETION" ||
    proofModel === "MARKER_OR_BOUNDARY_MOVEMENT" ||
    (proofModel === "DIRECT_COLUMN_MOVEMENT" &&
      /each letter position|top to bottom by position/i.test(
        question.explanation.rule,
      ));
  if (!eligible) return false;

  const shortcut = question.explanation.quickMethod.trim();
  if (shortcut.length === 0) return false;
  const shortcutWords = shortcut.split(/\s+/).length;
  const ruleWords = question.explanation.rule.split(/\s+/).length;
  return (
    shortcutWords <= 24 &&
    shortcutWords < ruleWords * 1.15 &&
    similarity(shortcut, question.explanation.rule) < 0.72
  );
}

function shouldRenderCheck(question: SerCp007EditorialQuestion): boolean {
  if (question.explanation.commonMistake.trim().length === 0) return false;
  return (
    question.taskKind === "WRONG_TERM" ||
    question.taskKind === "WRONG_AND_REPLACEMENT"
  );
}

function checkText(
  question: SerCp007EditorialQuestion,
  editorialTaskKind: SerCp007EditorialTaskKind,
): string {
  let text = question.explanation.commonMistake.trim();
  if (editorialTaskKind === "REPLACE_WRONG_TERM") {
    text = text
      .replace(/row containing the blank/gi, "row containing the incorrect term")
      .replace(/the blank/gi, "the incorrect position");
  }
  return text;
}

function workLabel(proofModel: SerCp007ProofModel): string {
  switch (proofModel) {
    case "DIRECT_COLUMN_MOVEMENT":
      return "Apply the letter movement";
    case "INTERLEAVED_ROWS":
      return "Separate the position rows";
    case "POSITION_TRANSFORMATION":
      return "Track the positions";
    case "LENGTH_OR_CONTENT_CHANGE":
      return "Follow what changes";
    case "CONTINUOUS_GAP_COMPLETION":
      return "Rebuild the repeating structure";
    case "MARKER_OR_BOUNDARY_MOVEMENT":
      return "Track the marker or boundary";
  }
}

export function buildAdaptiveSerCp007Review(
  question: SerCp007EditorialQuestion,
): SerCp007AdaptiveReview {
  const editorialTaskKind = editorialTaskKindFor(question.taskKind);
  const proofModel = proofModelFor(question.canonicalAuthorityId);
  const stem = adaptiveStem(question, editorialTaskKind);
  const workedSteps = selectSteps(question, proofModel);
  const renderedShortcut = shouldRenderShortcut(question, proofModel);
  const renderedCheck = shouldRenderCheck(question);

  const options = question.options.map(
    (option, index) =>
      `${index === question.correctIndex ? "✓" : " "} ${index + 1}. ${option}`,
  );

  const explanationLines = [
    "### Explanation",
    "",
    question.explanation.rule,
    "",
    `**${workLabel(proofModel)}:**`,
    ...workedSteps.map((step, index) => `${index + 1}. ${step}`),
    `${workedSteps.length + 1}. ${question.explanation.conclusion}`,
  ];

  if (renderedShortcut) {
    explanationLines.push("", `**Shortcut:** ${question.explanation.quickMethod}`);
  }
  if (renderedCheck) {
    explanationLines.push(
      "",
      `**Check:** ${checkText(question, editorialTaskKind)}`,
    );
  }

  const review = [
    stem,
    "",
    ...options,
    "",
    `**Answer:** ${question.correctIndex + 1}. ${question.correctAnswer}`,
    "",
    ...explanationLines,
  ].join("\n");

  return {
    editorialTaskKind,
    proofModel,
    stem,
    review,
    workedSteps,
    renderedShortcut,
    renderedCheck,
  };
}
