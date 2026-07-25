import type { CodDifficulty, GeneratedOption } from "../foundation/types";
import { SeededRandom } from "../foundation/prng";
import { validateOptions } from "../foundation/option-validator";
import { joinCodeExamples, maskCodeAt } from "../foundation/editorial";
import { auditRearrangementRule } from "./ambiguity-checker";
import { buildCodCp005Distractors } from "./distractors";
import { buildCodCp005Explanation } from "./explanation-builder";
import { inferPreferredRearrangementRule, intendedRearrangementMatch, solveCodCp005 } from "./independent-solver";
import { getCodCp005QuestionLogic } from "./question-language.en";
import { getCodCp005Rule } from "./rule-definitions";
import { rearrangementIsActive, rearrangementOrder, transformRearrangementWord } from "./transform";
import type { CodCp005QuestionLogic, CodCp005RuleContext, GeneratedCodCp005Question, RearrangementEvidence, RearrangementPrompt } from "./types";
import { COD_CP005_WORD_POOL } from "./word-pool.en";

function chooseContext(logic: CodCp005QuestionLogic, random: SeededRandom): CodCp005RuleContext {
  return random.pick(getCodCp005Rule(logic.ruleId).contextDomain);
}

function enoughDistinctLetters(word: string): boolean {
  return new Set(word).size >= Math.min(4, word.length);
}

function eligibleWord(word: string, logic: CodCp005QuestionLogic, context: CodCp005RuleContext): boolean {
  if (word.length < logic.targetLength[0] || word.length > logic.targetLength[1]) return false;
  if (!enoughDistinctLetters(word)) return false;
  return rearrangementIsActive(logic.ruleId, context, word);
}

function addFirstMatching(output: string[], pool: readonly string[], predicate: (word: string) => boolean): void {
  const found = pool.find((word) => !output.includes(word) && predicate(word));
  if (found) output.push(found);
}

function chooseWords(
  logic: CodCp005QuestionLogic,
  context: CodCp005RuleContext,
  random: SeededRandom,
): { target: string; evidence: string[] } | null {
  const targets = random.shuffle(COD_CP005_WORD_POOL.filter((word) => eligibleWord(word, logic, context)));
  for (const target of targets) {
    const pool = random.shuffle(COD_CP005_WORD_POOL.filter((word) =>
      word !== target
      && word.length >= 4
      && word.length <= 6
      && enoughDistinctLetters(word)
      && rearrangementIsActive(logic.ruleId, context, word),
    ));
    const desired = random.int(logic.exampleCount[0], logic.exampleCount[1]);
    const evidence: string[] = [];

    if (logic.ruleId === "HALF_SWAP") {
      addFirstMatching(evidence, pool, (word) => word.length === 4);
      addFirstMatching(evidence, pool, (word) => word.length === 6);
    } else if (
      logic.ruleId === "CYCLIC_POSITION_ROTATION"
      && (context.amount ?? 1) === 2
    ) {
      addFirstMatching(evidence, pool, (word) => word.length === 5);
      addFirstMatching(evidence, pool, (word) => word.length !== 5);
    } else {
      addFirstMatching(evidence, pool, () => true);
      if (evidence[0]) addFirstMatching(evidence, pool, (word) => word.length !== evidence[0]!.length);
    }

    for (const word of pool) {
      if (!evidence.includes(word)) evidence.push(word);
      if (evidence.length === desired) break;
    }
    if (evidence.length < logic.exampleCount[0]) continue;
    if (logic.ruleId === "HALF_SWAP" && new Set(evidence.map((word) => word.length)).size < 2) continue;
    if (
      logic.ruleId === "CYCLIC_POSITION_ROTATION"
      && (context.amount ?? 1) === 2
      && !evidence.some((word) => word.length === 5)
    ) continue;
    return { target, evidence: evidence.slice(0, desired) };
  }
  return null;
}

function deriveDifficulty(
  logic: CodCp005QuestionLogic,
  prompt: RearrangementPrompt,
  context: CodCp005RuleContext,
): CodDifficulty {
  let burden = 0;
  if (logic.ruleId === "CYCLIC_POSITION_ROTATION" || logic.ruleId === "HALF_SWAP") burden += 1;
  if (["ODD_THEN_EVEN_EXTRACTION", "EVEN_THEN_ODD_EXTRACTION"].includes(logic.ruleId)) burden += 1;
  if (logic.ruleId === "OUTER_INNER_INTERLEAVING") burden += 2;
  if (["DECODE_TARGET", "CHOOSE_MATCHING_CODE"].includes(logic.taskKind)) burden += 1;
  if (["INFER_AND_ENCODE", "RECOVER_MISSING_LETTER"].includes(logic.taskKind)) burden += 2;
  if (prompt.targetWord.length >= 6) burden += 1;
  if (logic.ruleId === "CYCLIC_POSITION_ROTATION" && (context.amount ?? 1) === 2) burden += 1;
  const desired: CodDifficulty = burden >= 4
    ? "HARD"
    : burden >= 3
      ? "MEDIUM"
      : burden <= 1
        ? "EASY"
        : prompt.targetWord.length === 6
          ? "MEDIUM"
          : "EASY";
  return logic.allowedDifficulties.includes(desired) ? desired : logic.allowedDifficulties[0]!;
}

function buildStem(prompt: RearrangementPrompt, style: number): string {
  const examples = joinCodeExamples(prompt.evidence);
  if (prompt.taskKind === "DECODE_TARGET") {
    return [
      `In a certain code, ${examples}. Which word is coded as ‘${prompt.encodedTarget}’?`,
      `If ${examples}, what is the original word for ‘${prompt.encodedTarget}’?`,
      `Study these examples: ${examples}. Decode ‘${prompt.encodedTarget}’.`,
      `The same rearrangement is used here: ${examples}. Which word is represented by ‘${prompt.encodedTarget}’?`,
    ][style]!;
  }
  if (prompt.taskKind === "RECOVER_MISSING_LETTER") {
    return [
      `In a certain code, ${examples}. ‘${prompt.targetWord}’ is written as ‘${prompt.displayedTargetCode}’. Which letter replaces ‘?’?`,
      `If ${examples}, complete ‘${prompt.targetWord}’ → ‘${prompt.displayedTargetCode}’.`,
      `From these examples—${examples}—find the missing letter in ‘${prompt.targetWord}’ → ‘${prompt.displayedTargetCode}’.`,
      `The given examples are: ${examples}. What replaces ‘?’ in ‘${prompt.displayedTargetCode}’, the code for ‘${prompt.targetWord}’?`,
    ][style]!;
  }
  if (prompt.taskKind === "CHOOSE_MATCHING_CODE") {
    return [
      `In a certain code, ${examples}. Which option gives the code for ‘${prompt.targetWord}’?`,
      `If ${examples}, select the correct code for ‘${prompt.targetWord}’.`,
      `Study these examples: ${examples}. Which code matches ‘${prompt.targetWord}’?`,
      `Given that ${examples}, choose the code of ‘${prompt.targetWord}’.`,
    ][style]!;
  }
  return [
    `In a certain code, ${examples}. How will ‘${prompt.targetWord}’ be written?`,
    `If ${examples}, what is the code for ‘${prompt.targetWord}’?`,
    `Given that ${examples}, apply the same letter order to ‘${prompt.targetWord}’.`,
    `Study these examples: ${examples}. Determine the code for ‘${prompt.targetWord}’.`,
  ][style]!;
}

function createCandidate(
  logic: CodCp005QuestionLogic,
  seed: number,
  attempt: number,
): GeneratedCodCp005Question | null {
  const random = new SeededRandom(`${logic.qlId}:${seed}:${attempt}:cod-001-cp005-v1`);
  const context = chooseContext(logic, random);
  const chosen = chooseWords(logic, context, random);
  if (!chosen) return null;

  const evidence: RearrangementEvidence[] = chosen.evidence.map((source) => ({
    source,
    code: transformRearrangementWord(logic.ruleId, context, source),
  }));
  const audit = auditRearrangementRule(logic.ruleId, context, evidence);
  if (!audit.accepted) return null;
  try {
    const inferred = inferPreferredRearrangementRule(evidence);
    if (!intendedRearrangementMatch(inferred, logic.ruleId, context)) return null;
  } catch {
    return null;
  }

  const fullTargetCode = transformRearrangementWord(logic.ruleId, context, chosen.target);
  let encodedTarget: string | undefined;
  let missingIndex: number | undefined;
  let displayedTargetCode: string | undefined;
  if (logic.taskKind === "DECODE_TARGET") encodedTarget = fullTargetCode;
  if (logic.taskKind === "RECOVER_MISSING_LETTER") {
    missingIndex = random.int(0, chosen.target.length - 1);
    displayedTargetCode = maskCodeAt(fullTargetCode, missingIndex);
  }
  const prompt: RearrangementPrompt = {
    taskKind: logic.taskKind,
    evidence,
    targetWord: chosen.target,
    encodedTarget,
    missingIndex,
    displayedTargetCode,
  };

  let answer: string;
  try {
    answer = solveCodCp005(prompt);
  } catch {
    return null;
  }

  let distractors;
  try {
    distractors = buildCodCp005Distractors({
      correct: answer,
      fullTargetCode,
      targetWord: chosen.target,
      taskKind: logic.taskKind,
      ruleId: logic.ruleId,
      context,
      missingIndex,
      seed: `${logic.qlId}:${seed}:${attempt}:options-v1`,
    });
  } catch {
    return null;
  }

  const unshuffled: GeneratedOption[] = [
    { value: answer, isCorrect: true },
    ...distractors.map((item) => ({ value: item.value, isCorrect: false, errorLabel: item.errorLabel })),
  ];
  const options = random.shuffle(unshuffled);
  validateOptions(options);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const styleIndex = new SeededRandom(`${logic.qlId}:${seed}:editorial-v1`).int(0, 3);

  return {
    packageId: "COD-001",
    qlId: logic.qlId,
    checkpointId: "COD-CP-005",
    ruleId: logic.ruleId,
    ruleContext: context,
    seed,
    locale: "en-IN",
    difficulty: deriveDifficulty(logic, prompt, context),
    renderer: logic.renderer,
    answerType: logic.answerType,
    stem: buildStem(prompt, styleIndex),
    structuredPrompt: prompt,
    options,
    correctIndex,
    explanation: buildCodCp005Explanation({
      prompt,
      ruleId: logic.ruleId,
      context,
      fullTargetCode,
      answer,
      options,
    }),
    metadata: {
      runtimeVersion: "cod-001-cp005-v1",
      publiclyPublishable: false,
      maturity: "RUNTIME_PROOF",
      hiddenFingerprint: `${logic.ruleId}:${JSON.stringify(context)}`,
      ambiguityAccepted: audit.accepted,
      matchingRuleCount: audit.matches.length,
      permutationOrder: rearrangementOrder(logic.ruleId, context, chosen.target.length).map((index) => index + 1),
      inverseUnique: true,
    },
  };
}

export function generateCodCp005Question(qlId: string, seed: number): GeneratedCodCp005Question {
  const logic = getCodCp005QuestionLogic(qlId);
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const candidate = createCandidate(logic, seed, attempt);
    if (candidate) return candidate;
  }
  throw new Error(`Unable to generate ambiguity-safe ${qlId} for seed ${seed}`);
}
