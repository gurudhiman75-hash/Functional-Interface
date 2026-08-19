import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import { canonicalDigest } from "../canonical.ts";
import {
  presentSea001Children,
  presentSea001Text,
  sea001DisplayName,
  sea001DisplayNameMap,
  sea001PersonIds,
} from "../generation/person-presentation.ts";
import { canonicalCircularOrder, CircularTopology, personAt, rotateOrder } from "../cp003/topology.ts";
import {
  outwardConstraintFingerprint,
  outwardConstraintTrue,
  renderOutwardConstraint,
} from "./constraints.ts";
import { buildOutwardChildren } from "./questions.ts";
import { enumerateOutwardOracle, enumerateOutwardProduction } from "./solvers.ts";
import type {
  OutwardBlueprintId,
  OutwardCaseletRecord,
  OutwardConstraint,
  OutwardPersonId,
  OutwardTopologySnapshot,
} from "./types.ts";

export const SEA_CP004_BLUEPRINTS: readonly OutwardBlueprintId[] = [
  "SEA-PBA-013",
  "SEA-PBA-014",
  "SEA-PBA-015",
  "SEA-PBA-016",
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
  return () => `SEA-CP004-CL-${String(++serial).padStart(3, "0")}`;
}

function outwardRelation(
  order: readonly OutwardPersonId[],
  referenceIndex: number,
  subjectIndex: number,
  id: string,
): OutwardConstraint {
  const seatCount = order.length;
  const clockwiseSteps = (subjectIndex - referenceIndex + seatCount) % seatCount;
  const anticlockwiseSteps = seatCount - clockwiseSteps;
  const clockwiseIsShorter = clockwiseSteps <= anticlockwiseSteps;
  return {
    id,
    kind: "RELATIVE_POSITION",
    subjectId: personAt(order, subjectIndex),
    referenceId: personAt(order, referenceIndex),
    direction: clockwiseIsShorter ? "RIGHT" : "LEFT",
    steps: Math.min(clockwiseSteps, anticlockwiseSteps),
  };
}

function relationChain(
  order: readonly OutwardPersonId[],
  nextId: () => string,
  excluded: ReadonlySet<OutwardPersonId>,
): OutwardConstraint[] {
  const persons = order.filter((personId) => !excluded.has(personId));
  const constraints: OutwardConstraint[] = [];
  for (let index = 1; index < persons.length; index += 1) {
    const previous = persons[index - 1];
    const current = persons[index];
    if (!previous || !current) continue;
    constraints.push(outwardRelation(order, order.indexOf(previous), order.indexOf(current), nextId()));
  }
  return constraints;
}

function buildConstraints(
  blueprint: OutwardBlueprintId,
  order: readonly OutwardPersonId[],
  topology: OutwardTopologySnapshot,
  random: DeterministicRandom,
): readonly OutwardConstraint[] {
  const nextId = nextIdFactory();
  const constraints: OutwardConstraint[] = [];
  const protectedIds = new Set<string>();
  const protect = (constraint: OutwardConstraint): void => {
    constraints.push(constraint);
    protectedIds.add(constraint.id);
  };
  const ring = new CircularTopology(order.length);
  let excluded = new Set<OutwardPersonId>();

  if (blueprint === "SEA-PBA-013") {
    const firstIndex = random.integer(0, order.length - 1);
    const secondIndex = ring.oppositeSeatIndex(firstIndex);
    if (secondIndex === null) throw new Error("SEA-PBA-013 requires an even circle");
    const oppositePerson = personAt(order, secondIndex);
    protect({
      id: nextId(),
      kind: "OPPOSITE",
      firstId: personAt(order, firstIndex),
      secondId: oppositePerson,
    });
    excluded = new Set([oppositePerson]);
  } else if (blueprint === "SEA-PBA-014") {
    const start = random.integer(0, order.length - 1);
    const stepPattern = random.pick([
      [1, 1, 1],
      [1, 1, 2],
      [1, 2, 1],
      [2, 1, 1],
      [1, 2, 2],
    ] as const);
    let referenceIndex = start;
    for (const step of stepPattern) {
      const subjectIndex = referenceIndex + step;
      protect(outwardRelation(order, referenceIndex, subjectIndex, nextId()));
      referenceIndex = subjectIndex;
    }
  } else if (blueprint === "SEA-PBA-015") {
    const start = random.integer(0, order.length - 5);
    const adjacentLeaf = personAt(order, start + 1);
    const gapEnd = personAt(order, start + 4);
    protect({
      id: nextId(),
      kind: "ADJACENT",
      firstId: personAt(order, start),
      secondId: adjacentLeaf,
    });
    protect({
      id: nextId(),
      kind: "DIRECTIONAL_COUNT_BETWEEN",
      firstId: personAt(order, start + 2),
      secondId: gapEnd,
      direction: "CLOCKWISE",
      count: 1,
    });
    excluded = new Set([adjacentLeaf, gapEnd]);
  } else {
    const landmark = topology.landmark;
    if (!landmark) throw new Error("SEA-PBA-016 requires a displayed landmark");
    protect({
      id: nextId(),
      kind: "LANDMARK_ANCHOR",
      personId: order[0] as OutwardPersonId,
      landmarkId: landmark.id,
      seatIndex: 0,
    });
    const start = random.integer(0, order.length - 3);
    protect(outwardRelation(order, start, start + 1, nextId()));
    protect(outwardRelation(order, start + 1, start + 2, nextId()));
  }

  const semanticFingerprints = new Set(constraints.map(outwardConstraintFingerprint));
  for (const constraint of relationChain(order, nextId, excluded)) {
    const fingerprint = outwardConstraintFingerprint(constraint);
    if (!semanticFingerprints.has(fingerprint)) {
      constraints.push(constraint);
      semanticFingerprints.add(fingerprint);
    }
  }

  if (constraints.some((constraint) => !outwardConstraintTrue(constraint, order))) {
    throw new Error("Derived a false outward-facing clue");
  }

  const landmarkAnchored = topology.landmark !== undefined;
  const modelCount = (candidate: readonly OutwardConstraint[]): number => {
    if (landmarkAnchored && !candidate.some((constraint) => constraint.kind === "LANDMARK_ANCHOR")) return 0;
    return enumerateOutwardProduction({
      persons: order,
      constraints: candidate,
      landmarkAnchored,
      maxModels: 2,
    }).length;
  };
  if (modelCount(constraints) !== 1) throw new Error("Candidate outward clue set is not unique");

  for (let index = constraints.length - 1; index >= 0; index -= 1) {
    const clue = constraints[index];
    if (!clue || protectedIds.has(clue.id)) continue;
    const trial = constraints.filter((_, candidateIndex) => candidateIndex !== index);
    if (modelCount(trial) === 1) constraints.splice(index, 1);
  }

  for (const clue of constraints) {
    const trial = constraints.filter((candidate) => candidate.id !== clue.id);
    if (modelCount(trial) === 1) throw new Error(`Displayed redundant outward clue: ${clue.id}`);
  }
  if (new Set(constraints.map(outwardConstraintFingerprint)).size !== constraints.length) {
    throw new Error("Displayed semantically duplicate outward clue");
  }
  return constraints;
}

function attempt(seed: string, blueprint: OutwardBlueprintId): OutwardCaseletRecord {
  const random = new DeterministicRandom(seed);
  const seatCount = blueprint === "SEA-PBA-013"
    ? random.pick([6, 8, 10])
    : random.pick([6, 7, 8, 9, 10]);
  const persons = sea001PersonIds(seatCount) as OutwardPersonId[];
  const displayNames = sea001DisplayNameMap(seed, persons, `${blueprint}:cp004`);
  const landmarkAnchored = blueprint === "SEA-PBA-016";
  const shuffled = random.shuffle(persons);
  const order = landmarkAnchored ? shuffled : canonicalCircularOrder(shuffled, false);
  const topology: OutwardTopologySnapshot = landmarkAnchored
    ? {
        kind: "CIRCULAR_RING",
        seatCount,
        seatIndicesIncrease: "CLOCKWISE",
        facing: "OUTWARD",
        landmark: {
          id: random.pick(["ENTRANCE", "STAGE", "DOOR"] as const),
          anchoredSeatIndex: 0,
        },
      }
    : {
        kind: "CIRCULAR_RING",
        seatCount,
        seatIndicesIncrease: "CLOCKWISE",
        facing: "OUTWARD",
      };

  const constraints = buildConstraints(blueprint, order, topology, random);
  const production = enumerateOutwardProduction({ persons, constraints, landmarkAnchored });
  const oracle = enumerateOutwardOracle({ persons, constraints, landmarkAnchored });
  const productionKeys = production.map((model) => model.canonicalKey);
  const oracleKeys = oracle.map((model) => model.canonicalKey);
  if (productionKeys.length !== 1 || JSON.stringify(productionKeys) !== JSON.stringify(oracleKeys)) {
    throw new Error("Outward production/oracle disagreement");
  }
  const model = production[0];
  if (!model) throw new Error("Missing outward solution model");
  const children = presentSea001Children(buildOutwardChildren(seed, model, random), displayNames);
  const clueTexts = constraints.map((constraint) => presentSea001Text(renderOutwardConstraint(constraint), displayNames));
  const landmarkLabel = topology.landmark?.id.toLowerCase();
  const listedNames = persons.map((personId) => sea001DisplayName(personId, displayNames));
  const setupText = landmarkAnchored
    ? `${seatCount} persons—${listedNames.join(", ")}—are sitting around a circular table, facing outward, but not necessarily in the same order. ${landmarkLabel === "entrance" ? "An" : "A"} ${landmarkLabel} is shown at the top of the diagram.`
    : `${seatCount} persons—${listedNames.join(", ")}—are sitting around a circular table, facing outward, but not necessarily in the same order.`;
  const displayOrder = landmarkAnchored
    ? model.clockwiseOrder
    : rotateOrder(model.clockwiseOrder, random.integer(0, model.clockwiseOrder.length - 1));
  const displayedNames = displayOrder.map((personId) => sea001DisplayName(personId, displayNames));
  const diagramText = `Clockwise${landmarkAnchored
    ? ` from the seat nearest the ${landmarkLabel}`
    : ` from ${displayedNames[0]} (chosen only as a drawing reference)`}: ${displayedNames.join(" → ")} → ${displayedNames[0]}`;
  const sharedExplanation = [
    landmarkAnchored
      ? `Start with the seat nearest the ${landmarkLabel}, which is shown at the top of the diagram.`
      : `For drawing, start from ${displayedNames[0]} at any convenient point; rotating the whole arrangement does not change any relative position.`,
    "Since everyone faces outward, left is anticlockwise and right is clockwise.",
    "Apply the clues one by one:",
    ...clueTexts.map((clue, index) => `${index + 1}. ${clue}`),
    `Therefore, the final clockwise arrangement is ${diagramText}.`,
  ].join("\n");

  return {
    caseletId: `SEA-CP004-${canonicalDigest({ seed, blueprint }).slice(0, 16)}`,
    chapterId: "REAS-SEA",
    packageId: "SEA-001",
    checkpointId: "SEA-CP-004",
    blueprintAuthorityId: blueprint,
    seed,
    locale: "en-IN",
    setupText,
    clueTexts,
    constraints,
    topologySnapshot: topology,
    solutionPolicy: "UNIQUE_CLASS",
    solutionClassCount: 1,
    solverOracleAgreement: { productionKeys, oracleKeys, passed: true },
    queryFactFingerprints: children.map((child) => child.answerDeterminingFactFingerprint),
    checkpointSkillCoverage: [
      "OUTWARD_LEFT_RIGHT_REVERSAL",
      "ROTATION_CANONICALISATION",
      "CLOCKWISE_WRAP_AROUND",
      seatCount % 2 === 0 ? "EVEN_OPPOSITE_SEAT" : "ODD_OPPOSITE_GUARD",
      ...(landmarkAnchored ? ["EXTERNAL_LANDMARK_ANCHOR"] : []),
    ],
    crossQuestionLeakagePassed: new Set(children.map((child) => child.answerDeterminingFactFingerprint)).size === children.length,
    children,
    diagramText,
    sharedExplanation,
    lifecycle: LIFECYCLE,
  };
}

export function generateOutwardCaselet(
  seed: string,
  blueprint: OutwardBlueprintId,
): OutwardCaseletRecord {
  if (!SEA_CP004_BLUEPRINTS.includes(blueprint)) throw new Error(`Unsupported CP-004 blueprint: ${blueprint}`);
  let lastError: unknown;
  for (let retry = 0; retry < 48; retry += 1) {
    try {
      return attempt(`${seed}::attempt-${retry}`, blueprint);
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`Failed to generate ${blueprint}: ${String(lastError)}`);
}

export function assertOutwardCaseletIntegrity(caselet: OutwardCaseletRecord): void {
  if (caselet.solutionClassCount !== 1 || !caselet.solverOracleAgreement.passed) {
    throw new Error("CP-004 solution policy failed");
  }
  if (caselet.children.length !== 4 || !caselet.crossQuestionLeakagePassed) {
    throw new Error("CP-004 child mix failed");
  }
  if (!caselet.children.some((child) =>
    child.centreFacingCounterfactual !== undefined
      && JSON.stringify(child.centreFacingCounterfactual) !== JSON.stringify(child.answer))) {
    throw new Error("CP-004 lacks a centre-facing reversal detector");
  }
  if (new Set(caselet.constraints.map(outwardConstraintFingerprint)).size !== caselet.constraints.length) {
    throw new Error("CP-004 semantic clue duplication");
  }
  for (const child of caselet.children) {
    if (child.options.length !== 4
      || child.options.filter((option) => option.isCorrect).length !== 1
      || new Set(child.options.map((option) => option.semanticFingerprint)).size !== 4
      || !child.options[child.answerIndex]?.isCorrect) {
      throw new Error("CP-004 option integrity failed");
    }
    if (child.queryContractId === "SEA-QC-003" && !/outward, so left means anticlockwise/i.test(child.explanation)) {
      throw new Error("CP-004 left/right explanation omitted the outward-facing rule");
    }
  }
  if (caselet.topologySnapshot.seatCount % 2 !== 0
    && (caselet.constraints.some((constraint) => constraint.kind === "OPPOSITE")
      || caselet.children.some((child) => child.queryContractId === "SEA-QC-010"))) {
    throw new Error("Odd outward circle exposed an opposite relation");
  }
  if (caselet.lifecycle.permanentQlCount !== 0
    || caselet.lifecycle.questionBankWritable
    || caselet.lifecycle.testEligible
    || caselet.lifecycle.publiclyPublishable) {
    throw new Error("CP-004 lifecycle lock violated");
  }
}
