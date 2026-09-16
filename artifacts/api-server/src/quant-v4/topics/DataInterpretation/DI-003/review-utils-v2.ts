import { generateDi003GroupedBarV2Set } from "./grouped-bar-set-v2";
import type { Di003V2ExamProfile, Di003V2QuestionSet, Di003V2TaskKind } from "./grouped-bar-v2-types";

const PROFILES: readonly Di003V2ExamProfile[] = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"];

export function buildDi003V2ReviewSets(): readonly Di003V2QuestionSet[] {
  const selected: Di003V2QuestionSet[] = [];
  const covered = new Set<Di003V2TaskKind>();
  const usedSeeds = new Set<number>();

  for (let seedIndex = 1; seedIndex <= 120 && covered.size < 12; seedIndex += 1) {
    const profile = PROFILES[selected.length % PROFILES.length]!;
    const set = generateDi003GroupedBarV2Set({ seed: `DI-003-V2-REVIEW-${seedIndex}`, examProfile: profile });
    const contributes = set.questions.some((question) => !covered.has(question.kind));
    if (!contributes) continue;
    selected.push(set);
    usedSeeds.add(seedIndex);
    set.questions.forEach((question) => covered.add(question.kind));
  }

  if (covered.size !== 12) throw new Error(`DI-003 V2 review builder covered only ${covered.size}/12 task families.`);

  for (let seedIndex = 1; selected.length < 8 && seedIndex <= 120; seedIndex += 1) {
    if (usedSeeds.has(seedIndex)) continue;
    const profile = PROFILES[selected.length % PROFILES.length]!;
    selected.push(generateDi003GroupedBarV2Set({ seed: `DI-003-V2-REVIEW-${seedIndex}`, examProfile: profile }));
    usedSeeds.add(seedIndex);
  }

  return selected;
}
