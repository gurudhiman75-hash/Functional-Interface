import { canonicalDigest } from "../canonical.ts";
import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import {
  presentSea001Children,
  presentSea001Text,
  sea001DisplayName,
  sea001DisplayNameMap,
  sea001PersonIds,
} from "../generation/person-presentation.ts";
import { circularConstraintFingerprint, constraintTrueInOrder, renderCircularConstraint } from "./constraints.ts";
import { buildCircularDiagram } from "./diagram.ts";
import { buildCircularChildren } from "./questions.ts";
import { enumerateCircularOracle, enumerateCircularProduction } from "./solvers.ts";
import { CircularTopology, canonicalCircularOrder, circularCanonicalKey, personAt, rotateOrder } from "./topology.ts";
import type {
  CircularBlueprintId,
  CircularCaseletRecord,
  CircularConstraint,
  CircularProofEvent,
  CircularTopologySnapshot,
  PersonId,
} from "./types.ts";

export const SEA_CP003_BLUEPRINTS: readonly CircularBlueprintId[] = ["SEA-PBA-009", "SEA-PBA-010", "SEA-PBA-011", "SEA-PBA-012"];
const LIFECYCLE = Object.freeze({
  discoveryStatus: "EXECUTABLE_FOUNDATION" as const,
  permanentQlCount: 0 as const,
  questionStudioRegistered: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

function countFor(blueprint: CircularBlueprintId, rng: DeterministicRandom): number {
  return blueprint === "SEA-PBA-009" ? rng.pick([6, 8, 10]) : rng.pick([6, 7, 8, 9, 10]);
}

function ids() {
  let serial = 0;
  return (): string => `SEA-CP003-CL-${String(++serial).padStart(3, "0")}`;
}

function chain(
  order: readonly PersonId[],
  nextId: () => string,
  excluded: ReadonlySet<PersonId> = new Set(),
): CircularConstraint[] {
  const persons = order.filter((person) => !excluded.has(person));
  const output: CircularConstraint[] = [];
  for (let index = 1; index < persons.length; index += 1) {
    const subject = persons[index];
    const reference = persons[index - 1];
    if (!subject || !reference) continue;
    const subjectSeat = order.indexOf(subject);
    const referenceSeat = order.indexOf(reference);
    const clockwise = (subjectSeat - referenceSeat + order.length) % order.length;
    const anticlockwise = order.length - clockwise;
    const cyclicDirection = clockwise <= anticlockwise ? "CLOCKWISE" as const : "ANTICLOCKWISE" as const;
    const steps = Math.min(clockwise, anticlockwise);

    if (index % 2 === 0) {
      output.push({
        id: nextId(),
        kind: "RELATIVE_POSITION",
        subjectId: subject,
        referenceId: reference,
        direction: cyclicDirection === "CLOCKWISE" ? "LEFT" : "RIGHT",
        steps,
      });
    } else {
      output.push({
        id: nextId(),
        kind: "CYCLIC_POSITION",
        subjectId: subject,
        referenceId: reference,
        direction: cyclicDirection,
        steps,
      });
    }
  }
  return output;
}

function constraintsFor(
  blueprint: CircularBlueprintId,
  order: readonly PersonId[],
  topology: CircularTopologySnapshot,
  rng: DeterministicRandom,
): { constraints: CircularConstraint[]; protectedIds: Set<string> } {
  const nextId = ids();
  const constraints: CircularConstraint[] = [];
  const protectedIds = new Set<string>();
  const protect = (constraint: CircularConstraint): void => {
    constraints.push(constraint);
    protectedIds.add(constraint.id);
  };
  const ring = new CircularTopology(order.length);
  let excluded = new Set<PersonId>();

  if (blueprint === "SEA-PBA-009") {
    const firstIndex = rng.integer(0, order.length - 1);
    const secondIndex = ring.oppositeSeatIndex(firstIndex);
    if (secondIndex === null) throw new Error("Opposite blueprint requires an even circle");
    const oppositePerson = personAt(order, secondIndex);
    protect({ id: nextId(), kind: "OPPOSITE", firstId: personAt(order, firstIndex), secondId: oppositePerson });
    excluded = new Set([oppositePerson]);
  } else if (blueprint === "SEA-PBA-010") {
    const start = rng.integer(0, order.length - 1);
    for (let offset = 0; offset < 3; offset += 1) {
      protect({
        id: nextId(), kind: "CYCLIC_POSITION", direction: "CLOCKWISE", steps: 1,
        subjectId: personAt(order, start + offset + 1), referenceId: personAt(order, start + offset),
      });
    }
  } else if (blueprint === "SEA-PBA-011") {
    const start = rng.integer(0, order.length - 1);
    const adjacencyDirection = rng.pick([1, -1] as const);
    const leaf = personAt(order, start + adjacencyDirection);
    const nonAdjacentDistance = rng.pick([2, 3].filter((distance) => distance < order.length - 1));
    const nonAdjacentDirection = rng.pick([1, -1] as const);
    const nonAdjacentTarget = personAt(order, start + adjacencyDirection + nonAdjacentDirection * nonAdjacentDistance);
    const gapCount = rng.pick([1, 2, 3].filter((count) => count + 1 < order.length - 1));
    const gapDirection = rng.pick(["CLOCKWISE", "ANTICLOCKWISE"] as const);
    const gapStartOffset = rng.integer(0, order.length - 1);
    const gapStep = gapCount + 1;
    const gapEndOffset = gapDirection === "CLOCKWISE"
      ? gapStartOffset + gapStep
      : gapStartOffset - gapStep;
    protect({ id: nextId(), kind: "ADJACENT", firstId: personAt(order, start), secondId: leaf });
    protect({ id: nextId(), kind: "NOT_ADJACENT", firstId: leaf, secondId: nonAdjacentTarget });
    protect({
      id: nextId(),
      kind: "DIRECTIONAL_COUNT_BETWEEN",
      firstId: personAt(order, gapStartOffset),
      secondId: personAt(order, gapEndOffset),
      direction: gapDirection,
      count: gapCount,
    });
    excluded = new Set([leaf]);
  } else {
    const landmark = topology.landmark;
    if (!landmark) throw new Error("Landmark blueprint requires an external marker");
    protect({ id: nextId(), kind: "LANDMARK_ANCHOR", personId: order[0] as PersonId, landmarkId: landmark.id, seatIndex: 0 });
    excluded = new Set([order[rng.integer(1, order.length - 1)] as PersonId]);
  }

  const existing = new Set(constraints.map(circularConstraintFingerprint));
  for (const constraint of chain(order, nextId, excluded)) {
    const fingerprint = circularConstraintFingerprint(constraint);
    if (!existing.has(fingerprint)) {
      constraints.push(constraint);
      existing.add(fingerprint);
    }
  }

  if (constraints.some((constraint) => !constraintTrueInOrder(constraint, order))) throw new Error("Derived false clue");
  const landmarkAnchored = topology.landmark !== undefined;
  const solve = (candidate: readonly CircularConstraint[]) => enumerateCircularProduction({ persons: order, constraints: candidate, landmarkAnchored, maxModels: 2 });
  const modelCount = (candidate: readonly CircularConstraint[]): number => {
    if (landmarkAnchored && !candidate.some((constraint) => constraint.kind === "LANDMARK_ANCHOR")) return 0;
    return solve(candidate).length;
  };
  if (modelCount(constraints) !== 1) throw new Error("Candidate clue set is not unique");

  for (let index = constraints.length - 1; index >= 0; index -= 1) {
    const clue = constraints[index];
    if (!clue || protectedIds.has(clue.id)) continue;
    const trial = constraints.filter((_, candidateIndex) => candidateIndex !== index);
    if (modelCount(trial) === 1) constraints.splice(index, 1);
  }

  for (const clue of constraints) {
    const trial = constraints.filter((candidate) => candidate.id !== clue.id);
    if (modelCount(trial) === 1) throw new Error(`Displayed redundant clue: ${clue.id}`);
  }

  if (new Set(constraints.map(circularConstraintFingerprint)).size !== constraints.length) {
    throw new Error("Displayed semantically duplicate clue");
  }
  return { constraints, protectedIds };
}

function trace(constraints: readonly CircularConstraint[], landmark: boolean): readonly CircularProofEvent[] {
  const output: CircularProofEvent[] = [{
    id: "SEA-CP003-PROOF-001",
    kind: landmark ? "LANDMARK_ABSOLUTE_ANCHOR" : "ROTATION_SYMMETRY_BREAK",
    sourceConstraintIds: constraints.filter((constraint) => constraint.kind === "LANDMARK_ANCHOR").map((constraint) => constraint.id),
    statement: landmark ? "The displayed landmark fixes seat zero." : "A temporary person anchor removes duplicate rotations only inside the solver.",
  }];
  for (const clue of constraints) {
    const kind: CircularProofEvent["kind"] = clue.kind === "OPPOSITE" ? "OPPOSITE_PLACEMENT"
      : clue.kind === "DIRECTIONAL_COUNT_BETWEEN" ? "ARC_COUNT"
      : clue.kind === "ADJACENT" || clue.kind === "NOT_ADJACENT" ? "ADJACENCY_ELIMINATION"
      : "CLOCKWISE_CHAIN";
    output.push({ id: `SEA-CP003-PROOF-${String(output.length + 1).padStart(3, "0")}`, kind, sourceConstraintIds: [clue.id], statement: renderCircularConstraint(clue) });
  }
  output.push({ id: `SEA-CP003-PROOF-${String(output.length + 1).padStart(3, "0")}`, kind: "ONLY_REMAINING_POSITION", sourceConstraintIds: constraints.map((constraint) => constraint.id), statement: "Exactly one semantic circular class remains." });
  return output;
}

function attempt(seed: string, blueprint: CircularBlueprintId): CircularCaseletRecord {
  const rng = new DeterministicRandom(seed);
  const seatCount = countFor(blueprint, rng);
  const persons = sea001PersonIds(seatCount) as PersonId[];
  const displayNames = sea001DisplayNameMap(seed, persons, `${blueprint}:cp003`);
  const shuffled = rng.shuffle(persons);
  const landmarkAnchored = blueprint === "SEA-PBA-012";
  const order = landmarkAnchored ? shuffled : canonicalCircularOrder(shuffled, false);
  const topology: CircularTopologySnapshot = landmarkAnchored
    ? { kind: "CIRCULAR_RING", seatCount, seatIndicesIncrease: "CLOCKWISE", facing: "CENTER", landmark: { id: rng.pick(["ENTRANCE", "STAGE", "DOOR"] as const), anchoredSeatIndex: 0 } }
    : { kind: "CIRCULAR_RING", seatCount, seatIndicesIncrease: "CLOCKWISE", facing: "CENTER" };

  const built = constraintsFor(blueprint, order, topology, rng);
  const production = enumerateCircularProduction({ persons, constraints: built.constraints, landmarkAnchored });
  const oracle = enumerateCircularOracle({ persons, constraints: built.constraints, landmarkAnchored });
  const productionKeys = production.map((model) => model.canonicalKey);
  const oracleKeys = oracle.map((model) => model.canonicalKey);
  if (productionKeys.length !== 1 || JSON.stringify(productionKeys) !== JSON.stringify(oracleKeys)) throw new Error("Solver/oracle disagreement");
  const solved = production[0]?.clockwiseOrder;
  if (!solved) throw new Error("No solved order");
  const children = presentSea001Children(buildCircularChildren(seed, solved, rng), displayNames);
  const displayOrder = landmarkAnchored ? solved : rotateOrder(solved, rng.integer(0, solved.length - 1));
  const displayedNames = displayOrder.map((personId) => sea001DisplayName(personId, displayNames));
  const diagram = buildCircularDiagram(displayedNames, topology);
  const clueTexts = built.constraints.map((constraint) => presentSea001Text(renderCircularConstraint(constraint), displayNames));
  if (seatCount % 2 !== 0 && (built.constraints.some((clue) => clue.kind === "OPPOSITE") || children.some((child) => child.queryContractId === "SEA-QC-010"))) throw new Error("Odd circle exposed opposite relation");

  const landmarkLabel = topology.landmark?.id.toLowerCase();
  const landmarkArticle = landmarkLabel === "entrance" ? "An" : "A";
  const listedNames = persons.map((personId) => sea001DisplayName(personId, displayNames));
  const setupText = landmarkAnchored
    ? `${seatCount} persons—${listedNames.join(", ")}—are sitting around a circular table, facing the centre, but not necessarily in the same order. ${landmarkArticle} ${landmarkLabel} is shown at the top of the diagram.`
    : `${seatCount} persons—${listedNames.join(", ")}—are sitting around a circular table, facing the centre, but not necessarily in the same order.`;
  const skills = ["ROTATION_CANONICALISATION", "CENTRE_FACING_LEFT_RIGHT", "CLOCKWISE_WRAP_AROUND", "DIRECTIONAL_ARC_COUNT", seatCount % 2 === 0 ? "EVEN_OPPOSITE_SEAT" : "ODD_OPPOSITE_GUARD"];
  if (landmarkAnchored) skills.push("EXTERNAL_LANDMARK_ANCHOR");

  const sharedExplanation = [
    landmarkAnchored
      ? `Start with the seat nearest the ${landmarkLabel}, which is shown at the top of the diagram.`
      : `For drawing, start from ${displayedNames[0]} at any convenient point; rotating the whole arrangement does not change any relative position.`,
    "Since everyone faces the centre, left is clockwise and right is anticlockwise.",
    "Apply the clues one by one:",
    ...clueTexts.map((clue, index) => `${index + 1}. ${clue}`),
    `Therefore, the clockwise arrangement is ${diagram.text}.`,
  ].join("\n");

  return {
    caseletId: `SEA-CP003-${canonicalDigest({ seed, blueprint }).slice(0, 16)}`,
    chapterId: "REAS-SEA", packageId: "SEA-001", checkpointId: "SEA-CP-003", blueprintAuthorityId: blueprint,
    seed, locale: "en-IN", setupText, clueTexts, constraints: built.constraints, topologySnapshot: topology,
    hiddenStateFingerprint: canonicalDigest({ topology, key: circularCanonicalKey(order, landmarkAnchored) }),
    clueSetFingerprint: canonicalDigest(built.constraints.map(circularConstraintFingerprint).sort()),
    essentialConstraintIds: built.constraints.filter((clue) => !built.protectedIds.has(clue.id)).map((clue) => clue.id),
    blueprintCoverageConstraintIds: built.constraints.filter((clue) => built.protectedIds.has(clue.id)).map((clue) => clue.id),
    solutionPolicy: "UNIQUE_CLASS", solutionClassCount: 1,
    solverOracleAgreement: { productionKeys, oracleKeys, passed: true },
    queryFactFingerprints: children.map((child) => child.answerDeterminingFactFingerprint),
    checkpointSkillCoverage: skills,
    crossQuestionLeakagePassed: true,
    proofTrace: trace(built.constraints, landmarkAnchored),
    sharedExplanation,
    diagram, children, lifecycle: LIFECYCLE,
  };
}

export function generateCircularCaselet(seed: string, blueprint: CircularBlueprintId): CircularCaseletRecord {
  if (!SEA_CP003_BLUEPRINTS.includes(blueprint)) throw new Error(`Unsupported CP-003 blueprint: ${blueprint}`);
  let error: unknown;
  for (let retry = 0; retry < 24; retry += 1) {
    try { return attempt(`${seed}::attempt-${retry}`, blueprint); } catch (candidateError) { error = candidateError; }
  }
  throw new Error(`Failed to generate ${blueprint}: ${String(error)}`);
}

export function assertCircularCaseletIntegrity(caselet: CircularCaseletRecord): void {
  if (caselet.checkpointId !== "SEA-CP-003" || caselet.solutionClassCount !== 1 || !caselet.solverOracleAgreement.passed) throw new Error("Circular solution policy failed");
  if (caselet.children.length !== 4 || new Set(caselet.queryFactFingerprints).size !== 4) throw new Error("Circular child mix failed");
  if (caselet.essentialConstraintIds.some((id) => caselet.blueprintCoverageConstraintIds.includes(id))) throw new Error("Constraint role overlap");
  if (new Set(caselet.constraints.map(circularConstraintFingerprint)).size !== caselet.constraints.length) throw new Error("Circular semantic clue duplication");
  if (caselet.setupText.includes("Rotations represent") || caselet.setupText.includes("fixes one displayed seat")) throw new Error("Internal circular terminology leaked into the student stem");
  if (!caselet.setupText.includes("not necessarily in the same order")) throw new Error("Exam-style circular setup phrase is missing");
  const solved = caselet.solverOracleAgreement.productionKeys[0]?.split("|") ?? [];
  if (caselet.constraints.some((clue) => !constraintTrueInOrder(clue, solved))) throw new Error("Displayed false clue");
  for (const child of caselet.children) {
    if (child.options.length !== 4 || child.options.filter((option) => option.isCorrect).length !== 1 || new Set(child.options.map((option) => option.semanticFingerprint)).size !== 4 || !child.options[child.answerIndex]?.isCorrect) throw new Error("Circular option integrity failed");
    if (child.text.includes("2 seats to the left")) throw new Error("Non-exam ordinal wording leaked into a question");
    if (child.explanation.includes("1 persons")) throw new Error("Singular/plural error leaked into an explanation");
  }
  if (caselet.lifecycle.permanentQlCount !== 0 || caselet.lifecycle.questionBankWritable || caselet.lifecycle.testEligible || caselet.lifecycle.publiclyPublishable) throw new Error("Lifecycle lock violated");
}
