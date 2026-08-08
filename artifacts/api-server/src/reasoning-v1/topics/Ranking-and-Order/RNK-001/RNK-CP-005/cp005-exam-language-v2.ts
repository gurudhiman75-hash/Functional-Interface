import {
  type RnkCp005AuthorityId,
  type RnkCp005ContextFamily,
  type RnkCp005Direction,
  type RnkCp005Option,
  type RnkCp005Query,
} from "./cp005-foundation";
import {
  generateRnkCp005ReasoningQuestion,
  rnkCp005ReasoningClueText,
  solveRnkCp005ReasoningPassage,
  type RnkCp005ReasoningQuestion,
  type RnkCp005ReasoningSharedPassage,
} from "./cp005-reasoning-remodel-v2";

export const RNK_CP005_EXAM_LANGUAGE_VERSION = "RNK_CP005_EXAM_LANGUAGE_V2" as const;

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function directionDescription(context: RnkCp005ContextFamily): string {
  switch (context) {
    case "ROW": return "left to right";
    case "QUEUE": return "front to back";
    case "MERIT_LIST": return "highest rank to lowest rank";
    case "RACE_FINISH": return "first finisher to last finisher";
    case "INTERVIEW_SHORTLIST": return "highest rank to lowest rank";
    case "PERFORMANCE_ORDER": return "highest performer to lowest performer";
  }
}

function polishedTitle(context: RnkCp005ContextFamily): string {
  switch (context) {
    case "ROW": return "People standing in a row";
    case "QUEUE": return "Candidates waiting in a queue";
    case "MERIT_LIST": return "Candidates in a merit list";
    case "RACE_FINISH": return "Race finishing order";
    case "INTERVIEW_SHORTLIST": return "Applicants in an interview shortlist";
    case "PERFORMANCE_ORDER": return "Employees ranked by performance";
  }
}

function polishedInstruction(passage: RnkCp005ReasoningSharedPassage): string {
  if (passage.evidenceMode === "PARTIAL_RANK_TABLE") {
    return "The table gives only a partial rank anchor. Combine it with all the accompanying clues to reconstruct the complete order before answering the linked questions.";
  }
  if (passage.evidenceMode === "MIXED_CLUE_LEDGER") {
    return "The clues are deliberately listed in a mixed order. Link the fixed rank, immediate relation and rank-gap information to obtain one complete order.";
  }
  return "The statements do not display the final order. Arrange all names by combining the comparison, immediate-position and rank-gap clues, then answer the linked questions.";
}

function polishPassage(
  passage: RnkCp005ReasoningSharedPassage,
): RnkCp005ReasoningSharedPassage {
  return {
    ...passage,
    title: polishedTitle(passage.contextFamily),
    instruction: polishedInstruction(passage),
  };
}

function relationLabel(key: string, context: RnkCp005ContextFamily): string {
  const [earlier, later] = key.split(">");
  switch (context) {
    case "ROW": return `${earlier} is to the left of ${later}`;
    case "QUEUE": return `${earlier} is ahead of ${later} in the queue`;
    case "RACE_FINISH": return `${earlier} finished before ${later}`;
    case "MERIT_LIST":
    case "INTERVIEW_SHORTLIST":
    case "PERFORMANCE_ORDER":
      return `${earlier} is ranked above ${later}`;
  }
}

function samePositionLabel(
  context: RnkCp005ContextFamily,
  first: string,
  second: string,
): string {
  switch (context) {
    case "ROW": return `${first} and ${second} are standing at the same position`;
    case "QUEUE": return `${first} and ${second} occupy the same place in the queue`;
    case "RACE_FINISH": return `${first} and ${second} finished at the same position`;
    case "MERIT_LIST":
    case "INTERVIEW_SHORTLIST":
    case "PERFORMANCE_ORDER":
      return `${first} and ${second} have the same rank`;
  }
}

function endpointQuestion(context: RnkCp005ContextFamily, direction: RnkCp005Direction): string {
  const start = direction === "START";
  switch (context) {
    case "ROW": return `Who is standing at the extreme ${start ? "left" : "right"}?`;
    case "QUEUE": return `Who is at the ${start ? "front" : "back"} of the queue?`;
    case "MERIT_LIST": return `Who is ranked ${start ? "first" : "last"} in the merit list?`;
    case "RACE_FINISH": return `Who finished ${start ? "first" : "last"}?`;
    case "INTERVIEW_SHORTLIST": return `Who is ranked ${start ? "first" : "last"} in the shortlist?`;
    case "PERFORMANCE_ORDER": return `Who is ranked ${start ? "highest" : "lowest"}?`;
  }
}

function entityAtPositionQuestion(
  context: RnkCp005ContextFamily,
  direction: RnkCp005Direction,
  rank: number,
): string {
  const position = ordinal(rank);
  switch (context) {
    case "ROW": return `Who is ${position} from the ${direction === "START" ? "left" : "right"}?`;
    case "QUEUE": return `Who is ${position} from the ${direction === "START" ? "front" : "back"} of the queue?`;
    case "MERIT_LIST":
    case "INTERVIEW_SHORTLIST":
    case "PERFORMANCE_ORDER":
      return `Who is ranked ${position} from the ${direction === "START" ? "top" : "bottom"}?`;
    case "RACE_FINISH":
      return direction === "START"
        ? `Who finished in ${position} place?`
        : `Who is ${position} when counted from the last finisher?`;
  }
}

function rankOfEntityQuestion(
  context: RnkCp005ContextFamily,
  direction: RnkCp005Direction,
  target: string,
): string {
  switch (context) {
    case "ROW": return `What is ${target}'s position from the ${direction === "START" ? "left" : "right"}?`;
    case "QUEUE": return `What is ${target}'s position from the ${direction === "START" ? "front" : "back"} of the queue?`;
    case "MERIT_LIST":
    case "INTERVIEW_SHORTLIST":
    case "PERFORMANCE_ORDER":
      return `What is ${target}'s rank from the ${direction === "START" ? "top" : "bottom"}?`;
    case "RACE_FINISH":
      return direction === "START"
        ? `At what position did ${target} finish?`
        : `What is ${target}'s position when counted from the last finisher?`;
  }
}

function immediateNeighbourQuestion(
  context: RnkCp005ContextFamily,
  direction: "BEFORE" | "AFTER",
  target: string,
): string {
  const before = direction === "BEFORE";
  switch (context) {
    case "ROW": return `Who is immediately to the ${before ? "left" : "right"} of ${target}?`;
    case "QUEUE": return `Who is immediately ${before ? "ahead of" : "behind"} ${target} in the queue?`;
    case "MERIT_LIST":
    case "INTERVIEW_SHORTLIST":
    case "PERFORMANCE_ORDER":
      return `Who is ranked immediately ${before ? "above" : "below"} ${target}?`;
    case "RACE_FINISH": return `Who finished immediately ${before ? "before" : "after"} ${target}?`;
  }
}

function completeOrderQuestion(context: RnkCp005ContextFamily, direction: RnkCp005Direction): string {
  const start = direction === "START";
  switch (context) {
    case "ROW": return `Which option gives the complete order from ${start ? "left to right" : "right to left"}?`;
    case "QUEUE": return `Which option gives the complete order from ${start ? "front to back" : "back to front"}?`;
    case "MERIT_LIST":
    case "INTERVIEW_SHORTLIST":
      return `Which option gives the complete order from ${start ? "highest rank to lowest rank" : "lowest rank to highest rank"}?`;
    case "RACE_FINISH": return `Which option gives the complete order from ${start ? "first finisher to last finisher" : "last finisher to first finisher"}?`;
    case "PERFORMANCE_ORDER": return `Which option gives the complete order from ${start ? "highest performer to lowest performer" : "lowest performer to highest performer"}?`;
  }
}

function questionText(query: RnkCp005Query, context: RnkCp005ContextFamily): string {
  switch (query.kind) {
    case "ENDPOINT_ENTITY": return endpointQuestion(context, query.direction);
    case "ENTITY_AT_POSITION": return entityAtPositionQuestion(context, query.direction, query.rank);
    case "RANK_OF_ENTITY": return rankOfEntityQuestion(context, query.direction, query.target);
    case "PAIR_RELATION": return `Which statement correctly compares ${query.first} and ${query.second}?`;
    case "RANK_GAP": return `What is the difference between the ranks of ${query.first} and ${query.second}?`;
    case "IMMEDIATE_NEIGHBOUR": return immediateNeighbourQuestion(context, query.direction, query.target);
    case "COMPLETE_ORDER": return completeOrderQuestion(context, query.direction);
    case "TRUE_STATEMENT": return "Which of the following statements is definitely correct according to the shared information?";
  }
}

function placeCorrectOption(
  correct: RnkCp005Option,
  distractors: readonly RnkCp005Option[],
  correctIndex: number,
): readonly RnkCp005Option[] {
  const output: RnkCp005Option[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      output.push(correct);
    } else {
      output.push(distractors[distractorIndex]);
      distractorIndex += 1;
    }
  }
  return output;
}

function pairRelationOptions(question: RnkCp005ReasoningQuestion): readonly RnkCp005Option[] {
  if (question.query.kind !== "PAIR_RELATION") return question.options;
  const { first, second } = question.query;
  const [earlier, later] = question.answerKey.split(">");
  const correct: RnkCp005Option = {
    answerKey: question.answerKey,
    label: relationLabel(question.answerKey, question.sharedPassage.contextFamily),
    misconceptionId: "CORRECT_PAIR_RELATION",
    explanation: "This direction agrees with the two names' positions in the uniquely reconstructed order",
  };
  const distractors: readonly RnkCp005Option[] = [
    {
      answerKey: `${later}>${earlier}`,
      label: relationLabel(`${later}>${earlier}`, question.sharedPassage.contextFamily),
      misconceptionId: "REVERSED_PAIR_RELATION",
      explanation: "This reverses the relative order of the same two named people",
    },
    {
      answerKey: `SAME_POSITION:${first}:${second}`,
      label: samePositionLabel(question.sharedPassage.contextFamily, first, second),
      misconceptionId: "SAME_POSITION_PAIR",
      explanation: "The shared ranking assigns every person a different position, so the two cannot occupy one place",
    },
    {
      answerKey: `UNDETERMINED:${first}:${second}`,
      label: `The relative order of ${first} and ${second} cannot be determined`,
      misconceptionId: "PAIR_RELATION_UNDETERMINED",
      explanation: "The complete order is uniquely reconstructable, so their relative order is determined",
    },
  ];
  return placeCorrectOption(correct, distractors, question.correctIndex);
}

function immediateNeighbourOptions(question: RnkCp005ReasoningQuestion): readonly RnkCp005Option[] {
  if (question.query.kind !== "IMMEDIATE_NEIGHBOUR") return question.options;
  const solved = solveRnkCp005ReasoningPassage(question.sharedPassage);
  const order = solved.order;
  const targetIndex = order.indexOf(question.query.target);
  const answerIndex = order.indexOf(question.answerKey);
  if (targetIndex < 0 || answerIndex < 0) throw new Error("Immediate-neighbour option target missing from order");

  const oppositeIndex = question.query.direction === "BEFORE" ? targetIndex + 1 : targetIndex - 1;
  const twoAwayIndex = question.query.direction === "BEFORE" ? targetIndex - 2 : targetIndex + 2;
  const preferred = [order[oppositeIndex], order[twoAwayIndex], order[0], order[order.length - 1]];
  const distractorNames = [...new Set([
    ...preferred,
    ...order,
  ].filter((name): name is string => Boolean(name) && name !== question.query.target && name !== question.answerKey))].slice(0, 3);
  if (distractorNames.length !== 3) throw new Error("Unable to build three immediate-neighbour distractors");

  const correct: RnkCp005Option = {
    answerKey: question.answerKey,
    label: question.answerKey,
    misconceptionId: "CORRECT_IMMEDIATE_NEIGHBOUR",
    explanation: "This person is directly next to the target on the requested side",
  };
  const distractors = distractorNames.map((name) => {
    const position = order.indexOf(name);
    const distance = Math.abs(position - targetIndex);
    const misconceptionId = position === oppositeIndex
      ? "OPPOSITE_SIDE_NEIGHBOUR"
      : distance === 2
        ? "TWO_PLACES_AWAY"
        : "OTHER_VALID_ENTITY";
    const explanation = position === oppositeIndex
      ? "This person is immediately next to the target, but on the opposite side"
      : distance === 2
        ? "This person is two positions away rather than immediately adjacent"
        : "This person occupies another valid position but is not the requested immediate neighbour";
    return {
      answerKey: name,
      label: name,
      misconceptionId,
      explanation,
    } satisfies RnkCp005Option;
  });
  return placeCorrectOption(correct, distractors, question.correctIndex);
}

function polishedOptions(question: RnkCp005ReasoningQuestion): readonly RnkCp005Option[] {
  if (question.query.kind === "PAIR_RELATION") return pairRelationOptions(question);
  if (question.query.kind === "IMMEDIATE_NEIGHBOUR") return immediateNeighbourOptions(question);
  if (question.answerSemantic !== "RELATION") return question.options;
  return question.options.map((option) => ({
    ...option,
    label: relationLabel(option.answerKey, question.sharedPassage.contextFamily),
  }));
}

function querySpecificStep(question: RnkCp005ReasoningQuestion, answer: string): string {
  const query = question.query;
  switch (query.kind) {
    case "ENDPOINT_ENTITY": return `The requested endpoint is occupied by ${answer}.`;
    case "ENTITY_AT_POSITION": return `Counting ${query.rank} places from the requested direction reaches ${answer}.`;
    case "RANK_OF_ENTITY": return `${query.target} occupies rank ${answer} from the requested direction.`;
    case "PAIR_RELATION": return `${answer}, because that statement agrees with the reconstructed order.`;
    case "RANK_GAP": return `The two positions differ by ${answer} rank places.`;
    case "IMMEDIATE_NEIGHBOUR": return `${answer} is directly next to ${query.target} in the requested direction.`;
    case "COMPLETE_ORDER": return `Reading the reconstructed line in the requested direction gives ${answer}.`;
    case "TRUE_STATEMENT": return `Checking all four statements against the reconstructed line leaves only ${answer}.`;
  }
}

export function generateRnkCp005ExamReadyQuestion(
  authorityId: RnkCp005AuthorityId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp005ReasoningQuestion {
  const raw = generateRnkCp005ReasoningQuestion(authorityId, seed, correctIndexOverride);
  const sharedPassage = polishPassage(raw.sharedPassage);
  const question = { ...raw, sharedPassage };
  const options = polishedOptions(question);
  const answer = raw.answerSemantic === "RELATION"
    ? relationLabel(raw.answerKey, sharedPassage.contextFamily)
    : raw.answer;
  const solved = solveRnkCp005ReasoningPassage(sharedPassage);
  if (solved.solutionCount !== 1) throw new Error(`${authorityId}:${seed}: visible clues are not unique`);
  const order = solved.order.join(" → ");
  const clueKinds = [...new Set(sharedPassage.reasoningClues.map((clue) => clue.kind))]
    .map((kind) => kind.replaceAll("_", " ").toLowerCase())
    .join(", ");
  const sampleClue = rnkCp005ReasoningClueText(
    sharedPassage.reasoningClues[0],
    sharedPassage.contextFamily,
  );
  const visibleExplanation = {
    mentalPicture: `The displayed clues are evidence, not the final ranking. Build one reusable line arranged from ${directionDescription(sharedPassage.contextFamily)}.`,
    keyRule: "Use fixed ranks as anchors, join immediate relations first, then place the remaining comparisons and verify every rank-gap clue.",
    stepByStepSolution: [
      `Identify the clue types (${clueKinds}). For example: ${sampleClue}`,
      `Join the immediate relations and place any fixed-rank anchor; then fit the remaining comparisons and gap clues around them.`,
      `The only order satisfying every clue from ${directionDescription(sharedPassage.contextFamily)} is: ${order}.`,
      `${querySpecificStep(question, answer)} Therefore, the required answer is ${answer}.`,
    ],
    examSpeedShortcut: "Make the common order once. Start with immediate pairs, write the fixed-rank anchor, attach the remaining names, and use the same line for all linked questions.",
    optionAnalysis: options.map(
      (option, index) => `Option ${String.fromCharCode(65 + index)} (${option.label}): ${option.explanation}.`,
    ),
    conclusion: `Therefore, the correct answer is ${answer}.`,
  } as const;

  return {
    ...question,
    stem: `Study the shared information titled “${sharedPassage.title}”. Reconstruct the complete order from the clues, then answer: ${questionText(raw.query, sharedPassage.contextFamily)}`,
    answer,
    options,
    visibleExplanation,
    mathematicalFingerprint: `${raw.mathematicalFingerprint}:${RNK_CP005_EXAM_LANGUAGE_VERSION}`,
  };
}