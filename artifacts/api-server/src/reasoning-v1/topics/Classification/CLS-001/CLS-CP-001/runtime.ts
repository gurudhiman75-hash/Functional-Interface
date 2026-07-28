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
  Explanation,
  GeneratedClassificationQuestion,
  Lifecycle,
  PrototypeDefinition,
  PrototypeId,
  RuleSupport,
  SemanticClass,
  SemanticEntity,
} from "./types";

const DATASET_VERSION = "CLS-CP001-SEMANTIC-EN-v1" as const;

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

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeRng(seed: number, salt: string): Rng {
  let state = (seed >>> 0) ^ hashText(salt) ^ 0x9e3779b9;
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

function requirePrototype(prototypeId: PrototypeId): PrototypeDefinition {
  const prototype = PROTOTYPE_BY_ID.get(prototypeId);
  if (!prototype) throw new Error(`Unknown CLS prototype: ${prototypeId}`);
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

function entitiesForClass(semanticClass: SemanticClass): SemanticEntity[] {
  return semanticClass.memberEntityIds.map(requireEntity);
}

function eligibleClasses(prototype: PrototypeDefinition): SemanticClass[] {
  return prototype.eligibleClassIds.map(requireClass);
}

function contrastClasses(
  positiveClass: SemanticClass,
  classes: readonly SemanticClass[],
): SemanticClass[] {
  return classes.filter((candidate) =>
    candidate.classId !== positiveClass.classId
    && candidate.contrastGroup === positiveClass.contrastGroup
    && candidate.surfaceKind === positiveClass.surfaceKind,
  );
}

function choosePositiveClass(prototype: PrototypeDefinition, rng: Rng): SemanticClass {
  const classes = eligibleClasses(prototype);
  const viable = classes.filter((candidate) => contrastClasses(candidate, classes).length > 0);
  if (viable.length === 0) throw new Error(`Prototype ${prototype.prototypeId} has no viable class`);
  return viable[rng.int(viable.length)]!;
}

function classMembership(entity: SemanticEntity, classId: string): boolean {
  return entity.classIds.includes(classId);
}

function evidenceLine(entity: SemanticEntity, semanticClass: SemanticClass): string {
  return classMembership(entity, semanticClass.classId)
    ? `${entity.label} belongs to the class ${semanticClass.label}.`
    : `${entity.label} does not belong to the class ${semanticClass.label}.`;
}

function ruleSupports(labels: readonly string[], eligibleClassIds: readonly string[]): RuleSupport[] {
  const entities = labels.map((label) => {
    const entity = ENTITY_BY_LABEL.get(label.toLocaleLowerCase("en-IN"));
    if (!entity) throw new Error(`Independent solver could not resolve displayed option: ${label}`);
    return entity;
  });

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
    };
  });
}

function auditOutlier(labels: readonly string[], eligibleClassIds: readonly string[]): AmbiguityAudit {
  const supports = ruleSupports(labels, eligibleClassIds);
  const candidates = supports.filter((support) => support.supportCount === labels.length - 1 && support.outlierIndex !== null);
  if (candidates.length === 0) {
    return { result: "NO_VALID_RULE", winningClassId: null, winningOutlierIndex: null, supports };
  }

  const bestRank = Math.max(...candidates.map((candidate) => candidate.qualityRank));
  const best = candidates.filter((candidate) => candidate.qualityRank === bestRank);
  const distinctOutliers = new Set(best.map((candidate) => candidate.outlierIndex));
  if (distinctOutliers.size !== 1) {
    return { result: "AMBIGUOUS", winningClassId: null, winningOutlierIndex: null, supports };
  }

  const winner = [...best].sort((left, right) => left.classId.localeCompare(right.classId))[0]!;
  return {
    result: "UNIQUE",
    winningClassId: winner.classId,
    winningOutlierIndex: winner.outlierIndex,
    supports,
  };
}

function sharedEligibleClasses(labels: readonly string[], eligibleClassIds: readonly string[]): string[] {
  const entities = labels.map((label) => {
    const entity = ENTITY_BY_LABEL.get(label.toLocaleLowerCase("en-IN"));
    if (!entity) throw new Error(`Independent solver could not resolve displayed given: ${label}`);
    return entity;
  });
  return eligibleClassIds.filter((classId) => entities.every((entity) => classMembership(entity, classId)));
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

  const shared = sharedEligibleClasses(givens, prototype.eligibleClassIds);
  if (shared.length !== 1) {
    throw new Error(`Expected one shared class for givens, found ${shared.length}`);
  }
  const classId = shared[0]!;
  const resolvedOptions = options.map((label) => {
    const entity = ENTITY_BY_LABEL.get(label.toLocaleLowerCase("en-IN"));
    if (!entity) throw new Error(`Independent solver could not resolve displayed option: ${label}`);
    return entity;
  });
  const matchingIndices = resolvedOptions
    .map((entity, index) => classMembership(entity, classId) ? index : -1)
    .filter((index) => index >= 0);
  if (matchingIndices.length !== 1) {
    throw new Error(`Expected one class-member option, found ${matchingIndices.length}`);
  }
  const supports = ruleSupports(options, prototype.eligibleClassIds);
  return {
    correctIndex: matchingIndices[0]!,
    classId,
    audit: {
      result: "UNIQUE",
      winningClassId: classId,
      winningOutlierIndex: matchingIndices[0]!,
      supports,
    },
  };
}

function chooseDifficulty(prototype: PrototypeDefinition, seed: number): Difficulty {
  if (prototype.family === "DIRECT_CATEGORY") return seed % 4 === 0 ? "MEDIUM" : "EASY";
  if (prototype.family === "INVERSE_CLASS_MEMBER") return seed % 5 === 0 ? "HARD" : "MEDIUM";
  if (prototype.family === "PART_WHOLE") return seed % 3 === 0 ? "HARD" : "MEDIUM";
  return seed % 4 === 0 ? "HARD" : "MEDIUM";
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
    "Three of the following options belong to one class. Which one does not belong to that class?",
    "Choose the option that is different from the other three.",
    "Which of the following is the odd one out?",
    "Identify the option that does not share the common classification of the other three.",
    "Three options can be placed in the same category. Select the remaining option.",
    "Find the item that cannot be grouped with the other three.",
    "One option falls outside the class formed by the others. Which is it?",
    "Select the differently classified option.",
  ];
  return templates[(rng.int(templates.length) + seed) % templates.length]!;
}

function buildExplanation(
  prototype: PrototypeDefinition,
  semanticClass: SemanticClass,
  givens: readonly SemanticEntity[],
  options: readonly SemanticEntity[],
  correctIndex: number,
): Explanation {
  const answer = options[correctIndex]!;
  if (prototype.task === "SELECT_CLASS_MEMBER") {
    return {
      coreRule: [
        `${givens.map((entity) => entity.label).join(", ")} are all ${semanticClass.label}.`,
        `${answer.label} is the only option that belongs to the same class.`,
      ],
      optionChecks: options.map((entity) => evidenceLine(entity, semanticClass)),
      examSpeedShortcut: [semanticClass.shortcut, "First name the class formed by the given items, then test each option against that exact class."],
      commonTraps: [semanticClass.trap, "Do not select a merely related item; it must be a genuine member of the same class."],
    };
  }

  return {
    coreRule: [
      semanticClass.explanation,
      `${answer.label} is the outlier because it does not belong to that class.`,
    ],
    optionChecks: options.map((entity) => evidenceLine(entity, semanticClass)),
    examSpeedShortcut: [semanticClass.shortcut, "Confirm the rule on three options before marking the remaining option."],
    commonTraps: [semanticClass.trap, "Avoid using a broader similarity that includes all four options."],
  };
}

function assertNoLearnerLeak(text: string): void {
  if (/CLS[-_]|PROT|classId|entityId/i.test(text)) {
    throw new Error(`Learner-facing internal identifier leak: ${text}`);
  }
}

function validateQuestion(question: GeneratedClassificationQuestion): void {
  if (question.options.length !== 4 || new Set(question.options.map((option) => option.toLocaleLowerCase("en-IN"))).size !== 4) {
    throw new Error("Classification question must have four unique options");
  }
  if (question.correctIndex < 0 || question.correctIndex > 3 || question.options[question.correctIndex] !== question.answer) {
    throw new Error("Classification answer/index mismatch");
  }
  if (question.ambiguityAudit.result !== "UNIQUE") {
    throw new Error(`Classification ambiguity audit failed: ${question.ambiguityAudit.result}`);
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

function generateOutlier(prototype: PrototypeDefinition, seed: number, rng: Rng): GeneratedClassificationQuestion {
  const positiveClass = choosePositiveClass(prototype, rng);
  const contrasts = contrastClasses(positiveClass, eligibleClasses(prototype));
  const contrastClass = contrasts[rng.int(contrasts.length)]!;
  const positiveEntities = sampleDistinct(entitiesForClass(positiveClass), 3, rng);
  const outlier = sampleDistinct(entitiesForClass(contrastClass), 1, rng)[0]!;
  const displayedEntities = shuffled([...positiveEntities, outlier], rng);
  const canonicalCorrectIndex = displayedEntities.findIndex((entity) => entity.entityId === outlier.entityId);
  const independent = solveIndependently(prototype, [], displayedEntities.map((entity) => entity.label));
  if (canonicalCorrectIndex !== independent.correctIndex || independent.classId !== positiveClass.classId) {
    throw new Error("Canonical and independent classification solvers disagree");
  }
  const question: GeneratedClassificationQuestion = {
    chapterId: "CLS-001",
    checkpointId: "CLS-CP-001",
    prototypeId: prototype.prototypeId,
    seed,
    task: prototype.task,
    family: prototype.family,
    difficulty: chooseDifficulty(prototype, seed),
    intendedClassId: positiveClass.classId,
    intendedClassLabel: positiveClass.label,
    stem: buildStem(prototype, [], seed, rng),
    givens: [],
    options: displayedEntities.map((entity) => entity.label),
    correctIndex: canonicalCorrectIndex,
    answer: outlier.label,
    evidenceByOption: displayedEntities.map((entity) => evidenceLine(entity, positiveClass)),
    ambiguityAudit: independent.audit,
    explanation: buildExplanation(prototype, positiveClass, [], displayedEntities, canonicalCorrectIndex),
    metadata: {
      datasetVersion: DATASET_VERSION,
      locale: "en-IN",
      renderer: "TEXT",
      independentSolverVerified: true,
    },
    lifecycle: LIFECYCLE,
  };
  validateQuestion(question);
  return question;
}

function generateClassMember(prototype: PrototypeDefinition, seed: number, rng: Rng): GeneratedClassificationQuestion {
  const positiveClass = choosePositiveClass(prototype, rng);
  const contrasts = contrastClasses(positiveClass, eligibleClasses(prototype));
  const positivePool = sampleDistinct(entitiesForClass(positiveClass), 4, rng);
  const givens = positivePool.slice(0, 3);
  const correctEntity = positivePool[3]!;
  const negativePool = contrasts.flatMap(entitiesForClass);
  const negatives = sampleDistinct(negativePool, 3, rng);
  const displayedEntities = shuffled([correctEntity, ...negatives], rng);
  const canonicalCorrectIndex = displayedEntities.findIndex((entity) => entity.entityId === correctEntity.entityId);
  const independent = solveIndependently(
    prototype,
    givens.map((entity) => entity.label),
    displayedEntities.map((entity) => entity.label),
  );
  if (canonicalCorrectIndex !== independent.correctIndex || independent.classId !== positiveClass.classId) {
    throw new Error("Canonical and independent class-member solvers disagree");
  }
  const question: GeneratedClassificationQuestion = {
    chapterId: "CLS-001",
    checkpointId: "CLS-CP-001",
    prototypeId: prototype.prototypeId,
    seed,
    task: prototype.task,
    family: prototype.family,
    difficulty: chooseDifficulty(prototype, seed),
    intendedClassId: positiveClass.classId,
    intendedClassLabel: positiveClass.label,
    stem: buildStem(prototype, givens, seed, rng),
    givens: givens.map((entity) => entity.label),
    options: displayedEntities.map((entity) => entity.label),
    correctIndex: canonicalCorrectIndex,
    answer: correctEntity.label,
    evidenceByOption: displayedEntities.map((entity) => evidenceLine(entity, positiveClass)),
    ambiguityAudit: independent.audit,
    explanation: buildExplanation(prototype, positiveClass, givens, displayedEntities, canonicalCorrectIndex),
    metadata: {
      datasetVersion: DATASET_VERSION,
      locale: "en-IN",
      renderer: "TEXT",
      independentSolverVerified: true,
    },
    lifecycle: LIFECYCLE,
  };
  validateQuestion(question);
  return question;
}

export function generateClsCp001Prototype(
  prototypeId: PrototypeId,
  seed: number,
): GeneratedClassificationQuestion {
  if (!Number.isSafeInteger(seed) || seed < 0) throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  const prototype = requirePrototype(prototypeId);
  const rng = makeRng(seed, prototypeId);
  return prototype.task === "SELECT_CLASS_MEMBER"
    ? generateClassMember(prototype, seed, rng)
    : generateOutlier(prototype, seed, rng);
}

export function independentlyVerifyClsCp001Question(
  question: GeneratedClassificationQuestion,
): IndependentSolution {
  const prototype = requirePrototype(question.prototypeId);
  return solveIndependently(prototype, question.givens, question.options);
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
