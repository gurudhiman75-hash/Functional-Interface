import { generationDelta } from "../foundation/family-analysis";
import { stableHash } from "../foundation/prng";
import type { FamilyGraph } from "../foundation/types";
import { generateBlrCp003ExtendedGroup } from "./cp003-extended-generator";
import { blrCp003ExtendedSemanticKey } from "./cp003-extended-solver";
import { generateBlrCp003ScenarioGroup } from "./cp003-generator";
import { generateBlrCp003LineageGroup } from "./cp003-lineage-generator";
import { BLR_CP003_LINEAGE_SCENARIOS } from "./cp003-lineage-scenarios";
import { blrCp003LineageSemanticKey } from "./cp003-lineage-solver";
import { generateBlrCp003MaritalGroup } from "./cp003-marital-generator";
import { blrCp003MaritalSemanticKey } from "./cp003-marital-solver";
import { BLR_CP003_SCENARIOS } from "./cp003-scenario-library";
import { blrCp003SemanticKey } from "./cp003-solver";
import { generateBlrCp003SourceGapGroup } from "./cp003-source-gap-generator";
import { blrCp003SourceGapSemanticKey } from "./cp003-source-gap-solver";

export type BlrCp003ReviewFamily =
  | "BASE_SHARED_GRAPH"
  | "EXTENDED_SHARED_GRAPH"
  | "EXPLICIT_MARITAL_STATUS"
  | "LINEAGE_AND_FOUR_GENERATION"
  | "COMPACT_JOINT_PARENT_PASSAGE";

export interface BlrCp003ReviewOption {
  text: string;
  semanticKey: string;
  isCorrect: boolean;
  errorLabel?: string;
}

export interface BlrCp003ReviewRecord {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-003";
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  locale: "en-IN";
  reviewFamily: BlrCp003ReviewFamily;
  scenarioId: string;
  topologyId: string;
  seed: number;
  itemId: string;
  prototypeId: string;
  sharedPrompt: string;
  stem: string;
  options: readonly BlrCp003ReviewOption[];
  correctIndex: number;
  answerKey: string;
  editorial: {
    coreConcept: readonly string[];
    normalizedFacts: readonly string[];
    familyRows: readonly string[];
    solutionSteps: readonly string[];
    conclusion: string;
    examShortcut: string;
    closestTrapRejection: string;
  };
  metadata: {
    runtimeVersion: "blr-cp003-editorial-review-v1";
    familyGraphValid: true;
    hiddenGraphAnswerAgreed: true;
    uniqueAnswer: true;
    optionSemanticsUnique: true;
    everyInputContributes: true;
    semanticFingerprint: string;
  };
}

function topGenerationRoot(graph: FamilyGraph): string {
  const childIds = new Set(graph.parentEdges.map((edge) => edge.childId));
  return (
    graph.persons.find((person) => !childIds.has(person.personId))?.personId ??
    graph.persons[0]?.personId ??
    ""
  );
}

function generationRows(
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
): string[] {
  const rootId = topGenerationRoot(graph);
  if (!rootId) {
    throw new Error("CP-003 editorial renderer received an empty family graph.");
  }
  const rows = new Map<number, string[]>();
  for (const person of graph.persons) {
    const delta = generationDelta(graph, person.personId, rootId);
    const members = rows.get(delta) ?? [];
    members.push(names[person.personId] ?? person.name);
    rows.set(delta, members);
  }
  return [...rows.entries()]
    .sort(([left], [right]) => right - left)
    .map(([delta, members]) => {
      const label =
        delta === 0
          ? "Generation 0"
          : `Generation ${delta > 0 ? "+" : ""}${delta}`;
      return `${label}: ${members.sort().join(", ")}`;
    });
}

function conceptFor(prototypeId: string): readonly string[] {
  if (prototypeId.includes("IDENTIFY-PERSON-BY-GENDER")) {
    return [
      "Use the gender-specific relation attached to each candidate, not the spelling of the name.",
      "The candidate set must contain exactly one member whose entailed gender matches the question.",
    ];
  }
  if (prototypeId.includes("EXACT-LINEAGE")) {
    return [
      "First determine the broad relation, then inspect whether the path passes through the father or the mother.",
      "The intermediate parent fixes the paternal or maternal label; it is not chosen from the grandparent's gender.",
    ];
  }
  if (prototypeId.includes("MARITAL-STATUS")) {
    return [
      "A named spouse proves married status, while unmarried status requires an explicit statement.",
      "The absence of a spouse clue is incomplete information, not proof that a person is unmarried.",
    ];
  }
  if (prototypeId.includes("MEMBER-SET")) {
    return [
      "Solve the requested relation for every named member before forming the final set.",
      "The correct option must contain all matching members and no extra member.",
    ];
  }
  if (prototypeId.includes("PAIR")) {
    return [
      "Test both names in each option against the reconstructed family graph.",
      "A pair that is in the same generation is not automatically a sibling or married pair.",
    ];
  }
  if (
    prototypeId.includes("GENERATION") ||
    prototypeId.includes("THREE-GENERATION")
  ) {
    return [
      "Place the named people on generation rows before comparing them.",
      "Parent-child movement changes one level; spouse and sibling movement changes no level.",
    ];
  }
  if (prototypeId.includes("FALSE-CLAIM")) {
    return [
      "Evaluate each statement in the exact subject-to-reference direction shown.",
      "The false option may use the correct people but reverse the direction, gender or generation.",
    ];
  }
  if (prototypeId.includes("TRUE-CLAIM")) {
    return [
      "Translate each option into a subject, relation and reference triple.",
      "Only the statement supported by the reconstructed family graph is definitely true.",
    ];
  }
  if (prototypeId.includes("IDENTIFY")) {
    return [
      "Keep the reference person fixed and test each candidate as the subject.",
      "Do not reverse the requested relation while scanning the names.",
    ];
  }
  return [
    "Reconstruct the shared family once, then answer each item from that same graph.",
    "Trace the relation in the exact direction named in the question.",
  ];
}

function shortcutFor(prototypeId: string): string {
  if (prototypeId.includes("IDENTIFY-PERSON-BY-GENDER")) {
    return "Underline gendered words such as son, daughter, husband and wife, then compare only the listed candidates.";
  }
  if (prototypeId.includes("EXACT-LINEAGE")) {
    return "Mark the father-side and mother-side branches first; then apply the broad relation label.";
  }
  if (prototypeId.includes("MARITAL-STATUS")) {
    return "Use only a named spouse or an explicit status statement; never fill a missing spouse by assumption.";
  }
  if (prototypeId.includes("MEMBER-SET")) {
    return "Make a quick checklist of every named member and tick only those satisfying the requested relation.";
  }
  if (prototypeId.includes("PAIR")) {
    return "Reject an option as soon as one of its two names fails the required connection.";
  }
  if (prototypeId.includes("GENERATION")) {
    return "Assign row numbers and subtract them; check direction before selecting above or below.";
  }
  if (prototypeId.includes("CLAIM")) {
    return "Read every statement as subject → relation → reference, not as a loose family association.";
  }
  if (prototypeId.includes("IDENTIFY")) {
    return "Hold the reference name fixed and test the candidates one by one.";
  }
  return "Draw only the shortest useful path between the two people asked about.";
}

function reviewRecord(input: {
  family: BlrCp003ReviewFamily;
  scenarioId: string;
  topologyId: string;
  seed: number;
  sharedPrompt: string;
  personNames: Readonly<Record<string, string>>;
  graph: FamilyGraph;
  everyInputContributes: boolean;
  itemId: string;
  prototypeId: string;
  stem: string;
  options: readonly BlrCp003ReviewOption[];
  correctIndex: number;
  answerKey: string;
  normalizedFacts: readonly string[];
  solutionSteps: readonly string[];
  conclusion: string;
  closestTrapRejection: string;
}): BlrCp003ReviewRecord {
  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-003",
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    reviewFamily: input.family,
    scenarioId: input.scenarioId,
    topologyId: input.topologyId,
    seed: input.seed,
    itemId: input.itemId,
    prototypeId: input.prototypeId,
    sharedPrompt: input.sharedPrompt,
    stem: input.stem,
    options: input.options,
    correctIndex: input.correctIndex,
    answerKey: input.answerKey,
    editorial: {
      coreConcept: conceptFor(input.prototypeId),
      normalizedFacts: input.normalizedFacts,
      familyRows: generationRows(input.graph, input.personNames),
      solutionSteps: input.solutionSteps,
      conclusion: input.conclusion,
      examShortcut: shortcutFor(input.prototypeId),
      closestTrapRejection: input.closestTrapRejection,
    },
    metadata: {
      runtimeVersion: "blr-cp003-editorial-review-v1",
      familyGraphValid: true,
      hiddenGraphAnswerAgreed: true,
      uniqueAnswer: true,
      optionSemanticsUnique: true,
      everyInputContributes: input.everyInputContributes,
      semanticFingerprint: stableHash([
        input.family,
        input.scenarioId,
        input.seed,
        input.itemId,
        input.prototypeId,
        input.answerKey,
      ]),
    },
  };
}

export function generateBlrCp003EditorialReviewRecords(
  seeds: readonly number[] = [0, 1, 2, 3],
): BlrCp003ReviewRecord[] {
  const records: BlrCp003ReviewRecord[] = [];

  for (const scenario of BLR_CP003_SCENARIOS) {
    for (const seed of seeds) {
      const group = generateBlrCp003ScenarioGroup(scenario.scenarioId, seed);
      for (const item of group.questions) {
        records.push(
          reviewRecord({
            family: "BASE_SHARED_GRAPH",
            scenarioId: group.scenarioId,
            topologyId: group.topologyId,
            seed,
            sharedPrompt: group.sharedPrompt,
            personNames: group.personNames,
            graph: group.reconstructedFamily,
            everyInputContributes: group.metadata.everyClueContributes,
            itemId: item.itemId,
            prototypeId: item.prototypeId,
            stem: item.stem,
            options: item.options,
            correctIndex: item.correctIndex,
            answerKey: blrCp003SemanticKey(item.answer),
            normalizedFacts: item.explanation.familyPlacements,
            solutionSteps: item.explanation.queryTrace,
            conclusion: item.explanation.conclusion,
            closestTrapRejection: item.explanation.closestTrapRejection,
          }),
        );
      }
    }
  }

  for (const seed of seeds) {
    const group = generateBlrCp003ExtendedGroup(seed);
    for (const item of group.questions) {
      records.push(
        reviewRecord({
          family: "EXTENDED_SHARED_GRAPH",
          scenarioId: group.scenarioId,
          topologyId: group.topologyId,
          seed,
          sharedPrompt: group.sharedPrompt,
          personNames: group.personNames,
          graph: group.reconstructedFamily,
          everyInputContributes: group.metadata.everyClueContributes,
          itemId: item.itemId,
          prototypeId: item.prototypeId,
          stem: item.stem,
          options: item.options,
          correctIndex: item.correctIndex,
          answerKey: blrCp003ExtendedSemanticKey(item.answer),
          normalizedFacts: item.explanation.normalizedClues,
          solutionSteps: item.explanation.decisiveTrace,
          conclusion: item.explanation.conclusion,
          closestTrapRejection: item.explanation.closestTrapRejection,
        }),
      );
    }
  }

  for (const seed of seeds) {
    const group = generateBlrCp003MaritalGroup(seed);
    for (const item of group.questions) {
      records.push(
        reviewRecord({
          family: "EXPLICIT_MARITAL_STATUS",
          scenarioId: group.scenarioId,
          topologyId: group.topologyId,
          seed,
          sharedPrompt: group.sharedPrompt,
          personNames: group.personNames,
          graph: group.reconstructedFamily,
          everyInputContributes:
            group.metadata.everyClueAndStatusFactContributes,
          itemId: item.itemId,
          prototypeId: item.prototypeId,
          stem: item.stem,
          options: item.options,
          correctIndex: item.correctIndex,
          answerKey: blrCp003MaritalSemanticKey(item.answer),
          normalizedFacts: item.explanation.normalizedFacts,
          solutionSteps: item.explanation.decisiveTrace,
          conclusion: item.explanation.conclusion,
          closestTrapRejection: item.explanation.closestTrapRejection,
        }),
      );
    }
  }

  for (const scenario of BLR_CP003_LINEAGE_SCENARIOS) {
    for (const seed of seeds) {
      const group = generateBlrCp003LineageGroup(scenario.scenarioId, seed);
      for (const item of group.questions) {
        records.push(
          reviewRecord({
            family: "LINEAGE_AND_FOUR_GENERATION",
            scenarioId: group.scenarioId,
            topologyId: group.topologyId,
            seed,
            sharedPrompt: group.sharedPrompt,
            personNames: group.personNames,
            graph: group.reconstructedFamily,
            everyInputContributes: group.metadata.everyClueContributes,
            itemId: item.itemId,
            prototypeId: item.prototypeId,
            stem: item.stem,
            options: item.options,
            correctIndex: item.correctIndex,
            answerKey: blrCp003LineageSemanticKey(item.answer),
            normalizedFacts: item.explanation.normalizedClues,
            solutionSteps: item.explanation.pathTrace,
            conclusion: item.explanation.conclusion,
            closestTrapRejection: item.explanation.closestTrapRejection,
          }),
        );
      }
    }
  }

  for (const seed of seeds) {
    const group = generateBlrCp003SourceGapGroup(seed);
    for (const item of group.questions) {
      records.push(
        reviewRecord({
          family: "COMPACT_JOINT_PARENT_PASSAGE",
          scenarioId: group.scenarioId,
          topologyId: group.topologyId,
          seed,
          sharedPrompt: group.sharedPrompt,
          personNames: group.personNames,
          graph: group.reconstructedFamily,
          everyInputContributes: group.metadata.everyClueContributes,
          itemId: item.itemId,
          prototypeId: item.prototypeId,
          stem: item.stem,
          options: item.options,
          correctIndex: item.correctIndex,
          answerKey: blrCp003SourceGapSemanticKey(item.answer),
          normalizedFacts: item.explanation.normalizedClues,
          solutionSteps: item.explanation.decisiveTrace,
          conclusion: item.explanation.conclusion,
          closestTrapRejection: item.explanation.closestTrapRejection,
        }),
      );
    }
  }

  return records;
}
