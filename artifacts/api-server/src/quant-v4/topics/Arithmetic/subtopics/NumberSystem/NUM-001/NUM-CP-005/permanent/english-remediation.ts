import { ql046, ql048, ql049, ql050, ql051 } from "./english-remediation-046-051";
import { ql047ZeroSafe } from "./english-remediation-047-zero-safe";
import { ql052, ql054 } from "./english-remediation-052-057";
import { ql055RenderSafe } from "./english-remediation-055-render-safe";
import { ql057ParitySafe } from "./english-remediation-057-parity-safe";
import { ql058, ql060, ql061, ql062, ql063 } from "./english-remediation-058-063";
import { ql064, ql067, ql068, ql069 } from "./english-remediation-064-069";
import { ql066RenderSafe } from "./english-remediation-066-render-safe";
import {
  ql053CalculationSafe,
  ql056CalculationSafe,
  ql059CalculationSafe,
} from "./english-remediation-calculation-safe";
import { ql065CalculationSafeFinal } from "./english-remediation-065-calculation-safe";
import { buildNumCp005StudentExplanation } from "./student-friendly-explanations";
import { enforceNumCp005StudentExplanationPolicy } from "./student-explanation-policy";
import {
  applyNumCp005ExplanationCorrections,
  applyNumCp005QuestionCorrections,
} from "./release-review-corrections";
import { applyNumCp005Ql058EdgeSafe } from "./release-review-ql058-edge-safe";
import { applyNumCp005Ql059EdgeSafe } from "./release-review-ql059-edge-safe";
import { applyNumCp005Ql063DifficultySafe } from "./release-review-ql063-difficulty-safe";
import { applyNumCp005Ql065DiversitySafe } from "./release-review-ql065-diversity-safe";
import { applyNumCp005Ql068CorrectnessSafe } from "./release-review-ql068-correctness-safe";
import { applyNumCp005ReleaseReviewRenderingSafety } from "./release-review-rendering-safe";
import { applyNumCp005FinalExplanationSafety } from "./release-review-final-explanation-safe";
import { applyNumCp005FinalExamQuestionCorrections } from "./final-exam-readiness-question-corrections";
import { applyNumCp005FinalExamExplanationCorrections } from "./final-exam-readiness-explanations";
import { applyNumCp005FinalQl066Safe } from "./final-exam-readiness-ql066-safe";
import { applyNumCp005FinalQl054Safe } from "./final-exam-readiness-ql054-safe";
import { applyNumCp005FinalDifficulty } from "./final-exam-readiness-difficulty";
import {
  applyNumCp005FinalQl053Diversity,
  applyNumCp005FinalQl059Diversity,
} from "./final-exam-readiness-direct-diversity";

export function remediateNumCp005English(source) {
  let result;
  switch (source.qlId) {
    case "NUM-QL-046": result = ql046(source); break;
    case "NUM-QL-047": result = ql047ZeroSafe(source); break;
    case "NUM-QL-048": result = ql048(source); break;
    case "NUM-QL-049": result = ql049(source); break;
    case "NUM-QL-050": result = ql050(source); break;
    case "NUM-QL-051": result = ql051(source); break;
    case "NUM-QL-052": result = ql052(source); break;
    case "NUM-QL-053": result = ql053CalculationSafe(source); break;
    case "NUM-QL-054": result = ql054(source); break;
    case "NUM-QL-055": result = ql055RenderSafe(source); break;
    case "NUM-QL-056": result = ql056CalculationSafe(source); break;
    case "NUM-QL-057": result = ql057ParitySafe(source); break;
    case "NUM-QL-058": result = ql058(source); break;
    case "NUM-QL-059": result = ql059CalculationSafe(source); break;
    case "NUM-QL-060": result = ql060(source); break;
    case "NUM-QL-061": result = ql061(source); break;
    case "NUM-QL-062": result = ql062(source); break;
    case "NUM-QL-063": result = ql063(source); break;
    case "NUM-QL-064": result = ql064(source); break;
    case "NUM-QL-065": result = ql065CalculationSafeFinal(source); break;
    case "NUM-QL-066": result = ql066RenderSafe(source); break;
    case "NUM-QL-067": result = ql067(source); break;
    case "NUM-QL-068": result = ql068(source); break;
    case "NUM-QL-069": result = ql069(source); break;
    default: throw new Error(`Unsupported NUM-CP-005 QL: ${source.qlId}`);
  }

  const corrected = source.qlId === "NUM-QL-058"
    ? applyNumCp005Ql058EdgeSafe(source, result)
    : source.qlId === "NUM-QL-059"
      ? applyNumCp005Ql059EdgeSafe(source, result)
      : source.qlId === "NUM-QL-063"
        ? applyNumCp005Ql063DifficultySafe(source, result)
        : source.qlId === "NUM-QL-065"
          ? applyNumCp005Ql065DiversitySafe(source, result)
          : source.qlId === "NUM-QL-068"
            ? applyNumCp005Ql068CorrectnessSafe(source, result)
            : applyNumCp005QuestionCorrections(source, result);
  const finalQuestion = source.qlId === "NUM-QL-053"
    ? applyNumCp005FinalQl053Diversity(source, corrected)
    : source.qlId === "NUM-QL-054"
      ? applyNumCp005FinalQl054Safe(source, corrected)
      : source.qlId === "NUM-QL-059"
        ? applyNumCp005FinalQl059Diversity(source, corrected)
        : source.qlId === "NUM-QL-066"
          ? applyNumCp005FinalQl066Safe(source, corrected)
          : applyNumCp005FinalExamQuestionCorrections(source, corrected);
  const difficultyQuestion = applyNumCp005FinalDifficulty(source, finalQuestion);
  const explanationInput = {
    qlId: source.qlId,
    seed: source.seed,
    stem: difficultyQuestion.stem,
    hiddenState: difficultyQuestion.hiddenState ?? source.hiddenState,
    canonicalAnswer: difficultyQuestion.canonicalAnswer,
    options: difficultyQuestion.options,
  };
  const initialExplanation = buildNumCp005StudentExplanation(explanationInput);
  const correctedExplanation = applyNumCp005ExplanationCorrections(
    explanationInput,
    initialExplanation,
    difficultyQuestion.difficulty,
  );
  const renderingSafeExplanation = applyNumCp005ReleaseReviewRenderingSafety(correctedExplanation);
  const policyCheckedExplanation = enforceNumCp005StudentExplanationPolicy(
    explanationInput,
    renderingSafeExplanation,
  );
  const finalSafetyExplanation = applyNumCp005FinalExplanationSafety(
    explanationInput,
    policyCheckedExplanation,
  );

  return {
    ...difficultyQuestion,
    explanation: applyNumCp005FinalExamExplanationCorrections(
      explanationInput,
      finalSafetyExplanation,
    ),
  };
}

export { normalizeNumCp005OptionSemantic } from "./english-remediation-common";
