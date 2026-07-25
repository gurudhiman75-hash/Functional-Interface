import type { CodDifficulty, GeneratedOption } from "../foundation/types";
import { SeededRandom } from "../foundation/prng";
import { validateOptions } from "../foundation/option-validator";
import { joinCodeExamples, maskCodeAt } from "../foundation/editorial";
import { buildStandardDecodeStem, buildStandardEncodeStem, buildStandardMissingTokenStem } from "../foundation/standard-exam-stem";
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

function deriveDifficulty(logic: CodCp002QuestionLogic): CodDifficulty {
  if (["POSITION_WEIGHTED_SUM", "ODD_EVEN_POSITION_DIFFERENCE"].includes(logic.ruleId)) return "HARD";
  if (logic.outputShape === "SCALAR") return "MEDIUM";
  if (["RANK_PLUS_CONSTANT_SEQUENCE", "RANK_MINUS_CONSTANT_SEQUENCE"].includes(logic.ruleId)) return "MEDIUM";
  if (["RECOVER_MISSING_VALUE", "INFER_AND_ENCODE", "CHOOSE_MATCHING_CODE"].includes(logic.taskKind)) return "MEDIUM";
  return "EASY";
}

function buildStem(prompt: NumericCodingPrompt, style: number): string {
  const examples = joinCodeExamples(prompt.evidence.map((pair) => ({ source: pair.word, code: pair.code })));
  if (prompt.taskKind === "DECODE_TARGET") {
    return buildStandardDecodeStem(examples, prompt.encodedTarget!, style);
  }
  if (prompt.taskKind === "RECOVER_MISSING_VALUE") {
    return buildStandardMissingTokenStem(examples, prompt.targetWord, prompt.displayedTargetCode!, "number", style);
  }
  return buildStandardEncodeStem(examples, prompt.targetWord, style);
}

function fingerprint(ruleId: string, context: object): string {
  return `${ruleId}:${JSON.stringify(context)}`;
}

function createCandidate(logic: CodCp002QuestionLogic, seed: number, attempt: number): GeneratedCodCp002Question | null {
  const random = new SeededRandom(`${logic.qlId}:${seed}:${attempt}:cod-001-cp002-v2`);
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
  let displayedTargetCode: string | undefined;
  if (logic.taskKind === "DECODE_TARGET") encodedTarget = fullTargetCode;
  if (logic.taskKind === "RECOVER_MISSING_VALUE") {
    if (logic.outputShape === "SEQUENCE") {
      missingIndex = random.int(0, fullTargetCode.split("-").length - 1);
      displayedTargetCode = maskCodeAt(fullTargetCode, missingIndex, "-");
    } else {
      displayedTargetCode = "?";
    }
  }
  const prompt: NumericCodingPrompt = {
    taskKind: logic.taskKind,
    outputShape: logic.outputShape,
    evidence,
    targetWord: chosen.target,
    encodedTarget,
    missingIndex,
    displayedTargetCode,
    separator: "-",
  };
  const answer = solveCodCp002(prompt);
  let distractors;
  try {
    distractors = buildCodCp002Distractors({ correct: answer, fullTargetCode, targetWord: chosen.target, taskKind: logic.taskKind, intendedRuleId: logic.ruleId, intendedContext: context, missingIndex, seed: `${logic.qlId}:${seed}:${attempt}:options-v2` });
  } catch {
    return null;
  }
  const unshuffled: GeneratedOption[] = [{ value: answer, isCorrect: true }, ...distractors.map((item) => ({ value: item.value, isCorrect: false, errorLabel: item.errorLabel }))];
  const options = random.shuffle(unshuffled);
  validateOptions(options);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const styleIndex = new SeededRandom(`${logic.qlId}:${seed}:editorial-v2`).int(0, 3);
  return {
    packageId: "COD-001",
    qlId: logic.qlId,
    checkpointId: "COD-CP-002",
    ruleId: logic.ruleId,
    ruleContext: context,
    seed,
    locale: "en-IN",
    difficulty: deriveDifficulty(logic),
    renderer: logic.renderer,
    answerType: logic.answerType,
    stem: buildStem(prompt, styleIndex),
    structuredPrompt: prompt,
    options,
    correctIndex,
    explanation: buildCodCp002Explanation({ prompt, ruleId: logic.ruleId, context, fullTargetCode, answer, styleIndex, options }),
    metadata: {
      runtimeVersion: "cod-001-cp002-v2",
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
