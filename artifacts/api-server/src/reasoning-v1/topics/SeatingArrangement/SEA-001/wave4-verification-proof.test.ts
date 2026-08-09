import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { constraintTrueInOrder } from "./cp003/constraints.ts";
import { generateCircularCaselet, SEA_CP003_BLUEPRINTS } from "./cp003/generator.ts";
import { assertCircularOptionRecomputations } from "./cp003/option-recomputation.ts";
import { enumerateCircularOracle, enumerateCircularProduction } from "./cp003/solvers.ts";
import { circularCanonicalKey, rotateOrder } from "./cp003/topology.ts";
import type { CircularConstraint, CircularSolverModel, PersonId } from "./cp003/types.ts";
import {
  assertIndependentModelOracleAgreement,
  verifyIndependentModelOracle,
} from "./verification/model-oracle.ts";
import { compileCircularTeachingTrace } from "./verification/proof-trace-compiler.ts";
import { projectCircularCaseletToQuestionStudio } from "./verification/question-studio-schema.ts";

function renamePerson(personId: PersonId, mapping: ReadonlyMap<PersonId, PersonId>): PersonId {
  const renamed = mapping.get(personId);
  if (!renamed) throw new Error(`Missing rename mapping for ${personId}`);
  return renamed;
}

function renameConstraint(
  constraint: CircularConstraint,
  mapping: ReadonlyMap<PersonId, PersonId>,
): CircularConstraint {
  switch (constraint.kind) {
    case "CYCLIC_POSITION":
      return {
        ...constraint,
        subjectId: renamePerson(constraint.subjectId, mapping),
        referenceId: renamePerson(constraint.referenceId, mapping),
      };
    case "RELATIVE_POSITION":
      return {
        ...constraint,
        subjectId: renamePerson(constraint.subjectId, mapping),
        referenceId: renamePerson(constraint.referenceId, mapping),
      };
    case "ADJACENT":
    case "NOT_ADJACENT":
    case "OPPOSITE":
      return {
        ...constraint,
        firstId: renamePerson(constraint.firstId, mapping),
        secondId: renamePerson(constraint.secondId, mapping),
      };
    case "DIRECTIONAL_COUNT_BETWEEN":
      return {
        ...constraint,
        firstId: renamePerson(constraint.firstId, mapping),
        secondId: renamePerson(constraint.secondId, mapping),
      };
    case "LANDMARK_ANCHOR":
      return {
        ...constraint,
        personId: renamePerson(constraint.personId, mapping),
      };
  }
}

function keys(models: readonly CircularSolverModel[]): readonly string[] {
  return models.map((model) => model.canonicalKey).sort((left, right) => left.localeCompare(right));
}

const casesPerBlueprint = 12;
let verifiedCaselets = 0;
let verifiedChildren = 0;
let renameProofs = 0;
let clueOrderProofs = 0;
let rotationProofs = 0;
let supportiveClueProofs = 0;
let essentialClueProofs = 0;
let optionRecomputations = 0;
let schemaBundles = 0;
let teachingTraces = 0;
const startedAt = performance.now();

for (const blueprint of SEA_CP003_BLUEPRINTS) {
  for (let index = 0; index < casesPerBlueprint; index += 1) {
    const seed = `SEA-WAVE4-${blueprint}-${String(index).padStart(3, "0")}`;
    const caselet = generateCircularCaselet(seed, blueprint);
    const persons = caselet.solverOracleAgreement.productionKeys[0]?.split("|") ?? [];
    assert.equal(persons.length, caselet.topologySnapshot.seatCount);
    const landmarkAnchored = caselet.topologySnapshot.landmark !== undefined;
    const solveInput = { persons, constraints: caselet.constraints, landmarkAnchored };

    const agreement = verifyIndependentModelOracle(
      {
        productionName: "circular-person-assignment-backtracker",
        oracleName: "circular-seat-filling-enumerator",
        enumerateProduction: enumerateCircularProduction,
        enumerateOracle: enumerateCircularOracle,
      },
      solveInput,
    );
    assertIndependentModelOracleAgreement(agreement);
    assert.deepEqual(agreement.productionKeys, caselet.solverOracleAgreement.productionKeys);

    const reversedInput = { ...solveInput, constraints: [...caselet.constraints].reverse() };
    assert.deepEqual(keys(enumerateCircularProduction(reversedInput)), keys(enumerateCircularProduction(solveInput)));
    assert.deepEqual(keys(enumerateCircularOracle(reversedInput)), keys(enumerateCircularOracle(solveInput)));
    clueOrderProofs += 1;

    const mapping = new Map<PersonId, PersonId>(
      [...persons].sort().map((personId, personIndex) => [personId, `P${String(personIndex + 1).padStart(2, "0")}`]),
    );
    const renamedPersons = persons.map((personId) => renamePerson(personId, mapping));
    const renamedConstraints = caselet.constraints.map((constraint) => renameConstraint(constraint, mapping));
    const renamedModels = enumerateCircularProduction({
      persons: renamedPersons,
      constraints: renamedConstraints,
      landmarkAnchored,
    });
    const expectedRenamedKey = caselet.solverOracleAgreement.productionKeys[0]
      ?.split("|")
      .map((personId) => renamePerson(personId, mapping))
      .join("|");
    assert.deepEqual(keys(renamedModels), expectedRenamedKey ? [expectedRenamedKey] : []);
    assert.deepEqual(
      keys(enumerateCircularOracle({ persons: renamedPersons, constraints: renamedConstraints, landmarkAnchored })),
      keys(renamedModels),
    );
    renameProofs += 1;

    if (!landmarkAnchored) {
      const solvedOrder = caselet.solverOracleAgreement.productionKeys[0]?.split("|") ?? [];
      for (let offset = 1; offset < solvedOrder.length; offset += 1) {
        const rotated = rotateOrder(solvedOrder, offset);
        assert.equal(circularCanonicalKey(rotated, false), circularCanonicalKey(solvedOrder, false));
        assert.ok(caselet.constraints.every((constraint) => constraintTrueInOrder(constraint, rotated)));
      }
      rotationProofs += 1;
    }

    const solvedOrder = caselet.solverOracleAgreement.productionKeys[0]?.split("|") ?? [];
    const supportiveClue: CircularConstraint = {
      id: "SEA-WAVE4-SUPPORTIVE-ADJACENCY",
      kind: "ADJACENT",
      firstId: solvedOrder[0] as PersonId,
      secondId: solvedOrder[1] as PersonId,
    };
    assert.ok(constraintTrueInOrder(supportiveClue, solvedOrder));
    const supportiveInput = { ...solveInput, constraints: [...caselet.constraints, supportiveClue] };
    assert.deepEqual(keys(enumerateCircularProduction(supportiveInput)), keys(enumerateCircularProduction(solveInput)));
    assert.deepEqual(keys(enumerateCircularOracle(supportiveInput)), keys(enumerateCircularOracle(solveInput)));
    supportiveClueProofs += 1;

    for (const clue of caselet.constraints) {
      const trialConstraints = caselet.constraints.filter((candidate) => candidate.id !== clue.id);
      const trialModels = landmarkAnchored && !trialConstraints.some((candidate) => candidate.kind === "LANDMARK_ANCHOR")
        ? []
        : enumerateCircularProduction({ persons, constraints: trialConstraints, landmarkAnchored, maxModels: 2 });
      assert.notEqual(trialModels.length, 1, `Displayed clue ${clue.id} was not sensitivity-bearing`);
      essentialClueProofs += 1;
    }

    for (const child of caselet.children) {
      assertCircularOptionRecomputations(child, solvedOrder);
      optionRecomputations += child.options.length;
    }

    const bundle = projectCircularCaseletToQuestionStudio(caselet);
    assert.equal(bundle.parent.caseletId, caselet.caseletId);
    assert.deepEqual(bundle.parent.childQuestionIds, bundle.children.map((child) => child.questionId));
    assert.equal(bundle.parent.clueRecords.length, caselet.constraints.length);
    assert.equal(bundle.parent.solutionClassCount, 1);
    assert.equal(bundle.parent.solverOracleAgreement, true);
    assert.equal(bundle.parent.bankStatus, "LOCKED");
    assert.equal(bundle.parent.testEligibility, false);
    assert.equal(bundle.parent.publiclyPublishable, false);
    assert.equal(bundle.children.length, caselet.children.length);
    for (const child of bundle.children) {
      assert.equal(child.options.length, 4);
      assert.equal(child.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(child.options[child.correctIndex]?.isCorrect, true);
      assert.deepEqual(child.modelSetUsed, caselet.solverOracleAgreement.productionKeys);
    }
    schemaBundles += 1;

    const teachingTrace = compileCircularTeachingTrace(caselet);
    assert.deepEqual(teachingTrace.sourceEventIds, caselet.proofTrace.map((event) => event.id));
    assert.match(teachingTrace.text, /left is clockwise and right is anticlockwise/i);
    assert.match(teachingTrace.text, /final clockwise arrangement/i);
    assert.match(teachingTrace.text, /only valid circular solution class/i);
    assert.doesNotMatch(teachingTrace.text, /\b(dfs|backtracking|recursive|search node)\b/i);
    teachingTraces += 1;

    verifiedCaselets += 1;
    verifiedChildren += caselet.children.length;
  }
}

assert.equal(verifiedCaselets, SEA_CP003_BLUEPRINTS.length * casesPerBlueprint);
assert.equal(verifiedChildren, verifiedCaselets * 4);
assert.equal(renameProofs, verifiedCaselets);
assert.equal(clueOrderProofs, verifiedCaselets);
assert.equal(supportiveClueProofs, verifiedCaselets);
assert.equal(optionRecomputations, verifiedChildren * 4);
assert.equal(schemaBundles, verifiedCaselets);
assert.equal(teachingTraces, verifiedCaselets);
assert.ok(rotationProofs > 0);
assert.ok(essentialClueProofs > verifiedCaselets);

console.log("PASS_SEA_001_WAVE4_VERIFICATION_HARDENING");
console.log(`verified caselets ${verifiedCaselets}`);
console.log(`verified child questions ${verifiedChildren}`);
console.log(`rename metamorphic proofs ${renameProofs}`);
console.log(`clue-order metamorphic proofs ${clueOrderProofs}`);
console.log(`rotation metamorphic proofs ${rotationProofs}`);
console.log(`supportive-clue invariance proofs ${supportiveClueProofs}`);
console.log(`essential-clue sensitivity proofs ${essentialClueProofs}`);
console.log(`option recomputations ${optionRecomputations}`);
console.log(`Question Studio bundles ${schemaBundles}`);
console.log(`teaching traces ${teachingTraces}`);
console.log(`elapsed milliseconds ${Math.round(performance.now() - startedAt)}`);
console.log("permanent QLs 0");
