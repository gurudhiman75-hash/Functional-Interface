import { letterPosition, shiftLetter } from "../foundation/alphabet";
import { checkWordAmbiguity } from "./ambiguity-checker";
import {
  enabledPilotWords,
  type AnaCp007PilotWordRecord,
} from "./foundation/word-registry";
import {
  ANA_CP007_VOWELS,
  deriveWordStructure,
  extractWordPositions,
  removeConsonants,
  removeVowels,
} from "./foundation/word-structure";
import {
  independentlyApplyWordRule,
  verifyWordTransfer,
  type WordEvidence,
} from "./independent-solver";
import {
  hasAnyWordAlternative,
  validateWordOptions,
  wordOptionKey,
  type WordOption,
  type WordPairOptionValue,
} from "./option-validator";
import {
  anaCp007QlById,
  type AnaCp007RuleId,
  type WordPresentationMode,
} from "./question-language.en";
import {
  ANA_CP007_RULES,
  sameWordRuleResult,
  wordRuleById,
  wordRuleResultKey,
  type WordRuleContext,
  type WordRuleResult,
} from "./rule-definitions";

export type WordDifficulty = "EASY" | "MEDIUM" | "HARD";
export type WordLayout = "INLINE" | "ARROW" | "TWO_ROW_TABLE" | "BOXED_PAIRS";

export interface GeneratedWordAnalogy {
  checkpointId: "ANA-CP-007";
  qlId: string;
  ruleId: AnaCp007RuleId;
  presentationMode: WordPresentationMode;
  seed: number;
  difficulty: WordDifficulty;
  difficultyScore: number;
  layout: WordLayout;
  context: WordRuleContext;
  source: WordEvidence;
  target: WordEvidence;
  stem: string;
  options: readonly WordOption[];
  correctIndex: number;
  explanation: {
    ruleStatement: string;
    sourceDemonstration: string;
    targetApplication: string;
    conclusion: string;
    closestTrapRejection: string;
  };
  metadata: {
    runtimeVersion: "ana-cp-007-v1";
    ambiguityAccepted: true;
    publiclyPublishable: false;
    maturity: "RUNTIME_PROOF";
    wordTokenLanguage: "en";
  };
}

interface WordInstance {
  context: WordRuleContext;
  source: WordEvidence;
  target: WordEvidence;
  difficulty: WordDifficulty;
  difficultyScore: number;
}

interface ResultCandidate {
  value: WordRuleResult;
  errorLabel: string;
}

const LAYOUTS: readonly WordLayout[] = ["INLINE", "ARROW", "TWO_ROW_TABLE", "BOXED_PAIRS"];

function rng(seed: number): () => number {
  let state = (seed ^ 0x9e3779b9) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seed: number): T[] {
  const output = [...items];
  const random = rng(seed);
  for (let index = output.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [output[index], output[target]] = [output[target], output[index]];
  }
  return output;
}

function scoreDifficulty(
  ruleId: AnaCp007RuleId,
  presentationMode: WordPresentationMode,
  sourceWord: string,
  context: WordRuleContext,
): number {
  let score = 1;
  if (presentationMode === "PAIR_SELECTION") score += 1;
  if (sourceWord.length >= 7) score += 1;
  if (ruleId === "WORD_ALPHABET_POSITION_SUM" || ruleId === "WORD_EQUALITY_PATTERN") score += 1;
  if (ruleId === "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT") score += 2;
  if (context.kind === "CLASS_SHIFT" && (Math.abs(context.vowelShift) === 2 || Math.abs(context.consonantShift) === 2)) {
    score += 1;
  }
  return Math.max(1, Math.min(5, score));
}

function difficultyFromScore(score: number): WordDifficulty {
  if (score <= 2) return "EASY";
  if (score === 3) return "MEDIUM";
  return "HARD";
}

function chooseInstance(
  ruleId: AnaCp007RuleId,
  presentationMode: WordPresentationMode,
  seed: number,
): WordInstance {
  const rule = wordRuleById(ruleId);
  const contexts = shuffle(rule.contexts, seed * 31 + 7);
  const words = enabledPilotWords();
  let attempt = 0;

  for (const context of contexts) {
    const eligible = shuffle(
      words.filter((entry) => rule.acceptsWord(entry.word, context)),
      seed * 37 + attempt * 13,
    );
    for (const sourceRecord of eligible) {
      for (const targetRecord of shuffle(eligible, seed * 41 + attempt * 17 + 3)) {
        attempt += 1;
        if (sourceRecord.id === targetRecord.id) continue;
        if (ruleId === "WORD_LENGTH_MINUS_ONE" && sourceRecord.word.length === targetRecord.word.length) continue;

        const sourceOutput = rule.apply(sourceRecord.word, context);
        const targetOutput = rule.apply(targetRecord.word, context);
        if (sourceOutput === null || targetOutput === null) continue;
        if (wordRuleResultKey(sourceOutput) === wordRuleResultKey(targetOutput)) continue;

        const source: WordEvidence = { input: sourceRecord.word, output: sourceOutput };
        const target: WordEvidence = { input: targetRecord.word, output: targetOutput };
        if (!sameWordRuleResult(
          independentlyApplyWordRule(ruleId, context, source.input),
          source.output,
        )) continue;
        if (!sameWordRuleResult(
          independentlyApplyWordRule(ruleId, context, target.input),
          target.output,
        )) continue;
        if (!verifyWordTransfer(ruleId, context, [source, target])) continue;
        if (!checkWordAmbiguity(ruleId, context, [source, target]).accepted) continue;

        const difficultyScore = scoreDifficulty(ruleId, presentationMode, source.input, context);
        return {
          context,
          source,
          target,
          difficultyScore,
          difficulty: difficultyFromScore(difficultyScore),
        };
      }
    }
  }

  throw new Error(`Unable to build an unambiguous ${ruleId} instance for seed ${seed}.`);
}

function classifyRuleTrap(ruleId: AnaCp007RuleId): string {
  switch (ruleId) {
    case "WORD_REMOVE_VOWELS":
    case "WORD_REMOVE_CONSONANTS":
      return "WRONG_LETTER_CLASS";
    case "WORD_POSITION_EXTRACTION":
      return "WRONG_STARTING_POSITION";
    case "WORD_ALPHABET_POSITION_SUM":
    case "WORD_LENGTH_MINUS_ONE":
      return "WRONG_NUMERIC_RULE";
    case "WORD_EQUALITY_PATTERN":
      return "WRONG_EQUALITY_PATTERN";
    case "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT":
      return "WRONG_CLASS_SHIFT";
  }
}

function rotateLeft(value: string): string {
  return value.length > 1 ? value.slice(1) + value[0] : value;
}

function swapFirstTwo(value: string): string {
  if (value.length < 2) return value;
  return value[1] + value[0] + value.slice(2);
}

function patternMutations(value: string): readonly string[] {
  const numbers = value.split("-").map(Number);
  if (numbers.some((number) => !Number.isInteger(number))) return [];
  const lastRaised = [...numbers];
  lastRaised[lastRaised.length - 1] = (lastRaised[lastRaised.length - 1] ?? 0) + 1;
  const swapped = [...numbers];
  if (swapped.length >= 2) [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
  return [
    [...numbers].reverse().join("-"),
    lastRaised.join("-"),
    swapped.join("-"),
    numbers.map((_, index) => index + 1).join("-"),
  ];
}

function genericResultMutations(
  correct: WordRuleResult,
  targetRecord: AnaCp007PilotWordRecord,
  ruleId: AnaCp007RuleId,
): readonly ResultCandidate[] {
  if (typeof correct === "number") {
    const values = [
      correct - 2,
      correct - 1,
      correct + 1,
      correct + 2,
      targetRecord.structure.length,
      targetRecord.structure.length - 1,
      targetRecord.structure.alphabetPositionSum,
      targetRecord.structure.vowels.length,
      targetRecord.structure.consonants.length,
    ];
    return values
      .filter((value) => Number.isSafeInteger(value) && value > 0)
      .map((value) => ({ value, errorLabel: "NEAR_NUMERIC_MISCOUNT" }));
  }

  if (ruleId === "WORD_EQUALITY_PATTERN") {
    return patternMutations(correct).map((value) => ({
      value,
      errorLabel: "WRONG_EQUALITY_PATTERN",
    }));
  }

  const values = [
    [...correct].reverse().join(""),
    rotateLeft(correct),
    swapFirstTwo(correct),
    [...correct].map((letter) => shiftLetter(letter, 1)).join(""),
    [...correct].map((letter) => shiftLetter(letter, -1)).join(""),
    targetRecord.word,
  ];
  return values.map((value) => ({ value, errorLabel: "NEAR_STRING_TRANSFORM" }));
}

function resultCandidatesForTarget(
  intendedRuleId: AnaCp007RuleId,
  intendedContext: WordRuleContext,
  targetRecord: AnaCp007PilotWordRecord,
  correct: WordRuleResult,
  seed: number,
): ResultCandidate[] {
  const candidates: ResultCandidate[] = [];
  const intendedRule = wordRuleById(intendedRuleId);

  for (const context of shuffle(intendedRule.contexts, seed * 43 + 5)) {
    if (JSON.stringify(context) === JSON.stringify(intendedContext)) continue;
    if (!intendedRule.acceptsWord(targetRecord.word, context)) continue;
    const value = intendedRule.apply(targetRecord.word, context);
    if (value !== null && typeof value === typeof correct) {
      candidates.push({ value, errorLabel: "WRONG_RULE_CONTEXT" });
    }
  }

  for (const otherRule of shuffle(ANA_CP007_RULES, seed * 47 + 11)) {
    if (otherRule.id === intendedRuleId) continue;
    for (const context of shuffle(otherRule.contexts, seed + otherRule.priority * 53)) {
      if (!otherRule.acceptsWord(targetRecord.word, context)) continue;
      const value = otherRule.apply(targetRecord.word, context);
      if (value !== null && typeof value === typeof correct) {
        candidates.push({ value, errorLabel: classifyRuleTrap(otherRule.id) });
        break;
      }
    }
  }

  candidates.push(...genericResultMutations(correct, targetRecord, intendedRuleId));
  return candidates;
}

function recordByWord(word: string): AnaCp007PilotWordRecord {
  const record = enabledPilotWords().find((entry) => entry.word === word);
  if (!record) throw new Error(`Missing ANA-CP-007 word record: ${word}`);
  return record;
}

function directCompletionOptions(
  ruleId: AnaCp007RuleId,
  context: WordRuleContext,
  source: WordEvidence,
  target: WordEvidence,
  seed: number,
): WordOption[] {
  const targetRecord = recordByWord(target.input);
  const candidates = resultCandidatesForTarget(ruleId, context, targetRecord, target.output, seed);
  const distractors: WordOption[] = [];

  for (const candidate of candidates) {
    if (sameWordRuleResult(candidate.value, target.output)) continue;
    if (distractors.some((option) => wordOptionKey(option.value) === wordOptionKey(candidate.value))) continue;
    if (hasAnyWordAlternative([source, { input: target.input, output: candidate.value }])) continue;
    distractors.push({ value: candidate.value, errorLabel: candidate.errorLabel });
    if (distractors.length === 3) break;
  }

  if (typeof target.output === "number") {
    for (let offset = 3; distractors.length < 3 && offset < 50; offset += 1) {
      const value = target.output + offset;
      if (hasAnyWordAlternative([source, { input: target.input, output: value }])) continue;
      distractors.push({ value, errorLabel: "DETERMINISTIC_NUMERIC_FALLBACK" });
    }
  } else if (ruleId === "WORD_EQUALITY_PATTERN") {
    for (let offset = 1; distractors.length < 3 && offset < 20; offset += 1) {
      const value = `${target.output}-${offset}`;
      if (hasAnyWordAlternative([source, { input: target.input, output: value }])) continue;
      distractors.push({ value, errorLabel: "DETERMINISTIC_PATTERN_FALLBACK" });
    }
  }

  if (distractors.length !== 3) {
    throw new Error(`${ruleId} could not build three direct distractors for ${target.input}.`);
  }
  return [{ value: target.output, errorLabel: null }, ...distractors];
}

function pairSelectionOptions(
  ruleId: AnaCp007RuleId,
  context: WordRuleContext,
  source: WordEvidence,
  target: WordEvidence,
  seed: number,
): WordOption[] {
  const rule = wordRuleById(ruleId);
  const distractors: WordOption[] = [];
  const words = shuffle(
    enabledPilotWords().filter((entry) => rule.acceptsWord(entry.word, context)),
    seed * 59 + 17,
  );

  for (const record of words) {
    if (record.word === target.input) continue;
    const intendedOutput = rule.apply(record.word, context);
    if (intendedOutput === null) continue;
    const candidates = resultCandidatesForTarget(
      ruleId,
      context,
      record,
      intendedOutput,
      seed + record.word.length * 61,
    );
    for (const candidate of candidates) {
      if (sameWordRuleResult(candidate.value, intendedOutput)) continue;
      const value: WordPairOptionValue = [record.word, candidate.value];
      if (distractors.some((option) => wordOptionKey(option.value) === wordOptionKey(value))) continue;
      if (hasAnyWordAlternative([source, { input: record.word, output: candidate.value }])) continue;
      distractors.push({ value, errorLabel: candidate.errorLabel });
      break;
    }
    if (distractors.length === 3) break;
  }

  if (distractors.length !== 3) {
    throw new Error(`${ruleId} could not build three pair-selection distractors.`);
  }
  return [
    { value: [target.input, target.output] as const, errorLabel: null },
    ...distractors,
  ];
}

function placeCorrectOption(options: readonly WordOption[], desiredIndex: number): WordOption[] {
  const output = [...options];
  const currentIndex = output.findIndex((option) => option.errorLabel === null);
  if (currentIndex < 0) throw new Error("ANA-CP-007 options contain no marked correct answer.");
  const removed = output.splice(currentIndex, 1)[0];
  if (!removed) throw new Error("ANA-CP-007 failed to extract the correct option.");
  output.splice(desiredIndex, 0, removed);
  return output;
}

function displayResult(result: WordRuleResult): string {
  return String(result);
}

function renderCompletionStem(source: WordEvidence, target: WordEvidence, layout: WordLayout): string {
  const sourceResult = displayResult(source.output);
  if (layout === "ARROW") return `${source.input} → ${sourceResult}  ::  ${target.input} → ?`;
  if (layout === "TWO_ROW_TABLE") {
    return `Complete the second row using the same word-structure relationship.\n\n| Pair | Word | Result |\n|---|---|---|\n| A | ${source.input} | ${sourceResult} |\n| B | ${target.input} | ? |`;
  }
  if (layout === "BOXED_PAIRS") return `[ ${source.input} : ${sourceResult} ]  ::  [ ${target.input} : ? ]`;
  return `${source.input} : ${sourceResult} :: ${target.input} : ?`;
}

function renderSelectionStem(source: WordEvidence, layout: WordLayout): string {
  const sourceResult = displayResult(source.output);
  if (layout === "ARROW") return `Select the word-result pair that follows the same rule as ${source.input} → ${sourceResult}.`;
  if (layout === "TWO_ROW_TABLE") return `Select the row that follows the same word-structure relationship as | ${source.input} | ${sourceResult} |.`;
  if (layout === "BOXED_PAIRS") return `Select the box that follows the same rule as [ ${source.input} : ${sourceResult} ].`;
  return `Select the word-result pair that follows the same relationship as ${source.input} : ${sourceResult}.`;
}

function movementText(amount: number): string {
  return `${Math.abs(amount)} place${Math.abs(amount) === 1 ? "" : "s"} ${amount > 0 ? "forward" : "backward"}`;
}

function wrapNote(letter: string, amount: number): string {
  const raw = letterPosition(letter) + amount;
  if (raw >= 1 && raw <= 26) return "";
  const adjusted = raw < 1 ? raw + 26 : raw - 26;
  return ` (the alphabet wraps, so position ${raw} becomes ${adjusted})`;
}

function explainTransformation(
  ruleId: AnaCp007RuleId,
  context: WordRuleContext,
  input: string,
  output: WordRuleResult,
): string {
  const structure = deriveWordStructure(input);
  switch (ruleId) {
    case "WORD_REMOVE_VOWELS":
      return `Start with ${input}. Its vowels are ${structure.vowels.join(", ")}, so remove them. The consonants are ${structure.consonants.join(", ")}; keeping those consonants in their original order gives ${output}.`;
    case "WORD_REMOVE_CONSONANTS":
      return `Start with ${input}. Its consonants are ${structure.consonants.join(", ")}, so remove them. The vowels are ${structure.vowels.join(", ")}; keeping those vowels in their original order gives ${output}.`;
    case "WORD_POSITION_EXTRACTION": {
      if (context.kind !== "POSITION_EXTRACTION") return `${input} becomes ${output}.`;
      const positions = context.parity === "ODD"
        ? structure.vowelPositions.map(() => 0) && Array.from({ length: Math.ceil(input.length / 2) }, (_, index) => index * 2 + 1)
        : Array.from({ length: Math.floor(input.length / 2) }, (_, index) => index * 2 + 2);
      const selected = extractWordPositions(input, context.parity);
      return `Start with ${input}. Take the letters in ${context.parity === "ODD" ? "1st, 3rd, 5th and other odd-numbered" : "2nd, 4th, 6th and other even-numbered"} positions. Positions ${positions.join(", ")} give the letters ${[...selected].join(", ")}, so the result is ${output}.`;
    }
    case "WORD_ALPHABET_POSITION_SUM": {
      const additions = [...input].map((letter) => `${letter}=${letterPosition(letter)}`).join(" + ");
      return `Start with ${input}. Use ordinary alphabet positions: ${additions}. Adding all the values gives ${structure.alphabetPositions.join(" + ")} = ${output}.`;
    }
    case "WORD_LENGTH_MINUS_ONE":
      return `Start with ${input}. It has ${input.length} letters. Subtract 1 from the letter count: ${input.length} − 1 = ${output}.`;
    case "WORD_EQUALITY_PATTERN": {
      const seen = new Map<string, number>();
      let next = 1;
      const trace = [...input].map((letter) => {
        let number = seen.get(letter);
        if (number === undefined) {
          number = next;
          seen.set(letter, number);
          next += 1;
          return `${letter} first appears as ${number}`;
        }
        return `${letter} repeats number ${number}`;
      });
      return `Start with ${input}. Number each new letter by its first appearance and reuse that number when the letter repeats: ${trace.join("; ")}. This gives ${output}.`;
    }
    case "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT": {
      if (context.kind !== "CLASS_SHIFT") return `${input} becomes ${output}.`;
      const outputLetters = String(output);
      const trace = [...input].map((letter, index) => {
        const vowel = ANA_CP007_VOWELS.has(letter as "A" | "E" | "I" | "O" | "U");
        const amount = vowel ? context.vowelShift : context.consonantShift;
        return `${letter} is a ${vowel ? "vowel" : "consonant"} and moves ${movementText(amount)} to ${outputLetters[index]}${wrapNote(letter, amount)}`;
      });
      return `Start with ${input}. Move every vowel ${movementText(context.vowelShift)} and every consonant ${movementText(context.consonantShift)}. ${trace.join("; ")}. Joining the changed letters gives ${output}.`;
    }
  }
}

function trapRejection(errorLabel: string): string {
  const texts: Record<string, string> = {
    WRONG_RULE_CONTEXT: "The nearest wrong option uses the right broad idea but starts from the wrong position or uses different class movements.",
    WRONG_LETTER_CLASS: "The nearest wrong option removes or keeps the wrong letter class, confusing vowels with consonants.",
    WRONG_STARTING_POSITION: "The nearest wrong option starts alternate selection from the other position, so every retained letter is displaced.",
    WRONG_NUMERIC_RULE: "The nearest wrong option uses a nearby count or a different alphabet-value calculation instead of the complete demonstrated rule.",
    WRONG_EQUALITY_PATTERN: "The nearest wrong option fails to reuse the same number at every repeated occurrence of a letter.",
    WRONG_CLASS_SHIFT: "The nearest wrong option reverses the vowel and consonant movements or applies one movement to every letter.",
    NEAR_NUMERIC_MISCOUNT: "The nearest wrong option is produced by an off-by-one or partial count rather than the complete calculation.",
    NEAR_STRING_TRANSFORM: "The nearest wrong option changes the order or one nearby letter but does not preserve the complete source relationship.",
    DETERMINISTIC_NUMERIC_FALLBACK: "The nearest wrong option is a plausible nearby number but cannot be obtained from the demonstrated word rule.",
    DETERMINISTIC_PATTERN_FALLBACK: "The nearest wrong option adds an unsupported pattern position and does not preserve repeated-letter equality.",
  };
  return texts[errorLabel] ?? "The nearest wrong option fails when the complete source rule is checked against every letter or value.";
}

export function generateWordAnalogy(qlId: string, seed = 0): GeneratedWordAnalogy {
  const ql = anaCp007QlById(qlId);
  const rule = wordRuleById(ql.ruleId);
  const layout = LAYOUTS[Math.abs(seed) % LAYOUTS.length];
  const instance = chooseInstance(ql.ruleId, ql.presentationMode, seed);
  const rawOptions = ql.presentationMode === "DIRECT_COMPLETION"
    ? directCompletionOptions(ql.ruleId, instance.context, instance.source, instance.target, seed)
    : pairSelectionOptions(ql.ruleId, instance.context, instance.source, instance.target, seed);

  const qlNumber = Number.parseInt(qlId.slice(-3), 10);
  const desiredCorrectIndex = ((Math.abs(seed) % 4) + (qlNumber % 4)) % 4;
  const options = placeCorrectOption(rawOptions, desiredCorrectIndex);
  const correctIndex = validateWordOptions(
    ql.ruleId,
    instance.context,
    ql.presentationMode,
    instance.source,
    instance.target,
    options,
  );
  const closestDistractor = options.find((option, index) =>
    index !== correctIndex && option.errorLabel !== null,
  )?.errorLabel ?? "NEAR_STRING_TRANSFORM";

  return {
    checkpointId: "ANA-CP-007",
    qlId,
    ruleId: ql.ruleId,
    presentationMode: ql.presentationMode,
    seed,
    difficulty: instance.difficulty,
    difficultyScore: instance.difficultyScore,
    layout,
    context: instance.context,
    source: instance.source,
    target: instance.target,
    stem: ql.presentationMode === "DIRECT_COMPLETION"
      ? renderCompletionStem(instance.source, instance.target, layout)
      : renderSelectionStem(instance.source, layout),
    options,
    correctIndex,
    explanation: {
      ruleStatement: `The relationship is: ${rule.label}.`,
      sourceDemonstration: explainTransformation(
        ql.ruleId,
        instance.context,
        instance.source.input,
        instance.source.output,
      ),
      targetApplication: explainTransformation(
        ql.ruleId,
        instance.context,
        instance.target.input,
        instance.target.output,
      ),
      conclusion: ql.presentationMode === "DIRECT_COMPLETION"
        ? `Therefore, ${displayResult(instance.target.output)} completes the analogy.`
        : `Therefore, ${instance.target.input} : ${displayResult(instance.target.output)} follows the same rule.`,
      closestTrapRejection: trapRejection(closestDistractor),
    },
    metadata: {
      runtimeVersion: "ana-cp-007-v1",
      ambiguityAccepted: true,
      publiclyPublishable: false,
      maturity: "RUNTIME_PROOF",
      wordTokenLanguage: "en",
    },
  };
}
