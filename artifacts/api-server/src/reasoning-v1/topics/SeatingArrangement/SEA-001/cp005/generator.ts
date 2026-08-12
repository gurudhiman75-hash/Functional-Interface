import { canonicalDigest } from "../canonical.ts";
import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import {
  presentSea001Children,
  presentSea001Text,
  sea001DisplayName,
  sea001DisplayNameMap,
  sea001PersonIds,
} from "../generation/person-presentation.ts";
import { canonicalCircularOrder, personAt, rotateOrder } from "../cp003/topology.ts";
import {
  mixedCircleConstraintFingerprint,
  mixedCircleConstraintTrue,
  oppositeFacing,
  renderMixedCircleConstraint,
} from "./constraints.ts";
import { buildMixedCircleChildren } from "./questions.ts";
import {
  enumerateMixedCircleOracle,
  enumerateMixedCircleProduction,
} from "./solvers.ts";
import type {
  MixedCircleBlueprintId,
  MixedCircleCaseletRecord,
  MixedCircleConstraint,
  MixedCircleFacing,
} from "./types.ts";

export const SEA_CP005_BLUEPRINTS: readonly MixedCircleBlueprintId[] = [
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

function controlledFacings(
  clockwiseOrder: readonly string[],
  random: DeterministicRandom,
): Readonly<Record<string, MixedCircleFacing>> {
  const centreCount = random.integer(2, clockwiseOrder.length - 2);
  const centreFacing = new Set(random.shuffle(clockwiseOrder).slice(0, centreCount));
  return Object.fromEntries(clockwiseOrder.map((personId) => [
    personId,
    centreFacing.has(personId) ? "CENTER" : "OUTWARD",
  ])) as Readonly<Record<string, MixedCircleFacing>>;
}

function cyclicRelation(
  clockwiseOrder: readonly string[],
  referenceId: string,
  subjectId: string,
  id: string,
): MixedCircleConstraint {
  const seatCount = clockwiseOrder.length;
  const referenceIndex = clockwiseOrder.indexOf(referenceId);
  const subjectIndex = clockwiseOrder.indexOf(subjectId);
  const clockwiseSteps = (subjectIndex - referenceIndex + seatCount) % seatCount;
  const anticlockwiseSteps = seatCount - clockwiseSteps;
  return {
    id,
    kind: "CYCLIC_POSITION",
    referenceId,
    subjectId,
    direction: clockwiseSteps <= anticlockwiseSteps ? "CLOCKWISE" : "ANTICLOCKWISE",
    steps: Math.min(clockwiseSteps, anticlockwiseSteps),
  };
}

function cyclicChain(
  clockwiseOrder: readonly string[],
  selectedPersons: readonly string[],
  nextId: () => string,
): MixedCircleConstraint[] {
  const constraints: MixedCircleConstraint[] = [];
  for (let index = 1; index < selectedPersons.length; index += 1) {
    const referenceId = selectedPersons[index - 1];
    const subjectId = selectedPersons[index];
    if (referenceId && subjectId) {
      constraints.push(cyclicRelation(clockwiseOrder, referenceId, subjectId, nextId()));
    }
  }
  return constraints;
}

function facingRelativeConstraint(
  clockwiseOrder: readonly string[],
  facings: Readonly<Record<string, MixedCircleFacing>>,
  referenceIndex: number,
  subjectIndex: number,
  id: string,
): MixedCircleConstraint {
  const referenceId = personAt(clockwiseOrder, referenceIndex);
  const subjectId = personAt(clockwiseOrder, subjectIndex);
  const facing = facings[referenceId] as MixedCircleFacing;
  const seatCount = clockwiseOrder.length;
  const clockwiseSteps = (subjectIndex - referenceIndex + seatCount) % seatCount;
  const anticlockwiseSteps = seatCount - clockwiseSteps;
  const physicalDirection = clockwiseSteps <= anticlockwiseSteps
    ? "CLOCKWISE"
    : "ANTICLOCKWISE";
  const direction = facing === "CENTER"
    ? physicalDirection === "CLOCKWISE" ? "LEFT" : "RIGHT"
    : physicalDirection === "CLOCKWISE" ? "RIGHT" : "LEFT";
  return {
    id,
    kind: "RELATIVE_POSITION",
    referenceId,
    subjectId,
    direction,
    steps: Math.min(clockwiseSteps, anticlockwiseSteps),
  };
}

function buildCandidateConstraints(
  blueprint: MixedCircleBlueprintId,
  clockwiseOrder: readonly string[],
  facings: Readonly<Record<string, MixedCircleFacing>>,
): MixedCircleConstraint[] {
  const nextId = nextIdFactory();
  const constraints: MixedCircleConstraint[] = [];

  if (blueprint === "SEA-PBA-017") {
    for (const personId of clockwiseOrder) {
      constraints.push({
        id: nextId(),
        kind: "FACING",
        personId,
        facing: facings[personId] as MixedCircleFacing,
      });
    }
    constraints.push(...cyclicChain(clockwiseOrder, clockwiseOrder, nextId));
  } else if (blueprint === "SEA-PBA-018") {
    constraints.push(...cyclicChain(clockwiseOrder, clockwiseOrder, nextId));
    for (let index = 0; index < clockwiseOrder.length; index += 1) {
      constraints.push(facingRelativeConstraint(
        clockwiseOrder,
        facings,
        index,
        (index + 2) % clockwiseOrder.length,
        nextId(),
      ));
    }
  } else if (blueprint === "SEA-PBA-019") {
    for (const personId of clockwiseOrder) {
      constraints.push({
        id: nextId(),
        kind: "FACING",
        personId,
        facing: facings[personId] as MixedCircleFacing,
      });
    }
    const oppositePerson = personAt(clockwiseOrder, clockwiseOrder.length / 2);
    const gapPerson = personAt(clockwiseOrder, 2);
    constraints.push({
      id: nextId(),
      kind: "OPPOSITE",
      firstId: clockwiseOrder[0] as string,
      secondId: oppositePerson,
    });
    constraints.push({
      id: nextId(),
      kind: "DIRECTIONAL_COUNT_BETWEEN",
      firstId: clockwiseOrder[0] as string,
      secondId: gapPerson,
      direction: "CLOCKWISE",
      count: 1,
    });
    constraints.push(...cyclicChain(
      clockwiseOrder,
      clockwiseOrder.filter((personId) =>
        personId !== oppositePerson && personId !== gapPerson),
      nextId,
    ));
  } else {
    const firstPerson = clockwiseOrder[0] as string;
    constraints.push({
      id: nextId(),
      kind: "FACING",
      personId: firstPerson,
      facing: facings[firstPerson] as MixedCircleFacing,
    });

    // Give the minimiser several truthful solve routes instead of forcing a
    // complete immediate-clockwise chain. The retained PBA-020 passage must
    // still include physical cyclic placement, reference-facing left/right
    // reasoning, and conditional orientation.
    constraints.push(...cyclicChain(clockwiseOrder, clockwiseOrder, nextId));
    for (let index = 0; index < clockwiseOrder.length; index += 1) {
      constraints.push(facingRelativeConstraint(
        clockwiseOrder,
        facings,
        index,
        (index + 2) % clockwiseOrder.length,
        nextId(),
      ));
    }
    for (let index = 1; index < clockwiseOrder.length; index += 1) {
      const previousPerson = clockwiseOrder[index - 1] as string;
      const targetPerson = clockwiseOrder[index] as string;
      const previousFacing = facings[previousPerson] as MixedCircleFacing;
      const targetFacing = facings[targetPerson] as MixedCircleFacing;
      constraints.push({
        id: nextId(),
        kind: "CONDITIONAL_FACING",
        conditionPersonId: previousPerson,
        conditionFacing: previousFacing,
        targetPersonId: targetPerson,
        thenFacing: targetFacing,
        elseFacing: oppositeFacing(targetFacing),
      });
    }
  }

  if (constraints.some((constraint) =>
    !mixedCircleConstraintTrue(constraint, clockwiseOrder, facings))) {
    throw new Error("Derived a false CP-005 clue");
  }
  if (new Set(constraints.map(mixedCircleConstraintFingerprint)).size !== constraints.length) {
    throw new Error("Derived semantically duplicate CP-005 clues");
  }
  return constraints;
}

function requirementSatisfied(
  blueprint: MixedCircleBlueprintId,
  constraints: readonly MixedCircleConstraint[],
  seatCount: number,
): boolean {
  const count = (kind: MixedCircleConstraint["kind"]): number =>
    constraints.filter((constraint) => constraint.kind === kind).length;
  if (blueprint === "SEA-PBA-017") {
    return count("FACING") === seatCount && count("CYCLIC_POSITION") >= 1;
  }
  if (blueprint === "SEA-PBA-018") {
    return count("FACING") === 0
      && count("RELATIVE_POSITION") === seatCount
      && count("CYCLIC_POSITION") >= 1;
  }
  if (blueprint === "SEA-PBA-019") {
    return count("OPPOSITE") >= 1
      && count("DIRECTIONAL_COUNT_BETWEEN") >= 1
      && count("FACING") === seatCount;
  }
  return count("CONDITIONAL_FACING") >= 1
    && count("FACING") === 1
    && count("RELATIVE_POSITION") >= 2
    && count("CYCLIC_POSITION") >= 1;
}

function minimiseConstraints(
  blueprint: MixedCircleBlueprintId,
  persons: readonly string[],
  candidates: readonly MixedCircleConstraint[],
): MixedCircleConstraint[] {
  const constraints = [...candidates];
  const modelCount = (trial: readonly MixedCircleConstraint[]): number =>
    enumerateMixedCircleProduction({ persons, constraints: trial, maxModels: 2 }).length;
  if (modelCount(constraints) !== 1) {
    throw new Error("Candidate CP-005 clue set is not uniquely solvable");
  }

  for (let index = constraints.length - 1; index >= 0; index -= 1) {
    const trial = constraints.filter((_, candidateIndex) => candidateIndex !== index);
    if (requirementSatisfied(blueprint, trial, persons.length)
      && modelCount(trial) === 1) {
      constraints.splice(index, 1);
    }
  }
  if (!requirementSatisfied(blueprint, constraints, persons.length)) {
    throw new Error("CP-005 blueprint requirement was lost");
  }
  return constraints;
}

function naturalPersonList(personIds: readonly string[]): string {
  if (personIds.length === 0) return "";
  if (personIds.length === 1) return personIds[0] as string;
  if (personIds.length === 2) return `${personIds[0]} and ${personIds[1]}`;
  return `${personIds.slice(0, -1).join(", ")} and ${personIds[personIds.length - 1]}`;
}

function renderMixedCircleClueTexts(
  constraints: readonly MixedCircleConstraint[],
  displayNames: Readonly<Record<string, string>>,
): readonly string[] {
  const facingConstraints = constraints.filter((constraint) => constraint.kind === "FACING");
  if (facingConstraints.length <= 1) {
    return constraints.map((constraint) => presentSea001Text(renderMixedCircleConstraint(constraint), displayNames));
  }

  const centre = facingConstraints
    .filter((constraint) => constraint.kind === "FACING" && constraint.facing === "CENTER")
    .map((constraint) => sea001DisplayName(constraint.personId, displayNames));
  const outward = facingConstraints
    .filter((constraint) => constraint.kind === "FACING" && constraint.facing === "OUTWARD")
    .map((constraint) => sea001DisplayName(constraint.personId, displayNames));
  const facingParts: string[] = [];
  if (centre.length > 0) facingParts.push(`${naturalPersonList(centre)} ${centre.length === 1 ? "faces" : "face"} the centre`);
  if (outward.length > 0) facingParts.push(`${naturalPersonList(outward)} ${outward.length === 1 ? "faces" : "face"} outward`);
  const groupedFacing = `${facingParts.join("; ")}.`;
  return [
    groupedFacing,
    ...constraints
      .filter((constraint) => constraint.kind !== "FACING")
      .map((constraint) => presentSea001Text(renderMixedCircleConstraint(constraint), displayNames)),
  ];
}

function attempt(
  seed: string,
  blueprint: MixedCircleBlueprintId,
): MixedCircleCaseletRecord {
  const random = new DeterministicRandom(seed);
  const seatCount = blueprint === "SEA-PBA-019"
    ? random.pick([6] as const)
    : random.pick([6, 7] as const);
  const persons = sea001PersonIds(seatCount);
  const displayNames = sea001DisplayNameMap(seed, persons, `${blueprint}:cp005`);
  const clockwiseOrder = canonicalCircularOrder(random.shuffle(persons));
  const facings = controlledFacings(clockwiseOrder, random);
  const candidates = buildCandidateConstraints(blueprint, clockwiseOrder, facings);
  const constraints = minimiseConstraints(blueprint, persons, candidates);

  const production = enumerateMixedCircleProduction({ persons, constraints });
  const oracle = enumerateMixedCircleOracle({ persons, constraints });
  const productionKeys = production.map((model) => model.canonicalKey);
  const oracleKeys = oracle.map((model) => model.canonicalKey);
  if (productionKeys.length !== 1
    || JSON.stringify(productionKeys) !== JSON.stringify(oracleKeys)) {
    throw new Error(
      `CP-005 solver/oracle disagreement: production=${productionKeys.length}, oracle=${oracleKeys.length}`,
    );
  }
  const model = production[0];
  if (!model) throw new Error("Missing CP-005 model");

  for (const clue of constraints) {
    const trial = constraints.filter((candidate) => candidate.id !== clue.id);
    if (enumerateMixedCircleProduction({
      persons,
      constraints: trial,
      maxModels: 2,
    }).length === 1) {
      throw new Error(`Displayed redundant CP-005 clue: ${clue.id}`);
    }
  }

  const children = presentSea001Children(buildMixedCircleChildren(seed, blueprint, model, random), displayNames);
  const clueTexts = renderMixedCircleClueTexts(constraints, displayNames);
  const displayOrder = rotateOrder(model.clockwiseOrder, random.integer(0, model.clockwiseOrder.length - 1));
  const displayedNames = displayOrder.map((personId) => sea001DisplayName(personId, displayNames));
  const diagramText = `Clockwise from ${displayedNames[0]} (chosen only as a drawing reference): ${displayOrder
    .map((personId) => `${sea001DisplayName(personId, displayNames)}${model.facings[personId] === "CENTER" ? "↘ centre" : "↗ outward"}`)
    .join(" → ")} → ${displayedNames[0]}`;
  const sharedExplanation = [
    `For drawing, start from ${displayedNames[0]} at any convenient point; rotating the complete arrangement does not change any relative position.`,
    "Resolve every facing before applying a left/right clue. For centre-facing persons, left is clockwise; for outward-facing persons, left is anticlockwise.",
    "Apply the clues one by one:",
    ...clueTexts.map((clue, index) => `${index + 1}. ${clue}`),
    `Final arrangement: ${diagramText}.`,
  ].join("\n");
  const listedNames = persons.map((personId) => sea001DisplayName(personId, displayNames));

  return {
    caseletId: `SEA-CP005-${canonicalDigest({ seed, blueprint }).slice(0, 16)}`,
    chapterId: "REAS-SEA",
    packageId: "SEA-001",
    checkpointId: "SEA-CP-005",
    blueprintAuthorityId: blueprint,
    seed,
    locale: "en-IN",
    setupText: `${seatCount} persons—${listedNames.join(", ")}—are sitting around a circular table. Some face the centre and the others face outward. They are not necessarily seated in the same order as listed.`,
    clueTexts,
    constraints,
    solutionPolicy: "UNIQUE_STATE_CLASS",
    solutionStateClassCount: 1,
    solverOracleAgreement: {
      productionKeys,
      oracleKeys,
      passed: true,
    },
    checkpointSkillCoverage: [
      "MIXED_CIRCULAR_FACING_STATE",
      "REFERENCE_PERSON_FACING",
      "ROTATION_CANONICALISATION",
      blueprint === "SEA-PBA-018"
        ? "INFERRED_FACING"
        : blueprint === "SEA-PBA-020"
          ? "CONDITIONAL_ORIENTATION"
          : blueprint === "SEA-PBA-019"
            ? "OPPOSITE_AND_GAP"
            : "KNOWN_FACING",
    ],
    queryFactFingerprints: children.map((child) =>
      child.answerDeterminingFactFingerprint),
    crossQuestionLeakagePassed: new Set(
      children.map((child) => child.answerDeterminingFactFingerprint),
    ).size === children.length,
    children,
    diagramText,
    sharedExplanation,
    lifecycle: LIFECYCLE,
  };
}

export function generateMixedCircleCaselet(
  seed: string,
  blueprint: MixedCircleBlueprintId,
): MixedCircleCaseletRecord {
  if (!SEA_CP005_BLUEPRINTS.includes(blueprint)) {
    throw new Error(`Unsupported CP-005 blueprint: ${blueprint}`);
  }
  let lastError: unknown;
  for (let retry = 0; retry < 24; retry += 1) {
    try {
      return attempt(`${seed}::attempt-${retry}`, blueprint);
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`Failed to generate ${blueprint}: ${String(lastError)}`);
}

export function assertMixedCircleCaseletIntegrity(
  caselet: MixedCircleCaseletRecord,
): void {
  if (caselet.solutionStateClassCount !== 1
    || !caselet.solverOracleAgreement.passed) {
    throw new Error("CP-005 solution policy failed");
  }
  if (caselet.children.length !== 4
    || new Set(caselet.queryFactFingerprints).size !== 4
    || !caselet.crossQuestionLeakagePassed) {
    throw new Error("CP-005 child mix failed");
  }
  if (new Set(caselet.constraints.map(mixedCircleConstraintFingerprint)).size
    !== caselet.constraints.length) {
    throw new Error("CP-005 semantic clue duplication");
  }

  const modelKey = caselet.solverOracleAgreement.productionKeys[0];
  if (!modelKey) throw new Error("CP-005 model key missing");
  const [orderText, facingText] = modelKey.split("|");
  const clockwiseOrder = orderText?.split(">") ?? [];
  const facingRecord = Object.fromEntries(
    (facingText?.split(",") ?? []).map((entry) => entry.split(":")),
  ) as Readonly<Record<string, MixedCircleFacing>>;
  if (new Set(Object.values(facingRecord)).size !== 2) {
    throw new Error("CP-005 state is not genuinely mixed-facing");
  }
  if (caselet.constraints.some((constraint) =>
    !mixedCircleConstraintTrue(constraint, clockwiseOrder, facingRecord))) {
    throw new Error("CP-005 displayed false clue");
  }

  for (const child of caselet.children) {
    if (child.options.length !== 4
      || child.options.filter((option) => option.isCorrect).length !== 1
      || new Set(child.options.map((option) => option.semanticFingerprint)).size !== 4
      || !child.options[child.answerIndex]?.isCorrect) {
      throw new Error("CP-005 option integrity failed");
    }
    if ((child.queryContractId === "SEA-QC-003"
      || child.queryContractId === "SEA-QC-005"
      || child.queryContractId === "SEA-QC-022")
      && !/faces (the centre|outward)/i.test(child.explanation)) {
      throw new Error("CP-005 directional explanation did not resolve the reference facing");
    }
  }

  if (caselet.lifecycle.permanentQlCount !== 0
    || caselet.lifecycle.questionBankWritable
    || caselet.lifecycle.testEligible
    || caselet.lifecycle.publiclyPublishable) {
    throw new Error("CP-005 lifecycle lock violated");
  }
}
