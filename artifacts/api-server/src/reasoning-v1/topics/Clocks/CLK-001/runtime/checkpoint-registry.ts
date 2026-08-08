export const CLOCK_DESIGN_AUTHORITY = {
  file: "CLK-001-CLOCKS-MASTER-END-TO-END-DESIGN-V2.md",
  version: "V2",
  family: "REAS-CLK",
  packageId: "CLK-001",
  status: "OPEN_DISCOVERY",
  permanentQlCount: 0,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
} as const;

export const CLOCK_CHECKPOINTS = [
  { id: "CLK-CP-001", title: "Hand movement and rate foundations", outputs: ["angle", "duration", "count", "distance", "ratio"] },
  { id: "CLK-CP-002", title: "Angle at a stated time", outputs: ["angle", "classification", "difference", "ratio", "percentage"] },
  { id: "CLK-CP-003", title: "Time for a stated arbitrary angle", outputs: ["time", "time-set", "count"] },
  { id: "CLK-CP-004", title: "Special hand events", outputs: ["time", "time-set", "duration", "classification"] },
  { id: "CLK-CP-005", title: "Event counts and recurrence", outputs: ["count", "time", "duration", "ratio", "difference"] },
  { id: "CLK-CP-006", title: "Basic uniform gain and loss", outputs: ["actual-time", "displayed-time", "duration", "rate", "classification"] },
  { id: "CLK-CP-007", title: "Inverse and multi-day faulty clocks", outputs: ["rate", "time", "day-offset", "difference"] },
  { id: "CLK-CP-008", title: "Fault inferred from hand-event frequency", outputs: ["gain-loss-rate", "duration", "classification", "time"] },
  { id: "CLK-CP-009", title: "Strike interval mechanics", outputs: ["duration", "strike-count", "ratio"] },
  { id: "CLK-CP-010", title: "Hour-strike totals and schedules", outputs: ["count", "hour", "range"] },
  { id: "CLK-CP-011", title: "Vertical mirror-time arithmetic", outputs: ["time", "proof", "classification"] },
  { id: "CLK-CP-012", title: "Diagram literacy", outputs: ["time", "angle", "diagram", "classification", "validity"] },
  { id: "CLK-CP-013", title: "Hand interchange", outputs: ["time", "time-pair", "boolean", "classification"] },
  { id: "CLK-CP-014", title: "Mixed synthesis", outputs: ["angle", "time", "duration", "count", "diagram"] },
] as const;

export type ClockCheckpointId = (typeof CLOCK_CHECKPOINTS)[number]["id"];

export const CLOCK_OWNERSHIP_BOUNDARY = {
  numericMirrorTime: "CLK-001",
  verticalReflectionDiagramSelection: "MIR-001",
  horizontalWaterReflectionDiagramSelection: "MIR-001",
  numericWaterImageTime: "EXCLUDED_CONTINUOUS_CLOCK_MODEL",
  calendarArithmetic: "CAL-001",
  circularTrackPeopleVehicles: "TSD",
  bellsTogetherAtIntervals: "NUMBER_SYSTEM_LCM",
} as const;

export function assertClockLifecycleLocked(): void {
  if (
    CLOCK_DESIGN_AUTHORITY.permanentQlCount !== 0 ||
    CLOCK_DESIGN_AUTHORITY.questionStudioDiscoverable ||
    CLOCK_DESIGN_AUTHORITY.questionBankWritable ||
    CLOCK_DESIGN_AUTHORITY.testEligible ||
    CLOCK_DESIGN_AUTHORITY.publiclyPublishable
  ) {
    throw new Error("CLK-001 open-discovery lifecycle lock was violated.");
  }
}
