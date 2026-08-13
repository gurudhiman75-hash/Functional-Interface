import {
  buildRnkCp006EqualityEditorialV3Release,
  type RnkCp006EditorialV3Question,
} from "./cp006-equality-ranking-editorial-v3-release";
import type { RnkCp006EditorialContext } from "./cp006-equality-ranking-editorial-v2";

export const RNK_CP006_EQUALITY_EDITORIAL_V4_RELEASE_VERSION =
  "RNK_CP006_EQUALITY_EDITORIAL_V4_RELEASE" as const;

export type RnkCp006EditorialV4Question = Omit<
  RnkCp006EditorialV3Question,
  | "editorialVersion"
  | "clues"
  | "stem"
  | "options"
  | "answer"
  | "explanation"
  | "mathematicalFingerprint"
> & {
  readonly editorialVersion: typeof RNK_CP006_EQUALITY_EDITORIAL_V4_RELEASE_VERSION;
  readonly clues: readonly string[];
  readonly stem: string;
  readonly options: readonly string[];
  readonly answer: string;
  readonly explanation: readonly string[];
  readonly mathematicalFingerprint: string;
};

function orderLabel(groups: readonly (readonly string[])[]): string {
  return groups.map((group) => group.join(" = ")).join(" > ");
}

function cleanPerformanceClue(clue: string): string {
  return clue.replace(
    /^(.+) and (.+) received the same performance level\.$/,
    "$1 and $2 were placed at the same level in the performance review.",
  );
}

function contextOrderSentence(
  context: RnkCp006EditorialContext,
  order: string,
): string {
  switch (context) {
    case "HEIGHT":
      return `Putting all the statements together, the order from tallest to shortest is ${order}.`;
    case "SCORES":
      return `Putting all the statements together, the order from highest to lowest score is ${order}.`;
    case "SPEED":
      return `Putting all the statements together, the order from fastest to slowest is ${order}.`;
    case "SENIORITY":
      return `Putting all the statements together, the order from most senior to most junior is ${order}.`;
    case "PERFORMANCE":
      return `Putting all the statements together, the performance order from highest to lowest is ${order}.`;
  }
}

function bridgeSentence(question: RnkCp006EditorialV3Question): string {
  const { aboveEntity, entryTieMember, exitTieMember, belowEntity } =
    question.state.equalityBridge;
  switch (question.context) {
    case "HEIGHT":
      return `${aboveEntity} is taller than ${entryTieMember}; ${entryTieMember} and ${exitTieMember} are equally tall; and ${exitTieMember} is taller than ${belowEntity}. Therefore, ${aboveEntity} is taller than ${belowEntity}.`;
    case "SCORES":
      return `${aboveEntity} scored more marks than ${entryTieMember}; ${entryTieMember} and ${exitTieMember} scored equal marks; and ${exitTieMember} scored more marks than ${belowEntity}. Therefore, ${aboveEntity} scored more marks than ${belowEntity}.`;
    case "SPEED":
      return `${aboveEntity} is faster than ${entryTieMember}; ${entryTieMember} and ${exitTieMember} are equally fast; and ${exitTieMember} is faster than ${belowEntity}. Therefore, ${aboveEntity} is faster than ${belowEntity}.`;
    case "SENIORITY":
      return `${aboveEntity} is senior to ${entryTieMember}; ${entryTieMember} and ${exitTieMember} are at the same seniority level; and ${exitTieMember} is senior to ${belowEntity}. Therefore, ${aboveEntity} is senior to ${belowEntity}.`;
    case "PERFORMANCE":
      return `${aboveEntity} is ranked above ${entryTieMember}; ${entryTieMember} and ${exitTieMember} are at the same level; and ${exitTieMember} is ranked above ${belowEntity}. Therefore, ${aboveEntity} is ranked above ${belowEntity}.`;
  }
}

function pairNames(question: RnkCp006EditorialV3Question): readonly [string, string] {
  for (const first of question.state.entities) {
    for (const second of question.state.entities) {
      if (first === second) continue;
      if (question.stem.includes(first) && question.stem.includes(second)) {
        return question.stem.indexOf(first) < question.stem.indexOf(second)
          ? [first, second]
          : [second, first];
      }
    }
  }
  throw new Error(`CP006 seed ${question.seed}: pair names not found in V3 stem`);
}

function performancePairStem(first: string, second: string): string {
  return `What can be concluded about the relative positions of ${first} and ${second} in the performance review?`;
}

function performancePairOptions(
  question: RnkCp006EditorialV3Question,
  first: string,
  second: string,
): readonly string[] {
  const firstIndex = question.state.orderedGroups.findIndex((group) => group.includes(first));
  const secondIndex = question.state.orderedGroups.findIndex((group) => group.includes(second));
  if (firstIndex === -1 || secondIndex === -1 || firstIndex === secondIndex) {
    throw new Error(`CP006 seed ${question.seed}: invalid performance pair query`);
  }
  const correct = firstIndex < secondIndex
    ? `${first} is ranked above ${second}`
    : `${second} is ranked above ${first}`;
  const raw = [
    `${first} is ranked above ${second}`,
    `${second} is ranked above ${first}`,
    `${first} and ${second} are placed at the same level`,
    `Their relative positions in the performance review cannot be determined`,
  ];
  const options = raw.filter((option) => option !== correct);
  options.splice(question.correctIndex, 0, correct);
  return options;
}

function completeOrderStem(context: RnkCp006EditorialContext): string {
  switch (context) {
    case "HEIGHT":
      return `Which option shows the correct order from tallest to shortest? In the options, "=" indicates equal height.`;
    case "SCORES":
      return `Which option shows the correct order from highest to lowest score? In the options, "=" indicates equal scores.`;
    case "SPEED":
      return `Which option shows the correct order from fastest to slowest? In the options, "=" indicates equal speed.`;
    case "SENIORITY":
      return `Which option shows the correct order from most senior to most junior? In the options, "=" indicates the same seniority level.`;
    case "PERFORMANCE":
      return `Which option shows the correct performance order from highest to lowest? In the options, "=" indicates the same level.`;
  }
}

function splitTieOrder(question: RnkCp006EditorialV3Question): string {
  return orderLabel(
    question.state.orderedGroups.flatMap((group) =>
      group.map((entity) => [entity] as string[]),
    ),
  );
}

function falseEqualityOrder(question: RnkCp006EditorialV3Question): string {
  const groups = question.state.orderedGroups.map((group) => [...group]);
  const tieIndex = question.state.tieGroupIndex;
  const tie = groups[tieIndex]!;
  if (question.seed % 2 === 0) {
    const moved = tie.pop()!;
    groups[tieIndex + 1] = [moved, ...groups[tieIndex + 1]!];
  } else {
    const moved = tie.shift()!;
    groups[tieIndex - 1] = [...groups[tieIndex - 1]!, moved];
  }
  return orderLabel(groups);
}

function strictSwapOrder(question: RnkCp006EditorialV3Question): string {
  const groups = question.state.orderedGroups.map((group) => [...group]);
  const last = groups.length - 1;
  let left = question.seed % 2 === 0 ? 0 : last - 1;
  let right = left + 1;
  if (left === question.state.tieGroupIndex || right === question.state.tieGroupIndex) {
    if (question.state.tieGroupIndex + 2 <= last) {
      left = question.state.tieGroupIndex + 1;
      right = left + 1;
    } else {
      right = question.state.tieGroupIndex - 1;
      left = right - 1;
    }
  }
  [groups[left], groups[right]] = [groups[right]!, groups[left]!];
  return orderLabel(groups);
}

function completeOrderOptions(question: RnkCp006EditorialV3Question): readonly string[] {
  const correct = orderLabel(question.state.orderedGroups);
  const distractors = [
    splitTieOrder(question),
    falseEqualityOrder(question),
    strictSwapOrder(question),
  ];
  if (new Set([correct, ...distractors]).size !== 4) {
    throw new Error(`CP006 seed ${question.seed}: V4 complete-order distractors are not unique`);
  }
  const options = [...distractors];
  options.splice(question.correctIndex, 0, correct);
  return options;
}

function endpointConclusion(question: RnkCp006EditorialV3Question): string {
  const low = /shortest|lowest marks|slowest|most junior|ranked lowest/i.test(question.stem);
  switch (question.context) {
    case "HEIGHT":
      return `${question.answer} is therefore the ${low ? "shortest" : "tallest"}.`;
    case "SCORES":
      return `${question.answer} therefore has the ${low ? "lowest" : "highest"} score.`;
    case "SPEED":
      return `${question.answer} is therefore the ${low ? "slowest" : "fastest"}.`;
    case "SENIORITY":
      return `${question.answer} is therefore the ${low ? "most junior" : "most senior"}.`;
    case "PERFORMANCE":
      return `${question.answer} is therefore ranked ${low ? "lowest" : "highest"}.`;
  }
}

function renderQuestion(question: RnkCp006EditorialV3Question): Omit<
  RnkCp006EditorialV4Question,
  "editorialVersion" | "mathematicalFingerprint"
> {
  const clues = question.context === "PERFORMANCE"
    ? question.clues.map(cleanPerformanceClue)
    : question.clues;
  const order = orderLabel(question.state.orderedGroups);

  if (question.sourceForm === "PAIR_RELATION_THROUGH_EQUALITY") {
    const [first, second] = pairNames(question);
    const stem = question.context === "PERFORMANCE"
      ? performancePairStem(first, second)
      : question.stem;
    const options = question.context === "PERFORMANCE"
      ? performancePairOptions(question, first, second)
      : question.options;
    const answer = options[question.correctIndex]!;
    const explanation = question.reasoningProfile.pairSpan === "FULL_CHAIN"
      ? [
          bridgeSentence(question),
          contextOrderSentence(question.context, order),
          `Therefore, ${answer}.`,
        ]
      : [
          bridgeSentence(question),
          `Therefore, ${answer}.`,
        ];
    return {
      ...question,
      clues,
      stem,
      options,
      answer,
      explanation,
    };
  }

  if (question.sourceForm === "ENDPOINT_ENTITY_THROUGH_EQUALITY") {
    return {
      ...question,
      clues,
      explanation: [
        bridgeSentence(question),
        contextOrderSentence(question.context, order),
        endpointConclusion(question),
      ],
    };
  }

  const options = completeOrderOptions(question);
  const answer = options[question.correctIndex]!;
  const tie = question.state.orderedGroups[question.state.tieGroupIndex]!;
  return {
    ...question,
    clues,
    stem: completeOrderStem(question.context),
    options,
    answer,
    explanation: [
      `${tie[0]} and ${tie[1]} must remain together at one comparison level because the statements say they are equal.`,
      contextOrderSentence(question.context, order),
      `So the correct option is ${String.fromCharCode(65 + question.correctIndex)}.`,
    ],
  };
}

function fingerprint(question: Omit<RnkCp006EditorialV4Question, "mathematicalFingerprint">): string {
  return [
    RNK_CP006_EQUALITY_EDITORIAL_V4_RELEASE_VERSION,
    question.sourceForm,
    question.seed,
    question.context,
    question.state.orderedGroups.map((group) => group.join("=")).join(">"),
    question.clues.join("||"),
    question.stem,
    question.options.join("||"),
    question.correctIndex,
    question.answer,
    question.explanation.join("||"),
  ].join("|");
}

export function buildRnkCp006EqualityEditorialV4Release(): readonly RnkCp006EditorialV4Question[] {
  return buildRnkCp006EqualityEditorialV3Release().map((source) => {
    const rendered = renderQuestion(source);
    const output: Omit<RnkCp006EditorialV4Question, "mathematicalFingerprint"> = {
      ...rendered,
      editorialVersion: RNK_CP006_EQUALITY_EDITORIAL_V4_RELEASE_VERSION,
    };
    return {
      ...output,
      mathematicalFingerprint: fingerprint(output),
    };
  });
}
