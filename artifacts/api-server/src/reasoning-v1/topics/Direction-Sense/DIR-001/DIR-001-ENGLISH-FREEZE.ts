import { DIR_001_QLS } from "./chapter-registry";

export const DIR_001_ENGLISH_FREEZE = Object.freeze({
  packageId: "DIR-001",
  productCode: "REAS-DIR",
  locale: "en-IN",
  freezeStatus: "FROZEN_ENGLISH_BASELINE",
  chapterStatus: "LOCALIZATION_PENDING",
  approvedOn: "2026-07-27",
  approvalMethod: "MANUAL_PRODUCT_REVIEW",
  runtimeBaselineCommit: "59a188ab2ecf6cfa3fcd632ba6589d0b80104594",
  checkpointCount: 8,
  qlCount: 44,
  firstQlId: "DIR-QL-001",
  lastQlId: "DIR-QL-044",
  allocationPolicy: "NEED_BASED",
  localizedLocalesPending: ["hi-IN", "pa-IN"],
  supersedesFixedPlanningAllocation: true,
} as const);

const EXPECTED_CHECKPOINT_COUNTS = Object.freeze({
  "DIR-CP-001": 3,
  "DIR-CP-002": 2,
  "DIR-CP-003": 5,
  "DIR-CP-004": 5,
  "DIR-CP-005": 7,
  "DIR-CP-006": 7,
  "DIR-CP-007": 6,
  "DIR-CP-008": 9,
} as const);

export function assertDir001EnglishFreezeRegistry(): void {
  if (DIR_001_QLS.length !== DIR_001_ENGLISH_FREEZE.qlCount) {
    throw new Error(`DIR-001 English freeze requires ${DIR_001_ENGLISH_FREEZE.qlCount} QLs; received ${DIR_001_QLS.length}`);
  }

  const expectedIds = Array.from(
    { length: DIR_001_ENGLISH_FREEZE.qlCount },
    (_, index) => `DIR-QL-${String(index + 1).padStart(3, "0")}`,
  );
  const actualIds = DIR_001_QLS.map((ql) => ql.qlId);
  if (actualIds.some((qlId, index) => qlId !== expectedIds[index])) {
    throw new Error(`DIR-001 English freeze QL sequence changed. Expected ${expectedIds.join(", ")}; received ${actualIds.join(", ")}`);
  }

  const ruleIds = new Set<string>();
  const checkpointCounts = new Map<string, number>();
  for (const ql of DIR_001_QLS) {
    if (ql.status !== "REVIEWED") {
      throw new Error(`DIR-001 English freeze requires REVIEWED status for ${ql.qlId}; received ${ql.status}`);
    }
    if (ql.localeMode !== "TRANSLATABLE") {
      throw new Error(`DIR-001 English freeze requires TRANSLATABLE locale mode for ${ql.qlId}`);
    }
    if (!ql.ruleId.trim() || !ql.presentationMode.trim() || !ql.answerType.trim() || !ql.renderer.trim()) {
      throw new Error(`DIR-001 English freeze found incomplete registry metadata for ${ql.qlId}`);
    }
    if (ql.solverCapabilities.length === 0 || ql.solverCapabilities.some((capability) => !capability.trim())) {
      throw new Error(`DIR-001 English freeze requires named solver capabilities for ${ql.qlId}`);
    }
    if (ruleIds.has(ql.ruleId)) {
      throw new Error(`DIR-001 English freeze found duplicate rule ID ${ql.ruleId}`);
    }
    ruleIds.add(ql.ruleId);
    checkpointCounts.set(ql.checkpointId, (checkpointCounts.get(ql.checkpointId) ?? 0) + 1);
  }

  for (const [checkpointId, expectedCount] of Object.entries(EXPECTED_CHECKPOINT_COUNTS)) {
    const actualCount = checkpointCounts.get(checkpointId) ?? 0;
    if (actualCount !== expectedCount) {
      throw new Error(`DIR-001 English freeze expected ${expectedCount} QLs in ${checkpointId}; received ${actualCount}`);
    }
  }

  if (checkpointCounts.size !== Object.keys(EXPECTED_CHECKPOINT_COUNTS).length) {
    throw new Error(`DIR-001 English freeze found unexpected checkpoint IDs: ${[...checkpointCounts.keys()].join(", ")}`);
  }
}

assertDir001EnglishFreezeRegistry();
