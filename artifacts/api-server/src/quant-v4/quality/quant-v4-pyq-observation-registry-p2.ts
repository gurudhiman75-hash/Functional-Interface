import {
  QUANT_V4_ALGEBRA_WAVE1_COUNTABLE_PYQ_OBSERVATIONS,
} from "./quant-v4-pyq-observations-algebra-wave1-p2";
import {
  QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_COUNTABLE_PYQ_OBSERVATIONS,
} from "./quant-v4-pyq-observations-number-system-ssc-wave1-p2";
import {
  isCountablePyqEvidenceKind,
  validatePyqObservationSet,
  type QuantV4PyqExamId,
  type QuantV4PyqObservation,
} from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_PYQ_OBSERVATION_REGISTRY_AUTHORITY =
  "QUANT-V4-PYQ-OBSERVATION-REGISTRY-P2" as const;

export const QUANT_V4_REGISTERED_PYQ_OBSERVATIONS: readonly QuantV4PyqObservation[] = Object.freeze([
  ...QUANT_V4_ALGEBRA_WAVE1_COUNTABLE_PYQ_OBSERVATIONS,
  ...QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_COUNTABLE_PYQ_OBSERVATIONS,
]);

validatePyqObservationSet(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS);

export function listRegisteredCountablePyqObservations(input: {
  readonly packageId?: string;
  readonly examIds?: readonly QuantV4PyqExamId[];
} = {}): readonly QuantV4PyqObservation[] {
  const packageId = String(input.packageId ?? "").trim().toUpperCase();
  const examIds = input.examIds ? new Set(input.examIds) : undefined;
  return Object.freeze(
    QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.filter((observation) => {
      if (!isCountablePyqEvidenceKind(observation.evidenceKind)) return false;
      if (packageId && String(observation.packageId ?? "").trim().toUpperCase() !== packageId) return false;
      if (examIds && !examIds.has(observation.examId)) return false;
      return true;
    }),
  );
}
