import { generateIopEnglishBoxProductionCaselet } from "./english-box-production.ts";
import {
  assertIopEnglishReviewCaseletIntegrity,
  generateIopEnglishReviewCaselet as generateStandardReviewCaselet,
} from "./english-editorial.ts";
import type { IopPermanentQlId } from "./permanent-authorities.ts";
import type {
  IopEnglishChildQuestion,
  IopEnglishOption,
  IopEnglishProductionCaselet,
} from "./english-production-types.ts";

const BOX_MODE = "QL008_BOX_CROSS_MULTIPLY_COMBINE_DIVIDE_DIFFERENCE";

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

function option(display: string, fingerprint: string, isCorrect: boolean, misconception: string): IopEnglishOption {
  return { display, semanticFingerprint: fingerprint, isCorrect, misconception };
}

function tuple(values: readonly IopEnglishOption[]): IopEnglishChildQuestion["options"] {
  if (values.length !== 4) throw new Error("Box editorial options must contain four values");
  return [values[0]!, values[1]!, values[2]!, values[3]!];
}

function withAnswer(child: IopEnglishChildQuestion, options: readonly IopEnglishOption[]): IopEnglishChildQuestion {
  const typed = tuple(options);
  const answerIndex = typed.findIndex((entry) => entry.isCorrect) as 0 | 1 | 2 | 3;
  if (answerIndex < 0) throw new Error("Box editorial options lost the correct answer");
  return { ...child, options: typed, answerIndex };
}

function finalValueOptions(child: IopEnglishChildQuestion, seed: string): IopEnglishChildQuestion {
  const value = Number(child.answerDisplay);
  if (!Number.isFinite(value)) throw new Error("Box final answer is not numeric");
  const displays = [value + 0.1, value + 0.5, value + 1].map((candidate) => candidate.toFixed(2));
  const options = shuffle([
    option(child.answerDisplay, `FINAL:${child.answerDisplay}`, true, "correct"),
    option(displays[0]!, `FINAL:${displays[0]}`, false, "rounding-or-division-slip"),
    option(displays[1]!, `FINAL:${displays[1]}`, false, "arithmetic-slip"),
    option(displays[2]!, `FINAL:${displays[2]}`, false, "final-operation-slip"),
  ], makeRng(seed));
  return withAnswer(child, options);
}

function threeCellOptions(
  caselet: IopEnglishProductionCaselet,
  child: IopEnglishChildQuestion,
  seed: string,
): IopEnglishChildQuestion {
  const correct = caselet.target.steps[1]!;
  if (correct.length !== 3) throw new Error("Box Step-II review state must contain three values");
  const step1 = caselet.target.steps[0]!;
  const reversed = [...correct].reverse();
  const rotated = [...correct.slice(1), correct[0]!];
  const row = (values: readonly string[]) => values.join("  ");
  const options = shuffle([
    option(child.answerDisplay, `STEP2:${correct.join("|")}`, true, "correct"),
    option(row(step1), `STEP1:${step1.join("|")}`, false, "stops-one-stage-early"),
    option(row(reversed), `STEP2:${reversed.join("|")}`, false, "reverses-result-order"),
    option(row(rotated), `STEP2:${rotated.join("|")}`, false, "shifts-result-order"),
  ], makeRng(seed));
  return withAnswer(child, options);
}

function polishBox(caselet: IopEnglishProductionCaselet, seed: string): IopEnglishProductionCaselet {
  const children = caselet.children.map((child, index) => {
    const prefix = `${caselet.ruleExplanation} `;
    const explanation = child.explanation.startsWith(prefix) ? child.explanation.slice(prefix.length) : child.explanation;
    const base = { ...child, explanation };
    if (child.kind === "FINAL_OUTPUT") return finalValueOptions(base, `${seed}|BOX-Q${index + 1}`);
    if (child.kind === "PREVIOUS_STEP" || child.kind === "MISSING_STEP") {
      return threeCellOptions(caselet, base, `${seed}|BOX-Q${index + 1}`);
    }
    return base;
  }) as unknown as IopEnglishProductionCaselet["children"];
  const polished: IopEnglishProductionCaselet = { ...caselet, seed, children };
  assertIopEnglishReviewCaseletIntegrity(polished);
  return polished;
}

export function generateIopEnglishReviewCaselet(
  seed: string,
  qlId: IopPermanentQlId,
  requestedSourceModeId?: string,
): IopEnglishProductionCaselet {
  if (qlId !== "IOP-QL-008") return generateStandardReviewCaselet(seed, qlId, requestedSourceModeId);
  if (requestedSourceModeId && requestedSourceModeId !== BOX_MODE) {
    throw new Error(`${requestedSourceModeId} is not whitelisted for IOP-QL-008`);
  }
  return polishBox(generateIopEnglishBoxProductionCaselet(`${seed}|${BOX_MODE}`), seed);
}

export { assertIopEnglishReviewCaseletIntegrity } from "./english-editorial.ts";
