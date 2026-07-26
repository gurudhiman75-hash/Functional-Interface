import type { GeneratedOption } from "../foundation/types";
import { SeededRandom } from "../foundation/prng";
import { validateOptions } from "../foundation/option-validator";
import { joinCodeExamples } from "../foundation/editorial";
import { assessCodDifficulty } from "../foundation/difficulty";
import { enrichCodingExplanation } from "../foundation/pedagogy";
import { buildStandardDecodeStem, buildStandardEncodeStem, buildStandardMissingTokenStem } from "../foundation/standard-exam-stem";
import { isVowel } from "../COD-CP-004/transform";
import { auditCompositeRule } from "./ambiguity-checker";
import { buildCodCp006Distractors } from "./distractors";
import { buildCodCp006Explanation } from "./explanation-builder";
import { inferPreferredCompositeRule, intendedCompositeMatch, solveCodCp006 } from "./independent-solver";
import { getCodCp006QuestionLogic } from "./question-language.en";
import { getCodCp006Rule } from "./rule-definitions";
import {
  codeTokenAt,
  compositeStageResult,
  compositeStagesActive,
  compositeUsesWrap,
  maskCompositeCode,
  inverseCompositeWord,
  transformCompositeWord,
} from "./transform";
import type {
  CodCp006QuestionLogic,
  CodCp006RuleContext,
  CompositeEvidence,
  CompositePrompt,
  GeneratedCodCp006Question,
} from "./types";
import { COD_CP006_WORD_POOL } from "./word-pool.en";

function chooseContext(logic: CodCp006QuestionLogic, random: SeededRandom): CodCp006RuleContext {
  return random.pick(getCodCp006Rule(logic.ruleId).contextDomain);
}

function enoughDistinctLetters(word: string): boolean {
  return new Set(word).size >= Math.min(4, word.length);
}

function bothLetterClasses(word: string): boolean {
  return [...word].some(isVowel) && [...word].some((letter) => !isVowel(letter));
}

function eligibleWord(word: string, logic: CodCp006QuestionLogic, context: CodCp006RuleContext): boolean {
  if (word.length < logic.targetLength[0] || word.length > logic.targetLength[1]) return false;
  if (!enoughDistinctLetters(word)) return false;
  if (["PAIR_SWAP_THEN_ALTERNATING_SHIFT", "HALF_SWAP_THEN_ODD_EVEN_SHIFT"].includes(logic.ruleId) && word.length % 2 !== 0) return false;
  if (logic.ruleId === "ROTATE_THEN_CLASS_SHIFT" && !bothLetterClasses(word)) return false;
  if (logic.ruleId === "TRANSFORM_THEN_RANK_SEQUENCE" && context.transformRuleId === "VOWEL_CONSONANT_CLASS_SHIFT" && !bothLetterClasses(word)) return false;
  if (!compositeStagesActive(logic.ruleId, context, word)) return false;
  if (logic.taskKind === "DECODE_TARGET") {
    try {
      const code = transformCompositeWord(logic.ruleId, context, word);
      if (inverseCompositeWord(logic.ruleId, context, code) !== word) return false;
    } catch {
      return false;
    }
  }
  if (logic.requireWrap && !compositeUsesWrap(logic.ruleId, context, word)) return false;
  return true;
}

function evidenceEligible(word: string, logic: CodCp006QuestionLogic, context: CodCp006RuleContext): boolean {
  const relaxed: CodCp006QuestionLogic = { ...logic, targetLength: [4, 6], requireWrap: false };
  return eligibleWord(word, relaxed, context);
}

function chooseWords(
  logic: CodCp006QuestionLogic,
  context: CodCp006RuleContext,
  random: SeededRandom,
): { target: string; evidence: string[] } | null {
  const targets = random.shuffle(COD_CP006_WORD_POOL.filter((word) => eligibleWord(word, logic, context)));
  for (const target of targets) {
    const pool = random.shuffle(COD_CP006_WORD_POOL.filter((word) => word !== target && evidenceEligible(word, logic, context)));
    const desired = random.int(logic.exampleCount[0], logic.exampleCount[1]);
    const evidence: string[] = [];

    const add = (predicate: (word: string) => boolean) => {
      const found = pool.find((word) => !evidence.includes(word) && predicate(word));
      if (found) evidence.push(found);
    };

    if (logic.ruleId === "HALF_SWAP_THEN_ODD_EVEN_SHIFT") {
      add((word) => word.length === 4);
      add((word) => word.length === 6);
    } else if (logic.ruleId === "PAIR_SWAP_THEN_ALTERNATING_SHIFT") {
      add((word) => word.length === 4);
      add((word) => word.length === 6);
    } else if (logic.requireMixedLengths) {
      add(() => true);
      if (evidence[0]) add((word) => word.length !== evidence[0]!.length);
    } else if (logic.ruleId === "ROTATE_THEN_CLASS_SHIFT") {
      add((word) => bothLetterClasses(word));
      if (evidence[0]) add((word) => word.length !== evidence[0]!.length && bothLetterClasses(word));
    } else {
      add(() => true);
      if (evidence[0]) add((word) => word.length !== evidence[0]!.length);
    }

    for (const word of pool) {
      if (!evidence.includes(word)) evidence.push(word);
      if (evidence.length === desired) break;
    }

    if (evidence.length < logic.exampleCount[0]) continue;
    const selected = evidence.slice(0, desired);
    if (logic.requireMixedLengths && new Set(selected.map((word) => word.length)).size < 2) continue;
    if (logic.ruleId === "HALF_SWAP_THEN_ODD_EVEN_SHIFT" && ![4, 6].every((length) => selected.some((word) => word.length === length))) continue;
    if (logic.ruleId === "PAIR_SWAP_THEN_ALTERNATING_SHIFT" && new Set(selected.map((word) => word.length)).size < 2) continue;
    return { target, evidence: selected };
  }
  return null;
}

function buildStem(prompt: CompositePrompt, style: number, numericMissing: boolean): string {
  const examples = joinCodeExamples(prompt.evidence);
  if (prompt.taskKind === "DECODE_TARGET") {
    return buildStandardDecodeStem(examples, prompt.encodedTarget!, style);
  }
  if (prompt.taskKind === "RECOVER_MISSING_TOKEN") {
    return buildStandardMissingTokenStem(
      examples,
      prompt.targetWord,
      prompt.displayedTargetCode!,
      numericMissing ? "number" : "letter",
      style,
    );
  }
  return buildStandardEncodeStem(examples, prompt.targetWord, style);
}

function createCandidate(
  logic: CodCp006QuestionLogic,
  seed: number,
  attempt: number,
): GeneratedCodCp006Question | null {
  const random = new SeededRandom(`${logic.qlId}:${seed}:${attempt}:cod-001-cp006-v1`);
  const context = chooseContext(logic, random);
  const chosen = chooseWords(logic, context, random);
  if (!chosen) return null;

  const evidence: CompositeEvidence[] = chosen.evidence.map((source) => ({
    source,
    code: transformCompositeWord(logic.ruleId, context, source),
  }));
  const audit = auditCompositeRule(logic.ruleId, context, evidence);
  if (!audit.accepted) return null;
  try {
    const inferred = inferPreferredCompositeRule(evidence);
    if (!intendedCompositeMatch(inferred, logic.ruleId, context)) return null;
  } catch {
    return null;
  }

  const targetStages = compositeStageResult(logic.ruleId, context, chosen.target);
  const fullTargetCode = targetStages.finalCode;
  const separator = logic.ruleId === "TRANSFORM_THEN_RANK_SEQUENCE" ? (context.separator ?? "-") : "";
  let encodedTarget: string | undefined;
  let missingIndex: number | undefined;
  let displayedTargetCode: string | undefined;
  if (logic.taskKind === "DECODE_TARGET") encodedTarget = fullTargetCode;
  if (logic.taskKind === "RECOVER_MISSING_TOKEN") {
    const tokenCount = separator ? fullTargetCode.split(separator).length : fullTargetCode.length;
    missingIndex = random.int(0, tokenCount - 1);
    displayedTargetCode = maskCompositeCode(fullTargetCode, missingIndex, separator);
  }

  const prompt: CompositePrompt = {
    taskKind: logic.taskKind,
    evidence,
    targetWord: chosen.target,
    encodedTarget,
    missingIndex,
    displayedTargetCode,
    separator,
  };

  let answer: string;
  try {
    answer = solveCodCp006(prompt);
  } catch {
    return null;
  }

  let distractors;
  try {
    distractors = buildCodCp006Distractors({
      correct: answer,
      fullTargetCode,
      targetWord: chosen.target,
      taskKind: logic.taskKind,
      ruleId: logic.ruleId,
      context,
      missingIndex,
      separator,
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
  const wrapUsed = compositeUsesWrap(logic.ruleId, context, chosen.target)
    || evidence.some((pair) => compositeUsesWrap(logic.ruleId, context, pair.source));
  if (logic.requireWrap && !wrapUsed) return null;
  const styleIndex = new SeededRandom(`${logic.qlId}:${seed}:editorial-v1`).int(0, 3);
  const ruleDefinition = getCodCp006Rule(logic.ruleId);
  const difficulty = assessCodDifficulty({
    checkpointId: "COD-CP-006",
    ruleId: logic.ruleId,
    taskKind: logic.taskKind,
    targetLength: chosen.target.length,
    evidenceCount: evidence.length,
    options,
    allowedDifficulties: logic.allowedDifficulties,
  }).difficulty;
  const explanation = enrichCodingExplanation(
    buildCodCp006Explanation({
      prompt,
      ruleId: logic.ruleId,
      context,
      fullTargetCode,
      answer,
      styleIndex,
      options,
    }),
    { checkpointId: "COD-CP-006", ruleId: logic.ruleId, taskKind: logic.taskKind },
  );

  return {
    packageId: "COD-001",
    qlId: logic.qlId,
    checkpointId: "COD-CP-006",
    ruleId: logic.ruleId,
    ruleContext: context,
    seed,
    locale: "en-IN",
    difficulty,
    renderer: logic.renderer,
    answerType: logic.answerType,
    stem: buildStem(prompt, styleIndex, logic.ruleId === "TRANSFORM_THEN_RANK_SEQUENCE"),
    structuredPrompt: prompt,
    options,
    correctIndex,
    explanation,
    metadata: {
      runtimeVersion: "cod-001-cp006-v1",
      publiclyPublishable: false,
      maturity: "RUNTIME_PROOF",
      hiddenFingerprint: `${logic.ruleId}:${JSON.stringify(context)}`,
      ambiguityAccepted: audit.accepted,
      matchingRuleCount: audit.matches.length,
      stage1Output: targetStages.stage1,
      stage1Active: true,
      stage2Active: true,
      stageOrderNormalized: ruleDefinition.stageOrderNormalized,
      inverseUnique: true,
      wrapUsed,
    },
  };
}

export function generateCodCp006Question(qlId: string, seed: number): GeneratedCodCp006Question {
  const logic = getCodCp006QuestionLogic(qlId);
  for (let attempt = 0; attempt < 1200; attempt += 1) {
    const candidate = createCandidate(logic, seed, attempt);
    if (candidate) return candidate;
  }
  throw new Error(`Unable to generate ambiguity-safe ${qlId} for seed ${seed}`);
}
