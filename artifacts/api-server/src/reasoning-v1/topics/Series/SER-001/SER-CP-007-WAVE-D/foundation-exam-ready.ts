import {
  generateSerCp007WaveDQuestion,
  type SerCp007WaveDQuestion,
  type SerCp007WaveDSourceRuleId,
  type SerCp007WaveDTemporaryTemplateId,
} from "./foundation";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const REMODELLED_RULES = new Set<SerCp007WaveDSourceRuleId>([
  "PAIRWISE_ADJACENT_SWAP_PERMUTATION",
  "FULL_REVERSAL_PERMUTATION",
  "ODD_EVEN_POSITION_REORDERING",
  "ALPHABET_COMPLEMENT_CLUSTER",
  "ALPHABET_COMPLEMENT_WITH_ROTATION",
]);

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function shiftCharacter(character: string, amount: number): string {
  const index = ALPHABET.indexOf(character.toUpperCase());
  if (index < 0) return character;
  const shifted = ALPHABET[mod(index + amount, 26)]!;
  return character === character.toLowerCase() ? shifted.toLowerCase() : shifted;
}

function shiftToken(token: string, amount: number): string {
  return [...token].map((character) => shiftCharacter(character, amount)).join("");
}

function complementToken(token: string): string {
  return [...token]
    .map((character) => {
      const index = ALPHABET.indexOf(character.toUpperCase());
      if (index < 0) return character;
      const complemented = ALPHABET[25 - index]!;
      return character === character.toLowerCase()
        ? complemented.toLowerCase()
        : complemented;
    })
    .join("");
}

function rotateLeft(token: string, amount: number): string {
  if (token.length <= 1) return token;
  const safe = mod(amount, token.length);
  return token.slice(safe) + token.slice(0, safe);
}

function applyPermutation(token: string, order: readonly number[]): string {
  return order.map((index) => token[index]!).join("");
}

function mutateToken(token: string, salt: number): string {
  const characters = [...token];
  const index = mod(salt, characters.length);
  characters[index] = shiftCharacter(characters[index]!, 1 + mod(salt, 3));
  return characters.join("");
}

function transformedPartner(
  sourceRuleId: SerCp007WaveDSourceRuleId,
  token: string,
  permutationOrder: readonly number[],
  rotationAmount: number,
): string {
  switch (sourceRuleId) {
    case "PAIRWISE_ADJACENT_SWAP_PERMUTATION":
    case "FULL_REVERSAL_PERMUTATION":
    case "ODD_EVEN_POSITION_REORDERING":
      return applyPermutation(token, permutationOrder);
    case "ALPHABET_COMPLEMENT_CLUSTER":
      return complementToken(token);
    case "ALPHABET_COMPLEMENT_WITH_ROTATION":
      return rotateLeft(complementToken(token), rotationAmount);
    default:
      return token;
  }
}

function choosePairProgression(
  sourceRuleId: SerCp007WaveDSourceRuleId,
  baseToken: string,
  permutationOrder: readonly number[],
  rotationAmount: number,
  seed: number,
): { readonly step: number; readonly terms: readonly string[] } {
  const candidates = [1, 2, 3, 4, 5, 7, 9, 11, 13];
  const offset = mod(seed, candidates.length);
  for (let attempt = 0; attempt < candidates.length; attempt += 1) {
    const step = candidates[(offset + attempt) % candidates.length]!;
    const terms: string[] = [];
    for (let pair = 0; pair < 4; pair += 1) {
      const anchor = shiftToken(baseToken, pair * step);
      terms.push(
        anchor,
        transformedPartner(
          sourceRuleId,
          anchor,
          permutationOrder,
          rotationAmount,
        ),
      );
    }
    if (new Set(terms).size === terms.length) return { step, terms };
  }
  throw new Error(
    `Unable to build a non-repeating paired progression for ${sourceRuleId}.`,
  );
}

function pairRuleText(
  sourceRuleId: SerCp007WaveDSourceRuleId,
  progressionStep: number,
  rotationAmount: number,
): string {
  const progression = `From one pair to the next, every letter of the first group moves ${progressionStep} place${progressionStep === 1 ? "" : "s"} forward.`;
  switch (sourceRuleId) {
    case "PAIRWISE_ADJACENT_SWAP_PERMUTATION":
      return `Read the groups in pairs. Within each pair, swap the 1st and 2nd letters, the 3rd and 4th letters, and so on. ${progression}`;
    case "FULL_REVERSAL_PERMUTATION":
      return `Read the groups in pairs. Within each pair, the second group is the reverse of the first. ${progression}`;
    case "ODD_EVEN_POSITION_REORDERING":
      return `Read the groups in pairs. Within each pair, write the odd-position letters first and the even-position letters afterwards. ${progression}`;
    case "ALPHABET_COMPLEMENT_CLUSTER":
      return `Read the groups in pairs. Within each pair, replace every letter with its alphabet opposite: A–Z, B–Y, C–X and so on. ${progression}`;
    case "ALPHABET_COMPLEMENT_WITH_ROTATION":
      return `Read the groups in pairs. Within each pair, replace every letter with its alphabet opposite and then move the first ${rotationAmount} letter${rotationAmount === 1 ? "" : "s"} to the end. ${progression}`;
    default:
      return progression;
  }
}

function pairActionText(
  sourceRuleId: SerCp007WaveDSourceRuleId,
  rotationAmount: number,
): string {
  switch (sourceRuleId) {
    case "PAIRWISE_ADJACENT_SWAP_PERMUTATION":
      return "swap each neighbouring pair";
    case "FULL_REVERSAL_PERMUTATION":
      return "reverse the first group";
    case "ODD_EVEN_POSITION_REORDERING":
      return "write odd-position letters before even-position letters";
    case "ALPHABET_COMPLEMENT_CLUSTER":
      return "replace each letter with its alphabet opposite";
    case "ALPHABET_COMPLEMENT_WITH_ROTATION":
      return `take alphabet opposites and rotate left by ${rotationAmount}`;
    default:
      return "apply the pair rule";
  }
}

function makeSteps(
  sourceRuleId: SerCp007WaveDSourceRuleId,
  terms: readonly string[],
  progressionStep: number,
  rotationAmount: number,
): readonly string[] {
  const anchors = [terms[0]!, terms[2]!, terms[4]!, terms[6]!];
  return [
    `First groups of the pairs: ${anchors.join(" → ")} (${progressionStep} places forward in every position).`,
    ...[0, 2, 4, 6].map(
      (index) =>
        `${terms[index]} → ${terms[index + 1]}: ${pairActionText(sourceRuleId, rotationAmount)}.`,
    ),
  ];
}

function stemFor(
  taskKind: SerCp007WaveDQuestion["taskKind"],
  sequence: readonly (string | null)[],
): string {
  const rendered = sequence.map((term) => term ?? "?").join(", ");
  switch (taskKind) {
    case "NEXT_TERM":
      return `Which letter group should come next?\n${rendered}, ?`;
    case "MISSING_TERM":
      return `Which letter group should replace the question mark?\n${rendered}`;
    case "PREVIOUS_TERM":
      return `Which letter group should come immediately before the first given term?\n?, ${rendered}`;
    case "WRONG_TERM":
      return `Which letter group should replace the incorrect term?\n${rendered}`;
  }
}

function buildFallbackOptions(
  correctAnswer: string,
  correctIndex: number,
  seed: number,
): readonly string[] {
  const pool = [
    mutateToken(correctAnswer, seed),
    shiftToken(correctAnswer, 1),
    shiftToken(correctAnswer, -1),
    [...correctAnswer].reverse().join(""),
  ];
  const distractors = [...new Set(pool)].filter(
    (candidate) => candidate && candidate !== correctAnswer,
  );
  let salt = seed + 17;
  while (distractors.length < 3) {
    const candidate = mutateToken(correctAnswer, salt);
    salt += 1;
    if (candidate !== correctAnswer && !distractors.includes(candidate)) {
      distractors.push(candidate);
    }
  }
  const options = distractors.slice(0, 3);
  options.splice(correctIndex, 0, correctAnswer);
  return options;
}

function sequenceFor(
  question: SerCp007WaveDQuestion,
  terms: readonly string[],
): {
  readonly sequence: readonly (string | null)[];
  readonly answerIndex: number;
  readonly corruptedIndex: number | null;
  readonly displayedWrongTerm: string | null;
} {
  const displayLength = terms.length - 1;
  switch (question.taskKind) {
    case "NEXT_TERM":
      return {
        sequence: terms.slice(0, displayLength),
        answerIndex: displayLength,
        corruptedIndex: null,
        displayedWrongTerm: null,
      };
    case "MISSING_TERM": {
      const answerIndex = question.hiddenState.answerIndex;
      return {
        sequence: terms.slice(0, displayLength).map((term, index) =>
          index === answerIndex ? null : term,
        ),
        answerIndex,
        corruptedIndex: null,
        displayedWrongTerm: null,
      };
    }
    case "PREVIOUS_TERM":
      return {
        sequence: terms.slice(1),
        answerIndex: 0,
        corruptedIndex: null,
        displayedWrongTerm: null,
      };
    case "WRONG_TERM": {
      const corruptedIndex = question.hiddenState.corruptedIndex ?? 2;
      const displayed = [...terms.slice(0, displayLength)];
      let displayedWrongTerm = mutateToken(
        displayed[corruptedIndex]!,
        question.seed + corruptedIndex,
      );
      let salt = question.seed + corruptedIndex + 11;
      while (
        displayedWrongTerm === displayed[corruptedIndex] ||
        displayed.includes(displayedWrongTerm)
      ) {
        displayedWrongTerm = mutateToken(displayed[corruptedIndex]!, salt);
        salt += 1;
      }
      displayed[corruptedIndex] = displayedWrongTerm;
      return {
        sequence: displayed,
        answerIndex: corruptedIndex,
        corruptedIndex,
        displayedWrongTerm,
      };
    }
  }
}

export function generateSerCp007WaveDExamReadyQuestion(
  temporaryTemplateId: SerCp007WaveDTemporaryTemplateId,
  seed: number,
): SerCp007WaveDQuestion {
  const original = generateSerCp007WaveDQuestion(temporaryTemplateId, seed);
  if (!REMODELLED_RULES.has(original.sourceRuleId)) return original;

  const baseToken = original.hiddenState.canonicalTerms[0]!;
  const { step, terms } = choosePairProgression(
    original.sourceRuleId,
    baseToken,
    original.hiddenState.permutationOrder,
    original.hiddenState.rotationAmount,
    seed + temporaryTemplateId.length,
  );
  const layout = sequenceFor(original, terms);
  const correctAnswer = terms[layout.answerIndex]!;
  const pairAction = pairActionText(
    original.sourceRuleId,
    original.hiddenState.rotationAmount,
  );
  const conclusion =
    original.taskKind === "WRONG_TERM"
      ? `${layout.displayedWrongTerm} breaks the pair/progression structure. It should be ${correctAnswer}.`
      : `Therefore, the required group is ${correctAnswer}.`;

  return {
    ...original,
    difficulty:
      original.sourceRuleId === "ALPHABET_COMPLEMENT_WITH_ROTATION" ||
      original.sourceRuleId === "ODD_EVEN_POSITION_REORDERING"
        ? "HARD"
        : "MEDIUM",
    stem: stemFor(original.taskKind, layout.sequence),
    sequence: layout.sequence,
    options: buildFallbackOptions(
      correctAnswer,
      original.correctIndex,
      seed + temporaryTemplateId.length,
    ),
    correctAnswer,
    mathematicalFingerprint: [
      original.canonicalAuthorityId,
      original.sourceRuleId,
      "PAIRED_PROGRESSIVE_V5",
      baseToken,
      step,
      original.hiddenState.rotationAmount,
      original.taskKind,
      layout.answerIndex,
      layout.corruptedIndex ?? "clean",
    ].join("|"),
    explanation: {
      rule: pairRuleText(
        original.sourceRuleId,
        step,
        original.hiddenState.rotationAmount,
      ),
      steps: makeSteps(
        original.sourceRuleId,
        terms,
        step,
        original.hiddenState.rotationAmount,
      ),
      quickMethod: `Mark the groups as pairs first. Compare the first groups of the pairs, then ${pairAction} within the required pair.`,
      commonMistake: `Do not continue only the within-pair transformation. The first group also changes from one pair to the next.`,
      trapCode: "ANSWER_LEAKAGE_PERIODIC_LAYOUT_REMOVED",
      conclusion,
    },
    hiddenState: {
      ...original.hiddenState,
      parameterKey: `${original.hiddenState.parameterKey}|paired-progression:${step}|v5`,
      canonicalTerms: terms,
      answerIndex: layout.answerIndex,
      corruptedIndex: layout.corruptedIndex,
      displayedWrongTerm: layout.displayedWrongTerm,
    },
  };
}

export const SER_CP007_WAVE_D_REMODELLED_SOURCE_RULE_IDS = [
  ...REMODELLED_RULES,
] as const;
