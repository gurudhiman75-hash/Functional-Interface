import {
  generateRnkCp005Question,
  solveRnkCp005SharedPassage,
  type RnkCp005ContextFamily,
  type RnkCp005Direction,
  type RnkCp005Option,
  type RnkCp005Question,
  type RnkCp005Query,
  type RnkCp005SharedPassage,
  type RnkCp005AuthorityId,
} from "./cp005-foundation";

export const RNK_CP005_EXAM_LANGUAGE_VERSION = "RNK_CP005_EXAM_LANGUAGE_V1" as const;

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

function polishedInstruction(passage: RnkCp005SharedPassage): string {
  const context = passage.contextFamily;
  if (passage.presentationMode === "RANK_TABLE") {
    switch (context) {
      case "ROW": return "The table gives each person's position from the left. Use the same table for all linked questions.";
      case "QUEUE": return "The table gives each candidate's position from the front of the queue. Use the same table for all linked questions.";
      case "MERIT_LIST": return "The table gives each candidate's rank from the top of the merit list. Use the same table for all linked questions.";
      case "RACE_FINISH": return "The table gives each participant's finishing position. Use the same table for all linked questions.";
      case "INTERVIEW_SHORTLIST": return "The table gives each applicant's rank from the top of the shortlist. Use the same table for all linked questions.";
      case "PERFORMANCE_ORDER": return "The table gives each employee's rank from the top of the performance list. Use the same table for all linked questions.";
    }
  }
  if (passage.presentationMode === "ORDER_LEDGER") {
    return `The ledger lists everyone from ${directionDescription(context)}. Use the same order for all linked questions.`;
  }
  switch (context) {
    case "ROW": return "The statements compare positions in the row. Reconstruct the complete left-to-right order and use it for all linked questions.";
    case "QUEUE": return "The statements show who is ahead of whom in the queue. Reconstruct the complete front-to-back order and use it for all linked questions.";
    case "MERIT_LIST": return "The statements compare merit ranks. Reconstruct the complete order from highest rank to lowest rank and use it for all linked questions.";
    case "RACE_FINISH": return "The statements show who finished before whom. Reconstruct the complete finishing order and use it for all linked questions.";
    case "INTERVIEW_SHORTLIST": return "The statements compare shortlist ranks. Reconstruct the complete order from highest rank to lowest rank and use it for all linked questions.";
    case "PERFORMANCE_ORDER": return "The statements compare employee performance ranks. Reconstruct the complete order from highest performer to lowest performer and use it for all linked questions.";
  }
}

function polishPassage(passage: RnkCp005SharedPassage): RnkCp005SharedPassage {
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

function entityAtPositionQuestion(context: RnkCp005ContextFamily, direction: RnkCp005Direction, rank: number): string {
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

function rankOfEntityQuestion(context: RnkCp005ContextFamily, direction: RnkCp005Direction, target: string): string {
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

function immediateNeighbourQuestion(context: RnkCp005ContextFamily, direction: "BEFORE" | "AFTER", target: string): string {
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

function polishedOptions(question: RnkCp005Question): readonly RnkCp005Option[] {
  if (question.answerSemantic !== "RELATION") return question.options;
  return question.options.map((option) => ({
    ...option,
    label: relationLabel(option.answerKey, question.sharedPassage.contextFamily),
  }));
}

function querySpecificStep(question: RnkCp005Question, answer: string): string {
  const query = question.query;
  switch (query.kind) {
    case "ENDPOINT_ENTITY": return `The requested endpoint is occupied by ${answer}.`;
    case "ENTITY_AT_POSITION": return `Counting ${query.rank} places from the requested direction reaches ${answer}.`;
    case "RANK_OF_ENTITY": return `${query.target} occupies rank ${answer} from the requested direction.`;
    case "PAIR_RELATION": return `${answer}, because that matches their positions in the common order.`;
    case "RANK_GAP": return `The two positions differ by ${answer} rank places.`;
    case "IMMEDIATE_NEIGHBOUR": return `${answer} is directly next to ${query.target} in the requested direction.`;
    case "COMPLETE_ORDER": return `Reading the common line in the requested direction gives ${answer}.`;
    case "TRUE_STATEMENT": return `Checking all four statements against the common line leaves only ${answer}.`;
  }
}

export function generateRnkCp005ExamReadyQuestion(
  authorityId: RnkCp005AuthorityId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp005Question {
  const raw = generateRnkCp005Question(authorityId, seed, correctIndexOverride);
  const sharedPassage = polishPassage(raw.sharedPassage);
  const options = polishedOptions({ ...raw, sharedPassage });
  const answer = raw.answerSemantic === "RELATION"
    ? relationLabel(raw.answerKey, sharedPassage.contextFamily)
    : raw.answer;
  const order = solveRnkCp005SharedPassage(sharedPassage).join(" → ");
  const visibleExplanation = {
    mentalPicture: `Treat the shared information as one reusable rank line arranged from ${directionDescription(sharedPassage.contextFamily)}.`,
    keyRule: "Reconstruct the common order once, keep the requested direction fixed, and answer every linked question from that same line.",
    stepByStepSolution: [
      `Read the ${sharedPassage.presentationMode === "COMPARISON_CLUES" ? "comparisons" : "displayed positions"} and place all names on one line.`,
      `The common order from ${directionDescription(sharedPassage.contextFamily)} is: ${order}.`,
      querySpecificStep({ ...raw, sharedPassage }, answer),
      `Therefore, the required answer is ${answer}.`,
    ],
    examSpeedShortcut: "Build the common order only once on rough paper. For every linked question, reuse that line and change only the direction or requested position.",
    optionAnalysis: options.map(
      (option, index) => `Option ${String.fromCharCode(65 + index)} (${option.label}): ${option.explanation}.`,
    ),
    conclusion: `Therefore, the correct answer is ${answer}.`,
  } as const;

  return {
    ...raw,
    sharedPassage,
    stem: `Study the shared information titled “${sharedPassage.title}”. ${questionText(raw.query, sharedPassage.contextFamily)}`,
    answer,
    options,
    visibleExplanation,
    mathematicalFingerprint: `${raw.mathematicalFingerprint}:${RNK_CP005_EXAM_LANGUAGE_VERSION}`,
  };
}
