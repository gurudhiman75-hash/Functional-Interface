import assert from "node:assert/strict";
import {
  CLASS_BY_ID,
  CLS_CP001_CLASSES,
  CLS_CP001_ENTITIES,
  CLS_CP001_PROTOTYPES,
  ENTITY_BY_LABEL,
} from "./semantic-dataset.en";
import {
  generateClsCp001Prototype,
  getClsCp001SemanticDataset,
  independentlyVerifyClsCp001Question,
} from "./runtime";
import type { Difficulty, PrototypeDefinition, SemanticClass, SemanticEntity } from "./types";

function entityForLabel(label: string): SemanticEntity {
  const entity = ENTITY_BY_LABEL.get(label.toLocaleLowerCase("en-IN"));
  assert.ok(entity, `Missing entity for displayed value ${label}`);
  return entity!;
}

function expectedSemanticDemand(prototype: PrototypeDefinition, intendedClass: SemanticClass): 0 | 1 | 2 {
  if (prototype.family === "FUNCTIONAL_USE" || prototype.family === "PART_WHOLE") return 2;
  if (
    prototype.family === "HIERARCHY_CATEGORY"
    || prototype.family === "CROSS_CUTTING_CATEGORY"
    || intendedClass.surfaceKind === "PROPER_NOUN"
  ) return 1;
  return 0;
}

function expectedDifficulty(score: number): Difficulty {
  if (score <= 1) return "EASY";
  if (score <= 4) return "MEDIUM";
  return "HARD";
}

assert.equal(CLS_CP001_PROTOTYPES.length, 7);
assert.equal(new Set(CLS_CP001_PROTOTYPES.map((prototype) => prototype.prototypeId)).size, 7);
assert.ok(CLS_CP001_CLASSES.length >= 27);
assert.ok(CLS_CP001_ENTITIES.length >= 180);
assert.equal(new Set(CLS_CP001_CLASSES.map((semanticClass) => semanticClass.classId)).size, CLS_CP001_CLASSES.length);
assert.equal(new Set(CLS_CP001_ENTITIES.map((entity) => entity.entityId)).size, CLS_CP001_ENTITIES.length);
assert.equal(
  new Set(CLS_CP001_ENTITIES.map((entity) => entity.label.toLocaleLowerCase("en-IN"))).size,
  CLS_CP001_ENTITIES.length,
);
assert.ok(CLS_CP001_CLASSES.every((semanticClass) => semanticClass.memberEntityIds.length >= 8));
assert.ok(CLS_CP001_CLASSES.every((semanticClass) => semanticClass.qualityRank > 0));
assert.ok(CLS_CP001_CLASSES.every((semanticClass) => semanticClass.hierarchyDepth >= 0));
assert.ok(CLS_CP001_ENTITIES.every((entity) => entity.directClassIds.length >= 1));
assert.ok(CLS_CP001_ENTITIES.every((entity) => entity.classIds.length >= entity.directClassIds.length));
assert.ok(CLS_CP001_ENTITIES.filter((entity) => entity.classIds.length > 1).length >= 80);
assert.ok(CLS_CP001_ENTITIES.filter((entity) => entity.directClassIds.length > 1).length >= 10);

for (const semanticClass of CLS_CP001_CLASSES) {
  for (const parentId of semanticClass.parentClassIds) {
    const parent = CLASS_BY_ID.get(parentId);
    assert.ok(parent, `Missing parent class ${parentId}`);
    assert.ok(parent!.hierarchyDepth < semanticClass.hierarchyDepth);
    assert.ok(semanticClass.memberEntityIds.every((entityId) => parent!.memberEntityIds.includes(entityId)));
  }
}

const dataset = getClsCp001SemanticDataset();
assert.equal(dataset.version, "CLS-CP001-SEMANTIC-EN-v2");
assert.equal(dataset.classes.length, CLS_CP001_CLASSES.length);
assert.equal(dataset.entities.length, CLS_CP001_ENTITIES.length);

const aggregateAnswerPositions = [0, 0, 0, 0];
const aggregateDifficulties = new Map<Difficulty, number>([["EASY", 0], ["MEDIUM", 0], ["HARD", 0]]);
const allStems = new Set<string>();
const allRenderedQuestions = new Set<string>();
const prototypeSummaries: Record<string, {
  positions: number[];
  classes: Set<string>;
  stems: Set<string>;
  questions: number;
  difficulties: Set<Difficulty>;
  scoreRange: [number, number];
}> = {};

for (const prototype of CLS_CP001_PROTOTYPES) {
  const summary = {
    positions: [0, 0, 0, 0],
    classes: new Set<string>(),
    stems: new Set<string>(),
    questions: 0,
    difficulties: new Set<Difficulty>(),
    scoreRange: [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY] as [number, number],
  };
  prototypeSummaries[prototype.prototypeId] = summary;

  for (let seed = 0; seed < 200; seed += 1) {
    const generated = generateClsCp001Prototype(prototype.prototypeId, seed);
    const replay = generateClsCp001Prototype(prototype.prototypeId, seed);
    assert.deepEqual(generated, replay, `${prototype.prototypeId} seed ${seed} is not deterministic`);

    assert.equal(generated.chapterId, "CLS-001");
    assert.equal(generated.checkpointId, "CLS-CP-001");
    assert.equal(generated.prototypeId, prototype.prototypeId);
    assert.equal(generated.seed, seed);
    assert.equal(generated.generationProfile, prototype.generationProfile);
    assert.equal(generated.options.length, 4);
    assert.equal(generated.optionGroups.length, 0);
    assert.equal(new Set(generated.options.map((option) => option.toLocaleLowerCase("en-IN"))).size, 4);
    assert.equal(generated.options[generated.correctIndex], generated.answer);
    assert.equal(generated.ambiguityAudit.result, "UNIQUE");
    assert.equal(generated.ambiguityAudit.winningClassId, generated.intendedClassId);
    assert.equal(generated.metadata.datasetVersion, "CLS-CP001-SEMANTIC-EN-v2");
    assert.equal(generated.metadata.locale, "en-IN");
    assert.equal(generated.metadata.renderer, "TEXT");
    assert.equal(generated.metadata.independentSolverVerified, true);
    assert.equal(generated.metadata.hierarchyAware, true);
    assert.equal(generated.metadata.multiMembershipAware, true);
    assert.equal(generated.metadata.difficultyModel, "CLS-CP001-INSTANCE-DIFFICULTY-v1");
    assert.equal(generated.lifecycle.permanentQlId, null);
    assert.equal(generated.lifecycle.reviewStatus, "UNREVIEWED_DISCOVERY");
    assert.equal(generated.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(generated.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(generated.lifecycle.publiclyPublishable, false);
    assert.equal(generated.lifecycle.questionStudioDiscoverable, false);

    const independent = independentlyVerifyClsCp001Question(generated);
    assert.equal(independent.correctIndex, generated.correctIndex);
    assert.equal(independent.classId, generated.intendedClassId);
    assert.equal(independent.audit.result, "UNIQUE");

    const intendedClass = CLASS_BY_ID.get(generated.intendedClassId);
    assert.ok(intendedClass);
    assert.equal(intendedClass!.label, generated.intendedClassLabel);

    const optionEntities = generated.options.map(entityForLabel);
    const givenEntities = generated.givens.map(entityForLabel);
    const allItemEntities = [...new Map([...givenEntities, ...optionEntities].map((entity) => [entity.entityId, entity])).values()];
    const membershipCount = optionEntities.filter((entity) => entity.classIds.includes(generated.intendedClassId)).length;
    if (generated.task === "FIND_OUTLIER") {
      assert.equal(generated.givens.length, 0);
      assert.equal(membershipCount, generated.options.length - 1);
      assert.ok(!optionEntities[generated.correctIndex]!.classIds.includes(generated.intendedClassId));
    } else {
      assert.equal(generated.task, "SELECT_CLASS_MEMBER");
      assert.equal(generated.givens.length, 3);
      assert.equal(membershipCount, 1);
      assert.ok(optionEntities[generated.correctIndex]!.classIds.includes(generated.intendedClassId));
      assert.ok(givenEntities.every((entity) => entity.classIds.includes(generated.intendedClassId)));
    }

    const expectedParentSharing = intendedClass!.parentClassIds.some((parentClassId) =>
      allItemEntities.every((entity) => entity.classIds.includes(parentClassId)),
    );
    const expectedMultiMembership = allItemEntities.filter((entity) => entity.directClassIds.length > 1).length;
    const expectedCandidateRules = generated.task === "FIND_OUTLIER"
      ? generated.ambiguityAudit.supports.filter((support) => support.supportCount === generated.options.length - 1 && support.outlierIndex !== null).length
      : prototype.eligibleClassIds.filter((classId) => givenEntities.every((entity) => entity.classIds.includes(classId))).length;
    const expectedDemand = expectedSemanticDemand(prototype, intendedClass!);
    const expectedScore = Math.min(2, intendedClass!.hierarchyDepth)
      + (expectedParentSharing ? 1 : 0)
      + (expectedMultiMembership >= 3 ? 2 : expectedMultiMembership > 0 ? 1 : 0)
      + (expectedCandidateRules > 1 ? 1 : 0)
      + (generated.task === "SELECT_CLASS_MEMBER" ? 1 : 0)
      + (prototype.generationProfile === "CROSS_CUTTING" ? 2 : 0)
      + expectedDemand;

    assert.deepEqual(generated.difficultyFeatures, {
      hierarchyDepth: intendedClass!.hierarchyDepth,
      allItemsShareParent: expectedParentSharing,
      multiMembershipItemCount: expectedMultiMembership,
      candidateRuleCount: expectedCandidateRules,
      inverseTask: generated.task === "SELECT_CLASS_MEMBER",
      crossCutting: prototype.generationProfile === "CROSS_CUTTING",
      semanticDemand: expectedDemand,
      optionCount: 4,
      score: expectedScore,
    });
    assert.equal(generated.difficulty, expectedDifficulty(expectedScore));

    assert.equal(generated.evidenceByOption.length, generated.options.length);
    assert.ok(generated.evidenceByOption.every((line) => line.length > 20));
    assert.ok(generated.explanation.coreRule.length >= 3);
    assert.equal(generated.explanation.optionChecks.length, generated.options.length);
    assert.ok(generated.explanation.examSpeedShortcut.length >= 2);
    assert.ok(generated.explanation.commonTraps.length >= 2);

    const learnerText = [
      generated.stem,
      ...generated.givens,
      ...generated.options,
      ...generated.explanation.coreRule,
      ...generated.explanation.optionChecks,
      ...generated.explanation.examSpeedShortcut,
      ...generated.explanation.commonTraps,
    ].join("\n");
    assert.ok(!/CLS[-_]|PROT|classId|entityId|qualityRank|hierarchyDepth/i.test(learnerText));
    assert.ok(!/undefined|null|NaN|Infinity/.test(learnerText));

    summary.positions[generated.correctIndex] += 1;
    aggregateAnswerPositions[generated.correctIndex] += 1;
    aggregateDifficulties.set(generated.difficulty, aggregateDifficulties.get(generated.difficulty)! + 1);
    summary.classes.add(generated.intendedClassId);
    summary.stems.add(generated.stem);
    summary.questions += 1;
    summary.difficulties.add(generated.difficulty);
    summary.scoreRange[0] = Math.min(summary.scoreRange[0], generated.difficultyFeatures.score);
    summary.scoreRange[1] = Math.max(summary.scoreRange[1], generated.difficultyFeatures.score);
    allStems.add(generated.stem);
    allRenderedQuestions.add(JSON.stringify({
      prototypeId: generated.prototypeId,
      stem: generated.stem,
      givens: generated.givens,
      options: generated.options,
    }));
  }

  assert.deepEqual(summary.positions.map((count) => count > 0), [true, true, true, true]);
  const minPosition = Math.min(...summary.positions);
  const maxPosition = Math.max(...summary.positions);
  assert.ok(maxPosition / minPosition < 1.8, `${prototype.prototypeId} answer positions are too imbalanced: ${summary.positions}`);
  assert.ok(summary.classes.size >= Math.min(4, prototype.intendedClassIds.length));
  assert.ok(summary.stems.size >= 4);
  assert.equal(summary.questions, 200);
}

assert.equal(allRenderedQuestions.size, 1400, "Every deterministic prototype state should render uniquely across the audit seeds");
assert.ok(allStems.size >= 16);
const aggregateMin = Math.min(...aggregateAnswerPositions);
const aggregateMax = Math.max(...aggregateAnswerPositions);
assert.ok(aggregateMax / aggregateMin < 1.35, `Aggregate answer positions are imbalanced: ${aggregateAnswerPositions}`);
assert.ok((aggregateDifficulties.get("EASY") ?? 0) > 0);
assert.ok((aggregateDifficulties.get("MEDIUM") ?? 0) > 0);
assert.ok((aggregateDifficulties.get("HARD") ?? 0) > 0);
assert.ok(prototypeSummaries["CLS-CP001-PROT-001"]!.difficulties.size >= 2, "Direct category difficulty must vary with the generated class state");
assert.deepEqual(prototypeSummaries["CLS-CP001-PROT-006"]!.difficulties, new Set<Difficulty>(["HARD"]));

assert.throws(() => generateClsCp001Prototype("CLS-CP001-PROT-001", -1));
assert.throws(() => generateClsCp001Prototype("CLS-CP001-PROT-001", Number.MAX_SAFE_INTEGER + 1));
assert.throws(() => generateClsCp001Prototype("CLS-CP001-PROT-001", 0, 3 as never));

console.log("CLS-CP-001 instance-difficulty prototype audit passed.", {
  prototypes: CLS_CP001_PROTOTYPES.length,
  classes: CLS_CP001_CLASSES.length,
  entities: CLS_CP001_ENTITIES.length,
  multiMembershipEntities: CLS_CP001_ENTITIES.filter((entity) => entity.classIds.length > 1).length,
  directMultiMembershipEntities: CLS_CP001_ENTITIES.filter((entity) => entity.directClassIds.length > 1).length,
  generatedQuestions: 1400,
  aggregateAnswerPositions,
  aggregateDifficulties: Object.fromEntries(aggregateDifficulties),
  prototypeSummaries: Object.fromEntries(Object.entries(prototypeSummaries).map(([id, summary]) => [id, {
    positions: summary.positions,
    classes: summary.classes.size,
    stems: summary.stems.size,
    questions: summary.questions,
    difficulties: [...summary.difficulties].sort(),
    scoreRange: summary.scoreRange,
  }])),
});
