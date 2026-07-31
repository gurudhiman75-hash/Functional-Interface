import {
  CLS_CP006_PROTOTYPE_BY_ID,
  clsCp006DomainForKind,
  clsCp006FormatItem,
  clsCp006LetterPosition,
  clsCp006RuleIdsForKind,
  clsCp006RuleValue,
} from "./alphabet-domain";
import type {
  ClsCp006AmbiguityAudit,
  ClsCp006Difficulty,
  ClsCp006DifficultyFeatures,
  ClsCp006Explanation,
  ClsCp006Item,
  ClsCp006OptionKind,
  ClsCp006PrototypeId,
  ClsCp006RuleId,
  ClsCp006RuleSupport,
  GeneratedClsCp006Question,
} from "./types";

function assertSeed(seed: number): void {
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`CLS-CP-006 seed must be a non-negative safe integer: ${seed}`);
  }
}

function mix(seed: number, salt: number): number {
  let value = (seed + Math.imul(salt + 1, 0x9e3779b1)) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x7feb352d) >>> 0;
  value ^= value >>> 15;
  value = Math.imul(value, 0x846ca68b) >>> 0;
  value ^= value >>> 16;
  return value >>> 0;
}

function choose<T>(values: readonly T[], seed: number, salt: number): T {
  if (values.length === 0) throw new Error("Cannot choose from an empty CLS-CP-006 collection.");
  return values[mix(seed, salt) % values.length]!;
}

function sampleDistinct<T>(
  values: readonly T[],
  count: number,
  seed: number,
  salt: number,
): readonly T[] {
  if (count > values.length) throw new Error(`Cannot sample ${count} values from ${values.length}.`);
  return values
    .map((value, index) => ({ value, rank: mix(seed + index * 131, salt + index * 17) }))
    .sort((left, right) => left.rank - right.rank || String(left.value).localeCompare(String(right.value)))
    .slice(0, count)
    .map(({ value }) => value);
}

export function auditClsCp006Items(
  items: readonly ClsCp006Item[],
  intendedRuleId: ClsCp006RuleId,
  intendedAnswerIndex: number,
): ClsCp006AmbiguityAudit {
  if (items.length !== 4 && items.length !== 5) {
    return {
      result: "NO_VALID_RULE",
      answerIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "CLS-CP-006 requires four or five options.",
    };
  }
  const kind = items[0]?.kind;
  if (!kind || items.some((item) => item.kind !== kind)) {
    return {
      result: "NO_VALID_RULE",
      answerIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "All options must use one answer-object kind.",
    };
  }

  const supports: ClsCp006RuleSupport[] = [];
  for (const ruleId of clsCp006RuleIdsForKind(kind)) {
    const values = items.map((item) => clsCp006RuleValue(item, ruleId));
    const indexesByValue = new Map<string, number[]>();
    values.forEach((value, index) => {
      const indexes = indexesByValue.get(value) ?? [];
      indexes.push(index);
      indexesByValue.set(value, indexes);
    });
    if (indexesByValue.size !== 2) continue;
    const entries = [...indexesByValue.entries()];
    const common = entries.find(([, indexes]) => indexes.length === items.length - 1);
    const singleton = entries.find(([, indexes]) => indexes.length === 1);
    if (!common || !singleton) continue;
    supports.push({
      ruleId,
      commonValue: common[0],
      outlierValue: singleton[0],
      matchingOptionIndexes: common[1],
      answerIndex: singleton[1][0]!,
    });
  }

  const intendedRuleSupported = supports.some(
    (support) => support.ruleId === intendedRuleId && support.answerIndex === intendedAnswerIndex,
  );
  if (supports.length === 0) {
    return {
      result: "NO_VALID_RULE",
      answerIndex: null,
      intendedRuleSupported,
      candidateSupports: supports,
      reason: "No admitted rule isolates one option.",
    };
  }
  const answerIndexes = [...new Set(supports.map((support) => support.answerIndex))];
  if (!intendedRuleSupported || answerIndexes.length !== 1) {
    return {
      result: "AMBIGUOUS",
      answerIndex: answerIndexes.length === 1 ? answerIndexes[0]! : null,
      intendedRuleSupported,
      candidateSupports: supports,
      reason: !intendedRuleSupported
        ? "The intended rule does not independently support the stored answer."
        : "Different admitted rules identify different outliers.",
    };
  }
  return {
    result: "UNIQUE",
    answerIndex: answerIndexes[0]!,
    intendedRuleSupported: true,
    candidateSupports: supports,
    reason: supports.length === 1
      ? "Exactly one admitted rule isolates the answer."
      : "All admitted supporting rules isolate the same answer.",
  };
}

function stemFor(kind: ClsCp006OptionKind, seed: number): string {
  const letterStems = [
    "Which of the following letters is the odd one out?",
    "All but one of these letters share the same alphabet property. Select the different letter.",
    "Identify the letter that does not follow the common classification.",
    "Most of these letters belong to one alphabet class. Which one does not?",
    "Choose the letter whose alphabet property differs from the others.",
  ];
  const pairStems = [
    "Which of the following letter-pairs is the odd one out?",
    "All but one of these letter-pairs follow the same internal relation. Select the different pair.",
    "Identify the ordered letter-pair that does not share the common relation.",
    "Most of these letter-pairs follow one alphabet rule. Which pair differs?",
    "Choose the complete letter-pair whose internal alphabet relation is different.",
  ];
  return choose(kind === "LETTER" ? letterStems : pairStems, seed, 401);
}

function evidenceFor(item: ClsCp006Item, ruleId: ClsCp006RuleId): string {
  if (item.kind === "LETTER") {
    const letter = item.letters[0];
    const position = clsCp006LetterPosition(letter);
    switch (ruleId) {
      case "LETTER_VOWEL_CONSONANT_CLASS":
        return `${letter} is ${clsCp006RuleValue(item, ruleId) === "VOWEL" ? "a vowel" : "a consonant"}.`;
      case "LETTER_POSITION_PARITY":
        return `${letter} is at position ${position}, which is ${position % 2 === 0 ? "even" : "odd"}.`;
      case "LETTER_ALPHABET_HALF":
        return `${letter} is at position ${position}, so it lies in the ${position <= 13 ? "first" : "second"} half of the alphabet.`;
      default:
        throw new Error(`Unsupported single-letter evidence rule: ${ruleId}`);
    }
  }

  const [first, second] = item.letters;
  const firstPosition = clsCp006LetterPosition(first);
  const secondPosition = clsCp006LetterPosition(second);
  const pair = clsCp006FormatItem(item);
  switch (ruleId) {
    case "PAIR_ABSOLUTE_POSITION_GAP":
      return `${pair}: |${secondPosition} - ${firstPosition}| = ${Math.abs(secondPosition - firstPosition)}.`;
    case "PAIR_SIGNED_POSITION_GAP":
      return `${pair}: ${secondPosition} - ${firstPosition} = ${secondPosition - firstPosition}.`;
    case "PAIR_POSITION_SUM":
      return `${pair}: ${firstPosition} + ${secondPosition} = ${firstPosition + secondPosition}.`;
    case "PAIR_OPPOSITE_STATUS":
      return `${pair}: ${firstPosition} + ${secondPosition} = ${firstPosition + secondPosition}, so the letters ${firstPosition + secondPosition === 27 ? "are" : "are not"} opposites.`;
    case "PAIR_VOWEL_CONSONANT_COMPOSITION": {
      const firstClass = clsCp006RuleValue(
        { kind: "LETTER", letters: [first] },
        "LETTER_VOWEL_CONSONANT_CLASS",
      ).toLowerCase();
      const secondClass = clsCp006RuleValue(
        { kind: "LETTER", letters: [second] },
        "LETTER_VOWEL_CONSONANT_CLASS",
      ).toLowerCase();
      return `${pair} contains a ${firstClass} followed by a ${secondClass}.`;
    }
    default:
      throw new Error(`Unsupported pair evidence rule: ${ruleId}`);
  }
}

function coreConceptFor(ruleId: ClsCp006RuleId, commonValue: string): string {
  switch (ruleId) {
    case "LETTER_VOWEL_CONSONANT_CLASS":
      return `Most options are ${commonValue === "VOWEL" ? "vowels" : "consonants"}; one letter belongs to the other class.`;
    case "LETTER_POSITION_PARITY":
      return `Most letters occupy ${commonValue === "EVEN_POSITION" ? "even" : "odd"}-numbered alphabet positions.`;
    case "LETTER_ALPHABET_HALF":
      return `Most letters lie in the ${commonValue === "FIRST_HALF" ? "first" : "second"} half of the alphabet.`;
    case "PAIR_ABSOLUTE_POSITION_GAP": {
      const gap = Number(commonValue);
      const positionWord = Math.abs(gap) === 1 ? "position" : "positions";
      return `In most pairs, the two letters are ${commonValue} ${positionWord} apart.`;
    }
    case "PAIR_SIGNED_POSITION_GAP": {
      const gap = Number(commonValue);
      const magnitude = Math.abs(gap);
      const positionWord = magnitude === 1 ? "position" : "positions";
      return `In most pairs, the second letter is ${magnitude} ${positionWord} ${gap >= 0 ? "after" : "before"} the first.`;
    }
    case "PAIR_POSITION_SUM":
      return `In most pairs, the two alphabet positions add to ${commonValue}.`;
    case "PAIR_OPPOSITE_STATUS":
      return commonValue === "OPPOSITE_PAIR"
        ? "Most options are opposite-letter pairs whose positions total 27."
        : "Most options are not opposite-letter pairs; one pair has positions totaling 27.";
    case "PAIR_VOWEL_CONSONANT_COMPOSITION": {
      const labels = {
        VV: "vowel-vowel",
        VC: "vowel-consonant",
        CV: "consonant-vowel",
        CC: "consonant-consonant",
      } as const;
      return `Most pairs share the same vowel/consonant order (${labels[commonValue as keyof typeof labels]}).`;
    }
  }
}

function shortcutFor(ruleId: ClsCp006RuleId): string {
  switch (ruleId) {
    case "LETTER_VOWEL_CONSONANT_CLASS":
      return "Mark A, E, I, O and U first; the remaining letters are consonants.";
    case "LETTER_POSITION_PARITY":
      return "Write each alphabet position and compare only whether it is odd or even.";
    case "LETTER_ALPHABET_HALF":
      return "Use M/N as the boundary: A–M is the first half and N–Z is the second half.";
    case "PAIR_ABSOLUTE_POSITION_GAP":
      return "Write both positions and compare the absolute gaps without using direction.";
    case "PAIR_SIGNED_POSITION_GAP":
      return "Subtract first position from second position and keep the sign.";
    case "PAIR_POSITION_SUM":
      return "Add the two alphabet positions in each pair and compare the totals.";
    case "PAIR_OPPOSITE_STATUS":
      return "Check whether each pair totals 27; opposite letters always do.";
    case "PAIR_VOWEL_CONSONANT_COMPOSITION":
      return "Label each letter V or C, then compare the two-letter class pattern.";
  }
}

function trapFor(ruleId: ClsCp006RuleId): string {
  switch (ruleId) {
    case "PAIR_ABSOLUTE_POSITION_GAP":
      return "Do not count the letters lying between the endpoints; compare the position difference.";
    case "PAIR_SIGNED_POSITION_GAP":
      return "Do not ignore order: reversing a pair changes the sign of its gap.";
    case "PAIR_OPPOSITE_STATUS":
      return "Do not judge by visual symmetry; opposite alphabet positions must add to 27.";
    case "PAIR_VOWEL_CONSONANT_COMPOSITION":
      return "Do not treat VC and CV as the same ordered composition.";
    default:
      return "Do not stop at a visual resemblance; verify the declared alphabet property for every option.";
  }
}

function difficultyFor(
  items: readonly ClsCp006Item[],
  ruleId: ClsCp006RuleId,
  optionCount: 4 | 5,
  supportCount: number,
): { difficulty: ClsCp006Difficulty; features: ClsCp006DifficultyFeatures } {
  const pair = items[0]!.kind === "LETTER_PAIR";
  const directionSensitive =
    ruleId === "PAIR_SIGNED_POSITION_GAP" ||
    ruleId === "PAIR_VOWEL_CONSONANT_COMPOSITION";
  const arithmeticDemand: 1 | 2 | 3 =
    ruleId === "PAIR_SIGNED_POSITION_GAP" || ruleId === "PAIR_POSITION_SUM"
      ? 3
      : ruleId === "PAIR_ABSOLUTE_POSITION_GAP" || ruleId === "PAIR_OPPOSITE_STATUS"
        ? 2
        : 1;
  const maximumPosition = Math.max(
    ...items.flatMap((item) => item.letters.map(clsCp006LetterPosition)),
  );
  const score =
    arithmeticDemand +
    (pair ? 1 : 0) +
    (directionSensitive ? 1 : 0) +
    (optionCount === 5 ? 1 : 0) +
    (supportCount > 1 ? 1 : 0);
  const difficulty: ClsCp006Difficulty =
    score <= 2 ? "EASY" : score <= 4 ? "MEDIUM" : "HARD";
  return {
    difficulty,
    features: {
      optionCount,
      optionKind: pair ? "LETTER_PAIR" : "LETTER",
      arithmeticDemand,
      directionSensitive,
      competingSupportCount: supportCount,
      maximumPosition,
      score,
    },
  };
}

function explanationFor(
  items: readonly ClsCp006Item[],
  ruleId: ClsCp006RuleId,
  commonValue: string,
  correctIndex: number,
): { evidence: readonly string[]; explanation: ClsCp006Explanation } {
  const evidence = items.map((item) => evidenceFor(item, ruleId));
  const answer = clsCp006FormatItem(items[correctIndex]!);
  return {
    evidence,
    explanation: {
      coreConcept: [coreConceptFor(ruleId, commonValue)],
      stepByStep: [...evidence, `Therefore, ${answer} is the odd one out.`],
      examSpeedShortcut: [shortcutFor(ruleId)],
      commonTrapWarning: [trapFor(ruleId)],
    },
  };
}

export function generateClsCp006Question(
  prototypeId: ClsCp006PrototypeId,
  seed: number,
  optionCount: 4 | 5 = 4,
): GeneratedClsCp006Question {
  assertSeed(seed);
  if (optionCount !== 4 && optionCount !== 5) {
    throw new Error(`CLS-CP-006 option count must be 4 or 5: ${optionCount}`);
  }
  const prototype = CLS_CP006_PROTOTYPE_BY_ID.get(prototypeId);
  if (!prototype) throw new Error(`Unknown CLS-CP-006 prototype: ${prototypeId}`);

  const domain = clsCp006DomainForKind(prototype.optionKind);
  for (let attempt = 0; attempt < 4_000; attempt += 1) {
    const sourceSeed = seed + attempt * 10_007;
    const intendedRuleId = choose(prototype.allowedRuleIds, sourceSeed, 17);
    const groups = new Map<string, ClsCp006Item[]>();
    for (const item of domain) {
      const value = clsCp006RuleValue(item, intendedRuleId);
      const group = groups.get(value) ?? [];
      group.push(item);
      groups.set(value, group);
    }
    const eligibleGroups = [...groups.entries()].filter(
      ([, members]) => members.length >= optionCount - 1,
    );
    const [commonValue, commonMembers] = choose(eligibleGroups, sourceSeed, 23);
    const inliers = sampleDistinct(commonMembers, optionCount - 1, sourceSeed, 29);
    const outlierPool = domain.filter(
      (item) => clsCp006RuleValue(item, intendedRuleId) !== commonValue,
    );
    if (outlierPool.length === 0) continue;
    const outlier = choose(outlierPool, sourceSeed, 31);
    const correctIndex = mix(sourceSeed, 37) % optionCount;
    const items = [...inliers];
    items.splice(correctIndex, 0, outlier);
    const options = items.map(clsCp006FormatItem);
    if (new Set(options).size !== optionCount) continue;

    const ambiguityAudit = auditClsCp006Items(items, intendedRuleId, correctIndex);
    if (ambiguityAudit.result !== "UNIQUE" || ambiguityAudit.answerIndex !== correctIndex) {
      continue;
    }
    const { difficulty, features } = difficultyFor(
      items,
      intendedRuleId,
      optionCount,
      ambiguityAudit.candidateSupports.length,
    );
    const { evidence, explanation } = explanationFor(
      items,
      intendedRuleId,
      commonValue,
      correctIndex,
    );

    return {
      checkpointId: "CLS-CP-006",
      prototypeId,
      permanentQlId: null,
      seed,
      task: prototype.task,
      optionKind: prototype.optionKind,
      stem: stemFor(prototype.optionKind, sourceSeed),
      items,
      options,
      correctIndex,
      answer: options[correctIndex]!,
      intendedRuleId,
      intendedRuleValue: commonValue,
      evidenceByOption: evidence,
      ambiguityAudit,
      difficulty,
      difficultyFeatures: features,
      explanation,
      reviewOnly: true,
      questionStudioVisible: false,
      metadata: {
        datasetVersion: "CLS-CP006-ALPHABET-DOMAIN-v1",
        runtimeVersion: "cls-cp006-discovery-v1",
        locale: "en-IN",
        optionCount,
        sourcePrototypeSeed: sourceSeed,
        sourceSaturationStatus: "INITIAL_SOURCE_PASS_COMPLETE__GAP_AUDIT_OPEN",
      },
      lifecycle: {
        permanentQlId: null,
        reviewStatus: "UNREVIEWED_DISCOVERY",
        questionBankStatus: "NOT_STORED",
        testEligibility: "INELIGIBLE",
        publiclyPublishable: false,
        questionStudioDiscoverable: false,
      },
    };
  }
  throw new Error(
    `Unable to construct a unique CLS-CP-006 state for ${prototypeId}/${seed}/${optionCount}.`,
  );
}
