import type { PhysicsExhaustiveAnchorV2, PhysicsExhaustiveCpMetaV2, PhysicsExhaustiveRawCpV2 } from "./sci-physics-exhaustive-types-v2";
import { SCI_PHYS_CP001_RAW_V2, SCI_PHYS_CP002_RAW_V2 } from "./sci-physics-cp001-cp002-domain-v2";
import { SCI_PHYS_CP003_RAW_V2, SCI_PHYS_CP004_RAW_V2 } from "./sci-physics-cp003-cp004-domain-v2";
import { SCI_PHYS_CP005_RAW_V2, SCI_PHYS_CP006_RAW_V2 } from "./sci-physics-cp005-cp006-domain-v2";
import { SCI_PHYS_CP007_RAW_V2, SCI_PHYS_CP008_RAW_V2 } from "./sci-physics-cp007-cp008-domain-v2";
import { SCI_PHYS_CP009_RAW_V2, SCI_PHYS_CP010_RAW_V2 } from "./sci-physics-cp009-cp010-domain-v2";

const RAW = [
  SCI_PHYS_CP001_RAW_V2,
  SCI_PHYS_CP002_RAW_V2,
  SCI_PHYS_CP003_RAW_V2,
  SCI_PHYS_CP004_RAW_V2,
  SCI_PHYS_CP005_RAW_V2,
  SCI_PHYS_CP006_RAW_V2,
  SCI_PHYS_CP007_RAW_V2,
  SCI_PHYS_CP008_RAW_V2,
  SCI_PHYS_CP009_RAW_V2,
  SCI_PHYS_CP010_RAW_V2,
] satisfies readonly PhysicsExhaustiveRawCpV2[];

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const SCI_PHYSICS_EXHAUSTIVE_CP_META_V2: readonly PhysicsExhaustiveCpMetaV2[] = RAW.map((cp) => ({
  cpId: cp.cpId,
  title: cp.title,
  sourceIds: cp.sourceIds,
  anchors: cp.anchors.map((raw, index): PhysicsExhaustiveAnchorV2 => {
    const [topic, difficulty, stem, answer, d1, d2, d3, trueStatement, falseStatement, explanation] = raw;
    return {
      id: `SCI-CP${cp.cpId.slice(-3)}-EXH-A${String(index + 1).padStart(2, "0")}`,
      cpId: cp.cpId,
      topicId: slug(topic),
      topic,
      difficulty,
      stem,
      answer,
      distractors: [d1, d2, d3],
      trueStatement,
      falseStatement,
      explanation,
      sourceIds: cp.sourceIds,
    };
  }),
}));

export const SCI_PHYSICS_EXHAUSTIVE_TARGET_CAPACITY_V2 = 348 as const;
