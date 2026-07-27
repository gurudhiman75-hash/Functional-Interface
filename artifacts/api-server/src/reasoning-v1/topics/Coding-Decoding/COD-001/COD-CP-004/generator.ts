import type { GeneratedOption } from "../foundation/types";
import { SeededRandom } from "../foundation/prng";
import { validateOptions } from "../foundation/option-validator";
import { joinCodeExamples, maskCodeAt } from "../foundation/editorial";
import { assessCodDifficulty } from "../foundation/difficulty";
import { enrichCodingExplanation } from "../foundation/pedagogy";
import { buildStandardDecodeStem, buildStandardEncodeStem, buildStandardMissingTokenStem } from "../foundation/standard-exam-stem";
import { COD_CP003_WORD_POOL } from "../COD-CP-003/word-pool.en";
import { auditPositionTransformRule } from "./ambiguity-checker";
import { buildCodCp004Distractors } from "./distractors";
import { buildCodCp004Explanation } from "./explanation-builder";
import { inferPreferredPositionRule, samePositionContext, solveCodCp004 } from "./independent-solver";
import { getCodCp004QuestionLogic } from "./question-language.en";
import { getCodCp004Rule } from "./rule-definitions";
import { activatesEveryBranch, positionUsesWrap, transformPositionWord, wordUsesPositionWrap } from "./transform";
import type { CodCp004QuestionLogic, GeneratedCodCp004Question, PositionTransformEvidence, PositionTransformPrompt } from "./types";

function chooseContext(logic: CodCp004QuestionLogic, random: SeededRandom) {
  return random.pick(getCodCp004Rule(logic.ruleId).contextDomain);
}

function eligibleWord(word: string, logic: CodCp004QuestionLogic, context: ReturnType<typeof chooseContext>): boolean {
  if (word.length < logic.targetLength[0] || word.length > logic.targetLength[1]) return false;
  if (!activatesEveryBranch(logic.ruleId, word)) return false;
  if (logic.requireWrap && !wordUsesPositionWrap(logic.ruleId, context, word)) return false;
  return true;
}

function chooseWords(logic: CodCp004QuestionLogic, context: ReturnType<typeof chooseContext>, random: SeededRandom): { target: string; evidence: string[] } | null {
  const targetCandidates = random.shuffle(COD_CP003_WORD_POOL.filter((word) => eligibleWord(word, logic, context)));
  if (targetCandidates.length === 0) return null;
  const target = targetCandidates[0]!;
  const evidencePool = random.shuffle(COD_CP003_WORD_POOL.filter((word) =>
    word !== target &&
    word.length >= 4 &&
    word.length <= 6 &&
    activatesEveryBranch(logic.ruleId, word),
  ));
  const desired = random.int(logic.exampleCount[0], logic.exampleCount[1]);
  const evidence: string[] = [];
  const signatures = new Set<string>();
  for (const word of evidencePool) {
    const signature = logic.ruleId === "VOWEL_CONSONANT_CLASS_SHIFT"
      ? [...word].map((letter) => "AEIOU".includes(letter) ? "V" : "C").join("")
      : `${word.length}:${word[0]}:${word.at(-1)}`;
    if (evidence.length > 0 && signatures.has(signature) && evidence.length >= logic.exampleCount[0]) continue;
    evidence.push(word);
    signatures.add(signature);
    if (evidence.length === desired) break;
  }
  if (evidence.length < logic.exampleCount[0]) return null;
  if (logic.ruleId === "VOWEL_CONSONANT_CLASS_SHIFT" && signatures.size < 2) return null;
  return { target, evidence };
}

function buildStem(prompt: PositionTransformPrompt, style: number): string {
  const examples = joinCodeExamples(prompt.evidence);
  if (prompt.taskKind === "DECODE_TARGET") {
    return buildStandardDecodeStem(examples, prompt.encodedTarget!, style);
  }
  if (prompt.taskKind === "RECOVER_MISSING_LETTER") {
    return buildStandardMissingTokenStem(examples, prompt.targetWord, prompt.displayedTargetCode!, "letter", style);
  }
  return buildStandardEncodeStem(examples, prompt.targetWord, style);
}

function createCandidate(logic: CodCp004QuestionLogic, seed: number, attempt: number): GeneratedCodCp004Question | null {
  const random = new SeededRandom(`${logic.qlId}:${seed}:${attempt}:cod-001-cp004-v2`);
  const context = chooseContext(logic, random);
  const chosen = chooseWords(logic, context, random);
  if (!chosen) return null;
  const evidence: PositionTransformEvidence[] = chosen.evidence.map((source) => ({
    source,
    code: transformPositionWord(logic.ruleId, context, source),
  }));
  const audit = auditPositionTransformRule(logic.ruleId, context, evidence);
  if (!audit.accepted) return null;
  try {
    const inferred = inferPreferredPositionRule(evidence);
    if (inferred.checkpointId !== "COD-CP-004" || inferred.ruleId !== logic.ruleId || !samePositionContext(inferred.context, context)) return null;
  } catch {
    return null;
  }

  const fullTargetCode = transformPositionWord(logic.ruleId, context, chosen.target);
  let encodedTarget: string | undefined;
  let missingIndex: number | undefined;
  let displayedTargetCode: string | undefined;
  if (logic.taskKind === "DECODE_TARGET") encodedTarget = fullTargetCode;
  if (logic.taskKind === "RECOVER_MISSING_LETTER") {
    const wrappedIndices = [...chosen.target].map((_, index) => index).filter((index) => positionUsesWrap(logic.ruleId, context, chosen.target, index));
    missingIndex = wrappedIndices.length > 0 ? random.pick(wrappedIndices) : random.int(0, chosen.target.length - 1);
    displayedTargetCode = maskCodeAt(fullTargetCode, missingIndex);
  }
  const prompt: PositionTransformPrompt = {
    taskKind: logic.taskKind,
    evidence,
    targetWord: chosen.target,
    encodedTarget,
    missingIndex,
    displayedTargetCode,
  };
  let answer: string;
  try {
    answer = solveCodCp004(prompt);
  } catch {
    return null;
  }
  let distractors;
  try {
    distractors = buildCodCp004Distractors({
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
  const wrapUsed = wordUsesPositionWrap(logic.ruleId, context, chosen.target) || evidence.some((pair) => wordUsesPositionWrap(logic.ruleId, context, pair.source));
  if (logic.requireWrap && !wrapUsed) return null;
  const styleIndex = new SeededRandom(`${logic.qlId}:${seed}:editorial-v2`).int(0, 3);
  const difficulty = assessCodDifficulty({
    checkpointId: "COD-CP-004",
    ruleId: logic.ruleId,
    taskKind: logic.taskKind,
    targetLength: chosen.target.length,
    evidenceCount: evidence.length,
    options,
    allowedDifficulties: logic.allowedDifficulties,
  }).difficulty;
  const explanation = enrichCodingExplanation(
    buildCodCp004Explanation({ prompt, ruleId: logic.ruleId, context, fullTargetCode, answer, styleIndex, options }),
    { checkpointId: "COD-CP-004", ruleId: logic.ruleId, taskKind: logic.taskKind },
  );
  return {
    packageId: "COD-001",
    qlId: logic.qlId,
    checkpointId: "COD-CP-004",
    ruleId: logic.ruleId,
    ruleContext: context,
    seed,
    locale: "en-IN",
    difficulty,
    renderer: logic.renderer,
    answerType: logic.answerType,
    stem: buildStem(prompt, styleIndex),
    structuredPrompt: prompt,
    options,
    correctIndex,
    explanation,
    metadata: {
      runtimeVersion: "cod-001-cp004-v2",
      publiclyPublishable: false,
      maturity: "RUNTIME_PROOF",
      hiddenFingerprint: `${logic.ruleId}:${JSON.stringify(context)}`,
      ambiguityAccepted: audit.accepted,
      matchingRuleCount: audit.matches.length,
      wrapUsed,
      branchesActivated: activatesEveryBranch(logic.ruleId, chosen.target) && evidence.every((pair) => activatesEveryBranch(logic.ruleId, pair.source)),
    },
  };
}

export function generateCodCp004Question(qlId: string, seed: number): GeneratedCodCp004Question {
  const logic = getCodCp004QuestionLogic(qlId);
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const candidate = createCandidate(logic, seed, attempt);
    if (candidate) return candidate;
  }
  throw new Error(`Unable to generate ambiguity-safe ${qlId} for seed ${seed}`);
}
