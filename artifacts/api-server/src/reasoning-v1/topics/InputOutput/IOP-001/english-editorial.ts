import {
  generateIopEnglishProductionCaselet,
  IOP_ENGLISH_SOURCE_MODES,
  recomputeIopEnglishAnswer,
  type IopEnglishSourceModeAuthority,
} from "./english-production.ts";
import type { IopPermanentQlId } from "./permanent-authorities.ts";
import type {
  IopEnglishChildQuestion,
  IopEnglishOption,
  IopEnglishProductionCaselet,
} from "./english-production-types.ts";

function sourceMode(caselet: IopEnglishProductionCaselet): IopEnglishSourceModeAuthority {
  const mode = IOP_ENGLISH_SOURCE_MODES.find((candidate) => candidate.sourceModeId === caselet.sourceModeId);
  if (!mode) throw new Error(`Unknown English source mode ${caselet.sourceModeId}`);
  return mode;
}

function learnerDirections(mode: IopEnglishSourceModeAuthority): string {
  if (mode.engineKind === "BOX_SOURCE") {
    return "An input-output machine performs a fixed sequence of operations on six numbered boxes. Study the complete illustration carefully and apply the same sequence to the new boxes.";
  }
  if (mode.engineKind === "TEXT_RBI_SOURCE") {
    return "A word-processing machine changes and rearranges the given words through a fixed sequence of stages. Study the illustration carefully and apply exactly the same stages to the new input.";
  }
  if (mode.engineKind === "NUMERIC_PARITY_SOURCE") {
    return "A number arrangement machine selects and transforms two numbers in each step. Study how the odd and even numbers are processed, then apply the same rule to the new input.";
  }
  if (mode.engineKind === "MIXED_RBI_SOURCE") {
    return "A word and number arrangement machine changes one word and one number in each step. Study the illustration carefully and apply exactly the same rule to the new input.";
  }

  const wordOnly = mode.sourceModeId.startsWith("QL001_WORD_");
  const numberOnly = mode.sourceModeId === "QL001_NUMBER_ASC_LEFT"
    || mode.sourceModeId === "QL001_NUMBER_DIGIT_SUM_ASC_LEFT"
    || mode.sourceModeId === "QL003_SIMULTANEOUS_001"
    || mode.sourceModeId === "QL004_ALTERNATING_001";
  if (wordOnly) {
    return "A word arrangement machine rearranges the input by a particular rule in each step. Study the illustration carefully and apply the same rule to the new input.";
  }
  if (numberOnly) {
    return "A number arrangement machine rearranges the input by a particular rule in each step. Study the illustration carefully and apply the same rule to the new input.";
  }
  return "A word and number arrangement machine rearranges the input by a particular rule in each step. Study the illustration carefully and apply the same rule to the new input.";
}

function learnerDifficulty(mode: IopEnglishSourceModeAuthority): IopEnglishProductionCaselet["difficulty"] {
  if (mode.qlId === "IOP-QL-001") {
    return mode.engineKind === "ADVANCED_PROTOTYPE" ? "Medium" : "Easy";
  }
  if (["IOP-QL-002", "IOP-QL-003", "IOP-QL-004"].includes(mode.qlId)) return "Medium";
  return "Hard";
}

function naturalStepCount(display: string): string {
  return display === "1 steps" ? "1 step" : display;
}

function polishOption(option: IopEnglishOption): IopEnglishOption {
  return { ...option, display: naturalStepCount(option.display) };
}

function childSpecificExplanation(
  caselet: IopEnglishProductionCaselet,
  child: IopEnglishChildQuestion,
  answerDisplay: string,
): string {
  let explanation = child.explanation;
  const sharedPrefix = `${caselet.ruleExplanation} `;
  if (explanation.startsWith(sharedPrefix)) explanation = explanation.slice(sharedPrefix.length);
  explanation = explanation.replaceAll("1 steps", "1 step");
  if (!explanation.includes(answerDisplay)) explanation = `${explanation} Therefore, the answer is ${answerDisplay}.`;
  return explanation;
}

function polishChild(caselet: IopEnglishProductionCaselet, child: IopEnglishChildQuestion): IopEnglishChildQuestion {
  const answerDisplay = naturalStepCount(child.answerDisplay);
  const options = child.options.map(polishOption) as unknown as IopEnglishChildQuestion["options"];
  return {
    ...child,
    options,
    answerDisplay,
    explanation: childSpecificExplanation(caselet, child, answerDisplay),
  };
}

export function generateIopEnglishReviewCaselet(
  seed: string,
  qlId: IopPermanentQlId,
  requestedSourceModeId?: string,
): IopEnglishProductionCaselet {
  const raw = generateIopEnglishProductionCaselet(seed, qlId, requestedSourceModeId);
  const mode = sourceMode(raw);
  const polished: IopEnglishProductionCaselet = {
    ...raw,
    difficulty: learnerDifficulty(mode),
    directions: learnerDirections(mode),
    children: raw.children.map((child) => polishChild(raw, child)) as unknown as IopEnglishProductionCaselet["children"],
  };
  assertIopEnglishReviewCaseletIntegrity(polished);
  return polished;
}

export function assertIopEnglishReviewCaseletIntegrity(caselet: IopEnglishProductionCaselet): void {
  const mode = sourceMode(caselet);
  if (caselet.children.length !== 4) throw new Error("English review caselet must contain four child questions");
  if (caselet.directions.includes("word and number") && (
    mode.sourceModeId.startsWith("QL001_WORD_")
    || mode.sourceModeId === "QL001_NUMBER_ASC_LEFT"
    || mode.sourceModeId === "QL001_NUMBER_DIGIT_SUM_ASC_LEFT"
    || mode.sourceModeId === "QL003_SIMULTANEOUS_001"
    || mode.sourceModeId === "QL004_ALTERNATING_001"
  )) throw new Error(`${mode.sourceModeId} retained a mismatched generic direction`);

  for (const child of caselet.children) {
    if (child.options.length !== 4 || new Set(child.options.map((option) => option.semanticFingerprint)).size !== 4) {
      throw new Error("English review child has duplicate semantic options");
    }
    if (child.options.filter((option) => option.isCorrect).length !== 1) throw new Error("English review child must have one correct option");
    if (!child.options[child.answerIndex]?.isCorrect || child.options[child.answerIndex]?.display !== child.answerDisplay) {
      throw new Error("English review answer display/index mismatch");
    }
    const recomputed = naturalStepCount(recomputeIopEnglishAnswer(caselet.target, child.evidence));
    if (recomputed !== child.answerDisplay) throw new Error(`English editorial query mismatch for ${child.kind}`);
    if (!child.explanation.includes(child.answerDisplay)) throw new Error(`English editorial explanation is not answer-specific for ${child.kind}`);
    if (child.explanation.startsWith(caselet.ruleExplanation)) throw new Error(`English editorial child repeats the full shared rule for ${child.kind}`);
    if (/\b1 steps\b/.test(child.text) || /\b1 steps\b/.test(child.answerDisplay) || /\b1 steps\b/.test(child.explanation)) {
      throw new Error(`English editorial grammar failure for ${child.kind}`);
    }
  }

  if (
    caselet.lifecycle.englishFreeze
    || caselet.lifecycle.questionStudioDiscoverable
    || caselet.lifecycle.questionBankWritable
    || caselet.lifecycle.testEligible
    || caselet.lifecycle.publiclyPublishable
  ) throw new Error("English editorial review leaked into product lifecycle");
}
