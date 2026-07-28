import {
  CLASS_BY_ID,
  CLS_CP001_CLASSES,
  CLS_CP001_ENTITIES,
  CLS_CP001_PROTOTYPES,
  ENTITY_BY_ID,
  ENTITY_BY_LABEL,
  PROTOTYPE_BY_ID,
} from "./semantic-dataset.en";
import type {
  AmbiguityAudit,
  Difficulty,
  DifficultyFeatures,
  Explanation,
  GeneratedClassificationQuestion,
  Lifecycle,
  PrototypeDefinition,
  PrototypeId,
  RuleSupport,
  SemanticClass,
  SemanticEntity,
} from "./types";

const DATASET_VERSION = "CLS-CP001-SEMANTIC-EN-v2" as const;
const DIFFICULTY_MODEL = "CLS-CP001-INSTANCE-DIFFICULTY-v1" as const;
const MAX_GENERATION_ATTEMPTS = 240;

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

type IndependentSolution = {
  readonly correctIndex: number;
  readonly classId: string;
  readonly audit: AmbiguityAudit;
};

type ClassPair = {
  readonly positiveClass: SemanticClass;
  readonly contrastClass: SemanticClass;
  readonly positiveExclusive: readonly SemanticEntity[];
  readonly contrastExclusive: readonly SemanticEntity[];
};

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeRng(seed: number, salt: string): Rng {
  let state = hashText(`${salt}:${seed}`) ^ 0x9e3779b9;
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
  if (count > values.length) {
    throw new Error(`Cannot sample ${count} values from pool of ${values.length}`);
  }
  return shuffled(values, rng).slice(0, count);
}

function uniqueEntities(values: readonly SemanticEntity[]): SemanticEntity[] {
  return [...new Map(values.map((entity) => [entity.entityId, entity])).values()];
}

function requirePrototype(prototypeId: PrototypeId): PrototypeDefinition {
  const prototype = PROTOTYPE_BY_ID.get(prototypeId);
  if (!prototype) throw new Error(`Unknown CLS item prototype: ${prototypeId}`);
  return prototype;
}

function requireClass(classId: string): SemanticClass {
  const semanticClass = CLASS_BY_ID.get(classId);
  if (!semanticClass) throw new Error(`Unknown semantic class: ${classId}`);
  return semanticClass;
}

function requireEntity(entityId: string): SemanticEntity {
  const entity = ENTITY_BY_ID.get(entityId);
  if (!entity) throw new Error(`Unknown semantic entity: ${entityId}`);
  return entity;
}

function entityForLabel(label: string): SemanticEntity {
  const entity = ENTITY_BY_LABEL.get(label.trim().toLocaleLowerCase("en-IN"));
  if (!entity) throw new Error(`Independent solver could not resolve displayed value: ${label}`);
  return entity;
}

function entitiesForClass(semanticClass: SemanticClass): SemanticEntity[] {
  return semanticClass.memberEntityIds.map(requireEntity);
}

function classesFromIds(classIds: readonly string[]): SemanticClass[] {
  return classIds.map(requireClass);
}

function classMembership(entity: SemanticEntity, classId: string): boolean {
  return entity.classIds.includes(classId);
}

function sameContrastSpace(left: SemanticClass, right: SemanticClass): boolean {
  return left.classId !== right.classId
    && left.contrastGroup === right.contrastGroup
    && left.surfaceKind === right.surfaceKind;
}

function exclusiveMembers(source: SemanticClass, other: SemanticClass): SemanticEntity[] {
  return entitiesForClass(source).filter((entity) => !classMembership(entity, other.classId));
}

function viableClassPairs(prototype: PrototypeDefinition, optionCount: 4 | 5): ClassPair[] {
  const intended = classesFromIds(prototype.intendedClassIds);
  const requiredPositiveCount = prototype.task === "FIND_OUTLIER" ? optionCount - 1 : 4;
  return intended.flatMap((positiveClass) => intended
    .filter((contrastClass) => sameContrastSpace(positiveClass, contrastClass))
    .map((contrastClass) => ({
      positiveClass,
      contrastClass,
      positiveExclusive: exclusiveMembers(positiveClass, contrastClass),
      contrastExclusive: exclusiveMembers(contrastClass, positiveClass),
    }))
    .filter((pair) => pair.positiveExclusive.length >= requiredPositiveCount && pair.contrastExclusive.length >= 1));
}

function chooseClassPair(prototype: PrototypeDefinition, optionCount: 4 | 5, rng: Rng): ClassPair {
  const pairs = viableClassPairs(prototype, optionCount);
  if (pairs.length === 0) throw new Error(`Prototype ${prototype.prototypeId} has no viable class pair`);
  return pairs[rng.int(pairs.length)]!;
}

function parentLabels(semanticClass: SemanticClass): string[] {
  return semanticClass.parentClassIds.map((classId) => requireClass(classId).label);
}

function evidenceLine(entity: SemanticEntity, semanticClass: SemanticClass): string {
  return classMembership(entity, semanticClass.classId)
    ? `${entity.label} belongs to the group of ${semanticClass.label}.`
    : `${entity.label} does not belong to the group of ${semanticClass.label}.`;
}

function ruleSupports(labels: readonly string[], eligibleClassIds: readonly string[]): RuleSupport[] {
  const entities = labels.map(entityForLabel);
  return eligibleClassIds.map((classId) => {
    const semanticClass = requireClass(classId);
    const matchingIndices = entities
      .map((entity, index) => classMembership(entity, classId) ? index : -1)
      .filter((index) => index >= 0);
    const outlierIndex = matchingIndices.length === labels.length - 1
      ? labels.findIndex((_, index) => !matchingIndices.includes(index))
      : null;
    return {
      classId,
      supportCount: matchingIndices.length,
      matchingIndices,
      outlierIndex,
      qualityRank: semanticClass.qualityRank,
      hierarchyDepth: semanticClass.hierarchyDepth,
    };
  });
}

function bestRuleSupports(candidates: readonly RuleSupport[]): RuleSupport[] {
  if (candidates.length === 0) return [];
  const bestQuality = Math.max(...candidates.map((candidate) => candidate.qualityRank));
  const qualityWinners = candidates.filter((candidate) => candidate.qualityRank === bestQuality);
  const deepest = Math.max(...qualityWinners.map((candidate) => candidate.hierarchyDepth));
  return qualityWinners.filter((candidate) => candidate.hierarchyDepth === deepest);
}

function auditOutlier(labels: readonly string[], eligibleClassIds: readonly string[]): AmbiguityAudit {
  const supports = ruleSupports(labels, eligibleClassIds);
  const candidates = supports.filter((support) => support.supportCount === labels.length - 1 && support.outlierIndex !== null);
  if (candidates.length === 0) {
    return {
      result: "NO_VALID_RULE",
      winningClassId: null,
      winningOutlierIndex: null,
      competingClassIds: [],
      supports,
    };
  }

  const best = bestRuleSupports(candidates);
  const distinctOutliers = new Set(best.map((candidate) => candidate.outlierIndex));
  if (distinctOutliers.size !== 1) {
    return {
      result: "AMBIGUOUS",
      winningClassId: null,
      winningOutlierIndex: null,
      competingClassIds: best.map((candidate) => candidate.classId).sort(),
      supports,
    };
  }

  const winner = [...best].sort((left, right) => left.classId.localeCompare(right.classId))[0]!;
  return {
    result: "UNIQUE",
    winningClassId: winner.classId,
    winningOutlierIndex: winner.outlierIndex,
    competingClassIds: best.map((candidate) => candidate.classId).sort(),
    supports,
  };
}

function sharedClasses(labels: readonly string[], eligibleClassIds: readonly string[]): SemanticClass[] {
  const entities = labels.map(entityForLabel);
  return classesFromIds(eligibleClassIds).filter((semanticClass) =>
    entities.every((entity) => classMembership(entity, semanticClass.classId)),
  );
}

function resolveSharedClass(labels: readonly string[], eligibleClassIds: readonly string[]): {
  readonly result: "UNIQUE" | "AMBIGUOUS" | "NO_VALID_RULE";
  readonly classId: string | null;
  readonly competingClassIds: readonly string[];
} {
  const shared = sharedClasses(labels, eligibleClassIds);
  if (shared.length === 0) return { result: "NO_VALID_RULE", classId: null, competingClassIds: [] };

  const bestQuality = Math.max(...shared.map((semanticClass) => semanticClass.qualityRank));
  const qualityWinners = shared.filter((semanticClass) => semanticClass.qualityRank === bestQuality);
  const deepest = Math.max(...qualityWinners.map((semanticClass) => semanticClass.hierarchyDepth));
  const best = qualityWinners.filter((semanticClass) => semanticClass.hierarchyDepth === deepest);
  if (best.length !== 1) {
    return {
      result: "AMBIGUOUS",
      classId: null,
      competingClassIds: best.map((semanticClass) => semanticClass.classId).sort(),
    };
  }
  return {
    result: "UNIQUE",
    classId: best[0]!.classId,
    competingClassIds: best.map((semanticClass) => semanticClass.classId),
  };
}

function solveIndependently(
  prototype: PrototypeDefinition,
  givens: readonly string[],
  options: readonly string[],
): IndependentSolution {
  if (prototype.task === "FIND_OUTLIER") {
    const audit = auditOutlier(options, prototype.eligibleClassIds);
    if (audit.result !== "UNIQUE" || audit.winningClassId === null || audit.winningOutlierIndex === null) {
      throw new Error(`Independent outlier solution failed: ${audit.result}`);
    }
    return {
      correctIndex: audit.winningOutlierIndex,
      classId: audit.winningClassId,
      audit,
    };
  }

  if (prototype.task !== "SELECT_CLASS_MEMBER") {
    throw new Error(`Item solver does not own task '${prototype.task}'`);
  }

  const shared = resolveSharedClass(givens, prototype.eligibleClassIds);
  if (shared.result !== "UNIQUE" || shared.classId === null) {
    throw new Error(`Independent class-member premise failed: ${shared.result}`);
  }
  const classId = shared.classId;
  const resolvedOptions = options.map(entityForLabel);
  const matchingIndices = resolvedOptions
    .map((entity, index) => classMembership(entity, classId) ? index : -1)
    .filter((index) => index >= 0);
  if (matchingIndices.length !== 1) {
    throw new Error(`Expected one class-member option, found ${matchingIndices.length}`);
  }
  return {
    correctIndex: matchingIndices[0]!,
    classId,
    audit: {
      result: "UNIQUE",
      winningClassId: classId,
      winningOutlierIndex: matchingIndices[0]!,
      competingClassIds: shared.competingClassIds,
      supports: ruleSupports(options, prototype.eligibleClassIds),
    },
  };
}

function semanticDemand(prototype: PrototypeDefinition, intendedClass: SemanticClass): 0 | 1 | 2 {
  if (prototype.family === "FUNCTIONAL_USE" || prototype.family === "PART_WHOLE") return 2;
  if (
    prototype.family === "HIERARCHY_CATEGORY"
    || prototype.family === "CROSS_CUTTING_CATEGORY"
    || intendedClass.surfaceKind === "PROPER_NOUN"
  ) return 1;
  return 0;
}

function calculateDifficultyFeatures(
  prototype: PrototypeDefinition,
  intendedClass: SemanticClass,
  givens: readonly SemanticEntity[],
  displayedEntities: readonly SemanticEntity[],
  audit: AmbiguityAudit,
): DifficultyFeatures {
  const allItems = uniqueEntities([...givens, ...displayedEntities]);
  const allItemsShareParent = intendedClass.parentClassIds.some((parentClassId) =>
    allItems.every((entity) => classMembership(entity, parentClassId)),
  );
  const multiMembershipItemCount = allItems.filter((entity) => entity.directClassIds.length > 1).length;
  const candidateRuleCount = prototype.task === "FIND_OUTLIER"
    ? audit.supports.filter((support) => support.supportCount === displayedEntities.length - 1 && support.outlierIndex !== null).length
    : sharedClasses(givens.map((entity) => entity.label), prototype.eligibleClassIds).length;
  const inverseTask = prototype.task === "SELECT_CLASS_MEMBER";
  const crossCutting = prototype.generationProfile === "CROSS_CUTTING";
  const demand = semanticDemand(prototype, intendedClass);
  const optionCount = displayedEntities.length as 4 | 5;

  const score = Math.min(2, intendedClass.hierarchyDepth)
    + (allItemsShareParent ? 1 : 0)
    + (multiMembershipItemCount >= 3 ? 2 : multiMembershipItemCount > 0 ? 1 : 0)
    + (candidateRuleCount > 1 ? 1 : 0)
    + (inverseTask ? 1 : 0)
    + (crossCutting ? 2 : 0)
    + demand
    + (optionCount === 5 ? 1 : 0);

  return {
    hierarchyDepth: intendedClass.hierarchyDepth,
    allItemsShareParent,
    multiMembershipItemCount,
    candidateRuleCount,
    inverseTask,
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

function buildStem(
  prototype: PrototypeDefinition,
  givens: readonly SemanticEntity[],
  seed: number,
  rng: Rng,
): string {
  if (prototype.task === "SELECT_CLASS_MEMBER") {
    const joined = givens.map((entity) => entity.label).join(", ");
    const templates = [
      `The following items form one class: ${joined}. Which option is another member of the same class?`,
      `${joined} belong to the same category. Select the option that belongs to that category as well.`,
      `Consider the group ${joined}. Which of the following can be added to this group?`,
      `Which option belongs with ${joined}?`,
      `The items ${joined} share one classification. Choose another item from that classification.`,
      `Select the option that can join the group ${joined}.`,
      `Which candidate is a member of the same class as ${joined}?`,
      `Choose the item that completes the category represented by ${joined}.`,
    ];
    return templates[(rng.int(templates.length) + seed) % templates.length]!;
  }

  const templates = [
    "Most of the following options belong to one class. Which option does not belong to that class?",
    "Choose the option that is different from the others.",
    "Which of the following is the odd one out?",
    "Identify the option that does not share the common classification of the others.",
    "All but one option can be placed in the same category. Select the remaining option.",
    "Find the item that cannot be grouped with the others.",
    "One option falls outside the class formed by the rest. Which is it?",
    "Select the differently classified option.",
  ];
  return templates[(rng.int(templates.length) + seed) % templates.length]!;
}

function naturalList(labels: readonly string[]): string {
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0]!;
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")} and ${labels.at(-1)}`;
}

function buildExplanation(
  prototype: PrototypeDefinition,
  semanticClass: SemanticClass,
  givens: readonly SemanticEntity[],
  options: readonly SemanticEntity[],
  correctIndex: number,
  audit: AmbiguityAudit,
  difficultyFeatures: DifficultyFeatures,
): Explanation {
  const answer = options[correctIndex]!;
  const parents = parentLabels(semanticClass);
  const parentText = parents.length > 0 ? naturalList(parents) : null;

  if (prototype.task === "SELECT_CLASS_MEMBER") {
    const premise = naturalList(givens.map((entity) => entity.label));
    const hierarchyLine = parentText && difficultyFeatures.allItemsShareParent
      ? `The given items also belong to the broader group of ${parentText}, but that description is too broad to choose the answer.`
      : `The useful common group is ${semanticClass.label}.`;
    return {
      coreRule: [
        `${premise} are ${semanticClass.label}.`,
        hierarchyLine,
        `${answer.label} is the only option that belongs to this same specific group.`,
      ],
      optionChecks: options.map((entity) => evidenceLine(entity, semanticClass)),
      examSpeedShortcut: [semanticClass.shortcut, "Name the most specific common group formed by the given items, then check each option against it."],
      commonTraps: [semanticClass.trap, "An option from only the broader group is not enough; it must belong to the same specific group."],
    };
  }

  const positiveLabels = options
    .filter((_, index) => index !== correctIndex)
    .map((entity) => entity.label);
  const positiveLine = `${naturalList(positiveLabels)} are ${semanticClass.label}.`;
  const hierarchyLine = parentText && difficultyFeatures.allItemsShareParent
    ? `All displayed items belong to the broader group of ${parentText}, but only those matching items belong to the more specific group of ${semanticClass.label}.`
    : `${answer.label} does not share that classification.`;
  const sameAnswerRules = audit.supports.filter((support) =>
    support.supportCount === options.length - 1 && support.outlierIndex === correctIndex,
  );
  const competitionLine = sameAnswerRules.length > 1
    ? "A broader description also leads to the same odd item, so the answer does not change."
    : "No other relevant grouping points to a different option.";

  return {
    coreRule: [
      positiveLine,
      hierarchyLine,
      `${answer.label} is therefore the odd one out.`,
      competitionLine,
    ],
    optionChecks: options.map((entity) => evidenceLine(entity, semanticClass)),
    examSpeedShortcut: [semanticClass.shortcut, "Confirm the common group on the matching options before marking the remaining one."],
    commonTraps: [semanticClass.trap, "Do not stop at a broad similarity that includes every displayed item."],
  };
}

function assertNoLearnerLeak(text: string): void {
  if (/CLS[-_]|PROT|classId|entityId|qualityRank|hierarchyDepth|bounded competing-class audit|resolved class|admitted class|quality level/i.test(text)) {
    throw new Error(`Learner-facing internal or technical wording leak: ${text}`);
  }
}

function validateQuestion(question: GeneratedClassificationQuestion): void {
  if (![4, 5].includes(question.options.length)) {
    throw new Error("Classification item question must have four or five options");
  }
  if (new Set(question.options.map((option) => option.toLocaleLowerCase("en-IN"))).size !== question.options.length) {
    throw new Error("Classification item question must have unique options");
  }
  if (question.optionGroups.length !== 0) {
    throw new Error("Item-level classification must not expose grouped answer options");
  }
  if (question.correctIndex < 0 || question.correctIndex >= question.options.length || question.options[question.correctIndex] !== question.answer) {
    throw new Error("Classification answer/index mismatch");
  }
  if (question.ambiguityAudit.result !== "UNIQUE") {
    throw new Error(`Classification ambiguity audit failed: ${question.ambiguityAudit.result}`);
  }
  if (question.difficultyFeatures.optionCount !== question.options.length) {
    throw new Error("Classification difficulty option count does not match rendered options");
  }
  if (question.difficulty !== difficultyFromFeatures(question.difficultyFeatures)) {
    throw new Error("Classification difficulty does not match generated-instance features");
  }
  if (question.lifecycle.publiclyPublishable || question.lifecycle.questionStudioDiscoverable) {
    throw new Error("Discovery question escaped lifecycle locks");
  }
  const learnerText = [
    question.stem,
    ...question.givens,
    ...question.options,
    ...question.explanation.coreRule,
    ...question.explanation.optionChecks,
    ...question.explanation.examSpeedShortcut,
    ...question.explanation.commonTraps,
  ];
  learnerText.forEach(assertNoLearnerLeak);
}

function questionFromState(
  prototype: PrototypeDefinition,
  seed: number,
  intendedClass: SemanticClass,
  givens: readonly SemanticEntity[],
  displayedEntities: readonly SemanticEntity[],
  correctIndex: number,
  audit: AmbiguityAudit,
  rng: Rng,
): GeneratedClassificationQuestion {
  const difficultyFeatures = calculateDifficultyFeatures(
    prototype,
    intendedClass,
    givens,
    displayedEntities,
    audit,
  );
  const question: GeneratedClassificationQuestion = {
    chapterId: "CLS-001",
    checkpointId: "CLS-CP-001",
    prototypeId: prototype.prototypeId,
    seed,
    task: prototype.task,
    family: prototype.family,
    generationProfile: prototype.generationProfile,
    difficulty: difficultyFromFeatures(difficultyFeatures),
    difficultyFeatures,
    intendedClassId: intendedClass.classId,
    intendedClassLabel: intendedClass.label,
    stem: buildStem(prototype, givens, seed, rng),
    givens: givens.map((entity) => entity.label),
    options: displayedEntities.map((entity) => entity.label),
    optionGroups: [],
    correctIndex,
    answer: displayedEntities[correctIndex]!.label,
    evidenceByOption: displayedEntities.map((entity) => evidenceLine(entity, intendedClass)),
    ambiguityAudit: audit,
    explanation: buildExplanation(
      prototype,
      intendedClass,
      givens,
      displayedEntities,
      correctIndex,
      audit,
      difficultyFeatures,
    ),
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

function generateOutlier(
  prototype: PrototypeDefinition,
  seed: number,
  rng: Rng,
  optionCount: 4 | 5,
): GeneratedClassificationQuestion {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const pair = chooseClassPair(prototype, optionCount, rng);
    const positiveEntities = sampleDistinct(pair.positiveExclusive, optionCount - 1, rng);
    const outlier = sampleDistinct(pair.contrastExclusive, 1, rng)[0]!;
    const displayedEntities = shuffled([...positiveEntities, outlier], rng);
    const canonicalCorrectIndex = displayedEntities.findIndex((entity) => entity.entityId === outlier.entityId);
    const audit = auditOutlier(displayedEntities.map((entity) => entity.label), prototype.eligibleClassIds);
    if (
      audit.result !== "UNIQUE"
      || audit.winningClassId !== pair.positiveClass.classId
      || audit.winningOutlierIndex !== canonicalCorrectIndex
    ) {
      continue;
    }
    const independent = solveIndependently(prototype, [], displayedEntities.map((entity) => entity.label));
    if (independent.correctIndex !== canonicalCorrectIndex || independent.classId !== pair.positiveClass.classId) continue;
    return questionFromState(
      prototype,
      seed,
      pair.positiveClass,
      [],
      displayedEntities,
      canonicalCorrectIndex,
      independent.audit,
      rng,
    );
  }
  throw new Error(`Unable to construct an unambiguous ${prototype.prototypeId} state after ${MAX_GENERATION_ATTEMPTS} attempts`);
}

function generateClassMember(
  prototype: PrototypeDefinition,
  seed: number,
  rng: Rng,
  optionCount: 4 | 5,
): GeneratedClassificationQuestion {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const pair = chooseClassPair(prototype, optionCount, rng);
    const positivePool = sampleDistinct(pair.positiveExclusive, 4, rng);
    const givens = positivePool.slice(0, 3);
    const correctEntity = positivePool[3]!;
    const negativePool = uniqueEntities(classesFromIds(prototype.intendedClassIds)
      .filter((semanticClass) => sameContrastSpace(pair.positiveClass, semanticClass))
      .flatMap(entitiesForClass)
      .filter((entity) => !classMembership(entity, pair.positiveClass.classId)));
    if (negativePool.length < optionCount - 1) continue;
    const negatives = sampleDistinct(negativePool, optionCount - 1, rng);
    const displayedEntities = shuffled([correctEntity, ...negatives], rng);
    const canonicalCorrectIndex = displayedEntities.findIndex((entity) => entity.entityId === correctEntity.entityId);
    try {
      const independent = solveIndependently(
        prototype,
        givens.map((entity) => entity.label),
        displayedEntities.map((entity) => entity.label),
      );
      if (independent.correctIndex !== canonicalCorrectIndex || independent.classId !== pair.positiveClass.classId) continue;
      return questionFromState(
        prototype,
        seed,
        pair.positiveClass,
        givens,
        displayedEntities,
        canonicalCorrectIndex,
        independent.audit,
        rng,
      );
    } catch {
      continue;
    }
  }
  throw new Error(`Unable to construct a unique ${prototype.prototypeId} member state after ${MAX_GENERATION_ATTEMPTS} attempts`);
}

export function generateClsCp001Prototype(
  prototypeId: PrototypeId,
  seed: number,
  optionCount: 4 | 5 = 4,
): GeneratedClassificationQuestion {
  if (!Number.isSafeInteger(seed) || seed < 0) throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  if (optionCount !== 4 && optionCount !== 5) throw new Error(`CLS-CP-001 option count must be four or five: ${optionCount}`);
  const prototype = requirePrototype(prototypeId);
  const rng = makeRng(seed, `${prototypeId}:${optionCount}`);
  return prototype.task === "SELECT_CLASS_MEMBER"
    ? generateClassMember(prototype, seed, rng, optionCount)
    : generateOutlier(prototype, seed, rng, optionCount);
}

export function independentlyVerifyClsCp001Question(
  question: GeneratedClassificationQuestion,
): IndependentSolution {
  const prototype = requirePrototype(question.prototypeId);
  return solveIndependently(prototype, question.givens, question.options);
}

export function auditClsCp001DisplayedOptions(
  labels: readonly string[],
  eligibleClassIds: readonly string[],
): AmbiguityAudit {
  if (![4, 5].includes(labels.length) || new Set(labels.map((label) => label.trim().toLocaleLowerCase("en-IN"))).size !== labels.length) {
    throw new Error("Adversarial classification audit requires four or five unique displayed options");
  }
  eligibleClassIds.forEach(requireClass);
  return auditOutlier(labels, eligibleClassIds);
}

export function getClsCp001PrototypeDefinitions(): readonly PrototypeDefinition[] {
  return CLS_CP001_PROTOTYPES;
}

export function getClsCp001SemanticDataset(): {
  readonly classes: readonly SemanticClass[];
  readonly entities: readonly SemanticEntity[];
  readonly version: typeof DATASET_VERSION;
} {
  return {
    classes: CLS_CP001_CLASSES,
    entities: CLS_CP001_ENTITIES,
    version: DATASET_VERSION,
  };
}
