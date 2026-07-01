import type {
  TutorThinkingIdea,
  TutorThinkingTrace,
  UnitReference,
  ValueReference,
} from "../../../../../../../common/eev2/contracts";
import type { PercentOfKnownNumberEvidence } from "./evidence";

export const PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION = "1.0.0" as const;

export const PERCENT_OF_KNOWN_NUMBER_IDEA_KINDS = [
  "RECOGNIZE_EQUAL_UNIT_RELATION",
  "IDENTIFY_KNOWN_UNIT_COUNT",
  "IDENTIFY_KNOWN_QUANTITY",
  "IDENTIFY_TARGET_UNIT_COUNT",
  "DERIVE_SINGLE_UNIT_VALUE",
  "SCALE_SINGLE_UNIT_TO_TARGET",
  "INTERPRET_TARGET_QUANTITY",
] as const;

export type PercentOfKnownNumberIdeaKind =
  (typeof PERCENT_OF_KNOWN_NUMBER_IDEA_KINDS)[number];

const VALUE_REF_IDS = {
  knownUnitCount: "value:known-unit-count",
  knownQuantity: "value:known-quantity",
  targetUnitCount: "value:target-unit-count",
  singleUnitValue: "value:single-unit-value",
  targetQuantity: "value:target-quantity",
} as const;

const UNIT_REF_IDS = {
  percentagePoint: "unit:percentage-point",
  quantity: "unit:quantity",
} as const;

function ideaId(traceId: string, index: number): string {
  return `${traceId}:idea:${String(index + 1).padStart(2, "0")}`;
}

export function buildPercentOfKnownNumberTrace(
  evidence: PercentOfKnownNumberEvidence,
  packageId = "PCT-001",
): TutorThinkingTrace {
  const traceId = `${evidence.evidenceId}:trace:${PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION}`;
  const ideaIds = PERCENT_OF_KNOWN_NUMBER_IDEA_KINDS.map((_, index) =>
    ideaId(traceId, index),
  );

  const valueRefs: readonly ValueReference[] = [
    {
      refId: VALUE_REF_IDS.knownUnitCount,
      source: "parameter",
      sourceKey: "rate1",
      value: evidence.sourceValues.knownUnitCount,
    },
    {
      refId: VALUE_REF_IDS.knownQuantity,
      source: "parameter",
      sourceKey: "value1",
      value: evidence.sourceValues.knownQuantity,
    },
    {
      refId: VALUE_REF_IDS.targetUnitCount,
      source: "parameter",
      sourceKey: "rate2",
      value: evidence.sourceValues.targetUnitCount,
    },
    {
      refId: VALUE_REF_IDS.singleUnitValue,
      source: "derived",
      sourceKey: "singleUnitValue",
      value: evidence.derivedValues.singleUnitValue,
      metadata: {
        exactNumerator: evidence.exactValues.singleUnitValue.numerator,
        exactDenominator: evidence.exactValues.singleUnitValue.denominator,
      },
    },
    {
      refId: VALUE_REF_IDS.targetQuantity,
      source: "answer",
      sourceKey: "targetQuantity",
      value: evidence.derivedValues.targetQuantity,
      metadata: {
        exactNumerator: evidence.exactValues.targetQuantity.numerator,
        exactDenominator: evidence.exactValues.targetQuantity.denominator,
      },
    },
  ];

  const unitRefs: readonly UnitReference[] = [
    {
      refId: UNIT_REF_IDS.percentagePoint,
      unitKind: "relative-unit",
      semanticUnit: evidence.units.knownUnitCount,
    },
    {
      refId: UNIT_REF_IDS.quantity,
      unitKind: "quantity-unit",
      semanticUnit: evidence.units.targetQuantity,
    },
  ];

  const dependencies: Readonly<Record<string, readonly string[]>> = {
    [ideaIds[0]!]: [],
    [ideaIds[1]!]: [ideaIds[0]!],
    [ideaIds[2]!]: [ideaIds[0]!],
    [ideaIds[3]!]: [ideaIds[0]!],
    [ideaIds[4]!]: [ideaIds[1]!, ideaIds[2]!],
    [ideaIds[5]!]: [ideaIds[4]!, ideaIds[3]!],
    [ideaIds[6]!]: [ideaIds[5]!],
  };

  const ideas: readonly TutorThinkingIdea[] = [
    {
      ideaId: ideaIds[0]!,
      ideaKind: PERCENT_OF_KNOWN_NUMBER_IDEA_KINDS[0],
      dependencies: dependencies[ideaIds[0]!]!,
      valueRefs: [
        VALUE_REF_IDS.knownUnitCount,
        VALUE_REF_IDS.knownQuantity,
        VALUE_REF_IDS.targetUnitCount,
      ],
      unitRefs: [UNIT_REF_IDS.percentagePoint, UNIT_REF_IDS.quantity],
      metadata: {},
    },
    {
      ideaId: ideaIds[1]!,
      ideaKind: PERCENT_OF_KNOWN_NUMBER_IDEA_KINDS[1],
      dependencies: dependencies[ideaIds[1]!]!,
      valueRefs: [VALUE_REF_IDS.knownUnitCount],
      unitRefs: [UNIT_REF_IDS.percentagePoint],
      metadata: {},
    },
    {
      ideaId: ideaIds[2]!,
      ideaKind: PERCENT_OF_KNOWN_NUMBER_IDEA_KINDS[2],
      dependencies: dependencies[ideaIds[2]!]!,
      valueRefs: [VALUE_REF_IDS.knownQuantity],
      unitRefs: [UNIT_REF_IDS.quantity],
      metadata: {},
    },
    {
      ideaId: ideaIds[3]!,
      ideaKind: PERCENT_OF_KNOWN_NUMBER_IDEA_KINDS[3],
      dependencies: dependencies[ideaIds[3]!]!,
      valueRefs: [VALUE_REF_IDS.targetUnitCount],
      unitRefs: [UNIT_REF_IDS.percentagePoint],
      metadata: {},
    },
    {
      ideaId: ideaIds[4]!,
      ideaKind: PERCENT_OF_KNOWN_NUMBER_IDEA_KINDS[4],
      dependencies: dependencies[ideaIds[4]!]!,
      valueRefs: [
        VALUE_REF_IDS.knownUnitCount,
        VALUE_REF_IDS.knownQuantity,
        VALUE_REF_IDS.singleUnitValue,
      ],
      unitRefs: [UNIT_REF_IDS.percentagePoint, UNIT_REF_IDS.quantity],
      metadata: {},
    },
    {
      ideaId: ideaIds[5]!,
      ideaKind: PERCENT_OF_KNOWN_NUMBER_IDEA_KINDS[5],
      dependencies: dependencies[ideaIds[5]!]!,
      valueRefs: [
        VALUE_REF_IDS.singleUnitValue,
        VALUE_REF_IDS.targetUnitCount,
        VALUE_REF_IDS.targetQuantity,
      ],
      unitRefs: [UNIT_REF_IDS.percentagePoint, UNIT_REF_IDS.quantity],
      metadata: {},
    },
    {
      ideaId: ideaIds[6]!,
      ideaKind: PERCENT_OF_KNOWN_NUMBER_IDEA_KINDS[6],
      dependencies: dependencies[ideaIds[6]!]!,
      valueRefs: [VALUE_REF_IDS.targetQuantity],
      unitRefs: [UNIT_REF_IDS.quantity],
      metadata: {},
    },
  ];

  return {
    traceId,
    traceVersion: PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
    methodFamily: evidence.methodFamily,
    packageId,
    taskKind: evidence.taskKind,
    ideas,
    valueRefs,
    unitRefs,
    dependencies,
    metadata: {
      evidenceId: evidence.evidenceId,
      evidenceVersion: evidence.evidenceVersion,
    },
  };
}
