import {
  generateLp009DaySchedulingV2,
  solveLp009Day,
  type Lp009DayCaselet,
  type Lp009DayChild,
} from "./lp-009-day-scheduling-v2.ts";

export const LP_009_DAY_SCHEDULING_V3_REVIEW = Object.freeze({
  authorityId: "LP_009_DAY_SCHEDULING_V3_REVIEW" as const,
  supersedesReviewAuthorityId: "LP_009_DAY_SCHEDULING_V2_REVIEW" as const,
  packageId: "LP-009" as const,
  checkpointId: "LP-CP-009" as const,
  mode: "DAY" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  qlAllocation: "REUSE_EXISTING_PERMANENT_QLS" as const,
  permanentQlIds: ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"] as const,
  runtimeMode: "REVIEW_ONLY" as const,
  supportedLanguage: "en" as const,
  editorialChanges: Object.freeze({
    removesDuplicatedScenarioOpening: true,
    easyRequiresRelationalDeduction: true,
    easyRejectsDirectOnlyResolution: true,
    mediumCapsDirectPlacementsAtTwo: true,
    hardRetainsLayeredRelationalTopology: true,
  }),
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

type TargetDifficulty = "Easy" | "Medium" | "Hard";

function relationKinds(caselet: Lp009DayCaselet): Set<string> {
  return new Set(
    caselet.clues
      .filter((clue) => clue.kind === "BEFORE" || clue.kind === "BETWEEN" || clue.kind === "ADJACENT")
      .map((clue) => clue.kind),
  );
}

function directCount(caselet: Lp009DayCaselet): number {
  return caselet.clues.filter((clue) => clue.kind === "PERSON_DAY").length;
}

function exclusionCount(caselet: Lp009DayCaselet): number {
  return caselet.clues.filter((clue) => clue.kind === "NOT_DAY").length;
}

export function lp009DayV3TopologyAcceptable(caselet: Lp009DayCaselet): boolean {
  const direct = directCount(caselet);
  const relations = relationKinds(caselet);
  const exclusions = exclusionCount(caselet);

  if (caselet.difficultyBand === "Easy") {
    return direct >= 3 && direct <= 4 && relations.size >= 1 && exclusions <= 1 && caselet.clues.length >= 4;
  }
  if (caselet.difficultyBand === "Medium") {
    return direct >= 1 && direct <= 2 && relations.size >= 1 && exclusions <= 1 && caselet.clues.length >= 5;
  }
  return direct <= 1 && relations.size >= 2 && exclusions >= 1 && exclusions <= 2 && caselet.clues.length >= 5;
}

function cleanSetup(setup: string): string {
  const boundary = setup.indexOf(". ");
  if (boundary < 0) return setup;
  return setup.slice(boundary + 2).trim();
}

function cleanChild(child: Lp009DayChild, oldSetup: string, newSetup: string, caseletId: string, childIndex: number): Lp009DayChild {
  return {
    ...child,
    questionId: `${caseletId}-Q${childIndex + 1}`,
    stem: child.stem.startsWith(oldSetup) ? `${newSetup}${child.stem.slice(oldSetup.length)}` : child.stem,
  };
}

function cleanCaselet(source: Lp009DayCaselet, outputIndex: number): Lp009DayCaselet {
  const questionSetup = cleanSetup(source.questionSetup);
  const caseletId = `LP-009-DAY-V3-${String(outputIndex + 1).padStart(3, "0")}`;
  return {
    ...source,
    caseletId,
    questionSetup,
    children: source.children.map((child, childIndex) => cleanChild(child, source.questionSetup, questionSetup, caseletId, childIndex)),
  };
}

function findCandidate(seed: string, outputIndex: number, target: TargetDifficulty): Lp009DayCaselet {
  for (let wave = 0; wave < 80; wave += 1) {
    const candidates = generateLp009DaySchedulingV2(`${seed}:target:${target}:slot:${outputIndex}:wave:${wave}`, 18);
    const match = candidates.find((candidate) => candidate.difficultyBand === target && lp009DayV3TopologyAcceptable(candidate));
    if (match) return match;
  }
  throw new Error(`Unable to find an LP-009 Day V3 ${target} candidate for output slot ${outputIndex}.`);
}

export function generateLp009DaySchedulingV3(seed = "lp-009-day-scheduling-v3", count = 12): Lp009DayCaselet[] {
  const pattern: readonly TargetDifficulty[] = ["Easy", "Medium", "Hard"];
  const result: Lp009DayCaselet[] = [];

  for (let index = 0; index < count; index += 1) {
    const target = pattern[index % pattern.length]!;
    const source = findCandidate(seed, index, target);
    const cleaned = cleanCaselet(source, index);
    const solved = solveLp009Day({ clues: cleaned.clues });
    if (solved.length !== 1) throw new Error(`${cleaned.caseletId} no longer resolves uniquely.`);
    result.push(cleaned);
  }

  return result;
}
