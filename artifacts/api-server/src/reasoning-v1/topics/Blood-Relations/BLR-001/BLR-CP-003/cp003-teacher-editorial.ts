import { solveRelationFromGraph } from "../foundation/graph-closure";
import { stableHash } from "../foundation/prng";
import { relationLabel } from "../foundation/relation-ontology";
import type { FamilyGraph } from "../foundation/types";
import {
  generateBlrCp003EditorialReviewV2Records,
  type BlrCp003EditorialV2Record,
} from "./cp003-editorial-upgrader";
import { generateBlrCp003ExtendedGroup } from "./cp003-extended-generator";
import { generateBlrCp003ScenarioGroup } from "./cp003-generator";
import { generateBlrCp003LineageGroup } from "./cp003-lineage-generator";
import { BLR_CP003_LINEAGE_SCENARIOS } from "./cp003-lineage-scenarios";
import { generateBlrCp003MaritalGroup } from "./cp003-marital-generator";
import type { BlrCp003ReviewFamily } from "./cp003-review-registry";
import { BLR_CP003_SCENARIOS } from "./cp003-scenario-library";
import { generateBlrCp003SourceGapGroup } from "./cp003-source-gap-generator";
import { renderBlrCp003VisualFamilyTree } from "./cp003-visual-tree-renderer";

export interface BlrCp003TeacherOption {
  text: string;
  isCorrect: boolean;
}

export interface BlrCp003TeacherOptionAnalysis {
  optionLabel: "A" | "B" | "C" | "D";
  optionText: string;
  isCorrect: boolean;
  explanation: string;
}

export interface BlrCp003TeacherReviewRecord {
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
  options: readonly BlrCp003TeacherOption[];
  correctIndex: number;
  editorial: {
    coreConcept: readonly string[];
    familyTreeGrid: string;
    stepByStepSolution: readonly string[];
    optionAnalysis: readonly BlrCp003TeacherOptionAnalysis[];
    conclusion: string;
    examShortcut: string;
    commonTraps: readonly string[];
  };
  metadata: {
    runtimeVersion: "blr-cp003-teacher-editorial-v3";
    familyGraphValid: true;
    hiddenGraphAnswerAgreed: true;
    uniqueAnswer: true;
    optionSemanticsUnique: true;
    everyInputContributes: true;
    semanticFingerprint: string;
  };
}

interface TeacherContext {
  graph: FamilyGraph;
  names: Readonly<Record<string, string>>;
}

interface GroupContextSource {
  scenarioId: string;
  seed: number;
  personNames: Readonly<Record<string, string>>;
  reconstructedFamily: FamilyGraph;
  questions: readonly { itemId: string }[];
}

function contextKey(scenarioId: string, seed: number, itemId: string): string {
  return `${scenarioId}::${seed}::${itemId}`;
}

function addGroupContexts(
  contexts: Map<string, TeacherContext>,
  group: GroupContextSource,
): void {
  for (const item of group.questions) {
    contexts.set(contextKey(group.scenarioId, group.seed, item.itemId), {
      graph: group.reconstructedFamily,
      names: group.personNames,
    });
  }
}

function buildTeacherContexts(seeds: readonly number[]): Map<string, TeacherContext> {
  const contexts = new Map<string, TeacherContext>();
  for (const scenario of BLR_CP003_SCENARIOS) {
    for (const seed of seeds) {
      addGroupContexts(contexts, generateBlrCp003ScenarioGroup(scenario.scenarioId, seed));
    }
  }
  for (const seed of seeds) {
    addGroupContexts(contexts, generateBlrCp003ExtendedGroup(seed));
    addGroupContexts(contexts, generateBlrCp003MaritalGroup(seed));
    addGroupContexts(contexts, generateBlrCp003SourceGapGroup(seed));
  }
  for (const scenario of BLR_CP003_LINEAGE_SCENARIOS) {
    for (const seed of seeds) {
      addGroupContexts(contexts, generateBlrCp003LineageGroup(scenario.scenarioId, seed));
    }
  }
  return contexts;
}

function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
}

function personName(
  context: TeacherContext,
  personId: string,
): string {
  return context.names[personId] ??
    context.graph.persons.find((person) => person.personId === personId)?.name ??
    personId;
}

function areSpouses(graph: FamilyGraph, personAId: string, personBId: string): boolean {
  return graph.spouseEdges.some(
    (edge) =>
      (edge.personAId === personAId && edge.personBId === personBId) ||
      (edge.personAId === personBId && edge.personBId === personAId),
  );
}

function parentDirection(
  graph: FamilyGraph,
  personAId: string,
  personBId: string,
): "A_PARENT" | "B_PARENT" | null {
  if (graph.parentEdges.some((edge) => edge.parentId === personAId && edge.childId === personBId)) {
    return "A_PARENT";
  }
  if (graph.parentEdges.some((edge) => edge.parentId === personBId && edge.childId === personAId)) {
    return "B_PARENT";
  }
  return null;
}

function areSiblings(graph: FamilyGraph, personAId: string, personBId: string): boolean {
  if (
    graph.siblingEdges.some(
      (edge) =>
        (edge.personAId === personAId && edge.personBId === personBId) ||
        (edge.personAId === personBId && edge.personBId === personAId),
    )
  ) {
    return true;
  }
  const parentsOfA = new Set(
    graph.parentEdges.filter((edge) => edge.childId === personAId).map((edge) => edge.parentId),
  );
  return graph.parentEdges.some(
    (edge) => edge.childId === personBId && parentsOfA.has(edge.parentId),
  );
}

function parentGroups(graph: FamilyGraph): readonly {
  parentIds: readonly string[];
  childIds: readonly string[];
}[] {
  const parentsByChild = new Map<string, string[]>();
  for (const edge of graph.parentEdges) {
    const parents = parentsByChild.get(edge.childId) ?? [];
    parents.push(edge.parentId);
    parentsByChild.set(edge.childId, parents);
  }
  const grouped = new Map<string, { parentIds: readonly string[]; childIds: string[] }>();
  for (const [childId, parentIds] of parentsByChild) {
    const uniqueParents = [...new Set(parentIds)].sort();
    const key = uniqueParents.join("::");
    const entry = grouped.get(key) ?? { parentIds: uniqueParents, childIds: [] };
    entry.childIds.push(childId);
    grouped.set(key, entry);
  }
  return [...grouped.values()];
}

function joinNames(names: readonly string[]): string {
  if (names.length === 1) return names[0]!;
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}

function familySummary(context: TeacherContext): string[] {
  const summaries: string[] = [];
  const usedSpouses = new Set<string>();

  for (const group of parentGroups(context.graph)) {
    const parentNames = group.parentIds.map((id) => personName(context, id));
    const childNames = group.childIds.map((id) => personName(context, id)).sort();
    if (
      group.parentIds.length === 2 &&
      areSpouses(context.graph, group.parentIds[0]!, group.parentIds[1]!)
    ) {
      summaries.push(
        `${joinNames(parentNames)} are married, and ${joinNames(childNames)} ${childNames.length === 1 ? "is their child" : "are their children"}.`,
      );
      usedSpouses.add([...group.parentIds].sort().join("::"));
    } else {
      summaries.push(
        `${joinNames(childNames)} ${childNames.length === 1 ? "is" : "are"} shown as ${childNames.length === 1 ? "the child" : "children"} of ${joinNames(parentNames)}.`,
      );
    }
  }

  for (const edge of context.graph.spouseEdges) {
    const key = [edge.personAId, edge.personBId].sort().join("::");
    if (usedSpouses.has(key)) continue;
    summaries.push(
      `${personName(context, edge.personAId)} and ${personName(context, edge.personBId)} are married.`,
    );
  }

  return summaries;
}

function relationQuestionNames(stem: string): readonly [string, string] | null {
  const match = /^How is (.+) related to (.+)\?$/.exec(stem);
  return match ? [match[1]!, match[2]!] : null;
}

function exactLineageQuestionNames(stem: string): readonly [string, string] | null {
  const match = /^What is the exact relation of (.+) to (.+)\?$/.exec(stem);
  return match ? [match[1]!, match[2]!] : null;
}

function simpleCoreConcept(record: BlrCp003EditorialV2Record): readonly string[] {
  const prototypeId = record.prototypeId;
  if (prototypeId.includes("MARRIED-PAIR")) {
    return [
      "Look for two people joined directly as husband and wife in the passage or by the ======== marriage line in the diagram.",
      "Two people are not a married couple merely because they belong to the same family or generation.",
    ];
  }
  if (prototypeId.includes("SIBLING-PAIR")) {
    return [
      "Siblings share at least one displayed parent and appear on the same generation level.",
      "Use the ── sibling line or the common parent branch; do not rely only on age or generation.",
    ];
  }
  if (prototypeId.includes("PARENT-CHILD-PAIR")) {
    return [
      "A parent and child are connected by one direct vertical lineage step in the family tree.",
      "A grandparent, sibling or spouse pair does not satisfy a direct parent–child question.",
    ];
  }
  if (prototypeId.includes("MEMBER-SET")) {
    return [
      "Check every named family member and collect all people who have the required relation.",
      "The answer is correct only when it includes every match and no extra person.",
    ];
  }
  if (prototypeId.includes("IDENTIFY-PERSON-BY-GENDER")) {
    return [
      "Use clear family words such as son, daughter, husband and wife to determine gender.",
      "Do not guess gender from a person's name; use only the information given in the passage.",
    ];
  }
  if (prototypeId.includes("GENDER")) {
    return [
      "Find the gender-specific word connected to the named person, such as son, daughter, husband or wife.",
      "That word gives the answer directly, so there is no need to guess from the name.",
    ];
  }
  if (prototypeId.includes("MARITAL-STATUS")) {
    return [
      "A named husband or wife proves that a person is married; unmarried status must be stated clearly.",
      "The absence of a spouse's name does not by itself prove that someone is unmarried.",
    ];
  }
  if (prototypeId.includes("EXACT-LINEAGE")) {
    return [
      "First find the broad relation, then check whether the route reaches the person through the father or the mother.",
      "A route through the father is paternal; a route through the mother is maternal.",
    ];
  }
  if (prototypeId.includes("GENERATION")) {
    return [
      "Place the two people on the generation rows and compare their levels.",
      "Moving from parent to child changes one level, while spouses and siblings stay on the same level.",
    ];
  }
  if (prototypeId.includes("CLAIM")) {
    return [
      "Check each statement against the family tree exactly as it is written.",
      "A statement becomes wrong when the relation, gender, generation or direction is changed.",
    ];
  }
  if (prototypeId.includes("IDENTIFY")) {
    return [
      "Keep the person named in the question fixed, then test each option against the family tree.",
      "Choose the one person who has the required relation in the direction asked.",
    ];
  }
  return [
    "Draw the family generation by generation, then focus only on the two people named in the question.",
    "Always read the relation in the direction asked: how the first person is related to the second.",
  ];
}

function naturalizeOldStep(step: string): string {
  let match = /^Trace the relation from (.+) to (.+)\.$/.exec(step);
  if (match) {
    return `Now focus on ${match[1]} and ${match[2]}, because the question asks how ${match[1]} is related to ${match[2]}.`;
  }
  match = /^The supported family path is (.+)\.$/.exec(step);
  if (match) return `Follow the family links in the diagram: ${match[1]}.`;
  match = /^Trace (.+)\.$/.exec(step);
  if (match) return `Follow the family links in the diagram: ${match[1]}.`;
  match = /^The middle parent (.+) fixes the (paternal|maternal) side\.$/.exec(step);
  if (match) {
    return `The route goes through ${match[1]}, so this is the ${match[2]} side of the family.`;
  }
  return step
    .replace("modelled parent", "displayed parent")
    .replace("directly placed", "shown directly")
    .replace("Solve the relation of", "Check how")
    .replace("before checking the statements", "and then check the statements")
    .replace("satisfies the requested relation", "has the requested relation");
}

function teacherConclusion(record: BlrCp003EditorialV2Record): string {
  const correct = record.options[record.correctIndex]!;
  const relationNames = relationQuestionNames(record.stem);
  if (relationNames) {
    return `${relationNames[0]} is the ${correct.text.toLocaleLowerCase("en-IN")} of ${relationNames[1]}.`;
  }
  const lineageNames = exactLineageQuestionNames(record.stem);
  if (lineageNames) {
    return `${lineageNames[0]} is the ${correct.text.toLocaleLowerCase("en-IN")} of ${lineageNames[1]}.`;
  }
  if (record.prototypeId.includes("MARRIED-PAIR")) {
    return `${correct.text} are the married couple.`;
  }
  if (record.prototypeId.includes("SIBLING-PAIR")) {
    return `${correct.text} are siblings.`;
  }
  if (record.prototypeId.includes("PARENT-CHILD-PAIR")) {
    return `${correct.text} form the parent–child pair.`;
  }
  if (record.prototypeId.includes("MEMBER-SET")) {
    return `The complete answer is ${correct.text}.`;
  }
  if (record.prototypeId.includes("TRUE-CLAIM")) {
    return `Option ${optionLabel(record.correctIndex)} is definitely true.`;
  }
  if (record.prototypeId.includes("FALSE-CLAIM")) {
    return `Option ${optionLabel(record.correctIndex)} is definitely false.`;
  }
  return record.editorial.conclusion;
}

function teacherSteps(
  record: BlrCp003EditorialV2Record,
  context: TeacherContext,
  conclusion: string,
): readonly string[] {
  const steps = ["First, let's draw the family members generation by generation using the diagram below."];
  for (const summary of familySummary(context)) steps.push(`Notice that ${summary}`);
  for (const step of record.editorial.solutionSteps) steps.push(naturalizeOldStep(step));
  if (!steps.some((step) => step.includes("question asks"))) {
    const names = relationQuestionNames(record.stem);
    if (names) {
      steps.push(`Read the direction carefully: the question asks how ${names[0]} is related to ${names[1]}.`);
    }
  }
  steps.push(`Therefore, ${conclusion.charAt(0).toLocaleLowerCase("en-IN")}${conclusion.slice(1)}`);
  return [...new Set(steps)];
}

function pairOptionReason(
  record: BlrCp003EditorialV2Record,
  optionIndex: number,
  context: TeacherContext,
): string | null {
  const option = record.options[optionIndex]!;
  const match = /^PAIR:([^:]+)::([^:]+)$/.exec(option.semanticKey);
  if (!match) return null;
  const personAId = match[1]!;
  const personBId = match[2]!;
  const personA = personName(context, personAId);
  const personB = personName(context, personBId);

  if (option.isCorrect) {
    if (record.prototypeId.includes("MARRIED-PAIR")) {
      return `The diagram joins ${personA} and ${personB} with ========, so they are husband and wife.`;
    }
    if (record.prototypeId.includes("SIBLING-PAIR")) {
      return `${personA} and ${personB} share a displayed parent, so they are siblings.`;
    }
    return `The vertical lineage line directly connects ${personA} and ${personB} as parent and child.`;
  }

  if (areSpouses(context.graph, personAId, personBId)) {
    return `${personA} and ${personB} are husband and wife, so this is a married pair rather than the pair asked for.`;
  }
  const parent = parentDirection(context.graph, personAId, personBId);
  if (parent === "A_PARENT") {
    return `${personA} is the parent of ${personB}; they are not the required pair.`;
  }
  if (parent === "B_PARENT") {
    return `${personB} is the parent of ${personA}; they are not the required pair.`;
  }
  if (areSiblings(context.graph, personAId, personBId)) {
    return `${personA} and ${personB} are siblings, not the required pair.`;
  }
  try {
    const actual = solveRelationFromGraph(context.graph, personAId, personBId).relationId;
    return `${personA} is the ${relationLabel(actual).toLocaleLowerCase("en-IN")} of ${personB}, so this option does not match.`;
  } catch {
    return `The family tree does not show the required direct connection between ${personA} and ${personB}.`;
  }
}

function claimOptionReason(
  record: BlrCp003EditorialV2Record,
  optionIndex: number,
  context: TeacherContext,
): string | null {
  const option = record.options[optionIndex]!;
  const match = /^CLAIM:([^:]+):([^:]+):([^:]+)$/.exec(option.semanticKey);
  if (!match) return null;
  const subjectId = match[1]!;
  const claimedRelation = match[2]!;
  const referenceId = match[3]!;
  const subject = personName(context, subjectId);
  const reference = personName(context, referenceId);
  let actualText = "the stated relation is not established";
  try {
    const actual = solveRelationFromGraph(context.graph, subjectId, referenceId).relationId;
    actualText = `${subject} is actually the ${relationLabel(actual).toLocaleLowerCase("en-IN")} of ${reference}`;
  } catch {
    // Keep the friendly fallback above.
  }
  if (option.isCorrect) {
    return record.prototypeId.includes("FALSE-CLAIM")
      ? `${actualText}, not the ${relationLabel(claimedRelation as never).toLocaleLowerCase("en-IN")} claimed here. This is the false statement.`
      : `The family tree confirms this statement exactly.`;
  }
  return record.prototypeId.includes("FALSE-CLAIM")
    ? `This statement agrees with the family tree, so it cannot be the false option.`
    : `${actualText}; therefore this statement is not the definitely true option.`;
}

function personSetOptionReason(
  record: BlrCp003EditorialV2Record,
  optionIndex: number,
  context: TeacherContext,
): string | null {
  const option = record.options[optionIndex]!;
  const optionMatch = /^PERSON_SET:(.*)$/.exec(option.semanticKey);
  const correctMatch = /^PERSON_SET:(.*)$/.exec(record.options[record.correctIndex]!.semanticKey);
  if (!optionMatch || !correctMatch) return null;
  const optionIds = new Set(optionMatch[1]!.split("::").filter(Boolean));
  const correctIds = new Set(correctMatch[1]!.split("::").filter(Boolean));
  if (option.isCorrect) {
    return `This option includes every matching family member and does not add anyone else.`;
  }
  const missing = [...correctIds].filter((id) => !optionIds.has(id)).map((id) => personName(context, id));
  const extra = [...optionIds].filter((id) => !correctIds.has(id)).map((id) => personName(context, id));
  const parts: string[] = [];
  if (missing.length > 0) parts.push(`it leaves out ${joinNames(missing)}`);
  if (extra.length > 0) parts.push(`it wrongly includes ${joinNames(extra)}`);
  return `This set is incomplete because ${parts.join(" and ")}.`;
}

function personOptionReason(
  record: BlrCp003EditorialV2Record,
  optionIndex: number,
  context: TeacherContext,
): string | null {
  const option = record.options[optionIndex]!;
  const match = /^PERSON:([^:]+)$/.exec(option.semanticKey);
  if (!match) return null;
  const personId = match[1]!;
  const name = personName(context, personId);
  if (option.isCorrect) return `${name} is the only listed person who satisfies the condition in the question.`;

  if (record.prototypeId.includes("IDENTIFY-PERSON-BY-GENDER")) {
    const gender = context.graph.persons.find((person) => person.personId === personId)?.gender;
    const label = gender === "MALE" ? "male" : gender === "FEMALE" ? "female" : "not fixed";
    return `${name} is ${label} according to the passage, so this candidate does not match the requested gender.`;
  }

  const identifyMatch = /^Who is the (.+) of (.+)\?$/.exec(record.stem);
  if (identifyMatch) {
    const referenceEntry = Object.entries(context.names).find(([, value]) => value === identifyMatch[2]);
    if (referenceEntry) {
      try {
        const actual = solveRelationFromGraph(context.graph, personId, referenceEntry[0]).relationId;
        return `${name} is the ${relationLabel(actual).toLocaleLowerCase("en-IN")} of ${identifyMatch[2]}, not the ${identifyMatch[1]}.`;
      } catch {
        return `${name} does not have the required relation to ${identifyMatch[2]}.`;
      }
    }
  }

  return `${name} does not satisfy the exact relation or status asked in the question.`;
}

function simpleWrongReason(record: BlrCp003EditorialV2Record, optionIndex: number): string {
  const option = record.options[optionIndex]!;
  const correct = record.options[record.correctIndex]!;
  if (option.semanticKey.startsWith("RELATION:")) {
    return `The diagram gives ${correct.text.toLocaleLowerCase("en-IN")}, not ${option.text.toLocaleLowerCase("en-IN")}.`;
  }
  if (option.semanticKey.startsWith("EXACT_LINEAGE:")) {
    return `This option uses the wrong family side, gender or broad relation; the correct exact relation is ${correct.text}.`;
  }
  if (option.semanticKey.startsWith("GENDER:")) {
    return `The gender-specific word in the passage supports ${correct.text}, not ${option.text}.`;
  }
  if (option.semanticKey.startsWith("GENERATION")) {
    return `The two people occupy the generation positions shown in the diagram, so ${option.text} is not correct.`;
  }
  if (option.semanticKey.startsWith("MARITAL_STATUS:")) {
    return `The passage gives decisive marital evidence for ${correct.text}, not ${option.text}.`;
  }
  return `This option does not match the family tree or the direction asked.`;
}

function optionReason(
  record: BlrCp003EditorialV2Record,
  optionIndex: number,
  context: TeacherContext,
): string {
  const option = record.options[optionIndex]!;
  const specialised =
    pairOptionReason(record, optionIndex, context) ??
    claimOptionReason(record, optionIndex, context) ??
    personSetOptionReason(record, optionIndex, context) ??
    personOptionReason(record, optionIndex, context);
  if (specialised) return specialised;
  if (option.isCorrect) return `This option matches the family tree and the direction asked.`;
  return simpleWrongReason(record, optionIndex);
}

function teacherOptionAnalysis(
  record: BlrCp003EditorialV2Record,
  context: TeacherContext,
): readonly BlrCp003TeacherOptionAnalysis[] {
  return record.options.map((option, index) => ({
    optionLabel: optionLabel(index),
    optionText: option.text,
    isCorrect: option.isCorrect,
    explanation: optionReason(record, index, context),
  }));
}

function teacherShortcut(record: BlrCp003EditorialV2Record): string {
  const correct = record.options[record.correctIndex]!;
  if (record.prototypeId.includes("MARRIED-PAIR")) {
    return `Scan for “husband”, “wife” or “married”. The option joined by ======== is ${correct.text}.`;
  }
  if (record.prototypeId.includes("PAIR")) {
    return "Use the diagram first: reject an option as soon as one name fails the required family connection.";
  }
  if (record.prototypeId.includes("GENDER")) {
    return "Underline the first word such as son, daughter, husband or wife attached to the person; it gives the gender immediately.";
  }
  if (record.prototypeId.includes("MARITAL-STATUS")) {
    return "Look only for a named spouse or a direct unmarried statement; do not assume from missing information.";
  }
  if (record.prototypeId.includes("EXACT-LINEAGE")) {
    return "Mark the father-side and mother-side branches first, then apply the grandparent, aunt or uncle label.";
  }
  if (record.prototypeId.includes("GENERATION")) {
    return "Compare the generation labels beside the two names; each parent–child step changes the level by one.";
  }
  if (record.prototypeId.includes("MEMBER-SET")) {
    return "Tick every matching name once, then choose the option containing all ticks and no extra name.";
  }
  if (record.prototypeId.includes("CLAIM")) {
    return "Read each statement from the first name to the second and reject it immediately when the direction is reversed.";
  }
  const names = relationQuestionNames(record.stem);
  if (names) {
    return `Start at ${names[0]} in the diagram and move towards ${names[1]}; the answer must describe ${names[0]}, not the reverse.`;
  }
  return record.editorial.examShortcut;
}

function teacherCommonTraps(
  record: BlrCp003EditorialV2Record,
  analyses: readonly BlrCp003TeacherOptionAnalysis[],
): readonly string[] {
  const trap = analyses.find((entry) => !entry.isCorrect)!;
  const traps = [
    `Don't fall for Option ${trap.optionLabel} (${trap.optionText}). ${trap.explanation}`,
  ];
  const names = relationQuestionNames(record.stem);
  if (names) {
    traps.push(
      `Do not reverse the question. It asks how ${names[0]} is related to ${names[1]}, not how ${names[1]} is related to ${names[0]}.`,
    );
  } else if (record.prototypeId.includes("PAIR")) {
    traps.push("Two names appearing in the same sentence or generation do not automatically form the required pair.");
  }
  return traps;
}

export function upgradeBlrCp003TeacherRecord(
  record: BlrCp003EditorialV2Record,
  context: TeacherContext,
): BlrCp003TeacherReviewRecord {
  const conclusion = teacherConclusion(record);
  const optionAnalysis = teacherOptionAnalysis(record, context);
  const familyTreeGrid = renderBlrCp003VisualFamilyTree(context.graph, context.names);
  const stepByStepSolution = teacherSteps(record, context, conclusion);
  const coreConcept = simpleCoreConcept(record);
  const examShortcut = teacherShortcut(record);
  const commonTraps = teacherCommonTraps(record, optionAnalysis);

  return {
    packageId: record.packageId,
    checkpointId: record.checkpointId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: record.locale,
    reviewFamily: record.reviewFamily,
    scenarioId: record.scenarioId,
    topologyId: record.topologyId,
    seed: record.seed,
    itemId: record.itemId,
    prototypeId: record.prototypeId,
    sharedPrompt: record.sharedPrompt,
    stem: record.stem,
    options: record.options.map((option) => ({ text: option.text, isCorrect: option.isCorrect })),
    correctIndex: record.correctIndex,
    editorial: {
      coreConcept,
      familyTreeGrid,
      stepByStepSolution,
      optionAnalysis,
      conclusion,
      examShortcut,
      commonTraps,
    },
    metadata: {
      runtimeVersion: "blr-cp003-teacher-editorial-v3",
      familyGraphValid: true,
      hiddenGraphAnswerAgreed: true,
      uniqueAnswer: true,
      optionSemanticsUnique: true,
      everyInputContributes: true,
      semanticFingerprint: stableHash([
        record.metadata.semanticFingerprint,
        familyTreeGrid,
        ...coreConcept,
        ...stepByStepSolution,
        ...optionAnalysis.flatMap((entry) => [entry.optionLabel, entry.optionText, entry.explanation]),
        conclusion,
        examShortcut,
        ...commonTraps,
      ]),
    },
  };
}

export function generateBlrCp003TeacherReviewRecords(
  seeds: readonly number[] = [0, 1, 2, 3],
): BlrCp003TeacherReviewRecord[] {
  const contexts = buildTeacherContexts(seeds);
  return generateBlrCp003EditorialReviewV2Records(seeds).map((record) => {
    const context = contexts.get(contextKey(record.scenarioId, record.seed, record.itemId));
    if (!context) throw new Error(`Missing CP-003 teacher context for ${record.itemId}.`);
    return upgradeBlrCp003TeacherRecord(record, context);
  });
}
