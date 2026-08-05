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
}

export interface SerCp007AdaptiveReview {
  readonly editorialTaskKind: SerCp007EditorialTaskKind;
  readonly proofModel: SerCp007ProofModel;
  readonly stem: string;
  readonly review: string;
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

function selectSteps(
  question: SerCp007EditorialQuestion,
  proofModel: SerCp007ProofModel,
): readonly string[] {
  const steps = uniqueSteps(question.explanation.steps);
  if (steps.length <= 3) return steps;

  if (proofModel === "INTERLEAVED_ROWS") return steps.slice(0, 4);
  if (proofModel === "CONTINUOUS_GAP_COMPLETION") return steps.slice(0, 3);

  if (
    question.taskKind === "WRONG_TERM" ||
    question.taskKind === "PREVIOUS_TERM"
  ) {
    return steps.slice(0, 3);
  }

  const selected = [steps[0]!, steps[1]!, steps.at(-1)!];
  return uniqueSteps(selected);
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

function shouldRenderShortcut(question: SerCp007EditorialQuestion): boolean {
  const shortcut = question.explanation.quickMethod.trim();
  if (shortcut.length === 0) return false;
  const shortcutWords = shortcut.split(/\s+/).length;
  const ruleWords = question.explanation.rule.split(/\s+/).length;
  return shortcutWords <= 24 && shortcutWords < ruleWords * 1.15 &&
    similarity(shortcut, question.explanation.rule) < 0.72;
}

function shouldRenderCheck(
  question: SerCp007EditorialQuestion,
  proofModel: SerCp007ProofModel,
): boolean {
  if (question.explanation.commonMistake.trim().length === 0) return false;
  if (question.taskKind === "WRONG_TERM") return true;
  return proofModel !== "DIRECT_COLUMN_MOVEMENT";
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
  const selectedSteps = selectSteps(question, proofModel);
  const renderedShortcut = shouldRenderShortcut(question);
  const renderedCheck = shouldRenderCheck(question, proofModel);

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
    ...selectedSteps.map((step, index) => `${index + 1}. ${step}`),
    `${selectedSteps.length + 1}. ${question.explanation.conclusion}`,
  ];

  if (renderedShortcut) {
    explanationLines.push("", `**Shortcut:** ${question.explanation.quickMethod}`);
  }
  if (renderedCheck) {
    explanationLines.push("", `**Check:** ${question.explanation.commonMistake}`);
  }

  const review = [
    `## ${question.temporaryTemplateId} · seed ${question.seed}`,
    `*Editorial task: ${editorialTaskKind} · proof model: ${proofModel}*`,
    "",
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
    renderedShortcut,
    renderedCheck,
  };
}
