import { solveRelationFromGraph } from "../foundation/graph-closure";
import type { FamilyGraph } from "../foundation/types";
import type { BlrCp003CompetitiveRawContext } from "./cp003-competitive-exam-gate";
import type { BlrCp003TeacherReviewRecord } from "./cp003-teacher-editorial";
import { blrCp003VisualGenerationMap } from "./cp003-visual-tree-renderer";

export type BlrCp003SvgGender = "male" | "female" | "unknown";

export interface BlrCp003SvgFamilyTreeNode {
  id: string;
  label: string;
  gender: BlrCp003SvgGender;
  generation: number;
  roleLabel?: string;
}

export interface BlrCp003SvgFamilyTreeEdge {
  id: string;
  type: "marriage" | "parent-child" | "sibling";
  sourceId: string;
  targetId: string;
}

export interface BlrCp003SvgFamilyTreeDiagram {
  kind: "blood-relation-family-tree";
  version: 1;
  title: string;
  nodes: BlrCp003SvgFamilyTreeNode[];
  edges: BlrCp003SvgFamilyTreeEdge[];
  query?: {
    subjectId?: string;
    referenceId?: string;
    answerLabel?: string;
    pathPersonIds?: string[];
  };
  accessibleSummary: string;
  asciiFallback: string;
}

export interface BlrCp003SvgTargetOverride {
  subjectId: string;
  referenceId: string;
  answerLabel: string;
}

function personIdForName(
  context: BlrCp003CompetitiveRawContext,
  name: string,
): string | null {
  const matches = Object.entries(context.personNames)
    .filter(([, displayName]) => displayName === name.trim())
    .map(([personId]) => personId);
  return matches.length === 1 ? matches[0]! : null;
}

function namesFromRelationalStem(stem: string): readonly [string, string] | null {
  const patterns = [
    /^How is (.+) related to (.+)\?$/,
    /^What is the exact relation of (.+) to (.+)\?$/,
    /^What is (.+)'s generation position relative to (.+)\?$/,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(stem);
    if (match) return [match[1]!, match[2]!];
  }
  return null;
}

function referenceNameFromIdentifyStem(stem: string): string | null {
  return /^Who is the .+ of (.+)\?$/.exec(stem)?.[1] ?? null;
}

function inferredTarget(
  context: BlrCp003CompetitiveRawContext,
  record: BlrCp003TeacherReviewRecord,
): BlrCp003SvgTargetOverride | null {
  const answer = context.question.answer;
  const answerLabel = record.options[record.correctIndex]?.text ?? "";

  if (
    answer.kind === "CLAIM" &&
    typeof answer.subjectId === "string" &&
    typeof answer.referenceId === "string"
  ) {
    return { subjectId: answer.subjectId, referenceId: answer.referenceId, answerLabel };
  }

  if (answer.kind === "PERSON" && typeof answer.personId === "string") {
    const referenceName = referenceNameFromIdentifyStem(record.stem);
    const referenceId = referenceName ? personIdForName(context, referenceName) : null;
    return referenceId
      ? { subjectId: answer.personId, referenceId, answerLabel }
      : null;
  }

  if (
    answer.kind === "RELATION" ||
    answer.kind === "EXACT_LINEAGE" ||
    answer.kind === "GENERATION" ||
    answer.kind === "GENERATION_DISTANCE"
  ) {
    const names = namesFromRelationalStem(record.stem);
    if (!names) return null;
    const subjectId = personIdForName(context, names[0]);
    const referenceId = personIdForName(context, names[1]);
    return subjectId && referenceId
      ? { subjectId, referenceId, answerLabel }
      : null;
  }

  return null;
}

function gender(value: string): BlrCp003SvgGender {
  if (value === "MALE") return "male";
  if (value === "FEMALE") return "female";
  return "unknown";
}

function edges(graph: FamilyGraph): BlrCp003SvgFamilyTreeEdge[] {
  return [
    ...graph.spouseEdges.map((edge, index) => ({
      id: `marriage-${index}-${edge.personAId}-${edge.personBId}`,
      type: "marriage" as const,
      sourceId: edge.personAId,
      targetId: edge.personBId,
    })),
    ...graph.parentEdges.map((edge, index) => ({
      id: `parent-${index}-${edge.parentId}-${edge.childId}`,
      type: "parent-child" as const,
      sourceId: edge.parentId,
      targetId: edge.childId,
    })),
    ...graph.siblingEdges.map((edge, index) => ({
      id: `sibling-${index}-${edge.personAId}-${edge.personBId}`,
      type: "sibling" as const,
      sourceId: edge.personAId,
      targetId: edge.personBId,
    })),
  ];
}

export function buildBlrCp003SvgFamilyTree(
  context: BlrCp003CompetitiveRawContext,
  record: BlrCp003TeacherReviewRecord,
  targetOverride?: BlrCp003SvgTargetOverride,
): BlrCp003SvgFamilyTreeDiagram {
  const generations = blrCp003VisualGenerationMap(context.reconstructedFamily);
  const target = targetOverride ?? inferredTarget(context, record);
  let pathPersonIds: string[] | undefined;

  if (target) {
    try {
      pathPersonIds = [
        ...solveRelationFromGraph(
          context.reconstructedFamily,
          target.subjectId,
          target.referenceId,
        ).path.personIds,
      ];
    } catch {
      pathPersonIds = [target.subjectId, target.referenceId];
    }
  }

  const nodes = context.reconstructedFamily.persons.map((person) => ({
    id: person.personId,
    label: context.personNames[person.personId] ?? person.name,
    gender: gender(person.gender),
    generation: generations.get(person.personId) ?? 0,
  }));
  const generationCount = new Set(nodes.map((node) => node.generation)).size;
  const pathNames = pathPersonIds?.map(
    (personId) => context.personNames[personId] ?? personId,
  );

  return {
    kind: "blood-relation-family-tree",
    version: 1,
    title: "Blood-relation solution map",
    nodes,
    edges: edges(context.reconstructedFamily),
    ...(target
      ? {
          query: {
            subjectId: target.subjectId,
            referenceId: target.referenceId,
            answerLabel: target.answerLabel,
            ...(pathPersonIds?.length ? { pathPersonIds } : {}),
          },
        }
      : {}),
    accessibleSummary: `Family tree with ${nodes.length} people across ${generationCount} generations.${pathNames?.length ? ` The highlighted answer path is ${pathNames.join(" to ")}.` : ""}`,
    asciiFallback: record.editorial.familyTreeGrid,
  };
}

export { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree-markup-v4";
