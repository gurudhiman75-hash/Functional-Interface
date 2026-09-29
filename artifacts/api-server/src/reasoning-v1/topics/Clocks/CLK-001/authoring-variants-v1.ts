import type { ClockTaskId } from "./runtime/catalog.ts";
import {
  CLK_001_PERMANENT_CONTRACTS,
  type ClockPermanentQlId,
} from "./permanent-contracts.ts";

export const CLK_001_LOCALIZED_VARIANT_BATCH_1 = [
  "HAND_MINUTE_ROTATION",
  "HAND_SECOND_ROTATION",
  "HAND_DURATION_FROM_ANGLE",
  "TOTAL_STRIKES_12_HOURS",
  "ACTUAL_FROM_MIRROR",
  "SELECT_DIAGRAM_FOR_TIME",
] as const satisfies readonly ClockTaskId[];

const localizedBatch = new Set<ClockTaskId>(CLK_001_LOCALIZED_VARIANT_BATCH_1);

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
  status: "BATCH_1_MULTILINGUAL_VARIANT_AUTHORING",
  permanentQlCount: CLK_001_PERMANENT_CONTRACTS.length,
  newlyEnabledVariantCount: CLK_001_LOCALIZED_VARIANT_BATCH_1.length,
  newlyEnabledVariantTaskIds: CLK_001_LOCALIZED_VARIANT_BATCH_1,
  heldTasksExcluded: true,
  internalTasksExcluded: true,
  requiresEnHiPaLocalizationParity: true,
  newQlAllocation: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
});
