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

function hashSeed(seed: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash || 0x9e3779b9;
}

function makeRng(seed: string): () => number {
  let state = hashSeed(seed);
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0x100000000;
  };
}

function shuffle<T>(values: readonly T[], rng: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(rng() * (index + 1));
    [result[index], result[other]] = [result[other]!, result[index]!];
  }
  return result;
}

function ordinal(value: number): string {
  if (value % 100 >= 11 && value % 100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function sourceMode(caselet: IopEnglishProductionCaselet): IopEnglishSourceModeAuthority {
  const mode = IOP_ENGLISH_SOURCE_MODES.find((candidate) => candidate.sourceModeId === caselet.sourceModeId);
  if (!mode) throw new Error(`Unknown English source mode ${caselet.sourceModeId}`);
  return mode;
}

function desiredSourceMode(qlId: IopPermanentQlId, seed: string, requested?: string): IopEnglishSourceModeAuthority {
  const modes = IOP_ENGLISH_SOURCE_MODES.filter((mode) => mode.qlId === qlId);
  if (modes.length === 0) throw new Error(`${qlId} has no English source mode`);
  if (requested) {
    const exact = modes.find((mode) => mode.sourceModeId === requested);
    if (!exact) throw new Error(`${requested} is not whitelisted for ${qlId}`);
    return exact;
  }
  return modes[hashSeed(`${seed}|MODE`) % modes.length]!;
}

function safeRawCaselet(seed: string, qlId: IopPermanentQlId, mode: IopEnglishSourceModeAuthority): IopEnglishProductionCaselet {
  let lastError: unknown;
  // The lower-level candidate currently rejects its old POSITION_OF_ELEMENT
  // wording before the editorial layer can normalize it. Preserve the strict
  // gate by regenerating the raw query mix, then add a clean position query
  // explicitly below. No rule/trace failure is accepted through this retry.
  for (let attempt = 0; attempt < 64; attempt += 1) {
    try {
      return generateIopEnglishProductionCaselet(`${seed}|RAW|${attempt}`, qlId, mode.sourceModeId);
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`Unable to create a base English caselet for ${mode.sourceModeId}/${seed}: ${String(lastError)}`);
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

function positionQuestion(caselet: IopEnglishProductionCaselet, seed: string): IopEnglishChildQuestion {
  const eligible = caselet.target.steps
    .map((row, index) => ({ row, stepNumber: index + 1 }))
    .filter(({ row }) => row.length >= 4 && new Set(row).size === row.length);
  if (eligible.length === 0) throw new Error(`${caselet.sourceModeId} has no step suitable for a position query`);
  const selected = eligible[hashSeed(`${seed}|STEP`) % eligible.length]!;
  const position = 1 + (hashSeed(`${seed}|POSITION`) % selected.row.length);
  const element = selected.row[position - 1]!;
  const answerDisplay = `${ordinal(position)} from the left`;
  const candidatePositions = Array.from({ length: selected.row.length }, (_, index) => index + 1).filter((value) => value !== position);
  const wrongPositions = shuffle(candidatePositions, makeRng(`${seed}|WRONG`)).slice(0, 3);
  if (wrongPositions.length < 3) throw new Error(`${caselet.sourceModeId} cannot support four position options`);
  const options = shuffle([
    { display: answerDisplay, semanticFingerprint: `POSITION:${position}`, isCorrect: true, misconception: "correct" },
    ...wrongPositions.map((value) => ({
      display: `${ordinal(value)} from the left`,
      semanticFingerprint: `POSITION:${value}`,
      isCorrect: false,
      misconception: "off-by-one-position",
    })),
  ], makeRng(`${seed}|OPTIONS`)) as IopEnglishOption[];
  const typedOptions = [options[0]!, options[1]!, options[2]!, options[3]!] as IopEnglishChildQuestion["options"];
  const answerIndex = typedOptions.findIndex((option) => option.isCorrect) as 0 | 1 | 2 | 3;
  return {
    questionOrder: 4,
    kind: "POSITION_OF_ELEMENT",
    evidence: { kind: "POSITION_OF_ELEMENT", stepNumber: selected.stepNumber, element },
    text: `What is the position of ${element} from the left in Step ${selected.stepNumber}?`,
    options: typedOptions,
    answerIndex,
    answerDisplay,
    explanation: `In Step ${selected.stepNumber}, ${element} is ${answerDisplay}.`,
  };
}

export function generateIopEnglishReviewCaselet(
  seed: string,
  qlId: IopPermanentQlId,
  requestedSourceModeId?: string,
): IopEnglishProductionCaselet {
  const mode = desiredSourceMode(qlId, seed, requestedSourceModeId);
  const raw = safeRawCaselet(seed, qlId, mode);
  let children = raw.children.map((child) => polishChild(raw, child)) as unknown as IopEnglishProductionCaselet["children"];
  if (qlId === "IOP-QL-001" && mode.supportedSolveModes.includes("POSITION_OF_ELEMENT")) {
    children = [children[0], children[1], children[2], positionQuestion(raw, `${seed}|POSITION-QUERY`)] as IopEnglishProductionCaselet["children"];
  }
  const polished: IopEnglishProductionCaselet = {
    ...raw,
    seed,
    difficulty: learnerDifficulty(mode),
    directions: learnerDirections(mode),
    children,
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
    if (!mode.supportedSolveModes.includes(child.kind)) throw new Error(`${child.kind} is not supported by ${mode.sourceModeId}`);
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
