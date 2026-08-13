import {
  buildRnkCp006EqualityEditorialV2Release,
  type RnkCp006EditorialReleaseQuestion,
} from "./cp006-equality-ranking-editorial-v2-release";
import type { RnkCp006EditorialContext } from "./cp006-equality-ranking-editorial-v2";

export const RNK_CP006_EQUALITY_EDITORIAL_V3_RELEASE_VERSION =
  "RNK_CP006_EQUALITY_EDITORIAL_V3_RELEASE" as const;

export type RnkCp006EditorialV3Question = Omit<
  RnkCp006EditorialReleaseQuestion,
  "editorialVersion" | "stem" | "options" | "answer" | "explanation" | "mathematicalFingerprint"
> & {
  readonly editorialVersion: typeof RNK_CP006_EQUALITY_EDITORIAL_V3_RELEASE_VERSION;
  readonly stem: string;
  readonly options: readonly string[];
  readonly answer: string;
  readonly explanation: readonly string[];
  readonly mathematicalFingerprint: string;
};

type PairOutcome = "FIRST_HIGHER" | "SECOND_HIGHER" | "EQUAL" | "UNKNOWN";

function orderLabel(groups: readonly (readonly string[])[]): string {
  return groups.map((group) => group.join(" = ")).join(" > ");
}

function pairStem(context: RnkCp006EditorialContext, first: string, second: string): string {
  switch (context) {
    case "HEIGHT":
      return `What can be concluded about the heights of ${first} and ${second}?`;
    case "SCORES":
      return `What can be concluded about the scores of ${first} and ${second}?`;
    case "SPEED":
      return `What can be concluded about the speeds of ${first} and ${second}?`;
    case "SENIORITY":
      return `What can be concluded about the seniority of ${first} and ${second}?`;
    case "PERFORMANCE":
      return `What can be concluded about the performance positions of ${first} and ${second}?`;
  }
}

function pairLabel(
  context: RnkCp006EditorialContext,
  first: string,
  second: string,
  outcome: PairOutcome,
): string {
  switch (context) {
    case "HEIGHT":
      if (outcome === "FIRST_HIGHER") return `${first} is taller than ${second}`;
      if (outcome === "SECOND_HIGHER") return `${second} is taller than ${first}`;
      if (outcome === "EQUAL") return `${first} and ${second} are equally tall`;
      return `Their relative heights cannot be determined`;
    case "SCORES":
      if (outcome === "FIRST_HIGHER") return `${first} scored more marks than ${second}`;
      if (outcome === "SECOND_HIGHER") return `${second} scored more marks than ${first}`;
      if (outcome === "EQUAL") return `${first} and ${second} scored equal marks`;
      return `Their score relation cannot be determined`;
    case "SPEED":
      if (outcome === "FIRST_HIGHER") return `${first} is faster than ${second}`;
      if (outcome === "SECOND_HIGHER") return `${second} is faster than ${first}`;
      if (outcome === "EQUAL") return `${first} and ${second} are equally fast`;
      return `Their relative speeds cannot be determined`;
    case "SENIORITY":
      if (outcome === "FIRST_HIGHER") return `${first} is senior to ${second}`;
      if (outcome === "SECOND_HIGHER") return `${second} is senior to ${first}`;
      if (outcome === "EQUAL") return `${first} and ${second} are at the same seniority level`;
      return `Their seniority relation cannot be determined`;
    case "PERFORMANCE":
      if (outcome === "FIRST_HIGHER") return `${first} is ranked above ${second}`;
      if (outcome === "SECOND_HIGHER") return `${second} is ranked above ${first}`;
      if (outcome === "EQUAL") return `${first} and ${second} have the same performance level`;
      return `Their relative performance positions cannot be determined`;
  }
}

function endpointStem(context: RnkCp006EditorialContext, askHighest: boolean): string {
  switch (context) {
    case "HEIGHT":
      return askHighest ? "Who is the tallest?" : "Who is the shortest?";
    case "SCORES":
      return askHighest ? "Who scored the highest marks?" : "Who scored the lowest marks?";
    case "SPEED":
      return askHighest ? "Who is the fastest?" : "Who is the slowest?";
    case "SENIORITY":
      return askHighest ? "Who is the most senior?" : "Who is the most junior?";
    case "PERFORMANCE":
      return askHighest
        ? "Who is ranked highest in the performance review?"
        : "Who is ranked lowest in the performance review?";
  }
}

function endpointConclusion(
  context: RnkCp006EditorialContext,
  answer: string,
  askHighest: boolean,
): string {
  switch (context) {
    case "HEIGHT":
      return `${answer} is therefore the ${askHighest ? "tallest" : "shortest"}.`;
    case "SCORES":
      return `${answer} therefore has the ${askHighest ? "highest" : "lowest"} score.`;
    case "SPEED":
      return `${answer} is therefore the ${askHighest ? "fastest" : "slowest"}.`;
    case "SENIORITY":
      return `${answer} is therefore the ${askHighest ? "most senior" : "most junior"}.`;
    case "PERFORMANCE":
      return `${answer} is therefore ranked ${askHighest ? "highest" : "lowest"}.`;
  }
}

function completeOrderStem(context: RnkCp006EditorialContext): string {
  switch (context) {
    case "HEIGHT":
      return "Which option shows the correct order from tallest to shortest? (`=` means equal height.)";
    case "SCORES":
      return "Which option shows the correct order from highest to lowest score? (`=` means equal scores.)";
    case "SPEED":
      return "Which option shows the correct order from fastest to slowest? (`=` means equal speed.)";
    case "SENIORITY":
      return "Which option shows the correct order from most senior to most junior? (`=` means the same seniority level.)";
    case "PERFORMANCE":
      return "Which option shows the correct order from highest to lowest performance position? (`=` means the same performance level.)";
  }
}

function bridgeExplanation(question: RnkCp006EditorialReleaseQuestion): string {
  const bridge = question.state.equalityBridge;
  return `Use the equal pair to join the two comparison parts: ${bridge.aboveEntity} > ${bridge.entryTieMember}, ${bridge.entryTieMember} = ${bridge.exitTieMember}, and ${bridge.exitTieMember} > ${bridge.belowEntity}.`;
}

function placeCorrect(
  options: readonly string[],
  correct: string,
  correctIndex: number,
): readonly string[] {
  const output = options.filter((option) => option !== correct);
  output.splice(correctIndex, 0, correct);
  return output;
}

function renderPair(question: RnkCp006EditorialReleaseQuestion): Pick<
  RnkCp006EditorialV3Question,
  "stem" | "options" | "answer" | "explanation"
> {
  const oldMatch = question.stem.match(/^What is the relation between (.+) and (.+)\?$/);
  if (!oldMatch) throw new Error(`CP006 seed ${question.seed}: cannot parse pair stem`);
  const first = oldMatch[1]!;
  const second = oldMatch[2]!;
  const firstGroup = question.state.orderedGroups.findIndex((group) => group.includes(first));
  const secondGroup = question.state.orderedGroups.findIndex((group) => group.includes(second));
  if (firstGroup === -1 || secondGroup === -1 || firstGroup === secondGroup) {
    throw new Error(`CP006 seed ${question.seed}: invalid V3 pair query`);
  }
  const correctOutcome: PairOutcome = firstGroup < secondGroup ? "FIRST_HIGHER" : "SECOND_HIGHER";
  const answer = pairLabel(question.context, first, second, correctOutcome);
  const options = placeCorrect(
    [
      pairLabel(question.context, first, second, "FIRST_HIGHER"),
      pairLabel(question.context, first, second, "SECOND_HIGHER"),
      pairLabel(question.context, first, second, "EQUAL"),
      pairLabel(question.context, first, second, "UNKNOWN"),
    ],
    answer,
    question.correctIndex,
  );
  return {
    stem: pairStem(question.context, first, second),
    options,
    answer,
    explanation: [
      bridgeExplanation(question),
      question.reasoningProfile.pairSpan === "FULL_CHAIN"
        ? `Continue through the remaining strict comparisons to relate ${first} and ${second}.`
        : `This directly fixes the relation between the people just outside the tied level.`,
      `Therefore, ${answer}.`,
    ],
  };
}

function renderEndpoint(question: RnkCp006EditorialReleaseQuestion): Pick<
  RnkCp006EditorialV3Question,
  "stem" | "options" | "answer" | "explanation"
> {
  const askHighest = /highest/i.test(question.stem);
  return {
    stem: endpointStem(question.context, askHighest),
    options: question.options,
    answer: question.answer,
    explanation: [
      bridgeExplanation(question),
      `This gives the complete comparison order ${orderLabel(question.state.orderedGroups)}.`,
      endpointConclusion(question.context, question.answer, askHighest),
    ],
  };
}

function renderCompleteOrder(question: RnkCp006EditorialReleaseQuestion): Pick<
  RnkCp006EditorialV3Question,
  "stem" | "options" | "answer" | "explanation"
> {
  return {
    stem: completeOrderStem(question.context),
    options: question.options,
    answer: question.answer,
    explanation: [
      bridgeExplanation(question),
      `The full order is ${question.answer}.`,
      `People joined by “=” share one comparison level.`,
    ],
  };
}

function fingerprint(question: RnkCp006EditorialV3Question): string {
  return [
    RNK_CP006_EQUALITY_EDITORIAL_V3_RELEASE_VERSION,
    question.sourceForm,
    question.seed,
    question.context,
    question.state.orderedGroups.map((group) => group.join("=")).join(">"),
    question.stem,
    question.options.join("||"),
    question.correctIndex,
    question.answer,
    question.explanation.join("||"),
  ].join("|");
}

export function buildRnkCp006EqualityEditorialV3Release(): readonly RnkCp006EditorialV3Question[] {
  return buildRnkCp006EqualityEditorialV2Release().map((question) => {
    const rendered = question.sourceForm === "PAIR_RELATION_THROUGH_EQUALITY"
      ? renderPair(question)
      : question.sourceForm === "ENDPOINT_ENTITY_THROUGH_EQUALITY"
        ? renderEndpoint(question)
        : renderCompleteOrder(question);
    const output: RnkCp006EditorialV3Question = {
      ...question,
      ...rendered,
      editorialVersion: RNK_CP006_EQUALITY_EDITORIAL_V3_RELEASE_VERSION,
      mathematicalFingerprint: "PENDING",
    };
    return {
      ...output,
      mathematicalFingerprint: fingerprint(output),
    };
  });
}
