import type { ClockTaskId } from "./runtime/catalog";
import {
  CLK_001_PERMANENT_CONTRACTS,
  type ClockPermanentQlId,
} from "./permanent-contracts";

export const CLK_001_LOCALIZED_VARIANT_BATCH_1 = [
  "HAND_MINUTE_ROTATION",
  "HAND_SECOND_ROTATION",
  "HAND_DURATION_FROM_ANGLE",
  "TOTAL_STRIKES_12_HOURS",
  "ACTUAL_FROM_MIRROR",
  "SELECT_DIAGRAM_FOR_TIME",
] as const satisfies readonly ClockTaskId[];

export const CLK_001_LOCALIZED_VARIANT_BATCH_2 = [
  "REFLEX_ANGLE_AT_TIME",
  "OPPOSITION_IN_HOUR",
  "RIGHT_ANGLE_TIMES_IN_HOUR",
  "COUNT_OPPOSITIONS",
  "COUNT_RIGHT_ANGLES",
  "ACTUAL_FROM_DISPLAYED_ELAPSED",
  "ACTUAL_DURATION_FROM_READING_CHANGE",
  "LOSS_FROM_COINCIDENCE_INTERVAL",
  "GAP_FROM_N_STRIKES",
  "IDENTIFY_SMALLER_REFLEX_FROM_DIAGRAM",
] as const satisfies readonly ClockTaskId[];

export const CLK_001_LOCALIZED_VARIANT_BATCH_3 = [
  "HAND_REVOLUTIONS",
  "DIRECTED_CLOCKWISE_SEPARATION",
  "ANGLE_AT_TIME_WITH_SECONDS",
  "ALL_TIMES_FOR_ANGLE_IN_HOUR",
  "COUNT_SOLUTIONS_IN_HOUR",
  "CLASSIFY_FAST_SLOW",
  "CONVERT_GAIN_LOSS_RATE",
  "MULTIDAY_DISPLAY_FROM_ACTUAL",
  "COINCIDENCE_INTERVAL_FROM_RATE",
  "TRANSFER_STRIKE_COUNT",
  "STRIKES_IN_DURATION",
  "TOTAL_STRIKES_INCLUSIVE_RANGE",
  "MIRROR_AROUND_12_BOUNDARY",
  "ACTUAL_FROM_TEXTUAL_MIRROR",
  "MIRROR_BOUNDARY_CASES",
] as const satisfies readonly ClockTaskId[];


export const CLK_001_LOCALIZED_VARIANT_BATCH_4 = [
  "COMPARE_HAND_MOTION",
  "ANGLE_AFTER_BEFORE_SHIFT",
  "COMPARE_ANGLES_AT_TWO_TIMES",
  "FIRST_TIME_AFTER_ANCHOR_FOR_ANGLE",
  "NEXT_PREVIOUS_ANGLE_EVENT",
  "EXACT_FRACTIONAL_MINUTE_EVENT",
  "ROUNDED_ANGLE_EVENT",
  "STRAIGHT_LINE_EVENT",
  "CLASSIFY_EVENT_FROM_TIME",
  "COUNT_STRAIGHT_LINE",
  "COUNT_ARBITRARY_ANGLE",
  "COUNT_PARTIAL_INTERVAL",
  "ELAPSED_FOR_EVENT_COUNT",
  "COUNT_WITH_ENDPOINTS",
  "COMPARE_EVENT_FREQUENCIES",
  "INITIAL_OFFSET_AND_WRONG_RATE",
  "DERIVE_SET_RIGHT_TIME",
  "TIME_WHEN_ERROR_REACHES_TARGET",
  "GAINING_AND_LOSING_EQUALITY",
  "MISSING_GAIN_LOSS_FROM_FINAL",
  "CLASSIFY_FROM_EVENT_INTERVAL",
  "FIRST_LAST_INCLUSION",
  "COMPARE_STRIKING_SPEEDS",
  "OFFSET_PLUS_RATE_CORRECTION",
] as const satisfies readonly ClockTaskId[];

const localizedBatch = new Set<ClockTaskId>([
  ...CLK_001_LOCALIZED_VARIANT_BATCH_1,
  ...CLK_001_LOCALIZED_VARIANT_BATCH_2,
  ...CLK_001_LOCALIZED_VARIANT_BATCH_3,
  ...CLK_001_LOCALIZED_VARIANT_BATCH_4,
]);

export const CLK_001_AUTHORING_TASKS_BY_QL_V1 = Object.freeze(Object.fromEntries(
  CLK_001_PERMANENT_CONTRACTS.map((contract) => {
    const tasks = contract.ownedTaskIds.filter(
      (taskId) => taskId === contract.anchorTaskId || localizedBatch.has(taskId),
    );
    return [contract.qlId, Object.freeze(tasks)];
  }),
) as Record<ClockPermanentQlId, readonly ClockTaskId[]>);

export function clk001AuthoringTasksForQlV1(qlId: ClockPermanentQlId): readonly ClockTaskId[] {
  return CLK_001_AUTHORING_TASKS_BY_QL_V1[qlId];
}

export function selectClk001AuthoringTaskV1(
  qlId: ClockPermanentQlId,
  selector: number,
): ClockTaskId {
  const tasks = clk001AuthoringTasksForQlV1(qlId);
  if (!tasks.length) throw new Error("CLK-001 QL has no authoring task: " + qlId);
  return tasks[Math.abs(selector) % tasks.length]!;
}

export const CLK_001_AUTHORING_VARIANT_AUTHORITY_V1 = Object.freeze({
  authorityId: "CLK_001_AUTHORING_VARIANT_AUTHORITY_V1",
  status: "FULL_MERGED_VARIANT_SATURATION",
  permanentQlCount: CLK_001_PERMANENT_CONTRACTS.length,
  batch1VariantTaskIds: CLK_001_LOCALIZED_VARIANT_BATCH_1,
  batch2VariantTaskIds: CLK_001_LOCALIZED_VARIANT_BATCH_2,
  batch3VariantTaskIds: CLK_001_LOCALIZED_VARIANT_BATCH_3,
  batch4VariantTaskIds: CLK_001_LOCALIZED_VARIANT_BATCH_4,
  enabledMergedVariantCount:
    CLK_001_LOCALIZED_VARIANT_BATCH_1.length +
    CLK_001_LOCALIZED_VARIANT_BATCH_2.length +
    CLK_001_LOCALIZED_VARIANT_BATCH_3.length +
    CLK_001_LOCALIZED_VARIANT_BATCH_4.length,
  enabledMergedVariantTaskIds: Object.freeze([
    ...CLK_001_LOCALIZED_VARIANT_BATCH_1,
    ...CLK_001_LOCALIZED_VARIANT_BATCH_2,
    ...CLK_001_LOCALIZED_VARIANT_BATCH_3,
    ...CLK_001_LOCALIZED_VARIANT_BATCH_4,
  ]),
  heldTasksExcluded: true,
  internalTasksExcluded: true,
  requiresEnHiPaLocalizationParity: true,
  newQlAllocation: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
});
