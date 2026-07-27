import { applyUniformDigitEditorialVariation } from "./uniform-digit-editorial";
import {
  digitSequenceRoundTrip,
  digitSequenceTokens,
  generateUniformDigitPrototypeQuestion as generateRawUniformDigitPrototypeQuestion,
} from "./uniform-digit-generator";
import { applyUniformDigitTaskTeachingPath } from "./uniform-digit-task-editorial";
import type {
  GeneratedUniformDigitPrototypeQuestion,
  UniformDigitPrototypeId,
} from "./uniform-digit-types";

export { digitSequenceRoundTrip, digitSequenceTokens };

export function generateUniformDigitPrototypeQuestion(
  prototypeId: UniformDigitPrototypeId,
  seed: number,
): GeneratedUniformDigitPrototypeQuestion {
  return applyUniformDigitTaskTeachingPath(
    applyUniformDigitEditorialVariation(
      generateRawUniformDigitPrototypeQuestion(prototypeId, seed),
    ),
  );
}
