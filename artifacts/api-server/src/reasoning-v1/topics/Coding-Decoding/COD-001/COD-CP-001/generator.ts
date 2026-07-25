import type { CodDifficulty, DirectMappingPrompt, GeneratedCodQuestion, GeneratedOption, MappingEvidence, MappingTableEntry } from "../foundation/types";
import type { DirectMap } from "../foundation/mapping";
import type { CodCp001QuestionLogic } from "./types";
import { SeededRandom } from "../foundation/prng";
import { encodeWithMapping, evidenceCoversWord, mappingFromEvidence } from "../foundation/mapping";
import { validateOptions } from "../foundation/option-validator";
import { joinCodeExamples } from "../foundation/editorial";
import { getCodCp001QuestionLogic } from "./question-language.en";
import { COD_CP001_WORD_POOL } from "./word-pool.en";
import { auditDirectMapping } from "./ambiguity-checker";
import { solveCodCp001 } from "./independent-solver";
import { buildDistractors } from "./distractors";
import { buildCodCp001Explanation } from "./explanation-builder";

const LETTER_TOKENS = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const DIGIT_TOKENS = [..."0123456789"];
const SYMBOL_TOKENS = ["@", "#", "$", "%", "&", "*", "+", "=", "?", "!"];

function tokenPool(outputKind: CodCp001QuestionLogic["outputKind"]): readonly string[] {
  return outputKind === "LETTER" ? LETTER_TOKENS : outputKind === "DIGIT" ? DIGIT_TOKENS : SYMBOL_TOKENS;
}

function separator(outputKind: CodCp001QuestionLogic["outputKind"]): string {
  return outputKind === "SYMBOL" ? " " : "";
}

function deriveDifficulty(logic: CodCp001QuestionLogic): CodDifficulty {
  if (
    logic.evidenceMode === "OVERLAPPING_EXAMPLES" &&
    logic.taskKind === "INFER_FROM_OVERLAP" &&
    logic.targetLength[1] >= 6
  ) return "HARD";
  if (
    logic.evidenceMode === "OVERLAPPING_EXAMPLES" ||
    logic.taskKind === "DECODE_TARGET" ||
    logic.taskKind === "RECOVER_MISSING_CODE" ||
    logic.outputKind === "SYMBOL"
  ) return "MEDIUM";
  return "EASY";
}

function pickTargetWord(logic: CodCp001QuestionLogic, random: SeededRandom): string {
  const candidates = COD_CP001_WORD_POOL.filter((word) => word.length >= logic.targetLength[0] && word.length <= logic.targetLength[1]);
  return random.pick(candidates);
}

function buildMapping(letters: readonly string[], outputKind: CodCp001QuestionLogic["outputKind"], random: SeededRandom): DirectMap {
  const pool = random.shuffle(tokenPool(outputKind));
  if (pool.length < letters.length) throw new Error("Token pool is too small for injective mapping");
  const mapping: Record<string, string> = {};
  for (let index = 0; index < letters.length; index += 1) mapping[letters[index]!] = pool[index]!;
  return mapping;
}

function chooseEvidenceWords(target: string, logic: CodCp001QuestionLogic, random: SeededRandom): string[] | null {
  const targetLetters = new Set([...target]);
  const candidates = random.shuffle(COD_CP001_WORD_POOL.filter((word) => word !== target && word.length >= 3 && word.length <= 6));
  const selected: string[] = [];
  const covered = new Set<string>();
  const desiredMinimum = logic.exampleCount[0];
  const desiredMaximum = logic.exampleCount[1];

  while (selected.length < desiredMaximum && covered.size < targetLetters.size) {
    let best: string | null = null;
    let bestScore = -1;
    for (const word of candidates) {
      if (selected.includes(word)) continue;
      const relevant = [...new Set([...word].filter((letter) => targetLetters.has(letter)))];
      const newCoverage = relevant.filter((letter) => !covered.has(letter)).length;
      const overlap = selected.length === 0 ? 0 : relevant.filter((letter) => covered.has(letter)).length;
      const extraLetters = new Set([...word].filter((letter) => !targetLetters.has(letter))).size;
      const score = newCoverage * 12 + overlap * 4 - extraLetters * 2 - Math.max(0, word.length - 5);
      if (newCoverage > 0 && score > bestScore) {
        best = word;
        bestScore = score;
      }
    }
    if (!best) break;
    selected.push(best);
    for (const letter of best) if (targetLetters.has(letter)) covered.add(letter);
  }

  if ([...targetLetters].some((letter) => !covered.has(letter))) return null;

  while (selected.length < desiredMinimum) {
    const candidate = candidates.find((word) => {
      if (selected.includes(word)) return false;
      const selectedLetters = new Set(selected.flatMap((item) => [...item]));
      return [...word].some((letter) => selectedLetters.has(letter));
    });
    if (!candidate) return null;
    selected.push(candidate);
  }

  if (logic.evidenceMode === "OVERLAPPING_EXAMPLES") {
    const hasOverlap = selected.some((word, index) => {
      const previous = new Set(selected.slice(0, index).flatMap((item) => [...item]));
      return index > 0 && [...word].some((letter) => previous.has(letter));
    });
    if (!hasOverlap) {
      if (selected.length >= desiredMaximum) return null;
      const selectedLetters = new Set(selected.flatMap((item) => [...item]));
      const bridge = candidates.find((word) => !selected.includes(word) && [...word].some((letter) => selectedLetters.has(letter)));
      if (!bridge) return null;
      selected.push(bridge);
    }
  }

  return selected;
}

function buildStem(prompt: DirectMappingPrompt, styleIndex: number): string {
  const examples = joinCodeExamples(prompt.evidence);
  const style = styleIndex % 4;
  if (prompt.taskKind === "DECODE_TARGET") {
    return [
      `In a certain code, ${examples}. Which word is coded as ‘${prompt.encodedTarget}’?`,
      `If ${examples}, what is the original word for the code ‘${prompt.encodedTarget}’?`,
      `The same letter code applies to these examples: ${examples}. Identify the word represented by ‘${prompt.encodedTarget}’.`,
      `Study these codes: ${examples}. Which word gives the code ‘${prompt.encodedTarget}’?`,
    ][style]!;
  }
  if (prompt.taskKind === "RECOVER_MISSING_CODE") {
    return [
      `In the coding system shown by these examples—${examples}—complete the entry ${prompt.missingSource} → ?.`,
      `Using these examples—${examples}—what should replace the blank in ${prompt.missingSource} → ?`,
      `The table follows these coded examples: ${examples}. Find the missing code for ${prompt.missingSource}.`,
      `Given that ${examples}, determine the table value for ${prompt.missingSource}.`,
    ][style]!;
  }
  if (prompt.taskKind === "INFER_FROM_OVERLAP") {
    return [
      `In a certain code, ${examples}. How will ‘${prompt.target}’ be coded?`,
      `If ${examples}, which option is the correct code for ‘${prompt.target}’?`,
      `Study the common letter codes in these examples: ${examples}. Find the code for ‘${prompt.target}’.`,
      `The same letter keeps the same code in these examples: ${examples}. What is the code of ‘${prompt.target}’?`,
    ][style]!;
  }
  return [
    `In a certain code, ${examples}. How will ‘${prompt.target}’ be coded?`,
    `If ${examples}, what is the code for ‘${prompt.target}’?`,
    `Given that ${examples}, find the code of ‘${prompt.target}’ in the same coding system.`,
    `The coding shown by these examples—${examples}—is also applied to ‘${prompt.target}’. Which option is correct?`,
  ][style]!;
}

function mappingFingerprint(mapping: DirectMap): string {
  return Object.entries(mapping).sort(([left], [right]) => left.localeCompare(right)).map(([source, target]) => `${source}:${target}`).join("|");
}

function createCandidate(logic: CodCp001QuestionLogic, seed: number, attempt: number): GeneratedCodQuestion | null {
  const random = new SeededRandom(`${logic.qlId}:${seed}:${attempt}:cod-001-cp001-v2`);
  const target = pickTargetWord(logic, random);
  const evidenceWords = chooseEvidenceWords(target, logic, random);
  if (!evidenceWords) return null;
  const allLetters = [...new Set([...target, ...evidenceWords.join("")])];
  if (allLetters.length > tokenPool(logic.outputKind).length) return null;
  const mapping = buildMapping(allLetters, logic.outputKind, random);
  const sep = separator(logic.outputKind);
  const evidence: MappingEvidence[] = evidenceWords.map((source) => ({ source, code: encodeWithMapping(source, mapping, sep) }));
  const audit = auditDirectMapping({ mapping, evidence, target, outputKind: logic.outputKind, requireOverlap: logic.evidenceMode === "OVERLAPPING_EXAMPLES" });
  if (!audit.accepted) return null;

  let encodedTarget: string | undefined;
  let missingSource: string | undefined;
  let mappingTable: MappingTableEntry[] | undefined;
  if (logic.taskKind === "DECODE_TARGET") encodedTarget = encodeWithMapping(target, mapping, sep);
  if (logic.taskKind === "RECOVER_MISSING_CODE") {
    missingSource = random.pick([...new Set([...target])]);
    mappingTable = Object.entries(mapping).sort(([left], [right]) => left.localeCompare(right)).map(([source, code]) => ({ source, code: source === missingSource ? null : code }));
  }
  const prompt: DirectMappingPrompt = {
    taskKind: logic.taskKind,
    outputKind: logic.outputKind,
    evidence,
    mappingTable,
    target,
    encodedTarget,
    missingSource,
    separator: sep,
  };
  const answer = solveCodCp001(prompt);
  let distractors;
  try {
    distractors = buildDistractors({ correct: answer, taskKind: logic.taskKind, outputKind: logic.outputKind, separator: sep, seed: `${logic.qlId}:${seed}:${attempt}:options`, tokenPool: tokenPool(logic.outputKind) });
  } catch {
    return null;
  }
  const unshuffled: GeneratedOption[] = [{ value: answer, isCorrect: true }, ...distractors.map((item) => ({ value: item.value, isCorrect: false, errorLabel: item.errorLabel }))];
  const options = random.shuffle(unshuffled);
  validateOptions(options);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const recovered = mappingFromEvidence(evidence, sep);
  const styleIndex = new SeededRandom(`${logic.qlId}:${seed}:editorial-style-v2`).int(0, 3);
  return {
    packageId: "COD-001",
    qlId: logic.qlId,
    checkpointId: "COD-CP-001",
    ruleId: logic.ruleId,
    seed,
    locale: "en-IN",
    difficulty: deriveDifficulty(logic),
    renderer: logic.renderer,
    answerType: logic.answerType,
    stem: buildStem(prompt, styleIndex),
    structuredPrompt: prompt,
    options,
    correctIndex,
    explanation: buildCodCp001Explanation(prompt, recovered, answer, styleIndex, options),
    metadata: {
      runtimeVersion: "cod-001-cp001-v2",
      publiclyPublishable: false,
      maturity: "RUNTIME_PROOF",
      hiddenFingerprint: mappingFingerprint(mapping),
      evidenceCoversTarget: evidenceCoversWord(evidence, target),
      mappingInjective: new Set(Object.values(mapping)).size === Object.values(mapping).length,
      ambiguityAccepted: audit.accepted,
    },
  };
}

export function generateCodCp001Question(qlId: string, seed: number): GeneratedCodQuestion {
  const logic = getCodCp001QuestionLogic(qlId);
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const candidate = createCandidate(logic, seed, attempt);
    if (candidate) return candidate;
  }
  throw new Error(`Unable to generate ambiguity-safe ${qlId} for seed ${seed}`);
}
