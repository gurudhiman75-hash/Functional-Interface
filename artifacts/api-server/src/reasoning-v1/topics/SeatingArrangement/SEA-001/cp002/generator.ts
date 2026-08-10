import { canonicalDigest } from "../canonical.ts";
import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import {
  presentSea001Children,
  presentSea001Text,
  sea001DisplayName,
  sea001DisplayNameMap,
  sea001PersonIds,
} from "../generation/person-presentation.ts";
import { constraintTrueInMixedState, mixedConstraintFingerprint, renderMixedConstraint } from "./constraints.ts";
import { buildMixedFacingChildren } from "./questions.ts";
import { enumerateMixedFacingOracle, enumerateMixedFacingProduction } from "./solvers.ts";
import type {
  MixedFacingBlueprintId,
  MixedFacingCaseletRecord,
  MixedFacingConstraint,
  MixedFacingDirection,
  MixedFacingProofEvent,
  MixedPersonId,
} from "./types.ts";

export const SEA_CP002_BLUEPRINTS: readonly MixedFacingBlueprintId[] = ["SEA-PBA-005", "SEA-PBA-006", "SEA-PBA-007", "SEA-PBA-008"];
const LIFECYCLE = Object.freeze({
  discoveryStatus: "EXECUTABLE_FOUNDATION" as const,
  permanentQlCount: 0 as const,
  questionStudioRegistered: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

function controlledFacings(order: readonly MixedPersonId[], rng: DeterministicRandom): Readonly<Record<MixedPersonId, MixedFacingDirection>> {
  const northCount = rng.integer(2, order.length - 2);
  const northPeople = new Set(rng.shuffle(order).slice(0, northCount));
  return Object.fromEntries(order.map((personId) => [personId, northPeople.has(personId) ? "NORTH" : "SOUTH"])) as Readonly<Record<MixedPersonId, MixedFacingDirection>>;
}

function nextIdFactory(): () => string {
  let serial = 0;
  return () => `SEA-CP002-CL-${String(++serial).padStart(3, "0")}`;
}

function immediateRelation(
  order: readonly MixedPersonId[],
  facings: Readonly<Record<MixedPersonId, MixedFacingDirection>>,
  referenceIndex: number,
  subjectIndex: number,
  id: string,
): MixedFacingConstraint {
  const referenceId = order[referenceIndex];
  const subjectId = order[subjectIndex];
  if (!referenceId || !subjectId || Math.abs(referenceIndex - subjectIndex) !== 1) throw new Error("Immediate mixed-facing relation requires adjacent hidden seats");
  const observerDirection = subjectIndex > referenceIndex ? "RIGHT" : "LEFT";
  const referenceFacing = facings[referenceId];
  const direction = referenceFacing === "NORTH"
    ? observerDirection
    : observerDirection === "RIGHT" ? "LEFT" : "RIGHT";
  return { id, kind: "RELATIVE_POSITION", subjectId, referenceId, direction, steps: 1 };
}

function requirementSatisfied(blueprint: MixedFacingBlueprintId, constraints: readonly MixedFacingConstraint[], seatCount: number): boolean {
  const count = (kind: MixedFacingConstraint["kind"]): number => constraints.filter((constraint) => constraint.kind === kind).length;
  switch (blueprint) {
    case "SEA-PBA-005": return count("FACING") >= 2 && count("RELATIVE_POSITION") >= seatCount - 1;
    case "SEA-PBA-006": return count("FACING") === 0 && count("RELATIVE_POSITION") >= seatCount;
    case "SEA-PBA-007": return count("FACING") >= 2 && count("ADJACENT") >= 1 && count("RELATIVE_POSITION") >= 2;
    case "SEA-PBA-008": return count("FACING") >= 2 && count("EXACT_COUNT_BETWEEN") >= 1 && count("RELATIVE_POSITION") >= 2;
  }
}

function candidateConstraints(
  blueprint: MixedFacingBlueprintId,
  order: readonly MixedPersonId[],
  facings: Readonly<Record<MixedPersonId, MixedFacingDirection>>,
  rng: DeterministicRandom,
): MixedFacingConstraint[] {
  const nextId = nextIdFactory();
  const constraints: MixedFacingConstraint[] = [
    { id: nextId(), kind: "ABSOLUTE_SEAT", personId: order[0] as MixedPersonId, seatIndex: 0 },
  ];

  if (blueprint === "SEA-PBA-005") {
    for (let index = 1; index < order.length; index += 1) {
      const personId = order[index];
      if (personId) constraints.push({ id: nextId(), kind: "FACING", personId, facing: facings[personId] as MixedFacingDirection });
    }
    for (let index = 0; index < order.length - 1; index += 1) constraints.push(immediateRelation(order, facings, index, index + 1, nextId()));
  } else if (blueprint === "SEA-PBA-006") {
    for (let index = 0; index < order.length - 1; index += 1) constraints.push(immediateRelation(order, facings, index, index + 1, nextId()));
    constraints.push(immediateRelation(order, facings, order.length - 1, order.length - 2, nextId()));
  } else if (blueprint === "SEA-PBA-007") {
    const split = rng.integer(2, order.length - 2);
    for (const personId of order) constraints.push({ id: nextId(), kind: "FACING", personId, facing: facings[personId] as MixedFacingDirection });
    for (let index = 0; index < order.length - 1; index += 1) {
      if (index === split - 1) continue;
      constraints.push(immediateRelation(order, facings, index, index + 1, nextId()));
    }
    constraints.push({ id: nextId(), kind: "ADJACENT", firstId: order[split - 1] as MixedPersonId, secondId: order[split] as MixedPersonId });
  } else {
    for (const personId of order) constraints.push({ id: nextId(), kind: "FACING", personId, facing: facings[personId] as MixedFacingDirection });
    for (let index = 0; index < order.length - 3; index += 1) constraints.push(immediateRelation(order, facings, index, index + 1, nextId()));
    const knownIndex = order.length - 4;
    const targetIndex = order.length - 2;
    constraints.push({
      id: nextId(),
      kind: "EXACT_COUNT_BETWEEN",
      firstId: order[knownIndex] as MixedPersonId,
      secondId: order[targetIndex] as MixedPersonId,
      count: targetIndex - knownIndex - 1,
    });
  }

  return constraints;
}

function minimalUniqueConstraints(
  blueprint: MixedFacingBlueprintId,
  persons: readonly MixedPersonId[],
  candidates: readonly MixedFacingConstraint[],
): MixedFacingConstraint[] {
  const constraints = [...candidates];
  const modelCount = (trial: readonly MixedFacingConstraint[]): number => enumerateMixedFacingProduction({ persons, constraints: trial, maxModels: 2 }).length;
  if (modelCount(constraints) !== 1) throw new Error("Candidate CP-002 clue set is not uniquely solvable");

  for (let index = constraints.length - 1; index >= 0; index -= 1) {
    const trial = constraints.filter((_, candidateIndex) => candidateIndex !== index);
    if (requirementSatisfied(blueprint, trial, persons.length) && modelCount(trial) === 1) constraints.splice(index, 1);
  }

  if (!requirementSatisfied(blueprint, constraints, persons.length)) throw new Error("CP-002 blueprint requirement was lost");
  for (const clue of constraints) {
    const trial = constraints.filter((candidate) => candidate.id !== clue.id);
    if (modelCount(trial) === 1) throw new Error(`Displayed redundant mixed-facing clue: ${clue.id}`);
  }
  if (new Set(constraints.map(mixedConstraintFingerprint)).size !== constraints.length) throw new Error("Semantically duplicate CP-002 clue");
  return constraints;
}

function proofTrace(constraints: readonly MixedFacingConstraint[]): readonly MixedFacingProofEvent[] {
  return constraints.map((constraint, index): MixedFacingProofEvent => {
    const kind: MixedFacingProofEvent["kind"] = constraint.kind === "ABSOLUTE_SEAT" || constraint.kind === "AT_END" ? "ABSOLUTE_ANCHOR"
      : constraint.kind === "FACING" || constraint.kind === "SAME_FACING" || constraint.kind === "OPPOSITE_FACING" ? "FACING_RESOLUTION"
      : constraint.kind === "EXACT_COUNT_BETWEEN" ? "GAP_PLACEMENT"
      : constraint.kind === "ADJACENT" ? "BLOCK_PLACEMENT"
      : "RELATIVE_PLACEMENT";
    return { id: `SEA-CP002-PROOF-${String(index + 1).padStart(3, "0")}`, kind, sourceConstraintIds: [constraint.id], statement: renderMixedConstraint(constraint) };
  });
}

function attempt(seed: string, blueprint: MixedFacingBlueprintId): MixedFacingCaseletRecord {
  const rng = new DeterministicRandom(seed);
  const seatCount = rng.integer(6, 8);
  const persons = sea001PersonIds(seatCount) as MixedPersonId[];
  const displayNames = sea001DisplayNameMap(seed, persons, `${blueprint}:cp002`);
  const order = rng.shuffle(persons);
  const facings = controlledFacings(order, rng);
  const candidates = candidateConstraints(blueprint, order, facings, rng);
  if (candidates.some((constraint) => !constraintTrueInMixedState(constraint, order, facings))) throw new Error("Derived false CP-002 clue");
  const constraints = minimalUniqueConstraints(blueprint, persons, candidates);
  const production = enumerateMixedFacingProduction({ persons, constraints });
  const oracle = enumerateMixedFacingOracle({ persons, constraints });
  const productionKeys = production.map((model) => model.canonicalKey);
  const oracleKeys = oracle.map((model) => model.canonicalKey);
  if (productionKeys.length !== 1 || JSON.stringify(productionKeys) !== JSON.stringify(oracleKeys)) throw new Error("CP-002 production/oracle disagreement");
  const model = production[0];
  if (!model) throw new Error("Missing CP-002 model");
  const children = presentSea001Children(buildMixedFacingChildren(seed, model, rng), displayNames);
  const clueTexts = constraints.map((constraint) => presentSea001Text(renderMixedConstraint(constraint), displayNames));
  const diagramText = model.seatOrder
    .map((personId, index) => `${index + 1}:${sea001DisplayName(personId, displayNames)}${model.facings[personId] === "NORTH" ? "↑" : "↓"}`)
    .join(" | ");
  const facingLines = model.seatOrder.map((personId) => `${sea001DisplayName(personId, displayNames)} faces ${model.facings[personId]?.toLowerCase()}.`);
  const sharedExplanation = [
    "Number the seats from left to right.",
    "For every left/right clue, first note the facing of the reference person: north-facing persons use the observer's left/right, while south-facing persons reverse it.",
    "Apply the clues in order:",
    ...clueTexts.map((clue, index) => `${index + 1}. ${clue}`),
    `The final row is ${diagramText}.`,
    `Facing pattern: ${facingLines.join(" ")}`,
  ].join("\n");
  const listedNames = persons.map((personId) => sea001DisplayName(personId, displayNames));

  return {
    caseletId: `SEA-CP002-${canonicalDigest({ seed, blueprint }).slice(0, 16)}`,
    chapterId: "REAS-SEA",
    packageId: "SEA-001",
    checkpointId: "SEA-CP-002",
    blueprintAuthorityId: blueprint,
    seed,
    locale: "en-IN",
    setupText: `${seatCount} persons—${listedNames.join(", ")}—are sitting in a straight row. Some face north and the others face south. They are not necessarily seated in the same order as listed.`,
    clueTexts,
    constraints,
    hiddenStateFingerprint: canonicalDigest({ order, facings }),
    clueSetFingerprint: canonicalDigest(constraints.map(mixedConstraintFingerprint).sort()),
    solutionPolicy: "UNIQUE_STATE",
    solutionStateCount: 1,
    solverOracleAgreement: { productionKeys, oracleKeys, passed: true },
    checkpointSkillCoverage: ["MIXED_FACING_RESOLUTION", "REFERENCE_PERSON_LEFT_RIGHT", blueprint === "SEA-PBA-006" ? "INFERRED_FACING" : "STATED_FACING", blueprint === "SEA-PBA-007" ? "BLOCK_PLACEMENT" : blueprint === "SEA-PBA-008" ? "EXACT_GAP" : "RELATIVE_CHAIN"],
    queryFactFingerprints: children.map((child) => child.answerDeterminingFactFingerprint),
    crossQuestionLeakagePassed: new Set(children.map((child) => child.answerDeterminingFactFingerprint)).size === children.length,
    proofTrace: proofTrace(constraints),
    sharedExplanation,
    diagramText,
    children,
    lifecycle: LIFECYCLE,
  };
}

export function generateMixedFacingCaselet(seed: string, blueprint: MixedFacingBlueprintId): MixedFacingCaseletRecord {
  if (!SEA_CP002_BLUEPRINTS.includes(blueprint)) throw new Error(`Unsupported CP-002 blueprint: ${blueprint}`);
  let lastError: unknown;
  for (let retry = 0; retry < 48; retry += 1) {
    try { return attempt(`${seed}::attempt-${retry}`, blueprint); } catch (error) { lastError = error; }
  }
  throw new Error(`Failed to generate ${blueprint}: ${String(lastError)}`);
}

export function assertMixedFacingCaseletIntegrity(caselet: MixedFacingCaseletRecord): void {
  if (caselet.solutionStateCount !== 1 || !caselet.solverOracleAgreement.passed) throw new Error("CP-002 solution policy failed");
  if (caselet.children.length !== 4 || new Set(caselet.queryFactFingerprints).size !== 4 || !caselet.crossQuestionLeakagePassed) throw new Error("CP-002 child diversity failed");
  if (new Set(caselet.constraints.map(mixedConstraintFingerprint)).size !== caselet.constraints.length) throw new Error("CP-002 semantic clue duplication");
  const modelKey = caselet.solverOracleAgreement.productionKeys[0];
  if (!modelKey) throw new Error("CP-002 model key missing");
  const [orderPart, facingPart] = modelKey.split("|");
  const order = orderPart?.split(">") ?? [];
  const facings = Object.fromEntries((facingPart?.split(",") ?? []).map((entry) => {
    const [personId, facing] = entry.split(":");
    return [personId, facing];
  })) as Readonly<Record<MixedPersonId, MixedFacingDirection>>;
  if (caselet.constraints.some((constraint) => !constraintTrueInMixedState(constraint, order, facings))) throw new Error("CP-002 displayed false clue");
  if (new Set(Object.values(facings)).size !== 2) throw new Error("CP-002 state is not genuinely mixed-facing");
  for (const child of caselet.children) {
    if (child.options.length !== 4 || child.options.filter((option) => option.isCorrect).length !== 1 || new Set(child.options.map((option) => option.semanticFingerprint)).size !== 4 || !child.options[child.answerIndex]?.isCorrect) throw new Error("CP-002 option integrity failed");
    if ((child.queryContractId === "SEA-QC-003" || child.queryContractId === "SEA-QC-005") && !/faces (north|south)/i.test(child.explanation)) throw new Error("Facing-dependent explanation did not resolve the reference facing");
  }
  if (caselet.lifecycle.permanentQlCount !== 0 || caselet.lifecycle.questionBankWritable || caselet.lifecycle.testEligible || caselet.lifecycle.publiclyPublishable) throw new Error("CP-002 lifecycle lock violated");
}
