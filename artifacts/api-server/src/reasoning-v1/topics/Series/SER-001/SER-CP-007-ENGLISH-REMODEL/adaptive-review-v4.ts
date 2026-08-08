import {
  buildAdaptiveSerCp007Review,
  editorialTaskKindFor,
  proofModelFor,
  type SerCp007EditorialQuestion,
  type SerCp007EditorialTaskKind,
  type SerCp007ProofModel,
} from "./adaptive-review";
import {
  buildSerCp007DistractorCandidateV2,
  type SerCp007DistractorCandidateOptionV2,
} from "../SER-CP-007-DISTRACTOR-AUDIT/distractor-candidate-v2";
import {
  profileSerCp007Question,
  type SerCp007Difficulty,
  type SerCp007ReleaseTier,
} from "./exam-readiness-profile";

export interface SerCp007AdaptiveReviewV4 {
  readonly editorialTaskKind: SerCp007EditorialTaskKind;
  readonly proofModel: SerCp007ProofModel;
  readonly stem: string;
  readonly review: string;
  readonly workedSteps: readonly string[];
  readonly renderedShortcut: boolean;
  readonly renderedCheck: boolean;
  readonly options: readonly string[];
  readonly distractors: readonly SerCp007DistractorCandidateOptionV2[];
  readonly visibleCheckRole: SerCp007DistractorCandidateOptionV2["role"] | null;
  readonly difficulty: SerCp007Difficulty;
  readonly releaseTier: SerCp007ReleaseTier;
  readonly standardMockEligible: boolean;
  readonly stateFingerprint: string;
  readonly maximumTermLength: number;
  readonly visibleCharacterLoad: number;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function unique(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function answerIndexes(question: SerCp007EditorialQuestion): readonly number[] {
  const state = question.hiddenState;
  if (state?.answerIndexes?.length) return state.answerIndexes;
  if (typeof state?.answerIndex === "number") return [state.answerIndex];
  const terms = state?.canonicalTerms ?? [];
  const pieces = question.correctAnswer
    .split(/,|→/)
    .map((piece) => piece.trim())
    .filter(Boolean);
  return pieces
    .map((piece) => terms.indexOf(piece))
    .filter((index) => index >= 0);
}

function canonicalAnswerTerms(
  question: SerCp007EditorialQuestion,
): readonly string[] {
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const indexes = answerIndexes(question);
  if (terms.length > 0 && indexes.length > 0) {
    return indexes.map((index) => terms[index]!).filter(Boolean);
  }
  if (
    question.taskKind === "FILL_GAPS" ||
    question.taskKind === "FILL_GAP_GROUPS"
  ) {
    return [];
  }
  const pieces = question.correctAnswer
    .split(/,|→/)
    .map((piece) => piece.trim())
    .filter(Boolean);
  return question.correctAnswer.includes("→") ? pieces.slice(-1) : pieces;
}

function signedDelta(from: string, to: string): number {
  const left = ALPHABET.indexOf(from.toUpperCase());
  const right = ALPHABET.indexOf(to.toUpperCase());
  if (left < 0 || right < 0) return 0;
  let delta = right - left;
  if (delta > 13) delta -= 26;
  if (delta < -13) delta += 26;
  return delta;
}

function formatDelta(delta: number): string {
  if (delta === 0) return "0";
  return delta > 0 ? `+${delta}` : String(delta);
}

function ordinal(index: number): string {
  const number = index + 1;
  if (number % 10 === 1 && number % 100 !== 11) return `${number}st`;
  if (number % 10 === 2 && number % 100 !== 12) return `${number}nd`;
  if (number % 10 === 3 && number % 100 !== 13) return `${number}rd`;
  return `${number}th`;
}

function positionMovement(previous: string, current: string): string {
  if (previous.length !== current.length || current.length > 8) {
    return `${previous} → ${current}.`;
  }
  const movements = [...current].map((character, index) => {
    const before = previous[index]!;
    const delta = signedDelta(before, character);
    return `${before}→${character} (${formatDelta(delta)})`;
  });
  return `${previous} → ${current}: ${movements.join(", ")}.`;
}

function addedAround(previous: string, current: string): string | null {
  const index = current.indexOf(previous);
  if (index < 0) return null;
  const left = current.slice(0, index);
  const right = current.slice(index + previous.length);
  if (!left && !right) return null;
  if (left && right) return `${left} + ${previous} + ${right} = ${current}.`;
  if (right) return `${previous} + ${right} = ${current}.`;
  return `${left} + ${previous} = ${current}.`;
}

function removedFrom(previous: string, current: string): string | null {
  const index = previous.indexOf(current);
  if (index < 0) return null;
  const left = previous.slice(0, index);
  const right = previous.slice(index + current.length);
  if (left && right) {
    return `${previous} → ${current} after removing ${left} from the left and ${right} from the right.`;
  }
  if (left) return `${previous} → ${current} after removing ${left} from the beginning.`;
  if (right) return `${previous} → ${current} after removing ${right} from the end.`;
  return null;
}

function transitionLine(previous: string, current: string): string {
  if (previous.length === current.length) return positionMovement(previous, current);
  if (current.length > previous.length) {
    return addedAround(previous, current) ?? `${previous} grows to ${current}.`;
  }
  return removedFrom(previous, current) ?? `${previous} reduces to ${current}.`;
}

function progressiveRows(terms: readonly string[]): readonly string[] {
  if (terms.length < 3) return [];
  const width = terms[0]!.length;
  if (width === 0 || terms.some((term) => term.length !== width)) return [];
  const rows: string[] = [];
  for (let position = 0; position < width; position += 1) {
    const letters = terms.map((term) => term[position]!).join(", ");
    const deltas = terms
      .slice(1)
      .map((term, index) =>
        formatDelta(signedDelta(terms[index]![position]!, term[position]!)),
      )
      .join(", ");
    rows.push(
      `${ordinal(position)} letters: ${letters}; jumps: ${deltas}.`,
    );
  }
  return rows;
}

function skippedLetters(end: string, start: string): readonly string[] {
  const endIndex = ALPHABET.indexOf(end.toUpperCase());
  const startIndex = ALPHABET.indexOf(start.toUpperCase());
  if (endIndex < 0 || startIndex < 0) return [];
  const skipped: string[] = [];
  let index = (endIndex + 1) % 26;
  while (index !== startIndex && skipped.length < 25) {
    skipped.push(ALPHABET[index]!);
    index = (index + 1) % 26;
  }
  return skipped;
}

function consecutiveBlockSteps(
  question: SerCp007EditorialQuestion,
  terms: readonly string[],
  indexes: readonly number[],
): readonly string[] {
  if (terms.length === 0) return [];
  const steps: string[] = [
    `Lengths: ${terms.map((term) => term.length).join(", ")}.`,
    `Starting letters: ${terms.map((term) => term[0] ?? "").join(", ")}.`,
  ];
  for (const index of indexes) {
    const answer = terms[index];
    if (!answer) continue;
    if (index > 0) {
      const previous = terms[index - 1]!;
      const skipped = skippedLetters(previous.at(-1)!, answer[0]!);
      const skipText = skipped.length > 0 ? skipped.join(" and ") : "no letters";
      steps.push(
        `${previous} ends at ${previous.at(-1)}; ${skipText} ${skipped.length === 1 ? "is" : "are"} skipped, so the next group starts at ${answer[0]} and has ${answer.length} letters: ${answer}.`,
      );
    } else if (terms[1]) {
      const next = terms[1]!;
      const skipped = skippedLetters(answer.at(-1)!, next[0]!);
      const skipText = skipped.length > 0 ? skipped.join(" and ") : "no letters";
      steps.push(
        `${answer} ends at ${answer.at(-1)}; ${skipText} ${skipped.length === 1 ? "is" : "are"} skipped before ${next}, proving the required previous group is ${answer}.`,
      );
    }
  }
  return unique(steps);
}

function exactTargetTransitions(
  question: SerCp007EditorialQuestion,
  terms: readonly string[],
  indexes: readonly number[],
): readonly string[] {
  const steps: string[] = [];
  for (const index of indexes) {
    const answer = terms[index];
    if (!answer) continue;
    if (index > 0) steps.push(transitionLine(terms[index - 1]!, answer));
    if (index + 1 < terms.length) steps.push(transitionLine(answer, terms[index + 1]!));
  }
  return unique(steps);
}

function targetSteps(
  question: SerCp007EditorialQuestion,
  proofModel: SerCp007ProofModel,
  baseSteps: readonly string[],
): readonly string[] {
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const indexes = answerIndexes(question);
  const answers = canonicalAnswerTerms(question);

  if (
    question.canonicalAuthorityId === "COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT" &&
    terms.length > 0
  ) {
    return unique([
      ...progressiveRows(terms),
      ...indexes.map(
        (index) =>
          `The required ${ordinal(index)} group is ${terms[index]}.`,
      ),
    ]);
  }

  if (
    (question.canonicalAuthorityId === "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER" ||
      question.canonicalAuthorityId === "GROWING_CONSECUTIVE_CLUSTER") &&
    terms.length > 0
  ) {
    return consecutiveBlockSteps(question, terms, indexes);
  }

  if (terms.length > 0 && indexes.length > 0) {
    const exact = exactTargetTransitions(question, terms, indexes);
    if (proofModel === "INTERLEAVED_ROWS") {
      const rows = baseSteps.filter((step) =>
        /(?:position row|^Row \d+:)/i.test(step),
      );
      return unique([...rows, ...exact]);
    }
    if (proofModel === "CONTINUOUS_GAP_COMPLETION") {
      return unique([...baseSteps.slice(0, 2), ...exact]);
    }
    return exact.length > 0 ? exact : baseSteps;
  }

  const decisive = baseSteps.filter((step) =>
    answers.some((answer) => step.includes(answer)),
  );
  return unique(decisive.length > 0 ? decisive : baseSteps.slice(0, 3));
}

function polishedStem(
  stem: string,
  taskKind: SerCp007EditorialTaskKind,
): string {
  const [, ...body] = stem.split("\n");
  if (taskKind === "PREVIOUS_TERM") {
    return [
      "Which letter group should come immediately before the first given term?",
      ...body,
    ].join("\n");
  }
  if (taskKind === "WRONG_AND_REPLACEMENT") {
    return [
      "Identify the incorrect group and select its correct replacement.",
      ...body,
    ].join("\n");
  }
  return stem.replace(
    "Which wrong group → correct group pair fixes the series?",
    "Identify the incorrect group and select its correct replacement.",
  );
}

function workLabel(
  question: SerCp007EditorialQuestion,
  proofModel: SerCp007ProofModel,
): string {
  if (question.canonicalAuthorityId === "COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT") {
    return "Compare the changing jumps";
  }
  if (
    question.canonicalAuthorityId === "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER" ||
    question.canonicalAuthorityId === "GROWING_CONSECUTIVE_CLUSTER"
  ) {
    return "Check both length and starting letter";
  }
  if (question.taskKind === "PREVIOUS_TERM") {
    return "Verify the term immediately before the series";
  }
  switch (proofModel) {
    case "DIRECT_COLUMN_MOVEMENT":
      return "Apply the movement at the required position";
    case "INTERLEAVED_ROWS":
      return "Continue the row containing the required position";
    case "POSITION_TRANSFORMATION":
      return "Apply the position rule at the blank";
    case "LENGTH_OR_CONTENT_CHANGE":
      return "Construct the required group";
    case "CONTINUOUS_GAP_COMPLETION":
      return "Rebuild the repeating sequence at the gaps";
    case "MARKER_OR_BOUNDARY_MOVEMENT":
      return "Move the marker or boundary at the required step";
  }
}

function usefulShortcut(base: ReturnType<typeof buildAdaptiveSerCp007Review>): boolean {
  if (!base.renderedShortcut) return false;
  const shortcut = base.review.match(/^\*\*Shortcut:\*\* (.+)$/m)?.[1]?.trim();
  if (!shortcut) return false;
  return shortcut.split(/\s+/).length <= 24;
}

export function buildAdaptiveSerCp007ReviewV4(
  question: SerCp007EditorialQuestion,
): SerCp007AdaptiveReviewV4 {
  const editorialTaskKind = editorialTaskKindFor(question.taskKind);
  const proofModel = proofModelFor(question.canonicalAuthorityId);
  const distractorCandidate = buildSerCp007DistractorCandidateV2(question);
  const questionWithOptions: SerCp007EditorialQuestion = {
    ...question,
    options: distractorCandidate.options,
  };
  const base = buildAdaptiveSerCp007Review(questionWithOptions);
  const stem = polishedStem(base.stem, editorialTaskKind);
  const workedSteps = targetSteps(question, proofModel, base.workedSteps);
  const profile = profileSerCp007Question(question);
  const options = distractorCandidate.options.map(
    (value, index) =>
      `${index === question.correctIndex ? "✓" : " "} ${index + 1}. ${value}`,
  );

  const explanationLines = [
    "### Explanation",
    "",
    question.explanation.rule,
    "",
    `**${workLabel(question, proofModel)}:**`,
    ...workedSteps.map((step, index) => `${index + 1}. ${step}`),
    `${workedSteps.length + 1}. ${question.explanation.conclusion}`,
  ];

  const renderedShortcut = usefulShortcut(base);
  if (renderedShortcut) {
    const shortcut = base.review.match(/^\*\*Shortcut:\*\* (.+)$/m)?.[1]?.trim();
    if (shortcut) explanationLines.push("", `**Shortcut:** ${shortcut}`);
  }

  const renderedCheck =
    question.taskKind === "WRONG_TERM" ||
    question.taskKind === "WRONG_AND_REPLACEMENT";
  const visibleCheck = renderedCheck ? distractorCandidate.distractors[0]! : null;
  if (visibleCheck) {
    const optionIndex = distractorCandidate.options.indexOf(visibleCheck.value);
    explanationLines.push(
      "",
      `**Check:** Option ${optionIndex + 1} (${visibleCheck.value}) is tempting because ${visibleCheck.learnerCheck}.`,
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
    options: distractorCandidate.options,
    distractors: distractorCandidate.distractors,
    visibleCheckRole: visibleCheck?.role ?? null,
    difficulty: profile.difficulty,
    releaseTier: profile.releaseTier,
    standardMockEligible: profile.standardMockEligible,
    stateFingerprint: profile.stateFingerprint,
    maximumTermLength: profile.maximumTermLength,
    visibleCharacterLoad: profile.visibleCharacterLoad,
  };
}
