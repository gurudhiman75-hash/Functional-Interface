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
          : applyNumCp005QuestionCorrections(source, result);
  const explanationInput = {
    qlId: source.qlId,
    seed: source.seed,
    stem: corrected.stem,
    hiddenState: corrected.hiddenState ?? source.hiddenState,
    canonicalAnswer: corrected.canonicalAnswer,
    options: corrected.options,
  };
  const initialExplanation = buildNumCp005StudentExplanation(explanationInput);
  const correctedExplanation = applyNumCp005ExplanationCorrections(
    explanationInput,
    initialExplanation,
    corrected.difficulty,
  );

  return {
    ...corrected,
    explanation: enforceNumCp005StudentExplanationPolicy(explanationInput, correctedExplanation),
  };
}

export { normalizeNumCp005OptionSemantic } from "./english-remediation-common";
