import { generateIopEnglishBoxProductionCaselet } from "./english-box-production.ts";
import { withBalancedIopEnglishQueries } from "./english-balanced-queries.ts";
import {
  assertIopEnglishReviewCaseletIntegrity,
  generateIopEnglishReviewCaselet as generateStandardReviewCaselet,
} from "./english-editorial.ts";
import type { IopPermanentQlId } from "./permanent-authorities.ts";
import type { IopEnglishProductionCaselet } from "./english-production-types.ts";

const BOX_MODE = "QL008_BOX_CROSS_MULTIPLY_COMBINE_DIVIDE_DIFFERENCE";

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function boxTraceIsDisplayCoherent(trace: IopEnglishProductionCaselet["target"]): boolean {
  if (trace.steps.length !== 4 || trace.steps[2]?.length !== 2 || trace.steps[3]?.length !== 1) return false;
  const first = Number(trace.steps[2]![0]);
  const second = Number(trace.steps[2]![1]);
  const finalValue = Number(trace.steps[3]![0]);
  if (![first, second, finalValue].every(Number.isFinite)) return false;
  return round2(Math.abs(first - second)) === round2(finalValue);
}

function coherentBoxCaselet(seed: string): IopEnglishProductionCaselet {
  for (let attempt = 0; attempt < 64; attempt += 1) {
    const candidate = generateIopEnglishBoxProductionCaselet(`${seed}|${BOX_MODE}|DISPLAY|${attempt}`);
    if (boxTraceIsDisplayCoherent(candidate.demonstration) && boxTraceIsDisplayCoherent(candidate.target)) return candidate;
  }
  throw new Error(`Unable to construct a display-coherent IOP box caselet for ${seed}`);
}

function removeRepeatedRule(caselet: IopEnglishProductionCaselet): IopEnglishProductionCaselet {
  const children = caselet.children.map((child) => {
    const prefix = `${caselet.ruleExplanation} `;
    return {
      ...child,
      explanation: child.explanation.startsWith(prefix) ? child.explanation.slice(prefix.length) : child.explanation,
    };
  }) as unknown as IopEnglishProductionCaselet["children"];
  return { ...caselet, children };
}

function standardCaselet(seed: string, qlId: IopPermanentQlId, requestedSourceModeId?: string): IopEnglishProductionCaselet {
  return generateStandardReviewCaselet(seed, qlId, requestedSourceModeId);
}

export function generateIopEnglishReviewCaselet(
  seed: string,
  qlId: IopPermanentQlId,
  requestedSourceModeId?: string,
): IopEnglishProductionCaselet {
  let base: IopEnglishProductionCaselet;
  if (qlId === "IOP-QL-008") {
    if (requestedSourceModeId && requestedSourceModeId !== BOX_MODE) {
      throw new Error(`${requestedSourceModeId} is not whitelisted for IOP-QL-008`);
    }
    base = removeRepeatedRule(coherentBoxCaselet(seed));
    base = { ...base, seed };
  } else {
    base = standardCaselet(seed, qlId, requestedSourceModeId);
  }

  const balanced = withBalancedIopEnglishQueries(base, seed);
  assertIopEnglishReviewCaseletIntegrity(balanced);
  return balanced;
}

export { assertIopEnglishReviewCaseletIntegrity } from "./english-editorial.ts";
