import { letterFromPosition, shiftLetter } from "../foundation/alphabet";
import { checkClusterAmbiguity } from "./ambiguity-checker";
import {
  independentlyApplyClusterRule,
  matchingClusterRules,
  verifyClusterTransfer,
  type ClusterPair,
} from "./independent-solver";
import {
  validateClusterOptions,
  type ClusterOption,
} from "./option-validator";
import {
  anaCp006QlById,
  type AnaCp006RuleId,
  type ClusterPresentationMode,
} from "./question-language.en";
import {
  ANA_CP006_RULES,
  clusterRuleById,
  type ClusterRuleContext,
} from "./rule-definitions";

export type ClusterDifficulty = "EASY" | "MEDIUM" | "HARD";
export type ClusterLayout = "INLINE" | "ARROW" | "TWO_ROW_TABLE" | "BOXED_PAIRS";

export interface GeneratedClusterAnalogy {
  checkpointId: "ANA-CP-006";
  qlId: string;
  ruleId: AnaCp006RuleId;
  presentationMode: ClusterPresentationMode;
  seed: number;
  difficulty: ClusterDifficulty;
  difficultyScore: number;
  layout: ClusterLayout;
  context: ClusterRuleContext;
  source: ClusterPair;
  target: ClusterPair;
  stem: string;
  options: readonly ClusterOption[];
  correctIndex: number;
  explanation: {
    ruleStatement: string;
    sourceDemonstration: string;
    targetApplication: string;
    conclusion: string;
    closestTrapRejection: string;
  };
  metadata: {
    runtimeVersion: "ana-cp-006-v1";
    ambiguityAccepted: true;
    publiclyPublishable: false;
    maturity: "RUNTIME_PROOF";
  };
}

interface TrapCandidate {
  value: string;
  errorLabel: string;
}

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

function clusterFromSeed(seed: number, length: number): string {
  const alphabet = shuffle(
    Array.from({ length: 26 }, (_, index) => letterFromPosition(index + 1)),
    seed,
  );
  return alphabet.slice(0, length).join("");
}

function desiredDifficulty(seed: number): ClusterDifficulty {
  const bucket = Math.abs(seed) % 20;
  if (bucket < 7) return "EASY";
  if (bucket < 16) return "MEDIUM";
  return "HARD";
}

function scoreDifficulty(
  priority: number,
  presentationMode: ClusterPresentationMode,
  context: ClusterRuleContext,
  source: ClusterPair,
): number {
  let score = priority <= 1 ? 1 : priority <= 3 ? 2 : priority <= 4 ? 3 : 4;
  if (presentationMode === "PAIR_SELECTION") score += 1;
  if (source.left.length >= 6) score += 1;
  if (source.left.length !== source.right.length) score += 1;
  if (context.kind === "TWO_STAGE") score += 1;
  if (context.kind === "POSITION_VECTOR" || context.kind === "ORDERED_POSITION_VECTOR") score += 1;
  return Math.max(1, Math.min(5, score));
}

function difficultyFromScore(score: number): ClusterDifficulty {
  if (score <= 2) return "EASY";
  if (score === 3) return "MEDIUM";
  return "HARD";
}

function sameDesiredBand(actual: ClusterDifficulty, desired: ClusterDifficulty): boolean {
  return actual === desired;
}

function chooseInstance(
  ruleId: AnaCp006RuleId,
  presentationMode: ClusterPresentationMode,
  seed: number,
): {
  context: ClusterRuleContext;
  source: ClusterPair;
  target: ClusterPair;
  difficulty: ClusterDifficulty;
  difficultyScore: number;
} {
  const rule = clusterRuleById(ruleId);
  const desired = desiredDifficulty(seed);
  let fallback: {
    context: ClusterRuleContext;
    source: ClusterPair;
    target: ClusterPair;
    difficulty: ClusterDifficulty;
    difficultyScore: number;
  } | null = null;

  const orderedLengths = shuffle(rule.supportedLengths, seed * 17 + 11);
  let attempt = 0;
  for (const length of orderedLengths) {
    const contexts = shuffle(rule.contextsForLength(length), seed * 19 + length * 101);
    for (const context of contexts) {
      for (let localAttempt = 0; localAttempt < 180; localAttempt += 1) {
        attempt += 1;
        const sourceLeft = clusterFromSeed(seed * 1009 + attempt * 37 + 5, length);
        const targetLeft = clusterFromSeed(seed * 1013 + attempt * 43 + 17, length);
        if (sourceLeft === targetLeft) continue;

        const sourceRight = rule.apply(sourceLeft, context);
        const targetRight = rule.apply(targetLeft, context);
        if (!sourceRight || !targetRight) continue;
        if (sourceRight === targetRight || sourceRight === sourceLeft || targetRight === targetLeft) continue;

        const source = { left: sourceLeft, right: sourceRight };
        const target = { left: targetLeft, right: targetRight };
        if (independentlyApplyClusterRule(ruleId, context, sourceLeft) !== sourceRight) continue;
        if (independentlyApplyClusterRule(ruleId, context, targetLeft) !== targetRight) continue;
        if (!verifyClusterTransfer(ruleId, context, source, target)) continue;
        if (!checkClusterAmbiguity(ruleId, context, [source, target]).accepted) continue;

        const difficultyScore = scoreDifficulty(rule.priority, presentationMode, context, source);
        const difficulty = difficultyFromScore(difficultyScore);
        const candidate = { context, source, target, difficulty, difficultyScore };
        fallback ??= candidate;
        if (sameDesiredBand(difficulty, desired)) return candidate;
      }
    }
  }

  if (fallback) return fallback;
  throw new Error(`Unable to build an unambiguous ${ruleId} instance for seed ${seed}.`);
}

function classifyRuleTrap(ruleId: AnaCp006RuleId): string {
  if (ruleId.includes("ROTATE")) return "WRONG_ROTATION_DIRECTION_OR_COUNT";
  if (ruleId.includes("SHIFT") || ruleId.includes("POSITION_TRANSFORM")) return "WRONG_DIRECTION_OR_SHIFT";
  if (ruleId.includes("OPPOSITE")) return "OPPOSITE_ALPHABET_TRAP";
  if (ruleId.includes("DELETE")) return "WRONG_DELETE_POSITION";
  if (ruleId.includes("INSERT")) return "WRONG_INSERT_POSITION_OR_LETTER";
  if (ruleId.includes("PARITY")) return "PARITY_GROUP_ORDER_REVERSED";
  if (ruleId.includes("BLOCK")) return "WRONG_BLOCK_BOUNDARY";
  if (ruleId.includes("SORT")) return "ALPHABETICAL_DIRECTION_OR_NEAR_SORT";
  return "WRONG_ORDER_OR_PARTIAL_TRANSFORM";
}

function mutateCluster(cluster: string): readonly TrapCandidate[] {
  const letters = [...cluster];
  const candidates: TrapCandidate[] = [];
  if (letters.length >= 2) {
    const firstTwo = [...letters];
    [firstTwo[0], firstTwo[1]] = [firstTwo[1], firstTwo[0]];
    candidates.push({ value: firstTwo.join(""), errorLabel: "NEAR_SORT_OR_POSITION_SWAP" });

    const lastTwo = [...letters];
    const last = lastTwo.length - 1;
    [lastTwo[last - 1], lastTwo[last]] = [lastTwo[last], lastTwo[last - 1]];
    candidates.push({ value: lastTwo.join(""), errorLabel: "ONE_POSITION_SWAP" });
  }
  candidates.push({
    value: [...cluster].map((letter, index) => index === 0 ? shiftLetter(letter, 1) : letter).join(""),
    errorLabel: "ONE_LETTER_OFF_BY_ONE",
  });
  candidates.push({
    value: [...cluster].map((letter, index) => index === cluster.length - 1 ? shiftLetter(letter, -1) : letter).join(""),
    errorLabel: "FINAL_LETTER_OFF_BY_ONE",
  });
  candidates.push({ value: [...cluster].reverse().join(""), errorLabel: "WHOLE_REVERSE_TRAP" });
  return candidates;
}

function trapCandidatesForInput(
  intendedRuleId: AnaCp006RuleId,
  intendedContext: ClusterRuleContext,
  input: string,
  correct: string,
  seed: number,
): TrapCandidate[] {
  const intendedRule = clusterRuleById(intendedRuleId);
  const candidates: TrapCandidate[] = [];

  for (const alternateContext of shuffle(intendedRule.contextsForLength(input.length), seed * 31 + 7)) {
    const value = intendedRule.apply(input, alternateContext);
    if (value && value !== correct) {
      candidates.push({ value, errorLabel: "WRONG_RULE_PARAMETER" });
    }
  }

  for (const otherRule of shuffle(ANA_CP006_RULES, seed * 37 + 13)) {
    if (otherRule.id === intendedRuleId || !otherRule.supportedLengths.includes(input.length)) continue;
    for (const context of shuffle(otherRule.contextsForLength(input.length), seed + otherRule.priority * 41)) {
      const value = otherRule.apply(input, context);
      if (value && value !== correct) {
        candidates.push({ value, errorLabel: classifyRuleTrap(otherRule.id) });
        break;
      }
    }
  }

  candidates.push(...mutateCluster(correct));
  return candidates;
}

function directCompletionOptions(
  ruleId: AnaCp006RuleId,
  context: ClusterRuleContext,
  source: ClusterPair,
  target: ClusterPair,
  seed: number,
): ClusterOption[] {
  const candidates = trapCandidatesForInput(ruleId, context, target.left, target.right, seed);
  const distractors: ClusterOption[] = [];

  for (const candidate of candidates) {
    if (candidate.value === target.right || candidate.value.length !== target.right.length) continue;
    if (distractors.some((option) => option.value === candidate.value)) continue;
    if (matchingClusterRules([source, { left: target.left, right: candidate.value }]).length > 0) continue;
    distractors.push({ value: candidate.value, errorLabel: candidate.errorLabel });
    if (distractors.length === 3) break;
  }

  for (let fallbackAttempt = 0; distractors.length < 3 && fallbackAttempt < 1000; fallbackAttempt += 1) {
    const value = clusterFromSeed(seed * 211 + fallbackAttempt * 53 + 29, target.right.length);
    if (value === target.right || distractors.some((option) => option.value === value)) continue;
    if (matchingClusterRules([source, { left: target.left, right: value }]).length > 0) continue;
    distractors.push({ value, errorLabel: "DETERMINISTIC_FALLBACK_REJECTED_RULE" });
  }

  if (distractors.length !== 3) throw new Error(`${ruleId} could not build three direct distractors.`);
  return [
    { value: target.right, errorLabel: null },
    ...distractors,
  ];
}

function pairSelectionOptions(
  ruleId: AnaCp006RuleId,
  context: ClusterRuleContext,
  source: ClusterPair,
  target: ClusterPair,
  seed: number,
): ClusterOption[] {
  const rule = clusterRuleById(ruleId);
  const distractors: ClusterOption[] = [];
  const inputLength = target.left.length;

  for (let leftAttempt = 0; leftAttempt < 500 && distractors.length < 3; leftAttempt += 1) {
    const left = clusterFromSeed(seed * 307 + leftAttempt * 61 + 31, inputLength);
    const intendedRight = rule.apply(left, context);
    if (!intendedRight || (left === target.left && intendedRight === target.right)) continue;

    const candidates = trapCandidatesForInput(ruleId, context, left, intendedRight, seed + leftAttempt * 17);
    for (const candidate of candidates) {
      if (candidate.value === intendedRight || candidate.value.length !== intendedRight.length) continue;
      const key = `${left}:${candidate.value}`;
      if (distractors.some((option) => Array.isArray(option.value) && `${option.value[0]}:${option.value[1]}` === key)) continue;
      if (matchingClusterRules([source, { left, right: candidate.value }]).length > 0) continue;
      distractors.push({ value: [left, candidate.value] as const, errorLabel: candidate.errorLabel });
      break;
    }
  }

  for (let fallbackAttempt = 0; distractors.length < 3 && fallbackAttempt < 1500; fallbackAttempt += 1) {
    const left = clusterFromSeed(seed * 401 + fallbackAttempt * 67 + 37, inputLength);
    const intendedRight = rule.apply(left, context);
    if (!intendedRight) continue;
    const right = clusterFromSeed(seed * 409 + fallbackAttempt * 71 + 43, intendedRight.length);
    const key = `${left}:${right}`;
    if (right === intendedRight) continue;
    if (distractors.some((option) => Array.isArray(option.value) && `${option.value[0]}:${option.value[1]}` === key)) continue;
    if (matchingClusterRules([source, { left, right }]).length > 0) continue;
    distractors.push({ value: [left, right] as const, errorLabel: "DETERMINISTIC_FALLBACK_REJECTED_RULE" });
  }

  if (distractors.length !== 3) throw new Error(`${ruleId} could not build three pair distractors.`);
  return [
    { value: [target.left, target.right] as const, errorLabel: null },
    ...distractors,
  ];
}

function placeCorrectOption(options: readonly ClusterOption[], desiredIndex: number): ClusterOption[] {
  const output = [...options];
  const currentIndex = output.findIndex((option) => option.errorLabel === null);
  if (currentIndex < 0) throw new Error("ANA-CP-006 options contain no marked correct answer.");
  const [correct] = output.splice(currentIndex, 1);
  output.splice(desiredIndex, 0, correct);
  return output;
}

const LAYOUTS: readonly ClusterLayout[] = ["INLINE", "ARROW", "TWO_ROW_TABLE", "BOXED_PAIRS"];

function renderCompletionStem(source: ClusterPair, target: ClusterPair, layout: ClusterLayout): string {
  if (layout === "ARROW") return `${source.left} → ${source.right}  ::  ${target.left} → ?`;
  if (layout === "TWO_ROW_TABLE") {
    return `Complete the second row using the same letter-cluster relationship.\n\n| Pair | First cluster | Second cluster |\n|---|---|---|\n| A | ${source.left} | ${source.right} |\n| B | ${target.left} | ? |`;
  }
  if (layout === "BOXED_PAIRS") return `[ ${source.left} : ${source.right} ]  ::  [ ${target.left} : ? ]`;
  return `${source.left} : ${source.right} :: ${target.left} : ?`;
}

function renderSelectionStem(source: ClusterPair, layout: ClusterLayout): string {
  if (layout === "ARROW") return `Select the letter-cluster pair that follows the same rule as ${source.left} → ${source.right}.`;
  if (layout === "TWO_ROW_TABLE") return `Select the row that follows the same letter-cluster relationship as | ${source.left} | ${source.right} |.`;
  if (layout === "BOXED_PAIRS") return `Select the box that follows the same rule as [ ${source.left} : ${source.right} ].`;
  return `Select the letter-cluster pair that follows the same relationship as ${source.left} : ${source.right}.`;
}

function trapRejection(errorLabel: string): string {
  const texts: Record<string, string> = {
    WRONG_RULE_PARAMETER: "The nearest wrong option uses the same broad idea with a different shift, rotation count, position or direction.",
    WRONG_ROTATION_DIRECTION_OR_COUNT: "The nearest wrong option rotates the letters in the wrong direction or by the wrong number of places.",
    WRONG_DIRECTION_OR_SHIFT: "The nearest wrong option changes the shift direction or uses a nearby but unequal movement.",
    OPPOSITE_ALPHABET_TRAP: "The nearest wrong option substitutes opposite letters instead of preserving the demonstrated operation.",
    WRONG_DELETE_POSITION: "The nearest wrong option removes a different position from the one established by the source pair.",
    WRONG_INSERT_POSITION_OR_LETTER: "The nearest wrong option either derives the inserted letter incorrectly or places it at the wrong position.",
    PARITY_GROUP_ORDER_REVERSED: "The nearest wrong option reverses the odd/even group order or the direction inside one group.",
    WRONG_BLOCK_BOUNDARY: "The nearest wrong option splits the cluster at a different boundary or changes the letters inside a block.",
    ALPHABETICAL_DIRECTION_OR_NEAR_SORT: "The nearest wrong option sorts in the opposite direction or leaves one neighbouring pair out of order.",
    WRONG_ORDER_OR_PARTIAL_TRANSFORM: "The nearest wrong option changes only part of the demonstrated order or applies another simple rearrangement.",
    NEAR_SORT_OR_POSITION_SWAP: "The nearest wrong option exchanges only one nearby pair instead of completing the full rule.",
    ONE_POSITION_SWAP: "The nearest wrong option changes only one pair of positions.",
    ONE_LETTER_OFF_BY_ONE: "The nearest wrong option differs by one alphabet place at the first transformed position.",
    FINAL_LETTER_OFF_BY_ONE: "The nearest wrong option makes a one-place error at the final transformed position.",
    WHOLE_REVERSE_TRAP: "The nearest wrong option reverses the whole cluster instead of applying the demonstrated relation.",
    DETERMINISTIC_FALLBACK_REJECTED_RULE: "The nearest wrong option does not preserve the source relation when checked position by position.",
  };
  return texts[errorLabel] ?? "The nearest wrong option fails to preserve the complete relationship shown by the source pair.";
}

export function generateClusterAnalogy(qlId: string, seed = 0): GeneratedClusterAnalogy {
  const ql = anaCp006QlById(qlId);
  const rule = clusterRuleById(ql.ruleId);
  const layout = LAYOUTS[Math.abs(seed) % LAYOUTS.length];
  const instance = chooseInstance(ql.ruleId, ql.presentationMode, seed);

  const rawOptions = ql.presentationMode === "DIRECT_COMPLETION"
    ? directCompletionOptions(ql.ruleId, instance.context, instance.source, instance.target, seed)
    : pairSelectionOptions(ql.ruleId, instance.context, instance.source, instance.target, seed);

  const qlNumber = Number.parseInt(qlId.slice(-3), 10);
  const desiredCorrectIndex = ((Math.abs(seed) % 4) + (qlNumber % 4)) % 4;
  const options = placeCorrectOption(rawOptions, desiredCorrectIndex);
  const correctIndex = validateClusterOptions(
    ql.ruleId,
    instance.context,
    ql.presentationMode,
    instance.source,
    instance.target,
    options,
  );
  const closestDistractor = options.find((option, index) => index !== correctIndex && option.errorLabel)?.errorLabel
    ?? "DETERMINISTIC_FALLBACK_REJECTED_RULE";

  return {
    checkpointId: "ANA-CP-006",
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
      sourceDemonstration: rule.explain(instance.source.left, instance.source.right, instance.context),
      targetApplication: rule.explain(instance.target.left, instance.target.right, instance.context),
      conclusion: ql.presentationMode === "DIRECT_COMPLETION"
        ? `Therefore, ${instance.target.right} completes the analogy.`
        : `Therefore, ${instance.target.left} : ${instance.target.right} follows the same rule.`,
      closestTrapRejection: trapRejection(closestDistractor),
    },
    metadata: {
      runtimeVersion: "ana-cp-006-v1",
      ambiguityAccepted: true,
      publiclyPublishable: false,
      maturity: "RUNTIME_PROOF",
    },
  };
}
