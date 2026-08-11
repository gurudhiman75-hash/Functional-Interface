import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import { canonicalDigest } from "../canonical.ts";
import { canonicalCircularOrder, CircularTopology, personAt, seatIndexOf } from "../cp003/topology.ts";
import {
  mixedCircularConstraintFingerprint,
  mixedCircularConstraintTrue,
  moveMixedCircularRelative,
  renderMixedCircularConstraint,
} from "./constraints.ts";
import { buildMixedCircularChildren } from "./questions.ts";
import { enumerateMixedCircularOracle, enumerateMixedCircularProduction } from "./solvers.ts";
import type {
  MixedCircularBlueprintId,
  MixedCircularCaseletRecord,
  MixedCircularConstraint,
  MixedCircularFacing,
  MixedCircularPersonId,
} from "./types.ts";

const NAMES = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

export const SEA_CP005_BLUEPRINTS: readonly MixedCircularBlueprintId[] = [
  "SEA-PBA-017",
  "SEA-PBA-018",
  "SEA-PBA-019",
  "SEA-PBA-020",
];

const LIFECYCLE = Object.freeze({
  discoveryStatus: "EXECUTABLE_FOUNDATION" as const,
  permanentQlCount: 0 as const,
  questionStudioRegistered: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

function nextIdFactory(): () => string {
  let serial = 0;
  return () => `SEA-CP005-CL-${String(++serial).padStart(3, "0")}`;
}

function deriveFacings(
  persons: readonly MixedCircularPersonId[],
  random: DeterministicRandom,
): Readonly<Record<MixedCircularPersonId, MixedCircularFacing>> {
  for (let retry = 0; retry < 24; retry += 1) {
    const record: Record<MixedCircularPersonId, MixedCircularFacing> = {};
    let centre = 0;
    let outward = 0;
    for (const personId of persons) {
      const facing = random.pick(["CENTRE", "OUTWARD"] as const);
      record[personId] = facing;
      if (facing === "CENTRE") centre += 1;
      else outward += 1;
    }
    if (centre >= 2 && outward >= 2) return record;
  }
  const fallback: Record<MixedCircularPersonId, MixedCircularFacing> = {};
  persons.forEach((personId, index) => {
    fallback[personId] = index % 2 === 0 ? "CENTRE" : "OUTWARD";
  });
  return fallback;
}

function relativeConstraint(
  order: readonly MixedCircularPersonId[],
  facings: Readonly<Record<MixedCircularPersonId, MixedCircularFacing>>,
  referenceIndex: number,
  subjectIndex: number,
  id: string,
): MixedCircularConstraint {
  const topology = new CircularTopology(order.length);
  const referenceId = personAt(order, referenceIndex);
  const subjectId = personAt(order, subjectIndex);
  const facing = facings[referenceId];
  if (!facing) throw new Error(`Missing hidden facing for ${referenceId}`);
  const clockwiseSteps = (subjectIndex - referenceIndex + order.length) % order.length;
  const anticlockwiseSteps = order.length - clockwiseSteps;
  const useClockwise = clockwiseSteps <= anticlockwiseSteps;
  const steps = Math.min(clockwiseSteps, anticlockwiseSteps);
  const direction = facing === "CENTRE"
    ? useClockwise ? "LEFT" : "RIGHT"
    : useClockwise ? "RIGHT" : "LEFT";
  const target = moveMixedCircularRelative(topology, referenceIndex, facing, direction, steps);
  if (target !== ((subjectIndex % order.length) + order.length) % order.length) {
    throw new Error("Failed to derive mixed-circle relative clue");
  }
  return { id, kind: "RELATIVE_POSITION", subjectId, referenceId, direction, steps };
}

function cyclicChain(
  order: readonly MixedCircularPersonId[],
  included: readonly MixedCircularPersonId[],
  nextId: () => string,
): MixedCircularConstraint[] {
  const constraints: MixedCircularConstraint[] = [];
  for (let index = 1; index < included.length; index += 1) {
    const referenceId = included[index - 1];
    const subjectId = included[index];
    if (!referenceId || !subjectId) continue;
    const referenceIndex = seatIndexOf(order, referenceId);
    const subjectIndex = seatIndexOf(order, subjectId);
    const steps = (subjectIndex - referenceIndex + order.length) % order.length;
    constraints.push({
      id: nextId(),
      kind: "CYCLIC_POSITION",
      subjectId,
      referenceId,
      direction: "CLOCKWISE",
      steps,
    });
  }
  return constraints;
}

function facingChain(
  order: readonly MixedCircularPersonId[],
  facings: Readonly<Record<MixedCircularPersonId, MixedCircularFacing>>,
  nextId: () => string,
  includeDirectAnchor: boolean,
): MixedCircularConstraint[] {
  const constraints: MixedCircularConstraint[] = [];
  if (includeDirectAnchor) {
    const first = order[0];
    if (!first) throw new Error("Missing facing-chain anchor");
    constraints.push({ id: nextId(), kind: "FACING", personId: first, facing: facings[first]! });
  }
  for (let index = 1; index < order.length; index += 1) {
    const firstId = order[index - 1];
    const secondId = order[index];
    if (!firstId || !secondId) continue;
    constraints.push({
      id: nextId(),
      kind: facings[firstId] === facings[secondId] ? "SAME_FACING" : "OPPOSITE_FACING",
      firstId,
      secondId,
    });
  }
  return constraints;
}

function buildConstraints(
  blueprint: MixedCircularBlueprintId,
  order: readonly MixedCircularPersonId[],
  facings: Readonly<Record<MixedCircularPersonId, MixedCircularFacing>>,
): readonly MixedCircularConstraint[] {
  const nextId = nextIdFactory();
  const constraints: MixedCircularConstraint[] = [];

  if (blueprint === "SEA-PBA-017") {
    // Known-direction ring. Every facing is stated. Two seats immediately on
    // either side of A are deliberately left unresolved by the absolute
    // clockwise chain; A's stated facing plus one relative clue selects which
    // of those two seats contains the target. Removing A's facing therefore
    // creates a genuine alternate-facing/alternate-placement model.
    for (const personId of order) {
      constraints.push({ id: nextId(), kind: "FACING", personId, facing: facings[personId]! });
    }
    const clockwiseLeaf = personAt(order, 1);
    const anticlockwiseLeaf = personAt(order, -1);
    const included = order.filter((personId) => personId !== clockwiseLeaf && personId !== anticlockwiseLeaf);
    constraints.push(...cyclicChain(order, included, nextId));
    constraints.push(relativeConstraint(order, facings, 0, 1, nextId()));
  } else if (blueprint === "SEA-PBA-018") {
    // Inferred-direction ring. The circular positions are fixed by cyclic clues,
    // but no facing is stated directly. Each reference person's own relative
    // clue determines whether that person faces the centre or outward.
    constraints.push(...cyclicChain(order, order, nextId));
    for (let index = 0; index < order.length; index += 1) {
      constraints.push(relativeConstraint(order, facings, index, index + 2, nextId()));
    }
  } else if (blueprint === "SEA-PBA-019") {
    if (order.length % 2 !== 0) throw new Error("SEA-PBA-019 requires an even ring");
    constraints.push(...facingChain(order, facings, nextId, true));
    const oppositeLeaf = order[order.length / 2]!;
    const gapLeaf = order[2]!;
    const freeLeaf = order[order.length - 1]!;
    constraints.push({
      id: nextId(),
      kind: "OPPOSITE",
      firstId: order[0]!,
      secondId: oppositeLeaf,
    });
    constraints.push({
      id: nextId(),
      kind: "DIRECTIONAL_COUNT_BETWEEN",
      firstId: order[0]!,
      secondId: gapLeaf,
      direction: "CLOCKWISE",
      count: 1,
    });
    const excluded = new Set([oppositeLeaf, gapLeaf, freeLeaf]);
    constraints.push(...cyclicChain(order, order.filter((personId) => !excluded.has(personId)), nextId));
  } else {
    const referenceId = order[0]!;
    const referenceFacing = facings[referenceId]!;
    const topology = new CircularTopology(order.length);
    const subjectSeat = referenceFacing === "CENTRE"
      ? moveMixedCircularRelative(topology, 0, "CENTRE", "LEFT", 1)
      : moveMixedCircularRelative(topology, 0, "OUTWARD", "LEFT", 2);
    const subjectId = personAt(order, subjectSeat);
    const spareId = order[order.length - 1]!;
    if (subjectId === spareId) throw new Error("Conditional subject collided with spare person");

    constraints.push(...facingChain(order, facings, nextId, false));
    constraints.push({
      id: nextId(),
      kind: "FACING_CONDITIONAL_RELATION",
      subjectId,
      referenceId,
      centreDirection: "LEFT",
      centreSteps: 1,
      outwardDirection: "LEFT",
      outwardSteps: 2,
    });
    const excluded = new Set([subjectId, spareId]);
    constraints.push(...cyclicChain(order, order.filter((personId) => !excluded.has(personId)), nextId));
  }

  if (constraints.some((constraint) => !mixedCircularConstraintTrue(constraint, order, facings))) {
    throw new Error("Derived a false mixed-circle clue");
  }
  if (new Set(constraints.map(mixedCircularConstraintFingerprint)).size !== constraints.length) {
    throw new Error("Derived duplicate mixed-circle clue semantics");
  }
  return constraints;
}

function modelCount(
  persons: readonly MixedCircularPersonId[],
  constraints: readonly MixedCircularConstraint[],
): number {
  return enumerateMixedCircularProduction({ persons, constraints, maxModels: 2 }).length;
}

function minimiseConstraints(
  persons: readonly MixedCircularPersonId[],
  candidate: readonly MixedCircularConstraint[],
): readonly MixedCircularConstraint[] {
  const constraints = [...candidate];
  if (modelCount(persons, constraints) !== 1) throw new Error("Candidate mixed-circle clue set is not unique");
  for (let index = constraints.length - 1; index >= 0; index -= 1) {
    const trial = constraints.filter((_, candidateIndex) => candidateIndex !== index);
    if (modelCount(persons, trial) === 1) constraints.splice(index, 1);
  }
  return constraints;
}

function assertBlueprintSignature(
  blueprint: MixedCircularBlueprintId,
  constraints: readonly MixedCircularConstraint[],
): void {
  if (blueprint === "SEA-PBA-017"
    && (!constraints.some((constraint) => constraint.kind === "FACING")
      || !constraints.some((constraint) => constraint.kind === "RELATIVE_POSITION"))) {
    throw new Error("SEA-PBA-017 lost its known-facing relative-ring signature");
  }
  if (blueprint === "SEA-PBA-018"
    && (constraints.some((constraint) => constraint.kind === "FACING")
      || !constraints.some((constraint) => constraint.kind === "RELATIVE_POSITION"))) {
    throw new Error("SEA-PBA-018 lost its no-direct-facing inferred-direction signature");
  }
  if (blueprint === "SEA-PBA-019"
    && (!constraints.some((constraint) => constraint.kind === "OPPOSITE")
      || !constraints.some((constraint) => constraint.kind === "DIRECTIONAL_COUNT_BETWEEN"))) {
    throw new Error("SEA-PBA-019 lost its opposite/gap signature");
  }
  if (blueprint === "SEA-PBA-020"
    && !constraints.some((constraint) => constraint.kind === "FACING_CONDITIONAL_RELATION")) {
    throw new Error("SEA-PBA-020 lost its conditional-orientation signature");
  }
}

function assertDisplayedClueSensitivity(
  persons: readonly MixedCircularPersonId[],
  constraints: readonly MixedCircularConstraint[],
): void {
  if (modelCount(persons, constraints) !== 1) throw new Error("Mixed-circle clue set is not unique");
  for (const clue of constraints) {
    const trial = constraints.filter((candidate) => candidate.id !== clue.id);
    if (modelCount(persons, trial) === 1) {
      throw new Error(`Displayed redundant mixed-circle clue: ${clue.id}`);
    }
  }
}

function attempt(
  seed: string,
  blueprint: MixedCircularBlueprintId,
): MixedCircularCaseletRecord {
  const random = new DeterministicRandom(seed);
  const seatCount = blueprint === "SEA-PBA-019"
    ? random.pick([6, 8])
    : random.pick([6, 7, 8]);
  const persons = NAMES.slice(0, seatCount);
  const order = canonicalCircularOrder(random.shuffle(persons), false);
  const facings = deriveFacings(persons, random);
  const constraints = minimiseConstraints(persons, buildConstraints(blueprint, order, facings));
  assertBlueprintSignature(blueprint, constraints);
  assertDisplayedClueSensitivity(persons, constraints);

  const production = enumerateMixedCircularProduction({ persons, constraints });
  const oracle = enumerateMixedCircularOracle({ persons, constraints });
  const productionKeys = production.map((model) => model.canonicalKey);
  const oracleKeys = oracle.map((model) => model.canonicalKey);
  if (productionKeys.length !== 1 || JSON.stringify(productionKeys) !== JSON.stringify(oracleKeys)) {
    throw new Error("Mixed-circle production/oracle disagreement");
  }
  const model = production[0];
  if (!model) throw new Error("Missing mixed-circle solution model");
  const children = buildMixedCircularChildren(seed, blueprint, model, random);
  const clueTexts = constraints.map(renderMixedCircularConstraint);

  const setupText = `${seatCount} persons—${persons.join(", ")}—are sitting around a circular table, but not necessarily in the same order. Some face the centre and the others face outward. Their facing directions and positions satisfy the following conditions.`;
  const facingSummary = model.clockwiseOrder
    .map((personId) => `${personId}[${model.facings[personId] === "CENTRE" ? "C" : "O"}]`)
    .join(" → ");
  const diagramText = `Clockwise from ${model.clockwiseOrder[0]} (rotation reference): ${facingSummary} → ${model.clockwiseOrder[0]}[${model.facings[model.clockwiseOrder[0]!] === "CENTRE" ? "C" : "O"}]. C = faces centre; O = faces outward.`;
  const sharedExplanation = [
    `Resolve both position and facing; the solved state must be unique up to rotation.`,
    `Facing rules: centre-facing left = clockwise and right = anticlockwise; outward-facing left = anticlockwise and right = clockwise.`,
    `The verified facing state is ${model.clockwiseOrder.map((personId) => `${personId}: ${model.facings[personId]!.toLowerCase()}`).join(", ")}.`,
    `Apply the seating clues with each reference person's own facing:`,
    ...clueTexts.map((clue, index) => `${index + 1}. ${clue}`),
    `Therefore, ${diagramText}`,
  ].join("\n");

  return {
    caseletId: `SEA-CP005-${canonicalDigest({ seed, blueprint }).slice(0, 16)}`,
    chapterId: "REAS-SEA",
    packageId: "SEA-001",
    checkpointId: "SEA-CP-005",
    blueprintAuthorityId: blueprint,
    seed,
    locale: "en-IN",
    difficultyFloor: "MEDIUM",
    setupText,
    clueTexts,
    constraints,
    topologySnapshot: {
      kind: "CIRCULAR_RING",
      seatCount,
      seatIndicesIncrease: "CLOCKWISE",
      facingMode: "MIXED",
    },
    solutionPolicy: "UNIQUE_CLASS_AND_FACING_STATE",
    solutionClassCount: 1,
    solverOracleAgreement: { productionKeys, oracleKeys, passed: true },
    queryFactFingerprints: children.map((child) => child.answerDeterminingFactFingerprint),
    checkpointSkillCoverage: [
      "MIXED_FACING_STATE_RESOLUTION",
      "REFERENCE_PERSON_FACING_FOR_LEFT_RIGHT",
      "ROTATION_CANONICALISATION",
      "CLOCKWISE_WRAP_AROUND",
      seatCount % 2 === 0 ? "EVEN_OPPOSITE_SEAT" : "ODD_OPPOSITE_GUARD",
      ...(blueprint === "SEA-PBA-020" ? ["FACING_CONDITIONAL_ORIENTATION"] : []),
    ],
    crossQuestionLeakagePassed:
      new Set(children.map((child) => child.answerDeterminingFactFingerprint)).size === children.length,
    children,
    diagramText,
    sharedExplanation,
    lifecycle: LIFECYCLE,
  };
}

export function generateMixedCircularCaselet(
  seed: string,
  blueprint: MixedCircularBlueprintId,
): MixedCircularCaseletRecord {
  if (!SEA_CP005_BLUEPRINTS.includes(blueprint)) {
    throw new Error(`Unsupported CP-005 blueprint: ${blueprint}`);
  }
  let lastError: unknown;
  for (let retry = 0; retry < 64; retry += 1) {
    try {
      return attempt(`${seed}::attempt-${retry}`, blueprint);
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`Failed to generate ${blueprint}: ${String(lastError)}`);
}

export function assertMixedCircularCaseletIntegrity(caselet: MixedCircularCaseletRecord): void {
  if (caselet.difficultyFloor !== "MEDIUM") throw new Error("CP-005 must begin at Medium");
  if (caselet.solutionClassCount !== 1 || !caselet.solverOracleAgreement.passed) {
    throw new Error("CP-005 solution policy failed");
  }
  if (caselet.children.length !== 4 || !caselet.crossQuestionLeakagePassed) {
    throw new Error("CP-005 child mix failed");
  }
  if (!caselet.children.slice(0, 2).every((child) =>
    child.referenceFacing !== undefined
      && child.oppositeFacingCounterfactual !== undefined
      && JSON.stringify(child.oppositeFacingCounterfactual) !== JSON.stringify(child.answer))) {
    throw new Error("CP-005 lacks facing-sensitive query counterfactuals");
  }
  if (new Set(caselet.constraints.map(mixedCircularConstraintFingerprint)).size !== caselet.constraints.length) {
    throw new Error("CP-005 semantic clue duplication");
  }
  for (const child of caselet.children) {
    if (child.options.length !== 4
      || child.options.filter((option) => option.isCorrect).length !== 1
      || new Set(child.options.map((option) => option.semanticFingerprint)).size !== 4
      || !child.options[child.answerIndex]?.isCorrect) {
      throw new Error("CP-005 option integrity failed");
    }
    if ((child.queryContractId === "SEA-QC-003" || child.queryContractId === "SEA-QC-005")
      && !/(faces the centre|faces outward)/i.test(child.explanation)) {
      throw new Error("CP-005 relative explanation omitted the reference facing");
    }
  }
  const key = caselet.solverOracleAgreement.productionKeys[0] ?? "";
  const facingMarkers = key.split("|").map((part) => part.split(":")[1]);
  if (!facingMarkers.includes("C") || !facingMarkers.includes("O")) {
    throw new Error("CP-005 accidentally produced uniform facing");
  }
  if (caselet.topologySnapshot.seatCount % 2 !== 0
    && (caselet.constraints.some((constraint) => constraint.kind === "OPPOSITE")
      || caselet.children.some((child) => child.queryContractId === "SEA-QC-010"))) {
    throw new Error("Odd mixed circle exposed an opposite relation");
  }
  if (caselet.blueprintAuthorityId === "SEA-PBA-020"
    && !caselet.constraints.some((constraint) => constraint.kind === "FACING_CONDITIONAL_RELATION")) {
    throw new Error("SEA-PBA-020 omitted conditional orientation");
  }
  if (caselet.lifecycle.permanentQlCount !== 0
    || caselet.lifecycle.questionBankWritable
    || caselet.lifecycle.testEligible
    || caselet.lifecycle.publiclyPublishable) {
    throw new Error("CP-005 lifecycle lock violated");
  }
}

// Backward-compatible discovery names retained from the earlier CP-005 surface.
export const generateMixedCircleCaselet = generateMixedCircularCaselet;
export const assertMixedCircleCaseletIntegrity = assertMixedCircularCaseletIntegrity;
