import type { MenCp008AnyPrototypeId } from "../../cp008-chapter-audit/compression";
import {
  auditMenCp008Editorial,
  enhanceMenCp008Explanation,
  type MenCp008EditorialInput,
} from "./editorial";
import {
  generateMenCp008PermanentQuestion as generateMenCp008PermanentQuestionBase,
  type MenCp008PermanentQuestion,
} from "./runtime-base";

export type { MenCp008PermanentQuestion } from "./runtime-base";

export function generateMenCp008PermanentQuestion(
  qlId: string,
  seed: string,
  requestedPrototypeId?: MenCp008AnyPrototypeId,
): MenCp008PermanentQuestion {
  const base = generateMenCp008PermanentQuestionBase(qlId, seed, requestedPrototypeId);
  const editorialInput: MenCp008EditorialInput = {
    prototypeId: base.prototypeId,
    solveMode: base.solveMode,
    stem: base.stem,
    piPolicy: base.piPolicy,
    target: base.target,
    unit: base.unit,
    options: base.options,
    explanation: base.explanation,
  };
  const explanation = enhanceMenCp008Explanation(editorialInput);
  const editorialChecks = auditMenCp008Editorial(editorialInput, explanation);
  const validation = {
    valid: base.validation.valid && editorialChecks.every((check) => check.passed),
    checks: [...base.validation.checks, ...editorialChecks],
  };
  return { ...base, explanation, validation };
}
