import type { CodDifficulty, GeneratedOption } from "../foundation/types";
import { SeededRandom } from "../foundation/prng";
import { validateOptions } from "../foundation/option-validator";
import { joinCodeExamples, maskCodeAt } from "../foundation/editorial";
import { auditAlphabetTransformRule } from "./ambiguity-checker";
import { buildCodCp003Distractors } from "./distractors";
import { buildCodCp003Explanation } from "./explanation-builder";
import { inferPreferredAlphabetRule, sameAlphabetContext, solveCodCp003 } from "./independent-solver";
import { transformWord, wordUsesWrap } from "./alphabet";
import { getCodCp003QuestionLogic } from "./question-language.en";
import { COD_CP003_WORD_POOL } from "./word-pool.en";
import type { AlphabetTransformEvidence, AlphabetTransformPrompt, CodCp003QuestionLogic, CodCp003RuleContext, GeneratedCodCp003Question } from "./types";

function chooseContext(logic: CodCp003QuestionLogic, random: SeededRandom): CodCp003RuleContext {
  if (logic.contextMode === "OPPOSITE") return {};
  if (logic.contextMode === "FORWARD") return { shift: random.int(1, 8) };
  if (logic.contextMode === "BACKWARD") return { shift: -random.int(1, 8) };
  return { shift: random.pick([-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8]) };
}

function eligibleWord(word: string, logic: CodCp003QuestionLogic, context: CodCp003RuleContext): boolean {
  if (word.length < logic.targetLength[0] || word.length > logic.targetLength[1]) return false;
  if (logic.requireWrap && logic.ruleId === "UNIFORM_CYCLIC_SHIFT") return wordUsesWrap(word, context.shift ?? 0);
  return true;
}

function chooseWords(logic: CodCp003QuestionLogic, context: CodCp003RuleContext, random: SeededRandom): { target: string; evidence: string[] } | null {
  const targetCandidates = random.shuffle(COD_CP003_WORD_POOL.filter((word) => eligibleWord(word, logic, context)));
  if (targetCandidates.length === 0) return null;
  const target = targetCandidates[0]!;
  const evidencePool = random.shuffle(COD_CP003_WORD_POOL.filter((word) => word !== target && word.length >= 3 && word.length <= 6));
  const desired = random.int(logic.exampleCount[0], logic.exampleCount[1]);
  const evidence: string[] = [];
  const seenLetters = new Set<string>();
  for (const word of evidencePool) {
    const newLetters = [...new Set([...word])].filter((letter) => !seenLetters.has(letter)).length;
    if (evidence.length === 0 || newLetters > 0 || evidence.length < logic.exampleCount[0]) {
      evidence.push(word);
      for (const letter of word) seenLetters.add(letter);
    }
    if (evidence.length === desired) break;
  }
  if (evidence.length < logic.exampleCount[0] || seenLetters.size < 2) return null;
  return { target, evidence };
}

function deriveDifficulty(logic: CodCp003QuestionLogic): CodDifficulty {
  if (
    logic.contextMode === "SIGNED" &&
    ["DECODE_TARGET", "INFER_AND_ENCODE", "CHOOSE_MATCHING_CODE"].includes(logic.taskKind)
  ) return "HARD";
  if (["DECODE_TARGET", "INFER_AND_ENCODE", "RECOVER_MISSING_LETTER", "CHOOSE_MATCHING_CODE"].includes(logic.taskKind)) return "MEDIUM";
  return "EASY";
}

function buildStem(prompt: AlphabetTransformPrompt, style: number): string {
  const examples = joinCodeExamples(prompt.evidence);
  if (prompt.taskKind === "DECODE_TARGET") {
    return [
      `In a certain code, ${examples}. Which word is coded as ‘${prompt.encodedTarget}’?`,
      `If ${examples}, what is the original word for ‘${prompt.encodedTarget}’?`,
      `Study the coding in ${examples}. Decode ‘${prompt.encodedTarget}’.`,
      `The same rule is used in ${examples}. Which word is represented by ‘${prompt.encodedTarget}’?`,
    ][style]!;
  }
  if (prompt.taskKind === "RECOVER_MISSING_LETTER") {
    return [
      `In a certain code, ${examples}. ‘${prompt.targetWord}’ is coded as ‘${prompt.displayedTargetCode}’. Which letter replaces ‘?’?`,
      `If ${examples}, complete the code ‘${prompt.targetWord}’ → ‘${prompt.displayedTargetCode}’.`,
      `Using the same rule as ${examples}, find the missing letter in ‘${prompt.targetWord}’ → ‘${prompt.displayedTargetCode}’.`,
      `The examples ${examples} follow one rule. What should replace ‘?’ in the code ‘${prompt.displayedTargetCode}’ for ‘${prompt.targetWord}’?`,
    ][style]!;
  }
  if (prompt.taskKind === "CHOOSE_MATCHING_CODE") {
    return [
      `In a certain code, ${examples}. Which option gives the code for ‘${prompt.targetWord}’?`,
      `If ${examples}, select the correct code for ‘${prompt.targetWord}’.`,
      `Study the relation in ${examples}. Which code matches ‘${prompt.targetWord}’?`,
      `The same rule is used in ${examples}. Choose the code of ‘${prompt.targetWord}’.`,
    ][style]!;
  }
  return [
    `In a certain code, ${examples}. How will ‘${prompt.targetWord}’ be written?`,
    `If ${examples}, what is the code for ‘${prompt.targetWord}’?`,
    `Using the same rule as ${examples}, find the code of ‘${prompt.targetWord}’.`,
    `Study ${examples} and determine the code for ‘${prompt.targetWord}’.`,
  ][style]!;
}

function createCandidate(logic: CodCp003QuestionLogic, seed: number, attempt: number): GeneratedCodCp003Question | null {
  const random = new SeededRandom(`${logic.qlId}:${seed}:${attempt}:cod-001-cp003-v2`);
  const context = chooseContext(logic, random);
  const chosen = chooseWords(logic, context, random);
  if (!chosen) return null;
  const evidence: AlphabetTransformEvidence[] = chosen.evidence.map((source) => ({
    source,
    code: transformWord(logic.ruleId, context, source),
  }));
  const audit = auditAlphabetTransformRule(logic.ruleId, context, evidence);
  if (!audit.accepted) return null;
  try {
    const inferred = inferPreferredAlphabetRule(evidence);
    if (inferred.ruleId !== logic.ruleId || !sameAlphabetContext(inferred.context, context)) return null;
  } catch {
    return null;
  }

  const fullTargetCode = transformWord(logic.ruleId, context, chosen.target);
  let encodedTarget: string | undefined;
  let missingIndex: number | undefined;
  let displayedTargetCode: string | undefined;
  if (logic.taskKind === "DECODE_TARGET") encodedTarget = fullTargetCode;
  if (logic.taskKind === "RECOVER_MISSING_LETTER") {
    const wrapIndices = logic.ruleId === "UNIFORM_CYCLIC_SHIFT"
      ? [...chosen.target].map((_, index) => index).filter((index) => wordUsesWrap(chosen.target[index]!, context.shift ?? 0))
      : [];
    missingIndex = wrapIndices.length > 0 ? random.pick(wrapIndices) : random.int(0, chosen.target.length - 1);
    displayedTargetCode = maskCodeAt(fullTargetCode, missingIndex);
  }
  const prompt: AlphabetTransformPrompt = {
    taskKind: logic.taskKind,
    evidence,
    targetWord: chosen.target,
    encodedTarget,
    missingIndex,
    displayedTargetCode,
  };
  const answer = solveCodCp003(prompt);
  let distractors;
  try {
    distractors = buildCodCp003Distractors({
      correct: answer,
      fullTargetCode,
      targetWord: chosen.target,
      taskKind: logic.taskKind,
      ruleId: logic.ruleId,
      context,
      missingIndex,
      seed: `${logic.qlId}:${seed}:${attempt}:options-v2`,
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
  const wrapUsed = logic.ruleId === "UNIFORM_CYCLIC_SHIFT" && (
    wordUsesWrap(chosen.target, context.shift ?? 0) || evidence.some((pair) => wordUsesWrap(pair.source, context.shift ?? 0))
  );
  if (logic.requireWrap && !wrapUsed) return null;
  const styleIndex = new SeededRandom(`${logic.qlId}:${seed}:editorial-v2`).int(0, 3);
  return {
    packageId: "COD-001",
    qlId: logic.qlId,
    checkpointId: "COD-CP-003",
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
    explanation: buildCodCp003Explanation({ prompt, ruleId: logic.ruleId, context, fullTargetCode, answer, styleIndex, options }),
    metadata: {
      runtimeVersion: "cod-001-cp003-v2",
      publiclyPublishable: false,
      maturity: "RUNTIME_PROOF",
      hiddenFingerprint: `${logic.ruleId}:${JSON.stringify(context)}`,
      ambiguityAccepted: audit.accepted,
      matchingRuleCount: audit.matches.length,
      wrapUsed,
    },
  };
}

export function generateCodCp003Question(qlId: string, seed: number): GeneratedCodCp003Question {
  const logic = getCodCp003QuestionLogic(qlId);
  for (let attempt = 0; attempt < 150; attempt += 1) {
    const candidate = createCandidate(logic, seed, attempt);
    if (candidate) return candidate;
  }
  throw new Error(`Unable to generate ambiguity-safe ${qlId} for seed ${seed}`);
}
