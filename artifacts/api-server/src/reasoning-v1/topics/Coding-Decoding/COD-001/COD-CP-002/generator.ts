import type { CodDifficulty, GeneratedOption } from "../foundation/types";
import { SeededRandom } from "../foundation/prng";
import { validateOptions } from "../foundation/option-validator";
import { COD_CP001_WORD_POOL } from "../COD-CP-001/word-pool.en";
import { auditNumericCodingRule } from "./ambiguity-checker";
import { buildCodCp002Distractors } from "./distractors";
import { buildCodCp002Explanation } from "./explanation-builder";
import { inferPreferredNumericRule, solveCodCp002 } from "./independent-solver";
import { evaluateNumericCode, forwardRank, serializeNumericCode } from "./math";
import { getCodCp002QuestionLogic } from "./question-language.en";
import { getCodCp002Rule } from "./rule-definitions";
import type { CodCp002QuestionLogic, GeneratedCodCp002Question, NumericCodeEvidence, NumericCodingPrompt } from "./types";

function chooseContext(logic: CodCp002QuestionLogic, random: SeededRandom) {
  return random.pick(getCodCp002Rule(logic.ruleId).contextDomain);
}

function safeWord(word: string, logic: CodCp002QuestionLogic, constant?: number): boolean {
  if (word.length < logic.targetLength[0] || word.length > logic.targetLength[1]) return false;
  if (logic.ruleId === "RANK_MINUS_CONSTANT_SEQUENCE") return [...word].every((letter) => forwardRank(letter) > (constant ?? 0));
  return true;
}

function chooseWords(logic: CodCp002QuestionLogic, constant: number | undefined, random: SeededRandom): { target: string; evidence: string[] } | null {
  const candidates = random.shuffle(COD_CP001_WORD_POOL.filter((word) => safeWord(word, logic, constant)));
  if (candidates.length < logic.exampleCount[0] + 1) return null;
  const target = candidates[0]!;
  const evidence: string[] = [];
  const desired = random.int(logic.exampleCount[0], Math.min(logic.exampleCount[1], candidates.length - 1));
  for (const word of candidates.slice(1)) {
    if (word === target || evidence.includes(word)) continue;
    if (logic.outputShape === "SCALAR" && evidence.length > 0 && evidence.every((item) => item.length === word.length)) continue;
    evidence.push(word);
    if (evidence.length === desired) break;
  }
  if (evidence.length < logic.exampleCount[0]) return null;
  if (logic.outputShape === "SCALAR" && new Set(evidence.map((word) => word.length)).size < 2) return null;
  return { target, evidence };
}

function deriveDifficulty(logic: CodCp002QuestionLogic, prompt: NumericCodingPrompt): CodDifficulty {
  let burden = logic.outputShape === "SCALAR" ? 1 : 0;
  if (["RANK_PLUS_CONSTANT_SEQUENCE", "RANK_MINUS_CONSTANT_SEQUENCE"].includes(logic.ruleId)) burden += 2;
  if (prompt.evidence.length >= 3) burden += 1;
  if (prompt.targetWord.length >= 5) burden += 1;
  if (["DECODE_TARGET", "RECOVER_MISSING_VALUE"].includes(prompt.taskKind)) burden += 1;
  if (["INFER_AND_ENCODE", "CHOOSE_MATCHING_CODE"].includes(prompt.taskKind)) burden += 1;
  if (["POSITION_WEIGHTED_SUM", "ODD_EVEN_POSITION_DIFFERENCE"].includes(logic.ruleId)) burden += 2;
  const desired: CodDifficulty = burden >= 4 ? "HARD" : burden >= 2 ? "MEDIUM" : "EASY";
  if (logic.allowedDifficulties.includes(desired)) return desired;
  return logic.allowedDifficulties[0]!;
}

function buildStem(prompt: NumericCodingPrompt, style: number): string {
  const examples = prompt.evidence.map((pair) => `${pair.word} → ${pair.code}`).join(", ");
  if (prompt.taskKind === "DECODE_TARGET") return [
    `In a certain code, ${examples}. Using the same rule, which word is represented by ${prompt.encodedTarget}?`,
    `The examples ${examples} follow one alphabet-number rule. Decode ${prompt.encodedTarget}.`,
    `Observe ${examples}. What word gives the code ${prompt.encodedTarget}?`,
    `Apply the inverse of the rule shown by ${examples} to ${prompt.encodedTarget}.`,
  ][style]!;
  if (prompt.taskKind === "RECOVER_MISSING_VALUE") return [
    `The examples ${examples} use one numerical coding rule. Which value completes the code of ${prompt.targetWord}?`,
    `Infer the rule from ${examples}, then fill the blank in the code of ${prompt.targetWord}.`,
    `Using the pattern established by ${examples}, determine the missing numerical entry for ${prompt.targetWord}.`,
    `Complete the coded value of ${prompt.targetWord} from the rule visible in ${examples}.`,
  ][style]!;
  return [
    `In a certain code, ${examples}. How will ${prompt.targetWord} be coded?`,
    `The examples ${examples} follow one rank-based rule. Find the code for ${prompt.targetWord}.`,
    `Infer the numerical coding method from ${examples} and apply it to ${prompt.targetWord}.`,
    `Using the same alphabet-number relation shown in ${examples}, code ${prompt.targetWord}.`,
  ][style]!;
}

function fingerprint(ruleId: string, context: object): string {
  return `${ruleId}:${JSON.stringify(context)}`;
}

function createCandidate(logic: CodCp002QuestionLogic, seed: number, attempt: number): GeneratedCodCp002Question | null {
  const random = new SeededRandom(`${logic.qlId}:${seed}:${attempt}:cod-001-cp002-v1`);
  const context = chooseContext(logic, random);
  const chosen = chooseWords(logic, context.constant, random);
  if (!chosen) return null;
  const evidence: NumericCodeEvidence[] = chosen.evidence.map((word) => ({ word, code: serializeNumericCode(evaluateNumericCode(logic.ruleId, context, word)) }));
  if (logic.outputShape === "SCALAR" && evidence.some((pair) => pair.code === "0")) return null;
  const audit = auditNumericCodingRule(logic.ruleId, context, evidence);
  if (!audit.accepted) return null;
  try {
    const inferred = inferPreferredNumericRule(evidence);
    if (inferred.ruleId !== logic.ruleId || JSON.stringify(inferred.context) !== JSON.stringify(context)) return null;
  } catch {
    return null;
  }

  const fullTargetCode = serializeNumericCode(evaluateNumericCode(logic.ruleId, context, chosen.target));
  if (logic.outputShape === "SCALAR" && fullTargetCode === "0") return null;
  let encodedTarget: string | undefined;
  let missingIndex: number | undefined;
  if (logic.taskKind === "DECODE_TARGET") encodedTarget = fullTargetCode;
  if (logic.taskKind === "RECOVER_MISSING_VALUE" && logic.outputShape === "SEQUENCE") {
    missingIndex = random.int(0, fullTargetCode.split("-").length - 1);
  }
  const prompt: NumericCodingPrompt = {
    taskKind: logic.taskKind,
    outputShape: logic.outputShape,
    evidence,
    targetWord: chosen.target,
    encodedTarget,
    missingIndex,
    separator: "-",
  };
  const answer = solveCodCp002(prompt);
  let distractors;
  try {
    distractors = buildCodCp002Distractors({ correct: answer, fullTargetCode, targetWord: chosen.target, taskKind: logic.taskKind, intendedRuleId: logic.ruleId, intendedContext: context, missingIndex, seed: `${logic.qlId}:${seed}:${attempt}:options` });
  } catch {
    return null;
  }
  const unshuffled: GeneratedOption[] = [{ value: answer, isCorrect: true }, ...distractors.map((item) => ({ value: item.value, isCorrect: false, errorLabel: item.errorLabel }))];
  const options = random.shuffle(unshuffled);
  validateOptions(options);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const styleIndex = new SeededRandom(`${logic.qlId}:${seed}:editorial`).int(0, 3);
  return {
    packageId: "COD-001",
    qlId: logic.qlId,
    checkpointId: "COD-CP-002",
    ruleId: logic.ruleId,
    ruleContext: context,
    seed,
    locale: "en-IN",
    difficulty: deriveDifficulty(logic, prompt),
    renderer: logic.renderer,
    answerType: logic.answerType,
    stem: buildStem(prompt, styleIndex),
    structuredPrompt: prompt,
    options,
    correctIndex,
    explanation: buildCodCp002Explanation({ prompt, ruleId: logic.ruleId, context, fullTargetCode, answer, styleIndex }),
    metadata: {
      runtimeVersion: "cod-001-cp002-v1",
      publiclyPublishable: false,
      maturity: "RUNTIME_PROOF",
      hiddenFingerprint: fingerprint(logic.ruleId, context),
      ambiguityAccepted: audit.accepted,
      matchingRuleCount: audit.matches.length,
    },
  };
}

export function generateCodCp002Question(qlId: string, seed: number): GeneratedCodCp002Question {
  const logic = getCodCp002QuestionLogic(qlId);
  for (let attempt = 0; attempt < 150; attempt += 1) {
    const candidate = createCandidate(logic, seed, attempt);
    if (candidate) return candidate;
  }
  throw new Error(`Unable to generate ambiguity-safe ${qlId} for seed ${seed}`);
}
