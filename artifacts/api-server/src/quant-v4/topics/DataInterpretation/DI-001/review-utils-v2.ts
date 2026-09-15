import { generateDi001TableV2Set } from "./table-set-v2";
import type { Di001ExamProfile } from "./types";
import type { Di001V2Set, Di001V2TaskKind } from "./table-v2-types";
import { DI001_V2_TASK_KINDS } from "./table-set-v2";

export const DI001_V2_REVIEW_TARGET_SETS = 8 as const;

export function buildDi001V2ReviewSets(): readonly Di001V2Set[] {
  const profiles: readonly Di001ExamProfile[] = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"];
  const candidates: Di001V2Set[] = [];

  for (let seedIndex = 1; seedIndex <= 48; seedIndex += 1) {
    for (const profile of profiles) {
      candidates.push(generateDi001TableV2Set({
        seed: `DI-001-V2-HUMAN-REVIEW-${seedIndex}`,
        examProfile: profile,
      }));
    }
  }

  const uncovered = new Set<Di001V2TaskKind>(DI001_V2_TASK_KINDS);
  const selected: Di001V2Set[] = [];
  const selectedIds = new Set<string>();
  const profileCount = (profile: Di001ExamProfile) => selected.filter((set) => set.examProfile === profile).length;

  while (uncovered.size > 0 && selected.length < DI001_V2_REVIEW_TARGET_SETS) {
    let best: Di001V2Set | undefined;
    let bestGain = -1;
    for (const candidate of candidates) {
      if (selectedIds.has(candidate.setId) || profileCount(candidate.examProfile) >= 4) continue;
      const gain = candidate.questions.filter((question) => uncovered.has(question.kind)).length;
      if (gain > bestGain) {
        best = candidate;
        bestGain = gain;
      }
    }
    if (!best || bestGain <= 0) break;
    selected.push(best);
    selectedIds.add(best.setId);
    best.questions.forEach((question) => uncovered.delete(question.kind));
  }

  for (const candidate of candidates) {
    if (selected.length >= DI001_V2_REVIEW_TARGET_SETS) break;
    if (selectedIds.has(candidate.setId) || profileCount(candidate.examProfile) >= 4) continue;
    selected.push(candidate);
    selectedIds.add(candidate.setId);
  }

  if (selected.length !== DI001_V2_REVIEW_TARGET_SETS) {
    throw new Error(`DI-001 V2 review selector produced ${selected.length} sets instead of ${DI001_V2_REVIEW_TARGET_SETS}.`);
  }
  if (uncovered.size > 0) {
    throw new Error(`DI-001 V2 review selector missed task families: ${[...uncovered].join(", ")}`);
  }
  if (profileCount("SSC_CGL_TIER_I") !== 4 || profileCount("BANKING_PRELIMS") !== 4) {
    throw new Error("DI-001 V2 review pack must contain four SSC and four Banking sets.");
  }

  return selected;
}
