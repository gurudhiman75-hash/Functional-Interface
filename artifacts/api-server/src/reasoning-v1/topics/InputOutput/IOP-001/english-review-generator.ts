import { generateIopEnglishBoxProductionCaselet } from "./english-box-production.ts";
import {
  assertIopEnglishReviewCaseletIntegrity,
  generateIopEnglishReviewCaselet as generateStandardReviewCaselet,
} from "./english-editorial.ts";
import type { IopPermanentQlId } from "./permanent-authorities.ts";
import type { IopEnglishProductionCaselet } from "./english-production-types.ts";

const BOX_MODE = "QL008_BOX_CROSS_MULTIPLY_COMBINE_DIVIDE_DIFFERENCE";

function polishBox(caselet: IopEnglishProductionCaselet, seed: string): IopEnglishProductionCaselet {
  const children = caselet.children.map((child) => {
    const prefix = `${caselet.ruleExplanation} `;
    const explanation = child.explanation.startsWith(prefix) ? child.explanation.slice(prefix.length) : child.explanation;
    return { ...child, explanation };
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
