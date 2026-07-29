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
  const match = /^Who is the .+ of (.+)\?$/.exec(stem);
  return match?.[1] ?? null;
}

function inferTarget(
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

function diagramGender(gender: string): BlrCp003SvgGender {
  if (gender === "MALE") return "male";
  if (gender === "FEMALE") return "female";
  return "unknown";
}

function graphEdges(graph: FamilyGraph): BlrCp003SvgFamilyTreeEdge[] {
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
  const target = targetOverride ?? inferTarget(context, record);
  let pathPersonIds: string[] | undefined;

  if (target) {
    try {
      pathPersonIds = [...solveRelationFromGraph(
        context.reconstructedFamily,
        target.subjectId,
        target.referenceId,
      ).path.personIds];
    } catch {
      pathPersonIds = [target.subjectId, target.referenceId];
    }
  }

  const nodes = context.reconstructedFamily.persons.map((person) => ({
    id: person.personId,
    label: context.personNames[person.personId] ?? person.name,
    gender: diagramGender(person.gender),
    generation: generations.get(person.personId) ?? 0,
  }));
  const generationCount = new Set(nodes.map((node) => node.generation)).size;
  const highlightedNames = pathPersonIds?.map(
    (personId) => context.personNames[personId] ?? personId,
  );
  const pathSummary = highlightedNames?.length
    ? ` The highlighted answer path is ${highlightedNames.join(" to ")}.`
    : "";

  return {
    kind: "blood-relation-family-tree",
    version: 1,
    title: "Blood-relation solution map",
    nodes,
    edges: graphEdges(context.reconstructedFamily),
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
    accessibleSummary: `Family tree with ${nodes.length} people across ${generationCount} generations.${pathSummary}`,
    asciiFallback: record.editorial.familyTreeGrid,
  };
}

function escapeXml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function palette(gender: BlrCp003SvgGender) {
  if (gender === "male") return { fill: "#eff6ff", stroke: "#60a5fa", badge: "#2563eb", symbol: "♂" };
  if (gender === "female") return { fill: "#fff1f2", stroke: "#fb7185", badge: "#e11d48", symbol: "♀" };
  return { fill: "#f8fafc", stroke: "#94a3b8", badge: "#475569", symbol: "•" };
}

export function renderBlrCp003SvgFamilyTreeMarkup(
  diagram: BlrCp003SvgFamilyTreeDiagram,
): string {
  const levels = [...new Set(diagram.nodes.map((node) => node.generation))].sort(
    (left, right) => right - left,
  );
  const maxPerLevel = Math.max(
    ...levels.map((level) => diagram.nodes.filter((node) => node.generation === level).length),
  );
  const width = Math.max(760, maxPerLevel * 180 + 120);
  const rowGap = 132;
  const cardWidth = 142;
  const cardHeight = 58;
  const top = 74;
  const height = top + Math.max(levels.length - 1, 0) * rowGap + cardHeight + 60;
  const positions = new Map<string, { x: number; y: number }>();

  levels.forEach((level, rowIndex) => {
    const row = diagram.nodes
      .filter((node) => node.generation === level)
      .sort((left, right) => left.label.localeCompare(right.label, "en-IN"));
    const spacing = width / (row.length + 1);
    row.forEach((node, index) => {
      positions.set(node.id, { x: spacing * (index + 1), y: top + rowIndex * rowGap });
    });
  });

  const pathIds = new Set(diagram.query?.pathPersonIds ?? []);
  const bands = levels.map((level, index) => {
    const y = top + index * rowGap - 38;
    const label = level > 0 ? `Generation +${level}` : `Generation ${level}`;
    return `<g><rect x="12" y="${y}" width="${width - 24}" height="${cardHeight + 76}" rx="14" fill="${index % 2 === 0 ? "#ffffff" : "#f8fafc"}" stroke="#e2e8f0"/><text x="28" y="${y + 22}" font-size="11" font-weight="700" fill="#64748b">${escapeXml(label)}</text></g>`;
  }).join("");

  const lineage = diagram.edges
    .filter((edge) => edge.type === "parent-child")
    .map((edge) => {
      const source = positions.get(edge.sourceId);
      const target = positions.get(edge.targetId);
      if (!source || !target) return "";
      const middleY = (source.y + target.y) / 2;
      const highlighted = pathIds.has(edge.sourceId) && pathIds.has(edge.targetId);
      return `<path d="M ${source.x} ${source.y + cardHeight / 2} V ${middleY} H ${target.x} V ${target.y - cardHeight / 2}" fill="none" stroke="${highlighted ? "#4f46e5" : "#64748b"}" stroke-width="${highlighted ? 4 : 2}" stroke-linecap="round"/>`;
    })
    .join("");

  const marriages = diagram.edges
    .filter((edge) => edge.type === "marriage")
    .map((edge) => {
      const source = positions.get(edge.sourceId);
      const target = positions.get(edge.targetId);
      if (!source || !target) return "";
      const left = source.x <= target.x ? source : target;
      const right = source.x <= target.x ? target : source;
      const highlighted = pathIds.has(edge.sourceId) && pathIds.has(edge.targetId);
      return `<line x1="${left.x + cardWidth / 2}" y1="${left.y}" x2="${right.x - cardWidth / 2}" y2="${right.y}" stroke="${highlighted ? "#4f46e5" : "#e11d48"}" stroke-width="${highlighted ? 5 : 3}" stroke-linecap="round"/>`;
    })
    .join("");

  const nodes = diagram.nodes.map((node) => {
    const position = positions.get(node.id)!;
    const colours = palette(node.gender);
    const highlighted = pathIds.has(node.id);
    const subject = diagram.query?.subjectId === node.id;
    const reference = diagram.query?.referenceId === node.id;
    return `<g><rect x="${position.x - cardWidth / 2}" y="${position.y - cardHeight / 2}" width="${cardWidth}" height="${cardHeight}" rx="12" fill="${colours.fill}" stroke="${highlighted ? "#4f46e5" : colours.stroke}" stroke-width="${highlighted ? 4 : 2}"/><circle cx="${position.x - cardWidth / 2 + 22}" cy="${position.y}" r="14" fill="#ffffff" stroke="${colours.stroke}"/><text x="${position.x - cardWidth / 2 + 22}" y="${position.y + 5}" text-anchor="middle" font-size="17" font-weight="700" fill="${colours.badge}">${colours.symbol}</text><text x="${position.x - cardWidth / 2 + 44}" y="${position.y + 5}" font-size="13" font-weight="700" fill="#0f172a">${escapeXml(node.label)}</text>${subject || reference ? `<rect x="${position.x + cardWidth / 2 - 42}" y="${position.y - cardHeight / 2 - 8}" width="40" height="18" rx="9" fill="${subject ? "#4f46e5" : "#0f766e"}"/><text x="${position.x + cardWidth / 2 - 22}" y="${position.y - cardHeight / 2 + 5}" text-anchor="middle" font-size="8" font-weight="700" fill="#ffffff">${subject ? "START" : "TARGET"}</text>` : ""}</g>`;
  }).join("");

  const banner = diagram.query?.answerLabel
    ? `<text x="${width / 2}" y="28" text-anchor="middle" font-size="15" font-weight="700" fill="#3730a3">Answer: ${escapeXml(diagram.query.answerLabel)}</text>`
    : "";

  return `<div class="svg-family-tree"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(diagram.accessibleSummary)}">${banner}${bands}${lineage}${marriages}${nodes}</svg><div class="svg-tree-key"><span>♂ Male</span><span>♀ Female</span><span>━━ Married</span><span>│ Parent–child</span><span>━━ Answer path</span></div></div>`;
}
