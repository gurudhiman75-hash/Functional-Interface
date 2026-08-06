import {
  CLASS_BY_ID,
  CLS_CP001_CLASSES,
  CLS_CP001_ENTITIES,
  ENTITY_BY_ID,
  ENTITY_BY_LABEL,
} from "./semantic-dataset.en";
import type {
  AmbiguityAudit,
  Difficulty,
  DifficultyFeatures,
  GeneratedClassificationQuestion,
  Lifecycle,
  RuleSupport,
  SemanticClass,
  SemanticEntity,
} from "./types";

const DATASET_VERSION = "CLS-CP001-SEMANTIC-EN-v2" as const;
const DIFFICULTY_MODEL = "CLS-CP001-INSTANCE-DIFFICULTY-v1" as const;
const PROTOTYPE_ID = "CLS-CP001-PROT-008" as const;
const MAX_ATTEMPTS = 320;

const LIFECYCLE: Lifecycle = {
  permanentQlId: null,
  reviewStatus: "UNREVIEWED_DISCOVERY",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
};

type Rng = {
  next(): number;
  int(maxExclusive: number): number;
};

type GroupResolution = {
  readonly result: "UNIQUE" | "AMBIGUOUS" | "NO_VALID_RULE";
  readonly classId: string | null;
  readonly competingClassIds: readonly string[];
  readonly sharedClassIds: readonly string[];
};

export type CoherentGroupSolution = {
  readonly correctIndex: number;
  readonly classId: string;
  readonly audit: AmbiguityAudit;
};

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeRng(seed: number, optionCount: 4 | 5): Rng {
  let state = hashText(`${PROTOTYPE_ID}:${optionCount}:${seed}`) ^ 0x9e3779b9;
  if (state === 0) state = 0x6d2b79f5;
  return {
    next(): number {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      return (state >>> 0) / 0x100000000;
    },
    int(maxExclusive: number): number {
      if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
        throw new Error(`Invalid random bound: ${maxExclusive}`);
      }
      return Math.floor(this.next() * maxExclusive);
    },
  };
}

function shuffled<T>(values: readonly T[], rng: Rng): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = rng.int(index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

function sampleDistinct<T>(values: readonly T[], count: number, rng: Rng): T[] {
  if (count > values.length) throw new Error(`Cannot sample ${count} values from pool of ${values.length}`);
  return shuffled(values, rng).slice(0, count);
}

function requireEntity(entityId: string): SemanticEntity {
  const entity = ENTITY_BY_ID.get(entityId);
  if (!entity) throw new Error(`Unknown semantic entity: ${entityId}`);
  return entity;
}

function entityForLabel(label: string): SemanticEntity {
  const entity = ENTITY_BY_LABEL.get(label.trim().toLocaleLowerCase("en-IN"));
  if (!entity) throw new Error(`Unknown displayed semantic entity: ${label}`);
  return entity;
}

function classMembership(entity: SemanticEntity, classId: string): boolean {
  return entity.classIds.includes(classId);
}

function entitiesForClass(semanticClass: SemanticClass): SemanticEntity[] {
  return semanticClass.memberEntityIds.map(requireEntity);
}

const ELIGIBLE_GROUP_CLASSES = CLS_CP001_CLASSES.filter((semanticClass) =>
  semanticClass.qualityRank >= 90 && semanticClass.memberEntityIds.length >= 3,
);

function resolveGroup(labels: readonly string[]): GroupResolution {
  const entities = labels.map(entityForLabel);
  const shared = ELIGIBLE_GROUP_CLASSES.filter((semanticClass) =>
    entities.every((entity) => classMembership(entity, semanticClass.classId)),
  );
  if (shared.length === 0) {
    return { result: "NO_VALID_RULE", classId: null, competingClassIds: [], sharedClassIds: [] };
  }

  const bestQuality = Math.max(...shared.map((semanticClass) => semanticClass.qualityRank));
  const qualityWinners = shared.filter((semanticClass) => semanticClass.qualityRank === bestQuality);
  const deepest = Math.max(...qualityWinners.map((semanticClass) => semanticClass.hierarchyDepth));
  const best = qualityWinners.filter((semanticClass) => semanticClass.hierarchyDepth === deepest);
  if (best.length !== 1) {
    return {
      result: "AMBIGUOUS",
      classId: null,
      competingClassIds: best.map((semanticClass) => semanticClass.classId).sort(),
      sharedClassIds: shared.map((semanticClass) => semanticClass.classId).sort(),
    };
  }

  return {
    result: "UNIQUE",
    classId: best[0]!.classId,
    competingClassIds: best.map((semanticClass) => semanticClass.classId),
    sharedClassIds: shared.map((semanticClass) => semanticClass.classId).sort(),
  };
}

function groupRuleSupports(optionGroups: readonly (readonly string[])[]): RuleSupport[] {
  return ELIGIBLE_GROUP_CLASSES.map((semanticClass) => {
    const matchingIndices = optionGroups
      .map((group, index) => group.every((label) => classMembership(entityForLabel(label), semanticClass.classId)) ? index : -1)
      .filter((index) => index >= 0);
    return {
      classId: semanticClass.classId,
      supportCount: matchingIndices.length,
      matchingIndices,
      outlierIndex: null,
      qualityRank: semanticClass.qualityRank,
      hierarchyDepth: semanticClass.hierarchyDepth,
    };
  });
}

function auditGroups(optionGroups: readonly (readonly string[])[]): CoherentGroupSolution {
  const resolutions = optionGroups.map(resolveGroup);
  const validIndices = resolutions
    .map((resolution, index) => resolution.result === "UNIQUE" ? index : -1)
    .filter((index) => index >= 0);

  if (validIndices.length !== 1) {
    throw new Error(`Expected exactly one coherent semantic group, found ${validIndices.length}`);
  }

  const correctIndex = validIndices[0]!;
  const winning = resolutions[correctIndex]!;
  if (!winning.classId) throw new Error("Coherent-group solver lost its winning class");

  return {
    correctIndex,
    classId: winning.classId,
    audit: {
      result: "UNIQUE",
      winningClassId: winning.classId,
      winningOutlierIndex: correctIndex,
      competingClassIds: winning.competingClassIds,
      supports: groupRuleSupports(optionGroups),
    },
  };
}

function displayGroup(group: readonly SemanticEntity[]): string {
  return group.map((entity) => entity.label).join(", ");
}

function naturalList(labels: readonly string[]): string {
  if (labels.length === 1) return labels[0]!;
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")} and ${labels.at(-1)}`;
}

function semanticDemand(semanticClass: SemanticClass): 0 | 1 | 2 {
  if (semanticClass.family === "FUNCTIONAL_USE" || semanticClass.family === "PART_WHOLE") return 2;
  if (
    semanticClass.family === "HIERARCHY_CATEGORY"
    || semanticClass.family === "CROSS_CUTTING_CATEGORY"
    || semanticClass.surfaceKind === "PROPER_NOUN"
  ) return 1;
  return 0;
}

function difficultyFeatures(
  intendedClass: SemanticClass,
  optionGroups: readonly (readonly SemanticEntity[])[],
  solution: CoherentGroupSolution,
  optionCount: 4 | 5,
): DifficultyFeatures {
  const allEntities = [...new Map(
    optionGroups.flat().map((entity) => [entity.entityId, entity]),
  ).values()];
  const correctGroup = optionGroups[solution.correctIndex]!;
  const allItemsShareParent = intendedClass.parentClassIds.some((parentClassId) =>
    correctGroup.every((entity) => classMembership(entity, parentClassId)),
  );
  const multiMembershipItemCount = allEntities.filter((entity) => entity.directClassIds.length > 1).length;
  const candidateRuleCount = resolveGroup(correctGroup.map((entity) => entity.label)).sharedClassIds.length;
  const crossCutting = intendedClass.family === "CROSS_CUTTING_CATEGORY";
  const demand = semanticDemand(intendedClass);
  const score = Math.min(2, intendedClass.hierarchyDepth)
    + (allItemsShareParent ? 1 : 0)
    + (multiMembershipItemCount >= 3 ? 2 : multiMembershipItemCount > 0 ? 1 : 0)
    + (candidateRuleCount > 1 ? 1 : 0)
    + 1
    + (crossCutting ? 2 : 0)
    + demand
    + (optionCount === 5 ? 1 : 0);

  return {
    hierarchyDepth: intendedClass.hierarchyDepth,
    allItemsShareParent,
    multiMembershipItemCount,
    candidateRuleCount,
    inverseTask: true,
    crossCutting,
    semanticDemand: demand,
    optionCount,
    score,
  };
}

function difficultyFromFeatures(features: DifficultyFeatures): Difficulty {
  if (features.score <= 1) return "EASY";
  if (features.score <= 4) return "MEDIUM";
  return "HARD";
}

function buildDistractorGroup(
  rng: Rng,
  usedEntityIds: Set<string>,
): readonly SemanticEntity[] | null {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const anchorClass = ELIGIBLE_GROUP_CLASSES[rng.int(ELIGIBLE_GROUP_CLASSES.length)]!;
    const anchorPool = entitiesForClass(anchorClass).filter((entity) => !usedEntityIds.has(entity.entityId));
    if (anchorPool.length < 2) continue;
    const anchorMembers = sampleDistinct(anchorPool, 2, rng);
    const outsiderPool = CLS_CP001_ENTITIES.filter((entity) =>
      !usedEntityIds.has(entity.entityId)
      && !anchorMembers.some((member) => member.entityId === entity.entityId)
      && !classMembership(entity, anchorClass.classId),
    );
    if (outsiderPool.length === 0) continue;
    const outsider = outsiderPool[rng.int(outsiderPool.length)]!;
    const group = shuffled([...anchorMembers, outsider], rng);
    if (resolveGroup(group.map((entity) => entity.label)).result === "NO_VALID_RULE") return group;
  }
  return null;
}

function constructGroups(
  rng: Rng,
  optionCount: 4 | 5,
): {
  readonly intendedClass: SemanticClass;
  readonly groups: readonly (readonly SemanticEntity[])[];
  readonly solution: CoherentGroupSolution;
} | null {
  const intendedClass = ELIGIBLE_GROUP_CLASSES[rng.int(ELIGIBLE_GROUP_CLASSES.length)]!;
  const correctCandidates = entitiesForClass(intendedClass);
  if (correctCandidates.length < 3) return null;

  for (let correctAttempt = 0; correctAttempt < 80; correctAttempt += 1) {
    const correctGroup = sampleDistinct(correctCandidates, 3, rng);
    const correctResolution = resolveGroup(correctGroup.map((entity) => entity.label));
    if (correctResolution.result !== "UNIQUE" || correctResolution.classId !== intendedClass.classId) continue;

    const usedEntityIds = new Set(correctGroup.map((entity) => entity.entityId));
    const groups: (readonly SemanticEntity[])[] = [correctGroup];
    let failed = false;
    while (groups.length < optionCount) {
      const distractor = buildDistractorGroup(rng, usedEntityIds);
      if (!distractor) {
        failed = true;
        break;
      }
      distractor.forEach((entity) => usedEntityIds.add(entity.entityId));
      groups.push(distractor);
    }
    if (failed) continue;

    const displayed = shuffled(groups, rng);
    try {
      const solution = auditGroups(displayed.map((group) => group.map((entity) => entity.label)));
      if (solution.classId !== intendedClass.classId) continue;
      return { intendedClass, groups: displayed, solution };
    } catch {
      continue;
    }
  }
  return null;
}

function buildStem(seed: number, optionCount: 4 | 5): string {
  const templates = [
    "Only one option contains words that all belong to one clear class. Select that option.",
    "Choose the option in which all the words form one meaningful group.",
    "Which option contains a set of words that are consistently related by one classification?",
    "Select the only word-group whose members belong to the same class.",
    `Among the ${optionCount} options, choose the group whose words share one exact classification.`,
  ];
  return templates[seed % templates.length]!;
}

function explanation(
  intendedClass: SemanticClass,
  optionGroups: readonly (readonly SemanticEntity[])[],
  correctIndex: number,
): GeneratedClassificationQuestion["explanation"] {
  const correctGroup = optionGroups[correctIndex]!;
  const correctLabels = correctGroup.map((entity) => entity.label);
  const checks = optionGroups.map((group, index) => index === correctIndex
    ? `${displayGroup(group)}: all three words are ${intendedClass.label}.`
    : `${displayGroup(group)}: these words do not all belong to one same precise semantic class.`);
  return {
    coreRule: [
      `${naturalList(correctLabels)} are all ${intendedClass.label}.`,
      "Every other option mixes words from different classes.",
      `${displayGroup(correctGroup)} is therefore the only internally consistent group.`,
    ],
    optionChecks: checks,
    examSpeedShortcut: [
      "Test each option internally; do not compare the first word of one option with the first word of another.",
      "Stop when one complete group has a precise class and every other group contains a mismatch.",
    ],
    commonTraps: [
      "A group is not correct merely because two of its three words are related.",
      "Do not accept a very broad description that would make several mixed groups appear valid.",
    ],
  };
}

function validateQuestion(question: GeneratedClassificationQuestion): void {
  if (![4, 5].includes(question.options.length)) throw new Error("Coherent-group question must have four or five options");
  if (question.optionGroups.length !== question.options.length) throw new Error("Grouped-option payload does not match option count");
  if (new Set(question.options).size !== question.options.length) throw new Error("Coherent-group options must be unique");
  if (!question.optionGroups.every((group) => group.length === 3 && new Set(group).size === 3)) {
    throw new Error("Every coherent-group option must contain three unique words");
  }
  if (question.correctIndex < 0 || question.correctIndex >= question.options.length) throw new Error("Coherent-group answer index is invalid");
  if (question.options[question.correctIndex] !== question.answer) throw new Error("Coherent-group answer text does not match index");
  if (question.difficultyFeatures.optionCount !== question.options.length) throw new Error("Coherent-group difficulty option count mismatch");
  const independent = auditGroups(question.optionGroups);
  if (independent.correctIndex !== question.correctIndex || independent.classId !== question.intendedClassId) {
    throw new Error("Canonical and independent coherent-group solvers disagree");
  }
  if (question.lifecycle.publiclyPublishable || question.lifecycle.questionStudioDiscoverable) {
    throw new Error("Coherent-group discovery question escaped lifecycle locks");
  }
}

export function generateClsCp001CoherentGroupPrototype(
  seed: number,
  optionCount: 4 | 5 = 4,
): GeneratedClassificationQuestion {
  if (!Number.isSafeInteger(seed) || seed < 0) throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  if (optionCount !== 4 && optionCount !== 5) throw new Error(`CLS-CP-001 option count must be four or five: ${optionCount}`);
  const rng = makeRng(seed, optionCount);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const constructed = constructGroups(rng, optionCount);
    if (!constructed) continue;
    const { intendedClass, groups, solution } = constructed;
    const features = difficultyFeatures(intendedClass, groups, solution, optionCount);
    const options = groups.map(displayGroup);
    const question: GeneratedClassificationQuestion = {
      chapterId: "CLS-001",
      checkpointId: "CLS-CP-001",
      prototypeId: PROTOTYPE_ID,
      seed,
      task: "SELECT_COHERENT_GROUP",
      family: intendedClass.family,
      generationProfile: "COHERENT_GROUP",
      difficulty: difficultyFromFeatures(features),
      difficultyFeatures: features,
      intendedClassId: intendedClass.classId,
      intendedClassLabel: intendedClass.label,
      stem: buildStem(seed, optionCount),
      givens: [],
      options,
      optionGroups: groups.map((group) => group.map((entity) => entity.label)),
      correctIndex: solution.correctIndex,
      answer: options[solution.correctIndex]!,
      evidenceByOption: explanation(intendedClass, groups, solution.correctIndex).optionChecks,
      ambiguityAudit: solution.audit,
      explanation: explanation(intendedClass, groups, solution.correctIndex),
      metadata: {
        datasetVersion: DATASET_VERSION,
        locale: "en-IN",
        renderer: "TEXT",
        independentSolverVerified: true,
        hierarchyAware: true,
        multiMembershipAware: true,
        difficultyModel: DIFFICULTY_MODEL,
      },
      lifecycle: LIFECYCLE,
    };
    validateQuestion(question);
    return question;
  }

  throw new Error(`Unable to construct a unique coherent semantic group after ${MAX_ATTEMPTS} attempts`);
}

export function independentlyVerifyClsCp001CoherentGroupQuestion(
  question: Pick<GeneratedClassificationQuestion, "optionGroups">,
): CoherentGroupSolution {
  return auditGroups(question.optionGroups);
}
